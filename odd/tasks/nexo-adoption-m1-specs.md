# Nexo adoption I — spec batch

Draft versioned spec amendments for the 8 issues of milestone #14 "Nexo adoption I: additive variants" (roadmap index #427, proposal `egdev-ds-nexo-adoption-v1`), for the owner to approve together. Specs only: no implementation, no token/dependency changes, no GitHub writes.

## Specs

- S1: Batch scope, verbatim owner choice: "Lote de specs del milestone 1 — Redacto las 8 fichas del milestone 1 para que las apruebes juntas; implementación después, una por PR."
- S2: Each spec follows `skills/component-spec-proposer/SKILL.md` (seven blocks, shared English schema `skills/_shared/component-spec-template.md`, prop-naming registry lookup, acceptance matrix mapped to checks) is first saved as **Draft — not approved** and, after the owner's decision-by-decision review (L5), marked **Approved — 2026-11-16** with the resolved decisions recorded; it lives under `docs/components/<kebab-name>/v<next>/<topic>-amendment.md`, following the existing amendment convention (e.g. `docs/components/button/v0.3/large-size-amendment.md`).
- S3: Each amendment preserves existing public API, defaults and `eg-*` markers; every new prop is additive and opt-in, unless the spec explicitly flags a contract change with its impact.
- S4: Visual references: no new captures are produced in this batch; each spec records the visual reference status honestly (blocked/pending), never invented.
- S5: Issue mapping: #414 Tabs fullWidth/wrap; #411 Field choice layout with trailing control; #412 PageHeader leading action + description; #420 Carousel full-width track without visible scrollbar; #413 SelectTile media-less (text-only) tiles; #422 Button opt-in label wrapping; #423 Icon `download` and `external-link` glyphs (renamed per L5); #419 MCP usage examples (docs plan, not a component spec).
- S6: Every spec ends with planned checks and its resolved/remaining decisions; nothing is marked implemented. Approval covers the spec only: each implementation plan needs separate approval.

## Tasks

| ID | Specs | Issues | Route | Surfaces | Commit |
| --- | --- | --- | --- | --- | --- |
| T1 | S2–S6 | #414, #420 | worker A | `docs/components/tabs/v0.2/**`, `docs/components/carousel/v0.2/**` | a7b8d5b |
| T2 | S2–S6 | #411, #413 | worker B | `docs/components/field/v0.4/**`, `docs/components/select-tile/v0.3/**` | a7b8d5b |
| T3 | S2–S6 | #412, #422 | worker C | `docs/components/page-header/v0.2/**`, `docs/components/button/v0.4/**` | 9ce6e38 |
| T4 | S2–S6 | #423, #419 | worker D | `docs/components/icon/v0.3/**`, `odd/specs/mcp-usage-examples.md` | 9ce6e38 |
| T5 | S1, S6 | all | parent | consolidated review summary for owner approval | — |

## Log

- L1 (owner, verbatim): "dale" — after choosing "Lote de specs del milestone 1" ("Redacto las 8 fichas del milestone 1 para que las apruebes juntas; implementación después, una por PR.").
- L2: Roadmap published 2026-11-16: index #427, milestone #14. Cataloging decisions: see the index and revision comments (#419 premise corrected: `get_component` exists, examples missing).
- L3: T1–T4 drafted by workers (T2 was first blocked by an empty `gh` output in the worker; the parent forwarded #411/#413 contents). All 8 files carry "Draft — not approved"; no implementation checks were run (documentation only).
- L4: Slice boundary: a7b8d5b (T1+T2, 392 lines), 9ce6e38 (T3+T4). T5 awaits owner approval of the 8 drafts.
- L5 (owner, decision by decision, verbatim choices): (1) "Aprobar las cuatro" (conventions fullWidth, labelWrap, trackLayout, 'choice-trailing'); (2) #412 "lede"; (3) #422 "Sí, la caja crece y es clicable entera"; (4) #423 "external-link"; (5) #413 "Solo single; media ignorada con warning en dev"; (6) #412 "Aprobar leadingAction"; (7) Icon md size "Issue aparte" → #428; (8) "Sí, validación visual en cada PR".
- L6: Parent interpretation for the worker: in SelectTile, "media" = the option `thumb` prop; the dev warning triggers on `thumb` with `text-only` (`ratio` alone does not). Visual-capture requirement applies to the 7 component PRs; #419 (MCP docs) records visuals as not applicable.
- L7: Owner decisions applied to all 8 specs (status Approved — 2026-11-16, 0 "Draft — not approved"); remaining items are implementation-plan details. Icon size discrepancy tracked in #428.
