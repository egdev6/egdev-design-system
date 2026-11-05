# AmbientBackground — spec approval record

- **Approved artifact:** `docs/components/ambient-background/v0.2/spec.md`
- **SHA256:** `b8bf88ad08907905be2588513001c4ab2f44a7b79c66b77e8021ee3158269f4a`
- **Snapshot commit:** `73fe84b`; issue snapshot on #45.
- **Date:** 2026-11-05
- **Version identity — parent default under L23:** component contract v0.5, documented at web-catalog v0.2 path; this does not replace #45's historical v0.2 or v0.3/v0.4 records.
- **Independent axes — parent default under L23 (L25):** optional `lineDirection` and `squareDirection`, each independently selecting one of eight named angles; omitted values retain the existing 225° direction. Invalid runtime values fall back to 225° with a development warning. No other axis is added.
- **L26: names follow visible screen direction; default = today's motion.** The historical 225° canvas motion is `up-left`; L26 supersedes L25's name-to-angle mapping while retaining the same eight names and historical default.
- **Preset precedence — parent default under L23:** profile still determines density, speed and glow; each explicit direction overrides only its own family, including on profile changes. Unspecified directions retain the historical default.
- **Motion and performance — parent default under L23 (L25):** retain the existing single loop, per-profile counts, speed, narrow scaling and resource budget. No added particles or draw operations; reduced motion and forced colors retain existing behavior. Real frame-time benchmarking remains pending.
- **Visual reference — parent default under L23:** retain the uninspected inspiration as provenance only; no capture or visual approval is claimed. New visual references remain pending.
- **Naming — parent default under L23 (L25):** propose `lineDirection` and `squareDirection` as separate family-direction concepts; no existing registry entry covers particle movement direction. Registry integration belongs to the parent.
- **Owner delegation (L23, verbatim):** "no me preguntes termina todo y luego vemos (aplica las propuestas por defecto). Puedes abrir hasta 3 subagentes que parelilcen trabajo y permanezcan abiertos hasta terminar"

## Scope

Approves G4 for exactly the bytes above with these parent resolutions, G1 for A13, G5 for the new names scoped to AmbientBackground, and G7 for the plan in `docs/components/ambient-background/v0.2/plan.md`. Historical approvals remain unchanged. Visual conformity and frame-time measurement remain pending.
