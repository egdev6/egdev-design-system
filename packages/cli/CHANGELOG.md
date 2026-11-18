# Changelog

## 0.1.1

- `egdev-ds status <project> [--from <dir>] [--json]` (#486): a read-only report of the vendored commit and each
  vendored `@egdev` package's version, file and specifier style, derived from the vendored file names. With `--from`
  it also reports the release commit and whether an upgrade is available. It writes nothing, spawns nothing and
  refuses (exit 2) the `none`, unsafe, `foreign` and mixed states.
- `localRepo` in a new `egdev-ds.json` now defaults to the name of the nearest ancestor folder that holds a `.git`
  entry (a directory or a worktree's file; no git command runs), falling back to the package name (#485). The plan
  shows it: `create  egdev-ds.json  localRepo=<value>`. `doctor` uses the same default when the file is missing.
- `--local-repo <name>` for `init` and `upgrade` sets `localRepo` when `egdev-ds.json` is created. An existing file
  keeps its value, and a different `--local-repo` prints a note on stderr.
- `doctor` DS051 warns when the `design/system.md` header (`<!-- Generated from EGDEV design system <commit>; … -->`)
  records a commit other than the vendored one. It looks from the project up to its repository root and is skipped
  without the file, a recorded commit or a single vendored commit.
- A type-only entry (#488): `import type { GuardAllowlistEntry } from '@egdev/cli'` types
  `design-system-allowlist.ts` with the entry shape doctor validates (DS042). `DesignSystemAllowlist` is the array type.
  The package adds `types` and a types-only `exports` entry; it has no runtime entry and no new dependency.

## 0.1.0

- First release of `egdev-ds`: argument parsing, `--help`, `--version`, exit codes 0/1/2 and `--json` output.
- `egdev-ds doctor <project>` checks the vendored install, lockfile integrity, peers, CSS entry, the design-system guard
  and MCP wiring, with stable `DS0xx` codes. The guard moved here from the `egdev-design-system` skill and resolves
  `typescript` and `postcss` from the consumer project.
- `egdev-ds init <project>` vendors the release set (with `@egdev/cli` as a devDependency) and writes the
  `package.json` dependencies, overrides, `ds:doctor` script and `packageManager`, the `pnpm-workspace.yaml`
  overrides, the CSS entry imports, `egdev-ds.json`, `.mcp.json` and, with `--accent`, `src/theme/accent-host.ts`.
  It runs the package manager install and verifies every vendored integrity. Writes are atomic and roll back on
  failure. Conflicts are refused unless `--force`. `--dry-run` writes nothing, and a second run is a no-op.
- `egdev-ds upgrade <project>` replaces the vendored set as one unit from a newer release, only for the `@egdev`
  packages the app already declares. It verifies sha256 and internal and external peer coherence, refuses dirty
  releases without `--allow-dirty`, copies the new tarballs into the existing vendor folder, rewrites every specifier
  (dependencies, npm and pnpm overrides, `pnpm-workspace.yaml`), pre-rewrites the npm lock, prints the changelog diff
  from the tarballs' `CHANGELOG.md`, installs and verifies the lockfile, rolls back on failure, and removes the old
  tarballs after success. A run at the release commit is a no-op.
- `egdev-ds upgrade <project> --add <list>` adds packages from the release to an app that is already vendored, such as
  `cli` or `effects`, with the file effects `init` gives them: the dependency or devDependency, external peers, npm `$`
  overrides or pnpm pins, CSS imports for `ui` and `effects`, `scripts.ds:doctor` and `egdev-ds.json` for `cli`, and
  `.mcp.json` for `mcp`. Without `--add`, upgrade still adds nothing.
- `@egdev/cli` is part of the release set: `pnpm release:pack` packs it and `release.json` lists it.
