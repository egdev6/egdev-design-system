# 371 — Layout anatomy for templates and section organisms

## Current state

The #350 walkthrough found WebTemplate and WebSection but interpreted their layouts because their anatomy was empty. WebSection delegates section layout to the host; SectionShell owns an optional centered wrapper and register-specific paint. Existing anatomy only collects selected CVA utility categories.

## Requirements

- R1 (AC1, S1): expose source-derived template and section layout, slots and recipes without inventing host-owned layout.
- R2 (AC1): preserve variant conditions and token references, identify unresolved facts and detect source drift. Extract component CSS layout declarations and static inline custom-property assignments; report unevaluable classes explicitly.
- R3: retain shared utility interning, stay under one MiB, regenerate references and run requested checks.

## Decisions

| Decision | Options | Recommendation |
| --- | --- | --- |
| D1 — facts | (a) extract static source with provenance and unresolved expressions; (b) invent inferred layouts | (a): source is authoritative. |
| D2 — slots | (a) retain source expressions and order; (b) infer runtime composition | (a): avoid unsupported guarantees. |
| D3 — storage | (a) reuse anatomyUtilities; (b) duplicate utility records | (a): control artifact size. |

## Work units

1. RED artifact and renderer tests including section source drift; GREEN static extraction and rendering.
2. Document limitations, regenerate and run requested checks.

## Risks

Static analysis cannot evaluate arbitrary runtime conditions or consumer content. WebSection expressly leaves layout to its host; absence of its own padding is not evidence for a guessed spacing.

## Acceptance traceability

| Criterion | Requirements | Evidence |
| --- | --- | --- |
| AC1 — template and section layout and drift | R1–R2 | generated anatomy and source drift tests |
| Scope and checks | R3 | output size and requested checks |

## Owner approval

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D2 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D3 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
