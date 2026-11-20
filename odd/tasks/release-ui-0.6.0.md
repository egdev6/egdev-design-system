# Release — ui 0.6.0, system 0.7.0, mcp 0.4.6, effects 0.2.6

Local-tarball release delivering the AttachmentField reset fix (#508) and the PhotoFrame `contain` fit (#509), PR #514 (main 0e57b7c). Branch `chore/release-ui-0.6.0`; previous release main fc89d8a (PR #506).

## Specs

- S1 — Owner-confirmed versions: `@egdev/ui` 0.5.1 → 0.6.0, `@egdev/system` 0.6.1 → 0.7.0, `@egdev/mcp` 0.4.5 → 0.4.6, `@egdev/effects` 0.2.5 → 0.2.6; `@egdev/tokens` 0.6.1 and `@egdev/cli` 0.1.1 unchanged.
- S2 — Changelogs (English, `## X.Y.Z`, no date). ui: PhotoFrame `fit: 'cover' | 'contain'` (default `cover`, unchanged output; `contain` shows the whole image inside the reserved frame; `PhotoFrameFit` exported); fixed: AttachmentField clears rejection messages when the parent changes the controlled `value` externally (reset or replacement), silently and without moving focus; an echo of the field's own request, or a filter back to the previous list, keeps them. system: artifact adds the PhotoFrame `fit` prop and the `image-fit` convention. mcp: no code changes, follows system 0.7.0. effects: no code changes, peer ranges follow ui 0.6.0.
- S3 — Coupled updates: mcp `workspace:` pin to system 0.7.0; `pnpm install --lockfile-only --offline`; genuine version pins only; regenerate the system artifact and `system.md`.
- S4 — Every CI Verify step locally before the PR.

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S4 | Bumps, changelogs, coupled updates, checks | worker + inline | see L2 |
| T2 | S4 | Release PR, CI, owner merge, release:pack, notify Recado | inline | pending |

## Log

- L1 — Owner merged #514; versions "ui 0.6.0, system 0.7.0, mcp 0.4.6, effects 0.2.6".
- L2 — Worker made the scoped edits (four bumps, changelogs, mcp pin, lockfile 1 line); it paused before builds and the package-release fixture commits (outside its authority), so the parent ran build, artifact regeneration and every CI Verify step locally (typecheck, props, artifact, cli, tokens, exports, consumption, package-release), all green, no drift.
