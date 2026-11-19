# Tabs — fill amendment

- **Version / status:** v0.5 — **Approved — 2026-11-19 by the owner (reply "Acepto todas").** The approval covers this spec only; it does not approve the implementation plan, visual references or the registry write. No code, token, dependency or GitHub change exists yet.
- **Approval / recovery:** canonical issues [#500](https://github.com/egdev6/egdev-design-system/issues/500) (request) and [#107](https://github.com/egdev6/egdev-design-system/issues/107) (Tabs). This file is the recoverable snapshot; `approvalReference: odd/tasks/panel-tabs-fill-specs.md L2`.
- **Amends:** the approved [v0.4 edge-fade amendment](../v0.4/edge-fade-amendment.md) and [v0.4-A scroll-buttons amendment](../v0.4/scroll-buttons-amendment.md), plus the [v0.2 layout amendment](../v0.2/full-width-wrap-amendment.md). Request: [#500](https://github.com/egdev6/egdev-design-system/issues/500) (Recado: the tab bar scrolls away with the panel content). Canonical issue: [#107](https://github.com/egdev6/egdev-design-system/issues/107). Coordinated with the [Panel v0.5 fill amendment](../../panel/v0.5/fill-amendment.md) (#499); the shared prop-naming proposal lives there.
- **Cataloging:** approved as a variant (Engram `catalog/499-500-panel-tabs-fill`): one opt-in boolean on the existing molecule. No new component, primitive, token or dependency.
- **Snapshot identity:** `version: v0.5`; `contentSHA256: f9c81882cd9ad0fc990bcb65e756016cb564f64ff3b28e1a34c73e790fce8bb6`; `visualHashes: VIS-01..02 Pending`; `approvalReference: odd/tasks/panel-tabs-fill-specs.md L2 (owner "Acepto todas", 2026-11-19)`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/107`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, LF line endings and the final newline. Metadata above that heading is excluded.
- **Current evidence:** `tabsVariants` is `flex flex-col overflow-visible`; the list (or, when scrollable, the v0.4-A `relative` scroll area) has no height rule; `tabsPanelVariants` is `pt-4 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2` (`packages/ui/src/molecules/tabs/types.ts`); `Tabs.tsx` renders Radix `Content` only for the active tab. Moving the list outside `Tabs` would break the Radix tab/tabpanel ARIA link, which is why a prop is needed.

## 1. Purpose and scope

Let Tabs fill a host of definite height, keeping the tab list fixed while only the active panel scrolls, with Radix structure and ARIA intact.

**Changes to the approved contract (impact to review):**

| Approved promise | Change |
| --- | --- |
| v0.1/v0.2: the panel is "spacing only" and consumers own content surfaces; height is content-sized | **Amended for `fill` only.** The active panel becomes the native scroller. |
| v0.4/v0.4-A: scroll area, list, fade and buttons | Unchanged. The scroll area (when present) is a fixed region above the panel. |
| Default output | Unchanged when `fill` is omitted or `false`. |

**Non-goals:** sizing the host; scrollbar appearance (S2: native scrollbar only, no custom styling, no Radix ScrollArea); horizontal tab overflow (already v0.4/v0.4-A); vertical orientation; any selection, keyboard or ARIA change.

## 2. Anatomy and composition

Unchanged parts: Radix Root, List, Triggers, Content, the internal scroll area and buttons. No new DOM node or marker; `eg-tabs` is preserved.

## 3. Public API

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `Tabs.fill` | `boolean` | `false` | Opt in to filling the host's block size with a fixed list and a scrolling active panel. Valid for every variant. Not forwarded to the DOM. |

Untyped values other than `true` normalize to `false`. In fill mode the Tabs root also carries a bare `data-fill` attribute (present only when `fill` is true, absent otherwise, so default output is unchanged); it is the marker the Panel amendment's D-G rule matches. It carries no styling of its own and no behavior. Prop-naming: reuses the approved `host-fill` / `fill` convention from the [Panel amendment](../../panel/v0.5/fill-amendment.md#prop-naming-registry-lookup) (evidence and rejected `fullWidth`, `sticky`, `maxHeight`, `layout`, `filled` there; owner-approved as D-N; registry write separate). Reviewed API source: `{ path: 'packages/ui/src/molecules/tabs/types.ts', symbol: 'TabsProps', revision: 'sha256:686c92d98726d184ee618299d99569251faf5d2f187c472039782d7b03713032' }`, current evidence only.

## 4. Behavior

Static CVA utilities per part, composed with `cn()`.

| Part | Utilities with `fill` |
| --- | --- |
| Root | `h-full min-h-0` (keeps `flex flex-col`) plus the `data-fill` attribute |
| List, or the v0.4-A scroll area when the list is scrollable | `shrink-0` (a flex child that scrolls on x would otherwise be shrinkable) |
| Active `Tabs.Content` | `min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable] focus-visible:-outline-offset-2`; `pt-4` is kept on the scrolling panel (D-T1 A, D-T2 A) |

No scrollbar styling. `overflow-x` computes to `auto` with `overflow-y: auto`; wide content scrolls natively.

| Situation | Result |
| --- | --- |
| `fill` omitted or `false` | Output identical to v0.4-A |
| `fill`, definite host height, panel content overflows | List stays visible; only the active panel scrolls |
| Content fits | No scrollbar; gutter reserved only where classic scrollbars take space |
| Host height not definite | Tabs stays content-sized and nothing scrolls; the host owns a definite height |
| Switching tabs | Each panel mounts as before (inactive panels unmount); the new panel starts at its own scroll position, not preserved |
| Many tabs (horizontal overflow) | Fade, buttons and focus reveal behave as in v0.4/v0.4-A, in the fixed region |
| Inside a `fill` PanelBody | No nested scrollbar; see the shared scenario |

### Shared scenario with Panel (S3)

As the sole child of a `fill` PanelBody, the Tabs root's `h-full` resolves to Body's content box (Body's flex-grown height is definite), and `min-h-0` lets it shrink to it. The list is `shrink-0` and the active panel is the only `flex-1` scroller, so Body's content equals its box: Body does not overflow and shows no scrollbar; only the tab panel scrolls. Siblings beside the Tabs or a non-`fill` Tabs make Body scroll natively as an outer scroller (valid, not promised). On classic scrollbars only the tab panel's gutter shows: the Panel amendment's D-G rule (`has-[>[data-fill]]:[scrollbar-gutter:auto]` on Body, matching this root's `data-fill`) removes Body's own gutter when its direct child is this fill Tabs.

## 5. Accessibility

- ARIA unchanged: `role=tab` keeps `aria-controls` to `role=tabpanel`; roving focus, arrows, Home/End and automatic activation are untouched.
- **Keyboard scrolling:** Radix `Tabs.Content` renders `tabIndex=0`, so the active panel scroller is always keyboard-focusable and scrolls with arrows, Page Up/Down, Home/End. Focusing a control inside the panel scrolls it into view natively. No extra tab stop is added.
- **Focus ring:** an outline drawn on an element is not clipped by that element's own overflow, but an ancestor scroller (the fill PanelBody) clips the default `outline-offset-2` ring, so fill mode draws it inside the border box with `focus-visible:-outline-offset-2` (D-T1 A).
- Reduced motion: no animation or smooth scrolling is added. Forced colors and contrast unchanged.

## 6. Appearance

Layout only: no token, Material recipe, stylesheet or file-role change. Types and static CVA in `types.ts`, composition in `useTabs.ts`, JSX in `Tabs.tsx`, plus tests, stories and `index.ts`. `tabs.css` (v0.4 scroll-fade role) is untouched.

| Visual ID | Scenario | Status |
| --- | --- | --- |
| VIS-01 | Fill outline Tabs in a fixed 440 × 640 host, overflowing panel, list fixed | Pending capture, hash and approval |
| VIS-02 | Panel fill with fill Tabs, keyboard focus on the panel (ring visible) | Pending |

No capture exists or is claimed. Record conditions and SHA-256 per the [capture guide](../../../design/README.md). Visual conformity: **Not evaluated**.

## 7. Acceptance criteria

All methods are planned; nothing ran.

| ID | Promise | Planned test | Planned browser check (fixed 440 × 640 host) | Observed |
| --- | --- | --- | --- | --- |
| AC-01 | Omitted/`false`/invalid `fill` keeps v0.4-A class output for all variants, `fullWidth` and `labelWrap` | Class-equality tests; untyped values; no `fill` DOM attribute | Default computed styles unchanged | Pending |
| AC-02 | `fill` applies root, list/scroll-area and active-panel utilities for scrollable and non-scrollable lists | Per-part class tests across variants; production CSS emits the utilities | List rect fixed while panel `scrollTop` changes; panel `scrollHeight` > `clientHeight` | Pending |
| AC-03 | Panel scrolls natively with stable gutter, no content shift | Not applicable in jsdom (layout) | Content x before/after overflow, classic scrollbars | Pending |
| AC-04 | ARIA link and keyboard navigation unchanged; panel is keyboard-scrollable | Existing `Tabs.test.tsx` suite plus `aria-controls`/`tabIndex` assertions | Arrows scroll the focused panel; Home/End in the list | Pending |
| AC-05 | Focus ring on the panel is visible, including inside a clipping ancestor; default mode keeps `outline-offset-2` | Class test: fill panel has `focus-visible:-outline-offset-2`, default panel unchanged | Keyboard focus inside a fill PanelBody; VIS-02 | Pending |
| AC-06 | v0.4/v0.4-A fade, buttons and reveal still work in fill mode | Existing tests | Overflowing tabs inside fill host | Pending |
| AC-07 | Nested in fill PanelBody there is exactly one scroller | Not applicable in jsdom | Body `scrollHeight === clientHeight`; VIS-02 | Pending |
| AC-08 | Typed, documented, no token, dependency or stylesheet | Type tests, docgen/Controls, packaged consumers | Storybook Controls | Pending |
| AC-09 | The root exposes `data-fill` only when `fill` is true, so a fill PanelBody can drop its gutter (Panel AC-08) without double gutters | Attribute present with `fill`, absent when omitted/`false`/invalid; Panel Body class test pairing | Classic scrollbars: nested case shows exactly one gutter (the tab panel's) | Pending |

## 8. Compatibility

Default output is byte-identical (AC-01). `ModuleCard` does not consume `Tabs` or `Panel` and is unaffected. Recado deletes its `scrollbar-gutter` workaround on adoption if no longer needed.

## Owner decisions (resolved 2026-11-19)

Owner reply "Acepto todas" (2026-11-19, `odd/tasks/panel-tabs-fill-specs.md` L2) accepted every recommendation: D-T1 A (`focus-visible:-outline-offset-2` on the fill panel only), D-T2 A (`pt-4` stays on the scrolling panel), D-N A (approve `host-fill` / `fill`, shared with Panel), and D-G (the Tabs root exposes `data-fill` in fill mode so a fill PanelBody can drop its own gutter, specified in the Panel amendment). D-P1 A is resolved in the Panel amendment. Options below are kept as the record.. Registry registration of `host-fill` and any broader convention approval remain separate steps; no registry write is implied.

| ID | Decision | Options | Recommendation |
| --- | --- | --- | --- |
| D-T1 | Panel focus ring in fill mode | **A** inset outline: `focus-visible:-outline-offset-2` (drawn inside the border box, never clipped by an ancestor). **B** keep `outline-offset-2` (clipped by a fill PanelBody). **C** `inset-ring` box-shadow like underline triggers | **A.** Same token color and width, stays visible in the nested case; changes only the offset and only in fill mode |
| D-T2 | Placement of the `pt-4` gap | **A** keep `pt-4` on the scrolling panel: gap at rest, content scrolls up to the list edge, scrollbar starts under the list. **B** move to `mt-4`: fixed gap, but a hard clip line 16px below the list and a shorter scrollbar. **C** wrapper element inside the panel: adds DOM | **A.** Zero structural change and the same look at rest as the default; add scroll padding only if the matrix shows focus landing under the list |
| D-G | `data-fill` marker on the Tabs root | **A** bare `data-fill` only in fill mode. **B** `data-fill="true"`/`"false"` always (changes default output). **C** no marker; Body detects `[role=tablist]` | **A** (approved; keeps default output identical) |
| D-N | Shared `host-fill` / `fill` convention | See the Panel amendment | **A** approved as proposed (registry write separate from spec approval) |
