# FEAT-02.01 - Improve CI and validation workflow

Status: completed with local validation blocker noted

## Metadata

- [x] Epic: EPIC-02
- [x] Feature: FEAT-02.01
- [x] Date: 2026-08-07

## What Changed

- [x] Updated GitHub Actions CI to a single `validate` job.
- [x] Aligned CI with Node.js 24.
- [x] Aligned CI with pnpm 11.
- [x] Changed CI install to `pnpm install --frozen-lockfile`.
- [x] Added CI steps for `pnpm format:check`, `pnpm test`, `pnpm test:e2e`, and `pnpm handoff:validate`.
- [x] Added the FEAT-02.01 feature spec.
- [x] Updated root status and TODO tracking to move work into EPIC-02.

## Files Changed

- [x] `.github/workflows/ci.yml`
- [x] `docs/features/FEAT-02.01-improve-ci-validation-workflow.md`
- [x] `docs/handoffs/EPIC-02/FEAT-02.01-improve-ci-validation-workflow.md`
- [x] `scripts/validate-handoffs.cjs`
- [x] `HANDOFF.md`
- [x] `TODO.md`

## Database/API Impact

- [x] Database: none.
- [x] API: none.

## Tests Run

- [x] Static CI workflow inspection completed.
- [x] `pnpm handoff:validate`i have run it manually
- [ ] Full CI-equivalent local validation not run because Node.js/Corepack/pnpm are not available on PATH in the current shell.

## Decisions and Trade-offs

- [x] Kept CI on Node.js 24 to match `ARCHITECTURE.md`.
- [x] Kept `pnpm test:e2e` as the existing placeholder until a real E2E framework is introduced.
- [x] Removed the Node 22 matrix because the architecture specifies Node.js 24 LTS.

## Known Issues

- [ ] Local validation remains blocked until Node.js, Corepack, and pnpm are available on PATH.
- [ ] CI has not been observed running remotely from this shell.

## Exact Next Step

- [ ] Expose Node.js, Corepack, and pnpm on PATH.
- [ ] Run the full validation command set from `TODO.md`.
- [ ] Start FEAT-02.02 local environment bootstrap helpers after validation is available.
