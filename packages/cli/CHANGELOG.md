# Changelog

## 0.1.0

- First release of `egdev-ds`: argument parsing, `--help`, `--version`, exit codes 0/1/2 and `--json` output.
- `egdev-ds doctor <project>` checks the vendored install, lockfile integrity, peers, CSS entry, the design-system guard
  and MCP wiring, with stable `DS0xx` codes. The guard moved here from the `egdev-design-system` skill and resolves
  `typescript` and `postcss` from the consumer project.
- `init` and `upgrade` are reserved and refuse with exit 2 until they ship.
