# Round 5 — cataloging drafts (owner-approved 2026-11-26)

Owner approval, verbatim: "Aprobar todas (Recomendado)". This defers #564 and treats #575 as an app pattern (the #509 decision). The Footer register widening, verbatim: "Sí, ampliarlo (Recomendado)".

The text below is the explorers' drafts as they were presented, kept as the record of the approved decisions. Evidence caveats are theirs.

## Pulso (#560–#566)

## Borrador de decisión de catalogación

I couldn't run `gh` (this role has no shell). I read all seven issue bodies from the public API instead (`api.github.com/repos/egdev6/egdev-design-system/issues/N`), and each one matches its S3 line. Nothing below is approved.

### #560 — Scene titles that fit their column
- **Decision:** variant, at the scene level. **Rejected:** *reuse*, because all four scenes hardcode `variant='hero'` (`Hero.tsx:17`, `Closing.tsx:14`, `ChapterBreak.tsx:17`, `LabStage.tsx:14`). *Retune the `hero` token* is out, because it changes every hero (`theme.css:298`). `show` already exists (`text/types.ts:33`, `theme.css:303`, 6.56vw ≈ 94.5px at 1440). *Compose* is impossible because there is no title prop.
- **Level/package:** the four organisms stay in `@egdev/ui`. Radix: none.
- **API:** two options. (a) An optional `titleVariant?: 'hero' | 'show'` on each scene. No registry entry fits it: `visual-treatment` (`prop-naming.json:1024`) is the root `variant`, and `heading-title` is the string. That makes it a new proposal. (b) A design adjustment that switches to `show` with no new prop. Catch with (b): the accent glow only applies to `hero` (`useHeading.ts:63`), so Hero would lose it.
- **Tokens:** none.
- **Constraints:** Closing OQ-5 and ChapterBreak OQ-3/OQ-4 left title sizing to separate review (`closing/v0.1/spec.md:107`, `chapter-break/v0.1/spec.md:97-98`).
- **Size:** M (4 components). No dependencies.
- **OQ:** I estimate "¿CONSTRUIMOS" at 94.5px is still wider than the ~516px column, so this needs browser measurement first. My recommendation: option (a), default `hero` so nothing breaks, with Closing as the first consumer.

### #561 + #565 — Footer width and grafito register (one decision)
- **Decision:** a variant of Footer, with two optional props. **Rejected:**
  - *Reuse SectionShell:* it forces `min-h-[var(--section-min-height)]` (`section-shell/types.ts:37`) and the `<section>` drops `contentinfo` (`footer/types.ts:33`).
  - *Wrapper in WebTemplate:* it would break the promise that the footer renders unwrapped (`web-template/types.ts`, footer JSDoc; `v0.2/spec.md:25,27`).
  - *Compose in the app:* that clones the grafito recipe by hand.
- **Level/package:** organism, `@egdev/ui`. Radix: none.
- **API:**
  - `wrap?: boolean`, default `false`, reusing `section-content-wrap` (`prop-naming.json:8385`). It adds a part that reuses `max-w-[var(--content-max)] mx-auto px-[var(--gutter)]`. I rejected `contentWidth` (`:8493`): it means gutters in both modes, and Footer has none today.
  - `register?: 'none' | 'grafito'`, default `none`, as a new usage of `section-register` (`:8358`). Its scope says "section frame", so the owner must approve widening it.
- **Tokens:** none. Grafito reuses SectionShell's recipe (`section-shell/types.ts:45`).
- **Constraints:** v0.2 says the host owns the background and fade (`footer/v0.2/spec.md:12,76`). That is the promise this changes, so it needs a v0.4 amendment. DECISIONES:92 lists the footer as grafito.
- **Size:** M. Depends on T2 (S5a, also Footer). Pair it with #562 so Footer is touched once.
- **OQ:** where does the fade go (`--mask-section-fade-*`, as in the stories at `SectionShell.stories.tsx:73`)? My recommendation: keep it host-owned for now.

### #562 — Quiet links in cards and the footer
- **Decision:** a variant of Link. **Rejected:** *reuse* gives one look only, and v0.4 says plain "is the only treatment" (`link/types.ts:81`; `link/v0.4/underline-hover-amendment.md:32`). *A className override* is not allowed (`link/types.ts`, LinkProps JSDoc).
- **Level/package:** atom, `@egdev/ui`. Radix: none, plus the existing Slot.
- **API:** `variant: 'quiet'` under `visual-treatment` (`:1024`). It means neutral `text-fg-default` plus a neon underline, which DECISIONES:86 allows for underlines.
- **Footer side:** FooterNavigation renders its own Link (`Footer.tsx`) and would adopt `quiet` internally. NowCard and CommunityCard links are consumer-supplied: CommunityCard.tsx contains no Link.
- **Tokens:** there is no 15px step (`body-default` 12.8, `body-large` 16, `theme.css:240-255`). My recommendation: `body-large`, no new token.
- **Constraints:** v0.4 says the next major decides whether the `variant` axis stays (`:75`). Adding `quiet` answers that: it stays.
- **Size:** S–M. Pairs with #561/#565.
- **OQ:** does quiet keep the hover rule of removing the underline? My recommendation: yes, so the state never relies on colour alone.

### #563 — SectionNav numbers and labels
- **Decision:** a parity fix of the existing appearance, with no API change. **Rejected:** *reuse*, because the hook outputs bare `index + 1` (`useSectionNav.ts:88,91`) and the parts use `font-sans text-body-default` (`section-nav/types.ts:91,98`). *Variant* is unnecessary because there is only one look.
- **Evidence:** DECISIONES:97 already approves `fg-brand-raised` for the number. The legacy recipe is display, 800, tabular (`bundle.css:603,1758`).
- **Level/package:** organism, `@egdev/ui`. Radix: the existing Popover.
- **API:** none, so nothing to look up in the registry.
- **Tokens:** none. Label: `font-display uppercase` plus an existing step. My recommendation is `text-label-eyebrow` or `text-meta` (`theme.css:260,273`).
- **Size:** S. No dependencies.
- **OQ:** zero-padding changes the link's accessible name ("01 About"). My recommendation: a visual `01`, with `aria-hidden` on the number only if the owner wants the old name kept. Bear in mind the number is a non-colour cue (`v0.1/spec.md:64`).

### #564 — NowCard status as a full-width band
- **Decision:** variant, **deferred**, because the issue marks it low priority. **Rejected:** *reuse*, because the wrapper is `flex px-6 pt-6 pb-3` (`now-card/types.ts:159`). A Badge `band` variant (`badge/types.ts`, `soft | solid`) would change what Badge is: a full-width strip is no longer a pill.
- **Alternative:** a NowCard API variant such as `statusPresentation?: 'badge' | 'band'`. No registry entry fits (`leading-status-badge`, `:8128`, covers the slot, not its layout).
- **Tokens:** possibly a band recipe on the Material side, which needs approval.
- **Constraints:** v0.3 freezes NowCard props (`now-card/v0.3/spec.md:43`).
- **Size:** M.
- **OQ:** defer it after 0.11.0? My recommendation: yes.

### #566 — Isotipo anchor fills its slot
- **Decision:** reuse, with a contract tag. **Rejected:** a `fill` prop. `host-fill` (`:8742`) means a definite-height host with an inner scroll region, and the spec forbids geometry props ("no geometry props — sized entirely by consumer layout utilities", `home-template/v0.1/spec.md:28`). The className is already merged (`useHomeTemplate.ts:734`), but `HomeTemplateAnchorProps` has no `@classNameAllows` (`home-template/types.ts:45-51`), so DS046 rejects any sizing class (`component-contract.md:108-109`).
- **Level/package:** HomeTemplate part, `@egdev/effects`. Radix: none.
- **API:** add `@classNameAllows width height inline-size block-size aspect-ratio …`. The exact list is for the owner. No new prop.
- **Tokens:** none.
- **Size:** S. It also changes the `@egdev/system` artifact.
- **OQ:** should the anchor's default be `w-full h-full` instead? My recommendation: the tag only, which keeps the spec's promise.

### Recommended order and merges
1. #566 (S)
2. #563 (S)
3. #561 + #565 merged into one Footer v0.4, done together with #562 and after T2
4. #560
5. #564, which I recommend deferring or declining for 0.11.0

**Still uncertain:**
- I did not read `component-contract.md` whole; I grepped it.
- I did not measure #560's glyph widths.
- Pulso's 15px footer links and the band look are taken from the issue text only; I did not see the reference.

## Reading (#569–#575)

## Draft cataloging decision (draft, not approved)

**Evidence I could not gather:** I have no shell, so `gh issue view` did not run. I read the seven issue bodies from the GitHub pages with `fetch_content`, and they match S4. I read `CATALOGACION.md`, the UI barrel, `packages/ui/package.json` and the prop-naming IDs and statuses in full. I only searched `ARQUITECTURA.md`, `MATERIAL.md`, `DECISIONES.md`, `component-contract.md` and `theme.css` for the relevant terms, so treat any contract detail beyond those hits as unverified. Apart from Dialog, the Radix packages already in `packages/ui/package.json` that matter here are `react-aspect-ratio` (:30) and `react-slot`. There is no navigation-menu or toolbar package.

### #569 Readable long-form body → **new primitive `Prose`**
- **Rejected options:**
  - **Reuse:** `Text` only styles one element at a time (`primitives/text/types.ts`, body/body-large/lede), and nothing in the barrel styles semantic children.
  - **Variant:** a `Text` variant would change what it is: one element versus a subtree of children.
  - **Compose:** you cannot compose HTML that arrives from Lexical.
  - **Extract:** `PullQuote` and `Table` are standalone components and own none of this styling.
- **Level and package:** primitive (structure and typography, no coordination), `@egdev/ui`. Radix base: none, native elements.
- **Styling:** descendant utilities (`[&_h2]:`, `[&_blockquote]:` and so on) in CVA, mapped to existing recipes: `text-heading-section`/`heading-small` for headings, `text-body-large` for paragraphs, `text-code` for code, the well recipe for `pre`, the `Link` recipe for anchors. Children are bare HTML, so the `blockquote`/`table` rules will repeat what PullQuote and Table recipes do. The spec has to accept that or forbid it.
- **API:**
  - `size` (`preset-dimensions`, approved) with `default | large` (16px body; 12.8px is too small, as the issue says).
  - `tone` (`surface-material-tone`).
  - `children`.
  - No `measure` prop: the measure is built in.
- **Token proposal:** a reading measure such as `--container-prose`. Today only `--container-quote-pull: 40ch` exists (`theme.css:346-347`), and SectionHeader caps its lede at `max-w-[var(--bp-sm)]` (`section-header/types.ts`). There is no evidence for a value. I recommend the owner choose within ~60–75ch.
- **Size:** M–L.
- **Owner questions:**
  - Does Prose cover tables and figures? I recommend yes, with simple styling, and pointing complex tables to `Table`.
  - Is a stylesheet allowed? I recommend "No stylesheet", using descendant variants.

### #570 Breadcrumb → **new molecule `Breadcrumb`**
- **Rejected options:**
  - **Reuse:** no export exists. `NavList` and `SectionNav` are side and section navigation.
  - **Variant:** a Link variant cannot hold a trail of several links.
  - **Compose:** it is native `nav` > `ol` with `Link` items, and the website needs it on every detail page. Under the web amendment (CATALOGACION, "Web consumer amendment" §1), a reusable piece without domain data enters `@egdev/ui`.
- **Level and package:** molecule (it manages a navigation collection, which rules out an atom per CATALOGACION's disqualifier list), `@egdev/ui`. Radix base: none; ARIA is native (`aria-current="page"`).
- **API:**
  - `items` (`collection-items`, approved) with `{label, href?}`; the last item is the current page.
  - `label` (`accessible-name`) for the `nav` name, needed in es and en.
  - `onNavigate` (`navigation-intent`, approved).
- **Size:** S. Depends on #562 if the trail uses the "quiet" link styling.
- **Owner question:** should the separator be a decorative icon or a CSS glyph? I recommend a decorative `aria-hidden` Icon.

### #571 Pagination → **new molecule `Pagination`**
- **Rejected options:** there is no export to reuse or vary. Carousel navigates slides, not pages. Composing it in the app would repeat the window/ellipsis logic for four listings.
- **Level and package:** molecule (coordinates previous/next and page numbers), `@egdev/ui`. Radix base: none; crawlable `a[href]` links, `nav` and `aria-current`.
- **API:**
  - `value` (`primary-value`) for the current page.
  - New proposed convention for the page count. `steps` is ruled out: `step-count` is still "proposed" and its avoid field excludes item counts and navigation step lists.
  - Proposed `getHref(page)`.
  - `messages` (`localized-messages`) for previous/next/page labels.
  - `label` and `onNavigate`.
- **Size:** M. Filters carry over through the `getHref` the website builds.
- **Owner question:** a convention name for the page count is needed. I recommend `pageCount` as a new entry.

### #572 Detail header with metadata → **compose a generic molecule; probably new (`DetailHeader`)**
- **Rejected options:**
  - **Reuse:** `SectionHeader` only takes title/eyebrow/lede/accent (`section-header/types.ts`). `PageHeader` is a "compact product heading" with only Button actions (`page-header/types.ts`). Neither has a metadata row.
  - **Variant:** adding metadata to SectionHeader changes what it is (an editorial introduction).
  - **Extract:** ArticleFeature's context row (`p eg-article-feature__meta`, `article-feature/v0.1/implementation-plan.md:59`) is a candidate to pull out, but it is internal and holds a single fact (`detail`, `content-detail`, `article-feature/types.ts:53`).
- **Proposal:** a molecule that composes SectionHeader with a metadata list (`dl`), a tags row (Badge) and external links (`Link external`, `new-tab-navigation`).
- **API:** reuse `title`, `eyebrow`, `lede`, `level`. Metadata would need a new convention, because `meta` (`option-metadata`) is reserved for options. I recommend structured `items` with `{label, value}`.
- **Size:** M.
- **Owner question:** extract a shared `MetaRow` that ArticleFeature also uses, or keep it new and local? I recommend new, without touching ArticleFeature (its v0.1 folder is frozen, plan :37).

### #573 Listing empty state → **new molecule `EmptyState`**
- **Rejected options:**
  - **Reuse:** `ListItem status="empty"` is a dashed action that normalizes to a card (`list-item/types.ts:11,101,167-172`).
  - **Variant:** `Notice` is a persistent live status with `role` status/alert (`notice/types.ts`). An empty result is not a message that should be announced, so a variant would change its responsibility.
  - **Compose in the app:** it is reused across four listings plus filters, so the web amendment applies.
- **Level and package:** molecule (heading, explanation and a recovery action), `@egdev/ui`. Radix base: none.
- **API:**
  - `title` (`heading-title`), `level` (`heading-level`).
  - `description` (`content-description`, approved).
  - `actions` (`trailing-actions`), one Button or Link.
  - Optional `icon` (`leading-icon`).
- **Size:** S.
- **Owner question:** should a filter change announce "no results"? I recommend no live region in the component; the website announces it if needed (same reasoning as Notice's single announcement owner).

### #574 External embed → **new atom `Embed` (or a host-side composition)**
- **Rejected options:**
  - **Reuse:** `AspectRatio` only reserves space (`aspect-ratio/types.ts`, `ratio`).
  - **Variant:** `PhotoFrame` is an image (`img src/alt` and figure). Adding an iframe would change what it is.
- **Proposal:** an atom built on AspectRatio + a Surface well + a native `iframe` with a required `title`, plus a loading/fallback state shown via `data-state`.
- **API:**
  - `ratio` (`aspect-ratio`, approved).
  - `src`; `identity-image-source` does not fit, so a new convention is needed.
  - `label` (`accessible-name`) mapped to the iframe `title`.
  - `fallback` slot; new convention, or reuse `unavailableText` (`unavailable-measurement-message` is about measurements, so it does not fit).
- **Size:** M.
- **Owner questions, both blocking:**
  1. X posts load `widgets.js`, a third-party script. Does that stay in the website, with the component taking only `children`? I recommend yes: the component reserves space and states, and never loads scripts.
  2. Do we need a cookie/consent policy before loading the embed? Same recommendation: it stays on the website side.

### #575 Enlarged gallery view → **compose Dialog + Carousel; re-check a prior decision first**
- **Prior decision:** #509 was resolved as "No, lo compone la app" ("No, the app composes it"): opening and enlarging stays app-side (`photo-frame/v0.5/fit-amendment.md:6,15`).
- **Reuse/compose:** `Dialog` uses `@radix-ui/react-dialog` (`package.json:34`) for focus trap, Esc to close and the scrim. Its API has `size: 'full'` and a required `title` (`dialog/types.ts`). `Carousel` already gives arrow, Home and End navigation over read-only items (`carousel/types.ts`). PhotoFrame `fit="contain"` displays each image.
- **Possible variant:** a media variant for Dialog (no bordered panel). That would be a separate Dialog amendment.
- **Level:** organism, if it is generalized.
- **Size:** S if it is just a pattern; M if Dialog gets a variant.
- **Owner question:** does #509 still stand? I recommend keeping app-side composition and documenting the pattern in a story. Only open a Dialog `variant` amendment if the scrim or panel doesn't look right.

### Recommended order and merges
1. #569 Prose: needs the token, and it is the base for detail pages.
2. #573 EmptyState.
3. #570 Breadcrumb, after #562.
4. #572 DetailHeader.
5. #571 Pagination.
6. #574 Embed, after its two owner questions.
7. #575 last.

**Merge or decline:**
- Treat #575 as app composition under the #509 decision (a story or pattern, not a new component). Decline it as a component unless the owner reopens #509.
- Consider having #572 and ArticleFeature share the metadata row later, but not in this round.


## Listings (#576, #577), owner-approved 2026-11-27

Owner approval, verbatim: "Aprobar las dos (Recomendado)".

- **#576: Chip link current state.** Variant: a Chip v0.3 link-mode state painted only through the native `aria-current`, typed as a narrowed union `'page' | 'true'` as in TopBar. It reuses Pagination's selected recipe and its forced-colors outline. No new prop, no `data-state` on the link root, and no built-in check icon (the consumer passes `icon`). `chipVariants()` keeps the toggle recipe, so ChipGroup is unaffected. Atom, native `a`. Size S.
- **#577: ProjectCard footer actions.** Variant: a ProjectCard v0.4 contract amendment. ProjectCardFooter takes one to three supplied Button/Link actions, as ModuleCard does. Add `flex-wrap` to the footer recipe, rewrite PC-08, and add a `WithActions` story. Not a list. Unique link names and the cap stay consumer obligations and are documented. Molecule, no Radix. Size XS–S.
