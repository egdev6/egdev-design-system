# Component contract — ColorSwatchGroup

- **Version:** v0.1
- **Status:** Approved — 2026-11-17 (owner, in session; odd/tasks/shared-app-theme-specs.md L2). Implementation plan follows the same delegation.
- **Approval / recovery:** This approved spec is saved at `docs/components/color-swatch-group/v0.1/spec.md`; the cataloging, component contract, scoped naming exception and bounded paint exception are approved. The implementation plan follows the same delegation; token/dependency changes and consumer migration are not implied.
- **Current situation / open evidence:** No React implementation or public export exists. The expected visual reference, capture/approval and implementation evidence remain pending.
- **Snapshot identity:** `version: v0.1`; `contentSHA256: Pending`; `visualHashes: Pending`; `approvalReference: odd/tasks/shared-app-theme-specs.md L2`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/416`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, with LF line endings and a final newline; tracking metadata above it is excluded. Finalize before publication; the published snapshot must identify this version, digest and adopted visual hashes.

## Approval

The owner's choices are “Sí, aprobar la excepción acotada” and “Sí, igual que el 1 y 2” (`odd/tasks/shared-app-theme-specs.md` L2). All five cataloging and appearance decisions resolve to their Recommended options, including the patch-only validated six-digit hex paint exception and the scoped `customLabel` naming exception. The implementation plan follows the same delegation. Real visual references and their scoped adoption, snapshot digest and later registry evidence remain open; no new token value is approved.

## 1. Purpose and scope

Provide a reusable, accessible choice between named consumer-supplied colors and, optionally, a native custom-color picker. The consumer owns persistence, localization, application normalization policy, accent palette derivation and reset. This component does not apply a runtime theme, derive colors, store preferences, provide a reset, implement a color dialog, or own application-specific presets.

### Approved cataloging decision

- **Responsibility / level / destination:** coordinate an exclusive preset collection and a separate custom-color control around one consumer-owned value: **molecule**, `@egdev/ui`, proposed `packages/ui/src/molecules/color-swatch-group/`. It is not merely a collection of small nodes: the radio selection and custom picker are independent controls coordinated as one choice. No product settings or storage enter the package.
- **Evidence:** [#416](https://github.com/egdev6/egdev-design-system/issues/416) and its zero comments were supplied in full by the parent after the requested `gh` command returned no output locally. Nexo renders named, pressed preset buttons plus a labelled native picker at `/home/egdev/proyectos/nexo/apps/hub/src/settings/index.tsx:68-76`, and styles their color, selection and focus at `/home/egdev/proyectos/nexo/apps/hub/src/settings/settings.css:21-29`. Quorb renders an independent preset/picker combination at `/home/egdev/proyectos/quorb/src/Settings.tsx:1675-1684`, styles it at `/home/egdev/proyectos/quorb/src/theme.css:313-325`, and hands accent changes to its application at `/home/egdev/proyectos/quorb/src/Settings.tsx:2883-2884`. These are observed consumer implementations, not approved target design or proof of conformance.
- **Public React comparison:** `packages/ui/src/index.ts:31,111,223` exports RadioGroup, SelectTile and `surfaceVariants`; it does not export ColorSwatchGroup. `packages/ui/src/atoms/radio-group/types.ts:5-76` exposes labelled text options, value/change, disabled and form semantics, but no color patch or custom picker; `RadioGroup.tsx` renders its fixed labelled rows. `packages/ui/src/molecules/select-tile/types.ts:18-46,93-167` and `SelectTile.tsx` expose labelled single/multiple visual cards, not arbitrary runtime color patches or a picker. `docs/CATALOGO.md` is a provisional map, not proof of availability.
- **Reuse → variant → compose → extract → new:** existing RadioGroup or SelectTile alone cannot display these consumer colors and coordinate the native picker. A visual variant would add a second control and a shared-value responsibility. App-local composition is possible but repeats the same policy in two independent apps; no already exported subcomponent provides that coordination to extract unchanged. **Recommended: create a new public molecule**, factoring the repeated cross-app composition without modifying the existing controls. Reuse SelectTile's Radix single-selection/sibling-caption anatomy and `surfaceVariants` for Material; use RadioGroup's semantics and naming conventions, not its fixed text-only JSX or an interactive control nested inside another.
- **Radix / native:** use `@radix-ui/react-radio-group` Root, Item and Indicator for presets. The individual package is already declared (`packages/ui/package.json:39`); Radix owns radio selection, roving focus and keyboard behavior. Native `<input type="color">` is the browser/OS picker: Radix RadioGroup does not implement a color dialog, and no custom picker keyboard or dialog engine is proposed. The picker is a sibling of the radiogroup, never a radio or nested inside one.
- **Impact:** proposed named component/types, root marker, stories, tests, and later catalog/registry integration; no existing export, marker or consumer has changed. The implementation plan under the same delegation must cover any source scanning and package-barrel/catalog integration.

### Resolved decisions

1. Boundary and semantics: RadioGroup/SelectTile variant or shared composition? **Approved (Recommended):** the new molecule above, with Radix preset radios and a separately labelled native picker.
2. State and data contract: uncontrolled state or one consumer-controlled value? **Approved (Recommended):** controlled-only, as in section 3, with case-insensitive local matching but unchanged callback payloads and consumer-owned persistence/normalization.
3. Picker and names: anonymous color dots or visible names and an optional separately named picker? **Approved (Recommended):** visible localized option names and `customLabel`; omit the picker when that prop is absent. This follows `choice-options` and provides a non-color cue rather than assuming the consumers' present visuals are approved.
4. Swatch paint: token-only preset colors, arbitrary inline background, or the bounded custom-property recipe? **Approved:** the strictly validated, patch-only exception in section 6.
5. Visual reference: treat consumer CSS as the expected design or obtain a real reference? **Approved (Recommended):** obtain and approve real component-zone references with the provenance below; consumer code is evidence of need only.

## 2. Anatomy and composition

| Part | Responsibility | Native element / Radix primitive | Content |
| --- | --- | --- | --- |
| Root and legend | Name and group the whole color choice | `fieldset` and `legend` | Required visible localized `label`; `eg-color-swatch-group` root marker |
| Preset collection | Exclusive, named radio choices in supplied order | RadioGroup Root named by the legend; Item per accepted option | A wrapping row of neutral Material frames, one named radio per frame |
| Preset patch and label | Show the actual color and its identifying name | Decorative `span` plus visible text | Validated color patch is `aria-hidden`; option `label` names its radio |
| Selected indicator | Distinguish the checked preset without relying on the chosen color | Radix Indicator and decorative check | A token-backed neutral backing and check, independent of the patch color |
| Custom choice | Let the user pick an arbitrary supported color | Sibling native `input type="color"` with associated visible label | Present only for nonblank `customLabel`; browser/OS owns the picker UI |
| Current value | Visibly and accessibly communicate the consumer-accepted value, including non-preset colors | `output`, polite live status | Visible localized group label and accepted hex value; no interactive descendants |

The fieldset/legend relationship also names the RadioGroup via a generated `useId()` relationship. The native input has its own generated id and associated label, not `aria-pressed` or a fabricated checked state. A custom color that is not a preset leaves all preset radios unchecked; the native color control and current-value output communicate the actual choice. Internal IDs are for accessibility, never styling. The only new public marker is `eg-color-swatch-group`; internal part selectors are not a public customization API. `surfaceVariants` may retain its existing `eg-surface` marker. No `asChild`, public subcomponents or interactive nesting.

## 3. Public API

All types and defaults below are **approved**, but not implemented. `ColorSwatchGroupOption` is `{ value: string; label: string; disabled?: boolean }`.

| Prop / event | Type | Required | Default / rule | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | Yes | Non-whitespace | Localized visible legend and accessible name of the preset collection; also prefixes the current-value output. |
| `options` | `ColorSwatchGroupOption[]` | Yes | May be empty | Ordered options. Each `value` is an opaque six-digit sRGB hex color, each `label` is a nonblank localized, meaningful visible color name, and `disabled` defaults to `false`. Values must be unique ignoring ASCII hex case. |
| `value` | `string` | Yes | No default | Authoritative current `#RRGGBB` color, including a color not present in `options`; see invalid input below. |
| `onValueChange` | `(value: string) => void` | Yes | No default | Requests a user-driven change. A preset emits its supplied `value` unchanged; the native input emits the browser-reported valid color unchanged. It never persists or mutates consumer data. |
| `customLabel` | `string` | No | Omitted means no picker | Nonblank localized visible and accessible label for the separate custom input. Blank is treated as absent. Approved scoped naming exception below. |
| `disabled` | native fieldset `boolean` | No | `false` | Disables all preset radios and the custom input; current value remains visible. |
| `className` | native `string` | No | None | Root outer margin, width and parent placement only; no appearance/part override contract. |

Compatible native fieldset attributes, including `id`, `dir`, `aria-describedby` and `data-*`, reach the root; `dir` also reaches the Radix collection. Omit conflicting `children`, `style`, `role`, `aria-label`, `aria-labelledby`, `onChange`, `name` and `dangerouslySetInnerHTML`. No ref, `asChild`, custom renderer, per-part styles, uncontrolled `defaultValue`, `name`, `required` or native form-submission/validation contract is proposed. Consumers serialize and validate form values themselves. TypeScript own props receive English JSDoc and the shared Storybook Controls metadata; inherited native props are not redeclared for metadata.

**Controlled behavior:** the component does not maintain a second committed value. A user action emits a request; the output and checked preset change only when the parent supplies the new `value`. If the parent rejects or delays a request, the last supplied value remains authoritative after the event/render; transient platform picker UI is browser-owned. Incoming prop updates emit no callback. Consumers must not switch controlledness, and must apply their own normalization or persistence in their callback.

**Naming lookup:** reviewed the [canonical registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md) and [lookup workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry) by meaning, name and aliases. Apply approved `accessible-name` / `label` to the group and option labels, `choice-options` / `options` to the visibly labelled option array, `primary-value` / `value` to the selected value (including option values), and `interactive-value-change` / `onValueChange` to user requests. `disabled`, `dir`, and `className` are native fieldset attributes, not new naming conventions. There is no additional new semantic-ID proposal.

The canonical `accessible-name` convention already uses `label`, which names this group; a second independent input needs a distinct localized name. The owner approved the exact scoped exception `{scope: 'ColorSwatchGroup', propName: 'customLabel', reason: 'Names the separate optional native color input while label names the group'}` to `accessible-name` for this component (`odd/tasks/shared-app-theme-specs.md` L2). No registry mutation, broader naming convention change or automatic usage registration is implied; later registry evidence remains pending.

Reviewed existing API evidence: `{path: 'packages/ui/src/atoms/radio-group/types.ts', symbol: 'RadioGroupProps', revision: 'sha256:fe9e083c545a868d340c8e59f7b680eb02ca54f6c4ebd6fe1f3d16b7ca989a5c'}` and `{path: 'packages/ui/src/molecules/select-tile/types.ts', symbol: 'SelectTileProps', revision: 'sha256:d89650be9580591f8543d36e2185121c8047eecec1a4936dcb74602bdaaeb834'}`. `SelectTileOption` was also inspected in that same file. No `ColorSwatchGroupProps` or `ColorSwatchGroupOption` source/hash exists yet; a later authorized implementation must inspect those actual symbols and record their whole-file hash before adding registry usages.

## 4. Behavior

| Initial state / action | Expected result | Event |
| --- | --- | --- |
| Valid `value` matches an accepted preset ignoring hex case | Exactly that preset is checked, including when it is disabled; the output and optional picker reflect the supplied current value. | None |
| Valid `value` matches no preset, with or without a picker | No preset is checked; the visible output shows the supplied color. If present, the picker reflects that value. | None |
| User activates an enabled different preset | Request that preset's original spelling; keep the supplied `value` displayed until the parent updates it. | One `onValueChange(option.value)` |
| User changes the native picker to a different supported color | Request the browser-reported value; after the parent accepts it, show that value and check a matching preset if any. | One `onValueChange(browserValue)` per different valid user change event |
| User reactivates the current preset, or picker reports the same color ignoring case | Keep the current selection; do not toggle it off. | None |
| Parent changes `value` or `options` | Recompute the visible output and matching checked preset, without changing consumer data. | None |
| Option/group disabled | Disabled controls cannot activate; Radix skips disabled radios in arrow navigation, while a disabled selected option remains represented. The group-disabled output remains readable. | None |
| No accepted options | Render no empty radiogroup; the current output and optional custom input remain available unless group-disabled or the current value is invalid. | None |
| Picker dismissed without a changed value | Keep the parent-supplied value. | None |

**Approved validation and boundaries:** accept color strings only if the entire untrimmed value matches `/^#[0-9a-fA-F]{6}$/`: no alpha, shorthand, `var()`, gradients, URLs, CSS declarations or other syntax. For matching and the paint property only, compare/use a lowercase copy; never rewrite the consumer's option, `value` or callback payload. Skip options with invalid colors or blank labels; for duplicates ignoring case, keep only the first valid occurrence, even if disabled. Do not mutate the input array or emit callbacks for skipped entries. Consumers remain responsible for supplying meaningful distinct localized names.

An invalid incoming `value` is a consumer error: show an unselected, visibly empty current-value placeholder (`—`), make no callback and do not pass that string to CSS or the native color input. If the custom input is enabled by `customLabel`, render it disabled until the parent supplies a valid value; any browser-native default shown by that disabled control is not a selected value. A later valid prop update restores it without a callback. A blank required `label` renders no component rather than an unnamed control. These safeguards do not normalize or repair stored data; the consumer owns recovery. Native picker event cadence and picker appearance vary by platform.

## 5. Accessibility

- The visible legend names the fieldset and, by `aria-labelledby`, the Radix radiogroup. Each preset's visible localized color name names its radio; the decorative color patch and check are hidden from accessibility APIs. Radio checked/disabled semantics come from Radix, not a mirrored `aria-pressed` state.
- Radix owns horizontal, looping roving focus: Tab enters the checked enabled radio or the first enabled radio; Left/Right move focus and select the next enabled preset, with direction following `dir`; Space selects the focused radio. Tab leaves the radiogroup for the sibling custom input when available, then the next control. There is no custom arrow/focus implementation or guarantee for Up/Down. No enabled radio means no radio tab stop.
- The native color input has its own nonblank visible label and remains a real keyboard-focusable control; activation, dialog keys, cancellation and focus return are browser/OS-owned. Test the actual supported WebView/browser and screen-reader combinations rather than claiming uniform picker behavior.
- The current-value `output` visibly includes the localized group label and accepted hex; its polite live status communicates parent-accepted updates, including custom values. It does not announce a requested value that the parent has not accepted. The checked state and a check on neutral backing distinguish selection without relying on hue. Use `--shadow-focus` for normal focus and a visible system-color outline in forced-colors mode; do not use an arbitrary swatch color as foreground for names, the check or focus.
- Each enabled radio hit area and custom input target is at least `--space-14` (44.8 CSS px) in both axes; visible patches may be smaller. Verify zoom, wrapping, pointer and forced-colors behavior, contrast and real AT announcements. No reliance on the input's tooltip or color alone.

## 6. Appearance

| Axis | Values / default | Restrictions |
| --- | --- | --- |
| Layout | One horizontal wrapping row of preset choices, then the optional custom control; no public orientation variant | Radix horizontal navigation remains logical across wrapped lines. Labels wrap instead of clipping. |
| Size | Fixed; no size prop | Each hit target minimum `size-14`/`--space-14`; color patch `size-10`/`--space-10`; spacing uses existing token utilities. |
| States | Unchecked, checked, focus-visible, disabled; custom input enabled/disabled | Radix `data-state`/`data-disabled` and native disabled drive Tailwind variants; selection and focus remain independently visible. |

**Material:** compose the existing `surfaceVariants({ tone: 'surface-1', elevation: 1, radius: 'md', padding: 'none' })` for the neutral choice frame; it supplies the existing sheen, light edge and two-layer elevation. The custom picker has a neutral Surface frame and platform-owned native input; no conic rainbow or hand-authored gradient. Give the frame a `--color-border-control` boundary, use `--color-surface-0` behind the decorative selected check and `--color-fg-default` for its ink and labels. The patch alone is a color sample, not a flat replacement for the Material frame. Focus uses `--shadow-focus` outside the patch; forced-colors uses a system outline. Use token-backed CVA in `types.ts`, compose each part through `cn()`, and use Radix/ARIA/data variants rather than mirrored state classes. Group/option disabled presentation follows the existing `.45` opacity and no-activation rule; reduced motion removes transitions/transforms. There is no floating overlay or transparency to fall back from; the native dialog is platform-owned.

Existing source evidence: `packages/tokens/src/theme.css:102-103` documents `--color-border-control` at 4.33/4.04/3.68/3.21:1 against surface-0/1/2/3; `:166-173,359-370,440-445` supplies surfaces, focus, Material shadows and the two dimensions. `--color-fg-default` is white and surface-0 is graphite (`:72-73,154-167`). These are existing dark-theme tokens, not proof of the final rendered contrast. Required ≥3:1 control/selection/focus contrast and ≥4.5:1 text contrast must be measured on the actual supported surface-0…3 frames, including selected, focused and forced-colors states. Consumer-supplied patch colors may equal any surrounding color; the neutral boundary and check, not the patch, must remain distinguishable. Other host surfaces require their own proven contrast; do not claim all arbitrary contexts pass.

### Approved bounded swatch-color exception

**Question:** how can a consumer-supplied swatch color be painted without violating the no-inline-appearance rule?

- Token-only named presets cannot represent the arbitrary custom colors requested by both consumers. Direct `style={{ backgroundColor: color }}`, dynamically interpolated utility strings, or an unrestricted CSS variable would broaden inline appearance. **Approved:** the following single-purpose exception, analogous in scope to Gauge numeric geometry and PreviewFrame zone geometry.
- In static CVA source, use exactly `bg-[color:var(--eg-swatch-color)]` on the decorative preset-patch element. Only after the full six-digit hex validation in section 4, set its inline custom property `--eg-swatch-color` to the validated lowercase hex. Use no fallback derived from untrusted input. Invalid/duplicate options have no patch and never reach a CSS declaration. This patch has no text, icon, focus ring, border or Material shadow.
- The approved exception is recorded in `AGENTS.md` beside the Gauge and PreviewFrame exceptions: ColorSwatchGroup's aria-hidden preset patch alone may use the single static `bg-[color:var(--eg-swatch-color)]` utility, with an inline `--eg-swatch-color` only after validating an opaque six-digit hexadecimal sRGB color. No other inline appearance, CSS expressions, dynamic utility interpolation, parts or components are authorized.
- The picker remains a native input; its platform-rendered color is not another inline CSS exception. The color is user data, not a new design token. This exception does not authorize runtime theming, arbitrary color props elsewhere, or new token values. Build and packed-consumer checks must prove the static utility is emitted and works without a consumer Tailwind compiler.

### Token confirmation table

**Approved:** no new or changed tokens. Existing tokens above cover the approved neutral frame, sizing and focus; runtime swatch values are consumer data, not token proposals. Existing tokens are not being submitted for reconfirmation.

| Proposed token name | Value / primitive reference | Role | Light / dark | Contrast evidence against intended surfaces |
| --- | --- | --- | --- | --- |
| None | Not applicable | Not applicable | Existing dark theme only | Not applicable to additions; existing-token limits and required measured checks are stated above. |

**Class composition:** root `className` merges last through `cn()` only for margins, width and parent placement; no part overrides or blanket appearance precedence. `twMerge` does not resolve every selector, layer or token conflict. Test the supported merges and the invariant that callers cannot rely on overriding the swatch paint through this API.

**Files, in the implementation plan under the same delegation:** six meaningful files: `types.ts` (own props/JSDoc and static CVA), `useColorSwatchGroup.ts` (validation, derived parts and request handling), `ColorSwatchGroup.tsx` (JSX-only composition), `ColorSwatchGroup.test.tsx`, `ColorSwatchGroup.stories.tsx`, and `index.ts` (named component/types). **No stylesheet** and no additional internal modules are proposed. No new dependency is needed.

### Expected-design visual reference

| VIS ID | Scenario / source | Status / provenance and conditions |
| --- | --- | --- |
| VIS-01 | Pending: named preset row, selected state and custom picker on surface-1 | No real source/capture yet; source version, viewport, DPR, browser/version, theme, fonts, motion/transparency, crop, date, hash and scoped approval pending. |
| VIS-02 | Pending: custom non-preset value, focus and wrapped/disabled choices | Same provenance and conditions pending; include a forced-colors observation separately. |

**Recommended:** agree on an authorized real source and scenarios, capture component zones following the [visual guide](../../../design/README.md), and obtain scoped approval identifying the images and hashes. No capture has been made and visual conformity is **Not evaluated**. Captures do not replace interaction, contrast or accessibility tests.

## 7. Acceptance criteria

All checks and stories are planned, not observed. Public-interface behavior tests must assert callbacks and unchanged consumer state as well as the rendered result.

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | Group, radios and optional native picker have distinct nonblank localized names; option labels remain visible. | Role/name/label tests; browser and AT inspection. | Presets and Custom; VIS-01. | Pending |
| AC-02 | Enabled preset click/Space and horizontal arrows request the correct value, loop, skip disabled options and never clear a selected radio. | Real Radix keyboard/focus and callback tests, including RTL and wrapped row. | Keyboard and Wrapped; VIS-02. | Pending |
| AC-03 | A preset or custom request emits the correct unchanged payload; parent rejection/delay leaves output, checked state and stored consumer value unchanged; prop updates emit nothing. | Controlled harness with parent acceptance/rejection, callback counts and immutable input assertions. | Controlled. | Pending |
| AC-04 | A custom value is visible and politely communicated after acceptance; non-preset values leave all radios unchecked; a custom match checks the matching preset case-insensitively. | Native input event tests, output/role assertions and real browser/AT check. | Custom; VIS-02. | Pending |
| AC-05 | Missing/blank `customLabel` omits the picker; no valid options omits the empty radiogroup; current value and any available picker remain usable. | Public DOM/keyboard tests for each boundary. | EmptyOptions and NoCustom. | Pending |
| AC-06 | Disabled group and option block activation/callbacks, preserve current selection and display, and expose native/Radix disabled state. | Disabled click/keyboard/input tests and focus order. | Disabled; VIS-02. | Pending |
| AC-07 | Invalid/unsafe values, blank labels and case-insensitive duplicates follow section 4; no invalid CSS reaches a patch or native picker and consumer input is unchanged. | Table-driven public tests for malformed hex, CSS injection, duplicates, empty label, invalid current value and recovery. | InvalidInput. | Pending |
| AC-08 | Valid varied dark, bright and matching-host colors paint only the decorative patch with the static utility; no consumer color paints text, selection or focus. | Inspect computed browser CSS and static generated utility, including packed consumer without Tailwind; source/style safety assertions. | ColorExtremes; VIS-01/02. | Pending |
| AC-09 | Selection has a non-color check; neutral frame, text and focus meet the stated contrast and target dimensions, including forced colors, zoom and reduced motion. | Browser computed contrast/geometry and keyboard/forced-colors checks on surface-0…3; manual AT. | States and Wrapped; VIS-01/02. | Pending |
| AC-10 | Surface Material and existing RadioGroup/SelectTile public behavior and markers remain unchanged. | Existing control regressions, supported class-merge tests and package export checks. | Comparison; visual references pending. | Pending |
| AC-11 | Props, native restrictions, proposed marker, no form/ref/asChild API, six-file roles and no stylesheet are honored. | Positive/negative type tests, docgen/Controls, CSS scanning and React 18/19 packed-consumer checks. | Autodocs; no visual capture required. | Pending |
| AC-12 | No token or dependency is added, and no consumer persistence or reset is changed. | Manifest/token/consumer diff review in separately authorized integration. | ConsumerControlled example. | Pending |

**Dependencies and migration:** #416 is independent of #415 and #425; consumers may later supply colors from #415's runtime-accent work, but this component neither requires nor assumes any future accent token. In the batch, #426 and #415 depend on #425, and #418 depends on #415. Replacing Nexo/Quorb controls is separate work: verify each consumer's actual colors meet this proposed hex contract, provide translated visible names/custom label, preserve its normalization/persistence/reset, and explicitly review the change from individual `aria-pressed` buttons to radio semantics. No application migration is authorized here.

### Spec closure

- [x] Owner approves the cataloging, API, validation, native picker, scoped naming exception and bounded color-paint exception (L2).
- [ ] Real visual source, conditions, hashes and scoped visual adoption are recoverable; visual conformity is evaluated separately.
- [ ] Snapshot digest and later registry usage evidence are finalized; no broader naming convention approval is implied.
- [ ] Planned behavior, accessibility, contrast, build and packed-consumer checks are run in the implementation work.

**Next step:** prepare the implementation plan under the same delegation and obtain the missing visual source and evidence. No token/dependency change, consumer migration or external write is implied.
