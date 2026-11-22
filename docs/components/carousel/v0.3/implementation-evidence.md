# Carousel v0.3 — implementation evidence

## Observed

- The [S11 spacing amendment](controls-hit-area-amendment.md) records payload SHA-256 `98d6e6894315f9eb3b1a3027529b25d5783342442da09bc3cf7706ed12fb67ad`. The parent reports the corrected header was verified against the line-start payload definition.
- Two focused tests failed for the intended missing `gap-3`, with 67 passing; the focused Carousel suite then passed 69/69. The final combined composition/Text suite passed 417/417.
- The prior `gap-2` measured approximately 6.39px, and points at one target's edge hit the neighboring control. The final default-token control gap measured 9.6px. Both controls passed **72 mouse and 72 touch** center/edge/corner sequences across LTR/RTL and normal/reduced motion, each yielding the intended controlled value request.

## Pending

The matrix used a controlled three-slide fixture; physical devices, downstream placement, assistive technology and visual references remain unverified. Visual conformity is **Not evaluated**. See the [shared IconButton evidence](../../icon-button/v0.4/implementation-evidence.md) for the browser environment and all automated checks.
