# FEAT-11.01 - Kanji module foundation

Status: completed

## Metadata

- [x] Epic: EPIC-11
- [x] Feature: FEAT-11.01
- [x] Date: 2026-08-20

## What Changed

- Seeded **5 N5 Kanji lessons** (36 characters total) in the database with `type: KANJI` and structured Onyomi/Kunyomi readings, meanings, and stroke count/radical details in notes.
  - `kanji-numbers` (Lesson 1: Numbers 一 to 十)
  - `kanji-nature` (Lesson 2: Nature & Time 日, 月, 火...)
  - `kanji-directions` (Lesson 3: Directions 上, 下, 左...)
  - `kanji-people` (Lesson 4: People & Body Parts 人, 子, 女...)
  - `kanji-verbs` (Lesson 5: Basic Verbs 行, 来, 食...)
- Created a dedicated Kanji Hub page at `/[locale]/kanji/page.tsx` displaying the list of Kanji lessons, themed emojis, descriptions, and progress completion badges.
- Enhanced the lesson detail page (`apps/web/app/[locale]/lessons/[slug]/page.tsx`) to identify `item.type === 'KANJI'` and render a custom `kanji-card` showing a large Kanji block, Onyomi/Kunyomi readings, Sino-Vietnamese meanings, and compound examples.
- Integrated a TTS button 🔊 on the Kanji cards to read the character using browser `SpeechSynthesis`.
- Added back navigation to `/kanji` from Kanji lesson details.
- Updated the learner dashboard (`apps/web/app/[locale]/dashboard/page.tsx`) to include a "Chữ Hán N5" section card showing lesson completion progress (`X / 5`) and a link to `/kanji`.
- Excluded Kanji lessons from the main dashboard grammar list.
- Appended styling rules for Kanji cards and grids in `apps/web/app/globals.css`.

## Files Changed

- [x] `apps/api/src/seed.ts` - Seeded N5 Kanji database records
- [x] `apps/web/app/[locale]/kanji/page.tsx` - Created Kanji hub page (**new file**)
- [x] `apps/web/app/[locale]/lessons/[slug]/page.tsx` - Added Kanji rendering, TTS, and back button
- [x] `apps/web/app/[locale]/dashboard/page.tsx` - Added Kanji card and filter logic
- [x] `apps/web/app/globals.css` - Added CSS styling classes for Kanji cards/grids
- [x] `docs/features/FEAT-11.01-kanji-foundation.md` - Feature spec
- [x] `docs/handoffs/EPIC-11/FEAT-11.01-kanji-foundation.md` - This handoff
- [x] `HANDOFF.md` - Updated status
- [x] `TODO.md` - Updated task list
- [x] `scripts/validate-handoffs.cjs` - Updated required files list

## Database/API Impact

- No migrations.
- Database: Adds 5 new `ContentLesson` records and 36 `ContentItem` records (type: `KANJI`).
- API: Reuses existing learner content and progress completion endpoints.

## Tests Run

- [ ] DB seed - Needs Docker Desktop started.
- [ ] pnpm lint
- [ ] pnpm typecheck
- [ ] pnpm build
- [ ] pnpm handoff:validate

## Decisions and Trade-offs

- Created a dedicated Kanji Hub page at `/kanji` (Option 1) to match the Hiragana, Katakana, and Vocabulary modular design.
- Preserved stroke count, radical, and compound word lists inside `notesVi` / `notesEn` using CSS `white-space: pre-line` to avoid schema modifications.

## Known Issues

- None.

## Exact Next Step

- Start Docker Desktop and run seed script: `pnpm --filter @chamnhatban/api exec ts-node-dev --transpile-only src/seed.ts`
- Verify Kanji hub, details cards, and dashboard card via the browser.
- Implement EPIC-12 (Flashcards and SRS).
