# AttachmentField v0.4 — remove-action target spacing amendment

- **Status:** Approved 2026-11-22 (owner's conditional choice in [S11 and L25](../../../../odd/tasks/consumer-request-specs.md)).
- **Amends:** the approved [v0.3 target-spacing amendment](../v0.3/remove-action-hit-area-amendment.md), superseding its root gap and clearance claim; canonical issue [#497](https://github.com/egdev6/egdev-design-system/issues/497). Unmentioned promises remain unchanged.
- **Approval / recovery:** Owner choice verbatim: “Separar o desactivar (Recomendado)” (“Primero la separación mínima con tokens existentes; si exige cambiar el layout de la miniatura, se desactiva el área con excepción documentada. Enmienda registrada en ambos casos.”). L25 records the observed Chrome touch conflict and applies the spacing branch because the next existing token does not change thumbnail layout. This is a scoped S11 decision, not a new naming convention or release.
- **Snapshot identity:** `version: v0.4`; `contentSHA256: 89e3a613b91b4d6353718d5d7f7991d9b7ca7d0f512d2c13904396877cc734e2`; `visualHashes: Pending`; `approvalReference: odd/tasks/consumer-request-specs.md S11, L25`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/497`; `latestPublishedComment: Pending` (remote history not checked).
- **Hash definition:** SHA-256 of the UTF-8 payload from line-start `## 1. Purpose and scope` through EOF, with LF line endings and final newline; tracking metadata is excluded.

## 1. Purpose and scope

Supersede only the root-spacing and clearance promises in AttachmentField v0.3. Chrome touch targeting selected the adjacent consumer Textarea from pointerdown at a Remove target corner even though `elementFromPoint` identified the IconButton. Keep the extended target, use existing spacing tokens and preserve thumbnail dimensions and placement; no new component, token or dependency.

## 2. Anatomy and composition

The root Stack uses `gap={4}`. The wrapping thumbnail Cluster keeps `gap={3}`; the `w-20` PhotoFrame and `sm` outline IconButton at `top-1 end-1` remain unchanged. No wrapper, thumbnail resize, control repositioning or target suppression is introduced. DOM order, names, status and event ownership remain.

## 3. Public API

No prop, default, export, marker or naming convention changes. This internal composition change does not modify `types.ts`, add a target option or change the existing AttachmentField registry mappings.

## 4. Behavior

Under default tokens, the root gap increases from 9.6px to 12.8px; the strip gap remains 9.6px. This corrects v0.3’s claim that a 9.6px root gap provides clearance from the consumer control: Chrome may adjust a touch toward the nearby Textarea even when the point hit-tests to Remove. The next existing token cleared the reproduced corner without changing thumbnail layout. Native activation, focus restoration, controlled and uncontrolled values, validation, disabled state, wrapping, RTL and callbacks remain unchanged. Hosts must avoid clipping, overlays, intervening controls and insufficient local token overrides; browser touch adjustment is not equivalent to `elementFromPoint`.

## 5. Accessibility

The visible Remove box remains approximately 25.6px under default tokens and its unobstructed target extends to 44.8px. The larger root gap is an evidence-driven clearance measure, not an unconditional guarantee for arbitrary consumer content, browsers or assistive technologies. Native names, tab order, focus, announcements and the consumer’s responsibility for the Textarea label remain unchanged.

## 6. Appearance

The root gap increases by 3.2px from v0.3, moving the strip relative to its sibling without changing the thumbnail’s size, position within its item, corner control, Material or focus. The strip keeps its v0.3 gap. Six meaningful files remain; **No stylesheet** or new internal module. Expected-design references remain Pending; visual conformity is **Not evaluated**.

## 7. Acceptance criteria

- Root Stack uses `gap={4}` and wrapping Cluster retains `gap={3}`, preserving thumbnail geometry, DOM order and Remove/Dropzone behavior.
- Focused tests preserve controlled removal and wrapping. Built-CSS browser checks cover adjacent controls, centered-square points and the consumer boundary using mouse and touch in LTR and RTL, including normal and reduced motion.
- Changelog and usage guidance disclose the root and strip gaps; browser, assistive-technology and visual-reference evidence remain separately reported.
