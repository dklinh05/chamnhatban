# FEAT-02.02 - Local environment bootstrap helpers

Status: completed with local runtime validation blocker noted

## Metadata

- [x] Epic: EPIC-02
- [x] Feature: FEAT-02.02
- [x] Date: 2026-08-07

## What Changed

- [x] Added Docker Compose PostgreSQL service for local development.
- [x] Added root `.env.example` for local infrastructure variables.
- [x] Updated `apps/api/.env.example` to match the local PostgreSQL compose credentials.
- [x] Added `pnpm infra:up`, `pnpm infra:down`, and `pnpm infra:status` scripts.
- [x] Added PowerShell helper scripts for local infrastructure.
- [x] Added `docs/LOCAL_DEVELOPMENT.md`.
- [x] Added the FEAT-02.02 feature spec.
- [x] Updated root status and TODO tracking.
- [x] Added ESLint ignores for generated build/cache/dependency output after validation showed `.next` files were being linted.
- [x] Added `.cjs` script lint support with Node/CommonJS globals.
- [x] Removed obsolete Next.js `experimental.appDir` config to clear the Next 16 build warning.
- [x] Removed invalid placeholder Prisma `_Migration` model; Prisma manages migration metadata internally.
- [x] Added Prettier ignore rules for generated build/cache/dependency output.

## Files Changed

- [x] `package.json`
- [x] `.env.example`
- [x] `docker-compose.yml`
- [x] `apps/api/.env.example`
- [x] `apps/api/prisma/schema.prisma`
- [x] `scripts/infra-up.ps1`
- [x] `scripts/infra-down.ps1`
- [x] `scripts/infra-status.ps1`
- [x] `docs/LOCAL_DEVELOPMENT.md`
- [x] `docs/features/FEAT-02.02-local-environment-bootstrap-helpers.md`
- [x] `docs/handoffs/EPIC-02/FEAT-02.02-local-environment-bootstrap-helpers.md`
- [x] `eslint.config.js`
- [x] `apps/web/next.config.js`
- [x] `.prettierignore`
- [x] `scripts/validate-handoffs.cjs`
- [x] `HANDOFF.md`
- [x] `TODO.md`

## Database/API Impact

- [x] Database: local PostgreSQL infrastructure added through Docker Compose.
- [x] Database: no Prisma migration or application model change.
- [x] Database: invalid placeholder migration model removed from Prisma schema.
- [x] API: no route change.
- [x] API env example now points at the local compose PostgreSQL credentials.

## Tests Run

- [x] Static file inspection for Docker Compose service, infra scripts, and docs.
- [x] Attached validation output reviewed: typecheck, test, build, E2E placeholder, and handoff validation passed; lint failed because generated `.next` output and `.cjs` scripts were linted incorrectly.
- [x] `pnpm lint` attempted after ESLint config fix; still blocked in this shell because `pnpm` is not available on PATH.
- [x] `pnpm format:check` initially failed because Prettier checked generated output and existing unformatted files.
- [x] `pnpm format:check` passed in the user's shell after formatting source files and adding `.prettierignore`.
- [x] `pnpm format` ran in the user's shell.
- [x] Direct local Prettier shim invocation could not run in the Codex shell because `node` is not available on PATH.
- [x] `pnpm lint` passed in the user's shell after the ESLint ignore/config fix.
- [x] `pnpm typecheck` passed in the user's shell.
- [x] `pnpm test` passed in the user's shell; no package-level tests are configured yet.
- [x] `pnpm build` passed in the user's shell; all 7 workspace packages built successfully.
- [x] `pnpm test:e2e` passed in the user's shell; current command is the no-op bootstrap placeholder.
- [x] `pnpm handoff:validate` passed in the user's shell.
- [ ] `pnpm prisma db pull --print` failed in the user's shell before this fix because `model _Migration` was invalid Prisma schema.
- [x] `pnpm prisma db pull --print` loaded `DATABASE_URL` and connected to PostgreSQL; Prisma returned P4001 because the database is empty, which is expected before application models/migrations exist.
- [x] `pnpm prisma generate` loaded `.env` and `schema.prisma`; Prisma reported no models are defined, which is expected before application models exist.
- [x] `where.exe docker` found no Docker executable on PATH.
- [x] `docker --version` passed in the user's shell: Docker 29.6.1.
- [x] `pnpm infra:up` passed in the user's shell.
- [x] `pnpm infra:status` passed in the user's shell.
- [x] `chamnhatban_postgres` is running and healthy on port 5432.
- [x] API runtime smoke check passed in the user's browser: `http://localhost:3333/health`.
- [x] Swagger runtime smoke check passed in the user's browser: `http://localhost:3333/docs`.
- [x] `pnpm handoff:validate` could not run in the Codex shell, but passed in the user's shell.

## Decisions and Trade-offs

- [x] Used PostgreSQL only, matching the architecture and avoiding extra services.
- [x] Used a named Docker volume so local data persists across container restarts.
- [x] Kept helpers PowerShell-native for the current Windows development environment.
- [x] Did not add database models or migrations in this infrastructure feature.

## Known Issues

- [ ] Local validation remains blocked until Node.js, Corepack, and pnpm are available on PATH.
- [x] Formatting validation passed after tracked source/config/doc files were formatted.
- [x] Docker validation passed in the user's shell.
- [x] API health and Swagger runtime smoke checks passed in the user's browser.

## Exact Next Step

- [x] Expose Docker on PATH.
- [x] Run `pnpm format` from the user's working shell.
- [x] Re-run `pnpm format:check`.
- [x] Run `pnpm install --frozen-lockfile`.
- [x] Re-run `pnpm prisma db pull --print` from `apps/api`; connection worked and empty database was confirmed.
- [x] Run `pnpm infra:up` and verify PostgreSQL health.
- [x] Start the API and verify `http://localhost:3333/health`.
- [x] Verify Swagger at `http://localhost:3333/docs`.
- [x] Run the full validation command set from `TODO.md`.
