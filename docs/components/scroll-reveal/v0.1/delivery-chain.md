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


## Published chain — awaiting review/integration

- Canonical issue: [#330](https://github.com/egdev6/egdev-design-system/issues/330), owner-approved and assigned to `egdev6`.
- Tracker: [#332](https://github.com/egdev6/egdev-design-system/pull/332), **draft/no-merge**, targeting `main`.
- Contract: [#333](https://github.com/egdev6/egdev-design-system/pull/333), targeting the tracker.
- Core and tests: [#334](https://github.com/egdev6/egdev-design-system/pull/334), targeting the contract branch.
- Integration/evidence: [#335](https://github.com/egdev6/egdev-design-system/pull/335), targeting the core branch.

All initial remote HEADs, PR bodies/base branches, single type labels, draft status and `egdev6` assignments were read back and verified. The post-maintenance push passed the real 2594-test hook. No ScrollReveal PR has been merged and issue #330 stays open.

Separate prerequisite maintenance [#331](https://github.com/egdev6/egdev-design-system/pull/331) is merged at `eb1bf539335f730a97a2d37f21c9ff1614b3b6e6`: only three extraction-test timeouts became 20 seconds. Assertions, the hook and global timeout remain unchanged. Normal merges propagated it through the chain; the verified feature source otherwise stayed byte-identical. Rebuild and 65 focused checks passed after propagation; fresh core and integration assessments report medium and reviewDue false.

The next decision is review/merge authorization for the dependent chain, followed by final tracker integration. Publication is not approval to merge and does not mean the feature is on `main`.
