# Tabs v0.5 — fill implementation plan

- **Status:** Approved — 2026-11-20 by the owner (reply "Apruebo con las recomendaciones"): OQ1 approval record for `host-fill`; OQ2 hook/recipe fingerprints captured from the base commit; OQ3 `true`-only fill variants; OQ4 VIS captures authorized; OQ5 typed samples plus a CSS assertion; OQ6 one joint implementation record; OQ-T1 extra Tabs default pin; OQ-T2 `data-fill` applied after native props.
- **Spec:** [fill-amendment.md](fill-amendment.md), v0.5, approved 2026-11-19 ("Acepto todas"), `contentSHA256: f9c81882cd9ad0fc990bcb65e756016cb564f64ff3b28e1a34c73e790fce8bb6`. Verified: SHA-256 of the bytes from the `## 1. Purpose and scope` heading line through EOF reproduces the digest.
- **Shared steps live in the [Panel v0.5 plan](../../panel/v0.5/implementation-plan.md)** and are not repeated here: registry `host-fill` and its approval record (section 6), catalog and system artifact (section 7), local gates and the browser matrix (section 8), commit-unit overview (section 5), open questions OQ1–OQ6. This plan adds only Tabs-specific work.
- **Issue / branch:** [#500](https://github.com/egdev6/egdev-design-system/issues/500), canonical [#107](https://github.com/egdev6/egdev-design-system/issues/107); branch `feat/panel-tabs-fill`, one combined PR with Panel.
- **Skill:** `skills/component-contributor/SKILL.md`, plan stage. No new part, Radix primitive, token, dependency or stylesheet; `tabs.css` (v0.4 edge fade) is untouched.

## 1. Files touched (Tabs)

Folder `packages/ui/src/molecules/tabs/` (six mandatory files exist plus the approved `tabs.css`).

| File | Change |
| --- | --- |
| `types.ts` | `TabsProps.fill?: boolean` (JSDoc, `@default false`, `@control boolean`); `fill` variants on `tabsVariants`, `tabsListVariants`, `tabsScrollAreaVariants`, `tabsPanelVariants` |
| `useTabs.ts` | Destructure `fill` from props (never forwarded to Radix/DOM); normalize `fill === true`; pass it to the recipes; add `'data-fill'` to `rootProps` in fill mode only; expose the recipe results as before |
| `Tabs.tsx` | No structural change (it already consumes `rootProps`, `scrollAreaClassName`, `listProps`, `panelClassName`) |
| `Tabs.test.tsx` | New `describe('Tabs fill contract')`; the v0.3 fingerprint test stays untouched (section 3) |
| `Tabs.stories.tsx` | `FillHost` and nested-in-Panel reference (section 4) |

Wiring: `storybook-controls.test.ts` (Tabs `fill` boolean row, `false` default), `storybook-docgen.test.ts` (Tabs own-prop list), `package-consumption.test.mjs` typed samples; all in Panel plan commit 3.

## 2. CVA, hook and JSX changes per part

Static strings only; every `fill` variant has only a `true` key, so omitted/`false`/invalid emits nothing and default output stays byte-identical.

| Part | Where | `fill: true` adds |
| --- | --- | --- |
| Root | `tabsVariants({ fill })` | `h-full min-h-0`; the hook also sets bare `data-fill=''` in fill mode only (absent otherwise, so default DOM is identical) |
| Non-scrollable list (segmented/outline without `fullWidth`) | `tabsListVariants({ variant, fullWidth, fill })` | `shrink-0` |
| Scroll area (every scrollable list: underline, full-width framed) | `tabsScrollAreaVariants({ fill })` | `shrink-0` on the `relative` wrapper (the list itself already scrolls on x, so the wrapper is the fixed flex child) |
| Active `Tabs.Content` | `tabsPanelVariants({ fill })` | `min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable] focus-visible:-outline-offset-2`; base `pt-4` and `outline-offset-2` kept for default (D-T1 A, D-T2 A) |

- **Merge order:** the base panel recipe contains `focus-visible:outline-offset-2` and the fill variant adds `focus-visible:-outline-offset-2`; `twMerge` must keep the later one. Add a test, and keep the fill variant after the base string. The list `shrink-0` goes where the scrollable/non-scrollable list classes are composed, not into `tabsEdgeFade`.
- **`data-fill`:** set in `rootProps` **after** `...rest`, so a consumer-supplied `data-fill` cannot spoof or suppress it (omitted from the object, not `undefined`-valued, when not filling). It carries no style or behavior of its own (D-G A). Panel's Body rule `has-[>[data-fill]]:[scrollbar-gutter:auto]` matches it (Panel plan section 2).
- **Radix:** selection, roving focus, `aria-controls`, `tabIndex=0` on the active panel and unmounting of inactive panels are unchanged; no wrapper element is added to the panel (D-T2 C rejected).
- **Does not touch:** the v0.4/v0.4-A fade, scroll buttons and `onFocus` reveal, `fullWidth`/`labelWrap` recipes, `ModuleCard`.

## 3. Tests, RED first (`Tabs.test.tsx`)

Before edits, pin the default class output of root, scroll area, panel (and the list for non-scrollable variants) for all variant × fullWidth combinations, hashed on the base commit, alongside the existing `v03Recipes` fingerprint test, which must pass unchanged (it covers list, trigger, count and handler only, so the new pin covers root, scroll area and panel). RED: fill cases fail because `fill` is unknown (it would otherwise be forwarded to the DOM).

| AC | Cases |
| --- | --- |
| AC-01 | Pinned fingerprints for root/scroll area/panel; the existing v0.3 fingerprint test unchanged and green; `fill={false}`, omitted and untyped (`'yes'`, `1`, `null`) identical; no `fill` or `data-fill` attribute in the DOM |
| AC-02 | Per variant (underline, segmented, outline) × `fullWidth`: root `h-full min-h-0`; scroll area `shrink-0` when scrollable, list `shrink-0` when not; active panel `min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]`; production-CSS test finds the utilities |
| AC-03 | Not applicable in jsdom (layout); browser only |
| AC-04 | Existing suite green; `aria-controls`/`aria-labelledby` pairing and `tabIndex=0` on the active panel in fill mode; arrows/Home/End unchanged (`userEvent`) |
| AC-05 | Fill panel has `focus-visible:-outline-offset-2` and not `focus-visible:outline-offset-2` after merge; default panel unchanged (`outline-offset-2`, no `-`) |
| AC-06 | Existing fade/button/reveal tests re-run with `fill` on (scrollable and not) |
| AC-07 | Not applicable in jsdom; paired with Panel AC-06/08 via the nested story and browser check |
| AC-08 | Strict type tests (`fill: 'x'` error), docgen row, Controls row, packaged consumer typed sample |
| AC-09 | `data-fill=''` present on the root only with `fill === true`; absent for omitted/`false`/invalid; consumer `data-fill` cannot spoof it; Panel Body class test pairs the selector with this attribute (a combined render of fill Panel + fill Tabs asserts the Body class and the child's attribute together) |

Counts: 9 ACs; 6 have a primary unit test (AC-01, 02, 04, 05, 06, 09), AC-08 is tooling/type tests, AC-03 and AC-07 are browser-only. About 14 new `it` cases. PRESERVE: the complete existing `Tabs.test.tsx` (including the v0.3 fingerprint test) runs unchanged; the Panel suite and `ModuleCard` suite run unchanged.

## 4. Stories

`Tabs.stories.tsx` (English copy, no manual `argTypes`, no `play`):

- `FillHost`: outline `Tabs` with `fill` in a **fixed 440 × 640 host** (story-only layout utilities), long panel content on each tab and a scrollable list scenario (many tabs) to show the fixed region. VIS-01 subject.
- Nested Panel + Tabs: the `FillWithTabs` story in `Panel.stories.tsx` (fixed 440 × 640, fill Panel with a fill outline Tabs as the sole Body child) is the shared VIS-02 subject; Tabs docs link to it rather than duplicating it.
- `Default` stays free of `fill`. Descriptions state the host-owns-definite-height rule, that panels unmount when inactive (scroll position not preserved), and the `data-fill` marker's purpose.

## 5. Commit units

This plan owns commit unit 2 of the combined set (see Panel plan section 5): `feat(ui): add Tabs fill layout` — `types.ts`, `useTabs.ts`, `Tabs.test.tsx` (with the pinned default fingerprints) and the `FillHost` story, ~400 lines. Wiring, registry/artifacts and the implementation record are units 3–5 there. If the unit exceeds ~450 lines, split the test additions from the recipe change only at a green point (recipe + minimal tests, then the matrix tests).

## 6. Registry, artifact, verification

All shared: the single `host-fill` entry, its approval record and the usage revision refreshes for both `types.ts` files (Panel plan section 6), regeneration through `pnpm build`/`pnpm artifact --write`/`pnpm system:docs` (section 7), the CI Verify gates and browser matrix (section 8). Tabs-specific browser items from that matrix are 6 (panel keyboard scrolling and inset ring) and 5 (nested single scroller and one gutter); additionally verify that many-tab lists keep fade, buttons and focus reveal inside the fixed region while the panel scrolls (AC-06), and that switching tabs resets the panel scroll position.

## 7. Risks

- **R1 (additive public API).** One optional boolean; rollback is removing the prop and registry entry.
- **R2.** Default byte-identity depends on pins captured from the base before editing; the v0.3 fingerprint does not cover root, scroll area or panel, hence the extra pin.
- **R3.** `twMerge` ordering of `outline-offset-2` vs `-outline-offset-2`; asserted in AC-05.
- **R4.** In fill mode the panel's `pt-4` scrolls with content (D-T2 A); content may appear to touch the list edge when scrolled, and focused children may land under the list edge. Add scroll padding only if the browser matrix shows it, and ask the owner first.
- **R5.** A non-definite host height silently degrades to content-sized (documented, by design).
- **R6.** `data-fill` is a cross-component contract with Panel's Body rule; a change in either name breaks the other, so AC-09 pairs them in one test.
- **R7.** Whole-file `types.ts` hashes in the registry go stale on any later formatting change.

## 8. Open questions (none new)

Shared OQ1–OQ6 in the [Panel plan](../../panel/v0.5/implementation-plan.md#10-open-questions-not-decided-here) apply. Tabs-specific:

- **OQ-T1 — Extra default pin.** Add the root/scroll-area/panel fingerprint beside the untouched v0.3 test (proposed) rather than extending `v03Recipes`.
- **OQ-T2 — `data-fill` override.** Set after `...rest` so consumers cannot spoof it (proposed); the amendment is silent on consumer-supplied `data-fill`.
