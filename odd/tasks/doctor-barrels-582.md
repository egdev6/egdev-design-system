# #582 — DS046/DS047 see design-system components imported through a local barrel

Branch `feat/doctor-barrels-582`. Issue egdev6/egdev-design-system#582, found while cataloging #580. Gates: spec amendment
and plan approved by the owner → test-first implementation → independent verification → PR → release (cli minor).

## Specs

- S1 — #582, verbatim: "A consumer that re-exports the design system through a local barrel, as egdev-website does with
  `@/components/egdev-ui`, hides those components from DS046 (appearance classes) and DS047 (internal-structure
  selectors)." … "The guards treat components imported through a local re-export of `@egdev/ui` or `@egdev/effects` the
  same as direct imports, or `doctor` reports the barrel so the gap is visible." Owner mechanism choice, verbatim:
  "B + C (Recomendado)": follow named re-exports syntactically, and warn (DS049) about what cannot be followed.
- S2 — Barrel. A non-test `.ts` or `.tsx` file under `sourceDirectory`, honoring `exclude`, with at least one value
  re-export from `@egdev/ui` or `@egdev/effects`. A followable re-export is a named specifier,
  `export { X } from '@egdev/ui'` or `export { X as Y } from '@egdev/ui'`; a type-only declaration or specifier is
  ignored. The barrel maps each exported name (`Y`, else `X`) to `{ exportName: X, packageName }`.
- S3 — Import resolution, one hop and without TypeScript module resolution. An import specifier in a scanned non-test
  `.tsx` file reaches a barrel when it resolves to the barrel's file:
  - relative (`./`, `../`), from the importing file;
  - or matched by `compilerOptions.paths` in `<project>/tsconfig.json` (JSON with comments and trailing commas), relative
    to `compilerOptions.baseUrl` or the tsconfig directory; `*` wildcards substitute as TypeScript does; targets are tried
    in order. `extends` is not followed; a missing or unreadable tsconfig adds no paths and no finding.
  - The candidate is tried as written, then with `.ts`, `.tsx`, `/index.ts` and `/index.tsx`.
- S4 — Ownership through a barrel. Named (`import { Button }`), aliased (`import { Button as B }`) and namespace
  (`import * as UI` with `<UI.Button>`) imports of a barrel name become owners exactly as direct imports of the mapped
  `exportName` and `packageName` do today: DS046 checks them with that package's `classNameAllows`, DS047 treats
  `@egdev/ui` owners as structural, and shadowing, type-only and default-import rules are unchanged. A name the barrel
  does not re-export from `@egdev/*` (including its own wrappers) is not an owner. Findings, allowlist matching and
  stale entries for DS046 and DS047 behave as for direct imports. DS040, DS041 and DS048 are unchanged.
- S5 — DS049, warning: a barrel the guard cannot follow, so DS046 and DS047 do not check what it re-exports. One finding
  per barrel file when it has an unfollowable value re-export from `@egdev/ui` or `@egdev/effects` (`export *`,
  `export * as NS`, or a local re-export of an imported binding such as `import { X } from '@egdev/ui'; export { X }`),
  or when no scanned import resolves to it (S3). Not allowlistable; `--fail-on-pending` does not change it. Exact text
  and JSON are fixed in the plan from the existing finding format.
- S6 — Release: `@egdev/cli` minor (0.7.0), changelog cites `(#582)` and warns that apps importing through a barrel can
  see new DS046/DS047 errors. Spec §8 and the CLI README document S2–S5.

## Tasks

| ID | Specs | Task | Route | Status | Commit |
|---|---|---|---|---|---|
| T1 | S1–S6 | Spec amendment and plan; owner approval | inline + owner | Done (L4) | this branch |
| T2 | S2–S5 | Test-first implementation, docs, independent verification | worker + verifier | Done (L5–L6) | this branch |
| T3 | S6 | PR, owner merge, release, close #582, notify the website | inline | pending | pending |

Risk: item 3 — consumers that import through a barrel get new DS046/DS047 findings; shared owner collection feeds both.

## Log

- L1 — Owner request, verbatim: "sigue con 582".
- L2 — Read-only exploration (task mx08vgqe-1-e7v6): owner resolution is `GUARDED_PACKAGES.includes(specifier)` at
  `packages/cli/src/appearance-guard.mjs:580` inside an in-memory `noResolve` program (`:542`); DS048 does not share it.
  egdev-website imports every DS component through `src/components/egdev-ui.ts` (about 90 named re-exports, no
  `export *`, `'use client'`) and `src/components/egdev-effects.ts`, aliased by `tsconfig.json` `"@/*": ["./src/*"]`;
  only `*.test.tsx` files import `@egdev/*` directly, so DS046/DS047 check nothing there today. No tsconfig reader
  exists in the CLI. DS049 is free.
- L3 — Owner mechanism choice, verbatim: "B + C (Recomendado)".
- L4 — Owner answers, verbatim: "Aprobar (Recomendado)" for S2–S6, and "Mantener (Recomendado)" for the DS049 trigger
  on a barrel no scanned import reaches.
- L5 — T2 worker (mx0asorz-2-9wao): new `packages/cli/src/barrels.mjs`; doctor reads `<project>/tsconfig.json` with
  `ts.parseConfigFileTextToJson` and passes `pathMappings` to the guard as data. RED 22/26 failing, GREEN 26/26; CLI suite
  258 → 284; typecheck and lint exit 0; differential check against the base on 700 barrel-free guard cases and doctor
  fixtures: 0 mismatches. DS049 text: `DS049 warning <file>[:<line>]: Barrel not followed (<reasons>): DS046 and DS047 do
  not check what it re-exports; <fixes>.` Reasons: each unfollowable re-export statement and/or `no scanned import
  resolves to it`. Interpretations: a type-only or side-effect import reaches a barrel; `export default X`/`export = X` of
  an imported binding is unfollowable; `baseUrl` without a matching `paths` entry resolves nothing. Existing ds040 fixtures
  now write the website's `"@/*"` tsconfig so their barrel is reached. Parent spot check: 284/284.
- L6 — Independent verification (mx0c2cf6-3-2cf9): S2, S3, S4, S5, S6 docs and PRESERVE pass; no blockers. CLI 284/284,
  typecheck and lint exit 0. Base vs working tree on 18 barrel-free doctor runs (text, `--json`, `--fail-on-pending`):
  byte-identical. egdev-website, read-only: identical doctor findings on base and branch, no DS049 (both barrels reached
  through `@/*`); in-process, the only new owner match is `.home-isotipo-anchor` on `HomeTemplateAnchor`, which the effects
  `classNameAllows` accepts (`aspect-ratio`). L5 interpretations judged consistent with S3/S5. Its three probes were added
  to `packages/cli/tests/barrels.test.mjs` (19/19).
