# ColorSwatchGroup — circular accent-picker appearance amendment

- **Version / status:** v0.2 — **Draft — not approved**.
- **Amends:** the [approved v0.1 contract](../v0.1/spec.md) and its [implementation notes](../v0.1/implementation.md). Owner correction L6 broadens this draft beyond the earlier ring-only proposal to the entire default picker anatomy and appearance. This file retains its existing path; the earlier proposal in this file is superseded, not implemented.
- **Approval / recovery:** owner approval of this exact snapshot and the unresolved exceptions below is pending. Spec approval does not authorize an implementation plan, code, tokens, dependencies, consumer migration, or external writes. Request [#465](https://github.com/egdev6/egdev-design-system/issues/465) is not a new canonical component issue.
- **Snapshot identity:** `version: v0.2`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 Pending, VIS-02 Pending, VIS-03 Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/416`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, with LF line endings and a final newline; tracking metadata above it is excluded. Approval must identify the version, final digest, scope and adopted visual hashes.
- **Evidence status:** inspected source and historical Git objects; no v0.2 implementation, test run, browser measurement or capture in this batch. The owner supplied a description of a screenshot; its image bytes, provenance and approval hash were not supplied to this worker.

## 1. Purpose and scope

The owner's correction for #465 is that the **default** should look like the Quorb/Nexo accent picker: a row of approximately 40px circular color samples, no visible option labels, a subtle inset hairline, and a selected circle with a dark surface gap and a 2px `fg-default` outer ring. The separately focusable custom-color control is the last circle in the same row, with a multicolored conic appearance and a central plus badge. Keyboard focus uses a distinct offset `focus-ring` outline. The owner retained “Neutral as the default, no prop” (`odd/tasks/nexo-requests-464-466-specs.md`, S4 and L6); it is not an opt-in variant.

**Visible contract change:** v0.1 promises visible color names, an adjacent visibly labelled native picker, raised Material frames and a checked check. The correction proposes visually hidden option and custom labels, circular samples, rainbow-plus custom control and ring-only selected appearance in normal colors. This changes existing UI without a prop change. Nexo is the sole current consumer **per the request**, not an independently verified census. Its visual tests and settings layout need review in separately authorized work. Keep the controlled API, RadioGroup semantics, native color input and `<output>`; no product preset array, localization, persistence, reset or palette derivation moves into the design system.

**Reuse decision:** amend the existing `@egdev/ui` molecule rather than create another picker. The existing fixed frames and visible labels do not produce the requested appearance; an opt-in variant would not change the default, and consumer internal selectors would bypass the public API. Reuse Radix RadioGroup behavior and the existing named component, not the legacy applications' `aria-pressed` button interaction. The circular sample recipe is a **new, pending component-specific Material/appearance proposal**, not automatic permission to discard the v0.1 Surface recipe or to hand-author shadows or gradients.

### Source-of-truth evidence and discrepancies

- The supplied screenshot description has eight red, orange, yellow, green, cyan, blue, violet and pink circles, plus the final rainbow control; its apparent ~40px size is not a measured CSS-pixel dimension. The examples are consumer data, **not** built-in defaults.
- Quorb at inspected working-tree revision `4e11f5c0939368d025f3a4a596de0e626f8d3e47` renders eight `q-swatch` buttons with accessible labels, plus a native color input and decorative plus (`../quorb/src/Settings.tsx:1675-1684`). The actual rules are `../quorb/src/theme.css:313-325`, imported after the other styles (`../quorb/src/main.tsx:10-13`): 32px circles, 8px flex gap, 2px transparent border, inset 1px hairline, checked white border plus `--shadow-focus`, and a conic rainbow with a black plus. Its selected `--shadow-focus` is **not** the requested neutral outer ring. `../quorb/src/styles.css:546-567` contains different `.s-swatch` rules (26px, 8px gap, another checked/focus treatment), not the `.q-swatch` selectors used by `LookSection`; the inspected `../quorb/src/ds/egdev/components.css` has no `q-swatch` rule. These sources are historical/observed evidence, not permission to copy their CSS or semantics.
- Nexo's pre-adoption parent is `4bf732e81fe027e9371acdede3b873e096cbc412`; `a00831c0acd3cee7aecff3fee105b13e4ebc31bb` replaced its custom picker with `ColorSwatchGroup`. At `4bf732e:apps/hub/src/settings/index.tsx:76-86`, the earlier picker renders labelled `aria-pressed` buttons and a labelled native input with a decorative plus. At `4bf732e:apps/hub/src/settings/settings.css:16-24`, its circles, spacing, inset hairline, white selection ring, focus outline, rainbow and badge are defined. Nexo's badge is **white with a black plus**, whereas the owner-described screenshot says a **dark plus badge**; Quorb uses a black plus without a badge. Do not silently treat those as identical.
- Both apps' example presets are `#ff0036`, `#ff7a00`, `#ffd400`, `#22c55e`, `#00c2ff`, `#3b82f6`, `#8b5cf6`, `#ff3fb4` (`../quorb/src/lib/palette.ts:4-7`; `4bf732e:apps/hub/src/settings/palette.ts:3-5`). They remain consumer-supplied validated data, not new tokens.
- The current package is exported at `packages/ui/src/index.ts:58-59`. `packages/ui/src/molecules/color-swatch-group/types.ts:80-101` uses Surface-framed labelled items, a checked check and `focus-visible:shadow-focus`, with forced-colors `Highlight` outlines. `ColorSwatchGroup.tsx:18-36` renders the radio items, check, separate native input and output. There is currently **no selected double-ring recipe**. These are source observations, not captures.

## 2. Anatomy and composition

| Part | Proposed responsibility / primitive | Contract boundary |
| --- | --- | --- |
| Root / visible group label | Existing `fieldset` and visible `legend`, stable `eg-color-swatch-group` | Remain named as in v0.1; the screenshot's localized heading is consumer-supplied. |
| Preset collection | Named Radix RadioGroup Root with one Item per accepted option | Preset labels remain in the accessibility tree but are visually hidden; only the colored circles are visible. No switch to `aria-pressed` buttons. |
| Preset visual | Circular `aria-hidden` validated color patch and separate non-interactive surround | The surround carries the inset hairline and the checked ring; the patch remains subject to the existing bounded paint exception. |
| Selection | Neutral surface gap and 2px `fg-default` outer ring on the selected circle | The screenshot-faithful proposal omits the old visible check in normal colors. Its conflict with the v0.1 non-color-check promise and project rule remains an explicit decision below; forced-colors needs an independently discernible selected cue. |
| Custom choice | Separately named native `input type="color"`, visually represented as a rainbow circle with a central decorative plus badge | It remains a sibling of the radiogroup, but visually follows the presets in the same wrapping row. The actual native input is keyboard and pointer operable; the plus is not a separate button. |
| Current value | Existing visible, polite native `<output>` | Keep its accepted-value text and announcements, including non-preset values. |

A shared visual row must not erase the RadioGroup's accessible name or change its native relationships; no interactive control is nested in a radio. Radix owns radio focus and checked state; the browser/OS owns picker activation and dismissal. No `asChild`, public part override, additional component export or new keyboard engine is proposed.

## 3. Public API

**No new or changed prop, event, default value or export.** Only the default visual contract and presentation of existing labels change.

| Existing prop / event | Type / requirement | Rule |
| --- | --- | --- |
| `label` | `string`, required | Nonblank localized, visible legend and radiogroup name; prefixes the unchanged output. |
| `options` | `ColorSwatchGroupOption[]`, required | Ordered `{ value: string; label: string; disabled?: boolean }` data; option labels remain required, meaningful and accessible, but are visually hidden in the proposed default. |
| `value` | `string`, required | Authoritative controlled `#RRGGBB` color; no default. Case-insensitive matching remains. |
| `onValueChange` | `(value: string) => void`, required | Requests a user change with the supplied preset spelling or browser-reported valid color; no normalization or persistence. |
| `customLabel` | `string`, optional | Nonblank localized accessible name for the separate native picker; omitted or blank still omits it. Its visible text is hidden in the proposed circular look. |
| `disabled`, `className` | Native fieldset attributes, optional | Disabled retains accepted output; root `className` supports outer margin, width and parent placement, not arbitrary paint or internal-part overrides. |

The v0.1 fieldset forwarding restrictions, `dir`, controlled-only contract and absence of ref, `asChild`, `defaultValue`, native form-submission, custom renderer and public parts remain. A caller's `options` and event payloads are not rewritten. React peer compatibility remains a planned consumer check, not a type-only inference.

**Prop-naming lookup:** reviewed the [registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md) and [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry). Existing IDs are `accessible-name` → group/option `label`, `choice-options` → `options`, `primary-value` → group/option `value`, and `interactive-value-change` → `onValueChange`. The separately approved `exception:accessible-name:ColorSwatchGroup:customLabel` remains scoped to the native input ([record](../v0.1/prop-naming-approval.json)). No new own prop, semantic-ID proposal or naming exception is introduced. Reviewed source: `{ path: 'packages/ui/src/molecules/color-swatch-group/types.ts', symbols: 'ColorSwatchGroupProps and ColorSwatchGroupOption', revision: 'sha256:6e52ed0be8db660730c84b1cd9d1cf0ed7bc974dc75947a24854c0bafdcf71c4' }`. This is a whole-file working-tree hash, not a Git revision or new convention approval.

## 4. Behavior

The following maps the requested visual treatment onto the existing controlled-value contract. The custom-selection mapping is a recommendation awaiting owner confirmation; it is not a new radio state or an implemented behavior.

| Initial state / action | Proposed visible result | Event |
| --- | --- | --- |
| Accepted valid `value` matches an accepted preset ignoring case | Exactly that preset is checked and gets the neutral double ring, including a disabled selected preset. When present, the native input may hold the same color but does not get a second selection ring. | None. |
| Accepted valid value matches no preset and custom input exists | No preset is checked; the rainbow custom circle gets the same neutral selection ring. The visible output and native input retain the accepted color; the rainbow itself does not show the actual chosen color. | None. |
| Non-preset value with no custom input | No preset ring and no custom control; output still displays the accepted value. | None. |
| Invalid current value | No selection ring; output shows `—` and the optional native input is disabled until a valid value is supplied, as in v0.1. | None. |
| User requests a preset or custom color; parent accepts, delays or rejects | Ring and output move only with an accepted `value` prop; reactivation of the same color does not clear it. Inputs/options and consumer state are not mutated. | Existing `onValueChange` payload/count only; no event for a prop update or decorative ring. |
| Focus changes or control is disabled | Focus is independently indicated; selection remains represented even when disabled. Disabled activation makes no request. | None from focus/disable alone. |
| Empty or invalid options / blank custom label | Keep v0.1 filtering, first-valid case-insensitive duplicate, blank-label, omitted-picker and empty-radiogroup rules; a valid custom value still uses the custom control when available. | No callback from filtering or prop changes. |

Option order, exact colors, labels, validation, browser-native picker event cadence, output contents, live-region behavior, consumer serialization and reset remain unchanged. The same-row proposal does not mandate one unbroken line at widths where items cannot fit; visual wrapping must preserve order and reachable focus.

## 5. Accessibility

Keep the fieldset/legend and radiogroup names, Radix checked/disabled semantics, case-insensitive controlled selection, generated ID relationships and each option's required accessible name. `sr-only` is an existing project utility pattern (`packages/ui/src/atoms/stat/types.ts:83-84`); a visually hidden text label or equivalent accessible name must stay exposed, not use `display: none` or `aria-hidden` on the name. The custom input has its own nonblank accessible name and stays a real native input, not a fake radio or plus button; no `aria-checked`, `aria-pressed`, new tab stop or announcement is added. The decorative plus and sample patches are hidden from assistive technology. The current-value output remains visible and polite.

Radix retains horizontal looping arrows, disabled skipping, Space, `dir` and Tab navigation; Tab reaches the sibling custom picker after the group. Test accepted/rejected value requests and actual focus order, including RTL, wrapping and native picker behavior. Do not rely on color alone: the selected circular outline, checked semantics and accepted-value text are distinct information, but **whether these satisfy the project rule requiring an icon or text for state, without the v0.1 visible check, is unresolved**. The screenshot-faithful no-check proposal requires explicit owner resolution; do not silently claim a policy exception.

The visible circle and actual activation box are different concepts. v0.1 already requires `--space-14` (44.8 CSS px) hit areas for both control kinds (`docs/components/color-swatch-group/v0.1/spec.md:95-96`); #431/#452 are related touch-target context, not permission to shrink them. Recommended for review: approximately 40px **visual** circles inside non-overlapping at-least-44.8px actual activation targets, including coarse pointers and hybrids; browser-measure both axes and spacing. The precise visual diameter and target policy remain owner decisions, not an approval to lower the v0.1 target.

Normal focus uses a visible offset `--color-focus-ring` outline separate from the selection ring; the two must be simultaneously visible without clipping. In forced colors, shadows/gradients may disappear: preserve a system-color selected cue and a separately located or patterned focus outline, distinguishable even if system colors coincide. Any forced-colors fallback check is decorative and does not change the radio or input semantics. Verify zoom, label discoverability, focus-only/selection-only/both, native picker keyboard behavior and actual contrast in real browsers and assistive technology; no such results are claimed here.

## 6. Appearance

| Axis | Proposed default | Restrictions |
| --- | --- | --- |
| Preset / custom visual | Circular samples in one wrapping row; custom rainbow-plus last | No visible individual option/custom label, but their accessible names remain. No built-in eight-color palette or size prop. |
| Selected | Surface-colored gap followed by a 2 CSS px `fg-default` ring | Preset or selected non-preset custom circle; state remains distinct from keyboard focus. |
| Focus-visible | Offset `focus-ring` outline on the actual focused control | Coexists with selection; forced-colors fallback cannot rely solely on shadows or hue. |
| Size / disabled | Approximately 40px visible diameter proposed; actual target at least 44.8px is recommended | Exact diameter, spacing and coarse-target decision below; preserve disabled selection and inactive behavior. |

### Evidence-to-token and rule mapping

Exact legacy values below are **source evidence**, not instructions to introduce literals or unapproved recipes. Candidate utilities are existing-role mappings, subject to actual CSS build and owner decisions; token existence is not evidence of visual parity.

| Visual property | Exact inspected source | Existing `@egdev/tokens` role / utility, or explicit gap |
| --- | --- | --- |
| Size / shape | Quorb `.q-swatch`: `32px` × `32px`, `border-radius: var(--radius-full)` (`../quorb/src/theme.css:314-320`). Nexo `width/height: var(--space-10)` and `--radius-full` (`4bf732e:apps/hub/src/settings/settings.css:19`); its preceding vendored DS was at `846c0d6`. The owner's described screenshot is approximately 40px, without measurement. | `--space-10: 32px`, `--space-12: 38.4px`, `--space-14: 44.8px`, and `--radius-full` exist (`packages/tokens/src/theme.css:362-363,453-458`); candidate `size-12 rounded-full` visual inside `min-w-14 min-h-14` target is close, not identical or approved. Owner must choose visual/target geometry. |
| Row / gaps | Quorb `display:flex; flex-wrap:wrap; gap:8px` (`../quorb/src/theme.css:313`); Nexo flex-wrap and `gap:var(--space-3)` (`4bf732e:apps/hub/src/settings/settings.css:18`). | `gap-3` → `--space-3:9.6px`; `gap-2` → `--space-2:6.4px` (`packages/tokens/src/theme.css:439-442`). Neither is Quorb's literal 8px. Choose Nexo spacing, another approved role or propose a missing role; measure non-overlapping hit boxes and focus. |
| Unselected boundary | Both use `border:2px solid transparent` and an **inset full-circle** `1px` `--color-border-hairline-strong` shadow (`../quorb/src/theme.css:318-320`; `4bf732e:apps/hub/src/settings/settings.css:19`). | `--border-width:1px` and `--color-border-hairline-strong` (white 14%) exist (`packages/tokens/src/theme.css:189-192,469-470`); the hairline is decorative, not a proven 3:1 control boundary. `--shadow-edge-strong` is only a top edge (`:380-381`), not this full inset ring. A compliant full-circle recipe/role needs separate approval. |
| Selected double ring | Nexo selected rule is `border-color:var(--color-fg-default); box-shadow:0 0 0 2px var(--color-surface-1), 0 0 0 4px var(--color-fg-default)` (`4bf732e:apps/hub/src/settings/settings.css:20`): 2px surface gap and 2px outer band. Quorb instead uses `--shadow-focus` (`../quorb/src/theme.css:323`); S4 overrides that red focus-like selection. | `--color-surface-1` and `--color-fg-default` exist (`packages/tokens/src/theme.css:72-73,168-169`), candidate `surface-1` gap and `fg-default` outer ring. No generic selected-ring width/gap or full double-ring shadow role is established by the inspected tokens. Confirm bounded geometry-role reuse or a new semantic role and recipe; no handwritten shadow is authorized. |
| Focus | Nexo uses `outline:2px solid var(--color-focus-ring); outline-offset:5px` for focused preset and focused-within custom (`4bf732e:apps/hub/src/settings/settings.css:21`). | `--color-focus-ring`, `--focus-width:2px` and `--focus-offset:2px` exist (`packages/tokens/src/theme.css:94-95,474-477`). The existing offset is **not** Nexo's 5px; neither reuse nor a new offset role is approved here. Measure contrast against surface-0…3 and separation from selection. |
| Custom rainbow | Both use `conic-gradient(red, yellow, lime, cyan, blue, magenta, red)` (`../quorb/src/theme.css:324`; `4bf732e:apps/hub/src/settings/settings.css:22`). | No rainbow/conic picker role was found in `packages/tokens/src/theme.css`; existing button/Material gradients are not equivalent. A candidate named spectrum token or explicitly approved component recipe/asset needs owner confirmation. The no-handwritten-gradients rule remains in force. |
| Native input overlay | Quorb uses `position:absolute; inset:0; opacity:0; cursor:pointer` (`../quorb/src/theme.css:325`); Nexo additionally sets `width:100%; height:100%` (`4bf732e:apps/hub/src/settings/settings.css:23`). | Standard static `absolute`, `inset-0`, `size-full`, `opacity-0` and `cursor-pointer` utilities are candidates, not color tokens. The actual input must retain its accessible name, focus and activation box; an invisible passive wrapper is not a touch target. Check no clipping or occlusion in real browsers. |
| Plus and badge | Quorb centers a black `+`, weight `800`, with no badge (`../quorb/src/theme.css:324`; `../quorb/src/Settings.tsx:1681-1683`). Nexo centers a `--space-5` × `--space-5` full-radius **white** badge, black `+`, weight `800`, line-height `1` (`4bf732e:apps/hub/src/settings/settings.css:24`). The owner describes a **dark** badge. | `--space-5:16px`, `--radius-full`, `--color-surface-0`, `--color-fg-default` exist (`packages/tokens/src/theme.css:445-446,362-363,166-167,72-73`). Existing decorative `Icon` supports `plus` and `sm` (`packages/ui/src/atoms/icon/types.ts:45-47,87-92`). Proposed dark `surface-0` badge with `fg-default` plus is **not** the historic Nexo color pairing; confirm screenshot, glyph/badge geometry and contrast. |
| Per-option color / naming | Nexo and Quorb use the supplied eight colors above and accessible names (`4bf732e:apps/hub/src/settings/index.tsx:76-85`; `../quorb/src/Settings.tsx:1675-1684`). | Dynamic preset data is not a token. Existing validated patch-only `bg-[color:var(--eg-swatch-color)]` and visually hidden names are candidates; the circular role/exception question below must be resolved before implementation. |

**Existing color exception is not widened by this draft.** Under `AGENTS.md` and v0.1, only an `aria-hidden` decorative **preset patch** may receive the single static `bg-[color:var(--eg-swatch-color)]` utility and the inline custom property after validating opaque six-digit hex. Its paint may not escape to names, icon, indicators, focus or other parts; do not use direct inline color, dynamic class interpolation or unvalidated CSS. Ask the owner whether a circular decorative preset patch with a separate non-patch surround remains within that exception unchanged. The rainbow is a separate static appearance and must not use the consumer color variable or pretend to be covered by the exception.

**Material / files:** replacing the v0.1 raised neutral Surface frames with circle-only paint is a changed Material composition. The inset/selection/focus and rainbow-plus combination is proposed as a bounded recipe requiring explicit spec/plan approval, not a general flat-control exception or a clone of legacy Surface classes. Preserve reduced-motion, disabled and forced-colors behavior. Retain the six meaningful existing component files and root-layout-only `className`; **no stylesheet** or additional internal module is proposed unless separately specified and approved. No token, dependency or global CSS change is authorized now. The later plan must prove the approved static utilities are included in built CSS and work for packed consumers without Tailwind.

### Expected-design visual reference

No image was created in this batch. The owner-provided screenshot **description** supplies intent, but the actual image, source, viewport, scale, browser, fonts, theme, date, hash and scoped approval are not recoverable here. The historical v0.1 observed images and the current Storybook implementation are not approved v0.2 expected design. **Visual conformity: Not evaluated.**

| Visual ID | Proposed component-zone scenario / English alt | Source / status |
| --- | --- | --- |
| VIS-01 | Pending: named group with red, orange, yellow, green, cyan, blue, violet and pink circles, red selected and the rainbow-plus custom circle last. | Owner-described screenshot and Nexo/Quorb code are intent/evidence only; real v0.2 reference and approval pending. AC-01–04. |
| VIS-02 | Pending: non-preset custom selection; selected preset, unselected preset and custom controls with separate keyboard focus. | Real component-zone reference and capture pending. AC-04–06. |
| VIS-03 | Pending: focused and selected states in forced colors, including disabled and wrapped layouts. | Real browser/AT observation and visual adoption pending. AC-06–09. |

Agree on the source and version, viewport, DPR, browser/version, theme, fonts, motion/transparency, crop and tool/date for each; obtain a real capture and SHA-256 and scoped approval following the [visual guide](../../../design/README.md). Do not infer token values from pixels; captures do not replace behavior, contrast, target-size or accessibility tests.

**Current Storybook baselines**, from `packages/ui/src/molecules/color-swatch-group/ColorSwatchGroup.stories.tsx:33-38,59-66,110-136` (the old, not proposed, look; a running Storybook is parent-owned):

- `?path=/story/molecules-colorswatchgroup--presets` — red checked, visible names and current check.
- `?path=/story/molecules-colorswatchgroup--custom` — non-preset value and labelled native picker.
- `?path=/story/molecules-colorswatchgroup--keyboard` — interactive focus and selection baseline.
- `?path=/story/molecules-colorswatchgroup--color-extremes` and `?path=/story/molecules-colorswatchgroup--states` — sample extremes, custom and disabled states.

## 7. Acceptance criteria

All checks are **planned**, not observed for v0.2. Stories illustrate cases and cannot substitute for behavior or real-browser checks. Any changed existing v0.1 promise requires explicit owner approval.

| ID | Proposed observable promise | Planned behavior / structural check | Planned story / real-browser visual check | Evidence |
| --- | --- | --- | --- | --- |
| AC-01 | Default is a visible legend, wrapping row of unlabeled circular samples, then optional rainbow-plus custom circle; no new prop or built-in palette. | Public export/type/default tests, ordered radios and native input; CSS compilation of approved recipe. | Expand `Presets`/`Custom` with supplied eight-color data; compare component-zone layout and geometry with approved VIS-01. | Pending |
| AC-02 | Every supplied preset keeps its accessible name and `aria-checked` radio semantics; hidden option/custom labels are absent visually but not from accessibility APIs. | Role/name/checked and hidden-label tests; no `aria-pressed`, nested controls or extra tab stop. | Browser accessibility tree and manual AT, including long localized names; VIS-01. | Pending |
| AC-03 | Every circle has a decorative inset hairline; selected preset gets the surface gap and 2px neutral outer ring, including red, dark, white and host-matching samples. | State and patch-safety tests; generated CSS includes only approved token roles/recipes. | `Presets`/`ColorExtremes`; measure inset, gap, ring color/width and 3:1 non-text contrast on supported surfaces; VIS-01. | Pending |
| AC-04 | A valid non-preset selects the custom indicator; case-insensitive preset matches select the preset only; absent/blank custom, empty options, disabled selected and invalid/recovery states follow section 4. | Public controlled-state/output/input and callback tests for each boundary, with unchanged consumer data. | Expand `Custom`, `EmptyOptions`, `Disabled`, `InvalidInput`; browser comparison of custom and preset rings; VIS-02/03. | Pending |
| AC-05 | Custom is a multicolor circle with centered decorative plus badge; native input remains named, pointer/keyboard operable and controls the unchanged output. | Input/name, plus `aria-hidden`, pointer/keyboard activation, parent acceptance/rejection and callback tests. | Browser checks for actual input hit area, native picker, palette/badge and output; VIS-01/02. | Pending |
| AC-06 | Offset focus is distinguishable simultaneously from selected state on preset and custom, including forced colors, without clipping. | Focus-target/keyboard tests and no new ARIA state; compiled focus/forced-colors utility checks. | Browser focus-only/selection-only/both and system-color tests, including zoom and wrapping; VIS-02/03. | Pending |
| AC-07 | The agreed approximately 40px visual and at-least-44.8px activation targets are separately measured, non-overlapping and reachable for both control types, including coarse/hybrid pointers. | Structural test of approved size/target utilities; no target shrink hidden by a larger passive wrapper. | Real-browser bounding-box, click-target and coarse-pointer checks; inspect row spacing and clipping; VIS-01/03. | Pending |
| AC-08 | Radix navigation, controlled callbacks, values, output, disabled behavior, validation and color-patch safety remain unchanged. | Public LTR/RTL arrows, Space, Tab, rejected/accepted/repeated requests, filtering, invalid CSS and non-mutation regressions. | `Keyboard`, `Controlled`, `ConsumerControlled`, `RTL`, `InvalidInput`; browser native-input smoke check. | Pending |
| AC-09 | The approved non-color selection solution works in normal and forced colors; no unapproved check removal or rule exception is assumed. | Role/checked and selected-cue tests after owner decision; no additional announcement. | Browser/AT checks of selected versus focused, including disabled selection; VIS-03. | Pending |
| AC-10 | Material/appearance recipe, color exception, token roles and stylesheet boundary are explicitly resolved before implementation; no unauthorized token, dependency, inline appearance or consumer write. | Review approved spec/plan and source/token/dependency diffs; CSS build and packed-consumer check under separate authorization. | Browser comparison to adopted captures; VIS-01–03. | Pending |

### Resolved decisions

- Owner L2/L6: the **default, without a prop**, should follow the circular Quorb/Nexo accent-picker look, with a neutral selected ring and separate focus. The earlier ring-only draft and its assumption that visible labels/frames remain are superseded.
- Keep the Radix RadioGroup semantics, native custom input, `<output>`, consumer-owned data and public API. Nexo is the only current consumer according to the request.
- This is a draft; neither the visual reference nor implementation plan is approved by documenting these choices.

### Owner decisions — 2026-11-17 (feature log L8)

1. **Visual versus hit area:** a `size-12` (38.4px) circle inside a non-overlapping `size-14` (44.8px) target. Row gap decided after measuring focus and touch spacing in the implementation PR.
2. **Spectrum:** a new named spectrum token (for example `--gradient-spectrum`) with Nexo's seven historical colour stops, added to `packages/tokens/src/theme.css`; confirmed by the owner for this purpose only. No handwritten gradient.
3. **Preset-colour exception:** the validated, `aria-hidden` circular preset patch stays within the existing `AGENTS.md` exception; the inset/selection surround is not inline appearance.
4. **Ring and focus geometry:** a bounded circle-specific recipe; the selection ring reuses existing focus-width geometry with `fg-default`, and focus keeps a distinct offset `focus-ring` outline (3:1 and no clipping verified in the PR).
5. **Selection cue:** ring only, no check badge (faithful to Quorb/Nexo). The ring is a shape cue, RadioGroup keeps `aria-checked`, and forced colors keep the ring visible. The custom control's plus badge is dark, as in the owner screenshot.
6. **Custom selected state:** the same ring marks the custom control when a valid non-preset colour is active.
7. **Visuals:** the owner screenshot ("Color de acento", feature log L6) is the expected-design reference; the implementation PR captures the result in a real browser for owner review.

### Planned checks

After the owner resolves the above and separately approves a plan, run AC-01–AC-10: behavior/accessibility regressions, authorized CSS and packed-consumer checks, browser geometry/contrast/focus/forced-colors/coarse-pointer and native-picker checks, then agreed component-zone captures for owner review. None is represented as passed here.
