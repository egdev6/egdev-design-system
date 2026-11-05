# #357 — Per-component visual anatomy

| Field | Value |
| --- | --- |
| Task / spec | `odd/tasks/agent-fidelity.md` T2 / S1: owner identified button rounding as a significant divergence |
| Issue | #357, follow-up to #348 G8 |
| Status | Plan adopted under the owner's standing instruction; implemented pending review |

## 1. Current state

- The generator discovers public value exports and their adjacent `types.ts` (`scripts/build-artifact.mjs:14-36`). Its `variants()` collects CVA class strings without retaining their variant or size branches (`scripts/build-artifact.mjs:111-185`).
- Button uses `rounded-md` in the shared base and distinct padding, gap and typography classes by size (`packages/ui/src/atoms/button/types.ts:64-87`). The token source defines `--radius-md: 9.6px` and the spacing scale (`packages/tokens/src/theme.css:283-295`, `:429-458`).
- Surface uses variants and compound variants for padding, radius and elevation (`packages/ui/src/primitives/surface/types.ts:21-71`). Some values are identifiers or templates, so literal-only extraction cannot establish all composition.
- The renderer prints component props but no visual anatomy (`packages/system/src/render-system-md.mjs:79-100`). The observed #348 walkthrough records G8: agents guessed button rounding because the reference did not associate radius tokens with components (`docs/odd/distribution/348-gentle-design-walkthrough.md`, Proposed gaps).
- The artifact has a byte-for-byte drift check (`scripts/build-artifact.mjs:274-282`); its existing recipe data is public and must remain unchanged.

## 2. Requirements

- **R1 (AC1, S1):** Derive additive component anatomy from source CVA base, variants and compounds, retaining recipe and branch identity; distinguish shared base from size/variant choices.
- **R2 (AC1, S1):** Associate radius, padding/gap, elevation/shadow and typography classes only with tokens actually supported by token source; report unresolved relevant classes without guessing. Preserve state modifiers and Surface/Material composition evidence; do not claim a computed CSS cascade.
- **R3 (AC1, S1):** Render an anatomy block for every available component, including explicit absence or unresolved information, with source provenance and token references.
- **R4 (AC1):** Check Button rounding and size branches, source radius drift, unknown utilities, Material/Surface, determinism and backward compatibility through public outputs. Preserve existing artifact fields.
- **R5:** Document the additive contract and limitations, regenerate both committed outputs, and run the requested checks without modifying components, token source, dependencies or versions.

## 3. Decisions

| Decision | Options | Recommendation |
| --- | --- | --- |
| D1 — representation | (a) additive structured per-recipe anatomy with branch labels; (b) flattened prose; (c) computed complete appearance | **(a)** retains provenance and lets consumers interpret branch choices; (b) loses structure and (c) would require unsupported cascade inference. |
| D2 — resolution | (a) map only demonstrably token-backed utilities and expose unresolved classes; (b) infer likely CSS; (c) omit unknowns | **(a)** avoids invented values and makes gaps visible. |
| D3 — Material | (a) report source-proven Surface recipe use and associated known recipe data; (b) assume all surfaces share one material; (c) omit Material | **(a)** avoids asserting composition not present in source. |
| D4 — drift | (a) simulate source change in a child process with no file mutation; (b) edit the real component during testing | **(a)** is deterministic and preserves the worktree. |

## 4. Work units

1. **Artifact extraction (R1, R2, R4):** RED behavior tests for Button shared rounding, branch-specific spacing, unknowns, compounds and source radius drift; GREEN isolated extraction and token resolution, preserving the existing `variants` shape.
2. **Reference and documentation (R3, R5):** RED renderer tests for branch/source/unresolved output and missing anatomy; GREEN renderer, additive contract documentation, Unreleased changelog and regenerated outputs. Verify deterministic generation and existing consumers.

## 5. Risks

- CVA templates, identifiers, Surface composition and CSS outside the recipe need conservative source analysis; omitted or unresolved facts must not be presented as computed styling.
- Parallel #356 edits the generator and renderer independently; isolated functions and sections reduce merge conflicts.
- `pnpm test:mcp` builds `packages/mcp/dist` (`packages/mcp/package.json`); that output is explicitly authorized for this task.

### Acceptance criteria traceability

| Criterion | Requirements | Evidence |
| --- | --- | --- |
| AC1 — component radius/padding/elevation by token and drift test | R1–R4 | Generated JSON and Markdown, Button and source-drift tests, Surface cases |
| Issue scope: typography, source derivation, no visual change | R1–R3, R5 | Anatomy provenance and unresolved output; unchanged component and token sources |
| Delivery and checks | R4–R5 | Focused suites and requested validation; report any scoped-write conflict |

## Owner approval

| Decision | Adopted option | Authority |
| --- | --- | --- |
| D1 | (a) Structured additive anatomy | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D2 | (a) Token evidence and unresolved reporting | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D3 | (a) Source-proven Material composition | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D4 | (a) Child-process source drift | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
