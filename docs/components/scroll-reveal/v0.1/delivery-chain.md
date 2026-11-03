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
