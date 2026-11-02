# TipCard v0.1 — browser verification

Parent checked Chromium headless shell1243, dark Storybook port6125, viewport390×844. Inspected Default and LongLabel screenshots against adopted VIS-01 with approved differences: solid Material frame, caption below rather than scrim overlay, wrapping label and no active/coverflow emphasis. Diagnostic cover is test artwork, not visual parity artwork.

- Default, WithoutBadge, LongLabel and Widths preserve measured cover width/height2/3 at tested root widths152,254,356px; caption remains below and in flow. No root horizontal overflow.
- All diagnostic images loaded in the normal-image run. Heading wraps in the narrow LongLabel screenshot without truncation.
- Explicit host variables --ad=1/--d=2 leave computed opacity1, transform none and transform-style flat; legacy coverflow cannot alter the new passive poster.
- Failed-image setup initially did not establish failure because the fixture remained loaded. Corrected harness assigned an intercepted URL and awaited its error event; img.complete=true/naturalWidth=0 was asserted before measuring.
- Failed images reserve exact2:3 in both flex-column and grid hosts at160px and280px; measured reservation heights205.2px and385.2px, respectively, with no overflow.
- CSS zoom200% reflow stress test passed (not a browser-native zoom claim). Poster adds no Tab stop and computed animation-name remains none with reduced motion.

Evidence: normal measurements/screenshots from job-219; explicit image-error/flex/grid/zoom/keyboard checks from job-222, exit0. No screen-reader session, native browser zoom or pixel-equivalence claim. Final package and full-suite verification is recorded separately.
