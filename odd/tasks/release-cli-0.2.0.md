# Release — cli 0.2.0

Local-tarball release delivering the consumer requests flow tooling from #522 (PRs #524, #525, #526). Branch `chore/release-cli-0.2.0` from main 464c713; previous release main 02b6500 (PR #521).

## Specs

- S1 — Owner-confirmed version, verbatim choice: "cli 0.1.1 → 0.2.0 (Recomendado)". tokens 0.6.1, ui 0.7.0, effects 0.2.7, system 0.8.0 and mcp 0.4.7 unchanged (no source or changelog changes since 02b6500).
- S2 — Changelog `## Unreleased` becomes `## 0.2.0`; tests pinning the real CLI version follow; the changelog cites #522 only as `Refs #522`, so `resolves` does not mark it resolved. CI Verify checks locally before the PR.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S2 | Bump, changelog, version tests, checks | inline | this branch |
| T2 | S2 | PR, CI, owner merge, release:pack on main, notify consumers | inline | pending |

## Log

- L1 — Owner, verbatim: "si" (to preparing the CLI release with release-preparation); version choice in S1.
- L2 — No tags, GitHub Releases or release workflow exist: a release is a `chore(release)` PR plus `pnpm release:pack` on main (versioning.md). The skill's Discord, Short and Nexo catalog steps apply to published GitHub releases and are not applicable here.
- L3 — Checks: biome on tracked files (998 files, clean; `pnpm lint` locally also scans the ignored `.playwright-mcp/`, which CI never sees), typecheck, test:cli 161/161, test:package-release 25/25. Trial `release:pack`: cli 0.2.0 plus unchanged tokens 0.6.1, ui 0.7.0, effects 0.2.7, system 0.8.0, mcp 0.4.7; `resolves` = #485, #486, #488 (cli 0.1.1), no #522; dirty only because the bump was uncommitted.
