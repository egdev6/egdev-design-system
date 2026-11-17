# Panel band compact heading (#424)

Implement the APPROVED amendment `docs/components/panel/v0.3/band-heading-amendment.md` (on main since #442; every open decision resolves to its **Recommended** option, see its "Approval" section). Text v0.2 (#443) and SectionHeader v0.2 (#447, which factored `textBodyVariantClasses`) are on main. Branch `feat/panel-band-heading` (worktree `../eds-wt-i`), one PR, Closes #424. Last item of milestone #15.

## Specs

- S1: Heading gains `variant='compact'` (in `packages/ui/src/primitives/text/`): `headingRootClasses = { ...titleRootClasses, compact: 'text-heading-small' }` used by `headingVariants` (shared base `m-0 font-display uppercase wrap-break-word` unchanged); a `foreground` variant reusing a factored shared `textForegroundClasses` constant (`satisfies Record<TextForeground, string>`, Text behaviour unchanged). `TitleVariant`/`TextVariant` untouched; private `HeadingVariant`. `HeadingVisualProps`: third branch `{ variant: 'compact'; foreground?: TextForeground; tone?: never; accent?: never; accentBreak?: never }`; existing branches get `foreground?: never`; English JSDoc with `@control` (and `@default inherit` only on the compact branch).
- S2: `useHeading.ts`: `'compact'` in the variant list; destructure `foreground` for every variant so it never reaches the DOM; compact ignores tone/accent, invalid foreground → `inherit`; other variants unchanged. `Heading.tsx` unchanged. Panel props unchanged: the compact heading composes inside `PanelHeader` (caller-owned heading association).
- S3: Token pairing: `text-heading-small` metrics with the display font (approved closest-token substitution; no new tokens). Record in the evidence that the parent reviews the visual result in captures.
- S4: Tests first (RED before GREEN), via the public interface: compact h1–h6, ids, text, default level unchanged; two `useId` regions in one Panel; class set = base + `text-heading-small`; all seven foreground mappings, `inherit` adds no color class; type negatives (compact with tone/accent; section with foreground); untyped values not forwarded; existing Heading class hashes and Panel markers unchanged; docgen/controls (`compact` variant listed; Heading `foreground` select with default `inherit`; update counts); packed consumer (HeadingProps fixtures, `@ts-expect-error` negatives, shipped CSS `.text-heading-small` with its size/line-height/weight/tracking variables).
- S5: Stories: Heading `Compact`, `CompactForeground`; Panel `CompactBandHeading` (banded surface-1/overlay/inherit, `useId` region, RTL); no argTypes/play.
- S6: Registry: scoped exception `exception:surface-material-tone:Heading:foreground` (shape like Text's), approval record `docs/components/panel/v0.3/heading-foreground-exception-approval.json` chained after the latest receipt in `scripts/prop-naming.test.mjs`'s receipt chain if the test requires it (pin the previous receipt's whole-file SHA-256), refresh Heading/Text whole-file revisions, `pnpm props:docs`. Artifact: add role `['Heading compact', ...]` in `scripts/build-artifact.mjs` with an assertion in `scripts/design-system-artifact.test.mjs` (family `--font-display`, size `--text-heading-small`); `pnpm artifact --write && pnpm system:docs`. Catalog notes (Text/Heading and Panel rows) + `build_catalog.py`. Evidence `docs/components/panel/v0.3/implementation.md` with the amendment SHA-256.
- S7: No stylesheet, no new module, no new tokens, no dependencies.

## Tasks

| ID | Specs | Route |
| --- | --- | --- |
| T1 | S1–S7 | gentle-ai-worker |
| T2 | S1, S3 | parent: Chrome/Edge/Firefox computed metrics inside a banded Panel, RTL; captures |
| T3 | all | parent: full checks, PR, CI, merge |

## Log

- L1: Plan by explorer, approved by the parent applying recommendations (owner delegation in odd/tasks/milestones-1-2-delivery.md L1 of the main worktree). Lesson from #444: new approval receipts must pin the previous receipt in the chain; run `pnpm test:props` before reporting.
- L2: Parent browser check (Chrome/Edge/Firefox): compact metrics, unique ids, region labels, RTL, foregrounds; token pairing reviewed visually and accepted; capture recorded.
