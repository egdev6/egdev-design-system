# EmptyState v0.1 — spec approval record

- **Approved artifact:** `docs/components/empty-state/v0.1/spec.md`
- **SHA256:** `c38e35f3667f61abd162ae02431c612afcaeef13177116428caa678122219e36` — the spec's own hash definition: UTF-8 LF bytes from the exact line-start `## 1. Purpose and scope` heading line through EOF, including the final newline; the metadata above that heading is excluded. The same heading text also appears inline in that metadata, so the match is anchored at the line start (`awk '/^## 1\. Purpose and scope$/{f=1} f' spec.md | sha256sum`).
- **Snapshot commit:** the approval was given on the draft committed as `8f50f0b` (branch `integration/round-5`), whose payload SHA256 is `71e70809fac5739a630230b0a7fe632eada6c7ef5af72c6eb9a50fca84cf62f3`. The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published: the canonical component issue stays Pending and a later comment needs separate authorization.
- **Date:** 2026-11-26
- **Owner approval (verbatim):** "Aprobar todas (Recomendado)" — the answer to the question approving the round 5 specs, this one included, with each committed draft's recommended answers to its open questions (`odd/tasks/round-5-consumer-requests.md` L5). For this spec those are OQ-1 to OQ-5.

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | The no-paint recipe of §6: a centered column on the host backdrop with no Surface, background, border, shadow or gradient. The spacing values are unreferenced starting points that may change at the capture review. |
| OQ-2 | Optional `level`, 2 to 6, default 3; no `h1`. |
| OQ-3 | Optional `actions`: exactly one Button or Link, with Button-first guidance for the 44px touch target. |
| OQ-4 | `icon?: IconName`, rendered by the component at `lg` inside an `aria-hidden` wrapper. |
| OQ-5 | Visual source (b): the DS story is captured after implementation as Observed, separately authorized, unless the owner supplies a reference (a). VIS-01 stays Pending. |

The finalized spec differs from the approved draft only by these resolutions and the status wording they affect: the status, approval and identity metadata above the hash anchor; "Recipe (approved)" and "Approved utility inventory" in §6; closure checklist items 1 and 5 and the next step; and the heading, introduction and resolution column of the decisions table (formerly "Open questions"). No promise, API, anatomy, appearance or acceptance criterion changed.

## Naming conventions

The owner's answer covers "the new naming conventions it proposes" (L5). This spec proposes none: all five own props reuse approved registry entries (`heading-title`, `heading-level`, `content-description`, `trailing-actions`, `leading-icon`), with no new semantic ID and no exception. Adding the `EmptyState` usages to those entries happens at implementation and approves nothing globally.

## Scope

This approves the spec gate of T5 (S4, #573) for exactly the bytes identified above, including the OQ-1 to OQ-5 resolutions they contain. Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval (S6). Nothing here authorizes code, tests, token or dependency changes, registry writes, catalog or artifact regeneration, captures, a release or GitHub actions. It does not approve visual conformity: captures stay pending under `docs/design/README.md` (VIS-01 `visualHashes` Pending, visual conformity Not evaluated). The cataloging approval (L3) stays unchanged.
