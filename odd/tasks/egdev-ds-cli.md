# egdev-ds CLI (#477)

A command to install, upgrade and check the EGDEV design system in a consumer app. Spec first (owner approval), then a separate implementation plan, then implementation PRs. Branch for the spec: `docs/egdev-ds-cli-spec`.

## Specs

- S1: Owner request, verbatim: "sería interesante crear un comando o mcp que instale en un proyecto toda la infrastructura necesaria para integrar el design system?" then "si" (open issue #477) then "vamos con ello ya".
- S2: Issue #477 proposal: subcommands `init <project>`, `upgrade <project>`, `doctor <project>`, all idempotent with `--dry-run` (print the plan, write nothing); pnpm and npm consumers using Vite or Next.js. Non-goals: npm registry, publishing, auto-committing in the consumer, migrating app code to DS components, editing consumer themes beyond the accent host scaffold.
- S3: Owner decisions (verbatim labels): "New @egdev/cli package (Recommended)" — a sixth package in the release set, Node stdlib only, no new dependencies; bootstrap `node <ds-repo>/packages/cli/bin/egdev-ds.mjs` or run from its tarball. "--from, default sibling DS release/ (Recommended)" — explicit `--from <dir>`, default `../egdev-design-system/release` when it exists, else a clear error. "Checker inside the CLI (doctor) (Recommended)" — one maintained guard implementation; `init` adds a test/CI script that runs `egdev-ds doctor`, no copied template. "Skill calls the CLI (Recommended)" — the CLI owns mechanics (vendor, upgrade, checks); the global skill `egdev-design-system` keeps judgment; `ds-vendor.mjs` retired after parity.
- S4: The spec is a Draft for owner approval at `docs/distribution/egdev-ds-cli.md` (English), grounded in the existing pieces with path:line evidence: `docs/distribution/install.md`, `docs/distribution/versioning.md`, `scripts/release-pack.mjs` + `scripts/lib/pack-packages.mjs`, the global skill `/home/egdev/.gentle-shell/agent/skills/egdev-design-system/` (`SKILL.md`, `references/adoptar.md`, `assets/ds-vendor.mjs` and its tests), and Nexo's guard (`../nexo/apps/hub/src/design-system-guard.test.ts`, read-only). Lessons from the 2026-11-18 Nexo upgrade must be covered: replace the set as one unit, verify sha256, skip packages the app does not depend on (Nexo does not use effects), peer coherence, no `workspace:` specifiers.
- S5: The spec defines: package anatomy (bin, modules, tests), exact CLI surface (subcommands, flags, exit codes, stdout/stderr contract, `--dry-run` plan format, `--json`?), detection rules, every file `init` writes or edits per package manager/framework/CSS mode, `upgrade` algorithm, `doctor` check list with codes, idempotency and rollback/safety (never touch git, refuse dirty-state conflicts?), the release-set integration (versioning, release:pack membership, tests), documentation changes (install.md becomes the CLI guide + manual fallback), skill migration plan, acceptance criteria mapped to tests (fixture consumer projects in a temp dir), and open questions. New prop/flag names follow repo naming habits; no new dependencies.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1–S5 | worker | this commit |
| T2 | S1, S3 | parent | review, owner approval, issue comment (approval commit) |
| T3 | — | parent | implementation plan (separate approval) — proposed below |
| T4 | spec §3, §10, Q1–Q3 | worker | PR 1: `release:pack` writes `release.json` (commit, dirty, sha256 per tarball); every package ships `CHANGELOG.md`; package-release tests |
| T5 | spec §2, §4, §8, Q4–Q6 | worker | PR 2: `@egdev/cli` skeleton (bin `egdev-ds`, arg parsing, exit codes, plan/`--json` output) + `doctor` (DS0xx codes, guard ported from the skill asset with consumer-resolved typescript/postcss, `egdev-ds.json`); fixture-project tests |
| T6 | spec §5, §6, §9, Q7–Q9, Q13 | worker | PR 3: `init` (detection, vendor, package.json/overrides/CSS/.mcp.json/ds:doctor script, `--accent`, `--dry-run`, `--force`, atomic writes + rollback); fixtures npm+Vite and pnpm+Next.js |
| T7 | spec §7, §9 | worker | PR 4: `upgrade` (set-as-a-unit, sha256 against release.json, only declared packages, changelog diff, lockfile refresh command, failure handling) |
| T8 | spec §10, §11, Q10, Q12 | worker | PR 5: release-set integration (`@egdev/cli` in release:pack, versioning.md, CI e2e for npm+Vite and pnpm+Next.js) + install.md rewritten as CLI guide with manual fallback; first release including the CLI |
| T9 | spec §12, Q11 | parent | Global skill migration (outside this repo): skill calls the CLI; retire ds-vendor.mjs after the parity table passes; then adopt in Nexo/website via their sessions |

## Log

- L1 (owner, verbatim): S1.
- L2: Issue #477 opened with the proposal and four open decisions.
- L3 (owner decisions): S3.
- L4: T1 draft written by worker (docs/distribution/egdev-ds-cli.md, 546 lines, Draft — not approved; [E]/[I] tagged; 14 open questions Q1–Q14 with recommendations). Blocking findings: release/ has no commit/sha256 record (Q1 release.json); tarballs carry no CHANGELOG.md (Q3); the guard needs typescript/postcss vs stdlib-only (Q4); no git means no 'commit on main' check (Q2). Evidence: Nexo npm+Vite native CSS, website pnpm+Next Tailwind, both carry byte-identical copies of the skill guard.
- L5 (owner, verbatim): "si" — accepting all 14 recommendations (option a for Q1–Q14). Spec marked Approved — 2026-11-18. Next: T3 implementation plan (separate approval).
