# ArticleFeature v0.1 — implementation plan

- **Status:** Proposed. Presented for separate owner approval; it authorizes no code, no registry write, no catalog regeneration and no Git action.
- **Contract authority:** [spec.md](spec.md) v0.1 and its byte-identical published snapshot [issue-comment.md](issue-comment.md) (issue body). `version: 0.1`; `contentSHA256: 9b099d34e4fd042f93d16f704fdb2741ac222220d96c3fb335a2340f29a994b6` — reproduced byte-exact in this working tree with the spec's own rule; local `spec.md` and `issue-comment.md` payloads are identical. Visual hash: VIS-01 `b9d8db80b1deea14ddc0871d7f4d922e013d0cff4818a01512f5c5254b1d1880` (capture `article-feature--variants--1280x1400--dark.png`, conditions in [capture.json](capture.json)).
- **Contract approval + conventions:** [issue #280 comment 6581572442](https://github.com/egdev6/egdev-design-system/issues/280#issuecomment-6581572442) (2026-11-02, recorded in `odd/tasks/web-catalog.md` L17), owner answer verbatim: `"Aprobar las recomendaciones"`. Every OQ (OQ-1…OQ-6) resolved as recommended: generative cover is a recessed well + `aria-hidden` word (no halo, no isotype mark); `actionLabel` is a paint-only prop; the token title step `--text-heading-small` is accepted; hover is the approved `ListItem v0.2` anchor treatment; the root **is the anchor** (`a`, or the consumer's anchor through `asChild`); `detail` is a new convention. The same questionnaire **explicitly offered and approved** the four naming conventions `card-link-action-label`, `content-detail`, `decorative-cover-word` and `cover-badge` (recorded in L17); that approval comment is the recoverable convention artifact — no reapproval is requested.
- **Plan identity:** `contentSHA256: c5a5230a2ae56587b27d447c9b971034d61a6788b1e7fc19751852df231a4b7f` — SHA-256 of the UTF-8, LF, final-newline payload from `## 1. Authority and gates` through EOF.
- **Baseline:** branch `docs/web-catalog-layer-c-specs-2`, commit `fc6f977`. Current reviewed source bytes: `packages/ui/src/index.ts` `f85891be…`, `primitives/surface/types.ts` `26d0726b…`, `atoms/photo-frame/types.ts` `aca1d91a…` (`ratio="auto"` host-height fill), `primitives/aspect-ratio/types.ts` `771b93da…`, `atoms/badge/types.ts` `81d97cd4…`, `atoms/icon/types.ts` `673126c6…` (`arrow-right` in the closed set), `atoms/link/types.ts` `b5e5ba0b…`, `molecules/list-item/types.ts` `df2e05c4…` (whole-card anchor + hover recipe), `primitives/text/types.ts` `badce409…`, `atoms/chip/types.ts` `aac60553…` (box-border precedent), `atoms/logo/types.ts` `c94a94db…` (documented `aria-hidden` gap). All re-verified in this working tree.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the implementation edit surface; contract approval alone grants no code.
2. **G2 — Spec provenance (no blocker, no edits).** The local `spec.md` header reads **Draft / Pending** although the contract was approved on #280 (L17). That header is historical snapshot metadata of the published snapshot; the approval comment plus the exact `contentSHA256` above is sufficient provenance. No frozen file is modified. ArticleFeature's spec links resolve correctly; no link defect.
3. **G3 — Registry materialization of the approved conventions.** `card-link-action-label` (`actionLabel`), `content-detail` (`detail`), `decorative-cover-word` (`coverWord`) and `cover-badge` (`badge`) are owner-approved via the recoverable artifact above (L17); approval evidence and registry materialization are separate steps. At implementation the parent adds all four entries as `status: "approved"` with `approval: { reference: "https://github.com/egdev6/egdev-design-system/issues/280#issuecomment-6581572442", scope: "convention:<id>", contentHash: conventionHash(entry) }` per convention, then regenerates and verifies. The retracted `thumbnail-badge` reuse stays retracted; the `meta`/`option-metadata` entry is not widened.
4. **G4 — Visual reference status.** VIS-01 stays `Proposed`. The capture documents treatments v0.1 does not keep (radial neon halo, isotype mark, hover glow) and allowed token differences. Appearance is judged against the written recipe; browser observations per criterion (§10). No "fix" toward the capture's halo or glow.
5. **G5 — No token, dependency, Material or legacy change.** Verified-present tokens/recipes only: `surfaceVariants` (raised + `well`), `--gradient-sheen`, `--color-surface-2`, `--shadow-focus`, `--text-heading-small`, `--text-title-display`, `--color-alpha-white-07`, `--duration-fast`, `--ease-out`, `Badge`, `Icon name="arrow-right"`, `PhotoFrame ratio="auto"`, `AspectRatio ratio={2}`. **No stylesheet** (spec). No halo recipe, no brand-mark slot (OQ-1 prerequisite gaps stay deferred). The `asChild` Slot path reuses `@radix-ui/react-slot`, already a direct dependency used by `Link`/`Button` — no dependency change. `packages/ui/src/styles/legacy/bundle.css` untouched.
6. **G6 — Parent-owned integration.** Registry JSON, generated props view, catalog source/artifacts, `packages/ui/src/index.ts` and package harnesses are parent-owned for the implementation task.
7. **G7 — Layer-(b) lessons are obligations.** (a) **`box-border` on the anchor root (highest relevance here):** the whole-card anchor composes `surfaceVariants` (base carries `box-border`), and the action label's `border-b` sits on a part inside it; the root `box-border` assertion is mandatory — this is the exact defect class that hit Chip's anchor mode (content-box 37px vs 26px) and `ListItem`'s rows. (b) **Real-browser layout verification against VIS-01 before merge (§10)**, including the reserved 16:8 cover with the `auto` PhotoFrame child in real flex/grid hosts — the layer-(b) reserved-geometry defect class.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Responsibility |
| --- | --- | --- |
| `packages/ui/src/molecules/article-feature/types.ts` | Writer | `ArticleFeatureLevel`, CVA recipes (`articleFeatureVariants`; `articleFeatureCoverVariants`, `articleFeaturePlateVariants`, `articleFeatureBadgeVariants`, `articleFeatureMetaVariants`, `articleFeatureTitleVariants`, `articleFeatureActionVariants`), and `ArticleFeatureProps` (`title`, `level`, `href`, `asChild`, `eyebrow`, `detail`, `actionLabel`, `children`, `className`), `ArticleFeatureCoverProps` (`coverWord`, `badge`, `children`, `className`) exactly per spec §3 — a **two-branch union** on `asChild` (mirroring `Surface`/`ListItem`): native branch `Omit<ComponentPropsWithoutRef<'a'>, 'title' | 'children'>` with required `href`, slotted branch `Omit<HTMLAttributes<HTMLAnchorElement>, 'children'>` with `asChild: true` and no `href` of its own; `type` only, English JSDoc with `@control` on every own declaration and on both branches |
| `packages/ui/src/molecules/article-feature/useArticleFeature.ts` | Writer | Title/eyebrow/detail/actionLabel normalization, cover-precedence resolution (media child wins + development warning; child with own `ratio` → documented development warning), protected-prop handling, `useId()` heading id, per-part `cn()` |
| `packages/ui/src/molecules/article-feature/ArticleFeature.tsx` | Writer | JSX only: root `a` (or `Slot`), exported `ArticleFeatureCover` (`div` > `AspectRatio ratio={2}` > generative plate or the supplied `PhotoFrame ratio="auto"`), internal context row (`eg-article-feature__meta`), heading and action label (`eg-article-feature__action`) |
| `packages/ui/src/molecules/article-feature/ArticleFeature.test.tsx` | Writer | RED-first tests for AF-01…AF-10 plus box-border, single-anchor and ratio-reservation assertions (§5) |
| `packages/ui/src/molecules/article-feature/ArticleFeature.stories.tsx` | Writer | `Molecules/ArticleFeature`, English: `Default`, `AsChildLink`, `GenerativeCover`, `MediaCover`, `ContextRow`, `DetailOnly`, `WithActionLabel`, `LongContent`, `Widths`, `ReducedMotion` |
| `packages/ui/src/molecules/article-feature/index.ts` | Writer | Named exports of `ArticleFeature`, `ArticleFeatureCover` and their prop types |
| `packages/ui/src/index.ts` | Parent (integration) | `export * from './molecules/article-feature';` alphabetically in the Molecules block |
| `packages/ui/src/lib/storybook-docgen.test.ts` / `storybook-controls.test.ts` | Parent (integration) | ArticleFeature rows over the two-branch union (per-branch repeated directives normalize), zero owned diagnostics |
| `scripts/package-exports.test.mjs` / `package-consumption.test.mjs` | Parent (integration) | Sorted type lists, SSR/consumer cases per §8 |
| `skills/_shared/prop-naming.json` + `docs/prop-naming.md` | Parent (integration) | Append usages to `heading-title`, `heading-level`, `heading-eyebrow`, `slot-composition`; add the four approved conventions as `approved` bound to the #280 approval artifact (G3) |
| `scripts/catalog_data.py` + `docs/CATALOGO.md` / `docs/catalog.json` | Parent (integration, shared Unit C) | ArticleFeature row: approved composes correction + implemented note (§9); single regeneration run, no parallel writers |

**No stylesheet.** `compiled.css:49` and `.storybook/preview.css:13,54` wildcards already cover the new folder; no `@source` edit.

Explicitly untouched: `docs/components/article-feature/v0.1/**` (frozen), `packages/tokens/**`, legacy CSS, `atoms/link`, `molecules/list-item` (recipes consumed, never modified), other components.

## 3. Typing approach and API fidelity

Two-branch union, `Surface`/`ListItem` precedent:

```text
ArticleFeatureProps =
  | (Omit<ComponentPropsWithoutRef<'a'>, 'title' | 'children'> & { title: string; href: string; asChild?: false; …own props })
  | (Omit<HTMLAttributes<HTMLAnchorElement>, 'children'> & { title: string; asChild: true; href?: never; …own props })
```

- Own props shared by both branches: `title` (required), `level?`, `eyebrow?`, `detail?`, `actionLabel?`, `children?` (at most one `ArticleFeatureCover`), `className?`.
- Protected: `role`, `tabIndex`, `style` stay stripped; **`aria-label`/`aria-labelledby` are deliberately NOT protected** — the accessible name is the content by default and the consumer may override it with the native attributes (spec §3/§5); the override replaces the content name and is tested.
- `ArticleFeatureCoverProps = { coverWord?: string; badge?: string; children?: ReactNode; className?: string }`; the media branch documents that the child must be one `PhotoFrame ratio="auto"` — a child with its own `ratio` triggers the development warning and is a documented composition error, not a type error.
- `@control`: `text` on strings, `number` on `level`, `boolean` on `asChild`, `false` + `@controlReason` on `children`/`value`-like ReactNode fields. Repeated directives across branches normalize per the enhancer's rule. `@default 3`, `@default false`. Blank `title` → warn + render nothing (never an unnamed link; the slotted branch renders nothing too).
- No ref promised in v0.1; no `forwardRef`.

## 4. Recipes and class composition

- **Root (anchor):** `cn(surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }), 'eg-article-feature flex flex-col gap-4 no-underline text-fg-default', hover/focus recipe, className)` where the hover/focus recipe is the approved `ListItem v0.2` anchor treatment adapted verbatim (approved OQ-4): `cursor-pointer hover:border-border-brand hover:[background:var(--gradient-sheen),var(--color-surface-2)] focus-visible:outline-none focus-visible:shadow-focus transition-[color,background-color,border-color] duration-(--duration-fast) ease-(--ease-out) motion-reduce:transition-none`. No lift, no scale, no glow. `asChild` uses `Slot` with the identical class set — the consumer's anchor receives the whole recipe.
- **Cover:** `ArticleFeatureCover` renders `div eg-article-feature__cover relative` containing `<AspectRatio ratio={2} className="…">`; the generative branch renders `surfaceVariants({ tone: 'well', padding: 'none', radius: 'none' })` + `flex items-end` with the `aria-hidden` word in `text-title-display uppercase text-alpha-white-07 leading-none` (token step instead of the web's clamp literal); the media branch renders the supplied `PhotoFrame ratio="auto"` child, which fills the reserved height (its approved auto-height behaviour). The badge sits absolute `top-4 left-4` when supplied. `data-cover="generative|media"` on the cover for part recipes.
- **Context row:** internal `p eg-article-feature__meta flex items-center gap-2 font-display text-meta uppercase min-w-0` with the eyebrow in `text-fg-brand-raised`, an `aria-hidden` separator (`·`) between supplied values (never dangling for a single value), and `detail` in `text-fg-secondary`.
- **Heading:** `text-heading-small text-fg-default` (approved OQ-3), element `h{level}` with the `useId()` id.
- **Action label:** internal `span eg-article-feature__action inline-flex items-center gap-1.5 text-label-default text-fg-brand-raised border-b border-border-brand mt-auto` plus `<Icon name="arrow-right" size="sm" aria-hidden />` — paint and text only, never an anchor or button (approved OQ-2); `mt-auto` pins it so unequal cards keep labels aligned.
- **DOM order:** cover → context row → heading → action label, all inside the one anchor (spec §2).
- **`box-border` accounting (G7a):** the root's `surfaceVariants` base carries `box-border`; the hovered border and `border-b` therefore paint inside the consumer's width. The test asserts `box-border` on the merged root class set for both branches (native and slotted), mirroring the Chip anchor-mode fix.

## 5. Test-first sequence

New component; every behavior test RED first. Public interface only.

| Step | RED test (`ArticleFeature.test.tsx` unless noted) | Covers |
| --- | --- | --- |
| R0 | `storybook-docgen.test.ts` (ArticleFeature section): docgen resolves the two-branch union (`asChild` boolean branch, `href` required only on the native branch, four pending-convention strings); `diagnostics: []` | AF-10, early — mirrors Chip R-1 risk |
| R1 | Native branch: exactly one `a` around the whole composition, `href` present, no extra wrapper element, heading rank per `level` | AF-01 |
| R2 | `asChild` with a consumer `<a href>`: same class set lands on the consumer anchor, no nested anchor, `userEvent.tab()` finds exactly one tab stop | AF-02 |
| R3 | `eyebrow`+`detail` → one context row with an `aria-hidden` separator; single value renders with no dangling separator; neither supplied → no row | AF-03 |
| R4 | Blank/whitespace `title` warns and renders nothing (both branches) | AF-04 |
| R5 | Generative cover: `aria-hidden` `coverWord` inside the `well` recipe, reserved `AspectRatio ratio={2}` region; media cover: supplied `PhotoFrame ratio="auto"` fills the region (computed-size check inside a fixed-width host); child with own `ratio` → development warning; both supplied → media wins + precedence warning | AF-05 + G7b |
| R6 | `badge` renders the solid brand `Badge` over the cover only when supplied; never a tab stop | AF-06 |
| R7 | `actionLabel` renders a `span` + `aria-hidden` icon — **no** anchor/button element; card keeps one tab stop | AF-07 |
| R8 | Hover/focus class markers (`hover:border-border-brand`, `focus-visible:shadow-focus`) present with no `scale`/`translate`/glow shadow utility; `motion-reduce:transition-none` present; reduced-motion render via `matchMedia` unchanged | AF-08 |
| R9 | Long title/detail/narrow host: wraps, no `truncate`, no horizontal scroll, action label aligned last (`mt-auto`) with and without `actionLabel` | AF-09 |
| R10 | Root class set contains `box-border` on both branches; consumer `aria-label` overrides the content name | AF-10-adjacent + G7a |

**PRESERVE.** No existing shared code changes; `Slot` composition is consumed from Radix exactly as `Link`/`Button` already do, and the `ListItem` hover recipe is re-expressed, not imported or modified. Evidence: `Link`, `ListItem`, `PhotoFrame`, `Badge`, `Icon`, `AspectRatio`, `Surface` focused suites stay green; lib/harness suites pass unchanged except their ArticleFeature additions.

GREEN order: `types.ts` → `useArticleFeature.ts` → `ArticleFeature.tsx` → `index.ts` → stories → parent integration.

## 6. Stories and Controls

`Molecules/ArticleFeature`, autodocs, `Meta<typeof ArticleFeature>`, no manual `argTypes`, no `play`. `Default` (generative cover + context row + action label), `AsChildLink` (consumer anchor child), `GenerativeCover` (word `/src`-style example), `MediaCover` (`PhotoFrame ratio="auto"` with a real image), `ContextRow`, `DetailOnly`, `WithActionLabel`, `LongContent`, `Widths`, `ReducedMotion`. Media stories document the `ratio="auto"` obligation in JSDoc. Accessible-name consequences (informative `alt` inflating the name) are documented in meta usage guidelines.

## 7. Registry integration

Applied approved entries: `title` → `heading-title`; `level` → `heading-level`; `eyebrow` → `heading-eyebrow`; `asChild` → `slot-composition`. Owner-approved conventions (G3): `card-link-action-label`, `content-detail`, `decorative-cover-word`, `cover-badge`, approved via [issue #280 comment 6581572442](https://github.com/egdev6/egdev-design-system/issues/280#issuecomment-6581572442). At implementation the parent adds all four as `approved` with that reference, the exact `convention:<id>` scopes and `conventionHash(entry)` values, appends the usages with real source revisions, regenerates (`pnpm props:docs`) and runs `pnpm props:check` + `pnpm test:props`. No exception requested; the retracted `thumbnail-badge` reuse must not appear and `meta`/`option-metadata` is not widened.

## 8. Package exports and consumption

- `scripts/package-exports.test.mjs`: add `ArticleFeature`, `ArticleFeatureCover` and prop types to the sorted lists; SSR smoke asserts one anchor, reserved cover, one tab stop.
- `scripts/package-consumption.test.mjs`: positive cases (native branch full card, `asChild` with a consumer anchor, media cover, success-free context row); documented `@ts-expect-error` negatives: native branch without `href`, slotted branch with `href`, `role`/`tabIndex`/`style` overrides, a second action child type-rejected by the cover contract where expressible. Packed React 18/19 compile via the existing harness; the slotted branch uses `Slot` (React 18/19 safe); no ref, no React-19-only API.

## 9. Catalog row update (shared parent-only Unit C)

All six layer-(c) rows are refreshed by **one shared parent-only integration unit (Unit C)** — a single writer edits `scripts/catalog_data.py`, then runs `python3 scripts/build_catalog.py` once; no parallel writers touch the shared file. Generated files are never hand-edited. For this component, Unit C applies the **owner-approved composition correction** (L17; recorded in the approved contract §3) plus the implemented note: line 81, composes `PhotoFrame, Text` → `PhotoFrame, Badge, Icon; Surface recipe`; note → "Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/280): whole-card anchor (native `a` or `asChild` Slot) with a reserved 16:8 cover (generative well + `aria-hidden` word, or `PhotoFrame ratio="auto"`), optional brand badge, context row, generated heading and paint-only action label; `ListItem` anchor hover treatment. No halo, isotype mark, stylesheet, ref or nested action."

## 10. Browser checks to run before merge

Against `pnpm storybook` with real compiled tokens, after GREEN; observations recorded, never replacing tests:

1. Controls render per the central enhancer; zero owned diagnostics across ArticleFeature stories.
2. **Real-browser layout verification against VIS-01:** compare `GenerativeCover`/`MediaCover` with the captured board for the surviving intent — the 16:8 reserved cover, the context row order (category · detail), the title step, the underlined paint-only action label with arrow. Omitted/allowed differences recorded: no halo, no isotype mark, no hover glow (brand hairline + `surface-2` instead), `--text-heading-small` title, `alpha-white-07` ghost word, solid frame instead of glass. Visual conformity reported per criterion; capture never overwritten.
3. **Box-border / geometry (layer-b lessons):** consumer width contains the anchor's border; the 16:8 reservation holds in flex and grid hosts with the `auto` PhotoFrame child (no collapse, no jump on image load); the badge overlays inside the cover corner; `mt-auto` pins action labels across unequal cards in one row.
4. Keyboard: exactly one tab stop with the token ring; Enter navigates; reduced motion removes transitions.
5. Screen reader: accessible name = context row + heading + action label by default; `aria-label` override replaces it; word/arrow/badge absent from the name.

Full gates before merge, parent-scheduled with observed output: `pnpm typecheck`, `pnpm lint`, focused first (`pnpm exec vitest run packages/ui/src/molecules/article-feature packages/ui/src/atoms/photo-frame packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts`), then `pnpm test`, `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm props:check`, `pnpm test:props`.

## 11. Bounded work units

1. **Unit A (writer):** the six `packages/ui/src/molecules/article-feature/` files; focused tests green.
2. **Unit B (parent integration):** index export line, docgen/controls sections, package harness additions, registry usage append + the four approved convention entries (G3) + props check.
3. **Unit C (shared parent-only catalog integration, all six components):** exact row updates per each plan's §9 (this one includes the approved composes correction), one `build_catalog.py` run.

## 12. Risks

- **R-1 — Two-branch union metadata extraction (highest).** Like Chip's union, the `asChild`-discriminated branches must extract cleanly (`href` required only on the native branch). If docgen collapses rows, the honest options are a metadata-only restructure preserving the public type's meaning or a spec question — never silent restructuring or shipped diagnostics (R0 catches this before GREEN).
- **R-2 — Whole-anchor hover recipe duplication.** The hover/focus recipe is re-expressed in this component's `types.ts` (the `ListItem` classes are not exported for reuse); divergence is a maintenance risk documented here. Any future shared-recipe extraction is a separate proposal.
- **R-3 — Accessible-name inflation.** An informative cover `alt` joins the link name by construction (spec documents the `alt=""` guidance and the `aria-label` override); the browser check verifies the tree, not the workaround.
- **R-4 — Reserved 16:8 with `auto` child.** The reservation depends on `PhotoFrame`'s approved auto-height fill; the R5 computed-size test plus the browser geometry check guard the layer-(b) collapse class.
- **R-5 — Registry materialization timing (G3).** The four conventions are approved; the JSON entries must be written with exact scopes and `conventionHash(entry)` values at implementation and verified by `pnpm props:check`/`pnpm test:props`.
- **R-6 — Spec provenance** (G2): historical snapshot metadata; the frozen digest and approval comment are the binding provenance.

## 13. Stop

This plan authorizes nothing until G1. The four conventions are already owner-approved (G3 artifact); no reapproval is requested. No source, test, token, dependency, registry, catalog or Git action is taken or implied.
