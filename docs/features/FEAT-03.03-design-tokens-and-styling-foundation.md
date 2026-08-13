# FEAT-03.03 - Add design tokens and styling foundation

## Scope

Add the initial design token and global styling foundation for the web app and document design system usage rules.

## Non-goals

- Adding Tailwind.
- Building a complete component library.
- Creating product navigation or app shell.
- Adding interactive client components.

## Acceptance Criteria

- Web app imports a global stylesheet through App Router layout.
- Initial CSS variables exist for color, radius, spacing, and font family.
- `@chamnhatban/ui` exports typed token references.
- Design system usage rules are documented.
- Existing locale home page renders within the global styling foundation.

## Affected Modules

- `apps/web`
- `packages/ui`
- Design system documentation.
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
