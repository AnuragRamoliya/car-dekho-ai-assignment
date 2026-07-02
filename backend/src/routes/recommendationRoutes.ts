import { Router } from 'express';
import { recommendCars } from '../controllers/recommendationController';

export const recommendationRoutes = Router();

recommendationRoutes.post('/', recommendCars);
