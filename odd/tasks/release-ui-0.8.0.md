# Release — ui 0.8.0, effects 0.2.9, system 0.10.0, mcp 0.4.9

Local-tarball release delivering `Text.truncate` (#538, PR #546) and the IconButton 44px hit area with no-scale press and its composition spacing (#540, PR #548). Branch `chore/release-ui-0.8.0` from main 4e9fdaa; previous release main bb2530b (PR #542).

## Specs

- S1 — Owner-confirmed versions, verbatim choice: "ui 0.8.0 · effects 0.2.9 · system 0.10.0 · mcp 0.4.9 (Recomendado)". tokens 0.6.1 and cli 0.4.0 unchanged.
- S2 — Changelogs (`## Unreleased` → versioned for ui and system; no-code entries for effects and mcp), the mcp dependency on `@egdev/system` 0.10.0, lockfile, regenerated artifact and system.md; CI Verify checks locally before the PR. The ui changelog cites `(#538)` and `(#540)`, so `resolves` lists both as new in ui 0.8.0; after the clean pack they are commented and closed per the release-preparation skill, with an explicit grant.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S2 | Bumps, changelogs, pin, lockfile, artifact, checks | inline | this branch |
| T2 | S2 | PR, CI, owner merge, clean release:pack on main, resolved-issue notices, notify app sessions | inline | pending |

## Log

- L1 — Owner merged #548 ("mergeada") and chose the versions in S1.
- L2 — Checks green: biome on tracked files, typecheck, test:cli, test:artifact, test:system, props:check, artifact --check, system:check, build, package-exports 138/138, package-release. Trial `release:pack`: ui 0.8.0, effects 0.2.9, system 0.10.0, mcp 0.4.9, tokens 0.6.1, cli 0.4.0. New `resolves` entries: #538 and #540 in ui 0.8.0 and system 0.10.0. The pack was dirty only because the bumps were uncommitted.
