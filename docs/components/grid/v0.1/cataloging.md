# Grid and GridItem v0.1 — cataloging decision: a generic layout primitive (#395)

- **Status:** **Approved** on 2026-11-27 by the owner, verbatim "Aprobar (Recomendado)" ([`odd/tasks/layout-grid-395.md`](../../../../odd/tasks/layout-grid-395.md) L4; [approval.md](approval.md)), together with the [spec](spec.md) and the [implementation plan](implementation-plan.md), each of which keeps its own gate (cataloging → spec → plan → code). It records the cataloging decision the owner answered in L3 (four answers, verbatim under "Owner answers") and the evidence behind it. Drafted on 2026-11-27 on `feat/layout-grid-395` (HEAD `e52a5a1`), uncommitted at approval. By itself it changes no code, token, dependency, registry entry, catalog row or Git state. It follows the `Borrador de decisión de catalogación` template of [`docs/CATALOGACION.md`](../../../CATALOGACION.md) with English headings.
- **Request:** [#395](https://github.com/egdev6/egdev-design-system/issues/395), "ui: no layout part for the About and Community two-column recipes" (open, label `status:needs-review`, milestone "Website III: scene parts", roadmap #491 order 3.3; read with `gh issue view` on 2026-11-27, read-only). Body, verbatim: "The About and Community scene recipes (`docs/components/web-catalog/v0.1/scene-recipes.md`, `packages/ui/src/recipes/scene-recipes.stories.tsx`) lay out their columns with consumer Tailwind utilities (`grid min-[48rem]:grid-cols-2`). A consumer that writes no utilities (egdev.es runs Tailwind with `source(none)`, see #392) can only stack them with `Stack`. Result in egdev6/egdev-website#16: full-width About/Live photos and stacked community cards at 1280 px." Expected, verbatim: "A layout primitive (for example a responsive `Grid`/`Split` with a column count and breakpoint) or exported scene organisms, so recipes need no consumer utilities." Owner comment of 2026-11-25, verbatim: "The Pulso Build zone in egdev.es needs the same missing layout part, plus item placement. From 1081px up it shows three equal project cards. Below that it uses a 12-column grid, where the featured card spans 7 columns and 2 rows next to 5-column cards. Reference: `egdev-foundation/reference-web/pulso-source.html:209-229` and `:558-568` in egdev6/egdev-website. Today egdev.es can only stack the cards with `Stack`." Consumer issues: egdev6/egdev-website#16, #45 and #49 (the listing pages; PR #50).
- **Owner authority:** L1, verbatim "dale", replying to the recommendation to start with #395. L3 holds the four answers quoted below. #491 listed one open owner decision for this issue (a generic layout primitive or exported scene organisms); the first answer resolves it. L3 covers no prop name, default, value range or token; L4 gives the prop name, "`columnCount` (Recomendado)", and approves this record, the spec and the plan with "Aprobar (Recomendado)" (quoted under "Owner answers (L4, verbatim)").
- **Companions:** [spec.md](spec.md) (Grid and GridItem v0.1, Approved) and [implementation-plan.md](implementation-plan.md) (Approved). The L4 answer approved all three documents, each as its own gate.

## Cataloging decision

- **Component:** `Grid` and `GridItem`, one folder with two named exports (the Stack and Cluster layout; BlogGrid also keeps its parts in one hook and one JSX file).
- **Level:** primitive. Reusable structure with no semantics, Material, copy or domain data and no coordination of controls (`docs/CATALOGACION.md`, primitive row of the level table and the signals table, "Base reutilizable sin coordinación de controles ni dominio").
- **Destination:** `@egdev/ui`.
- **Proposed path:** `packages/ui/src/primitives/grid/`.
- **Radix base:** none. Radix `Slot` only, through `@radix-ui/react-slot`, for `asChild`, exactly as Stack does; it is already a dependency (`packages/ui/package.json:45`), so no dependency changes.
- **Decision:** **new.** Owner-approved (L3): a generic `Grid` with a `GridItem` part, no scene organisms and no `Split`.
- **Existing pieces reused:** the exported types `LayoutGap` and `LayoutAlignItems` (type-only import from `primitives/stack/types.ts`), the spacing-token keys behind `gap`, `cn()`, `Slot`, and the two techniques Hero and BlogGrid already ship: inclusive viewport media queries and child resets.
- **Pieces to extract or create first:** none.
- **Blocks or questions:** none. OQ-1 (the column-count prop name) is resolved to `columnCount` and OQ-2 to OQ-7 as recommended (section "Resolved decisions", repeated in the spec).

## Evidence

**E1 — The three consumer layouts, read from the Pulso reference** (read-only: `egdev6/egdev-website`, `egdev-foundation/reference-web/pulso-source.html`, whole-file SHA-256 `778e5412b64d1b79195c51c0e47c78f654b46da445be8354a97e572774348f13`, the same hash the Carousel v0.4 spec records).

| Zone | Reference rule | Resulting layout | Owner decision |
| --- | --- | --- | --- |
| Build | `.build-grid` is 12 columns with a 20px gap (`:210`); `.proj` spans 5 and `.proj.feat` spans 7 columns and 2 rows (`:211`, `:213`); `@media (max-width:1080px){.proj.feat,.proj{grid-column:span 12;grid-row:auto}}` (`:490-491`); `@media (min-width:1081px){.build-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}` and `.proj,.proj.feat{grid-column:auto;grid-row:auto…}}` (`:558-560`) | One column at 1080px and below, three equal columns with a 16px gap (`--space-5`) at 1081px and above. The 7/5 featured layout is overridden in both ranges and never shows | "Seguir la referencia (Recomendado)" |
| About | `.about-grid{grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:clamp(32px,5vw,80px);align-items:stretch}` (`:167`); `@media (max-width:860px){.about-grid{grid-template-columns:minmax(0,1fr)}}` (`:508`) | Two columns at 5fr/6fr, one column at 860px and below | "Aproximarlo a 5/7 sobre 12 (Recomendado)" |
| Discord | `.dc-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}` (`:406`); `@media (max-width:760px){.dc-grid{grid-template-columns:minmax(0,1fr)}}` (`:417`) | Two equal columns, one column at 760px and below | "Sí, solo 860 y 1080 (Recomendado)" moves 760 to 860 |

The #395 comment says the 12-column 7/5 layout applies below 1081px. The reference CSS does not show it: that range uses `span 12` for every card. The owner chose to follow the reference. `span` and `rowSpan` stay because the listing pages still need item placement (L3). A different Pulso section, `.com-grid` (`:391`, 5fr/7fr photo and quote), is not part of #395.

**E2 — What exists today does not serve it.**

| Part | What it does | Why it is not enough |
| --- | --- | --- |
| `Stack` (`primitives/stack/types.ts:48`) | `flex flex-col flex-nowrap` with token gap and alignment | One axis: no columns, spans or collapse. It is the only layout part egdev.es can use today |
| `Cluster` | Wrapping `flex-row` | Items wrap by their own width; no equal tracks, spans or collapse |
| `BlogGrid` (`organisms/blog-grid/types.ts:55-68`) | A fixed 7fr/5fr feature and rows, collapsing at 1080px | Editorial and domain-shaped; its grid is private |
| `Hero` (`organisms/hero/types.ts:56-65`) | Copy and media at 1.3fr/1fr, collapsing at 860px | Scene-specific |
| `SectionHeader` `split` (`molecules/section-header/types.ts:90`) | A header grid behind the `section-header-split` breakpoint token | Header-specific |

`packages/ui/src/index.ts` exports no `Grid` or `GridItem`, and no file under `packages/ui/src` or `packages/effects/src` declares one (grep of `export … Grid|GridItem|GridProps|GridItemProps` finds nothing). Availability is read from the barrel, not from CSS or stories.

**E3 — The consumer constraint (S1).** The recipes lay their columns out with `grid gap-10 min-[48rem]:grid-cols-2 min-[48rem]:items-stretch` (About, `packages/ui/src/recipes/scene-recipes.stories.tsx:70`) and `grid items-stretch gap-6 min-[48rem]:grid-cols-2` (Community, `:103`). egdev.es runs `@import 'tailwindcss' source(none)` and imports effects before ui as the #392 workaround (`egdev-website/src/app/globals.css:1-12`; `docs/distribution/egdev-ds-cli.md:350`), so it cannot generate those utilities. Its projects listing already renders `<Stack asChild gap={6}><ul>` and cites #395 (`src/components/listing-projects.tsx:73-74`, `:109`), so a semantic list is part of the need.

**E4 — Breakpoints are inclusive, and Tailwind's `max-*` is not.** Hero and BlogGrid use `[@media(width<=860px)]` and `[@media(width<=1080px)]` (`hero/types.ts:61`, `blog-grid/types.ts:55-68`), matching the reference's `max-width`. Compiling candidates with the repo's installed `tailwindcss` 4.3.3 in a scratch directory outside the repository (not versioned evidence) shows: `max-[860px]:grid-cols-1` emits `@media (width < 860px)` (exclusive); `[@media(width<=860px)]:grid-cols-1` emits `@media (width<=860px)`; `[@media(width<=860px)]:[&>*]:col-auto` emits `… > * { grid-column: auto }` inside that block; and the media block follows the unconditional `.col-span-7`, `.row-span-2` and `.grid-cols-*` rules. The local build artifact `packages/ui/dist/styles.css` (git-ignored) shows the same order for BlogGrid (`@media (width<=1080px)` at line 11499, after `.col-span-2` at 6324 and `.grid-cols-1` at 7093). A theme breakpoint token exists for 860px (`--breakpoint-section-header-split`, `packages/tokens/src/theme.css:13`), but those tokens generate min-width variants and a custom property cannot be read inside a media condition, so literal widths follow the Hero and BlogGrid precedent. No token is proposed.

**E5 — Registry lookup** ([source](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md)), by meaning, name and alias. The registry has 193 entries and none declares an alias for these concepts.

| Concept | Entry | Verdict |
| --- | --- | --- |
| Spacing between items | `layout-gap` → `gap`, approved; Stack and Cluster use `LayoutGap` | **Reuse.** Its meaning covers "row and column gaps" of "a layout container" |
| Item alignment | `cross-axis-alignment` → `alignItems`, approved; its `whenToUse` names "a flex or grid layout container" | **Reuse** |
| Render onto the child | `slot-composition` → `asChild`, approved | **Reuse** for Grid and GridItem |
| Column count | `table-columns` → `columns`, approved: "Ordered column definitions of a data table…"; its `avoid` lists "CSS grid layout tracks" | **Collision.** `columns` cannot name a grid track count |
| Viewport collapse | none (swept: breakpoint, viewport, responsive, collapse, below). `compact-presentation` avoids "automatic responsive detection" | **New** `layout-collapse-below` → `collapseBelow` |
| Item column and row span | none (swept: span, column, row, placement) | **New** `grid-item-span` → `span` and `grid-item-row-span` → `rowSpan` |

`scripts/prop-naming.mjs:183` claims every canonical name or alias once, so a second entry named `columns` is rejected. A scratch run of `validateRegistry` (outside the repository, with empty usages so no source file is needed) on the registry plus one candidate gave: a second entry named `columns` fails with `Duplicate canonical name or alias: columns`, and so does an alias `columns`; a canonical `columnCount` passes; `columnCount` with a pending Grid exception to `columns` passes but grants no permission until the exception is approved; `collapseBelow`, `span` and `rowSpan` pass. So the L3 draft's "new `grid-columns` convention" with the name `columns` cannot be registered. Recommendation (OQ-1): canonical name `columnCount`.

**E6 — Effects and the #392 cascade.** `@egdev/effects/styles.css` is compiled from four `types.ts` files (`packages/effects/src/styles/compiled.css:2-5`). Its local build (`packages/effects/dist/styles.css`, 7,331 bytes) ships positioning, `.hidden`, `.block`, `.h-full`, `.w-full`, overflow, opacity and transition utilities, and declares none of `grid-template-columns`, `grid-column`, `grid-row`, `display: grid`, `gap` or `align-items`. Grid's collapse rules are exposed to the #392 mechanism (a later package's unconditional utility beating an earlier package's variant at equal specificity) only if effects ever ships one of those properties. Today there is no overlap in either import order.

## Decision gates

| Gate | Verdict | Evidence |
| --- | --- | --- |
| 1. Reuse | **Not enough.** Stack and Cluster have one axis; BlogGrid, Hero and SectionHeader own fixed domain shapes | E2 |
| 2. Variant | **Rejected.** A column axis on Stack would change a one-axis flow into a two-dimensional layout; `docs/CATALOGACION.md`: a variant stops being one when it introduces another responsibility | E2 |
| 3. Compose | **Rejected.** Composition needs consumer utilities, which is the request; egdev.es cannot generate them | E3 |
| 4. Extract | **Not applicable.** BlogGrid's grid is private and shaped for one feature; nothing hidden is reused | E2 |
| 5. New | **Yes.** A primitive in `@egdev/ui`, with the scene organisms and `Split` declined by the owner | Owner answer 1 |
| Block | **None.** The prop-name collision (E5) is resolved by the owner's choice of `columnCount` (OQ-1) | E5, L4 |

## Owner answers (L3, verbatim)

| Owner answer, verbatim | What it resolves | Where it lands |
| --- | --- | --- |
| "Grid genérico, sin organismos ni Split (Recomendado)" | The #491 decision: a generic layout primitive or exported scene organisms | A generic `Grid` with `GridItem`; no About or Community organisms, no `Split` |
| "Seguir la referencia (Recomendado)" | Build: the reference (E1) or the round-4 comment's 7/5 layout | L3's gloss: "Build uses `columns={3} collapseBelow={1080}`, and span/rowSpan stay for the listings" (the prop name is `columnCount`: OQ-1, resolved in L4) |
| "Aproximarlo a 5/7 sobre 12 (Recomendado)" | About: the reference is 5fr/6fr (E1) and has no exact form on 12 columns | A 12-column grid with spans 5 and 7 |
| "Sí, solo 860 y 1080 (Recomendado)" | The values `collapseBelow` accepts | Only 860 and 1080. L3's gloss: "Discord's 760 and the recipe's 48rem move to 860, pending visual review" |

## Owner answers (L4, verbatim)

| Owner answer, verbatim | What it resolves | Where it lands |
| --- | --- | --- |
| "`columnCount` (Recomendado)" | OQ-1, the column-count prop name (`columns` collides with `table-columns`) | The prop is `columnCount`, registry concept `grid-columns`; no exception |
| "Aprobar (Recomendado)" | The approval of this record, the spec and the plan. It covers the changelog under `## Unreleased` (renamed at the version bump), GridItem `asChild`, the other recommendations (OQ-3 to OQ-7), browser runs, packed consumers with effects present, the `(#395)` citation and the registry receipts for the new conventions | [approval.md](approval.md) |

## Proposed API (the spec is the contract)

`Grid`: `columnCount` (`1 | 2 | 3 | 4 | 12`), `gap` (`LayoutGap`), `alignItems` (`LayoutAlignItems`), `collapseBelow` (`860 | 1080`), `asChild`. `GridItem`: `span` (`1…12`), `rowSpan` (`1…4`), `asChild`. Static CVA maps, inclusive viewport media queries, a child reset on the root, no stylesheet, no token, no Radix beyond Slot. DOM order is the reading order: no `order`, no explicit lines, no dense packing.

## Impact

- **API:** two new components and four new proposed conventions; three reused conventions gain usages. No existing API, class, marker, token or dependency changes. Stack, Cluster, BlogGrid and Hero are untouched.
- **Consumers:** About and Community recipes migrate to Grid (owner: breakpoints move to 860, pending visual review). egdev-website can replace its `Stack` stacking and adopt Build, Discord and the listings. egdev.es still needs a release.
- **Parent-owned integration:** registry JSON and generated view, docgen and Controls pins, the system artifact, catalog rows (a new Grid row and a note on ProjectsGrid and CommunityGrid) and changelogs. The plan lists every path.

## Resolved decisions

| ID | Question and evidence | Recommendation and resolution |
| --- | --- | --- |
| OQ-1 | **Prop name for the column count.** `columns` is the approved canonical name of `table-columns`, which avoids "CSS grid layout tracks", and a second entry with that name fails `props:check` (E5). Options: A, `columnCount`; B, canonical `columnCount` plus a Grid-scoped exception to `columns`, which needs its own owner approval; C, another name | **A.** It passes the registry, follows `pageCount`, and needs no exception<br>**Resolved: `columnCount` (A)**, by the answer "`columnCount` (Recomendado)" (L4). |
| OQ-2 | **GridItem `asChild`.** The L3 draft gives `asChild` to Grid only. A semantic list needs `<ul>` and `<li>` items, and the projects listing already renders `Stack asChild` over a `ul` (E3) | **Yes**, for both parts<br>**Resolved: yes, both parts (A).** Covered by "Aprobar (Recomendado)" (L4, "GridItem `asChild`"). |
| OQ-3 | **`collapseBelow` is inclusive** ("at and below"), as every reference and precedent (E1, E4); the name reads as exclusive | **Keep the name** and document the inclusive rule in the prop, the registry text and the tests<br>**Resolved: keep the name and document the inclusive rule.** Covered by "the other recommendations (OQ-3 to OQ-7)" (L4). |
| OQ-4 | **Defaults and ranges** (not covered by the L3 answers): `columnCount` optional with default 1, `gap` default 4 (the Stack and Cluster default) and `alignItems` default `stretch` (Stack's), `span` 1 to 12, `rowSpan` 1 to 4, no `full` span | **As proposed**<br>**Resolved: as proposed.** Covered by "the other recommendations (OQ-3 to OQ-7)" (L4). |
| OQ-5 | **Exports:** inline unions and only `Grid`, `GridItem`, `GridProps`, `GridItemProps` (the Carousel `variant` precedent) | **As proposed**<br>**Resolved: as proposed.** Covered by "the other recommendations (OQ-3 to OQ-7)" (L4). |
| OQ-6 | **When the four conventions are approved.** The Pagination precedent records the receipt at plan approval | **At plan approval**, as a separate scoped receipt<br>**Resolved: at plan approval, as a separate scoped receipt.** Covered by "the registry receipts for the new conventions" (L4). |
| OQ-7 | **Unsupported runtime values** (untyped JavaScript): ignore silently, as Stack and Cluster do, or warn in development | **Ignore silently**<br>**Resolved: ignore silently.** Covered by "the other recommendations (OQ-3 to OQ-7)" (L4). |

## Not evaluated and limits

- No browser, Storybook, capture or measurement ran. The Pulso geometry is read from CSS, not captured. The Tailwind compile and the registry simulation ran in scratch directories outside the repository and are not versioned evidence.
- Visual conformity is **Not evaluated**: no capture exists and no expected design is adopted. The 860px move (Discord from 760, the recipe from 48rem) changes layout between those widths and is pending the owner's visual review.
- Real screen-reader output, zoom and forced colours are not evaluated. The issue and comment were read with `gh`; no file in `egdev-website` was changed.

## Next step

The owner approved this record, the [spec](spec.md) and the [plan](implementation-plan.md) on 2026-11-27 ([approval.md](approval.md)); code follows the plan.
