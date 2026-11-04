# Web catalog v0.2 — visual amendments

**Status: Final proposal — awaiting exact approval**

- **What this is:** one cross-component proposal that closes the open decisions of the previous draft and records *recommended* deltas on already delivered web components, plus one spec-first workstream for `AmbientBackground`. It is not a per-component spec version, and its text carries no approval hash. Each component's formal `v0.2` spec (own `contentSHA256`, visual references, approval record, canonical-issue comment) remains a separate deliverable.
- **Owner authorization (verbatim, `A1`–`A12` closure):** "ciérralo y prepara la planificación de todo". Owner authorization for the direction (verbatim): "todo OK!" plus the CommunityCard clarification quoted below. Owner authorization for the template boundary (paraphrased request, earlier session): the current `HomeTemplate` role is replaced by a `WebTemplate` with a `topBar` / `content` / `footer` distribution.
- **What this text does not claim:** no value, name, recipe, threshold or check below was hash-bound-approved or visually validated by this session. The owner asked to close the draft and plan the work; that authorizes proposal closure and planning only.
- **CommunityCard clarification (verbatim):** "todo OK! la aclaración...quiero mantener el tamaño de la fuente para que siempre sea el mismo alto del head haya o no haya logo...aumentando un  poco la fuente y manteniendo el alto del head siempre igual". The invariant header height takes priority over content-driven growth.
- **Companion plan:** `docs/components/web-catalog/v0.2/implementation-plan.md` (draft, implementation not authorized).
- **Reference images:** `Image#11`–`Image#18` were supplied by the owner in conversation. They are owner-provided references, **not** repository captures: no file, hash, viewport, theme or tool metadata exists in this repository for them, and they prove no behaviour or accessibility. Each is cited only as the observation that motivated a delta.
- **Frozen artifacts:** every prior spec, amendment, approval, receipt and image stays byte-identical; this proposal references them and edits none of them.

## 1. Decision status model

| State | What it covers here | Current |
| --- | --- | --- |
| Accepted direction | Owner wants these corrections and asked to close the draft and plan | Accepted (conversation) |
| Draft spec delta | A1–A13, their values, names, recipes and checks | Proposed, awaiting exact approval |
| Naming/convention approval | Registry entries and part names used or newly proposed | Separate, pending (description plus all new slot/message mappings) |
| Per-component spec approval | Scoped component amendment snapshots, with exact naming/recipe mappings and recoverable approval | Planned before source changes; frozen originals stay unchanged |
| Plan approval and implementation | Any code, tokens, tests or migration | Not authorized |

## 2. Evidence base (read-only inspection, working tree)

| Artifact | Why consulted |
| --- | --- |
| `packages/ui/src/molecules/{project-card,now-card,article-feature,community-card}/{types.ts,use*.ts,*.tsx}` | Delivered API and CVA recipes being amended |
| `packages/ui/src/organisms/{top-bar,footer,section-nav,now-strip,blog-grid,notes-board}/*` | Same, plus the stories where the owner's observation is visible |
| `packages/ui/src/organisms/{hero,chapter-break,lab-stage,closing}/types.ts` | Repeated scene anatomy behind A11 |
| `packages/ui/src/templates/{app-shell,section-shell}/{types.ts,use*.ts,AppShell.tsx}` | Landmark and clearance precedent for A12 |
| `packages/effects/src/home-template/*`, `packages/effects/src/ambient-background/*` | Template role and effect ownership boundaries for A12/A13 |
| `packages/ui/src/molecules/{tabs,list-item}/types.ts`, `atoms/link`, `atoms/pixel` | Recipes reused instead of re-invented |
| `packages/tokens/src/theme.css` (read-only) | Exact typography, spacing, alpha and mask tokens |
| `docs/components/<name>/v0.1/spec.md`, `docs/components/web-catalog/v0.1/*` | Frozen contracts and already-granted breakpoints |
| `skills/component-spec-proposer/SKILL.md`, `skills/component-contributor/SKILL.md`, `skills/component-cataloging/SKILL.md`, `skills/_shared/component-contract.md`, `skills/_shared/prop-naming.json`, `docs/prop-naming.md`, `docs/design/README.md` | Process, contract, naming and capture authorities |

Observed facts that constrain the proposals: all four scene organisms are delivered passive compositions with approved plans; `SectionShell`, `TopBar`, `Footer`, `NotesBoard`, `BlogGrid`, `NowStrip` and `SectionNav` have approved plans whose gates stay in force; `HomeTemplate` lives in `@egdev/effects` and owns choreography; `AppShell` already owns a single `<main id tabIndex={-1}>` plus a skip link, which is the landmark precedent reused by A12.

## 3. Corrections to the earlier draft

The earlier draft is superseded; these were its defects, recorded so no reader inherits them.

| Item | Earlier draft | Corrected | Basis |
| --- | --- | --- | --- |
| A1 mark cap | "`max-w-[calc(var(--space-24)*2)]`, 192 px proposed" | `calc(var(--space-24)*2)` = **153.6 px** | `--space-24: 76.8px` at the 3.2 px step |
| A7 story canvas | "`min-h-[calc(var(--space-24)*6)]`, 576 px proposed" | `calc(var(--space-24)*6)` = **460.8 px** | same token |
| A2 badge spacing | "badge wrapper keeps `px-6 pt-6 pb-3` (`px-5`/`sm`)" | `nowCardBadgeVariants` has **no size axis**: badge padding is 19.2 / 9.6 px at both sizes | `now-card/types.ts` |
| A2 heading inset | no-badge `pt-6` (19.2) and `sm` `pt-4` (12.8) | no-badge `pt-6` (**19.2 px**) at both sizes | matches the badge's real offset; `pt-4` would desynchronise `md`/`sm` |
| A4 header band | "reserve the same height" without arithmetic | mark cap `max-h-16` = **51.2 px**; `py-4` = 12.8 px each → **76.8 px** = `--space-24`; at 48rem `py-5` = 16 px each → **83.2 px** | `community-card/types.ts`, tokens |
| A5 current cue | "ink plus underline" while adopting the tabs recipe that has no underline | brand `after:` indicator **replaces** `underline`; cue is ink + 1.6 px indicator | `tabs/types.ts` underline recipe |
| A4 checks | paired cards at 390/768/1280 | 390/**767/768**/1280 | 48rem = 768 px is the boundary under test |
| A4 header marker | header text recipe described only by family/weight/tracking | the public `Text` eyebrow variant also renders an `inline-flex items-center gap-2.5` row with a rotated brand diamond (`before:size-2 before:rotate-45 before:bg-fg-brand-default`); the local recipe keeps that marker | `primitives/text/types.ts` |

No other numeric value in this proposal is arbitrary: every suggested utility is an existing token-backed step (`--space-1` = 3.2 px scale).

## 4. Convention policy

Every own prop below is looked up in `skills/_shared/prop-naming.json` and `docs/prop-naming.md`. Reused approved entries: `heading-title`, `heading-level`, `heading-eyebrow`, `content-detail`, `collection-items`, `accessible-name`, `section-register`, `section-content-wrap`, `active-section-id`, `board-sticky-side`, `scene-media`, `scene-social`, `trailing-actions`. `content-description` (A3) is a proposed new concept with no approval hash. WebSection/WebTemplate slot names, new messages and native inheritance also need exact registry lookup and mappings in their component specs; neutral names alone are not naming approval. Part names follow the delivered `*Mark`/`*Cover` precedent (`CommunityCardMark`, `ArticleFeatureCover`); those are component part identifiers, not registry conventions. Registry writes are **not** part of this proposal.

## 5. Amendments

### A1. ProjectCard — decorative backdrop image and trailing app mark

**Current contract:** `article` frame over `surfaceVariants`, optional decorative `index`, optional `eyebrow`, generated heading, free body; parts `ProjectCardTags`, `ProjectCardCode`, `ProjectCardFooter`; no media, no mark, no `style`. Frozen: `docs/components/project-card/v0.1/spec.md`.

**Final delta:** two additive optional parts on the upper zone.

| Part | Contract |
| --- | --- |
| `ProjectCardBackdrop` | One `<img>`; decorative only (`alt=""`, `aria-hidden`), never part of the card name. Inside one `isolate` wrapper behind the upper zone, `object-cover`, `pointer-events-none`, clipped by the frame radius. No other children. |
| `ProjectCardMark` | One non-interactive mark on the trailing edge: `role="img"` + `aria-label`, `img` + `alt`, or decorative when it repeats the visible title — the `CommunityCardMark` contract, unchanged. No anchor, button or tab stop. |

**Recipe (proposed, awaiting exact recipe approval):** recessed `surfaceVariants({ tone: 'well' })` under the image plus one scrim layer painted with `--color-alpha-black-42`; the fade *is* that scrim, not a handwritten gradient. Reusing `--mask-section-fade-bottom` outside `SectionShell` is **not** recommended (it needs a scope grant); a dedicated backdrop token is **not** proposed. Mark cap: `calc(var(--space-24)*2)` = 153.6 px, corrected from §3.

**Compatibility:** additive. Cards without the parts render exactly as today; slots mean no `src`/`alt`/`backgroundImage` prop and no style injection. The decorative `index` keeps its own flow line above the eyebrow.

**Checks:** A1-AC1 backdrop is `aria-hidden` and absent from the accessible name; A1-AC2 new decorative parts introduce no tab stops; existing body/footer link behaviour is preserved; A1-AC3 broken image still shows frame, scrim and legible text; A1-AC4 390/768/1280 px without clipping index, mark or heading.

### A2. NowCard — top inset when no status badge is supplied

**Current contract:** the top inset lives only on the optional badge wrapper (`eg-now-card__badge`, `px-6 pt-6 pb-3`, no size axis); the heading is `m-0 min-w-0 px-6` (`px-4` and `text-body-large` at `sm`). Without `statusBadge` the heading is flush with the frame's top edge; both sizes are affected. Frozen: `docs/components/now-card/v0.1/spec.md`.

**Final delta:** move the top inset onto the heading and gate it with badge presence.

- Root exposes a documented presence marker next to `data-size` (the `data-level`/`data-size` debugging precedent); the heading recipe becomes a CVA with two axes: `size` and badge presence.
- Heading inset: `pt-6` (**19.2 px**) when no badge, `pt-0` when a badge is present — the same value at `md` and `sm`, because the badge wrapper itself has no size step (corrected, §3).
- Badge wrapper unchanged, so a badge card is pixel-identical to today.

**Compatibility:** no prop, type or JSX-order change. `NowStrip` cards inherit the fix (A8, planned in the same work unit). No new token, breakpoint or stylesheet.

**Checks:** A2-AC1 no-badge `md`/`sm` cards measure 19.2 px top inset (packed-element computed style); A2-AC2 badge cards are pixel-equivalent to the base build at both sizes; A2-AC3 heading/body rhythm holds for 1- and 2-line titles.

### A3. ArticleFeature — optional descriptive text

**Current contract:** whole-card anchor with cover, optional context row (`eyebrow` + `detail`), generated heading, paint-only `actionLabel`; the spec lists "no article body copy" as a non-goal. Frozen: `docs/components/article-feature/v0.1/spec.md`.

**Final delta:** one optional `description?: string` on both union branches, rendered as a plain-text paragraph after the heading and before the action label.

- Whitespace-only renders nothing; long text wraps and is never truncated; `actionLabel` stays pinned last (`mt-auto`).
- Typography: `text-body-default text-fg-secondary` (12.8 px / 1.6) — the delivered copy step; no new token.
- The description sits inside the card's single anchor, so it joins the accessible name by construction (same documented consequence as `detail`); the existing `aria-label` override remains the escape hatch.

**Naming (proposed, separate approval):** new concept `content-description` / `description` — "optional short visible descriptive paragraph of a content unit, distinct from its title and from a factual context detail"; component types `string`; not registered here, not aliased to the approved `section-lede` or `content-detail`.

**Compatibility:** additive. Removing the "no body copy" non-goal is a promise change that only the per-component `v0.2` approval can accept.

**Checks:** A3-AC1 DOM order heading → description → action label; A3-AC2 blank description renders nothing; A3-AC3 still one tab stop; A3-AC4 `asChild` branch accepts it identically; A3-AC5 long description wraps at 390 px without horizontal scroll.

### A4. CommunityCard — reserved header height and slightly larger fixed header text

**Current contract:** the header row contains optional eyebrow text (public `Text` eyebrow primitive, 11.2 px) and a trailing optional mark; its height follows its children (`px-6 py-4`, `min-[48rem]:px-8 py-5`); the mark is capped at `max-h-16` = 51.2 px; the separate body title uses `text-title-section`. The 48rem breakpoint is the owner-authorized local variant. Frozen: `docs/components/community-card/v0.1/spec.md`.

**Final delta (clarification: verbatim owner quote above):**

| Item | Today | Final proposal |
| --- | --- | --- |
| Header band height | content-driven | reserved equal **fixed** height: `h-[var(--space-24)]` = 76.8 px, `min-[48rem]:h-[calc(var(--space-16)+var(--space-10))]` = 83.2 px — identical with and without a mark, at each breakpoint |
| Header text | 11.2 px public `Text` eyebrow | fixed `text-body-default` **12.8 px** via a local part recipe: `inline-flex items-center gap-2.5 font-display uppercase text-body-default font-(weight:--text-label-eyebrow--font-weight) [letter-spacing:var(--text-label-eyebrow--letter-spacing)] text-fg-secondary` plus the existing eyebrow marker (`before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:bg-fg-brand-default`) — family, weight, tracking and diamond preserved; no new token, no global Text change |
| Mark | `max-h-16`, `max-w-full` | same 51.2 px cap plus `max-w-[calc(var(--space-24)*2)]` = 153.6 px, `object-contain`; bound inside the reserved band |
| Body title, body, action | unchanged | unchanged; moving the mark must not move body or action |

**Long-label treatment (final proposal, not yet approved):** the band remains fixed at both sizes, including long-label cases. The text occupies a shrinkable `min-w-0` region, preserves the full source text in the DOM, wraps long words and is visually limited to two lines (`line-clamp-2`); excess text is visually elided, not deleted from the accessible text. A named mark has its own bounded region and cannot take all text space. A long-label story and an explicit full-label rendering outside the constrained example document this tradeoff; no custom tooltip/focus behaviour is added. This visual truncation is the proposed cost of the owner's invariant-height requirement and requires exact acceptance before implementation.

**Compatibility:** no new public prop; the eyebrow moves from the `Text` primitive to a part recipe (a promise change for the spec, not for consumers). Logo and no-logo variants intentionally gain equal header geometry.

**Checks:** A4-AC1 paired logo/no-logo cards have equal header height at 390/767/768/1280 px; A4-AC2 header text measures 12.8 px in both members of each pair; A4-AC3 mark keeps aspect ratio inside 51.2 × 153.6 px; A4-AC4 body/action positions unchanged by mark presence; A4-AC5 an over-long label retains the fixed band, is limited to two visual lines, retains full accessible text and does not overlap the mark (proposed policy, not approved).

### A5. TopBar — page links painted like the underline tabs

**Current contract:** `topBarLinkVariants` is `text-label-default text-fg-secondary no-underline`, hover to `text-fg-default`, current page `aria-[current=page]:text-fg-default` plus `underline`, outline focus ring; the anchor is only as tall as its line box inside the 54.4 px fixed row. Tabs `underline` adds a real indicator (`after:h-0.5` = 1.6 px, brand ink plus `--shadow-glow-base` when active) with `min-h-11` = 35.2 px.

**Final delta (local to TopBar):**

- `relative inline-flex items-center` link, indicator `after:absolute after:-bottom-px after:h-0.5 after:rounded-full after:inset-x-3`, brand ink plus `--shadow-glow-base` on `aria-[current=page]` — the Tabs values reused as-is.
- Current page cue becomes default ink **plus** the brand indicator; the `underline` decoration is dropped (corrected, §3) because the Tabs recipe has none and doubling the cue deviates from it.
- Target size: `min-h-14` = **44.8 px** inside the 54.4 px row; the Tabs `min-h-11` is below the navigation touch minimum, so dimensional parity is explicitly **not** promised.
- Semantics unchanged: native anchors, `aria-current="page"`; **no** `role="tab"`, `aria-selected`, roving tabindex, arrow keys or Radix tab primitive — this is navigation, not a tab interface.
- No shared-code widening: `tabs/types.ts` is not touched; extracting one shared indicator recipe for Tabs and TopBar is a later `Tabs` amendment, not this one.

**Compatibility:** appearance-only; `items`, `onNavigate`, `data-state` and the 900 px container behaviour untouched.

**Checks:** A5-AC1 exactly one link carries the indicator and it is not the only cue (ink change too); A5-AC2 hover/focus/current computed styles equal the reused Tabs values; A5-AC3 targets measure ≥44 px high at 390 and 1280 px; A5-AC4 no tab/menu role, no arrow-key handler, tab order unchanged.

### A6. Footer — one vertical rhythm and one heading recipe

**Current contract:** grid `gap-10` (32 px), motto stage `pt-12 pb-10` (38.4/32), legal `mt-12 pt-5` (38.4/16) `gap-4`, nav heading `mb-4` with `text-label-eyebrow` (11.2 px), nav links `min-h-14 min-w-14` (44.8 px, approved local exception). `footerHeadingVariants` exists in `types.ts` and is used by `useFooter`, but is not exported from `index.ts`.

**Final delta:**

| Item | Today | Final |
| --- | --- | --- |
| Grid | `gap-10` | `gap-x-10 gap-y-8` (32 / 25.6 px) |
| Motto stage | `pt-12 pb-10` | `pt-10 pb-8` (32 / 25.6 px) |
| Legal row | `mt-12 pt-5` | `mt-10 pt-4` (32 / 12.8 px) |
| Nav/group heading | `mb-4` | same recipe, `mb-3` (9.6 px) |
| Consumer group headings | unstyled `<h2>` in the story (browser default) | must use the exported `footerHeadingVariants()` recipe |
| Consumer tagline | unstyled `<p>` (16 px) | documented `text-body-default text-fg-secondary` |

The consumer rule is expressed by exporting the already-existing `footerHeadingVariants` from `packages/ui/src/organisms/footer/index.ts` (the `SectionShell` precedent) and documenting it as a consumer obligation; the story uses it. No new part, prop or heading component.

**Compatibility:** no API break; nav targets stay 44.8 px; change is spacing plus the consumer-demonstrated heading and tagline.

**Checks:** A6-AC1 859/860/861 px and 390/1280 px keep the two/three-column split with the new gaps; A6-AC2 nav heading, social heading and legal row use one documented step; A6-AC3 targets stay ≥44 px; A6-AC4 long legal text wraps without overlap.

### A7. SectionNav — story canvas clearance (story-only)

**Current contract:** root is `fixed` at `right/bottom: calc(var(--space-6) + env(safe-area-inset-*))`; the default padded story canvas clips the fixed pill and its open index (`Image#16`).

**Final delta (no component change):** meta gains `parameters: { layout: 'fullscreen' }`; each story renders inside a wrapper with `min-h-[calc(var(--space-24)*6)]` (**460.8 px**, corrected, §3) and `pb-24` (76.8 px) mirroring the component offset; one `Hover` story shows pill and open index unhovered and hovered; one narrow-width story wrapper makes "hover incluido" reviewable. Fixed positioning, offsets, focus and Radix disclosure stay untouched; the host still owns clearance (frozen SN-01…SN-08).

**Checks:** A7-AC1 pill, next control and open index fully visible in every story at default and narrow widths; A7-AC2 no story adds shipped CSS or a public prop; A7-AC3 hover/focus visuals reproducible.

### A8. NowStrip — inherits the card inset, no API

**Current contract:** label `mb-3` (9.6 px) with `StatusDot`, grid `grid-cols-3 gap-5 items-stretch` above 860 px, one column below, bottom hairline, `pb-6`; cards are consumer `NowCard size="sm"`.

**Final delta:** no prop and no recipe change in `NowStrip`. Its observed defect is the card-level top inset (A2), so the strip's delta is documentation plus proof: the spec records that compact no-badge cards keep the same inset as badge cards and that footers stay aligned across the three-up row; stories gain a mixed row (one card with `statusBadge`, two without) as the standing case.

**Rejected:** the earlier optional label-gap change (`mb-3` → `mb-4`). It is an unrelated spacing tweak that fixes nothing the owner reported; `A2` alone closes the defect.

**Checks:** A8-AC1 mixed row aligns headings and footers; A8-AC2 no-badge `sm` cards show the 19.2 px inset; A8-AC3 859/860/861 px and 390/1280 px keep the approved columns.

### A9. BlogGrid — descriptions at molecule and organism level

**Current contract:** passive grid of `BlogGridFeature` (one `ArticleFeature`), `BlogGridRows`/`BlogGridRow` (one `ListItem variant="editorial"` on an anchor) and `BlogGridArchive`; no copy of its own; the host owns the section heading.

**Final delta (two levels, no architecture change):** (1) the molecule's `ArticleFeature.description` (A3) supplies the feature paragraph; (2) described rows are the documented composition `ListItem` → `ListItemBody` → `ListItemTitle` + the delivered `ListItemContent`, inside the existing `BlogGridRow`. No new prop, no new part, and **no** `BlogGrid.description` heading/lede prop — the organism's frozen contract keeps heading and lede with the host's `SectionHeader`.

**Rejected:** a grid-level lede. It would duplicate the host's section lede, widen the organism's responsibility and create a second copy step.

**Checks:** A9-AC1 feature and described rows render in reading order without truncation; A9-AC2 a described row stays one anchor and one tab stop; A9-AC3 equal-height alignment and archive position unchanged; A9-AC4 1080/1081 px and 390/1280 px keep the approved grid.

### A10. NotesBoard — rhythm between side, rows and stacked boards

**Current contract:** grid `grid-cols-[minmax(0,4fr)_minmax(0,7fr)] gap-10 items-center`, side `flex flex-col items-start gap-2`, list `gap-2`; rows are consumer `li` elements; the side is usually `SectionHeader` plus a static topic list.

**Final delta:** root `items-center` → `items-start` so the introduction aligns with the first row instead of floating to the vertical middle; side `gap-2` → `gap-4` (6.4 → 12.8 px) between heading block and topic list; the sticky variant keeps `top-[calc(var(--nav-height)+var(--space-10))]`; the list keeps `gap-2`, documented to prefer `ListItem variant="editorial-divided"` so consecutive notes separate with the part's approved hairline; the second group's separation stays host-owned (`flex flex-col gap-16` = 51.2 px in the `MultipleBoards` story), never a board-owned outer margin.

**Checks:** A10-AC1 side top aligns with the first row above 1080 px; A10-AC2 stacked boards keep ≥51.2 px separation and the second heading never touches the previous rows; A10-AC3 1079/1080/1081 px keep the single-column collapse; A10-AC4 the sticky offset is unchanged.

### A11. WebSection — neutral organism slots (decided: new organism)

**Current state:** `Hero`, `ChapterBreak`, `LabStage` and `Closing` are delivered passive scene organisms in `@egdev/ui`, each with an approved plan; `SectionShell` is the delivered template frame.

**Final delta (one shape, no variants):** a new **organism** `WebSection` with neutral slots `header`, `media`, `body`, `actions`, `social`, plus an optional heading `id` for the host section's `aria-labelledby`. It owns no copy, no domain data, no register, no choreography and no effects import; the host composes it **inside** `SectionShell`, so the frame, `register` and `section-content-wrap` stay with the template and organism→template layering is not inverted. `WebSection` is not template-level and has **no** four branded variants.

- Slot content is neutral `ReactNode`; slots accept interactive content (named links, controls, an anchor) with no automatic tab-stop, role or name injection.
- No inherited decorative-only constraint: the old scenes' "decorative, nonfocusable" rule belongs to their own media contracts, so `WebSection` never restates it and never blocks a legitimate `video`, linked figure or interactive panel in `media`; the consumer still owns the accessible name of whatever it supplies.
- No new props beyond the slots: no `variant`, no `title`/`lede`/`accent` strings (those belong to `SectionHeader` and the scene organisms), no `asChild`.

**Rejected:** widening `SectionShell` (moves scene anatomy into an approved frame-only template) and a documented-only recipe (keeps four near-duplicates). Deprecation, migration or export removal of the four scenes require their own approved spec and plan; until then both surfaces coexist and no consumer is edited.

**Checks:** WS-AC1 slots render in DOM order and inject no copy; WS-AC2 composition inside `SectionShell` keeps register parity; WS-AC3 no choreography, observer or effects import; WS-AC4 no automatic tab stop or role is introduced by the slots.

### A12. WebTemplate — structural page slots and explicit landmark ownership

**Current state:** `HomeTemplate` in `@egdev/effects` is a page frame that also owns effect layers and scroll choreography (`zoneTable`, anchors, director, vignette); it is not a structural template.

**Final delta:** a new **template** `WebTemplate` in `@egdev/ui` with structural slots only: `topBar`, `content`, `footer`.

- **Landmark ownership is explicit, following the `AppShell` precedent:** `WebTemplate` itself renders exactly one `<main id={useId()} tabIndex={-1}>` around `content`. The content contract excludes nested `main` elements; arbitrary consumer ReactNode trees cannot be proven free of them at runtime, so valid composition is documented and tested rather than claimed to be enforced. `topBar` and `footer` render untouched, so their landmarks (`header`, `footer`) stay with the supplied organisms.
- Skip link is reused, not re-invented: the template consumes the already exported `appShellVariants.skip` / `.skipLink` recipes plus the existing `AppShellMessages` type for `messages.skipToContent` (default `Skip to content`), targeting the template's own main id. `AppShell` itself is not modified.
- **No automatic main padding or positioning inference:** when `topBar` exists, a normal-flow slot host reserves `min-height: var(--nav-height)` for the delivered fixed TopBar. Normal-flow header content can grow that host naturally. When absent there is no host or reserved height. The main follows in document flow, so no second clearance is added. Fixed headers with a different height are outside this initial slot recipe and need an explicit compatible composition.
- It owns no choreography, canvas, zone table, effects import or domain data; `TopBar`, `Footer` and sections remain consumer-supplied.
- **Target architecture:** `WebTemplate` replaces the template role of `HomeTemplate`; website-specific choreography belongs to the website, not to a permanent design-system surface. Existing `HomeTemplate` exports remain untouched **only** until a separately approved migration removes or relocates them; permanent legacy coexistence is not the recommendation, but no removal, deprecation or consumer edit is authorized by this proposal.

**Compatibility:** additive; `@egdev/ui` still never imports `@egdev/effects`. `WebTemplate` and `AppShell` are independent: no AppShell behavior, story or recipe value changes.

**Checks:** WT-AC1 exactly one `main` in the rendered document and document order `topBar` → `content` → `footer`; WT-AC2 no canvas, listener, director or zone prop; WT-AC3 the header host reserves space only with a `topBar`, supports both the delivered fixed TopBar and a normal-flow header, and main gains no extra padding; WT-AC4 skip link focuses the template main; WT-AC5 390/1280 px with absent optional slots render no empty wrapper.

### A13. AmbientBackground — independent visual combinations (spec-first workstream)

**Owner request (earlier, still open):** the effect should offer *configurable, independent visual combinations* instead of the hardcoded coupling of lines and squares.

**Observed current state:** `AmbientBackground` exposes `profile: 'base' | 'read' | 'live'` and `opacity`; the line/square streak geometry is produced by `particleStreaks.ts` and is not independently selectable. `profile` is a coupled preset axis, not two visual axes.

**Scope of this workstream:** a **new `AmbientBackground` spec** is required *before* any implementation, because independent combinations change the component's public promise, its defaults and its performance envelope. This proposal therefore records only requirements and open questions, and invents no particle API:

- The spec must decide the axes (at minimum the line family and the square/plate family), their independence, their allowed value sets, the preset defaults that reproduce today's `base`/`read`/`live` output, and the compatibility story for `profile`.
- It must state motion, `prefers-reduced-motion`, `forced-colors`, density/perf bounds and the ownership boundary with the host canvas.
- It must keep the existing export and contract until an approved plan migrates consumers; no token or dependency change is presumed.
- **Reference link:** the owner supplied `https://www.camzuna.com/anim` as the inspiration. That page was **not** extracted, captured or visually inspected by this session; no observation, technique or value may be attributed to it until an authorized capture exists. Real captures follow `docs/design/README.md` provenance rules.
- **Explicitly not conflated:** this workstream is independent of the A12 `HomeTemplate` → website migration; neither plan authorizes the other.

**Checks (after a spec exists):** AB-AC1 independent axes selectable without requiring a preset; AB-AC2 every preset reproduces the corresponding current output; AB-AC3 reduced-motion and forced-colors contracts hold for every combination; AB-AC4 no new dependency and no token change.

## 6. Closed decisions (recommendation selected)

| ID | Decision taken here |
| --- | --- |
| A1-OD1 | Scrim over the recessed well with `--color-alpha-black-42`. No new token; no `--mask-section-fade-bottom` reuse. |
| A2-OD1 | Inset 19.2 px at both sizes, matching the badge's real padding; no badge size axis added. |
| A3-OD1 | `description` on both union branches; `content-description` proposed as one new concept. |
| A4-OD1 | Fixed band 76.8 / 83.2 px with fixed 12.8 px header text; body title untouched; two-line visual limit with full text retained in the DOM, explicitly pending exact approval. |
| A5-OD1 | Target height 44.8 px; parity with tabs is visual, not dimensional. |
| A5-OD2 | No Tabs widening now; a shared indicator recipe is a later `Tabs` amendment. |
| A6-OD1 | One rhythm (32 / 25.6 px groups, `mb-3` headings) and an exported `footerHeadingVariants` consumer obligation. |
| A7-OD1 | Story-only clearance, `layout: 'fullscreen'`, hover story, 460.8 px minimum canvas. |
| A8-OD1 | `mb-3` label gap **rejected** as unrelated. |
| A9-OD1 | No grid-level lede; feature description plus documented `ListItemContent` rows. |
| A10-OD1 | `items-start`, side `gap-4`, host-owned board separation. |
| A11-OD1/2/3 | New `WebSection` organism with neutral slots inside `SectionShell`; no template widening, no recipe-only option; no branded variants; all four scenes stay exported. |
| A12-OD1 | `WebTemplate` owns the single `main`, reuses the AppShell skip recipes and reserves one normal-flow header slot only when supplied, with no main padding; `HomeTemplate` removal is a later, separately approved migration. |
| A13-OD1 | AmbientBackground independence is a spec-first workstream; no API invented here. |

## 7. Remaining gates (authorization only, not product menus)

| Gate | What must be authorized | Default of record |
| --- | --- | --- |
| G1 | Exact approval of this proposal text and of each A1–A13 delta | This text is the final proposal; nothing is approved |
| G2 | Exact CommunityCard fixed-height and two-line visual-limit recipe | Fixed 76.8 / 83.2 px band; 12.8 px text; two visible lines, full accessible text retained. No content-driven growth. |
| G3 | Exact ProjectCard scrim recipe (`--color-alpha-black-42` over the recessed well) | As proposed; alternatives rejected |
| G4 | Per-component `v0.2` specs with captures, VIS ids, `capture.json` and approval records under `docs/components/<name>/v0.2/` | Not started; owner images remain conversation provenance only |
| G5 | Naming approval for description and all new slot/message mappings, then `pnpm props:check` and `pnpm test:props` | Proposed, unregistered |
| G6 | Website-repository migration authorization: `WebTemplate`/`WebSection` adoption, choreography relocation, and only then removal/breaking of `HomeTemplate` and the four scene organisms | No writes in the website repository; exports stay until consumers move |
| G7 | `AmbientBackground` independence spec, then its plan | Spec-first; nothing implemented |
| G8 | Delivery shape for an oversized implementation (single PR vs chained slices) | Default ask-on-risk before the first implementation commit; no inherited single-PR grant |

## 8. Preserved artifacts and non-goals

- Frozen and referenced, not edited: every `docs/components/<name>/v0.1/*` spec, amendment, approval, `capture.json`, observed evidence and PNG; `docs/components/web-catalog/v0.1/*`; `docs/specs/gauge.md` and its approvals; `skills/_shared/*`; `packages/tokens/src/theme.css` and its compiled output.
- No token value, dependency, Radix package, breakpoint grant or registry entry is added or changed. The only breakpoints used are already granted (48rem for `CommunityCard`, 860/1080 px local rules, 900 px TopBar container).
- No stylesheet, no `data-testid`, no new focus/keyboard/ARIA model: native elements and delivered Radix primitives keep their semantics; where an amendment is visual only (A5, A6, A7, A10) the frozen behaviour and accessibility criteria stay in force.
- No implementation, story edit, capture, test run, publication, commit or remote action is authorized by this proposal.
