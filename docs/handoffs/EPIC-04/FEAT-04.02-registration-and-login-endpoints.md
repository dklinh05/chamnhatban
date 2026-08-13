# FEAT-04.02 - Add registration and login endpoints

Status: completed with local runtime verification pending

## Metadata

- [x] Epic: EPIC-04
- [x] Feature: FEAT-04.02
- [x] Date: 2026-08-08

## What Changed

- [x] Added `POST /auth/register`.
- [x] Added `POST /auth/login`.
- [x] Added `AuthService` for registration and credential verification.
- [x] Added shared `PrismaModule` and `PrismaService` for API database access.
- [x] Added Argon2id password hashing through `argon2`.
- [x] Added duplicate email handling with a conflict response.
- [x] Added OpenAPI response and request metadata for auth endpoints.
- [x] Added the FEAT-04.02 feature spec.
- [x] Updated EPIC-04, TODO, and root handoff tracking.

## Files Changed

- [x] `apps/api/package.json`
- [x] `pnpm-lock.yaml`
- [x] `pnpm-workspace.yaml`
- [x] `apps/api/src/prisma/prisma.module.ts`
- [x] `apps/api/src/prisma/prisma.service.ts`
- [x] `apps/api/src/auth/auth.controller.ts`
- [x] `apps/api/src/auth/auth.module.ts`
- [x] `apps/api/src/auth/auth.service.ts`
- [x] `apps/api/src/auth/dto/auth-response.dto.ts`
- [x] `apps/api/src/auth/dto/auth-user.dto.ts`
- [x] `apps/api/src/auth/dto/index.ts`
- [x] `apps/api/src/auth/dto/login.dto.ts`
- [x] `apps/api/src/auth/dto/register.dto.ts`
- [x] `docs/features/FEAT-04.02-registration-and-login-endpoints.md`
- [x] `docs/handoffs/EPIC-04/FEAT-04.02-registration-and-login-endpoints.md`
- [x] `docs/epics/EPIC-04-authentication-and-users.md`
- [x] `HANDOFF.md`
- [x] `TODO.md`

## Database/API Impact

- [x] Database: no new schema change beyond FEAT-04.01.
- [x] Database: endpoints require the FEAT-04.01 auth migration to be applied.
- [x] API: adds `POST /auth/register`.
- [x] API: adds `POST /auth/login`.
- [x] API: responses return safe user fields only and do not expose password hashes.

## Tests Run

- [x] `pnpm install` passed after allowing `argon2` build scripts in `pnpm-workspace.yaml`.
- [x] `pnpm --filter @chamnhatban/api typecheck` passed.
- [x] `pnpm --filter @chamnhatban/api build` passed.
- [ ] Full root validation is pending after documentation updates.
- [ ] Local runtime register/login verification is pending because Docker was not running.
- [ ] Prisma migration apply remains pending until local PostgreSQL is available.

## Decisions and Trade-offs

- [x] Kept token issuance and refresh cookie behavior out of FEAT-04.02 because FEAT-04.03 owns session management.
- [x] Lowercased emails before create and lookup to keep account identity stable.
- [x] Added a narrow build-script allowlist entry for `argon2` because it is required for Argon2id password hashing.

## Known Issues

- [ ] `pnpm prisma migrate dev --name auth_foundation` still needs to run from `apps/api` once local Docker/PostgreSQL is available.
- [ ] Register/login endpoints have compile-time validation but still need database-backed runtime verification after migration.
- [ ] Rate limiting is still pending and should be handled with the auth hardening work.
- [ ] Session tokens, refresh flow, cookies, and profile endpoints are deferred to FEAT-04.03.

## Exact Next Step

- [ ] Start Docker Desktop and run `pnpm infra:up` from the repository root.
- [ ] Run `pnpm prisma migrate dev --name auth_foundation` from `apps/api`.
- [ ] Start the API and verify `POST /auth/register` and `POST /auth/login`.
- [ ] Begin FEAT-04.03 session management and profile basics.
