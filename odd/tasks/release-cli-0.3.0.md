# Release — cli 0.3.0

Local-tarball release delivering the app-side enforcement of the consumer requests flow (#530): doctor checks DS046, DS047 and DS048 and the `init` AGENTS.md block (PRs #531, #532, #533, #534). Branch `chore/release-cli-0.3.0` from main 4656a44; previous release main 6f6e0c5 (PR #528).

## Specs

- S1 — Version: `@egdev/cli` 0.2.0 → 0.3.0 (minor under 0.x per `docs/distribution/versioning.md`: new doctor checks and a new file written by `init`), announced to the owner before the merge of #534 and covered by the owner's choice "T5 + release ahora (Recomendado)" (odd/tasks/app-side-consumer-flow.md S8). tokens 0.6.1, ui 0.7.0, effects 0.2.7, system 0.8.0 and mcp 0.4.7 unchanged (no source or changelog changes since 6f6e0c5).
- S2 — `## Unreleased` becomes `## 0.3.0`; tests pinning the real CLI version follow; the changelog cites #530 only as `Refs #530`, so `resolves` does not mark it resolved. CI Verify checks locally before the PR.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S2 | Bump, changelog, version tests, checks | inline | this branch |
| T2 | S2 | PR, CI, owner merge, clean release:pack on main, validate on Recado | inline | pending |

## Log

- L1 — Owner merged #534 ("mergeada"); release prepared per S8 of odd/tasks/app-side-consumer-flow.md.
- L2 — Checks: biome on tracked files (1004, clean), typecheck, test:cli 236/236, test:package-release 25/25. Trial `release:pack`: cli 0.3.0 plus the five unchanged packages; `resolves` = #485, #486, #488 (cli 0.1.1), no new entries, no #530; dirty only because the bump was uncommitted.
