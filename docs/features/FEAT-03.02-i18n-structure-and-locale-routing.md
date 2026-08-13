# FEAT-03.02 - Add i18n structure and locale routing

## Scope

Add the initial locale routing and message structure for the web app using `vi`, `en`, and `ja`.

## Non-goals

- Full translation coverage for future product screens.
- CMS content localization.
- User locale preferences.
- Client-side locale switcher UI.

## Acceptance Criteria

- Supported UI locales are defined as `vi`, `en`, and `ja`.
- Default locale is `vi`.
- Root `/` redirects to `/{defaultLocale}`.
- Locale home routes are available under `/{locale}`.
- Invalid locale routes return `notFound`.
- The scaffolded home page reads display text from i18n messages.

## Affected Modules

- `packages/i18n`
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
