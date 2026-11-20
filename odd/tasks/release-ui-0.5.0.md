# Release — ui 0.5.0, system 0.6.0, mcp 0.4.4, effects 0.2.4

Joint local-tarball release delivering AttachmentField (#497, PR #501) and the Panel/Tabs v0.5 fill layout (#499, #500, PR #503). Process: `docs/distribution/versioning.md`, Engram `release/local-tarballs-process`. Branch `chore/release-ui-0.5.0` from main 28f3069; previous release main bc011aa (PR #495).

## Specs

- S1 — Owner-confirmed versions: `@egdev/ui` 0.4.0 → 0.5.0, `@egdev/system` 0.5.0 → 0.6.0, `@egdev/mcp` 0.4.3 → 0.4.4, `@egdev/effects` 0.2.3 → 0.2.4; `@egdev/tokens` 0.6.0 and `@egdev/cli` 0.1.1 unchanged.
- S2 — Changelogs (English, `## X.Y.Z`, no date, user-benefit). ui: new AttachmentField molecule (paste from a Textarea, drop/pick, type/size/count validation, removable thumbnails, announcements, controlled/uncontrolled); Panel and Tabs `fill` (definite-height host, fixed chrome, single native scroller with a stable gutter, no double gutter when nested); **behavior change:** Tabs drops a consumer-supplied `data-fill` (only the component sets it). system: artifact adds AttachmentField, the `fill` props and the `host-fill` convention plus four AttachmentField conventions. mcp: no code changes, follows system 0.6.0. effects: no code changes, peer ranges follow ui 0.5.0.
- S3 — Coupled updates: mcp `workspace:` pin to system; `pnpm install --lockfile-only --offline`; any test/doc pinning these manifest versions; regenerate the system artifact and `system.md`.
- S4 — Before the PR: every CI Verify step locally (Biome on branch files, props:check, test:props, test:artifact, build without drift, test:cli, tokens tests, test:package-exports, test:package-consumption, test:package-release).
- S5 — Thanks only for verified participants in bc011aa..28f3069.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S5 | Bumps, changelogs, coupled updates, checks | worker | see L2 |
| T2 | S4 | Release PR, CI, owner merge, release:pack from clean main, notify Recado | inline | pending |

## Log

- L1 — Owner: "todo junto"; then "Release ya, sin color-scheme (recomendado)" and versions "ui 0.5.0, system 0.6.0, mcp 0.4.4, effects 0.2.4".
- L2 — T1 done by worker: four bumps, changelogs (ui 0.5.0 notes the Tabs `data-fill` behavior change), mcp pin to system 0.6.0, lockfile 1 line, artifact versions only. All CI Verify steps pass locally (cli 115, tokens 71, exports 137, consumption 14, release 24), no build drift. Verified participants bc011aa..28f3069: only egdev6.
