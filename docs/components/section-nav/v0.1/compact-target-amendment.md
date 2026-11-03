# SectionNav v0.1 — compact target amendment

- **Status:** Approved by the owner on 2026-11-03.
- **Amends:** the compact pill height in the [SectionNav v0.1 plan](implementation-plan.md) §5. Every other part of the approved contract, plan and the [single landmark amendment](single-landmark-amendment.md) is unchanged.

## Problem found during implementation

The plan's compact pill uses `h-12`. In the delivered tokens that is `--space-12` = 38.4px. The plan also requires 44px targets and clips the pill's content. A clipped 38.4px pill cannot contain a 44px hit rectangle, and the plan says to stop for owner resolution rather than invent a dimension. The Unit A writer stopped there.

## Owner decision

Question: "SectionNav: la pill compacta aprobada mide h-12 = 38.4px con los tokens actuales, por debajo de los 44px que exige el plan. ¿Cómo lo resolvemos?"

Answer: "Pill compacta en h-14 / min-h-14, como Footer (Recomendado)".

## Amended recipe

| Part | Plan §5 | Amended |
|---|---|---|
| Compact pill (inclusive `width <= 520px`) | `h-12` (38.4px) | `h-14` (`--space-14` = 44.8px) |
| Compact disclosure and next controls | under 44px | `min-h-14`; `min-w-14` where a control could be narrower than 44px |

- **Unchanged:** the compact horizontal padding and every other compact utility.
- **Token reuse:** the existing `--space-14` token only, the same one the owner approved for the [Footer link-target exception](../../footer/v0.1/link-target-amendment.md). No new token, value or arbitrary size.
- **Media variants:** the amended utilities keep the plan's inclusive `width <= 520px` variant form and need the same production emission proof.
- **Chromium proof:** at 519, 520 and 521px, the compact pill and each control measure at least 44 × 44 CSS px, and the baseline pill above 520px is unchanged.
