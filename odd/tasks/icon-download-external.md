# Icon download + external-link glyphs (#423)

Implement the approved Icon v0.3 amendment `docs/components/icon/v0.3/download-external-amendment.md` (Approved 2026-11-16). Branch `feat/icon-download-external` (worktree `../eds-wt-a`), one PR, Closes #423. Roadmap #427, milestone #14. Delivery rules: parent tracking doc `odd/tasks/milestones-1-2-delivery.md` in the main worktree (owner: apply the parent's recommendations; merge green PRs).

## Specs

- S1: Add exactly two glyphs to the closed Icon set: `download` and `external-link` (owner: "external-link", not `external`), following the existing glyph authoring convention in `packages/ui/src/atoms/icon` (same source family/stroke/viewBox as the current set, e.g. Lucide-derived paths if that is the convention), typed members of the public icon-name union, decorative by default and labelled when the existing Icon API provides a label.
- S2: Update everything that enumerates the closed set: `scripts/catalog_data.py` (icon set list), generated catalog outputs (`python3 scripts/build_catalog.py`), Icon stories (the gallery shows both), docgen/controls tests and package tests that assert the set or its size, and the system artifact if `pnpm system:check` reports it stale (`pnpm artifact --write` then `pnpm system:docs`).
- S3: Out of scope: the md 20px vs 16px discrepancy (#428); any other glyph; token changes.
- S4: Tests first (RED before GREEN): both names render an SVG with the set's conventions (viewBox, stroke via currentColor, aria-hidden when decorative, accessible name when labelled); the type union accepts both and rejects `external` (`@ts-expect-error` in package consumption); set-size assertions updated; existing icons unchanged.
- S5: Registry: refresh whole-file source revisions for any changed file referenced by `skills/_shared/prop-naming.json`; `pnpm props:docs && pnpm props:check && pnpm test:props`.
- S6: Evidence doc `docs/components/icon/v0.3/implementation.md` recording the plan decisions taken (glyph source/provenance, naming), the amendment content SHA-256, checks and the browser verification placeholder for the parent. No stylesheet, no new module, no tokens, no dependencies. English artifacts.

## Tasks

| ID | Specs | Route |
| --- | --- | --- |
| T1 | S1–S6 | gentle-ai-worker |
| T2 | S1 | parent: Chrome/Edge/Firefox render check + capture |
| T3 | all | parent: full checks, PR, CI, merge |

## Log

- L1: Spec decisions (odd/tasks/nexo-adoption-m1-specs.md L5): "external-link"; size discrepancy "Issue aparte" → #428; visual validation in the PR.
- L2: Parent: built tokens in the worktree (missing dist made two preview-CSS suites fail, unrelated to icons); focused suite 676/676. Browser check (Chrome/Edge/Firefox gallery) passed; capture recorded in implementation.md.
