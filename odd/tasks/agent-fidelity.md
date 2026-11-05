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
| T3 | Organisms-first guidance, resolution order and atom proposals; closes with a repeated #348 walkthrough without owner comments | S1–S3 | gentle-ai-worker (plan + implement) + parent-run walkthrough | done — walkthrough passes R5 without owner comments; follow-ups #370, #371 | PR #369 + walkthrough PR | #350 |

Order: T1 and T2 in parallel; T3 last.

Excluded (backlog, no milestone): #351, #352, #353, #354, #355.

## Log

- **L1 — Original request (verbatim):** "dale" — accepting the recommendation to start the next milestone with G1 (#350), G7 (#356) and G8 (#357).
- **L2 — Approval and publication (verbatim):** "aprueba". Drift check: no milestone named "Agent design fidelity", only #349 as open roadmap index. Published: milestone 10; #356, #357, #350 milestoned (read back); scope revision comment on #350 (dependencies and repeated-walkthrough acceptance); index #366 (`odd`, `documentation`); #349 commented and closed as completed. No assignment, label change or implementation.
- **L3 — Standing instruction (verbatim):** "no me preguntes tanto. tira millas" — plans drafted and implemented by workers adopting their recommended options; parent commits, PRs and merges (rebase + admin bypass, as #338).
- **L4 — Delivery:** #356 → PR #367; #357 → PR #368 (rebased onto #367, nine both-added conflicts resolved keeping both, outputs regenerated, JSON 902 KB); #350 guidance → PR #369 (JSON 927 KB). Also on main: af43fb5 marks the `egdev-system-md` bin executable (pnpm kept flipping the mode).
- **L5 — #350 repeated walkthrough:** run in this workspace with `design/system.md` = generated golden (deviation from the pilot consumer, recorded in the plan); `list` line captured; independent subagent, original brief, no owner comments; WebTemplate, 2× WebSection, TopBar, SectionHeader, Footer, NowStrip, NowCard mapped; no proposals. Follow-ups filed: #370 (typography roles), #371 (template/section layout anatomy).
