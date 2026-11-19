# Tabs edge fade — v0.4

Implement the approved Tabs v0.4 scroll edge fade. Spec: `docs/components/tabs/v0.4/edge-fade-amendment.md`; plan: `docs/components/tabs/v0.4/implementation-plan.md`. Branch `feat/tabs-edge-fade`.

## Specs

- S1 — The approved spec v0.4 (`contentSHA256: 4bf76b8f014447af778d71e8ca9fcc532ce52419ab21ea180e66b2974b4404d0`), AC-01–AC-06.
- S2 — Owner decisions: "si" to the token `--mask-scroll-fade-inline`, a `tabs.css` limited to scroll-driven masking, option A (underline scrollbar stays hidden; chevrons are phase 2).
- S3 — The approved implementation plan (reply "si").
- S4 — Approved amendment v0.4-A `docs/components/tabs/v0.4/scroll-buttons-amendment.md` (AC-07–AC-13) and its approved plan section "Amendment v0.4-A plan" in `docs/components/tabs/v0.4/implementation-plan.md`.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S2 | Token `--mask-scroll-fade-inline` (corrected per L3) | inline | ff6438f (fixup pending) |
| T2 | S1–S3 | `tabs.css`, list CVA, tests, story | inline | see Log L5 |
| T3 | S4 | Scroll buttons, underline focus reveal, tests (v0.4-A) | inline | f884a52 |
| T4 | S1, S4 | Browser verification VIS-01..06, record evidence | inline | 7c2c1db, 1e5b6b9 |

## Log

- L1 — "podrías analizar el video de esta publicación para ver si pudiéramos aplicar algo de ux a nuestro componente de tabs? https://lnkd.in/p/dAawbKT4"
- L2 — "si" (prepare the spec) · "si" (approve the three decisions and save) · "dale" (prepare the plan) · "si" (approve and save the plan).
- L3 — Token defect found before browser checks: `var()` inside a `:root` token resolves at `:root`. Owner chose "Sí, token estático de tres capas": static three-layer mask, sized on the list.
- L4 — Owner in Storybook: "el gradiente tapa parte del ultimo elemento y no hay nada que permita scrolear en horizontal? habría que valorar añadir botones con flechas y ocultar el gradiente/botones al llegar a los extremos?" → amendment v0.4-A approved ("si"), plan approved ("si").
- L5 — Chrome 157: fade verified LTR/RTL/fullWidth (mask sizes 0 / 25.6px per edge at start, middle, end); underline arrow-key focus clipped up to 25px → covered by v0.4-A AC-12.
- L6 — T3 done inline (f884a52): AC-07–AC-13 unit-covered; full suite 3207/3207, typecheck and Biome clean. Stale-node tests re-query after `fullWidth` toggles (the scroll area wrapper remounts the list, per the compatibility note). The pre-existing `tabs-docgen` story list now includes `EdgeFade`.
- L7 — Chrome 157 (T4, f884a52): fine pointer shows the end button only at start, both mid-scroll; click pages 102px (153.6 − 2×25.6); inert-while-hovered holds at the end, an inert click does not scroll, pointer leave hides it; touch emulation gives `display: none` on every button; arrow-key sweep keeps each mid-list tab ≥ ~25px from both edges (0 only at the extremes, where no fade or button shows). **Defect (pre-existing, v0.2+):** Radix `Tabs.Root` writes `dir="ltr"` without a `DirectionProvider`, so `dir="rtl"` on an ancestor is ignored; the story's RTL example renders LTR and the L5 RTL measurement was invalid. With `dir="rtl"` forced on the root, buttons, paging (−102px), fade sizes and states all mirror correctly. Awaiting owner decision.
- L8 — Owner chose "Documentar DirectionProvider (recomendado)": no API change; RTL wording in v0.4 and v0.4-A now names the Radix `DirectionProvider`; the story uses it; `@radix-ui/react-direction@1.2.0` added as a `packages/ui` devDependency (already resolved transitively). Both snapshot hashes recomputed for the RTL wording change; the previous values (e8bc19cf…, c1a1450e…) were valid.
- L9 — T4: true RTL re-verified via `DirectionProvider` (root `dir="rtl"`, ArrowLeft forward, paging −102px, mirrored mask). Evidence in `docs/components/tabs/v0.4/verification.md` with four captures. Not evaluated: Firefox/Safari, forced colors, owner visual review of ghost chevrons over faded labels.
- L10 — Independent verify (Risk: item 3): no dependents on the tablist being a direct child of `.eg-tabs`; code rules met; typecheck clean. Blocker found and fixed: the L8 recomputation hashed from the first textual match of `## 1. Purpose and scope` (inside the hash-definition line), not the heading; hashes recomputed from the heading and the false "did not reproduce" note removed. Advisory: `scripts/catalog_data.py:52` / `docs/CATALOGO.md:96` still say Tabs has no stylesheet (stale since v0.4 T2).
- L11 — Full suite 3207/3207 after the hash fix; committed 7c2c1db (RTL DirectionProvider, catalog) and 1e5b6b9 (verification record). All tasks done; pending owner visual review of the chevrons, push and PR.
