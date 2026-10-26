# Logo v0.1 implementation evidence

## Spec identity

- Issue: [egdev6/egdev-design-system#62](https://github.com/egdev6/egdev-design-system/issues/62), frozen v0.1 body (whole-body SHA-256 `e845bb7af23a22998f2133fa8c86df38225ead0b3792611930ddde826ffa7cce`, canonical SHA-256 `7dbc3b502ff09dccb6665085f4b00f913d9b4244791f6d66c831b91e0b126dc9`, as recorded in the owner full-contract approval comment on that issue).
- Scope: one atom. This does not establish catalog-wide M3 compliance. No token, dependency or stylesheet change.

## Decisions applied

| Decision | Implementation |
| --- | --- |
| D1 Inline SVG | The artwork is data in the spec-named internal module `logo-artwork.ts` (viewBox plus shapes with ink keys, no JSX, not exported). `Logo.tsx` renders it inline. |
| D2 Artwork source | Mark: the seven isotype polygons published in Foundation `components/ArticleFeature/preview.html`, unchanged. They are identical in points and order to `assets/Logos/egdev-mark.svg` (`sha256:2a6bd964e244d3b278d10394701857454d05509c9e3397a7b47dad6f2584f8a2`). Wordmark: all eight paths of the V4 `assets/Logos/egdev-logo-wordmark.svg` (`sha256:1659dbffe78508d3fb98c9172ecbd6d99037345ae7e50579f8ad1dd7ba792ae2`), copied unchanged in file order. Read from the local EGDEV Foundation design-system checkout (`egdev-foundation/design-system/assets/Logos/`). |
| D3 Inks | `fill-(--logo-red)` (light), `fill-(--logo-red-shade)` (shade) and `fill-primitive-white` (name). The source `fill` attributes map to ink keys. No recoloring prop. |
| D4 No `asChild` | `href` renders a native `a`. Without `href` the root is a `span`. |
| D5 Name | `label`, default `egdev`. An empty or whitespace-only label also falls back to `egdev`, so the image or link is never unnamed. |
| D6 `variant` | `mark` / `wordmark`, default `wordmark` (hook default). |
| D7 Visual scope | VIS-01 covers size and row structure only. VIS-02 covers the mark. |
| D8 No ref | `FC<LogoProps>`. |
| D9 No stylesheet | Heights, inks and focus are utilities. `compiled.css` gains `@source "../atoms/logo/types.ts"`. The legacy `.eg-logo` rules in `legacy/bundle.css` are untouched. They stay in `@layer components`, so the utilities win. |

## Files

`types.ts` holds `LogoProps` (own props plus the link/image union), `LogoVariant`, `LogoSize`, the internal `LogoInk`, `logoVariants` (root and size, plus link focus), `logoArtworkVariants` and the `logoInkClasses` map. The class strings live there so the CSS build scans them. `useLogo.ts` derives the mode, name, artwork and per-shape ink classes, and guards the omitted props per mode at runtime. `Logo.tsx` is JSX only. `logo-artwork.ts` is the spec-named data module. `Logo.test.tsx`, `Logo.stories.tsx` (`Atoms/Logo`: Default, Mark, Wordmark, Sizes, HomeLink) and `index.ts` complete the folder.

Prop naming: `variant` → `visual-treatment`, `size` → `preset-dimensions` and `label` → `accessible-name`, all approved. Each usage records `packages/ui/src/atoms/logo/types.ts#LogoProps` at `sha256:c94a94db17133bd7b28dcd8763fdf00f40fb788379f2074432599c68c5a1ba31`.

## Deviation

The contract annotates `href` with `@control text` in the link branch and `@control false` in the image branch. Docgen merges both union branches into one `href` row with the tag `text\nfalse`. The Controls enhancer treats that as ambiguous and reports a diagnostic, which conflicts with LG-09 (`href` text) and the zero-diagnostics rule. The image branch therefore also carries `@control text`. Identical directives normalize to one, as the shared contract allows for discriminated unions, and the branch description explains why.

## Acceptance criteria

| ID | Observed evidence |
| --- | --- |
| LG-01 | Unit, SSR and packed: the default is `span[role=img]` named `egdev` with `h-8` and the wordmark viewBox. Browser height: Not evaluated. |
| LG-02 | Unit and packed: seven polygons in order, with exact points and `fill-(--logo-red)` ×5 and `fill-(--logo-red-shade)` ×2. VIS-02 comparison: Not evaluated. |
| LG-03 | Shipped utilities: `h-7` → `var(--space-7)`, `h-8` → `var(--space-8)`, `h-9` → `calc(var(--space-1) * 9)`. These are `--spacing` multiples, with no new token. Artwork: `block h-full w-auto`. Browser computed height and aspect: Not evaluated. |
| LG-04 | Unit: role `link` with name `egdev, home`, Tab focus, native Enter. Packed CSR: native focus. Shipped `focus-visible:shadow-focus` and `focus-visible:outline-none`. Browser focus review: Not evaluated. |
| LG-05 | Unit, SSR and packed: the SVG is always `aria-hidden="true"` and `focusable="false"`, with no `<title>` or text. There is one image or link per mode. |
| LG-06 | Unit: the wordmark paths and their order match `logo-artwork.ts`. Source review: the provenance header plus the generation assertions (polygons identical to `egdev-mark.svg`; eight wordmark paths). |
| LG-07 | Unit and packed: `eg-logo` is kept, the layout `className` merges last on the root only, and native anchor/span attributes forward. Type negatives in the unit tests and the packed strict fixture: children, role, aria-label, aria-labelledby, aria-hidden, anchor attributes without href, ref, asChild, numeric size, unknown variant, tone. |
| LG-08 | Six files plus `logo-artwork.ts`, no stylesheet and CVA in `types.ts`. Package-exports CSS scan, plus native Vite and Tailwind packed consumers. |
| LG-09 | Docgen and Controls tests: `variant`/`size` → select, `label`/`href` → text, zero diagnostics. Browser widgets: Not evaluated. |

## Notes

- `shadow-focus` compiles to the token's literal ring value (`@theme static`), not `var(--shadow-focus)`. The ring is identical today. A runtime override of `--shadow-focus` would not reach this utility.
- The inline wordmark adds about 100 kB (unminified) to `dist/index.js`. That is the cost of D1.
- Visual conformity, browser computed styles and Controls widgets are Not evaluated. They are pending the coordinator's Storybook review on `main`.
