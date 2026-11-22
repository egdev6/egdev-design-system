# ListItem v0.3 — implementation evidence

## Observed

- The [S9 action-spacing amendment](spacing-amendment.md) records payload SHA-256 `6b32ee9b47ef6cab7aac3d3d453b889a40c7fb53628b7e789c83ce1a066818be`. Its `gap-4` action band was subsequently superseded by the owner's S12 margin decision in [ListItem v0.4](../v0.4/implementation-evidence.md).
- The earlier implementation worker reported six intended failures in its combined composition RED run, then 331/331 GREEN. The final combined composition/Text suite passed 417/417 against the current `gap-5` implementation.
- The current browser matrix covers four md/lg action pairs in LTR/RTL and normal/reduced motion; it is evidence for v0.4, not a separate acceptance test of the superseded v0.3 gap.

## Pending

No separate final browser acceptance is claimed for the historical `gap-4` layout. Consumer layouts involving smaller neighboring controls, real devices and assistive technologies remain separately unverified. Visual conformity is **Not evaluated**. See the [shared IconButton evidence](../../icon-button/v0.4/implementation-evidence.md) for commands and environment.
