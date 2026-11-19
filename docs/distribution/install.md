# Installing the design system in an app

The design system ships to products as **versioned local tarballs**, without a registry. npm or
GitHub Packages publication is a separate decision. Until it is taken, the six release-set
packages reach a product as `.tgz` files produced by one command: `@egdev/tokens`, `@egdev/ui`,
`@egdev/effects`, `@egdev/system`, `@egdev/mcp` and `@egdev/cli`.

There are two ways to install them:

- **`egdev-ds`**, the `@egdev/cli` command, is the supported way. It vendors the set, edits
  `package.json`, the overrides and the CSS entry, installs, verifies every integrity and checks the
  result. Start with [the CLI guide](#install-with-egdev-ds).
- **The [manual fallback](#manual-fallback)** is one shell block that installs `tokens`, `ui` and
  `effects` by hand. Use it when the CLI does not fit, or to see each step.

Versions and bump rules live in [versioning.md](./versioning.md). The CLI reference (every flag,
plan format, JSON output and doctor code) is [packages/cli/README.md](../../packages/cli/README.md);
the approved design is [egdev-ds-cli.md](./egdev-ds-cli.md).

## Producing a release

`pnpm release:pack` (repository root) builds the workspace, then writes one tarball per
release-set package into `release/`, named after the package manifest version
(`egdev-ui-0.3.1.tgz`). Each tarball ships the package `CHANGELOG.md`. Next to the tarballs it
writes `release.json`, which records the design system commit, whether the tree was dirty, and the
sha256 of every tarball (see [versioning.md](./versioning.md#release-provenance-releasejson)).

- The command prints one line per tarball plus one `release.json` line.
- It fails with exit code 1, without writing `release.json`, if a packed manifest still contains a
  `workspace:` specifier, or if a package has no `CHANGELOG.md` section for the version being packed.
- `pnpm release:pack --out-dir <dir>` writes to another folder instead of `release/`. The folder is
  emptied on every run, so the command refuses (exit 1) a folder that holds anything other than
  tarballs, `release.json` and its own staging leftovers.

Both installation paths consume exactly the tarballs of one `release:pack` run.

## Prerequisites

- **Node.js 24**, the range declared by `engines` in the repository root. `@egdev/cli` declares
  `engines.node` `>=24 <25`, so the app's CI must run Node 24 too: move a CI pinned to Node 22 before
  adding `ds:doctor` (Nexo had to, egdev6/nexo#67).
- **pnpm or npm** in the app. For pnpm, use the `pnpm@10.34.6` pin the repository uses, so tarball
  resolution behaves identically. yarn and bun are not supported.
- **Vite or Next.js.** `egdev-ds` finds the CSS entry through `index.html` (Vite) or
  `src/app/globals.css` / `app/globals.css` (Next.js).
- **React and `react-dom`** are peers of `@egdev/ui` and `@egdev/effects`. The versions tested by
  this repository are 18.3.1 and 19.3.0; the range the packed manifest accepts is the
  `peerDependencies` entry inside the tarball.
- **`three`** is an exact `0.160.0` peer of `@egdev/effects`. Install that exact version, not a
  caret range.
- **`typescript` and `postcss`** resolvable from the app, for `egdev-ds doctor`'s guard.
- The packages reference each other (`@egdev/effects` depends on `@egdev/ui`, `@egdev/mcp` on
  `@egdev/system`, and `ui` and `effects` declare `@egdev/tokens` as a peer at the version packed in
  the same run). An app must resolve all of them from the same tarball set; partially upgrading one
  tarball fails the install.

## Install with `egdev-ds`

### Run it the first time

The app has no `@egdev` packages yet, so the first run comes from the design system:

```text
# From a design system checkout:
node <ds-repo>/packages/cli/bin/egdev-ds.mjs init <project>

# Or from the CLI tarball of a release:
npm exec --yes --package=<release>/egdev-cli-<version>.tgz -- egdev-ds init <project>
```

- `<project>` is the app folder that holds its `package.json`, relative to the current directory.
- `--from <dir>` selects the release folder. Without it, the CLI uses
  `../egdev-design-system/release`, resolved against the current directory. Run it from the
  folder next to your design system checkout, such as the `nexo` root with `<project>` = `apps/hub`.
- `init` vendors `@egdev/cli` as a devDependency. From then on, run it from the app:
  `npx egdev-ds …`, `pnpm exec egdev-ds …`, or the `ds:doctor` script.

### `init`: add the design system

```text
egdev-ds init apps/hub --dry-run          # print the plan, write nothing
egdev-ds init apps/hub                    # apply it
egdev-ds init . --packages tokens,ui,effects,system,mcp --accent
```

`init` detects the package manager, the framework, the CSS mode (Tailwind or native) and the CSS
entry, prints the plan, then applies it as one transaction:

| File | Effect |
| --- | --- |
| `vendor/egdev/egdev-<pkg>-<version>-<commit7>.tgz` | Copied from the release, sha256 checked against `release.json`. |
| `package.json` | `tokens`, `ui` and `effects` in `dependencies`, `system`, `mcp` and `cli` in `devDependencies`, as `file:./vendor/egdev/…`; `react` and `react-dom` only when absent; exact `three` with effects; `scripts.ds:doctor`. npm: `$` overrides for internal dependencies. pnpm: `packageManager` when absent. |
| `pnpm-workspace.yaml` | pnpm only: an override pinning every vendored package, and `strictPeerDependencies: true` when the file is new. Edited as text: comments survive. |
| CSS entry | The token file of the mode, `@egdev/ui/styles.css` and, with effects, `@egdev/effects/styles.css`. Existing lines are never reordered or duplicated. |
| `egdev-ds.json` | The doctor options, created with defaults. |
| `.mcp.json` | The `egdev-design-system` MCP server, next to any other server. |
| `src/theme/accent-host.ts` | Only with `--accent`. |
| lockfile | `npm install` or `pnpm install --no-frozen-lockfile`, then every vendored integrity is verified. |

- The default packages are `tokens,ui,system,mcp`; `cli` is always added. `effects` is opt-in.
- A key `init` owns that already holds another value is a **conflict**: every conflict is listed,
  nothing is written, and the command exits 2. `--force` replaces only those values.
- A failed install or integrity check restores every file byte for byte (exit 1).
- A second run at the same release prints `Already at <commit>; …; no changes.`
- Run `init` once per app. An app that is already vendored is upgraded instead.

### `doctor`: check the app

```text
npm run ds:doctor                         # or: pnpm ds:doctor
egdev-ds doctor apps/hub --from ../egdev-design-system/release
egdev-ds doctor . --json
```

`doctor` checks the vendored install (paths, files, lockfile integrities, no `workspace:` links,
one commit), the overrides, the internal and external peers, the CSS imports, the design-system
guard (raw `<button>`, `<input>`, `<a>`, `<label>` and `.eg-*` selectors outside the theme folder)
and the MCP wiring. Each finding has a stable `DS0xx` code; errors exit 1, warnings do not. With
`--from`, it also compares the app with that release. Add `ds:doctor` to the app's CI, on Node 24.

`doctor` loads the app's allowlist and runs the app's own `typescript` and `postcss`: run it only on
projects you trust, as you would their tests.

### `upgrade`: move to a newer release

```text
egdev-ds upgrade apps/hub --dry-run       # plan plus the changelog of every package
egdev-ds upgrade apps/hub
egdev-ds upgrade apps/hub --add cli       # also vendor @egdev/cli, which the app lacks
```

- The whole set moves as one unit: every vendored tarball is replaced by the one from the new
  release, in the folder and `file:` style the app already uses. Legacy names without a commit are
  renamed to `<version>-<commit7>`.
- Only the `@egdev` packages the app declares are upgraded. An app without `effects` stays without
  it.
- **`--add <list>`** is the explicit opt-in to add packages from the release, for example `cli` to
  an app vendored before the CLI joined the set, or `effects`. Each added package gets the same file
  effects `init` gives it. When a Vite entry module imports the design system CSS, the stylesheet to
  add is printed as a next step instead.
- `upgrade` checks the sha256 of every tarball, internal versions and the installed external peers
  before writing; it rewrites every specifier, pre-rewrites the npm lock, installs and verifies. A
  failure restores every file (exit 1); old tarballs are removed only after success.
- Conflicts from `--add` are listed and nothing is written (exit 2): `upgrade` has no `--force`.

### Flags shared by `init` and `upgrade`

| Flag | Effect |
| --- | --- |
| `--from <dir>` | The release folder. |
| `--dry-run` | Print the plan and write nothing, `node_modules` included. |
| `--json` | Print one JSON document on stdout. |
| `--no-install` | Skip the install and print the command to run. Integrities stay unverified. |
| `--offline` | Add `--offline` to the install. |
| `--allow-dirty` | Accept a release packed from a dirty tree (`"dirty": true` in `release.json`). |

Exit codes: `0` success or already current; `1` failed and rolled back, an unreadable release, or
doctor errors; `2` misuse, conflicts or a refused precondition, with nothing written. The CLI never
runs `git`: review the diff before committing.

## Manual fallback

Run this from an empty folder. `EGDEV_RELEASE_DIR` must point at the folder written by
`pnpm release:pack` in the design system repository. The tarballs get the same
`vendor/egdev/egdev-<pkg>-<version>-<commit7>.tgz` names that `egdev-ds` uses, so a manual install
can be upgraded by the CLI later.

```sh
set -euo pipefail

: "${EGDEV_RELEASE_DIR:?set EGDEV_RELEASE_DIR to the folder written by pnpm release:pack}"

# 1. Verify each tarball against release.json and copy it as
#    vendor/egdev/egdev-<pkg>-<version>-<commit7>.tgz. Prints the three file names.
mkdir -p vendor/egdev src
files=$(node - "$EGDEV_RELEASE_DIR" tokens ui effects <<'JS'
const { createHash } = require('node:crypto');
const { copyFileSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const [release, ...names] = process.argv.slice(2);
const record = JSON.parse(readFileSync(join(release, 'release.json'), 'utf8'));
if (record.dirty) {
  console.error(`Warning: ${release} was packed from a dirty tree.`);
}
const files = names.map((name) => {
  const entry = record.packages.find((item) => item.name === `@egdev/${name}`);
  if (!entry) {
    throw new Error(`release.json does not list @egdev/${name}`);
  }
  const source = join(release, entry.file);
  if (createHash('sha256').update(readFileSync(source)).digest('hex') !== entry.sha256) {
    throw new Error(`${entry.file}: sha256 differs from release.json`);
  }
  const file = `egdev-${name}-${entry.version}-${record.commit.slice(0, 7)}.tgz`;
  copyFileSync(source, join('vendor/egdev', file));
  return file;
});
console.log(files.join(' '));
JS
)
read -r tokens ui effects <<<"$files"

# 2. package.json: `file:` dependencies, the exact three peer and the pinned package manager.
cat > package.json <<JSON
{
  "name": "egdev-consumer",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.34.6",
  "dependencies": {
    "@egdev/tokens": "file:./vendor/egdev/${tokens}",
    "@egdev/ui": "file:./vendor/egdev/${ui}",
    "@egdev/effects": "file:./vendor/egdev/${effects}",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "three": "0.160.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.3.3",
    "tailwindcss": "4.3.3",
    "vite": "8.3.4"
  }
}
JSON

# 3. pnpm-workspace.yaml: route the cross-package peers to the same tarballs. Without the
#    overrides, `@egdev/ui` asks the registry for `@egdev/tokens` instead of reading the tarball.
cat > pnpm-workspace.yaml <<YAML
overrides:
  '@egdev/tokens': 'file:./vendor/egdev/${tokens}'
  '@egdev/ui': 'file:./vendor/egdev/${ui}'
YAML

# 4. One Vite build per CSS mode; EGDEV_CSS_MODE selects the mode.
cat > vite.config.ts <<'TS'
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const tailwind = process.env.EGDEV_CSS_MODE === 'tailwind';

export default defineConfig({
  plugins: tailwind ? [tailwindcss()] : [],
  build: {
    outDir: tailwind ? 'dist/tailwind' : 'dist/native',
    emptyOutDir: true,
    rolldownOptions: {
      input: tailwind ? 'src/with-tailwind.css' : 'src/without-tailwind.css',
      output: { assetFileNames: 'styles.css' }
    }
  }
});
TS

# 5. Mode A: Tailwind in the consumer, tokens as the `@theme` source.
cat > src/with-tailwind.css <<'CSS'
@import "tailwindcss";
@import "@egdev/tokens/theme.css";
@import "@egdev/ui/styles.css";
@import "@egdev/effects/styles.css";
CSS

# 6. Mode B: no Tailwind in the consumer, the compiled token artifact instead.
cat > src/without-tailwind.css <<'CSS'
@import "@egdev/tokens/tokens.css";
@import "@egdev/ui/styles.css";
@import "@egdev/effects/styles.css";
CSS

# 7. Install exactly the packed tarballs. --strict-peer-dependencies turns a missing or
#    conflicting peer (React, three, @egdev/tokens) into a failed install instead of a warning.
pnpm install --ignore-scripts --no-frozen-lockfile --strict-peer-dependencies

# 8. Both CSS modes must build from the installed tarballs.
EGDEV_CSS_MODE=tailwind pnpm exec vite build
EGDEV_CSS_MODE=native pnpm exec vite build
```

`scripts/package-release.test.mjs` runs that block verbatim, from an empty temporary folder,
against the tarballs produced by a real `pnpm release:pack` into a temporary output folder, and
asserts that the install and both builds succeed. The guide is therefore executable evidence, not
prose. It is the only `sh` block in this file; every other example is `text`.

### Why each step is required

1. **Verify and copy the tarballs.** The sha256 check proves the files are the ones `release:pack`
   recorded. A `file:` dependency pointing into the design system repository would keep the
   consumer coupled to a checkout path; copying into `vendor/egdev/` makes it reproducible from its
   own tree. The `<version>-<commit7>` name changes with every release, so npm never keeps a stale
   integrity, and the commit shows in `package.json` diffs.
2. **`file:` dependencies.** The three `@egdev` packages are installed from the `.tgz` files
   themselves, so the consumer gets exactly the compiled `dist/` and stylesheets that
   `release:pack` verified, with no registry lookup and no workspace link.
3. **Overrides.** `@egdev/effects` depends on `@egdev/ui`, and both declare `@egdev/tokens` as a
   peer. pnpm resolves those internal requests through the overrides, so the vendored tarballs are
   used instead of a registry version or a `link:` into a workspace.
4. **CSS modes.** The packages never inject global CSS from JavaScript; the consumer imports what
   it uses. Both modes ship from the same tarballs:
   - **Mode A — Tailwind in the consumer.** `@import "tailwindcss"` first, then
     `@egdev/tokens/theme.css` (the `@theme` source) and the compiled `styles.css` of each package.
     Utilities written in consumer templates are generated by the consumer.
   - **Mode B — no Tailwind in the consumer.** `@egdev/tokens/tokens.css` is the compiled native
     artifact, so no Tailwind pipeline is needed at all. The compiled `styles.css` of each package
     already carries the utilities its components use.
5. **`--strict-peer-dependencies`.** The React, `three` and `@egdev/tokens` peers are checked at
   install time. A consumer that silently installs an untested React version is the failure mode
   this flag removes.

### Verify the install

After the block succeeds, the packages in `node_modules/@egdev/` are real installs, not workspace
links, and no installed manifest mentions `workspace:`:

```text
node_modules/@egdev/tokens   -> vendor/egdev/egdev-tokens-<version>-<commit7>.tgz contents
node_modules/@egdev/ui       -> vendor/egdev/egdev-ui-<version>-<commit7>.tgz contents
node_modules/@egdev/effects  -> vendor/egdev/egdev-effects-<version>-<commit7>.tgz contents
dist/tailwind/styles.css     -> mode A output
dist/native/styles.css       -> mode B output
```

### Upgrading a manual install

`egdev-ds upgrade` handles it: the names already follow its convention. Add `--add cli` to vendor
the CLI as well. By hand instead:

1. Run `pnpm release:pack` again in the design system repository. The folder is emptied on every
   run, so it never mixes two releases.
2. Replace **all** the tarballs in `vendor/egdev/` with step 1 of the block, update the file names
   in `package.json` and `pnpm-workspace.yaml`, and remove the old tarballs. The packages pin each
   other to the versions packed in the same run, so a partial replacement fails the strict peer
   check.
3. Repeat steps 7 and 8 of the block (`pnpm install` then both builds). Commit the updated tarballs
   with your product. The `@egdev` packages come from those tarballs; other dependencies may be
   fetched from a registry during installation.
