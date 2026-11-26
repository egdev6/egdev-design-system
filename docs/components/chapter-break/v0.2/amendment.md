# ChapterBreak v0.2 — scene `titleVariant` amendment

- **Version / status:** 0.2 — **Proposed** amendment note. Not approved and not implementation-ready; it authorizes no code, token, dependency, registry or GitHub change.
- **Shared contract (normative):** [Scene `titleVariant`, shared spec](../../hero/v0.2/spec.md), `contentSHA256: 489f499c841f14a2c7ec7c53bb626bd7fd4cddcb91be56119346ef239dc91f90`. This note carries only what is specific to ChapterBreak; where the two differ, the shared spec governs. It amends [ChapterBreak v0.1](../v0.1/spec.md), approved on [#324](https://github.com/egdev6/egdev-design-system/issues/324), whose OQ-3 and OQ-4 (`../v0.1/spec.md:97-98`) left title sizing and glow to a separate review. Nothing in v0.1 is edited.
- **Approval / recovery:** Pending for this snapshot. Cataloging only: the owner's answer on 2026-11-26, verbatim "Aprobar todas (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L3), whose approved shape is "#560: `titleVariant` on the four scenes, measured first". Spec location: this file, an uncommitted working-tree file.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: f6ef7c25610e3f4e9000230f0e75da17155eb66398be52853d6f682645cbf656`; `visualHashes: Pending` (no capture exists; the shared spec's VIS IDs do not include a ChapterBreak scene); `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/324` (from `docs/CATALOGO.md`, not re-read on GitHub); `latestPublishedComment: Pending`.
- **Hash definition:** as in the shared spec: SHA-256 of the UTF-8 payload from the exact line `## 1. Purpose and scope` through EOF, with LF endings and the final newline, anchored at line start; the metadata above is excluded.

## 1. Purpose and scope

ChapterBreak gains the optional `titleVariant?: 'hero' | 'show'` (default `'hero'`) defined in block 3 of the shared spec, and passes it to its Heading as `variant`. This is the separate title-sizing review that v0.1 deferred: the default stays `hero`, so the v0.1 plan's acceptance of the hero scale and glow (gate 2 of `../v0.1/implementation-plan.md`) is untouched, and `show` is opt-in. Nothing else changes: props, decorative `media`, markers, grid, spacing, lede, host register and the 860px boundary stay as approved. The consumer has not reported a ChapterBreak title, so its fit is unmeasured. **Token proposal: none.**

## 2. ChapterBreak delta

| Item | ChapterBreak, verified in the working tree |
| --- | --- |
| Call site | `ChapterBreak.tsx:14-23`: `<Heading id level variant='hero' tone='canvas' accent accentBreak={true}>`, with `tone` and `accentBreak` explicit. The accent glows today and would not at `show` (shared OQ-3). |
| Files that change later | `types.ts` (prop and JSDoc, no CVA axis), `useChapterBreak.ts` (add `titleVariant` to the destructure that already removes `children`, `ref` and `asChild`, before `...native`; normalise and return it), `ChapterBreak.tsx` (`variant={scene.titleVariant}`), `ChapterBreak.test.tsx`, `ChapterBreak.stories.tsx`. `index.ts` is unchanged; no stylesheet. |
| Copy track | 515.56px with media at 1,024px and up: `(960 − 32) × 1.25 ÷ 2.25` (`types.ts:39,42`), the same as Closing. One 960px column without media, and one column at 860px and below. |
| Fit estimate | None for ChapterBreak's own copy: #560 reports only Closing. The shared estimate for a word as wide as the reported one (about 5.3–6.0em) applies to this 515.56px track; measure the real title under shared TV-10, after the strings arrive (shared OQ-5). |
| Registry usage | `ChapterBreakProps` in `packages/ui/src/organisms/chapter-break/types.ts`; the reviewed hash is in block 3 of the shared spec and must be renewed after the edit. |
| Tests to keep green | `ChapterBreak.test.tsx` CB-04/05/07 (`:137`) and the docgen case `packages/ui/src/lib/storybook-docgen.test.ts:576-602`. |
| Story | A `ShowTitle` story on the `DecorativeMedia` args with English copy. |

## 3. Acceptance mapping

TV-01 to TV-08 of the shared spec apply to ChapterBreak unchanged, with `ChapterBreak.test.tsx` as the test home; its existing `CB-` cases stay as they are. TV-10 is ChapterBreak's fit record, blocked on the consumer's real title. TV-09 is Closing's gate and does not apply here. Every observed result is Pending.
