import { Request, Response } from 'express';
import { Car } from '../models';
import { RecommendationInput, scoreRecommendations } from '../services/recommendationService';

const useCases = ['city', 'family', 'highway', 'performance', 'eco'];
const fuels = ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'any'];
const bodies = ['hatchback', 'sedan', 'suv', 'muv', 'coupe', 'any'];
const priorities = ['safety', 'mileage', 'space', 'performance', 'value', 'automatic'];

export const recommendCars = async (req: Request, res: Response) => {
  const input = req.body as Partial<RecommendationInput>;
  if (!Number.isFinite(input.budgetMin) || !Number.isFinite(input.budgetMax)) {
    return res.status(400).json({ error: 'budgetMin and budgetMax are required numbers' });
  }
  if (input.budgetMin! > input.budgetMax!) {
    return res.status(400).json({ error: 'budgetMin must be lower than budgetMax' });
  }
  if (!input.useCase || !useCases.includes(input.useCase)) {
    return res.status(400).json({ error: 'Invalid useCase' });
  }
  if (!input.fuelPreference || !fuels.includes(input.fuelPreference)) {
    return res.status(400).json({ error: 'Invalid fuelPreference' });
  }
  if (!input.bodyTypePreference || !bodies.includes(input.bodyTypePreference)) {
    return res.status(400).json({ error: 'Invalid bodyTypePreference' });
  }

  const cleaned: RecommendationInput = {
    budgetMin: Number(input.budgetMin),
    budgetMax: Number(input.budgetMax),
    useCase: input.useCase,
    fuelPreference: input.fuelPreference,
    bodyTypePreference: input.bodyTypePreference,
    priorities: Array.isArray(input.priorities)
      ? input.priorities.filter((priority) => priorities.includes(priority))
      : []
  };

  const cars = await Car.findAll();
  const recommendations = scoreRecommendations(cars, cleaned).slice(0, 8);
  return res.json({ data: recommendations });
};
