# ListItem v0.3 — independent action spacing amendment

- **Status:** Approved 2026-11-22 (owner choice in [S9 and L19](../../../../odd/tasks/consumer-request-specs.md)).
- **Amends:** [v0.2 contract](../v0.2/spec.md), approved via [snapshot and owner approval](../v0.2/implementation-plan.md), and [v0.1 implementation](../v0.1/implementation.md); canonical issue [#88](https://github.com/egdev6/egdev-design-system/issues/88). It supersedes the unchanged `ListItemActions` spacing promise only; unmentioned promises remain unchanged.
- **Approval / recovery:** Owner choice verbatim: “Enmienda a gap-4 (Recomendado)” (“Cubre el tamaño por defecto (md) y lg; para sm vecinos se documenta que la app añade separación. Cambio visual moderado en filas con varias acciones. Nueva enmienda ListItem v0.3 con tu aprobación registrada.”). This records the scoped S9 decision; it is not a new convention approval or release.
- **Snapshot identity:** `version: v0.3`; `contentSHA256: 6b32ee9b47ef6cab7aac3d3d453b889a40c7fb53628b7e789c83ce1a066818be`; `visualHashes: Pending`; `approvalReference: odd/tasks/consumer-request-specs.md S9, L19`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/88`; `latestPublishedComment: Pending` (remote history not checked).
- **Hash definition:** SHA-256 of the UTF-8 payload from line-start `## 1. Purpose and scope` through EOF, with LF line endings and final newline; tracking metadata is excluded.

## 1. Purpose and scope

Increase the existing independent action band's gap from `gap-1` to `gap-4` so adjacent default `md` or `lg` IconButtons can retain their extended targets. Reuse ListItemActions, not a new component or prop; source and public exports remain in `packages/ui/src/molecules/list-item/`.

## 2. Anatomy and composition

The existing wrapping `ListItemActions` div, DOM order, native controls and other compound parts are unchanged. Independent actions remain outside a whole-row anchor. No additional wrapper, event forwarding or focusable object is introduced.

## 3. Public API

No prop, default, export or marker changes. Existing `ListItemPartProps.className` still supports only documented local layout; it is not a blanket appearance override. Existing registry mappings for `ListItemProps` and `ListItemTitleProps` remain unchanged; no convention, alias or exception is approved. The reviewed pre-change source is `packages/ui/src/molecules/list-item/types.ts`, SHA-256 `86f20d54760b2e74e6283dc69c346d8d93a18d6410e6ed13d1547ee95846355b`; all usages of that source need refreshed revisions after its bytes change.

## 4. Behavior

The wrapping band uses `gap-4` on both axes, 12.8px under default tokens. It covers `md`/`md`, `md`/`lg` and `lg`/`lg` target pairs; adjacent `sm`/`md` and `sm`/`sm` require extra consumer-provided clearance (16px and 19.2px respectively). `sm`/`lg` needs 12.8px. Consumers also reserve space from text, row actions, neighboring rows, clipping and overlays; token overrides can change the actual clearance.

## 5. Accessibility

Independent actions keep native names, keyboard behavior and visible focus. The spacing supplies the stated default-token separation only; it does not guarantee an unobstructed target or WCAG conformance in arbitrary compositions. A separate action must never be nested in a whole-row link.

## 6. Appearance

Rows with multiple actions can become moderately wider or wrap differently. Other ListItem paint, order, geometry and contracts remain unchanged. Six existing meaningful files remain; **No stylesheet** or new internal module. Expected-design references for the spacing change are Pending; visual conformity is **Not evaluated**.

## 7. Acceptance criteria

- The public action band emits `gap-4` on both axes, retains wrapping and independent control semantics, and no existing prop or marker changes.
- Unit and built-CSS browser checks cover adjacent `md`/`lg` actions and wrapping; documentation explains the extra clearance needed for adjacent `sm`/`md` and `sm`/`sm` targets.
- Changelog and usage guidance disclose the visual change; browser, assistive-technology and visual-reference evidence are reported separately rather than inferred.
