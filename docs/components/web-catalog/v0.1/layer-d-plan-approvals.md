# Layer (d) — plan approvals

Tracking: `odd/tasks/web-catalog.md` L31 and later entries.

## Batch 1 — SectionShell, TopBar, Footer (2026-11-03)

Owner decisions (verbatim):
- SectionShell plan: "Aprobar plan y gates (Recomendado)" — gates 1–6 resolved as recommended in the plan: the five register recipes, the host-composed group-edge fade, the naming conventions `section-register` / `register` and `section-content-wrap` / `wrap`, the sticky Lab escape excluded from v0.1, bounded local legacy neutralization, and VIS-01 adopted for the surviving four-register intent with its stated limitations.
- SectionShell tokens: "Aprobar los cuatro tokens (Recomendado)" — add exactly these values to `packages/tokens/src/theme.css` as part of the SectionShell implementation:

  ```css
  --gradient-section-show: radial-gradient(45% 55% at 22% 50%, var(--color-alpha-red-12), transparent 70%);
  --mask-section-fade-top: linear-gradient(180deg, transparent, #000 clamp(96px, 14vh, 180px));
  --mask-section-fade-bottom: linear-gradient(0deg, transparent, #000 clamp(96px, 14vh, 180px));
  --mask-section-fade-both: linear-gradient(180deg, transparent, #000 clamp(96px, 14vh, 180px), #000 calc(100% - clamp(96px, 14vh, 180px)), transparent);
  ```

- TopBar plan: "Aprobar plan y gates (Recomendado)" — G1–G4 resolved as recommended: the TopBar-local 900px container mechanism inside (not on) the fixed header, the existing-token glass overlay with solid reduced-transparency fallback and host-owned transparent state, and utility-only local legacy neutralization; each conditional on the emitted-CSS and browser proof the plan requires.
- Footer plan: "Aprobar plan y gates (Recomendado)" — gates 1–6 resolved as recommended: the inclusive `[@media(width<=860px)]:` breakpoint, token-backed hairline boundaries with host-owned background, local legacy neutralization, the existing registry entries `collection-items`, `accessible-name` and `heading-level`, and the stop condition if the unmodified `Link` cannot reach a 44px target.

Parent evidence before approval: a probe mirroring `packages/ui/src/styles/compiled.css` against the installed Tailwind 4.3.3 compiler showed that `md:` emits nothing, while `@container`, `@max-[900px]:`, `max-[520px|860px|1080px]:`, `[@media(width<=860px)]:`, a static `[clip-path:polygon(...)]` and `bg-fg-default/18` emit. `max-[X]:` and `@max-[X]:` compile to exclusive `width < X` ranges.

The following exact whole-file SHA-256 values pin the approved plans at merge commit `0ad7cf56383b8903dc9b882feaec8225fdf45b9c` (PR #303). Their Proposed headers are historical snapshot metadata; this record supplies implementation approval. Preserve these plan files unchanged.

| Component | Plan | Whole-file SHA-256 |
|---|---|---|
| section-shell | `docs/components/section-shell/v0.1/implementation-plan.md` | `0b62bfd213b8cca5337a616457e904f1d1059bbd52891ef61489b72a3b66fc2e` |
| top-bar | `docs/components/top-bar/v0.1/implementation-plan.md` | `cc6f23fae4b3f20336cc53e24e8b9860f81406d43eaee5df750678f4163283ab` |
| footer | `docs/components/footer/v0.1/implementation-plan.md` | `1009fa7b5879b44e4b9fd7b70dd572923be90aeaa346d5a169fbb58d36ebd5ce` |

## Batch 2 — NotesBoard, BlogGrid, NowStrip (2026-11-03)

Owner decisions (verbatim):
- NotesBoard plan: "Aprobar plan y gates (Recomendado)" — the inclusive `[@media(width<=1080px)]:` breakpoint, the token-based sticky offset `top-[calc(var(--nav-height)+var(--space-10))]`, the naming convention `board-sticky-side` / `sticky` and bounded local legacy neutralization. Topics stay a named list of static Chips (the approved contract), not ChipGroup.
- BlogGrid plan: "Aprobar plan y gates (Recomendado)" — the inclusive 1080px breakpoint, the `minmax(0,7fr)` / `minmax(0,5fr)` grid with rows stretching to the feature, no new naming convention, and bounded local legacy neutralization; each conditional on the Chromium proof the plan requires.
- NowStrip plan: "Aprobar plan y gates (Recomendado)" — its own inclusive `[@media(width<=860px)]:` breakpoint, the token-backed bottom hairline, the existing `accessible-name` entry, bounded local legacy neutralization, and the stop condition if NowCard footers cannot align without changing NowCard.

Parent evidence before approval: all 18 arbitrary or variant utilities listed by the three plans emit with the installed Tailwind 4.3.3 compiler (probe mirroring `packages/ui/src/styles/compiled.css`).

Whole-file SHA-256 values at merge commit `3ecc13f8862358269712dfaee45468ef271e4d22` (PR #304):

| Component | Plan | Whole-file SHA-256 |
|---|---|---|
| notes-board | `docs/components/notes-board/v0.1/implementation-plan.md` | `f70605329effcc833da4fa9f5e274df43525651321bdd2af45af85d40b034569` |
| blog-grid | `docs/components/blog-grid/v0.1/implementation-plan.md` | `da456d1a9d9a3264c65405c4bc5dff48c180fb157dcdf69887e5dd3613edb2bf` |
| now-strip | `docs/components/now-strip/v0.1/implementation-plan.md` | `9d2032d666912dcb35762f5f69aef66b16ce46d038fda0fbf67138411eb60117` |

## Batch 3 — Pixel, SectionNav, LiveBand (2026-11-03)

Owner decisions (verbatim):
- **Pixel plan:** "Aprobar plan y gates (Recomendado)". This approves:
  - the Pixel-only static `[clip-path:polygon(0_0,100%_33.8%,100%_100%,0_66.2%)]` with `w-2 h-3`;
  - the Pixel-only idle `bg-fg-default/18`, with no glow in any state;
  - the exact widening of the existing `consumer-selected-condition` entry (plan §4), keeping its ID and `state`;
  - bounded local legacy neutralization;
  - visual adoption of the surviving shape and state intent only.
- **SectionNav plan:** "Aprobar plan y gates (Recomendado)". This approves:
  - a Popover that stays conditional on the plan's focus and landmark proof, with no hover timer and no global shortcuts;
  - the local inclusive 520px boundary;
  - the overlay recipe;
  - the `active-section-id` convention;
  - the catalog composition correction.
- **LiveBand plan:** "Aprobar plan y gates (Recomendado)". This approves:
  - the LiveBand-only inclusive `[@media(width<=860px)]:` (Field) and `[@media(width<=1080px)]:` (Streams) boundaries;
  - the existing-token VOD recipe;
  - no new naming convention;
  - bounded local legacy neutralization;
  - host-composed flood through SectionShell, with pixels omitted.

Parent evidence before approval: every arbitrary or variant utility the three plans list emits with the installed compiler ([ODD L34](../../../../odd/tasks/web-catalog.md)).


Whole-file SHA-256 values at merge commit `126800b9657f24f2c03d012dad79ff087230753b` (PR #305):

| Component | Plan | Whole-file SHA-256 |
|---|---|---|
| pixel | `docs/components/pixel/v0.1/implementation-plan.md` | `b16ee7519c291faf2bc3b0e2450bfaae39d09bb510d7de023920e28cc86c689b` |
| section-nav | `docs/components/section-nav/v0.1/implementation-plan.md` | `16c42595c77871d8aa04ade026588167604b31c555e38aa2fc3cbdab379aad3f` |
| live-band | `docs/components/live-band/v0.1/implementation-plan.md` | `02f9434e66c74e65c23a57e580a68c56af7d8d3dea9c7b095983d3109db3957b` |
