# Sidebar v0.3 and PreviewFrame v0.2 — action target spacing amendment

- **Status:** Approved 2026-11-23 (owner decision in [L37](../../../../odd/tasks/consumer-request-specs.md#log)).
- **Amends:** [Sidebar v0.2](../v0.2/desktop-recipe-amendment.md) and [PreviewFrame v0.1](../../preview-frame/v0.1/implementation-plan.md). Their unmentioned promises remain unchanged. This shared delta retains separate canonical component issues: [Sidebar #123](https://github.com/egdev6/egdev-design-system/issues/123) and [PreviewFrame #127](https://github.com/egdev6/egdev-design-system/issues/127); consumer request [#550](https://github.com/egdev6/egdev-design-system/issues/550).
- **Approval / recovery:** Owner choice verbatim: "Collapsible + PreviewFrame + Sidebar (Recomendado)" ("Enmienda Collapsible v0.6 (acciones gap-5, fila gap-3) y otra para PreviewFrame/Sidebar footer (gap-5); JSDoc en Dialog/Panel/TopBar avisando de md/md. Cambio visual en las acciones de esos componentes."). This scoped choice authorizes the specified spacing changes and implementation, not new conventions, tokens or dependencies.
- **Snapshot identity:** `version: Sidebar v0.3; PreviewFrame v0.2`; `contentSHA256: e6dbb5e0ca231dbbde213bdace2991dbd85f8ae79218b473d4c247fcda63fd78`; `visualHashes: Pending`; `approvalReference: odd/tasks/consumer-request-specs.md L37`; `canonicalIssue: Sidebar https://github.com/egdev6/egdev-design-system/issues/123; PreviewFrame https://github.com/egdev6/egdev-design-system/issues/127`; `latestPublishedComment: Pending` (remote history not checked). The digest identifies this transcription, not independent approval of a digest.
- **Hash definition:** SHA-256 of the UTF-8 payload from line-start `## 1. Purpose and scope` through EOF, including the final LF; metadata above it is excluded.

## 1. Purpose and scope

Space adjacent extended targets in the existing PreviewFrame actions and Sidebar footer. Apply the [S12](../../../../odd/tasks/consumer-request-specs.md#specs) rule: visible gaps must exceed the sum of target outsets by at least one spacing token. Reuse existing slots; no new component, prop, token or dependency.

## 2. Anatomy and composition

Keep PreviewFrame's wrapping actions outside the figure caption, its canvas and separate lower footer unchanged. Keep Sidebar's scrollable body and pinned, non-wrapping footer in their existing order and Surface composition. Controls remain consumer-owned and retain native order and semantics.

## 3. Public API

No prop, default, export, marker, naming convention or supported `className` surface changes. `actions` and `footer` remain optional consumer content. Review and refresh all affected whole-file registry revisions after editing the two `types.ts` files.

## 4. Behavior

PreviewFrame's actions and Sidebar's footer each use `gap-5` instead of `gap-2`; under default tokens the visible gap is 16px. This clears adjacent `md`/`md`, `md`/`lg`, `lg`/`lg` and `sm`/`lg` extended IconButtons. PreviewFrame's separate lower footer is unchanged.

Consumers must provide additional clearance for `sm`/`md` (`gap-6`, 19.2px) and `sm`/`sm` (`gap-7`, 22.4px) adjacent actions, for example inside a consumer-owned spaced wrapper. The slot gap cannot fix spacing inside nested groups. Reserve targets from other interactive elements, clipping and overlays, and account for local token overrides and ancestor scaling. Sidebar's footer does not itself wrap; consumers provide sufficient host space.

## 5. Accessibility

Native names, focus and action behavior remain consumer-owned and unchanged. The token margin addresses adjacent target interception; it is not an unconditional accessibility conformance or target-size claim.

## 6. Appearance

The two affected bars visibly grow their gap by 9.6px under default tokens. PreviewFrame actions may wrap differently; Sidebar footer content may require more host width. Existing Material, control sizes and six meaningful files remain unchanged. **No stylesheet** or new internal module. Expected-design visuals are Pending; visual conformity is **Not evaluated**.

## 7. Acceptance criteria

- PreviewFrame actions and Sidebar footer use `gap-5` while their other geometry, content order, Material and semantics remain unchanged.
- Focused component tests and built-CSS browser hit tests cover adjacent `md` actions at rest and pressed, with mouse and touch, in LTR and RTL.
- Consumer guidance identifies additional `sm` spacing and host constraints; the changelog discloses the visual changes. Browser hit tests do not substitute for visual approval or assistive-technology evidence.
