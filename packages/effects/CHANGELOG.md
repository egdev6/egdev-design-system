# Changelog — `@egdev/effects`

All notable changes to this package are documented here, newest first. Versions follow the
[0.x policy](../../docs/distribution/versioning.md) of this repository, and every version ships as
a local tarball from `pnpm release:pack`.

## 0.2.3

- No code changes. Repacked with `@egdev/ui` 0.4.0 and `@egdev/tokens` 0.6.0 so the effects
  tarball matches the current release set.

## 0.2.2

- No code changes. The tarball now ships this `CHANGELOG.md`, and `release:pack` records the release in `release.json` (commit, dirty flag, sha256), so `egdev-ds upgrade` can verify the set and show what changed.

## 0.2.1

- No code changes. Repacked with `@egdev/ui` 0.3.1 as its peer dependency, so the effects tarball
  matches the current ui and tokens releases.

## 0.2.0

- Declare the tested React peer range `^18.3.1 || ^19.3.0`.

## 0.1.0

- First versioned release: `AmbientBackground`, `Isotipo3D`, `ScrollReveal` and the `HomeTemplate`
  family, with the compiled `./styles.css` stylesheet.
- `three` is an exact `0.160.0` peer.
