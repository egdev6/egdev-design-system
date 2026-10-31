# Component contract — Indicator

- **Version / status:** v0.2 Draft — preparation only; no runtime authorization.
- **Approval / recovery:** [Proposal approval](https://github.com/egdev6/egdev-design-system/issues/178#issuecomment-6516514764) approves extraction, expressly not an unspecified API. The supplied fully paginated issue snapshot was inspected. [Preparation assignment](https://github.com/egdev6/egdev-design-system/issues/178#issuecomment-6522795748) and [roadmap](https://github.com/egdev6/egdev-design-system/issues/8#issuecomment-6522805790) do not approve this exact contract, visuals, naming proposals or plan.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: sha256:5a7f18f79329d4cc3fc37ca4ad4ce823cc11e321cdc11936b1f032d7947c4eb6`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/178`; `latestPublishedComment: Pending — this snapshot is unpublished`.
- **Hash definition:** SHA-256 of UTF-8 payload from the actual whole-line heading `## 1. Purpose and scope` through EOF, LF and final newline; metadata above that heading is excluded. Companion plan/amendment use the same payload rule with their named first headings; HTML/JSON use whole-file bytes. Approval must identify exact digests and actual visual hashes.
- **Related drafts:** [Plan](implementation-plan.md), [static specimen](specimen.html), [capture request](capture-request.json), [bounded Avatar amendment](../../avatar/v0.2/indicator-amendment.md). Historical [v0.1](../v0.1/spec.md) remains unchanged.

## 1. Purpose and scope

One passive supplementary dot, item count or origin/network icon anchored to consumer content. **Extract; atom in `@egdev/ui`, proposed `packages/ui/src/atoms/indicator/`.** The wrapper is supporting geometry, not coordination of independent controls. No tooltip, lifecycle vocabulary, status engine, pulse, action, portal, notification scheduling or Badge migration.

Reuse/variant/composition review: Avatar exposes no standalone anchor; Badge is a label pill; StatusDot owns lifecycle states. Changing their responsibilities is not an appearance variant. App-only composition would duplicate an already embedded marker. Extract shared marker geometry from Avatar, with a new standalone positioning wrapper; reuse the existing Icon. Surface is actually exported on this baseline, but cannot express colored compact signals without unsupported appearance overrides: propose the bounded recipe in §6 instead, not a Surface clone.

Actual baseline is `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`. Public Avatar, Badge, Icon and Surface were confirmed in `packages/ui/src/index.ts` and their sources; no Indicator exists there. Shared documents' historical “Gauge only” statements do not describe this checkout's actual exports and do not establish compliance. No shared documentation is changed.

**Explicit v0.1 deltas proposed:** (1) Avatar shares geometry only and retains its existing identity-badge paint, rather than gaining Indicator sheen/border/elevation; (2) counts/max use safe integers, not every imprecisely representable finite integer; (3) native semantics exclusions below are exact and enforced for untyped input. Other default/branch/corner recommendations are retained. These are recommendations, not owner decisions.

## 2. Anatomy and composition

| Part | Element / responsibility | Content |
| --- | --- | --- |
| Anchor | Native `div`, relative inline-flex, align-middle, overflow-visible, no paint | Required `children`, rendered directly in order without cloning |
| Marker | Absolute `span`, `aria-hidden="true"`, pointer-events-none, select-none | Empty dot, decimal text, or decorative Icon |
| Glyph | Existing Icon, no label, non-focusable SVG | Closed `IconName` input |

Public root marker: `eg-indicator`. No public marker selector/slot/className API. Own variants are described by `data-variant`, `data-tone`, `data-position`, `data-size` on the anchor; no lifecycle `data-state`. A hidden zero/invalid count removes only the marker, not the anchor or child. Render marker after children; no z-index or overlap priority promise.

No Radix positioning primitive: this is passive absolute geometry, not a floating interaction. Icon already owns its AccessibleIcon use. No Slot, `asChild`, ref, context, extra React helper or dependency. Multiple children/fragments share one flex anchor footprint; consumers group them if they need another layout. Flow content including block children is valid; place the div inside a valid cell/item, never directly in a table/list/select or inside phrasing-only content such as a paragraph.

## 3. Public API

Proposed named exports only: `Indicator`, `IndicatorProps`, `IndicatorVariant`, `IndicatorTone`, `IndicatorSize`, `IndicatorPosition`. Types are component-specific, not aliases that migrate Badge/Avatar. No public hook/CVA/marker exports from either barrel.

| Own prop | Exact type | Required / default / rule |
| --- | --- | --- |
| children | `ReactNode` | Required, no default; caller supplies a meaningful anchor; null/empty nodes render an empty anchor without throwing |
| variant | `'dot' \| 'count' \| 'icon'` | Optional/default `dot` only in dot branch; required literal in count/icon branches |
| tone | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger' \| 'brand'` | Optional, constant `danger`, including icon branch (neutral must be explicit) |
| size | `'sm' \| 'md'` | Optional, constant `sm`; marker size, not child size |
| position | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | Optional, constant `top-right`; physical, unchanged in RTL |
| count | `number` | Required in count branch, otherwise `never`; no default |
| max | `number` | Optional/count branch only, otherwise `never`; constant `99`, invalid runtime input falls back to 99 |
| badgeIcon | `IconName` from existing Icon | Required in icon branch, otherwise `never`; no default, origin/network meaning only |

Exact branch restrictions: dot `{variant?: 'dot'; count?: never; max?: never; badgeIcon?: never}`; count `{variant: 'count'; count: number; max?: number; badgeIcon?: never}`; icon `{variant: 'icon'; badgeIcon: IconName; count?: never; max?: never}`. Shared props above intersect this union.

Native base is `Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'dangerouslySetInnerHTML' | 'style' | 'role' | 'tabIndex' | 'contentEditable' | 'autoFocus' | 'aria-hidden' | 'aria-label' | 'aria-labelledby' | 'aria-live' | 'aria-atomic' | 'aria-relevant'>`. Remaining native props (including className, title, id, dir, data attributes, descriptions and ordinary events) target the anchor, not the child. No ref or asChild. Runtime filtering also discards the omitted keys, ref/asChild and own props from passthrough; component-owned descriptive data attributes win. Never spread untyped contentEditable/aria-hidden onto interactive children. Unsupported enum/glyph inputs remain caller errors; no invented fallback glyph/coercion.

No controlled/uncontrolled state or own callbacks. Incoming props are passive inputs, not change events. Native event bubbling remains normal; the wrapper does not activate anything.

### Prop naming review

Consulted [registry](../../../../skills/_shared/prop-naming.json), [generated reference](../../../prop-naming.md) and [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry) by meaning, name and aliases. Reuse `visual-treatment → variant`, `surface-material-tone → tone`, `preset-dimensions → size`, `corner-badge-icon → badgeIcon` within their current meanings. Children/native/className need no own convention. Do not apply `leading-icon`, `icon-placement`, `floating-side`, `primary-value` or `character-counter` to a corner notification marker.

Propose exactly three new entries, each `status: proposed`, `approval: null`, aliases/exceptions empty: `anchor-corner-position → position` (IndicatorPosition, physical corner on a non-floating anchor); `indicator-count → count` (number, supplementary item total); `indicator-count-cap → max` (number, visual overflow threshold, not a validation/data limit). No matching name/alias was found. Registry writes and global promotion are not part of preparation; owner must separately approve these exact semantic conventions before integration. No naming exceptions or alias migrations proposed.

Reviewed usage evidence (`source.path`, public `symbol`, whole-file `revision`):

| Path | Symbol / confirmed input | revision |
| --- | --- | --- |
| packages/ui/src/atoms/avatar/types.ts | AvatarProps; size, badgeIcon | sha256:b0a6b163639218e7177cd7254c78a4724ef73658ed0861d18cc96e5e6735c3cb |
| packages/ui/src/atoms/badge/types.ts | BadgeProps; tone, variant | sha256:81d97cd46835e08a2ed5d846d352642ef9230661b4dcfe04d7e4be921c7d6f3e |
| packages/ui/src/atoms/icon/types.ts | IconProps / IconName; closed glyph set and size overrides | sha256:1ea0dd7b8a4e42f90f6bd352edf968b9765eea9745ff8ff0ff6b5b9d0957ec13 |

`IndicatorProps` has no runtime source yet: its source revision is Pending, never a future fabricated hash. Convention approval is separate from contract/visual/plan approval.

## 4. Behavior

| Input/action | Exact result | Own event |
| --- | --- | --- |
| Defaults | Danger sm dot, top-right | None |
| Corner change / RTL | Physical named corner; relevant top/bottom and left/right edges at negative `--space-1`, no translation | None |
| count 1 / 99 / 100, max 99 | `1` / `99` / `99+` | None |
| count 0 (including -0), negative, fraction, non-finite or unsafe integer | Marker absent; anchor/children persist | None |
| max positive safe integer | Display count unchanged through max; above max display decimal max plus `+` | None |
| max zero, negative, fraction, non-finite, unsafe or wrong runtime type | Use 99; never clamp count to a data limit | None |
| Valid count/max | ASCII base-10 decimal, no grouping/locale formatter; no exponent within safe range | None |
| Icon | Chosen existing glyph; no child/glyph label synthesis | None |
| Child click/focus/disabled/update | Child retains original handlers/name/focus/disabled behavior; marker cannot receive pointer/focus | None |

Validation uses number type and `Number.isSafeInteger`; count must be positive to display, max positive to apply. No parsing strings, rounding or absolute value. Safe integer upper bound is `Number.MAX_SAFE_INTEGER`. A large chosen max can produce long text: grow horizontally, no truncation or invented cap. There is no automatic suppression for a disabled child or lifecycle/pending state.

Consumer owns sufficient anchor content/neighbor clearance, layout, overflow ancestors, actual count wording and updates. No collision detection, automatic RTL flip, portal escape, timers, animation or network lookup.

## 5. Accessibility

Marker is always decorative and hidden, with no status/alert/live role. Child role/name/ref/DOM identity remain consumer-owned. Example: visible “Inbox” with control name “Inbox, 120 unread messages”; the `99+` decoration is not the actual count announcement. Dot meaning needs persistent readable text, not color alone; origin icon meaning belongs in the child name/adjacent text. Semantic warning/danger indications need appropriate readable context/icon, not this dot alone.

No own keyboard/focus behavior or tab stop. Child native/Radix controls own keyboard and disabled behavior; no wrapping aria-hidden, clipped focus or target shrinkage. Consumer controls retain their mobile target requirements. Count updates never announce automatically or move focus; an optional consumer live region must avoid duplicate speech. AT/browser checks are planned, not established by the static board.

## 6. Appearance

All branches support all six tones and both sizes; appearance defaults are exactly §3.

| Geometry | sm | md |
| --- | --- | --- |
| Dot diameter | `size-2` = `--space-2` (8px) | `size-2.5` = 2.5 × `--space-1` (10px) |
| Icon marker diameter | `size-4.5` = 4.5 × `--space-1` (18px) | `size-5.5` = 5.5 × `--space-1` (22px) |
| Count height/min-width | Same 18px; width auto | Same 22px; width auto |
| Glyph | `size-2.75` = 11px | `size-3.25` = 13px |

Border-box sizing. Count has horizontal `--space-1` padding, no vertical padding, centered nowrap `font-sans text-label-default tabular-nums`; size presets are minima and font zoom must not clip text (use minimum height for count). No numeric dimension prop, inline appearance or Gauge exception.

**Proposed compact signal recipe, approval pending:** full token radius, solid `--border-width` / `--color-border-hairline`, `--gradient-sheen`, `--shadow-edge`; icon/count additionally combine existing `--shadow-elev-1` (two layers). Separation uses an outline of `--focus-width` in `--color-bg-surface` with zero offset, not a handwritten ring shadow. The outline is decorative, not focus. Neutral fill `--color-bg-canvas` / `--color-fg-default`; info/success/warning/danger use respective `--color-status-*` / `--color-fg-on-status`; brand uses `--color-action-primary-solid-bg` / `--color-action-primary-solid-fg`. No custom shadow/gradient, new token, blur, well, hover or pressed treatment. Static and solid under reduced motion/transparency; no fallback transition is needed. Root paints nothing; child owns its own Material and focus.

This recipe is Indicator-only, not global Material permission. Avatar uses only shared position/geometry/glyph recipes and keeps its already implemented identity decoration per the amendment; it does not get this border, outline, sheen or elevation. This supersedes the unapproved v0.1 Avatar paint recommendation explicitly.

CVA in `types.ts`; hook calls per-part `cn()`. Root className is merged last for outer margins, alignment and grid placement only. No arbitrary appearance/position/display/padding/overflow/marker overrides. Supported example: `ms-1 ms-2` resolves to `ms-2` while retaining `eg-indicator`/geometry. Marker/glyph have no override props. twMerge cannot enforce every unsupported class, selector or cascade; this is documented support, not sanitization or universal last-class-wins.

Six meaningful files: `types.ts` (union and root/position/geometry/glyph/paint CVA), `useIndicator.ts` (validation/text, passthrough filtering, typed per-part cn results), `Indicator.tsx` (JSX only), `Indicator.test.tsx`, `Indicator.stories.tsx` (`Atoms/Indicator`, autodocs), `index.ts` (named exports). **No stylesheet**, no extra modules. Internal geometry CVA may be source-imported by Avatar but is not re-exported from package barrels. No token/dependency change.

Own JSDoc controls: select for variant/tone/size/position/badgeIcon, number for count/max, false with concrete story reason for ReactNode children. Repeat appropriate directives across union declarations, without fake defaults on required props. No manual argTypes/renderer or play workaround.

### Expected-design visual reference

The [self-contained static board](specimen.html) is an authored design proposal, not React, a screenshot, runtime evidence or an adopted reference. It loads only `/tokens.css`, which the parent supplies from the canonical build. Existing `user`/`linkedin` glyph descriptors are copied for illustration only. Avatar gradient is a reconstruction of current token-stop utility paint, not newly approved art.

| ID | Proposed component-zone scenario / English alt text | Source/status |
| --- | --- | --- |
| VIS-01 | Default danger dot; counts 1/99/99+, zero suppression; origin icon; both sizes | specimen #branches; Proposed, PNG/hash Pending |
| VIS-02 | Four physical corners, LTR/RTL, six tones | specimen #corners and #tones; Proposed, PNG/hash Pending |
| VIS-03 | Avatar before/after sm/md/lg/xl; paused; host ring override | specimen #avatar-comparison; identical intended appearance, Proposed, PNG/hash Pending |
| VIS-04 | Authored focused/disabled child context and wide count | specimen #contexts; illustration only, Proposed, PNG/hash Pending |

[Capture request](capture-request.json) proposes viewport/DPR/theme/font/media/crop conditions and records limits. Actual browser/version/date/fonts/crop/token-CSS hash and PNG hashes are Pending. Parent owns hosting, real Playwright captures, inspection and owner adoption. Historical upstream URL in v0.1 is anatomy context only; no browser inspection/adoption claimed. **Visual conformity: Not evaluated.**

## 7. Acceptance criteria

All runtime checks below are planned after separate approvals. Source inspection/hash/link checks are preparation evidence, not runtime passes.

| ID | Observable promise | Planned functional/static check | Story / visual | Observed |
| --- | --- | --- | --- | --- |
| IN-01 | Exact defaults, presets, four physical corners; no cloned/reordered children | Hook/DOM identity and LTR/RTL computed bounds | Default, Sizes, Corners; VIS-01/02 | Source proposal only |
| IN-02 | Branch union, native exclusions, exports and untyped filtering match §3 | Strict positive/negative type fixtures; forbidden props runtime table | Branches | Pending |
| IN-03 | Every count/max boundary follows §4; marker alone suppressed | Render/rerender table including safe limits, strings, -0, NaN, infinities, fractions | Counts, InvalidCounts; VIS-01/04 | Pending |
| IN-04 | Passive marker; no duplicate name/live region; child events/focus/disabled survive | Role/name/userEvent, rerender identity, real pointer/focus check | OnButton; VIS-04 | Pending |
| IN-05 | Six tones, token recipes, merge limits and long-count/zoom clearance | CVA/cn assertions; emitted CSS and real computed layout/contrast | Tones, LongCount; VIS-02/04 | Pending |
| IN-06 | Avatar props/DOM/name/load/fallback/paused/ring/geometry stay compatible | Existing 14-test suite plus adapter regressions; before/after browser bounds/paint | Existing Avatar scenarios; VIS-03 | Actual files inspected; tests not rerun |
| IN-07 | Six files/no stylesheet; static utilities and docs ship without Tailwind consumer compiler | Build/CSS scan; AST/docgen/enhancer + browser Controls; packed React18/19 types/SSR/CSR/CSS | All own prop rows | Pending |
| IN-08 | Badge, legacy and unrelated APIs remain untouched | Scoped diff, existing Badge regressions at integration | Existing Badge stories | No Badge writes |

### Closure and remaining approvals

All seven blocks have concrete recommendations. Review the safe-integer refinement, native exclusions, physical corners/default danger/sm/99, Indicator-only signal recipe and geometry-only Avatar compatibility amendment as exact contract choices. Approve new naming concepts separately; obtain real component-zone PNGs/conditions and explicit adoption; approve [implementation plan](implementation-plan.md) independently. No exact contract, visual, naming or plan approval is claimed, and no runtime work is eligible yet.
