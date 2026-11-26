# SectionNav v0.3 — spec approval record

- **Approved artifact:** `docs/components/section-nav/v0.3/spec.md`
- **SHA256:** `83f23fa23ef46a407cac5b96490fc9de030f1d7f872eafd94e738013f5c9052f` — the spec's own hash definition: UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading line (anchored at line start; the inline mention in the header metadata does not count) through EOF, including the final newline; the metadata above that heading is excluded.
- **Snapshot commit:** the approval was given on the draft committed as `7ed25eb` (branch `integration/round-5`), whose payload SHA256 is `c317943f9eaaedaa68ffa461eca96f5ab748e1155b776c8d2c2f209a8bfbf5b2` (its prefix `c317943f` is the one logged in `odd/tasks/round-5-consumer-requests.md` L4). The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published and no GitHub action was taken.
- **Date:** 2026-11-26
- **Owner approval (verbatim):** "Aprobar todas (Recomendado)" — given on the committed draft, with the recommended answer to each of its open questions (OQ-1 to OQ-4), as recorded in `odd/tasks/round-5-consumer-requests.md` L5. This draft proposes no new naming convention, so none is approved by it. It is a single answer covering all 11 Round 5 specs; this record covers SectionNav v0.3 only.

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | The zero-padded number stays in each index link's accessible name and is not `aria-hidden`: the name is the number, one space and the host label (`02 Beta`). |
| OQ-2 | The pill recipe applies to every index row on both surfaces: brand-raised numbers and uppercase display labels, one recipe per part, and no number colour that depends on `aria-current`. Strict Pulso list parity is not taken. |
| OQ-3 | `text-meta` for the number and the label. If VIS-01 to VIS-03 look too small, the owner chooses between another existing step and a new token; none is proposed now. |
| OQ-4 | This amendment is left as it is; the pre-existing disclosure Label in Name gap is tracked as a separate follow-up. This record does not create that follow-up. |

The finalized spec differs from the approved draft only by these resolutions and the status wording they affect: the status, approval, situation, snapshot-identity and hash-definition metadata above the hash anchor (the hash definition gains only the line-start anchoring clarification and the digest-is-not-approval sentence); the "resolved" wording of the OQ-1 decision and the OQ-4 note (block 5), the OQ-2 note (block 1) and the Tokens / Material status words (block 6); the heading, introduction and resolution column of the decisions table; the closure checklist and the next step. No promise, API, anatomy, appearance or acceptance criterion changed.

## Scope

This approves the spec gate (T5, S3 of `odd/tasks/round-5-consumer-requests.md`) for exactly the bytes identified above, including the OQ-1 to OQ-4 resolutions they contain. Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval (S6), and nothing here authorizes code, tests, token or dependency changes, registry writes, catalog or artifact regeneration, captures, a release or GitHub actions. It does not approve visual conformity: captures VIS-01 to VIS-03 stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated), and no expected design is adopted for v0.3. It is not a registry convention approval: the spec proposes no new or changed own prop and no new naming convention, and the existing conventions and accessible-name exceptions it cites keep their own approvals. The cataloging approval (`odd/tasks/round-5-consumer-requests.md` L3) and the historical v0.1 and v0.2 approvals stay unchanged and separate.
