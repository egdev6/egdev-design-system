# Button — large size amendment

- **Status:** Approved by the owner on 2026-11-03.
- **Amends:** the delivered Button `size` variant (`packages/ui/src/atoms/button/types.ts`). Additive: one new value. Existing `md` (default) and `sm` sizes, every other variant, and all defaults and behavior are unchanged.
- **Required by:** the layer (e) scene organisms Hero (#318) and Closing (#319). Their approved plans require CTA targets of at least 44 × 44 CSS px; Hero's plan makes an unmet target a stop condition.

## Problem found during implementation

Chromium measured the delivered Button at 38.4px high in the Closing stories. Button's largest size, `md`, is `min-h-12` (`--space-12` = 38.4px), and its `className` is limited to outer placement. A consumer therefore cannot reach the 44px target with the public Button API.

## Owner decision

Question: "El Button entregado mide como máximo 38.4px de alto (size md = min-h-12), así que los CTAs de Hero y Closing no llegan a los 44px que venimos exigiendo. ¿Cómo lo resolvemos?"

Answer: "Enmienda de Button: tamaño lg con min-h-14 (Recomendado)".

## Amended API

| Value | Recipe |
|---|---|
| `size="lg"` (new) | `min-h-14` (`--space-14` = 44.8px), the same token the owner approved for the Footer and SectionNav targets. Padding, gap, typography and icon size follow the existing `md` recipe, scaled only with existing tokens. |

- **No new tokens:** no arbitrary sizes and no change to `md` or `sm`. The default size stays `md`.
- **Naming:** the existing `size` registry usage for Button records the extended union and the new `types.ts` revision. No new convention.
- **Docs and Controls:** Storybook docgen and Controls list `lg` among the `size` options.
- **Scene stories:** Hero and Closing stories use `size="lg"` for their CTAs to demonstrate compliant consumer composition. Target size stays a consumer obligation as their specs state.
- **Chromium proof:** `lg` measures at least 44 × 44 CSS px with and without an icon, and `md`/`sm` are unchanged.
