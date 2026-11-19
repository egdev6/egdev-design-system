# Artifact extractor — resolve same-file class constants

Post-merge follow-up to Tabs v0.4 (PR #493). The `@egdev/system` artifact extractor records a CVA element that is an identifier (e.g. `tabsEdgeFade` in `packages/ui/src/molecules/tabs/types.ts`) as one unresolved class, so the published anatomy hides its real utilities and tokens. Branch `test/heading-fixture-timeout` (shared with the Heading timeout fix, before the release).

## Specs

- S1 — Root cause: `scripts/build-artifact.mjs:364` (`anatomyClasses` `visit`) pushes `{ className: item.getText(source), tokens: [], unresolved: true }` for any `ts.isIdentifier(item)`.
- S2 — Fix: when an identifier inside a class expression refers to a `const` declared in the same source file whose initializer is a string literal, a no-substitution template literal, or an array literal of those (nested arrays allowed), expand it exactly as if that literal were written inline. Anything else (imports, `let`, calls, templates with substitutions, other files, cycles) stays unresolved exactly as today.
- S3 — Regression tests in `scripts/design-system-artifact.test.mjs`: (a) the Tabs `tabsListVariants` anatomy no longer contains an unresolved `tabsEdgeFade` class; its utilities are all outside the visual-anatomy filter by design, so the expansion may be empty. (b) A synthetic fixture proves positive expansion: a same-file `const` (string and nested array) holding utilities the extractor already recognizes inline yields exactly the inline facts, while an imported identifier, a `let`, a call and a substituted template stay unresolved. No filter (mask-image, scroll-px) changes.
- S4 — Differential check: regenerate `packages/system/design-system.json` (`pnpm artifact --write`) and `packages/system/system.md` (`pnpm system:docs`); compare against the committed artifact semantically (by token name, component and class name, never by array index). Report every component whose facts change; only expansions of formerly unresolved same-file constants are acceptable, including unresolved-to-empty expansions.
- S5 — Owner decision (2026-11-19): "Arreglarlo ahora (recomendado)".

## Tasks

| ID | Specs | Task | Route | Commit |
|---|---|---|---|---|
| T1 | S1–S4 | RED test, extractor fix, regenerated artifact, differential report | worker | see L4 |

## Log

- L1 — Owner: "uno por uno" (work through the post-merge follow-ups in order), then chose "Arreglarlo ahora (recomendado)" for the extractor.
- L2 — Worker found S3 unsatisfiable: the extractor filters `mask-image` utilities by design. Parent corrected S3 (spec defect, not a scope change) and the regeneration command (`pnpm artifact --write`); extending mask extraction stays out of scope.
- L3 — Worker found that none of `tabsEdgeFade`'s 15 utilities pass the visual-anatomy filter even inline. Parent chose route B: S3 accepts an empty Tabs expansion plus a synthetic positive fixture; S4 allows unresolved-to-empty; no filter changes.
- L4 — Worker done (RED 2 failing → GREEN 34/34). Differential: Field `disabledPart`→∅, Link `plainLinkRecipe`→`pb-0`, Panel* `zoneGeometry`→`p-4`/`rounded-none`, Surface `sheen`→∅, Tabs `tabsEdgeFade`→∅, Textarea `well`→4 utilities; nothing else. Independent verify (Risk: item 3): pass, no blockers; pre-existing advisories: inline spread and property access drop silently (unchanged from baseline).
