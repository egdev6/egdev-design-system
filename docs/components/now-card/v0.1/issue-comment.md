# NowCard — v0.1 proposal (new issue body, prepared, not posted)

**Readiness: Draft — not ready for implementation.** OQ-1 to OQ-5 are open blocking choices; OQ-1 records a real parity gap (the web's four-pixel meter has no implemented DS part). Posting this body authorizes no code, plan, token, dependency or catalog change, and creates no publication permission.

## Snapshot identity

- `version: 0.1`
- `contentSHA256: 7bd00ad82db7e42f639972fc96dd7f86b0c1fdbf3b8bddeae655fdc5646f5e57` (SHA-256 over the canonical payload below, from the level-2 `1. Purpose and scope` heading line through EOF, LF line endings, final newline; tracking metadata above that heading is excluded)
- `visualHashes: VIS-02 9fff262c4e7d6782e4cac2876388f59a71db3ebe99a5b1ae5f6a1b1efef91c23`
- `approvalReference: Pending (Draft v0.1)`
- `canonicalIssue: this new issue is the canonical issue for NowCard; later versions must be authorized comments, never body edits or one issue per version`
- `latestPublishedComment: Pending (nothing published)`

## Catalog authority and reason

- Catalog decision (already approved, not re-opened here): `docs/components/web-catalog/v0.1/cataloging-draft.md` §4 lists **NowCard** as a new molecule in `@egdev/ui` with no domain defaults; `docs/components/web-catalog/v0.1/owner-approvals.md` records the owner's 2026-11-02 approval; `docs/CATALOGO.md` carries the row with action `mover` and composes `Surface, Text`, and `NowStrip` as a composition organism built from NowCard.
- Cadence and evidence authority: `odd/tasks/web-catalog.md` L6 (one versioned issue per component, Foundation previews captured read-only) and L15 (batch 1).
- Reason: the web renders `.eg-now-card`/`.now-card` only as page markup. `ModuleCard`, `ListItem card`, `Stat` and `ProgressBar`/`MeterRow` were reviewed and cover different responsibilities; the status card needs its own frame, footer band and density.

## Proposed API summary (details in the snapshot)

- Root `NowCard` (`article`): `title` (required), `level` (2–6, default 3), `size` (`md` | `sm`).
- Parts: `NowCardBody` (badge + copy), `NowCardFooter` (`surface-0` band with top hairline), `NowCardDetail` (detail sentence with an emphasized `<b>` value).
- Reuses `surfaceVariants` (raised `surface-1`, elevation 1, radius `xl`, plus the documented `surface-0` footer band), `Badge` (status pill composition), `Link variant="underlined"` / `IconButton` (footer action) and the token type recipes; no new dependency, no Radix primitive, no stylesheet.
- Registry: approved entries `heading-title`, `heading-level`, `preset-dimensions`. No new convention and no exception requested.
- Known parity gap: the web's four-pixel isometric meter is not part of v0.1 because the cataloged `Pixel` atom still needs its geometry/token decision (OQ-1).
- `No stylesheet`: every role is expressible with token-backed utilities over the public Surface recipe.

## Visual references and asset status

`docs/components/now-card/v0.1/capture.json` holds the harness, source paths, conditions and SHA-256.

- VIS-02 — `docs/components/now-card/v0.1/now-card--variants--1280x1400--dark.png`, from `NowCard/preview.html` (source SHA-256 `4f8bb0701bea82891f95a5773b721f639447abe38834d8a3b048a40826351853`).
- Conditions: 1280×1400 viewport, device scale factor 2, `chrome-headless-shell` (Playwright 1.60.0), dark colour scheme, `prefers-reduced-motion: no-preference`, animations disabled, Google Fonts loaded before capture, element screenshot of the preview board. Resting and `is-hover` states only.

**Image handoff: Pending and blocked.** Local PNGs are not GitHub-visible. The owner must choose either human attachment (upload the exact PNG and return its URL) or a bounded, separately authorized asset-publication branch; the published bytes must be compared against the hash above before any image is linked here. No URL is invented and no commit, push or upload is implied.

## What approval of this proposal would mean

Adopting v0.1 as the NowCard contract (anatomy, API, behavior, accessibility, appearance and acceptance criteria) and adopting or declining VIS-02 as supporting expected-design evidence. It would not approve an implementation plan, tokens, dependencies, the deferred pixel meter, or any catalog-row change. Answers needed: OQ-1 (meter parity gap), OQ-2 (status pill as `Badge`), OQ-3 (`surface-0` footer band), OQ-4 (no hover lift on a passive card), OQ-5 (`size="sm"` must not clamp or hide content) — each with a recommendation at the end of the snapshot.

---

## Full snapshot (canonical payload, SHA-256 `7bd00ad82db7e42f639972fc96dd7f86b0c1fdbf3b8bddeae655fdc5646f5e57`)

## 1. Purpose and scope

- **Need:** one reusable “what I am doing now” card in `@egdev/ui` so a new web view can present current projects, explorations and live-stream state without copying the page-only markup. The card carries an optional status badge, a heading, free body copy and a footer zone that holds one supporting detail and/or one action. No copy, link, date, stream schedule, project name or status word is built in.
- **Non-goals:** not the project detail card (`ProjectCard` is its own molecule); not a real percentage measurement (`ProgressBar`/`MeterRow` own determinate progress); not a strip or grid (`NowStrip` is an approved composition organism built from NowCard instances); not a scheduling or countdown engine (`Countdown` owns deadlines and formatting); not a live-status machine, no polling, no copy, no icons baked in, no whole-card link and no nested interactive controls.
- **Cataloging decision / alternatives:** **new** molecule, per [cataloging-draft.md §4](../web-catalog/v0.1/cataloging-draft.md) and the `NowCard` row in `docs/CATALOGO.md` (action `mover`, source `NowCard (molécula)`, composes `Surface, Text`). Rejected alternatives: *reuse* (`ModuleCard` is a passive named module with a status Badge and a utility footer but no density for a three-up strip, no footer detail dual with an action, and a different responsibility — a module, not a current status; `Stat` is a single figure; `ListItem card` is a list snapshot with media and meta); *variant* (`ModuleCard`'s published `variant`/`tone`/`status` unions and `ListItem`'s `card` recipe would have to absorb a status-card responsibility, and neither exposes a footer detail slot); *compose* (a generic `Surface` + `Text` + `Badge` composition would re-implement the same footer band, the detail typography and the density rules in every new view, which the approved web-consumer amendment removes); *extract* (nothing inside an existing component hides a status card).
- **Evidence / level and package:** molecule in `@egdev/ui`, proposed `packages/ui/src/molecules/now-card/`. The level follows the responsibility: coordinated concepts (status badge, heading, body, footer detail and action) that only work as one reusable unit, with no section, navigation or domain-logic responsibility. Verified public React API inspected in this working tree: `packages/ui/src/index.ts` (`sha256:f85891be7d1d2ffc6d6788c9a06d87c70466213a227dec2abbd2235d2be6bd24`), `packages/ui/src/primitives/surface/types.ts` (`sha256:26d0726b5034dceb74e0067c1c0df5108d351e948205bbf22b5e187b92d9c0b6`), `packages/ui/src/molecules/module-card/types.ts` and `useModuleCard.ts` (banded head/foot precedent, `sha256:ed7adc13e5eb72795fbfdd83ee8108b291cefd94708e6b4f3642293357139c53` / `sha256:4e279badd7163d0c1603ececa5eebffdb4a7645af43654c70196f797993aa8ce`), `packages/ui/src/molecules/panel/usePanel.ts` (band tones, `sha256:941368560688af0b54cd7559004209d42757ab6a0357180ccb7f5024ab876ffb`), `packages/ui/src/primitives/text/types.ts` (`sha256:badce40976a01fb4c0079a1481c5ba2fcdf88c10dd2bee6556244991fdfd21c9`), `packages/ui/src/atoms/badge/types.ts` (`sha256:81d97cd46835e08a2ed5d846d352642ef9230661b4dcfe04d7e4be921c7d6f3e`), `packages/ui/src/atoms/link/types.ts` (`sha256:b5e5ba0b47c7e53c9a3759888c1d746a82596537fd3834d1ca3dd2a4b05503f3`), `packages/ui/src/atoms/icon-button/types.ts`, `packages/ui/src/atoms/icon/types.ts` (`hammer`, `compass`, `radio`, `twitch` glyphs exist in the closed set), `packages/ui/src/atoms/progress-bar/types.ts` and `packages/ui/src/atoms/status-dot/types.ts`.
- **Web evidence (read-only, owner-granted root):** `egdev-foundation/design-system/components/NowCard/README.md` (`sha256:3a8b8a674d6158d48a70182f5107befe8a1cf7011b06b954a26a29b3b9253abc`) and `preview.html` (`sha256:4f8bb0701bea82891f95a5773b721f639447abe38834d8a3b048a40826351853`); `NowStrip/README.md` (`sha256:febb53c62ada3d36009b1959df8867e86b267027ecfe07f11eecaa1e6a9cd12a`); real usage in `egdev-foundation/reference-web/pulso-source.html` lines 888–911 (three `.now-card.glass.card` inside `.now-strip`), with `.now-strip` density rules at lines 193–204; compiled recipes in `design-system/components/bundle.css` (`.eg-now-card` at line 266, `--compact` at 276–279, ≤860 px rule at 280). The web card is **glass** on the black canvas; Material v2 prescribes solid tonal cards with a `surface-0` footer band in the grey register (§6).

## 2. Anatomy and composition

| Part | Responsibility | Native element / Radix primitive | Allowed content |
| --- | --- | --- | --- |
| `NowCard` root | Article frame, Material surface, generated heading and overall density | `article` | Required `title`, then `NowCardBody` and `NowCardFooter` in that order |
| Heading (root prop `title` + `level`) | Readable card title and the article's accessible name | `h2`–`h6` selected by `level` | One plain text run; blank titles warn in development and render nothing |
| Status badge (consumer-supplied, first child of the body) | Current activity label such as “building” | Existing `Badge` atom (`tone="brand"`, `variant="soft"`, optional decorative `Icon`) | Short single-line label; no controls, no links |
| `NowCardBody` | Padded growing zone for the badge and the copy | `div` | A `Badge` and one or two short paragraphs; no interactive content |
| `NowCardFooter` | Lower band for one supporting detail and/or one action | `div` | One `NowCardDetail` and/or one `Link`/`IconButton`; never two competing actions |
| `NowCardDetail` | Supporting date or context line with an emphasized value | `span` | One short visible sentence; the value is marked with `<b>` (for example `<time dateTime>` inside it); no controls |

- **Radix / composition:** no Radix primitive is needed. The card is passive and owns no keyboard model, focus management or selection. The footer action keeps native/Router anchor semantics through `Link`, and an icon-only action uses the implemented `IconButton` with its required accessible label. No `asChild` on the card, no ref, no new dependency and no nested interactive controls.
- **Public markers:** `eg-now-card` is the stable public root; parts use `eg-now-card__body`, `eg-now-card__foot`, `eg-now-card__detail`. No existing legacy consumer is migrated: the web keeps `.eg-now-card`/`.now-card` until an explicitly approved parity migration.
- **Reading order:** DOM order equals visual order — badge, heading, body copy, footer detail, footer action. The footer never reorders against the DOM.

## 3. Public API

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | yes | — | Visible heading text and the article's accessible name. Blank/whitespace warns in development and renders nothing. |
| `level` | `2 \| 3 \| 4 \| 5 \| 6` | no | `3` | Native heading rank only; the visual step follows `size`. |
| `size` | `'md' \| 'sm'` | no | `md` | Density preset: `sm` is the three-up NowStrip density (smaller padding, heading and body steps). It never clamps, truncates or hides supplied content. |
| `children` | `ReactNode` | no | none | Body and footer parts in reading order (`NowCardBody`, then `NowCardFooter`). |
| part `className` | `string` | no | — | Local layout only (grid placement, margin, width) per part; no appearance overrides, no hidden content, no reordering. |

- **Prop conventions:** [canonical registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md), looked up by meaning and alias before drafting. Applied approved entries: `title` → `heading-title`; `level` → `heading-level`; `size` → `preset-dimensions` (same density meaning as `Notice` `md | sm` and `ListItem` editorial density). **No new semantic ID and no exception is requested**, because every remaining zone is a slot or an existing atom: the status badge is a `Badge` composition, the footer action is `Link`/`IconButton`, and `NowCardDetail` takes no own prop. No convention status changes.
- **Native props / refs:** the root forwards native `article` attributes (`data-*`, `aria-*` outside the protected set) and is merged last through `cn()` for outer layout only. `role`, `tabIndex`, `aria-label`/`aria-labelledby` (the heading names the article), `aria-pressed`/`aria-selected` and `style` are protected, following the `ModuleCard` policy. No ref and no `asChild`.
- **Controlled / uncontrolled:** Not applicable. The card holds no state, timer, clock or live status. A remaining-time or next-date display stays consumer text (or a composed `Countdown`), never a card-owned clock.
- **Compatibility:** new export surface (`NowCard`, `NowCardBody`, `NowCardFooter`, `NowCardDetail` and their types) added to `packages/ui/src/index.ts` under Molecules. Nothing existing changes; no token, dependency or legacy-class migration is proposed. React 18/19 consumption is a plan gate, not a claim of this draft.

## 4. Behavior

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| Card rendered with `title` only | Frame, heading and nothing else; no empty body or footer bands | none |
| `NowCardBody` with a `Badge` and one paragraph | Badge above the copy, both inside the padded body zone | none |
| `NowCardFooter` with `NowCardDetail` and a `Link` | Detail on the leading edge, action on the trailing edge, one row, no overlap | Router/native event from the consumer's own element |
| `NowCardFooter` with only one child | The single child aligns to the leading edge; the footer is not stretched into an empty cell | none |
| `size="sm"` | Smaller padding and heading/body steps; the full copy and footer still render | none |
| Long title, long copy or a long detail sentence | Text wraps at word boundaries; the footer wraps instead of clipping; nothing is truncated, clamped or replaced by a tooltip | none |
| `title` blank or whitespace-only | Development warning; the card renders nothing at all (no unnamed article) | none |
| Pointer over the card body | No movement, no glow change and no pointer cursor: a passive card must not look clickable | none |

- **States / representation:** no own `data-state`, no hover state in JS and no mirrored state classes. The density is reflected as `data-size` on the root so parts can read it.
- **Limits / consumer responsibilities:** the consumer supplies the status word, copy, dates and actions, keeps exactly one primary action in the footer, formats its own dates and locale strings, and decides grid placement. The card never polls, schedules, announces a live change or owns the progress meter (see OQ-1).

## 5. Accessibility

- **Accessible name / roles / relationships:** the root is a native `article` named by its generated heading through `aria-labelledby` with a `useId()` id; the heading element is chosen by `level` so a three-up strip keeps a valid outline. The status badge is a `Badge` label, so the status is readable text and never colour-only.
- **Keyboard / focus:** the card adds no tab stop and no key handler. The only focusable element is the supplied footer action, which owns its native focus ring (`--shadow-focus`) and its own hover/focus treatment; an icon-only action must be an `IconButton` with its required accessible label. There are no nested interactive controls, so overlapping activation is impossible.
- **Announcements / other conditions:** no live region and no synthesized announcement; a changing status or date is the consumer's announcement decision. Dates must be supplied as real `<time dateTime="…">` elements inside `NowCardDetail` when they carry a machine-readable instant. Any numeric progress shown as text stays readable text, not a colour or a bare glyph.
- **Touch targets:** the footer action owns its own target (44 px minimum on coarse pointers through the atom's own rules); the card does not enlarge or shrink it.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| `size` | `md`, `sm` | `md` | Both sizes render every supplied part; no content is hidden or clamped by density |
| `level` | `2`–`6` | `3` | Rank never changes the visual step |

- **Tokens / Material:** the root composes the public `surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' })` recipe and own layout classes (`flex flex-col min-w-0`). `NowCardBody` carries the inner padding and the body typography (`text-body-large text-fg-secondary`); `NowCardFooter` composes the documented band recipe from Material — `surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' })` plus the top hairline and `rounded-b-xl`, exactly as `ModuleCard`'s banded footer does — which is also what `docs/MATERIAL.md` prescribes for the NowCard footer over the grey register. The heading uses `text-heading-small`; the detail line uses `font-display text-meta uppercase` with tabular numerals, and its `<b>` value takes `text-fg-default` and the extrabold display weight. The web's glass paint plus `--shadow-card` over the black canvas is replaced by the solid tonal frame Material prescribes; that substitution is an allowed difference, not a new recipe.
- **Dynamic geometry:** Not applicable. No custom property, no interpolated class string and no inline geometry is introduced. The four-pixel isometric meter, which the web draws with `skewY(27deg)` rectangles, is deliberately **not** implemented here (OQ-1).
- **Motion:** the card itself has no transition, transform or animation; only the supplied action moves. Anything added later must be suppressed under `prefers-reduced-motion`.
- **Class composition / consumer layout:** the root merges `className` last through `cn()` for outer grid placement, margin and width; parts merge their own `className` last for local layout. `twMerge` resolves recognised utility conflicts only: no universal last-class-wins promise, no appearance-override permission and no per-instance recipe. `surfaceVariants` remains the appearance API, and the badge/action appearances come from their own atoms.
- **Files / pending proposals:** the six mandatory files are planned at `packages/ui/src/molecules/now-card/` — `types.ts` (CVA recipes, `NowCardProps`, `NowCardBodyProps`, `NowCardFooterProps`, `NowCardDetailProps` with English JSDoc and `@control` on every own declaration), `useNowCard.ts` (normalization, protected props, derived heading id, per-part `cn()`), `NowCard.tsx` (JSX only), `NowCard.test.tsx`, `NowCard.stories.tsx` (`Molecules/NowCard`, English) and `index.ts`. **No stylesheet** and no extra internal module. No token or dependency change is proposed; the meter, if approved later, arrives with its own token/geometry decision (OQ-1).

### Expected-design visual reference

Captured for this draft on 2026-11-02 from the read-only Foundation preview through a `/tmp` harness that links `tokens.css` and `components/bundle.css` as `file://` URLs; no file inside `egdev-website` was modified.

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-02 | `now-card--variants--1280x1400--dark.png` — two rows of three status cards: the top row shows full density with a tinted status pill (`Building`, `Exploring`, `Streaming`), a large sans title, one or two lines of copy and a hairline-separated footer holding either a link plus a four-pixel meter or a bold next-date line plus a round icon action; the bottom row repeats the three-up compact density with one hovered card | Project source → proposed `size="md"` (top) and `size="sm"` (bottom, the NowStrip density); badge composed from `Badge`, action from `Link`/`IconButton`, detail from `NowCardDetail`; the meter is not part of v0.1 | `egdev-foundation/design-system/components/NowCard/README.md` + `preview.html` (SHA-256 `4f8bb0701bea82891f95a5773b721f639447abe38834d8a3b048a40826351853`), previews built against `tokens.css` `1c92acb8…` and `bundle.css` `04797068…`; observed web design, not the DS implementation | Proposed |

- **Conditions / provenance for VIS-02:** component-zone element screenshot of the preview board (`.pv`, the labelled grid containing every previewed state), viewport 1280×1400, device scale factor 2, `chrome-headless-shell` from Playwright 1.60.0 (`playwright-core`, Chromium 1243 build), colour scheme `dark`, locale `en-US`, `prefers-reduced-motion: no-preference`, animations disabled during the screenshot, Google Fonts loaded before capture (`document.fonts.ready`; loaded faces Barlow 400/600/700 and Barlow Condensed 600/700/800). Board height observed 623 px. Date, tool, source and per-file SHA-256 are recorded in `capture.json`.
- **Intent / acceptance / pending evidence:** the anatomy order (status pill → heading → copy → hairline footer with detail and/or action), the two densities and the footer identity must survive the port. Allowed differences: solid `surface-1` frame with a `surface-0` footer band instead of the web's alpha-glass card; `Badge` (pill, sans label) instead of the web's 6 px-radius uppercase display tag; token type steps (`text-heading-small`, `text-body-large`, `text-meta`) instead of raw 20–24 px / 15–16 px; `Link variant="underlined"` and `IconButton` for the footer action; **no four-pixel meter** (OQ-1); no `sm` content clamping or hiding (OQ-5); no card-level hover lift (OQ-4). Related criteria: NC-01 to NC-10. Pending: owner adoption of VIS-02, a GitHub-visible image handoff and any comparison against an implementation. Until then visual conformity is **Not evaluated**; captures never replace behavior or accessibility tests.

## 7. Acceptance criteria

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| NC-01 | The card renders `article` > heading with `level` rank, named by that heading through `useId()` | Render assertions on role, heading element and `aria-labelledby` | `Default`, `HeadingRanks` | Pending |
| NC-02 | Blank or whitespace-only `title` warns in development and renders nothing | Unit case on normalization; no unnamed article in the DOM | `InvalidTitle` (documented, not a story) | Pending |
| NC-03 | Body and footer render in DOM order with their public markers; the footer band paints `surface-0` with a top hairline and bottom radius | Render and class assertions per part | `Default` with VIS-02 | Pending |
| NC-04 | `size="sm"` reduces padding and heading/body steps and still renders the full copy and footer | Class assertions plus a render case at both sizes | `Sizes` with VIS-02 | Pending |
| NC-05 | A composed `Badge` inside the body keeps its own label semantics and adds no tab stop | Render assertions on the badge text and tab order | `WithBadge` | Pending |
| NC-06 | A footer with `NowCardDetail` + `Link` exposes exactly one tab stop and one action; a single child aligns to the leading edge | `userEvent` tabbing plus layout-class assertions | `WithLink`, `WithSingleChild` | Pending |
| NC-07 | `NowCardDetail` renders one readable sentence, styles `<b>` as the emphasized value and accepts a real `<time dateTime>` | Render assertions on text, `<b>` styling contract and `time[datetime]` | `WithNextDate` | Pending |
| NC-08 | Long copy and long detail sentences wrap without truncation, clamping or reordering at a narrow container | Render case at a narrow host width | `LongContent` | Pending |
| NC-09 | The card has no card-level hover movement, transition or animation | Class assertions; no transition utilities on the root | `ReducedMotion` | Pending |
| NC-10 | Every own prop carries English JSDoc with a supported `@control`/`@controlReason`, and the registered Controls enhancer reports no diagnostics | `storybook-docgen` / `storybook-controls` suites | Docs table review for `Molecules/NowCard` | Pending |

### Spec closure

- [ ] All seven blocks are complete or justified as Not applicable; no blocking promise decisions remain — **not closed**: OQ-1 (meter parity gap) and OQ-2 to OQ-5 below.
- [x] New/changed own props have registry lookup evidence and exact applied entry IDs; no new convention and no exception is requested.
- [x] Proposals, verified implementation, planned checks and observed results are distinct; every promise has an acceptance ID and a method.
- [x] VIS-02 identifies a real image with provenance, conditions and related criteria; it stays Proposed and visual conformity is Not evaluated.
- [ ] Snapshot identity is recoverable and owner approval identifies this version, digest and visual hash — **pending owner approval**; status remains Draft.
- [ ] A canonical component issue exists — **Pending**: this proposal is the body of a new issue (one issue per component), and later versions must be authorized comments, never body edits.

**Next step:** the owner resolves OQ-1 to OQ-5 and approves or rejects v0.1 with its digest and VIS-02; only then does a separately approved implementation plan authorize code. This draft authorizes no code, no token or dependency change, no capture re-run, no remote publication and no terminal Git action.

## Blocking decisions for the owner

| ID | Question | Recommendation |
| --- | --- | --- |
| OQ-1 | The web's four-pixel isometric progress meter has no implemented DS part, and the cataloged `Pixel` atom still needs its geometry/token decision. Should v0.1 ship without the meter, compose the existing `ProgressBar` (`size="sm"`, percent) inside the footer, or wait for `Pixel`? | Ship v0.1 without a meter and keep the footer as a slot: a real percentage belongs to `ProgressBar`, the pixel meter arrives with the `Pixel` contract as a later amendment, and no geometry is invented here. |
| OQ-2 | Is the status pill a `Badge tone="brand" variant="soft"` composition, or a new `NowCardTag` part that reproduces the web's 6 px-radius uppercase display tag? | Compose `Badge`. It already carries the exact tint tokens, an icon slot and the readable-label contract; the pill radius and sans typography are recorded allowed differences rather than a second tag recipe. |
| OQ-3 | Should the footer paint the `surface-0` band with a top hairline, as `docs/MATERIAL.md` prescribes for NowCard over the grey register, even though the web's glass card shows no tonal step? | Yes. The banded footer is the documented Material treatment and matches `ModuleCard`'s banded footer; the web's flat hairline is a consequence of the glass register, not a separate design. |
| OQ-4 | Should passive status cards lift 4 px and glow on pointer hover as the web does, even though nothing activates on click? | No card-level hover movement; only the supplied footer action is interactive and it keeps its own hover/focus treatment. |
| OQ-5 | Must `size="sm"` clamp the copy to one line (and hide it below 560 px) as the web's `--compact` and its narrow-screen rule do? | No. Density must never hide or clamp supplied content; consumers shorten their own copy, and no new breakpoint is added. |
