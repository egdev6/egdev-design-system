# Component contract — TopBar

- **Version / status:** 0.2 — **DRAFT**, awaiting exact owner approval (G4); A5/G1 remains proposed. No additional gate is introduced. This draft authorizes no implementation.
- **Approval / recovery:** Pending for this exact payload and identified visuals. The historical [v0.1 spec](../v0.1/spec.md) was approved in [#292](https://github.com/egdev6/egdev-design-system/issues/292#issuecomment-6597377277); its canonical payload hash `12dc99c75b4b5e07e3772fd55f0c0c413339f64c6fe9ab0cd58404640fa74e82` is explained by the [erratum](../../web-catalog/v0.1/layer-d-batch-1-hash-errata.md). Its Proposed header is historical. Spec approval and implementation-plan approval are separate.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 → Pending; VIS-02 → Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/292`; `latestPublishedComment: Pending` for this snapshot.
- **Hash definition:** SHA-256 of UTF-8 bytes from the exact heading `## 1. Purpose and scope` through EOF, LF endings and final newline included; tracking metadata above is excluded. Approval must identify the version, digest and visual hashes.

## 1. Purpose and scope

TopBar is a fixed site-wide page-navigation organism in `@egdev/ui`; one per page is intended. It is not a page, router, scroll director, search palette, account implementation, mobile drawer or SectionNav. The host supplies brand, destinations, current page and controls, not domain defaults.

**Delta from v0.1 (A5 / S5):** replace the current page's text underline with a Tabs-like brand pseudo-element and default ink, and increase link minimum height to 44.8px. This is visual parity, not dimensional or semantic parity. All other v0.1 promises remain; v0.1's non-color underline becomes the non-color indicator. No prop, exported symbol, item order, state model, breakpoint, shared Tabs recipe or keyboard behavior changes. [A5](../../web-catalog/v0.2/visual-amendments.md) and [U5](../../web-catalog/v0.2/implementation-plan.md) are proposed, not approved or implemented.

**Cataloging:** retain and locally amend the existing organism. TabBar is bottom navigation, Sidebar a side panel, and individual Link/Logo/SearchTrigger do not arrange a header. Composition with supplied controls remains appropriate; extracting a shared Tabs indicator would widen Tabs and is deferred, not this amendment. Evidence: `packages/ui/src/organisms/top-bar/{types.ts,useTopBar.ts,TopBar.tsx,index.ts}` and `packages/ui/src/index.ts` contain and export the component and parts; `packages/ui/src/molecules/tabs/types.ts` supplies the referenced recipe. Working-tree evidence does not establish visual compliance; the older shared availability prose conflicts with these observed exports and is not evidence of retirement or migration.

## 2. Anatomy and composition

| Part | Responsibility and element | Content |
| --- | --- | --- |
| Root | Fixed native `header.eg-topbar` | Internal query container and row |
| Brand | `TopBarBrand`, div before nav | One consumer-owned named home link, required |
| Navigation | Named native `nav > ul > li > a` | Ordered supplied destinations, including an empty list |
| Full / compact search | `TopBarSearchFull` / `TopBarSearchCompact`, divs after nav | Optional separately supplied named launchers with equivalent action |
| User / mobile | `TopBarUserMenu` / `TopBarMobileTrigger`, divs after search | Optional named account control / Dialog trigger; supplied compositions own their behavior |

Parts must be direct children or inside fragments, each at most once. The hook traverses fragments, ignores null/booleans, warns in development for unknown or duplicate parts and missing brand, and retains the first instance. It does not inspect or enforce arbitrary descendants. Missing optional parts add no placeholder. Brand and utilities sit outside nav; avoid nested interactive elements. Stable `eg-topbar` is the only promised marker; do not introduce legacy `eg-topbar__*` or `.is-*` selectors or alter legacy consumers.

Native anchors are appropriate for flat page links, not Radix Tabs or NavigationMenu. Supplied Dialog/Menu own their Radix focus, portals, dismissal and keyboard; TopBar has no `asChild` composition or new dependency.

## 3. Public API

| Prop / event | Type | Required | Rule |
| --- | --- | --- | --- |
| `label` | `string` | Yes | Non-empty localized name of page-navigation landmark. |
| `items` | `TopBarItem[]` | Yes | Ordered, possibly empty. Each item has `id: string`, `label: string`, `href: string`, `'aria-current'?: 'page'`; host supplies unique non-empty IDs, meaningful non-empty labels and URLs, and at most one current page. |
| `onNavigate` | `(item: TopBarItem, event: MouseEvent<HTMLAnchorElement>) => void` | No | Notifies native link click; host may prevent default. No automatic routing. |
| `children` | `ReactNode` | Yes | Direct named parts; brand required. Each part accepts only `children: ReactNode`. |
| `data-state` | `'transparent' \| 'glass'` | No | Native attribute; absent means transparent. Host supplies state, including glass when desired for open mobile dialog. |
| `className` | `string` | No | Root outer placement/stacking only, not paint or child overrides. |

**Naming:** [registry](../../../../skills/_shared/prop-naming.json) and [generated reference](../../../prop-naming.md) consulted by meaning, name and aliases: `label` → approved `accessible-name`, `items` → approved `collection-items`, `onNavigate` → approved `navigation-intent`; unchanged usages, no new concept or exception. Reviewed source: `{path: packages/ui/src/organisms/top-bar/types.ts, symbol: TopBarProps, revision: sha256:91e9458fbbbec04c1525cd33d593b6e62b66ebd57f0524c91fee0be1a3594078}`. `children`, `className`, `data-state` and item native attributes are not new own conventions. `product-identity` describes structured product data, not the supplied brand link; `trailing-actions` excludes primary navigation and mixed utility slots. Convention approval is independent of spec approval; no registry write is proposed.

**Native and refs:** `Omit<ComponentPropsWithoutRef<'header'>, 'children' | 'role' | 'dangerouslySetInnerHTML' | 'label' | 'items' | 'onNavigate'>`; compatible remaining attributes/events reach the header, while role and dangerous HTML are stripped at runtime. No ref or `asChild` API. The host owns current state; there is no controlled/uncontrolled selection state. Existing named exports and legacy consumers remain unchanged. React 18/19 packed consumption is a planned check, not established by types alone.

## 4. Behavior

| Input / action | Result | Event |
| --- | --- | --- |
| Absent / transparent state | Transparent header; host supplies legible backdrop | None |
| Host sets glass | Overlay with reduced-transparency solid fallback; no scroll or menu-state inference | None |
| Container width ≤900px | Hide nav/full search; show compact search/mobile trigger without hidden tab stops | None |
| Container width >900px | Show nav/full search; hide compact search/mobile trigger without hidden tab stops | None |
| Host sets current item | Only supplied `aria-current="page"` anchors get current styling; no focus change | None |
| Activate link | Native navigation; host may prevent default | `onNavigate(item, event)` if supplied |
| Activate supplied control | Supplied Dialog/Menu owns interaction | Control-owned |

No link count cap, truncation, scroll threshold, route detection, global shortcut or arrow-key engine. Modified/middle clicks remain native. Host owns valid items, current-page uniqueness, equivalent desktop/mobile destinations and search, long localization, and safe handling of resize while an open dialog's trigger becomes hidden; automatic focus relocation or restoration to a hidden trigger is not promised. Empty items render an empty named desktop nav.

## 5. Accessibility

In the appropriate document context the native header is a banner; the named nav contains ordinary links, not tabs or menu items. Host supplies distinct landmark name and at most one `aria-current="page"`. Native Tab/Shift+Tab and Enter apply; no roving focus or arrow keys. The indicator provides a shape cue in addition to ink, and a visible focus outline remains independent of glow. No live announcement is introduced. Supplied icon-only controls need accessible names and ≥44px coarse-pointer targets. Host owns shortcut registration, backdrop contrast, and resize/focus coordination; Dialog/Menu retain their own relationship, Escape, portal and focus responsibilities. Real keyboard, contrast, reflow and assistive-technology verification remain pending.

## 6. Appearance

| Axis | Values / default | Rule |
| --- | --- | --- |
| Header state | transparent (absent or explicit), glass | Host-selected via `data-state`; no scroll listener |
| Link current state | host-supplied `aria-current="page"` or absent | Attribute styling, no mirrored state class |
| Size / variant | Not applicable | No public size or variant axis |

**A5 exact proposed link recipe:** preserve `text-label-default text-fg-secondary no-underline`, `hover:text-fg-default`, `aria-[current=page]:text-fg-default` and `focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring`. Add `relative inline-flex items-center min-h-14` (44.8px); indicator uses `after:absolute after:-bottom-px after:h-0.5 after:rounded-full after:inset-x-3`, `after:bg-transparent` and `aria-[current=page]:after:bg-fg-brand-default aria-[current=page]:after:shadow-glow-base` (`--shadow-glow-base`); height `0.5` is 1.6px. Preserve the Tabs indicator's `after:transition-colors motion-reduce:after:transition-none` and verify hover/focus/current computed styles against the applicable reused Tabs values without replacing TopBar's existing outline with Tabs' inset ring. Remove `aria-[current=page]:underline`; do not double the indicator with text decoration. Tabs uses `min-h-11` (35.2px); navigation deliberately uses `min-h-14` instead. Do not touch `tabs/types.ts` or share code now.

**Material and geometry:** retain existing transparent and glass recipes in `types.ts`: glass `--color-surface-overlay`, `blur(var(--blur-overlay)) saturate(150%)`, `--color-border-hairline-strong`, `--shadow-edge-strong` plus `--shadow-elev-3`; reduced transparency uses solid `--color-surface-2` and no backdrop filter. Transparent has no paint/filter/shadow; host ensures contrast. Reduced motion removes owned transitions. Fixed viewport-top header, row `h-[var(--nav-height)]`, `max-w-[var(--content-max)]`, `px-[var(--gutter)]`; host reserves clearance once. Internal container preserves the approved TopBar-local inclusive 900px boundary; check 899/900/901 and fractional widths and emitted CSS. No inline appearance, dynamic geometry or new token/dependency. Keep legacy stylesheet untouched; verify actual packed cascade, pseudo-elements and root neutralization, not class order alone.

**Class composition:** root alone accepts `className`, merged after CVA via `cn()` for placement/stacking; no public part className or arbitrary paint override. `twMerge` handles recognized conflicts, not every variant, selector or cascade layer; test supported merge and stable marker with shipped CSS. Consumer controls own their classes. Six meaningful files: `types.ts` recipes/types, `useTopBar.ts` partition/events/`cn`, `TopBar.tsx` JSX, `TopBar.test.tsx`, `TopBar.stories.tsx`, `index.ts` named exports. **No stylesheet**; no extra internal module. If utilities or shipped cascade cannot express the approved recipe, stop and propose a compliant role rather than invent CSS.

### Expected-design visual reference

Owner's “TopBar -> ajustar estilos de links [Image#14] podríamos hacerlo visualmente igual que tabs” is conversation provenance only, not a recoverable repository capture or approval. Historical v0.1 VIS-01/02 and their conditions are preserved in [v0.1](../v0.1/spec.md); they do not validate the changed indicator. Current implementation is not automatically expected design.

| ID | Image / scenario | Provenance and status |
| --- | --- | --- |
| VIS-01 | Pending: desktop current, hover and focus link, with neighboring non-current link | Expected-design source and capture authorization pending; 1280px planned |
| VIS-02 | Pending: compact composition and link target review | Expected-design source and capture authorization pending; 390px planned; see boundary blocker below |

Before capture, agree source/story, scenario and authorization; record actual browser/version, viewport/container, DPR, theme, fonts, motion/transparency, crop, date, tool and source version in `capture.json`, plus real PNG hashes and explicit scoped adoption, following [capture guide](../../../design/README.md). None exists for v0.2 here. Visual conformity **Not evaluated**; captures never replace behavior or accessibility checks.

## 7. Acceptance criteria

All checks are planned, not observed. Preserve all v0.1 TB-01–TB-09 promises, with its current-link underline interpreted as this proposed indicator rather than text decoration.

| ID | Promise | Planned check / story or visual | Evidence |
| --- | --- | --- | --- |
| TB-01 | Named banner/nav/list, supplied ordered/empty links, host current and native attributes | DOM role/name tests; Default, CurrentPage | Pending |
| TB-02 | Native click/Enter, callback and preventDefault, native modified/middle clicks, no focus movement on current update | Interaction and browser tests; CurrentPage | Pending |
| TB-03 | Transparent default, host glass, no listener, solid fallback and reduced motion | Rerender and packed computed styles; Glass | Pending |
| TB-04 | Five supplied parts, correct order and optional absence; hidden branch not tabbable | Public render and browser keyboard tests; ComposedControls | Pending |
| TB-05 | Inclusive 900px container switching and no overflow at zoom | Built CSS and browser 899/900/901 plus fractional boundaries, narrow/wide host; Compact | Pending |
| TB-06 | Supplied Dialog/Menu owns focus, Escape, portal; host handles resize caveat | Browser integration; MobileDialog | Pending |
| TB-07 | Fixed top, one host clearance, focus and legacy neutralization | Packed CSS/browser geometry and cascade | Pending |
| TB-08 | Stable root, layout-only merge, no unsupported part override or legacy markers | DOM/type and emitted CSS checks | Pending |
| TB-09 | English JSDoc/Controls, static CVA scan and React 18/19 consumption without consumer Tailwind | Metadata, builds, packed consumers and browser Controls | Pending |
| A5-AC1 | When exactly one item is current, exactly its anchor has the brand indicator and default ink; zero current means none | DOM attributes and own pseudo-element computed paint; CurrentPage, VIS-01 | Pending |
| A5-AC2 | Tabs indicator values and applicable hover/current ink match, focus remains visible; no current text underline | Packed browser computed pseudo-element/anchor styles, emitted CSS; VIS-01 | Pending |
| A5-AC3 | Desktop nav targets ≥44px and `min-h-14` resolves to 44.8px | Packed own-element geometry at 1280px; 390px case blocked below | Pending |
| A5-AC4 | Navigation stays native: no tab/menu role, aria-selected, roving tabindex or arrow handler; tab order unchanged | Public DOM/keyboard tests and browser; CurrentPage | Pending |

### Blocking evidence and choices

- **A5-AC3 versus v0.1 responsive behavior:** at a 390px-wide bar the desktop nav is hidden, so its anchor has no measurable visible target. Choose either (1) check the 44.8px TopBar anchor in a >900px container even when the viewport is 390px, if a valid fixture can provide it, while separately checking the consumer's compact control at 390px; or (2) revise A5-AC3 to measure TopBar links only when visible and check the supplied compact control separately. Do not silently claim both visible nav and compact behavior at a 390px container. Owner resolution is needed before finalizing that check; no new approval gate is asserted.
- **A5-AC1 cardinality:** v0.1 permits zero current items and empty lists. The exactly-one assertion applies to the single-current fixture; if a universal exactly-one requirement was intended, owner must choose between preserving zero-current/empty cases and explicitly changing that API promise.
- **Visual evidence:** agree an accessible expected-design source and capture conditions, then authorize the capture and adopt exact visuals with G4; alternatively supply a recoverable owner image with its available provenance. Image#14 alone has no recoverable bytes or conditions here.

### Spec closure

- [ ] Resolve the boundary/check and visual evidence above; finalize payload hash and obtain exact G4 approval including identified visuals.
- [ ] Preserve independent G1 delta and separately approved implementation plan; no code, token, dependency, registry or remote mutation follows from this draft.
- [ ] Publish a full recoverable snapshot as an authorized comment on #292 only after separate publication permission; preserve earlier history and captures.
