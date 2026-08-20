# FEAT-06.01 - Learning path and learner dashboard

Status: completed

## Metadata

- [x] Epic: EPIC-06
- [x] Feature: FEAT-06.01
- [x] Date: 2026-08-18

## What Changed

- [x] Added `LessonProgress` and `DailyActivity` models in the Prisma schema.
- [x] Addedcached streak counters and lastActiveDate fields on the `User` model.
- [x] Created progress database migrations and applied them locally.
- [x] Implemented `ContentLearnerController` with read-only published lesson and vocabulary list endpoints.
- [x] Implemented `ProgressService` with transaction-protected lesson completion and streak arithmetic.
- [x] Implemented `ProgressController` exposing overview fetches and lesson completions.
- [x] Registered progress and content learner modules in the API app.
- [x] Added custom stateful client context `AuthProvider` in `apps/web` with automated HttpOnly cookie session rotation.
- [x] Added login, registration, and onboarding landing pages.
- [x] Added responsive Learning Path dashboard showing streak counters and record days.
- [x] Added Lesson Detail view showing vocabulary list cards, romanizations, localized meanings, and lesson completion button.

## Files Changed

- [x] `apps/api/prisma/schema.prisma`
- [x] `apps/api/prisma/migrations/20260818141015_progress_foundation/migration.sql`
- [x] `apps/api/src/app.module.ts`
- [x] `apps/api/src/main.ts`
- [x] `apps/api/src/content/content.module.ts`
- [x] `apps/api/src/content/content.service.ts`
- [x] `apps/api/src/content/content-learner.controller.ts`
- [x] `apps/api/src/progress/progress.module.ts`
- [x] `apps/api/src/progress/progress.service.ts`
- [x] `apps/api/src/progress/progress.controller.ts`
- [x] `apps/api/src/progress/progress.service.spec.ts`
- [x] `apps/api/src/seed.ts`
- [x] `apps/web/app/layout.tsx`
- [x] `apps/web/app/globals.css`
- [x] `apps/web/app/auth-context.tsx`
- [x] `apps/web/app/[locale]/page.tsx`
- [x] `apps/web/app/[locale]/login/page.tsx`
- [x] `apps/web/app/[locale]/register/page.tsx`
- [x] `apps/web/app/[locale]/dashboard/page.tsx`
- [x] `apps/web/app/[locale]/lessons/[slug]/page.tsx`
- [x] `scripts/validate-handoffs.cjs`
- [x] `HANDOFF.md`
- [x] `TODO.md`

## Database/API Impact

- [x] Database: Adds `LessonProgress` and `DailyActivity` tables.
- [x] Database: Adds cached streak values directly to the `User` table.
- [x] API: Adds `GET /api/v1/content/lessons` and `GET /api/v1/content/lessons/:slug`.
- [x] API: Adds `GET /api/v1/progress` and `POST /api/v1/progress/lessons/:lessonId/complete`.

## Tests Run

- [x] Executed custom typescript unit test runner verifying timezone conversions and streak state changes: `pnpm --filter @chamnhatban/api exec ts-node-dev src/progress/progress.service.spec.ts`.
- [x] Full workspace builds, linting, and typechecks passed successfully.
- [x] End-to-end flow verified via Playwright-based browser subagent: verified user registrations, learning path renders, card items loading, logout/login, and completions.

## Decisions and Trade-offs

- [x] Kept streak counter caches on `User` to avoid query overhead on every dashboard load, while keeping `DailyActivity` as the auditable source of truth.
- [x] Maintained Next.js page files server-rendered and structured interaction layers in Client Component contexts.

## Known Issues

- [ ] Integrations for Hiragana and other N5 learning modules remain in separate upcoming epics.

## Exact Next Step

- [ ] Implement Epic 07 (Hiragana module).
