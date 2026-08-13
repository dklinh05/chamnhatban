# FEAT-05.01 - Add content domain models and admin endpoints

## Scope

Create the first content domain schema and admin CMS API foundation for lessons and learning items.

## Non-goals

- Building CMS web screens.
- Adding learner-facing public content endpoints.
- Adding JSON import/export.
- Adding quiz, flashcard, progress, or streak behavior.
- Adding hard delete behavior for content records.

## Acceptance Criteria

- Content lessons and content items are persisted through Prisma models.
- Content supports `DRAFT`, `PUBLISHED`, and `ARCHIVED` states.
- Admin lesson endpoints are protected by JWT auth and server-side admin role checks.
- Admins can create, list, read, and update lessons.
- Admins can create and update lesson items.
- Publishing validates required multilingual lesson and item fields.
- Publishing and archiving create audit log records.
- Learner-facing endpoints remain out of scope and must not expose draft content yet.

## Affected Modules

- `apps/api`
- `apps/api/prisma`
- `docs`

## Data Changes

- Add `ContentLesson`.
- Add `ContentItem`.
- Add `ContentAuditLog`.
- Add `ContentStatus`, `ContentItemType`, and `ContentAuditAction` enums.
- Add a relation from `User` to `ContentAuditLog` for admin publish/archive actions.

## API Changes

- Add `POST /api/v1/admin/content/lessons`.
- Add `GET /api/v1/admin/content/lessons`.
- Add `GET /api/v1/admin/content/lessons/:id`.
- Add `PATCH /api/v1/admin/content/lessons/:id`.
- Add `POST /api/v1/admin/content/lessons/:id/items`.
- Add `PATCH /api/v1/admin/content/lessons/:id/items/:itemId`.
- Add `POST /api/v1/admin/content/lessons/:id/publish`.
- Add `POST /api/v1/admin/content/lessons/:id/archive`.

## Tests

- Run Prisma generation after schema changes.
- Run API typecheck and lint.
- Run full workspace format check, typecheck, test placeholder, build, and handoff validation where available.
