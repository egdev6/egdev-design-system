# PreviewFrame v0.1 — implementation plan

**Status: owner-approved, with the decisions below.** This is O9 of the organisms build, covering S2–S4. The authoritative contract is [issue #127](https://github.com/egdev6/egdev-design-system/issues/127), v0.1 canonical SHA-256 `7778191c6cb19c67f2ef98b5581ab01a2a0ec916467f1d3d21949df509dbc7dd`. Its owner full-contract approval comment supersedes historical Draft/Pending identity and approval headers, not the separate plan, token, geometry, dependency or registry gates. Its scoped visuals are approved, not implementation conformity. This plan does not alter the contract or grant any permission. No implementation or visual evaluation has occurred.

VIS-01 is the actual StageFrame source board at `docs/design/foundation-boards/v2026-10-18-wave3/StageFrame.png`, SHA-256 `7147851ebb391a32114e90501aa89c8c5432c2b807a296a189ac3e8479fe2a17`, matching the local bytes and #127: StageFrame is the Foundation predecessor, renamed PreviewFrame. The substituted neutral photo placeholder and its content are not expected component design. Capture: Chromium 148/Linux, 1280×900, DPR 1, dark, fonts loaded, reduced motion false; see `capture.json`. VIS-02 is `docs/design/foundation-boards/v2026-10-18-wave3/specimens/preview-frame--specimen.png`, SHA-256 `aa863f6e2a9cd34d7a7468787776c38d72bdda95ac053e8f5a52d8344dcc78ab`; consult issue capture evidence for its distinct conditions. Compare only the scoped scenarios and allowed differences in #127. Static boards prove neither accessibility nor React behavior.

## Owner decisions and amendments

- L11: "Fondo liso por ahora" — no `--pattern-grid` token; `grid` renders like `plain` until approval. This is a known visual difference.
- L15: "Aprobar excepción acotada (Recomendado)" — exactly the four static zone utilities `left-[var(--eg-zone-x)]`, `top-[var(--eg-zone-y)]`, `w-[var(--eg-zone-w)]`, `h-[var(--eg-zone-h)]`, reading validated, clamped, unit-bearing percentage custom properties; no other inline style.
- L15: "Caer a 16:9 (Recomendado)" — non-positive, non-finite and unrepresentable ratios fall back to 16:9 with a development warning, using the existing AspectRatio predicate exactly (`Number.isFinite(ratio) && ratio > 0 && Number.isFinite(100 / ratio)`); a finite reciprocal is representable even when unusably tall, and the primitive is unchanged.
- The contract example `Button ghost sm` uses `Button neutral sm` because ghost was retired in #235.

Historical proposal wording below is superseded by these decisions.

## Proposed files and boundaries

After separate approvals, create exactly these six meaningful files under `packages/ui/src/organisms/preview-frame/`:

- `types.ts`: public types, English JSDoc/Controls and static token-backed CVA recipes for root, caption, canvas, safe area, zone, label and footer.
- `usePreviewFrame.ts`: ratio fallback, validated/clamped zone geometry and development warnings, slot presence, CVA and `cn()` composition.
- `PreviewFrame.tsx`: JSX only, consuming the hook.
- `PreviewFrame.test.tsx`: behavior, accessibility and composition tests.
- `PreviewFrame.stories.tsx`: `Organisms/PreviewFrame` stories and autodocs.
- `index.ts`: named component and type exports; internal recipes remain internal.

**No stylesheet**, extra internal module or legacy part class. Integrate named exports in `packages/ui/src/index.ts`; update the catalog through `scripts/catalog_data.py` and its generator only if separately authorized and needed, and naming registry/source-generated documentation through its approved workflow. Those are future integration surfaces, not edits authorized by this planning task. Preserve existing legacy CSS and raw consumers. Root is `figure.eg-stage`, not `eg-preview-frame`; do not emit legacy `eg-stage__*` or modifier classes.

Compose the existing AspectRatio primitive for geometry and existing `surfaceVariants({ tone: 'well', padding: 'none', radius: 'lg' })` on the separate outer canvas wrapper. AspectRatio's inner class is alignment-only; the outer wrapper owns paint, clipping, isolation and width. Use Text eyebrow inside a first-child `figcaption`; keep actions outside the caption, in the second grid column, and footer below the well. Canvas layers are children, zones, then safe area. PhotoFrame is an editorial image/crop/caption atom, not the workspace or a base to duplicate; both use AspectRatio. Consumer-owned Button, IconButton, Badge/Chip or ButtonGroup may populate slots; PreviewFrame does not import or synthesize those controls. No Tabs, ratio switcher or Radix Toolbar is part of this contract. Slot controls use their own native tab order, not an invented toolbar role or roving focus.

**Dependency verdict: no NEW DEPENDENCY.** `packages/ui/package.json` already directly lists `@radix-ui/react-aspect-ratio` 1.2.0; use the system primitive rather than a second implementation. Tabs is installed but unused; Radix Toolbar is neither installed nor needed. Verify exports/availability at implementation time; types files demonstrate APIs but do not establish built-package consumption.

## Public API, behavior and naming

| Contract API | Behavior and naming registry entry |
| --- | --- |
| `children?: ReactNode` | Decorative visual content; consumer positions it in percentages. Empty when absent. |
| `ratio?: number` | Width / height; default `16 / 9`, invalid non-positive or non-finite → `16 / 9`; `aspect-ratio`. No named presets or internal switching. |
| `variant?: 'grid' | 'plain'` | Default `grid`; plain removes only the reticle, not the well; `visual-treatment`. |
| `safeArea?: boolean` | Default true; fixed 5% inset dashed decorative guide; `safe-area-guide`. |
| `zones?: PreviewFrameZone[]` | Ordered named guides, default empty; `guide-zones`. Each has unique `id`, non-empty `label`, numeric percent `x`, `y`, `width`, `height`, optional `tone: 'info' | 'warning'` default info; `tone` uses `surface-material-tone`. |
| `figureCaption?: string` | Optional native visible figcaption, no element when absent; `figure-caption`. |
| `actions?: ReactNode`, `footer?: ReactNode` | Optional trailing controls and lower bar; `trailing-actions`, `panel-footer`. |
| Native figure props and `className` | Forward compatible attributes; root `className` is for outer layout/width only, merged last via `cn()`. No ref, `asChild`, part class overrides, controlled state or events. `twMerge` does not resolve all CSS/legacy conflicts. |

Registry [source](../../../../skills/_shared/prop-naming.json) and [generated reference](../../../prop-naming.md): the three concepts first introduced by this contract are `safe-area-guide`, `guide-zones`, `figure-caption`; all three are already marked **approved** in the current registry with `docs/decisions/prop-naming-organism-specs-approval.json` references and empty usages. The issue describes that receipt as assistant-applied under delegation, not independent per-payload owner review. Do not claim they are unregistered, create duplicates, promote status, or infer additional approval. `children`, native props, `className` and zone identity/geometry fields are not new conventions. Once code and registry changes are authorized, inspect `PreviewFrameProps`/`PreviewFrameZone`, append usages with the actual whole-file SHA-256, regenerate the reference and run `pnpm props:check` and `pnpm test:props`; no fabricated source evidence.

Width changes retain the output ratio; content scales only insofar as the consumer sizes/positions its own content proportionally. There is no automatic scaling of a fixed-resolution DOM, zoom, resolution selector, device preset or replay logic. A portrait example uses `ratio={9 / 16}` and root `max-w-90 mx-auto`, not a height-cap prop. The API has no iframe/src mode: children are arbitrary **non-interactive** decorative content inside `aria-hidden`. An iframe is focusable and may expose interactive content, so it is not an approved canvas example or supported interactive preview; a separate accessible iframe mode requires a contract amendment, including a meaningful iframe title and focus policy. Hosts own replay, motion/reduced-motion final state and configuration outside the hidden canvas.

Clamp finite zone x/y to [0, 100], width to [0, 100 − x], height to [0, 100 − y]; omit non-finite or zero-area geometry with a development warning. Consumers supply unique IDs and non-empty labels. Test visible text and both tone families; guides must not depend on color alone. Before coding, reconcile the actual AspectRatio primitive's additional fallback for unrepresentable reciprocal percentages with #127's finite-positive ratio promise; do not silently accept a square for an otherwise valid PreviewFrame ratio.

## Material and geometry gates

Root grid uses `grid-cols-[minmax(0,1fr)_auto]`, token gap and minimum-width utilities; caption and actions share the first row, canvas/footer span both columns. Compose the Surface well recipe (surface-0, hairline, `--shadow-well`, `--radius-lg`) with `overflow-hidden isolate`; do not clone the Surface recipe or put paint/clipping on AspectRatio. Bars wrap and use token label typography and muted foreground. Safe guide uses `inset-[5%]`, dashed hairline-strong border and token radius. Zone labels use canvas background, token type/spacing; info/warning dashed borders and translucent fills follow #127 D18. Static CVA classes and per-part `cn()` must remain Tailwind-scannable; no inline appearance, handwritten shadows, color mixes or gradients.

**Token gap:** #127 proposes `--pattern-grid` as the two-layer 4% foreground grid, sized by existing `--effect-grid-size`. This plan makes **no token change**. Ask for specific token approval separately; if declined, the approved contract explicitly renders `grid` like `plain` until a token is approved. Do not reuse the ambient `--effect-grid-opacity` (0.025) or handwrite the gradient. Capture and report this fallback as a known visual difference; no claim of reticle parity.

**Geometry gate:** separately approve the narrowly scoped D10 exception before implementation: four static `left-[var(--eg-zone-x)]`, `top-[var(--eg-zone-y)]`, `w-[var(--eg-zone-w)]`, `h-[var(--eg-zone-h)]` utilities read only validated, clamped, unit-bearing percentage custom properties. No dynamic class interpolation or broader inline geometry/appearance permission. The parent must arrange any necessary shared-contract/AGENTS wording separately. A plan approval alone is not that confirmation.

## Accessibility and integration

A supplied caption is the figure's native name; otherwise the host supplies `aria-label` or `aria-labelledby`. Actions remain outside `figcaption`, so their names do not enter it. Canvas, guide and zone content are hidden from assistive technology and must contain no focusable descendants; `aria-hidden` does not itself remove focusability, and no `inert` is promised. Put meaningful configuration/results and interactive controls in the host form or slots. Test keyboard traversal of actions and footer in DOM order, visible focus, naming and absence of added stops. No motion is owned here. For touch, consumer controls need adequate target sizes.

Integrate the exported component/types in the package barrel; preserve the established `eg-stage` marker and verify actual computed styles with legacy CSS loaded, since `cn` cannot override selectors by string order. Stories use only real component APIs: current `ButtonVariant` has no `ghost`, despite #127 D15's text-action example; do not silently invent one. Resolve this example conflict before selecting a replacement. IconButton does support `ghost sm`; use a non-empty label. Check the parent integration sequence and actual consumer package exports rather than assuming historical issue statements about which primitives are installed.

## Test-first and evidence plan

Following all gates and a separately authorized implementation scope:

1. **RED:** create public-interface tests for AC-01–09 before behavior: defaults and 16:9 fallback (zero, negative, NaN, infinity), passed ratios including portrait and extreme finite values; no legacy parts; caption first-child/name and absent-caption native naming; slot presence/order; hidden decorative content and keyboard order; safe guide toggle and plain/grid fallback; zone edge/clamp/overflow/non-finite/zero-area warnings, visible labels and tone; layout merge and forwarding. Cover actual effects, not whole-class snapshots. Observe and record intended failures.
2. **GREEN:** implement minimally using the existing primitive and recipe; run focused tests. Confirm previous behavior of touched reusable primitives with their existing public-interface tests, and add preservation coverage where shared code is actually changed. Avoid changing shared code; if unavoidable, follow the shared-code differential-check policy and seek scope approval first.
3. **PRESERVE/REFACTOR:** keep focused tests green; check compiled static CVA utilities, computed geometry/legacy cascade and accessible names/tab order in a real browser. Test long caption/footer wrapping and responsive width/portrait geometry. Validate approved token or plain fallback and the geometry exception with real CSS, not just DOM classes.
4. Run the separately authorized full local Verify set, including `pnpm props:check` and `pnpm test:props`, and actual packed React 18/19 consumer rendering with supplied built CSS and no consumer Tailwind compiler. Record commands and results; no installs/builds or tests are authorized by this document. Compare implementation captures against VIS-01/VIS-02 under equivalent recorded conditions, within approved differences; otherwise report visual conformity **Not evaluated**. Proceed to parent-owned RDD assessment and delivery only after required verification.

## Stories and Controls

Provide `Default`, `Plain`, `Zones`, `Portrait`, `Variables`, `NoSafeArea`, `Unnamed`. Default must not replace runtime defaults with args; use required/example args only. Show consumer-owned slots and proportional decorative content, never focusable canvas controls. Storybook 10 uses `Meta`/`StoryObj` from `@storybook/react-vite`, autodocs and English text, without manual `argTypes` or `play`. Tag all own props in `types.ts`: number for ratio, select for variant, boolean for safeArea, text for figureCaption; `false` with concrete reasons for ReactNode slots/children and the complex zones array. Record actual constants only in `@default`. Verify real docgen, zero owned metadata diagnostics, installed extraction/enhancer/inference pipeline, then actual browser widgets; metadata alone is not widget evidence.

## Risks and owner questions

1. Approve or decline this implementation plan separately from the approved contract?
2. Approve `--pattern-grid` in token source as specified in #127 D12, or decline and use the contracted plain fallback? Any token mutation requires its own authorization.
3. Approve the exact PreviewFrame-only four-property zone geometry exception in D10 and the separately coordinated shared-policy wording?
4. #127 promises all finite positive ratios but current AspectRatio also falls back for unrepresentable reciprocals. Should the contract adopt the primitive's square fallback for this exceptional case, or should a separately approved compatible solution preserve the PreviewFrame promise? Do not change the primitive silently.
5. #127 D15 calls for `Button` `ghost sm`, but the actual Button type exposes only `primary`, `secondary`, `neutral`, `dark`. Approve a contract/example amendment using an existing treatment (e.g. `neutral sm`), or authorize a separately scoped Button solution; until resolved do not claim that example is implementable as specified.

Further risks: visual parity and assistive-technology behavior are untested; focusable descendants inside hidden canvas are a consumer hazard; extreme ratios, legacy cascade, generated CSS, package exports, contrast and React 18/19 compatibility need observed evidence. Contract changes, new iframe behavior, dependency additions or registry modifications require their own gates.
