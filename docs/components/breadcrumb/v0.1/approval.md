# Breadcrumb v0.1 — spec approval record

- **Approved artifact:** `docs/components/breadcrumb/v0.1/spec.md`
- **SHA256:** `4de99d12f314f81b57e5d567bc06151443c7de806f2be0f0590607541418c962` — the spec's own hash definition: UTF-8 LF bytes from the exact whole heading line `## 1. Purpose and scope`, anchored at line start, through EOF, including the final newline; the metadata above that heading is excluded.
- **Snapshot commit:** the approval was given on the draft committed as `8f50f0b` (branch `integration/round-5`), whose payload SHA256 is `1f78dbd47d1f6888456590a104ead1a03671427eb512cdcd67a0a2897b717949` (prefix `1f78dbd4`, recorded in `odd/tasks/round-5-consumer-requests.md` L4). The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published: the canonical component issue is chosen at handoff and a later comment needs separate authorization.
- **Date:** 2026-11-26
- **Owner approval (verbatim):** "Aprobar todas (Recomendado)" — in reply to the question approving the committed Round 5 spec drafts with each draft's recommended answers to its open questions (OQ-1 to OQ-7 for this spec), logged in `odd/tasks/round-5-consumer-requests.md` L5. The repository does not record the text of that question, so the SHA256 above binds the bytes derived from the committed draft plus those answers, not a digest the owner quoted.

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | The current page is non-link text with `aria-current="page"`, derived from the last supplied entry; the last entry's `href` is ignored. |
| OQ-2 | The separator is the existing `chevron-down` rotated −90°; no Icon change. The rotation is physical (no right-to-left mirroring, a stated limit). |
| OQ-3 | Link `quiet` (#562) is a hard prerequisite: its spec is approved and `quiet` is implemented before the Breadcrumb plan is approved. No `plain` fallback and no own anchor recipe; if #562 is dropped or loses the underline, the spec returns as a new version. |
| OQ-4 | Each ancestor step is `min-h-14` (44.8px) and its anchor is stretched with the placement-list `self-stretch`; claimed only after BC-13 is observed. Every row of the trail is at least 44.8px tall. |
| OQ-5 | Invalid entries are omitted with a development warning, nobody is promoted to current, and empty data renders nothing. |
| OQ-6 | Built as written (Link `quiet` ancestors, plain `text-fg-default` current page, faint chevrons); VIS-01 and VIS-02 are captured under separate authorization and visual conformity is Not evaluated until the owner adopts them. |
| OQ-7 | Long labels wrap; v0.1 has no truncation or collapse. |

The spec proposes no new naming convention and no exception, so this answer approves none: it reuses the approved `accessible-name`, `collection-items` and `navigation-intent` conventions.

The finalized spec differs from the approved draft only by these resolutions and the status wording they affect: the status, approval, current-situation and identity metadata above the hash anchor; three phrases that named OQ-4 as pending (the §5 target-size bullet, the §6 spacing bullet and BC-13, which was conditional on OQ-4 and now states the resolved rule); the heading, introduction and resolution column of the decisions table; two closure checklist items; and the next step. No API, anatomy, appearance or other acceptance promise changed.

## Scope

This approves the spec gate (cataloging → spec → plan → code, S6 of `odd/tasks/round-5-consumer-requests.md`) for exactly the bytes identified above, including the OQ-1 to OQ-7 resolutions they contain. Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval, which per OQ-3 cannot be granted before Link `quiet` (#562) is implemented. Nothing here authorizes code, tests, token or dependency changes, registry writes, catalog or artifact regeneration, captures, a release or GitHub actions. It does not approve visual conformity: captures VIS-01 and VIS-02 stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated). Convention approval stays separate: reusing an approved entry adds a usage later and approves nothing globally. The cataloging approval (`odd/tasks/round-5-consumer-requests.md` L3) stays unchanged.
