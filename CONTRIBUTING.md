# Contributing

## ODD contributions

Planned work follows ODD. The active roadmap index is issue [#491](https://github.com/egdev6/egdev-design-system/issues/491) (website backlog) in `egdev6/egdev-design-system`; [#366](https://github.com/egdev6/egdev-design-system/issues/366) (agent design fidelity) is still open. Earlier indexes such as #8 and #427 are closed history. GitHub is the source of truth for its current revision, acceptance, dependencies and assignees. An open index or a closed issue does not mean work is ready: confirm the current approved scope and delivery chain with the maintainer before starting.

- Agents use the [odd-contribute skill](.agents/skills/odd-contribute/SKILL.md) and its [workflow](.agents/skills/odd-contribute/references/workflow.md).
- Component rules stay in [AGENTS.md](AGENTS.md) and the [component contract](skills/_shared/component-contract.md).
- The [Storybook MCP guide](docs/MCP.md) documents the local docs endpoint agents query instead of guessing props.
- Start work only on an explicit request; assignment is added, read back and rechecked, and is not a lock.
- Scope changes, commits, pushes, PRs, merges and releases need separate maintainer authorization.

## Tests and releases

- CI (`.github/workflows/build-and-test.yml`) runs two jobs: `Verify` (lint, prop naming, typecheck, build, `pnpm test`, `pnpm test:cli`, token contract, package exports and packed consumption) and `egdev-ds end to end` (`pnpm test:cli:consumer`, real npm + Vite and pnpm + Next.js installs).
- Locally, `pnpm test:cli` runs the `egdev-ds` unit tests; `pnpm test:cli:consumer` needs the network and skips when the registry does not resolve or `EGDEV_SKIP_CLI_CONSUMER=1` is set.
- Version bumps, changelogs and `pnpm release:pack` (tarballs plus `release/release.json`) follow [versioning.md](docs/distribution/versioning.md).
