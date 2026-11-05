# 354 — Reproducible artboard token self-check

## Current state

- The #348 walkthrough's G5 records an unpreserved colour list and trace; its static HTML retypes token and effect values.
- `@egdev/system` ships the token artifact and renders token tables in `system.md`. Artboards cannot import the token CSS and do not run React.
- The #343 R5 amendment accepts `color-mix(in oklab, <token> N%, transparent)` for a colour token. It does not approve arbitrary colour mixtures.

## Requirements

- R1 (AC1, S1): list colour, font-family, font-size, spacing, radius and shadow values in inline styles and `<style>` elements, with an auditable token trace or explicit gap.
- R2 (AC1): support references and resolved artifact values, including aliases and the approved transparency mix; unknown references and unsupported expressions must not silently pass.
- R3 (Checks): exercise the #348 artboard shape with passing and failing fixtures, and report exact output and exit status.
- R4: ship a dependency-free package CLI and document its use and static-analysis limits without changing the composition guide, components or tokens.

## Decisions

| Decision | Options | Recommendation |
| --- | --- | --- |
| D1 — token source | (a) installed artifact by default, optional generated reference; (b) require a reference | (a): the installed artifact is versioned with the CLI; an explicit reference supports a consumer snapshot. |
| D2 — unsupported syntax | (a) report an untraced gap and fail; (b) skip it | (a): a static check must not claim compliance by overlooking unfamiliar CSS. |
| D3 — trace | (a) preserve declaration location and value with matching token names; (b) only print a summary | (a): reviewers can reproduce each finding and resolve ambiguous matches. |
| D4 — evaluation | (a) static, no browser or external resources; (b) computed browser styles | (a): matches self-contained artboards and requires no dependency. |

## Work units

1. Add public CLI fixture tests for passing and failing artboards, asserting exact stdout, stderr and exit status; capture RED before implementation.
2. Implement bounded static extraction and token tracing; fail closed on constructs whose relevant values cannot be determined, including unresolved custom properties and unsupported syntax. Test alias resolution, literal values, inline attributes, shorthands, transparency mixes and invalid inputs.
3. Document invocation, coverage and limitations; add the bin and an Unreleased changelog entry. Run the focused and requested checks; package-release verification belongs to the parent.

## Risks

CSS and HTML have complex parsing rules; a dependency-free scanner is not a browser. CSS cascades, computed values, external stylesheets, script-generated styles and dynamic values cannot be established by a static listing. Failing closed on unsupported constructs is essential; a passing result is not proof of visual or component fidelity.

## Acceptance traceability

| Criterion | Requirements | Evidence |
| --- | --- | --- |
| AC1 — auditable trace or gaps | R1, R2 | deterministic CLI rows, exit code and fixtures |
| #348 artboard shape | R3 | passing and failing self-contained HTML fixtures |
| Delivery and scope | R4 | package bin, docs, unchanged tokens and components |

## Owner approval

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D2 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D3 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D4 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
