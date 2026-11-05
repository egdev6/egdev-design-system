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
| T1 | Versioned local tarballs: `release:pack`, semver 0.x policy, per-package CHANGELOG, install guide | S1–S3 | pending route | approved — plan docs/odd/distribution/342-local-tarballs.md; implementation not started | not implemented | #342 |
| T2 | Isolated pilot consumer installed from tarballs (both CSS modes, WebTemplate + WebSection page) | S1, S2 | pending route | approved — plan docs/odd/distribution/343-pilot-consumer.md; implementation not started (blocked by T1) | not implemented | #343 |
| T3 | Storybook MCP manifest test aligned with public exports; agent connection guide | S1 | pending route | approved — plan docs/odd/distribution/344-storybook-mcp.md; implementation not started | not implemented | #344 |
| T4 | Versioned design system data artifact (catalog, props, tokens, Material recipes, naming) | S1, S4, S5 | pending route | approved — plan docs/odd/distribution/345-data-artifact.md; implementation not started (blocked by T1) | not implemented | #345 |
| T5 | `@egdev/mcp` offline stdio MCP server over the artifact | S1, S4 | pending route | approved — plan docs/odd/distribution/346-egdev-mcp.md; implementation not started (blocked by T4; dependencies approved) | not implemented | #346 |
| T6 | Generated `design/system.md` for gentle-design | S1, S5 | pending route | approved — plan docs/odd/distribution/347-system-md.md; implementation not started (blocked by T4; T5 for the MCP path) | not implemented | #347 |
| T7 | Observed gentle-design walkthrough and gap report | S1, S5 | pending route | approved — plan docs/odd/distribution/348-gentle-design-walkthrough.md; implementation not started (blocked by T2, T6) | not implemented | #348 |

Order: T1 and T3 first (parallel); then T2 and T4; then T5 and T6; T7 last.

Excluded: npm/GitHub Packages publication (decision after T2), egdev.es migration (M1) and `HomeTemplate` removal (next milestone), enabling CI, transformation skills (only after T7).

Resolved decisions (L6): manual bumps + per-package CHANGELOG (changesets reconsidered with npm); `@modelcontextprotocol/sdk` + `zod` exact pins approved for T5 only; release set ordering — `release:pack` packs the release-set members that exist, and T4 (`@egdev/system`) and T5 (`@egdev/mcp`) each add their package to the set with its own test (L7). Still open: `CONTRIBUTING.md` points to roadmap #8.

## Log

- **L1 — Original request (verbatim):** "vale,planifiquemos el siguiente milestone completo. Objetivo sistema de empaquetado para consumo de productos y configuración de mcp para conexión de agentes y gentle-design"
- **L2 — Owner answers to the planning questions (verbatim):** registry "creo recordar que comentamos de empezar con empaquetado local. Valoramos la opción de paquete npm pero no llegamos a concretar nada."; versioning "esto va muy ligado a como hagamos el versionado"; MCP "Paquete @egdev/mcp propio (Recomendado)"; gentle-design "design/system.md generado desde el DS (Recomendado)".
- **L3 — Prior plan recovered from Engram (project criterio, observations 25908 and 25867):** agreed order (1) validate the design system as a provider with local tarballs, without npm publication, checking Storybook/MCP and reconciling code, docs and catalog; (2) test gentle-design with the design system; (3) Pulso. HTML artboards do not run React; transformation skills only after the observed walkthrough. This milestone covers stage 1 and the base of stage 2.
- **L4 — Approval and publication (verbatim):** "apruebo, déjalo planificado en odd y github". Published: milestone 9, issues #342–#348 (labels `odd`, `type:*`, `status:needs-review`, no assignees), index #349 (`odd`, `documentation`). Drift check before writing: 0 open issues, no open milestone, no existing proposal marker. Issue cross-references filled after creation; all eight bodies read back identical apart from the trailing newline. No implementation, assignment or CONTRIBUTING.md change.
- **L5 — #343 D3 owner decision (verbatim):** "sólo dark" — the pilot validates the dark token theme only; light is recorded as not applicable (no light theme exists, `packages/tokens/src/theme.css:16`). No token theme is added.
- **L6 — Owner approval of the seven draft plans (verbatim answers, 2026-11-05):** structure "Paquete nuevo @egdev/system (Recomendado)"; React peer "^18.3.1 || ^19.3.0 (Recomendado)" (#342 D5); MCP dependencies "SDK MCP + zod, versión exacta (Recomendado)" (#346 Q1 — the owner's dependency confirmation for #346 only, versions pinned at implementation time); everything else "Aceptar todas las recomendaciones (Recomendado)", so every remaining decision takes its document's recommended option (and #343 D3 stays "sólo dark"). Consequences: a new data-only package **`@egdev/system`** carries `design-system.json` and the `system.md` renderer, `@egdev/mcp` depends on it, and `release:pack` packs **five packages** — tokens, ui, effects, system, mcp. **#346 Q3 / #347 P5 reconciliation** (accepted as part of "accept all recommendations"): Q3 recommended only the four issue tools while P5 recommended adding `get_design_system_md` and said Q3 must be reopened; resolved as P5 (a) — #346 serves the four issue tools plus `get_design_system_md` (which returns #347's rendered string through the carrier's renderer), and no other extra tool (no `get_prop_naming`, no `get_version`). Each of the seven plans now carries an `## Owner approval` table with every decision ID. Applied on top of the plan commits `ebfc050`, `8db0c52`, `0785d6b`, `4b0260a`, `e9bfaea`, `21924e3`, `5118c10` on branch `docs/distribution-plans`; no implementation, no source, `package.json`, token or dependency change, and no GitHub change.
- **L7 — Release-set ordering (parent, under L6 "Aceptar todas las recomendaciones" and #346 Q5 (a) "amend #342 R1"):** T1 lands before the `@egdev/system` and `@egdev/mcp` packages exist, so `release:pack` packs the release-set members present in the workspace; T4 and T5 each add their package to the set in the same commit that creates it, with a test that the new tarball is produced.
