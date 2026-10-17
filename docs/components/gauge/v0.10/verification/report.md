# Gauge v0.10 — local transparency verification

Status: **LOCAL TRANSPARENT INTERIOR VERIFIED**. This is a component-contract amendment, not an npm release or publication approval.

## Approved change

The circular wrapper now uses static `bg-transparent`, `bg-none` and `[box-shadow:none]` CVA utilities. The actual host shows through the empty interior. The existing 10% alpha track intentionally blends with that host; no opaque annular backing was added. This is a Gauge-only exception, not a general flat-Material recipe.

The exact [approved plan](../implementation-plan.md), [manual decision record](../approval.json) and [technical amendment](../transparent-interior-amendment.md) retain their recorded hashes. The amendment is a later technical elaboration, not a separately presented byte-for-byte approval.

## Observed checks

| Check | Observed result |
| --- | --- |
| Test-first focused Gauge/CSS checks | Final RED: 3 intended failures and 81 passes before source change; GREEN: 84/84 after the one-line CVA replacement. |
| `pnpm test` | 160/160 tests in seven files passed, including Gauge, CSS compilation and metadata integration. |
| `pnpm test:props` / `pnpm props:check` | 73/73 tests passed; registry valid and generated view fresh. |
| `pnpm build` | Exit 0; real UI JavaScript/declarations and CSS emitted. Effects scripts remain placeholders, not proof of an effects implementation. |
| Isolated emitted-CSS fixture assertions | Only `assertGaugeCSS` was extracted and executed against fresh `packages/ui/dist/styles.css`; passed. The packed-consumer driver/matrix was never executed. |
| `pnpm typecheck` / `pnpm lint` | Exit 0; lint made no fixes. |
| Fixture syntax / `git diff --check` | Exit 0; no React installation or consumer run. |
| Active diagnostics on four changed TypeScript files | Three clean; one Semgrep non-literal-RegExp warning at `storybook-css.test.ts:146`. Its helper/escaping and the first 220 lines are byte-identical to HEAD; no universal security clearance is claimed. |
| Native assessment | Unassessable because intended-untracked files were not declared; RDD off returned writer self-verification, no independent verifier. No native approval. |

Private execution logs preserve the observed RED/GREEN exit codes and the package-build/final-gate outputs. The initial RED assertion was corrected for the installed optimizer's valid `#0000` serialization before the final source-dependent RED was observed.

## Browser and image evidence

Existing Storybook on localhost:6006; Playwright MCP; 1280×900 viewport; DPR 1; dark scheme; reduced motion; fonts loaded. No server restart.

[Computed observations](computed-styles.json) cover eight existing stories on each of two token backgrounds: Default, Sizes, States, ValueLimits, CenterContent, InvalidValue, DecimalValue and ContextualValue. All 40 finite-meter evaluations had transparent backgrounds, no background image/shadow, zero border/padding, a decorative frame and a preserved conic arc/mask. Six unavailable evaluations exposed no ring or meter. Presets remained 40/56/80px, custom 64.5px and invalid-size fallback 56px; endpoint clamping remained 0/100.

The [capture manifest](capture-manifest.json) records six actual PNGs, their hashes/dimensions, original Default styles and decoded pixel checks. Default was captured before and after on both backgrounds; CenterContent was captured after on both. Other cases have computed observations, not screenshot coverage.

| Default host | Interior center before | Interior center after |
| --- | --- | --- |
| Canvas: RGB 20/21/24 | RGB 20/21/24 | RGB 20/21/24 |
| Surface-2: RGB 35/36/40 | RGB 20/21/24 | RGB 35/36/40 |

Five sampled interior points per background match the real host after the change. The top filled-arc sample is unchanged. Default dimensions, border/padding, arc gradient and radial mask compare equal before/after, including the 4px stroke and +0.5px inner-edge smoothing. Center positioning remains governed by unchanged CSS; computed inset is recorded. The [decorative-center capture](after--center-content--surface-2--1280.png) retains visible icon, number and text. No full-image parity or cross-background track-pixel equality is promised.

## Integrity and bounded footprint

The only runtime source delta is the one-line circle-CVA paint replacement. The public declarations/JSDoc, hook, JSX, geometry stylesheet and exports are unchanged. All seven meaningful Gauge files remain. Stories changed only one descriptive JSDoc sentence; executable story bytes, IDs, args and renders are identical.

Of 76 baseline-hashed files, the three expected Gauge source/test/story files changed; all other 73 remain byte-identical, including historical contracts/receipts/captures, the naming-approval receipt, tokens, lockfile and UI manifest. All eight own prop bindings were manually re-reviewed, including conditional branches; only their whole-file source revisions changed to `36bf194b6bdc9da09139704ee50d244cc1b13717150dee60d5473d5e0bb5c05a`. The registry is otherwise structurally identical: eight approved conventions and five deferred proposals, no new approval or API.

Necessary footprint additions were disclosed before editing: `Gauge.stories.tsx` corrects its active opaque-well claim; `docs/catalog.json` is the second mechanical output of the existing catalog generator. No story behavior or catalog classification changed; its 107 rows remain planning concepts, not 107 implementations. Generic Material recipes remain unchanged.

Main/origin-main and feature HEAD remain at `637b422c90ed60e87c34ccd9d1a1c6ac07cda1c0`; the index is empty. The retained proposals worktree and existing Storybook processes were not modified or restarted. Changes remain local and uncommitted.

Review volume: **300 authored changed lines**, including code/tests/current guidance and the new amendment/plan/decision/report; **34 generated-view changed lines** across three files; **1,139 observation/manifest JSON lines** across two files after required Biome formatting, with no data removed; **six PNGs totaling 12,929 bytes**. Total footprint: 33 paths. Generated and binary evidence is disclosed separately, not omitted to fit the approved forecast.

## Tooling incidents and limits

The first optional Python pixel-reader exited 1 because Pillow was absent, before pixel assertions or manifest output. After diagnosis, the existing browser's PNG decoder and OffscreenCanvas verified the saved images without an install or image modification. A separate readback helper exited 1 because it assumed `baseline.hashes`; inspection established the actual `baseline.files` schema, and the complete corrected check passed. Neither failed attempt was counted as a pass. The later final lint exited 1 only for new manifest-array formatting; the existing Biome formatter corrected that artifact alone, with parsed-JSON equality verified and the failed log preserved.

The full Storybook MCP RPC smoke and packed React 18/19 matrix remain blocked and were not retried; no cache probing, dependency download or fallback install occurred. No new screen-reader evaluation, broad browser/viewport matrix, universal contrast/accessibility/security pass or release-readiness claim. No commit, push, PR, remote version comment, issue mutation, merge, release or branch/worktree deletion was performed.
