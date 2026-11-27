# #580 — inline links inside Prose at reading size

Branch `feat/prose-links-580`. Consumer issue egdev6/egdev-website#49. Gates: cataloging → spec → plan → code, each approved by the owner. The fix is expected on the CLI side, in the DS040 guard of `egdev-ds doctor`.

## Specs

- S1 — #580, verbatim: "Inline links inside long-form content read at the size of the surrounding reading copy." … "`egdev-ds doctor` DS040 forbids raw `<a>` in app code, so the site has to render DS `Link`. Link uses its label step (11.2px) inside the 16px reading copy." … "The need is for the anchors that Prose is designed to style to pass the guard when they are Prose descendants."

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1 | Cataloging, spec and plan drafts; owner approval | writer + owner | pending |
| T2 | S1 | Implementation, test-first | writer | pending |
| T3 | S1 | PR, owner merge, release, close #580, notify the website | inline | pending |

## Log

- L1 — Owner request, verbatim: "dale", in reply to the recommendation to start with #580.
- L2 — Drafts are in docs/components/prose/v0.2/: cataloging, spec `bdf4a516` and plan `5b53884c`.
  - Decision: reuse Prose, plus a DS040 exemption in @egdev/cli.
  - Scope G4: raw `a` is allowed anywhere in a non-test `.tsx` file that renders an imported `Prose` (named, aliased or namespace import). `button`, `input` and `label` are still reported. Converters in other files are not covered. DS041 and DS046–DS048 are unchanged.
  - Owner answer, verbatim: "Aprobar todo (Recomendado)". This approves the cataloging, spec and plan with OQ-1 G4, OQ-2 (Link inside Prose is outside the contract), OQ-3 (publish the rule in the Prose `children` description), OQ-4 (cli minor at release) and OQ-5 `(#580)`.
  - Side finding: a local barrel hides DS components from DS046 and DS047. Owner answer, verbatim: "Sí, abrir issue (Recomendado)". Filed separately.
