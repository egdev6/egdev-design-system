<!-- egdev:lang:start -->
<p align="right">
  <img src="https://img.shields.io/badge/English-FF0036?style=for-the-badge&labelColor=0A0A0A&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MCAzMCI%2BPGNsaXBQYXRoIGlkPSJ0Ij48cGF0aCBkPSJNMzAsMTVoMzB2MTV6djE1aC0zMHpoLTMwdi0xNXp2LTE1aDMweiIvPjwvY2xpcFBhdGg%2BPHBhdGggZD0iTTAsMHYzMGg2MHYtMzB6IiBmaWxsPSIjMDEyMTY5Ii8%2BPHBhdGggZD0iTTAsMCA2MCwzME02MCwwIDAsMzAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI2Ii8%2BPHBhdGggZD0iTTAsMCA2MCwzME02MCwwIDAsMzAiIGNsaXAtcGF0aD0idXJsKCN0KSIgc3Ryb2tlPSIjQzgxMDJFIiBzdHJva2Utd2lkdGg9IjQiLz48cGF0aCBkPSJNMzAsMHYzME0wLDE1aDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMTAiLz48cGF0aCBkPSJNMzAsMHYzME0wLDE1aDYwIiBzdHJva2U9IiNDODEwMkUiIHN0cm9rZS13aWR0aD0iNiIvPjwvc3ZnPg%3D%3D" alt="English" />
  <a href="./README.es.md"><img src="https://img.shields.io/badge/Espa%C3%B1ol-1F1F1F?style=for-the-badge&labelColor=0A0A0A&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3NTAgNTAwIj48cmVjdCB3aWR0aD0iNzUwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2M2MGIxZSIvPjxyZWN0IHdpZHRoPSI3NTAiIGhlaWdodD0iMjUwIiB5PSIxMjUiIGZpbGw9IiNmZmM0MDAiLz48L3N2Zz4%3D" alt="Español" /></a>
</p>
<!-- egdev:lang:end -->

<!-- egdev:header:start -->
<img src="./.github/assets/banner.png" alt="egdev-design-system banner" width="100%" />

<div align="center">

[![Stars](https://img.shields.io/github/stars/egdev6/egdev-design-system?style=for-the-badge&labelColor=000000&color=FF0036)](https://github.com/egdev6/egdev-design-system/stargazers)
[![Issues](https://img.shields.io/github/issues/egdev6/egdev-design-system?style=for-the-badge&labelColor=000000&color=FF0036)](https://github.com/egdev6/egdev-design-system/issues)
[![License](https://img.shields.io/github/license/egdev6/egdev-design-system?style=for-the-badge&labelColor=000000&color=FF0036)](./LICENSE)

</div>
<!-- egdev:header:end -->

# egdev-design-system

EGDEV Foundation in code: the design system shared by egdev.es and every egdev tool (Mando, Cadencia, egdev-live, Criterio, media-tool and Quorb).

## What is it

A pnpm monorepo with six packages: design tokens, React components built on [Radix UI](https://www.radix-ui.com/), web effect layers, a generated design-system description, an offline MCP server over that description, and `egdev-ds`, the CLI that installs, upgrades and checks the design system in a consumer app. Products receive it as versioned local tarballs, without a registry.

- **Foundation:** React + Radix UI for behavior, token-backed CSS for appearance.
- **Design:** decided in Claude Design (the *EGDEV Foundation* artifact) and handed over here.
- **Methodology:** atomic design with primitives, inherited from the [Stack & Flow Design System](https://github.com/Stack-and-Flow/design-system).


| Package | Version | Role |
|---|---|---|
| [`@egdev/tokens`](packages/tokens) | 0.5.1 | Tokens: a single CSS source, native CSS output and a Tailwind v4 theme. |
| [`@egdev/ui`](packages/ui) | 0.3.2 | Components on Radix UI: primitives, atoms, molecules, organisms and templates. |
| [`@egdev/effects`](packages/effects) | 0.2.2 | Web effect layers (particles, 3D isotype) on canvas and three.js. |
| [`@egdev/system`](packages/system) | 0.4.2 | Data-only `design-system.json` describing an exact tokens/ui/effects set, plus the `system.md` and artboard check CLIs. |
| [`@egdev/mcp`](packages/mcp) | 0.4.2 | Offline, read-only MCP server over the `@egdev/system` artifact. |
| [`@egdev/cli`](packages/cli) | 0.1.1 | `egdev-ds`: installs, upgrades and checks the design system in a consumer app. |

<!-- egdev:stack:start -->
## Stack

<div align="center">
<a href="https://github.com/Gentleman-Programming/gentle-ai">
  <img width="220" src="https://raw.githubusercontent.com/Gentleman-Programming/gentle-ai/main/docs/assets/brand/built-with-gentle-ai.png" alt="Built with Gentle-AI" />
</a>
</div>

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-000000?style=for-the-badge&logo=modelcontextprotocol&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

</div>
<!-- egdev:stack:end -->

## Quick start

### Use it in an app

Apps install the six packages as tarballs from one `pnpm release:pack` run, using `egdev-ds` (`@egdev/cli`). The full guide, prerequisites (Node.js 24, pnpm or npm, Vite or Next.js) and a manual fallback are in [docs/distribution/install.md](docs/distribution/install.md).

```bash
# In this repository: build the release set into release/ (tarballs + release.json)
pnpm release:pack

# First run, from a design system checkout:
node <ds-repo>/packages/cli/bin/egdev-ds.mjs init <project>

# Then, from the app (npx egdev-ds … or pnpm exec egdev-ds …):
egdev-ds upgrade <project> --dry-run    # plan plus the changelog of every package
egdev-ds upgrade <project>              # move the whole set to a newer release
egdev-ds upgrade <project> --add cli    # also vendor a package the app lacks
egdev-ds doctor <project>               # check the vendored install, CSS imports and MCP wiring
egdev-ds status <project> --json        # read-only report of the vendored state
```

The approved CLI design is [docs/distribution/egdev-ds-cli.md](docs/distribution/egdev-ds-cli.md); the flag reference is [packages/cli/README.md](packages/cli/README.md).

### Work on the design system

Requires Node.js 24 and pnpm 10.34.6 (`packageManager`).

```bash
pnpm install
pnpm tokens        # compile native CSS from the theme.css source
pnpm storybook     # http://127.0.0.1:6006
pnpm test          # full Vitest suite; at most two workers by default
pnpm typecheck
pnpm build
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm storybook` | Compiles tokens and starts Storybook on port 6006. |
| `pnpm test` | Runs the Vitest suite with two workers. |
| `pnpm typecheck` | Type-checks the root and every package. |
| `pnpm lint` | Runs Biome checks (`pnpm format` applies fixes). |
| `pnpm build` | Builds every package. |
| `pnpm tokens` | Compiles `tokens.css` from `theme.css`. |
| `pnpm test:tokens` | Compiles and checks the source, aliases and parity. |
| `pnpm release:pack` | Builds the workspace and writes the release tarballs and `release.json` to `release/`. |
| `pnpm test:cli` | Runs the `egdev-ds` tests. |
| `pnpm test:cli:consumer` | Runs `egdev-ds` end to end (npm + Vite, pnpm + Next.js). |
| `pnpm artifact` | Builds the `@egdev/system` design-system artifact. |
| `pnpm system:docs` | Regenerates `system.md`. |
| `pnpm props:check` | Validates the prop naming registry. |

`pnpm test` uses a two-worker default budget, including when the unchanged pre-push hook invokes it. Test selection, assertions and timeouts are unchanged; watch and coverage commands retain their existing behavior.

CI (`.github/workflows/build-and-test.yml`) runs two jobs: **Verify** (lint, prop naming, typecheck, build, unit, CLI, token and package tests) and **egdev-ds end to end**.

## Architecture

- [Architecture](docs/ARQUITECTURA.md) (Spanish): packages, levels, Radix and styles.
- [Material](docs/MATERIAL.md) (Spanish): surfaces, light edge, shadows, wells and overlays (Material v2).
- [Cataloging](docs/CATALOGACION.md) (Spanish): reuse, variant or new component, and at which level.
- [Catalog](docs/CATALOGO.md) (Spanish): every EGDEV Foundation component with its level, package and Radix base.
- [Decisions](docs/DECISIONES.md) (Spanish): copy of the EGDEV Foundation decision log.
- [Handover plan](docs/PLAN.md) (Spanish): the historical phase order.

## Contributing

Planned work follows ODD. The active roadmap index is issue [#491](https://github.com/egdev6/egdev-design-system/issues/491) (website backlog). Read [CONTRIBUTING.md](CONTRIBUTING.md) before starting.

Agents: [AGENTS.md](AGENTS.md) summarizes the rules; the detailed flows live in [`skills/`](skills).

## Resources

- [docs/MCP.md](docs/MCP.md): Storybook MCP endpoint for agents: start the dev server, connect a client and query the documentation tools.
- [Install guide](docs/distribution/install.md): `egdev-ds` and the manual fallback.
- [egdev-ds CLI design](docs/distribution/egdev-ds-cli.md): commands, flags, plan format and doctor checks.
- [Versioning](docs/distribution/versioning.md): versions, bump rules, changelogs and `release.json`.
- [Consumer requests](docs/distribution/consumer-requests.md): how consumer apps request DS changes, mitigate meanwhile and try unreleased changes locally.
- [system.md](docs/distribution/system-md.md), [design-system artifact](docs/distribution/design-system-artifact.md) and [artboard check](docs/distribution/artboard-check.md).
- [Roadmap #491](https://github.com/egdev6/egdev-design-system/issues/491).

## License

[MIT](./LICENSE). Third-party notices are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

<!-- egdev:contact:start -->
## Contact

<div align="center">

[![Web](https://img.shields.io/badge/egdev.es-FF0036?style=for-the-badge&logo=googlechrome&logoColor=white)](https://egdev.es)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@egdev6)
[![Twitch](https://img.shields.io/badge/Twitch-9146FF?style=for-the-badge&logo=twitch&logoColor=white)](https://twitch.tv/egdev6)
[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/egdev66)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/egdev6/)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/egdev6/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/egdev6)
![Discord](https://img.shields.io/badge/Egdev5285-5865F2?style=for-the-badge&logo=discord&logoColor=white)
[![Gmail](https://img.shields.io/badge/Gmail-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:egdev6@gmail.com)

</div>
<!-- egdev:contact:end -->

<!-- egdev:footer:start -->
---

<div align="center">

**⭐ If you find this project useful, consider giving it a star on GitHub ⭐**

</div>
<!-- egdev:footer:end -->
