# SectionNav v0.3 — implementation plan

- **Status:** Proposed, never approved. Presented for separate owner approval (S6). It authorizes no code, tests, registry write, artifact or catalog regeneration, capture, release or Git action. Nothing below is implemented or measured: preparation was read-only, and no build, test, Storybook, browser or capture ran. Besides inspection and hashing, the only executions were an in-memory accessible-name check of two HTML snippets (§4) and arithmetic on token hex values (§1, G2).
- **Coverage:** S2, S3 and S6 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md), issue #563 only; this is the plan gate that precedes implementation under T6. Format and obligations follow the [Carousel v0.4 plan](../../carousel/v0.4/implementation-plan.md).
- **Contract authority:** [spec.md](spec.md) v0.3, Approved on 2026-11-26 and amended on 2026-11-26 (finding F1, [approval.md](approval.md) Amendment 1). `contentSHA256: 362df467cb74e034735bbd559b93e67208e67dce5485436a5d7778fe753e15bb` (originally approved payload: `83f23fa23ef46a407cac5b96490fc9de030f1d7f872eafd94e738013f5c9052f`), reproduced byte-exact in this working tree by two independent methods with the spec's own rule (payload from the line-start `## 1. Purpose and scope` through EOF, LF, final newline). Approval record: [approval.md](approval.md): owner answer, verbatim "Aprobar todas (Recomendado)", 2026-11-26 (L5), given on the committed draft (`7ed25eb`, payload `c317943f9eaaedaa68ffa461eca96f5ab748e1155b776c8d2c2f209a8bfbf5b2`) with the recommended answer to OQ-1 to OQ-4. The cataloging approval is L3, "#563: SectionNav parity, with no API change". Visual hashes: VIS-01 to VIS-03 Pending.
- **Re-approval (2026-11-26):** the owner's answer "Mantener el token y ajustar PAR-07 (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L6, finding F1, decision D1 option (a)) is recorded as the new approval of the amended spec and of this plan's pinned spec hash. This plan's payload is unchanged, so its own `contentSHA256` below is unchanged; only the pinned spec hash above moved. Read §1 G2, §4 and §13 D1 with the amended spec: F1 is resolved by keeping `text-fg-brand-raised` (the neon `#FF0036`), PAR-07 now documents about 3.92:1 on `surface-2` and 3.42:1 on `surface-3` for a number that is supporting text, no 4.5:1 assertion and no `storybook-css.test.ts` guard are written, and the plan's other sections stand.
- **Plan identity:** `contentSHA256: 91ee758ede17b0a56237a75462a1aa6fded677bd3bac8bd156fec30801f5a6e2` — SHA-256 of the UTF-8, LF, final-newline payload from the exact `## 1. Authority and gates` heading line (anchored at line start; this metadata's inline mention does not count) through EOF; the metadata above it is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `8f50f0b` plus the uncommitted finalized spec and approval (draft spec commit `7ed25eb`). Whole-file SHA-256 of the sources, read in this working tree: `types.ts` `bc0f8e59…620a` (equal to the `revision` of all eight registry usages and to the spec's "Reviewed source"), `useSectionNav.ts` `0263f44f…9c6b`, `SectionNav.tsx` `4a070a4f…a4da`, `SectionNav.test.tsx` `8eb038f1…3248`, `SectionNav.stories.tsx` `7cf81e42…4262`, `index.ts` `641edbd5…9245`. The shared integration files (registry, generated docs, artifact, catalog, changelogs) change with every Round 5 component and are not pinned: re-verify them at implementation and regenerate instead of hand-merging.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surface of §2, including the integration surfaces the parent owns. The contract approval alone grants no code (S6). Approving the plan approves no capture, release or GitHub write.
2. **G2 — Finding F1: the spec's contrast figures are stale. Resolve before G1 (D1).** Spec block 5 and PAR-07 take `fg-brand-raised` as `#FF6680` (5.51:1 on the solid `surface-2`, 4.82:1 on `surface-3`), the values of `docs/MATERIAL.md:34` and `docs/DECISIONES.md:84`. `packages/tokens/src/theme.css:111` resolves the token to the neon `--color-primitive-red-neon` (`#FF0036`) since commit `90a7387` ("make brand text neon across components and Storybook", the owner's "Todo neón" decision of 2026-11-01), and its own comment records 4.30, 3.92 and 3.42:1 on `surface-1`, `-2` and `-3` ("Small text does not meet WCAG AA except on the canvas"). Recomputed here from the hex values with the WCAG formula: `#FF0036` is 3.92:1 on the solid `surface-2` fallback (`#232428`) and 3.42:1 on `surface-3` (`#2D2E33`); `#FF6680` is 5.51:1 and 4.82:1, which shows the spec's figures belong to the old value. So the approved recipe `text-fg-brand-raised` follows the system's brand-text decision (`--color-link-default` uses the same token, `theme.css:185`), but PAR-07's "at least 4.5:1 on the solid fallback" and the contrast paragraph of block 5 cannot be met as written for an 11.2px, weight 600 number that is part of the link's accessible name (OQ-1). This plan neither edits the spec nor works around it. Nothing else in the spec depends on the colour value: D1 decides the PAR-07 row (§4) and, only under option (b), the number recipe.
3. **G3 — Registry.** No new convention, no new usage and no exception: `SectionNavProps` gains no prop. The plan refreshes eight source revisions and adapts one test pin (§5.1). No status, approval or receipt JSON changes, and the v0.1 receipts stay untouched.
4. **G4 — Recipes, tokens and files.** The two recipes are approved in the spec (OQ-2, OQ-3). No token, dependency, Radix package or stylesheet is added. **No stylesheet**: no `section-nav.css` is created and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical. Every utility is a static literal inside a CVA string composed per part with `cn()`: no inline style, interpolated class, `eg-section-nav__*` class or new AGENTS.md exception.
5. **G5 — The name promise is proved, not assumed.** `02 Beta` needs a real separator in the DOM (spec block 5). The exact-name RED tests must fail first, and the separator is a text node, not a CSS gap.
6. **G6 — Integration ownership.** Registry JSON and generated view, the system artifact, catalog source and outputs, package harnesses, the docgen and registry test pins and changelogs are parent-owned integration surfaces, as in the Carousel plan. A writer touches only the five SectionNav component files of §2. `packages/ui/src/index.ts` and `organisms/section-nav/index.ts` do not change.
7. **G7 — Browser evidence needs D3.** PAR-06 and PAR-09 and VIS-01 to VIS-03 stay Pending, and visual conformity Not evaluated, until Storybook and Playwright MCP are authorized.
8. **G8 — Stop lines.** Stop and return to the owner if: D1 is unresolved; a utility does not emit or `cn()` drops it; the accessible name in the test DOM is not `02 Beta` once the separator is in; `SectionNavProps`, the barrels or a variant axis would have to change; a generator demands an edit outside §2; or a token, dependency or stylesheet appears necessary.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/organisms/section-nav/types.ts` | Writer | Two new internal recipes after `sectionNavLinkVariants` (`:98`), exported from `types.ts` like the other six and not from the barrels: `sectionNavNumberVariants` and `sectionNavLabelVariants` (§3); one English sentence appended to the `items` JSDoc. No existing recipe is edited; `@control false` and `@controlReason` unchanged | +5 / −1 |
| `packages/ui/src/organisms/section-nav/useSectionNav.ts` | Writer | Import the two recipes; a module-level, unexported `formatSectionNumber` (no new module); `currentNumber` (`:88`) and `rows[].number` (`:91`) become padded strings, `currentNumber` is `undefined` when no item matches; return `numberClass` and `labelClass` next to `linkClass`. No behavior, focus, event or popover change | +10 / −2 |
| `packages/ui/src/organisms/section-nav/SectionNav.tsx` | Writer | Apply the two classes to the existing spans in the disclosure (`:21-22`) and in every row (`:52-53`), with a `{' '}` text node between them. No new element, prop or attribute | +5 / −4 |
| `packages/ui/src/organisms/section-nav/SectionNav.test.tsx` | Writer | New `describe('SectionNav numbers and labels (v0.3, #563)')` (§4, T1 to T9); every existing test stays unedited | +165 |
| `packages/ui/src/organisms/section-nav/SectionNav.stories.tsx` | Writer | `ManySections` story and one meta JSDoc sentence (§6) | +22 / −1 |
| `packages/ui/src/organisms/section-nav/index.ts`, `packages/ui/src/index.ts` | none | No change: no new export or type | 0 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | One assertion in the SectionNav docgen test (`:647`): the `items` description mentions `zero-padded` (§5.2) | +4 |
| `packages/ui/src/lib/storybook-controls.test.ts`, `packages/ui/src/lib/storybook-css.test.ts` | Parent | **No edit expected.** No own prop, control or preview utility changes. They run to prove it (`storybook-css.test.ts` gains a guard only under D1 option (b), §4) | 0 |
| `scripts/prop-naming.test.mjs` | Parent | Pin the receipt's recorded revision as a literal in `SectionNav binds accessible-name exceptions and their source evidence` (`:1964-1968`), §5.1 | +4 / −1 |
| `skills/_shared/prop-naming.json` | Parent | Refresh eight `source.revision` values (`:263`, `:337`, `:1708`, `:3974`, `:4743`, `:4840`, `:4937`, `:5165` at baseline), §5.1 | +8 / −8 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; eight lines (`:38`, `:67`, `:111`, `:114`, `:142`, `:143`, `:152`, `:208`); never hand-edited | +8 / −8 |
| `scripts/design-system-artifact.test.mjs` | Parent | One SectionNav assertion after the Carousel one (`:111-167`), §5.3 | +24 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited | 1 minified line; ≈ +14 / −1 |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent | SectionNav row note (`catalog_data.py:106`), then one `build_catalog.py` run (§5.4) | ±1 line each |
| `scripts/package-exports.test.mjs` | Parent | One declaration test for the five utilities beside `:1542`, and number and label assertions in the SSR test (`:1583`), §5.5 | +30 |
| `scripts/package-consumption.test.mjs` | Parent | `assertSectionNavConsumerCSS` (`:5543`) and the SSR block (`:6528`) extended the same way | +16 |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | Entries under the existing unpacked sections, citing `(#563)` (§7) | +8; +3 |
| `docs/components/section-nav/v0.3/implementation-evidence.md` (+ `capture.json` and PNGs only if D3) | Parent | Observed RED and GREEN output, browser table, hashes (§9) | +40 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the plan approval and the delivery | +6 |

Explicitly untouched: `packages/tokens/**`; `packages/ui/src/styles/**` (`compiled.css:66` already scans `../organisms/section-nav/types.ts`; the legacy bundle is frozen); `.storybook/**`; package manifests and versions; other components; the v0.1 and v0.2 documents and receipts; the spec and the approval record.

## 3. Design of the change

**API.** None changed: `SectionNavProps`, its `@control` tags and the barrels stay identical (PAR-08). The only public-facing text is one sentence appended to the `items` description, planned as "Ordered section destinations. The number shown for each section is its 1-based position in this array, zero-padded to at least two digits." Keep `zero-padded to at least two digits` on one JSDoc line so the docgen description is not split inside the phrase that §5.2 and §5.3 assert.

**Recipes.** Two static literals, with no template or concatenation, so the Tailwind scanner (`compiled.css:66`), the CVA scan of the packed-CSS tests and the artifact builder all read them:

```ts
export const sectionNavNumberVariants = cva('font-display text-meta tabular-nums text-fg-brand-raised');
export const sectionNavLabelVariants = cva('font-display text-meta uppercase');
```

No existing recipe is edited: the trigger keeps its reset baseline (`font-sans text-body-default …`, `types.ts:92`) and the reset test (`SectionNav.test.tsx:36-54`) stays valid. Each span is its own element, so its `font-display text-meta` never conflicts with the trigger or link recipes inside `cn()`; `cn.ts:22` lists `meta` among the font-size tokens, so `text-meta` and `text-fg-brand-raised` are not merged away.

**Hook.**

```ts
/** Position shown beside a section: 1-based, at least two digits. */
function formatSectionNumber(position: number) {
  return String(position).padStart(2, '0');
}
…
currentNumber: current ? formatSectionNumber(currentIndex + 1) : undefined,
rows: items.map((item, index) => ({ item, number: formatSectionNumber(index + 1), … })),
…
numberClass: cn(sectionNavNumberVariants()),
labelClass: cn(sectionNavLabelVariants()),
```

`current` is `undefined` when `activeId` matches nothing, so the disclosure can never render `00` (the JSX gate `nav.current &&` stays). Numbers come from array order only and are never stored or keyed by `id`.

**JSX**, on both surfaces, shown for a row:

```tsx
<span className={nav.numberClass}>{row.number}</span>{' '}
<span className={nav.labelClass}>{row.item.label}</span>
```

The `{' '}` text node makes the accessible name `02 Beta` in an unstyled DOM. A flex container does not render a whitespace-only text node, so layout is unchanged.

**Contract recap (spec v0.3, promises unchanged).** Anatomy: root, pill, disclosure, next link, edge and portalled index as in v0.2 §2; the two existing spans per surface gain recipes, with no new element or marker class. API and defaults: none changed. States: no new state, attribute or class; the number colour is the same on every row. Accessibility: index link name `02 Beta`, disclosure name `disclosureLabel`, next name `nextLabel`, `aria-current="location"` unchanged, no live announcement. Radix: the existing Popover only, no new package. Material: unchanged (Surface overlay and its solid `surface-2` fallback), with no handwritten shadow, gradient or colour. Files: the six mandatory files, **No stylesheet**. Consumer and canvas: the v0.2 story decorator is unchanged; consumer tests that pin an exact link name such as `1 About` must change to `01 About` (spec block 3).

**Emission inventory.** Each static utility, the declaration it must emit, and where it is proved:

| Utility | Required emitted declaration | Proof |
| --- | --- | --- |
| `font-display` | `font-family: var(--font-display…)` | pattern at `package-exports.test.mjs:4804`; E1 |
| `text-meta` | `font-size: var(--text-meta)` with the token's line height, weight and tracking | E1 |
| `tabular-nums` | `font-variant-numeric` | pattern at `package-exports.test.mjs:3238`; E1 |
| `text-fg-brand-raised` | `color: var(--color-fg-brand-raised…)` | pattern at `package-exports.test.mjs:3563`; E1 |
| `uppercase` | `text-transform: uppercase` | E1 |

## 4. Test-first sequence

Public-interface tests first, with the intended RED captured verbatim before any implementation (the evidence file records the command, exit code and counts). Browser-only paint and geometry are not claimed from jsdom; they sit in §9.

**Premise checked in advance (in memory, nothing written).** With the repository's own `dom-accessibility-api`, today's markup `<span>2</span><span>Beta</span>` yields the accessible name `2Beta`, and `<span>02</span> <span>Beta</span>` yields `02 Beta`. So the exact-name tests below fail today for a real reason, and the whitespace text node is what satisfies them.

**New unit tests** (`SectionNav.test.tsx`; roles, accessible names and `userEvent`; no complete class strings, no `data-testid`; the existing 3-item `items` fixture plus 12-item and 100-item fixtures of `Section N` labels):

| ID | Test | Covers |
| --- | --- | --- |
| T1 | 3-item fixture, index open: rows are named `01 Alpha`, `02 Beta`, `03 Gamma` through `getByRole('link', { name })`, and each row's text contains the number, one space and the label | PAR-01, PAR-03 |
| T2 | 12-item fixture: `09 Section 9`, `10 Section 10`, `12 Section 12`; nothing is truncated or re-padded | PAR-01 |
| T3 | 100-item fixture: row 9 `09 Section 9`, row 99 `99 Section 99`, row 100 `100 Section 100`; no row name starts with `00` | PAR-01 |
| T4 | `rerender` with the items reordered, one inserted and one removed: numbers follow array order, never `id` | PAR-01 |
| T5 | Disclosure: with `activeId` `b` the trigger text is `02 Beta`; after `rerender` with `c` it is `03 Gamma` and focus is still on the trigger; unmatched: the trigger shows no digit or label, while the open index still shows each row's own number and no row is current; empty `items`: no button and no `00` anywhere in the document | PAR-02 |
| T6 | Names and roles stay as specified: disclosure name `Open sections`, next link `Go to Gamma`, the current row is `aria-current="location"` and named `02 Beta`; the number spans carry no `aria-hidden` while the Pixel stays `aria-hidden` | PAR-03 |
| T7 | Casing is CSS only: the label's `textContent` equals the host label (`Beta`, never `BETA`) and the label part carries `uppercase`; activating the `02 Beta` row calls `onNavigate` with `items[1]` (the host's object, never a formatted string) | PAR-04 |
| T8 | Part recipes on both surfaces (the pill and one row): the number has `font-display`, `text-meta`, `tabular-nums` and `text-fg-brand-raised`; the label has `font-display`, `text-meta` and `uppercase`; neither has `font-sans`, `text-body-default` or an arbitrary-value utility; the portalled dialog has no `eg-section-nav__*` class; a root `className` such as `mt-4` reaches neither part | PAR-05 |
| T9 | The number colour carries no state: every row's number part has the same class list, the current row's included, and each contains `text-fg-brand-raised`; the current row keeps `aria-current` and the underline utility | PAR-07 (non-colour cues) |

All nine fail before implementation; the PRESERVE assertions inside T6 and T7 (names, `onNavigate` payload) pass on their own.

**RED to GREEN per acceptance criterion.**

| AC | RED test | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| PAR-01 | T1 to T4 | `Unable to find an accessible element with the role "link" and name "01 Alpha"`: the name today is `1Alpha` (bare integer, no separator) | Same runner green |
| PAR-02 | T5 | The trigger text is `2Beta`, not `02 Beta` | Green; unmatched and empty assertions are PRESERVE-like |
| PAR-03 | T1, T6 | Names are `2Beta`, not `02 Beta` | Green; existing name queries unmodified |
| PAR-04 | T7 | The label has no `uppercase` class (the DOM-text and `onNavigate` parts pass today) | Green |
| PAR-05 | T8; the existing packed-CSS scan; new declaration checks (§5.5) | The parts carry no recipe class | Green; emission after `pnpm build` |
| PAR-06 | Not a unit test: browser (§9, D3) | — | Pending |
| PAR-07 | T9 and the existing SN-01 tests. **The 4.5:1 clause is blocked by D1.** Under (a) the spec is amended to the resolved figures and no 4.5:1 assertion is written. Under (b) a guard in `storybook-css.test.ts` resolves the chosen token and `--color-surface-2` and `-3` from `packages/tokens/src/theme.css` (it already reads that file, `:845`) and asserts at least 4.5:1: RED against today's token at 3.92:1 and 3.42:1 | T9: the number part has no class | T9 green; contrast row per D1; real-page contrast Not evaluated |
| PAR-08 | The existing suite unmodified; the type tests; `git diff --stat` on the barrels; `props:check`, `test:props`, `test:system` | Predicted from the code, to be captured: after the `types.ts` edit and before §5.1, `pnpm props:check` reports `Stale evidence revision: packages/ui/src/organisms/section-nav/types.ts` and `pnpm test:props` fails in the registry tests that compare recorded revisions with the live file, including `SectionNav binds accessible-name exceptions and their source evidence` (the receipt records `bc0f8e59…`) | Green after the refresh and the pin (§5.1) |
| PAR-09 | Not a unit test: browser, before and after with the same long-label fixture (§9, D3) | — | Pending |

**PRESERVE and differential.** The shared code is the hook's two derivations and the two span pairs, used by both surfaces. Evidence that previous behavior holds: the existing tests unmodified (audited: the only text-dependent assertions use a regex or a substring, `:66`, `:145`, `:159`, `:178`, `:188`, `:201`, so they pass without edits), T6 and T7, and one differential render check on a copy of the base commit in `mktemp -d` (not committed): static markup of `{closed, open} × {matched, unmatched, empty}` must be byte-identical between the base copy and the change once the number text, the separator text node and the two part `class` attributes are normalized. Any difference nobody asked for is a regression to fix and pin with a test.

**GREEN order.** The nine tests (RED captured) → `types.ts` → `useSectionNav.ts` → `SectionNav.tsx` → focused runner → stories → docgen assertion → registry (hash last) → artifact → catalog → changelogs → package fixtures.

## 5. Registry, docgen and artifact obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

No usage is appended: there is no new or changed own prop. Hash only after `types.ts` is final and `pnpm lint` is clean on it; any later edit, even formatting, requires re-hashing.

1. Compute the whole-file SHA-256 of the final `types.ts` and review `SectionNavProps` by hand: only the `items` description changed, and its type, requiredness and tags are identical.
2. Refresh the eight existing SectionNav usages, all currently `sha256:bc0f8e59bd0b872d303a0f78c35a5fea2cdbeae5bb2ce07f1e5b4b6801b9620a`: `active-section-id`, `primary-value`, `accessible-name`, `collection-items`, `open-state`, `initial-uncontrolled-open`, `open-change` and `navigation-intent`. All eight carry the same new hash. `--write` never refreshes evidence, so these are explicit edits.
3. `pnpm props:docs` regenerates `docs/prop-naming.md` (never by hand), then `pnpm props:check` and `pnpm test:props`.
4. **One test pin moves.** `SectionNav binds accessible-name exceptions and their source evidence` (`scripts/prop-naming.test.mjs:1942`) compares the receipt's recorded `source.revision` with the live digest of `types.ts` (`:1964-1968`). The receipt `docs/components/section-nav/v0.1/accessible-name-exceptions-approval.json` binds the file the owner reviewed (`bc0f8e59…`) and is a historical record, so it is not edited. The plan pins that receipt revision as the literal `sha256:bc0f8e59bd0b872d303a0f78c35a5fea2cdbeae5bb2ce07f1e5b4b6801b9620a`, with a comment saying later amendments move the live file, as the literal revisions at `:1087`, `:1446`, `:1802`, `:1854`, `:1918` and `:2047` already do. The live-file comparison stays where it belongs, on the registry usages (`:3836-3837`). This is the spec's "Plan prerequisite" made concrete; the spec's statement that approval hashes are unaffected still holds, because the pin concerns the evidence revision, not a convention or exception hash.

### 5.2 Docgen and Controls pins

- `storybook-docgen.test.ts` (`:647`): add `expect(doc?.props.items?.description).toMatch(/zero-padded/)`; every existing assertion (required props, protected native boundaries, barrel pins at `:2161` and `:2301`) stays as is.
- `storybook-controls.test.ts`: unchanged. `items` keeps `@control false` and its reason, no own prop is added, and `ownPropCounts` does not move. It runs to prove that.

### 5.3 System artifact

`pnpm artifact --write`, then `pnpm system:docs`. Expect the SectionNav entry to gain the zero-padded sentence in the `items` description, the `sectionNavNumberVariants` and `sectionNavLabelVariants` recipes in `variants` and `anatomy`, two `layout` expressions (`cn(sectionNavNumberVariants())`, `cn(sectionNavLabelVariants())`) and any new shared entries in `anatomyUtilities`; the ten props are unchanged. The artifact is 610,264 bytes against the 786,432-byte (768 KiB) shipped-JSON budget and the 1 MiB artifact budget asserted in `design-system-artifact.test.mjs` (`:1300`, `:1321`); confirm it stays under both. Add one test after the Carousel one: SectionNav still publishes the same ten props, `items` mentions `zero-padded`, `sectionNavNumberVariants` lists `font-display`, `text-meta`, `tabular-nums` and `text-fg-brand-raised`, `sectionNavLabelVariants` lists `font-display`, `text-meta` and `uppercase`, and the trigger recipe still lists `font-sans` and `text-body-default`. Then `artifact --check`, `system:check`, `test:artifact` and `test:system` green.

### 5.4 Catalog

In `scripts/catalog_data.py:106` insert before "No scroll tracking or global shortcuts.": "v0.3 ([#563](https://github.com/egdev6/egdev-design-system/issues/563)) shows each section's number zero-padded (`01`) in the raised brand colour and its label in uppercase display type, in the disclosure and in the index, with no API change." Then one `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` run; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`.

### 5.5 Package fixtures

`package-exports.test.mjs`: the existing `SectionNav ships every recipe utility…` test (`:1542`) already walks every `cva` literal in `types.ts`, so the new recipes are covered for selector presence with no edit. Add one test beside it with selector and declaration pairs, in the style of `:3238` and `:3563`: `.font-display`, `.text-meta`, `.tabular-nums`, `.text-fg-brand-raised`, `.uppercase`. Extend the SSR test (`:1583`): in the closed state with `activeId: 'one'` the trigger holds a number span with the four number classes and the text `01`, a text node, and a label span with the three label classes and the text `One`. `package-consumption.test.mjs`: `assertSectionNavConsumerCSS` (`:5543`) gains the five selectors against the shipped stylesheet, and the SSR block (`:6528`) the same trigger assertions. No ref, no React 19-only API; React 18.3.1 and 19.3.0 run only through the existing packed harness.

## 6. Stories and Controls

`Organisms/SectionNav` keeps autodocs, `satisfies Meta<typeof SectionNav>`, no manual `argTypes` and no `play`; the new story is English and typed `Story`. Existing stories and the v0.2 canvas decorator are unchanged.

- `ManySections`: 12 items (`Section 1` to `Section 12`, ids `section-1`…, hrefs `#section-1`…), `defaultOpen: true`, `activeId: 'section-10'`, `nextLabel: 'Go to section 11'`, `value: 83`. JSDoc: "Twelve sections with the tenth current: the open index shows zero-padded numbers across the 09 and 10 boundary." This is the VIS-01 to VIS-03 scenario.
- Meta JSDoc: append "Each section is numbered by its position in `items`, zero-padded, and labels render uppercase through CSS."
- Controls: no own prop changes. `items` stays `@control false`, so the 12-item array is a story arg, not a control. Real browser Controls are checked in §9 only if D3 is granted.

## 7. Changelog entries

S2's "existing `## 0.11.0` sections" names the unpacked release set (ui 0.11.0, effects 0.2.12, system 0.13.0, mcp 0.4.12, commit `7afaabd`). `@egdev/system`'s own `## 0.11.0` is an old packed section ("Fixed", #547), so its entry goes under its unpacked `## 0.13.0`, as the #556, #557 and #558 entries did. No manifest, version or `release.json` change: nothing here touches tokens or cli (S2).

`packages/ui/CHANGELOG.md`, `## 0.11.0`, a new `### Changed` subsection after `### Added`:

```md
### Changed

- SectionNav shows each section's number with at least two digits (`01`, `09`, `10`, `100`) in the raised brand
  colour and its label in uppercase display type, in the disclosure and in every index row. The number is the item's
  position in `items`; the props, the label text and the `onNavigate` payload are unchanged, and each index link's
  accessible name now reads `02 Beta`. Consumer tests that pin an exact link name such as `1 About` must change to
  `01 About`. (#563)
```

`packages/system/CHANGELOG.md`, `## 0.13.0`, one bullet under the existing `### Added`:

```md
- The source-derived artifact and reference include SectionNav's number and label recipes and the `items` description
  of its zero-padded numbers; existing props are unchanged. (#563)
```

`(#563)` marks the issue fully resolved, as [versioning](../../../distribution/versioning.md) requires for consumer requests, and `release.json` collects it from these versioned sections at the next `release:pack` (T7). If D4 narrows the claim, write `Refs #563` instead.

## 8. Checks to run

All commands are **future**, run from the repository root, one at a time in the foreground, and only with explicit authorization. None has been run for this plan. The first command is the identical RED and GREEN runner.

```sh
pnpm exec vitest run packages/ui/src/organisms/section-nav packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/ui/src/index.ts packages/ui/src/organisms/section-nav/index.ts packages/tokens packages/ui/src/styles .storybook
pnpm typecheck
pnpm props:docs
pnpm props:check
pnpm test:props
pnpm artifact --write
pnpm system:docs
pnpm artifact --check
pnpm system:check
pnpm test:artifact
pnpm test:system
PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py
pnpm lint
pnpm test
pnpm build
pnpm test:package-exports
pnpm test:package-consumption
pnpm test:mcp
pnpm storybook-build
git status --short
```

The `git diff --stat` scope check must print nothing, and the final `git status --short` must list only §2 paths: no scratch, cache or `.playwright-mcp/` output. `pnpm build` may regenerate artifacts: recheck `pnpm artifact --check` afterwards. `pnpm test:package-consumption` creates isolated fixtures and may install dependencies, so it needs specific permission and a verified offline cache; it must exercise React 18.3.1 and 19.3.0 with shipped tokens and UI CSS and no Tailwind compiler, and any unavailable matrix is recorded as pending. `pnpm test:mcp` builds `@egdev/mcp`, which serves the artifact (S5d adds it to CI): run it once after the artifact refresh. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens test, `test:package-exports` and `test:package-consumption`; the artifact checks are not in CI and are run here because `@egdev/system` ships.

## 9. Browser and capture procedure

Only after separate permission (D3) to start `pnpm storybook` (it builds tokens first) and to use Playwright MCP, following the [capture guide](../../../design/README.md). Record commit, browser and version, viewport, device scale, theme (dark), loaded fonts (Barlow and Barlow Condensed), motion and transparency settings, crop and date for every observation. Stories: `organisms-sectionnav--many-sections`, plus `--default`, `--unmatched`, `--empty` and `--responsive` for preservation.

1. **PAR-06 computed style.** With the index open, the number computes the display family, `11.2px`, tabular figures and the resolved `--color-fg-brand-raised` (today `rgb(255, 0, 54)`; D1 may change what is expected); the label computes the display family, `11.2px` and `text-transform: uppercase`; no legacy `.eg-section-nav__*` rule applies. Repeat under `prefers-reduced-transparency: reduce`.
2. **PAR-07 non-colour cues.** The current row keeps its underline, `aria-current` and active Pixel; the number colour is equal on every row. Number contrast over the translucent overlay is measured from pixels as an observation only and stays host-owned.
3. **PAR-09 overflow.** At 519, 520 and 521 px and at 200% and 400% zoom, with one very long label injected through Playwright `evaluate` (no repository change and no extra story), compare the document's `scrollWidth` against its `clientWidth` and the controls' bounding boxes, and confirm the controls stay at least 44 px (`min-h-14`, `min-w-14`). Run the same script **before the first implementation commit** and after it, so the comparison is the same measurement on both sides.
4. **Captures VIS-01 to VIS-03**, only if D3 includes them: component-zone PNGs of the open `ManySections` story under `docs/components/section-nav/v0.3/`, named `section-nav--many-sections--1280--dark.png`, `section-nav--many-sections--390--dark.png` and `section-nav--many-sections-reduced-transparency--1280--dark.png`, with `capture.json`, SHA-256 hashes and conditions (viewports 1280 and 390 px, device scale 2, dark theme, fonts loaded, no reduced motion except the third). They are observed implementation, not approved expected design, until the owner adopts the exact hashes. Playwright MCP writes under `.playwright-mcp/`; nothing from it is copied or committed except the requested captures. A GitHub-visible handoff is a separate authorization.

**Visual conformity: Not evaluated.** No v0.3 capture exists, the historical v0.1 board is observed and not adopted, and none of this plan's browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English. The PR and merge strategy belong to T7; the slices exist for review and bisect.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `feat(ui): zero-pad and restyle the SectionNav numbers and labels (#563)` | `types.ts`, `useSectionNav.ts`, `SectionNav.tsx`, `SectionNav.test.tsx`, the docgen assertion, `prop-naming.json`, regenerated `docs/prop-naming.md`, `prop-naming.test.mjs` | ≈ 233 |
| 2 | `feat(ui): add the SectionNav many-sections story and packed-build checks (#563)` | `SectionNav.stories.tsx`, `package-exports.test.mjs`, `package-consumption.test.mjs` | ≈ 69 |
| 3 | `chore(integration): refresh the SectionNav artifact, catalog row and changelogs (#563)` | `design-system.json`, `system.md`, `design-system-artifact.test.mjs`, `catalog_data.py` with the generated catalog, both changelogs | ≈ 58 |
| 4 | `docs(section-nav): record the v0.3 implementation evidence (#563)` | `implementation-evidence.md`, the ODD log, and `capture.json` with PNGs only if authorized | ≈ 46 |

Slice 1 keeps the registry and its test pin with the type change, so `props:check` and `test:props` stay green per commit. `pnpm artifact --check` is stale between slices 1 and 3; if every commit must be artifact-fresh, fold slice 3 into slice 1 (≈ 291). A failing RED commit is never made.

## 11. Estimated changed lines

About **406 changed lines** (376 added, 30 removed): ≈ 369 hand-written (component source ≈ 27: `types.ts` 6, hook 12, JSX 9; stories ≈ 23; tests and fixtures ≈ 244; registry JSON, catalog source, changelogs, evidence and log ≈ 75) and ≈ 37 generated (`docs/prop-naming.md` 16, `design-system.json` 2, `system.md` ≈ 15, catalog 4). Estimates are from the planned diffs, not measured.

## 12. Risks

- **Risk 1 — Contrast (F1).** The number is neon, 3.92:1 on the solid fallback and 3.42:1 on `surface-3`, under 4.5:1 for small text, and it is part of the link's accessible name. D1 must be decided before G1. The accent API can also re-point `--color-fg-brand-raised` at runtime (`packages/tokens/src/accent.ts:121`), so any contrast figure is for the default accent only.
- **Risk 2 — The separator.** The name promise rests on a `{' '}` text node. A formatter or refactor that drops it would silently turn the name into `02Beta`; T1 and T6 pin the exact string, so that regression fails loudly.
- **Risk 3 — Registry coupling.** Every `types.ts` edit invalidates eight registry revisions and the artifact. Hash last, rehash after any formatting change, and expect the one receipt pin of §5.1.
- **Risk 4 — Parallel Round 5 work.** The other specs of this round touch the same shared outputs: `prop-naming.json`, `prop-naming.test.mjs`, `docs/prop-naming.md`, `design-system.json`, `system.md`, `catalog_data.py` with its generated files and both changelogs. Expect rebase conflicts: regenerate generated files instead of hand-merging, and re-hash `types.ts` after rebasing.
- **Risk 5 — Size and parity.** `text-meta` is 11.2px against today's 12.8px body step and the reference's 14.4 to 15.2px (scaled ×0.8). Whether that reads as parity is a visual judgement that only VIS-01 can inform; if it reads too small, the owner chooses another existing step or a token (OQ-3), which is a spec amendment.
- **Risk 6 — Long labels.** Uppercase with 0.08em tracking widens text, and the spec adds no truncation or wrapping policy. PAR-09 measures it only under D3; without D3 the risk stays unmeasured.
- **Risk 7 — Locale casing.** CSS uppercase follows the element's `lang`, and digits are ASCII; both are host-owned (spec block 4).
- **Risk 8 — Consumer fit.** Consumer tests that pin the old bare-integer names break by design; the changelog entry says so.
- **Risk 9 — Shared `/tmp`.** L4 records ENOSPC failures from a full shared tmpfs earlier in this round. `pnpm build`, `storybook-build`, `test:package-consumption` and the differential check write large temporary trees: check `df /tmp` first, keep scratch minimal and delete your own.
- **Risk 10 — Package harness.** `test:package-consumption` needs an offline cache and permission to install; without them the React 18 and 19 matrix stays pending, which blocks "verified in packed consumers" claims, not the rest.

## 13. Pending owner decisions

No token or dependency decision is pending under option (a) of D1; under option (b) a token may be.

1. **D1 — Resolve F1 before G1 (blocking).** The recommended option is (a): keep `text-fg-brand-raised`, which follows the owner's neon brand-text decision, and amend the spec through a renewed approval, as Carousel's Amendment 1 did. The amendment restates the contrast paragraph of block 5 and PAR-07 with the resolved figures (3.92:1 and 3.42:1, a small-text shortfall shared with every brand link) and keeps number contrast Not evaluated in a renderer. The accessibility trade-off is the owner's to accept explicitly. Option (b): keep the 4.5:1 promise and change the number colour, which needs the owner to choose an existing token that meets it (for example `text-status-danger`, `#FF6680`, 5.51:1 and 4.82:1, a semantic stretch) or a new token (token confirmation required); it also changes the approved recipe, T8 and T9. Either way this plan is re-pinned to the new spec hash and its other sections stand.
2. **D2 — Plan approval (G1).** Approve this exact plan and the §2 edit surfaces, including the parent-owned integration files, or revise it. The spec approval does not cover it.
3. **D3 — Browser and capture authorization.** Starting `pnpm storybook` and using Playwright MCP are needed for PAR-06, PAR-09 and VIS-01 to VIS-03. Without it those rows stay Pending or Not evaluated and the look ships unmeasured. Adopting any capture as expected design is a separate decision.
4. **D4 — Issue citation.** The entries cite `(#563)`, which marks the issue fully resolved. Recommended: keep it and let the owner confirm after seeing VIS-01, because OQ-3 may reopen the size question; if captures are not authorized, write `Refs #563`.
5. **D5 — OQ-4 follow-up.** The approved OQ-4 leaves the disclosure's Label in Name gap to a separate follow-up. Nothing here creates it; filing an issue or a note is a separate authorization.
6. **D6 — Publishing the snapshot.** Publishing v0.3 as a comment on the canonical issue #301 is a separate GitHub authorization, not required before code.

Plan-level choices a reviewer can veto at G1: the separator is a JSX whitespace text node on both surfaces; `currentNumber` is `undefined` when unmatched and the padding helper lives inside the hook file; the receipt pin is changed in the test instead of editing the v0.1 receipt; the system entry goes under `## 0.13.0` and the ui entry opens a `### Changed` subsection; the `ManySections` story name and values.

## 14. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, artifact, catalog, capture, release or Git action is taken or implied. Stop and return to the owner on any G8 condition, a contradictory result, or a needed edit outside §2.
