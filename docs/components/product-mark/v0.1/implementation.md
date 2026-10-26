# ProductMark v0.1 implementation evidence

## Spec identity

- Issue: [egdev6/egdev-design-system#64](https://github.com/egdev6/egdev-design-system/issues/64), frozen v0.1 body (whole-body SHA-256 `09a960fa1a9bd4f1623a8a7e01ac2a7088dcbc8027cdfca44a7c215ee9b86e28`, canonical SHA-256 `9526ab4732ef08d83d132742f36d36dc7b119826807d7786c47d59dddf5f6d8a`) and the owner full-contract approval comment on that issue.
- Expected design: VIS-01 `product-mark--specimen.png` (`sha256:dcc8e2f6007e597bc94bb416d51ec8d3856b7f38ee21813ae0a51f821c2b5e75`), specimen `docs/design/foundation-boards/v2026-10-17/specimens/product-mark.specimen.html`. Rows 1–2 are the expected design; row 3 (legacy `.eg-rail__brand`) is context only.
- Scope: one atom. No token or dependency change. This does not establish catalog-wide M3 compliance.

## Decisions applied

| Decision | Implementation |
| --- | --- |
| D1 Free monogram | Required `monogram: string`. One or two characters are documented; longer text is unsupported and not truncated or enforced by type. |
| D2 One size | 40px only: `size-10` resolves to `--space-10`. There is no `size` prop (the packed type fixture rejects it). |
| D3 Radius | `rounded-md` (`--radius-md`, 12px) instead of the 10px source. Accepted difference. |
| D4 Typography | `font-display text-heading-small` (24px/1.2/700) instead of the source weight 800. Accepted difference. |
| D5 Modes | No `href`: `span` with `role="img"`. With `href`: native `a` without a role. No `asChild`; router wrapping is the consumer's. |
| D6 Naming | Required `label` (`accessible-name`) becomes `aria-label` in both modes; the monogram renders in `<span aria-hidden="true">`. |
| D7 Material | `bg-(image:--gradient-btn-primary) shadow-btn-primary text-action-primary-solid-fg`. No hover, press or motion utilities. Link mode adds `focus-visible:outline-none focus-visible:shadow-focus`, so the focus ring replaces the material shadow. |
| D8 Level | Atom at `packages/ui/src/atoms/product-mark/`. ModuleRail and Sidebar are not migrated; legacy `.eg-rail__brand` stays in `legacy/bundle.css`. |
| D9 Ref | `FC<ProductMarkProps>` on `ComponentPropsWithoutRef`: no ref. |
| D10 Stylesheet | No stylesheet. `compiled.css` gains `@source "../atoms/product-mark/types.ts"`. |
| D11 Expected design | VIS-01 specimen; conformity is recorded below. |

## Files

`types.ts` holds the `ProductMarkLinkProps | ProductMarkImageProps` union, which follows the contract's API block, and the internal `productMarkVariants` CVA (a `link` boolean variant adds the focus utilities; it is not exported from the package). `useProductMark.ts` resolves the mode, sets the role and name, and composes the root classes with `cn()`, consumer `className` last. `ProductMark.tsx` is JSX only. `ProductMark.test.tsx`, `ProductMark.stories.tsx` (`Atoms/ProductMark`: Default, Monograms, OnSurface, HomeLink) and `index.ts` complete the folder. There are no internal modules and no stylesheet. `OnSurface` composes the merged Surface primitive.

Prop naming: `label` → `accessible-name` (approved) and `monogram` → `brand-monogram` (approved in `docs/decisions/prop-naming-atom-specs-approval.json`). Both usages record `packages/ui/src/atoms/product-mark/types.ts#ProductMarkProps` at `sha256:91de5ae435b6a408065592d3b7b44085021c71a15230c868081efddb48d2a8c4`. `href` is native.

## Deviations for owner review

1. **`href` control directive.** The contract asks for `@control text` on the link branch and `@control false` on the image branch. The installed docgen merges union-branch tags (`text\nfalse`), and the central enhancer rejects that as an ambiguous directive, so `href` would get no control. That breaks PM-08 (“`monogram`, `label`, `href` as text controls”). Both branches carry `@control text`, as Surface repeats its directives. The extracted `href` type is `string` (optional), so the text control is valid.
2. **Runtime naming guard.** The union lets TypeScript accept anchor-only attributes such as `role`, `aria-hidden` and `target` without `href`, because they exist on the link branch. The hook always sets `role="img"` and `aria-label` after the forwarded props and drops `aria-hidden` in image mode, so the image cannot lose its name. The types keep the contract's exact `Omit` lists.

## Acceptance criteria

| ID | Observed evidence |
| --- | --- |
| PM-01 | Unit, SSR and packed CSR/SSR: image mode is `role="img"` named by `label`, with the monogram `aria-hidden`; a stray `role` or `aria-hidden` cannot override it. Accessibility-tree check in a browser: Not evaluated. |
| PM-02 | Unit: M, C, L, Cr, Mt and Q render in the same `size-10 items-center justify-center` tile. Browser layout review: Not evaluated. |
| PM-03 | The built `styles.css` emits `background-image: var(--gradient-btn-primary)`, the `--shadow-btn-primary` value, `--color-action-primary-solid-fg`, `--radius-md`, `--font-display` and `--text-heading-small`, checked by `package-exports` and by the native Vite and Tailwind packed consumers. Browser computed styles: Not evaluated. |
| PM-04 | Unit `userEvent.tab` focuses the link and Enter activates it. Packed CSR focuses the link. Shipped CSS has `.focus-visible\:shadow-focus:focus-visible` with the `--shadow-focus` rings and `outline-style: none`. Visible ring in a browser: Not evaluated. |
| PM-05 | The CVA output has no `hover:`, `active:`, `transition`, `animate` or `translate` utilities, and there is no `data-state`. The type fixture has no own events: native anchor events forward. |
| PM-06 | Unit, SSR and packed: `eg-product-mark` leads the classes, `mb-1 mb-3` resolves to `mb-3` with consumer classes last, and `id`/`title`/`data-*`/`target`/`rel` forward per mode. The type fixture rejects missing `monogram`/`label`, `children`, `aria-label`/`aria-labelledby` on the link, `ref`, `asChild` and `size`. |
| PM-07 | Six files, no stylesheet, CVA in `types.ts`. The shipped CSS has no `.eg-product-mark` rule. Native Vite and Tailwind packed consumers on React 18.3.1 and 19.3.0 receive the utilities without compiling them. |
| PM-08 | Docgen and Controls tests: required `monogram`/`label` and optional `href` map to `text`, with no defaults and zero diagnostics; documented native rows are `id`, `title`, `className`, `target` and `rel`. Browser widget check: Not evaluated. |

## Notes

- Visual conformity with VIS-01, browser computed styles and Controls widgets are Not evaluated. They are pending the owner's Storybook review on `main`.
- `scripts/package-consumption.test.mjs` also restores the `ComponentProps`, `Surface` and `surfaceVariants` imports that the Kbd merge (2398135) dropped from the packed consumer fixture. The Surface samples and type checks still use them.
