# Carousel v0.1 implementation

## Contract and scope

- Contract: [issue #80](https://github.com/egdev6/egdev-design-system/issues/80), v0.1, read with every comment.
- Latest approval: [full-contract approval](https://github.com/egdev6/egdev-design-system/issues/80#issuecomment-6251492326).
- Canonical contract SHA-256: `82955b98cd5fffb79502397980ca60a29fab336ecc021550765ba18cca899d1d`.
- Implementation authorization: parent task T11, S1–S4, and the explicit instruction to proceed after clarifying validation ownership. The issue's contract approval is not a runtime, implementation-plan, token or dependency certification.
- Destination: `packages/ui/src/molecules/carousel/`, Storybook `Molecules/Carousel`.
- Public runtime export: `Carousel`. Public types: `CarouselProps`, `CarouselItem`, `CarouselMessages`. Hooks, CVA helpers and fallback dictionary remain internal.
- Six meaningful files. **No stylesheet**, extra engine module, new dependency, token change or legacy TipsSlider migration.

S1 delivers the approved UI molecule; S2 adds no dependency. S3 was checked against the actual `origin/main` trees for IconButton, Icon, ProgressBar, VisuallyHidden and the story's consumer-owned Surface. S4 leaves commits, packed React 18/19 consumption, full gates, push and PR creation to the parent. No Storybook server, browser session or CI run was started.

## Decisions implemented

| Contract decision | Implementation and focused evidence |
| --- | --- |
| D1 | Shared manual navigation only; no product links, coverflow, halo, poster sizing or compact axis. |
| D2 | Native scrolling and bounded hook-owned keyboard coordination; no mismatched Radix selection primitive or engine dependency. |
| D3 | Full-width mounted slides, horizontal snap and token gaps; generated CSS checked separately from DOM classes. |
| D4 | Named `CarouselItem` entries with unique, non-empty stable identities and read-only React content. |
| D5 | Controlled acceptance and latched uncontrolled identity; initial fallback, reorder, removal and reintroduction tests. No callbacks for prop changes. |
| D6 | One slide tab stop, arrows/Home/End, no wrap or trap, and native Tab order. Descendant/prevented events are untouched. |
| D7 | Native disabled boundaries, control-focus retention, body-focus repair when a control becomes disabled, removal fallback and no outside-focus theft. Delayed controlled requests cannot steal focus from another control. |
| D8 | Mouse background/media threshold and pointer capture, text selection protection, cancellation/unmount release, native scroll settlement and controlled rejection alignment. Touch/pen/right-button input is not captured. |
| D9 | Immediate physical-geometry alignment with `behavior: 'instant'`; no owned decorative animation. The settlement fallback is 120ms input bookkeeping, never a rotation clock. |
| D10 | No autoplay, loop, interval or pause API. Idle, hover, focus and visibility events never advance slides. |
| D11 | Visible generated-id name, named slide groups, merged descriptions, independent localized messages and a separate initially empty polite status. Focus announcements suppress duplicate status updates. |
| D12 | Computed/inherited direction controls keys and icons; nearest-slide and alignment calculations use physical element centers, not RTL `scrollLeft` conventions. |
| D13 | Empty, invalid, single-item and three-digit totals tested. Invalid collections warn in development and render safely empty. Hidden/zero-width geometry and unsolicited `scrollend` do not request changes. |
| D14 | Structural unpainted layout; IconButton ghost/lg, decorative Icon and ProgressBar sm/default are composed unchanged. Surface appears only inside consumer story content. |
| D15 | Static per-part CVA in `types.ts`, `cn()` in the hook and JSX-only component. No stylesheet or public part overrides. |

## Naming and consumption

The existing approved registry conventions are reused without modifying their meanings, approvals or exceptions:

- `collection-items`: `CarouselProps.items`.
- `accessible-name`: root and item `label`.
- `primary-value`: root and item `value`.
- `initial-uncontrolled-value`: `defaultValue`.
- `interactive-value-change`: `onValueChange`.
- `localized-messages`: `messages`; nested dictionary keys remain component-specific.

`CarouselProps`, `CarouselItem` and `CarouselMessages` were reviewed in the actual `types.ts`. Eight implementation usages bind the reviewed whole-file SHA-256 in `skills/_shared/prop-naming.json`; the generated reference and historical-receipt test exclusions were updated. There are no speculative global naming approvals.

`className` supports root width, margins and layout placement only. It merges after the structural root recipe through `cn()`; this is not arbitrary appearance permission or a universal cascade guarantee. Slide children must not contain controls, links, extra tab stops, nested carousels or autoplay. Images need appropriate alternative text and stable dimensions. Do not simulate autoplay through periodic controlled values.

Storybook uses its existing all-level stories glob, an additive preview source and the central metadata enhancer. Tests inspect all 16 own item/dictionary/root declarations and the real docgen/extraction/enhancement/inference path. Optional defaults are not fabricated or injected into story args.

Package fixtures cover public type positives/negatives, SSR names and boundaries, CSR acceptance/focus/status and native/Tailwind consumer CSS. Both exact export inventories and the packed runtime-key inventory include Carousel. Packed fixtures are authored but **not executed by this worker**, per the parent's clarification.

## Verification

Strict test-first development was active:

- Initial RED: the behavior suite could not resolve the not-yet-created implementation.
- Behavioral RED observations: initial fallback changed identity on reorder; delayed controlled acceptance stole control focus; hidden/unsolicited scroll settlement requested the first item; intentional blur/removal and disabled-to-body focus required distinct recovery rules.
- GREEN: the focused Carousel suite passed 33 tests after these corrections.
- Triangulation: controlled rejection/acceptance, LTR/RTL, empty/invalid/single/large totals, selection/input exclusions, pointer cancellation/unmount and announcement suppression.
- Real metadata, installed Storybook pipeline and preview CSS checks passed alongside the focused component tests: **313 tests across five files**.
- `pnpm lint`, `pnpm typecheck`, `pnpm props:check` and `pnpm test:props` passed; the naming suite passed **87 tests**. Checks ran under a 2GiB memory cap.
- A single memory-capped `pnpm build` passed, followed by a single `pnpm test:package-exports`: **52 tests passed**. This verifies emitted CSS, SSR and both public export inventories, not packed compatibility.
- The first preview CSS run failed because `packages/tokens/dist/tokens.css` was absent. The authorized build supplied it; the exact focused five-file command then passed completely. No fallback, skip or fixture weakening was used.
- `pnpm props:docs` and `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` regenerated only their authorized views.

The parent owns packed-consumer execution and remaining full gates; fixture text is not React 18/19 compatibility evidence.

## Remaining evidence

**Visual conformity: Not evaluated.** No implementation capture or comparison replaced the approved VIS-01/VIS-02 references. VIS-01 remains scoped source evidence; no coverflow/photo/halo parity is claimed.

Browser Controls widgets, real native RTL/touch momentum, zoom/narrow-host focus visibility, reduced-motion rendering and assistive-technology announcements still require independent review. DOM geometry doubles and installed Storybook metadata tests are not browser, screenshot or screen-reader evidence.
