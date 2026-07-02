import { Request, Response } from 'express';
import { Op, Order, WhereOptions } from 'sequelize';
import { Car } from '../models';

export const listCars = async (req: Request, res: Response) => {
  const { search, bodyType, fuelType, minPrice, maxPrice, sortBy } = req.query;
  const where: WhereOptions & Record<PropertyKey, unknown> = {};

  if (typeof search === 'string' && search.trim()) {
    where[Op.or] = [
      { make: { [Op.like]: `%${search.trim()}%` } },
      { model: { [Op.like]: `%${search.trim()}%` } },
      { variant: { [Op.like]: `%${search.trim()}%` } }
    ];
  }
  if (typeof bodyType === 'string' && bodyType !== 'any') where.bodyType = bodyType;
  if (typeof fuelType === 'string' && fuelType !== 'any') where.fuelType = fuelType;
  if (typeof minPrice === 'string' && Number(minPrice)) where.priceMax = { [Op.gte]: Number(minPrice) };
  if (typeof maxPrice === 'string' && Number(maxPrice)) where.priceMin = { [Op.lte]: Number(maxPrice) };

  const orderMap: Record<string, Order> = {
    priceAsc: [['priceMin', 'ASC']],
    priceDesc: [['priceMax', 'DESC']],
    mileage: [['mileageKmpl', 'DESC']],
    safety: [['safetyRating', 'DESC']],
    power: [['powerBhp', 'DESC']]
  };

  const cars = await Car.findAll({
    where,
    order: typeof sortBy === 'string' && orderMap[sortBy] ? orderMap[sortBy] : [['make', 'ASC'], ['model', 'ASC']]
  });
  res.json({ data: cars });
};

export const getCar = async (req: Request, res: Response) => {
  const car = await Car.findByPk(Number(req.params.id));
  if (!car) return res.status(404).json({ error: 'Car not found' });
  return res.json({ data: car });
};
