import { create } from 'zustand';
import { CarFilters } from '../api/client';

interface FilterState extends CarFilters {
  setFilter: <K extends keyof CarFilters>(key: K, value: CarFilters[K]) => void;
  reset: () => void;
}

const defaults: CarFilters = {
  search: '',
  bodyType: 'any',
  fuelType: 'any',
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: 'priceAsc'
};

export const useFilterStore = create<FilterState>((set) => ({
  ...defaults,
  setFilter: (key, value) => set({ [key]: value }),
  reset: () => set(defaults)
}));
