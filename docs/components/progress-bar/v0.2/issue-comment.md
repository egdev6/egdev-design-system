# ProgressBar — v0.2 snapshot comment for issue #65 (prepared, not posted)

**Readiness: Draft — not ready for implementation.** v0.2 changes no API and no approved promise: it concludes that the cataloged "0–1 progress" delta is a caller-side `×100` conversion over the already-approved percent `value` (v0.1 D2), with the 0–1 scale surviving as the private `--eg-progress-value` custom property. Q1 (accept the documentation-only outcome) is the only open choice; Q2–Q4 ask for a confirmation each. Posting this comment authorizes no code, plan, token, dependency or catalog change.

## Snapshot identity

- `version: 0.2`
- `contentSHA256: 52f2b10a9532cdfa4326e00d2248bc278d3a7b9ca9f4e08512f42857903d3441` (SHA-256 of the canonical payload from `## 1. Purpose and scope` through EOF, LF line endings, final newline; reproduced verbatim in the last section, tracking metadata excluded)
- `visualHashes: VIS-01 52f2b10a9532cdfa4326e00d2248bc278d3a7b9ca9f4e08512f42857903d3441 (reused approved reference); VIS-02 52f2b10a9532cdfa4326e00d2248bc278d3a7b9ca9f4e08512f42857903d3441 (reused approved reference); VIS-03 52f2b10a9532cdfa4326e00d2248bc278d3a7b9ca9f4e08512f42857903d3441; VIS-04 52f2b10a9532cdfa4326e00d2248bc278d3a7b9ca9f4e08512f42857903d3441; VIS-05 52f2b10a9532cdfa4326e00d2248bc278d3a7b9ca9f4e08512f42857903d3441; VIS-06 52f2b10a9532cdfa4326e00d2248bc278d3a7b9ca9f4e08512f42857903d3441`
- `approvalReference: Pending (Draft v0.2)`
- `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/65`
- `latestPublishedComment: Pending (this snapshot is prepared, not posted)`
- Previous snapshots: the initial v0.1 issue body and its [owner full-contract approval](https://github.com/egdev6/egdev-design-system/issues/65#issuecomment-6251455009). This comment is the next version of the same issue; it does not edit the body and does not open a new issue.
- Spec copy in this repository: `docs/components/progress-bar/v0.2/spec.md` (tracking metadata above its `## 1. Purpose and scope` heading is excluded from the digest above).

## Reason and compatibility impact

- **Reason:** the approved web catalog review (`docs/components/web-catalog/v0.1/cataloging-draft.md` §3, owner approvals 2026-11-02, tracking `odd/tasks/web-catalog.md` B7) opened one ProgressBar row: "API deltas (… 0–1 progress); likely documentation, not new props — to confirm per spec". The evidence gathered for v0.2 confirms it. The web component writes a 0–1 fraction into `style="--p:…"`, but the same Foundation preview emits `aria-valuemin="0" aria-valuemax="100" aria-valuenow="10"` for `--p: 0.1`, and the approved v0.1 decision D2 already fixed the public scale at 0–100 with no `max` prop. The design system therefore keeps percent in the prop and the 0–1 fraction in the private `--eg-progress-value`, which is exactly where the web keeps `--p`. `edge` (sm only), the decorative/announced split and the transition tokens already match the three rendered web cases.
- **Compatibility:** none. No prop, type, default, variant, export, public marker or class changes; the six approved registry usages keep their recorded bytes, so no `pnpm props:docs`/`props:check` refresh is required. Consumers convert at the boundary (`value={p * 100}`) and keep their own scroll/active-index arithmetic.

## Visual references and asset status

Local captures for this version live in `docs/components/progress-bar/v0.2/` (`capture.json` holds selectors, source fragments, conditions, measured styles and per-file SHA-256). Image references stay as repository paths in this prepared comment; they become immutable commit URLs only after the parent merges and pins them.

- VIS-01 — reused `docs/design/foundation-boards/v2026-10-17/ProgressBar.png`, approved expected design for the hairline track values and the edge strip.
- VIS-02 — reused `docs/design/foundation-boards/v2026-10-17/specimens/progress-bar--specimen.png`, approved expected-design specimen.
- VIS-03 — `docs/components/progress-bar/v0.2/public--tips-slider-progress--1280x900--dark.png` (decorative tips strip, third of ten active, padded crop of the 320×2 track).
- VIS-04 — `docs/components/progress-bar/v0.2/public--tips-slider-controls--1280x900--dark.png` (the "03 / 10" text counter that lets the strip stay decorative; byte-identical to the IconButton v0.3 capture of the same deterministic region, stated rather than implied).
- VIS-05 — `docs/components/progress-bar/v0.2/public--dock-edge-progress--1280x900--dark.png` (edge strip pinned to the floating section dock at about half the document scroll).
- VIS-06 — `docs/components/progress-bar/v0.2/foundation-preview--variants--720x480--dark.png` (Foundation preview board: `--p` 0.1/0.45/1 with percent ARIA, `--edge` at 0.62, interactive 0.3).

**Image handoff: Pending and blocked.** Local PNGs are not GitHub-visible. The owner must choose either human attachment (upload the exact PNGs and return their URLs) or a bounded, separately authorized asset-publication branch, and the published bytes must be compared against the hashes above before any image is linked here. No URL is invented and no commit, push or upload is implied.

## What approval of this comment would mean

Adopting v0.2 as the ProgressBar web-mapping amendment: the cataloged 0–1 delta is confirmed as a caller conversion over the approved percent `value`, with `edge`, the decorative split and the transition tokens already covering the rendered web cases — no API change. It would also adopt or decline VIS-03 to VIS-06 as supporting evidence. It would not approve an implementation plan, a fraction or `max` prop, tokens, dependencies or any catalog row change. Answers needed: Q1 (accept the documentation-only outcome), Q2 (public scale), Q3 (the TipsSlider formula disagreement between the web README and the rendered page), Q4 (the edge container requirement) — each with a recommendation at the end of the snapshot.

---

## Full snapshot (canonical payload, SHA-256 `52f2b10a9532cdfa4326e00d2248bc278d3a7b9ca9f4e08512f42857903d3441`)

## 1. Purpose and scope

**Delta against approved v0.1.** v0.1 ships one passive atom in `@egdev/ui` (`packages/ui/src/atoms/progress-bar/`): a Radix Progress track with `value: number` in **percent** (finite values clamped to 0–100, non-finite mapped to indeterminate), optional `label` deciding between an announced and a decorative bar, optional `valueText`, `size` `sm`/`lg`, `variant` `default`/`muted` and `edge` (only with `size="sm"`); the fill is a static `scale-x-[var(--eg-progress-value)]` driven by one inline custom property. Its decisions D1–D10 are unchanged by this version.

- **Need / non-goals:** the need is a **confirmation plus a written conversion**, not a new promise. The web component exposes `value` as a fraction written into `style="--p:…"`; the design system exposes a percentage. Both render the same `scaleX` geometry, and the Foundation preview's own ARIA already speaks percent. v0.2 records the mapping at the boundary (`0.4 → 40`), the exact expression of the three rendered web cases, and the remaining differences. Non-goals: a `value={0..1}` prop, a `max` prop or a unit/scale selector (D2: "no `max` prop"), a second scale convention, `--p` as a public custom property, an `lg` edge variant (D7 keeps `edge` sm-only), a redesign of the `muted` comparison series, a new story that only renames existing arguments, a stylesheet, and any token or dependency change.
- **Cataloging decision / alternatives:** **reuse without change**, the first step of `docs/CATALOGACION.md`, after inspecting the public React API (not CSS, catalog rows or stories). *Variant* is rejected: a `scale="fraction"` variant would make `value={1}` ambiguous (1% or 100%), fork the accessible value computation and duplicate the clamp — for a conversion the caller performs with one multiplication. *Compose* is rejected: a wrapper dividing by 100 would be a second public entry point for the same bar and would still emit percent ARIA. *Extract* and *new* are irrelevant: nothing is hidden and no second responsibility appears. The step that actually existed was documentation.
- **Evidence / level and package:** atom in `@egdev/ui`, folder `packages/ui/src/atoms/progress-bar/`. Inspected as whole files in this working tree (2026-11-02): `types.ts` (whole-file `sha256:24333aa44912ecce88ce5e0bf27f04ccf838a6ee0c1b723b01574cbbf4c67a6b`), `useProgressBar.ts` (`edf088799a30e1bb1da0f7ac9c011d4f6e1c4db46e1befcbba1b90ac2c996ec5`), `ProgressBar.tsx`, `ProgressBar.test.tsx`, `ProgressBar.stories.tsx`, `index.ts`; `docs/components/progress-bar/v0.1/implementation.md` (shipped behaviour, marker and acceptance evidence); issue #65 body (v0.1 decisions D1–D10 and the owner approval comment). Read-only web evidence (owner-granted; nothing written there): `reference-web/pulso-source.html` (`sha256:778e5412b64d1b79195c51c0e47c78f654b46da445be8354a97e572774348f13`), `design-system/components/ProgressBar/README.md` (`f9bc9007c54c82cf1e04888522669ec7bd05211ef472f0ec1330b0aa57295934`), `design-system/components/ProgressBar/preview.html` (`9182f8a4f000662138f53407c4345340b2f7d0cbfb8221c0fb7566defbd7e04e`), `design-system/components/SectionNav/README.md` (`7f0332f489afcda0e69556d18124582a77bfb40ad028058e3e07e04ffc9ca6e5`), `design-system/components/TipsSlider/README.md` (`eb09ef4261e4743ada5219c56863ee848c925c66323076ccc309a4835bfc8a4f`), `design-system/tokens.css` (`1c92acb850695d6093e7e3eb988d66152ffd7bb1592dba744f8433d9051da30e`), `design-system/components/bundle.css` (`04797068bfc9de49a02b8fbdb54c12e336f19dae04a1616ce23fd8bf8c2d70fe`).

**What the web exposes, and where each input lands.**

| Web input (`components/index.d.ts`, README) | Design-system equivalent (shipped) | Status |
| --- | --- | --- |
| `value: number` "Entre 0 y 1; se escribe en `style="--p:…"`" | `value: number` in percent, clamped 0–100 | **Same geometry, different public scale.** The caller converts at the boundary: `value={p * 100}`. v0.1 D2 chose percent because the Foundation preview itself emits `aria-valuemax="100"` / `aria-valuenow="10"` for `--p: 0.1`, and Radix computes the announced value in percent. Documented here, no API change. |
| `--p` (public custom property) | private `--eg-progress-value` (`value / 100`, unitless 0–1) | The 0–1 scale still exists, exactly as documented, but it is an internal rendering detail: consumers do not write it. |
| `edge: boolean` (`--edge`) | `edge?: boolean`, only with `size="sm"` | Same placement, closed by type (D7); the container must be positioned and clip overflow. |
| `label: string` → `role="progressbar"` + `aria-valuenow` | `label?: string` → `aria-label`; absent/blank → decorative, `aria-hidden="true"` | Same rule (D4). The web's counter-as-text case ("03 / 10") is exactly the decorative condition (VIS-04). |
| — | `valueText`, `size` `lg`, `variant` `muted` | Design-system additions: `lg` (10px Material well) and `muted` (comparison series) come from other products, not from this page. |

**Rendered web cases and their design-system expression.**

| Rendered case (capture) | Web expression | Design-system expression |
| --- | --- | --- |
| Tips slider strip, third of ten tips active (VIS-03) | `--p`-style fill: `width:10%` + `translateX(200%)` → 20% of a 320px track, `aria-hidden` | `<ProgressBar value={20} className="w-80" />` with no `label`: same 2px hairline, same neon fill, same decorative posture, width from the consumer |
| Tips slider controls, text counter (VIS-04) | `03 / 10` in `aria-live="polite"` | The consumer renders the counter; the bar stays unnamed and hidden, which is the `label`-omitted rule |
| Floating section dock, about half the document scrolled (VIS-05) | `--edge` strip, `scaleX(0.5)` on `scrollY / maxScroll` | `<ProgressBar size="sm" edge value={50} />` inside a positioned, overflow-clipping pill |
| Foundation preview values (VIS-06) | `--p` 0.1 / 0.45 / 1 with `aria-valuenow` 10 / 45 / 100, plus `--edge` at `--p: .62` and an interactive `--p: .3` | `value={10}` / `{45}` / `{100}`, `edge` with `{62}`, `{30}` — identical ARIA, identical fill fractions |

## 2. Anatomy and composition

Anatomy is unchanged from v0.1. The table restates it so the mapping above can be read against a concrete structure.

| Part | Responsibility | Native element / Radix primitive | Allowed content | Web counterpart |
| --- | --- | --- | --- | --- |
| Root (track) | Semantics, track, size, placement | `ProgressPrimitive.Root` (`div`, `role="progressbar"`) | Fill only; no children API | `.eg-progress` (`span`) with `--p` and, when labelled, `role="progressbar"` + `aria-value*` |
| Fill | Normalised progress | `ProgressPrimitive.Indicator` (`div`) | None | `.eg-progress__bar` (`span`) with `scaleX(var(--p))` |

- **Radix / composition:** `import * as ProgressPrimitive from '@radix-ui/react-progress'` (installed, 1.2.1). Root receives the clamped `value` (or `null` when non-finite), `max={100}` and `getValueLabel` from `valueText`. No `asChild`, no ref API, no public subcomponents. The web's plain `span` pair is source evidence, not a composition to preserve.
- **Public markers:** root `eg-progress` (existing Foundation marker, preserved); internal fill marker `eg-progress-fill`; the component never emits the legacy `__bar`, `--edge`, `--lg` or `--muted` classes.

## 3. Public API

**No prop, type, default or export change is proposed in v0.2.** The table restates the shipped v0.1 surface so this amendment is self-contained.

- **Prop conventions:** registry source `skills/_shared/prop-naming.json`, generated view `docs/prop-naming.md`, consulted by meaning, name and aliases. Six approved conventions already carry a `ProgressBarProps` usage whose recorded `source.revision` was re-verified byte-for-byte against this working tree on 2026-11-02 (`packages/ui/src/atoms/progress-bar/types.ts`, `sha256:24333aa44912ecce88ce5e0bf27f04ccf838a6ee0c1b723b01574cbbf4c67a6b`): `primary-value` (`value`), `accessible-name` (`label`), `measurement-text-equivalent` (`valueText`), `preset-dimensions` (`size`), `visual-treatment` (`variant`) and `container-edge-placement` (`edge`, first usage recorded for this component). No usage is stale, so no registry revision or generated-view refresh is required by this version.

| Prop / event | Type | Required | Default or rule | Description (unchanged v0.1) |
| --- | --- | --- | --- | --- |
| `value` | `number` | Yes | None; finite values clamp to 0–100, non-finite is indeterminate | Progress **in percent**. The web's fraction converts at the boundary. `@control number` |
| `label` | `string` | No | Absent, empty or whitespace-only ⇒ decorative, `aria-hidden="true"` | Accessible name; never rendered visibly. `@control text` |
| `valueText` | `string` | No | Absent ⇒ Radix `"<n>%"` | Announced as `aria-valuetext`. `@control text` |
| `size` | `'sm' \| 'lg'` | No | `sm` | `sm` = 2px hairline; `lg` = 10px goal bar in a Material well. `@control select` |
| `variant` | `'default' \| 'muted'` | No | `default` | `muted` paints a comparison series in `fg-muted`. `@control select` |
| `edge` | `boolean` | No | `false`; only with `size="sm"` | Pins the bar to the bottom edge of the nearest positioned, overflow-clipping ancestor, full width, no radius. `@control boolean` |
| Native props / `className` | `ProgressBarNativeProps` | No | Forwarded to the Radix root | `id`, `data-*`, compatible native attributes; Radix-owned `role`/`aria-value*`/naming are discarded; `className` merges last on the root only |

```ts
export type ProgressBarSize = 'sm' | 'lg';
export type ProgressBarVariant = 'default' | 'muted';

export type ProgressBarProps = ProgressBarNativeProps &
  ({ size?: 'sm'; edge?: boolean } | { size: 'lg'; edge?: false }) & {
    value: number;
    label?: string;
    valueText?: string;
    variant?: ProgressBarVariant;
  };
```

- **New convention proposals:** none. The 0–1 vs percent question is the *type* of the already-approved `primary-value` convention for this component, not a new semantic: percent is the recorded, approved choice (D2), and the fraction survives only as the private custom property.
- **Exceptions:** none new. `container-edge-placement` keeps its approved entry and its single sm-only usage.
- **Native props / refs:** `ComponentPropsWithoutRef<'div'>` minus `children`, the Radix-owned value/role attributes and the naming attributes that `label` owns; no ref, no `asChild`.
- **Controlled / uncontrolled:** Not applicable — passive display, `value` is always caller-controlled; there is no internal state, no auto-advance and no animation beyond the value transition.
- **Compatibility:** no public export, marker, class, default or behavioural promise changes; `ProgressBar`, `ProgressBarProps`, `ProgressBarSize`, `ProgressBarVariant`, `progressBarVariants` stay the public surface and the fill recipe stays private. No registry byte moves.

## 4. Behavior

Behaviour is unchanged from v0.1. The rows below restate the observable results and add the web-facing conversions.

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| `value={20}` (a `0.2` fraction converted) | Fill scaled to 0.2; `aria-valuenow="20"`; `data-state="loading"` | None |
| `value={100}` | Full fill; `data-state="complete"` | None |
| `value={140}` / `value={-5}` | Clamped to 100 / 0 | None |
| `value={NaN}` / `±Infinity` | No `aria-valuenow`/`aria-valuetext`, `data-state="indeterminate"`, empty fill | None |
| `value` changes | Fill transitions with `--duration-base` / `--ease-out`; instant under reduced motion | None |
| No `label` (the tips strip and dock cases) | `aria-hidden="true"` on the root; the consumer exposes the position as text | None |
| `edge` with `size="sm"` inside a positioned overlay | Bar pinned to the bottom edge, full width, no radius, glass track | None |
| `edge` with `size="lg"` | Not expressible in the type; untyped callers get the non-edge track | None |

- **States / representation:** Radix `data-state` (`loading` · `complete` · `indeterminate`) with `data-value`/`data-max`; styled through Radix state, never mirrored classes. `size`, `variant` and `edge` are visual variants, not states.
- **Limits / consumer responsibilities:** the caller converts its own scale (fraction ×100), supplies the width and the positioned, overflow-clipping container for `edge`, renders any visible counter or percentage as text, and decides whether the bar is announced (`label`) or decorative. The component does not read scroll, carousels or timers: the web's `scrollY / maxScroll` and active-index computations stay in the host. Nothing here promises cross-browser transition timing.

## 5. Accessibility

Unchanged from v0.1; this version records the two web cases that exercise the decorative rule.

- **Accessible name / roles / relationships:** `label` present ⇒ `role="progressbar"` with `aria-label`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-valuenow`, optional `aria-valuetext` (Radix supplies them). `label` absent, empty or whitespace-only ⇒ `aria-hidden="true"` and no `aria-label`, and the consumer must expose the progress as text — the tips strip (VIS-03) alongside the "03 / 10" counter (VIS-04) is exactly that case.
- **Keyboard / focus:** Not applicable — non-focusable, no interaction, no tab stop (asserted by the shipped "is never focusable" case). The web's interactive range input in the Foundation preview is documentation of the `--p` range, not a component affordance.
- **Announcements / other conditions:** no live announcements; progressbar value changes are read on demand. Colour is never the only cue: the bar length is the cue, and a `muted` series must be named in surrounding text.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| `size` | `sm` (2px), `lg` (10px well) | `sm` | `lg` never with `edge` (D7) |
| `variant` | `default`, `muted` | `default` | `muted` on either size |
| `edge` | `true`, `false` | `false` | Only `sm`; requires a positioned, overflow-clipping ancestor |
| State | `loading`, `complete`, `indeterminate` | Radix `data-state` | Indeterminate has no fill and no transition |

- **Tokens / Material:** token-backed CVA in `types.ts`, composed through `cn()` in `useProgressBar.ts`; nothing handwritten. `sm` track `h-0.5 rounded-[var(--radius-sm)] bg-border-subtle`; `lg` track `h-2.5 rounded-full bg-surface-0 shadow-well`; `edge` track `bg-bg-glass` with no radius; `default` fill `bg-fg-brand-default` (`sm`) or `bg-[image:var(--gradient-progress)]` with `shadow-edge-strong` (`lg`); `muted` fill `bg-fg-muted`; fill transition `duration-[var(--duration-base)] ease-[var(--ease-out)]` with `motion-reduce:transition-none`. The web's handwritten `--lg` halo stays replaced by the token bevel (D6). No token value changes here and none is proposed.
- **Dynamic geometry:** the approved ProgressBar-scoped exception (D8) and nothing more: the static `scale-x-[var(--eg-progress-value)]` utility plus the single inline custom property `--eg-progress-value: value / 100`. No interpolated class strings, no other inline style, and the property is not a public API — the web's `--p` is not re-exported.
- **Class composition / consumer layout:** `className` merges last through `cn()` on the root only (width, margin, positioning when not `edge`); `eg-progress` is never dropped. `twMerge` resolves recognised conflicts only, so a consumer utility that collides with a preset recipe remains a documented limitation, not an appearance-override API.
- **Files / pending proposals:** the six mandatory files keep their roles — `types.ts` (props/types, public track recipe and private fill recipe), `useProgressBar.ts` (clamp, indeterminate mapping, naming, forbidden-prop guard, composition), `ProgressBar.tsx` (JSX), `ProgressBar.test.tsx`, `ProgressBar.stories.tsx`, `index.ts`. **No stylesheet**; no internal module; no dependency. Planned, separately approvable documentation-only work if Q1 is accepted: state in the `Values`/`Default` story copy that `value` is a percentage and that a 0–1 source is multiplied by 100, and add one `edge` example with the `relative overflow-hidden` container the rule requires if the owner wants it shown. No new component story is required. No catalog row change for a reuse conclusion.

### Visual delta (observed, measured)

| Property | Web `.eg-progress` (VIS-03/VIS-05/VIS-06) | Foundation preview | DS `sm` | Delta / decision |
| --- | --- | --- | --- | --- |
| Public scale | fraction `0–1` in `--p` | `--p` 0.1/0.45/1 with `aria-valuenow` 10/45/100 | percent `0–100` | **Caller conversion** (`×100`); the fraction survives as the private custom property |
| Track height | 2px | 2px | `h-0.5` (2px) | None |
| Track radius | 2px (edge 0) | 2px (edge 0) | `--radius-sm` = 3.2px (token, recorded 80% scale of the source 4px); edge `rounded-none` | Token scale: 3.2px over a 2px-tall track reads the same; no handwritten pixel value |
| Track paint | `--color-border-subtle`; edge `--color-bg-glass` | same | `bg-border-subtle`; `edge` `bg-bg-glass` | None |
| Fill paint | `--color-fg-brand-default` | same | `bg-fg-brand-default` (`sm`), gradient + `shadow-edge-strong` bevel (`lg`) | `lg` is a DS addition from another product |
| Fill geometry | `scaleX(var(--p))` with `transform-origin: left` | same | `scale-x-[var(--eg-progress-value)]` with `origin-left` | None |
| Measured fill | 32px of 320 (tips, `activeIndex 2 / 10`), 76px of 153 (dock, scroll 0.5) | 24/240, 108/240, 240/240, 160/258 | 20 / 76 / 10 / 45 / 100 percent respectively | Arithmetic matches; only the boundary unit differs |
| Transition | `duration-base` + `ease-out`, none under reduced motion | same | same, with `motion-reduce:transition-none` | None |
| ARIA | none when decorative; `progressbar` + percent values when labelled | `role="progressbar"`, `aria-valuemin/max/now`, `aria-label="Progreso"` | Radix supplies the same percent values | None |
| Decorative | `aria-hidden="true"` beside a text counter | `aria-hidden="true"` on the edge and interactive samples | `label` omitted ⇒ `aria-hidden="true"` | Same rule, encoded once |
| Edge placement | `absolute; left/right/bottom: 0`, no radius, glass track | same | `edge` with `size="sm"` | Same, closed by type |

**One source inconsistency, reported and not adopted.** The live page computes the tips strip as `translateX(activeIndex * 100%)` on a 10%-wide fill — 20% at the third of ten tips, 0% at the first, 90% at the last (VIS-03 measured `transform: matrix(1,0,0,1,64,0)` on a 32px fill inside a 320px track). The Foundation `TipsSlider` README documents the same bar as `--p = (activa + 1) / total`, which would be 30%/100% instead. The two web sources disagree; the design system owns neither formula and simply takes the value the host passes. Q3 records the recommendation. The design system's own 0–100 clamp means either formula is expressible.

### Expected-design visual reference

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | [`docs/design/foundation-boards/v2026-10-17/ProgressBar.png`](../../../design/foundation-boards/v2026-10-17/ProgressBar.png) — "The approved ProgressBar board: the 2px hairline track with the neon fill at several values and the edge strip inside a container" | Board rows: values, edge | Foundation `components/ProgressBar/preview.html`, board set v2026-10-17; **reused historical capture** | Approved as v0.1 expected design (owner full-contract approval in #65); reused unchanged in v0.2 and not a fresh capture |
| VIS-02 | [`docs/design/foundation-boards/v2026-10-17/specimens/progress-bar--specimen.png`](../../../design/foundation-boards/v2026-10-17/specimens/progress-bar--specimen.png) — "The ProgressBar specimen sheet with the hairline track, sizes and edge placement" | Specimen sheet | Foundation `components/ProgressBar/specimens`, board set v2026-10-17; **reused historical capture** | Approved in the same record; reused unchanged |
| VIS-03 | `public--tips-slider-progress--1280x900--dark.png` — "A 368 by 48 pixel crop centred on the tips carousel progress strip: a 320px two-pixel track with a short neon-red fill a fifth of the way in, matching the third of ten tips being active." | Rendered `.tips-prog` strip, decorative, centred at 320px | `reference-web/pulso-source.html` `778e5412…`, capture v0.2-capture-1 | Proposed; source evidence of the fraction-driven decorative bar |
| VIS-04 | `public--tips-slider-controls--1280x900--dark.png` — "The tips carousel controls: a live counter reading 03 / 10, previous and next rounded-square icon buttons and the 'Más en LinkedIn' text link." | Rendered `.tips-ctrl` with the text counter | `reference-web/pulso-source.html` `778e5412…`, capture v0.2-capture-1 | Proposed; evidence of the text alternative that lets the bar stay decorative. The same zone was captured byte-identically for IconButton v0.3 (VIS-06); this file is a separate fresh capture of the same deterministic region |
| VIS-05 | `public--dock-edge-progress--1280x900--dark.png` — "The floating section dock at mid-page scroll: a rounded pill with the section number 06 and the name Lab, a next-section arrow, and a two-pixel neon strip pinned flush to its bottom edge, filled about halfway." | Rendered `.fab-btn` with the `--edge` strip at ~50% scroll | `reference-web/pulso-source.html` `778e5412…`, capture v0.2-capture-1 | Proposed; evidence of the edge placement and the scroll fraction |
| VIS-06 | `foundation-preview--variants--720x480--dark.png` — "The Foundation ProgressBar preview board: three 240px tracks filled at 0.1, 0.45 and 1 with the value written under each, an edge strip inside a rounded container filled at 0.62, and an interactive track at 0.3 driven by a range input." | Foundation preview: values, `--edge`, interactive | `design-system/components/ProgressBar/preview.html` `9182f8a4…`, capture v0.2-capture-1 | Proposed supporting reference; it shows the ARIA percent values beside the 0–1 custom property |

- **Conditions / provenance per VIS ID:** all new captures: playwright-core 1.60.0 driving Chromium 153.0.8010.12 (`chrome-headless-shell`) headless on Linux x86_64, `file://` loading, color scheme dark, `reducedMotion: no-preference`, device scale factor 1, `--force-color-profile=srgb`, `--hide-scrollbars`, taken 2026-11-02. VIS-03/VIS-04/VIS-05: viewport 1280×900; Barlow 600/700, Barlow Condensed 800 and JetBrains Mono 500 confirmed loaded; all `[data-reveal]` nodes forced to their revealed state plus 900 ms. VIS-03 is a 368×48 padded clip of a 320×2 strip (element crop would be two pixels tall); VIS-04 is the element crop of `.tips-ctrl` (309×40); VIS-05 is the element crop of `.fab-btn` (155×52) taken after scrolling to about half of the document scroll range, where the strip is `scaleX(0.5)`. VIS-06: viewport 720×480 in the read-only `/tmp/egdev-sbcheck/b7/progress-bar-preview.html` harness that mounts the preview fragment, its inline style block and its range-input script unmodified and links `tokens.css` and `bundle.css` by `file://`; `document.fonts.check('600 12px "Barlow Condensed"')` was true while `document.fonts.check('600 13px Barlow')` was false, so the small `.meta` captions may use a fallback weight (the bars themselves are CSS, unaffected). VIS-01/VIS-02 keep their original 2026-10-17 conditions. Per-image hashes, selectors, source fragments and observed computed styles live in [`capture.json`](./capture.json).
- **Intent / acceptance / pending evidence:** preserve the 2px hairline track, the left-origin scale geometry, the neon fill, the token radius and paint, the decorative posture beside a text counter, and the flush edge strip with a glass track. Related criteria: AC-02 to AC-07. Visual conformity is **Not evaluated** until the owner adopts a snapshot; these captures are source evidence and never replace behaviour or accessibility checks, and no token value is inferred from their pixels.

## 7. Acceptance criteria

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | The public surface is unchanged: `ProgressBar`, `ProgressBarProps`, `ProgressBarSize`, `ProgressBarVariant`, `progressBarVariants`; no `max`, `scale` or `--p` prop is added | existing `ProgressBar.test.tsx` type-negative matrix plus the `packages/ui/src/index.ts` export check | Not applicable | Pending |
| AC-02 | A converted 0–1 source renders the expected fraction: `value={20}` → fill `--eg-progress-value: 0.2`, `aria-valuenow="20"`, `data-state="loading"` | existing value/ARIA and custom-property cases plus one planned conversion case in `ProgressBar.test.tsx` | Values | Pending |
| AC-03 | `value={140}` → 100 and `value={-5}` → 0 still clamp after conversion, and non-finite stays indeterminate with an empty fill | existing clamp and indeterminate cases | Values, Indeterminate | Pending |
| AC-04 | Omitting `label` keeps the bar decorative (`aria-hidden="true"`, no `aria-label`) and the consumer's counter carries the position | existing decorative case | Decorative | Pending |
| AC-05 | `size="sm" edge` inside a positioned, overflow-clipping container renders the flush strip with no radius and the glass track; `edge` with `lg` stays rejected | existing edge cases (unit and type-level) | Edge | Pending |
| AC-06 | The fill still transitions with the motion tokens and drops the transition under reduced motion | existing transition case | ValueTransition | Pending |
| AC-07 | Documentation only: the story copy states that `value` is a percentage and that a 0–1 source is multiplied by 100, with no `@control` diagnostics | metadata/docgen test plus the existing controls suite | Default, Values | Pending |
| AC-08 | Registry stays green with no new entries, usages or exceptions | `pnpm props:check`, `pnpm test:props` | Not applicable | Pending |

### Spec closure

- [x] All seven blocks are complete or justified as Not applicable (keyboard/focus and announcements: not applicable).
- [x] New/changed own props: none. Registry lookup recorded with the six exact applied entry IDs, no new proposals and no new exceptions, and the recorded source revision matches the reviewed file bytes.
- [x] Proposals, verified implementation and planned checks are distinct; every promise has an acceptance ID and a planned method, and nothing is claimed as observed implementation.
- [x] Visual IDs identify real provenance, conditions and related criteria; reused approved references are labelled as historical, and the identical-bytes case is stated instead of implied.
- [ ] Snapshot identity is recoverable and the owner approval identifies this exact version, content digest, visual hashes and scope — **Pending**; the status stays Draft until then.
- [x] One canonical issue is retained (#65); v0.2 is prepared as a versioned comment over the v0.1 body plus its approval comment, never a body edit or a new issue.

### Open questions for owner approval

- **Q1 — Accept the documentation-only outcome (recommended).** The cataloged "0–1 progress" delta is a caller-side `×100` conversion; the 0–1 scale is still there as the private `--eg-progress-value`, and percent is the approved public scale (D2) with the Foundation preview's own `aria-valuenow` as evidence. *Recommendation:* accept that ProgressBar needs no API change, and keep this version as the recoverable record of the conversion table, the visual delta and the responsibility split.
- **Q2 — Public scale (recommended: keep percent).** *Recommendation:* keep `value` in percent and document the boundary conversion. A fraction prop would make `value={1}` ambiguous, duplicate the clamp and disagree with the ARIA scale that Radix already announces; the web's own preview writes percent into `aria-valuenow`, so the fraction is only its CSS variable. If a future product asks for a fraction API, that is a new contract version with a migration note, not a silent redefinition.
- **Q3 — TipsSlider formula disagreement between web sources (recommended: report, don't encode).** The live page renders `activeIndex / total` (20% at the third of ten); the Foundation README documents `(activa + 1) / total` (30%). *Recommendation:* the design system does not choose a formula — the host passes `value`. Report the mismatch to the web so its README and its page agree, and prefer `activeIndex / total` if the intent is "position through the list", because that is what the rendered page shows and what the user sees.
- **Q4 — Edge container requirement (recommended: keep it documented, not typed).** `edge` needs a positioned, overflow-clipping ancestor (D7) and the web's dock pill provides it. *Recommendation:* keep the requirement as documentation plus the required `size="sm"` type constraint, and show one example container if the owner wants it. Typing the container would require a wrapper component and a ref, which the atom deliberately does not expose.

**Next step:** the owner answers Q1 (with Q2–Q4 as its detail) and approves this exact version; only then may a documentation-only implementation plan be proposed with its own approval. This spec authorizes no code, token, dependency or catalog change, and no external write.
