# Carousel v0.4 — spec approval record

- **Approved artifact:** `docs/components/carousel/v0.4/spec.md`
- **SHA256:** `8f5bfbd8c3251ec760aa149d3d9334550e6dc7d4c23b5045813f48db970643e2` — the spec's own hash definition: UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading line through EOF, including the final newline; the metadata above that heading is excluded.
- **Snapshot commit:** the approval was given on the draft committed as `9e7d0c2` (branch `feat/pulso-consumer-requests`), whose payload SHA256 is `b5d1c2bf3982a468dc5225b06a3720136e594a1d777d51d44b7d8c97ab6f1a15`. The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published: #80 stays the canonical component issue and a later comment needs separate authorization.
- **Date:** 2026-11-25
- **Owner approval (verbatim):** "Aprobar con recomendaciones (Recomendado)" — in reply to the question approving the committed Carousel v0.4 draft with its recommended answers to the open questions (OQ-1 to OQ-6), asked in conversation without a SHA prefix (`odd/tasks/pulso-consumer-requests.md` L5).

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | `variant: 'default' \| 'current-emphasis'`, reusing the approved `visual-treatment` convention. No new convention and no exception. |
| OQ-2 | `border-border-brand` plus `--shadow-glow-active`, read as a state treatment of the same family as Stat `highlighted`, not as the Material principle 7 signature. `--shadow-hot` stays excluded. |
| OQ-3 | For the opt-in only: "no halo" and "structural unpainted" are lifted through recipe R1, and the colour transition is allowed (removed under reduced motion). |
| OQ-4 | Opt-in track padding below the gap (starting point `px-6 pt-6 pb-10`) and wrapper radius `xl`; the final values are fixed after VIS-02 and VIS-04, within constraints C1 to C3. |
| OQ-5 | `current-emphasis` with `full-width` resolves silently to `default`; no warning and no type-level exclusion. |
| OQ-6 | The emphasis ships now; neighbours at rest stay out of scope (no rail layout, no padding above the gap). A rail request is filed separately only if needed. |

The finalized spec differs from the approved draft only by these resolutions and the status wording they affect: the status, approval and identity metadata above the hash anchor, the annotations of the "Changed promises" table, the heading and resolution column of the decisions table, the closure checklist and the next step. No promise, API, anatomy, appearance or acceptance criterion changed.

## Scope

This approves gate 2 (the spec, per S5 of `odd/tasks/pulso-consumer-requests.md`) for exactly the bytes identified above, including the OQ-1 to OQ-6 resolutions they contain. Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval, and nothing here authorizes code, tests, token or dependency changes, registry writes, catalog or artifact regeneration, captures, a release or GitHub actions. It does not approve visual conformity: captures VIS-02 to VIS-05 stay pending under `docs/design/README.md` (`visualHashes` Pending for them, visual conformity Not evaluated); VIS-01 is a historical TipCard capture, not a Carousel capture, and it is not adopted as the expected design. Convention approval stays separate: reusing the approved `visual-treatment` entry adds a usage later and approves nothing globally. The cataloging approval (`odd/tasks/pulso-consumer-requests.md` L3) and the historical v0.1 to v0.3 approvals stay unchanged.
