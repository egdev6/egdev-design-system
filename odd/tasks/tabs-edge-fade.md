# Tabs edge fade — v0.4

Implement the approved Tabs v0.4 scroll edge fade. Spec: `docs/components/tabs/v0.4/edge-fade-amendment.md`; plan: `docs/components/tabs/v0.4/implementation-plan.md`. Branch `feat/tabs-edge-fade`.

## Specs

- S1 — The approved spec v0.4 (`contentSHA256: e8bc19cf5ffea4b4a1392a3bcea10ee91bde7259975d970613fd189a3b6d68c2`), AC-01–AC-06.
- S2 — Owner decisions: "si" to the token `--mask-scroll-fade-inline`, a `tabs.css` limited to scroll-driven masking, option A (underline scrollbar stays hidden; chevrons are phase 2).
- S3 — The approved implementation plan (reply "si").
- S4 — Approved amendment v0.4-A `docs/components/tabs/v0.4/scroll-buttons-amendment.md` (AC-07–AC-13) and its approved plan section "Amendment v0.4-A plan" in `docs/components/tabs/v0.4/implementation-plan.md`.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S2 | Token `--mask-scroll-fade-inline` (corrected per L3) | inline | ff6438f (fixup pending) |
| T2 | S1–S3 | `tabs.css`, list CVA, tests, story | inline | see Log L5 |
| T3 | S4 | Scroll buttons, underline focus reveal, tests (v0.4-A) | worker | pending |
| T4 | S1, S4 | Browser verification VIS-01..06, record evidence | inline | pending |

## Log

- L1 — "podrías analizar el video de esta publicación para ver si pudiéramos aplicar algo de ux a nuestro componente de tabs? https://lnkd.in/p/dAawbKT4"
- L2 — "si" (prepare the spec) · "si" (approve the three decisions and save) · "dale" (prepare the plan) · "si" (approve and save the plan).
- L3 — Token defect found before browser checks: `var()` inside a `:root` token resolves at `:root`. Owner chose "Sí, token estático de tres capas": static three-layer mask, sized on the list.
- L4 — Owner in Storybook: "el gradiente tapa parte del ultimo elemento y no hay nada que permita scrolear en horizontal? habría que valorar añadir botones con flechas y ocultar el gradiente/botones al llegar a los extremos?" → amendment v0.4-A approved ("si"), plan approved ("si").
- L5 — Chrome 157: fade verified LTR/RTL/fullWidth (mask sizes 0 / 25.6px per edge at start, middle, end); underline arrow-key focus clipped up to 25px → covered by v0.4-A AC-12.
