# Hero v0.1 — implementation plan

- **Status:** Proposed for separate owner approval; this document implements and authorizes no code, test, registry, catalog, token, dependency, Git or remote change.
- **Coverage:** EP1, **S3** of the [web catalog task](../../../../odd/tasks/web-catalog.md), Hero only; not the full inventory, Closing, or implementation.
- **Approved contract:** [Hero v0.1](spec.md), issue [#318, approval 6603972316](https://github.com/egdev6/egdev-design-system/issues/318#issuecomment-6603972316), owner “Aprobar con las recomendaciones (Recomendado)”. Canonical payload SHA-256 `6456ca97c64569b0e66df4fe1d5b6ceb4563b312dec42b580f48858f45a15116`, from the complete `## 1. Purpose and scope` line through EOF including final LF. The Proposed/Pending header and closure are historical metadata, not a reversal of that approval. All OQ recommendations were accepted; implementation still needs its own plan and gates.
- **Plan identity:** Parent hashes the entire final plan file bytes including final LF and records the separate owner decision, following [layer (d) approvals](../../web-catalog/v0.1/layer-d-plan-approvals.md). No self-hash; changed bytes require renewed approval.
- **Visual references:** VIS-01 `f8b7958e926cb1d6cbacb880fd27dda11e2ab0c129bc038548fb10756043327b`; VIS-02 `2230fbbb5dda1b87717b23ecae6b93ee25d06f5881d36cfb5438e6f7fcba5417`. Recommend separately adopting surviving scene intent with consumer-owned decorative media, no source SVG shadow or floating pixels and token-scale spacing differences. Recover capture conditions and compare only under equivalent conditions; visual conformity **Not evaluated**.

## 1. Independent owner gates

Record each decision independently of plan approval, future edit authorization and visual adoption.

1. **Local responsive geometry.** Recommend Hero-only inclusive `width <= 860px` and `width >= 961px`, exact static variants and square sizing in §3. Between them retain two columns and a 62vh cap. Use existing space tokens for absolute caps, not the source's hardcoded 300/560px. This is a bounded local geometry proposal, not a new theme breakpoint or a general inline-geometry exception. Prove every emitted candidate and computed boundary, including fractional widths, small heights and narrow embeds. Do not substitute exclusive `max-[860px]:` or unproven `md:`.
2. **Material and host.** Recommend the delivered `SectionShell register="show" wrap` and canvas `Heading variant="hero"` token-backed accent glow, plus delivered Text, Button and SocialLinks as in §3. The show halo belongs to SectionShell, not Hero; no extra title glow, SVG drop shadow or floating artwork. Verify actual contrast over the real backdrop and Button material; if the existing recipe cannot meet it, stop for a separate recipe/host decision rather than invent paint or alter tokens.
3. **Naming.** Recommend independently approving the exact `scene-media` and `scene-social` conventions in §5. Spec approval does not approve registry conventions. No invented source hashes, aliases, exceptions or automatic promotion.
4. **Legacy and no-preflight cascade.** Recommend bounded utility resets and distinct new internal parts in §4, with **No stylesheet** only if production and packed Chromium computed-style checks prove it. Preserve old CSS and consumers. If the actual cascade cannot win, stop for a separately approved meaningful scoped stylesheet role; no `!important`, legacy rewrite or class-order assumption.
5. **Capture adoption.** Recommend separate adoption of VIS-01/02 for surviving intent and explicit differences above, not exact source parity or accessibility proof. Recover missing browser/font/preference metadata and report any incomparable reference as Not evaluated.
6. **Consumer obligations.** Recommend retaining the approved passive slot contract: zero to two independent named CTAs, at most one primary, decorative nonfocusable media and a properly named social group. Hero does not inspect or clone children or validate those obligations. Verify real composed controls' ≥44px targets, focus, keyboard and contrast; if delivered Button/Link cannot satisfy a story without unsupported overrides, stop for an owner decision rather than silently changing their API.

## 2. Contract and ownership

`Hero` is a passive `div.eg-hero`, not a section, page, director, effects import, router or Radix primitive. Required `title: string` and `level: 1 | 2 | 3 | 4 | 5 | 6`; optional `eyebrow`, `accent`, `lede`, CTA-only `children`, decorative `media`, `social`, heading `id` and root placement-only `className`. Copy comes first in DOM, media second; at narrow widths media is visually first. Missing optional content omits its wrapper; absent media selects a one-column root at every width. Normal null/false/empty arrays may be treated as absent; opaque components rendering nothing cannot be detected without inspection. No default artwork, text, action or social destination. Consumer supplies whitespace in `title` where needed before the block accent, because Heading inserts none.

Host composes `<SectionShell register="show" wrap aria-labelledby="hero-heading">` and `<Hero id="hero-heading" ...>`; the ID is on Heading, not the root. Host supplies unique IDs, section anchor/`data-zone`, outline, contrast backdrop, effect lifecycle and valid localized names. No duplicate section, wrapper/gutters, or h1 assumption. `media` is `aria-hidden` and must contain no focusable or meaningful content; consumer owns Isotipo3D fallback and reduced-motion behavior. No runtime descendant inspection, enforcement, parsing or cloning; no refs, root `asChild`, callbacks, state or choreography. Inherit compatible `ComponentPropsWithoutRef<'div'>` excluding `children`, `id`, `role`, `style`, `dangerouslySetInnerHTML` and conflicting props; enforce protections at untyped boundaries. `cn()` merges recognized layout classes only, not universal cascade/appearance precedence.

After gates and later scoped authorization, six meaningful files under `packages/ui/src/organisms/hero/`:

| File | Responsibility |
| --- | --- |
| `types.ts` | Public types, English JSDoc/controls and static per-part CVA recipes. |
| `useHero.ts` | Optional-slot presence, grid selection and per-part CVA/`cn()`; no fake state or effects. |
| `Hero.tsx` | JSX only; exact semantic composition and forwarding. |
| `Hero.test.tsx` | Public behavior and meaningful hook tests. |
| `Hero.stories.tsx` | English autodocs and real composition examples. |
| `index.ts` | Named component and public type exports. |

No extra internal module. **No stylesheet**, conditional on §4 cascade proof. Parent owns package exports/scans, registry, catalog and integration fixtures; no dependency or token changes are proposed.

## 3. Static CVA inventory, geometry and Material

The following is the complete proposed **Hero-owned** literal utility inventory, per part; no dynamic interpolation. CVA selects the media-present root variant, not a mirrored state class. Parent proves all entries in the following list with the installed compiler before approval, including ordinary utilities: theme availability and shorthand emission are not assumed.

| Part | Exact static classes |
| --- | --- |
| Root base | `eg-hero box-border w-full max-w-none mx-0 px-0 grid grid-cols-1 items-center gap-8 font-sans text-fg-default` |
| Root with media | `grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] [@media(width<=860px)]:grid-cols-1 [@media(width<=860px)]:gap-4` |
| Copy | `min-w-0 flex flex-col items-start` |
| Eyebrow wrapper | `mb-5 [@media(width>=961px)]:mb-3` |
| Heading wrapper | `mb-7 [@media(width>=961px)]:mb-5` |
| Lede | `m-0 max-w-full font-sans text-body-large text-fg-secondary wrap-break-word` |
| Actions | `flex flex-wrap gap-3 mt-8 mb-10 [@media(width>=961px)]:mt-7 [@media(width>=961px)]:mb-8` |
| Social | `min-w-0` |
| Media outer | `min-w-0 flex items-center justify-center [@media(width<=860px)]:order-first` |
| Media slot | `w-full aspect-square max-w-[62vh] mx-auto [@media(width<=860px)]:max-w-[min(34svh,calc(var(--space-24)*4))] [@media(width>=961px)]:max-w-[min(56svh,calc(var(--space-24)*7))]` |

The media slot is square because **width**, not just height, is capped: `aspect-square` yields equal dimensions while `w-full` respects the available track. At ≤860 its width is at most the lesser of 34svh and four `--space-24` units; at ≥961, 56svh and seven units; in between 62vh. These token-derived absolute caps intentionally differ from Foundation's 300/560px; media sizing is a local owner gate, not authorization for arbitrary dimensions elsewhere. At ≤860 the outer flex part moves visually before copy but remains after it in DOM. Without media, do not emit the media-present grid variant; copy fills the one column. Verify ordinary `aspect-square` specifically; **do not use `aspect-video`**, which did not emit under this theme (L37). Handle long unbroken content without clipping and verify the slot does not collapse in grid/flex hosts.

**Exhaustive parent probe list:** every utility in the table, including all ordinary utilities (`box-border`, `w-full`, `max-w-none`, `mx-0`, `px-0`, `grid`, `grid-cols-1`, `items-center`, `gap-8`, `font-sans`, `text-fg-default`, `min-w-0`, `flex`, `flex-col`, `items-start`, `mb-5`, `mb-7`, `m-0`, `max-w-full`, `text-body-large`, `text-fg-secondary`, `wrap-break-word`, `flex-wrap`, `gap-3`, `mt-8`, `mb-10`, `justify-center`, `aspect-square`, `mx-auto`) and every arbitrary/variant utility exactly as shown. Probe each distinct string once, including `grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]`, `[@media(width<=860px)]:grid-cols-1`, `[@media(width<=860px)]:gap-4`, `[@media(width>=961px)]:mb-3`, `[@media(width>=961px)]:mb-5`, `[@media(width>=961px)]:mt-7`, `[@media(width>=961px)]:mb-8`, `[@media(width<=860px)]:order-first`, `max-w-[62vh]`, `[@media(width<=860px)]:max-w-[min(34svh,calc(var(--space-24)*4))]` and `[@media(width>=961px)]:max-w-[min(56svh,calc(var(--space-24)*7))]`. `eg-hero` is a marker, not a generated utility. Assert selectors, declarations, media conditions and token resolution, not mere string presence. Parent's previous compiler probes (L31–L34) do not prove these exact candidates. Any replacement/addition needs a revised inventory, emission proof and, if mechanism changes, renewed approval.

Compose `Text variant="eyebrow"`, `Heading variant="hero" tone="canvas" level={level} accent={accent} accentBreak`, and a native paragraph for lede. Heading's existing `--text-shadow-title-hero` is text shadow for the canvas accent only; don't add a Hero glow. Existing SectionShell show gradient supplies the host halo. Delivered Button primary/secondary owns its gradients, elevated/pressed material and focus; use supplied children unchanged. Delivered SocialLinks `size="lg"` owns its own icon controls and names. No handwritten gradient, shadow, color, effect, background or inline appearance. Check actual foreground and focus on the selected background, including neon title against the SectionShell show halo; a nominal token is not evidence of adequate contrast.

## 4. Legacy, native controls and computed-style proof

`packages/ui/src/styles/legacy/bundle.css:701–723`: root `.eg-hero` supplies width, max-width, inline margin/padding, color and font; proposed root explicitly owns each (`w-full max-w-none mx-0 px-0 text-fg-default font-sans`). Measure logical and physical padding/margins, box sizing, width/max width, grid tracks, gaps, font and color against the real packed layer order. The host must supply the one SectionShell wrap, never doubled gutters. If independently unlayered legacy beats utilities, stop; `cn()` cannot fix layer precedence.

Do not emit legacy `eg-hero__grid`, `__copy`, `__lede`, `__ctas`, `__art`, `__slot` or `__iso-px`. Consequently old grid/gap, direct `.eg-eyebrow`/`.eg-title` margins, lede typography/52ch, CTA margins, art positioning/order, square slot sizing and direct SVG drop-shadow, animation/keyframes, and 860/961 rules must not match new internal parts. Measure computed display, order, tracks, margins, width/height/aspect ratio, max sizes, filter, animation, transform, overflow and text metrics at both boundaries, with and without media; inspect SVG computed filter and no inherited source animation. Check actual `eg-heading`, `eg-text`, `eg-btn`, SocialLinks and `eg-section`/wrap selectors, pseudo-elements, focus, hover, pressed, border, background-image and shadows in composition; don't strip their approved recipes. Compare untouched legacy Hero fixture at rest, breakpoint neighbors and reduced motion to its baseline.

The package ships **without preflight**: never rely on browser button/link resets. Stories use delivered Button and Link, which own their relevant resets; inspect computed native appearance, font, margin, color, text decoration, background, border and focus with shipped CSS. Do not introduce a blanket reset or bare-anchor stories. If a delivered composed control retains UA paint or fails contrast or sizing, capture a failing browser test and stop for scoped owner authorization; don't silently patch a child. Layer (d) exposed exactly this issue in SectionNav (L40), invisible gaps in BlogGrid, NowCard internal alignment, and LiveBand title overlap and missing `aspect-video` (L36–L37). Check host/child geometry rather than just root classes.

## 5. Naming proposals

Lookup the [registry](../../../../skills/_shared/prop-naming.json) and aliases again at integration. Existing mappings: `title` → `heading-title`, `level` → `heading-level`, `eyebrow` → `heading-eyebrow`, `accent` → `trailing-text-accent`, `lede` → `section-lede`; native `id`, `className`, and `children` do not add own conventions. `effect-scene` selects a pose, `slot-composition` is Radix substitution, `collection-items` is structured data and `trailing-actions` controls; none covers these slots.

```json
{
  "id": "scene-media",
  "name": "media",
  "meaning": "A passive, decorative media or 3D slot of a scene organism, supplied by the consumer.",
  "whenToUse": "Supply optional decorative scene media such as an Isotipo3D or an image that carries no unique meaning.",
  "avoid": "Do not use for thumbnails, interactive content, effect selectors or Radix asChild composition.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": [],
  "usages": []
}
```

```json
{
  "id": "scene-social",
  "name": "social",
  "meaning": "An optional consumer-supplied social-profile links group in a scene organism.",
  "whenToUse": "Supply a named social-profile links group within a scene, such as SocialLinks.",
  "avoid": "Do not use for CTA controls, a structured data array or a generic navigation landmark.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": [],
  "usages": []
}
```

Separately approve exact convention content and record recoverable `convention:<id>` receipts with canonical hashes. Only after implementation inspect actual `HeroProps` and hash the entire reviewed `packages/ui/src/organisms/hero/types.ts` byte content for each usage; do not invent a revision. Parent coordinates shared `scene-media` registration once across both scenes, then appends real usages without duplicating the entry. After authorized JSON edits, run `pnpm props:docs`, `pnpm props:check`, `pnpm test:props`; never hand-edit generated reference or infer global naming approval from #318.

## 6. Test-first plan and preservation

Future implementation: write public-interface tests and observe intended RED per criterion before minimum GREEN. For browser-only CSS, establish a failing shipped-CSS browser fixture first or record the specific reason no meaningful RED is possible; jsdom is not geometry evidence. Refactor only with focused checks green.

| Criterion | RED → GREEN observable checks |
| --- | --- |
| HE-01 | Required title and each selected heading rank, one heading, no extra landmark or defaults; multiple instances with unique supplied heading IDs and named SectionShell; type exclusions and no effect/choreography import. |
| HE-02 | Each optional present and omitted independently, structural copy order then media, no empty wrappers/defaults; zero, one and two distinct named CTA examples, consumer obligation of at most one primary and social group; no descendant parsing. |
| HE-03 | Full accessible heading name including caller-provided separator/accent, decorative hidden media with no focusable descendants in compliant example, named SocialLinks, native CTA Tab/Shift+Tab/Enter and Space for Button; no nested controls. |
| HE-04 | Browser: adjacent grid vs narrow visual media-first while DOM/focus order stays copy-first, empty media removes phantom column, long/localized copy, constrained embed, short viewport, boundaries and zoom without clipping. |
| HE-05 | Shipped CSS and browser focus, UA reset, real ≥44×44 action/social hit boxes including coarse pointer, reduced motion and actual contrast on host; verify consumer-supplied controls separately. |
| HE-06 | Token recipe, host show halo and Heading-only glow, no extra SVG filter or animation, every §4 computed collision and unchanged legacy fixture; compare adopted captures with stated differences only. |
| HE-07 | `eg-hero`, supported placement merge, compatible native forwarding, protected runtime and negative type cases, no ref/asChild/style/role; own responsive classes per SSR element, actual production CSS and packed React 18/19 consumers. |

PRESERVE: don't modify Heading, Text, Button, Link, SocialLinks, SectionShell, shared helpers or legacy. Run their applicable focused checks when separately authorized; if any shared code must change, stop for scoped authorization and add preservation tests plus applicable sibling differential checks. Preserve existing package integration statements and compare column-0 structure, nesting and duplicate loops against main (L24); green tests alone missed prior merge damage.

## 7. Stories, metadata, package and catalog

Use `Organisms/Hero`, real `Meta<typeof Hero>`/`StoryObj`, autodocs, English copy, no manual `argTypes`, `play` or renderer adapters. Default supplies required title and level only, preserving optional defaults. Add FullScene, NoMedia, MediaOnlyDecoration, OneAction, TwoActions, LongLocalizedContent, MultipleSections and Responsive examples. Compose a named SectionShell host and delivered Button controls and/or delivered Link for destination actions; **never bare anchors**, and never nest links/buttons. `SocialLinks` gets localized labels/destinations and `size="lg"`. A decorative image or delivered Isotipo3D may be consumer-provided; no interactive mode in `aria-hidden`. Explicitly verify actual Button md target, not its nominal documentation: `min-h-12` derives from the scaled tokens, and may be under 44px. If so, stop for a scoped decision; do not override its protected appearance or misreport compliance.

Every own prop gets English JSDoc and supported `@control`: text for strings, select for finite heading level, false with concrete non-serializable reason and story reference for ReactNode slots. No fabricated default or inherited-prop redeclaration. Verify real docgen requiredness and types, installed extraction/enhancer/inference and zero owned diagnostics, then actual browser Controls; no metadata-only claims.

Parent integrates named runtime/type exports, explicit production `types.ts` scanning in `packages/ui/src/styles/compiled.css` and story scanning if needed, metadata tests, `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs`. Build and pack only when authorized. Exercise SSR/hydration and React 18/19 with shipped tokens and UI styles **without a consumer Tailwind compiler**, type-negative and forwarding checks. Assert actual compiled declarations and media contexts for §3, and assert **Hero's own SSR root, copy/media elements** carry their respective shared responsive classes: packed CSS alone can stay green when another component emits the removed utility (L38). Run per-mutation checks after each build to prove each assertion fails when its Hero class is removed. Validate child recipe output and computed CSS, not just arbitrary string regexes that miss Tailwind `var()` fallbacks.

**Catalog, parent only:** after delivery and separate authorization update only the Hero row in `scripts/catalog_data.py` from proposed web mover to implemented organism, with accurate `Heading, Text, Button, SocialLinks; host SectionShell; consumer media` composition and no choreography; use the existing row/generator conventions. Parent runs `python3 scripts/build_catalog.py` once to regenerate `docs/CATALOGO.md` and `docs/catalog.json`; never hand-edit generated outputs or parallelize shared writes. This plan changes none of them.

## 8. Chromium gates, work units and stop lines

With actual shipped tokens/styles and legacy in Storybook and a packed no-Tailwind consumer, record Chromium/version, viewport, DPR, theme, loaded fonts, media preferences, computed styles, rectangles, screenshots and failures:

- 859/860/861 and 960/961/962 CSS px plus fractional neighbors: tracks, visual order, DOM/focus order, caps and square slot; also 390/1280, narrow embedding, long/unbroken copy, short/tall viewports, absent media, resize and 200% zoom/reflow.
- Real ≥44×44 rectangles for each CTA and social target, including coarse pointer; native Tab/Shift+Tab, Enter, Space, visible focus and no nested controls. Verify native control resets, hover/pressed paint and actual foreground/background contrast over real SectionShell show/ambient backdrops.
- One heading at selected level with title and accent in its name; matching unique section label IDs across instances, no extra landmark; `aria-hidden` media absent from accessibility tree and no focusable media descendants. Accessibility tree is not a screen-reader session.
- Reduced motion: Hero introduces no motion; verify composed Button and selected effect's effective transforms/animations independently. Check every §4 legacy collision, SVG filter, no clipping/overlap and an unchanged legacy fixture. Compare adopted VIS-01/02 only under matching recorded conditions; report visual, AT or native zoom as Not evaluated if not actually checked.

**Work units:** A — writer, six files and criterion-level RED/GREEN after approvals and scoped authorization. B — parent, exports/scanning, metadata, naming receipts/usages, package and mutation fixtures plus structural merge checks. C — parent, authorized catalog row and one regeneration. D — parent, real browser/visual/accessibility evidence and separate delivery decision. Focused checks precede any separately authorized suite, build or lint.

**Stop:** No implementation from this proposal alone. Obtain separate plan, gate, naming, capture and future edit authorization. Stop if exact utility emission, inclusive media syntax, responsive sizing, host contrast, 44px CTA sizing, cascade, compliant slot semantics, available token/child API or any criterion fails. Never widen the contract, modify child/legacy, add a dependency/token, invent a stylesheet or claim unobserved evidence as a workaround.
