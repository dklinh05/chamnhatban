# FEAT-02.02 - Local environment bootstrap helpers

## Scope

Add local development infrastructure helpers for PostgreSQL and document the local startup workflow.

## Non-goals

- Adding production deployment.
- Adding application database models.
- Running destructive database reset commands.
- Adding Redis, queues, or other services.

## Acceptance Criteria

- Docker Compose defines a local PostgreSQL service.
- Root scripts can start, stop, and inspect local infrastructure.
- Local environment variables are documented.
- API database URL example matches local PostgreSQL.
- Local development documentation explains startup and validation.

## Affected Modules

- Root workspace scripts.
- Local Docker Compose infrastructure.
- API environment example.
- Documentation and handoff validation.

## Data Changes

- Adds a local Docker named volume for PostgreSQL data.
- No Prisma migration or application schema change.

## API Changes

None.

## Tests

- Static Docker Compose inspection.
- Static script inspection.
- Local Docker runtime check once Docker, Node.js, and pnpm are available on PATH.
