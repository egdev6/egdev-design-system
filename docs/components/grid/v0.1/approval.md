# Grid and GridItem v0.1 — cataloging, spec and plan approval record

- **Approved artifacts:**
  - `docs/components/grid/v0.1/cataloging.md` — whole-file SHA256 `fbebf2ba7b98dd72026e44ce9dcddf09d92c23bdf9a5f7893a171675e75ec5f5` (it defines no payload hash).
  - `docs/components/grid/v0.1/spec.md` — SHA256 `b7de8109cea062361a1f2847400032eec460fc65d47dbd014ccc72b2f17ca885` — the spec's own hash definition: UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading line (anchored at line start; the inline mention in the header metadata does not count) through EOF, including the final newline; the metadata above that heading is excluded.
  - `docs/components/grid/v0.1/implementation-plan.md` — SHA256 `46fb0348e4971d4b582ca5de3f949ba956b699c8abfa04af407bbe77871b5500` — the plan's own hash definition: UTF-8 LF bytes from the exact `## 1. Authority and gates` heading line (line start) through EOF, including the final newline; the metadata above it is excluded.
- **Snapshot commit:** none. The approval was given on uncommitted drafts on branch `feat/layout-grid-395` after `e52a5a1`: the spec draft (payload SHA256 `4dcb1c581b702d8eac3a4e4885c9a0261a70cb11bd553d0a4a7a2d40ca201034`, prefix `4dcb1c58`) and the plan draft (payload SHA256 `767a68f67201026abdf7906d0272a76024fcfce4fde84e48f18bfd6198acb7c1`, prefix `767a68f6`), whose prefixes are the ones logged in `odd/tasks/layout-grid-395.md` L4, and the cataloging draft. The finalized bytes identified by the SHA256 values above, with the owner's answers folded in, are not committed yet; the parent commits them. No issue snapshot is published and no GitHub action was taken.
- **Date:** 2026-11-27
- **Owner approval (verbatim):** two answers, both recorded in `odd/tasks/layout-grid-395.md` L4 under the labels `Name` and `Approval`, given after the spec and plan drafts were drafted (the log keeps the answers, not the question wording):
  - Name: "`columnCount` (Recomendado)"
  - Approval: "Aprobar (Recomendado)" — it covers the changelog under `## Unreleased` (renamed at the version bump), GridItem `asChild`, the other recommendations (OQ-3 to OQ-7), browser runs, packed consumers with effects present, the `(#395)` citation, and the registry receipts for the new conventions.

## Resolved decisions

The owner took the recommended answer of every open question in the spec. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | The column-count prop is `columnCount` (answer "`columnCount` (Recomendado)"). The L3 draft's `columns` cannot be registered because the approved `table-columns` owns that name; no Grid-scoped exception is requested. |
| OQ-2 | `GridItem` takes `asChild`, like `Grid`. |
| OQ-3 | `collapseBelow` keeps its name; the inclusive rule ("at and below") is documented in the prop, the registry text and the tests. |
| OQ-4 | Defaults and ranges as proposed: `columnCount` optional with default 1, `gap` 4, `alignItems` `stretch`, `span` 1 to 12, `rowSpan` 1 to 4. |
| OQ-5 | Exports are `Grid`, `GridItem`, `GridProps` and `GridItemProps` only; the unions stay inline. |
| OQ-6 | The four new conventions (`grid-columns`, `layout-collapse-below`, `grid-item-span`, `grid-item-row-span`) are approved at plan approval, recorded as a separate scoped receipt at implementation. |
| OQ-7 | Unsupported runtime values are ignored silently, as Stack and Cluster do. |

Plan decisions: D1 the plan is approved with D4 changed as below; D2 browser runs are approved, PNG captures are not; D3 the registry receipts are granted; D4 the changelog entries sit under `## Unreleased` in `@egdev/ui` and `@egdev/system` and are renamed to the versioned headings in the bump commit; D5 `(#395)` is cited; D6 (publishing a snapshot) is not covered.

## What the finalized documents change in the drafts

The finalized documents differ from the approved drafts only by these resolutions and the status wording they affect:

- **Spec:** the status, approval and identity metadata above the hash anchor; the resolved note on the column-count row of block 3, "New concept" on the other three convention rows, the convention-approval wording of block 3 and the name note in the API table; the wording of AC-10 (the four conventions ship `approved` by a scoped receipt, which is what the owner approved, instead of "proposed"); the closure checklist; the heading, introduction and resolution column of the former "Open questions" table; F-1; the next step. No anatomy, API, behavior, accessibility, appearance or other acceptance criterion changed.
- **Plan:** the status, contract-authority, naming-note and plan-identity metadata above the hash anchor; G2, G3 and G7; the title of section 2, its changelog row and its "explicitly untouched" sentence; the receipt sentences of section 5.2; the headings, introduction, `(#395)` sentence and D4 paragraph of section 7; the introductions of sections 8 and 9 and the `test:package-release` note; risks 2 and 3; section 13 (each decision with its resolution); section 14. No design, test, check, edit surface or commit slice changed except D4's changelog headings.
- **Cataloging:** the status, the owner-authority and companions lines, the block line, the L4 answers table, the resolution column of the former "Open questions" table and the next step.

## Scope

This approves the cataloging gate (T1), the spec gate and the plan gate (T2; the plan's own G1) of `odd/tasks/layout-grid-395.md` for exactly the bytes identified above, including the OQ-1 to OQ-7 resolutions they contain. Any later change to any of the three documents needs a new approval.

The plan approval authorizes the edit surfaces of its section 2 and the checks of its section 8, and the registry receipt for the four new conventions (D3), which the receipt binds at implementation with its own file. It does **not** approve visual conformity: captures VIS-01 to VIS-04 stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated), and the owner has not adopted an expected design. It does not authorize a PNG capture, a release, a tag, a version bump, a GitHub write or publishing a snapshot (D6); the parent commits.
