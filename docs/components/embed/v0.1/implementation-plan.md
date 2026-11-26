# Embed v0.1 — implementation plan

- **Status:** Proposed, never approved. Presented for separate owner approval (S6). It authorizes no code, tests, registry write, generated-file, catalog, token, dependency, capture, release or Git action. Nothing below is implemented or measured: preparation was read-only (source inspection and digest checks), and no build, test, Storybook, browser or capture ran.
- **Coverage:** S4 of [`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md), request #574 only; this is the plan gate that precedes implementation under T6. It covers the new `Embed` atom and nothing else: the consent policy and third-party scripts stay in the website (owner decision L3), and #575 is an app pattern. Format follows the [Carousel v0.4](../../carousel/v0.4/implementation-plan.md) plan; the new-atom surfaces (barrel, scanned CSS, metadata pins, packed harnesses, registry, artifact, catalog) follow the [StepMeter v0.1](../../step-meter/v0.1/implementation-plan.md) plan. One PR for #574 references the issue with `Refs #574`, never `Closes` ([consumer requests §3](../../../distribution/consumer-requests.md)); the branch is the parent's choice, and the writer never switches branches or commits.
- **Contract authority:** [spec.md](spec.md) v0.1, Approved on 2026-11-26. `contentSHA256: a004144377a34800c9729c2b983bf48bdaaadd3bb8d41b0ca3338c98317e1b69`, reproduced byte-exact in this working tree by two independent methods with the spec's own rule (`awk '/^## 1\. Purpose and scope$/{f=1} f' spec.md | sha256sum`, and the bytes from the line-start heading through EOF, LF, final newline). Approval record: [approval.md](approval.md): owner answer, verbatim "Aprobar todas (Recomendado)", 2026-11-26 (`odd/tasks/round-5-consumer-requests.md` L5), given on the committed draft (`8f50f0b`, draft payload `032afeb82805e643080a739d4e3e82875db0dfd2327d548724efbce886b98d5a`) with the recommended answer to OQ-1 to OQ-6. The cataloging approval is L3. Visual hashes: VIS-01 to VIS-03 Pending, no capture exists. Recover and compare the digest again before any edit; a different digest stops the work.
- **Resolved decisions this plan carries:** one atom with both branches (OQ-1 a); a fixed `ratio` and no growth mode (OQ-2 a); no state prop (OQ-3 a); http(s)-only `src` through the URL parser (OQ-4 a); `ratio` default `16 / 9` and `loading` default `lazy` (OQ-5 a); `label` reuses `accessible-name`, `src` has no registry entry and `fallback` is the proposed `unavailable-content-fallback` (OQ-6 a).
- **Plan identity:** `contentSHA256: df0282e3cb879efa4704bcbe9334f623cd719de5c0651457f953da2484b938be` — SHA-256 of the UTF-8, LF, final-newline payload from the exact `## 1. Authority and gates` heading line through EOF; the metadata above it is excluded. It identifies these bytes only. It is not an approval, and any later edit needs a recomputed digest and a renewed approval.
- **Baseline:** branch `integration/round-5`, HEAD `8f50f0b`. At inspection no tracked file under `packages/`, `scripts/`, `skills/` or `.storybook/` was modified (only spec, approval and plan documents and the ODD task file). Whole-file SHA-256 prefixes, re-verified in this working tree: `packages/ui/src/index.ts` `713d1843…`, `styles/compiled.css` `7c587736…`, `.storybook/main.ts` `30ef22e5…`, `.storybook/preview.css` `b55993fb…`, `skills/_shared/prop-naming.json` `ceb95f54…` (185 entries), `scripts/prop-naming.test.mjs` `f2acfd78…`, `storybook-docgen.test.ts` `3705e162…`, `storybook-controls.test.ts` `f7928479…`, `storybook-css.test.ts` `81993251…`, `scripts/package-exports.test.mjs` `9b779e24…`, `package-consumption.test.mjs` `de9a624c…`, `design-system-artifact.test.mjs` `51238e62…`, `scripts/catalog_data.py` `041dccd6…`, `packages/ui/CHANGELOG.md` `404c5095…`, `packages/system/CHANGELOG.md` `ab828f02…`; precedents `atoms/photo-frame/usePhotoFrame.ts` `47675cba…`, `atoms/step-meter/types.ts` `7e52350f…`. The six whole-file hashes that spec block 3 cites (`AspectRatioProps`, `PhotoFrameProps`, `PreviewFrameProps`, `AppIconProps`, `SpinnerProps`, `SurfaceProps`) equal the current files. `packages/system/design-system.json` is 610,264 bytes and `system.md` 500,426 bytes against the 768 KiB (786,432-byte) budget asserted in `design-system-artifact.test.mjs`. The registry has no canonical name or alias `fallback`, and `label` and `ratio` map to the approved `accessible-name` and `aspect-ratio`. Everything below is planned, not observed.

## 1. Authority and gates

1. **G1 — Plan approval.** Owner approval of this exact payload grants the edit surfaces of §2, including the integration surfaces the parent owns. The contract approval alone grants no code (S6). Approving the plan approves no capture, release or GitHub write.
2. **G2 — Spec provenance and its one limit.** The spec was approved on the committed draft with its recommended answers, so the spec digest binds the bytes derived from that draft plus those answers, not a digest the owner quoted ([approval.md](approval.md)). The plan accepts that as provenance; a reviewer who wants an exact-digest confirmation can ask for it before G1.
3. **G3 — Registry.** Two approved entries are reused as appended usages: `accessible-name` (`label`) and `aspect-ratio` (`ratio`). One new concept is registered: `unavailable-content-fallback` (`fallback`), `proposed` with `approval: null` unless D2 is granted. `src`, `children`, `loading` and the iframe natives have no entry; no exception is requested. Adding a usage approves nothing globally.
4. **G4 — Tokens, dependencies, Radix and stylesheet: none.** Every utility of the spec's inventory (block 6) resolves to an existing token. `@radix-ui/react-aspect-ratio` 1.2.0 is already a dependency (`packages/ui/package.json:30`). **No stylesheet**: `embed.css` is not created and `packages/ui/src/styles/legacy/bundle.css` stays byte-identical. No extra internal module, no new AGENTS.md exception, and the only inline style is AspectRatio's Radix-owned geometry. If emission or computed style disagrees with the spec's arithmetic, stop (§14); another literal, an `!important`, a stylesheet or an inline style needs a new approval, never an improvisation.
5. **G5 — Material is a reused recipe; observation is not a gate.** `surfaceVariants({ tone: 'well', padding: 'none', radius: 'xl' })` composed in the hook is approved in spec block 6. Paint order and separation on the grafito register are observations (VIS-01 to VIS-03). A result that disagrees is a spec question; a different tone, a handwritten shadow or a gradient is never improvised.
6. **G6 — Behavior promises are proven, not assumed.** The hydration-safe mount (EM-03), the load model (EM-04) and the scheme policy (EM-08) are proven by server-markup, hydration and `fireEvent.load` tests. How jsdom treats an iframe `src` is not verified here (§12, risk 1). Real provider behavior (heights, `load` timing, blocked frames) is Not evaluated.
7. **G7 — Integration ownership.** Registry JSON and generated view, the system artifact and `system.md`, catalog source and outputs, barrel, `compiled.css`, `.storybook/*`, docgen and Controls pins, package harnesses and changelogs are parent-owned surfaces, as in the StepMeter and Carousel plans. A writer touches only the six Embed files.
8. **G8 — Release and publication stay outside this plan.** Changelog entries go under the existing `## 0.11.0` (ui) and `## 0.13.0` (system) sections (owner decision S2: 0.11.0 was never packed). No `version` edit, `release:pack`, tag, issue comment or snapshot publication. Tokens, cli, effects and mcp do not change for Embed, so coupled versions do not move.
9. **G9 — Stop lines** are listed in §14.

## 2. Intended future edit surfaces — not currently authorized

| Path | Owner | Planned work | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/atoms/embed/types.ts` | Writer | `EmbedProps` as a shared part plus the frame and content branches (§3); protected `Omit` list; English JSDoc with one `@control` per own declaration (`text` for `label` and `src`, `number` for `ratio` with `@default 16 / 9`, `select` for `loading` with `@default lazy`, `false` with `@controlReason` for `children` and `fallback`); four static CVA recipes | +150 |
| `packages/ui/src/atoms/embed/useEmbed.ts` | Writer | Label validation, `ratio` normalization, `src` policy through the URL parser, branch and state derivation, mount flag, load handler, protected-attribute stripping, four development warnings, `surfaceVariants` and per-part `cn()` | +190 |
| `packages/ui/src/atoms/embed/Embed.tsx` | Writer | JSX only: null when invalid; root, `AspectRatio`, loading layer with `Spinner`, iframe with an explicit `title`, children, fallback layer | +45 |
| `packages/ui/src/atoms/embed/Embed.test.tsx` | Writer | Cases for EM-01 to EM-09 (unit parts), the types part of EM-13, server markup and hydration (§4) | +560 |
| `packages/ui/src/atoms/embed/Embed.stories.tsx` | Writer | `Atoms/Embed`: `Default`, `Ratios`, `ScriptEmbed`, `Fallback`, `OnGrafito` (§6) | +150 |
| `packages/ui/src/atoms/embed/index.ts` | Writer | `export { Embed } from './Embed'; export type { EmbedProps } from './types';` and no variants export (StepMeter precedent) | +2 |
| `packages/ui/src/index.ts` | Parent | `export * from './atoms/embed';` between `./atoms/dropzone` (baseline `:9`) and `./atoms/field-message` (`:10`) | +1 |
| `packages/ui/src/styles/compiled.css` | Parent | `@source "../atoms/embed/types.ts";` between the dropzone (`:15`) and field-message (`:16`) lines; atoms are listed one by one, so without it an Embed-only utility is not shipped | +1 |
| `.storybook/main.ts` | Parent | `documentedNativeProps.embed`: `['allow', 'allowFullScreen', 'referrerPolicy', 'sandbox', 'onLoad', 'id', 'dir', 'lang', 'aria-describedby', 'className']` after `stepMeter` (`:170`); 130 columns on one line, so Biome wraps it | +12 |
| `.storybook/preview.css` | Parent | `@source "../packages/ui/src/atoms/embed/Embed.stories.tsx";` after the dropzone story line (`:27`); Storybook only, proves nothing for the package | +1 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Parent | Embed extraction test after the StepMeter one (`:695-770`); `'./atoms/embed'` in the barrel module list (between `:2089` and `:2090`); `'Embed'` in the runtime names (between `'Dropzone'` `:2225` and `'Field'`) | +115 |
| `packages/ui/src/lib/storybook-controls.test.ts` | Parent | `['Embed', 'atoms/embed']` at the end of `components` after `StepMeter` (`:137`, keeps the literal-interning order); `embed: { label: 'text', ratio: 'number', src: 'text', children: false, fallback: false, loading: 'select' }` (near `:293`); `ownPropCounts.embed` (near `:758`); defaults row (`:1638`); a dedicated test after the StepMeter one (`:2109`) | +60 |
| `packages/ui/src/lib/storybook-css.test.ts` | Parent | **No edit expected:** Embed adds no preview-only utility. A diff here means a story host utility crept in | 0 |
| `scripts/package-exports.test.mjs` | Parent | `'Embed'` in the runtime names (between `'Dropzone'` `:6006` and `'FieldMessage'` `:6008`); `'Embed'` and `'EmbedProps'` in both sorted type lists (`:6375-6380`, `:6905`); a built-CSS test and an SSR test modeled on StepMeter's (`:861`, `:925`) | +135 |
| `scripts/package-consumption.test.mjs` | Parent | Packed fixtures modeled on StepMeter's (`:97`, `:569`): typed samples for both branches and `@ts-expect-error` negatives, a CSS assertion modeled on `assertPixelConsumerCSS` (`:5280`), SSR assertions and a `hydrateRoot` check modeled on ScrollReveal's (`:8642-8651`); the runtime-names list (`:5991` area) | +130 |
| `skills/_shared/prop-naming.json` | Parent | New `unavailable-content-fallback` entry; Embed usages on `accessible-name` and `aspect-ratio` (§5.1) | +45 |
| `scripts/prop-naming.test.mjs` | Parent | `'unavailable-content-fallback'` in `postReceiptProposals` (`:898` area); two Embed pairs in `postReceiptUsages` (`:848` area); counts 185 to 186 and 182 to 183 (`:2309-2310`); one Embed test modeled on the StepMeter one (`:1717`) | +70 |
| `docs/prop-naming.md` | Parent, generated | `pnpm props:docs`; never hand-edited | ≈ 25 |
| `docs/components/embed/v0.1/prop-naming-approval.json` | Parent | Only if D2 is granted (Text v0.3 receipt precedent) | +45 |
| `scripts/design-system-artifact.test.mjs` | Parent | One Embed assertion block modeled on StepMeter's (`:556`): props, defaults, recipes, `composedOf`, `surfaceUsage`, no `classNameAllows`, naming entry | +50 |
| `packages/system/design-system.json`, `packages/system/system.md` | Parent, generated | `pnpm artifact --write`, `pnpm system:docs`; never hand-edited | 1 minified line; ≈ 30 |
| `scripts/catalog_data.py` + generated `docs/CATALOGO.md`, `docs/catalog.json` | Parent | One Embed row after StepMeter (`catalog_data.py:38`), then one `build_catalog.py` run (§5.4) | +1; ≈ 15 |
| `packages/ui/CHANGELOG.md`, `packages/system/CHANGELOG.md` | Parent | Entries under the existing `## 0.11.0` and `## 0.13.0` `### Added` sections citing `(#574)` (§7) | +10; +4 |
| `docs/components/embed/v0.1/implementation-evidence.md` (+ `capture.json` and PNGs only if authorized) | Parent | Observed RED and GREEN output, browser table, hashes (§9) | +120 |
| `odd/tasks/round-5-consumer-requests.md` | Parent | Log the plan approval and the delivery | +6 |

Explicitly untouched: `packages/ui/src/primitives/aspect-ratio/**`, `primitives/surface/**`, `atoms/spinner/**` and `atoms/photo-frame/**` (composed or used as precedent, never edited); `packages/tokens/**`; `packages/ui/src/styles/legacy/**`; every `package.json`, version and the lockfile; `packages/effects/**`, `packages/mcp/**`, `packages/cli/**`; other components and the files of the other round-5 lanes; the spec and its approval record; frozen documents.

## 3. Design of the change

Indicative only: the writer's code and JSDoc are reviewed against the approved spec, not against these excerpts. Biome style: single quotes, 120 columns, no trailing commas, `type` never `interface`, no `any`.

```ts
// types.ts — every own prop carries English JSDoc with one @control; label is the only source of the name
type RootNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children' | 'title' | 'role' | 'aria-label' | 'aria-labelledby' | 'aria-hidden' | 'aria-busy' | 'tabIndex' | 'style'
  | 'dangerouslySetInnerHTML' | 'contentEditable' | 'onClick' | 'onKeyDown' | 'onLoad' | 'onError'
>;
type FrameAttributes = Pick<ComponentPropsWithoutRef<'iframe'>, 'allow' | 'allowFullScreen' | 'referrerPolicy' | 'sandbox' | 'onLoad'>;
type EmbedSharedProps = {
  /** Accessible name of the embedded content, never rendered visibly. @control text */ label: string;
  /** Width divided by height of the reserved box. @default 16 / 9 @control number */ ratio?: number;
  /** Consumer-supplied alternative for the fallback state. @control false @controlReason ReactNode is not serializable; see Fallback. */ fallback?: ReactNode;
};
type EmbedFrameProps = FrameAttributes & {
  /** Document URL of the external content. @control text */ src?: string;
  /** Native deferral of the frame request. @default lazy @control select */ loading?: 'lazy' | 'eager';
  /** Not available with src. @control false @controlReason ReactNode is not serializable; see ScriptEmbed. */ children?: never;
};
type EmbedContentProps = {
  /** Consumer-owned content a script or the app fills. @control false @controlReason ReactNode is not serializable; see ScriptEmbed. */ children: ReactNode;
  /** Not available with children. @control text */ src?: never;
} & Partial<Record<'loading' | 'allow' | 'allowFullScreen' | 'referrerPolicy' | 'sandbox' | 'onLoad', never>>;
export type EmbedProps = RootNativeProps & EmbedSharedProps & (EmbedFrameProps | EmbedContentProps);

export const embedVariants = cva('eg-embed min-w-0 overflow-hidden');
export const embedLoadingVariants = cva('absolute inset-0 grid place-items-center text-fg-muted');
export const embedFrameVariants = cva('relative block size-full border-0');
export const embedFallbackVariants = cva('grid size-full place-items-center p-6 text-center font-sans text-body-default text-fg-muted');
```

```ts
// useEmbed.ts — the only place that decides branch, state, policy and warnings; same development guard as useStepMeter.ts
const representable = (ratio: unknown): ratio is number =>
  typeof ratio === 'number' && Number.isFinite(ratio) && ratio > 0 && Number.isFinite(100 / ratio); // AspectRatio's predicate
function sourceStatus(src: unknown): 'absent' | 'accepted' | 'rejected' {
  if (src === undefined || src === null || (typeof src === 'string' && src.trim() === '')) return 'absent';
  if (typeof src !== 'string') return 'rejected'; // plan-level choice for untyped callers (§13)
  try {
    const { protocol } = new URL(src, 'http://embed.invalid'); // the WHATWG parser strips tabs and newlines first
    return protocol === 'http:' || protocol === 'https:' ? 'accepted' : 'rejected';
  } catch {
    return 'rejected';
  }
}
// Renderable children (non-empty Children.toArray) select the content branch: 'ready', role="group" named by label.
// Otherwise the frame branch: an accepted src is 'loading' until the iframe's load event records that exact src, so a new
// src is 'loading' again without an effect. The iframe mounts only after the first client render (an effect sets
// `mounted`) and is keyed by the supplied src string, so a new src is a fresh frame. Absent or rejected src: 'fallback'.
// rootProps: passthrough minus the protected keys and data-state; data-state; aria-busy only while loading; role="group"
// with aria-label only when no iframe carries the name; className: cn(surfaceVariants({ tone: 'well', padding: 'none',
// radius: 'xl' }), embedVariants(), className). Warnings fire in render, with the spec's four exact messages.
```

```tsx
// Embed.tsx — JSX only; the hook returns the layers already decided, and the iframe's title is an explicit attribute
if (!embed.valid) return null;
return (
  <div {...embed.rootProps}>
    <AspectRatio ratio={embed.ratio}>
      {embed.loading && <span className={embed.loadingClassName}><Spinner /></span>}
      {embed.frame && <iframe key={embed.frame.key} title={embed.frame.title} {...embed.frame.props} />}
      {embed.content}
      {embed.fallback !== undefined && <div className={embed.fallbackClassName}>{embed.fallback}</div>}
    </AspectRatio>
  </div>
);
```

The loading layer precedes the frame in tree order, so the positioned frame paints over it. No state beyond the mount flag and the recorded loaded source, no ref, no `asChild`, no id, no `style` and no Surface component import: only the `surfaceVariants` recipe is composed. Neither the CVA recipes nor `useEmbed` are exported from `index.ts`.

**Emission inventory.** Each static utility, the declaration it must resolve to and where it is proved (E1: the built CSS of the package; B: the browser rows of §9). The root's Surface `well` utilities are already emitted through `surface/types.ts`:

| Utility | Required resolution | Proof |
| --- | --- | --- |
| `eg-embed` | No CSS rule in the shipped stylesheet or the legacy bundle selects it | E1 |
| `min-w-0`, `overflow-hidden` | Zero minimum inline size; `overflow: hidden` (the clip) | E1, B |
| `bg-surface-0`, `border-border-hairline`, `shadow-[var(--shadow-well)]`, `rounded-xl`, `p-0` from `surfaceVariants` | `--color-surface-0`, hairline border, the well shadow, `--radius-xl` (17.6px), no padding | E1, B |
| `absolute`, `inset-0`, `grid`, `place-items-center`, `text-fg-muted` | Loading layer fills the Radix inner box, centers the Spinner, colour `--color-fg-muted` | E1, B |
| `relative`, `block`, `size-full`, `border-0` | Frame positioned, full box, no border | E1, B |
| `p-6`, `text-center`, `font-sans`, `text-body-default` | Fallback padding 19.2px (`--spacing` 3.2px × 6), centered, sans, 12.8px | E1, B |
| No `transition-*`, `transform`, `animate-*`, `style` in the Embed recipes | Nothing transitions or transforms; the only animation is the Spinner's own, static under `motion-reduce` | E1, B |

## 4. Test-first sequence

Public interface only: roles and names, `fireEvent.load` for the frame, no `data-testid`, no full class strings. Pre-commit runs Biome and `pnpm typecheck`, so a failing-test commit is impossible: RED is observed locally and recorded in the evidence file. A new component has no jsdom RED before its files exist and a stub would be a dummy file, so R1 fails at import and each later row fails on an assertion after the previous minimal GREEN. Rows marked **guard** pass on their first run and claim no RED; browser rows have no jsdom-expressible failure, so their probes are written first, fail against the baseline build, and their computed values become the evidence.

| Step | RED test (file → case) | Covers | Expected RED before the change |
| --- | --- | --- | --- |
| R0 | No edit: AspectRatio, Spinner, PhotoFrame, Surface suites; docgen, controls and css suites; `props:check`, `test:props`, `artifact --check`, `system:check`, `test:artifact`, `test:system` | PRESERVE baseline | All green; record counts |
| R1 | `Embed.test.tsx`: a valid `label` and `src` render `div.eg-embed` with the well tokens (`bg-surface-0`, `border-border-hairline`, `rounded-xl`, `p-0`, `overflow-hidden`), one Radix AspectRatio wrapper and a `data-state`; `className` merges last; `renderHook(useEmbed)` result shape | EM-01 | Whole file fails at import (`./Embed`, `./useEmbed`, `./types` unresolved) |
| R2 | `it.each` valid ratios (1, 4/3, 2.35, 0.5) reserved as given; 0, −1, NaN, ±Infinity, a string (untyped) and `undefined` give 16/9; the wrapper's reserved percentage is identical in `loading`, `ready` and `fallback` | EM-02 | After R1's minimal GREEN (a fixed ratio) valid ratios are ignored and the default is not 16/9 |
| R3 | `renderToStaticMarkup` has no `iframe` and not the `src`; `hydrateRoot` with an `onRecoverableError` collector reports nothing and keeps the same markup; inside `act` after mount one iframe has `title` equal to `label`, the supplied `src` and `loading="lazy"`; `eager`, `allow`, `allowFullScreen`, `referrerPolicy` and `sandbox` pass through, and the last four are never defaulted | EM-03 | The iframe is in the server markup, or never mounts, until the mount flag exists |
| R4 | `fireEvent.load(iframe)`: `data-state="ready"`, no `aria-busy`, no Spinner, `onLoad` called once with the event; `rerender` with a new `src` mounts a different iframe node and returns to `loading`; the handler fires again on its load | EM-04 | Stays `loading`, or the handler is never called |
| R5 | Renderable children: `getByRole('group', { name })` contains them, `data-state="ready"`, no iframe, no Spinner, no `aria-busy`; `document.scripts` count unchanged and `document.cookie` and `Storage` spies untouched | EM-05 | Children are not rendered, or a frame mounts |
| R6 | Absent, blank, whitespace-only or rejected `src` with no children, and children that become empty (`null`, `false`, `[]`), give `data-state="fallback"`, the `fallback` node, no iframe and a named `group`; a valid `src` turned blank unmounts the frame | EM-06 | The state stays `loading` and an iframe mounts for a blank `src` |
| R7 | Blank, whitespace or non-string `label`: the exact warning, an empty container, and a later valid rerender renders; untyped `title`, `role`, `aria-label`, `aria-labelledby`, `aria-hidden`, `aria-busy`, `tabIndex`, `style`, `data-state`, `dangerouslySetInnerHTML`, `contentEditable`, `onClick`, `onKeyDown`, `onError` are dropped; `id`, `data-*`, `aria-describedby`, `lang`, `dir` pass; the iframe name comes only from `label`; `expectTypeOf` excludes the protected keys, `ref` and `asChild` and rejects `src` with `children` | EM-07 | An unnamed frame renders without a warning and protected attributes reach the DOM |
| R8 | Table: `javascript:`, `data:`, `blob:`, `vbscript:`, `file:`, tab- and newline-obfuscated schemes, a leading-space `javascript:` and an unparsable `http://` give the fallback state plus the exact warning; `https:`, `http:`, `//host/x`, `/x`, `x/y` and `?q` are accepted; an untyped number `src` is rejected; `src` with `children` (untyped) renders the children and warns; a fallback state without `fallback` renders the empty box and warns | EM-08 | A `javascript:` URL mounts an iframe and no warning exists |
| R9 | No part carries `tabindex`; `onClick` and `onKeyDown` are dropped; the only element a tab walk could reach is the iframe (jsdom does not model frame focus, so the real walk is R16) | EM-09 | **Guard** for the attribute and handler parts once R7 passes; no RED claimed |
| R10 | `storybook-docgen.test.ts` and `storybook-controls.test.ts` pins first: real extraction rows, AST own declarations each with exactly one `@control`, `@default` only on `ratio` and `loading`, `children` and `fallback` as `false` with a reason, protected keys absent, story names, an AST scan of the story source for external URL literals | EM-13 | Pins fail until the types, `documentedNativeProps.embed` and the stories exist |
| R11 | Barrel inventories first: `'./atoms/embed'` in the module list and `'Embed'` in the runtime names (`storybook-docgen.test.ts`), the three lists of `package-exports.test.mjs` | EM-14 | Lists differ from the real barrel until the export exists |
| R12 | `package-exports.test.mjs` after `pnpm build` of the baseline: every static utility collected from the Embed CVA strings is in the shipped utilities layer and nothing selects `eg-embed`; package SSR renders no iframe, no `src`, `data-state="loading"`, `aria-busy="true"` and an `aria-hidden` Spinner | EM-11, EM-14 | `Embed` is undefined in the package. The utility part is a **guard** if every utility is already emitted for another component; no RED is claimed for it |
| R13 | `package-consumption.test.mjs`: packed positive samples, negatives (`title`, `role`, `aria-label`, `style`, `ref`, `asChild`, `srcDoc`, `onError`, `src` with `children`, no `label`), CSS assertion without a Tailwind compiler, SSR assertions, `hydrateRoot` with an empty `onRecoverableError` list and the iframe present after mount | EM-14 | Fails against the baseline packed build; needs D4 |
| R14 | `prop-naming.test.mjs` first: counts 186 and 183, `postReceiptProposals`, `postReceiptUsages` and the Embed test (exact entry fields, `status` and `approval`, exact usages, every revision equal to the live file hash, `historicalRegistry([entry])` empty, `validate(registry)`); then `props:check` | EM-13 | Counter and usage assertions fail until the entry and usages exist |
| R15 | `design-system-artifact.test.mjs`: Embed props (`children`, `fallback`, `label`, `loading`, `ratio`, `src`), defaults `16 / 9` and `lazy`, the four recipes, `composedOf` AspectRatio and Spinner, one `surfaceUsage` from `useEmbed.ts` with `well`, `none` and `xl`, `parts` empty, no `classNameAllows`, the naming entry and the two reused entries listing Embed | EM-13, EM-14 | No Embed entry until the artifact is regenerated |
| R16 | Scratch browser probes (§9): loading state under a stalled request, focus walk, accessibility tree, computed style, reduced motion and forced colors | EM-04, EM-09 to EM-12 | A probe cannot find `Atoms/Embed` on the baseline build; needs D3 |

Coverage check: EM-01 to EM-14 each appear in at least one row. **PRESERVE:** no existing command or option is touched. The shared code that changes is additive (barrel, scanned CSS, one `.storybook` row, registry entries and usages, artifact and catalog). The AspectRatio, Spinner, Surface and PhotoFrame cases stay unmodified and green; the built-CSS selector inventory before and after must differ by additions only; the diffs of the shared test files show additions plus the deliberate counter changes (185 to 186, 182 to 183). No parser or helper changes, so no differential beyond these is needed.

GREEN order: `types.ts` → `useEmbed.ts` → `Embed.tsx` → `index.ts` → focused runner → stories → barrel, `compiled.css`, `.storybook/*` → pins and harnesses → registry → artifact and catalog → changelogs.

## 5. Registry, docgen and artifact obligations

### 5.1 Registry (`skills/_shared/prop-naming.json`)

After the final `types.ts` is reviewed and `pnpm lint` is clean on it, append this entry and the two usages (the wording is the spec's block 3, unchanged):

```json
{
  "id": "unavailable-content-fallback",
  "name": "fallback",
  "meaning": "Consumer-supplied content a component shows in place of its primary content while that content is unavailable or deliberately withheld.",
  "whenToUse": "A component owns the reserved space and the state of external or deferred content, and the consumer supplies the readable alternative, such as a short explanation and a link to the original.",
  "avoid": "Numeric or time displays (use unavailableText), image-load initials (identity-image-source), form errors (error), loading indicators or skeletons, built-in default copy, or deciding when content is withheld (policy stays with the consumer).",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": [],
  "usages": [
    {
      "component": "Embed",
      "type": "ReactNode (optional)",
      "status": "existing",
      "source": { "path": "packages/ui/src/atoms/embed/types.ts", "symbol": "EmbedProps", "revision": "sha256:<whole-file hash of the reviewed final types.ts>" }
    }
  ]
}
```

The usages appended to existing entries are `accessible-name` (`type: "string (required; non-empty after trimming, otherwise nothing renders)"`) and `aspect-ratio` (`type: "number (optional; default 16 / 9; an unrepresentable value falls back to the default)"`), both `status: "existing"` with the same `source`. All three usages carry the same whole-file hash, taken only after `types.ts` is final; any later edit, even formatting, requires re-hashing. No exception is requested and no existing convention changes status.

In `scripts/prop-naming.test.mjs`: `'unavailable-content-fallback'` joins `postReceiptProposals`, the two `{ conventionId, source: 'packages/ui/src/atoms/embed/types.ts#EmbedProps' }` pairs join `postReceiptUsages`, the totals become 186 and 183 (recompute them from the merged tree, because other round-5 lanes may add entries first), and one new test mirrors the StepMeter one: exact entry fields, `status` and `approval`, exact usages, every revision equal to the live file hash, `historicalRegistry([entry])` empty, `validate(registry)`. Then `pnpm props:docs`, `pnpm props:check` and `pnpm test:props`; re-run to find any other pinned count before attributing a failure. With D2, add the receipt test modeled on "Text truncation binds its scoped owner approval": the receipt binds the `approved` form because `conventionHash` includes `status`.

### 5.2 Docgen and Controls pins

- `storybook-docgen.test.ts`: the Embed extraction test asserts the rows the real parser returns, never a guess: `label` required string with `control: 'text'`; `ratio` optional number, default `16 / 9`, `control: 'number'`; `src` optional string, `control: 'text'`; `loading` optional with its extracted options in the extracted order, default `lazy`, `control: 'select'`; `children` and `fallback` with `control: 'false'` and a reason; the native rows `allow`, `allowFullScreen`, `referrerPolicy`, `sandbox`, `onLoad`, `id`, `dir`, `lang`, `aria-describedby`, `className`; absence of `title`, `role`, `aria-label`, `aria-labelledby`, `aria-hidden`, `aria-busy`, `tabIndex`, `style`, `onClick`, `ref`, `asChild`; an AST walk over every `PropertySignature` of `EmbedProps` (the `never` placeholders included) with exactly one `@control` each; `Embed` public and `embedVariants` and `useEmbed` not; the five story names; no `argTypes` or `play`; no string literal in the story source that starts with `http://`, `https://` or `//`.
- `storybook-controls.test.ts`: the pins of §2, plus a test that maps `label` text, `ratio` number, `src` text and `loading` select with zero diagnostics, injects no optional argument, retains the native rows and keeps `children` and `fallback` as `control: false` without `table.disable`. The `loading` options order is read from the observed extraction (§12, risk 4).
- `storybook-css.test.ts`: no edit expected (§2). The Storybook MCP contract (`scripts/storybook-mcp-contract.mjs`) is two-way: a story whose component no barrel exports is a violation, and an exported component without a story is undocumented. The barrel line and `Embed.stories.tsx` therefore land in the same commit (§10).

### 5.3 System artifact

After source, registry and catalog are final: `pnpm artifact --write`, `pnpm system:docs`, then `pnpm artifact --check`, `pnpm system:check`, `pnpm test:artifact`, `pnpm test:system`. Expected diff: an `Embed` component entry with six own props (`children`, `fallback`, `label`, `loading`, `ratio`, `src`; the native `Pick` rows come from `node_modules` and are not published), `composedOf` `AspectRatio` and `Spinner` (read from the JSX tags in `Embed.tsx`), one `surfaceUsage` read from the `surfaceVariants(` call in `useEmbed.ts`, the four recipes attributed to Embed, `parts` empty and no `classNameAllows`; `propNaming` +1 (186) and the two reused entries gaining `Embed`; catalog +1. The artifact tests require the components list to equal the barrel exports, the catalog to equal `docs/catalog.json`'s ui and effects rows and every registry usage to resolve to an artifact component, so the barrel, catalog, registry and artifact change in the same commits (§10). Expected growth is a few KB against the 786,432-byte budget; report any overflow instead of weakening it. `pnpm build` regenerates the artifact too, so re-check after it.

### 5.4 Catalog

Edit only `scripts/catalog_data.py`, then `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py`; never hand-edit `docs/CATALOGO.md` or `docs/catalog.json`. New row after StepMeter, written after GREEN and kept honest about what is observed (the row's link is relative to `docs/`, like the other rows):

```py
("—","—","Embed","atom","ui","AspectRatio","Spinner, Surface recipe","nuevo","Implemented React atom under the [approved v0.1 contract](components/embed/v0.1/spec.md): a named, reserved frame for external content. A required `label` names a native `iframe` (http(s) `src`, mounted after hydration so no request starts on the server) or a `group` of consumer `children`; a decorative Spinner shows while the frame loads and a consumer `fallback` replaces unusable content. Material is the Surface well recipe. The component loads no script and decides nothing about consent, cookies or URL trust; fixed `ratio` (default 16/9), no stylesheet, ref or asChild. Browser and packed-consumer verification remain pending until observed."),
```

## 6. Stories and Controls

`Atoms/Embed`, `Meta<typeof Embed>` with autodocs and no manual `argTypes` or `play`; English JSDoc (`## Description`, `## Dependencies` for AspectRatio, Spinner and the Surface `well` recipe with no new Radix primitive, and `## Usage guidelines`). Required and example args only; `Default` never replaces the documented `ratio` and `loading` defaults. The file needs `/// <reference types="vite/client" />` as `PhotoFrame.stories.tsx` has. No story requests third-party content: the frame stories use the existing same-origin fixture `docs/components/photo-frame/v0.3/fixtures/diagnostic.svg?url` (imported by five stories today; D5), and every link in story content is a relative or fragment `href`.

- `Default`: frame branch, `label` and the fixture `src`, plus `onLoad: action('onLoad')` from `storybook/actions`. The loading state is transient against a local file; VIS-01 stalls the request with test tooling instead.
- `Ratios`: four embeds in a grid (16:9, 4:3, 1:1, 9:16) with the same fixture, each named by its `label`, plus one deliberately unrepresentable `ratio={0}` that falls back to 16/9.
- `ScriptEmbed`: content branch with static `children` standing for what a provider script would fill (a post-like block of `Text` and `Link`), `ratio` 4:3; the JSDoc states that the component never loads a script and that the app loads it after consent and isolates the subtree.
- `Fallback`: no `src`, with a `fallback` of a short sentence and a relative link to the original (`Stack`, `Text`, `Link`); the JSDoc states that copy is consumer-owned and localized.
- `OnGrafito`: the `ScriptEmbed` composition inside `SectionShell register='grafito'`, so VIS-03 is reproducible. A capture there is an observation under story conditions, not the website's page.

Controls: the registered enhancer shows `label` as text, `ratio` as a number, `src` as text and `loading` as a select, and `children` and `fallback` as disabled controllers with their reasons pointing at `ScriptEmbed` and `Fallback`; no optional argument is injected. Real browser Controls are checked in §9, not inferred from tags.

## 7. Changelog entries

Under the existing sections, because 0.11.0 was never packed (S2): `packages/ui/CHANGELOG.md` `## 0.11.0` → `### Added`, and `packages/system/CHANGELOG.md` `## 0.13.0` → `### Added`. The ui bullet goes first, as the section lists newest first.

```md
<!-- packages/ui/CHANGELOG.md, ## 0.11.0, ### Added -->
- `Embed` reserves the proportion of external content such as a video or an X post in a recessed frame and gives it a
  required accessible name (`label`). It renders a native `iframe` for an http(s) `src`, mounted only after hydration so
  the server never starts the request, or consumer `children` for embeds that a provider script fills, with a decorative
  loading state while the frame loads and a consumer `fallback` when there is no usable content. The component loads no
  script and decides nothing about consent, cookies or URL trust: mount it only after your own consent decision, choose
  `sandbox`, `allow` and `referrerPolicy` yourself, and pick a `ratio` that fits the content (default 16/9; taller
  output is clipped). It has no variant, ref or `asChild`. (#574)
```

```md
<!-- packages/system/CHANGELOG.md, ## 0.13.0, ### Added -->
- The source-derived artifact and reference include `Embed` (its props and static recipes) and the
  `unavailable-content-fallback` naming concept (proposed, with no approval receipt unless one is recorded). (#574)
```

`(#574)` cites a fully resolved issue, as [versioning](../../../distribution/versioning.md) requires for consumer requests (D6). The sections are versioned, so `release:pack` reads the citation into `release.json` `resolves` when 0.11.0 is packed; this PR makes no version bump, `release:pack` or tag. If the owner narrows the delivery, write `Refs #574` instead. Other round-5 lanes add bullets to the same sections: whichever PR merges second keeps every set of bullets.

## 8. Checks to run

All commands are **future**, run from the repository root, one at a time in the foreground, and only with explicit authorization. None has been run for this plan. The first command is the identical RED and GREEN runner.

```sh
pnpm exec vitest run packages/ui/src/atoms/embed --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/primitives/aspect-ratio packages/ui/src/primitives/surface packages/ui/src/atoms/spinner packages/ui/src/atoms/photo-frame --maxWorkers=2 --no-cache --configLoader runner
pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner
git diff --stat -- packages/ui/src/primitives packages/ui/src/atoms/spinner packages/ui/src/atoms/photo-frame packages/tokens packages/ui/src/styles/legacy
pnpm typecheck
pnpm lint
pnpm props:docs
pnpm props:check
pnpm test:props
PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py
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
git status --short
```

The `git diff --stat` scope check must print nothing, and the final `git status --short` must list only §2 paths: no scratch, cache or `.playwright-mcp/` output. `pnpm build` writes package outputs and regenerates the artifact, so the freshness checks run again after it. `pnpm test:package-consumption` creates isolated fixtures and may install dependencies, so it needs D4 and a verified offline cache; it must exercise React 18.3.1 and 19.3.0 with shipped tokens and UI CSS and no Tailwind compiler, and any unavailable matrix is recorded as pending. `pnpm test:package-release` is a PRESERVE check on the changelog structure. `pnpm test:mcp` serves the regenerated artifact and checks README examples that drift between releases: re-run it on the base before attributing any failure. The CI gate runs `lint`, `props:check`, `test:props`, `typecheck`, `build`, `test`, `test:cli`, the tokens test, `test:package-exports` and `test:package-consumption`; the artifact checks run here because `@egdev/system` ships, and CI's `test:cli` and tokens tests are untouched by this change. Every result is recorded per command with exit code and test counts in the evidence file; jsdom, docgen and HTML smoke prove no appearance, focus visibility, contrast or screen-reader behavior, and none is claimed.

## 9. Browser and capture procedure

Only after separate permission (D3) to start `pnpm storybook` (it builds tokens first), to use Playwright MCP and to hold or stall a same-origin request, following the [capture guide](../../../design/README.md). Record commit, browser and version, viewport, device scale, theme (dark Grafito), loaded fonts, motion and forced-colors settings, crop and date for every observation. Stories: `atoms-embed--default`, `--ratios`, `--script-embed`, `--fallback`, `--on-grafito`.

1. **Material and geometry (EM-01, EM-02, EM-11).** Root computed style: `surface-0` fill, 1px hairline border, the well shadow layers, 17.6px radius, `overflow: hidden`, no padding. The reserved box height equals width × 9/16 within 0.5px by default and the `Ratios` heights match their ratios; the box is identical before, during and after load and in the fallback state. The only inline style is AspectRatio's Radix-owned geometry. Whether the unloaded frame shows the Spinner through, and which layer paints on top once an opaque document loads, are recorded as observed, not assumed.
2. **Loading state (EM-04, VIS-01).** With the fixture request stalled: `data-state="loading"`, `aria-busy="true"`, a centered and rotating Spinner, no iframe content. On release: `ready`, no `aria-busy`, no Spinner. A changed `src` returns to `loading`.
3. **Hydration (EM-03).** Server markup of the built package hydrated in the page: no iframe and no network request for the `src` before hydration, the request after mount, and no recoverable error.
4. **Fallback and content (EM-05, EM-06, VIS-02).** `Fallback` and `ScriptEmbed` render in the box, clipped by the well when taller; the root is a named `group`.
5. **Accessibility tree and focus (EM-09, EM-10).** Chromium accessibility snapshot: a named frame in the frame branch, a named group otherwise, no live region, the Spinner hidden. A real Tab walk enters the iframe and leaves it, and nothing else in Embed takes focus. Screen-reader output is Not evaluated.
6. **Reduced motion and forced colors (EM-12).** Chromium emulation only: under `prefers-reduced-motion: reduce` the Spinner's animation is `none`; under `forced-colors: active` the well border and the Spinner stay visible. Firefox and a real High Contrast session stay Not evaluated.
7. **Grafito (VIS-03).** `OnGrafito`: whether the `surface-0` well separates from the 50 % grafito background by hairline and inset shadow. A disagreement is a spec question (G5).
8. **Controls (EM-13).** In `pnpm storybook`: the rows of §6, the Docs Default column showing `16 / 9` and `lazy`, no diagnostics.
9. **Captures VIS-01 to VIS-03**, only if authorized: component-zone PNGs under `docs/components/embed/v0.1/` named `<state>--<viewport>--<theme>.png` (for example `frame-loading--1280x900--dark.png`) with `capture.json`, SHA-256 hashes and conditions. They are observed implementation, not approved expected design, until the owner adopts exact hashes. Playwright MCP writes under `.playwright-mcp/`; nothing from it is copied or committed except the requested captures.

**Visual conformity: Not evaluated.** No expected-design source exists for embedded content, and no browser evidence replaces behavior or accessibility tests.

## 10. Commit slicing (about 400 lines each)

Conventional Commits, English, bodies use `Refs #574`. The PR is squash-merged as in the earlier round-5 PRs; the slices exist for review and bisect.

| # | Commit | Contents | Est. lines |
| --- | --- | --- | --- |
| 1 | `feat(ui): add the Embed atom core and its public type (#574)` | `types.ts` (shared part and frame branch), `useEmbed.ts` (label, ratio, root props, protected stripping), `Embed.tsx`, `index.ts`, tests R1, R2, R7; folder not yet exported | ≈ 407 |
| 2 | `feat(ui): mount the Embed frame after hydration with a load state (#574)` | Hook additions (`src` policy, mount flag, load state, three warnings), loading layer and iframe in `Embed.tsx`, tests R3, R4, R8 | ≈ 302 |
| 3 | `feat(ui): add the Embed content branch and fallback state (#574)` | Content branch type, branch precedence, fallback and empty warnings, tests R5, R6, R9 | ≈ 238 |
| 4 | `feat(ui): publish Embed with stories, scanned CSS and metadata pins (#574)` | Stories, barrel, `compiled.css`, `.storybook/main.ts` and `preview.css`, docgen and Controls pins, catalog row, regenerated catalog, artifact and `system.md` | ≈ 341 (+ generated) |
| 5 | `feat(ui): check Embed in the packed build (#574)` | `package-exports.test.mjs` and `package-consumption.test.mjs` additions | ≈ 265 |
| 6 | `feat(ui): register the Embed naming usages and changelog (#574)` | Registry entry and usages, `prop-naming.test.mjs`, artifact assertions, both changelogs, receipt if D2, regenerated view and artifact | ≈ 179 (+45 with D2) |
| 7 | `docs(embed): record the v0.1 implementation evidence (#574)` | `implementation-evidence.md`, the ODD log, and `capture.json` with PNGs only if authorized | ≈ 126 |

The barrel line and `Embed.stories.tsx` must share a commit (the Storybook MCP contract is two-way), and the artifact and catalog regenerate in the commits that change their inputs so each commit stays green. `pnpm artifact --check` is stale between commits 4 and 6 only for the naming section; if every commit must be artifact-fresh, fold commit 6's regeneration into commit 4. If a whole-repo test unexpectedly fails on the unexported folder between commits 1 and 4, merge the affected commits instead of weakening the test. A failing RED commit is never made.

## 11. Estimated changed lines

About **1,930 changed lines**: ≈ 1,860 hand-written (component files ≈ 1,100: `types.ts` 150, hook 190, JSX 45, index 2, tests 560, stories 150; pins, harnesses and registry tests ≈ 560; registry JSON, wiring, catalog source and changelogs ≈ 75; evidence and log ≈ 126) and ≈ 70 generated (`docs/prop-naming.md` ≈ 25, `design-system.json` 2, `system.md` ≈ 30, catalog ≈ 15). About 1,900 with the D2 receipt. For calibration, the StepMeter atom in `ea26078` was 786 lines of component files (stories 110, tests 502, types 71, hook 86, JSX 15, index 2) against ≈ 1,100 estimated here for an atom with a union API, a URL policy, a hydration-safe mount and a second branch. Treat the range as 1,600 to 2,100.

## 12. Risks

- **Risk 1 — jsdom and iframes.** Whether jsdom fires `load` for an iframe with a `src`, never, or asynchronously is not verified here. Tests assert `loading` before any load, drive `ready` only through `fireEvent.load`, and pin the observed behavior at the first GREEN run. Any needed stub is a test-only spy restored in `afterEach`, never a production hook.
- **Risk 2 — Hydration and StrictMode.** The mount flag is an effect, so the first client render equals the server markup, but React 18.3.1 and 19.3.0 must both be proven (D4). Warnings fire in render and can fire twice under StrictMode: tests assert the exact messages, not call counts.
- **Risk 3 — `Children.toArray` edge cases.** The spec defines renderable children as a non-empty `Children.toArray`. Whether an empty string child counts is not decided by the spec: the test pins the observed `toArray` result and does not choose.
- **Risk 4 — Union types and docgen.** Two-branch JSDoc merges in docgen, so the merged `children` row's requiredness is read from the real extraction. The AST own-declaration test visits every `PropertySignature`, so the `never` placeholders each need JSDoc and one `@control`. The `loading` options come from TypeScript literal interning, hence the Embed row goes last in the `components` list and the pins read the observed order.
- **Risk 5 — Registry freshness chain.** Three usages bind the whole-file hash of `types.ts`: finish source, lint, hash, registry, regenerate, check; any late edit repeats it. The absolute counts (185, 182) move with the merge order of the other round-5 lanes.
- **Risk 6 — Parallel lanes, shared files.** `prop-naming.json`, `prop-naming.test.mjs`, `docs/prop-naming.md`, the artifact, `system.md`, `catalog_data.py` with its generated files, both changelogs, the barrel, `compiled.css`, `.storybook/*` and the docgen and Controls pins are also touched by other lanes. Expect rebase conflicts; regenerate generated files instead of hand-merging and re-hash `types.ts` after rebasing.
- **Risk 7 — Story fixture.** The shared diagnostic SVG declares a fixed 1000 × 1000 size, so inside a 16:9 frame the browser may scroll or crop it. The stories document the clip. A HTML fixture is a separate decision (D5).
- **Risk 8 — Real providers.** X widgets and video players are not measured: heights, `load` timing and blocked-frame behavior. `ready` only means the native `load` fired, never that content rendered, and a fixed ratio clips taller output (OQ-2 a).
- **Risk 9 — Material on grafito.** Separation of the `surface-0` well from the 50 % grafito background and the well shadow's paint order under an opaque frame are reasoned, not observed (VIS-03). A poor result is a spec question, not a plan tweak.
- **Risk 10 — Contrast and assistive technology.** The 7.17:1 figure is hand-reasoned from the token comment, not measured. Screen-reader output, zoom and reflow of the fallback, RTL, Firefox and real High Contrast stay Not evaluated.
- **Risk 11 — Packed harness.** `test:package-consumption` needs an offline cache and permission to install; without them the React 18.3.1 and 19.3.0 matrix stays pending, which blocks "verified in packed consumers" claims, not the rest.
- **Risk 12 — Lint and the iframe name.** The `title` is an explicit JSX attribute from the hook so the name source is visible in `Embed.tsx` and a rule such as `useIframeTitle` stays satisfiable if it is enabled (the a11y group is currently empty in `biome.json`). Biome runs on the final files and any disagreement is reported, not silenced.
- **Risk 13 — Mounting is the request.** The component cannot stop a request it was asked to make: consent is the app's, and the stories and the changelog say so. This is the spec's non-goal, not a defect to fix here.
- **Risk 14 — Spec wording nit, no change requested.** EM-03 lists `loading` among the attributes that "pass through unchanged and none is defaulted", while the API table and OQ-5 default it to `lazy`. The plan reads it as: `loading` defaults to `lazy`, and `allow`, `allowFullScreen`, `referrerPolicy` and `sandbox` are never defaulted.

## 13. Pending owner decisions

No Material recipe, token or dependency decision is pending: the well recipe, the utility inventory and the defaults were approved with the spec.

1. **D1 — Plan approval (G1).** Approve this exact plan and the §2 edit surfaces, including the parent-owned integration files, or revise it. The spec approval does not cover it.
2. **D2 — `unavailable-content-fallback` receipt (recommended: yes).** The owner's OQ-6 (a) answer decided the convention on the spec's own wording of `meaning`, `whenToUse` and `avoid`, which §5.1 copies unchanged. A receipt is the separate record that binds those exact bytes. If granted, the parent records `docs/components/embed/v0.1/prop-naming-approval.json` and the entry becomes `approved`. If declined or unanswered, it ships `proposed` with `approval: null`, which other entries already do; both paths are valid and green.
3. **D3 — Browser observations (recommended: yes).** EM-04's loading state, EM-09's focus walk, EM-10, EM-11's computed style, EM-12 and the Controls widgets need a local server, a real Chromium and a stalled request, each with separate permission. Without them those criteria stay **Not observed**.
4. **D4 — Packed consumers (recommended: yes).** `pnpm test:package-consumption` packs and installs isolated fixtures and needs install and network permission and a known cache; without it EM-14's React 18.3.1 and 19.3.0 evidence stays **Not observed** (offline alternative: `EGDEV_CONSUMER_OFFLINE=1`).
5. **D5 — Story fixture (recommended: reuse the existing SVG).** `docs/components/photo-frame/v0.3/fixtures/diagnostic.svg?url` needs no new file or provenance. The alternative is a locally authored HTML fixture under `docs/components/embed/v0.1/fixtures/`, which needs separate authorization and a check of how the Vite dev server serves an HTML file.
6. **D6 — Issue citation (recommended: `(#574)`).** The changelog entries cite `(#574)`, which marks the issue fully resolved. If the owner reads OQ-2 (a), the fixed ratio with growth only on evidence, as leaving #574 open, write `Refs #574` instead.
7. **D7 — Captures (VIS-01 to VIS-03).** Separate authorization and read-only source access; outside this plan.

Plan-level choices a reviewer can veto at G1: a non-string `src` from an untyped caller is treated as unparsable (fallback plus the same warning), because the spec is silent; the derived `loadedSource` plus `key={src}` mechanism for the fresh frame; `loading` is declared as an own prop so its constant default shows in Docs, while the other five frame attributes are native picks documented through `documentedNativeProps.embed`; the `OnGrafito` story; reusing the diagnostic SVG; the explicit iframe `title` attribute.

## 14. Stop

This plan authorizes nothing until G1. No source, test, token, dependency, registry, artifact, catalog, capture, release or Git action is taken or implied. Stop and return the evidence to the owner if: a utility does not emit or computes differently from the spec's block 6; AspectRatio's reserved box does not follow `ratio`; the iframe request can start before mount and the hook cannot prevent it; the `src` policy would have to deviate from OQ-4; `props:check` fails for a reason other than stale revisions, or `unavailable-content-fallback` would be marked approved without D2; docgen or Controls report diagnostics; the artifact exceeds 768 KiB or its diff shows sections this plan does not expect; an existing AspectRatio, Spinner, Surface or PhotoFrame case must change to pass; a whole-repo test fails on an unexported component and cannot be fixed without weakening it; or a token, dependency, stylesheet, inline style beyond the Radix-owned geometry, `!important` or Radix package would be needed.
