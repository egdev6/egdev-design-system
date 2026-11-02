# NowCard v0.1 — implementation plan

- **Status:** Proposed. Presented for separate owner approval; it authorizes no code, no registry write, no catalog regeneration and no Git action.
- **Contract authority:** [spec.md](spec.md) v0.1 and its byte-identical published snapshot [issue-comment.md](issue-comment.md) (issue body). `version: 0.1`; `contentSHA256: 7bd00ad82db7e42f639972fc96dd7f86b0c1fdbf3b8bddeae655fdc5646f5e57` — reproduced byte-exact in this working tree with the spec's own rule; local `spec.md` and `issue-comment.md` payloads are identical. Visual hash: VIS-02 `9fff262c4e7d6782e4cac2876388f59a71db3ebe99a5b1ae5f6a1b1efef91c23` (capture `now-card--variants--1280x1400--dark.png`, conditions in [capture.json](capture.json)).
- **Owner approval of the contract:** [issue #276 comment 6580404063](https://github.com/egdev6/egdev-design-system/issues/276#issuecomment-6580404063) (2026-11-02, recorded in `odd/tasks/web-catalog.md` L16), owner answer verbatim: `"Aprobar con las recomendaciones (Recomendado)"`. Every OQ (OQ-1…OQ-5) resolved as recommended: v0.1 ships **without** the four-pixel isometric meter (footer stays a slot); the status pill composes `Badge tone="brand" variant="soft"`; the footer paints the `surface-0` band with a top hairline; no card-level hover movement; `sm` never clamps or hides content.
- **Plan identity:** `contentSHA256: ecd521d1784304dda12c2f08b508ea750039e8dc87101a115dd1f8e668a05b5d` — SHA-256 of the UTF-8, LF, final-newline payload from `## 1. Authority and gates` through EOF.
- **Baseline:** branch `docs/web-catalog-layer-c-specs-2`, commit `fc6f977`. Current reviewed source bytes: `packages/ui/src/index.ts` `f85891be…`, `primitives/surface/types.ts` `26d0726b…`, `molecules/module-card/types.ts` `ed7adc13…` / `useModuleCard.ts` `4e279bad…` (banded head/foot precedent), `molecules/panel/usePanel.ts` `94136856…`, `primitives/text/types.ts` `badce409…`, `atoms/badge/types.ts` `81d97cd4…`, `atoms/link/types.ts` `b5e5ba0b…`, `atoms/chip/types.ts` `aac60553…` (box-border precedent). All re-verified in this working tree.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the implementation edit surface; contract approval alone grants no code.
2. **G2 — Spec provenance (no blocker, no edits).** The local `spec.md` header still reads **Draft / Pending** although the contract was approved on #276 (L16). That header is historical snapshot metadata of the published snapshot; the approval comment plus the exact `contentSHA256` above is sufficient provenance. No frozen file is modified. The spec's two `../web-catalog/v0.1/…` relative links are broken (`../../web-catalog/…` required); they remain a reported documentation-only follow-up outside this task's edit surfaces, not an implementation blocker.
3. **G3 — Registry.** No new convention and no exception is requested (spec §3). Applied approved entries only: `heading-title`, `heading-level`, `preset-dimensions`. Usages are appended at implementation time with real source revisions; convention statuses never change here.
4. **G4 — Visual reference status.** VIS-02 stays `Proposed`; the approval comment adopts the OQ recommendations and does not name the capture. Appearance is judged against the written recipe; browser observations are recorded per criterion (§10).
5. **G5 — No token, dependency, Material or legacy change.** Verified-present tokens only: `--shadow-edge`, `--shadow-elev-1`, `--gradient-sheen`, `--text-heading-small`, `--text-body-large`, `--text-meta`, `--duration-*` unused (no motion). **No stylesheet** (spec) — no `now-card.css` is created. No meter geometry (OQ-1), no `skewY`, no new keyframe, no dependency, and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical.
6. **G6 — Parent-owned integration.** Registry JSON, generated props view, catalog source/artifacts, `packages/ui/src/index.ts` and package harnesses are parent-owned for the implementation task; this plan only documents them.
7. **G7 — Layer-(b) lessons are obligations.** (a) `box-border` on every non-button root/part painting border or padding: root and footer band both compose `surfaceVariants`, whose base already carries `box-border` — asserted by test (mirroring `Chip.test.tsx:481-492`). (b) Real-browser layout verification against VIS-02 before merge (§10).

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Responsibility |
| --- | --- | --- |
| `packages/ui/src/molecules/now-card/types.ts` | Writer | `NowCardSize` (`'md' | 'sm'`), `NowCardLevel`, CVA recipes (`nowCardVariants` with `size`; `nowCardBodyVariants`, `nowCardFootVariants`, `nowCardDetailVariants`, `nowCardDetailValueVariants`), and `NowCardProps`, `NowCardBodyProps`, `NowCardFooterProps`, `NowCardDetailProps` per spec §3; `type` only, `ModuleCard` protected-prop `Omit` list, English JSDoc with `@control` everywhere |
| `packages/ui/src/molecules/now-card/useNowCard.ts` | Writer | Title normalization (blank → warn + nothing rendered), rank fallback, protected-prop stripping, `useId()` heading id, per-part `cn()`, `data-size` |
| `packages/ui/src/molecules/now-card/NowCard.tsx` | Writer | JSX only: root `article`, exported parts `NowCardBody` (`div`), `NowCardFooter` (`div`), `NowCardDetail` (`span`) — parts in one file (`Panel` precedent) |
| `packages/ui/src/molecules/now-card/NowCard.test.tsx` | Writer | RED-first tests for NC-01…NC-10 plus box-border/passivity assertions (§5) |
| `packages/ui/src/molecules/now-card/NowCard.stories.tsx` | Writer | `Molecules/NowCard`, English: `Default`, `WithBadge`, `WithLink`, `WithNextDate`, `WithSingleChild`, `Sizes`, `HeadingRanks`, `LongContent`, `ReducedMotion` |
| `packages/ui/src/molecules/now-card/index.ts` | Writer | Named exports of the four components, `export type * from './types'` |
| `packages/ui/src/index.ts` | Parent (integration) | `export * from './molecules/now-card';` alphabetically in the Molecules block |
| `packages/ui/src/lib/storybook-docgen.test.ts` / `storybook-controls.test.ts` | Parent (integration) | NowCard rows, zero owned diagnostics |
| `scripts/package-exports.test.mjs` / `package-consumption.test.mjs` | Parent (integration) | Sorted type lists, SSR/consumer cases per §8 |
| `skills/_shared/prop-naming.json` + `docs/prop-naming.md` | Parent (integration) | Append NowCard usages to `heading-title`, `heading-level`, `preset-dimensions`; no new entry |
| `scripts/catalog_data.py` + `docs/CATALOGO.md` / `docs/catalog.json` | Parent (integration, shared Unit C) | NowCard row note refresh (§9, composes unchanged); single regeneration run, no parallel writers |

**No stylesheet.** `compiled.css:49` (`@source "../molecules/**/types.ts"`) and `.storybook/preview.css:13,54` (molecules stories wildcard) already cover the new folder — no `@source` edit, none invented.

Explicitly untouched: `docs/components/now-card/v0.1/**` (frozen), `packages/tokens/**`, legacy CSS, other components.

## 3. Typing approach and API fidelity

`NowCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'title' | 'role' | 'tabIndex' | 'contentEditable' | 'dangerouslySetInnerHTML' | 'aria-label' | 'aria-labelledby' | 'aria-disabled' | 'aria-selected' | 'aria-pressed' | 'aria-live'> & { title: string; level?: 2|3|4|5|6; size?: 'md'|'sm'; children?: ReactNode; className?: string }` — the `ModuleCard` protected list verbatim (the heading owns the article's name). Parts: `NowCardBodyProps = { children: ReactNode; className?: string }`; `NowCardFooterProps = { children: ReactNode; className?: string }`; `NowCardDetailProps = { children: ReactNode; className?: string }` (the `<b>` value is consumer content; the part styles it). `@control text`/`select`/`false` + `@controlReason` per declaration; `@default 3`, `@default md` as bare tag values. No ref, no `asChild`, no state.

## 4. Recipes and class composition

- **Root:** `cn(surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }), nowCardVariants({ size }), className)`; base adds `flex flex-col min-w-0 overflow-hidden` (the band's square corners must not bleed past `rounded-xl` without relying on child rounding alone). `surfaceVariants` base carries `box-border` (G7a, asserted).
- **Body:** `nowCardBodyVariants` = `eg-now-card__body flex flex-col gap-2 p-6` (+ `sm` step `p-4`), typography on children comes from the consumer except the body's own `text-body-large text-fg-secondary` inherited color step (spec §6: body carries "the inner padding and the body typography").
- **Footer:** `nowCardFootVariants` = `cn(surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' }), 'eg-now-card__foot border-t border-border-hairline rounded-b-xl px-6 py-3 flex flex-wrap items-center justify-between gap-2 min-w-0', size step)` — exactly the documented `ModuleCard` banded-footer geometry (`useModuleCard.ts` composes the same `surface-0` band). A footer with a single child aligns to the leading edge: `justify-between` with one child naturally start-aligns; the `WithSingleChild` test pins it.
- **Detail:** `eg-now-card__detail font-display text-meta uppercase tabular-nums text-fg-muted`; the `<b>` descendant gets `text-fg-default font-extrabold` through `nowCardDetailValueVariants` applied on the part (`[&>b]:…`-free: the part renders consumer children, so the recipe styles via the `eg-now-card__detail b` descendant is a selector — instead the part applies `data-[detail]` group styling? **Decision:** keep it a pure pass-through span and express the `<b>` emphasis as a documented CSS-free utility on the part: `[&_b]:text-fg-default [&_b]:font-extrabold` (static arbitrary-variant utility, token-valued, scannable). No stylesheet.
- **Heading:** `text-heading-small text-fg-default` (+ `sm` density step), element `h{rank}` with the `useId()` id; the composed `Badge` (consumer child of `NowCardBody`) keeps its own recipe (`tone="brand" variant="soft"` in examples only — the card does not bake the tone).
- **Composition rules:** per-part `cn()` with each part's `className` merged last for local layout; root `className` last for outer layout. No `data-state`, no hover/transition/animation utilities anywhere on the card (approved OQ-4). No meter, no `skewY` (OQ-1).

## 5. Test-first sequence

New component; every behavior test RED first. Public interface only.

| Step | RED test (`NowCard.test.tsx` unless noted) | Covers |
| --- | --- | --- |
| R0 | `storybook-docgen.test.ts` (NowCard section): docgen extraction with `diagnostics: []`; `level`/`size` finite enums | NC-10, early |
| R1 | `article` role; `h3` default and per-`level`; `aria-labelledby` → heading id | NC-01 |
| R2 | Blank/whitespace `title` warns in development and renders nothing | NC-02 |
| R3 | Body/footer parts in DOM order with public markers; footer band classes contain `bg-surface-0`, `border-t`, `rounded-b-xl` markers; root keeps `rounded-xl` | NC-03 |
| R4 | `size="sm"` density classes and full copy/footer still render (no clamping/hiding) | NC-04 |
| R5 | A `Badge` inside `NowCardBody` renders its label, adds no tab stop | NC-05 |
| R6 | Footer with `NowCardDetail` + `Link`: exactly one tab stop; single-child footer aligns to the leading edge | NC-06 |
| R7 | `NowCardDetail` renders one sentence; `<b>` emphasis utilities present on the part; a real `<time dateTime>` child survives | NC-07 |
| R8 | Long copy/detail at a narrow host: no `truncate`/`line-clamp` utilities; footer wraps (`flex-wrap`) | NC-08 |
| R9 | No `transition`/`animate`/`hover:`/`cursor-pointer` utility on root or parts; `matchMedia('(prefers-reduced-motion: reduce)')` render unchanged | NC-09 |
| R10 | Root class set contains `box-border` (surface-composed, per G7a) | G7a |

**PRESERVE.** No existing shared code changes; the plan adds a folder plus one parent-owned export line. Evidence: existing lib/harness suites pass unchanged except their NowCard additions, and `ModuleCard`/`Panel` suites (the banded-footer precedents whose recipes are re-composed, not modified) stay green.

GREEN order: `types.ts` → `useNowCard.ts` → `NowCard.tsx` → `index.ts` → stories → parent integration.

## 6. Stories and Controls

`Molecules/NowCard`, autodocs, `Meta<typeof NowCard>`, no manual `argTypes`, no `play`. `Default` (badge + copy + footer detail + `Link`), `WithBadge`, `WithLink`, `WithNextDate` (`NowCardDetail` with `<time dateTime="2026-11-05T18:00:00Z">` inside `<b>`), `WithSingleChild`, `Sizes` (md row + sm row, mirroring VIS-02), `HeadingRanks`, `LongContent`, `ReducedMotion`. Examples compose `Badge tone="brand" variant="soft"` and `Link variant="underlined"` / `IconButton` as the spec's composition notes prescribe; the card itself never requires them.

## 7. Registry integration

Applied approved entries: `title` → `heading-title`; `level` → `heading-level`; `size` → `preset-dimensions`. No new convention, no exception, no status change (spec §3). Parent appends the three usages at implementation with `source.revision = sha256:<new types.ts whole-file hash>`, regenerates the view (`pnpm props:docs`) and runs `pnpm props:check` + `pnpm test:props`.

## 8. Package exports and consumption

- `scripts/package-exports.test.mjs`: add `NowCard`, `NowCardBody`, `NowCardFooter`, `NowCardDetail` and prop types to the sorted lists; SSR smoke asserts `article` + band + one tab stop.
- `scripts/package-consumption.test.mjs`: positive cases (badge+copy+footer, sm, single-child footer); documented `@ts-expect-error` negatives for the protected `aria-label`/`role` on the root. Packed React 18/19 compile via the existing harness; no ref, no React-19-only API, no new compatibility claim.

## 9. Catalog row update (shared parent-only Unit C)

All six layer-(c) rows are refreshed by **one shared parent-only integration unit (Unit C)** — a single writer edits `scripts/catalog_data.py`, then runs `python3 scripts/build_catalog.py` once; no parallel writers touch the shared file. Generated files are never hand-edited. For this component, Unit C refreshes line 77 to the implemented pattern with the composes column **unchanged** (`Surface, Text` — no correction was approved for this row): note → "Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/276): passive status article named by its generated heading; consumer `Badge` in the padded body and a `surface-0` footer band with top hairline holding one supplied detail and/or one action; `sm` density never clamps or hides. No meter, stylesheet, ref, asChild or hover motion."

## 10. Browser checks to run before merge

Against `pnpm storybook` with real compiled tokens, after GREEN; observations recorded, never replacing tests:

1. Controls render per the central enhancer; zero owned diagnostics across NowCard stories.
2. **Real-browser layout verification against VIS-02:** compare `Sizes`/`Default` structure with the captured board — badge → heading → copy → hairline footer with detail and/or action; two densities; the meter visible in the capture is an **allowed difference** (approved OQ-1: not part of v0.1); the capture's uppercase 6 px-radius tag appears as the `Badge` composition (allowed difference). Visual conformity reported per criterion; capture never overwritten.
3. **Box-border / layout shift (layer-b lesson):** consumer-set width contains the border (`box-border`); the `surface-0` band's square top corners sit inside the `rounded-xl` root with the hairline visible; `sm` shrinks padding/heading without clamping copy; no layout jump between md and sm for the same content other than the density step.
4. Hover over the card body: no movement, no glow, default cursor; the footer `Link` keeps its own hover/focus treatment and ring.
5. Reduced motion and 200% zoom: no transform/animation; long detail wraps.

Full gates before merge, parent-scheduled with observed output: `pnpm typecheck`, `pnpm lint`, focused first (`pnpm exec vitest run packages/ui/src/molecules/now-card packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts`), then `pnpm test`, `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm props:check`, `pnpm test:props`.

## 11. Bounded work units

1. **Unit A (writer):** the six `packages/ui/src/molecules/now-card/` files; focused tests green.
2. **Unit B (parent integration):** index export line, docgen/controls sections, package harness additions, registry usage append + props check.
3. **Unit C (shared parent-only catalog integration, all six components):** exact row refreshes per each plan's §9, one `build_catalog.py` run.

## 12. Risks

- **R-1 — `<b>` emphasis via `[&_b]` arbitrary variant.** It is a static, token-valued, scannable utility; the CSS-block assertion added to `package-exports.test.mjs` verifies emission. If it fails to emit, the fallback is a spec question (a one-property stylesheet role), never inline style.
- **R-2 — Footer band square corners.** Handled by root `overflow-hidden` plus the band's `rounded-b-xl`; both are asserted so the band never bleeds past the frame radius.
- **R-3 — VIS-02 shows the meter and a non-Badge pill.** Both are approved allowed differences (OQ-1/OQ-2); they must not be implemented to "match the capture".
- **R-4 — Spec provenance** (G2): historical snapshot metadata; the frozen digest and approval comment are the binding provenance; broken relative links remain a reported follow-up.

## 13. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, catalog or Git action is taken or implied.
