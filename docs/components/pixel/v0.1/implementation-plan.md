# Pixel v0.1 — implementation plan

- **Status:** Proposed for separate owner approval. This document implements nothing and authorizes no source, tests, registry, catalog, tokens, dependencies, Git or remote action.
- **Coverage:** DP5, **S3**, a Pixel-only plan within [web catalog work](../../../../odd/tasks/web-catalog.md), not completion of S3 or the other DP5 plans.
- **Approved contract:** [Pixel v0.1](spec.md), issue [#300 approval comment 6597831855](https://github.com/egdev6/egdev-design-system/issues/300#issuecomment-6597831855), owner answer “Aprobar con las recomendaciones (Recomendado)”. Canonical payload SHA-256 `9d2c435e3648f428b6b58dc216fbc86c690ee43c0e00232cd077b1b7db2bb490`, UTF-8 from the exact heading line `## 1. Purpose and scope` through EOF, including final LF. Proposed/Pending metadata in the frozen spec is historical; do not rewrite it.
- **Plan identity:** The parent hashes the **entire final plan file**, including final newline, and records the owner's separate decision and exact whole-file SHA-256, as in [layer (d) approvals](../../web-catalog/v0.1/layer-d-plan-approvals.md). No self-hash; any later byte change needs a new approval.
- **Visual references:** VIS-01 `164187ecd80434b8e824153f62b3055b55255292d8c2a7bbeedb84dffd7957d4`; VIS-02 `2348a1ddb51ce598249e9088ac0a040343bf3b1c52724096937ba750a504c72c`. Compare under [recorded conditions](capture.json), accounting for scaled dimensions and no glow. Capture adoption is not established by the contract answer; request it separately. Visual conformity: **Not evaluated**.

## 1. Independent owner gates

Plan approval, future edit authorization and these gates are distinct; record each answer before implementing affected work.

1. **Exact geometry:** recommend Pixel-only static `[clip-path:polygon(0_0,100%_33.8%,100%_100%,0_66.2%)]`, the Foundation polygon, with existing `w-2 h-3` at ×0.8. Approve this exact utility and require production emission and Chromium proof. The parent's successful 33%/67% probe is not proof of these exact decimal coordinates. No inline geometry, token or stylesheet is implied.
2. **Idle opacity:** recommend Pixel-only `bg-fg-default/18` as a bounded exception for the existing foreground token at 18% on transparent, not general permission for authored color mixes. Require actual emission and computed color. Past and active use existing deep and brand tokens; active has no glow.
3. **Naming:** recommend the exact widening of `consumer-selected-condition` in §4, retaining `state` and the ID, with separate `convention:consumer-selected-condition` approval bound to the changed content. No automatic promotion, duplicate convention or broad migration follows.
4. **Legacy neutralization:** recommend the local inventory in §5, conditional on production cascade and real Chromium computed-style checks for all states and an unchanged legacy control. No legacy edit or `!important`; stop for an independently approved solution if local utilities cannot win.
5. **Visual adoption:** recommend adopting VIS-01/02 for surviving shape/state intent only, explicitly recognizing 6.4×9.6 rather than 8×12 CSS px and no active glow. Adoption does not prove browser, accessibility or contrast results.

## 2. Contract and future surfaces

One empty `span.eg-pixel` is always `aria-hidden="true"`. Optional `state: 'idle' | 'past' | 'active'` defaults to `idle` and becomes the matching `data-state`; rerenders update immediately. Consumer selects the represented position; no internal state, meter, collection, sequence, navigation, timer, accessible text or interaction. The host supplies meaningful visible text and, for navigation, `aria-current` on the actual link; a meter's name and value belong to the host. No Radix, Surface, SVG, glow, animation, transition, callback, ref, `asChild`, size prop or children. Invalid runtime state behavior is unspecified; do not invent a public fallback.

Inherit compatible `ComponentPropsWithoutRef<'span'>` with the spec's exclusions: `children`, `dangerouslySetInnerHTML`, `role`, `aria-hidden`, `aria-label`, `aria-labelledby`, `data-state`, `tabIndex` and `contentEditable`. Discard conflicting inputs even from untyped callers, and never forward event handlers that turn the decoration into a control; forward nonconflicting native data/attributes. `className` supports root outer placement only, not geometry, size, paint, filter or state overrides. `cn()`/`twMerge` do not promise arbitrary CSS precedence. Do not add restrictions or behavior beyond the approved contract.

After separate gates and scoped authorization, create exactly six meaningful files under `packages/ui/src/atoms/pixel/`:

| File | Responsibility |
| --- | --- |
| `types.ts` | Public types, English JSDoc, static token-backed CVA state recipes. |
| `usePixel.ts` | Derive state and protected attributes, compose root CVA and `cn()`; no internal state. |
| `Pixel.tsx` | JSX-only empty span consuming the hook. |
| `Pixel.test.tsx` | Public behavior and hook tests, criterion-level RED/GREEN. |
| `Pixel.stories.tsx` | English autodocs and host-composition examples. |
| `index.ts` | Named component and public types; variant export only if separately approved. |

**No stylesheet**, conditional on emission and legacy proof. No extra module or invented CSS role. Parent owns shared scans, exports, metadata, registry and catalog; no changes to legacy, other components, tokens or dependencies are implied.

## 3. Static utility inventory and emission evidence

Candidate base: `inline-block flex-none w-2 h-3 [clip-path:polygon(0_0,100%_33.8%,100%_100%,0_66.2%)] filter-none transition-none`. CVA chooses exactly one state fill: idle `bg-fg-default/18`, past `bg-bg-deep`, active `bg-fg-brand-default`. State selection is a CVA choice, not mirrored `.is-*` classes; `data-state` is the semantic marker. Prove token mappings, all base declarations and `flex: none` in emitted CSS and computed styles; do not rely on class presence or `cn()` ordering.

**Complete Pixel-owned arbitrary/variant utility inventory for parent proof:**

- `[clip-path:polygon(0_0,100%_33.8%,100%_100%,0_66.2%)]` — exact decimal Foundation geometry, including emitted spaces and percentage values.
- `bg-fg-default/18` — exact token-backed opacity modifier and emitted declaration.

No responsive, `data-*`, motion, selector or other variant utility is proposed; no dynamic class interpolation. Audit the final CVA and expand this list for owner review before approval if any other arbitrary or variant utility becomes necessary. Parent reports that installed Tailwind 4.3.3, in a probe mirroring production scanning, emitted `[clip-path:polygon(0_0,100%_33%,100%_100%,0_67%)]` and `bg-fg-default/18`; `md:` emitted nothing ([ODD L31](../../../../odd/tasks/web-catalog.md), [approval record](../../web-catalog/v0.1/layer-d-plan-approvals.md)). That evidence is not this exact decimal utility, actual Pixel scanning, cascade or browser proof. Parent must prove both inventory entries and their declarations before approval and again in the eventual production build. Do not use `md:` or silently round the polygon.

## 4. Exact naming proposal

Current `skills/_shared/prop-naming.json` entry `consumer-selected-condition` is approved for Gauge/GaugeGroup measurement conditions. Propose replacing only these semantic fields with the following exact strings, preserving ID, `name: "state"`, aliases, exceptions and existing usages:

```json
{
  "meaning": "The consumer-selected interpretation of a measurement or position marker; values and domain are component-specific, independent of automatic thresholds.",
  "whenToUse": "A component exposes a consumer-selected measurement condition or a position marker's condition, such as idle, past or active.",
  "avoid": "Visual variants, material tone, loading behavior, automatic threshold inference or deriving a collection's progress."
}
```

This is a proposed change to the existing convention, not a new entry. Its old approval hash cannot authorize changed content. Separately approve the exact widened convention, obtain a recoverable owner receipt and a fresh canonical convention hash with scope `convention:consumer-selected-condition`; do not fabricate either. If unresolved, do not materialize the changed entry or claim Pixel's usage is approved. After authorized implementation, parent reviews `PixelProps` in `packages/ui/src/atoms/pixel/types.ts` and records the actual whole-file SHA-256 as the usage source revision, then uses `pnpm props:docs`, `pnpm props:check`, and `pnpm test:props` when authorized. Existing usages remain unchanged; this is not authorization to migrate any API.

## 5. Legacy collision and computed-style inventory

`packages/ui/src/styles/index.css` imports legacy in `@layer components` before utilities; verify actual packed CSS layer order, not class order. Preserve `packages/ui/src/styles/legacy/bundle.css:182–190` and all legacy consumers. New markup never emits `.is-past` or `.is-active`.

| Legacy declaration / selector | Pixel target and real-browser proof |
| --- | --- |
| `.eg-pixel`: `display:inline-block; flex:none` | Explicitly match both; inspect display and flex grow/shrink/basis, including a flex host. |
| `.eg-pixel`: `width:8px; height:12px` | Override with `w-2 h-3`; with the actual ×0.8 theme measure 6.4×9.6 CSS px, including bounding rect and computed width/height. Test flex shrink and no unexpected box sizing/padding/border. |
| `.eg-pixel`: decimal clip-path polygon | Set the exact utility in §3; inspect computed `clip-path` and rendered shape for every state. |
| `.eg-pixel`: 18% foreground `background` shorthand | Explicit state background color, verify computed background color, image and other shorthand effects for idle, past and active. Compare to computed token values, not screenshots alone. |
| `.eg-pixel`: background-color/filter transition; reduced-motion transition reset | Explicit `transition-none`; inspect transition properties/duration and actual state change with normal and reduced motion. |
| `.eg-pixel.is-past` / `.eg-pixel.is-active` | No legacy modifier classes on new markup; explicitly select past/active fills. The active rule also supplies `drop-shadow`; `filter-none` must compute to none in every state. Inspect filters, shadow, transitions and pseudo-elements. |

Test new states alongside untouched legacy idle, `.is-past` and `.is-active` controls against their baseline, including reduced motion, to ensure no global migration. Check host selectors and actual CSS layering; if unsupported caller classes or unlayered host CSS win, document the host limitation rather than promise universal precedence. If a required reset fails, stop for owner-approved scope; do not edit legacy or invent a stylesheet.

## 6. Test-first execution and preservation

These are future checks, not observed results. Add public-interface tests for each criterion first and record intended RED before implementation. For browser-only CSS, establish a failing built-CSS/browser assertion or record why a meaningful RED is unavailable; jsdom cannot prove geometry or paint. Implement minimally, run focused GREEN, then refactor only while green.

| Criterion | Required observable checks |
| --- | --- |
| PX-01 | Empty hidden span, stable marker, default idle and each exact state/data attribute on rerender; no legacy state classes. |
| PX-02 | Type tests and untyped runtime/SSR inputs cannot introduce excluded semantics, content, focus or control handlers; compatible native data/attributes pass. |
| PX-03 | Host-owned text/current or labelled meter example remains meaningful; Chromium accessibility tree excludes markers and Tab skips them. Pixel itself implements neither sequence nor meter. |
| PX-04 | Actual compiled CSS and packed-consumer Chromium verify exact polygon and token sizes for each state with legacy loaded, plus reference comparison with approved differences. |
| PX-05 | Computed three state colors match actual token values including idle alpha, no active filter/glow, immediate changes in normal and reduced motion. |
| PX-06 | Supported outer placement merges, marker persists, legacy inventory and unaffected legacy controls pass computed checks. Do not snapshot full class strings. |
| PX-07 | Six files, English metadata and select widget, real production static scan/emission and packed React 18/19 consumers without consumer Tailwind. |

PRESERVE: do not edit existing atoms, shared helpers or legacy. Run relevant existing package/export and style regressions when authorized; preserve each existing behavior actually touched by shared integration. If shared helper changes become necessary, stop for scope; authorized shared changes need differential public-interface checks for unrelated consumers. After integration compare column-0 statements in shared tests/exports against main and inspect nesting, deletions and duplicate loops: layer (c) passed suites despite structural merge damage.

## 7. Stories, metadata and package integration

Use `Atoms/Pixel`, `Meta<typeof Pixel>`, `StoryObj`, autodocs and English text, without manual `argTypes`, `play` or renderer adapter. `Default` leaves the actual idle default untouched; add `AllStates`, `WithText` and host-owned navigation/current and labelled-meter composition examples. Examples may compose several Pixels externally but never export a Pixel sequence or meter. Document `state` with `@control select` and bare `@default idle`; do not redeclare native props for Controls. Check real react-docgen-typescript extracted enum/default and native restrictions, AST coverage, installed extraction/enhancer/inference and zero owned diagnostics, then actual Chromium Controls. Metadata alone is not widget evidence.

Parent integrates the named runtime/type exports in `packages/ui/src/index.ts`, adds the Pixel `types.ts` scan to `packages/ui/src/styles/compiled.css` (atom sources are individually enumerated), and checks `.storybook/preview.css` for story-only scanning. Update applicable docgen/controls and `scripts/package-exports.test.mjs` / `scripts/package-consumption.test.mjs` fixtures after authorization. Verify SSR, protected-prop negative types, existing exports, static emitted CSS and packed React 18 and 19 consumers importing tokens and shipped UI CSS with **no consumer Tailwind compiler**. Record actual build and test results; scans and class strings alone are insufficient.

## 8. Parent catalog and Chromium evidence

**Catalog is parent-only:** after implementation evidence and separate authorization, update the existing Pixel row in `scripts/catalog_data.py` to reflect the delivered approved atom and resolved geometry, then run `python3 scripts/build_catalog.py` to regenerate `docs/CATALOGO.md` and `docs/catalog.json`; never hand-edit generated artifacts or parallelize shared writes.

In real Chromium load packed styles, tokens and legacy CSS; record browser/version, viewport, DPR, theme and media settings. For all three states measure computed clip-path, width/height and rect, flex behavior, background color/alpha against resolved tokens, filter, shadow and transition. Verify ×0.8 sizes without flex shrink at desktop and narrow viewports; compare VIS-01/02 under equivalent conditions only after adoption and record intentional differences. Rerender through states with normal and reduced motion. Exercise forced colors if supported: observe whether the decorative mark remains visible or is overridden, ensure host meaning is independent of color, and report unsupported emulation; do not invent a forced-color API. Check accessibility tree, Tab order and actual Controls. Accessibility-tree inspection is not a screen-reader session; report unperformed checks and visual conformity honestly.

Future focused tests precede parent-authorized broader typecheck, lint, suite, build, package, registry and browser checks. Record exact commands and observed results; this plan claims none.

## 9. Work units, risks and stop line

- **A — writer:** six atom files and criterion-level RED/GREEN after all relevant owner gates and scoped authorization.
- **B — parent:** source scans, exports, docgen, package fixtures and separately approved registry receipt/usage; inspect shared merge structure and production CSS.
- **C — parent:** catalog row and one generator run after delivery evidence.
- **D — parent:** real Chromium legacy, geometry, color, motion, accessibility, Controls and visual checks; separate delivery decision.

**Risks:** Exact decimal polygon emission and production scan remain unverified despite the parent's rounded probe; utility layers, background shorthand and host selectors may defeat intended paint; fractional CSS pixels and browser color serialization require measured comparisons. Forced-color visibility and host semantics need real evidence. Naming widening, capture adoption, browser/packed consumers, screen-reader checks and visual conformity remain unverified. Stop if any independent gate, token mapping, compiler emission, cascade or approved contract assumption fails; seek owner resolution rather than silently round geometry, add glow, modify legacy/tokens, invent CSS or widen v0.1. This proposed plan is not implementation approval.
