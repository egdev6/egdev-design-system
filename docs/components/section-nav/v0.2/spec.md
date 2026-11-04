# Component contract — SectionNav

- **Version / status:** v0.2 — DRAFT, awaiting exact owner approval (G4). No component or story change is authorized by this draft.
- **Approval / recovery:** Pending; this file is the proposed snapshot. The v0.1 contract was approved in [#301](https://github.com/egdev6/egdev-design-system/issues/301#issuecomment-6597832507), despite its historical draft header; see its [plan](../v0.1/implementation-plan.md), [single-landmark amendment](../v0.1/single-landmark-amendment.md), and [compact-target amendment](../v0.1/compact-target-amendment.md). Those artifacts remain unchanged. Approval of this version does not approve an implementation plan; U7 also awaits G1 and separately approved plan authority.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 → Pending; VIS-02 → Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/301`; `latestPublishedComment: Pending` for this snapshot.
- **Hash definition:** SHA-256 of UTF-8 bytes from the whole `## 1. Purpose and scope` heading through EOF, with LF and final newline; tracking metadata above is excluded. Final approval must identify the exact digest, scope and visual hashes.
- **Owner request (verbatim):** “SectionNav -> ajusta espacio de stories para que se vea (hover incluido) [Image#16]” (S7). Image#16 is conversation provenance only.

## 1. Purpose and scope

SectionNav is a reusable floating, host-driven section-navigation organism in `@egdev/ui`: it coordinates a current section, ordered index, next destination and decorative progress edge. It is not a page, router, scroll observer, choreography director or source of domain copy. The host owns destinations, current section, progress, visibility and page clearance.

**Exact delta from effective v0.1:** story presentation only, per [A7](../../web-catalog/v0.2/visual-amendments.md) and U7. Story meta proposes `parameters: { layout: 'fullscreen' }`; every story uses a wrapper with `min-h-[calc(var(--space-24)*6)]` = **460.8px** and `pb-24` = **76.8px**. Add a `Hover` story making the pill and open index reviewable in unhovered and hovered states, and a narrow-width story wrapper. These utilities reserve story canvas space; they do not change fixed positioning, offsets, focus, Radix disclosure, the component, public props or shipped CSS. No hover-to-open behavior is introduced. All effective v0.1 promises, including SN-01–SN-08 and both amendments, remain in force; the table below maps them to checks.

**Cataloging:** reuse the existing SectionNav and adjust its story composition; no new component, variant or extraction. NavList cannot express the existing location/marker index unchanged, Menu is an action menu, and Popover alone is not the whole coordinated navigation region. Public implementation evidence: `packages/ui/src/organisms/section-nav/{types.ts,useSectionNav.ts,SectionNav.tsx,index.ts}` and `packages/ui/src/index.ts`; source inspection establishes exports, not visual conformity. General availability statements in older shared guidance do not substitute for this source evidence.

## 2. Anatomy and composition

| Part | Element / owner | Responsibility and content |
| --- | --- | --- |
| Root | `nav.eg-section-nav` | One named navigation landmark; fixed bottom-right. |
| Pill | `Surface` overlay | Disclosure, separate next link and clipped decorative edge. |
| Disclosure | `PopoverTrigger` button | Current number/name when matched and decorative chevron; accessible name supplied separately. |
| Next | native anchor | Named next destination, wraps last to first; absent without a match. |
| Index | portalled `PopoverContent` dialog with direct `ol` / `li` / anchors | Named by `label`; decorative Pixel state and number precede each section label. No inner nav. |
| Edge | `ProgressBar` `size="sm"` `edge` | Decorative; host supplies equivalent progress text. |

Popover owns disclosure, portal, focus and dismissal via its installed Radix primitive. Native anchors retain navigation; no nested interactive elements, menu semantics, custom arrow-key engine or public `asChild`. `eg-section-nav` remains the stable public marker; legacy `__*` and `.is-*` are not new part-selector APIs. Existing legacy CSS and consumers are preserved.

## 3. Public API

| Prop | Type | Required / rule |
| --- | --- | --- |
| `label` | `string` | Yes; localized nonempty name of navigation and dialog. |
| `disclosureLabel` | `string` | Yes; localized nonempty disclosure name. |
| `nextLabel` | `string` | Yes; localized nonempty destination-specific name, updated by host. |
| `items` | `SectionNavItem[]` | Yes; ordered `{ id: string; label: string; href: string }`; stable unique nonempty IDs, nonempty localized labels and valid same-document destinations. Empty means no controls. |
| `activeId` | `string` | Yes; host-designated identity; unmatched means no current marker or next link. |
| `value` | `number` | Yes; percent; finite values clamp to 0–100, non-finite is indeterminate under ProgressBar's contract. Host provides equivalent text. |
| `open` / `defaultOpen` | `boolean` / `boolean` | Optional controlled / uncontrolled visibility; uncontrolled default `false`. Do not switch mode while mounted. |
| `onOpenChange` | `(open: boolean) => void` | Optional visibility request; controlled host acknowledges. |
| `onNavigate` | `(item: SectionNavItem, event: React.MouseEvent<HTMLAnchorElement>) => void` | Optional original activation event; host may prevent default; no router interception. |
| `hidden` | native `boolean` | Optional; host hides and first moves focus to a safe visible target. |
| `className` | `string` | Optional root outer placement only; no arbitrary paint or part override. |

Compatible `ComponentPropsWithoutRef<'nav'>` attributes go to root except `children`, `role`, `aria-label`, `aria-labelledby`, `dangerouslySetInnerHTML` and `style`; owned naming is protected. No public ref or inline appearance. `SectionNav`, `SectionNavItem`, `SectionNavProps` are exported from the component and package barrels; React 18/19 packed-consumer compatibility requires evidence, not inference from types.

**Naming lookup:** [registry](../../../../skills/_shared/prop-naming.json), [generated reference](../../../prop-naming.md) and [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry): `label` → `accessible-name`; `items` → `collection-items`; `activeId` → `active-section-id`; `value` → `primary-value`; `onNavigate` → `navigation-intent`; `open` → `open-state`; `defaultOpen` → `initial-uncontrolled-open`; `onOpenChange` → `open-change`. `disclosureLabel` and `nextLabel` are approved scoped `accessible-name` exceptions for SectionNav, not global aliases; see [exception approval](../v0.1/accessible-name-exceptions-approval.json). `hidden` and `className` are native. No new or changed own props, proposals, or registry edits. Reviewed source for existing SectionNav usages: `packages/ui/src/organisms/section-nav/types.ts`, symbol `SectionNavProps`, `sha256:bc0f8e59bd0b872d303a0f78c35a5fea2cdbeae5bb2ce07f1e5b4b6801b9620a`; convention approval is separate from G4.

## 4. Behavior

| Input / action | Result / notification |
| --- | --- |
| Host updates active identity or value | Update current number, text, marker and progress; no scrolling or focus move. |
| Click, Enter or Space on disclosure | Toggle index through Popover; `onOpenChange` requests the new state. |
| Activate index anchor | Notify `onNavigate`; unmodified primary activation closes index even if prevented; native navigation remains unless prevented. Modified and middle activation preserve native behavior. Do not override focus already moved to the destination. |
| Activate next | Notify with next item and original event; native link advances or wraps to first. |
| Empty / unmatched | Empty retains named nav but no controls; unmatched allows index without current marker and has no next link. |
| Hidden while open | Panel is removed even if controlled host has not acknowledged close; request `false`. Host relocates focus before hiding. |

No scroll, resize or global shortcut listeners, timed hover opening, automatic smooth scrolling or live announcement. Radix owns disclosure state and `aria-expanded`; active link uses `aria-current="location"`, and Pixel states are past/active/idle. No state is mirrored into new public classes.

## 5. Accessibility

One named root navigation landmark in empty, unmatched, closed and open states; named portalled dialog contains the ordered link list, not a duplicate nav. Labels and destination validity are host-owned. Current number/text and underline supplement color; Pixel and icons are decorative. Tab/Shift+Tab follow the existing non-modal Popover's cyclic focus; Enter/Space open, Escape closes and restores trigger focus, and outside dismissal must not steal outside focus. Navigation must not force focus back over an already focused destination. The host must move focus before hiding and supply equivalent progress text. No automatic announcement is promised. Preserve 44px minimum targets, visible focus, reflow and reduced motion; real screen-reader and visual conformity remain unevaluated until independently checked.

## 6. Appearance

| Axis | Values / default | Restriction |
| --- | --- | --- |
| Public appearance variants | None | Existing pill and index appearance only; state is not a variant. |
| Compact viewport | inclusive `width <= 520px` | Compact pill `h-14` and controls `min-h-14`, `min-w-14` = 44.8px; compact `px-3`; baseline pill `h-14 px-4`. |

The pill uses one existing Surface overlay, full radius and no padding; PopoverContent owns its own overlay, without an extra Surface. Preserve token overlay, strong hairline, edge/elevation shadows, blur, solid `surface-2` fallback for reduced transparency or unsupported filter, focus token, and reduced-motion behavior. Root retains `right-[calc(var(--space-6)+env(safe-area-inset-right,0px))]` and `bottom-[calc(var(--space-6)+env(safe-area-inset-bottom,0px))]`; no new token or dynamic geometry is proposed. Legacy root collision and pseudo-element neutralization remain subject to built-CSS and browser checks, not `twMerge` assumptions.

Only root accepts consumer `className`; hook uses `cn(sectionNavRootVariants(), className, hidden && 'hidden')`. Supported use is outer placement only. Recognized Tailwind conflicts may merge; cascade, legacy selectors and arbitrary utilities do not universally follow string order. The hidden safeguard must remain effective. Internal pill, trigger, next, list and links have internal CVA/`cn()` recipes and no consumer className surfaces; Popover and Surface own their own recipes.

Six existing file roles: `types.ts` props and CVA, `useSectionNav.ts` state/derivation and merges, `SectionNav.tsx` JSX, `SectionNav.test.tsx` behavior, `SectionNav.stories.tsx` examples, `index.ts` exports. No additional internal module. **No stylesheet**; story-only wrappers must not introduce shipped CSS, dependencies or token changes.

### Expected-design visual reference

| ID | Image / scenario | Provenance / status |
| --- | --- | --- |
| VIS-01 | Pending: default-width pill and open index, unhovered and hovered | Owner Image#16 is conversation-only; no recoverable image bytes or conditions. Proposed capture, not approval. |
| VIS-02 | Pending: narrow-width pill and open index, unhovered and hovered | Same source limitation; proposed capture, not approval. |

Capture conditions (exact viewport, DPR, browser/version, theme, fonts, motion/transparency, crop and date) and story source/version are pending. Following [capture guide](../../../design/README.md), agree the actual source and conditions, obtain separate hosting/tool permission, use a real browser and capture component-zone PNGs with `capture.json`, hashes and scoped owner adoption. No capture has been made here. Historical v0.1 board captures and their hashes/conditions are retained in [v0.1](../v0.1/spec.md); they are not v0.2 captures or adopted expected design. Visual conformity: **Not evaluated**. These references concern A7-AC1–AC3 and do not prove behavior or accessibility.

## 7. Acceptance criteria

All checks are planned; no runtime or visual result is claimed by this draft.

| ID | Promise | Planned check / story | Observed evidence |
| --- | --- | --- | --- |
| A7-AC1 | Pill, next control and open index fully visible in every applicable story at default and narrow widths. | Real-browser geometry and clipping checks, including Default, Hover and narrow wrapper; VIS-01/02. Empty/hidden intentionally omit controls. | Pending |
| A7-AC2 | Fullscreen meta and each story wrapper use exactly the specified clearance; no component prop or shipped CSS change. | Structural story assertions and scoped diff; no meaningful RED for story canvas. | Pending |
| A7-AC3 | Hover and focus visuals are reproducible, without hover opening. | Hover story and keyboard focus in real browser, unhovered/hovered and open index; VIS-01/02. | Pending |
| SN-01 | One named nav; ordered native links, one matching current location and decorative past/active/idle markers; empty/unmatched do not guess. | Existing public role/name, first/middle/last and empty/unmatched tests. | Pending for this draft |
| SN-02 | Radix disclosure, named portalled dialog, relationships, focus cycle, Escape, outside and navigation focus behavior. | Existing keyboard/focus tests plus browser and screen-reader integration; single-landmark amendment. | Pending |
| SN-03 | Next advances/wraps; original event, preventDefault, modified/middle native clicks; no nested controls. | Interaction tests and browser pointer/touch checks. | Pending |
| SN-04 | Host drives current/value/hidden; no global listeners; hidden removes open panel and focusable controls even under controlled delay. | Rerender, controlled/uncontrolled and focus/hide tests. | Pending |
| SN-05 | Decorative edge uses ProgressBar normalization; host supplies text. | Integration tests for 0/50/100, out-of-range and non-finite; browser fill/clipping. | Pending |
| SN-06 | Inclusive compact boundary, 44px controls, safe areas, zoom and no overflow. | Built CSS/browser at 519/520/521 and fractional neighbors, 200/400% zoom and long names. | Pending |
| SN-07 | Material overlay/fallback, focus, reduced motion and legacy isolation. | Shipped CSS computed styles, pseudo-element, media emulation and unchanged legacy fixture. | Pending |
| SN-08 | No hover timer or global shortcut; root-only placement merge, protected native attributes and public exports remain compatible. | Behavior/type/merge tests, metadata, emitted CSS and packed React 18/19 consumers. | Pending |

### Spec closure

- [ ] Capture source, conditions, real assets and owner adoption identified; visual conformity remains Not evaluated until then.
- [ ] Finalize snapshot digest and obtain exact scoped G4 approval of this version and its identified visuals. G1 and separate plan approval remain prerequisites for U7, not additional gates invented for this spec.
- [ ] Subsequent issue snapshot publication requires separate authorization; no issue body or prior approval is rewritten.

**Next step:** obtain the pending visual reference and exact owner approval, then propose/approve the bounded U7 plan separately. This draft authorizes no source, tests, token, dependency, registry or remote writes.
