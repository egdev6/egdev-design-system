# CommunityCard v0.1 — implementation plan

- **Status:** Proposed. Presented for separate owner approval; it authorizes no code, no registry write, no catalog regeneration and no Git action.
- **Contract authority:** [spec.md](spec.md) v0.1 and its byte-identical published snapshot [issue-comment.md](issue-comment.md) (issue body). `version: 0.1`; `contentSHA256: e61852ce0683616aa070f14bd9fa65457286ed8b474d7bb2630bfe8004b75662` — reproduced byte-exact in this working tree with the spec's own rule; local `spec.md` and `issue-comment.md` payloads are identical. Visual hash: VIS-01 `786a935a0215ee77dad3957917b767b14d4aff9fb26b02da6dda20205f7a2db0` (capture `community-card--variants--1280x1400--dark.png`, conditions in [capture.json](capture.json)).
- **Contract approval:** [issue #281 comment 6581573407](https://github.com/egdev6/egdev-design-system/issues/281#issuecomment-6581573407) (2026-11-02, recorded in `odd/tasks/web-catalog.md` L17), owner answer verbatim: `"Aprobar las recomendaciones"`. Every OQ (OQ-1…OQ-5) resolved as recommended: adopt the Material-prescribed `surface-2` header band; the mark is a consumer-supplied slot with a named-or-decorative accessible contract; the action is a supplied `Button`/`Link` part (no `cta` prop object); the action pins to the bottom edge with `mt-auto`; the catalog `composes` corrections (CommunityCard `Avatar` → mark, plus the TipCard/ArticleFeature references) are approved to be applied **within these implementation plans' shared parent-only catalog unit** — no seventh plan, no indefinite deferral.
- **Plan identity:** `contentSHA256: b37b5bc720e3dd6a3884c329a23a661910bef7fdbceda7ec3c692fcdbc631b8f` — SHA-256 of the UTF-8, LF, final-newline payload from `## 1. Authority and gates` through EOF.
- **Baseline:** branch `docs/web-catalog-layer-c-specs-2`, commit `fc6f977`. Current reviewed source bytes: `packages/ui/src/index.ts` `f85891be…`, `primitives/surface/types.ts` `26d0726b…`, `primitives/text/types.ts` `badce409…` (`Text variant="eyebrow"` owns the neon diamond), `atoms/button/types.ts` `8c61498c…` (`asChild` anchor composition), `atoms/avatar/types.ts` `257f17ea…` (documented as **not** reused), `molecules/list-item/types.ts` `df2e05c4…` (component-owned heading precedent), `molecules/panel/usePanel.ts` `94136856…` (banded header geometry), `atoms/chip/types.ts` `aac60553…` (box-border precedent). All re-verified in this working tree.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the implementation edit surface; contract approval alone grants no code.
2. **G2 — Spec provenance (no blocker, no edits).** The local `spec.md` header reads **Draft / Pending** although the contract was approved on #281 (L17). That header is historical snapshot metadata of the published snapshot; the approval comment plus the exact `contentSHA256` above is sufficient provenance. No frozen file is modified. CommunityCard's spec links resolve correctly; no link defect.
3. **G3 — Registry.** No new convention is proposed, none retracted, no exception requested (spec §3). Applied approved entries only: `heading-title`, `heading-level`, `heading-eyebrow`. The supplied-action part documents the approved `trailing-actions` concept but declares no own prop. Usages are appended at implementation with real source revisions; statuses never change.
4. **G4 — Visual reference status.** VIS-01 stays `Proposed`. The capture documents the uniform glass look (no visible band) the DS replaces with the `surface-2` band (approved OQ-1), and the boxed `STACK & FLOW` wordmark that arrives only as consumer mark content under the OQ-2 slot contract. Appearance is judged against the written recipe; browser observations per criterion (§10).
5. **G5 — No token, dependency, Material or legacy change.** Verified-present tokens/recipes only: `surfaceVariants` (`surface-1`/`surface-2` recipes), `--gradient-sheen`, `--text-title-section`, `--text-body-default`, `Text variant="eyebrow"` (public primitive with its diamond), `--space-4`/`--space-6`/`--space-8` padding steps, `max-h-16` preset utilities. **No stylesheet** (spec). No built-in wordmark, no glass recipe, no avatar reuse, no dependency. `packages/ui/src/styles/legacy/bundle.css` untouched.
6. **G6 — Parent-owned integration.** Registry JSON, generated props view, catalog source/artifacts, `packages/ui/src/index.ts` and package harnesses are parent-owned for the implementation task.
7. **G7 — Layer-(b) lessons are obligations.** (a) `box-border`: root and header band both compose `surfaceVariants` (base carries it); asserted by test. (b) **Real-browser layout verification against VIS-01 before merge (§10)**, with attention to equal-height stretching (`mt-auto` action pinning only engages when the host stretches the cards) and the band/body geometry over a consumer-stretched grid.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Responsibility |
| --- | --- | --- |
| `packages/ui/src/molecules/community-card/types.ts` | Writer | `CommunityCardLevel`, CVA recipes (`communityCardVariants`; `communityCardBandVariants`, `communityCardTopRowVariants`, `communityCardMarkVariants`, `communityCardTitleVariants`, `communityCardBodyVariants`, `communityCardActionVariants`), and `CommunityCardProps` (`title`, `level`, `eyebrow`, `children`, `className`), `CommunityCardMarkProps` (`children: ReactElement` — exactly one mark element; `className`), `CommunityCardActionProps` (`children: ReactElement` — exactly one action; `className`) per spec §3; `type` only, `ModuleCard`-style protected `Omit` list for `article`, English JSDoc with `@control` on every own declaration; the mark's named-or-decorative and non-interactive contract and the action's exactly-one contract documented in JSDoc |
| `packages/ui/src/molecules/community-card/useCommunityCard.ts` | Writer | Title/eyebrow normalization (blank title → warn + nothing; whitespace eyebrow → no role line), rank fallback, protected-prop stripping, `useId()` heading id, per-part `cn()`, `data-level` |
| `packages/ui/src/molecules/community-card/CommunityCard.tsx` | Writer | JSX only: root `article`, exported parts `CommunityCardMark` (decorative slot `div`) and `CommunityCardAction` (pinned `div`), internal header band + top row + body wrapper; role line via the public `Text variant="eyebrow"` primitive |
| `packages/ui/src/molecules/community-card/CommunityCard.test.tsx` | Writer | RED-first tests for CC-01…CC-09 plus box-border, band-geometry and pinning assertions (§5) |
| `packages/ui/src/molecules/community-card/CommunityCard.stories.tsx` | Writer | `Molecules/CommunityCard`, English: `Default`, `WithImageMark`, `WithWordmarkMark`, `DecorativeMark`, `WithoutEyebrow`, `WithButton`, `WithLink`, `HeadingRanks`, `LongContent`, `Widths` |
| `packages/ui/src/molecules/community-card/index.ts` | Writer | Named exports of the three components and their prop types |
| `packages/ui/src/index.ts` | Parent (integration) | `export * from './molecules/community-card';` alphabetically in the Molecules block |
| `packages/ui/src/lib/storybook-docgen.test.ts` / `storybook-controls.test.ts` | Parent (integration) | CommunityCard rows, zero owned diagnostics |
| `scripts/package-exports.test.mjs` / `package-consumption.test.mjs` | Parent (integration) | Sorted type lists, SSR/consumer cases per §8 |
| `skills/_shared/prop-naming.json` + `docs/prop-naming.md` | Parent (integration) | Append usages to `heading-title`, `heading-level`, `heading-eyebrow` |
| `scripts/catalog_data.py` + `docs/CATALOGO.md` / `docs/catalog.json` | Parent (integration, shared Unit C) | CommunityCard row: approved `Avatar` correction + implemented note (§9); single regeneration run, no parallel writers |

**No stylesheet.** `compiled.css:49` and `.storybook/preview.css:13,54` wildcards already cover the new folder; no `@source` edit.

Explicitly untouched: `docs/components/community-card/v0.1/**` (frozen), `packages/tokens/**`, legacy CSS, `atoms/avatar` (documented as not reused), `primitives/text`, other components.

## 3. Typing approach and API fidelity

- `CommunityCardProps = Omit<ComponentPropsWithoutRef<'article'>, 'title' | 'role' | 'tabIndex' | 'contentEditable' | 'dangerouslySetInnerHTML' | 'aria-label' | 'aria-labelledby' | 'aria-disabled' | 'aria-selected' | 'aria-pressed' | 'aria-live'> & { title: string; level?: 2|3|4|5|6; eyebrow?: string; children?: ReactNode; className?: string }` — the `ModuleCard` protected list (the heading names the article).
- `CommunityCardMarkProps = { children: ReactElement; className?: string }` — the child is the consumer's mark element; the JSDoc carries the full contract: non-interactive (no anchor, button or tab stop) and either named (`role="img"` + `aria-label`, or `img` + `alt`) or decorative (`img alt=""` / `aria-hidden`) when it repeats the visible name. Not type-enforced; tested (CC-05).
- `CommunityCardActionProps = { children: ReactElement; className?: string }` — exactly one consumer `Button` (optionally `asChild`) or `Link`; two competing actions are outside the contract.
- `@control text` on strings, `number` on `level`, `false` + `@controlReason` on the ReactElement/ReactNode children (non-serializable; dedicated stories documented). `@default 3` as a bare tag value. No ref, no `asChild` on the card itself, no state.

## 4. Recipes and class composition

- **Root:** `cn(surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }), 'eg-community-card flex min-w-0 flex-col overflow-hidden', className)` — padding `none` because the band and body own their spacing. `surfaceVariants` base carries `box-border` (G7a, asserted).
- **Header band:** `cn(surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }), 'eg-community-card__band border-b border-border-hairline rounded-t-xl', band padding wrapper)` — the documented `ModuleCard`/`Panel` banded-header geometry and the exact `surface-2` band `docs/MATERIAL.md` (“En la web (Pulso)”, bandas) prescribes (approved OQ-1; the band is a Material-driven addition over the web's band-less glass, recorded as such).
- **Top row:** internal `div` with token padding, `flex items-center justify-between gap-3 min-w-0`: the role line via the public `<Text variant="eyebrow">{eyebrow}</Text>` (its neon diamond comes with the primitive — never cloned) and the `CommunityCardMark` on the trailing edge. Row collapses to its single supplied child (eyebrow only / mark only / both).
- **Mark slot:** `CommunityCardMark` renders `div eg-community-card__mark` with `max-h-16 max-w-full shrink-0 flex items-center justify-center` + `[&>img]:object-contain [&>img]:max-h-16` static utilities so a consumer image keeps its intrinsic aspect inside the constraint (spec §6).
- **Body:** wrapper `div` with the frame's large padding step `p-6 md:p-8` and `flex flex-col gap-4 min-w-0`; the name `text-title-section text-fg-default`; copy renders as consumer children in reading order (no headings allowed by contract).
- **Action:** `CommunityCardAction` renders `div eg-community-card__action mt-auto` inside the body flow's end so consumer-stretched cards keep their actions aligned (approved OQ-4); without a stretched host it simply follows the copy.
- **Composition rules:** per-part `cn()`; each part's `className` merged last for local layout; root `className` last for outer layout and equal-height stretching. No hover/transition/animation utilities on the card (passive; only the supplied action is interactive).

## 5. Test-first sequence

New component; every behavior test RED first. Public interface only.

| Step | RED test (`CommunityCard.test.tsx` unless noted) | Covers |
| --- | --- | --- |
| R0 | `storybook-docgen.test.ts` (CommunityCard section): docgen resolves `title` (required), `eyebrow`, `level`; `diagnostics: []` | CC-09, early |
| R1 | `article` role; heading is `h{level}`; `aria-labelledby` → heading id | CC-01 |
| R2 | Blank/whitespace `title` warns and renders nothing | CC-02 |
| R3 | `eyebrow` renders the public `Text` eyebrow output (diamond marker present) inside the band classes (`bg-surface-2`, `border-b`, `rounded-t-xl` markers), only when supplied | CC-03 |
| R4 | Band vs body recipes: band classes carry `surface-2` markers, body/root carry `surface-1` markers | CC-04 |
| R5 | `CommunityCardMark`: named mark (`role="img"` + `aria-label`, or `img` + `alt`) joins the card's accessible content; decorative mark (`alt=""`) stays out (`toHaveAccessibleName` per kind); non-interactive mark contributes zero tab stops | CC-05 |
| R6 | Long copy/name at a narrow host: wraps, no `truncate`/`line-clamp` | CC-06 |
| R7 | `CommunityCardAction` hosts exactly one supplied action pinned with `mt-auto`; `userEvent.tab()` finds exactly one tab stop (the action); the card exposes no other | CC-07 |
| R8 | No `hover:`/`cursor-pointer`/`transition` utility on root/parts; no built-in width; consumer `className` merges last; two-width render | CC-08 |
| R9 | Root class set contains `box-border`; band stays inside `rounded-xl` (root `overflow-hidden` marker) | G7a |

**PRESERVE.** No existing shared code changes; `Text` (eyebrow), `surfaceVariants`, `Button`, `Link` are consumed, not modified. Evidence: `Text`, `Button`, `ModuleCard`, `Panel` focused suites stay green; lib/harness suites pass unchanged except their CommunityCard additions.

GREEN order: `types.ts` → `useCommunityCard.ts` → `CommunityCard.tsx` → `index.ts` → stories → parent integration.

## 6. Stories and Controls

`Molecules/CommunityCard`, autodocs, `Meta<typeof CommunityCard>`, no manual `argTypes`, no `play`. `Default` (eyebrow + wordmark-style mark + name + copy + `Button`), `WithImageMark` (`img` + `alt`), `WithWordmarkMark` (`role="img"` + `aria-label` box, the web's OQ-2 pattern as consumer content), `DecorativeMark` (`img alt=""`), `WithoutEyebrow`, `WithButton` (primary), `WithLink` (secondary), `HeadingRanks`, `LongContent`, `Widths`. Action examples use the system `Button` (optionally `asChild`) and `Link`; external destinations keep consumer `target`/`rel`. A stretched-grid story (or documented note) shows the `mt-auto` pinning effect.

## 7. Registry integration

Applied approved entries: `title` → `heading-title`; `level` → `heading-level`; `eyebrow` → `heading-eyebrow`. The `trailing-actions` concept is documented in the part's JSDoc without a new usage row (no own prop declared — spec §3). Parent appends the three usages with real source revisions at implementation, regenerates (`pnpm props:docs`), runs `pnpm props:check` + `pnpm test:props`. No new convention, no widening, no exception.

## 8. Package exports and consumption

- `scripts/package-exports.test.mjs`: add `CommunityCard`, `CommunityCardMark`, `CommunityCardAction` and prop types to the sorted lists; SSR smoke asserts `article` + band + one tab stop.
- `scripts/package-consumption.test.mjs`: positive cases (named mark, decorative mark, button action, link action); documented `@ts-expect-error` negatives for the protected root attributes. Packed React 18/19 compile via the existing harness; no ref, no React-19-only API.

## 9. Catalog row update (shared parent-only Unit C)

All six layer-(c) rows are refreshed by **one shared parent-only integration unit (Unit C)** — a single writer edits `scripts/catalog_data.py`, then runs `python3 scripts/build_catalog.py` once; no parallel writers touch the shared file. Generated files are never hand-edited. For this component, Unit C applies the **owner-approved substantive correction** (OQ-5, an approval outcome; L17): line 84, composes `Surface, Avatar, Button` → `Surface, Button; consumer-supplied mark slot`, note drop of "with an avatar heading"; note → "Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/281): community article with a `surface-2` header band (public `Text` eyebrow role line + consumer named-or-decorative mark slot), generated display heading, free copy and one supplied `Button`/`Link` pinned with `mt-auto`. No avatar, wordmark artwork, stylesheet, ref or card-level interaction."

## 10. Browser checks to run before merge

Against `pnpm storybook` with real compiled tokens, after GREEN; observations recorded, never replacing tests:

1. Controls render per the central enhancer; zero owned diagnostics across CommunityCard stories.
2. **Real-browser layout verification against VIS-01:** compare `Default`/`WithImageMark` with the captured board for the surviving intent — diamond role line, trailing mark, display name, secondary copy, single pinned action. Allowed differences recorded: solid banded `surface-1`/`surface-2` frame instead of uniform glass; `text-title-section` fluid name instead of the 36–56 px literal; `text-body-default` copy; system `Button` treatments. The boxed wordmark appears only as consumer mark content. Visual conformity reported per criterion; capture never overwritten.
3. **Box-border / layout (layer-b lessons):** consumer width contains the border; the `surface-2` band sits inside the `rounded-xl` frame with its bottom hairline; in a stretched equal-height grid the actions align to the bottom edge across cards with unequal copy; the mark keeps its aspect inside `max-h-16`.
4. Reduced motion and 200% zoom: no card motion; long copy wraps.
5. Keyboard/screen reader: exactly one tab stop (the action); named mark participates in content, decorative mark does not; eyebrow diamond absent from the name.

Full gates before merge, parent-scheduled with observed output: `pnpm typecheck`, `pnpm lint`, focused first (`pnpm exec vitest run packages/ui/src/molecules/community-card packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts`), then `pnpm test`, `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm props:check`, `pnpm test:props`.

## 11. Bounded work units

1. **Unit A (writer):** the six `packages/ui/src/molecules/community-card/` files; focused tests green.
2. **Unit B (parent integration):** index export line, docgen/controls sections, package harness additions, registry usage append + props check.
3. **Unit C (shared parent-only catalog integration, all six components):** exact row updates per each plan's §9 (this one includes the approved `Avatar` correction), one `build_catalog.py` run.

## 12. Risks

- **R-1 — Mark contract is documented, not type-enforced.** A focusable mark element inside the slot is outside the contract but cannot be a compile error (`ReactElement` accepts any element); CC-05 tests the documented behaviours and the story documents the obligation. Runtime policing (e.g. stripping `tabIndex`) is deliberately not implemented — the slot renders consumer content untouched.
- **R-2 — `[&>img]` arbitrary-variant utilities.** Static, token-valued, scannable; the CSS-block assertion added to `package-exports.test.mjs` verifies emission. Fallback if emission fails: a spec question, never inline style.
- **R-3 — `overflow-hidden` on the root** guarantees band corners; asserted so the band never bleeds past the radius.
- **R-4 — VIS-01's glass look** must not be reproduced (no approved glass recipe); the band difference is approved OQ-1 and recorded either way.
- **R-5 — Spec provenance** (G2): historical snapshot metadata; the frozen digest and approval comment are the binding provenance.

## 13. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, catalog or Git action is taken or implied.
