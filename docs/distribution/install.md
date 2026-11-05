# Installing `@egdev` packages from local tarballs

The design system ships to products as **versioned local tarballs**, without a registry. npm or
GitHub Packages publication is a separate decision; until it is taken, `@egdev/tokens`,
`@egdev/ui`, `@egdev/effects` — and the `@egdev/system` and `@egdev/mcp` artifacts added later —
reach a product as `.tgz` files produced by one command.

`pnpm release:pack` (repository root) builds the workspace, then writes one tarball per
release-set package into `release/`, named after the package manifest version
(`egdev-ui-0.1.0.tgz`). The command prints one line per tarball and fails with exit code 1 if a
packed manifest still contains a `workspace:` specifier or if a package has no `CHANGELOG.md`
section for the version being packed.

Versions and bump rules live in [versioning.md](./versioning.md). This guide installs exactly the
tarballs written by one `release:pack` run.

## Prerequisites

- **Node.js 24**, the range declared by `engines` in the repository root.
- **pnpm 10.34.6**, the version the repository pins with `packageManager`. Use the same pin in the
  consumer so tarball resolution behaves identically.
- **React and `react-dom`** are peers of `@egdev/ui` and `@egdev/effects`. The versions tested by
  this repository are 18.3.1 and 19.3.0; the range the packed manifest accepts is the
  `peerDependencies` entry inside the tarball.
- **`three`** is an exact `0.160.0` peer of `@egdev/effects`. Install that exact version, not a
  caret range.
- The packages reference each other (`@egdev/effects` depends on `@egdev/ui`; both declare
  `@egdev/tokens` as a peer at the version packed in the same run), so a consumer must resolve all
  of them from the same tarball set. Partially upgrading one tarball fails the install.

## The complete setup

Run this from an empty consumer directory. `EGDEV_RELEASE_DIR` must point at the `release/` folder
written by `pnpm release:pack` in the design system repository.

```sh
set -euo pipefail

: "${EGDEV_RELEASE_DIR:?set EGDEV_RELEASE_DIR to the release/ folder written by pnpm release:pack}"

# 1. Copy the tarballs into the consumer. release:pack empties its folder on every run, so each
#    glob matches exactly one file; the stable names let package.json stay version-agnostic.
mkdir -p vendor src
cp "$EGDEV_RELEASE_DIR"/egdev-tokens-*.tgz vendor/egdev-tokens.tgz
cp "$EGDEV_RELEASE_DIR"/egdev-ui-*.tgz vendor/egdev-ui.tgz
cp "$EGDEV_RELEASE_DIR"/egdev-effects-*.tgz vendor/egdev-effects.tgz

# 2. package.json: `file:` dependencies, the exact three peer and the pinned package manager.
cat > package.json <<'JSON'
{
  "name": "egdev-consumer",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.34.6",
  "dependencies": {
    "@egdev/tokens": "file:./vendor/egdev-tokens.tgz",
    "@egdev/ui": "file:./vendor/egdev-ui.tgz",
    "@egdev/effects": "file:./vendor/egdev-effects.tgz",
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
cat > pnpm-workspace.yaml <<'YAML'
overrides:
  '@egdev/tokens': 'file:./vendor/egdev-tokens.tgz'
  '@egdev/ui': 'file:./vendor/egdev-ui.tgz'
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

`scripts/package-release.test.mjs` runs that block verbatim, from an empty temporary directory,
against the tarballs produced by the real `pnpm release:pack`, and asserts that the install and both
builds succeed. The guide is therefore executable evidence, not prose.

## Why each step is required

1. **Copy the tarballs.** A `file:` dependency pointing into the design system repository would keep
   the consumer coupled to a checkout path. Copying into `vendor/` makes the consumer reproducible
   from its own tree and keeps `package.json` free of version numbers.
2. **`file:` dependencies.** The three `@egdev` packages are installed from the `.tgz` files
   themselves, so the consumer gets exactly the compiled `dist/` and stylesheets that
   `release:pack` verified, with no registry lookup and no workspace link.
3. **Overrides.** `@egdev/effects` depends on `@egdev/ui`, and both declare `@egdev/tokens` as a
   peer. pnpm resolves those internal requests through the overrides, so the two remaining tarballs
   are used instead of a registry version or a `link:` into a workspace.
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

## Verify the install

After the block succeeds, the packages in `node_modules/@egdev/` are real installs, not workspace
links, and no installed manifest mentions `workspace:`:

```text
node_modules/@egdev/tokens   -> vendor/egdev-tokens.tgz contents
node_modules/@egdev/ui       -> vendor/egdev-ui.tgz contents
node_modules/@egdev/effects  -> vendor/egdev-effects.tgz contents
dist/tailwind/styles.css     -> mode A output
dist/native/styles.css       -> mode B output
```

## Upgrading to a new tarball set

1. Run `pnpm release:pack` again in the design system repository. The folder is emptied on every
   run, so it never mixes two releases.
2. Replace **all** the tarballs in `vendor/`: the packages pin each other to the versions packed in
   the same run, so a partial replacement fails the strict peer check.
3. Repeat steps 7 and 8 of the block (`pnpm install` then both builds). Commit the updated tarballs
   or re-publish them with your product. The `@egdev` packages come from those tarballs; other
   dependencies may be fetched from a registry during installation.
