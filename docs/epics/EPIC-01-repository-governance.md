# EPIC-01 — Repository Governance and Bootstrap

Status: In progress / scaffold completed for FEAT-01.01–FEAT-01.03

## Summary

Establish the initial repository foundation for Chạm Nhật Bản using a pnpm + Turborepo workspace, a Next.js web app, a NestJS API app, shared packages, and documented handoff artifacts.

## Scope

- [x] Scaffold the monorepo workspace with pnpm workspaces and Turborepo.
- [x] Create the web application with Next.js App Router and strict TypeScript.
- [x] Create the API application with NestJS, Swagger/OpenAPI, env validation, health route, and Prisma PostgreSQL configuration.
- [x] Create shared packages for API client, types, validation, i18n, and UI primitives.
- [x] Keep the mobile app as a documented placeholder and do not scaffold Expo yet.

## Completed features

- [x] FEAT-01.01 — Scaffold pnpm/Turborepo monorepo
- [x] FEAT-01.02 — Create apps/web with Next.js App Router
- [x] FEAT-01.03 — Create apps/api with NestJS, Prisma, Swagger, health

## Notes

- Authentication and learning features are intentionally out of scope for this epic.
- Validation commands were attempted, but full install/build verification remains environment-dependent because pnpm package installation is still being retried in this environment.
