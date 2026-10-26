# Switch v0.1 implementation evidence

## Spec identity

- Issue: [egdev6/egdev-design-system#72](https://github.com/egdev6/egdev-design-system/issues/72), frozen v0.1 body (whole-body SHA-256 `ba4282f30dd180e7c7020ab09b062233d17c8815c7c18eba3e8d67b919f7d712`, canonical SHA-256 `f6847e12b92662579ef13563b738377bb25602f8114149f0a4fd3f696578efcd`) and the owner full-contract approval comment on that issue.
- Expected design: VIS-01 `switch--specimen.png` (`sha256:f02f77ff7e2840bb5b0e49ecd107670127e776bfedeb9ad066691cd6b0415d46`).
- Scope: one interactive atom. Dependency `@radix-ui/react-switch` 1.4.1 (exact), added in its own commit as the contract requires. No token change. This does not establish catalog-wide M3 compliance.

## Decisions applied

| Decision | Implementation |
| --- | --- |
| D1 Radix Switch | `SwitchPrimitive.Root` and `SwitchPrimitive.Thumb` from `@radix-ui/react-switch`. Radix owns `role="switch"`, `aria-checked`, Space/Enter, `data-state`/`data-disabled` and the hidden form input. |
| D2 Bare track | No `label` prop and no children. Names come from `<label htmlFor>`, `aria-labelledby` or `aria-label` (`WithLabel` story, packed fixture). |
| D3 Change event | `onCheckedChange(checked: boolean)` (`checked-change`). |
| D4 Checked glow | `--shadow-btn-primary` through `data-[state=checked]:shadow-[var(--shadow-btn-primary)]`; no handwritten shadow. |
| D5 Size | None: one 36×20 track. |
| D6 Reduced motion | `motion-reduce:transition-none` on track and thumb. |
| D7 Touch target | Owned by the composing row. |
| D8 Toggle | Separate atom; no shared API. |
| D9 Refs | `forwardRef<HTMLButtonElement>` to the Radix root button. |
| D10 Specimen | VIS-01 is the visual reference. |
| D11 Stylesheet | No stylesheet. `compiled.css` gains `@source "../atoms/switch/types.ts"`. |

## Deviations from the §6 utility list

Each one keeps the approved geometry or behavior. None changes the public API, a token or the visual intent.

- **`box-border p-0 border-solid` on the track.** The package ships no preflight. A native `button` would otherwise be content-box with UA padding and render larger than 36×20. Without the explicit style, the 1px border would also depend on Tailwind's `--tw-border-style` initial value. Surface and Skeleton use the same base utilities.
- **`transition-[translate,background-color]` on the thumb instead of `transition-[transform,background-color]`.** Tailwind v4 `translate-x-4` sets the CSS `translate` property, not `transform`, so the contract's list would never animate the 16px travel. The build emits `@property --tw-translate-y { initial-value: 0 }`, so the travel also resolves without a Tailwind consumer.
- **`disabled` and `name` are also omitted from the native button base.** The contract re-declares them as own props. With both declarations, react-docgen-typescript attributes them to `@types/react`, the Storybook prop filter drops them, and the `disabled` control (AC-11) disappears. The public type is unchanged: `boolean | undefined` and `string | undefined`.

## Files

`types.ts` holds `SwitchNativeProps`, `SwitchProps` and the internal `switchVariants`/`switchThumbVariants` CVA bases, which are not exported from the package. `useSwitch.ts` applies the documented constant defaults (`defaultChecked=false`, `disabled=false`, `required=false`, `value="on"`). It holds no own state. It composes the track classes with `cn()`, consumer `className` last, and gives the thumb no consumer classes. `Switch.tsx` is JSX only. `Switch.test.tsx`, `Switch.stories.tsx` (`Atoms/Switch`: Default, Controlled, Disabled, States, WithLabel) and `index.ts` complete the folder. There is no stylesheet.

Prop naming: `onCheckedChange` maps to `checked-change` (approved). The usage records `packages/ui/src/atoms/switch/types.ts#SwitchProps` at `sha256:52991e3a2a1eec3558bc639541b69018f2590a904261e240c4b8fc1313699bf2`. `checked`, `defaultChecked`, `disabled`, `required`, `name` and `value` are native-named attributes, not conventions.

Legacy: `.eg-check--switch` stays untouched in `legacy/bundle.css` (`@layer components`). The `eg-switch` marker carries no rule.

## Acceptance criteria

| ID | Observed evidence |
| --- | --- |
| AC-01 | Unit, SSR and packed CSR: one `button[role=switch]` with `eg-switch` and one thumb `span`. The ref targets the button and is cleared on unmount. `package-exports` asserts a `forwardRef` export. |
| AC-02 | Unit `userEvent`: click, Space and Enter toggle and report `[true]`, `[false]`, `[true]`. Packed CSR: a click reports the next boolean. |
| AC-03 | Unit: unchecked by default, `defaultChecked`, controlled updates, and a controlled value held when the consumer does not update it. Packed CSR: a controlled rerender keeps the root. |
| AC-04 | Unit: disabled is skipped by Tab, ignores clicks and exposes `data-disabled`. Packed CSR: a disabled click emits nothing. `disabled:opacity-45` ships as `opacity: 45%`. Browser opacity check: Not evaluated. |
| AC-05 | `package-exports` and the packed native, Vite and Tailwind consumers: well (`bg-surface-0`, `--shadow-well`, `border-border-control`), checked gradient, `--shadow-btn-primary` and black thumb with 16px `translate`, 36×20 and 14px geometry on `--spacing`. Browser computed styles and VIS-01 comparison: Not evaluated. |
| AC-06 | `--shadow-focus` ships both as `focus-visible:` and as the higher-specificity `data-[state=checked]:focus-visible:` rule, so focus wins over the checked halo. Browser check: Not evaluated. |
| AC-07 | `motion-reduce:transition-none` ships inside `@media (prefers-reduced-motion: reduce)` for both parts. Emulated-media computed styles: Not evaluated. |
| AC-08 | Unit and packed CSR `FormData`: nothing is submitted while off, then `alerts=on`, a custom `value`, and the hidden input is `required`. A form reset restores the initial state. Without a DOM, Radix SSR always emits its hidden input; the client drops it outside forms. |
| AC-09 | Unit and packed CSR: `<label htmlFor>` names the switch and toggles it. |
| AC-10 | Six files, no stylesheet, CVA in `types.ts`. All 40 utilities compile from the token theme (scanned against `dist/styles.css`). They are verified by `package-exports` and by packed consumers on React 18.3.1 and 19.3.0 without and with Tailwind. |
| AC-11 | Docgen and Controls tests: `checked`/`defaultChecked`/`disabled`/`required` are boolean, `name`/`value` text, and `onCheckedChange` has `@control false` with a reason. Constant defaults are documented and diagnostics are zero. Browser widget check: Not evaluated. |

## Notes

- Visual conformity with VIS-01, browser computed styles, focus, reduced motion and Controls widgets are Not evaluated. They are pending the owner's Storybook review on `main`.
