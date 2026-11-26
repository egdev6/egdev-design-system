# Closing v0.2 — scene `titleVariant` amendment

- **Version / status:** 0.2 — **Proposed** amendment note. Not approved and not implementation-ready; it authorizes no code, token, dependency, registry or GitHub change.
- **Shared contract (normative):** [Scene `titleVariant`, shared spec](../../hero/v0.2/spec.md), `contentSHA256: 489f499c841f14a2c7ec7c53bb626bd7fd4cddcb91be56119346ef239dc91f90`. This note carries only what is specific to Closing; where the two differ, the shared spec governs. It amends [Closing v0.1](../v0.1/spec.md), approved on [#319](https://github.com/egdev6/egdev-design-system/issues/319), whose OQ-5 (`../v0.1/spec.md:107`) left title sizing to a separate review. Nothing in v0.1 is edited.
- **Approval / recovery:** Pending for this snapshot. Cataloging only: the owner's answer on 2026-11-26, verbatim "Aprobar todas (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L3), whose approved shape is "#560: `titleVariant` on the four scenes, measured first". Spec location: this file, an uncommitted working-tree file.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: 9c2ee56c8241ceabec4ca3bf377b4321857469ad89f14c694aedee1cd5af8fa2`; `visualHashes: Pending` (the shared spec's VIS-01 to VIS-05 cover Closing; no capture exists); `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/319` (from `docs/CATALOGO.md`, not re-read on GitHub); `latestPublishedComment: Pending`.
- **Hash definition:** as in the shared spec: SHA-256 of the UTF-8 payload from the exact line `## 1. Purpose and scope` through EOF, with LF endings and the final newline, anchored at line start; the metadata above is excluded.

## 1. Purpose and scope

Closing gains the optional `titleVariant?: 'hero' | 'show'` (default `'hero'`) defined in block 3 of the shared spec, and passes it to its Heading as `variant`. Closing is the component of the reported case in #560: in its roughly 516px copy column, "¿CONSTRUIMOS ALGO?" breaks mid-word at the `hero` size. Nothing else about Closing changes: props, the required CTA `children`, decorative `media`, markers, grid, spacing, lede, host register and the 860px boundary stay as approved in v0.1. **Token proposal: none.**

## 2. Closing delta

| Item | Closing, verified in the working tree |
| --- | --- |
| Call site | `Closing.tsx:14`: `<Heading id level variant='hero' accent>`, with Heading's defaults `tone` `canvas` and `accentBreak` `true`. The accent glows today and would not at `show` (shared OQ-3). |
| Files that change later | `types.ts` (prop and JSDoc, no CVA axis), `useClosing.ts` (destructure before `...native`, normalise, return), `Closing.tsx` (`variant={scene.titleVariant}`), `Closing.test.tsx`, `Closing.stories.tsx`. `index.ts` is unchanged; no stylesheet. |
| Copy track | 515.56px with media at 1,024px and up: `(960 − 32) × 1.25 ÷ 2.25` (`types.ts:53,57`); the v0.1 browser check measured 515.55px at 1280px. One 960px column without media, and one column at 860px and below. |
| Fit estimate | `show` fits the reported word at 1280px, unlikely at 1440px, no at about 1,475px and wider. The browser measurement is Pending (shared TV-09). |
| Registry usage | `ClosingProps` in `packages/ui/src/organisms/closing/types.ts`; the reviewed hash is in block 3 of the shared spec and must be renewed after the edit. |
| Tests to keep green | `Closing.test.tsx` CL-04/05/07 (`:168`, `:330`) and the docgen case `packages/ui/src/lib/storybook-docgen.test.ts:604-628`. |
| Story | A `ShowTitle` story on the `DecorativeMedia` args with English copy; the consumer's Spanish string is evidence for the measurement only. |

## 3. Acceptance mapping

TV-01 to TV-08 of the shared spec apply to Closing unchanged, with `Closing.test.tsx` as the test home; its existing `CL-` cases stay as they are. TV-09 is Closing's own fit gate and runs on Closing's story with media. TV-10 covers the other three scenes, not Closing. Every observed result is Pending.
