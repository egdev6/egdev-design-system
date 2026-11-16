# SelectTile v0.3 — text-only amendment

- **Status: Draft — not approved**
- **Amends:** [SelectTile v0.1](../v0.1/implementation.md) and [v0.2](../v0.2/underline-amendment.md); unmentioned promises remain unchanged. Request: [#413](https://github.com/egdev6/egdev-design-system/issues/413).
- **Approval / recovery:** Pending; this local draft is not an implementation authorization. Separate plan approval is required.
- **Snapshot identity:** `version: v0.3`; `contentSHA256: Pending`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/101`; `latestPublishedComment: Pending`. This amendment is unpublished. Before publication, hash the UTF-8 payload from `## 1. Purpose and scope` through EOF, with LF line endings and its final newline; approval must identify the digest and visuals.

## 1. Purpose and scope

Propose media-less, whole-tile single radio choices for generic text options. Translation and onboarding are consumer-owned; no new selection component, renderer, data source or business flow. The separate settings-row selector reported in #413 is not a dependency of this amendment.

**Cataloging:** an opt-in presentation of the existing `@egdev/ui` SelectTile molecule. RadioGroup has the right single-selection semantics but not a tile; SelectTile already has stretched Radix radio controls and card Material, but absent thumbnails still render a media/fallback region. Reuse alone is insufficient; a SelectTile variant avoids duplicating selection and leaves RadioGroup unchanged. The public barrel exports both; inspected `packages/ui/src/molecules/select-tile/{types.ts,useSelectTile.ts,SelectTile.tsx}` and `packages/ui/src/atoms/radio-group/`. Existing media cards are implementation evidence, not evidence of this proposal.

## 2. Anatomy and composition

| Part | Responsibility / element | Content |
| --- | --- | --- |
| Root | Existing named Radix RadioGroup root, `eg-select-tile` | Ordered options in the existing grid |
| Card | Existing Surface-based `div`, `eg-tile` | Visible label, optional metadata and badge, decorative selected check |
| Control | Existing stretched `RadioGroup.Item` button, sibling of passive content | One radio covering the card, with generated name/description IDs |

The proposed text-only card renders no image, fallback, AspectRatio, media wrapper or media well. The existing label remains visible and names the radio; non-empty metadata and badge remain visible and describe it in that order. A badge, if supplied, appears in the text content rather than a removed media corner. The existing decorative selected check remains visible without obscuring text or badge. No extra tab stops, interactive descendants or public part markers are introduced. Keep existing root, card and inherited `eg-surface` markers.

## 3. Public API

| Prop | Type / required | Default and proposal |
| --- | --- | --- |
| `variant` | New, optional: single branch `'default' \| 'text-only'`; multiple branch `'default'` only | `default` preserves current media cards; `text-only` is explicitly opt-in and scoped to `type='single'`. Unsupported untyped multiple/text-only combinations have no promised behavior. |
| `type`, `label`, `options` | Existing discriminated API; all required as today | Unchanged: single is a named radio group; each option has a unique non-empty value and label. |
| `ratio`, option `thumb` | Existing optional types | Their media geometry and image are ignored in `text-only`; default media behavior, including fallback/error retry, is unchanged. |
| `value`, `defaultValue`, `onValueChange`, `name`, `required`, `disabled`, `dir` | Existing single-branch types/defaults | Selection, form participation, direction and state remain unchanged. `meta`, `badge`, `live` and per-option disabled remain supported. |

**Naming:** lookup by meaning, name and aliases in the [registry source](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md): reuse approved `visual-treatment` / `variant`; proposed SelectTile usage is `'default' | 'text-only'` for single and `'default'` for multiple. No new semantic ID or exception. Reviewed baseline source: `{ path: 'packages/ui/src/molecules/select-tile/types.ts', symbol: 'SelectTileProps', revision: 'sha256:2001f548d120e05600a886f8fed3d3632456b5bc0c211a84dcc7fda4836511be' }`. This hash identifies the existing symbol, which does not yet declare `variant`; add the reviewed usage and future revision only during separately authorized implementation. Convention approval is independent of approval of this amendment.

Root native div attributes and `className` retain their existing restrictions. No ref, `asChild`, custom card renderer or option API change is proposed. Existing multiple-mode toggles and media presentation are unaffected. Controlled `value` remains authoritative; `defaultValue` initializes uncontrolled state only, and incoming prop updates emit no callback.

## 4. Behavior

| Action / state | Proposed result |
| --- | --- |
| Click anywhere on an enabled text tile or press Space on its radio | Radix selects it once; reactivating the selected radio does not clear it. |
| Use horizontal arrows | Radix moves focus and selects the next enabled option, looping with the existing LTR/RTL direction; Home/End retain existing focus-only behavior. Enter does not activate or submit. |
| Controlled value | User interaction requests `onValueChange`; the visual/ARIA selection remains the supplied value until the owner changes it. |
| Disabled option or group | Selection is retained, disabled controls cannot be focused or activated, and each card dims once. |
| Missing or supplied thumbnail; supplied ratio | Text-only renders no media, whether or not thumbnail data exists; ratio does not reserve space. Existing default behavior is unchanged. |
| Empty options / long text | Named empty group has no radio or focus stop; labels and metadata wrap. Consumers choose root columns through the existing layout-only `className`; no automatic breakpoint is introduced. |

`live` remains independent of selection; at most one option may be live and it requires the existing non-empty badge. No validation, pruning, auto-selection or notification on prop updates is introduced.

## 5. Accessibility

Retain a named `radiogroup`, one uniquely named radio per option and generated, instance-unique relationships: visible label provides `aria-labelledby`; non-empty metadata and badge appear once each in `aria-describedby`. Radix owns radio state, roving focus, keyboard and native single-mode form behavior (`name`/`required`); no custom selection or key handler. The stretched native control is the only focus stop on each card; its focus-visible ring must remain visible outside clipping. A decorative check provides a non-color selected cue and remains hidden from accessibility APIs; selection also uses Radix `aria-checked`. Disabled state and labels remain perceivable. Plan at least a 44 × 44 CSS-pixel whole-tile hit target using existing tokens, with narrow-width browser verification; host width must permit a usable target.

## 6. Appearance

| Axis | Values / default | Rule |
| --- | --- | --- |
| `variant` | Proposed `default` (default), `text-only` (single only) | Default retains media; text-only has no media geometry or empty placeholder. |
| Selection / disabled | Existing Radix state | Keep v0.2's no-underline label and decorative selected check; selected treatment wins over hover, live remains independent, focus ring wins. |

Retain the existing `surfaceVariants` card Material and token-backed selected/hover/live treatments; no media well in text-only. Use static token-backed CVA utilities and per-part `cn()`; no handwritten shadows/gradients or inline appearance. Preserve reduced motion and the default presentation's existing fallback behavior. **No stylesheet** or extra internal module is proposed; preserve legacy CSS. The six existing roles remain `types.ts` (API/CVA), `useSelectTile.ts` (derivation), `SelectTile.tsx` (composition), `SelectTile.test.tsx`, `SelectTile.stories.tsx` and `index.ts` (exports). No token or dependency change is proposed; a missing token or package requires separate confirmation.

Root `className` continues to support margins, width, column count and parent layout only, merged last by `cn()`; it is not a part-appearance API. `twMerge` handles known utility conflicts, not arbitrary CSS/cascade precedence. Hosts can use one column when narrow and arrange responsive column utilities under their approved layout policy; the presentation does not infer viewport or change Radix's one-dimensional keyboard model.

### Expected-design visual reference

| ID | Image / scenario | Source / conditions / approval |
| --- | --- | --- |
| VIS-01 | Pending: text-only single group with selected, unselected and disabled tiles; also review focus and narrow/RTL | Expected-design source, version, viewport, scale, browser, theme, fonts, motion/transparency, crop, provenance, hash and owner approval all Pending. |

No capture is produced in this batch. Historical media-card references are not approved expected design for text-only. Visual conformity: **Not evaluated**; capture and approval must follow the [guide](../../../design/README.md).

## 7. Acceptance criteria

All checks below are planned, not observed. Stories illustrate behavior and do not replace tests.

| ID | Observable promise | Planned check / story | Evidence |
| --- | --- | --- | --- |
| AC-01 | Opt-in single text-only renders no media or fallback even with thumb/ratio; label, optional meta/badge and selected check remain | Public DOM/role tests and text-only story; VIS-01 | Pending |
| AC-02 | Whole-tile click, Space, arrow looping/disabled skipping, Home/End, Enter and RTL retain Radix single behavior | Real Radix user-event tests; RTL and keyboard browser checks | Pending |
| AC-03 | Controlled requests wait for owner; uncontrolled initialization and callbacks work; selected radio cannot be cleared by reactivation | Controlled/uncontrolled public tests and stories | Pending |
| AC-04 | Group/option names, descriptions once each, unique IDs, disabled behavior, focus and native required/form values survive | Role/description, disabled, multi-instance and form tests; keyboard/AT browser follow-up | Pending |
| AC-05 | Selected and live cues, non-color check, focus visibility, no underline and single disabled dimming survive | State tests and browser visual/contrast/reduced-motion review; VIS-01 | Pending |
| AC-06 | Long text wraps, narrow host can use one column and whole-tile hit target is at least 44 × 44 CSS pixels | Narrow/RTL stories and browser geometry/hit tests at comparable conditions | Pending |
| AC-07 | Omitted/default variant and multiple mode retain media, fallback/retry, ratios, state, markers, class merge and form restrictions | Existing SelectTile regressions, negative type coverage, docgen/Controls and packed React 18/19 consumer checks | Pending |

### Open decisions for the owner and planned checks

- Approve or revise `variant='text-only'` and the single-only scope; separately decide whether multiple text tiles should ever be proposed.
- Approve or revise ignoring `ratio`/`thumb`, retaining textual badge/live semantics and using consumer-selected responsive columns rather than an automatic breakpoint.
- Supply and approve recoverable expected-design sources and conditions for VIS-01 and its additional states. No visuals are approved yet.
- After spec approval, review a separate implementation plan; then run the AC matrix, focused regressions, built-CSS/package-consumer and browser/accessibility checks. No code, tokens, dependencies or GitHub writes are authorized by this draft.
