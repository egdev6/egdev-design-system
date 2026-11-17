# ColorSwatchGroup — neutral selection ring amendment

- **Version / status:** v0.2 — **Draft — not approved**.
- **Amends:** the [approved v0.1 contract](../v0.1/spec.md) and [implementation notes](../v0.1/implementation.md), only for the selected and focus indicators. The v0.1 text describing no React implementation is historical; the component is now exported. The request is [#465](https://github.com/egdev6/egdev-design-system/issues/465); it is not a new canonical component issue.
- **Approval / recovery:** this file is the proposed recoverable snapshot. Owner approval of this exact amendment is pending. Approval of a spec does not approve its implementation plan, code, token or dependency changes, consumer migration, or external writes.
- **Snapshot identity:** `version: v0.2`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 Pending, VIS-02 Pending, VIS-03 Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/416`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, with LF line endings and the final newline; the metadata above it is excluded. Finalize before publication; any approval must identify the version, digest, scope and adopted visual hashes.
- **Current evidence / limits:** source inspection only. No v0.2 implementation, test run, browser measurement, capture, visual approval or conformity assessment has occurred in this batch.

## 1. Purpose and scope

Replace the selected-color indication with a neutral double ring: a **surface-colored gap plus a 2 CSS px `fg-default` ring**, by default, for a selected preset and for the selected custom-color swatch. No new prop or opt-in is proposed. Selection must remain recognizable against every supported preset, including red, and keyboard focus must remain separately visible. Preserve the existing non-color check for a checked preset. The planned state rules and open details below are proposals, not implemented facts.

The owner chose “Neutral as the default, no prop” for #465; the request limits change to selection and focus indicators and keeps options, native custom input, `<output>` and RadioGroup semantics unchanged (`odd/tasks/nexo-requests-464-466-specs.md`, S4). **This is a visible default contract change, not an additive option:** existing callers will see a different selection indicator without changing their props. The request identifies Nexo as the only current consumer; review its settings appearance and update any visual expectations when a separately authorized implementation is delivered. This consumer count is owner-provided context, not an independently verified repository-wide census.

**Reuse decision:** amend the existing `@egdev/ui` molecule and its approved Radix/Surface composition. Reusing the current indicator unchanged does not provide the requested ring; an opt-in variant would not fix the default for every caller. Consumer CSS composition would require unsupported internal selectors, and extraction or a new component would duplicate the same responsibility. There is no change to package, catalog level, ownership or product persistence.

**Inspected baseline (working-tree source, not a visual capture):** Unless otherwise fully qualified, the following file-and-line references are relative to `packages/ui/src/molecules/color-swatch-group/`.

- `packages/ui/src/index.ts:58-59` and `packages/ui/src/molecules/color-swatch-group/index.ts:1-2` export the component and public types. `types.ts:75-102` defines static CVA recipes.
- There is **no selected outline/ring recipe** in the current item or patch CVA. `ColorSwatchGroup.tsx:19-25` renders a Radix checked `Indicator` with a check icon; `types.ts:90-92` styles it with neutral `bg-surface-0` and `text-fg-default`. The check is not a surrounding double ring. `useColorSwatchGroup.ts:143-162` supplies the controlled Radix value and indicator classes. Do not describe a red selected ring as an observed source fact.
- The existing **focus** indicator is `focus-visible:shadow-focus` for both preset item and custom input, with a forced-colors `Highlight` outline (`types.ts:80-84,98-101`). `packages/tokens/src/theme.css:372-373` defines the focus shadow with a canvas gap and red outer ring; it is a focus treatment, not the selected-state recipe. Browser rendering and the reported red clash have not been measured here.
- The current native custom input is a sibling of the radiogroup, not another radio (`ColorSwatchGroup.tsx:27-33`; `useColorSwatchGroup.ts:110-128`). Existing public tests cover control, keyboard and the checked check, not this proposed selection ring (`ColorSwatchGroup.test.tsx:172-240,352-382,627-638`).

## 2. Anatomy and composition

| Part | Existing element / responsibility | Proposed indicator-only amendment |
| --- | --- | --- |
| Root / legend | Native `fieldset` and visible `legend` name the group | Unchanged; preserve public `eg-color-swatch-group`. |
| Preset collection | Named Radix RadioGroup Root and Item buttons, one per accepted option | Radix remains the sole owner of checked state, roving focus and radio semantics. A selected sample receives the neutral ring. |
| Preset sample / check | Validated, `aria-hidden` color patch; Radix Indicator with decorative check | Keep patch paint and check. Put the ring on an appropriate separate non-interactive indicator/enclosing part, not on the patch; no new public part-selector API. |
| Custom sample | Separately labelled native `input type="color"` in a sibling Surface frame | Give its visible sample/control the same selection treatment when it represents the non-preset accepted value. An internal non-interactive envelope may be needed; keep the input and platform picker intact. |
| Output | Polite native `<output>` of the accepted value | Unchanged; no extra live announcement for the decorative ring. |

The individual `@radix-ui/react-radio-group` primitives and existing `surfaceVariants` composition remain; no extra dependency, `asChild`, public subcomponent or nested interactive control is proposed. No internal ID becomes a styling selector. The exact indicator geometry and implementation are subject to the separately approved plan and the pending decisions in section 7.

## 3. Public API

**No new or changed own prop, event, variant, default value, or export.** The new visual treatment is the default selected state, not `variant`, `tone`, a boolean, or a consumer-selected state.

| Existing prop / event | Type / requirement | Unchanged rule |
| --- | --- | --- |
| `label` | `string`, required | Nonblank visible fieldset legend and radiogroup name; prefixes the output. |
| `options` | `ColorSwatchGroupOption[]`, required | Ordered named opaque hex presets; `ColorSwatchGroupOption = { value: string; label: string; disabled?: boolean }`. |
| `value` | `string`, required | Consumer-controlled current color; no default. Matching is case-insensitive. |
| `onValueChange` | `(value: string) => void`, required | Requests a user change with the original preset spelling or browser-reported valid color; no persistence or normalization. |
| `customLabel` | `string`, optional | Nonblank visible label enables the separate native input; missing or blank omits it. |
| `disabled`, `className` | Native fieldset attributes, optional | Disabled preserves the accepted value; `className` supports root outer margin, width and parent placement only. |

Compatible fieldset attributes and `dir` retain the v0.1 forwarding restrictions; there is no public ref, `asChild`, custom renderer, uncontrolled `defaultValue`, `name`, `required`, native form-submission or part-override contract. The root `className` does not authorize arbitrary paint overrides; `cn()`/`twMerge` is not a universal cascade guarantee. Existing React peer and packed-consumer compatibility claims are unchanged and must not be inferred from types alone.

**Prop-naming lookup:** inspected the [canonical registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md) and [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry) by meaning, name and aliases. Existing applicable entries are `accessible-name` → group/option `label`, `choice-options` → `options`, `primary-value` → group/option `value`, and `interactive-value-change` → `onValueChange`. The existing scoped exception `exception:accessible-name:ColorSwatchGroup:customLabel` names the separate native input; its [approval record](../v0.1/prop-naming-approval.json) is separate from this amendment. `disabled` and `className` are inherited native attributes. There is **no new semantic-ID proposal or naming exception**, and no registry edit or implied convention reapproval.

Reviewed usage source: `{ path: 'packages/ui/src/molecules/color-swatch-group/types.ts', symbols: 'ColorSwatchGroupProps and ColorSwatchGroupOption', revision: 'sha256:6e52ed0be8db660730c84b1cd9d1cf0ed7bc974dc75947a24854c0bafdcf71c4' }`; this is the inspected whole-file working-tree hash, not an invented Git revision.

## 4. Behavior

The following is the **proposed** indicator interpretation, layered onto the unchanged v0.1 validation and controlled behavior. In particular, the custom input always reflects a valid `value`, even when that value matches a preset: its native value alone must not imply that both choices are selected.

| Initial state / action | Proposed visible result | Event |
| --- | --- | --- |
| Valid accepted value matches an accepted preset, ignoring case | Exactly that preset has the neutral ring and existing checked check, including when the selected preset is disabled. The custom input may show the same color but has no custom-selection ring. | None from deriving the indicator. |
| Valid accepted value matches no accepted preset; custom input present | No preset is checked; the custom swatch has the same neutral selection ring. With no accepted options, this remains true for the available custom input. | None. |
| Valid non-preset value; custom input omitted | No preset is checked and no custom-selection ring is rendered; the output still shows the accepted value. | None. |
| Invalid current value | No selection ring; output remains `—` and any custom input remains disabled as in v0.1. Later valid input restores the corresponding indicator. | None for prop updates or recovery. |
| Parent accepts a preset or custom request | Only the newly accepted value drives the ring and output; when a custom value matches a preset ignoring case, the preset takes the ring. | Existing single request callback only; no callback for the subsequent prop update. |
| Parent delays or rejects a request; repeated same color | Ring, checked state and output continue to represent the supplied value; a repeated same-color action does not toggle selection off. | Existing request semantics; no additional indicator event. |
| Group or selected option disabled | Preserve the represented accepted selection, subject to existing disabled presentation; disabled controls cannot be activated. | No request from disabled interaction. |
| Focus moves onto or away from a preset or custom input | Focus indication appears or disappears independently; moving focus does not by itself remove the accepted selection indication. | No new event. |

Do not change validation, option ordering, duplicate/invalid filtering, default labels, native input event cadence, persistence, output text/live-region semantics, or Radix checked/focus behavior. The non-preset custom-ring rule is a recommended interpretation for owner confirmation, not an already approved new ARIA state.

## 5. Accessibility

Retain the visible legend and generated labelling relationship, named RadioGroup items, Radix checked/disabled semantics and the independently labelled native input. The preset check remains visible as a non-color selection cue and `aria-hidden`; the new ring adds visual separation, not a new accessible control. The custom input must not acquire `aria-checked`, `aria-pressed`, a radio role, a new tab stop, or an additional announcement: its existing label, value and accepted-value output remain the accessible source of truth.

Radix continues to own horizontal looping arrow navigation, disabled skipping, Space selection and `dir` behavior; Tab enters/leaves the collection and reaches the sibling picker according to the v0.1 contract. The browser/OS retains picker activation, cancellation and focus return; do not claim uniform native picker internals across platforms.

Selection persists without focus. A focus-visible control must have a **separate, simultaneously discernible focus indicator**, whether it is selected or not; neither may mask or replace the other. In forced-colors mode, do not depend on box-shadow or `fg-default` surviving color forcing: provide a visible selected cue and a separately positioned and/or differently patterned system-color focus outline, distinguishable even when system colors coincide. Preserve the existing selected check and accessible names. Verify focus-only, selection-only and selected-plus-focus states on preset and custom controls in a real browser, including forced colors, rather than claiming class presence establishes visibility. Measure the v0.1 minimum 3:1 non-text contrast, text contrast and target geometry on supported surfaces; platform-specific picker and assistive-technology behavior remain separate manual checks.

## 6. Appearance

| Axis | Proposed default / rule | Restrictions |
| --- | --- | --- |
| Selection | Surface-colored gap followed by a continuous **2 CSS px `fg-default` outer ring** on the selected preset or non-preset custom swatch | Applies by default, no API switch. It is independent of sample color; keep the preset's neutral check and Material frame. |
| Focus | Separate visible focus-visible treatment | Must coexist with selection, be distinguishable from it and remain visible on unselected controls and in forced colors. |
| Size / layout / disabled | Existing fixed sizes, wrapping, Surface frames and disabled behavior | No new size or orientation; no other visual state or picker restyling is in scope. |

**Token and Material evidence:** `--color-fg-default` exists (`packages/tokens/src/theme.css:72-73`); `--color-surface-0` and `--color-surface-1` exist (`:166-169`). As a draft proposal, use the existing `surface-0` role for the gap, consistent with the approved v0.1 check backing, and `fg-default` for the outer ring; verify the rendered result rather than infer contrast from token names. The existing Surface `surface-1`, elevation 1, md-radius frame and its sheen/edge/elevation must not be replaced by a flat patch or by a hand-written shadow/gradient. Selection and focus must not overwrite one another or obscure the check, label or sample. Style Radix state through its existing state attributes, and use static token-backed CVA and per-part `cn()`; no dynamically interpolated classes or inline indicator appearance.

**Geometry / missing role:** `--focus-width: 2px` and `--focus-offset: 2px` exist (`packages/tokens/src/theme.css:474-477`), but are documented for **focus**, not selection. A selection-ring width/gap role is not established by the inspected tokens. Before a plan relies on those focus roles for selection, request owner confirmation of that bounded reuse or a separately approved semantic selection-width role (candidate `--selection-ring-width: 2px`); the gap width and its token/role also need an owner decision. This is a pending proposal, not an added token or permission to change token values. If no approved existing role can express the required geometry, propose the missing role for confirmation; do not invent a token, hand-code appearance values, or silently repurpose an unrelated invalid/focus token. The gap color and role must also be reconsidered if actual contrast checks fail.

**Bounded color exception remains unchanged:** only each validated opaque six-digit sRGB preset's decorative `aria-hidden` patch may use the exact static `bg-[color:var(--eg-swatch-color)]` utility and its validated lowercase inline `--eg-swatch-color`. The patch itself has no text, icon, ring, border, focus or Material shadow. Neither the custom input nor a ring, wrapper, label, check or focus treatment may use this variable, direct inline color, CSS expressions or dynamic utility interpolation. The native picker paints its own platform color, not a second exception. No new token, token value, dependency or consumer theming behavior is authorized.

**Files / composition:** retain the existing six meaningful files (`types.ts`, `useColorSwatchGroup.ts`, `ColorSwatchGroup.tsx`, `ColorSwatchGroup.test.tsx`, `ColorSwatchGroup.stories.tsx`, `index.ts`) and their established responsibilities. **No stylesheet** and no additional internal module is proposed. A later implementation must prove any required static utilities are emitted in the production CSS and work in a packed consumer without a Tailwind compiler; it must not remove Material or legacy behavior. Root `className` remains limited to supported layout and is not a part or appearance override.

### Expected-design visual reference

No images were produced in this batch. The historical v0.1 observed keyboard PNGs under `docs/components/color-swatch-group/v0.1/observed/` are historical observations, not an approved v0.2 expected design. Current Storybook is baseline evidence only, not an adopted target. **Visual conformity: Not evaluated.**

| Visual ID | Proposed component-zone scenario / descriptive alt | Source, conditions and status |
| --- | --- | --- |
| VIS-01 | Pending: selected red, dark, light and surface-matching preset samples, with unfocused neutral ring and check. | Expected-design source and v0.2 image pending; related AC-01/02/09. |
| VIS-02 | Pending: selected non-preset custom swatch and preset-matching custom input; focus on selected and unselected controls. | Expected-design source and v0.2 image pending; related AC-03/04. |
| VIS-03 | Pending: selected and focused preset/custom controls in forced colors, including disabled selection. | Real browser observation and expected-design adoption pending; related AC-04/07. |

For each VIS ID, agree the source/story and source commit or version, viewport, device scale, browser/version, theme, loaded fonts, motion/transparency preferences, crop, capture date/tool, image SHA-256 and recoverable scoped owner approval. Capture comparable real component zones with the [visual guide](../../../design/README.md) only after required source/hosting/tool permissions; do not infer token values from pixels. Captures are not interaction, accessibility or contrast tests, and no expected-design reference is approved merely because it resembles the current component.

**Current Storybook baselines** from `ColorSwatchGroup.stories.tsx:33-38,59-66,84-85,110-136` (paths assume a running Storybook; none was started here):

- `?path=/story/molecules-colorswatchgroup--presets` — red preset selected; current check and focus when navigated to, with no picker.
- `?path=/story/molecules-colorswatchgroup--custom` — non-preset current value and separately labelled native picker.
- `?path=/story/molecules-colorswatchgroup--keyboard` — accepting controlled example for moving focus, selecting and reaching the picker.
- `?path=/story/molecules-colorswatchgroup--color-extremes` and `?path=/story/molecules-colorswatchgroup--states` — light/dark samples, custom and disabled states. These show the **current** implementation, not the proposed ring.

## 7. Acceptance criteria

All checks below are **planned**, not observed for v0.2. Stories illustrate scenarios; behavior tests and real-browser measurements remain separate. Existing baseline story names identify reusable starting points; any new/expanded scenario is future work, not a claim it exists today.

| ID | Observable promise | Planned behavior / structural check | Planned story / real-browser visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | A selected preset gets the default surface gap and 2px `fg-default` ring without a prop; unselected presets do not. | Public role-based selected/unselected state and static CSS/production bundle checks; confirm no new API. | Expand `Presets` and `ColorExtremes`; measure the actual gap, ring width and token-computed color in a real browser; VIS-01. | Pending |
| AC-02 | The ring is readable for every supplied preset, including red and black, white and surface-matching boundary examples; the existing neutral checked check remains. | Public checked-state and decorative-check regression tests; retain validated sample paint. | Capture/measure representative samples against supported surface-0…3 contexts and check adjacent non-text contrast at least 3:1; VIS-01. | Pending |
| AC-03 | A valid non-preset value selects the custom indicator; a matching preset takes the ring instead, case-insensitively. Missing picker, empty options, disabled selected values and invalid-current recovery follow section 4. | Public tests for each named state, including no checked radio for non-preset, accepted output/input, callback counts and unchanged consumer data. | Expand `Custom`, `EmptyOptions`, `Disabled` and `InvalidInput`; inspect both preset and custom samples; VIS-02/03. | Pending |
| AC-04 | Selection and focus are simultaneously distinct and independently visible on selected and unselected preset and custom controls, including forced colors. | Keyboard/tab interaction and focus-target tests; verify no fabricated checked semantics or extra tab stops. | Real-browser keyboard, computed-style and component-zone checks with forced colors on/off, focus-only/selection-only/both, and system-color coincidence; measure required contrast; VIS-02/03. | Pending |
| AC-05 | The checked preset remains a named Radix radio; horizontal looping, disabled skipping, direction, Space, Tab and the sibling native picker are unchanged. | Role/name/checked/disabled and interaction regressions for LTR/RTL, including preset-to-picker focus order. | Expand `Keyboard`, `Wrapped`, `RTL`; real-browser native picker keyboard smoke check; no new expected-design image required. | Pending |
| AC-06 | Requests remain controlled; accepted, delayed, rejected, repeated and prop-driven changes preserve payloads, callback counts, output and consumer data. | Public controlled-harness tests of preset and native input, including unchanged options and consumer state on rejected requests. | Expand `Controlled` and `ConsumerControlled`; browser interaction smoke check; no capture required. | Pending |
| AC-07 | Disabled selection stays represented without activation; the output remains readable, and no additional announcement is introduced. | Public disabled click/keyboard, output/live-region and callback tests; no consumer mutation. | `Disabled`, plus forced-colors browser and manual assistive-technology observation; VIS-03. | Pending |
| AC-08 | Only validated decorative preset patches use the approved swatch color utility/property; selection, custom, focus and Material paint never use consumer color as inline appearance. | Public malformed/duplicate input, DOM/style-safety and CSS scanning tests; invalid data reaches neither CSS nor native value and does not mutate inputs. | `InvalidInput`, `ColorExtremes`; real-browser computed paint and packed-consumer CSS check; VIS-01/02. | Pending |
| AC-09 | Surface Material, root marker, supported root-layout merging, output, native restrictions, exports and six-file/no-stylesheet boundaries are preserved; no token or dependency changes are assumed. | Public export/props and class-merge regression tests, source/token/dependency diff review, CSS build and packed-consumer checks under a separately authorized plan. | Existing `Comparison` and `States`; browser checks that selection/focus do not erase Material or clip at supported zoom/wrapping; VIS-01/02. | Pending |

### Resolved decisions

- The owner chose a **neutral default with no prop** for #465; selected presets, including red, and the custom-color swatch are in scope. The default appearance changes for existing consumers; Nexo is the sole current consumer per the request.
- Keep option data, the native color input, `<output>` and RadioGroup semantics; the existing patch-only color exception is not widened. Keep focus distinct from selection.
- This is a draft spec batch: no implementation is implied, and the implementation plan requires separate approval.

### Remaining decisions / evidence for the owner

1. Confirm the recommended mapping of custom-selection paint to a valid accepted **non-preset** value only, including empty options, disabled state and case-insensitive preset matches; alternatively decide a different custom indicator rule without changing native/radio semantics.
2. Confirm the proposed `surface-0` gap, gap width and semantic geometry roles. In particular, either explicitly approve bounded reuse of the existing focus geometry tokens for selection or separately approve a semantic selection-ring width/gap proposal; no token mutation is authorized by this draft.
3. Confirm the non-overlapping normal and forced-colors focus/selection treatment and the native-input envelope after real browser checks; preserve the v0.1 check and focus visibility rather than relying only on color.
4. Supply or authorize an expected-design source, capture conditions and scoped approval of the actual VIS images; review the current Storybook baseline separately. Visual conformity and cross-browser picker/AT evidence remain pending.
5. Approve this exact v0.2 snapshot, then review a **separate** bounded implementation plan; decide any later consumer migration, token or dependency proposal independently.

### Planned checks

After the pending decisions and separate plan approval, run AC-01–AC-09: behavior and accessibility regressions first, then authorized CSS/build and packed-consumer checks, real-browser contrast/geometry and forced-colors inspection, and agreed component-zone captures for owner review. Nothing in this amendment records those checks as passed or authorizes the implementation.
