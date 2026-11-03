# Component contract — SectionNav

- **Version / status:** 0.1 — Proposed, draft for owner review; not implementation-ready.
- **Approval / recovery:** Pending explicit owner decision on this payload and VIS-01/02; web catalog classification is approved, not this contract or a plan. Capture authority: `odd/tasks/web-catalog.md` L6, L25–L29.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: a5eae79bf4d1a5090f814bb9c8a407e5c2d91785a2c92e7058d80679cd20d8ca`; `visualHashes: VIS-01 → dd1f700ace732dba694fb645815b647bdada135b3a7902c64d2db86959492214; VIS-02 → 9155ebdfb04d3dbdda9e5ff80fca20dd21110f32d6b29018ff3ca2225624e12b`; `approvalReference: Pending`; `canonicalIssue: Pending`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of UTF-8 bytes from the exact whole heading line `## 1. Purpose and scope` through EOF, including LF and final newline; header excluded.

## 1. Purpose and scope

Propose a reusable floating section-navigation organism in `@egdev/ui`, not a page, router, scroll observer or effects director. Host supplies ordered section destinations, current position, progress and footer-away state. Domain content stays in the host; scroll choreography belongs in `@egdev/effects` (`docs/CATALOGACION.md`, web consumer amendment). This covers S3–S4 of `odd/tasks/web-catalog.md`, limited to D8.

**Cataloging:** `scripts/catalog_data.py:101` says organism / ui / Link; Foundation `design-system/components/SectionNav/README.md:1-13` additionally identifies MenuList, Pixel, ProgressBar and Icon. Reuse or variant alone cannot coordinate a floating disclosure, current section, next link and progress. Compose existing pieces where their contracts fit; new organism is justified by the region. Extract is not justified. Catalog correction is a separate owner decision (OQ-1), not an edit here. `NavList` currently owns a nav, only `aria-current="page"`, and has no Pixel/number slot (`packages/ui/src/molecules/nav-list/types.ts`); do not pretend it can render this list unchanged. `Menu` is an action-menu primitive; its link option does not make a section index an action menu. `Popover` is a named dialog with cyclic Tab even non-modal (`packages/ui/src/molecules/popover/types.ts`); this is an important semantic and keyboard trade-off, not proof of a perfect fit.

Foundation evidence root is `/home/egdev/proyectos/egdev-website/egdev-foundation/`, read-only: `design-system/components/SectionNav/README.md`, `preview.html`, `design-system/CONTRACT.md:68`, `design-system/DECISIONES.md:22-25`, `reference-web/pulso-source.html:620-649`. The preview's script is evidence, not an accessibility or implementation approval. Pixel is planned separately before SectionNav per L25; only its decorative idle/past/active marker responsibility is assumed, not its API or availability.

## 2. Anatomy and composition

| Part | Proposed responsibility |
| --- | --- |
| `nav.eg-section-nav` | Named page-section navigation; one instance per page |
| Current/disclosure control | Identifies current section and opens index; actual button with expanded relationship owned by Radix |
| Next destination | Separate named native link to next section, or first at end; no nested interactive elements |
| Floating index | Portalled named non-modal Popover dialog with ordered native links and decorative Pixel markers; pending OQ-2 |
| Edge | Existing ProgressBar `size="sm" edge`, unnamed/decorative; host supplies equivalent text |

`@radix-ui/react-popover`, `@radix-ui/react-collapsible` and `@radix-ui/react-dropdown-menu` are direct dependencies, NavigationMenu is not (`packages/ui/package.json:30-40`). Recommend existing Popover for portal, positioning, dismissal and focus; its dialog semantics and cyclic Tab must be accepted explicitly and verified with navigation landmarks. NavigationMenu better names navigation but is not installed and needs separate dependency approval; Collapsible is in-flow and lacks floating positioning/portal; DropdownMenu imposes menu interaction on navigation. No bespoke replacement for Radix focus or keyboard. Link is a candidate where its approved styling and semantics fit, not a promise that every row composes it. `Icon` supplies decorative `arrow-down`; planned Pixel supplies the state cue. `Kbd` can document a host shortcut but never registers one.

Retain stable public `eg-section-nav`; legacy `__*` and `.is-*` selectors remain for existing consumers, not new part API. Surface and `surfaceVariants` are exported (`packages/ui/src/primitives/surface/types.ts`); investigate their overlay recipe for pill and panel, respecting existing Popover's own Surface. No nested nav landmarks; portal may place the index outside the root nav, so use one distinctly named nav for the links and ensure no empty duplicate landmark. Final DOM placement remains part of OQ-2.

## 3. Public API

Proposed only, subject to owner decisions. Item ids are stable unique non-empty strings; labels and same-document hrefs are non-empty and consumer-localized. At most one `aria-current` is rendered. No Pulso content is supplied.

| Prop | Type | Contract |
| --- | --- | --- |
| `label` | `string` | Required localized navigation landmark name. |
| `items` | `{ id: string; label: string; href: string }[]` | Required ordered section links; empty renders no controls. Host provides valid destinations. |
| `activeId` | `string` | Required host-designated item id; if unmatched, no current marker and no next destination; no implicit first selection. |
| `value` | `number` | Required scroll percentage 0–100, forwarded to ProgressBar; finite values clamp, non-finite is indeterminate. Host exposes equivalent progress text. |
| `hidden` | `boolean` | Native `hidden` attribute on root; host controls away state, no separate `away` prop. Default absent/false. When hidden, close panel and remove controls from focus; host must move focus to a safe visible target before hiding. |
| `onNavigate` | `(item, event: MouseEvent<HTMLAnchorElement>) => void` | Optional link activation notification, original event; native navigation unless host prevents default. |
| `open`, `defaultOpen`, `onOpenChange` | `boolean`, `boolean`, `(open: boolean) => void` | Optional Radix Popover controlled/uncontrolled contract, default closed; controlling host acknowledges requests. Do not switch mode mounted. |
| `className` | `string` | Root outer placement only; no paint, part or arbitrary override. |

Required localized accessible names for disclosure and destination must be supplied by the consumer; exact API shape is pending OQ-4, not a fabricated default. No scroller, listeners, dynamic class interpolation, automatic smooth scroll, router interception, public ref or `asChild`. Inherit compatible `ComponentPropsWithoutRef<'nav'>` only where a root nav is retained after OQ-2; omit children, role, conflicting naming and dangerous HTML. For modified/middle clicks preserve native behavior. Consumer owns stable IDs, localization, target existence and focus destination.

**Registry:** looked up canonical `skills/_shared/prop-naming.json` and `docs/prop-naming.md` by meaning/name/aliases. `label` → approved `accessible-name`; `items` → `collection-items`; `value` → `primary-value`; `onNavigate` → `navigation-intent`; `open`, `defaultOpen`, `onOpenChange` → `open-state`, `initial-uncontrolled-open`, `open-change`. `hidden` is native. Proposed new `active-section-id` / `activeId: string`: host's current section identity, not the `active-row` data-table row or the `primary-value` progress measurement. Pending independent convention approval; no registry edit or claimed new source usage. Labels for controls need a separate lookup when their API is selected. Inspected `NavListProps` at `packages/ui/src/molecules/nav-list/types.ts` SHA-256 `189b8cdce8ba0900cc1f66d24e9101f06c1250ceb004fb3ade0e036a0271c5f6`; `PopoverProps` at `packages/ui/src/molecules/popover/types.ts` SHA-256 `f5c4d5fd52630fba8d7bbebb433642b5fc5d7c33de8fe832257376829c4dfe96`; `ProgressBarProps` at `packages/ui/src/atoms/progress-bar/types.ts` SHA-256 `24333aa44912ecce88ce5e0bf27f04ccf838a6ee0c1b723b01574cbbf4c67a6b`. No source revision for an unimplemented SectionNav is invented.

## 4. Behavior

| Input/action | Proposed result |
| --- | --- |
| Host changes active id/value | Update current link, number and marker states and edge; never scroll or move focus. |
| Disclosure click/keyboard | Radix toggles index; Escape closes and restores focus to its visible trigger; outside interaction follows Radix. |
| Activate section link | Native anchor goes to supplied destination; optional callback; close index without forcing focus back over the destination. Verify Radix's default focus behavior and any permitted focus handler before adoption. |
| Activate next | Native link points to next item; last wraps to first. No device-dependent action change. |
| Host hides | Close/unmount index, avoid offscreen tab stops; host first relocates focus if needed. Controlled open requires host acknowledgement. |
| Empty/unmatched | Empty has no controls; unmatched has no next/current; do not guess an active section. |

Recommend no timed hover opening and no built-in global Alt shortcuts. Primary click on the current-label control changes from source desktop next behavior to explicit disclosure; next remains adjacent and discoverable on all input types. Host may offer separately documented shortcuts after conflict and focus-scope review, without claiming SectionNav registers them. No document-level keyboard, scroll or resize listeners. The web source uses scroll threshold 45%, footer threshold 75%, 2s hover and device-dependent click (`SectionNav/README.md:14-42`); those are source facts, not proposed defaults.

## 5. Accessibility

Named navigation, native links, `aria-current="location"` on exactly the active section (alternative `true` in OQ-6), accessible localized disclosure and next-destination names; number/label provide a non-color cue, Pixel and arrow decorative. Popover's trigger relationship, Escape, focus and portal stay Radix-owned; its named dialog and cyclic Tab need explicit review, including whether link activation and close return conflict with target focus. Native Tab/Enter, no menu roles or invented arrow navigation. Focus indicator uses existing focus tokens; minimum 44px coarse-pointer target. Hidden controls must not retain focus; host must coordinate transitions. No automatic live announcements; equivalent progress text is host-owned. Validate real screen readers, visible focus, reflow and contrasting backgrounds; no conformance is claimed.

## 6. Appearance

Floating pill and index use Material overlay semantics: `--color-surface-overlay`, `--blur-overlay`, saturation 150%, strong hairline, edge and elevation-3 tokens; solid `--color-surface-2` with no backdrop filter for reduced transparency and unsupported backdrop filters (`docs/MATERIAL.md` recipes; `packages/ui/src/primitives/surface/types.ts`). Reuse approved Surface/Popover where feasible without layering overlay twice; pill-specific composition and any changed recipe remain pending approval. Existing source shows 52px pill and 46px at ≤520px; recommend a SectionNav-local ≤520px viewport rule, explicitly approved before use, not a nonexistent default `md:`. Test 519/520/521, touch targets, zoom and safe-area placement. Fixed bottom-right position and stacking must not collide with host UI. Token-backed static CVA, per-part `cn()`, no hardcoded appearance or unapproved inline geometry; ProgressBar owns its separately approved custom property. Motion reduced: instant state changes, no transform/transition; host avoids smooth scrolling when reduced motion is requested.

**Legacy collision:** `packages/ui/src/styles/legacy/bundle.css:557-637` assigns root fixed right/bottom, flex, gap, transition and `::before` bridge, plus hover/open/away, old part geometry, transform and focus; `:1758` and `:1783` add number and reduced-transparency overrides. Preserve all old CSS. A future plan must locally neutralize root legacy position/layout/transition and pseudo-element before applying approved positioning, use distinct internal markers (not legacy `__*`/`.is-*`), and verify actual cascade including unlayered legacy, shipped CSS, pseudo-element and reduced-transparency. Static utility order and `twMerge` alone are not proof. Six mandatory files: `types.ts`, `useSectionNav.ts`, `SectionNav.tsx`, test, stories, `index.ts`; no extra internal module. **No stylesheet** if utilities can safely neutralize legacy; otherwise stop for a specific meaningful stylesheet role and plan approval. `className` supports outer layout only; no universal merge precedence.

### Expected-design visual references

- VIS-01 [1280 board](section-nav--variants--1280--dark.png), SHA-256 `dd1f700ace732dba694fb645815b647bdada135b3a7902c64d2db86959492214`: interactive canvas, open index, last section and button hover.
- VIS-02 [390 board](section-nav--variants--390--dark.png), SHA-256 `9155ebdfb04d3dbdda9e5ff80fca20dd21110f32d6b29018ff3ca2225624e12b`: same examples on narrow board.

Parent-supplied Foundation preview capture, source SHA-256 `663fcd9e38503c4b00910bd1c63a1770ad536510199d840c8e8a3d805a645063`; `capture-raw.json` and `capture.json` record provenance. Chromium headless shell 1243, 1280×1400 and 390×1400, DPR 2, dark, en-US, reduced motion no-preference, animations disabled, loaded fonts, `.pv` crop, 2026-11-03. Static board is not real runtime or responsive/accessibility proof. Expected-design adoption pending; visual conformity **Not evaluated**.

## 7. Acceptance criteria

All checks below are planned, not observed, and depend on owner choices.

| ID | Observable rule | Planned check |
| --- | --- | --- |
| SN-01 | Named region, native ordered links, unique current location, Pixel state not sole cue | Public role/name render tests, current and empty/unmatched cases |
| SN-02 | Native disclosure, Radix dialog relationships, Escape, safe focus return, link activation and portal | Keyboard and real-browser/AT integration, including focus after anchor navigation |
| SN-03 | Next advances, last wraps, modified clicks native; no device-specific action | Interaction tests and browser pointer/touch |
| SN-04 | Host controls current/value/hidden, no listeners; hidden removes focusable controls | Rerender, focused hide and controlled-open tests |
| SN-05 | Percent clamping/indeterminate, decorative edge and supplied progress text | Existing ProgressBar integration tests, 0/50/100/non-finite |
| SN-06 | Correct ≤520 boundary, 44px targets, safe area, zoom and no overflow | Built CSS and real browser 519/520/521, 200/400% |
| SN-07 | Overlay solid fallback, focus, reduced motion and legacy neutralization | Shipped stylesheet browser computed styles, pseudo-element and media emulation |
| SN-08 | No global shortcut/hover timer, supported className and consumer React 18/19 | Behavioral tests, metadata, built CSS and packed consumers |

## Blocking decisions for the owner

| ID | Question / evidence | Recommendation |
| --- | --- | --- |
| OQ-1 | Catalog Link only (`scripts/catalog_data.py:101`) versus Foundation MenuList + Pixel + ProgressBar + Icon (`SectionNav/README.md:5-13`)? | Correct composition later to navigation links/index, planned Pixel, ProgressBar and Icon; investigate Popover and Surface. MenuList is a Foundation name, not a directly reusable Menu action list; NavList's current schema cannot express markers/current location. No catalog edit now. |
| OQ-2 | Which primitive for floating navigation? `packages/ui/package.json:30-40`; `popover/types.ts`; `nav-list/types.ts`. | Recommend installed Popover, **conditional** on accepting named dialog and cyclic Tab and proving portal/landmark/focus behavior. NavigationMenu is not installed; Collapsible lacks floating portal; DropdownMenu uses menu semantics. If dialog behavior is unacceptable, select NavigationMenu and separately approve dependency and verify its actual behavior; no homegrown focus engine. |
| OQ-3 | Keep 2-second hover opening? (`SectionNav/README.md:20-23`; `preview.html`). | Replace with explicit click/keyboard disclosure, no hover timer. WCAG 2.2 SC 1.4.13 requires hover/focus content to be dismissible, hoverable and persistent: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html . This recommendation is not a claim that any timed hover automatically violates WCAG. |
| OQ-4 | Desktop click = next and Alt+Up/Down? (`SectionNav/README.md:29-37`). | Separate always-consistent disclosure and next controls; do not bind global shortcuts by default. Browser/OS/AT conflicts and discoverability vary; host may opt into documented page-scoped shortcuts after testing, avoid editable controls and provide visible Kbd hint only for actual bindings. Owner must select localizable control-name API and behavior. |
| OQ-5 | Internal scroll tracking or host state? (`SectionNav/README.md:14-19`; `preview.html` script; `docs/CATALOGACION.md` web amendment). | Host supplies active id, percent and native hidden; no scroll listeners. Effects owns choreography. Host coordinates hiding and focus; no 45%/75% thresholds embedded in ui. |
| OQ-6 | Which landmark/current/focus model? (`SectionNav/README.md:39-42`; `popover/types.ts`). | Named navigation, `aria-current="location"` (or `true` if owner prefers); no nested nav. Radix Escape returns focus to trigger, except actual link navigation must not be overridden. Test dialog+portal and AT before plan. |
| OQ-7 | Edge semantically announced or decorative? (`packages/ui/src/atoms/progress-bar/types.ts`; `docs/components/progress-bar/v0.2/spec.md`). | Existing unnamed ProgressBar sm edge, value in percent (fraction ×100); host exposes equivalent text. No invented progress semantics or separate `--p` API. |
| OQ-8 | Compact breakpoint and motion? (`SectionNav/README.md:19,42`; `packages/tokens/src/theme.css:11-13`). | Approve local ≤520px viewport boundary; no assumed md token. Keep 44px touch targets; disable transitions/transforms and host smooth scrolling under reduced motion. |
| OQ-9 | Overlay recipe and legacy collision? (`docs/MATERIAL.md` recipes; `packages/ui/src/styles/legacy/bundle.css:557-637,1758,1783`). | Reuse Surface overlay / Popover once, require pill-specific composition approval and solid fallback, locally neutralize legacy root and bridge, preserve old consumers; verify real cascade. No new tokens or dependency implied. |

Approval of this exact snapshot and visuals would approve only the contract, not convention, dependency, catalog, implementation plan or implementation. Asset publication and accessible immutable URLs remain separate parent actions, with downloaded bytes verified first.
