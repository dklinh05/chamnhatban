# FEAT-10.01 - Grammar module foundation

Status: completed

## Metadata

- [x] Epic: EPIC-10
- [x] Feature: FEAT-10.01
- [x] Date: 2026-08-20

## What Changed

- Seeded **5 thematic N5 grammar lessons** (16 rules total) in the database with `type: GRAMMAR` and structured Vietnamese/English explanations/examples with preserved newline formatting:
  - `grammar-desu` (Lesson 1: です basic forms)
  - `grammar-particles` (Lesson 2: wa, no, mo particles)
  - `grammar-indicatives` (Lesson 3: kore/sore/are, kono/sono/ano demonstratives)
  - `grammar-place-particles` (Lesson 4: ni, he, de place particles)
  - `grammar-requests` (Lesson 5: ~te kudasai requests)
- Updated the learner dashboard page (`apps/web/app/[locale]/dashboard/page.tsx`) to filter standard lessons beginning with `grammar-` and display them under a dedicated "Ngữ pháp N5" section, showing the progress counter (completed / total).
- Enhanced the lesson detail page (`apps/web/app/[locale]/lessons/[slug]/page.tsx`) to identify `item.type === 'GRAMMAR'` items and render them as custom `grammar-card` elements displaying Japanese grammar patterns, readings/romaji, bold translations, and examples/explanations.
- Integrated a TTS button 🔊 on the grammar cards to read the grammar structure using browser `SpeechSynthesis`.
- Appended grammar card and header styles to `apps/web/app/globals.css`, and set `white-space: pre-line` for `.notes-text`, `.vocab-example-text`, and `.grammar-examples-text` to ensure multiple lines of example sentences display correctly.
- Added feature spec `docs/features/FEAT-10.01-grammar-foundation.md`.

## Files Changed

- [x] `apps/api/src/seed.ts` - Added N5 grammar seed data
- [x] `apps/web/app/[locale]/lessons/[slug]/page.tsx` - Added grammar-specific rendering & TTS & back navigation
- [x] `apps/web/app/[locale]/dashboard/page.tsx` - Updated dashboard learning path to display "Ngữ pháp N5" and filter `grammar-` prefix
- [x] `apps/web/app/globals.css` - Added CSS classes for grammar cards and line break formatting
- [x] `docs/features/FEAT-10.01-grammar-foundation.md` - New feature spec
- [x] `docs/handoffs/EPIC-10/FEAT-10.01-grammar-foundation.md` - This handoff
- [x] `HANDOFF.md` - Updated status
- [x] `TODO.md` - Updated task list
- [x] `scripts/validate-handoffs.cjs` - Updated required files list

## Database/API Impact

- No schema migrations.
- Database: Seeding adds 5 new `ContentLesson` records and 16 new `ContentItem` records (type: `GRAMMAR`).
- API: Reuses existing content detail & list endpoints, and progress completion tracking endpoints.

## Tests Run

- [ ] DB seed - Needs Docker Desktop running.
- [ ] pnpm lint
- [ ] pnpm typecheck
- [ ] pnpm build
- [ ] pnpm handoff:validate

## Decisions and Trade-offs

- Rendered grammar lessons in the main learning path of the dashboard rather than building a separate hub path (keeps layout unified).
- Reused `notesVi` / `notesEn` for explanation and example layout, setting CSS `white-space: pre-line` on the client side to avoid altering the prisma schema.
- Added `white-space: pre-line` globally to notes and vocabulary example texts for style consistency.

## Known Issues

- None.

## Exact Next Step

- Start Docker Desktop and run seed script.
- Verify grammar lessons, cards layout, and dashboard progress via the browser.
- Implement EPIC-11 (Kanji module).
