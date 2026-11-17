# Semantic contrast roles — #425

**Status:** Approved — 2026-11-17 (owner, in session; odd/tasks/shared-app-theme-specs.md L2). Implementation plan follows the same delegation.  
**Issue:** [#425](https://github.com/egdev6/egdev-design-system/issues/425), split from [#404](https://github.com/egdev6/egdev-design-system/issues/404)

## Approval

The owner's recorded choices are “Sí, confirmo los alias”, “Mantener el neon actual”, “Agregar borde/tinte rojo como Nexo” and “Sí, igual que el 1 y 2” (`odd/tasks/shared-app-theme-specs.md` L2). D1 and D4 resolve to A; D2 resolves to B for both Link aliases; D3 resolves to B. The other 12 aliases resolve to A, for 14 aliases in total, without a new primitive. The implementation plan follows the same delegation; implementation and publication have not happened. Any new token value must return to the owner.

## Purpose and evidence

Give applications stable role names for the page/card/band/inset ladder and selected controls without creating another palette. #425 is an approved token contract, not an implementation of its eventual acceptance criteria. #426 and runtime accent #415 depend on #425; Panel accent edge #418 depends on #415; ColorSwatchGroup #416 is independent but may reuse #415's accent tokens.

- Current source is `packages/tokens/src/theme.css:19-31`, `:73-121`, `:150-173`, `:352`, `:380`, and `:524`. It has one dark theme; there is no light theme. Existing muted (`--color-fg-muted`), control border, danger and focus tokens already express those roles and stay valid.
- Quorb's read-only copy has a well with control border at `/home/egdev/proyectos/quorb/src/ds/egdev/components.css:1368-1374`, a primary switch at `:1545-1548`, and a banded card/footer at `:1731-1737`. Its older `/home/egdev/proyectos/quorb/src/ds/egdev/tokens.css:45-51` resolves raised brand ink to red-300; this is not the current package source. Quorb's selected segmented treatment is surface-3 at `components.css:1355-1359`.
- Nexo's `/home/egdev/proyectos/nexo/apps/hub/src/theme/family.css:4-22` paints surface-1 cards and surface-2 headers; `:41-55` adds red-selected tabs, a red slider range and red-200 links. Its controlled RadioGroup, Switch, Slider and segmented Tabs appear at `/home/egdev/proyectos/nexo/apps/hub/src/settings/index.tsx:41-55`, `:86-90` and `:145`. These are consumer evidence, not an approved global design.
- Current `--color-fg-brand-raised` is neon, not red-300; `docs/foundation/brand-text-neon-decision.md` records the owner's “Todo neón” decision and accepted small-text contrast trade-off. Historical wording in `docs/MATERIAL.md` and Quorb's copy predates that decision. The owner retained the current Link colors below; this does not supersede the global decision.

## Contrast method and limits

Values and aliases below were resolved from the actual `theme.css`, not comments or the old app copies. For each sRGB channel `c = byte/255`, linearize as `c/12.92` if `c ≤ 0.04045`, otherwise `((c+0.055)/1.055)^2.4`; luminance is `0.2126R + 0.7152G + 0.0722B`. Contrast is `(lighter L + 0.05)/(darker L + 0.05)`, rounded to two decimals only for display. `S0…S3` mean opaque surfaces `#141518`, `#1B1C20`, `#232428`, `#2D2E33`. Ratios apply to these base colors, not automatically to sheen, shadows, opacity, antialiased pixels, translucent overlays, gradients between stops, disabled controls or arbitrary consumer backgrounds. The WCAG reference thresholds are 4.5:1 for normal text and 3:1 for relevant non-text boundaries; a color ratio alone does not certify a component.

## Token confirmation table

All 14 rows describe **approved additions**, not current tokens. Values are dark-theme aliases to existing source values; no new primitive is needed. Option A is approved in every row except the two Link rows, where option B is approved. All ratios are computed against the stated intended foreground or surface.

| Proposed name | Option / value or existing reference | Role and intended surface | Computed contrast evidence |
| --- | --- | --- | --- |
| `--color-app-page` | A: `var(--color-surface-0)` = `#141518` | Page/window; foreground text | White 18.26:1; existing muted #A1A2A8 7.17:1 |
| `--color-app-card` | A: `var(--color-surface-1)` = `#1B1C20` | Solid card body; foreground text | White 17.02:1; muted 6.69:1 |
| `--color-app-card-header` | A: `var(--color-surface-2)` = `#232428` | Solid card header band; foreground text | White 15.50:1; muted 6.09:1 |
| `--color-app-inset` | A: `var(--color-surface-0)` = `#141518` | Recessed card footer/detail; foreground text | White 18.26:1; muted 7.17:1 |
| `--color-control-well` | A: `var(--color-surface-0)` = `#141518` | Input and control wells; foreground text | White 18.26:1; muted 7.17:1 |
| `--color-control-boundary` | A: `var(--color-border-control)` = `#7A7B81` | Resting enabled control boundary on S0/S1/S2/S3 | 4.33 / 4.04 / 3.68 / 3.21:1 respectively |
| `--color-state-selected` | A: `var(--color-action-primary-solid-bg)` = `#FF0036` | Solid selected control/range/underline and boundary on S0/S1/S2/S3 | 4.61 / 4.30 / 3.92 / 3.42:1; selected black ink 5.31:1 |
| `--color-on-selected` | A: `var(--color-action-primary-solid-fg)` = `#000000` | Switch thumb and radio dot on selected solid/gradient | 5.31:1 on neon; gradient stops 5.77 / 5.31 / 4.68:1 |
| `--color-state-selected-surface` | A: `var(--color-surface-3)` = `#2D2E33` | Raised segmented-tab selection inside S0 well | White 13.55:1; S0 versus S3 only 1.35:1, not a sufficient non-text cue by itself |
| `--color-link-default` | B: `var(--color-fg-brand-raised)` = `#FF0036` | Current Link default on S0/S1/S2/S3 | 4.61 / 4.30 / 3.92 / 3.42:1; normal text fails 4.5:1 on S1–S3 by owner decision |
| `--color-link-hover` | B: `var(--color-primitive-red-200)` = `#FF8FA6` | Current Link hover on S0/S1/S2/S3 | 8.46 / 7.89 / 7.18 / 6.28:1 respectively |
| `--gradient-state-selected` | A: `var(--gradient-btn-primary)` = `linear-gradient(180deg, #FF2D57 0%, #FF0036 52%, #EE0031 100%)` | Selected Switch/RadioGroup fill | Black against top/middle/bottom stops: 5.77 / 5.31 / 4.68:1; bottom versus S3 3.02:1. Intermediate rendered pixels and bevel remain to be verified |
| `--shadow-state-selected` | A: `var(--shadow-btn-primary)`; exact source `packages/tokens/src/theme.css:380` | Existing bevel/halo on selected controls | Not a uniform foreground/background color: no single contrast ratio; do not use halo as the only state cue |
| `--shadow-state-indicator` | A: `var(--shadow-glow-base)`; exact source `packages/tokens/src/theme.css:352` | Decorative underline glow on S0–S3 | Not a uniform color: no single contrast ratio; the selected line itself has the `--color-state-selected` ratios above |

Existing, **not proposed additions**: `--color-fg-default`, `--color-fg-secondary`, `--color-fg-muted`, `--color-status-danger`, `--color-status-danger-bg`, `--color-focus-ring` and `--shadow-focus` retain their names and values. Muted text against S0–S3 is 7.17 / 6.69 / 6.09 / 5.32:1; danger #FF6680 is 6.49 / 6.05 / 5.51 / 4.82:1 against those base surfaces. The translucent danger well needs compositing against its actual host, not these opaque ratios. The existing hairline and glow are decorative, not control boundaries.

## Resolved decisions and remaining evidence

**D1 — role and Material granularity: A.** Add the four app-surface aliases and separate control/selection roles above, while preserving Surface recipes, sheen, edges, wells and two-layer elevation. These aliases alone do not authorize an unrelated Material recipe.

**D2 — Link ink and hover: B.** Preserve neon rest and red-200 hover; the owner accepts that Link default normal text fails 4.5:1 on S1–S3. Its arrow can be hidden and its default is not underlined, so contrast to surrounding text and a non-color affordance remain contextual checks.

**D3 — selected segmented treatment: B.** Add a brand border and tint, retaining the approved S3 role and existing Surface well, sheen and elevation. All segmented triggers use `isolate border border-transparent`. The selected trigger uses `data-[state=active]:border-border-brand`, `data-[state=active]:bg-state-selected-surface`, `data-[state=active]:bg-[image:var(--gradient-sheen)]` and the existing `data-[state=active]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)]`. Its tint is a non-interactive pseudo-element with `data-[state=active]:before:content-['']`, `data-[state=active]:before:pointer-events-none`, `data-[state=active]:before:absolute`, `data-[state=active]:before:inset-0`, `data-[state=active]:before:-z-10`, `data-[state=active]:before:rounded-[inherit]` and `data-[state=active]:before:bg-border-brand`. Isolation keeps the tint above the background and below labels; retain focus precedence. Border and tint both use the existing `--color-border-brand` → `--color-alpha-red-45` = `rgba(255, 0, 54, 0.45)`. #415 already redeclares this role as `rgba(B, 0.45)` for a custom scoped accent; no new token value is required. If one proves necessary it is **pending owner value**, not invented. This is inspired by Nexo, not a claim of pixel parity: its local base and border differ. The S3-versus-well base comparison is only 1.35:1, and the translucent brand border is decorative. Measure the composed selected cue, stacking and focus in a browser; neither tint nor glow alone establishes 3:1.

**D4 — runtime scopes and portal inheritance: A.** Default aliases alone do not complete runtime theming. #415 specifies scoped propagation, derived colors, gradients/shadows, contrast validation and portals; its implementation and evidence remain pending. CSS aliases may resolve where declared, so a descendant override of an older token need not update an inherited alias. Nexo explicitly redeclares aliases and styles body-portalled content (`/home/egdev/proyectos/nexo/apps/hub/src/theme/accent.css:11-15`, `:45-53`, `:66-70`).

## Compatibility, distribution and migration

Old token names and values, dark theme, exports and legacy CSS remain unchanged. Color aliases are candidates for Tailwind's `@theme static`; gradient/shadow aliases are candidates for `:root`. Final placement must preserve both the named custom properties and generated utilities in native and Tailwind builds. The new names alone do not change consumers; #426 would change component defaults and may bypass apps' old scoped overrides. Do not remove Nexo's broad anchor, slider or selected-tab overrides, or Quorb's local bundle, merely because these aliases exist. Compare each actual consumer after implementation and separately approve any removal. #415 must cover explicit scope and body-portalled content; this proposal provides no arbitrary-accent contrast guarantee.

After an implementation plan under the same delegation, edit the manual `packages/tokens/src/theme.css`, not a compiled file. `pnpm tokens` invokes the root script in `package.json`, which runs the `@egdev/tokens` Vite build; `packages/tokens/vite.config.ts` compiles `packages/tokens/src/native.css` with `@tailwindcss/vite` to `packages/tokens/dist/tokens.css`, with optimization disabled to retain aliases and alpha values. `@egdev/tokens/tokens.css` exports that generated artifact (`packages/tokens/package.json`). Never hand-edit it. Native consumers import the built artifact; Tailwind consumers import the source theme.

## Acceptance and planned checks

| ID | Future acceptance | Planned evidence (not yet run) |
| --- | --- | --- |
| T-01 | The selected names/references/values and Link decision have recoverable owner confirmation; rejected choices are not implemented. | L2 and the approved table; bind the finalized spec version before publication. |
| T-02 | Approved roles resolve exactly as confirmed, existing names/values and both package CSS exports remain compatible. | Token contract tests for source and generated CSS; native and Tailwind consumer checks, including alias resolution. |
| T-03 | Solid-pair ratios in the table reproduce from source; gradient stop pairs and contextual alpha/overlay cases are tested separately. | Automated WCAG calculations without premature rounding; rendered browser inspection for sheen, focus and composite cases. |
| T-04 | Generation uses the approved source and produces the public native artifact. | `pnpm tokens`, then token contract tests; never hand-edit `dist/tokens.css`. |
| T-05 | No runtime accent or app-local override migration is implied; #415 specifies scope/portal propagation before that claim. | Consumer/portal tests in the implementation plan under the same delegation. |

Issue #425 lists `pnpm tokens`, `pnpm test`, and `pnpm typecheck` for future implementation. This documentation change has not run them or any browser review. Implementation evidence and any owner decision on a new token value remain open.
