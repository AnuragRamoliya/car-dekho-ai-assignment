# Environment Setup

## Local Development with Docker

### Quick Start

```bash
# Install root dependencies
npm install

# Start all services
npm run docker:up

# Access the app
# Frontend: http://localhost:5173
# Backend: http://localhost:4000/api
# MySQL: localhost:3306 (or 3307 if already in use)
```

### Using Custom Ports

```bash
# If port 3306 is already in use
MYSQL_PORT=3307 npm run docker:up
```

### View Logs

```bash
npm run docker:logs

# Or specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

### Stop Services

```bash
npm run docker:down
```

## Environment Variables

### Backend

Create `backend/.env` or set via Railway:

```env
NODE_ENV=production
PORT=4000
DB_HOST=mysql
DB_PORT=3306
DB_NAME=cardekho_shortlist
DB_USER=cardekho
DB_PASSWORD=cardekho_password
CORS_ORIGIN=http://localhost:5173
```

### Frontend

Create `frontend/.env.local` or set via Railway:

```env
VITE_API_BASE_URL=http://localhost:4000/api
PORT=4173
```

## Railway Deployment

### Prerequisites

1. Railway account
2. GitHub repository connected
3. MySQL database service

### Service Setup

#### Backend Service

1. Create new service from repository
2. Set root directory to `backend`
3. Add environment variables:
   - `DB_HOST` - MySQL host
   - `DB_PORT` - MySQL port
   - `DB_NAME` - Database name
   - `DB_USER` - Database user
   - `DB_PASSWORD` - Database password
   - `CORS_ORIGIN` - Frontend URL (e.g., https://your-frontend.up.railway.app)
   - `NODE_ENV=production`

#### Frontend Service

1. Create new service from repository
2. Set root directory to `frontend`
3. Add environment variables:
   - `VITE_API_BASE_URL` - Backend API URL (e.g., https://your-backend.up.railway.app/api)
   - `PORT` - (auto-assigned by Railway, but set to match)

### Connecting Services

1. Get backend public domain from Railway
2. Set `CORS_ORIGIN` on backend to frontend domain
3. Set `VITE_API_BASE_URL` on frontend to backend domain

## Troubleshooting

### Port Already in Use

```bash
# Linux/Mac
lsof -i :4000
lsof -i :5173
lsof -i :3306

# Windows
netstat -ano | findstr :4000
```

### Docker Issues

```bash
# Clean build
docker compose down -v
docker compose up --build

# Rebuild images
docker compose build --no-cache
```

### Database Connection Errors

```bash
# Check MySQL is healthy
docker compose logs mysql

# Verify credentials in backend/.env
docker compose logs backend
```

### API Errors

```bash
# Test backend health
curl http://localhost:4000/api/health

# Check CORS headers
curl -H "Origin: http://localhost:5173" http://localhost:4000/api/health
```
