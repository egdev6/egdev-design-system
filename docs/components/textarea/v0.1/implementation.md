# Textarea v0.1 implementation evidence

## Spec identity

- Issue: [egdev6/egdev-design-system#73](https://github.com/egdev6/egdev-design-system/issues/73), frozen v0.1 body (whole-body SHA-256 `7422bf3c1c60ca9a0c85e478df169fdc5bb759c08fa1fece3cfe5ebe2bf0fc40`, canonical SHA-256 `e7c2a49c232d55bd5e2791e9b7f65ddc36ee0255115be7623f6efac82ebca847`) and the owner full-contract approval comment on that issue. Both identities are quoted from that comment, not recomputed.
- Expected design: VIS-01 `Field.png` (`sha256:80af435a468eecb6ffd17b1b7187d06dc9015bd9d0b8477d874493ff88498df6`), row 3 “Primer comentario” plus the shared focus and invalid rows.
- Scope: one native atom. No token or dependency change. This does not establish catalog-wide M3 compliance.

## Decisions applied

| Decision | Implementation |
| --- | --- |
| D1 Bare control | Only the native `textarea`. No label, hint, error or counter (Field owns them). |
| D2 Variants | `variant: 'default' \| 'code' \| 'prose'` (`visual-treatment`), default `default`. |
| D3 Prose | A native `textarea` with the prose sheet appearance; no `contenteditable`. |
| D4 No size axis | Minimum height per variant: `min-h-30` (120px) for `default`/`code`, `min-h-70` (280px) for `prose`; `rows` stays native. |
| D5 No auto-grow | `resize-y` only. |
| D6 Typography | `font-sans text-body-default` for `default` and `prose`; `font-mono text-code` for `code`. |
| D7 Invalid | Native `aria-invalid` with `aria-invalid:border-status-danger`, plus `aria-invalid:focus-visible:` and `aria-invalid:hover:` variants (see Notes). No own prop. |
| D8 Focus | Well: `focus-visible:border-border-brand-strong` + `shadow-[var(--shadow-well),var(--shadow-ring-brand)]`. Prose: `focus-visible:border-border-brand-strong` + `shadow-[var(--shadow-edge),var(--shadow-elev-1),var(--shadow-glow-base)]`. `focus-visible:outline-none` on every variant; the border change is the indicator. |
| D9 Events and ref | Native `onChange` only; `forwardRef<HTMLTextAreaElement>`; the root is the `textarea` itself. |
| D10 Own CVA | `textareaVariants` lives in `types.ts` and is not exported from the package. |
| D11 Stylesheet | No stylesheet. `compiled.css` gains `@source "../atoms/textarea/types.ts"`. |

## Files

`types.ts` holds `TextareaVariant`, `TextareaProps` (native props minus `children`) and the internal `textareaVariants` CVA: a shared base (marker, box, radius, border width, text colour, placeholder, transition, invalid and disabled) plus one full treatment per variant, so the well and sheet never fight over background or shadow. `useTextarea.ts` resolves the default variant and composes the root classes with `cn()`, consumer `className` last. `Textarea.tsx` is forwardRef JSX only. `Textarea.test.tsx`, `Textarea.stories.tsx` (`Atoms/Textarea`: Default, Variants, Controlled, Disabled, ReadOnly, Invalid, WithLabel) and `index.ts` complete the folder.

Prop naming: `variant` → `visual-treatment` (approved). The usage records `packages/ui/src/atoms/textarea/types.ts#TextareaProps` at `sha256:9c34b2b174e78bfb667ce1b0f27dc41b8b4432e88099b65699928a5782a667c7`. Native attributes are not conventions.

Legacy: `.eg-field__control`, `textarea.eg-field__control`, `.eg-field--code` and `.eg-field--prose` stay in `legacy/bundle.css`, untouched.

## Acceptance criteria

| ID | Observed evidence |
| --- | --- |
| AC-01 | Unit, SSR and packed CSR/SSR: one native `textarea.eg-textarea`; the forwarded ref targets it and clears on unmount. |
| AC-02 | Unit, SSR and packed: `id`, `name`, `rows`, `maxLength`, `placeholder`, `spellCheck`, `required`, `aria-*` and `data-*` forward; `mt-2 mt-4` resolves to `mt-4` through `cn()`, consumer classes come last; no `variant` or `data-state` attribute. |
| AC-03 | Unit `userEvent.type` with `{Enter}` in uncontrolled and controlled modes; packed CSR dispatches a native input and receives the multi-line value through `onChange`. |
| AC-04 | Unit: disabled is skipped by Tab and keeps its value; read-only is focusable and not editable. Packed CSR: read-only takes focus, disabled reports `disabled`. Browser opacity check: Not evaluated. |
| AC-05 | Hook default `default`; per-variant class invariants; built CSS emits `bg-surface-0`, `bg-primitive-neutral-950`, `bg-surface-1`, the sheen image, well and edge/elev-1 shadows, `min-h-30` (`calc(var(--space-1) * 30)`) and `min-h-70`. Browser computed styles: Not evaluated. |
| AC-06 | `resize-y` and the minimum heights ship in the built CSS. Browser resize check: Not evaluated. |
| AC-07 | Class invariants per variant; `package-exports` asserts the emitted order: hover, read-only hover and focus borders precede the invalid border, and the invalid hover follows the read-only hover reset. Browser focus inspection: Not evaluated. |
| AC-08 | Every utility resolves to a token variable in the built CSS; the reduced-motion media query removes the transition; the marker carries no rule. Verified by `package-exports` and by native Vite and Tailwind packed consumers on React 18.3.1 and 19.3.0. |
| AC-09 | Root runtime/type exports `Textarea`, `TextareaProps`, `TextareaVariant`; packed consumers type-check the API, reject `children`, `asChild`, `size`, unknown variants and a div ref. |
| AC-10 | Docgen and Controls tests: `variant` maps to `select` with options default/code/prose and default `default`, zero diagnostics. Browser widget check: Not evaluated. |
| AC-11 | Unit `getByRole('textbox', { name, description })` with `<label htmlFor>` + `aria-describedby`; `WithLabel` story; packed SSR label association. |

## Notes

- `aria-invalid:hover:border-status-danger` is an implementation addition within D7: `read-only:hover:border-border-control` has higher specificity than `aria-invalid:border-status-danger`, so without it a hovered read-only invalid control would lose the danger border.
- Visual conformity with VIS-01, browser computed styles and Controls widgets are Not evaluated. They are pending the owner's Storybook review on `main`.
