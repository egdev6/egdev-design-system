# SectionHeader v0.1 implementation evidence

## Authority and approved plan

- Task: `odd/tasks/molecules-build.md`, T8, S1–S4; branch `feat/100-section-header`, base `origin/main` at `d428967`.
- Contract: [#100](https://github.com/egdev6/egdev-design-system/issues/100), v0.1, including every published comment. The [owner full-contract approval](https://github.com/egdev6/egdev-design-system/issues/100#issuecomment-6251551951) supersedes historical Draft/Pending identity wording, not substantive promises. No later amendment was present when inspected.
- Canonical payload SHA-256: `7511d99ecd7700e652a07e6f8040c44676f244dd945c9ddc2f0005acc48c4f7a`; frozen body SHA-256: `b1bf53f0f20564be0c0d9a388e88da1d72a99f3e5a0009bf27cc41f1420cf40f`; ordered history SHA-256: `c5a378b46cc6f7e9c40f48d944be7bbea7bda3c1b1afc856ddd998292a371ae7`.
- Separate implementation authorization: the parent directed full implementation of v0.1, with the six mandatory files, local CVA layout and per-part `cn()`, primitive composition, metadata, registry/catalogue and package-consumer checks. **No stylesheet**, extra internal module, direct Radix dependency, action slot or appearance API.
- **D7 token approval:** owner statement **“Aprobar el token tal cual”**, 2026-10-29, forwarded explicitly by the parent. This approves exactly `--breakpoint-section-header-split: 860px` in `packages/tokens/src/theme.css`'s `@theme static` block, associated count pins and packed consumer pin. This is an assistant record of the forwarded owner statement, not a native, signed or independent approval receipt. No other token or dependency change is included.
- Prerequisites inspected in the base: public Heading/Text and decorative Divider are already implemented. The fluid `--text-title-section` recipe already exists. The missing breakpoint was reported before any implementation, then explicitly authorized as above.

## Decisions implemented

| Decisions | Implementation |
| --- | --- |
| D1 | Separate editorial molecule, not PageHeader, with no actions or register axis. |
| D2, D5 | Stack by default; split without a non-blank lede and inline without a non-blank eyebrow resolve to stack. Optional blank parts create no nodes/placeholders; invalid blank title warns in development and renders nothing. |
| D3, D4 | Compose `Heading variant="section"` and `Text variant="eyebrow"`. Explicit `accentBreak=false` overrides Heading's true default. Main title/accent are forwarded verbatim without inserted separators. |
| D6 | Native header and h1–h6, default h2. Supplied non-blank titleId targets only the heading; root native id remains separate. No generated IDs, automatic region naming or description. |
| D7 | Static token breakpoint at width >=860px. Split uses one narrow column, 1:0.8 wide columns, bottom alignment, eyebrow spanning both, row gap 6 and column gap 12. |
| D8 | Native lede composes `text-body-muted`, secondary foreground, sans family and maximum `var(--bp-sm)` width. No copied clamp, 52ch measure or typography literal. |
| D9 | Forward canvas/raised tone only to Heading. No header Material paint or Surface identity. Raised story composes the existing Surface host. |
| D10 | Inline composes a horizontal decorative Divider. Radix supplies `role="none"`, not a semantic separator. Local placement never copies the gradient. |
| D11 | Retain `eg-section-head` and `eg-section-head__lede`. No legacy modifier classes or legacy title/eyebrow markers are emitted; legacy CSS remains unchanged. |
| D12 | Six meaningful files, no stylesheet/internal module, ref/asChild/children/actions/state/loading API. Compatible native attributes/listeners reach root only. Injected children/HTML are dropped. |

### Styling and merge limits

All utility classes are static CVA literals in `types.ts`, scanned explicitly by `compiled.css`; JSX contains composition only. Root className merges last for outer margins, width constraints and parent flex/grid placement. Part recipes also pass through `cn()`. Inner layout, gaps, typography and tone remain contract-owned; this is not arbitrary appearance-override permission or universal selector/layer precedence.

Divider's existing horizontal minimum is attribute-specific. Its supported width surface receives `data-[orientation=horizontal]:min-w-0` as well as `min-w-0`, so `cn()` removes the conflicting primitive minimum rather than leaving the higher-specificity 24px rule active. No primitive recipe is copied or changed. Radix Separator 1.2.0's installed `dist/index.mjs:20` supplies presentational `role="none"` for decorative rules; no custom ARIA or keyboard behavior is added.

Legacy root/lede rules are in the components layer; the new utilities are in the later utilities layer. Emitted CSS checks cover every local CVA utility, the 860px media condition and the lede recipe. DOM classes and emitted CSS do not prove legacy-loaded computed styles; browser verification remains pending.

## Naming, exports and documentation

Nine existing approved conventions gain reviewed `SectionHeaderProps` usages, with no changed meanings, approvals, aliases or exceptions:

- title → `heading-title`; eyebrow → `heading-eyebrow`; accent → `trailing-text-accent`;
- accentBreak → `accent-line-break`; lede → `section-lede`; variant → `visual-treatment`;
- level → `heading-level`; titleId → `heading-id`; tone → `surface-material-tone`.

Reviewed source: `packages/ui/src/molecules/section-header/types.ts`, whole-file SHA-256 `5726750a3c95049bf2262524f7d11d504774fd67f3b7d4409e49b9641b1d6f0c`. Native attributes and className are not invented own conventions. The immutable naming receipt tests exclude these post-receipt implementation observations; `pnpm props:docs` regenerates the view.

Public exports are exactly `SectionHeader`, `SectionHeaderProps`, `SectionHeaderVariant`, `SectionHeaderLevel`, `SectionHeaderTone`. Hook, native helper and all CVA recipes stay internal. Both exact package export inventories and the packed runtime key inventory include the approved names.

Storybook already discovers `src/**/*.stories.@(ts|tsx)`, including molecules; no duplicate registration is needed. Native header rows are added to the existing central docgen allowlist. Stories use `Molecules/SectionHeader`, real component autodocs and no manual argTypes/play: Default, Stack, Split, Inline, AccentBreak, MissingOptionalParts, HeadingLevels, Raised, RTL, LongContent. Default supplies only required title. Real extraction/enhancer tests verify nine controls, requiredness, defaults, complete enums and zero owned diagnostics. Enum order can depend on the TypeScript program; full rank membership is checked independently of ordering, while the generic pipeline test verifies preservation of extracted option order.

## Token arithmetic

One new static breakpoint: 211 + 1 = **212** utility declarations; 16 inline aliases and 55 root declarations unchanged; 282 + 1 = **283** total/compiled variables. Alias count stays 52; the original 168 values are preserved. Token source/compiled count pins and packed native pin are updated; no baseline fixture is rewritten.

## Test-first and validation

- RED: before implementation, the behavior suite failed to resolve the absent `./SectionHeader` module (one failed suite). This is an import-boundary failure, not a claim that individual assertions executed against a stub.
- GREEN: after implementing the hook/composition, all **21** behavior cases passed. Coverage includes six heading ranks, explicit whitespace/punctuation, accent layout, source order, split/inline fallback matrix, blank-title recovery, consumer useId relationships, root forwarding/layout isolation, presentational rule, passivity, long Unicode SSR and deterministic IDs.
- Triangulation: the inline rule also checks removal of Divider's conflicting attribute-specific minimum. Metadata tests exercise AST declarations, real parser output and the registered extraction/enhancement/inference pipeline. Initial metadata expectations exposed parser-dependent enum ordering; assertions now distinguish enum membership from preserved extraction order.
- Packed fixtures are extended for strict types/negative APIs, runtime inventory, SSR, CSR rerender/fallback and native/Tailwind CSS consumers. They are **not executed by this writer**, per the parent boundary.

### Observed commands

Commands ran in the foreground. Resource-intensive checks used the requested 2G scope; no full packed suite was launched.

| Exact command | Observed result |
| --- | --- |
| `gh issue view 100 --repo egdev6/egdev-design-system --comments` | All comments read; v0.1 approval, no subsequent amendment. Body retrieved separately with `--json body,comments` and a bounded leading-body query. |
| `codegraph status` | Not initialized. Initialization would write outside the delegated surfaces, so inspection used scoped reads. |
| `pnpm props:docs` | Generated reference refreshed successfully. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Generated both catalogue outputs, 110 rows. Bytecode disabled to avoid out-of-scope cache files. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm tokens` | Pass; compiled token artifact built. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:tokens` | Pass, 27 tests; 212/283 counts and exact 860px token. This script rebuilds tokens internally. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/section-header --maxWorkers=2` | Initial RED: absent component import. First GREEN: 21 passed. Final triangulation: **22 passed**, adding production-environment warning suppression and recognized min-width merge isolation. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/section-header packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2` | Final pass: 3 files / **249 tests** (21 behavior + 228 metadata); earlier test-only enum-order assumptions were corrected. The subsequently added 22nd behavior case passed separately. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm lint` | Pass, 382 files; earlier owned-file formatting findings corrected. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm typecheck` | Pass, root and workspace checks. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm props:check` | Pass, source-byte evidence and generated view current. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:props` | Pass, 87 tests; immutable naming receipts preserved. |
| `node --check scripts/package-consumption.test.mjs` | Pass; script syntax only, not generated fixture execution. |
| `timeout 900 systemd-run --user --scope -q -p MemoryMax=2G sh -c 'pnpm build && pnpm test:package-exports'` | Single build passed (UI CSS 252.78 kB, declarations emitted). Full exports run: **51/52 passed**. New lede assertion incorrectly expected a direct line-height reference rather than Tailwind's `var(--tw-leading, var(--text-body-muted--line-height, 1.6))`. Test matcher corrected; no production source changed afterward. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G node --test --test-name-pattern=SectionHeader scripts/package-exports.test.mjs` | **2/2 passed** after matcher correction, against the same built artifacts. Checks all local CVA utility emissions, exact 860px wide geometry, token lede metrics and native SSR/fallbacks. |

The single full exports gate was not repeated after the test-only correction, respecting the one-run instruction. The parent should rerun that full gate alongside its packed gates before delivery; this writer does not turn focused verification into a claimed second full-suite pass.

## Remaining independent evidence

- Packed React 18/19 consumption is for the parent to run; source fixtures are not execution evidence.
- No browser, server, watcher or CI run is claimed. Actual Controls widgets, accessibility tree/screen reader output, legacy-loaded computed styles, 859/860/861/1280px bounds, RTL/zoom/reflow and visual comparison remain **Not evaluated**.
- Both approved expected-design PNGs were read as source references, not compared with a new implementation capture. Approved expected-design identities remain VIS-01 `90fd6f7c0583142c7b162f6871b021834dd887cb9835ac0a64ce17361215d642` and VIS-02 `53c344d1b637eda529c1f3e7246703e5f8607255ca184e4e9ff351f696112786`. No new implementation capture replaces them; visual conformity is **Not evaluated**.
- No staging, commit, push, dependency installation or coordination-document edits by the writer.
