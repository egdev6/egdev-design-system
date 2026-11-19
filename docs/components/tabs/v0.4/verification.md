# Tabs v0.4 / v0.4-A — browser verification

- **Date:** 2026-11-19
- **Build:** `feat/tabs-edge-fade` at `f884a52` plus the RTL `DirectionProvider` correction
- **Browser:** Chrome 157 (Windows) through Playwright, Storybook story `Molecules/Tabs/EdgeFade`. The story renders three 153.6px-wide lists: underline LTR, underline RTL inside a Radix `DirectionProvider`, and segmented `fullWidth`.
- **Method:** computed styles, scroll geometry and `data-state` were read after each action, with ~200ms for React updates. These are implementation captures, not approved expected-design references.

## RTL correction

Radix `Tabs.Root` writes `dir="ltr"` when no `DirectionProvider` is present, so a bare `dir="rtl"` on an ancestor was ignored: the earlier RTL example rendered LTR, and the first RTL measurement (task log L5) was invalid. Owner decision (2026-11-19): no API change; right to left comes from a Radix `DirectionProvider` ancestor. The specs, the story and the `TabsProps` JSDoc now say so.

## Results

| AC | Observation | Result |
| --- | --- | --- |
| v0.4 AC-02 | Mask edge sizes (start / end) at start, middle and end. LTR: 0 / 25.6, 25.6 / 25.6, 25.6 / 0. RTL mirrors them physically; at the RTL end there is a 0.4px subpixel residue. Segmented `fullWidth` matches LTR. | Pass |
| v0.4-A AC-07 | Scroll area and buttons exist only on the three scrollable lists (unit tests cover the intrinsic DOM). | Pass |
| v0.4-A AC-08 | Button states: start `hidden`/`visible`, middle `visible`/`visible`, end `visible`/`hidden`, in LTR, RTL (`scrollLeft` 0 → −514) and segmented `fullWidth`. | Pass |
| v0.4-A AC-09 | The end button scrolls one page: 102px = 153.6 − 2 × 25.6 (LTR +102, RTL −102). Selection is unchanged. | Pass |
| v0.4-A AC-10 | With the pointer resting on the end button as the list reaches the end, the button becomes `inert`. A further click does not scroll; pointer leave sets `hidden`. | Pass |
| v0.4-A AC-11 | Buttons have `aria-hidden="true"` and render at 25.6px. Under CDP touch emulation `(hover: hover) and (pointer: fine)` is false and every button computes `display: none`. | Pass |
| v0.4-A AC-12 | Arrow-key sweep over the underline list: every focused mid-list tab sits about 25px or more from both edges (scroll position rounding). It is 0 only at the extremes, where neither fade nor button shows. In true RTL, `ArrowLeft` moves forward. | Pass |
| v0.4-A AC-13 | The v0.4 unit tests stay green (full suite). | Pass |

## Captures

| Visual ID | File | Scenario |
| --- | --- | --- |
| VIS-01, VIS-04, VIS-06 | [vis-scroll-start.png](vis-scroll-start.png) | All three lists at the start |
| VIS-02, VIS-04, VIS-06 | [vis-scroll-middle.png](vis-scroll-middle.png) | Middle: both fades and both buttons |
| VIS-04, VIS-06 | [vis-scroll-end.png](vis-scroll-end.png) | End |
| VIS-05 | [vis-05-inert.png](vis-05-inert.png) | Pointer resting on the underline end button at the end (inert) |

VIS-03 (keyboard focus on the last visible tab) was measured numerically in the AC-12 sweep, not captured.

## Not evaluated

Firefox and Safari (no scroll-timeline fade in Firefox by design), forced colors, and an owner visual review of the ghost chevrons over the faded labels.
