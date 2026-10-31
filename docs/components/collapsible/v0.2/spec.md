# Component contract — Collapsible

- **Version / status:** v0.2 — Draft; preparation only, roadmap T3 / issue #181. Not implemented.
- **Approval / recovery:** [Proposal approval](https://github.com/egdev6/egdev-design-system/issues/181#issuecomment-6516515584) approves preparing the detailed contract/plan and reusing installed Radix, not this exact contract, visuals or plan. [Preparation assignment](https://github.com/egdev6/egdev-design-system/issues/181#issuecomment-6522797382); [roadmap](https://github.com/egdev6/egdev-design-system/issues/8#issuecomment-6522805790). Parent supplied the issue body and complete one-comment history for read-only review. No new publication performed.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: sha256:b3d9f158d45661b151dbff249b645ab6f97b036e872d187eb6f4be39d35b2017`; `visualHashes: Pending — no captures`; `approvalReference: Pending — exact v0.2`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/181`; `latestPublishedComment: Pending — v0.2 unpublished`.
- **Hash definition:** SHA-256 of UTF-8 payload from the actual whole-line heading `## 1. Purpose and scope` through EOF, LF endings and final newline. Tracking metadata above that heading is excluded. Approval must bind this digest and actual visual hashes; hashes alone prove no consent.
- **Review bundle:** [Separate implementation-plan draft](implementation-plan.md), [static specimen](specimen.html), [capture request](capture-request.json). Preview CSS is illustrative, not a production stylesheet. Owner adoption of browser captures is still pending.
- **Historical preservation:** [v0.1](../v0.1/spec.md) remains byte-identical (whole-file SHA-256 `cd4bcb70e95715603b3eb4396d3c4dd78b3612390dc60d13ae91c6df965407f2`). v0.2 removes the obsolete missing-dependency gate, refreshes source identities, and clarifies hidden Content-shell presence, native cancellation and compound ownership. It does not migrate an existing public Collapsible API.

## 1. Purpose and scope

One named in-flow disclosure with one trigger and one body. Independent sibling sections may all remain open; nested sections do not coordinate their state. Not Accordion, navigation, tree, menu, overlay, data loading, validation or a persistence service. NavList #92 remains unchanged.

**Cataloging recommendation:** new molecule in `@egdev/ui`, `packages/ui/src/molecules/collapsible/`. Reuse: Surface supplies Material but not disclosure; Button supplies an action but not body relationships/presence. Variant: adding disclosure to either would change responsibility. Composition: repeated trigger/body coordination in panels/settings warrants a neutral compound module, not a product-specific items schema. Extraction: NavList's domain-specific groups are not a generic source to refactor. New: coordinate a named action and independently interactive conditional body over Radix; the caret is decorative, not the classification rationale. No Accordion exclusivity or roving navigation is required.

**Verified source baseline:** isolated checkout `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`, not the older primary checkout. Some shared prose still says only Gauge exists; actual public exports and source at this baseline show Surface, Button, Icon and NavList. Those APIs are evidence of availability, not exact Collapsible approval. CodeGraph status reports uninitialized; initialization would exceed the four-file write boundary, so inspection used exact source paths. No shared authority text was edited.

| Reviewed file / symbol | Whole-file SHA-256 | Observed fact |
| --- | --- | --- |
| `packages/ui/package.json` / dependencies | `2d4686f9dc27cc5dfa460ac5520f96e06a98ace10b3dec77a2f6b7bad9b826a2` | Exact `@radix-ui/react-collapsible: 1.2.1` direct dependency |
| `pnpm-lock.yaml` / UI importer and package snapshot | `1b47b91fc197ffa1df9dec8aae196dc27f415bb02dc8663420a2b35bc68c9381` | Same exact version; Radix context/id/presence/controllable-state dependencies resolved |
| `packages/ui/src/index.ts` / public exports | `08908ee7c034a211f2b6c252f7bb258865be1e31ec3f166e9ece7747a91bfa73` | Surface, Button, Icon, NavList available; no generic Collapsible export |
| `packages/ui/src/primitives/surface/types.ts` / `SurfaceProps`, `surfaceVariants` | `26d0726b5034dceb74e0067c1c0df5108d351e948205bbf22b5e187b92d9c0b6` | Fixed frame axes and elevation-zero sheen/edge recipe available |
| `packages/ui/src/primitives/surface/Surface.tsx` / `Surface` | `8173b47ef3645fbd09d58608558d97ea5524910960a3068f1d769c8f994cb143` | React 18-compatible DOM ref bridge |
| `packages/ui/src/primitives/surface/useSurface.ts` / `useSurface` | `e0e836e7dc7d471b2f0d87ada35b87e4097c2f15144f43e5e0ced732cec249cc` | Rest props preserved; per-root cn merge |
| `packages/ui/src/atoms/button/types.ts` / `ButtonProps`, `buttonVariants` | `1cf6a0e59cd1636bc05d59bb5d91bdb49e3da9cc0fbc27ecf69fb224e79b888f` | Ghost/md recipe available through internal module, not barrel |
| `packages/ui/src/atoms/button/useButton.ts` / `useButton` | `a3854519a345368150f1af57293af370e06ad94f1a5e6b8939d29e129c5b42a2` | Writes idle/loading data-state; do not use Button component for this Trigger |
| `packages/ui/src/atoms/icon/types.ts` / `IconProps` | `1ea0dd7b8a4e42f90f6bd352edf968b9765eea9745ff8ff0ff6b5b9d0957ec13` | Decorative chevron-down and sm size supported |
| `packages/ui/src/atoms/icon/icon-paths.ts` / `iconPaths['chevron-down']` | `c590c71332c08921102517bada473f7d032ffb792dd95e3c38b8f07b3edc6f94` | Existing path `m6 9 6 6 6-6`, 24×24 viewBox |
| `packages/ui/src/molecules/nav-list/NavList.tsx` / `NavList` | `818b122380f5528a8786693de7b999c0981e2c261cfa6287c73273c2b8dbb1bd` | Already imports individual Radix Collapsible; no migration proposed |
| `packages/ui/src/lib/cn.ts` / `cn` | `74220d183bbca5febc12bd56e70c8c07690d02ec8ff8f771a77072d62a90771f` | clsx plus configured twMerge; typography groups recognized |
| `packages/tokens/src/theme.css` / token declarations | `62d10992ae654e34e83d9d11bcf35da29e56c905648015f2415ebdca59bf6ab8` | All specimen variables exist; canonical compiled CSS must be supplied by parent |

Dependency authorization is resolved: reuse 1.2.1 without manifest/lock changes. This clone has no node_modules; upstream implementation/types were not directly read or executed here. Radix details below are proposed acceptance promises to verify against the provisioned exact package, not observed runtime results. A mismatch returns to review, never to handwritten interaction.

## 2. Anatomy and composition

| Public part | Responsibility / host | Allowed content |
| --- | --- | --- |
| `Collapsible` | `CollapsiblePrimitive.Root asChild` → Surface div; state/frame | Exactly one Trigger and Content pair, with optional semantic heading around Trigger |
| `CollapsibleTrigger` | Actual `CollapsiblePrimitive.Trigger`, fixed native button | Required non-empty visible inline label, optional noninteractive inline annotation |
| Internal label and caret | Wrapping label span, trailing decorative `Icon name='chevron-down' size='sm'` | No independent action, label or public caret slot |
| `CollapsibleContent` | Actual Radix Content div; presence boundary | Required meaningful flow content, including consumer controls or nested disclosures |

Import `* as CollapsiblePrimitive from '@radix-ui/react-collapsible'`. Radix owns open state, IDs, ARIA, disabled activation and presence. Root's internal Slot preserves the Surface div/ref/attributes. Trigger uses only internal `buttonVariants({variant: 'ghost', size: 'md'})`, not Button/useButton, so open/closed data-state is never overwritten by idle/loading. No public asChild on any part; no Button loading/icon/variant props leak through. No Portal for an in-flow disclosure.

Public markers: root `eg-collapsible`, trigger `eg-collapsible__trigger`, content `eg-collapsible__content`. Composed Surface retains `eg-surface`; recipe reuse retains `eg-btn`; Icon retains `eg-icon`. Internal label/caret selectors are not public APIs. Do not mirror state into classes or claim a Button component instance. Consumer heading h2–h6 may wrap Trigger; Root adds no heading or landmark. Parts outside Root rely on Radix's contextual diagnostic, not a duplicate context/state engine. Invalid pair cardinality/nesting is unsupported, not repaired.

## 3. Public API

All entries below are proposed, not implemented symbols. Named exports: `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`, `CollapsibleProps`, `CollapsibleTriggerProps`, `CollapsibleContentProps`. No hook/CVA/context/raw Radix exports.

| Part / prop | Type | Required | Default / rule |
| --- | --- | --- | --- |
| Root `children` | `ReactNode` | Yes | One named Trigger/Content pair; no default |
| Root `open` | `boolean` | Controlled branch only | Omitted means uncontrolled; no fixed default |
| Root `defaultOpen` | `boolean` | No; uncontrolled branch only | `false`, initialization only |
| Root `onOpenChange` | `(open: boolean) => void` | With `open`; optional uncontrolled | None; requested next visibility, no incoming/mount echo |
| Root `disabled` | `boolean` | No | `false`; disables only Trigger activation |
| Trigger `children` | `ReactNode` | Yes | Meaningful visible inline label; no focusable descendants |
| Content `children` | `ReactNode` | Yes | Meaningful body; no default |
| Each `className` | Native `string` | No | None; supported external layout only, section 6 |
| Trigger `ref` | `Ref<HTMLButtonElement>` | No | Actual Radix button; React 18-compatible forwardRef bridge |

State union: controlled `{open: boolean; onOpenChange: (open: boolean) => void; defaultOpen?: never}` OR uncontrolled `{open?: never; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void}`. Do not switch mode while mounted. Disabled does not prevent controlled owner updates.

**Native inheritance, destinations and exclusions:** use `ComponentPropsWithoutRef<'div'|'button'>` with Omit; do not manually duplicate native props for metadata. All parts omit `children`, `style`, `dangerouslySetInnerHTML`, `contentEditable`, `suppressContentEditableWarning`, `aria-expanded`, `aria-controls` before adding own props. Root additionally omits `role`, `tabIndex`; Trigger additionally omits `type`, `disabled`, `role`, `tabIndex`, `aria-disabled`, `aria-pressed`; Content additionally omits `id`, `hidden`, `tabIndex`. Root/Trigger compatible native id, data-* and aria-description/name relationships reach the actual hosts; no public Root/Content refs. Content may use native `role='region'` with `aria-label` or `aria-labelledby`; default remains div. State attributes `data-state` / `data-disabled`, Content id/hidden and Trigger type/disabled/expanded/controls remain owned regardless of JavaScript prop spreading. Public `asChild`, `forceMount`, keepMounted, orientation, title, heading level, items and onClose are absent. Never force the hidden body into reading/tab order.

Trigger native mouse/key handlers are supported on the actual button; a consumer `onClick` that calls preventDefault cancels Radix's composed toggle. No additional click/key engine or callback is introduced. Do not cancel activation unless that is intended. Native attributes cannot legitimately replace the required meaningful visible name or disclose contradictory state.

**Naming lookup:** [registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md), [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry). Match meaning/name/aliases: `open-state` → open, `initial-uncontrolled-open` → defaultOpen, `open-change` → onOpenChange (all currently approved; alias/exception lists empty). Reuse their visibility meanings only, not other components' timers/Escape/outside behavior. disabled is Radix/native-compatible; children/className/ref are React/native, not new proprietary conventions. No new semantic ID, exception, alias migration or global promotion. Reject selection/pressed/orientation/title concepts as unrelated. Existing source evidence is the reviewed table above; Collapsible source records remain Pending until actual types.ts symbols exist and are read/hashed. Do not register a fictional future revision. Later approved registry usage updates belong to parent coordination, not this preparation.

## 4. Behavior

| Given / action | Expected result / callback |
| --- | --- |
| Default mount / defaultOpen=true | Closed / initially open respectively; no onOpenChange |
| Enabled native click, Enter or Space | Radix requests opposite state once per activation; uncontrolled state follows |
| Controlled request, owner withholds update | Callback requests next boolean; rendered state/presence remains unchanged |
| Incoming controlled open changes / defaultOpen rerender | Silent state update / no reset of uncontrolled state |
| Root disabled while closed/open | Native Trigger disabled, no user toggle/callback; existing body visibility retained |
| Enabled controls within disabled open Root | Remain enabled and readable; Root is not a disabled fieldset |
| Consumer prevents default on Trigger click | Radix toggle canceled; no onOpenChange |
| Close, then reopen | Body children leave DOM/reading/tab order, then remount; local child state may reset |
| Multiple or nested Roots | Distinct relationships and independent state; both/all may stay open |
| Arrows, Home/End, Escape or outside click | No disclosure-owned interception/close; native/host behavior continues |

**Presence and IDs:** no forceMount or exit/height animation. The proposed Radix-native contract retains a hidden Content shell (with its generated id) when closed and unmounts its body children; it does not promise removal of the entire Content element. Trigger aria-controls continues to identify that shell. On open, children mount in place. Verify exact 1.2.1 behavior before acceptance; never emulate it with a second state, hidden-but-tabbable children, manual IDs or document listeners. No measured-height engine or persistence API. Consumers needing retained form data lift state outside Content; no implicit submission guarantee for unmounted controls.

## 5. Accessibility

Actual button semantics and visible label; decorative caret is aria-hidden/focusable=false. Radix supplies aria-expanded, aria-controls, unique useId-based Content ids and data-state=open|closed; no custom shared literal IDs, aria-pressed, menu/tree roles or live announcement. Native disabled Trigger is excluded from tab order. Consumer may add its own Trigger id to name an opt-in Content region; that id is not a styling selector. Avoid landmark proliferation for short bodies.

Native/Radix button activation owns click/Enter/Space. Opening or normal Trigger closing leaves focus on Trigger; opening does not autofocus Content. Tab/Shift+Tab follow DOM order, with no trap/roving/extra Escape handling. Before externally closing while focus is inside Content, the consumer moves focus to a stable target, normally Trigger via its ref. No automatic programmatic restoration promise. Root disabling itself does not evacuate existing content focus.

Ghost/md recipe supplies minimum 48px target (`--space-12`, above 44px mobile minimum), wrapping text and token focus ring on the actual button. Root overflow stays visible so ring is not clipped; consumer hosts must also avoid clipping. Expanded semantics and presence convey state without color/caret motion. Manual AT and browser keyboard/zoom checks remain planned, not proven by HTML or screenshots.

## 6. Appearance

| Axis | Values / default |
| --- | --- |
| Public appearance axes | None; no tone, elevation, size or visual variant prop |
| State | Radix open/closed, disabled=false by default; not CVA state variants |
| Frame | Fixed Surface tone=surface-1, elevation=0, radius=md, padding=none |
| Trigger | Fixed Button recipe ghost/md, full width, start-aligned wrapping label and trailing sm caret |

Surface owns the tonal fill, `--gradient-sheen`, hairline `--border-width` / `--color-border-hairline`, `--shadow-edge` and `--radius-md`. Elevation zero deliberately has no floating two-layer elevation shadow; do not flatten away its sheen/edge or add overlay/well paint. Body uses `p-4` (`--space-4`) and a top hairline of the same border tokens, only visible when open; font-sans/text-body-default and fg-default. Trigger ghost/md preserves its Material hover/press/focus/disabled recipe with `min-h-12`, `py-3`, `px-5.5` (= existing spacing base × 5.5), `gap-2.5` (= base × 2.5) and text-cta-label. Internal composition explicitly replaces justify-center/whitespace-nowrap with justify-between/text-start/whitespace-normal; label min-width zero, wraps long words, caret does not shrink. No Button change or custom cloned recipe.

CVA declares static root/trigger/content/label/caret utilities in types.ts. Hook helpers call CVA and `cn()` per supported part; root merges through Surface. Caret wrapper is a named Radix-state group descendant: open half-turn through static group-data variants, transform transition uses --duration-fast/--ease-out. Reduced motion removes transition AND rotation/other transforms; caret remains down in both states while ARIA/presence still communicate disclosure. No content animation. Solid frame needs no reduced-transparency alternate; verify unchanged under that preference. No inline appearance, dynamic geometry, invented tokens, gradients, shadows, runtime icons or extra modules.

Disabled opacity .45/pointer-events-none/cursor policy applies once to Trigger through Radix data-disabled and reused Button recipe; Root/body are not dimmed. Focus-visible uses --shadow-focus and wins over hover/press shadows. No independently dimmed caret. Native disabled prevents actual activation; CSS alone is not the guard.

**Merge contract:** Root className supports outer margin, width/max-width, grid/flex placement; Trigger supports external self-alignment/outer margin only (not width/target); Content supports external self-alignment/outer margin only. Consumer className is merged last with `cn`; internal recipe adjustments precede it. Recognized utility conflicts resolve through configured twMerge; public eg-* markers survive. Defaults remain appearance API: consumer paint, padding, presence, focus, target and caret overrides are unsupported, not promised to be sanitized from arbitrary strings. Verify allowed examples (`mt-4`, `w-full` on Root, `self-start`), internal wrapping override, and variant/media selector limitations. Last-class order is not universal cascade permission.

**Six-file compound module, no extra internal files:** `types.ts` (types/JSDoc/static CVA), `useCollapsible.ts` (typed root/trigger/content preparation helpers, rest filtering, cn; no replicated state), `Collapsible.tsx` (JSX-only Radix/Surface/Icon composition and Trigger ref bridge), `Collapsible.test.tsx` (hook/DOM behaviors), `Collapsible.stories.tsx` (Molecules/Collapsible autodocs and distinct examples), `index.ts` (only the named components/types above). **No stylesheet.** Specimen CSS is a self-contained static design sketch, not permission for a production BEM engine or stylesheet inventory entry.

### Expected-design visual reference

| ID | Proposed source / English description | Scenario / criteria | Evidence / approval |
| --- | --- | --- | --- |
| VIS-01 | specimen.html #independent — independent closed and open consumption/history frames | Principal anatomy, open body separator, both-open pair; AC-01/05/08 | Authored static illustration; real PNG/hash/adoption Pending |
| VIS-02 | specimen.html #states — focus illustration and disabled closed/open frames | Single opacity, readable disabled-open body; AC-03/06/08 | Authored focus is NOT actual browser focus; capture/adoption Pending |
| VIS-03 | specimen.html #long-label — wrapping disclosure label | Narrow/zoom layout and caret clearance; AC-08 | Capture/adoption Pending |
| VIS-04 | specimen.html #independent under reduced motion | Open caret without rotation; AC-08 | Media-rule intent only; browser result Pending |

Use [capture-request.json](capture-request.json) for proposed viewports, DPR, theme, fonts, preferences, crop selectors and metadata required from parent. Only /tokens.css is linked; parent supplies compiled canonical tokens and owns hosting/browser capture. Existing SVG geometry is reused solely for the static decorative caret. No script, production React, screenshots, inferred owner-reference image or fabricated capture metadata. The historical owner-reference consumption/history description informs labels, not a recovered image. All references remain Proposed. Visual conformity: **Not evaluated** until real captures, conditions, hashes and recoverable owner adoption exist. Behavior/AT are separate evidence.

## 7. Acceptance criteria

Every runtime check below is planned, not run. Colocated test/story paths refer to the proposed six-file module, not existing files.

| ID | Observable promise | Planned method | Story / visual | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | Closed default, initially-open option, click/Enter/Space and coherent expanded/controls | Real Radix userEvent DOM tests; relationship shell checks | Default, InitiallyOpen; VIS-01 | Dependency/source review only; runtime Pending |
| AC-02 | Controlled request once, no prop/mount echo; defaultOpen only initializes; cancellation veto | render/rerender/callback assertions; discriminated-union positive/negative type cases | Controlled, CanceledActivation | Pending |
| AC-03 | Disabled prevents native activation but retains open visibility and usable body controls | Disabled closed/open click/key/tab tests, no duplicated opacity | DisabledClosed, DisabledOpen; VIS-02 | Pending |
| AC-04 | Focus remains on Trigger, normal Tab order; no custom arrows/Escape/outside close | userEvent + real browser; consumer-managed external-close example/ref | Keyboard, ExternalClose | Pending |
| AC-05 | Closed shell hidden, body children unmounted/remounted; local state reset documented | Provisioned 1.2.1 source review, DOM/ref/state fixture; no Radix mocks | WithFormContent, Remount; VIS-01 | No upstream node_modules in this clone; verification Pending |
| AC-06 | Sibling/nested state and IDs independent; no forced exclusivity | Multi-root relationship/callback tests; part-outside-root diagnostic | IndependentSections, Nested; VIS-01/02 | NavList source precedent only; runtime Pending |
| AC-07 | Native button name/ref, decorative caret, optional named region and headings remain coherent | DOM roles/names/refs, SSR/hydration IDs, React 18/19 client; manual AT | Heading, NamedRegion, ButtonRef | Pending |
| AC-08 | Frame/separator/typography/wrap, single opacity, focus, reduced motion, supported merges | Hook/CVA invariants; emitted CSS scan; real computed CSS/captures, narrow/200% zoom/RTL | LongLabel, ReducedMotion; VIS-01–04 | Token and source inspection; no browser/CSS-build pass |
| AC-09 | Exactly bounded public exports/types and own metadata; no consumer Tailwind prerequisite | AST/JSDoc coverage, real docgen/enhancer pipeline, browser Controls; built/packed consumer | Default, Controlled; no manual argTypes/play | Pending |
| AC-10 | Existing 1.2.1 reused, six meaningful files/no CSS; no NavList/Accordion/token/dependency migration | Diff, manifest/lock hashes, public export review | Not applicable — structural scope check | Manifest/lock/version/exports observed; implementation Pending |

### Spec closure and remaining decisions

- Seven blocks and exact proposed API/defaults/anatomy/Material/merge/ARIA/checks are present; v0.1 is preserved.
- Recommendation for exact contract approval: retain the bounded native Trigger, hidden-shell/unmounted-children presence, disabled-open distinction, consumer-owned external-close focus, no Accordion/asChild/forceMount, fixed Surface frame and internal ghost/md recipe.
- Parent must supply actual canonical /tokens.css and browser captures/conditions/hashes; owner must adopt identified visuals. None exists here yet.
- Owner must separately approve this exact v0.2 content digest and the separately hashed implementation-plan draft before runtime. No new token or dependency decision is needed.
- Later runtime edit authorization must name the six files plus parent-owned integration surfaces; this draft grants no writes there and no Git/GitHub action. Registry convention approval remains separate; no source hash or native receipt is invented.

**Next step:** parent reviews this local preparation bundle, captures the proposed static design and obtains digest-bound contract/visual approval, then separate implementation-plan approval. Stop before runtime code.
