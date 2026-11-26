# Prose v0.1 — spec approval record

- **Approved artifact:** `docs/components/prose/v0.1/spec.md`
- **SHA256:** `bd1ec5015090608aed7cc0c39fd71ba960f210ec397ad25d08327c916e63abd2` — the spec's own hash definition: UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading line (matched as a whole line, anchored at line start; the same heading text also appears inline in the metadata) through EOF, including the final newline; the metadata above that heading is excluded (`awk '/^## 1\. Purpose and scope$/{f=1} f' spec.md | sha256sum`).
- **Snapshot commit:** the approval was given on the draft committed as `8f50f0b` (branch `integration/round-5`, "docs(components): propose the round 5 reading-piece specs"), whose payload SHA256 is `6976e8d471012920668cdd611ce86329f8b056d383fc62abfa8eba19118e2ed3` (prefix `6976e8d4`, recorded in `odd/tasks/round-5-consumer-requests.md` L4). The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published: #569 is the consumer request, not a component issue, and the canonical component issue stays Pending.
- **Date:** 2026-11-26
- **Owner approval (verbatim):** "Aprobar todas (Recomendado)" — given on the committed draft, with each draft's recommended answer to its open questions (OQ-1 to OQ-8 here), including the new naming conventions it proposes, as recorded in `odd/tasks/round-5-consumer-requests.md` L5: "All 11 specs are approved with each draft's recommended answers to its open questions, including the new naming conventions it proposes." The repository does not record the text of that question, so the SHA256 above binds the bytes derived from the committed draft plus those answers, not a digest the owner quoted. This spec proposes no new naming convention and no exception, so that part of the answer approves none.
- **Token confirmation (verbatim, a separate gate under S6):** "Sí, 65ch (Recomendado)" — the owner's answer in the same L5 entry, confirming `--container-prose: 65ch` for `packages/tokens/src/theme.css`. It is recorded here because OQ-1 is the token question; it is not part of the spec digest's approval act and edits nothing by itself.

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | Yes: `--container-prose: 65ch` is added to `packages/tokens/src/theme.css` beside `--container-quote-pull`, named `--container-prose` (utility `max-w-prose`), so no case can diverge. The separate token confirmation above meets S6; the release effect is a `@egdev/tokens` bump with coupled versions (S2). |
| OQ-2 | `size` is `'sm'` or `'md'`, default `md`: `md` is `text-body-large` and `sm` is `text-body-default`; only the root body step changes. |
| OQ-3 | The Prose-specific Material recipes are approved as written in block 6: (a) the `pre` well, (b) the `surface-2` table header band with hairline row rules, (c) the 2px start filet on `blockquote`, (d) the hairline `hr`. |
| OQ-4 | Inline code is `font-mono text-code` in the brand colour by tone (`tone` stays), judged in VIS-01, with `text-body-default` mono as the fallback if it reads too small; no token is needed. |
| OQ-5 | Body colour is inherited from the host; headings stay `text-fg-default`, quote and code text `text-fg-secondary`, captions `text-fg-muted`. |
| OQ-6 | `h2` to `h4` only; `h1`, `h5` and `h6` render with browser or Preflight defaults; `h4` is a 16px bold sans. The converter caps or remaps heading levels (a consumer responsibility). |
| OQ-7 | The converter wraps wide tables in its own scroll region, or uses `Table` for data; Prose keeps `table` a real table and sets no `display: block`. |
| OQ-8 | The echoed recipes are accepted and nesting `PullQuote`, `Table`, `PhotoFrame` or another recipe-owning component inside Prose is forbidden, documented in the JSDoc and the stories; no opt-out. |

The finalized spec differs from the approved draft only by these resolutions and the status wording they affect:

- the status, approval, current-situation and snapshot-identity metadata above the hash anchor, plus one added sentence in the hash definition;
- in the payload: the refinements line of block 1 ("proposes" became "sets", with the OQ-2 and OQ-3 resolutions marked); the OQ-4 clause of the contrast bullet in block 5; "proposed" became "approved" in the Tokens / Material lead and the recipe table header; the root recipe row and the files bullet that called the token pending; the token section of block 6 (heading, decision bullet with the owner's confirmation, one sentence on the confirmed `65ch` in the name-collision bullet); the block 7 introduction line and the PRS-03 row that named OQ-1 as blocking; the heading, introduction and resolution column of the decisions table (formerly "Owner decisions pending"); five ticked items of the closure checklist and the next step.

No API, anatomy, appearance, token value or acceptance promise changed.

## Scope

This approves the spec gate (T5, S4 of `odd/tasks/round-5-consumer-requests.md`) for exactly the bytes identified above, including the OQ-1 to OQ-8 resolutions they contain and the Prose-specific Material recipes of block 6 (OQ-3). Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval (S6), and nothing here authorizes code, tests, stories, dependency changes, registry writes, catalog or artifact regeneration, captures, a release or GitHub actions. The confirmed token is likewise added, with its `@egdev/tokens` release effect (S2), only under that approved plan; this record edits nothing in `packages/tokens`. It does not approve visual conformity: captures VIS-01 to VIS-03 stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated), and no capture exists. Convention approval stays separate: the spec proposes no new convention and no exception and reuses the approved `preset-dimensions` (`size`) and `surface-material-tone` (`tone`) entries; adding the Prose usages at implementation approves nothing globally. The cataloging approval (`odd/tasks/round-5-consumer-requests.md` L3) is unchanged and separate.
