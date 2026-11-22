# AttachmentField v0.3 — implementation evidence

## Observed

- The [S11 spacing amendment](remove-action-hit-area-amendment.md) records payload SHA-256 `e573cf4747cd5f6e40588e142735c2ba52b8f26b83350d181986b9d529bf6b5c`. The parent reports the corrected header was verified against the line-start payload definition.
- Two focused tests failed for the intended missing root/strip spacing, with 99 passing; the focused AttachmentField suite then passed 101/101. The first browser probes found the 9.6px root and strip gaps sufficient for their tested `elementFromPoint` and stationary events.
- A later isolated touch at a Remove corner showed that the v0.3 root gap did not guarantee clearance: `elementFromPoint` returned the IconButton, while Chrome targeted the nearby Textarea from pointer-down through click. The strip did not scroll or move, no pointer cancellation occurred, and changing `touch-action` did not fix the probe. The effect also reproduced in LTR at the same coordinates.
- The approved [v0.4 amendment](../v0.4/implementation-evidence.md) supersedes v0.3's root-gap value and clearance claim, retaining the `gap-3` strip. The final corrected implementation and exact-position regression passed the matrix described there.

## Pending

Do not treat the historical 9.6px root as an accepted general touch-clearance result. Physical-device and assistive-technology checks and approved visual references remain pending. Visual conformity is **Not evaluated**. The [shared IconButton evidence](../../icon-button/v0.4/implementation-evidence.md) records the complete checks and environment.
