# Dialog and AlertDialog v0.3 — stacked-header spacing amendment

- **Version / status:** v0.3 — Draft — not approved.
- **Amends:** the approved [Dialog and AlertDialog v0.2 header-layout amendment](../v0.2/header-layout-amendment.md), alongside the [Dialog v0.2 container/body amendment](../v0.2/container-compact-amendment.md) and [AlertDialog v0.1 contract/plan record](../../alert-dialog/v0.1/implementation-plan.md). Unmentioned promises remain unchanged. Request: [#466](https://github.com/egdev6/egdev-design-system/issues/466).
- **Approval / recovery:** This file is the recoverable proposal, not approval. Owner review of the exact snapshot and identified visual references is pending. Spec approval does not approve an implementation plan; that plan needs separate approval. This draft authorizes no code, tokens, dependencies, captures or external writes.
- **Snapshot identity:** `version: v0.3`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 Pending, VIS-02 Pending, VIS-03 Pending, VIS-04 Pending`; `approvalReference: Pending`; `canonicalIssue: Dialog https://github.com/egdev6/egdev-design-system/issues/119; AlertDialog https://github.com/egdev6/egdev-design-system/issues/120`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, with LF line endings and the final newline; the tracking metadata above it is excluded. Finalize before publication and bind approval to the version, digest and identified visual hashes. #466 is the request, not a replacement canonical component issue.

## 1. Purpose and scope

Tighten only the vertical separation inside each **stacked** modal header so the description reads as a subtitle immediately below the title row. This is a visible default-appearance change for every existing stacked Dialog and AlertDialog consumer, including AlertDialog's default. Dialog's default remains inline. Measure the current rendering in a real browser **first**, then use one of the existing `--space-1` or `--space-2` tokens for the tightened separation; no spacing prop is added. The final choice between those two tokens remains for the owner after measurement and visual review.

Preserve inline layout, header-to-body spacing, the Dialog dismiss button's position, all other geometry, Material, semantics and interaction. A shorter stacked header may move the body or centered panel in viewport coordinates; the protected boundary is the spacing between the header and body, not an absolute screen coordinate. No new component, variant axis, typography redesign or consumer workaround is proposed.

**Reuse / level:** Amend the existing public `@egdev/ui` molecules, rather than create or extract a component. Both are exported by `packages/ui/src/index.ts:45,62`; the local exports are `packages/ui/src/molecules/dialog/index.ts:1` and `packages/ui/src/molecules/alert-dialog/index.ts:1-7`. Existing inline/stacked APIs already express the intended arrangement; an opt-in variant or application composition would not fix the existing stacked presentation for all consumers. Their coordinated modal content and controls justify the existing molecule placement.

## 2. Anatomy and composition

| Part | Existing responsibility / primitive | This amendment |
| --- | --- | --- |
| Root, Trigger, Portal, Overlay and panel | Separate Radix Dialog or AlertDialog primitives, composed with Surface | Unchanged; no new modal or focus engine |
| Header / title row | Radix Title in a header; Dialog's stacked row also contains optional status, AlertDialog's row may contain its decorative danger icon | Tighten only the following stacked separation; keep row contents and order |
| Description | Radix Description; optional for Dialog, required for AlertDialog | In stacked layout, directly follows the title row as a readable subtitle; omission remains supported only for Dialog |
| Body, footer and Dialog dismiss | Existing body, optional/required actions and Dialog's separate absolutely positioned close | Preserve their spacing, position, structure and behavior |

Dialog renders the row only for stacked and places the description next (`packages/ui/src/molecules/dialog/Dialog.tsx:35-51`); AlertDialog renders its title/icon row followed by its description in both layouts (`packages/ui/src/molecules/alert-dialog/AlertDialog.tsx:60-70`). Keep the existing `eg-dialog*` and `eg-alert-dialog*` public markers and existing Radix `asChild` constraints. Dialog's built-in close is last in the panel DOM; AlertDialog has no built-in close X.

## 3. Public API

| Existing prop / part | Type and default | Contract for this amendment |
| --- | --- | --- |
| `DialogContent.headerLayout` | `'inline' \| 'stacked'`, optional; `inline` | `stacked` gets the proposed tighter separation; inline stays unchanged. |
| `AlertDialogContent.headerLayout` | `'inline' \| 'stacked'`, optional; `stacked` | Omitted and explicit `stacked` share the tighter default; inline stays unchanged. |
| Both `title` / `description` | `title: string` required; Dialog `description?: string`, AlertDialog `description: string` required | Existing non-empty localized content, Radix relationships and absence rules remain. |
| Dialog `statusText`, `bodyPadding`, `dismissLabel` | Optional existing inputs | Status remains beside title; body padding and dismiss placement stay unchanged. |
| AlertDialog `tone`, `actions` | `tone?: 'neutral' \| 'danger'`, default `neutral`; `actions: ReactNode` required | Danger icon, required consumer-composed Cancel/Action order and panel material stay unchanged. |

The types are in `packages/ui/src/molecules/dialog/types.ts:76-99` and `packages/ui/src/molecules/alert-dialog/types.ts:46-55`. The hooks normalize unrecognized layout values to their existing component-specific defaults (`packages/ui/src/molecules/dialog/useDialog.ts:39-45`, `packages/ui/src/molecules/alert-dialog/useAlertDialog.ts:27-29`); no prop is forwarded to the DOM. Public exports, controlled `open`/`defaultOpen`/`onOpenChange`, native-prop exclusions, supported `className` boundaries and ref behavior remain as in the earlier contracts. No new or changed own prop, slot, event, exception, native prop or ref is proposed.

**Prop-naming lookup:** Reviewed [registry source](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md) and the [meaning/name/alias workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry). Existing mappings: approved `dialog-header-layout` → `headerLayout` for both components; `heading-title` → `title`; `content-description` → `description`. `layout-gap` → `gap` applies to reusable layout-container APIs and does **not** introduce a Dialog prop; `label-layout` concerns a control and label, not this header. No new semantic ID or scoped exception is proposed; no registry mutation is needed. Existing convention approval is independent of approval of this appearance amendment. Reviewed working-tree usage sources, matching the registry's recorded revisions:

- `{path: 'packages/ui/src/molecules/dialog/types.ts', symbol: 'DialogContentProps', revision: 'sha256:d092a54959e03e0599f59fa4164eba7b345cb91ba2ec0caf120c0dcea799280e'}`.
- `{path: 'packages/ui/src/molecules/alert-dialog/types.ts', symbol: 'AlertDialogContentProps', revision: 'sha256:57ccf5509bd236adc8fb2e40e6bc709f0402676a208724f825e23856bc0a509b'}`.

## 4. Behavior

| Given / action | Proposed observable result | Event |
| --- | --- | --- |
| Stacked header with a title and description, short or long | Description is below and close to the title row, including when text wraps; no overlap or clipping attributable to the spacing change. | None |
| Dialog stacked with or without status | Present status remains with the title in the first row. Without a description, no empty subtitle or extra inter-item gap is introduced. | None |
| AlertDialog stacked, neutral or danger | Description remains below the row; the danger icon stays decorative and adjacent to title. | None |
| Either inline layout | Existing arrangement, gap, wrapping and classes/geometry remain unchanged. | None |
| Open, close or request a decision in either layout | Existing Radix-controlled/uncontrolled behavior, dismissal rules and callbacks remain; layout selection itself does not emit an event. | Existing `onOpenChange` requests only |

No new state, breakpoint, runtime measurement, inline styling or public override mechanism is proposed. The real-browser measurement is a **planned pre-implementation investigation**, not code that measures users' browsers. Header and body remain separate, and existing body padding and child layout are not modified.

## 5. Accessibility

Preserve the Radix-owned `dialog` / `alertdialog` roles, modal behavior and `aria-labelledby` / `aria-describedby` relationships. Dialog without a description must still omit its description relationship; AlertDialog retains its required consequence. Status is passive and is not substituted for the name or made a live region. Consumers supply localized meaningful titles, descriptions and action names.

Keep Dialog's existing initial focus, Tab loop, Escape/close behavior and Trigger restoration where present; retain the built-in close's focus order and logical top-end position. AlertDialog retains Cancel autofocus, action order, ignored outside dismissal and Escape handling. Trigger-less restoration remains consumer-owned. Keyboard, focus and relationship checks are planned separately from visual captures; source and existing test assertions are not proof that they were run in this batch (`packages/ui/src/molecules/dialog/Dialog.header-layout.test.tsx:95-140`, `packages/ui/src/molecules/alert-dialog/AlertDialog.header-layout.test.tsx:99-131`).

## 6. Appearance

| Axis | Existing default | Proposed stacked rule / restriction |
| --- | --- | --- |
| Header layout | Dialog `inline`; AlertDialog `stacked` | Change only stacked vertical title-row-to-description separation; keep inline's current effective gap and layout. |
| Spacing token | To be chosen after real-browser baseline | Use existing `--space-1` or `--space-2`; do not assume a new token, hardcoded value or dynamic utility. |
| Header/body and dismiss | Existing component-specific padding and close offsets | Preserve the effective separation at the header/body boundary, including default and compact Dialog body padding, and the close's offset relative to its panel. |
| Material and typography | Existing Surface, title and description recipes | Preserve paint, fonts, line heights, title-row internal gap and existing focus/reduced-motion behavior. |

**Static baseline and hypothesis, not a browser measurement:**

1. Dialog's stacked CVA is `flex flex-col items-start`, with no gap utility (`packages/ui/src/molecules/dialog/types.ts:137-140`). However, the retained `.eg-dialog__head` legacy rule explicitly sets `gap: var(--space-3)` (`packages/ui/src/styles/legacy/bundle.css:1481`); the hook applies that marker (`packages/ui/src/molecules/dialog/useDialog.ts:65-70`). With the normal layered stylesheet loaded, and no higher-layer gap override, that gap is a likely contributor, not merely margins or line-height. The legacy import is in the components layer and utilities are later (`packages/ui/src/styles/index.css:10-12`); actual cascade must be measured. The inline header uses the same legacy rule, so changing it globally would violate the inline-preservation requirement.
2. AlertDialog has a separate header recipe with an explicit `gap-[var(--space-2)]` in the shared base for **both** layouts (`packages/ui/src/molecules/alert-dialog/types.ts:57-64`). Its inline direction changes to `flex-row`; reducing that shared base gap indiscriminately would change inline. `--space-2` is already its nominal flex gap, so a candidate of `--space-2` alone may not make its measured separation tighter; margins and the rest of the cascade must be investigated first.
3. Neither title-row CVA declares padding (`packages/ui/src/molecules/dialog/types.ts:144`, `packages/ui/src/molecules/alert-dialog/types.ts:64`); the padding belongs to the respective header (`dialog/types.ts:137-138`, `alert-dialog/types.ts:57-58`). Dialog's legacy title explicitly has `margin: 0` (`packages/ui/src/styles/legacy/bundle.css:1482`). The shared title and description CVAs declare typography/color but no margin reset (`packages/ui/src/molecules/dialog/types.ts:146-147`); AlertDialog reuses them with its own markers (`packages/ui/src/molecules/alert-dialog/useAlertDialog.ts:39-44`). Therefore AlertDialog title and both native description margins can depend on the user agent or host reset. Do not assume they are zero or identify their computed values without measurement.
4. The title uses `text-heading-small`, the description `text-body-default`; token line-height values are respectively `1.2` and `1.6` (`packages/tokens/src/theme.css:234-247`). Line-box leading and a taller title/status or icon row can add apparent whitespace beyond any flex gap. Neither component renders the `Heading` or `Text` primitives: their default recipes are `section` / `eyebrow` and their own recipes include `m-0` (`packages/ui/src/primitives/text/useHeading.ts:47-48`, `packages/ui/src/primitives/text/useText.ts:60-62`, `packages/ui/src/primitives/text/types.ts:47-49,68-81`). Their resets cannot be assumed to apply to these Radix elements.

**Target and boundaries:** Once the baseline is measured and an owner-selected candidate is approved, the stacked description's top border-box edge should be separated from the title-row bottom border-box edge by the chosen token, without additive top margins or overlap. Actual glyph-to-glyph whitespace may differ due to fonts, line boxes, wrapped status or the danger icon; verify the subtitle effect visually, not by treating the token as an ink measurement. Preserve the baseline description-to-body separation and header/body padding; do not obtain the result by changing the body, shared typography, inline layout, title-row internal gap or close offset. If the measured cascade makes these constraints incompatible with both existing token candidates, stop and request an owner decision rather than inventing a token or silently expanding scope.

`--space-1` and `--space-2` already exist (`packages/tokens/src/theme.css:436-440`); their current values are theme inputs, not fixed pixel promises. No new token, role, dependency, handwritten Material recipe or dynamic geometry is currently identified as necessary. If a missing token or role is discovered, record a pending proposal and obtain explicit owner confirmation before changing it. Preserve existing Surface composition and the [Material contract](../../../MATERIAL.md). Retain the six existing component files and their current roles, with **No stylesheet** or extra internal module proposed. Use static token-backed CVA and `cn()` in a separately approved plan; preserve legacy CSS, not a global rewrite. Content `className` remains last-merged only for the previously supported outer layout; `twMerge` is not a universal cascade or appearance-policy guarantee.

### Expected-design visual reference

No captures were produced in this batch. The existing v0.2 observed screenshots are historical implementation evidence, not approved v0.3 expected design. The current implementation is not automatically the desired design. All sources/conditions and visual approvals below remain pending; visual conformity is **Not evaluated**.

| Visual ID | Image / descriptive scenario | Planned source and conditions | Status |
| --- | --- | --- | --- |
| VIS-01 | Pending — Dialog stacked, long wrapping title, status, description and dismiss | Real Storybook component-zone capture; narrow and wide host conditions | Pending source/version, image, metadata, hash and owner approval |
| VIS-02 | Pending — Dialog inline, matching long title, status, description and dismiss | Same comparison conditions as VIS-01; preserve baseline | Pending source/version, image, metadata, hash and owner approval |
| VIS-03 | Pending — AlertDialog stacked, long wrapping title and consequence, including danger icon | Real Storybook component-zone capture; narrow and wide host conditions | Pending source/version, image, metadata, hash and owner approval |
| VIS-04 | Pending — AlertDialog inline, matching long title, consequence and icon | Same comparison conditions as VIS-03; preserve baseline | Pending source/version, image, metadata, hash and owner approval |

For each capture record story URL and commit/source version, date/tool, viewport, device scale, browser/version, theme, loaded fonts, zoom, direction, motion/transparency preferences and component crop. Obtain an authorized source and capture permission, then independently scoped owner adoption of the exact visual hashes; follow the [capture guide](../../../design/README.md). Capture before and after under comparable conditions. No pixel-derived token changes or invented visual tolerance are authorized. Captures do not replace behavior, keyboard or assistive-technology checks.

## 7. Acceptance criteria

All implementation checks are **planned**, not observed in this batch. A story is a review fixture, not a behavior test; jsdom/class assertions do not prove layout.

| ID | Observable promise | Planned behavior / structural check | Planned story / real-browser check | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | Before a fix, identify computed separation and its actual contributors for both stacked headers. | Inspect scoped CVA, legacy cascade and reset; do not infer geometry from classes. | Open both baseline stories; record computed gap, title/description block margins and line heights, header padding, row/description rectangles, loaded fonts and relevant text-line/ink appearance; compare no-reset and normal host if applicable. | Static hypothesis above only; measurement Pending. |
| AC-02 | With a description, both stacked headers place it below the title row at the owner-selected `--space-1` or `--space-2` separation, visually close like a subtitle. | Component DOM/recipe tests for each layout and component, omitted/default/explicit stacked, neutral/danger and short/wrapping content; update the existing AlertDialog test that pins the old stacked gap. | Long-title stacked stories and component-zone captures VIS-01/VIS-03; measure row-to-description boxes and token after fonts load at narrow/wide widths. | Pending. |
| AC-03 | Both inline headers, including effective gap, markup and wrapping, remain unchanged. | Preserve regressions for omitted and explicit Dialog inline and explicit AlertDialog inline, including existing class/cascade behavior. | Matched pre/post inline long-title geometry and captures VIS-02/VIS-04; verify AlertDialog's `--space-2` inline gap remains intact. | Pending. |
| AC-04 | Header-to-body spacing and Dialog dismiss position do not change. | Preserve header/body padding, body presence/absence, default/compact body, close DOM/focus order and logical offset. | Compare description-bottom to first-body-content distance, header/body padding and dismiss-to-panel offsets before/after under matched long-title/body conditions; allow the panel itself to move. | Pending. |
| AC-05 | Title/status/icon order, optional Dialog description, required AlertDialog description and their accessible relationships remain intact. | Role/name/description and DOM order tests, both layouts, Dialog with/without status and description, AlertDialog neutral/danger; no `headerLayout` DOM leak. | Inspect accessible tree and long-content reflow in both layouts, including no overlap, at narrow and wide widths. | Pending. |
| AC-06 | Focus, dismissal, Cancel/Action and controlled/uncontrolled behavior remain unchanged; layout emits no new event. | Public interaction tests for Dialog close/Escape/focus restoration and AlertDialog Cancel/action, outside pointer and Escape, including unchanged callbacks and focus order. | Real-browser keyboard/focus and, separately, assistive-technology checks; stories are examples only. | Pending. |
| AC-07 | Existing public API/defaults, markers, exports, Material and supported composition remain; no new spacing prop. | Type/export and default/invalid-value fallback checks; static CVA scanning, emitted CSS and packed consumer checks under a separately approved plan. | Review default and layout stories, existing Surface/focus presentation and compiled cascade in a real browser. | Pending. |
| AC-08 | Stories show **both layouts with a long title** for both components. | Review story source and metadata; preserve existing controls/defaults. | Provide long-title inline and stacked scenarios, with matching content and usable triggers, for VIS-01–VIS-04. Current header stories use short titles and do not meet this future criterion. | Pending. |

### Resolved decisions

- Owner chose “Fix the default”: measure in the browser first, then tighten title to description using space-1/2; no new prop. Applies to both Dialog and AlertDialog stacked headers.
- Inline layout, header-to-body spacing and Dialog dismiss placement remain unchanged. Existing component-specific layout defaults stay unchanged.
- Reuse the existing molecules and registered `dialog-header-layout` convention; this draft does not request tokens, dependencies or new conventions.

### Remaining decisions for the owner

- After the baseline measurement and comparison, choose `--space-1` or `--space-2` as the effective stacked separation, including whether one choice can satisfy both components without violating the protected boundaries. If not, review the concrete measured conflict before implementation.
- Review and approve the exact v0.3 snapshot and, separately, an implementation plan. Confirm visual source, scenarios and capture conditions, then explicitly adopt the identified visual references/hashes; no appearance validation is claimed yet.

### Planned checks

First arrange separately authorized real-browser baseline measurement for AC-01; then select the token and request the separately approved plan. After that, use test-first behavior regressions, long-title stories, matched real-browser geometry/captures, keyboard/AT checks and scoped package/CSS checks in AC-02–AC-08. None is marked implemented or passed here.
