# NowCard v0.3 — spec approval record

- **Approved artifact:** `docs/components/now-card/v0.3/spec.md`
- **SHA256:** `2ed402f029d3494334f600d8c037615664b63c6b48df00f9c662d66feba19253`
- **Snapshot commit:** Pending: the parent commits the finalized spec and this record on branch `feat/pulso-consumer-requests`. The owner approved the draft committed as `68ea3a4` (draft payload SHA256 `11dc2281179c1bc47350ca5fe45580530370ada050d0cf6b7356f9230b884b87`). The issue snapshot would be an authorized comment on #276 and is Pending; no GitHub action was taken.
- **Date:** 2026-11-25
- **Owner approval (verbatim):** "Aprobar con recomendaciones (Recomendado)" — given on the committed draft, with the recommended answer to each of its open questions (OQ-1 and OQ-2), as recorded in `odd/tasks/pulso-consumer-requests.md` L5. The question was asked in conversation without a SHA prefix.
- **Depends on:** [StepMeter v0.1](../../step-meter/v0.1/approval.md), `contentSHA256` `1da0f307a65e2ade2f750ab6dd6cd1d6702096c08227fa591eecfa63df0de368`, approved in the same answer.

## Resolved decisions

Each open question was resolved with the answer the draft recommended. The spec keeps the question table as the record.

| ID | Resolution |
| --- | --- |
| OQ-1 | With a StepMeter present, the footer holds it plus at most one other child; three children stay unsupported and unenforced. |
| OQ-2 | StepMeter v0.1 and this amendment are approved in the same answer, and the name `StepMeter` is final, so nothing is renamed. |

## Scope

This approves gate G4 (the spec gate of S5) for exactly the bytes identified above, with the recommended answers folded in. It amends the effective NowCard contract (v0.1 as amended by badge order and body growth, then [v0.2](../v0.2/approval.md)) in documentation only: the footer promise and the meter exclusion. The answer was given on the committed draft; the digest above was computed afterwards over the final file, which differs from the draft only by resolving the open questions (status, snapshot identity, the StepMeter dependency note, closure, next step and the resolved-decisions table). Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](../../step-meter/v0.1/implementation-plan.md), one plan covering StepMeter v0.1 and this amendment, Proposed) needs its own, separate approval, and no code, token, dependency, registry, catalog, artifact, GitHub or release change is authorized by this record. It does not approve visual conformity; captures remain pending under `docs/design/README.md` (VIS-01 Pending, no capture exists). Historical v0.1 and v0.2 approvals stay unchanged, and the cataloging approval (`odd/tasks/pulso-consumer-requests.md` L3) is separate.
