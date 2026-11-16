# Carousel trackLayout full-width (#420)

Implement the approved Carousel v0.2 amendment `docs/components/carousel/v0.2/full-width-track-amendment.md` (Approved 2026-11-16) per the owner-approved plan below. Branch `feat/carousel-full-width-track`, one PR, Closes #420. Roadmap #427, milestone #14. Reference evidence/flow: PageHeader v0.2 and Tabs v0.2 implementation docs.

## Specs

- S1: `CarouselProps` gains `trackLayout?: 'default' | 'full-width'` with the union inline (owner: "No, union inline en la prop" — no new public export; export inventory unchanged), English JSDoc, `@default default`, `@control select`. `useCarousel.ts` destructures `trackLayout = 'default'` so it never reaches the root DOM.
- S2: `carouselTrackVariants` becomes variant-based: shared base `flex min-w-0 overflow-x-auto snap-x snap-mandatory scroll-auto group-data-[state=dragging]:snap-none group-data-[state=dragging]:cursor-grabbing`; `default`: `gap-7 p-2` (output identical to v0.1); `full-width`: `gap-0 p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`. Scrolling stays enabled (`overflow-x-auto`); slides keep `basis-full snap-center`.
- S3: `carouselSlideVariants` gets a `trackLayout` variant: `default` keeps `focus-visible:shadow-[var(--shadow-focus)]`; `full-width` uses an inset outline (owner: "Outline hacia adentro de 2px"), Timeline recipe: `focus-visible:outline-solid focus-visible:outline-(length:--focus-width) focus-visible:outline-focus-ring focus-visible:-outline-offset-(--focus-width)`.
- S4: `useCarousel` alignment logic is unchanged: absolute tolerant `scrollTo` (#407), `latest` handler ref (#406), drag `scrollBy`, listener effect.
- S5: Tests first (RED observed before GREEN), via the public interface: R1 default/omitted keeps `gap-7 p-2`, no hiding utilities, outward focus shadow; R2 full-width `gap-0 p-0`, slides `basis-full snap-center`; R3 both hiding utilities plus `overflow-x-auto`; R4 full-width slide inset outline, no outward shadow; R5 no `tracklayout` root attribute / no console error; R6 keyboard LTR/RTL, settle-once, controlled rejection, drag commit/cancel, empty/single parameterized over both layouts. Preservation: geometry mock, resize realign, WebView2 synchronous-listener and sub-pixel drift tests unchanged and green, plus a full-width variant of the last two.
- S6: Docgen/controls (`carousel-docgen.test.ts`: declarations 16→17, `@default` allowed only on `trackLayout`, select options; `storybook-controls.test.ts`), CSS/package tests (`package-exports.test.mjs`, `package-consumption.test.mjs` `assertCarouselCSS`, typed positive + `@ts-expect-error trackLayout: 'edge'`, SSR full-width sample). Stories `FullWidth`, `FullWidthNarrow`; usage guideline sentence; no argTypes/play.
- S7: Registry: new approved convention `carousel-track-layout` (`trackLayout`) with approval record `docs/components/carousel/v0.2/prop-naming-approval.json` (owner: "Aprobar las cuatro", odd/tasks/nexo-adoption-m1-specs.md L5; plan L1 below); refresh all Carousel whole-file revisions; update registry counts in `scripts/prop-naming.test.mjs`; regenerate with `pnpm props:docs`.
- S8: Catalog row (`scripts/catalog_data.py`) mentions v0.2 (#420); regenerate both outputs. Evidence doc `docs/components/carousel/v0.2/implementation.md`; record the amendment content SHA-256 in its header.
- S9: No stylesheet, no new module, no tokens, no dependencies. English artifacts.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1–S9 | gentle-ai-worker | — |
| T2 | S2–S4 | parent: Chrome/Edge/Firefox checks + captures | — |
| T3 | all | parent: full checks incl. package consumption, commit, PR | — |

## Log

- L1 (owner, verbatim choices on the plan): "Outline hacia adentro de 2px"; "No, union inline en la prop"; "Aprobar e implementar".
- L2: Browser checks (Chrome; Edge at device scale 1 and 1.25; Firefox) found no defects: slide = track width, gap/padding 0, no scrollbar, exact snap after Next/ArrowRight/Home, inset focus outline (Chrome real keyboard, Edge). Firefox keyboard focus pending the owner's manual check.
- L3 (owner, verbatim): "está OK" — Firefox manual keyboard check: slide fully visible, no scrollbar, inset focus outline on all four sides.
