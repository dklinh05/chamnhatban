# FEAT-01.02 - Create apps/web with Next.js App Router

## Scope

Create the initial web app scaffold for Chạm Nhật Bản using Next.js App Router and strict TypeScript.

## Non-goals

- Locale routing.
- Authentication.
- Learning screens beyond a minimal bootstrap page.

## Acceptance Criteria

- `apps/web` exists as a workspace package.
- The app builds with the root build command.
- The minimal home page renders without corrupted product text.

## Affected Modules

- `apps/web`

## Data Changes

None.

## API Changes

None.

## Tests

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
