# Roadmap — Chạm Nhật Bản

Không triển khai song song nhiều epic phụ thuộc nhau. Ưu tiên vertical slice có
thể chạy và kiểm thử.

## Phase A — Foundation

- EPIC-00: Product baseline.
- EPIC-01: Repository and agent governance.
- EPIC-02: CI/CD and local infrastructure.
- EPIC-03: Design system and i18n foundation.

Exit: repo có thể cài, lint, typecheck, test, build; agent rules hoạt động; web
shell có locale routing.

## Phase B — Platform core

- EPIC-04: Authentication and users.
- EPIC-05: Content domain and CMS foundation.
- EPIC-06: Learning path and learner dashboard.

Exit: learner đăng nhập được; admin publish được một lesson mẫu; learner xem và
hoàn thành lesson mẫu; progress được lưu.

## Phase C — N5 learning modules

- EPIC-07: Hiragana.
- EPIC-08: Katakana.
- EPIC-09: Vocabulary.
- EPIC-10: Grammar.
- EPIC-11: Kanji.
- EPIC-12: Flashcards and SRS.
- EPIC-13: Quiz engine.
- EPIC-14: Progress, streaks, and review dashboard.

Exit: toàn bộ module MVP có learner flow, CMS flow và test.

## Phase D — Quality and launch

- EPIC-15: CMS completion and content operations.
- EPIC-16: Security, accessibility, observability, and QA.
- EPIC-17: Production deployment and beta launch.

Exit: migration procedure, backup/restore note, health checks, release pipeline,
E2E critical paths và production runbook hoàn thành.

## Phase E — After web MVP

- EPIC-18: Mobile application.
- EPIC-19: Google Login.
- EPIC-20: Post-MVP candidates.

Không bắt đầu mobile trước khi REST/OpenAPI, auth session, content API, progress
và SRS ổn định trên web.
