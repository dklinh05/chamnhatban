# Local Development

## Required Tools

- Node.js 24
- pnpm 11
- Docker Desktop or another Docker Compose compatible runtime

## Environment Files

- Root `.env.example` documents shared local infrastructure variables.
- `apps/api/.env.example` documents the API runtime variables.
- Copy `apps/api/.env.example` to `apps/api/.env` before starting the API locally.

## Local PostgreSQL

Start PostgreSQL:

```powershell
pnpm infra:up
```

Check status:

```powershell
pnpm infra:status
```

Stop local infrastructure:

```powershell
pnpm infra:down
```

The local database URL is:

```text
postgresql://chamnhatban:chamnhatban_dev_password@localhost:5432/chamnhatban?schema=public
```

## Validation

After Node.js and pnpm are available on PATH, run:

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

## API Startup Smoke Check

1. Start PostgreSQL with `pnpm infra:up`.
2. Copy `apps/api/.env.example` to `apps/api/.env`.
3. Run the API with the package script once pnpm is available.
4. Check `http://localhost:3333/health`.
5. Check `http://localhost:3333/docs`.
