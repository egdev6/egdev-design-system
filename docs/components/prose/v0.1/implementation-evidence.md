# Prose v0.1 — implementation evidence

- **Status:** Observed evidence for the implementation of [#569](https://github.com/egdev6/egdev-design-system/issues/569) (readable long-form body with a reading measure), ODD S2 and S4, task T6, recorded by the implementation writer on 2026-11-26. **Complete: every acceptance criterion PRS-01 to PRS-15 and TK-1 to TK-4 passes on the final tree and no browser measurement contradicts an approved promise. One plan stop line (a computed difference with and without Preflight) fired once on a defect of my own recipe, not on the approved one (F1); it was corrected to the spec's literal recipe and re-measured clean before any further work.** **Update, 2026-11-27: the owner answered findings F3 and F4 (L8, verbatim "Dejar 65ch y corregir el selector de code (Recomendado)"): the 65ch measure stays as approved, and the spec was amended once ([`approval.md`](approval.md) Amendment 1) so that the inline-code selector reads `code:not(pre code)`; a `code` directly under the root is now brand-coloured (section 7).** Visual conformity is **Not evaluated**: no expected-design reference exists and no capture was made or adopted. The commits are made by the parent; nothing here is committed, published or released.
- **Contract:** [`spec.md`](spec.md) v0.1, approved 2026-11-26, `contentSHA256: bd1ec5015090608aed7cc0c39fd71ba960f210ec397ad25d08327c916e63abd2`, recomputed with the spec's own rule (`awk '/^## 1\. Purpose and scope$/{f=1} f'`) before the first edit and again after the last one: equal both times. The spec, [`approval.md`](approval.md) and the plan (`79c6d08c…`, also re-verified) were byte-untouched during the implementation run; Amendment 1 of 2026-11-27 changed the spec, the approval record and the plan header afterwards (section 7). Plan: [`implementation-plan.md`](implementation-plan.md), approved by the owner's verbatim answer "Aprobar los 10 (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L6), which covers browser runs, packed consumers, registry receipts for the newly named conventions and `(#N)` changelog citations. Token: `--container-prose: 65ch`, owner-confirmed verbatim "Sí, 65ch (Recomendado)" (L5). Versions: the owner overrode the plan's tokens 0.6.2 with tokens 0.7.0 (L6, verbatim "tokens 0.7.0 y cli 0.5.0 (Recomendado)"), so the tokens changelog section is `## 0.7.0`; no `package.json` version was edited, and the parent folds the versions.
- **Baseline:** branch `integration/round-5`, HEAD `457e64a` (the Link, Footer, SectionNav and HomeTemplateAnchor lanes already committed), clean tree. R0 on the unchanged tree: `pnpm test:tokens` 72/72; focused vitest (Text, Surface, Stack, docgen, Controls, CSS: 8 files) 674/674; `props:check` valid; `test:props` 136/136; `artifact --check` and `system:check` exit 0; `test:artifact` 60/60; `test:system` 36/36; `test:mcp` 20/20; `node --test scripts/storybook-mcp-contract.test.mjs` 26/26. `design-system.json` was 613,642 bytes and `system.md` 503,338 bytes.
- **Environment:** Node v24.22.2, pnpm 10.34.6, Vitest 4.1.11, React 19.3.0 in the workspace and 18.3.1 plus 19.3.0 in the packed consumers (offline, `EGDEV_CONSUMER_OFFLINE=1`), Chrome for Testing 153.0.8010.12 (`--headless=new`, Playwright's `chromium-1243` build) driven over the raw DevTools protocol from a scratch script outside the repository (no Playwright package is installed in the workspace).
- **Final digests of the touched sources (first 8 hex):** `types.ts` `9fa0da50` (full `9fa0da50b17a2d7e58325c9b6447730377cc5a044668be6d199ed0da92a1527e`, the value written into the two registry revisions before Amendment 1, which moved them to the digest in section 7), `useProse.ts` `2e4bbf6e`, `Prose.tsx` `f4cd5f0a`, `index.ts` `3180f7e5`, `Prose.test.tsx` `1802a133`, `Prose.stories.tsx` `7d7f2ce0`, `packages/ui/src/index.ts` `514cabf8`, `compiled.css` `2634e4c9`, `.storybook/main.ts` `cfe958da`, `.storybook/preview.css` `59b13a0d`, `theme.css` `2ba17e32`, `prop-naming.json` `867e8f8c`, `prop-naming.test.mjs` `e36cecb0`, `design-system-artifact.test.mjs` `ca338bf8`, `package-exports.test.mjs` `5b1fbdc5`, `package-consumption.test.mjs` `5c44d1ab`, `storybook-docgen.test.ts` `43b522a5`, `storybook-controls.test.ts` `bb500dc3`, `storybook-css.test.ts` `c35eab78`, `design-system.json` `369eb637` (620,412 bytes, against the 786,432-byte and one-MiB budgets), `system.md` `ecf07f34` (506,904 bytes).

## 1. Verdicts per acceptance criterion

"Pass" means observed in this run by the test or measurement named. Browser rows are Chromium 153 only. Nothing here is a screen-reader claim.

| ID | Verdict | Evidence |
| --- | --- | --- |
| TK-1 | **Pass** | `typography-spacing.test.mjs`: `--container-prose` is `65ch`, declared once, inside `@theme static`. `theme.css` diff is two added lines (the comment and the declaration) beside `--container-quote-pull`. |
| TK-2 | **Pass** | `token-contract.test.mjs`: 231 utility and 314 total declarations, compiled `dist/tokens.css` 314 after `pnpm tokens`, parity with no missing, extra or changed token. The `manifest.version` pin (line 142, `'0.6.1'`) is **left for the fold**, because `package.json` is not edited: it must read `'0.7.0'` then. |
| TK-3 | **Pass** | `pnpm test:mcp` was red (20 tests, 4 failed) once the artifact listed Prose and the new token; `pnpm mcp:readme` rewrote one digest line (the `get_design_system_md` response) and the test is 20/20. The other four examples keep their digests. |
| TK-4 | **Pass** | The packed native artifact exposes 314 variables (`package-consumption.test.mjs` pin), observed in both packed consumers. |
| PRS-01 | **Pass** | `Prose.test.tsx`: one `div.eg-prose` holds the children unchanged and in order, with no role, id, `tabindex`, `data-state` or extra node; the hook returns only a `className`; the public module exports only `Prose`. |
| PRS-02 | **Pass** | Table-driven rows: `md` carries `text-body-large` and `sm` `text-body-default`, never both; the inline-code utility follows `tone`; omitted and untyped (`'lg'`, `'flood'`, `null`, `42`, `''`) values fall back to `md` and `canvas`. |
| PRS-03 | **Pass** | Unit: `max-w-prose`, `min-w-0` at both sizes. E1 and the shipped sheet: `.max-w-prose` is `max-width: var(--container-prose, 65ch)`, so the `65ch` literal fallback exists for apps on an older tokens version. Chromium (section 3): the computed `max-width` equals a `65ch` probe inside the root at both sizes, and a paragraph longer than the measure wraps at it. See F2 and F3. |
| PRS-04 | **Pass** | One `it.each` row per selector (24 targets plus the first and last child), the preview-build rule inventory (E1, every utility of the recipe against its token, completeness-checked against `proseVariants`) and 27 shipped-sheet rules. |
| PRS-05 | **Pass** (browser) | Section 3: with the shipped sheets, the 24 probed elements show **no non-inert computed difference and identical layout rectangles** with and without Preflight, at `md` and `sm`, and every checked value equals the spec's token arithmetic. |
| PRS-06 | **Pass** (browser) | `pre > code` computes `rgb(204, 204, 204)` (the block colour) and `code` in a paragraph the neon brand colour `rgb(255, 0, 54)`. F4, the one markup shape the first selector did not reach, is resolved by Amendment 1: after it a `code` directly under the root is brand-coloured too (section 7). |
| PRS-07 | **Pass** | Source scan of the recipe tokens: only token utilities plus the four precedent forms and the `underline-offset-(--space-1)` token reference; no hex, rgb, px or `!`; `useProse` returns no `style`; the folder is exactly the six files, no stylesheet, no `eg-prose__` marker, no `@classNameAllows`. |
| PRS-08 | **Pass** | `className='mx-auto mt-8'` merges after the variants, the marker stays first and the descendant utilities survive; the artifact lists no `classNameAllows` for Prose. |
| PRS-09 | **Pass** | `expectTypeOf` and written-reason `@ts-expect-error` negatives (`pnpm typecheck` 0 errors): `children` required, no `role`, `aria-label`, `aria-labelledby`, `dangerouslySetInnerHTML`, `ref` or `asChild`. An untyped `dangerouslySetInnerHTML` is discarded: children render, nothing is injected, React logs no error (unit, packed SSR). `lang`, `dir`, `id`, `title`, `aria-describedby` and `data-*` reach the root. |
| PRS-10 | **Pass** | A fixture with every supported element renders with the same inner HTML inside Prose and inside a plain `div` (client and server), with the roles present; the root has the single attribute `class`. In Chromium the accessibility tree is a generic (ignored) root with headings 2 to 4, two lists with markers, link, blockquote, figure with image name, table with column headers, and a separator. |
| PRS-11 | **Pass** (browser) | Links keep an underline at rest; hover removes it and keeps the colour. A real Tab reaches the link with `:focus-visible`, `box-shadow: rgb(20, 21, 24) 0 0 0 2px, rgb(255, 0, 54) 0 0 0 4px` (the `--shadow-focus` token) and `outline-style: none`; in `Overflow` at 390 px Tab reaches the link and then the overflowing `pre` with the same ring (Chromium makes the scroller focusable), then leaves the document. Prose adds no `tabindex`. |
| PRS-12 | **Pass** | The existing token tests are unmodified and green. Measured contrast equals the spec's hand-computed table (section 3); no new pin was added. |
| PRS-13 | **Pass** | Packed `@egdev/ui` exports `Prose`, `ProseProps`, `ProseSize`, `ProseTone` and not `proseVariants` or `useProse`; `styles.css` holds the rules and `.max-w-prose`; typed samples, nine negatives, CSS and SSR checks pass on React 18.3.1 and 19.3.0 without a Tailwind compiler. |
| PRS-14 | **Pass** | Existing exports, markers and tests are unchanged; the diff of existing files is additions apart from the pins listed in section 2; the Text, Heading, Surface and Stack suites are unmodified and green; the registry, artifact and catalog are regenerated and valid. |
| PRS-15 | **Pass** | `Primitives/Prose` with autodocs and `Default`, `Elements`, `Sizes`, `RaisedTone`, `Overflow`; no `argTypes`, no `play`; docgen and Controls pins with zero owned diagnostics; in the browser Docs table `size` is a select (`Choose option...`, `sm`, `md`; Default `"md"`), `tone` a select (`Choose option...`, `canvas`, `raised`; Default `"canvas"`), `children*` has no widget, the native rows `style`, `title`, `className`, `dir`, `id`, `lang`, `aria-describedby` show "Set …" buttons, and no argument is injected. |

## 2. Test-first record

Each RED was observed before its GREEN; commands are repository-root runs.

| Step | RED (observed) | GREEN (observed) |
| --- | --- | --- |
| Token | `pnpm test:tokens` 73 tests, 70 pass, 3 fail: `230 !== 231`, `313 !== 314`, `undefined` is not `'65ch'` | 73/73 after the declaration and `pnpm tokens` |
| Component core | `Prose.test.tsx` fails at import (`./Prose` unresolved); after a bare `div.eg-prose` 47 of 57 tests fail, each on its own assertion (size, tone, measure, recipe, React throws on children plus `dangerouslySetInnerHTML`) | after the recipe, hook and stories 56/57; the last row was my SSR comparison tripping on React 19's hoisted image preload hint (test fixed, F8): 57/57 |
| Browser-found defect | The Preflight probe showed `blockquote` border widths of 3px on three sides without Preflight (F1). A new unit guard fails first: 1 of 58 | 58/58 after removing `border-solid`; the probe then shows no non-inert difference |
| Docgen and Controls pins | 3 of 438 fail (the barrel list, the Prose extraction, the Prose Controls) | 438/438 after the barrel lines and `documentedNativeProps.prose` |
| Registry | `test:props` 137 tests, 1 fail (no Prose usage); with the usages and no post-receipt pairs, 3 fail (two receipt tests and the new one: the unlisted usage) | 137/137 after the pairs; `props:docs` and `props:check` valid |
| Artifact | the new assertion fails (`the artifact lists Prose`) and the stale-artifact checks fail | `test:artifact` 61/61 after `artifact --write` and `system:docs` |
| README digests | `test:mcp` 20 tests, 4 fail | 20/20 after `pnpm mcp:readme` |
| E1 (emitted CSS) | with the production `@source` line temporarily removed, `storybook-css.test.ts` 94 tests, 1 fails: `Missing compiled preview rule .max-w-prose` | 94/94 with the line restored |
| Packed harnesses | against the stale `dist`: `test:package-exports` 147 tests, 3 fail (the built-CSS row failed on my own collector counting `defaultVariants` values as classes, fixed; the SSR row and the root-export lists were the intended failures); `test:package-consumption` 14 tests, the `types` and `ssr` subtests of both React versions fail (`TS2305` no `Prose`, `ProseProps`, `ProseSize`, `ProseTone`; nine unused `@ts-expect-error`) | after `pnpm build`: exports 147/147, consumption 14/14 |
| TK-4 pin | not run separately: the same arithmetic as TK-2's red (313 to 314) | green through the packed harness |

**PRESERVE.** No shared parser, helper, CVA or hook changed, so no differential run was needed. `git diff --stat` on `packages/ui/src/primitives/text`, `surface`, `stack`, `packages/ui/src/styles/legacy`, `packages/effects`, `packages/cli` and `packages/mcp/src` is empty. The deletions in existing files are exactly: the two catalog count rows, the two regenerated `docs/prop-naming.md` rows, one README digest line, the token pins (three counts and two test titles in `token-contract.test.mjs`, the packed count line) and one list line in the Controls test that gained a comma.

## 3. Browser observation

**Method.** A static `pnpm storybook-build` of the final working tree, a loopback server and Chrome for Testing 153.0.8010.12 over the DevTools protocol; dark Grafito canvas, device scale 1 (2 for the reflow runs), forced colours off, `prefers-reduced-transparency: reduce` emulated only where stated (`matchMedia` confirmed). Barlow, Barlow Condensed and JetBrains Mono loaded from Google Fonts (`document.fonts` showed the faces in use as loaded). Pages: the Storybook stories `primitives-prose--default`, `--elements`, `--sizes`, `--overflow` and the Docs page, plus three scratch fixtures rendered from the built `@egdev/ui` with only the packed `tokens.css` and `styles.css`: without Preflight, with Tailwind's `preflight.css` in `@layer base`, and a four-host surface ladder. The scratch directory `/tmp/prose-evidence.KMc89U` (the harness script and its JSON outputs, 188 KB, plus a one-line path note `/tmp/prose-evidence.path`) was made with `mktemp -d` outside the repository; the harness removed its browser profile in its teardown, and the directory itself is left for the parent to remove. Date 2026-11-26.

**PRS-03, measure.** Computed `max-width` equals a `65ch` probe measured inside the root: 588.64 px at `md` (16 px) and 470.78 px at `sm` (12.8 px), in Storybook (`Sizes`, `Default`) and in the fixture; the root is exactly that wide with no horizontal overflow, and the sample paragraphs wrap at it (full lines of 82 to 86 characters at both sizes in the story; 77 to 87 in the fixture).

**PRS-05 and PRS-06, computed style.** Storybook carries no Preflight (a bare `h2` outside Prose computes 24 px with a 19.92 px margin and weight 700); the Preflight fixture computes 16 px, 0 and 400. Over 25 probed elements, 48 properties and a bounding rectangle each, at `md` and `sm`: **120 differences per size, all inert, none in layout**: `border-*-style` `none` against `solid` on zero-width borders (89), `box-sizing` (23) and the `width` getter of six elements that follow from it (their border boxes are equal), `img` `vertical-align` on a block image, and `hr` `color` (its border colour is explicit). Rectangles are identical at every element. The values, from the fixture: `h2` Barlow Condensed 32 px / 38.4 px, weight 800, uppercase; `h3` Barlow 19.2 px, 700; `h4` Barlow 16 px, 700, line 25.6 px; `p` 16 px on 25.6 px (`md`) and 12.8 px on 20.48 px (`sm`), bottom margin 16 px; links `rgb(255, 0, 54)`, underlined, offset 3.2 px; `strong` 700; `ul` disc and `ol` decimal at 22.4 px inset; `blockquote` 2 px solid start border in `rgb(255, 0, 54)`, 0 on the other sides, 14.4 px padding; inline `code` JetBrains Mono 11.2 px in neon, `pre > code` `rgb(204, 204, 204)`; `pre` on `rgb(20, 21, 24)` with a 1 px `rgba(255, 255, 255, 0.08)` border, the two inset well shadows, 9.6 px radius, `overflow-x: auto`; `table` collapsed, `th` band `rgb(35, 36, 40)` with a 1 px bottom rule; `hr` 1 px top border and 0 elsewhere; first child margin-top 0 (the `h2` would be 38.4 px) and last child margin-bottom 0.

**Reflow (VIS-02 condition).** `Overflow` at 390 px: the root is 307.19 px; the long address wraps on two lines inside it; `pre` scrolls inside the root (scroll width 636 px in a 305 px client); the 525 px table overflows the root and the document scrolls horizontally (OQ-7: observed, not promised; the converter wraps wide tables). At 640 px (200 % zoom of 1280): the address wraps and `pre` scrolls inside the root, with no document overflow.

**Contrast.** Measured from resolved colours on the four surfaces (`RaisedTone` scenario), against the spec's computed figures; every one is equal:

| Role | `surface-0` | `surface-1` | `surface-2` | `surface-3` |
| --- | --- | --- | --- | --- |
| `fg-default` (headings) | 18.26 | 17.02 | 15.50 | 13.55 |
| `fg-secondary` (quote, cells, `pre` on its own well 11.37) | 11.37 | 10.60 | 9.65 | 8.44 |
| `fg-muted` (captions, markers; `th` on the band 6.09) | 7.17 | 6.69 | 6.09 | 5.32 |
| neon link and inline code | 4.61 | 4.30 | 3.92 | 3.42 |

Under `SectionShell register='grafito'` in Storybook (no particle layer), the wash composites to `rgb(30, 33, 36)` over that canvas: headings and body 16.18, links 4.09; under `prefers-reduced-transparency: reduce` it is the solid `rgb(20, 21, 24)`: 18.26 and 4.61. These are observed on this host only; the real ambient layer is Not evaluated.

**Accessibility tree and Controls.** As in PRS-10 and PRS-15 above; the Docs table lists no extra row and shows no control for `children`.

## 4. Findings

- **F1: a browser-found defect, fixed.** My first recipe added `border-solid` to `blockquote`, which is not in the spec's recipe. Without Preflight the unset widths are `medium`, so top, right and bottom drew 3 px neon borders. The Preflight comparison exposed it; the recipe now matches the spec's literal string (`border-s-[length:calc(var(--border-width)*2)]` and `border-fg-brand-default`, relying on the `@property --tw-border-style` solid default), a unit guard pins the start-only border, and the probe is clean. `hr` keeps the spec's `border-0 border-t border-solid`.
- **F2: the plan's 0.5 px probe tolerance is below the probe's resolution.** A `1ch` probe times 65 differs from the computed `max-width` by 0.56 to 0.59 px, because layout quantizes the probe width to 1/64 px before it is multiplied. A `65ch` probe equals the computed value to 0.02 px. The promise (the computed `max-width` equals `65ch`) holds; only the probe method changed.
- **F3: `65ch` is about 85 characters per line in Barlow.** The full lines of the sample English paragraphs hold 82 to 86 characters in the story and 77 to 87 in the fixture, at 16 px and at 12.8 px alike (the digit advance is 0.565 em, wider than the average letter), about 85 on average. That is above the 80-character bound of WCAG 2.2 SC 1.4.8 (Level AAA) and the 45 to 75 range that spec section 6 cites as background for the token. The approved promise is the `65ch` measure, which holds, and the owner confirmed that exact value, so nothing was changed. If the owner wants about 66 characters, a different value (around 52 to 56ch) needs a new token confirmation and, per the spec's name-collision note, the name `--container-reading`. The pending character-count check against real es and en prose remains open. **Owner decision (2026-11-27): keep 65ch**, verbatim "Dejar 65ch y corregir el selector de code (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L8). The token, the measure and PRS-03 are unchanged, and the character-count check stays open.
- **F4: `:not(pre) > code` does not reach an inline `code` that is a direct child of the root.** The root is not a descendant of itself, so `<Prose><code>x</code></Prose>` keeps the mono 11.2 px face but inherits the host colour (`rgb(255, 255, 255)`), while `code` inside `p` is neon and `pre > code` is block-coloured. A converter that wraps phrasing content in `p`, as HTML requires of prose, is unaffected. The selector is the spec's own spelling; `code:not(pre > code)` would cover it, and that is an amendment. **Resolved (2026-11-27):** the owner chose to correct the selector (L8). Amendment 1 spells it `code:not(pre code)`, which also leaves a `code` nested deeper inside a `pre` out of the inline rule (section 7).
- **F5: a wide table overflows the document at 390 px** in `Overflow`, as OQ-7 states; the story documents the converter's duty.
- **F6: the artifact builder indexes Prose sparsely.** `anatomyUtilities` lists 37 Prose utilities (typography, radius, shadow, padding, family); colour, margin and named-container utilities such as `max-w-prose` (like `max-w-quote-pull`) are in the recipe's `classes` but not indexed, and six keyword utilities are flagged `unresolved` by the builder's `text-*` heuristic (`text-pretty`, three `text-balance`, two `text-start`; Table's `text-start` already is). No token-backed utility is unresolved. The new artifact test pins both facts.
- **F7: plan slices 2 and 3 cannot be committed apart.** The folder-listing test in `Prose.test.tsx` requires `Prose.stories.tsx`, so the tests and the stories land together (the plan allows merging).
- **F8: React 19's server renderer hoists an image `preload` link** before the root for any `img`. The SSR comparison removes it from both sides; React 18 emits none.
- **F9: `pnpm test:package-release` fails on two changelog-heading mismatches that wait for the fold.** `release:pack` aborts with `@egdev/cli: CHANGELOG.md top section is 0.5.0, expected 0.4.0` (already true at HEAD, from the CLI lane) and `@egdev/tokens: CHANGELOG.md top section is 0.7.0, expected 0.6.1` (this lane, as the owner's version override requires). Both clear when the parent bumps the manifests.
- **F10: fold work for the parent.** Tokens 0.7.0 in `packages/tokens/package.json`; `token-contract.test.mjs:142` to `'0.7.0'`; then `pnpm artifact --write`, `pnpm system:docs` (the `packages` list carries the tokens version) and `pnpm mcp:readme` (every example embeds it), and `pnpm test:package-release`. The changelog citations are `(#569)` on the ui and system entries and `Refs #569` on the tokens entry, as plan section 7 says.
- **F11: documentation of the `className` surface.** DS046's base list covers margins and placement, so no `@classNameAllows` tag exists; `cn()` lets a `max-w-*` class replace `max-w-prose`, so the measure is guarded by consumer lint only, as the spec states.
- **F12: plan-level utility strings beyond the plan's inventory table.** Every element whose user-agent margin differs from Preflight's carries an explicit `m-0` before its own margins (`h2`, `h3`, `h4`, `p`, `ul`, `ol`, `blockquote`, `figure`, `hr`), as the spec's self-contained rule and its compile evidence (`m-0` before `mt-12`) call for; the Preflight comparison is the proof that the result is identical.

## 5. Checks on the final tree

From the repository root, in the foreground, one at a time; the last full pass ran after the last source edit.

| Command | Exit | Result |
| --- | --- | --- |
| `pnpm exec vitest run packages/ui/src/primitives/prose packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts packages/ui/src/primitives/text packages/ui/src/primitives/surface packages/ui/src/primitives/stack --maxWorkers=2 --no-cache --configLoader runner` | 0 | 9 files, 737/737 |
| `git diff --stat -- packages/ui/src/primitives/text packages/ui/src/primitives/surface packages/ui/src/primitives/stack packages/ui/src/styles/legacy packages/effects packages/cli packages/mcp/src` | 0 | empty |
| `pnpm typecheck` | 0 | 0 errors across the root, tokens, cli, mcp, ui and effects |
| `pnpm lint` | 0 | 1104 files, no fixes |
| `pnpm test:tokens` | 0 | 73/73 |
| `pnpm props:docs`, `pnpm props:check`, `pnpm test:props` | 0, 0, 0 | view regenerated; registry valid; 137/137 |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | 0 | 120 rows; only the Prose row and the two counts changed |
| `pnpm artifact --write`, `pnpm system:docs` | 0, 0 | `design-system.json` 620,412 bytes; `system.md` 506,904 bytes |
| `pnpm artifact --check`, `pnpm system:check`, `pnpm test:artifact`, `pnpm test:system` | 0, 0, 0, 0 | no drift; 61/61; 36/36 |
| `node --test scripts/storybook-mcp-contract.test.mjs` | 0 | 26/26 |
| `pnpm test` | 0 | 154 files, 3812/3812 |
| `pnpm build`, then `pnpm artifact --check` and `pnpm system:check` | 0, 0, 0 | no drift after the build |
| `pnpm mcp:readme`, `pnpm test:mcp` | 0, 0 | one digest line; 20/20 |
| `pnpm test:package-exports` | 0 | 147/147 |
| `EGDEV_CONSUMER_OFFLINE=1 pnpm test:package-consumption` | 0 | 14/14: React 18.3.1 and 19.3.0, shipped tokens and UI CSS, no Tailwind compiler in the application path |
| `pnpm test:cli` | 0 | 245/245 |
| `pnpm test:package-release` | 1 | `release:pack` aborts on the two changelog headings of F9; not a Prose failure |
| `pnpm storybook-build` | 0 | built on the final sources, gitignored `storybook-static` |

## 6. Not evaluated

Visual conformity against an approved expected design (VIS-01 to VIS-03): no capture was made or adopted. Contrast of any text over the website's real ambient layer. Screen-reader output, forced-colours and Windows high-contrast rendering. Browsers other than Chromium 153, including their support of `text-wrap: pretty` and `balance`, which are progressive enhancements. Real touch hardware. The character count of real Spanish and English prose (only the story sample was counted, F3). The website's own pages and converter output.

## 7. Amendment 1 (F4): the fix and its verification

Owner answer, verbatim: "Dejar 65ch y corregir el selector de code (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L8). The 65ch half changes nothing: F3 is accepted, and the token, the measure and PRS-03 stay as approved. The selector half moved the spec digest from `bd1ec5015090608aed7cc0c39fd71ba960f210ec397ad25d08327c916e63abd2` to `c17faa96af1ed45efe0e084e784307d8dfad7e2484bc4ded1bc556061d7f1674`; the plan's payload `79c6d08cbb0546a614eac0b1c7fe7dcf6728d3138659ace94391e6958ddf5d1d` is unchanged; [`approval.md`](approval.md) gained Amendment 1 with the old and the new digest. Recorded on 2026-11-27 on `integration/round-5`, test-first, in one pass with the DetailHeader and SectionNav items of the same L8 entry.

**Choice of selector.** jsdom 29.1.1 evaluated three candidates against a root holding five `code` shapes: a direct child, one in a paragraph, one in a link, `pre > code` and `pre > span > code`.

| Selector | Matches |
| --- | --- |
| `:not(pre) > code` (the first spelling) | paragraph, link and `pre > span > code`; it misses the direct child (F4) and colours the nested block code |
| `code:not(pre > code)` (F4's suggestion) | direct child, paragraph, link and `pre > span > code` |
| `code:not(pre code)` (adopted) | direct child, paragraph and link |

The adopted one reads "inline code anywhere under the root except inside a `pre`": one `code` type selector plus one `:not()` whose argument is a complex selector (Selectors Level 4; the Chromium 153 used here supports it). Its specificity is (0,1,3) against (0,1,2) before, and no other rule sets the colour of a `code`, so no cascade outcome changes.

**What changed.**

- Documents: the spec (the block 6 inline-code row, the PRS-04 selector list, the PRS-06 row and the header identity fields), `approval.md` (Amendment 1) and the plan header (the pinned spec digest and a re-approval note). The block 1 compile evidence, which records what the original candidate compiled to, stays as written.
- Code: the two tone variants of `proseVariants` spell `[&_code:not(pre_code)]:text-fg-brand-default` and `[&_code:not(pre_code)]:text-fg-brand-raised`, with a two-line comment in `types.ts`, now `fea45507867ff2fc1088010361e918dee996d6a0d525e2f8a22207d0571dedae`. The hook, the JSX and the stories are untouched.
- Tests: `Prose.test.tsx` moves its `inlineCode` constant and gains a selector-match test (60 tests now) that reads the root's own recipe variant, turns it into the selector a browser evaluates and checks it against the five shapes plus a list item, for both tones; the same token moves in `storybook-css.test.ts`, `package-exports.test.mjs`, `package-consumption.test.mjs` and `design-system-artifact.test.mjs`.
- Registry: the two Prose usages carry the new `types.ts` digest. Prose has no naming receipt and reuses two approved conventions, so nothing else moves.
- Generated: `docs/prop-naming.md` (the two revisions) and `design-system.json` (two class strings, `components[124].variants[0].classes[32]` and `[33]`). The built `styles.css` grew from 377,941 to 377,951 bytes (the selector text). `system.md` and the README digest did not change.
- Changelog: the `@egdev/ui` Prose bullet says that inline code is any `code` outside a `pre`, one directly under the root included.

**Test-first record.**

| Step | RED (observed) | GREEN (observed) |
| --- | --- | --- |
| Unit and preview CSS | `Prose.test.tsx` and `storybook-css.test.ts`: 12 failed, 148 passed (160): the two selector-match cases (`direct child: expected false to be true`, canvas and raised), nine tests that pin the new token and the preview CSS row | 160/160 after the recipe change |
| Registry | `props:check`: `Stale evidence revision: packages/ui/src/primitives/prose/types.ts`, and the registry-validating cases of `test:props` failed | `test:props` 142/142 and `props:check` valid after the two usages moved and `props:docs` regenerated the view |
| Artifact | `test:artifact`: 64 of 66 passed (`The Prose recipe lists [&_code:not(pre_code)]:text-fg-brand-default`) | 66/66 after `artifact --write` and `system:docs` |
| Built and packed | Not run red: their pins moved with the other tests, and the stale `dist` could only fail on the old rule | `test:package-exports` 157/157 and `test:package-consumption` 14/14 after the rebuild; the built sheet holds `.\[\&_code\:not\(pre_code\)\]\:text-fg-brand-default code:not(pre code)` and its raised twin |
| Browser | Table below, Before | After |

**Browser verification (Chrome for Testing 153.0.8010.12, `--headless=new`, raw DevTools protocol from scratch scripts).** Bare consumer pages (the server markup of the built `@egdev/ui` with only the shipped `tokens.css` and `styles.css`), both tones, without and with Tailwind 4.3.3's real `preflight.css` loaded raw in `@layer base`, at 320, 390 and 1280 px: 12 runs per build, identical in all of them. The Before build is the package as of the implementation commit.

| `code` shape | Before | After |
| --- | --- | --- |
| direct child of the root | `rgb(255, 255, 255)`, the host colour (F4) | `rgb(255, 0, 54)`, JetBrains Mono |
| in a paragraph, in a link, in a list item | `rgb(255, 0, 54)` | `rgb(255, 0, 54)` |
| `pre > code` | `rgb(204, 204, 204)` | `rgb(204, 204, 204)` |
| `pre > span > code` | `rgb(255, 0, 54)`, reached by the inline rule | `rgb(204, 204, 204)`, the block colour |

No run has horizontal overflow. In the static Storybook build (preview CSS, no Preflight), `Elements` and `RaisedTone` give `rgb(255, 0, 54)` for the paragraph's inline code and `rgb(204, 204, 204)` for `pre > code`; `Default` holds no `code`. No story shows a `code` directly under the root, so that shape is proven by the consumer pages and the unit test only; adding a story was outside this amendment.

**Checks on the final tree.** They ran once, on one tree, for the three L8 items; the command list and the exit codes are in the DetailHeader evidence, section 7. Results: the focused vitest (both components and their neighbours) 10 files, 513/513; docgen, Controls and CSS 3 files, 556/556; `pnpm typecheck` and `pnpm lint` 0 (1137 files, no fixes); `props:check` valid and `test:props` 142/142; `artifact --check` and `system:check` 0, `test:artifact` 66/66, `test:system` 36/36, `test:mcp` 20/20; `pnpm test` 159 files, 4414/4414; `pnpm build` 0, with no drift afterwards; `test:package-exports` 157/157; `EGDEV_CONSUMER_OFFLINE=1 pnpm test:package-consumption` 14/14; `test:package-release` 13 of 18, failing only on the two known changelog headings; `pnpm storybook-build` 0.

**Scratch left outside the repository.** `/tmp/l8-amend.shG4YX` (the scripts, the consumer pages, the JSON measurements and a Chrome profile), `/tmp/l8-amend.path`, `/tmp/l8-jsdom-probe.cjs` and the `/tmp/l8-*.log` files. None is in the working tree.
