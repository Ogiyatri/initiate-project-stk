# STK Application

Fullstack TypeScript application dengan NestJS (backend) dan Next.js (frontend).

## Tech Stack

- **Backend**: NestJS, TypeORM, PostgreSQL, JWT, Fastify
- **Frontend**: Next.js App Router, Tailwind CSS, shadcn/ui, Zustand, React Query
- **Database**: PostgreSQL
- **Infra**: Docker, Docker Compose

## Project Structure

```
STK/
├── app/
│   ├── backend/   # NestJS API (port 3000)
│   └── frontend/  # Next.js App (port 3001)
└── docs/
```

## Quick Start

### Prerequisites

- Node.js >= 18
- Yarn/Npm
- Docker & Docker Compose

### Backend

```bash
# Install dependencies
cd app/backend && yarn or npm

# Start with Docker (includes PostgreSQL)
# di directory backend (app/backend)
yarn docker:backend:up or npm run docker:backend:up


# di directory frontend (app/frontend)
yarn docker:frontend:up or npm run docker:backend:down

# cukup 2 diatas untuk menjalankan project backend dan frontend

# Run migrations
yarn dc:migration:run or npm run dc:migration:run


# Run seeder (super admin)
yarn dc:seeder:run or npm run dc:seeder:run
```

### Frontend

```bash
cd app/frontend && yarn
yarn dev
```

## Available Accounts

After running seeder:

- **Super Admin**: `admin@stk.id` / `Admin@123`

## API Documentation

Available at `http://localhost:3000/api-docs`
