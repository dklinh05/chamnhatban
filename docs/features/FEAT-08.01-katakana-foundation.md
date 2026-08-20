# FEAT-08.01 - Katakana lessons, practice, and progression

## Scope

Implement the Katakana learning foundation, Gojuon chart layout, and interactive client-side practice drills.

## Non-goals

- Vocabulary or Grammar modules (EPIC-09, EPIC-10).
- Real voice-over recordings (browser SpeechSynthesis or placeholder sounds will be used).
- Full stroke writing recognition/drawing canvas.

## Acceptance Criteria

- Data seeding: Add 10 row lessons (A, Ka, Sa, Ta, Na, Ha, Ma, Ya, Ra, Wa/N) with all 46 basic characters as `ContentItem` records with type `KANA`.
- Gojuon Chart UI:
  - Renders all 46 basic Katakana characters in a standard responsive layout under `/katakana`.
  - Interactive cards show detailed pronunciation tips, Romaji, and common word examples in a modal/drawer.
  - Visual indicator (e.g. green border or tick mark) for characters whose rows/lessons have been completed.
- Row Practice UI:
  - Renders at least 8 dynamic randomized questions for each row (Katakana-to-Romaji, Romaji-to-Katakana) by reusing the client-side practice component at `/lessons/[slug]/practice`.
  - Multi-choice and typed inputs.
  - Immediate visual feedback (correct/incorrect states with sound effects).
  - Completion updates database progress (`POST /api/v1/progress/lessons/:id/complete`) and increments streak.

## Affected Modules

- `apps/api` (db seed)
- `apps/web` (Katakana grid chart, practice UI route compatibility, dashboard integration)
- `docs` (feature spec)

## Data Changes

- None (fully uses existing `ContentLesson`, `ContentItem`, `LessonProgress`, `DailyActivity` models).

## API Changes

- None (fully uses learner `GET /content/lessons`, `GET /content/lessons/:slug`, and `/progress` endpoints).

## Tests

- Run API unit tests.
- Run workspace-wide typecheck and linting commands.
- Run handoff validation check.
