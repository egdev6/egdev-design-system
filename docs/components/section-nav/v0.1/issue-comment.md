# SectionNav v0.1 — proposed issue handoff, not posted

**Draft — not implementation-ready.** OQ-1–OQ-9 remain open. No GitHub action has been performed. One issue per component; canonical issue and latest published comment are Pending.

## Snapshot identity and recovery

- Version `0.1`; status **Proposed**; approval reference **Pending**. Full local snapshot: [`spec.md`](spec.md), all seven blocks and owner questions. Canonical payload SHA-256 `a5eae79bf4d1a5090f814bb9c8a407e5c2d91785a2c92e7058d80679cd20d8ca`, exact heading line `## 1. Purpose and scope` through EOF, UTF-8 LF including final newline.
- VIS-01 `dd1f700ace732dba694fb645815b647bdada135b3a7902c64d2db86959492214`; VIS-02 `9155ebdfb04d3dbdda9e5ff80fca20dd21110f32d6b29018ff3ca2225624e12b`. See [`capture.json`](capture.json) and parent [`capture-raw.json`](capture-raw.json). Foundation evidence, not DS visual or accessibility compliance.
- Before publication, provide an immutable accessible snapshot and images under separate authorization and verify downloaded bytes. No URL or approval is invented.

## Owner decisions and recommendations

1. **Composition:** catalog row `scripts/catalog_data.py:101` names only Link; Foundation `design-system/components/SectionNav/README.md:5-13` includes MenuList, Pixel, ProgressBar, Icon. Recommend later correcting the row to navigation links/index, planned Pixel, ProgressBar, Icon and evaluated Popover/Surface; existing NavList cannot express Pixel or `aria-current=location` unchanged.
2. **Primitive:** recommend installed Popover conditionally, acknowledging its named-dialog and cyclic-Tab contract; validate portal, landmark and focus. NavigationMenu is absent and would need separate dependency approval; Collapsible lacks floating portal and DropdownMenu has menu semantics (`packages/ui/package.json:30-40`, `packages/ui/src/molecules/popover/types.ts`).
3. **Hover:** replace delayed hover with explicit click/keyboard disclosure. WCAG 2.2 SC 1.4.13 requires hover/focus content dismissible, hoverable and persistent: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html . Foundation behavior: `SectionNav/README.md:20-23`.
4. **Next and shortcuts:** separate consistent disclosure and native next link, last wraps to first; no automatic Alt+Up/Down, which may conflict with browser/OS/AT. Host can separately document and test page-scoped bindings, excluding editors; decide localized control-name API (`SectionNav/README.md:29-37`).
5. **State:** host supplies active id, percent and hidden; no internal scroll listeners; `@egdev/effects` owns choreography. Host coordinates focus before hiding (`docs/CATALOGACION.md`, web amendment; `SectionNav/README.md:14-19`).
6. **Landmark/focus:** named nav, `aria-current="location"` (or `true`), native links and non-color cue; Radix Escape returns focus, while activation must not override navigation focus. Verify Popover dialog semantics, portal and AT (`packages/ui/src/molecules/popover/types.ts`).
7. **Progress:** reuse existing unnamed/decorative ProgressBar sm edge, host text equivalent; fraction ×100 to percent (`packages/ui/src/atoms/progress-bar/types.ts`; `docs/components/progress-bar/v0.2/spec.md`).
8. **Responsive/motion:** approve SectionNav-local ≤520px viewport boundary, not assumed `md`; 44px coarse targets, reduced motion and no host smooth scroll (`SectionNav/README.md:19,42`; `packages/tokens/src/theme.css:11-13`).
9. **Material/cascade:** approve pill overlay composition and solid fallback using Surface, without double-overlaying Popover; neutralize legacy root and bridge locally, preserve old consumers and test shipped cascade (`docs/MATERIAL.md`; `packages/ui/src/styles/legacy/bundle.css:557-637,1758,1783`).

Registry lookup (`skills/_shared/prop-naming.json`, `docs/prop-naming.md`): `accessible-name`/label, `collection-items`/items, `primary-value`/value, `navigation-intent`/onNavigate, `open-state`/open, `initial-uncontrolled-open`/defaultOpen, `open-change`/onOpenChange. Proposed `active-section-id`/activeId is pending independent approval; native hidden has no own convention. Control-name API remains unresolved and requires lookup. Reviewed `NavListProps` SHA-256 `189b8cdce8ba0900cc1f66d24e9101f06c1250ceb004fb3ade0e036a0271c5f6`, `PopoverProps` `f5c4d5fd52630fba8d7bbebb433642b5fc5d7c33de8fe832257376829c4dfe96`, `ProgressBarProps` `24333aa44912ecce88ce5e0bf27f04ccf838a6ee0c1b723b01574cbbf4c67a6b`; paths are in the full spec. Pixel's API is not assumed.

**Approval scope:** exact contract and chosen visuals only; conventions, dependencies, catalog changes, implementation plan and code need separate approvals. Visual conformity, accessibility, real-browser focus and responsive behavior remain unverified.
