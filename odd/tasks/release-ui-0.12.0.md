# Release — ui 0.12.0, effects 0.2.13, system 0.14.0, mcp 0.4.13

Local-tarball release on `chore/release-ui-0.12.0` for the Grid layout primitive (#395, PR #579, adc60a1). Previous release: main e52a5a1 (PR #578).

## Specs

- S1 — Owner choice, verbatim: "Ahora: ui 0.12.0, system 0.14.0 (Recomendado)". effects and mcp take patch bumps for the dependency, 0.2.13 and 0.4.13. tokens 0.7.0 and cli 0.5.0 are unchanged.
- S2 — The ui and system changelogs cite `(#395)` under their new version headings. After the merge and a clean `release:pack`, #395 is commented on and closed only with an explicit grant, and the egdev-website session is notified.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S2 | Bumps, changelogs, mcp pin, lockfile, artifact, mcp README, checks | worker | this branch |
| T2 | S2 | PR, owner merge, clean release:pack, close #395, notify the website | inline | pending |

## Log

- L1 — Owner merged #579 (adc60a1) and chose S1.
