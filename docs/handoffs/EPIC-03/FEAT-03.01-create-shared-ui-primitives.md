# FEAT-03.01 - Create shared UI primitives

Status: completed

## Metadata

- [x] Epic: EPIC-03
- [x] Feature: FEAT-03.01
- [x] Date: 2026-08-07

## What Changed

- [x] Added a typed `Heading` primitive to `@chamnhatban/ui`.
- [x] Wired `@chamnhatban/ui` into the web app dependencies.
- [x] Pointed the private UI workspace package entry to source so Next transpiles the current primitive instead of stale `dist` output.
- [x] Configured Next.js to transpile `@chamnhatban/ui`.
- [x] Updated the web home page to use the shared `Heading` primitive.
- [x] Fixed active web page product text to `Chạm Nhật Bản`.
- [x] Added `@types/react` to `@chamnhatban/ui` after validation showed missing React type declarations.
- [x] Ignored generated `next-env.d.ts` in Prettier after validation showed it was the remaining format warning.
- [x] Added the FEAT-03.01 feature spec.
- [x] Updated root status and TODO tracking.
- [x] Updated handoff validation requirements.

## Files Changed

- [x] `packages/ui/src/index.tsx`
- [x] `packages/ui/package.json`
- [x] `apps/web/package.json`
- [x] `apps/web/next.config.js`
- [x] `apps/web/app/page.tsx`
- [x] `.prettierignore`
- [x] `docs/features/FEAT-03.01-create-shared-ui-primitives.md`
- [x] `docs/handoffs/EPIC-03/FEAT-03.01-create-shared-ui-primitives.md`
- [x] `scripts/validate-handoffs.cjs`
- [x] `HANDOFF.md`
- [x] `TODO.md`

## Database/API Impact

- [x] Database: none.
- [x] API: none.

## Tests Run

- [x] Static source inspection completed.
- [x] `pnpm install` completed in the user's shell with pnpm 11.3.0.
- [x] `pnpm format:check` initially failed because Prettier checked generated `apps/web/next-env.d.ts`.
- [x] `pnpm format:check` passed after `.prettierignore` was updated.
- [x] `pnpm lint` passed in the user's shell.
- [x] `pnpm typecheck` initially failed because `@chamnhatban/ui` did not declare `@types/react`.
- [x] `pnpm typecheck` passed after `@types/react` was added.
- [x] `pnpm build` initially failed because `@chamnhatban/ui` did not declare `@types/react`.
- [x] `pnpm build` passed after `@types/react` was added; all 7 workspace packages built successfully.
- [x] `pnpm handoff:validate` passed in the user's shell.

## Decisions and Trade-offs

- [x] Kept the first primitive minimal so it can be safely expanded with design tokens in FEAT-03.03.
- [x] Used a Server Component-compatible primitive with no browser APIs or local state.
- [x] Did not introduce a styling library in this feature.
- [x] Added React types to the UI package dev dependencies because the package compiles TSX directly.

## Known Issues

- [x] Validation passed from the user's working shell after the fixes.
- [ ] User-facing web copy is still temporary scaffold copy until FEAT-03.02 i18n structure is added.

## Exact Next Step

- [x] Run `pnpm install`, then `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm handoff:validate`.
- [ ] Move to FEAT-03.02 i18n structure and locale routing.
