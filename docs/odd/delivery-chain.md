# Design-system delivery chain

## Status and authority

This is the current delivery plan, not evidence of completed implementation or approval.
Refs #32: https://github.com/egdev6/egdev-design-system/issues/32

The approved strategy is a six-unit feature-branch chain, with a tracking seed on
`feat/egdev-ds-00-delivery`. Its recorded base is remote `main` at
`6ea2841485b079a1d4a8e7b87a015afe4b872771`.
At initialization, only the tracking branch exists; no delivery commits or PRs exist.
The parent orchestrator owns Git, index, remote operations and delivery review.
Authorization permits commits, pushes and draft PRs only; no merge or release.
No human hash approval, native review approval or merge readiness is asserted here.
Issues #7, #8 and #30 remain unchanged and need review; #31 multiring is not implemented.

## Branch chain and proposed review units

The tracker targets `main`; each child targets its immediate predecessor below.
Every boundary remains **Pending** until its own checks and review are recorded.
Estimates describe source areas, not exact authored PR sizes or approved budgets.

| Unit / branch | Target | Intended scope and rough source estimate | Status |
| --- | --- | --- | --- |
| `feat/egdev-ds-00-delivery` | `main` | This tracking seed | Pending |
| `feat/egdev-ds-01-m3-inventory` | `feat/egdev-ds-00-delivery` | M3 inventory: 3 documents, ~775 raw lines | Pending |
| `feat/egdev-ds-02-gauge-history` | `feat/egdev-ds-01-m3-inventory` | Gauge history: 71 paths, ~3,960 raw lines plus 48 normative PNGs | Pending |
| `feat/egdev-ds-03-gauge-native-well` | `feat/egdev-ds-02-gauge-history` | Final Gauge, 20 retirements, API/CSS/artifacts and JSDoc helper: 45 paths, ~3,000 raw lines | Pending |
| `feat/egdev-ds-04-prop-naming` | `feat/egdev-ds-03-gauge-native-well` | Prop naming, registry, scripts and CI: 9 paths, ~1,160 raw lines | Pending |
| `feat/egdev-ds-05-component-governance` | `feat/egdev-ds-04-prop-naming` | Component governance: 14 paths, ~792 raw lines | Pending |
| `feat/egdev-ds-06-storybook-neon` | `feat/egdev-ds-05-component-governance` | Storybook: 15 files plus 3 shared hunks, ~939 raw lines plus logo | Pending |

All six proposed child units exceed the 400-line review advisory. No exception has
been granted. Measure actual authored hunks before setting budgets; do not compress
code to evade review. Keep tests and documentation with their implementation.

## Scope and preservation contract

- Deliver Gauge-only public components plus `cn`; preserve public package identity.
- Do not change token values or add dependencies without separate authorization.
- Retain immutable v0.8/v0.9 history, specification/document approvals and captures.
- Keep all 48 normative PNGs, including 27 v0.9 captures.
- Do not manufacture an intermediate Surface-based Gauge implementation: the final
  delivery snapshot is already native. Preserve the historical v0.8 contract unchanged.
- Keep ignored debug captures, Playwright output, dist, static output, dependencies,
  CodeGraph data and private archives outside delivery.
- Preserve the original dirty working tree; delivery uses the isolated worktree.
- Add no features beyond the approved source snapshot and these scoped changes.

Split the three shared files by behavior. Unit 03 registers the JSDoc enhancer,
loads Gauge CSS and retains Gauge-only MCP coverage. Unit 06 adds the Docs theme,
navigation, palette import and seven-MDX catalog helpers alongside the guides.
Earlier units must not import files deferred to 06.
Unit 06 covers the “Egdev Design system” name, logo, dark presentation, seven guides
and local red-300-to-neon changes; it does not authorize global token changes.

## Boundary verification and delivery gates

Source snapshot evidence reports 123 tests, type checks, lint and a Storybook build
passing in job 52. That is context only, not verification of any child boundary.
The parent must record actual per-boundary checks, source-to-snapshot comparison
and protected root checks before advancing a unit. This seed supplies no receipts.

| Gate | Current evidence / next action | Status |
| --- | --- | --- |
| Authored scope and budget | Measure actual hunks and resolve review-size advisory | Pending |
| Tests, types, lint and Storybook | Run appropriate checks on each actual boundary | Pending |
| Documentation and imports | Check links, shared-file placement and dependency closure | Pending |
| Source and root protection | Compare with the approved snapshot and protected roots | Pending |
| Review authority | Follow applicable repository/harness policy; record actual outcomes without inventing native approval | Pending |
| MCP full smoke | Timed out; not retried | Blocked |
| React 18/19 packed compatibility | Blocked by offline cache | Blocked |
| Screen-reader evaluation | No actual assistive-technology evaluation performed | Not evaluated |
| Fresh CI ordering prerequisite | Separate review artifact and plan approval required | Pending |

The existing GitHub grant covers target-bound reads, branches, commits, pushes and
draft PRs. It does not authorize retries of blocked MCP/packed checks, dependency
installations or cache probes. Do not infer merge readiness from source snapshot
checks or from this plan.

The fresh-checkout prerequisite was reproduced on boundary 03: its CSS checks
cannot load ignored token dist artifacts before the producer runs. A separately
reviewed native plan was explicitly approved and applied, moving the existing
Build packages step before Unit tests without changing actions or permissions.
Boundary 03 includes this correction and its proposal sources. Boundary 04 received
its own explicitly approved native plan and adds only registry validation/tooling
checks, preserving the build-first order. Both applied workflow versions were
read back against their reviewed sources; neither authorization is reusable.

## Progress checklist

- [ ] Measure actual authored boundaries and resolve review-size treatment.
- [ ] Complete unit 01 inventory checks and review.
- [ ] Complete unit 02 history/capture preservation checks and review.
- [ ] Complete unit 03 Gauge/retirement/API checks and review.
- [ ] Complete unit 04 naming/registry/script checks and review.
- [ ] Complete unit 05 governance checks and review.
- [ ] Complete unit 06 Storybook/shared-hunk checks and review.
- [ ] Resolve the separately reviewed CI ordering prerequisite.
- [ ] Record outstanding smoke, compatibility and accessibility outcomes honestly.
- [ ] Record source/root protection evidence and actual approvals before delivery.

## Plan evolution

Initial recorded decision: use the approved six-child chain with a tracking seed;
issue #32 is the confirmed delivery issue. The seed and documentation boundaries
01/02 were committed with normal typecheck and commitlint hooks. Their copied
bytes, including all normative images, match the preserved source snapshot.
Boundary 03 then built packages and passed types, lint, unit tests, token tests,
package-export tests and the two offline MCP parser fixtures. Its source isolation
was checked through ESM exports inside the delivery worktree. Full MCP and packed
consumer checks remain blocked and were not retried. These are local checks, not
remote CI or native code-review approval. Boundary 04 also passes registry
freshness, all 73 tooling tests, types, lint and the same 110 unit tests. All 13
naming conventions remain proposed with null approval. Boundary 05 preserves all
14 governance documents byte-for-byte and passes registry, types and lint checks.
Boundary 06 restores the approved final preview/MCP hunks and all seven guides;
it passes 123 unit tests, 73 registry tests, 19 token tests, 13 package-export tests,
15 offline MCP fixtures, types, lint, package and Storybook builds. The consumer
script has syntax evidence only. Remote CI and the final source-tree comparison
remain separate gates; no blocked live or packed check was retried.
