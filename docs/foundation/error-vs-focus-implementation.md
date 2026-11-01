# Error vs focus — Option A implementation (issue #219, part B)

Status: implemented. Owner decision recorded 2026-11: **Option A — "dentro vs fuera"** (error lives
inside the control, focus lives outside), approving the two new tokens it needs. Brief:
`docs/foundation/error-vs-focus-proposal.md` (§4 Option A). Spec: `odd/tasks/visual-review-corrections.md`
S12, L4, L11.

## 1. Token additions (owner-approved)

Added to `packages/tokens/src/theme.css` and compiled into `dist/tokens.css` with `pnpm tokens`:

| Token | Namespace | Value | Purpose |
| --- | --- | --- | --- |
| `--color-status-danger-bg` | `@theme static` (Tailwind color) | `color-mix(in srgb, var(--color-status-danger) 12%, transparent)` | Tinted danger well inside an invalid control. Owner picked **option 1**: derived from the existing `--color-status-danger` primitive (red-300 `#FF6680`) at 12%, mirroring the `alpha-red-12` brand-tint precedent (`--color-action-primary-bg-default`). No new color literal is introduced; the existing `alpha-red-*` ramp was rejected by the proposal as neon-hued. |
| `--border-width-invalid` | `:root` | `2px` | Invalid control border width. Doubles the resting 1px control border to the 2px focus geometry, so width itself is a non-color error cue (WCAG 1.4.1). |

`--shadow-ring-brand` remains defined in the theme but is no longer consumed by any control recipe;
removing it is a follow-up token-cleanup decision (out of scope here).

## 2. The two channels

- **Error (inside)** — driven by the native `aria-invalid` attribute through Tailwind `aria-invalid:`
  variants, never a mirrored class or own state:
  - 2px solid `status-danger` border (`border-status-danger` + `border-(length:--border-width-invalid)`).
  - Tinted well (`bg-status-danger-bg`) on well controls.
  - In-control decorative `circle-alert` glyph (`status-danger` color, `aria-hidden`) on **Input** and
    **Select**, rendered only while invalid, from the native attribute.
  - Persists through hover and focus (`aria-invalid:hover:` / `aria-invalid:focus-visible:` restatements).
- **Focus (outside)** — one unified model: the outer `shadow-focus` ring (2px neon + 2px canvas gap).
  - Input, Textarea (all variants) and Select drop the focus border recolor
    (`border-brand-strong`) and the adjacent halo (`shadow-ring-brand`); the well shadow is kept
    alongside the ring (`shadow-[var(--shadow-well),var(--shadow-focus)]`).
  - Discrete controls (Checkbox, Radio, Switch, Slider thumb) already used `shadow-focus`; unchanged.
- **Coexistence** — an invalid focused control shows the inner 2px danger border plus the outer ring
  separated by the canvas gap; error and focus can never merge visually.

## 3. Per-control treatment

| Control | Invalid recipe | In-control glyph |
| --- | --- | --- |
| Input | 2px danger border + tinted well, persisting through hover/read-only/focus | Yes (takes the trailing slot; the Spinner yields while invalid) |
| Textarea | Same, on `default`, `code` and `prose` | No — see §4 |
| Select | Same on the trigger; also while `data-state=open` | Yes (left of the chevron) |
| Checkbox | 2px danger border + tinted well while **unchecked** (unchanged scope) | No |
| RadioGroup | The group root is the `group`; invalid groups tint unchecked wells and double every radio border, including checked ones | No |
| Switch | 2px danger border + tinted well unchecked; checked errors keep the opaque primary fill and get the danger border only | No |
| Slider | Thumb (where `aria-invalid` is routed): 2px danger border + tinted fill | No |

Field and FieldMessage need no change: Field already routes `aria-invalid` to the compatible control,
and FieldMessage `tone="error"` already pairs the red with the circle-alert glyph and text.

## 4. Documented exceptions

- **Textarea carries no in-control glyph.** It renders a bare native `<textarea>`; an overlay glyph
  would need a new wrapper element (a DOM-contract change) and would occlude editable multi-line
  text. The glyph cue is provided by the adjacent FieldMessage.
- **Discrete controls (Checkbox, Radio, Switch, Slider) carry no glyph**: an 18–20px control cannot
  hold a readable icon. Their non-color cues are the doubled border width and the well fill, plus
  the mandatory FieldMessage icon + text.
- **Checked errors keep the primary fill** (Switch, Radio, Checkbox): the well tint would be
  invisible beneath the opaque brand gradient, and the on-state must stay legible; the danger border
  (width + color) is the error cue there.

## 5. Verification

- Tokens: `pnpm tokens` regenerates `dist/tokens.css`; `pnpm --filter @egdev/tokens run test` locks
  the two new values and the updated declaration counts (213 utility / 56 root / 285 total / 53 aliases).
- Per control: RED→GREEN vitest runs over the seven control suites (invalid recipe present, unified
  outer focus, both coexisting, glyph conditional on the native attribute).
- `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs` closed CSS
  allowlists were extended only with what option A needs (commented): the invalid border-width and
  tinted-well utilities and the unified focus-ring shadow, and the removed field-halo expectations.
- Storybook color inventory: the derived token renders as card 82; JSDOM cannot compute
  `color-mix()`, so its two figures are compared from the canonical declaration in the test mock.
