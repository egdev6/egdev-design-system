# Carousel v0.4 — spec approval record

- **Approved artifact:** `docs/components/carousel/v0.4/spec.md`
- **SHA256:** `8f5bfbd8c3251ec760aa149d3d9334550e6dc7d4c23b5045813f48db970643e2` — the spec's own hash definition: UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading line through EOF, including the final newline; the metadata above that heading is excluded.
- **Snapshot commit:** the approval was given on the draft committed as `9e7d0c2` (branch `feat/pulso-consumer-requests`), whose payload SHA256 is `b5d1c2bf3982a468dc5225b06a3720136e594a1d777d51d44b7d8c97ab6f1a15`. The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published: #80 stays the canonical component issue and a later comment needs separate authorization.
- **Date:** 2026-11-25
- **Owner approval (verbatim):** "Aprobar con recomendaciones (Recomendado)" — in reply to the question approving the committed Carousel v0.4 draft with its recommended answers to the open questions (OQ-1 to OQ-6), asked in conversation without a SHA prefix (`odd/tasks/pulso-consumer-requests.md` L5).

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | `variant: 'default' \| 'current-emphasis'`, reusing the approved `visual-treatment` convention. No new convention and no exception. |
| OQ-2 | `border-border-brand` plus `--shadow-glow-active`, read as a state treatment of the same family as Stat `highlighted`, not as the Material principle 7 signature. `--shadow-hot` stays excluded. **Superseded on 2026-11-26 by Amendment 1: B, `--shadow-glow-base`.** |
| OQ-3 | For the opt-in only: "no halo" and "structural unpainted" are lifted through recipe R1, and the colour transition is allowed (removed under reduced motion). |
| OQ-4 | Opt-in track padding below the gap (starting point `px-6 pt-6 pb-10`) and wrapper radius `xl`; the final values are fixed after VIS-02 and VIS-04, within constraints C1 to C3. |
| OQ-5 | `current-emphasis` with `full-width` resolves silently to `default`; no warning and no type-level exclusion. |
| OQ-6 | The emphasis ships now; neighbours at rest stay out of scope (no rail layout, no padding above the gap). A rail request is filed separately only if needed. |

The finalized spec differs from the approved draft only by these resolutions and the status wording they affect: the status, approval and identity metadata above the hash anchor, the annotations of the "Changed promises" table, the heading and resolution column of the decisions table, the closure checklist and the next step. No promise, API, anatomy, appearance or acceptance criterion changed.

## Scope

This approves gate 2 (the spec, per S5 of `odd/tasks/pulso-consumer-requests.md`) for exactly the bytes identified above, including the OQ-1 to OQ-6 resolutions they contain. Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval, and nothing here authorizes code, tests, token or dependency changes, registry writes, catalog or artifact regeneration, captures, a release or GitHub actions. It does not approve visual conformity: captures VIS-02 to VIS-05 stay pending under `docs/design/README.md` (`visualHashes` Pending for them, visual conformity Not evaluated); VIS-01 is a historical TipCard capture, not a Carousel capture, and it is not adopted as the expected design. Convention approval stays separate: reusing the approved `visual-treatment` entry adds a usage later and approves nothing globally. The cataloging approval (`odd/tasks/pulso-consumer-requests.md` L3) and the historical v0.1 to v0.3 approvals stay unchanged.

## Amendment 1 — OQ-2 resolved as B, `--shadow-glow-base` (2026-11-26)

The amended payload hash below is the current one. The SHA256 at the top of this record stays as the hash the original approval bound.

- **Date:** 2026-11-26
- **Reason (finding F1):** the real-browser check of the #557 implementation (ODD S2, task T8: Storybook plus headless Chromium 153, pixel measurements) found that with the approved glow `--shadow-glow-active` (OQ-2 A) the glow tail is hard-clipped at the track's side edges. AC-05 (c) says the glow is "not visibly hard-clipped at the scrollport edges". The track clips at its padding edge, C1 caps the horizontal padding strictly below the 22.4 px gap, and `px-6` (19.2 px) is the largest spacing token that satisfies it, so the side padding cannot grow. At the first fully inside pixel against the flat canvas the clipped tail measured CIEDE2000 3.6 to 5.5 at the sides (3 to 7 of 255 levels). The vertical edges were controllable and were settled to 0.68 with `pt-7 pb-12`. On the same pages, overriding the current slide's `box-shadow` with `--shadow-glow-base` in the browser, the tail measured 0.56 to 1.02 at the sides and 0 at the vertical edges; that override figure was an estimate, and the second pass superseded it on the real build: the glow's own clipped tail is 0.68 (one 8-bit level) at every edge, and typical content, which adds its own and the neighbouring slide's elevation shadow, measures 0.98 to 1.23 at the sides. The implementation matched the approved plan. Measurements: [implementation-evidence.md](implementation-evidence.md), finding F1.
- **Change:** OQ-2 resolved as B instead of A, and what that decides in the spec's payload: the glow token of recipe R1 (the current-slide row and its `:focus-visible` compound), the token map, the C2 reach estimate, the token named by AC-04, the reference-to-token differences and "allowed differences" sentences (the glow is no longer the reference's value), the three references to "OQ-2 A" outside the R1 row, F-2, the Resolved-decisions introduction, the OQ-2 resolution cell and the table heading, plus the header status, approval reference and the `contentSHA256` identity field. Nothing else in the spec changed: the approved starting point `px-6 pt-6 pb-10` (OQ-4 A), the constraints C1 to C3, every other acceptance criterion and the other five resolutions are unchanged.
  - Before: R1 current slide `aria-[current=true]:shadow-[var(--shadow-glow-active)]` and, with `:focus-visible`, `aria-[current=true]:focus-visible:shadow-[var(--shadow-focus),var(--shadow-glow-active)]`.
  - After: the same two utilities with `var(--shadow-glow-base)` instead.
- **Owner approval (verbatim):** "B: pasar a --shadow-glow-base (Recomendado)" — the answer to the question that explained the trade-offs: that B amends OQ-2 to option B, that the answer is recorded as the renewed approval of the amended spec, and that the registry, artifact and checks are re-run. It was relayed to the implementation writer by the parent and is logged in `odd/tasks/pulso-consumer-requests.md` L10.
- **SHA256 of the spec payload** (same hash definition as above):
  - Old: `8f5bfbd8c3251ec760aa149d3d9334550e6dc7d4c23b5045813f48db970643e2`
  - New: `3295df2f1cd6c314c4d5a2c02ac22f41e23cdc94b370e788d7eb66979d56f52b`
- **Plan:** [implementation-plan.md](implementation-plan.md) pins the spec hash in its header. It now pins the new hash, and this answer is recorded as the plan's renewed approval against the amended spec. The plan's own payload is unchanged, so its `contentSHA256` `96f6d303048adb8a471490aa45ae47849f750121d08e46122717ddab56515874` is unchanged; its sections 3 to 5 still spell the glow utilities with `--shadow-glow-active`, which the amended spec supersedes for the glow token only.
- **Scope:** this approves exactly the glow token change and the consequences listed above, and no other change. The track padding is still fixed by measurement within C1 to C3, as OQ-4 A says; the values are recorded in [implementation-evidence.md](implementation-evidence.md), not in the spec. Visual captures are still not authorized: `visualHashes` stay Pending and visual conformity (AC-15) stays Not evaluated. The amended bytes are not committed yet; the parent commits them. No GitHub action was taken and the #80 snapshot stays Pending.
