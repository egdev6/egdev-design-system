# 355 — Supplementary content around Hero

## Current state

G6 in `docs/odd/distribution/348-gentle-design-walkthrough.md` records a registration count removed because Hero has no supporting-datum slot. `packages/ui/src/organisms/hero/types.ts` reserves children for zero to two named actions and media for decoration. `packages/ui/src/atoms/stat/types.ts` describes a labelled passive figure; `packages/ui/src/organisms/web-section/types.ts` describes host-supplied section content.

## Requirements

- R1 (S1–S3): document a supporting count as sibling content, not an invented Hero slot or extra action.
- R2: render traceable guidance from validated artifact data; preserve the Hero API.

## Decisions

| Decision | Options | Recommendation |
| --- | --- | --- |
| D1 — placement | (a) sibling Stat in the host section; (b) change Hero | (a): the existing labelled figure preserves the action and decorative-media contracts. |
| D2 — representation | (a) reviewed artifact data; (b) renderer-only text | (a): testable export references and traceable source. |

## Work units

1. RED rendering and reference validation; GREEN curated recipe and generated reference.
2. Run requested checks; no component or token changes.

## Risks

Stat has its own elevated treatment and may not suit every visual hierarchy; the host owns placement and formatted data. The guidance does not add a Hero slot.

## Acceptance traceability

| Criterion | Requirements | Evidence |
| --- | --- | --- |
| Supplementary placement | R1, R2 | generated composition guide and tests |
| Existing API | R2 | unchanged component source |

## Owner approval

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D2 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
