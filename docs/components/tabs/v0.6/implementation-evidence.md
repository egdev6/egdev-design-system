# Tabs v0.6 — implementation evidence

## Observed

- The [S10 amendment](scroll-buttons-hit-area-amendment.md) records payload SHA-256 `d3bd11ad87a61e65aa6f22c0020907f1551f6c53c689aa1df24be84d01a4ca09`. The parent reports the corrected header was verified against the line-start payload definition.
- Three focused tests failed for the intended missing suppression, with 88 passing; the focused Tabs suite then passed 91/91. The final combined composition/Text suite passed 417/417.
- An earlier Chrome probe showed the extended scroll control intercepting a stationary mouse click 4px outside its visible box; with the extension suppressed, the same point selected the underlying tab. The final source-built matrix found `::after` content `none` on both scroll buttons and passed **40 mouse and 40 touch** center/visible-axis sequences across LTR/RTL and normal/reduced motion.
- The tested browser matched `(hover:hover) and (pointer:fine)`. This describes the primary pointer, not every input: a touch-capable hybrid can expose these approximately 25.6px controls. The owner accepted that compact exception because the tab list also supports dragging.

## Marker-free follow-up

The Tabs scroll area sets the internal composition attribute `data-icon-button-target="compact"`; IconButton consumes it with `[[data-icon-button-target=compact]>&]:after:content-none` on the direct scroll-button children. This is not a public prop or a new prop-naming convention, and does not use the public `eg-icon-btn` marker as a styling hook. All existing Tabs registry usages were reviewed and their whole-file source revisions refreshed.

The three-component focused run went from 14 intended failures and 120 passes to 134/134. In source-built Chrome 148, the end scroll button's pseudo-element was suppressed for underline, full-width segmented and full-width outline, with and without fill, in LTR and RTL. In all **12** configurations a stationary mouse click 4px outside the visible button hit and selected the underlying tab. The same browser check confirmed standalone and nested IconButtons retained their extended targets.

## Pending

The earlier full matrix checked control targets and click delivery, not the resulting scroll distance at every point; the marker-free follow-up did not rerun that entire matrix. Physical hybrid/coarse-primary devices, assistive technology and approved visual references remain pending. The parent owns a fresh package build and package-exports recheck. Visual conformity is **Not evaluated**. See the [shared IconButton evidence](../../icon-button/v0.4/implementation-evidence.md) for full commands and browser scope.
