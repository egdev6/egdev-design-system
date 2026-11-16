# Tabs v0.2 implementation evidence

## Authority and scope

- Base: [Tabs v0.1 implementation evidence](../v0.1/implementation.md) and its approved contract. The [v0.2 amendment](full-width-wrap-amendment.md) adds opt-in segmented layout only; its canonical payload SHA-256 is `af73ca54a852f140489890784a6751eaf5f31bc52196d7938dd07f35748cf280`, recorded in the amendment header. Payload sections retain their historical pending language; the later approved plan resolves the width, alignment, overflow and shared-ID choices.
- Plan: [Tabs full-width / label-wrap task](../../../../odd/tasks/tabs-full-width-wrap.md), T1, T1b and owner choices in L1 and L3. This delegated implementation is not independent review or a new visual approval. Request: [#414](https://github.com/egdev6/egdev-design-system/issues/414); the canonical component issue remains #107.
- The existing six-file architecture and public exports remain. **No stylesheet, internal module, token or dependency was added.** The segmented list still composes the existing Surface well; active and focus recipes, Radix interaction, legacy CSS and public root remain.

## Implemented behavior

`fullWidth` and `labelWrap` are independent optional booleans, default false, consumed before Root props. Both are no-ops for underline. Full-width segmented lists stretch to the root, center unwrapped labels and expose horizontal overflow without hiding the scrollbar. The task's L2 browser check found that `auto-cols-fr` compiles to `minmax(0, 1fr)` and squeezes labels instead of scrolling; `auto-cols-[1fr]` gives equal columns when they fit and preserves intrinsic label widths when overflowing. The owner accepted unequal widths only during overflow (L3). Wrapped segmented labels use normal whitespace, `wrap-anywhere`, logical-start text and content alignment, and token-derived vertical padding; counters remain nowrap. When both are true, start alignment wins. No trigger minimum width or balanced text is introduced. Omitted and explicit false retain the old recipe.

For full-width segmented lists, a focused tab in a horizontally overflowing list requests `scrollIntoView` with nearest block/inline alignment and `behavior: 'instant'`; absence of the method is safe. Radix still owns focus, keyboard and selection. The list uses `p-1.5` and logical `scroll-px-1.5` to reserve space at the scrollport edges for its existing focus ring: with the current `--space-1` of 3.2px, these are 4.8px, compared with the 4px outer shadow. The previous `p-0.75` was 2.4px. This change is limited to the full-width segmented recipe; real-browser ring visibility and edge clipping still require verification.

Radix roving focus 1.2.0 schedules keyboard focus through `focusFirst`, whose `preventScroll` default is `false`; jsdom confirms `{ preventScroll: false }` for both full-width segmented and underline End navigation. Thus `preventScroll: true` is not the demonstrated cause, and the exact Chrome failure mechanism remains unconfirmed. Underline uses the same Radix path and can scroll horizontally, but no real-browser underline reproduction was performed here; its classes and focus behavior are unchanged.

The [naming registry](../../../../skills/_shared/prop-naming.json) applies approved `tab-list-full-width` / `fullWidth` and shared `control-label-wrap` / `labelWrap`, with no aliases or exceptions. The [approval record](prop-naming-approval.json) records the forwarded owner statements, not native review authority. The only new implementation usages are Tabs; Button usage remains separately scoped. Existing Tabs usage evidence was refreshed against `packages/ui/src/molecules/tabs/types.ts`, whole-file SHA-256 `fd20f659bae88d8588701a7d85f1171ee80a2469d1d9deebf2911701d32eb9c2`.

Storybook adds `FullWidth`, `LabelWrap` and `FullWidthLabelWrap`; the latter two use a narrow host and long labels, including unbroken text. No manual `argTypes` or `play` functions were added. Real docgen plus the registered Storybook extraction/enhancer/inference pipeline check both optional boolean controls and defaults; actual browser widgets remain unevaluated.

## Test-first evidence

- **RED:** the authorized focused Vitest command failed with 9 tests failing and 407 passing across five files. Failures included unknown DOM prop warnings, missing grid and wrapping classes, 13 rather than 15 own declarations, missing boolean controls and missing compiled `self-stretch`.
- **GREEN:** after implementation, the same command passed 416/416 tests across five files. The original 12 Tabs tests remained unchanged and passed; seven added Tabs tests cover the four combinations, DOM forwarding, Surface, counts, underline invariance, keyboard/disabled behavior and controlled selection with both options on. The CSS test compiles the actual production entry in memory and verifies the new utilities, including `overflow-wrap: anywhere`; no fallback was needed.
- The first naming-registry check passed validation but its test suite exposed the old global registry count (`166 !== 164`). Updating the two count expectations for the two explicitly approved entries produced 118/118 passing tests. Historical receipt projections and the new scoped receipt remain independently checked.
- **T1b RED:** the focused command failed 2 tests and passed 273. The focused-tab test observed zero `scrollIntoView` calls after Tab + End; the focus-ring spacing test found the old `p-0.75` rather than the reserved scrollport space.
- **T1b GREEN:** the focused command passed 277/277 tests across four files after the focus fix and extended coverage for both `labelWrap` values, Home/End/arrows, Radix's non-preventing focus, fit/no-overflow, unchanged underline and intrinsic segmented behavior, event propagation and a missing `scrollIntoView`. The production CSS is compiled in memory and checked for the two new token-backed padding utilities. jsdom tests method calls and classes, not actual scroll geometry. An initial CSS test failed because jsdom rewrites `import.meta.url`; resolving the entry from the workspace root fixed it.

## Observed checks and boundaries

| Command | Observed result |
| --- | --- |
| `pnpm exec vitest run packages/ui/src/molecules/tabs packages/ui/src/lib/tabs-css.test.ts packages/ui/src/lib/tabs-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts --maxWorkers=2 --no-cache --configLoader runner` | GREEN: 5 files, 416 tests passed. The owner authorized cache-safe flags for RED and GREEN. |
| `pnpm exec vitest run packages/ui/src/molecules/tabs packages/ui/src/lib/tabs-css.test.ts packages/ui/src/lib/tabs-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2 --no-cache --configLoader runner` | T1b GREEN: 4 files, 277 tests passed. |
| `pnpm typecheck` | Passed. |
| `pnpm exec biome check packages/ui/src/molecules/tabs/Tabs.stories.tsx packages/ui/src/molecules/tabs/Tabs.test.tsx packages/ui/src/molecules/tabs/types.ts packages/ui/src/molecules/tabs/useTabs.ts packages/ui/src/lib/tabs-docgen.test.ts packages/ui/src/lib/tabs-css.test.ts packages/ui/src/lib/storybook-controls.test.ts scripts/package-consumption.test.mjs scripts/prop-naming.test.mjs scripts/catalog_data.py` | Passed after correcting the initial formatting and explicit-boolean diagnostics; 9 supported files checked. |
| `pnpm exec biome check packages/ui/src/molecules/tabs/Tabs.stories.tsx packages/ui/src/molecules/tabs/Tabs.test.tsx packages/ui/src/molecules/tabs/types.ts packages/ui/src/molecules/tabs/useTabs.ts skills/_shared/prop-naming.json docs/prop-naming.md docs/components/tabs/v0.2/implementation.md` | T1b: passed after correcting a test-formatting diagnostic; 5 supported files checked. |
| `pnpm props:docs && pnpm props:check && pnpm test:props` | Passed after the count correction and T1b source refresh: generated view current, registry valid, 118 tests passed. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Passed; generated 115 catalog rows and both catalog outputs. |

Packed-consumer fixtures now include typed positive/negative props, shipped utility checks and a combined SSR case, but the package build and consumer matrix were **not run** in this worker. The parent owns full test/build/package checks and real-browser layout, overflow, LTR/RTL keyboard/focus, forced-color and Controls verification. VIS-01 and VIS-02 expected references and comparable conditions remain pending. Visual conformity is **Not evaluated**; DOM classes and in-memory CSS compilation do not establish browser geometry or pixel parity.

## Parent browser verification (2026-11-16)

Real browsers against the local Storybook (`pnpm storybook`, stories `molecules-tabs--full-width`, `--label-wrap`, `--full-width-label-wrap`). Each finding was fixed test-first before re-checking.

| Finding | Fix | Evidence |
| --- | --- | --- |
| Tailwind v4 `auto-cols-fr` compiles to `minmax(0, 1fr)`: at a 150px viewport triggers were squeezed and the list never scrolled. | `auto-cols-[1fr]` (plain `1fr`): equal columns whenever labels fit; when they do not, each column keeps at least its label width and the list scrolls. The owner accepted unequal widths only while overflowing. | Chrome 157: equal 327.5px columns at 640/1024px; overflow `scrollWidth` 176–180 > `clientWidth` 117–131 at narrow hosts. |
| Keyboard focus could leave the focused tab outside the scrolled list (AC-04). | Focus reveal on the list plus `p-1.5 scroll-px-1.5` ring clearance (T1b). | Chrome 157 and Edge 157 (headless CDP, `document.hasFocus()` true): End/Home/ArrowLeft keep the focused tab and its full ring in view (`scrollLeft` 63–64 / 0). Firefox 160: confirmed manually by the owner (automation cannot give the window OS focus, so no focus events fire there). |
| The overflow scrollbar used the system look (thick, arrow buttons) and did not match the system styles. | Blink/WebKit `::-webkit-scrollbar` recipe (6px, transparent track, rounded `--color-border-control` thumb, `--color-fg-muted` on hover, no buttons); standard `scrollbar-width: thin` + `scrollbar-color` only under `@supports not selector(::-webkit-scrollbar)` for Firefox (Chromium 121+ ignores the pseudo-elements once the standard properties apply). | Chrome 157 / Edge 157: thin rounded thumb, no arrows. Firefox 160: `scrollbar-width: thin`, token color. |
| With `fullWidth` + `labelWrap` in a narrow host, `wrap-anywhere` collapsed column min-content and split ordinary words letter by letter. | That combination uses `wrap-break-word`: words stay whole and a long word widens its column, which then scrolls. `labelWrap` alone keeps `wrap-anywhere` (no scroll container exists there). | Chrome 157 at the `w-48` story host: "Posts awaiting review" wraps by word; the long label widens its column and the list scrolls. |

### Captures

Captured with Playwright MCP (Chrome 157, device scale) and headless Edge 157 / Firefox 160 under the conditions named in each file.

| File | SHA-256 |
| --- | --- |
| `captures/vis-01-full-width-chrome-640.png` | `5d07abfd3241085e2660e709687f7e6869dac2e3f1836a2e6338a21a13fa5712` |
| `captures/vis-02-full-width-label-wrap-chrome-640.png` | `fd95e8690931e3b6649a0a5f8602bf7eaac43f9705aacdc304c1e066a4715574` |
| `captures/vis-02-label-wrap-chrome-640.png` | `5b44a543c8f17e96892ebb0bfa9c0558f4e06c516c5c3e24d4c1769d082b817d` |
| `captures/ac-04-full-width-end-focus-edge-150.png` | `c8bb667bac351c74020eb1862b9a75bd36a0452ba99d95aea23d0409891da13b` |
| `captures/scrollbar-full-width-firefox.png` | `60b93e1dcd4b4d035b3baa69b689cf7ef9b9f7cf7ac51014401d10b400315533` |

These are implementation captures, not approved expected-design references (none existed for v0.2). RTL, forced colors and reduced motion were **not evaluated** in a browser.
