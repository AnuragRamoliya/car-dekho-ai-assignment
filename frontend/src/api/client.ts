import { Car, RecommendationInput, RecommendedCar } from '../types/car';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:4000/api' : '/api');

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error ?? 'Request failed');
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};

export interface CarFilters {
  search?: string;
  bodyType?: string;
  fuelType?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export const api = {
  listCars: (filters: CarFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 'any') params.set(key, String(value));
    });
    return request<{ data: Car[] }>(`/cars?${params.toString()}`);
  },
  getCar: (carId: string | number) => request<{ data: Car }>(`/cars/${carId}`),
  getRecommendations: (input: RecommendationInput) =>
    request<{ data: RecommendedCar[] }>('/recommend', {
      method: 'POST',
      body: JSON.stringify(input)
    }),
  getShortlist: (sessionId: string) => request<{ data: Car[] }>(`/shortlist/${sessionId}`),
  addToShortlist: (sessionId: string, carId: number) =>
    request<{ data: Car }>('/shortlist', {
      method: 'POST',
      body: JSON.stringify({ sessionId, carId })
    }),
  removeFromShortlist: (sessionId: string, carId: number) =>
    request<void>(`/shortlist/${sessionId}/${carId}`, { method: 'DELETE' })
};
