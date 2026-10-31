# PhotoFrame — exact conditional implementation plan

- **Status:** v0.3 preparation Draft. Runtime not started; no implementation-plan approval claimed.
- **Authority:** Approved **full v0.2**, canonical `13d66d39b036de68276c332bab3b97c3e8de6f42f4ebc2024c96be4a94142774`, [owner comment](https://github.com/egdev6/egdev-design-system/issues/95#issuecomment-6251537589); atom placement/title from [classification amendment](https://github.com/egdev6/egdev-design-system/issues/95#issuecomment-6244025883). [Recovery](contract-recovery.md) records exact frozen sources and successful lossless reconstruction. No full-contract reapproval is requested.
- **Source baseline:** `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`; Surface/AspectRatio already implemented/exported, installed AspectRatio Radix dependency 1.2.0. No dependency/token/primitive modification required.
- **Plan identity:** SHA-256 of UTF-8 LF bytes from the actual `## 1. Remaining gates` heading through EOF with final LF, excluding metadata; recorded in [capture-request.json](capture-request.json). New fixture/preparation hashes do not replace the approved v0.2 contract identity.

## 1. Remaining gates

1. Owner adopts the exact proposed [diagnostic SVG](fixtures/diagnostic.svg) and [provenance](fixtures/provenance.json) for deterministic testing/story examples. Authoring permission is already granted; adoption of these bytes is not inferred. This is not photography or a rights certificate.
2. Parent previews [static specimen](specimen.html) with actual compiled canonical `/tokens.css`, records new supplemental captures/conditions/hashes, and reviews them within the already-approved target-difference boundaries. Keep original VIS-01/VIS-02 and their approved scope. Both immutable old PNG identities have already been verified by parent; no missing-SHA gate remains.
3. Owner separately approves this exact plan payload and parent supplies a fresh bounded runtime assignment, including integration ownership. No runtime eligibility follows from this writer's self-review or the earlier contract/status label.
4. Reinspect working tree, primitive APIs and final source hashes before implementation. Any substantive contract discrepancy/change must be reported, not resolved by broadening APIs or editing prerequisites. Current source matches the approved recipe.

Only six v0.3 preparation files are writable now. Completed Panel outputs, ODD mirror, shared inventories/registries, runtime/tests and historical PhotoFrame references remain read-only. No install, build, server, browser, Git/GitHub mutation or capture publication is authorized to the writer.

## 2. Exact intended future surfaces and responsibilities

These are proposed runtime/integration edits, **not authorized in preparation**.

| Future path | Responsibility |
| --- | --- |
| `packages/ui/src/atoms/photo-frame/types.ts` | Writer: exact public types from v0.2, all static per-part CVA and legacy resets, English JSDoc/default/control tags |
| `packages/ui/src/atoms/photo-frame/usePhotoFrame.ts` | Writer: typed enum normalization, ratio mapping, caption-presence check, exact native img/figure routing and per-part cn; no image state machine |
| `packages/ui/src/atoms/photo-frame/PhotoFrame.tsx` | Writer: JSX-only native figure/frame/viewport/img/caption, actual AspectRatio; no custom spacer/ref forwarding/handlers |
| `packages/ui/src/atoms/photo-frame/PhotoFrame.test.tsx` | Writer: hook/DOM/type/negative API and primitive integration checks; fixture bytes read as test input only |
| `packages/ui/src/atoms/photo-frame/PhotoFrame.stories.tsx` | Writer: real `Atoms/PhotoFrame` metadata/story matrix using approved diagnostic resource, not remote photography; no manual argTypes/play |
| `packages/ui/src/atoms/photo-frame/index.ts` | Writer: PhotoFrame + four public types only, no hooks/CVA/internal aliases |
| `packages/ui/src/index.ts` | Parent: one atom barrel export |
| `packages/ui/src/styles/compiled.css` | Parent: add the exact PhotoFrame types.ts source-scanning entry; current atom inventory is explicit, not wildcard |
| `.storybook/preview.css` | Parent: exact PhotoFrame stories source-scanning entry; current atom story inventory is explicit |
| `skills/_shared/prop-naming.json` | Parent: reviewed usages only for four approved entries using actual new types.ts hash; no convention/alias changes |
| `docs/prop-naming.md` | Parent-generated reference after authorized registry update; never hand-edit |
| `scripts/catalog_data.py`, `docs/CATALOGO.md`, `docs/catalog.json` | Parent: bounded implemented-atom status/evidence update and authorized generated outputs |
| `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs` | Parent: export/type/compiled CSS/SSR/CSR native consumer cases on React 18/19 |

Existing `docs/components/photo-frame/v0.3/fixtures/diagnostic.svg` is read-only test/story input after adoption, never a production default, fallback or hidden component dependency. Keep fixture hashes/provenance recoverable. For stories, a static Vite `?url` import of this local asset can provide the source without base64 duplication; validate the actual Storybook asset resolution before claiming success. Test/browser harness owns same-origin serving, held/404 responses and query URLs. Do not copy new fixture files, add runtime asset props or alter Vite configuration silently; escalate if current harness cannot consume the approved resource.

No PhotoFrame CSS, additional internal modules, package changes, legacy deletions, Surface/AspectRatio edits or molecule-path shim. Native root style remains in the approved type without granting appearance overrides; do not remove it or add new APIs as a cleanup.

## 3. Minimal implementation sequence after approval

1. **RED:** Small behavior-level test imports PhotoFrame and expects a native figure with required img src/alt, lazy/async defaults and landscape geometry; observe intended absence failure before implementation. Add further tests incrementally. Preparation has no meaningful runtime RED/GREEN lifecycle.
2. **Types/CVA:** Copy exact recovered v0.2 own/native type surface. Declare static ratio/variant/focalPoint and per-part utilities; Surface recipe supplies media paint only. Root structural resets, after-content-none, image static/inset-auto/filter-none/object keyword and caption/label reset all legacy effects without changing legacy CSS. Frame inset is owned p-1.5 over Surface padding none, not a new padding preset.
3. **Hook:** Explicitly separate each selected image attribute/event from root rest; required src/alt route only to img, width/height never determine viewport ratio. Normalize unknown enums to landscape/default/center, caption absent/blank omits node and effective caption gap. Compose typed root/frame/viewport/img/caption/label props with cn. No generated IDs, load listeners/state/timers, source rewrite, intrinsic-ratio inference, attribution or fallback.
4. **JSX:** Render `figure → media div → AspectRatio → own clipping viewport → img`, followed by optional sibling `figcaption > span`. All normalization, presence branching inputs and classes come from hook; no state/CVA/native-prop routing in JSX. Use actual exported surfaceVariants on media div, not duplicated Surface engine. Pass AspectRatio only selected numeric ratio/children, never styling/refs into its private wrapper.
5. **GREEN / triangulate:** Confirm default/framed recipes, optional caption, all ratio/focal combinations, native destinations/events, invalid enums, passive semantics and public marker/merge boundaries. A square diagnostic image gives useful crop distinctions on both axes without new assets: portrait horizontal overflow, landscape vertical overflow, square no-overflow negative control.
6. **Preferences/cascade:** Frame-only static token tilt, no hover motion or transition; reduced motion resets separate rotate and transform properties where applicable. Keep caption upright/in-flow/above preceding rotated media. Test compiled utilities with actual legacy CSS and no app Tailwind compiler; class strings alone do not prove reset precedence or media-query behavior.
7. **Stories/integration:** Parent integrates shared scanner/barrel/metadata/registry/catalog/package tests under fresh authority. Writer annotates own controls, native src/alt requiredness and actual constant defaults. Default story supplies required fixture src/alt only; no fake defaults/photography, renderer adapter/manual argTypes or play test. Record actual final source hashes after manual review.

## 4. Planned verification matrix

| Approved AC | Functional / negative checks | Browser/story checks |
| --- | --- | --- |
| AC-01/05 | Native figure/img/caption relationship, exact informative alt; explicit empty-alt decorative case, never inferred from caption | Default, WithCaption, Decorative; native accessibility tree, no wrapper role/name |
| AC-02/03 | Map square/portrait/landscape to 1/0.8/4÷3; default lazy/async; all selected resource/request attributes to img, figure id/aria-describedby/className stay on figure | Ratios, ResponsiveImage, EagerImage; untransformed viewport measurements before delayed load/after failure |
| AC-04 | Native onLoad/onError event currentTarget is HTMLImageElement; no custom fallback/live/state; source query update preserved | Hold/release exact SVG response; explicit 404; cache-distinct same-byte source URLs; log actual events/status/viewport, not synthetic dispatch as load proof |
| AC-06/07 | Absent/blank caption removes gap; supplied text preserved; below/outside clipping/transform; inherited host fg, no diamond/vignette/filter | WithCaption, WithoutCaption, LongCaption, HostContexts; canvas/raised/flood, selection, paint order/contrast |
| AC-08/09 | Surface exact tone/elevation/padding/radius and framed inset; real AspectRatio, no spacer clone; focal enum/type/keyword mapping | FocalPoints: portrait left/center/right; landscape top/center/bottom; square five-way no-op; compare diagnostic landmarks/known analytical source windows |
| AC-10/11 | No legacy modifier/hover transform; token tilt on media only; root/image/caption reset utilities emitted | Framed/ReducedMotion/LegacyCoexistence: real hover, emulated reduced-motion and computed individual rotate/transform/transition/pseudo/filter/caption CSS |
| AC-12/13 | No role/tabIndex/onClick/children/ref/asChild API, no own keyboard/focus/open engine; enum fallbacks; bounded class merges/markers | Passive/Narrow/RTL/LongCaption/ConsumerLayout; 200%/400% zoom, host clearance, unclipped caption |
| AC-14/15 | Six meaningful files, static utility scan/CSS build, exact exports/negative type fixtures; AST plus actual docgen/enhancer/inference diagnostics | Real Controls select ratio/variant/focalPoint, imageCaption text; React18/19 packed SSR/CSR without Tailwind; no img handler on figure |
| AC-16 | Full v0.2 reconstruction/hash and frozen source/approved visuals retained; fixture XML/palette/byte provenance matches | Parent adopts new fixture/captures explicitly, no replacement/reapproval of old VIS scope; visual conformity separately evaluated |

**Proposed later commands, not run/authorized now:** focused `pnpm exec vitest run packages/ui/src/atoms/photo-frame` first; then `pnpm exec vitest run packages/ui/src/primitives/aspect-ratio packages/ui/src/primitives/surface`. Parent reviews/assigns actual metadata and shared lint/typecheck/test/props/build/package export/consumption commands from current scripts under its serialization locks/resource caps. No broad suite/build/packed run belongs to docs-only preparation.

A JSDOM event dispatch does not prove resource decoding, naturalWidth, native error behavior or layout. Static HTML crop views do not test React attribute routing, Radix reservation or Controls. Parent owns real browser/capture servers, actual compiled tokens/fonts and network route fixtures. Manual AT/native image failure behavior and photo suitability/rights remain separate from deterministic synthetic-image testing.

## 5. Actual preparation evidence and review burden

Actual: full frozen body/amendment/final approval read; all reconstruction counts and approved canonical digest matched; current primitive/source/barrel/legacy/token/naming review; local readable SVG and provenance/static specimen/capture request authored; structural/link/hash checks in handoff. No browser/AT/photography/rights/runtime test, build, installation or native approval receipt is claimed. Missing initial PhotoFrame docs directory was observed, not a missing-approved-contract blocker: full source is recoverable from the supplied issue history.

Estimated later runtime review: 650–900 lines including tests/stories plus bounded parent integration. Suggested review units: types/hook + default/native tests (~250–350 lines), JSX/recipe/negative regression checks (~200–300), stories/metadata/CSS/package evidence (~200–250); keep behavior tests adjacent to implementation. Estimates are not Git/PR action grants. Preparation is six files, with original approved snapshot preserved by exact reconstruction references rather than another copied historical body.

**Stop after handoff:** Initial fixture/plan readiness awaits owner adoption and separate plan approval. No PhotoFrame implementation, shared edits or release/delivery action may start from this draft alone.
