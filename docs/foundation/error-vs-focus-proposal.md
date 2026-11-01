# Error vs focus — visual distinction proposal

Issue #219 (S12, L4). Owner: "Habría que ver como manejar los errores a nivel visual... porque da la
sensación que es un focus (se parecen muchísimo) y puede ser contradictorio para el usuario."

This document is a proposal only. It invents no tokens and changes no component; any option adopted
needs a spec/plan and owner confirmation for new token values.

## 1. Current focus ring inventory

| Token | Value | Notes (from `packages/tokens/src/theme.css`) |
|---|---|---|
| `--color-focus-ring` | `var(--color-primitive-red-neon)` #FF0036 | 5.31:1 on canvas; only 1.47:1 against red-dark |
| `--shadow-focus` | `0 0 0 2px #141518, 0 0 0 4px #FF0036` | 2px ring separated from the control by a 2px canvas gap |
| `--focus-width` / `--focus-offset` | `2px` / `2px` | Ring geometry knobs |
| `--shadow-ring-brand` | `0 0 0 3px rgba(255, 0, 54, 0.22)` | Soft halo adjacent to field borders (fields, not discrete controls) |
| `--color-focus-ring-inverse` | white | Focus over solid red fills (e.g. Select options) |

Two focus models coexist today:

- **Discrete controls** (Checkbox, Radio, Switch, Slider thumb): focus replaces elevation with the
  outer `shadow-focus` ring (2px neon + 2px canvas gap). Border color never changes.
- **Field controls** (Input, Textarea, Select): focus recolors the 1px border to
  `border-brand-strong` (red-dark #CC002B) and adds the 3px 22% neon `shadow-ring-brand` halo
  adjacent to the border — no gap, no outer ring.

## 2. Current error treatments per control

| Control | Error treatment (`aria-invalid`) | Source |
|---|---|---|
| Input | 1px border recolors to `status-danger` (red-300 #FF6680); same geometry as resting state; persists while focused | `packages/ui/src/atoms/input/types.ts:63` |
| Textarea | Same, kept above the hover/read-only resets | `packages/ui/src/atoms/textarea/types.ts:29` |
| Select | 1px border recolors to `status-danger` | `packages/ui/src/atoms/select/types.ts:74` |
| Checkbox | 1px border recolors to `status-danger`, only while unchecked | `packages/ui/src/atoms/checkbox/types.ts:75` |
| RadioGroup | None (state reaches the group, no visual) | `packages/ui/src/atoms/radio-group/types.ts` |
| Switch | None | `packages/ui/src/atoms/switch/types.ts:59` |
| Slider | None (aria-invalid is routed to the thumb, no style) | `packages/ui/src/atoms/slider/types.ts:6` |
| Field counter | Turns `status-danger` when over limit | `packages/ui/src/molecules/field/types.ts:103` |
| FieldMessage | `tone="error"` → `status-danger` text + status glyph (circle-alert), id wired to `aria-describedby` | `packages/ui/src/atoms/field-message/types.ts:39` |

## 3. Why error and focus feel identical

1. **Same color channel.** Error (red-300 #FF6680) and focus (neon #FF0036, red-dark #CC002B) are
   three shades of the same ~350° hue. Nothing else distinguishes them but lightness.
2. **Same surface, same geometry.** On field controls both states are a 1px border-color swap on the
   control's own border. Focus even shows a red halo around that border. A user glancing at a red
   border cannot tell "I am here" from "this is wrong".
3. **Halo ambiguity.** The field focus halo (soft neon, adjacent) and an invalid border (solid
   red-300) read as one red glow around the control at a glance.

Accessibility baseline every option must preserve:

- **WCAG 1.4.1 (Use of Color)** — the error state must not be conveyed by the red hue alone.
  FieldMessage already pairs the red with an icon and text; the control-state treatment should add
  at least one non-color cue (shape, width or fill).
- **WCAG 1.4.11 (Non-text Contrast)** — `status-danger` 6.49:1 on canvas and 4.82:1 on surface-3,
  `focus-ring` 5.31:1 on canvas, `focus-ring-inverse` 3.96:1 over neon: all pass the 3:1 threshold.
  The collision is semantic (which state is it?), not a contrast failure.
- **WCAG 2.4.7 / 3.3.1** — focus stays always visible; errors keep the message + `aria-invalid` +
  `aria-describedby` wiring Field/FieldMessage already provide.

## 4. Options

### Option A — Split the channels: border belongs to error, ring to focus (recommended)

- **Error**: 2px solid `status-danger` border (double the resting width) + tinted danger well inside
  the control + mandatory circle-alert glyph inside the control + FieldMessage text. The treatment
  persists through hover and focus. Applies to Input, Textarea, Select, Checkbox, Radio, Switch
  (unchecked + also checked errors) and the Slider thumb.
- **Focus**: one unified model for every control — the outer `shadow-focus` ring (2px neon with the
  2px canvas gap), as discrete controls already do. Field controls drop the focus border recolor and
  the adjacent halo.
- **Coexistence rule**: an invalid control that receives focus shows an inner red border and an
  outer ring separated by the dark canvas gap. Error lives inside, focus lives outside; they can
  never merge visually.
- **A11y**: strongest 1.4.1 compliance — three non-color cues (width, fill, icon). 1.4.11 holds
  (figures above). The canvas gap also fixes the today-documented weak pairing of focus-ring vs
  red-dark (1.47:1) because the ring no longer sits against a red border.
- **Token impact**: one new color token (e.g. `--color-status-danger-bg` tint; the existing
  `alpha-red-*` ramp is neon-hued, wrong for red-300) and one geometry token for the 2px invalid
  border (or reuse of a to-be-defined `--border-width-strong`). Both are token additions requiring
  owner confirmation. Component APIs need an inline icon slot (or a shared invalid-glyph recipe).

### Option B — Width and persistence contrast, no new tokens

- **Error**: recolor the border to `status-danger` as today but at 2px instead of 1px, and require
  the FieldMessage icon + text (already implemented) as the primary cue.
- **Focus**: unchanged (current two models stay).
- **A11y**: adds a width cue, satisfying 1.4.1 minimally (error = thicker red + icon; focus = hue
  and halo). Weakest of the three because error and focus still meet on the border.
- **Token impact**: none. Cheapest to implement; a pure recipe change in `types.ts` files.

### Option C — Lean on non-color cues

- **Error**: keep the red-300 border at 1px but make the in-control circle-alert glyph and the
  message mandatory, and add a structural cue (e.g. dashed border style or a `data-invalid`
  attribute consumers/theming can target).
- **Focus**: unchanged.
- **A11y**: best for color-blind users (state never depends on hue), but a dashed input border is
  unconventional and the red border still competes with the focus red at a glance.
- **Token impact**: no color tokens; per-control API change for the icon slot plus a documented
  `data-invalid` state attribute.

## 5. Recommendation

**Option A.** The root cause is that error and focus communicate through the same channel (the
control border) in the same hue. Only geometry separates them reliably: error as a thick, solid,
tinted, icon-carrying treatment inside the control; focus as an offset outer ring with a canvas gap.
It also unifies the two focus models that exist today, which is a standalone consistency win. If the
owner prefers to avoid new tokens now, Option B is the minimal fallback and can be upgraded to A
later without rework, since both reserve the border channel for error.
