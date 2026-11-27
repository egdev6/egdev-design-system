# ProjectCard v0.4 — spec approval record

- **Approved artifact:** `docs/components/project-card/v0.4/spec.md`
- **SHA256:** `b1b9beae5aa5d551ec97fb18f1e3f8db1290ab49c8a6e5ee72ba136eea1cf468` — the spec's own hash definition: UTF-8 LF bytes from the exact line-start heading `## 1. Purpose and scope` (the inline mention in the header metadata does not count) through EOF, including the final newline; the metadata above that heading is excluded. Reproduce it with `awk '/^## 1\. Purpose and scope$/{f=1} f' docs/components/project-card/v0.4/spec.md | sha256sum`.
- **Snapshot commit:** the approval was given on the drafts committed as `a43273e` (branch `integration/round-5`): the spec payload SHA256 there is `0f09e0353dedec6dd24eb7d5920760317854447e530c8388b9d2ac6994c8e74c` (prefix `0f09e035`) and the plan payload SHA256 is `6eb633b188b1cfcae651aabf3ab4f26b5114bd6d9c0cec228217bfd53ba3a23b` (prefix `6eb633b1`). The finalized bytes identified by the SHA256 above, with the recommended answers resolved, are not committed yet; the parent commits them. No issue snapshot is published and no GitHub action was taken: [#577](https://github.com/egdev6/egdev-design-system/issues/577) originates this amendment but is not a component issue, and the canonical component issue stays [#275](https://github.com/egdev6/egdev-design-system/issues/275).
- **Date:** 2026-11-27
- **Owner approval (verbatim):** "Aprobar las dos (Recomendado)" — the owner's answer to the approval question for the Chip v0.3 and ProjectCard v0.4 specs and plans, recorded in `odd/tasks/round-5-consumer-requests.md` L11 as approving the specs and the plans together, with their recommended answers (OQ-1 to OQ-3 for this spec), the browser runs, the packed consumers and the `(#N)` citations (`(#577)` for this one). The answer is the option label above and quotes no digest, so the SHA256 above binds the bytes derived from the committed draft plus those recommended answers.

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | The card-level obligation is documented, not enforced: each footer action's accessible name is distinct within the card and states its destination or operation, and the documentation recommends adding the project name to the accessible name, with the visible label kept inside it, when the same wording repeats across the cards of a listing. Page-wide uniqueness is the app's concern. |
| OQ-2 | The limit of a single label wider than the card is documented, not styled: wrapping the row cannot help one control wider than the content box, the card's legacy `overflow: hidden` clips what passes its padding edge (the v0.3 Amendment 1 behavior), and the consumer supplies short labels or Button `labelWrap`. No child-width rule such as `[&>*]:max-w-full` joins the footer recipe. |
| OQ-3 | No registry write: `ProjectCardFooter.children` stays an unregistered part slot, as every part-level `children` slot is today. No convention, usage, exception or receipt is added; only the ten `types.ts` source revisions are refreshed at implementation, which is source-evidence freshness and approves nothing globally. |

## Differences from the approved draft

The finalized spec differs from the committed draft only by: the status, approval-and-recovery, current-situation and snapshot-identity metadata above the hash anchor; in the payload, one word in §3 ("Approved JSDoc for `types.ts`" instead of "Proposed JSDoc for `types.ts`"), the first and fifth items of the spec closure (now checked, with their notes rewritten), the two plan and spec rows and the code row of the gate map, and the closing section: the "Open owner decisions" bullets became the "Resolved decisions" table (each question's options are kept as drafted, the "(recommended)" markers and the "Why (a)" rationale moved into the resolution column, and the OQ-3 resolution adds one sentence taken from plan G3), followed by one paragraph on the digest and the plan pin and by the next step. No API, anatomy, behavior, accessibility, appearance, acceptance criterion or owner-facing promise changed.

## Plan

The same owner answer approved the [implementation plan](implementation-plan.md) as a separate gate (S6). The plan's header now says **Approved** and pins the final spec SHA256 above; the draft digest it was written against (`0f09e035…`) is recorded there as history. Its payload (from `## 1. Authority and gates`) is untouched, so its own `contentSHA256` `6eb633b188b1cfcae651aabf3ab4f26b5114bd6d9c0cec228217bfd53ba3a23b` is unchanged and is the digest of the plan the owner approved, as committed in `a43273e`. The plan still says in its body (G2 and the baseline) that the spec is Proposed, which the approved header supersedes. The sections that rest on an answer (OQ-1 the documented naming wording, OQ-2 the over-wide label observation of §9.4, OQ-3 the registry scope of G3 and §5.1) were re-read against the approved bytes and need no change.

## Scope

This approves the spec gate (S2 and S6 of `odd/tasks/round-5-consumer-requests.md`; its cataloging was approved in L10) for exactly the bytes identified above, including the OQ-1 to OQ-3 resolutions they contain. Any later change to the spec needs a new approval.

By itself it authorizes no code, tests, token or dependency changes, registry writes, catalog or artifact regeneration, captures, a release or GitHub actions; implementation rests on the separate plan approval described above. It does not approve visual conformity: captures VIS-01 and VIS-02 stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated), and none was authorized. It is not a registry convention receipt: no convention is requested (OQ-3). The cataloging approval (`odd/tasks/round-5-consumer-requests.md` L10) and the historical v0.1 to v0.3 approvals stay unchanged. Publishing the v0.4 snapshot as a comment on #275 is a separate GitHub authorization.
