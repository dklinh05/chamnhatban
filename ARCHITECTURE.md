# Architecture — Chạm Nhật Bản

## 1. Nguyên tắc

- Web-first, mobile-compatible.
- TypeScript end-to-end.
- Modular monolith trước; không microservice trong MVP.
- PostgreSQL là nguồn dữ liệu chính.
- REST + OpenAPI là contract giữa web, mobile và API.
- Chỉ thêm Redis/queue khi có nhu cầu thực tế.
- Tối ưu cho một người phát triển: ít dịch vụ, ít dependency, dễ debug.
- Content và progress phải tách biệt.
- Không gắn business logic vào controller hoặc React component.

## 2. Ngôn ngữ và định dạng

### Ngôn ngữ lập trình

- TypeScript: web, API, mobile, shared packages và automation script.
- TSX: React UI.
- SQL: migration được Prisma tạo và truy vấn tối ưu đặc biệt.
- CSS: Tailwind và CSS variables.
- Bash + PowerShell: bootstrap và local tooling.

### Định dạng cấu hình/tài liệu

- Markdown: PRD, architecture, epic, feature spec, ADR và handoff.
- YAML: GitHub Actions, Docker Compose.
- JSON: package config, locale message, content import/export.
- Dockerfile: API production image.

## 3. Runtime và workspace

- Node.js 24 LTS.
- pnpm 11.
- Turborepo.
- Workspace:
  - `apps/web`
  - `apps/api`
  - `apps/mobile`
  - `packages/*`

## 4. Web

- Next.js App Router.
- React.
- TypeScript.
- Tailwind CSS.
- Component primitives có accessibility.
- TanStack Query cho server state.
- React Hook Form + Zod cho form.
- Không thêm Zustand/Redux trước khi có state dùng chung thực sự.
- API client được sinh hoặc type-check từ OpenAPI.
- Locale routing: `/{locale}/...` với `vi`, `en`, `ja`.

### Web boundaries

- Rendering default: server-first with Next.js App Router.
- Use Server Components for route shells, layout, navigation, authenticated page
  data loading, public learning content, lesson/module pages, dashboard shells,
  and CMS list/detail views that can be rendered from API data.
- Use Client Components only for browser-only or interaction-heavy UI: quizzes,
  flashcards, kana practice, answer checking, timers, optimistic form state,
  tabs, filters, dialogs, local component state, and browser APIs.
- Do not mark a whole route as client-rendered just because one child needs
  interaction. Keep the route/page server-rendered and isolate the interactive
  part in the smallest practical `use client` component.
- Không gọi database từ web.
- Web chỉ giao tiếp qua API contract.
- Chuỗi hiển thị phải đi qua i18n message key.

## 5. API

- NestJS modular monolith.
- REST API, prefix `/api/v1`.
- Swagger/OpenAPI.
- DTO validation.
- Modules dự kiến:
  - `auth`
  - `users`
  - `admin`
  - `content`
  - `courses`
  - `lessons`
  - `kana`
  - `vocabulary`
  - `grammar`
  - `kanji`
  - `flashcards`
  - `quizzes`
  - `progress`
  - `streaks`
  - `health`
  - `audit`

### Layering

```text
Controller
→ Application service/use case
→ Domain policy
→ Repository/Prisma
```

- Controller không chứa business logic.
- Prisma type không được dùng làm public API DTO.
- Transaction được đặt ở application service.
- Logic streak, publish và review scheduling phải có unit test độc lập.

## 6. Database

- PostgreSQL.
- Prisma ORM và Prisma Migrate.
- UUID hoặc cuid cho public-facing identifiers.
- Timestamps lưu UTC.
- Timezone người dùng lưu dạng IANA string.
- Soft-delete chỉ dùng nơi thật sự cần; content ưu tiên `ARCHIVED`.
- Unique constraints bảo vệ idempotency và duplicate activity.

Xem `docs/DATA_MODEL.md`.

## 7. Authentication

### MVP

- Email + password.
- Password hash bằng Argon2id.
- Access token ngắn hạn.
- Refresh token rotation.
- Refresh token được hash trong database.
- Session có thể revoke.
- Web:
  - refresh token trong Secure HttpOnly cookie;
  - access token không lưu lâu trong browser storage.
- Mobile sau:
  - token bí mật trong secure storage của hệ điều hành.
- Admin authorization bằng role guard.
- Rate limit cho login, register, reset password và refresh.

### Sau MVP

- Google OAuth được thêm như identity provider, không thay đổi `User` domain.
- Một user có thể có nhiều `AuthIdentity`.

## 8. Nội dung và i18n

- UI i18n tách khỏi learning content.
- Learning content có Japanese source fields và localized explanation.
- Dùng content status:
  - `DRAFT`
  - `PUBLISHED`
  - `ARCHIVED`
- Learner API chỉ trả nội dung `PUBLISHED`.
- Publish phải validate:
  - field bắt buộc;
  - slug/order không trùng;
  - locale bắt buộc;
  - liên kết lesson/item hợp lệ.
- Import JSON phải chạy validation và dry-run trước khi commit.

## 9. Progress và streak

- `DailyActivity` là event idempotent.
- `LessonProgress` theo user + lesson.
- `ItemProgress` theo user + learning item.
- `QuizAttempt` giữ snapshot đủ để audit kết quả.
- `ReviewState` lưu due date, interval, ease/difficulty và lần review gần nhất.
- Streak cập nhật trong cùng transaction với activity được công nhận.
- Repeated request sử dụng idempotency key hoặc unique source event.

## 10. Flashcard/SRS

MVP dùng thuật toán đơn giản, deterministic và có test:

- Rating: `AGAIN`, `HARD`, `GOOD`, `EASY`.
- New card có due ngay.
- Mỗi rating cập nhật interval và due date.
- Không thay đổi thuật toán âm thầm; mọi thay đổi phải có ADR.
- Client không tự quyết định due date; API là nguồn sự thật.

## 11. Quiz

- Question bank do CMS quản lý.
- Loại câu hỏi MVP:
  - multiple choice;
  - matching;
  - text input ngắn.
- Server chấm điểm.
- Attempt lưu question/version snapshot để nội dung sửa sau không làm thay đổi lịch sử.
- Submit attempt phải idempotent.

## 12. Testing

- Web/package unit: Vitest.
- API unit/integration: Jest + Supertest.
- E2E web: Playwright.
- Test database: PostgreSQL service container.
- Contract:
  - OpenAPI generation không lỗi;
  - API client generation/typecheck.
- Không dùng snapshot test cho business logic chính.

## 13. Observability

MVP tối thiểu:

- Structured JSON logs ở API production.
- Request ID.
- Health endpoints:
  - `/health/live`
  - `/health/ready`
- Error tracking có thể thêm ở launch epic.
- Không log PII hoặc token.
- Audit log cho admin publish/archive.

## 14. Deployment

### Development

- Docker Compose chạy PostgreSQL local.
- Web và API chạy bằng pnpm.

### Chi phí thấp

- Web: Vercel Hobby hoặc platform tương đương.
- Database: managed PostgreSQL free tier trong giai đoạn thử nghiệm.
- API: Docker image, deploy vào dịch vụ container rẻ hoặc VPS nhỏ.
- Không dùng Redis, object storage hoặc queue trước khi cần.
- Vercel Git integration có thể đảm nhiệm preview deployment cho web.
- GitHub Actions build/push API image khi release.

### Production domains

```text
chamnhatban.com
api.chamnhatban.com
```

Tên domain chỉ là ví dụ; không hard-code trong ứng dụng.

## 15. Security baseline

- Environment schema validation khi startup.
- CORS allowlist.
- Helmet/security headers.
- CSRF strategy cho cookie endpoint.
- Password policy hợp lý, không tự đặt giới hạn bất thường.
- Refresh token rotation và reuse detection.
- Admin route cần auth + role.
- Không cho mass assignment.
- Validate file import size và schema.
- Dependency mới phải được ghi trong handoff.
