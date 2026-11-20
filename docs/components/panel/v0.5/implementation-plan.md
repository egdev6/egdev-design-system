# Panel v0.5 — fill implementation plan (also holds the shared Panel + Tabs steps)

- **Status:** Approved — 2026-11-20 by the owner (reply "Apruebo con las recomendaciones"): OQ1 approval record for `host-fill`; OQ2 hook/recipe fingerprints captured from the base commit; OQ3 `true`-only fill variants; OQ4 VIS captures authorized; OQ5 typed samples plus a CSS assertion; OQ6 one joint implementation record; OQ-T1 extra Tabs default pin; OQ-T2 `data-fill` applied after native props.
- **Spec:** [fill-amendment.md](fill-amendment.md), v0.5, approved 2026-11-19 ("Acepto todas"), `contentSHA256: a7842866492a1553616c56a5bccc159ce726812a34a72b610d5b9888a7267a4b`. Verified while writing this plan: SHA-256 of the UTF-8 bytes from the `## 1. Purpose and scope` heading line (the heading itself, not the preceding LF) through EOF reproduces the digest. The Tabs amendment digest `f9c81882…` was verified the same way.
- **Companion plan:** [Tabs v0.5 plan](../../tabs/v0.5/implementation-plan.md) references this document for every shared step (sections 6–9 here).
- **Issue / branch:** [#499](https://github.com/egdev6/egdev-design-system/issues/499), canonical [#180](https://github.com/egdev6/egdev-design-system/issues/180); branch `feat/panel-tabs-fill`. One combined PR with Tabs (#500) per the owner's "todo junto".
- **Skill:** `skills/component-contributor/SKILL.md`, plan stage. No prerequisite component, token, Radix primitive or dependency is missing; nothing is proposed in `theme.css`.

## 1. Files touched (Panel)

Folder `packages/ui/src/molecules/panel/`. The six mandatory files already exist; **No stylesheet** (unchanged). `index.ts` is untouched (no new export).

| File | Change |
| --- | --- |
| `types.ts` | `PanelProps.fill?: boolean` with JSDoc (`@default false`, `@control boolean`); static CVA `fill` variants on `panelVariants`, `panelHeaderVariants`, `panelBodyVariants`, `panelFooterVariants` |
| `usePanel.ts` | Destructure `fill` out of the native props (never forwarded); normalize `fill === true`; add `fill` to `PanelPresentation` and to the context value; pass it to the part recipes; add `'fill'` to `ProtectedProps`/`passiveNativeProps` so untyped `fill` on a part is consumed |
| `Panel.tsx` | Unchanged structure (it already provides `presentation` through `PanelContext`) |
| `Panel.test.tsx` | New `describe('Panel fill contract')` (section 3) |
| `Panel.stories.tsx` | `FillHost`, `FillWithTabs` stories (section 4) |

Wiring outside the folder: `packages/ui/src/lib/storybook-controls.test.ts` (Panel `fill` boolean row, default `false`), `packages/ui/src/lib/storybook-docgen.test.ts` (Panel own-prop list gains `fill`), `scripts/package-consumption.test.mjs` (typed `fill` sample on Panel and Tabs in the existing fixture, plus `@ts-expect-error` for `fill='yes'`), `scripts/package-exports.test.mjs` only if an assertion pins `PanelProps` keys. `compiled.css` and `.storybook/preview.css` already scan Panel's `types.ts` and stories; confirm with a grep before editing, add nothing unless missing.

## 2. CVA, hook and JSX changes per part

All utilities are static strings; the `fill` variant has only a `true` key, so an omitted or `false` value emits no class (AC-01, byte-identical).

| Recipe | `fill: true` adds |
| --- | --- |
| `panelVariants` (root) | `h-full min-h-0` |
| `panelHeaderVariants`, `panelFooterVariants` | `shrink-0` |
| `panelBodyVariants` | `min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable] has-[>[data-fill]]:[scrollbar-gutter:auto] focus-visible:outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-focus-ring` |

- **Context propagation:** `PanelContext` carries `{ tone, variant, fill }`. `usePanelPart` reads `fill` from the nearest Panel only, so a non-fill Panel nested in a fill Body (and the reverse) stays independent, as `tone` and `variant` already do. `panelBodyVariants({ tone })` becomes `panelBodyVariants({ tone, fill })`; header/footer already receive the whole presentation object, so `fill` flows in with it (a header/footer recipe without a `fill` variant would ignore it, so both get the variant).
- **Root:** the existing `Surface` or plain `div` path is unchanged; `h-full min-h-0` is composed through `cn()` in `panelVariants`, before `className` (outer layout only, unchanged). Verify with a test that `twMerge` against Surface's classes drops none of the fill utilities.
- **`data-fill` and D-G:** Panel emits no `data-fill` itself. Body's `has-[>[data-fill]]:[scrollbar-gutter:auto]` matches the Tabs root marker (Tabs plan section 2). The utility is emitted only in fill mode, so a non-fill Body is byte-identical. Tailwind v4 compiles it to `:has(> [data-fill])`; confirm in the built stylesheet.
- **Does not touch:** `ModuleCard` (does not import Panel or Tabs; re-grep `packages/ui/src` imports in the PR and run its suite unchanged).

## 3. Tests, RED first (`Panel.test.tsx`)

Before any edit, capture the SHA-256 of the default class output of the root, Header, Body and Footer for every tone × variant × `accentEdge` combination on the base commit and pin it as constants (the pattern of Tabs' v0.3 fingerprint test). RED: the fill cases fail because `fill` is unknown; the pin passes before and after.

| AC | Cases |
| --- | --- |
| AC-01 | Pinned fingerprints for the full tone × variant × edge matrix; `fill={false}`, omitted and untyped values (`'yes'`, `1`, `null`) give identical output; no `fill` attribute reaches any DOM node |
| AC-02 | Root has `h-full min-h-0` and keeps `flex flex-col`; Header/Footer `shrink-0`; Body has `min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]`; orphan zones still throw the exact context diagnostic; a built-CSS test (extend the existing production-CSS assertion style) finds each utility |
| AC-03 | Not applicable in jsdom (layout); browser only |
| AC-04 | Matrix test: missing Header/Footer, banded, three tones and `accentEdge='start'` keep their existing classes plus only the fill utilities; the `eg-panel*` markers and corner variants are unchanged |
| AC-05 | Body has `focus-visible:outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-focus-ring`; Body has no `tabIndex` and no role (Panel stays passive); `userEvent.tab` order across Header/Body/Footer controls is unchanged |
| AC-06 | Not applicable in jsdom; covered by the Tabs plan's nested story and browser check |
| AC-07 | Strict in-memory type tests (`fill: true` OK, `fill: 'x'` error) in the existing scoped consumer; docgen row; Controls row |
| AC-08 | Fill Body emits `has-[>[data-fill]]:[scrollbar-gutter:auto]`; non-fill Body emits neither it nor the stable gutter; the production-CSS test finds the `:has(> [data-fill])` rule; a nested fill Panel inside a non-fill Panel resolves context independently |

Counts: 8 ACs; 5 have a primary unit test (AC-01, 02, 04, 05, 08), AC-07 is tooling/type tests, AC-03 and AC-06 are browser-only (AC-06 is paired with a Tabs unit assertion). About 12 new `it` cases. PRESERVE: the existing Panel suite and `ModuleCard` suite run unchanged.

## 4. Stories

`Panel.stories.tsx` (English copy, no manual `argTypes`, no `play`):

- `FillHost`: `fill` Panel (banded, Header, long Body, Footer action) in a **fixed 440 × 640 host** (`h-[640px] w-[440px]` as story-only layout; stories are the only place with example layout utilities). VIS-01 subject.
- `FillWithTabs`: fill Panel containing a fill outline `Tabs` as the sole Body child, long panels, same host. VIS-02 subject; the Tabs plan reuses it.
- `Default` keeps required/example args only and does not set `fill`. Descriptions state the host-owns-definite-height rule and the D-G gutter behavior.

## 5. Commit units (~400 lines, Conventional Commits, one combined PR)

| # | Commit | Content | Approx. |
| --- | --- | --- | --- |
| 1 | `feat(ui): add Panel fill layout` | Panel `types.ts`, `usePanel.ts`, `Panel.test.tsx` (incl. fingerprints), `FillHost` story | ~400 |
| 2 | `feat(ui): add Tabs fill layout` | See the Tabs plan (types, hook, JSX, tests, Tabs stories) | ~400 |
| 3 | `feat(ui): wire fill into controls, docgen and package fixtures` | `FillWithTabs` story, `storybook-controls.test.ts`, `storybook-docgen.test.ts`, `package-consumption.test.mjs` (+ `package-exports` if needed) | ~250 |
| 4 | `docs(ui): register host-fill naming and refresh system artifacts` | Section 6 and 7 outputs; mostly generated | generated |
| 5 | `docs(ui): record Panel and Tabs v0.5 implementation and verification` | `docs/components/panel/v0.5/implementation.md`, `docs/components/tabs/v0.5/implementation.md` (observed commands, RED/GREEN counts, browser results, Not-evaluated list) | ~200 |

Each commit keeps the tree green. Commit 4 hashes both `types.ts` files after commit 3 is final. The parent owns commit, push and PR.

## 6. Shared: prop-naming registry (`host-fill`)

Added once, here; the Tabs plan only references it. Lookup was done in the spec (no `fill` entry or alias exists).

1. `skills/_shared/prop-naming.json`: one new convention `host-fill` / `fill` with the approved D-N payload from the amendment (`meaning`, `whenToUse`, `avoid`, `aliases: []`, `exceptions: []`, `status: approved`) plus an `approval` object `{reference, scope: 'convention:host-fill', contentHash}` where the hash is the digest of the convention payload, exactly as the validator requires (`scripts/prop-naming.mjs`).
2. Two usages on that entry (`status: 'existing'`): `PanelProps` (`packages/ui/src/molecules/panel/types.ts`, type `boolean`) and `TabsProps` (`packages/ui/src/molecules/tabs/types.ts`, type `boolean`), each with `source.revision = sha256:<whole-file byte hash>` of the **final** file, computed last (after Biome/format; any later edit recomputes).
3. **Refresh every existing usage revision that points at either `types.ts`.** Changing a `types.ts` changes its whole-file hash, so the existing Panel and Tabs usages (`variant`, `tone`, `accentEdge`, `items`, `label`, `fullWidth`, `labelWrap`, …) need their `revision` updated; find them with a grep of `molecules/panel/types.ts` and `molecules/tabs/types.ts` in the registry. `pnpm props:check` fails otherwise.
4. Approval record `docs/decisions/prop-naming-panel-tabs-fill-approval.json`, `kind: human-approval-record`, same shape as `prop-naming-attachment-field-approval.json`: decision "Approve the host-fill convention (`fill`) for Panel and Tabs without changing any existing component contract", the owner quote "Acepto todas" (provenance `odd/tasks/panel-tabs-fill-specs.md L2`, D-N A, 2026-11-19), a quote from this plan's approval once given, `limits` (binds only the `host-fill` payload; `fullWidth`, `sticky`, `maxHeight`, `layout`, `filled` unchanged), and the entry with its `contentHash`. See OQ1.
5. Commands: `pnpm props:docs` (regenerates `docs/prop-naming.md`), `pnpm props:check`, `pnpm test:props`. If `prop-naming.test.mjs` pins convention/source pairs, add the two exact pairs.

## 7. Shared: catalog and system artifact

- Catalog: no new row (variant of existing molecules). Check `scripts/catalog_data.py` notes for Panel/Tabs; add the fill mention only if the rows list capabilities, then `python3 scripts/build_catalog.py`. Never edit generated catalog files.
- `pnpm build` regenerates `packages/system/design-system.json` (`pnpm artifact --write`) and `system.md` (`pnpm system:docs`); commit the regenerated files and verify no drift afterward (`git status` clean). Expected additive diff: `fill` on Panel and Tabs props, one `propNaming` convention and two usages, regenerated `system.md`. Read the exact counts from the diff. **Do not change** token counts, `theme.css`, `tokens.css`. `anatomyUtilities` may change if new utility names are recorded; review, never suppress.
- No version bump or changelog here; release is the parent's separate step (T5).

## 8. Shared: verification

### 8.1 Local gates (CI Verify list, S4)

Focused first: `pnpm exec vitest run packages/ui/src/molecules/panel packages/ui/src/molecules/tabs packages/ui/src/molecules/module-card packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2`.

Then, serialized per `docs/decisions/test-worker-budget.md`: `pnpm lint` (and Biome on branch files) → `pnpm props:check` → `pnpm test:props` → `pnpm typecheck` → `pnpm build` (then confirm no drift in `packages/system/*` and `docs/`) → `pnpm test` → `pnpm test:cli` → `pnpm --filter @egdev/tokens run test` → `pnpm test:artifact` → `pnpm system:check` → `pnpm test:system` → `pnpm test:package-exports` → `pnpm test:package-consumption` → `pnpm test:package-release`.

### 8.2 Real browser (Playwright, Chrome; Storybook on 127.0.0.1:6006 after `pnpm tokens`)

Never records an approval and never replaces a reference. Conditions recorded per capture (viewport, DPR, browser version, theme, fonts, motion/forced-colors, crop, date, tool, SHA-256) under `docs/components/panel/v0.5/` and `docs/components/tabs/v0.5/`.

1. **Classic scrollbars:** launch Chrome with overlay scrollbars disabled (`--disable-features=OverlayScrollbar`, and check `scrollbar-gutter` effects with a visible 15 px bar), so gutter behavior is observable.
2. **`FillHost` at 440 × 640 and 440 × 520:** Header/Footer rects fixed while Body `scrollTop` changes; Body `scrollHeight > clientHeight`; Footer inside the host (AC-02); `accentEdge` stationary; corners (AC-04).
3. **Gutter shift (AC-03):** compare Body content x before and after adding content.
4. **Keyboard scrolling of PanelBody (D-P1 A):** with a Body without focusable children, press Tab and record whether Chrome focuses the scroller, that arrows/Page keys scroll it, and that the inset ring is visible; with a long form, Tab through controls and confirm each focused control is scrolled into view and Footer actions stay reachable; LTR/RTL, zoom 200%, forced colors. If an engine does not focus the scroller, return to the owner with evidence (per D-P1); no `tabIndex` is added.
5. **`FillWithTabs`:** Body `scrollHeight === clientHeight`, one scroller (the tab panel), nested computed `scrollbar-gutter` on Body is `auto`; plain-child Body stays `stable` (AC-06, AC-08); `:has()` support noted per engine.
6. **Tabs panel keyboard scrolling:** focus the panel (it is a `tabIndex=0` `role=tabpanel`), arrows/Page Up/Down/Home/End scroll it, the list stays fixed, inset ring (`-outline-offset-2`) visible inside the clipping Body (Tabs AC-04, 05).
7. **Not verifiable here:** Firefox/Safari scroller-focus behavior, real Windows WebView2 (Recado), screen readers.

Until the owner authorizes captures, VIS rows stay Pending and visual conformity **Not evaluated** (OQ4).

## 9. Risks

- **R1 (additive public API).** One optional boolean on two components; no token, dependency or stylesheet change. Rollback: remove the prop and the registry entry.
- **R2.** Default byte-identity relies on the pinned fingerprints; capture them from the base before editing, otherwise the test proves nothing.
- **R3.** `has-[>[data-fill]]` depends on `:has()` support and matches any direct child with `data-fill` (accepted by D-G, including siblings case). Engines without `:has()` get a double gutter on classic scrollbars only.
- **R4.** `twMerge` may collapse conflicting arbitrary-property utilities (`[scrollbar-gutter:stable]` vs `has-[…]:[scrollbar-gutter:auto]`); the variant prefix should keep them distinct, but it must be asserted in AC-08.
- **R5.** Registry revisions are whole-file hashes: any Biome reformat of either `types.ts` after hashing breaks `props:check`.
- **R6.** Header/Footer `shrink-0` plus `flex-wrap` zones: tall wrapped footers can starve Body in a short host (by design; the host owns height).
- **R7.** Chrome-only browser evidence; WebView2 equivalence is assumed, not measured.

## 10. Open questions (not decided here)

- **OQ1 — Approval record for `host-fill`.** The validator requires an approval for `status: approved`. Proposal: `docs/decisions/prop-naming-panel-tabs-fill-approval.json` quoting "Acepto todas" (D-N A) and the approval of this plan. Alternative: register as `proposed`, which contradicts the spec's "approved" wording.
- **OQ2 — Default fingerprint scope.** Pin class output through the hook/recipes (as Tabs does) rather than DOM snapshots. Confirm.
- **OQ3 — Fill variant shape.** `fill: { true: '…' }` only (no `false` key) so default output cannot change; acceptable to the owner as an internal detail.
- **OQ4 — VIS captures.** Authorization to capture VIS-01..02 (both amendments) as Proposed references; otherwise they stay Pending.
- **OQ5 — Fixture scope.** Whether `package-consumption` gets a CSR scroll scene or only typed samples plus the built-CSS assertion for the new utilities (proposed: typed samples + CSS assertion).
- **OQ6 — Combined release docs.** Whether `implementation.md` records for both components stay as two files (proposed) or one joint file.
