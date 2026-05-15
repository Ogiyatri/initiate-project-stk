# STK Application

Fullstack TypeScript application dengan NestJS (backend) dan Next.js (frontend).

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Backend** | NestJS 11, TypeORM, PostgreSQL, JWT, Fastify |
| **Frontend** | Next.js 16 (App Router), Tailwind CSS, shadcn/ui, Zustand, React Query |
| **Database** | PostgreSQL 15 |
| **Infra** | Docker, Docker Compose, GitHub Actions |

## Struktur Project

```
STK/
├── app/
│   ├── backend/                 # NestJS API (port 3000)
│   │   ├── src/
│   │   │   ├── auth/            # Modul autentikasi (login, register)
│   │   │   ├── common/          # Guards, interceptors, decorators
│   │   │   ├── config/          # Konfigurasi environment
│   │   │   └── database/        # TypeORM, migration, seeder
│   │   └── build/docker/        # Dockerfile & docker-compose backend
│   └── frontend/                # Next.js App (port 3001)
│       ├── src/
│       │   ├── app/             # Pages (login, register, dashboard)
│       │   ├── components/      # UI components
│       │   ├── domains/         # Business logic & validation schemas
│       │   ├── hooks/           # Custom React hooks
│       │   ├── stores/          # Zustand state management
│       │   └── lib/             # API client, utils
│       └── build/docker/        # Dockerfile & docker-compose frontend
└── .github/workflows/           # CI/CD pipelines
```

---

## Menjalankan Secara Lokal (Tanpa Docker)

### Prerequisites

- **Node.js** >= 18
- **Yarn** >= 1.22
- **PostgreSQL** >= 15 (berjalan di local)

### 1. Clone & Install Dependencies

```bash
git clone <repo-url>
cd STK

# Install semua dependencies sekaligus
yarn install:dependencies

# atau manual per-folder:
cd app/backend && yarn
cd ../frontend && yarn
```

### 2. Setup Database Lokal

Buat database PostgreSQL baru:

```sql
CREATE DATABASE stk_db;
```

### 3. Konfigurasi Environment Backend

```bash
cd app/backend
cp .env.example .env
```

Edit `.env` dan sesuaikan nilai database:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stk_db
DB_USERNAME=postgres      # sesuaikan dengan user PostgreSQL lokal Anda
DB_PASSWORD=postgres      # sesuaikan dengan password PostgreSQL lokal Anda
```

### 4. Konfigurasi Environment Frontend

```bash
cd app/frontend
cp .env.local.example .env.local
```

Isi `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=STK
```

### 5. Jalankan Migration & Seeder

```bash
# Dari folder app/backend
cd app/backend

# Jalankan migration (buat tabel)
yarn migration:run

# Jalankan seeder (buat akun super admin)
yarn seeder:run
```

### 6. Jalankan Aplikasi

Buka **dua terminal** terpisah:

**Terminal 1 — Backend:**
```bash
cd app/backend
yarn start:dev
# API berjalan di http://localhost:3000
# Swagger docs di http://localhost:3000/api-docs
```

**Terminal 2 — Frontend:**
```bash
cd app/frontend
yarn dev
# App berjalan di http://localhost:3001
```

Atau jalankan keduanya dari root dengan satu perintah (membutuhkan `concurrently`):

```bash
# Dari root project
yarn start:backend:dev &
yarn start:frontend:dev
```

---

## Menjalankan Dengan Docker

### Prerequisites

- **Docker** >= 24
- **Docker Compose** >= 2.20

### 1. Clone & Install Dependencies (untuk migration via Docker)

```bash
git clone <repo-url>
cd STK

# Install dependencies backend (dibutuhkan oleh db_prepare container)
cd app/backend && yarn
```

### 2. Jalankan Backend (termasuk PostgreSQL & pgAdmin)

```bash
# Dari root project
yarn docker:backend:up
```

Ini akan menjalankan:
- **app** — NestJS backend (hot reload, port 3000)
- **db** — PostgreSQL 15 (port 5433 di host)
- **pgadmin** — pgAdmin 4 (port 8081)
- **db_prepare** — otomatis menjalankan migration + seeder lalu berhenti

### 3. Jalankan Frontend

```bash
# Dari root project
yarn docker:frontend:up
# Frontend berjalan di http://localhost:3001
```

### 4. Perintah Docker Berguna

```bash
# Melihat log backend
yarn docker:backend:logs

# Menghentikan backend
yarn docker:backend:down

# Menjalankan migration ulang
yarn docker:backend:migration:run

# Menjalankan seeder ulang
yarn docker:backend:seeder:run

# Menghentikan frontend
yarn docker:frontend:down
```

---

## Akun Default (Setelah Seeder)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@stk.id` | `Admin@123` |

> **Penting:** Ganti password setelah login pertama kali.

---

## API Documentation

Swagger UI tersedia di: `http://localhost:3000/api-docs`

### Endpoint Auth

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/v1/auth/register` | Registrasi pengguna baru |
| `POST` | `/v1/auth/login` | Login & mendapatkan JWT token |

---

## Docker Hub

Image otomatis di-push ke Docker Hub via GitHub Actions saat push ke branch `main` atau `develop`.

| Image | Repository |
|-------|------------|
| Backend | `malakiano/stk-backend` |
| Frontend | `malakiano/stk-frontend` |

### Tag yang tersedia

| Tag | Keterangan |
|-----|------------|
| `latest` | Build terbaru dari branch `main` |
| `main` / `develop` | Build dari masing-masing branch |
| `1.2.3` | Versi semantic (dari Git tag `v1.2.3`) |
| `1.2` | Major.Minor dari Git tag |
| `sha-abc1234` | Build spesifik dari commit SHA |

### Cara membuat release dengan versi

```bash
# Buat git tag sesuai semver
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions akan otomatis build dan push image dengan tag `1.0.0`, `1.0`, dan `latest`.

### Menjalankan dari Docker Hub

```bash
# Backend + database
docker run -d \
  -p 3000:3000 \
  --env-file app/backend/build/docker/.env \
  malakiano/stk-backend:latest

# Frontend
docker run -d \
  -p 3001:3001 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:3000 \
  malakiano/stk-frontend:latest
```

---

## Pengembangan

### Generate Migration Baru

```bash
# Lokal
cd app/backend && yarn migration:generate

# Via Docker
yarn docker:backend:migration:generate
```

### Struktur Response API

Semua response API mengikuti format:

```json
{
  "message": "Data created successfully",
  "data": { ... }
}
```

### Environment Variables Lengkap

Lihat [app/backend/.env.example](app/backend/.env.example) dan [app/frontend/.env.local.example](app/frontend/.env.local.example).

---

## CI/CD

GitHub Actions berjalan otomatis untuk setiap push:

| Workflow | Trigger | Jobs |
|----------|---------|------|
| `backend.yml` | Push ke `app/backend/**` | Lint → Test → Build → Docker push |
| `frontend.yml` | Push ke `app/frontend/**` | Lint & Type check → Build → Docker push |

Docker push hanya terjadi saat push ke `main` atau `develop`.

### Secrets yang dibutuhkan di GitHub

| Secret | Keterangan |
|--------|------------|
| `DOCKER_USERNAME` | Username Docker Hub |
| `DOCKER_PASSWORD` | Password / Access Token Docker Hub |

### Variables GitHub (opsional)

| Variable | Default | Keterangan |
|----------|---------|------------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3000` | URL backend untuk build frontend |
