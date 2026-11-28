# `egdev-ds` — design system install, upgrade and check CLI

- **Status:** Approved — 2026-11-18 by the owner, with every recommended option (a) in §14 (verbatim answer: "si"; [#477](https://github.com/egdev6/egdev-design-system/issues/477); `odd/tasks/egdev-ds-cli.md` L5). The implementation plan needs separate approval.
- **Package:** `@egdev/cli`, the sixth package in the release set. It ships the `egdev-ds` binary.
- **Approved inputs:** the owner decisions recorded verbatim in `odd/tasks/egdev-ds-cli.md` S3 (L3): "New @egdev/cli package (Recommended)", "--from, default sibling DS release/ (Recommended)", "Checker inside the CLI (doctor) (Recommended)", "Skill calls the CLI (Recommended)". The owner's original request is S1: "sería interesante crear un comando o mcp que instale en un proyecto toda la infrastructura necesaria para integrar el design system?" then "si" then "vamos con ello ya".
- **Amendments:** `upgrade --add <list>` in §4 and §7.2, by owner decision L11 (`odd/tasks/egdev-ds-cli.md`, verbatim label "upgrade --add <pkg> (Recommended)"); the end-to-end test's skip flag in §10.5 (T8); consumer-request scaffolding by `init` (§6.7), amendment `odd/tasks/consumer-requests-flow.md` S12; `doctor --fail-on-pending` (§4 and §8), amendment `odd/tasks/consumer-requests-flow.md` S13; resolved-issue notices in `release.json`, `upgrade` and `doctor --from` (§3, §7 and §8), amendment `odd/tasks/consumer-requests-flow.md` S14; app-class overrides in DS046 (§8), amendment `odd/tasks/app-side-consumer-flow.md` S3; structural selectors in DS047 (§8), amendment `odd/tasks/app-side-consumer-flow.md` S6; DOM queries in DS048 (§8), amendment `odd/tasks/app-side-consumer-flow.md` S7; agent rules scaffolding by `init` (§6.7), amendment `odd/tasks/app-side-consumer-flow.md` S8; per-component DS046 allowances and the agent MCP fallback (§6.7 and §8), amendment `odd/tasks/app-side-consumer-flow.md` S9; DS046 also checks `@egdev/effects` components against the allowances of their own package (§8), by the owner's answers L5 and L6 in `odd/tasks/round-5-consumer-requests.md` (#566, `@egdev/cli` 0.5.0) and the CLI contract of the [HomeTemplate v0.2 spec](../components/home-template/v0.2/spec.md); DS040 accepts a raw `<a` in a file that renders `Prose` (§8), by the owner's answer L2 in `odd/tasks/prose-links-580.md` (#580, amendment S1) and the CLI contract of the [Prose v0.2 spec](../components/prose/v0.2/spec.md); DS046 and DS047 treat a component imported through a local barrel of `@egdev/ui` or `@egdev/effects` as a direct import, and DS049 warns about a barrel they cannot follow (§8), by the owner's answers L3 and L4 in `odd/tasks/doctor-barrels-582.md` (#582, amendment S2 to S5).
- **Next step after approval:** a separate implementation plan (T3), approved separately, and then the implementation PRs. This document changes no code and creates no package.

## How to read this document

Every factual claim is labeled:

- **[E]** is evidence: observed in the cited file, as `path:line`. Paths outside this repository are absolute, or relative to `/home/egdev/proyectos/`. They were read without changes.
- **[I]** is an inference or a proposal: behavior this spec defines. Nothing in the evidence establishes it yet. Every [I] that needs an owner choice links to an open question (**Q#**).

`<release>` is the folder written by `pnpm release:pack`. `<project>` is the consumer app directory that contains its `package.json`, such as `nexo/apps/hub` or `egdev-website`.

## 1. Purpose and non-goals

### Purpose

1. **One maintained implementation of the mechanics.** Today, three things handle installation and checks:
   - The install guide is a shell block that is copied by hand [E `docs/distribution/install.md:36-121`].
   - The global skill ships `ds-vendor.mjs`, which each app copies [E `/home/egdev/.gentle-shell/agent/skills/egdev-design-system/references/adoptar.md:7`]. The copies already exist in two apps [E `nexo/apps/hub/scripts/ds-vendor.mjs`, `egdev-website/scripts/ds-vendor.mjs`].
   - The guard is copied byte for byte into each app [E the skill's `assets/guard/design-system-guard.ts` matches `nexo/apps/hub/src/design-system-guard.ts` and `egdev-website/src/design-system-guard.ts`, both compared with `diff`].

   `egdev-ds` replaces the copies with one package that is versioned with the design system [I, decided by S3].
2. **`init <project>`** adds everything a consumer needs: vendored tarballs, manifest entries, overrides, CSS entry imports, a doctor script, MCP configuration and marked consumer and agent guidance (§6.7).
3. **`upgrade <project>`** replaces the vendored set as one unit from a newer `<release>`.
4. **`doctor <project>`** checks the install, peers, CSS entry, guard rules and MCP wiring. Each finding has a stable code.
5. Every command is idempotent and supports `--dry-run`, which prints the plan and writes nothing [E S2 in `odd/tasks/egdev-ds-cli.md`].
6. Supported consumers are pnpm and npm, with Vite or Next.js [E S2]. The two real consumers cover npm + Vite (Nexo, `nexo/apps/hub/package-lock.json` exists, `vite` in `nexo/apps/hub/package.json:34`) and pnpm + Next.js (`egdev-website/package.json:6,31`).

### Non-goals

These come from S2 unless marked otherwise:

- No npm registry and no publishing. Distribution stays local tarballs [E `docs/distribution/install.md:3-6`, `docs/distribution/versioning.md:7-8`].
- No commits in the consumer. Beyond that, the CLI never runs `git` at all (§9).
- No migration of app code to DS components. That judgment stays in the skill's **usar** mode [E skill `SKILL.md:26`].
- No edits to consumer themes beyond the opt-in accent host scaffold (§6.6, Q9).
- No packing. The CLI consumes a `<release>` and never builds the design system. `ds-vendor.mjs` does build it today, in a temporary git worktree [E skill `assets/ds-vendor.mjs:203-219,428-435`]. That behavior is removed on purpose (§12).
- No new dependencies. The CLI uses the Node standard library only [E S3].
- No `--fix` in `doctor` [I]. Doctor reports findings. `init` and `upgrade` are the only commands that write.

## 2. Package anatomy

| Item | Value | Basis |
| --- | --- | --- |
| Name | `@egdev/cli` | [E S3] |
| Location | `packages/cli/` | [E S3: bootstrap path `packages/cli/bin/egdev-ds.mjs`] |
| Binary | `"bin": { "egdev-ds": "./bin/egdev-ds.mjs" }` | [E S3] |
| Language | Plain ESM `.mjs`, no build step, no TypeScript compile | [I] Closest precedent: `@egdev/system` ships plain `.mjs` bins from `src/` (`packages/system/package.json:10-12`, `packages/system/src/cli.mjs:1`). `@egdev/mcp` needs `tsc` and runtime dependencies (`packages/mcp/package.json:18,21-25`), which S3 rules out. |
| `files` | `["bin", "src", "types", "CHANGELOG.md"]` | [I] `CHANGELOG.md` depends on Q3. `types` is the amendment below. |
| Types | Amendment, `odd/tasks/egdev-ds-485-486.md` S6 (#488): `"types": "./types/index.d.ts"` and `"exports": { ".": { "types": "./types/index.d.ts" }, "./package.json": "./package.json" }`. A hand-written, type-only entry exporting `GuardAllowlistEntry` and `DesignSystemAllowlist`; no runtime entry, no build step, no dependency. `src/guard.mjs` imports its typedef from it, so the shape has one source of truth. | [E #488: the skill's legacy guard exported `GuardAllowlistEntry`, and apps lost the type when they moved to the CLI] |
| `engines` | `"node": ">=24.0.0 <25"` | [E] Same range as the repository root and `@egdev/mcp` (`package.json:6-8`, `packages/mcp/package.json:14-16`). The website already requires `>=24.22.1` (`egdev-website/package.json:7-9`), which this range accepts. |
| `dependencies` | none | [E S3] |
| `scripts` | none. With no `build` script, `pnpm -r run build` skips the package. | [I] Assumes pnpm skips a missing script under `-r run`. The implementation plan must confirm it against `scripts/lib/pack-packages.mjs:200`. |
| Version | `0.1.0`, independent, bumped by hand | [E `docs/distribution/versioning.md:26-46`] |
| `CHANGELOG.md` | Required, `## 0.1.0` at the top | [E `release:pack` fails without a matching section: `scripts/lib/pack-packages.mjs:114-128,159-162`] |

### Modules

All modules are [I]. The plan may merge small modules, but every responsibility below needs one owner.

```text
packages/cli/
  bin/egdev-ds.mjs          # argv → run(); sets process.exitCode; no logic
  src/cli.mjs               # run(args, { cwd, io, runner, stdout, stderr }) — injectable, like runVendor
  src/args.mjs              # flag parsing, usage text, exit 2 on misuse
  src/detect.mjs            # package manager, framework, CSS mode, CSS entry, vendored state
  src/release.mjs           # read <release>/release.json, sha256, packed-manifest reader (gunzip + tar headers)
  src/plan.mjs              # build the ordered action list; format text and JSON plans
  src/apply.mjs             # transactional writes: staging, atomic rename, rollback
  src/manifest.mjs          # package.json edits (deps, overrides, scripts, packageManager)
  src/pnpm-workspace.mjs    # textual pnpm-workspace.yaml edits that keep comments
  src/lockfile.mjs          # npm lock rewrite + sha512 integrity verification (npm and pnpm)
  src/css.mjs               # CSS entry import detection and insertion
  src/semver.mjs            # minimal range check for peers: exact, ^, ||
  src/doctor.mjs            # check registry and the stable codes
  src/status.mjs            # read-only vendored-state report (amendment, odd/tasks/egdev-ds-485-486.md S3)
  src/guard.mjs             # checkDesignSystem, moved from the skill asset
  types/index.d.ts          # type-only public entry: GuardAllowlistEntry (amendment, odd/tasks/egdev-ds-485-486.md S6)
```

- `run()` takes an injectable filesystem, process runner and output streams. This mirrors `runVendor` [E skill `assets/ds-vendor.mjs:380-384`], whose deterministic tests depend on that injection [E skill `assets/ds-vendor.test.mjs:1-30`].
- The packed-manifest reader does the same job as `readPackedManifest` [E `scripts/lib/pack-packages.mjs:94-112`]. `ds-vendor.mjs` uses the `tar` binary instead [E skill `assets/ds-vendor.mjs:192`]. The CLI uses the dependency-free reader so it works on every platform. The CLI cannot import `scripts/` when it runs from its tarball, so the plan must choose one owner:
  - **Recommended:** move the reader into `packages/cli/src/release.mjs` and have `pack-packages.mjs` import it from there.
  - **Alternative:** keep two copies, plus a test that proves they agree.

### Tests

- `packages/cli/tests/*.test.mjs` run with `node:test` [I]. Precedents:
  - `packages/system/tests/cli.test.mjs:1-50` spawns the bin in an `mkdtemp` folder and asserts exit code, stdout and stderr exactly.
  - `scripts/package-release.test.mjs:199-225` already writes fixture tarballs with `gzipSync` and hand-made tar headers, without dependencies.
- The tests are listed against the acceptance criteria in §13.

## 3. Bootstrap and the `--from` source

- First run, from a design system checkout: `node <ds-repo>/packages/cli/bin/egdev-ds.mjs init <project>` [E S3].
- First run, from a tarball: `npm exec --yes --package=<release>/egdev-cli-<version>.tgz -- egdev-ds init <project>`. The end-to-end test runs exactly this form for its npm + Vite consumer (`scripts/cli-consumer.test.mjs`, AC19).
- After `init`, the CLI is vendored as a devDependency (Q7). From then on it runs as `pnpm exec egdev-ds …`, `npx egdev-ds …`, or through the `ds:doctor` script.
- `--from <dir>` selects the release folder [E S3]. When it is omitted, the default is `../egdev-design-system/release`.
  - [I] The default resolves against the **current working directory**. `ds-vendor.mjs` resolves its `--ds` default the same way [E skill `assets/ds-vendor.mjs:389`], and it is meant to run from the repository root [E skill `references/adoptar.md:7`].
  - For Nexo, run from the `nexo` root with `<project>` = `apps/hub`. The default then resolves to the sibling `egdev-design-system/release`.
  - If neither `--from` nor the default exists, the CLI prints this on stderr and exits with code 2: `No release folder: pass --from <dir> (default ../egdev-design-system/release not found).`

### Release provenance: `release.json`

Two inputs the CLI needs are missing from the evidence today:

- **The commit.** The vendored file names carry the DS commit (`egdev-<pkg>-<version>-<dscommit>.tgz`) [E skill `SKILL.md:19`; `nexo/apps/hub/package.json:16-17`; `egdev-website/package.json:22-24`]. `ds-vendor.mjs` gets that commit from `git` [E skill `assets/ds-vendor.mjs:167-181`].
- **The expected hashes.** The skill verifies each tarball's sha256 against "the announcement" [E skill `references/adoptar.md:33-35`].

`release:pack` writes neither of these. The folder holds only the tarballs [E `ls release/`; `scripts/package-release.test.mjs:81` asserts the folder holds exactly the tarballs].

[I, Q1] `release:pack` also writes `<release>/release.json`:

```json
{
  "schemaVersion": 1,
  "commit": "<40-hex DS HEAD at pack time>",
  "dirty": false,
  "packages": [
    { "name": "@egdev/ui", "version": "0.3.1", "file": "egdev-ui-0.3.1.tgz", "sha256": "<64-hex>" }
  ],
  "resolves": [{ "issue": 123, "package": "@egdev/ui", "version": "0.3.1" }]
}
```

- `release:pack` runs `git` **in the design system repository**, at pack time. The "CLI never runs git" rule in §9 applies to the CLI.
- Amendment `odd/tasks/consumer-requests-flow.md` S14: `resolves` is additive in schema version 1. It collects
  issue citations from every versioned packed changelog section, using the oldest version per issue/package, sorted by
  issue and package; `Unreleased` is ignored. A release without `resolves` means an empty list. A present field must be
  an array of objects with a positive integer `issue` and string `package` and `version`.
- The CLI refuses a release with `dirty: true` unless `--allow-dirty` is passed (Q2).
- A release without `release.json`, or one whose files or hashes disagree with it, is refused with exit 1 and a single stderr line that names the file.

## 4. CLI surface

```text
egdev-ds init    <project> [--from <dir>] [--packages <list>] [--css tailwind|native] [--css-entry <path>]
                           [--local-repo <name>] [--accent] [--no-install] [--offline] [--allow-dirty] [--force]
                           [--dry-run] [--json]
egdev-ds upgrade <project> [--from <dir>] [--add <list>] [--local-repo <name>] [--no-install] [--offline]
                           [--allow-dirty] [--dry-run] [--json]
egdev-ds doctor  <project> [--from <dir>] [--fail-on-pending] [--json]
egdev-ds status  <project> [--from <dir>] [--json]
egdev-ds --help | --version
```

**Amendment, `odd/tasks/egdev-ds-485-486.md` S2 and S3** (owner choices, verbatim labels "Repo folder + flag + shown in plan (Recommended)" and "New read-only `egdev-ds status --json` (Recommended)"): `--local-repo` and `status` below.

### `status` (S3)

`egdev-ds status <project>` reports the vendored state without changing anything: it writes nothing, spawns nothing, runs no git and adds no state file. Everything is derived from the vendored file names that §5.5 already parses.

- Text: the header `egdev-ds status <project> (<packageManager>, <framework>, <cssMode>)` (`unknown` when undetectable), `Vendored at <commit7>:`, one line per vendored package in release-set order (`  <name>  <version>  <specifier>`, columns aligned), then `Release at <commit7> (<dir>): upgrade available.`, `… up to date.`, or without `--from` `Release check skipped: pass --from <dir>.`
- Per package: name, the version from the file name, the project-relative file and the specifier style (`file:` or `file:./`). The dependency-field specifier wins over an override.
- `--json`: `{ "schemaVersion": 1, "command": "status", "project", "packageManager", "framework", "cssMode", "release": { "dir", "commit" } | null, "commit": "<commit7>", "packages": [{ "name", "version", "file", "style" }], "upgradeAvailable": boolean | null }`. App scripts, such as a `design/system.md` sync or an MCP check, read this instead of parsing file names.
- `--from <dir>` is optional and only adds the release commit and `upgradeAvailable` (the release commit does not start with the vendored commit). The release is read and its hashes verified as for `doctor` (§3).
- Exit 0 for a `vendored@<commit>` state. `none`, an unsafe `file:vendor/` path, `foreign` and `mixed` are refused with exit 2 and one stderr line, with the same messages `init` and `upgrade` use (`… run egdev-ds init.`, `Unsafe vendored path: …`, `… status reads only vendored tarballs.`, `… run egdev-ds upgrade.`).

### Flags

All entries are [I] except where cited. Flag names follow existing habits: `--dry-run` and `--packages` [E skill `assets/ds-vendor.mjs:11`], `--write`/`--check`-style verbs [E `packages/system/src/cli.mjs:20-24`], and kebab-case long flags only.

| Flag | Commands | Meaning |
| --- | --- | --- |
| `--from <dir>` | all | Release folder (§3). `doctor` uses it only for release-dependent checks (DS014, DS017, DS052). Without a release, those checks are skipped and reported as `skipped`. `status` uses it only to report the release commit and whether an upgrade is available (S3). |
| `--packages <list>` | init | Comma-separated names from `tokens,ui,effects,system,mcp`. Default: `tokens,ui,system,mcp` (Q13). `cli` is always added. Same value syntax and validation message as `ds-vendor.mjs` [E `assets/ds-vendor.mjs:36-42`]. Selecting `effects` also adds the exact `three` peer. |
| `--add <list>` | upgrade | Amendment, owner decision L11 (`odd/tasks/egdev-ds-cli.md`, verbatim label "upgrade --add <pkg> (Recommended)"). Comma-separated names from `tokens,ui,effects,system,mcp,cli`; an unknown or repeated name exits 2 with `Invalid --add: choose from tokens,ui,effects,system,mcp,cli.` Each named package the app does not declare yet is added with the file effects `init` gives it (§7.2). A named package the app already declares is just upgraded. A name the release does not list exits 1 (`Release lacks @egdev/<pkg>: …`). |
| `--css tailwind\|native` | init | Overrides CSS mode detection (§5.3). |
| `--css-entry <path>` | init | Overrides CSS entry detection. Must be a `.css` file inside `<project>`. |
| `--local-repo <name>` | init, upgrade | Amendment, `odd/tasks/egdev-ds-485-486.md` S2. `localRepo` for a newly created `egdev-ds.json` (§6.7); same rule as the file's key (`^[A-Za-z0-9._-]+$`), otherwise exit 2 with `Invalid --local-repo: expected a repository name (letters, digits, ., _ or -).` An existing file keeps its value: a different flag value prints `Note: egdev-ds.json keeps localRepo "<value>"; --local-repo <name> applies only when egdev-ds.json is created.` on stderr, which is not an error. `upgrade` creates the file only with `--add cli`; otherwise it prints `Note: --local-repo <name> has no effect: upgrade creates egdev-ds.json only with --add cli.` |
| `--accent` | init | Writes the accent host scaffold (§6.6, Q9). |
| `--no-install` | init, upgrade | Skips the lockfile refresh. The CLI prints the exact command instead. Integrity is then unverified, and `doctor` reports DS012/DS015 until the command runs. |
| `--offline` | init, upgrade | Adds `--offline` to the package manager install. `ds-vendor.mjs` always installs offline [E `assets/ds-vendor.mjs:246,357`]. Here it is opt-in, because `init` adds new external dependencies. |
| `--allow-dirty` | init, upgrade | Accepts a release packed from a dirty tree (Q2). |
| `--force` | init | Replaces conflicting values only in the keys the CLI owns (§9, Q8). It never deletes user content. |
| `--dry-run` | init, upgrade | Prints the plan and writes nothing, including `node_modules` [E S2]. |
| `--fail-on-pending` | doctor | Amendment `odd/tasks/consumer-requests-flow.md` S13: pending DS043 placeholders become errors (exit 1), with the same message. Other findings and the default behavior are unchanged; `--json` reports the effective severity and result. Consumer CI runs this flag; the local `ds:doctor` script stays warning-only for placeholders. |
| `--json` | all | Prints one JSON document on stdout instead of text (justified below). |

There is no `--packages` on `upgrade`. The set is replaced as one unit, and only for packages the app already declares (§7), plus the packages `--add` names explicitly (L11). `ds-vendor.mjs` allows a partial selection [E skill `assets/ds-vendor.test.mjs:169`]. That conflicts with S4 ("replace the set as one unit"), so this is a deliberate parity break (§12).

**Why `--json`:** with "Skill calls the CLI" [E S3], the skill reads the plan and the doctor findings. A stable JSON shape keeps that from depending on text parsing. Humans keep the text format. The JSON shape is versioned: `schemaVersion: 1`.

### Exit codes

The meanings below match `ds-vendor.mjs` [E `VendorError` status 2 for misuse and preconditions, 1 for failures: `assets/ds-vendor.mjs:16-18,26-42,180,400-402,463-464`].

| Code | Meaning |
| --- | --- |
| 0 | Success, or already current. `doctor` exits 0 when it finds no error-severity finding; warnings do not fail. |
| 1 | The operation failed and was rolled back (install failure, integrity mismatch, unreadable or inconsistent release), or `doctor` found at least one error. |
| 2 | Misuse, or a refused precondition. Examples: an unknown or duplicate flag, a missing `<project>`, no release folder, an ambiguous detection, conflicts without `--force`, `init` on a project vendored at another commit (use `upgrade`), `upgrade` on a project with nothing vendored (use `init`). Nothing is written. |

### stdout and stderr contract

- **stdout** carries only the plan, the results and the "Next steps" lines. With `--json`, stdout carries exactly one JSON document and nothing else, including when exit is 1 because of failed doctor checks.
- **stderr** carries errors, one line per error, with newlines inside a message replaced by spaces. Precedents: `packages/system/src/cli.mjs:60`, `scripts/lib/pack-packages.mjs:171-184`, `ds-vendor.mjs:463`.
- Misuse (exit 2) prints the error line and then the usage line on stderr, and nothing on stdout. Precedent: `packages/system/tests/cli.test.mjs`, the `badArgument` assertions.
- Package manager output is passed through to stderr. `pack-packages.mjs:75-77` does the same with `pnpm pack` stderr.
- `--help` prints usage on stdout and exits 0 [E `assets/ds-vendor.mjs:387`].

### Plan format (`--dry-run`, and the log of a real run)

[I] One header line, one line per action in the order it will run, and one footer line. The verbs are `create`, `edit`, `copy`, `remove`, `run` and `keep`. Paths are relative to `<project>`.

```text
egdev-ds init apps/hub (npm, vite, native) from ../egdev-design-system/release at e712915
  copy    vendor/egdev/egdev-tokens-0.5.0-e712915.tgz  sha256 3f1c…
  copy    vendor/egdev/egdev-ui-0.3.1-e712915.tgz      sha256 e99f…
  edit    package.json  dependencies.@egdev/tokens = file:./vendor/egdev/egdev-tokens-0.5.0-e712915.tgz
  edit    package.json  overrides.@egdev/system = $@egdev/system
  edit    package.json  scripts.ds:doctor = egdev-ds doctor .
  edit    src/styles.css  +@import "@egdev/tokens/tokens.css"
  create  egdev-ds.json  localRepo=nexo
  create  .mcp.json  mcpServers.egdev-design-system
  create  CONTRIBUTING.md  consumer requests summary
  create  AGENTS.md  design system agent rules
  run     npm install
Dry run: nothing written.
```

- A real run replaces the footer with `Initialized at e712915; <n> vendored integrities verified.`, and then prints the "Next steps" lines.
- An idempotent run prints `Already at e712915; <n> vendored integrities verified; no changes.`
- These wordings match `ds-vendor.mjs` [E `assets/ds-vendor.mjs:409,459`].
- With `--json`: `{ "schemaVersion": 1, "command", "project", "packageManager", "framework", "cssMode", "release": { "dir", "commit" }, "actions": [{ "verb", "path", "detail" }], "findings": [...], "result": "planned" | "applied" | "current" | "failed" }`.

## 5. Detection rules

[I] Detection runs first, reads only, and stops with exit 2 on any ambiguity. An explicit flag always overrides detection.

### 5.1 Package manager

1. `pnpm-lock.yaml` alone → pnpm. `package-lock.json` alone → npm. Same signals as `ds-vendor.mjs` [E `assets/ds-vendor.mjs:392`].
2. Both lockfiles present → exit 2: `Both package-lock.json and pnpm-lock.yaml exist; remove one.` This deliberately deviates from `ds-vendor.mjs`, which silently prefers npm [E `assets/ds-vendor.mjs:392`] (§12).
3. No lockfile → `packageManager` in `package.json` (`pnpm@…` or `npm@…`). The website pins `pnpm@10.34.6` [E `egdev-website/package.json:6`].
4. None of the above → exit 2: `Cannot detect the package manager: add a lockfile or packageManager.`
5. Yarn and bun are refused with exit 2 [E S2 scopes pnpm and npm only].

### 5.2 Framework

- `next` in dependencies or devDependencies → Next.js [E `egdev-website/package.json:31`].
- `vite` present and `next` absent → Vite [E `nexo/apps/hub/package.json:34`].
- Both present, or neither → exit 2, naming the two supported frameworks.

### 5.3 CSS mode

Mode A (`tailwind`) and mode B (`native`) are the two modes of the install guide [E `docs/distribution/install.md:99-112,138-145`].

- **Tailwind:** `tailwindcss` is a dependency, and the framework's plugin is present: `@tailwindcss/vite` for Vite [E `install.md:64`], `@tailwindcss/postcss` for Next.js [E `egdev-website/package.json:41`, `egdev-website/postcss.config.mjs:1-5`]. The detected CSS entry, if any, must also hold `@import "tailwindcss"` (or `'tailwindcss'`, with or without `source(…)`) [E `egdev-website/src/app/globals.css:9`].
- **Native:** no `tailwindcss` dependency. This is Nexo's case [E `nexo/apps/hub/package.json:15-36` has no Tailwind; it imports `tokens.css`: `nexo/apps/hub/src/main.tsx:4`].
- **Contradictory signals** → exit 2, asking for `--css`. Examples: a Tailwind dependency without its plugin, or a Tailwind import without the dependency.

### 5.4 CSS entry

The CSS entry is the file where the DS imports go.

- **Next.js:** the first that exists of `src/app/globals.css` [E `egdev-website/src/app/globals.css`] or `app/globals.css`.
- **Vite:**
  1. Read `index.html` → `<script type="module" src="…">` [E `nexo/apps/hub/index.html:10`] → the entry module.
  2. If the entry module already imports `@egdev/*/…css`, those JS imports are the DS entry. Nexo does this [E `nexo/apps/hub/src/main.tsx:4-5`]. `init` treats the CSS as already wired and leaves the module untouched.
  3. Otherwise, the first local `.css` file the entry module imports.
- **No entry found** → exit 2, asking for `--css-entry`.
- `init` never edits JS or TS modules. That would be migrating app code, a non-goal.

### 5.5 Existing vendor state

The vendored set is read the same way `ds-vendor.mjs` reads it [E `assets/ds-vendor.mjs:51-79,278-295`]:

- `@egdev/*` specifiers in `dependencies`, `devDependencies`, `optionalDependencies` and `peerDependencies`.
- npm `overrides`, including nested selectors.
- pnpm `pnpm.overrides`, and the `overrides:` block of `pnpm-workspace.yaml`.

A specifier is vendored when it matches `file:(./)?vendor/(<dir>/)?egdev-<…>.tgz` [E `assets/ds-vendor.mjs:52-56`]. Any other `file:vendor/` path is unsafe and refused.

The state is one of:

| State | Meaning |
| --- | --- |
| `none` | No `@egdev` packages. |
| `vendored@<commit>` | Every vendored file name carries the same 7-hex commit [E `assets/ds-vendor.mjs:57`]. |
| `mixed` | Several commits, or legacy names without a commit [E the website migration case: `assets/ds-vendor.pnpm.test.mjs:134`]. |
| `foreign` | An `@egdev` package resolves from a registry range or a `workspace:`/`link:` specifier. |

## 6. `init` — exact file effects

[I] `init` targets the `none` state. On `vendored@<commit>` equal to the release commit, it verifies the install and exits 0 without changes when the marked consumer-request and agent blocks exist (idempotency). For either missing block, `init` plans and writes the project block without reinstalling, unless an ancestor guide calls for a manual next step (§6.7; amendments `odd/tasks/consumer-requests-flow.md` S12 and `odd/tasks/app-side-consumer-flow.md` S8). On any other state it exits 2: `upgrade` handles `vendored@<other>` and `mixed`, and `foreign` needs `--force` (Q8).

### 6.1 Vendor folder and file names

- Tarballs are copied to `vendor/egdev/egdev-<pkg>-<version>-<commit7>.tgz` [I]:
  - The name format is the skill's convention [E skill `SKILL.md:19`].
  - The `vendor/egdev/` subfolder is the website precedent [E `egdev-website/pnpm-workspace.yaml:7-11`]. It keeps other vendored assets apart. Nexo uses bare `vendor/` [E `nexo/apps/hub/package.json:16-17`], and `upgrade` keeps whichever folder an app already uses [E parity `assets/ds-vendor.mjs:436-443`].
- Specifier style: `file:./vendor/egdev/<file>` [E style used by `install.md:56-58` and the website].
- The `<version>-<commit>` name, unlike `install.md`'s stable `vendor/egdev-ui.tgz` [E `install.md:44-46`], has two jobs:
  - npm keeps a stale integrity when the name and version do not change [E skill `references/adoptar.md:25`].
  - The commit is visible in `package.json` diffs.
- A destination file that exists with different bytes is never overwritten [E parity `assets/ds-vendor.mjs:230-232`].

### 6.2 `package.json`

These edits are common to both package managers:

| Key | Value | Basis |
| --- | --- | --- |
| `dependencies.@egdev/tokens`, `@egdev/ui`, and `@egdev/effects` when selected | `file:./vendor/egdev/<file>` | [E `install.md:55-58`; Nexo and website put them in `dependencies`] |
| `devDependencies.@egdev/system`, `@egdev/mcp`, `@egdev/cli` | `file:./vendor/egdev/<file>` | [E both apps keep system and mcp as devDependencies: `nexo/apps/hub/package.json:25-26`, `egdev-website/package.json:39-40`]; cli [I, Q7] |
| `dependencies.react`, `react-dom` | Added as `19.3.0` **only when absent**. An existing range is kept, and `doctor` checks the installed version (DS021). | [E `install.md:59-60`; tested versions `install.md:22-24`; packed range `scripts/package-release.test.mjs:57`] |
| `dependencies.three` | Added as exact `0.160.0` when effects is selected and `three` is absent. A different existing value is a conflict (§9). | [E `install.md:25-26,61`; `scripts/package-release.test.mjs:122-125`] |
| `scripts.ds:doctor` | `egdev-ds doctor .` | [E S3: "init adds a test/CI script that runs `egdev-ds doctor`"]; the name follows the root habit `props:check`, `system:check` [E `package.json:31-35`] [I] |

The CLI never adds `tailwindcss`, `vite` or `next`. The framework and its CSS pipeline belong to the app [I]. For example, mode A requires the app to already have Tailwind (§5.3).

### 6.3 npm only

- **`overrides`:** `"@egdev/<dep>": "$@egdev/<dep>"`, for each selected package that **another selected package depends on** (not peers):
  - `@egdev/system`, when `@egdev/mcp` is selected [E Nexo's only override: `nexo/apps/hub/package.json:37-39`; mcp depends on system: `scripts/lib/pack-packages.mjs:153-158`].
  - `@egdev/ui`, when `@egdev/effects` is selected [E effects depends on ui: `versioning.md:90`] [I for the `$` form, which follows Nexo's pattern].
  - Peers (`@egdev/tokens`) resolve from the root dependency and need no override [I, consistent with Nexo, which has no tokens override].
- **`packageManager`:** not added for npm [I].
- **`package-lock.json`:** written by `npm install` (§6.7).

### 6.4 pnpm only

- **`pnpm-workspace.yaml` `overrides:`** pins **every selected package** to its vendored file:
  - The website pins all five [E `egdev-website/pnpm-workspace.yaml:4-11`].
  - The install guide pins the peers it needs [E `install.md:71-77,135-137`].
  - Pinning every package covers transitive references such as mcp → system [E comment `egdev-website/pnpm-workspace.yaml:4-5`].
- If `package.json` already has `pnpm.overrides`, the CLI edits that instead. `ds-vendor.mjs` supports both locations [E `assets/ds-vendor.mjs:269-272,287-292`].
- **Missing file:** created with exactly the `overrides:` block, plus `strictPeerDependencies: true` [E `egdev-website/pnpm-workspace.yaml:13`; the guide's `--strict-peer-dependencies`: `install.md:114-116,146-148`].
- **Existing file:**
  - Edits are textual, so comments and layout survive [E parity `assets/ds-vendor.mjs:269-272`].
  - Missing keys are inserted under an existing `overrides:` block with its indent, or an `overrides:` block is appended.
  - An existing `strictPeerDependencies` value is left alone [I].
  - A layout the textual editor cannot place safely (flow mappings, anchors) → exit 2 with the exact snippet to add by hand [I].
- **`packageManager`:** `pnpm@10.34.6` when absent, the version the DS pins [E `package.json:5`, `install.md:20-21`]. An existing pin is kept, and `doctor` warns about a different major (DS003) [I].

### 6.5 CSS entry imports

| Mode | Lines inserted in the CSS entry, in this order | Position |
| --- | --- | --- |
| tailwind | `@import "@egdev/tokens/theme.css";` `@import "@egdev/ui/styles.css";` `@import "@egdev/effects/styles.css";` (effects only when selected) | Right after the `@import "tailwindcss"` line [E `install.md:100-105`] |
| native | `@import "@egdev/tokens/tokens.css";` `@import "@egdev/ui/styles.css";` `@import "@egdev/effects/styles.css";` | At the top, after any `@charset` [E `install.md:108-112`] |

- A line that already exists, in any quote style or order, is kept and not duplicated.
- The website deliberately imports effects **before** ui, as a workaround for #392 [E `egdev-website/src/app/globals.css:1-12`]. So `init` never reorders lines, and `doctor` checks presence, not order (DS030).

### 6.6 Accent host scaffold (`--accent`, Q9)

- Creates `src/theme/accent-host.ts` only if it does not exist.
- The file exports one function. It applies **the full** `createAccentTheme(input).variables` map to a consumer-owned host element, using `style.setProperty`.
- This is the approved consumer contract [E `docs/foundation/runtime-accent.md` "Approved consumer contract"; `packages/tokens/README.md:54-64`; export `@egdev/tokens/accent`: `packages/tokens/package.json:7-11`]. Nexo's use is the precedent [E `nexo/apps/hub/src/settings/palette.ts:2,58`].
- `init` never writes accent CSS, never touches existing theme files, and never chooses a host. Wiring the function into the app stays manual [I].

### 6.7 Doctor configuration, MCP and install

- **`egdev-ds.json`** at `<project>` (Q6) holds only the doctor options that the apps currently set by hand in their copied guard tests:

  ```json
  { "schemaVersion": 1, "sourceDirectory": "src", "themeDirectory": "src/theme/", "localRepo": "<repository folder>", "exclude": [] }
  ```

  - **`localRepo` default, amendment `odd/tasks/egdev-ds-485-486.md` S2** (#485): the name of the nearest ancestor of `<project>`, the project itself included, that holds a `.git` entry, a directory or a worktree's `.git` file. Only the entry's existence is checked; no git command runs and no `.git` data is read (§9.1). With no such ancestor, or when its name fails `^[A-Za-z0-9._-]+$`, the earlier rule applies: the `package.json` name without its scope, else `app`. Evidence: Nexo's `apps/hub` package `nexo-hub` produced `localRepo: "nexo-hub"`, while its issues live in the `nexo` repository.
  - `--local-repo <name>` overrides the default (§4). The plan always shows the value: `create  egdev-ds.json  localRepo=<value>` in text and as the action's `detail` in `--json`. An existing file is kept with its value (`keep  egdev-ds.json`).
  - `doctor` uses the same default in memory when the file is missing, so DS045 and the guard (DS043 placeholders) agree with what `init` would write.

  The evidence for those options [E]: `localRepo` and `themeDirectory` are guard options (skill `assets/guard/design-system-guard.ts:32-37,155-158`); the website sets `localRepo: 'egdev-website'` (`egdev-website/src/design-system-guard.test.ts:7`) and skips `(payload)` (`:18`). The defaults [I] are written explicitly so the file is self-describing.
- **`.mcp.json`** at `<project>`: adds `mcpServers["egdev-design-system"] = { "command": "node", "args": ["node_modules/@egdev/mcp/dist/index.js"] }` when mcp is selected [E the website's file has exactly that entry; the mcp bin path: `packages/mcp/package.json:5-7`].
  - Other servers in an existing file are kept.
  - An existing `egdev-design-system` entry with different args is a conflict (§9).
  - Nexo keeps `.mcp.json` at the **repository root**, with `apps/hub/node_modules/…` [E `nexo/.mcp.json`]. The CLI cannot locate a repository root without git. So it writes only `<project>/.mcp.json`, and `doctor` accepts the nearest ancestor `.mcp.json` whose args resolve (DS050) [I].
- **`CONTRIBUTING.md`**, amendment `odd/tasks/consumer-requests-flow.md` S12: search from `<project>` through the nearest
  ancestor holding a `.git` entry, inclusive, or only `<project>` without one. An ordered pair of markers in any guide
  needs no action, even if a nearer guide lacks it, except for the linked-project case below. Otherwise, if the nearest
  guide is an ancestor, leave it untouched and print `Add the consumer requests summary to <project-relative path>.` as
  a manual next step; as with other next steps, it is text-only and not a JSON write action. This applies to an
  already-vendored project too. A project guide that is a symlink, a hard link or not a regular file is never written and
  never refuses the run: with the markers it needs no action; without them `init` prints `Add the consumer requests
  summary to CONTRIBUTING.md by hand; it is a link or not a regular file.` without checking ancestors (verification
  finding: refusing would turn an existing exit 0 into exit 2).
  Otherwise create or append a short summary in the project between `<!-- egdev-ds:consumer-requests -->` and
  `<!-- /egdev-ds:consumer-requests -->`. It links the [canonical flow](./consumer-requests.md), names the issue,
  mitigation and separate maintainer upgrade, and warns against editing vendored tarballs, `egdev-ds.json` or
  `@egdev/*` lockfile entries. Preserve existing bytes, adding only the line endings needed for at least one blank line;
  keep existing extra blank lines and CRLF style. A marked block, including user edits, is untouched and has no plan
  action. Creation or append appears as `create` or `edit` in text and JSON plans, respects dry runs and rolls back with
  the other writes. `upgrade`, including `--add`, never touches this file.
- **`AGENTS.md`**, amendment `odd/tasks/app-side-consumer-flow.md` S8: search the same project-to-repository-root range
  for `<!-- egdev-ds:agents -->` followed by `<!-- /egdev-ds:agents -->`. A marked guide anywhere in that range needs no
  action, including when a nearer project guide is linked or irregular. Otherwise, an unmarked nearest ancestor is
  read-only and becomes the text-only next step `Add the design system agent rules to <project-relative path>.`
  A linked, hard-linked or irregular project guide is never written or refused; without a marked guide in the range,
  the manual step is `Add the design system agent rules to AGENTS.md by hand; it is a link or not a regular file.`
  Otherwise create or append the marked agent rules in the project with the same byte-preserving blank-line separation,
  CRLF handling and idempotency as CONTRIBUTING. The block names DS041, DS046, DS047 and DS048, tells agents to use DS
  components and tokens before writing UI, and links the Consumer request form and canonical flow. Amendment
  `odd/tasks/app-side-consumer-flow.md` S9: query the `egdev-design-system` MCP server when available; otherwise use the
  vendored `@egdev/mcp` over stdio (`node node_modules/@egdev/mcp/dist/index.js`) or the project's `design/system.md`.
  The block states: "Classes passed to DS components may set only CSS properties in their `className` contract
  (placement plus the component's published `classNameAllows`); anything else is DS046." Existing marked blocks are never
  rewritten, so apps keep their previous MCP and DS046 wording until they edit it by hand. The block appears in text
  and JSON plans, respects dry runs, rolls back with the transaction and is backfilled without reinstalling on
  already-vendored projects. `upgrade`, including `--add`, never touches it.
- **Install:**
  - Remove `node_modules/@egdev` inside `<project>` [E parity `assets/ds-vendor.mjs:245,356`].
  - Run `npm install` or `pnpm install --no-frozen-lockfile`, adding `--offline` when that flag is given. pnpm freezes the lockfile when `CI=true`; egdev-ds edits the manifests on purpose and verifies the lockfile itself, so it always lets pnpm update it (found by the AC19 end-to-end run in CI).
  - npm: before installing, rewrite the lock entries' `resolved` and `integrity` [E `assets/ds-vendor.mjs:122-155` and `references/adoptar.md:25`]. This applies only when a lockfile already exists.
  - After installing, verify every vendored lockfile integrity against the tarball's sha512 [E `assets/ds-vendor.mjs:81-95,297-311`].
- **Next steps** (stdout):
  - restart the dev server with `--force`;
  - regenerate `design/system.md` with `egdev-system-md --write`;
  - add `pnpm ds:doctor` (or `npm run ds:doctor`) to CI.

  The printed local script stays unchanged. The consumer-request merge check additionally runs
  `egdev-ds doctor <project> --fail-on-pending` in CI (amendment `odd/tasks/consumer-requests-flow.md` S13).

  Wording parity: `assets/ds-vendor.mjs:12` [E].

### 6.8 Summary matrix

| File | npm + Vite | npm + Next.js | pnpm + Vite | pnpm + Next.js |
| --- | --- | --- | --- | --- |
| `vendor/egdev/*.tgz` | copy | copy | copy | copy |
| `package.json` deps, scripts | edit | edit | edit | edit |
| `package.json` `overrides` (`$`) | edit | edit | — | — |
| `package.json` `packageManager` | — | — | edit if absent | edit if absent |
| `pnpm-workspace.yaml` | — | — | create/edit | create/edit |
| lockfile | via `npm install` | via `npm install` | via `pnpm install` | via `pnpm install` |
| CSS entry | entry CSS imported by the `index.html` module | `src/app/globals.css` or `app/globals.css` | as npm + Vite | as npm + Next.js |
| `egdev-ds.json`, `.mcp.json` | create/edit | create/edit | create/edit | create/edit |
| `CONTRIBUTING.md` | project create/append or manual ancestor next step | same | same | same |
| `AGENTS.md` | project create/append or manual ancestor next step | same | same | same |
| `src/theme/accent-host.ts` | only `--accent` | only `--accent` | only `--accent` | only `--accent` |

## 7. `upgrade` algorithm

[I, except where cited]

1. **Detect** the package manager and the vendored state (§5). `none` → exit 2 (use `init`). `foreign` → exit 2.
2. **Select** the packages the app declares or vendors through an override. Only those are upgraded, and none are added: Nexo does not use effects, and its upgrade must not add it [E S4; skill `references/adoptar.md:36`]. The detection matches `ds-vendor.mjs` [E `assets/ds-vendor.mjs:398-402`].
   - **Amendment, owner decision L11** (`odd/tasks/egdev-ds-cli.md` L11, verbatim label "upgrade --add <pkg> (Recommended)"). Without `--add`, the rule above is unchanged: upgrade adds nothing. `--add <list>` is the explicit opt-in that adds release packages to an already-vendored app, for example `cli` to an app vendored before `@egdev/cli` joined the release set, or `effects`. Each named package the app does not declare yet:
     - is selected with the declared ones, so step 4 checks it as part of the same unit. An internal dependency it needs that the app does not declare, and that `--add` does not name, exits 2: `<name> <version> needs <dependency>, which <project> does not declare; upgrade adds no packages: pass --add <pkg>.` Its external peers need not be installed yet; the install in step 8 brings them;
     - is copied to `<folder>/egdev-<pkg>-<version>-<commit7>.tgz`, where `<folder>` and the `file:` or `file:./` style come from the app's first vendored dependency (§6.1);
     - gets the `init` file effects for that package, through the same code: the `package.json` entry (`tokens`, `ui`, `effects` in `dependencies`; `system`, `mcp`, `cli` in `devDependencies`), the external peers it declares (exact `three` `0.160.0` for effects; an existing react range is kept), the npm `$` override or the pnpm pin (§6.3–§6.4), the CSS entry imports for `ui` and `effects` (§6.5), `scripts.ds:doctor` and `egdev-ds.json` when `cli` is added (its `localRepo` from `--local-repo` or the repository folder default, amendment `odd/tasks/egdev-ds-485-486.md` S2; an existing file keeps its value), and `.mcp.json` when `mcp` is added (§6.7);
     - has no changelog diff in step 6, because there is no installed version.
   - Amendments `odd/tasks/consumer-requests-flow.md` S12 and `odd/tasks/app-side-consumer-flow.md` S8: neither `upgrade` nor `upgrade --add` creates or edits `CONTRIBUTING.md` or `AGENTS.md`.
   - When the Vite entry module imports the design system CSS (Nexo), an added stylesheet is code, not an owned key: upgrade edits nothing there and prints `Import <file> in <module>.` among the next steps; `doctor` reports DS030 until it is added.
   - Owned keys with a different value (`three`, `scripts.ds:doctor`, the `.mcp.json` server) are conflicts (§9.7). They are listed, nothing is written, and the command exits 2: `upgrade` has no `--force`.
   - An `--add` package that is already declared adds nothing, so a repeated `upgrade --add` at the same commit prints `Already at …; no changes.` (§9.8). Dry run, rollback and the old-tarball rules are unchanged.
3. **Load the release.** Read `release.json` (§3), check every selected package's file exists, compute its sha256 and compare it with `release.json` [E S4 "verify sha256"; skill `references/adoptar.md:35`]. Read each packed manifest and check its name and version match the file name [E parity `assets/ds-vendor.mjs:194-196`].
4. **Check the set as one unit:**
   - No packed manifest contains `workspace:` [E S4; `scripts/lib/pack-packages.mjs:143-151`].
   - Every `@egdev/*` dependency or peer inside a selected tarball names the version of that package **in the same release** [E coupling: `versioning.md:85-93`; `install.md:27-29`].
   - The external peers (`react`, `react-dom`, `three`) declared by the new tarballs are satisfied by the app's installed versions [E S4 "peer coherence"].
   - If a selected package depends on a package the release lacks, exit 1.
5. **Short-circuit.** If every selected package already points at `<commit7>` files with matching hashes and lock entries, verify the integrities and print `Already at …; no changes.` with exit 0 [E parity `assets/ds-vendor.mjs:404-411`; test `assets/ds-vendor.test.mjs:108`].
6. **Changelog diff.** For each package whose version changes, print the `CHANGELOG.md` sections newer than the old version, up to and including the new one. If a version is unchanged but the commit changed, print "unchanged version". Changelogs **are not in the tarballs today** [E `tar -tzf release/*.tgz` lists only `package/README.md`]. This step depends on Q3; without it, the CLI prints only `old → new` versions.
7. **Plan, then apply as one transaction (§9):**
   - Copy the new files, including unchanged versions, so the whole set points at one commit [E skill `references/adoptar.md:37`].
   - Rewrite every specifier: dependency fields, npm overrides, `pnpm.overrides` and `pnpm-workspace.yaml`. Each package keeps its existing folder and specifier style [E `assets/ds-vendor.mjs:436-443`].
   - npm: rewrite the lock entries, including metadata fields [E `assets/ds-vendor.mjs:122-155`; test `assets/ds-vendor.test.mjs:216`].
8. **Refresh the lockfile.** Remove `node_modules/@egdev`, then run `npm install` or `pnpm install --no-frozen-lockfile` (with `--offline` when given). Then verify every vendored integrity and that the installed specifiers point at the new commit [E `assets/ds-vendor.mjs:244-251,357-364`].
9. **On failure** at any step before success: restore `package.json`, the lockfile and `pnpm-workspace.yaml` byte for byte, and remove the tarballs this run copied. Exit 1 [E `assets/ds-vendor.mjs:252-256,365-368`; tests `assets/ds-vendor.test.mjs:246`, `assets/ds-vendor.pnpm.test.mjs:166,173`].
10. **After success**, remove the previous tarballs that nothing references anymore. A failed removal is reported with exit 1 and `new installation is intact`, and never rolled back [E `assets/ds-vendor.mjs:258-265,370-376`; test `assets/ds-vendor.test.mjs:254`].
11. **Print** the "Next steps" (§6.7). Amendment `odd/tasks/consumer-requests-flow.md` S14: after a successful text
    upgrade, load the guard allowlist as doctor does and add one removal step per entry whose DS issue is in the
    release's `resolves` for a selected package, including packages just added with `--add`. Name its file, source line
    when available, issue and all relevant resolving packages and versions in package-name order. An unloadable
    allowlist is skipped without failing the upgrade. As with existing next steps, these notices are not in `--json`,
    `--dry-run` or the already-current output. Loading the allowlist executes project code; trust the project.

## 8. `doctor` checks

[I] Codes are stable: a code is never reused for a different check, and the text after the code may change. Each finding is `{ code, severity, message, file?, line? }`. In text mode a finding prints as `DS012 error package-lock.json: Integrity mismatch: @egdev/ui (file:vendor/…)`. Severity `error` makes the exit code 1; `warning` and `skipped` do not.

| Code | Severity | Check | Basis |
| --- | --- | --- | --- |
| DS001 | error | `<project>/package.json` exists and parses | [E `assets/ds-vendor.mjs:46-49`] |
| DS002 | error | Package manager detectable and unambiguous (§5.1) | [I] |
| DS003 | warning | pnpm `packageManager` major differs from the DS pin `pnpm@10` | [E `install.md:20-21`] |
| DS010 | error | Every vendored specifier is a safe `vendor/` path | [E `assets/ds-vendor.mjs:52-56,87,293`] |
| DS011 | error | Every vendored tarball file exists | [E `assets/ds-vendor.mjs:89-90`] |
| DS012 | error | Every vendored lockfile integrity matches the tarball's sha512 (npm `package-lock.json`, pnpm `resolution.integrity`) | [E `assets/ds-vendor.mjs:81-95,297-311`] |
| DS013 | error | No `workspace:` or `link:` specifier for `@egdev/*` in `package.json` or the installed manifests | [E S4; `install.md:150-153`; `scripts/package-release.test.mjs:333-341`] |
| DS014 | error | All vendored files carry one commit (no `mixed` state), and with `--from` that commit is the release commit (otherwise a warning: `upgrade available`) | [E S4 "replace the set as one unit"] |
| DS015 | error | `node_modules/@egdev/<pkg>` exists, is inside `<project>` (not a link), and its version equals the vendored tarball's manifest | [E `scripts/package-release.test.mjs:327-333`] |
| DS016 | error | Overrides complete: npm `$` overrides for internal dependencies; pnpm overrides for every vendored package (§6.3–6.4) | [E `nexo/apps/hub/package.json:37-39`; `egdev-website/pnpm-workspace.yaml:6-11`] |
| DS017 | error | `--from` only: the vendored tarballs' sha256 match `release.json` when the commits match | [E S4] |
| DS020 | error | Internal peer coherence: each installed `@egdev` package's `@egdev/*` peer or dependency version equals the installed one | [E `versioning.md:85-93`] |
| DS021 | error | External peers: installed `react`, `react-dom` and `three` versions satisfy the packed peer ranges (`^18.3.1 \|\| ^19.3.0`; exact `0.160.0`) | [E `scripts/package-release.test.mjs:56-57,122-138`] |
| DS030 | error | The CSS entry, or the JS entry module for Vite apps that import CSS from JS, imports the mode's token file and `@egdev/ui/styles.css`, plus `@egdev/effects/styles.css` when effects is a dependency. Order is not checked. | [E `install.md:99-112`; `nexo/apps/hub/src/main.tsx:4-5`; `egdev-website/src/app/globals.css:9-12`] |
| DS031 | error | CSS mode coherence: `theme.css` requires a Tailwind import before it; `tokens.css` and `theme.css` are not both imported | [E `install.md:138-145`] |
| DS040 | error | Guard: raw `<button`, `<input`, `<a`, `<label` in non-test `.tsx` under `sourceDirectory`, except a sole `asChild` child, an allowlisted entry or, for `<a` only, a file that renders `Prose` (amendment `odd/tasks/prose-links-580.md` S1) | [E skill `references/freno.md:7`; guard asset; I, amendment `odd/tasks/prose-links-580.md` S1 for the `Prose` exemption] |
| DS041 | error | Guard: `.eg-*` or `[role=tab]` selectors in CSS outside `themeDirectory` | [E skill `references/freno.md:8`] |
| DS042 | error | Guard allowlist: invalid issue, empty reason, TODO mismatch, stale entry. The entry shape doctor accepts (`file`, `pattern`, `issue`, `reason` strings; optional `kind: 'component-gap'` and `comment` string) is the published `GuardAllowlistEntry` type (§2 Types; amendment S6, #488), pinned by a drift test | [E skill `references/freno.md:9-11`; `assets/guard/design-system-guard.ts:163-174,192-194`] |
| DS043 | warning (error with `--fail-on-pending`) | Guard: `<localRepo>#TBD-*` placeholders pending; the message is unchanged | [E `assets/guard/design-system-guard.ts:195`; `nexo/apps/hub/src/design-system-guard.test.ts:32-35`; amendment `odd/tasks/consumer-requests-flow.md` S13] |
| DS044 | error | Guard engine unavailable: `typescript` or `postcss` not resolvable from `<project>` (Q4) | [E the guard imports both: `assets/guard/design-system-guard.ts:1-2`] |
| DS045 | error | `egdev-ds.json` missing or invalid | [I, Q6] |
| DS046 | error | Guard: an app CSS class on an `@egdev/ui` or `@egdev/effects` component, imported directly or through a local barrel, sets properties outside the base placement list and the component's `classNameAllows` contract, outside `themeDirectory`; base `min-width` and `min-height` are placement only at zero | [I, amendment `odd/tasks/app-side-consumer-flow.md` S3, S5 and S9; `odd/tasks/round-5-consumer-requests.md` L5; `odd/tasks/doctor-barrels-582.md` S2 to S4] |
| DS047 | error | Guard: an app selector reaches into the internal structure of an `@egdev/ui` component, imported directly or through a local barrel | [I, amendment `odd/tasks/app-side-consumer-flow.md` S6; `odd/tasks/doctor-barrels-582.md` S2 to S4] |
| DS048 | error | Guard: app code queries DS markup by its `.eg-*` class markers | [I, amendment `odd/tasks/app-side-consumer-flow.md` S7] |
| DS049 | warning | Guard: a local barrel of `@egdev/ui` or `@egdev/effects` that DS046 and DS047 cannot follow, so they do not check what it re-exports: it has an `export *`, an `export * as NS` or a local re-export of an imported binding, or no scanned import resolves to it. One finding per barrel file. Not allowlistable; `--fail-on-pending` does not change it | [I, amendment `odd/tasks/doctor-barrels-582.md` S5] |
| DS050 | warning | `@egdev/mcp` is a dependency, but no `.mcp.json` in `<project>` or an ancestor has an `egdev-design-system` server whose script path exists | [E `egdev-website/.mcp.json`; `nexo/.mcp.json`] |
| DS051 | warning | Amendment, `odd/tasks/egdev-ds-485-486.md` S3. With vendored files, the nearest `design/system.md` from `<project>` up to its repository root (the nearest `.git` ancestor; only `<project>` without one) records a design system commit in its first line, `<!-- Generated from EGDEV design system <commit>; … -->`, that differs from the vendored commit (prefix comparison, 7 to 40 hex): `Header records <a>, vendored at <b>: regenerate design/system.md.` `skipped` when the vendored set is mixed, the file is absent, or the first line records no commit | [E the header both apps' sync scripts write: `egdev-website/scripts/design-system-md.mjs:11`, `nexo/apps/hub/scripts/sync-design-system-md.mjs:5`; Nexo keeps the file at its repository root: `nexo/apps/hub/scripts/sync-design-system-md.mjs:8`. `egdev-system-md` itself writes no commit: `packages/system/src/render-system-md.mjs:87-97`] |
| DS052 | warning | With `--from` at the same vendored commit, match guard allowlist `egdev6/egdev-design-system#N` entries against `resolves` for packages the project declares or vendors. Warn once per matching entry, naming the mitigation and all relevant resolving packages/versions in package-name order, with a source line when available. Skipped without `--from`; with a release whose `resolves` is empty or absent it adds no finding; otherwise skipped when the vendored commit is absent, mixed or different from the release, or when the allowlist cannot load. `--fail-on-pending` does not change this severity. | [I, amendment `odd/tasks/consumer-requests-flow.md` S14] |

- **Guard parity:** `src/guard.mjs` moved the skill's `checkDesignSystem` here, initially unchanged except for its options source [E S3 "one maintained guard implementation"]. Both apps' copies were identical to the asset (see §1). Its existing tests moved with it, including the comment-trivia regression [E skill `references/freno.md:33`]. DS046 extends the guard without changing DS040–DS045 (amendment `odd/tasks/app-side-consumer-flow.md` S3); the one later change to them is the `Prose` anchor exemption of DS040 below (amendment `odd/tasks/prose-links-580.md` S1). Amendment `odd/tasks/doctor-barrels-582.md` S2 to S5 changes none of DS040 to DS045 or DS048: it widens which imports DS046 and DS047 recognize and adds the warning DS049 (Local barrels below).
- **Allowlist file:** `src/design-system-allowlist.ts`, as in both apps [E `nexo/apps/hub/src/design-system-allowlist.ts:1-5`]. It is loaded with Node 24's built-in type stripping, which the file's syntax allows (only `import type` plus an array literal) [I, Q5]. Apps type it with `import type { GuardAllowlistEntry } from '@egdev/cli'` (S6, #488).
- **App-class overrides (DS046):** in non-test `.tsx` under `sourceDirectory`, collect string literals and static template parts anywhere in `className` expressions on named, aliased or namespace `@egdev/ui` or `@egdev/effects` imports (or on the names a local barrel re-exports from them, see Local barrels below), including conditional branches, logical operands, arrays and non-computed string or identifier object keys. Variables are not evaluated and computed object keys are ignored (verification amendment, `odd/tasks/app-side-consumer-flow.md` T1). In CSS under `sourceDirectory` outside `themeDirectory` and excluded paths, a class on the selector's last compound matches, including in media and nested rules. Report one error per rule with its selector, component and offending properties. Permit only custom properties (`--*`), `margin` and `margin-*`, `align-self`, `justify-self`, `place-self`, `flex`, `flex-grow`, `flex-shrink`, `flex-basis`, `order`, `grid-area`, `grid-column*` and `grid-row*`. `min-width` and `min-height` are also permitted only at literal `0`, optionally followed by `%` or a CSS length unit from the [CLI reference](../../packages/cli/README.md#guard-allowlist), case-insensitively and with `!important` tolerated; `0foo`, `auto`, `min-content`, `calc()` and `var()` remain findings under that base list, as do `width`, `max-width`, `height` and `max-height` even at zero. Amendment `odd/tasks/app-side-consumer-flow.md` S9 extends the base list with the matched component's `classNameAllows` from the project's vendored `@egdev/system/design-system.json`. Resolve the artifact from `<project>` with Node module resolution, not from the DS checkout, and match the real exported component name for aliases and namespace members. An allowance applies only to imports from its own package (the entry's `package`), so an `@egdev/effects` entry never extends an `@egdev/ui` component of the same name, and the reverse; an effects component with no entry uses the base list alone. A missing, unreadable or invalid artifact or a missing component entry silently uses the base list. DS040, DS041, DS047 and DS048 are unaffected: they ignore `@egdev/effects` imports as before. An app that updates the CLI can see new DS046 errors on CSS-file rules for classes passed to `@egdev/effects` components (amendment `odd/tasks/round-5-consumer-requests.md` L5, #566). An exception uses the CSS file and exact whitespace-normalized rule selector as the allowlist `file` and `pattern`; existing issue, stale and pending rules apply. Tailwind utility classes, inline styles and classes only in earlier structural compounds are outside this check. [I, amendment `odd/tasks/app-side-consumer-flow.md` S3, S5 and S9]
- **Raw elements (DS040):** in non-test `.tsx` under `sourceDirectory`, honoring `exclude`, report a raw `<button`, `<input`, `<a` or `<label` opening or self-closing tag unless it is the sole child of a PascalCase element with `asChild`, or an allowlist entry covers it. Amendment `odd/tasks/prose-links-580.md` S1 (#580; contract in the [Prose v0.2 spec](../components/prose/v0.2/spec.md)): a raw `<a` is not reported in a file that renders `Prose`, because Prose styles the bare anchors of long-form content at the reading size, where DS `Link` uses a smaller label step. A file counts when one of its JSX elements has a tag that the in-memory, `noResolve` program DS046 already builds (no module resolution and no disk; the `tsconfig` `paths` that DS046 and DS047 use to reach a barrel play no part here) ties to an import of the export `Prose`: a named import, an alias matched by its export name (`import { Prose as Reading }`) or a namespace member (`<DS.Prose>`), from any module, so `@egdev/ui`, an app barrel such as `@/components/egdev-ui` and a relative path all qualify. A type-only import or specifier, a default import, `require`, a re-export, a barrel alias that renames the export, a lowercase `<prose>`, an import that is never rendered and a parameter or local that shadows the name do not count. In such a file an anchor anywhere is accepted, inside the `Prose` element or outside it, in any function of the file and with any attributes, so an unrelated raw `<a` in the same file passes too, and so does one in a file that imports an app component under the export name `Prose`. `<button`, `<input` and `<label` are still reported there. A raw `<a` in a file that does not render `Prose` is reported as before: each file is judged alone, so a converter or wrapper in another file is not covered (co-locate the anchor, use an issue-backed entry or use `Link`). The DS040 message and the results of DS041 and DS046 to DS048 are unchanged, and no flag, exit code, JSON or plan format, config key or dependency changes. An allowlist entry that covered an anchor now accepted is unused, so DS042 reports it stale (`Stale allowlist entry <pattern>; remove it.`): delete the entry and its comment. The guard does not check `href`, `rel`, `target` or an accessible name, and a bare anchor lacks what `Link` supplies for an external link (`target`, a merged `rel` and a hidden notice), so the converter sets them. [I, amendment `odd/tasks/prose-links-580.md` S1]
- **Structural selectors (DS047):** in the same CSS files and with the same DS-component class collection as DS046, report one error per rule when a selector has that class before a descendant or child combinator and the last compound has no app-owned class. App-owned classes are the static candidates collected by the same rules from `className` on any JSX element in scanned non-test `.tsx` files. Any declaration counts, including placement. App-owned last compounds, sibling combinators immediately after the component compound and last compounds with `.eg-*` are not DS047; DS041 reports the latter. Judge comma-separated selectors independently and name the offending parts. Media and nested rules are checked. DS046 and DS047 exceptions use the CSS file and whitespace-normalized full rule selector; for a rule triggering DS047, a full-selector entry also covers its DS041 parts. A DS041 entry for one comma-list part covers only that part, not other parts or DS046/DS047, and stays used while its part exists. Existing stale and pending rules apply. A component imported through a local barrel is collected like a direct import (Local barrels below). [I, amendment `odd/tasks/app-side-consumer-flow.md` S6; `odd/tasks/doctor-barrels-582.md` S2 to S4]
- **Local barrels (DS046, DS047, DS049):** by the owner's answers L3 ("B + C (Recomendado)") and L4 in `odd/tasks/doctor-barrels-582.md` (#582, amendment S2 to S5). An app that re-exports the design system through its own barrel, as egdev-website does with `@/components/egdev-ui`, hid those components from DS046 and DS047. A **barrel** is a non-test `.ts` or `.tsx` file under `sourceDirectory`, honoring `exclude`, with at least one value re-export from `@egdev/ui` or `@egdev/effects`. The guard follows its named re-exports, `export { X } from '@egdev/ui'` and `export { X as Y } from '@egdev/ui'`, and maps each exported name (`Y`, else `X`) to the export and package it re-exports; a type-only declaration or specifier is ignored. The guard still uses no TypeScript module resolution and reads no file: the follow is syntactic, one hop and over the scanned files. An import specifier in a scanned non-test `.tsx` file reaches a barrel when it resolves to the barrel's file: a relative specifier (`./`, `../`, `.` or `..`) from the importing file, or a specifier matched by `compilerOptions.paths` in `<project>/tsconfig.json`, relative to `compilerOptions.baseUrl` or the `tsconfig` directory. `doctor` reads that file where it already reads the project's files, with the project's own `typescript` (JSON with comments and trailing commas), and passes `paths` and `baseUrl` to the guard as data. A `*` wildcard substitutes as TypeScript does: an exact key wins over a pattern, among patterns the longest prefix wins, the targets are tried in order and each `*` takes the text that the key's `*` matched; a relative specifier never uses `paths`. A bare `baseUrl` without a matching `paths` entry resolves nothing, `extends` is not followed, and a missing, unreadable or invalid `tsconfig.json` adds no mappings and no finding. A candidate is tried as written, then with `.ts`, `.tsx`, `/index.ts` and `/index.tsx`, and the first scanned file wins. A named (`import { Button }`), aliased (`import { Button as B }`) or namespace (`import * as UI`, rendered as `<UI.Button>`) import of a barrel name becomes an owner exactly as a direct import of the mapped export and package does: DS046 checks it with that package's `classNameAllows`, DS047 treats `@egdev/ui` owners as structural (`@egdev/effects` owners stay outside DS047), and the shadowing, type-only and default-import rules, the findings, the allowlist matching and the stale entries are unchanged. A name the barrel does not re-export from `@egdev/*`, including its own wrappers and its re-exports from other modules, is not an owner. DS040, DS041 and DS048 are unchanged. **DS049** (warning, one finding per barrel file, in the file order of the guard's scan) says that DS046 and DS047 do not check what a barrel re-exports, because it has a value re-export the guard cannot follow (`export *`, `export * as NS`, or a local re-export of an imported binding such as `import { X } from '@egdev/ui'; export { X }`, `export { X as Y }` or `export default X`), or because no import in a scanned non-test `.tsx` file resolves to it. A type-only import counts as resolving; an import only in tests, in a `.ts` file or through another module's re-export does not, and neither does an alias that `paths` does not give. The finding names the barrel file, with the line of its first unfollowable re-export when it has one, and reads `Barrel not followed (<reasons>): DS046 and DS047 do not check what it re-exports; <fixes>.`. The reasons are the text of each unfollowable re-export and `no scanned import resolves to it`, joined by `; `. The fixes are `re-export each component by name from its package` and `import the barrel by a relative path or a tsconfig.json paths alias`, joined by ` and `, each only for the reasons that apply. It is not allowlistable (an entry for it is a stale entry, DS042), and `--fail-on-pending` does not change it. An app that updates the CLI and imports components through a barrel can see new DS046 and DS047 errors, and DS049 for each barrel the guard cannot follow. [I, amendment `odd/tasks/doctor-barrels-582.md` S2 to S5]
- **DOM queries (DS048):** in non-test `.ts` and `.tsx` files under `sourceDirectory`, honoring `exclude`, report one error per call when a static first argument of `querySelector`, `querySelectorAll`, `closest` or `matches` on any receiver contains a `.eg-*` class selector. Also check static arguments of `getElementsByClassName` and `classList.contains`, `add`, `remove` and `toggle` for whole `eg-*` class tokens. Optional chaining and literal element access such as `el['closest'](...)` are supported. String literals, no-substitution templates and static template parts are checked; dynamic arguments and interpolated expressions are not evaluated. The guard test-file rule excludes `__tests__/`, `.test.ts`, `.spec.ts`, `.test.tsx` and `.spec.tsx`; story files follow that rule rather than a separate exclusion. An exception uses the source file and the exact whitespace-normalized static selector or class string as written, without delimiters; for an interpolated template it uses the first static part with a marker. The finding renders the method with that normalized string and its original single, double or backtick delimiter, omitting type arguments, other arguments and template substitutions so source layout does not change the message. Duplicate calls need separate entries. Existing DS042 and DS043 rules apply. Use a ref or app-owned wrapper, or an issue-backed exception. [I, amendment `odd/tasks/app-side-consumer-flow.md` S7]
- **`design/system.md` freshness:** a full content check stays deferred. Nexo's file carries a custom header and a whitespace fix [E `nexo/apps/hub/scripts/sync-design-system-md.mjs:5-7`], so `egdev-system-md --check` would always report stale. DS051 (S3) checks only the commit the header records.

## 9. Idempotency and safety rules

[I unless cited]

1. **Never run `git`.** The CLI never spawns `git`, reads no `.git` data, and stages or commits nothing. Checking whether a `.git` entry exists, to name the repository folder (`localRepo`, §6.7) and bound the DS051 lookup, reads no data (S2). This also drops the merged-on-`origin/main` check that `ds-vendor.mjs` performs [E `assets/ds-vendor.mjs:175-181`] (Q2).
2. **Only spawn the detected package manager**, with the documented arguments. No other process.
3. **Stay inside `<project>`.** Every write target resolves inside `<project>`, with symlinks and multi-link files refused as targets; linked or irregular project guides instead use the non-failing manual guidance in §6.7. Precedent: `packages/system/src/cli.mjs:26-47`. Reads outside `<project>` are limited to `--from`, ancestor `.mcp.json` files (read only), the existence of ancestor `.git` entries and ancestor `design/system.md` files up to the repository root (DS051, read only), ancestor `CONTRIBUTING.md` and `AGENTS.md` files up to that root (S12 and S8, read only), the project's Node-resolved `typescript`, `postcss` and `@egdev/system/design-system.json` (S9, read only), and the CLI's own files.
4. **Atomic writes.** Each file is written to a temporary file in the same folder and renamed into place, so a reader never sees a partial file. Precedent: `scripts/lib/pack-packages.mjs:53-60,83-84`.
5. **Transaction and rollback.** Originals are snapshotted before the first write, and every failure restores them and removes the files the run copied (§7 step 9). Old tarballs are removed only after success.
6. **Owned keys only.** The CLI owns exactly the keys listed in §6. It never deletes or rewrites anything else. JSON files are re-serialized with 2-space indent and a trailing newline [E parity `assets/ds-vendor.mjs:14`], with key order kept and new keys appended. YAML and CSS are edited as text.
7. **Conflicts.** A key the CLI owns that already holds a different, user-set value is a conflict. Examples: `@egdev/ui: "^0.3.0"`, `three: "0.161.0"`, a different `.mcp.json` server entry, a `scripts.ds:doctor` with another command. Conflicts are listed, and the command exits 2 without writing. `--force` replaces **only those values**; it never deletes a file or another key (Q8). `upgrade` has no `--force`, because the keys it rewrites are already vendored specifiers.
8. **Idempotency.** Running any command twice with the same release produces no further change and exits 0. Tests prove this byte for byte (§13).
9. **No working-tree checks.** The CLI cannot see uncommitted changes without git. It relies on `--dry-run` and rollback, and prints "Review the diff before committing." (Q14).
10. **Dry run writes nothing anywhere,** `node_modules` included [E parity test `assets/ds-vendor.test.mjs:121`].

## 10. Release-set integration

1. **Membership:** append `'@egdev/cli'` to `RELEASE_SET` [E `scripts/lib/pack-packages.mjs:10`]. `releaseMembers` then picks it up from `packages/cli/package.json` without a second packing path [E `scripts/lib/pack-packages.mjs:25-43`; `versioning.md:22-24`]. Add a row to the release-set table in `docs/distribution/versioning.md:14-20`.
2. **Versioning:** `@egdev/cli` gets an independent version and a manual bump with a `CHANGELOG.md` section [E `versioning.md:26-46`]. A change to the CLI's file effects or flags is a minor bump under 0.x [E `versioning.md:50-56`]. The CLI does not pin DS package versions; it reads them from the release [I].
3. **`release.json`** (Q1): `runReleasePack` writes it after `finishReleasePack` succeeds. The assertion that the folder holds exactly the tarballs [E `scripts/package-release.test.mjs:81`] changes to "the tarballs plus `release.json`", and a new test checks the hashes and the commit [I].
4. **Changelogs in tarballs** (Q3): add `CHANGELOG.md` to `files` in every package, then assert it inside the packed tarballs in `scripts/package-release.test.mjs` [I].
5. **Root scripts** [I], following the root habit [E `package.json:20-30`]:
   - `"test:cli": "node --test packages/cli/tests/*.test.mjs"`, which is fast and uses synthetic fixtures;
   - `"test:cli:consumer": "node --test scripts/cli-consumer.test.mjs"`, the end-to-end run with real tarballs and installs. It packs the built workspace into a temporary folder (never `release/`), so `pnpm build` must run first. It needs the network: locally it is skipped with a message when `registry.npmjs.org` does not resolve, or when `EGDEV_SKIP_CLI_CONSUMER=1`; with `CI` set, an unreachable registry fails instead of skipping. Its second release for `upgrade` is the same tarballs relabelled with another commit in `release.json`.
6. **CI** [I, Q12]: add a `Test CLI` step running `pnpm test:cli` after `Unit tests` [E `.github/workflows/build-and-test.yml:53-54`]. `test:cli:consumer` needs the network, like `test:package-consumption`, which already runs in CI [E `build-and-test.yml:59-60`; `scripts/package-consumption.test.mjs:11-12`]. `test:package-release` does not run in CI today [E absent from `build-and-test.yml`]. Implemented in T8: `Test CLI` after `Unit tests`, and `Test egdev-ds end to end (npm + Vite, pnpm + Next.js)` after the package-consumption step; the job timeout grows from 20 to 30 minutes for the real installs and builds.
7. **Lint:** `packages/cli` is covered by `biome check .` [E `package.json:16`].
8. **Output folder:** `release:pack --out-dir <dir>` packs into another folder (default `release/`). `test:package-release` uses a temporary one, so tests never replace the operator's release. The folder is emptied on every run only when it holds nothing but tarballs, `release.json` and staging leftovers; anything else is refused with exit 1.

## 11. Documentation changes

[I]

- **`docs/distribution/install.md`** becomes the CLI guide first:
  1. a quick start with `egdev-ds init`, `upgrade` and `doctor`;
  2. then the existing manual block, kept as the **manual fallback**.
  - The test requires **exactly one** `sh` fence in that file and runs it verbatim [E `scripts/package-release.test.mjs:295-298`]. So the CLI examples use `text` fences, and the fallback stays the one `sh` block.
  - The fallback's stable file names (`vendor/egdev-ui.tgz`) [E `install.md:44-46`] differ from the CLI's `<version>-<commit>` names. Aligning them is Q10.
- **`docs/distribution/versioning.md`:** release-set row for `@egdev/cli`, and the `release.json` description.
- **`packages/cli/README.md`:** command reference, exit codes, JSON schema and doctor codes, in English (AGENTS.md: all new documentation is in English).
- **This document** becomes the approved spec once T2 closes.

## 12. Skill migration plan

S3: "the CLI owns mechanics (vendor, upgrade, checks); the global skill `egdev-design-system` keeps judgment; `ds-vendor.mjs` retired after parity".

1. **Parity first.** Each behavior of `ds-vendor.mjs` and its tests either has a CLI test, or is listed as a deliberate break:

   | `ds-vendor.mjs` behavior (test) | CLI |
   | --- | --- |
   | Deterministic help and misuse, no state change (`ds-vendor.test.mjs:97`) | Same (AC2) |
   | Same commit → verify integrities only, also in dry run (`:108`, `pnpm.test.mjs:157`) | Same (AC9) |
   | Dry run detects packages, no fetch, writes or install (`:121`, `pnpm.test.mjs:123`) | Same (AC3) |
   | Rewrites specifiers, overrides, nested lock entries with fresh sha512 (`:141`, `:216`) | Same (AC10) |
   | Package declared only in a nested override is detected (`:177`) | Same (AC8) |
   | Renames legacy names to `<version>-<commit>`, keeps `vendor/egdev/` (`pnpm.test.mjs:134`) | Same (AC11) |
   | Rollback on install failure and on integrity mismatch (`:246`, `pnpm.test.mjs:166,173`) | Same (AC12) |
   | Old-archive cleanup failure leaves the new install intact (`:254`) | Same (AC13) |
   | Unselected vendored integrities checked before touching `node_modules` (`:275`) | Same, covered by verifying the whole set (AC10) |
   | Explicit `--packages` partial upgrade (`:169`) | **Break:** the set is replaced as one unit [E S4] |
   | Unmerged-commit refusal, fetch, temporary worktree (`:133`, `:207`, `:226`, `:267`) | **Break:** no git; `release.json` `dirty` and `--allow-dirty` instead (Q1, Q2) |
   | `--allow-unmerged` temporary `node_modules` extraction (`:198`, `:235`, `pnpm.test.mjs:180`) | **Break:** dropped (Q11) |
   | Both lockfiles → npm silently (`ds-vendor.mjs:392`) | **Break:** exit 2 |
   | Always `--offline` install (`ds-vendor.mjs:246,357`) | **Break:** `--offline` is opt-in |

2. **Skill edits** go in a separate change in the global skill. Its owner approves them outside this repository:
   - The `SKILL.md:27,51` "adoptar" rows and references point at `egdev-ds`.
   - `references/adoptar.md` "Herramienta" and "Qué hace" (`:5-29`) become the CLI commands. The "Releases que empaqueta el DS" steps (`:31-38`) become `egdev-ds upgrade --from`.
   - `references/freno.md` "Instalación" (`:13-27`) becomes `egdev-ds init` plus `ds:doctor`; the allowlist workflow stays.
   - The judgment sections stay: second-pass import, traps, auditar, registro.
3. **Retirement,** once the parity rows are green and both apps have run `egdev-ds doctor` cleanly:
   - remove `assets/ds-vendor.mjs` and its two tests, and `assets/guard/`, from the skill;
   - each app drops its copies (`scripts/ds-vendor.mjs*`, `src/design-system-guard.ts` and its test) in its own PR, with that app owner's approval.

   This repository makes none of those changes.

## 13. Acceptance criteria and planned tests

[I] "Unit" means `packages/cli/tests/*.test.mjs`, with synthetic tarballs built like `scripts/package-release.test.mjs:199-225` and a fake runner for the package manager. "E2E" means `scripts/cli-consumer.test.mjs`, with the real `release:pack` output and real installs in `mkdtemp` consumers that are removed in `finally` [E pattern `scripts/package-release.test.mjs:303-345`].

| AC | Criterion | Test |
| --- | --- | --- |
| AC1 | Package exists with bin `egdev-ds`, `engines` node 24, no `dependencies`, `CHANGELOG.md` top section matching the version | Unit `package.test.mjs`; `release:pack` changelog check |
| AC2 | `--help` exits 0 with usage on stdout; an unknown, duplicate or missing-value flag exits 2 with one stderr line plus usage, empty stdout, no files changed | Unit `args.test.mjs` |
| AC3 | `--dry-run` prints the exact plan (§4) and leaves every file, including `node_modules`, byte-identical | Unit `init.test.mjs`, `upgrade.test.mjs` |
| AC4 | No `--from` and no default folder → exit 2 with the exact message (§3); a missing or tampered `release.json` → exit 1 naming the file | Unit `release.test.mjs` |
| AC5 | Detection: each rule in §5 and each ambiguity → exit 2 with its message | Unit `detect.test.mjs`, one fixture per row |
| AC6 | `init` writes exactly the §6 effects for each of npm+Vite+native, npm+Vite+tailwind, pnpm+Next+tailwind and pnpm+Vite+native (golden files) | Unit `init.test.mjs` |
| AC7 | `init` twice → second run reports `Already at`, exit 0, files byte-identical; `init` on another commit → exit 2 | Unit, E2E |
| AC8 | `upgrade` selects only declared packages (effects never added), including override-only declarations | Unit `upgrade.test.mjs` |
| AC9 | `upgrade` at the same commit verifies integrities only, exit 0, no writes | Unit |
| AC10 | `upgrade` replaces the whole set, rewrites every specifier location and the npm lock with fresh sha512, and verifies after install | Unit (npm, pnpm) |
| AC11 | Legacy unsuffixed names migrate to `<version>-<commit>`, keeping the existing vendor folder and specifier style | Unit |
| AC12 | Install failure or integrity mismatch restores `package.json`, the lockfile and `pnpm-workspace.yaml` byte for byte, removes copied tarballs, exit 1 | Unit |
| AC13 | Old-tarball removal failure → exit 1 with `new installation is intact`, new install untouched | Unit |
| AC14 | `upgrade` refuses a release with a `workspace:` specifier, a mismatched internal peer, or an unsatisfied external peer, without writes | Unit |
| AC15 | Conflicts → exit 2 listing every conflict, no writes; `--force` replaces only those keys | Unit |
| AC16 | No `git` process is ever spawned; only the detected package manager | Unit: the fake runner records every spawn and asserts the set |
| AC17 | Every doctor code fires on its fixture and stays silent on a clean one; exit 1 only on errors; `--json` emits one parseable document | Unit `doctor.test.mjs`, one case per code |
| AC18 | The guard's existing test suite passes unchanged against `src/guard.mjs` | Unit `guard.test.mjs`, moved from the skill |
| AC19 | Real consumers: npm+Vite (native) and pnpm+Next.js (tailwind) run `init` → install → build → `ds:doctor` exit 0 → `upgrade` against a second pack → `ds:doctor` exit 0 | E2E |
| AC20 | `release:pack` includes `egdev-cli-<version>.tgz` and a `release.json` whose sha256 values and commit match | `scripts/package-release.test.mjs` |
| AC21 | `install.md` keeps exactly one `sh` block, and it still passes verbatim | Existing test `scripts/package-release.test.mjs:295` |
| AC22 | S2: `localRepo` defaults to the nearest `.git` ancestor folder (directory or file), falls back to the package name, `--local-repo` overrides it (invalid → exit 2), an existing `egdev-ds.json` is kept with a note, the plan shows `localRepo=<value>`, and doctor's default agrees | Unit `local-repo.test.mjs` |
| AC23 | S3: `status` text and JSON for npm+Vite and pnpm+Next.js, `--from` upgrade-available, exit 2 for `none`/unsafe/`foreign`/`mixed`, tree unchanged and nothing spawned; DS051 match, mismatch warning and skips | Unit `status.test.mjs`, `doctor.test.mjs` |

## 14. Owner decisions

Resolved on 2026-11-18: the owner accepted every recommended option, marked in bold as (a) below. Read each row as decided; the alternatives are kept for history.

| Q | Question | Options (recommended first) |
| --- | --- | --- |
| Q1 | Release provenance | **(a) `release:pack` writes `release.json` with commit, dirty flag and sha256** · (b) the user passes `--commit` and the hashes by hand |
| Q2 | Lost "commit is on `origin/main`" check (the CLI runs no git) | **(a) Accept; refuse `dirty` releases unless `--allow-dirty`** · (b) `release:pack` also records `onMain` by running git at pack time |
| Q3 | Changelog diff source (the tarballs have no `CHANGELOG.md` today) | **(a) Add `CHANGELOG.md` to every package's `files`** · (b) embed the changelog sections in `release.json` · (c) versions only, no diff |
| Q4 | Guard needs `typescript` and `postcss`, but the CLI has no dependencies | **(a) Resolve both from `<project>`; DS044 if absent** (both apps have them: `nexo/apps/hub/node_modules/{typescript,postcss}`, `egdev-website/package.json:48,50`) · (b) write a standard-library scanner, which risks the AST-trivia regression (`freno.md:33`) |
| Q5 | Allowlist format | **(a) Keep `src/design-system-allowlist.ts`, loaded with Node 24 type stripping** · (b) move to `design-system-allowlist.json` |
| Q6 | Where doctor options live | **(a) `egdev-ds.json` at `<project>`** · (b) an `egdev-ds` key in `package.json` |
| Q7 | Vendor `@egdev/cli` into the consumer as a devDependency, so `ds:doctor` runs without the DS checkout | **(a) Yes, part of the vendored set** · (b) no; doctor always runs from the DS checkout |
| Q8 | `--force` scope | **(a) Only the conflicting values in keys the CLI owns** · (b) no `--force`; conflicts are always resolved by hand |
| Q9 | Accent host scaffold | **(a) Opt-in `--accent` writes `src/theme/accent-host.ts`** · (b) leave it out of v1 |
| Q10 | `install.md` manual fallback file names | **(a) Align them to `<version>-<commit>` once `release.json` exists** · (b) keep the stable names |
| Q11 | `--allow-unmerged` temporary `node_modules` test install | **(a) Drop it** · (b) port it as `egdev-ds try --from <candidate>` |
| Q12 | E2E consumer test in CI (network, several minutes) | **(a) Yes, npm+Vite and pnpm+Next.js only** · (b) local only, like `test:package-release` |
| Q13 | `init` default packages | **(a) `tokens,ui,system,mcp` (+`cli`); effects opt-in** · (b) all five |
| Q14 | Refusing to run on uncommitted consumer changes (S5 "refuse dirty-state conflicts?") | **(a) No check (no git); rely on `--dry-run`, rollback and conflict refusal** · (b) read `git status` (contradicts "never run git") |
