# Project Handoff - Chạm Nhật Bản

## Current Status

- Stage: Authentication and users foundation complete.
- Current epic: EPIC-04.
- Latest completed feature: FEAT-04.03.
- Active feature: None.
- Production deployment: Not configured.
- Database migrations: Applied auth foundation migration to local database.
- Open blockers: None.

## Decisions Locked

- Web first, mobile later.
- TypeScript end-to-end.
- Next.js web.
- Server-first rendering by default with Client Components only for interaction-heavy UI.
- NestJS/Node.js API.
- PostgreSQL + Prisma.
- CMS is part of MVP.
- UI locale: Vietnamese, English, Japanese.
- No AI, payments, or Google Login in initial MVP.
- Hosting must start with the lowest practical cost.
- Agents: Google Antigravity and OpenAI Codex.
- Every completed feature requires a checklist-style historical handoff and this file update.

## Next Recommended Action

Start Epic 05: Content domain and CMS foundation. Add content schema, migrations, and basic learning content CRUD endpoints.

## Progress Checklist

- [x] Monorepo scaffolded.
- [x] Web app scaffolded.
- [x] API app scaffolded.
- [x] Shared packages created.
- [x] Handoffs created.
- [x] Missing validation scripts added.
- [x] Active app product text encoding fixed.
- [x] Dedicated `.agents/` rules folder created.
- [x] GitHub Actions CI validation workflow improved.
- [x] Local environment bootstrap helpers added.
- [x] Deployment configuration documented.
- [x] Full install / lint / typecheck / build validation completed.
- [x] First shared UI primitive created.
- [x] FEAT-03.01 validation completed after UI wiring.
- [x] Initial i18n structure and locale routing added.
- [x] FEAT-03.02 validation completed after locale routing.
- [x] Initial design tokens and styling foundation added.
- [x] FEAT-03.03 validation completed after styling foundation.
- [x] Auth domain models and DTOs added.
- [x] Registration and login endpoints added.
- [x] Session management, refresh token rotation, and profile endpoints added.

See [TODO.md](TODO.md) for the detailed action list and tick-box tracker.

## Latest Handoffs

- FEAT-01.01 - Scaffold pnpm/Turborepo monorepo: [docs/handoffs/EPIC-01/FEAT-01.01-scaffold-monorepo.md](docs/handoffs/EPIC-01/FEAT-01.01-scaffold-monorepo.md)
- FEAT-01.02 - Create `apps/web` with Next.js App Router: [docs/handoffs/EPIC-01/FEAT-01.02-web-app-scaffold.md](docs/handoffs/EPIC-01/FEAT-01.02-web-app-scaffold.md)
- FEAT-01.03 - Create `apps/api` with NestJS, Prisma, Swagger, health: [docs/handoffs/EPIC-01/FEAT-01.03-api-app-scaffold.md](docs/handoffs/EPIC-01/FEAT-01.03-api-app-scaffold.md)
- FEAT-01.04 - Bootstrap validation and script repair: [docs/handoffs/EPIC-01/FEAT-01.04-bootstrap-validation-and-script-repair.md](docs/handoffs/EPIC-01/FEAT-01.04-bootstrap-validation-and-script-repair.md)
- FEAT-01.05 - Agent rules folder: [docs/handoffs/EPIC-01/FEAT-01.05-agent-rules-folder.md](docs/handoffs/EPIC-01/FEAT-01.05-agent-rules-folder.md)
- FEAT-02.01 - Improve CI and validation workflow: [docs/handoffs/EPIC-02/FEAT-02.01-improve-ci-validation-workflow.md](docs/handoffs/EPIC-02/FEAT-02.01-improve-ci-validation-workflow.md)
- FEAT-02.02 - Local environment bootstrap helpers: [docs/handoffs/EPIC-02/FEAT-02.02-local-environment-bootstrap-helpers.md](docs/handoffs/EPIC-02/FEAT-02.02-local-environment-bootstrap-helpers.md)
- FEAT-02.03 - Prepare deployment configuration: [docs/handoffs/EPIC-02/FEAT-02.03-prepare-deployment-configuration.md](docs/handoffs/EPIC-02/FEAT-02.03-prepare-deployment-configuration.md)
- FEAT-03.01 - Create shared UI primitives: [docs/handoffs/EPIC-03/FEAT-03.01-create-shared-ui-primitives.md](docs/handoffs/EPIC-03/FEAT-03.01-create-shared-ui-primitives.md)
- FEAT-03.02 - Add i18n structure and locale routing: [docs/handoffs/EPIC-03/FEAT-03.02-i18n-structure-and-locale-routing.md](docs/handoffs/EPIC-03/FEAT-03.02-i18n-structure-and-locale-routing.md)
- FEAT-03.03 - Add design tokens and styling foundation: [docs/handoffs/EPIC-03/FEAT-03.03-design-tokens-and-styling-foundation.md](docs/handoffs/EPIC-03/FEAT-03.03-design-tokens-and-styling-foundation.md)
- FEAT-04.01 - Add auth domain and DTOs: [docs/handoffs/EPIC-04/FEAT-04.01-auth-domain-models-and-dtos.md](docs/handoffs/EPIC-04/FEAT-04.01-auth-domain-models-and-dtos.md)
- FEAT-04.02 - Add registration and login endpoints: [docs/handoffs/EPIC-04/FEAT-04.02-registration-and-login-endpoints.md](docs/handoffs/EPIC-04/FEAT-04.02-registration-and-login-endpoints.md)
- FEAT-04.03 - Session management and profile basics: [docs/handoffs/EPIC-04/FEAT-04.03-session-management-and-profile-basics.md](docs/handoffs/EPIC-04/FEAT-04.03-session-management-and-profile-basics.md)
