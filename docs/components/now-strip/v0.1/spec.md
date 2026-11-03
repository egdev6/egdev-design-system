# Component contract — NowStrip

- **Version / status:** 0.1 — **Proposed**, draft for owner review, not implementation-ready.
- **Approval / recovery:** Pending owner decisions and adoption of this exact payload and visuals. Catalog classification is approved in `docs/components/web-catalog/v0.1/owner-approvals.md`; capture authority is `odd/tasks/web-catalog.md` L6, L15, L25–L27. A plan requires separate approval.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: 6e083a20352345ed6d3b0317e13a114e2b83165568b518a4a0de6e18b32227c4`; `visualHashes: VIS-01 → 97ee91df0f13be6b2954dd7ab587cf8f1a372509cc86c97833ce1e0ecf566fbf; VIS-02 → 944e986359850ec614d27ee83eb27dba16558f61c66306a7eadcac451a18c031`; `approvalReference: Pending`; `canonicalIssue: Pending`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of UTF-8 bytes from the exact whole heading line `## 1. Purpose and scope` through EOF, including the final LF; metadata above is excluded.

## 1. Purpose and scope

Propose a reusable current-activity region in `@egdev/ui`: a visible, accessible group label and a responsive collection of consumer-authored NowCards. No Pulso names, copy, status, links, dates, meter values, polling, fetching or live announcements are built in. This is not a page section shell, project grid, data source, progress engine or a card implementation.

**Catalog / alternatives:** `scripts/catalog_data.py:77,108` records NowCard as a delivered molecule and NowStrip as an organism composing it. `packages/ui/src/index.ts:33,63,122-123,131-137` exports StatusDot, NowCard, Surface/surfaceVariants and Text; it has no NowStrip or Pixel. These inspected exports supersede stale availability descriptions in older general policy, not Material obligations. Reusing NowCard alone does not supply a labelled responsive group; a variant would add a region responsibility. Consumer composition is possible but repeats a reusable hierarchy and breakpoint in each view; the approved web-consumer amendment (`docs/CATALOGACION.md`, Web consumer amendment) permits generic composition without domain data. Nothing already hides this organism for extraction. Recommend a new organism at `packages/ui/src/organisms/now-strip/`; approval of classification is not approval of this API.

**Anatomy evidence:** read-only Foundation `design-system/components/NowStrip/README.md:1-32`, `preview.html:12-31`, `design-system/CONTRACT.md` organism inventory and `reference-web/pulso-source.html:190-208,885-919`. The Foundation README names structured `cards`, but the delivered card instead has explicit parts (`packages/ui/src/molecules/now-card/types.ts:24-109`). Source and captures are design evidence, not implementation or accessibility proof. `design-system/components/NowCard/README.md` and `Pixel/README.md` describe different meter geometry; do not assume four future Pixel atoms reproduce the source meter.

## 2. Anatomy and composition

| Part | Recommended responsibility | Element / content |
| --- | --- | --- |
| Root | Named, passive activity group and boundary | `div.eg-now-strip` with `role="group"`, `aria-labelledby` referencing visible label |
| Label | Consumer's short, non-empty group name | Internal `p` with per-instance `useId()`; `StatusDot state="live" pulse={false}` decorative, then label text |
| Grid | Three-up / single-column layout, direct items stretched | Internal grid `div`; ordered consumer-supplied `NowCard size="sm"` elements |
| Cards | Badge, title, copy, detail and action | Delivered NowCard / NowCardBody / NowCardFooter / NowCardDetail; consumer owns content, size and links |
| Boundary | Separate this region from what follows | Root bottom hairline and token bottom padding, not an interactive separator |

No child inspection, cloning, forced `size`, injected badges or translated copy. Consumers supply `size="sm"` themselves and arrange their own card parts; no fixed count, but three is the source scenario. Each direct grid child must be a NowCard and consumers must not use wrappers, margin or explicit height that defeat stretching. No Radix primitive is needed: passive grouping and child-owned native interactions need no custom keyboard model. `Text variant="eyebrow"` adds a diamond (`packages/ui/src/primitives/text/types.ts:25-29`), so it is not a substitute for the circular dot; use token typography without copying that decoration. StatusDot's live marker is 10px glowing rather than the source's static 8px dot; record this proposed visual difference, not pixel parity.

Only `eg-now-strip` is a stable public marker in this proposal. Avoid emitting legacy `eg-now-strip__label`, `__dot` or `__grid` on new internal nodes. Legacy CSS and consumers remain intact.

## 3. Public API

| Prop | Type | Required | Recommended contract |
| --- | --- | --- | --- |
| `label` | `string` | yes | Visible, non-empty localized text and accessible group name; no default Pulso copy. Blank/whitespace-only suppresses the entire group and warns in development. |
| `children` | `ReactNode` | yes | Ordered direct NowCard elements; consumer supplies `size="sm"`. Empty children produce a named empty group, no placeholder. Consumer owns keys and valid child composition. |
| `className` | `string` | no | Root outer margin, width and parent placement only; no paint, padding, internal grid, visibility or order override. |

Native `div` attributes are forwarded except `children`, `role`, `aria-label`, `aria-labelledby`, `aria-live`, `tabIndex`, `dangerouslySetInnerHTML` and `style`, which are protected to preserve the group name and passive semantics. No ref or `asChild`; no `cards`, `items`, `labelId`, size, data source, event or controlled state. Consumer-generated cards keep their native props and their own accessible headings. Empty, null and boolean children render no placeholders; the component does not validate arbitrary children or guarantee equal height for out-of-contract descendants.

**Naming lookup:** consulted `skills/_shared/prop-naming.json` and `docs/prop-naming.md` by meaning, name and aliases. `label` reuses approved `accessible-name` (it names the group and is visible), not `group-caption` (`caption` is explicitly distinct from the accessible name). `collection-items`/`items` is for component-rendered structured items and is not used for supplied React children; `slot-composition`/`asChild` means Radix Slot, not a children collection. `children` and `className` are native/React composition; no new convention or exception proposed. Existing source for group-label precedent: `packages/ui/src/organisms/tab-bar/types.ts`, `TabBarProps`, `sha256:0ea79ce6d91c30838af890c520786a1d1cd866b1d310b3579eff3d09e23ad672`. NowStrip source does not exist: future usage requires actual symbol review and whole-file hash, never a fabricated revision. Registry approval is separate from spec approval.

## 4. Behavior

| Given / action | Recommended observable result |
| --- | --- |
| Nonblank label, three valid direct cards | One labelled group, label then three cards in supplied DOM order; no default domain content |
| Blank label | Development warning and no group, dot or cards; never an unnamed group |
| No cards | Named group with empty grid; no mock content |
| Viewport ≤860 CSS px / >860px | One column / three equal minmax(0,1fr) columns, respectively; no reorder |
| Unequal card copy | Grid stretches direct cards to the tallest card in each row; body/footer placement remains NowCard-owned. Do not promise footer alignment until verified with delivered card. |
| Many cards, long text or resize | Natural row wrapping and card text wrapping; no truncation or implicit pagination |
| Footer action activated | Child Link/IconButton owns native behavior and focus; strip emits no event |

No automatic card sizing, status derivation, live region, interaction, focus movement, timer or animation. The host supplies appropriate heading ranks, meaningful labels, sizes, URLs, dates and optional announcements.

## 5. Accessibility

`role="group"` is named by its visible label through a unique `useId()`-generated ID; do not expose Foundation's fixed `labelId="now-t"`, which collides across instances. The text carries meaning; StatusDot is always `aria-hidden`, is static and communicates no independent live status. This is not `role="status"`, `aria-live` or an additional page landmark. NowCard retains its named article and heading, readable status badge, footer link or named icon action. Tab/Enter and focus belong to supplied actions; the strip has no tab stop or key handlers. No nested interactive controls. Consumer owns informative meter alternatives and time semantics; verify focus visibility, touch targets, contrast, zoom/reflow and assistive technology in a future browser gate, not by claiming capture conformance.

## 6. Appearance

- **Material / register:** recommend an unpainted layout group hosted on a separately approved Grafito reading surface, with a token-backed hairline boundary, not a new opaque card or Gauge's transparent-frame exception. The delivered NowCard independently composes public `surfaceVariants` surface-1/elevation-1 with a surface-0 footer band (`packages/ui/src/molecules/now-card/useNowCard.ts:75-110`; `docs/MATERIAL.md`, En la web). The Foundation glass-on-black card and static dot differ from delivered system Material and StatusDot. Approve the unpainted group/boundary recipe and host obligation explicitly in OQ-7; a show/black register needs a separately approved recipe. No new colors, tokens, dependencies, handwritten gradients or shadows.
- **Geometry:** recommend `gap-5` (source `--space-5`), `pb-6` and a `--color-border-hairline` bottom rule rather than legacy `--color-border-subtle`, subject to OQ-6/7. Label uses existing display/metadata typography tokens; retain semantic source/DOM order. The 860px **viewport** boundary is inclusive: propose component-local `max-[860px]:` only after explicit owner approval. Footer's 860px grant is Footer-only (`docs/components/footer/v0.1/spec.md`, OQ-3; `odd/tasks/web-catalog.md` L27); CommunityCard's 48rem grant is also local. No default `md:` exists. Verify built CSS and 859/860/861px.
- **Meter:** NowCard v0.1's owner-approved no-meter difference remains in force (`docs/components/now-card/v0.1/spec.md`, OQ-1; `odd/tasks/web-catalog.md` L16, L18). Pixel D7 is unwritten. Recommend no NowStrip dependency on Pixel and no built-in meter; if a later consumer meter is desired, it belongs in NowCard's footer and requires a separately approved NowCard footer contract amendment first. The delivered footer permits one `NowCardDetail` and/or one Link/IconButton (`types.ts:80-95`), not arbitrary meter content: this draft does **not** silently widen it. Until then omit the captured meter, an existing approved difference. Four Pixel atoms, skew geometry, role/name and accessible progress wording are not approved by this draft.
- **Legacy collision:** `packages/ui/src/styles/legacy/bundle.css:908-916` assigns root margin, padding-bottom and border; label assigns display, gap, margin, font, tracking, capitalization and color; dot assigns fixed geometry/color; grid assigns layout, gap and ≤860px media rule. Retain legacy intact. Use only root marker and distinct internal markers, locally neutralize or deliberately match every root declaration with static token-backed utilities at the actual cascade; then apply the approved boundary. Test computed CSS with shipped legacy bundle and both viewport sides, including multiple instances and old consumers. `cn()`/`twMerge` and class order do not defeat CSS layers or selector specificity. NowCard retains its own existing collision protections.
- **Composition / files:** static token-backed CVA in `types.ts`, per-part `cn()` in hook; root layout-only `className` merged last for recognized utility conflicts, not universal last-class-wins. No inline appearance or dynamic geometry. Six meaningful files: `types.ts`, `useNowStrip.ts`, `NowStrip.tsx`, `NowStrip.test.tsx`, `NowStrip.stories.tsx`, `index.ts`. **No stylesheet** recommended only if breakpoint and local neutralization actually compile and win; otherwise stop for a separately approved meaningful stylesheet role. No extra internal module.

### Expected-design visual references

| ID | Source / English alt | Status |
| --- | --- | --- |
| VIS-01 | [Desktop board](now-strip--variants--1280--dark.png): labelled three-card activity strip, two footer meters, a next-stream detail and bottom hairline. | Proposed; `97ee91df0f13be6b2954dd7ab587cf8f1a372509cc86c97833ce1e0ecf566fbf` |
| VIS-02 | [Narrow board](now-strip--variants--390--dark.png): the same activity strip with cards stacked vertically. | Proposed; `944e986359850ec614d27ee83eb27dba16558f61c66306a7eadcac451a18c031` |

Parent-provided Foundation `NowStrip/preview.html` (`sha256:e7b421d8722d877655125b648d90e8df0d3368590893f03b29ffc01afea2ddad`) captured read-only. Board `.pv` crop at 1280×1400 and 390×1400, DPR 2, dark, Chromium headless shell 1243, `en-US`, motion no-preference, animations disabled, recorded fonts loaded, 2026-11-03. Provenance, stylesheet hashes, exact timestamps and rectangles: `capture-raw.json` and `capture.json`. This worker did not recapture. The board includes a preview label; screenshots do not prove the 860 boundary, real responsive embedding, interaction, contrast, assistive technology or DS parity. Visual conformity **Not evaluated**; owner adoption and accessible asset publication with downloaded-byte verification remain pending. The source meter omission is an already approved NowCard difference; other differences and these visuals require owner adoption for NowStrip.

## 7. Acceptance criteria

All checks below are planned, not observed, and conditional on owner decisions.

| ID | Observable promise | Planned verification |
| --- | --- | --- |
| NS-01 | Named group references unique visible label; blank label suppresses output and warns; empty children remain named with no placeholder | public DOM/role tests including multiple instances and rerender |
| NS-02 | Direct consumer cards appear in supplied order, sm density is consumer-owned, no data or child cloning | render tests with real NowCards, empty and long content stories |
| NS-03 | StatusDot is hidden from AT, static, and text names group; no live region or root tab stop | role/name tests, keyboard tab sequence and reduced-motion browser check |
| NS-04 | ≤860 single / >860 three columns and per-row equal heights; wrap without clipping | shipped CSS browser geometry at 390, 859, 860, 861 and 1280px, uneven copy and zoom |
| NS-05 | Badge-first cards, accessible links/icon controls and NowCard footer remain unchanged | real-component composition and keyboard tests, named articles and links |
| NS-06 | Approved hairline, host register and all root legacy effects match chosen recipe without modifying legacy consumers | computed-style browser checks with shipped bundle; VIS-01/02 after adoption |
| NS-07 | No meter or Pixel dependency; possible future footer meter requires separate card amendment | dependency/static inspection, story with no fabricated meter |
| NS-08 | Compatible native forwarding and layout-only className obey protected semantics and merge limits | type/render tests and actual cascade checks |
| NS-09 | Six files, English JSDoc controls and static CVA scan; CSS works for packed consumer without Tailwind, React 18/19 | docgen, build and packed-consumer checks; browser Controls |

**Closure:** OQ-1–OQ-7, exact snapshot/visual approval, local breakpoint, group/boundary Material recipe, accessible image handoff and separately approved plan remain pending. No registry, catalog, code, token, dependency, legacy or remote change is authorized by this proposal.

## Blocking owner questions

1. **Composition:** consumer-supplied NowCards or structured `cards`/`items`? Recommend direct supplied cards, explicit `size="sm"`, no cloning or built-in Pulso data. Evidence: `design-system/components/NowStrip/README.md:12-16`; `packages/ui/src/molecules/now-card/types.ts:24-109`.
2. **Semantics and dot:** labelled group with visible required `label` and decorative static StatusDot, or a different landmark/status model? Recommend `role="group"`, `useId()` association and `StatusDot state="live" pulse={false}`; label carries meaning, no live region. Evidence: Foundation `NowStrip/preview.html:13-14`; `packages/ui/src/atoms/status-dot/types.ts:5-31`.
3. **Breakpoint:** local inclusive ≤860px viewport split, or another separately approved threshold? Recommend component-local 860px; Footer's grant is not transferable. Evidence: `packages/ui/src/styles/legacy/bundle.css:915-916`; `docs/components/footer/v0.1/spec.md` OQ-3; `docs/components/community-card/v0.1/responsive-breakpoint-amendment.md:3-7`.
4. **Equal heights:** stretch direct cards per grid row or leave intrinsic heights? Recommend stretch, with no out-of-contract wrappers and without promising footer alignment before browser verification. Evidence: `reference-web/pulso-source.html:197-204`; `packages/ui/src/molecules/now-card/types.ts:112-129`.
5. **Pixel meter:** defer meter or block NowStrip on D7? Recommend omit now as already approved NowCard difference; future consumer-supplied footer content needs a separately approved NowCard amendment and Pixel decision, never a NowStrip dependency. Evidence: `docs/components/now-card/v0.1/spec.md` OQ-1; `packages/ui/src/molecules/now-card/types.ts:80-95`; `odd/tasks/web-catalog.md` D7/L25.
6. **Bottom boundary:** retain source bottom hairline with token spacing or omit it? Recommend retain a decorative token-backed hairline and `--space-6` padding. Evidence: `design-system/components/NowStrip/README.md:19-21`; `packages/ui/src/styles/legacy/bundle.css:908-909`.
7. **Material register:** host-owned Grafito reading surface with an explicitly approved unpainted layout/boundary recipe, or a separately designed show-register treatment? Recommend the former; reuse delivered NowCard's solid surface-1 and surface-0 band, and record source glass/dot differences. Evidence: `docs/MATERIAL.md` Principles and En la web; `packages/ui/src/molecules/now-card/useNowCard.ts:75-110`.
