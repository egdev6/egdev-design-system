# StepMeter v0.1 — spec approval record

- **Approved artifact:** `docs/components/step-meter/v0.1/spec.md`
- **SHA256:** `1da0f307a65e2ade2f750ab6dd6cd1d6702096c08227fa591eecfa63df0de368`
- **Snapshot commit:** Pending: the parent commits the finalized spec and this record on branch `feat/pulso-consumer-requests`. The owner approved the draft committed as `68ea3a4` (draft payload SHA256 `5e02321e5077b4fcd77559ab81790d60feef2aab582690935f77a8c8c4787435`). No issue snapshot is published and no GitHub action was taken.
- **Date:** 2026-11-25
- **Owner approval (verbatim):** "Aprobar con recomendaciones (Recomendado)" — given on the committed draft, with the recommended answer to each of its open questions (OQ-1 to OQ-8), as recorded in `odd/tasks/pulso-consumer-requests.md` L5. The question was asked in conversation without a SHA prefix.

## Resolved decisions

Each open question was resolved with the answer the draft recommended. The spec keeps the question table as the record.

| ID | Resolution |
| --- | --- |
| OQ-1 | The name is `StepMeter`; nothing is renamed. |
| OQ-2 | `role="img"` with a required consumer `label`; not `role="meter"`, not native `<meter>`. |
| OQ-3 | `steps` stays (default 4, integer 1–10, invalid falls back to 4); a fractional `value` is floored. |
| OQ-4 | Size ported by token units at ×0.8; mechanism is the static clip-path literal, approved exactly as `w-3.5 h-3.75` with `[clip-path:polygon(0_0,100%_47.6%,100%_100%,0_52.4%)]`. The plan proves emission and computed geometry and stops and returns on disagreement. |
| OQ-5 | The reference paint is kept. The owner accepts that WCAG 1.4.11 is not claimed for the empty remainder; the filled run is the informative graphic and the level is also text through `label`. |
| OQ-6 | Forced colors: filled steps paint `CanvasText`, empty steps are not painted, with `forced-color-adjust: none` scoped to forced colors through system-color keywords. |
| OQ-7 | The flat token-paint Material recipe of spec §6 is approved (decorative marks: no Surface, elevation, well, overlay, glow or gradient). |
| OQ-8 | `step-count` / `steps` is approved as a convention decision, recorded separately from this spec. This record is not the registry receipt (see Scope). |

## Scope

This approves gate G4 (the spec gate of S5) for exactly the bytes identified above, with the recommended answers folded in. The answer was given on the committed draft; the digest above was computed afterwards over the final file, which differs from the draft only by resolving the open questions (status, snapshot identity, closure, next step and the resolved-decisions table). Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval, and no code, token, dependency, registry, catalog, artifact, GitHub or release change is authorized by this record. It does not approve visual conformity; captures remain pending under `docs/design/README.md` (VIS-01 Pending, no capture exists). It is not a registry convention receipt: the `step-count` entry stays `proposed` with `approval: null` until a receipt binds its exact content. The cataloging approval (`odd/tasks/pulso-consumer-requests.md` L3) is unchanged and separate.

[NowCard v0.3](../../now-card/v0.3/approval.md) was approved in the same answer and has its own record.
