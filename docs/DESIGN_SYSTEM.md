# Design System

## Principles

- Keep product surfaces quiet, readable, and useful.
- Prefer server-rendered UI by default.
- Use shared primitives for repeated typography and layout behavior.
- Keep cards at 8px radius or less.
- Avoid adding a styling framework until a feature explicitly needs it.

## Initial Tokens

The first token set lives in `apps/web/app/globals.css` as CSS variables and is
mirrored by typed references from `@chamnhatban/ui`.

### Colors

- `--color-background`
- `--color-surface`
- `--color-text`
- `--color-muted`
- `--color-border`
- `--color-accent`

### Radius

- Small: `4px`
- Medium: `8px`

### Spacing

- `4px`
- `8px`
- `12px`
- `16px`
- `24px`
- `32px`

## Typography

- Use the system sans stack through `--font-sans`.
- Do not scale font size with viewport width.
- Keep letter spacing at default.

## Current Primitives

- `Heading` from `@chamnhatban/ui`.

## Next Expansion

- Add layout primitives after real shell navigation exists.
- Add form and button primitives during auth or CMS feature work.
