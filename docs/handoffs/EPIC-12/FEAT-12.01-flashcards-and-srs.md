# FEAT-12.01 - Flashcards and SRS review module

Status: completed

## Metadata

- [x] Epic: EPIC-12
- [x] Feature: FEAT-12.01
- [x] Date: 2026-08-20

## What Changed

- Created the `Flashcard` model in `schema.prisma` with scheduling fields (`userId`, `itemId`, `interval`, `easeFactor`, `repetitions`, `nextReviewAt`, `lastReviewedAt`) and applied indexes.
- Configured manual migration file: `apps/api/prisma/migrations/20260820120000_flashcards_srs/migration.sql`.
- Wired lesson completion handler in `progress.service.ts` to automatically create initial `Flashcard` records for all published content items in the completed lesson.
- Created `FlashcardsModule`, `FlashcardsService`, and `FlashcardsController` in the API:
  - `GET /api/v1/flashcards/stats`: returns queue counts (due cards, active cards, total cards).
  - `GET /api/v1/flashcards/due`: retrieves due cards list.
  - `POST /api/v1/flashcards/:id/review`: accepts scoring (Again=1, Good=4, Easy=5) and computes spaced repetition via the standard SM-2 algorithm. It also records learner `DailyActivity` and increments streak.
- Registered `FlashcardsModule` in `app.module.ts`.
- Integrated a dynamic prompt card on the learner Dashboard (`/[locale]/dashboard`) to notify the user if cards are due and link them to `/flashcards/review`.
- Developed the flippable Flashcard review session page (`/[locale]/flashcards/review`) with:
  - Flip state transitions.
  - Interactive scoring buttons.
  - Browser SpeechSynthesis TTS audio support.
  - Progress bar.
  - Completion summary panel.
- Appended card animation and button theme styles in `apps/web/app/globals.css`.

## Files Changed

- [x] `apps/api/prisma/schema.prisma` - Appended `Flashcard` model and relationships
- [x] `apps/api/prisma/migrations/20260820120000_flashcards_srs/migration.sql` - Created migration DDL (**new file**)
- [x] `apps/api/src/progress/progress.service.ts` - Integrated flashcard generation and daily activity logging
- [x] `apps/api/src/flashcards/flashcards.module.ts` - Created module (**new file**)
- [x] `apps/api/src/flashcards/flashcards.service.ts` - Created service with SM-2 logic (**new file**)
- [x] `apps/api/src/flashcards/flashcards.controller.ts` - Created controller (**new file**)
- [x] `apps/api/src/app.module.ts` - Registered new module
- [x] `apps/web/app/[locale]/dashboard/page.tsx` - Added due cards prompt card and statistics fetcher
- [x] `apps/web/app/[locale]/flashcards/review/page.tsx` - Created flippable review page (**new file**)
- [x] `apps/web/app/globals.css` - Added CSS transition and layout classes
- [x] `docs/features/FEAT-12.01-flashcards-and-srs.md` - Spec document (**new file**)
- [x] `docs/handoffs/EPIC-12/FEAT-12.01-flashcards-and-srs.md` - This handoff (**new file**)
- [x] `HANDOFF.md` - Updated status
- [x] `TODO.md` - Updated task list
- [x] `scripts/validate-handoffs.cjs` - Appended validation path

## Database/API Impact

- Database schema modification: Creates `Flashcard` table, adds indexes on `userId`, `nextReviewAt`, and a unique constraint on `[userId, itemId]`.
- API endpoints: Introduces `/api/v1/flashcards/stats`, `/api/v1/flashcards/due`, and `/api/v1/flashcards/:id/review`.

## Tests Run

- [ ] DB seed - Needs Docker Desktop started.
- [ ] pnpm lint
- [ ] pnpm typecheck
- [ ] pnpm build
- [ ] pnpm handoff:validate

## Decisions and Trade-offs

- Automatically populated the flashcard review queue on lesson completion instead of requiring manual creation to provide a frictionless onboarding experience.
- Reused `DailyActivity` streak updating mechanisms inside `ProgressService` by introducing a `recordDailyActivity` helper.
- Applied CSS 3D perspectives to enable a premium flippable card animation.

## Known Issues

- None.

## Exact Next Step

- Start Docker Desktop and run:
  `pnpm --filter @chamnhatban/api exec prisma migrate dev`
  `pnpm --filter @chamnhatban/api exec ts-node-dev --transpile-only src/seed.ts`
- Implement EPIC-13 (Quizzes and Assessments module).
