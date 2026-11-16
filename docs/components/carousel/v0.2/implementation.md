# Carousel v0.2 implementation evidence

## Authority and scope

- The [approved full-width track amendment](full-width-track-amendment.md) extends the [v0.1 implementation](../v0.1/implementation.md) for [#420](https://github.com/egdev6/egdev-design-system/issues/420). The canonical UTF-8 payload from `## 1. Purpose and scope` through EOF has SHA-256 `8131baabcb03bb4146dcc6c5e601694ff68ad8ef905571257812f6e3f4178d53`; the amendment header remains unchanged pending publication.
- The separately approved implementation plan is [task T1, S1–S9](../../../../odd/tasks/carousel-full-width-track.md). The owner selected the inline union and a 2px inward outline; this evidence is not independent review or visual approval.
- The existing six component roles and public export inventory remain unchanged. **No stylesheet**, extra module, token or dependency was added.

## Implementation

`trackLayout` defaults to `default` and is consumed before native props are forwarded. The existing padded, gapped track and outward focus shadow remain the default. The opt-in `full-width` track uses zero gap and padding, keeps horizontal native scrolling and mandatory snap, and hides the scrollbar with standards-based and WebKit utilities. Full-basis slides retain center snapping; their focus outline uses the existing focus-width and focus-ring tokens with an inward offset. The hook's alignment, settlement, listeners and drag coordination are unchanged.

The [naming registry](../../../../skills/_shared/prop-naming.json) records the approved `carousel-track-layout` convention and one reviewed `CarouselProps` usage, bound by the [approval record](prop-naming-approval.json) to the owner's naming and plan choices. All nine Carousel usages carry the reviewed `types.ts` whole-file SHA-256 `a0915fe671071fc7c372acd0bfdfa525ade5628ff65d50e076784b39268acda9`. This does not change other conventions or imply broader approval.

Storybook adds `FullWidth` and `FullWidthNarrow` without manual `argTypes` or `play` functions. Real docgen and the registered Controls pipeline cover the inline union, select options and constant default; actual browser widgets remain a separate check. The package fixtures add typed positive and negative cases, full-width SSR and emitted CSS assertions; they were not executed by this worker.

## Observed test-first evidence

- **RED:** `pnpm exec vitest run packages/ui/src/molecules/carousel packages/ui/src/lib/carousel-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner` exited 1 before implementation: 7 failed, 530 passed. The full-width root leaked `tracklayout`, the track retained `gap-7 p-2`, docgen and Controls had no layout property, and the WebKit scrollbar utility was absent.
- **GREEN:** the same command exited 0 after implementation and test formatting: 545 tests passed across 5 files. Both layouts cover directional keys, scroll settlement, controlled rejection, drag commit/cancel, native touch/pen input, empty/invalid/single and dynamic collections, no autoplay and resize. The original WebView2 synchronous-listener and sub-pixel drift regressions remain unedited and pass, alongside new full-width counterparts. DOM geometry doubles do not establish browser layout.
- The focused preview CSS check builds the actual preview entry in memory and checks the emitted track, scrollbar and inset-focus utilities. This is utility-emission evidence, not computed layout or pixel parity.
- `pnpm props:docs && pnpm props:check && pnpm test:props` exited 0: the generated view is current and all 121 registry tests passed.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` exited 0 and regenerated both catalog outputs (115 rows).
- `pnpm typecheck` exited 0 for the root and all workspace typecheck scripts.
- Biome initially reported formatting and a block-style diagnostic; those were corrected, and a focused check of the changed code passed. The parent owns full-suite, build, package-export and packed-consumer runs.

## Remaining verification

In Chrome, Edge/WebView2 and Firefox, check the wide and narrow stories at responsive widths, fractional scaling and 200%/400% zoom: exactly one unclipped slide at rest, center alignment, zero gaps/padding, hidden scrollbar with working native scroll and dragging, LTR/RTL keys, controlled rejection, resize and sub-pixel listener behavior. Verify inset focus visibility and clipping, forced colors, reduced motion, accessibility tree and announcements, and actual Controls widgets. Verify WebKit scrollbar behavior in a supported WebKit browser separately. The parent must run the production CSS/package checks and React 18/19 packed consumers.

VIS-01 and VIS-02 expected-design sources, comparable conditions and visual approval remain pending. A real implementation capture is required before merge; none was produced by this worker. Visual conformity: **Not evaluated**.

## Parent browser verification (2026-11-16)

Real browsers against the local Storybook (`molecules-carousel--full-width`, `--full-width-narrow`, and `--default` for preservation). No defects were found, so no fixes were needed.

| Check | Chrome 157 (Playwright MCP) | Edge 157 (headless CDP, device scale 1 and 1.25) | Firefox 160 (WebDriver BiDi) |
| --- | --- | --- | --- |
| Slide width equals the track width; no neighbor peeks (1280/640/320px) | Pass (1248/608/288px) | Pass (608/288px) | Pass (640/320px) |
| Track `gap` and padding are `0px` | Pass | Pass | Pass |
| No visible scrollbar (`offsetHeight - clientHeight` = 0, `scrollbar-width: none`) | Pass | Pass | Pass |
| Snap after Next, ArrowRight and Home lands on `index × track width` | Pass | Pass (±1px narrow-host rounding of a 230.4px slide in a 230px `clientWidth`) | Pass |
| RTL (`dir="rtl"` host): same snap positions | Pass | Not run | Not run |
| Inset focus outline (owner: "Outline hacia adentro de 2px"), no outward shadow | Pass with real keyboard (`:focus-visible`, slide inside the track) | Pass (`solid 2px`, offset `-2px`) | Pass, owner manual check 2026-11-17 ("está OK"; automation has no OS focus) |

The default layout is unchanged (Chrome: `gap` 22.4px, padding 6.4px, native scrollbar). Device scale 1.25 reproduces the WebView2 condition of #405; alignment stays exact with the #407 absolute tolerant `scrollTo`.

### Captures

| File | SHA-256 |
| --- | --- |
| `captures/vis-01-full-width-keyboard-focus-chrome-640.png` | `6e8941109c67171626974a3741b535b93306e850471584fd23092a3768cd181c` |

Implementation capture (Chrome 157, device scale, 640px, real keyboard focus on slide 2), not an approved expected-design reference. Forced colors and reduced motion were **not evaluated** in a browser.
