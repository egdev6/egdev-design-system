# StepMeter v0.1 and NowCard v0.3 — implementation evidence

- **Status:** Observed evidence for the implementation of [#556](https://github.com/egdev6/egdev-design-system/issues/556) (ODD S1, task T9), recorded by the implementation writer on 2026-11-26. **Complete: no stop line of the plan was reached.** It approves nothing: review, commits and any GitHub action stay with the parent and the owner. Nothing was committed and nothing was written to GitHub.
- **Contract:** [StepMeter v0.1](spec.md) `contentSHA256` `1da0f307a65e2ade2f750ab6dd6cd1d6702096c08227fa591eecfa63df0de368` and [NowCard v0.3](../../now-card/v0.3/spec.md) `2ed402f029d3494334f600d8c037615664b63c6b48df00f9c662d66feba19253`, each recomputed with its own rule (`awk '/^## 1\. Purpose and scope$/{f=1} f' spec.md | sha256sum`) before the first edit and after the last one: equal both times, and neither spec nor approval record was edited. The [plan](implementation-plan.md) was approved verbatim ("Aprobar los cuatro (Recomendado)") and the browser and packed-consumer checks authorized ("Autorizar ambos (Recomendado)"), as relayed in the T9 delegation. D2: the `step-count` convention receipt was not separately approved, so the entry ships `proposed` with `approval: null`. D5: browser probes live in scratch outside the repository and their output is copied here. D6: no release and no version bump; both changelogs append under the existing `## Unreleased`. D7: no screenshot is committed.
- **Baseline:** branch `feat/pulso-consumer-requests`, HEAD `615cee7` (#559, #558 and #557 committed; the working tree held only the parent's one-row edit of `odd/tasks/pulso-consumer-requests.md`, which this work left untouched). R0 before the first edit: NowCard and NowStrip 2 files 25/25; docgen, Controls and CSS 3 files 521/521; `props:check` valid; `test:props` 134/134; `artifact --check` and `system:check` exit 0; `test:artifact` 54/54; `test:system` 36/36.
- **Environment:** Node v24.22.2, pnpm 10.34.6, Vitest 4.1.11, Storybook 10.6.1, playwright-core 1.63.0 (read from another project's `node_modules`, nothing installed) driving Chromium 153.0.8010.12 (headless shell), Linux, dark theme, React 19.3.0 in the workspace and 18.3.1 plus 19.3.0 in the packed consumers.
- **Final digests (12 hex):** `atoms/step-meter/types.ts` `7e52350f5ff3` (the value in the three registry revisions), `useStepMeter.ts` `48adf1c997fd`, `StepMeter.tsx` `e0a53c4773f9`, `index.ts` `3340d918b069`, `StepMeter.test.tsx` `7c2ec24a8aeb`, `StepMeter.stories.tsx` `7ed1eb718482`; `molecules/now-card/types.ts` `dce9fa50d7da` (the value in the four refreshed NowCard revisions), `NowCard.test.tsx` `c20617d09b74`, `NowCard.stories.tsx` `765ae7beaa2b`; `useNowCard.ts` `cf91bc3a2f04`, `NowCard.tsx` `efb5f9718829` and `index.ts` `fb9835e4c7ba` are byte-identical to HEAD (the first two match the plan's recorded baseline prefixes). No token, dependency, stylesheet, lockfile or version change. Artifact 610,264 bytes (budget 786,432), `system.md` 500,426 bytes, registry 185 entries, catalog 119 rows. The five generated files have identical digests on a second run of their writers.

## 1. Measured results (Chromium 153, shipped `dist/styles.css` and tokens, SSR markup from the built package, no Tailwind compiler)

The browser pages were built in scratch from `packages/ui/dist` after `pnpm build`; their `styles.css` and `tokens.css` have the same SHA-256 as the final `dist` files. Fonts were force-loaded (Barlow, Barlow Condensed) before the footer measurements; a first run with the fonts not yet loaded gave the same deltas.

- **Geometry (SM-07).** Declared values (`computedStyleMap`) are exactly the approved arithmetic: step width `11.2px`, height `12px`, gap `3.2px`, `clip-path` `polygon(0px 0px, 100% 47.6%, 100% 100%, 0px 52.4%)`. **Used layout values are snapped to Chromium's 1/64 px units:** step `11.1875 × 12`, root `54.3125` for four steps (arithmetic 54.4) and `140.5625` for ten (arithmetic 140.8), also 11.1875 (1), 25.5625 (2) and 83.0625 (6). A plain `calc(var(--space-1) * 3.5)` box and a 19.2 px box snap the same way, so this is engine quantization of every fractional token length, not an emission or cascade disagreement; see finding F1. The root computes `display: inline-flex` in a block or inline host and `flex` as a flex item (blockified, as in the footer); steps compute `block`.
- **Slant and thickness.** Hit-testing the clip-path (binary search per x) gives slope 0.5114, **27.09°**, thickness 6.281 to 6.297 px (mean 6.288); a device-scale-10 raster gives 27.07° and 6.2 to 6.3 px. The spec says about 27.0° and 6.3 px.
- **Paint and motion.** Filled `rgb(255, 0, 54)`, empty `rgba(255, 0, 54, 0.22)`; every step has `transition-property: none` (0s), `animation-name: none`, `filter`, `box-shadow` and `transform` none, `opacity` 1, border 0, outline none, no background image and no text. With and without `prefers-reduced-motion: reduce` flipping `data-state` computes the new color at once and no animation runs.
- **Legacy isolation.** A positive control (`.eg-now-card__meter > i`) computes the legacy `skewY(27deg)` (`matrix(1, 0.509525, 0, 1, 0, 0)`); StepMeter steps compute `transform: none`, do not match `.eg-now-card__meter>i`, and no legacy class is inside any StepMeter.
- **Contrast (SM-08), on rendered pixels at device scale 2, surfaces with their sheen:**

  | Surface | Filled vs flat token | Filled vs worst surface pixel | Empty vs surface | Filled vs empty |
  | --- | --- | --- | --- | --- |
  | surface-0 | 4.61 | 4.61 | 1.18 | 3.90 |
  | surface-1 | 4.30 | 4.16 | 1.14 to 1.18 | 3.66 |
  | surface-2 | 3.92 | 3.77 | 1.11 to 1.16 | 3.38 |
  | surface-3 | 3.42 | **3.33** | 1.09 to 1.12 | 3.06 |

  The flat-token column reproduces the spec's hand-computed 4.61, 4.30, 3.92 and 3.42 exactly; the sheen above the meter lowers the worst pixel by at most 0.14. The empty remainder is the accepted decorative track (OQ-5).
- **Forced colors (SM-09), Chromium emulation.** Normal mode: filled `rgb(255, 0, 54)`, empty `rgba(255, 0, 54, 0.22)`, `forced-color-adjust: auto`. `forced-colors: active`: filled `rgb(255, 255, 255)` (equal to `CanvasText` resolved on a probe element), empty `rgba(0, 0, 0, 0)`, `forced-color-adjust: none` on every step; the painted pixels are white for a filled step and the canvas black for an empty one; the name and step sizes are unchanged. Each rule wins in its own mode, proven by computed style, and the shipped CSS lists the plain rule before the merged `@media (forced-colors: active)` block.
- **Accessibility tree (SM-01).** One `image` node named "Level 3 of 4" with four child nodes, all `ignored` with role `none`; `ariaSnapshot` is `- img "Level 3 of 4"`; no tabbable element inside; the first Tab lands on the next page link.
- **NowCard footer (NC3-03, NC3-04), 390 and 1280 px.** Band height with and without the meter: md `Link` 33.625/33.625, `IconButton` 52.1875/52.1875, `NowCardDetail` 34.75/34.75; sm 27.21875, 45.78125 and 28.34375, each pair equal (delta 0), card heights equal too. In every case the companion is leading, the meter trailing in the same row without overlap (`justify-between`, `flex-wrap`), the meter keeps `54.3125 × 12` and nothing clips. In a 100 px wide card all six wrap: the meter starts the next line at the leading edge at its intrinsic size and stays inside the card; at 160 px `Link` and `NowCardDetail` wrap and the `IconButton` still fits in one row.
- **NowStrip (NC3-08), 1280 px.** Three `sm` cards with `Link` plus meter, one with a badge and uneven bodies: card tops and bottoms, footer tops, bottoms and heights all have a spread of 0 (footer offset 193 px in each card). The reference mix (two `Link` plus meter, one `NowCardDetail` plus `IconButton`): card tops and bottoms and footer bottoms align; footer tops differ by 18.563 px because the `IconButton` band is taller than a `Link` band. The same strips without any meter give identical footer offsets, heights and card heights (every differential 0), so the difference belongs to the companions, not the meter.
- **Storybook build.** The five new stories (`Default`, `Levels`, `CustomSteps`, `OnSurfaces` and NowCard `WithStepMeter`) render with zero console errors or warnings and the same geometry as the shipped CSS. Docs props table: `style`, `className`, `dir`, `id`, `lang`, `aria-describedby`, `label*`, `value*` and `steps` with Default `4`, and no protected prop. Controls: `label*` a text area ("High progress"), `value*` a number input (3), `steps` a `Set number` button that becomes a number input (initial 0, which falls back to 4); setting 6 renders six steps with three filled. The manager's `The 'ariaLabel' prop on 'PopoverProvider' will become mandatory in Storybook 11` warning appears identically on the untouched Pixel Controls, so it is not caused by this change.

## 2. Verdicts per acceptance criterion

"Pass" means observed in this run by the command shown. Browser rows are Chromium 153 only. Nothing here is a screen-reader claim.

| ID | Verdict | Evidence (command and result) | Limit |
| --- | --- | --- | --- |
| SM-01 | **Pass** | `StepMeter.test.tsx` (role query, `SPAN.eg-step-meter`, text-free presentational steps, no focusable descendant, hook shape); browser accessibility tree and `ariaSnapshot` above. | Screen-reader output Not evaluated. |
| SM-02 | **Pass** | `it.each` value 0 to 4 on four steps, `steps` 1, 2, 6 and 10 for every value, hook order and positions, rerender without remounting; stories `Levels` and `CustomSteps` observed in the browser. | none |
| SM-03 | **Pass** | Nine floor and clamp rows (0.9 to 0, 2.9 to 2, 5.9 to 5, 99 to 6 and others), eleven invalid `steps` values (0, -1, 11, 2.5, NaN, ±Infinity, `'6'`, null, `true`, an object) falling back to four with `console.warn` never called, and the bounds 1 and 10. | none |
| SM-04 | **Pass** | Six `label` and seven `value` inputs: the exact warning (`StepMeter requires a non-empty label. Nothing was rendered.` or `StepMeter requires a finite numeric value. Nothing was rendered.`), empty container, a valid rerender renders and does not warn; both invalid emit both messages; `valid` false in the hook; silent under `NODE_ENV=production` while still rendering nothing. | none |
| SM-05 | **Pass** | `expectTypeOf` exclusions of the protected keys, every `on*`, `ref` and `asChild` (`pnpm typecheck` 0); untyped runtime injection of every protected key and handlers in the hook, the DOM and SSR, with `id`, `data-*` and `aria-describedby` kept; `userEvent.tab()` skips the meter; a React 19 `ref` is not attached; 21 packed `@ts-expect-error` negatives. | `ref` stripping goes beyond the spec's enumerated list (F3). |
| SM-06 | **Pass** | Two tests: the consumer class is last on the root, the marker survives, steps receive none. | none |
| SM-07 | **Pass** | `pnpm test:package-exports` 143/143 (built CSS holds every static utility, the three geometry and two paint declarations and both forced-colors rules, and no `eg-step-meter` selector); packed consumers' `css` subtest in React 18.3.1 and 19.3.0; the Chromium probes of section 1. A mutation proof: with the `compiled.css` `@source` line removed and rebuilt, the test fails with `Missing StepMeter utility h-3.75`; restored byte-exact (`7c587736…`), it passes. | Used widths snap to 1/64 px (F1). |
| SM-08 | **Pass** | Rendered-pixel contrast above: filled at least 3.33:1 on surface-0 to surface-3, empty remainder 1.09 to 1.18:1 documented as decorative. | WCAG 1.4.11 is not claimed for the empty remainder (OQ-5). Protan and deutan Not evaluated. |
| SM-09 | **Pass** (emulation) | Computed style in normal and `forced-colors: active` above, plus painted pixels. | Not a real Windows contrast session; no Firefox. |
| SM-10 | **Pass** | Unit: no transition, animation, filter, shadow or transform utility and an immediate update with a `matchMedia` reduced-motion stub; browser computed style with and without `prefers-reduced-motion`. | none |
| SM-11 | **Pass** | `storybook-docgen` and `storybook-controls` 525/525 with zero owned diagnostics; `pnpm props:check` valid and `pnpm test:props` 135/135; the browser Docs table and Controls widgets above. | The `step-count` entry is `proposed` without a receipt (D2). |
| SM-12 | **Pass** | `pnpm test:package-exports` 143/143 (runtime and declaration export lists, private recipes and hook absent); client markup equals `renderToStaticMarkup` in the unit suite; `pnpm test:package-consumption` 14/14: React 18.3.1 7/7 and React 19.3.0 7/7 (typed positive sample, negatives, entries, SSR, CSR and `css`), no Tailwind compiler. | none |
| NC3-01 | **Pass** | `NowCard.test.tsx` `it.each` over `Link`, `IconButton` and `NowCardDetail` at `md` and `sm`: DOM order, a named `img`, article named by its heading, tab stops. | none |
| NC3-02 | **Pass** | The same six cases. | none |
| NC3-03 | **Pass** | Chromium rows above (390 and 1280 px, `md` and `sm`, plus the 100 px wrap); class assertions for `flex-wrap` and `justify-between`. | none |
| NC3-04 | **Pass** | Band-height delta 0 for all six companion and density pairs at both viewports. | none |
| NC3-05 | **Pass** | The 19 existing NowCard cases are untouched (`git diff -U0`: one import line widened, one import added, one block appended); a scratch differential between `HEAD` and the working tree finds the printed TypeScript AST without comments and the transpiled JavaScript of `types.ts` identical, and a one-token type change is detected by the same script (positive control); `useNowCard.ts`, `NowCard.tsx`, `index.ts` and `now-strip/**` have no diff. | none |
| NC3-06 | **Pass** | Detail, action and meter render in DOM order with no `console.warn`. | none |
| NC3-07 | **Pass** | A blank `label` and a non-finite `value`: the link stays alone, no placeholder, and the only message is the atom's own. | none |
| NC3-08 | **Pass** (as interpreted in NowStrip v0.2) | Chromium strips above: card tops and footer bands aligned, identical with and without meters. | Heading alignment is excluded by that interpretation; the reference mix's footer tops differ by companion height. |
| NC3-09 | **Pass** | Docgen assertions on the footer `children` text and `controlReason`, story pin with `WithStepMeter`, the artifact assertion on the refreshed footer text with unchanged props, parts and composition; the four NowCard revisions refreshed after reading the JSDoc-only diff; `props:check` valid, `test:props` 135/135, `test:artifact` 56/56. | none |

## 3. Test-first record

Pre-commit runs Biome and typecheck, so a failing-test commit cannot exist; RED was observed locally and nothing failing was committed. "Guard" rows pass on the first run and claim no RED.

| Step | RED observed before the change | GREEN observed after |
| --- | --- | --- |
| R1 | `StepMeter.test.tsx` fails at import (`./useStepMeter` unresolved): 1 file failed, no tests, exit 1. | Minimal types, hook (name, marker, four empty steps), component and index: 2/2. |
| R2 | 13 tests, 10 failed: every `data-state` `empty` and `steps` ignored. | Value and `steps` mapped straight through: 13/13. |
| R3 | 35 tests, 15 failed: 0.9, 2.9 and 5.9 overstated and eleven invalid `steps` not falling back. | Floor, clamp and silent fallback: 35/35. |
| R4 | 51 tests, 16 failed: an unnamed `aria-label=""` image rendered and nothing warned. | Validity and the two warnings behind the development guard: 51/51. |
| R5 | Runtime: 57 tests, 5 failed. Type level: `pnpm typecheck` exit 2, TS2554 at `StepMeter.test.tsx(273,9)` and `(274,66)` (the `expectTypeOf` exclusions). | `Omit` list in `types.ts` and stripping in the hook: 57/57 and `pnpm typecheck` 0. |
| R6 to R8 | **Guards:** 63/63 on the first run. | Not applicable. |
| R9 | Focused runner: 3 failed, 522 passed (525): `id: expected undefined to be defined` in both extraction tests and the barrel module list. | Stories, `documentedNativeProps.stepMeter`, barrel, `compiled.css`, `preview.css`: 588/588 with the folder. |
| R10 | `pnpm test:package-exports` against the stale baseline `dist`: exit 1, 143 tests, 3 failed (`Missing StepMeter utility h-3.75`, package SSR, export lists). | After `pnpm build` and one harness correction (the emitted rules use `var(--space-1)`, colour fallbacks and one merged forced-colors block, so the regexes were re-shaped, not loosened): 143/143. |
| R11 | React 19.3.0 consumer with the barrel line temporarily removed (restored byte-exact, `713d1843…`): 7 tests, 0 passed, TS2305 `no exported member 'StepMeter'` plus unused `@ts-expect-error` directives. | Restored and rebuilt: `pnpm test:package-consumption` 14/14. |
| R13 | `prop-naming.test.mjs`: 135 tests, 3 failed (usage evidence, the 185 counter, the new StepMeter test). | Entry and two usages appended, view regenerated: `props:check` valid, 135/135. |
| R14 | Artifact StepMeter test fails at `assert.ok(naming)` (registry half only: the artifact already carried the component from the earlier build). | Catalog row and `artifact --write`: `test:artifact` 55/55. |
| R15 | **Guard:** NowCard 28/28 on the first run (9 new cases). | Not applicable. |
| R16 | NowCard docgen case failed: `expected 'One NowCardDetail and/or one Link/Ico…' to match /optionally one StepMeter/`. | JSDoc and `WithStepMeter`: docgen, Controls and CSS 525/525. |
| R14b | Artifact NowCard footer test failed on the stale description. | After regeneration: `test:artifact` 56/56. |
| R17 | `props:check` exit 1 (`Stale evidence revision: packages/ui/src/molecules/now-card/types.ts`); `test:props` 50 of 135 failed, by design. | Four revisions refreshed: valid and 135/135. |
| R18 | Differential, not a RED. | Identical printed AST and transpiled JavaScript; positive control detected. |
| R12, R19 | **No RED run for the browser rows:** no baseline build was kept, so the probes were written against the finished build. | Section 1. |

## 4. Browser conditions and captures

- **Run:** Playwright-core 1.63.0, Chromium 153.0.8010.12 headless shell, 1280 × 900 and 390 × 844 viewports, device scale 1 for numbers and 2 for captures (10 for the raster slant), dark scheme, forced colors and reduced motion emulated through Playwright. Targets: scratch pages (SSR markup from `packages/ui/dist` plus its shipped CSS) and the final `pnpm storybook-build`, both served from a scratch Node server on 127.0.0.1.
- **Scratch captures (not committed, not adopted):** story PNGs at device scale 2 with SHA-256 `atoms-stepmeter--default` `a38a15be…`, `--levels` `f726eb70…`, `--custom-steps` `a365651f…`, `--on-surfaces` `19a40cff…` and `molecules-nowcard--with-step-meter` `3a56f9df…`. They are not VIS-01 captures of either spec and exist only so the owner can decide whether to authorize them under `docs/components/step-meter/v0.1/` with a `capture.json`.

## 5. Findings

1. **F1 — used widths snap to 1/64 px (no stop line).** The declared geometry equals the approved arithmetic exactly, but Chromium lays steps out at `11.1875 px`, so roots measure `54.3125` and `140.5625` against the spec's "about 54.4 and 140.8" (0.16 % and 0.17 % less). The same snap affects every fractional token length (a plain `calc(var(--space-1) * 3.5)` box, a 19.2 px box). I treated this as inside "about" and did not stop; the numbers are recorded so the owner can overrule.
2. **F2 — root `display` reads `flex` in a flex parent.** The authored `inline-flex` is blockified when the meter is a flex item (Cluster, Stack, the footer); in a block or inline host it computes `inline-flex`. The built-CSS and packed tests, not the computed value in a flex host, prove the utility.
3. **F3 — judgment call: the hook also drops `ref`.** React 19 delivers `ref` to function components as a prop, which would attach it to the root against the spec's "no ref"; NowCard's hook already discards it. It is one entry in the discarded set with its own test; remove both if the owner prefers the spec's enumerated list verbatim.
4. **F4 — plan drift.** The shared files had moved (other lanes), so every edit was located by content. The plan names two export lists in `package-exports.test.mjs`; the file has three places (runtime names, the sorted declaration list and the `names.has` list) and all three gained `StepMeter`. Next to the 185 counter in `prop-naming.test.mjs` a second pin, `beforeIndicatorConventions(...).length`, became 182.
5. **F5 — D2 path.** `step-count` ships `proposed`, `approval: null`, with the plan's `whenToUse` (plan-authored, the part D2 would have approved) and no receipt file. `accessible-name` and `primary-value` only gained usages. The four NowCard revisions were refreshed after reading the JSDoc-only diff.
6. **F6 — the browser caught a story defect.** In `OnSurfaces` the default stretching `Stack` widened one meter root to 56 px; the story now uses `alignItems='start'` and every root measures 54.3125.
7. **F7 — `pnpm test:mcp` fails 1 of 11 (pre-existing, not touched).** `README requests and responses track the real stdio tools and installed artifact`: "the documented package versions match the installed release", the same stale-README failure as on main; this change did not touch `packages/mcp`.
8. **F8 — size against the estimate.** The tracked diff excluding the parent's ODD row is +851 −28 across 22 files (generated files +36 −14) plus 786 new lines under `atoms/step-meter/`, about 1,600 changed hand-written lines against the plan's 1,100 to 1,450. The tests are fuller than estimated (`StepMeter.test.tsx` 502 against about 300, package consumption +132 against about 70, artifact test +101 against about 40).
9. **F9 — Controls `Set number`.** The unset optional control starts at 0 when clicked, which is an invalid `steps` and falls back to 4 silently; this is the documented rule, not a defect.

## 6. Checks on the final tree

All run from the repository root, in the foreground, one at a time, after the last edit to a source file.

| Command | Exit | Result |
| --- | --- | --- |
| `pnpm exec vitest run packages/ui/src/atoms/step-meter --maxWorkers=2 --no-cache --configLoader runner` | 0 | 1 file, 63/63 |
| `pnpm exec vitest run packages/ui/src/molecules/now-card packages/ui/src/organisms/now-strip …` | 0 | 2 files, 34/34 (baseline 25) |
| `pnpm exec vitest run …/storybook-docgen.test.ts …/storybook-controls.test.ts …/storybook-css.test.ts …` | 0 | 3 files, 525/525 (baseline 521) |
| `pnpm typecheck` | 0 | root `tsc --noEmit` plus the tokens, cli, mcp, ui and effects projects |
| `pnpm lint` | 0 | 1094 files, no fixes |
| `pnpm props:docs`, `pnpm props:check`, `pnpm test:props` | 0, 0, 0 | view regenerated; valid; 135/135 (baseline 134) |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | 0 | 119 rows (baseline 118) |
| `pnpm artifact --write`, `pnpm system:docs` | 0, 0 | idempotent |
| `pnpm artifact --check`, `pnpm system:check` | 0, 0 | no drift (also after `pnpm build`) |
| `pnpm test:artifact`, `pnpm test:system` | 0, 0 | 56/56 (baseline 54), 36/36 |
| `node --test scripts/storybook-mcp-contract.test.mjs` | 0 | 26/26 |
| `pnpm test` | 0 | 153 files, 3692/3692 (baseline 152 files, 3616) |
| `pnpm build` | 0 | tokens, system, mcp, ui and effects built; no tracked or untracked file other than the planned ones changed |
| `pnpm test:package-exports` | 0 | 143/143 (baseline 141) |
| `pnpm test:package-consumption` | 0 | 14/14: React 18.3.1 7/7, React 19.3.0 7/7 |
| `pnpm test:package-release` | 0 | 25/25 |
| `pnpm test:mcp` | 1 | 10/11, the pre-existing F7 failure |
| `pnpm storybook-build` | 0 | built; the five new stories are in `index.json` |
| `git status --short` | 0 | the planned paths only; the one untracked entry is `packages/ui/src/atoms/step-meter/` plus this file |

## 7. Commit grouping that keeps `props:check`, `artifact --check` and `system:check` green

- **Why the plan's six slices cannot be cut from this working tree as is:** the registry revisions bind the final bytes of two `types.ts` files, the artifact is derived from the barrel, the catalog, the registry and the NowCard JSDoc, and `types.ts`, the hook and `StepMeter.test.tsx` exist only in their final form (R1 to R4 and R5 to R8 are not separable without partial staging). At C3, C4 and C5 the artifact, `system.md`, the view and the catalog would each have to be regenerated from the sources of that slice alone; I did not observe those intermediate states.
- **Verified grouping (three commits, Conventional Commits, each body `Refs #556`):**
  1. `feat(step-meter): add the StepMeter atom core`: `packages/ui/src/atoms/step-meter/{types.ts,useStepMeter.ts,StepMeter.tsx,index.ts,StepMeter.test.tsx}`. The folder is not exported, so all three checks stay green (observed with the folder present and unexported: `props:check`, `artifact --check` and `system:check` exit 0 and the full suite 153 files, 3679/3679; `types.ts` only gained comments since).
  2. `feat(step-meter): publish StepMeter and allow it in the NowCard footer`: `StepMeter.stories.tsx`, `packages/ui/src/index.ts`, `packages/ui/src/styles/compiled.css`, `.storybook/main.ts`, `.storybook/preview.css`, the docgen and Controls tests, NowCard `types.ts`, `NowCard.test.tsx` and `NowCard.stories.tsx`, `skills/_shared/prop-naming.json`, `docs/prop-naming.md`, `scripts/prop-naming.test.mjs`, `scripts/catalog_data.py`, `docs/CATALOGO.md`, `docs/catalog.json`, `packages/system/design-system.json`, `packages/system/system.md`, `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs`, `scripts/design-system-artifact.test.mjs` and both changelogs. This is the final tree, so every check in section 6 holds. The harness files stay here because their export-list pins must move with the barrel; splitting them into a later `test(scripts)` commit would leave `pnpm test:package-exports` red for one commit (the three checks above would stay green).
  3. `docs(step-meter): record the v0.1 implementation evidence`: this file.
- **If the plan's finer slices are still wanted:** C1 and C2 merge into commit 1; C3, C4 and C5 each need `pnpm props:docs`, `python3 scripts/build_catalog.py`, `pnpm artifact --write` and `pnpm system:docs` run on that slice's sources before staging (C3: barrel and catalog row only; C4: plus the registry entry and usages; C5: plus the NowCard JSDoc, the four revisions and the catalog note); C6 is the changelogs and this file.

## 8. Remaining work

None inside the plan. Parent-owned and not done here: the commits, the ODD log, the `step-count` convention receipt (D2), any release or version decision (D6), authorization to commit captures (D7), and the owner's call on F1 and F3.

## 9. Not evaluated

- Visual conformity against VIS-01 of either spec: no expected-design capture exists or was adopted, so it stays Not evaluated.
- Real screen-reader output for the meter or the card; zoom and reflow in real browsers; RTL appearance of the slant; protan and deutan simulations.
- Firefox, WebKit, any Chromium other than 153, and a real Windows High Contrast session (forced colors was Chromium emulation).
- The `step-count` convention approval (no receipt); `scripts/storybook-mcp.test.mjs` (needs a parent-owned docs-only Storybook server); `pnpm test:cli`, `pnpm test:tokens` and the MCP README versions (F7), which this change does not touch.
- Contrast on canvases other than the four Grafito surfaces and the dark Storybook background.
