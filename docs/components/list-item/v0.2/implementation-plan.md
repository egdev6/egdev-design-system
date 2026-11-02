# ListItem v0.2 — editorial row implementation plan

- **Status:** Draft plan for owner approval. It authorizes no code, token, dependency, capture re-run, remote publication or Git action.
- **Contract:** [spec.md](spec.md), v0.2, **Approved**.
  - Snapshot comment: <https://github.com/egdev6/egdev-design-system/issues/88#issuecomment-6573738637> (`version: 0.2`, `contentSHA256: 94a7d5c5e3be5094d34d1b54b09e2268c0a44bf4361bbd01d03fb31f81461eae`).
  - Owner approval: <https://github.com/egdev6/egdev-design-system/issues/88#issuecomment-6576758816> — recovered verbatim: "Aprobar con sus recomendaciones (Recomendado)", scope "the snapshot's contract with every recommendation it lists for its open questions (OQ-1 to OQ-5: `editorial` and `editorial-divided`, `size` md | sm, new ListItemLeading / ListItemTitle / ListItemTrailing parts, whole-row anchor through `asChild` with interactive-only hover)".
  - Visual hashes named by the contract: `VIS-03 → 27898d4620a0a939eb694f4c288a2c73c121c683e9d361aa4b2ee60486222758`, `VIS-04 → e035c06884de24484b005ae0bf7720f27d000f7eb054c47f3464f3fbc120ae09`, `VIS-05 → e179eac79b6e782370446b6338b0336d1cb77beeab489048721c4e98b62c02ed`. The approval comment binds version and `contentSHA256` only; hash-level adoption is owner question Q1 below.
- **v0.1 remains authoritative for v0.1 behaviour:** [v0.1 approval](https://github.com/egdev6/egdev-design-system/issues/88#issuecomment-6251516412) and [v0.1 implementation evidence](../v0.1/implementation.md).
- **Plan identity:** SHA-256 of the UTF-8 canonical payload from `## 1. Gates and boundaries` through EOF, LF line endings, final newline, excluding this metadata block. The parent records the frozen digest with the plan approval; this draft does not contain its own hash.
- **Baseline inspected:** `f159b9cc63ec0f16797239683b272e4e11ad0de3` on `docs/web-catalog-layer-b`. Working tree clean except the pre-existing `odd/tasks/web-catalog.md` modification.
- **Tracking:** `odd/tasks/web-catalog.md` L5–L11 (P2, S3); catalog decision in [owner-approvals.md](../web-catalog/v0.1/owner-approvals.md).
- **Evidence classification:** every class recipe below was checked statically against the installed Tailwind 4.3.3 compiler and `packages/tokens/src/theme.css` (see §4.3). No runtime test, story build, browser capture, contrast measurement or accessibility review has run for v0.2.

## 1. Gates and boundaries

1. **Contract gate: passed.** v0.2 is approved (§ authority). No spec edit, no new issue, no body edit.
2. **Plan gate: pending.** The owner approves this exact payload before any implementation write. Contract approval alone authorizes no code.
3. **Visual-adoption gate: pending (Q1).** The three PNGs exist in this folder with `capture.json`; the approval comment does not name their hashes. First-merge visual comparison requires Q1 to be answered; if the owner keeps them Proposed, the delivery reports visual conformity as **Not evaluated** and the plan's §9 comparison stays a comparison, never an assertion.
4. **Scope boundary.** Additive public API on an existing molecule: two `variant` values, one `size` prop, three new compound parts, two documented compatibility refinements required by the contract (§3.3). Not in scope: any change to `card` / `compact` / `row` / `empty` appearance or behaviour, CalendarGrid or any consumer edit, new molecules for ArticleItem / NoteItem / StreamItem, ArticleFeature, NotesBoard / BlogGrid / LiveBand, date parsing or formatting, routing, analytics, pagination, dark/light theme work.
5. **Six-file rule.** The three new parts are compound siblings inside the **existing** `ListItem.tsx`, with their recipes in the existing `types.ts`, their composition helpers in the existing `useListItem.ts`, their tests in the existing `ListItem.test.tsx`, their stories in the existing `ListItem.stories.tsx` and their exports in the existing `index.ts`. The folder stays at exactly six files: `types.ts`, `useListItem.ts`, `ListItem.tsx`, `ListItem.test.tsx`, `ListItem.stories.tsx`, `index.ts`. **No stylesheet** (no `list-item.css`): every editorial recipe is expressible as static token utilities, so no CSS role is approved or needed. **No new internal module**: no ported engine, no context file, no helper module. No empty/dummy file.
6. **No token or dependency change.** All fills, hairlines, radii, spacing, type steps, durations and easings come from existing `@egdev/tokens` variables; `@radix-ui/react-slot` 1.5.0 is already installed and imported as `SlotPrimitive`. `packages/tokens/src/theme.css`, `tokens.css` and `package.json` files are untouched. The token-step approximations (title weight, duration size) are recorded as *allowed differences* in §4.4, not as token proposals.
7. **Evidence boundary.** This file is the only write of this preparation step.

## 2. Intended future edit surfaces — not currently authorized

| Path | Responsibility |
| --- | --- |
| `packages/ui/src/molecules/list-item/types.ts` | `ListItemVariant` extended with `editorial` / `editorial-divided`; new `ListItemSize`, `ListItemTitleProps`; `size` declared in all three `ListItemProps` union branches with English JSDoc, `@default md` and `@control select`; `listItemVariants` editorial layout, flush-reset, hover, focus and motion rules; `listItemPartVariants` `leading` / `title` / `trailing` parts plus editorial and `size="sm"` overrides for `body` / `meta` / `leading` |
| `packages/ui/src/molecules/list-item/useListItem.ts` | `size` normalization; editorial-aware variant normalization preserved; root `data-size`; per-variant Surface composition (unchanged for `card`/`compact`/`row`); `useListItemPart` extended with the three new parts; new `useListItemTitle` returning the `h2`–`h6` tag and heading props |
| `packages/ui/src/molecules/list-item/ListItem.tsx` | JSX-only `ListItemLeading`, `ListItemTitle`, `ListItemTrailing`; dynamic heading element consumed from the hook (same shape as `ModuleCard.headingElement`); no state, no CVA, no logic |
| `packages/ui/src/molecules/list-item/ListItem.test.tsx` | Behaviour-level tests for LR-01…LR-09 plus the extended merge invariants |
| `packages/ui/src/molecules/list-item/ListItem.stories.tsx` | `Molecules/ListItem` stories listed in §7; English meta guidelines text covering the editorial restrictions |
| `packages/ui/src/molecules/list-item/index.ts` | Named exports for the three new parts and the new types (§8.2) |
| `packages/ui/src/index.ts` | **No edit**: `export * from './molecules/list-item';` already covers the new names; the parent only confirms it |
| `packages/ui/src/lib/list-item-contract.test.ts` | Delivery-contract harness: export inventory, AST annotation count, docgen display names, `ListItemTitle` annotation case, controls mapping, static CSS emission scan |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Public-API name inventory: three new component names |
| `packages/ui/src/lib/storybook-controls.test.ts` | `components` map + `ListItemTitle` entry, `listitem` expectation (`size`), own-prop counts |
| `scripts/package-exports.test.mjs` | Three exact sorted export lists (§8.2) and the ListItem CSS selector list (§8.3) |
| `scripts/package-consumption.test.mjs` | Import list, type import list, an editorial SSR sample, type-level negatives, packed CSS assertion |
| `skills/_shared/prop-naming.json` | Append `ListItem` usage for `size` and a `ListItemTitle.level` usage; refresh every `ListItem` usage revision to the new whole-file hash (§8.1) |
| `docs/prop-naming.md` | Regenerated by `pnpm props:docs`; never hand-edited |
| `scripts/catalog_data.py` | Refresh the `ListItem` row and the three absorbed rows (§8.4); Spanish register preserved (legacy content, not part of an English rewrite) |
| `docs/CATALOGO.md`, `docs/catalog.json` | Regenerated by `python3 scripts/build_catalog.py`; never hand-edited |
| `docs/components/list-item/v0.2/observed/` | New runtime evidence written after implementation (browser comparison notes, per-criterion differences). Expected-design PNGs in this folder stay unmodified |

Explicitly **not** touched: `.storybook/preview.css` (already contains `@source "../packages/ui/src/molecules/**/*.stories.tsx"`, which covers `ListItem.stories.tsx`), `packages/ui/src/styles/compiled.css` (already contains `@source "../molecules/list-item/types.ts"`, so new CVA utilities reach `dist/styles.css`), `packages/tokens/**`, any `package.json`, `packages/ui/src/organisms/calendar-grid/**`, legacy CSS bundles, and this spec.

## 3. API additions and compatibility

### 3.1 Public additions

| Surface | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` (extended) | `ListItemVariant = 'card' \| 'compact' \| 'row' \| 'editorial' \| 'editorial-divided'` | `card` | Additive union members; unknown runtime values keep normalizing to `card` |
| `size` (new, root) | `ListItemSize = 'md' \| 'sm'` | `md` | Editorial values only; ignored by `card`, `compact`, `row` and by the `empty` branch, which stays `card`-only |
| `ListItemTitle.level` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | Selects the rendered heading element only; typography stays a part recipe |
| `ListItemLeading` | compound part (`div`) | — | Optional leading zone; marker `eg-list-item__leading` |
| `ListItemTitle` | compound part (`h2`–`h6`) | — | Marker `eg-list-item__title`; forwards native heading attributes for the element its `level` selects |
| `ListItemTrailing` | compound part (`div`) | — | Optional trailing zone; marker `eg-list-item__trailing` |

`status`, `asChild`, `ListItemPartProps`, the seven v0.1 parts, `eg-list-item` and the six v0.1 part markers keep their v0.1 contract. No prop is removed and no default changes.

### 3.2 Normalization (hook-owned, deterministic)

| Input | Result |
| --- | --- |
| `status="empty"` with `editorial` / `editorial-divided` | `data-state="empty"`, `data-variant="card"` (v0.1 rule preserved) |
| Unknown `variant` at runtime | `card` |
| Unknown `size` at runtime | `md` |
| `size` with `card` / `compact` / `row` | `data-size` present, **no** matching utilities, so no visual effect |
| `asChild={false}` | `div` root (unchanged) |
| `asChild={true}` with one element | single child through `SlotPrimitive.Root` (unchanged mechanism) |

`data-size` is added to the root alongside `data-state` and `data-variant` because the three new parts must follow the root through the existing `group/list-item` scope; parts receive no `size` prop and no dynamic custom property is introduced. This is a documented presentation attribute, not a state, so it does not contradict the contract's "the amendment adds no state attribute". It is owner question Q4.

### 3.3 Compatibility with existing variants

| Variant | v0.1 behaviour | After v0.2 |
| --- | --- | --- |
| `card` | Raised Surface, `p-4`, column, footer band | Identical utilities; the only shared-rule change is the hover gate in §5.2 |
| `compact` | `p-3`, `gap-2`, `rounded-md`, smaller content step | Identical |
| `row` | `flex-row flex-wrap items-center p-3 rounded-md` | Identical |
| `empty` | `card`-only, slotted native action, dashed frame | Identical; `size` ignored |
| `editorial` | — | New: raised Surface kept, three-zone row |
| `editorial-divided` | — | New: no paint, bottom hairline only |

Only two documented refinements differ from narrower v0.1 wording, both required by the approved contract: (1) a whole-row anchor is allowed **for editorial values only**, with `ListItemActions` unsupported inside it; (2) the v0.1 default hover border is no longer emitted for editorial values, whose hover affordances appear only when the row element is an anchor. `card` / `compact` / `row` keep the v0.1 hover border exactly.

### 3.4 Type-level negatives to keep or add

- Existing, must keep failing to compile: missing `children`; `asChild: true` with non-element children; `status: 'empty'` with `variant` other than `'card'` (so `{ status: 'empty', variant: 'editorial', asChild: true, children: element }` is rejected by the type, and the runtime normalization of §3.2 covers untyped callers); `ref`, `role`, `tabIndex` on root and parts.
- New, must fail to compile: `size: 'lg'`; `size` outside the editorial values is allowed by type but documented as inert; `ListItemTitle` `level={1}` and `level={7}`; `level` on `ListItem` root; `ListItemLeading` / `ListItemTrailing` receiving a `role` or `tabIndex`.
- Not type-enforceable and therefore documentation-only (never a runtime error): `ListItemActions` inside a linked editorial row, `ListItemContent` / `Media` / `Footer` inside an editorial row. The plan requires no thrown error — v0.1 has no child-tree validation and v0.2 must not invent one.

## 4. Class recipes (existing tokens only)

### 4.1 Root — `listItemVariants`

Existing base string is unchanged except the hover rule replacement in §5.2. Added rules:

| Concern | Utilities |
| --- | --- |
| Editorial layout | `data-[variant=editorial]:flex-row data-[variant=editorial]:items-start data-[variant=editorial]:min-h-11` and the same keys for `editorial-divided` |
| Divided flush frame | `data-[variant=editorial-divided]:data-[state=default]:bg-transparent` `…:bg-none` `…:shadow-none` `…:rounded-none` `…:border-x-0` `…:border-t-0` `…:border-b` `…:border-border-hairline` |
| Motion | `data-[variant=editorial]:transition-[background-color,border-color,padding] data-[variant=editorial]:duration-(--duration-fast) data-[variant=editorial]:ease-(--ease-out) data-[variant=editorial]:motion-reduce:transition-none` and the same keys for `editorial-divided` |

The root keeps composing `surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' })` for **every** variant, as the approved contract states. `editorial` therefore inherits the raised row with token radius and hairline edge without new paint. `editorial-divided` reaches its flush look by *resetting* that composition under `data-[variant=editorial-divided]:data-[state=default]` instead of skipping Surface: this keeps the public `eg-surface` marker and the composed contract literal, and the compound selector wins over Surface's paint by specificity (`0,3,0` vs `0,1,0`), not by utility order. Status paint wins over the variant paint for the same reason: non-default statuses never receive the reset, so `new` repaints a divided row (surface-1, gradient, brand border, elevation) exactly as the contract documents. The alternative — a hook-level branch that composes no Surface for divided rows, as `Panel` `tone="inherit"` and `Tabs` `--segmented` do — is **rejected** here because it would make the root's marker set variant-dependent and would contradict the contract sentence "the root keeps composing the exported `surfaceVariants(...)`"; it is recorded so a reviewer can compare the choice.

### 4.2 Parts — `listItemPartVariants`

| Part | Recipe | Token read |
| --- | --- | --- |
| `leading` (new) | `eg-list-item__leading box-border flex flex-col items-start shrink-0 min-w-0 w-[calc(var(--space-20)+var(--space-3))] group-data-[size=sm]/list-item:w-[var(--space-16)]` | `--space-20`+`--space-3` = 73.6px (web 92 × 0.8), `--space-16` = 51.2px (web compact 64 × 0.8) |
| `leading` stamp | `[&_time]:flex [&_time]:flex-col [&_time]:font-display [&_time]:leading-none [&_time]:tabular-nums [&_time]:text-fg-default [&_time]:text-display-stat group-data-[size=sm]/list-item:[&_time]:text-display-stat-sm [&_time>small]:mt-1 [&_time>small]:font-display [&_time>small]:text-label-eyebrow [&_time>small]:uppercase [&_time>small]:text-fg-secondary` | `text-display-stat` 28.8px, `text-display-stat-sm` 22.4px, `text-label-eyebrow`, `--space-1`. Descendant recipe mirrors the existing `media` part's `[&>img]`/`[&>video]` shape and the web markup `<time datetime>12<small>SEP</small></time>` |
| `title` (new) | `eg-list-item__title m-0 min-w-0 font-sans wrap-anywhere text-body-large text-fg-default group-data-[size=sm]/list-item:text-body-default` | `text-body-large` 16px (web 19–20 × 0.8), `text-body-default` 12.8px (web compact 17 × 0.8) |
| `trailing` (new) | `eg-list-item__trailing box-border flex shrink-0 items-center gap-2 self-center font-display tabular-nums text-display-stat-sm text-fg-secondary` | `text-display-stat-sm` 22.4px, `--space-2`, `--color-fg-secondary` |
| `body` editorial override | `group-data-[variant=editorial]/list-item:grow group-data-[variant=editorial]/list-item:flex-col group-data-[variant=editorial]/list-item:flex-nowrap group-data-[variant=editorial]/list-item:gap-2` (+ same keys for `editorial-divided`) | `--space-2` |
| `meta` editorial override | `group-data-[variant=editorial]/list-item:font-display group-data-[variant=editorial]/list-item:uppercase group-data-[variant=editorial]/list-item:tabular-nums group-data-[variant=editorial]/list-item:text-label-eyebrow group-data-[variant=editorial]/list-item:text-fg-secondary [&_b]:font-bold [&_b]:text-fg-brand-raised` (+ same keys for `editorial-divided`) | `text-label-eyebrow`, `text-fg-brand-raised` |
| `content` / `media` / `footer` / `actions` | unchanged v0.1 recipes | — |

`font-sans` in the existing part recipes is **not** renamed; `ListItemTitle` declares `font-sans` explicitly and the editorial `meta` override wins through the `group-data-[variant=…]/list-item` scope, so no legacy recipe changes.

### 4.3 Emission evidence (static, observed now)

Each candidate utility was compiled in memory with the installed `tailwindcss` 4.3.3 against `packages/tokens/src/theme.css` (no build artifact written, no repository file created or left behind). All candidates emitted their own selector, including `[&:is(a)]:hover:bg-surface-2`, `data-[state=default]:data-[variant=editorial]:[&:is(a)]:hover:border-border-brand`, `data-[variant=editorial-divided]:data-[state=default]:border-x-0`, `group-data-[size=sm]/list-item:[&_time]:text-display-stat-sm`, `[&_time>small]:text-label-eyebrow`, `w-[calc(var(--space-20)+var(--space-3))]`, `w-[var(--space-16)]` and `data-[variant=editorial]:[&:is(a)]:hover:[&>.eg-list-item__trailing]:text-fg-brand-raised`. The one candidate that emitted **nothing** is `text-fg-brand` — that theme key does not exist, which is the agreed lesson that a variant on an undefined theme key silently produces no CSS. The implementation must re-prove every recipe through the existing static compile test (§6, LR-12) rather than trusting this note.

### 4.4 Flagged gaps and allowed differences

| Item | Web value | DS value | Decision |
| --- | --- | --- | --- |
| Title weight | 600 | `text-body-large` carries 500 | **Allowed difference.** No `font-semibold` hand-write; no token request |
| Trailing duration step | 24px (×0.8 = 19.2) | `text-display-stat-sm` 22.4px | **Allowed difference** (±3.2px). No token request |
| Leading column | 92px / 64px | 73.6px / 51.2px (exact ×0.8 token sums) | Exact token derivation, no gap |
| Divided hover wash | `color-mix(fg 3%)` | `bg-surface-2` (the token role documented for hover) | Existing fill, no new Material recipe |
| Brand category tint on a raised row | legacy bright red | `text-fg-brand-raised` | **Contrast limitation** (Q3): `--color-fg-brand-raised` and `--color-fg-brand-default` both document failure of small-text AA on `surface-1` (`4.30:1`/`4.61:1`), while the existing "Todo neón" owner decision keeps neon brand text on raised surfaces. Recorded as a limitation, not silent compliance |
| Hover border on a linked row | brand border | `border-border-brand` (`--color-alpha-red-45`, 1.74:1) | Decorative accent only; the anchor is identifiable by its text and the row is never delimited by that border alone. Recorded as a risk, checked in the browser review |

## 5. Whole-row anchor semantics and interactive-only hover

### 5.1 Anchor semantics

- `asChild` keeps using `SlotPrimitive.Root`; an editorial row slotted onto one `<a>` (or a router link that renders `<a>`) forwards `href`, `onClick`, `target`, `rel`, ARIA and the child's own `ref` unchanged, and receives `eg-list-item`, `data-state`, `data-variant` and `data-size`. No wrapper element, no nested link, no `onClick` handler of our own, no `role`, no `tabIndex`.
- One tab stop per linked row, native Tab and Enter; no key handler, no roving tabindex, no Space emulation (the same evidence shape as the v0.1 `EmptyLink` test).
- Accessible name is the visible text in DOM order (leading stamp, then body, then trailing). Trailing arrows are the system `Icon`, which is `aria-hidden` and unfocusable; duration stays readable text inside the name.
- Static editorial rows are plain `div` containers: no tab stop, no synthesized role, no hover affordance.
- `ListItemActions` inside a linked editorial row is unsupported and documented in JSDoc and story guidelines. No runtime error is thrown; no overlapping activation is created because the DS exposes no root activation handler.

### 5.2 Interactive-only hover (root element must be an anchor)

| Rule | Selector (specificity) | Purpose |
| --- | --- | --- |
| Gate the v0.1 default hover border | `data-[state=default]:not-data-[variant=editorial]:not-data-[variant=editorial-divided]:hover:border-border-hairline-strong` (`0,4,1`) | `card`/`compact`/`row` keep v0.1 behaviour; editorial values never get it, even when static |
| Linked `editorial` hover | `data-[state=default]:data-[variant=editorial]:[&:is(a)]:hover:border-border-brand` and `…:hover:[background:var(--gradient-sheen),var(--color-surface-2)]` (`0,3,1`) | Brand border plus raised-surface wash over the existing sheen (Chip's documented combination) |
| Linked `editorial-divided` hover | `data-[state=default]:data-[variant=editorial-divided]:[&:is(a)]:hover:bg-surface-2`, `…:hover:ps-[calc(var(--space-4)+var(--space-2))]`, `…:hover:pe-[calc(var(--space-4)-var(--space-2))]` | Surface wash plus a start-edge indent. The compensated inline-end padding keeps the row's outer width constant, so nothing outside the row shifts and no transform or animation is introduced |
| Linked focus | `data-[variant=editorial]:[&:is(a)]:focus-visible:outline-none …:shadow-focus` and the same for `editorial-divided` (`0,3,1`) | `--shadow-focus` on the row itself, above the divided `shadow-none` reset; a static row cannot match |
| Anchor cleanup | `data-[variant=editorial]:[&:is(a)]:no-underline …:cursor-pointer` (+ divided) | Keeps the row looking like a row, not like a legacy inline link |
| Trailing arrow tint | `data-[variant=editorial]:[&:is(a)]:hover:[&>.eg-list-item__trailing]:text-fg-brand-raised` (+ divided) | Muted-to-brand arrow on an interactive row only |

`:is(a)` is keyed from the row element itself (the slotted anchor), never from a consumer class and never from a mirrored state class. Motion tokens are `--duration-fast` / `--ease-out` with `motion-reduce:transition-none`, and no transition is added to `card` / `compact` / `row`, so v0.1 stays motion-free.

## 6. Test-first sequence (RED first, one rule per test)

Focused command during implementation: `pnpm exec vitest run packages/ui/src/molecules/list-item packages/ui/src/lib/list-item-contract.test.ts`.

| Acceptance | RED test to add first (file) | Intended first failure |
| --- | --- | --- |
| LR-01 | `ListItem.test.tsx` — `editorial` render asserts `leading` → `body`(`title`,`meta`) → `trailing` marker order, `data-variant="editorial"`, `min-h-11`, `flex-row`, and that `eg-surface` is still present | `data-variant` is `card`; the three parts do not exist |
| LR-02 | `ListItem.test.tsx` — `it.each(['editorial','editorial-divided'])` with `status="empty"` normalizes to `card`; `new`/`failed`/`done`/`off`/`dragging` keep their v0.1 `data-state` and repaint a divided row | Runtime normalization table has three values; `editorial` falls back to `card` |
| LR-03 | `ListItem.test.tsx` — `size="sm"` on `editorial` narrows `leading` (`w-[var(--space-16)]`) and lowers the day/title steps; `size` on `card`/`compact`/`row` adds no matching utility; unknown size → `md` | No `size` prop, no `data-size`, no `sm` utilities |
| LR-04 | `ListItem.test.tsx` — a row with `<time dateTime="2026-09-12">12<small>SEP</small></time>` keeps a real `time[datetime]`; `ListItemTitle` renders `h3` by default and `h2`/`h4`/`h5`/`h6` by `level`; `ListItemTitle` forwards `id`/`aria-*` | `ListItemTitle` is not exported; no heading rank |
| LR-05 | `ListItem.test.tsx` — editorial `asChild` anchor forwards `href`, `onClick` and child `ref`, keeps `eg-list-item` + `data-variant`; existing `AsList`/`AsArticle` behaviour preserved | `editorial` is not a variant value; anchor slot untested for editorial |
| LR-06 | `ListItem.test.tsx` — a linked row is one `link` with the visible-text name, `userEvent.tab()` reaches it exactly once between two rows, `Enter` navigates; a static row is not in the tab order; `ListItemActions` inside a linked row neither throws nor adds a second name | No anchor path for editorial; no tab-stop assertion |
| LR-07 | `ListItem.test.tsx` — static `editorial` exposes no `:is(a)` hover utility and no `tabindex`; `editorial-divided` keeps `bg-none`/`shadow-none`/`rounded-none`/`border-b` under `data-state="default"` and no surface wash; `list-item-contract.test.ts` asserts each flush utility exists in the compiled CSS | Flush reset utilities absent; hover rules not gated |
| LR-08 | `ListItem.test.tsx` + `list-item-contract.test.ts` — the hover/focus/motion utilities come from tokens (`duration-(--duration-fast)`, `ease-(--ease-out)`, `--color-surface-2`, `--shadow-focus`) and every editorial branch carries `motion-reduce:transition-none`; no hand-written colour, shadow or duration appears in `types.ts` | Editorial branches have no transition or reduced-motion counterpart |
| LR-09 | `ListItem.test.tsx` — per-part `className` merges for `leading`/`title`/`trailing` resolve their own conflicts (`ms-0` removes `ms-auto`, `max-w-full` applies) while the root keeps outer-layout-only merges | New parts drop or duplicate `className` |
| LR-10 | `list-item-contract.test.ts` export inventory (10 components, 6 types), docgen display names, and `pnpm typecheck` for CalendarGrid | Inventory still lists 7 components and 4 types |
| LR-11 | `list-item-contract.test.ts` AST case for `ListItemTitle` (`level` → `select` + `@default 3`, `children` → `false` with a `@controlReason`), `size` in all three union branches, enhancer diagnostics empty; `storybook-controls.test.ts` expectations | `size`/`level` are unannotated; `ListItemTitle` is unknown to the harness |
| LR-12 | `list-item-contract.test.ts` compile scan extended with every new recipe candidate (root flush/hover/motion, `leading`/`title`/`trailing`, `size` overrides, `time`/`small`/`b` descendants) | Candidates are missing from the scan and from `dist/styles.css` |

**PRESERVE (no RED run needed, expected green):** the 14 existing `ListItem.test.tsx` test blocks (several are `it.each` tables), the current `card`/`compact`/`row`/`empty` records in `list-item-contract.test.ts`, `CalendarGrid.test.tsx`, and the existing ListItem assertions in both package scripts.

**Differential check (required because the diff edits shared code).** `listItemVariants` and `useListItemPart` are shared by `card`, `compact`, `row`, `empty` and all six v0.1 parts. Before finishing, one script must render the v0.1 story fixtures (card, compact, row, empty button, empty link, media, actions, all statuses) against the base commit sources and against the change, comparing exit code, rendered HTML/class output and the compiled utility set. Any difference outside the §5.2 hover gate and the additive editorial rules is a regression to fix and pin with a test; the hover-gate difference is the approved refinement and must be documented, not reverted. The base copy lives in a fresh `mktemp -d` scratch directory outside the worktree and is deleted by the script; committed tests never read git history or a fixed commit.

## 7. Stories and Controls

Stories stay in `ListItem.stories.tsx` under `Molecules/ListItem`, English, `Meta`/`StoryObj` from `@storybook/react-vite`, no manual `argTypes`, no `play`, `action` only for the existing callbacks. New stories, each tied to a criterion: `EditorialRow` and `EditorialVariants` (LR-01), `EditorialStatuses` (LR-02), `EditorialSizes` (LR-03), `EditorialDatedList` and `EditorialHeadingRanks` (LR-04), `EditorialLinkRow` (LR-05), `EditorialFocus` (LR-06), `EditorialStaticRow` and `EditorialDivided` (LR-07), `EditorialHover` (LR-08). `ReducedMotion`, `ClassComposition`, `Statuses`, `Variants`, `AsList` and the v0.1 stories stay. `Default` keeps supplying only required children so no documented default is overwritten. Example content is dated, non-personal, English, with a fixed `dateTime`.

Meta guidelines gain the editorial sentences: leading → body → trailing order; `ListItemTitle` owns the heading rank and the consumer matches the surrounding outline; `ListItemActions` is unsupported inside a linked row; editorial rows do not compose `Content`, `Media` or `Footer`; `editorial-divided` paints no surface; hover affordances require an anchor root; the consumer formats day, month, category, reading time and duration.

Controls after implementation: `variant` select with all five values in contract order, `size` select `md`/`sm` with documented default `md`, `ListItemTitle.level` select `2…6` with documented default `3`, `children` `false` with its `@controlReason`, `asChild` boolean with documented default `false`; zero owned-metadata diagnostics. `@source` needs no edit: `.storybook/preview.css` already covers `packages/ui/src/molecules/**/*.stories.tsx` and `packages/ui/src/styles/compiled.css` already covers `molecules/list-item/types.ts`. Any story-only layout utility is therefore already scanned, and the implementation must not add a redundant `@source` line or copy a story utility into production CVA.

## 8. Registry, exports, consumption and catalog

### 8.1 Prop-naming registry

- Reused approved conventions, no new semantic ID and no exception: `variant` → `visual-treatment`, `size` → `preset-dimensions` (same density meaning as Notice `md | sm`), `status` → `item-presentation-status`, `asChild` → `slot-composition`, `ListItemTitle.level` → `heading-level`.
- Append usages: `ListItem` under `preset-dimensions` (`type: ListItemSize ('md' | 'sm'); editorial values only`) and `ListItemTitle` under `heading-level` (`type: 2 | 3 | 4 | 5 | 6 (default 3)`), each with `source: {path, symbol, revision}` after manually re-reading the public symbol.
- Refresh every existing `ListItem` usage revision (`visual-treatment`, `slot-composition`, `item-presentation-status`) to the new whole-file `sha256:` of `packages/ui/src/molecules/list-item/types.ts`. The current reviewed hash is `sha256:32748d00736596f3fb04297aea7f903e74152f8f0e430974160a6cad8a1135f2`; it becomes stale the moment the file changes, and `pnpm props:check` fails on stale evidence.
- Order: edit JSON → `pnpm props:docs` → `pnpm props:check` → `pnpm test:props`. Never hand-edit `docs/prop-naming.md`. Convention approval stays separate from component/plan approval and is not promoted here.

### 8.2 Exact sorted package export lists

Component exports (used in `list-item-contract.test.ts`, `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs`):

```
ListItem, ListItemActions, ListItemBody, ListItemContent, ListItemFooter,
ListItemLeading, ListItemMedia, ListItemMeta, ListItemTitle, ListItemTrailing
```

Type exports:

```
ListItemPartProps, ListItemProps, ListItemSize, ListItemStatus, ListItemTitleProps, ListItemVariant
```

`packages/ui/src/index.ts` needs no change. `listItemVariants`, `listItemPartVariants`, `listItemExampleVariants` and `useListItem*` stay internal (the delivery test already asserts `exported.listItemVariants === undefined`).

### 8.3 Consumption cases with type-level negatives

Add to `scripts/package-consumption.test.mjs`: an editorial SSR sample using `ListItem` `asChild` + `<li><a>` with `ListItemLeading` (`<time dateTime>12<small>SEP</small></time>`), `ListItemBody` (`ListItemTitle`, `ListItemMeta`), `ListItemTrailing` (duration text); a static `editorial-divided` sample; and the negatives already in the file's style — `{ status: 'empty', variant: 'editorial', asChild: true, children: element }`, `size: 'lg'`, `ListItemTitle` `level: 7`, `level` on the root, `ref`/`role`/`tabIndex` on the new parts, plus the two new type imports. Extend `assertListItemCSS` with the flush, hover, focus and motion selectors and keep its existing list intact.

### 8.4 Catalog rows and revision refresh

`scripts/catalog_data.py`, then `python3 scripts/build_catalog.py` (never hand-edit the generated files):

- `ListItem` row (currently "PostCard" → `ListItem`, `renombrar`): refresh the note to state the approved v0.2 editorial family — `editorial` raised row and `editorial-divided` flush hairline row, `size` `md | sm`, `ListItemLeading` / `ListItemTitle` / `ListItemTrailing`, whole-row anchor through `asChild` with interactive-only hover, `ListItemActions` unsupported inside a link, no stylesheet, no token or dependency change — and keep the v0.1 sentence.
- The three absorbed rows (`ArticleItem`, `NoteItem`, `StreamItem`) already read "ListItem row variant"; refresh them to name the exact values (`editorial` / `editorial-divided`) so the absorption is verifiable. The organism rows that compose "ListItem row variant" (`NotesBoard`, `BlogGrid`, `LiveBand`) stay unchanged: their wording remains accurate.
- Note text keeps the file's existing Spanish register; the English rule applies to code, tests and new component documentation, not to a legacy generated catalog rewrite.

## 9. Planned commands, gates and browser checks

**Expected implementation commands (nothing here has been run):**

1. Focused during TDD: `pnpm exec vitest run packages/ui/src/molecules/list-item`.
2. Contract harness: `pnpm exec vitest run packages/ui/src/lib/list-item-contract.test.ts packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts`.
3. Consumer regression: `pnpm exec vitest run packages/ui/src/organisms/calendar-grid packages/ui/src/molecules/list-item`.
4. Registry: `pnpm props:docs`, `pnpm props:check`, `pnpm test:props`.
5. Catalog: `python3 scripts/build_catalog.py`.
6. Full gates before merge, in this order: `pnpm tokens`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm storybook-build`.

`pnpm tokens` precedes `pnpm build` because the UI stylesheet build resolves `@egdev/tokens/theme.css`; `pnpm build` is what proves the new utilities reached `packages/ui/dist/styles.css`.

**Browser check before merge (Storybook, real Chromium):**

1. Controls: `variant` shows five options, `size` two with `md` documented, `ListItemTitle.level` `2…6` with `3` documented, `children` row present with `control: false` and its reason, no owned diagnostics.
2. Editorial raised row: at rest, on pointer hover of a linked row (brand border + wash, no shift outside the row), and on a static row (no affordance at all).
3. `editorial-divided`: no background, no shadow, no radius, a single bottom hairline, hover wash plus start indent inside the row, and no layout shift of neighbours.
4. Focus: `--shadow-focus` visible on the row at the normal offset, no double outline, one tab stop per linked row, static rows unreachable.
5. `new` status on a divided row repaints it; `empty` with an editorial value renders the v0.1 empty action.
6. `size` `md` vs `sm` side by side against VIS-04: leading column, day and title steps.
7. Narrow viewport and a very long title: zones wrap, nothing clips, the title is never truncated or clamped.
8. Reduced motion: hover/focus changes appear without transition; no transform anywhere.
9. Contrast and typography of the meta line, the day/month stamp, the brand category segment and the duration against VIS-03–VIS-05, recording the §4.4 limitation explicitly instead of claiming conformity.
10. Docs page renders the autodocs table for all ten components with accurate requiredness, enums and defaults.

Runtime evidence is written under `docs/components/list-item/v0.2/observed/` with the conditions used; the expected-design PNGs and `capture.json` stay unmodified. Differences are recorded per criterion; a comparison never replaces a reference.

## 10. Risks

| Risk | Mitigation |
| --- | --- |
| Specificity, not order, now decides editorial paint. A later edit that reorders or re-nests these utilities can silently invert the flush/status/hover resolution | Every editorial rule is compound-keyed (`data-variant` + `data-state` + `[&:is(a)]`), asserted in the contract test and verified in the browser cascade (§9.3) |
| `:is(a)` only matches real anchors; a framework link component that renders something else gets no hover affordance | Documented in JSDoc and meta guidelines; a static-looking row stays readable and focusable through its own element |
| Compensated `ps`/`pe` indent assumes the row's `p-4` base padding. A future padding change breaks the "no shift outside the row" promise without failing a test | The browser check measures neighbour shift; the recipe is documented next to the base padding |
| Brand tint on a raised row does not meet small-text AA (`--color-fg-brand-raised` 4.30:1 on `surface-1`) | Recorded limitation per the existing "Todo neón" owner decision; Q3 asks the owner to confirm or drop the tint; `LR-12` stays an observation, never a compliance claim |
| `border-border-brand` at 1.74:1 is documented as decorative and cannot delimit a control by itself | Hover accent only; the anchor keeps its text name and focus ring |
| Title weight 600 and duration 19.2px are approximated by token steps | Recorded as allowed differences in §4.4; no token change is proposed |
| `data-size` becomes an observable DOM attribute on a public root | Documented as a dimension attribute mirroring `data-variant`; Q4 asks the owner to confirm the mechanism |
| Plan-time recipe emission was proven with a scratch in-memory compile, not a build | Re-proven by the LR-12 scan and by `pnpm build`; this note is preparation evidence only |
| Scratch directory from plan preparation may remain at `/tmp/li-plan-probe` | Outside the worktree; the parent may remove it. No scratch file remains in the repository (`git status --short` shows only the pre-existing `odd/tasks/web-catalog.md`) |
| Visual hashes are not bound by the approval comment | Q1; if unanswered, delivery reports visual conformity as Not evaluated |

## 11. Owner questions (closed set, with recommendation)

**Q1 — Do VIS-03, VIS-04 and VIS-05 count as adopted expected-design references for this plan?**
The approval comment names `version: 0.2` and `contentSHA256` only; the contract lists the three PNG hashes separately.
Options: **(a)** adopt them now and record the three hashes in the approval reply; **(b)** keep them Proposed and have delivery report visual conformity as Not evaluated; **(c)** treat them as adopted by the contract approval without a separate reply.
Recommendation: **(a)** — one line binds `27898d46…`, `e035c068…`, `e179eac7…`, and §9 can then compare against real references.

**Q2 — May an editorial row put its meta line above the title?**
`spec.md` §2 says `ListItemBody` stacks `ListItemTitle` then `ListItemMeta`, while VIS-03 (ArticleItem) and the web markup render an uppercase meta line above a two-line title.
Options: **(a)** allow the consumer's authored order inside `Body` and document one order per family (Article: meta then title; Note/Stream: title then meta); **(b)** keep title-then-meta strictly and record the Article order as an allowed difference; **(c)** add a new `metaPosition` prop.
Recommendation: **(a)** — the parts are consumer-composed, DOM order already equals visual order, and (c) would encode a second layout axis the contract does not have. This would need a one-line spec amendment in the next authorized comment.

**Q3 — Which token carries the highlighted category segment on a raised row?**
No brand text token meets small-text AA on `surface-1`.
Options: **(a)** `text-fg-brand-raised` per the existing "Todo neón" owner decision, recording the AA limitation; **(b)** `text-fg-secondary` only — AA-safe but drops the brand identity of the category; **(c)** brand tint only on `editorial-divided`, where the page canvas keeps `text-fg-brand-default` at 4.61:1.
Recommendation: **(a)** — it matches the decision already recorded in the token comments and keeps the three web molecules recognisable; LR-12 records the limitation instead of claiming conformity.

**Q4 — Is `data-size="md|sm"` on the public root acceptable as the part-styling signal?**
The three new parts must follow the root without new part props and without dynamic custom properties.
Options: **(a)** accept a documented `data-size` presentation attribute (mirrors `data-variant`, no mirrored state classes); **(b)** add a `size` prop to each new part; **(c)** no DOM signal — parts cannot vary with the root.
Recommendation: **(a)** — (b) triples the public API of a single root decision and (c) cannot express the approved `sm` density without the dynamic geometry the contract forbids.

## 12. Review budget

Estimated later implementation: roughly 700–950 changed lines including tests, stories and harness updates, no consumer migration. Suggested review slices: (1) `types.ts` + `useListItem.ts` + `ListItem.tsx` + `ListItem.test.tsx` (~450–600 lines) with the contract and VIS references kept together; (2) stories, metadata, and the contract/package/registry/catalog evidence (~250–350 lines).

**Stop.** This plan is preparation: it records the approved contract, the intended surfaces, the recipes, the test-first order and the open questions. It does not implement, measure or approve anything. Implementation starts only after the owner approves this payload and the parent assigns the edit surfaces.
