# #395 — layout part for two-column recipes and the project grid

Branch `feat/layout-grid-395`. Roadmap #491, milestone "Website III: scene parts", order 3.3. Consumer issues egdev6/egdev-website#16, #45 and #49. Gates: cataloging → spec → plan → code, each approved by the owner. #491 lists one open owner decision for this issue: a generic layout primitive (`Grid`/`Split`) or exported scene organisms.

## Specs

- S1 — #395 body, verbatim: "The About and Community scene recipes (`docs/components/web-catalog/v0.1/scene-recipes.md`, `packages/ui/src/recipes/scene-recipes.stories.tsx`) lay out their columns with consumer Tailwind utilities (`grid min-[48rem]:grid-cols-2`). A consumer that writes no utilities (egdev.es runs Tailwind with `source(none)`, see #392) can only stack them with `Stack`." Expected, verbatim: "A layout primitive (for example a responsive `Grid`/`Split` with a column count and breakpoint) or exported scene organisms, so recipes need no consumer utilities."
- S2 — #395 comment (round 4), verbatim: "The Pulso Build zone in egdev.es needs the same missing layout part, plus item placement. From 1081px up it shows three equal project cards. Below that it uses a 12-column grid, where the featured card spans 7 columns and 2 rows next to 5-column cards."
- S3 — Also needed by the website's new listing pages (egdev6/egdev-website#49 and PR #50): a projects grid and the two-column layouts in About, Build and Discord.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S3 | Cataloging, including the #491 owner decision | explorer + owner | — |
| T2 | S1–S3 | Spec and plan; owner approval | writer + owner | pending |
| T3 | S1–S3 | Implementation, test-first | writer | pending |
| T4 | — | Closure entry L5 in odd/tasks/release-ui-0.11.0.md (round 5 release closure) | inline | this branch |
| T5 | S1–S3 | PR, owner merge, release, close #395, notify the website | inline | pending |

## Log

- L1 — Owner request, verbatim: "dale", in reply to the recommendation to start with #395.
- L2 — #395 is open and unassigned, and no PR references it.
- L3 — The explorer's cataloging draft recommends a new primitive `Grid` plus a `GridItem` part in `@egdev/ui` (packages/ui/src/primitives/grid/), with Radix none, no stylesheet and no tokens.
  - Draft API: `columns: 1|2|3|4|12` (new `grid-columns` convention), `gap` (`layout-gap`), `alignItems` (`cross-axis-alignment`), `collapseBelow?: 860|1080` (new `layout-collapse-below`) and `asChild`. GridItem takes `span` (new `grid-item-span`) and `rowSpan` (new `grid-item-row-span`).
  - Approach: static CVA maps, inclusive viewport media queries (Hero and BlogGrid precedent), and the child reset on the root via `[&>…]`.
  - Evidence: the Pulso reference shows Build as one column at ≤1080 and three equal columns at ≥1081. The 7/5 featured layout from the round-4 #395 comment is never shown.

  Owner answers, verbatim:
  - "Grid genérico, sin organismos ni Split (Recomendado)". This resolves the #491 decision.
  - "Seguir la referencia (Recomendado)". Build uses `columns={3} collapseBelow={1080}`, and span/rowSpan stay for the listings.
  - "Aproximarlo a 5/7 sobre 12 (Recomendado)".
  - "Sí, solo 860 y 1080 (Recomendado)". Discord's 760 and the recipe's 48rem move to 860, pending visual review.
- L4 — Spec (`4dcb1c58`) and plan (`767a68f6`) were drafted. Owner answers, verbatim:
  - Name: "`columnCount` (Recomendado)". `columns` collides with the `table-columns` canonical name in the registry.
  - Approval: "Aprobar (Recomendado)". It covers:
    - the changelog under `## Unreleased` (renamed at the version bump);
    - GridItem `asChild`;
    - the other recommendations (OQ-3 to OQ-7);
    - browser runs, packed consumers with effects present, and the `(#395)` citation;
    - the registry receipts for the new conventions.
