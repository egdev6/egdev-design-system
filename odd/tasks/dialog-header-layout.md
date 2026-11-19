# Dialog header layout (#458)

Add an opt-in header layout to DialogContent and AlertDialogContent so a narrow dialog can stack the title and description. Branch `feat/dialog-header-layout`. One PR: spec amendment + implementation, merged with `gh pr merge --rebase --admin` on green CI.

## Specs

- S1: Issue #458 acceptance criteria (verbatim): "`headerLayout="stacked"` renders the description on its own line below the title, at every dialog width." / "The default stays `'inline'`, with no visual change for existing consumers." / "`aria-labelledby` and `aria-describedby` are unchanged, and the dismiss button keeps its position and focus order." / "A story and a test are added for both layouts."
- S2: Owner decisions (verbatim, 2026-11-17): API "headerLayout=\"inline\"|\"stacked\" (Recommended)"; statusText "En la primera línea, junto al título (Recommended)"; AlertDialog "Agregar la prop también a AlertDialog"; delivery "Sí, hasta el merge (Recommended)".
- S3: Root cause (parent evidence): the row comes from the legacy rule `packages/ui/src/styles/legacy/bundle.css:1481` `.eg-dialog__head{display:flex;align-items:center;...}` (in `@layer components`); `dialogHeadVariants` (`packages/ui/src/molecules/dialog/types.ts:135`) sets no display. Utilities win over the legacy layer. Dialog `inline` must keep today's rendering exactly; `stacked` stacks title (with statusText on the same first line, per S2) above the description, dismiss button unchanged (absolute top-end).
- S4: AlertDialog today already renders the description below the title row (`alertDialogHeadVariants` is `flex flex-col`). To honor "no visual change for existing consumers", AlertDialogContent's default is `'stacked'` (its current rendering) and `'inline'` is the opt-in row layout (title row and description side by side). Document this per-component default explicitly.
- S5: New prop name `headerLayout` is not an existing registry convention (`label-layout`/`layout` excludes this meaning). Propose a scoped convention/usage per the shared prop-naming workflow, with an approval receipt bound only to DialogContent and AlertDialogContent `headerLayout`, pinning the latest receipt in `priorReceipts` (pattern: `docs/components/dialog/v0.2/prop-naming-approval.json`).
- S6: Rules: CVA in types.ts, token-backed utilities only, no new tokens or dependencies, stories and docs in English, test-first (parent observes RED/GREEN), full checks, real-browser verification by the parent.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1–S6 | worker: amendment + tests (stop for RED), then implementation + registry | |
| T2 | S1, S6 | parent: RED/GREEN, build, packed checks, browsers, commit, PR, merge | |

## Log

- L1 (owner, verbatim): "458".
- L2 (owner choices): see S2.
