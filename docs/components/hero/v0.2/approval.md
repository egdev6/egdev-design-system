# Hero, Closing, ChapterBreak and LabStage v0.2 — spec approval record

- **Approved artifacts:** `docs/components/hero/v0.2/spec.md`, the shared scene `titleVariant` contract, and the three amendment notes that link to it: `docs/components/closing/v0.2/amendment.md`, `docs/components/chapter-break/v0.2/amendment.md` and `docs/components/lab-stage/v0.2/amendment.md`.
- **SHA256:** each document's own hash definition: UTF-8 LF bytes from the exact whole heading line `## 1. Purpose and scope`, anchored at line start (the inline mention in the header metadata does not count), through EOF, including the final newline; the metadata above that heading is excluded. Reproduce each with `awk '/^## 1\. Purpose and scope$/{f=1} f' <path> | sha256sum`.

  | Document | Approved SHA256 | Draft SHA256 at `7ed25eb` |
  | --- | --- | --- |
  | `docs/components/hero/v0.2/spec.md` (shared) | `170160c2115a7b7b29b5743a046b7a08187c3f1fc821577e2ae9f192ac0a2474` | `489f499c841f14a2c7ec7c53bb626bd7fd4cddcb91be56119346ef239dc91f90` |
  | `docs/components/closing/v0.2/amendment.md` | `8b1759da4fe3a452ed2763b61421c5a8490d2709bd3da9d99343c9e7808d5006` | `9c2ee56c8241ceabec4ca3bf377b4321857469ad89f14c694aedee1cd5af8fa2` |
  | `docs/components/chapter-break/v0.2/amendment.md` | `11e0e896a2a0ed51afc9aee015584e140f48701adbe4e01b6ad68262d3c3e40f` | `f6ef7c25610e3f4e9000230f0e75da17155eb66398be52853d6f682645cbf656` |
  | `docs/components/lab-stage/v0.2/amendment.md` | `3647d4d7976a9cec2417b00bc886fef9539a024db36e2177debdf26efc616848` | `1fcdc73741f6d08a20bdad29030781d9528c41236437af5bb53c80f15b61712b` |

- **Snapshot commit:** the approval was given on the drafts committed as `7ed25eb` (branch `integration/round-5`); the shared spec's draft digest prefix `489f499c` is the one recorded in `odd/tasks/round-5-consumer-requests.md` L4, and the three note digests above were reproduced from that commit. The finalized bytes identified by the SHA256 values above, with the recommended answers and the measurement record folded in, are not committed yet; the parent commits them. No issue snapshot is published and no GitHub action was taken: #318, #319, #324 and #325 stay the scenes' canonical component issues, and request #560 originates this amendment but is not a component issue.
- **Date:** 2026-11-27
- **Owner approval (verbatim):**
  - "Aprobar todas (Recomendado)" — the owner's answer to the spec-approval question, recorded in `odd/tasks/round-5-consumer-requests.md` L5 as approving all 11 Round 5 specs with each draft's recommended answers to its open questions (OQ-1 to OQ-5 for this spec), including the new naming conventions each proposes.
  - "A: titleVariant y la web acorta el texto (Recomendado)" — the owner's answer on the browser measurement outcome, recorded in L6: `titleVariant` ships as specified and the website shortens its copy at the wider viewports.

  The repository does not record the text of either question, so the SHA256 values above bind the bytes derived from the committed drafts plus those answers and the recorded measurement, not digests the owner quoted.

## Resolved decisions

The owner took the recommended answer of every open question in the draft. The spec keeps the question table as the record (section "Resolved decisions"):

| ID | Resolution |
| --- | --- |
| OQ-1 | The browser measurement was authorized first (owner answer "Sí, medir primero (Recomendado)", L5) and ran before any code. The report carried no captures, so VIS-01 to VIS-05 stay Pending and any capture needs its own authorization. |
| OQ-2 | `titleVariant` ships as specified and the website shortens its copy at the wider viewports (L6). No wider copy track, no further union value and no scene title token. |
| OQ-3 | The accent stops glowing at `show` on every scene; Heading is unchanged and the JSDoc and the `ShowTitle` stories document it. |
| OQ-4 | The new convention `heading-title-variant` / `titleVariant` is approved with the meaning, use and avoid texts of spec block 3, no alias and no exception. The registry entry is created by the implementation plan, and its approval stays separate in form: a scoped receipt must bind the exact content and `conventionHash` before the entry is marked approved. |
| OQ-5 | The parent asks the website (consumer issue #45) for the real titles, accents and target viewports of Hero, ChapterBreak and LabStage. It does not block this approval; TV-10 stays Pending until they arrive. |

## Measurement record (TV-09)

Recorded as reported in L6, not independently reproduced here. On Closing's 515.55px copy column with the `show` recipe: 1280px fits (464px of the column, 51.55px to spare), 1440px breaks (6.5px short), 1920px breaks (70px short), and `show` fits up to about 1,420px of viewport. This is not a pass of TV-09's criterion at 1440px and 1920px: the owner resolved that by the decision above, not by the measurement. The harness conditions (browser and version, font-load confirmation, the title and accent split), the `hero`/1440px reproduction of the reported break (TV-09 (a)) and the 1536px point were not part of the report and stay Pending, as do the figures for the other three scenes (TV-10). The spec's arithmetic cross-check and its projections to the other tracks are labelled as arithmetic, not measurements.

## Differences from the approved drafts

The finalized spec differs from the committed draft only by: the status, approval, current-situation, owner-authority, identity and hash-definition metadata above the hash anchor; the block 1 heading and wording that treated the measurement as pending, plus the new "Measured outcome (TV-09)" subsection; one added sentence in block 3 that refreshes the registry lookup to the 191 entries at HEAD `041cfbb` (the six entries added since do not match, and `section-register` now also lists Footer), the heading of the new-convention paragraph and one added "Resolved (OQ-4)" sentence; one added sentence in the block 4 limits and one reworded sentence in the block 6 token line (OQ-2 resolved without a token); the block 7 introduction, the status wording of TV-07 (the registry entry is `proposed`, or `approved` only through a scoped receipt) and the observed-evidence cells of TV-07 and TV-09; the heading, introduction and resolution column of the decisions table; the closure checklist; and the next step. No API, anatomy, appearance or other acceptance promise changed.

Each amendment note differs from its draft only by its status, shared-contract pin, approval and identity metadata, one hash-reproduction sentence and the measurement wording: Closing's purpose sentence, its fit row (now "Fit, measured") and its acceptance mapping; ChapterBreak's and LabStage's fit rows, which now carry the projection for a word as wide as the reported one instead of the pre-measurement estimate.

## Scope

This approves the spec gate (T5, S3 of `odd/tasks/round-5-consumer-requests.md`; the gate sequence is S6) for exactly the bytes identified above, including the OQ-1 to OQ-5 resolutions they contain. Any later change to the spec or to a note needs a new approval.

It does **not** authorize implementation: the implementation plan ([implementation-plan.md](implementation-plan.md), Proposed) needs its own, separate approval (S6), and nothing here authorizes code, tests, token or dependency changes, registry writes or receipts, catalog or artifact regeneration, captures, a release or GitHub actions. It does not approve visual conformity: captures VIS-01 to VIS-05 stay pending under `docs/design/README.md` (`visualHashes` Pending, visual conformity Not evaluated). It is not a registry convention receipt: the `heading-title-variant` entry stays `proposed` with `approval: null` until a receipt binds its exact content at implementation, and refreshing the source revisions of the scenes' existing usages of the approved `heading-title`, `heading-level`, `heading-eyebrow`, `trailing-text-accent`, `section-lede`, `scene-media` and `scene-social` entries approves nothing globally. It does not settle the fit of Hero, ChapterBreak or LabStage (TV-10). The cataloging approval (`odd/tasks/round-5-consumer-requests.md` L3) and the historical v0.1 approvals stay unchanged.
