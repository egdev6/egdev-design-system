# Tabs — scroll edge-fade amendment

- **Version / status:** v0.4 — **Approved — 2026-11-19** by the owner (conversation reply "si" to the v0.4 draft and its three open decisions, choosing the recommended option A for decision 3). The implementation plan needs separate approval.
- **Amends:** [Tabs v0.1](../v0.1/implementation.md), the [v0.2 layout amendment](../v0.2/full-width-wrap-amendment.md) and the [v0.3 outline amendment](../v0.3/outline-variant-amendment.md). Inspired by Diego Haz's scrollable-tabs post (LinkedIn, November 2026); only the post text was available, its video was not accessed.
- **Approval / recovery:** this file is the recoverable snapshot. The approval covers this spec only; it does not approve the implementation plan, visual references or any change outside the decisions recorded below.
- **Snapshot identity:** `version: v0.4`; `contentSHA256: e8bc19cf5ffea4b4a1392a3bcea10ee91bde7259975d970613fd189a3b6d68c2`; `visualHashes: VIS-01 Pending, VIS-02 Pending, VIS-03 Pending`; `approvalReference: owner conversation 2026-11-19`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/107`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, LF line endings and the final newline. Tracking metadata above that heading is excluded.

## 1. Purpose and scope

- **Need:** signal that more tabs exist beyond the scrollport edges without relying on a visible scrollbar (touch users), and keep the keyboard-focused tab unobscured by that signal.
- **Scope:** `underline`, which always scrolls with a hidden scrollbar (`packages/ui/src/molecules/tabs/types.ts:115`), and `segmented` / `outline` with `fullWidth`, which scroll with a thin token-colored scrollbar (`types.ts:130-133`).
- **Non-goals:** desktop chevron scroll buttons (phase 2, separate spec); overflow of non-`fullWidth` segmented/outline lists, which are `inline-flex` without a scrollport; vertical orientation; any change to selection, keyboard or panels.
- **Cataloging:** behavior refinement of the existing exported molecule (`packages/ui/src/index.ts`, `packages/ui/src/molecules/tabs/index.ts`). No variant, no new component.

## 2. Anatomy and composition

Parts are unchanged: Root (Radix `Tabs.Root`), List (Radix `Tabs.List`), Trigger, count and Panel. The edge fade is a `mask-image` applied to the existing List; no extra DOM nodes, no new public part markers. `eg-tabs`, exports and the root recipe are preserved. `@radix-ui/react-tabs` keeps owning selection, roving focus and ARIA.

## 3. Public API

**No API change.** The fade is intrinsic: it renders only on an edge that has hidden content. No new or changed own props, so the prop-naming registry lookup is Not applicable. Types, exports, refs (none), `className` contract (outer layout only, merged last) and controlled/uncontrolled behavior remain as in v0.3.

## 4. Behavior

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| Tabs fit the list | No visible mask | None |
| Overflow, scrolled to the start | Only the inline-end edge fades | None |
| Overflow, scrolled to the middle | Both edges fade | None |
| Overflow, scrolled to the end | Only the inline-start edge fades | None |
| `dir="rtl"` on an ancestor | Fade edges follow logical inline start/end | None |
| Browser without `animation-timeline` support | No fade; rendering identical to v0.3 (progressive enhancement) | None |
| Keyboard or programmatic focus moves to a partially hidden tab | The tab scrolls fully outside the faded zones | Existing Radix selection request only |

Mechanism: pure CSS. Registered custom properties (`@property`) hold the start and end fade sizes; `@keyframes` driven by `animation-timeline: scroll(self inline)` animate them from the scroll position. No JavaScript, no `ResizeObserver`, no React state.

## 5. Accessibility

- **Focus:** `scroll-padding-inline` on the list is at least the fade width, so Radix roving focus (`preventScroll: false`, `Tabs.test.tsx:323-332`) and the existing full-width `scrollIntoView` (`useTabs.ts:56`) land the focused tab outside the faded zones. The v0.2 focus-ring clearance (`scroll-px-1.5`) is contained within that padding.
- **Semantics:** the mask is decorative; roles, names, tab order and announcements are unchanged.
- **Reduced motion / forced colors:** the fade is scroll-linked, not time-based, and stays active under reduced motion. Forced colors must not lose tab boundaries or focus visibility under the mask (verified in the implementation PR).

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| `variant` | `underline` / `segmented` / `outline` | `underline` | Fade applies to `underline` always and to `segmented` / `outline` only with `fullWidth` |
| `size`, `fullWidth`, `labelWrap` | Unchanged from v0.3 | Unchanged | Fade does not alter their geometry |

- **Tokens (owner-confirmed, decision 1):** add `--mask-scroll-fade-inline` to `packages/tokens/src/theme.css`, following the existing `--mask-section-fade-*` pattern (`theme.css:529-531`). Its gradient stops read the registered start/end fade-size custom properties. The fade width uses an existing spacing step; no new length value is invented.
- **Stylesheet (owner-approved, decision 2):** optional `tabs.css` with a single role, scroll-driven edge masking: the `@property` registrations, the `@keyframes` and the `animation-timeline` binding, which Tailwind utilities cannot express. No paint, color, shadow or geometry beyond the mask; approved hand-authored rules live in `@layer components`. Precedent: geometry-only `gauge.css`.
- **Scrollbars (owner decision 3, option A):** `underline` keeps its hidden scrollbar in this phase; mouse-wheel scrolling without Shift remains unsolved until the phase-2 chevrons. `fullWidth` keeps its thin token-colored scrollbar.
- **Class composition:** static CVA classes in `types.ts` reference the stylesheet role and the scroll padding; per-part `cn` in `useTabs.ts`. No dynamic class interpolation or inline appearance.
- **Files:** the six mandatory files keep their roles; `tabs.css` is added with the role above. No additional internal module.

### Expected-design visual reference

No capture was produced for this spec.

| Visual ID | Scenario | Source and version | Status |
| --- | --- | --- | --- |
| VIS-01 | Underline overflowing at start, middle and end | Storybook story to be added in the implementation PR | Pending capture, hash and approval |
| VIS-02 | Segmented `fullWidth` overflowing: thin scrollbar plus fade | Same | Pending |
| VIS-03 | Keyboard focus on the last visible tab, unobscured; RTL | Same | Pending |

Record viewport, device scale, browser/version, theme, fonts, motion/transparency/forced-colors preferences, crop, date, tool and SHA-256 per capture. Visual conformity is **Not evaluated**.

## 7. Acceptance criteria

All checks are planned; none ran for v0.4.

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | With no overflow, no mask is visible | Emitted CSS test | Browser computed mask at fit width | Pending |
| AC-02 | The fade shows only on edges with hidden content, LTR and RTL | Not applicable in jsdom (no scroll timelines) | Real browser at three scroll positions; VIS-01/02 | Pending |
| AC-03 | Without `animation-timeline`, rendering equals v0.3 | Emitted CSS uses `@supports` guarding | Browser without support or forced fallback | Pending |
| AC-04 | The focused tab never sits inside a faded zone | Class test for `scroll-padding-inline` | Keyboard to both edges; VIS-03 | Pending |
| AC-05 | API, selection, keyboard, panels and all v0.3 variants/options unchanged | Existing `Tabs.test.tsx` suite plus class assertions | Existing stories | Pending |
| AC-06 | Only the confirmed token and `tabs.css` with its limited role are added | `tabs-css.test.ts` role assertions, token review | Not applicable | Pending |

### Owner decisions — 2026-11-19

1. Add the `--mask-scroll-fade-inline` token to `theme.css` for this purpose only.
2. Approve an optional `tabs.css` limited to scroll-driven edge masking.
3. Option A: keep the `underline` scrollbar hidden; mouse scrolling is addressed by phase-2 chevrons.

### Next step

Propose the implementation plan (via `component-contributor`) and await its separate approval. This spec authorizes no code.
