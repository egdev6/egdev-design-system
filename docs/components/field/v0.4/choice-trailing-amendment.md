# Field v0.4 — trailing choice amendment

- **Status:** Approved — 2026-11-16 (owner, in session; proposal egdev-ds-nexo-adoption-v1). Implementation plan requires separate approval.
- **Amends:** [Field v0.1](../v0.1/implementation.md), [v0.2](../v0.2/message-amendment.md) and [v0.3](../v0.3/counter-row-amendment.md); unmentioned promises remain unchanged. Request: [#411](https://github.com/egdev6/egdev-design-system/issues/411).
- **Approval / recovery:** Owner session 2026-11-16, proposal egdev-ds-nexo-adoption-v1; this spec is not an implementation authorization. Separate plan approval is required.
- **Snapshot identity:** `version: v0.4`; `contentSHA256: Pending`; `visualHashes: Pending`; `approvalReference: owner session 2026-11-16; proposal egdev-ds-nexo-adoption-v1`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/84`; `latestPublishedComment: Pending`. This amendment is unpublished. Before publication, hash the UTF-8 payload from `## 1. Purpose and scope` through EOF, with LF line endings and its final newline. The spec is approved without captures; visual hashes remain pending.

## 1. Purpose and scope

Propose a text-first row for one consumer-owned Switch or Checkbox, with a visible label and optional description before a trailing control. No form framework, business state, new control, atom API or whole-row click promise. The owner-provided #411 report also identifies a separate checkbox that can already use control-first Field.

**Cataloging:** variant of the existing `@egdev/ui` Field molecule, which coordinates the label, control and messages. Reuse alone supplies `layout="choice"` but puts the control first; separate labelled atoms would duplicate Field's relationship work. No extraction or new component is needed. The public barrel exports Field, Switch and Checkbox; inspected `packages/ui/src/molecules/field/{types.ts,useField.ts,Field.tsx}` and the Switch/Checkbox sources. The existing choice layout, tested label activation and Slot wiring are implementation evidence, not evidence that the new layout exists.

## 2. Anatomy and composition

| Part | Responsibility / element | Content |
| --- | --- | --- |
| Root | Existing native `div`, `eg-field` | Text column and one slotted control; no extra focus stop |
| Text | Native Label via `@radix-ui/react-label`; optional FieldMessage paragraph | Label first, hint or replacing error beneath; neither wraps the control |
| Control | Existing Switch or Checkbox via `@radix-ui/react-slot` | One Radix-owned button with its existing internal parts |

In the proposed layout, DOM and logical visual order are label, message, control. The label and message occupy the inline-start text column; the control occupies inline-end across those rows. Logical start/end follow inherited `dir`. Keep `eg-field`, `eg-label`, `eg-field-message`, `eg-switch` and `eg-checkbox` where their existing parts render. No new public part markers are proposed.

## 3. Public API

| Prop | Type / required | Default and proposal |
| --- | --- | --- |
| `layout` | `FieldLayout = 'stacked' \| 'choice' \| 'choice-trailing'`; optional | Existing default `stacked`; add opt-in `choice-trailing` for Switch or Checkbox. `choice` remains control-first. |
| `label`, `children`, `hint`, `hintTone`, `error`, `hideLabel`, `counter`, `readout` | Existing `FieldProps` types and requiredness | Unchanged; the new layout follows choice rules, including omission of counter and readout. |

**Naming:** lookup by meaning, name and aliases in the [registry source](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md): reuse approved `label-layout` / `layout`; no new prop or exception. The owner approved the Field `choice-trailing` value (owner session 2026-11-16, proposal egdev-ds-nexo-adoption-v1). Field usage is `FieldLayout = 'stacked' | 'choice' | 'choice-trailing'`. Reviewed baseline source: `{ path: 'packages/ui/src/molecules/field/types.ts', symbol: 'FieldProps', revision: 'sha256:319d68639ac0029bda15d741a09e399405be9a39eb9e60e7b346e78e7df48f45' }`; this hash identifies the existing source, not a future implementation. Add the registry usage/value evidence and updated reviewed source revision in the implementation PR, not here.

Native root div attributes and root `className` continue to reach Field's root. Field has no ref or `asChild`; the child keeps its own ref through Slot. Controlled/uncontrolled checked state and callbacks stay on the supplied control. No default, export, existing layout, marker or legacy CSS is changed.

## 4. Behavior

| Action / state | Proposed result |
| --- | --- |
| Click the enabled visible label | Its associated control toggles once; a controlled child only changes when its owner accepts the callback. Blank root space is not an activation target. |
| Supply hint or error | One message describes the control; non-empty error replaces hint and applies the existing invalid rules. Empty error permits hint; no live announcement is added. |
| Disable the child | Label cannot toggle it; the existing control and Field-owned text parts each dim once, without dimming the root or applying opacity twice. |
| Narrow host / long text | Label and message wrap without covering or shrinking the control; the host must provide room for the control, gap and a usable text column. |
| `hideLabel`, counter or readout | Existing hidden-name behavior remains; counter/readout are omitted as in `choice`. |

The existing child `id` wins, otherwise Field uses `useId`. Preserve Slot's child-first description ordering and deduplication, stable IDs and explicit child `aria-invalid` precedence; with an error, omit the child's invalid attribute or supply `true`/`'true'`, as in the existing contract. Field does not validate values, change control selection or create a second event.

## 5. Accessibility

The native label's `htmlFor` names the actual child button; hint/error is referenced exactly once via `aria-describedby`, alongside any existing child descriptions. There is one tab stop and no wrapper role. Radix and the existing atoms retain keyboard, focus, form, disabled and checked/mixed semantics; Field introduces no keyboard or focus engine. Space activates the focused choice; test the applicable atom's existing Enter behavior rather than generalizing it. Required state stays on the child; groups still need an appropriate consumer-owned fieldset and legend.

For a visible label, propose a coarse-pointer label activation area of at least 44 × 44 CSS pixels when the host provides sufficient width; using only a tall passive root is not proof of a target. The existing `--space-14` is 44.8px. With `hideLabel`, the consumer must provide an equivalent usable target. Browser and assistive-technology checks remain pending.

## 6. Appearance

| Axis | Values / default | Rule |
| --- | --- | --- |
| `layout` | `stacked` (default), `choice`, proposed `choice-trailing` | New choice uses text-first logical columns; existing layouts remain unchanged. |
| State | Child Radix state and existing Field invalid state | No mirrored state classes; focus remains on the control. |

Field itself has no surface paint: Switch/Checkbox keep their token-backed Material well, selected treatment and focus ring; FieldMessage owns its annotation. Use static token-backed CVA utilities and per-part `cn()`, with reduced-motion behavior preserved. **No stylesheet** or extra internal module is proposed; preserve existing legacy CSS. The six existing roles remain `types.ts` (API/CVA), `useField.ts` (derivation), `Field.tsx` (composition), `Field.test.tsx`, `Field.stories.tsx` and `index.ts` (exports). No new token or dependency is proposed; any missing one requires separate confirmation.

For the new layout only, propose a bounded consumer typography surface: a consumer root-scoping class may target the existing `.eg-label` and `.eg-field-message` roots with token-backed font family, size, weight and line-height, without selecting `.eg-switch` internals. For example, `.settings-choice.eg-field .eg-label { font-size: var(--text-body-default); }` is scoped to that Field. This is not general appearance override permission: colors, geometry, control internals and arbitrary parts remain outside it. Existing root `className` otherwise supports outer grid placement, margins and width only, merged last by `cn()`; actual CSS layer/specificity determines scoped rule precedence, not class-string order or `twMerge`. Verify the supported typography example in a built consumer/browser.

### Expected-design visual reference

| ID | Image / scenario | Source / conditions / approval |
| --- | --- | --- |
| VIS-01 | Pending: text-first Switch with label and description; also review Checkbox, disabled and narrow/RTL cases | Expected-design source, version, viewport, scale, browser, theme, fonts, motion/transparency, crop, provenance, hash and owner approval all Pending. |

No capture is produced in this batch. The spec is approved without captures; each Field implementation PR must provide stories and a real capture before merge. Historical Field references in v0.1/v0.2 are not evidence for this new layout. Visual conformity: **Not evaluated**; capture and approval must follow the [guide](../../../design/README.md).

## 7. Acceptance criteria

All checks below are planned, not observed. Stories illustrate behavior and do not replace tests.

| ID | Observable promise | Planned check / story | Evidence |
| --- | --- | --- | --- |
| AC-01 | Opt-in text-first logical order and markers; default stacked and existing choice remain unchanged | Field behavior tests for both atoms and legacy layouts; trailing Switch/Checkbox and existing stories | Pending |
| AC-02 | Label toggles once; controlled state waits for owner; disabled never toggles | Real Radix user-event tests for both children, checked and disabled; controlled/disabled stories | Pending |
| AC-03 | Name, child-first descriptions without duplicates, generated/supplied IDs, error precedence and refs survive, including disabled and controlled children | Public role/name/description, rerender and ref tests for both atoms, including hidden label; hint/error stories | Pending |
| AC-04 | Tab/Space and atom-specific keys retain real Radix behavior, with one focus stop | Keyboard tests on both atoms; browser keyboard/AT follow-up | Pending |
| AC-05 | Long text wraps, logical RTL order holds and the control and coarse-pointer label target remain usable | Narrow/RTL stories and browser geometry/hit testing, including VIS-01 | Pending |
| AC-06 | Scoped token typography reaches only Field text, not control internals; Material, focus and disabled dimming survive | Built CSS consumer and browser cascade/computed-style checks; scoped-typography story | Pending |
| AC-07 | Existing root attributes, supported class merging, choice-only omissions and stacked footer remain unchanged | Focused Field regressions, docgen/Controls and packed React 18/19 consumer checks | Pending |

### Resolved decisions

- “Aprobar las cuatro” — the Field `choice-trailing` value is approved.
- “Sí, validación visual en cada PR” — the spec is approved without captures; the Field implementation PR must provide stories and a real capture before merge.

### Remaining open decisions

- Confirm logical ordering and the single-control scope; `choice` remains unchanged.
- Approve or narrow the token-only typography selector surface and coarse-pointer target proposal, including hidden-label responsibility.
- Supply and approve recoverable expected-design sources and conditions for VIS-01 and the additional states. No visuals are approved yet.

### Planned checks

Review a separate implementation plan; then run the AC matrix, focused regressions, built-CSS/package-consumer and browser/accessibility checks. No code, tokens, dependencies or GitHub writes are authorized by this spec.
