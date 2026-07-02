import { Router } from 'express';
import { addToShortlist, getShortlist, removeFromShortlist } from '../controllers/shortlistController';

export const shortlistRoutes = Router();

shortlistRoutes.get('/:sessionId', getShortlist);
shortlistRoutes.post('/', addToShortlist);
shortlistRoutes.delete('/:sessionId/:carId', removeFromShortlist);
