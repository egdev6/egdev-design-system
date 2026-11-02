# TipCard v0.1 — implementation plan

- **Status:** Proposed. Presented for separate owner approval; it authorizes no code, no registry write, no catalog regeneration and no Git action.
- **Contract authority:** [spec.md](spec.md) v0.1 and its byte-identical published snapshot [issue-comment.md](issue-comment.md) (issue body). `version: 0.1`; `contentSHA256: 7b0e82b7e2b7424efa0188b44b440afe5cd1bfdff16ba58365166d810739ac6e` — reproduced byte-exact in this working tree with the spec's own rule; local `spec.md` and `issue-comment.md` payloads are identical. Visual hash: VIS-01 `569106fc473a863fff84169116b3113fcec68c6e3ee8117e3382e6430d6e485e` (capture `tip-card--variants--1280x1400--dark.png`, conditions in [capture.json](capture.json)).
- **Contract approval + convention:** [issue #279 comment 6581571495](https://github.com/egdev6/egdev-design-system/issues/279#issuecomment-6581571495) (2026-11-02, recorded in `odd/tasks/web-catalog.md` L17), owner answer verbatim: `"Aprobar las recomendaciones"`. Every OQ (OQ-1…OQ-5) resolved as recommended: raised `surface-1` poster frame; caption **below** the cover (no overlay/scrim); the 2:3 proportion is fixed by the component (no `ratio` prop); the label **wraps** (never truncates); root `article` + generated heading. The same questionnaire **explicitly offered and approved** the `cover-badge` naming convention (recorded in L17); that approval comment is the recoverable convention artifact — no reapproval is requested.
- **Plan identity:** `contentSHA256: af590a4e50aa94a4420a8821c8005485f4203447229a0127a8757df8da62b83f` — SHA-256 of the UTF-8, LF, final-newline payload from `## 1. Authority and gates` through EOF.
- **Baseline:** branch `docs/web-catalog-layer-c-specs-2`, commit `fc6f977`. Current reviewed source bytes: `packages/ui/src/index.ts` `f85891be…`, `primitives/surface/types.ts` `26d0726b…`, `atoms/photo-frame/types.ts` `aca1d91a…` (numeric `ratio`, nine `focalPoint` values, required `src`/`alt`), `primitives/aspect-ratio/types.ts` `771b93da…`, `atoms/badge/types.ts` `81d97cd4…`, `primitives/text/types.ts` `badce409…`, `atoms/chip/types.ts` `aac60553…` (box-border precedent), `molecules/list-item/types.ts` `df2e05c4…` (component-owned heading precedent). All re-verified in this working tree.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the implementation edit surface; contract approval alone grants no code.
2. **G2 — Spec provenance (no blocker, no edits).** The local `spec.md` header reads **Draft / Pending** although the contract was approved on #279 (L17). That header is historical snapshot metadata of the published snapshot; the approval comment plus the exact `contentSHA256` above is sufficient provenance. No frozen file is modified. TipCard's spec links resolve correctly; no link defect.
3. **G3 — Registry materialization of the approved convention.** `cover-badge` is owner-approved via the recoverable artifact above (L17); approval evidence and registry materialization are separate steps. At implementation the parent adds the entry as `status: "approved"` with `approval: { reference: "https://github.com/egdev6/egdev-design-system/issues/279#issuecomment-6581571495", scope: "convention:cover-badge", contentHash: conventionHash(entry) }`, then regenerates and verifies. The retracted `thumbnail-badge` reuse stays retracted and is not silently substituted.
4. **G4 — Visual reference status.** VIS-01 stays `Proposed`; the capture documents web states v0.1 deliberately omits (`.is-active` glow, hover zoom, coverflow offsets, caption scrim, truncated labels). Appearance is judged against the written recipe; browser observations per criterion (§10). Nobody may "fix" the poster to look like the capture's scrim or truncation.
5. **G5 — No token, dependency, Material or legacy change.** Verified-present tokens/recipes only: `surfaceVariants` raised recipe, `PhotoFrame` (numeric `ratio` + `focalPoint`), `Badge tone="brand" variant="solid"`, `--font-mono`, `--text-label-default`, `wrap-anywhere` (Tailwind v4 utility). **No stylesheet** (spec). No scrim/overlay recipe, no deep-shadow recipe, no new token (the spec's pending token proposals stay reported, not added). No dependency. `packages/ui/src/styles/legacy/bundle.css` untouched.
6. **G6 — Parent-owned integration.** Registry JSON, generated props view, catalog source/artifacts, `packages/ui/src/index.ts` and package harnesses are parent-owned for the implementation task.
7. **G7 — Layer-(b) lessons are obligations.** (a) `box-border`: root composes `surfaceVariants` (base carries it); the caption row has no border/paint but the assertion still runs (G7a). (b) **Real-browser layout verification against VIS-01 before merge (§10), with explicit attention to the reserved 2:3 box** — the layer-(b) defect class (reserved geometry collapsing in flex/grid hosts, PhotoFrame auto-height amendment) applies directly to a fixed-ratio poster inside a `flex-col` root.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Responsibility |
| --- | --- | --- |
| `packages/ui/src/molecules/tip-card/types.ts` | Writer | `TipCardLevel`, CVA recipes (`tipCardVariants`; `tipCardCapVariants`, `tipCardTitleVariants`), and `TipCardProps` (`title`, `level`, `badge`, `src`, `alt`, `focalPoint`, `className`) exactly per spec §3; `type` only, `ModuleCard`-style protected `Omit` list for `article` (`role`, `tabIndex`, `aria-label`/`aria-labelledby`, `aria-pressed`/`aria-selected`, `style`), English JSDoc with `@control` on every own declaration; re-export `PhotoFrameFocalPoint` where needed |
| `packages/ui/src/molecules/tip-card/useTipCard.ts` | Writer | Title/badge normalization (blank title → warn + nothing; whitespace badge → no pill), rank fallback, protected-prop stripping, `useId()` heading id, per-part `cn()`, `data-level` |
| `packages/ui/src/molecules/tip-card/TipCard.tsx` | Writer | JSX only: root `article` over the raised recipe, the internal `PhotoFrame` cover with fixed `ratio={2 / 3}`, and the internal caption row (`eg-tip-card__cap`) holding the `Badge` and the mono heading |
| `packages/ui/src/molecules/tip-card/TipCard.test.tsx` | Writer | RED-first tests for TP-01…TP-08 plus box-border, ratio-reservation and passivity assertions (§5) |
| `packages/ui/src/molecules/tip-card/TipCard.stories.tsx` | Writer | `Molecules/TipCard`, English: `Default`, `WithoutBadge`, `HeadingRanks`, `Ratios`, `FocalPoints`, `LongLabel`, `Widths` |
| `packages/ui/src/molecules/tip-card/index.ts` | Writer | `export { TipCard } from './TipCard'; export type * from './types';` (plus the `PhotoFrameFocalPoint` re-export if the public type references it) |
| `packages/ui/src/index.ts` | Parent (integration) | `export * from './molecules/tip-card';` alphabetically in the Molecules block |
| `packages/ui/src/lib/storybook-docgen.test.ts` / `storybook-controls.test.ts` | Parent (integration) | TipCard rows, zero owned diagnostics |
| `scripts/package-exports.test.mjs` / `package-consumption.test.mjs` | Parent (integration) | Sorted type lists, SSR/consumer cases per §8 |
| `skills/_shared/prop-naming.json` + `docs/prop-naming.md` | Parent (integration) | Append usages to `heading-title`, `heading-level`, `image-focal-point`; add `cover-badge` as `approved` bound to the #279 approval artifact (G3) |
| `scripts/catalog_data.py` + `docs/CATALOGO.md` / `docs/catalog.json` | Parent (integration, shared Unit C) | TipCard row: approved composes correction + implemented note (§9); single regeneration run, no parallel writers |

**No stylesheet.** `compiled.css:49` and `.storybook/preview.css:13,54` wildcards already cover the new folder; no `@source` edit.

Explicitly untouched: `docs/components/tip-card/v0.1/**` (frozen), `packages/tokens/**`, legacy CSS, other components.

## 3. Typing approach and API fidelity

`TipCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'title' | 'role' | 'tabIndex' | 'contentEditable' | 'dangerouslySetInnerHTML' | 'aria-label' | 'aria-labelledby' | 'aria-disabled' | 'aria-selected' | 'aria-pressed' | 'aria-live'> & { title: string; level?: 2|3|4|5|6; badge?: string; src: string; alt: string; focalPoint?: PhotoFrameFocalPoint; className?: string }` — the `ModuleCard` protected list (the heading names the card). No public part components in v0.1, so no per-part `className` surface (spec §3). `src`/`alt` are required non-empty (the poster is content; `PhotoFrame` already enforces them). Controls: `@control text` on `title`/`badge`/`src`/`alt`, `@control number` on `level`, `@control select` on `focalPoint` (finite nine-value enum extracted from `PhotoFrameFocalPoint`), `@default 3` and `@default center` as bare tag values. No ref, no `asChild`, no state.

## 4. Recipes and class composition

- **Root:** `cn(surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'sm', radius: 'xl' }), 'eg-tip-card flex min-w-0 flex-col gap-3', className)` — the approved OQ-1 raised frame; poster width is consumer layout (no built-in width). `surfaceVariants` base carries `box-border` (G7a, asserted).
- **Cover:** internal `<PhotoFrame src={src} alt={alt} focalPoint={focalPoint} ratio={2 / 3} />` — the 2:3 is fixed by passing the **numeric** ratio `2/3` (≈0.6667) to the public `PhotoFrame`/`AspectRatio` API (approved OQ-3: no `ratio` prop on TipCard). No `caption`, no `variant` overrides, no mirroring, no filter. `PhotoFrame`'s `figure`/`AspectRatio` composition is what guarantees the reservation; `AspectRatio` is Radix and needs no wrapper geometry from this card.
- **Caption row:** `div eg-tip-card__cap flex flex-col items-start gap-1.5 min-w-0` holding (1) the optional `<Badge tone="brand" variant="solid">{badge}</Badge>` (approved OQ badge recipe; whitespace → no badge and no empty pill) and (2) the heading `<h{level} id className="font-mono text-label-default text-fg-default wrap-anywhere">` — the approved OQ-4 wrap behaviour, removing the web's ellipsis workaround.
- **DOM order:** cover → badge → heading, never reordered (spec §2 reading order).
- **Composition rules:** root `className` merged last for outer layout only; no hover/transition/animation utilities anywhere (passive poster); no `data-active`, only the debugging `data-level`.
- **Deferred token proposals stay deferred:** mono-label recipe, caption scrim/overlay recipe, deep-shadow media-poster recipe (spec §6) — none implemented, none proposed in this plan.

## 5. Test-first sequence

New component; every behavior test RED first. Public interface only.

| Step | RED test (`TipCard.test.tsx` unless noted) | Covers |
| --- | --- | --- |
| R0 | `storybook-docgen.test.ts` (TipCard section): docgen resolves `title` (required), `src`/`alt` (required), `badge`, `focalPoint` (finite enum), `level`; `diagnostics: []` | TP-08, early |
| R1 | `article` role; heading is `h{level}`; `aria-labelledby` → heading id; image carries `src`/`alt` | TP-01 |
| R2 | Blank/whitespace `title` warns and renders nothing | TP-02 |
| R3 | `badge` renders the solid brand `Badge` only when supplied; whitespace-only renders no pill and no empty slot | TP-03 |
| R4 | Root classes contain the raised-recipe markers (`bg-surface-1`, `shadow-[var(--shadow-edge)…`/`--shadow-elev-1`, `rounded-xl`); `PhotoFrame` receives `ratio === 2/3` and the supplied `focalPoint`; no inline `style` and no custom property anywhere in the rendered tree | TP-04 |
| R5 | **Ratio reservation in a flex host (layer-b lesson):** inside a `w-48 flex flex-col` host the cover's `AspectRatio` box keeps 2:3 (offsetHeight/offsetWidth ≈ 1.5) and a slow/failing image does not collapse the caption row | TP-04 + G7b |
| R6 | Long `title` wraps: no `truncate`/`line-clamp`/`whitespace-nowrap` on the label; `wrap-anywhere` marker present | TP-05 |
| R7 | Zero tab stops, no interactive descendant, no `cursor-pointer`/`transition`/`animate` utility on the root | TP-06 |
| R8 | Root `className` merges last; no built-in width (`max-w-*` absent); two-width render keeps 2:3 | TP-07 |
| R9 | Root class set contains `box-border` (G7a) | G7a |

**PRESERVE.** No existing shared code changes; `PhotoFrame`, `AspectRatio`, `Badge` and `surfaceVariants` are consumed, not modified. Evidence: their focused suites stay green, and the lib/harness suites pass unchanged except their TipCard additions.

GREEN order: `types.ts` → `useTipCard.ts` → `TipCard.tsx` → `index.ts` → stories → parent integration.

## 6. Stories and Controls

`Molecules/TipCard`, autodocs, `Meta<typeof TipCard>`, no manual `argTypes`, no `play`. `Default` (badge + mono label + cover), `WithoutBadge`, `HeadingRanks`, `Ratios` (documents that the card fixes 2:3 and consumers set width), `FocalPoints` (the nine values), `LongLabel`, `Widths`. Stories use real image URLs (Storybook assets or placeholder services already used by `PhotoFrame` stories); no runtime `/_blob` references. `Default` supplies required args only.

## 7. Registry integration

Applied approved entries: `title` → `heading-title`; `level` → `heading-level`; `focalPoint` → `image-focal-point`. Owner-approved convention (G3): `cover-badge` (`badge`), approved via [issue #279 comment 6581571495](https://github.com/egdev6/egdev-design-system/issues/279#issuecomment-6581571495). At implementation the parent adds it as `approved` with that reference, the exact `convention:cover-badge` scope and `conventionHash(entry)`, appends the usages with real source revisions, regenerates the view (`pnpm props:docs`) and runs `pnpm props:check` + `pnpm test:props`. No exception requested.

## 8. Package exports and consumption

- `scripts/package-exports.test.mjs`: add `TipCard`, `TipCardProps` (and the `PhotoFrameFocalPoint` re-export if exported) to the sorted lists; SSR smoke asserts `article` + image + zero tab stops.
- `scripts/package-consumption.test.mjs`: positive cases (badge, no-badge, non-center focal point); documented `@ts-expect-error` negatives for the protected root attributes (`aria-label`, `role`). Packed React 18/19 compile via the existing harness; no ref, no React-19-only API.

## 9. Catalog row update (shared parent-only Unit C)

All six layer-(c) rows are refreshed by **one shared parent-only integration unit (Unit C)** — a single writer edits `scripts/catalog_data.py`, then runs `python3 scripts/build_catalog.py` once; no parallel writers touch the shared file. Generated files are never hand-edited. For this component, Unit C applies the **owner-approved composition correction** (L17, "planned catalog composition corrections"; recorded in the approved contract §3) plus the implemented note: line 80, composes `AspectRatio, Text` → `PhotoFrame, Badge; Surface recipe`; note → "Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/279): 2:3 tip poster (`PhotoFrame` numeric ratio fixed internally), optional solid brand cover-badge and a mono technical label that wraps below the cover on the raised `surface-1` recipe. No slider, scrim, deep shadow, truncation, ref or stylesheet."

## 10. Browser checks to run before merge

Against `pnpm storybook` with real compiled tokens, after GREEN; observations recorded, never replacing tests:

1. Controls render per the central enhancer; zero owned diagnostics across TipCard stories.
2. **Real-browser layout verification against VIS-01:** compare `Default`/`FocalPoints` with the captured board for the *surviving intent* — the 2:3 poster proportion, the solid brand category pill, the mono technical label. Omitted states in the capture (active neon border/halo, hover zoom, coverflow grey, caption scrim over the image, truncated labels) are **not** implemented and are recorded as allowed differences. Visual conformity reported per criterion; capture never overwritten.
3. **Box-border / geometry (layer-b lessons):** consumer width contains the frame border; the reserved 2:3 box holds in flex and grid hosts at two widths; a failed image load keeps the reservation and the caption row does not jump (TP behavior verified visually too).
4. Reduced motion and 200% zoom: no motion; long labels wrap with no clipping.
5. Keyboard: zero tab stops on the poster.

Full gates before merge, parent-scheduled with observed output: `pnpm typecheck`, `pnpm lint`, focused first (`pnpm exec vitest run packages/ui/src/molecules/tip-card packages/ui/src/atoms/photo-frame packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts`), then `pnpm test`, `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm props:check`, `pnpm test:props`.

## 11. Bounded work units

1. **Unit A (writer):** the six `packages/ui/src/molecules/tip-card/` files; focused tests green.
2. **Unit B (parent integration):** index export line, docgen/controls sections, package harness additions, registry usage append + the approved `cover-badge` entry (G3) + props check.
3. **Unit C (shared parent-only catalog integration, all six components):** exact row updates per each plan's §9 (this one includes the approved composes correction), one `build_catalog.py` run.

## 12. Risks

- **R-1 — 2:3 via numeric ratio.** `PhotoFrame` accepts `PhotoFrameRatio | number`; passing `2 / 3` must survive the primitive's reciprocal-percent math (verified in `aspect-ratio/types.ts` fallback rules — non-positive/unrepresentable falls back to square). R5's reservation test and the browser geometry check catch a collapse; if Radix's percent rounding drifts >1 px at narrow widths, record it as observation, do not patch geometry inline.
- **R-2 — `wrap-anywhere` utility emission.** A Tailwind v4.1 utility; the added CSS-block assertion in `package-exports.test.mjs` verifies emission. If absent from the installed Tailwind version, the fallback is a spec question (a one-property stylesheet role or a token-level proposal), never inline style.
- **R-3 — Capture's omitted states.** The `.is-active`/hover/coverflow/scrim states must never be implemented to "match" VIS-01 (G4).
- **R-4 — Registry materialization timing (G3).** `cover-badge` is approved; the JSON entry must be written with the exact scope and `conventionHash(entry)` at implementation and verified by `pnpm props:check`/`pnpm test:props`.

## 13. Stop

This plan authorizes nothing until G1. The `cover-badge` convention is already owner-approved (G3 artifact); no reapproval is requested. No source, test, token, dependency, registry, catalog or Git action is taken or implied.
