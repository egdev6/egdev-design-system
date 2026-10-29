# Component contract — Collapsible

- **Version / status:** v0.1 — Draft; T4 / S9, issue #181. Specifications only.
- **Approval / recovery:** Canonical snapshot in this file; identical draft at `.playwright-mcp/specs/iteration/collapsible.md`. Agent-applied choices are not exact-snapshot, dependency or implementation-plan approval.
- **Current situation / pending decisions:** New molecule; no Collapsible export or installed direct `@radix-ui/react-collapsible` dependency in `packages/ui/package.json`. All promise decisions applied. **Dependency @radix-ui/react-collapsible: pending owner confirmation.** Visual evidence and spec/plan approvals are also pending. No native details/summary or handwritten interaction fallback is authorized.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: sha256:a4a5c3a6bbf1f821efffccc68bcd1e4eb346fbfdb282c60b798fe64f1fe5a206`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/181`; `latestPublishedComment: Pending — local snapshot, no comment published`.
- **Hash definition:** SHA-256 of UTF-8 canonical payload from `## 1. Purpose and scope` through EOF, LF endings and final newline; preceding metadata is excluded.

## 1. Purpose and scope

- **Need / non-goals:** A labelled disclosure section toggling one body, with a decorative chevron reflecting open state. Supports independent sections in panels/settings. Not navigation-group logic (#92), an accordion group with roving keys/exclusive selection, tree, menu, overlay, form validator or async data loader.
- **Cataloging decision / alternatives:** **New molecule in `@egdev/ui`**, proposed `packages/ui/src/molecules/collapsible/`. Reuse: no public disclosure exists; Surface paints and Button acts but neither supplies disclosure relationships/lifecycle. Variant: extending Surface or Button would mix unrelated container/action contracts. App composition would repeat open-state, trigger/content relationships and chevron/Material across Panel and settings. Compose installed Surface/Icon and the package-internal Button recipe plus the individually confirmed Radix Collapsible package; no implemented local subtree to extract. It coordinates a trigger with independently interactive/conditional content and a shared lifecycle; classification is not based on Radix-part count or physical size.
- **Evidence:** Inspected current package manifest, public barrel, Surface/Button/Icon availability, catalog, token source and [#181](https://github.com/egdev6/egdev-design-system/issues/181). S9's reference sections are described in `odd/tasks/component-iteration.md` L2. NavList's catalog mentions Accordion/Collapsible but neither is currently a generic exported component; that provisional row does not approve either package. Upstream dependency source/runtime was not inspected because the direct package is absent; behavior below is the selected contract to validate against the separately approved version, not an observed test pass.

### Agent-applied decisions

- D1: Base/package? → `import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'`. Radix owns open state, toggling, ids, trigger aria-expanded/aria-controls and content presence. **Pending owner confirmation**, including exact package version at dependency/plan review. Do not install or edit manifests/lockfiles in this task.
- D2: Accordion now? → **Not justified.** The two owner-reference sections are independent and may both remain open. No exclusive selection, arrow/Home/End collection navigation or grouped item schema is required. `@radix-ui/react-accordion` is **not proposed for addition**; any future Accordion is a separate contract and package confirmation, not a mode on Collapsible or an implicit #92 amendment.
- D3: API? → `Collapsible` state/frame root, `CollapsibleTrigger`, `CollapsibleContent`. One Trigger/Content pair per root; nested roots independent. No items array, forced heading rank, title prop or built-in action-data schema.
- D4: State? → Existing open/defaultOpen/onOpenChange, default uncontrolled closed. No duplicated React state for styling. Root disabled prevents toggling but does not close already-open content or disable its descendants. Incoming controlled updates are silent.
- D5: Trigger? → Radix's actual native button, styled with the existing exported Button ghost/md recipe, not the Button component hook. The inspected `useButton` always emits data-state idle/loading, which would overwrite Radix's open/closed attribute under Slot. Direct recipe composition avoids that conflict while preserving Button Material/focus/disabled semantics. Public Trigger accepts inline label content plus an automatic end chevron, not arbitrary nested controls. No public Trigger asChild in v0.1; custom slotted controls require a separate API amendment.
- D6: Presence? → Closed body unmounted after Radix's normal presence handling; no forceMount, exit animation, height measurement or keep-alive API. Internal uncontrolled child state may reset on reopen; consumers needing retained form data lift that state outside Content. No manually managed hidden-but-tabbable subtree.
- D7: Material? → Surface surface-1/elevation 0/radius md/padding none as static frame. Trigger reuses Button's exported ghost/focus/disabled recipe without its state-writing hook. Body has token padding and a hairline top divider. No overlay, hover lift, independent well clone or animated height. Chevron rotates only on Radix state through static data variants; reduced motion removes rotation/transition, while aria-expanded and presence still convey state.
- D8: Focus? → Normal activation keeps focus on Trigger; opening does not autofocus Content, and Tab follows native DOM order. No focus trap, Escape-to-close, arrow-key navigation or document listeners. Consumer-driven closing while focus is in Content requires consumer focus management first; no unverified automatic restoration promise.

## 2. Anatomy and composition

| Part | Responsibility | Native / Radix composition | Allowed content |
| --- | --- | --- | --- |
| Collapsible | State, disabled, fixed Material frame | `CollapsiblePrimitive.Root asChild` → Surface `div` | Exactly one Trigger and one Content in normal flow |
| CollapsibleTrigger | Named disclosure action | `CollapsiblePrimitive.Trigger` (`button type="button"`), Button recipe composition | Meaningful inline text with optional noninteractive inline annotation; automatic end chevron |
| Chevron | Open indication, decorative | `Icon name="chevron-down"` after the label span | No control/independent label |
| CollapsibleContent | Disclosure body and presence boundary | `CollapsiblePrimitive.Content` (`div`) | Valid flow content, including labelled controls, lists and nested independent disclosures |

- **Radix composition:** Root Slot must preserve Surface props/ref/data-state/data-disabled; native Trigger preserves Radix's own ref, type, handlers, ARIA and data-state unchanged. Reuse Button's exported `buttonVariants`, Icon and Surface rather than copy their recipes or run Button's conflicting state hook. Radix package confirmation is prerequisite to the plan; no unified radix-ui import, details/summary or custom keyboard engine.
- **Public markers:** `eg-collapsible` on actual Root frame, `eg-collapsible__trigger` on actual button, `eg-collapsible__content` on Content. Surface/Icon retain their stable markers; the reused Button recipe also retains `eg-btn` without claiming a Button component instance. Chevron wrapper is internal, not a new public selector API. No `is-open`, modifier class or redundant open-state hook.
- **Heading composition:** Consumer can wrap Trigger in an appropriate h2–h6 when a document heading is useful, preserving a single button/name and a Trigger/Content pair under Root. Root does not automatically create heading/region landmarks. No nested buttons/links/menus in the trigger label; place utility controls separately outside that button.

## 3. Public API

| Part / prop | Type | Required | Default / rule | Description |
| --- | --- | --- | --- | --- |
| `Collapsible.children` | `ReactNode` | Yes | One Trigger/Content pair | Compound composition |
| `Collapsible.open` | `boolean` | No | Omitted means uncontrolled | Controlled visibility |
| `Collapsible.defaultOpen` | `boolean` | No | `false` | Initial uncontrolled visibility only |
| `Collapsible.onOpenChange` | `(open: boolean) => void` | Required with controlled open; optional otherwise | None | Requested next visibility from Radix activation |
| `Collapsible.disabled` | `boolean` | No | `false` | Radix root disabled; blocks user toggling only |
| `CollapsibleTrigger.children` | `ReactNode` | Yes | Non-empty inline label required | Visible button name; no focusable descendants |
| `CollapsibleContent.children` | `ReactNode` | Yes | Meaningful disclosed content | Unmounted when closed |
| `className` on each part | inherited `string` | No | None | Supported per-part external layout |
| Trigger ref | `Ref<HTMLButtonElement>` | No | None | Actual Radix native button, React 18-compatible bridge |

- **State types:** Controlled branch `{open: boolean; onOpenChange: (open: boolean) => void; defaultOpen?: never}`; uncontrolled `{open?: never; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void}` plus children/disabled/native root props. Never switch mode during a mounted instance. Controlled close requests do not change actual presence until owner updates open. Root disabled does not prevent the owner changing open.
- **Native props:** Root inherits compatible `ComponentPropsWithoutRef<'div'>`, omitting children, style, dangerous HTML, contentEditable, role/tabIndex and conflicting state attributes; data-* and compatible ids/relationships reach the actual Surface div. Trigger inherits compatible native button attributes/events omitting redeclared children, type (fixed button), disabled (Root owns disabling), aria-expanded/aria-controls (Radix-owned), role, style, contentEditable and dangerous HTML. Its ref is forwarded directly to the actual Radix button; no public Root/Content ref. Content inherits compatible div attributes except children/style/dangerous HTML/contentEditable/id and state/presence overrides; aria-labelledby/role='region' may be used deliberately for a named section, but the content id stays Radix-owned and hidden content cannot be forced into view. Default Content is a plain div.
- **No forwarded wrapper features:** Public Button variant/size/icon/loading/asChild props do not leak through Trigger. Its internal Button recipe selection fixes ghost/md and its owned JSX puts the chevron at the end; consumer className cannot remove focus/hit target, change role or replace chevron. No onClose, open-on-hover, forceMount, orientation, item value, height-duration or keepMounted API.
- **Exports:** `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` and their `*Props` types. No raw Radix re-export, Accordion export or hook/CVA/context barrel export. `type`, never `interface` or `any`.

### Prop conventions and reviewed evidence

Read by meaning/name/aliases: [registry](../../../../skills/_shared/prop-naming.json), [generated reference](../../../prop-naming.md), [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry). Reuse `open-state` → open; `initial-uncontrolled-open` → defaultOpen; `open-change` → onOpenChange. Component-specific type/default/callback sources remain as specified; shared convention mentions timers/Escape/outside requests for other components, but none is added here. Root disabled is Radix/native-compatible API, not a new proprietary convention; children/className are React/native. No new convention or scoped naming exception; registry untouched.

Rejected lookups: `primary-value` and `selection-cardinality` describe selection, not disclosure; `pressed-state` would wrongly imply aria-pressed; `layout-orientation` would imply collection navigation; `heading-title`/`heading-level` remain consumer-heading APIs, not props on this wrapper. No Button icon/iconPosition props are exposed or injected: the chevron is owned decorative JSX beside the label.

Reviewed current implementation evidence: `{path: packages/ui/src/primitives/surface/types.ts, symbol: SurfaceProps, revision: sha256:26d0726b5034dceb74e0067c1c0df5108d351e948205bbf22b5e187b92d9c0b6}` and `{path: packages/ui/src/atoms/icon/types.ts, symbol: IconProps, revision: sha256:1ea0dd7b8a4e42f90f6bd352edf968b9765eea9745ff8ff0ff6b5b9d0957ec13}` establish reusable structure/glyph vocabulary, not an implemented Collapsible API. Also reviewed `packages/ui/src/atoms/button/types.ts` / `buttonVariants` (`sha256:2b9f84179dd5a55e4eebba6a76882fdc3f4c968e81896afc6a13a52a277de74e`) and `packages/ui/src/atoms/button/useButton.ts` / `useButton` (`sha256:a3854519a345368150f1af57293af370e06ad94f1a5e6b8939d29e129c5b42a2`): the recipe is a named source export available through package-internal `../../atoms/button/types`, not a barrel export; the hook overwrites data-state, motivating D5. No Button change is required. New source symbols do not exist; future source records use `packages/ui/src/molecules/collapsible/types.ts`, actual CollapsibleProps/TriggerProps/ContentProps symbols and reviewed whole-file byte hashes. Naming reuse does not imply dependency, convention-widening or exact-snapshot approval.

## 4. Behavior

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| Default mount | Closed trigger, aria-expanded false, body absent from reading/focus order | None |
| defaultOpen true | Body initially present, aria-expanded true | None |
| Click / Enter / Space on enabled Trigger | Radix toggles requested state; uncontrolled visibility follows | onOpenChange(nextBoolean) |
| Open and Tab / Shift+Tab | Normal DOM focus order through trigger/body/surroundings; no roving model/trap | None |
| Arrow / Home / End / Escape | No component-owned state change or interception; normal native/host behavior | None |
| Controlled request without owner update | Existing visibility/ARIA stay controlled | Requested next value only |
| Incoming open/defaultOpen update | open controls actual visibility silently; defaultOpen changes do not reset mounted uncontrolled state | None |
| Disabled root, closed or open | Trigger disabled and cannot toggle; current content visibility retained; enabled body controls stay operable | None |
| Reopen after close | Body remounts; unlifted local child state may reset | From user activation only |
| Two sibling/nested roots | Each toggles independently; no forced one-open policy | Only owning root callback |
| Reduced motion | No chevron rotation/transition; content still toggles and ARIA remains accurate | Same state callback |

- **Representation:** Radix-owned `data-state="open|closed"`, `data-disabled` and trigger ARIA; use Tailwind data/group-data variants directly. No manual mirrored state class or second aria-expanded source. Root/Content/Trigger ids and relationship forwarding must be verified against the selected Radix version before implementation acceptance.
- **Limits:** One enabled named trigger and matching content per root. Stable root/state mode, meaningful label and content; invalid nesting/cardinality is unsupported, not auto-repaired. Part-outside-root gets a descriptive development error. No remote-data loading, scroll-into-view, exclusive group state or automatic hidden-form-data retention.

## 5. Accessibility

- Actual native button has a visible name; Radix aria-expanded/aria-controls point to actual content. Relationship ids come from Radix/useId, unique across multiple roots. Content id is intentionally not a public override: Radix owns both ends of that relationship, avoiding a conflicting consumer id. No aria-pressed or fabricated menu/tree roles.
- Content defaults to div: region role is opt-in with a valid accessible name, avoiding landmark proliferation for every short section. Consumer headings carry document rank; chevron is always aria-hidden, never the sole accessible state cue. No automatic live-region announcement of “opened/closed”; expanded state is the disclosure feedback.
- Radix/native button owns Enter/Space/click. Opening keeps focus on Trigger. Content controls become reachable in normal Tab order; closing removes them. A consumer must move focus to a stable location (normally Trigger via its ref) **before** externally closing content that contains focus; this wrapper does not promise undocumented Radix restoration on programmatic closure. Disabled Root does not disable the whole disclosed subtree.
- Trigger's Button md target is 48px high with token focus ring; preserve at least 44px mobile target and no clipping. Keep Surface edge/Material while focus wins on the actual button. Reduced motion removes decorative transforms, not ARIA/state. Test native keys, focus/presence and real AT relationships, not class snapshots as accessibility proof.

## 6. Appearance

| Axis | Values | Default / restriction |
| --- | --- | --- |
| open state | open, closed | Radix state, not a visual variant prop |
| disabled | false, true | false; only Trigger is disabled |
| Material | Fixed Surface surface-1 / elevation 0 / radius md | No public tone/variant/size axis in v0.1 |
| Chevron | Down when closed, rotated half-turn when open | Decorative; no rotation at all under reduced motion |

- **Tokens / Material:** Surface owns surface-1, sheen, hairline and shadow-edge at elevation 0, padding none, radius md. This is a framed in-flow disclosure, not a floating overlay; do not add blur/Portal. Trigger imports package-internal `buttonVariants` from `../../atoms/button/types` and calls it with `{variant: 'ghost', size: 'md'}` for Material/focus/disabled/pressed semantics, then its owned CVA composes full-width logical-start layout and a wrapping label span with trailing glyph. This deliberate package-internal recipe composition overrides the recipe's whitespace-nowrap only for disclosure labels; it is not a consumer appearance override or copied Button engine. Body `p-4`, font-sans/text-body-default/fg-default, top border of --border-width / --color-border-hairline while present. Consumer content controls retain wells/pressed recipes.
- Chevron is the existing Icon chevron-down at sm (`--space-4`). Root is a named Tailwind group; static open-state group-data variants rotate the glyph, transition-transform consumes --duration-fast and --ease-out. Motion-reduce removes transition and transform rather than animating or snapping a rotation; aria-expanded remains authoritative. No measured/max-height animation, hardcoded durations, inline appearance, new spacing/font/color/shadow tokens or dynamic class interpolation.
- **Disabled / focus:** Root/body remain readable and are not dimmed/disabled. Radix disabled reaches the actual native button and its data-disabled attribute; the reused Button recipe applies its single opacity-45/pointer-events-none/cursor policy and token focus ring. Do not apply another opacity on Root or glyph. Body content and neighboring controls retain native focus and tab order.
- **Class composition:** CVA in types.ts for root/trigger/content/chevron; cn per supported part in hook helpers. Root className supports outer margins/width/grid placement; Trigger/Content className supports external alignment only, not replacing focus, target, Material, spacing, presence or rotating rules. No public glyph-class override. Test actual recognized merges and emitted CSS rather than universal last-class-wins claims.
- **Six meaningful files:** `types.ts` (controlled union, native/part types and static CVA); `useCollapsible.ts` (typed preparation/context-presence diagnostic, per-part cn, no duplicate open state/key/focus engine); `Collapsible.tsx` (JSX-only Radix/Surface/Icon tree and Trigger ref bridge); `Collapsible.test.tsx`; `Collapsible.stories.tsx` (`Molecules/Collapsible`, autodocs, no play); `index.ts` (named exports). **No stylesheet.** No extra internal module. JSDoc boolean controls on open/defaultOpen/disabled, false with explicit Controlled/composition story reasons on callbacks/ReactNode children; repeat directives per controlled-union branch. Native props are not redefined solely for metadata. Actual dependency version/source inspection belongs to the separately approved plan.

### Expected-design visual reference

| Visual ID | Real image / English description | Scenario | Source / version | Status |
| --- | --- | --- | --- | --- |
| VIS-01 | Pending — consumption rhythm/history disclosure labels and chevrons in a panel | Principal independent closed/open sections, both open | Owner screenshot described in task Log L2; actual image bytes/conditions not supplied | visual reference: pending |
| VIS-02 | Pending — focused/disabled trigger and reduced-motion state | Standalone frame and interactive body | New token-backed composition proposal, not a current Storybook component | Proposed, no capture/approval |

- Playwright MCP unavailable; no PNG/hash/capture evidence is invented. Browser/viewport/DPR/fonts/theme/motion/transparency/crop/date are unrecorded; later real component-zone captures must record comparable conditions in this version folder. Static screenshots cannot validate Radix keyboard/presence behavior or package compatibility. VIS-01 maps AC-01/06/08; VIS-02 maps AC-03/07/08. **visual: not evaluated**.

## 7. Acceptance criteria

| ID | Observable promise | Planned test / method | Story / visual | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | Default closed/defaultOpen true, click/Enter/Space toggles real content and trigger ARIA | Collapsible.test.tsx userEvent/role/relationship assertions | Default, InitiallyOpen; VIS-01 | Planned; dependency absent, not run |
| AC-02 | Controlled requests emit once per activation, no incoming/mount echo; defaultOpen initializes once | Hook/render/rerender callback tests; union type fixtures | Controlled, Uncontrolled | Planned, not run |
| AC-03 | Disabled prevents toggling without closing/open-body disabling; actual button focus/target remains correct | Disabled closed/open tests; pointer/keyboard/body-control assertions | DisabledClosed, DisabledOpen; VIS-02 | Planned, not run |
| AC-04 | Opening keeps trigger focus; Tab normal, arrows/Escape not intercepted; external-close responsibility documented | Focus/key propagation/browser integration and consumer-managed close fixture | Keyboard, ExternalClose | Planned, not run |
| AC-05 | Closed body removed from focus/reading order; remount/child state policy explicit; no forceMount/height engine | Presence/unmount/state fixtures; selected Radix source inspection | WithFormContent, Remount | Planned, not run |
| AC-06 | Multiple/nested roots have distinct ids and independent state; no Accordion exclusivity/roving keys | Multi-instance relationship/callback tests | IndependentSections, Nested; VIS-01 | Planned, not run |
| AC-07 | Name/expanded/controls and optional named region are coherent; part misuse is diagnosed | Role/name/id/ref tests, manual AT; React 18/19 ref consumer | Heading, NamedRegion, ButtonRef; VIS-02 | Planned, not run |
| AC-08 | Material, single disabled opacity, chevron state, reduced-motion/no-transform and class merges match section 6 | CVA/cn + actual compiled CSS/media/focus/zoom browser checks | Open, ReducedMotion, LongLabel; VIS-01/02 | Planned, not run |
| AC-09 | Public bounded types/exports/docgen and static CSS work without consumer Tailwind | AST/docgen/enhancer/browser Controls; CSS build/scan and packed consumer | Default, Controlled | Planned, not run |
| AC-10 | Only individually confirmed Radix package is added later; no native fallback, Accordion or #92 migration appears | Future manifest/lock/source/diff review against separate confirmation | Not applicable — dependency/source gate | No dependencies or runtime code changed here |

### Spec closure

- [x] Seven blocks complete; Collapsible selected, Accordion explicitly not justified.
- [x] Exact registry reuse, native-prop treatment and absent-source limits recorded; registry untouched.
- [x] Material, presence/focus/disabled boundaries and Radix ownership explicit.
- [ ] **@radix-ui/react-collapsible pending owner confirmation**; version/plan review required before addition.
- [ ] Real visual evidence, exact-snapshot approval and separate implementation-plan approval pending.

**Next step:** owner reviews this digest-bound draft and explicitly confirms the individual dependency/version; obtain actual visual evidence, then approve an implementation plan separately. Do not implement a fallback or install anything to bypass that gate. No GitHub mutation or commit is authorized here.
