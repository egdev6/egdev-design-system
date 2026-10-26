# Kbd v0.1 implementation evidence

## Spec identity

- Issue: [egdev6/egdev-design-system#60](https://github.com/egdev6/egdev-design-system/issues/60), frozen v0.1 body (whole-body SHA-256 `dfd2332ce532afd7aed52bb1f5c33c449758c6e9db889234040d06413050bbd5`, canonical SHA-256 `2cc51ca3bc810a5497330512da97c222e8dae87f39a354cc7ab6caf5a88eebb6`) and the owner full-contract approval comment on that issue.
- Expected design: VIS-01 `Kbd.png` (`sha256:8dd243cff9aa000bf2db7c8a16a7a01bbc044e4022e84b37004cc111928cfd88`).
- Scope: one passive atom. No token or dependency change. This does not establish catalog-wide M3 compliance.

## Decisions applied

| Decision | Implementation |
| --- | --- |
| D1 Typography and padding | `text-label-default` (14px/1.2/600) instead of the 13px source size; `px-1.5 py-0.5` resolve to 6px/2px through `--spacing`. |
| D2 Spoken name | Optional `label` (`accessible-name`). When non-empty, the glyph renders in `<span aria-hidden="true">` and the label in Radix `VisuallyHidden.Root`. `@radix-ui/react-visually-hidden` was already pinned (1.2.13), so the manifest is unchanged. An empty label is treated as absent. |
| D3 One key per Kbd | `children: string`; combos are consumer composition with text separators (`InText` story, packed fixture). |
| D4 Flat treatment | `inline-block whitespace-nowrap rounded-sm border border-border-subtle px-1.5 py-0.5 font-sans text-label-default text-fg-secondary`; no background, shadow, gradient or motion. |
| D5 Refs | `FC<KbdProps>` on `ComponentPropsWithoutRef<'kbd'>`: no ref and no `asChild`. |
| D6 Stylesheet | No stylesheet. `compiled.css` gains `@source "../atoms/kbd/types.ts"`. |

## Files

`types.ts` holds `KbdProps` and the internal `kbdVariants` CVA base (not exported from the package). `useKbd.ts` resolves labelled versus plain mode and composes the root classes with `cn()`, consumer `className` last. `Kbd.tsx` is JSX only. `Kbd.test.tsx`, `Kbd.stories.tsx` (`Atoms/Kbd`: Default, Keys, SymbolWithLabel, InText) and `index.ts` complete the folder. There is no stylesheet.

Prop naming: `label` → `accessible-name` (approved). The usage records `packages/ui/src/atoms/kbd/types.ts#KbdProps` at `sha256:1c6757b44bd0bff150128b8ccd9d4ee6b930b3d432b42a4dafe8c992d63a3de9`. `children` is the standard React content prop narrowed to `string`, not an own convention.

Legacy: the Foundation `.eg-kbd` rule (13px, 2px 6px) and `.eg-search>.eg-kbd` stay in `legacy/bundle.css`, inside `@layer components`. The Kbd utilities live in `@layer utilities`, so they win without `!important`.

## Acceptance criteria

| ID | Observed evidence |
| --- | --- |
| KB-01 | Unit, SSR and packed CSR/SSR: one native `kbd` with `eg-kbd` and the children text, no role or ARIA override. |
| KB-02 | `InText` story and the packed fixture compose keys inline in a paragraph. Browser layout review: Not evaluated. |
| KB-03 | Unit, SSR and packed: with a label the glyph span is `aria-hidden` and the label is visually hidden text inside the `kbd`; an empty label renders plain text. Accessibility-tree check in a browser: Not evaluated. |
| KB-04 | Unit `userEvent.tab` skips every Kbd; packed CSR asserts `tabIndex === -1`, no `tabindex` or `data-state`; the type fixture rejects `ref`, `asChild` and variants. |
| KB-05 | Unit and packed: `ms-1 ms-2` resolves to `ms-2` through `cn()`, consumer classes come last, `id`/`title`/`data-*` forward. |
| KB-06 | Six files, no stylesheet, CVA in `types.ts`. The built `styles.css` emits every utility from the token theme, plus the `--tw-border-style: solid` initial value, verified by `package-exports` and by native Vite and Tailwind packed consumers on React 18.3.1 and 19.3.0. |
| KB-07 | Docgen and Controls tests: required `children` and optional `label` both map to `text`, no defaults, zero diagnostics. Browser widget check: Not evaluated. |

## Notes

- Visual conformity with VIS-01, browser computed styles and Controls widgets are Not evaluated. They are pending the owner's Storybook review on `main`.
