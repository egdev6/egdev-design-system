# AttachmentField v0.3 — remove-action target spacing amendment

- **Status:** Approved 2026-11-22 (owner's conditional choice in [S11 and L23](../../../../odd/tasks/consumer-request-specs.md)).
- **Amends:** the approved [v0.2 consolidated contract](../v0.2/spec.md) and [v0.1 implementation](../v0.1/implementation.md); canonical issue [#497](https://github.com/egdev6/egdev-design-system/issues/497). Unmentioned promises remain unchanged.
- **Approval / recovery:** Owner choice verbatim: “Separar o desactivar (Recomendado)” (“Primero la separación mínima con tokens existentes; si exige cambiar el layout de la miniatura, se desactiva el área con excepción documentada. Enmienda registrada en ambos casos.”). The observed conflicts can be addressed by increasing existing gaps without changing thumbnail dimensions or the corner-button arrangement, so the spacing branch applies. This is a scoped S11 decision, not a new naming convention or release.
- **Snapshot identity:** `version: v0.3`; `contentSHA256: e573cf4747cd5f6e40588e142735c2ba52b8f26b83350d181986b9d529bf6b5c`; `visualHashes: Pending`; `approvalReference: odd/tasks/consumer-request-specs.md S11, L23`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/497`; `latestPublishedComment: Pending` (remote history not checked).
- **Hash definition:** SHA-256 of the UTF-8 payload from line-start `## 1. Purpose and scope` through EOF, with LF line endings and final newline; tracking metadata is excluded.

## 1. Purpose and scope

Keep the automatically expanded Remove targets clear of the consumer control and adjacent thumbnail items. Reuse AttachmentField, its Stack and Cluster layouts and existing spacing tokens; no new component, token or dependency. A Chrome hit test found the first Remove extension intercepting a point inside the preceding Textarea and the next thumbnail intercepting two points in that Remove control's centered 44px square.

## 2. Anatomy and composition

The root Stack, wrapping Cluster list, thumbnail `w-20` PhotoFrame and `sm` outline IconButton at `top-1 end-1` remain. Change the root and strip spacing only; do not resize the thumbnail, move the control, add a wrapper or suppress the target. Existing DOM order, names, status and event ownership remain.

## 3. Public API

No prop, default, export, marker or naming convention changes. Existing AttachmentField registry mappings remain unchanged. The spacing change is internal composition and does not change `types.ts` or add a new target option.

## 4. Behavior

The root Stack and wrapping thumbnail Cluster use `gap={3}` instead of `gap={2}`. Under default tokens their 9.6px gap replaces 6.4px and provides clearance for the centered Remove extension both between the consumer control and the strip and between adjacent thumbnail items. Native activation, focus restoration, controlled/uncontrolled values, validation, disabled state, wrapping, RTL and callbacks remain unchanged. Hosts must still avoid clipping, overlays, ancestor transforms and insufficient local token overrides.

## 5. Accessibility

The visible Remove box remains approximately 25.6px under default tokens; the supported unobstructed hit square extends to 44.8px. The previous below-44px limitation is superseded only in that supported context. Native names, tab order, focus, announcements and the consumer's responsibility for the Textarea label remain. Neither spacing nor this amendment establishes unconditional WCAG or assistive-technology conformance.

## 6. Appearance

Both gaps increase by 3.2px under default tokens, so the field can become taller and thumbnail rows can wrap differently. Thumbnail size, corner-button position, Material and focus remain unchanged. Six meaningful files remain; **No stylesheet** or new internal module. Expected-design references remain Pending; visual conformity is **Not evaluated**.

## 7. Acceptance criteria

- Root and wrapping strip both use the next existing spacing token, preserving thumbnail geometry, DOM order and Remove/Dropzone behavior.
- Focused tests preserve controlled removal and wrapping; built-CSS browser checks probe the centered square, adjacent thumbnails and the consumer-control boundary with real pointer events.
- Changelog and usage guidance disclose the spacing change; browser, assistive-technology and visual-reference evidence remain separately reported.
