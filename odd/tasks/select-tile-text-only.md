# SelectTile text-only (#413)

Implement the approved SelectTile v0.3 amendment `docs/components/select-tile/v0.3/text-only-amendment.md` (Approved 2026-11-16) per the owner-approved plan below. Branch `feat/select-tile-text-only`, one PR, Closes #413. Roadmap #427, milestone #14. Reference evidence/flow: Carousel v0.2 and Field v0.4 implementation docs.

## Specs

- S1: `variant` is mode-dependent with inline unions (owner: "No, union inline por modo"; no new export): single branch `variant?: 'default' | 'text-only'`, multiple branch `variant?: 'default'` (ModuleCard precedent), each with English JSDoc and `@control select`; `@default default` only on the single branch, the multiple branch describes its default in prose (L2: docgen concatenates branch tags; Surface/ModuleCard precedent). `thumb`/`ratio` JSDoc state they are ignored in text-only and that `thumb` warns in development. `useSelectTile.ts` destructures `variant = 'default'` so it never reaches the root; `textOnly = single && variant === 'text-only'` (an untyped multiple + text-only falls back to default).
- S2: Text-only renders no media: no image, no AspectRatio wrapper, no fallback, no media well. Card CVA `text-only`: `gap-1 p-3 pe-7 justify-center min-h-14` (44.8px; `min-h-11` is only 35.2px in this system — L2, cf. #431) (pe-7 clears the inline-end check, logical so it mirrors in RTL); meta drops `pb-1`; label unchanged (`wrap-anywhere`). Never use `last:`/`:last-child` (Radix hidden native input).
- S3: Badge in text-only is inline after meta (owner: "En línea después del meta"): `self-start px-1 pointer-events-none`, DOM order label → meta → badge matching `aria-describedby`; `live` semantics unchanged. Default variant keeps the absolute badge.
- S4: Development-only warning when any option supplies `thumb` with text-only: `console.warn('SelectTile: thumb is ignored when variant is "text-only" (options: <values>).')`, emitted from an effect keyed on the offending option set (once per mount/change, not per render), guarded by `typeof process === 'undefined' || process.env.NODE_ENV !== 'production'`, never throws, no warning during SSR; `ratio` alone never warns; default variant never warns.
- S5: Tests first (RED observed before GREEN), via the public interface: text-only renders label/meta/badge/check without img/aspect wrapper/fallback, DOM order label → meta → badge; warning spy (exactly one call with the option values, none on rerender, none for ratio only, none with `NODE_ENV=production` via `vi.stubEnv`, none for default with thumb); keyboard/form/controlled/disabled/RTL parameterized over both variants in single mode; check classes present, text-only badge not absolute; preservation: existing tests unedited, untyped multiple + text-only still renders media, `variant` not on the root.
- S6: Docgen/controls (`storybook-docgen.test.ts` SelectTile mode-dependent block: own props count, `variant` default, story names; `storybook-controls.test.ts`: select with options ⊇ default/text-only), package consumption (positive single text-only sample; `@ts-expect-error` for multiple + text-only and for `variant: 'compact'`; SSR text-only sample without img), package exports (built CSS has the text-only utilities; SSR no img). Stories `TextOnly`, `TextOnlyNarrow` (`grid-cols-1 w-48`, unbroken long label), `TextOnlyRTL`; no thumbs in text-only stories; no argTypes/play.
- S7: Registry: append a SelectTile usage to the existing `visual-treatment` convention (no new approval record needed); refresh all SelectTile whole-file revisions; regenerate with `pnpm props:docs`.
- S8: Catalog row (`scripts/catalog_data.py`) mentions v0.3 text-only (single only, no media); regenerate both outputs. Evidence doc `docs/components/select-tile/v0.3/implementation.md`; record the amendment content SHA-256 there.
- S9: No stylesheet, no new module, no tokens, no dependencies. English artifacts.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1–S9 | gentle-ai-worker | — |
| T2 | S2–S3 | parent: Chrome/Edge/Firefox checks + captures | — |
| T3 | all | parent: full checks incl. package consumption, commit, PR | — |

## Log

- L1 (owner, verbatim choices on the plan): "En línea después del meta"; "No, union inline por modo"; "Aprobar e implementar". Earlier spec decisions (odd/tasks/nexo-adoption-m1-specs.md L5–L6): single mode only; thumb ignored with a dev warning; `ratio` alone does not warn.
- L2: Worker found (a) react-docgen-typescript concatenates `@default` tags from both union branches (`default\ndefault`) — resolved per Surface/ModuleCard precedent: tag on the single branch only; (b) `min-h-11` = 35.2px, short of the amendment's 44px — text-only cards use `min-h-14` (44.8px). Both are implementation corrections within the approved spec, not new decisions.
- L3: Browser checks (Chrome/Edge/Firefox, 640 and 320px) found no defects: min height 44.8px, no media in text-only, text never intersects the check in LTR/RTL, no overflow, order label → meta → badge, click selects. Captures in docs/components/select-tile/v0.3/implementation.md.
