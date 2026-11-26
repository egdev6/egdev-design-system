# DetailHeader v0.1 — spec approval record

- **Approved artifact:** `docs/components/detail-header/v0.1/spec.md`
- **SHA256:** `df34b603ee5474f6019997d8f367117d2790e212511b538a6c6b289a10988ece` — the spec's own hash definition: UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading line (matched as a whole line, anchored at line start) through EOF, including the final newline; the metadata above that heading is excluded.
- **Snapshot commit:** the approval was given on the draft committed as `8f50f0b` (branch `integration/round-5`, "docs(components): propose the round 5 reading-piece specs"), whose payload SHA256 is `23171da14380006db59e2bc53beaa563455b4d818a48233115827d1dfa75eba5` (prefix `23171da1`, recorded in `odd/tasks/round-5-consumer-requests.md` L4). The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published: #572 is the consumer request, not a component issue, and the canonical component issue stays Pending.
- **Date:** 2026-11-26
- **Owner approval (verbatim):** "Aprobar todas (Recomendado)" — given on the committed draft, with each draft's recommended answer to its open questions (OQ-1 to OQ-7 here), as recorded in `odd/tasks/round-5-consumer-requests.md` L5: "All 11 specs are approved with each draft's recommended answers to its open questions, including the new naming conventions it proposes."

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | A molecule in `@egdev/ui` (`packages/ui/src/molecules/detail-header/`, Storybook title `Molecules/DetailHeader`), although it renders SectionHeader. Not an organism. |
| OQ-2 | The root is a `div` around SectionHeader's `header`; facts, tags and links follow it inside the root. No `header` root, which would nest headers. |
| OQ-3 | Tags are static Chips with plain strings. Linkable tags may come later and additively as `{label, href}` entries with `Chip mode="link"`. |
| OQ-4 | `level` defaults to 1. DetailHeader always passes its resolved level to SectionHeader, so SectionHeader's default of 2 is never used. |
| OQ-5 | `metadata`, `tags` and `links` are approved as new conventions (`content-metadata`, `content-tags`, `external-links`), and the approved `localized-messages` `messages` names the two lists; no exceptions. Convention approval stays separate from this spec (see Scope). |
| OQ-6 | Every link opens in a new tab and must be an absolute `https:` URL without credentials or raw control characters; no per-entry opt-out in v0.1. |
| OQ-7 | A metadata entry is `{label, value}` plus an optional `dateTime` (native `time`), plain strings only. |

The finalized spec differs from the approved draft only by these resolutions and the status wording they affect: the status, approval, current-situation, owner-authority and snapshot-identity metadata above the hash anchor; in the payload, the "New proposals" line of block 3, the "Pending confirmations" sentence of block 6, the heading, introduction and resolution column of the decisions table (each cell begins with the resolution and keeps the original recommendation text), four ticked items of the closure checklist and the next step. No promise, API, anatomy, appearance or acceptance criterion changed.

## Scope

This approves the spec gate (S6 of `odd/tasks/round-5-consumer-requests.md`, task T5) for exactly the bytes identified above, including the OQ-1 to OQ-7 resolutions they contain. Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval, and nothing here authorizes code, tests, stories, token or dependency changes, registry writes, catalog or artifact regeneration, captures, a release or GitHub actions. No token is proposed or approved by this spec. It does not approve visual conformity: captures VIS-01 to VIS-03 stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated), and no capture exists. Convention approval stays separate: OQ-5 approves the three new conventions as a convention decision, but this record is not a registry convention receipt; the entries stay `proposed` with `approval: null` until a receipt binds their exact content at implementation. The cataloging approval (`odd/tasks/round-5-consumer-requests.md` L3) is unchanged and separate.
