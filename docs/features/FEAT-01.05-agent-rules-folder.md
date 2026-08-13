# FEAT-01.05 - Agent rules folder

## Scope

Create a dedicated `.agents/` folder that mirrors the repository agent operating rules and makes the handoff requirement easy to find.

## Non-goals

- Changing the canonical root `AGENTS.md` behavior.
- Adding new agent automation.
- Changing feature implementation rules beyond documenting the folder.

## Acceptance Criteria

- `.agents/AGENTS.md` exists with the repository agent rules.
- `.agents/README.md` explains the purpose of the folder.
- The handoff requirement remains explicit.
- Root status and TODO tracking mention the new governance artifact.
- Rendering guidance is explicit: server-first Next.js App Router by default,
  with Client Components only for interaction-heavy UI.

## Affected Modules

- Repository governance documentation.
- Handoff validation script.
- Architecture documentation.

## Data Changes

None.

## API Changes

None.

## Tests

- File existence check for `.agents/AGENTS.md` and `.agents/README.md`.
- Text scan for the handoff rule in `.agents`.
- `pnpm handoff:validate` once Node.js and pnpm are available on PATH.
