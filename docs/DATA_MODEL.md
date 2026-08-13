# Data Model

## Auth Foundation

- [x] `User` stores account identity, role, status, password hash, display name, timezone, and timestamps.
- [x] `AuthSession` stores revocable refresh-token sessions with hashed refresh tokens only.
- [x] `PasswordResetToken` stores password reset token hashes with expiry and usage timestamps.
- [x] `UserRole` starts with `LEARNER` and `ADMIN`.
- [x] `UserStatus` starts with `ACTIVE` and `DISABLED`.
- [x] User timezone defaults to `Asia/Ho_Chi_Minh` and should remain an IANA timezone string.
- [x] Refresh tokens and password reset tokens must never be stored in plain text.

## Migration Notes

- [x] Initial auth schema migration: `apps/api/prisma/migrations/20260807000000_auth_foundation/migration.sql`.
- [x] Apply the migration to local PostgreSQL before implementing endpoints that depend on these tables.

## Content Foundation

- [x] `ContentLesson` stores lesson-level CMS content with multilingual titles, optional multilingual descriptions, status, order, and publish/archive timestamps.
- [x] `ContentItem` stores lesson items with Japanese source text, optional reading, multilingual meanings and notes, type, status, and order.
- [x] `ContentAuditLog` stores admin publish/archive actions with actor and lesson references.
- [x] `ContentStatus` supports `DRAFT`, `PUBLISHED`, and `ARCHIVED`.
- [x] `ContentItemType` starts with `LESSON`, `VOCABULARY`, `GRAMMAR`, `KANJI`, and `KANA`.
- [x] Learner-facing content endpoints must expose only `PUBLISHED` content when added.
- [x] Publish validation requires required multilingual lesson and item fields before content becomes learner-visible.

## Content Migration Notes

- [x] Content foundation migration: `apps/api/prisma/migrations/20260813000000_content_foundation/migration.sql`.
- [ ] Apply the content foundation migration to local PostgreSQL before using admin content endpoints against the local database.
