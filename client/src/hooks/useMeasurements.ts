import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Measurement } from '../types/types';

const fetchMeasurements = async (): Promise<Measurement[]> => {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const from = todayStart.toISOString();

  const response = await axios.get('/api/measurements', {
    params: {
      from,
      limit: 100,
      sort: 'asc',
    },
  });

  return response.data.map((item: any) => ({
    ...item,
    timestamp: new Date(item.timestamp),
  }));
};

export const useMeasurements = () => {
  return useQuery({
    queryKey: ['measurements'],
    queryFn: fetchMeasurements,
    refetchInterval: 60000, 
  });
};