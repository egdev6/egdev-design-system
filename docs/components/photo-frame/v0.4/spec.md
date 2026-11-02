# Component contract — PhotoFrame v0.4 amendment: unreserved ratio and a finite focal-point set

- **Version / status:** 0.4 — **Draft amendment**, presented for owner approval. The approved base contract remains **v0.2** ([full-contract approval](https://github.com/egdev6/egdev-design-system/issues/95#issuecomment-6251537589), canonical payload `13d66d39b036de68276c332bab3b97c3e8de6f42f4ebc2024c96be4a94142774`). This document changes two own inputs of that contract and nothing else.
- **Approval / recovery:** Pending. This file is the recoverable copy of the version presented for approval; approving it does not authorize code, tokens, dependencies or publication.
- **Current situation / pending decisions:** Existing atom with an approved contract. Delta verified against the current implementation and against the read-only web source. Two owner decisions block finalisation: whether `ratio` also accepts a numeric proportion (Q2) and whether exact percentage crops may use a bounded inline-variable mechanism (Q3). Four further questions (Q1, Q4, Q5, Q6) confirm or reject the recommended boundary. Nothing in this draft is implemented.
- **Snapshot identity:** `version: 0.4`; `contentSHA256: 2db38f20c3f72d0f1abe6415e67c37678787387d5608e923d771a68fb488fc14`; `visualHashes: VIS-03 → sha256:a1d1a240f6aa47e52d73293bba5fd58e667c96fbbd9a15be633bf46d0eb7d62f; VIS-04 → sha256:86cf61757dc9b1a405e6b3d067ddc8624aab19aad3ea3e1a83f16d926dd36364; VIS-05 → sha256:b8f75b16af9d9dc1b6feada58a8decea4f901bb7466f60e8fa07e1b0107f301c; VIS-06 → sha256:9101df380045ee554a16a832e723af0519fbc8205fe855f32d59cc09ae17359a`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/95`; `latestPublishedComment: Pending — this snapshot is unpublished`.
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from the `## 1. Purpose and scope` heading through EOF, LF line endings, including the final newline; all tracking metadata above that heading is excluded.
- **Version numbering:** the `docs/components/photo-frame/v0.3/` folder is implementation preparation for the approved v0.2 contract, not a contract version of its own, so the next contract amendment is `0.4`.
- **Delta at a glance:** `ratio` gains `auto` (no reservation, the host layout supplies the height); `focalPoint` grows from five keyword crops to the nine-value alignment set. Everything else in v0.2 — passive semantics, native image routing, caption model, Material frame, static tilt, markers, merge limits and the six-file layout — stays in force unchanged.

## 1. Purpose and scope

**Need.** The owner approved that the design system must be able to build new views of the Pulso web (`odd/tasks/web-catalog.md` S3, L1/L5). The cataloging draft recorded exactly one PhotoFrame variant gap for that goal: `ratio="auto"` and image `position` (`docs/components/web-catalog/v0.1/cataloging-draft.md` §3). This amendment closes that gap and nothing else.

The current atom always reserves one of three ratios and crops with one of five keyword alignments. Three real Pulso figures need something else, and the evidence is exact (source paths and line numbers below are relative to the read-only `egdev-foundation` tree; absolute roots and file hashes are in [capture.json](capture.json)):

| Pulso usage | Web source (read-only) | What it actually needs | Current design system |
| --- | --- | --- | --- |
| About portrait ("Fuera del editor") | `reference-web/pulso-source.html:854-855` markup; `:168` `.ph-canyon{height:100%;min-height:420px;--pos:42% 50%}`; `:509` below 760px `{height:auto;min-height:0;aspect-ratio:4/3;--pos:40% 46%}` | No reserved proportion at all: the figure takes the height of its stretched grid cell, and the crop is `42% 50%` | **Missing both.** `ratio` accepts only the three presets; `focalPoint` has no percentage value |
| Live band landscape ("En directo desde casa") | `:1103-1104`; `:363` `.ph-setup{aspect-ratio:4/3;border:6px solid #000;border-radius:18px;transform:rotate(2deg);--pos:32% 50%}`, `:hover{transform:rotate(0deg) scale(1.01)}`; `:520` below 760px `rotate(1.5deg)` | The `4/3` preset (already covered), the crop `32% 50%`, and a hover straighten | Ratio covered; **crop missing**; the framed treatment is a deliberate, approved divergence (see non-goals) |
| Community portrait ("Hazlo con miedo") | `:1138-1139`; `:392` `.ph-hazlo{aspect-ratio:716/890;--pos:50% 40%}`; `:523` below 760px `{aspect-ratio:4/5;max-height:80vh}` | A proportion equal to the photograph's own `716×890`, plus the crop `50% 40%` | **Ratio not expressible** (Q2); **crop missing** |

`design-system/components/PhotoFrame/README.md:22-23` documents the web API as `ratio: "auto" | "square" | "portrait" | "landscape"` (default `auto`, "con auto la da el contenedor") and `position: string` (default `"50% 50%"`, applied through `--pos`). The rendered preview confirms the free-form part of that API: the three figures carry `--pos: 42% 50%`, `50% 40%` and `32% 50%`, and the browser computes those exact object positions (VIS-03).

**In scope.** Two additions to `PhotoFrameProps`: an `auto` value for `ratio`, and four further keyword values for `focalPoint`. Both are expressed with existing static utilities; no token, dependency or Material recipe changes.

**Explicitly out of scope (reported, not proposed).** Each of these is either an already-approved divergence or a decision this draft cannot take alone:

- Overlay caption inside the frame, the neon-diamond label marker, the radial vignette plus bottom gradient, and the `saturate(.92) contrast(1.06)` filter. All were approved as excluded in v0.2 §6; the design system caption sits below the media. Captured here (VIS-03) only so the divergence stays visible.
- The web framed treatment: `6px solid #000` border, `18px` radius, resting `rotate(2deg)` and the hover straighten `rotate(0) scale(1.01)`. v0.2 approved a different framed recipe (Surface inset with a static `--tilt-max / 3` tilt) and explicitly excluded hover motion. Recorded as Q5; not proposed.
- Responsive ratio and position: every Pulso figure changes proportion and/or `--pos` below 760px. This contract has no breakpoint input and forbids appearance overrides through `className`. Recorded as Q4.
- A bespoke numeric proportion (`716/890`). Recorded as Q2 because it widens the public type beyond the cataloged `auto` gap.
- Anything else the atom already excludes in v0.2: gallery/lightbox, action, uploader, video, rich or linked caption, source optimisation, status feedback, tint/filter API, upstream image sourcing.

**Cataloging decision / alternatives.** Reuse with a widened input surface — the third step of `docs/CATALOGACION.md`, after reuse-without-change was rejected. The atom keeps a single responsibility (one framed editorial image), so no new component and no new level: `PhotoFrame` stays an atom in `@egdev/ui` at `packages/ui/src/atoms/photo-frame/`. Reuse as-is fails the owner's goal (two of three figures cannot be expressed). Variant-in-the-CVA sense is exactly what `ratio` already is. Compose was rejected because a new wrapper around `PhotoFrame` plus host CSS would move the intended appearance into consumer code, which the merge policy forbids. Extract and new are irrelevant: the atom exists and no second responsibility appears.

**Evidence / level and package.** Current public React implementation reviewed in this working tree:

| Path | Reviewed symbol | Whole-file SHA-256 |
| --- | --- | --- |
| `packages/ui/src/atoms/photo-frame/types.ts` | `PhotoFrameRatio`, `PhotoFrameVariant`, `PhotoFrameFocalPoint`, `PhotoFrameProps`, the five CVA recipes | `d88523162dc25f36bd591bbabdf2169775ab9b209ae3547a0fd36b5901f130f4` |
| `packages/ui/src/atoms/photo-frame/usePhotoFrame.ts` | `usePhotoFrame` (enum normalisation, caption presence, native routing) | `32ff7649af9332181f840886060b92f5029546c7436b1a1d241b5adbaee57807` |
| `packages/ui/src/atoms/photo-frame/PhotoFrame.tsx` | `PhotoFrame` (JSX, `AspectRatio` usage) | `e1cf0c397a40ada35d37be9e438e964e592db439e61d5549423ae0a7bf5fdfae` |
| `packages/ui/src/atoms/photo-frame/index.ts` | public exports | `b62ce917a598f3515d0901b452df7dc1409e030f784e54437e5891cb11a16452` |
| `packages/ui/src/primitives/aspect-ratio/types.ts` | `AspectRatioProps` (numeric ratio, non-positive fallback to square) | reviewed, unchanged |

The public exports today are `PhotoFrame`, `PhotoFrameProps`, `PhotoFrameRatio`, `PhotoFrameVariant` and `PhotoFrameFocalPoint` (verified in `index.ts` and `packages/ui/src/index.ts`). Web evidence is the owner-granted read-only `egdev-foundation` tree recorded in `capture.json` (`source`), with the rendered screenshot proof in VIS-03 to VIS-06.

## 2. Anatomy and composition

| Part | Responsibility | Native element / Radix primitive | Allowed content |
| --- | --- | --- | --- |
| Root `eg-photo` | Unpainted, unclipped flow; media then optional caption | native `figure` | Media frame, optional caption |
| Private media frame | Single Material frame; optional inset and static tilt | `div` + `surfaceVariants` recipe (unchanged) | Ratio region |
| Ratio region | Reserves a proportion for the three presets | Radix `AspectRatio`, **rendered only for `square` / `portrait` / `landscape`** | Viewport |
| Private viewport | Passive image clipping and rounding | `div` | `img` |
| `eg-photo__img` | Exactly the supplied resource, alternative and routed native attributes | native `img` | — |
| `eg-photo__cap` / `eg-photo__label` | Plain supplied caption outside the media | native `figcaption` / `span` | Text |

- **Delta:** with `ratio="auto"` the ratio region is not rendered. The media frame fills the height the figure receives and the viewport keeps its existing `size-full` (`h-full` is the only utility added, alongside utilities the recipes already use), and the image keeps `object-cover` plus the resolved object position. The three preset values keep the current `AspectRatio` composition byte-for-byte.
- **Radix / composition:** no Radix change. `AspectRatio` remains the only primitive involved and is simply not mounted for `auto`; no recreated percentage spacer, no `ResizeObserver`, no measurement and no conditional CSS engine. No `asChild`, `children`, ref or Portal behaviour is introduced.
- **Public markers:** the four existing markers are preserved and none is added. `data-ratio` gains the value `auto`; `data-focal-point` gains the four new values; `data-variant` is unchanged. Those attributes remain presentation/debug markers, not a styling contract.

## 3. Public API

The [canonical registry](../../../../skills/_shared/prop-naming.json) and the [generated view](../../../prop-naming.md) were consulted by meaning, name and aliases. Applied entries, unchanged by this amendment:

| Registry entry | Prop | Current usage recorded | Status |
| --- | --- | --- | --- |
| [`aspect-ratio`](../../../../skills/_shared/prop-naming.json) | `ratio` | `PhotoFrameRatio ('square' \| 'portrait' \| 'landscape')` | approved convention; usage value set widens |
| [`image-focal-point`](../../../../skills/_shared/prop-naming.json) | `focalPoint` | `PhotoFrameFocalPoint ('center' \| 'top' \| 'bottom' \| 'left' \| 'right')` | approved convention; usage value set widens |
| [`visual-treatment`](../../../../skills/_shared/prop-naming.json) | `variant` | `PhotoFrameVariant ('default' \| 'framed')` | approved convention; unchanged |
| [`image-caption`](../../../../skills/_shared/prop-naming.json) | `imageCaption` | `string` | approved convention; unchanged |

No new convention ID is proposed and no exception is recorded. The documented intent of both changed entries is respected: `aspect-ratio` already allows "a numeric width divided by height or a documented set of format presets", and `image-focal-point` requires a *finite set of static object-position choices* while asking to *avoid arbitrary inline CSS coordinates* — which is why Q3 offers the exact-percentage mechanism only as a separate, explicitly approved exception rather than as part of this draft.

**Reviewed source for the two changed usages:** `packages/ui/src/atoms/photo-frame/types.ts`, symbols `PhotoFrameRatio` / `PhotoFrameProps` / `PhotoFrameFocalPoint`, whole-file `sha256:d88523162dc25f36bd591bbabdf2169775ab9b209ae3547a0fd36b5901f130f4` — read in this working tree and equal to the revision already recorded in the registry today. **Follow-up outside this task:** the two usage `type` strings in the registry JSON still list only the current values; updating them requires a registry edit plus `pnpm props:docs` / `pnpm props:check` / `pnpm test:props`, which this docs-only amendment does not perform. Convention approval, entry hashes and status are unaffected and are not inferred from this spec's approval.

### Delta type surface

```ts
type PhotoFrameRatio = 'square' | 'portrait' | 'landscape' | 'auto';
type PhotoFrameFocalPoint =
  | 'center' | 'top' | 'bottom' | 'left' | 'right'
  | 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom';
```

Everything else in `PhotoFrameProps` is inherited unchanged from v0.2.

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `ratio` | `PhotoFrameRatio` | no | **`landscape`** (unchanged) | Reserved proportion of the image viewport. `square` = 1, `portrait` = 4/5, `landscape` = 4/3. `auto` reserves nothing: the media fills the height the host layout gives the figure. Frame inset, transformed bounds and the caption stay outside the reservation. Unrecognised runtime values still normalise to `landscape` |
| `focalPoint` | `PhotoFrameFocalPoint` | no | `center` | Static cover alignment inside the viewport. `center`/`top`/`bottom`/`left`/`right` keep their current utilities; `left-top`, `right-top`, `left-bottom`, `right-bottom` add the four corners. Unrecognised runtime values still normalise to `center`. The value changes cropping only, never the reserved ratio and never the request |
| `variant` | `PhotoFrameVariant` | no | `default` | Unchanged from v0.2 |
| `imageCaption` | `string` | no | absent | Unchanged from v0.2: blank or whitespace-only omits the caption and its gap |
| `src`, `alt`, `srcSet`, `sizes`, `width`, `height`, `loading`, `decoding`, `crossOrigin`, `referrerPolicy`, `onLoad`, `onError` | as v0.2 | `src`/`alt` yes | as v0.2 | Unchanged routing to the image only |
| Remaining native figure attributes, `className` | as v0.2 | no | — | Unchanged: figure only, outer layout scope |

- **Native props / refs:** unchanged. No ref, no `forwardRef`, no `asChild`, no `children`.
- **Controlled / uncontrolled:** Not applicable — the atom keeps no state; `ratio`, `variant` and `focalPoint` are consumer-selected values, not state it owns.
- **Compatibility:** additive only. The three existing ratios and five existing focal points emit the same classes as today, so existing consumers and stories render identically. `PhotoFrameRatio` and `PhotoFrameFocalPoint` are widened unions (no member removed or renamed), which is source- and runtime-compatible. `data-ratio="auto"` is the only new attribute value any consumer could observe. Public exports, the `Atoms/PhotoFrame` story title and all four `eg-photo*` markers are unchanged. No legacy CSS is touched and no consumer migration is proposed.

## 4. Behavior

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| `ratio="auto"` inside a host container that has a definite height (stretched grid cell, fixed-height wrapper) | Media frame and viewport fill that height; the image covers it and is cropped by `focalPoint`; no ratio spacer is present in the DOM; `data-ratio="auto"` | none |
| `ratio="auto"` where the host supplies no definite height | The media collapses to zero height and the caption, if any, follows it. The component adds no `min-height`, no placeholder and no warning; this stays a documented host responsibility | none |
| `ratio` changes at runtime (preset ↔ preset, preset ↔ `auto`) | Only the reservation changes; the resource, its alternative, the caption and the object position are not re-fetched or reset | none |
| `focalPoint` changes | Only the static object position changes; no ratio change, no extra request, no animation | none |
| `auto` combined with `variant="framed"` | Allowed; the framed Surface recipe and its static token tilt are unchanged, and the media fills the figure height inside the tilted frame | none |
| Preset ratios `square`/`portrait`/`landscape` | Byte-for-byte the v0.2 behaviour: `paddingBottom` 100%/125%/75%, excluded from frame, caption and rotation | none |
| Unknown runtime values (`ratio`, `focalPoint`) | Normalise to `landscape` / `center`; the unknown value never reaches the DOM | none |
| Loading, error, source change, blank caption, decorative `alt=""` | Unchanged from v0.2 | native image events only, on the image |

- **States / representation:** no state machine is added. The own-state surface of v0.2 (`data-ratio`, `data-variant`, `data-focal-point`) is unchanged apart from the new values; no `data-state`, no `is-*` mirroring, no timers, no observers.
- **Limits / consumer responsibilities:** one static ratio and one static focal point per instance — no breakpoint switching (Q4). `ratio="auto"` requires a host-provided height; the component does not measure, guard or warn. The host still owns the legal and suitable image, a useful alternative, crop suitability, caption contrast, responsive `srcSet`, request policy and unclipped frame outsets.

## 5. Accessibility

- **Accessible name / roles / relationships:** unchanged. Native `figure` > `img` (+ optional `figcaption`); no duplicate `role="img"`, no generated id, no `aria-label`/`aria-labelledby` on the figure, no hiding of the whole figure. The alternative text remains explicit caller content; an empty `alt` stays a deliberate decorative choice and is never inferred from the caption.
- **Keyboard / focus:** unchanged — no root focus stop, no handler, no activation. Focal-point and ratio changes introduce no focus target. The four corner presets add no interactive or announceable surface.
- **Announcements / other conditions:** Not applicable; the atom announces nothing and gains no live region.
- **New risk owned by the host:** `ratio="auto"` without a definite host height collapses the media, which makes the image effectively invisible even though assistive technology still reads its alternative. v0.2's readable-content rules therefore become a joint obligation: the host must supply the height, and the component documents it instead of inventing a fallback. The `AutoHeight` story and AC PF4-02 must show the supported host pattern, and the spec must not claim the failure mode is guarded.
- **Unchanged conditions:** narrow widths, RTL, 200 %/400 % zoom, caption wrapping and host-driven caption contrast are unaffected by this delta; no new AT, contrast or rights certification is claimed.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| `ratio` | `square`, `portrait`, `landscape`, `auto` | `landscape` | `auto` removes the ratio region; compatible with every `focalPoint` and with both `variant` values |
| `focalPoint` | `center`, `top`, `bottom`, `left`, `right`, `left-top`, `right-top`, `left-bottom`, `right-bottom` | `center` | Static utilities only; some presets coincide when the axis has no overflow (for example `left`/`right` on a square source in a square viewport) |
| `variant` | `default`, `framed` | `default` | Unchanged from v0.2 |

- **Tokens / Material:** unchanged. The solid Material frame still composes `surfaceVariants(...)` exactly as v0.2 §6 records, and the framed inset, hairline and static `calc(var(--tilt-max) / 3)` tilt stay. `ratio="auto"` adds only layout geometry (`h-full`, `size-full`), which the recipes already use. No new token, no handwritten colour/shadow/spacing/font, no new Material recipe, no Surface change and no token confirmation is requested by this amendment.
- **Dynamic geometry:** **no new exception is requested.** The ratio region keeps `AspectRatio`'s existing approved mechanism for the three presets, and `auto` removes geometry rather than generating it. `focalPoint` values are static CVA utilities: no interpolated class strings (`object-[${x}%]` is refused), no inline `style` on the image and no arbitrary values. The one place where the web genuinely needs non-keyword coordinates is Q3: if the owner wants exact percentages, the mechanism would be a PreviewFrame-shaped bounded exception (static `object-[var(--eg-photo-pos-x)_var(--eg-photo-pos-y)]` reading validated, clamped percentage custom properties), which requires its own approval and a registry exception — it is not part of this draft.
- **Class composition / consumer layout:** unchanged. Root `className` still merges last for outer margin/width/min/max-width and parent flex/grid placement only, with `cn()`/`twMerge` limits as recorded in v0.2. This amendment does **not** widen that permission to height or appearance: with `ratio="auto"` the *component* emits `h-full`, and the host only has to place the figure in a container that already has a definite height (the web's own pattern, a stretched grid cell with `height:100%`). Media frame, viewport and image keep their current merge surface. Any new invariant (for example `auto` must not carry `aspect-ratio`) is pinned by tests.
- **Files / pending proposals:** the six mandatory files keep their roles — `types.ts` (widened unions, extended CVA, JSDoc), `usePhotoFrame.ts` (`auto` normalisation and the preset-vs-auto decision), `PhotoFrame.tsx` (conditional ratio region), `PhotoFrame.test.tsx`, `PhotoFrame.stories.tsx`, `index.ts` (unchanged export list). **No stylesheet** is created. No additional internal module, no global CSS and no token or dependency change. Story titles stay `Atoms/PhotoFrame`; the delta needs one new story (`AutoHeight`) and an extension of the existing `FocalPoints` matrix to the full nine values.

### Expected-design visual reference

All four images are real Chromium captures of the **web** `design-system/components/PhotoFrame/preview.html` rendered read-only for this task, with metadata and per-file hashes in [capture.json](capture.json). They are **observed web behaviour supplied as the comparison baseline — Proposed, not adopted**; nothing here approves a design-system appearance.

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-03 | [ratios--static--desktop--dark.png](ratios--static--desktop--dark.png) — three real photographs at 1:1 cropped at `--pos 42% 50%`, 4:5 at `50% 40%`, and 4:3 at `32% 50%`, each with the web overlay caption | Web ratio presets and free-form position, at rest | Web PhotoFrame `preview.html` (`sha256:658a9edd...`) at Foundation `tokens.css` + `bundle.css`; source capture version 0.4 for spec version 0.4 | Proposed — Pending |
| VIS-04 | [framed--static--desktop--dark.png](framed--static--desktop--dark.png) — two framed setup photos on the red flood: left resting `rotate(2deg)` with a 6 px black border, right authored in its hover state, straightened and scaled 1.01 | Web `--landscape --framed`, resting and authored-`.is-hover` states | Same source and conditions as VIS-03 | Proposed — Pending |
| VIS-05 | [framed--pointer-hover--desktop--dark.png](framed--pointer-hover--desktop--dark.png) — the same row after a real pointer hover: both frames straightened | Web `--landscape --framed` with a real pointer hover on the left figure | Same source and conditions as VIS-03, plus a 600 ms transition settle | Proposed — Pending |
| VIS-06 | [board--static--desktop--dark.png](board--static--desktop--dark.png) — the whole preview board, ratio row above the framed row, on the black canvas | Whole component board at rest | Same source and conditions as VIS-03 | Proposed — Pending (supplementary; replaces neither VIS-03 nor VIS-04) |

- **Conditions / provenance per VIS ID:** viewport 1280×960 CSS px, DPR 1, Chromium headless shell 153.0.8010.12 on Linux via playwright-core, dark colour scheme, `prefers-reduced-motion: no-preference`, `prefers-reduced-transparency: no-preference`, LTR, `lang="es"`. Barlow 400 and Barlow Condensed 600/700 loaded from Google Fonts (HTTP 200); JetBrains Mono stayed unloaded because no captured element uses the mono stack. Captures are element crops of the preview rows and board, not full pages. Date 2026-11-02, tool: author-written playwright-core script under `/tmp/egdev-sbcheck/` (hashes of the harness and script in `capture.json`). The harness only wrapped the fragment in a document, added the two authored stylesheets as `file://` links and resolved three runtime `/_blob/<id>` media URLs to the matching `reference-web/assets` photographs; no preview CSS or markup was altered.
- **Intent / acceptance / pending evidence:** VIS-03 supplies the exact web crop vocabulary and proves all three ratios already exist in the web component. VIS-04/VIS-05 document the framed treatment so the divergence from v0.2 stays explicit and reviewable. **No capture illustrates `ratio="auto"`**: the preview has no auto example, and the container-height and sub-760 px overrides exist only in page CSS (`pulso-source.html:168, 509, 523`), so that behaviour is quoted from source and is *not* visually verified. Pixel values in these images are web CSS values, never design-system tokens. Visual conformity of the proposed delta is therefore **Not evaluated** until an approved reference and a later implementation comparison exist. None of these images replaces behaviour, accessibility or token checks.
- **GitHub visibility:** Pending. The PNGs are local repository files, and issue handoff needs either a human attachment of the exact bytes or a separately authorized asset-publication route; see [issue-comment.md](issue-comment.md).

## 7. Acceptance criteria

All methods below are **planned**; none was executed for this docs-only amendment.

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| PF4-01 | `ratio="auto"` renders no ratio region (`[data-radix-aspect-ratio-wrapper]` absent), sets `data-ratio="auto"`, and the media frame/viewport carry the height-filling utilities | `PhotoFrame.test.tsx`: DOM assertion for `auto` and for each of the three presets | `AutoHeight` | Pending |
| PF4-02 | `ratio="auto"` fills a definite host height and collapses, without invented fallback, when the host supplies none; the supported pattern is documented | Test with a fixed-height host wrapper measured through `getBoundingClientRect`; explicit documentation assertion for the unsupported case | `AutoHeight` with a fixed-height host | Pending |
| PF4-03 | The three preset ratios keep their v0.2 reservation (100 %, 125 %, 75 %) with frame, caption and rotation excluded | Existing ratio tests retained unchanged | `Ratios` | Pending — regression guard for the touched code |
| PF4-04 | All nine `focalPoint` values emit distinct static utilities, and the five v0.2 values emit exactly their previous classes | `it.each` over the nine values plus explicit comparison for the five original ones | `FocalPoints` (extended matrix) | Pending |
| PF4-05 | No arbitrary values, no interpolated class strings and no inline appearance: the image has no `style` attribute for any value, and the compiled CSS contains the nine static utilities | DOM assertion for absent `style`; static CVA scan of the emitted CSS | `FocalPoints` | Pending |
| PF4-06 | Unknown runtime `ratio`/`focalPoint` values still normalise to `landscape`/`center` and never reach the DOM | Existing fallback test extended with the new values | — | Pending |
| PF4-07 | Native routing, caption presence/gap rules, decorative `alt=""`, framed recipe and marker/merge invariants are unchanged | Existing test suite retained in full; explicit pre-existing-behaviour cases for the two changed props | `WithCaption`, `Framed`, `ConsumerLayout` | Pending |
| PF4-08 | `auto` composes with `variant="framed"` and with every focal point without new classes beyond the documented union | Combination test matrix plus `cn()` merge assertions | `AutoHeight`, `Framed` | Pending |
| PF4-09 | Public metadata is accurate: widened unions documented with `@control select`, unchanged exports, unchanged story title, no manual `argTypes` | AST/docgen and registered-controls checks; `index.ts` export assertion | Docs page | Pending |
| PF4-10 | No stylesheet, no extra internal module, no token or dependency change, six meaningful files preserved | File-set check plus review of the changed-file list | — | Pending |
| PF4-11 | The web reference is recoverable: VIS-03 to VIS-06 hashes, source hashes and conditions match `capture.json` | Recompute SHA-256 for each PNG and source file and compare | VIS-03 to VIS-06 | **Observed for this draft** (hashes verified before handoff) |
| PF4-12 | Registry follow-up is explicit: the two usage `type` strings need updating outside this task, with no convention/approval change | Review note plus `pnpm props:check` once the registry edit is authorized | — | Pending |

### Spec closure

- [x] All seven blocks are complete; the two open promises (numeric ratio, exact percentages) are isolated in Q2/Q3 and are not silently promised here.
- [x] New/changed own props carry registry lookup evidence and exact applied entry IDs; no new convention or exception is invented, and the required usage-type follow-up is recorded.
- [x] Proposals, verified implementation, planned checks and observed results are kept distinct; every promise has an acceptance ID.
- [x] Visual IDs identify real images with provenance, conditions and related criteria; the `ratio="auto"` proof is honestly marked as source-only, and visual conformity is Not evaluated.
- [ ] Snapshot identity is recoverable, but human approval of this exact version, digest and visual hashes is **still pending** — hence status Draft.
- [x] One canonical component issue is retained (#95); this version is meant as an authorized comment, never a body edit or a new issue.

**Next step:** the owner answers Q1 to Q6 and, if the recommendation stands, approves this version; only afterwards may an implementation plan be proposed, and only its separate approval authorizes code.

## Owner questions and recommendations

**Q1 — Approve `ratio: 'square' | 'portrait' | 'landscape' | 'auto'` with the default unchanged at `landscape`?**
Evidence: the web documents `auto` as its default and the about portrait relies on container height (`pulso-source.html:168`), while the design system default must not change silently. **Recommendation: approve.** `auto` = reserve nothing and fill the host-supplied height; the default stays `landscape` so every existing consumer renders identically, and the web passes `ratio="auto"` explicitly.

**Q2 — Should `ratio` also accept a numeric proportion (width ÷ height) in this same version?**
Evidence: the community portrait uses `aspect-ratio:716/890`, the photograph's own proportion (`pulso-source.html:392`, image `716×890`), which `auto` alone cannot express — the web's `auto` there is a bespoke proportion, not container height. Precedent exists in the approved tree: `AspectRatio` and `PreviewFrame` both take a numeric ratio, and the `aspect-ratio` registry convention explicitly allows "a numeric width divided by height". **Recommendation: yes, add `number` to `PhotoFrameRatio`-compatible input in the same version** (`ratio?: PhotoFrameRatio | number`, delegating non-positive/non-finite normalisation to the existing `AspectRatio` behaviour), because without it the community scene still cannot be built. If the owner prefers the narrowest change, the alternative is `auto`-only plus a recorded limitation.

**Q3 — How should image position cover the web's exact crops?**
Evidence: the web uses `42% 50%`, `50% 40%`, `32% 50%` and a `40% 46%` narrow override; none is expressible with keywords. The `image-focal-point` convention asks for a *finite set of static* choices and to avoid *arbitrary inline CSS coordinates*. **Recommendation: approve the nine-value keyword set in this version (VIS-03 shows what stays approximate) and defer the exact-percentage mechanism to its own amendment.** If exact crops are required for fidelity, the second option is a PreviewFrame-shaped bounded exception (two validated, clamped percentage custom properties read by one static `object-[var(--…)_var(--…)]` utility) — but that needs a new explicit geometry exception plus a registry exception, and it still cannot express the web's breakpoint-dependent `--pos`.

**Q4 — Accept that ratio and crop are static per instance, one value for all viewports?**
Evidence: every Pulso figure changes proportion and/or `--pos` below 760 px (`:509`, `:520`, `:523`), and this contract forbids appearance overrides through `className`. **Recommendation: accept static values for v0.4** and keep the responsive behaviour in the web until a separate amendment proposes a documented mechanism. Widening `className` to responsive appearance is *not* recommended: it would put intended appearance in consumer code and break the merge policy.

**Q5 — Keep the approved framed recipe, or align it with the web's `--framed`?**
Evidence: the web frame is `6px solid #000`, `18px` radius, `rotate(2deg)` with a hover straighten to `rotate(0) scale(1.01)` (VIS-04, VIS-05, `bundle.css:402-404`). v0.2 approved a Surface inset with a static `calc(var(--tilt-max)/3)` tilt and explicitly no hover motion. **Recommendation: keep v0.2.** The current recipe is the Material-consistent one, and adopting the web version would reopen an approved promise plus add hover motion and a handwritten black border. The web keeps its treatment locally.

**Q6 — Keep the overlay caption, vignette and image filter out of the design system?**
Evidence: the web caption sits inside the frame with a neon diamond, over a radial vignette plus bottom gradient and a `saturate(.92) contrast(1.06)` filter (VIS-03, `bundle.css:394-397`); v0.2 excluded all of it and keeps the caption below the media. **Recommendation: keep the exclusion** and re-open it only through a dedicated caption/appearance amendment if a future web view truly needs the overlay.
