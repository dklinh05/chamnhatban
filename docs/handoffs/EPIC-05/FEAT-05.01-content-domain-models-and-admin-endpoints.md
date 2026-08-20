# FEAT-05.01 - Add content domain models and admin endpoints

Status: completed

## Metadata

- [x] Epic: EPIC-05
- [x] Feature: FEAT-05.01
- [x] Date: 2026-08-18

## What Changed

- [x] Added content domain Prisma enums: `ContentStatus`, `ContentItemType`, and `ContentAuditAction`.
- [x] Added `ContentLesson`, `ContentItem`, and `ContentAuditLog` Prisma models.
- [x] Added content foundation SQL migration.
- [x] Added `AdminRoleGuard` for server-side admin authorization.
- [x] Added content DTOs for lesson and item create/update requests.
- [x] Added local auth/content enum constants so root typecheck does not depend on generated Prisma enum exports.
- [x] Added `ContentService` with admin create/list/read/update lesson operations.
- [x] Added item create/update operations under lessons.
- [x] Added publish/archive workflow with validation and audit log writes.
- [x] Registered `ContentModule` in the API app.
- [x] Added `FEAT-05.01` feature spec.
- [x] Updated Epic 05, data model, TODO, and root handoff documentation.

## Files Changed

- [x] `apps/api/prisma/schema.prisma`
- [x] `apps/api/prisma/migrations/20260813000000_content_foundation/migration.sql`
- [x] `apps/api/src/admin/guards/admin-role.guard.ts`
- [x] `apps/api/src/auth/auth.types.ts`
- [x] `apps/api/src/auth/auth.service.ts`
- [x] `apps/api/src/auth/dto/auth-user.dto.ts`
- [x] `apps/api/src/content/content.controller.ts`
- [x] `apps/api/src/content/content.module.ts`
- [x] `apps/api/src/content/content.service.ts`
- [x] `apps/api/src/content/content.types.ts`
- [x] `apps/api/src/content/dto/content-item.dto.ts`
- [x] `apps/api/src/content/dto/content-lesson.dto.ts`
- [x] `apps/api/src/app.module.ts`
- [x] `docs/features/FEAT-05.01-content-domain-models-and-admin-endpoints.md`
- [x] `docs/epics/EPIC-05-content-domain-and-cms-foundation.md`
- [x] `docs/DATA_MODEL.md`
- [x] `TODO.md`
- [x] `HANDOFF.md`

## Database/API Impact

- [x] Database: adds content lesson, content item, and content audit log tables.
- [x] Database: adds content status/type/action enums.
- [x] API: adds admin content lesson and item endpoints under `/api/v1/admin/content/lessons`.
- [x] API: admin endpoints require bearer JWT and `ADMIN` role.
- [x] API: publish/archive actions create audit log records.
- [x] Migration applied locally to PostgreSQL.

## Tests Run

- [x] `pnpm --dir apps/api prisma:generate` runs and generates Prisma Client.
- [x] `pnpm --dir apps/api typecheck` runs successfully.
- [x] `pnpm run build` runs and compiles all packages successfully.
- [x] `pnpm handoff:validate` runs successfully and passes.

## Decisions and Trade-offs

- [x] Kept content lifecycle status-based with archive support instead of adding hard delete behavior.
- [x] Kept learner-facing published content endpoints out of this feature so the admin CMS foundation can be validated independently.
- [x] Added only publish/archive audit actions because the MVP explicitly calls out audit logs for those operations.
- [x] Used direct Prisma access inside the content application service, matching the current API pattern.

## Known Issues

- [ ] No automated tests were added yet; focused API service/controller coverage should be added once test scaffolding is expanded.
- [ ] Learner-facing published content endpoints are still pending for the next vertical slice.

## Exact Next Step

- [ ] Implement Epic 06 (Learning path and learner dashboard), starting with FEAT-06.01.
