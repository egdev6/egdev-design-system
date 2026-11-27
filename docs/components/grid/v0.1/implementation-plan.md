# Grid and GridItem v0.1 — implementation plan

- **Status:** **Approved** on 2026-11-27 by the owner, verbatim "Aprobar (Recomendado)" (`odd/tasks/layout-grid-395.md` L4; [approval.md](approval.md)), with the changelog entries under `## Unreleased` (D4), GridItem `asChild`, browser runs, packed consumers with effects present, the `(#395)` citation and the registry receipts. It grants the edit surfaces of section 2 and the checks of section 8. It approves no PNG capture, release, tag or GitHub write, and the parent commits. At approval nothing below was implemented or measured: preparation was read-only plus scratch compiles outside the repository.
- **Coverage:** S1 to S3 of [`odd/tasks/layout-grid-395.md`](../../../../odd/tasks/layout-grid-395.md), issue [#395](https://github.com/egdev6/egdev-design-system/issues/395); this is the plan gate that precedes T3 (implementation). It covers no other issue. Format follows the [Carousel v0.4](../../carousel/v0.4/implementation-plan.md) and [Pagination v0.1](../../pagination/v0.1/implementation-plan.md) plans.
- **Contract authority:** [spec.md](spec.md) v0.1, **Approved** on 2026-11-27, `contentSHA256: b7de8109cea062361a1f2847400032eec460fc65d47dbd014ccc72b2f17ca885`, SHA-256 of the payload from the line-start `## 1. Purpose and scope` heading through EOF (LF, final newline), reproduced byte-exact in this working tree by two independent methods (`awk` and `sed`). It folds in the owner's L4 answers: `columnCount` (OQ-1) and the recommended answers to OQ-2 to OQ-7. Cataloging: [cataloging.md](cataloging.md), Approved; the owner's four answers are in L3 of the ODD file, and [approval.md](approval.md) records the L4 approval of the cataloging, the spec and this plan. Visual hashes: VIS-01 to VIS-04 Pending.
- **Naming note:** the column-count prop is `columnCount` throughout, as the owner decided (OQ-1, "`columnCount` (Recomendado)", L4): the L3 draft's `columns` cannot be registered (spec V-7), and no exception exists.
- **Plan identity:** `contentSHA256: 46fb0348e4971d4b582ca5de3f949ba956b699c8abfa04af407bbe77871b5500` — SHA-256 of the UTF-8, LF, final-newline payload from the exact `## 1. Authority and gates` heading line through EOF; the metadata above it is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `feat/layout-grid-395`, HEAD `e52a5a1`. Working tree before this work: `odd/tasks/release-ui-0.11.0.md` modified and `odd/tasks/layout-grid-395.md` untracked (neither is touched). Whole-file SHA-256 of the sources this plan will edit, read in this working tree: `packages/ui/src/index.ts` `20059f04…15c6`, `packages/ui/src/styles/compiled.css` `82784cfe…3301`, `.storybook/preview.css` `eb001f5d…8e1a`, `.storybook/main.ts` `3a21db23…d3bb`, `packages/ui/src/recipes/scene-recipes.stories.tsx` `ffafcbc1…5f81`, `storybook-controls.test.ts` `df73384a…2ee5`, `storybook-docgen.test.ts` `6ae4b740…97ce`, `storybook-css.test.ts` `c44b09c0…654a`, `package-exports.test.mjs` `5a38c7e4…2604`, `package-consumption.test.mjs` `cd8a2085…ebda`, `prop-naming.test.mjs` `ad947b0c…d09b`, `prop-naming.json` `384585d7…61ea`, `design-system-artifact.test.mjs` `6fe67f97…e987`, `catalog_data.py` `2e52d72c…17d5`, `packages/ui/CHANGELOG.md` `25d62e17…de66`, `packages/system/CHANGELOG.md` `5f51e68f…1fd9`. The Stack sources the plan mirrors: `types.ts` `38e98a5b…7722`, `useStack.ts` `b9ecd80f…1f2e`, `Stack.tsx` `a7517d76…2e34`.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload, after the spec is approved, grants the edit surface of section 2, including the integration surfaces the parent owns. The spec approval alone grants no code. Approving the plan approves no capture, release or GitHub write.
2. **G2 — Spec provenance.** The spec is Approved (2026-11-27) with OQ-1 to OQ-7 resolved as recommended and the prop name `columnCount`. The owner answered on the drafts `4dcb1c58` (spec) and `767a68f6` (plan); the spec digest in the metadata binds the finalized bytes, those drafts with the answers folded in. Nothing here upgrades the spec.
3. **G3 — Registry.** Four new conventions (`grid-columns`, `layout-collapse-below`, `grid-item-span`, `grid-item-row-span`) and four usages of approved conventions (section 5.1). The new entries are registered `proposed` with `approval: null` and promoted only by the scoped receipt of D3, which the owner granted ("the registry receipts for the new conventions", L4). No exception is requested, because OQ-1 resolved to `columnCount`. Adding a usage approves nothing globally.
4. **G4 — Files, tokens and stylesheet.** Six files in `packages/ui/src/primitives/grid/`; **no stylesheet** (`grid.css` is not created) and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical; no token, dependency or Radix package (Slot only). Every utility is a static literal in a CVA string composed per part with `cn()`; no inline style, interpolated class or new AGENTS.md exception. The 860px and 1080px thresholds are literal media-query widths (the Hero and BlogGrid precedent), not tokens.
5. **G5 — The cascade is proved, not assumed.** The reset-after-base order, the equal specificity and the inclusive `<=` form are proved on the preview build and on the packed build (sections 4 and 5.6), and the order test must be shown able to fail. The #392 guard is a packed test with effects present in both import orders.
6. **G6 — Integration ownership.** The registry JSON and generated view, the system artifact, the catalog source and outputs, the package and Storybook harnesses, the barrel and stylesheet source lines and the changelogs are parent-owned integration surfaces, as in the Carousel, NowCard and Pagination plans. A writer touches only the six Grid files and the recipe story migration, and returns the integration lines it needs.
7. **G7 — Release gate.** `changelogError` (`scripts/lib/pack-packages.mjs:112-126`) requires the first versioned changelog section to equal the manifest version. This plan bumps no manifest, and its changelog entries sit under `## Unreleased` (section 7, D4), which `changelogError` skips, so the first versioned section still equals the manifest version and the gate holds.
8. **G8 — Stop lines.** Stop and return to the owner if: a utility does not emit or cascades differently from section 3; the child reset cannot win at equal specificity; `props:check` rejects a new entry; a generator demands an edit outside section 2; Stack, Cluster, BlogGrid or Hero would need to change; a token, dependency or stylesheet appears necessary; or `@egdev/effects` starts declaring a grid property.

## 2. Edit surfaces (authorized by the plan approval, G1)

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/primitives/grid/types.ts` | Writer | `GridProps` and `GridItemProps` with English JSDoc (`@control`, `@default` only for constants), type-only import of `LayoutAlignItems` and `LayoutGap` from `../stack/types`, `gridVariants` and `gridItemVariants` with inline literal maps (section 3) | +135 |
| `packages/ui/src/primitives/grid/useGrid.ts` | Writer | `useGrid` and `useGridItem`: defaults, `cn()`, `asChild` flag, `rest` forwarding | +45 |
| `packages/ui/src/primitives/grid/Grid.tsx` | Writer | `Grid` and `GridItem`: `Slot` or `div`, `displayName`, JSX only | +28 |
| `packages/ui/src/primitives/grid/index.ts` | Writer | `Grid`, `GridItem`, `GridProps`, `GridItemProps` | +3 |
| `packages/ui/src/primitives/grid/Grid.test.tsx` | Writer | G1 to G14 (section 4) | +230 |
| `packages/ui/src/primitives/grid/Grid.stories.tsx` | Writer | Nine stories (section 6) | +150 |
| `packages/ui/src/recipes/scene-recipes.stories.tsx` | Writer | Migrate the About (`:70`) and Community (`:103`) wrappers to Grid, update the two JSDoc sentences, add the `Grid`, `GridItem` and `Stack` imports | +16 / −6 |
| `packages/ui/src/index.ts` | Parent | Two export lines between `./primitives/divider` (`:210`) and `./primitives/label` (`:211`) | +2 |
| `packages/ui/src/styles/compiled.css` | Parent | `@source "../primitives/grid/types.ts";` between the `divider` and `label` lines | +1 |
| `.storybook/preview.css` | Parent | `@source` for `Grid.stories.tsx` beside the Stack lines | +1 |
| `.storybook/main.ts` | Parent | `grid` and `gridItem` native-prop allowlist entries beside `stack` and `cluster` (`:254-255`) | +2 |
| `docs/components/web-catalog/v0.1/scene-recipes.md`, `docs/storybook/scene-recipes.mdx` | Parent | Replace the consumer-utilities wording with Grid and GridItem, and the 48rem threshold with 860; the dated "Observed verification" history stays | +10 / −6 |
| `packages/ui/src/lib/grid-docgen.test.ts` (new) | Parent | AC-09, modelled on `carousel-docgen.test.ts` (section 5.3) | +90 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | Folder map (`:25-60`), control map (`:599-600`), `ownPropCounts` (`:913-914`), default-args map (`:1713-1714`) | +12 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | Barrel module list (`:2678-2690`) and public names (`:2716-2836`) | +6 |
| `packages/ui/src/lib/storybook-css.test.ts` | Parent | E1 emission and E2 cascade tests (section 4) | +70 |
| `scripts/package-exports.test.mjs` | Parent | Export inventories, plain-function and SSR assertions, shipped-CSS assertions (section 5.6) | +75 |
| `scripts/package-consumption.test.mjs` | Parent | Typed samples with negative cases, SSR and CSR, the packed CSS checks and the #392 guard with effects present (section 5.6) | +110 |
| `skills/_shared/prop-naming.json` | Parent | Four new entries and four usages (section 5.1) | +116 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited | ≈ +10 |
| `scripts/prop-naming.test.mjs` | Parent | `postReceiptUsages`, `postReceiptProposals`, the entry count (`:3413`) and the receipt test (section 5.2) | +135 |
| `docs/components/grid/v0.1/prop-naming-approval.json` (new) | Parent | The scoped convention receipt, only after D3 | +140 |
| `scripts/design-system-artifact.test.mjs` | Parent | One Grid artifact assertion beside `:111` (section 5.4) | +30 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited | 2; ≈ +45 |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent | A Grid row after `:8`, a note on the ProjectsGrid (`:120`) and CommunityGrid (`:123`) rows, then one `build_catalog.py` run (section 5.5) | +5; ≈ +4 |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | A new `## Unreleased` section in each, citing `(#395)`, above the last versioned section (section 7, D4) | +14; +10 |
| `docs/components/grid/v0.1/implementation-evidence.md` (+ `capture.json` and PNGs only if authorized) | Parent | Observed RED and GREEN output, browser table, hashes (section 9) | +55 |
| `odd/tasks/layout-grid-395.md` | Parent | Log the approvals and the delivery | +8 |

Explicitly untouched: `packages/ui/src/primitives/stack/**` (its `layoutGapClasses` export and registry revisions stay), BlogGrid, Hero and every other component; `packages/tokens/**`; `packages/ui/src/styles/legacy/**`; `packages/effects/**`; `packages/cli/**` (its guard already allows grid-item placement in `className`, `appearance-guard.mjs:89-105`); the package manifests and versions (D4); frozen documents; the approved cataloging, spec, plan and approval records, which stay byte-frozen.

## 3. Design of the change

**API.** Exactly spec block 3, with the unions inline and no new type export. English JSDoc per prop with `@control select` (numeric unions, as Stack's `gap`) or `@control boolean`, and a bare `@default` only for constants: `columnCount` 1, `gap` 4, `alignItems` stretch, `asChild` false (both parts). `collapseBelow`, `span` and `rowSpan` carry no `@default`: their absence is described in the body text. `children` is inherited and not redeclared.

**Structure.** Planned `types.ts` shape (every class a static literal; axis maps inline so the artifact lists them, spec V-9):

```ts
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import type { LayoutAlignItems, LayoutGap } from '../stack/types';

export type GridProps = ComponentPropsWithoutRef<'div'> & {
  columnCount?: 1 | 2 | 3 | 4 | 12;
  gap?: LayoutGap;
  alignItems?: LayoutAlignItems;
  collapseBelow?: 860 | 1080;
  asChild?: boolean;
};
export type GridItemProps = ComponentPropsWithoutRef<'div'> & {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  rowSpan?: 1 | 2 | 3 | 4;
  asChild?: boolean;
};

export const gridVariants = cva('eg-grid grid min-w-0', {
  variants: {
    columnCount: { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 12: 'grid-cols-12' },
    gap: { 0: 'gap-0', 1: 'gap-1', /* … */ 24: 'gap-24' },
    alignItems: { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch', baseline: 'items-baseline' },
    collapseBelow: {
      860: '[@media(width<=860px)]:grid-cols-1 [@media(width<=860px)]:[&>*]:col-auto [@media(width<=860px)]:[&>*]:row-auto',
      1080: '[@media(width<=1080px)]:grid-cols-1 [@media(width<=1080px)]:[&>*]:col-auto [@media(width<=1080px)]:[&>*]:row-auto'
    }
  },
  defaultVariants: { columnCount: 1, gap: 4, alignItems: 'stretch' }
});
export const gridItemVariants = cva('eg-grid-item min-w-0', {
  variants: {
    span: { 1: 'col-span-1', /* … */ 12: 'col-span-12' },
    rowSpan: { 1: 'row-span-1', 2: 'row-span-2', 3: 'row-span-3', 4: 'row-span-4' }
  }
});
```

**Why inline maps and no `layoutGapClasses` import.** The artifact extractor walks only inline literal axes (spec V-9), so importing Stack's `layoutGapClasses` would hide Grid's gap utilities from the published reference, as Stack's own are hidden today. The 15-entry duplication is held in check by the matrix test of G3, which pins each key to its `--space-K` token. Only types are imported from `../stack/types`, so Grid never depends on Stack at runtime. Plan-level choice a reviewer can veto at G1.

**Hooks.**

```ts
export function useGrid({ columnCount = 1, gap = 4, alignItems = 'stretch', collapseBelow, asChild = false, className, ...rest }: GridProps) {
  return {
    asChild,
    rootProps: { ...rest, className: cn(gridVariants({ columnCount, gap, alignItems, collapseBelow }), className) }
  };
}
export function useGridItem({ span, rowSpan, asChild = false, className, ...rest }: GridItemProps) {
  return { asChild, rootProps: { ...rest, className: cn(gridItemVariants({ span, rowSpan }), className) } };
}
```

`Grid.tsx` renders `asChild ? <Slot {...rootProps} /> : <div {...rootProps} />` for each part, as `Stack.tsx` does, and sets `displayName`. Plain function components: no `forwardRef` and no public ref.

**Unsupported runtime values** keep the CVA semantics the spec states: a value with no entry contributes no utility, `null` disables the axis, and `undefined`, `NaN` and the empty string fall back to the default. No normalization layer is added, so nothing is interpolated and nothing throws.

**Emission inventory.** Each static utility, the declaration it must emit and where it is proved:

| Utility | Required emitted declaration | Proof |
| --- | --- | --- |
| `grid`, `min-w-0` | `display: grid`; a zero `min-width` | E1 |
| `grid-cols-1`, `-2`, `-3`, `-4`, `-12` | `grid-template-columns: repeat(N, minmax(0, 1fr))` | E1 |
| `gap-0` … `gap-24` (15 keys) | `gap: var(--space-K)` | E1, G3 |
| `items-start`, `-center`, `-end`, `-stretch`, `-baseline` | the matching `align-items` | E1 |
| `col-span-1` … `col-span-12`, `row-span-1` … `row-span-4` | `grid-column` or `grid-row: span N / span N` | E1 |
| `[@media(width<=860px)]:grid-cols-1`, `[@media(width<=1080px)]:grid-cols-1` | inside `@media (width<=860px)` and `@media (width<=1080px)`: `grid-template-columns: repeat(1, minmax(0, 1fr))` | E1, E2 |
| `…:[&>*]:col-auto`, `…:[&>*]:row-auto` (both queries) | the same blocks: `… > * { grid-column: auto }` and `… > * { grid-row: auto }` | E1, E2 |

**Cascade design.** Each utility is one rule in `@layer utilities`. The media blocks are emitted after every unconditional rule and the child reset (`> *`, one class) has the specificity of `.col-span-N`, so source order decides and the reset follows the spans (spec V-4, from a scratch compile and the local artifact). E2 proves it on the built CSS rather than on class order. The collapse uses the inclusive `<=` form because Tailwind's `max-*` variant emits the exclusive `width <`.

## 4. Test-first sequence

Public-interface tests first, with the intended RED captured verbatim before any implementation (the evidence file records command, exit code and counts). For a new component the first RED is the missing module (`./Grid` cannot be resolved), as for Stack; the pinned inventories and `grid-docgen.test.ts` add assertion-level REDs. Browser-only geometry is not claimed from jsdom: it sits in section 9. Tests use roles, accessible names and `userEvent`, select the root through its `eg-grid` marker or an `aria-label`, and use no `data-testid`, no complete class strings and no `play`.

**New unit tests** (`Grid.test.tsx`):

| ID | Test | Covers |
| --- | --- | --- |
| G1 | Defaults and markers: `Grid` is a `div` with `eg-grid`, `grid`, `min-w-0`, `grid-cols-1`, `gap-4`, `items-stretch`; `GridItem` is a `div` with `eg-grid-item` and `min-w-0` and no span class; neither has `role`, `tabindex`, `id`, `style` or `aria-*`; children keep DOM order | AC-01 |
| G2 | `columnCount` matrix over 1, 2, 3, 4, 12: exactly its `grid-cols-N`, no other `grid-cols-*` and no collapse utility | AC-02 |
| G3 | `gap` matrix over the 15 keys: exactly `gap-K`; each `--space-K` is declared in `packages/tokens/src/theme.css` (read as Stack's test does) | AC-02 |
| G4 | `alignItems` matrix: exactly its `items-*` | AC-02 |
| G5 | `collapseBelow` 860 and 1080: exactly the three utilities of that query and none of the other query; omitted adds none; both with `columnCount` 1 and 12 | AC-02 |
| G6 | `span` 1 to 12 and `rowSpan` 1 to 4: exactly `col-span-N` and `row-span-N`; omitted adds none; independent of each other | AC-02 |
| G7 | Rerender replaces `columnCount` 3 → 2, `gap` 4 → 8 and `collapseBelow` 860 → 1080 → omitted: the old utilities are gone and the same DOM nodes remain | AC-02 |
| G8 | Unsupported values per axis (`columnCount` 5, 0 or `null`; `gap` 9 or `null`; `alignItems` `'around'` or `null`; `collapseBelow` 900, 0 or `null`; `span` 13, 0 or `null`; `rowSpan` 5, 0 or `null`): no utility for the axis, no attribute, no throw, no `console` call; `undefined` and `NaN` behave as omitted | AC-03 |
| G9 | Source guard: `types.ts` has no backtick or `${` inside a class string, and no component file sets `style` or a custom property | AC-05 |
| G10 | Across a prop matrix no class starts with `order-`, `col-start-`, `col-end-`, `row-start-`, `row-end-` or `grid-flow-` (any variant prefix); `userEvent.tab()` visits focusable children in DOM order | AC-06 |
| G11 | `asChild`: `Grid` over `ul` with `GridItem` over `li` renders one list with `li` children and no wrapper, merging classes with the child's own and keeping its attributes and ref; `GridItem` over `Stack` yields one element with both markers; the parts are plain functions with no public ref | AC-07 |
| G12 | `aria-label`, `id`, `data-*` and `onClick` reach the root; `className` keeps the marker and is appended after the variant classes | AC-08 |
| G13 | `null`, `false`, empty and text-only children create no cell | AC-08 |
| G14 | PRESERVE: the Stack, Cluster, BlogGrid and Hero suites pass unmodified, and Stack's `layoutGapClasses` export is unchanged | — |

**RED to GREEN per acceptance criterion.**

| AC | RED test | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| AC-01, 02, 03, 05, 06, 07, 08 | G1 to G13 | `./Grid` cannot be resolved | The same runner green |
| AC-04 | E1 and E2 in `storybook-css.test.ts` | Grid selectors missing from the built CSS | Green on the preview build; the shipped CSS is asserted by the AC-12 row |
| AC-09 | `grid-docgen.test.ts`; Controls pins | Types file missing; `ownPropCounts` and control maps have no Grid | Same runner green |
| AC-10 | Receipt and pin edits first; `pnpm props:check` | Pinned count 193 versus 197 and unlisted usages fail the receipt tests | `props:docs`, `props:check`, `test:props` green |
| AC-11 | Export inventories; `pnpm artifact --check`; the artifact assertion | Four unlisted names; artifact stale | Regenerated and green |
| AC-12 | Packed assertions in `package-exports.test.mjs` and `package-consumption.test.mjs` | Selectors missing from the shipped CSS | Green after `pnpm build` |
| AC-13 | Source check of `scene-recipes.stories.tsx` | `min-[48rem]` and `grid` utilities still present | Green after the migration |
| AC-14, 15 | Not tests | — | Pending — **Not evaluated** until section 9 is authorized |

**E1 and E2 — emitted CSS** (`storybook-css.test.ts`). The suite builds the preview CSS once in `beforeAll` (`:425-447`) and builds the production UI CSS with `optimize: false` inside one Dialog test (`:278-314`), and its cases import each component's variants for their class strings (`:7-30`), so the tests follow the source. E1 asserts emission and the token declarations of every utility in the table above, including both `@media` blocks (helper `mediaBlocks`, `:229`). E2 asserts the cascade: each of the two blocks holds the three Grid collapse rules (the blocks also hold other components' rules), no Grid collapse selector sits under an exclusive `width <` query, and each reset selector is positioned after the last `.col-span-` and `.row-span-` rule with `specificity()` (`:251`) not lower than theirs. Both run on the preview build; the production arm needs a second `build` call or a small shared helper, and the optimized form that ships is asserted in `package-exports.test.mjs` against `dist/styles.css`. If the optimizer nests rules, the first red run exposes it and the helper is adapted in the same file.

**Failing-order proof (G5).** Show that E2 can fail: run it once against a scratch copy of the built CSS, outside the worktree, in which a collapse block is moved before the first span rule, and record the failure. Never commit a mutation and never leave scratch inside the repository.

**PRESERVE and differential.** The plan changes no shared code: the only touched shared files are the barrel (two added lines) and `compiled.css` (one added `@source`). Evidence that nothing else moved: G14, the Stack and Cluster suites unmodified, the scope check of section 8 printing nothing, and one differential check on a copy of the base commit in `mktemp -d` (not committed): the built `packages/ui/dist/styles.css` and the barrel export inventory of the base and the change must differ only by Grid's additions, that is every base rule is still present with the same declarations. Any difference nobody asked for is a regression to fix and pin with a test.

**GREEN order.** `types.ts` → `useGrid.ts` → `Grid.tsx` → `index.ts` → focused runner → stories and recipe migration → docgen and Controls pins → E1, E2 → registry and receipt → artifact → catalog → changelogs → packed fixtures.

## 5. Registry, docgen and artifact obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

Append, never reorder, four entries at the end of the array, each `status: 'proposed'`, `approval: null`, `aliases: []`, `exceptions: []`, with the exact `id`, `name`, `meaning`, `whenToUse` and `avoid` of the spec's block 3 table and these usages (type text, status `existing` once implemented):

| Entry | Usage component and type | Symbol |
| --- | --- | --- |
| `grid-columns` (`columnCount`) | Grid: `1 \| 2 \| 3 \| 4 \| 12 (default 1)` | `GridProps` |
| `layout-collapse-below` (`collapseBelow`) | Grid: `860 \| 1080 (inclusive; absent never collapses)` | `GridProps` |
| `grid-item-span` (`span`) | GridItem: `1 \| … \| 12` | `GridItemProps` |
| `grid-item-row-span` (`rowSpan`) | GridItem: `1 \| 2 \| 3 \| 4` | `GridItemProps` |

Then append, chronologically, usages to the approved entries: `layout-gap` (Grid, `LayoutGap (0|1|2|3|4|5|6|7|8|10|12|14|16|20|24)`, `GridProps`), `cross-axis-alignment` (Grid, `LayoutAlignItems (start|center|end|stretch|baseline)`, `GridProps`) and `slot-composition` (Grid and GridItem, `boolean (asChild)`, `GridProps` and `GridItemProps`). Every usage has `source: { path: 'packages/ui/src/primitives/grid/types.ts', symbol, revision: 'sha256:<whole-file SHA-256 of the final types.ts>' }`. Hash only after `types.ts` is final and `pnpm lint` is clean on it; any later edit, even formatting, requires re-hashing. A scratch run of `validateRegistry` already showed the four entries pass with empty usages (spec V-7); the real run needs the file to exist.

Then `pnpm props:docs` regenerates `docs/prop-naming.md` (never by hand), and `pnpm props:check` and `pnpm test:props` run.

### 5.2 Registry tests and the receipt

`scripts/prop-naming.test.mjs`: add the four usages to `postReceiptUsages` beside the Stack lines (`:608-615`), add the four IDs to `postReceiptProposals` under a Grid comment (`:903-961`), change the entry count 193 → 197 (`:3413`), and verify on the first red run that `beforeIndicatorConventions(actual).length` (190) does not move. `historicalRegistry` strips only reviewed post-receipt usages, so an unlisted usage fails the receipt tests: that is the intended RED.

**Receipt (D3).** Now that the spec and this plan are approved, `docs/components/grid/v0.1/prop-naming-approval.json` follows the Pagination receipt: a `human-approval-record` quoting the owner's answer verbatim, `specPayloadSHA256` and `planPayloadSHA256` of the approved payloads, one `entries` item per convention with the approved text, status `approved`, no alias and no exception, and the usage source. The four registry entries flip to `approved` with `{ reference, scope: 'convention:<id>', contentHash: conventionHash(entry) }`, and a test modelled on the Pagination one (`prop-naming.test.mjs:2243-2345`) binds the entry text to the spec payload. D3 is granted (the owner's L4 approval covers the registry receipts for the new conventions), so the receipt, its test (about 250 lines) and the status flips are in scope.

### 5.3 Docgen and Controls pins

- **New `grid-docgen.test.ts`** (`// @vitest-environment node`, modelled on `carousel-docgen.test.ts`): the AST of `types.ts` holds 8 own declarations (Grid 5, GridItem 3), each with exactly one `@control` and `@default` only for `columnCount` (`1`), `gap` (`4`), `alignItems` (`stretch`) and the two `asChild` (`false`); real docgen through `withCustomConfig` and the registered enhancer gives `columnCount` options `[1, 2, 3, 4, 12]`, `gap` its 15 values in order, `alignItems` its five, `collapseBelow` `[860, 1080]` with no default, `span` 1 to 12, `rowSpan` 1 to 4, selects in union order, `installed.args` still `{}`, zero `mapJSDocControls` diagnostics and no own `children` row; the stories file has `title: 'Primitives/Grid'`, no `argTypes` or `play` and the story names of section 6.
- `storybook-controls.test.ts`: `['Grid', 'primitives/grid']` and `['GridItem', 'primitives/grid']` in the folder map; `grid` and `griditem` control maps (`select` or `boolean`); `ownPropCounts` `grid: 5`, `griditem: 3`; the default-args entries `['Grid', { columnCount: '1', gap: '4', alignItems: '"stretch"', asChild: 'false' }]` and `['GridItem', { asChild: 'false' }]`.
- `storybook-docgen.test.ts`: `./primitives/grid` in the barrel module list and `Grid`, `GridItem` in the public names, alphabetically. Its Stack-era real-parser list (`:3424-3434`, `:4336-4350`) is not extended: Grid has its own docgen test.
- `.storybook/main.ts`: `grid` and `gridItem` allowlist entries `['id', 'title', 'aria-describedby', 'className', 'style']`.

### 5.4 System artifact

`pnpm artifact --write`, then `pnpm system:docs`. Expect new `Grid` and `GridItem` entries with their props (enums and defaults), `gridVariants` and `gridItemVariants` listing the inline utilities, `Slot` in `composedOf`, the four new naming concepts and the three reused conventions' new usages, and the new catalog row. `design-system.json` is 648,319 bytes today against the 768 KiB shipped-JSON budget (`design-system-artifact.test.mjs:2459-2478`) and the 1 MiB assertion (`:2483`); confirm it stays under after regeneration. Add one assertion beside `:111`: Grid and GridItem props with their defaults, recipes containing `grid-cols-12`, `col-span-7`, `row-span-2` and `[@media(width<=1080px)]:[&>*]:col-auto`, and Stack's entry unchanged. Then `artifact --check`, `system:check`, `test:artifact` and `test:system` green.

### 5.5 Catalog

In `scripts/catalog_data.py`, add after the `Stack / Cluster` row (`:8`): `("—","—","Grid / GridItem","primitive","ui","Slot","—","nuevo","Implemented in @egdev/ui: Grid (equal-width token-gap columns with an inclusive one-column collapse at 860 or 1080 CSS px) and GridItem (column and row span), passive layout with no stylesheet. Contract: [spec](components/grid/v0.1/spec.md); request [#395](https://github.com/egdev6/egdev-design-system/issues/395).")`. Append to the ProjectsGrid (`:120`) and CommunityGrid (`:123`) notes: "Layout: arrange the cards with `Grid` and `GridItem` ([#395](https://github.com/egdev6/egdev-design-system/issues/395)); still a documented recipe, not an export." Then one `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` run; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`.

### 5.6 Package fixtures, with effects present

`package-exports.test.mjs`: add `Grid` and `GridItem` to the runtime-name inventories (`:7840-7960`) and `GridProps`, `GridItemProps` to the type inventories (`:8190-8530`, `:8944-8964`); assert both are plain functions without a ref API beside `:8089-8094`; SSR assertions beside `:9217-9228` (`eg-grid`, `grid-cols-3`, `gap-5`, the 1080 collapse utilities, `eg-grid-item`, `col-span-7`, no `role`, `tabindex` or `style`); shipped-CSS assertions that every Grid utility exists and each collapse block holds its three rules after the base rules.

`package-consumption.test.mjs`: add `Grid` and `GridItem` to the imports (`:212`, `:370`); typed positive samples and documented `@ts-expect-error` negative cases (`collapseBelow: 900`, `columnCount: 5`, `span: 13`, `rowSpan: 5`, `alignItems: 'around'`, as the existing `:3873` case); SSR and CSR rendering of both parts. The CSS checks run with tokens, ui and effects stylesheets present, in the documented order (ui then effects, `:11920-11924`) and in the order egdev.es uses (effects then ui): the packed effects stylesheet declares none of `grid-template-columns`, `grid-column` or `grid-row` (the #392 guard: a failure names #392 and the file to review), and in the packed ui CSS each Grid collapse rule follows the base rules. No ref, no React 19-only API; React 18.3.1 and 19.3.0 run only through the existing packed harness.

## 6. Stories and Controls

`Primitives/Grid` keeps autodocs, `Meta<typeof Grid>`, no manual `argTypes` and no `play`; every story is English and typed `Story`. Demo boxes reuse the token utilities of the Stack stories (scanned through the preview `@source`).

- `Default`: three boxes with every prop omitted (one column, gap 4).
- `Columns`: `columnCount` 1, 2, 3, 4 and 12 in turn.
- `Gaps`: four token keys, as Stack's `Gaps`.
- `Alignment`: the five `alignItems` values over items of unequal height.
- `Collapse`: `collapseBelow` 860 and 1080. The docs say the threshold follows the viewport, not the story box, so the Canvas iframe width decides.
- `Spans`: a 12-column grid with spans 7 and 5 and a `rowSpan` of 2.
- `AboutSplit`: spans 5 and 7 with `GridItem asChild` over a `Stack`, collapsing at 860.
- `BuildThreeColumns`: `columnCount={3} gap={5} collapseBelow={1080}` over three cards.
- `AsChildList`: `Grid asChild` over a `ul` with `GridItem asChild` over each `li`, with the featured 7 by 2 layout.

Meta text: passive layout; DOM order is reading order; `collapseBelow` is inclusive and set on multi-column grids that carry text; `span` stays at or below `columnCount`; `className` is outer placement only; `asChild` merges onto exactly one prop-spreading child.

**Scene recipe migration.** About becomes `<Grid columnCount={12} gap={10} alignItems='stretch' collapseBelow={860}>` with `<GridItem span={5}>` around the `PhotoFrame` and `<GridItem asChild span={7}><Stack gap={8} justifyContent='center'>` around the quote and card. Community becomes `<Grid columnCount={2} gap={6} alignItems='stretch' collapseBelow={860}>` with the two cards as direct children. The 48rem threshold moves to 860 as the owner decided, pending visual review (D2). Controls: the registered enhancer shows each own prop as a select or boolean and injects no argument; real browser Controls are checked in section 9, not inferred from tags.

## 7. Changelog entries

Headings as the owner approved (D4): `packages/ui/CHANGELOG.md` gets a new `## Unreleased` section above `## 0.11.0` and `packages/system/CHANGELOG.md` one above `## 0.13.0`, because both versions are packed and released (`release/release.json` records ui 0.11.0 and system 0.13.0), so their sections are never edited. The parent renames the headings to `## 0.12.0` and `## 0.14.0` in the version-bump commit, and the text moves unchanged. Planned `packages/ui/CHANGELOG.md` entry:

```md
## Unreleased

### Added

- `Grid` and `GridItem` lay out columns without consumer utilities. `Grid` draws 1, 2, 3, 4 or 12 equal columns with a
  token `gap` and an `alignItems` choice, and `collapseBelow` (860 or 1080) stacks it into one column at and below that
  viewport width, resetting each direct child's span. `GridItem` places an item with `span` (1 to 12) and `rowSpan`
  (1 to 4). Both accept `asChild` for semantic lists (`ul` and `li`), add no role, ref or stylesheet, and keep DOM
  order as reading order. The About and Community scene recipes use them, so their columns now stack at 860px instead
  of 768px. (#395)
```

`packages/system/CHANGELOG.md`, a new section above `## 0.13.0`:

```md
## Unreleased

### Added

- The source-derived artifact and reference include `Grid` and `GridItem` (their props and static recipes), the four
  new naming concepts and their reused conventions, and the catalog rows; existing props and recipes are unchanged.
  (#395)
```

`(#395)` cites a fully resolved issue, as [versioning](../../../distribution/versioning.md) requires, and the owner approved it (D5, L4). `release.json` `resolves` collects it from versioned sections only, so it takes effect when the heading is renamed at the bump.

**Gate (D4, resolved).** With the manifests unbumped, a `## 0.12.0` or `## 0.14.0` heading would make `changelogError` fail (`CHANGELOG.md top section is 0.12.0, expected 0.11.0`), so `pnpm release:pack` and `pnpm test:package-release` would fail until the manifests carry the same versions. `docs/distribution/versioning.md:70-90` describes `## Unreleased` as the between-release holder, which `release:pack` ignores. The owner approved it (L4): while the manifests stay at ui 0.11.0 and system 0.13.0, the entries are committed under `## Unreleased`, and the parent renames the headings to `## 0.12.0` and `## 0.14.0` in the bump commit, with the `packages/mcp/README.md` example refresh the versioning guide requires; the text is final and moves unchanged. This PR bumps no manifest and makes no tag; `pnpm test:package-release` still runs a real `release:pack` as a check.

## 8. Checks to run

All commands run from the repository root, one at a time in the foreground. None had run when this plan was approved. The first command is the identical RED and GREEN runner.

```sh
pnpm exec vitest run packages/ui/src/primitives/grid packages/ui/src/lib/grid-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/primitives/stack packages/ui/src/organisms/blog-grid packages/ui/src/organisms/hero --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/ui/src/primitives/stack packages/ui/src/organisms packages/tokens packages/effects packages/cli packages/ui/src/styles/legacy
pnpm typecheck
pnpm props:docs
pnpm props:check
pnpm test:props
pnpm artifact --write
pnpm system:docs
pnpm artifact --check
pnpm system:check
pnpm test:artifact
pnpm test:system
PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py
pnpm lint
pnpm test
pnpm build
pnpm test:package-exports
pnpm test:package-consumption
pnpm test:package-release
pnpm storybook-build
git status --short
```

The `git diff --stat` scope check must print nothing, and the final `git status --short` must list only section 2 paths: no scratch, cache or `.playwright-mcp/` output. `pnpm build` may regenerate artifacts: recheck `pnpm artifact --check` afterwards. `pnpm test:package-consumption` creates isolated fixtures and may install dependencies, so it needs specific permission and a verified offline cache; it must exercise React 18.3.1 and 19.3.0 with shipped tokens, ui and effects CSS and no Tailwind compiler. `pnpm test:package-release` runs a real `release:pack` and must pass: the entries sit under `## Unreleased` (D4), so the first versioned changelog section still equals the manifest version. Record any unavailable matrix as pending. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens test, `test:package-exports` and `test:package-consumption`; the artifact and release checks are not in CI and are run here because `@egdev/system` ships.

## 9. Browser and capture procedure

Browser runs are approved (D2, L4): starting Storybook, or its static build, and driving a browser are covered; PNG captures are not (step 7). Follow the [capture guide](../../../design/README.md). Record commit, browser and version, viewport, device scale, theme, loaded fonts, crop and date for every observation. Stories: `primitives-grid--build-three-columns`, `--about-split`, `--as-child-list`, `--collapse`, `--spans`, plus `recipes-scene-recipes--about-scene` and `--community-scene`.

1. **AC-14 track count and boundary.** At 320, 390, 768, 860, 861, 1080, 1081 and 1280px the computed `grid-template-columns` of each root has the expected track count: `columnCount` above the threshold and 1 at and below it, inclusive at 860 and 1080.
2. **Geometry.** About tracks are about 5/12 and 7/12 of the content width within one gap; Build has three tracks equal within 0.5px; the featured item spans two rows beside its 5-column neighbours; no horizontal overflow (`scrollWidth` not above `clientWidth`) at 320, 390, 768 and 1280px.
3. **Order.** For each story the sequence of item rectangles in reading order (top then inline start) equals the DOM order, with spans and without collapse.
4. **Threshold move (D2).** The Community and About recipes (768 to 860px) and a Discord-like pair (761 to 860px) now stack; record before and after for the owner's visual review.
5. **Stylesheet order.** In a packed consumer page, import ui then effects and then effects then ui, and confirm the collapse still applies at 860px; this is the browser check behind the AC-12 packed guard.
6. **Controls.** Each own prop is a select or boolean with options in union order and no injected argument.
7. **Captures VIS-01 to VIS-04,** only if authorized: component-zone PNGs under `docs/components/grid/v0.1/` named `<story>--<state>--<viewport>--<theme>.png`, with `capture.json`, hashes and conditions. They are observed implementation, not approved expected design, until the owner adopts exact hashes. Nothing from `.playwright-mcp/` is copied or committed except the requested captures.

**Visual conformity: Not evaluated.** No capture exists, and none of this plan's browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English, citing #395. The PR is squash-merged as in earlier plans; the slices exist for review and bisect.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `feat(ui): add the Grid and GridItem layout primitives (#395)` | `types.ts`, `useGrid.ts`, `Grid.tsx`, `index.ts`, `Grid.test.tsx`, the barrel lines, the `compiled.css` source line, the barrel-inventory pins in `storybook-docgen.test.ts` | ≈ 450 |
| 2 | `feat(ui): add the Grid stories, migrate the scene recipes and pin the Storybook contract (#395)` | `Grid.stories.tsx`, the recipe story and its two docs, `preview.css`, `main.ts`, `grid-docgen.test.ts`, the Controls pins, E1 and E2 | ≈ 363 |
| 3 | `feat(ui): register the Grid naming conventions (#395)` | `prop-naming.json`, `docs/prop-naming.md`, `prop-naming.test.mjs`, the receipt (D3) | ≈ 401 |
| 4 | `test(ui): add the packed-build checks and the #392 guard for Grid (#395)` | `package-exports.test.mjs`, `package-consumption.test.mjs` | ≈ 185 |
| 5 | `chore(integration): refresh the Grid artifact, catalog rows and changelogs (#395)` | `design-system.json`, `system.md`, the artifact test, `catalog_data.py` and generated catalog, both changelogs | ≈ 110 |
| 6 | `docs(grid): record the v0.1 implementation evidence (#395)` | `implementation-evidence.md`, the ODD log, and `capture.json` with PNGs only if authorized | ≈ 63 |

Slice 1 keeps the component, its tests, the barrel and the barrel-inventory pins together, so `typecheck`, `lint` and the unit suites stay green; slice 3 keeps the registry, the pins and the receipt together so `props:check` and `test:props` stay green per commit. `pnpm test:package-exports` and `pnpm test:package-consumption` are stale between slices 1 and 4 and `pnpm artifact --check` between slices 1 and 5; if every commit must pass them, fold slices 4 and 5 into slice 1 (≈ 745). A failing RED commit is never made.

## 11. Estimated changed lines

About **1,572 changed lines**: ≈ 1,511 hand-written (component files 591: `types.ts` 135, hooks 45, JSX 28, `index.ts` 3, tests 230, stories 150; test files, fixtures and pins ≈ 528; registry JSON, receipt, catalog source and changelogs ≈ 285; barrel, stylesheet and Storybook source lines, recipe story, docs, evidence and log ≈ 107) and ≈ 61 generated (`docs/prop-naming.md` ≈ 10, `design-system.json` 2, `system.md` ≈ 45, catalog ≈ 4). For calibration, the Stack and Cluster commit `5bc0ddc` changed 25 files with +987 / −24, of which 673 lines sit in the component folder (Grid's 591 cover two parts instead of two components); without the D3 receipt the estimate drops by about 250 lines.

## 12. Risks

- **Risk 1 — Cascade.** The collapse works only while the media blocks follow the base rules at equal specificity. E2 must prove it on the emitted build, not infer it from class order or `twMerge`, and the failing-order proof must run once.
- **Risk 2 — Name collision (OQ-1, resolved).** The registry rejects `columns`; the owner chose `columnCount`, so no exception exists. Hash the registry sources last.
- **Risk 3 — Release gate (mitigated by D4).** A versioned changelog heading above an unbumped manifest would break `release:pack` and `test:package-release` (G7). The entries sit under `## Unreleased` instead; the rename to versioned headings belongs to the bump commit, which brings the MCP README refresh and the digest coupling the versioning guide describes.
- **Risk 4 — Cross-package cascade (#392).** Latent today (spec V-8). The packed guard turns a future effects utility on a collapse property into a failing test rather than a silent layout break; it does not fix #392.
- **Risk 5 — Pinned inventories.** Export, docgen, Controls and receipt pins move with the new names; the first red run lists the ones missing from section 2.
- **Risk 6 — Registry coupling.** Every `types.ts` edit invalidates the Grid source revisions. Hash last, and rehash after any formatting change.
- **Risk 7 — Consumer fit.** A `span` above `columnCount` adds implicit columns; a Grid in a non-stretching Stack is sized by its content; the threshold move to 860 changes layouts between 761 and 860px; About at 5/7 is narrower than the 5fr/6fr reference (spec F-2 to F-6).
- **Risk 8 — Storybook docs viewport.** The collapse follows the window width, so a docs page shows the same state for every story on it; the `Collapse` story says so.
- **Risk 9 — Packed harness.** `test:package-consumption` needs an offline cache and permission to install; without them the React 18 and 19 matrix and the effects-present checks stay pending, which blocks "verified in packed consumers" claims, not the rest.
- **Risk 10 — Parallel branches.** Other Website III scene parts (#398, #397 and #393, by the milestone order) may land on the same shared outputs: `prop-naming.json`, `prop-naming.test.mjs`, `docs/prop-naming.md`, `design-system.json`, `system.md`, `catalog_data.py` with its generated files and both changelogs. Expect rebase conflicts. Regenerate generated files instead of hand-merging, and re-hash `types.ts` revisions after rebasing.
- **Risk 11 — Slice size.** Slice 1 is about 450 lines because the component, its tests, the barrel and the barrel pins stay together; it is not split further.

## 13. Owner decisions

No token, dependency or Radix decision is pending: none is needed. The owner resolved D1 to D5 with the answer "Aprobar (Recomendado)" (`odd/tasks/layout-grid-395.md` L4); each decision is kept as drafted, followed by its resolution.

1. **D1 — Plan approval (G1).** Approve this exact plan and the section 2 surfaces, including the parent-owned integration files, or revise it. The spec approval does not cover it. **Resolved: approved** as drafted, with D4 changed to `## Unreleased` (L4).
2. **D2 — Browser and capture authorization.** Starting `pnpm storybook` and using Playwright MCP are needed to evaluate AC-14 and AC-15, the stylesheet-order check and the owner's visual review of the move of Discord's 760px and the recipes' 768px to 860px. Without it those rows stay Pending or **Not evaluated**. Adopting any capture as expected design is a separate decision. **Resolved: browser runs approved** (L4). PNG captures of VIS-01 to VIS-04 and adopting any capture as expected design are not covered, so they stay pending.
3. **D3 — Convention receipt (spec OQ-6).** Approve the four new conventions, with the exact texts in the spec, at plan approval so slice 3 can record the receipt and promote the entries. Otherwise they stay `proposed`. **Resolved: granted** ("the registry receipts for the new conventions", L4).
4. **D4 — Changelog headings and versions.** The parent decides. Recommended: keep the entries under `## Unreleased` while the manifests stay at ui 0.11.0 and system 0.13.0, and rename the headings to `## 0.12.0` and `## 0.14.0` in the bump commit, because the versioned headings alone fail the release gate (G7). If the parent chooses the versioned headings now, bump the manifests in slice 5 and refresh the MCP README. **Resolved: `## Unreleased` sections** in ui and system, renamed at the version bump (L4).
5. **D5 — Issue citation.** The entries cite `(#395)`, which marks the issue resolved when a versioned section ships. If the owner wants #395 to stay open until egdev-website adopts Grid, write `Refs #395` instead. **Resolved: `(#395)` is cited** (L4).
6. **D6 — Publishing the snapshot.** Publishing v0.1 as a comment on a canonical issue is a separate GitHub authorization, not required before code. **Not covered by L4:** it stays a separate authorization.

Plan-level choices (vetoable at G1; none was vetoed, so they stand): inline literal maps with no runtime import from Stack; the new `grid-docgen.test.ts` instead of extending the Stack-era parser list; `GridItem asChild` over a `Stack` for About; the nine story names; the guard test that fails if effects declares a collapse property.

## 14. Stop

G1 is granted (2026-11-27): this plan authorizes the edits of section 2 and the checks of section 8. It still authorizes no token, dependency, capture, release, tag, GitHub or Git action (the parent commits). Stop and return to the owner on any G8 condition, a contradictory result, or a needed edit outside section 2.
