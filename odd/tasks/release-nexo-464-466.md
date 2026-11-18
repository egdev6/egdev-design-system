# Release for Nexo: tokens 0.5.0, ui 0.3.0, system 0.4.0, mcp 0.4.0

Local-tarball release delivering #464, #465, #466, #471 and #472 to Nexo/Quorb. Branch `chore/release-tokens-0.5.0-ui-0.3.0`; PR + merge, then `pnpm release:pack` from clean main into `release/` (gitignored).

## Specs

- S1: Owner choice, verbatim: "Minor bumps, effects unchanged (Recommended)" ("tokens 0.4.0 → 0.5.0, ui 0.2.0 → 0.3.0, system 0.3.0 → 0.4.0, mcp 0.3.0 → 0.4.0 (pins system); effects stays 0.2.0. Same flow as last time: PR + merge + local pack into release/.").
- S2: Same file set as the previous release commit b52c54b (package.json versions, a new top CHANGELOG section per bumped package, `@egdev/mcp`'s `workspace:<version>` specifier for `@egdev/system` + the matching `pnpm-lock.yaml` line, regenerated `packages/system/design-system.json` and `system.md`) plus the tokens version pin in `packages/tokens/tests/token-contract.test.mjs` (as in 846c0d6). `release:pack` fails if the top changelog heading differs from the manifest version or a `workspace:` specifier remains in packed output.
- S3: Changelog notes are user-benefit notes from evidence (merged PRs #468, #469, #470, #473 and their issues), in English, following each CHANGELOG's existing format. No thanks section: every commit in 846c0d6..HEAD is by the owner (egdev6).
- S4: Release range: `846c0d6..53ef06a` on main.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1–S4 | worker | release commit |
| T2 | S1 | parent | checks, PR, merge, pack, handoff |

## Log

- L1 (owner, verbatim): "abre issues de lo pendiente y resolvemos antes del build" — then version choice S1.
- L2: T1 done by worker: versions bumped, lockfile one-line specifier, changelogs (headings without date, matching existing format), tokens version pin, artifact + system.md regenerated (only package versions changed). Checks: tokens 71/0, test:system 36/0, test:package-release 13/0, system:check, frozen lockfile, changelogError ok for all five packages; test:artifact 31/0 (one unreproduced 1-failure run by the worker; parent reran twice: 31/0).
