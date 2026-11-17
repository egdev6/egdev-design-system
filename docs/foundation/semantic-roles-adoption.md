# Semantic-role adoption — #426

**Status:** Approved — 2026-11-17 (owner, in session; odd/tasks/shared-app-theme-specs.md L2). Implementation plan follows the same delegation.  
**Coordination:** [#426](https://github.com/egdev6/egdev-design-system/issues/426) depends on the approved token choices in [#425](semantic-contrast-roles.md), which are not yet implemented. Runtime accent #415 also depends on #425; #418 depends on #415; #416 is independent but may reuse #415's accent tokens.  
**Snapshot:** v0.1; `contentSHA256: Pending`; `visualHashes: Pending`; `approvalReference: odd/tasks/shared-app-theme-specs.md L2`; `latestPublishedComment: Pending`. This shared amendment coordinates existing component issues [Switch #72](https://github.com/egdev6/egdev-design-system/issues/72), [Slider #68](https://github.com/egdev6/egdev-design-system/issues/68), [RadioGroup #66](https://github.com/egdev6/egdev-design-system/issues/66), [Tabs #107](https://github.com/egdev6/egdev-design-system/issues/107), [Input #59](https://github.com/egdev6/egdev-design-system/issues/59), and [Link #61](https://github.com/egdev6/egdev-design-system/issues/61). Finalize the canonical payload hash, visuals and their scoped adoption before publication.

## Approval

The owner chose “Sí, confirmo los alias”, “Mantener el neon actual”, “Agregar borde/tinte rojo como Nexo” and “Sí, igual que el 1 y 2” (`odd/tasks/shared-app-theme-specs.md` L2). D1 and D4 resolve to A; D2 and D3 resolve to B. Link's default and hover stay visually unchanged; segmented selection gets the existing-token border and tint specified below. The implementation plan follows the same delegation. Any new token value returns to the owner.

## 1. Purpose and scope

Reuse the six exported React components; map the specified default/state colors to stable semantics rather than create components, variants or props. `packages/ui/src/index.ts:22-38` exports the five atoms and `:114-115` exports Tabs, a molecule. Current source, not this approved contract or an app stylesheet, is the observed behavior. The approved segmented appearance is not implemented yet; the implementation plan follows the same delegation. No app migration has occurred.

Nexo uses RadioGroup, Switch, Slider and segmented Tabs in `/home/egdev/proyectos/nexo/apps/hub/src/settings/index.tsx:41-55`, `:86-90`, `:145`; its underlined Link is used in `/home/egdev/proyectos/nexo/apps/hub/src/apps/details.tsx:36-43`. Its local `/home/egdev/proyectos/nexo/apps/hub/src/theme/family.css:41-55` independently paints selected tabs, slider track/range and all flyout anchors. Quorb's `/home/egdev/proyectos/quorb/src/ds/egdev/components.css:1355-1359`, `:1368-1374`, `:1540-1548` shows the older segmented, input, range and switch recipes. Neither app copy is automatic approval or evidence of package-level parity.

## 2. Anatomy and composition

| Component | Existing parts / host and behavior owner | Public marker / composition |
| --- | --- | --- |
| Switch | Radix Switch Root button and Thumb (`packages/ui/src/atoms/switch/Switch.tsx:1-13`) | `eg-switch`; caller supplies accessible label |
| Slider | Radix Slider Root, Track, Range, Thumb (`packages/ui/src/atoms/slider/Slider.tsx:1-17`) | `eg-slider`; Field may supply surrounding text |
| RadioGroup | Radix Root, Item and Indicator with native labels (`packages/ui/src/atoms/radio-group/RadioGroup.tsx:1-20`) | `eg-radio-group`; `radioGroupVariants` is public (`index.ts:3`) |
| Tabs | Radix Root/List/Trigger/Content (`packages/ui/src/molecules/tabs/Tabs.tsx:1-30`) | `eg-tabs`; segmented list composes `surfaceVariants` well (`useTabs.ts:59-64`) |
| Input | native input in wrapper, optional icon/Spinner/error glyph (`packages/ui/src/atoms/input/Input.tsx:1-27`) | `eg-input`; native input ref; Field owns label/error copy |
| Link | native anchor or Radix Slot, optional Icon and VisuallyHidden notice (`packages/ui/src/atoms/link/Link.tsx:1-29`) | `eg-link`; child anchor owns href when slotted |

## 3. Public API

No new or changed own prop, event, variant, public marker, ref target or export is proposed; all current types remain in the six `types.ts` files. `className` remains a root-layout-only contract (Link margin/alignment); it does not become arbitrary appearance override permission. Preserve per-part `cn`/`twMerge` behavior and do not infer universal precedence. Representative current defaults and behavioral ownership:

| Component | Observed defaults and API evidence |
| --- | --- |
| Switch | Uncontrolled unchecked, disabled/required false, submitted value `on`; native button ref (`packages/ui/src/atoms/switch/useSwitch.ts:15-18`). |
| Slider | Scalar value, min 0/max 100/step 1; label required, disabled false (`packages/ui/src/atoms/slider/useSlider.ts:35-39`); Radix owns interaction. |
| RadioGroup | Uncontrolled initially unselected; vertical, disabled/required false (`packages/ui/src/atoms/radio-group/useRadioGroup.ts:35-37`). |
| Tabs | `variant='underline'`, `size='md'`, `fullWidth=false`, `labelWrap=false`; first enabled value and automatic activation (`packages/ui/src/molecules/tabs/useTabs.ts:29-41`). |
| Input | md/default/text, loading false; native ref and attributes on the input (`packages/ui/src/atoms/input/useInput.ts:28-32`, `:40-45`). |
| Link | native anchor, `external=false`, `arrow=true`, `variant='plain'`; Slot when `asChild` (`packages/ui/src/atoms/link/useLink.ts:20-26`, `:45`). |

Prop-naming lookup: reviewed [`skills/_shared/prop-naming.json`](../../skills/_shared/prop-naming.json) and [generated registry](../prop-naming.md) by meaning/name/aliases. Existing relevant entries include `primary-value`, `initial-uncontrolled-value`, `interactive-value-change`, `preset-dimensions`, `visual-treatment`, `trailing-arrow`, and `slot-composition`; no new/changed own prop is proposed, so no new usage, semantic ID, exception or convention approval is requested. Existing component-specific types and approvals are not generalized.

## 4. Behavior

Preserve controlled/uncontrolled state, callbacks, form participation, disabled behavior and native/Radix focus and keyboard behavior. Switch keeps checked/unchecked; RadioGroup keeps selection, orientation and group invalid; Slider retains scalar/clamped values and thumb invalid routing; Tabs keeps automatic activation, panel relationships and inactive-content unmounting; Input remains editable during loading unless read-only/disabled; Link retains safe external target/rel, hidden notice and router Slot behavior. No state is mirrored into classes. Preserve each existing non-color cue, invalid border width/tint/glyph, focus precedence, 45% disabled treatment and reduced-motion behavior; do not imply these alone prove accessibility in every context.

## 5. Accessibility

Radix owns the relevant roles, keyboard navigation and state for Switch/Slider/RadioGroup/Tabs; native input/anchor semantics remain. Consumers provide the required names and error descriptions. The selected surface-3 base versus its S0 well is only **1.35:1** as opaque colors; the approved translucent brand border and layered tint still require a measured rendered-state boundary and focus check. Link keeps neon at rest, which fails 4.5:1 for normal text on S1–S3 by owner decision; its plain default has no underline and `arrow` can be false. Neither issue is solved simply by ARIA or by a glow. Do not claim complete visual/contrast conformity; audit a non-color state/link affordance in actual consumer contexts. Focus, disabled, error and selected combinations require browser checks, including against rendered sheen/transparent hosts.

## 6. Appearance

### Token confirmation table

This spec proposes no additional token beyond #425; the following is its complete set of referenced **new** roles, reproduced from the [authoritative approved table and method](semantic-contrast-roles.md#token-confirmation-table). A is approved in every row except the two Link rows, where B is approved. S0/S1/S2/S3 are `#141518` / `#1B1C20` / `#232428` / `#2D2E33`. Ratios are computed opaque-base comparisons, not rendered-pixel or accessibility certification. No light theme is proposed.

| Name | Approved option / value or reference | Intended surface / role | Contrast evidence |
| --- | --- | --- | --- |
| `--color-control-well` | A: `var(--color-surface-0)` = `#141518` | Switch/radio/input/slider well; white and muted ink | 18.26:1 white; 7.17:1 muted |
| `--color-control-boundary` | A: `var(--color-border-control)` = `#7A7B81` | Resting enabled control border against S0/S1/S2/S3 | 4.33 / 4.04 / 3.68 / 3.21:1 |
| `--color-state-selected` | A: `var(--color-action-primary-solid-bg)` = `#FF0036` | Selected border, slider fill, underline against S0/S1/S2/S3 | 4.61 / 4.30 / 3.92 / 3.42:1 |
| `--color-on-selected` | A: `var(--color-action-primary-solid-fg)` = `#000000` | Thumb/dot on selected fill | 5.31:1 on solid; 5.77 / 5.31 / 4.68:1 on gradient stops |
| `--color-state-selected-surface` | A: `var(--color-surface-3)` = `#2D2E33` | Segmented selection on S0 | 13.55:1 white text; 1.35:1 S0 versus S3, not sufficient alone |
| `--color-link-default` | B: `var(--color-fg-brand-raised)` = `#FF0036` | Current neon Link against S0/S1/S2/S3 | 4.61 / 4.30 / 3.92 / 3.42:1; normal text fails 4.5:1 on S1–S3 by owner decision |
| `--color-link-hover` | B: `var(--color-primitive-red-200)` = `#FF8FA6` | Current hover against S0/S1/S2/S3 | 8.46 / 7.89 / 7.18 / 6.28:1 |
| `--gradient-state-selected` | A: `var(--gradient-btn-primary)` = `linear-gradient(180deg, #FF2D57 0%, #FF0036 52%, #EE0031 100%)` | Selected Switch/RadioGroup fill | Black versus stops 5.77 / 5.31 / 4.68:1; bottom versus S3 3.02:1 |
| `--shadow-state-selected` | A: `var(--shadow-btn-primary)` (`packages/tokens/src/theme.css:380`) | Selected bevel/halo | No single ratio for nonuniform shadow; do not use as sole cue |
| `--shadow-state-indicator` | A: `var(--shadow-glow-base)` (`packages/tokens/src/theme.css:352`) | Decorative active underline glow on S0–S3 | No single ratio for nonuniform shadow; selected line uses the solid ratios above |

Existing `--color-fg-secondary`, `--color-fg-muted`, `--color-status-danger`, `--color-status-danger-bg`, `--shadow-well` and `--shadow-focus` remain existing roles, not new tokens; #425 records their contrast limitations. Color utilities below are proposed static Tailwind names, contingent on the actual token build emitting them.

### Per-component mapping and consumer impact

| Component | Current classes with evidence | Approved role mapping and visual impact |
| --- | --- | --- |
| Switch | `bg-surface-0 border-border-control`; checked `border-action-primary-solid-bg bg-[image:var(--gradient-btn-primary)] shadow-[var(--shadow-btn-primary)]`; checked thumb `bg-action-primary-solid-fg` (`packages/ui/src/atoms/switch/types.ts:58-75`). | Well → `bg-control-well`; border → `border-control-boundary`; checked border → `border-state-selected`, gradient/shadow → `--gradient-state-selected`/`--shadow-state-selected`, thumb → `bg-on-selected`. At default values base paint is unchanged. Keep checked/unchecked focus, invalid border/tint and RTL thumb travel unchanged. |
| Slider | Track `bg-surface-0 shadow-[var(--shadow-well)]`; range `bg-fg-brand-default`; thumb `bg-fg-default` and invalid/focus styles (`packages/ui/src/atoms/slider/types.ts:80-90`). | Track → `bg-control-well`, range → `bg-state-selected`; thumb/well shadow/focus/danger unchanged. Default red is unchanged, but existing scoped overrides of `--color-fg-brand-default` may no longer affect the range. Nexo's local track uses `--color-border-control`, so it is not visually identical and must not be removed on this basis. |
| RadioGroup | Item `border-border-control bg-surface-0`; checked primary border/gradient/shadow; indicator `bg-action-primary-solid-fg`; row uses secondary/default ink (`packages/ui/src/atoms/radio-group/types.ts:91-109`). | Map item well/border, checked border/gradient/shadow and dot exactly as Switch. Keep text, group-invalid and focus treatments. Default paint is unchanged. The public `radioGroupVariants` recipe also changes for external callers; preserve its keys and document that impact. |
| Tabs | Underline selected `after:bg-fg-brand-default after:shadow-glow-base`; segmented active `bg-surface-3`, sheen, edge/elevation; `text-fg-secondary`/active `text-fg-default` (`packages/ui/src/molecules/tabs/types.ts:139-156`). Segmented list composes the Surface well (`packages/ui/src/molecules/tabs/useTabs.ts:59-64`; `packages/ui/src/primitives/surface/types.ts:29`). | Underline → `after:bg-state-selected` and `--shadow-state-indicator`. Segmented triggers use `isolate border border-transparent`; active uses `data-[state=active]:border-border-brand`, `data-[state=active]:bg-state-selected-surface`, `data-[state=active]:bg-[image:var(--gradient-sheen)]` and `data-[state=active]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)]`. The active tint uses `data-[state=active]:before:content-['']`, `data-[state=active]:before:pointer-events-none`, `data-[state=active]:before:absolute`, `data-[state=active]:before:inset-0`, `data-[state=active]:before:-z-10`, `data-[state=active]:before:rounded-[inherit]` and `data-[state=active]:before:bg-border-brand`. The existing `--color-border-brand` → `--color-alpha-red-45` = `rgba(255, 0, 54, 0.45)` supplies both border and tint; isolation puts the tint above the existing sheen/S3 and below labels. Keep the Surface well, counts and focus precedence. Verify border sizing, stacking and selected/focus contrast; this changes segmented appearance but does not assert pixel parity with Nexo. #415 rethemes the same existing role for scoped custom accents. |
| Input | `border-border-control bg-surface-0 text-fg-default placeholder:text-fg-muted`, well/focus/danger; code variant `bg-primitive-neutral-950` (`packages/ui/src/atoms/input/types.ts:62-72`, `:92-104`). | Default border → `border-control-boundary`, default well → `bg-control-well`; keep ink, hover, focus, invalid treatment, icons and darker code well unchanged. The default visual is unchanged; code remains #0A0A0A, not the new S0 alias. |
| Link | `text-fg-brand-raised hover:text-primitive-red-200`; underlined variant `border-border-brand hover:border-fg-brand-default` (`packages/ui/src/atoms/link/types.ts:71-79`). | B: resting ink → `text-link-default` (`#FF0036`), hover → `text-link-hover` (`#FF8FA6`); underlined hover border → `border-state-selected`, rest underline remains `border-border-brand`. Default colors and visual appearance stay unchanged. Existing broad app anchor rules may still mask Link; scoped custom-accent changes are opt-in. |

### Resolved appearance decisions

**D1 — mapping versus a new API: A.** Preserve existing variants and state logic; the selected border/tint is the explicit D3 appearance change, not a new prop. #415 owns runtime theming.

**D2 — Link colors: B.** Preserve neon rest/red-200 hover and the owner-accepted S1–S3 normal-text contrast failures, consistent with [`brand-text-neon-decision.md`](brand-text-neon-decision.md).

**D3 — segmented selected state: B.** Use the existing `--color-border-brand` for the border and non-interactive tint above S3 and its sheen, with existing elevation. Selected-cue contrast, stacking, focus and visual parity remain to be measured; a decorative glow does not establish contrast. Any new token value is **pending owner value**.

**D4 — migration and scoped colors: A.** Retain local overrides until actual rendered/keyboard/contrast parity is proven. Root-declared aliases can resolve before descendant overrides, including Nexo's gradient/shadow and body-portalled dialog (`/home/egdev/proyectos/nexo/apps/hub/src/theme/accent.css:11-15`, `:45-53`, `:66-70`). Follow #415's explicit scope and portal contract.

### Expected-design visual reference and files

No approved expected-design capture was supplied for these changes. VIS-Switch, VIS-Slider, VIS-RadioGroup, VIS-Tabs, VIS-Input and VIS-Link: image/source, viewport, device scale, browser/version, loaded fonts, theme, motion/transparency settings, crop, date, tool, hashes and recoverable human approval are **Pending**. Agree source and scenarios before authorized real-browser component-zone captures; do not infer expected design from current implementation or app CSS. Visual conformity is **Not evaluated**. The six existing component file responsibilities stay unchanged; **No stylesheet** is proposed for any of them, and no additional internal module or dependency is proposed.

## 7. Acceptance criteria

The following are proposed checks, not observed passing results. Every component's existing test and story file is in its respective source directory. Use real controls and computed CSS in addition to static utility assertions; stories alone do not establish behavior.

| ID | Observable future acceptance | Planned tests / stories and browser checks | Observed |
| --- | --- | --- | --- |
| A-01 Switch | Checked/off use the roles above; state, form, invalid/focus, disabled, RTL and name remain intact. | `Switch.test.tsx`: state/form/invalid/RTL and compiled utility assertions; `Switch.stories.tsx` States/Invalid on S0–S3, focus and disabled, VIS-Switch. | Pending |
| A-02 Slider | Range uses selected, track uses well; scalar keyboard/pointer, valueText, form, invalid and focus remain intact. | `Slider.test.tsx`: keyboard and controlled/invalid regression; `Slider.stories.tsx` Default/Controlled/Invalid and coarse pointer on surfaces, VIS-Slider. | Pending |
| A-03 RadioGroup | Checked circle/dot and unchecked well use roles; public per-part recipe keys, native form, orientation, invalid and disabled are retained. | `RadioGroup.test.tsx`: role/keyboard/form/recipe/invalid tests; `RadioGroup.stories.tsx` Default/Horizontal/Invalid/Disabled, VIS-RadioGroup. | Pending |
| A-04 Tabs | Underline uses its role; segmented uses S3, the Surface well and approved existing-token active border/tint; selection, counts, focus, overflow and both layout opt-ins remain. | `Tabs.test.tsx`: automatic activation, panels, compiled utilities, segmented and underline; `Tabs.stories.tsx` Default/Segmented/FullWidthLabelWrap, focus/disabled, VIS-Tabs. Measure the composed selected cue, border sizing and focus; do not mark visual accessibility passed without evidence. | Pending |
| A-05 Input | Default well/border map without altering code well, editability, loading, native ref or invalid/focus composition. | `Input.test.tsx`: default/code, controlled/loading, native/invalid/ref; `Input.stories.tsx` Default/Code/Invalid/ReadOnly, VIS-Input. | Pending |
| A-06 Link | Rest/hover use approved B values with no default visual change; underlined state uses selected border; native and Slot links retain destination, arrow, focus and safe external notice. | `Link.test.tsx`: default/underlined, native/Slot, external safety and focus/reduced-motion; `Link.stories.tsx` Default/Underlined/AsChild/States against S0–S3 and surrounding copy, VIS-Link. Review non-color affordance with arrow disabled. | Pending |
| A-07 Integration | Approved aliases appear in native token CSS and compiled UI utilities; preserved old tokens/markers, scoping limitations and consumer visual differences are documented; no silent removal of app CSS. | In the implementation plan under the same delegation: token/compiled-CSS and packaged-consumer checks without consumer Tailwind; exercise local override and portal cases under #415; inspect Nexo/Quorb migration separately. | Pending |
| A-08 Visual and gates | Expected design, contrast/interaction evidence and visual adoption are bound to the finalized snapshot; the implementation plan follows the same delegation. | Authorized real-browser captures, comparable conditions and owner review; #426 lists `pnpm test`, `pnpm typecheck`, `pnpm lint` and Storybook review for implementation. | Pending |

The #425 regeneration path is `pnpm tokens` → `@egdev/tokens` Vite build → `packages/tokens/dist/tokens.css`; the source is `packages/tokens/src/theme.css` and the compiled output is never hand-edited. No tests, builds, visual captures or app migrations were run for this documentation change.

## Implementation notes — #426

The component recipes now reference the roles in the mapping above. The earlier source descriptions and pending observations record the pre-implementation baseline; they are not visual verification of this implementation. No token values, public markers, props, exports, Radix behavior or app styles were changed.

Default role aliases preserve the previous Switch, Slider, RadioGroup, Input and Link paint; Link retains the owner-approved neon rest and red-200 hover. Segmented Tabs deliberately gain the approved existing-brand border and tint. Input's code variant retains its darker well. The public `radioGroupVariants` object keeps its keys, but consumers of its item and indicator recipes receive the new role classes.

Old token names remain available, but overrides of an older name, such as `--color-fg-brand-default`, need not propagate to a role alias inherited from a parent scope. Keep Nexo and Quorb overrides until consumer-specific rendered and interaction parity is separately verified; scoped accents and portals belong to #415. Selected-tab stacking, composed boundary and focus contrast, Link's non-color affordance, and visual conformity remain **Not evaluated** until the planned real-browser checks and any expected-design adoption are completed.
