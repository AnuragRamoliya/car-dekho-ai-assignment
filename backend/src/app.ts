import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { env } from './config/env';
import './models';
import { carRoutes } from './routes/carRoutes';
import { recommendationRoutes } from './routes/recommendationRoutes';
import { shortlistRoutes } from './routes/shortlistRoutes';

export const app = express();

app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/cars', carRoutes);
app.use('/api/recommend', recommendationRoutes);
app.use('/api/shortlist', shortlistRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});
