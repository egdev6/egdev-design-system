# Release — ui 0.9.0, effects 0.2.10, system 0.11.0, mcp 0.4.10

Local-tarball release on `integration/round-2`, prioritized for Nexo. It delivers the Icon `arrow-left` glyph (#537), per-component recipe attribution in the artifact (#547) and the action spacing in Collapsible, PreviewFrame and Sidebar (#550). Previous release: main 3a038fa (PR #549).

## Specs

- S1 — Owner, verbatim: "dale prioridad a las issues de nexo". Owner reply "si" to bundling the bumps into `integration/round-2` with a single PR to main. Versions: ui 0.9.0 (new `IconName` member plus visual spacing changes), system 0.11.0 (artifact data), effects 0.2.10 and mcp 0.4.10 (no code changes). tokens 0.6.1 and cli 0.4.0 unchanged.
- S2 — The ui changelog cites `(#537)` and `(#550)`, and the system changelog cites `(#547)`. After the merge and a clean `release:pack`, those issues are commented and closed only with an explicit grant, and the Nexo session is notified.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S2 | Bumps, changelogs, mcp pin, lockfile, artifact, checks | inline | this branch |
| T2 | S2 | PR, CI, owner merge, clean release:pack, issue notices, notify Nexo | inline | pending |

## Log

- L1 — Integration checks on round-2 were green before the bumps: `pnpm test` 3471/3471, build, package-exports 138/138, package-consumption 14/14.
