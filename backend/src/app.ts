import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { env } from './config/env';
import './models';
import { carRoutes } from './routes/carRoutes';
import { recommendationRoutes } from './routes/recommendationRoutes';
import { shortlistRoutes } from './routes/shortlistRoutes';

export const app = express();

const allowedOrigins = (env.corsOrigin === '*' ? ['*'] : env.corsOrigin.split(',').map((origin) => origin.trim()).filter(Boolean));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*')) {
        callback(null, true);
        return;
      }

      const isLocalhost = /localhost|127\.0\.0\.1/.test(origin);
      const isRailwayDomain = /\.railway\.app$/i.test(origin) || /\.up\.railway\.app$/i.test(origin);

      if (isLocalhost || isRailwayDomain || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'));
    }
  })
);
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
