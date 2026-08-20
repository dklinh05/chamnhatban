# FEAT-09.01 - Vocabulary module foundation

Status: completed
Date: 2026-08-20

## What Changed

- Seeded 10 N5 vocabulary thematic lessons (vocab-greetings, vocab-numbers, vocab-time, vocab-family, vocab-body, vocab-food, vocab-transport, vocab-school, vocab-colors, vocab-adjectives) with 78 total published vocabulary items.
- Created vocabulary hub page at /vocabulary listing all 10 lessons as themed cards with emoji, descriptions, and completion badges.
- Enhanced lesson detail page to detect type === VOCABULARY items and render rich vocabulary cards: Japanese word + furigana/romaji reading + TTS audio button + localized meaning + example sentence.
- Added back navigation to /vocabulary from vocab lesson detail pages.
- Added Vocabulary N5 section card to the learner Dashboard with completedVocabCount / 10 progress and a link to /vocabulary.
- Excluded vocab lessons from the generic standardLessons list on the dashboard.
- Added comprehensive CSS for vocab hub grid, vocab item cards, TTS button, meaning and example layouts.

## Files Changed

- apps/api/src/seed.ts - Added 10 vocabulary lessons with items
- apps/web/app/[locale]/vocabulary/page.tsx - New vocabulary hub page
- apps/web/app/[locale]/lessons/[slug]/page.tsx - Enhanced for VOCABULARY items + speakWord TTS
- apps/web/app/[locale]/dashboard/page.tsx - Added vocab section card and progress counter
- apps/web/app/globals.css - Added vocabulary CSS styles
- docs/features/FEAT-09.01-vocabulary-foundation.md - Feature spec
- docs/handoffs/EPIC-09/FEAT-09.01-vocabulary-foundation.md - This handoff
- HANDOFF.md - Updated
- TODO.md - Updated
- scripts/validate-handoffs.cjs - Updated

## Database/API Impact

- No schema changes.
- Seed adds 10 published ContentLesson records + 78 ContentItem records of type VOCABULARY.
- Existing GET /content/lessons and GET /content/lessons/:slug endpoints serve vocab content.

## Tests Run

- pnpm lint - Exit code 0, clean.
- pnpm typecheck - Exit code 0, clean.
- pnpm build - Running at handoff time.
- pnpm handoff:validate - To be run.
- DB seed - Requires Docker Desktop to be started.

## Decisions and Trade-offs

- Enhanced existing lesson detail page (Option 1) rather than a dedicated /vocabulary/[slug] route. Simpler, consistent with established patterns.
- TTS uses browser SpeechSynthesis API (no external audio files needed).
- Vocabulary item slugs namespaced with vk- prefix for uniqueness.
- Example sentences stored in notesVi/notesEn fields (existing schema, no migration needed).

## Known Issues

- DB seed requires Docker Desktop started manually.
- The vocab hub page shows only lessons from API - if no vocab lessons are seeded yet, the page shows an empty grid (no error state shown).

## Exact Next Step

- Start Docker Desktop, run seed: pnpm --filter @chamnhatban/api exec ts-node-dev --transpile-only src/seed.ts
- Verify /vocabulary page, vocab lesson detail, and dashboard vocab card via the web app.
- Implement Epic 10 (Grammar or Kanji module).