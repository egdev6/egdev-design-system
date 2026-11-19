# Shared app theme — delivery (milestone #16)

Implement the approved specs merged in PR #455 (f3a2116) for milestone #16 "Shared app theme: tokens" (roadmap #427, umbrella #404). One PR per issue, merged one at a time with `gh pr merge <n> --rebase --admin` on green CI; generated files (catalog, prop-naming, packages/system) are regenerated after rebasing on main.

## Specs

- S1: Owner request (verbatim): "vamos con los tokesn pues". Owner decisions (verbatim, L2 of the spec batch, recorded in each approved spec's Approval section): tokens "Sí, confirmo los alias"; Link "Mantener el neon actual"; segmented tab "Agregar borde/tinte rojo como Nexo"; runtime accent "Sí, helper + variables por scope"; swatch paint "Sí, aprobar la excepción acotada"; Panel "Sí, accentEdge=\"start\""; delivery "Sí, igual que el 1 y 2".
- S2: Each implementation follows its approved spec exactly: #425 `docs/foundation/semantic-contrast-roles.md`; #426 `docs/foundation/semantic-roles-adoption.md`; #415 `docs/foundation/runtime-accent.md`; #418 `docs/components/panel/v0.4/accent-edge-amendment.md`; #416 `docs/components/color-swatch-group/v0.1/spec.md`.
- S3: Token edits only in `packages/tokens/src/theme.css` and only the owner-confirmed aliases; any new value or name not in the approved table stops and goes back to the owner. No new dependencies.
- S4: Test-first (RED before GREEN); full checks before each PR: `pnpm test`, `typecheck`, `build`, `test:package-exports`, `test:package-consumption`, `props:check`, `test:props`, `system:check`, Biome; component visuals verified in real browsers (Chrome, Edge, Firefox) with captures saved via `install -m 644`.
- S5: Dependencies: #426 and #415 after #425; #418 after #415; #416 independent.

## Tasks

| ID | Specs | Issue | Route | Commit / PR |
| --- | --- | --- | --- | --- |
| T1 | S1–S5 | #425 semantic roles tokens | worker, `../eds-wt-k` `feat/semantic-contrast-roles` | done: PR #456 (3e20e61) |
| T2 | S1–S5 | #416 ColorSwatchGroup | worker, `../eds-wt-l` `feat/color-swatch-group` | done: PR #457 (2c9d603) |
| T3 | S1–S5 | #426 role adoption | worker, `../eds-wt-m` `feat/semantic-roles-adoption` | done: PR #459 (85484d5) |
| T4 | S1–S5 | #415 runtime accent | worker, `../eds-wt-n` `feat/runtime-accent` | done: PR #460 (b1c4ebb) |
| T5 | S1–S5 | #418 Panel accent edge | worker, `../eds-wt-o` | done: PR #461 (a636c40) |

## Log

- L1 (owner, verbatim): "vamos con los tokesn pues". Specs approved and merged in PR #455 (f3a2116).
- L2: Spec contrast rounding corrected 5.77 -> 5.76 (black on #FF2D57 = 5.765) in PR #456; no token value changed.
- L3: gentle-ai-worker refuses builds, vitest (.env auto-load concern) and commits; the parent runs RED/GREEN, builds, packed checks and commits.
- L4: Owner approved the segmented Tabs capture (red border + tint at 45%) before #459 merged.
- L5: Milestone #16 closed 2026-11-17 (6/6); #425 and umbrella #404 closed with delivery comments.
