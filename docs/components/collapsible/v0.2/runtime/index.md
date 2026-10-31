# Collapsible runtime evidence

Browser and Storybook evidence recorded by the parent session for the first remaining-components wave
(Indicator, Panel, Collapsible) on top of `f88b36e`. PNG files are byte-for-byte copies of the original capture run; JSON files are Biome-formatted copies
(whitespace only, parsed content identical to the capture). The SHA-256 column binds each committed file.

This evidence is bounded: it is not independent or native review approval, not true browser zoom,
not assistive-technology (AT) acceptance and not universal cross-browser or pixel parity. Final zoom/AT
acceptance remains an owner decision.

| File | SHA-256 | Proves |
|---|---|---|
| [`browser-matrix.json`](browser-matrix.json) | `b38290a30f83ff473bfd502cc02da4b1b8026a87c460ce890573bfb177359ca7` | Seventeen stories at 1280 and 390 CSS px (34 scenes) with no horizontal document overflow, plus root/trigger/content structure per scene. |
| [`functional-browser.json`](functional-browser.json) | `53bd7d95ba0ee80eb6d328451cdcec89a7ee4c293d4144891681e72be9bc521c` | Eleven functional cases: amended closed/open/reopen ARIA relationships, keyboard order, cancellation, disabled-open editable content, controlled acceptance, caller-owned close and ref focus, remount, independent IDs, nested unmount and named region. |
| [`reduced-motion-caret-wrapper.json`](reduced-motion-caret-wrapper.json) | `2a7583537f7164eb204ffa44398e8ad63b8fed0631aac0ed57155425a837cb2e` | Real reduced-motion emulation changes the caret wrapper rotation from 180deg to 0deg and transition-property to none. |
| [`reduced-motion-text-enlargement.json`](reduced-motion-text-enlargement.json) | `f4557d0250c42937de954fba9143b65fa1ce9879e58a79e2adb105f2a0cad582` | Reduced-motion and root-font enlargement probe; root-font enlargement is not true browser zoom. |
| [`long-label-rootfont32-probe.png`](long-label-rootfont32-probe.png) | `8a0864c16329a63abc7f2ea7d52d97c28c24374e8932d26552591ce151e289a8` | Long-label scene with a 32px root font probe; not true browser zoom. |
| [`actual-controls-first.json`](actual-controls-first.json) | `c07ac2d1b9b7df7957442555fdad5a03b5349d97a91fb01439556d2ba4f8d3b8` | First Controls panel read: rows and the disabled row as rendered. |
| [`controls-checkbox-red.json`](controls-checkbox-red.json) | `252e04a1c1686fc4944d342db9724cdd63532cd5b1cb644d5d1fadde3766df9e` | Preserved RED: a direct native Controls input check timed out because the switch input is deliberately clipped (1px); not a component defect. |
| [`actual-controls-docs.json`](actual-controls-docs.json) | `b738c6296774fd9abafd3372627b828acc21cab706c8325f91e3b0c8508f24e9` | Actual Docs/Controls after driving the associated label: disabled control, tabs and part tables (root 10, Trigger 12, Content 8 rows). Captured before the Docgen patch; Trigger handler types there show the defect. |
| [`docgen-cache-regressions.json`](docgen-cache-regressions.json) | `69f2e2161b49e87dcd875615c94227d5cc3de69916f4dfd55921e77704e37deb` | Regression test sources added for the react-docgen-typescript@2.4.0 inherited-prop cache defect (normal-order Collapsible Trigger button handlers and mixed Popover button/div parts). |
| [`docgen-patched-docs.json`](docgen-patched-docs.json) | `5f1f5e6a7f558b330ef446789fc9daf4f6a21d2864d7398b182516894e1ae50e` | After the same-version patch: real Storybook Docs shows CollapsibleTrigger onClick/onKeyDown/onFocus/onBlur as HTMLButtonElement handlers in __docgenInfo and the visible table; Popover Trigger/Close button and Content div remain correct. |
| [`source-checkpoint.json`](source-checkpoint.json) | `c74166233ee5870299a6d361dfc81eeded712238ced96070c53c84ab81613cd3` | Source checkpoint for the first wave: baseline commit, hash kind, per-worktree source hashes and observed artifacts at checkpoint time. |
