import React, { useState, useRef } from 'react';
import {
  Drawer,
  Box,
  Button,
  Typography,
  Divider,
  TextField,
  IconButton,
  Avatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSettingsStore } from '../store/settingsStore';

export const SettingsDrawer = () => {
  const [open, setOpen] = useState(false);
  const { photo, thresholds, setPhoto, setThresholds } = useSettingsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localThresholds, setLocalThresholds] = useState(thresholds);

  const handleToggle = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhoto(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    setThresholds(localThresholds);
    setOpen(false);
  };

  const handleChange = (key: keyof typeof thresholds, field: 'min' | 'max', value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    setLocalThresholds((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: num,
      },
    }));
  };

  const labelMap: Record<string, string> = {
    temperature: 'Температура (°C)',
    humidityAir: 'Влажность воздуха (%)',
    soilMoisture: 'Влажность почвы (%)',
    illuminance: 'Освещённость (лк)',
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleToggle(true)}>
        Настройки
      </Button>
      <Drawer anchor="right" open={open} onClose={handleToggle(false)}>
        <Box sx={{ width: { xs: '100%', sm: 380 }, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Настройки</Typography>
            <IconButton onClick={handleToggle(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            Фото растения
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <Avatar
              src={photo || undefined}
              sx={{ width: 80, height: 80 }}
              variant="rounded"
            >
              {!photo && '📷'}
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
              id="photo-upload"
            />
            <label htmlFor="photo-upload">
              <Button variant="outlined" component="span">
                Загрузить
              </Button>
            </label>
            {photo && (
              <Button variant="outlined" color="error" onClick={handleRemovePhoto}>
                Удалить
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            Допустимые диапазоны
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              flex: 1,
              overflowY: 'auto',
            }}
          >
            {Object.entries(localThresholds).map(([key, value]) => (
              <Box key={key}>
                <Typography variant="body2" gutterBottom>
                  {labelMap[key]}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    label="Мин"
                    type="number"
                    value={value.min}
                    onChange={(e) =>
                      handleChange(key as keyof typeof thresholds, 'min', e.target.value)
                    }
                    sx={{ flex: '1 1 100px' }}
                  />
                  <TextField
                    size="small"
                    label="Макс"
                    type="number"
                    value={value.max}
                    onChange={(e) =>
                      handleChange(key as keyof typeof thresholds, 'max', e.target.value)
                    }
                    sx={{ flex: '1 1 100px' }}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Button variant="contained" fullWidth onClick={handleSave}>
              Сохранить
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};