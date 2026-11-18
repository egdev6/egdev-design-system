# @egdev/cli

`egdev-ds` installs, upgrades and checks the EGDEV design system in a consumer app. It uses the Node 24 standard
library only and has no dependencies. The approved spec is
[docs/distribution/egdev-ds-cli.md](../../docs/distribution/egdev-ds-cli.md).

This release ships `doctor`. `init` and `upgrade` are reserved: they refuse with exit code 2 until they ship.

## Usage

From a design system checkout:

```text
node <ds-repo>/packages/cli/bin/egdev-ds.mjs doctor <project> [--from <dir>] [--json]
```

```text
egdev-ds init    <project> [--from <dir>] [--packages <list>] [--css tailwind|native] [--css-entry <path>]
                           [--accent] [--no-install] [--offline] [--allow-dirty] [--force] [--dry-run] [--json]
egdev-ds upgrade <project> [--from <dir>] [--no-install] [--offline] [--allow-dirty] [--dry-run] [--json]
egdev-ds doctor  <project> [--from <dir>] [--json]
egdev-ds --help | --version
```

- `<project>` is the app directory that holds its `package.json`, relative to the current directory.
- `--from <dir>` is a `release:pack` folder with `release.json`. `doctor` uses it only for the release checks (DS014
  commit comparison and DS017 hashes). Without `--from`, those checks are reported as `skipped`.
- `--json` prints exactly one JSON document on stdout.

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Success. `doctor` found no error; warnings and skipped checks do not fail. |
| 1 | `doctor` found at least one error, or the release folder is unreadable or inconsistent. |
| 2 | Misuse (unknown, duplicate or missing-value flag, missing `<project>`), a missing `--from` folder, or a command that is not available yet. Nothing is written. |

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
