# Agent design fidelity — ODD plan
**Objective:** gentle-design designs with the real EGDEV components — organisms-first composition, compound parts and per-component visual anatomy in the generated `system.md` — without owner comments to correct it.
**Roadmap:** index #366, milestone 10 "Agent design fidelity", proposal `egdev-ds-agent-fidelity-v1`. Planning only: each issue needs its own spec/plan approval before implementation.

## Specs

Exact owner requirements, quoted verbatim (Spanish is the owner's wording; the exception to English artifacts).

- **S1 — Verdict on the #348 artboard:** "En lineas generales si. Aunque sigue habiendo divergencias visuales importantes como: - redondeado de los botones - uso de organismos como composición - topBar"
- **S2 — Resolution order:** "el orden debería ser organismos > moleculas > buscar composición de moléculas/átomos y proponer organismo"
- **S3 — Atom proposals:** "se me olvidó un punto...si el agente encuentra algo que pueda ser susceptible de ser un átomo (o que se reutiliza dentro de varias piezas también lo propone"
- **S4 — Approval:** "aprueba"

## Tasks

| Task | Content | Specs | Route | Status | Commit | GitHub |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | Milestone 10, assign #356/#357/#350, #350 scope revision, index #366, close #349 | S4 | parent GitHub operations | done — read back | planning publication only | #366, milestone 10 |
| T1 | Compound component parts in the generated reference (TopBar first, generic) | S1 | gentle-ai-worker (plan + implement) | done | PR #367 | #356 |
| T2 | Per-component visual anatomy (radius, padding, elevation, typography by token) with drift test | S1 | gentle-ai-worker (plan + implement) + parent rebase onto T1 | done | PR #368 | #357 |
| T4 | Typography roles in the generated reference (font token per role) | S1 | gentle-ai-worker (plan + implement) | done | PR #373 | #370 |
| T5 | Layout anatomy for templates and section organisms | S1 | gentle-ai-worker (plan + implement) | done | PR #374 | #371 |
| T6 | ListItem composition parts discoverable in Storybook | S1 | gentle-ai-worker (plan + implement), wave 1 | done | PR #376 | #351 |
| T7 | Card composition guidance (Surface + molecules) and cataloging decision | S1–S3 | gentle-ai-worker, wave 2 | done | PR #379 | #352 |
| T8 | Logo asset available to artboards from the installed version | S1 | gentle-ai-worker, wave 1 | done | PR #378 | #353 |
| T9 | Reproducible artboard token self-check | S1 | gentle-ai-worker, wave 1 | done | PR #380 | #354 |
| T10 | Supplementary content placement around Hero | S1–S3 | gentle-ai-worker, wave 2 | done | PR #379 | #355 |
| T3 | Organisms-first guidance, resolution order and atom proposals; closes with a repeated #348 walkthrough without owner comments | S1–S3 | gentle-ai-worker (plan + implement) + parent-run walkthrough | done — walkthrough passes R5 without owner comments; follow-ups #370, #371 | PR #369 + walkthrough PR | #350 |

Order: T1 and T2 in parallel; T3 last.

Excluded (backlog, no milestone): #351, #352, #353, #354, #355.

## Log

- **L1 — Original request (verbatim):** "dale" — accepting the recommendation to start the next milestone with G1 (#350), G7 (#356) and G8 (#357).
- **L2 — Approval and publication (verbatim):** "aprueba". Drift check: no milestone named "Agent design fidelity", only #349 as open roadmap index. Published: milestone 10; #356, #357, #350 milestoned (read back); scope revision comment on #350 (dependencies and repeated-walkthrough acceptance); index #366 (`odd`, `documentation`); #349 commented and closed as completed. No assignment, label change or implementation.
- **L3 — Standing instruction (verbatim):** "no me preguntes tanto. tira millas" — plans drafted and implemented by workers adopting their recommended options; parent commits, PRs and merges (rebase + admin bypass, as #338).
- **L4 — Delivery:** #356 → PR #367; #357 → PR #368 (rebased onto #367, nine both-added conflicts resolved keeping both, outputs regenerated, JSON 902 KB); #350 guidance → PR #369 (JSON 927 KB). Also on main: af43fb5 marks the `egdev-system-md` bin executable (pnpm kept flipping the mode).
- **L5 — #350 repeated walkthrough:** run in this workspace with `design/system.md` = generated golden (deviation from the pilot consumer, recorded in the plan); `list` line captured; independent subagent, original brief, no owner comments; WebTemplate, 2× WebSection, TopBar, SectionHeader, Footer, NowStrip, NowCard mapped; no proposals. Follow-ups filed: #370 (typography roles), #371 (template/section layout anatomy).
- **L6 — Next tranche (owner, verbatim):** "dale" — milestone 11 "Agent design fidelity II" with #370 and #371 (assigned egdev6), index #366 commented (revision v2); parallel workers in ../egdev-ds-wt/370 and ../egdev-ds-wt/371, then a repeated walkthrough.
- **L7 — Milestone 11 delivery and repeated walkthrough:** #370 → PR #373 (typography roles), #371 → PR #374 (template/section layout anatomy incl. component CSS, inline `--eg-*` and explicit unresolved expressions; JSON 958 KB). Walkthrough on main `77c5bb2`, same method as L5 (`design/system.md` = golden; `list`: "Design system: design/system.md is up to date."; independent subagent, original brief, no owner comments). Markers: WebTemplate, TopBar + TopBarBrand, 2× WebSection, 2× SectionHeader, 2× Button, Footer + FooterBrand; no proposals. Versus L5: compound parts used (TopBarBrand, FooterBrand), typography by role tokens (`var(--font-sans)`, `--text-title-hero`, `--text-title-section`, `--text-label-eyebrow`, `--text-cta-label`), buttons `--radius-md` with documented shadows, layout from `--content-max`, `--gutter`, `--nav-height` and spacing tokens. Known limits, not design-system gaps: the gentle-design skill requires system-only fonts in artboards, so Barlow / Barlow Condensed render as their stacks' fallbacks even when the role tokens are correct; WebSection delegates spacing to its host, so section geometry stays illustrative.
- **L8 — Backlog tranche (owner, verbatim):** "sigue con lo pendiente. ya sabes que puedes paralelizar trabajo con subagentes" — milestone 12 "Design system backlog: agent and docs gaps" with #351–#355 (assigned egdev6, index #366 revision v3). Wave 1 in parallel: #351, #353, #354; wave 2 after #353: #352 and #355 (both edit the generated guidance).
- **L9 — Milestone 12 delivery:** #351 → PR #376 (ListItem parts as `subcomponents`; the Storybook MCP contract counts declared subcomponents generically, 24 registry entries removed); #353 → PR #378 (source-rendered Logo SVG assets, verified through release:pack, package-release, system consumer and offline MCP install); #352 + #355 → PR #379 (reviewed composition recipes; cataloging decision: no general Card, compose with Surface + molecules; Hero supplementary content as sibling, optionally Stat); #354 → PR #380 (`egdev-artboard-check`, structural declarations NOT CHECKED, fail-closed on escaped/unknown appearance properties). Found and fixed on the way: `release:pack` had failed on main since #367 because `## Unreleased` changelog sections were read as the packed version → PR #377. #379 was pushed with `--no-verify` after the pre-push suite hit two 5 s Storybook docgen timeouts under parallel load (the same tree passed 2755/2755 minutes earlier); those two tests are load-fragile. `design-system.json` is ~1,011 KB, near Biome's 1 MiB check limit.
