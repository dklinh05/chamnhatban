# FEAT-02.01 - Improve CI and validation workflow

## Scope

Align GitHub Actions CI with the repository bootstrap validation contract.

## Non-goals

- Adding deployment.
- Adding preview environments.
- Adding a real E2E framework before the app shell exists.
- Changing application runtime behavior.

## Acceptance Criteria

- CI uses Node.js 24.
- CI uses pnpm 11.
- CI installs dependencies with a frozen lockfile.
- CI runs formatting, lint, typecheck, tests, build, E2E placeholder, and handoff validation.
- Root status and TODO tracking move from EPIC-01 to EPIC-02.

## Affected Modules

- GitHub Actions workflow.
- Repository governance documentation.
- Handoff validation script.

## Data Changes

None.

## API Changes

None.

## Tests

- Static workflow inspection.
- `pnpm handoff:validate` once Node.js and pnpm are available on PATH.
