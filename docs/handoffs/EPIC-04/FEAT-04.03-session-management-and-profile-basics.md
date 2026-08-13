# FEAT-04.03 - Add session management and profile basics

Status: completed

## Metadata

- [x] Epic: EPIC-04
- [x] Feature: FEAT-04.03
- [x] Date: 2026-08-13

## What Changed

- [x] Added JWT configuration and validation schema in ConfigModule (`JWT_SECRET`, `JWT_REFRESH_SECRET`).
- [x] Added `JwtStrategy` and `JwtAuthGuard` for protecting authenticated endpoints.
- [x] Added `SessionService` to manage active user sessions in the `AuthSession` table, using SHA-256 to hash refresh tokens.
- [x] Integrated refresh token rotation with security reuse detection (revoking all user sessions if a token is reused).
- [x] Updated `POST /auth/register` and `POST /auth/login` to return an access token in the response body and set a rotated refresh token in a Secure, HttpOnly cookie.
- [x] Added `POST /auth/refresh` endpoint to rotate the refresh token and return a new access token.
- [x] Added `POST /auth/logout` endpoint to revoke the session and clear the cookie.
- [x] Added `GET /auth/profile` protected by `JwtAuthGuard` to return current user details.
- [x] Set global prefix `api/v1` in `main.ts` for all endpoints.
- [x] Added `cookie-parser` middleware and `@types/express` to the API.

## Files Changed

- [x] `apps/api/package.json`
- [x] `pnpm-lock.yaml`
- [x] `apps/api/src/app.module.ts`
- [x] `apps/api/src/main.ts`
- [x] `apps/api/src/auth/auth.module.ts`
- [x] `apps/api/src/auth/auth.controller.ts`
- [x] `apps/api/src/auth/auth.service.ts`
- [x] `apps/api/src/auth/session.service.ts`
- [x] `apps/api/src/auth/config/jwt.config.ts`
- [x] `apps/api/src/auth/strategies/jwt.strategy.ts`
- [x] `apps/api/src/auth/guards/jwt-auth.guard.ts`
- [x] `apps/api/src/auth/dto/index.ts`
- [x] `apps/api/src/auth/dto/auth-response.dto.ts`
- [x] `apps/api/src/auth/dto/auth-login-response.dto.ts`
- [x] `docs/features/FEAT-04.03-session-management-and-profile-basics.md`
- [x] `docs/handoffs/EPIC-04/FEAT-04.03-session-management-and-profile-basics.md`
- [x] `docs/epics/EPIC-04-authentication-and-users.md`
- [x] `docs/DATA_MODEL.md`
- [x] `HANDOFF.md`
- [x] `TODO.md`
- [x] `.env`
- [x] `.env.example`
- [x] `apps/api/.env`
- [x] `apps/api/.env.example`

## Database/API Impact

- [x] Database: uses the `AuthSession` model to store revocable sessions.
- [x] API: all endpoints are now prefixed with `/api/v1`.
- [x] API: added `POST /api/v1/auth/refresh`.
- [x] API: added `POST /api/v1/auth/logout`.
- [x] API: added `GET /api/v1/auth/profile`.
- [x] API: updated `POST /api/v1/auth/register` and `POST /api/v1/auth/login` to set `refreshToken` cookie and return `accessToken`.

## Tests Run

- [x] Checked database connectivity and applied `auth_foundation` migration.
- [x] Ran native integration endpoint validation using a local scratch script.
- [x] Built the entire monorepo workspace: `pnpm build` passed successfully.
- [x] Checked formatting: `pnpm format` ran and `pnpm format:check` passed.
- [x] Checked linting: `pnpm lint` passed with 0 errors/warnings.

## Decisions and Trade-offs

- [x] Kept access tokens in-memory in the web frontend and returned them via the response body, while keeping refresh tokens in HttpOnly Secure Lax cookies.
- [x] Implemented cryptographically secure random string generation for refresh tokens, storing their SHA-256 hashes in PostgreSQL to protect against token leakage/exposure.
- [x] Added global `api/v1` prefix to conform with the target architecture, shifting the entry paths of all API endpoints.

## Known Issues

- [ ] Rate limiting is still pending and should be handled under auth hardening (planned for a later Epic).

## Exact Next Step

- [ ] Transition to Epic 05: Content domain and CMS foundation.
- [ ] Create `docs/features/FEAT-05.01-...` spec file.
