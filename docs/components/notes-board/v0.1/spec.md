# Component contract — NotesBoard

- **Version / status:** 0.1 — **Proposed**, draft for owner review; not approved or implementation-ready.
- **Approval / recovery:** Pending explicit owner approval of this exact payload and VIS-01/02. Classification approved separately in `docs/components/web-catalog/v0.1/owner-approvals.md`; capture and issue-storage authority: `odd/tasks/web-catalog.md` L6, L15, L25–L27. A separate implementation plan requires approval.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: bc09219c3f9145ee5d53b2a9dc4b1872e7684519e9b5dbd076b0888a12cdf97e`; `visualHashes: VIS-01 → bee92a82c92e5c855b4d93d0f84facf1ed45c2d39aca4f83f94981df17143b27; VIS-02 → f5abb361275da7358e176b65c7cf5208b01ca796ab16cd59d8406a116736a227`; `approvalReference: Pending`; `canonicalIssue: Pending`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of UTF-8 bytes from the exact complete heading line `## 1. Purpose and scope` through EOF, including the final LF. Metadata above is excluded.

## 1. Purpose and scope

A reusable editorial board organism in `@egdev/ui`: side introduction and topics alongside a chronological list of linked notes. It is content inside a page section, not a section frame, page, archive, filter, router, data source or effects director. The consumer supplies all copy, dates, ordering, links and topic content; no Pulso data is built in. Proposed location `packages/ui/src/organisms/notes-board/`.

**Cataloging and alternatives:** `scripts/catalog_data.py:79,107` assigns NoteItem to ListItem editorial rows and NotesBoard to an organism composed from SectionHeader, ChipGroup and ListItem. Reuse alone or another ListItem variant cannot coordinate a two-column introduction and list; composition in each view repeats the structural board; no existing component contains a board to extract. Recommend a generic composition organism under the approved web amendment (`docs/CATALOGACION.md`), not a domain-specific export. Its topic implementation needs an explicit catalog-basis clarification: ChipGroup is a selection control, while the source topics are informational, so recommend static Chip composition, not a filter. A future catalog change is separate and not authorized here.

**Evidence:** Foundation read-only `design-system/components/NotesBoard/README.md:1–41`, `preview.html:12–30`, `design-system/components/NoteItem/README.md:1–53`, `design-system/CONTRACT.md:52,78`, and `reference-web/pulso-source.html:967–980` show the structure and native semantics. `design-system/DECISIONES.md:22–24,41–43` leaves real destination URLs to the web. `packages/ui/src/index.ts:6,44–46,61,75–81,126–137` exports Chip, ChipGroup, ListItem, SectionHeader, Surface, Text and Heading but not NotesBoard; current source is more recent than older availability prose in shared guidelines. Public `surfaceVariants` exists; it is not a reason to paint the board as a card. A screenshot is evidence of design, not implementation or accessibility approval.

## 2. Anatomy and composition

| Part | Proposed responsibility | Element / content |
| --- | --- | --- |
| Root | Passive layout within host section | `div.eg-notes`; no landmark or paint |
| Side | Intro and topic list | Internal wrapper; supplied `SectionHeader` and optional topic list |
| Topics | Informational labels | Named `ul` of `li` containing `Chip mode="static"`; link mode only if OQ-3 changes |
| Notes | Consumer-ordered chronological entries | `ol` containing `li` and one linked editorial ListItem per item |
| Row | Date, title, decorative direction | `<li><ListItem variant="editorial" size="sm" asChild><a href="…">…</a></ListItem></li>`; `ListItemLeading` contains `<time dateTime="YYYY-MM-DD">` day and month, `ListItemBody`/`ListItemTitle` and `ListItemTrailing` contain title and decorative arrow |

No nested anchors or interactive descendants inside a row. Consumer supplies complete parts, their accessible names and heading rank; the board must not inspect or clone arbitrary descendants. No own interaction or direct Radix primitive: native anchors own navigation; ListItem's existing Radix Slot owns `asChild`. `eg-notes` remains the public root marker. Legacy `eg-notes__*`, `eg-notes--sticky` and `eg-note*` are not new part-override APIs; preserve their existing consumers.

## 3. Public API

Proposed only, conditional on owner questions; no implementation exists. Recommend composition over structured `NoteItemProps[]` to reuse delivered primitives without duplicating date, router or label APIs.

| Input | Type | Required / default | Contract |
| --- | --- | --- | --- |
| `children` | `ReactNode` | required | Exactly one `NotesBoardSide` and one `NotesBoardList`, in that order. Each part takes consumer-supplied `children`; side contains one SectionHeader and optionally a named topics list; list contains `li` rows. Empty list is permitted and renders an empty `ol`; no fabricated message. |
| `sticky` | `boolean` | optional, `false` | Request side-column sticky only above 1080 CSS px; offset and approval remain OQ-4. |
| `className` | native string | optional | Root outer margin, width and parent placement only; no appearance overrides. |

`NotesBoardSide.children` and `NotesBoardList.children` are native children. Parts expose no part `className`, ref or `asChild`; they do not enforce descendant semantics at runtime. `NotesBoardList` renders the `ol`, and the consumer supplies direct `li` children. Root forwards compatible native `div` attributes except unsafe HTML, role and style; no ref, own events, sorting, state or polymorphic root. `sticky` is not controlled/uncontrolled state. Parts must not create an extra `section` or heading.

**Naming lookup:** [registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md), checked by meaning, canonical name and aliases. Recommend new pending `board-sticky-side` / `sticky` (`boolean`, side-column positioning in this board, not scrolling state); no source usage exists yet and separate convention approval is required. `children`/`className` are native, not new conventions. `collection-items` / `items` is approved but not used because the board does not render structured entries; the alternative structured API would use that entry, not a new `notes` synonym. `panel-header` / `header` is for floating panel content, not a section introduction; `heading-id` / `titleId` belongs to the supplied SectionHeader, not the board; `heading-title`, `heading-level`, `heading-eyebrow`, `trailing-text-accent`, `section-lede` belong to that existing component, not new board props. `slot-composition` / `asChild` is Radix single-child substitution, not generic composition. No exception or registry edit. Reviewed existing source: `SectionHeaderProps` in `packages/ui/src/molecules/section-header/types.ts`, whole-file `sha256:5726750a3c95049bf2262524f7d11d504774fd67f3b7d4409e49b9641b1d6f0c`; `ListItemProps` in `packages/ui/src/molecules/list-item/types.ts`, `sha256:df2e05c470c79ad94bef1b06c87d118216ea601ebebe1d8aea6cff8c366cbe76`; `ChipProps` in `packages/ui/src/atoms/chip/types.ts`, `sha256:aac605536ebb3fce3185c76418509c18641a008a1f65d4488e39e648bd992b7a`. No invented NotesBoard source revision or convention approval.

## 4. Behavior

| Input / action | Proposed result |
| --- | --- |
| Render | Side then ordered list in DOM and visual reading order; zero notes gives empty `ol`, no count limit or hardcoded copy. |
| Topics | Static labels are not focusable, selectable or filters. Navigation, if chosen, uses real destinations and native links, never filtering. |
| Linked row activated | Native anchor navigation; one focus stop per row, no board callback or automatic sort. |
| Viewport ≤1080 CSS px | Single column, side before list; sticky disabled. At >1080px, 4fr/7fr side/list and optional sticky. Boundary requires explicit local breakpoint approval. |
| `sticky` false / true | False: normal flow. True: at >1080px only, side sticks below navigation; exact token-backed offset is pending OQ-4. No scroll listener. |

Consumer owns reverse chronological ordering, valid machine-readable dates, display localization, links, heading context and topic semantics. No sorting, parsing, fetch, selection, live region, animation, automatic routing or cap at three is implied. Long content must wrap without clipping or visual reordering.

## 5. Accessibility

The enclosing page section, e.g. separately approved SectionShell, owns its landmark and `aria-labelledby`; the supplied SectionHeader uses its actual `titleId` to expose the unique heading ID (`packages/ui/src/molecules/section-header/types.ts`), and the consumer passes the same ID to the host section. The board does not create a duplicate named section or invent an ID in a child it cannot inspect. A host may generate the ID with `useId()`. If header title is blank, existing SectionHeader renders no header; consumer must not leave a dangling association. Appropriate heading rank is consumer-owned.

Use `ol` because order is meaningful, direct `li` children, one anchor per note, and `<time dateTime>` with the ISO date plus visible day/month; the consumer ensures chronology and valid dates. Decorative arrow is hidden from assistive technology; visible date and title contribute to link name. Tab/Shift+Tab and Enter are native, focus treatment belongs to ListItem, no arrow-key model or nested controls. Static topics are not tab stops. A named topics list uses a localized label; it is not a selection group. No board-level announcements or focus trap. Actual contrast, touch target, zoom and assistive technology require verification.

## 6. Appearance

**Material:** content sits over the host's section register, recommended Grafito SectionShell for this web context; the board adds no painted surface, glass, halo or second section. SectionShell's approved contract and unresolved recipes are separate (`docs/components/section-shell/v0.1/spec.md`; `odd/tasks/web-catalog.md` L27). Reuse SectionHeader's canvas/raised tone appropriate to the actual background, static Chip's existing surface and ListItem editorial's approved raised surface and focus. The web's translucent NoteItem is intentionally replaced by the delivered solid tonal row; no new Surface recipe. Reduced-motion and focus behavior remain the composed components' responsibilities.

**Geometry:** Foundation `NotesBoard/README.md:20–26` and legacy `bundle.css:896–904` describe 4fr/7fr, `--space-10` gap, centered side, `--space-2` row gap and ≤1080px one column with `--space-8` gap. Use existing tokens; Foundation's side `calc(--space-2 + 2px)` and sticky `42px` are not approved hardcoded appearance/geometry. Recommend `--space-2` side gap and a token-based offset `calc(var(--nav-height) + var(--space-10))` as an explicit visual difference pending owner approval, with host responsibility to avoid obscured content. No dynamic geometry, inline appearance, new token or interpolated classes. No existing default `md` breakpoint: request a NotesBoard-only static viewport threshold at exactly ≤1080px, with 1080/1081 and fractional widths tested; CommunityCard's 48rem approval is not transferable (`docs/components/community-card/v0.1/responsive-breakpoint-amendment.md:3–7`).

**Legacy collision:** unlayered `packages/ui/src/styles/legacy/bundle.css:896–904` applies grid, 4fr/7fr, gap and alignment to the stable `.eg-notes` root, and old side/topics/list/sticky selectors add margins, positions and media overrides. Existing `.eg-note*` at 329–344 includes glass, hover transforms and a 560px arrow-hiding rule, and Grafito descendants at 1741–1742 override their paint. Keep all legacy files and consumers unchanged. New markup should use distinct internal part markers and ListItem, not `.eg-notes__*`, `.eg-notes--sticky` or `.eg-note*`; locally neutralize root grid-template, gap and alignment under the shipped cascade before applying approved responsive layout, including ≤1080px. Verify actual computed styles with `@egdev/ui/styles.css` loaded, including old consumers and new rows; class-string order and `twMerge` cannot guarantee precedence over unlayered CSS. If utilities cannot achieve this, stop for an explicitly approved compliant scoped stylesheet role and plan, not `!important` or a legacy edit.

Static token-backed CVA in `types.ts` and per-part `cn()`; root className merges last only for outer layout, not arbitrary paint. Six meaningful files: `types.ts`, `useNotesBoard.ts`, `NotesBoard.tsx`, `NotesBoard.test.tsx`, `NotesBoard.stories.tsx`, `index.ts`. **No stylesheet** recommended only if the built utilities demonstrably neutralize legacy and express the approved breakpoint/sticky behavior; otherwise its role remains a blocking plan decision. No extra module, dependency or token change is authorized.

### Expected-design visual references

| ID | Image / English alt | Status |
| --- | --- | --- |
| VIS-01 | [Desktop board](notes-board--variants--1280--dark.png): side introduction and informational topic chips beside three dated linked note rows. | Proposed; SHA-256 `bee92a82c92e5c855b4d93d0f84facf1ed45c2d39aca4f83f94981df17143b27` |
| VIS-02 | [Narrow board](notes-board--variants--390--dark.png): the same introduction, chips and dated notes stacked in one column. | Proposed; SHA-256 `f5abb361275da7358e176b65c7cf5208b01ca796ab16cd59d8406a116736a227` |

Parent-supplied read-only Foundation `NotesBoard/preview.html` SHA-256 `f6b6484ed5abd473d41a61beb24ed600f3524d49885aeb4f89dda002fb1d39be`; [capture.json](capture.json) and [capture-raw.json](capture-raw.json) retain provenance. Chromium headless shell build 1243, viewports 1280×1400 and 390×1400, DPR 2, dark, en-US, no-preference motion, screenshot animations disabled, fonts reported loaded, `.pv` crop, 2026-11-03. Preview screenshots do not show sticky behavior, live interactions, boundary widths, assistive technology or implemented DS. Static board evidence does not prove browser parity. Visual adoption and accessible image publication are pending; visual conformity **Not evaluated**.

## 7. Acceptance criteria

All checks below are planned, not observed; dependent on OQ resolution and an independently approved plan.

| ID | Promise | Planned verification |
| --- | --- | --- |
| NB-01 | Root is passive; side and `ol` preserve order; empty list works without invented content | DOM role/order tests, Default and Empty stories |
| NB-02 | Host section references supplied SectionHeader heading ID, including multiple boards without duplicate IDs | Integration role/name and ID tests, SectionShell host story |
| NB-03 | Topic labels are static, no pressed/filter behavior; real links only if approved | Role, keyboard and click tests; Topics story |
| NB-04 | Direct `li`/ListItem-asChild-anchor structure, dateTime, readable title and decorative arrow; one tab stop and native activation | DOM and keyboard tests with editorial rows; DatedNotes story |
| NB-05 | Supplied order preserved, no data parsing, sort, callbacks or built-in Pulso copy | Rerender and link tests, reordered consumer data |
| NB-06 | Default two columns above threshold, one at and below; wrapping, 1080/1081 and fractional boundary | Built CSS and real browser at widths, zoom; VIS-01/02 |
| NB-07 | Sticky opt-in works only above threshold; no occlusion under actual bar | Real browser scroll, resizing and fixed-header geometry |
| NB-08 | Legacy root collisions neutralized without changing legacy consumers; no old part/row marker use | Packed consumer browser computed styles with shipped CSS, legacy fixture |
| NB-09 | Existing typography, raised rows, focus, reduced motion and token-backed styling; no board paint | Built CSS scan and browser contrast/focus/preferences |
| NB-10 | Public exports, native attribute and root-layout merge boundaries, metadata controls, React 18/19 and consumer without Tailwind | Types, docgen, Controls and package-consumer tests |

Owner adoption of payload and visuals, issue/image handoff, local breakpoint and sticky geometry/convention decisions, any necessary stylesheet role, and separate plan approval remain pending. No source, token, dependency, catalog, registry, or remote mutation is authorized by this draft.

## Blocking decisions for the owner

| ID | Question and evidence | Recommendation |
| --- | --- | --- |
| OQ-1 | Consumer composition or structured note arrays? Foundation exposes `header`, `topics`, `notes` (`design-system/components/NotesBoard/README.md:12–19`); delivered row is composable (`packages/ui/src/molecules/list-item/types.ts:56–105`). | Consumer parts and direct `li` rows; no built-in Pulso data, parsing or router. Structured alternative would use approved `collection-items` and needs a separately specified shape. |
| OQ-2 | Is chronology conveyed by `ol` and machine-readable date? (`NotesBoard/README.md:32–35`; `reference-web/pulso-source.html:975–979`). | Yes: host orders newest first, one direct `li` per anchor with `time dateTime`; no automatic sorting or date formatting. |
| OQ-3 | Are topics informational or navigation, and does ChipGroup fit? (`NotesBoard/README.md:6–10,32–36`; `packages/ui/src/molecules/chip-group/types.ts:6–7,66–70`; `packages/ui/src/atoms/chip/types.ts:73–110`; `scripts/catalog_data.py:107`). | Static `Chip` in a named list; no filtering or `aria-pressed`. If real topic destinations are required, use link Chip instead, with consumer hrefs. Clarify the catalog composition later; no catalog edit now. |
| OQ-4 | Support sticky side, and what offset? (`NotesBoard/README.md:18,22–26`; `packages/ui/src/styles/legacy/bundle.css:901–904`). | Opt-in `sticky=false` by default, only above 1080px; request new pending `board-sticky-side` naming convention and token-based `--nav-height + --space-10` offset rather than unapproved 42px. Host checks actual bar/occlusion; exact offset requires approval. |
| OQ-5 | Preserve ≤1080px one-column threshold or use an established breakpoint? (`NotesBoard/README.md:24–26`; `docs/components/community-card/v0.1/responsive-breakpoint-amendment.md:3–7`). | Explicitly approve a NotesBoard-only static viewport threshold at ≤1080px. Do not assume `md` exists or borrow CommunityCard's scoped 48rem approval. |
| OQ-6 | Which component owns heading association? (`reference-web/pulso-source.html:967–971`; `packages/ui/src/molecules/section-header/types.ts:67–73`). | SectionShell/host owns section landmark and `aria-labelledby`; consumer supplies matching unique SectionHeader `titleId`. Board remains a div and creates no duplicate landmark. |
| OQ-7 | Independent Material section/card or content over a host register? (`docs/MATERIAL.md:75–80`; `scripts/catalog_data.py:107`; `odd/tasks/web-catalog.md` L27). | Content over the host SectionShell's Grafito register; reuse existing Chip and ListItem Surface recipes, never paint a new board-level card. SectionShell recipe approval remains separate. |
