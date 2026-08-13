# AGENTS.md - Chạm Nhật Bản

These instructions apply to the entire repository unless a nested `AGENTS.md`
provides more specific instructions.

## Project

- Product: `Chạm Nhật Bản` / repository slug `chamnhatban`.
- Goal: a web-first Japanese N5 learning platform with a later mobile app.
- MVP: email/password auth, Hiragana, Katakana, vocabulary, grammar, Kanji,
  flashcards, quizzes, progress, streaks, CMS, and `vi|en|ja` UI.
- Explicitly out of MVP: AI, payments, Google Login, community, live classes.

## Required Reading Before Implementation

Read these files in order:

1. `PRODUCT_REQUIREMENTS.md`
2. `ARCHITECTURE.md`
3. `docs/ROADMAP.md`
4. The relevant file in `docs/epics/`
5. The relevant feature specification in `docs/features/`
6. `HANDOFF.md`
7. The newest related file in `docs/handoffs/`, if one exists

Do not implement from the ticket title alone.

## Repository Rules

- Use TypeScript for application code.
- Use pnpm workspace and Turborepo.
- Keep the backend a NestJS modular monolith.
- Keep database access inside the API.
- Use Next.js App Router server-first rendering by default. Keep pages, layouts,
  shells, and API-backed content as Server Components; use Client Components
  only for browser APIs, local state, forms, quizzes, flashcards, practice UI,
  dialogs, filters, timers, and other interaction-heavy pieces.
- Do not introduce microservices, Redis, a queue, GraphQL, Redux, or a new
  framework without an ADR and explicit task scope.
- Do not add a dependency when a small local implementation is clearer.
- Do not change unrelated files.
- Do not perform broad refactors while implementing a feature.
- Never hide failing tests, skipped acceptance criteria, or incomplete work.

## Feature Workflow

A feature must have a feature ID such as `FEAT-07.01`.

Before coding:

1. Confirm the relevant epic and feature spec exist.
2. If the feature spec is missing, create it from
   `docs/templates/FEATURE_SPEC_TEMPLATE.md`.
3. Restate scope, non-goals, acceptance criteria, affected modules, data changes,
   API changes, and tests.
4. Inspect existing patterns before creating new abstractions.

During coding:

1. Implement the smallest complete vertical slice.
2. Keep controllers and UI components thin.
3. Add migration before code that depends on the new schema.
4. Update OpenAPI when API behavior changes.
5. Add or update tests in the same change.
6. Use i18n keys for all user-facing text.
7. Keep operations idempotent where retries are possible.
8. Run focused checks early, then the full required checks.

Before completion:

1. Verify every acceptance criterion.
2. Run relevant lint, typecheck, tests, build, and migration validation.
3. Update affected docs.
4. Create a feature handoff under
   `docs/handoffs/<EPIC-ID>/<FEATURE-ID>-<slug>.md`.
5. Update root `HANDOFF.md`.
6. Run `pnpm handoff:validate`.
7. Report remaining risks and failures honestly.

A feature is not complete until the handoff exists.

## Definition Of Done

- Acceptance criteria are satisfied.
- Validation and error paths are handled.
- Authorization is enforced server-side.
- Tests cover the primary path and important failure paths.
- No new TypeScript `any` without a written reason.
- No hard-coded display strings.
- No secret or token is committed or logged.
- Schema changes include a Prisma migration and migration note.
- API changes update OpenAPI and client types.
- Handoff and root status are updated.

## Testing Commands

Run only commands that exist in the repository. Expected root commands:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm handoff:validate
```

If a command cannot run because the repository has not reached that scaffold
stage, state that in the handoff. Never claim it passed.

## Data And Content Rules

- Store timestamps in UTC.
- Store user timezone as an IANA timezone.
- Treat `DailyActivity` as the auditable streak source.
- Learner endpoints expose only published content.
- Admin content changes require server-side role checks.
- Quiz attempts keep a content snapshot/version reference.
- The server decides review due dates and quiz scores.
- Do not copy proprietary lessons, question banks, audio, or textbooks.

## Security

- Hash passwords with Argon2id.
- Hash refresh tokens at rest.
- Do not store web auth tokens in `localStorage`.
- Validate environment variables on startup.
- Rate-limit auth endpoints.
- Use CORS allowlists and secure cookie settings.
- Never print credentials, tokens, cookies, or full auth headers.
- Ask for explicit approval before destructive database or Git operations.

## Git Safety

Do not run destructive commands such as:

```text
git reset --hard
git clean -fd
git push --force
drop database
prisma migrate reset
```

unless the user explicitly asked for that exact destructive action.

## Handoff Format

Use `docs/templates/HANDOFF_TEMPLATE.md`, and write handoff body items as
checklists using `- [x]` for completed items and `- [ ]` for blocked, pending,
failed, or next-step items. Include:

- metadata and status;
- what changed;
- files changed;
- database/API impact;
- tests run with actual results;
- decisions and trade-offs;
- known issues;
- exact next step for the next agent.

Do not overwrite historical handoffs.
