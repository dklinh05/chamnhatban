# FEAT-11.01 - Kanji module foundation

## Scope

Implement the N5 Kanji learning module: seed 5 basic N5 Kanji lessons (36 characters total), create a dedicated Kanji hub page at `/kanji` to list these lessons with completion badges, integrate a Kanji section card on the dashboard, and render rich interactive Kanji card layouts on the lesson detail page with Onyomi/Kunyomi readings, meanings, stroke/radical notes, and TTS audio.

## Non-goals

- Writing drawing canvas or stroke order animations (out of MVP scope).
- Kanji flashcards / SRS review (handled under EPIC-12).
- Kanji quizzes (handled under EPIC-13).

## Acceptance Criteria

- **Data Seeding**:
  - Seed 5 Kanji lessons in `apps/api/src/seed.ts` with slugs: `kanji-numbers`, `kanji-nature`, `kanji-directions`, `kanji-people`, `kanji-verbs`.
  - Seeding includes 36 total N5 Kanji as `ContentItem` records of type `KANJI`.
  - Each item includes the Kanji character, Kunyomi/Onyomi readings, Vietnamese/English meanings, stroke count/radical, and sample compound words.
- **Kanji Hub UI**:
  - Create `/[locale]/kanji/page.tsx` displaying the list of seeded Kanji lessons.
  - Show themed emoji, lesson titles, descriptions, and completed status badges.
- **Dashboard UI**:
  - Add a "Chữ Hán N5" progress card linking to `/kanji` showing `completedKanjiCount / 5` lessons finished.
  - Exclude `kanji-` prefix lessons from the main dashboard grammar list.
- **Lesson Detail UI**:
  - Identify `item.type === 'KANJI'` and render a custom styled `kanji-card`.
  - Display the Kanji character in a large, prominent block.
  - Show Onyomi and Kunyomi readings clearly.
  - Display localized meanings (Vietnamese/English).
  - Render radical, stroke count, and example compound words using line breaks.
  - Add a TTS button 🔊 to pronounce the Kanji character.
  - Add back navigation link to `/kanji`.
- **Validations**:
  - `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm handoff:validate` all pass successfully.

## Affected Modules

- `apps/api` (db seed)
- `apps/web` (Kanji hub page, lesson detail cards, dashboard progress card, CSS)
- `docs` (feature spec, handoffs)

## Data Changes

- None (fully utilizes existing `ContentLesson`, `ContentItem`, `LessonProgress` models).

## API Changes

- None (uses existing content and progress endpoints).

## Tests

- Run workspace lint and typecheck.
- Run workspace build to verify compilation of all routes.
- Run handoff validator.
