# Project docs refresh (2026-11-19)

Bring the README and project documentation up to date with the current design system (six packages, `egdev-ds`, `release.json`, CI jobs, roadmap #491) before starting the website backlog. Two branches: `docs/readme-branding` (README.md + README.es.md, egdev-readme-branding skill) and `docs/project-docs-refresh` (the other files).

## Specs

- S1: Owner request, verbatim: "antes de arrancar con eso tenemos que actualizar el readme y la docu del proyecto".
- S2: Owner choice, verbatim: "Rebrand with egdev-readme-branding (Recommended)" ("Your global skill: English README.md + Spanish README.es.md, EGDEV banner, badges and closing, with the 6 packages, egdev-ds for consumers, commands and docs map."). The skill's rule applies: an old README without EGDEV markers is prepared in both languages and shown to the owner before it is written to the branch.
- S3: Owner choice, verbatim: "Must + should (Recommended)" ("README, AGENTS.md, CONTRIBUTING, ARQUITECTURA, PLAN pointer, versioning.md, effects README. Leave the cosmetic example versions (mcp README, artifact doc).").
- S4: Facts to reflect (audit 2026-11-19, explorer): six packages `@egdev/tokens` 0.5.1, `@egdev/ui` 0.3.2, `@egdev/effects` 0.2.2, `@egdev/system` 0.4.2, `@egdev/mcp` 0.4.2, `@egdev/cli` 0.1.1; distribution via `pnpm release:pack` + `release/release.json`; consumers use `egdev-ds` (`init`, `upgrade`, `upgrade --add`, `doctor`, `status`); CI jobs `Verify` and `egdev-ds end to end`; active roadmap index #491 (website backlog), #427 closed; scripts in `package.json` (incl. `test:cli`, `test:cli:consumer`, `release:pack`, `artifact`, `system:docs`). Stale items per file: README `:15-41`; AGENTS.md package table `:9-13` and "Comandos"; CONTRIBUTING `:5` (#8); ARQUITECTURA `:18-22` + missing distribution section; PLAN `:3` (#8); versioning.md `:19-21` (system/mcp "added by its own task", CLI commands missing `status`/`--add`); effects README `:7-17` (HomeTemplate already exported, `three` 0.160.0 exact peer).
- S5: Language (AGENTS.md): new or updated documentation in English; do not translate legacy content outside the authorized scope. README.es.md is Spain Spanish per the branding skill. In Spanish legacy files (AGENTS.md, ARQUITECTURA, PLAN, effects README), update the stale facts in place without translating untouched sections; new sentences follow the file's existing language unless the file already mixes English amendments.

## Tasks

| ID | Specs | Route | Branch | Commit |
| --- | --- | --- | --- | --- |
| T1 | S1, S2, S4, S5 | worker A (draft) → owner review → write | docs/readme-branding | — |
| T2 | S1, S3, S4, S5 | worker B | docs/project-docs-refresh | — |
| T3 | S1 | parent | both | checks, PRs, CI, merge |

## Log

- L1 (owner, verbatim): S1.
- L2 (owner choices): S2, S3.
