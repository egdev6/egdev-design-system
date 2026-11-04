# Component contract — CommunityCard

- **Version / status:** 0.2 — **DRAFT**, awaiting exact owner approval of G4 and G2; A4/G1 and the implementation plan require separate approval. No source work is authorized.
- **Approval / recovery:** Pending. Historical v0.1 payload `e61852ce0683616aa070f14bd9fa65457286ed8b474d7bb2630bfe8004b75662` was approved in [#281 comment 6581573407](https://github.com/egdev6/egdev-design-system/issues/281#issuecomment-6581573407); its Draft header is historical. The [48rem amendment](../v0.1/responsive-breakpoint-amendment.md) also applies. This snapshot changes neither.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-02 → Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/281`; `latestPublishedComment: Pending` for this snapshot.
- **Hash definition:** SHA-256 of UTF-8 LF bytes, including final newline, from `## 1. Purpose and scope` through EOF; tracking metadata above is excluded. Approval must identify this version, finalized digest, relevant visual hashes and scope.
- **Current situation:** implemented working-tree molecule; A4 is a proposal, not observed behavior. Pending decisions and capture are listed below. Owner direction: “todo OK! la aclaración...quiero mantener el tamaño de la fuente para que siempre sea el mismo alto del head haya o no haya logo...aumentando un  poco la fuente y manteniendo el alto del head siempre igual”.

## 1. Purpose and scope

A passive, reusable community invitation article coordinates a relationship line, optional consumer mark, name, descriptive copy and one supplied action. It does not own a grid, equal heights, artwork, domain data, analytics, fetching, a social row, hover or whole-card activation. The existing molecule is reused and its header recipe amended; a new component, a ModuleCard/ListItem variant and repeated host composition would duplicate or change responsibilities. Avatar is not the mark. Catalog decision and alternatives are retained from [v0.1](../v0.1/spec.md); the approved catalog correction is reflected in `docs/CATALOGO.md`.

Evidence: `packages/ui/src/molecules/community-card/{types.ts,useCommunityCard.ts,CommunityCard.tsx,index.ts,CommunityCard.test.tsx,CommunityCard.stories.tsx}` and the `packages/ui/src/index.ts` barrel. The component barrel exports all three parts and their types. Source inspection is not visual validation or a React 18/19 packed-consumer result.

## 2. Anatomy and composition

| Part | Element / responsibility | Content |
| --- | --- | --- |
| Root | Named passive `article`, raised Material frame | Band then body |
| Band / row | Internal `div`s; reserved header, row with leading eyebrow and trailing mark | Either, both or neither; no placeholder |
| Eyebrow | Local text part proposed instead of public `Text` eyebrow | Optional plain text and decorative diamond |
| `CommunityCardMark` | `div` on trailing edge | One noninteractive consumer image or named `role="img"` element |
| Heading / body | Generated `h2`–`h6` and internal `div` | Name, paragraphs and phrasing content, then optional action |
| `CommunityCardAction` | `div`, `mt-auto` | One consumer Button or Link |

Direct mark parts, including those within fragments, are hoisted into the row; remaining children keep their order. Contract permits one mark and one action; ReactElement typing does not enforce semantic constraints. No Radix is needed by this passive card; supplied controls own their interaction and may use their own Slot composition. No card `asChild` or ref. Stable markers `eg-community-card`, `eg-community-card__band`, `eg-community-card__mark`, `eg-community-card__action` remain; internal row, eyebrow and body are not override surfaces. Legacy consumers are not migrated.

## 3. Public API

| Prop | Type / default | Contract |
| --- | --- | --- |
| `title` | required `string` | Visible heading and complete article name; blank warns in development and renders nothing |
| `level` | `2 \| 3 \| 4 \| 5 \| 6`, default `3` | Heading rank only; invalid runtime rank falls back to 3 |
| `eyebrow` | optional `string` | Relationship line; whitespace-only omitted; proposed visual two-line limit |
| `children` | optional `ReactNode` | Descriptive paragraphs/phrasing, no headings or interactive content except supplied action; marks hoisted |
| `className` | optional `string` | Outer layout only |
| `CommunityCardMark.children` | required `ReactElement` | One noninteractive named or decorative mark, rendered untouched |
| `CommunityCardAction.children` | required `ReactElement` | One Button, optionally `asChild` anchor, or Link |
| Part `className` | optional `string` | Local layout only, not appearance or hiding |

Registry lookup by meaning/name/aliases: [source](../../../../skills/_shared/prop-naming.json), [generated reference](../../../prop-naming.md). Reused approved IDs `heading-title` → `title: string`, `heading-level` → `level: CommunityCardLevel`, `heading-eyebrow` → `eyebrow: string`; `trailing-actions` describes the supplied action but is not an own prop. Reviewed source for these mappings: `packages/ui/src/molecules/community-card/types.ts`, symbol `CommunityCardProps`, `sha256:93b7c3fb23bc67dda990aaf8b1adaacefa0455b77529a0f2c25fc10051971ee9`. No new prop, convention, exception or registry change is proposed. Native image attributes and inherited children/className need no own convention; component approval is not global naming approval.

Other native article attributes forward to the root, including applicable `data-*`/`aria-*`; `role`, `tabIndex`, `contentEditable`, `dangerouslySetInnerHTML`, `aria-label`, `aria-labelledby`, `aria-disabled`, `aria-selected`, `aria-pressed`, `aria-live`, `style` and ref are protected/stripped even at untyped boundaries. No controlled state or callbacks. Existing component exports remain unchanged; no React-version compatibility is inferred from types alone.

## 4. Behavior

The band remains present even without a row. **Proposed delta:** reserve its fixed height even when neither eyebrow nor mark exists; the empty row itself remains absent. Whitespace-only eyebrow is omitted; mark-only and eyebrow-only rows have no placeholder. Name and body copy wrap without truncation; only the eyebrow gains proposed two-line visual elision. Full eyebrow source remains in DOM and accessibility tree. The action remains in supplied body order and pins at the bottom when the host stretches the card; consumers place it last. The card creates no state, event, pointer cursor, motion, timer, network request or keyboard handling; `data-level` is debugging only. Action events and link destination/target/rel are consumer-owned.

## 5. Accessibility

The `article` is named solely by its generated heading through `useId()` and `aria-labelledby`; `level` must fit the host outline. Named marks (`role="img"` with `aria-label`, or `img` with `alt`) are accessible content, not part of the article name; marks repeating the visible title should be decorative (`alt=""` or `aria-hidden`). The diamond is decorative. Mark content must have no focusable descendants, and body copy must have no competing headings or controls. The card contributes no tab stop: when present, the single supplied action owns keyboard, focus ring, target size and announcements. No live region or automatic tooltip. The complete clamped eyebrow remains accessible; assistive-technology verification is pending. Reduced motion requires no card animation; supplied actions retain their own contract.

## 6. Appearance

| Axis | Values / rule |
| --- | --- |
| Heading rank | 2–6, default 3; typography independent of rank |
| Header content | eyebrow / mark / both / neither; fixed band at each breakpoint |
| Presentation | one; no size, tone or variant prop; host owns width and equal-height stretch |

**Exact proposed A4 delta versus v0.1:**

- Replace content-driven band height with `h-[var(--space-24)]` (76.8 px), and `min-[48rem]:h-[calc(var(--space-16)+var(--space-10))]` (83.2 px). Existing row padding is `px-6 py-4 min-[48rem]:px-8 min-[48rem]:py-5`. Derivation: 51.2 + 2×12.8 = 76.8 px; 51.2 + 2×16 = 83.2 px. The 48rem breakpoint is the existing local grant, not a global grant.
- Replace `Text variant="eyebrow"` (11.2 px) with the local recipe `inline-flex items-center gap-2.5 font-display uppercase text-body-default font-(weight:--text-label-eyebrow--font-weight) [letter-spacing:var(--text-label-eyebrow--letter-spacing)] text-fg-secondary before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:bg-fg-brand-default`. Text is fixed 12.8 px, diamond and 8 px gap retained; no global Text change.
- The mark keeps `max-h-16` (51.2 px) and `max-w-full`, adds `max-w-[calc(var(--space-24)*2)]` (153.6 px) and `object-contain`; it must fit the band without changing aspect ratio. Eyebrow gets a shrinkable `min-w-0` region, long-word wrapping and `line-clamp-2`: at most two visual lines, full text in DOM. Named mark has a bounded region and cannot consume all text space. A long-label story and a separate full-label rendering document the tradeoff, without tooltip/focus behavior. Exact G2 approval is pending.
- Body title, copy, padding and action recipes are unchanged; presence of a mark must not shift body or action relative to an otherwise identical card. Long title/body remain untruncated. The earlier no-clamping assertion applies to title/body, not the amended eyebrow.

**Material and files:** preserve root `surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' })`, band `surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' })` plus `rounded-t-xl border-b border-border-hairline`; root remains border-box and clipped, body `p-6 min-[48rem]:p-8 flex flex-col gap-4`, title `font-display uppercase text-title-section text-fg-default`, copy `text-body-default text-fg-secondary`. Surface supplies token-based raised paint, not glass. No new token, dependency, inline appearance, dynamic geometry, animation or interpolated class. **No stylesheet**; six existing files retain their types/CVA, hook/normalization, JSX, tests, stories and exports responsibilities; no extra internal module. Root `className` is merged last with `cn()` for outer placement, width, margin and stretch only; mark/action `className` merge last for local layout only. `twMerge` handles recognized conflicts, not all CSS or universal last-class wins; appearance/hidden-content overrides are unsupported and precedence needs tests.

### Expected-design visual reference

| ID | Image / scenario | Source / status |
| --- | --- | --- |
| VIS-01 | Historical [v0.1 capture](../v0.1/community-card--variants--1280x1400--dark.png): two glass community cards with marks, copy and actions | v0.1 capture hash `786a935a0215ee77dad3957917b767b14d4aff9fb26b02da6dda20205f7a2db0`, details in [capture.json](../v0.1/capture.json); Proposed, not an approved v0.2 reference |
| VIS-02 | Pending real component-zone captures: matched with/without mark and over-long eyebrow | Owner Image#13 is conversation provenance only; no recoverable image, hash or conditions available. Proposed, not captured or approved |

VIS-01 was captured at 1280×1400, device scale 2, dark, Chrome headless, loaded fonts; it shows glass rather than the approved solid band and predates this amendment. For VIS-02 agree source, scenario and authorized read-only hosting/browser access, then capture at 390/767/768/1280 px with recorded browser/version, scale, theme, fonts, motion/transparency, crop, date and `capture.json` per [guide](../../../design/README.md). Adopt exact visual hashes separately. Visual conformity is **Not evaluated**; captures never establish behavior or accessibility.

## 7. Acceptance criteria

All checks below are planned, not observed. Functional RED/GREEN and PRESERVE follow U2; measured visual geometry uses a real-browser computed-style exception, not fake RED. Check the owning element and emitted packed CSS rule.

| ID | Promise | Planned check / story | Evidence |
| --- | --- | --- | --- |
| CC-01 | Named article, h2–h6, default/fallback 3, unique heading relationship and protected native props | Render and injected-prop tests; HeadingRanks | Pending |
| CC-02 | Blank title warns in development and renders nothing; blank eyebrow omitted | Render tests; WithoutEyebrow | Pending |
| CC-03 | Row/mark hoisting and reading order; empty row omitted, band retained | Fragment, mark-only, eyebrow-only, title-only render tests | Pending |
| CC-04 | Surface-1 frame, surface-2 band, border, clipping and responsive body padding preserved | Recipe/render tests and 767/768 browser checks | Pending |
| CC-05 | Named and decorative marks preserve their semantics and add no tab stop | Accessible-role/name and tab tests; image, wordmark and decorative stories | Pending |
| CC-06 | Title and body wrap without truncation, with action in supplied order | LongContent render and narrow browser check | Pending |
| CC-07 | Single supplied Button/Link is sole tab stop and `mt-auto` aligns it in stretched cards | User-event and stretched-grid browser check; WithButton/WithLink/Widths | Pending |
| CC-08 | Passive root, layout-only class merges on root and both parts; no universal override | Merge and hover/idle checks; Widths | Pending |
| CC-09 | Own declarations retain JSDoc and valid controls | Docgen/controls tests and story review | Pending |
| A4-AC1 | Paired mark/no-mark band heights equal at 390/767/768/1280, including empty header | Recipe RED and own-element computed heights 76.8/83.2 px; paired story, VIS-02 | Pending |
| A4-AC2 | Eyebrow is 12.8 px in both members, local recipe replaces Text; diamond and 8 px gap survive | Recipe RED/PRESERVE and browser computed typography/pseudo-element; VIS-02 | Pending |
| A4-AC3 | Mark fits 51.2 × 153.6 px retaining aspect ratio | Browser image and named element checks across widths; VIS-02 | Pending |
| A4-AC4 | Mark presence does not shift body/action; title and body recipes unchanged | Matched-content browser geometry and PRESERVE tests | Pending |
| A4-AC5 | Long eyebrow wraps, visually shows at most two lines, preserves full accessible text, no overlap and fixed height | Render/accessibility plus browser geometry and AT check; long and full-label stories, VIS-02 | Pending |

### Blocking decisions and closure

1. **G2:** approve the exact fixed heights, 12.8 px recipe and two-line visual elision with full accessible text, or reject it and provide an alternative consistent with fixed height. No content-driven growth is approved by this draft.
2. **Mark constraint:** `ReactElement` permits arbitrary wordmark elements, while `object-contain` only controls replaced elements and the existing wrapper does not constrain arbitrary intrinsic children. Approve a bounded, non-distorting consumer obligation for non-image marks, or approve a separately specified compatible constraint. Do not pretend the proposed utility alone proves arbitrary children fit.
3. **Capture/G4:** authorize an identifiable visual source and capture conditions, or provide a recoverable reference; then approve the finalized snapshot and identified visuals. Image#13 alone is insufficient. Separately approve G1 and a concrete implementation plan before code.

Historical v0.1 OQ-1–OQ-5 were approved as recommended, not reopened. The amended Text-primitive promise and fixed empty-band geometry are explicit changes; all other v0.1 promises remain in force. No publication, registry mutation, code, token or dependency change is authorized by this draft.
