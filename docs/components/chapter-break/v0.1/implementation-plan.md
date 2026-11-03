# ChapterBreak v0.1 — implementation plan

- **Status:** Proposed for separate owner approval. This plan implements nothing and authorizes no code, tests, tokens, dependencies, registry, catalog, Git or remote changes.
- **Coverage:** EP2, **S3**, ChapterBreak only, not the complete web inventory. The [approved contract](spec.md) is issue [#324, approval 6606219423](https://github.com/egdev6/egdev-design-system/issues/324#issuecomment-6606219423), with all OQ recommendations approved. Canonical payload SHA-256 `e98d18fbac20bc0cee492829e69ddd5ecbe69b268f91760bf93d123493b67848`, from the complete `## 1. Purpose and scope` line through EOF including final LF. Frozen proposed/pending metadata and questions predate that decision; do not rewrite the spec or captures.
- **Plan identity:** Parent hashes final whole-file bytes including final LF and records the separate decision; changed bytes need renewed approval. Spec approval, plan approval, independent gates and future edit authorization are distinct.
- **References:** VIS-01 `e6610d8ec7b916f993157e424cb3766f7c18eebbaf10e4f12cf7a8ac388ae6b7`; VIS-02 `8c4cb2533067e57b290f8e7767e8133b68d17875afabd736af0ce9a6a4ff07f9`. Recommend separate adoption for surviving intent with differences below, subject to immutable byte and capture-provenance verification. Visual conformity **Not evaluated**.

## 1. Independent owner gates

1. **ChapterBreak-local geometry.** Recommend inclusive `width <= 860px` and square token-unit-capped media sizing in §3, independently of sibling approvals. Prove installed compiler emission before approval and browser behavior at 859/860/861 and fractional neighbors. Do not substitute `md:` or exclusive `max-[860px]:`.
2. **Material and host.** Recommend delivered `SectionShell register="show" wrap` as host, with its show recipe once, and delivered Heading hero and Text eyebrow; no ChapterBreak-owned handwritten glow, SVG drop-shadow, gradient or surface. Accept the existing Heading hero accent glow and typography, which differ from the source's title scale and SVG glow; a different host supplies its own background and no guaranteed halo. Verify actual contrast. A new recipe or fallback requires separate approval, not a duplicate halo or token/dependency change.
3. **Naming.** Recommend using only the existing approved conventions in §4, including `scene-media`; no new convention or exception is proposed. Approve the component usages separately from global convention receipts and verify current registry evidence during integration.
4. **Legacy collision.** Recommend `eg-chapter-break` as new root, never `.eg-chapter` or its part markers. Preserve the unlayered legacy CSS and its consumers; approve no stylesheet provided production and packed browser computed-style checks prove the new root and delivered children do not collide. If they do, stop for a separately approved compliant solution; no blanket `!important` or silent legacy migration.
5. **Visual adoption.** Recommend adopting VIS-01/02 for intent, explicitly accepting token-unit media cap, delivered typography and missing source SVG glow, conditional on capture provenance and equivalent comparison conditions. Adoption is not evidence of implementation or visual parity.
6. **Consumer obligations.** Recommend host-owned named section, unique heading ID and outline; consumer-supplied decorative nonfocusable media, effect lifecycle and fallback; and independently accessible surrounding controls with measured ≥44×44 CSS px targets and visible focus. ChapterBreak supplies no controls, generic children, CTA or runtime validation of these obligations.

## 2. Contract, composition and future files

Passive `div.eg-chapter-break` inside a host SectionShell: required `title: string` and `level: 1 | 2 | 3 | 4 | 5 | 6`; optional `eyebrow`, `accent`, `lede`, `media: ReactNode`, native heading `id` and placement-only `className`. Heading receives `id`, `variant="hero"`, `tone="canvas"`, `level`, `accent` and `accentBreak`; consumer supplies trailing title whitespace when the accessible accent name needs a separator. Host owns section anchor, `data-zone`, background, label and unique heading ID. Render copy before media in DOM; narrow layout visually orders media first. Optional parts are omitted without placeholder or fallback. No additional landmark, effect import, director, scroll, actions or generic `children`.

Inherit compatible `ComponentPropsWithoutRef<'div'>`, omitting `children`, `id`, `title`, `role`, `style`, `dangerouslySetInnerHTML` and conflicting own fields; filter protected inputs including `children`, `ref` and `asChild` even from untyped callers. No ref or root `asChild`. `cn()` merges supported outer placement utilities, not arbitrary appearance or universal CSS cascade. Nonempty title and decorative media are consumer obligations, not newly invented runtime validation. Never conceal interactive content in the `aria-hidden` media wrapper.

After every gate and explicit future authorization, six meaningful files under `packages/ui/src/organisms/chapter-break/`:

| File | Responsibility |
| --- | --- |
| `types.ts` | Public types, English JSDoc/Controls and static CVA per part. |
| `useChapterBreak.ts` | Optional-content derivation, safe forwarding and per-part `cn()`. |
| `ChapterBreak.tsx` | JSX using delivered Heading and Text and the decorative slot. |
| `ChapterBreak.test.tsx` | Public behavior and hook tests mapped to criteria. |
| `ChapterBreak.stories.tsx` | English autodocs and real host compositions. |
| `index.ts` | Named component and public types. |

**No stylesheet**, conditional on emission and cascade proof; no extra internal module. Parent owns shared integration files, package exports, scanning, metadata, registry and catalog. No dummy CSS or unapproved stylesheet role.

## 3. Static CVA recipe and compiler-proof inventory

These are the complete proposed literal CVA strings, not interpolated classes; no extra component utilities in JSX. Host wrap supplies the only page gutter. Use `Children.toArray(media).length > 0` as delivered Hero/Closing do; grid's `media` variant is selected from that same result and wrapper renders only when true. Thus `null`, `false`, `[]` and other empty React children leave one full-width track. Do not use truthiness or a permanently two-column grid.

| Part | Exact static CVA utilities |
| --- | --- |
| Root | `eg-chapter-break box-border w-full font-sans text-fg-default` |
| Grid base | `grid min-w-0 grid-cols-1 items-center gap-10` |
| Grid `media: true` | `grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] [@media(width<=860px)]:grid-cols-1 [@media(width<=860px)]:gap-2` |
| Grid `media: false` | empty string |
| Copy | `min-w-0` |
| Heading placement wrapper | `mt-5 mb-7` |
| Lede | `m-0 max-w-[52ch] font-sans text-body-large text-fg-default wrap-break-word` |
| Media wrapper | `relative mx-auto aspect-square w-[min(100%,58vh)] min-w-0 [@media(width<=860px)]:order-first [@media(width<=860px)]:w-[min(100%,34svh,calc(var(--space-24)*4))]` |

The media **width** caps a square: wide `min(100%, 58vh)`; narrow `min(100%, 34svh, 4 × --space-24)` (307.2px at current token value, not the source's 300px). This is a proposed token-compatible difference. Media must fit without forced descendant styling or inline geometry; verify real Isotipo3D and a decorative image. `aspect-square` is a candidate, not assumed emitted; `aspect-video` is known absent and not used. Delivered Heading owns its typography, accent and existing glow; spacing wrapper avoids unsupported Heading overrides.

**Exhaustive ChapterBreak-owned arbitrary or variant utility candidates:** `grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]`; `[@media(width<=860px)]:grid-cols-1`; `[@media(width<=860px)]:gap-2`; `max-w-[52ch]`; `w-[min(100%,58vh)]`; `[@media(width<=860px)]:order-first`; `[@media(width<=860px)]:w-[min(100%,34svh,calc(var(--space-24)*4))]`.

**Ordinary utilities to prove, including non-obvious emission:** `box-border`, `w-full`, `font-sans`, `text-fg-default`, `grid`, `min-w-0`, `grid-cols-1`, `items-center`, `gap-10`, `mt-5`, `mb-7`, `m-0`, `text-body-large`, `wrap-break-word`, `relative`, `mx-auto`, `aspect-square`. `eg-chapter-break` is a marker, not a utility. Parent proves every exact candidate above with the installed compiler **before approval**, inspecting declarations, token fallback/unit handling and media contexts, not just selector presence. Separately prove production source scanning and inherited Heading/Text/SectionShell utilities; they are not ChapterBreak CVA. Any added utility requires proof and renewed review. Earlier sibling probes are not proof of these exact candidates; no probe is claimed here.

## 4. Naming proposal

Reuse approved `heading-title` → `title`, `heading-level` → `level`, `heading-eyebrow` → `eyebrow`, `trailing-text-accent` → `accent`, `section-lede` → `lede`, and `scene-media` → `media`. `scene-media` is already approved by `docs/components/hero/v0.1/prop-naming-approval-scene-media.json`; its passive decorative ReactNode meaning matches ChapterBreak. Native `id` and `className` need no own convention. `effect-scene` selects a pose and `slot-composition` substitutes elements, neither describes media. Recheck name, meaning, aliases and approvals at integration; no new convention or exception, no invented receipt or source hash.

After explicit implementation authorization parent appends reviewed `ChapterBreakProps` usages to each matching approved entry through the existing registry workflow, with the actual `packages/ui/src/organisms/chapter-break/types.ts` whole-file SHA-256 and symbol, including **`postReceiptUsages` for `scene-media`** in the existing receipt-aware tests; preserve existing receipt hashes. Regenerate the registry reference and run its checks. No registry mutation is authorized by this plan.

## 5. Legacy and no-preflight collision inventory

Legacy `packages/ui/src/styles/legacy/bundle.css:726–736` uses `.eg-chapter`, `__grid`, `__copy`, `__lede` and `__slot`: root width, max-width, margins, gutters, font and color; grid tracks/gap/alignment; copy title margins; lede font/color/measure; slot square/caps, direct SVG drop-shadow and inclusive mobile layout/order. Never emit those markers on new parts. The distinct root avoids direct matching but does not prove composed Heading/Text/SectionShell selectors or host cascade: check actual `.eg-eyebrow`, `.eg-title`, accent and section selectors, margins, typography, color, grid tracks, media size and SVG filter in built and packed CSS. Compare untouched legacy ChapterBreak fixture before/after at wide and narrow with identical shipped styles. `cn()` cannot defeat unlayered specificity; no class-string-order assumptions or legacy edits.

No package preflight is shipped. The scene adds no controls; composed stories must use delivered controls only, never rely on native UA reset. Verify actual surrounding control background, border, font, decoration, focus and target rectangles; don't add blanket descendant resets. Preserve all delivered components and their Material treatments.

## 6. Test-first acceptance and preservation

Future implementation: add public-interface behavior tests for each applicable criterion and observe intended RED, implement minimum and capture focused GREEN; refactor only with tests green. Browser-only geometry/paint needs a failing built-CSS/browser assertion first where meaningful; otherwise record the specific RED limitation, never claim jsdom measures layout.

| Criterion | Planned RED → GREEN evidence |
| --- | --- |
| CB-01 | All six host-selected ranks, unique heading IDs on Heading only, one named host region and no extra landmark; multiple instances and rerender; no hardcoded copy. |
| CB-02 | Eyebrow, heading/accent, lede order and independent omission, accent accessible name with supplied whitespace; negative public types and untyped rejection for children/CTA. |
| CB-03 | Supplied media hidden and no focusable descendants in compliant examples; omitted, null, false and empty arrays yield no wrapper, fallback or second grid track; rerender between cases; no UI effects import or director, host effect integration separate. |
| CB-04 | Own SSR grid/media responsive classes, emitted CSS and Chromium inclusive/fractional boundaries, visual versus DOM order, square caps, absent media, long localized/unbroken text, narrow hosts and zoom without clipping. |
| CB-05 | Host Material/contrast and approved differences, computed root/child styles and SVG filter, unchanged legacy fixture, motion/transparency preferences and comparable adopted reference checks. |
| CB-06 | Composed host controls independently named, keyboard operable and visibly focused, actual hit rectangles ≥44×44; no claim ChapterBreak creates or guarantees controls. |
| CB-07 | Root marker, allowed native forwarding, heading-only ID, runtime and negative-type protected inputs, supported placement merge, docgen/Controls, static scan and packed React 18/19 consumers. |

PRESERVE: leave Heading, Text, SectionShell, effects and legacy unchanged; run relevant focused checks when separately authorized. If shared code must change, stop for scope and add preservation and differential public-interface evidence. Parent inspects integration merges for correct statement nesting and duplicate loops, not merely green tests.

## 7. Stories, package and catalog

`Organisms/ChapterBreak`, typed `Meta<typeof ChapterBreak>` / `StoryObj`, autodocs, English copy and no manual `argTypes`, `play` or rendering adapter. Default supplies required example `title` and `level` only; add OptionalCopy, NoMedia, DecorativeMedia, LongLocalizedContent, MultipleSections and Responsive. A named SectionShell host uses a unique `useId` heading ID; decorator adding it **must spread `context.args`** into `<Story args={{ ...context.args, id }} />`, so args are not replaced. Use decorative image `/brand/egdev-logo.png`, not `/egdev-logo.png`; story-only utilities such as `block h-full w-full object-contain` require an appropriate preview `@source` scan and compiler proof. Effects example is consumer-owned, no UI dependency. Any host controls use delivered components and actual measured targets; no bare control assumptions.

Own props need English control annotations: text inputs `@control text`, level `select`, media `false` with a concrete non-serializable reason and story reference; no fabricated defaults or native redeclarations. Check AST coverage, real docgen, extraction/enhancer/inference and zero owned diagnostics, then actual browser Controls.

After separate authorization parent integrates exports, production `types.ts` scan, preview story source, registry and fixtures. Test SSR/hydration, native restrictions and negative types with React 18/19 packed consumers using shipped tokens/UI CSS and **no consumer Tailwind compiler**. Assert actual declarations and media contexts in §3 and, critically, responsive classes on ChapterBreak's **own SSR grid and media elements**: siblings can emit identical CSS and conceal a missing class. Mutation-check each responsive class and built declaration including proper Tailwind `var()` fallback handling; separately verify inherited CSS. Run `pnpm props:docs`, `pnpm props:check`, `pnpm test:props` when authorized and preserve receipt-aware registry tests and shared-file structure.

Parent-only catalog after delivery and authorization: update ChapterBreak row in `scripts/catalog_data.py` to implemented organism and actual Heading/Text/SectionShell host composition, without implying an effects import or choreography. Run `python3 scripts/build_catalog.py` once to regenerate `docs/CATALOGO.md` and `docs/catalog.json`; do not edit generated files by hand.

## 8. Chromium gates, work units and stop lines

With shipped CSS, legacy, tokens and a packed no-Tailwind consumer, record browser/version, viewport, DPR, fonts, host register, preferences, screenshots and computed values:

- 859/860/861 plus fractional neighbors; 390/1280, narrow embedding, short viewport, resizing and 200% zoom: tracks and gaps, square/caps, visual media-first versus copy-first DOM, absent-media one track, long translations and unbroken text without clipping or overflow.
- Actual host and delivered-child Material, computed typography/margins, media SVG filter, contrast, reduced motion/transparency; inspect unchanged legacy fixture and no-preflight behavior. Compare VIS-01/02 only under equivalent known conditions; otherwise **Not evaluated**.
- Host landmark/name, selected heading level, unique ID and accent accessible name; media absent or `aria-hidden` with no focusable descendants. Screen-reader session is separate from accessibility-tree inspection.
- Surrounding consumer controls: Tab/Shift+Tab and activation, visible focus, actual contrast and ≥44×44 CSS px rectangles; no assumption that arbitrary controls or Button sizes automatically pass. Real Isotipo3D lifecycle and fallback remain host-owned checks.

**A — writer:** six files and criterion-level RED/GREEN following gates and scoped authorization. **B — parent:** exports, scans, metadata, reviewed naming usages, packed SSR/CSS mutation and shared-structure evidence. **C — parent:** catalog row and one generator run. **D — parent:** Chromium, assistive technology, visual and integration evidence, then separate delivery decision. Focused checks precede separately authorized broad suite, build or lint.

**Stop:** This proposed plan is not implementation authority. Stop for owner resolution if a gate, emission, inclusive boundary, square sizing, legacy cascade, contrast, target, host semantics or visual comparison cannot satisfy the contract. Do not add tokens/dependencies, edit legacy, invent inline geometry, force media styling, duplicate the glow, weaken semantics or silently add a stylesheet. All proposed compiler, package, browser, AT and adoption evidence remains unverified.
