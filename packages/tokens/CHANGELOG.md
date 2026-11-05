# Changelog — `@egdev/tokens`

All notable changes to this package are documented here, newest first. Versions follow the
[0.x policy](../../docs/distribution/versioning.md) of this repository, and every version ships as
a local tarball from `pnpm release:pack`.

## 0.3.0

- Remove the `tokens.json` export. The public CSS exports are unchanged: `./tokens.css` (compiled
  native artifact), `./theme.css` (manual `@theme` source) and `./native.css`.
