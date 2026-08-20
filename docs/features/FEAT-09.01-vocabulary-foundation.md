# FEAT-09.01 - Vocabulary module foundation

## Scope

Implement the N5 vocabulary learning module: seed 10 thematic vocabulary lessons, build a
vocabulary hub page at /vocabulary, and render vocabulary-specific item cards with TTS
audio on the existing lesson detail page.

## Non-goals

- Flashcard / SRS review (EPIC-12).
- Quiz engine (EPIC-13).
- Grammar or Kanji modules.
- Audio file hosting - browser SpeechSynthesis only.
- A dedicated vocabulary practice drill (KANA-style quiz not applicable here).

## Acceptance Criteria

- Seed: 10 vocabulary lessons with slugs vocab-greetings, vocab-numbers, vocab-time,
  vocab-family, vocab-body, vocab-food, vocab-transport, vocab-school,
  vocab-colors, vocab-adjectives.
- Each lesson has 7-10 published ContentItem records of type VOCABULARY.
- /[locale]/vocabulary lists all 10 lessons with themed cards and completion badges.
- Lesson detail page at /[locale]/lessons/[slug] detects VOCABULARY items and renders
  a rich card: Japanese text, reading (furigana/romaji), Vi/En meaning, example sentence,
  TTS audio button.
- Dashboard shows a Vocabulary N5 card with completedVocabCount / 10 and a link to /vocabulary.
- pnpm lint, pnpm typecheck, pnpm build, and pnpm handoff:validate all pass.

## Affected Modules

- apps/api (seed only)
- apps/web (vocabulary hub page, lesson detail enhancement, dashboard, CSS)
- docs (feature spec, handoff)

## Data Changes

- None (uses existing ContentLesson, ContentItem, LessonProgress, DailyActivity).

## API Changes

- None (uses existing GET /content/lessons, GET /content/lessons/:slug, POST /progress/lessons/:id/complete).

## Tests

- Run pnpm lint and pnpm typecheck.
- Run pnpm build to confirm Next.js compiles the new route.
- Run pnpm handoff:validate.
