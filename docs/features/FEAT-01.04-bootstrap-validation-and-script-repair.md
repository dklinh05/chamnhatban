# FEAT-01.04 - Bootstrap validation and script repair

## Scope

Make the bootstrap validation commands explicit, repair known script gaps, and fix corrupted product text in active app files.

## Non-goals

- Adding product functionality.
- Introducing new test frameworks.
- Rewriting all historical planning documents.

## Acceptance Criteria

- Root package exposes `format:check`, `test:e2e`, and `handoff:validate`.
- Package lint scripts fail when linting fails.
- The web and API bootstrap product strings render as `Chạm Nhật Bản`.
- Validation blockers are documented honestly.

## Affected Modules

- Root workspace scripts.
- `apps/web`
- `apps/api`
- Documentation and handoff tracking.

## Data Changes

None.

## API Changes

None.

## Tests

- `where.exe node`
- `where.exe pnpm`
- `pnpm install --frozen-lockfile`
- `rg` scan for corrupted strings in active bootstrap files
