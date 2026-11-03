# Component contract — BlogGrid

- **Version / status:** 0.1 — Proposed, draft for owner review; not approved or implementation-ready.
- **Approval / recovery:** Pending explicit approval of this payload and VIS-01/02. Catalog classification is approved in `docs/components/web-catalog/v0.1/owner-approvals.md`; capture authority is `odd/tasks/web-catalog.md` L6, L15, L25–L27. A plan requires separate approval.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: a1c7290bcb83c2462ae5466fc6773206df562df119f4222f4c315f9d47ebfd3b`; `visualHashes: VIS-01 → 5cb69f155170b623f59fe8e3b6d238bfb4650c0480f3e29f882af0007fa35165; VIS-02 → dbc0df77949721101322e0a196652fa9fcb60015eaf163212539df42ebd44a17`; `approvalReference: Pending`; `canonicalIssue: Pending`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of UTF-8 bytes from the exact whole heading line `## 1. Purpose and scope` through EOF, LF and final newline included. Metadata above is excluded.

## 1. Purpose and scope

Propose a reusable editorial section body, an organism in `@egdev/ui`: one featured article, related editorial rows and an archive link. No Pulso data, destinations, date formatting, fetching, routing, section background or header is built in. It is not a page, general listing or featured card. `scripts/catalog_data.py:82,110` classifies ArticleItem as absorbed by ListItem editorial and BlogGrid as an organism composing ArticleFeature and ListItem. The approved web-consumer amendment permits generic web building blocks without domain data.

**Alternatives:** reuse alone fails because ArticleFeature is a single card and ListItem a single row. A variant of either changes its responsibility. Host composition can reproduce the pattern but duplicates the feature/list layout in each view; a reusable composition is the approved catalog direction. No existing organism hides this structure to extract. Public exports in `packages/ui/src/index.ts` include ArticleFeature, ListItem, Link, SectionHeader and Surface; no BlogGrid. Historical availability prose in `docs/MATERIAL.md` predates these inspected exports, not a reason to deny them. Source evidence: Foundation `design-system/components/BlogGrid/README.md:1-32` and `preview.html:12-33`; `reference-web/pulso-source.html:1012-1053`; `design-system/CONTRACT.md:81`; `design-system/DECISIONES.md:23,42`. Foundation root is `/home/egdev/proyectos/egdev-website/egdev-foundation`, read-only. Visual evidence is not proof of DS parity.

## 2. Anatomy and composition

| Part | Proposed structure and responsibility |
| --- | --- |
| Root | `div.eg-blog-grid`, passive grid, not a link or landmark. |
| Feature | One consumer-supplied whole-card ArticleFeature link. |
| List column | A column containing an unordered list of editorial rows, then a separate archive link. |
| Rows | Each consumer-supplied row is wrapped in `li`; each is `<ListItem variant="editorial" asChild><a>…</a></ListItem>`. Meta, heading and destinations belong to the consumer. |
| Archive | Optional consumer-supplied standalone Link after the `ul`, never an `li` or inside another anchor. |
| SectionHeader | Composed by the host above, not owned by BlogGrid; SectionShell owns surrounding section and register. |

Recommended composition is passive: root and compound parts `BlogGridFeature`, `BlogGridRows`, `BlogGridRow`, `BlogGridArchive` receive consumer `children`. Feature and Rows each occur once, Row zero or more times inside Rows, Archive at most once. No descendant cloning or runtime inspection is promised. No nesting of interactive elements. Feature and each row are distinct anchors; ArticleFeature `actionLabel` is paint only, not a Link. Its badge participates in the default accessible name, per `docs/components/article-feature/v0.1/badge-name-amendment.md:3-9`. Correct row composition is documented in `docs/components/list-item/v0.2/observed/browser-check.md:13-15`; placing `asChild` on `li` and nesting an anchor is not equivalent. Host supplies names and correct heading ranks. A native list needs no Radix behavior; existing child components own their Slot and navigation behavior, without a new dependency.

Stable public root `eg-blog-grid` is retained; internal wrappers use distinct nonlegacy markers, not `eg-blog-grid__list` or `eg-blog-grid__all`. Existing legacy consumers and selectors remain untouched. Proposed compound parts are composition APIs, not public CSS selector APIs.

## 3. Public API

Conditional on OQ-1–OQ-6; parts are a recommendation, not an approved contract.

| Input | Type | Required / rule |
| --- | --- | --- |
| `BlogGrid.children` | `ReactNode` | Required; one Feature and Rows; optional Archive. |
| `BlogGridFeature.children` | `ReactElement` | Required; one ArticleFeature whole-card link, no extra link wrapper. |
| `BlogGridRows.children` | `ReactNode` | Required; zero or more BlogGridRow elements, preserving consumer order. Empty renders no `ul`; archive remains if supplied. |
| `BlogGridRow.children` | `ReactElement` | Required; one editorial ListItem rendered onto one anchor. Each Row provides the `li`. |
| `BlogGridArchive.children` | `ReactElement` | Required when part exists; one named standalone Link or equivalent anchor. |
| root `className` | `string` | Optional, outer placement/width/margin only; no arbitrary paint or part overrides. |

Native root `div` attributes are inherited via `ComponentPropsWithoutRef<'div'>`, excluding conflicting children and `dangerouslySetInnerHTML`; compatible `data-*` and `aria-*` forwarded. Parts accept only children; no ref, root `asChild`, custom event, data model or own state. Consumers supply stable React keys for repeated Rows; no uniqueness validation or automatic link checks is promised. Each supplied slot's semantic restrictions are consumer obligations, not enforceable ReactElement type guarantees. No implicit defaults or built-in content. New named exports and React 18/19 consumer support are future plan gates, not verified claims.

**Registry lookup:** `skills/_shared/prop-naming.json` and generated `docs/prop-naming.md` searched by meaning, name and aliases. General React `children` and inherited `className` are not own conventions; no own prop is introduced. Approved `collection-items`/`items` requires structured data, not ReactNode children; `slot-composition`/`asChild` is Radix element substitution, not compound children; `trailing-actions`/`actions` concerns control-area actions, not this archive navigation. `content-detail`/`detail` and `card-link-action-label`/`actionLabel` remain ArticleFeature inputs, not BlogGrid inputs. Structured alternative would reuse `collection-items` only if it defines a real entry shape; no exception or new convention is claimed. Reviewed existing APIs: `ArticleFeatureProps`, `packages/ui/src/molecules/article-feature/types.ts`, `sha256:dd19b9b2a315dd9b854fed3cb7b62973f30fc81a330d156b88ed78a697cb63d6`; `ListItemProps`, `packages/ui/src/molecules/list-item/types.ts`, `sha256:df2e05c470c79ad94bef1b06c87d118216ea601ebebe1d8aea6cff8c366cbe76`; `LinkProps`, `packages/ui/src/atoms/link/types.ts`, `sha256:b5e5ba0b47c7e53c9a3759888c1d746a82596537fd3834d1ca3dd2a4b05503f3`. There is no BlogGrid source revision to register. Convention approval is independent of spec approval.

## 4. Behavior

| Condition | Proposed observable result |
| --- | --- |
| Viewport above 1080 CSS px | Feature and list column share a stretched grid row, 7fr/5fr; list rows divide available height, archive remains after list. |
| Viewport at or below 1080 CSS px | One column, feature followed by rows then archive; no visual/DOM reordering. |
| Rows with varying content | In wide layout `ul` takes remaining column height and its `li` children share growth; each row anchor fills its `li`. Content can increase overall height, never clip. In stacked layout rows flow naturally. |
| Empty rows / absent archive | Empty list is omitted, no placeholder; archive omitted only when not supplied. Feature remains. |
| Activation / focus | Native anchors own navigation and focus; no wrapper click handler, event forwarding, keyboard model or extra tab stop. |
| Long content / narrow host | Wrap and grow without clipping or horizontal scrolling; verify rather than infer from screenshot. |

No fixed count or maximum: Foundation recommends three, not an enforced bound. Host owns ordering, localization, URLs, data and any loading/empty UI. Reduced motion is delegated to the child recipes; this layout introduces no animation. Controlled/uncontrolled state and announcements: Not applicable, passive composition.

## 5. Accessibility

`ul` contains only `li` rows; archive remains outside the list and feature is a sibling of the list column. Root is not a region, `article`, or interactive control; host's named section and heading provide context. Reading and tab order are feature → rows → archive, whether stacked or wide. Each link has a descriptive consumer-provided name; ArticleFeature's default name includes visible badge, context, heading and action label, while decorative cover word and arrow stay hidden. Each editorial `li` contains a single anchor through ListItem Slot; no nested anchors, buttons or `ListItemActions`. Native Tab/Shift+Tab and Enter apply; focus indicator and touch target belong to existing links. Host chooses valid heading ranks and image alternatives. Screen reader, contrast, zoom and touch checks are pending; no conformity is claimed.

## 6. Appearance

- **Layout:** Foundation `BlogGrid/README.md:19-23` and legacy `packages/ui/src/styles/legacy/bundle.css:923-927` specify `minmax(0,7fr) minmax(0,5fr)`, `--space-5` gap and `align-items:stretch`, column gap `--space-3`, and archive top margin `--space-2`. Proposed list uses flex column with `flex:1` on each `li` and a full-height child anchor, not legacy's direct `.eg-article` selector; reserve the archive's intrinsic height outside `ul`. Ensure `min-width:0`, content-driven minimum heights, no clipping; test unequal/long content and empty rows. At ≤1080px use single column and natural row heights. The breakpoint is viewport-based, not container-based.
- **Breakpoint prerequisite:** ask explicit approval for a static BlogGrid-only 1080px boundary; there is no default `md` breakpoint and CommunityCard's 48rem approval is scoped (`docs/components/community-card/v0.1/responsive-breakpoint-amendment.md:3-7`). Verify 1079/1080/1081 CSS px in emitted CSS and a real browser, including narrow embedding. Do not add tokens or assume another component's approval transfers.
- **Material:** section content is unpainted over the host's separately approved SectionShell register; feature and editorial cards keep their existing solid surface-1/hover surface-2 recipes via the public Surface/surfaceVariants compositions. No new flat card, wrapper Surface, glass, halo, hand-authored gradient, shadow or Gauge exception. Host chooses the SectionShell register; no assumption that SectionShell is already implemented. `docs/MATERIAL.md` web section calls for solid cards in Grafito. Visual differences from the legacy preview are inherited ArticleFeature/ListItem adaptations, not proof of parity.
- **Legacy collision:** root `.eg-blog-grid` independently applies the 7fr/5fr grid, gap, stretch and ≤1080px media rule (`bundle.css:923,927`). Retain it for old consumers. New markup avoids `__list`, direct `.eg-article`, and `__all`; their legacy flex, row growth, alignment and margin (`:924-926`) must not leak into new internals. Locally neutralize or deliberately override the root's grid columns, display, gap and alignment at both sides of the breakpoint with static intended-cascade utilities, then apply the approved layout; do not depend on class ordering or `twMerge` to defeat unlayered legacy CSS. The exact neutralization strategy and emitted cascade must be verified with shipped `@egdev/ui/styles.css`; if utilities cannot win without an exception, stop for an approved scoped stylesheet role. Never edit legacy CSS as part of this proposal.
- **Composition:** CVA in `types.ts`, per-part `cn()` in hook; root `className` only for outer layout, merged last for recognized utilities, without universal cascade precedence. No inline appearance or dynamic geometry. Six meaningful files proposed under `packages/ui/src/organisms/blog-grid/`: `types.ts` (types/CVA/JSDoc controls), `useBlogGrid.ts` (composition and class derivation), `BlogGrid.tsx` (JSX), tests, stories and `index.ts`. No extra module. **No stylesheet** recommended only if static responsive utilities and local legacy neutralization actually compile and win; otherwise a meaningful scoped role requires separate approval. No token, dependency or catalog changes authorized.

### Expected-design visual references

| ID | Image | Scenario / SHA-256 |
| --- | --- | --- |
| VIS-01 | [Desktop-width preview board](blog-grid--variants--1280--dark.png): Blog eyebrow and display title, featured generative cover card, three editorial rows and archive link. | `5cb69f155170b623f59fe8e3b6d238bfb4650c0480f3e29f882af0007fa35165`; proposed |
| VIS-02 | [Narrow preview board](blog-grid--variants--390--dark.png): same composition on a narrow board. | `dbc0df77949721101322e0a196652fa9fcb60015eaf163212539df42ebd44a17`; proposed |

Parent supplied Foundation preview captures and `capture-raw.json`; no recapture. `preview.html` SHA-256 `9b80adcd2b2d46661f8557afc23d65b967d3dc7e8e577f11d1d906a58d8ea4b4`. Chromium headless shell 1243, dark, en-US, DPR 2, motion no-preference, animations disabled, fonts loaded, `.pv` board crop; 1280×1400 and 390×1400, 2026-11-03; full provenance in `capture.json`. The board explicitly labels its example one-column at its width; even VIS-01 is not proof of a two-column layout. Neither image validates interactive behavior, Material adaptation, breakpoint, real screen reader or implementation. Visual adoption and accessible immutable asset handoff are pending; conformity **Not evaluated**.

## 7. Acceptance criteria

All checks below are planned, not observed; owner decisions and separate plan required.

| ID | Promise | Planned method / story |
| --- | --- | --- |
| BG-01 | Feature, rows and optional archive preserve supplied content/order; zero rows omit the list, no placeholders or built-in data | Public DOM tests; Default, EmptyRows, WithoutArchive |
| BG-02 | `ul > li` row structure; separate archive; whole-card and row anchors with no nested controls, correct badge-derived name | Role/name and DOM tests, Tab/Enter browser checks; ComposedLinks |
| BG-03 | ≥/≤ boundary as specified; 7fr/5fr and equal distributed row heights with archive excluded; natural stack and long content growth | Built CSS and browser at 1079/1080/1081, content/empty cases; Wide, Narrow, LongContent |
| BG-04 | SectionHeader and SectionShell remain host-owned, no extra landmark, child Material/focus/motion intact | Integration stories and browser computed-style tests, including reduced motion; VIS-01/02 |
| BG-05 | Stable root and local neutralization coexist with unchanged legacy, expected columns/gaps at boundary; permitted root class merge only | Packed-consumer browser with shipped stylesheet, cascade checks and CSS build/static scan |
| BG-06 | English part docs/controls, native forwarding, no claimed refs and package consumption with React 18/19 without Tailwind | Docgen/Controls, type checks, packed-consumer build and browser |

**Closure:** OQ-1–OQ-6, exact payload and visual adoption, local breakpoint, asset publication and separately approved plan remain pending. No implementation, registry, catalog, token, dependency, legacy or remote change follows from this draft.

## Blocking decisions for the owner

| ID | Question / evidence | Recommendation |
| --- | --- | --- |
| OQ-1 | Supplied feature and row elements or structured article data? Foundation `BlogGrid/README.md:11-17` proposes `feature`, `articles`, `allLink`; catalog `scripts/catalog_data.py:110` names composed molecules. | Supply compound children: reuse existing flexible components and router anchors, no built-in Pulso data or duplicate article model. Alternative structured items would require an explicit entry schema and `collection-items` review. |
| OQ-2 | Preserve wide 7fr/5fr stretching and viewport ≤1080px stack, or choose a different responsive rule? `BlogGrid/README.md:19-23`; legacy `bundle.css:923-927`; CommunityCard amendment `:3-7`. | Approve the component-local 1080px breakpoint and distribute free list height among `li` rows; allow natural expansion for long content and natural row heights when stacked. Test actual emitted CSS; 48rem is not transferable. |
| OQ-3 | Should related rows form a semantic list and where should archive go? Foundation `preview.html:25-30` uses a div of anchors followed by archive. | Use `ul > li` for related rows, archive as a sibling after `ul`, with feature outside the list; preserve visual and keyboard order. |
| OQ-4 | How are whole-card, row and archive links composed? `article-feature/types.ts` (`ArticleFeatureProps`, `actionLabel`); `list-item/v0.2/observed/browser-check.md:13-15`. | Keep three independent anchor kinds; ArticleFeature action is paint only, rows use `<li><ListItem asChild><a>…</a></ListItem></li>`, archive stands alone; never nest links. |
| OQ-5 | Is SectionHeader part of this organism or host composition? `BlogGrid/README.md:8` places it above and outside; `preview.html:13-18` shows it. | Host composes SectionHeader above BlogGrid and supplies a correctly named surrounding section; do not add its props or duplicate its heading. |
| OQ-6 | Should BlogGrid paint its own surface or inherit the SectionShell register? `docs/MATERIAL.md` web section; `article-feature/v0.1/spec.md` §6; `scripts/catalog_data.py:110`. | Keep the layout wrapper unpainted over host SectionShell, with existing ArticleFeature and ListItem Material recipes; no cloned Surface or glass. SectionShell is separately approved as a spec, not assumed implemented. |
