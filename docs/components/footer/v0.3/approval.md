# Footer v0.3 — spec approval record

- **Approved artifact:** `docs/components/footer/v0.3/spec.md`
- **SHA256:** `3fe3906f9f4a68e33b94aa1d8bdd240efbd3f0db2f2754671b7d3c583e22f5a0` — the spec's `contentSHA256`: SHA-256 of the UTF-8 payload from the exact heading line `## 1. Purpose and scope` through EOF, LF line endings, final newline included; the metadata above that heading is excluded. Reproduce with `awk '/^## 1\. Purpose and scope$/{f=1} f' docs/components/footer/v0.3/spec.md | sha256sum`.
- **Snapshot commit:** `8761dcd` (branch `feat/pulso-consumer-requests`) holds the draft that was approved, with provisional `contentSHA256` `7818611eb64e14e456847e03bc03b1711afd8e9a6fc3d5382b726f81b2cbc441`. The finalized spec and this record are committed afterwards (commit pending). No issue snapshot is published (OQ-3).
- **Date:** 2026-11-25
- **Owner approval (verbatim):** "Aprobar con recomendaciones (Recomendado)" — given on the committed draft, with the recommended answer to each of its four open questions, in reply to a question asked in conversation without a SHA prefix. The answers: OQ-1 attribute only, no visible cue; OQ-2 forward out-of-type runtime values unchanged; OQ-3 publish as a comment on #293, cross-linked from #559; OQ-4 no shared registry convention. The same approval is recorded in `odd/tasks/pulso-consumer-requests.md` L5.

## Scope

This approves the spec gate for exactly the payload identified above: the committed draft with its recommended answers folded in and nothing else changed (see the spec's "Resolved owner decisions" table). The question carried no SHA prefix, so the owner approved the committed draft and its recommended answers; the SHA256 above identifies the finalized bytes derived from them. Any later change to the payload needs a new approval.

It does **not** authorize implementation: the implementation plan (`implementation-plan.md`, Proposed) needs its own, separate approval, and no code, test, registry, generated-file, token, dependency, release or GitHub change follows from this record. It does not publish the snapshot: the comment on #293 (OQ-3) needs the owner's separate authorization. It does not approve visual conformity: the spec defines no visual reference, the v0.2 captures VIS-01 and VIS-02 stay pending under `docs/design/README.md`, and no capture was taken. Historical v0.1 and v0.2 approvals stay unchanged.
