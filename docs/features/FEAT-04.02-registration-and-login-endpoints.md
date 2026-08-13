# FEAT-04.02 - Add registration and login endpoints

## Scope

Implement the API endpoints needed for email/password account creation and sign-in.

## Non-goals

- Implementing refresh token rotation or cookie-backed sessions.
- Implementing password reset delivery.
- Adding web auth forms.
- Adding rate limiting.

## Acceptance Criteria

- API exposes `POST /auth/register`.
- API exposes `POST /auth/login`.
- Passwords are hashed with Argon2id before storage.
- Login verifies submitted passwords against the stored Argon2id hash.
- Duplicate registration returns a conflict response.
- Auth responses do not expose password hashes or token hashes.
- OpenAPI documents the auth endpoints.

## Affected Modules

- `apps/api`
- `docs`

## Data Changes

No new schema changes beyond FEAT-04.01. The endpoints depend on the FEAT-04.01 auth migration.

## API Changes

- Adds `POST /auth/register`.
- Adds `POST /auth/login`.

## Tests

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm handoff:validate`
