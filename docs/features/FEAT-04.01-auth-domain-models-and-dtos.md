# FEAT-04.01 - Add auth domain and DTOs

## Scope

Define the authentication database foundation and request DTOs needed before registration, login, session refresh, and password reset endpoints are implemented.

## Non-goals

- Implementing registration or login endpoints.
- Implementing password hashing or token issuance.
- Adding web auth forms.
- Adding email delivery.

## Acceptance Criteria

- Prisma schema includes user, session, and password reset token models.
- Prisma migration exists for the auth foundation.
- Refresh tokens and password reset tokens are represented as hashes only.
- User role and status enums exist.
- API has DTOs for register, login, request password reset, and reset password.
- Auth module is registered in the NestJS app.
- Data model documentation records the auth tables and migration note.

## Affected Modules

- `apps/api`
- `docs`
- Repository handoff validation

## Data Changes

- Adds `User`, `AuthSession`, and `PasswordResetToken` tables.
- Adds `UserRole` and `UserStatus` enums.

## API Changes

None. This feature prepares DTOs and the module boundary only.

## Tests

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm handoff:validate`
- `pnpm --filter @chamnhatban/api prisma:generate`
