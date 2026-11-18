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
- `upgrade` is reserved and refuses with exit 2 until it ships.
