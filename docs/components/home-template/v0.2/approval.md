# HomeTemplate v0.2 — spec approval record

- **Approved artifact:** `docs/components/home-template/v0.2/spec.md`
- **SHA256:** `566afd9457da77bc0662201c06b9a4f5dba86d1ae016f7dc1697ef6c24e8d946` — the spec's own hash definition: UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading line (anchored at line start; the inline mention in the header metadata does not count) through EOF, including the final newline; the metadata above that heading is excluded.
- **Snapshot commit:** the approval was given on the draft committed as `7ed25eb` (branch `integration/round-5`), whose payload SHA256 is `ebff110451fdc76bac14ed07f52ebe55f42d5a6c3bc7a66d2db5539467be25c8` (its prefix `ebff1104` is the one logged in `odd/tasks/round-5-consumer-requests.md` L4). The finalized bytes identified by the SHA256 above, with the resolutions folded in, are not committed yet; the parent commits them. No issue snapshot is published and no GitHub action was taken.
- **Date:** 2026-11-26
- **Owner approval (verbatim):**
  1. "Aprobar todas (Recomendado)" — given on the committed draft, with the recommended answer to each of its open questions (OQ-1 to OQ-3), including the new naming conventions a draft proposes (this spec proposes none), as recorded in `odd/tasks/round-5-consumer-requests.md` L5. It is a single answer covering all 11 Round 5 specs; this record covers HomeTemplate v0.2 only.
  2. "Incluir el CLI: cli 0.4.1 (Recomendado)" — the owner's separate answer for #566 (L5). It resolves OQ-1 as option (b) instead of the draft's recommended (a): the egdev-ds DS046 guard also reads `classNameAllows` from `@egdev/effects`, and `@egdev/cli` moves to 0.4.1.

The owner's answers quoted no digest. The detailed CLI contract in spec §3 elaborates the second answer from its summary in L5; it is not text the owner quoted.

## Resolved decisions

The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | **(b), include the CLI change in this round**, by the second answer above, which supersedes the draft's recommendation (a). DS046 collects `className` classes on `@egdev/effects` imports as well as `@egdev/ui` imports and reads `classNameAllows` for both packages; an allowance applies only to imports from its own package. DS047, DS048, DS040 and DS041 keep their `@egdev/ui` scope. `@egdev/cli` moves 0.4.0 → 0.4.1 with a `## 0.4.1` changelog section; no other package version moves (S2). |
| OQ-2 | The thirteen properties: `width`, `min-width`, `max-width`, `inline-size`, `min-inline-size`, `max-inline-size`, `height`, `min-height`, `max-height`, `block-size`, `min-block-size`, `max-block-size` and `aspect-ratio`, as one `@classNameAllows` tag on `HomeTemplateAnchorProps`. |
| OQ-3 | No default and no fallback fill: tag only. The anchor stays a content-sized block and the consumer sizes its own fallback element. |

The finalized spec differs from the approved draft only by these resolutions and the wording they affect: the status, approval and identity metadata above the hash anchor; the CLI extension of OQ-1 (the need and non-goal sentences, delta items 3 and 4, the cataloging sentence, the guard-scope note, the new "CLI contract" block in §3, the compatibility bullet, five behavior rows in §4, the files list in §6, criteria HT2-08 to HT2-11, the closure checklist and the next step); the status words of the source contract and the axis table (§3); and the heading, introduction and resolution column of the decisions table. No promise about the component's API, anatomy, appearance or published property list changed.

## Scope

This approves the spec gate (T5, S3 of `odd/tasks/round-5-consumer-requests.md`) for exactly the bytes identified above, including the OQ-1 to OQ-3 resolutions they contain. Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval (S6). Nothing here authorizes code, tests, edits under `packages/effects/**` or `packages/cli/**`, token or dependency changes, registry writes, catalog or artifact regeneration, a version bump, a release or GitHub actions. It does not approve visual conformity: captures stay pending under `docs/design/README.md` (VIS-01 is Pending, `visualHashes` is Pending and visual conformity is Not evaluated), and a capture needs its own authorization. The cataloging approval (`odd/tasks/round-5-consumer-requests.md` L3) is unchanged and separate.
