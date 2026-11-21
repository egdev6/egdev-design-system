# Versioning and changelogs

The design system ships to products as versioned local tarballs. This document owns the version
policy, the bump procedure and the changelog format; the install steps live in
[install.md](./install.md) and the packed set is produced by `pnpm release:pack`.

Registry publication (npm or GitHub Packages) is **not** decided yet. Nothing here publishes
anything, tags a release, or configures a registry.

## Release set

The release set is:

| Package | Content |
| --- | --- |
| `@egdev/tokens` | Token CSS source and compiled native artifact |
| `@egdev/ui` | Component library |
| `@egdev/effects` | Effect layers (`AmbientBackground`, `Isotipo3D`, `ScrollReveal`, `HomeTemplate`) |
| `@egdev/system` | Design system data artifact (`design-system.json`, generated `system.md`) |
| `@egdev/mcp` | Offline, read-only MCP server over the `@egdev/system` artifact |
| `@egdev/cli` | The `egdev-ds` command: `init`, `upgrade` (with `--add`), `doctor` and `status` for consumer apps ([egdev-ds-cli.md](./egdev-ds-cli.md)) |

`pnpm release:pack` packs the release-set members that exist in the workspace, in the order above.
A new member joins the same run when its package lands; the script never needs a second packing
path, and a missing member is simply not part of the set yet. `pnpm release:pack --out-dir <dir>`
writes the same output to another folder (tests use a temporary one, so they never replace
`release/`).

Every tarball ships its package `CHANGELOG.md`, so a consumer can read the sections between two
releases from the tarballs alone.

### Release provenance: `release.json`

After the packed manifests pass verification, `release:pack` writes `release/release.json` next to
the tarballs. A failed verification writes no `release.json`.

```json
{
  "schemaVersion": 1,
  "commit": "<40-hex design system HEAD at pack time>",
  "dirty": false,
  "packages": [
    { "name": "@egdev/ui", "version": "0.3.1", "file": "egdev-ui-0.3.1.tgz", "sha256": "<64-hex>" }
  ],
  "resolves": [
    { "issue": 123, "package": "@egdev/ui", "version": "0.3.1" }
  ]
}
```

- `commit` is `git rev-parse HEAD` in this repository at pack time.
- `dirty` is `true` when `git status --porcelain` reports any modified, staged or untracked file
  (ignored files such as `release/` do not count). `release:pack` records the flag and still packs;
  consumers refuse a dirty release unless they opt in explicitly.
- `packages` lists every tarball written by the run, in release-set order, with the sha256 of the
  file on disk. `@egdev/cli` is the last entry.
- `resolves` collects `(#N)` issue references from every versioned section of each packed
  `CHANGELOG.md`, including earlier versions but never `## Unreleased`. Comma lists such as
  `(#12, #34)` also work. It records each issue and package once, at the oldest section where the
  pair appears, sorted by issue number and then package name. With no references it is `[]`.
  The field is additive: older `schemaVersion: 1` releases may omit it.
- The file has no timestamp and a fixed key order, so the same tarballs and tree give byte-identical
  output. It is written under a temporary name and renamed into place.

## Independent versions, manual bumps

Each package carries its **own** version in `packages/<name>/package.json`. There is no lockstep
version and no release tooling dependency: bumps are manual, reviewable edits, and
`release:pack` never writes a version.

Bump procedure for one package:

1. Choose the next version with the rules below.
2. Edit `version` in `packages/<name>/package.json`.
3. Add a changelog section for that exact version at the **top** of
   `packages/<name>/CHANGELOG.md`, moving the entries collected under `## Unreleased` into it.
   Between releases, changes accumulate under an `## Unreleased` section above the last
   version; `release:pack` ignores that section and checks the first versioned one.
4. Run `pnpm release:pack`. The command fails until the two agree, then prints one line per
   tarball and one `release.json` line with the recorded commit.
5. Commit the manifest and the changelog together, so the packed version and its section land in
   the same review.

When several packages change together, bump each one that changed. Packages that did not change
keep their version and their tarball name.

### `@egdev/cli`

`egdev-ds` reads `release.json` and the tarballs it sits next to; it never pins the versions of the
other packages, so a new release of them needs no CLI bump. Bump `@egdev/cli` when the command
itself changes:

- A change to the files `init` or `upgrade` write, a flag, an exit code, the plan or JSON format,
  or a doctor check is a **minor** bump under 0.x.
- A fix that keeps those contracts is a **patch** bump.
- Doctor codes are stable: a code is never reused for a different check.

Apps vendor the CLI as a devDependency (`egdev-ds init` adds it; `egdev-ds upgrade --add cli` adds
it to an app vendored before it joined the set), so it moves with the rest of the set.

## Semver under 0.x

Every package is below `1.0.0`. Until a package is declared stable:

| Change | Version |
| --- | --- |
| Breaking change to the public API, exports, CSS entry points or peer requirements | **minor** (`0.3.0` → `0.4.0`) |
| New backwards-compatible capability | **minor** |
| Backwards-compatible fix | **patch** (`0.1.0` → `0.1.1`) |

Pre-1.0 semver allows breaking changes in a minor version, and this repository uses that
allowance instead of promoting a package to `1.0.0` early. Two consequences follow:

- A `^0.x.y` range only accepts the same minor version, so consumers never receive a breaking
  `0.x` change through a caret range. Product consumption is by exact tarball, which removes the
  ambiguity entirely.
- `1.0.0` is a separate, explicit decision per package. It is not implied by any bump here.

## Changelog format

One `CHANGELOG.md` per package, in English, newest section first:

```text
# Changelog — `@egdev/<name>`

## <version>

- <Change, in the imperative or past tense, one line per user-visible change.> (#123)
```

- The top `##` heading must carry the version currently in that package's manifest:
  `release:pack` reads the heading and compares it with the packed manifest, and fails with one
  stderr line when they differ.
- Group entries as `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed` or `Security` subsections
  once a section has more than a couple of entries.
- Describe the effect on a consumer, not the internal refactor.
- Cite each fully resolved issue as `(#N)`; this citation is required for consumer requests, so
  release metadata can notify consumers when their mitigations can be removed. Only `(#N)` (or a
  comma list of such references) counts as resolved; use plain `#N` or `Refs #N` for partial work.

## Coupling between packages

- `@egdev/tokens` is a peer of `@egdev/ui` and `@egdev/effects`. When pnpm packs, that peer is
  written as the exact version present in the workspace, so a ui tarball points at one exact tokens
  version.
- `@egdev/effects` depends on `@egdev/ui` and declares the exact `three` peer `0.160.0`.
- Because of both, **tarballs are consumed as one set from one `release:pack` run**. Bumping
  `@egdev/tokens` without re-packing `@egdev/ui` and `@egdev/effects` leaves a consumer with an
  install that cannot satisfy the peer range; bump and re-pack the dependents in the same change.

## What this policy does not do

- No `changesets`, `semantic-release` or other release dependency.
- No automated version commits, tags or GitHub releases.
- No registry publication, `publishConfig` or auth configuration.
- No token value changes: token values stay an owner-approved change in
  `packages/tokens/src/theme.css`.
