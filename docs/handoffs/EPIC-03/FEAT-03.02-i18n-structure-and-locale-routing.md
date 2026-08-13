# FEAT-03.02 - Add i18n structure and locale routing

Status: completed

## Metadata

- [x] Epic: EPIC-03
- [x] Feature: FEAT-03.02
- [x] Date: 2026-08-07

## What Changed

- [x] Added shared locale definitions for `vi`, `en`, and `ja`.
- [x] Added default locale `vi`.
- [x] Added typed home page message keys and message dictionaries.
- [x] Added root web redirect from `/` to `/vi`.
- [x] Added locale home route at `/{locale}`.
- [x] Added static params for supported locales.
- [x] Added invalid locale handling through `notFound`.
- [x] Updated the locale home page to read display text from i18n messages.
- [x] Kept seed messages ASCII-safe to avoid encoding corruption in the current Windows shell.
- [x] Added the FEAT-03.02 feature spec.
- [x] Updated root status and TODO tracking.
- [x] Updated handoff validation requirements.

## Files Changed

- [x] `packages/i18n/package.json`
- [x] `packages/i18n/src/index.ts`
- [x] `apps/web/package.json`
- [x] `apps/web/next.config.js`
- [x] `apps/web/app/page.tsx`
- [x] `apps/web/app/[locale]/page.tsx`
- [x] `docs/features/FEAT-03.02-i18n-structure-and-locale-routing.md`
- [x] `docs/handoffs/EPIC-03/FEAT-03.02-i18n-structure-and-locale-routing.md`
- [x] `scripts/validate-handoffs.cjs`
- [x] `HANDOFF.md`
- [x] `TODO.md`

## Database/API Impact

- [x] Database: none.
- [x] API: none.

## Tests Run

- [x] Static source inspection completed.
- [x] `pnpm install` completed in the user's shell with pnpm 11.3.0.
- [x] `pnpm format:check` passed in the user's shell.
- [x] `pnpm lint` passed in the user's shell.
- [x] `pnpm typecheck` passed in the user's shell.
- [x] `pnpm build` passed in the user's shell; all 7 workspace packages built successfully.
- [x] `pnpm handoff:validate` passed in the user's shell.

## Decisions and Trade-offs

- [x] Kept i18n server-first and framework-light for the initial foundation.
- [x] Kept message dictionaries in `@chamnhatban/i18n` so web and future mobile can share locale keys.
- [x] Used ASCII-safe seed copy until the repo-wide encoding issue is cleaned up.
- [x] Did not add a locale switcher until design tokens/layout patterns are in place.

## Known Issues

- [x] Validation passed from the user's working shell.
- [ ] User-facing copy is still minimal scaffold copy.

## Exact Next Step

- [x] Run `pnpm install`, then `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm handoff:validate`.
- [ ] Move to FEAT-03.03 design tokens and styling foundation.
