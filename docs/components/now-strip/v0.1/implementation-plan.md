# NowStrip v0.1 — implementation plan

- **Status:** Proposed for separate owner approval. This document implements nothing and authorizes no source, test, registry, catalog, token, dependency, Git or remote changes.
- **Coverage:** DP4, **S3**, a bounded NowStrip plan within [web catalog work](../../../../odd/tasks/web-catalog.md), not completion of the whole inventory or implementation.
- **Approved contract:** [NowStrip v0.1](spec.md), issue [#297, approval comment 6597592303](https://github.com/egdev6/egdev-design-system/issues/297#issuecomment-6597592303), owner answer “Aprobar con las recomendaciones (Recomendado)”. Canonical payload SHA-256 `6e083a20352345ed6d3b0317e13a114e2b83165568b518a4a0de6e18b32227c4`, UTF-8 from the exact heading line `## 1. Purpose and scope` through EOF, final LF included. Proposed/Pending header metadata is historical, not a reversal of approval.
- **Plan identity:** The parent hashes the **entire final plan file**, including its final newline, and records the owner's separate decision and exact whole-file hash as in [layer (d) approvals](../../web-catalog/v0.1/layer-d-plan-approvals.md). No self-hash is embedded. Any subsequent byte change requires a new hash and approval.
- **Visual references:** VIS-01 `97ee91df0f13be6b2954dd7ab587cf8f1a372509cc86c97833ce1e0ecf566fbf`; VIS-02 `944e986359850ec614d27ee83eb27dba16558f61c66306a7eadcac451a18c031`. Conditions and approved-contract differences are in the spec. Capture adoption is not assumed from the contract answer; request it separately with those differences. Until adoption and comparable checks, visual conformity is **Not evaluated**.

## 1. Independent owner gates

Plan approval is separate from each decision and future edit authorization below. Record each answer; no inference from Footer's or NowCard's approval.

1. **NowStrip-local breakpoint:** recommend the inclusive viewport boundary `[@media(width<=860px)]:grid-cols-1` on a `grid-cols-3` base. This is a NowStrip-only grant, not reuse of Footer's grant or a new breakpoint token. Require production emission and computed geometry at 859/860/861 and fractional widths around 860; stop if it cannot be proved.
2. **Bottom boundary and Material:** recommend root `m-0 pb-6 border-b-[length:var(--border-width)] border-b-solid border-b-border-hairline`. The bottom width is existing `--border-width`, color `--color-border-hairline`, padding `--space-6`; reset legacy margin and border rather than add paint. The host owns the Grafito reading surface; strip has no background, image or shadow recipe. Cards retain their approved independent surfaces. This is a NowStrip-specific decorative boundary, not Gauge's frame or a generic Surface recipe. Confirm tokens, emission, cascade and actual contrast; no token change.
3. **Registry naming:** recommend reuse of approved `accessible-name` for `NowStripProps.label`; `children` and `className` are React/native composition, not new own naming entries. No `collection-items`, `slot-composition`, new convention or exception is proposed. Recheck meaning/name/aliases and status before integration. Any newly discovered convention stays `proposed` with `approval: null` pending separate semantic approval; never infer global naming approval from #297 or plan approval.
4. **Legacy coexistence:** recommend the exact local inventory and computed-style checks in §4, with no legacy edit and no legacy internal markers. Approve this independently, conditional on actual shipped cascade and untouched legacy control results. If local static utilities cannot win, stop for a separately approved mechanism and meaningful stylesheet role; no `!important` workaround.
5. **Footer alignment feasibility:** recommend proving the delivered NowCard without modification, using uneven valid cards in real Chromium. Grid stretching alone guarantees equal outer heights, **not** aligned footer bands. `nowCardBodyVariants` currently has no `flex-1`; CommunityCard needed a growing body to pin its action. Test cards with varying body and badge/heading heights, footer content, multiple rows and missing optional parts. If aligned footers cannot be proved without changing NowCard or overriding its protected styling, stop and return evidence for a separate owner decision; do not amend NowCard, add descendant overrides, weaken the criterion or claim alignment. No such alignment is promised by the spec until verified.
6. **Visual references:** recommend adopting VIS-01/02 only for surviving intent with the spec's documented meter omission, solid card Material and larger glowing static dot differences. Compare at equivalent conditions; no claim of pixel parity or accessibility follows.

## 2. Contract, composition and future files

A passive `div.eg-now-strip` has `role="group"` and `aria-labelledby` pointing to the internal visible `p` label with a per-instance `useId()`. Render `StatusDot state="live" pulse={false}` as decorative and hidden from assistive technology; label text is the name. No `aria-live`, status role, extra landmark, keyboard handler or root tab stop. A blank or whitespace-only label warns in development and suppresses the entire group; an empty child collection still produces the named empty grid. Preserve supplied direct-child order, including null/boolean children without placeholders. No data, placeholders, child inspection, cloning, imposed size or fixed count.

Consumers supply direct `NowCard size="sm"` children, no wrappers, margins or explicit heights that defeat stretch; they own keys, headings, status, links and valid card parts. The grid is three equal `minmax(0,1fr)` tracks above 860px and one at or below, with `gap-5` and stretched direct items per row. Long text wraps naturally; no truncation or pagination. Native child interactions remain child-owned. No Pixel, built-in meter or arbitrary NowCard footer content: a future meter needs a separately approved NowCard footer amendment and Pixel decision.

`label: string` and `children: ReactNode` are required; `className` is optional and only supports root outer margin, width and parent placement. Inherit compatible `ComponentPropsWithoutRef<'div'>`, excluding `children`, `role`, `aria-label`, `aria-labelledby`, `aria-live`, `tabIndex`, `dangerouslySetInnerHTML` and `style`; enforce protected semantics at untyped boundaries as well. No ref or `asChild`. `cn()` merges recognized utilities, not arbitrary CSS selectors or appearance permissions; verify actual cascade and supported placement rather than promise universal last-class-wins.

Future writer-owned files under `packages/ui/src/organisms/now-strip/`, only after gates and scoped authorization:

| File | Responsibility |
| --- | --- |
| `types.ts` | Public types, protected native inheritance, English JSDoc and static token-backed per-part CVA. |
| `useNowStrip.ts` | Label validation, `useId()`, protected prop handling and per-part `cn()` composition. |
| `NowStrip.tsx` | JSX-only group, label/dot and grid consuming the hook. |
| `NowStrip.test.tsx` | Public behavior and hook tests with criterion-level RED evidence. |
| `NowStrip.stories.tsx` | English autodocs and real consumer composition examples. |
| `index.ts` | Named component and public types; variant exports only if approved. |

**No stylesheet**, conditional on utility emission and cascade proof. No extra internal module, dummy hook, inline appearance, token/dependency change or child/legacy source edit. Parent owns shared integration, naming, package fixtures and catalog. Production scan currently enumerates organism sources: inspect `packages/ui/src/styles/compiled.css` and add this `types.ts` source when authorized; inspect `.storybook/preview.css` for story-only sources independently.

## 3. Exact static utility candidates and compiler evidence

Proposed CVA root uses `m-0 pb-6 border-b-[length:var(--border-width)] border-b-solid border-b-border-hairline`; grid uses `grid grid-cols-3 gap-5 items-stretch [@media(width<=860px)]:grid-cols-1`; label uses `m-0 mb-3 flex items-center gap-2 font-display text-meta uppercase text-fg-secondary`. These are literal static strings, never interpolated. Choose existing token typography deliberately; it differs from Foundation's handwritten 15px and tracking. Confirm each standard token utility's declaration too; unsupported or conflicting output stops work.

**Complete NowStrip-owned arbitrary/variant utility inventory requiring parent emission proof:**

- `border-b-[length:var(--border-width)]` — emitted bottom border width is the existing token, not an arbitrary hardcoded length.
- `[@media(width<=860px)]:grid-cols-1` — emitted inclusive media condition and one-column declaration.

No `md:`, `max-[860px]:`, arbitrary selectors, dynamic classes or other variants are proposed for NowStrip. Parent evidence recorded in [layer (d) approvals](../../web-catalog/v0.1/layer-d-plan-approvals.md) and [ODD L31](../../../../odd/tasks/web-catalog.md): installed Tailwind 4.3.3 emitted no `md:`, while static `max-[X]:`/`min-[X]:` and arbitrary `[@media(...)]:` variants emit; `max-[X]:` compiles to exclusive `width < X`. The inclusive media form was proved in the Footer probe, but that does not prove this plan's exact full utility set, scanning or cascade. Parent must prove each candidate above in the production build, including media context and declarations; audit final CVA and extend the inventory before approval if implementation proposes any additional arbitrary or variant utility. Existing StatusDot and NowCard utilities remain their own shipped inputs and must also be present in packed CSS; no pulse variant should be active here.

## 4. Local legacy neutralization — gate 4

`packages/ui/src/styles/index.css` imports `legacy/bundle.css` in `@layer components`; confirm the actual packed CSS order rather than rely on `cn()` or class-string order. Keep `eg-now-strip` as the sole stable marker; do not emit `eg-now-strip__label`, `eg-now-strip__dot` or `eg-now-strip__grid`. Do not alter the old bundle or its consumers.

| Legacy selector / declaration | Local target and proof with shipped CSS |
| --- | --- |
| `.eg-now-strip`: `margin: 0` | Explicit `m-0`, then supported caller outer-placement utilities where applicable; measure all four computed margins for default and supported override. |
| `.eg-now-strip`: `padding-bottom: var(--space-6)` | Explicit `pb-6`; compute bottom padding and ensure caller layout classes do not override protected padding. |
| `.eg-now-strip`: `border-bottom: 1px solid var(--color-border-subtle)` | Replace width, style and color with gate 2 token recipe; inspect computed bottom width/style/color and all other edges. |
| `.eg-now-strip__label`: flex alignment/gap, margin, display family, weight/size/line-height, tracking, uppercase and secondary color | Avoid marker; explicitly set proposed new label layout and token typography. Measure display, alignment, gap, margin, font family/weight/size/line-height/letter-spacing, text-transform and color; inspect `p` UA margins. |
| `.eg-now-strip__dot`: fixed 8px geometry, radius and brand background | Avoid marker; inspect actual StatusDot 10px live geometry, glow, color, `aria-hidden` and absence of animation; no copied legacy dot. |
| `.eg-now-strip__grid`, including its `max-width:860px` rule: grid display, three tracks, `--space-5` gap and one narrow track | Avoid marker; inspect new grid display, tracks, gap and alignment at both sides and exactly 860, including fractional widths. |

In the same browser fixture retain an untouched legacy strip with its original internal markers and compare its computed root, label, dot and grid against baseline at all three widths. Include multiple new instances, an empty grid, host className placement and actual stylesheet layers. Verify NowCard's own prior corrections: root gap/alignment/min-height and footer negative margins, insets and overflow. A class assertion is not proof of computed style. If more selectors collide, stop and present an amended inventory; do not silently reset descendants.

## 5. RED → GREEN and preservation

All below is future work, not observed evidence. Add behavior-level tests for each NS criterion first and capture intended RED before its implementation; browser-only paint/geometry requires a failing built-CSS/browser fixture or a recorded reason a meaningful RED is unavailable. Implement minimally, run focused GREEN, then refactor only with focused tests green.

| RED | Observable acceptance and evidence |
| --- | --- |
| NS-01 | Accessible name references visible unique IDs across instances and rerender; blank/whitespace label warns in development and renders no group/dot/cards; empty children retain named empty grid without placeholder. |
| NS-02 | Real direct NowCards retain supplied DOM order and explicit sm density, props and identity; null/boolean children have no placeholders, no cloning or injected content; long copy survives. |
| NS-03 | Decorative dot hidden from accessibility tree, static live state, no live region or root tab stop; Tab/Enter reach only supplied child actions, reduced motion remains static. |
| NS-04 | Real built CSS/browser proves one vs three tracks at 390, 859, 860, 861, 1280 and fractional boundaries; unequal copy stretches each row's direct cards equally, many cards wrap without clipping or reorder; separately apply gate 5 to footer alignment. |
| NS-05 | Real cards retain badge-first order, article names/headings, details and link/icon action behavior, native focus and activation; no changes to NowCard. |
| NS-06 | Real-browser computed checks for every §4 declaration, boundary recipe, host background and unaffected separate legacy fixture; compare adopted references only under equivalent conditions. |
| NS-07 | Public composition and dependency/static checks show no Pixel, meter or fabricated footer content; future amendment explicitly required. |
| NS-08 | Compatible native props forward; excluded attributes cannot override protected semantics even from untyped input; type checks reject them; supported className placement and actual cascade work without appearance override. |
| NS-09 | Six meaningful files, English metadata, real docgen/controls, production CSS scan and every candidate in §3; packed React 18/19 consumption without consumer Tailwind and browser Controls. |

PRESERVE: do not change NowCard, StatusDot, Link, IconButton, shared helpers or legacy. Run their focused existing tests alongside new tests when authorized, including prior NowCard regression. If shared code would need a change, stop for scope; any authorized shared-helper change requires preserve cases and differential public-interface checks for unrelated consumers. After integration inspect shared test structure against main, including column-0 statements, nesting and duplicate loops; green suites alone missed layer (c) damage.

## 6. Stories, docgen and package integration

Use `Organisms/NowStrip`, `Meta<typeof NowStrip>`, `StoryObj`, autodocs, English copy, no manual `argTypes`, `play` or adapter. `Default` supplies the required visible label and actual direct sm NowCards without invented component defaults. Add Empty, LongContent, UnevenCards/MultiRow, Responsive, MultipleInstances and Keyboard compositions; use real valid NowCardBody/NowCardFooter, meaningful badge and child links, never a meter. Show host-owned Grafito register without claiming it is part of NowStrip.

Document `label` with `@control text`; `children` with `@control false` and a concrete reason pointing to composition stories. Document own declarations/union branches, actual native surface and no fabricated defaults. Validate real `react-docgen-typescript` requiredness and types, AST coverage, installed extraction/enhancer/inference and zero owned diagnostics; then exercise actual Controls widgets in Chromium. Metadata or static HTML alone does not prove widgets.

After actual source review, parent appends `accessible-name` usage for `NowStripProps.label` with `source.path`, symbol and `revision: sha256:<actual whole-file bytes>`; never invent a source hash or promote entries automatically. When authorized regenerate the registry reference with `pnpm props:docs`, then `pnpm props:check` and `pnpm test:props`.

Parent integrates `packages/ui/src/index.ts`, production/story scans as needed, docgen/controls tests, `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs`. Assert named runtime/type exports, protected native-prop negative typing, SSR and React 18/19 packed consumers using tokens and shipped CSS **without a consumer Tailwind compiler**. Check actual emitted static classes and both exact candidates in §3, not just source strings. Preserve prior public exports and source scans.

## 7. Catalog, browser proof and work units

**Catalog — parent only:** after implementation and separate authorization, update only the NowStrip row in `scripts/catalog_data.py` to reflect delivered organism composition and the approved no-meter contract. Run `python3 scripts/build_catalog.py` once to generate `docs/CATALOGO.md` and `docs/catalog.json`; never hand-edit generated files or parallelize shared catalog writes.

**Chromium gate:** use real Chromium, packed shipped CSS, actual tokens and legacy bundle; record browser/version, viewport, DPR, theme, fonts, motion and measured values. At 390/859/860/861/1280 and fractional widths inspect grid tracks and per-row card rectangles; use uneven long localized and unbroken copy, multiple rows, optional badge/footer, no wrappers, resizing and zoom/reflow. Inspect actual body growth and footer edges for gate 5, along with NowCard root gap, alignment, min-height, footer margins and insets. Inspect every §4 computed property on new and legacy controls, bottom border, actual host register and contrast. Test decorative dot's accessibility-tree exclusion, static animation with and without reduced motion, keyboard Tab/Enter and visible child focus. Exercise Controls. Compare VIS-01/02 only under recorded conditions and separately approved adoption, recording omissions and differences. An accessibility tree is not a screen-reader session; report unperformed checks, including native zoom and contrast, honestly.

Future validation commands and broad suites require separate parent authorization. Run focused component and child tests first, then parent-authorized typecheck, lint, suite, build, package exports/consumption, registry and browser checks; report actual commands and outcomes, not predicted passes.

- **A — writer:** six NowStrip files and per-criterion RED/GREEN, after independent gates and scope authorization; no child or shared changes.
- **B — parent:** scanning, exports, metadata, package fixtures and reviewed registry usage, with production CSS and structural merge verification.
- **C — parent:** shared catalog row and one generation after delivery evidence.
- **D — parent:** real-browser, visual and accessibility evidence, including the blocking footer feasibility check, then separate delivery decision.

**Risks and stop line:** The proposed width utility, full production emission and shipped cascade are unverified; legacy collisions and NowCard's non-growing body may defeat footer alignment despite equal root heights. Consumers can supply invalid children or defeat stretch; host background affects contrast. Visual adoption, real browser, Controls, packed consumers, screen-reader and native zoom remain unverified here. Stop if any owner gate, footer proof, token, utility emission, cascade or contract assumption fails; seek a separate owner decision rather than alter NowCard, broaden v0.1, add a stylesheet or modify tokens/dependencies. This plan itself grants no implementation or delivery approval.
