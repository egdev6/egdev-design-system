# Design-system data artifact

`@egdev/system/design-system.json` is generated from repository sources and committed for offline consumers. Run `pnpm artifact --write` to regenerate it and `pnpm artifact --check` to detect drift. The `@egdev/system` build also generates it before packing. It has no timestamps or machine-specific paths.

The `schemaVersion` describes the shape; `packages` gives the actual versions of tokens, UI and effects. `catalog` joins the generated catalog with public value exports. `components` describes public exports, their source, own props and CVA recipes. `types` records naming-registry usages that are not public values. `tokens` copies source values and their CSS block group. `materialRecipes` records curated Material semantics and referenced tokens. `propNaming` comes from the naming registry.

`@egdev/tokens` still does not itself publish structured JSON; this separate package resolves the deferred structured-token query without changing the token package or its CSS source. Values are not alias-resolved. The artifact is data only; the gentle-design renderer belongs to #347 and the MCP server to #346.
