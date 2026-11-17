# Changelog — `@egdev/tokens`

All notable changes to this package are documented here, newest first. Versions follow the
[0.x policy](../../docs/distribution/versioning.md) of this repository, and every version ships as
a local tarball from `pnpm release:pack`.

## 0.4.0

- Add 14 shared semantic contrast roles (`--color-app-page`, `--color-app-card`,
  `--color-app-card-header`, `--color-app-inset`, `--color-control-well`,
  `--color-control-boundary`, `--color-state-selected`, `--color-on-selected`,
  `--color-state-selected-surface`, `--color-link-default`, `--color-link-hover`,
  `--gradient-state-selected`, `--shadow-state-selected`, `--shadow-state-indicator`). Each one
  aliases an existing token; no existing name or value changes.
- Add the `@egdev/tokens/accent` export with `createAccentTheme(accent)`: a dependency-free helper
  that returns an immutable, scoped CSS-variable map for a runtime accent. Custom accents are
  lightened to meet contrast; `null`, invalid input or a reset return the default red map.
- Add navigation typography recipes used by Sidebar and NavList.

## 0.3.0

- Remove the `tokens.json` export. The public CSS exports are unchanged: `./tokens.css` (compiled
  native artifact), `./theme.css` (manual `@theme` source) and `./native.css`.
