# Distribution for products and agents — ODD plan
**Objective:** products install an exact version of `@egdev/tokens`, `@egdev/ui` and `@egdev/effects` from local tarballs, and agents and gentle-design read the design system from that same version.
**Roadmap:** index #349, milestone 9 "Distribution for products and agents", proposal `egdev-ds-distribution-v1`. Planning only: each issue needs its own spec/plan approval before implementation.

## Specs

Exact owner requirements, quoted verbatim (Spanish is the owner's wording; the exception to English artifacts).

- **S1 — Milestone goal:** "planifiquemos el siguiente milestone completo. Objetivo sistema de empaquetado para consumo de productos y configuración de mcp para conexión de agentes y gentle-design"
- **S2 — Registry:** "creo recordar que comentamos de empezar con empaquetado local. Valoramos la opción de paquete npm pero no llegamos a concretar nada."
- **S3 — Versioning:** "esto va muy ligado a como hagamos el versionado"
- **S4 — MCP shape:** "Paquete @egdev/mcp propio (Recomendado)"
- **S5 — gentle-design:** "design/system.md generado desde el DS (Recomendado)"
- **S6 — Approval:** "apruebo, déjalo planificado en odd y github"

## Tasks

| Task | Content | Specs | Route | Status | Commit | GitHub |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Publish roadmap index, milestone and seven issues | S1–S6 | parent GitHub operations | done — bodies read back identical (trailing newline only) | planning publication only | #349, milestone 9 |
| T1 | Versioned local tarballs: `release:pack`, semver 0.x policy, per-package CHANGELOG, install guide | S1–S3 | pending route | planned — policy phase needs owner approval | not implemented | #342 |
| T2 | Isolated pilot consumer installed from tarballs (both CSS modes, WebTemplate + WebSection page) | S1, S2 | pending route | planned — blocked by T1 | not implemented | #343 |
| T3 | Storybook MCP manifest test aligned with public exports; agent connection guide | S1 | pending route | planned — independent | not implemented | #344 |
| T4 | Versioned design system data artifact (catalog, props, tokens, Material recipes, naming) | S1, S4, S5 | pending route | planned — blocked by T1; schema spec needs approval | not implemented | #345 |
| T5 | `@egdev/mcp` offline stdio MCP server over the artifact | S1, S4 | pending route | planned — blocked by T4; new dependencies need owner confirmation | not implemented | #346 |
| T6 | Generated `design/system.md` for gentle-design | S1, S5 | pending route | planned — blocked by T4 (T5 for the MCP path) | not implemented | #347 |
| T7 | Observed gentle-design walkthrough and gap report | S1, S5 | pending route | planned — blocked by T2, T6 | not implemented | #348 |

Order: T1 and T3 first (parallel); then T2 and T4; then T5 and T6; T7 last.

Excluded: npm/GitHub Packages publication (decision after T2), egdev.es migration (M1) and `HomeTemplate` removal (next milestone), enabling CI, transformation skills (only after T7).

Open decisions: versioning tooling (manual bumps + CHANGELOG recommended; changesets reconsidered with npm), new dependencies for T4/T5 (likely `@modelcontextprotocol/sdk`, `zod`), `CONTRIBUTING.md` still points to roadmap #8.

## Log

- **L1 — Original request (verbatim):** "vale,planifiquemos el siguiente milestone completo. Objetivo sistema de empaquetado para consumo de productos y configuración de mcp para conexión de agentes y gentle-design"
- **L2 — Owner answers to the planning questions (verbatim):** registry "creo recordar que comentamos de empezar con empaquetado local. Valoramos la opción de paquete npm pero no llegamos a concretar nada."; versioning "esto va muy ligado a como hagamos el versionado"; MCP "Paquete @egdev/mcp propio (Recomendado)"; gentle-design "design/system.md generado desde el DS (Recomendado)".
- **L3 — Prior plan recovered from Engram (project criterio, observations 25908 and 25867):** agreed order (1) validate the design system as a provider with local tarballs, without npm publication, checking Storybook/MCP and reconciling code, docs and catalog; (2) test gentle-design with the design system; (3) Pulso. HTML artboards do not run React; transformation skills only after the observed walkthrough. This milestone covers stage 1 and the base of stage 2.
- **L4 — Approval and publication (verbatim):** "apruebo, déjalo planificado en odd y github". Published: milestone 9, issues #342–#348 (labels `odd`, `type:*`, `status:needs-review`, no assignees), index #349 (`odd`, `documentation`). Drift check before writing: 0 open issues, no open milestone, no existing proposal marker. Issue cross-references filled after creation; all eight bodies read back identical apart from the trailing newline. No implementation, assignment or CONTRIBUTING.md change.
