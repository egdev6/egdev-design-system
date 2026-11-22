# Release — ui 0.7.1, effects 0.2.8, system 0.9.0, mcp 0.4.8, cli 0.4.0

Local-tarball release delivering per-component `className` allowances (#530, PR #541): the `@classNameAllows` tag and `components[].classNameAllows` artifact field, DS046 honoring them, and the AGENTS block MCP fallback. Branch `chore/release-system-0.9.0` from main da0114f; previous release main 4a8c093 (PR #535).

## Specs

- S1 — Owner-confirmed versions, verbatim choice: "ui 0.7.1 · effects 0.2.8 · system 0.9.0 · mcp 0.4.8 · cli 0.4.0 (Recomendado)". tokens 0.6.1 unchanged.
- S2 — Changelogs (`## Unreleased` → versioned for ui, system, cli; new no-code entries for effects and mcp, as in #521), the mcp dependency on `@egdev/system` 0.9.0, lockfile, regenerated artifact and system.md, tests pinning the real CLI version; changelogs cite #530 only as `Refs #530`. CI Verify checks locally before the PR.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S2 | Bumps, changelogs, pin, lockfile, artifact, checks | inline | this branch |
| T2 | S2 | PR, CI, owner merge, clean release:pack on main, notify open app sessions | inline | pending |

## Log

- L1 — Owner merged #541 ("mergeada") and chose the versions in S1.
- L2 — Checks: biome on tracked files, typecheck, test:cli 241/241, test:package-release 25/25, test:artifact 42/42, test:system 36/36, props:check, artifact --check, system:check. `test:mcp` 10/11: the README examples test fails as on the base — its responses embed the 0.2.0-era artifact, so fixing it means regenerating every README example (separate documentation work; CI does not run test:mcp). Trial `release:pack`: ui 0.7.1, effects 0.2.8, system 0.9.0, mcp 0.4.8, cli 0.4.0, tokens 0.6.1; `resolves` unchanged (#485, #486, #488 from cli 0.1.1), no #530; dirty only because the bumps were uncommitted.
