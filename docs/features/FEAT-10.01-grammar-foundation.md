# FEAT-10.01 - Ngữ pháp N5 foundation

## Scope

Implement the N5 grammar learning module: seed 5 thematic grammar lessons with 3-5 key structures each, display grammar lessons on the dashboard under a dedicated "Ngữ pháp N5" learning path section, and render interactive, readable grammar-specific card layouts on the lesson detail page with TTS audio support.

## Non-goals

- Grammar practice drills (EPIC-10 mentions practice and explanation patterns, which will be covered via grammar card explanations/examples and overall lesson completion).
- Flashcard / SRS review (EPIC-12).
- Quiz engine integration (EPIC-13).
- Kanji module (EPIC-11).

## Acceptance Criteria

- **Data Seeding**:
  - Seed 5 grammar lessons in `apps/api/src/seed.ts` with slugs: `grammar-desu`, `grammar-particles`, `grammar-indicatives`, `grammar-place-particles`, `grammar-requests`.
  - Each lesson contains 3-4 published `ContentItem` records of type `GRAMMAR`.
  - Items contain Japanese grammar pattern, reading (romaji structure), meaning (Vi/En), and detailed explanation/examples in notes.
- **Dashboard UI**:
  - Rename the standard lessons section to "Ngữ pháp N5".
  - Filter and display only lessons with the slug prefix `grammar-`.
  - Show a completion badge/status for each grammar lesson.
- **Lesson Detail UI**:
  - Detect `ContentItem` type `GRAMMAR` and render a dedicated CSS-styled `grammar-card`.
  - Show grammar pattern in large Japanese font, reading structure in smaller font, bold meaning translation, and detailed structured notes (explanation/examples) with preserved line breaks (`white-space: pre-line`).
  - Render a TTS button 🔊 to pronounce the grammar pattern (sourceJa).
  - Add clean CSS classes for grammar cards, pattern headers, meanings, and examples.
- **Validations**:
  - `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm handoff:validate` all pass successfully.

## Affected Modules

- `apps/api` (db seed)
- `apps/web` (grammar cards layout, dashboard grammar filter, CSS)
- `docs` (feature spec, handoffs)

## Data Changes

- None (fully utilizes existing `ContentLesson`, `ContentItem`, `LessonProgress` models).

## API Changes

- None (fully uses existing content and progress endpoints).

## Tests

- Run workspace lint and typecheck.
- Run workspace build to verify compilation of all routes.
- Run handoff validator.
