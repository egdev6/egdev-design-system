# 351 — ListItem parts in Storybook

## Current state

G2 in the #348 walkthrough records that ListItemLeading was difficult to find. Nine ListItem parts are public exports, but the Storybook MCP registry treats them as undocumented. Other compound stories declare subcomponents; the existing contract only counts top-level story components.

## Requirements

- R1 (AC1, S1): describe every exported ListItem part on its parent docs page and show valid editorial and card compositions.
- R2 (AC2): count declared public subcomponents as documented by their parent, offline and in the live MCP response; update the registry consistently.
- R3: preserve the ListItem API, styling, tokens and Storybook configuration.

## Decisions

| Decision | Options | Recommendation |
| --- | --- | --- |
| D1 — discovery | (a) parent anatomy and subcomponents; (b) separate stories per part | (a), keeping composition and restrictions together. |
| D2 — contract | (a) declared subcomponents with live parent verification; (b) prose-only mentions | (a), an explicit generic declaration with live evidence. |

## Work units

1. RED contract and ListItem documentation tests; implement generic reconciliation and parent anatomy; remove stale registry exceptions.
2. Verify all declared subcomponents through live parent docs-show and run the requested checks.

## Risks

The MCP manifest and docs-show must expose declared parts; declaration alone does not establish live discoverability. Other declared subcomponents change registry state under the generic rule.

## Acceptance traceability

| Criterion | Requirements | Evidence |
| --- | --- | --- |
| AC1 — parts discoverable | R1, R2 | Storybook parent docs and live docs-show |
| AC2 — registry state | R2 | offline reconciliation and live smoke |
| Scope | R3 | scoped diff and checks |

## Owner approval

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D2 | (a) | adopted under the owner's standing instruction and explicit approval of declared-subcomponent contract |
