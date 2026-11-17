# Tabs — outline variant amendment

- **Version / status:** v0.3 — **Draft — not approved**.
- **Amends:** [Tabs v0.1](../v0.1/implementation.md), the [v0.2 layout amendment](../v0.2/full-width-wrap-amendment.md) and the Tabs portion of [#426](../../../foundation/semantic-roles-adoption.md). This responds to [#464](https://github.com/egdev6/egdev-design-system/issues/464); it authorizes no implementation.
- **Correction:** owner decision L6 supersedes the earlier `selectedTone` proposal: the Nexo look is a separate value of the existing `variant` prop. No `selectedTone` prop is proposed (`odd/tasks/nexo-requests-464-466-specs.md:9,31`).
- **Approval / recovery:** Pending explicit owner approval of this snapshot and identified visuals. Prior approvals do not approve this variant, token changes or its implementation plan.
- **Snapshot identity:** `version: v0.3`; `contentSHA256: Pending before finalization`; `visualHashes: VIS-01 Pending, VIS-02 Pending, VIS-03 Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/107`; `latestPublishedComment: Pending`. #464 is the request, not a new canonical component contract.
- **Hash definition:** SHA-256 of the UTF-8 payload from `## 1. Purpose and scope` through EOF, LF line endings and the final newline. Tracking metadata above that heading is excluded. Finalize before publication; approval binds the digest and identified visual hashes.

## 1. Purpose and scope

- **Need:** propose `variant='outline'` for the Nexo look: a rounded bordered dark track, a selected rounded box with a neon-accent border, dark chip-like gradient over surface-1, edge highlight and bold default-foreground label; unselected labels are secondary and have no selected box. The owner's supplied screenshot is described in the handoff; its image bytes, provenance and conditions were not available for independent measurement in this batch.
- **Compatibility:** existing `underline` and `segmented` rendering, the default `underline`, selection, keyboard and existing `fullWidth` / `labelWrap` behavior must not change. The new variant is opt-in; no Quorb or other consumer changes automatically. Do not silently migrate Nexo or remove its CSS.
- **Cataloging:** extend the existing exported `@egdev/ui` molecule rather than create a separate widget. Reuse without a variant cannot obtain this treatment through the public parts; consumer selectors are not a supported composition API. The interaction and tab/panel responsibility are unchanged.
- **Current evidence:** `packages/ui/src/index.ts:116-117` and `packages/ui/src/molecules/tabs/index.ts:1-3` export Tabs, its types and root recipe. React anatomy, props, hook, tests and stories are in `packages/ui/src/molecules/tabs/Tabs.tsx:1-34`, `packages/ui/src/molecules/tabs/types.ts:5-104`, `packages/ui/src/molecules/tabs/useTabs.ts:23-65`, `packages/ui/src/molecules/tabs/Tabs.test.tsx:114-179,246-307,525-596` and `packages/ui/src/molecules/tabs/Tabs.stories.tsx:30-140`. Current selected segmented paint is `packages/ui/src/molecules/tabs/types.ts:153-158`; `outline` is not shipped.
- **Historical evidence:** in Nexo commit `bb187b37702e641a25c3fb3e3ab9a6cfb004eb9b`, `apps/hub/src/App.tsx:353-356` already uses DS `Tabs variant='segmented'` with Nexo's own theme overrides; `apps/hub/package.json:15-17` pins DS commit `085b46e`. Thus “before DS” is not literally an uncustomized, non-DS component in the inspected history: it is the **pre-#426 Nexo look on DS Tabs**. The removed rules are `bb187b3:apps/hub/src/theme/family.css:41-51` and `bb187b3:apps/hub/src/style.css:29-35`; Nexo commit `a00831c` removed them during adoption III. Source values and token mappings are in section 6. This historical code and the owner's description are evidence, not a captured or approved v0.3 visual reference.

## 2. Anatomy and composition

| Part | Responsibility / existing primitive | Proposed change |
| --- | --- | --- |
| Root | Radix Tabs Root, native `div` and outer layout | Unchanged. |
| List | Named Radix Tabs List; segmented composes a Surface well | `outline` also proposes a rounded, bordered Surface well; no new public part API. |
| Trigger / count | Radix Trigger button, text and optional owned counter | `outline` supplies selected and unselected treatment; the count and its `TabsItem.tone` remain independent. |
| Panel | Radix Content for each item | Unchanged; inactive contents unmount while wrappers remain. |

`@radix-ui/react-tabs` retains selection, keyboard, focus and relationships (`packages/ui/src/molecules/tabs/Tabs.tsx:1-34`). Preserve `eg-tabs`, public exports and the root recipe; no new `asChild`, refs, exposed parts, manual state machine or mirrored state classes. Keep existing legacy styles and consumers.

## 3. Public API

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `variant` | proposed `'underline' \| 'segmented' \| 'outline'` | No | `'underline'` | Add an opt-in full visual variant. Existing two values and their defaults are unchanged. |
| `items` | `TabsItem[]` | Yes | No default | Unique non-empty item `value`, text `label`, `content: ReactNode`; optional `count`, counter `tone: 'neutral' \| 'danger'`, and `disabled`. At least one item must be enabled. |
| `label` | `string` | Yes | No default | Tablist accessible name. |
| `value` / `defaultValue` | `string` / `string` | No | Controlled value, otherwise explicit default, otherwise first enabled item | Existing selection contract. |
| `onValueChange` | `(value: string) => void` | No | No callback | Existing user-driven request; changing variant or layout alone emits no selection event. |
| `size` | `'md' \| 'sm'` | No | `'md'` | Existing underline sizing remains. Proposed `outline` uses the segmented fixed dimensions, subject to visual review. |
| `fullWidth` / `labelWrap` | `boolean` / `boolean` | No | Both `false` | Existing `underline` / `segmented` behavior is unchanged. Proposed reuse on `outline` requires the applicability decision below. |

**Prop-naming / value lookup:** the [registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md) use approved `visual-treatment` → `variant` for component-specific visual treatments, explicitly including outline or segmented (`skills/_shared/prop-naming.json:984-992`). Existing usages include `SocialLinksVariant ('outline' | 'ghost')`, `IconButtonVariant (... | 'outline' | ...)`, and Tabs' current `'underline' | 'segmented'` (`prop-naming.json:1040,1180,1219-1226`). Proposed value **`outline`** describes this complete bordered treatment and reuses that existing convention; it is not a new global convention or semantic color tone. `TabsItem.tone` remains the counter-only `surface-material-tone` usage (`prop-naming.json:1311-1319,1487-1494`). The earlier `selected-state-treatment` proposal and `selectedTone` property are withdrawn, not registry entries. The convention approval does not itself approve this Tabs value or spec.

Reviewed existing usage: `source: { path: 'packages/ui/src/molecules/tabs/types.ts', symbol: 'TabsProps', revision: 'sha256:5de3e398e36e462dae3ab06258efa69114ac790fcc2ac790acf306b07899b5fd' }`. This current symbol and `TabsVariant` do **not** yet contain `outline`; review and rehash any future registry usage after implementation. No registry or generated-view edit is made in this batch.

**Native props / refs and compatibility:** existing `Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'defaultValue' | 'dir' | 'onChange'>` stays unchanged; `defaultValue` is the selection prop. Root `className` is last-merged for outer margin, width and grid placement, not arbitrary part/appearance overrides; `cn`/`twMerge` do not promise universal cascade precedence. No ref, `children` or `asChild` API is added. Controlled/uncontrolled behavior and existing exports remain (`useTabs.ts:37-43`; `Tabs.test.tsx:164-179`); React peer compatibility needs the existing packed-consumer checks.

**Layout applicability decision:** `fullWidth` and `labelWrap` are currently segmented-only (`types.ts:93-104`), while the historical Nexo two-tab track was stretched/equal (`bb187b3:apps/hub/src/style.css:30-33`). Owner options are **A)** extend the same independent opt-ins and v0.2 fit/overflow/focus-reveal behavior to `outline`, without changing either existing variant; or **B)** make `outline` fill its host with equal-fit triggers and scrolling on overflow by default, while leaving both props segmented-only and ineffective for `outline`. Option A changes applicability; option B changes only the new variant's proposed default layout and does not provide wrapping. Neither is approved or assumed.

## 4. Behavior

| Initial state / action | Proposed observable result | Event |
| --- | --- | --- |
| Omit `variant`, or use `underline` / `segmented` | Preserve existing output, defaults, focus and behavior. | Existing selection requests only. |
| Use `outline` | Render the bordered well with selected and unselected appearances from section 6. Selection transfers the selected treatment to the newly active trigger. | Existing Radix user-driven selection request only. |
| Switch variants without changing the value | Keep selection, panel relationship, counts and focus ownership; no added live announcement. | No selection event solely from presentation change. |
| Use either layout option with existing variants | Preserve all v0.2 behavior, including equal columns when they fit, overflow when they do not, and focus reveal. | None solely from layout. |
| Use either layout option with `outline` | Proposed same behavior as segmented; applicability remains an owner decision. | None solely from layout. |
| Click or navigate, including disabled items | Retain automatic horizontal activation, roving focus, looping and disabled skipping. | Existing `onValueChange` requests; no new deduplication. |

Consumers supply valid item identities and at least one enabled item, manage persistent panel state and choose an appropriate host size. No new invalid-input, ref or runtime repair policy is proposed.

## 5. Accessibility

The consumer supplies `label`; text and counts contribute to each tab's accessible name. Radix owns tablist/tab/tabpanel roles, `aria-selected`, IDs and relationships. Preserve ArrowLeft/ArrowRight, Home/End, disabled skipping and Tab exit. Tone is not selection, and no new announcement is needed.

For `outline` and the unchanged `segmented` reference, plan WCAG 2.2 AA checks: selected and unselected normal label text against the **rendered composited background** at least 4.5:1 (1.4.3); meaningful selected/control boundary and focus contrast at least 3:1 against adjacent colors where applicable (1.4.11); an actual non-color state cue (1.4.1); and visible, unobscured keyboard focus (2.4.7 / 2.4.11). Test default red and custom dark, bright and light accent inputs, across the gradient and relevant neighboring surfaces, including selected/unselected focused tabs, full-width overflow edges, forced colors and reduced motion. Disabled contrast exemptions do not excuse checking behavior.

The existing segmented base surface-3 against well surface-0 is only 1.35:1 before compositing (`docs/foundation/semantic-roles-adoption.md:45-49,63,89`). Nexo's historical white inset outline and the current accent-colored `--shadow-focus` are different focus treatments; neither is proven compliant for this new composition. The helper's custom opaque-surface bounds do not prove contrast of its translucent gradient or arbitrary hosts (`docs/foundation/runtime-accent.md:27-29,40-46,59`). No rendered contrast or keyboard assessment ran in this batch. If a compliant non-color cue, stronger boundary, alternate focus or ink is needed, return it for owner approval; do not change existing defaults or claim ARIA alone is visual proof.

## 6. Appearance

| Axis | Values / default | Restrictions |
| --- | --- | --- |
| `variant` | `underline` / `segmented` / proposed `outline`; default `underline` | Existing treatments remain exactly unchanged. `outline` is a whole track/trigger treatment, not a selected-tone option. |
| `size` | `md` / `sm`; default `md` | Underline sizing unchanged; proposed outline uses segmented geometry. |
| `fullWidth`, `labelWrap` | `false` / `true`, independently default `false` | Preserve their existing behavior; outline applicability is pending owner confirmation. |

### Source-to-role mapping

The source is the main two-tab view in Nexo `bb187b3` plus its pinned DS source `085b46e`. Resolved values below are historical source values, **not** measured screenshot pixels. Where a proposed role differs or is missing, it is an owner decision rather than an invented token or implementation permission.

| Visual property | Historical value and exact source | Existing token / utility mapping and limit |
| --- | --- | --- |
| Track surface, border and shape | Pinned DS well uses `bg-surface-0 border-border-hairline shadow-[var(--shadow-well)]`, `radius: 'md'` (`085b46e:packages/ui/src/primitives/surface/types.ts:22-30,40-44`; `085b46e:packages/ui/src/molecules/tabs/useTabs.ts:59-61`). Surface-0 = `#141518`, hairline = white 8%, radius-md = 9.6px (`085b46e:packages/tokens/src/theme.css:150-151,166-167,176-177,341-342`). | Reuse `surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' })` on the actual list; current source `packages/ui/src/primitives/surface/types.ts:22-30,40-44`. Hairline is decorative, not a 3:1 control boundary. |
| Track spacing and distribution | DS `gap-0.5 p-0.75`; Nexo stretched the list and used `flex: 1; justify-content: center` on tabs (`085b46e:packages/ui/src/molecules/tabs/types.ts:110-115`; `bb187b3:apps/hub/src/style.css:29-33`). With the historical 3.2px spacing step these are 1.6px gap and 2.4px padding (`085b46e:packages/tokens/src/theme.css:424-425,545-547`). | Reuse static token-backed `gap-0.5` / `p-0.75` for the intrinsic case. The existing `fullWidth` recipe uses `p-1.5` for focus clearance (`packages/ui/src/molecules/tabs/types.ts:119-132`), so option A would differ from Nexo's earlier padding when enabled. Nexo's app-owned margins/band are not a new Tabs styling API. |
| Trigger geometry | `min-h-8.5 px-3 rounded-[calc(var(--radius-md)---spacing(0.75))]` in `085b46e:packages/ui/src/molecules/tabs/types.ts:153-154`; historical tokens imply 27.2px minimum height, 9.6px horizontal padding and 7.2px radius (`085b46e:packages/tokens/src/theme.css:341-342,424-429,545-547`). | Reuse those existing static token-backed utilities for `outline`, subject to actual browser/target-size review; do not copy numerical pixels into new utilities. |
| Inactive tab | Transparent background; `--color-fg-secondary` for text; transparent 1px border from Nexo (`085b46e:packages/ui/src/molecules/tabs/types.ts:139-143`; `bb187b3:apps/hub/src/theme/family.css:41`). Historical secondary = `#CCCCCC` (`085b46e:packages/tokens/src/theme.css:26-27,74-75`). | `bg-transparent`, `border-transparent`, `text-fg-secondary`; no visible selected box. Preserve hover, disabled and count behavior for the new variant as reviewed; existing variants are untouched. |
| Selected border | Nexo `border: var(--border-width) solid transparent`, then `border-color: var(--color-primitive-red-neon)` (`bb187b3:apps/hub/src/theme/family.css:41-44`); default width 1px and neon `#FF0036` (`085b46e:packages/tokens/src/theme.css:30-31,456-457`). | Candidate `border-state-selected` / `--color-state-selected`: default aliases the solid neon and custom `createAccentTheme` supplies its derived accent (`packages/tokens/src/theme.css:181`; `packages/tokens/src/accent.ts:31,119-121,131`). Do **not** substitute `--color-border-brand`: its 45% alpha is a different, decorative color (`theme.css:86-87`). Measure boundary against both sides. |
| Selected surface / gradient | `background: var(--gradient-chip-active), var(--color-surface-1)` (`bb187b3:apps/hub/src/theme/family.css:42-45`). Surface-1 = `#1B1C20`; gradient = `linear-gradient(180deg, rgba(255, 0, 54, 0.24), rgba(255, 0, 54, 0.09))` (`085b46e:packages/tokens/src/theme.css:152-153,168-169,531-532`). | Base `bg-surface-1`; `--gradient-chip-active` is the existing exact **default-red** role (`packages/tokens/src/theme.css:168-169,548-549`). It is fixed red and not returned by `createAccentTheme` (`packages/tokens/src/accent.ts:14-38,114-137`): custom-accent parity is blocked pending the decision below. Opaque `--gradient-state-selected` and neutral `--gradient-sheen` are not equivalent. |
| Selected shadow | Shared Nexo rule specifies `--shadow-edge-strong, --shadow-glow-base` (`bb187b3:apps/hub/src/theme/family.css:42-46`), but the **main tabs** rule overrides it to `--shadow-edge-strong` only to prevent glow bleed (`bb187b3:apps/hub/src/style.css:34-35`). Historical edge = inset `0 1px 0 rgba(255,255,255,0.13)` (`085b46e:packages/tokens/src/theme.css:367-368`). | Exact main-view candidate is `shadow-[var(--shadow-edge-strong)]`. Edge-only conflicts with the general two-layer elevated Material guidance (`docs/MATERIAL.md`); alternatively use existing edge + `--shadow-elev-1` but it is not the exact main-view shadow. Specific recipe/exception requires owner approval. Do not assume the generic glow was visible in the screenshot. |
| Label / typography | Selected uses `--color-fg-default`; base text uses `font-sans text-label-default` (`bb187b3:apps/hub/src/theme/family.css:47`; `085b46e:packages/ui/src/molecules/tabs/types.ts:139-142`). Historical default white = `#FFFFFF`; label recipe = 11.2px / 1.2, weight **600**, for both states (`085b46e:packages/tokens/src/theme.css:24-25,72-73,182-183,241-245`). | `text-fg-default`, `text-fg-secondary`, `font-sans`, `text-label-default`. The owner describes selected text as bold; source records 600, not a selected-only 700. If stronger 700 is intended, existing `--text-cta-label--font-weight` is 700 and can supply only the weight, without changing size (`packages/tokens/src/theme.css:277-280`); choose after review, not from pixels. |
| Focus | Nexo used `outline: var(--focus-width) solid var(--color-focus-ring-inverse); outline-offset: calc(-1 * var(--focus-offset))` (`bb187b3:apps/hub/src/theme/family.css:49-51`): historical 2px white inset 2px (`085b46e:packages/tokens/src/theme.css:112-113,461-464`). The pinned DS segmented fallback used `--shadow-focus` (`085b46e:packages/ui/src/molecules/tabs/types.ts:153-156`). | Both inverse-focus and `--shadow-focus` roles exist (`packages/tokens/src/theme.css:112-113,372-373,474-477`); decide the new variant's ring after real-browser adjacent-contrast and clipping checks. Existing variants' focus is unchanged. |

**Accent / chip-active gap:** historical Nexo custom scopes explicitly redeclared `--gradient-chip-active` using the custom accent with 24% and 9% translucent stops (`bb187b3:apps/hub/src/theme/accent.css:15-16,50-56`); this is historical evidence, not authorization for handwritten gradients or `color-mix()` in Tabs. The current helper redeclares a bounded complete map, but not that token; nested default scopes can also inherit a parent's unreset custom value if a map is extended incompletely. Owner options: **A)** separately approve extending the existing chip-active role and the helper's complete default/custom reset map, assessing effects on other Chip consumers; **B)** separately approve a dedicated accent-following gradient role with its name, values and derivation explicitly decided; or **C)** accept an existing-role approximation, such as neutral `--gradient-sheen` with a flat `--color-border-brand` tint over surface-1, acknowledging it is not the exact chip gradient and requires a changed visual acceptance. Each option needs contrast checks and any relevant token/recipe approval; no token, formula, dependency or global mutation is added by this draft.

**Implementation boundaries:** use static token-backed CVA in `types.ts`, per-part `cn` in `useTabs.ts` and existing Radix JSX, contingent on approvals. Runtime themes live on a consumer-owned host with the helper's complete map (`packages/tokens/README.md:52-69`), not inline component appearance. Keep the six files (`types.ts`, `useTabs.ts`, `Tabs.tsx`, `Tabs.test.tsx`, `Tabs.stories.tsx`, `index.ts`); **No stylesheet**, additional module, dynamic geometry or app CSS migration is proposed. A new visual recipe must be explicitly approved; no generic Surface-class cloning.

### Expected-design visual reference

No capture was produced in this batch. The owner's screenshot is described in the handoff but not supplied as a recoverable image to this worker; do not invent a link, image hash, dimensions, capture conditions or approval.

| Visual ID | Image / scenario | Source and version | Status |
| --- | --- | --- | --- |
| VIS-01 | Pending: current segmented baseline, selected and unselected | `Molecules/Tabs / Segmented`, source/commit and conditions to be recorded. | Observed source candidate only; not approved expected design. |
| VIS-02 | Pending: Nexo-style two-tab `outline`, selected and unselected | Owner's screenshot / historical app; exact image and provenance pending. | Pending image, hash, source and scoped approval. |
| VIS-03 | Pending: keyboard-focused `outline` and segmented on custom accent, including narrow full-width overflow | Expected-design source and story/preview pending. | Pending capture, hash and scoped approval. |

For each, record viewport, device scale, browser/version, theme and accent, loaded fonts, motion/transparency/forced-colors preferences, crop, date, tool and SHA-256. Obtain authorized real-browser component-zone captures and compare with recoverably approved references under matching conditions. Historical implementation captures in `docs/components/tabs/v0.2/implementation.md` are not v0.3 expected-design approval. Visual conformity is **Not evaluated**; captures never replace behavior or contrast tests.

## 7. Acceptance criteria

All checks are **planned**, not observed for v0.3. Stories do not replace tests.

| ID | Observable promise | Planned behavior / build check | Planned story / real-browser check | Observed |
| --- | --- | --- | --- | --- |
| AC-01 | Omitted `variant` and both existing variants preserve rendering, APIs, public markers and focus. | `Tabs.test.tsx`: previous default, underline and segmented, plus packed consumer and emitted CSS checks. | Current `Default` and `Segmented`; compare pre/post computed paint in browser, VIS-01. | Pending |
| AC-02 | `outline` provides the track, selected/inactive anatomy, foreground, border, sheen and edge per the approved mapping; selection transfers it. | Role-based state/interaction and static token/CSS tests, including counts and disabled. | New planned outline story with two tabs; compare with approved Nexo reference, VIS-02. | Pending |
| AC-03 | Border and chip sheen follow runtime accent without fixed-red leakage; default and nested reset are correct. | Tests of approved complete helper map / static utilities and native/Tailwind package consumers; separate token authorization if needed. | Browser computed border/gradient under default red, `#123456`, `#00ff00`, `#ffffff`, sibling and nested default scopes; VIS-02/03. | Pending; sheen role decision blocks exact proof. |
| AC-04 | Label contrast is at least 4.5:1; meaningful selection and boundaries meet applicable 3:1 and use a non-color cue for both `outline` and existing segmented. | WCAG calculations of resolved colors and alpha composites without rounding before comparison. | Browser inspect actual composited gradient regions, adjacent surfaces and multiple accent inputs; record worst cases. | Pending |
| AC-05 | Focus remains visible, distinguishable and unobscured for selected and unselected enabled tabs, including forced colors and scrolling. | Role-based keyboard and focus-precedence tests, preserving existing overflow reveal. | Actual browser keyboard, adjacent contrast and clipping at both scroll edges; forced colors / reduced motion, VIS-03. | Pending |
| AC-06 | Controlled/uncontrolled selection, first-enabled fallback, callbacks, disabled skipping, counts, panels and inactive-content unmounting remain unchanged. | Role-based interaction / relationship tests for the new and existing variants, including no selection event on variant-only rerender. | Existing `Controlled` / `Disabled` and planned outline interaction story. | Pending |
| AC-07 | Existing `fullWidth` / `labelWrap`, word wrapping, equal-fit/overflow and `size` behavior stay unchanged. | Preserve all four layout combinations on segmented, underline no-ops, both sizes and focused-tab reveal. | Current `FullWidth`, `LabelWrap`, `FullWidthLabelWrap`; browser box/scroll/focus checks. | Pending |
| AC-08 | If approved, outline supports the same independent layout options without changing existing variants. | Four outline combinations, counts, narrow overflow and focus-reveal tests. | Planned outline full-width/wrapped stories and browser LTR/RTL box/scroll checks; VIS-03. | Pending owner decision. |
| AC-09 | `variant` types, documentation and Controls expose the approved new value without another prop, changed defaults or unauthorized token/dependency edits. | Type/docgen and Controls pipeline tests, export/package checks and naming/source review. | Browser verify actual Controls and both old/new stories. | Pending |
| AC-10 | Visual references, spec and implementation plan have separately scoped approvals. | Finalize canonical payload/visual hashes; no behavior-test substitute. | Authorized VIS-01–03 real-browser captures and owner review under comparable conditions. | Pending |

### Resolved decisions

- L6 replaces the earlier `selectedTone` direction with a separate value of `variant`; `underline` and `segmented` remain unchanged (`odd/tasks/nexo-requests-464-466-specs.md:9,31`). `outline` is the proposed value, not yet owner-approved.
- Spec batch only: no source, tokens, dependencies, GitHub writes or implementation. The plan requires separate approval.

### Owner decisions — 2026-11-17 (feature log L8)

1. **Accent sheen:** derive `--gradient-chip-active` from the accent role so `createAccentTheme` recolors it; the default red rendering stays identical. This is a token change in `packages/tokens/src/theme.css` (and the accent helper map), confirmed by the owner for this purpose only.
2. **Material shadow:** the historical main-view edge-only recipe (`--shadow-edge-strong`), as Nexo had it.
3. **Typography and focus:** the historical shared 600 label weight; focus keeps the current DS accent focus ring (contrast and forced-colors verified in the implementation PR).
4. **Layout:** option A: `fullWidth` and `labelWrap` also apply to `outline`.
5. **Naming and visuals:** `variant="outline"`. The owner screenshot ("Mis apps / Catálogo", feature log L6) is the expected-design reference; the implementation PR captures the result in a real browser for owner review.

### Planned checks and next step

Complete AC-01–AC-10 with behavior tests, production CSS/package checks, real Storybook Controls, browser contrast/keyboard/visual checks and owner review. Resolve the pending decisions and bind approval to the snapshot and visuals; then propose an independently approved implementation plan. Nothing is marked implemented, and no tests or visual captures ran in this documentation batch.
