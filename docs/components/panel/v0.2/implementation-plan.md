# Panel v0.2 — conditional implementation plan

- **Status:** Draft preparation only. This plan is presented alongside the unapproved exact contract for review, not as permission to skip contract-first approval.
- **Contract:** [spec.md](spec.md), v0.2; canonical payload hash in its metadata and [capture-request.json](capture-request.json). Plan identity: SHA-256 of UTF-8 LF payload from `## 1. Gates and boundaries` through EOF with final newline, excluding this metadata. Its digest is recorded in capture-request.json.
- **Scope-only revision:** Make the two parent-owned future metadata-test surfaces for section 3 / AC-08 explicit. No API, recipe, contract, specimen, capture or adoption change; no recapture is required by this clarification. Existing observed metadata stays read-only with its capture-time old plan identity. Exact-plan approval remains separate; parent refreshes decision-index bindings after handoff.
- **Baseline:** `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23` (isolated worktree; not the older primary checkout).
- **Authority:** [Proposal decision](https://github.com/egdev6/egdev-design-system/issues/180#issuecomment-6516515172) and roadmap [#8 preparation](https://github.com/egdev6/egdev-design-system/issues/8#issuecomment-6522805790). Exact spec, visuals and plan approval: Pending. Implementation source hashes, runtime tests and captures: absent, not fabricated.

## 1. Gates and boundaries

1. Parent recovers/reviews the exact v0.2 contract payload and specimen whole-file hashes. Owner approves its API, native restrictions, inheritance/bands/corners and scoped Material role. No generic unpainted Surface permission is inferred.
2. Parent hosts static HTML with actual compiled canonical `/tokens.css`, captures proposed scenarios under recorded conditions, and obtains explicit owner adoption tied to real PNG/source hashes. Static captures are expected-design candidates, not runtime verification.
3. Owner separately approves this plan's exact payload and future edit surface; parent assigns implementation afresh. Contract approval alone grants no code, tokens, dependencies, host migration or delivery operations.
4. Reinspect source and working tree before runtime work. If Surface/Popover APIs or source hashes drift, reconcile the plan rather than silently targeting the primary checkout. No prerequisite implementation is missing: Surface is exported in this baseline.

Preparation writes exactly `spec.md`, `implementation-plan.md`, `specimen.html`, `capture-request.json` in this v0.2 folder. Preserve v0.1, all peers, tracking, registries and inventories. ModuleCard's production implementation remains unchanged; v0.1's migration/private-sharing recommendation is withdrawn from this transaction.

## 2. Intended future edit surfaces — not currently authorized

| Path | Responsibility / owner |
| --- | --- |
| `packages/ui/src/molecules/panel/types.ts` | Writer: exact four props, native Omit boundary, PanelTone/PanelVariant, JSDoc controls, private static CVA utilities for frame layout/bands/end corners |
| `packages/ui/src/molecules/panel/usePanel.ts` | Writer: typed tone/variant-only context and result objects, root normalization, protected prop filtering, per-part cn, Surface props and isolated-part error |
| `packages/ui/src/molecules/panel/Panel.tsx` | Writer: JSX-only named root/parts; actual Surface root for framed modes and native div for inherit; context provider from hook result |
| `packages/ui/src/molecules/panel/Panel.test.tsx` | Writer: behavior-level/compound/type fixtures, normalization, semantics/passthrough, paint-owner and merge invariants |
| `packages/ui/src/molecules/panel/Panel.stories.tsx` | Writer: `Molecules/Panel`, autodocs, real Meta/StoryObj, Default using actual defaults, compound matrix and supported existing Popover integration; no play/manual argTypes |
| `packages/ui/src/molecules/panel/index.ts` | Writer: four components and six named types only; no context/hook/CVA exports |
| `packages/ui/src/index.ts` | Parent integration: one molecule export after review |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent integration only: scoped real Panel and Header/Body/Footer metadata extraction evidence for own/native props, types, requiredness, defaults and control tags; retain all existing coverage |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent integration only: scoped real Panel/part extraction → registered enhancer → inference evidence for defaults, native props and supported Controls, including owned diagnostics; retain all existing coverage |
| `skills/_shared/prop-naming.json` | Parent integration only: append variant/tone Panel usage with reviewed real PanelProps whole-file hash; no convention change |
| `docs/prop-naming.md` | Parent-generated from the authorized JSON change; never hand-edit |
| `scripts/catalog_data.py` | Parent integration only: bounded Panel availability update after implementation evidence |
| `docs/CATALOGO.md`, `docs/catalog.json` | Parent-generated catalog artifacts, only after separately authorized generation |
| `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs` | Parent integration: scoped public export/CSS/type/React18/19 consumer cases if required by actual harness |

No `panel.css`, other internal files, Surface edits, token changes, dependencies, legacy CSS moves, ModuleCard sharing, Dialog implementation or Popover Content amendments. The shared paths above are intended integration surfaces, not permission to alter them in this preparation. Existing package harness paths were confirmed by scoped file discovery; parent must review the relevant cases before integration. Do not invent a replacement test architecture.

## 3. Implementation sequence after the gates

1. **RED:** Add the smallest import/default compound behavior test and observe the intended absence failure. Expand incrementally for each contract promise, not a giant CSS snapshot. Runtime strict TDD belongs to the later assignment.
2. **Types/recipes:** Declare all utilities statically in types.ts. Compose real Surface at framed root; compose exported surfaceVariants only for banded native Header/Footer, with bounded perimeter/image/shadow resets. Body stays transparent. End corners use direct-zone first/last variants and existing token subtraction, never DOM registration/effects or root clipping.
3. **Hook:** Normalize unknown enum inputs; expose presentation context only. Select framed Surface props or native inherited props; sanitize the exact excluded native props/ref/style at JS boundaries and protect data-tone/data-variant. Typed per-part helpers call cn; context errors use the specified text in all builds. No runtime zone validation, listeners, host inference, IDs or application state.
4. **JSX:** Root branch selection is returned by the hook; render provider and the chosen actual element, not a hidden Surface clone. All four components have explicit public prop generics. No ref/asChild passthrough, state or CVA calls in JSX. Hooks/CVA are not package-barrel APIs.
5. **GREEN/triangulate:** Add alternate tones/variants/optional parts, nested context and negative native/types cases as tests pass. Child events/focus/Popover behavior remain child/host-owned. Keep Surface and ModuleCard regressions as observations, not grounds to rewrite peers.
6. **Docs/integration:** Complete JSDoc/story metadata checks and hand reviewed exports/usages to parent. Record actual implemented source hashes only after reviewing final bytes. No native receipt, browser proof or owner decision can be generated by the writer's verdict.

## 4. Planned functional and visual checks

| Acceptance | Focused check to implement | Negative / alternate protection |
| --- | --- | --- |
| AC-01 | Full and optional zone DOM order/cardinality, default props and rerender | No optional wrapper/padding/separator; intentionally rendered empty part retains padding |
| AC-02 | Six tone×variant matrix; Surface props and per-band recipe ownership | Inherit has no outer eg-surface/paint/blur, Body no recipe, overlay no elevation prop; no ancestor inference |
| AC-03 | First/last utilities on direct siblings, square middle joins | Body-only/no-header/no-footer; browser computed corner radius and focus-at-edge with overflow visible |
| AC-04 | Correct part native id/dir/aria-describedby/data attrs, passive semantics | Type and untyped rejection/stripping of style/ref/role/tabIndex/live; no keyboard handlers or root activation; child click/Tab unchanged |
| AC-05 | Existing Popover fixture with Panel inherit inside Content | Preserve dialog name, padding, outer frame and Radix dismissal/focus; no edge-to-edge/Content asChild/unstyled API |
| AC-06 | Nearest context and invalid enum normalization | Nested different tones/variants; all three orphan parts throw exact error |
| AC-07 | Root and each part cn markers plus supported layout utility precedence | Owned data attrs win; no universal arbitrary override promise; actual cascade/layers in browser |
| AC-08 | Real docgen + registered enhancer/inference (select enums/defaults, required children false-control reasons), no owned diagnostics | No manual argTypes or renderer adapters; no Context/CVA public leak; packed native-CSS consumer without Tailwind on React 18/19 |
| AC-09 | Bounded diff, source hashes, file/export inventory | No peer migration, placeholder CSS, new token/dependency or visual-adoption assertion |

**Future command proposal (not run or authorized now):** focused `pnpm exec vitest run packages/ui/src/molecules/panel` first, then `pnpm exec vitest run packages/ui/src/primitives/surface packages/ui/src/molecules/popover packages/ui/src/molecules/module-card` for composition/regression evidence. Parent schedules exact metadata checks and shared typecheck/lint/test/build/props/exports/consumption gates after implementation, using its serial locks/resource caps; none are preparation evidence. Inspect real package scripts before assigning commands. Do not launch servers, mutate dependencies or build just to substantiate a static draft.

Parent browser review: real Controls; all six combinations; narrow viewport, zoom/reflow, RTL, long text, focus edges; overlay reduced-transparency and unsupported-filter fallback; existing Popover Escape/outside/Tab/focus return. Compare runtime captures to separately adopted expected-design captures under equivalent conditions, and distinguish differences from approved changes. Manual AT review remains separate. No Dialog integration test until its API is implemented and separately in scope.

## 5. Static preparation evidence and review budget

Actual: source/API/export/naming/Material review; token-backed HTML authored with no script; local hashes/links/structure checked in writer handoff. No runtime RED/GREEN, builds, browser runs, screenshots, AT review or independent/native approval. `capture-request.json` is a request, never a capture receipt. Parent owns hosting, compiled tokens/font availability, real captures and approval recovery.

Estimated later implementation: 650–900 changed lines including tests/stories plus parent-owned integration evidence; no peer migration. Suggested review slices: (1) types/hooks/JSX/tests ~400–550 lines, (2) stories/metadata/export/CSS/package evidence ~250–350 lines, with contract/visual references kept together. These are review planning estimates, not Git/PR actions or a grant to split deliveries. Preparation itself is four files; owner may request a smaller contract/visual revision before approving code.

**Stop:** Return preparation for parent/owner review. Do not call Panel implemented or start runtime work while the exact contract, visual adoption or separate plan grant is pending.
