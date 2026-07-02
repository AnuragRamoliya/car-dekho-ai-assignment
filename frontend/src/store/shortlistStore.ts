import { create } from 'zustand';
import { api } from '../api/client';
import { Car } from '../types/car';

const getSessionId = () => {
  const key = 'shortlist_session_id';
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  localStorage.setItem(key, created);
  return created;
};

interface ShortlistState {
  sessionId: string;
  cars: Car[];
  loading: boolean;
  load: () => Promise<void>;
  add: (carId: number) => Promise<void>;
  remove: (carId: number) => Promise<void>;
  isShortlisted: (carId: number) => boolean;
}

export const useShortlistStore = create<ShortlistState>((set, get) => ({
  sessionId: getSessionId(),
  cars: [],
  loading: false,
  load: async () => {
    set({ loading: true });
    const response = await api.getShortlist(get().sessionId);
    set({ cars: response.data, loading: false });
  },
  add: async (carId) => {
    await api.addToShortlist(get().sessionId, carId);
    await get().load();
  },
  remove: async (carId) => {
    await api.removeFromShortlist(get().sessionId, carId);
    set((state) => ({ cars: state.cars.filter((car) => car.id !== carId) }));
  },
  isShortlisted: (carId) => get().cars.some((car) => car.id === carId)
}));
