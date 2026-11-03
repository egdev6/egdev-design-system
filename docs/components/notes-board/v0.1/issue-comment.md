# NotesBoard v0.1 — proposed issue handoff, not posted

**Draft — not ready for implementation.** This prepared initial issue handoff is for owner review. OQ-1–OQ-7 remain open. One issue per component; later versions require separately authorized comments. Canonical issue and latest published comment: Pending. No GitHub action has been taken.

## Snapshot identity and recovery

- Version `0.1`; status **Proposed**; approval reference **Pending**.
- Full recoverable local contract: [`spec.md`](spec.md), including all seven blocks and owner questions. Canonical payload SHA-256 `bc09219c3f9145ee5d53b2a9dc4b1872e7684519e9b5dbd076b0888a12cdf97e` (exact full heading line `## 1. Purpose and scope` through EOF, UTF-8 LF including final newline). Before any remote handoff the parent must supply an accessible immutable full snapshot and verify its bytes; this local link is not a GitHub-visible asset.
- VIS-01 SHA-256 `bee92a82c92e5c855b4d93d0f84facf1ed45c2d39aca4f83f94981df17143b27`; VIS-02 SHA-256 `f5abb361275da7358e176b65c7cf5208b01ca796ab16cd59d8406a116736a227`. See [`capture.json`](capture.json) and parent [`capture-raw.json`](capture-raw.json). Foundation preview, not DS implementation; visual conformity **Not evaluated**.
- Asset handoff pending: publish or attach exact PNGs only with separate authorization and verify downloaded bytes before using real URLs. No URL or approval is invented.

## Proposal and owner decisions

NotesBoard is a passive editorial organism, not a section frame or filtering control. Consumer content is composed from SectionHeader, static Chip and linked ListItem editorial rows; there is no built-in Pulso data, sorting, routing or filtering.

1. **API:** recommend consumer parts rather than structured note objects; Foundation `design-system/components/NotesBoard/README.md:12–19`, delivered `packages/ui/src/molecules/list-item/types.ts:56–105`.
2. **Chronology:** recommend native `ol` with direct `li`, single anchor and `<time datetime>`; host owns ordering and formatting (`reference-web/pulso-source.html:975–979`).
3. **Topics:** recommend static Chip in a named list, not selection ChipGroup. For genuine navigation use link Chip with real hrefs, never pretend to filter (`NotesBoard/README.md:32–36`; `packages/ui/src/molecules/chip-group/types.ts:66–70`; `scripts/catalog_data.py:107`). Catalog basis clarification is deferred.
4. **Sticky:** recommend opt-in, false by default, only above 1080px; use proposed token offset `--nav-height + --space-10` instead of the source's unapproved 42px and verify host occlusion (`packages/ui/src/styles/legacy/bundle.css:901–904`). New `board-sticky-side` / `sticky` boolean convention is pending separate approval.
5. **Breakpoint:** recommend explicitly approved NotesBoard-local ≤1080px viewport query; no default `md`, and CommunityCard's 48rem approval is scoped to that component (`docs/components/community-card/v0.1/responsive-breakpoint-amendment.md:3–7`).
6. **Heading:** recommend host section owns `aria-labelledby` pointing to the unique `titleId` on supplied SectionHeader (`packages/ui/src/molecules/section-header/types.ts:67–73`; `reference-web/pulso-source.html:967–971`); board is a div, not a nested landmark.
7. **Material:** recommend unpainted board content on the host SectionShell's Grafito register; reuse the existing raised ListItem and Chip recipes, not a board-level card (`docs/MATERIAL.md:75–80`; `odd/tasks/web-catalog.md` L27). SectionShell's remaining recipe decisions are separate.

Naming lookup: `skills/_shared/prop-naming.json` and `docs/prop-naming.md` by meaning/name/aliases. Proposed own `sticky` → new pending `board-sticky-side`. Native `children` and `className` need no convention. `collection-items` / `items` is applicable only to the unchosen structured alternative; `panel-header`, `heading-id`, `heading-title`, `heading-level`, `heading-eyebrow`, `trailing-text-accent`, `section-lede` and `slot-composition` do not name a board composition prop. No exception or registry mutation. Reviewed existing `SectionHeaderProps` source `packages/ui/src/molecules/section-header/types.ts` SHA-256 `5726750a3c95049bf2262524f7d11d504774fd67f3b7d4409e49b9641b1d6f0c`; `ListItemProps` `packages/ui/src/molecules/list-item/types.ts` SHA-256 `df2e05c470c79ad94bef1b06c87d118216ea601ebebe1d8aea6cff8c366cbe76`; `ChipProps` `packages/ui/src/atoms/chip/types.ts` SHA-256 `aac605536ebb3fce3185c76418509c18641a008a1f65d4488e39e648bd992b7a`. Future NotesBoard usage must cite real reviewed source.

Legacy `packages/ui/src/styles/legacy/bundle.css:896–904,329–344,1741–1742` collides with the public root and old parts/rows. Preserve it and its consumers; use distinct internal markers and locally neutralize root layout in the real shipped cascade before applying the approved layout. Browser computed-style and legacy-consumer tests are planned. No stylesheet is recommended only if utilities actually suffice; otherwise its compliant role and plan need approval.

**Approval scope:** resolving OQs and adopting the exact snapshot and visuals approves only the component contract, not implementation, convention, dependency, token, registry or catalog change. An implementation plan needs separate approval. Capture alone proves neither accessibility nor visual conformance.
