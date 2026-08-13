# FEAT-04.03 - Add session management and profile basics

## Scope

Implement the security foundation for JWT auth, session management (with refresh token rotation and revocation), and user profile endpoint.

## Non-goals

- Adding email verification logic or forget password delivery email templates.
- Setting up Google OAuth or third-party log-in.
- Adding rate limiting for authentication endpoints (deferred to auth hardening).
- Building the frontend login/register forms or UI views.

## Acceptance Criteria

- All request routes under `/api/v1/*` global prefix.
- Successful register/login returns access token in JSON response body and signs a refresh token.
- Refresh token is returned in a Secure, HttpOnly, SameSite=Lax cookie.
- Every refresh token is stored in the `AuthSession` table hashed using SHA-256 (not plain text).
- `POST /auth/refresh` rotates the refresh token (revokes the old session, issues a new access token, and sets a new refresh token cookie).
- `POST /auth/logout` revokes the refresh token/session and clears the cookie.
- `GET /auth/profile` returns the authenticated user details (email, displayName, role, status, timezone).
- Unauthorized requests to protected routes return 401.

## Affected Modules

- `apps/api`
- `docs`

## Data Changes

Uses `AuthSession` model in Prisma database for managing active sessions. No schema changes are required.

## API Changes

- Added `POST /api/v1/auth/refresh`
- Added `POST /api/v1/auth/logout`
- Added `GET /api/v1/auth/profile`
- Modified `POST /api/v1/auth/register` to return access token and set cookie
- Modified `POST /api/v1/auth/login` to return access token and set cookie

## Tests

- Unit and Integration tests for AuthService, SessionService and AuthController.
- Verify JWT-auth protection on the Profile route.
- Verify refresh token rotation.
