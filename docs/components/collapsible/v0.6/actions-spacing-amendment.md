# Collapsible v0.6 — action target spacing amendment

- **Status:** Approved 2026-11-23 (owner decision in [L37](../../../../odd/tasks/consumer-request-specs.md#log)).
- **Amends:** [v0.5 actions amendment](../v0.5/actions-amendment.md), superseding its `--space-2` gaps for the Header row and actions wrapper. All other promises remain unchanged. Canonical component issue [#181](https://github.com/egdev6/egdev-design-system/issues/181); consumer request [#550](https://github.com/egdev6/egdev-design-system/issues/550).
- **Approval / recovery:** Owner choice verbatim: "Collapsible + PreviewFrame + Sidebar (Recomendado)" ("Enmienda Collapsible v0.6 (acciones gap-5, fila gap-3) y otra para PreviewFrame/Sidebar footer (gap-5); JSDoc en Dialog/Panel/TopBar avisando de md/md. Cambio visual en las acciones de esos componentes."). This scoped choice authorizes the specified spacing changes and implementation, not new conventions, tokens or dependencies.
- **Snapshot identity:** `version: v0.6`; `contentSHA256: 230af171ddf3ba7b79f1ba671ffea19192a7992785f0fae8ac29b927459b3e83`; `visualHashes: Pending`; `approvalReference: odd/tasks/consumer-request-specs.md L37`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/181`; `latestPublishedComment: Pending` (remote history not checked). The digest identifies this transcription, not independent approval of a digest.
- **Hash definition:** SHA-256 of the UTF-8 payload from line-start `## 1. Purpose and scope` through EOF, including the final LF; metadata above it is excluded.

## 1. Purpose and scope

Space adjacent extended IconButton targets without changing the disclosure API or introducing a new component. The existing action wrapper was too tight for the two `md` actions reported in #550. Apply the one-token margin rule in [S12](../../../../odd/tasks/consumer-request-specs.md#specs): the visible gap must exceed the sum of adjacent target outsets by at least one spacing token.

## 2. Anatomy and composition

Keep the optional wrapping Header, native Trigger or heading, and independent wrapping actions wrapper as siblings in the existing order. Preserve Radix disclosure, separate controls, native focus and all other component parts. No new wrapper, stylesheet or internal module is introduced.

## 3. Public API

No prop, default, export, marker, naming convention or supported `className` surface changes. Consumers still supply their own actions and their behavior. Review and refresh the whole-file registry revisions of `Collapsible` types after implementation.

## 4. Behavior

The Header row uses `gap-3` and its actions wrapper uses `gap-5`, on both axes. Under default tokens these are 9.6px and 16px respectively. The row clears a default `md` action next to the non-extended Trigger: the 6.4px action outset plus a 3.2px token. The action band clears adjacent `md`/`md`, `md`/`lg`, `lg`/`lg` and `sm`/`lg` extended targets. Preserve wrapping and action independence.

Consumers must provide additional clearance for `sm`/`md` (`gap-6`, 19.2px) and `sm`/`sm` (`gap-7`, 22.4px) adjacent actions, for example by grouping them in a consumer-owned spaced wrapper. An `sm` action next to the Trigger also needs at least `gap-4` (12.8px), including the row gap; supply the additional leading clearance. These requirements assume default tokens and unscaled ancestors; also reserve each target from unrelated controls, clipping and overlays.

## 5. Accessibility

Action names, focus order, native activation and the Trigger's Radix semantics remain unchanged. Gap values are clearance measures, not an unconditional accessibility conformance or target-size claim.

## 6. Appearance

The Header row grows from `gap-2` to `gap-3` and the actions wrapper from `gap-2` to `gap-5`. Multiple actions can widen or wrap differently; the increased Trigger-to-actions spacing is visible. Existing Material, control sizes and six meaningful files remain unchanged. Expected-design visuals are Pending; visual conformity is **Not evaluated**.

## 7. Acceptance criteria

- Header and actions use `gap-3` and `gap-5`, retaining wrapping, DOM order, action independence and existing disclosure behavior.
- Focused component tests and real built-CSS browser hit tests cover the two adjacent `md` actions and the action next to Trigger, including rest/pressed, mouse/touch and LTR/RTL.
- Consumer guidance documents additional `sm` clearance; the changelog discloses the visual change. Browser hit tests do not substitute for visual approval or assistive-technology evidence.
