# SectionHeader v0.2 implementation evidence

## Authority and scope

- The [approved multilingual amendment](multilingual-amendment.md) and `odd/tasks/section-header-multilingual.md` T1/S1–S7 authorize this change. The amendment's canonical UTF-8 payload from `## 1. Purpose and scope` through its final LF has SHA-256 `fe21d6f6a6c86748b1eef0a66f16a096a296b00d5203b2ce0366c51fa132c97c`; the whole file has SHA-256 `9305a9d65963e4e341c15f28f62ac50f0ed49cef76ff43091d9403954a71f7e7`. The approval section supersedes historical Pending tracking language in the header.
- The existing SectionHeader v0.1 promises remain in force except where amended. Text v0.2 supplies the body/lede recipe; this transaction adds no stylesheet, component-internal module, token or dependency. This record is not independent review or visual approval.

## Implementation and decisions

`title`, `eyebrow` and `lede` accept strings or readonly ordered text tuples. Invalid untyped tuples are skipped; the remaining content needs non-decorative, non-blank text to be present. Each run keeps its caller-supplied whitespace, optional native language and optional decorative `aria-hidden`; a run-array eyebrow has one unstyled wrapper inside the existing flex eyebrow. The root's native language and direction remain consumer-owned. An untyped non-string accent or heading ID is also safely omitted.

The lede composes `Text variant='lede' foreground='secondary'` with the existing layout/part marker, adding `eg-text`. It keeps the old paragraph and token recipe, but the additive marker can match consumer CSS. Existing string callers continue to render without run wrappers. Downstream readers of the widened copy props must narrow the union before using string methods.

The named `textBodyVariantClasses` preserves Text's runtime recipe. Artifact extraction follows the named map for both typography roles and existing flattened/anatomy facts; the SectionHeader lede role still resolves sans and body-muted tokens. The three changed usage types reuse `heading-title`, `heading-eyebrow` and `section-lede`; all SectionHeader and Text/Heading source hashes were refreshed without changing a naming convention or approval. The older Text exception receipt remains immutable and is tested against its historical source hash. Catalog and system outputs were regenerated from their existing generators.

`Multilingual` demonstrates Spanish/English and a decorative slash in stack, split and inline without manual argTypes or play. Its union-valued own copy props have disabled, documented controls; `accent` and `titleId` remain text controls.

## Observed checks

- **RED:** before implementation, `pnpm exec vitest run packages/ui/src/molecules/section-header packages/ui/src/primitives/text packages/ui/src/lib --maxWorkers=2 --no-cache --configLoader runner` exited 1: 17 failed and 674 passed. Arrays and malformed non-strings threw on `trim`; the lede lacked `eg-text`; docgen and Controls still exposed text controls.
- **GREEN and preservation:** the same command finally exited 0: 694 passed across 37 files. It covers tuple validation and ordering, omission/fallbacks and recovery, six ranks, SSR, native language/direction, string markup, lede composition, source type negatives, the exact packed TypeScript fixture checked in memory against the public source barrel, real docgen and installed Controls. The production CSS entry was compiled in memory with `write: false`; emitted lede typography/color and the 860px layout rule were found. Existing Text and Heading tests, including prior class-hash checks, passed. An intermediate run exposed an invalid Heading union type, outdated Controls inventory and a jsdom accessible-name limitation; the type and inventory were corrected.
- `pnpm typecheck`: exit 0 for root and all workspace typechecks, after correcting two test-only TypeScript diagnostics.
- `pnpm exec biome check` on the changed supported source, test, registry and catalog JSON files: exit 0 after formatting corrections. Generated minified system JSON, Markdown and Python are not represented as formatted by Biome.
- `pnpm props:docs && pnpm props:check && pnpm test:props`: exit 0; 123 tests passed, including current whole-file source evidence and the immutable historical receipt.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py`: exit 0; 115 rows generated.
- `pnpm artifact --write && pnpm system:docs && pnpm system:check`: exit 0. `node --test scripts/design-system-artifact.test.mjs`: exit 0; 31 tests passed, including the lede typography role and preservation of the factored Text body map.

## Remaining verification

Packed-consumer fixtures now include both type exports, positive runs, object/four-tuple/numeric-language negatives, explicit narrowing, SSR spans and shipped `text-body-muted` CSS. They have **not** been executed in this worker. The authorized `pnpm build && pnpm test:package-consumption && pnpm test:package-exports` writes package `dist`/compiled outputs outside the delegated edit surfaces and the consumption fixture installs dependencies; the parent owns that build and React 18/19 packed matrix. The full `pnpm test` is also parent-owned. In-memory CSS compilation is not packed-consumer evidence.

In this installed jsdom/dom-accessibility-api version, each inline span's accessible-name contribution is trimmed, producing `HotelHotel` for the amendment's `Hotel / Hotel` example even though the DOM preserves spaces and the decorative span is hidden. Unit tests therefore assert ordered meaningful content and separator exclusion without claiming exact AX spacing. This is not proof of actual browser behavior and must not be silently treated as the specified `Hotel Hotel` accessible name.

The parent must inspect real DOM and accessibility trees in Chrome, Edge and Firefox, including exact heading/region names and accent spoken once, language inheritance/overrides, mixed scripts and decorative slash handling. Compare string and run eyebrow spacing and lede computed font, size, weight, line height, color and width with legacy and consumer CSS loaded, including the new `eg-text` marker. Check 859/860/861px, narrow and long text, RTL and 200%/400% zoom/reflow; inspect actual Storybook Controls and capture implementation images with provenance. Expected-design references remain pending. Visual conformity: **Not evaluated**.

## Parent browser verification (2026-11-17)

Storybook `molecules-sectionheader--multilingual` (stack, split, inline), Chrome 157 (Playwright MCP + CDP accessibility tree). No defects.

| Check | Result |
| --- | --- |
| Heading accessible name from the browser AX tree keeps inter-run spacing and excludes the decorative separator: `DISEÑO DESIGN` (uppercase comes from the heading's existing `text-transform`, unchanged by this work) | Pass (jsdom trims inline spans to `HotelHotel`; the browser does not) |
| Each title run is a `span[lang]` (`es`, `en`); the separator span has `aria-hidden="true"` | Pass |
| Lede is a `<p>` with `eg-text` + `eg-section-head__lede`, `text-body-muted` (16px) and `text-fg-secondary` | Pass |
| Stack, split and inline layouts render the runs without overlap | Pass |

Edge and Firefox AX names were not evaluated (Firefox automation cannot read its AX tree here); RTL, zoom and forced colors were not evaluated.

| Capture | SHA-256 |
| --- | --- |
| `captures/multilingual-chrome-1000.png` | `34d55feaea0858b2fd0b9ed1497f9a65a695a6802ad0ddabced96e850902a178` |
