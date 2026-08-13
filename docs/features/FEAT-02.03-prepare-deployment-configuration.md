# FEAT-02.03 - Prepare deployment configuration

## Scope

Document production deployment configuration, environment variables, migration procedure, health checks, and rollback notes for the low-cost MVP path.

## Non-goals

- Performing a production deployment.
- Adding secrets to the repository.
- Adding payment, AI, Redis, queues, or object storage.
- Creating application database models or migrations.

## Acceptance Criteria

- Production environment variables are documented.
- Deployment runbook explains build, migration, release, health check, and rollback flow.
- Hosting assumptions stay low-cost and web-first.
- API and database deployment notes preserve the NestJS modular monolith and PostgreSQL/Prisma decisions.
- Root handoff and TODO tracking move to FEAT-02.03.

## Affected Modules

- Deployment documentation.
- Repository governance documentation.
- Handoff validation script.

## Data Changes

None.

## API Changes

None.

## Tests

- Static documentation inspection.
- `pnpm handoff:validate` after validator update.
