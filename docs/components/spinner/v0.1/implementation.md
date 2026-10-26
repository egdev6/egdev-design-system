# Spinner v0.1 implementation evidence

## Spec identity

- Issue: [egdev6/egdev-design-system#69](https://github.com/egdev6/egdev-design-system/issues/69), frozen v0.1 body (whole-body SHA-256 `16a5b6f4b3a3b47d8ad2286652e1bea29bdd3123f17b69dac1eeebe5ed3f5ea7`, canonical SHA-256 `79bc626d417792264e4465cd538fdc29998a5cdbdd7d4f6cbe1cfef6b7af3dbd`) and the owner full-contract approval comment on that issue.
- Token approval: the owner chose option A ("Token --animate-spin") for D3. The approval is recorded on #69 by the coordinator. `animate-spin` is not emitted by the `@egdev/ui` build without a canonical token, because `compiled.css` only references `@egdev/tokens/theme.css` and does not load Tailwind's default theme.
- Scope: one passive atom. This does not establish catalog-wide M3 compliance.

## Decisions applied

| Decision | Implementation |
| --- | --- |
| D1 No Radix behavior base | Plain `<span>` root; nothing interactive. |
| D2 Open arc glyph | Inline `<svg viewBox="0 0 24 24">` with the single Lucide `loader-circle` path `M21 12a9 9 0 1 1-6.219-8.56`, round caps and joins, no track ring. |
| D3 Rotation | `animate-spin`, bound to the new canonical `--animate-spin: spin 1s linear infinite` token and its `@keyframes spin`. |
| D4 Sizes | `sm` → `size-4` (16px), `md` → `size-(--icon-size)` (20px, default), `lg` → `size-7` (28px). |
| D5 Color | `stroke-current`. There is no color or tone prop. |
| D6 Accessibility | A non-empty `label` makes the root `role="status"` with Radix VisuallyHidden text. Without one (absent, empty or whitespace-only) the root gets `aria-hidden="true"`. The SVG is always hidden. |
| D7 Reduced motion | `motion-reduce:animate-none` on the arc. |
| D8 Exclusions | No delay, no determinate value, no overlay. |
| D9 Hidden label | `@radix-ui/react-visually-hidden` was already a pinned dependency (1.2.13), so the dependency manifest is unchanged. |
| D10 Refs | `FC<SpinnerProps>`: no ref and no `asChild`. |
| D11 Stylesheet / marker | No stylesheet. Root marker is `eg-spinner`. `compiled.css` gains `@source "../atoms/spinner/types.ts"`. |

## Files

`types.ts` holds `SpinnerProps`, `SpinnerSize`, `spinnerVariants` and the internal `spinnerArcVariants`. `useSpinner.ts` derives semantics, guards the omitted props at runtime and composes classes with `cn()`. `Spinner.tsx` is JSX only. `Spinner.test.tsx`, `Spinner.stories.tsx` (`Atoms/Spinner`: Default, Decorative, Sizes, Colors, InButton) and `index.ts` complete the folder. There is no stylesheet.

Prop naming: `label` → `accessible-name` and `size` → `preset-dimensions`, both already approved. Each usage records `packages/ui/src/atoms/spinner/types.ts#SpinnerProps` at `sha256:15beb1c08eb7851cb4b7c233fe4b15331b4fb193d7a11677189089f6615c3717`.

## Acceptance criteria

| ID | Observed evidence |
| --- | --- |
| AC-01 | Unit, SSR and packed CSR/SSR: with a label the root has `eg-spinner`, `role="status"` and text content equal to the label. |
| AC-02 | Unit, SSR and packed: without a label the root has `aria-hidden="true"` and no role. Empty and whitespace-only labels behave the same way. |
| AC-03 | Shipped utilities: `size-4` / `size-(--icon-size)` / `size-7` set width and height to `var(--space-4)` / `var(--icon-size)` / `var(--space-7)`. Browser computed size: Not evaluated. |
| AC-04 | Shipped `.animate-spin { animation: var(--animate-spin, spin 1s linear infinite); }`, `@keyframes spin` and the reduced-motion `animation: none` override. Browser emulation: Not evaluated. |
| AC-05 | `stroke-current` on the arc and no color utilities on the root. Visual conformity with VIS-01: Not evaluated. |
| AC-06 | Unit and packed: consumer layout/color classes merge last on the root, and the marker is kept. |
| AC-07 | Static CVA scanning through the build, plus native Vite and Tailwind packed consumers on React 18.3.1 and 19.3.0. |
| AC-08 | Docgen and Controls tests: `label` → text, `size` → select (default `md`), zero diagnostics. Browser widget check: Not evaluated. |

## Notes

- The packed fixture's busy host is a non-focusable `p` with `aria-busy`, so the consumer's focus harness (which counts Tab stops) stays unchanged.
- Skeleton's shipped-CSS assertion now allows the approved `spin` animation utility alongside `pulse`.
- Visual conformity, browser computed styles and Controls widgets are Not evaluated. They are pending the coordinator's Storybook review on `main`.
