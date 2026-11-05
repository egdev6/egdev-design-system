# 353 — Logo asset for artboards

## Current state

G4 in `docs/odd/distribution/348-gentle-design-walkthrough.md` records a placeholder because the reference lacks the real Logo SVG. `packages/ui/src/atoms/logo/Logo.tsx`, `useLogo.ts`, `logo-artwork.ts` and `types.ts` define the actual mark and wordmark, geometry and token inks. The artifact and generated reference are distributed by `@egdev/system`.

## Requirements

- R1 (AC1, S1): provide both real Logo variants as copyable, accessible inline SVG from the installed artifact and generated reference; preserve geometry and token-backed inks.
- R2: derive markup from the component source without redrawing; detect source artwork drift in `--check`.
- R3: document provenance, tokens, usage and limits; regenerate outputs under one MiB without dependencies or component changes.

## Decisions

| Decision | Options | Recommendation |
| --- | --- | --- |
| D1 — source | (a) statically render the source component and translate its ink classes to token fills; (b) manually copy SVG | (a): source is authoritative and drift-sensitive. |
| D2 — distribution | (a) additive artifact assets and inline SVG under Logo in system.md; (b) separately shipped files | (a): available offline from installed @egdev/system and directly copyable. |
| D3 — size | (a) losslessly gzip/base64 the SVG in the artifact and decode when rendering; (b) omit a variant | (a): preserve both variants under one MiB and retain the standard JSON format. |

## Work units

1. Add behavior-level artifact, source drift and renderer tests; observe RED.
2. Render both variants from source, expose additive assets and render the SVG reference; regenerate goldens.
3. Document and run the requested checks.

## Risks

Wordmark geometry is large. SVGs use CSS custom properties and require token definitions in the artboard; the wordmark is intended for canvas or surface backgrounds. Static assets do not implement the component's interactive link behavior.

## Acceptance traceability

| Criterion | Requirements | Evidence |
| --- | --- | --- |
| AC1 — real Logo from installed version | R1–R3 | artifact and rendered reference tests, source drift test, generated package files |

## Owner approval

| Decision | Chosen option | Source |
| --- | --- | --- |
| D1 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D2 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
| D3 | (a) | adopted under the owner's standing instruction 'no me preguntes tanto. tira millas' |
