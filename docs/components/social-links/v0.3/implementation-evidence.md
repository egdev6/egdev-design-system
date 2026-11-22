# SocialLinks v0.3 — implementation evidence

## Observed

- The [S12 amendment](spacing-amendment.md) records payload SHA-256 `f926c6b9a6db4fa3463315745aac823ce9cdc3b963d49cd3c62df476bfd96d6a`. The parent reports the corrected header was verified against the line-start payload definition.
- SocialLinks and ListItem spacing tests first produced seven intended failures and 64 passes; after implementation, the focused pair passed 71/71. The final combined composition/Text run passed 417/417.
- Both requested gap values retain their public type and default. The effective default-token gaps are `gap-5` (16px) for `md` and `gap-3` (9.6px) for `lg`.
- Chrome's current-source matrix exercised both sizes, both requested gaps and horizontal/wrapped layouts, in LTR and RTL with normal/reduced motion. Across those four direction/motion configurations, **576 mouse and 576 touch** stationary sequences passed at centers, edges and corners. Native anchor clicks were observed but navigation was prevented in the fixture.

## Pending

The results depend on default tokens and unobstructed hosts; clipping, overlays, scaling and consumer layouts can invalidate clearance. Physical devices, actual downstream navigation, assistive technology and visual-reference comparison remain pending. Visual conformity is **Not evaluated**. The [shared IconButton evidence](../../icon-button/v0.4/implementation-evidence.md) records the browser environment and full check results.
