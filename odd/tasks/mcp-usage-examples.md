# MCP usage examples (#419)

Implement the approved docs plan `odd/specs/mcp-usage-examples.md` (Approved 2026-11-16) for GitHub issue #419 (premise corrected: `get_component` is listed in `packages/mcp/README.md`; missing are concrete request/response usage examples). Branch `docs/mcp-usage-examples` (worktree `../eds-wt-b`), one PR, Closes #419. Roadmap #427, milestone #14. Delivery rules: parent tracking doc `odd/tasks/milestones-1-2-delivery.md` in the main worktree (owner: apply the parent's recommendations; merge green PRs).

## Specs

- S1: Add request/response usage examples for every existing MCP tool in `packages/mcp` (the plan says all five), placed where the plan recommends (README section or a dedicated docs file linked from the README), in English.
- S2: Examples must match the current tool schemas and real responses: add a test (Node test runner or Vitest, following the package's existing test setup) that extracts each documented example call, runs it against the real tool handlers/SDK as the plan describes, and asserts the documented response shape stays in sync (drift check). Observe it fail first against a deliberately absent/mismatched example (RED), then pass (GREEN).
- S3: Out of scope: new MCP tools, JSX guidance beyond what the plan marks in scope, version bumps or releases.
- S4: Update `packages/mcp/README.md` (and the package's docs index if any) to link the examples. If the system artifact or catalog reference MCP docs and `pnpm system:check` reports stale output, regenerate with the documented commands.
- S5: Checks: the package's own test command, `pnpm typecheck`, Biome on changed files. No dependencies, no tokens.

## Tasks

| ID | Specs | Route |
| --- | --- | --- |
| T1 | S1–S5 | gentle-ai-worker |
| T2 | all | parent: full checks, PR, CI, merge |

## Log

- L1: Plan decisions recorded in odd/specs/mcp-usage-examples.md (owner approval 2026-11-16; visuals not applicable).
- L2: Parent full checks: typecheck, build, exports, consumption, props, system, lint, test:mcp (11/11), full suite 2920/2920 green. `test:mcp:packed` fails locally in its offline install (ERR_PNPM_NO_OFFLINE_TARBALL for @modelcontextprotocol/sdk@1.32.2; adding it to the store did not help) — an environment limitation unrelated to this change, and the test is not in CI; the shared selector has its own passing regression test.
