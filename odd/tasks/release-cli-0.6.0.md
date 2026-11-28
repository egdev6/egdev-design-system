# Release — cli 0.6.0, ui 0.12.1, system 0.14.1, effects 0.2.14, mcp 0.4.14

Local-tarball release on `chore/release-cli-0.6.0` for the DS040 Prose anchor exemption (#580, PR #583, 91fdfc5).
Previous release: main 2559d52 (PR #581).

## Specs

- S1 — Owner choice, verbatim: "Todo lo pendiente (Recomendado)": cli 0.6.0 (minor, OQ-4 in `odd/tasks/prose-links-580.md`),
  ui 0.12.1 and system 0.14.1 for the documentation-only Prose `children` description, effects 0.2.14 and mcp 0.4.14 as
  dependency patches. tokens 0.7.0 is unchanged.
- S2 — The cli, ui and system changelogs cite `(#580)` under their new version headings. After the merge and a clean
  `release:pack`, #580 is commented on and closed only with an explicit grant, and the egdev-website session is notified.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S2 | Bumps, changelogs, mcp pin, lockfile, artifact, system.md, mcp README, checks | inline | this branch |
| T2 | S2 | PR, owner merge, clean release:pack, close #580, notify the website | inline | pending |

Risk: item 5 (release and distribution artifacts).

## Log

- L1 — Owner merged #583 (91fdfc5) and, asked what to release, chose S1.
