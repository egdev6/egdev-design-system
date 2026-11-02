# NowCard v0.1 — badge-order plan amendment (docs only)

- **Status:** Proposed. Companion to [badge-order-amendment.md](badge-order-amendment.md); both require owner approval before any runtime change. This document amends the approved implementation plan without editing it: the approved plan file stays byte-identical (`sha256:083ac7c83362656325b1fda1c8f904baa9ca4afb56e2a9cb5f226af95d9131b9`, verified against `docs/components/web-catalog/v0.1/layer-c-plan-approvals.md`).
- **Baseline (Unit A as implemented, uncommitted, staged in the worktree):**

| File | sha256 (whole file) |
| --- | --- |
| `packages/ui/src/molecules/now-card/types.ts` | `568d0b2f3221b2fa977eab8e82d03cbcc7bbcecdba9b6c37e5752bc8abcc30a2` |
| `packages/ui/src/molecules/now-card/useNowCard.ts` | `8c4c9320687bcbb14b25fcdaee4cff41b65205927df5415b487889b9c69402e6` |
| `packages/ui/src/molecules/now-card/NowCard.tsx` | `57f62c5a38191dc07e90cc4ef8ad62c82510223ae7cdf908c67201b82034dd2a` |
| `packages/ui/src/molecules/now-card/NowCard.test.tsx` | `81d383cc1a7af18ae1d593763e340f3acc80aa510689d9e01dfcca781fc251dd` |
| `packages/ui/src/molecules/now-card/NowCard.stories.tsx` | `6cee4f3be310649cedbccee25be0f8f734385e839af75b541ba9a5de713c4c06` |
| `packages/ui/src/molecules/now-card/index.ts` | `fb9835e4c7baca3d56ea1bb32248e1e580d13672f98bdb46bae76fe4b36cf5f6` |

Baseline observed checks (this worktree): focused Vitest 15/15 passed (`--maxWorkers=2`); targeted Biome clean (exit 0). Parent-reproduced `tsc` failure: `NowCard.test.tsx` line 268 (`role: 'region'` inside the `useNowCard` object literal) — `role`, `tabIndex`, `aria-*` are `Omit`-ted from `NowCardProps`, so the literal fails the excess-property check. Unit A is therefore **partial**: badge order, sm body step and this compile failure remain.

## 1. Exact smallest API change

One added optional prop on `NowCardProps` — nothing else in the public API moves:

```ts
/**
 * Optional consumer-supplied non-interactive status node, typically a Badge composition,
 * rendered before the heading as the card's first content. Absent/null/boolean renders nothing.
 * No interactive descendants, no baked-in status word, no tone ownership.
 * @control false
 * @controlReason ReactNode is not serializable; see Default and WithBadge for status compositions.
 */
statusBadge?: ReactNode;
```

- Registry: new concept proposal `leading-status-badge` (name `statusBadge`), status `proposed`, `approval: null` — lookup evidence and rejected candidates in the amendment doc §3. The implementation task edits `skills/_shared/prop-naming.json` only after owner approval of the convention, appends the usage with `source.revision = sha256:<post-amendment types.ts whole-file hash>`, regenerates the view and runs `pnpm props:check` + `pnpm test:props` (registry JSON, generated view, exports line, docgen/controls and catalog rows remain parent-owned).
- No part props change; `NowCardBody` JSDoc content rule becomes "copy only" via its own description.

## 2. Recipe changes (types.ts / hook)

- New marker recipe: `nowCardBadgeVariants = cva('eg-now-card__badge flex px-6 pt-6 pb-3')` — `pb-3` (12px) approximates the web's 14px pill→title gap through `--space-3`; spacing utilities are the owner choice A3 in the amendment doc §7.
- `useNowCard` result gains `badge: ReactNode` and `showBadge` (`present()`-style: not undefined/null/boolean, mirroring `useModuleCard`).
- `NowCard.tsx` renders inside the `article`, before the heading: `{showBadge && <span {...badgeProps}>{badge}</span>}` — the node is rendered verbatim, no `aria-hidden` (the Badge is meaningful readable content, unlike `ModuleCard`'s decorative icon wrapper).
- Body sm step: `nowCardBodyVariants` size `sm` becomes `'p-4 text-body-default'` (owner choice A2; md unchanged).
- Nothing else changes: no stylesheet, no token, no dependency, no hover/motion utilities, no `data-state`, no reordering machinery.

## 3. Test-first sequence (RED before GREEN, focused Vitest `--maxWorkers=2`)

| Step | Change in `NowCard.test.tsx` | RED assertion (fails on current code) |
| --- | --- | --- |
| A1 | `fullCard` fixture moves the Badge from `NowCardBody` to `statusBadge`; NC-A1 test: `article.firstElementChild` is the badge and precedes the heading (`compareDocumentPosition`) | Badge currently renders after the heading (inside body) → order assertion fails |
| A2 | NC-A2: no tab stop with slot-only badge; omitted/null/boolean slot leaves no `.eg-now-card__badge` wrapper | `showBadge`/wrapper do not exist → fails |
| A3 | NC-A3: sm body has `text-body-default` + `p-4`, full copy visible | Current sm body keeps `text-body-large` → fails |
| A4 | NC-A4 boundary fix: replace the raw object literal with a fixture typed `ComponentPropsWithoutRef<'article'> & { title: string }` (the real pre-narrowing native surface a JS consumer can pass) passed through one cast to `NowCardProps`, with a written English reason comment ("simulates the untyped/JavaScript boundary the hook strips protected semantics at") — a single documented cast, not an unprotected literal, not `any`, not a blanket suppression | `tsc`/`pnpm typecheck` currently fails at line 268 → compile evidence is the RED/GREEN here; runtime stripping assertions unchanged and still pass |
| PRESERVE | Existing suite otherwise unchanged; heading rank, banded footer, detail, wrap, passivity, box-border and context-fallback cases stay green. Stories: `Default`/`WithBadge` use the slot; `Sizes` badge moves to the slot; a copy-only body example remains | Expected green after GREEN step; any unrelated red is a regression to fix before handing back |

GREEN order: `types.ts` → `useNowCard.ts` → `NowCard.tsx` → stories → focused Vitest green → targeted Biome clean → `pnpm typecheck` (parent-scheduled, must now pass) → parent Unit B integration unchanged from the original plan (§7–§9 of the approved plan).

## 4. Stories (English, no manual argTypes, no play)

`Default`, `WithBadge` (slot + `Icon` example), `WithLink`, `WithNextDate`, `WithSingleChild`, `Sizes`, `HeadingRanks`, `LongContent`, `ReducedMotion` — descriptions updated to document the badge-first reading order and the copy-only body; `ReducedMotion` and passivity text unchanged.

## 5. Gates and boundaries

- No runtime change happens in this docs-only task; the runtime change is a separate approved implementation step applying §1–§4 RED-first.
- Frozen files (`spec.md`, `implementation-plan.md`, `issue-comment.md`, captures) stay byte-identical; their recorded hashes are restated in the amendment doc.
- Registry write, `packages/ui/src/index.ts` export, docgen/controls suites, package harnesses, catalog row: parent-owned, per the approved plan §2/§7–§9, with the new convention approval attached to the registry append.

## 6. Hashes to record at approval

When the owner approves, pin the whole-file SHA-256 of both amendment documents next to the decision (same discipline as `layer-c-plan-approvals.md`). Computed at drafting time, before any further edit:

- `docs/components/now-card/v0.1/badge-order-amendment.md` — see return report (computed post-write).
- `docs/components/now-card/v0.1/badge-order-plan-amendment.md` — see return report (computed post-write).
