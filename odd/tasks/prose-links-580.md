# #580 — inline links inside Prose at reading size

Branch `feat/prose-links-580`. Consumer issue egdev6/egdev-website#49. Gates: cataloging → spec → plan → code, each approved by the owner. The fix is expected on the CLI side, in the DS040 guard of `egdev-ds doctor`.

## Specs

- S1 — #580, verbatim: "Inline links inside long-form content read at the size of the surrounding reading copy." … "`egdev-ds doctor` DS040 forbids raw `<a>` in app code, so the site has to render DS `Link`. Link uses its label step (11.2px) inside the 16px reading copy." … "The need is for the anchors that Prose is designed to style to pass the guard when they are Prose descendants."

## Tasks

| ID | Specs | Task | Route | Status | Commit |
|---|---|---|---|---|---|
| T1 | S1 | Cataloging, spec and plan drafts; owner approval | writer + owner | Done (L2) | 81de362 |
| T2 | S1 | Implementation, test-first and independent verification | writer + verifier | Done (L3–L4) | 63f3b86, 3d359f8, db816d1, 22aeb4a |
| T3 | S1 | PR, owner merge, release, close #580, notify the website | inline | Done except PRS2-12 (L6) | 91fdfc5, 7c28fef |

Risk: item 3 — shared guard collection also serves DS041 and DS046–DS048. Independent verification is recorded in L3–L4.

## Log

- L1 — Owner request, verbatim: "dale", in reply to the recommendation to start with #580.
- L2 — Drafts are in docs/components/prose/v0.2/: cataloging, spec `bdf4a516` and plan `5b53884c`.
  - Decision: reuse Prose, plus a DS040 exemption in @egdev/cli.
  - Scope G4: raw `a` is allowed anywhere in a non-test `.tsx` file that renders an imported `Prose` (named, aliased or namespace import). `button`, `input` and `label` are still reported. Converters in other files are not covered. DS041 and DS046–DS048 are unchanged.
  - Owner answer, verbatim: "Aprobar todo (Recomendado)". This approves the cataloging, spec and plan with OQ-1 G4, OQ-2 (Link inside Prose is outside the contract), OQ-3 (publish the rule in the Prose `children` description), OQ-4 (cli minor at release) and OQ-5 `(#580)`.
  - Side finding: a local barrel hides DS components from DS046 and DS047. Owner answer, verbatim: "Sí, abrir issue (Recomendado)". Filed separately as #582.
- L3 — PR #583 opened at db816d1. Independent verifier mwznj0y0-2l-df7i found B1: TypeScript merges a same-scope import and conflicting declaration into one symbol, so membership alone incorrectly suppresses DS040. Other T2 criteria passed; PRS2-12 is release/consumer scope. The approved G4 rule accepts imports from any specifier, including local barrels; the initial PR description incorrectly restricted it to `@egdev/ui` and requires correction.
- L4 — B1 corrected in one batch: qualification now requires the exact import binding to be the symbol's sole declaration. Regression RED: 11 pass, 2 fail; GREEN: 13/13; CLI suite 258/258; typecheck and lint exit 0. Parent spot check: 13/13. Independent recheck first ran zero tests because its prior scratch had expired (setup exit 2); one setup recovery with fresh isolated fixtures passed 13/13 (mwzob42h-2o-9uqk). S1/T2 and PRS2-02/07 now pass, including exact text/JSON, exit status, unchanged app trees and valid G4 imports. PRS2-12 remains pending after release; no versions changed.
- L5 — Owner merged PR #583 as 91fdfc5 with the B1 correction 22aeb4a. Owner release choice, verbatim: "Todo lo pendiente (Recomendado)"; tracked in `odd/tasks/release-cli-0.6.0.md`.
- L6 — Release PR #584 merged as 7c28fef: cli 0.6.0, ui 0.12.1, system 0.14.1, effects 0.2.14, mcp 0.4.14. Clean `release:pack` on main. Owner grant, verbatim: "Comentar y cerrar (Recomendado)"; #580 commented and closed. egdev-website session notified (message a3d03266). PRS2-12 waits for the website's `egdev-ds doctor` report.
