# AppShell — approved v0.1 contract recovery

- **Status:** v0.2 preparation notes; the underlying full AppShell **v0.1 contract is APPROVED**. These notes do not replace/version its promises. Runtime is deliberately PARKED, not implemented or authorized.
- **Canonical full contract:** [#130 issue body](https://github.com/egdev6/egdev-design-system/issues/130); [final full-contract approval 6251614057](https://github.com/egdev6/egdev-design-system/issues/130#issuecomment-6251614057). The latter supersedes historical Draft/Pending approval headers only, retaining separate implementation gates. It is a manual owner-grant record, not native/signed/independent review.
- **Recovered identity:** canonical SHA-256 `5f861d3f26424ae02cbe3be4daecfa97f697657048d19a82e5b19a7686f190e4`; whole issue-body SHA-256 `671d890d3bd3dc0529b5b64e52c4a0aeaf89841966d24c8b2b8cd0fd90d204fb`. Both recomputed from the parent-supplied snapshot using the actual anchored whole-line payload heading and matched the final approval.
- **Preparation authority:** [T8 assignment](https://github.com/egdev6/egdev-design-system/issues/130#issuecomment-6522802732); parent supplies fresh open/ownership/no-overlap readback. No remote action/check was performed here.
- **Note identity:** `contentSHA256: sha256:93028d2d78c32389880cda51c7e81f2accad09abc28105a843ddf0c6c0589731`; SHA-256 of UTF-8 bytes from the actual whole-line heading `## 1. Approved responsibility and anatomy` through EOF, LF including final newline; tracking metadata above is excluded.
- **Related notes:** [dependency/evidence map](dependency-evidence-map.md), [future parked plan](implementation-plan.md). No new specimen/capture is needed for this preparation.

## 1. Approved responsibility and anatomy

Template in `@egdev/ui`, future `packages/ui/src/templates/app-shell/`. AppShell places regions; it owns neither product data nor navigation behavior. Consumer supplies optional sideNavigation (Sidebar or ModuleRail), optional bottomNavigation (TabBar), and required main content. Routing/current page, destinations, organism accessible names and equivalent wide/narrow destination coverage remain consumer/organism responsibilities.

DOM order: plain root div → optional hide-until-focus skip row → plain body div containing plain side wrapper then the view's single native main → plain bottom wrapper. Only main is an AppShell landmark; organism nav landmarks are not duplicated with additional nav/aside/header/footer roles. Consumers must not nest another main in children. No Foundation AppShell source exists; this is not a port of legacy SectionShell/HomeTemplate web patterns.

AppShell imports **Button only** as a runtime component. Skip link composes Button secondary, default md/48px, asChild around a native anchor. No direct Radix, Surface, Sidebar, ModuleRail, TabBar, Dialog or Portal import belongs in the template. Button's installed individual Radix Slot composition supplies asChild; there is no new dependency or behavior engine.

## 2. Exact approved API and ownership

- `AppShellMessages = {skipToContent?: string}`; omitted messages/entry defaults to `Skip to content`, the sole built-in text.
- `AppShellProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role' | 'dangerouslySetInnerHTML'> & {sideNavigation?: ReactNode; bottomNavigation?: ReactNode; children: ReactNode; messages?: AppShellMessages}`.
- Root id/data/aria/dir/native listeners and className inherit compatible div behavior. Preserve this exact Omit surface: no new native restrictions, refs, asChild, part bags, layout/breakpoint props, events, state, drawer or secondary-region API. Native inheritance does not grant appearance/containment overrides contrary to the contract.
- className merges last through cn for outer sizing/margins only, including supported min-h/h/m utilities; retain eg-app-shell. No part markers or public part-class props; no universal arbitrary-selector merge guarantee.
- Named exports: `AppShell`, `AppShellProps`, `AppShellMessages`, **`appShellVariants`**. The CVA export is explicitly approved; do not silently hide it or expose the hook.
- Naming IDs already accepted: side-navigation → sideNavigation; bottom-navigation → bottomNavigation; localized-messages → messages. [Registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md), [template naming receipt](../../../decisions/prop-naming-template-specs-approval.json). children/className/native attrs are not new conventions. No alias migration/global promotion; future source usages await actual types.ts review/hash.

## 3. Viewport, scroll and keyboard contract

Switch only when **both navigation slots are supplied**: side visible at ≥56rem viewport width, bottom visible below 56rem; inactive wrapper uses display:none. Both supplied organism trees remain mounted across CSS switching. Side-only/bottom-only is visible at every width; neither gives main-only. No matchMedia, ResizeObserver, container query or JS layout state. The breakpoint is approved structural 56rem (896px under the reference 16px initial font setting), not a new token or configurable prop; keep arbitrary min-[56rem]/max-[56rem] utilities static. Container-responsive content in main measures its own content column, not this viewport threshold.

Document scroll owns the page. Root min-h-dvh column; body flex row/flex-1; side sticky top-0 h-dvh self-start shrink-0 with organism-owned auto width; main min-w-0 flex-1 with no page padding/gap/max-width; bottom sticky bottom-0 **in normal flow as the last root child**. No fixed dock, inner scroll pane or compensating page padding. TabBar owns safe-area bottom padding; consumer supplies viewport-fit=cover; side safe-area insets on landscape notched devices are outside v0.1.

Skip row exists only for supplied side navigation, and in the switching arrangement is display:none below 56rem. Hidden until focus via sr-only/focus-within:not-sr-only; on focus it becomes an in-flow row above regions, not an overlay/z-index layer. Focused-row layout shift is accepted. Link uses Button secondary/asChild plus m-2. Main has generated useId id, internal ref and permanent tabIndex=-1. Hook click handler prevents default and focuses main, letting the browser scroll it into view without changing URL/hash-router state. Before hydration the native fragment href remains usable. Main focus:outline-none is intentional; next Tab continues through content. Focusing main by clicking its empty area is accepted.

Normal order: skip → side → main content, or main content → bottom. No roving keys, Escape handling, focus trap/restoration, live region or breakpoint-triggered focus/scroll repair. If resize hides a focused organism, AppShell still adds no unapproved relocation policy; inspect actual browser behavior rather than promise otherwise. RTL uses logical inline-start placement.

Root/body/main add no fixed-position containing block or stacking context. No containment, transform, filter, isolation or explicit z-index is added by AppShell. Sticky side/bottom wrappers inherently form stacking contexts even with z-index:auto; those are allowed. Fixed descendants should remain viewport-relative and body-portalled overlays independent; browser evidence is required. AppShell creates no Dialog/sheet; modal focus/inert/ARIA behavior belongs to an independently supplied real Dialog/Radix host, not AppShell.

## 4. Material, files and retained evidence

Root owns only token canvas background, foreground and sans family; regions own their Material. No AppShell border, sheen, shadow, blur, overlay, motion or dynamic geometry. Root/body/main remain structural; no Surface prerequisite/import is needed. Button and Surface are implemented on this baseline, so old availability prose does not reopen either prerequisite.

Six meaningful files: types.ts (types/JSDoc/static per-part appShellVariants), useAppShell.ts (slot-derived arrangement, messages, useId/main ref, skip handler and per-part cn), AppShell.tsx (JSX only), AppShell.test.tsx, AppShell.stories.tsx, index.ts. **No stylesheet; no extra internal modules.** Slot-derived arrangement is switching/side/bottom/content, not public state or data-state.

Approved historical visuals remain recoverable and unchanged:

| VIS | Existing local image | SHA-256 / scope |
| --- | --- | --- |
| VIS-01 | [AppShell specimen](../../../design/foundation-boards/v2026-10-18-wave4/specimens/app-shell--specimen.png) | `27439a76a2beb70d16326452f9375a6fb447f255efea0eee7bd459a304a43c1d`; expected structural layouts and illustrative skip row, not actual responsive/sticky/focus behavior |
| VIS-02 | [Sidebar specimen](../../../design/foundation-boards/v2026-10-18-wave3/specimens/sidebar--specimen.png) | `214e4a0ebb531561935419d309990d81eda88a29adef27b6825246cb9528e805`; supporting region Material/width only |
| VIS-03 | [ModuleRail board](../../../design/foundation-boards/v2026-10-18-wave3/ModuleRail.png) | `10bb0733c96c98d4f3b79a1c9c1f3e3ba073c81f283601b43b395d6372686703`; supporting full-height inline-start rail only |
| VIS-04 | [TabBar board](../../../design/foundation-boards/v2026-10-18-wave3/TabBar.png) | `1fec3626d85edceb81022b48971c4c1acac910044c25764784a728bd4c0b4706`; supporting bottom-region Material/safe-area intent only |

Local bytes match approval; no remote asset accessibility or new image inspection/capture is claimed. VIS-01 metadata records Chromium 148/Linux, viewport1280×900/DPR1, image1265×1566, loaded fonts, reducedMotion=false; theme/reduced-transparency unrecorded. Static 960/384px frames simulate layouts, do not run the viewport query. See [existing capture metadata](../../../design/foundation-boards/v2026-10-18-wave4/specimens/capture.json). Landmark duplication inside a multi-example historical board is not runtime template anatomy or an end-to-end test. Visual conformity remains **Not evaluated**.

## 5. Current readiness

The complete v0.1 contract and scoped visuals are approved. #128 evidence/naming consolidation already exists; see the map rather than proposing another specimen, receipt or duplicate delivery. Core structural checks can be **planned** without organisms, but no runtime implementation may start in this batch.

**Parked unblock condition:** parent verifies real implemented/usable Sidebar [#123](https://github.com/egdev6/egdev-design-system/issues/123), ModuleRail [#124](https://github.com/egdev6/egdev-design-system/issues/124) and TabBar [#125](https://github.com/egdev6/egdev-design-system/issues/125) for the approved composition/stories, obtains separate exact implementation-plan approval, and explicitly authorizes a later template runtime task/edit surfaces. These organisms remain outside the non-organism roadmap. Do not implement stubs to satisfy this condition. Preparation is complete while runtime is intentionally parked.
