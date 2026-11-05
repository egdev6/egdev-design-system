# 370 — Typography roles in the system reference

## Current state

The #350 walkthrough mapped components but used system-ui because the reference listed font tokens without role associations. Heading and Text recipes use display; SectionHeader and Hero ledes use sans; ProjectCard code uses mono. Small card headings can use sans, so not all headings are display.

## Requirements

- R1 (AC1, S1): expose source-derived typography role families and size, line-height, weight and tracking tokens; identify unresolved facts without guessing.
- R2 (AC1): detect role source drift and preserve existing artifact and renderer behavior, including older artifacts.
- R3: document and regenerate the additive outputs, stay below one MiB and run the requested checks.
- R4 (AC2, S1): repeat the walkthrough independently without owner comments; parent owns this separate behavioral validation.

## Decisions

| Decision | Options | Recommendation |
| --- | --- | --- |
| D1 — scope | (a) named, traceable representative recipes; (b) guess a universal cascade | (a): source facts, not universal rules. |
| D2 — fields | (a) token references and explicit unresolved fields; (b) infer missing values | (a): no invented values. |
| D3 — delivery | (a) additive artifact roles and dedicated reference block linked from guide; (b) prose only | (a): deterministic and drift-sensitive. |
| D4 — walkthrough | (a) parent runs independently; (b) infer success from tests | (a): tests cannot establish agent behavior. |

## Work units

1. RED artifact role and drift tests; GREEN extract source facts and regenerate. Preserve existing artifact checks.
2. RED renderer role and old-artifact tests; GREEN render roles and guide reference, regenerate. Preserve ordering.
3. Document and run requested checks; parent runs the repeated walkthrough.

## Risks

Selected recipes are examples rather than an exhaustive computed cascade. Component overrides, inheritance and legacy CSS can differ. A universal document-body recipe is unresolved; WebSection accepts consumer-supplied heading content rather than establishing its own heading font. Separate layout work edits the same generator and renderer.

## Acceptance traceability

| Criterion | Requirements | Evidence |
| --- | --- | --- |
| AC1 | R1–R3 | roles, drift and renderer tests; generated reference |
| AC2 | R4 | parent-run repeated walkthrough |
| Scope | R3 | generated outputs and requested checks |

## Owner approval

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D2 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D3 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D4 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
