# FEAT-07.01 - Hiragana module foundation

Status: completed

## Metadata

- [x] Epic: EPIC-07
- [x] Feature: FEAT-07.01
- [x] Date: 2026-08-19

## What Changed

- [x] Created feature specification under `docs/features/FEAT-07.01-hiragana-foundation.md`.
- [x] Added Hiragana row lessons (`hiragana-a`, `hiragana-ka`, `hiragana-sa`, `hiragana-ta`, `hiragana-na`, `hiragana-ha`, `hiragana-ma`, `hiragana-ya`, `hiragana-ra`, `hiragana-wa`) and all 46 basic KANA characters to `apps/api/src/seed.ts`.
- [x] Successfully ran database seed script populating Hiragana characters, examples, and translations.
- [x] Appended beautiful modern styles for the Gojuon visual grid, speech synthesis detail drawers, and interactive row practice screens to `apps/web/app/globals.css`.
- [x] Created Gojuon (Hiragana Chart) page under `apps/web/app/[locale]/hiragana/page.tsx` featuring fundamental, mutation (Dakuon/Handakuon), and contracted (Yoon) tabs, SpeechSynthesis text-to-speech audio, character details drawer, and completion tracking.
- [x] Created interactive Practice page under `apps/web/app/[locale]/lessons/[slug]/practice/page.tsx` that dynamically builds a set of 8 multi-choice and text-input questions for any row, tracks scores with synthesized audio feedback, and updates server-side progress on passing (>=80%).
- [x] Updated Learner Dashboard under `apps/web/app/[locale]/dashboard/page.tsx` to display Hiragana module progress statistics (completed rows) and link directly to the Hiragana Gojuon chart.
- [x] Resolved ESLint TypeScript lint parsing error of browser globals (`fetch`, `alert`, `window`, etc.) by declaring them as `readonly` globals in the root configuration.

## Files Changed

- [x] `eslint.config.js`
- [x] `apps/api/src/seed.ts`
- [x] `apps/web/app/globals.css`
- [x] `apps/web/app/[locale]/dashboard/page.tsx`
- [x] `apps/web/app/[locale]/hiragana/page.tsx`
- [x] `apps/web/app/[locale]/lessons/[slug]/practice/page.tsx`
- [x] `docs/features/FEAT-07.01-hiragana-foundation.md`
- [x] `HANDOFF.md`
- [x] `TODO.md`

## Database/API Impact

- [x] Database: No schema migrations required; reused existing `ContentLesson` and `ContentItem` models.
- [x] Database Content: Seeded 10 published Hiragana row lessons containing 46 characters.
- [x] API: Learner endpoints expose published Hiragana lessons and characters, and completions record correctly through progress routes.

## Tests Run

- [x] Verified full workspace build (`pnpm build`) compiled Next.js production routing bundles successfully.
- [x] Verified linting checks (`pnpm lint` -> `eslint .`) passed clean across all packages.
- [x] Verified code style format check (`pnpm format:check`) passed clean.
- [x] Verified progress streak unit tests (`pnpm --filter @chamnhatban/api exec ts-node-dev src/progress/progress.service.spec.ts`) passed successfully (12 specs, 0 failures).

## Decisions and Trade-offs

- [x] Chose to reuse `ContentLesson` and `ContentItem` (type `KANA`) models instead of adding redundant tables, minimizing schema complexity.
- [x] Used standard HTML5 SpeechSynthesis API for lightweight client-side Japanese audio pronunciation without heavy third-party audio hosting costs.
- [x] Designed client-side dynamic quiz generation within the practice component to handle custom row items flexibly without hardcoding question banks.

## Known Issues

- [ ] Audio synthesis compatibility varies across older mobile browser versions, but falls back gracefully.

## Exact Next Step

- [ ] Implement Epic 08 (Katakana module foundation).
