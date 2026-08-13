# FEAT-01.05 - Agent rules folder

Status: completed with validation blocker noted

## Metadata

- [x] Epic: EPIC-01
- [x] Feature: FEAT-01.05
- [x] Date: 2026-08-07

## What Changed

- [x] Created `.agents/`.
- [x] Added `.agents/AGENTS.md` as a clean UTF-8 mirror of the repository agent rules.
- [x] Added `.agents/README.md` to explain the folder purpose.
- [x] Updated `scripts/validate-handoffs.cjs` to require FEAT-01.05 artifacts and `.agents` files.
- [x] Updated root `HANDOFF.md` and `TODO.md` to reflect the completed governance artifact.
- [x] Defined the web rendering rule: server-first Next.js App Router by default, Client Components only for interaction-heavy UI.

## Files Changed

- [x] `.agents/AGENTS.md`
- [x] `.agents/README.md`
- [x] `docs/features/FEAT-01.05-agent-rules-folder.md`
- [x] `docs/handoffs/EPIC-01/FEAT-01.05-agent-rules-folder.md`
- [x] `scripts/validate-handoffs.cjs`
- [x] `ARCHITECTURE.md`
- [x] `AGENTS.md`
- [x] `HANDOFF.md`
- [x] `TODO.md`

## Database/API Impact

- [x] Database: none.
- [x] API: none.
- [x] Web rendering contract: documented only; no runtime code change.

## Tests Run

- [x] `.agents` file existence check passed.
- [x] `.agents` handoff-rule text scan passed.
- [x] Rendering-rule text scan passed in `AGENTS.md`, `.agents/AGENTS.md`, and `ARCHITECTURE.md`.
- [x] `.agents` mojibake scan passed.
- [ ] `pnpm handoff:validate` not run because Node.js/Corepack/pnpm are not available on PATH in the current shell.

## Decisions and Trade-offs

- [x] Kept root `AGENTS.md` as the canonical instruction file.
- [x] Added `.agents/AGENTS.md` as a mirrored governance copy.
- [x] Limited the change to the `.agents` artifact and related status tracking.
- [x] Did not rewrite all historical corrupted docs as part of this small governance feature.

## Known Issues

- [ ] Full script validation remains blocked until Node.js, Corepack, and pnpm are available on PATH.
- [ ] Root `AGENTS.md` still displays mojibake in this shell output; `.agents/AGENTS.md` was created cleanly.

## Exact Next Step

- [ ] Expose Node.js, Corepack, and pnpm on PATH.
- [ ] Run `pnpm handoff:validate`.
- [ ] Run the rest of the bootstrap validation commands from `TODO.md`.
