# Notice v0.2 — icon first-line alignment amendment

- **Status:** Implemented in this worktree (branch `fix/222-notice-collapsible`); owner confirmation of the visual result is pending. Static recipe change only; no runtime/browser verdict is claimed (Storybook was not running).
- **Owner quote (issue #222 / S7, review 2026-11-01):** "Alinear iconos"
- **Canonical base:** [frozen v0.1 implementation](../v0.1/implementation.md) (effective A1 amendment, 2026-10-29). No v0.1 promise is rewritten; this delta only changes the leading-icon vertical alignment rule below.

## Root cause

The shared root recipe centered flex children against the whole notice block (`items-center` in `noticeAppearanceVariants`, `packages/ui/src/molecules/notice/types.ts`). When the detail text wraps, the leading status icon (and the trailing actions) centered on the block's vertical middle instead of the first text line.

## Changed promise

The leading status icon aligns with the **first line of text**: the root uses `items-start` and `noticeIconVariants` adds a per-size top offset that centers the icon square on the first line box, resolved from `@egdev/tokens` variables only:

- md: `mt-[calc((var(--text-body-default--line-height)*var(--text-body-default)-var(--icon-size))/2)]`
- sm: `mt-[calc((var(--text-label-default--line-height)*var(--text-label-default)-var(--space-4))/2)]`

The offset is identical across all five tones (tones color the icon, not its geometry). Trailing actions stay start-aligned with the first line: their system Button/Link controls are taller than the line box, so centering them on it would overflow the notice padding.

## Unchanged

No public API, prop, tone/size semantics, role/announcement behavior, Surface inheritance (A1), token value, dependency, file surface or stylesheet change. `className` merge rules and the six-file module boundary are untouched. No new tokens were introduced; the offsets reference existing `--text-body-default`, `--text-label-default`, `--icon-size` and `--space-4` variables.

## Test evidence (Vitest, jsdom recipe assertions; no browser claims)

- RED: 3 focused tests failed before the change (missing `items-start`/offset classes on Notice md/sm; missing `data-[state=open]:rounded-b-none` on Collapsible).
- GREEN: `packages/ui/src/molecules/notice`, `packages/ui/src/molecules/collapsible`, `packages/ui/src/lib` — 27 files, 483 tests passed, including every pre-existing recipe/geometry assertion (compact preset, tone icons, actions slot).
