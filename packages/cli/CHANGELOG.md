# Changelog

## 0.5.0

- `doctor` DS046 also checks static classes on components imported from `@egdev/effects` and reads their
  `classNameAllows` from the project's vendored `@egdev/system` artifact. An allowance applies only to imports from
  its own package, so a class on `HomeTemplateAnchor` may set its published geometry (`width`, `height`, their
  constraints and `aspect-ratio`), while any other non-placement property on a class passed to an `@egdev/effects`
  component is reported as it already is for `@egdev/ui`. Apps that upgrade the CLI may therefore see new DS046
  errors on CSS-file rules for classes passed to effects components: resolve them through the component API, the
  published geometry or an issue-backed allowlist entry. Tailwind utilities and inline styles stay outside DS046;
  DS047, DS048 and the checks for `@egdev/ui` are unchanged. (#566)

## 0.4.0

- `doctor` DS046 accepts each component's additional `classNameAllows` properties from the project's vendored
  `@egdev/system` artifact, falling back silently to the base list when unavailable or invalid. Refs #530.
- New `init` agent blocks describe the DS046 `className` contract and provide stdio MCP and `design/system.md`
  fallbacks when the MCP server is unavailable; existing marked blocks are left unchanged and can be edited by hand.
  Refs #530.

## 0.3.0

- `egdev-ds init` creates or appends marked design system agent rules in `AGENTS.md`, or names an unmarked ancestor
  as a manual next step. It backfills already-vendored projects, preserves existing bytes and user edits, and includes
  the write in plans, dry runs and rollback; `upgrade` never changes the guide. Refs #530.

- `doctor` DS048 reports static DOM selector and class queries that depend on DS `.eg-*` markup in non-test `.ts` and
  `.tsx` files, unless an issue-backed guard exception covers the call. Its message uses the normalized matched string
  with the original quote style; the guard reuses parsed TypeScript sources across checks. Refs #530.

- `doctor` DS047 reports app selectors that reach into an `@egdev/ui` component's internal structure, including
  placement-only declarations, unless an issue-backed guard exception covers the rule. Refs #530.

- `doctor` DS046 reports app CSS classes that change the appearance or layout of an `@egdev/ui` component outside the
  placement-only allowance, unless the selector has an issue-backed guard exception. It collects static class candidates
  inside conditional expressions and object literals. `min-width` and `min-height` are allowed only at literal zero,
  optionally followed by a CSS length unit or `%`, and with optional `!important`. Refs #530.

## 0.2.0

- `egdev-ds upgrade` reports allowlisted mitigations resolved by a release as next steps; `doctor --from`
  reports DS052 warnings only at the release commit. Both consider used packages and list their resolving
  versions once per mitigation. Older releases without `resolves` remain supported. Refs #522.

- `egdev-ds doctor <project> --fail-on-pending` reports pending DS043 placeholders as errors for consumer CI, with
  the same message and exit 1. Without the flag they remain warnings; the local `ds:doctor` script is unchanged.

- `egdev-ds init` checks `CONTRIBUTING.md` up to the repository root for a marked consumer-requests summary. It writes
  only in the project: an unmarked ancestor guide becomes a manual next step. Project writes appear in the plan, preserve
  existing bytes and user edits, respect dry runs and rollback, and are never changed by `upgrade`. A linked or
  irregular project guide is never written and never fails the run; without the block it becomes a manual next step.

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
