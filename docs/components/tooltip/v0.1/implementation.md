# Tooltip v0.1 implementation evidence

## Spec identity

- Issue: [egdev6/egdev-design-system#75](https://github.com/egdev6/egdev-design-system/issues/75), frozen v0.1 body (whole-body SHA-256 `7dd47ef088342aeca2ea20702c216505c3698afad8640e73dbd3c8cc47290885`, canonical SHA-256 `357a811419ff1f998a955cd57814f41101e48b1dbb4063a8e3ae89e0b4fe5d8b`) and the owner full-contract approval comment on that issue.
- Expected design: VIS-01 `tooltip--specimen.png` (`sha256:99bc5c6ab1f184f2583d48c4b3fb762cd835a1f448e7f67681d98e1da1a64b42`).
- Scope: one atom. The only dependency is `@radix-ui/react-tooltip` 1.4.1 (exact), named by D1 and added in its own commit. No token change. This does not establish catalog-wide M3 compliance.

## Decisions applied

| Decision | Implementation |
| --- | --- |
| D1 Radix base | `import * as TooltipPrimitive from '@radix-ui/react-tooltip'`; its own `TooltipPrimitive.Portal` renders the bubble. No separate Portal primitive. |
| D2 API shape | One `Tooltip` wrapping `children` through `TooltipPrimitive.Trigger asChild`; no public Root/Trigger/Content parts. |
| D3 Provider | Each Tooltip renders its own `TooltipPrimitive.Provider`; works without app setup. No shared skip-delay. |
| D4 Content | `content: string`, rendered as the Radix Content text. |
| D5 Placement | `side` (`top` default, `right`, `bottom`, `left`); `align: 'center'` and `sideOffset: 8` (`TOOLTIP_SIDE_OFFSET`, equal to `--space-2`) are fixed in the hook; Radix collision handling flips the side. |
| D6 Delays | Radix defaults (700 ms open, 300 ms skip); no delay props. |
| D7 Open state | Uncontrolled; no `open`, `defaultOpen` or `onOpenChange`. |
| D8 Material | Overlay recipe: `bg-surface-overlay backdrop-blur-[var(--blur-overlay)] backdrop-saturate-150`, `border border-border-hairline-strong`, `shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]`; under `prefers-reduced-transparency: reduce` it becomes `bg-surface-2` with `backdrop-blur-none backdrop-saturate-100`. No arrow. |
| D9 Shape and type | `rounded-sm px-2 py-1` (`--space-2` × `--space-1`), `text-label-default font-sans text-fg-default`. |
| D10 Motion | `transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)] starting:opacity-0` (`@starting-style`), `motion-reduce:transition-none`. No transform, no animation token, immediate exit. |
| D11 Width | `max-w-[var(--radix-tooltip-content-available-width)]`. |
| D12 Stacking | No z-index utility; the Radix portal appends to `document.body`. |
| D13 Disabled triggers | Not handled; documented in the story guidelines. |
| D14 Stylesheet | No stylesheet. `compiled.css` gains `@source "../atoms/tooltip/types.ts"`. |

## Files

`types.ts` holds `TooltipProps` (a plain type literal: no native or Radix props are inherited) and the public `tooltipVariants` CVA base. `useTooltip.ts` resolves the default side, the fixed `align`/`sideOffset` geometry and the bubble classes with `cn()`, consumer `className` last. `Tooltip.tsx` is Radix JSX only. `Tooltip.test.tsx`, `Tooltip.stories.tsx` (`Atoms/Tooltip`: Default, Sides, IconButtonTrigger, MultiLine) and `index.ts` complete the folder. There is no stylesheet and no internal module.

Prop naming: `content` → `tooltip-content` (approved) and `side` → `floating-side` (approved). Both usages record `packages/ui/src/atoms/tooltip/types.ts#TooltipProps` at `sha256:ceeb8d9d26860fa35de0e75f7a2979709d8bdd7195c58a389d2cccc5d6965eaf`. `children` is the React trigger element and `className` the supported layout surface; neither is an own convention.

Radix 1.4.1 puts `role="tooltip"` and the described-by id on the Content itself when no `aria-label` is passed, so the `eg-tooltip` marker, `data-state` and `data-side` share one element.

## Acceptance criteria

| ID | Observed evidence |
| --- | --- |
| AC-01 | Unit (fake timers, synchronous pointer events): closed at 650 ms, open at 700 ms with `data-state="delayed-open"`; the trigger's `aria-describedby` equals the tooltip id. |
| AC-02 | Unit `userEvent.tab` opens with `data-state="instant-open"`; Escape closes and focus stays on the trigger. Packed CSR (React 18.3.1 and 19.3.0): focus opens, Escape closes, focus stays. |
| AC-03 | Unit: pointer leave plus a move outside the grace area, pointer down on the trigger, and blur by Tab each close the bubble. |
| AC-04 | Unit and packed: the trigger keeps its own `aria-label`, `id` and `data-*`, gains the tooltip as its accessible description, and is not wrapped. |
| AC-05 | Unit with a stubbed jsdom viewport: `data-side` is `top` by default and matches `right`, `bottom` and `left`; a trigger at the top edge flips to `bottom`. |
| AC-06 | Unit and packed CSR: the bubble renders in the popper wrapper under `document.body`, outside the render container, with `eg-tooltip` first, the full recipe, and consumer `className` last. |
| AC-07 | The reduced-transparency and reduced-motion utilities are asserted in the CVA base, the built `styles.css` (`package-exports`) and the native Vite and Tailwind packed consumers. Browser emulation check: Not evaluated. |
| AC-08 | Unit and packed CSR render Tooltip with no wrapper provider. Packed SSR renders only the closed trigger (`data-state="closed"`, no tooltip text). |

Storybook metadata: docgen and Controls tests map `content` and `className` to `text`, `side` to `select` (`top`, `right`, `bottom`, `left`, default `top`) and `children` to `false` with a concrete reason, with zero diagnostics. Browser widget check: Not evaluated.

## Notes

- jsdom testing: Testing Library's async wrapper awaits a real `setTimeout`, so `userEvent` calls deadlock under Vitest fake timers. The delay tests use synchronous `fireEvent` pointer events instead. jsdom also reports a 0×0 viewport, which makes floating-ui flip every side, so placement tests stub `documentElement.clientWidth/clientHeight` and the trigger rectangle. The packed CSR harness stubs `ResizeObserver`, which Radix Popper needs.
- The packed fixture import lines get back `ComponentProps`, `Surface` and `surfaceVariants`, which the fixture already used but no longer imported.
- Visual conformity with VIS-01, browser computed styles, real collision behaviour and Controls widgets are Not evaluated. They are pending the owner's Storybook review on `main`.
