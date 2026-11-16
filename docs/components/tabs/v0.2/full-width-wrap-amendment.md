# Tabs — full-width and label-wrap amendment

- **Status:** Approved — 2026-11-16 (owner, in session; proposal egdev-ds-nexo-adoption-v1). Implementation plan requires separate approval.
- **Amends:** [Tabs v0.1 implementation evidence](../v0.1/implementation.md) and its [approved base contract](https://github.com/egdev6/egdev-design-system/issues/107#issuecomment-6251573119); requested by [#414](https://github.com/egdev6/egdev-design-system/issues/414). This amendment proposes only additive, opt-in layout; it is not implementation authorization.
- **Snapshot identity:** `version: v0.2`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 Pending, VIS-02 Pending`; `approvalReference: owner session 2026-11-16; proposal egdev-ds-nexo-adoption-v1`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/107`; `latestPublishedComment: Pending`. #414 tracks this request, not a new canonical component contract.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, LF line endings and the final newline; tracking metadata above it is excluded. Finalize the digest before publication. The spec is approved without captures; visual hashes remain pending.

## 1. Purpose and scope

- **Need:** independently stretch segmented tabs to available width and allow long labels to wrap and align to the start, without internal selectors. Selected-state contrast is separate ([#404](https://github.com/egdev6/egdev-design-system/issues/404)).
- **Cataloging proposal:** extend the existing `@egdev/ui` molecule, not a new navigation widget. Reuse alone permits root placement but not internal list/trigger styling; consumer composition cannot access those parts through the public API. Extraction/new components are unnecessary for the same selection responsibility. Spec approval does not authorize implementation.
- **Evidence:** `packages/ui/src/index.ts`, `molecules/tabs/{index.ts,types.ts,useTabs.ts,Tabs.tsx,Tabs.test.tsx,Tabs.stories.tsx}` and the v0.1 evidence were inspected. Current segmented lists are intrinsic-width, start-aligned Surface wells; trigger labels use `whitespace-nowrap`. Underline uses horizontal scrolling. No new behavior is claimed delivered.

## 2. Anatomy and composition

| Part | Existing responsibility / primitive | Amendment |
| --- | --- | --- |
| Root | Radix Tabs Root, `div`; native outer-layout attributes | Unchanged |
| List | Named Radix Tabs List; segmented Surface well | Opt-in width and overflow policy |
| Trigger / counter | Radix Trigger button with text and optional owned counter | Opt-in equal distribution and label reflow; counter stays present |
| Panel | Radix Content, one per item | Unchanged |

Radix `@radix-ui/react-tabs` continues to own selection, focus and relationships; no new `asChild` or public part API. Preserve `eg-tabs`; v0.1 intentionally emits no `eg-tabs__*` parts or mirrored state classes. No marker or legacy consumer migration is proposed.

## 3. Public API

| Proposed prop | Type | Required | Default | Rule |
| --- | --- | --- | --- | --- |
| `fullWidth` | `boolean` | No | `false` | For segmented lists, fill the root's available inline width and distribute triggers equally. No effect on underline. |
| `labelWrap` | `boolean` | No | `false` | For segmented triggers, wrap text as needed and align it to logical start; false retains existing no-wrap presentation. No effect on underline. |

The two options are independent and may be combined. Both are layout proposals, not state or selection inputs. Existing `variant: 'underline' | 'segmented'` defaults to `underline`; `size: 'md' | 'sm'` defaults to `md` and still has no effect on segmented geometry. Existing item, value, callback and native APIs remain unchanged.

**Prop conventions:** inspected the [registry source](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md) by meaning, name and aliases. The owner approved `tab-list-full-width` → `fullWidth: boolean` for Tabs and a shared `labelWrap: boolean` convention for Tabs and Button (owner session 2026-11-16, proposal egdev-ds-nexo-adoption-v1); Tabs also aligns wrapped labels to logical start. The drafts used different candidate IDs for the shared convention (`tab-label-wrap` and `button-label-wrapping`); its single registry ID remains to be resolved. `top-bar-content-width` concerns a constrained content row, not equal trigger distribution; `section-content-wrap` / `wrap` explicitly excludes flex wrapping. Registry entries and usages are added in each implementation PR, not here. Reviewed existing usage context: `source: { path: 'packages/ui/src/molecules/tabs/types.ts', symbol: 'TabsProps', revision: 'sha256:f495fce0b20fb63177cda01fa64b84bea5e6d65ec2976f3bf4801e7e9aa22615' }`; this symbol does **not** yet contain the new props.

Native div props forward to Radix Root with v0.1 omissions; `className` is root outer margin, width and grid placement only. No ref, children or `asChild` API. `value`, `defaultValue` and `onValueChange` retain controlled/uncontrolled semantics, including the first-enabled fallback and Radix's existing request behavior. Public exports and supported React peer claims are unchanged; compatibility requires the planned consumer checks, not a type-only inference.

## 4. Behavior

| Initial state / action | Proposed observable result | Event |
| --- | --- | --- |
| Both props absent or false | Existing underline and segmented layout is unchanged. | None |
| Segmented + `fullWidth` | The list viewport fills its root; each trigger has equal width and its normal centered content. | None |
| Segmented + `labelWrap` | Labels may occupy multiple lines, align to logical start, and remain readable, including long unbroken text. A trigger can grow vertically rather than clip its content. | None |
| Both true | Equal-width triggers with start-aligned wrapping labels; selection and counters are retained. | None |
| Insufficient available width | Keep the horizontal tab order and expose horizontal scrolling when readable triggers cannot fit; a focused trigger and its focus indicator remain visible. No hidden/clipped inaccessible tab. | None from reflow |
| Underline + either prop | Both additions have no layout effect; preserve underline scrolling and size. | None |

Selection, `data-state`, disabled skipping and panel mount/unmount remain Radix-owned. Consumers still provide unique, non-empty item values and at least one enabled item, keep panel state externally if needed, and choose an appropriate host width; no new invalid-input policy is introduced.

## 5. Accessibility

Keep the consumer's `label` as tablist name, Radix tab/panel IDs and relationships, selected state and count in the accessible tab name. Horizontal automatic activation, roving focus, ArrowLeft/ArrowRight, Home/End, disabled skipping and normal Tab exit remain Radix behavior, including across overflow and wrapped lines; wrapping does not introduce vertical navigation or a second tablist. Maintain a visible token-backed focus treatment, including scrolled and forced-color contexts. The existing compact segmented targets remain a consumer touch-size consideration; this proposal does not silently change their minimum size. No extra announcements are proposed because reflow changes neither selection nor meaning.

## 6. Appearance

| Axis | Values / default | Restrictions |
| --- | --- | --- |
| `fullWidth` | `false` / `true`, default `false` | Segmented only; equal widths; content centered unless `labelWrap` is true |
| `labelWrap` | `false` / `true`, default `false` | Segmented only; logical start; label and count remain readable |

Reuse the existing `surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' })` on the list and the approved active-segment sheen/surface-3/shadow and focus recipes; no new Material paint. Layout uses static token-backed CVA utilities in `types.ts` and per-part `cn()`; do not add hardcoded appearance, inline geometry, tokens or dependencies. Existing root `className` remains last-merged for supported outer layout only; `cn`/`twMerge` is not a general appearance or cascade guarantee. Parts do not gain consumer override props.

**Files:** retain the six existing meaningful files (`types.ts`, `useTabs.ts`, `Tabs.tsx`, test, stories and `index.ts`) in their established roles. **No stylesheet.** No additional internal module. Preserve legacy CSS and public markers.

### Expected-design visual reference

| Visual ID | Image / scenario | Source and conditions | Status |
| --- | --- | --- | --- |
| VIS-01 | Pending: full-width segmented list with centered short labels | Source, viewport, scale, browser, theme, fonts, preferences, crop and provenance pending | Pending owner reference and approval |
| VIS-02 | Pending: narrow segmented list with wrapping long labels and visible focus | Same conditions and provenance pending; also verify overflow and logical direction | Pending owner reference and approval |

No new captures are authorized in this batch. The spec is approved without captures; each Tabs implementation PR must provide stories and a real capture before merge. The historical v0.1 `docs/design/foundation-boards/v2026-10-18/Tabs.png` (SHA-256 `5c99ce8a8ba13d955327a9826f4765d824a65bca3262b3f0d450dcff73bb418a`, per v0.1 evidence) is not evidence for these new layouts. Intended review covers well/active/focus treatments, tokens, spacing, readable labels and overflow; visual conformity is **Not evaluated** until comparable captures and scoped owner approval exist. Do not infer token values from pixels.

## 7. Acceptance criteria

All checks below are planned, not observed for v0.2; stories do not replace tests.

| ID | Observable promise | Planned check / story | Evidence |
| --- | --- | --- | --- |
| AC-01 | Omitted/false props preserve v0.1 defaults, public root/exports and both variants, including `size`. | `Tabs.test.tsx`: default and explicit false, underline/segmented; packed consumer export/type/CSS check. | Pending |
| AC-02 | Segmented `fullWidth` fills the host and each trigger is equal; without wrapping, content stays centered. | `Tabs.test.tsx` API and browser computed-box checks at wide/narrow hosts; full-width story / VIS-01. | Pending |
| AC-03 | `labelWrap` works independently and with `fullWidth`; long and unbroken labels/counters remain readable and start-aligned without clipping. | DOM cases for all four combinations; browser narrow-width and RTL layout/focus checks; wrapping story / VIS-02. | Pending |
| AC-04 | Overflow remains reachable; reflow emits no selection change; the focused tab stays visible. | Browser keyboard/scroll test across boundaries and resize in LTR/RTL, including forced colors. | Pending |
| AC-05 | Controlled/uncontrolled selection, disabled skipping, Arrow/Home/End/Tab, accessible names, counts and panel relationships persist. | Role-based `Tabs.test.tsx` interaction/relationship tests for both opt-ins. | Pending |
| AC-06 | Underline ignores both additions; existing Surface well, active and focus recipes remain; no arbitrary part override is required. | `Tabs.test.tsx`, production CSS scan and browser computed-focus/reduced-motion check; existing/default and opt-in stories. | Pending |
| AC-07 | Public API documents accurate prop names, defaults and controls without a new dependency. | Type/docgen/Storybook Controls and package-consumer checks; inspect CSS bundle without a consumer Tailwind compiler. | Pending |

### Resolved decisions

- “Aprobar las cuatro” — `fullWidth` for Tabs and the shared Tabs/Button `labelWrap` convention are approved.
- “Sí, validación visual en cada PR” — the spec is approved without captures; the Tabs implementation PR must provide stories and a real capture before merge.

### Remaining open decisions

- Confirm segmented-only/no-op underline scope, logical-start alignment, the four combinations and the equal-width-plus-scroll overflow policy, including extremely narrow hosts.
- Resolve the shared `labelWrap` registry ID in the implementation PR.
- Provide an authorized expected-design source, capture conditions and separately scoped visual approval for the two scenarios. Visual conformity remains pending; #404 contrast work is not included.

### Planned checks

Propose a separately approved implementation plan. Planned verification is AC-01–AC-07 above, including real browser layout/accessibility and packed consumers; no check for this amendment has run for v0.2.
