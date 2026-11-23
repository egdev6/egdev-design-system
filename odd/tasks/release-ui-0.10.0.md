# Release — ui 0.10.0, effects 0.2.11, system 0.12.0, mcp 0.4.11

Local-tarball release on `integration/round-3` for Recado's requests: the Dialog sheet layout (#543) and AlertDialog container, overlay scope and the pending lock on both modals (#544). Previous release: main dc5900d (PR #552).

## Specs

- S1 — Owner choice, verbatim: "Sí: ui 0.10.0, system 0.12.0, effects 0.2.11, mcp 0.4.11 (Recomendado)". tokens 0.6.1 and cli 0.4.0 unchanged.
- S2 — The ui and system changelogs cite `(#543)` and `(#544)`. After the merge and a clean `release:pack`, those issues are commented on and closed only with an explicit grant, and the Recado session is notified.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S2 | Bumps, changelogs, mcp pin, lockfile, artifact, checks | inline | this branch |
| T2 | S2 | PR, CI, owner merge, clean release:pack, issue notices, notify Recado | inline | pending |

## Log

- L1 — Integration checks on round-3 before the bumps: build, package-exports 140/140, package-consumption 14/14. The full suite had 2 failures, both stale docgen prop counts, fixed in 8ecee35. Independent verify: PASS, no blockers.
- L2 — Outside-host focus moving to `body` is a documented Radix limitation (L41 in consumer-request-specs.md). #553, forced-colors focus in Button and IconButton, is tracked separately.
- L3 — The owner merged #554 (5239419) after a CodeQL `js/bad-code-sanitization` alert on the test harness was fixed (9f2f342; 0 open alerts, CI green). A clean `release:pack` on main reported dirty false: ui 0.10.0, effects 0.2.11, system 0.12.0, mcp 0.4.11. New `resolves` entries: #543 and #544 (ui 0.10.0, system 0.12.0). Owner grant, verbatim: "Sí, comentar y cerrar las dos (Recomendado)". Both issues were commented and closed as completed, and the Recado session was notified. Worktrees and integration branches were removed.
