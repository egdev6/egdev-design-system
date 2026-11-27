# Link v0.5 — implementation evidence

- **Status:** Observed evidence for the implementation of [#562](https://github.com/egdev6/egdev-design-system/issues/562), the Link half (ODD S2, task T6), recorded by the implementation writer on 2026-11-26. **Complete: every acceptance criterion passes, no browser measurement contradicts an approved promise and no plan stop line holds.** Visual conformity is **Not evaluated**: no expected-design reference exists and no capture was adopted. The commits are made by the parent; nothing here is committed, published or released.
- **Contract:** [`spec.md`](spec.md) v0.5, approved 2026-11-26, `contentSHA256: db442bd1d74bfd3d2e983b797895f76ad0de486de2ba0d19b390d437db68af81`, recomputed with the spec's own rule (`awk '/^## 1\. Purpose and scope$/{f=1} f'`) before the first edit and again after the last one: equal both times. The spec, the plan (`847a539e…`, also re-verified) and [`approval.md`](approval.md) are byte-untouched. Plan: [`implementation-plan.md`](implementation-plan.md), approved by the owner's verbatim answer "Aprobar los 10 (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L6), which covers browser runs, packed consumers, registry receipts and `(#N)` changelog citations.
- **Baseline:** branch `integration/round-5`, HEAD `48d9eb7` (T2 to T4 already committed). The six Link sources matched the plan's digests before the first edit (`types.ts` `850d9f0b…`, `useLink.ts` `61765e5b…`, `Link.tsx` `b7f1af3e…`, `Link.test.tsx` `e7c1bf10…`, `Link.stories.tsx` `8a47beaf…`, `index.ts` `4da2c71d…`). The shared files had moved on since the plan was drafted (`prop-naming.json` `cffb7f81…`, `prop-naming.test.mjs` `dbb5a6a0…`, `design-system-artifact.test.mjs` `91fff6d5…`, the system changelog `e817b531…`); every line anchor the plan cites was re-checked and still held. Baseline runs on the unchanged tree: focused Link, docgen and Controls 3 files, 451/451; `pnpm props:check` valid; `pnpm test:props` 135/135; `pnpm artifact --check` and `pnpm system:check` exit 0.
- **Environment:** Node v24.22.2, pnpm 10.34.6, Vitest 4.1.11, Storybook 10.6.1, React 19.3.0 in the workspace and 18.3.1 plus 19.3.0 in the packed consumers (offline, `EGDEV_CONSUMER_OFFLINE=1`), Chrome for Testing 153.0.8010.12 (`--headless=new`, Playwright's `chromium-1243` build) driven over the raw DevTools protocol from scratch scripts outside the repository (no Playwright package is installed in the workspace).
- **Final digests of the touched sources:** `types.ts` `38f79b26ada7091484423cec50726c9094c1321c51938dedbe6bcd8524ffffc9` (the value written into the five registry revisions), `useLink.ts` `e673e8943c4a…`, `Link.test.tsx` `7f3746064292…`, `Link.stories.tsx` `360c6547a7…`, `storybook-controls.test.ts` `4b7917bb128b…`, `storybook-docgen.test.ts` `fcd5398e2572…`, `package-exports.test.mjs` `9f0f21e35400…`, `package-consumption.test.mjs` `e7c25d0e93ce…`, `design-system-artifact.test.mjs` `028ebfb4d020…`, `prop-naming.json` `d05a0ef21040…`, `design-system.json` `852efc4d5245…`, `system.md` `79ad68a43b28…`. `Link.tsx` and `index.ts` are unchanged (digests equal the baseline).

## 1. Verdicts per acceptance criterion

"Pass" means observed in this run by the command shown. Browser rows are Chromium 153 only. Nothing here is a screen-reader claim.

| ID | Verdict | Evidence (command and result) | Limit |
| --- | --- | --- | --- |
| AC-01 | **Pass** | `Link.test.tsx` (typed `const quietVariant: LinkVariant = 'quiet'` renders, no `variant` attribute, the default still yields `text-link-default`); root `tsc` reported 6 × TS2322 on the base and `pnpm typecheck` is 0 now; the packed consumers compile `const linkQuietVariant: LinkVariant = 'quiet'` under React 18.3.1 and 19.3.0 (14/14), after failing on a base build with `consumer.ts(2395,7): TS2322` | none |
| AC-02 | **Pass** | The `quiet` token set equals the `plain` set minus `text-link-default` plus `text-fg-default` and `decoration-fg-brand-default` (22 tokens), contains every utility the criterion lists and none of `text-link-default`, `no-underline`, `hover:text-*`, `hover:decoration-*`, `hover:underline`, `border-b`, `pb-0.5` | none |
| AC-03 | **Pass** | For `plain`, `underlined` and `quiet`, at CVA level and in the rendered class list: exactly one text-colour utility, exactly one `text-label-default`, and a decoration colour only for `quiet` | none |
| AC-04 | **Pass** | One literal 21-token v0.4 set pinned for the default, `plain` and `underlined` at CVA, hook and DOM level, plus the v0.4 arrow string; green on the base before any edit. The ten caller suites (Footer, Closing, Hero, LiveBand, NowStrip, Notice, CommunityCard, ModuleCard, NowCard, ProjectCard) ran unmodified: 229/229. Differential on a base copy: section 2 | The root class *string order* of `plain` and `underlined` changed in all 96 compared renders (the ink moved from the middle of the base to the end of the recipe); the *set* is identical, which is what the spec compares |
| AC-05 | **Pass** | Hook and CVA assertions: `hover:no-underline` present, no hover colour or decoration utility, `arrowClassName` byte-identical for the three variants and equal to the v0.4 string. Browser (section 3): on a real hover the line computes `none`, ink and decoration colour are unchanged, the arrow moves by exactly 3.200 px | Hover needs a hover-capable pointer (finding F1) |
| AC-06 | **Pass** | Hook assertions for `focus-visible:outline-none`, `focus-visible:[box-shadow:var(--shadow-focus)]`, `focus-visible:rounded-sm`, `motion-reduce:transition-none` and the arrow's reduced-motion utilities, plus `user.tab()`. Browser: a real Tab matches `:focus-visible` and the computed `box-shadow` equals the `--shadow-focus` token exactly; with `prefers-reduced-motion: reduce` the arrow does not move and both transition properties compute `none` | Chromium only |
| AC-07 | **Pass** | Three cases mirrored for `quiet`: external (`target`, merged `rel`, hidden notice, then `arrow={false}`), `asChild` with a router anchor (one anchor, composed refs, event order, native Tab and Enter) and `renderToString` of both modes | none |
| AC-08 | **Pass** | `'primary'`, `'Quiet'`, `''`, `null` and `undefined` (cast) all resolve to the exact `plain` set, never a partial one; `'quiet'` passes through; `'underlined'` equals `plain` | none |
| AC-09 | **Pass** | `className` `mt-2 mt-4 self-start` leaves `mt-4 self-start` natively and slotted; `eg-link` survives; `variant`, `external`, `newTabText`, `asChild` and `arrow` never reach the DOM | none |
| AC-10 | **Pass** | `Link.test.tsx` reads the ink and underline from the *emitted* `quiet` classes, resolves the `var()` chains from `theme.css` and gets 18.26, 17.02, 15.50, 13.55 (ink) and 4.61, 4.30, 3.92, 3.42 (underline) on surface-0 to surface-3, equal to the spec table to two decimals. Browser, from sampled pixels and not from tokens: section 3 | The footer backdrop was a *composed* fixture, not the real Footer; sampling is the worst of 40 frames, twice, not exhaustive |
| AC-11 | **Pass** | `pnpm test:package-exports` 143/143: `.text-fg-default` and `.decoration-fg-brand-default` (`text-decoration-color: var(--color-fg-brand-default…)`) ship in `@layer utilities`, and the `.eg-link` marker-rule count still equals the legacy bundle's, so Link adds no marker rule. `assertLinkCSS` passes on the shipped, the emitted and the Tailwind-consumer CSS in both packed consumers (14/14). Browser: `quiet` computes white at rest and on hover, `border-bottom-width` and `padding-bottom` `0px`, `text-decoration-line` `underline`, so the legacy `.eg-link` colour, hover colour, border and `text-decoration: none` do not paint | none |
| AC-12 | **Pass** | `storybook-controls.test.ts` options `['plain', 'underlined', 'quiet']` (control `select`, `args` `{}`, `ownPropCounts.link` stays 6); `storybook-docgen.test.ts` description matches `/quiet/` and not `/only treatment/`, `/`underlined` is deprecated/` and `@default plain` unchanged, and the ten story names are pinned. Browser, in the real manager: the `variant` row is a `<select>` with `Choose option…` (unset, no injected `args=`), then `plain`, `underlined`, `quiet`; choosing `quiet` adds `args=variant:quiet` and the preview link takes the quiet ink. The Docs row lists the new description, the three values and the default `"plain"` | none |
| AC-13 | **Pass** | `prop-naming.json`: the Link `visual-treatment` usage type is `LinkVariant ('plain' \| 'underlined' \| 'quiet')` and all five Link revisions carry `types.ts` `38f79b26…`; `props:docs`, `props:check` and `test:props` 135/135 are green; the artifact test pins the `variant` description, the per-variant recipe literals and the `quiet` anatomy key; `design-system.json` is 610,554 bytes against the 786,432-byte budget; the catalog row is regenerated | none |
| AC-14 | **Pass** | The Footer, NowCard, CommunityCard and ProjectCard suites ran unmodified and green (229/229 with the six other callers); `git diff --stat` over `packages/tokens`, `packages/cli`, `packages/effects`, `packages/mcp/src`, `packages/ui/src/styles`, `packages/ui/src/index.ts`, `Link.tsx`, Link's `index.ts`, the Footer, NowCard, CommunityCard and ProjectCard folders and `.storybook` is empty | Footer's own adoption of `quiet` belongs to the Footer v0.4 lane |
| VIS-01 to VIS-04 | **Not evaluated** | No expected design exists and no capture was adopted. The browser run produced scratch PNGs that are **not committed**. | Visual conformity stays Not evaluated until the owner adopts exact hashes |

## 2. Test-first record

| Step | RED observed | GREEN observed |
| --- | --- | --- |
| PRESERVE pin (literal v0.4 set) | none expected: 1 passed with the other 29 filtered out, on the unchanged implementation | stays green: Link folder 30/30 |
| `quiet` unit cases (types, set, groups, hover, focus, three semantics cases, runtime values, merge, contrast) | 11 failed, 19 passed (the 18 existing cases and the PRESERVE pin): `expected [ … ] to include 'text-fg-default'`; `quiet text colour: expected [ 'text-link-default' ] to deeply equal [ 'text-fg-default' ]`; `quiet emits no decoration-* colour utility` | 30/30 |
| Controls options, docgen description, story names | 3 failed: options `[ 'plain', 'underlined' ]`; description still said "only treatment"; seven stories instead of ten | 3 files 464/464 (451 baseline + 12 Link cases + 1 story-name case) |
| Registry | `Stale evidence revision: packages/ui/src/atoms/link/types.ts` (exit 1) right after the `types.ts` edit; then `Prop naming view is stale` after the JSON edit | `props:docs`, then `props:check` valid and `test:props` 135/135 |
| Artifact assertion | `The input did not match the regular expression /quiet/` against the base artifact | `pnpm build` regenerated the artifact; `test:artifact` 57/57 |
| Emitted CSS and SSR (`package-exports`) | on a build of the unchanged tree: `Missing emitted CSS block /\.decoration-fg-brand-default\s*\{/` and `Quiet Link SSR must render text-fg-default` | 143/143 |
| Packed consumers | on a base build: 12 failed, 2 passed of 14: `consumer.ts(2395,7): error TS2322: Type '"quiet"' is not assignable to type 'LinkVariant'` and `Missing Link utility .decoration-fg-brand-default` | 14/14 |

The base build for the packed-consumer RED was made by temporarily writing the two base sources (`git show HEAD:…`) over `types.ts` and `useLink.ts` (backed up first), running `pnpm build` and the harness, then restoring both from the backup. The restored files were checked byte-identical (`cmp`) and by digest (`38f79b26…`, `e673e894…`), the five registry revisions still matched, and a final `pnpm build` returned the generated artifact to its current shape.

**Differential (PRESERVE, shared code).** The hook and `linkVariants` feed every Link caller, so one scratch check ran the base files (`git show HEAD:…`) and the changed files in one process, rendering the hook's whole output the way `Link.tsx` does (Icon stubbed identically) for `variant` omitted, `plain` and `underlined` × native and `asChild` × `arrow` on and off × `external` on and off × with and without a consumer `className` × with and without `rel`: 96 renders. After normalizing each `class` attribute to its sorted token set the base and the change are **identical in all 96** (0 differences); the arrow class string is byte-identical. The root class *string* differs in all 96, which is the intended reordering. On the changed side `quiet` against `plain` adds `decoration-fg-brand-default` and `text-fg-default` and removes `text-link-default`, nothing else.

## 3. Browser observation (D2)

**Method.** A static `pnpm storybook-build` of the working tree, served from loopback with `python3 -I -m http.server` and read in Chrome for Testing 153.0.8010.12 over the DevTools protocol: viewport 1280 × 900, device scale 1, dark Grafito canvas `rgb(20, 21, 24)`, Barlow from the Google Fonts import in `.storybook/preview.css` (`document.fonts.ready` awaited; faces load per unicode range), default motion plus a `prefers-reduced-motion: reduce` pass, a held real pointer (`Input.dispatchMouseEvent`), a real Tab key, and 800 ms before each hover reading so the 200 ms colour transition has finished. The browser was launched with `--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4`, which makes `(hover: hover)` and `(pointer: fine)` true (see F1). Stories: `atoms-link--quiet`, `--default`, `--underlined`, `--states`, `--quiet-in-card-footer`, `--quiet-on-surfaces`, `atoms-ambientbackground--read` and the manager at `?path=/story/atoms-link--default`.

| Observation (computed style) | `quiet` | `plain` / `underlined` / `States` (v0.4) |
| --- | --- | --- |
| Rest: `color`, `text-decoration-line`, `text-decoration-color` | `rgb(255, 255, 255)`, `underline`, `rgb(255, 0, 54)` | `rgb(255, 0, 54)`, `underline`, `rgb(255, 0, 54)` |
| Rest: `border-bottom-width`, `padding-bottom` | `0px`, `0px` | `0px`, `0px` |
| Rest: size, weight, line height, underline offset | 11.2px, 600, 13.44px, 3.2px | 11.2px, 600, 13.44px, 3.2px |
| Hover: `color`, line, decoration colour | `rgb(255, 255, 255)` (legacy hover colour does not paint), `none`, unchanged | ink unchanged, `none`, unchanged |
| Hover: arrow translate and x shift | `3.2px`, +3.200 px | `3.2px`, +3.200 px |
| Focus (real Tab): `:focus-visible`, `box-shadow`, `outline-style` | true, equals the `--shadow-focus` token (`rgb(20, 21, 24) 0px 0px 0px 2px, rgb(255, 0, 54) 0px 0px 0px 4px`), `none` | same |
| Reduced motion, hover: arrow translate, x shift, arrow and root `transition-property` | `none`, 0.000 px, `none`, `none`; the underline is still removed (an instant change) | not re-run |

At device scale 1 the quiet underline renders as one crisp pixel row of pure neon (mean row colour 254 to 255, 0, 54) in `Quiet` and in the card footer. The `quiet` link has the same size, weight and line height as `plain`, so switching variant does not change the type step.

**Contrast from sampled pixels (AC-10).** Each link was hidden, its padded box screenshotted and the lightest backdrop pixel taken (the worst case for light ink and a neon underline); ratios use the link's computed `color` and `text-decoration-color`.

| Backdrop | Lightest sampled pixel | `quiet` ink | `quiet` underline | `plain` text, for comparison |
| --- | --- | --- | --- | --- |
| surface-0 (and the card's footer band) | `rgb(20, 21, 24)` | 18.26 | 4.61 | 4.61 |
| surface-1 | `rgb(27, 28, 32)` | 17.02 | 4.30 | 4.30 |
| surface-2 | `rgb(35, 36, 40)` | 15.50 | 3.92 | 3.92 |
| surface-3 | `rgb(45, 46, 51)` | 13.55 | 3.42 | 3.42 |
| `bg-surface-0/50` band over `AmbientBackground` (`profile=read`, `opacity=0.6`), 40 frames over 10 s, two runs | `rgb(50, 18, 25)` and `rgb(38, 17, 21)` | 16.99 and 17.90 | 4.29 and 4.52 | not measured |

The first four rows equal the token arithmetic exactly. The last row answers the one question tokens cannot: the grafito band over the particle layer. No existing story combines the two (the Footer's `register` prop is Footer v0.4), so the backdrop was **composed at measurement time** from production utilities (the same `bg-surface-0/50` class `SectionShell` uses, over the real particle layer at the director's `read` profile and 0.6 opacity) with the quiet link's emitted class list injected into it. The lowest values over both runs are ink 16.99:1 and underline 4.29:1, above 4.5:1 and 3:1. This is a measurement for the Footer and host contract (spec sections 4 and 5), not a promise of this spec.

## 4. Findings

- **F1 — stock headless Chrome has no hover capability.** The first run, with default flags, showed the hover underline removal and the arrow translate inert on every variant, `plain` included, while `:hover` matched: Chrome reports `(hover: hover)` and `(pointer: fine)` as false, and Tailwind v4 wraps every `hover:` utility in `@media (hover: hover)`. That was the measurement environment, not the product, and it contradicts no promise; the run was repeated with a desktop-mouse flag and all readings above come from that run. A consequence worth recording for OQ-3: on devices with no hover (touch) the underline of `quiet`, and of `plain` since v0.4, never disappears, so the non-colour cue is permanent there.
- **F2 — the artifact does not carry registry usages.** The plan expected the five Link usages (type and revision) to appear in `design-system.json`; its `propNaming` entries hold only `{id, name, status, components}`. The artifact therefore changed in exactly three paths: the `variant` description, the `linkVariants` recipe strings and the `quiet` anatomy key (sharing the `pb-0` fact, index 196, with `plain`). The base string no longer lists `text-link-default`, and the three inline recipe literals are published (the plan's G5 held: the builder does not follow constants).
- **F3 — `max-w-sm` is inert in this theme.** The first draft of `QuietInCardFooter` capped the card with `max-w-sm`, but the theme resets Tailwind's default `--container-*` scale, so no rule exists and the card spanned the canvas; seen in the browser. The story uses `max-w-120` (`calc(var(--space-1) * 120)`, 384 px), a spacing-derived utility already in use elsewhere.
- **F4 — changelog citation.** Both entries cite `Refs #562`, as the plan's D3 recommends and the owner approved ("Aprobar los 10 (Recomendado)"), because the footer half ships with Footer v0.4, whose plan carries the resolving `(#562)`. The log line of L6 mentions `(#N)` citations in general. If `(#562)` is wanted here, change both entries and drop it from the Footer entry. The system entry's wording differs from the plan's draft only to say precisely that the shared `linkVariants` base lost `text-link-default`.
- **F5 — slice boundary in one file.** `storybook-docgen.test.ts` holds both a slice-1 assertion (the `variant` description) and a slice-2 one (the story names, which need the stories). Committed whole in slice 2, every slice stays green; the description assertions then land one commit later than the plan's table says.
- **F6 — `mcp` README digest drift, as predicted.** After `system.md` changed, `pnpm test:mcp` failed 4 of 20 tests on the `get_design_system_md` complete-text digest; `pnpm mcp:readme` changed that one line (`f92eedb2…` to `16846ea6…`) and the suite is 20/20. `packages/mcp/README.md` is outside the plan's section 2 list but inside the delegated surfaces, and the plan expected this fix.
- **F7 — test block size.** `Link.test.tsx` grew by 360 lines, not the plan's ≈ 260, after Biome's formatter wrapped the new helpers; the whole change is +562 / −44 lines over 19 files before this file.

## 5. Checks on the final tree

From the repository root, in the foreground, one at a time.

| Command | Exit | Result |
| --- | --- | --- |
| `pnpm exec vitest run packages/ui/src/atoms/link packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2 --no-cache --configLoader runner` | 0 | 3 files, 464/464 |
| the ten caller folders (Footer, Closing, Hero, LiveBand, NowStrip, Notice, CommunityCard, ModuleCard, NowCard, ProjectCard) | 0 | 10 files, 229/229, unmodified |
| `pnpm exec vitest run packages/ui/src/lib/cn.test.ts packages/ui/src/lib/storybook-css.test.ts …` | 0 | 2 files, 102/102 |
| `git diff --stat -- <untouched paths of the plan's section 8>` | 0 | empty |
| `pnpm typecheck` | 0 | root `tsc --noEmit` plus tokens, cli, mcp, ui and effects |
| `pnpm lint` | 0 | 1097 files, no fixes (one formatter correction to the new test block, `biome format --write` on that file) |
| `pnpm props:docs`, `pnpm props:check`, `pnpm test:props` | 0, 0, 0 | view regenerated; registry valid; 135/135 |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | 0 | 119 rows; only Link's row changed in `CATALOGO.md` and `catalog.json` |
| `pnpm build` | 0 | regenerates the tracked artifact (system's build runs `build-artifact --write`); idempotent on the final tree |
| `pnpm system:docs`, `pnpm artifact --check`, `pnpm system:check` | 0, 0, 0 | `system.md` +3 −2; no drift, also after the last `pnpm build` |
| `pnpm test:artifact`, `pnpm test:system` | 0, 0 | 57/57, 36/36 |
| `node --test scripts/storybook-mcp-contract.test.mjs` | 0 | 26/26 |
| `pnpm test` | 0 | 153 files, 3712/3712 |
| `pnpm test:package-exports` | 0 | 143/143 |
| `EGDEV_CONSUMER_OFFLINE=1 pnpm test:package-consumption` | 0 | 14/14: React 18.3.1 and 19.3.0, tokens and UI CSS shipped, no Tailwind compiler in the application path |
| `pnpm test:package-release` | 0 | 25/25 (changelog structure) |
| `pnpm test:mcp` | 1 then 0 | 4 README tests failed before `pnpm mcp:readme` (F6); 20/20 after |
| `pnpm test:cli` | 0 | 241/241 |
| `pnpm storybook-build` | 0 | built twice (before and after F3), 16 MB, gitignored `storybook-static` |

Not run: `pnpm test:tokens`, `pnpm test:storybook-mcp` (beyond its contract file above), `pnpm test:package-pilot`, `pnpm test:mcp:packed`, `pnpm test:cli:consumer` and `pnpm release:pack`, which this change does not touch or which are release steps.

## 6. Proposed commit grouping (parent-owned)

Conventional Commits, English, each body `Refs #562`, never `Closes`.

1. `feat(ui): add the Link quiet variant (#562)` — `packages/ui/src/atoms/link/types.ts`, `useLink.ts`, `Link.test.tsx`; `packages/ui/src/lib/storybook-controls.test.ts`; `skills/_shared/prop-naming.json`, `docs/prop-naming.md`.
2. `feat(ui): add the Link quiet stories and packed-build checks (#562)` — `packages/ui/src/atoms/link/Link.stories.tsx`; `packages/ui/src/lib/storybook-docgen.test.ts` (F5); `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs`.
3. `chore(integration): refresh the Link artifact, catalog row and changelogs (#562)` — `packages/system/design-system.json`, `packages/system/system.md`, `packages/mcp/README.md` (digest), `scripts/design-system-artifact.test.mjs`, `scripts/catalog_data.py`, `docs/CATALOGO.md`, `docs/catalog.json`, `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md`.
4. `docs(link): record the v0.5 implementation evidence (#562)` — this file.

`pnpm artifact --check`, `pnpm system:check` and `pnpm test:mcp` are stale between commits 1 and 3 (the plan's note); fold commit 3 into commit 1 if every commit must be artifact-fresh.

## 7. Remaining work

- `FooterNavigation` adopting `quiet`, the `(#562)` resolving citation and Footer's own contrast over its real grafito backdrop belong to the Footer v0.4 lane (spec OQ-5).
- The odd log update (L6 follow-up) is parent-owned.
- Captures VIS-01 to VIS-04 and the publication of the v0.5 snapshot on #61 each need their own authorization; none was requested here.

## 8. Not evaluated

Visual conformity against an approved expected design (VIS-01 to VIS-04); screen-reader behavior; browsers other than Chromium 153; real touch hardware (only the emulated hover and fine-pointer capabilities); forced-colors and Windows high-contrast rendering of the underline; the real Footer and the website's own backdrop (the particle measurement is a composed fixture sampled over two 40-frame runs, not an exhaustive search); the consumer website's code against the widened `LinkVariant` union; and any behavior of `FooterNavigation`, which this lane does not touch.
