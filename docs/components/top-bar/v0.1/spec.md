# Component contract — TopBar

- **Version / status:** 0.1 — **Proposed**, draft for owner review, not approved or implementation-ready.
- **Approval / recovery:** Pending explicit owner decision on this exact payload and VIS-01/VIS-02. Catalog classification is approved, not this API or a plan: `docs/components/web-catalog/v0.1/owner-approvals.md`; capture authority: `odd/tasks/web-catalog.md` L6, L15, L25.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: 12dc99c75b4b5e07e3772fd55f0c0c413339f64c6fe9ab0cd58404640fa74e82`; `visualHashes: VIS-01 → 4472d21dd0d5f12375972ca309a75a0d067ce63278e6e36eb4b741e2a961f25b; VIS-02 → dbdd553b8f813cf5792d7932ac6fb07c37031c71eb73ca4b759b2c7ac7240a7a`; `approvalReference: Pending`; `canonicalIssue: Pending`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of UTF-8 bytes from the exact whole heading line `## 1. Purpose and scope` through EOF, LF and final newline included. Tracking metadata above is excluded.

## 1. Purpose and scope

Propose a reusable site-wide page-navigation organism in `@egdev/ui`, not a page, scroll director, router, search palette, account implementation or mobile drawer. Logo, destination labels/URLs, current page, search and account content belong to the consumer. One TopBar per page is the intended usage; SectionNav is separate page-section navigation. The web-consumer amendment permits web building blocks without domain defaults (`docs/CATALOGACION.md` web amendment).

**Catalog and alternatives:** `scripts/catalog_data.py:99` classifies TopBar as organism, `@egdev/ui`, NavigationMenu, Logo + SearchTrigger + UserMenu. Reuse/variant: TabBar is an in-flow bottom navigation with icons, not a fixed site header; Sidebar is a side panel. Link, Logo and SearchTrigger individually do not arrange the region. Compose: reuse consumer-supplied elements in one generic structural organism rather than duplicate the responsive chrome in each view. Extract: no existing exported organism contains this header. New generic composition is the approved catalog direction; the Radix basis is still OQ-1. `packages/ui/src/index.ts:24-29,96-97,137` exports Logo, SearchTrigger, Sidebar, TabBar and AppShell but no TopBar, MobileMenu or UserMenu. `docs/components/web-catalog/v0.1/cataloging-draft.md:31,53,59` makes both menus recipes, not exports. These inspected working-tree exports differ from older normative availability prose; they do not prove visual compliance.

**Source:** Foundation root `/home/egdev/proyectos/egdev-website/egdev-foundation/`, read-only. `design-system/components/TopBar/README.md:1-43` describes the bar; `preview.html:25-35` shows four illustrated states; `reference-web/pulso-source.html:740-774` shows real header, links and mobile navigation; `design-system/DECISIONES.md` navigation decisions separate page links from sections. `design-system/CONTRACT.md` inventories TopBar and SectionShell. The Foundation preview is visual evidence, not an implementation contract or proof of accessibility.

## 2. Anatomy and composition

| Part | Proposed responsibility | Element / content |
| --- | --- | --- |
| Root | viewport-top header and Material state | Native `header.eg-topbar`, no new landmark role |
| Inner row | constrain content and preserve logical order | Internal wrapper: brand, navigation, utilities |
| Brand | identity/home destination | Required consumer-supplied named link, e.g. Logo with `href` |
| Page navigation | named, ordered destinations | Native `nav` with list of native links, consumer-owned current page |
| Search | full and compact presentations | Consumer-supplied separate full and compact search elements; only one visible/focusable at a time |
| User menu | optional account control | Consumer-supplied Menu recipe, no embedded user data |
| Mobile trigger | optional compact-only control | Consumer-supplied Dialog trigger wired to separately composed MobileMenu recipe |

**Radix:** native links are recommended for the observed flat page list; `@radix-ui/react-navigation-menu` is not a direct dependency (`packages/ui/package.json:24-58`); a flyout requirement would need that individual package and explicit dependency approval, never a homegrown menu engine. `@radix-ui/react-dialog` and `@radix-ui/react-dropdown-menu` are declared (`packages/ui/package.json:33-34`); the supplied Dialog/Menu compositions own keyboard, focus, dismissal and portals. Radix Slot `asChild` belongs on appropriate composed triggers, not the TopBar root. See OQ-1 and OQ-3. No direct Radix behavior is invented here.

**Markers:** retain stable public `eg-topbar`; old `eg-topbar__*`, `.is-scrolled` and `.is-open` are legacy selectors, not newly promised visual engines. Do not remove/change legacy CSS or consumers. Root alone is a public marker; proposed parts are composition APIs, not selector override APIs.

## 3. Public API

Proposed, conditional on OQs. Types use `ReactNode` for supplied composition; no implicit cloning, markup parsing, authentication, routing or built-in labels.

| Prop / event | Type | Required | Default / contract |
| --- | --- | --- | --- |
| `label` | `string` | yes | Non-empty accessible name of the page-navigation landmark; consumer localizes. |
| `items` | `TopBarItem[]` | yes | Ordered destinations, may be empty; no hardcoded pages. Each `{ id: string; label: string; href: string; 'aria-current'?: 'page' }` has unique non-empty key and non-empty label/href; host marks at most one current link. |
| `onNavigate` | `(item: TopBarItem, event: MouseEvent<HTMLAnchorElement>) => void` | no | Notifies link click; consumer may prevent default for unmodified primary routing. No route interception otherwise. |
| `children` | `ReactNode` | yes | Composition parts `TopBarBrand`, `TopBarSearchFull`, `TopBarSearchCompact`, `TopBarUserMenu`, `TopBarMobileTrigger`; brand required, other parts optional and each appears at most once. |
| `data-state` | `'transparent' \| 'glass'` | no | Native data attribute, absent means transparent; host supplies glass whenever appropriate, including while a supplied mobile dialog is open. Not a scroll listener or menu state. OQ-2. |
| `className` | `string` | no | Root outer layout/stacking only; no paint or arbitrary child overrides. |

Each composition part takes `children: ReactNode`; brand must contain exactly one named home link, each search part exactly one named launcher, user and mobile parts each one independently operable named control. Consumer ensures the two search launchers invoke equivalent functionality. Missing optional parts leave no placeholder. The component does not enforce arbitrary descendant semantics at runtime; this is a consumer contract. Parts expose no `className`, ref or `asChild`; no unsupported nesting or interactive-within-interactive markup. Brand and utilities remain outside `nav`.

**Naming lookup:** canonical `skills/_shared/prop-naming.json` and `docs/prop-naming.md`, searched by semantic meaning, name and aliases. `label` → approved `accessible-name`, `items` → approved `collection-items`, `onNavigate` → approved `navigation-intent`. Native `children`, `className`, `data-state`, item `id`, `href`, `aria-current` are not own conventions. `product-identity`/`product` is not used: the brand slot takes a complete link, not its structured node/name/href shape. `trailing-actions`/`actions` is not used for mixed search, account and mobile slots; `compact-presentation`/`compact` describes a launcher, not TopBar responsiveness; `slot-composition`/`asChild` is not a generic slot name. No new convention or exception is proposed. Existing matching source: `packages/ui/src/organisms/tab-bar/types.ts`, `TabBarProps`, whole-file `sha256:0ea79ce6d91c30838af890c520786a1d1cd866b1d310b3579eff3d09e23ad672`; `packages/ui/src/atoms/search-trigger/types.ts`, `SearchTriggerProps`, `sha256:31b3eff9676b1a6646a39ed20eea22a30df4fa29741bae5d38bd89434b7d95fc`. No TopBar source exists; do not invent its usage revision or edit the registry. Convention approval is independent of spec approval.

**Native / compatibility:** root inherits `ComponentPropsWithoutRef<'header'>`, omitting `children`, `role`, `dangerouslySetInnerHTML` and conflicting own fields; forward compatible native attributes/events, including `data-state`. No ref, `asChild`, own `open`, `menuOpen`, `scrolled`, logoSrc, route detection or scroll callbacks. New named exports and six implementation files require a separately approved plan; existing exports and legacy consumers remain untouched. React 18/19 compatibility is a future packed-consumer gate, not an observed result.

## 4. Behavior

| Input / action | Proposed observable result | Event |
| --- | --- | --- |
| Absent `data-state` or `transparent` | Transparent header; host owns legible backdrop | none |
| Host sets `data-state="glass"` | Material overlay and solid reduced-transparency fallback; no listener or implicit open-state inference | none |
| Width ≤900 CSS px of the bar container | Hide desktop nav and full search; show compact search and mobile trigger, without hidden tab stops | none |
| Width >900 CSS px | Show desktop nav and full search; hide compact search and mobile trigger, without hidden tab stops | none |
| Host changes current page | Only supplied current link has `aria-current="page"`, with non-color underline; no focus change | none |
| Link activated | Native anchor behavior; optional callback receives item and click event | `onNavigate` |
| Mobile or user control activated | Supplied Dialog/Menu recipe handles its own state, Escape, focus and portals; host may drive glass separately | owned by supplied recipe |

No forced maximum link count, mutation, item truncation, automatic scroll threshold, menu-open coupling, keyboard handler or global shortcut. Consumer is responsible for equivalent desktop/mobile destinations and search actions, meaningful names, unique items/current state and testing long localizations. When a resize hides an active trigger or an open dialog, focus relocation/closure is **not specified**; host must manage it with its Dialog composition and validate it. Do not promise automatic focus restoration to a hidden trigger. Empty links give an empty named nav at desktop; when compact, the nav and its links are hidden.

## 5. Accessibility

The page-level `header` is the banner in the correct document context; the inner `nav` gets `label` and contains a list of ordinary links, not tab/menu roles. Distinguish it from other navigation landmarks; consumer supplies `aria-current="page"` on at most one item. Preserve native Tab/Shift+Tab order and Enter activation; no arrow-key navigation is invented for ordinary links. Logo and controls have visible focus; indicator supplements color. No live announcement is created. Supplied icon-only controls need accessible names and at least 44px touch target on coarse pointers. Dialog's trigger/content relationships, Escape, modal focus, portal and return focus are the composed recipe's responsibility, with resize caveat above. Search shortcut display must correspond to a real host-registered binding. Validate landmark names, contrast, zoom/reflow and keyboard with real assistive technology; no accessibility conformity is claimed.

## 6. Appearance

- **Material:** foundation README's transparent-to-55%-glass recipe (`TopBar/README.md:24-27`) differs from current mandatory Material overlay (`docs/MATERIAL.md:14,54-59`). Recommend transparent at top only over a host-provided legible backdrop; glass uses `--color-surface-overlay`, `--blur-overlay` with saturate 150%, strong hairline and edge/elevation tokens; reduced transparency uses solid `--color-surface-2` and no backdrop filter. The overlay is conceptual; a TopBar-specific compliant recipe and transparent exception require owner approval, not a Gauge exception or a Surface clone. `--blur-glass` exists (`packages/tokens/src/theme.css:379-382`) but is not the Material overlay blur. Check contrast over host backgrounds and lack of backdrop-filter support. Reduced motion removes transitions.
- **Geometry:** proposed fixed top and viewport width with navigation layer; inner row height `--nav-height`, max width `--content-max`, padding `--gutter` (`packages/tokens/src/theme.css:473-478`). Host reserves clearance once; SectionShell's own compensation is pending its separate D1 contract, not an already approved API. Fixed positioning and overlay stacking require browser verification; do not make the viewport-fixed root itself the query container without proving containment/containing-block behavior.
- **Compact threshold:** Foundation uses named container query ≤900px (`TopBar/README.md:28`, `packages/ui/src/styles/legacy/bundle.css:525-528`), not viewport `md`. Request a TopBar-local static container-query threshold and documented container structure; no token or dependency added. `docs/components/community-card/v0.1/responsive-breakpoint-amendment.md` approves 48rem only for that component; it does not authorize this 900px threshold. Verify 899/900/901px container widths, desktop and narrow embedding, and real compiled CSS. This is an explicit approval prerequisite.
- **Cascade collision:** `packages/ui/src/styles/legacy/bundle.css:492-531` assigns `.eg-topbar` fixed positioning/container and legacy transition; `.is-scrolled`/`.is-open` add paint/shadow/blur, `__in`, `__links`, `__link`, pseudo-element, `__tools`, search/menu and drawer selectors add layouts, hover, active/focus and container behavior; `:1782-1783` applies reduced-transparency paint. Keep legacy intact. In a later plan use only the stable root marker and distinct internal markers; explicitly neutralize root's legacy fixed/container/border/transition effects locally with static utilities in the intended cascade, then apply the approved recipe/state. Avoid legacy `.is-*` and `__*` markers in new markup. Browser tests must verify actual computed style with `@egdev/ui/styles.css` loaded, including layer precedence and pseudo-elements; class string order or `twMerge` alone is insufficient. Exact neutralization and any necessary compliant stylesheet remain pending approval, not an implementation instruction to edit legacy CSS.
- **Composition / files:** token-backed static CVA in `types.ts` and per-part `cn()` in hook; root `className` merges last only for outer placement/stacking, not appearance, without universal `twMerge` precedence. No inline appearance, hardcoded tokens, dynamic class interpolation or extra module. Six meaningful files: `types.ts`, `useTopBar.ts`, `TopBar.tsx`, `TopBar.test.tsx`, `TopBar.stories.tsx`, `index.ts`. **No stylesheet** is recommended if approved container query and legacy neutralization compile as utilities; if not, stop and request explicit meaningful stylesheet role/plan approval. No token, dependency or catalog change is authorized here.

### Expected-design visual references

| ID | Image and English alt text | Scenario / status |
| --- | --- | --- |
| VIS-01 | [Desktop-width Foundation board](top-bar--variants--1280--dark.png): labelled transparent desktop header, glass desktop with user menu open, compact closed header and compact open mobile menu. | Proposed; SHA-256 `4472d21dd0d5f12375972ca309a75a0d067ce63278e6e36eb4b741e2a961f25b` |
| VIS-02 | [Narrow-viewport Foundation board](top-bar--variants--390--dark.png): the same four labelled preview examples arranged in a narrow board. | Proposed; SHA-256 `dbdd553b8f813cf5792d7932ac6fb07c37031c71eb73ca4b759b2c7ac7240a7a` |

Parent-provided, read-only capture of Foundation `preview.html` SHA-256 `b015059f41fb5c5b58cc06755e956e29a9e0c1bca31b6b4a75f8ee973afd25c0`; `capture-raw.json` retains capture records and `capture.json` indexes provenance. Chromium headless shell build 1243, viewport 1280×1400 and 390×1400, DPR 2, dark, `en-US`, motion no-preference, screenshot animations disabled, fonts loaded; `.pv` board crop, 2026-11-03. Original blob logo resolved to `reference-web/assets/logo-wordmark.svg`; authored token and bundle styles loaded. Desktop frames inside the board are scaled preview frames, not native viewport responsive proof. Static examples and source screenshot do not prove keyboard, real scroll, transparency fallback, image publication or DS implementation. Expected-design adoption is pending; visual conformity **Not evaluated**.

## 7. Acceptance criteria

All following checks are planned, not observed; subject to owner resolution of OQs.

| ID | Promise | Planned method / story |
| --- | --- | --- |
| TB-01 | Named header/nav/list, supplied links, unique current page, native attributes and no nested landmarks | Role/name DOM tests; `Default`, `CurrentPage` |
| TB-02 | Native click/Enter and optional callback; modified and middle clicks remain native; host controls current state | Interaction tests and real browser; `CurrentPage` |
| TB-03 | Transparent default, host-driven glass, no scroll listener, solid reduced-transparency and reduced motion | Rerender tests and browser computed styles/media; `Glass`, VIS-01/02 |
| TB-04 | Consumer brand, full/compact search, account and mobile trigger composition; hidden branch has no tab stops and absent optional slots leave no placeholder | Public render/keyboard tests; `ComposedControls` |
| TB-05 | Correct ≤900/>900 container switching, including 899/900/901 and no overflow, 200%/400% zoom | Built CSS + real browser; `Compact`, VIS-01/02 |
| TB-06 | Supplied Dialog/Menu owns accessible names, portal, focus/Escape; resize caveat is documented and host handles safe return | Real browser integration with recipes; `MobileDialog` |
| TB-07 | Fixed top, nav-height clearance once, focus visibility and legacy neutralization with real shipped stylesheet | Packed-consumer browser geometry/cascade, scrolled and reduced transparency |
| TB-08 | Root layout merge only, stable marker, no new `.is-*` classes, no unsupported public part override | DOM/type tests and compiled CSS inspection |
| TB-09 | English own-prop JSDoc/controls, static CVA scan, built CSS and React 18/19 consumer without Tailwind | Metadata pipeline, package/consumer builds and browser Controls |

**Closure:** owner OQ-1–OQ-6, exact payload/visual approval, Material/transparent recipe, local breakpoint, asset handoff and separate plan remain pending. No code, registry, catalog, dependency, token or remote mutation follows from this proposal. Local images are not verified publicly accessible; publication must verify downloaded image bytes against the hashes before linking.

## Blocking decisions for the owner

| ID | Question and evidence | Recommendation |
| --- | --- | --- |
| OQ-1 | Flat native links or Radix NavigationMenu? Catalog names the latter (`scripts/catalog_data.py:99`); Foundation has flat anchors (`reference-web/pulso-source.html:740-749`); NavigationMenu is absent from `packages/ui/package.json:24-58`. | Native `nav`/links with `aria-current`; no bespoke keyboard or dependency. If flyouts are required, select Radix NavigationMenu and separately approve its individual dependency; never silently add it. |
| OQ-2 | Host `data-state` or a new `scrolled` prop, and which transparent/glass recipe? Foundation uses scroll >24 and `.is-open` (`TopBar/README.md:19-33`); Material requires overlay and solid fallback (`docs/MATERIAL.md:14,54-59`). | Host supplies native `data-state`, no listener; explicit glass even for open dialog. Approve transparent state only with host contrast obligation and approve the specified Material overlay recipe/fallback separately; do not copy Foundation's 55% glass. |
| OQ-3 | Built-in search/user/mobile logic or consumer parts? Foundation embeds them (`TopBar/README.md:5-12`), while `docs/components/web-catalog/v0.1/cataloging-draft.md:31,59` calls UserMenu and MobileMenu recipes. | Consumer supplies named search variants, account and Dialog trigger; recipe owns behavior, host owns data and equivalent actions. No UserMenu/MobileMenu exports. |
| OQ-4 | Keep Foundation's ≤900px container query or adopt an existing viewport breakpoint? (`TopBar/README.md:28`; `packages/tokens/src/theme.css:13`; `docs/components/community-card/v0.1/responsive-breakpoint-amendment.md:3-7`). | Approve a TopBar-only static ≤900px container query; 48rem approval is not transferable and `md:` is not established. Confirm cascade and exact boundary in real build. |
| OQ-5 | Fixed header owned by TopBar or positioning/clearance delegated entirely to host? (`TopBar/README.md:32`; `packages/tokens/src/theme.css:473-478`). | Keep fixed viewport-top identity but let host reserve `--nav-height` exactly once, coordinating with separately proposed SectionShell; confirm stacking and clipping in browsers. |
| OQ-6 | Header plus named inner nav and host-supplied current link, or another landmark model? (`TopBar/README.md:36-38`; `reference-web/pulso-source.html:740-749`). | Native page-level header + distinctly named inner nav; current link uses `aria-current="page"`; supplied controls outside nav, no invented menu/tab role. |
