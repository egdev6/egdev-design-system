# ButtonGroup v0.2 — compact IconButton target amendment

- **Status:** Approved 2026-11-22 (owner choice in [S8 and L18](../../../../odd/tasks/consumer-request-specs.md)).
- **Amends:** [v0.1 implementation and approved contract](../v0.1/implementation.md), canonical issue [#79](https://github.com/egdev6/egdev-design-system/issues/79), with [v0.1 approval](https://github.com/egdev6/egdev-design-system/issues/79#issuecomment-6251489483). Unmentioned promises remain unchanged.
- **Approval / recovery:** Owner choice verbatim: “SocialLinks mínimo + ButtonGroup sin área (Recomendado)” (“Enmienda SocialLinks: `gap` pasa a separación mínima por tamaño (md ≥ gap-4, lg ≥ gap-2; mismos valores y default) → sus iconos tienen 44px. ButtonGroup (pegado y spaced) desactiva el área extendida: compacto por diseño; sus IconButton quedan por debajo de 44px y se documenta. Sin cambio visual en ButtonGroup.”). This records the scoped S8 decision; it is not a new convention approval or release.
- **Snapshot identity:** `version: v0.2`; `contentSHA256: 10094b1045023191dbe8e52907f0050be9e9eb4dd095a2fb86e1011dbd7bfa01`; `visualHashes: Pending`; `approvalReference: odd/tasks/consumer-request-specs.md S8, L18`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/79`; `latestPublishedComment: Pending` (remote history not checked).
- **Hash definition:** SHA-256 of the UTF-8 payload from line-start `## 1. Purpose and scope` through EOF, with LF line endings and final newline; tracking metadata is excluded.

## 1. Purpose and scope

Keep both existing compact group layouts without overlapping the newly extended IconButton targets. Reuse ButtonGroup; no new component, public target opt-out, token or dependency. Its existing React exports and sources are in `packages/ui/src/molecules/button-group/`.

## 2. Anatomy and composition

The native named or unnamed group and supported direct Button/IconButton action hosts remain; their normal Slot trigger composition, refs and native semantics are preserved. The group locally disables the invisible extension of its IconButtons in both `attached` and `spaced` modes without child cloning or a new focusable object.

## 3. Public API

`variant?: 'spaced' | 'attached'` and default `spaced`, `label` and `children` remain unchanged in type and defaults. The changed contract is that grouped IconButtons deliberately retain only their visible pointer target. Registry mappings remain `variant` → `visual-treatment` and `label` → `accessible-name`; no convention, alias or exception change is approved. The reviewed pre-change source is `packages/ui/src/molecules/button-group/types.ts`, `ButtonGroupProps`, SHA-256 `2ecb19299d2410ef130ed830d62b410b17c8adc04bb73625de6bd0940ed94e51`; usage revisions require refresh after its bytes change.

## 4. Behavior

Both group variants suppress the IconButton extension for all pointer types while preserving their existing gaps, wrapping, direct-child ordering and callbacks. Standalone IconButtons retain their automatic target. No key handler, synthetic event or independent state is added.

## 5. Accessibility

Grouped IconButtons can remain below 44px: their visible default-token boxes are 25.6px, 32px and 38.4px. This scoped compact exception is not a 44px or WCAG target-size claim. Each enabled action keeps its native tab stop, accessible name and visible-root focus ring; consumers choose a larger alternative when their context requires one.

## 6. Appearance

No group layout or resting appearance changes: attached and spaced retain their existing geometry. The separate IconButton v0.5 pressed-paint change still applies. Material and focus remain owned by the children. Six existing meaningful files remain; **No stylesheet** or new internal module. Expected-design references for this compatibility change are Pending; visual conformity is **Not evaluated**.

## 7. Acceptance criteria

- Both variants suppress the target extension for native and compatible slotted IconButtons while preserving direct child hosts, gaps, names, callbacks, focus and ref forwarding.
- Rerendering between variants and rendering standalone controls preserves the respective scoped and automatic behavior; built-CSS browser tests verify hit boundaries and no intercept of neighboring actions.
- Usage guidance documents the below-44px limitation; browser, assistive-technology and visual-reference evidence are reported separately rather than inferred.
