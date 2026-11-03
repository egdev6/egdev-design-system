# Closing v0.1 — implementation plan

- **Status:** Proposed for separate owner approval. This document implements nothing and authorizes no code, tests, tokens, dependencies, registry, catalog, Git or remote changes.
- **Coverage:** EP1, **S3**, Closing only; not the complete web inventory or implementation. [Approved contract](spec.md): issue [#319, approval 6603972913](https://github.com/egdev6/egdev-design-system/issues/319#issuecomment-6603972913), “Aprobar con las recomendaciones (Recomendado)”. Canonical payload SHA-256 `061e4d125502dee93512f9ca392e0f06ecba5fcb0146536fc493b29be95d0b57`, from the complete `## 1. Purpose and scope` heading line through EOF, including final LF. Frozen proposed/pending header and OQ language predate approval; task L44 records the later decision. Keep the spec and captures unchanged.
- **Plan identity:** Parent hashes the entire final plan bytes including final LF and records the separate decision, as in [layer (d) approvals](../../web-catalog/v0.1/layer-d-plan-approvals.md). No self-hash; changed bytes require renewed approval. Plan approval, gates and future edit authorization are independent.
- **References:** VIS-01 `882bcb65cc01cfdb745ee3a43a2be052d8b12d9863490c06dbf27619eb926b4d`; VIS-02 `885339c658185f98865d20f2632352ba9d1a5731eb186c177e855d34bd074923`. Recommend separate adoption for surviving intent with differences below; missing capture provenance limits comparisons. Visual conformity **Not evaluated**.

## 1. Independent owner gates

1. **Closing-local responsive geometry.** Recommend the inclusive `width <= 860px` variants and square token-unit-capped sizing in §3, independently of Footer/LiveBand. Prove exact compiler output and 859/860/861 plus fractional boundaries. No `md:` or exclusive `max-[860px]:` substitute.
2. **Material, typography and halo.** Recommend a `SectionShell register="show"` host using its delivered `--gradient-section-show` recipe once, with no Closing-owned halo or SVG drop-shadow; explicitly accept that hosts choosing another register get no Closing halo and source SVG glow is absent. Use delivered `Heading variant="hero"` with block accent, `Text variant="eyebrow"`, token body and delivered Button. Heading's hero token clamp differs from the source's wide/narrow clamps and its canvas accent has the existing hero glyph glow; accept these visual differences and verify contrast on the actual host. The host owns the background and its show recipe, not a new flat Surface. If another scene-specific glow is demanded, stop for a separate compliant recipe and fallback approval, not a handwritten gradient/shadow or duplicated show halo. No token/dependency change.
3. **Naming.** Recommend separate approval of exact `scene-media` in §4; component approval does not approve a registry convention. No receipt or usage revision is invented.
4. **Legacy and UA cascade.** Recommend §5's bounded utility-only root reset and avoiding all legacy part markers, conditional on built CSS and computed-style proof, including unchanged legacy fixture and delivered children. No legacy edits, blanket `!important`, or unapproved stylesheet. If the root pseudo reset loses, stop for a separately approved meaningful scoped stylesheet role.
5. **Consumer CTA obligations.** Recommend the approved CTA-only children contract: one to three independently named controls, at most one primary, consumer responsible for targets, focus, safe destinations and noninteractive decorative media. No runtime parsing, cloning or limits enforcement. Browser-check delivered Button and Link rather than assuming native controls receive preflight resets. If a supplied Link cannot meet 44×44 without unsupported appearance overrides, use compliant Button-as-anchor examples or stop for a separate decision; do not claim Closing guarantees child targets.
6. **Visual adoption.** Recommend adopting VIS-01/02 for intent with the documented sizing, title and glow differences, subject to capture provenance and comparable conditions. Adoption is not browser evidence or implementation approval.

## 2. Contract, composition and future files

A passive `div.eg-closing` inside a named SectionShell has required `title: string`, `level: 1 | 2 | 3 | 4 | 5 | 6` and CTA-only `children: ReactNode`; optional `eyebrow`, `accent`, `lede`, `media: ReactNode`, native `id` and placement-only `className`. Forward `id` to Heading, not the root; host gives the SectionShell `aria-labelledby` referencing a unique ID and owns `data-zone`. Render copy before media in DOM always. At narrow widths the decorative, non-focusable media appears first visually. Omitted optional content renders no placeholder or fallback. Heading inserts no separator before accent: consumer supplies whitespace in `title` when needed. No new landmark, implicit content, interaction, effect import, orchestration, scroll listener, or descendant inspection. Consumer owns navigation, rel/target, names and media accessibility. Do not hide interactive content inside the decorative `aria-hidden` media wrapper.

Inherit compatible `ComponentPropsWithoutRef<'div'>`, omitting `children`, `id`, `role`, `style`, `dangerouslySetInnerHTML` and conflicting owned fields; enforce protected semantics at untyped boundaries too. No ref or `asChild` on Closing. `cn()` merges recognized placement conflicts, not arbitrary appearance or CSS cascade. Required nonempty title, media decorativeness and CTA restrictions are consumer obligations, not newly invented validation.

After all gates and explicit future authorization, six meaningful files in `packages/ui/src/organisms/closing/`:

| File | Responsibility |
| --- | --- |
| `types.ts` | Public types, English JSDoc/Controls and static CVA per part. |
| `useClosing.ts` | Optional-content derivation, protected forwarding and per-part `cn()`. |
| `Closing.tsx` | JSX with Heading, Text and consumer slots. |
| `Closing.test.tsx` | Criterion-level public behavior and hook tests. |
| `Closing.stories.tsx` | English autodocs and real compositions. |
| `index.ts` | Named component and public types. |

**No stylesheet**, conditional on emission and cascade proof; no extra internal module. Parent owns shared package exports, scans, metadata, registry, fixtures and catalog. A failed condition needs an independently approved role, never dummy CSS.

## 3. Static CVA recipe and compiler-proof inventory

All strings below are literal, static and Closing-owned; each row is the complete proposed CVA string for that part. Use no extra classes in JSX or conditional interpolation. The host's existing SectionShell wrap supplies the only page gutter.

| Part | Exact static CVA utilities |
| --- | --- |
| Root | `eg-closing box-border relative isolate w-full font-sans text-fg-default before:content-none` |
| Grid | `grid min-w-0 grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] items-center gap-10 [@media(width<=860px)]:grid-cols-1 [@media(width<=860px)]:gap-2` |
| Copy | `min-w-0` |
| Heading placement wrapper | `mt-5 mb-7` |
| Lede | `m-0 max-w-[40ch] font-sans text-body-large text-fg-default wrap-break-word` |
| CTA row | `mt-8 flex flex-wrap gap-3` |
| Media wrapper | `relative mx-auto aspect-square w-[min(100%,62vh)] min-w-0 [@media(width<=860px)]:order-first [@media(width<=860px)]:w-[min(100%,34svh,calc(var(--space-24)*4))]` |

The media wrapper's width, not merely max-height, caps a square: wide `min(100%, 62vh)`; narrow `min(100%, 34svh, 4 × --space-24)` = 307.2px with current tokens, rather than the source's hardcoded 300px. This is a proposed token-compatible difference, not the exact source geometry. Media content must fit its wrapper without forced descendant appearance or inline geometry; verify actual Isotipo3D and a decorative SVG. `aspect-square` is a candidate, not assumed emitted; `aspect-video` is known absent and is not used. `Heading variant="hero"` delegates its own typography, accent and glow to the delivered component; wrappers carry spacing without unsupported Heading overrides. Media absent removes the wrapper; grid behavior with one child and narrow embedding must be measured.

**Exhaustive Closing-owned arbitrary or variant candidates:** `before:content-none`; `grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]`; `[@media(width<=860px)]:grid-cols-1`; `[@media(width<=860px)]:gap-2`; `max-w-[40ch]`; `w-[min(100%,62vh)]`; `[@media(width<=860px)]:order-first`; `[@media(width<=860px)]:w-[min(100%,34svh,calc(var(--space-24)*4))]`.

**Ordinary candidates to prove, including less-obvious theme emission:** `box-border`, `relative`, `isolate`, `w-full`, `font-sans`, `text-fg-default`, `grid`, `min-w-0`, `items-center`, `gap-10`, `mt-5`, `mb-7`, `m-0`, `font-sans`, `text-body-large`, `wrap-break-word`, `mt-8`, `flex`, `flex-wrap`, `gap-3`, `mx-auto`, `aspect-square`. `eg-closing` is a marker, not a utility. Prove every exact string above with the installed compiler **before approval**, including declarations, unit handling and media context, not just selector presence. The parent separately proves production scanning and inherited Heading/Text/Button/Link/SectionShell recipes and their arbitrary/variant utilities; those delivered components are not Closing CVA. Any addition to this inventory requires proof and renewed review. Earlier layer (d) probes do not prove these exact strings. No compiler probe has been run for this plan.

## 4. Naming proposal

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

Existing semantic mappings: `title` → `heading-title`, `level` → `heading-level`, `eyebrow` → `heading-eyebrow`, `accent` → `trailing-text-accent`, `lede` → `section-lede`. Native `id`, `children`, `className` do not require new entries. `trailing-actions` is scoped to one or two actions, `slot-composition` means element substitution and `effect-scene` selects an effect pose; none describes `media`. Recheck names, meanings, aliases and approval at integration. Following separate approval, parent records a scoped convention receipt and actual `ClosingProps` whole-file SHA-256 usage, then regenerates and checks naming documentation through the existing workflow. No registry mutation is authorized here.

## 5. Legacy and no-preflight collision inventory

`packages/ui/src/styles/legacy/bundle.css:819–840` retains `.eg-closing`: position, isolation, width, font and foreground are explicitly owned by root utilities; its `::before` creates a full-size negative-z radial halo. `before:content-none` must compute to no generated halo with the shipped layers, including an independently imported legacy stylesheet if supported. Check position, isolation, width, font, color and pseudo content/background/stacking on the actual root. `cn()` and class-string order cannot override cascade layers or unlayered specificity.

Never emit `.eg-closing__grid`, `__title`, `__lede`, `__ctas` or `__slot`: their legacy gutters/max-width, desktop tracks/gap, title margins/clamps/accent, lede measure, CTA margins, square cap, direct SVG filter, and inclusive mobile grid/order/cap/title rules must not match new parts. Measure actual grid tracks/gap, child margins, title typography/accent, media box and SVG `filter`, clipping and overflow. Check legacy `.eg-eyebrow`, `.eg-title__accent`, `.eg-btn`, `.eg-btn__icon`, and section selectors against actual delivered Text, Heading, Button, Link and SectionShell markers, including their own resets, normal/hover/focus/reduced-motion paint and link navigation; do not remove their supported Material. Compare separate untouched legacy Closing fixtures at wide/narrow, including pseudo halo and SVG filter, before/after with identical shipped CSS. If competing legacy wins, stop rather than deleting or changing it.

No package preflight is shipped: stories use delivered `Button` (native button or `asChild` anchor) and delivered `Link`, never bare buttons or anchors as controls except the anchor inside Button's supported Slot. Verify actual computed background, border, font, text decoration, focus and target rectangles; a native UA default is not an acceptable reset. Preserve actual child contracts; no CSS blanket descendant reset.

## 6. Test-first acceptance and preservation

Future work only: first add public-interface behavior tests and record intended RED per criterion, then implement minimally and capture focused GREEN; refactor only while green. For browser-only layout or paint, create a failing built-CSS/browser assertion first where meaningful; otherwise document the exact RED limitation rather than claiming jsdom measures geometry.

| Criterion | Planned RED → GREEN observable evidence |
| --- | --- |
| CL-01 | Named host SectionShell, required rank/title and heading ID, accessible accent including whitespace, optional text omission, multiple instances and rerender without duplicate IDs or invented content/landmarks. |
| CL-02 | One to three supplied controls retain DOM order, independent native roles/names and destinations; Button-as-anchor and Link examples, no nested controls; wide/narrow wrapping and native keyboard. |
| CL-03 | Media supplied and absent cases, wrapper hidden from accessibility and no fallback; real externally driven effects host with no UI effects import/director; DOM copy-first despite visual media-first. |
| CL-04 | Production selectors and own rendered classes plus Chromium 859/860/861 and fractional widths, media square/caps, long localized/unbroken copy, narrow embedding and zoom, no clipping or overflow. |
| CL-05 | Actual host Material and approved visual differences; root/pseudo/child computed properties, unchanged legacy fixture, contrast, focus, reduced preferences and reference comparisons only if adopted. |
| CL-06 | Consumer controls named, no nested interactions, keyboard and visible focus; measure all actual hit rectangles ≥44×44 and verify media contains no focusable descendants; manual AT separately. |
| CL-07 | Native forwarding and protected attributes at runtime and in negative types, heading-only id, supported placement merge, English docgen/Controls, static CVA output and React 18/19 packed consumers. |

PRESERVE: leave delivered Heading, Text, Button, Link, SectionShell, effects and legacy unchanged; run their relevant focused checks when separately authorized. If shared code must change, stop for scope and add preservation/differential public-interface tests. Parent compares shared integration files against main for column-0 statement structure, nesting and duplicate loops, not just green tests.

## 7. Stories, package and catalog

`Organisms/Closing`, typed `Meta<typeof Closing>` / `StoryObj`, autodocs and English copy; no manual `argTypes`, `play` or rendering adapter. Default supplies only required example args/children; add OptionalCopy, NoMedia, DecorativeMedia, LongCopy, ThreeActions, MultipleScenes and Responsive examples. Use a real named SectionShell with unique heading ID, delivered `Button asChild` anchors and a real delivered Link only where its measured target passes; otherwise use three delivered Button anchors. The consumer owns supplied SVG accessibility and examples' URLs; do not imply a fallback. Do not use bare native control examples or rely on preflight. `media`/`children` use `@control false` with concrete non-serializable reasons and story references; text inputs use `@control text`, level `select`, no fabricated defaults or native redeclarations. Verify AST coverage, real docgen, extraction/enhancer/inference, zero owned diagnostics, then real browser Controls.

After separate authorization parent integrates public exports, production `types.ts` source scanning and story scanning as needed, package exports and consumption fixtures. Test SSR/hydration, native restrictions, negative types and React 18/19 packed consumers with shipped tokens/UI CSS and **no consumer Tailwind compiler**. Assert actual declarations and media from §3 and, critically, assert Closing's **own SSR grid and media elements carry their responsive classes**: packed CSS alone may be emitted by siblings and survive source mutation. Mutation-check each responsive class and corresponding built declaration, with proper Tailwind `var()` fallback handling. Test inherited component CSS separately. Preserve shared test structure on merges.

Parent-only catalog after delivery and authorization: update the Closing row in `scripts/catalog_data.py` to implemented organism and actual Heading/Text/Button/Link/SectionShell composition, without claiming an effects import or choreography. Run `python3 scripts/build_catalog.py` once to regenerate `docs/CATALOGO.md` and `docs/catalog.json`; never hand-edit generated outputs.

## 8. Chromium gates, work units and stop lines

With actual shipped CSS, legacy, tokens and packed no-Tailwind consumer, record browser/version, viewport, DPR, fonts, host register, preferences, screenshots and computed values:

- 859/860/861 and fractional neighbors: responsive tracks, media square/caps, visual media-first versus copy-first DOM and unchanged keyboard order; 390/1280, narrow embedding, resize and 200% zoom/reflow; check long text and CTA wrapping without clipping.
- Every actual CTA ≥44×44 CSS px, native Tab/Shift+Tab and Enter/Space as applicable, focus visibility and actual contrast on the host; contrast is not inferred from tokens alone. Inspect native UA paint and Link separately.
- Heading rank, one named host landmark, unique ID, accent accessible name and media absent/`aria-hidden`, no hidden focusable descendants; screen-reader session separately from accessibility-tree inspection.
- Reduced motion and reduced transparency in host and children, no unexpected animation, root pseudo and child filter/cascade checks, unchanged legacy fixture. Compare adopted captures only under equivalent known conditions; otherwise report **Not evaluated**.

**A — writer:** six component files and per-criterion RED/GREEN after gates and scoped authorization. **B — parent:** exports, scans, metadata, naming receipt, packed SSR/CSS mutation evidence and shared-file structural checks. **C — parent:** catalog row and one generator run. **D — parent:** Chromium, AT, visual and integration evidence, then separate delivery decision. Focused checks precede any separately authorized broad suite, build or lint.

**Stop:** No implementation follows from this proposed plan. Stop for owner resolution if any independent gate, utility emission, 860px behavior, token-unit square sizing, child API, 44px target, host contrast, no-preflight reset or legacy cascade cannot satisfy the contract. Do not add tokens/dependencies, mutate legacy, invent inline geometry, force child styling, duplicate the halo, weaken semantics or silently add a stylesheet. The proposed utilities, package/browser/AT evidence and capture adoption are unverified.
