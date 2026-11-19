# Changelog — `@egdev/tokens`

All notable changes to this package are documented here, newest first. Versions follow the
[0.x policy](../../docs/distribution/versioning.md) of this repository, and every version ships as
a local tarball from `pnpm release:pack`.

## 0.6.0

- Add `--mask-scroll-fade-inline` for scrollable content that fades at its inline edges.

## 0.5.1

- No code changes. The tarball now ships this `CHANGELOG.md`, and `release:pack` records the release in `release.json` (commit, dirty flag, sha256), so `egdev-ds upgrade` can verify the set and show what changed.

## 0.5.0

- `createAccentTheme(accent)` now also maps `--gradient-chip-active`, `--shadow-glow-base` and
  `--shadow-glow-active`, so selected chips, tabs and state glows recolor with a custom accent. The
  default red map reproduces the existing `theme.css` values; nothing changes without a custom
  accent.
- Add `--gradient-spectrum`, a decorative hue-wheel gradient used by the ColorSwatchGroup custom
  color control. It is not meant for text or state backgrounds.

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
