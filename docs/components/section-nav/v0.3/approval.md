# SectionNav v0.3 — spec approval record

- **Approved artifact:** `docs/components/section-nav/v0.3/spec.md`
- **SHA256:** `83f23fa23ef46a407cac5b96490fc9de030f1d7f872eafd94e738013f5c9052f` — the spec's own hash definition: UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading line (anchored at line start; the inline mention in the header metadata does not count) through EOF, including the final newline; the metadata above that heading is excluded.
- **Snapshot commit:** the approval was given on the draft committed as `7ed25eb` (branch `integration/round-5`), whose payload SHA256 is `c317943f9eaaedaa68ffa461eca96f5ab748e1155b776c8d2c2f209a8bfbf5b2` (its prefix `c317943f` is the one logged in `odd/tasks/round-5-consumer-requests.md` L4). The finalized bytes identified by the SHA256 above, with the recommended answers folded in, are not committed yet; the parent commits them. No issue snapshot is published and no GitHub action was taken.
- **Date:** 2026-11-26
- **Owner approval (verbatim):** "Aprobar todas (Recomendado)" — given on the committed draft, with the recommended answer to each of its open questions (OQ-1 to OQ-4), as recorded in `odd/tasks/round-5-consumer-requests.md` L5. This draft proposes no new naming convention, so none is approved by it. It is a single answer covering all 11 Round 5 specs; this record covers SectionNav v0.3 only.

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | The zero-padded number stays in each index link's accessible name and is not `aria-hidden`: the name is the number, one space and the host label (`02 Beta`). |
| OQ-2 | The pill recipe applies to every index row on both surfaces: brand-raised numbers and uppercase display labels, one recipe per part, and no number colour that depends on `aria-current`. Strict Pulso list parity is not taken. |
| OQ-3 | `text-meta` for the number and the label. If VIS-01 to VIS-03 look too small, the owner chooses between another existing step and a new token; none is proposed now. |
| OQ-4 | This amendment is left as it is; the pre-existing disclosure Label in Name gap is tracked as a separate follow-up. This record does not create that follow-up. |

The finalized spec differs from the approved draft only by these resolutions and the status wording they affect: the status, approval, situation, snapshot-identity and hash-definition metadata above the hash anchor (the hash definition gains only the line-start anchoring clarification and the digest-is-not-approval sentence); the "resolved" wording of the OQ-1 decision and the OQ-4 note (block 5), the OQ-2 note (block 1) and the Tokens / Material status words (block 6); the heading, introduction and resolution column of the decisions table; the closure checklist and the next step. No promise, API, anatomy, appearance or acceptance criterion changed.

## Scope

This approves the spec gate (T5, S3 of `odd/tasks/round-5-consumer-requests.md`) for exactly the bytes identified above, including the OQ-1 to OQ-4 resolutions they contain. Any later change to the spec needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval (S6), and nothing here authorizes code, tests, token or dependency changes, registry writes, catalog or artifact regeneration, captures, a release or GitHub actions. It does not approve visual conformity: captures VIS-01 to VIS-03 stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated), and no expected design is adopted for v0.3. It is not a registry convention approval: the spec proposes no new or changed own prop and no new naming convention, and the existing conventions and accessible-name exceptions it cites keep their own approvals. The cataloging approval (`odd/tasks/round-5-consumer-requests.md` L3) and the historical v0.1 and v0.2 approvals stay unchanged and separate.

## Amendment 1 — F1: the contrast wording of block 5 and PAR-07 (2026-11-26)

The amended payload hash below is the current one. The SHA256 at the top of this record stays as the hash the original approval bound.

- **Date:** 2026-11-26
- **Reason (finding F1):** while drafting the implementation plan ([implementation-plan.md](implementation-plan.md) §1 G2 and §13 D1) the contrast figures of the approved spec were checked against the tokens. Block 5 and PAR-07 took `fg-brand-raised` as `#FF6680` (5.51:1 on the solid `surface-2`, 4.82:1 on `surface-3`), the values of `docs/MATERIAL.md:34` and `docs/DECISIONES.md:84`. `packages/tokens/src/theme.css:111` resolves the token to the neon `--color-primitive-red-neon` (`#FF0036`) since commit `90a7387` ("make brand text neon across components and Storybook", the owner's "Todo neón" decision of 2026-11-01), and the token's own comment says small text does not meet WCAG AA except on the canvas. Recomputed from the hex values with the WCAG formula, `#FF0036` is 3.92:1 on the solid `surface-2` (`#232428`) and 3.42:1 on `surface-3` (`#2D2E33`), and 4.30:1 on `surface-1` and 4.61:1 on `surface-0`; composited over a pure white backdrop the translucent overlay is about `#46474A`, giving 2.35:1. So PAR-07's "number contrast is at least 4.5:1 on the solid fallback" could not be met by the approved recipe `text-fg-brand-raised` for an 11.2px number that is part of the link's accessible name, and block 5's figures belonged to the old value.
- **Change:** the two passages named by the owner's answer, and nothing else in the payload. Block 5, "Announcements / other conditions": the contrast sentences now name the neon `#FF0036`, give about 3.92:1 and 3.42:1, state that this is below the 4.5:1 WCAG AA asks of small text and shared with every brand link, say that the number is supporting text and not colour-only information, restate the white-backdrop figure as about 2.35:1 and note that the accent API can re-point the token. PAR-07: the promise and its planned method.
  - Before (PAR-07): "number contrast is at least 4.5:1 on the solid fallback", with the documented 5.51:1 on `surface-2` and 4.82:1 on `surface-3`.
  - After (PAR-07): the number is supporting text, not colour-only information; its contrast is the one `fg-brand-raised` has, about 3.92:1 on the solid `surface-2` fallback and 3.42:1 on `surface-3`, below 4.5:1 for small text, so there is no 4.5:1 promise; the method compares the resolved colours with the documented figures.
  - Header metadata above the hash anchor records the amendment (status, approval and recovery, `approvalReference` and the `contentSHA256` identity field). Every recipe (`text-fg-brand-raised` included), prop, anatomy part, the OQ-1 accessible-name decision, block 6 and the other acceptance criteria are unchanged.
- **Owner approval (verbatim):** "Mantener el token y ajustar PAR-07 (Recomendado)" — the answer to finding F1 (`odd/tasks/round-5-consumer-requests.md` L6): keep `fg-brand-raised`, which is the neon `#FF0036`, and amend PAR-07 with a new approval of that wording. The owner accepts the small-text shortfall explicitly, and no new token is proposed or approved by it.
- **SHA256 of the spec payload** (same hash definition as above):
  - Old: `83f23fa23ef46a407cac5b96490fc9de030f1d7f872eafd94e738013f5c9052f`
  - New: `362df467cb74e034735bbd559b93e67208e67dce5485436a5d7778fe753e15bb`
- **Plan:** [implementation-plan.md](implementation-plan.md) pins the spec hash in its header. It now pins the new hash, and this answer is recorded there as the plan's renewed approval against the amended spec. The plan's payload is unchanged, so its own `contentSHA256` `91ee758ede17b0a56237a75462a1aa6fded677bd3bac8bd156fec30801f5a6e2` is unchanged; its §1 G2, §4 and §13 D1 describe the choice that this answer resolves as option (a), so no 4.5:1 assertion and no `storybook-css.test.ts` guard are written.
- **Scope:** this approves exactly the two reworded passages and the metadata that records them. The recipe `text-fg-brand-raised` stays as approved, so OQ-1 to OQ-4 and every other promise are unchanged. Real-page contrast, how screen readers speak the number and visual conformity stay Not evaluated; `visualHashes` stay Pending. The amended bytes are not committed yet; the parent commits them. No GitHub action was taken and the #301 snapshot stays Pending.
