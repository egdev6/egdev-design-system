# Changelog — `@egdev/effects`

All notable changes to this package are documented here, newest first. Versions follow the
[0.x policy](../../docs/distribution/versioning.md) of this repository, and every version ships as
a local tarball from `pnpm release:pack`.

## 0.2.12

- No code changes. Peer ranges follow `@egdev/ui` 0.11.0 so the effects tarball matches the current
  release set.
- `HomeTemplateAnchor` publishes its `className` geometry contract with `@classNameAllows`: width, height, their
  minimum and maximum constraints, the logical sizes and `aspect-ratio`, so a consumer can size the measured box to
  its media slot and `egdev-ds doctor` (`@egdev/cli` 0.5.0) honors it. Documentation and published metadata only:
  no runtime change. (#566)

## 0.2.11

- No code changes. Peer ranges follow `@egdev/ui` 0.10.0 so the effects tarball matches the current
  release set.

## 0.2.10

- No code changes. Peer ranges follow `@egdev/ui` 0.9.0 so the effects tarball matches the current
  release set.

## 0.2.9

- No code changes. Peer ranges follow `@egdev/ui` 0.8.0 so the effects tarball matches the current
  release set.

## 0.2.8

- No code changes. Peer ranges follow `@egdev/ui` 0.7.1 so the effects tarball matches the current
  release set.

## 0.2.7

- No code changes. Peer ranges follow `@egdev/ui` 0.7.0 so the effects tarball matches the current
  release set.

## 0.2.6

- No code changes. Peer ranges follow `@egdev/ui` 0.6.0 so the effects tarball matches the current
  release set.

## 0.2.5

- No code changes. Repacked so the peer on `@egdev/tokens` is 0.6.1 and the effects tarball matches the
  current release set.

## 0.2.4

- No code changes. Peer ranges follow `@egdev/ui` 0.5.0 so the effects tarball matches the current
  release set.

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
