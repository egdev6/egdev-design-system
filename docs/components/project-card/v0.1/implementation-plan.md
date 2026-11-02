# ProjectCard v0.1 — implementation plan

- **Status:** Proposed. Presented for separate owner approval; it authorizes no code, no registry write, no catalog regeneration and no Git action.
- **Contract authority:** [spec.md](spec.md) v0.1 and its byte-identical published snapshot [issue-comment.md](issue-comment.md) (issue body). `version: 0.1`; `contentSHA256: 9ffcf761634d14c0fc5d556584c0083fec601acde2c20aaf13b169e46aa6adf2` — reproduced byte-exact in this working tree with the spec's own rule (SHA-256 of the `## 1. Purpose and scope`-to-EOF payload; the local `spec.md` and `issue-comment.md` payloads are identical). Visual hash: VIS-01 `76b898745365c333865b8e206f4f14d99c5d54919b4b0115dcdf3b9489a1a781` (capture `project-card--variants--1280x1400--dark.png` in this folder, conditions in [capture.json](capture.json)).
- **Contract approval (and one deliberately excluded convention):** [issue #275 comment 6580403446](https://github.com/egdev6/egdev-design-system/issues/275#issuecomment-6580403446) (2026-11-02, recorded in `odd/tasks/web-catalog.md` L16), owner answer verbatim: `"Aprobar con las recomendaciones (Recomendado)"`. Every OQ (OQ-1…OQ-5) is resolved as recommended: featured keeps edge/halo/ink only (no `--gradient-hot` background); the outlined decorative index stays as one bounded non-utility property; `size="sm"` never hides content; no card-level hover movement; the isotype pixel artwork is deferred. The approval questionnaire did **not** offer the `decorative-index` naming convention as a separate item, so that convention stays an isolated, unresolved owner decision (G3) — it is not inferred from the OQ answers.
- **Plan identity:** `contentSHA256: add135b8c7d09dbd1a86e5f0aa832872fa80004ac369caa642a7083adf8ca7d7` — SHA-256 of the UTF-8, LF, final-newline payload from `## 1. Authority and gates` through EOF; the tracking metadata above this line is excluded, mirroring the contract's own rule.
- **Baseline:** branch `docs/web-catalog-layer-c-specs-2`, commit `fc6f977`. Current reviewed source bytes: `packages/ui/src/index.ts` `f85891be…`, `primitives/surface/types.ts` `26d0726b…`, `molecules/module-card/types.ts` `ed7adc13…` / `useModuleCard.ts` `4e279bad…`, `primitives/text/types.ts` `badce409…`, `atoms/badge/types.ts` `81d97cd4…`, `atoms/link/types.ts` `b5e5ba0b…`, `atoms/icon/types.ts` `673126c6…`, `atoms/chip/types.ts` `aac60553…` (box-border precedent), `molecules/panel/usePanel.ts` `94136856…`. All hashes re-verified in this working tree on 2026-11-02.

## 1. Authority and gates

1. **G1 — Plan approval.** The owner approves this exact plan payload and grants the implementation edit surface. Contract approval alone grants no code.
2. **G2 — Spec provenance (no blocker, no edits).** The local `spec.md` header still reads **Draft / Pending owner approval** although the contract was approved on #275 (L16). That header is historical snapshot metadata of the published snapshot; the approval comment plus the exact `contentSHA256` above is sufficient provenance. No frozen file is modified. The spec's two `../web-catalog/v0.1/…` relative links are broken (`../../web-catalog/…` required); they remain a reported documentation-only follow-up outside this task's edit surfaces, not an implementation blocker.
3. **G3 — `decorative-index` remains an isolated, unresolved owner decision.** The approved spec §3 proposes the convention (`name: index`, status `proposed`, `approval: null`), but the #275 approval questionnaire did not name it as a separate item, so no approval can be inferred from the OQ answers and none is invented. It is **not** an implementation blocker: the `index` prop is implemented as a component-local proposal, and the registry entry may be added only as `status: "proposed"`, `approval: null`, or held out of the registry entirely until the owner decides the convention separately. It must never be recorded as `approved` by this task.
4. **G4 — Visual reference status.** VIS-01 remains `Proposed` in the contract's table; the approval comment adopts the OQ recommendations and does not name the capture. The implementation is judged against the written recipe (§6 of the spec); browser observations are recorded as evidence and visual conformity is reported per criterion, never claimed as capture-adopted without an explicit owner statement.
5. **G5 — No token, dependency, Material or legacy change.** Every token the recipes use is verified to exist (`--shadow-hot`, `--gradient-sheen`, `--border-width`, `--color-border-brand`, `--color-fg-brand-default`, `--text-title-display`, `--text-heading-small`, `--text-body-large`, `--text-code`, `--text-label-eyebrow`). No `project-card.css` is created (**No stylesheet** per spec), no token value changes, no dependency is added, `packages/ui/src/styles/legacy/bundle.css` stays byte-identical (the web's `.eg-project-card` rules there are historical and out of scope).
6. **G6 — Parent-owned integration.** Registry JSON, `docs/prop-naming.md`, `scripts/catalog_data.py`, `docs/CATALOGO.md`/`docs/catalog.json`, `packages/ui/src/index.ts` and the package harnesses are parent-owned integration surfaces for the implementation task. This plan documents them; it performs nothing.
7. **G7 — Layer-(b) lessons are obligations.** (a) `box-border` on every non-button root/part that paints border or padding: the composed `surfaceVariants` base already carries `box-border` (verified in `surface/types.ts`), so surface-composed roots inherit it — a test still asserts it, mirroring `Chip.test.tsx:481-492`. (b) Real-browser layout verification against the captured expected design is mandatory before merge (§10).

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Responsibility |
| --- | --- | --- |
| `packages/ui/src/molecules/project-card/types.ts` | Writer | `ProjectCardVariant` (`'default' | 'featured'`), `ProjectCardSize` (`'md' | 'sm'`), `ProjectCardLevel`, `ProjectCardCodeLine`, CVA recipes (`projectCardVariants` with `variant`/`size`; `projectCardIndexVariants`, `projectCardEyebrowVariants`, `projectCardHeadingVariants`, `projectCardBodyVariants`, `projectCardTagsVariants`, `projectCardCodeVariants`, `projectCardCodeLineVariants`, `projectCardFootVariants`), and `ProjectCardProps`, `ProjectCardTagsProps`, `ProjectCardCodeProps`, `ProjectCardFooterProps` exactly per spec §3; `type` only, `ComponentPropsWithoutRef<'article'>` with the `ModuleCard` protected-prop `Omit` list, English JSDoc with `@control` on every own declaration |
| `packages/ui/src/molecules/project-card/useProjectCard.ts` | Writer | Title/index/eyebrow normalization (blank → warn + `valid: false`), rank fallback, protected-prop stripping, `useId()` heading id, per-part `cn()` composition, `data-variant`/`data-size` |
| `packages/ui/src/molecules/project-card/ProjectCard.tsx` | Writer | JSX only: root `article`, internal index/eyebrow spans, generated heading (`h{level}`), and the three exported parts `ProjectCardTags` (`ul`>`li`>`Chip mode="static"`), `ProjectCardCode` (`pre`), `ProjectCardFooter` (`div`) — parts in one file, `Panel`/`ModuleCard` precedent |
| `packages/ui/src/molecules/project-card/ProjectCard.test.tsx` | Writer | RED-first behavior tests for PC-01…PC-10 plus the box-border and no-hover assertions of §5 |
| `packages/ui/src/molecules/project-card/ProjectCard.stories.tsx` | Writer | `Molecules/ProjectCard`, English, autodocs: `Default`, `Variants`, `Sizes`, `HeadingRanks`, `Tags`, `Code`, `WithLink`, `LongContent` |
| `packages/ui/src/molecules/project-card/index.ts` | Writer | Named exports: `ProjectCard`, `ProjectCardTags`, `ProjectCardCode`, `ProjectCardFooter`, `export type * from './types'`, variant factories per contract §index pattern |
| `packages/ui/src/index.ts` | Parent (integration) | One line `export * from './molecules/project-card';` inserted alphabetically in the Molecules block (between `page-header` and `panel`) |
| `packages/ui/src/lib/storybook-docgen.test.ts` / `storybook-controls.test.ts` | Parent (integration) | ProjectCard extraction rows, controls map, zero owned diagnostics |
| `scripts/package-exports.test.mjs` / `package-consumption.test.mjs` | Parent (integration) | New public types in the exact sorted lists; SSR/consumer cases per §8 |
| `skills/_shared/prop-naming.json` + `docs/prop-naming.md` | Parent (integration) | Append ProjectCard usages to the applied entries; `decorative-index` only as `proposed`/`approval: null`, or omitted until the isolated owner decision (G3) |
| `scripts/catalog_data.py` + `docs/CATALOGO.md` / `docs/catalog.json` | Parent (integration, shared Unit C) | ProjectCard row note refresh (§9, composes unchanged); single regeneration run, no parallel writers |

**No stylesheet.** `packages/ui/src/styles/compiled.css` needs no edit: line 49 already carries `@source "../molecules/**/types.ts"`, and `.storybook/preview.css` lines 13/54 already carry `@source "../packages/ui/src/molecules/**/*.stories.tsx"`, so new molecule utilities and stories are scanned by the existing wildcards. No `@source` line may be invented.

Explicitly untouched: `docs/components/project-card/v0.1/**` (spec, issue-comment, capture frozen), `packages/tokens/**`, `packages/ui/src/styles/legacy/bundle.css`, every other component folder.

## 3. Typing approach and API fidelity

`ProjectCardProps = ProjectCardNativeProps & { title; level?; eyebrow?; index?; variant?; size?; children?; className? }` with `ProjectCardNativeProps = Omit<ComponentPropsWithoutRef<'article'>, 'title' | 'role' | 'tabIndex' | 'contentEditable' | 'dangerouslySetInnerHTML' | 'aria-label' | 'aria-labelledby' | 'aria-disabled' | 'aria-selected' | 'aria-pressed' | 'aria-live'>` — the exact `ModuleCard` protected list (`module-card/types.ts`), because the heading must own the article's name. No ref, no `asChild`, no `forwardRef`.

Part props: `ProjectCardTagsProps = { items: string[]; className?: string }` (`items` required); `ProjectCardCodeProps = { label: string; items: ProjectCardCodeLine[]; className?: string }`; `ProjectCardCodeLine = { text: string; kind?: 'command' | 'comment' }`; `ProjectCardFooterProps = { children: ReactNode; className?: string }` (contract documents exactly one supplied action; not type-enforced). Every own declaration carries English JSDoc with a supported `@control` (`text` for strings, `number` for `level`, `select` for `variant`/`size`/`kind`, `false` + `@controlReason` for `children`). `@default 3`, `@default default`, `@default md` as bare tag values bound to the CVA `defaultVariants`; `eyebrow`/`index` describe omission in the body without a fabricated `@default`.

## 4. Recipes and class composition

- **Root:** `cn(surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }), projectCardVariants({ variant, size }), className)`. `projectCardVariants` base adds `flex flex-col gap-4 min-w-0` plus `data-[variant=…]/data-[size=…]` hooks; `variant: { featured: 'border-border-brand shadow-[var(--shadow-hot)]', default: '' }` — edge + halo only, per approved OQ-1 (`--gradient-hot` is never applied). `size: { md: '', sm: 'gap-3 p-0' }` with the density step expressed through part variants (smaller heading/index steps), never by hiding content (approved OQ-3). `surfaceVariants` base already carries `box-border` (G7a); the test asserts it survives on the merged root.
- **Index:** internal `span aria-hidden="true"`; `projectCardIndexVariants` = `text-title-display tabular-nums leading-none text-transparent [-webkit-text-stroke:var(--border-width)_var(--color-border-brand)]` and featured `[-webkit-text-stroke:var(--border-width)_var(--color-fg-brand-default)]`. This implements the approved OQ-2 bounded exception exactly as the spec words it ("`-webkit-text-stroke` with `var(--border-width)` and a brand colour token"; featured adds "brand index ink") and matches the legacy web rule (`bundle.css:295-310`: default stroke `--color-border-brand`, featured stroke-color `--color-fg-brand-default`) — a static Tailwind arbitrary-property utility (statically scannable, token-valued, no inline style, no stylesheet), with `var(--border-width)` = 1px instead of the web's fixed 1.5px. No other non-utility property appears anywhere in the component.
- **Eyebrow:** internal `span` with `text-label-eyebrow` (the `SectionHeader.eyebrow` recipe), rendered only for a non-whitespace value.
- **Heading:** `text-heading-small text-fg-default` (+ `sm` step `text-body-large` density variant), element `h{rank}` with `id` from `useId()`.
- **Tags:** `ul` with `flex flex-wrap gap-1.5 list-none m-0 p-0`; each `li` renders `<Chip mode="static">{label}</Chip>` — the approved v0.2 static Chip (`atoms/chip/types.ts` `aac60553…`).
- **Code:** `pre` over `surfaceVariants({ tone: 'well', padding: 'sm', radius: 'md' })` + `overflow-x-auto` (wrap at word boundaries is the card promise; horizontal scroll stays inside the well only if a line cannot wrap — the plan accepts `overflow-x-auto` on the well, matching the web's mono well, and the LongContent story verifies no card-level scroll). Lines: `font-mono text-code`; `kind: 'command'` renders a leading `aria-hidden` prompt `span` with `$` in `text-fg-brand-raised`; `kind: 'comment'` renders `text-fg-muted` without the glyph. The `pre` carries `aria-label={label}` (passive text; no `code`/`kbd` API per spec §5).
- **Footer:** `div` `eg-project-card__foot flex items-center gap-3` (no `mt-auto` — spec fixes no pinning; the footer simply follows the body flow).
- **Composition rules:** per-part `cn()` with the part's own `className` merged last for local layout only; root `className` merged last for outer layout only. No `data-state`, no hover/transition utilities on the root (approved OQ-4: pointer over the card changes nothing).

## 5. Test-first sequence

New component; every behavior test is RED before its implementation. Public interface only (roles, names, class markers like `eg-project-card`); no full class strings.

| Step | RED test (`ProjectCard.test.tsx` unless noted) | Covers |
| --- | --- | --- |
| R0 | `storybook-docgen.test.ts` (ProjectCard section, parent surface): parse real `types.ts` with `react-docgen-typescript`; `mapJSDocControls` reports `diagnostics: []`; `variant`/`size`/`level` extract as finite enums; `items`/`label` requiredness correct | PC-10, early |
| R1 | `article` role; heading element is `h3` by default and `h2`…`h6` per `level`; `aria-labelledby` resolves to the heading id | PC-01 |
| R2 | Blank/whitespace `title` warns (`NODE_ENV`-gated) and renders nothing (no `article` in the container) | PC-02 |
| R3 | `index` renders `aria-hidden` text and is absent from the accessible name; `eyebrow` renders only when supplied; both omitted → no placeholder boxes | PC-03 |
| R4 | `variant="featured"` root contains `border-border-brand` and `shadow-[var(--shadow-hot)]` markers; `default` does not; anatomy identical in both (same part count) | PC-04 |
| R5 | `size="sm"` density classes present and a card **with** `ProjectCardCode` still renders the `pre` in `sm` | PC-05 |
| R6 | `ProjectCardTags` renders `list` > `listitem`, each with a static `Chip` (`role` generic, no `aria-pressed`, no tab stop); empty `items` renders an empty list | PC-06 |
| R7 | `ProjectCardCode` renders `pre` with accessible name `label`; command lines carry the `aria-hidden` glyph, comment lines are muted without it | PC-07 |
| R8 | Tab across a card with a footer `Link`: exactly one tab stop; the card body and code are unreachable | PC-08 |
| R9 | Long title + many tags + narrow host (`w-48` wrapper): text wraps; no `truncate`/`line-clamp` utility present; DOM order unchanged | PC-09 |
| R10 | Box-border and passivity: root class set contains `box-border`; root has no `cursor-pointer`, `transition-*` or `hover:` utility (approved OQ-4); mirrors `Chip.test.tsx:481-492` | G7a |

**PRESERVE (no shared code changes; expected green immediately).** This plan adds a new folder and one parent-owned export line; it modifies no existing parser, helper or recipe. Evidence of preservation instead of a differential run: existing suites (`packages/ui/src/lib/storybook-docgen.test.ts`, `storybook-controls.test.ts`, `scripts/package-exports.test.mjs`, `package-consumption.test.mjs`) must pass unchanged except their new ProjectCard additions, and `ModuleCard`/`Panel`/`ListItem` focused suites must stay green — they share the `surfaceVariants` recipes this component composes but not its code.

GREEN order: `types.ts` → `useProjectCard.ts` → `ProjectCard.tsx` → `index.ts` → stories → parent integration.

## 6. Stories and Controls

`Molecules/ProjectCard`, autodocs, `Meta<typeof ProjectCard>` / `satisfies`, no manual `argTypes`, no `play`. Stories: `Default` (title + body copy + footer `Link`), `Variants` (featured + default side by side, mirroring VIS-01's top row), `Sizes` (md + sm), `HeadingRanks`, `Tags`, `Code` (command + comment lines), `WithLink`, `LongContent`. Footer action examples use `Link href="#…"` with `variant="underlined"`. `Default` supplies example args only; it must not override documented defaults.

## 7. Registry integration

Applied approved entries (already `approved` in `skills/_shared/prop-naming.json`): `title` → `heading-title`; `level` → `heading-level`; `eyebrow` → `heading-eyebrow`; `variant` → `visual-treatment`; `size` → `preset-dimensions`; `items` → `collection-items`; `ProjectCardCode.label` → `accessible-name`. Isolated unresolved decision (G3): `decorative-index` (`name: index`) — not offered in the #275 approval questionnaire, so it is implemented as a component-local proposal and enters the registry only as `proposed`/`approval: null` or not at all, pending a separate owner decision. At implementation time the parent appends each applied usage with `source: { path, symbol, revision: sha256:<whole-file hash of the new types.ts> }`, regenerates `docs/prop-naming.md` via `pnpm props:docs`, and runs `pnpm props:check` + `pnpm test:props`. `--write` never refreshes evidence or approval. No exception is requested.

## 8. Package exports and consumption

- `scripts/package-exports.test.mjs`: add `ProjectCard`, `ProjectCardTags`, `ProjectCardCode`, `ProjectCardFooter`, `projectCardVariants` (if exported for composition) and the prop types to the exact sorted runtime/type lists; SSR smoke renders one card and asserts the `article` + heading + one tab stop.
- `scripts/package-consumption.test.mjs`: type-level import of `ProjectCardProps`/`ProjectCardCodeLine`; positive cases (full card, `sm` with code, featured); negatives only where the protected-prop `Omit` makes them compile errors (`role`/`aria-label` on the root), each as a documented `@ts-expect-error`. React 18.3.1/19.3.0 packed-consumer compile runs where the existing harness runs them; the card adds no ref and no React-19-only API, so no new compatibility claim is made.

## 9. Catalog row update (shared parent-only Unit C)

All six layer-(c) rows are refreshed by **one shared parent-only integration unit (Unit C)** — a single writer edits `scripts/catalog_data.py`, then runs `python3 scripts/build_catalog.py` once so `docs/CATALOGO.md` and `docs/catalog.json` regenerate together; no parallel writers touch the shared file. Generated files are never hand-edited. For this component, Unit C refreshes line 78 to the implemented pattern with the composes column **unchanged** (`Surface, Badge, Link` — no correction was approved for this row): note → "Implemented React molecule under [approved v0.1 contract](https://github.com/egdev6/egdev-design-system/issues/275): passive article named by its generated h2–h6; optional `aria-hidden` decorative index, eyebrow, free body flow, static-Chip tag list, labelled mono code well and one supplied footer action. Featured = brand edge + `--shadow-hot` halo + brand index ink; `sm` density never hides content. No stylesheet, ref, asChild or hover motion."

## 10. Browser checks to run before merge

Against `pnpm storybook` with the real compiled tokens, after GREEN; observations recorded, never replacing tests:

1. Controls rows render per the central enhancer with zero `Component.prop` diagnostics across all ProjectCard stories.
2. **Real-browser layout verification against VIS-01:** load `Variants`/`Sizes` and compare structure against the captured board (index → eyebrow → heading → copy → chips → code → link order; two densities; featured edge/halo/ink). Differences are recorded per criterion and limited to the spec's allowed list (solid `surface-1` frame instead of glass, token type steps, `Badge`/`Chip` recipes, `Link underlined`, no isotype artwork, no hover lift). Visual conformity is reported per criterion; the capture is never overwritten.
3. **Box-border / layout shift check (layer-b lesson):** in the packed consumer fixture and in Storybook, a card with explicit consumer width shows border *inside* the width (root `box-border`), padding/heading steps shrink in `sm` without hiding the code block, and featured adds no layout shift versus `default`.
4. Reduced motion and 200% zoom: no transform/animation on the card; long content wraps with no horizontal scroll at card level.
5. Keyboard: exactly one tab stop (footer link) with the token focus ring.

Full gates before merge, parent-scheduled with observed output: `pnpm typecheck`, `pnpm lint`, focused first (`pnpm exec vitest run packages/ui/src/molecules/project-card packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts`), then `pnpm test`, `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm props:check`, `pnpm test:props`.

## 11. Bounded work units

1. **Unit A (writer):** the six `packages/ui/src/molecules/project-card/` files; focused tests green.
2. **Unit B (parent integration):** `packages/ui/src/index.ts` line, docgen/controls test sections, package-exports/consumption additions, registry usage append (+ `decorative-index` as `proposed` per G3, if the owner wants it recorded before deciding), props docs/check.
3. **Unit C (shared parent-only catalog integration, all six components):** exact row refreshes per each plan's §9, one `build_catalog.py` run.

## 12. Risks

- **R-1 — Index stroke utility.** The arbitrary-property class must survive Tailwind's static scan through the molecules `@source` wildcard; the `package-exports` CSS-block assertion added for this component verifies the emitted rule. If the arbitrary-property form fails to emit, the honest fallback is a spec-level question (a one-property `project-card.css` role), never an inline style.
- **R-2 — VIS-01 shows states v0.1 omits** (hover glow on the third compact card, isotype pixels). They document omitted optional states (OQ-4/OQ-5) and must not be implemented.
- **R-3 — Spec provenance** (G2): historical snapshot metadata; the frozen digest and approval comment are the binding provenance; broken relative links remain a reported follow-up.
- **R-4 — `sm` density is a plan-level step choice** (spec fixes the promise, not the exact utilities); recorded here so review can compare against VIS-01's bottom row.

## 13. Stop

This plan authorizes nothing until G1. The `decorative-index` convention stays an isolated owner decision (G3) — approving this plan does not approve that convention. No source, test, token, dependency, registry, catalog or Git action is taken or implied.
