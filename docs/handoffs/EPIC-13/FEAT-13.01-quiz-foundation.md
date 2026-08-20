# FEAT-13.01 - Quiz engine and assessments foundation

Status: completed

## Metadata

- [x] Epic: EPIC-13
- [x] Feature: FEAT-13.01
- [x] Date: 2026-08-20

## What Changed

- Created database models for Quizzes: `Quiz`, `QuizQuestion`, and `QuizAttempt` inside `schema.prisma`.
- Created manual schema migration file: `apps/api/prisma/migrations/20260820150000_quiz_foundation/migration.sql`.
- Added seed database quizzes in `apps/api/src/seed.ts` for Hiragana Row A, Vocabulary Greetings, and Kanji Numbers.
- Implemented Quizzes API module, service, and controller:
  - `GET /api/v1/quizzes/lessons/:lessonId`: Fetches details and questions for the lesson's quiz, securely hiding correct answers and explanations for learners.
  - `POST /api/v1/quizzes/:id/attempt`: Grades student answers server-side, records attempt to `QuizAttempt` table, and if score is >= 80%, marks lesson progress as completed and increments timezone-aware streak/daily activity logs. Returns score, pass/fail status, and explanation notes.
- Updated the Lesson Details page (`apps/web/app/[locale]/lessons/[slug]/page.tsx`) to check for a quiz. If a quiz exists, the direct "Hoàn thành bài học" button is replaced with "Làm bài kiểm tra" linking to the quiz.
- Built step-by-step Quiz MCQ page (`apps/web/app/[locale]/lessons/[slug]/quiz/page.tsx`) with progress tracking bar, active choice cards, scoring banner, pass/fail status badges, detailed question reviews, and try again option.
- Added comprehensive Vanilla CSS styles for quiz components and results screens in `apps/web/app/globals.css`.

## Files Changed

- [x] `apps/api/prisma/schema.prisma` - Appended `Quiz`, `QuizQuestion`, and `QuizAttempt` models and relations
- [x] `apps/api/prisma/migrations/20260820150000_quiz_foundation/migration.sql` - Created Postgres schema migration DDL (**new file**)
- [x] `apps/api/src/seed.ts` - Seeded basic lesson quizzes
- [x] `apps/api/src/quizzes/quizzes.module.ts` - NestJS module (**new file**)
- [x] `apps/api/src/quizzes/quizzes.service.ts` - NestJS service (**new file**)
- [x] `apps/api/src/quizzes/quizzes.controller.ts` - NestJS controller (**new file**)
- [x] `apps/api/src/app.module.ts` - Registered QuizzesModule
- [x] `apps/web/app/[locale]/lessons/[slug]/page.tsx` - Fetch quiz presence and conditional take quiz navigation
- [x] `apps/web/app/[locale]/lessons/[slug]/quiz/page.tsx` - Quiz page (**new file**)
- [x] `apps/web/app/globals.css` - Custom styling classes for quiz elements
- [x] `scripts/validate-handoffs.cjs` - Appended quiz migration path
- [x] `docs/features/FEAT-13.01-quiz-foundation.md` - Feature specification file (**new file**)
- [x] `docs/handoffs/EPIC-13/FEAT-13.01-quiz-foundation.md` - This handoff (**new file**)
- [x] `HANDOFF.md` - Updated status
- [x] `TODO.md` - Updated task list

## Database/API Impact

- Database schema modification: Creates `Quiz`, `QuizQuestion`, and `QuizAttempt` tables and indexes.
- API endpoints: Introduces `/api/v1/quizzes/lessons/:lessonId` and `/api/v1/quizzes/:id/attempt`.

## Tests Run

- [x] pnpm format:check
- [x] pnpm lint
- [x] pnpm typecheck
- [x] pnpm build
- [x] pnpm handoff:validate

## Decisions and Trade-offs

- Evaluated attempt scoring on server-side rather than client-side to enforce integrity and prevent users from tampering with progress completion.
- Reused the `ProgressService.completeLesson` logic so daily activity, streak updates, and SM-2 flashcard creation are automatically triggered.
- Styled using standard Vanilla CSS to align with repository constraints, defining all variables in `globals.css` for simple maintenance.

## Known Issues

- None.

## Exact Next Step

- Start PostgreSQL container (via Docker or local daemon) and run:
  `pnpm --filter @chamnhatban/api exec prisma migrate dev`
  `pnpm --filter @chamnhatban/api exec ts-node-dev --transpile-only src/seed.ts`
- Implement EPIC-14 (Progress tracking and daily activity streak indicators).
