# TerminalCard v0.1 — implementation plan

- **Status:** Proposed. Presented for separate owner approval; it authorizes no code, no registry write, no catalog regeneration and no Git action.
- **Contract authority:** [spec.md](spec.md) v0.1 and its byte-identical published snapshot [issue-comment.md](issue-comment.md) (issue body). `version: 0.1`; `contentSHA256: f3272e420250e646e20dbe58d52dbd61799d944042069ea91db5b7e439135f8c` — reproduced byte-exact in this working tree with the spec's own rule; local `spec.md` and `issue-comment.md` payloads are identical. Visual hash: VIS-03 `b6f8a75d3c34d2ee2b0df7206598e23835a079223ed172f202281b686200379e` (capture `terminal-card--variants--1280x1400--dark.png`, conditions in [capture.json](capture.json)).
- **Contract approval + conventions:** [issue #277 comment 6580404628](https://github.com/egdev6/egdev-design-system/issues/277#issuecomment-6580404628) (2026-11-02, recorded in `odd/tasks/web-catalog.md` L16), owner answer verbatim: `"Aprobar con las recomendaciones (Recomendado)"`. Every OQ (OQ-1…OQ-6) resolved as recommended: optional `shell` prop on the bar; decorative per-row `caret` reusing the existing `--animate-pulse` token; row `tone` `default | success`; term ink `text-fg-brand-raised`; **no** built-in 420 px maximum width; root `role="group"` with a required `label`. The same approval questionnaire **explicitly offered and approved** the two new naming conventions `shell-label` and `terminal-caret` (recorded in L16); that approval comment is the recoverable convention artifact — no reapproval is requested.
- **Plan identity:** `contentSHA256: 394b52665c6aa20b64106432ad2ffe5e4bb1bce0d8eace79e19d56f714e491d7` — SHA-256 of the UTF-8, LF, final-newline payload from `## 1. Authority and gates` through EOF.
- **Baseline:** branch `docs/web-catalog-layer-c-specs-2`, commit `fc6f977`. Current reviewed source bytes: `packages/ui/src/index.ts` `f85891be…`, `primitives/surface/types.ts` `26d0726b…`, `molecules/panel/usePanel.ts` `94136856…` (band tones), `molecules/module-card/types.ts` `ed7adc13…` / `useModuleCard.ts` `4e279bad…`, `atoms/icon/types.ts` `673126c6…` (`terminal` glyph in the closed set), `atoms/stat/types.ts` `15b16279…` (`role="group"` + named-region precedent), `primitives/text/types.ts` `badce409…`, `atoms/status-dot/types.ts` `4d3db595…`, `atoms/chip/types.ts` `aac60553…` (box-border precedent). All re-verified in this working tree.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the implementation edit surface; contract approval alone grants no code.
2. **G2 — Spec provenance (no blocker, no edits).** The local `spec.md` header still reads **Draft / Pending** although the contract was approved on #277 (L16). That header is historical snapshot metadata of the published snapshot; the approval comment plus the exact `contentSHA256` above is sufficient provenance. No frozen file is modified. The spec's two `../web-catalog/v0.1/…` relative links are broken (`../../web-catalog/…` required); they remain a reported documentation-only follow-up outside this task's edit surfaces, not an implementation blocker.
3. **G3 — Registry materialization of the approved conventions.** `shell-label` and `terminal-caret` are owner-approved via the recoverable artifact above (L16); approval evidence and registry materialization are separate steps. At implementation the parent adds both entries as `status: "approved"` with `approval: { reference: "https://github.com/egdev6/egdev-design-system/issues/277#issuecomment-6580404628", scope: "convention:shell-label" | "convention:terminal-caret", contentHash: conventionHash(entry) }`, exactly per the registry's approval rules, then regenerates and verifies.
4. **G4 — Visual reference status.** VIS-03 stays `Proposed`; the approval comment adopts the OQ recommendations and does not name the capture. Appearance is judged against the written recipe; browser observations per criterion (§10).
5. **G5 — No token, dependency, Material or legacy change.** Verified-present tokens only: `--animate-pulse`, `--shadow-edge`, `--shadow-elev-1`, `--gradient-sheen`, `--text-heading-small` (unused here), `--text-body-default`, `--text-label-default`, `--color-fg-brand-raised`, `--color-fg-brand-default`, `--color-status-success`. The caret is `w-2 h-4` token-preset utilities — **no** custom property, no inline geometry. **No stylesheet** (spec). No dependency (`@radix-ui/react-*` not needed), and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical.
6. **G6 — Parent-owned integration.** Registry JSON, generated props view, catalog source/artifacts, `packages/ui/src/index.ts` and package harnesses are parent-owned for the implementation task.
7. **G7 — Layer-(b) lessons are obligations.** (a) `box-border`: root and bar band both compose `surfaceVariants` (base carries `box-border`); asserted by test. (b) Real-browser layout verification against VIS-03 before merge (§10), including the two-column `dl` grid wrap behaviour the spec promises (TC-06).

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Responsibility |
| --- | --- | --- |
| `packages/ui/src/molecules/terminal-card/types.ts` | Writer | `TerminalCardTone` (`'default' | 'success'`), `TerminalCardRow` (`{ term: string; value: ReactNode; tone?: TerminalCardTone; caret?: boolean }`), CVA recipes (`terminalCardVariants`; `terminalCardBarVariants`, `terminalCardShellVariants`, `terminalCardListVariants`, `terminalCardTermVariants`, `terminalCardValueVariants` with `tone`, `terminalCardCaretVariants`), and `TerminalCardProps`, `TerminalCardBarProps`, `TerminalCardListProps` per spec §3; `type` only, English JSDoc with `@control` on every own declaration and on every `TerminalCardRow` field |
| `packages/ui/src/molecules/terminal-card/useTerminalCard.ts` | Writer | `label`/`shell` normalization (blank label → warn + render nothing; blank shell → omit), row tone fallback to `default`, per-part `cn()` |
| `packages/ui/src/molecules/terminal-card/TerminalCard.tsx` | Writer | JSX only: root `div role="group"` + `aria-label`, exported parts `TerminalCardBar` (`div` with the internal decorative `Icon name="terminal"`) and `TerminalCardList` (`dl` > `dt`/`dd` rows with the internal caret span) — parts in one file (`Panel` precedent) |
| `packages/ui/src/molecules/terminal-card/TerminalCard.test.tsx` | Writer | RED-first tests for TC-01…TC-09 plus box-border/passivity assertions (§5) |
| `packages/ui/src/molecules/terminal-card/TerminalCard.stories.tsx` | Writer | `Molecules/TerminalCard`, English: `Default`, `WithShell`, `WithoutShell`, `StatusPairs`, `WithCaret`, `LongValues`, `Widths`, `ReducedMotion` |
| `packages/ui/src/molecules/terminal-card/index.ts` | Writer | Named exports of the three components and `TerminalCardRow`/`TerminalCardTone` types |
| `packages/ui/src/index.ts` | Parent (integration) | `export * from './molecules/terminal-card';` alphabetically in the Molecules block |
| `packages/ui/src/lib/storybook-docgen.test.ts` / `storybook-controls.test.ts` | Parent (integration) | TerminalCard rows including `TerminalCardRow` field extraction, zero owned diagnostics |
| `scripts/package-exports.test.mjs` / `package-consumption.test.mjs` | Parent (integration) | Sorted type lists, SSR/consumer cases per §8 |
| `skills/_shared/prop-naming.json` + `docs/prop-naming.md` | Parent (integration) | Append usages to `accessible-name` (`label`), `collection-items` (`items`), `surface-material-tone` (`tone`); add `shell-label` and `terminal-caret` as `approved` bound to the #277 approval artifact (G3) |
| `scripts/catalog_data.py` + `docs/CATALOGO.md` / `docs/catalog.json` | Parent (integration, shared Unit C) | TerminalCard row note refresh (§9); single regeneration run, no parallel writers |

**No stylesheet.** `compiled.css:49` and `.storybook/preview.css:13,54` wildcards already cover the new folder; no `@source` edit.

Explicitly untouched: `docs/components/terminal-card/v0.1/**` (frozen), `packages/tokens/**`, legacy CSS, other components.

## 3. Typing approach and API fidelity

- `TerminalCardProps = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'tabIndex' | 'aria-label' | 'aria-labelledby' | 'aria-pressed' | 'aria-selected' | 'style' | 'dangerouslySetInnerHTML'> & { label: string; children: ReactNode; className?: string }`. `role` is fixed to `group` by the component and `aria-label` is owned by the required `label` prop; both stay stripped from the forwarded rest. Blank/whitespace `label` → development warning and no render (never an unnamed group).
- `TerminalCardBarProps = { children: ReactNode; shell?: string; className?: string }` — `children` is the path text; `shell` optional, whitespace-only omitted.
- `TerminalCardListProps = { items: TerminalCardRow[]; className?: string }`.
- `TerminalCardRow = { term: string; value: ReactNode; tone?: 'default' | 'success'; caret?: boolean }` — component-specific data fields; `tone` documents the applied `surface-material-tone` entry, `caret` the pending `terminal-caret` proposal. `@control select` on `tone`, `@control boolean` + `@default false` on `caret`, `@control false` + `@controlReason` on `value`.
- No ref, no `asChild`, no state, no timer. Docgen must resolve the row fields as separate extraction rows; R0 verifies this before GREEN.

## 4. Recipes and class composition

- **Root:** `cn(surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }), 'eg-terminal-card flex flex-col min-w-0 overflow-hidden', className)` — no width cap (approved OQ-5; consumer sets width via `className`). `surfaceVariants` base carries `box-border` (G7a, asserted).
- **Bar:** `cn(surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }), 'eg-terminal-card__bar border-b border-border-hairline rounded-t-xl flex items-center gap-2 px-4 py-2.5 min-w-0', className)` — the documented banded-header geometry (`ModuleCard`/`Panel` precedent; `docs/MATERIAL.md` bandas). Internal `Icon name="terminal" aria-hidden` in `text-fg-brand-raised`; path text `font-mono text-body-default text-fg-default min-w-0 [overflow-wrap:anywhere]` (the bar wraps like every card text; neither the web's `.eg-terminal__bar`/`.term-bar` rules nor the spec carry a truncation, so none is introduced).
- **Shell:** `eg-terminal-card__shell font-sans text-label-default text-fg-secondary ms-auto shrink-0`, rendered only when non-blank.
- **List:** `dl` with `eg-terminal-card__list grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 px-4 py-3 m-0 font-mono text-body-default min-w-0`. Terms `text-fg-brand-raised` (approved OQ-4, Material raised ink — an allowed difference from the web's `--color-primitive-red-200`); values `text-fg-default tabular-nums min-w-0 [overflow-wrap:anywhere]` so long values wrap instead of scrolling (TC-06).
- **Tone:** the `dd` carries `data-tone="success"` and the value recipe adds `data-[tone=success]:text-status-success`; the term/frame never change. Colour is never the only cue — the readable-text requirement is the consumer's documented obligation (tested as TC-04's readable-text case).
- **Caret:** internal `span aria-hidden="true"` `eg-terminal-card__caret inline-block w-2 h-4 bg-fg-brand-default align-text-bottom animate-pulse motion-reduce:animate-none`, rendered only for `caret: true` rows, after the value inside the same line container. Uses the existing `--animate-pulse` token (approved OQ-2); no new keyframe.
- **Composition rules:** per-part `cn()`; each part's `className` merged last for local layout; root `className` last for outer layout. No hover/transition utilities on the card (passive).

## 5. Test-first sequence

New component; every behavior test RED first. Public interface only.

| Step | RED test (`TerminalCard.test.tsx` unless noted) | Covers |
| --- | --- | --- |
| R0 | `storybook-docgen.test.ts` (TerminalCard section): docgen resolves `label` (required), `shell`, `items`, and the `TerminalCardRow` fields; `mapJSDocControls` reports `diagnostics: []`; `tone` extracts as a finite enum | TC-09, early |
| R1 | Root has `role="group"` and accessible name = `label`; blank/whitespace `label` warns and renders nothing | TC-01 |
| R2 | Pairs render as `dl` > `dt`/`dd` in supplied order; one `dt` before each `dd` | TC-02 |
| R3 | Bar renders the `aria-hidden` terminal glyph, the path text, and the shell only when supplied (`WithShell`/`WithoutShell`) | TC-03 |
| R4 | `tone: 'success'` row: `data-tone="success"` on the `dd` and the status-ink class marker present; the row's readable text is still the supplied value | TC-04 |
| R5 | `caret: true` renders one decorative cursor after the value, outside the accessibility tree; the caret classes contain `animate-pulse` and `motion-reduce:animate-none` | TC-05 |
| R6 | Long term/value at a narrow host: values wrap (`overflow-wrap` marker), no horizontal scroll on the card | TC-06 |
| R7 | `userEvent.tab()` over a rendered card: zero tab stops, no interactive descendant | TC-07 |
| R8 | Root has no `max-w-*` utility; consumer `className` (e.g. `w-96`) lands last on the root | TC-08 |
| R9 | Root class set contains `box-border`; no `hover:`/`cursor-pointer`/`transition` utility on root or bar (passivity) | G7a |

**PRESERVE.** No existing shared code changes. Evidence: existing lib/harness suites pass unchanged except their TerminalCard additions; `Stat` (the `role="group"` precedent) and `ModuleCard`/`Panel` (band precedent) suites stay green — their code is untouched.

GREEN order: `types.ts` → `useTerminalCard.ts` → `TerminalCard.tsx` → `index.ts` → stories → parent integration.

## 6. Stories and Controls

`Molecules/TerminalCard`, autodocs, `Meta<typeof TerminalCard>`, no manual `argTypes`, no `play`. `Default` (profile sheet: path `~/egdev`, `shell="zsh"`, five pairs, one `caret: true` + one `tone: 'success'`, mirroring VIS-03's left card), `WithShell`, `WithoutShell`, `StatusPairs` (success rows with readable text), `WithCaret`, `LongValues`, `Widths` (no built-in cap), `ReducedMotion`. A decorative `StatusDot` may be composed inside a value in examples (spec §3 allows it); the card never requires it. `label` is required — every story supplies it.

## 7. Registry integration

Applied approved entries: `label` → `accessible-name`; `items` → `collection-items`; `TerminalCardRow.tone` → `surface-material-tone`. Owner-approved conventions (G3): `shell-label` (`shell`) and `terminal-caret` (`caret`), approved via [issue #277 comment 6580404628](https://github.com/egdev6/egdev-design-system/issues/277#issuecomment-6580404628). At implementation the parent adds both entries as `approved` with that reference, the exact `convention:<id>` scope and `conventionHash(entry)`, appends the five usages with real source revisions, regenerates the view (`pnpm props:docs`) and runs `pnpm props:check` + `pnpm test:props`. No exception requested.

## 8. Package exports and consumption

- `scripts/package-exports.test.mjs`: add `TerminalCard`, `TerminalCardBar`, `TerminalCardList`, `TerminalCardRow`, `TerminalCardTone` and prop types to the sorted lists; SSR smoke asserts `role="group"` + `dl` rows + zero tab stops.
- `scripts/package-consumption.test.mjs`: positive cases (bar+list, success row, caret row); documented `@ts-expect-error` negatives for `role`/`aria-label` overrides on the root. Packed React 18/19 compile via the existing harness; no ref, no React-19-only API.

## 9. Catalog row update (shared parent-only Unit C)

All six layer-(c) rows are refreshed by **one shared parent-only integration unit (Unit C)** — a single writer edits `scripts/catalog_data.py`, then runs `python3 scripts/build_catalog.py` once so `docs/CATALOGO.md` and `docs/catalog.json` regenerate together; no parallel writers touch the shared file. Generated files are never hand-edited. For this component, Unit C updates line 72 to the implemented pattern (composes column unchanged): composes `Surface`; note → "Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/277): `role="group"` key/value terminal named by its required label; `surface-2` title bar with decorative glyph, supplied path and optional shell; two-column `dl` pairs with success tone and decorative caret on the approved `--animate-pulse` token. No max width, stylesheet, ref, asChild or dependency."

## 10. Browser checks to run before merge

Against `pnpm storybook` with real compiled tokens, after GREEN; observations recorded, never replacing tests:

1. Controls render per the central enhancer; zero owned diagnostics across TerminalCard stories.
2. **Real-browser layout verification against VIS-03:** compare `Default`/`StatusPairs` with the captured board — bar (glyph, path, shell), two-column mono pairs, emphasized status row, decorative cursor. Allowed differences recorded per the spec: solid `surface-1` frame with a `surface-2` band instead of glass; `text-fg-brand-raised` terms; `--animate-pulse` cadence instead of the web's 1.1 s hard blink; no 420 px cap. Visual conformity reported per criterion; capture never overwritten.
3. **Box-border / layout (layer-b lessons):** consumer width contains the border; the bar band sits inside the `rounded-xl` frame with its bottom hairline; long values wrap inside the two-column grid with no card-level horizontal scroll; caret is a fixed token-sized block (no measured width).
4. Reduced motion: the caret is static under `prefers-reduced-motion: reduce`.
5. Keyboard/screen reader: group announced by `label`; glyph and caret absent from the accessibility tree.

Full gates before merge, parent-scheduled with observed output: `pnpm typecheck`, `pnpm lint`, focused first (`pnpm exec vitest run packages/ui/src/molecules/terminal-card packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts`), then `pnpm test`, `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm props:check`, `pnpm test:props`.

## 11. Bounded work units

1. **Unit A (writer):** the six `packages/ui/src/molecules/terminal-card/` files; focused tests green.
2. **Unit B (parent integration):** index export line, docgen/controls sections, package harness additions, registry usage append + the two approved convention entries (G3) + props check.
3. **Unit C (shared parent-only catalog integration, all six components):** exact row refreshes per each plan's §9, one `build_catalog.py` run.

## 12. Risks

- **R-1 — Row-field docgen extraction.** `TerminalCardRow` fields must extract as real rows with controls; if `react-docgen-typescript` collapses the exported type alias, the honest options are a metadata-only restructure that preserves the public type or a spec question — never silent restructuring (mirrors Chip R-1).
- **R-2 — Bar path truncation.** The plan truncates the bar path while the card never truncates pair content; this split is a plan-level reading of the spec (the bar is chrome) and is stated for review; the capture shows full paths.
- **R-3 — Registry materialization timing (G3).** The conventions are approved; the JSON entries must still be written with exact scopes and `conventionHash(entry)` values at implementation, and `pnpm props:check`/`pnpm test:props` verify the binding.
- **R-4 — Spec provenance** (G2): historical snapshot metadata; the frozen digest and approval comment are the binding provenance; broken relative links remain a reported follow-up.

## 13. Stop

This plan authorizes nothing until G1. The `shell-label`/`terminal-caret` conventions are already owner-approved (G3 artifact); no reapproval is requested. No source, test, token, dependency, registry, catalog or Git action is taken or implied.
