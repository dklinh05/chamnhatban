# FEAT-08.01 - Katakana lessons, practice, and progression

Status: completed

## Metadata

- [x] Epic: EPIC-08
- [x] Feature: FEAT-08.01
- [x] Date: 2026-08-20

## What Changed

- [x] Seed data for 10 Katakana row lessons (katakana-a, katakana-ka, katakana-sa, katakana-ta, katakana-na, katakana-ha, katakana-ma, katakana-ya, katakana-ra, katakana-wa) and all 46 basic Katakana characters already existed in apps/api/src/seed.ts.
- [x] Fixed Katakana ContentItem slug collision: Katakana items now use kt-<romaji> prefix (e.g., kt-a, kt-ka) so they do not conflict with Hiragana items sharing the same romaji slug.
- [x] Katakana Gojuon chart page already implemented at apps/web/app/[locale]/katakana/page.tsx with seikuon, dakuon, and yoon tabs, character detail modals, SpeechSynthesis TTS audio, and lesson completion indicators.
- [x] Practice page at apps/web/app/[locale]/lessons/[slug]/practice/page.tsx already supports Katakana slugs via isKatakana = slug.startsWith('katakana-') and routes back to /katakana correctly.
- [x] Fixed hardcoded Hiragana labels in the practice page question prompts - both kana-to-romaji and romaji-to-kana question types now say chu kana (script-agnostic).
- [x] Learner Dashboard at apps/web/app/[locale]/dashboard/page.tsx already shows Katakana progress (completedKatakanaCount / 10) and links to /katakana.

## Files Changed

- [x] apps/api/src/seed.ts - Fixed Katakana ContentItem slug namespace to kt-<romaji>
- [x] apps/web/app/[locale]/lessons/[slug]/practice/page.tsx - Fixed hardcoded Hiragana prompt text to script-agnostic kana
- [x] docs/handoffs/EPIC-08/FEAT-08.01-katakana-foundation.md (this file)
- [x] HANDOFF.md
- [x] TODO.md

## Database/API Impact

- [x] Database: No schema migrations required; reuses existing ContentLesson and ContentItem models.
- [x] Database Content: Seed adds 10 published Katakana row lessons containing 46 characters.
- [x] API: No API changes; existing learner GET /content/lessons, GET /content/lessons/:slug, and /progress endpoints serve Katakana content automatically.

## Tests Run

- [x] pnpm lint - Exit code 0, clean.
- [x] pnpm typecheck - Exit code 0, clean.
- [x] pnpm handoff:validate - Exit code 0, passed.
- [x] pnpm build - Running at time of handoff.
- [ ] DB seed - Requires Docker daemon running. Seed script is correct but Docker Desktop was not started.

## Decisions and Trade-offs

- [x] Namespaced Katakana ContentItem slugs with kt- prefix to avoid unique-constraint collisions with Hiragana items.
- [x] Reused the same practice page component for both Hiragana and Katakana.
- [x] No new API endpoints or schema changes needed.

## Known Issues

- [ ] When the practice page serves a Katakana row, the romaji-to-kana noise options still include Hiragana characters. Minor UX issue addressable later.
- [ ] DB seed requires Docker Desktop to be started manually before running.

## Exact Next Step

- [ ] Start Docker Desktop, run: pnpm --filter @chamnhatban/api exec ts-node-dev --transpile-only src/seed.ts
- [ ] Verify Katakana chart and practice via the web app.
- [ ] Implement Epic 09 (Vocabulary module foundation).
