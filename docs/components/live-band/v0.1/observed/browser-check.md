# LiveBand v0.1 — parent browser check

- **Environment:** Chromium headless shell 153.0.8010.12, Storybook dev (branch `feat/layer-d-live-band`), dark theme, DPR 1.
- **Probes:** parent-owned scripts outside the repository; values below are copied from their output.

## Boundaries (LB-05, gate 1)

| Part | 390 | 859 | 860 | 861 | 1079 | 1080 | 1081 | 1280 |
|---|---|---|---|---|---|---|---|---|
| Field (`[@media(width<=860px)]:`) | 1 | 1 | 1 | 2 | 2 | 2 | 2 | 2 |
| Streams (`[@media(width<=1080px)]:`) | 1 | 1 | 1 | 1 | 1 | 1 | 2 | 2 |

Both inclusive boundaries hold, in the Default and LongContent stories, with no horizontal overflow at any width. **Not measured:** fractional viewport widths.

Packed tests now prove that LiveBand's own SSR elements carry both responsive classes. The same utilities are also emitted by Footer, NowStrip, BlogGrid and NotesBoard, so asserting the selector alone could not catch their removal: the first source-mutation run survived, and after the change both mutations fail.

## VOD recipe (LB-03, LB-06, gate 2)

- **Card:** a single native anchor composed with the raised Surface.
  - Background `rgb(27, 28, 32)`.
  - Border `1px solid` hairline, radius 17.6px.
  - Light-edge inset and the two-layer elevation shadow.
- **Focus:** keyboard focus adds the token focus ring `rgb(20, 21, 24) 0 0 0 2px, rgb(255, 0, 54) 0 0 0 4px`.
- **Deviation 1 — the 16:9 utility.** The plan's `aspect-video` does not exist with the tokens theme: the theme defines no `--aspect-video` (installed-compiler probe: NONE). The cover therefore collapsed to 0px and the play, duration and title spilled out above the card. The consumer example now uses `aspect-16/9`, which has the same ratio and emits. This is the only utility change to the plan's consumer example.
- **Deviation 2 — the long title.** With a real 16:9 cover, the LongContent title (`absolute bottom-4 left-4`) ran under the play circle at 390px and from 1081px. The plan asks the composition to reserve room, so the example title now uses `right-24`, which clears the 51.2px play circle at `right-4`.
  - After both fixes: title, duration, play and badge stay inside the cover with no overlaps at any measured width.
  - The long title wraps to three lines at 390px and two lines at 1280px, with no truncation.
- **Story fix:** the example metadata below the cover has `px-4 py-3`. The Default story now uses a visible `<time dateTime>`, as LB-03 requires.

## Field, flood and motion (LB-04, gates 4 and 5)

- **Legacy:** the Field root is `position: static` (the legacy rule sets `relative`) and paints nothing (transparent, no image, no shadow).
- **Flood:** the host SectionShell `register="flood"`, named "Upcoming event", paints the brand flood (`rgb(255, 0, 54)` with `rgb(0, 0, 0)` ink). LiveBand adds no section and renders no Pixel.
- **Photo:** the framed photo has a static `rotate: 2deg`. It stays tilted on hover and has no rotation under `prefers-reduced-motion: reduce`. No element of the band has an effective transition.

## Keyboard (LB-03)

Tab order is the event CTA (`#event`), the VOD (`#recording`), the row (`#past`) and the archive (`#archive`), each with `:focus-visible`, then focus leaves the story frame.

## Not evaluated

Screen-reader output, native browser zoom, contrast of consumer text on the flood, fractional widths, and pixel comparison with VIS-01/02.
