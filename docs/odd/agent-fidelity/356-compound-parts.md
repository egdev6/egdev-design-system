# 356 — Compound parts in the system reference

## Current state

- The issue's G7 records a CTA placed directly under TopBar because the reference lacked its parts (`docs/odd/distribution/348-gentle-design-walkthrough.md:233`).
- Public exports include TopBar parts (`packages/ui/src/organisms/top-bar/index.ts:1`) and ListItem parts (`packages/ui/src/molecules/list-item/index.ts:1`). Their source comments describe their roles (`packages/ui/src/organisms/top-bar/TopBar.tsx:5`, `packages/ui/src/molecules/list-item/ListItem.tsx:12`).
- TopBar only accepts recognized direct parts, including through fragments; other direct children are dropped (`packages/ui/src/organisms/top-bar/useTopBar.ts:25`). Its parts accept one named link or control (`packages/ui/src/organisms/top-bar/types.ts:40`); there is no general-purpose action slot.
- The artifact collects public values and own props (`scripts/build-artifact.mjs:20`, `:180`); the renderer currently prints catalog parents and props (`packages/system/src/render-system-md.mjs:78`).

## Requirements

- R1 (AC1, S1): expose TopBar parts and source-stated child restrictions, without inventing a general action slot.
- R2 (AC2): derive other compound parts from public source exports, with descriptions and source-stated child constraints; do not hardcode TopBar.
- R3: retain existing data and rendering; add deterministic, traceable metadata and a source-drift check.
- R4: document the additive contract, regenerate both outputs, and run the requested checks.

## Decisions

| Decision | Options | Recommendation |
| --- | --- | --- |
| D1 — association | (a) exported same-source values with a parent-name prefix; (b) hardcoded list | (a): generic and source-derived, subject to naming conventions. |
| D2 — semantics | (a) source JSDoc and children prop descriptions; (b) manually curated descriptions | (a): traceable and drift-sensitive. |
| D3 — representation | (a) additive parts on parent components; (b) separate global index | (a): keeps composition next to each parent. |
| D4 — CTA | (a) state the actual slot restrictions without inventing an action slot; (b) suggest a guessed placement | (a): preserves the source contract. |

## Work units

1. Artifact: RED public behavior and source-change drift tests; GREEN derive associations and documentation, then regenerate artifact. Preserve existing export, prop and recipe tests.
2. Renderer: RED deterministic rendering and old-artifact compatibility tests; GREEN render source-derived parts beneath parents and regenerate reference. Preserve existing rendering.
3. Documentation and validation: describe limits, run focused and requested suite checks; no dependencies, component APIs or version changes.

## Risks

Source naming and JSDoc are not a formal composition registry: undocumented relationships or constraints cannot be inferred safely. TopBar has no generic CTA slot. The separate visual-anatomy work changes nearby files; isolate part extraction and rendering.

## Acceptance traceability

| Criterion | Requirements | Evidence |
| --- | --- | --- |
| AC1 — TopBar parts and actions | R1, R3 | generated TopBar section and behavior tests |
| AC2 — generic compound parts | R2, R3 | ListItem and TerminalCard assertions, source drift test |
| Scope and checks | R4 | generated goldens, documentation, requested checks |

## Owner approval

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D2 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D3 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D4 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
