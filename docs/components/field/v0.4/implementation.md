# Field v0.4 implementation evidence

## Authority and scope

- The [approved trailing-choice amendment](choice-trailing-amendment.md) adds an opt-in text-first layout to the v0.1–v0.3 Field contract. Its canonical UTF-8 payload from `## 1. Purpose and scope` through EOF has SHA-256 `2916c73a5bda9d57082343fb6eccd1c5b7ed5487f90dee5f22999e528fd7bd00`; its original header remains unchanged and pending publication.
- The separately approved implementation plan is [task T1, S1–S10](../../../../odd/tasks/field-choice-trailing.md); its owner choices resolve alignment, spacing and the implementation gate. This record is not independent review or visual approval. Request: [#411](https://github.com/egdev6/egdev-design-system/issues/411).
- The existing six roles and public exports remain. No stylesheet, runtime module, token or dependency was added. Existing `choice` coarse-target sizing and Switch thumb RTL behavior remain separate issues [#431](https://github.com/egdev6/egdev-design-system/issues/431) and [#432](https://github.com/egdev6/egdev-design-system/issues/432).

## Implementation

`layout='choice-trailing'` puts the Label row, optional FieldMessage wrapper and unchanged slotted Checkbox or Switch in that DOM order. A logical two-column grid positions the text in column one and auto-places the control in column two, centered with the label row. The visible label itself receives the coarse-pointer minimum height and wrapping utilities. Blank root space is not an activation target; if the label is hidden the consumer must provide an equivalent usable target. Existing stacked and control-first choice layouts remain unchanged.

Both choice layouts omit counter and readout. Field retains its existing generated or supplied child id, child-first deduplicated descriptions, error precedence and Slot/ref behavior. Controlled state and all keyboard, focus and checked behavior remain with the supplied Radix control. Field-owned disabled text wrappers dim once; the atom owns its own disabled appearance.

The choice-trailing root may scope token-backed font family, size, weight and line-height rules to the existing `eg-label` and `eg-field-message` roots. This does not permit changing colors, geometry or control internals. CSS layer and specificity govern precedence; `cn` only merges utilities. `TrailingScopedTypography` illustrates the bounded selector surface, not a general part-override API.

The [naming registry](../../../../skills/_shared/prop-naming.json) reuses approved `label-layout` / `layout` without modifying its convention or approval. The owner approved the `choice-trailing` Field value in the amendment; no global convention is newly approved. All eight Field usage revisions were refreshed against the reviewed `FieldProps` source, whole-file SHA-256 `8a0329bb1d247c6ca55d598f86254d83e8ae20b571596dce3ed7c3ddf5d229ea`. `field-guidance-tone` remains proposed.

Storybook adds `TrailingSwitch`, `TrailingCheckbox`, `TrailingDisabled`, `TrailingLongText`, `TrailingRtl` and `TrailingScopedTypography`; no manual `argTypes` or `play` functions were added. Actual browser widgets and selector cascade remain separate checks.

## Observed test-first evidence

- **RED:** `pnpm exec vitest run packages/ui/src/molecules/field packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts --maxWorkers=2 --no-cache --configLoader runner` exited 1: 8 failed and 440 passed. Both atoms lacked the new grid and label classes and incorrectly retained counter/readout; real docgen and registered Controls lacked the new option.
- **GREEN:** the same command exited 0 with 449 tests across 3 files after implementation and the in-memory CSS check. Existing stacked/choice assertions were retained. The new public-interface tests cover both atoms' order, markers, label activation, controlled/disabled state, relationships and refs, keyboard, classes, single-part dimming and omitted content.
- The production CSS entry is compiled in memory with no emitted build artifacts; the focused check verifies the grid template, word wrapping and the coarse-pointer 14-step minimum. This establishes utility emission, not actual browser layout or hit geometry.
- `pnpm props:docs && pnpm props:check && pnpm test:props` exited 0: generated view current, registry valid, 119 tests passed including the Field source-revision regression.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` exited 0 and regenerated both catalog outputs (115 rows).
- `pnpm typecheck` exited 0.
- `pnpm exec biome check packages/ui/src/molecules/field/Field.stories.tsx packages/ui/src/molecules/field/Field.test.tsx packages/ui/src/molecules/field/Field.tsx packages/ui/src/molecules/field/types.ts packages/ui/src/molecules/field/useField.ts packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts scripts/package-consumption.test.mjs scripts/prop-naming.test.mjs scripts/catalog_data.py skills/_shared/prop-naming.json docs/prop-naming.md docs/components/field/v0.4/implementation.md docs/CATALOGO.md docs/catalog.json` exited 0 (11 supported files checked); Markdown and Python are not Biome-checked.
- Packed-consumer fixtures include a typed trailing Switch, SSR order assertions and live label toggles, but the package build and packed React 18/19 runs were not performed by this worker.

## Remaining verification

The parent must run the full checks, build and packed-consumer matrix, then inspect Chrome, Edge and Firefox against the stories: LTR/RTL logical order, label-row alignment, gap, narrow and unbroken label and message text without control overlap, real coarse-pointer label hit area (at least 44 × 44 CSS pixels when the host permits), keyboard/focus and disabled opacity, and the scoped typography cascade without changing control internals. Check Controls widgets and assistive-technology behavior separately. Switch thumb RTL mirroring is outside this change.

VIS-01 expected-design sources, comparable conditions and approval remain pending. A real implementation capture is required before merge; no capture was produced in this worker. Visual conformity: **Not evaluated**.

## Parent browser verification (2026-11-16)

Real browsers against the local Storybook (`molecules-field--trailing-*` stories). Each finding was fixed test-first before re-checking.

| Finding | Fix | Evidence |
| --- | --- | --- |
| Grid auto-placement put the control in row 2 (beside the message), 17.9px below the label row, against the owner's "centered with the label row". | The root places the control with `[&>button]:row-start-1 [&>button]:col-start-2` (both Radix controls are buttons); the control itself still receives no classes. A first `:last-child` selector was replaced because Radix appends a hidden native input after the control inside forms and during SSR (caught by the packed-consumer SSR test); a jsdom test inside a `<form>` now pins it. | Chrome, Edge and Firefox: control centered on the label row (delta 0px), including a four-line label. |
| An unbroken word in the label ran under the control: the label is a flex container, so its text is an anonymous flex item whose min-content `wrap-break-word` does not lower. | Label gets `min-w-0` and `wrap-anywhere` (the text column width comes from available space, so ordinary words still wrap at spaces). | Chrome: text ends at 127px, control starts at 141px; no overflow. Edge and Firefox: no overflow, text never overlaps the control. |
| Same placement with Radix's hidden native input present. | Covered by the `[&>button]` selector above. | Chrome: with a hidden input appended as the last child, the control stays in row 1 and centered (delta 0px) in the switch, checkbox, long-text and RTL stories. |
| Coarse-pointer target | None needed. | Chrome with touch emulation (`matchMedia('(pointer: coarse)')` true): label height 44.8px. |

Also verified in Chrome 157, Edge 157 (headless CDP) and Firefox 160 (WebDriver BiDi): control at inline end (right in LTR, left in RTL) and last in DOM order; label click toggles; disabled never toggles. The Switch thumb does not mirror in RTL (visible in the RTL capture); this is an atom limitation tracked in #432. The `choice` layout's 35.2px coarse target is tracked in #431.

### Captures

Playwright MCP, Chrome 157, device scale, 640px viewport unless the story sets a narrower host.

| File | SHA-256 |
| --- | --- |
| `captures/vis-01-trailing-checkbox-chrome-640.png` | `fe9a345b7b49576b1644c2064681162f72db6b7cacd4da7292531093fc3f0dde` |
| `captures/vis-01-trailing-long-text-chrome.png` | `9d52ae21b40e64ae565b87d73198dcd2f2d9f40936453739d534417d91bcd632` |
| `captures/vis-01-trailing-rtl-chrome-640.png` | `ca8564b6cf69d4d32c1a5bf8d4b8253c707881c0cb3113c9a4519132fe33c648` |
| `captures/vis-01-trailing-switch-chrome-640.png` | `d040ee1e92f5dab0c510f5180d3d8c2436c527ea264f1ef028db359ab7113e7d` |

These are implementation captures, not approved expected-design references (none existed for v0.4). Forced colors and reduced motion were **not evaluated** in a browser.
