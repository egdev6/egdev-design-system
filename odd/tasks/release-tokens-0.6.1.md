# Release — tokens 0.6.1, ui 0.5.1, effects 0.2.5, system 0.6.1, mcp 0.4.5

Local-tarball release delivering `color-scheme: dark` on the theme `:root` (PR #505, main d46fc42). Branch `chore/release-tokens-0.6.1`; previous release main 8a4f21b (PR #504).

## Specs

- S1 — Owner-confirmed versions: `@egdev/tokens` 0.6.0 → 0.6.1, `@egdev/ui` 0.5.0 → 0.5.1, `@egdev/effects` 0.2.4 → 0.2.5, `@egdev/system` 0.6.0 → 0.6.1, `@egdev/mcp` 0.4.4 → 0.4.5; `@egdev/cli` 0.1.1 unchanged.
- S2 — Changelogs (English, `## X.Y.Z`, no date). tokens: `:root` declares `color-scheme: dark`, so native scrollbars, form controls and other browser UI render dark; an app `:root` `color-scheme` rule with equal specificity wins if it loads later. ui and effects: no code changes, repacked so the peer on `@egdev/tokens` is 0.6.1. system: artifact records the new package versions. mcp: no code changes, follows system 0.6.1.
- S3 — Coupled updates: mcp `workspace:` pin to system 0.6.1; `pnpm install --lockfile-only --offline`; the tokens manifest version pin in packages/tokens/tests/token-contract.test.mjs; any other genuine version pin; regenerate the system artifact and `system.md`.
- S4 — Every CI Verify step locally before the PR.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S4 | Bumps, changelogs, coupled updates, checks | worker | see L2 |
| T2 | S4 | Release PR, CI, owner merge, release:pack, notify Recado | inline | pending |

## Log

- L1 — Owner: "dale" (declare color-scheme: dark), PR #505 merged; versions "tokens 0.6.1, ui 0.5.1, effects 0.2.5, system 0.6.1, mcp 0.4.5".
- L2 — T1 done by worker: five bumps, changelogs, mcp pin to system 0.6.1, lockfile 1 line, tokens version pin, artifact versions only; all CI Verify steps pass locally, no build drift.
