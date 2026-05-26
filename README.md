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

- Public home, about, course list, and course detail pages
- Student course and learning page shell
- Admin dashboard/course/order/user/content shells
- Prisma schema for users, admins, courses, lessons, media, orders, entitlements, callbacks, and progress
- Database-backed course list/detail query helpers
- API placeholders for SMS login, courses, COS upload token, playback URL, orders, Weifutong callback, progress, and admin grants

Next:

- Run local PostgreSQL migration/seed once a database is available
- Implement admin login
- Replace admin mock views with database CRUD
- Implement real COS direct upload and playback authorization
