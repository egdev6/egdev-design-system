# Tabs — selected-tone amendment

- **Version / status:** v0.3 — **Draft — not approved**.
- **Amends:** the [v0.1 contract and implementation evidence](../v0.1/implementation.md), the [approved v0.2 full-width / label-wrap amendment](../v0.2/full-width-wrap-amendment.md) and the Tabs portion of [#426](../../../foundation/semantic-roles-adoption.md). This is the proposed response to [#464](https://github.com/egdev6/egdev-design-system/issues/464), not implementation authorization.
- **Approval / recovery:** Pending explicit owner approval of this exact snapshot and its identified visuals. The prior approval does not approve the new treatment, naming convention, token changes or plan.
- **Current situation / pending decisions:** Tabs is exported and the #426 tint is implemented. `selectedTone` and `outline` are not implemented. An accent-following chip-active gradient and rendered contrast evidence are missing; see sections 5–7.
- **Snapshot identity:** `version: v0.3`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 Pending, VIS-02 Pending, VIS-03 Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/107`; `latestPublishedComment: Pending`. #464 tracks this request; it is not a new canonical component contract.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, with LF line endings and the final newline. Tracking metadata above that heading is excluded. Finalize before publication; approval must bind the digest and identified visual hashes.

## 1. Purpose and scope

- **Need:** Nexo can opt into an `outline` selected-segment treatment: brand border and chip-active sheen over surface-1 with an edge shadow, following the runtime accent. The owner's choice is `selectedTone`, with `tint` as the unchanged default; Quorb is unaffected when it does not opt in (`odd/tasks/nexo-requests-464-466-specs.md:9`). Contrast and focus in both tones remain requirements, not established results.
- **Scope:** only the selected segmented trigger's surface, border and shadow are candidates for change. Other tab states, label/count treatment, `fullWidth`, `labelWrap`, sizing, keyboard, focus behavior and selection remain as they are. Underline is outside the requested appearance change. If compliance needs changes outside that boundary or a changed default, stop for an owner decision rather than silently broaden it.
- **Cataloging:** reuse the existing exported `@egdev/ui` molecule and propose one opt-in appearance axis. Reuse as-is cannot select a different active paint; the data-driven public API exposes no part on which a consumer can compose it. Extraction or a new widget would duplicate the same tab/panel responsibility.
- **Evidence:** `packages/ui/src/index.ts:116-117` and `packages/ui/src/molecules/tabs/index.ts:1-3` export the component, types and root recipe. Current anatomy, behavior, tests and stories are in `packages/ui/src/molecules/tabs/Tabs.tsx:1-34`, `packages/ui/src/molecules/tabs/types.ts:5-104`, `packages/ui/src/molecules/tabs/useTabs.ts:23-65`, `packages/ui/src/molecules/tabs/Tabs.test.tsx:114-179,246-307,525-596` and `packages/ui/src/molecules/tabs/Tabs.stories.tsx:30-140`. The current segmented active treatment is specifically `packages/ui/src/molecules/tabs/types.ts:155-158`, not a shipped `outline` option.

## 2. Anatomy and composition

| Part | Responsibility / current primitive | Amendment |
| --- | --- | --- |
| Root | Radix Tabs Root, a `div`, forwards supported native outer-layout attributes | Unchanged; consume the proposed prop rather than forwarding it to the DOM. |
| List | Named Radix Tabs List; segmented lists compose the exported Surface well | Unchanged (`useTabs.ts:47-64`; `packages/ui/src/primitives/surface/types.ts:24-30`). |
| Trigger / counter | Radix Trigger button; label and optional counter span | Selected segmented trigger paint only; counter, other states and content are unchanged. |
| Panel | Radix Content for each item | Unchanged; inactive children unmount while wrappers remain (`Tabs.test.tsx:64-98`). |

`@radix-ui/react-tabs` owns interactions, selection and relationships. No new `asChild`, public part selector, state class, ref, child-composition API or internal element is promised. Preserve `eg-tabs`, the public root recipe and existing exports; do not migrate or remove legacy CSS. Attribute-based `data-state` remains Radix-owned.

## 3. Public API

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `selectedTone` **proposed** | `'tint' \| 'outline'` | No | `'tint'` | Chooses selected segmented paint only. Proposed no-op for `variant='underline'`; confirm with the owner. Does not select a tab or change `TabsItem.tone`. |
| `items` | `TabsItem[]` | Yes | No default | Ordered items have unique non-empty `value`, `label: string`, `content: ReactNode`, and optional `count: number`, `tone: 'neutral' \| 'danger'`, `disabled: boolean`; at least one item must be enabled. |
| `label` | `string` | Yes | No default | Accessible name for the tablist. |
| `value` / `defaultValue` | `string` / `string` | No | Controlled `value`, otherwise `defaultValue`, otherwise first enabled item | Existing Radix selection contract. |
| `onValueChange` | `(value: string) => void` | No | No callback | Existing user-driven selection request; changing the visual tone emits no selection event. |
| `variant` | `'underline' \| 'segmented'` | No | `'underline'` | Existing row treatment. |
| `size` | `'md' \| 'sm'` | No | `'md'` | Existing underline dimensions; segmented ignores size. |
| `fullWidth` / `labelWrap` | `boolean` / `boolean` | No | Both `false` | Existing independent segmented layout options; no effect on underline. |

**Prop-naming lookup:** reviewed the [registry source](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md) by meaning, name and aliases. `visual-treatment` → `variant` is already the whole-row axis (`skills/_shared/prop-naming.json:984-988,1219-1226`); changing it would conflate row shape and selected finish. `surface-material-tone` → `tone` is approved for component-specific color/material families and already maps `TabsItem.tone` to the counter, not the selected trigger (`skills/_shared/prop-naming.json:1311-1319,1487-1494`). `primary-value` concerns selection identity; `consumer-selected-condition` is a measurement/position interpretation and excludes visual variants (`skills/_shared/prop-naming.json:298,2124-2128`). Neither is this finish axis. No `selectedTone` convention or alias was found.

**Naming proposal, not a registry edit:** semantic ID `selected-state-treatment`, name `selectedTone`, meaning “select the visual treatment of the currently selected item independently of the component's overall variant”; use for a supported selected-state appearance axis, not selection identity, status or arbitrary color. Tabs-specific proposed type is `'tint' | 'outline'` with default `'tint'`. Status and approval are **Pending**; no alias or exception is asserted. Owner/registry review must decide whether this distinct concept or a scoped exception to an existing convention is appropriate; no registry entry or approval is created here. Reviewed current context: `source: { path: 'packages/ui/src/molecules/tabs/types.ts', symbol: 'TabsProps', revision: 'sha256:5de3e398e36e462dae3ab06258efa69114ac790fcc2ac790acf306b07899b5fd' }`. This is the reviewed existing symbol, **not** evidence that `TabsProps.selectedTone` already exists; future usage must be reviewed and rehashed after implementation.

**Native props / refs:** existing `Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'defaultValue' | 'dir' | 'onChange'>`, with selection `defaultValue` reintroduced, stays unchanged (`types.ts:52-104`). Root `className` is last-merged for outer margin, width and grid placement only, not unrestricted appearance or internal-part overrides. No ref is promised. `cn`/`twMerge` only resolve recognized conflicts, not all cascade cases. No new React compatibility claim follows from types; verify packed consumers under the existing React peer matrix.

**Controlled / uncontrolled and compatibility:** `useTabs.ts:37-43` forwards controlled value and callback and derives the first-enabled uncontrolled fallback. An unacknowledged controlled request can occur through more than one Radix activation path (`Tabs.test.tsx:164-179`); no new deduplication is proposed. Existing imports, marker, public `tabsVariants`, APIs and omitted-prop rendering must remain compatible. This additive option intentionally changes only opt-in appearance, not Quorb's or any other consumer's default.

## 4. Behavior

| Initial state / action | Expected result | Event |
| --- | --- | --- |
| `selectedTone` omitted or `tint` | Preserve the existing #426 segmented border, tint, surface and shadows; all other output is unchanged. | None from tone. |
| Segmented with `outline` | Apply the proposed legacy-inspired surface, border and shadow to the active trigger only; moving selection transfers that treatment. | Only the existing Radix selection request, when applicable. |
| Underline with either tone | Proposed: neither tone changes underline paint or layout. | None from tone. |
| Toggle tone, or toggle `fullWidth` / `labelWrap` | Selection, panels, count, state and focus ownership remain unchanged. The layout options retain their existing behavior in both tones. | No selection notification solely from an appearance/layout prop update. |
| Navigate/click, including disabled items | Preserve automatic horizontal activation, roving focus, disabled skipping and existing controlled/uncontrolled semantics. | Existing `onValueChange` requests only. |

Consumer collection validity, panel-state persistence and suitable host sizing remain the v0.1/v0.2 responsibilities. No new invalid-input normalization or runtime exception is proposed. Use Radix `data-state`/ARIA, not a duplicate state machine or mirrored visual state class.

## 5. Accessibility

- **Names and relationships:** the consumer supplies `label`; item text and any count form the tab's accessible name. Radix supplies tablist/tab/tabpanel roles, `aria-selected`, generated IDs and relationships. Tone adds no announcement. These semantics do not by themselves establish visual accessibility.
- **Keyboard / focus:** retain horizontal automatic activation, ArrowLeft/ArrowRight, Home/End, disabled skipping and Tab exit. Preserve the existing `focus-visible` token treatment, including `data-[state=active]:focus-visible:shadow-focus` precedence over the material shadow (`types.ts:147-158`). In full-width overflow, retain existing focused-tab reveal (`useTabs.ts:48-57`). Focus must be visible, not obscured or clipped, and distinct from selected appearance in both tones, including selected and unselected enabled triggers.
- **Contrast and non-color cues:** for each enabled tone on supported solid surfaces, plan unrounded WCAG 2.2 AA checks of normal-sized selected label text against its actual composited background (at least 4.5:1, SC 1.4.3); meaningful control/selection indicators and focus against their adjacent rendered colors (at least 3:1 where applicable, SC 1.4.11); and visible / unobscured keyboard focus (SC 2.4.7 and 2.4.11). Inspect the actual selected-vs-unselected cue and a non-color distinction (SC 1.4.1), not just ARIA or a decorative glow. Evaluate relevant contrast across the gradient and in default red and custom accents, not just its endpoints or token names. Disabled controls' WCAG contrast exceptions do not excuse testing their unchanged behavior.
- **Evidence limit:** the opaque surface-3 vs surface-0 pair is only 1.35:1; the present brand-alpha border is documented as decorative, and the composite selected state and focus have not been measured (`docs/foundation/semantic-roles-adoption.md:45-49,63,89`). `createAccentTheme`'s custom solid-surface bounds do not establish contrast through a translucent tint (`docs/foundation/runtime-accent.md:27-29,40-46,59`). If either tone fails, especially the unchanged default, do not assert compliance or alter the default within this spec: return the evidence for an owner-approved resolution. If a separate cue, stronger border, focus fallback, foreground change or scope change is needed, it is a pending proposal, not an authorized fix. Check forced colors and reduced motion in a real browser as well; do not assume a box-shadow survives forced colors. Compact segmented touch targets remain a consumer consideration, unchanged by this proposal.

## 6. Appearance

| Axis | Values / default | Combinations / restrictions |
| --- | --- | --- |
| `variant` | `underline` / `segmented`; `underline` | Segmented retains the Surface well; underline appearance is unchanged. |
| `selectedTone` | proposed `tint` / `outline`; `tint` | Selected segmented trigger only; proposed no-op for underline. Both work with either `fullWidth` and `labelWrap` value. |
| `size` | `md` / `sm`; `md` | Underline only; segmented geometry unchanged. |

**Observed `tint` baseline:** `packages/ui/src/molecules/tabs/types.ts:139-158` uses selected `--color-border-brand`, `--color-state-selected-surface` (surface-3), neutral `--gradient-sheen`, `--shadow-edge-strong` plus `--shadow-elev-1`, and a non-interactive brand-border-colored `::before` tint over the base. Preserve this exact default paint and its focus precedence. The existing role and focus behavior are also covered by `Tabs.test.tsx:246-307`; these class assertions are not proof of computed pixels or contrast.

**Proposed `outline` role mapping; not yet an approved or implementable recipe:**

| Layer / responsibility | Existing semantic role and intended mapping | Evidence / limitation |
| --- | --- | --- |
| Selected base | `--color-surface-1` (`bg-surface-1`) under the sheen; `--color-app-card` aliases it. | `packages/tokens/src/theme.css:168-169,176`. This neutral base is intentionally not accent-colored. |
| Brand border | `--color-border-brand` (`border-border-brand`), on the selected trigger only. | Default alpha-red and custom `rgba(B, 0.45)` are supplied by `packages/tokens/src/accent.ts:14-24,114-126`; this role follows the scoped accent but is decorative, not guaranteed 3:1. |
| Chip-active colored sheen | Desired: the existing `--gradient-chip-active` visual profile composited **above** surface-1, following the same scoped accent. | `packages/tokens/src/theme.css:548-549` hard-codes red alpha stops. Neither default nor custom `createAccentTheme` maps this gradient (`accent.ts:14-38,114-137`); secondary/chip gradients are explicitly outside that helper (`docs/foundation/runtime-accent.md:59`). The current token therefore does **not** meet the runtime-accent promise. `--gradient-state-selected` does follow the accent but is an opaque primary-control gradient, not an equivalent translucent chip sheen. |
| Edge and elevation | `--shadow-edge-strong`, with existing `--shadow-elev-1` as the raised two-layer Material shadow; focus takes precedence. | `theme.css:380-383`; the edge/elevation are neutral. The proposed combination requires approval as this selected-trigger recipe, not automatic Surface-class cloning. |
| Ink / focus | Retain selected `--color-fg-default` and the existing `--shadow-focus` / `--color-focus-ring` behavior. | `theme.css:72-73,94-95,372-373`; `accent.ts:23-24,125-126`. Measure actual composite and focus, including custom light accents. |

The legacy Chip recipe is evidence for the intended relationship of chip-active gradient over surface-1 and the edge shadow (`packages/ui/src/styles/legacy/bundle.css:130`), not an approved Tabs reference, permission to reuse its fixed-red halo, or proof of exact parity. In particular, the existing neutral `--gradient-sheen` plus a flat `--color-border-brand` tint above surface-1 is a **candidate approximation using existing roles**, not the chip-active gradient: its color profile and opacity differ. It requires owner acceptance of the difference and measured contrast; it must not be called an exact match.

**Missing role / prerequisite:** no existing inspected semantic gradient both reproduces the chip-active profile and follows `createAccentTheme`. If exact accent-following chip sheen is retained as a requirement, propose an accent-following chip-active gradient role, with its **name, default and custom derivation pending owner confirmation**, and a corresponding complete-map/default-reset extension; do not invent a token, value, formula or approval. Alternatively the owner may accept the existing-role approximation, after reviewing its visual and contrast impact. The two options are not interchangeable and neither is authorized by this draft. No hardcoded red, handwritten gradient/color mix, inline component appearance, dynamic utility interpolation, dependency or token mutation is authorized.

**Scope and implementation boundaries:** a consumer applies the helper's complete immutable map to a consumer-owned theme host, not to Tabs internals; account for CSS inheritance and nested default resets (`packages/tokens/README.md:52-69`). Plan static token-backed CVA in `types.ts`, per-part `cn` in `useTabs.ts`, and unchanged `Tabs.tsx` / Radix ownership, contingent on an approved recipe and separate plan. Keep the six meaningful files: `types.ts`, `useTabs.ts`, `Tabs.tsx`, `Tabs.test.tsx`, `Tabs.stories.tsx`, and `index.ts`. **No stylesheet.** No additional internal module, dynamic geometry or app CSS migration is proposed. Preserve root layout-only merge semantics and existing `fullWidth` focus/scroll behavior.

### Expected-design visual reference

No captures were produced in this batch; no baseline image is automatically an approved expected design. Scenarios below are proposed, not existing captures or approved story names.

| Visual ID | Image / descriptive scenario | Source and version | Status / conditions |
| --- | --- | --- | --- |
| VIS-01 | Pending: segmented default `tint`, selected and adjacent unselected tabs | Current `Molecules/Tabs / Segmented` is a baseline candidate, not an approved design; version/commit pending. | Pending source agreement, real component-zone PNG, hash and scoped approval. |
| VIS-02 | Pending: segmented `outline`, selected and adjacent unselected tabs | Expected-design source and story/preview pending. | Pending source, capture, hash and scoped approval. |
| VIS-03 | Pending: focused selected `outline` and `tint` under a custom accent, including narrow full-width overflow | Expected-design source and story/preview pending. | Pending source, capture, hash and scoped approval. |

For each VIS, agree and record viewport, device scale, browser/version, theme and exact accent, loaded fonts, motion/transparency and forced-colors preferences, crop, date, tool and SHA-256. Request authorized real-browser component-zone captures; compare against the approved expected source under comparable conditions. Historical v0.2 captures are observed implementation records, not new v0.3 expected-design approval (`docs/components/tabs/v0.2/implementation.md`, Parent browser verification). Until evidence and approval exist, visual conformity is **Not evaluated**. Captures do not replace behavior or contrast tests.

## 7. Acceptance criteria

All checks and stories below are **planned**, not observed for v0.3. Existing tests/stories cited above are baseline evidence only; stories never replace tests.

| ID | Observable promise | Planned behavior / build check | Planned story / real-browser visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | Omitted tone and explicit `tint` preserve the existing segmented default, markers, exports, root merge and consumers. | `Tabs.test.tsx`: compare omitted and explicit tint; preserved default/explicit false and API/export tests; packed consumer and compiled CSS checks. | Existing `Segmented` and planned side-by-side tones; capture VIS-01 and compare pre/post under identical conditions. | Pending |
| AC-02 | `outline` changes only the selected segmented surface, border and shadow; selection moves the treatment without changing inactive, hover, disabled, count or panel styling. | Role-based tests of state transitions, prop consumption, label/count and unchanged state classes; inspect compiled static token utilities. | Planned side-by-side tones, disabled and selection examples; browser computed styles and VIS-02. | Pending |
| AC-03 | Outline has surface-1, accent-following brand border and chip-active sheen with edge/elevation, in the approved layering and without fixed-red leakage. | Test approved role mapping and production CSS/package consumption; any new role/helper changes require separate authorization. | Real browser under default red and custom `#123456`, `#00ff00` and `#ffffff`; inspect actual composite and VIS-02/03. Exact sheen remains blocked on the missing role or an owner-approved approximation. | Pending |
| AC-04 | Changing theme scope follows the accent; nested default reset and sibling scopes do not inherit the wrong border or sheen. | Integration tests using the public helper's complete map on consumer hosts; no new prop forwarding or component-owned inline appearance. | Browser computed styles and captures for custom, nested default and sibling scopes, including a live custom-to-default change; VIS-03. | Pending |
| AC-05 | Selected label text meets 4.5:1 on actual composited backgrounds; meaningful selection/boundary meets applicable 3:1 and has a non-color cue, in both tones. | Contrast calculations from actual resolved, alpha-composited colors with no premature rounding; tests must not treat token assertions as rendered proof. | Real-browser sample/inspect each relevant gradient region against its adjacent surfaces, default red and custom accents including light/dark inputs; record worst ratios and any failure. | Pending |
| AC-06 | Keyboard focus is visible, distinct and unobscured in both tones on selected/unselected enabled tabs, including overflow edges and forced colors. | Role-based keyboard tests and focused-active precedence/CSS checks; preserve scroll reveal calls. | Real keyboard focus in browser at both overflow edges, normal and forced colors, reduced motion; measure focus vs adjacent colors, inspect clipping and capture VIS-03. | Pending |
| AC-07 | Controlled/uncontrolled selection, first-enabled fallback, callbacks, disabled skipping, counts, panel relationships and inactive-content unmounting are unchanged. | `Tabs.test.tsx`: interaction and relationship tests for both tones, including fixed controlled value and no change event on tone-only rerender. | Existing `Controlled` / `Disabled` plus planned both-tone examples; browser keyboard smoke check. | Pending |
| AC-08 | `fullWidth` / `labelWrap` independently retain their layout, word handling and overflow behavior in both tones; size still affects only underline. | Tests for all four layout combinations per tone, including count and focus reveal, and both existing size values. | Existing `FullWidth`, `LabelWrap`, `FullWidthLabelWrap` plus planned outline examples; measure boxes/scroll and keyboard visibility in browser. | Pending |
| AC-09 | Proposed `selectedTone` on underline is a no-op; omitted/default underline rendering and its focus/selection stay unchanged. | Compare both tone values to the previous underline behavior for both sizes, role/keyboard and emitted events. | Existing `Default` / `Small`; browser computed paint comparison. Owner confirmation of no-op is pending. | Pending |
| AC-10 | Public types/docs/Controls expose exactly the approved option and default; no new API, dependency or unauthorized token change leaks in. | Type/docgen and installed Controls pipeline tests; package exports and native/Tailwind consumer CSS checks; review source, naming and dependency diff. | Verify actual Storybook Controls for both tones in a browser; not a substitute for tests. | Pending |
| AC-11 | Expected-design references and both tones are reviewed against comparable captures; spec and implementation approvals remain separate. | No behavior-test substitute; finalize snapshot and visual hashes with scoped approvals before publication. | Authorized component-zone VIS-01–03 capture/provenance and owner review; visual conformity remains Not evaluated until then. | Pending |

### Resolved decisions

- The owner chose opt-in `selectedTone`: retain `tint` by default, let Nexo opt into `outline`, and leave consumers that do not opt in unchanged (`odd/tasks/nexo-requests-464-466-specs.md:9,27`).
- This batch drafts specs only. It neither changes tokens/dependencies nor authorizes code, GitHub writes, captures or implementation. One independently approved plan and implementation PR follow this issue (`odd/tasks/nexo-requests-464-466-specs.md:3,7,13`).

### Remaining decisions for the owner

1. **Sheen / accent conflict:** choose an owner-approved accent-following chip-gradient role and corresponding helper-map extension, or explicitly accept the existing-role approximation and its visual difference; the former additionally needs token values, derivation and separate token approval. Neither currently proves WCAG compliance.
2. **Contrast and focus:** review actual measurements for both tones and accent scopes. If the existing default or proposed outline fails, decide a compliant cue/border/focus/ink approach and any necessary exception to default-preservation or selected-surface/border/shadow-only scope. No such exception is assumed.
3. **Naming and combinations:** confirm the `selected-state-treatment` naming proposal versus a scoped convention exception, and the proposed underline no-op. Convention approval is separate from spec approval.
4. **Visual reference:** agree expected-design source, VIS scenarios and capture conditions; separately authorize capture and adopt specific hashes. Current Storybook is baseline only.

### Planned checks and next step

Complete AC-01–AC-11 with behavior tests, CSS/package checks, actual Storybook Controls, real-browser contrast/keyboard/visual checks and owner review. Resolve the pending choices and bind approval to this snapshot and visuals. Then propose a separate implementation plan and wait for its approval. Nothing in this amendment is marked implemented; no tests, browser captures or visual-conformity checks ran in this documentation batch.
