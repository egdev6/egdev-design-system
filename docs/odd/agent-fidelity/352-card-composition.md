# 352 — General card composition guidance

## Current state

G3 in `docs/odd/distribution/348-gentle-design-walkthrough.md` records a session preview made from Surface, Badge, TerminalCard and Countdown and agenda rows made with ListItem. `packages/ui/src/index.ts` exports these and specialized cards, including ProjectCard, TipCard and ArticleFeature. `docs/MATERIAL.md` requires Surface or an approved component recipe for Material paint. `packages/ui/src/molecules/article-feature/types.ts` documents the featured article link and its PhotoFrame cover; `packages/ui/src/molecules/list-item/types.ts` documents row variants and compound parts.

## Requirements

- R1 (S1–S3): present actionable session preview, list row and media card guidance in the generated composition guide, respecting existing organism-first guidance and public contracts.
- R2: record the cataloging decision without creating a component; validate referenced exports and detect drift.
- R3: regenerate the artifact and reference and run the requested checks.

## Decisions

| Decision | Options | Recommendation |
| --- | --- | --- |
| D1 — cataloging | (a) compose with existing pieces; (b) new general card | (a): reuse first and compose only where needed; evidence does not establish a reusable general responsibility. |
| D2 — guidance | (a) reviewed data in the artifact; (b) renderer prose | (a): one traceable, testable source. |

### Cataloging decision

- **Decision:** compose in the consumer, no new general Card; Radix: none newly needed. Destination is the app pattern, not a new public export.
- **Reuse:** examine organisms first; ArticleFeature already covers a featured article link, ListItem covers agenda rows, and specialized ProjectCard/TipCard cover their own responsibilities. None establishes a universal card for the session preview. Surface supplies the Material frame and the observed Badge, TerminalCard and Countdown supply its contents.
- **Variant:** a Surface appearance variant cannot supply independent content responsibilities; changing a specialized card's responsibility would not be a visual variant.
- **Compose:** Surface and existing content solve the observed preview; ListItem and ArticleFeature already own their frames, so avoid doubling paint. This is the first sufficient step.
- **Extract:** no repeated hidden piece needing extraction has been demonstrated; propose an atom if future evidence shows a reusable semantic piece. **New:** no general card is justified yet; if the composition recurs across apps, propose an organism as directed by S2 and catalog its responsibility before implementation.
- **Impact:** documentation and generated data only; no imports, API, component, token, stories or runtime behavior change.

## Work units

1. RED recipe rendering, export and drift tests; GREEN validated data and renderer.
2. Record decision, regenerate outputs and run requested checks.

## Risks

Recipes are examples, not an exhaustive compatibility proof; source contracts and independent nested Material remain authoritative.

## Acceptance traceability

| Criterion | Requirements | Evidence |
| --- | --- | --- |
| Surface recipes | R1, R2 | generated guide and tests |
| Cataloging decision | R2 | decision above |
| Checks | R3 | worker handoff |

## Owner approval

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D2 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
