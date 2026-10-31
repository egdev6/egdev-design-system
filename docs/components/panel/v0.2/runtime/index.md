# Panel runtime evidence

Browser and Storybook evidence recorded by the parent session for the first remaining-components wave
(Indicator, Panel, Collapsible) on top of `f88b36e`. PNG files are byte-for-byte copies of the original capture run; JSON files are Biome-formatted copies
(whitespace only, parsed content identical to the capture). The SHA-256 column binds each committed file.

This evidence is bounded: it is not independent or native review approval, not true browser zoom,
not assistive-technology (AT) acceptance and not universal cross-browser or pixel parity. Final zoom/AT
acceptance remains an owner decision.

| File | SHA-256 | Proves |
|---|---|---|
| [`browser-matrix.json`](browser-matrix.json) | `dfab3af3e080e37f3cc8f31ead75e40a113f078affd58dd5efc397f24ac86c80` | Ten stories at 1280 and 390 CSS px (20 scenes) with no horizontal document overflow, including inherited, floating and Popover hosts. |
| [`banded-canonical-390.png`](banded-canonical-390.png) | `0c0857f2a12a9e05dccefcc452b8bfcfc32e6cc46bec99f971553d785b1cb428` | Banded story at 390 CSS px under the canonical capture condition. |
| [`keyboard-popover.json`](keyboard-popover.json) | `886ad4818a73cb67b651b7e978723601f4184080c2e903673dd5f494f5cd4f3a` | Native child activation counts, Tab order, real Popover Enter/open, body focus order and Escape/unmount. |
| [`popover-focus-restoration-followup.json`](popover-focus-restoration-followup.json) | `cc5bace881b3e18e030410bbb382f32a442537525698e741aa1ad374cf6bf349` | Scoped, awaited follow-up proving trigger focus restoration and aria-expanded after close; the earlier unscoped query and premature BODY read are preserved as superseded. |
| [`actual-controls-docs.json`](actual-controls-docs.json) | `c679990c624d548b3fcc7a7d443eacba9c3a184e25e855adcf49de7807ede65a` | Actual root Docs/Controls: 8 rows matching scope. |
| [`actual-subcomponent-docs.json`](actual-subcomponent-docs.json) | `966303fac3cb42d9c2e68ec2c1ade7dc37378405617732a7b704f11e53b0a80d` | Actual readonly part tables: three parts with six rows each. |
