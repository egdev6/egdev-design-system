# PhotoFrame v0.4 — implementation plan for `auto`, a numeric proportion and nine focal points

- **Status:** Draft preparation only. The v0.4 contract is owner-approved; this plan is **not** permission to write code and needs its own approval (gate G1).
- **Contract authority:** [spec.md](spec.md), version `0.4`. Payload `contentSHA256: 2db38f20c3f72d0f1abe6415e67c37678787387d5608e923d771a68fb488fc14` — recomputed in this working tree from the `## 1. Purpose and scope`-to-EOF payload (UTF-8, LF, final newline) and byte-identical to the value in its own header. Whole-file `sha256:8cdee6b17ed43c747a3e71acd4f4c5d04bbdf863a54cb704508cad8add83c78b`, which is the copy hash referenced from [issue-comment.md](issue-comment.md). Visual hashes VIS-03 `sha256:a1d1a240…`, VIS-04 `sha256:86cf6175…`, VIS-05 `sha256:b8f75b16…`, VIS-06 `sha256:9101df38…`, provenance and conditions in [capture.json](capture.json).
- **Owner approval:** canonical issue [#95](https://github.com/egdev6/egdev-design-system/issues/95), published snapshot [comment 6573745782](https://github.com/egdev6/egdev-design-system/issues/95#issuecomment-6573745782), approval [comment 6576759318](https://github.com/egdev6/egdev-design-system/issues/95#issuecomment-6576759318), recorded in `odd/tasks/web-catalog.md` L8 as verbatim `"Aprobar con sus recomendaciones (Recomendado)"`. Every recommendation is therefore adopted: **Q1** `ratio` gains `auto` with the default unchanged at `landscape`; **Q2** `ratio` also accepts a numeric width ÷ height in this same version, delegating normalisation to the existing `AspectRatio` behaviour; **Q3** the nine-value keyword `focalPoint` set ships now and exact-percentage crops are deferred to their own amendment; **Q4** ratio and crop are static per instance; **Q5** the approved v0.2 framed recipe is kept; **Q6** overlay caption, vignette and image filter stay out.
- **Adopted reading of the type surface:** spec §3's "Delta type surface" block only widened the two aliases because it was written before Q2 was answered. The binding public surface after the adopted Q2 is `ratio?: PhotoFrameRatio | number`, with `PhotoFrameRatio = 'square' | 'portrait' | 'landscape' | 'auto'` unchanged as the alias. The metadata consequence of that reading is Q1 in §13, not an API question.
- **Plan identity:** `contentSHA256: cf13eb7a0616a6ba56e73a27912b87a197a1ed8c4f9f8338234742b7612040c0` — SHA-256 of the UTF-8, LF, final-newline payload from `## 1. Gates and boundaries` through EOF, excluding this metadata block.
- **Baseline:** `f159b9cc63ec0f16797239683b272e4e11ad0de3` (branch `docs/web-catalog-layer-b`). Reviewed working-tree bytes equal to the hashes recorded in the approved spec, so no source drift has occurred since approval: `types.ts` `d88523162dc2…`, `usePhotoFrame.ts` `32ff7649af93…`, `PhotoFrame.tsx` `e1cf0c397a40…`, `index.ts` `b62ce917a598…`, `PhotoFrame.test.tsx` `024c023bd8b2…`, `PhotoFrame.stories.tsx` `5e251ae3a64d…`, `primitives/aspect-ratio/types.ts` `771b93daa9a3…`, `primitives/aspect-ratio/useAspectRatio.ts` `6f5463abf51b…`, `organisms/preview-frame/usePreviewFrame.ts` `9d30f31e5ec5…`.
- **Observed evidence in this preparation:** source, consumer, metadata-test, package-harness, compiled-CSS, registry and generator inspection only. Two real checks were run and are used below: (a) the installed `react-docgen-typescript` extracts a mixed `number | 'square' | …` union as `type.name: "number | \"square\" | …"`, **not** an enum; (b) `tailwind-merge` 3.7.0 places all nine `object-*` values in one `object-position` group. No vitest run, build, Storybook session, browser measurement or screenshot was executed; every check in §6, §7, §10 and §11 is *planned*.

## 1. Gates and boundaries

1. **G1 — Plan approval.** The owner approves this exact plan payload and grants the implementation edit surface in §2. Contract approval grants no code on its own.
2. **G2 — No token, dependency, Material, stylesheet or legacy change.** `@radix-ui/react-aspect-ratio` 1.2.0 is already installed and already used by this atom. No `photo-frame.css` is created (spec §6: **No stylesheet**), `packages/tokens/**` is untouched, `packages/ui/src/styles/legacy/bundle.css` keeps `.eg-photo*` as-is, and no new Material recipe is proposed: `auto` adds only layout geometry (`h-full`) next to utilities the recipes already use.
3. **G3 — Static, scannable utilities only.** Every new class lives as a literal string in `types.ts` CVA maps. No interpolated class string (`object-[${x}%]`, `pb-[${n}%]`), no inline appearance, no arbitrary values. This is the whole reason `focalPoint` is a nine-value keyword set instead of percentages, and why a numeric `ratio` reuses `AspectRatio`'s existing Radix mechanism rather than a new inline style.
4. **G4 — Compiled-CSS reality, not class strings.** `packages/ui/src/styles/compiled.css` compiles with `@tailwind utilities source(none)` and an explicit `@source "../atoms/photo-frame/types.ts"` list, so a utility that only appears in a story or a test emits nothing in `dist/styles.css`. The nine object-position utilities and `h-full` must come from `types.ts`, and `scripts/package-exports.test.mjs` must prove they were emitted.
5. **G5 — Story-only host utilities.** `.storybook/preview.css` already declares `@source "../packages/ui/src/atoms/photo-frame/PhotoFrame.stories.tsx"`, so the new `AutoHeight` host utilities (`grid`, `h-96`, `place-items-stretch`, …) are scanned without a new line. No new `@source` may be invented, and no Storybook theme key is introduced, so no variant can silently emit nothing.
6. **G6 — Parent-owned integration.** Registry JSON, generated `docs/prop-naming.md`, catalog artifacts and the shared package harnesses are parent-owned surfaces; the writer proposes reviewed hashes and cases, the parent decides when to regenerate and commit. No git write, no GitHub comment, no publishing belongs to this task.
7. **G7 — Baseline discipline.** Before runtime work, re-inspect the working tree. `odd/tasks/web-catalog.md` is currently modified by the parent and must be preserved untouched. If any hash in the metadata block above has drifted, reconcile the plan instead of silently targeting different bytes.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Responsibility |
| --- | --- | --- |
| `packages/ui/src/atoms/photo-frame/types.ts` | Writer | Widen `PhotoFrameRatio` (`auto`) and `PhotoFrameFocalPoint` (nine values); `ratio?: PhotoFrameRatio | number`; four new static `object-*` values in `photoFrameImageVariants`; one new `ratio: { preset: '', auto: 'h-full' }` axis on `photoFrameMediaVariants`; English JSDoc with exactly one `@control` per own declaration |
| `packages/ui/src/atoms/photo-frame/usePhotoFrame.ts` | Writer | Private `representable` predicate mirroring `AspectRatio`; numeric-vs-preset-vs-`auto` resolution; effective `data-ratio` marker; unchanged enum normalisation, native routing, caption presence and per-part `cn` |
| `packages/ui/src/atoms/photo-frame/PhotoFrame.tsx` | Writer | JSX only: `AspectRatio` around the viewport when a reservation exists, the bare viewport when `ratio === undefined` |
| `packages/ui/src/atoms/photo-frame/PhotoFrame.test.tsx` | Writer | RED-first cases for PF4-01…PF4-10 and the retained v0.2 suite as PRESERVE evidence |
| `packages/ui/src/atoms/photo-frame/PhotoFrame.stories.tsx` | Writer | Keep every existing story; add `AutoHeight`; extend `FocalPoints` to the nine-value matrix |
| `packages/ui/src/atoms/photo-frame/index.ts` | Parent verification | Must stay byte-identical: `PhotoFrame` plus the four existing public types, no new export |
| `packages/ui/src/index.ts` | No change | `export * from './atoms/photo-frame'` already carries the widened aliases |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent (integration) | `expected.photoframe.ratio` → `false`; `ownPropCounts.photoframe` stays `6`; zero owned diagnostics |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent (integration) | PhotoFrame extraction row for the mixed ratio union and the nine-value enum, if the parent adds a PhotoFrame metadata block; the shared component list is unchanged |
| `skills/_shared/prop-naming.json` | Parent (integration) | Refresh the `revision` of the **four** PhotoFrame usages (`aspect-ratio`, `image-focal-point`, `visual-treatment`, `image-caption` — all four point at `types.ts`) and rewrite the two `type` strings that changed |
| `docs/prop-naming.md` | Parent-generated | `pnpm props:docs`; never hand-edited |
| `scripts/package-exports.test.mjs` | Parent (integration) | Extend the PhotoFrame CSS-utility assertion with the four corner `object-*` selectors and `h-full` |
| `scripts/package-consumption.test.mjs` | Parent (integration) | Add `'auto'`, a numeric ratio and a corner focal point to the consumer fixture, one unknown-string type negative, and the runtime stage assertions |

Explicitly **not** touched: any `photo-frame.css` (must not exist), any new internal module, `packages/ui/src/primitives/aspect-ratio/**` (the predicate is mirrored privately, exactly as `PreviewFrame` does; no new export from the primitive), `packages/ui/src/styles/compiled.css` and `.storybook/preview.css` (both already register the atom: `compiled.css:24` for `photo-frame/types.ts` and `preview.css:29` for `PhotoFrame.stories.tsx`), `packages/ui/src/styles/legacy/bundle.css`, `packages/tokens/**`, `packages/ui/package.json`, `scripts/catalog_data.py` and the generated catalog (the atom's row already exists and no availability changes), and every peer component folder.

## 3. What `auto` renders, exactly

`ratio="auto"` removes geometry instead of generating it. The rendered tree becomes:

```
figure.eg-photo[data-ratio="auto"][data-variant][data-focal-point]
└─ div  (media frame: surfaceVariants(tone/elevation/padding:none/radius:xl) + photoFrameMediaVariants({ variant, ratio: 'auto' }) → 'h-full')
   └─ div  (viewport: photoFrameViewportVariants({ variant }) → 'size-full overflow-hidden rounded-xl|rounded-lg')
      └─ img.eg-photo__img  (object-cover + exactly one static object-position utility)
```

- No `AspectRatio` element is mounted, so no `[data-radix-aspect-ratio-wrapper]`, no `position: relative` spacer and no `padding-bottom` percentage exists in the DOM. No `ResizeObserver`, no measurement, no container query, no conditional CSS engine and no recreated percentage spacer.
- The media frame gets `h-full` because the *figure* is the element that receives a definite height from the host (stretched grid cell / fixed-height wrapper), and `size-full` on the frame would otherwise let the viewport collapse. The viewport keeps its existing `size-full`; the image keeps `object-cover` plus the resolved position.
- The host pattern is a container with a definite height in which the figure is a stretched flex/grid item — the web's own `.ph-canyon{height:100%}` pattern. `className` still merges last for outer layout only (margin, width, min/max-width, placement); this change does **not** widen `className` to height or appearance, and the component emits the `h-full` itself.
- The three presets keep their current composition byte-for-byte: `AspectRatio` with `1`, `4/5`, `4/3` → `padding-bottom: 100% / 125% / 75%`, still outside the frame inset, the caption and the tilt.

## 4. What a numeric ratio renders, exactly

`AspectRatio` remains the sanctioned path for numbers, so the numeric case adds **no** new styling mechanism:

- `usePhotoFrame` resolves a numeric `ratio` to the `number` it hands to `<AspectRatio ratio={…}>`. Radix then writes the percentage on its own wrapper through its existing inline `padding-bottom` — the same mechanism the presets already use today, and the only inline style anywhere in this component. `PhotoFrame` authors no inline style for any value.
- A representable `716 / 890` therefore renders `padding-bottom: 100 / (716/890) % ≈ 124.30%`, and the image still carries no `style` attribute.
- `data-ratio` for a numeric value is the effective proportion as a string (for example `data-ratio="0.8044943820224719"`), so the marker stays honest and never leaks `NaN`. See Q2 for the alternative fixed token.

Invalid numeric input follows the primitive, with no invented bounds:

- The hook mirrors `AspectRatio`'s predicate exactly — `Number.isFinite(ratio) && ratio > 0 && Number.isFinite(100 / ratio)` — as a private helper with a comment naming the primitive, following the `PreviewFrame` precedent (`usePreviewFrame.ts:18-20`). It does **not** clamp to a usable box, add a maximum, or round.
- `0`, `-1`, `NaN`, `Infinity`, `-Infinity` are not representable → the reservation becomes `1`, i.e. the square the primitive itself would render, and `data-ratio="square"`. Extremes the primitive already accepts stay accepted: `1e-300` and `Number.MAX_VALUE` pass the same predicate it tests today.
- Unknown *string* values keep the v0.2 rule and normalise to `landscape` (75%). The two fallbacks are intentionally different because they answer different questions ("no preset selected" versus "the primitive cannot represent this number"), and both must be documented in the JSDoc body rather than hidden.
- No console warning is added: `PreviewFrame` warns, `PhotoFrame`'s approved contract documents the fallback instead, and adding a warning would be unapproved behaviour.

## 5. The nine focal-point utilities

| `focalPoint` | Static utility | `object-position` emitted |
| --- | --- | --- |
| `center` (default) | `object-center` | `center` |
| `top` / `bottom` / `left` / `right` | unchanged | `top` / `bottom` / `left` / `right` |
| `left-top` | `object-left-top` | `left top` |
| `right-top` | `object-right-top` | `right top` |
| `left-bottom` | `object-left-bottom` | `left bottom` |
| `right-bottom` | `object-right-bottom` | `right bottom` |

- All nine are **Tailwind v4 core static utilities**, not theme-key-dependent variants: the installed compiler registers `object-left-top`, `object-right-top`, `object-left-bottom` and `object-right-bottom` as static rules mapping to `object-position: left top`, `right top`, `left bottom`, `right bottom`. No `--theme` key, plugin, variant or arbitrary value is involved, so none of them can emit nothing for a theme reason.
- The value names are the DSL's (`left-top`), the class names are Tailwind's (`object-left-top`): the two orders are deliberately different and the mapping must be written out, never computed with `object-${focalPoint}`.
- `tailwind-merge` 3.7.0 groups all nine under `object-position` (verified in this working tree), so a single CVA value can never be merged away and no two utilities arrive together.
- The emitted CSS is proven, not assumed: today `packages/ui/dist/styles.css` contains only `.object-bottom/.object-center/.object-left/.object-right/.object-top` and **no** `.object-left-top` family, so the package assertion added in §9 is a real new signal.
- Physical keywords, not logical ones, exactly like the web's `--pos` percentages: the crop does not mirror under `dir="rtl"`. That stays a documented property of a static object-position preset, not a defect.
- Legacy `.eg-photo__img{object-position: var(--pos,50% 50%)}` remains in `bundle.css` under `@layer components`, so `@layer utilities` keeps winning exactly as it does today; the PRESERVE case pins it.

## 6. Test-first sequence

RED first, one behavior-level case per promise, asserted through the public interface (roles, attributes, rendered markers), never internal storage and never a whole class-string snapshot. GREEN then implements the minimum: `types.ts` → `usePhotoFrame.ts` → `PhotoFrame.tsx` → remaining cases.

| Step | RED case (file → assertion) | Covers |
| --- | --- | --- |
| R1 | `PhotoFrame.test.tsx` — `ratio="auto"` has no `[data-radix-aspect-ratio-wrapper]`, `data-ratio="auto"`, media frame carries `h-full`, viewport still `size-full`, image still `object-cover` + `object-center` | PF4-01 |
| R2 | `PhotoFrame.test.tsx` — `auto` adds no invented fallback: no `min-h-*`, no `style` attribute on the frame/viewport/image, no placeholder element; and the documented host contract is asserted structurally rather than by measuring JSDOM layout | PF4-02 (structural half) |
| R3 | `PhotoFrame.test.tsx` — numeric ratio: `716/890` gives `padding-bottom ≈ 124.30%` on the Radix wrapper, `data-ratio` is the numeric string, image has no `style`; `0`, `-1`, `NaN`, `Infinity` give `100%` and `data-ratio="square"` | Q2 behaviour, PF4-05 |
| R4 | `PhotoFrame.test.tsx` — `it.each` over the nine values asserts exactly the mapped utility, and an explicit comparison proves the five v0.2 values are unchanged | PF4-04 |
| R5 | `PhotoFrame.test.tsx` — no inline appearance: the image has no `style` attribute for any of the nine values nor for `auto`/numeric | PF4-05 (DOM half) |
| R6 | `PhotoFrame.test.tsx` — unknown strings (`ratio: 'wide'`, `focalPoint: 'middle'`) still normalise to `landscape`/`center`, the unknown value never reaches the DOM, and the existing v0.2 fallback case is extended, not replaced | PF4-06 |
| R7 | `PhotoFrame.test.tsx` — combination matrix: `auto` × `framed` and `auto` × nine focal points adds `h-full` and the framed recipe only, with no class outside the documented union; `cn()` merge invariants hold | PF4-08 |
| R8 | `scripts/package-exports.test.mjs` — emitted CSS contains `.object-left-top/.object-right-top/.object-left-bottom/.object-right-bottom` and `.h-full` in `@layer utilities`; declaration types still `PhotoFrameProps/Ratio/Variant/FocalPoint` and no internal export leaks | PF4-05 (CSS half), PF4-09 |
| R9 | `storybook-controls.test.ts` + `storybook-docgen.test.ts` — real extraction of the mixed ratio union and the nine-value enum, `expected.photoframe.ratio === false` with a concrete reason, `focalPoint` still `select`, zero owned diagnostics, no manual `argTypes` | PF4-09 |
| R10 | `scripts/package-consumption.test.mjs` — packed React 18/19 consumer compiles `ratio="auto"`, `ratio={716/890}` and `focalPoint="left-top"`, rejects an unknown string, and the runtime stage sees `data-ratio` plus the corner class | PF4-09 |

PF4-11 (visual hashes and source hashes match `capture.json`) was already observed for the draft and needs no runtime case: this delta republishes no capture, so the plan re-verifies the hashes only if the owner commissions new captures (Q5). PF4-12 (registry follow-up) is the §8 row, not a test case.

PRESERVE (expected to pass, no RED run — these pin behaviour the diff touches):

- PF4-03: the existing `it.each` mapping `square/portrait/landscape → 100%/125%/75%`, unchanged.
- PF4-07: the full existing suite — native routing and events, caption presence/blank gap, decorative `alt=""`, framed recipe with `p-1.5` and the static token tilt, `motion-reduce`, marker and root/inner merge invariants — retained verbatim, plus one explicit case per changed prop (`ratio`, `focalPoint`) proving its previous output.
- The story-name assertion in `PhotoFrame.test.tsx` grows by `AutoHeight` and keeps every current name.
- **Differential check (required, because the diff changes shared code):** `photoFrameImageVariants` and `photoFrameMediaVariants` are shared by every PhotoFrame path, and `AspectRatio`/`surfaceVariants` are consumed by others. One script copies baseline `f159b9cc…` into a `mktemp -d`, renders SSR markup for the three presets, `default` and `framed` (no props added) from both copies, and compares stdout, stderr and exit code; any unrequested difference is a regression to fix and pin. The scratch copy is deleted at the end and never committed.
- REFACTOR runs only while R1–R10 and the PRESERVE set stay green; no drive-by cleanup of the recipes, the legacy CSS or the stories.

## 7. Stories and Controls

`Atoms/PhotoFrame`, `autodocs`, unchanged meta, real `Meta<typeof PhotoFrame>`/`StoryObj`, no manual `argTypes`, no `play`, no new fixture.

| Story | Action |
| --- | --- |
| `AutoHeight` (new) | One `ratio="auto"` figure inside a definite-height host grid cell (`grid h-96 …`), so the supported pattern is demonstrated; the story JSDoc states that the host owns the height and that a host without one collapses the media, with no fallback. No caption in this story (see R-2) |
| `FocalPoints` (extended) | Keeps the three ratios, grows the focal-point axis from five to nine; the diagnostic grid's labelled quadrants and edges make each keyword visually distinguishable |
| `Ratios` (unchanged) | Still the three reserved presets; `auto` shows no proportion, so it does not belong here |
| All others | Byte-identical: `Default`, `WithCaption`, `Decorative`, `Framed`, `Portrait`, `Square`, `ResponsiveImage`, `EagerImage`, `WithoutCaption`, `LongCaption`, `HostContexts`, `ReducedMotion`, `LegacyCoexistence`, `Passive`, `Narrow`, `RTL`, `ConsumerLayout` |

Metadata to write in `types.ts` (exact, one `@control` per own declaration):

- `ratio`: `@default landscape` + `@control false` + `@controlReason` naming the mixed preset/numeric union and pointing at `Ratios` and `AutoHeight`. `select` is **not** achievable here; see Q1 and R-1.
- `focalPoint`: `@default center` + `@control select` with the nine extracted enum values, plus body text stating that corners combine a horizontal and a vertical keyword and that values are static and physical.
- `variant` (`@default default`, `select`), `src`/`alt` (`text`), `imageCaption` (`text`): unchanged.

## 8. Registry integration

| Entry | Action |
| --- | --- |
| `aspect-ratio` (`ratio`) | Usage `type` string becomes `PhotoFrameRatio ('square' \| 'portrait' \| 'landscape' \| 'auto') \| number (numeric width divided by height; unrepresentable numbers fall back to a square)`; `revision` refreshed to the reviewed whole-file hash of the new `types.ts` |
| `image-focal-point` (`focalPoint`) | Usage `type` string lists all nine values in the declared order (`center, top, bottom, left, right, left-top, right-top, left-bottom, right-bottom`); `revision` refreshed |
| `visual-treatment` (`variant`), `image-caption` (`imageCaption`) | Types unchanged, but both usages point at `types.ts`, so both `revision` values **must** be refreshed after renewed source review — an unrelated edit in an evidence file does not excuse a stale hash |
| Convention entries, statuses, `approval`, exception records | Untouched. No new convention, no aliases, no exception; the exact-percentage mechanism stays deferred per Q3 |

No PhotoFrame exception is proposed: the nine keywords sit inside the existing approved convention's "finite set of static object-position choices", and the numeric ratio inside "a numeric width divided by height or a documented set of format presets". After the authorized edit: `pnpm props:docs`, then `pnpm props:check` and `pnpm test:props`. `--write` never refreshes evidence or approval.

## 9. Package export and consumption cases

- `scripts/package-exports.test.mjs` (`UI ships PhotoFrame declarations and native utility resets`): keep the runtime/declaration assertions and extend the emitted-utility list with `.object-left-top`, `.object-right-top`, `.object-left-bottom`, `.object-right-bottom` and `.h-full`. This is the only non-browser proof that the new classes were compiled into `dist/styles.css` from `types.ts` rather than merely written in a string.
- `scripts/package-consumption.test.mjs`: keep the current positive fixture and negatives (`missing`, `children`, `ref`); add `PhotoFrameRatio = 'auto'`, a numeric `ratio: 716 / 890` and `focalPoint: 'left-top'` to the consumer props; add one `@ts-expect-error` for an unknown ratio string (the union is exhaustive); extend the runtime stage to assert `data-ratio="auto"`/numeric, the absence of `[data-radix-aspect-ratio-wrapper]` for `auto`, and the `object-left-top` class. No behavioural assertion is duplicated from vitest.
- JSDOM in that harness does not apply `dist/styles.css` and has no layout, so it can assert classes and DOM shape only; compiled CSS lives in the exports test and computed styles live in §10.
- Public export list is unchanged, so the exact sorted type/name lists and the negative lists in both harnesses need no edits.

## 10. Browser checks before merge

Run against `pnpm storybook` with the real compiled tokens and a real pointer, after GREEN, and record observations (not expected-design proof):

1. **`auto` height:** in `AutoHeight`, `getComputedStyle` of the media frame and viewport report the host's height (e.g. `320px`), the image covers it, and there is no `[data-radix-aspect-ratio-wrapper]` in the DOM.
2. **`auto` collapse case:** the same component in a host without a definite height measures `0px` and adds nothing — no `min-height`, no placeholder, no warning. This is the documented host responsibility, not a guarded failure.
3. **Computed `object-position`** for all nine `FocalPoints` cells equals the keyword pairs of §5 (`left top`, `right top`, `left bottom`, `right bottom`, and the five unchanged ones) — the assertion that the utilities really reached the cascade beside legacy `.eg-photo__img`.
4. **Preset regressions:** `Ratios` still computes `padding-bottom` 100%/125%/75%; `framed` keeps `p-1.5`, the token tilt and its reduced-motion reset; the caption still sits outside the transform and the reservation.
5. **Numeric ratio:** a `ratio={716/890}` case renders ≈124.3% reservation with the image cropped, and the image element has no `style` attribute in DevTools.
6. **Controls:** `focalPoint` renders a nine-option select, `variant` a two-option select, `ratio` shows the documented false-control row with its reason (no widget), `src`/`alt`/`imageCaption` text fields, and no `Component.prop` diagnostic appears in any PhotoFrame story.
7. **RTL and zoom:** the crop does not mirror under `dir="rtl"` (physical keywords, documented), captions still wrap, and 200%/400% zoom reflows without clipping at either `auto` or a preset.
8. **Legacy coexistence:** with `bundle.css` active, utilities still win for `object-position` and no double frame/inset appears.

## 11. Full gates before merge

Focused first, then the full set, each reported with observed output and every command read from the current `package.json`:

- `pnpm exec vitest run packages/ui/src/atoms/photo-frame`
- `pnpm exec vitest run packages/ui/src/primitives/aspect-ratio packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts`
- `pnpm typecheck`, `pnpm lint`, `pnpm test`
- `pnpm build` (required before both package harnesses and before the CSS scan)
- `pnpm test:package-exports`, `pnpm test:package-consumption`
- `pnpm props:docs`, `pnpm props:check`, `pnpm test:props` (only after the authorized registry edit)
- `pnpm storybook-build` plus the §10 browser pass

## 12. Risks

- **R-1 — Mixed-union Controls metadata (highest).** PF4-09 says "widened unions documented with `@control select`", but after the adopted Q2 the extracted type is `number | "square" | …` (verified with the installed parser in this working tree), which the registered enhancer rejects: `@control select requires a finite extracted primitive enum`, producing a `PhotoFrame.ratio` diagnostic and failing the zero-diagnostics assertion. There is no comment-only fix; the honest choices are `@control false` with a concrete reason and the `Ratios`/`AutoHeight` stories (recommended, Q1) or dropping numeric ratios (contradicts Q2).
- **R-2 — `auto` plus a caption inside a definite-height figure.** `h-full` is 100% of the figure, so a caption plus its `gap-3`/`gap-10` exceeds the figure's height and the caption can be pushed past the host's box. The approved contract authorises exactly `h-full` and no fallback, so this stays a documented host responsibility: `AutoHeight` demonstrates the caption-free pattern and the JSDoc states the limit. Owner decision in Q3; the implementation does not add `min-h-0`, `flex-1` or a guard.
- **R-3 — Visual conformity is Not evaluated.** No approved reference illustrates `auto` (the spec says so itself) and the nine keywords only approximate the web's `42% 50%`, `50% 40%`, `32% 50%`; VIS-03…VIS-06 remain Proposed. Nobody may "fix" the crop to match a capture, and the plan claims no pixel fidelity.
- **R-4 — Stale status wording in the approved payload.** `spec.md` still reads "Draft amendment", `approvalReference: Pending` and an unchecked approval closure item, although the digest matches the approved snapshot and the approval comment exists. Reviewer confusion is the risk, not behaviour; see Q4.
- **R-5 — Predicate duplication.** Mirroring `AspectRatio`'s predicate in `usePhotoFrame` (the `PreviewFrame` precedent) means a future change to the primitive could drift. Mitigation is the explicit comment plus a test pinning the fallback at 100%; exporting the predicate from the primitive is *not* proposed, since that would widen a peer's public surface for one consumer.
- **R-6 — Registry hash fan-out.** Four entries share the `types.ts` revision; refreshing only the two whose `type` changed leaves two stale hashes and `pnpm props:check` fails. Review must confirm all four.
- **R-7 — Marker widening.** `data-ratio` now also carries a numeric string. Any consumer that parses `data-ratio` as a preset name (none found in this repository) sees a new value; the attribute remains a presentation/debug marker, not a styling contract.
- **R-8 — Tailwind v4 default key collision.** `ratio` is deliberately *not* a utility class name; the class side stays `object-*`/`h-full`, so no `aspect-auto` or theme key is involved and no variant can silently emit nothing.

## 13. Owner questions

**Q1 — Approve `@control false` for `ratio` instead of the planned `select`.** Evidence: the installed extractor returns `number | "square" | "portrait" | "landscape" | "auto"` for the adopted Q2 type, and the registered enhancer rejects `select` for anything that is not a finite enum, which would fail PF4-09's own zero-diagnostic requirement. *Recommendation:* `@control false` with a reason naming the mixed union and pointing at `Ratios` and `AutoHeight`, while `focalPoint` and `variant` keep `select`. Option: drop numeric ratios to keep `select` — simpler metadata, but the community figure stays unbuildable and Q2 is reversed.

**Q2 — What should `data-ratio` carry for a numeric proportion?** *Recommendation:* the effective proportion as a string (for example `data-ratio="0.8044943820224719"`), with `square` for an unrepresentable number, so the debug marker never lies and never leaks `NaN`. Option: a fixed token such as `data-ratio="custom"`, which hides the value but keeps the attribute inside the four-preset vocabulary.

**Q3 — Accept the `auto` + caption overflow as a documented host responsibility?** Evidence: `h-full` on the media frame plus a caption taller than the remaining space overflows a definite-height figure, and the approved contract authorises exactly `h-full` with no fallback. *Recommendation:* document it (story JSDoc + `types.ts` caption description) and demonstrate the caption-free pattern in `AutoHeight`. Option: add `min-h-0`/`flex-1` behaviour, which needs a contract amendment because it invents geometry the approved delta does not contain.

**Q4 — Reconcile the stale status wording of the approved `spec.md`.** The payload digest matches the approved snapshot byte-for-byte, but its header still says Draft/Pending and its closure list still shows approval as unchecked. *Recommendation:* authorise a documentation-only reconciliation in the same transaction (status → Approved, `approvalReference` → the approval comment, closure item ticked, Q1–Q6 marked answered with the adopted answers) while leaving the approved payload's content untouched; that edit necessarily changes the payload digest, so it must be recorded as a new documented revision rather than silently re-hashed. Option: leave it frozen and rely on the issue comment, at the cost of the next reader seeing a blocking draft.

**Q5 — Accept "visual conformity: Not evaluated" for this delta?** Evidence: no capture illustrates `auto`, and the keyword crops only approximate the web's percentages. *Recommendation:* accept Not evaluated, judge the implementation against the written recipe and §10's computed-style checks, and keep VIS-03…VIS-06 as source evidence. Option: commission design-system captures for `auto` and the nine crops first, which adds a capture round before code.

**Q6 — Review slicing.** *Recommendation:* one delivery — the five writer-owned files (six mandatory files minus the byte-identical `index.ts`) plus the parent-owned metadata/registry/harness integration, an estimated 200–320 changed lines including tests and stories. Option: split types/hook/component/tests from stories/metadata/registry, which separates the recipe from its metadata evidence for little review gain. This is a delivery-shape preference, not a blocker.

## 14. Stop

This plan authorises nothing. It records the exact files, the `auto` and numeric render paths, the nine static utilities, the fallback rules, the test-first map, the gates, the risks and the owner questions, and it stops for G1 plus Q1–Q6. No source, test, token, dependency, registry, catalog, capture, git or GitHub action is taken or implied, and no behaviour in this document is claimed as observed.
