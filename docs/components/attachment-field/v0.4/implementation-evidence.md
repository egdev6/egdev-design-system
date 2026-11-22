# AttachmentField v0.4 — implementation evidence

## Observed

- The [S11/L25 superseding amendment](remove-action-hit-area-amendment.md) records payload SHA-256 `89e3a613b91b4d6353718d5d7f7991d9b7ca7d0f512d2c13904396877cc734e2`. The parent reports the corrected header was verified against the line-start payload definition.
- RED: `pnpm exec vitest run packages/ui/src/molecules/attachment-field/AttachmentField.test.tsx --maxWorkers=2 --no-cache --configLoader runner` exited 1 with one intended root-gap failure and 100 passes. GREEN: the same command exited 0 with 101/101 passing, including existing wrapping, geometry and controlled-removal cases. The final combined composition/Text suite passed 417/417.
- The current-source Chrome matrix measured a 12.8px root gap (`gap-4`) and a 9.6px thumbnail-strip gap (`gap-3`). Wide and wrapped fixtures passed **144 mouse and 144 touch** center/edge/corner sequences across LTR/RTL and normal/reduced motion, with one intended removal request per sequence.
- A separate fixture reproduced the previous button box `(827.1875, 1711.59375, 25.59375, 25.59375)`. All four Remove corners and the neighboring Textarea boundary passed mouse and touch in both directions and motion modes: **40 additional sequences**. The formerly failing point was approximately `(817.984375, 1702.390625)`; the corrected fixture directed the touch to Remove, while a point inside the Textarea still targeted the Textarea.
- Thumbnail dimensions, corner-button positioning and the strip's `gap-3` were retained. The root spacing change is visible in flow and is disclosed in the UI changelog and story guidance.

## Pending

These observations cover a specific default-token fixture and synthetic Chrome input, not arbitrary adjacent controls, physical devices or all browsers. Assistive technology, visual-reference comparison and the final distributable package remain unverified. Visual conformity is **Not evaluated**. See the [shared IconButton evidence](../../icon-button/v0.4/implementation-evidence.md) for all commands and broader limitations.
