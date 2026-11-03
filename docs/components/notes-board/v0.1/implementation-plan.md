# NotesBoard v0.1 — implementation plan

- **Status:** Proposed for separate owner approval. This document implements nothing and authorizes no source, test, registry, catalog, token, dependency, Git or remote action.
- **Coverage:** DP4 / **S3** in [web catalog task](../../../../odd/tasks/web-catalog.md); one component plan, not completion of the larger inventory or implementation.
- **Approved contract:** [NotesBoard v0.1](spec.md), issue [#295 approval comment 6597591171](https://github.com/egdev6/egdev-design-system/issues/295#issuecomment-6597591171), “Aprobar con las recomendaciones (Recomendado)”. Canonical payload SHA-256 `bc09219c3f9145ee5d53b2a9dc4b1872e7684519e9b5dbd076b0888a12cdf97e`, over the complete `## 1. Purpose and scope` heading line through EOF, including final LF. The frozen Proposed/Pending header is historical metadata, not a reversal of approval.
- **Plan identity:** Parent computes SHA-256 over the entire final plan file bytes, including its final newline, and records the hash with separate owner approval, following [layer (d) approvals](../../web-catalog/v0.1/layer-d-plan-approvals.md). Never embed a self-hash; any subsequent byte change needs a new hash and approval.
- **Visual references:** VIS-01 `bee92a82c92e5c855b4d93d0f84facf1ed45c2d39aca4f83f94981df17143b27`; VIS-02 `f5abb361275da7358e176b65c7cf5208b01ca796ab16cd59d8406a116736a227`. See [spec](spec.md) for conditions and approved differences. Capture adoption is not assumed from contract approval; request it separately. Visual conformity: **Not evaluated**.

## 1. Independent owner gates

Plan approval, authorization of future edit surfaces, capture adoption, and the following decisions are separate. Record each answer and the exact plan hash before implementation.

1. **NotesBoard-local inclusive breakpoint:** recommend `[@media(width<=1080px)]:` on the exact layout utilities in §3, with desktop base, no new token or dependency. The threshold is local to this component; prove emitted conditions and browser results at and around 1080px before relying on it. If emission or cascade fails, stop for a separately approved solution, not an approximation.
2. **Sticky offset and emission:** recommend static `top-[calc(var(--nav-height)+var(--space-10))]`, only when `sticky` is true above 1080px, with side alignment `self-start`; host must verify its actual navigation and content clearance. Prove the exact `calc` declaration and breakpoint variants emit and compute correctly. No scroll listener, inline style, hardcoded 42px or new token. Failure requires a separate decision.
3. **Naming convention:** recommend separate approval of the exact `board-sticky-side` / `sticky` entry in §5, with no aliases or exceptions. Contract or plan approval does not approve a global convention; do not fabricate a source revision or receipt.
4. **Legacy neutralization:** recommend the exact inventory and browser checks in §4, using only scoped static utilities and distinct internal markers, contingent on computed-style proof with the shipped CSS. Preserve legacy consumers. If utility cascade cannot deliver the contract, stop for explicit approval of a compliant scoped mechanism and, if necessary, a meaningful stylesheet role; no legacy edit or `!important` workaround.

## 2. Contract, files and ownership

Root is passive `div.eg-notes` with required `children`: one `NotesBoardSide`, then one `NotesBoardList`. Side accepts consumer children: SectionHeader and optional named `ul` of static Chip labels. List renders `ol` with direct consumer `li` children, including an empty list. Each row uses `ListItem variant="editorial" size="sm" asChild` around one anchor, `ListItemLeading` with `<time dateTime="YYYY-MM-DD">`, `ListItemBody`/`ListItemTitle`, and `ListItemTrailing` with a decorative arrow hidden from assistive technology. The host owns ordering, valid dates, link destinations, accessible heading and names, localization and semantic descendants. No inspection/cloning, parsing, sorting, built-in copy, filtering, events, router, direct Radix primitive, extra section or heading. Native Tab/Shift+Tab, Enter and ListItem focus remain intact. Long content wraps without clipping or reordering.

`sticky?: boolean` defaults to false. Root `className` supports outer margin, width and parent placement only; compatible native div attributes are forwarded except `role`, `style`, unsafe HTML and conflicting own fields. Parts accept children only; no part className, ref or `asChild`. `cn()` merges supported classes but cannot promise general cascade precedence. Section host owns its landmark and `aria-labelledby`; use a unique matching SectionHeader `titleId`, not a duplicate board ID. Consumer avoids a dangling label when SectionHeader title is blank.

**ChipGroup boundary:** the actual `ChipGroup` (`packages/ui/src/molecules/chip-group/types.ts`) is an options-driven Radix selection control with no children/static composition API. Therefore a “real ChipGroup static chips” fixture is not possible without changing its contract. The approved NotesBoard spec explicitly chooses a named `ul` with real `Chip mode="static"`, not ChipGroup. Browser-check those real static Chips and separately verify the existing ChipGroup remains a selection control; do not present it as the board's static container. Parent-only catalog clarification below records this distinction. Any demand to use ChipGroup for static topics requires separate owner-approved contract changes, not an invented adapter.

Future writer-owned files under `packages/ui/src/organisms/notes-board/`, subject to gates and explicit authorization:

| File | Responsibility |
| --- | --- |
| `types.ts` | Own props, English JSDoc and Controls metadata, static token-backed CVA recipes per part. |
| `useNotesBoard.ts` | Meaningful sticky/default derivation and per-part CVA/`cn()`; no scroll state. |
| `NotesBoard.tsx` | JSX-only root and two named parts; preserve supplied content. |
| `NotesBoard.test.tsx` | Public criterion-level tests and hook tests. |
| `NotesBoard.stories.tsx` | English autodocs and real composition examples. |
| `index.ts` | Named components and public types, no unapproved variant exports. |

**No stylesheet**, contingent on gates 1, 2 and 4 and actual emission/cascade proof. No extra module, dependency, token, inline geometry or appearance. If utility-only fails, stop; no dummy CSS or assumed exception. Parent owns public package integration, source scanning, fixtures, registry and catalog. `packages/ui/src/styles/compiled.css` lists organisms individually: add this `types.ts` scan in future integration; inspect `.storybook/preview.css` and add story scanning if needed. Never change frozen spec, references, legacy or child implementations as a shortcut.

## 3. Proposed static layout and emission inventory

Desktop root: `grid grid-cols-[minmax(0,4fr)_minmax(0,7fr)] gap-10 items-center`; at ≤1080px use `[@media(width<=1080px)]:grid-cols-1` and `[@media(width<=1080px)]:gap-8`. Side: `flex flex-col items-start gap-2 min-w-0`; list: `list-none m-0 p-0 flex flex-col gap-2 min-w-0`. Consumer topic example uses `list-none m-0 p-0 flex flex-wrap gap-2` with a localized accessible list name. Confirm `gap-10`, `gap-8`, `gap-2` resolve to the existing corresponding space tokens, not a default scale. Long unbroken strings and actual ListItem sizing need browser proof; do not add an unsupported appearance override to a child to force wrapping.

When `sticky` is true, side uses `sticky self-start top-[calc(var(--nav-height)+var(--space-10))]` plus `[@media(width<=1080px)]:static` and `[@media(width<=1080px)]:self-auto`; false has normal flow. The narrow reset avoids sticky at exactly 1080px; static classes remain literal, not interpolated. Check the scroll container, side height and actual host header: CSS sticky is constrained by its ancestor and does not guarantee clearance from every host bar.

**Complete proposed arbitrary/variant utility inventory for parent emission proof:**

- `grid-cols-[minmax(0,4fr)_minmax(0,7fr)]`;
- `[@media(width<=1080px)]:grid-cols-1`;
- `[@media(width<=1080px)]:gap-8`;
- `top-[calc(var(--nav-height)+var(--space-10))]`;
- `[@media(width<=1080px)]:static`;
- `[@media(width<=1080px)]:self-auto`.

These are candidates, not observed outputs. Parent reports that its installed-compiler probe showed `md:` emits nothing, static `max-[X]:`/`min-[X]:` and arbitrary `[@media(...)]:` variants emit, and `max-[X]:` means exclusive `width < X`; the [batch-1 record](../../web-catalog/v0.1/layer-d-plan-approvals.md) documents the related probe and Footer's inclusive 860px mechanism. This does **not** prove the six exact utilities above. Before approval parent must prove each exact candidate in the installed compiler; future production build must separately assert selectors, declarations, media context and source scanning. Do not use `md:` or `max-[1080px]:` as a substitute. Any new arbitrary or variant utility added later needs the same proof and, if it changes the approved mechanism, renewed approval.

## 4. Legacy and UA inventory — gate 4

`packages/ui/src/styles/index.css` imports legacy in `@layer components` before `utilities`; verify actual packed `@egdev/ui/styles.css` and cascade, not source class order. The spec warns about unlayered imports: also test supported consumer import conditions. `cn()` cannot resolve CSS layer or specificity conflicts.

| Source selector | Local strategy and computed proof |
| --- | --- |
| `.eg-notes` (`bundle.css:896–904`) | Retain public root; explicitly set display grid, tracks `minmax(0,4fr) minmax(0,7fr)`, gap `--space-10`, and `align-items:center`; at ≤1080 reset tracks to one and gap to `--space-8`. Measure every property at 1079/1080/1081 and fractional boundaries. Ensure no board background, border or shadow is introduced. |
| `.eg-notes__side`, `__topics`, `__list`, `__list > li + li`, `--sticky .eg-notes__side` | Do not emit any of these old part or modifier markers. Distinct internal markers have no public selector API. Own side flex/gap and sticky position/top/alignment; own list gap without inherited row margins. Check computed margin, padding, display, position, top and align-self both sticky states and widths. |
| `.eg-note`, `__date`, `__month`, `__title`, `--compact`, hover/focus/icon and ≤560px arrow hiding (`:329–344`) | New rows use delivered ListItem, never `.eg-note*`. Verify real row grid, padding, color, border, background/image, both backdrop filters, shadow, transform, transition, focus and arrow display at 560px and below, at rest/hover/focus; no legacy glass or translation. Do not strip ListItem's approved raised recipe or focus. |
| `.eg-section--grafito :is(.eg-note,.eg-article)` and hover (`:1741–1742`) | No `.eg-note` means these selectors cannot match new rows. Compare actual ListItem paint, image, both filters and hover inside/outside a real Grafito host, and preserve an untouched legacy note fixture where the Grafito override continues to apply. |
| UA `ol`/`ul` | Explicit `list-none m-0 p-0` for board list and example topics; verify computed block/inline margins, padding, markers and direct `li` layout with and without preflight. Do not remove `ol` semantics or invent interactive topic roles. |

Measure old legacy root, side, sticky and note fixtures alongside the new board to demonstrate unchanged legacy behavior. Test in the actual shipped cascade; if a reset loses, do not claim a class-string test proves safety. Layer (c) browser checks found hidden legacy paint and clipping in ArticleFeature, mismatched layout in CommunityCard and root/negative-margin collisions in NowCard; preserve failing browser evidence, correct locally only after a RED, and recheck geometry after resets.

## 5. Naming proposal — gate 3

Exact proposed registry entry, before a source exists:

```json
{
  "id": "board-sticky-side",
  "name": "sticky",
  "meaning": "Whether an editorial board's side column uses sticky positioning when its layout permits.",
  "whenToUse": "Request sticky positioning for the side column of a board, subject to its layout boundary.",
  "avoid": "Do not use for scroll state, a generic fixed header, or an uncontrolled scroll listener.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": [],
  "usages": []
}
```

Recheck registry by meaning, name and aliases before integration. Following separate convention approval, parent records a recoverable receipt with exact `convention:board-sticky-side` scope and canonical convention hash; only after reviewing actual `NotesBoardProps` source add usage with type `boolean` and `source: {path: "packages/ui/src/organisms/notes-board/types.ts", symbol: "NotesBoardProps", revision: "sha256:<actual whole-file byte hash>"}`. Do not promote from component approval or invent evidence. Parent regenerates with `pnpm props:docs`, then runs `pnpm props:check` and `pnpm test:props` when authorized. Native children/className are not new conventions.

## 6. RED → GREEN → preserve

Future work only: add a public-interface behavior test for each NB criterion and capture its intended RED before implementing that criterion. For browser-only geometry/paint use a failing real built-CSS/browser assertion first; if not meaningful before a module exists, record the minimal failing scaffold and exact limitation, not a jsdom geometry claim. Implement minimally, observe focused GREEN, then refactor only while green.

| RED | Required observable behavior and evidence |
| --- | --- |
| NB-01 | Passive root, side before ordered list, direct ordered rows and empty `ol` without invented message. |
| NB-02 | Named host section and supplied SectionHeader matching unique `titleId` across multiple boards; no board landmark or duplicate IDs. |
| NB-03 | Named topic `ul` with real static Chips, no pressed/filter behavior, no topic tab stops; existing ChipGroup remains independently selectable, not a static wrapper. |
| NB-04 | Direct `li` → one editorial asChild anchor, readable date/title, `<time datetime>` and decorative hidden arrow; one row tab stop and native Enter navigation, no nested controls. |
| NB-05 | Consumer reorder is preserved across rerender, destinations unchanged, no parsing, sort, callbacks or domain copy. |
| NB-06 | Built CSS plus Chromium: 4fr/7fr above, single column at/below, 1079/1080/1081 and fractional widths, long titles, 200% zoom and no clipping/overflow. |
| NB-07 | Default normal flow, true sticky only above boundary; real scroll/resize with fixed host bar and measured offset and no occlusion, not a synthetic scroll listener. |
| NB-08 | §4 computed collision inventory with shipped styles and unchanged legacy fixture, no old part/note markers. |
| NB-09 | Token-backed typography, approved raised rows, no board paint; real focus, contrast and reduced motion, including hover and Grafito host. |
| NB-10 | Exports, native forwarding/exclusions and supported layout-only merge, negative types, actual docgen/Controls, production CSS and packed React 18/19 consumer without Tailwind. |

PRESERVE: leave SectionHeader, Chip, ChipGroup, ListItem, shared helpers and legacy untouched; run their authorized focused existing checks and package/metadata tests. If shared code must change, stop for separate scope; add preservation coverage and differential checks for affected unrelated consumers as applicable. Do not snapshot complete class strings. Confirm shared test/export structure against main after integration, including column-0 statements, nesting and duplicates.

## 7. Stories, docgen and browser checks

Use `Organisms/NotesBoard`, `Meta<typeof NotesBoard>`, `StoryObj`, autodocs, English copy, no manual `argTypes`, `play` or renderer adapter. `Default` provides required children but does not set `sticky`; add `Empty`, `Topics`, `DatedNotes`, `Sticky`, `LongTitles`, `MultipleBoards` and a host-section example with unique heading IDs. Use real existing SectionHeader, Chip and ListItem APIs; confirm their current contracts before writing. Provide sample dates/destinations, not baked-in component data.

Annotate `sticky` with `@control boolean` and actual `@default false`; ReactNode children use `@control false` with concrete reason and story reference, including part declarations. No fabricated defaults or redeclared native fields. Verify real `react-docgen-typescript` requiredness/defaults and native props, AST coverage and installed extraction/enhancer/inference with zero owned diagnostics, then exercise actual Controls widgets in Chromium; metadata alone is not evidence.

In real Chromium, Storybook and a packed consumer with shipped tokens/styles, record browser/version, viewport, DPR, fonts, theme, media settings, measured computed styles and screenshots. At 1079, 1080, 1081 and immediately adjacent fractional widths verify order, grid tracks, gap, sticky off/on and resize; also 390/1280 under the reference conditions. Scroll a sufficiently tall board beneath a real fixed bar and verify side top, host clearance, end-of-container constraint and no overlap. Exercise long titles, unbroken content and 200% zoom. Verify real named static Chip list, ordered list/direct items, dates, accessible link names, arrow hidden from accessibility tree, Tab/Shift+Tab, Enter and visible focus. Check contrast, reduced motion, Grafito and §4 legacy controls. Compare VIS-01/02 only under equivalent conditions and record approved solid-row differences; do not overwrite references. Accessibility-tree inspection is not a screen-reader run; report visual adoption, native zoom, touch targets or assistive technology as not evaluated unless actually checked.

## 8. Parent integration and catalog

Parent, subject to future explicit authorization, integrates `packages/ui/src/index.ts`, production and any needed story scans, real docgen/controls tests, `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs`. Assert named runtime/type exports, no private hook or unsupported props, native forwarding and negative types, SSR/hydration, emitted CSS including every §3 candidate, and actual packed React 18/19 consumption using tokens and UI styles without a consumer Tailwind compiler. Preserve all existing export and fixture behavior. Schedule focused checks first; broader typecheck, lint, tests, build, package and naming suites require explicit future authorization. Report observed output, not planned success.

**Catalog is parent-only:** after implementation and separate authorization, update only the NotesBoard row in `scripts/catalog_data.py` to reflect SectionHeader + named static Chip list + editorial ListItem composition, not a selection ChipGroup; mark implemented only when evidenced. Parent runs `python3 scripts/build_catalog.py` to regenerate `docs/CATALOGO.md` and `docs/catalog.json`, with a single coordinated writer; never hand-edit generated files. This proposal changes no catalog row.

## 9. Bounded units, risks and stop line

- **A — component writer:** six files and criterion-level RED/GREEN, after applicable gates and scoped edit authorization.
- **B — parent integration:** production/story scanning, exports, metadata, packed fixtures, reviewed naming receipt and usages; prove exact emission and structural merge integrity.
- **C — parent catalog:** one authorized row clarification and regeneration, coordinated with other layer (d) work.
- **D — parent browser/evidence:** Chromium boundary, sticky, legacy, semantics, Controls and visual checks; record observed outcomes and limitations.

**Risks and unverified items:** the six exact utility emissions and their cascade are unproven; an independently imported unlayered legacy sheet may defeat utilities. Sticky depends on host header height and scrolling ancestors. The current ChipGroup cannot render static children; satisfying a literal ChipGroup-static fixture would widen the approved contract. Consumer-provided children, valid dates and accessible heading associations cannot be enforced by this API. Long row wrapping, actual contrast, focus, touch target, React 18/19 package consumption, browser Controls, visual adoption and screen-reader behavior remain unverified. VIS captures do not prove sticky or boundary behavior.

**Stop:** no implementation follows from contract or plan proposal alone. Obtain the independent owner decisions, exact whole-file plan approval and future edit authorization; stop for owner resolution if emission, cascade, offset, static-topic composition, token availability or any acceptance criterion cannot be satisfied without changing the approved contract. Never silently widen v0.1 or substitute a stylesheet, dependency or legacy edit.
