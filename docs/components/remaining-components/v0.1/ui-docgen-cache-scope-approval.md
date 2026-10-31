# Docgen inherited-prop cache correction approval

## Owner decision

The owner explicitly selected **Authorize patch and regressions** (`approve_scoped_docgen_cache_patch`) in the parent session questionnaire after reviewing the confirmed react-docgen-typescript 2.4.0 inherited-prop cache defect.

## Authorized scope

In the Indicator, Panel and Collapsible worktrees only:

- A pnpm-managed patch for the existing `react-docgen-typescript@2.4.0`, removing unsafe cross-context inherited-prop cache reuse.
- `patches/`, `pnpm-workspace.yaml` and `pnpm-lock.yaml` changes required to apply that same-version patch reproducibly.
- Regression additions to `packages/ui/src/lib/storybook-docgen.test.ts` and `packages/ui/src/lib/storybook-controls.test.ts`.
- Parent-owned provisioning of the existing patched dependency, RED/GREEN checks, applicable suites and actual Storybook Docs verification.
- This approval record and associated evidence/tracking updates.

## Boundaries

No dependency version changes, added dependencies, token changes, correct public API changes, export reordering, hidden native rows, handwritten argTypes, parser replacement or unrelated enhancer/filter changes are authorized. No Git delivery operation is authorized. Runtime behavior, final browser/AT acceptance and later component approvals remain separate.

## Required verification

Preserve existing tests and extraction order. First reproduce incorrect inherited event targets in normal-order raw parsing and Storybook summaries. Then verify all four Trigger handlers resolve to HTMLButtonElement and mixed-native compound div handlers remain HTMLDivElement. Verify the pnpm patch is used by both direct parsing and Storybook, rerun applicable regression/integration checks, and record limitations honestly. This permission is not a native review verdict or acceptance result.
