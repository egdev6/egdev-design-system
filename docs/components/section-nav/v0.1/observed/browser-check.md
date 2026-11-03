# SectionNav v0.1 — parent browser check

- **Environment:** Chromium headless shell 153.0.8010.12, Storybook dev (branch `feat/layer-d-section-nav`), dark theme, DPR 1.
- **Probes:** parent-owned scripts outside the repository; values below are copied from their output.
- **Scope:** measured with the [single landmark](../single-landmark-amendment.md), [compact target](../compact-target-amendment.md) and [Popover close auto-focus](../../../popover/v0.1/close-autofocus-amendment.md) amendments applied.

## Placement and targets (SN-06, gate 2)

| Viewport | Root | Pill height | "Open section index" | "Go to work" |
|---|---|---|---|---|
| 390, 519, 520, 521, 1280 | `position: fixed`, 19.2px from right and bottom (`--space-6` + safe-area insets), `z-index: 10` | 44.8px | 92.2 × 44.8px | 44.8 × 44.8px |

- Every own control meets 44 × 44 CSS px at, below and above the inclusive 520px boundary.
- No horizontal overflow at any width. With long localized names at 390px, nothing is clipped and the root stays inside the viewport.
- Root `transition-property: none`.

## Landmarks and Popover protocol (SN-01, SN-02; gate 1)

| State or action | Observed |
|---|---|
| Closed | One navigation landmark; trigger `aria-expanded="false"`; no dialog. |
| Open (Enter on the trigger) | `aria-expanded="true"`; one dialog named "Page sections"; still one navigation landmark, none inside the dialog; focus moves into the dialog. |
| Index list | An `ol` of `#overview` (`aria-current="location"`), `#work`, `#contact`. |
| Escape | The dialog closes and focus returns to the trigger. |
| Enter on `#contact` | The URL hash becomes `#contact`, the dialog closes, and focus stays on the destination section (`id="contact"`), not the trigger. This is `onCloseAutoFocus` after real navigation. |
| Outside pointer press | The dialog closes; Radix does not force focus back to the trigger. |

## Overlay paint (SN-07, gate 3)

| Element | Default | `prefers-reduced-transparency: reduce` (CDP emulation) |
|---|---|---|
| Pill | `rgba(35, 36, 40, 0.84)`, `backdrop-filter: blur(20px) saturate(1.5)`, `1px solid rgba(255, 255, 255, 0.14)` (strong hairline), full radius, two-layer edge and elevation shadow | Solid `rgb(35, 36, 40)` and no backdrop filter |
| Index panel | The same overlay recipe | — |

Under `prefers-reduced-motion: reduce`, no SectionNav element has an effective transition.

## Defect found and fixed: user-agent paint

The package ships without preflight. The first Chromium pass showed:
- the disclosure trigger as a light grey user-agent button with black text;
- the index links in the default `#0000EE` blue with underline, nearly unreadable on the dark panel;
- the next arrow in user-agent blue.

See [open-1280-before-ua-reset-dark.png](open-1280-before-ua-reset-dark.png).

**Fix:**
- Trigger: `border-0 bg-transparent p-0 font-sans text-body-default text-fg-default cursor-pointer`, the NavList reset pattern.
- Next link: `text-fg-default`.
- Index links: `text-fg-default no-underline`, keeping `aria-[current=location]:underline`.

All are existing token utilities, proven to emit. A failing test came first, then the fix. The `types.ts` hash changed, and the registry usage and exception receipt were refreshed before commit.

**After the fix** ([open-1280-dark.png](open-1280-dark.png)):
- The trigger, the next link and every index link render `rgb(255, 255, 255)` on the panel: about 15.5:1 against its translucent background composited on the dark page.
- Only the current location is underlined.

## Not evaluated

Real screen-reader sessions (landmark and dialog announcements), native browser zoom, coarse-pointer devices, real safe-area insets, host stacking against other fixed UI, and pixel comparison with VIS-01/02.
