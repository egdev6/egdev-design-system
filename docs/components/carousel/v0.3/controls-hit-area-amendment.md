# Carousel v0.3 — control hit-area spacing amendment

- **Status:** Approved 2026-11-22 (owner choice in [S11 and L23](../../../../odd/tasks/consumer-request-specs.md)).
- **Amends:** the approved [v0.1 implementation](../v0.1/implementation.md) and [v0.2 full-width track amendment](../v0.2/full-width-track-amendment.md); canonical issue [#80](https://github.com/egdev6/egdev-design-system/issues/80). Unmentioned promises remain unchanged.
- **Approval / recovery:** Owner choice verbatim: “Subir a gap-3 (Recomendado)” (“9,6px entre controles: conserva los 44px con margen. Cambio visual mínimo (3,2px más). Pequeña enmienda Carousel con tu aprobación registrada.”). This is a scoped S11 decision, not a new naming convention or release.
- **Snapshot identity:** `version: v0.3`; `contentSHA256: 98d6e6894315f9eb3b1a3027529b25d5783342442da09bc3cf7706ed12fb67ad`; `visualHashes: Pending`; `approvalReference: odd/tasks/consumer-request-specs.md S11, L23`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/80`; `latestPublishedComment: Pending` (remote history not checked).
- **Hash definition:** SHA-256 of the UTF-8 payload from line-start `## 1. Purpose and scope` through EOF, with LF line endings and final newline; tracking metadata is excluded.

## 1. Purpose and scope

Preserve independent IconButton targets by increasing the existing Carousel control-row gap. Reuse the existing Carousel molecule and tokens; no new component, dependency or public target opt-out. In the built-source Chrome probe recorded in [L23](../../../../odd/tasks/consumer-request-specs.md), three points at the previous button's centered 44px edge hit the neighboring next button at `gap-2`.

## 2. Anatomy and composition

The named root, header, counter and native previous/next IconButton hosts remain unchanged. No wrapper, event forwarding, focusable object or child cloning is added. Both controls keep the automatically extended IconButton target.

## 3. Public API

No prop, default, export, marker or naming convention changes. Existing Carousel registry mappings remain unchanged; editing `packages/ui/src/molecules/carousel/types.ts` requires reviewing all existing usage symbols and refreshing their whole-file source revisions. Both track layouts retain the same control row.

## 4. Behavior

The controls row changes from `gap-2` to `gap-3` on both axes. Under default tokens this increases the gap from 6.4px to 9.6px and provides clearance between adjacent 44.8px target squares. Native buttons, callbacks, disabled boundaries, keyboard, drag, scrolling, controlled behavior and reduced motion stay unchanged. The actual target remains conditional on unobstructed layout and sufficient resolved tokens.

## 5. Accessibility

Each control retains its accessible name, native tab stop and visible-root focus treatment. The extra spacing aims to prevent neighboring target interception; it is not an unconditional WCAG or assistive-technology conformance claim.

## 6. Appearance

The controls and counter are spaced 3.2px farther apart under default tokens; this is a small visible change. Other Carousel geometry, Material and focus remain unchanged. Six existing meaningful files remain; **No stylesheet** or new internal module. Expected-design references are Pending; visual conformity is **Not evaluated**.

## 7. Acceptance criteria

- The public Carousel renders both control hosts in a `gap-3` row for both track layouts, preserving order, names, native behavior and disabled boundaries.
- Unit tests and built-CSS browser hit tests verify adjacent targets, including a stationary boundary press/release and one intended action.
- Changelog and usage guidance disclose the spacing change; browser, assistive-technology and visual-reference evidence remain separately reported.
