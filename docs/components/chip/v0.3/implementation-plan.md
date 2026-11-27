# Chip v0.3 — implementation plan

- **Status:** Proposed, never approved. Presented for separate owner approval (S6). It authorizes no code, test, registry write, artifact or catalog regeneration, capture, release or Git action. Nothing below is implemented or measured: preparation was read-only (file reads, digests, `git` inspection and one read-only `gh issue view 576`), and no build, test, Storybook, browser or capture ran.
- **Coverage:** S2 and S6 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md), request #576 only (filed in L7, cataloging approved in L10); this is the plan gate that precedes implementation under T6, which is sequential across the Round 5 lanes. It does not cover #577 (ProjectCard v0.4, which has its own spec and plan). Branch, PR and merge belong to T7 and the parent; the writer never switches branches or commits. Format follows the [Carousel v0.4](../../carousel/v0.4/implementation-plan.md) amendment plan (same registry-refresh, browser and changelog sections) and the [Pagination v0.1](../../pagination/v0.1/implementation-plan.md) plan for the emission and cascade proofs of the recipe this change reuses.
- **Contract authority:** [spec.md](spec.md) v0.3, **Proposed** (not approved), `contentSHA256: 72174131b0988846c99664146ba39b096bf1a1035c947fe35709bad17d1e0cae`, reproduced byte-exact in this working tree by three independent methods (Python, `awk` and `sed`) with the spec's own rule: the payload from the line-start `## 1. Purpose and scope` through EOF, LF, final newline, not the inline mention in its header. This plan pins that draft. Owner approval of the spec with its recommended answers (OQ-1 to OQ-4) folds them into the spec's bytes and moves the digest, so the pinned digest and every section that rests on an answer must be re-read against the approved bytes before G1 (G2). Cataloging approval: L10, "Aprobar las dos (Recomendado)". Visual hashes: VIS-01 `a45c6772…` (historical capture reused from Chip v0.2); VIS-02 to VIS-05 Pending.
- **Plan identity:** `contentSHA256: 4b8b88c7102439460108cedb1690fa5b1d9b1d81b9bd9568c6c36bb0afa6af12` — SHA-256 of the UTF-8, LF, final-newline payload from the exact `## 1. Authority and gates` heading line (line start, not an inline mention) through EOF; the metadata above it is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `5ed0748`. When inspection started, the only modified tracked files were `odd/tasks/round-5-cataloging.md` and `odd/tasks/round-5-consumer-requests.md` (the parent's records). Another lane then began modifying shared integration files in the same tree (`scripts/catalog_data.py`, both changelogs, the generated catalog, `design-system.json`, `system.md`, `packages/mcp/README.md` and `scripts/storybook-mcp-exceptions.json`), so every prefix below is the **committed content at HEAD `5ed0748`**, not the current working tree, and the shared ones must be re-verified at the start of implementation: `atoms/chip/types.ts` `8cdf8fe5`, `useChip.ts` `b7320613`, `Chip.tsx` `134581b2`, `Chip.test.tsx` `bb921114`, `Chip.stories.tsx` `e79f557e`, `index.ts` `73ffaf4d`; `molecules/chip-group/types.ts` `10f3f340`, `useChipGroup.ts` `bbf0e5b5`; `molecules/pagination/types.ts` `b947a96e`; `packages/ui/src/index.ts` `20059f04`, `styles/compiled.css` `82784cfe`, `.storybook/main.ts` `3a21db23`, `.storybook/preview.css` `eb001f5d`; `storybook-docgen.test.ts` `72a0b095`, `storybook-controls.test.ts` `3e746e89`, `storybook-css.test.ts` `c44b09c0`; `scripts/package-exports.test.mjs` `26f4dc6b`, `package-consumption.test.mjs` `e04c6955`, `design-system-artifact.test.mjs` `75878af8`, `prop-naming.test.mjs` `afb1b38c`, `catalog_data.py` `d16eea26` (125 rows); `skills/_shared/prop-naming.json` `6228f538` (191 entries: 186 approved, 5 proposed); `packages/ui/CHANGELOG.md` `5b7090f2`, `packages/system/CHANGELOG.md` `c690cf11`; generated: `docs/CATALOGO.md` `4e9dfb8d`, `docs/catalog.json` `17db0cc9`, `docs/prop-naming.md` `bb9fe017`, `packages/system/design-system.json` `48de625a` (643,153 bytes against the 768 KiB budget asserted at `design-system-artifact.test.mjs:2324`), `system.md` `62526b8b`.
- **Visuals:** VIS-01 is a historical Foundation capture of the base pill, and VIS-02 to VIS-05 are Pending in the spec: no capture of the current state and no expected design exists. This plan produces behavior and computed-style evidence only; visual conformity stays **Not evaluated**.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surface of §2, including the integration surfaces the parent owns. The spec approval alone grants no code (S6). Approving the plan approves no capture, release or GitHub write.
2. **G2 — Spec provenance.** The spec is Proposed. Approving it with answers to OQ-1 to OQ-4 changes its bytes and digest, so this plan pins the draft only. Before G1, re-read the plan against the approved bytes and update its header digest. Sections that rest on an answer move with it: OQ-1 decides the three `forced-colors:focus-visible` utilities, OQ-3 decides the hover-order proof, and OQ-2 and OQ-4 decide no code. v0.2 is bound by its approval references, not by its declared digest, which does not reproduce under the anchored rule (spec §1, fact 7); nothing here upgrades it.
3. **G3 — Registry.** No new convention, no exception and no usage: `aria-current` is an inherited native attribute (spec §3 lookup). The plan refreshes the `source.revision` of the seven existing Chip usages (§5.1). No status, approval or receipt changes, and refreshing a revision approves nothing globally.
4. **G4 — Recipe, tokens and files.** Recipe R1 is Pagination's approved selected recipe, applied to `aria-current` `page` and `true` (spec §6). No token, dependency, Radix package or stylesheet is added. **No stylesheet**: `chip.css` is not created and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical. The `link` recipe entry stays one static string literal, with no template, concatenation, array, inline style, interpolated class or new AGENTS.md exception. One reading is flagged for confirmation at G1 (D3): `Highlight` is a CSS system-colour keyword, not a token (precedent: Pagination, Carousel R1, ColorSwatchGroup).
5. **G5 — Metadata pipeline.** The narrowed declaration is an own declaration, so the contract requires JSDoc and `@control` (`false` with a reason is proposed, spec §3). The merged docgen row, the Controls enhancer, the AST own-prop pins and the artifact must represent it with zero diagnostics and no manual `argTypes`. The first RED run records what the real pipeline extracts. If it cannot represent the narrowing under the contract's rules, or if `.storybook/main.ts` (`documentedNativeProps`, `hiddenOwnProps`) would have to change, **stop**: that is an owner decision, not a plan tweak.
6. **G6 — Cascade and emission are proved, not assumed.** The hover order, the compound focus rule and the forced-colours rules are proved on the emitted production CSS and on the packed build (§4 E1 and E2, §5.5), and the focus proof must be shown able to fail.
7. **G7 — Integration ownership.** The registry JSON and generated view, the docgen and Controls pins, the package harnesses, the system artifact, the catalog source and outputs, the changelogs, the evidence file and the ODD log are parent-owned integration surfaces, as in the Carousel and Pagination plans. A writer touches only `types.ts`, `Chip.test.tsx` and `Chip.stories.tsx`.
8. **G8 — Stop lines.** Stop and return to the owner if: a utility does not emit or cascades differently from §3 (the current paint loses to hover, the focus ring loses to R1's edge shadow, or a forced-colours rule is emitted before `outline-none`), because a stylesheet, `!important` or an inline style would need a spec amendment; the metadata pipeline cannot represent the narrowing (G5); `useChip.ts`, `Chip.tsx` or `index.ts` would have to change; a generator demands an edit outside §2; any registry entry other than the seven revisions would change; ChipGroup, a static Chip consumer or the toggle and static output would change; or a token, dependency or stylesheet appears necessary.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/atoms/chip/types.ts` | Writer | `ChipLinkProps` (`:80`): add `'aria-current'` to the `Omit` list and declare `'aria-current'?: 'page' \| 'true'` after `href` with English JSDoc and the directive of spec §3; extend the `link` entry of `chipVariants` (`:124`) with the 19 static utilities (§3), still one string literal; no new export | +10 / −2 |
| `packages/ui/src/atoms/chip/useChip.ts`, `Chip.tsx`, `index.ts` | none | No change expected: `aria-current` reaches the anchor through `...rest` and no export is added. A needed edit is a G8 stop | 0 |
| `packages/ui/src/atoms/chip/Chip.test.tsx` | Writer | New `describe('Chip link current state (v0.3)')` (§4, T1 to T6, E1, E2), compile fixtures in `chipRejectedInputs` (`:15`), and a memoized CSS-build helper used only by the new tests; the existing bodies stay unedited apart from the fixture array | +160 / −2 |
| `packages/ui/src/atoms/chip/Chip.stories.tsx` | Writer | `LinkCurrent` and `LinkCurrentWithIcon` after `ExternalLink`; the meta usage text (§6) | +36 / −1 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | Chip block (`:6323-6431`): the `chipControls` entry, the extracted-row list and the `false`-reason pin (`:6374`) follow the observed extraction; two story names added at `:6426` (§5.2) | +6 / −2 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | Control map entry (`:538`), `chip: 10` → `11` (`:856`, checked at `:1622`), one mapping test beside the Chip row (§5.2) | +15 / −1 |
| `packages/ui/src/lib/storybook-css.test.ts` | none | **No edit.** E1 and E2 live in `Chip.test.tsx`, which already builds `compiled.css` through Vite and Tailwind | 0 |
| `scripts/package-exports.test.mjs` | Parent | Extend `Chip ships its exact token-backed pill…` (`:4376`) with the R1 selectors, declarations and order checks; a link SSR assertion beside `:8814` (§5.5) | +34 |
| `scripts/package-consumption.test.mjs` | Parent | Typed positive sample, two `@ts-expect-error` negatives beside `:3264-3275`, `assertChipCSS` (`:3893`) and the SSR block (§5.5) | +20 / −1 |
| `skills/_shared/prop-naming.json` | Parent | Refresh the seven Chip `source.revision` values; append nothing (§5.1) | +7 / −7 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited | ≈ ±7 long lines |
| `scripts/prop-naming.test.mjs` | Parent | **No edit expected.** The `render-mode` receipt test compares the usage revision with the live file hash (`:4180`), so it passes after the refresh; the post-receipt list (`:567-571`) gains no usage | 0 |
| `scripts/design-system-artifact.test.mjs` | Parent | One Chip assertion beside `:2009` (§5.3) | +12 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited | 1 minified line; ≈ ±8 |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md:67`, `docs/catalog.json:253` | Parent | Chip row note (`catalog_data.py:28`): replace the stale "always-pressable" text, then one `build_catalog.py` run (§5.4) | ±1 line each |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | Entries under the existing `## 0.11.0` and `## 0.13.0` citing `(#576)` (§7) | +11; +4 |
| `docs/components/chip/v0.3/implementation-evidence.md` (+ `capture.json` and PNGs only if authorized) | Parent | Observed RED and GREEN output, browser table, hashes (§9) | +40 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the plan approval and the delivery | +6 |

Explicitly untouched: `packages/ui/src/molecules/chip-group/**` and `packages/ui/src/molecules/pagination/**` (ChipGroup and the recipe's source stay as they are); `detail-header`, `project-card` and `notes-board` (static Chip consumers: their suites run only as PRESERVE evidence); `packages/tokens/**`; `packages/ui/src/styles/**` (`compiled.css` already scans `../atoms/chip/types.ts`; the legacy bundle is frozen); `.storybook/**` (the preview already scans `Chip.stories.tsx`, and `main.ts` changes only through an owner decision under G5); `packages/mcp/**` (no Chip example in its README or tests, though `pnpm test:mcp` still runs because CI does); package manifests and versions; `packages/ui/src/index.ts`; other components; the frozen v0.1 and v0.2 documents; the spec.

## 3. Design of the change

**API.** Exactly spec §3: the narrowed declaration on the link branch with the planned English JSDoc ("Marks the link as the current item: `page` when the destination is the page being shown, `true` for the current item of a set that is not a page sequence, such as the active filter. Both paint the same current treatment; any other token does not compile.") and the directive of spec §3, without a `@default`.

**CVA structure.** The `link` entry stays one static literal: the 11 existing utilities, unchanged and in the same order, followed by the 19 of R1.

```ts
// packages/ui/src/atoms/chip/types.ts, mode.link (the base and the toggle and static entries are unchanged)
link: 'pointer-coarse:min-h-14 cursor-pointer no-underline transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-border-hairline-strong hover:[background:var(--gradient-sheen),var(--color-surface-2)] hover:text-fg-default focus-visible:outline-none focus-visible:shadow-focus aria-[current=page]:border-state-selected aria-[current=true]:border-state-selected aria-[current=page]:[background:var(--gradient-chip-active),var(--color-surface-1)] aria-[current=true]:[background:var(--gradient-chip-active),var(--color-surface-1)] aria-[current=page]:shadow-[var(--shadow-edge-strong)] aria-[current=true]:shadow-[var(--shadow-edge-strong)] aria-[current=page]:text-fg-default aria-[current=true]:text-fg-default aria-[current=page]:focus-visible:shadow-focus aria-[current=true]:focus-visible:shadow-focus forced-colors:focus-visible:outline-solid forced-colors:focus-visible:outline-(length:--focus-width) forced-colors:focus-visible:outline-[color:Highlight] forced-colors:aria-[current=page]:outline-solid forced-colors:aria-[current=page]:outline-(length:--focus-width) forced-colors:aria-[current=page]:outline-[color:Highlight] forced-colors:aria-[current=true]:outline-solid forced-colors:aria-[current=true]:outline-(length:--focus-width) forced-colors:aria-[current=true]:outline-[color:Highlight]'
```

**Why the utilities are doubled.** `aria-[current=page]:` and `aria-[current=true]:` are two static selectors. The `page` strings are Pagination's own (`pagination/types.ts:120-123`), and the `true` strings repeat them with the other token, so the reuse is literal and each utility keeps its precedent. A single `:is()` arbitrary variant would halve the class count but has no precedent in the repository. tailwind-merge keeps every one of them because their variant prefixes differ from the base utilities and from each other (T2 pins it). The cost is 19 longer class names on every link chip, which is cosmetic.

**Hook and component.** No change. The link branch of `useChip` spreads `...rest` onto the anchor, so `aria-current` reaches the DOM untouched, and the spec promises forwarding for every value, so no runtime guard or normalization is added.

**Emission inventory.** Each static R1 utility, the declaration it must emit, and where it is proved:

| Utility | Required emitted declaration | Proof |
| --- | --- | --- |
| `aria-[current=page\|true]:border-state-selected` | `border-color` from `--color-state-selected`, only under `[aria-current="page"]` or `[aria-current="true"]` | E1 |
| `aria-[current=page\|true]:[background:var(--gradient-chip-active),var(--color-surface-1)]` | `background: var(--gradient-chip-active), var(--color-surface-1)` under the same selectors | E1 |
| `aria-[current=page\|true]:shadow-[var(--shadow-edge-strong)]` | `--tw-shadow: var(--shadow-edge-strong)` and a `box-shadow` that uses `--tw-shadow` | E1 |
| `aria-[current=page\|true]:text-fg-default` | `color` from `--color-fg-default` | E1 |
| `aria-[current=page\|true]:focus-visible:shadow-focus` | the focus-ring `--tw-shadow` that `focus-visible:shadow-focus` already declares; the selector requires both the attribute and `:focus-visible`, strictly more specific than R1's edge shadow, so the ring wins | E1, E2 and the failing-focus proof |
| `forced-colors:focus-visible:outline-solid`, `…outline-(length:--focus-width)`, `…outline-[color:Highlight]` | inside `@media (forced-colors: active)`: `outline-style: solid`, `outline-width: var(--focus-width)`, `outline-color: Highlight`, emitted after the plain `outline-none` rule | E1, E2 (order), AC-08 emulation |
| `forced-colors:aria-[current=page\|true]:outline-solid`, `…outline-(length:--focus-width)`, `…outline-[color:Highlight]` | the same three declarations inside the media block, under `[aria-current="page"]` or `[aria-current="true"]` | E1, E2 (order), AC-08 emulation |

Five of the 19 are new to the built CSS: the `aria-[current=true]` border, fill, edge shadow, text and compound focus ring. The `page` ones and the three forced-colours focus ones already ship with Pagination, and the three `forced-colors:aria-[current=true]` outline ones already ship with Carousel (`carousel/types.ts:185`); Tailwind emits an identical utility once.

## 4. Test-first sequence

Public-interface tests first, with the intended RED captured verbatim before any implementation (the evidence file records the command, exit code and counts). Browser-only paint and cascade are not claimed from jsdom; they sit in §9.

**New unit tests** (`Chip.test.tsx`, roles and accessible names, `userEvent`, no complete class strings beyond the pinned lists, no `data-testid`):

| ID | Test | Covers |
| --- | --- | --- |
| T1 | A link chip with `aria-current` `page` and with `true`: `getByRole('link', { name })` has the attribute, the tag is `A`, `eg-chip` is kept, and none of `data-state`, `role`, `aria-pressed`, `aria-selected` or `style` is present; with `external` the name keeps the notice | AC-03 |
| T2 | Class contract: the link classes minus the pinned v0.2 link set equal the 19 utilities of spec §6 (set equality), each appears once, none of the forbidden patterns (literal colour or shadow, `opacity-`, `animate-`, transform utilities, `is-*`) appears, and with `className='m-2'` all 19 survive `cn()` with `m-2` last | AC-04 |
| T3 | PRESERVE: the pinned v0.2 link set (a literal array in the test) is a subsequence of the link classes in the same order; `chipVariants()` equals the toggle; the toggle and static sets contain no `aria-[current` | AC-01, AC-02 |
| T4 | Compile fixtures: `chipRejectedInputs` gains link rows for `'step'`, `'location'`, `'date'`, `'time'`, `'false'`, `true` and `false` (each under `@ts-expect-error`), and an exported `chipCurrentAccepted` holds link rows for `'page'` and `'true'` plus a toggle row with `'step'` and a static row with `'location'` that stay accepted | AC-09 |
| T5 | Runtime boundary: `aria-current` through a cast (`'step'`, `'false'`) is forwarded unchanged on each mode, and the class string does not vary with the value | AC-10 |
| T6 | A current chip with a consumer `Icon`: the wrapper is `aria-hidden` and the accessible name is the label only | AC-12 |

**RED to GREEN per acceptance criterion.**

| AC | RED test | Intended pre-implementation failure | GREEN evidence |
| --- | --- | --- | --- |
| AC-01 | T3 (toggle and static part); the existing recipe cases unmodified | **PRESERVE, no RED.** Green before and after | Focused run green; ChipGroup suite unmodified |
| AC-02 | T3 (link-set part); the existing v0.2 cases labelled AC-07 to AC-11 in `Chip.test.tsx`, unmodified | **PRESERVE, no RED** | Focused run green |
| AC-03 | T1 | Passes today, because `aria-current` is already forwarded: a **guard, no RED** that locks the attribute contract before the recipe changes | Green |
| AC-04 | T2 | The 19 utilities are absent | Green |
| AC-05 | E1 | The selectors are not emitted; the `aria-[current="true"]` rules are missing | Green; the packed CSS after `pnpm build` |
| AC-06 | E2 hover-order assertions | The current rules do not exist yet | Green; §9 hover |
| AC-07 | E2 compound-focus assertions and the failing-focus proof | The compound utility is absent | Green; §9 real Tab |
| AC-08 | E1 (media block) and E2 (order after `outline-none`) | The forced-colours utilities are absent | Green; §9 emulation |
| AC-09 | T4 | **The RED is `pnpm typecheck`, not Vitest:** before the narrowing `'step'` compiles, so every new `@ts-expect-error` row fails with TS2578 (unused directive) | `pnpm typecheck` green |
| AC-10 | T5; E1 selector strictness | T5 passes today (a guard); the strictness part fails until the selectors exist | Green |
| AC-11 | The docgen and Controls pins updated first | The own-declaration set and the count pin (`:1622`) mismatch | Same runner green |
| AC-12 | T6 | Passes today (a guard, no RED) | Green |
| AC-13 | The pins updated before the stories exist | The story-name list and the `aria-current` row mismatch | Green after the stories |
| AC-14 | `pnpm props:check` stale after the `types.ts` edit; the receipt test at `prop-naming.test.mjs:4180`; `pnpm artifact --check` stale | Stale revisions and a stale artifact | `props:docs`, `props:check`, `test:props`, `artifact --write` with `system:docs`, green |
| AC-15 | Not a test: `scripts/catalog_data.py` then `build_catalog.py`, changelog diff review | — | Diff shows the row and the entries |
| AC-16 | `package-exports` and `package-consumption` extended first | The selectors are missing from the built CSS; the typed samples do not yet narrow | Green after `pnpm build`; React 18 and 19 when the harness is authorized |
| AC-17 | Not a test. Visual conformity stays **Not evaluated** until captures are authorized and an expected design is adopted | — | Pending |

**E1 and E2 — emitted CSS** (`Chip.test.tsx`): the file already builds `packages/ui/src/styles/compiled.css` through Vite and `@tailwindcss/vite` with `optimize: false` for the accent test (`:228`). A memoized helper builds it once for the new tests and leaves the existing test body unedited. If the unoptimized output nests rules, the first RED to GREEN run exposes it and the slicing is adapted in the same file (the bounded-slice and `declarationAfter` patterns of `storybook-css.test.ts`). E1: every utility of the inventory with its declaration, `forced-colours` rules inside the media block, and strictness (the selectors match `page` and `true` only, never a bare `[aria-current]` or another value). E2: (i) the `aria-[current=…]` border and background rules follow the `hover:` rules; (ii) `focus-visible:shadow-focus` precedes `aria-[current=…]:shadow-[…]`, which precedes `aria-[current=…]:focus-visible:shadow-focus`, the same shape the toggle's existing check uses (`package-exports.test.mjs:4401-4405`); (iii) each `forced-colors:` outline rule follows the plain `outline-none` rule; (iv) the compound selector is strictly more specific than the edge-shadow rule. Each assertion runs for both tokens.

**Failing-focus proof (G6).** Show that E2 can fail: run its predicates once against a copy of the emitted CSS from which the compound rule is removed (a string edit inside the test process, or a scratch file in `mktemp -d`), and record the failure. Never commit a mutation and never leave scratch inside the repository; the writer names any scratch directory for the parent to remove.

**PRESERVE and differential.** The shared code is the `link` entry of `chipVariants`, which only link mode reads; the toggle and static entries, `chipVariants()` and ChipGroup are untouched. Evidence that previous behavior holds: the existing v0.2 cases (labelled AC-01 to AC-13 in `Chip.test.tsx`) unmodified, T3, the ChipGroup, DetailHeader, ProjectCard and NotesBoard suites unmodified, and one differential on a copy of the base commit in `mktemp -d` (not committed): static markup of `{toggle, static, link, link external} × {no icon, icon}` plus a ChipGroup, base copy against the change. Toggle, static and ChipGroup must be byte-identical, and a link chip must differ only by the 19 appended utilities in `class`. The built `styles.css` is compared the same way: the only added selectors must be the five new `aria-[current=true]` rules (§3), with no line removed or changed, provided Pagination and Carousel are in the tree as they are now. Any difference nobody asked for is a regression to fix and pin with a test.

**GREEN order.** `types.ts` → focused runner → stories → docgen and Controls pins → E1 and E2 → registry → artifact → catalog → changelogs. The hook, the component and `index.ts` stay untouched.

## 5. Registry, docgen, artifact, catalog and package obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

Append nothing and add no convention, exception or receipt. Refresh the `source.revision` of the seven Chip usages (`leading-icon`, `pressed-state`, `initial-uncontrolled-pressed`, `pressed-change`, `new-tab-navigation`, `new-tab-notice` and `render-mode`; all currently `sha256:8cdf8fe542702525be06a0b40c2f49b0ffc2b3f5f7f6161f829025b80690f4c8`) to the whole-file hash of the final `types.ts`. Hash only after `types.ts` is final and `pnpm lint` is clean on it; any later edit, even formatting, requires re-hashing. Then `pnpm props:docs` regenerates `docs/prop-naming.md` (never by hand), and `pnpm props:check` and `pnpm test:props` run. `scripts/prop-naming.test.mjs` is not edited: the Chip render-mode receipt test fails after the `types.ts` edit and before the refresh (`:4180`), which is the intended RED for this section, and the pinned prior-receipt bytes are untouched. No approval JSON is added: there is no new convention or exception, and a convention hash binds convention content, not usages.

### 5.2 Docgen and Controls pins

- `storybook-docgen.test.ts` (Chip block `:6323-6431`): the first test compares the non-`never` own declarations of `ChipLinkProps` and its siblings with `chipControls`, so the map gains `aria-current` with the directive observed on the first run (proposed: `false`). The reason pin (`:6374`, `/Non-serializable.*stor(?:y|ies)\.$/`) does not match the proposed reason, so it is widened to accept the new one. The extraction test (`:6389`) lists the exact rows: the first RED run records what docgen emits for the merged row. Two outcomes are acceptable: a row tagged `control: false` with its reason and no diagnostics, or no row because the first declaration's parent is in `node_modules`, with the own-declaration pins unchanged. A `select` row that lists booleans, a diagnostic or an injected argument is a G5 stop. The story-name pin (`:6426`) gains `LinkCurrent` and `LinkCurrentWithIcon` after `ExternalLink`.
- `storybook-controls.test.ts`: the control map (`:538`) gains the entry, `ownPropCounts.chip` goes from 10 to 11 (`:856`, asserted against the map length at `:1622`), and one test maps the row per the observed directive without injecting an argument and with zero diagnostics.
- The Chip default-value row (`:1685`) is unchanged: `aria-current` has no constant default.

### 5.3 System artifact

`pnpm artifact --write`, then `pnpm system:docs`. Expect Chip's entry to gain the `aria-current` prop only if the extraction emits it (type from the observed enum, optional, no default, description from the JSDoc) and the `chipVariants` recipe to gain the 19 utilities in its flattened class list. Any other entry changing is a G8 stop. The artifact is 643,153 bytes against the 768 KiB budget (`design-system-artifact.test.mjs:2324`), so confirm it still fits after regeneration. Add one assertion beside `:2009`: the `chipVariants` recipe contains `aria-[current=true]:border-state-selected` and `forced-colors:aria-[current=true]:outline-[color:Highlight]`, and the `aria-current` prop appears or not exactly as observed. The existing parity check (`:2595-2612`) passes after regeneration. Then `artifact --check`, `system:check`, `test:artifact` and `test:system` run green.

### 5.4 Catalog (and the stale "always-pressable" text)

`docs/CATALOGO.md:67` still says "always-pressable pill on Radix Toggle", a statement v0.2 already made false (the same note ends with "Chip is no longer always pressable"). The generated file is never edited by hand; the correction goes through `scripts/catalog_data.py:28`, replacing the whole note of the Chip row (the other columns are unchanged) with:

> Implemented in @egdev/ui under the approved v0.1 contract and its v0.2 and v0.3 amendments: one raised pill in three modes. `mode` toggle (default) is the pressable pill on Radix Toggle with controlled/uncontrolled pressed state and the sheen/edge raised recipe with red-tinted glow when on; static is a non-interactive span; link is a native anchor (with external new-tab semantics) painted as the current item when its native `aria-current` is `page` or `true` (v0.3, [#576](https://github.com/egdev6/egdev-design-system/issues/576)). An optional decorative leading icon in every mode. Public chipVariants (the toggle recipe by default) for ChipGroup (ToggleGroup.Item). No ref, asChild, size axis or stylesheet; the Avatar variant (D5) is deferred and legacy `.eg-chip` is unchanged. Contract: [#55](https://github.com/egdev6/egdev-design-system/issues/55).

Then one `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` run regenerates `docs/CATALOGO.md` and `docs/catalog.json`. The ChipGroup row (`:52`) and the NotesBoard row (`:118`) are untouched. The "always-pressable" correction does not depend on v0.3 and can ship alone (D7).

### 5.5 Package fixtures

`package-exports.test.mjs`: extend `Chip ships its exact token-backed pill…` (`:4376`) with the R1 selectors and declarations through `rule()` and `cssBlock`, and the order checks of E2 on the packed CSS; add one SSR assertion beside `:8814` for `createElement(exported.Chip, { mode: 'link', href: '#topics', 'aria-current': 'true', children: 'Topics' })` that checks the attribute and the R1 classes without pinning attribute order. `package-consumption.test.mjs`: a typed positive sample built from `Extract<ChipProps, { mode: 'link' }>` with `'aria-current': 'true'` in `ChipSamples` (`:3253`), two documented `@ts-expect-error` negatives (`'step'` and a boolean) beside the existing ones (`:3264-3275`), `assertChipCSS` (`:3893`) extended with the same selectors, and the SSR block extended. No ref, no React 19-only API, and React 18.3.1 and 19.3.0 run only through the existing packed harness without a Tailwind compiler.

## 6. Stories and Controls

`Atoms/Chip` keeps autodocs, `Meta<typeof Chip>`, no manual `argTypes` and no `play`; every new story is English, typed `Story` and uses only utilities the preview already scans (`Chip.stories.tsx` is in `.storybook/preview.css`).

- `LinkCurrent`: a `nav` named "Article filters" holding a `ul` of four link chips (`#all`, `#react`, `#css`, `#testing`) in a wrapping row, with `aria-current="true"` on the second. JSDoc: "The active filter carries the native `aria-current`; the paint follows the attribute alone. `page` paints identically, and the consumer keeps the attribute in sync with the route."
- `LinkCurrentWithIcon`: the same row with `aria-current="page"` on the current chip and a consumer `Icon` (`check`, `size-3.5`) on it. JSDoc: "A consumer-supplied check glyph is the cue that survives losing colour. The icon stays decorative and the label still names the link."
- Meta text: in the usage guidelines, replace "the consumer owns list semantics, `aria-current`, router interception" with "the consumer owns list semantics, which chip is current (`aria-current` `page` or `true`, painted on link chips only), router interception (via `onClick`) and the link destination".
- Controls: the `aria-current` row follows §5.2 and injects no argument; `Default` stays unchanged. Real browser Controls are checked in §9, not inferred from tags.
- The exported story order is `Default`, `WithIcon`, `Pressed`, `Controlled`, `Disabled`, `Static`, `Link`, `ExternalLink`, `LinkCurrent`, `LinkCurrentWithIcon`, `StaticInList`, `CustomAccent`.

## 7. Changelog entries

Entries go under the **existing, never-packed sections of the 0.11.0 release** (S2): at the top of the `### Added` list of `packages/ui/CHANGELOG.md` `## 0.11.0`, whose bullets run from the newest request to the oldest, at the top of its `### Changed` list, and at the top of the `### Added` list of `packages/system/CHANGELOG.md` `## 0.13.0` (not its older, already-released `## 0.11.0`). No `mcp`, `effects`, `cli` or `tokens` entry and no version move.

```md
<!-- packages/ui/CHANGELOG.md, ## 0.11.0, ### Added -->
- A link `Chip` whose native `aria-current` is `page` or `true` is painted as the current item, for example the active
  filter in a row of crawlable filters: the brand border, selected fill and brighter text of Pagination's current
  page, with the focus ring on top and a system-colour outline in forced colours. The attribute is the only state
  carrier: there is no new prop, no `data-state` and no built-in icon (pass `icon` for a check). Toggle and static
  chips, `chipVariants()` and `ChipGroup` are unchanged. (#576)
```

```md
<!-- packages/ui/CHANGELOG.md, ## 0.11.0, ### Changed -->
- In link mode `Chip` types `aria-current` as `'page' | 'true'` instead of the full native union, so `step`,
  `location`, `date`, `time`, `'false'` and booleans no longer compile on a link chip. Their runtime behaviour is
  unchanged: the attribute is still forwarded, but it is not painted. (#576)
```

```md
<!-- packages/system/CHANGELOG.md, ## 0.13.0, ### Added -->
- The artifact and design reference include Chip's link-mode `aria-current` prop (`page` | `true`) and the
  current-state utilities of its link recipe; existing props and recipes are unchanged. (#576)
```

`release:pack` counts only `(#N)` as resolved, and a fully resolved consumer request cites `(#N)` ([versioning](../../../distribution/versioning.md#changelog-format)). Issue #576 asks for exactly one thing, the active filter on link chips, and this change delivers it, so the entries cite `(#576)`. If the owner reads it as partial, write `Refs #576` instead (D6). The system entry's wording follows the observed artifact diff: it names the prop only if the extraction emits it (§5.3).

## 8. Checks to run

All commands are **future**, run from the repository root, one at a time in the foreground, and only with explicit authorization. None has been run for this plan. The first command is the identical RED and GREEN runner.

```sh
pnpm exec vitest run packages/ui/src/atoms/chip packages/ui/src/molecules/chip-group packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/molecules/pagination packages/ui/src/molecules/detail-header packages/ui/src/molecules/project-card packages/ui/src/organisms/notes-board --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/ui/src/molecules/chip-group packages/ui/src/molecules/pagination packages/tokens packages/ui/src/styles packages/ui/src/index.ts .storybook packages/ui/src/atoms/chip/useChip.ts packages/ui/src/atoms/chip/Chip.tsx packages/ui/src/atoms/chip/index.ts
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

The `git diff --stat` scope check must print nothing, and the final `git status --short` must list only §2 paths: no scratch, cache or `.playwright-mcp/` output. `pnpm build` may regenerate artifacts, so recheck `pnpm artifact --check` afterwards. `pnpm test:package-consumption` creates isolated fixtures and may install dependencies, so it needs specific permission and a verified offline cache; it must exercise React 18.3.1 and 19.3.0 with shipped tokens and UI CSS and no Tailwind compiler. Record any unavailable matrix as pending. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, `test:mcp`, the tokens test, `test:package-exports` and `test:package-consumption`; the artifact checks are not in CI and run here because `@egdev/system` ships. `pnpm test:cli` is not in the list above because the CLI is not touched.

## 9. Browser and capture procedure

Only after separate permission to start `pnpm storybook` (it builds tokens first) and to use Playwright MCP, following the [capture guide](../../../design/README.md). Record commit, browser and version, viewport, device scale, theme (dark Grafito), loaded fonts, motion and forced-colours settings, crop and date for every observation. Stories: `atoms-chip--link-current` and `atoms-chip--link-current-with-icon`, plus `--link`, `--default` and `--static` for preservation.

1. **AC-04 and AC-05 computed style.** The current chip computes the `--color-state-selected` border, the chip-active gradient over `surface-1`, the edge shadow and the default foreground; the chips at rest keep the hairline border, `shadow-edge` and the secondary foreground. `aria-current="page"` and `"true"` compute identically. A probe that sets `aria-current` to `step` and to `false` on a chip at rest through DevTools leaves its rest paint.
2. **AC-06 hover.** Use a Chrome launched with a fine pointer and hover capability (the Pagination evidence F7 records the flags that were needed). A hovered chip at rest takes the hairline-strong border and the `surface-2` fill; a hovered current chip keeps its own paint.
3. **AC-07 focus.** Real keyboard Tab onto the current chip: the computed `box-shadow` is the focus ring alone and the edge shadow returns on blur; focus on a chip at rest is unchanged from the base.
4. **AC-08 forced colours.** Chromium emulation of `forced-colors: active` (emulation only, not a real Windows contrast session): a focused link chip and the current chip compute a solid `--focus-width` outline in `Highlight`, an unfocused chip at rest computes none, and the focused current chip is indistinguishable from the unfocused one (the inherited limit, spec fact 3), which is recorded as an observation, not fixed.
5. **Contrast.** Compute from the computed colours the border against `surface-1` and `surface-0`, and the foreground against the fill, and record the numbers next to the Pagination estimates (spec §5). This is arithmetic on computed values, not a measurement tool.
6. **Accent.** On a probe host that sets the `createAccentTheme('#3b82f6')` variables, the current chip's border and fill follow the accent, as the toggle's `on` does.
7. **AC-13 Controls.** The `aria-current` row behaves as §5.2 records, with no injected argument.
8. **Captures VIS-02 to VIS-05**, only if authorized: component-zone PNGs under `docs/components/chip/v0.3/` named `<variant>--<state>--<viewport>--<theme>.png` (for example `link-current--rest--1280x900--dark.png`, `link-current-with-icon--rest--1280x900--dark.png`, `link-current--focus--1280x900--dark.png` and `link-current--forced-colors--1280x900--dark.png`), with `capture.json`, SHA-256 hashes and conditions. They are observed implementation, not approved expected design, until the owner adopts exact hashes. Playwright MCP writes under `.playwright-mcp/`; nothing from it is copied or committed except the requested captures. A GitHub-visible handoff is a separate authorization.

**Visual conformity: Not evaluated.** No capture of the current state exists, VIS-01 is a historical Foundation image of the base pill, and none of this plan's browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines in total)

Conventional Commits, English. The PR is squash-merged as the other Round 5 PRs are; the slices exist for review and bisect.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `feat(ui): paint the current state on link Chips (#576)` | `types.ts`, `Chip.test.tsx`, the docgen pins (without the story names), `storybook-controls.test.ts`, `prop-naming.json` and the regenerated `docs/prop-naming.md` | ≈ 224 |
| 2 | `feat(ui): add the link Chip current stories and packed-build checks (#576)` | `Chip.stories.tsx`, the two story names, `package-exports.test.mjs`, `package-consumption.test.mjs` | ≈ 94 |
| 3 | `chore(integration): refresh the Chip artifact, catalog row and changelogs (#576)` | `design-system.json`, `system.md`, `design-system-artifact.test.mjs`, `catalog_data.py` with the generated catalog, both changelogs | ≈ 43 |
| 4 | `docs(chip): record the v0.3 implementation evidence (#576)` | `implementation-evidence.md`, the ODD log, and `capture.json` with PNGs only if authorized | ≈ 46 |

Slice 1 keeps the registry revisions and the metadata pins with the type change, so `props:check`, `test:props` and the pins stay green per commit. `pnpm artifact --check` is stale between slices 1 and 3; if every commit must be artifact-fresh, fold slice 3 into slice 1 (≈ 267). A failing RED commit is never made.

## 11. Estimated changed lines

About **410 changed lines**: ≈ 380 hand-written (component ≈ 49: `types.ts` 12 and stories 37; tests and fixtures ≈ 241: `Chip.test.tsx` 162, docgen 8, Controls 16, package-exports 34 and package-consumption 21; registry JSON, catalog source, changelogs, artifact test, evidence and log ≈ 89) and ≈ 28 generated (`docs/prop-naming.md` ≈ 14, `design-system.json` 2, `system.md` ≈ 8, the catalog 4). The hook, the component and `index.ts` contribute none.

## 12. Risks

- **Risk 1 — Cascade.** Equal-specificity rules on the current chip can hide the focus ring or the forced-colours outline, and the hover rules can win over the current paint. The emission order, the compound selector and the failing-focus proof must be shown on the emitted build, not inferred from class order or `twMerge`.
- **Risk 2 — Metadata pipeline (G5).** The merged `aria-current` row spans the native unions of all three modes, so `select` is likely not representable and the proposed directive is `false`. How docgen, the Controls enhancer, the artifact parity check and the exact-row pins treat a union-merged native attribute is unknown until the first real run. If it needs a `.storybook/main.ts` change or an API change, that is an owner decision.
- **Risk 3 — Registry coupling.** Every `types.ts` edit invalidates seven registry revisions and the artifact, and the receipt test pins the live hash (`prop-naming.test.mjs:4180`). Hash last and re-hash after any formatting change.
- **Risk 4 — Parallel lanes.** The #577 ProjectCard v0.4 lane and earlier T6 lanes touch the same shared outputs: `prop-naming.json`, `docs/prop-naming.md`, `design-system.json`, `system.md`, `catalog_data.py` with its generated files, both changelogs, `package-exports.test.mjs`, `package-consumption.test.mjs`, `design-system-artifact.test.mjs` and the docgen and Controls pins. Expect rebase conflicts: regenerate generated files instead of hand-merging, re-hash Chip's `types.ts` revisions after rebasing, and re-verify the baseline hashes at the start.
- **Risk 5 — Forced colours.** Behavior is derived from the specification and from Pagination's evidence. Chromium emulation is not a real contrast session, a real Windows session stays pending, and focus on the current chip is indistinguishable from rest (the inherited limit).
- **Risk 6 — Type narrowing.** A compile-time break for any consumer that passes another `aria-current` token or a boolean to a link chip. No in-repository consumer does; the changelog records it under `### Changed`.
- **Risk 7 — Shared utilities.** Tailwind emits an identical utility once, so the `page` rules and the forced-colours focus rules in the built CSS cannot show that Chip's own scan emits them (Pagination emits them too). T2 pins the literals in Chip's `types.ts`, and `compiled.css` scans that file (`@source "../atoms/chip/types.ts"`); only five `true` rules are Chip-only.
- **Risk 8 — v0.2 metadata.** The v0.2 declared digest does not reproduce under the anchored rule (spec §1, fact 7). It is outside this change and this plan does not touch v0.2.
- **Risk 9 — Package harness.** `test:package-consumption` needs an offline cache and permission to install; without them the React 18 and 19 matrix stays pending, which blocks "verified in packed consumers" claims, not the rest.

## 13. Pending owner decisions

No Material recipe, token or dependency decision is pending beyond the spec: R1 is Pagination's already approved recipe applied to Chip link mode, and the approval of that application is the spec approval, not this plan.

1. **D1 — Plan approval (G1).** Approve this exact plan and the §2 edit surfaces, including the parent-owned integration files, or revise it. The spec approval does not cover it.
2. **D2 — Browser and capture authorization.** Starting `pnpm storybook` and using Playwright MCP are needed for AC-05 to AC-08, the contrast numbers and VIS-02 to VIS-05. Without them those rows stay Pending or **Not evaluated**. Adopting any capture as expected design is a separate decision.
3. **D3 — Confirm one literal reading.** `Highlight` (a CSS system-colour keyword, not a token) in the forced-colours utilities, by the Pagination, Carousel and ColorSwatchGroup precedent. The approved Pagination spec already lists it, so the plan treats it as covered; confirm that reading at G1.
4. **D4 — Metadata directive (G5).** `@control false` with a reason is proposed; the first real extraction decides it. Only an extraction that needs a `.storybook/main.ts` or API change becomes an owner decision.
5. **D5 — Release timing.** No version bump here: the entries ride the existing, unpacked 0.11.0 and 0.13.0 sections (S2), and no token or CLI change moves a coupled version.
6. **D6 — Issue citation.** The entries cite `(#576)`, which marks the issue fully resolved. If the owner reads the request as partial, write `Refs #576` instead.
7. **D7 — Catalog correction.** The "always-pressable" fix ships with this change in the same row edit. It does not depend on v0.3, so it can ship alone if the owner declines the amendment.
8. **D8 — Publishing the snapshot.** Publishing v0.3 as a comment on the canonical issue #55 is a separate GitHub authorization, not required before code.

Plan-level choices a reviewer can veto at G1: the doubled static `aria-[current=page]` and `aria-[current=true]` utilities instead of one `:is()` variant; E1 and E2 in `Chip.test.tsx` rather than `storybook-css.test.ts`; the `link` entry kept as one string literal; `useChip.ts` left without a runtime guard for out-of-union values; the story names and order.

## 14. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, artifact, catalog, capture, release or Git action is taken or implied. Stop and return to the owner on any G8 condition, a contradictory result, or a needed edit outside §2.
