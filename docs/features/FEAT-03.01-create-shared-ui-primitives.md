# FEAT-03.01 - Create shared UI primitives

## Scope

Create the first reusable UI primitive in `@chamnhatban/ui` and wire it into the web app.

## Non-goals

- Creating a full design system.
- Adding Tailwind or design tokens.
- Adding locale routing or i18n message files.
- Building product screens beyond the scaffolded home page.

## Acceptance Criteria

- `@chamnhatban/ui` exports a typed `Heading` primitive.
- `apps/web` consumes the shared UI package.
- Next.js is configured to transpile the workspace UI package.
- The scaffolded web page uses the shared primitive.
- Product text in the active web page is not mojibaked.

## Affected Modules

- `packages/ui`
- `apps/web`
- Repository governance documentation.

## Data Changes

None.

## API Changes

None.

## Tests

- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm handoff:validate`
