# Release — tokens 0.6.0, ui 0.4.0, system 0.5.0, mcp 0.4.3, effects 0.2.3

Local-tarball release delivering Tabs v0.4 / v0.4-A (PR #493) and the artifact extractor fix (PR #494). Process: `docs/distribution/versioning.md` and Engram `release/local-tarballs-process`. Branch `chore/release-ui-0.4.0` from main acef0f4; previous release main ba7a38e (PR #484).

## Specs

- S1 — Owner-confirmed versions ("Sí, esas versiones"): `@egdev/tokens` 0.5.1 → 0.6.0, `@egdev/ui` 0.3.2 → 0.4.0, `@egdev/system` 0.4.2 → 0.5.0, `@egdev/mcp` 0.4.2 → 0.4.3, `@egdev/effects` 0.2.2 → 0.2.3; `@egdev/cli` 0.1.1 unchanged.
- S2 — Each bumped package gets a top `## X.Y.Z` changelog section (no date, English, user-benefit wording, matching existing style). tokens: new `--mask-scroll-fade-inline` token. ui: Tabs edge fade on scrollable lists, fine-pointer scroll buttons (hidden at extremes, inert while hovered, absent on touch), underline focus reveal, internal scroll-area wrapper (compatibility note: tablist no longer a direct child of `.eg-tabs` in scrollable configurations), RTL requires a Radix `DirectionProvider`. system: artifact adds the token and Tabs anatomy; extractor resolves same-file class constants (Link, Panel*, Textarea gain facts; Field/Surface/Tabs lose spurious unresolved entries). mcp: no code changes, follows system 0.5.0. effects: no code changes, peer ranges follow ui 0.4.0 / tokens 0.6.0.
- S3 — Coupled updates: `@egdev/mcp` `workspace:` pin to system; `pnpm install --lockfile-only --offline`; any test or doc pinning manifest versions (e.g. `packages/tokens/tests/token-contract.test.mjs`); regenerate `packages/system/design-system.json` and `system.md` (they record versions).
- S4 — Checks before the PR: CI Verify steps (`pnpm lint` on changed files, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, tokens tests, `test:package-exports`, `test:package-consumption`, `test:package-release`), with `build` leaving no artifact drift.
- S5 — Thanks: credit only verified participants in the range ba7a38e..acef0f4 (GitHub authors, co-authors, reviews); do not infer from merges.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S5 | Bumps, changelogs, coupled updates, checks | worker | see L2 |
| T2 | S4 | Release PR, CI, merge (owner), re-pack from clean main | inline | pending |

## Log

- L1 — Owner: "uno por uno" (post-merge follow-ups in order); release item: "Sí, esas versiones".
- L2 — T1 done by worker; parent ran `pnpm build` (no extra drift) and `test:package-release` 24/24. Verified participants in ba7a38e..acef0f4: only egdev6 (no third-party reviews or co-authors).
