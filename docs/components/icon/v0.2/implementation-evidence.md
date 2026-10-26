# Icon v0.2 implementation evidence

## Contract and authorization

- Canonical issue: [Icon #58](https://github.com/egdev6/egdev-design-system/issues/58).
- Effective contract: the [full v0.2 snapshot](https://github.com/egdev6/egdev-design-system/issues/58#issuecomment-6244802920), with the owner full-contract approval recorded in the same issue. The initial v0.1 issue body remains historical.
- Canonical payload SHA-256: `61698b9459c113fbb099903bba3cf40a798e874ab940ee91c281ae9746400fdb`.
- Expected-design VIS-01 SHA-256: `14991312739b67ed6f1d25a0a8df54bffb0185f6035f7c3916a055c3246bec35`.
- Implementation authorization: the parent explicitly confirmed that the owner's batch request authorizes implementing Icon under this contract: L1, “Haremos el desarrollo completo del componente hasta el PR que yo mergearé”; L2, “Primitivas + átomos”. These statements are transcribed in `odd/tasks/particles-build.md`, task T3, Specs S1–S6. That file is an untracked coordination copy and must not be committed. This record preserves the supplied authorization; it is not a newly invented native GitHub approval receipt.
- Scope: complete the approved Icon implementation and package checks. The parent owns installation decisions and all Git mutations, including commits, integration of Spinner #143 and the final post-merge gates. No push or CI run is claimed.

## Bounded implementation plan

| Responsibility | Implementation |
| --- | --- |
| Public API and static recipes | `types.ts`: closed 42-name `IconName`, three `IconSize` presets, `IconProps`, explicit Controls tags, token-backed CVA |
| Glyph data | Internal `icon-paths.ts`: the 25 Foundation glyphs and 17 Lucide additions; never exported |
| Behavior and composition | `useIcon.ts`: descriptor selection, `cn()` merge precedence, native passthrough protection, decorative or non-empty-label mode |
| Rendering | `Icon.tsx`: SVG JSX and installed Radix AccessibleIcon; no new dependencies |
| Contract tests and examples | `Icon.test.tsx`, `Icon.stories.tsx`, docgen and registered Controls tests |
| Distribution | Folder/package barrels, explicit CSS scanning, export and packed-consumer checks |
| Attribution and discovery | System-wide Lucide notice, prop usage evidence and generated catalog/reference |

Six meaningful files plus the contract-named data module are present. **No stylesheet**: Icon is glyph content, not a Material surface; its approved appearance maps to existing token utilities. No tokens or dependencies change.

## Decisions and acceptance coverage

- **D1–D3, D8 / IC-01:** 42 closed glyph names, including `check`, `minus` and `plus`; Lucide mappings `grip-vertical`, `flask-conical` and `trash-2`; internal data ownership without a Lucide runtime dependency.
- **D4 / IC-04–IC-05:** decorative SVG by default; non-empty `label` uses Radix AccessibleIcon, with no manual image role or title. An empty label remains decorative.
- **D5 / IC-02–IC-03, IC-06:** token-backed 16/20/28px presets, currentColor stroke/fill, supported spacing-scale `size-*` and text-color overrides through `cn()`.
- **D6 / IC-06:** no public ref or `asChild`; geometry, paint and naming attributes remain component-owned.
- **D7 / IC-07:** no stylesheet; static utility emission is checked in built exports and packed consumers. The shared Lucide notice also covers Spinner's `loader-circle` path.
- **IC-08:** real docgen and registered Controls tests cover the required name enum, size enum, boolean fill, optional label and constant-only defaults. Browser widgets remain a separate check.

The prop registry reuses `icon-glyph-name` → `name`, `preset-dimensions` → `size`, `filled-glyph` → `filled` and `accessible-name` → `label`. Usages bind `IconProps` to its reviewed source-file hash; no global convention approval or migration is inferred.

## Batch Specs S1–S6

| Spec | Scope and evidence |
| --- | --- |
| S1 | Icon only: atom, issue #58, task T3; Gauge and other particles are not reimplemented |
| S2 | Rolling scheduling, commits and PR delivery remain parent responsibilities |
| S3 | Owner's final Storybook review remains pending; no server started here |
| S4 | No new token or dependency is needed; AccessibleIcon is already installed |
| S5 | Icon composes no unmerged system component; Spinner integration is separate |
| S6 | No stash, force push, push or CI claim; packed gates require both shared locks and the approved memory/timeout limits; DOM identity assertions use boolean comparison |

## Observed and pending verification

During resumed work, the focused Node test `UI preserves Lucide notices for the system icon paths` first failed because Spinner's source was absent from the notice, then passed after the attribution was generalized (1 test, 0 failures). The test also retains Lucide ISC and Feather copyright checks.

The focused Node export selection passed 3 tests (Icon CSS emission, system Lucide notices and decorative/labelled SSR) against the existing build, not a fresh build. All five generated consumer templates parsed successfully without writing fixtures. A focused Biome check passed for both package scripts after formatting corrections.

The earlier component commits describe a historical component RED/GREEN cycle; that cycle was not independently observed during this resume. Additional package-test edits extend existing tests rather than changing the component's runtime behavior. Fresh full gates, both packed React consumers and the parent's post-merge gates must be reported separately with observed results. The bounded writer did not execute build/cache generation outside its allowed edit surfaces or the packed harness's installation and deletion of temporary fixtures.

Visual conformity: **Not evaluated**. No comparable implementation capture or browser Controls review was performed; DOM metadata, static CSS checks and package tests do not establish pixel parity or browser widget behavior.
