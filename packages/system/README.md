# @egdev/system

This data-only package carries `design-system.json`, the generated description of an exact set of `@egdev/tokens`, `@egdev/ui` and `@egdev/effects` versions. Import `@egdev/system/design-system.json` with the JSON support of your runtime or bundler.

The additive `components[].parts` entries expose source-derived compound part names, descriptions and documented children. The generated `system.md` places them beneath each catalog parent. For example, TopBar accepts its named parts, not an arbitrary direct CTA; its account, search and mobile controls belong in their respective parts. A general CTA has no dedicated TopBar slot and must be composed outside it.

See [the artifact reference](../../docs/distribution/design-system-artifact.md) and [renderer guide](../../docs/distribution/system-md.md) for generation and limitations.
