# Deployment Runbook

## Hosting Assumptions

- Web: Vercel Hobby or an equivalent low-cost Next.js host.
- API: Docker image deployed to a low-cost container service or small VPS.
- Database: managed PostgreSQL free or low-cost tier during early validation.
- No Redis, queue, object storage, payments, or AI services for MVP.

## Production Environment Variables

### Web

- `NEXT_PUBLIC_API_BASE_URL`: public API base URL, for example `https://api.chamnhatban.com/api/v1`.

### API

- `DATABASE_URL`: PostgreSQL connection string.
- `PORT`: API port provided by the host, default local value is `3333`.
- `NODE_ENV`: `production` in production.
- `CORS_ORIGINS`: comma-separated allowlist of web origins.
- `COOKIE_DOMAIN`: production cookie domain when auth cookies are added.
- `COOKIE_SECURE`: `true` in production.

Auth-specific secrets will be added with the authentication epic, not during EPIC-02.

## Build

Run before release:

```powershell
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm handoff:validate
```

## Migration Procedure

- Review generated Prisma migration SQL before applying it.
- Back up production data before migrations that change existing tables.
- Apply migrations before deploying API code that depends on the new schema.
- Do not use destructive reset commands in production.
- Record migration results in the feature handoff.

No application migrations exist yet.

## Release Procedure

1. Confirm validation commands pass.
2. Confirm required environment variables are configured on the host.
3. Deploy database migrations if the feature includes schema changes.
4. Deploy the API.
5. Deploy the web app.
6. Verify API health.
7. Verify Swagger/OpenAPI endpoint if exposed in the target environment.
8. Smoke test the web app against the production API.

## Health Checks

- Local API health: `http://localhost:3333/health`.
- Production API health: `https://api.chamnhatban.com/health` or host-specific equivalent until domains are final.
- Swagger: `/docs` while the API scaffold exposes it.

## Rollback Notes

- Web rollback: redeploy the previous successful web build.
- API rollback: redeploy the previous successful API image/build.
- Database rollback: prefer forward-fix migrations. Use backups only when data integrity requires restore.
- Never run `prisma migrate reset` in production.

## Current Deployment Status

- Production deployment is not configured.
- No production database is configured.
- No application migrations exist.
- Docker image packaging is not yet implemented.
