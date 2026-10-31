# PhotoFrame — approved contract recovery and preparation consolidation

- **Version / status:** v0.3 preparation Draft; underlying full runtime contract remains **Approved v0.2**, not reopened or implemented by this document. PhotoFrame is an **atom** in `@egdev/ui`.
- **Approval / recovery:** [Full-contract approval](https://github.com/egdev6/egdev-design-system/issues/95#issuecomment-6251537589) supersedes historical Draft/Pending headers; [classification amendment](https://github.com/egdev6/egdev-design-system/issues/95#issuecomment-6244025883) changes only atom placement/Storybook title. [ODD preparation](https://github.com/egdev6/egdev-design-system/issues/95#issuecomment-6522798297) is not a runtime plan grant. Parent separately relayed permission for locally authored diagnostic image preparation.
- **Snapshot identity:** `version: 0.3`; `contentSHA256: sha256:bc430e450cb91d1081cc3b889a20b2cb67d81dd208f4c498c227a5b05b88ad67`; `approvalReference: Pending — new preparation/fixture/plan only`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/95`; `latestPublishedComment: Pending — v0.3 unpublished`. Historical VIS-01/VIS-02 hashes are retained below; new visual hashes are Pending.
- **Hash rule:** SHA-256 of UTF-8 LF bytes from the actual heading line `## 1. Purpose and scope` through EOF, final LF included, excluding metadata above. This v0.3 consolidation digest is not substituted for the approved v0.2 canonical digest.
- **Full recovery verified:** Read the entire parent-supplied `/tmp/egdev-remaining-odd/95.json` body and two historical comments. Frozen initial body SHA-256 `c307a57239a7de39a40deed32cdb69d044ef90398538760281d7f5b913d30a1f`; amendment body SHA-256 `38b76224b17fee03fe37061314e4cbcfa0c3c21336da425aeccb62774f8bcb8d`; approval-comment body SHA-256 `cf06e3efdf040584c681c617be5e876ca73bfda3494996dd606d64688a91d4d6`. Take initial body from the actual section-1 heading through EOF, apply the amendment's JSON replacements in order, requiring each exact count, retain final LF. All three counts matched; reconstructed **full v0.2 canonical SHA-256 `13d66d39b036de68276c332bab3b97c3e8de6f42f4ebc2024c96be4a94142774`** matched the final approval. All seven blocks were recovered, not inferred from a summary.
- **Scope of this consolidation:** No prop/default/Material/native/semantic promise change. Historical dependency-unavailable statements are replaced by current source evidence; the approved atom path/title apply. A proposed diagnostic fixture and [separate implementation plan](implementation-plan.md) are new preparation, not inherited photo evidence or a request to reapprove the already-approved full contract. No Panel/ODD/shared file changes.

## 1. Purpose and scope

One passive framed editorial-image concept: predictable crop proportions, controlled cover alignment and optional native contextual caption. Supporting Surface and AspectRatio do not make it a molecule. Destination: `packages/ui/src/atoms/photo-frame/`, story title `Atoms/PhotoFrame`.

Retain Foundation concept as an atom; Avatar is compact identity/fallback, AspectRatio only reserves geometry, Surface only supplies paint. Native figure/img/caption plus these primitives express one media concept. No extraction from existing React PhotoFrame is possible: it is not exported/implemented in this baseline. No gallery, lightbox, card action, uploader, video, rich caption/credit link API, source optimization, generated attribution, status feedback, tint/filter or image sourcing/rights certification.

**Current source baseline:** `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`. Public barrel exports `AspectRatio`, `Surface`, `surfaceVariants`; no PhotoFrame. Actual prerequisite APIs fit the approved recipe; **no discrepancy requiring primitive edits was found**. AspectRatio already owns its installed individual Radix package and inline reservation; no install/dependency/token work is needed for this task. Old “Gauge only / future Surface” prose is stale against these actual sources.

Reviewed whole-file source identities:

| Path / reviewed symbols | SHA-256 |
| --- | --- |
| `packages/ui/src/primitives/aspect-ratio/types.ts` — AspectRatioProps | `771b93daa9a3c3548cba5ea6172b0182b32705e6ab7caeaf1b207641669ff1ed` |
| `packages/ui/src/primitives/aspect-ratio/useAspectRatio.ts` — useAspectRatio | `6f5463abf51bab25293686954aaae7a9bbfc839874480ef9fc8a8803b3b908c8` |
| `packages/ui/src/primitives/aspect-ratio/AspectRatio.tsx` — AspectRatio | `add98a287516ac20e0d0064f818f800057d2c47f4fe1b7233bbc62af2f5ee225` |
| `packages/ui/src/primitives/surface/types.ts` — SurfaceProps / surfaceVariants | `26d0726b5034dceb74e0067c1c0df5108d351e948205bbf22b5e187b92d9c0b6` |
| `packages/ui/src/primitives/surface/useSurface.ts` — useSurface | `e0e836e7dc7d471b2f0d87ada35b87e4097c2f15144f43e5e0ced732cec249cc` |
| `packages/ui/src/primitives/surface/Surface.tsx` — Surface | `8173b47ef3645fbd09d58608558d97ea5524910960a3068f1d769c8f994cb143` |
| `packages/ui/src/index.ts` — public exports | `08908ee7c034a211f2b6c252f7bb258865be1e31ec3f166e9ece7747a91bfa73` |
| `packages/ui/src/styles/legacy/bundle.css` — eg-photo selectors, lines 404–416 | `4f1763a54e080cd206b9d64f57ff9bbc5e3858159ec786ef8263134edee997fc` |
| `packages/tokens/src/theme.css` — existing palette/geometry/typography | `62d10992ae654e34e83d9d11bcf35da29e56c905648015f2415ebdca59bf6ab8` |

[AspectRatio evidence](../../aspect-ratio/v0.1/implementation-evidence.md) and [Surface evidence](../../surface/v0.1/implementation-evidence.md) are historical implementation records, not tests rerun here. No future PhotoFrame source hash is invented.

## 2. Anatomy and composition

| Part | Native element / owner | Responsibility |
| --- | --- | --- |
| Root `eg-photo` | figure | Unpainted, unclipped flow; media then optional caption |
| Private media frame | div + exported surfaceVariants | Single Material frame, optional inset and static tilt |
| Ratio region | Actual AspectRatio | Responsive reservation; receives only ratio and children, no paint/clip/ref hacks |
| Private viewport | Own div filling ratio region | Passive image clipping/rounding, object-cover viewport |
| `eg-photo__img` | Native img | Exactly supplied resource/alt/selected native attributes and events |
| `eg-photo__cap` / `eg-photo__label` | figcaption / text span | Plain supplied caption, outside reservation/clipping/rotation |

AspectRatio's real API accepts positive numeric ratio (invalid values normalize to square), forwards a div ref and targets its inner Radix root; its private spacer is not a PhotoFrame styling surface. PhotoFrame exposes neither that ref nor AspectRatio props. No recreated percentage spacer in runtime. Surface's supported raised tone/elevation and padding none/radius xl recipe supply paint once on the media div; no need for Surface ref/asChild or new padding preset. Internal frame inset is already approved composition, not arbitrary public Surface className permission.

Preserve the four established `eg-photo*` markers. Private media/viewport markers grant no part-override API. Never emit legacy ratio/framed/is-hover modifiers, alter legacy CSS or migrate consumers. Native figure/figcaption semantics remain; no Portal, interactive Radix behavior, generated ID, wrappers with role img, children/ref/asChild API or root activation.

## 3. Public API

The following is the recovered **unchanged v0.2** type surface, not runtime implementation:

```ts
type PhotoFrameRatio = 'square' | 'portrait' | 'landscape';
type PhotoFrameVariant = 'default' | 'framed';
type PhotoFrameFocalPoint = 'center' | 'top' | 'bottom' | 'left' | 'right';
type PhotoFrameImageProps = Pick<ComponentPropsWithoutRef<'img'>,
  | 'srcSet' | 'sizes' | 'width' | 'height' | 'loading' | 'decoding'
  | 'crossOrigin' | 'referrerPolicy' | 'onLoad' | 'onError'> & {
  src: string;
  alt: string;
};
type PhotoFrameNativeProps = Omit<ComponentPropsWithoutRef<'figure'>,
  | 'children' | 'dangerouslySetInnerHTML' | 'onLoad' | 'onError'
  | 'role' | 'tabIndex' | 'accessKey' | 'contentEditable' | 'onClick'
  | 'aria-label' | 'aria-labelledby' | 'aria-hidden' | 'aria-live'>;
type PhotoFrameProps = PhotoFrameNativeProps & PhotoFrameImageProps & {
  ratio?: PhotoFrameRatio;
  variant?: PhotoFrameVariant;
  focalPoint?: PhotoFrameFocalPoint;
  imageCaption?: string;
};
```

| Input | Required / default / rule | Destination |
| --- | --- | --- |
| src / alt | Both required strings; non-empty src; alt may be explicitly empty for decorative/redundant media; no generated defaults | img only |
| ratio | Optional; landscape; square→1, portrait→4/5, landscape→4/3 | AspectRatio image viewport, excluding frame/rotation/caption |
| variant | Optional; default; allowed default/framed | Private frame/root spacing recipe |
| focalPoint | Optional; center; five static object-position keywords above | img cover alignment |
| imageCaption | Optional string; absent/blank/whitespace-only omits caption and gap; nonblank supplied text preserved | figcaption text span |
| loading / decoding | Optional native img types; lazy / async defaults | img |
| srcSet / sizes / width / height | Optional picked native attributes; absent by default; intrinsic/request metadata does not change viewport ratio | img unchanged |
| crossOrigin / referrerPolicy | Optional native attributes; browser default if omitted | img unchanged |
| onLoad / onError | Optional native HTMLImageElement event handlers, no synthetic own state/event | img only, never figure |
| Remaining allowed native attrs / className | Figure only, including id/aria-describedby and compatible passive metadata; no default | Root figure |

Unknown untyped ratio/variant/focalPoint normalize to landscape/default/center. Empty src/undefined alt are unsupported caller inputs; do not invent fallback source/alt/attribution. Figure native style remains present in the approved type; it is **not** appearance/crop override permission. Do not silently tighten this API, add fetchPriority/imageProps/aliases, promote native img props to own conventions, add figure click/focus/name semantics or expose ref/children/asChild. Root metadata never leaks onto img. Exports remain `PhotoFrame`, `PhotoFrameProps`, `PhotoFrameRatio`, `PhotoFrameVariant`, `PhotoFrameFocalPoint`; helper aliases/CVA/hooks remain internal.

**Naming:** Reviewed [canonical source](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md) by meaning/name/aliases: ratio→`aspect-ratio`; variant→`visual-treatment`; focalPoint→`image-focal-point`; imageCaption→`image-caption`. Existing entries are approved with no aliases/exceptions; no new convention/alias/global promotion. Native selected img attributes/events and root attrs/className need no own naming entry. Caption is not collection `group-caption`/caption; no caption alias migration. Future usages must manually review `packages/ui/src/atoms/photo-frame/types.ts` public symbols and record its real whole-file SHA-256. Existing primitive source observations above are not fabricated PhotoFrame usage evidence.

## 4. Behavior

| Input / condition | Retained observable promise |
| --- | --- |
| Defaults | Passive figure, landscape reserved viewport, default frame, centered cover, no caption wrapper/gap |
| Ratio / native image dimensions change | Only selected preset controls reserved viewport; native dimensions remain resource metadata |
| focalPoint changes | Static cover alignment changes, no explicit fetch/animation/ratio change |
| Nonblank caption / blank or omitted caption | Upright in-flow figcaption after entire frame / no caption or gap |
| framed / hover | Static media-only token tilt; no hover straighten, scale, pointer cursor or activation |
| Reduced motion | Every media/frame transform and transition removed, including resting tilt |
| Loading / error / source change | Native img behavior/callbacks; reserved viewport, supplied alt/caption remain; no fallback artwork, Skeleton, live message or custom state |
| Explicit alt empty | Native decorative img behavior; caption remains separate figure content |

No own controlled/uncontrolled state, timers, ResizeObserver, background sampling, pointer tracking or status/disabled/load engine. Presentation uses data-variant/data-ratio/data-focal-point, not data-state/is-* mirrors. Host supplies legal/suitable image, useful alt/crop/credit, responsive width, loading/request policy, caption contrast and unclipped frame outsets. Transforms do not enlarge normal-flow bounds; no unlimited caption-clearance guarantee at arbitrary widths. Plain-caption license needs requiring rich linked attribution remain host-owned outside the component.

## 5. Accessibility

Native figure > media img + optional figcaption; no duplicate role img, figure aria-label/labelledby, generated ID/name relationship or hiding the entire figure. Meaningful alt is explicit caller content, not copied from unavailable photo descriptions; empty alt is deliberate, never inferred from caption. Native caption-derived figure naming and img alt have distinct purposes. Native failure/AT results are browser-dependent, not proven by a fixture.

No root focus stop, keyboard handler, link/button role, lightbox or pointer gesture. Caption is selectable plain text, not pointer-events-none overlay. Crop contains no focusable descendants. At narrow widths/RTL/200%/400% zoom, caption stays upright, wraps and is not cropped; the host must allow frame visual outsets. Essential embedded image text requires an accessible equivalent, not frame styling. No loading/error speech or photo/accessibility/rights certification. Host foreground controls caption contrast; flood requires existing fg-on-flood, not automatic inversion.

## 6. Appearance

- **Root:** Structural `eg-photo`, margin 0, min-w-0, flex column, gap-3 with caption (gap-10 framed); absent caption leaves no gap. Overflow visible, rounded-none, transparent background/no image/no shadow, transform/transition none, after content-none suppresses legacy vignette. No independently painted figure.
- **Frame:** Compose `surfaceVariants({tone:'surface-1', elevation:1, padding:'none', radius:'xl'})` for default; framed uses surface-0/elevation 2/padding none/radius xl plus owned p-1.5 (`--space-1 × 1.5`) and retained hairline. Current Surface source supports exactly this, including raised surface-0 sheen, strong light edge and two-layer elevation-2 shadow. No copied glow/literal black rim/new Surface tone or padding API.
- **Viewport/img:** Own size-full clipping div inside untouched AspectRatio, default radius-xl/framed radius-lg. Img block/full width/full height/max-width none/object-cover; static object-center/top/bottom/left/right. Reset legacy absolute positioning/inset/--pos dependency and filter. Viewport ratio alone is 1, 4/5 or 4/3; frame inset/border, transformed bounds and caption are excluded from measurements.
- **Caption:** Relative in-flow block, inset-auto/z-auto/pointer-events-auto, wraps without clipping; later positioned paint order stays above preceding transformed media. Span resets legacy inline-flex/color/diamond pseudo-element with block/min-w-0/font-display/text-label-eyebrow/uppercase/text-inherit/before content-none. Foreground inherits host tokens, no fictional Text caption variant.
- **Tilt:** Framed media only: static `calc(var(--tilt-max) / 3)` rotation. Figure/caption upright; no hover/active transform, scale, animation or transition. Reduced-motion removes resting tilt and all frame transforms/transitions; implementation must reset individual rotate as well as transform when emitted utilities use separate properties. No public angle or Gauge numeric exception.
- **Excluded paint:** No vignette/lower gradient, saturate/contrast filter, red tint, duotone, glow, backdrop or custom shadows. Legacy CSS/consumers remain. Static CVA utilities in types.ts and per-part cn in hook. **No stylesheet.** No extra internal modules, token/dependency changes or alternative geometry engine.
- **Merge:** Root className merges last for outer margin/width/min/max-width and parent flex/grid placement only. Test recognized layout conflicts and retention of stable markers; no permission for height/clipping/transform/Material/caption/crop overrides, part props or img style/className. Native root style is not an appearance escape hatch. cn/twMerge cannot promise universal last-class wins across arbitrary selectors/layers/variants; legacy pseudo/filter/caption reset needs real emitted-CSS cascade checks.
- **Six meaningful files:** `types.ts` (all own aliases/types/CVA/JSDoc); `usePhotoFrame.ts` (typed enum/default/ratio mapping, caption presence, exact native routing, CVA/cn); `PhotoFrame.tsx` (JSX only, real AspectRatio/native elements); `PhotoFrame.test.tsx`; `PhotoFrame.stories.tsx` (`Atoms/PhotoFrame`); `index.ts`. No dummy CSS/hook. Own selects use `@control select`, imageCaption/src/alt text controls and accurate constant defaults; picked optional native props are not redeclared just for Controls. No manual argTypes/play.

### Retained approved visual identity

| ID | Immutable reference / SHA-256 | Retained scope and limits |
| --- | --- | --- |
| VIS-01 | [Original board](https://raw.githubusercontent.com/egdev6/egdev-design-system/97677b286e39a2a7e4a9ce545e45613ac20b5bfc/docs/design/foundation-boards/v2026-10-18/PhotoFrame.png); `da886df91ee0b7f113b07ff8715ce747bcb93126f0f77c50d75e7561e6d1f0c7` | Original neutral placeholder board/source placement only; approved target differences exclude overlay caption, source filter/vignette/hover and photography assumptions |
| VIS-02 | [Supplemental reference](https://raw.githubusercontent.com/egdev6/egdev-design-system/97677b286e39a2a7e4a9ce545e45613ac20b5bfc/docs/design/foundation-boards/v2026-10-18/specimens/photo-frame--specimen.png); `1095e82de8abc25c92a1cc6ffb14c1ee247f97d196dcb4c74c665bc65f204950` | Neutral static ratio/frame/caption layout and normal/unrotated reduced-motion illustration; not runtime/media-query/photo evidence |

Parent has already verified both immutable PNG byte hashes at the pinned commit; **no missing-SHA/publication blocker is reopened** and writer did not refetch them. Scoped approval is the full v0.2 record above, not independent/native review or runtime conformity. Retain original capture version v0.1: VIS-01 PNG 1265×1099 versus reported viewport 1280×900; VIS-02 PNG 1265×1335/section crop versus reported viewport 1280×900; DPR 1/Chromium 148/Linux, loaded Barlow/Barlow Condensed/JetBrains Mono, recorded reduced motion false. VIS-01 dark theme; VIS-02 theme not recorded. Reduced transparency unrecorded. Those differences are not silently normalized into new capture conditions.

### New diagnostic preparation, not a replacement approved visual

[diagnostic.svg](fixtures/diagnostic.svg) is locally authored readable square SVG test artwork, not photography. [provenance.json](fixtures/provenance.json) binds actual bytes, primitive palette source, labels and analytical cover windows. A square source exercises horizontal overflow under portrait and vertical overflow under landscape; square preset is a no-overflow negative case. No photographer/license/rights/photo-quality assertion, copied opaque blob or runtime fallback. Fixed SVG geometry/color/font labels are diagnostic image data only, not component-style tokens.

[specimen.html](specimen.html) is static proposed geometry/Material with native diagnostic img elements, not PhotoFrame React output. It links parent-hosted compiled `/tokens.css`; preview reservation is explicitly not runtime Radix implementation. [capture-request.json](capture-request.json) requests new P-VIS-03/04/05 condition-bound supplemental captures (ratio/crop, frame/reduced-motion, caption/decorative). Source/fixture hashes are real; captures/browser decoding/Controls/AT/runtime results are Pending. Loading/error checks require later parent-owned routing, not authored fallback UI. Existing full-contract approval is retained; owner adoption of the **new fixture/preparation plan** remains before runtime. Visual conformity: **Not evaluated**.

## 7. Acceptance criteria

Retain approved v0.2 AC IDs; all runtime methods below are planned, not observed passes.

| ID | Preserved promise / planned method | Evidence now |
| --- | --- | --- |
| AC-01 | Native figure, one exact-alt img, optional native caption, no duplicate role/name wrapper; DOM/accessibility queries | Full contract recovered |
| AC-02 | Defaults/mapping to 1, 4/5, 4/3; real AspectRatio reservation before load/after failure excluding frame/caption/rotation | Primitive source reviewed; no browser measurements |
| AC-03 | All selected native attributes/defaults to img; remaining native attrs to figure; DOM/type checks | Exact routing recovered |
| AC-04 | Native HTMLImageElement onLoad/onError/source changes, no fallback/state/live message; real routed delayed/error fixture checks | New fixture proposed; no runtime test |
| AC-05 | Explicit alt-empty decorative case, never inferred from caption; separate informative alt/caption | Diagnostic alt candidate, not photo description |
| AC-06 | Omitted/blank caption leaves no gap; nonblank caption upright/outside clipping/rotation; DOM/rerender/layout/selection | Static proposed illustration only |
| AC-07 | Host token foreground including flood; no overlay/diamond/filter readability dependency; computed contrast/pseudo-style checks | Token/legacy source reviewed |
| AC-08 | Specified Surface default/framed recipes including raised surface-0 sheen and edge/two-layer shadow; CVA/CSS checks | Actual API matches; not built |
| AC-09 | Five keyword crop presets preserve ratio; type/CVA and approved diagnostic native-browser crop checks | Analytical landmark windows only |
| AC-10 | Media-only token tilt, no hover motion; real reduced-motion transform/transition checks | Static authored unrotated illustration only |
| AC-11 | Legacy vignette/filter/caption/frame cannot leak; cn/emitted-CSS cascade with legacy loaded, no legacy deletion | Exact selectors inspected |
| AC-12 | Passive keyboard/semantics, readable selectable caption at narrow/RTL/200%/400% zoom | Not run |
| AC-13 | Outer-layout merges/markers, no extra APIs; enum fallback and negative type/native tests | No runtime API created |
| AC-14 | Six files/compiled CVA/actual primitives ship to native-CSS React18/19 client/SSR consumers without Tailwind | Planned later parent gates |
| AC-15 | JSDoc/defaults/AST/docgen/enhancer/real Controls match own/native distinction; no manual argTypes/play | Planned |
| AC-16 | Original scoped VIS identities, full version/approval recovery and new diagnostic provenance remain distinct | Canonical reconstruction verified; parent-provided prior PNG verification retained |

**Readiness:** Full v0.2 approval and atom classification are resolved. Only new fixture adoption, proposed capture review and the exact separate implementation plan/assignment remain; no request to reapprove inherited promises or repeat immutable PNG verification. Preparation structural/hash/link checks are reported in handoff. No runtime code, browser/server/install/build or Git/GitHub mutation is authorized or performed.
