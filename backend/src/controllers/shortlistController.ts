import { Request, Response } from 'express';
import { Car, ShortlistItem } from '../models';

export const getShortlist = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

  const items = await ShortlistItem.findAll({
    where: { sessionId },
    include: [{ model: Car, as: 'car' }],
    order: [['createdAt', 'ASC']]
  });

  return res.json({ data: items.map((item) => item.car).filter(Boolean) });
};

export const addToShortlist = async (req: Request, res: Response) => {
  const { sessionId, carId } = req.body as { sessionId?: string; carId?: number };
  if (!sessionId || !carId) return res.status(400).json({ error: 'sessionId and carId are required' });

  const car = await Car.findByPk(carId);
  if (!car) return res.status(404).json({ error: 'Car not found' });

  await ShortlistItem.findOrCreate({ where: { sessionId, carId }, defaults: { sessionId, carId } });
  return res.status(201).json({ data: car });
};

export const removeFromShortlist = async (req: Request, res: Response) => {
  const { sessionId, carId } = req.params;
  const deleted = await ShortlistItem.destroy({ where: { sessionId, carId: Number(carId) } });
  if (!deleted) return res.status(404).json({ error: 'Shortlist item not found' });
  return res.status(204).send();
};
