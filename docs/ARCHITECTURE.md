# CarDekho Shortlist - Architecture

## Overview

CarDekho Shortlist is a full-stack car recommendation and comparison platform built as a monorepo with independent frontend and backend services.

## Services

### Backend (Node.js + Express + TypeScript)

- **Port:** 4000 (local), `PORT` env (Railway)
- **Database:** MySQL 8
- **ORM:** Sequelize with CLI migrations
- **Key Endpoints:**
  - `GET /api/health` - Health check
  - `GET /api/cars` - List cars with filters
  - `GET /api/cars/:id` - Car details
  - `POST /api/recommend` - Get recommendations
  - `POST /api/shortlist` - Add to shortlist
  - `GET /api/shortlist/:sessionId` - Get shortlist
  - `DELETE /api/shortlist/:sessionId/:carId` - Remove from shortlist

### Frontend (React + TypeScript + Vite)

- **Port:** 5173 (local), 4173 (Docker), `PORT` env (Railway)
- **Build Tool:** Vite
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **Runtime Server:** Node.js with API proxy

## Data Flow

```
Browser
  ↓
Frontend (Vite SPA) → server.js (proxy)
  ↓
/api/* routes proxied to Backend
  ↓
Backend (Express API)
  ↓
MySQL Database
```

## Recommendation Algorithm

Located in `backend/src/services/recommendationService.ts`

**Scoring:** 100-point system
- Budget fit: 35 points
- Use case fit: 20 points
- Fuel preference: 15 points
- Body type: 10 points
- Priorities: 20 points

## Database Schema

### Cars Table
- id, name, manufacturer, price, bodyType, fuelType, transmission, specs...

### ShortlistItems Table
- sessionId, carId, addedAt (persists user selections across sessions)

## Environment Configuration

**Backend (.env or Railway)**
- NODE_ENV
- PORT
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- CORS_ORIGIN

**Frontend (.env.local or Railway)**
- VITE_API_BASE_URL (production)
- PORT (Railway)

## Deployment Architecture

### Local Development
```
docker compose up --build
├─ MySQL
├─ Backend (4000)
└─ Frontend (5173→4173)
```

### Railway Production
```
Railway Services
├─ MySQL (managed)
├─ Backend Service
│  └─ Root: backend/
└─ Frontend Service
   └─ Root: frontend/
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Zustand |
| API | Express.js 4, TypeScript, CORS, Node 20 |
| Database | MySQL 8, Sequelize CLI migrations |
| DevOps | Docker, Docker Compose, Railway |
| Quality | ESLint, Prettier |
