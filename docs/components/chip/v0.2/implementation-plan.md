# Chip v0.2 — implementation plan for `mode` (toggle, static, link)

- **Status:** Draft preparation only. This plan is presented alongside the already owner-approved v0.2 contract; it is **not** permission to write code. The plan itself still needs its own approval (gate G1), and the naming convention it depends on still needs its own approval (gate G3).
- **Contract authority:** [spec.md](spec.md) v0.2 plus its published snapshot [issue-comment.md](issue-comment.md). `version: 0.2`; `contentSHA256: 958fb7fde0922018be87c0155be62e916e23be887f872849c03857035bfca797` — that digest is the SHA-256 of the `## 1. Purpose and scope`-to-EOF payload of `issue-comment.md`, the byte-identical body posted as [issue #55 comment 6573737002](https://github.com/egdev6/egdev-design-system/issues/55#issuecomment-6573737002). Visual hashes: VIS-01 `a45c6772…` (reused v0.1 reference), VIS-02 `2a7903a8…`, VIS-03 `f735de41…`, VIS-04 `6b71fdae…`, VIS-05 `5677e54f…`.
- **Owner approval:** [issue #55 comment 6576758274](https://github.com/egdev6/egdev-design-system/issues/55#issuecomment-6576758274) (2026-11-02), owner answer `"Aprobar con static y link (Recomendado)"`. Scope adopted, verbatim from the approval: `mode` toggle|static|link with toggle as default, no tones, design-system size scale, `external`/`newTabText` only in link mode, and the explicit reversal of v0.1 D1 (Chip is no longer always pressable). Approved contract only; no token or dependency change.
- **Plan identity:** `contentSHA256: 0ca55ffa9641468364a34b289b9e5d2e293563f844a11a9aae9abdf89266a42d` — SHA-256 of the UTF-8, LF, final-newline payload from `## 1. Authority and gates` through EOF. The tracking metadata above this line is excluded, exactly like the contract's own rule.
- **Baseline:** `f159b9cc63ec0f16797239683b272e4e11ad0de3` (branch `docs/web-catalog-layer-b`). Current reviewed source bytes: `types.ts` `ba72c0a8…`, `useChip.ts` `2983f537…`, `Chip.tsx` `66e1c46a…`, `index.ts` `ef379288…`, `Chip.test.tsx` `6be62eed…`, `Chip.stories.tsx` `b4fb3c0e…`, `molecules/chip-group/useChipGroup.ts` `bbf0e5b5…`.
- **Observed evidence:** none for runtime behavior. This preparation inspected source, consumers, metadata tests, package harnesses, the naming registry and the catalog generator; it ran no tests, builds, Storybook, browser checks or screenshots. Every acceptance row below is *planned*, never observed.

## 1. Authority and gates

1. **G1 — Plan approval.** The owner approves this exact plan payload and grants the implementation edit surface. Contract approval alone grants no code.
2. **G2 — Spec artifact reconciliation.** The approved digest covers `issue-comment.md`, not the local `spec.md`: `spec.md`'s `## 1.`-to-EOF payload currently hashes to `18fec340…`, because it carries four extra lines and omits the published `## Published visual references` section, and its header still reads **Draft / Pending** with Q1–Q7 listed as blocking. The approved text lives in the issue comment. Implementation must treat `issue-comment.md` (plus the approval comment) as binding, and the stale header/closure wording in `spec.md` needs a separate documentation-only authorization before or with the implementation commit. This plan does not edit `spec.md` (see Q-A).
3. **G3 — Naming convention `render-mode`.** The spec proposes a new `render-mode` convention (`name: mode`, status `proposed`, `approval: null`) and explicitly keeps convention approval separate from contract approval. The registry forbids inventing human approval and requires a recoverable `{reference, scope, contentHash}` bound to `convention:render-mode` with the matching `conventionHash(entry)`. Until that approval exists, `mode` is a component-local proposal and the implementation may not add the convention entry as `approved`. See Q-B.
4. **G4 — Visual reference status.** VIS-02…VIS-05 remain `Proposed (Pending owner adoption)` in the contract's own table, and the spec's closure item "the owner adopts or revises the proposed captures" is still unchecked. The approval comment adopts the *recommendations of the open questions*; it does not name the captures. Consequence for implementation: visual conformity for `static` and `link` is **Not evaluated** against an adopted reference; the toggle keeps VIS-01 as its approved v0.1 reference. See Q-C.
5. **G5 — No token, dependency, Material or legacy change.** `@radix-ui/react-toggle` 1.2.1 and `@radix-ui/react-visually-hidden` are already installed and already used by `Link` (`Link.tsx:2,25`). No `chip.css` is created (spec: **No stylesheet**), no token is added, no `docs/CATALOGO.md` line is hand-edited, and legacy `.eg-chip` / `a.eg-chip:hover` rules in `packages/ui/src/styles/legacy/bundle.css` stay untouched. If the implementation discovers a genuine need for any of these, it stops for the owner instead of widening scope.
6. **G6 — Parent-owned integration.** Registry JSON, generated `docs/prop-naming.md`, catalog source/artifacts and the shared package harnesses are parent-owned integration surfaces. The writer returns reviewed hashes and proposed entries; the parent decides when to regenerate and commit.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Responsibility |
| --- | --- | --- |
| `packages/ui/src/atoms/chip/types.ts` | Writer | `ChipMode`, the three exact branch types and `ChipProps` union from spec §3 verbatim; `chipVariants` restructured into shared base + `mode` variants (`toggle`, `static: ''`, `link`) with `defaultVariants: { mode: 'toggle' }`; unchanged `chipIconVariants`; English JSDoc with one `@control` per own declaration and per branch |
| `packages/ui/src/atoms/chip/useChip.ts` | Writer | Mode resolution and branch selection, per-mode prop stripping, per-mode class composition through `cn()`, link `target`/`rel`/notice derivation, typed degraded result |
| `packages/ui/src/atoms/chip/Chip.tsx` | Writer | JSX only: mode switch over the hook result rendering `TogglePrimitive.Root`, native `span`, or native `a`; shared icon part |
| `packages/ui/src/atoms/chip/Chip.test.tsx` | Writer | RED-first behavior tests for AC-01…AC-13; v0.1 AC labels re-pointed to the v0.2 numbering |
| `packages/ui/src/atoms/chip/Chip.stories.tsx` | Writer | `Atoms/Chip`: keep `Default`, `WithIcon`, `Pressed`, `Controlled`, `Disabled`; add `Static`, `Link`, `ExternalLink`, `StaticInList`; updated meta description |
| `packages/ui/src/atoms/chip/index.ts` | Writer | Add `export type { ChipMode }`; keep `Chip`, `ChipProps`, `chipVariants`; keep `useChip` and `chipIconVariants` unexported |
| `packages/ui/src/index.ts` | Parent | Existing `export * from './atoms/chip'` line already carries the new type; verify, do not restructure |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent (integration) | Chip section: alias list for the three branch types, expanded control map, `@default` map, extraction rows, unchanged story-name list extended with four new stories |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent (integration) | Chip row of the expected `argTypes` defaults map (`mode: '"toggle"'` and the link-branch rows) and zero owned diagnostics |
| `scripts/package-exports.test.mjs` | Parent (integration) | `ChipMode` in the exact sorted public type list; existing `Chip`/`chipVariants` runtime assertions preserved; SSR cases for the three modes |
| `scripts/package-consumption.test.mjs` | Parent (integration) | `ChipMode` import, positive per-mode usage, negative per-mode `@ts-expect-error` cases, React 18/19 consumer compile |
| `skills/_shared/prop-naming.json` | Parent | Refresh four Chip usage revisions (`pressed-state`, `initial-uncontrolled-pressed`, `pressed-change`, `leading-icon`); append Chip usages to `new-tab-navigation` and `new-tab-notice`; add `render-mode` only with G3 approval |
| `docs/prop-naming.md` | Parent-generated | `pnpm props:docs`; never hand-edited |
| `scripts/catalog_data.py` | Parent | Chip row (line 27) text: three modes, `render-mode` pending convention, contract + plan references |
| `docs/CATALOGO.md`, `docs/catalog.json` | Parent-generated | `python3 scripts/build_catalog.py` after the source edit |

Explicitly **not** touched: `packages/ui/src/atoms/chip/chip.css` (must not exist), `packages/ui/src/styles/compiled.css` (`@source "../atoms/chip/types.ts"` already registered at line 12), `.storybook/preview.css` (`@source "../packages/ui/src/atoms/chip/Chip.stories.tsx"` already registered at line 18, so new story-only utilities are scanned; no new `@source` is needed and none may be invented), `packages/ui/src/molecules/chip-group/*` (must stay byte-identical), `packages/ui/src/styles/legacy/bundle.css`, `packages/tokens/**`, `packages/ui/package.json`, `docs/components/panel/**` and every other peer folder.

## 3. Typing approach and compile impact

The three branch types and `ChipProps` are reproduced **exactly** as quoted in spec §3 (`ChipToggleProps | ChipStaticProps | ChipLinkProps`, each branch intersected with `ChipCommonProps`, every cross-mode prop declared `never`). `ChipMode` is exported; the three branch aliases stay module-internal (spec §3 and §6 authorize only `ChipMode` as a new public type), so tests, stories and consumers narrow with `Extract<ChipProps, { mode?: 'toggle' }>` — never with a new export.

`type`, not `interface`; `ComponentPropsWithoutRef` per branch and no ref anywhere; no `any`, no `@ts-ignore`/`@ts-expect-error` beyond documented type-rejection cases in `scripts/package-consumption.test.mjs`.

Rationale for an explicit discriminant rather than `Logo`-style `href` inference: `Logo` (`LogoProps = LogoOwnProps & (LogoLinkProps | LogoImageProps)`, `types.ts:61`) infers the element from `href`, which the spec rejects here because a future `href` on a toggle would silently drop `aria-pressed`. The union is therefore discriminated by `mode`, and `href?: never` on the toggle/static branches is what makes that rejection a compile error.

Compile impact, case by case:

| Consumer | Expected after the change | Required action |
| --- | --- | --- |
| `ChipGroup` (`molecules/chip-group/useChipGroup.ts:89` `cn(chipVariants(), chipGroupItemVariants())`) | Unaffected: `chipVariants()` still resolves the toggle recipe | None; guarded by AC-12 and one differential check |
| `<Chip>…</Chip>` without `mode` | Unaffected (`mode` optional, defaults to `toggle`) | None |
| `ChipDefaults: ChipProps = { children: 'Design' }` then spread into `Chip` (`package-consumption.test.mjs:1790`) | Keeps compiling: the object matches the toggle branch | Keep as the positive control; add per-mode positives next to it |
| `<Chip {...props} pressed={pressed} onPressedChange={…} />` where `props: ChipProps` (current `ControlledChip` story helper) | **Breaks** under the union: a spread of the union cannot accept `pressed` for the static/link branches | Change the helper's parameter to `Extract<ChipProps, { mode?: 'toggle' }>`; the story stays a toggle story |
| Object-literal props with `mode='static'` plus `pressed`/`disabled`/`href`, or `mode='link'` without `href` | Compile errors via the `never` slots and the required `href` | Assert with `@ts-expect-error` in the consumption harness, one case per rejection |

If the compiler reports a genuinely unavoidable widening (for example an "expression produces a union type that is too complex" collapse at a spread site), the fix is to narrow the *consumer*, never to relax the public union: a looser `ChipProps` would re-open v0.1 D1 and contradict the approved contract.

## 4. Per-mode render and class composition

`chipVariants` keeps one shared base and adds exactly one `mode` variant key. This is the precedent already used by `logoVariants` (`link: { true: '…', false: '' }`), including the empty-string value for "adds nothing".

- Shared base (all modes, verbatim from spec §6): `eg-chip inline-flex items-center gap-1.5 min-h-8 px-2.5 py-1.5 rounded-full border border-border-hairline [background:var(--gradient-sheen),var(--color-surface-1)] shadow-edge font-sans text-label-default text-fg-secondary whitespace-nowrap`
- `mode: 'toggle'`, verbatim: `pointer-coarse:min-h-11 cursor-pointer transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-border-hairline-strong hover:[background:var(--gradient-sheen),var(--color-surface-2)] hover:text-fg-default data-[state=on]:border-primitive-red-neon/60 data-[state=on]:[background:var(--gradient-chip-active),var(--color-surface-1)] data-[state=on]:shadow-[var(--shadow-edge-strong),var(--shadow-glow-base)] data-[state=on]:text-fg-default active:translate-y-px active:scale-[.97] active:duration-[var(--duration-press)] active:ease-[var(--ease-snappy)] motion-reduce:active:transform-none motion-reduce:active:translate-none motion-reduce:active:scale-none focus-visible:outline-none focus-visible:shadow-focus data-[state=on]:focus-visible:shadow-focus disabled:opacity-45 disabled:pointer-events-none`
- `mode: 'static'`: `''` — and therefore no `cursor-pointer`, `transition-colors`, `hover:`, `active:`, `focus-visible:`, `data-[state`, `disabled:` or `pointer-coarse:min-h-11`, per AC-06.
- `mode: 'link'`, verbatim: `pointer-coarse:min-h-11 cursor-pointer no-underline transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-border-hairline-strong hover:[background:var(--gradient-sheen),var(--color-surface-2)] hover:text-fg-default focus-visible:outline-none focus-visible:shadow-focus`

Two utilities move **out of** today's single string into the toggle/link branches on purpose: `pointer-coarse:min-h-11` and `cursor-pointer`. Keeping them in the base would leak them into `static`, which AC-06 forbids. Consequence to state in the commit message and tests: `chipVariants()` returns the **same class set** as today but in a different order (base first, then the variant group), because CVA concatenates. No utility is dropped, duplicated by `twMerge` conflict, or restyled.

Hook contract (`useChip`):

| Input | Resolution | Result |
| --- | --- | --- |
| `mode` absent, `undefined`, or `'toggle'` | toggle branch; `mode` never reaches the DOM | `rootProps` for `TogglePrimitive.Root`, `defaultPressed` defaulted to `false` in the hook (preserved), `aria-pressed`/`data-state`/`type`/`asChild`/`href`/`external`/`newTabText` stripped |
| `mode='static'` | static branch | `rootProps` for a native `span`; `role`, `pressed`, `defaultPressed`, `onPressedChange`, `disabled`, `href`, `external`, `newTabText`, `data-state` stripped at the runtime boundary even if a JS caller passes them (AC-09) |
| `mode='link'` | link branch | `rootProps` for a native `a` with own `href`, normalized `target`/`rel`, everything pressed/disabled stripped; `external`/`newTabText` never forwarded; the notice renders inside the anchor |
| unknown `mode` string at runtime | falls back to `toggle`, matching "the declared mode's element and semantics stand" and keeping the component resilient | no throw, no class change |

`target`/`rel` normalization follows `useLink` (`useLink.ts:32-49`) so the two components behave identically: when `external` is true, `target="_blank"` and `rel` is the de-duplicated union of the consumer `rel` and `noopener noreferrer`; when false, the consumer `target`/`rel` pass through unchanged and no notice is rendered.

Visually hidden notice: use **`@radix-ui/react-visually-hidden`** (`VisuallyHiddenPrimitive.Root`) exactly as `Link.tsx:25` does, not the local `primitives/visually-hidden` component. Reason: the spec requires the implementation to name one and stay consistent with `Link`; the local primitive is a React component with its own API and composing it here would add a dependency on another component's contract for a decorative notice.

JSX (`Chip.tsx`) stays declarative: read the discriminated hook result, switch on `result.mode`, and render one root per branch — no CVA call, no state, no `forwardRef`, no `asChild`.

## 5. Test-first sequence

RED before GREEN, one behavioral test per acceptance promise, public interface only (roles, names, attributes, rendered class markers), never internal storage. Existing behavior that shares the changed code is pinned by a PRESERVE test and needs no RED run.

| Step | RED test (file → case) | Covers |
| --- | --- | --- |
| R0 | `storybook-docgen.test.ts` (§Chip) — **feasibility first**: parse the real `Chip.tsx` with the installed `react-docgen-typescript` and assert the extracted rows for the union; `mapJSDocControls` must report `diagnostics: []` and `mode` must extract as a finite enum for `@control select` | AC-14; early warning for the union-vs-metadata risk (R-1) |
| R1 | `Chip.test.tsx` — static render asserts `SPAN`, `eg-chip`, no `role`/`tabindex`/`aria-pressed`/`data-state`, and `user.tab()` skips it | AC-05 |
| R2 | `chipVariants({ mode: 'static' })` string assertions (positive base utilities, negative list from AC-06) plus a browser check later | AC-06 |
| R3 | `Chip.test.tsx` — link render asserts `A[href]`, no `aria-pressed`/`data-state`, tab reachable, `Enter` activates, `Space` does not, `onClick` composed and `preventDefault` respected | AC-07 |
| R4 | `Chip.test.tsx` — `external` adds `target="_blank"`, `rel="noopener noreferrer"` and a visually hidden `newTabText` **inside** the anchor; accessible name query still matches the label + notice; without `external` there is no `target` and no notice | AC-08 |
| R5 | `Chip.test.tsx` — cross-mode runtime boundary: `pressed`/`href`/`disabled`/`asChild`/`type` passed into each mode via a cast; element type, `aria-pressed`, form submission and class output unchanged | AC-09 |
| R6 | `Chip.test.tsx` — `icon` is `aria-hidden` in all three modes and the accessible name still equals the label (`getByRole` for toggle/link, text query for static) | AC-10 |
| R7 | `Chip.test.tsx` — `className` merges last and `eg-chip` survives per mode | AC-11 |
| R8 | `Chip.test.tsx` — `chipVariants()` equals `chipVariants({ mode: 'toggle' })`; `ChipGroup.test.tsx` suite runs unchanged | AC-12 |
| R9 | `Chip.test.tsx` — `<ul aria-label><li><Chip mode="static">` keeps the list name and item count and the chip contributes no role | AC-13 |

GREEN then proceeds in this order: `types.ts` (union + CVA restructure) → `useChip.ts` (branch + stripping + composition) → `Chip.tsx` (three roots) → `index.ts` (`ChipMode`) → remaining tests. Triangulate with the alternate modes only as their tests demand; no CSS snapshot, no whole-string class assertion.

PRESERVE (expected to pass, no RED run):

- AC-01 toggle default DOM (`button`, `type="button"`, `aria-pressed="false"`, `data-state="off"`, `eg-chip`) — existing case, unchanged.
- AC-02 click/Space/Enter toggling and `onPressedChange` sequence — existing case, unchanged.
- AC-03 controlled `pressed` wins and prop updates emit nothing — existing case, unchanged.
- AC-04 disabled toggle unfocusable, untoggleable, `data-disabled` — existing case, unchanged.
- Existing `chipVariants()` utility-membership test, `renderHook` default test, empty-icon test, prevented-activation test and the existing runtime-boundary test (extended, not replaced).
- `ChipGroup` behavior and SSR markup (`package-exports.test.mjs:3932-3949`) — byte-identical.

**Differential check (required, not optional).** The diff changes shared code — `chipVariants` — that an existing component the request does not name also consumes (`ChipGroup`). Before finishing, run one script that, for `ChipGroup` (single and multiple, uncontrolled and controlled, with icons) renders SSR HTML + logs the resolved `itemClassName` from a `mktemp -d` copy of baseline `f159b9cc…` and from the working tree, and compares stdout, stderr and exit code. Any unrequested difference is a regression to fix and pin with a test; the scratch copy is deleted at the end and never committed.

## 6. Stories and Controls

`Atoms/Chip`, `autodocs`, real `Meta<typeof Chip>`/`StoryObj`, `action` only for `onPressedChange`. No manual `argTypes`, no `play`.

| Story | Content |
| --- | --- |
| `Default` (kept) | Required label only; uncontrolled toggle remains the runtime default |
| `WithIcon` (kept) | Decorative `Icon name='bookmark'` example sized to the 14px wrapper |
| `Pressed` (kept) | Off/on treatments side by side |
| `Controlled` (kept; helper narrowed to `Extract<ChipProps, { mode?: 'toggle' }>`) | Consumer state drives `pressed`; each activation reported in Actions |
| `Disabled` (kept) | Disabled off and on |
| `Static` (new) | `mode="static"` with and without an icon; states the non-interactive role in the story JSDoc |
| `Link` (new) | `mode="link"` with a real `href`; `onClick` reported in Actions |
| `ExternalLink` (new) | `external` with a custom `newTabText`; points at the hidden notice |
| `StaticInList` (new) | `<ul aria-label="Topics"><li>` composition proving the consumer owns list semantics |

Meta description and usage guidelines must be rewritten to the v0.2 truth: the current text says "A compact pill the user presses…" and "Use Badge for static labels, Link for navigation", which the approval reverses. New text must describe the three modes, keep "one mode per visual group" as the consumer rule (spec §4 limits), keep "labels never truncate", keep "className supports outer layout only", and keep "no ref, asChild or stylesheet".

Story-only layout utilities (`flex flex-wrap gap-2` and the list layout) are already covered because `.storybook/preview.css:18` sources `Chip.stories.tsx`; no new `@source` line and no `tailwind` theme key is introduced, so no variant can silently emit nothing.

Docs Default/Controls expectations the parent must update together with the stories: `mode` documented as `@control select` with `@default toggle` (bound to the CVA `defaultVariants`), `href` as `@control text` (required only in the link branch), `external` as `@control boolean` with `@default false`, `newTabText` as `@control text` with `@default (opens in a new tab)` matching `Link`, and `children`/`onPressedChange`/`icon` unchanged as `@control false` with concrete reasons. If the hook keeps `external = false` as a destructuring default (recommended, so the constant is real), the docgen `defaults(useChip.ts)` expectation grows to `{ defaultPressed: 'false', external: 'false' }`.

## 7. Registry integration

| Entry | Action |
| --- | --- |
| `pressed-state` (`pressed`), `initial-uncontrolled-pressed` (`defaultPressed`), `pressed-change` (`onPressedChange`), `leading-icon` (`icon`) | Existing approved conventions. Chip usage stays; the recorded `sha256:ba72c0a8…` revision must be refreshed to the reviewed whole-file hash of the new `types.ts` |
| `new-tab-navigation` (`external`), `new-tab-notice` (`newTabText`) | Approved conventions, currently used by `Link`/`SocialLink(s)` only. Append a `Chip` usage each, with `source: {path: packages/ui/src/atoms/chip/types.ts, symbol: ChipProps, revision: <reviewed hash>}` |
| `render-mode` (`mode`) | **Gate G3.** Proposal only; added as `status: "proposed"` with `approval: null` and the exact body from spec §3, or not added at all until approved. Never recorded as approved by this transaction |

Rejected reuses stay documented in the spec (`visual-treatment`, `menu-entry-kind`, `selection-cardinality`, `slot-composition`) and must not be silently substituted if G3 is declined. After any authorized registry edit: `pnpm props:docs` then `pnpm props:check` and `pnpm test:props`; the JSON is edited, the view is generated, and `--write` never refreshes evidence or approval.

## 8. Package export and consumption cases

- `scripts/package-exports.test.mjs`: add `ChipMode` to the exact sorted public **type** list — it belongs between `ChipGroupType` and `ChipProps` — and keep every existing `Chip`/`chipVariants` runtime assertion and the negative list (`useChip`, `chipIconVariants`, `chipGroup*` stay non-exported). Add SSR assertions for the three modes: `SPAN` with no `role`/`data-state` for static; `A[href]` with no `aria-pressed` for link; `BUTTON` + `aria-pressed="false"` unchanged for toggle. The Chip CSS block assertion (`:948-998`) must keep passing unchanged: every listed utility is still emitted from `types.ts`, and `.eg-chip` must still emit no rule of its own.
- `scripts/package-consumption.test.mjs`: import `type ChipMode` in the type import list; keep `chipDefaults` as the positive toggle control; add a positive per-mode sample (static item inside a list, link with `href`, external with `newTabText`); add **type-level negatives only** — `mode="static"` with `pressed`/`disabled`/`href`, `mode="link"` without `href`, `mode="link"` with `pressed`, toggle with `href` — each as a documented `@ts-expect-error`; no runtime behavioral assertions belong here.
- React 18.3.1/19.3.0 packed-consumer checks run where the existing harness runs them; Chip adds no ref and no React-19-only API, so no new compatibility claim is made.
- `ChipGroup`'s consumption cases stay byte-identical; they are part of the differential check, not a rewrite target.

## 9. Catalog row update

`scripts/catalog_data.py` line 27 is the single Chip source. Update the note to the v0.2 truth — one pill with three modes (`toggle` default, `static`, `link`), unchanged sheen/edge base recipe, toggle-only pressed state and disabled, link-only `external`/`newTabText`, `ChipMode` exported, `chipVariants` still public for `ChipGroup`, no stylesheet, no token/dependency change, convention `render-mode` pending, and links to issue #55 plus this plan — then regenerate with `python3 scripts/build_catalog.py` so `docs/CATALOGO.md` and `docs/catalog.json` follow. The generated files are never hand-edited.

The NotesBoard row (line 107, rendered `docs/CATALOGO.md:143`) currently lists `ChipGroup` as the topics body. Whether it should now also name the static Chip is a cataloging question about a component that is not implemented yet; see Q-D.

## 10. Browser checks to run before merge

Run against `pnpm storybook` with the real compiled tokens, after GREEN, and record observations — never as expected-design proof:

1. Controls: `mode` renders a select with exactly `toggle|static|link`; `external` renders a boolean; `href`/`newTabText` render text fields; `children`/`onPressedChange`/`icon` show the documented false-control rows; no `Component.prop` diagnostic appears in any Chip story.
2. Mode matrix in `Static`, `Link`, `ExternalLink`, `StaticInList`: computed `cursor` (`pointer` only for toggle/link), no hover/active/focus-visible change on static, hover lightening on link, focus ring (`--shadow-focus`) on toggle and link only.
3. Toggle states: off, hover, on (red-tinted glow), active press transform, disabled 45% + no pointer events, reduced motion suppressing the press transform.
4. Coarse-pointer emulation: toggle and link reach ≥44px; static is not padded to a touch target and is skipped by Tab.
5. Contrast re-measure of `text-fg-secondary` (and `text-fg-default` on hover/on) on the raised pill — the spec explicitly forbids inferring it from captures.
6. `ExternalLink`: `target`/`rel` in the DOM, hidden notice read by the accessibility tree and still part of the accessible name; same-tab `Link` story has neither.
7. `StaticInList`: list name, item count and no control role announced in the accessibility tree.
8. Long label and 200% zoom/reflow: no truncation, no clipping, single-line `whitespace-nowrap` behaviour unchanged; RTL placement of the icon stays before the label logically.
9. Legacy coexistence: with `.eg-chip`/`a.eg-chip:hover` active, utilities still win for the properties they set and no double border/shadow appears.
10. `ChipGroup` stories side by side with the new Chip stories: identical item appearance to baseline.

Full gates before merge, parent-scheduled and reported with observed output: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm props:check`, `pnpm test:props`, the catalog regeneration, and the Storybook build. Focused first: `pnpm exec vitest run packages/ui/src/atoms/chip packages/ui/src/molecules/chip-group packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts`.

## 11. Risks

- **R-1 — Union metadata extraction (highest).** `react-docgen-typescript` must resolve the three-branch `ChipProps` union into complete, correctly typed rows for `mode` (finite enum), `href` (string, required only in the link branch), `external`, `newTabText` and the four toggle props, with zero owned diagnostics. The `Logo` precedent (`OwnProps & (LinkProps | ImageProps)`) succeeded because the common props sat in a single alias. If the exact spec type block collapses rows or reports a conflicting directive, the honest options are a **metadata-only restructure that preserves the public type's meaning** (for example moving `ChipCommonProps` out of the branches so docgen sees one shared alias, which still satisfies the spec's API table but not its literal code block) or a **spec amendment**. That choice is the owner's, not the writer's; implementation must stop and ask after R0 rather than silently restructure or ship diagnostics.
- **R-2 — `chipVariants()` order change.** Any consumer comparing whole class strings or relying on the token order in `chipVariants()` sees a different string. Evidence needed: no test in the repository compares the full string (they assert membership), and `ChipGroup` is pinned by the differential check. Residual risk: an external consumer of the public `chipVariants`.
- **R-3 — Reversed v0.1 D1 documentation trail.** The stories' usage guidelines, the catalog note and (outside the allowed surface) `docs/CATALOGO.md:66` currently say "always-pressable" and "use Badge for static labels". The stories and the catalog source are in scope; the generated line follows regeneration. `Badge` documentation keeps recommending `Badge tone="neutral"` for non-topic labels; no Badge text changes here.
- **R-4 — Spec artifact drift (G2/G4).** Implementation runs against a binding artifact (`issue-comment.md` + approval) that the local `spec.md` no longer mirrors in its metadata and closure checklist, and whose static/link captures are still unadopted. Reviewer confusion is the risk, not behavior; it needs an explicit parent decision (Q-A, Q-C).
- **R-5 — Static/link recipe has no approved expected-design reference.** VIS-02…VIS-05 show the web's flat `.chip`, which the contract explicitly says is *not* the expected design. Visual conformity for the two new modes must be reported as **Not evaluated**, with the implementation judged only against the written recipe; nobody may "fix" the pill to look like the capture.
- **R-6 — `pointer-coarse` and other variant-prefixed utilities.** Base/toggle/link variants rely on `pointer-coarse:`-style variants and token-driven arbitrary values that already ship today; moving `pointer-coarse:min-h-11` between variants changes which mode emits it. Any Tailwind configuration change that stops emitting those variants would silently drop the 44px target — the CSS artifact check exists to catch exactly that.
- **R-7 — Consumer spreading.** A downstream app that spreads a `ChipProps`-typed object into `<Chip>` (as the current `ControlledChip` story does) needs narrowing. This is an intentional, approved public type change, but it is a breaking type change for such consumers and must be stated in the commit message.

## 12. Owner questions

**Q-A — Reconcile `spec.md` with the approved snapshot.** `spec.md` still says Draft/Pending, lists Q1–Q7 as blocking and its payload hash differs from the approved `contentSHA256`, while `issue-comment.md` matches it byte-for-byte. *Recommendation:* authorize a documentation-only reconciliation in the same transaction (status → Approved, link the approval comment, mark Q1–Q7 answered with the adopted answers, and record that `issue-comment.md` + approval are the binding artifacts), and keep `issue-comment.md` unchanged as the historical snapshot. Option: leave `spec.md` frozen and rely on the issue comment alone — acceptable, but then the next reader sees a "blocking" contract that was already approved.

**Q-B — Approve the `render-mode` convention (gate G3).** The `mode` prop needs a recoverable convention approval before it can be recorded as `approved` in `skills/_shared/prop-naming.json`. *Recommendation:* approve `render-mode` exactly as proposed in spec §3, record it as a JSON approval artifact following the existing pattern (`docs/decisions/prop-naming-*-approval.json`, `scope: convention:render-mode`, `contentHash: conventionHash(entry)`), then let the parent add the entry with Chip usage. Option: decline, and record a component-scoped exception instead, which leaves the convention `proposed` and marks Chip as an explicit exception — smaller governance surface, but it institutionalizes a one-off name.

**Q-C — Status of VIS-02…VIS-05.** *Recommendation:* keep them as non-binding source evidence (role proof) and judge the static/link appearance only against the written recipe, reporting visual conformity as Not evaluated. Option: adopt them now as expected-design references, which requires the owner to state it explicitly because the approval comment does not name the captures.

**Q-D — Catalog scope.** *Recommendation:* update only the Chip row in `scripts/catalog_data.py` and leave the NotesBoard row pointing at `ChipGroup` until NotesBoard is specified. Option: also add `Chip (static topics)` to the NotesBoard composition note now, which anticipates a component that is not yet implemented.

**Q-E — Review slicing.** *Recommendation:* one delivery — six Chip files plus the four test/metadata additions, then the parent-owned registry/catalog/package-harness integration; estimated 250–400 changed lines including tests and stories. Option: split into (1) types/hook/component/tests and (2) stories/metadata/registry/catalog, which slows the coupling between recipe and metadata evidence for little review gain. This is a delivery-shape preference, not a technical blocker.

## 13. Stop

This plan authorizes nothing. It records the six mandatory files (no stylesheet), the exact recipes, the test-first map, the gates and the risks, and it stops for G1–G4 plus Q-A…Q-E. No source, test, token, dependency, registry, catalog or Git action is taken or implied, and no behavior in this document is claimed as observed.
