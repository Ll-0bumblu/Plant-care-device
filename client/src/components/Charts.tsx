import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { type Measurement } from '../types/types';

interface ChartProps {
  data: Measurement[];
}

const formatTime = (timestamp: Date) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChartCard: React.FC<{ title: string; dataKey: keyof Measurement; data: Measurement[] }> = ({
  title,
  dataKey,
  data,
}) => {
  const chartData = data.map((item) => ({
    time: formatTime(item.timestamp),
    value: item[dataKey] as number,
  }));

  return (
    <Card sx={{ height: 250, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const Charts: React.FC<ChartProps> = ({ data }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        '& > *': {
          flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(25% - 8px)' },
          minWidth: { xs: '100%', sm: '200px' },
        },
      }}
    >
      <ChartCard title="Температура (°C)" dataKey="temperature" data={data} />
      <ChartCard title="Влажность воздуха (%)" dataKey="humidityAir" data={data} />
      <ChartCard title="Влажность почвы (%)" dataKey="soilMoisture" data={data} />
      <ChartCard title="Освещённость (лк)" dataKey="illuminance" data={data} />
    </Box>
  );
};