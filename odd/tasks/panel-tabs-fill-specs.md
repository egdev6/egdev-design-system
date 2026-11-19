# Panel v0.5 and Tabs v0.5 fill amendments (#499, #500)

Draft two coordinated spec amendments so Panel and Tabs can fill a definite-height host with fixed chrome and an internal scrolling region, requested by Recado. Branch `docs/panel-tabs-fill` from main.

## Specs

- S1 — Approved cataloging (Engram `catalog/499-500-panel-tabs-fill`): both are variants with one shared boolean prop `fill` (new prop-naming convention). Panel fill: root `h-full min-h-0`, Header/Footer `shrink-0`, Body `min-h-0 flex-1 overflow-y-auto` + `scrollbar-gutter: stable`, parts inherit through PanelContext. Tabs fill: root `h-full min-h-0`, list or v0.4-A scroll area `shrink-0`, active panel `min-h-0 flex-1 overflow-y-auto` + `scrollbar-gutter: stable`. Default off; current consumers and ModuleCard unchanged.
- S2 — Owner: native scrollbar only. No custom scrollbar styling, no Radix ScrollArea ("creo que estamos complicando más de lo debido"; `scrollbar-gutter: stable` avoids content shift). Keep the amendments short.
- S3 — Shared scenario: a fill Tabs inside a fill PanelBody must not create nested scrollbars; state how (the Tabs fills the body exactly).
- S4 — Open details to present with a recommendation each (not decided silently): PanelBody keyboard focus (native keyboard-focusable scrollers vs internal tabIndex + name); Tabs fill-mode inset focus ring (outline-offset-2 is clipped); Tabs panel `pt-4` placement; prop-naming convention ID/name for `fill`.
- S5 — Output: `docs/components/panel/v0.5/fill-amendment.md` and `docs/components/tabs/v0.5/fill-amendment.md`, status "Draft — not approved", following the latest approved amendment format of each component.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S5 | Draft both amendments | worker | see L2 |
| T2 | S4 | Owner decisions, approval, issue comments on #499/#500 | inline | pending |

## Log

- L1 — Owner asked about the scrollbar ("el tema del scrollbar no se puede solucionar con una simple regla css?", then "habia una propiedad css que hacia que el contenido no se modificara al mostrar/ocultar la scrollbar... creo que estamos complicando mas de lo debido") → `scrollbar-gutter: stable`, native bar; then "Apruebo y arranco las fichas".
- L2 — Worker drafted both amendments (convention `host-fill`/`fill`; D-P1, D-T1, D-T2, D-N open; risk: double scrollbar gutter in the nested case on classic scrollbars). Parent added D-G: PanelBody drops its stable gutter when its direct child is a fill Tabs (`:has()`). Owner: "Acepto todas" → D-P1 A (native focusable scrollers + inset ring, verified per engine), D-T1 A (`focus-visible:-outline-offset-2` in fill), D-T2 A (`pt-4` stays on the scrolling panel), D-N approve `host-fill`/`fill`, D-G `:has()` rule.
- L3 — Amendments approved: Panel v0.5 contentSHA256 a7842866…, Tabs v0.5 f9c81882…; D-G = Tabs root `data-fill` + PanelBody `has-[>[data-fill]]:[scrollbar-gutter:auto]` (Panel AC-08, Tabs AC-09).
