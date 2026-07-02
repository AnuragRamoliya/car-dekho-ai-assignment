import { BodyType, Car, FuelType } from '../models/car';

export type UseCase = 'city' | 'family' | 'highway' | 'performance' | 'eco';
export type Priority = 'safety' | 'mileage' | 'space' | 'performance' | 'value' | 'automatic';

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

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const efficiency = (car: Car) => {
  if (car.fuelType === 'electric') return clamp((car.rangeKm ?? 0) / 500);
  return clamp((car.mileageKmpl ?? 0) / 30);
};

const budgetScore = (car: Car, budgetMin: number, budgetMax: number) => {
  const overlaps = car.priceMin <= budgetMax && car.priceMax >= budgetMin;
  if (overlaps) return 35;

  const carMid = (car.priceMin + car.priceMax) / 2;
  const budgetMid = (budgetMin + budgetMax) / 2;
  const distance = Math.abs(carMid - budgetMid);
  const tolerance = Math.max(budgetMax - budgetMin, budgetMax * 0.35);
  return 35 * clamp(1 - distance / tolerance);
};

const useCaseScore = (car: Car, useCase: UseCase) => {
  switch (useCase) {
    case 'city':
      return (
        (['hatchback', 'sedan'].includes(car.bodyType) ? 7 : 3) +
        efficiency(car) * 7 +
        (car.transmission === 'automatic' ? 4 : 2) +
        (car.priceMin < 1200000 ? 2 : 0)
      );
    case 'family':
      return (
        (car.seatingCapacity >= 7 ? 6 : 3) +
        (['suv', 'muv'].includes(car.bodyType) ? 5 : 2) +
        (car.safetyRating / 5) * 7 +
        (car.priceMax <= 2000000 ? 2 : 1)
      );
    case 'highway':
      return (car.safetyRating / 5) * 7 + clamp(car.powerBhp / 180) * 6 + efficiency(car) * 4 + (['sedan', 'suv'].includes(car.bodyType) ? 3 : 1);
    case 'performance':
      return clamp(car.powerBhp / 180) * 12 + (car.transmission === 'automatic' ? 4 : 2) + (['sedan', 'suv', 'coupe'].includes(car.bodyType) ? 4 : 1);
    case 'eco':
      return (['electric', 'hybrid', 'cng'].includes(car.fuelType) ? 10 : 3) + efficiency(car) * 10;
  }
};

const fuelScore = (car: Car, fuelPreference: RecommendationInput['fuelPreference']) => {
  if (fuelPreference === 'any') return 10;
  if (car.fuelType === fuelPreference) return 15;
  if (fuelPreference === 'electric' && car.fuelType === 'hybrid') return 8;
  if (fuelPreference === 'hybrid' && ['electric', 'cng'].includes(car.fuelType)) return 6;
  return 0;
};

const bodyScore = (car: Car, bodyTypePreference: RecommendationInput['bodyTypePreference']) => {
  if (bodyTypePreference === 'any') return 7;
  if (car.bodyType === bodyTypePreference) return 10;
  if (bodyTypePreference === 'suv' && car.bodyType === 'muv') return 5;
  if (bodyTypePreference === 'muv' && car.bodyType === 'suv' && car.seatingCapacity >= 7) return 6;
  return 0;
};

const priorityScore = (car: Car, priorities: Priority[]) => {
  const active = priorities.length ? priorities : ['value'];
  const pointsPerPriority = 20 / active.length;

  return active.reduce((total, priority) => {
    let factor = 0;
    if (priority === 'safety') factor = car.safetyRating / 5;
    if (priority === 'mileage') factor = efficiency(car);
    if (priority === 'space') factor = clamp((car.seatingCapacity - 4) / 3) * 0.7 + (['suv', 'muv'].includes(car.bodyType) ? 0.3 : 0);
    if (priority === 'performance') factor = clamp(car.powerBhp / 180);
    if (priority === 'value') factor = clamp((car.safetyRating / 5) * 0.35 + efficiency(car) * 0.35 + (1600000 / Math.max(car.priceMax, 1)) * 0.3);
    if (priority === 'automatic') factor = car.transmission === 'automatic' ? 1 : 0.25;
    return total + pointsPerPriority * clamp(factor);
  }, 0);
};

const reasonsFor = (car: Car, input: RecommendationInput) => {
  const reasons: string[] = [];
  if (car.priceMin <= input.budgetMax && car.priceMax >= input.budgetMin) reasons.push('fits your budget');
  if (input.fuelPreference !== 'any' && car.fuelType === input.fuelPreference) reasons.push(`matches your ${input.fuelPreference} preference`);
  if (input.bodyTypePreference !== 'any' && car.bodyType === input.bodyTypePreference) reasons.push(`has the ${input.bodyTypePreference} body style you asked for`);
  if (input.priorities.includes('safety') && car.safetyRating >= 4) reasons.push(`has a strong ${car.safetyRating}/5 safety rating`);
  if (input.priorities.includes('mileage') && (car.mileageKmpl ?? 0) >= 20) reasons.push(`offers ${car.mileageKmpl} kmpl efficiency`);
  if (input.priorities.includes('mileage') && car.fuelType === 'electric') reasons.push(`offers up to ${car.rangeKm} km range`);
  if (input.priorities.includes('space') && car.seatingCapacity >= 7) reasons.push(`seats ${car.seatingCapacity}`);
  if (input.priorities.includes('performance') && car.powerBhp >= 140) reasons.push(`brings ${car.powerBhp} bhp`);
  if (input.priorities.includes('automatic') && car.transmission === 'automatic') reasons.push('comes with an automatic transmission');

  if (!reasons.length) reasons.push('balances price, practicality, and ownership needs well');
  return reasons.slice(0, 3).join(', ');
};

export const scoreRecommendations = (cars: Car[], input: RecommendationInput): RecommendedCar[] =>
  cars
    .map((car) => {
      const score =
        budgetScore(car, input.budgetMin, input.budgetMax) +
        useCaseScore(car, input.useCase) +
        fuelScore(car, input.fuelPreference) +
        bodyScore(car, input.bodyTypePreference) +
        priorityScore(car, input.priorities);

      return {
        car,
        matchScore: Math.round(clamp(score, 0, 100)),
        matchReason: reasonsFor(car, input)
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
