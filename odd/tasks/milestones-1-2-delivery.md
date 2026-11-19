# Nexo adoption milestones 1 and 2 — delivery

Finish milestone #14 (Nexo adoption I) and milestone #15 (Nexo adoption II) of roadmap #427, applying the parent's recommended option at each decision, merging green PRs with the owner-authorized admin bypass, and running up to three subagents in parallel (separate git worktrees for parallel writers).

## Specs

- S1: Owner authorization (verbatim): "pues termina el 1 y luego el 2. Sigue hasta terminar ambos. Aplica las recomendaciones y mergea los prs. Puede paralelizar en hasta 3 subagentes hasta terminar".
- S2: Merge policy (owner choice, verbatim): "Sí, --admin con CI en verde" — `gh pr merge <n> --rebase --admin --delete-branch` only after all six checks pass (Verify, Gitleaks advisory, CodeQL actions/javascript-typescript, CodeQL, issue-lifecycle); never merge red or pending.
- S3: Each issue follows the repo flow: approved spec → plan (parent approves applying its own recommendation, per S1) → test-first implementation (RED before GREEN) → Chrome/Edge/Firefox checks with captures when there is UI → full checks (`pnpm test`, `pnpm typecheck`, `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm props:check`, `pnpm system:check`, lint of changed files) → RDD assess (native review when due) → PR → CI green → merge.
- S4: Milestone 2 items change approved contracts, so each gets a spec amendment first (component-spec-proposer), approved by the parent applying its recommendations, and recorded in the spec and in this Log. Token additions or value changes are out of scope (milestone 3) and stop for the owner.
- S5: Dependencies: #396 (Text body/tones) before #417 (SectionHeader multilingual) and #424 (Panel band heading); #409 and #421 share one Dialog spec revision; #410 is a new atom AppIcon (cataloging decision in its revision comment).
- S6: Parallel writers use disjoint worktrees/branches; at most three subagents at once.

## Tasks

| ID | Issue | Route | PR / commit |
| --- | --- | --- | --- |
| T1 | #422 Button labelWrap | merged | #439 (b046154) |
| T2 | #423 Icon download/external-link | explore plan → worker (worktree) | #441 (d9f9ab0) |
| T3 | #419 MCP usage examples | worker (worktree), docs plan already approved | #440 (8b74760) |
| T4 | M2 specs: #396, #417, #424 | worker (worktree) | #442 (9909908) |
| T5 | M2 specs: #409 + #421, #408, #410 | worker (worktree) | #442 (9909908) |
| T6 | #396 Text implementation | worker | #443 (7883735) |
| T7 | #417 SectionHeader implementation | worker (after T6) | #447 (79a4be5) |
| T8 | #424 Panel band heading implementation | worker (after T6) | #448 (0e0c1ba) |
| T9 | #409 + #421 Dialog implementation | worker | #444 (55c16e5) |
| T10 | #408 Collapsible implementation | worker | #445 (a4df889) |
| T11 | #410 AppIcon implementation | worker | #446 (1f6429f) |

## Log

- L1 (owner, verbatim): "pues termina el 1 y luego el 2. Sigue hasta terminar ambos. Aplica las recomendaciones y mergea los prs. Puede paralelizar en hasta 3 subagentes hasta terminar".
- L2 (owner, verbatim choice): "Sí, --admin con CI en verde". #439 merged with `--rebase --admin` after green CI (b046154); #422 closed.
- L3: Milestone 1 complete: #419 (#440), #423 (#441) merged with green CI; M2 specs approved by the parent applying recommendations and merged (#442). Parallel merges race on `main` ("Base branch was modified"): merge one PR at a time.
- L4: #396 Text: contrast ≥4.5:1 for every foreground on surface-0…3 and flood in three browsers (min 4.82) — no token change needed; PR #443. Dialog (#409+#421) and Collapsible (#408) implemented, browser-verified and committed locally; they share generated files (catalog, registry, system artifact) with #443, so they merge serially: rebase on main + regenerate before each push. Collapsible's packed-consumer type fixture was fixed (Trigger `children` required). `test:mcp:packed` offline-store failure recorded in #440 as an environment limitation.
- L5: #417 and #424 depend on #396 and conflict with each other; they run after #443, #417 first. AppIcon (#410) runs as a background worker in `../eds-wt-g`.
- L6: Milestone 2 complete: #396 (#443), #409+#421 (#444), #408 (#445), #410 (#446), #417 (#447), #424 (#448), all merged with green CI via `--rebase --admin`. Milestones #14 and #15 closed (0 open issues).
- L7: Lessons: (1) serialize PRs that touch generated files (catalog, prop-naming registry/view, system artifact) — rebase on main and regenerate before each push; (2) new prop-naming approval receipts must pin the previous receipt (`priorReceipts`) — run `pnpm test:props` after every rebase, not only `props:check`; (3) worktrees need `pnpm install --offline && pnpm build` before pre-push; (4) run `gh pr merge` one PR at a time.
