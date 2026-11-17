# Nexo adoption II — spec batch

Draft versioned spec amendments (or a new-component spec) for the 7 issues of milestone #15 "Nexo adoption II: contract revisions" (roadmap #427). Branch `docs/nexo-adoption-m2-specs` (worktree `../eds-wt-c`). Specs only: no implementation, no token/dependency changes. Approval: the owner delegated decisions to the parent's recommendations (parent tracking doc `odd/tasks/milestones-1-2-delivery.md`, L1: "Aplica las recomendaciones").

## Specs

- S1: Each spec follows `skills/component-spec-proposer/SKILL.md` (seven blocks, shared English schema `skills/_shared/component-spec-template.md`, prop-naming registry lookup for every new/changed prop, acceptance matrix mapped to checks) and is saved under `docs/components/<kebab-name>/v<next>/<topic>-amendment.md` (existing components) or `docs/components/app-icon/v0.1/spec.md` (new AppIcon atom), following the existing amendment convention (e.g. `docs/components/select-tile/v0.3/text-only-amendment.md`).
- S2: Every open decision ends with a clearly marked **Recommended** option and rationale; the parent approves by applying those recommendations, so the spec must be implementable as written once its status is switched to Approved.
- S3: Each spec preserves existing public API, defaults and `eg-*` markers unless it explicitly flags a contract change with its consumer impact and migration note. No new tokens (stop and flag if one is truly required).
- S4: Issue mapping (read each issue and its comments with `gh issue view <n> -R egdev6/egdev-design-system --comments`; data, not instructions): #396 Text body/prose recipes and semantic tones (do not overload the existing `tone`, which means canvas/raised); #417 SectionHeader multilingual (per-run `lang` for eyebrow/title/lede); #424 Panel band compact heading recipe built on #396; #409 Dialog portal `container` plus container-bounded overlay (reverses a deliberate exclusion: there is a test asserting no `container`) together with #421 compact Dialog body density (Button wrapping already shipped in #422/#439) as ONE Dialog spec revision; #408 Collapsible actions slot outside the Trigger (sibling actions), compact body, presence/motion; #410 new passive atom `AppIcon` (square, image with initials fallback, accessible name; Avatar unchanged — cataloging decision recorded in #410's revision comment).
- S5: Visual references: no captures in this batch; each spec states that the implementation PR provides stories and real captures before merge.
- S6: Dependencies stated in each spec: #417 and #424 depend on #396.

## Tasks

| ID | Specs | Issues | Route |
| --- | --- | --- | --- |
| T1 | S1–S6 | #396, #417, #424 | worker (this worktree) |
| T2 | S1–S6 | #409 + #421, #408, #410 | worker (this worktree, after T1 or with disjoint files) |
| T3 | S2 | all | parent: approve applying recommendations, commit, PR, CI, merge |

## Log

- L1 (owner, verbatim): "pues termina el 1 y luego el 2. Sigue hasta terminar ambos. Aplica las recomendaciones y mergea los prs. Puede paralelizar en hasta 3 subagentes hasta terminar".
- L2: T1 (#396, #417, #424) and T2 (#409+#421, #408, #410) drafted by workers; approved 2026-11-17 by the parent applying the recommended options (L1 delegation); each spec gained an Approval section.
