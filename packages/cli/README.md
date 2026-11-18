# @egdev/cli

`egdev-ds` installs, upgrades and checks the EGDEV design system in a consumer app. It uses the Node 24 standard
library only and has no dependencies. The approved spec is
[docs/distribution/egdev-ds-cli.md](../../docs/distribution/egdev-ds-cli.md).

This release ships `init` and `doctor`. `upgrade` is reserved: it refuses with exit code 2 until it ships.

## Usage

From a design system checkout:

```text
node <ds-repo>/packages/cli/bin/egdev-ds.mjs init <project> [--from <dir>] [--dry-run]
node <ds-repo>/packages/cli/bin/egdev-ds.mjs doctor <project> [--from <dir>] [--json]
```

After `init`, the CLI is vendored as a devDependency, so `npm run ds:doctor` or `pnpm ds:doctor` runs it.

```text
egdev-ds init    <project> [--from <dir>] [--packages <list>] [--css tailwind|native] [--css-entry <path>]
                           [--accent] [--no-install] [--offline] [--allow-dirty] [--force] [--dry-run] [--json]
egdev-ds upgrade <project> [--from <dir>] [--no-install] [--offline] [--allow-dirty] [--dry-run] [--json]
egdev-ds doctor  <project> [--from <dir>] [--json]
egdev-ds --help | --version
```

- `<project>` is the app directory that holds its `package.json`, relative to the current directory.
- `--from <dir>` is a `release:pack` folder with `release.json`. `init` defaults to
  `../egdev-design-system/release`, resolved against the current directory. `doctor` uses it only for the release
  checks (DS014 commit comparison and DS017 hashes). Without `--from`, those checks are reported as `skipped`.
- `--json` prints exactly one JSON document on stdout.

## `init`

`init` adds the design system to an app that has no `@egdev` packages yet. It detects the package manager, the
framework, the CSS mode and the CSS entry, prints the plan, then applies it as one transaction.

| Flag | Effect |
| --- | --- |
| `--packages <list>` | Comma-separated from `tokens,ui,effects,system,mcp`. Default `tokens,ui,system,mcp`. `cli` is always added. A package whose `@egdev` dependency or peer is not selected is refused. |
| `--css tailwind\|native` | Overrides CSS mode detection. |
| `--css-entry <path>` | The CSS file for the imports, relative to `<project>`. Must exist inside it. |
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
| `egdev-ds.json` | Created with the defaults when missing | Same |
| `.mcp.json` | `mcpServers.egdev-design-system` when mcp is selected; other servers are kept | Same |
| lockfile | Written by `npm install`, then every vendored integrity is checked against the tarball's sha512 | `pnpm install`, same check |

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
  create  egdev-ds.json
  create  .mcp.json  mcpServers.egdev-design-system
  run     npm install
Dry run: nothing written.
```

- A real run ends with `Initialized at e712915; <n> vendored integrities verified.`, the next steps and
  `Review the diff before committing.`
- A second run at the same commit verifies and prints `Already at e712915; <n> vendored integrities verified; no changes.`
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

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Success, or already current. `doctor` found no error; warnings and skipped checks do not fail. |
| 1 | `doctor` found at least one error; the release folder is unreadable, inconsistent or lacks a selected package; or `init` failed and was rolled back. |
| 2 | Misuse (unknown, duplicate or missing-value flag, missing `<project>`), a missing release folder, an ambiguous detection, conflicts without `--force`, a refused precondition, or a command that is not available yet. Nothing is written. |

Results go to stdout. Errors go to stderr, one line each; misuse adds the usage line.

## Doctor output

```text
egdev-ds doctor apps/hub (npm, vite, native)
DS014 skipped Release check skipped: pass --from <dir>.
DS017 skipped Release check skipped: pass --from <dir>.
0 errors, 0 warnings, 2 skipped.
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
| DS043 | warning | Guard: `<localRepo>#TBD-*` placeholders pending. |
| DS044 | error | `typescript` or `postcss` is not resolvable from the project; the guard needs both. |
| DS045 | error | `egdev-ds.json` is missing or invalid. |
| DS050 | warning | `@egdev/mcp` is a dependency, but no `.mcp.json` in the project or an ancestor wires an existing `egdev-design-system` script. |

## Configuration: `egdev-ds.json`

```json
{ "schemaVersion": 1, "sourceDirectory": "src", "themeDirectory": "src/theme/", "localRepo": "egdev-website", "exclude": ["src/app/(payload)"] }
```

- `sourceDirectory`: the guarded tree. Default `src`.
- `themeDirectory`: the only place where CSS may target DS internals. Default `src/theme/`.
- `localRepo`: the repository for local issue references (`<localRepo>#N`, `<localRepo>#TBD-slug`). Default: the
  `package.json` name without its scope.
- `exclude`: project-relative paths the guard skips, such as generated routes.

A missing or invalid file is DS045; the other checks still run with the defaults.

## Guard allowlist

The guard reads `<sourceDirectory>/design-system-allowlist.ts`, which exports `designSystemAllowlist`. It is loaded
with Node's built-in type stripping, so the file may hold only `import type` lines and the array literal. A missing
file is an empty allowlist. The guard resolves `typescript` and `postcss` from the project; doctor runs the project's
own copies.

**Doctor executes project code.** Loading the allowlist imports a module from the project, and the guard runs the
project's `typescript` and `postcss`. Run `egdev-ds doctor` only on projects you trust, as you would their tests.
