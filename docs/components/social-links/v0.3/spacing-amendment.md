# SocialLinks v0.3 — target-spacing margin amendment

- **Status:** Approved 2026-11-22 (owner choice in [S12 and L24](../../../../odd/tasks/consumer-request-specs.md)).
- **Amends:** the approved [v0.2 spacing amendment](../v0.2/spacing-amendment.md), superseding its effective gap values; canonical issue [#104](https://github.com/egdev6/egdev-design-system/issues/104). Unmentioned promises remain unchanged.
- **Approval / recovery:** Owner choice verbatim: “Sí, regla con margen (Recomendado)” (“SocialLinks md gap-5 y lg gap-3; ListItemActions gap-5. Se enmiendan SocialLinks v0.3 y ListItem v0.4 con tu aprobación registrada, y la ficha de IconButton documenta la regla para consumidores. Cambio visual pequeño adicional.”). This is a scoped S12 decision, not a new naming convention or release.
- **Snapshot identity:** `version: v0.3`; `contentSHA256: f926c6b9a6db4fa3463315745aac823ce9cdc3b963d49cd3c62df476bfd96d6a`; `visualHashes: Pending`; `approvalReference: odd/tasks/consumer-request-specs.md S12, L24`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/104`; `latestPublishedComment: Pending` (remote history not checked).
- **Hash definition:** SHA-256 of the UTF-8 payload from line-start `## 1. Purpose and scope` through EOF, with LF line endings and final newline; tracking metadata is excluded.

## 1. Purpose and scope

Add a spacing-token margin beyond the sum of neighboring target outsets. Chrome hit testing found that the exact mathematical minimum can misdirect edge input under sub-pixel rounding. Reuse SocialLinks and its wrapping Cluster; no new component, token or dependency.

## 2. Anatomy and composition

The named list, direct entries, IconButton-slotted anchors, caption and outer layout remain unchanged. Cluster still supplies horizontal and wrapped-row spacing. No wrapper, new interactive object or event forwarding is added.

## 3. Public API

`gap?: 1 | 2` keeps its values and default `2` and remains a minimum request. Both values resolve to at least `gap-5` for `md` and `gap-3` for `lg`. Size, variant and other API/defaults are unchanged. Existing `layout-gap` and `preset-dimensions` registry mappings remain; no convention or exception is added. Review and refresh source revisions after editing `types.ts`.

## 4. Behavior

Under default tokens, effective gaps are 16px (`md`) and 9.6px (`lg`) on both axes. Each is one spacing token above the corresponding summed outsets, 12.8px and 6.4px. Links retain native semantics, order and interaction. Hosts must still avoid clipping, overlays, ancestor scaling and insufficient local token overrides.

## 5. Accessibility

Named native links, tab order and visible-root focus remain. The margin addresses measured target interception but is not an unconditional WCAG or assistive-technology conformance claim.

## 6. Appearance

The extra gap is 3.2px beyond v0.2 for both sizes under default tokens; rows can wrap differently and consumer layouts can visibly change. Material and control dimensions remain unchanged. Six existing meaningful files remain; **No stylesheet** or new internal module. Expected-design references are Pending; visual conformity is **Not evaluated**.

## 7. Acceptance criteria

- Both gap values resolve to `gap-5` for `md` and `gap-3` for `lg`; default `2`, link names, semantics and order are retained.
- Focused tests and real built-CSS browser checks cover adjacent links and wrapped rows with the spacing margin.
- Changelog and usage guidance disclose the additional visible spacing; visual and assistive-technology evidence remain separate.
