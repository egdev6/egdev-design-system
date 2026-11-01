# Proposal — Global UI scale −20% (S13 / T10, issue #218)

**Status:** APPROVED AND APPLIED (L8, owner answers OQ1–OQ7, all in scope): exact ×0.8 sub-pixel values (OQ1), touch targets scale to 35.2px (OQ2), radii scale (OQ3), Gauge presets scale (OQ4 — they are token-bound `--space-10/14/20`, so they scale automatically; only docs were updated), display sizes scale (OQ7), egdev.es layout constants scale (OQ5: `--nav-height`, `--gutter`, `--content-max`; `--section-min-height` stays `100dvh` — viewport-relative, not a size; `--bp-*`/`--breakpoint-*` stay — viewport thresholds, not size tokens), effect grid scales to 32px keeping the "coincide con --space-10" comment true (OQ6). Applied in `packages/tokens/src/theme.css` with `pnpm tokens` regeneration.
**Source of truth:** `packages/tokens/src/theme.css` (all values below are quoted from it). `packages/tokens/src/tokens.css` is a compiled artifact and is never edited.
**Spec:** `odd/tasks/visual-review-corrections.md` S13, owner decision L2: factor "80%" (Quorb zoom) — reduce the default scale ~20% for type, spacing and control heights.

## Why most of this is a token-only change

`@egdev/ui` recipes do not hard-code control sizes. They use Tailwind v4 spacing steps bound to the `--space-*` scale (`--spacing: var(--space-1)`, `--spacing-N: var(--space-N)`), e.g. `min-h-11` (44px inputs/tabs/nav rows), `min-h-10` (40px), `size-5` (20px radio), `size-4.5` (18px checkbox), plus fractional steps (`size-3.5`, `size-7.5`, `py-1.5`, `py-2.25`) that compile to `calc(var(--spacing) × N)`. Text sizes come exclusively from the `--text-*` recipes. Icon sizing uses `--icon-size` (20px) and spacing steps.

Consequence: re-valuing the `--space-*` base and the `--text-*` recipes scales **every** derived utility — including fractional ones — exactly proportionally, with no component code change. Only a handful of documented px sizes live outside the token scale (Gauge numeric presets; shadow/blur geometry), and they are explicitly out of scope or flagged below.

## Rounding rule

**Recommended rule: exact ×0.8, one decimal, sub-pixel values allowed.**

Justification:

- The reference is literally "Quorb at 80% zoom": browser zoom multiplies every CSS px by 0.8 with sub-pixel results. Exact ×0.8 reproduces that screenshot by construction.
- Tailwind fractional utilities (`size-3.25`, `py-2.25`, …) multiply the `--spacing` base at runtime, so they stay exactly proportional only if the base keeps its decimals (4px → 3.2px gives `size-3.25` = 10.4px = 13 × 0.8, exact). Whole-pixel rounding of the base breaks this proportionality silently.
- Modern displays (DPR ≥ 2) render sub-pixel geometry cleanly. Line *heights* are unitless multipliers and *letter-spacing* is em-based, so neither needs touching.

**Why the 4px grid cannot be kept:** 4px → 3.2px has no point on a 4px grid. Preserving the grid would mean not scaling `--space-1`, which is the base of the whole Tailwind step (`--spacing`), and the scale would stop being a scale. A 4px-grid-compatible whole-pixel table is given below only as a fallback, and it is visibly not a uniform grid (4, 6, 10, 12, 16, 20, 22, 26, 32, 38, 44, 52, 64, 76). Fallback rule if the owner rejects sub-pixel values: round each product to the nearest whole px; when a 4px-grid point lies within 0.8px of the exact product, snap to it (this keeps 20→16, 40→32, 80→64 on the grid; 4 stays 4; 16→12 and 96→76 snap, while 12→10 and 28→22 round to whole px).

Exact fallback table (whole px, grid-snap within 0.8px): `--space-*`: 4, 6, 10, 12, 16, 20, 22, 26, 32, 38, 44, 52, 64, 76; `--text-*`: 45, 77, 51, 29, 22, 32, 19, 16, 13, 16, 11, 11, 11, 13, 11.

## 1. Value table (old → ×0.8)

### Spacing scale (`:root` block) — 14 values change, 1 stays

| Token | Old | ×0.8 | Whole-px fallback | Note |
|---|---|---|---|---|
| `--space-0` | 0px | 0px | 0px | stays |
| `--space-1` | 4px | 3.2px | 4px | Tailwind `--spacing` base |
| `--space-2` | 8px | 6.4px | 6px | |
| `--space-3` | 12px | 9.6px | 10px | |
| `--space-4` | 16px | 12.8px | 12px | base padding |
| `--space-5` | 20px | 16px | 16px | lands on grid |
| `--space-6` | 24px | 19.2px | 20px | |
| `--space-7` | 28px | 22.4px | 22px | |
| `--space-8` | 32px | 25.6px | 26px | |
| `--space-10` | 40px | 32px | 32px | lands on grid; see effect-grid note |
| `--space-12` | 48px | 38.4px | 38px | |
| `--space-14` | 56px | 44.8px | 44px | |
| `--space-16` | 64px | 51.2px | 52px | |
| `--space-20` | 80px | 64px | 64px | lands on grid |
| `--space-24` | 96px | 76.8px | 76px | |

The `@theme inline static` `--spacing-*` bindings are `var()` references — no edits needed there.

### Typography — 15 fixed recipes, 8 fluid recipes, 1 fluid spacing token

Line-heights (unitless), font-weights and letter-spacing (em) are unchanged for all recipes.

| Token | Old | ×0.8 |
|---|---|---|
| `--text-display-hero` | 56px | 44.8px |
| `--text-display-show` | 96px | 76.8px |
| `--text-display-pro` | 64px | 51.2px |
| `--text-display-stat` | 36px | 28.8px |
| `--text-display-stat-sm` | 28px | 22.4px |
| `--text-heading-section` | 40px | 32px |
| `--text-heading-small` | 24px | 19.2px |
| `--text-body-large` | 20px | 16px |
| `--text-body-default` | 16px | 12.8px |
| `--text-body-muted` | 20px | 16px |
| `--text-label-default` | 14px | 11.2px |
| `--text-label-eyebrow` | 14px | 11.2px |
| `--text-meta` | 14px | 11.2px |
| `--text-cta-label` | 16px | 12.8px |
| `--text-code` | 14px | 11.2px |

Fluid recipes (both clamp endpoints ×0.8; the vw midpoint must also scale to keep the same shape — clamp end only would change the curve):

| Token | Old | ×0.8 |
|---|---|---|
| `--text-title-section` | `clamp(40px, 5.6vw, 64px)` | `clamp(32px, 4.48vw, 51.2px)` |
| `--text-title-hero` | `clamp(60px, 9vw, 140px)` | `clamp(48px, 7.2vw, 112px)` |
| `--text-title-show` | `clamp(56px, 8.2vw, 132px)` | `clamp(44.8px, 6.56vw, 105.6px)` |
| `--text-title-display` | `clamp(64px, 9.6vw, 164px)` | `clamp(51.2px, 7.68vw, 131.2px)` |
| `--text-countdown-md` | `clamp(52px, 6vw, 96px)` | `clamp(41.6px, 4.8vw, 76.8px)` |
| `--text-countdown-sm` | `clamp(36px, 4vw, 56px)` | `clamp(28.8px, 3.2vw, 44.8px)` |
| `--text-quote-pull` | `clamp(19px, 1.7vw, 23px)` | `clamp(15.2px, 1.36vw, 18.4px)` |
| `--text-quote-display` | `clamp(48px, 6.2vw, 100px)` | `clamp(38.4px, 4.96vw, 80px)` |
| `--spacing-countdown-column` | `clamp(14px, 2.2vw, 32px)` | `clamp(11.2px, 1.76vw, 25.6px)` |

Relative measures stay unchanged: `--spacing-countdown-unit: 1.9ch`, `--container-quote-pull: 40ch` (they follow their own font size).

### Radii (recommendation: scale for proportion — owner decision, OQ3)

| Token | Old | ×0.8 |
|---|---|---|
| `--radius-none` | 0px | 0px (stays) |
| `--radius-sm` | 4px | 3.2px |
| `--radius-md` | 12px | 9.6px |
| `--radius-lg` | 16px | 12.8px |
| `--radius-xl` | 22px | 17.6px |
| `--radius-2xl` | 24px | 19.2px |
| `--radius-full` | 9999px | 9999px (stays) |

### Icons, borders, focus

| Token | Old | Decision |
|---|---|---|
| `--icon-size` | 20px | 16px (×0.8; `size-(--icon-size)` consumers follow) |
| `--icon-stroke` | 1.75 | stays (unitless) |
| `--border-width` | 1px | **stays** — a hairline is a rendering constant; 0.8px would blur/alias and DPR-1 monitors cannot paint it |
| `--focus-width` | 2px | **stays** — reducing to 1.6px weakens the visible focus indicator (WCAG 2.4.11 area); 2px reads identically at both scales |
| `--focus-offset` | 2px | **stays** (pairs with focus width; `--shadow-focus` hard-codes the 2px/4px geometry) |

### Intentionally unchanged (with reasons)

- **Shadows** (`--shadow-glow-*`, `--shadow-elev-*`, `--shadow-well`, `--shadow-focus`, `--shadow-edge*`, `--shadow-card`, `--shadow-hot`, `--shadow-btn-*`): elevation and glow are optical, not metric; their offsets/blur do not read as "size" at 80% and scaling them would flatten the Material look. Unchanged.
- **Blurs** (`--blur-glass` 16px, `--blur-overlay` 20px): optical effects, not layout. Unchanged.
- **Motion/durations** (`--duration-*`, `--ambient-*`, `--ease-*`, `--animate-*`): not size-bearing.
- **Layout constants** (`--content-max` 1280px, `--gutter`, `--nav-height` 68px, `--bp-sm/md/lg`, `--breakpoint-section-header-split` 860px, `--section-min-height`): page layout and breakpoints, not component scale; they belong to the egdev.es review, not `@egdev/ui` (OQ5).
- **`--effect-grid-size` 40px**: decorative background grid. If `--space-10` changes to 32px, the source comment "Coincide con --space-10" becomes false and must be updated; keep the value at 40px (OQ6).
- **Color tokens, gradients, fonts**: no size role.

### WCAG 2.5.8 (target size ≥ 24px) flags

- **Coarse-pointer touch targets:** 15 recipe sites use `min-h-11` / `pointer-coarse:min-h-11` / `h-11` (44px) — inputs, selects, tabs, menu items, chips, nav rows, slider hit area. ×0.8 moves them to **35.2px**: still above the WCAG 2.5.8 AA 24px minimum, but below the 44px best-practice convention (2.5.5 AAA). The coarse-pointer override is on the same scale as the desktop value, so the touch accommodation shrinks too (OQ2).
- **Checkbox:** fixed `size-4.5` (18px) → 14.4px visual control; it is intentionally bare and relies on the wrapping label row (`Field --choice` row goes 36→28.8px, still ≥24px) for the target. Documented behavior, unchanged design intent.
- **Slider:** visible track 24→19.2px, thumb 16→12.8px; the drag/hit area is the root (24→19.2px, coarse 44→35.2px). The thumb below 24px is a *visual*, not the sole target — the track hit area applies; still flag for review.
- **Small text:** labels/meta/code drop 14→11.2px, body-default 16→12.8px. This is exactly what 80% zoom looks like, but user-configured browser minimum font sizes (e.g. a 12px floor) will clamp 11.2px labels upward and can reflow dense rows. Flagged, not blocking.
- **Decorative dots/indicators** (`size-2` 8px → 6.4px): non-interactive; no target-size implication.

### Known exception — Gauge (numeric geometry contract)

Gauge's size axis is the approved numeric CSS-pixel custom property `--eg-gauge-size` (presets sm 40 / md 56 / lg 80). It is **not** token-bound and would not change. For consistency the preset numbers could become 32 / 44.8 / 64 (OQ4); the per-instance numeric API and the stylesheet-role approval are separate decisions per the shared contract.

## 2. Alternatives considered

1. **Re-value px tokens ×0.8 (recommended).** Single source of truth stays px; consumers keep identical utility names and get smaller values with zero code change; fractional Tailwind steps stay exactly proportional; reproduces the 80%-zoom reference exactly. Costs: one-time token churn; test updates (below); sub-pixel geometry on DPR-1 displays (cosmetic).
2. **Rem-based scale with a root factor.** Convert all size tokens to rem and scale via `html { font-size: 80% }` or a `--scale` factor. Pros: consumers gain a runtime zoom dial; system-level font-size preferences are respected. Cons: changes the unit model of every token and recipe; viewport-based clamps and px borders/focus geometry do not follow the root factor, producing mixed scaling; breaks every px-asserting test and the native-artifact contract; larger migration with no visual difference at the default factor. Rejected for T10; revisit if per-consumer zoom becomes a requirement.
3. **Whole-px rounding with 4px-grid snapping.** No sub-pixel rendering concerns, but the result is not a grid (4, 6, 10, 12, 16, 20, 22, 26, 32, 38, 44, 52, 64, 76), drift up to ±0.8px vs true 80% accumulates across multi-step gaps, and rounding the `--spacing` base breaks exact proportionality of fractional steps. Viable fallback (table above) only if the owner rejects sub-pixel values.
4. **CSS `zoom` / `transform: scale()` at the app root.** Zero token change, but blurs text, distorts viewport units and fixed positioning, and is not cleanly scoped per consumer. Rejected.
5. **Do nothing; users zoom.** Rejected — S13 explicitly asks for the corrected default.

## 3. Impact

### Code

- `packages/tokens/src/theme.css` — the only source file that must change (~44 values); regenerate `packages/tokens/src/tokens.css` via `pnpm tokens` (compiled artifact, not hand-edited).
- **No component recipes need edits**: all control heights, icon steps and paddings derive from `--space-*`/`--text-*`/`--icon-size`. Exception: Gauge presets only if OQ4 is approved.
- Docs that quote px values (`docs/tokens-reference.md`, `docs/MATERIAL.md`, component spec sheets, `docs/prop-naming.md` is unaffected) need a value pass; all new/updated docs in English.

### Tests asserting concrete px (expected to need updates when values change)

- `scripts/package-exports.test.mjs:2190-2193` — native artifact literals `--icon-size: 20px`, `--space-4: 16px`, `--space-7: 28px`.
- `scripts/package-exports.test.mjs:1526-1528`, `:1216-1219` — `rounded-sm/md` and ButtonGroup corner radii (4px/12px expectations).
- `scripts/package-exports.test.mjs:1706-1716` — countdown clamp literals (52/96/36/56px, column 14/32px).
- `scripts/package-exports.test.mjs:1727`, `:1460`, `:2143`, `:2730` — text-recipe fallback literals (14px/20px).
- `scripts/package-exports.test.mjs:1628` — `.eg-logo` height 32px (resolved from `h-8`).
- `scripts/package-exports.test.mjs:1939` — Switch thumb 16px travel (spacing-derived).
- `packages/ui/src/lib/storybook-branding.test.ts:19-20` and `storybook-theme.test.ts:7` — radius resolution maps (12px/4px).
- `packages/ui/src/lib/button-group-styles.test.ts:40`, `scripts/package-consumption.test.mjs:3229-3230`, `scripts/package-exports.test.mjs` radius fallbacks — `var(--radius-sm, 4px)` fallback literals.

### Tests expected to survive (assert `var()` references or unchanged geometry)

- `scripts/package-consumption.test.mjs:3565-3566` — RadioGroup row/radio assert `var(--space-10)`/`var(--space-5)` references.
- `scripts/package-consumption.test.mjs:5221` — Logo default `h-8` class membership.
- `scripts/package-consumption.test.mjs:2394, 2824, 4917` — 1px translate/hairline/sr-only (unchanged).
- `scripts/package-consumption.test.mjs:3154`, `scripts/package-exports.test.mjs:2726` — 860px media (unchanged breakpoint).
- `scripts/package-consumption.test.mjs:7204` — `--effect-grid-size: 40px` (unchanged value).
- `scripts/package-exports.test.mjs:957, 1624, 1644-1645, 1685, 1991, 2001` — shadow-focus/border/ring geometry (unchanged).
- `scripts/package-consumption.test.mjs:4869`, `packages/ui/src/lib/storybook-css.test.ts:402` — Gauge numeric geometry (unchanged unless OQ4).

Each touched assertion gets one behavior-level test updated together with the value change (RED on the new expected value first), per the project test discipline.

### Storybook / visual review

- Full visual pass of every atom/molecule story after the change: dense surfaces first (Menu, Chip/ChipGroup, Input/Select/Textarea, Tabs, NavList, Field), then displays (Stat, Countdown, PullQuote, SectionHeader, Toast).
- Side-by-side re-check against the S13 screenshot (Storybook Button stories vs Quorb settings at 80%) to confirm parity.
- Confirm focus rings (`--shadow-focus`), well shadows and the hairline border still read correctly next to smaller controls — geometry unchanged while boxes shrink, which is the intended Material outcome.
- Checklist of things that must NOT change: 1px borders, 2px focus ring, shadow/blur intensity, colors, motion.

## 4. Open questions for the owner

1. **OQ1 — Factor and rounding:** confirm ×0.8 with exact sub-pixel values (recommended), or the whole-px fallback table.
2. **OQ2 — Touch targets:** keep coarse-pointer minimums at 44px by decoupling them into an unscaled token (e.g. a dedicated touch-minimum token), or accept 35.2px? (WCAG 2.5.8 AA passes either way; 44px is the stronger convention.)
3. **OQ3 — Radii:** scale `--radius-sm…2xl` for proportion (recommended), or keep the current brand geometry?
4. **OQ4 — Gauge presets:** scale the numeric presets sm 40/md 56/lg 80 → 32/44.8/64, or leave the Gauge numeric contract untouched?
5. **OQ5 — Scope:** S13 covers `@egdev/ui` defaults. Are the egdev.es layout constants (`--nav-height`, `--gutter`, `--content-max`, breakpoints) in scope for a later pass?
6. **OQ6 — Effect grid:** keep `--effect-grid-size` at 40px and update its "coincide con --space-10" comment, or scale it too?
7. **OQ7 — Show register:** scale everything uniformly (recommended, matches 80% zoom), or hold the Show/marketing display sizes (`--text-display-show`, `--text-title-show`) at current values?
