# @egdev/cli

`egdev-ds` installs, upgrades and checks the EGDEV design system in a consumer app. It uses the Node 24 standard
library only and has no dependencies. The approved spec is
[docs/distribution/egdev-ds-cli.md](../../docs/distribution/egdev-ds-cli.md).

This release ships `init`, `upgrade`, `doctor` and `status`.

## Usage

From a design system checkout:

```text
node <ds-repo>/packages/cli/bin/egdev-ds.mjs init <project> [--from <dir>] [--dry-run]
node <ds-repo>/packages/cli/bin/egdev-ds.mjs upgrade <project> [--from <dir>] [--add <list>] [--dry-run]
node <ds-repo>/packages/cli/bin/egdev-ds.mjs doctor <project> [--from <dir>] [--fail-on-pending] [--json]
node <ds-repo>/packages/cli/bin/egdev-ds.mjs status <project> [--from <dir>] [--json]
```

Or from the CLI tarball of a release, without a checkout:

```text
npm exec --yes --package=<release>/egdev-cli-<version>.tgz -- egdev-ds init <project>
```

After `init`, the CLI is vendored as a devDependency, so `npm run ds:doctor` or `pnpm ds:doctor` runs it.

```text
egdev-ds init    <project> [--from <dir>] [--packages <list>] [--css tailwind|native] [--css-entry <path>]
                           [--local-repo <name>] [--accent] [--no-install] [--offline] [--allow-dirty] [--force]
                           [--dry-run] [--json]
egdev-ds upgrade <project> [--from <dir>] [--add <list>] [--local-repo <name>] [--no-install] [--offline]
                           [--allow-dirty] [--dry-run] [--json]
egdev-ds doctor  <project> [--from <dir>] [--fail-on-pending] [--json]
egdev-ds status  <project> [--from <dir>] [--json]
egdev-ds --help | --version
```

- `<project>` is the app directory that holds its `package.json`, relative to the current directory.
- `--from <dir>` is a `release:pack` folder with `release.json`. `init` and `upgrade` default to
  `../egdev-design-system/release`, resolved against the current directory. `doctor` uses it only for the release
  checks (DS014 commit comparison, DS017 hashes and DS052 resolved mitigations). Without `--from`, those checks are
  reported as `skipped`.
  `status` uses it only to report the release commit and whether an upgrade is available.
- `--json` prints exactly one JSON document on stdout.

## `init`

`init` adds the design system to an app that has no `@egdev` packages yet. It detects the package manager, the
framework, the CSS mode and the CSS entry, prints the plan, then applies it as one transaction.

| Flag | Effect |
| --- | --- |
| `--packages <list>` | Comma-separated from `tokens,ui,effects,system,mcp`. Default `tokens,ui,system,mcp`. `cli` is always added. A package whose `@egdev` dependency or peer is not selected is refused. |
| `--css tailwind\|native` | Overrides CSS mode detection. |
| `--css-entry <path>` | The CSS file for the imports, relative to `<project>`. Must exist inside it. |
| `--local-repo <name>` | `localRepo` for a new `egdev-ds.json` (letters, digits, `.`, `_`, `-`; otherwise exit 2). An existing file keeps its value; a different flag prints a note on stderr. |
| `--accent` | Creates `src/theme/accent-host.ts` when it is missing. |
| `--no-install` | Skips the install and prints the exact command instead. Integrities stay unverified. |
| `--offline` | Adds `--offline` to the install. |
| `--allow-dirty` | Accepts a release packed from a dirty tree (`"dirty": true` in `release.json`). |
| `--force` | Replaces conflicting values in the keys the CLI owns. It never deletes a file or another key. |
| `--dry-run` | Prints the plan and writes nothing, `node_modules` included. |

### What `init` writes

| File | npm | pnpm |
| --- | --- | --- |
| `vendor/egdev/egdev-<pkg>-<version>-<commit7>.tgz` | Copied from the release; sha256 checked against `release.json` | Same |
| `package.json` `dependencies` | `@egdev/tokens`, `@egdev/ui`, `@egdev/effects` as `file:./vendor/egdev/…`; `react` and `react-dom` `19.3.0` only when absent; `three` `0.160.0` with effects | Same |
| `package.json` `devDependencies` | `@egdev/system`, `@egdev/mcp`, `@egdev/cli` | Same |
| `package.json` `scripts.ds:doctor` | `egdev-ds doctor .` | Same |
| `package.json` `overrides` | `"@egdev/<dep>": "$@egdev/<dep>"` for each internal dependency (mcp → system, effects → ui) | — |
| `package.json` `packageManager` | — | `pnpm@10.34.6` when absent |
| `pnpm-workspace.yaml` | — | `overrides:` pins every selected package; `strictPeerDependencies: true` when absent. Edited as text, so comments survive. Uses `pnpm.overrides` instead when `package.json` has it. |
| CSS entry | Tailwind: `theme.css`, `ui/styles.css` (and effects) right after `@import "tailwindcss"`. Native: `tokens.css`, `ui/styles.css` (and effects) at the top, after any `@charset`. Existing lines are kept, never reordered. | Same |
| `egdev-ds.json` | Created with the defaults when missing; `localRepo` is `--local-repo` or the repository folder (see Configuration) | Same |
| `.mcp.json` | `mcpServers.egdev-design-system` when mcp is selected; other servers are kept | Same |
| `CONTRIBUTING.md` | Checks up to the repository root for a marked [consumer requests](../../docs/distribution/consumer-requests.md) summary; otherwise creates or appends it in the project, or names an ancestor file as a manual next step | Same |
| lockfile | Written by `npm install`, then every vendored integrity is checked against the tarball's sha512 | `pnpm install --no-frozen-lockfile` (pnpm freezes the lockfile under `CI=true`), same check |

The CSS entry is `src/app/globals.css` or `app/globals.css` for Next.js. For Vite, it is the first local `.css`
file that the `index.html` entry module imports. If that module already imports `@egdev/*.css`, the CSS counts as
wired and `init` leaves it alone. `init` never edits JS or TS modules.

### Plan output

```text
egdev-ds init apps/hub (npm, vite, native) from ../egdev-design-system/release at e712915
  copy    vendor/egdev/egdev-tokens-0.5.0-e712915.tgz  sha256 5a00fb193bd0…
  edit    package.json  dependencies.@egdev/tokens = file:./vendor/egdev/egdev-tokens-0.5.0-e712915.tgz
  keep    package.json  dependencies.react = ^19.3.0
  edit    package.json  overrides.@egdev/system = $@egdev/system
  edit    src/index.css  +@import "@egdev/tokens/tokens.css"
  create  egdev-ds.json  localRepo=nexo
  create  .mcp.json  mcpServers.egdev-design-system
  create  CONTRIBUTING.md  consumer requests summary
  run     npm install
Dry run: nothing written.
```

- A real run ends with `Initialized at e712915; <n> vendored integrities verified.`, the next steps and
  `Review the diff before committing.`
- A second run at the same commit verifies and prints `Already at e712915; <n> vendored integrities verified; no changes.`
  If the summary is missing and no ancestor guide exists, `init` plans and writes it even at the same commit, without
  reinstalling.
- `init` checks `CONTRIBUTING.md` from the project through the nearest ancestor with a `.git` entry, inclusive. Without
  a repository root it checks only the project. A marked block in any checked file needs no action. If the nearest guide
  is an ancestor without a block, `init` leaves it unchanged and prints a manual next step with its project-relative path.
  Like other next steps, that guidance is text-only, not a JSON write action. A project `CONTRIBUTING.md` that is a
  symlink, a hard link or not a regular file is never written: if it already holds the block nothing happens; otherwise
  `init` prints `Add the consumer requests summary to CONTRIBUTING.md by hand; it is a link or not a regular file.`
- A project summary is appended with at least one blank line, preserving all existing bytes and any extra blank lines.
  CRLF files keep their line-ending style. Existing content between the markers is never rewritten.
- With `--json`, `actions` lists `{ verb, path, detail }`, a copy's `detail` has the full sha256, and `result` is
  `planned`, `applied`, `current` or `failed`.

### Safety

- `init` never runs `git`. The only process it starts is the detected package manager.
- Every write stays inside `<project>`. Symlinks, hard links and non-files are refused.
- Each file is written to a temporary sibling and renamed into place. If a write, the install or the integrity
  check fails, every touched file is restored byte for byte, the copied tarballs and created folders are removed,
  and the exit code is 1.
- A key the CLI owns with a different value is a conflict. Every conflict is listed on stderr and nothing is
  written (exit 2), unless `--force`. Existing tarballs with different bytes are never overwritten.
- `init` refuses (exit 2) a project vendored at another commit or with a mixed set (use `upgrade`), a dirty release
  without `--allow-dirty`, and any ambiguous detection. A release that lacks a selected package, `@egdev/cli`
  included, is refused with exit 1.

## `upgrade`

`upgrade` replaces the vendored set of an app that already uses the design system with the set of a newer release,
as one unit. Without `--add`, it never adds a package: only the `@egdev` packages the app declares, or pins through an
override, are upgraded. An app without `@egdev/effects` stays without it, and `@egdev/cli` is upgraded only when the app
has it. `upgrade`, including `--add`, never edits `CONTRIBUTING.md`.

| Flag | Effect |
| --- | --- |
| `--add <list>` | Comma-separated from `tokens,ui,effects,system,mcp,cli`. Adds each named package the app does not declare yet, with the file effects `init` gives it (see below). A package the app already declares is just upgraded. |
| `--local-repo <name>` | `localRepo` for the `egdev-ds.json` that `--add cli` creates. Otherwise it changes nothing and prints a note on stderr. |
| `--no-install` | Skips the install and prints the exact command instead. Integrities stay unverified. |
| `--offline` | Adds `--offline` to the install. |
| `--allow-dirty` | Accepts a release packed from a dirty tree. |
| `--dry-run` | Prints the plan and the changelog diff and writes nothing, `node_modules` included. |

There is no `--packages` and no `--force`: the set moves as one unit, and every key `upgrade` rewrites is already a
vendored specifier. A conflict in a key `--add` owns is listed and nothing is written (exit 2).

### Adding packages: `--add`

`--add` is the explicit opt-in (owner decision L11 in the spec, §7.2) for an app that is already vendored, for example
one vendored before `@egdev/cli` joined the release set:

```text
egdev-ds upgrade apps/hub --add cli --dry-run
egdev-ds upgrade . --add effects
```

For each added package, in the same transaction as the upgrade:

- The tarball is copied to the folder of the app's first vendored dependency, with its `file:` or `file:./` style.
- `package.json` gets the entry `init` writes: `tokens`, `ui`, `effects` in `dependencies`; `system`, `mcp`, `cli` in
  `devDependencies`. Its external peers too: exact `three` `0.160.0` for effects, `react` and `react-dom` only when
  absent. npm: the `$` override for an internal dependency (`@egdev/ui` for effects). pnpm: the override pin.
- `ui` and `effects` add their stylesheet to the CSS entry, after the existing design system imports. When the Vite entry
  module imports the design system CSS, nothing is edited; the import to add is printed as a next step
  (`Import @egdev/effects/styles.css in src/main.tsx.`) and `doctor` reports DS030 until it is there.
- `cli` adds `scripts.ds:doctor` and, when it is missing, `egdev-ds.json` (plan line `create  egdev-ds.json  localRepo=<value>`).
  `mcp` adds the `.mcp.json` server.
- An added package has no changelog diff. An internal dependency it needs that the app does not declare is refused
  (exit 2) with `… upgrade adds no packages: pass --add <pkg>.` A package the release does not list exits 1.
- A repeated `--add` at the same release is a no-op: `Already at …`.

### What `upgrade` checks first

- The app has vendored `@egdev` specifiers only. Nothing vendored (use `init`), a registry range, a `workspace:` or
  `link:` specifier, or an unsafe `file:vendor/` path is refused with exit 2. A mixed set, including legacy names
  without a commit, is upgraded.
- The release lists every upgraded package, and each tarball's sha256 matches `release.json`; otherwise exit 1.
- No upgraded tarball declares a `workspace:` or `link:` specifier, and every `@egdev` dependency or peer names the
  version of that package in the same release (exit 1). One the app does not declare is refused with exit 2.
- The external peers of the new tarballs (`react`, `react-dom`, `three`) are satisfied by the installed versions;
  otherwise exit 2: update them first.
- A dirty release is refused with exit 2 unless `--allow-dirty`.

### What `upgrade` writes

| File | Effect |
| --- | --- |
| `vendor/…/egdev-<pkg>-<version>-<commit7>.tgz` | Copied from the release into the folder each package already uses; sha256 checked again while copying. Unchanged versions are copied too, so the whole set carries one commit. |
| `package.json` | Every `@egdev` specifier in the dependency fields, npm `overrides` (nested ones included) and `pnpm.overrides`, keeping its `file:` or `file:./` style. npm: a missing `$` override for a new internal dependency is added. pnpm: a missing pin is added. |
| `pnpm-workspace.yaml` | The `@egdev` values of `overrides:`, edited as text: quotes, comments and layout survive. |
| `package-lock.json` | npm only, before installing: each replaced entry gets the new `version`, `resolved`, sha512 `integrity` and packed metadata, and the root entry follows `package.json`. |
| lockfile | `npm install` or `pnpm install --no-frozen-lockfile` after removing `node_modules/@egdev`, then every vendored integrity is checked, and no lock entry may still point at an old tarball. |
| old tarballs | Removed after success. |

### Plan output

```text
egdev-ds upgrade apps/hub (npm, vite, native) from ../egdev-design-system/release at b54222c
  copy    vendor/egdev-ui-0.4.0-b54222c.tgz  sha256 1f0c3a9be2d4…
  edit    package.json  dependencies.@egdev/ui = file:vendor/egdev-ui-0.4.0-b54222c.tgz
  keep    package.json  overrides.@egdev/system = $@egdev/system
  edit    package-lock.json  node_modules/@egdev/ui = file:vendor/egdev-ui-0.4.0-b54222c.tgz
  remove  node_modules/@egdev
  run     npm install
  remove  vendor/egdev-ui-0.3.1-e712915.tgz
Changelog (e712915 → b54222c):
  @egdev/ui 0.3.1 → 0.4.0
    ## 0.4.0

    - Adds Tabs orientation.
  @egdev/system 0.4.1 unchanged version
Dry run: nothing written.
```

- The changelog diff comes from the `CHANGELOG.md` inside each new tarball: the sections newer than the installed
  version, up to and including the new one. A legacy name without a commit shows as `unversioned`.
- A real run ends with `Upgraded to b54222c; <n> vendored integrities verified.`, the next steps and
  `Review the diff before committing.`
- After a successful text upgrade, the next steps include each guard allowlist mitigation whose DS issue appears in the
  release's `resolves` for a package the project uses, including packages just added with `--add`. One step per entry
  lists its relevant resolving packages and first versions in package-name order, and the source line when available.
  An unloadable allowlist is silently skipped. Older releases without `resolves` still work and have no notices.
- A run at the release commit verifies and prints `Already at b54222c; <n> vendored integrities verified; no changes.`,
  with or without an `--add` package the app already declares. Like other next steps, these notices are not printed in
  `--dry-run` or included in `--json`.
- With `--json`, the document adds `changelog`: `[{ name, from, to, notes }]`, where `notes` holds the markdown
  sections, `""` for an unchanged version and `null` when the tarball has no `CHANGELOG.md`.

### Safety

- `upgrade` follows the same rules as `init`: no `git`, writes only inside `<project>`, atomic writes, and one
  transaction. If a copy, a write, the install or the integrity check fails, `package.json`, the lockfile and
  `pnpm-workspace.yaml` are restored byte for byte and the copied tarballs are removed (exit 1). `node_modules/@egdev`
  is not restored; run the install again.
- Old tarballs are removed only after success. If a removal fails, the run exits 1 with
  `Cannot remove <file> (<code>); new installation is intact.` and nothing is rolled back.

## `status`

`status` prints what an app has vendored, for people and for app scripts (the `design/system.md` sync, an MCP check)
that need the design system commit without parsing file names themselves. It is read-only: it writes nothing, starts
no process and never runs `git`. There is no state file; everything comes from the vendored file names in
`package.json` and `pnpm-workspace.yaml`.

```text
egdev-ds status apps/hub (npm, vite, native)
Vendored at ba7a38e:
  @egdev/tokens  0.5.1  file:vendor/egdev-tokens-0.5.1-ba7a38e.tgz
  @egdev/ui      0.3.2  file:vendor/egdev-ui-0.3.2-ba7a38e.tgz
  @egdev/system  0.4.2  file:vendor/egdev-system-0.4.2-ba7a38e.tgz
  @egdev/mcp     0.4.2  file:vendor/egdev-mcp-0.4.2-ba7a38e.tgz
  @egdev/cli     0.1.0  file:vendor/egdev-cli-0.1.0-ba7a38e.tgz
Release check skipped: pass --from <dir>.
```

- Packages are listed in release-set order with their version and full specifier. The version comes from the file
  name; the dependency-field specifier wins over an override.
- With `--from <dir>`, the last line is `Release at <commit7> (<dir>): upgrade available.` or `… up to date.`
- With `--json`:

  ```json
  {
    "schemaVersion": 1,
    "command": "status",
    "project": "apps/hub",
    "packageManager": "npm",
    "framework": "vite",
    "cssMode": "native",
    "release": null,
    "commit": "ba7a38e",
    "packages": [{ "name": "@egdev/ui", "version": "0.3.2", "file": "vendor/egdev-ui-0.3.2-ba7a38e.tgz", "style": "file:" }],
    "upgradeAvailable": null
  }
  ```

  `commit` has the 7 characters of the file names. `style` is `file:` or `file:./`. `release` is `{ dir, commit }` and
  `upgradeAvailable` a boolean with `--from`; both are `null` without it.
- Exit 0 when the vendored set is consistent. A project with nothing vendored, an unsafe `file:vendor/` path, a
  registry, `workspace:` or `link:` specifier, or a mixed set is refused with exit 2 and one stderr line, as `upgrade`
  refuses them.

## Tests

- `pnpm test:cli`: unit tests with synthetic tarballs and a fake package manager.
- `pnpm test:cli:consumer`: the end-to-end run (spec AC19). It packs the built workspace into a temporary folder, then
  npm + Vite and pnpm + Next.js consumers run `init` (the npm one from the CLI tarball), the real install, `ds:doctor`,
  a production build, `upgrade` and `ds:doctor` again. Run `pnpm build` first. It needs the network: it is skipped with a
  message when `registry.npmjs.org` does not resolve or with `EGDEV_SKIP_CLI_CONSUMER=1`, and fails offline when `CI`
  is set. CI runs both.

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Success, or already current. `doctor` found no error; warnings and skipped checks do not fail. `status` read a consistent vendored set. |
| 1 | `doctor` found at least one error (including pending DS043 with `--fail-on-pending`); the release folder is unreadable, inconsistent or lacks a selected package; `init` or `upgrade` failed and was rolled back; or an old tarball could not be removed after a successful upgrade. |
| 2 | Misuse (unknown, duplicate or missing-value flag, missing `<project>`), a missing release folder, an ambiguous detection, conflicts without `--force`, or a refused precondition. Nothing is written. |

Results go to stdout. Errors go to stderr, one line each; misuse adds the usage line.

## Doctor output

| Flag | Effect |
| --- | --- |
| `--fail-on-pending` | Reports pending DS043 placeholders as errors (exit 1) instead of warnings. Other findings are unchanged. Intended for the consumer CI merge check; the local `ds:doctor` script remains warning-only for placeholders. |

```text
egdev-ds doctor apps/hub (npm, vite, native)
DS014 skipped Release check skipped: pass --from <dir>.
DS017 skipped Release check skipped: pass --from <dir>.
DS051 skipped Skipped: no design/system.md in the project or up to its repository root.
DS052 skipped Release check skipped: pass --from <dir>.
0 errors, 0 warnings, 4 skipped.
```

Each finding prints as `<code> <severity> [<file>[:<line>]: ]<message>`. With `--json`:

```json
{
  "schemaVersion": 1,
  "command": "doctor",
  "project": "apps/hub",
  "packageManager": "npm",
  "framework": "vite",
  "cssMode": "native",
  "release": { "dir": "../egdev-design-system/release", "commit": "<40-hex>" },
  "actions": [],
  "findings": [{ "code": "DS040", "severity": "error", "message": "…", "file": "src/view.tsx", "line": 3 }],
  "result": "failed"
}
```

`result` is `current` when there is no error and `failed` otherwise. `release` is `null` without `--from`.

## Doctor checks

Codes are stable: a code is never reused for another check.

| Code | Severity | Check |
| --- | --- | --- |
| DS001 | error | `package.json` exists and parses. Nothing else runs without it. |
| DS002 | error | The package manager is detectable and supported: one lockfile, or `packageManager`; pnpm or npm. |
| DS003 | warning | pnpm `packageManager` major differs from `pnpm@10`. |
| DS010 | error | Every `@egdev/*` specifier is a safe `file:vendor/…/egdev-*.tgz` path, also in the lockfile. |
| DS011 | error | Every vendored tarball exists and is readable. |
| DS012 | error | Every vendored lockfile integrity matches the tarball's sha512, and every vendored specifier is in the lockfile. |
| DS013 | error | No `workspace:` or `link:` specifier for `@egdev/*` in `package.json`, `pnpm-workspace.yaml` or installed manifests. |
| DS014 | error | All vendored files carry one commit. With `--from`, a different release commit is a warning: `upgrade available`. |
| DS015 | error | Each declared `@egdev` package is installed inside the project with the vendored tarball's version. |
| DS016 | error | Overrides: npm `$` overrides for internal dependencies; pnpm overrides for every vendored dependency. |
| DS017 | error | With `--from` at the same commit, each vendored tarball's sha256 matches `release.json`. |
| DS020 | error | Each installed `@egdev` package's `@egdev/*` dependency or peer is installed at the required version. |
| DS021 | error | External peers (`react`, `react-dom`, `three`) satisfy the packed ranges (exact, `^`, `\|\|`). |
| DS030 | error | The CSS entry, or the Vite entry module, imports the mode's token file, `@egdev/ui/styles.css` and, with effects, `@egdev/effects/styles.css`. Order is not checked. |
| DS031 | error | `theme.css` follows `@import "tailwindcss"`; `tokens.css` and `theme.css` are not both imported. |
| DS040 | error | Guard: raw `<button`, `<input`, `<a`, `<label` in non-test `.tsx` under `sourceDirectory`, unless a sole `asChild` child or allowlisted. |
| DS041 | error | Guard: `.eg-*` or `[role=tab]` selectors in CSS outside `themeDirectory`, or CSS that does not parse. |
| DS042 | error | Guard allowlist: invalid issue, empty reason, TODO mismatch, stale entry, or a file that does not load. |
| DS043 | warning (error with `--fail-on-pending`) | Guard: `<localRepo>#TBD-*` placeholders pending. |
| DS044 | error | `typescript` or `postcss` is not resolvable from the project; the guard needs both. |
| DS045 | error | `egdev-ds.json` is missing or invalid. |
| DS050 | warning | `@egdev/mcp` is a dependency, but no `.mcp.json` in the project or an ancestor wires an existing `egdev-design-system` script. |
| DS051 | warning | The nearest `design/system.md`, from the project up to its repository root (the nearest folder with `.git`), records a design system commit in its first line (`<!-- Generated from EGDEV design system <commit>; … -->`) other than the vendored one: regenerate it. Skipped without the file, a recorded commit or a single vendored commit. |
| DS052 | warning | With `--from` at the same vendored commit, each guard allowlist entry whose `egdev6/egdev-design-system#N` issue occurs in `resolves` for a package the project uses names a mitigation to remove. One warning lists the relevant resolving packages and versions in package-name order, with the source line when available. Skipped without `--from`, when the vendored commit is mixed, absent or differs from the release, or when the allowlist cannot be loaded; `--fail-on-pending` does not change its severity. |

## Configuration: `egdev-ds.json`

```json
{ "schemaVersion": 1, "sourceDirectory": "src", "themeDirectory": "src/theme/", "localRepo": "egdev-website", "exclude": ["src/app/(payload)"] }
```

- `sourceDirectory`: the guarded tree. Default `src`.
- `themeDirectory`: the only place where CSS may target DS internals. Default `src/theme/`.
- `localRepo`: the repository for local issue references (`<localRepo>#N`, `<localRepo>#TBD-slug`). Default: the
  name of the nearest folder, from the project up, that holds a `.git` entry (a directory, or a worktree's `.git`
  file; no git command runs). Without one, or when that name is not a repository name, the `package.json` name
  without its scope. `init` and `upgrade --add cli` write this value unless `--local-repo` is passed; doctor uses the
  same default when the file is missing.
- `exclude`: project-relative paths the guard skips, such as generated routes.

A missing or invalid file is DS045; the other checks still run with the defaults.

## Guard allowlist

The guard reads `<sourceDirectory>/design-system-allowlist.ts`, which exports `designSystemAllowlist`. It is loaded
with Node's built-in type stripping, so the file may hold only `import type` lines and the array literal. A missing
file is an empty allowlist. The guard resolves `typescript` and `postcss` from the project; doctor runs the project's
own copies.

`@egdev/cli` publishes a type-only entry (`types/index.d.ts`) with the entry shape doctor validates (DS042), so the
allowlist is checked at compile time:

```ts
import type { GuardAllowlistEntry } from '@egdev/cli';

// Exact opening tags and selectors: remove each entry when its workaround goes away.
export const designSystemAllowlist: readonly GuardAllowlistEntry[] = [
  { file: 'src/Swatch.tsx', pattern: '<input type="color" />', issue: 'my-app#21', reason: 'Awaiting a DS swatch.' },
  {
    file: 'src/Switcher.tsx',
    pattern: '<Cluster gap={4}>',
    issue: 'egdev6/egdev-design-system#391',
    reason: 'Awaiting the DS switcher.',
    kind: 'component-gap',
    comment: '// TODO(egdev-design-system#391): Replace with the DS switcher.'
  }
];
```

`file`, `pattern`, `issue` and `reason` are required strings; `kind` is only `'component-gap'`, which needs the matching
TODO `comment`. `DesignSystemAllowlist` is the same array type. The package has no runtime entry: use `import type`,
which Node strips when doctor loads the file.

**Doctor and upgrade execute project code.** Loading the allowlist imports a module from the project, and the guard runs
the project's `typescript` and `postcss`. After a successful text upgrade, `upgrade` loads the allowlist when the release
contains resolved issues. Run these commands only on projects you trust, as you would their tests.
