# Chip v0.3 — spec approval record

- **Approved artifact:** `docs/components/chip/v0.3/spec.md`
- **SHA256:** `7efca5cf6ce948c352d7f9aebbaab6deb26e10385a54389f112ad813a292095f` — the spec's own hash definition: UTF-8 LF bytes from the exact whole heading line `## 1. Purpose and scope`, anchored at line start (the inline mention in the header metadata does not count), through EOF, including the final newline; the metadata above that heading is excluded. Reproduce it with `awk '/^## 1\. Purpose and scope$/{f=1} f' docs/components/chip/v0.3/spec.md | sha256sum`.
- **Snapshot commit:** the approval was given on the drafts committed as `a43273e` (branch `integration/round-5`): the spec payload SHA256 there is `72174131b0988846c99664146ba39b096bf1a1035c947fe35709bad17d1e0cae` (prefix `72174131`, the one recorded in `odd/tasks/round-5-consumer-requests.md` L11) and the plan payload SHA256 is `4b8b88c7102439460108cedb1690fa5b1d9b1d81b9bd9568c6c36bb0afa6af12` (prefix `4b8b88c7`, L11 too). The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published and no GitHub action was taken: [#576](https://github.com/egdev6/egdev-design-system/issues/576) originates this amendment but is not a component issue, and the canonical component issue stays [#55](https://github.com/egdev6/egdev-design-system/issues/55).
- **Date:** 2026-11-27
- **Owner approval (verbatim):** "Aprobar las dos (Recomendado)" — the owner's answer to the approval question for the Chip v0.3 and ProjectCard v0.4 specs and plans, recorded in `odd/tasks/round-5-consumer-requests.md` L11 as approving the specs and the plans together, with their recommended answers (OQ-1 to OQ-4 for this spec), the browser runs, the packed consumers and the `(#N)` citations. The repository does not record the text of the question, so the SHA256 above binds the bytes derived from the committed draft plus those answers, not a digest the owner quoted.

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | The forced-colours focus outline applies to every link chip, for Pagination parity: the three `forced-colors:focus-visible` utilities stay in recipe R1. The toggle has the same gap and is left for a separate amendment; the inherited limit (a focused current chip is indistinguishable from its resting state in forced colours) is accepted and documented. |
| OQ-2 | The non-colour cue is a documented consumer obligation, not a requirement: the consumer passes `icon` with a check glyph (`LinkCurrentWithIcon`). Chip adds no glyph and enforces nothing. |
| OQ-3 | A hovered current chip keeps its current paint, as the toggle's `on` and Pagination's current page do; the order of the emitted rules proves it (plan G6). |
| OQ-4 | The narrowed `aria-current` is not a registry convention: no entry, no usage and no exception are added. Only the `source.revision` of the seven existing Chip usages is refreshed at implementation, which is source-evidence freshness and approves nothing globally. |

The directive of the narrowed `aria-current` declaration is not one of the questions: the spec keeps `@control false` with a reason as a proposal that the real extraction confirms or corrects at implementation (spec §3, plan G5).

## Differences from the approved draft

The finalized spec differs from the committed draft only by: the status, approval-and-recovery, current-situation and snapshot-identity metadata above the hash anchor; in the payload, the status words of recipe R1 in §6 ("Tokens / Material": approved with this spec, with OQ-1 recorded), one word in the §6 "Files" line (the catalog correction "is corrected under the plan" instead of "is proposed separately"), the snapshot-identity item of the spec closure, the heading, introduction and resolution column of the decisions table (which keeps every question, evidence cell and recommendation text as drafted, each resolution prefixed "Resolved"), and the closing paragraph and next step. No API, anatomy, appearance, acceptance criterion or owner-facing promise changed.

## Plan

The same owner answer approved the [implementation plan](implementation-plan.md) as a separate gate (S6). The plan's header now says **Approved** and pins the final spec SHA256 above; the draft digest it was written against (`72174131…`) is recorded there as history. Its payload (from `## 1. Authority and gates`) is untouched, so its own `contentSHA256` `4b8b88c7102439460108cedb1690fa5b1d9b1d81b9bd9568c6c36bb0afa6af12` is unchanged and is the digest the owner's answer cited. The plan still says in its body (G2 and the baseline) that the spec is Proposed, which the approved header supersedes. The sections that rest on an answer (OQ-1 the three `forced-colors:focus-visible` utilities, OQ-3 the hover-order proof) were re-read against the approved bytes and need no change.

## Scope

This approves the spec gate (S2 and S6 of `odd/tasks/round-5-consumer-requests.md`; request #576 was filed in L7 and its cataloging approved in L10) for exactly the bytes identified above, including the OQ-1 to OQ-4 resolutions they contain. Any later change to the spec needs a new approval.

By itself it authorizes no code, tests, token or dependency changes, registry writes, catalog or artifact regeneration, captures, a release or GitHub actions; implementation rests on the separate plan approval described above. It does not approve visual conformity: captures VIS-02 to VIS-05 stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated), and none was authorized. It is not a registry convention receipt: no convention is requested (OQ-4). The cataloging approval (`odd/tasks/round-5-consumer-requests.md` L10) and the historical v0.1 and v0.2 approvals stay unchanged. Publishing the v0.3 snapshot as a comment on #55 is a separate GitHub authorization.
