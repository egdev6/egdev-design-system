# Template specs — AppShell

Draft the v0.1 contract for the only `ui` template in `docs/CATALOGO.md`, AppShell, applying the recommended option for every decision, with captures and accepted prop conventions; publish one issue.
Branch `docs/template-specs`. Draft in `.playwright-mcp/specs/wave4/` (gitignored).

## Specs

- S1 — "si" (to "¿Seguimos con AppShell?") — scope: AppShell (template, `@egdev/ui`). SectionShell and HomeTemplate are web templates and stay app-owned.
- S2 — "no me preguntes, aplica tu las opciones sugeridas y si tengo que irerar en la revisión ya lo vemos" — every open decision gets the recommended option, recorded as an agent-applied decision.
- S3 — "no dejes pendientes. todo de una cuando definamos specs. añade captura y acepta props" — captures and accepted prop conventions; no open items.
- S4 — "como hablamos las specs van a issue en github" — one issue; later versions as comments.
- S5 — "sólo vamos a crear las issues. no vamos a cogerlas hasta que no estén todas" — specs only.

## Tasks

| ID | Specs | Work | Route | Commit |
| --- | --- | --- | --- | --- |
| T1 | S1–S3 | AppShell spec + specimen | worker | — |
| T2 | S3 | Review, capture specimen, consolidate conventions, PR | parent | — |
| T3 | S4 | Publish the issue after merge | parent | — |

## Log

- L1 — 2026-10-18 — "si" (continue with AppShell after the organism wave).
- L6 — Consolidation delivered (mvd8diti-2r-eb5o): 125 conventions, two additions, template naming receipt and exact prior-receipt chain, one prepared CREATE_ISSUE body with four VIS. Parent confirmed all 123 prior entries unchanged and removed only the worker's out-of-scope temporary helper `/tmp/egwork/partA.mjs`. Parent checks: props registry and 76 tests pass; finalizer check and 25 tests pass. Global lint fails on eight ignored local JSON files (wave3 live evidence/manifests and wave4 manifest); do not reformat fingerprinted evidence blindly. Targeted tracked-file Biome, typecheck and component tests running separately. No delivery authorization or remote writes yet.
- L5 — Fixes applied (mvd89ia5-2q-i4sp): viewport media query `min-[56rem]:`/`max-[56rem]:`, no root containment, skip link gated to the wide layout, flex specimen. Specimen recaptured and recorded in `docs/design/foundation-boards/v2026-10-18-wave4/specimens/`. Registry + publication prep: mvd8diti-2r-eb5o.
- L4 — Review: template boundary and landmarks clean (no duplicates), issue numbers clean (#53 is in the atom journal). Blocking: root size container would trap fixed descendants → switch with a viewport media query at 56rem; skip link gated to wide layout; CalendarGrid-in-main note; specimen fixes. Convention `status` stays as drafts use it; approval added at consolidation. Fixes assigned to the AppShell worker.
- L3 — T1 done (mvd7wlyh-2o-0fhr): 18 decisions; slots `sideNavigation`/`bottomNavigation` + children as main; CSS-only container query `@4xl/app-shell` (56rem, like CalendarGrid #126) switches only when both slots exist; renders the single `<main>` and a built-in skip link; no aside, no Dialog sheet. New conventions `side-navigation`, `bottom-navigation`. Specimen captured and viewed. Read-only review mvd86vln-2p-qr8a running.
- L2 — No Foundation AppShell source exists; anatomy derives from the catalog row (Sidebar, ModuleRail, TabBar; "Hoy se repite en las seis apps"), `docs/ARQUITECTURA.md` (template = layout of a view without real content) and the published Sidebar #123, ModuleRail #124 and TabBar #125 contracts.

- L7 — Owner authorized delivery issue with `status:approved`, commit, push and draft PR (no merge/implementation). Issue #128 created and read back. Parent tracked-file Biome, typecheck and 166 component tests passed; global local lint limitation is recorded above. PR uses nonclosing `Refs #128`.
