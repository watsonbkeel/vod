# VOD Course Platform

A self-hosted MVP for selling recorded video courses: personal brand pages, paid course access, private COS video playback, and an admin backend.

## Stack

- Next.js 16 + TypeScript + Tailwind CSS
- PostgreSQL + Prisma
- Redis for SMS/session-adjacent short-lived state
- Tencent Cloud COS for private MP4 storage
- Tencent Cloud SMS for phone verification
- Weifutong for WeChat/Alipay payments

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Start PostgreSQL and Redis.

If Docker is available:

```bash
docker compose up -d postgres redis
```

If Docker is not available, install/start PostgreSQL and Redis yourself, then update `DATABASE_URL` and `REDIS_URL` in `.env`.

4. Generate Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

Open http://localhost:3000.

## Useful scripts

```bash
npm run lint
npx prisma validate
npm run build
npm run db:studio
```

## Current MVP status

Implemented:

- Public home, about, course list, and course detail pages backed by database course data
- Student “my courses” and learning pages reading active entitlements, lessons, and progress
- Admin login/logout protection
- Admin course CRUD and lesson CRUD
- Admin user list and manual course grants
- Docker-backed PostgreSQL/Redis local runtime with Prisma 7 migration config
- Seed data for one published course, 8 lessons, site content, and an admin account
- COS upload metadata flow that creates pending `MediaAsset` records and returns mock/COS upload metadata
- Playback URL authorization that checks login, active entitlement, published lesson/course state, and uploaded media
- Order creation, signed Weifutong-style callback processing, paid order updates, callback logs, and entitlement creation
- Learning progress upsert API for authorized users

Still requires real production credentials/config:

- Tencent Cloud SMS sending implementation and template IDs
- Tencent COS STS/pre-signed direct upload and private read URL signing
- Weifutong real unified-order request fields and merchant callback configuration
- Production domain, HTTPS reverse proxy, and secure production secrets

## Deployment notes

For the Hong Kong server, install Docker and Docker Compose, clone the repository, then create a production `.env` from `.env.example` with strong secrets and real third-party credentials.

```bash
cp .env.example .env
npm install
npm run db:generate
```

Start database services and run migrations/seed:

```bash
docker compose up -d postgres redis
npm run db:migrate
npm run db:seed
```

Run the app with Docker Compose:

```bash
docker compose up -d --build app
```

For production, point Nginx/Caddy at `127.0.0.1:3000`, enable HTTPS, and set `APP_URL` plus Weifutong notify URL to the public HTTPS domain.

Before release, run:

```bash
npm run lint
npx prisma validate
npm run build
```
