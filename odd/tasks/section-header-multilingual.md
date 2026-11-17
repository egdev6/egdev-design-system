# SectionHeader multilingual runs (#417)

Implement the APPROVED amendment `docs/components/section-header/v0.2/multilingual-amendment.md` (on main since #442; every open decision resolves to its **Recommended** option, see its "Approval" section). Text v0.2 (#396, body/lede + `foreground`) is on main since #443. Branch `feat/section-header-multilingual` (worktree `../eds-wt-h`), one PR, Closes #417.

## Specs

- S1: Types: export `SectionHeaderTextRun = readonly [text: string, lang?: string, decorative?: boolean]` and `SectionHeaderText = string | readonly SectionHeaderTextRun[]` (from the component index and `packages/ui/src/index.ts`); `title`, `eyebrow`, `lede` become `SectionHeaderText` with `@control false` + concrete `@controlReason`; `accent` and `titleId` stay strings.
- S2: `useSectionHeader.ts`: normalize unknown input (string, or valid runs: array length 1–3, string text, string|undefined lang, boolean|undefined decorative; malformed entries skipped); "readable" = at least one non-decorative run with non-blank text; replaces the current blank checks; the development warning and the split/inline → stack fallback stay; untyped non-strings no longer throw.
- S3: `SectionHeader.tsx`: strings render as today; each run renders a `<span>` with `lang` only when the entry provides it (empty string forwarded) and `aria-hidden="true"` only when decorative; eyebrow runs wrapped in one unstyled span; the lede renders `<Text variant='lede' foreground='secondary' className={ledeClassName}>` (adds `eg-text`), and `sectionHeaderLedeVariants` keeps only layout/marker classes (`eg-section-head__lede min-w-0 max-w-[var(--bp-sm)]` + split/inline variants).
- S4: Artifact: the "SectionHeader lede" typography role in `scripts/build-artifact.mjs` read its classes from `sectionHeaderLedeVariants`; extract Text's inline body variant map into a named `textBodyVariantClasses` (in `packages/ui/src/primitives/text/types.ts`, behaviour unchanged) and point the role at it so `scripts/design-system-artifact.test.mjs` keeps `--font-sans`; regenerate (`pnpm artifact --write && pnpm system:docs`).
- S5: Tests first (RED before GREEN), via the public interface: AC-01 runs render in order with exact whitespace and per-run `lang`, eyebrow runs share one wrapper, string markup unchanged; AC-02 accessible heading name excludes decorative runs, accent read once; AC-03 empty/whitespace/decorative-only/malformed title → warning, no header (dev and prod), rerender recovers, eyebrow/lede omitted with stack fallback; AC-04 levels/ids/SSR equality unchanged, root lang/dir inherited, run overrides; AC-05 lede is a `<p>` with `eg-text` + `eg-section-head__lede` and the Text lede/secondary classes; docgen/controls (`title`/`eyebrow`/`lede` controls false; `Multilingual` story listed); packed consumer (positive runs, `@ts-expect-error` for objects, 4-tuples, numeric lang; narrowing sample; SSR spans with lang/aria-hidden; CSS still ships `.text-body-muted`).
- S6: Story `Multilingual` (es/en, decorative `/`, stack/split/inline); no argTypes/play. Registry: refresh SectionHeader (and Text, if its file changed) whole-file revisions; no new convention. Catalog note + `build_catalog.py`. Evidence `docs/components/section-header/v0.2/implementation.md` with the amendment SHA-256.
- S7: No stylesheet, no new module, no tokens, no dependencies.

## Tasks

| ID | Specs | Route |
| --- | --- | --- |
| T1 | S1–S7 | gentle-ai-worker |
| T2 | S3 | parent: Chrome/Edge/Firefox lang in DOM/AX, mixed scripts, eyebrow spacing, lede computed style; captures |
| T3 | all | parent: full checks, PR, CI, merge |

## Log

- L1: Plan by explorer, approved by the parent applying recommendations (owner delegation). #424 runs after this PR (shared Text/artifact/registry files).
- L2: Parent browser check (Chrome AX tree): name 'DISEÑO DESIGN' with spacing kept and decorative separator excluded; per-run lang; lede classes; capture recorded.
