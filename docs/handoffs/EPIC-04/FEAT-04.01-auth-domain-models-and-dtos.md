# FEAT-04.01 - Add auth domain and DTOs

Status: completed

## Metadata

- [x] Epic: EPIC-04
- [x] Feature: FEAT-04.01
- [x] Date: 2026-08-07

## What Changed

- [x] Added Prisma auth enums and models for users, sessions, and password reset tokens.
- [x] Added an auth foundation migration.
- [x] Added NestJS auth module boundary.
- [x] Added request DTOs for register, login, request password reset, and reset password.
- [x] Added auth data model documentation.
- [x] Added the FEAT-04.01 feature spec.
- [x] Updated root status and TODO tracking.
- [x] Updated handoff validation requirements.

## Files Changed

- [x] `apps/api/prisma/schema.prisma`
- [x] `apps/api/prisma/migrations/20260807000000_auth_foundation/migration.sql`
- [x] `apps/api/src/app.module.ts`
- [x] `apps/api/src/auth/auth.module.ts`
- [x] `apps/api/src/auth/dto/login.dto.ts`
- [x] `apps/api/src/auth/dto/register.dto.ts`
- [x] `apps/api/src/auth/dto/request-password-reset.dto.ts`
- [x] `apps/api/src/auth/dto/reset-password.dto.ts`
- [x] `apps/api/src/auth/dto/index.ts`
- [x] `docs/DATA_MODEL.md`
- [x] `docs/features/FEAT-04.01-auth-domain-models-and-dtos.md`
- [x] `docs/handoffs/EPIC-04/FEAT-04.01-auth-domain-models-and-dtos.md`
- [x] `scripts/validate-handoffs.cjs`
- [x] `HANDOFF.md`
- [x] `TODO.md`

## Database/API Impact

- [x] Database: adds `User`, `AuthSession`, and `PasswordResetToken` tables.
- [x] Database: adds `UserRole` and `UserStatus` enums.
- [x] API: no runtime endpoints added in this feature.

## Tests Run

- [x] Static source inspection completed.
- [x] `pnpm format:check` passed.
- [x] `pnpm lint` passed.
- [x] `pnpm typecheck` passed.
- [x] `pnpm test` passed with the scaffold message: no package-level tests configured.
- [x] `pnpm build` passed; all 7 workspace packages built successfully.
- [x] `pnpm test:e2e` passed with the scaffold message: no E2E suite configured yet.
- [x] `pnpm handoff:validate` passed.
- [x] `pnpm --filter @chamnhatban/api prisma:generate` passed.
- [x] `pnpm prisma validate` passed from `apps/api`.
- [ ] `pnpm prisma migrate dev --name auth_foundation --skip-generate` did not complete because the local PostgreSQL connection failed during migration engine execution.
- [ ] `pnpm prisma db pull --print` returned `P1000 Authentication failed` for the local PostgreSQL credentials.

## Decisions and Trade-offs

- [x] Kept FEAT-04.01 as a schema and DTO foundation only, so endpoint behavior can be implemented cleanly in FEAT-04.02.
- [x] Stored refresh and reset tokens as hash fields only.
- [x] Used the existing NestJS validation stack instead of adding new dependencies.

## Known Issues

- [ ] Local migration application is still pending because Prisma could not authenticate to the local PostgreSQL database.
- [ ] Auth endpoints, password hashing, token issuance, cookie handling, and rate limiting are intentionally deferred to FEAT-04.02 and FEAT-04.03.

## Exact Next Step

- [ ] Fix or recreate the local PostgreSQL credentials/container state, then run `pnpm prisma migrate dev --name auth_foundation` from `apps/api`.
- [ ] Start FEAT-04.02: registration and login endpoints with Argon2id password hashing.
