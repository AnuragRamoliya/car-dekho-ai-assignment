# CarDekho Shortlist

Shortlist is a full-stack car-buying decision tool for a take-home assignment. It moves a confused buyer from broad preferences to a confident set of 3-5 cars through a guided quiz, deterministic recommendations, catalog browsing, and a persisted comparison shortlist.

## What Was Built

- Guided 5-step quiz for budget, use case, fuel preference, body style, and priorities.
- Transparent backend recommendation scorer with a 100-point weighted algorithm.
- Full catalog browsing with search, body/fuel filters, and sorting.
- Persisted shortlist tied to a localStorage session ID, stored in MySQL.
- Side-by-side shortlist comparison table.
- Docker Compose setup with MySQL, backend, and frontend.
- Sequelize CLI migrations and idempotent seeders. No `sequelize.sync()` schema creation.

## Tech Stack

- Backend: Node.js, Express, TypeScript
- Database: MySQL 8, Sequelize, Sequelize CLI
- Frontend: React, TypeScript, Vite
- Styling: Tailwind CSS
- State: Zustand
- Runtime: Docker Compose

The stack follows the assignment requirements directly. Sequelize CLI migrations are the schema source of truth, while runtime models match the migrated table shape.

## Recommendation Algorithm

The scorer is deterministic and lives in `backend/src/services/recommendationService.ts`.

Weights:

- Budget fit: 35 points
- Use case fit: 20 points
- Fuel preference: 15 points
- Body type preference: 10 points
- Priorities: 20 points split across selected priorities

Priorities currently supported:

- Safety
- Mileage or EV range
- Space
- Performance
- Value
- Automatic transmission

Each result includes `matchScore` and `matchReason` so reviewers can see why a car ranked highly.

## Seed Data

The seed contains 32 realistic Indian-market cars across Maruti Suzuki, Hyundai, Tata, Mahindra, Kia, Honda, Toyota, MG, Skoda, and Volkswagen. It includes hatchbacks, sedans, SUVs, MUVs, petrol, diesel, CNG, hybrid, and EV options.

Seed file: `backend/src/seed/cars.json`

## Run Locally

Copy the env example if you want to customize ports:

```bash
cp .env.example .env
```

Start everything:

```bash
docker compose up --build
```

Open:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:4000/api/health`

If local MySQL already uses port `3306`, set `MYSQL_PORT=3307` in `.env`. The backend still connects to the Compose service name `mysql` internally.

## Backend Scripts

From `backend/`:

```bash
npm run build
npm run migrate
npm run seed
npm run db:setup
```

## Frontend Scripts

From `frontend/`:

```bash
npm run build
npm run dev
```

## Verification Performed

Local TypeScript builds passed:

```bash
cd backend && npm run build
cd frontend && npm run build
```

Docker clean run was verified with:

```bash
docker compose down -v
MYSQL_PORT=3307 docker compose up --build -d
```

`MYSQL_PORT=3307` was used only because this machine already had port `3306` occupied.

Backend log evidence:

```text
Database is ready.
== 20260101000100-create-cars: migrated
== 20260101000200-create-shortlist-items: migrated
== 20260101000300-seed-cars: migrated
Shortlist API listening on 4000
```

Restart idempotency was verified:

```text
No migrations were executed, database schema was already up to date.
Cars table already has data; skipping seed.
Shortlist API listening on 4000
```

API checks performed:

```bash
curl http://localhost:4000/api/health
curl http://localhost:4000/api/cars
curl -X POST http://localhost:4000/api/recommend ...
curl -X POST http://localhost:4000/api/shortlist ...
curl http://localhost:4000/api/shortlist/verify-session
curl -X DELETE http://localhost:4000/api/shortlist/verify-session/12
curl http://localhost:5173
```

Confirmed:

- Health returned `{"status":"ok"}`.
- `/api/cars` returned seeded car data.
- `/api/recommend` returned ranked cars with scores and reasons.
- Shortlist add/get/delete worked, including `204` on delete.
- Frontend Vite app served at port `5173`.

## Deployment Notes

Railway is the intended deployment target for this stack:

- Create a MySQL service.
- Create a backend service with the root directory set to `backend`.
- Create a frontend service with the root directory set to `frontend`.
- In Railway, expose each service and let Railway generate a public domain. The services should listen on `PORT`; Railway will assign that automatically.
- Set backend env vars: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `CORS_ORIGIN`.
- Backend start command should run the same sequence as Docker: wait for DB, migrate, seed, start.
- Set `VITE_API_BASE_URL` on the frontend to the deployed backend API URL.
- Set backend `CORS_ORIGIN` to the deployed frontend URL.

Railpack will detect the correct runtime when each Railway service points at the appropriate subdirectory, because the repo now includes service-specific config files in [backend/railway.toml](backend/railway.toml) and [frontend/railway.toml](frontend/railway.toml).

Live deployment was not completed from this environment because no Railway/Render credentials or project access were available.

## Deliberately Cut

- Login/auth
- User accounts
- Dealer contact/payment flow
- Admin panel
- Image uploads
- User review submission
- External LLM recommendation calls

## AI Delegation Notes

Placeholder for assignment reflection:

- What I asked the AI to generate:
- What I reviewed or corrected:
- Where I changed the plan:
- What I would improve with more time:

## Next 4 Hours

- Add 2-3 unit tests around recommendation scoring edge cases.
- Add richer detail pages for individual cars.
- Add price sliders to the browse filters.
- Improve image sourcing with real car photos per model.
- Add Railway deployment files and confirm live smoke tests.
- Add loading and toast states for shortlist actions.
