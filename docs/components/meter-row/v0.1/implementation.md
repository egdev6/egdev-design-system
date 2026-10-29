# MeterRow v0.1 implementation evidence

## Authority and scope

- Contract: [#90](https://github.com/egdev6/egdev-design-system/issues/90), v0.1, adopted by its owner full-contract approval comment. All comments were read; no substantive amendment follows the body. Frozen body SHA-256: `bbe99e1a1b1550ea6dcd5c373067aaffd7b824ddbc003200cc72bb05e03b8baa`; canonical payload SHA-256: `00e0afb059739421a82438d1890529562895f34a94fae26339b4b276861e35f2`; ordered frozen history SHA-256: `305479747e3a0570f9175c9bd18155f9385e703b051a011da4621f6db305b0a0`. Historical Draft/Pending tracking prose does not override that approval.
- Separate execution authorization: parent instruction to implement exactly this approved contract under `odd/tasks/molecules-build.md`, T9, S1–S4, on `feat/90-meter-row` from `d428967`. Six meaningful files, static token-backed CVA, per-part `cn()`, **No stylesheet**, existing ProgressBar composition and additive registration. This records the delegated instruction, not a new native owner receipt.
- S1: approved UI molecule. S2: no dependency or token changes. S3: ProgressBar is already merged on the supplied base; its actual native attribute forwarding and Radix progress semantics were inspected and used unchanged. S4: focused memory-capped checks only; the parent owns full gates, Git and PR delivery.
- VIS-01 expected-design identity: `454ddc4ca378300833a9d4cd931c62c5bfa4985d02c8a4484f52a292969d3d16`, as recorded by the approval. No reference was replaced or recaptured. Remote asset membership, browser rendering and visual conformity were not evaluated in this implementation task.

## Decisions and acceptance coverage

| Decisions / criteria | Implementation and observed functional coverage |
| --- | --- |
| D1–D2; AC-01–02 | Task/goal progress only. Structural `div`, exactly one named real ProgressBar; no Gauge, native meter, output, group or live region. Domain conversion stays with the host. |
| D3; AC-03–04 | Finite clamp before text and atom input, preserving decimals. Tests cover -1, 0, 42.5, 100 and 142, coherent count text, aria-valuenow/valueText and the atom's existing fill geometry. |
| D4; AC-05 | NaN and both infinities pass unchanged to ProgressBar's indeterminate policy. Empty static fill, no current number/valueText; described readable phrase. Recovery removes stale description links without replacing the indicator. |
| D5–D6; AC-04–06 | Native hidden visible header and native persistent help paragraph outside the atom. `useId()` links help, and indeterminate readout first when needed. Multiple instances have unique ids. jsdom accessible-description computation retrieves explicitly referenced hidden readout text; this is not browser/AT evidence. No Text/Field dependency or form-label behavior. |
| D7–D8; AC-08, AC-11 | Decorative 8px token swatch follows default/muted family. Real ProgressBar `size='lg'`, variant forwarded; hook assertion proves `edge` is absent, not false. No atom className or semantic override is passed. |
| D9; AC-11 | Unpainted row; only ProgressBar owns its well, fill, bevel, geometry and reduced-motion transition. No Surface, copied recipes, custom property, stylesheet, token or dependency change. |
| D10; AC-06–07 | Blank/absent help omitted; non-empty help preserves caller text. Omitted message keys use `In progress`, localized phrase is described only while indeterminate. Required label and supplied valueText/message must be non-empty caller content; no text parser, domain detector or new error/fallback policy is introduced. |
| D11; AC-09 | Passive rerenders only. Tab skips the row and focus remains on a separate control during completion. No row timers, live regions, callbacks or copied root data-state. |
| D12; AC-10, AC-12–13 | Wrapping header and overflow-wrap:anywhere on text, stable eg-meter-row, root-only native metadata, supported layout merged last and isolated from parts. Six files; all production utilities are in types.ts. English story matrix, real docgen and installed Controls pipeline pass. Narrow/RTL/reduced-motion examples are supplied, not browser-verified. |
| AC-13–14 | Export and packed-consumer fixtures cover public types, negative API boundaries, SSR, passive recovery and delivered CSS. Packed execution, React 18/19 client evidence, browser Controls, zoom/reflow, manual AT and comparable VIS-01 review remain parent/owner checks, not inferred passes. |

`className` supports outer margin, width/min/max-width and parent flex/grid placement only. Gap, display, typography, header alignment, key and atom appearance remain owned. `cn()` resolves recognized utility conflicts, not arbitrary CSS or universal appearance overrides. Unsupported untyped semantic/composition inputs are filtered; compatible metadata reaches only the root. No new package subpath. Runtime export is only `MeterRow`; types are `MeterRowProps`, `MeterRowVariant`, `MeterRowMessages`. Hook, native alias and CVA recipes remain internal.

## Naming and Storybook integration

Six approved conventions receive implementation usages only: `accessible-name`, `primary-value`, `measurement-text-equivalent`, `visual-treatment`, `localized-messages`, `numeric-display-help`. No convention, alias, exception, approval or historical receipt was changed. Reviewed source: `packages/ui/src/molecules/meter-row/types.ts#MeterRowProps`, whole-file SHA-256 `1cd5df635731e9d05de3a79a2fea4f64392fe783c190f1b888c210535c17f6ab`. `MeterRowVariant` and `MeterRowMessages` declarations were inspected in the same file. The historical-receipt test filters exactly these new usage pairs.

Storybook's existing recursive stories glob already includes molecules; no duplicate config entry was added. Production CSS scans the new types.ts only; preview CSS separately scans the story layout utilities. Native docgen allowlist: id, title, dir, lang, className, style. Six own rows: label/valueText/help text, value number, variant select, messages disabled with concrete dictionary reason and Localized story. Only variant has a constant prop default. Dictionary entry JSDoc is independently checked. No manual argTypes, play, locale provider or renderer adapter.

Stories: Default, ValueLimits, Decimal, CountEquivalent, Indeterminate, Recovery, WithHelp, WithoutHelp, MultipleInstances, Localized, ComparisonTask, PassiveUpdates, LongText, Narrow, RTL, ReducedMotion, ConsumerLayout. Default supplies only required label/value. Recovery/PassiveUpdates use an external host control, never a MeterRow action API.

## Test-first evidence

1. RED: behavior tests against an empty JSX stub: **20 failed, 1 passed**; failures included missing named progressbar, text, normalization, descriptions and root metadata.
2. GREEN: same focused command after the real hook/JSX/CVA implementation: **21 passed**.
3. Triangulation: added typed hook boundary assertions (edge omitted, no atom className/role, non-finite forwarded) and metadata/inventory tests. Component + owned Storybook suites: **250 passed across 4 files**, including **22 MeterRow behavior/hook tests** and zero owned Controls diagnostics.
4. Refactor: formatting-only edits and Biome export ordering, no semantic changes. Initial lint runs reported only formatting/ordering findings in edited files; all were corrected manually and lint passed.

## Observed validation

| Exact command | Result |
| --- | --- |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/meter-row --maxWorkers=2` | RED 20 failures / 1 pass, then GREEN 21 passes. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/meter-row packages/ui/src/lib/meter-row-storybook.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts --maxWorkers=2` | 4 files, 250 tests passed. |
| `pnpm props:docs` | Generated view updated. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | 110 rows regenerated; only MeterRow's catalog entry changed. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm lint` | Passed; 383 files before this evidence document was added. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm typecheck` | Passed, including UI strict types. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm props:check` | Registry valid; generated view current. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:props` | 87 passed. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G bash -c 'pnpm build && pnpm test:package-exports'` | Single run passed: build emitted UI JS/declarations and 252.18 kB CSS; 51 export/CSS/SSR tests passed, including MeterRow; 116 reachable declaration files checked. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2` | 53 passed, including real preview compilation of MeterRow utilities. |

Packed-consumer fixtures were updated but **not executed**, per the parent task. No browser, Storybook/watch, install, token change, CI, Git write or PR action was performed. The untracked coordination copy was left unchanged.
