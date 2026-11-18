# Changelog

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
