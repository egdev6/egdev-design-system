# Link v0.5 — spec approval record

- **Approved artifact:** `docs/components/link/v0.5/spec.md`
- **SHA256:** `db442bd1d74bfd3d2e983b797895f76ad0de486de2ba0d19b390d437db68af81` — the spec's own hash definition: UTF-8 LF bytes from the exact whole heading line `## 1. Purpose and scope`, anchored at line start, through EOF, including the final newline; the metadata above that heading is excluded.
- **Snapshot commit:** the approval was given on the draft committed as `7ed25eb` (branch `integration/round-5`), whose payload SHA256 is `68420d3090785b165cdcca6783874af789b40a630af5621e29019844935d5175` (prefix `68420d30`, recorded in `odd/tasks/round-5-consumer-requests.md` L4). The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published: #61 stays the canonical component issue and a later comment needs separate authorization.
- **Date:** 2026-11-26
- **Owner approval (verbatim):** "Aprobar todas (Recomendado)" — in reply to the question approving the committed Round 5 spec drafts with each draft's recommended answers to its open questions (OQ-1 to OQ-5 for this spec), logged in `odd/tasks/round-5-consumer-requests.md` L5. The repository does not record the text of that question, so the SHA256 above binds the bytes derived from the committed draft plus those answers, not a digest the owner quoted.

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | `quiet` keeps `--text-label-default` (11.2px/1.2/600): no size change and no new token, so switching variant never shifts layout. This overrides the cataloging draft's `--text-body-large` suggestion, which was wrong under the global ×0.8 scale (`odd/tasks/round-5-consumer-requests.md` L4). Exact parity (a new 12px/1.3/600 step) is not taken. |
| OQ-2 | The underline is the neon `--color-fg-brand-default` (`decoration-fg-brand-default`), not the reference's 45% alpha `--color-border-brand`. |
| OQ-3 | `quiet` keeps the v0.4 hover rule: underline removed, ink unchanged, arrow nudge unless motion is reduced. The owner accepts that a hovered quiet link keeps neither colour nor underline (the pointer cursor, the arrow when shown and the keyboard focus ring remain as cues). |
| OQ-4 | The NowCard, CommunityCard and ProjectCard stories keep the deprecated `underlined`; they do not move to `quiet` in this version. |
| OQ-5 | `FooterNavigation` adopts `quiet` through the Footer amendment for #561 + #565 ("Footer v0.4"), implemented after this version. This spec edits no Footer file and no `FooterNavigation` variant prop is added. |

The spec proposes no new naming convention and no exception, so this answer approves none: it reuses the approved `visual-treatment` convention (the existing Link usage widens its value union).

The finalized spec differs from the approved draft only by these resolutions and the status wording they affect: the status, approval, current-situation and identity metadata above the hash anchor (plus one clarification of the hash definition, which now names the heading as a whole line anchored at line start); four phrases that treated a question as open (§3 "OQ-1's recommendation", §5 "for the owner to accept in OQ-3", §6 "if OQ-1 chose exact parity", and VIS-04 "decides OQ-2 by eye"); two closure checklist items; the heading, introduction and added resolution column of the decisions table (the former "If the owner answers differently" column is retitled "Alternative not taken, and its cost"); and the next step. No API, anatomy, appearance or acceptance promise changed.

## Scope

This approves the spec gate (cataloging → spec → plan → code, S6 of `odd/tasks/round-5-consumer-requests.md`) for exactly the bytes identified above, including the OQ-1 to OQ-5 resolutions they contain. Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval, and nothing here authorizes code, tests, token or dependency changes, registry writes, catalog or artifact regeneration, captures, a release or GitHub actions. It does not approve visual conformity: captures VIS-01 to VIS-04 stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated), and the v0.3 captures cited in the spec are historical and not adopted. Convention approval stays separate: reusing the approved `visual-treatment` entry approves nothing globally. The footer half of #562 (`FooterNavigation` adopting `quiet`) is not covered: it belongs to the Footer v0.4 spec and its own plan (OQ-5). The cataloging approval (`odd/tasks/round-5-consumer-requests.md` L3) stays unchanged.
