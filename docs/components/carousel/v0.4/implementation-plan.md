# Carousel v0.4 — implementation plan

- **Status:** Proposed, never approved. Presented for separate owner approval (S5). It authorizes no code, tests, registry write, artifact or catalog regeneration, capture, release or Git action. Nothing below is implemented or measured: preparation was read-only, and no build, test, Storybook, browser or capture ran.
- **Coverage:** S2 and S5 of [`odd/tasks/pulso-consumer-requests.md`](../../../../odd/tasks/pulso-consumer-requests.md), issue #557 only; this is the plan gate that precedes implementation under T6. It does not cover #556, #558 or #559. Format follows the [NowCard v0.1](../../now-card/v0.1/implementation-plan.md) and [LabStage v0.1](../../lab-stage/v0.1/implementation-plan.md) plans; the registry-refresh and browser sections follow the [IconButton v0.4](../../icon-button/v0.4/implementation-plan.md) amendment plan.
- **Contract authority:** [spec.md](spec.md) v0.4, Approved on 2026-11-25 and amended on 2026-11-26 (OQ-2 resolved as B, [approval.md](approval.md) Amendment 1). `contentSHA256: 3295df2f1cd6c314c4d5a2c02ac22f41e23cdc94b370e788d7eb66979d56f52b` (originally approved payload: `8f5bfbd8c3251ec760aa149d3d9334550e6dc7d4c23b5045813f48db970643e2`), reproduced byte-exact in this working tree by two independent methods with the spec's own rule (payload from the line-start `## 1. Purpose and scope` through EOF, LF, final newline). Approval record: [approval.md](approval.md): owner answer, verbatim "Aprobar con recomendaciones (Recomendado)", 2026-11-25, given on the committed draft (`9e7d0c2`, payload `b5d1c2bf3982a468dc5225b06a3720136e594a1d777d51d44b7d8c97ab6f1a15`) with the recommended answer to OQ-1 to OQ-6, asked without a SHA prefix. The cataloging approval is L3. Visual hashes: VIS-01 `569106fc473a863fff84169116b3113fcec68c6e3ee8117e3382e6430d6e485e` is a historical TipCard capture, not a Carousel capture; VIS-02 to VIS-05 are Pending.
- **Re-approval (2026-11-26):** the owner's answer “B: pasar a --shadow-glow-base (Recomendado)” (`odd/tasks/pulso-consumer-requests.md` L10) is recorded as the new approval of the amended spec and of this plan's pinned spec hash. This plan's payload is unchanged, so its own `contentSHA256` below is unchanged; only the pinned spec hash above moved. Read sections 3 to 5 with the amended spec: wherever they spell the glow utilities with `--shadow-glow-active` (the CVA literal, the emission inventory, the E1 and E2 cases and the T4 list), the glow token is `--shadow-glow-base`, and the plan's other literals stay. The track padding `px-6 pt-6 pb-10` remains the approved starting point; the final values are fixed by measurement and recorded in [implementation-evidence.md](implementation-evidence.md).
- **Plan identity:** `contentSHA256: 96f6d303048adb8a471490aa45ae47849f750121d08e46122717ddab56515874` — SHA-256 of the UTF-8, LF, final-newline payload from the exact `## 1. Authority and gates` heading line through EOF; the metadata above it is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `feat/pulso-consumer-requests`, HEAD `68ea3a4` (draft spec commit `9e7d0c2`). Whole-file SHA-256 of the sources, re-verified in this working tree and equal to the spec's facts: `types.ts` `05df7103…cf9f`, `useCarousel.ts` `2cdbd1b8…f353`, `Carousel.tsx` `bf9f33c0…1a2c`, `Carousel.test.tsx` `298c527d…6652`, `Carousel.stories.tsx` `936b5870…0916`; integration files: `carousel-docgen.test.ts` `44efa81a…8921`, `storybook-controls.test.ts` `a5d6ae20…cd4b`, `storybook-css.test.ts` `b597aaf5…dd76`, `prop-naming.test.mjs` `f0d5ada0…c6fe`, `prop-naming.json` `df775089…ee31`.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surface of §2, including the integration surfaces the parent owns. The contract approval alone grants no code (S5). Approving the plan approves no capture, release or GitHub write.
2. **G2 — Spec provenance and its one limit.** The question that approved the spec carried no SHA prefix ([approval.md](approval.md)), so the spec digest binds the bytes derived from the approved draft plus the recommended answers, not a digest the owner quoted. The plan accepts that as provenance; a reviewer who wants an exact-digest confirmation can ask for it before G1. Nothing here upgrades it.
3. **G3 — Registry.** No new convention and no exception: the approved `visual-treatment` → `variant` is reused (spec §3). The plan appends one usage and refreshes nine source revisions (§5.1); no status, approval or receipt changes, and adding a usage approves nothing globally.
4. **G4 — Recipe, tokens and files.** Recipe R1, the glow (`--shadow-glow-active`), the transition and the geometry starting point are approved in the spec (OQ-2 A, OQ-3 A, OQ-4 A). No token, dependency, Radix package or stylesheet is added. **No stylesheet**: `carousel.css` is not created and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical. Every utility is a static literal in a CVA string composed per part with `cn()`; no inline style, interpolated class or new AGENTS.md exception. One reading is flagged for confirmation at G1 (§13): `Highlight` in the forced-colours row is a CSS system-colour keyword, not a token (precedent: ColorSwatchGroup `types.ts:91,106,114`).
5. **G5 — Geometry is a starting point.** `px-6 pt-6 pb-10` and `rounded-xl` ship as the approved starting point. The final values are fixed after VIS-02 and VIS-04 within constraints C1 to C3 (spec §6), which needs its own browser authorization (§9). If no value satisfies C1 to C3, **stop and return**: that is a spec amendment, not a plan tweak.
6. **G6 — Cascade and emission are proved, not assumed.** The V-9 cascade fact comes from a local, git-ignored artifact. The compound focus rule, the `aria-current` rules and every R1 utility are proved on the preview build and the packed build (§4, §5.5), and the focus test must be shown able to fail.
7. **G7 — Integration ownership.** Registry JSON and generated view, the system artifact, catalog source and outputs, package harnesses and changelogs are parent-owned integration surfaces, as in the NowCard and IconButton plans. A writer touches only the Carousel component files. `packages/ui/src/index.ts` and `molecules/carousel/index.ts` do not change.
8. **G8 — Stop lines.** Stop and return to the owner if a utility does not emit or cascades differently from §3; C1 to C3 cannot be met; a generator demands an edit outside §2; TipCard would need to change; `variant` would have to reach the DOM; or a token, dependency or stylesheet appears necessary.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/molecules/carousel/types.ts` | Writer | `variant?: 'default' \| 'current-emphasis'` on `CarouselProps`, after `trackLayout` (`:120`): English JSDoc, `@control select`, `@default default`, inline union, no new export. `variant` axis plus compound variants on `carouselTrackVariants` (`:139`) and `carouselSlideVariants` (`:151`); `p-2` leaves the always-on `trackLayout.default` string (§3) | +36 / −3 |
| `packages/ui/src/molecules/carousel/useCarousel.ts` | Writer | Destructure `variant = 'default'` (`:101`) so it is consumed before `...native`; derive the effective emphasis; pass it to both CVA calls (`:424`, `:531`). No behavior, listener, focus or settlement change | +5 / −2 |
| `packages/ui/src/molecules/carousel/Carousel.tsx`, `index.ts` | none | No change expected: the JSX already spreads `rootProps`, `trackProps` and per-slide props, and `index.ts` exports no new type | 0 |
| `packages/ui/src/molecules/carousel/Carousel.test.tsx` | Writer | New `describe('Carousel v0.4 current-slide emphasis')` (§4, T1 to T12) and a `variant` dimension for the existing interaction block through a local wrapper (T13), leaving its bodies unedited | +183 / −2 |
| `packages/ui/src/molecules/carousel/Carousel.stories.tsx` | Writer | `CurrentEmphasis`, `CurrentEmphasisTipCards`, `CurrentEmphasisFullWidth`; rewrite the "Surface is consumer content, not Carousel paint" sentence; add the `vite/client` reference and the TipCard and fixture imports (§6) | +62 / −3 |
| `packages/ui/src/lib/carousel-docgen.test.ts` | Parent | 17 → 18 own declarations (`:32`), `@default` set `trackLayout` and `variant` (`:39`), `variant` docgen and Controls assertions after `:83`, three story-export assertions after `:49` (§5.2) | +20 / −3 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | `variant: 'select'` in the control map (`:451`), `carousel: 7` → `8` (`:815`), a dedicated variant test next to `:1281` (§5.2) | +17 / −2 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | **No edit expected.** Its only Carousel pins are the public-barrel inventories (`:2013`, `:2096`). An inline union adds no export, so this suite must pass unchanged; a diff there means an accidental export | 0 |
| `packages/ui/src/lib/storybook-css.test.ts` | Parent | Preview-build emission and cascade tests for R1, the C1 token-geometry guard and the `*4` story host utility beside `:312` (§4 E1, E2) | +48 |
| `scripts/package-exports.test.mjs` | Parent | Extend `Carousel ships static layout…` (`:7799`) with the R1 selectors and rules; `variant` SSR assertions near `:7834` | +26 |
| `scripts/package-consumption.test.mjs` | Parent | Typed `variant` samples and a negative case (`:1489-1510`); `CarouselSamples` accepts `variant`; extend `assertCarouselCSS` (`:6087`) and the SSR block (`:6904-6931`) | +24 / −2 |
| `skills/_shared/prop-naming.json` | Parent | Append one `visual-treatment` usage and refresh the nine Carousel `source.revision` values (§5.1) | +11, +9 / −9 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited | ≈ ±8 long lines |
| `scripts/prop-naming.test.mjs` | Parent | Add `visual-treatment` to the Carousel `CarouselProps` post-receipt list (`:461-474`); change the own-usage pin 9 → 10 (`:1329`) | +4 / −1 |
| `scripts/design-system-artifact.test.mjs` | Parent | One Carousel artifact assertion next to `:105` (§5.3) | +16 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited | 1 minified line; ≈ ±12 |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent | Carousel row note (`catalog_data.py:88`), then one `build_catalog.py` run (§5.4) | ±1 line each |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | `## Unreleased` entries citing `(#557)` (§7) | +8; +7 |
| `docs/components/carousel/v0.4/implementation-evidence.md` (+ `capture.json` and PNGs only if authorized) | Parent | Observed RED/GREEN output, browser table, hashes (§9) | +40 |
| `odd/tasks/pulso-consumer-requests.md` | Parent | Log the plan approval and the delivery | +6 |

Explicitly untouched: `packages/ui/src/molecules/tip-card/**`; `packages/tokens/**`; `packages/ui/src/styles/**` (`compiled.css` already scans `../molecules/**/types.ts`; legacy bundle frozen); `.storybook/preview.css` (already scans `Carousel.stories.tsx`); package manifests and versions; `packages/ui/src/index.ts`; other components; frozen v0.1 to v0.3 documents; the spec and approval record.

## 3. Design of the change

**API.** Exactly spec §3: inline union, default `default`, consumed by the hook and never forwarded to the DOM. Planned JSDoc, English: "Visual treatment of the slides. `current-emphasis` frames only the current slide with a brand border and glow and leaves its neighbours unchanged; it reserves a transparent border on every slide and adds token padding around the track for the glow. It applies to the default track layout; with `full-width` it resolves to `default`." with `@control select` and `@default default` as bare tag values, like `trackLayout`.

**CVA structure.** Every R1 string is one static literal (no template, no concatenation) so the Tailwind scanner and the artifact builder read it:

```ts
export const carouselTrackVariants = cva('<existing base, unchanged>', {
  variants: {
    trackLayout: { default: 'gap-7', 'full-width': 'gap-0 p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden' },
    variant: { default: '', 'current-emphasis': '' }
  },
  compoundVariants: [
    { trackLayout: 'default', variant: 'default', class: 'p-2' },
    { trackLayout: 'default', variant: 'current-emphasis', class: 'px-6 pt-6 pb-10' }
  ],
  defaultVariants: { trackLayout: 'default', variant: 'default' }
});
export const carouselSlideVariants = cva('<existing base, unchanged>', {
  variants: {
    trackLayout: { default: '<unchanged>', 'full-width': '<unchanged>' },
    variant: { default: '', 'current-emphasis': '' }
  },
  compoundVariants: [
    {
      trackLayout: 'default',
      variant: 'current-emphasis',
      class: 'rounded-xl border border-solid border-transparent transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out)] focus-visible:transition-none motion-reduce:transition-none aria-[current=true]:border-border-brand aria-[current=true]:shadow-[var(--shadow-glow-active)] aria-[current=true]:focus-visible:shadow-[var(--shadow-focus),var(--shadow-glow-active)] forced-colors:aria-[current=true]:outline-solid forced-colors:aria-[current=true]:outline-(length:--focus-width) forced-colors:aria-[current=true]:outline-[color:Highlight]'
    }
  ],
  defaultVariants: { trackLayout: 'default', variant: 'default' }
});
```

**Why the padding is a compound variant.** The installed tailwind-merge 3.7.0 declares `p: ['px', 'py', …, 'pt', 'pr', 'pb', 'pl']` and `px: ['ps', 'pe', 'pr', 'pl']` (`node_modules/.pnpm/tailwind-merge@3.7.0/node_modules/tailwind-merge/dist/bundle-mjs.mjs:3262-3263`). A later `p-*` removes earlier side paddings, but a later `px-6` does not remove an earlier `p-2`. Keeping `p-2` in the always-on `trackLayout.default` string would leave it in the DOM beside `px-6`, contradicting spec §6 ("the variant replaces rather than stacks"). The slide is different: `rounded-xl` after the base `rounded-lg` is one class group, so `cn()` drops `rounded-lg`. For the default variant the compound reproduces today's order (`… gap-7 p-2`). T4 and T8 pin both facts.

**Hook.**

```ts
  trackLayout = 'default',
  variant = 'default',
  …
  // Emphasis exists only on the default track; every other runtime value resolves to the default recipe.
  const emphasis = trackLayout === 'default' && variant === 'current-emphasis' ? 'current-emphasis' : 'default';
  …
  className: cn(carouselTrackVariants({ trackLayout, variant: emphasis })),
  className: cn(carouselSlideVariants({ trackLayout, variant: emphasis }))
```

The spec says nothing about unknown runtime values (untyped JavaScript). The plan takes the conservative reading: they behave as `default`, silently, like the `full-width` fallback (OQ-5 A); T9 pins it. This is a plan-level choice a reviewer can veto at G1.

**Emission inventory.** Each static R1 utility, the declaration it must emit, and where it is proved:

| Utility | Required emitted declaration | Proof |
| --- | --- | --- |
| `rounded-xl`, `border`, `border-solid`, `border-transparent` | `border-radius` from `--radius-xl`, `border-width: 1px` (the same `border border-solid` base as Surface, `surface/types.ts:22`), `border-style`, `border-color: transparent` | E1 |
| `aria-[current=true]:border-border-brand` | `border-color: var(--color-border-brand)` only under `[aria-current="true"]` | E1 |
| `aria-[current=true]:shadow-[var(--shadow-glow-active)]` | `--tw-shadow: var(--shadow-glow-active)` and `box-shadow`, only under `[aria-current="true"]` | E1 |
| `aria-[current=true]:focus-visible:shadow-[var(--shadow-focus),var(--shadow-glow-active)]` | `--tw-shadow` with the focus layers first; selector requires both `[aria-current="true"]` and `:focus-visible`, strictly more specific than `.focus-visible\:shadow-\[var\(--shadow-focus\)\]:focus-visible` | E1, E2 and the failing-focus proof |
| `transition-[border-color,box-shadow]`, `duration-[var(--duration-base)]`, `ease-[var(--ease-out)]` | `transition-property: border-color, box-shadow`; duration and easing from the tokens | E1 |
| `focus-visible:transition-none`, `motion-reduce:transition-none` | `transition-property: none` under `:focus-visible` and `@media (prefers-reduced-motion: reduce)` | E1 |
| `forced-colors:aria-[current=true]:outline-solid`, `…outline-(length:--focus-width)`, `…outline-[color:Highlight]` | `@media (forced-colors: active)` rules: `outline-style: solid`, `outline-width: var(--focus-width)`, `outline-color: Highlight` | E1 |
| `px-6`, `pt-6`, `pb-10`, `p-2` | `padding-inline`, `padding-top`, `padding-bottom` and `padding` from `--space-6`, `--space-6`, `--space-10` and `--space-2` | E1 |

## 4. Test-first sequence

Public-interface tests first, with the intended RED captured verbatim before any implementation (the evidence file records the command, exit code and counts). Browser-only geometry and paint are not claimed from jsdom; they sit in §9.

**New unit tests** (`Carousel.test.tsx`, roles and accessible names, `userEvent`, no complete class strings, no `data-testid`):

| ID | Test | Covers |
| --- | --- | --- |
| T1 | `variant` is consumed and never forwarded: the root has no `variant` attribute for any value, `data-example` still arrives, no console error | AC-02 |
| T2 | With the variant on, every slide carries one identical class list; no `data-*`, `style` or class differs by position; moving with Next and ArrowRight changes only `aria-current` and `tabindex` | AC-03 |
| T3 | Identity matrix with the variant on: initial fallback, controlled accept and reject, reorder, removal, empty, invalid, single item; exactly one `aria-current` slide, equal to the accepted identity | AC-03 |
| T4 | Class contract: the classes the variant adds equal the approved list exactly; no `opacity-`, `blur-`, `brightness-`, `scale-`, `translate-`, `rotate-`, `animate-`, literal colour or `style`; after `cn()` the track has no `p-2` and the slides no `rounded-lg`; `px-6 pt-6 pb-10` and `rounded-xl` present | AC-04 |
| T5 | Focus: the compound `aria-[current=true]:focus-visible:shadow-[…]` and `focus-visible:transition-none` are present; variant off keeps `focus-visible:shadow-[var(--shadow-focus)]` | AC-06 |
| T6 | Motion: `transition-[border-color,box-shadow]`, token duration and easing and `motion-reduce:transition-none` present; no `animate-*`, `transform`, `translate-*`, `scale-*`, `rotate-*` | AC-07 |
| T7 | Forced colours: the three `forced-colors:aria-[current=true]:outline-*` utilities present, no `forced-color-adjust-*` on slides, every slide has `border-transparent` | AC-08 |
| T8 | PRESERVE: omitted and explicit `variant='default'` on both layouts keep the v0.3 set (`rounded-lg`, `p-2` on the default track, `gap-7`, focus shadow) and none of the R1 utilities | AC-01 |
| T9 | `full-width` with `current-emphasis` renders the same class sets (root, track, slides) as `full-width` default with no `console.warn` or `console.error`; an unknown runtime value on the default track behaves as `default` | AC-09 |
| T10 | `rerender` matrix toggling `variant` and `trackLayout`: identity unchanged, `onValueChange` not called, R1 appears and disappears and `p-2` returns on the default track | AC-09 |
| T11 | Every attribute except `class` is equal between the variants for every element (generated ids normalized by order); tab order, names and descriptions identical | AC-11 |
| T12 | PRESERVE: a `TipCard` inside a slide keeps the root class list it has standalone and adds no tab stop | AC-12 |
| T13 | PRESERVE: the existing interaction block (`describe.each(['default', 'full-width'])`, `:721`) gains a `variant` dimension through a local wrapper component that shadows `Carousel` with an aliased import, so its 13 renders and all bodies stay unedited | AC-10 |

**RED to GREEN per acceptance criterion.**

| AC | RED test | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| AC-01 | T8; the existing `Carousel v0.2 track layout` tests (`:663`, `:673`, `:703`) unmodified | **PRESERVE, no RED.** Nothing exists to remove yet; the `p-2` refactor is the regression it guards. Green before and after | Focused run green, existing tests unmodified |
| AC-02 | T1; `carousel-docgen.test.ts` (18 declarations, `@default`, `variant` metadata); `storybook-controls.test.ts` (`variant: 'select'`, options `['default', 'current-emphasis']`, `args` stays `{}`, count 8) | `variant` leaks to the DOM; 17 declarations found; `argTypes.variant` undefined | Same runner green; `storybook-docgen.test.ts` unchanged and green |
| AC-03 | T2, T3; E1 rules exist only under `[aria-current="true"]` | R1 classes absent; E1 rules not emitted | Green; §9 computed-style check |
| AC-04 | T4; E1 declarations resolve to the named tokens; `git diff --stat -- packages/ui/src/molecules/tip-card` empty | The variant adds nothing today | Green; scope check empty |
| AC-05 | E2 guard C1: read `--space-6` and `--space-7` from `packages/tokens/src/theme.css`, assert `space-6 + 0.5px < space-7` (the hook's alignment tolerance) and that `.px-6` uses `--space-6`; the rest in §9 | `.px-6` not emitted | Guard green; browser rows Pending until authorized |
| AC-06 | T5; E2: compound rule needs both selectors, lists the focus layers first and is strictly more specific than the plain focus rule; failing-focus proof (below) | Compound utility absent | Green; §9 real keyboard focus |
| AC-07 | T6; E1 reduced-motion rule | Utilities absent | Green; §9 reduced-motion emulation |
| AC-08 | T7; E1 `@media (forced-colors: active)` rules | Utilities absent | Green; §9 emulation, **Not evaluated** until run |
| AC-09 | T9, T10 | T10 fails (R1 never appears); the equal-class part of T9 is PRESERVE-like | Green; §9 realignment spot check |
| AC-10 | T13 | **PRESERVE, no RED** | Green |
| AC-11 | T11 | `variant` leaks as a root attribute, so the attribute sets differ | Green |
| AC-12 | T12; three story-export assertions in `carousel-docgen.test.ts`; TipCard suite unchanged | Stories missing; T12 is PRESERVE | Green; TipCard suite unmodified |
| AC-13 | Pin changed to 10 first; `pnpm props:check` stale after the `types.ts` edit; `pnpm artifact --check` stale; artifact assertion; catalog row | Stale revisions and pin mismatch before the registry edit and generators | `props:docs`, `props:check`, `test:props`, `artifact --write` with `system:docs`, `build_catalog.py` green |
| AC-14 | E1 and E2 preview build; packed-CSS selectors in `package-exports.test.mjs`; typed samples, negative case, SSR and `assertCarouselCSS` in `package-consumption.test.mjs`; export inventories unchanged | Selectors missing from the built CSS | Green after `pnpm build`; React 18 and 19 when the harness is authorized |
| AC-15 | Not a test. Visual conformity stays **Not evaluated** until captures are authorized and an expected design is adopted | — | Pending |

**E1 and E2 — emitted CSS** (`storybook-css.test.ts`): the helper `rule()` (`:155`) matches only flat `selector { … }` blocks, so variant selectors follow the `declarationAfter` pattern already used for `aria-[current=page]` utilities (`:424-458`) and bounded `css.slice` parsing (`:727-729`). If the optimizer emits nested CSS, the first RED to GREEN run exposes it and the helper is adapted in the same file. Two tests: E1 emission and token declarations (including `@media (forced-colors: active)` and `(prefers-reduced-motion: reduce)` blocks); E2 cascade (compound selector specificity, focus layers first) plus the C1 token-geometry guard.

**Failing-focus proof (G6).** Show that E2 can fail: run it once against a scratch copy of the preview build without the compound utility, outside the worktree, and record the failure. Never commit a mutation and never leave scratch inside the repository.

**PRESERVE and differential.** The shared code is the two CVAs and the hook line that feeds them, used by both layouts. Evidence that previous behavior holds: the existing layout tests unmodified, T8, T13 with the default variant, and one differential render check on a copy of the base commit in `mktemp -d` (not committed): static markup of `{layout} × {ltr, rtl} × {value}` with `variant` omitted must be byte-identical between the base copy and the change. Any difference nobody asked for is a regression to fix and pin with a test.

**GREEN order.** `types.ts` → `useCarousel.ts` → focused runner → stories → docgen and Controls pins → E1, E2 → registry → artifact → catalog → changelogs.

## 5. Registry, docgen and artifact obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

Append, never reorder, to the usages of the approved `visual-treatment` (the other usages are appended chronologically):

```json
{
  "component": "Carousel",
  "type": "'default' | 'current-emphasis' (default 'default'); trackLayout 'full-width' accepts 'default' only",
  "status": "existing",
  "source": { "path": "packages/ui/src/molecules/carousel/types.ts", "symbol": "CarouselProps", "revision": "sha256:<whole-file SHA-256 of the final types.ts>" }
}
```

The wording follows ModuleCard and ListItem for combination limits. Then refresh the nine existing Carousel usages, all currently `sha256:05df71030c077463046e0e67467867cb6d3046289070810937697229d5e2cf9f`: `primary-value` (`CarouselProps`, `CarouselItem`), `accessible-name` (both symbols), `initial-uncontrolled-value`, `interactive-value-change`, `collection-items`, `localized-messages` and `carousel-track-layout`. All ten usages carry the same new hash. Hash only after `types.ts` is final and `pnpm lint` is clean on it; any later edit, even formatting, requires re-hashing.

`pnpm props:docs` regenerates `docs/prop-naming.md` (never by hand); then `pnpm props:check` and `pnpm test:props`. In `scripts/prop-naming.test.mjs` add `visual-treatment` to the Carousel `CarouselProps` post-receipt list (`:461-474`) and change the own-usage pin from 9 to 10 (`:1329`). `historicalRegistry` strips only reviewed post-receipt usages, so an unlisted usage fails the receipt tests: that is the intended RED. No approval JSON is added: there is no new convention or exception, and a convention hash binds convention content, not usages.

### 5.2 Docgen and Controls pins

- `carousel-docgen.test.ts`: `toHaveLength(17)` → 18 (`:32`); the `@default` expectation becomes `['trackLayout', 'variant']` membership (`:39`); assert `variant` with `required: false`, `defaultValue: { value: 'default' }`, `tags: { control: 'select' }`, Controls `{ type: 'select' }`, options `['default', 'current-emphasis']`, summary `"default"`, `installed.args` still `{}`; assert the three new story exports next to `:48-49`.
- `storybook-controls.test.ts`: control map `variant: 'select'` (`:451`); `ownPropCounts.carousel` 7 → 8 (`:815`); a test beside `:1281` that maps `variant` as an optional select without injecting an argument and with zero diagnostics.
- `storybook-docgen.test.ts`: unchanged (see §2). It runs in the focused command precisely to prove the barrel pins did not move.

### 5.3 System artifact

`pnpm artifact --write` then `pnpm system:docs`. Expect the Carousel entry to gain the `variant` prop (type `enum`, default `default`, description from the JSDoc), the `variant` axis and compounds in `variants` and `anatomy`, new entries in `anatomyUtilities`, and the new usage in `propNaming`. The artifact is 605,026 bytes against the 1,048,576-byte budget asserted in `design-system-artifact.test.mjs`; confirm it stays under after regeneration. Add one assertion near `:105`: Carousel props include `variant` with default `default`; the `carouselSlideVariants` recipe contains the R1 utilities; `carouselTrackVariants` still lists `gap-7` and `p-2`. Then `artifact --check`, `system:check`, `test:artifact` and `test:system` green.

### 5.4 Catalog

In `scripts/catalog_data.py:88` replace "Structural layout only; consumer Surface content owns Material." with: "v0.4 ([#557](https://github.com/egdev6/egdev-design-system/issues/557)) adds the opt-in `variant='current-emphasis'`: on the default track the current slide (`aria-current`) gets a brand border and glow on its transparent wrapper frame; `full-width` resolves to `default`; no coverflow depth. Structural layout by default; consumer Surface content owns Material." Then one `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` run; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`. The TipsSlider row (`:117`) stays: it is still a composition.

### 5.5 Package fixtures

`package-exports.test.mjs` (`:7799`): add the R1 selectors (`aria-[current=true]` border and shadow, the compound focus rule, `transition-[border-color,box-shadow]`, `motion-reduce` and `forced-colors` variants, `px-6`, `pt-6`, `pb-10`, `rounded-xl`, `border-transparent`) and the declaration checks through `cssBlock`; SSR with `variant='current-emphasis'` asserts the root has no `variant` attribute, exactly one `aria-current` slide and the R1 classes on every slide. `package-consumption.test.mjs`: typed positive samples for both values, one documented `@ts-expect-error` for an invalid value (as the existing `trackLayout: 'edge'` case at `:1496`), `assertCarouselCSS` extended with the same selectors, and the SSR block extended. No ref, no React 19-only API; React 18.3.1 and 19.3.0 run only through the existing packed harness.

## 6. Stories and Controls

`Molecules/Carousel` keeps autodocs, `Meta<typeof Carousel>`, no manual `argTypes`, no `play`; every new story is English and typed `Story`.

- `CurrentEmphasis`: `args: { variant: 'current-emphasis', defaultValue: 'test' }` over the existing Surface items.
- `CurrentEmphasisTipCards`: three `TipCard` slides (title, badge, `src` from `docs/components/photo-frame/v0.3/fixtures/diagnostic.svg?url`, alt) in a token-sized poster-wide host `w-full max-w-[calc(var(--space-24)*4)]` (307.2px under default tokens; scanned by the existing preview `@source`), with the second slide current. The file needs `/// <reference types="vite/client" />` as `TipCard.stories.tsx` has. This is the VIS-02 to VIS-05 scenario.
- `CurrentEmphasisFullWidth`: `variant: 'current-emphasis', trackLayout: 'full-width'`, documenting that it renders as `FullWidth`.
- Meta text: replace "Surface is consumer content, not Carousel paint" with: Carousel paints nothing by default; with `variant='current-emphasis'` it paints only the current slide's transparent frame (border and glow), which reserves a border on every slide and adds track padding; slide content should fill the slide with corners at or below `--radius-xl`; the emphasis is decorative redundancy because the state is also in the accessible name, `aria-current`, the counter and the progress bar. Keep the "no stylesheet or part override API" sentence.
- Controls: the registered enhancer shows `variant` as a select in union order and injects no argument; `Default` stays unchanged. Real browser Controls are checked in §9, not inferred from tags.
- The `*4` host utility is asserted next to the existing `*3` pin (`storybook-css.test.ts:312`), preview build only, not production.

## 7. Changelog entries

`packages/ui/CHANGELOG.md`, new `## Unreleased` above `## 0.10.0`, as the Text and IconButton PRs did:

```md
## Unreleased

### Added

- Carousel supports opt-in `variant='current-emphasis'`: on the default track the current slide gets a brand border
  and glow while its neighbours keep their paint. Every slide then reserves a transparent border and the track gains
  padding for the glow, so slide geometry changes only when opted in; with `trackLayout='full-width'` it resolves to
  `default`. The default appearance is unchanged. (#557)
```

`packages/system/CHANGELOG.md`, new `## Unreleased` above `## 0.12.0`:

```md
## Unreleased

### Added

- The artifact and design reference include Carousel's `variant` prop and its current-slide emphasis recipes;
  existing props and recipes are unchanged. (#557)
```

`(#557)` cites a fully resolved issue, as [versioning](../../../distribution/versioning.md) requires for consumer requests. `release.json` ignores `## Unreleased`, so `resolves` gains #557 only when a separately authorized release moves these lines into a versioned section. If the owner narrows the delivery, write `Refs #557` instead. This PR makes no version bump, `release:pack` or tag.

## 8. Checks to run

All commands are **future**, run from the repository root, one at a time in the foreground, and only with explicit authorization. None has been run for this plan. The first command is the identical RED and GREEN runner.

```sh
pnpm exec vitest run packages/ui/src/molecules/carousel packages/ui/src/lib/carousel-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/molecules/tip-card --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/ui/src/molecules/tip-card packages/tokens packages/ui/src/styles packages/ui/src/index.ts
pnpm typecheck
pnpm props:docs
pnpm props:check
pnpm test:props
pnpm artifact --write
pnpm system:docs
pnpm artifact --check
pnpm system:check
pnpm test:artifact
pnpm test:system
PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py
pnpm lint
pnpm test
pnpm build
pnpm test:package-exports
pnpm test:package-consumption
pnpm storybook-build
git status --short
```

The `git diff --stat` scope check must print nothing, and the final `git status --short` must list only §2 paths: no scratch, cache or `.playwright-mcp/` output. `pnpm build` may regenerate artifacts: recheck `pnpm artifact --check` afterwards. `pnpm test:package-consumption` creates isolated fixtures and may install dependencies, so it needs specific permission and a verified offline cache; it must exercise React 18.3.1 and 19.3.0 with shipped tokens and UI CSS and no Tailwind compiler. Record any unavailable matrix as pending. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens test, `test:package-exports` and `test:package-consumption`; the artifact checks are not in CI and are run here because `@egdev/system` ships.

## 9. Browser and capture procedure

Only after separate permission to start `pnpm storybook` (it builds tokens first) and to use Playwright MCP, following the [capture guide](../../../design/README.md). Record commit, browser and version, viewport, device scale, theme (dark Grafito), loaded fonts, motion and forced-colors settings, crop and date for every observation. Stories: `molecules-carousel--current-emphasis`, `--current-emphasis-tip-cards`, `--current-emphasis-full-width`, plus `--default` and `--full-width` for preservation.

1. **AC-03 computed style.** With slide 2 current, only that slide has the resolved brand border colour and a `box-shadow` containing the glow; neighbours have a transparent border and no glow. After Next, the roles swap; never two at once.
2. **AC-05 geometry.** Each slide's border-box and content-box are identical before and after navigation; the track's horizontal padding is below its `column-gap`; no neighbour pixel is inside the scrollport at rest at 1280px and 320px hosts; the track adds no scrollbar compared with `Default`; the wrapper radius equals the TipCard article radius; the slide centre is within 0.5px of the scrollport centre after Next, ArrowRight and Home. Inspect the real PNG for glow clipping at the scrollport edges; if it is hard-clipped, adjust the values within C1 to C3 (G5) and re-measure.
3. **AC-06 focus.** Real keyboard Tab onto the current slide: the computed `box-shadow` lists the focus layers first, `transition-property` is `none` while focused, and blur leaves the glow.
4. **AC-07 reduced motion.** Under `prefers-reduced-motion: reduce` the computed `transition-property` is `none` and the emphasis moves instantly.
5. **AC-08 forced colours.** Chromium emulation of `forced-colors: active` (emulation only, not a real Windows contrast session): the current slide computes a solid outline of `--focus-width` in `Highlight`, neighbours none, and every slide shows the reserved border.
6. **AC-09 fallback and switching.** Toggle the `variant` and `trackLayout` Controls: the accepted slide stays centred, no value request fires, `full-width` looks identical to `FullWidth`.
7. **AC-02 Controls.** The `variant` row is a select with options in union order and no injected argument.
8. **Captures VIS-02 to VIS-05**, only if authorized: component-zone PNGs of the Carousel root under `docs/components/carousel/v0.4/` named `<variant>--<state>--<viewport>--<theme>.png` (for example `current-emphasis--settled--1280x900--dark.png`), with `capture.json`, SHA-256 hashes and conditions. They are observed implementation, not approved expected design, until the owner adopts exact hashes. Playwright MCP writes under `.playwright-mcp/`; nothing from it is copied or committed except the requested captures. GitHub-visible handoff is a separate authorization.

**Visual conformity: Not evaluated.** No capture exists, VIS-01 is a historical TipCard image, and none of this plan's browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English. The PR is squash-merged as in the Text and IconButton PRs; the slices exist for review and bisect.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `feat(ui): add the Carousel current-slide emphasis variant (#557)` | `types.ts`, `useCarousel.ts`, `Carousel.test.tsx`, `carousel-docgen.test.ts` (without the story assertions), `storybook-controls.test.ts`, `storybook-css.test.ts`, `prop-naming.json`, regenerated `docs/prop-naming.md`, `prop-naming.test.mjs` | ≈ 368 |
| 2 | `feat(ui): add the Carousel emphasis stories and packed-build checks (#557)` | `Carousel.stories.tsx`, the three story assertions, `package-exports.test.mjs`, `package-consumption.test.mjs` | ≈ 120 |
| 3 | `chore(integration): refresh the Carousel artifact, catalog row and changelogs (#557)` | `design-system.json`, `system.md`, `design-system-artifact.test.mjs`, `catalog_data.py` with the generated catalog, both changelogs | ≈ 51 |
| 4 | `docs(carousel): record the v0.4 implementation evidence (#557)` | `implementation-evidence.md`, the odd log, and `capture.json` with PNGs only if authorized | ≈ 46 |

Slice 1 keeps the registry and the metadata pins with the type change, so `props:check`, `test:props` and the pins stay green per commit. `pnpm artifact --check` is stale between slices 1 and 3; if every commit must be artifact-fresh, fold slice 3 into slice 1 (≈ 419). A failing RED commit is never made.

## 11. Estimated changed lines

About **585 changed lines**: ≈ 551 hand-written (component ≈ 111: `types.ts` 39, hook 7, stories 65; tests and fixtures ≈ 348; registry JSON, catalog source, changelogs, evidence and log ≈ 92) and ≈ 34 generated (`docs/prop-naming.md` ≈ 16, `design-system.json` 2, `system.md` ≈ 12, catalog ≈ 4). For calibration, the v0.2 `trackLayout` commit `5d6fe80` touched 13 files with +587 / −32, including a 297-line test addition and an approval JSON that this change does not need.

## 12. Risks

- **Risk 1 — Cascade.** Equal-specificity rules on the current slide can hide the focus ring (spec V-9). The compound rule and its failing-focus proof must be shown on the emitted build, not inferred from class order or `twMerge`.
- **Risk 2 — Geometry.** The padding values come from token arithmetic, not measurement. A glow that stays hard-clipped within C1 to C3 is a spec amendment (G5). The vertical padding also changes the track height for the opt-in.
- **Risk 3 — Forced colours.** Behavior is derived from the specification; Chromium emulation is not a real contrast session, and a real Windows session stays pending.
- **Risk 4 — Registry coupling.** Every `types.ts` edit invalidates ten registry revisions and the artifact. Hash last, rehash after any formatting change. The pins in `prop-naming.test.mjs` (post-receipt list, own-usage count) and `storybook-controls.test.ts` (own-prop count) move with the prop.
- **Risk 5 — Parallel branches.** #556, #558 and #559 touch the same shared outputs: `prop-naming.json`, `prop-naming.test.mjs`, `docs/prop-naming.md`, `design-system.json`, `system.md`, `catalog_data.py` with its generated files, and both changelogs. Expect rebase conflicts. Regenerate generated files instead of hand-merging, and re-hash each component's `types.ts` revisions after rebasing.
- **Risk 6 — Story typing.** Importing the fixture with `?url` needs the `vite/client` reference; `pnpm typecheck` proves it. The `*4` host utility exists only in the preview build.
- **Risk 7 — Test wrapper (T13).** Shadowing `Carousel` inside the existing `describe.each` needs an aliased import and a stable wrapper per iteration; a new component type per render would remount on `rerender` and invalidate the block.
- **Risk 8 — Consumer fit.** The frame follows the slide box, not its content. Content with corners above `--radius-xl`, or narrower than the slide, is framed at slide width (spec §4); the emphasis shows against neighbours only while the track moves (OQ-6 A).
- **Risk 9 — Package harness.** `test:package-consumption` needs an offline cache and permission to install; without them the React 18 and 19 matrix stays pending, which blocks "verified in packed consumers" claims, not the rest.

## 13. Pending owner decisions

No Material recipe, token or dependency decision is pending: R1, its glow, the transition and the geometry starting point were approved with the spec.

1. **D1 — Plan approval (G1).** Approve this exact plan and the §2 edit surfaces, including the parent-owned integration files, or revise it. The spec approval does not cover it.
2. **D2 — Browser and capture authorization.** Starting `pnpm storybook` and using Playwright MCP are needed to fix the geometry values (OQ-4 A) and to evaluate AC-05 to AC-08 and VIS-02 to VIS-05. Without it those rows stay Pending or **Not evaluated** and the starting values ship unmeasured. Adopting any capture as expected design is a separate decision.
3. **D3 — Confirm one literal reading.** `Highlight` (a CSS system-colour keyword, not a token) in the forced-colours row of R1, by the ColorSwatchGroup precedent. The spec's approved R1 lists it, so the plan treats it as covered; confirm that reading at G1.
4. **D4 — Release timing.** No version bump here. Decide whether this change ships in a combined release with #556, #558 and #559 or on its own; until then the `## Unreleased` entries stay ignored by `release.json`.
5. **D5 — Issue citation.** The entries cite `(#557)`, which marks the issue fully resolved. OQ-6 A scopes this delivery to the emphasis and leaves neighbours at rest to a separate request only if needed; if the owner reads that gap as leaving #557 open, write `Refs #557` instead.
6. **D6 — Publishing the snapshot.** Publishing v0.4 as a comment on the canonical issue #80 is a separate GitHub authorization, not required before code.

Plan-level choices a reviewer can veto at G1: unknown runtime `variant` values resolve silently to `default`; the padding lives in compound variants; the story host width `*4`.

## 14. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, artifact, catalog, capture, release or Git action is taken or implied. Stop and return to the owner on any G8 condition, a contradictory result, or a needed edit outside §2.
