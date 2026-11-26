# Release — ui 0.11.0, effects 0.2.12, system 0.13.0, mcp 0.4.12

Local-tarball release on `chore/release-ui-0.11.0` for egdev-website's Pulso consumer requests: StepMeter (#556), Carousel current-slide emphasis (#557), ProjectCard header status (#558) and Footer current page (#559), merged in PR #567 (ea26078). Previous release: main 5239419 (PR #554).

## Specs

- S1 — Owner choice, verbatim: "ui 0.11.0, system 0.13.0, effects 0.2.12, mcp 0.4.12 (Recomendado)". tokens 0.6.1 and cli 0.4.0 are unchanged.
- S2 — The ui changelog cites `(#556)`, `(#557)`, `(#558)` and `(#559)` under its new version heading. The system changelog cites `(#556)`–`(#558)`; #559 does not change the artifact (Footer v0.3 FT-17). After the merge and a clean `release:pack`, those issues are commented on and closed only with an explicit grant, and the egdev-website session is notified.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S2 | Bumps, changelogs, mcp pin and README versions, lockfile, artifact, checks; close T10 in pulso-consumer-requests.md | worker | this branch |
| T2 | S2 | PR, owner merge, clean release:pack, issue notices, notify egdev-website | inline | pending |

## Log

- L1 — Owner request, verbatim: "si" (to "¿Preparo la release?"). Owner version choice: S1.
- L2 — Before this release, `pnpm test:mcp` fails 1 of 11 on main, because packages/mcp/README.md documents `@egdev/mcp` 0.2.0 and `@egdev/system` 0.2.0. This release updates those versions in the README.
- L3 — Updating the README sentence alone moves the `test:mcp` failure to the digest assertion: the five example responses embed an old artifact identity. Parent decision: regenerate only those five responses and their digests (README lines 66–211), which are derived documentation of this release. The README/test coupling recurs on every release; it is a follow-up.
