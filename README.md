# VOD Course Platform

A self-hosted MVP for selling recorded video courses: personal brand pages, paid course access, private COS video playback, and an admin backend.

## Stack

- Next.js 16 + TypeScript + Tailwind CSS
- PostgreSQL + Prisma
- Redis for SMS/session-adjacent short-lived state
- Tencent Cloud COS for private MP4 storage
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
npm run backup
npm run db:studio
```

## Backup and restore

Backups include a PostgreSQL custom-format dump plus the local runtime/config files needed for disaster recovery (`.env`, Docker Compose files, Caddyfile, Prisma schema/migrations, package files, and deploy scripts). They are uploaded to Tencent COS.

Required environment variables:

- `TENCENT_SECRET_ID` / `TENCENT_SECRET_KEY`, or backup-specific `BACKUP_COS_SECRET_ID` / `BACKUP_COS_SECRET_KEY`
- `BACKUP_COS_BUCKET`, defaults to `backup-1251741609`
- `BACKUP_COS_REGION`, defaults to `ap-hongkong`
- `BACKUP_COS_PREFIX`, defaults to `vod`
- Optional `BACKUP_POSTGRES_CONTAINER`, defaults to auto-detecting `vod-local-postgres`

Run a manual backup:

```bash
npm run backup
```

Install the nightly 00:10 cron job for this project:

```bash
npm run backup:install-cron
```

Restore is intentionally explicit because it rewrites the database:

```bash
npm run restore:backup -- --latest --download-only
npm run restore:backup -- --latest --confirm
```

Use `--restore-config` to extract backed-up config files under `.backups/restores/<backup-id>/config` for inspection. The restore script does not overwrite live config files automatically.

## Current MVP status

Implemented:

- Public home, about, course list, and course detail pages backed by database course data
- Phone/account plus password login and automatic registration
- Student “my courses” and learning pages reading active entitlements, lessons, and progress
- Admin login/logout protection
- Admin course CRUD and lesson CRUD
- Admin user list and manual course grants
- Admin order/callback listing and learning progress visibility
- Docker-backed PostgreSQL/Redis local runtime with Prisma 7 migration config
- Seed data for one published course, 8 lessons, site content, and an admin account
- COS upload flow with mock mode locally and Tencent COS presigned PUT upload when credentials are configured
- Playback URL authorization with mock media locally and Tencent COS private signed GET URLs when credentials are configured
- Order creation, Weifutong native order request support, signed callback processing, paid order updates, callback logs, and entitlement creation
- Order result page showing mock payment locally or Weifutong `codeUrl/payInfo` in production mode
- Learning progress upsert API for authorized users
- Production Docker Compose profile with Caddy HTTPS reverse proxy template

Still requires real production credentials/config:

- Tencent COS bucket CORS rules allowing browser PUT uploads from the production domain
- Weifutong merchant gateway/notify configuration and real callback testing
- Production domain DNS pointed to the VPS and secure production secrets

## Deployment notes

For the Hong Kong server, install Docker and Docker Compose, clone the repository, then create a production env file from `.env.production.example`:

```bash
cp .env.production.example .env.production
```

Set at minimum:

- `APP_DOMAIN` and `APP_URL` to the public HTTPS domain
- `SESSION_SECRET`, `POSTGRES_PASSWORD`, and `ADMIN_SEED_PASSWORD` to strong random values
- Tencent COS bucket/region/secret variables and bucket CORS for browser PUT uploads
- Weifutong merchant ID/key/gateway and `WEIFUTONG_NOTIFY_URL`

Start production services:

```bash
docker compose -f docker-compose.prod.yml up -d --build postgres redis app caddy
```

Run database migrations and seed inside the app container:

```bash
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
docker compose -f docker-compose.prod.yml exec app npm run db:seed
```

Caddy listens on ports 80/443 and reverse proxies to the app container on port 3000. Point DNS for `APP_DOMAIN` to the VPS public IP before starting Caddy so HTTPS certificates can be issued automatically.

Before release, run:

```bash
npm run lint
npx prisma validate
npm run build
```
