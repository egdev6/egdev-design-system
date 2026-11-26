# LabStage v0.2 — scene `titleVariant` amendment

- **Version / status:** 0.2 — **Proposed** amendment note. Not approved and not implementation-ready; it authorizes no code, token, dependency, registry or GitHub change.
- **Shared contract (normative):** [Scene `titleVariant`, shared spec](../../hero/v0.2/spec.md), `contentSHA256: 489f499c841f14a2c7ec7c53bb626bd7fd4cddcb91be56119346ef239dc91f90`. This note carries only what is specific to LabStage; where the two differ, the shared spec governs. It amends [LabStage v0.1](../v0.1/spec.md), approved on [#325](https://github.com/egdev6/egdev-design-system/issues/325), whose OQ-1 to OQ-7 do not decide a title size. Nothing in v0.1 is edited.
- **Approval / recovery:** Pending for this snapshot. Cataloging only: the owner's answer on 2026-11-26, verbatim "Aprobar todas (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L3), whose approved shape is "#560: `titleVariant` on the four scenes, measured first". Spec location: this file, an uncommitted working-tree file.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: 1fcdc73741f6d08a20bdad29030781d9528c41236437af5bb53c80f15b61712b`; `visualHashes: Pending` (no capture exists; the shared spec's VIS IDs do not include a LabStage scene); `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/325` (from `docs/CATALOGO.md`, not re-read on GitHub); `latestPublishedComment: Pending`.
- **Hash definition:** as in the shared spec: SHA-256 of the UTF-8 payload from the exact line `## 1. Purpose and scope` through EOF, with LF endings and the final newline, anchored at line start; the metadata above is excluded.

## 1. Purpose and scope

LabStage gains the optional `titleVariant?: 'hero' | 'show'` (default `'hero'`) defined in block 3 of the shared spec, and passes it to its Heading as `variant`. Nothing else changes: props, the consumer-owned experiment `children`, decorative `media`, the `eg-lab` marker, grid, spacing, lede, host register and the 860px boundary stay as approved in v0.1. LabStage has the narrowest copy track of the four scenes, and the consumer has not reported a LabStage title, so its fit is unmeasured. **Token proposal: none.**

## 2. LabStage delta

| Item | LabStage, verified in the working tree |
| --- | --- |
| Call site | `LabStage.tsx:14`: `<Heading id level variant='hero' accent>`, with Heading's defaults `tone` `canvas` and `accentBreak` `true`. The accent glows today and would not at `show` (shared OQ-3). |
| Files that change later | `types.ts` (prop and JSDoc, no CVA axis), `useLabStage.ts` (add `titleVariant` to the destructure that already removes `ref` and `asChild`, before `...native`; normalise and return it), `LabStage.tsx` (`variant={scene.titleVariant}`), `LabStage.test.tsx`, `LabStage.stories.tsx`. `index.ts` is unchanged; no stylesheet. |
| Copy track | 486.10px with media at 1,024px and up: `(960 − 32) × 1.1 ÷ 2.1` (`types.ts:44,47`), the narrowest of the four. One 960px column without media, and one column at 860px and below. |
| Em available at `show` | 5.789em at 1280px, 5.146em at 1440px, 4.603em at 1920px (title at its 105.6px cap): the track divided by the title size. A word as wide as the reported one, estimated at 5.3–6.0em in the shared spec, therefore has less room here than in Closing. This is arithmetic only; the browser measurement is Pending (shared TV-10, after the strings arrive under shared OQ-5). |
| Registry usage | `LabStageProps` in `packages/ui/src/organisms/lab-stage/types.ts`; the reviewed hash is in block 3 of the shared spec and must be renewed after the edit. |
| Tests to keep green | `LabStage.test.tsx` LS-06/07 (`:166`) and the docgen case `packages/ui/src/lib/storybook-docgen.test.ts:541-574`. |
| Story | A `ShowTitle` story on the `DecorativeMedia` args with English copy; the experiment content stays as in the existing stories. |

## 3. Acceptance mapping

TV-01 to TV-08 of the shared spec apply to LabStage unchanged, with `LabStage.test.tsx` as the test home; its existing `LS-` cases stay as they are. TV-10 is LabStage's fit record, blocked on the consumer's real title. TV-09 is Closing's gate and does not apply here. Every observed result is Pending.
