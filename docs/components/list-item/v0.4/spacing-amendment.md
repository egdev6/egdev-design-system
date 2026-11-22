# ListItem v0.4 — independent-action target margin amendment

- **Status:** Approved 2026-11-22 (owner choice in [S12 and L24](../../../../odd/tasks/consumer-request-specs.md)).
- **Amends:** the approved [v0.3 action-spacing amendment](../v0.3/spacing-amendment.md), superseding its `gap-4` value; canonical issue [#88](https://github.com/egdev6/egdev-design-system/issues/88). Unmentioned promises remain unchanged.
- **Approval / recovery:** Owner choice verbatim: “Sí, regla con margen (Recomendado)” (“SocialLinks md gap-5 y lg gap-3; ListItemActions gap-5. Se enmiendan SocialLinks v0.3 y ListItem v0.4 con tu aprobación registrada, y la ficha de IconButton documenta la regla para consumidores. Cambio visual pequeño adicional.”). This is a scoped S12 decision, not a new naming convention or release.
- **Snapshot identity:** `version: v0.4`; `contentSHA256: 89f05852055879e35afc9df0d2a1af40d389164f66fb7d7e2d05f285111661db`; `visualHashes: Pending`; `approvalReference: odd/tasks/consumer-request-specs.md S12, L24`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/88`; `latestPublishedComment: Pending` (remote history not checked).
- **Hash definition:** SHA-256 of the UTF-8 payload from line-start `## 1. Purpose and scope` through EOF, with LF line endings and final newline; tracking metadata is excluded.

## 1. Purpose and scope

Add a token margin to the ListItemActions band for adjacent extended targets. Chrome hit testing found that exact mathematical minima can misdirect edge input under sub-pixel rounding. Reuse the existing compound part; no component, prop, token or dependency is added.

## 2. Anatomy and composition

The wrapping action div, independent native controls, DOM order and other ListItem parts remain unchanged. Independent actions remain outside a whole-row anchor; no new wrapper, event forwarding or focusable object is added.

## 3. Public API

No prop, default, export, marker or naming convention changes. Existing local-layout `className` limits and registry mappings remain; review and refresh affected source revisions after editing `types.ts`.

## 4. Behavior

The action band uses `gap-5` on both axes, 16px under default tokens. This supplies the one-token margin for `md`/`md`, `md`/`lg`, `lg`/`lg` and `sm`/`lg` pairs. `sm`/`md` needs `gap-6` (19.2px); two `sm` controls have 19.2px summed outsets and need the next token, `gap-7` (22.4px), supplied by the consumer. Reserve the full target from text, neighboring rows, clipping and overlays as well.

## 5. Accessibility

Independent controls retain native names, keyboard behavior and visible-root focus. The gap provides the stated default-token clearance only and is not an unconditional target-size or WCAG claim.

## 6. Appearance

The action gap is 3.2px wider than v0.3 under default tokens; rows with multiple actions can become wider or wrap differently. Other ListItem geometry, Material and ordering remain unchanged. Six existing meaningful files remain; **No stylesheet** or new internal module. Expected-design references are Pending; visual conformity is **Not evaluated**.

## 7. Acceptance criteria

- The action band uses `gap-5` on both axes and preserves wrapping, ordering and independent control semantics.
- Unit and built-CSS browser checks cover adjacent `md`/`lg` controls; usage guidance states the extra `sm`/`md` and `sm`/`sm` clearance.
- Changelog and usage guidance disclose the visual change; visual and assistive-technology evidence remain separate.
