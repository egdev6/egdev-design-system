# Link: underline at rest, removed on hover

Owner design adjustment for the Link atom (`packages/ui/src/atoms/link`). Branch `feat/link-underline-hover`; spec amendment + implementation in one PR, with Storybook verification by the owner before the PR.

## Specs

- S1: Owner request, verbatim: "un ajuste de diseño. en l componente link podemos cambiar el diseño? sería el estado inicial como está pero añadirle underline y al hacer hover sigue la animación de la flecha pero en vez de cambiar color le quitamos el underline"
- S2: Owner choice, verbatim: "Change the default look; retire 'underlined' (Recommended)" ("Every Link gets it. The 'underlined' variant becomes redundant: keep it as a deprecated alias of the default (no breaking change) and remove it in a later major.").
- S3: Owner choice, verbatim: "Text underline in the link color (Recommended)" ("text-decoration underline with offset, same color as the text; standard and follows the accent.").
- S4: Resulting behavior: rest = current look (font, size, `text-link-default`, arrow) plus a text underline in the link colour with a token-based offset; hover = the arrow keeps its `translate-x-1` motion, the colour does NOT change (no `hover:text-link-hover`), and the underline is removed; focus-visible ring unchanged; reduced motion unchanged. `variant="underlined"` renders exactly like the default and is marked `@deprecated` in JSDoc/docs; the `LinkVariant` type keeps the value (no breaking change).
- S5: Spec amendment `docs/components/link/v0.4/underline-hover-amendment.md` (follow the existing Link spec versions' format), recording S1–S4, the WCAG 1.4.1 rationale (underline identifies links without relying on colour; hover keeps a visible change), and the deprecation plan.
- S6: Owner instruction, verbatim: "en cada entrega enséñame storybook para verificar".

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1–S5 | worker | this commit |
| T2 | S4, S6 | parent | Chrome check, artifacts, checks, Storybook, PR |

## Log

- L1 (owner, verbatim): S1.
- L2: Evidence: `packages/ui/src/atoms/link/types.ts` base has `no-underline` + `hover:text-link-hover`; `underlined` variant = `border-b border-border-brand pb-0.5 hover:border-state-selected`; arrow = `motion-safe:group-hover/link:translate-x-1`. Spec versions exist under `docs/components/link/v0.1..v0.3`.
- L3 (owner choices): S2, S3.
- L4: T1 done by worker (RED 7 + docgen 1 → GREEN Link 18/18; underlined consumers NowCard/ProjectCard/CommunityCard 65/65). Owner verified in Storybook (verbatim): "nada, está OK". Chrome: rest text-decoration underline, offset 3.2px, color rgb(255,0,54), no border; hover underline none, same color, arrow translate 3.2px; underlined identical. Parent: link types.ts registry pins (5) rehashed, catalog row + docs, props docs, build, artifact, system.md. Checks: Vitest 3186/3186, package-consumption, package-exports 137/0, system 36/0, props 130/0, artifact 31/0, typecheck, biome.
