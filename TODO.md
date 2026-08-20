# Project TODO Tracker

Use this file as the main checklist for future implementation. Tick items when complete.

## Epic 01 - Repository Governance and Bootstrap

### Feature FEAT-01.01 - Scaffold the monorepo foundation

- [x] Create the repository structure for the monorepo.
- [x] Scaffold pnpm workspaces and Turborepo.
- [x] Add shared TypeScript configuration.
- [x] Add formatting and linting defaults.
- [x] Run a clean pnpm install.
- [x] Verify root lint/typecheck/build commands.
- [x] Add root `format:check`, `test:e2e`, and `handoff:validate` scripts.

### Feature FEAT-01.02 - Scaffold the web app

- [x] Scaffold apps/web with Next.js App Router.
- [x] Add strict TypeScript config for the web app.
- [x] Add a minimal home page for the web app.
- [x] Validate the web app build locally.
- [x] Replace deprecated web lint command with ESLint.
- [x] Fix active web product text encoding.

### Feature FEAT-01.03 - Scaffold the API app

- [x] Scaffold apps/api with NestJS.
- [x] Add Swagger/OpenAPI bootstrap.
- [x] Add a health endpoint.
- [x] Add environment validation.
- [x] Add Prisma schema for PostgreSQL.
- [x] Run a clean pnpm install.
- [x] Verify Swagger docs are served correctly.
- [x] Remove lint failure masking from the API package.
- [x] Fix active API product text encoding.

### Feature FEAT-01.04 - Bootstrap validation and script repair

- [x] Add root `format:check`, `test:e2e`, and `handoff:validate` scripts.
- [x] Add local handoff validation script.
- [x] Add missing FEAT-01 feature specs.
- [x] Run `pnpm handoff:validate`.

### Feature FEAT-01.05 - Agent rules folder

- [x] Create `.agents/` with mirrored agent rules.
- [x] Use checklist-style handoffs.
- [x] Define server-first rendering rule for Next.js App Router.
- [x] Run `pnpm handoff:validate`.

## Epic 02 - CI/CD and Local Infrastructure

### Feature FEAT-02.01 - Improve CI and validation workflow

- [x] Improve GitHub Actions CI validation workflow.
- [x] Use Node.js 24 in CI.
- [x] Use pnpm 11 in CI.
- [x] Install with `pnpm install --frozen-lockfile` in CI.
- [x] Run format, lint, typecheck, test, build, E2E placeholder, and handoff validation in CI.
- [ ] Observe CI running remotely.

### Feature FEAT-02.02 - Local environment bootstrap helpers

- [x] Add local environment bootstrap helpers.
- [x] Add Docker Compose PostgreSQL local infrastructure.
- [x] Document environment startup and shutdown.
- [x] Fix ESLint config so generated `.next`, `dist`, cache, and dependency output are ignored.
- [x] Remove obsolete Next.js `experimental.appDir` config.
- [x] Remove invalid placeholder Prisma `_Migration` model.
- [x] Add `.prettierignore` for generated build/cache/dependency output.
- [x] Verify `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e`, and `pnpm handoff:validate`.
- [x] Re-run `pnpm prisma db pull --print` from `apps/api`; database connection worked and empty database was confirmed.
- [x] Run `pnpm format`.
- [x] Re-run `pnpm format:check`.
- [x] Verify local PostgreSQL container is running and healthy.
- [x] Verify API health endpoint is reachable locally.
- [x] Verify Swagger docs are served locally.
- [x] Verify API can connect to local PostgreSQL.

### Feature FEAT-02.03 - Prepare deployment configuration

- [x] Prepare deployment configuration.
- [x] Document production environment variables.
- [x] Add deployment runbook notes.
- [x] Run `pnpm handoff:validate`.

## Epic 03 - Design System and i18n

### Feature FEAT-03.01 - Create shared UI primitives

- [x] Create shared UI primitives.
- [x] Add typed `Heading` primitive to `@chamnhatban/ui`.
- [x] Wire `@chamnhatban/ui` into `apps/web`.
- [x] Configure Next.js to transpile `@chamnhatban/ui`.
- [x] Use shared `Heading` on the scaffolded web page.
- [x] Add `@types/react` to `@chamnhatban/ui`.
- [x] Ignore generated `next-env.d.ts` in Prettier.
- [x] Run FEAT-03.01 validation.

### Feature FEAT-03.02 - Add i18n structure and locale routing

- [x] Add i18n structure and locale routing.
- [x] Define supported UI locales `vi`, `en`, and `ja`.
- [x] Define default locale `vi`.
- [x] Add root redirect from `/` to `/vi`.
- [x] Add locale home routes under `/{locale}`.
- [x] Move scaffolded home text into i18n messages.
- [x] Run FEAT-03.02 validation.

### Feature FEAT-03.03 - Add design tokens and styling foundation

- [x] Add design tokens and styling foundation.
- [x] Add web App Router root layout.
- [x] Add web global stylesheet.
- [x] Add initial CSS variables for colors, radius, spacing, and font family.
- [x] Export typed token references from `@chamnhatban/ui`.
- [x] Document design system usage rules.
- [x] Run FEAT-03.03 validation.

## Epic 04 - Authentication and Users

### Feature FEAT-04.01 - Add auth domain and DTOs

- [x] Add auth domain models and DTOs.
- [x] Add `User`, `AuthSession`, and `PasswordResetToken` Prisma models.
- [x] Add `UserRole` and `UserStatus` Prisma enums.
- [x] Add auth foundation Prisma migration.
- [x] Add register, login, request password reset, and reset password DTOs.
- [x] Register the auth module boundary in the API app.
- [x] Document the auth data model.
- [x] Run FEAT-04.01 validation.
- [x] Apply auth foundation migration locally.

### Feature FEAT-04.02 - Add login and registration endpoints

- [x] Add register endpoint.
- [x] Add login endpoint.
- [x] Add Argon2id password hashing.
- [x] Add server-side validation and duplicate email handling.
- [x] Update OpenAPI for auth endpoints.
- [x] Verify register/login against a migrated local PostgreSQL database.

### Feature FEAT-04.03 - Add session management and profile basics

- [x] Add web auth flows and session handling.
- [x] Add refresh token rotation and revoke flow.
- [x] Add basic profile endpoint.

## Next Feature Backlog

### Epic 05 - Content domain and CMS foundation

- [x] Add content domain models and Prisma migrations.
- [x] Add initial content admin endpoints.
- [x] Add publish/archive validation.
- [x] Apply content foundation migration locally.

### Epic 06 - Learning path and learner dashboard

- [x] Add initial lesson and vocabulary content endpoints.
- [x] Add the first learning experience flow in the web app.

### Epic 07 - Hiragana module

- [x] Seed database with Hiragana lessons and KANA characters.
- [x] Implement visual interactive Hiragana Gojuon chart with detail modals and TTS audio.
- [x] Implement client-side randomized row practice session with type/choice questions and sound feedback.
- [x] Connect Hiragana practice completion with server-side streak updates and dashboard stats.

### Epic 08 - Katakana module

- [x] Seed database with Katakana lessons and KANA characters.
- [x] Implement visual interactive Katakana Gojuon chart with detail modals and TTS audio.
- [x] Ensure practice page supports katakana-* slugs and routes back to /katakana correctly.
- [x] Fix hardcoded Hiragana labels in practice page to be script-agnostic.
- [x] Dashboard integration showing Katakana progress stats and link.
- [x] Fix Katakana ContentItem slug collision (kt- prefix namespace).

### Epic 09 - Vocabulary module

- [x] Seed database with 10 N5 thematic vocabulary lessons (78 vocabulary items).
- [x] Create vocabulary hub page at /vocabulary with themed cards and completion badges.
- [x] Enhance lesson detail page to render rich VOCABULARY item cards (Japanese, reading, TTS, meaning, example).
- [x] Add back navigation from vocab lesson detail to /vocabulary.
- [x] Dashboard integration with Vocabulary N5 section card and completedVocabCount / 10 progress.
- [x] Exclude vocab lessons from generic dashboard lessons list.
- [x] Add vocabulary CSS styles (hub grid, item cards, TTS button, meaning, example).

### Epic 10 - Grammar module

- [x] Seed database with 5 N5 thematic grammar lessons (16 rules).
- [x] Enhance lesson detail page to render rich GRAMMAR cards with TTS support.
- [x] Update Dashboard to show a dedicated "Ngữ pháp N5" section with only grammar lessons.
- [x] Add grammar CSS styles and line break preserving in CSS.

### Epic 11 - Kanji module

- [x] Seed database with 5 N5 thematic Kanji lessons (36 characters).
- [x] Create a dedicated Kanji Hub page at /kanji showing lesson completion progress.
- [x] Enhance lesson detail page to render rich KANJI cards with Onyomi/Kunyomi, meanings, notes, and TTS support.
- [x] Add Kanji progress card to the Dashboard and filter logic.
- [x] Add Kanji CSS styles to globals.css.

### Epic 12 - Flashcards & SRS module

- [x] Add Flashcard model to the database schema.
- [x] Automate flashcard record generation upon lesson completion.
- [x] Create due count endpoint and review submission API with SM-2 spaced repetition logic.
- [x] Render a dynamic flashcard review notification card on the Dashboard.
- [x] Create a flippable review session page with Again/Good/Easy buttons, TTS support, and session statistics.
- [x] Append CSS styles for flashcard layout and 3D flip animations to globals.css.

## Next Recommended Actions

1. Start Docker Desktop and run seed: `pnpm --filter @chamnhatban/api exec ts-node-dev --transpile-only src/seed.ts`
2. Begin Epic 13 (Quizzes and Assessments) implementation.
