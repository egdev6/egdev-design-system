# Panel v0.5 and Tabs v0.5 fill — plans, implementation and joint release (#499, #500)

Implement the approved fill amendments and ship them in one release together with AttachmentField (#497, merged in 4b4d938). Branch `feat/panel-tabs-fill` from main 43adb70.

## Specs

- S1 — Approved amendments: `docs/components/panel/v0.5/fill-amendment.md` (contentSHA256 a7842866492a1553616c56a5bccc159ce726812a34a72b610d5b9888a7267a4b) and `docs/components/tabs/v0.5/fill-amendment.md` (f9c81882cd9ad0fc990bcb65e756016cb564f64ff3b28e1a34c73e790fce8bb6), owner reply "Acepto todas", including D-G (Tabs root `data-fill`; PanelBody `has-[>[data-fill]]:[scrollbar-gutter:auto]`).
- S2 — Owner: "todo junto" — implement Panel and Tabs fill, then one release with AttachmentField, Panel v0.5 and Tabs v0.5.
- S3 — Implementation plans need separate owner approval before code (component-contributor).
- S4 — Before the PR, run every CI Verify step locally (props:check, test:props, test:artifact, build without drift, test:cli, tokens tests, test:package-exports, test:package-consumption, test:package-release, plus docgen/controls tests and Biome on branch files).

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1, S3 | Implementation plans for Panel v0.5 and Tabs v0.5 | worker | see L2 |
| T2 | S1 | Panel v0.5 fill implementation | worker | a6acf3f |
| T3 | S1 | Tabs v0.5 fill implementation (incl. `data-fill`) | worker | 9df0d98 |
| T4 | S1, S4 | Registry (`host-fill`), artifact, browser verification (440×640, classic scrollbars), records | worker + inline | ce0d4bf, aafa53c, unit 5 |
| T5 | S2, S4 | Joint release (ui, system and dependents) after merge | inline | pending |

## Log

- L1 — Owner: "todo junto" (after AttachmentField and the fill amendments were merged).
- L2 — Plans written (shared registry/artifact/verification steps in the Panel plan). Owner: "Apruebo con las recomendaciones" → OQ1 approval record; OQ2 fingerprints from the base commit; OQ3 true-only variants; OQ4 VIS authorized; OQ5 typed samples + CSS assertion; OQ6 one joint record; OQ-T1 extra Tabs default pin; OQ-T2 `data-fill` after native props. Units 1 (Panel) and 2 (Tabs) run as parallel workers with disjoint surfaces.
- L3 — Units 1–2 by parallel workers: Panel fill (RED 13 failed/57 → GREEN 70/70; ModuleCard green) and Tabs fill (RED 14 failed/74 → GREEN 88/88). Parent fix (OQ-T2): Tabs drops any consumer `data-fill` when fill is off, so it cannot trigger PanelBody's gutter rule (RED observed, then GREEN). Combined 183/183, typecheck clean. FillHost stories deferred to unit 3.
- L4 — Units 3–4 by worker: FillHost stories (Panel, Tabs) and nested FillWithTabs; controls/docgen/CSS rows; package-consumption typed samples + fill/`:has` CSS assertions; `host-fill` registry entry (worker-written whenToUse/avoid), approval record docs/decisions/prop-naming-panel-tabs-fill-approval.json, 13 usage revisions refreshed; artifact regenerated. 601 focused tests, typecheck, props, artifact, system, exports 137, consumption 14 all pass.
- L5 — Unit 5 inline: Chrome 157 classic scrollbars at 440×640 — Panel body scrolls with fixed chrome, first Tab focuses the body with the inset ring, PageDown scrolls; Tabs panel scrolls with fixed list and inset outline (−1.6 px); nested case shows a single gutter (body `auto`, 0 px; panel 15 px). Fixed: both fill stories did not overflow (now 40 entries). Observation for the owner: native scrollbar renders light on the dark theme (no `color-scheme: dark`). Joint record: docs/components/panel/v0.5/implementation.md.
