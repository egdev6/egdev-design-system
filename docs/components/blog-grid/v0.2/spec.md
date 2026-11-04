# Component contract — BlogGrid

- **Version / status:** 0.2 — **DRAFT**, awaiting exact owner approval (G4), applicable G1 and separate description naming approval (G5); source work also needs a separately approved plan.
- **Approval / recovery:** Pending. This snapshot preserves the detailed [v0.1 spec](../v0.1/spec.md) and [implementation plan](../v0.1/implementation-plan.md); neither historical metadata nor this file proves v0.2 approval.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 → Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/296`; `latestPublishedComment: Pending for this snapshot`.
- **Hash definition:** SHA-256 of UTF-8 bytes from exact heading `## 1. Purpose and scope` through EOF, LF and final newline included. Approval binds version, payload, visuals and scope.
- **Evidence:** inspected `packages/ui/src/organisms/blog-grid/{types.ts,useBlogGrid.ts,BlogGrid.tsx,index.ts}` and `packages/ui/src/molecules/list-item/ListItem.tsx`. Current code provides passive compound parts, not a description prop; the ArticleFeature proposal is not implemented.

## 1. Purpose and scope

An `@egdev/ui` organism composing one featured article, editorial rows and optional archive, without domain data or section heading. S9: “BlogGrid -> añadir opciones de descripción a moléculas y organismos”.

**Exact delta:** feature descriptions use proposed `ArticleFeature.description` (A3); described rows use existing `ListItem` → `ListItemBody` → `ListItemTitle` plus `ListItemContent` inside the existing `BlogGridRow`. No BlogGrid prop, part, data model, stylesheet or architecture change. Host-owned `SectionHeader` keeps the section heading and lede; a grid-level lede is rejected because it duplicates that responsibility. Retain every unchanged v0.1 promise and applicable approved implementation-plan decisions; the linked v0.1 is the detailed baseline, not a new approval.

**Cataloging:** reuse existing compound composition and ListItemContent; a visual variant cannot provide the missing copy. No extraction or new organism is needed.

## 2. Anatomy and composition

| Part | Element and content |
| --- | --- |
| `BlogGrid` | Passive `div.eg-blog-grid`, not a landmark; ordered supplied parts. |
| `BlogGridFeature` | `div`, one consumer ArticleFeature link. |
| `BlogGridRows` | `ul`, zero or more keyed `BlogGridRow`; ordinary empty collection omits list. |
| `BlogGridRow` | `li`, one editorial ListItem slotted onto an anchor. Body contains title and optional ListItemContent description. |
| `BlogGridArchive` | `div`, optional standalone named link after the list, not inside it. |

The host supplies one feature and rows part, at most one archive, a named surrounding section and heading. Parts do not inspect or enforce child types at runtime; no nested controls. No new Radix interaction: child links own Slot and native navigation. Root marker stays public; compound wrappers are not additional public selector APIs, and legacy selectors remain untouched.

## 3. Public API

| Input | Type / responsibility |
| --- | --- |
| `BlogGrid.children` | Required `ReactNode`: Feature, Rows, optional Archive in reading order. |
| `BlogGridFeature.children` | Required `ReactElement`: one whole-card ArticleFeature. |
| `BlogGridRows.children` | Required `ReactNode`: zero or more keyed rows. |
| `BlogGridRow.children` | Required `ReactElement`: one editorial ListItem on one anchor. |
| `BlogGridArchive.children` | Required `ReactElement` when present: one independent named anchor. |
| root native props / `className` | `ComponentPropsWithoutRef<'div'>` excluding `children` and `dangerouslySetInnerHTML`; compatible attributes forwarded, class for outer placement/width/margin only. Parts expose children only. |

No ref, root `asChild`, state, custom event, default content or own description prop. Consumer controls children, keys, links and localization. Current barrel exports all five components and corresponding types; retain them. React 18/19 packed consumption remains a verification gate.

**Naming lookup:** [registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md) reviewed by name, meaning and aliases. No new BlogGrid own prop or exception: general `children` and inherited `className` need no convention. `collection-items` describes structured items, not these children; `slot-composition` describes Radix substitution, not compound slots; `section-lede` belongs to the host. The feature uses proposed `content-description`/`description`, type `string`, independently pending G5; it is not a BlogGrid prop. Existing ArticleFeature mappings include `content-detail` and `card-link-action-label`. Reviewed sources: `BlogGridProps` in `packages/ui/src/organisms/blog-grid/types.ts`, `sha256:ae21a77805bb9db1767e7a48461d0149f928ecb40352500fa23d7785c80913bc`; `ArticleFeatureProps` in `packages/ui/src/molecules/article-feature/types.ts`, `sha256:dd19b9b2a315dd9b854fed3cb7b62973f30fc81a330d156b88ed78a697cb63d6`. New description declaration is not present; re-review after implementation. No registry edit or convention approval is implied.

## 4. Behavior

Feature → rows → archive remain in supplied DOM and reading order. Above 1080 CSS px use stretched 7fr/5fr layout, rows share available space and archive stays outside the list; at or below 1080 px stack naturally. Long content grows and wraps without clipping; no fixed row count. No rows omits the ordinary empty list, with archive unaffected; no archive means no archive wrapper. Child anchors handle navigation without wrapper click handlers. No state, loading model, formatting or synthetic announcements; host owns these concerns. Described rows and feature preserve their source text without truncation and remain distinct links.

## 5. Accessibility

A native `ul` contains `li` rows; feature and archive are separate. Root adds no landmark. Host provides a named section, descriptive link names, valid heading levels and image alternatives. Feature, rows and archive are separate tab stops in DOM order; no nested anchors/buttons or `ListItemActions` inside a row anchor. Native Tab/Shift+Tab and Enter and child focus indicators apply. Description contributes to link name unless the consumer supplies an accessible-name override. No live announcement is introduced; contrast, zoom, touch and screen-reader checks are planned, not claimed.

## 6. Appearance

No variant axis. Root recipe uses `grid-cols-[minmax(0,7fr)_minmax(0,5fr)]`, `gap-x-5`, `items-stretch`, with `[@media(width<=1080px)]:grid-cols-1` and `gap-y-5`; list uses `gap-3` and archive `mt-2`. Above boundary row items grow equally, without clipping long content. Feature uses the A3 `text-body-default text-fg-secondary` description; row text uses delivered ListItemContent, not a newly invented grid typography recipe. Wrapper is unpainted; child ArticleFeature and editorial ListItem retain existing Material surface/focus/motion recipes. No new tokens, gradients, shadows, dynamic geometry or inline appearance.

Root `className` is merged last through `cn()` for outer layout only; parts have no public className. `twMerge` resolves recognized utilities, not arbitrary cascade or appearance overrides. Existing legacy `.eg-blog-grid` collision must be checked in shipped CSS at both sides of the boundary; if static utilities cannot establish the intended cascade, stop for separately approved scoped stylesheet role. **No stylesheet** is the current proposal, contingent on that check; no legacy changes. Existing six files retain types/CVA, hook, JSX, tests, stories and barrel roles; no extra internal module.

### Expected-design visual reference

| ID | Image / scenario | Provenance / status |
| --- | --- | --- |
| VIS-01 | Pending: feature and described rows at 390, 1080, 1081 and 1280 px, including long content and archive. | Expected source and capture conditions pending owner agreement; no capture or approval. |

Historical [v0.1 VIS-01/02](../v0.1/spec.md#expected-design-visual-references) are proposed Foundation boards at 1280 and 390, not proof of described rows or two-column behavior. Owner Image#11–#18 are conversation provenance only. Agree source, theme, browser, viewport height, DPR, fonts, motion and crop; separately authorize real component-zone capture, metadata and adoption under the [capture guide](../../../design/README.md). Visual conformity **Not evaluated**.

## 7. Acceptance criteria

All checks planned, not observed. Preserve v0.1 BG-01–BG-06 and applicable plan decisions.

| ID / promise | Planned check |
| --- | --- |
| A9-AC1 | Feature description and `ListItemContent` rows render in DOM/reading order, wrapping without truncation; public DOM tests and browser VIS-01. |
| A9-AC2 | Each described row remains one anchor and one tab stop; role/name, Tab and Enter tests. |
| A9-AC3 | Unequal and long content retain stretched row alignment and archive position; packed CSS and browser measurement. |
| A9-AC4 | 390, 1080, 1081 and 1280 px retain approved stack/grid boundary; browser own-element computed styles and emitted CSS. |
| BG-preserve | Empty rows, missing archive, native forwarding, host heading/section ownership, child focus/motion, stable root and permitted merge remain; public tests and packed browser cascade. |
| BG-composition | No new prop or part; existing exports and React 18/19 packed consumers preserved; docgen and package checks. |

**Owner decisions / blockers:** approve or reject the exact A9 composition and host-owned lede (G1/G4); separately resolve ArticleFeature `content-description` naming (G5). Agree expected visual source/conditions and authorize capture/adoption. A separately approved plan is required; this draft authorizes no source, registry, token, remote or capture work.
