import { Router } from 'express';
import { getCar, listCars } from '../controllers/carController';

export const carRoutes = Router();

carRoutes.get('/', listCars);
carRoutes.get('/:id', getCar);
