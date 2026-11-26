# Footer v0.4 — spec approval record

- **Approved artifact:** `docs/components/footer/v0.4/spec.md`
- **SHA256:** `331bad27caec2d85105c724e0656addb15ff7cc9c49d0944b3d09491084d279a` — the spec's own hash definition: UTF-8 LF bytes from the exact whole heading line `## 1. Purpose and scope`, anchored at line start, through EOF, including the final newline; the metadata above that heading is excluded. Reproduce with `awk '/^## 1\. Purpose and scope$/{f=1} f' docs/components/footer/v0.4/spec.md | sha256sum`.
- **Snapshot commit:** the approval was given on the draft committed as `7ed25eb` (branch `integration/round-5`), whose payload SHA256 is `b33fdfc17ff8f18fe3f7c442e53612f493319e3a7e38e52c7c7d16592d16820b` (prefix `b33fdfc1`, recorded in `odd/tasks/round-5-consumer-requests.md` L4). The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published: #293 stays Footer's canonical issue and a later comment needs the owner's separate authorization.
- **Date:** 2026-11-26
- **Owner approval (verbatim):** "Aprobar todas (Recomendado)" — in reply to the question approving the committed Round 5 spec drafts with each draft's recommended answers to its open questions (OQ-1 to OQ-5 for this spec), including the new naming conventions each draft proposes, logged in `odd/tasks/round-5-consumer-requests.md` L5. The repository does not record the text of that question, so the SHA256 above binds the bytes derived from the committed draft plus those answers, not a digest the owner quoted.

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | `section-register` and `section-content-wrap` are both widened to Footer with the exact amendment text in the spec's block 3 (`meaning` and `whenToUse`). One receipt with both semantic amendments is created by the implementation plan before any registry usage is added. No new ID and no exception. |
| OQ-2 | The group-edge fade stays host-owned: no `fade` prop, underlay part or token. A `HostFade` story documents the pattern. |
| OQ-3 | `eg-footer__wrap` is emitted only when `wrap` is true; the v0.1 legacy marker inventory is extended for this one marker. |
| OQ-4 | One wrapper and no negative margins: the root hairlines stay full width and the inner hairlines span the content box. It is judged on VIS-01 before the visuals are adopted. |
| OQ-5 | Link v0.5 (#562) is a hard prerequisite of the Footer v0.4 plan, with FT-28 gated on it: Link v0.5 first, then Footer v0.4. If Link v0.5 slips, FT-28 and the link adoption move to a later Footer amendment rather than holding `wrap` and `register`. |

The finalized spec differs from the approved draft only by these resolutions and the status wording they affect: the status, approval, current-situation, owner-authority and identity metadata above the hash anchor; six phrases that named an open question as pending or described an unapproved draft (the block 1 notes on OQ-1 and OQ-3, the block 3 convention-amendment heading and its table column, the block 6 Footer-links bullet and the FT-30 row); the heading, introduction and resolution column of the decisions table; four closure checklist items; and the next step. No API, anatomy, appearance or acceptance promise changed.

## Scope

This approves the spec gate (cataloging → spec → plan → code, S6 of `odd/tasks/round-5-consumer-requests.md`) for exactly the bytes identified above, including the OQ-1 to OQ-5 resolutions they contain. Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval, which per OQ-5 waits for Link v0.5 (#562) to be implemented and for T2 (the single-child `key` warning) to land. Nothing here authorizes code, tests, token or dependency changes, registry writes (including the receipt for the two convention amendments), catalog or artifact regeneration, captures, a release or GitHub actions. It does not approve visual conformity: captures VIS-01 to VIS-04 stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated). Convention approval stays separate in form: the owner's answer to OQ-1 decides the two amendments, and the plan creates the receipt that binds their exact text and `conventionHash` values before any usage is added; this record alone changes no registry entry. The cataloging approval (L3) and the historical v0.1 to v0.3 approvals stay unchanged.
