# Runtime accent theming

- **Status:** Approved — 2026-11-17 (owner, in session; odd/tasks/shared-app-theme-specs.md L2). Implementation plan follows the same delegation.
- **Issue:** [#415](https://github.com/egdev6/egdev-design-system/issues/415); context [#404](https://github.com/egdev6/egdev-design-system/issues/404). The helper implementation is in the working tree; distribution and browser verification remain pending.
- **Dependencies:** [#425](https://github.com/egdev6/egdev-design-system/issues/425) supplies the shared contrast roles and their default values; [#426](https://github.com/egdev6/egdev-design-system/issues/426) governs their separate component adoption. [#418](../components/panel/v0.4/accent-edge-amendment.md) depends on this contract.
- **Scope:** opt-in, independently scoped user-selected accents for the existing dark Grafito theme. No light theme, persistence, picker or application effect is approved here. A new dependency or additional token value requires owner confirmation.

## Approval

The owner's choices are “Sí, confirmo los alias”, “Mantener el neon actual”, “Agregar borde/tinte rojo como Nexo”, “Sí, helper + variables por scope” and “Sí, igual que el 1 y 2” (`odd/tasks/shared-app-theme-specs.md` L2). D1–D7 resolve to their Recommended options: a pure helper and complete scope map, the stated derivation and reset, consumer-host styling, explicit portal hosting, no new dependency, and measured proof. The table incorporates Link option B and the existing-token segmented border/tint. The implementation plan follows the same delegation; distribution and browser evidence remain pending. Any additional token value is **pending owner value**.

## Evidence and problem

- Nexo parses and normalizes hex, derives three hues, and chooses contrasting ink in `/home/egdev/proyectos/nexo/apps/hub/src/settings/palette.ts:4-69`; its scoped mapping redeclares resolved aliases and recipes in `/home/egdev/proyectos/nexo/apps/hub/src/theme/accent.css:1-73`. Its flyout supplies variables at `/home/egdev/proyectos/nexo/apps/hub/src/App.tsx:312-328`. The body-portalled dialog currently finds a class and copies styles at `/home/egdev/proyectos/nexo/apps/hub/src/settings/add-local-dialog.tsx:27-39`. These are observations, not an approved algorithm or a contrast proof for all usages.
- Quorb independently normalizes the same input and derives its rings in `/home/egdev/proyectos/quorb/src/lib/palette.ts:4-64`; it uses them in `/home/egdev/proyectos/quorb/src/Settings.tsx:1658-1682`. Its local theme also consumes fixed primitive colors (`/home/egdev/proyectos/quorb/src/ds/egdev/tokens.css:9-76`). Its ring palette is application behavior, not evidence that all UI tokens can safely change.
- `packages/tokens/src/theme.css:18-31,78-113,158-173,359-382,523-526` defines existing primitives, aliases and recipes. In particular, the current neon text on `surface-3` is documented as **3.42:1**, not AA small-text contrast. `packages/ui/src/atoms/link/types.ts:72` directly uses red-200 for hover; `packages/ui/src/atoms/button/types.ts:75-87` and `packages/ui/src/atoms/switch/types.ts:61-62` use a gradient, a baked shadow and focus shadow. A variable-only change cannot promise every existing primitive-based usage will adopt it.
- `DialogContent` already exposes a ready, same-document `container` (`packages/ui/src/molecules/dialog/types.ts:51-64`) and passes it to Radix Portal (`packages/ui/src/molecules/dialog/Dialog.tsx:23-27,58-59`). It is not a provider or an automatic theme bridge.

## Approved consumer contract

**Approved:** a dependency-free, pure `createAccentTheme(input: string | null | undefined)` helper, exported from `@egdev/tokens/accent`, plus the exact CSS custom-property map below. It returns `{ normalizedAccent, mode, variables }`, where `mode` is `'default' | 'custom'`, `variables` is an immutable complete map of the table's names to CSS strings, and `normalizedAccent` is lower-case six-digit `#rrggbb`. Its implementation plan follows the same delegation and covers package/distribution changes; no React provider is required. The helper does not write the DOM, manage persistence, inspect classes or own component state.

A consumer applies the **entire returned map** to its own theme host, never to a Panel or other component whose `style` API is prohibited. This approves one narrowly scoped exception for runtime custom properties on that consumer-owned host: it is not permission for arbitrary inline component appearance, handwritten Material, gradients or dynamic Tailwind classes. The helper supplies validated, materialized values rather than arbitrary consumer CSS. A lower-level CSS-only implementation may set precisely the same complete map on a host, but it must perform the same validation and checks; changing only a primitive or one alias is unsupported and carries no contrast guarantee. `var()` references may already have resolved at an ancestor, so merely overriding a red primitive locally does not reliably retheme inherited semantic aliases.

Input policy: trim whitespace; accept only three or six hexadecimal digits with an optional leading `#`, case-insensitively; expand shorthand and normalize to lower-case six-digit form. Empty, malformed, alpha-bearing, non-string at an untyped boundary, `null` or `undefined` use `#ff0036` and `mode: 'default'`, without throwing or partial mutation. The normalized default red also selects default mode. Switching back to default emits the **complete exact original values** in the table, including gradients/shadows, so a default subtree nested inside a custom host resets to red instead of inheriting its parent. Default mode preserves existing design, including its documented contrast limitations; it does not claim the custom-mode guarantee. No `:root` mutation, automatic global reset or host lifecycle is owned by the helper.

For a custom value, let `A` be the normalized input and `S3` be `--color-primitive-graphite-750` (`#2D2E33`). Using sRGB 8-bit channels, `mix(X, Y, t)` is channel-wise interpolation rounded to the nearest integer, with halves rounded up. Set `Smax = mix(S3, white, 0.045)`: it conservatively includes the strongest existing 4.5%-white Surface sheen on the lightest solid Grafito level. For WCAG contrast, linearize each channel `c = byte/255` as `c/12.92` when `c ≤ 0.04045`, otherwise `((c+0.055)/1.055)^2.4`; luminance is `0.2126R + 0.7152G + 0.0722B`, and contrast is `(lighter + 0.05)/(darker + 0.05)`, without rounding the ratio before comparison.

In increasing integer steps `i = 0…255`, select the first `B = mix(A, white, i/255)` for which **both** contrast `B` versus Smax and black versus `mix(B, black, 0.28)` are at least **4.6:1**. The 0.1 margin targets a measured minimum of 4.5:1 after serialization/compositing. This preserves the input where safe, otherwise lightens it; white necessarily passes both tests for the current Grafito ladder. Use the actual rounded channels when evaluating. Set `H = mix(B, white, 0.10)`; the accessible solid ink is existing `--color-primitive-black`. White-mixed gradient stops are component-wise no darker than B. The 28% black-composite check conservatively covers the existing bottom bevel on the primary rest shadow; browser tests must measure the real rendered result, including hover and focused states. These are steady-state bounds, not proof for interpolated theme transitions. No claim is made about arbitrary external colors, transparent overlay backdrops, forced colors, consumer-overridden surfaces or the default-red path. Where the actual background/composition is unknown, use a supported solid surface or a separately contrast-checked fallback rather than assert a guarantee.

### Token confirmation table

**Approved:** the following dark-only names, defaults and derived custom-mode values; no primitive is added. The first group contains existing source tokens, including the brand role shared by the segmented border and tint. The second contains the shared #425 roles. The complete map must redeclare both groups at the same host; inherited aliases can otherwise freeze at the ancestor. Defaults are explicitly reproduced for nested resets. `rgba(B, a)` means the rounded sRGB channels of B and the stated alpha; `mix` is the materialized calculation above, not a required CSS `color-mix()` feature. No ratio below is an observed new runtime test.

| Existing or approved token / intended role | Default red value, dark | Approved custom value, dark | Intended surface and contrast evidence / limit |
| --- | --- | --- | --- |
| `--color-fg-brand-default` | `var(--color-primitive-red-neon)` | B | Text/marker on solid surface-0…3, including their existing sheen: B vs Smax ≥4.6:1; default neon is 3.42:1 on bare surface-3. |
| `--color-fg-brand-raised` | `var(--color-primitive-red-neon)` | B | Same surfaces and computed bound; no promise on tinted or translucent backgrounds. |
| `--color-fg-brand-hover` | `var(--color-primitive-red-light)` | H | Same solid surfaces; H is no darker than B. Direct primitive-based hover is not covered. |
| `--color-border-brand` | `var(--color-alpha-red-45)` | `rgba(B, 0.45)` | Decorative border on Grafito; composited ratio not guaranteed, never the sole control boundary. |
| `--color-border-brand-strong` | `var(--color-primitive-red-dark)` | B | Boundary on solid surface-0…3: ≥4.5:1 by construction, exceeding the 3:1 non-text target. |
| `--color-action-primary-solid-bg` | `var(--color-primitive-red-neon)` | B | Solid fill; black ink ≥4.5:1 even under the stated 28% bevel check. |
| `--color-action-primary-solid-bg-hover` | `var(--color-primitive-red-light)` | H | Solid hover fill; same black-ink lower bound as B. |
| `--color-action-primary-solid-fg` | `var(--color-primitive-black)` | `var(--color-primitive-black)` | Text/indicator on custom solid and primary stops: ≥4.5:1 by construction; verify rendered bevel. |
| `--color-focus-ring` | `var(--color-primitive-red-neon)` | B | Outer ring against solid surface-0…3 ≥4.5:1; other backgrounds require separate verification. |
| `--shadow-focus` | `0 0 0 2px #141518, 0 0 0 4px #FF0036` | `0 0 0 2px #141518, 0 0 0 4px B` | Existing geometry; gap separates fill from ring. B vs supported adjacent surfaces ≥4.5:1; verify actual focus/clipping. |
| `--gradient-btn-primary` | `linear-gradient(180deg, #FF2D57 0%, #FF0036 52%, #EE0031 100%)` | `linear-gradient(180deg, H 0%, B 52%, mix(B, white, 0.03) 100%)` | Black text/indicator: stops and their sRGB interpolation ≥4.5:1 under the conservative bevel check. |
| `--gradient-btn-primary-hover` | `linear-gradient(180deg, #FF4A6E 0%, #FF1A49 52%, #F00033 100%)` | `linear-gradient(180deg, mix(B, white, 0.15) 0%, mix(B, white, 0.07) 52%, B 100%)` | Same black-ink bound; real hover rendering remains a required check. |
| `--shadow-btn-primary` | `inset 0 1px 0 rgba(255, 255, 255, 0.38), inset 0 -1px 0 rgba(0, 0, 0, 0.28), 0 1px 2px rgba(0, 0, 0, 0.6), 0 8px 22px -8px rgba(255, 0, 54, 0.7)` | Same geometry and first three layers; last layer `0 8px 22px -8px rgba(B, 0.7)` | Decorative halo; no standalone contrast promise. The 28% black inset is included in the fill check. |
| `--shadow-btn-primary-hover` | `inset 0 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 0 rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 0, 54, 0.35), 0 10px 30px -6px rgba(255, 0, 54, 0.75)` | Same geometry and first three layers; last two layers `0 0 0 1px rgba(B, 0.35), 0 10px 30px -6px rgba(B, 0.75)` | Decorative halo; its 25% black inset is bounded by the 28% check; inspect actual rendering. |
| `--color-state-selected` (#425) | `var(--color-action-primary-solid-bg)` | B | Selected solid/range/underline on surface-0…3; B vs Smax ≥4.6:1. |
| `--color-on-selected` (#425) | `var(--color-action-primary-solid-fg)` | `var(--color-primitive-black)` | Indicator on custom solid/selected gradient; conservative black-ink bound ≥4.6:1. |
| `--gradient-state-selected` (#425) | `var(--gradient-btn-primary)` | Same fully materialized custom value as `--gradient-btn-primary` above | Black indicator against stops and bevel has the same bound; browser proof pending. |
| `--shadow-state-selected` (#425) | `var(--shadow-btn-primary)` | Same fully materialized custom value as `--shadow-btn-primary` above | Decorative bevel/halo; the 28% black inset is included in the fill check. |
| `--shadow-state-indicator` (#425) | `var(--shadow-glow-base)` = `0 4px 20px 0 rgba(255, 0, 54, 0.15)` | `0 4px 20px 0 rgba(B, 0.15)` | Decorative underline glow only; no independent contrast guarantee. |
| `--color-link-default` (#425 option B approved) | `var(--color-fg-brand-raised)` = `#FF0036` | B | Default mode keeps existing neon and fails 4.5:1 for normal text on S1–S3 by owner decision; custom B vs Smax ≥4.6:1. Distinction from surrounding text remains contextual. |
| `--color-link-hover` (#425 option B approved) | `var(--color-primitive-red-200)` = `#FF8FA6` | H | Default mode keeps existing hover. Custom hover ink against supported surfaces has at least B's bound; a non-color link cue still requires contextual review. |

`B` and `H` in CSS values above are placeholders for fully serialized color literals, not extra CSS tokens. Preserve the existing expressions for default values and materialize them against the same default theme at the host; no self-referential `var(--same-name)` declaration is permitted. The #425 rows reflect the approved defaults, including Link B; default mode produces no Link visual change. The #425 page/card/well/selected-surface roles remain unchanged. For D3, the existing `--color-border-brand` supplies both the selected segmented border and its non-interactive tint; both follow the already specified `rgba(B, 0.45)` in custom scopes, while S3 and `--gradient-sheen` stay unchanged. No additional token value is introduced. Status/danger, neutral/surface, logo, Show, inverse-focus, red primitives and alpha primitives are **not** overridden. Secondary/chip/progress/Show gradients and their halos are outside this contract and may remain red. In particular, hover and other UI that directly use `--color-primitive-red-200`, `--color-primitive-red-neon` or red-alpha utilities do not automatically retheme. Migrating those usages to appropriately approved semantic roles, and any expansion of this table, requires its own scoped approval after #425/#426; do not claim full-application retheming or override the danger primitive to fake it.

## Portals, compatibility and migration

A theme follows **DOM ancestry**, not the React tree. Place a ready, connected same-document portal host within the intended theme host and pass that host as `DialogContent container={host}`; render content only after the host is ready. Use `overlayScope='viewport'` when mount-only/viewport placement is intended, or the existing default container scope with a positioned, non-scrolling suitable host. Viewport scope can still be clipped or get a fixed-position containing block from ancestors; custom hosting does **not** localize Radix's document-wide modality. Close the dialog before replacing or removing its host. An omitted/null container uses body and inherits body's theme, not the trigger's nested scope. React context does not change CSS inheritance. Other portal components are supported only if their public API supplies an appropriate host; otherwise use a correctly scoped body or keep their current colors and report the limitation. No probing `.local-app-dialog` or setting styles on component internals.

For example, a React consumer can use a native theme host and a ready portal host (the cast is for React's `CSSProperties`, not a component style override):

```tsx
import { useState, type CSSProperties } from 'react';
import { createAccentTheme } from '@egdev/tokens/accent';
import { Dialog, DialogContent, DialogTrigger } from '@egdev/ui';

function SettingsDialog({ accent }: { accent: string }) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const theme = createAccentTheme(accent);
  return (
    <div style={theme.variables as CSSProperties}>
      <div ref={setHost} />
      {host && <Dialog>
        <DialogTrigger>Open settings</DialogTrigger>
        <DialogContent container={host} overlayScope='viewport' title='Settings'>
          Settings content
        </DialogContent>
      </Dialog>}
    </div>
  );
}
```

With the helper, Nexo can apply one complete map to the flyout and mount Dialog in an explicitly themed host, removing its class-probing workaround only after package adoption and portal verification. Its independently used three-ring preview may retain its own algorithm: this proposal deliberately changes dark custom colors to meet UI contrast and does not promise pixel parity. Quorb may opt in later; its ring settings and local legacy CSS do not migrate automatically. Existing apps that do not opt in retain exact tokens and rendered defaults. CSS-only and precompiled package consumers need the same emitted rules and values; any scope reset, SSR/hydration, theme transition and ordering behavior must be tested rather than inferred from types. The helper performs no persistence or effect cleanup.

## Acceptance and checks

The #425 choices, this table and the host-only appearance exception are approved; the implementation plan follows the same delegation. Parent-observed RED exists, but passing package, browser and rendering evidence remains pending. Additional token values still require owner confirmation.

| ID | Observable contract | Planned evidence |
| --- | --- | --- |
| AC-01 | Valid shorthand, case and whitespace normalize identically; invalid values, null, undefined and untyped non-strings deterministically return the complete default map. | Pure public-helper tests including `#000`, `#fff`, `#0000aa`, `#777777`, `#ffffff`, `#123456`, malformed/alpha input and default red. |
| AC-02 | For every custom sRGB input the algorithm terminates with the two bounds, serialized colors and complete table map; no partial mutation or new dependency. | Mathematical proof plus deterministic exhaustive or equivalently justified boundary/rounding tests; compare all stops and 28% composite against WCAG formula. |
| AC-03 | Sibling and nested hosts update independently; default red nested inside a custom host and custom → default reproduce exact original computed values, not inherited ancestor values. | Browser computed-style tests, native compiled CSS and packed consumers without Tailwind; CSS alias resolution and React 18/19 integration. |
| AC-04 | Primary button, switch, radio and checkbox receive custom gradient/ink/focus and retain their interactions; after #426 adoption, selected roles and Link receive scoped values, and the segmented border/tint both follow custom B. Default Link red/hover and the existing brand border reset exactly. | Public interface/keyboard tests and computed-paint screenshots including hover, active, disabled, invalid and focus; verify contrast including sheen, bevel and all gradient stops, segmented stacking and live transitions. |
| AC-05 | Dialog inherits the intended scope without selector probing; container and viewport placement, body default, live color change, nesting and cleanup do not leak. | Real-browser focus, dismissal, clipping, stacking and computed-style checks in supported WebView2; host ready/removal and document-wide modality scenarios. |
| AC-06 | Focus remains visible on the documented solid surfaces; status/danger and unsupported primitive-backed usages retain their documented behavior. | Actual focus ring/adjacency and forced-colors tests; compare error semantics and explicit out-of-scope cases. Record failures, unsupported surfaces and fallback separately. |
| AC-07 | Consumers can recover the full map and limitations, and default tokens/dependencies remain unmodified without confirmation. | Public package/export, documentation, type, source-diff and dependency audit; CSS-only parity. |

## Resolved decisions and remaining evidence

- D1 — **Approved:** pure helper and complete explicit host map; no React provider, root mutation or DOM probing.
- D2 — **Approved:** the explicit B/H derivation and black ink for custom mode, preserving the exact current red path separately. This is not Quorb's ring-palette algorithm.
- D3 — **Approved:** the reconciled table only, including the existing brand role used by the segmented border and tint; exclude status, red primitives and unsupported recipes. Do not claim unsupported usages change.
- D4 — **Approved:** deterministic full default map, including invalid input, so nested themes cannot accidentally inherit a parent's custom values.
- D5 — **Approved:** consumer-supplied, ready Dialog `container` inside the theme host; other portals remain unsupported until their public mounting API permits the same behavior.
- D6 — **Approved:** no new dependency and no reliance on browser `color-mix()` for derived values; verify supported WebView2 and packaged consumers.
- D7 — **Approved:** require measured browser focus/fill tests and real captures in the implementation plan under the same delegation. Those checks and visual evidence remain pending; the algorithm and source comments are not observed runtime proof.

## Implementation and mathematical boundary

The source helper supplies the approved 21 properties and freezes each returned variable map. The `development` export resolves to source for workspace tooling; the package's JavaScript export is built separately and its declaration describes the same API. The Dialog example uses its existing ready-host API and does not add a provider or modify component internals. The `RuntimeAccent` Dialog story demonstrates a changing custom host, a nested default reset and an explicitly hosted portal.

For any accepted custom input, the search considers the rounded colors for each step from 0 through 254 in order, then uses white for step 255. The strongest surface is `#36373c`, with every channel at most 60; white against that surface exceeds 4.6:1. The rounded 28% black composite of white is `#b8b8b8`, which also exceeds 4.6:1 against black. Therefore a passing candidate always exists, and the first returned candidate meets both bounds. Channel-wise white mixing cannot darken a passing candidate; the custom gradient stops and their stated black composites retain the same conservative bounds. Ratios are compared without rounding. This proof covers the specified solid surfaces and steady-state calculations only, not rendered antialiasing, transitions, clipping or other backgrounds.

The deterministic tests cover examples and channel/rounding boundaries, but they do not replace the required real-browser focus, fill, portal, packed-consumer and contrast evidence. No measured browser result is claimed here.
