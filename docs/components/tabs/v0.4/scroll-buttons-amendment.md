# Tabs — scroll buttons amendment (v0.4-A)

- **Version / status:** v0.4-A — **Approved — 2026-11-19** by the owner (reply "si" to the draft and its three open decisions: fine-pointer buttons with inert-while-hovered, rotated `chevron-down`, underline focus reveal).
- **Amends:** the approved [v0.4 edge-fade amendment](edge-fade-amendment.md) (`contentSHA256: 4bf76b8f014447af778d71e8ca9fcc532ce52419ab21ea180e66b2974b4404d0`) before release. It **supersedes owner decision 3** of v0.4 (option A, "keep the underline scrollbar hidden; chevrons are phase 2") and **changes one v0.2 promise**: underline focus scrolling. Every other v0.4 promise stays.
- **Reason:** owner review in Storybook (2026-11-19): "el gradiente tapa parte del ultimo elemento y no hay nada que permita scrolear en horizontal? habría que valorar añadir botones con flechas y ocultar el gradiente/botones al llegar a los extremos?" Browser measurement in Chrome 157 also found that, on underline, arrow-key focus can leave a partly visible tab up to 25px under the fade (Chrome does not scroll a partially visible element on `focus()`).
- **Approval / recovery:** this file is the recoverable snapshot; canonical issue #107. Approval covers this amendment only, not the updated implementation plan.
- **Snapshot identity:** `version: v0.4-A`; `contentSHA256: 1330129a42eae5f49241d156b8746ec81e104eaccd9467afa3c3fcfbb09504c9`; `visualHashes: VIS-04..06 Pending`; `approvalReference: owner conversation 2026-11-19`. (RTL correction 2026-11-19, owner decision: RTL comes from a Radix `DirectionProvider`; recomputed per the hash definition. The approved value before this correction was `c1a1450e…`.)
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, LF line endings and the final newline.

## 1. Purpose and scope

- **Need:** let mouse users scroll an overflowing tab list without a visible scrollbar, and hide the affordances (fade and buttons) at the extremes. Keep touch on the fade only.
- **Scope:** the same scrollable lists as v0.4: `underline`, and `segmented` / `outline` with `fullWidth`.
- **Non-goals:** a visible scrollbar on underline; buttons on touch or coarse pointers; keyboard access to the buttons; vertical orientation; new props.
- **Cataloging:** composition of the exported `IconButton` atom and `Icon` glyphs inside the existing molecule. No new component.

## 2. Anatomy and composition

| Part | Responsibility | Native element / primitive | Allowed content |
| --- | --- | --- | --- |
| Scroll area (new, internal) | Positioning context for the list and its buttons | `div` | List and the two buttons |
| List | Scrollport, fade, roving focus | Radix `Tabs.List` | Triggers |
| Start / end scroll buttons (new, internal) | Scroll one page toward the inline start or end | `IconButton` (native `button`) | One rotated `chevron-down` `Icon` |

- **Composition:** the scroll area wraps the list only in the scrollable configurations; non-`fullWidth` segmented/outline keep the v0.3 DOM. The buttons are absolutely positioned over the list's faded edges, so they sit on the host background the fade reveals.
- **Icons:** `Icon` ships only `chevron-down` (`packages/ui/src/atoms/icon/icon-paths.ts:139`). Proposed: rotate it with static `rotate-90` / `-rotate-90` utilities, mirrored with `rtl:`, instead of adding glyphs.
- **Public markers:** `eg-tabs` unchanged. No new public markers; the new parts are internal. **Compatibility note:** in scrollable configurations the list is no longer a direct child of the root, which breaks consumer selectors such as `.eg-tabs > [role=tablist]` (unsupported, but possible).

## 3. Public API

**No API change.** The buttons are intrinsic to overflow, so the prop-naming lookup is Not applicable. The button labels are internal English strings ("Scroll tabs to start" / "Scroll tabs to end"), present only for IconButton's required `label` and hidden from assistive technology with the button.

## 4. Behavior

| State / action | Expected result | Event |
| --- | --- | --- |
| No overflow | No buttons, no fade (v0.4 AC-01) | None |
| Fine pointer, hidden content at the inline end | End button visible over the faded edge | None |
| Fine pointer, scrolled to the middle | Both buttons visible | None |
| Click the end (start) button | Scrolls toward the inline end (start) by the visible width minus both edge zones; `smooth`, or `instant` under reduced motion | None; selection unchanged |
| Reach an extreme while the pointer is **not** over that button | Button hides immediately (no hit target) | None |
| Reach an extreme while the pointer **is** over that button | Button stays in place, inert (clicks do nothing) and at low opacity, until the pointer leaves; then it hides. Prevents clicking what lies underneath | None |
| Coarse pointer or no hover (touch) | Never renders the buttons; fade only | None |
| Resize, font load or item change alters overflow | Button state updates (`ResizeObserver` plus scroll listener) | None |
| RTL from a Radix `DirectionProvider` ancestor | Start/end follow the logical inline direction; chevrons mirror | None |
| Keyboard focus moves to a tab on any scrollable list, including underline | The tab scrolls fully outside the edge zones (`scrollIntoView({ block: 'nearest', inline: 'nearest' })`, which honors `scroll-padding`). **Changes the v0.2 underline promise** "preserves native focus scrolling" | Existing Radix selection request only |

- **State representation:** each button exposes its own `data-state` (`visible` / `inert` / `hidden`) from the hook; the inert state is not native `disabled`, because disabled buttons do not dispatch the pointer-leave the state depends on.
- **Consumer responsibilities:** unchanged.

## 5. Accessibility

- **Buttons:** `aria-hidden="true"` and `tabIndex={-1}`. They duplicate what Radix arrow keys and swipe already provide, so they are excluded from the tab order and the accessibility tree. No announcement.
- **Focus:** `scroll-padding-inline` is at least the button width (and therefore at least the fade), so a focused tab never sits under a button or the fade.
- **Pointer target:** IconButton's existing size preset; the inert state keeps the target in place so a repeated click cannot fall through.
- **Reduced motion:** button scrolling uses `instant`. The scroll-linked fade is unchanged.

## 6. Appearance

- **Buttons:** existing `IconButton` recipe, proposed `variant='ghost'`, `size='sm'`; no new paint. Visibility through static `data-[state=…]` utilities (opacity, `invisible`, `pointer-events-none`) and the `[@media(hover:hover)_and_(pointer:fine)]` variant; no mirrored classes.
- **Edge zone:** the v0.4 fade width becomes the button region width, so the fade and the button share one zone. The exact spacing step is fixed in the plan after measuring IconButton `sm`; no new token.
- **Token / stylesheet:** unchanged from v0.4 and its implementation correction (static three-layer `--mask-scroll-fade-inline`, `tabs.css` limited to scroll-driven masking).
- **Files:** the six mandatory files plus `tabs.css`. The hook gains the edge-state logic; `Tabs.tsx` renders the scroll area and buttons.

### Expected-design visual reference

| Visual ID | Scenario | Status |
| --- | --- | --- |
| VIS-04 | Underline at start, middle and end with fine pointer: buttons plus fade | Pending capture |
| VIS-05 | Pointer resting on the end button when the end is reached: inert state | Pending |
| VIS-06 | RTL and segmented `fullWidth` with buttons | Pending |

## 7. Acceptance criteria

| ID | Observable promise | Planned test / method | Planned visual check | Observed |
| --- | --- | --- | --- | --- |
| AC-07 | Buttons render only for scrollable configurations; non-`fullWidth` segmented/outline DOM is unchanged | `Tabs.test.tsx` structure assertions | Not applicable | Pending |
| AC-08 | Button state follows the scroll edges, including resize and RTL | Hook test with mocked geometry, scroll and `ResizeObserver` | Real browser; VIS-04/06 | Pending |
| AC-09 | Click scrolls one page toward its side; `instant` under reduced motion; selection unchanged | `userEvent` click with `scrollBy` spy, `matchMedia` mock | Real browser | Pending |
| AC-10 | Inert-while-hovered: reaching an extreme under the pointer keeps the button inert until pointer leave, then hides | Pointer event test | Real browser; VIS-05 | Pending |
| AC-11 | Buttons are `aria-hidden`, out of the tab order, and absent on coarse pointers | Role/attribute tests; media query in emitted CSS | Real browser touch emulation | Pending |
| AC-12 | Keyboard focus on any scrollable list lands the tab outside the edge zones, underline included | Updated v0.2 focus test (intentional change), `scrollIntoView` spy | Real browser arrow-key sweep | Pending |
| AC-13 | v0.4 AC-01–AC-06 still hold | Existing v0.4 tests | VIS-01..03 | Pending |

### Open decisions (blocking)

1. Approve the buttons on fine pointers only, with the inert-while-hovered behavior.
2. Approve rotating `chevron-down` (recommended) instead of adding left/right glyphs to `Icon`.
3. Approve the v0.2 change: underline focus uses the same `scrollIntoView` reveal when it overflows.
