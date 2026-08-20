# FEAT-13.01 - Quiz engine and assessments foundation

## Scope

Build the foundation of the quiz engine, attempt submission, and progress integration.

1. Add `Quiz`, `QuizQuestion`, and `QuizAttempt` models to `schema.prisma` and write Postgres DDL schema migration.
2. Seed the database with N5 quizzes for the basic lessons.
3. Build the Quiz API endpoints:
   - `GET /api/v1/quizzes/lessons/:lessonId`: Retrieve the quiz details and questions for a lesson (excludes `correctOptionIndex` for security).
   - `POST /api/v1/quizzes/:id/attempt`: Submit a quiz attempt with user answers `{ answers: Record<string, number> }`.
     - Evaluate answers server-side, compute percentage score.
     - Record the attempt in `QuizAttempt` table.
     - If the score is passing (>= 80%), call `ProgressService.completeLesson` to mark the lesson as completed and award daily activity/streak.
     - Return scoring summary, question keys, and option details.
4. Build the Quiz UI page in the web app at `/[locale]/lessons/[slug]/quiz`:
   - Step-by-step MCQ layout.
   - Interactive choice buttons with hover feedback.
   - Dynamic progress indicators (e.g. Question X of Y).
   - Score results page: Show score percentage, correct/incorrect badges, question review with explanation, and action links (Retry, Go to Dashboard).
   - Dynamic prompt on the lesson details page to link to the quiz.

## Non-goals

- Audio-based questions.
- Match-the-following or drag-and-drop question layouts (standard MCQ only).
- Admin quiz creation UI (seeded via Prisma).

## Acceptance Criteria

- **Database Schema**:
  - `Quiz`, `QuizQuestion`, and `QuizAttempt` tables added with relations.
  - Unique index `@@unique([userId, quizId])` for attempt constraints or multiple attempts allowed. (Multiple attempts are allowed, but we can index attempts by user and date or let it grow as history log).
- **Quiz API**:
  - `GET /api/v1/quizzes/lessons/:lessonId` returns correct quiz payload (hides correct indices).
  - `POST /api/v1/quizzes/:id/attempt` computes correctness and score percentage server-side.
  - Passing attempt (>= 80%) triggers lesson progress completion and timezone-aware daily activity streak increments.
- **Quiz UI**:
  - Clean question flow, result screen, and retry capability.
  - Spacing and CSS alignment.
- **Validations**:
  - `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm handoff:validate` pass successfully.

## Affected Modules

- `apps/api` (schema, migrations, seed script, quizzes module/service/controller, progress service coupling)
- `apps/web` (Dashboard, Lesson Details page, new Quiz page, CSS styling)

## Data Changes

- New `Quiz`, `QuizQuestion`, and `QuizAttempt` tables.

## API Changes

- `GET /api/v1/quizzes/lessons/:lessonId`
- `POST /api/v1/quizzes/:id/attempt`
