# Panel — fill amendment

- **Version / status:** v0.5 — **Approved — 2026-11-19 by the owner (reply "Acepto todas").** The approval covers this spec only; it does not approve the implementation plan, visual references or the registry write. No code, token, dependency or GitHub change exists yet.
- **Approval / recovery:** canonical issues [#499](https://github.com/egdev6/egdev-design-system/issues/499) (request) and [#180](https://github.com/egdev6/egdev-design-system/issues/180) (Panel). This file is the recoverable snapshot; `approvalReference: odd/tasks/panel-tabs-fill-specs.md L2`.
- **Amends:** [Panel v0.2](../v0.2/spec.md), the [v0.3 band-heading amendment](../v0.3/band-heading-amendment.md) and the approved [v0.4 accent-edge amendment](../v0.4/accent-edge-amendment.md). Request: [#499](https://github.com/egdev6/egdev-design-system/issues/499) (Recado: a 440 × 640 WebView2 window whose footer action was cut off). [#180](https://github.com/egdev6/egdev-design-system/issues/180) remains Panel's canonical issue. Coordinated with the [Tabs v0.5 fill amendment](../../tabs/v0.5/fill-amendment.md) (#500).
- **Cataloging:** approved as a variant (Engram `catalog/499-500-panel-tabs-fill`): one opt-in boolean on the existing molecule. No new component, Radix primitive, package, token or dependency.
- **Snapshot identity:** `version: v0.5`; `contentSHA256: a7842866492a1553616c56a5bccc159ce726812a34a72b610d5b9888a7267a4b`; `visualHashes: VIS-01..02 Pending`; `approvalReference: odd/tasks/panel-tabs-fill-specs.md L2 (owner "Acepto todas", 2026-11-19)`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/180`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, LF line endings and the final newline. Metadata above that heading is excluded.
- **Current evidence:** `PanelProps` has `variant`, `tone` and `accentEdge` only (`packages/ui/src/molecules/panel/types.ts`); the root is already `flex flex-col overflow-visible`; the zones are `PanelHeader`, `PanelBody`, `PanelFooter` with `zoneGeometry` and no height or overflow rule; `PanelContext` carries only `tone` and `variant` (`usePanel.ts`). Today Recado works around it with `h-full` on `Panel` and `min-h-0 flex-1 overflow-y-auto` on `PanelBody` through `className`, which is unsupported and depends on utilities the shipped stylesheet may drop.

## 1. Purpose and scope

Let a Panel fill a host of definite height, keeping Header and Footer fixed while only Body scrolls.

**Changes to the approved contract (impact to review):**

| Approved promise | Change |
| --- | --- |
| v0.2 non-goals: "scrolling engine, fixed dimensions"; v0.2 "Consumer/host owns width, bounded scrolling" | **Amended for `fill` only.** The host still owns its definite height; Panel now owns the zone layout and Body's native overflow when `fill` is set. No scrolling engine: native overflow, no listeners, effects or timers. |
| `className` supports outer layout only | Unchanged. `fill` is the supported way to fill; the Recado `className` workaround is removed on adoption. |
| Default output | Unchanged when `fill` is omitted or `false`. |

**Non-goals:** sizing the host; scrollbar appearance (S2: native scrollbar only, no custom styling, no Radix ScrollArea); a `maxHeight` cap; horizontal scrolling; scroll-position state, sticky behavior or scroll shadows; any Header/Footer scrolling.

## 2. Anatomy and composition

Unchanged: root (Surface for framed tones, plain `div` for `inherit`), Header, Body, Footer and every `eg-panel*` marker. No new DOM node, role, ref or part. Panel parts read `fill` through the existing `PanelContext`.

## 3. Public API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `Panel.fill` | `boolean` | `false` | Opt in to filling the host's block size with fixed Header/Footer and a scrolling Body. Not forwarded to the DOM. Parts take no `fill` prop. |

Untyped values other than `true` normalize to `false` and are consumed. Existing props, `className` and part contracts are unchanged.

### Prop-naming registry lookup

Reviewed the [registry source](../../../../skills/_shared/prop-naming.json), the [generated view](../../../prop-naming.md) and the [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry) by meaning, name `fill` and aliases. No entry named or aliased `fill` exists. Not reused, because each differs in meaning:

- `tab-list-full-width` / `fullWidth`: inline-axis width of a segmented tab list; this change is block-axis host filling.
- `board-sticky-side` / `sticky`: sticky positioning of a board side column; fixed chrome here is flex layout, not positioning.
- `viewport-max-height` / `maxHeight`: a preset cap on a component's own viewport, with absence meaning no cap; `fill` has no cap and depends on a host height.
- `label-layout` / `layout` and `carousel-track-layout` / `trackLayout`: arrangement of label/control and a carousel track, not host filling.
- `filled-glyph` / `filled`: solid glyph rendering; the near-identical name must not be conflated.

**Approved new semantic ID (D-N):** `host-fill`, canonical prop `fill`, meaning "opt in to filling a definite-height host's block size, with fixed chrome and an internal native scrolling region; absence keeps content-sized height". Component types: `PanelProps.fill?: boolean` and `TabsProps.fill?: boolean`. No alias or exception. The owner approved the convention for Panel and Tabs; registry registration is a separate step and nothing is written to the registry here. Reviewed API source: `{ path: 'packages/ui/src/molecules/panel/types.ts', symbol: 'PanelProps', revision: 'sha256:c45b38f34521708baa0996044a57d81d172636bc2e7864115711bec43b386b91' }`, current API evidence only. Record the actual implemented whole-file hash at registration.

## 4. Behavior

Static CVA utilities, composed per part with `cn()`; Panel's hook adds `fill` to the context presentation.

| Part | Utilities with `fill` | Why |
| --- | --- | --- |
| Root | `h-full min-h-0` (keeps `flex flex-col`) | Fill the host; `min-h-0` lets the column shrink to it |
| `PanelHeader`, `PanelFooter` | `shrink-0` | Fixed chrome |
| `PanelBody` | `min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable] has-[>[data-fill]]:[scrollbar-gutter:auto] focus-visible:outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-focus-ring` | Takes the remaining height; native overflow; the gutter prevents content shift when the scrollbar appears, except when the Body's direct child is a fill Tabs (D-G); the inset ring is the D-P1 focus indicator |

No scrollbar styling and no other geometry change. The Body's CSS `overflow-x` computes to `auto` once `overflow-y` is not `visible`; existing `wrap-anywhere` keeps text from overflowing, and a non-wrapping wide child scrolls natively.

| Situation | Result |
| --- | --- |
| `fill` omitted or `false` | Output identical to v0.4 (no class change) |
| `fill`, host height definite, content fits | Body shorter than its zone, no scrollbar, gutter reserved only where classic scrollbars exist |
| `fill`, content overflows | Header and Footer stay visible; only Body scrolls |
| `fill`, host height not definite (`auto`) | Panel stays content-sized; Body never scrolls. Providing a definite height is the host's responsibility |
| Optional Header and/or Footer absent | Body fills the remainder; Body keeps its `first:`/`last:` corner radii |
| `accentEdge='start'` | The decoration is on the non-scrolling root and does not move |
| Default/banded, three tones | Paint owner, bands and corners unchanged |
| Nested fill Panel / fill Tabs in Body | See the shared scenario below |

### Shared scenario with Tabs (S3)

A `fill` Tabs placed as the **sole child** of a `fill` PanelBody produces no nested scrollbar. Body's flex-grown height is definite, so the Tabs root's `h-full` resolves to Body's content box (after `p-4`) and its `min-h-0` lets it shrink to it. The Tabs list is `shrink-0` and the active tab panel is the one `flex-1` scroller, so Body's content equals its box and Body does not overflow. Only the tab panel scrolls. With siblings next to the Tabs, or a Tabs without `fill`, Body overflows and scrolls natively as an outer scroller; that remains valid but is not the pair's promise. **D-G (no double gutter):** Body does not reserve a stable gutter when its direct child is a fill Tabs. The Tabs root carries `data-fill` in fill mode (see the [Tabs amendment](../../tabs/v0.5/fill-amendment.md#4-behavior)), and the Body recipe adds the static utility `has-[>[data-fill]]:[scrollbar-gutter:auto]`, which overrides the base stable gutter only for a direct child with that attribute. On classic scrollbars only the tab panel's gutter then shows. Body does not overflow in that case, so it never needs its own gutter; with siblings beside the Tabs the child is not the sole child but still matches `>[data-fill]`, and Body scrolls natively without a reserved gutter (accepted: the owner approved the rule on the direct-child match, not on sole-child).

## 5. Accessibility

- ARIA, roles and names are unchanged; `fill` adds no role, label or live region. Panel stays passive and never a landmark.
- **Keyboard scrolling:** child focus moves the focused control into view natively; Header/Footer actions stay reachable because they never scroll away. A Body without focusable children is a scroller keyboard users reach only if the browser makes scrollers focusable; see D-P1.
- Reduced motion: no animation or smooth scrolling is added. Forced colors and contrast are unchanged (no new paint).
- Focus rings of children inside Body are not clipped by the Body's inline edges beyond the existing `p-4` clearance; verify in the browser matrix.

## 6. Appearance

Layout only. No token, Material recipe, stylesheet or file role changes: types in `types.ts` (static CVA `fill` variants), `usePanel.ts` (normalization, context), `Panel.tsx` unchanged in structure, tests, stories, `index.ts`. **No stylesheet.** `scrollbar-gutter` uses a static arbitrary-property utility; if it cannot be expressed statically a new scoped decision is needed, not a dummy stylesheet.

| Visual ID | Scenario | Status |
| --- | --- | --- |
| VIS-01 | Fill Panel in a fixed 440 × 640 host, banded, overflowing Body, Footer action visible | Pending capture, hash and adoption |
| VIS-02 | Fill Tabs (outline) nested in a fill Body, only the tab panel scrolling | Pending capture, hash and adoption |

No capture exists or is claimed. Record viewport, DPR, browser/version, theme, fonts, motion/forced-colors, crop, date, tool and SHA-256 per the [capture guide](../../../design/README.md). Visual conformity: **Not evaluated**.

## 7. Acceptance criteria

All methods are planned; nothing ran.

| ID | Promise | Planned test | Planned browser check (fixed 440 × 640 host) | Observed |
| --- | --- | --- | --- | --- |
| AC-01 | Omitted/`false`/invalid `fill` yields the v0.4 class output for every tone, variant and edge | Class-equality tests against current output; untyped values; no `fill` attribute in the DOM | Default computed styles unchanged | Pending |
| AC-02 | `fill` gives root `h-full min-h-0`, Header/Footer `shrink-0`, Body `min-h-0 flex-1 overflow-y-auto` and stable gutter, via context | Per-part class tests; zones outside Panel still throw; production CSS emits the utilities | Header/Footer rects fixed, Body `scrollHeight` > `clientHeight`, Footer inside the host, window also at 440 × 520 | Pending |
| AC-03 | Content that fits shows no scrollbar and no content shift when it later overflows | Not applicable in jsdom (layout) | Compare Body content x before/after adding content, classic scrollbars | Pending |
| AC-04 | Missing Header/Footer, banded, three tones and `accentEdge` keep paint, corners and a stationary edge | Matrix tests | Edge fixed while Body scrolls; corners; VIS-01 | Pending |
| AC-05 | Keyboard focus into Body scrolls the control into view; Footer actions reachable; reduced motion respected; the scroller is keyboard-focusable per engine with a visible inset ring (D-P1 A) | Public focus/tab-order test where jsdom allows; class test for the inset ring | Tab through a long form, LTR/RTL, zoom, forced colors; per-engine scroller focus | Pending |
| AC-06 | A fill Tabs as sole Body child creates no nested scrollbar | Not applicable in jsdom | Body `scrollHeight === clientHeight`, one scroller (the tab panel); VIS-02 | Pending |
| AC-07 | `fill` is documented, typed and passes naming review; no token, dependency or stylesheet | Strict type tests, docgen/Controls, packaged consumers | Controls in Storybook | Pending |
| AC-08 | A fill Body whose direct child is a fill Tabs reserves no stable gutter; any other fill Body keeps `stable` | Class test: Body emits `has-[>[data-fill]]:[scrollbar-gutter:auto]` only in fill mode; production CSS emits the `:has(> [data-fill])` rule and a non-fill Body emits neither utility | Classic scrollbars (Windows/forced overlay off): nested Body computed `scrollbar-gutter` is `auto` and only one gutter shows; a Body with a plain child stays `stable`; `:has()` support noted per engine | Pending |

## 8. Compatibility

Default output is byte-identical (AC-01). `ModuleCard` does not consume `Panel` or `Tabs` (`packages/ui/src/molecules/module-card`, grep of in-repo imports) and is unaffected. Recado removes its `className` workaround on adoption.

## Owner decisions (resolved 2026-11-19)

Owner reply "Acepto todas" (2026-11-19, `odd/tasks/panel-tabs-fill-specs.md` L2) accepted every recommendation: D-P1 A (native keyboard-focusable scrollers with an inset focus ring, engine behavior verified in the matrix and returned to the owner with evidence if an engine lacks it), D-N A (approve `host-fill` / `fill` for Panel and Tabs), and D-G (a fill Body drops its stable gutter when its direct child is a fill Tabs, via `has-[>[data-fill]]:[scrollbar-gutter:auto]`). D-T1 A and D-T2 A are resolved in the Tabs amendment. Options below are kept as the record.. Registry registration of `host-fill` and any broader convention approval remain separate steps; no registry write is implied.

| ID | Decision | Options | Recommendation |
| --- | --- | --- | --- |
| D-P1 | `PanelBody` keyboard focus | **A** native: rely on browsers making scrollers keyboard-focusable; add an inset focus ring to the fill Body. **B** internal `tabIndex=0` plus a name: Panel owns no names and strips `tabIndex`, so it would invent a landmark or an unnamed tab stop. **C** `tabIndex=0` only, unnamed | **A.** B/C break the passive, no-tab-stop promise. Verify engine behavior in the matrix; if an engine lacks it, return to the owner with evidence |
| D-G | Gutter in the nested case | **A** drop Body's gutter via `has-[>[data-fill]]:[scrollbar-gutter:auto]` against a Tabs-root `data-fill`. **B** keep both gutters (double reserved space on classic scrollbars). **C** Tabs drops its own gutter (content shift when its bar appears) | **A** (approved) |
| D-N | Registry convention `host-fill` / `fill` shared by Panel and Tabs | **A** approve as proposed. **B** reuse an existing entry (rejected above). **C** per-component names (`fillHost`, `scrollBody`), which splits one concept | **A**; registry write and broader approval remain separate |
