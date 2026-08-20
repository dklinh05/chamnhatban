# FEAT-12.01 - Flashcards and SRS review module

## Scope

Implement spaced-repetition flashcards and review scheduling for N5 learners.
1. Add `Flashcard` table in `schema.prisma` and a migration.
2. Automate flashcard generation: when a learner completes a lesson (Vocabulary, Kanji, or Kana), automatically create `Flashcard` records for all published items in that lesson.
3. Build the Flashcard Review API:
   - `GET /api/v1/flashcards/due`: Fetch cards due for review (where `nextReviewAt <= now`), including the corresponding content item details.
   - `GET /api/v1/flashcards/stats`: Fetch review queue counts (total due, active cards, total cards).
   - `POST /api/v1/flashcards/:id/review`: Submit a card review:
     - Input quality score: 1 (Again), 4 (Good), 5 (Easy).
     - Calculate next `interval`, `easeFactor`, `repetitions`, and `nextReviewAt` using the SM-2 algorithm.
     - Record a daily activity streak if not already recorded today.
4. Build the Flashcard UI in the web app:
   - Dashboard card: Show review counts (e.g. `X thẻ cần ôn tập`) and a button to start reviewing.
   - Review Session page at `/[locale]/flashcards/review`:
     - Renders a flashcard container with a flip animation (front showing Japanese word/character, back showing readings, meanings, notes/examples, and audio TTS).
     - Buttons: Again (Học lại), Good (Nhớ tốt), Easy (Rất dễ).
     - Success summary view after completing all due cards.

## Non-goals

- Custom manual card creation by learners (cards are generated automatically from studied lessons).
- Editing or deleting cards by learners.
- Audio recordings (using browser TTS SpeechSynthesis).
- Quiz integration with flashcards.

## Acceptance Criteria

- **Database Model**:
  - Add `Flashcard` model to `schema.prisma` with `userId`, `itemId`, `interval`, `easeFactor`, `repetitions`, `nextReviewAt`, and relation mappings.
  - Create standard Prisma migration.
- **Review API**:
  - `GET /api/v1/flashcards/due` returns array of due flashcards with linked `ContentItem`.
  - `POST /api/v1/flashcards/:id/review` accepts `{ score: 1 | 4 | 5 }` and runs SM-2 calculations.
  - Submitting a review marks `DailyActivity` and increments streak.
- **Dashboard Review Card**:
  - Displays due count and links to the review session.
- **Review UI**:
  - Flippable card component (Front: sourceJa; Back: reading, translation, notes, speak button).
  - Score buttons: Again (red), Good (blue/green), Easy (purple).
  - SM-2 logic updates the card status and triggers daily activity.
- **Validations**:
  - `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm handoff:validate` pass cleanly.

## Affected Modules

- `apps/api` (Prisma schema, migration, flashcard controller, flashcard service, content/progress connection)
- `apps/web` (Dashboard review card, `/flashcards/review` page, CSS styling)
- `docs` (feature spec, handoffs)

## Data Changes

- New `Flashcard` model.

## API Changes

- `GET /api/v1/flashcards/due`
- `GET /api/v1/flashcards/stats`
- `POST /api/v1/flashcards/:id/review`

## Tests

- Run workspace lint and typecheck.
- Run workspace build.
- Run handoff validator.
