# egdev-ds: localRepo default (#485) and `status` (#486)

Two follow-ups from the Nexo and egdev-website adoption of `egdev-ds`. Branch `feat/egdev-ds-localrepo-status`, one PR for both (owner choice), then a patch release and notices to Nexo and the website.

## Specs

- S1: Owner request, verbatim: "vamos con 485 y 486".
- S2 (#485), owner choice verbatim: "Repo folder + flag + shown in plan (Recommended)" ("Default = name of the nearest ancestor folder containing .git (no git command run); --local-repo <name> overrides it; the plan always prints `create egdev-ds.json localRepo=<value>`. Existing files keep their value."). Issue evidence: Nexo's `apps/hub` package `nexo-hub` produced `localRepo: "nexo-hub"`; issues live in repo `nexo` (`packages/cli/src/doctor.mjs:97`).
- S3 (#486), owner choice verbatim: "New read-only `egdev-ds status --json` (Recommended)" ("Prints vendored commit, package versions and files, derived from the vendored file names egdev-ds already parses. No new state file; app scripts (system.md sync, MCP check) read it. doctor gains a check that flags a stale design/system.md header.").
- S4: Delivery, owner choice verbatim: "One PR for both" ("Single PR and release.").
- S5: Approved spec `docs/distribution/egdev-ds-cli.md` is amended for both (CLI surface §4, `init`/`upgrade --add` effects, `doctor` checks §8), citing this document; README and CHANGELOG updated. Same rules as the rest of the CLI: Node stdlib only, never run git, read-only commands write nothing, stable exit codes and `--json`, no `\s*X\s*` regexes on untrusted strings.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1–S5 | worker | this commit |
| T2 | S4 | parent | checks, PR, CI, merge, release, notices |

## Log

- L1 (owner, verbatim): S1.
- L2 (owner choices): S2, S3, S4.
- L3: T1 done by worker. #485: localRepo = nearest ancestor folder with a .git entry (existsSync only), --local-repo on init/upgrade, plan shows localRepo=; existing files kept. #486: `egdev-ds status [--json] [--from]`, read-only; doctor DS051 warns when design/system.md first-line header `<!-- Generated from EGDEV design system <commit>` differs from the vendored commit (format written by the apps scripts, not egdev-system-md: packages/system/src/render-system-md.mjs:87-97). cli bumped to 0.1.1 (parent answer A: the changelog top must match the manifest). RED 10 fail → GREEN test:cli 112/112; typecheck, biome, package-release 24, consumption 14, system 36, artifact 31, props:check. Real status runs on Nexo and website: ba7a38e, read-only.
