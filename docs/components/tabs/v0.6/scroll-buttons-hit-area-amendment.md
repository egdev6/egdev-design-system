# Tabs v0.6 — compact scroll-button hit area amendment

- **Status:** Approved 2026-11-22 (owner choices in [S10, L21 and L22](../../../../odd/tasks/consumer-request-specs.md)).
- **Amends:** the approved [v0.4-A scroll-buttons amendment](../v0.4/scroll-buttons-amendment.md) and [v0.5 fill amendment](../v0.5/fill-amendment.md); canonical issue [#107](https://github.com/egdev6/egdev-design-system/issues/107). Unmentioned promises remain unchanged.
- **Approval / recovery:** Owner choice verbatim: “Tabs desactiva el área (Recomendado)” (“Igual que ButtonGroup: los botones de scroll de Tabs no tienen área extendida. Justificado porque solo se muestran con ratón (en táctil no aparecen), así que el objetivo de 44px no aplica. Sin cambio visual; pequeña enmienda Tabs v0.6 con tu aprobación registrada.”). After correcting the hybrid-pointer premise, the owner reaffirmed the exception: “Mantener la excepción, documentada (Recomendado)” (“Tabs desactiva el área extendida en sus botones de scroll; se documenta que en híbridos táctiles el objetivo es ~25,6px, aceptable porque la lista también se desplaza arrastrando. Sin cambio visual.”). This is a scoped decision, not a new naming convention or release.
- **Snapshot identity:** `version: v0.6`; `contentSHA256: d3bd11ad87a61e65aa6f22c0020907f1551f6c53c689aa1df24be84d01a4ca09`; `visualHashes: Pending`; `approvalReference: odd/tasks/consumer-request-specs.md S10, L21–L22`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/107`; `latestPublishedComment: Pending` (remote history not checked).
- **Hash definition:** SHA-256 of the UTF-8 payload from line-start `## 1. Purpose and scope` through EOF, with LF line endings and final newline; tracking metadata is excluded.

## 1. Purpose and scope

Keep the existing scroll controls within their visible edge zones instead of allowing the IconButton extension to intercept adjacent tabs. Reuse the existing Tabs molecule and its internal IconButtons; no new component, public opt-out, token or dependency. The built-package browser probe in [L21](../../../../odd/tasks/consumer-request-specs.md) observed a scroll-button click 4px outside its visible box where suppressing the extension instead selected the underlying tab.

## 2. Anatomy and composition

The scroll area, Radix list and triggers, and both native IconButton scroll controls remain unchanged. The scroll area locally suppresses the direct scroll buttons' invisible extension without child cloning, new DOM, event forwarding or another focusable object. Standalone IconButtons remain extended.

## 3. Public API

No prop, default, export, marker or naming convention changes. Existing Tabs registry mappings remain unchanged; edits to the whole `packages/ui/src/molecules/tabs/types.ts` file require reviewing its existing usage symbols and refreshing their source revisions. The controls remain internal and are not a new public API.

## 4. Behavior

The start and end controls retain their visible `sm` boxes and page-scroll, visible/inert/hidden, reduced-motion and RTL behavior, but their pointer targets no longer extend beyond the boxes. The [v0.4-A specification](../v0.4/scroll-buttons-amendment.md) describes touch and coarse-pointer scope at lines 12–14 and 38–43 and the media rule at line 60; [`tabs/types.ts`](../../../../packages/ui/src/molecules/tabs/types.ts) lines 184–189 applies `@media (hover:hover) and (pointer:fine)`. That query describes the primary pointer, not each event: on a touch-capable hybrid whose primary pointer is fine and can hover, the buttons can remain visible and receive touch.

## 5. Accessibility

On those hybrids each scroll-button target can be approximately 25.6px under default tokens, below 44px. The owner accepted this scoped exception because the tab list also scrolls by dragging. Do not claim that all touch devices hide these buttons or that the exception establishes WCAG conformance. The controls remain hidden from assistive technology and out of the tab order; tab selection, keyboard focus and native scrolling stay unchanged.

## 6. Appearance

The visible boxes, edge fade, layout and resting appearance do not change. The independently approved IconButton press-paint change still applies. Existing Tabs styling roles remain: six meaningful files plus the previously approved `tabs.css`; this amendment adds no stylesheet role or internal module. Expected-design references remain Pending; visual conformity is **Not evaluated**.

## 7. Acceptance criteria

- Both scroll buttons suppress the extension in every scrollable Tabs variant and fill mode; a standalone IconButton remains extended.
- Existing paging, selection, inert behavior, touch scrolling and media-query behavior remain unchanged. Built-CSS browser checks confirm the buttons no longer intercept the adjacent tab region and preserve their visible boxes.
- Tests and usage guidance document the hybrid-touch exception, while browser, assistive-technology and visual-reference evidence remain separately reported.
