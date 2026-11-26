# StepMeter v0.1 and NowCard v0.3 — implementation plan

- **Status:** Proposed for separate owner approval; never approved by this document. It authorizes no code, test, registry, generated-file, catalog, token, dependency, release, Git or GitHub action. Approving the specs granted none of them (ODD S5).
- **Coverage:** ODD S1 (#556) at the plan gate of S5, for the #556 lane of T6: the new `StepMeter` atom and the NowCard v0.3 documentation amendment, planned together in this folder (NowCard v0.3 has its own approval record and no plan file). One PR for #556, referencing the issue with `Refs #556`, never `Closes` ([consumer requests §3](../../../distribution/consumer-requests.md)). The branch is the parent's choice; the writer never switches branches or commits.
- **Contract authority:** both specs were approved on 2026-11-25 with the recommended answers (owner answer verbatim, given on the committed drafts `68ea3a4`: "Aprobar con recomendaciones (Recomendado)", `odd/tasks/pulso-consumer-requests.md` L5; cataloging approval L3):
  - [StepMeter v0.1](spec.md), `contentSHA256: 1da0f307a65e2ade2f750ab6dd6cd1d6702096c08227fa591eecfa63df0de368`, record [approval.md](approval.md).
  - [NowCard v0.3](../../now-card/v0.3/spec.md), `contentSHA256: 2ed402f029d3494334f600d8c037615664b63c6b48df00f9c662d66feba19253`, record [approval.md](../../now-card/v0.3/approval.md).

  Both digests were reproduced byte-exact in this working tree with each spec's own rule (`awk '/^## 1\. Purpose and scope$/{f=1} f' spec.md | sha256sum`, the line-start heading, not the inline mention in the header). Recover and compare them again before any edit; a different digest stops the work. Resolved decisions this plan carries: StepMeter name final; `role="img"` with a required consumer `label`; `steps` default 4, integer 1–10, invalid falls back to 4, `value` floored and clamped; size ×0.8 by token units with the static clip-path literal `w-3.5 h-3.75` plus `[clip-path:polygon(0_0,100%_47.6%,100%_100%,0_52.4%)]`; reference paint kept and WCAG 1.4.11 not claimed for the empty remainder; forced colors paint filled `CanvasText` and leave empty steps unpainted; flat token-paint Material recipe; `step-count` / `steps` approved as a convention decision recorded separately (receipt pending, D2); with a StepMeter in a NowCard footer, at most one other child.
- **Plan identity:** the parent hashes the entire final plan file and records the owner's separate approval with that whole-file hash, as in the [NowCard](../../now-card/v0.1/implementation-plan.md) and [LabStage](../../lab-stage/v0.1/implementation-plan.md) plans. No self-hash is embedded; any later edit needs a new hash and approval.
- **Baseline:** branch `feat/pulso-consumer-requests`, HEAD `68ea3a4`; at inspection no tracked file under `packages/`, `scripts/`, `skills/` or `.storybook/` was modified (only Pulso specs, approval records and plans, and the ODD task file). Reviewed whole-file SHA-256 prefixes: `packages/ui/src/index.ts` `38acd459…`, `styles/compiled.css` `ca31735e…`, `.storybook/main.ts` `49ff3d16…`, `.storybook/preview.css` `536f074f…`, `atoms/pixel/types.ts` `82826efb…` (precedent), `molecules/now-card/types.ts` `d768d4f6…` (equal to the `revision` of its four registered usages), `useNowCard.ts` `cf91bc3a…`, `NowCard.tsx` `efb5f971…`, `NowCard.test.tsx` `f72e3f1f…` (18 `it` declarations), `NowCard.stories.tsx` `f510da22…` (9 stories), `skills/_shared/prop-naming.json` `df775089…` (184 entries), `scripts/prop-naming.test.mjs` `f0d5ada0…`, `storybook-docgen.test.ts` `de806ab2…`, `storybook-controls.test.ts` `a5d6ae20…`, `scripts/package-exports.test.mjs` `8069f121…`, `package-consumption.test.mjs` `279b2c66…`, `design-system-artifact.test.mjs` `e8343c23…`, `scripts/catalog_data.py` `281caebe…` (118 rows). `packages/system/design-system.json` is 605,026 bytes against the 768 KiB (786,432) budget; `system.md` is 496,915 bytes. Preparation was read-only inspection and digest checks; no test, build, generator, browser or server ran. Everything below is planned, not observed.
- **Visuals:** VIS-01 is Pending in both specs: no capture, no hash. This plan produces behavior and computed-style evidence only; visual conformity stays **Not evaluated**.

## 1. Gates, decisions requested and unchanged boundaries

1. **G1 — Plan approval.** Approve this exact payload, the paths in §2 and the commands in §8. Nothing else grants an edit surface.
2. **G2 — No pending token, dependency, Radix, stylesheet or Material decision.** Every utility is token-backed and verified present (`--color-fg-brand-default`, `--color-alpha-red-22`, `--spacing: var(--space-1)`); the clip-path literal, the forced-colors paint and the flat Material recipe are spec-approved (OQ-4, OQ-6, OQ-7). **No stylesheet** and no extra internal module. If emission, computed geometry or the forced-colors cascade disagree with the spec's arithmetic, stop and return the measurements: another literal, an `!important`, a stylesheet or an inline style needs a new approval, never an improvisation.
3. **G3 — Registry.** `label` reuses approved `accessible-name`, `value` reuses approved `primary-value`, `steps` registers the new `step-count`. The new entry is `proposed` with `approval: null` unless D2 is granted; both paths are valid and green.
4. **G4 — Behavior of NowCard.** v0.3 is documentation only: `useNowCard.ts`, `NowCard.tsx` and `index.ts` stay byte-identical, NowCard never imports StepMeter, and every existing case passes untouched.
5. **G5 — Parent-owned integration.** The registry JSON and generated view, generated artifact, `system.md`, catalog, barrel, `compiled.css`, `.storybook/*` entries, package harnesses and the docgen and Controls pins are parent-owned; this plan only documents them.
6. **G6 — Release and publication stay outside this plan.** Changelog entries go under `## Unreleased`; no `version` edit, `release:pack`, tag, issue comment or snapshot publication.
7. **G7 — Stop lines** are listed in §12.

**Decisions requested with this plan**

- **D1 — Plan, surfaces and commands (G1).** Required.
- **D2 — `step-count` convention receipt (recommended: approve the exact entry in §6a).** The spec gives the meaning and the avoid text but not `whenToUse`, which this plan proposes; the owner's OQ-8 answer was given without that wording, so it is not a receipt. If D2 is granted, the parent records `docs/components/step-meter/v0.1/prop-naming-approval.json` (Text v0.3 precedent) and the entry becomes `approved`; the receipt binds the `approved` form because `conventionHash` includes `status`. If declined or unanswered the entry ships `proposed` with `approval: null`, which five other entries already do.
- **D3 — Browser observations (recommended: yes).** SM-01, SM-07 to SM-10, SM-11's widgets and NC3-03, NC3-04 and NC3-08 need a local server, a real Chromium and scratch builds, each with separate permission. Without them those criteria stay **Not observed**.
- **D4 — Packed consumers (recommended: yes).** `pnpm test:package-consumption` packs and installs isolated fixtures and needs install and network permission and a known cache; without it SM-12's React 18.3.1 and 19.3.0 evidence stays **Not observed** (offline alternative: `EGDEV_CONSUMER_OFFLINE=1`).
- **D5 — Harness location (recommended: scratch only).** Browser probes live in a `mktemp -d` directory and their output is copied into `implementation-evidence.md`, as the Pixel `browser-check.md` did; a committed `browser-evidence.mjs` (Dialog v0.4 precedent) is the alternative.
- **D6 — Release timing (recommended: none in this PR).** `(#556)` reaches `release.json` `resolves` only after a maintainer moves the entry into a versioned section ([versioning](../../../distribution/versioning.md)).
- **D7 — Captures (VIS-01).** Separate authorization and read-only source access; outside this plan.

## 2. Exact files to touch (not authorized until G1)

| Path | Owner | Change | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/atoms/step-meter/types.ts` | Writer | `StepMeterProps`, the protected `Omit` list, English JSDoc with `@control text`, `number`, `number` and `@default 4` on `steps`; two static CVA recipes (§3) | +75 |
| `packages/ui/src/atoms/step-meter/useStepMeter.ts` | Writer | Label and value validation with the two exact warnings, `steps` fallback, floor and clamp, protected-attribute and handler stripping, step list with `data-state`, per-part `cn()` | +85 |
| `packages/ui/src/atoms/step-meter/StepMeter.tsx` | Writer | JSX only: null when invalid, root `span`, one empty `span` per step | +20 |
| `packages/ui/src/atoms/step-meter/StepMeter.test.tsx` | Writer | Cases for SM-01 to SM-07 (unit part), SM-10 (unit part) and the SM-12 SSR comparison | +300 |
| `packages/ui/src/atoms/step-meter/StepMeter.stories.tsx` | Writer | `Atoms/StepMeter`: `Default`, `Levels`, `CustomSteps`, `OnSurfaces` (§5) | +95 |
| `packages/ui/src/atoms/step-meter/index.ts` | Writer | `export { StepMeter } from './StepMeter'; export type { StepMeterProps } from './types';` and no variants export (Pixel precedent) | +2 |
| `packages/ui/src/molecules/now-card/types.ts` | Writer | JSDoc only: the `NowCardFooterProps` comment and its `children` description state the v0.3 rule, the `@controlReason` names `WithStepMeter`; no type, recipe or code change | +7 −4 |
| `packages/ui/src/molecules/now-card/NowCard.test.tsx` | Writer | New cases for NC3-01, NC3-02, NC3-06 and NC3-07; the only edited existing line is the import block | +90 −1 |
| `packages/ui/src/molecules/now-card/NowCard.stories.tsx` | Writer | `WithStepMeter` after `WithNextDate`, plus one import; meta and existing stories untouched | +50 −1 |
| `packages/ui/src/index.ts` | Parent | `export * from './atoms/step-meter';` between `./atoms/status-dot` and `./atoms/switch` (baseline lines 37–38) | +1 |
| `packages/ui/src/styles/compiled.css` | Parent | `@source "../atoms/step-meter/types.ts";` after the status-dot line (baseline 35); atoms are listed one by one, so without it the package ships no StepMeter-only utility | +1 |
| `.storybook/main.ts` | Parent | `documentedNativeProps.stepMeter`: `['id', 'dir', 'lang', 'aria-describedby', 'className', 'style']`, Pixel's list (`c0e3cbe`) minus the protected `title` (baseline `statusDot` at 148) | +1 |
| `.storybook/preview.css` | Parent | `@source "../packages/ui/src/atoms/step-meter/StepMeter.stories.tsx";` after the status-dot story line (baseline 46); Storybook-only, proves nothing for the package | +1 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | StepMeter extraction test after the Pixel one (baseline 662); `'./atoms/step-meter'` in the barrel module list (2003–2004); `'StepMeter'` in the runtime names (2207–2208); NowCard section (1261): `'WithStepMeter'` in the story pin (1367) and footer JSDoc assertions | +75 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | `['StepMeter', 'atoms/step-meter']` (list ends at 135); `stepmeter: { label: 'text', value: 'number', steps: 'number' }` (291); `stepmeter: 3` (753); `['StepMeter', { steps: '4' }]` (1621) | +5 |
| `scripts/package-exports.test.mjs` | Parent | `'StepMeter'` in the runtime names (5920) and `'StepMeter'`, `'StepMeterProps'` in both sorted type lists (6471, 6838); built-CSS emission test and SSR test modeled on Pixel's (786, 829); legacy non-collision | +95 |
| `scripts/package-consumption.test.mjs` | Parent | Packed fixtures modeled on Pixel's (95, 538–565): positive sample, `@ts-expect-error` negatives, CSS assertion modeled on `assertPixelConsumerCSS` (5199, invoked at 5678), runtime assertion near 6227 | +70 |
| `skills/_shared/prop-naming.json` | Parent | `step-count` entry; StepMeter usages on `accessible-name` and `primary-value`; refresh the four NowCard usage revisions (§6b) | +45 −4 |
| `scripts/prop-naming.test.mjs` | Parent | `'step-count'` in `postReceiptProposals` (848); two StepMeter entries in `postReceiptUsages` (59); `actual.length` 184 to 185 (2250); one new StepMeter test | +55 −1 |
| `docs/prop-naming.md` | Parent | Regenerated with `pnpm props:docs`, never hand-edited | generated |
| `docs/components/step-meter/v0.1/prop-naming-approval.json` | Parent | Only if D2 is granted | +45 |
| `scripts/design-system-artifact.test.mjs` | Parent | Focused assertions: StepMeter props, default, recipes, no `classNameAllows`, `step-count` entry, refreshed NowCard footer description | +40 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent | Regenerated (§6e) | generated |
| `scripts/catalog_data.py` | Parent | One new StepMeter row after Pixel (baseline 37) and a NowCard row note refresh (80), §6f | +2 −1 |
| `docs/CATALOGO.md`, `docs/catalog.json` | Parent | Regenerated with `python3 scripts/build_catalog.py`, never hand-edited | generated |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | New `## Unreleased` sections (§7) | +14 |
| `docs/components/step-meter/v0.1/implementation-evidence.md` | Parent | New: observed RED and GREEN output, commands with exit codes, browser results, limits | +100 |

No change expected: `useNowCard.ts`, `NowCard.tsx`, `molecules/now-card/index.ts`, `packages/ui/src/organisms/now-strip/**` (run, not edited), `atoms/pixel/**` (never imported), `packages/ui/src/styles/legacy/bundle.css` (byte-identical; its `.eg-now-card__meter` rules stay), `packages/tokens/**`, every `package.json`, the lockfile, `packages/mcp/**`, `packages/cli/**`, `packages/effects/**`, the frozen v0.1 and v0.2 NowCard documents, both specs and approvals of this version, `odd/**` (parent) and the files of the other three Pulso lanes.

Work units: **A** (Writer) the six StepMeter files, sequential slices C1 and C2; **B** (Writer) the three NowCard files (C5), which only needs the StepMeter module and may run in parallel with C3 and C4; **C** (Parent) integration C3, registry C4, evidence and changelog C6. Registry revisions always follow the final bytes of the file they hash, so those steps stay sequential.

## 3. Implementation shape

Indicative only: the writer's code and JSDoc are reviewed against the approved spec, not against this excerpt. Biome style: single quotes, 120 columns, no trailing commas, `type` never `interface`, no `any`.

```ts
// types.ts — every own prop carries English JSDoc with one @control; label is the only source of the name
type SpanProps = ComponentPropsWithoutRef<'span'>;
type EventProp = Extract<keyof SpanProps, `on${string}`>;

export type StepMeterProps = Omit<
  SpanProps,
  | EventProp | 'children' | 'dangerouslySetInnerHTML' | 'role' | 'aria-label' | 'aria-labelledby' | 'aria-hidden'
  | 'aria-live' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuenow' | 'aria-valuetext' | 'data-state'
  | 'title' | 'tabIndex' | 'contentEditable'
> & {
  /** Accessible name of the image, never rendered visibly. @control text */ label: string;
  /** Number of filled steps, counted from the inline start. @control number */ value: number;
  /** Total number of steps, an integer from 1 to 10. @default 4 @control number */ steps?: number;
};

export const stepMeterVariants = cva('eg-step-meter inline-flex flex-none items-center gap-1');
export const stepMeterStepVariants = cva([
  'eg-step-meter__step inline-block flex-none w-3.5 h-3.75 [clip-path:polygon(0_0,100%_47.6%,100%_100%,0_52.4%)]',
  'bg-alpha-red-22 data-[state=filled]:bg-fg-brand-default transition-none',
  'forced-colors:forced-color-adjust-none forced-colors:data-[state=filled]:bg-[color:CanvasText]',
  'forced-colors:data-[state=empty]:bg-transparent'
]);
```

```ts
// useStepMeter.ts — same development-only guard as useNowCard.ts; steps carry no className of their own
const named = typeof label === 'string' && label.trim().length > 0;
const measured = typeof value === 'number' && Number.isFinite(value);
if ((typeof process === 'undefined' || process.env.NODE_ENV !== 'production') && !named) {
  console.warn('StepMeter requires a non-empty label. Nothing was rendered.');
}
// ...the finite-value warning is symmetric: 'StepMeter requires a finite numeric value. Nothing was rendered.'
const total = typeof steps === 'number' && Number.isInteger(steps) && steps >= 1 && steps <= 10 ? steps : 4; // silent
const filled = measured ? Math.min(Math.max(Math.floor(value), 0), total) : 0;
// rootProps: passthrough (forbidden keys and /^on/i dropped), role: 'img', 'aria-label': label, className: cn(stepMeterVariants(), className)
// steps: Array.from({ length: total }, (_, position) => ({ position, 'data-state': position < filled ? 'filled' : 'empty', className: stepMeterStepVariants() }))
```

```tsx
// StepMeter.tsx — JSX only; the key is the stable step position produced by the hook, not a map index
if (!valid) return null;
return <span {...rootProps}>{steps.map(({ position, ...step }) => <span key={position} {...step} />)}</span>;
```

No state, ref, `asChild`, id, Surface, Pixel import, SVG, icon, text node or inline style. Neither CVA recipe is exported from `index.ts`. The warnings, floor, clamp and fallback rules are exactly the spec's §3 and §4 tables; the hook is the only place that decides them.

**NowCard (JSDoc only, spec §1 delta 4)**

```ts
/**
 * Lower band for one supporting detail and/or one action (a Link or a labelled IconButton), never two competing
 * actions, and optionally one StepMeter. With a StepMeter the footer holds it plus at most one other child; that
 * rule is the consumer's, as the card never inspects, reorders or limits its children.
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size
 */
// children: "... and optionally one StepMeter (an informative named image with its own label); with a StepMeter,
//   at most one other child. Omit the part entirely when the card has no footer."
// @controlReason ReactNode is not serializable; see WithLink, WithNextDate, WithStepMeter and WithSingleChild.
```

The `@classNameAllows` tag and every `@control` stay as they are. `WithStepMeter` renders a `grid gap-4` of cards: `md` with `Link` plus meter at 3 of 4 ("High progress"), `IconButton` plus meter at 1 of 4, `NowCardDetail` plus meter at 4 of 4, and `sm` with `Link` plus meter at 3 of 4 and at 1 of 4 (the spec's principal and additional scenarios); its JSDoc states the "at most one other child" rule as the consumer's.

## 4. Test-first sequence

Public interface only; roles and names, no `data-testid`, no full class strings. Pre-commit runs Biome and `pnpm typecheck`, so a failing-test commit is impossible: RED is observed locally and recorded in the evidence file. A new component has no jsdom RED before its files exist, and a stub would be a dummy file, so R1 fails at import and each later row fails on an assertion after the previous minimal GREEN. Rows marked **guard** pass on their first run and claim no RED. The browser rows have no jsdom-expressible failure: their probes are written first, fail against the baseline build, and their computed values become the evidence.

| Step | RED test (file → case) | Covers | Expected RED before the change |
| --- | --- | --- | --- |
| R0 | No edit: the 18 NowCard declarations, NowStrip, docgen, controls, css, `props:check`, `test:props`, `artifact --check`, `system:check`, `test:artifact`, `test:system` | PRESERVE baseline | All green; record counts |
| R1 | `StepMeter.test.tsx`: `getByRole('img', { name: 'High progress' })`, `SPAN` with `eg-step-meter`, steps without text, role or tab stop, no focusable descendant, `renderHook(useStepMeter)` result shape | SM-01 | Whole file fails at import (`./StepMeter`, `./useStepMeter`, `./types` unresolved) |
| R2 | `it.each` value 0 to 4 on default `steps`: leading `filled`, rest `empty`, DOM order; `steps` 1, 2, 6, 10 render that many | SM-02 | After R1's minimal GREEN (name, marker, a fixed empty list): every `data-state` is `empty` and the step count ignores `steps` |
| R3 | Table: value 9, −1, 2.9, 0.9, −0.5 floored and clamped; `steps` 0, −1, 11, 2.5, NaN, Infinity, `'4'` (untyped) fall back to four steps; `console.warn` never called for `steps` | SM-03 | Counts overstated or zero steps rendered until floor, clamp and fallback exist |
| R4 | Blank, whitespace, non-string `label`; NaN, ±Infinity, string `value`: exact warning text, empty container, valid rerender renders (NowCard NC-02 pattern, `console.warn` spy) | SM-04 | An unnamed image renders and no warning is emitted |
| R5 | Untyped injection of `children`, `dangerouslySetInnerHTML`, `role`, every `aria-*` protected key, `data-state`, `title`, `tabIndex`, `contentEditable`, `onClick`, `onKeyDown`; `id`, `data-*`, `aria-describedby` pass; `userEvent.tab()` skips the meter; SSR markup carries no injected text; `expectTypeOf` excludes the protected keys | SM-05 | `title`, `tabindex`, handlers and children reach the DOM until the hook strips them |
| R6 | `className` merges last on the root, the marker survives, steps receive none | SM-06 | **Guard** (the hook composes through `cn()` from R1) |
| R7 | `toHaveClass` on the invariants of spec §6 (root and step utilities, both forced-colors utilities); absent `transition-`, `animate-`, `shadow`, `filter`, `transform` utilities and `is-on`; no `style` attribute | SM-07 and SM-10 (unit parts) | **Guard** for utilities present since `types.ts`; RED only for any not yet present |
| R8 | `renderToStaticMarkup(<StepMeter />)` equals the client container markup | SM-12 (SSR) | **Guard** (no ids, no effects) |
| R9 | Docgen and Controls pins edited first: StepMeter extraction test, module list, runtime names, story pin (`Default`, `Levels`, `CustomSteps`, `OnSurfaces`), `stepmeter` expected map, count 3, default `steps: '4'` | SM-11 | Barrel lists differ from the real barrel; native-prop assertions fail until `documentedNativeProps.stepMeter` exists; Controls fail until the stories exist |
| R10 | `package-exports.test.mjs` after `pnpm build` of the baseline: built CSS must contain `.h-3\.75`, the clip-path declaration, `.bg-alpha-red-22`, the `data-[state=filled]` and both forced-colors rules and no `.eg-step-meter {` rule; package SSR renders the spans; export lists | SM-07 (built CSS), SM-12 | `StepMeter` undefined in the package; StepMeter-only utilities absent until the `@source` line exists |
| R11 | `package-consumption.test.mjs`: packed positive sample, `@ts-expect-error` negatives (`role`, `aria-label`, `children`, `title`, `tabIndex`, `onClick`, string `value`), consumer CSS assertion | SM-12 (packed) | Fails against the baseline packed build; needs D4 |
| R12 | Scratch browser probes (§9): computed geometry and paint, contrast on surfaces 0 to 3, forced colors, reduced motion, accessibility tree | SM-01, SM-07 to SM-10 | Probe cannot find `Atoms/StepMeter` on the baseline build; needs D3 |
| R13 | `prop-naming.test.mjs` first: counter 185, `postReceiptProposals`, `postReceiptUsages`, the new StepMeter test; then `props:check` | SM-11 (registry) | Counter and usage assertions fail until the entry and usages exist |
| R14 | `design-system-artifact.test.mjs` focused StepMeter and NowCard assertions | SM-11 (artifact), NC3-09 | No StepMeter entry in the committed artifact until regenerated |
| R15 | `NowCard.test.tsx`: `it.each` over `Link`, `IconButton`, `NowCardDetail` × `md`, `sm` with one StepMeter: DOM order inside `eg-now-card__foot`, one tab stop (none for the detail), meter is an `img` named by its `label`, article still named by its heading (NC3-01, NC3-02); detail, action and meter render in order with no `console.warn` (NC3-06); blank `label` renders nothing while the other child stays and the only warning is StepMeter's own (NC3-07) | NC3-01, NC3-02, NC3-06, NC3-07 | **Guard**: the spec states behavior does not change, so these pin the documented composition and pass at once; no RED is claimed |
| R16 | `storybook-docgen.test.ts` NowCard section: `NowCardFooter` `children` description matches `/StepMeter/` and `/at most one other child/`, `controlReason` names `WithStepMeter`, story pin gains `WithStepMeter` | NC3-09 | Description lacks StepMeter; the pin lacks the story |
| R17 | After the JSDoc edit: `pnpm props:check` and `pnpm test:props` | NC3-09 | Fail by design on the four stale NowCard `revision`s until §6b |
| R18 | One-off differential in scratch, not committed: `ts.transpileModule` of `git show HEAD:…/now-card/types.ts` against the new file with `removeComments: true` must be byte-identical; `git diff` shows no change in `useNowCard.ts`, `NowCard.tsx`, `index.ts`; the existing cases pass untouched | NC3-05 | Not a RED: identical output proves existing stories render identically, because the only module that changes is comment-only; render both trees only if this cannot be shown |
| R19 | Scratch browser geometry (§9): footer row, wrap at 390 and 1280 px, band height with and without the meter, NowStrip bands | NC3-03, NC3-04, NC3-08 | Probe cannot find the compositions on the baseline build; needs D3 |

Coverage check: SM-01 to SM-12 and NC3-01 to NC3-09 each appear in at least one row. **PRESERVE:** the existing NowCard and NowStrip cases stay unmodified and green; `git diff -U0` on `NowCard.test.tsx` shows additions plus the import block. No shared parser or helper changes, so no differential beyond R18 is needed; the `@source` line only adds a scanned file, and the built-CSS selector inventory before and after must differ by additions only.

GREEN order: `types.ts` → `useStepMeter.ts` → `StepMeter.tsx` → `index.ts` → stories → barrel, `compiled.css`, `.storybook/*` → pins and harnesses → registry → NowCard JSDoc, tests and story → artifact and catalog → changelog.

## 5. Stories

`Atoms/StepMeter`, `Meta<typeof StepMeter>` with autodocs, meta `args: { label: 'High progress', value: 3 }` (required props only; `Default` never replaces the documented `steps` default), no manual `argTypes`, no `play`, English JSDoc (`## Description`, `## Usage guidelines`; no Dependencies, StepMeter imports nothing). Compose only with exported DS pieces (`Surface`, `Stack`, `Cluster`, `Text`).

- `Default`: the meta args, `steps` omitted so Docs shows the constant `4`.
- `Levels`: five meters at 0 to 4 on the footer-band tone with consumer wording ("No progress", "Low progress", "Medium progress", "High progress", "Full progress"); JSDoc states the floor and clamp, that an invalid label or value renders nothing and warns in development, and that a changing level needs the consumer's own announcement.
- `CustomSteps`: `steps` 1, 2, 6 and 10 with matching values.
- `OnSurfaces`: one meter on `Surface` tones `surface-0` to `surface-3`, the SM-08 contrast board.

The NowCard story is `WithStepMeter` (§3). Controls expectations: `label` text, `value` number, `steps` number with `@default 4`, zero owned diagnostics; verify the real widgets in the browser, not only tags.

## 6. Registry, docgen, artifact and catalog obligations

- **a. Registry entry.** Registry lookup is in spec §3: `accessible-name` and `primary-value` are approved entries to reuse; no entry fits the step total (`max`, `count`, `items`, `size` and Slider's `step` have other meanings; no `steps` name or alias exists). After the final `types.ts` is reviewed and `pnpm lint` is clean, append this entry (D2 below) and the two usages:

```json
{
  "id": "step-count",
  "name": "steps",
  "meaning": "Total number of discrete steps of a stepped scale.",
  "whenToUse": "A passive stepped indicator lets the consumer choose how many steps its scale has, within a bounded range, while the filled count is supplied separately as the primary value.",
  "avoid": "Item or entry counts, display overflow thresholds, step increments of a continuous control, and wizard or navigation step lists.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": [],
  "usages": [
    {
      "component": "StepMeter",
      "type": "number (optional; integer 1-10, default 4)",
      "status": "existing",
      "source": { "path": "packages/ui/src/atoms/step-meter/types.ts", "symbol": "StepMeterProps", "revision": "sha256:<whole-file hash of the reviewed final types.ts>" }
    }
  ]
}
```

  `meaning` and `avoid` are the spec's approved wording; `whenToUse` is plan-authored and is what D2 asks the owner to approve. The usages appended to existing entries are `accessible-name` (`type: "string (required)"`) and `primary-value` (`type: "number (required; floored and clamped to 0 to steps)"`), both `status: "existing"` with the same `source`. No exception is requested and no existing convention changes status.
- **b. Revision refresh.** The JSDoc edit changes `molecules/now-card/types.ts`, so refresh the four NowCard usages (`preset-dimensions`, `heading-title`, `heading-level`, `leading-status-badge`, all symbol `NowCardProps`, now `d768d4f6…`) to the new whole-file hash after a manual re-review. The existing receipt test reads that file live, so it fails until this is done. Any later edit to either `types.ts` repeats the refresh; `--write` never refreshes evidence or approvals.
- **c. Tests and generated view.** In `prop-naming.test.mjs`: `'step-count'` joins `postReceiptProposals` (a new post-receipt entry, approved or proposed), the two `{ conventionId, source: 'packages/ui/src/atoms/step-meter/types.ts#StepMeterProps' }` pairs join `postReceiptUsages`, the total at the Indicator test becomes 185, and one new test mirrors the Dialog-sheet one: exact entry fields, `status`/`approval`, exact usages, every revision equal to the live file hash, `historicalRegistry([entry])` empty, `validate(registry)`. Then `pnpm props:docs`, `pnpm props:check`, `pnpm test:props`; re-run to find any other pinned count before attributing a failure. With D2 add the receipt test modeled on "Text truncation binds its scoped owner approval".
- **d. Docgen and Controls.** The pins in §2; `documentedNativeProps.stepMeter` makes docgen show `id`, `dir`, `lang`, `aria-describedby`, `className`, `style`. The StepMeter extraction test asserts: `label` required string with `control: 'text'`; `value` required number with `control: 'number'`; `steps` optional number, default `4`, `control: 'number'`; absence of `children`, `role`, `aria-label`, `aria-labelledby`, `aria-hidden`, `aria-live`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`, `title`, `tabIndex`, `contentEditable`, `onClick`, `ref`, `asChild`; the AST has exactly three own props with one `@control` each; `StepMeter` is public and `stepMeterVariants` and `stepMeterStepVariants` are not; the story names equal the four in §5 and no `argTypes` or `play`.
- **e. Artifact.** After source, registry and catalog are final: `pnpm artifact --write`, `pnpm system:docs`, then `pnpm artifact --check`, `pnpm system:check`, `pnpm test:artifact`, `pnpm test:system`. Expected diff: a `StepMeter` component entry (props `label`, `value`, `steps` default `4`, both recipes attributed to StepMeter, no `classNameAllows`), `propNaming` +1 (185), the refreshed NowCard footer description, catalog +1, recipe classes including `eg-step-meter__step` as `eg-gauge-well` already appears. The artifact tests require the components list to equal the barrel exports, `catalog` to equal `docs/catalog.json`'s ui and effects rows, and every registry usage to resolve to an artifact component, so the barrel, catalog, registry and artifact change in the same commits (§10). Expected growth is a few KB against the 786,432-byte budget; report any overflow instead of weakening it. `pnpm build` regenerates the artifact too, so re-check after it.
- **f. Catalog.** Edit only `scripts/catalog_data.py`, then `python3 scripts/build_catalog.py`. New row after Pixel, written after GREEN and kept honest about what is observed:

```py
("—","—","StepMeter","atom","ui","—","—","nuevo","Implemented React atom under the [approved v0.1 contract](components/step-meter/v0.1/spec.md): passive named image (`role=\"img\"`, required `label`) showing a coarse stepped level, default four steps filled from the inline start, token-backed flat steps with an approved clip-path literal and a forced-colors paint. The consumer owns the level and its wording; no stylesheet, ref or asChild. Browser and packed-consumer verification remain pending until observed."),
```

  The NowCard row note gains one sentence, written relative to `docs/` like the other links in that file: `v0.3 ([approval](components/now-card/v0.3/approval.md)) documents one optional consumer-supplied StepMeter in the footer; the card renders no meter.` The composes column stays `Surface, Text` because NowCard imports nothing new.

## 7. Changelog

Both files get a new `## Unreleased` section above the current top version (English, effect on a consumer, `(#556)` because the request is fully resolved). No version bump, no `mcp`, `effects`, `cli` or `tokens` entry (D6).

```md
<!-- packages/ui/CHANGELOG.md, above ## 0.10.0 -->
## Unreleased

### Added

- `StepMeter` shows a coarse stepped level: a named image (`role="img"`, required `label`) that fills `value` of `steps`
  (default 4, from 1 to 10) steps from the inline start in token-backed brand paint, with a forced-colors fallback that
  keeps filled and empty steps distinct. It is not a measurement, input or live region: the consumer owns the level, the
  wording of `label` and any announcement when the level changes. (#556)
- A NowCard footer may hold one `StepMeter` beside its supporting detail or action; with a meter, keep at most one other
  footer child. NowCard renders no meter itself and gains no prop, and cards without a meter render as before. (#556)
```

```md
<!-- packages/system/CHANGELOG.md, above ## 0.12.0 -->
## Unreleased

### Added

- The source-derived artifact and reference include `StepMeter` (its props and static recipes) and the `step-count`
  naming concept (proposed unless its receipt is recorded), and the refreshed NowCard footer description. (#556)
```

The Footer lane's plan also adds an `## Unreleased` section to `packages/ui/CHANGELOG.md`, and other lanes may; whichever PR merges second keeps both sets of bullets under one section.

## 8. Checks to run

After G1, from the repository root, foreground, one at a time; baseline first (R0), then after each GREEN step the focused commands:

```sh
pnpm exec vitest run packages/ui/src/atoms/step-meter --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/molecules/now-card packages/ui/src/organisms/now-strip --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
pnpm typecheck
pnpm lint
pnpm props:docs
pnpm props:check
pnpm test:props
python3 scripts/build_catalog.py
pnpm artifact --write
pnpm system:docs
pnpm artifact --check
pnpm system:check
pnpm test:artifact
pnpm test:system
node --test scripts/storybook-mcp-contract.test.mjs
pnpm test
pnpm build
pnpm artifact --check
pnpm system:check
pnpm test:package-exports
pnpm test:package-consumption
pnpm test:package-release
pnpm test:mcp
pnpm storybook-build
```

`pnpm build` writes package outputs and regenerates the artifact, so the freshness checks run again after it. `pnpm test:package-consumption` needs D4. `pnpm test:package-release` is a PRESERVE check on the changelog structure (an `## Unreleased` section above the packed version is allowed). `pnpm test:mcp` once recorded one pre-existing README failure (`odd/tasks/consumer-request-specs.md` T11): re-run it on the base before attributing any failure. `scripts/storybook-mcp.test.mjs` needs a parent-owned docs-only Storybook server and stays outside this list unless D3 covers it. CI also runs `pnpm test:cli` and the tokens tests, which this change does not touch. Every result is recorded per command with exit code and test counts in the evidence file; jsdom, docgen and HTML smoke prove no appearance, focus visibility, contrast or screen-reader behavior, and none is claimed.

## 9. Browser procedure (D3)

With separate permission, from a scratch build of `packages/ui` (`dist/styles.css` plus tokens, SSR markup from the built package, no Tailwind compiler) in a `mktemp -d` directory outside the repository; record browser and version, viewport, DPR, theme, fonts and the emulated preferences, and copy the outputs into `implementation-evidence.md`.

1. **Geometry and paint (SM-07, SM-10).** For `steps` 4 and 10: root `display: inline-flex`; step rect 11.2 × 12 px; gap 3.2 px; root width about 54.4 and 140.8 px; `clip-path` equals the approved polygon; thickness at the leading edge about 6.3 px and slant about 27.0°; filled `background-color` `rgb(255, 0, 54)`, empty `rgba(255, 0, 54, 0.22)`; no transition, animation, filter, shadow or transform, also under `prefers-reduced-motion: reduce`. `.eg-now-card__meter` matches nothing in the page and the legacy `>i` skew rules do not apply. Disagreement with the spec's arithmetic stops the work (§12).
2. **Contrast (SM-08).** Filled step against the computed backgrounds of `OnSurfaces` tones 0 to 3 at 3:1 or more (documented, hand-computed: 4.61, 4.30, 3.92, 3.42); the empty remainder is recorded, about 1.2:1, as the accepted decorative track.
3. **Forced colors (SM-09).** Chromium `forced-colors: active` emulation: filled computed `background-color` is the resolved `CanvasText`, empty is transparent, the two stay distinguishable, the name is unchanged; the plain and forced rules are proven by computed style, never by class order. Firefox and real Windows High Contrast stay Not evaluated.
4. **Accessibility tree (SM-01).** `img` named by `label` with no exposed children. Real screen-reader output stays Not evaluated.
5. **NowCard footer (NC3-03, NC3-04, NC3-08).** Compositions of `WithStepMeter` at 390 and 1280 px, `md` and `sm`: companion leading and meter trailing in one row without overlap; when narrowed the footer wraps, the meter starts the next line at the leading edge and keeps its intrinsic size; the footer band height with and without the meter is equal for `Link`, `IconButton` and `NowCardDetail`; three `sm` cards with meters in a scratch NowStrip keep aligned top insets and footer bands. A height difference stops the work and returns the measurements.
6. **Controls (SM-11).** In `pnpm storybook` (which builds tokens first): `label` text, `value` number, `steps` number, Docs Default column `4`, no diagnostics.

## 10. Commit slicing (about 400 lines per commit)

Estimated total **≈ 1,250 changed hand-written lines** (insertions plus deletions; range 1,100 to 1,450, about 1,300 with the D2 receipt) plus roughly 250 generated lines (artifact, `system.md`, `prop-naming.md`, catalog), which are counted separately and regenerated inside every commit that changes their inputs, so each commit stays green. Each commit passes the pre-commit Biome and typecheck hooks and the pre-push `pnpm test`; Conventional Commits, bodies use `Refs #556`.

| Commit | Content | Est. lines |
| --- | --- | --- |
| C1 `feat(ui): add the StepMeter atom core (#556)` | `types.ts`, `useStepMeter.ts` (validation, floor, clamp, fallback, warnings), `StepMeter.tsx`, `index.ts`, tests R1 to R4; folder not yet exported | ≈ 330 |
| C2 `feat(ui): protect StepMeter semantics and the root class (#556)` | Hook stripping of protected keys and handlers, tests R5 to R8 | ≈ 160 |
| C3 `feat(ui): publish StepMeter with stories, scanned CSS and metadata pins (#556)` | Stories, barrel, `compiled.css`, `.storybook/main.ts` and `preview.css`, docgen and Controls pins, package-exports and package-consumption additions, catalog row, regenerated artifact and catalog | ≈ 320 |
| C4 `feat(ui): register the StepMeter naming usages (#556)` | Registry entry and usages, `prop-naming.test.mjs`, artifact assertions, receipt if D2, regenerated view and artifact | ≈ 140 (+45 with D2) |
| C5 `docs(ui): allow one StepMeter in the NowCard footer (#556)` | NowCard JSDoc, tests, story, docgen assertions, four registry revisions, catalog note, regenerated view, artifact and catalog | ≈ 190 |
| C6 `docs(step-meter): record the implementation evidence and changelog (#556)` | `implementation-evidence.md`, both changelogs | ≈ 115 |

If the StepMeter test file outgrows the estimate and C1 would pass about 400 lines, move R4 into C2; if C3 does, move the package-consumption additions after it. If a whole-repo test unexpectedly fails on the unexported folder between C1 and C3, merge C1 to C3 instead of weakening the test. The registry steps always follow the final bytes of the file they hash.

## 11. Risks

- **R-1 — Geometry is arithmetic until measured.** The spec's 11.2 × 12 px, 6.3 px thickness and 27.0° are computed, not observed; Chromium may disagree (sub-pixel rounding, `h-3.75` emission). Disagreement stops the work (G2).
- **R-2 — Forced-colors cascade.** The plain `data-[state=filled]:bg-fg-brand-default` rule and the forced rule have the same specificity, so emission order decides which wins; only the computed-style probe proves it. If the order is wrong, the fix is a spec question, never `!important` or a stylesheet. The empty-step forced rule wins by specificity.
- **R-3 — Scanning is per atom.** `compiled.css` lists atoms one by one: without the `@source` line the package ships without `h-3.75` and the clip-path literal while Storybook may still look right. The built-CSS test and the packed consumer without a Tailwind compiler are the guards; `.storybook/preview.css` proves nothing for the package.
- **R-4 — Registry freshness chain.** Revisions bind the final bytes of two `types.ts` files; a late JSDoc, formatting or Biome autofix stales `props:check`, `test:props` and the artifact until the order is repeated: finish source, lint, hash, registry, regenerate, check.
- **R-5 — Plan-authored wording.** `whenToUse` for `step-count` is not in the spec; it is covered only by D2.
- **R-6 — Spec wording nit, no change requested.** Spec §6 calls the arbitrary utilities "the clip-path literal and the two system-color ones", while the approved inventory has one arbitrary system-color utility (`forced-colors:data-[state=filled]:bg-[color:CanvasText]`) plus the keyword utilities `forced-colors:data-[state=empty]:bg-transparent` and `forced-colors:forced-color-adjust-none`. The plan proves all of them and adds none.
- **R-7 — Contrast scope.** Only the filled run is held to 3:1 (OQ-5): the empty remainder is an accepted decorative track, and the level is also text through `label`. Not evaluated: screen-reader output, zoom and reflow, RTL appearance, Firefox and real High Contrast themes, protan and deutan simulations.
- **R-8 — Footer band height.** The 12 px meter should sit inside the companion's line box; if the band grows, no NowCard CSS change is authorized and the measurements go back to the owner (NC3-04).
- **R-9 — Console warnings during render.** Like NowCard, the warnings fire in render and can fire twice under React StrictMode; tests assert the exact messages, not a call count under StrictMode.
- **R-10 — Parallel lanes, shared files.** The changelog, `prop-naming.json`, `docs/prop-naming.md`, the artifact, `system.md` and the docgen pins are also touched by the Footer lane (and possibly others): regenerate generated files after rebasing on whichever PR merged first and never hand-merge them.
- **R-11 — Permissions.** The packed React 18.3.1 and 19.3.0 matrix (D4) and every browser observation (D3) stay **Not observed** until separately authorized and run; types, SSR and docgen output are not a substitute.
- **R-12 — Lint on the hook.** `role` is set in the hook's props object, not as a JSX attribute, so no JSX `role` literal appears in `StepMeter.tsx`; Biome runs on the final files and any rule that disagrees is reported, not silenced.

## 12. Stop

This plan authorizes nothing until G1. No source, test, registry, generated file, token, dependency, catalog, Git, release or GitHub action is taken or implied. Stop and return the evidence to the owner if: computed geometry or the clip-path emission disagrees with the approved arithmetic; the forced-colors cascade fails or `forced-color-adjust: none` is not honoured; a StepMeter-only utility is absent from the shipped CSS after the `@source` line; the footer band height changes with a meter or the meter overlaps or clips; an existing NowCard or NowStrip case must change to pass; a token, dependency, stylesheet, inline style, `!important` or Radix package would be needed; `props:check` fails for a reason other than stale revisions, or `step-count` would be marked approved without D2; docgen or Controls report diagnostics, the artifact exceeds 768 KiB or its diff shows sections this plan does not expect; or a whole-repo test fails on an unexported component and cannot be fixed without weakening it.
