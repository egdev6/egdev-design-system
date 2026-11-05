# 382 — Artifact size budget

## Current state

`packages/system/design-system.json` is 1,010,644 bytes. Pretty-printed top-level value sizes (bytes): name 21, assets 49,917, schemaVersion 7, packages 182, catalog 22,862, components 827,011, anatomyUtilities 41,227, typographyRoles 2,524, compositionRecipes 2,370, types 1,644, tokens 30,405, materialRecipes 739, propNaming 28,437. Values measured individually include pretty-print indentation unlike the generated file; they are not additive. Compact serialization of the same parsed object is 709,216 bytes including the newline.

## Requirements

- R1 (S1): preserve all data, public consumer behavior and generated reference bytes.
- R2: enforce a 768 KiB maximum for every shipped system JSON and retain deterministic drift checks.
- R3: document representation, budget and tradeoffs; run authorized checks without releasing or bumping versions.

## Decisions

| Decision | Options | Recommendation |
| --- | --- | --- |
| D1 — representation | (a) compact single-file JSON; (b) split sections into files with manifest | (a): unchanged schema, import path and consumers; roughly 77 KiB headroom. Revisit if the budget is reached. |
| D2 — formatting | (a) exempt generated JSON from formatting while keeping JSON checks; (b) format it and split | (a): deterministic compact bytes are essential to D1. |
| D3 — budget | (a) 768 KiB per shipped JSON; (b) 1 MiB | (a): early warning before the checker limit. |

## Work units

1. Test the budget before changing serialization; preserve existing source drift tests.
2. Generate compact JSON, exempt only its formatter, and verify renderer and MCP compatibility.
3. Document the tradeoff and run authorized checks; packed-consumer checks remain parent-owned.

## Risks

Compact output is less human-readable and offers finite growth headroom; pretty-print locally. The budget test signals when a future split is necessary. No new loader or split-file integrity protocol is needed.

## Acceptance traceability

| Criterion | Requirements | Evidence |
| --- | --- | --- |
| Shipped JSON below budget | R2 | artifact budget test |
| Unchanged reference and MCP behavior | R1 | system and MCP checks |
| Documentation and checks | R3 | distribution guide and validation |

## Owner approval

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D2 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D3 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
