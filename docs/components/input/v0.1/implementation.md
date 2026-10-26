# Input v0.1 implementation evidence

## Spec identity

- Issue: [egdev6/egdev-design-system#59](https://github.com/egdev6/egdev-design-system/issues/59), frozen v0.1 body (whole-body SHA-256 `2f84ee8a754a101535ecbc45bd46918c7d486c904673185df590e87f6e591703`, canonical SHA-256 `b45ad1787cbaa85b12986849b7bcaffabd49d198b281da216fee7162bf9faa0a`) and the owner full-contract approval comment on that issue.
- Expected design: VIS-01 `Field.png` (`sha256:80af435a468eecb6ffd17b1b7187d06dc9015bd9d0b8477d874493ff88498df6`), Input rows only.
- Scope: one bare text-control atom. No token or dependency change. This does not establish catalog-wide M3 compliance.

## Decisions applied

| Decision | Implementation |
| --- | --- |
| D1 Bare control | Input renders only the control and an optional icon. Label, hint, error and counter stay with the consumer (the future Field molecule); the `WithLabel` and `Invalid` stories compose them by hand. |
| D2 Leading icon | Optional `icon` (`leading-icon`) in `<span aria-hidden="true">`, `absolute left-3 size-4 text-fg-muted`, vertically centered by the root flex context; the control gains `pl-9`. Absent, `null`, `false` or empty icons render no wrapper. |
| D3 Root wrapper | Always `span.eg-input` (`relative flex w-full items-center`) around the native `<input>`; DOM shape and marker never change with the icon. |
| D4 Sizes | `md` `min-h-11 px-3 py-2` (44px), `sm` `min-h-9 px-3 py-1.5` (36px). |
| D5 Native size | `size` is omitted from the native props and reused as the preset axis (`preset-dimensions`); it never reaches the DOM. |
| D6 Types | `type` is narrowed to `text`, `email`, `password`, `search`, `tel`, `url`, `number`; default `text`. |
| D7 Invalid | Native `aria-invalid` only: `aria-invalid:border-status-danger` and `aria-invalid:focus-visible:border-status-danger`. No own prop. |
| D8 Code | `variant="code"` (`visual-treatment`): `font-mono text-code bg-primitive-neutral-950`; `cn()` drops the sans font, the surface-0 well and the preset text size. |
| D9 Text | `md` `text-body-default` (16px); `sm` `text-label-default` plus `font-[var(--text-body-default--font-weight)]` through a `sm`/`default` compound variant, so `code` keeps the `text-code` weight. |
| D10 Focus | `focus-visible:outline-none focus-visible:border-border-brand-strong focus-visible:shadow-[var(--shadow-well),var(--shadow-ring-brand)]`. |
| D11 Change | Native `onChange`, `value` and `defaultValue` only; no internal state. |
| D12 Ref | `forwardRef<HTMLInputElement>`; the ref targets the `<input>`. |
| D13 Markers | Root `eg-input` only. |
| D14 Stylesheet | No stylesheet. `compiled.css` gains `@source "../atoms/input/types.ts"`. |

## Files

`types.ts` holds the public types and the internal `inputVariants` (root), `inputControlVariants` (well, states, presets, icon offset) and `inputIconVariants` CVA recipes; none of them is a package export. `useInput.ts` resolves the defaults and icon presence, sends `className` to the root and every other native prop to the control. `Input.tsx` is JSX only. `Input.test.tsx`, `Input.stories.tsx` (`Atoms/Input`: Default, Sizes, Code, WithIcon, Controlled, Disabled, ReadOnly, Invalid, WithLabel) and `index.ts` complete the folder.

Additions beyond the contract's utility list, all token-free layout guards: `min-w-0` on the control (flex overflow guard) and `flex items-center justify-center` on the icon slot (centers its content).

Prop naming: `size` → `preset-dimensions`, `variant` → `visual-treatment`, `icon` → `leading-icon` (all approved). The usages record `packages/ui/src/atoms/input/types.ts#InputProps` at `sha256:e972763e1f269e87d3b1306727a45e576aaaa1497833f48447af9fc86f7d182f`. `type` is a narrowed native attribute, not an own convention.

Legacy: `.eg-field__control` and the other Field rules stay in `legacy/bundle.css`.

## Acceptance criteria

| ID | Observed evidence |
| --- | --- |
| AC-01 | Unit, SSR and packed CSR: `span.eg-input` root with a native `<input type="text">`; the ref is the `HTMLInputElement` on React 18.3.1 and 19.3.0. |
| AC-02 | Unit, SSR and packed: `id`, `name`, `placeholder`, `aria-describedby`, `required`, `autoComplete` and `data-*` reach the input only; `className` merges last on the root (`w-64 w-80` → `w-80`, root `w-full` dropped) and never reaches the control. |
| AC-03 | Unit `userEvent.type`: controlled and uncontrolled typing, one `onChange` per keystroke. Packed CSR: a controlled rerender updates the same input without change events. |
| AC-04 | Unit and packed CSR: disabled is skipped by Tab and focus, rejects typing, root carries `has-[:disabled]:opacity-45 has-[:disabled]:pointer-events-none`; read-only is focusable and not editable. |
| AC-05 | Unit and SSR: `aria-invalid="true"` passes through with the danger variants. Built CSS: the invalid rule is emitted after hover and focus at equal specificity. Browser check: Not evaluated. |
| AC-06 | Hook and docgen: defaults `md`, `default`, `text`. Unit and SSR: `sm`/`code` classes. Built CSS: `min-h-11`/`min-h-9` resolve to `calc(var(--space-1) * 11/9)`. Browser computed height/font: Not evaluated. |
| AC-07 | Unit, SSR and packed: the icon wrapper is `aria-hidden`, the accessible name is unchanged and the control gets `pl-9`, emitted after `px-3`. |
| AC-08 | CVA scan: no literal colors, pixel values, gradients or `!important`. `package-exports` and native Vite and Tailwind packed consumers find every Input utility bound to tokens and no `.eg-input` rule. Browser focus/hover check: Not evaluated. |
| AC-09 | `package-exports` and the packed matrix: `Input` (forwardRef), `InputProps`, `InputSize`, `InputVariant`, `InputType` from the package root without an app Tailwind compiler; type fixtures reject `checkbox`, native numeric `size`, `lg`, `mono`, `invalid`, `onValueChange`, `children`, `asChild` and a div ref. |
| AC-10 | Docgen and Controls tests: `size`, `variant`, `type` map to `select` with real defaults; `icon` is `@control false` with a reason; zero diagnostics. Browser widget check: Not evaluated. |
| AC-11 | Unit and packed SSR: a `<label htmlFor>` names the textbox and `aria-describedby` resolves the hint. |

## Notes

- Known edge: a read-only control that is also invalid shows the control border while hovered, because `read-only:hover:` is more specific than `aria-invalid:`. It keeps the danger border at rest and on focus.
- Visual conformity with VIS-01, browser computed styles and Controls widgets are Not evaluated. They are pending the owner's Storybook review on `main`.
