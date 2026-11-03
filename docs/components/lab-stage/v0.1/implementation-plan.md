# LabStage v0.1 — implementation plan

- **Status:** Proposed for separate owner approval. This plan implements nothing and authorizes no code, tests, registry, catalog, token, dependency, Git or remote changes.
- **Coverage:** EP2, **S3**, LabStage only; not the entire inventory or implementation. [Approved contract](spec.md): issue [#325, approval 6606220350](https://github.com/egdev6/egdev-design-system/issues/325#issuecomment-6606220350), all OQ recommendations approved, per `odd/tasks/web-catalog.md` L47. Canonical payload SHA-256 `7fdf88b6472e575a7104b0c24d84776defdc3e08c0dee0f30659a1e5f52f3f2f`, from the complete `## 1. Purpose and scope` heading line through EOF including final LF. Frozen proposed/pending header and OQs predate approval; do not edit the spec or captures. S4 supplied source evidence, not a claim to complete the inventory.
- **Plan identity:** Parent hashes the entire final plan including final LF and records the separate decision as in [layer (e) approvals](../../web-catalog/v0.1/layer-e-plan-approvals.md). No self-hash; changed bytes require renewed approval. Approval, gate proof and future edit authorization are independent.
- **References:** VIS-01 `8c09321746b64eb2b518df17ac15b337f8347a5f4b80969086f49c322d9ab1a1`; VIS-02 `255bf178437bfc891f104b7a189f74397dc5c8ce06c1993da37af637eb028233`. Recommend separate adoption for surviving intent and differences below. [Capture record](capture.json) gives conditions; its raw harness fields were corrected on 2026-11-03 (they named the copied layer (d) harness and an unused blob mapping; images unchanged). Visual conformity **Not evaluated**.

## 1. Independent owner gates

1. **LabStage-local responsive geometry.** Recommend inclusive `width <= 860px`, visual media-first and square token-unit-capped media sizing in §3; no inferred approval from siblings. Prove emission and 859/860/861 plus fractional boundaries, 559/560/561, short viewport and narrow container. No `md:` or exclusive `max-[860px]:` substitute. Card-specific ≤560px treatment remains consumer-owned.
2. **Material and host register.** Recommend `SectionShell register="show"` as the example host; it owns its existing background and show recipe. The experiment card is consumer content composed using delivered raised `Surface`, `Badge`, `Heading`, `Text` and `Link`; LabStage paints no card. Accept solid raised Material rather than source glass. No LabStage-owned halo, handwritten glow, gradient or shadow; delivered Heading's existing hero accent glow and host's show recipe are not a new LabStage recipe. Verify actual contrast; other registers are host choices, not a promise of the same halo. Any additional glass/halo and its fallbacks need separate approval.
3. **Naming.** Recommend **no new convention**: LabStage `children` is native React composition for consumer experiment content, the same rule applied to Hero and Closing CTA `children`, BlogGrid and NowStrip. Register LabStage usages of the existing approved conventions only (`heading-title`, `heading-level`, `heading-eyebrow`, `trailing-text-accent`, `section-lede`, `scene-media`) through `postReceiptUsages`. *Alternative, not recommended:* the `scene-experiment-content` entry in §4, which would need its own approval and receipt. No new convention is approved by the spec or this plan.
4. **Legacy and no-preflight cascade.** Recommend the bounded root utilities in §3 and avoiding all `.eg-lab__*` markers, conditional on built CSS and real computed cascade proof, including unchanged legacy fixtures and delivered children. The stable `.eg-lab` itself collides with unlayered legacy 230vh height; utilities may lose to that rule. No legacy edits, blanket `!important`, class-order assumptions or unapproved stylesheet. If neutralization fails, stop for a separately approved meaningful scoped stylesheet role and any needed contract amendment.
5. **Consumer obligations.** Recommend optional consumer-owned experiment children, no parsing, cloning or descendant validation. Consumer supplies article semantics, subordinate heading, localized status, independently named link, destinations/target/rel, no nested controls, nonfocusable decorative media, heading rank/unique ID and named host. The card link must actually measure ≥44×44 CSS px with visible focus and sufficient contrast; delivered Link does not promise that size and its arrow points right, not external. If its supported composition cannot meet the target, stop for a separate decision, not an unauthorized appearance override or false guarantee.
6. **Visual adoption and motion.** Recommend adopting VIS-01/02 for intent, accepting solid card, host-owned treatment, token sizing and typography differences, no glitch or scroll choreography. LabStage is static and adds no animation in any preference; consumer effects own their own reduced-motion policy. Reference adoption is not browser evidence or implementation approval; compare only under reconciled equivalent capture conditions.

## 2. Contract, composition and future files

Passive in-flow `div.eg-lab` in a named SectionShell. Required `title: string` and `level: 1 | 2 | 3 | 4 | 5 | 6`; optional `eyebrow`, `accent`, `lede`, experiment `children: ReactNode`, decorative `media: ReactNode`, native heading `id` and placement-only `className`. Copy precedes media in DOM at all widths; media is visually first when narrow. Empty/absent media removes wrapper and track, without fallback; absent content adds no card or placeholder. Heading inserts no separator before accent; consumer supplies whitespace. No extra landmark, effects import, director, scroll listener, sticky behavior, runtime slot inspection or built-in brand artwork. Consumer must never put interactive descendants in the decorative `aria-hidden` media wrapper.

Inherit compatible `ComponentPropsWithoutRef<'div'>`, omitting `children`, `id`, `title`, `role`, `style`, `dangerouslySetInnerHTML` and own conflicts; protect role/style/raw HTML and unsupported ref/asChild even at untyped boundaries. Forward id to Heading, not root. `cn()` handles recognized outer placement conflicts, not universal cascade or appearance overrides. Nonempty title and compliant slot content are consumer obligations, not invented validation.

After gates and explicit future authorization, six meaningful files in `packages/ui/src/organisms/lab-stage/`:

| File | Responsibility |
| --- | --- |
| `types.ts` | Public types, English JSDoc/Controls and static CVA per part. |
| `useLabStage.ts` | Optional slot derivation, protected forwarding and per-part `cn()`. |
| `LabStage.tsx` | JSX using Heading, Text and consumer slots. |
| `LabStage.test.tsx` | Public behavior and hook tests by criterion. |
| `LabStage.stories.tsx` | English autodocs and real compositions. |
| `index.ts` | Named component and public types. |

**No stylesheet**, conditional on emission and cascade proof; no additional internal module. Parent owns shared package exports, scans, metadata, registry, fixtures and catalog. No dummy stylesheet or private Surface replacement.

## 3. Static CVA recipe and compiler-proof inventory

Every string below is a complete literal LabStage-owned CVA value. Grid has a static base plus a boolean CVA variant selected by `Children.toArray(media).length > 0`, as delivered Hero/Closing; `false` has an empty variant. There is no runtime interpolated utility or extra JSX class. SectionShell supplies page gutters.

| Part | Exact static CVA utilities |
| --- | --- |
| Root | `eg-lab box-border relative h-auto w-full font-sans text-fg-default` |
| Grid base | `grid min-w-0 grid-cols-1 items-center gap-10` |
| Grid media=true | `grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] [@media(width<=860px)]:grid-cols-1 [@media(width<=860px)]:gap-2` |
| Copy | `min-w-0` |
| Heading wrapper | `mt-5 mb-7` |
| Lede | `m-0 max-w-[40ch] font-sans text-body-large text-fg-default wrap-break-word` |
| Experiment wrapper | `mt-8 min-w-0` |
| Media wrapper | `relative mx-auto aspect-square w-[min(100%,72vh)] min-w-0 [@media(width<=860px)]:order-first [@media(width<=860px)]:w-[min(100%,36svh,calc(var(--space-24)*4))]` |

Wide square width is `min(100%,72vh)`; narrow is `min(100%,36svh,4 × --space-24)` (currently 307.2px cap, not source 300px). This is a proposed token-compatible visual difference. Media fits its wrapper without forced descendant appearance or inline geometry. `aspect-square` must be proved; `aspect-video` is absent in the installed theme and is not used. Heading uses delivered `variant="hero"` with block accent; typography/glow belong to Heading, not a LabStage recipe.

**Exhaustive arbitrary and variant candidates:** `grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]`, `[@media(width<=860px)]:grid-cols-1`, `[@media(width<=860px)]:gap-2`, `max-w-[40ch]`, `w-[min(100%,72vh)]`, `[@media(width<=860px)]:order-first`, `[@media(width<=860px)]:w-[min(100%,36svh,calc(var(--space-24)*4))]`.

**Ordinary candidates to prove:** `box-border`, `relative`, `h-auto`, `w-full`, `font-sans`, `text-fg-default`, `grid`, `min-w-0`, `grid-cols-1`, `items-center`, `gap-10`, `mt-5`, `mb-7`, `m-0`, `text-body-large`, `wrap-break-word`, `mt-8`, `mx-auto`, `aspect-square`. `eg-lab` is a public marker, not a utility. Parent proves **every exact candidate**, declarations, unit handling and media context with the installed compiler before approval, extracting all utility-bearing spans, not merely trusting previous probes. Also prove production source scanning and inherited SectionShell/Heading/Text/Surface/Badge/Link recipes separately. Any recipe addition needs proof and renewed review. No compiler probe has been run for this plan.

## 4. Naming proposal

Registry lookup by meaning, name and aliases: approved `slot-composition` is `asChild`, single-element Radix Slot substitution, not ordinary rich `children`; `field-message-content` is proposed plain form annotation, not experiment content. `trailing-actions` is action-specific. No matching general experiment-content convention was found. The approved spec proposes no new convention; the following is a separate plan-level proposal for registry coverage, not a change to the accepted children API and not approved by #325:

```json
{
  "id": "scene-experiment-content",
  "name": "children",
  "meaning": "Optional consumer-authored experiment content composed within a scene organism.",
  "whenToUse": "Supply experiment content and its semantics as React children to a scene that explicitly accepts it.",
  "avoid": "Do not use for CTA-only slots, form annotations, decorative media or Radix asChild element substitution.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": [],
  "usages": []
}
```

Existing mappings: `title` → `heading-title`, `level` → `heading-level`, `eyebrow` → `heading-eyebrow`, `accent` → `trailing-text-accent`, `lede` → `section-lede`, `media` → approved `scene-media` (Hero receipt `docs/components/hero/v0.1/prop-naming-approval-scene-media.json`; Closing usage exists). `id` and `className` are native. Recheck registry and generated reference at integration. After separate convention approval and scoped authorization, parent uses the existing receipt workflow, records actual reviewed `LabStageProps` whole-file SHA-256 usages for every applicable mapping, including the new children entry and `scene-media`, and regenerates/checks documentation. Respect existing `postReceiptUsages` mechanism for later usages and update its tests/counters where required; do not overwrite or pretend to reapprove existing convention receipts. Run `pnpm props:docs`, `pnpm props:check` and `pnpm test:props` only when separately authorized. No revision or approval is invented here.

## 5. Legacy and no-preflight collision inventory

`packages/ui/src/styles/legacy/bundle.css:738–817` gives the unlayered `.eg-lab` root 230vh, position, foreground and font, with static and responsive selectors. Root `h-auto` is a candidate reset, not proof: unlayered legacy can outrank utilities. Inspect actual root height, position, font, color, width, overflow and computed cascade under shipped CSS and supported legacy imports at wide, narrow and short heights. Never emit `eg-lab--static` or `eg-lab__stage`, `__in`, `__title`, `__glitch`, `__body`, `__lede`, `__card`, `__row`, `__no`, `__card-title`, `__card-text`, `__slot`; retained rules include sticky stage, pseudo radial backgrounds, title animations, card paint, direct Link/SVG selectors and responsive overrides. Verify no pseudo paint, glitch animation, sticky or inherited fixed-height geometry on new parts.

Check `.eg-eyebrow`, `.eg-title__accent`, `.eg-link`, Surface, Badge and section selectors against actual delivered children, including hover/focus and no-preflight UA link paint. Do not blanket-reset descendants or remove their approved Material. Compare unchanged legacy fixtures before/after at wide and narrow, including their static and animated behavior; preserve legacy consumers. If competing unlayered rules win, stop rather than deleting legacy or silently adding CSS.

## 6. Test-first acceptance and preservation

Future work only: public-interface tests first with observed intended RED for each behavior, minimal implementation then focused GREEN. Browser-only geometry/paint gets a failing built-CSS/browser assertion first where meaningful; otherwise report the specific RED limitation, not jsdom geometry claims.

| Criterion | Planned RED → GREEN observable evidence |
| --- | --- |
| LS-01 | All six ranks, title and accent accessible name, heading-only id, one named host region, independent IDs on multiple instances/rerender, no extra landmark or invented defaults. |
| LS-02 | Eyebrow → heading → lede → supplied article order; independently absent optional text/children and empty children omit wrappers; composed status text, article heading and Link destination/name preserved, no invented data, parsing or nested controls. |
| LS-03 | Supplied decorative media is hidden/nonfocusable, copy before media in DOM; absent, null, false and empty array omit wrapper and fallback. Static dependency check excludes effects/director/choreography; consumer owns effects. |
| LS-04 | Own-element classes and packed CSS; browser wide/narrow tracks, media square/caps, empty and false media one full-width track; 559/560/561, 859/860/861 and fractions, long translation, narrow embed, short viewport and zoom without clipping or focus order changes. |
| LS-05 | Supplied Link retains native Tab/Shift+Tab and Enter, visible focus, safe link semantics, status text and no nested controls; actual target ≥44×44 and contrast measured on actual raised Surface. Reduced-motion check covers LabStage and consumer composition; manual AT separate. |
| LS-06 | Built CSS and browser computed root/children/pseudos show no legacy height, sticky, unwanted paint or animation; unchanged legacy fixtures; accepted Material and visual differences compared only with adopted references under equivalent conditions. |
| LS-07 | Native forwarding and runtime protected attributes; negative types for required title/rank, invalid rank, role/style/raw HTML/ref/asChild; placement merge; English metadata, static scan, story args/assets and React 18/19 packed consumers. |

PRESERVE: delivered Surface, Badge, Heading, Text, Link, SectionShell, effects and legacy remain unchanged; run their relevant focused checks when separately authorized. Shared-code changes require scope, preservation and public differential tests. Parent compares shared integration files with main for column-0 statements, nesting and duplicate loops, not green tests alone.

## 7. Stories, package and catalog

`Organisms/LabStage`, typed `Meta<typeof LabStage>` / `StoryObj`, autodocs and English text; no manual `argTypes`, `play` or rendering adapter. Default supplies only required example args; add OptionalCopy, Experiment, NoMedia, EmptyMedia, DecorativeMedia, LongCopy, MultipleScenes and Responsive. Compose the experiment as a semantic `article` via delivered `Surface asChild`, with visible `Badge`, subordinate `Heading`, `Text` and a named delivered `Link`; do not invent card data, nested controls or bare control resets. Link target measurement is a consumer gate, not permission to force unsupported Link styling. Host with unique `useId()` and `SectionShell register="show"`; decorator must spread `context.args` before overriding `id`. Media example uses `/brand/egdev-logo.png`, empty alt and a nonfocusable wrapper. Verify asset resolves. Story-only utilities (including image sizing) require a preview `@source`, independently scanned and compiler-proved. No unapproved dependency or package runtime import from effects.

`children` and `media` carry `@control false` with concrete non-serializable reasons and story references; strings use `@control text`, level `select`, no fabricated defaults or native redeclarations. Verify AST coverage, real docgen, extraction/enhancer/inference, zero owned diagnostics, then browser Controls and actual args changes.

After separate authorization parent integrates exports, production `types.ts` scanning and story preview scanning, metadata, package fixtures and registry. Test SSR/hydration, native restrictions, negative types and React 18/19 packed consumers with shipped token/UI CSS and **no consumer Tailwind compiler**. Assert emitted declarations/media and LabStage's **own SSR grid and media elements' responsive classes**, including presence and absence/false paths: a sibling can emit the same selector. Per-mutation check each owned responsive class and its built CSS declaration after each build, accounting for Tailwind `var()` fallback output; inherited CSS is checked separately. Include actual registry usages and `postReceiptUsages` counts, receipt integrity and source hashes in registry/packed integration checks. Preserve shared test structure when merging.

Parent-only catalog after delivery and authorization: update LabStage row in `scripts/catalog_data.py` to implemented organism with actual Heading/Text and consumer Surface/Badge/Link composition, without claiming effects import or choreography. Run `python3 scripts/build_catalog.py` once to regenerate `docs/CATALOGO.md` and `docs/catalog.json`; never hand-edit generated outputs.

## 8. Chromium gates, work units and stop lines

With shipped CSS, legacy, tokens and packed no-Tailwind consumer, record browser/version, viewport, DPR, fonts, host register, preferences, screenshots and computed values:

- 559/560/561 and 859/860/861 with fractional neighbors: tracks, gap, media square/caps, visual media-first versus DOM copy-first, absent/false media without phantom track; 390/1280, short height, narrow embed, resize, 200% zoom/reflow, long and unbroken text, no clipping or overflow.
- Named host, heading rank/ID/accent, subordinate article heading, status text, decorative hidden media without focusable descendants; Tab/Shift+Tab, Enter, focus visibility, contrast and actual Link rectangle ≥44×44 CSS px. Verify target/rel and no nested controls; separate screen-reader session from accessibility-tree inspection.
- Computed root height/position, pseudo content and paint, children/UA cascade, Surface/Link focus/hover and legacy fixtures. Test normal and reduced-transparency host behavior. LabStage itself has **no animation at all** in any preference; under reduced motion verify no animations or transformations in the entire consumer example, including supplied effects and controls. No glitch or scroll choreography. Compare VIS-01/02 only after adoption and provenance reconciliation under equivalent conditions; otherwise **Not evaluated**.

**A — writer:** six files and criterion-level RED/GREEN after gates and scoped authorization. **B — parent:** exports, scans, metadata, naming receipt/usages including `postReceiptUsages`, packed SSR/CSS mutation evidence and shared-file structural checks. **C — parent:** catalog row and one generator run. **D — parent:** Chromium, AT, visual and integration evidence, then separate delivery decision. Focused checks precede separately authorized broader suites, builds or lint.

**Stop:** This proposal authorizes no implementation. Stop for owner resolution if a gate, compiler emission, 860px behavior, token-unit square sizing, experiment-content naming, card-link target, host contrast, no-preflight reset or legacy cascade cannot satisfy the contract. Do not change tokens/dependencies, mutate legacy, invent inline geometry, force child styling, add a glitch, duplicate the halo or silently add a stylesheet. Utilities and package/browser/AT evidence remain unverified.
