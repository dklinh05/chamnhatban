# Agent Commands

## 1. Bootstrap repository

Copy this prompt into Antigravity or Codex from the repository root:

```text
Read AGENTS.md, PRODUCT_REQUIREMENTS.md, ARCHITECTURE.md, docs/ROADMAP.md,
docs/epics/EPIC-01-repository-governance.md, and HANDOFF.md.

Implement only FEAT-01.01 through FEAT-01.03 as separate commits or clearly
separated changes:

1. Scaffold a pnpm/Turborepo monorepo.
2. Create apps/web with the latest stable Next.js App Router and strict TypeScript.
3. Create apps/api with the latest stable NestJS, strict TypeScript, health module,
   Swagger/OpenAPI bootstrap, environment validation, and Prisma configured for PostgreSQL.
4. Keep apps/mobile as a documented placeholder; do not scaffold Expo yet.
5. Create packages/api-client, shared-types, validation, i18n, and ui with clear boundaries.
6. Preserve all existing docs, .agents rules/workflows, scripts, and GitHub workflows.
7. Add scoped AGENTS.md files under apps/web and apps/api.
8. Make root install, format:check, lint, typecheck, test, and build commands work.
9. Do not implement authentication or learning features yet.
10. Create one handoff per completed feature and update root HANDOFF.md.
11. Run all available checks and report exact results. Never claim a check passed if it did not run.
```

## 2. Start a feature in Antigravity

```text
/start-feature
Implement <FEATURE-ID> from <EPIC-ID>. Do not include adjacent features.
```

Example:

```text
/start-feature
Implement FEAT-04.02 from EPIC-04. Use the feature template if its spec is missing.
```

## 3. Finish a feature in Antigravity

```text
/finish-feature
Finish and hand off <FEATURE-ID>. Verify every acceptance criterion.
```

## 4. Codex feature prompt

```text
Read AGENTS.md, PRODUCT_REQUIREMENTS.md, ARCHITECTURE.md, docs/ROADMAP.md,
the relevant epic, the feature specification, HANDOFF.md, and the newest related
handoff.

Implement only <FEATURE-ID>. Follow existing patterns. Do not broaden scope.
Add migrations, OpenAPI changes, i18n keys, tests, and docs when applicable.
Before completion, create the mandatory feature handoff, update HANDOFF.md,
run all relevant checks, and report actual results and remaining issues.
```

## 5. Review prompt

```text
Review <FEATURE-ID> using .agents/workflows/review-feature.md.
Compare the feature spec, actual diff, tests, and handoff. Report findings in
severity order with exact file paths. Do not modify code until the review is complete.
```

## 6. Create a feature spec manually

```bash
pnpm feature:new EPIC-07 FEAT-07.01 hiragana-content "Hiragana content schema"
```

## 7. Validate handoffs

```bash
pnpm handoff:validate
```

In a pull request, the handoff gate also checks that application changes include
both a feature handoff and an update to root `HANDOFF.md`.
