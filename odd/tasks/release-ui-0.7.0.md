# Release — ui 0.7.0, system 0.8.0, mcp 0.4.7, effects 0.2.7

Local-tarball release delivering AttachmentField `resetKey` (#516, PR #519) and the consolidated v0.2 spec (PR #520). Branch `chore/release-ui-0.7.0` from main c1a1979; previous release main 96635dd (PR #515).

## Specs

- S1 — Owner-confirmed versions: `@egdev/ui` 0.6.0 → 0.7.0, `@egdev/system` 0.7.0 → 0.8.0, `@egdev/mcp` 0.4.6 → 0.4.7, `@egdev/effects` 0.2.6 → 0.2.7; tokens 0.6.1 and cli 0.1.1 unchanged.
- S2 — Changelogs, lockfile, mcp pin, regenerated artifact; every CI Verify step locally before the PR.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S2 | Bumps, changelogs, pin, lockfile, artifact, checks | inline | this branch |
| T2 | S2 | PR, CI, owner merge, release:pack, notify Recado | inline | pending |

## Log

- L1 — Owner merged #520; versions "ui 0.7.0, system 0.8.0, mcp 0.4.7, effects 0.2.7". Prepared inline (workers stalled on release prep before).
