# CarDekho Shortlist - Contributing Guide

Thank you for your interest in contributing to CarDekho Shortlist!

## Project Structure

This is a monorepo containing:

- **backend/** - Node.js/Express API with TypeScript
- **frontend/** - React SPA with TypeScript and Vite
- **docs/** - Project documentation

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker and Docker Compose (for full-stack deployment)
- MySQL 8 (or use Docker)

### Installation

```bash
# Install dependencies for all workspaces
npm install

# Install dependencies for a specific workspace
npm install --workspace=backend
npm install --workspace=frontend
```

### Development

```bash
# Run all services in development mode
npm run dev

# Or run individually
npm --prefix backend run dev
npm --prefix frontend run dev
```

### Building

```bash
# Build all workspaces
npm run build

# Or build individually
npm --prefix backend run build
npm --prefix frontend run build
```

## Docker Development

```bash
# Start all services (MySQL, backend, frontend)
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

## Code Standards

- TypeScript strict mode enabled
- ESLint for linting
- Prettier for formatting

```bash
npm run lint
npm run format
```

## Deployment

### Railway Deployment

1. Create three services in Railway:
   - MySQL database
   - Backend (root directory: `backend`)
   - Frontend (root directory: `frontend`)

2. Set environment variables per service as documented in the main README

### Local Docker Deployment

```bash
MYSQL_PORT=3307 docker compose up --build
```

## Code Review Process

- Create a feature branch
- Submit a pull request
- Ensure all CI checks pass
- Request review from maintainers
- Address feedback
- Merge after approval

## Reporting Issues

Please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, Node version, etc.)

## License

This project is part of a take-home assignment.

Test home