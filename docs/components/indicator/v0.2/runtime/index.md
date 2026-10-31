# Indicator runtime evidence

Browser and Storybook evidence recorded by the parent session for the first remaining-components wave
(Indicator, Panel, Collapsible) on top of `f88b36e`. PNG files are byte-for-byte copies of the original capture run; JSON files are Biome-formatted copies
(whitespace only, parsed content identical to the capture). The SHA-256 column binds each committed file.

This evidence is bounded: it is not independent or native review approval, not true browser zoom,
not assistive-technology (AT) acceptance and not universal cross-browser or pixel parity. Final zoom/AT
acceptance remains an owner decision.

| File | SHA-256 | Proves |
|---|---|---|
| [`browser-matrix.json`](browser-matrix.json) | `b2522978c76bf98573ba29777f36d67b0376365b5e8d3a5c4bc910fc7b6c4015` | Nine stories at 1280 CSS px: anchors, markers and no horizontal document overflow. |
| [`pointer-keyboard.json`](pointer-keyboard.json) | `25a9530e5ba54fb1365e7ed08e5e260d62522c91e9f5c1ccecc2b2cabe4fbc8b` | Count-marker hit-through reaches the real child; mouse/Enter/Space produce 3 clicks and disabled 0; Tab skips the passive root and the disabled child. |
| [`actual-controls.json`](actual-controls.json) | `593b98306eb42ba5dabc17bad270027a8022a82341b5c1345e4e3b8b08b1ef2d` | Actual Controls panel: 17 rows and 16 widgets, including count 120 to 99+ and max 9 to 9+. |
| [`actual-controls-position.json`](actual-controls-position.json) | `c2aa0fee764e47704f5e00f862e69fe9f5f9bf335eb3ce4d4b26a310008d63e4` | Position control reaches bottom-left after waiting for asynchronous iframe args; the earlier immediate stale read is preserved, not a passing assertion. |
| [`actual-docs.json`](actual-docs.json) | `30afe5d4532b32bf969975b6ccf4e05c6709f04024f8e288e5150f9685c2a3bc` | Actual Docs table headers, defaults and enums. |
| [`narrow-text-enlargement.json`](narrow-text-enlargement.json) | `1c723d1b18f01b14297a717320f5f1e48ac7bffa27a654afe5ca5ef92145caee` | Narrow root-font enlargement probes; not true browser zoom or proof that fixed-pixel text enlarges. |
| [`canonical-capture-conditions.json`](canonical-capture-conditions.json) | `220d191a8d3872442755d9e64609c7cb19bef795ca46f3e46df6fb94caf06bfe` | Capture-only condition: the published tokens stylesheet is appended after the Storybook palette alias (red300) to restore the canonical danger colour; no source or token edits. |
| [`default-as-is.png`](default-as-is.png) | `b4ebc7fc756bfe9475ab9624118401513002b973418136782c777f9e9d3e7d69` | Default story as rendered with the existing Storybook palette alias (as-is). |
| [`branches-canonical.png`](branches-canonical.png) | `fe6ecdd08a16096bf1fd4d67c282d0cefa271d70b8a77bc2dc926a7ea3272010` | Branches story under the canonical capture condition. |
| [`avatar-before-after.json`](avatar-before-after.json) | `7855a21874184f9f9913aa00371a80ea06f49ddff82a7bfc4dd3799905f75758` | Avatar before (baseline f88b36e) and after the approved adapter: four sizes times active/paused plus the network badge/ring story have equal collected geometry, paint and semantics. |
| [`avatar-network-badge-before-after-identical.png`](avatar-network-badge-before-after-identical.png) | `462c1d44ea4cd7188b580729afa3ad69cac64fd343f5b199c23b28f718e6e727` | Network badge/ring capture; before and after PNG bytes are identical. |
| [`avatar-media-decorative-ab.json`](avatar-media-decorative-ab.json) | `f150ed93e9ec8720538ff99afc646f9689d2a0b0709545a65df7fc916a82e6fa` | Loaded image/cover/empty-alt, broken-image fallback and decorative/no-focus semantics: three exact before/after comparisons. |
