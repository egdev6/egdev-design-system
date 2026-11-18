# Dialog and AlertDialog header alignment (#466 + owner extension)

Implementation of #466 (branch `fix/dialog-stacked-header-spacing`), extended by the owner to every Dialog and AlertDialog header variant. Spec amendment: `docs/components/dialog/v0.3/stacked-header-spacing-amendment.md` (on branch `docs/nexo-requests-464-466-specs`; its "inline unchanged" scope is superseded by L3).

## Specs

- S1 (#466, approved plan): in the stacked layout the description sits right below the title at `--space-2` (6.4px), without browser default margins; long-title stories exist for both layouts in Dialog and AlertDialog.
- S2 (owner, verbatim, L3): "revisa la cabecera de los alertDialog y en los dialog en todas su variantes: -Titulo alineado con icono de close - Subtitulo con space-2 de separación - Resto de textos alineados en la partte baja del título"
- S2a: "Titulo alineado con icono de close": in every Dialog variant (centered, sheet, full, compact, both header layouts, with/without description/status) the vertical centre of the title's FIRST line equals the vertical centre of the dismiss icon (tolerance ≤ 0.5px). AlertDialog has no dismiss button.
- S2b: "Subtitulo con space-2 de separación": the title-to-description separation is `--space-2` in both layouts (vertical in stacked, horizontal gap in inline), Dialog and AlertDialog; no inherited `<h2>`/`<p>` margins in any layout.
- S2c: "Resto de textos alineados en la partte baja del título": description (inline layout) and status text (both layouts) share the baseline of the title's LAST line (tolerance ≤ 0.5px), including multi-line titles. AlertDialog's icon + title row keeps the icon centred with the title (not requested to change).
- S3: Every change is checked through the public interface (classes on rendered parts) in Vitest and measured in a real browser (Chrome via Playwright MCP against Storybook at http://localhost:6006); keyboard/focus/ARIA unchanged.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1 | parent | this commit |
| T2 | S2–S3 | worker + parent fix | this commit |
| T3 | S1–S3 | parent | checks, artifact regeneration, commit, Storybook for owner |

## Log

- L1 (owner, verbatim): "+si" — approving the #466 plan (measure first, `m-0` + `--space-2`, long-title stories, Storybook before/after).
- L2: Baseline (Chrome, before T2): title first-line centre minus dismiss icon centre = -7.7px (stacked, sheet, full, compact) and +3.8px (inline with description); inline description baseline -2.7px vs title last baseline; status -3.2px (inline) and -8px (stacked); inline long titles -4px/-5.3px. Causes: dismiss anchored at `top-[var(--space-4)]` while the IconButton `lg` is 38.4px (`--space-12`) and the title line is `--text-heading-small` × `--text-heading-small--line-height` (23.04px); legacy `.eg-dialog__head{align-items:center;gap:var(--space-3)}` (`packages/ui/src/styles/legacy/bundle.css:1481`); UA margins on `<h2>`/`<p>`.
- L3 (owner, verbatim): "revisa la cabecera de los alertDialog y en los dialog en todas su variantes: -Titulo alineado con icono de close - Subtitulo con space-2 de separación - Resto de textos alineados en la partte baja del título"
- L4: T2 done by worker (RED 8 failed → GREEN 58/58; utilities `items-baseline-last`, dismiss `top-[calc(var(--space-4)+(var(--text-heading-small)*var(--text-heading-small--line-height)-var(--space-12))/2)]`, base `m-0`, header `gap-[var(--space-2)]`). Parent measured in Chrome: stacked status still -8px because `dialogStatusVariants` stacked `self-start` overrode the row alignment; RED test added, variant removed → 59/59. Final Chrome measurement (23 Dialog/AlertDialog stories, runtime-accent skipped: no trigger): title first-line centre vs dismiss icon 0.0px everywhere; description/status vs title last baseline 0.0px (incl. 2- and 3-line titles); stacked title→description 6.4px.
- L5: Checks: typecheck, 3166+ Vitest, build, package-consumption, test:system 36/0, test:props 130/0 (dialog/alert-dialog types.ts revision hashes refreshed in prop-naming.json + docs), test:package-exports 137/0, artifact + system.md regenerated. test:artifact keeps 2 failures already present before this change (ColorSwatchGroupOption in the L9 type list from #416; token count 311 vs 297 from #425); not in CI.
