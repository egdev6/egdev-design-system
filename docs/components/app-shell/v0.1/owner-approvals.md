# AppShell v0.1 — owner approvals

Recorded 2026-11-02 from the owner's questionnaire answers after the implementation plan was drafted (tracking: `odd/tasks/organisms-build.md`, T10, L31–L32).

| Decision | Owner answer | Scope |
|---|---|---|
| Implementation plan | "Aprobar plan completo (Recomendado)" | `implementation-plan.md` in this folder, its implementation and the integration surfaces it lists (catalog row, prop-naming registry, package tests) in the same PR. No new dependency. |
| Responsive threshold | "Valor literal del contrato (Recomendado)" | Keep the contract's literal `min-[56rem]:` / `max-[56rem]:` media variants (D4); no token and no contract amendment. An emitted-CSS test pins the `56rem` at-rules so a missing variant fails loudly. |
| Evidence location | "owner-approvals.md + PR (Recomendado)" | Owner decisions in this file; observed gates and browser evidence in the PR description. |
| Issue #128 | "Cerrarlo con el PR (Recomendado)" | The AppShell PR closes #128 together with #130, referencing the plan's #128 evidence table. |

The `v0.2/` preparation notes stay untouched and are referenced from v0.1 (plan recommendation). These approvals do not cover token value changes or other dependencies.
