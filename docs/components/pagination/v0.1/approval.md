# Pagination v0.1 — spec approval record

- **Approved artifact:** `docs/components/pagination/v0.1/spec.md`
- **SHA256:** `cb81738188ea161a6819027bec4bfe13703bf30c127966cf67d2c17489cd9a2f` — the spec's own hash definition: UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading line (anchored at line start; the inline mention in the header metadata does not count) through EOF, including the final newline; the metadata above that heading is excluded.
- **Snapshot commit:** the approval was given on the draft committed as `8f50f0b` (branch `integration/round-5`), whose payload SHA256 is `499588e019c8717f252b12b3b6811313f3acf349d10eb7581b8b873d79a49552` (its prefix `499588e0` is the one logged in `odd/tasks/round-5-consumer-requests.md` L4). The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published and no GitHub action was taken.
- **Date:** 2026-11-26
- **Owner approval (verbatim):** "Aprobar todas (Recomendado)" — given on the committed draft, with the recommended answer to each of its open questions (OQ-1 to OQ-7), including the new naming conventions it proposes, as recorded in `odd/tasks/round-5-consumer-requests.md` L5. It is a single answer covering all 11 Round 5 specs; this record covers Pagination only.

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | The window is fixed at one boundary and one sibling (7 slots); `siblingCount` and `boundaryCount` are not added in v0.1. |
| OQ-2 | The current page is a self-link (`a[href][aria-current="page"]`). |
| OQ-3 | Boundary Previous and Next are dimmed `aria-hidden` placeholders: not omitted and not disabled links. |
| OQ-4 | `pageCount` below 2 renders nothing; `value` is floored and clamped to `1..pageCount`; invalid input warns in development and renders nothing. |
| OQ-5 | `page-count` / `pageCount` and `page-href` / `getHref` are approved as new conventions, and the page-number payload of the existing `navigation-intent` convention is approved, as a convention decision recorded separately from the spec. `getHref` keeps its name. This record is not the registry receipt (see Scope). |
| OQ-6 | Recipe R1 (the selected treatment of Tabs `outline`, through `aria-[current=page]:` variants) and the proposed geometry are approved as written; no token is needed. |
| OQ-7 | Previous and Next keep their text and arrow at every width, and the row wraps. |

The finalized spec differs from the approved draft only by these resolutions and the status wording they affect: the status, approval and identity metadata above the hash anchor, the "Resolved (OQ-5)" notes on the three convention rows of the API table, the status words of recipe R1 and the geometry (OQ-6), the closure checklist and the next step, and the heading, introduction and resolution column of the decisions table. No promise, API, anatomy, appearance or acceptance criterion changed.

## Scope

This approves the spec gate (T5, S4 of `odd/tasks/round-5-consumer-requests.md`) for exactly the bytes identified above, including the OQ-1 to OQ-7 resolutions they contain. Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval (S6), and nothing here authorizes code, tests, token or dependency changes, registry writes, catalog or artifact regeneration, captures, a release or GitHub actions. It does not approve visual conformity: captures VIS-01 to VIS-03 stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated), and no expected design exists for Pagination. It is not a registry convention receipt: the `page-count` and `page-href` entries stay `proposed` with `approval: null` until a receipt binds each exact content at implementation. The cataloging approval (`odd/tasks/round-5-consumer-requests.md` L3) is unchanged and separate.
