# Pre-release fixes #471 and #472

Two pending items resolved before the next release for Nexo. Branch `fix/pre-release-471-472`, one commit per issue, one PR.

## Specs

- S1: Owner request, verbatim: "abre issues de lo pendiente y resolvemos antes del build".
- S2 (#471): the registry usage `ColorSwatchGroupOption.label` in `skills/_shared/prop-naming.json` (and the generated `docs/prop-naming.md`, plus any test pin) describes the real contract: option labels are visually hidden and remain the accessible preset name (e.g. `string (accessible preset name; visually hidden)`). The prop name, TypeScript type and convention do not change. The historical v0.1 approval receipt `docs/components/color-swatch-group/v0.1/prop-naming-approval.json` is never rewritten; if the repo's registry workflow requires a recorded owner decision for a usage text change, add a new receipt following the existing pattern (pin prior receipts in `priorReceipts`), citing S1 and the owner's acceptance of #465 ("está OK").
- S3 (#472): `pnpm test:artifact` (`scripts/design-system-artifact.test.mjs`) passes on the branch. The two stale expectations ("all L9 naming types retain their source and owner" lacks `ColorSwatchGroupOption`; "artifact contains the complete token source" expects 297 tokens while the source declares 312) follow the real sources, preferably derived from them (token declarations in `packages/tokens/src/theme.css`, exported types) rather than new hard-coded numbers, without weakening what each test proves.

## Tasks

| ID | Specs | Issue | Route | Commit |
| --- | --- | --- | --- | --- |
| T1 | S1, S2 | #471 | worker A | commit 1 |
| T2 | S1, S3 | #472 | worker B | commit 2 |
| T3 | S1 | both | parent | regenerate, checks, PR |

## Log

- L1 (owner, verbatim): "abre issues de lo pendiente y resolvemos antes del build"
- L2: Issues opened: #471 (registry text), #472 (test:artifact).
- L3: T1 (#471): usage text → `string (accessible preset name; visually hidden)`; no new receipt needed (usage observations do not change convention hashes, `skills/_shared/component-contract.md:81`, `scripts/prop-naming.mjs:278`); RED 129/1 → GREEN 130/0; props:check valid. T2 (#472): naming types derived from the registry with the builder's rule (owner list kept as an owner-reviewed inventory, + ColorSwatchGroupOption); token count derived from theme.css declarations (312) plus uniqueness; RED 2 failures → GREEN 31/31. Parent on the combined tree: artifact + system.md regenerated (no diff), biome, props:check, test:props 130/0, test:artifact 31/0, test:system 36/0.
