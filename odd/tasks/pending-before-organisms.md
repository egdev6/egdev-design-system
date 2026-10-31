# Pending before organisms — finish non-organism work, deliver to main, review, plan corrections

Close every pending non-organism item of `@egdev/ui` / `@egdev/effects` through PRs into main, then the owner reviews visually and corrections are planned before any organism work.
RDD is re-enabled for this clone from 2026-10-31 for future candidates only; merged history and old worktrees are not retroactively gated.

## Specs

- S1 — Scope: "la idea es hacer todo lo pendiente fuera de organismos, prs, subida a main, revisión visual y luego planificamos correcciones antes de organismos". No organism work in this feature.
- S2 — Local-only files go to main: "yo creo que lo subiría no?" — `.agents/skills/odd-contribute/`, `CONTRIBUTING.md` and the `odd/tasks/*.md` tracking documents. The uncommitted `Surface.stories.tsx` tweak stays out unless the owner says it is intentional.
- S3 — RDD: "activa de nuevo TDD (sin bloquear los antiguos)" — clarified by the owner as RDD (native review). Enabled for future candidates only.
- S4 — Order (owner accepted "comienza con la propuesta"): 1) maintenance PR, 2) rebase and merge #206 FieldMessage, 3) owner approval of the pending plans (PhotoFrame, GaugeGroup, AmbientBackground, Isotipo3D), 4) implement, PR and merge them, 5) owner visual review in Storybook on main (first wave, FieldMessage, the four new components, pending #111 acceptance), 6) plan corrections, then organisms.
- S5 — Standing delivery rules: CI workflows stay disabled by owner decision ("aceptamos y mantenemos desactivado"); before every merge run the Verify steps locally (lint, props:check, test:props, typecheck, build, test, tokens test, package-exports) plus package-consumption. Merge with `--admin`; no force push.

## Tasks

| ID | Specs | Task | Route | Status | Commit / PR |
|---|---|---|---|---|---|
| T1 | S2,S5 | Maintenance PR: ODD contribute skill, CONTRIBUTING, odd/tasks | parent | in progress | |
| T2 | S4,S5 | Rebase #206 FieldMessage on main, local gates, merge | parent | pending | |
| T3 | S4 | Owner approval session for PhotoFrame, GaugeGroup, AmbientBackground, Isotipo3D plans | owner | pending | |
| T4 | S4,S5 | Implement approved components, PRs, merge | per approval | pending | |
| T5 | S4 | Owner visual review in Storybook on main | owner | pending | |
| T6 | S1,S4 | Plan corrections before organisms | parent + owner | pending | |
| T7 | S4 | Remove merged worktrees | parent | pending | |

## Log

- L1 — Owner: "yo creo que lo subiría no? la idea es hacer todo lo pendiente fuera de organismos, prs, subida a main, revisión visual y luego planificamos correcciones antes de organismos. Te cuadra?"
- L2 — Owner: "activa de nuevo TDD (sin bloquear los antiguos) y comienza con la propuesta"; choice clarified as "RDD (revisión nativa)". `gentle-ai review mode enable --scope clone` → effective on (global), clone-local unset.
- L3 — Prior state: #207 (first wave) and #208 (pending plans) merged; #206 open; CI workflows disabled_manually by owner decision; risk item 5 accepted for #207 (see remaining-components L42).
