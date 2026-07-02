export type BodyType = 'hatchback' | 'sedan' | 'suv' | 'muv' | 'coupe';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng';
export type Transmission = 'manual' | 'automatic';
export type UseCase = 'city' | 'family' | 'highway' | 'performance' | 'eco';
export type Priority = 'safety' | 'mileage' | 'space' | 'performance' | 'value' | 'automatic';

export interface Car {
  id: number;
  make: string;
  model: string;
  variant: string;
  bodyType: BodyType;
  fuelType: FuelType;
  transmission: Transmission;
  priceMin: number;
  priceMax: number;
  mileageKmpl: number | null;
  rangeKm: number | null;
  seatingCapacity: number;
  safetyRating: number;
  engineCc: number | null;
  batteryKwh: number | null;
  powerBhp: number;
  imageUrl: string;
}

export interface RecommendationInput {
  budgetMin: number;
  budgetMax: number;
  useCase: UseCase;
  fuelPreference: FuelType | 'any';
  bodyTypePreference: BodyType | 'any';
  priorities: Priority[];
}

export interface RecommendedCar {
  car: Car;
  matchScore: number;
  matchReason: string;
}
