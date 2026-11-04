# Component contract — ArticleFeature

- **Version / status:** 0.2 — **DRAFT**, awaiting exact owner approval (G4) and separate naming approval (G5); G1 and a separately approved implementation plan also gate source work.
- **Approval / recovery:** Pending. This file is the proposed snapshot, not evidence of approval. The historical [v0.1 specification](../v0.1/spec.md), [badge-name amendment](../v0.1/badge-name-amendment.md), and [implementation plan](../v0.1/implementation-plan.md) remain unchanged.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 → Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/280`; `latestPublishedComment: Pending for this snapshot`.
- **Hash definition:** SHA-256 of UTF-8 bytes from the exact heading `## 1. Purpose and scope` through EOF, LF and final newline included. Approval must identify this version, payload hash, visuals and scope.
- **Evidence and limits:** inspected `packages/ui/src/molecules/article-feature/{types.ts,useArticleFeature.ts,ArticleFeature.tsx,index.ts}`. The implementation has no `description` today. This proposal does not establish runtime or visual compliance. Historical v0.1 draft metadata is not evidence of v0.2 approval.

## 1. Purpose and scope

A molecule in `@egdev/ui` for one featured article as a whole-card link. Preserve all v0.1 promises and subsequent scoped amendments, except the explicit delta below; the linked historical documents remain the detailed baseline for cover warnings, recipes and acceptance. S3: “ArticleFeature -> añadir opción de texto descriptivo”.

**Delta:** add optional plain-text `description` on both anchor branches, after the heading and before the action label. Remove only the v0.1 non-goal “no article body copy”: a descriptive paragraph is now permitted, not arbitrary rich article content. Omission preserves the current card. No new interactive element, destination, layout variant, token, dependency or stylesheet is proposed.

**Cataloging:** extend the existing molecule; a visual variant does not add missing content, and composing arbitrary child copy conflicts with its controlled cover and single-link contract. Reuse the existing card rather than extract or create a second card. BlogGrid remains a separate organism.

## 2. Anatomy and composition

One native anchor or consumer anchor via Radix Slot; in order: optional `ArticleFeatureCover`, optional context paragraph, generated heading, proposed description paragraph, optional paint-only action label and decorative arrow. Cover retains its 2:1 AspectRatio, generative well/hidden word or `PhotoFrame ratio="auto"`, and optional solid brand Badge. Media wins over `coverWord` with development warning; a PhotoFrame with an explicitly incompatible ratio warns. One cover and no nested controls are consumer obligations. `eg-article-feature`, `eg-article-feature__cover`, `eg-article-feature__meta`, and `eg-article-feature__action` remain public markers. No Radix interaction primitive is needed for native navigation; Slot handles `asChild` composition.

## 3. Public API

| Input | Type and rule |
| --- | --- |
| `title` | Required `string`; blank warns in development and renders nothing. |
| `level` | `2 | 3 | 4 | 5 | 6`, default 3; heading rank independent of typography; invalid runtime rank falls back to 3. |
| `href`, `asChild` | Native branch requires `href: string` and `asChild?: false`; slotted branch requires `asChild: true`, `href?: never`, and one consumer anchor owning the destination. |
| `eyebrow`, `detail`, `actionLabel` | Optional `string`; blank values omitted. Detail is consumer-formatted factual context; action is paint only. |
| `description` | **Proposed** optional `string` on both branches, no default; whitespace-only omitted, otherwise plain text, not truncated. |
| `children` | Optional `ReactNode`: at most one cover; slotted composition requires one anchor. |
| cover `coverWord`, `badge`, `children`, `className` | Optional strings, ReactNode media and local-layout class respectively; media is one `PhotoFrame ratio="auto"`. Blank word/badge omitted. |
| root `className` | Optional outer placement, width and margin only. |

Native anchor attributes including `aria-label`, `aria-labelledby`, `target` and `rel` are forwarded; `role`, `tabIndex`, `style` and `ref` are protected/stripped at root. No ref API is promised. No controlled state or custom events; native anchor navigation remains. Exported component and type names stay unchanged. React 18/19 packed consumption remains a future verification gate.

**Naming:** [registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md), searched by name, meaning and aliases. Existing mappings: `heading-title`/`title`, `heading-level`/`level`, `heading-eyebrow`/`eyebrow`, `content-detail`/`detail`, `card-link-action-label`/`actionLabel`, `slot-composition`/`asChild`, `decorative-cover-word`/`coverWord`, `cover-badge`/`badge` (approved scoped exception `ArticleFeatureCover` → `badge`; see its registry approval). `href` is native. Proposed new `content-description`/`description`: optional short visible descriptive paragraph of a content unit, distinct from title and factual context detail; type `string`, ArticleFeature both branches. It is not `section-lede`, `content-detail`, or dialog-specific `dialog-description`; same name does not mean same semantics. Proposed, unregistered, no exception or approval. Reviewed existing source: `packages/ui/src/molecules/article-feature/types.ts`, symbols `ArticleFeatureLinkProps` and `ArticleFeatureSlottedProps`, revision `sha256:dd19b9b2a315dd9b854fed3cb7b62973f30fc81a330d156b88ed78a697cb63d6`; the new declaration is not yet present. Re-review changed source and record its new hash after separately approved implementation; G5 is independent of G4.

## 4. Behavior

Nonblank description renders after heading and before action, without truncation; blanks and absence produce no paragraph. Long text wraps and the existing action stays last with `mt-auto`. No-description output preserves existing structure. Context row appears only for nonblank eyebrow/detail, with an `aria-hidden` separator only when both exist. Cover precedence, warning paths, single native navigation, focus/hover and reduced-motion behavior remain as in v0.1. No own state or synthetic event is introduced; the consumer supplies content, destination, suitable image alternative and valid heading rank.

## 5. Accessibility

The anchor's content-derived accessible name includes visible badge, context, title, description and action label; decorative word, separator and arrow are hidden. `aria-label` or `aria-labelledby` may replace the content name. Informative image alt also contributes; use empty alt when redundant. One anchor is one tab stop; native Tab/Shift+Tab and Enter apply, with token focus indicator. No additional live announcements or keyboard model. Consumer must not nest controls and must provide a named anchor and correct outline.

## 6. Appearance

No new variant or size axis. Existing root uses `surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' })`, token-backed interactive hover surface-2/brand border, `focus-visible:shadow-focus`, and `motion-reduce:transition-none`; cover uses the existing well recipe. Proposed description is `text-body-default text-fg-secondary` (12.8 px / 1.6); no new token. Existing `mt-auto` action alignment remains. No inline appearance or dynamic geometry. Root and cover use per-part `cn()` with consumer class last only for documented layout; `twMerge` resolves recognized conflicts, not arbitrary cascade or appearance overrides. Internal parts have no consumer class surface. No stylesheet; existing six files retain their types/CVA, hook, JSX, test, stories and barrel roles, no extra module.

### Expected-design visual reference

| ID | Image / scenario | Provenance / status |
| --- | --- | --- |
| VIS-01 | Pending: described card at 390 px and wide width, long and absent descriptions, both anchor branches. | Expected-design source, theme, viewport height, browser, DPR, fonts, motion and crop pending owner agreement; no capture or approval. |

Historical [v0.1 VIS-01](../v0.1/spec.md#expected-design-visual-reference) is a proposed 1280×1400 dark Foundation board, not evidence of the new paragraph. Owner Image#11–#18 are conversation provenance only, not captures for this delta. Agree on source/conditions and separately authorize hosting and real Playwright component-zone capture, metadata and human adoption per [capture guide](../../../design/README.md). No image, hash or observation is asserted here. Visual conformity: **Not evaluated**.

## 7. Acceptance criteria

All checks are planned, not observed; v0.1 AF-01–AF-10 and its amendment remain applicable except the removed non-goal.

| ID / promise | Planned check |
| --- | --- |
| A3-AC1 | DOM order heading → description → action, `text-body-default text-fg-secondary`, action `mt-auto`; render and built-style checks. |
| A3-AC2 | Missing, empty and whitespace-only description omit paragraph and preserve no-description structure. |
| A3-AC3 | One anchor/tab stop, default name includes description; `aria-label` override replaces it; keyboard test. |
| A3-AC4 | Native href and `asChild` branches accept the same description without nested anchor. |
| A3-AC5 | Long description wraps without truncation or horizontal scroll at 390 px; real browser own-element computed styles, packed CSS and VIS-01. |
| AF-preserve | Existing title validation, context, cover warnings/badge, action, native attributes, focus/motion and root/cover layout merge remain; tests and packed consumer checks, including React 18/19. |
| AF-docgen | English `@control text` on both new declarations; docgen/Controls verification; after G5 registry update run `pnpm props:check` and `pnpm test:props`. |

**Owner decisions / blockers:** approve or reject the exact A3 text and changed non-goal (G1/G4); separately approve or reject `content-description` (G5); agree visual source/conditions and authorize capture/adoption. A separately approved implementation plan is required; this draft authorizes no source, registry, token, remote or capture work.
