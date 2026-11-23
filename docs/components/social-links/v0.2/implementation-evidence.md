# SocialLinks v0.2 — implementation evidence

## Observed

- The [S8 minimum-spacing amendment](spacing-amendment.md) has payload SHA-256 `2f98cd205d56aae5cfcb56135220ae3f81d756f5d8d60e350cb92f03f0b8d70e`. It preserves the public `gap?: 1 | 2` values and default while changing effective spacing by size.
- In the historical Chrome check, `md gap-4` resolved to a 12.796875px visible gap. At first-link center offsets `(22, 0)`, `(22, -22)` and `(22, 22)`, `elementFromPoint` returned the second link. This was a rest hit-test observation, not a dispatched click.
- The owner chose S12 after that finding. [SocialLinks v0.3](../v0.3/implementation-evidence.md) supersedes v0.2's effective minimums with a token margin; do not present the historical v0.2 minimum as the current behavior.
- The final combined focused suite, including SocialLinks, passed 417/417. The final source-built browser matrix passed the current v0.3 composition; commands and environment are in the [IconButton evidence](../../icon-button/v0.4/implementation-evidence.md).

## Pending

The isolated v0.2 geometry was not retested as a final accepted configuration. Physical-device and assistive-technology testing, downstream application layouts and approved visual references remain pending. Visual conformity is **Not evaluated**.
