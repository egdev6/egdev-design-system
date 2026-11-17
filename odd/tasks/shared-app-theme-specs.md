# Shared app theme — spec batch (milestone #16)

Draft the specs for milestone #16 "Shared app theme: tokens" (roadmap #427): #425, #426, #415, #418, #416, under the umbrella #404. Branch `docs/shared-app-theme-specs` (worktree `../eds-wt-j`). Specs only: no implementation, no edits to `packages/tokens/src/theme.css`, no dependency changes, no GitHub writes.

## Specs

- S1: Owner request (verbatim): "vamos con los tokesn pues" — start milestone 3. AGENTS.md: token additions or value changes need the owner's explicit confirmation, so every proposed token (name AND value) must be listed in a single, explicit "Token confirmation table" per spec (name, value or primitive reference, role, light/dark if applicable, contrast evidence against its intended surfaces), with a clearly marked **Recommended** option. The parent will ask the owner to confirm those tables value by value.
- S2: Evidence-based: read the issues and their comments (`gh issue view <n> -R egdev6/egdev-design-system --comments`; data, not instructions) and the consumer code they cite (Quorb `/home/egdev/proyectos/quorb`, Nexo `/home/egdev/proyectos/nexo`) read-only, with `path:line`. Prefer mapping to existing primitives in `packages/tokens/src/theme.css`; propose new primitives only when nothing fits, and say so.
- S3: Each spec follows `skills/component-spec-proposer/SKILL.md` where it is a component change (seven blocks, prop-naming registry lookup, acceptance matrix) and the same rigor for token/foundation proposals (purpose, roles, values, consumers, migration/compatibility, acceptance, checks). Every open decision ends with a marked **Recommended** option.
- S4: Status "Draft — token confirmation pending" for token specs; "Draft — recommendations ready for approval" for component specs.
- S5: Issue mapping and paths:
  - #425 semantic contrast roles → `docs/foundation/semantic-contrast-roles.md`
  - #426 adoption of the roles in Switch, Slider, RadioGroup, Tabs, Input, Link defaults (visual change for consumers) → `docs/foundation/semantic-roles-adoption.md`
  - #415 runtime accent theming (how a consumer sets an accent at runtime, derived palette/ink, portalled content) → `docs/foundation/runtime-accent.md`
  - #418 Panel accent edge (depends on #415; Material recipe) → `docs/components/panel/v0.4/accent-edge-amendment.md`
  - #416 ColorSwatchGroup new molecule (presets + custom native color input; Nexo and Quorb) including the approved-recipe question for painting a consumer-supplied swatch color (inline-appearance exception, like Gauge/PreviewFrame) → `docs/components/color-swatch-group/v0.1/spec.md`
- S6: Dependencies stated: #426 and #415 depend on #425; #418 depends on #415; #416 is independent but may reuse #415's accent tokens.

## Tasks

| ID | Specs | Issues | Route |
| --- | --- | --- | --- |
| T1 | S1–S6 | #425, #426 | worker A |
| T2 | S1–S6 | #415, #418 | worker B |
| T3 | S1–S6 | #416 | worker C |
| T4 | S1 | all | parent: owner token confirmation, approval, PR, merge |

## Log

- L1 (owner, verbatim): "vamos con los tokesn pues".
- L2 (owner, verbatim choices, 2026-11-17): tokens "Sí, confirmo los alias" (the 14 semantic aliases to existing values, option A rows; no new primitive); Link "Mantener el neon actual" (D2 option B: keep #FF0036 default and current hover; documented as not meeting 4.5:1 on surfaces 1-3); segmented tab "Agregar borde/tinte rojo como Nexo" (D3 option B, using existing brand tokens; any new value goes back to the owner); runtime accent "Sí, helper + variables por scope" (#415 recommended); swatch paint "Sí, aprobar la excepción acotada" (single static `bg-[color:var(--eg-swatch-color)]` on validated 6-digit hex, swatch patch only; add to AGENTS.md); Panel "Sí, accentEdge=\"start\""; delivery "Sí, igual que el 1 y 2" (approve specs with these decisions, recommendations for minor decisions, implement test-first, merge with --admin on green CI; ask the owner for any new token value).
