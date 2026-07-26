import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Thresholds = {
  temperature: { min: number; max: number };
  humidityAir: { min: number; max: number };
  soilMoisture: { min: number; max: number };
  illuminance: { min: number; max: number };
};

interface SettingsStore {
  photo: string | null;
  thresholds: Thresholds;
  setPhoto: (photo: string | null) => void;
  setThresholds: (thresholds: Thresholds) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      photo: null,
      thresholds: {
        temperature: { min: 10, max: 30 },
        humidityAir: { min: 30, max: 80 },
        soilMoisture: { min: 20, max: 60 },
        illuminance: { min: 100, max: 1000 },
      },
      setPhoto: (photo) => set({ photo }),
      setThresholds: (thresholds) => set({ thresholds }),
    }),
    {
      name: 'plant-settings',
    }
  )
);