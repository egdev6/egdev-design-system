# GaugeGroup — scoped Gauge-private-sharing amendment proposal

- **Status:** Draft implementation-permission amendment, not an unapproved GaugeGroup product contract. [Group v0.1 is already approved](contract-recovery.md). No source implementation or permission is claimed here.
- **Applies to:** existing Gauge effective v0.10 and approved GaugeGroup v0.1, canonical Group payload `9154316e52cbf60c52617e3a50a3cba4839c8dd938687547253b2d309107f416`.
- **Snapshot identity:** `contentSHA256: sha256:31d24a2a0808da1ee60c12dc9d63a4b3b5104269e6d1cef77e46f974a7f92864`; SHA-256 of UTF-8 bytes from `## 1. Exact permission requested` through EOF, LF including final LF. Tracking metadata above is excluded.
- **Approval reference:** Pending. Separate [implementation-plan](implementation-plan.md) approval is also required. No new runtime source hash/native receipt is invented.

## 1. Exact permission requested

Authorize only the following private refactor and Group-scoped CSS/recipe use after the separate plan is approved:

1. Add **one extra private atom module**, `packages/ui/src/atoms/gauge/gauge-model.ts`, holding exactly one pure measurement function plus the existing condition-glyph data table described below.
2. Make `packages/ui/src/atoms/gauge/useGauge.ts` delegate only its measurement calculations and glyph-table lookup to that module, preserving returned shape, public API, DOM, size policy, styles, IDs and semantic/native protection byte-for-byte in behavior. Do not add validation to Gauge.
3. Permit the Group hook to import that private module and the existing `gaugeArcVariants`, `gaugeCueVariants`, `gaugeIconVariants` from Gauge's `types.ts` through package-internal relative paths. Do not export any of them from Gauge/Group barrels or package root; do not relocate CVA to a helper module.
4. Permit **Group-specific** static transparent native diagram-frame CVA and per-available-arc inline normalized `--eg-gauge-value` (numeric 0–100 only), plus reuse of the unchanged existing conic/radial-mask stylesheet. This does not give Group a numeric size prop or expand Gauge's diameter exception.
5. Approve `packages/ui/src/molecules/gauge-group/gauge-group.css` solely for slot and shared-center alignment described below, and its parent-owned import into `packages/ui/src/styles/index.css` after existing Gauge geometry. No change to `gauge.css`, no copied gradient or opaque backing, no extra engine, new tokens/dependencies or global Material relaxation.

The approved Group snapshot names normalization extraction but leaves exact private architecture ungranted. Moving the existing glyph table alongside it is an explicit additional private-content request in this amendment, not silently assumed consent. It avoids duplicating state glyph strings or inventing a new runtime icon API. Declining that addition leaves glyph-sharing unresolved; do not copy the table elsewhere as a workaround.

## 2. Exact private-module boundary

### `normalizeGaugeMeasurement`

Proposed internal signature: `normalizeGaugeMeasurement(input: {value: number; valueText?: string; stateText?: string}): GaugeMeasurementModel`. Internal `GaugeMeasurementModel` is `{available: boolean; normalized: number | undefined; valueText: string | undefined; showCue: boolean}`. Types and function are private source exports only, never package API.

Extract exactly these existing expressions from `useGauge`:

- `available = Number.isFinite(value)`.
- `normalized = available ? Math.min(100, Math.max(0, value)) : undefined`.
- Resolved valueText equals `available ? (valueText ?? normalized + ' / 100') : undefined`, preserving the existing template-string formatting, decimal/signed-zero behavior and nullish fallback. Do not round, localize or convert unavailable to zero.
- `showCue = available && Boolean(stateText)`.

No React/useId, JSX, CVA, state machine, size handling, native-attribute sanitization, center handling or structural/string validation in this function. In particular Gauge currently treats empty valueText as supplied and whitespace stateText as truthy; this refactor must preserve that behavior. Group validates its stricter approved string/tuple rules **before** calling the helper. The public TypeScript number contract remains; do not introduce new runtime exceptions for legacy Gauge JavaScript callers.

### `gaugeConditionIconPaths`

Move the existing `iconPaths` data table verbatim from useGauge, renamed privately to `gaugeConditionIconPaths: Readonly<Record<GaugeState, string>>`; use a type-only GaugeState import from types.ts. No runtime import cycle, geometry rewrite, Icon component replacement or new glyph. Keep all four original path strings, including warning/critical/muted circles and optional normal check; existing Gauge SVG 24×24 viewBox/stroke width 2 remains unchanged. Group cue JSX consumes the same data for its visible text/icon association. No function or module beyond these two private exports is requested.

### Why an extra module, not a seventh fake role

Both hooks require identical measurement normalization and cue geometry, but importing `useGauge` merely to throw away its size/native-root model would couple Group rows to atom IDs/DOM and hide reuse rather than share the actual concern. A pure, tested private data-model port is the named approved-contract prerequisite. Keeping CVA/public props in types.ts, hook orchestration in useGauge/useGaugeGroup and JSX in component files preserves the six mandatory roles. Do not create another helper/engine folder, state context or hidden React component. Helper tests live in existing `Gauge.test.tsx` and new `GaugeGroup.test.tsx`; no additional test/module filename is needed.

## 3. Shared geometry and Group-only recipe

**Atom files intentionally unchanged:** `Gauge.tsx`, `types.ts`, `gauge.css`, `Gauge.stories.tsx`, `index.ts`. In particular retain single-Gauge 40/56/80 presets, 3/4/6px strokes, numeric diameter/14, 30% center inset, transparent wrapper, track alpha and +0.5px inner-edge mask smoothing. Existing APIs, stable `eg-gauge`, private marker isolation and eight stories remain the regression baseline. No public Group feature is added to Gauge.

**Group composition:** one decorative relative diagram frame (56/80/96px), static common stroke space-1. For every finite tuple entry, render an internal absolutely positioned **slot wrapper**, containing an unchanged `.eg-gauge-arc` child. Radial slot inset belongs to that wrapper, not an override of `.eg-gauge-arc {inset:0}`. The existing arc then fills its containing slot normally, preserving mask construction. Missing readings render no wrapper/arc/track; remaining wrappers retain index-derived insets, never nth-of-type compression.

Group types.ts CVA supplies static inset custom-property values: slot 0 space-0, slot 1 `calc(var(--space-1) + var(--space-1))`, slot 2 twice that sum. Diagram diameter uses space-14/20/24, stroke is space-1 and gap is space-1 at every preset. Only the normalized value is dynamic inline; no inline diameter, inset, color, font or Material values. Data-state on arc/row drives existing token-fill data variants directly.

Exactly two private geometry selectors in `@layer components` are proposed for `gauge-group.css`:

- `.eg-gauge-group-slot`: absolute positioning and `inset: var(--eg-gauge-group-slot-inset)`; supplied statically by slot-index CVA.
- `.eg-gauge-group-center`: absolute positioning, `inset: var(--eg-gauge-group-center-inset)`, grid centering. Count-dependent static CVA sets two-ring inset space-3 (12px), three-ring inset space-5 (20px), equal to last slot inset + stroke. This realizes the approved innermost hole, not a changed Gauge 30% center.

All other layout/typography/frame/condition/size utilities remain in Group types.ts and cn-composed in its hook; no BEM paint engine. Group frame uses border-box, padding zero, solid zero border, full token radius, transparent background, no image/shadow and existing foreground; no Surface class/import or conceptual flat-card shortcut. Track blends with actual host; no cross-host pixel equality is promised. No motion anywhere. Static frames/insets require build emission and actual computed/browser verification later, not trust in class strings.

## 4. Gauge regressions that must remain unchanged

| Existing coverage / promise | Required retained evidence after refactor |
| --- | --- |
| `owns a transparent native geometry frame without Surface identity` | Same root/frame/arc/center hosts and markers, zero border/padding, no background/image/shadow/Surface; no Group geometry selectors in Gauge tree |
| `normalizes %s to %s` | -1/0/42.5/100/101 clamp consistently across ARIA, default text and numeric property; add direct-helper alternate decimals/negative zero cases without changing policy |
| `derives defaults and supports only outer layout merging` | md, normal, absent center/cue; mt-4 wins recognized margin conflict; internal classes isolated |
| `selects the %s preset`; `preserves positive numeric diameter %s`; `falls back independently for diameter %s` | 40/56/80 and 3/4/6px; 0.5/64/64.5/1000 uncapped; 0/-1/NaN/±Infinity size→md; no measurement clamp applied to diameter |
| `renders readable unavailable data for %s`; decimal/recovery test | NaN/±Infinity: label/fallback, no meter/aria-values/frame/arc/center/cue; custom wording, finite→unavailable→finite removes stale geometry |
| `connects visible %s cues with unique descriptions` | All four consumer states independent of value; original path strings, per-instance useId and deduplicated external descriptions; muted not disabled |
| `keeps center decorative` | Existing zero, short string and SVG cases; absent/null/boolean suppression unchanged; no duplicate accessible name |
| hostile native-spread/passivity test and public type test | Same protected semantics and forwarded compatible attrs; no focus/actions/live/progressbar, no public ref/asChild/events/children; non-normal stateText type requirement unchanged |
| Preview/distributed/packed CSS and eight stories | Same conic/mask/stroke/30% center/+0.5px smoothing, token fills/alpha/frame; Default, ValueLimits, DecimalValue, States, CenterContent, ContextualValue, InvalidValue, Sizes remain unchanged |

Add helper-specific tests in Gauge.test.tsx for cue truthiness/nullish text fallback so Group-only validation cannot leak into Gauge. Existing tests are read evidence, not newly executed passes. Require API/type AST comparison and source hashes before/after; Gauge types.ts should remain byte-identical, so do not refresh its registry evidence unnecessarily.

## 5. Changed-promise decision ledger

No changed product/API promise is needed by the recommended plan. The following tempting alternatives are explicitly **not** authorized by Group v0.1 or this request: composing resized public Gauge roots, adding stroke/inset/hidden-cue/row props, using Gauge's custom-size stroke or 30% center for Group, SVG/canvas replacement, duplicate conic/mask recipe, opaque well/backing, positional colors, aggregate center/severity, disappearing unavailable slots, validation that now throws for Gauge, or broadening GaugeDock children.

If inspection/build/capture shows the selected geometry cannot preserve endpoints, smoothing, minimum hole/center fit or transparent host exposure, report the exact discrepancy for a new owner decision. Do not alter the frozen Group contract or single-Gauge promises to make implementation pass. Numeric center content that does not fit the 16px sm three-ring hole must be shortened by the consumer or omitted; do not introduce a scaling/truncation API silently.

**Approval sought:** the exact private module/function/table extraction, cross-folder private imports, Group-scoped transparent/numeric-value recipe and two-selector geometry stylesheet/import above. This does not itself approve execution; the separate plan and runtime edit authorization remain required.
