# Collapsible v0.5 — sibling actions, compact content and presence amendment

- **Version / status:** v0.5 — Approved — 2026-11-17 (parent applying the recommended options under owner delegation; see "Approval" below). Implementation plan follows the same delegation.
- **Amends:** [v0.2 base](../v0.2/spec.md), the [approved v0.3 relationship amendment](../v0.3/radix-relationship-amendment.md) and [approval](../v0.3/owner-approval.md), and the [v0.4 hover-radius delta](../v0.4/hover-radius-amendment.md), whose visual confirmation remains pending. Request: [#408](https://github.com/egdev6/egdev-design-system/issues/408). Other promises remain unchanged.
- **Approval / recovery:** This file is the recoverable draft, not approval. Proposed naming conventions and the separately prepared implementation plan require their own approval; this document authorizes no code, token, dependency or GitHub mutation.
- **Snapshot identity:** `version: v0.5`; `contentSHA256: Pending`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/181`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 payload from the actual `## 1. Purpose and scope` heading through EOF, LF line endings and final newline; metadata above it is excluded. Finalize before publication and bind approval to this version, digest and identified visuals.

## 1. Purpose and scope

Extend the existing `@egdev/ui` Collapsible molecule with an optional row that places consumer-owned actions **outside** the disclosure button, compact Content padding and explicit opt-in retained presence/motion suppression. No action data schema, application workflow, Accordion, custom focus/keyboard engine or animated-height engine is introduced. Independent disclosures and the existing compound usage remain valid.

**Evidence and alternatives:** the public barrel exports `Collapsible`, `CollapsibleTrigger` and `CollapsibleContent`. `packages/ui/src/molecules/collapsible/{types.ts,useCollapsible.ts,Collapsible.tsx,Collapsible.test.tsx,Collapsible.stories.tsx}` shows a full-width native Radix Trigger, noninteractive label and caret, Content `p-4`, and closed hidden shell/unmounted children. Nesting an action in the button is invalid; merely positioning a separate control over it does not provide a supported row. Adding a compound header to this molecule preserves one disclosure instead of creating another component or an Accordion. `packages/ui/package.json` already declares `@radix-ui/react-collapsible` 1.2.1. The installed Radix source supports internal `forceMount`, but this proposal must hide retained closed content; source inspection is not runtime proof. The current hook uses the Button **neutral/md** recipe, although historical base prose calls it ghost/md: preserve the actual shipped baseline and its behavior, not an unapproved visual migration.

## 2. Anatomy and composition

| Part | Responsibility / host | Content |
| --- | --- | --- |
| `Collapsible` | Existing Radix Root asChild → Surface frame | Exactly one Trigger/Content pair; optional new Header around the Trigger |
| `CollapsibleHeader` | New optional unpainted native div row | One Trigger, directly or inside a consumer heading, and a separate actions wrapper |
| `CollapsibleTrigger` | Existing Radix native button and decorative caret | Non-empty inline label; never buttons, links or other focusable descendants |
| Actions wrapper | New unpainted div, sibling of the Trigger or its heading wrapper, outside the button | Independently focusable consumer-supplied actions; no generated actions |
| `CollapsibleContent` | Existing Radix Content div and presence boundary | Consumer flow content, including controls |

Example:

```tsx
<Collapsible>
  <CollapsibleHeader actions={<Button>Update</Button>}>
    <CollapsibleTrigger>Installed applications</CollapsibleTrigger>
  </CollapsibleHeader>
  <CollapsibleContent padding='sm'>Application details</CollapsibleContent>
</Collapsible>
```

Existing `eg-collapsible`, `eg-collapsible__trigger`, `eg-collapsible__content`, `eg-surface`, `eg-btn` and `eg-icon` markers survive. New row markers are `eg-collapsible__header` and `eg-collapsible__actions`. Header adds no heading or landmark; consumers may supply a suitable native heading around Trigger. When Header is omitted, existing DOM structure and layout remain unchanged. No public Header ref, `asChild` or native Radix parts are exposed.

## 3. Public API

| Part / prop | Type / default | Proposed contract |
| --- | --- | --- |
| `CollapsibleHeader.children` | `ReactNode`, required | One Trigger or one native heading containing one Trigger; meaningful visible label is still required. |
| `CollapsibleHeader.actions` | `ReactNode`, optional; absent/null omits the actions wrapper | Consumer actions in normal DOM/tab order after the Trigger region. Activation never toggles the Trigger. |
| `CollapsibleContent.padding` | `'sm' \| 'md'`, optional; `md` | `md` retains `--space-4`; `sm` uses `--space-2` on all sides. Body child gaps remain consumer-owned. |
| `CollapsibleContent.presence` | `'unmount' \| 'keep-mounted'`, optional; `unmount` | Default preserves the hidden shell/unmounted children. `keep-mounted` retains children while hiding the closed shell from layout, accessibility and tab order. |
| `CollapsibleTrigger.motion` | `'default' \| 'none'`, optional; `default` | `none` removes Trigger translation/scale and its transitions plus caret rotation/transition; no changes to state, paint or focus. |

Header inherits compatible div attributes, with `children`, `actions`, `style`, `dangerouslySetInnerHTML`, `contentEditable`, `role` and `tabIndex` excluded/redeclared as appropriate. Its `className` supports outer margin, width and parent placement only; no public ref. Existing Root/Trigger/Content native exclusions, Trigger ref, cancellation, disabled behavior and controlled union remain unchanged. Add named `CollapsibleHeader` and `CollapsibleHeaderProps` exports; do not export a state/context engine or raw Radix components. The new props are consumed, not forwarded as DOM attributes.

**Naming lookup:** [registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md) and [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry), checked by meaning/name/aliases. Reuse approved `trailing-actions` / `actions` for Header's `ReactNode` actions and `inner-padding` / `padding` for Content's component-specific preset mapping. Propose `disclosure-presence` / `presence` (`'unmount' | 'keep-mounted'`): lifetime of a disclosed subtree, not `open` or an animation; and `disclosure-motion` / `motion` (`'default' | 'none'`): opt-out of this Trigger and caret's movement, not `animation-paused` or the icon-only `compact-presentation`. No matching existing convention or alias was found for those two. Their approvals are separate from spec approval; no registry write occurs here.

Reviewed existing evidence: `{path: 'packages/ui/src/molecules/collapsible/types.ts', symbol: 'CollapsibleContentProps', revision: 'sha256:4ccff811ba38c7c700cd1b36fe333c07a6d2189d033d1af163e9cb8db5ed1bba'}` and the same file/revision for `CollapsibleTriggerProps` and `CollapsibleProps`; `{path: 'packages/ui/src/molecules/dialog/types.ts', symbol: 'DialogContentProps', revision: 'sha256:55f9ddfadf7e3f5cd9859f34373c926fbcb2e09294c782b712b22dd92f4884c1'}` documents an existing actions slot. Header and the proposed props do not yet exist; future registry usages require review and whole-file hashes of their actual implemented symbols.

**Contract changes and migration:** v0.3 explicitly excluded `forceMount` and kept children unmounted when closed. This amendment adds an opt-in retained mode without exposing raw `forceMount`; existing omission remains unchanged. `padding='sm'`, `motion='none'` and Header are opt-in; the existing Trigger/Content restrictions and markers survive. Nexo can replace its row/width, body-spacing and motion/presence overrides only after implementation and a consumer-side audit demonstrates all eight #408 allowlist entries are removable; the issue does not enumerate their exact selectors here. Independent actions are not disabled by Root's `disabled`; each action's owner manages its own disabled state.

### Decisions awaiting approval

- Row API: **Recommended** — an optional `CollapsibleHeader` with `actions`, not interactive children inside Trigger or a new disclosure component. It preserves valid button nesting and compound consumers.
- Compact spacing: **Recommended** — Content `padding='sm'` uses `--space-2`, with existing `md`/`--space-4` as default. Consumers compose gaps inside the body.
- Presence: **Recommended** — `presence='keep-mounted'` internally uses Radix `forceMount` plus a closed-state `display: none`; default remains unmount. This retains local state without leaving hidden controls focusable or adding a second open-state engine.
- Motion: **Recommended** — `motion='none'` on Trigger suppresses its and its caret's movement, while the default and reduced-motion policy remain unchanged. Do not add enter/exit height animation or animation dependencies.

## 4. Behavior

| Given / action | Expected result |
| --- | --- |
| Existing composition without new props | Same native state, initial closed/defaultOpen behavior, Content shell and child unmount, Trigger and caret motion, padding and callbacks. |
| Header with actions, including varying widths | Actions remain outside the button; flex-wrapping row prevents overlap when available width permits usable controls. Trigger label wraps; actions wrap onto another row when needed. |
| Click/Enter/Space on an action | Only that action activates; disclosure state and `onOpenChange` are untouched. Trigger activation still requests one Radix state change. |
| `disabled` Root | Trigger cannot toggle; an open body and independent Header actions remain enabled unless their owners disable them. |
| `presence='keep-mounted'`, closed | Radix Content remains mounted with children and native `data-state='closed'`; the component's static closed-state CSS makes the shell `display:none`. It is absent from layout, the accessibility tree and tab order. No fake native `hidden` attribute is promised. |
| Reopen retained Content | Same children and local state remain; Radix restores open `aria-controls` to the Content id. Default mode still unmounts children and their local state may reset. |
| `motion='none'` or reduced motion | Trigger has no movement and caret is down in both states, without transition; ARIA and visibility remain authoritative. |

Retained hidden form controls remain mounted and can still participate in form submission; the consumer must disable them or serialize explicitly if that is not desired. Before an external close while focus is in Content, the consumer moves focus to a stable target as in the existing contract. Root state remains wholly Radix-owned: `aria-expanded` is always present, `aria-controls` only when open, and the Content id is Radix-owned. No callback occurs merely because props change.

## 5. Accessibility

The actual Trigger remains a named native button; the separate action controls own their accessible names, disabled state, target sizes and semantics. Tab/Shift+Tab follows DOM order: Trigger, actions, then open body controls. Enter/Space activate the focused control only; no roving navigation, focus trap or new Escape behavior. Root disabling does not disable unrelated actions. Preserve the Trigger ref and consumer-owned programmatic-close focus policy, named optional region and unique Radix relationships. Under reduced motion, state remains available through `aria-expanded` and Content visibility. Check focus rings are not clipped and that touch actions meet the existing 44 CSS-pixel host requirement; consumers must provide a host wide enough for their individual controls.

## 6. Appearance

| Axis | Values / default | Rule |
| --- | --- | --- |
| Header | absent / present | Optional unpainted wrapping row, no overlapping controls or absolute action widths. |
| Content padding | `md` / `sm`; `md` | `--space-4` / `--space-2`; same hairline, typography and Surface frame. |
| Presence | unmount / keep-mounted; unmount | Closed retained shell uses static `data-[state=closed]` display suppression; not an animated variant. |
| Motion | default / none; default | Suppress Trigger translation/scale/transition and caret rotation/transition only in none; reduced-motion always wins. |

Recommended row recipe: a static flex-wrapping Header with the supplied Trigger or heading as its first direct flex item and the actions wrapper as its second; they are siblings, never nested controls. Give the first item `flex: 1 1 var(--space-14)` and `min-width: var(--space-14)` using static token-backed utilities, so the existing Trigger `w-full` fills only its flex allocation. The actions wrapper is `flex: 0 1 auto`, `max-width: 100%`, and wraps its controls with a token-backed `--space-2` gap; the row also uses `--space-2`. Preserve DOM order in narrow and RTL layouts; never calculate action widths or overlay controls on the Trigger. If an individual supplied control is wider than the host, the consumer must make that control wrap or enlarge the host. The existing `data-[state=open]:rounded-b-none`, Surface Material, hairline, focus ring and no-color-only cues remain. Implement the `none` option so its state/active selectors actually defeat the existing Button recipe's active translate/scale without affecting focus or paint; verify computed CSS rather than assuming class order is sufficient.

Use static CVA recipes in `types.ts` and per-part `cn()`; no dynamic geometry, handmade shadow/gradient, new token or dependency. Root/Trigger/Content `className` retain their existing layout-only restrictions; Header's supported layout-only className merges last. `twMerge` does not guarantee every selector/variant conflict or permit appearance overrides. Preserve existing module roles: `types.ts`, `useCollapsible.ts`, `Collapsible.tsx`, `Collapsible.test.tsx`, `Collapsible.stories.tsx`, `index.ts`. **No stylesheet** or extra internal module.

### Expected-design visual reference

| ID | Scenario / source | Status and conditions |
| --- | --- | --- |
| VIS-01 | Pending: narrow Header with long label and multiple independently sized actions | Source/version, viewport, DPR, browser, fonts, theme, motion/transparency, crop, date, hash and visual approval pending. |
| VIS-02 | Pending: open compact body and closed/open retained content; reduced-motion and RTL views | Same provenance and conditions pending. |

No captures are produced in this batch. The implementation PR must provide stories and real component-zone captures with provenance/conditions and request visual approval before merge. Visual conformity is **Not evaluated**; see the [capture guide](../../../design/README.md). Captures do not prove keyboard or AT behavior.

## 7. Acceptance criteria

All checks are planned, not observed.

| ID | Observable promise | Planned check / story | Evidence |
| --- | --- | --- | --- |
| AC-01 | Existing compound markup/defaults, markers, native state, controlled/uncontrolled behavior, cancellation and Trigger ref are unchanged without new props. | Public real-Radix regression/type/ref tests and existing Default/Controlled stories. | Pending |
| AC-02 | Actions are outside Trigger, independently named/focusable and activate without toggling or emitting `onOpenChange`; Root disabled affects Trigger only. | DOM nesting, Tab/Enter/Space/click and disabled tests; SiblingActions story; VIS-01. | Pending |
| AC-03 | Variable-width actions and long labels do not overlap; wrapping retains order, focus rings and usable targets in narrow/RTL/zoom hosts. | Real browser geometry, focus and interaction checks; NarrowActions story; VIS-01. | Pending |
| AC-04 | Content `md` is space-4 and `sm` space-2; border, body content and controlled/uncontrolled state remain unchanged. | CVA/DOM and computed-style tests; CompactContent story; VIS-02. | Pending |
| AC-05 | Default closed shell keeps its id, hides and unmounts children; retained mode hides but preserves child state and form participation, then reopens the same state. | Real Radix DOM/role/tab/form tests, reopen and multi-instance id checks; KeepMounted story; VIS-02. | Pending |
| AC-06 | `motion='none'` and reduced motion remove movement/transition without changing activation, focus, paint or ARIA; default preserves current motion and open hover radius. | Compiled CSS and real-browser computed/interaction checks, both states; NoMotion/ReducedMotion stories. | Pending |
| AC-07 | Header exports, type restrictions, own prop metadata, supported merges, six-file/no-stylesheet structure and existing Radix package are correct. | Type/docgen/Controls, package-consumer React 18/19, CSS scan and diff checks. | Pending |
| AC-08 | The supported row, compact padding, presence and motion cover the consumer's actual eight overrides. | Consumer-side selector-by-selector migration audit and WebView2 smoke check before removing its allowlist entries. | Pending; Nexo source not inspected in this worktree. |

**Dependencies:** existing Radix Collapsible, Surface, Button recipe and Icon only; no token or dependency addition, and no dependency on #396, #417 or #424. **Next step:** Review the recommended options and new naming conventions, finalize this snapshot and separately approve an implementation plan. Real visual, browser, AT and consumer evidence remain outstanding.

## Approval

- **Status:** Approved 2026-11-17.
- **Authority:** the owner delegated these decisions to the parent's recommendations: "pues termina el 1 y luego el 2. Sigue hasta terminar ambos. Aplica las recomendaciones y mergea los prs. Puede paralelizar en hasta 3 subagentes hasta terminar" (owner session 2026-11-17, recorded in `odd/tasks/milestones-1-2-delivery.md` L1 and `odd/tasks/nexo-adoption-m2-specs.md` L1).
- **Resolution:** every open decision in this document resolves to its option marked **Recommended**. New or changed prop-naming conventions and scoped exceptions proposed here are approved together with this spec; registry entries and approval records are added in the implementation PR.
- **Not approved here:** new tokens or token value changes, new dependencies, and anything this document flags as out of scope; those stop for the owner.
