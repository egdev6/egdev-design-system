# Field choice-trailing (#411)

Implement the approved Field v0.4 amendment `docs/components/field/v0.4/choice-trailing-amendment.md` (Approved 2026-11-16) per the owner-approved plan below. Branch `feat/field-choice-trailing`, one PR, Closes #411. Roadmap #427, milestone #14. Reference implementation for flow and evidence: Tabs v0.2 (`docs/components/tabs/v0.2/implementation.md`).

## Specs

- S1: `FieldLayout` becomes `'stacked' | 'choice' | 'choice-trailing'` (`packages/ui/src/molecules/field/types.ts`); layout JSDoc gains one sentence for the trailing layout; keep `@default stacked`, `@control select`.
- S2: `choice-trailing` root: `grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 min-h-9` (owner: control centered with the label row, "Centrado con la fila del label"; separation "gap-x-4"). Label row `col-start-1 row-start-1 cursor-pointer min-w-0`; message `col-start-1`. The control is NOT given classes (existing invariant test): the root places it with `[&>button]:row-start-1 [&>button]:col-start-2` (auto-placement alone put it in row 2 — L2; not `:last-child`, because Radix appends a hidden input in forms/SSR — L3), rendered last (DOM order: label row, message wrapper, control). Logical layout only (no left/right/ml/mr utilities); RTL mirrors through grid.
- S3: Internal (non-exported) `fieldLabelVariants`: only `choice-trailing` is non-empty: `grow flex items-center min-w-0 pointer-coarse:min-h-14 wrap-anywhere` (L2: `wrap-break-word` cannot shrink the anonymous flex text item) (44.8px coarse target; `min-h-11` is only 35.2px in this system — tracked separately for `choice` in #431).
- S4: `useField.ts`: `choice` covers both choice layouts (readout and counter omitted for both); new `trailing: boolean`; `labelProps.className` from `fieldLabelVariants`. IDs and `aria-describedby` derivation unchanged. `Field.tsx`: control rendered first only for `choice`, last for `choice-trailing`.
- S5: Tests first (RED observed before GREEN), via the public interface, one per amendment criterion: AC-01 order/markers/grid classes for Checkbox and Switch; AC-02 label click toggles exactly once, controlled value respected, disabled never toggles; AC-03 accessible name and description (external `aria-describedby` first, no duplicates, supplied id wins, error replaces hint with `aria-invalid`, ref survives rerender, `hideLabel` keeps the name); AC-04 one tab stop on the control, Space toggles; AC-05 label classes and no physical utilities; AC-06 disabled dimming once per part, control classes unchanged; AC-07 readout/counter omitted, root className/id/native attributes forwarded. Preservation: existing `choice` and `stacked` tests unedited and green.
- S6: Docgen/controls: union in `packages/ui/src/lib/storybook-docgen.test.ts`, select options in `packages/ui/src/lib/storybook-controls.test.ts`. Stories: `TrailingSwitch`, `TrailingCheckbox`, `TrailingDisabled`, `TrailingLongText` (narrow host + unbroken word), `TrailingRtl` (`dir='rtl'` wrapper), `TrailingScopedTypography`; usage-guidelines text updated; no argTypes, no play.
- S7: Packed consumer (`scripts/package-consumption.test.mjs`): a `choice-trailing` Switch sample, SSR order assertion, live label-click toggle, updated `@ts-expect-error` note.
- S8: Registry (`skills/_shared/prop-naming.json`): Field `layout` usage type includes `'choice-trailing'` (existing `label-layout` convention; owner approved the value: "Aprobar las cuatro"); refresh whole-file revisions of all Field usages; optional approval record `docs/components/field/v0.4/prop-naming-approval.json` (Tabs pattern); registry regression test in `scripts/prop-naming.test.mjs`; regenerate with `pnpm props:docs`.
- S9: Catalog row (`scripts/catalog_data.py`) mentions v0.4 `choice-trailing`; regenerate both outputs. Evidence doc `docs/components/field/v0.4/implementation.md`; record the amendment content SHA-256 in its header.
- S10: No stylesheet, no new module, no tokens, no dependencies. English artifacts. Switch RTL thumb mirroring is out of scope (#432).

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1–S10 | gentle-ai-worker | — |
| T2 | S2–S3 | parent: Chrome/Edge/Firefox checks + captures | — |
| T3 | all | parent: full checks, commit, PR | — |

## Log

- L1 (owner, verbatim choices on the plan): "Centrado con la fila del label"; "gap-x-4 (~12.8px)"; "Sí, dos issues aparte" (→ #431 choice touch target, #432 Switch RTL thumb); "Aprobar e implementar".
- L2: Browser checks (Chrome/Edge/Firefox) found the control in grid row 2 (17.9px below the label row) and an unbroken label word running under the control; fixed test-first (RED 5 → GREEN 449, then RED 2 → GREEN 449). Coarse target 44.8px confirmed with touch emulation. All six trailing stories pass in the three browsers (side, centering, overflow, label click, disabled). Captures and hashes in docs/components/field/v0.4/implementation.md.
- L3: Packed-consumer SSR failed (4/14). Cause 1: a stale Tabs assertion from #430 (full width + label wrap now uses `wrap-break-word`; package consumption is not run by pre-push or CI) — fixed the assertion. Cause 2: Radix renders a hidden native input after the control in forms and SSR, so `[&>:last-child]` targeted the input — switched to `[&>button]`, test-first (RED 5 → GREEN 451) with a new in-form jsdom test; Chrome recheck with a hidden input appended keeps the control in row 1 (delta 0).
