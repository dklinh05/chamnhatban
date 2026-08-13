# FEAT-01.04 - Bootstrap validation and script repair

Status: partial - scripts and source fixes complete; runtime validation blocked by missing local toolchain

## Metadata

- [x] Epic: EPIC-01
- [x] Feature: FEAT-01.04
- [x] Date: 2026-08-07

## What Changed

- [x] Added root `format:check`, `test:e2e`, and `handoff:validate` scripts.
- [x] Added a local handoff validation script for current EPIC-01 bootstrap artifacts.
- [x] Added a clear no-op E2E script because no E2E suite is scaffolded yet.
- [x] Changed API linting so failures are no longer hidden.
- [x] Replaced the deprecated web package lint command with ESLint for compatibility with current Next.js.
- [x] Fixed corrupted product text in the active web page and API Swagger title.
- [x] Added missing feature specs for FEAT-01.01 through FEAT-01.04.

## Files Changed

- [x] `package.json`
- [x] `apps/api/package.json`
- [x] `apps/api/src/main.ts`
- [x] `apps/web/package.json`
- [x] `apps/web/app/page.tsx`
- [x] `scripts/no-e2e-configured.cjs`
- [x] `scripts/validate-handoffs.cjs`
- [x] `docs/features/FEAT-01.01-scaffold-monorepo.md`
- [x] `docs/features/FEAT-01.02-web-app-scaffold.md`
- [x] `docs/features/FEAT-01.03-api-app-scaffold.md`
- [x] `docs/features/FEAT-01.04-bootstrap-validation-and-script-repair.md`
- [x] `docs/handoffs/EPIC-01/FEAT-01.04-bootstrap-validation-and-script-repair.md`
- [x] `TODO.md`
- [x] `HANDOFF.md`

## Database/API Impact

- [x] Database: none.
- [x] API: no route changes.
- [x] Swagger title text was corrected.

## Tests Run

- [ ] `pnpm install --frozen-lockfile` failed because `pnpm` is not recognized in the current shell.
- [ ] `node --version` failed because `node` is not recognized in the current shell.
- [ ] `corepack --version` failed because `corepack` is not recognized in the current shell.
- [x] `where.exe node` found no Node executable on PATH.
- [x] `where.exe pnpm` found no pnpm executable on PATH.
- [x] Mojibake pattern scan across active app files, root status docs, feature specs, and EPIC-01 handoffs passed after fixes.

## Decisions and Trade-offs

- [x] Kept E2E as an explicit placeholder command instead of adding Playwright before the project is ready for an E2E scaffold.
- [x] Kept the handoff validator small and local to the current bootstrap artifacts.
- [x] Did not mass-rewrite all historical docs with corrupted encoding because that would be a broad content edit outside this bootstrap validation task.

## Known Issues

- [ ] Full `pnpm` validation cannot run until Node.js/Corepack/pnpm are available on PATH.
- [ ] The repo instructions reference `docs/ROADMAP.md`, `docs/templates/FEATURE_SPEC_TEMPLATE.md`, and `docs/templates/HANDOFF_TEMPLATE.md`, but those files are not present.
- [ ] This folder is not currently a Git repository from this shell.

## Exact Next Step

- [ ] Install or expose Node.js and pnpm on PATH.
- [ ] Run `pnpm install --frozen-lockfile`.
- [ ] Run `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e`, and `pnpm handoff:validate`.
