import { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useMeasurements } from '../hooks/useMeasurements';
import { useSettingsStore } from '../store/settingsStore';
import { Charts } from '../components/Charts';
import { SettingsDrawer } from '../components/SettingsDrawer';
import type { Measurement } from '../types/types';

const getDailyMax = (data: Measurement[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayData = data.filter((item) => new Date(item.timestamp) >= today);

  if (todayData.length === 0) return null;

  return {
    temperature: Math.max(...todayData.map((d) => d.temperature)),
    humidityAir: Math.max(...todayData.map((d) => d.humidityAir)),
    soilMoisture: Math.max(...todayData.map((d) => d.soilMoisture)),
    illuminance: Math.max(...todayData.map((d) => d.illuminance)),
  };
};

const checkThresholds = (
  lastMeasurement: Measurement | undefined,
  thresholds: any
) => {
  if (!lastMeasurement) return null;
  const violations: string[] = [];
  const { temperature, humidityAir, soilMoisture, illuminance } = lastMeasurement;

  if (temperature < thresholds.temperature.min || temperature > thresholds.temperature.max) {
    violations.push(`Температура ${temperature.toFixed(1)}°C (норма ${thresholds.temperature.min}-${thresholds.temperature.max})`);
  }
  if (humidityAir < thresholds.humidityAir.min || humidityAir > thresholds.humidityAir.max) {
    violations.push(`Влажность воздуха ${humidityAir.toFixed(1)}% (норма ${thresholds.humidityAir.min}-${thresholds.humidityAir.max})`);
  }
  if (soilMoisture < thresholds.soilMoisture.min || soilMoisture > thresholds.soilMoisture.max) {
    violations.push(`Влажность почвы ${soilMoisture.toFixed(1)}% (норма ${thresholds.soilMoisture.min}-${thresholds.soilMoisture.max})`);
  }
  if (illuminance < thresholds.illuminance.min || illuminance > thresholds.illuminance.max) {
    violations.push(`Освещённость ${illuminance.toFixed(0)} лк (норма ${thresholds.illuminance.min}-${thresholds.illuminance.max})`);
  }

  return violations.length > 0 ? violations : null;
};

export const Main = () => {
  const { data, isLoading, error } = useMeasurements();
  const { photo, thresholds } = useSettingsStore();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const lastMeasurement = data && data.length > 0 ? data[data.length - 1] : undefined;
  const dailyMax = data ? getDailyMax(data) : null;

  useEffect(() => {
    if (lastMeasurement) {
      const violations = checkThresholds(lastMeasurement, thresholds);
      if (violations) {
        setNotificationMessage(`Превышение нормы: ${violations.join('; ')}`);
        setSnackbarOpen(true);
      } else {
        setSnackbarOpen(false);
      }
    }
  }, [data, thresholds]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Мой сад 🌱
          </Typography>
          <SettingsDrawer />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {isLoading && <Typography>Загрузка данных...</Typography>}
        {error && <Typography color="error">Ошибка загрузки данных</Typography>}

        {data && (
          <>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    flex: { md: '0 0 25%' },
                    width: { xs: '100%', md: 'auto' },
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Avatar
                    src={photo || undefined}
                    sx={{ width: 200, height: 200 }}
                    variant="rounded"
                  >
                    {!photo && '🌿'}
                  </Avatar>
                </Box>

                <Box sx={{ flex: { md: '1 1 75%' }, width: { xs: '100%', md: 'auto' } }}>
                  <Typography variant="h5" gutterBottom>
                    Показатели за сегодня (максимумы)
                  </Typography>
                  {dailyMax ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        justifyContent: { xs: 'center', md: 'flex-start' },
                      }}
                    >
                      <Card sx={{ flex: '1 1 150px', minWidth: 120 }}>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Температура
                          </Typography>
                          <Typography variant="h5">{dailyMax.temperature.toFixed(1)}°C</Typography>
                        </CardContent>
                      </Card>
                      <Card sx={{ flex: '1 1 150px', minWidth: 120 }}>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Влажность воздуха
                          </Typography>
                          <Typography variant="h5">{dailyMax.humidityAir.toFixed(1)}%</Typography>
                        </CardContent>
                      </Card>
                      <Card sx={{ flex: '1 1 150px', minWidth: 120 }}>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Влажность почвы
                          </Typography>
                          <Typography variant="h5">{dailyMax.soilMoisture.toFixed(1)}%</Typography>
                        </CardContent>
                      </Card>
                      <Card sx={{ flex: '1 1 150px', minWidth: 120 }}>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Освещённость
                          </Typography>
                          <Typography variant="h5">{dailyMax.illuminance.toFixed(0)} лк</Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  ) : (
                    <Typography>Нет данных за сегодня</Typography>
                  )}
                </Box>
              </Box>
            </Paper>

            <Typography variant="h5" gutterBottom>
              Динамика за день
            </Typography>
            <Charts data={data} />
          </>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
            {notificationMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};