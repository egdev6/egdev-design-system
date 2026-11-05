# @egdev/system

This data-only package carries `design-system.json`, the generated description of an exact set of `@egdev/tokens`, `@egdev/ui` and `@egdev/effects` versions. Import `@egdev/system/design-system.json` with the JSON support of your runtime or bundler.

The additive `assets` array contains the real Logo `mark` and `wordmark` as losslessly gzip/base64-encoded SVG (`svgGzipBase64`), with source paths and color token names. Copy either SVG from the Logo section of the generated `system.md`, or decode it from `@egdev/system/design-system.json` in an installed consumer. Define its CSS custom properties from the reference token tables; use the wordmark on canvas or surface backgrounds. The SVG is a named image, not the Logo's interactive link mode; adjust its accessible name or provide an appropriately named link as needed.

The additive `components[].parts` entries expose source-derived compound part names, descriptions and documented children. The generated `system.md` places them beneath each catalog parent. For example, TopBar accepts its named parts, not an arbitrary direct CTA; its account, search and mobile controls belong in their respective parts. A general CTA has no dedicated TopBar slot and must be composed outside it.

The reference starts with organisms-first composition and proposal guidance, then orders catalog components by level. Source-derived `composedOf` entries identify public JSX components used in an implementation; props, parts and catalog descriptions document available slots. Static extraction is not exhaustive.

The `compositionRecipes` field carries reviewed card and Hero supplementary-content examples, checked against public UI exports. Recipes cite their evidence and do not add component slots or replace source contracts.

See [the artifact reference](../../docs/distribution/design-system-artifact.md) and [renderer guide](../../docs/distribution/system-md.md) for generation and limitations.

The additive `typographyRoles` lists representative Heading, eyebrow, lede and code recipes with their source-derived font and size tokens. Missing token mappings are unresolved; these examples are not a universal cascade. Card headings may use sans rather than display.

The artifact includes source-derived CVA visual anatomy and Surface usage, with unresolved classes explicitly identified. The generated `system.md` renders those facts for gentle-design; they are not a computed cascade.
The artifact includes template and section source layout facts and slots as well as source-derived CVA visual anatomy and Surface usage, with unresolved classes explicitly identified. The generated `system.md` renders those facts for gentle-design; they are not a computed cascade.
