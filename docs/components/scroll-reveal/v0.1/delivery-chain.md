# ScrollReveal — feature/tracker branch chain

Owner selection, verbatim: **"Feature/tracker branch chain"** (`chain_strategy=feature-branch-chain`). Verified repository default branch: `main` (`egdev6/egdev-design-system`). This selection changes delivery shape, not review consent or implementation scope.

```text
main
 └── feat/scroll-reveal-tracker  [draft/no-merge tracker; original reference captures]
      └── docs/scroll-reveal-contract  [approved specification, plan and approvals]
           └── feat/scroll-reveal-core  [component behavior with its tests]
                └── feat/scroll-reveal  [package/token/naming integration and observed evidence]
```

| Unit | Base | Scope | Review budget |
|---|---|---|---|
| Tracker seed | main | Read-only source references and capture metadata, commit 7bf7567 | 124 text lines plus original PNGs |
| Contract child | tracker | Approved spec/plan and recoverable approvals, commit 1555812 | 372 lines |
| Core child | contract child | Six meaningful component files, no stylesheet; implementation and public behavior tests kept together | 1517 lines, including 1006 test lines |
| Integration child | core child | Scoped token/export/source scan/naming receipts, packed/metadata tests, catalog and verification evidence | Record final Git count when committed |

One honest slicing pass keeps these cohesive units. The core slice remains over the advisory 400-line budget because separating tests from their behavior or trimming coverage would harm reviewability. No generic size-exception label is requested. Generated evidence is retained with provenance rather than disguised as handwritten code.

Every child PR targets its immediate parent, carries the repository PR template plus its own chain diagram/dependency/scope/verification section, and is checked against that base. The tracker remains draft/no-merge until the child chain has been reviewed and integrated. Publishing and native review consent retain their independent authority boundaries. HomeTemplate implementation is excluded.


## Initial publication — historical state before integration

- Canonical issue: [#330](https://github.com/egdev6/egdev-design-system/issues/330), owner-approved and assigned to `egdev6`.
- Tracker: [#332](https://github.com/egdev6/egdev-design-system/pull/332), **draft/no-merge**, targeting `main`.
- Contract: [#333](https://github.com/egdev6/egdev-design-system/pull/333), targeting the tracker.
- Core and tests: [#334](https://github.com/egdev6/egdev-design-system/pull/334), targeting the contract branch.
- Integration/evidence: [#335](https://github.com/egdev6/egdev-design-system/pull/335), targeting the core branch.

All initial remote HEADs, PR bodies/base branches, single type labels, draft status and `egdev6` assignments were read back and verified. The post-maintenance push passed the real 2594-test hook. At that publication point no ScrollReveal PR had been merged; issue #330 stays open.

Separate prerequisite maintenance [#331](https://github.com/egdev6/egdev-design-system/pull/331) is merged at `eb1bf539335f730a97a2d37f21c9ff1614b3b6e6`: only three extraction-test timeouts became 20 seconds. Assertions, the hook and global timeout remain unchanged. Normal merges propagated it through the chain; the verified feature source otherwise stayed byte-identical. Rebuild and 65 focused checks passed after propagation; fresh core and integration assessments report medium and reviewDue false.

Publication alone was not approval to merge and did not put the feature on `main`; the later explicit decision is recorded below.


## Child integration and final merge authorization

Owner choice, verbatim: **"Integrar hijos y mergear #332 a main"**. PRs #333, #334 and #335 are now merged into the tracker (respectively `ca601c35`, `f29ce314`, `02cd372c`). Every squash used current head/base/main guards; the resulting target tree matched the reviewed child head. Successors were normally merged with the updated tracker and retargeted after their parent integrated, keeping each review diff scoped. No force/rebase or hook bypass occurred.

The task-trace conflict preserved the complete incoming line multiset/order (except the explicitly superseded FI1 status) and all unique L1–L60 entries. The full resolved tree matched the verified published leaf `0497c0e` exactly. All feature source remains unchanged by this trace-only closure update.

The final tracker merge to `main` is authorized and remains subject to final head/base/tree guards. The tracker is kept draft until those guards pass. Its issue link is `Refs #330`, not an automatic closing directive: issue closure was not authorized. HomeTemplate remains a separate next specification, not part of this feature.

This section is the pre-merge authorization/guard record; the durable [#332 merge state](https://github.com/egdev6/egdev-design-system/pull/332) is authoritative for final integration, rather than a prediction of the future merge commit.


## Verification runner prerequisite

The final trace push encountered a separate Timeline extraction timeout. The owner selected **"Limitar pnpm test a 2 workers (Recomendado)"** rather than widening another timeout. Independently verified [#336](https://github.com/egdev6/egdev-design-system/pull/336) merged at `bb2d201461f6c47b4a5037b8497d7bca1f27368b`: root `pnpm test` now defaults to `vitest run --maxWorkers=2`. All existing assertions/timeouts, the hook file, watch/coverage and dependencies are unchanged. Public baseline2534, build/lint/types, independent V1–V4 verification and a parent spot check passed. Normal merge into the tracker changed only the four approved maintenance files, not ScrollReveal source. This is not a retry-budget reset or permission to bypass the final gate.
