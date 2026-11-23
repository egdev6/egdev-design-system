# ListItem v0.4 — implementation evidence

## Observed

- The [S12 margin amendment](spacing-amendment.md) records payload SHA-256 `89f05852055879e35afc9df0d2a1af40d389164f66fb7d7e2d05f285111661db`. The parent reports the corrected header was verified against the line-start payload definition.
- SocialLinks and ListItem spacing tests first produced seven intended failures and 64 passes; after implementation, the focused pair passed 71/71. The final combined composition/Text run passed 417/417.
- The action band uses `gap-5`, measured as 16px under default tokens. Four pairings (`md/md`, `md/lg`, `lg/md`, `lg/lg`) received center, edge and corner mouse/touch sequences in LTR/RTL and normal/reduced motion: **288 mouse and 288 touch** sequences passed, with one intended independent action per sequence.
- Guidance states that `sm/md` needs consumer-supplied `gap-6`, and `sm/sm` needs `gap-7`; neighboring rows, text, clipping and overlays also need clearance.

## Pending

The final browser matrix did not exercise consumer-supplied small-size pairs or real downstream rows. Physical devices, assistive technology and visual-reference comparison remain pending. Visual conformity is **Not evaluated**. See the [shared IconButton evidence](../../icon-button/v0.4/implementation-evidence.md) for the environment and complete checks.
