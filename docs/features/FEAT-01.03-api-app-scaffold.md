# FEAT-01.03 - Create apps/api with NestJS, Prisma, Swagger, health

## Scope

Create the initial NestJS API scaffold with Swagger, validation, health routing, and Prisma PostgreSQL configuration.

## Non-goals

- Authentication.
- Business domain modules.
- Production database migrations.

## Acceptance Criteria

- `apps/api` exists as a workspace package.
- API has a health endpoint.
- Swagger/OpenAPI is served by the API.
- Prisma is configured for PostgreSQL.
- API product text is not corrupted.

## Affected Modules

- `apps/api`

## Data Changes

- Prisma schema exists, but no application migrations are present.

## API Changes

- Adds `GET /health`.
- Adds Swagger UI at `/docs`.

## Tests

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- API startup smoke check.
