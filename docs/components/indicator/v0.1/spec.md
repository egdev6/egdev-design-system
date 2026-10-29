# Component contract — Indicator

- **Version / status:** v0.1 — Draft; T4 / S6, issue #178. Specifications only.
- **Approval / recovery:** This file is the recoverable canonical snapshot; `.playwright-mcp/specs/iteration/indicator.md` is an identical draft copy. Agent-applied recommendations are not approval of this exact contract, its visuals, a migration or an implementation plan.
- **Current situation / pending decisions:** Extract the network marker from Avatar; do not change Badge. Promise choices are applied below. Exact-snapshot approval, visual evidence and the separate Avatar amendment/plan remain pending.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: sha256:381cc8bfda9258cdc634181db4b11ba2615c692c53c0cde67323c4476b2e86f9`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/178`; `latestPublishedComment: Pending — local snapshot, no comment published`.
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from `## 1. Purpose and scope` through EOF, LF endings and final newline; tracking metadata above that heading is excluded.

## 1. Purpose and scope

- **Need / non-goals:** A passive dot, count or network glyph anchored to any corner of consumer content. The wrapper positions a marker without cloning or changing the child. Not a label pill (Badge #52), standalone lifecycle signal (StatusDot #71), action, tooltip, progress measurement or live notification engine.
- **Cataloging decision / alternatives:** **Extract; atom in `@egdev/ui`**, proposed `packages/ui/src/atoms/indicator/`. Reuse: Avatar's marker is private; Badge is a textual label; StatusDot carries its own lifecycle vocabulary/pulse. Variant: anchoring unrelated content changes Badge's responsibility. App composition would duplicate Avatar's existing marker across buttons/navigation. Extract the generic passive marker/anchor concept; no independent control coordination justifies a molecule. A native positioning wrapper is supporting geometry, not a second UI concept.
- **Inspected evidence:** `packages/ui/src/atoms/avatar/{types.ts,useAvatar.ts,Avatar.tsx,index.ts}`, `packages/ui/src/atoms/badge/types.ts`, `packages/ui/src/atoms/icon/types.ts`, `packages/ui/src/primitives/surface/types.ts`, `packages/ui/{package.json,src/index.ts}`, catalog and token source. Avatar actually exports `Avatar`/`AvatarProps`/`AvatarSize`; `avatarBadgeVariants` is a source export, not a package-barrel export. Badge actually exports its distinct label-pill API. No Indicator export exists. Shared documents' historical “Gauge only” availability statements are stale relative to these inspected files; they are not used to deny current exports or infer compliance.

### Agent-applied decisions

- D1: Shape API? → `variant="dot" | "count" | "icon"`, default dot, using the existing visual-treatment name. Branch-specific count/glyph inputs prevent meaningless combinations.
- D2: Wrapper? → `Indicator` owns a native `div` with inline-flex layout, one internal marker and consumer `children`; no Slot, public ref or asChild. Flow/phrasing content is supported, including a block child; fragments/multiple nodes form one measured anchor box. The child is never cloned. Table/list/select structure must stay valid: wrap the content inside its valid cell/item, never insert a div where HTML forbids it.
- D3: Corners? → Physical `top-left`, `top-right`, `bottom-left`, `bottom-right`, default top-right. These names do not flip in RTL. Marker sits outside the corresponding edge by `--space-1`; no collision detection, portal or arbitrary offsets.
- D4: Meaning? → Marker is always decorative (`aria-hidden`, no pointer events); the child/control name or adjacent readable text conveys its meaning. No live region, tab stop, automatic naming or count announcement. A dot must never be the only status cue.
- D5: Count? → Finite non-negative integer; zero and invalid values suppress only the marker. `max` defaults to 99; finite positive integer required, invalid runtime max falls back to 99. Display `max+` when exceeded, while consumer text conveys the actual count. No locale formatter, pulse, hide/show timer or network lookup.
- D6: Material? → Propose a bounded compact signal recipe with existing tokens, distinct from a control or Surface box: circular/pill fill, token hairline, sheen and light edge; count/icon have two-layer elevation 1. Neutral icon uses canvas/default foreground, matching Avatar's existing ink. This contract proposes the recipe; it does not borrow Gauge's exception or authorize general flat replacements.

## 2. Anatomy and composition

| Part | Responsibility | Native element / primitive | Allowed content |
| --- | --- | --- | --- |
| Root / anchor | Relative inline-flex geometry; preserves child semantics | `div` | Consumer flow content; no assumption about child's props/ref |
| Content | Original anchor content in normal flow | Consumer nodes, unchanged | Avatar, button, image, navigation content or another valid subtree |
| Marker | Corner decoration, excluded from hit testing and accessibility | `span aria-hidden="true"` | Dot, normalized count text, or Icon |
| Glyph | Decorative system glyph for icon branch | `Icon` | `badgeIcon: IconName`; no interactive children |

- **Radix:** None for passive positioning; this is not a floating interaction. Icon internally uses its installed accessibility primitive. No dependency addition. Indicator must not wrap focusable content in `aria-hidden` or intercept child events.
- **Public markers:** Root `eg-indicator`; no new public part-selector API. Preserve `eg-avatar` and, during the Avatar migration, its existing `eg-avatar__badge` marker on the actual marker. Legacy CSS/consumers are untouched here.

## 3. Public API

Own props are proposed, not implemented. Use `type`, never `interface` or `any`.

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | Yes | Meaningful anchor content | Measured together without cloning |
| `variant` | `'dot' \| 'count' \| 'icon'` | No for dot; yes for other branches | `dot` | Discriminator, not interactive state |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger' \| 'brand'` | No | `danger` | Token color family; icon migration explicitly uses neutral |
| `size` | `'sm' \| 'md'` | No | `sm` | Marker geometry, not child size |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | No | `top-right` | Physical corner |
| `count` | `number` | Count branch only | No default | Finite non-negative integer; zero/invalid hides marker |
| `max` | `number` | No; count branch only | `99` | Positive integer overflow threshold |
| `badgeIcon` | `IconName` | Icon branch only | No default | Network/origin glyph; not a leading-icon slot |
| Own events | Not applicable | — | None | Child events remain child-owned |

- **Union:** dot `{variant?: 'dot'; count?: never; max?: never; badgeIcon?: never}`; count `{variant: 'count'; count: number; max?: number; badgeIcon?: never}`; icon `{variant: 'icon'; badgeIcon: IconName; count?: never; max?: never}`; shared children/tone/size/position plus compatible native root props. Unsupported untyped variant/glyph inputs are caller errors, not permission to invent a fallback glyph.
- **Native props / refs:** Inherit `ComponentPropsWithoutRef<'div'>` omitting redeclared children, dangerous HTML, style and root role/tabIndex/contentEditable/aria-hidden overrides. Compatible `id`, `data-*`, `aria-describedby` and ordinary events go to the wrapper, not to the child. No public ref. Naming a child control is the consumer's job; wrapper attributes cannot substitute for that. No public marker className or custom ring prop.
- **Controlled / uncontrolled:** Not applicable; all inputs are passive presentation. No callbacks for incoming count updates.
- **Exports:** `Indicator`, `IndicatorProps`, `IndicatorVariant`, `IndicatorTone`, `IndicatorSize`, `IndicatorPosition`; no public CVA/hook/marker export. No edits to Badge's exports or props.

### Prop conventions and reviewed evidence

Registry lookup by meaning, name and aliases: [source](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md), [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry). Registry remains untouched.

- Reuse `visual-treatment` → variant; `surface-material-tone` → tone; `preset-dimensions` → size; `corner-badge-icon` → badgeIcon, narrowly retaining the network/origin glyph meaning. Do not reuse `leading-icon` for an icon-only marker, `icon-placement` for a corner, `floating-side` for in-flow anchoring, `character-counter` for a notification count or `primary-value` for an auxiliary count.
- New proposals, all `status: proposed`, `approval: null`, aliases/exceptions empty: `anchor-corner-position` / `position` (IndicatorPosition; selects a physical corner of a measured non-floating anchor, not tooltip placement); `indicator-count` / `count` (number; supplementary item total, not a selected value or character limit); `indicator-count-cap` / `max` (number; display-overflow threshold, not validation or a data limit). Source symbol `IndicatorProps` does not yet exist: implementation usage/revision is pending, not a fabricated source hash.
- Reviewed existing source: `{path: packages/ui/src/atoms/avatar/types.ts, symbol: AvatarProps, revision: sha256:b0a6b163639218e7177cd7254c78a4724ef73658ed0861d18cc96e5e6735c3cb}` confirms size/badgeIcon; `{path: packages/ui/src/atoms/badge/types.ts, symbol: BadgeProps, revision: sha256:81d97cd46835e08a2ed5d846d352642ef9230661b4dcfe04d7e4be921c7d6f3e}` confirms tone/variant meanings. These are observations, not new approvals. New convention approval must separately bind `convention:<id>` and its canonical convention hash; approving this spec does not mutate the registry.

### Avatar #51 amendment note — proposed, not executed

- Keep Avatar's `src`, `label`, `size`, `badgeIcon`, `paused`, no-ref/no-asChild contract and its accessible naming unchanged. Indicator stays hidden inside Avatar's named image subtree; network/paused meaning still belongs in the Avatar label or adjacent text. Keep Radix photo/fallback behavior.
- Replace the private badge subtree/geometry with Indicator's shared marker/anchor recipe. Avatar still emits its existing root, not an extra public wrapper. Package-internal reuse may import marker/position CVA from Indicator's `types.ts`; it does not require exposing private override props on Indicator or a second React helper/module. The later approved plan must demonstrate the same normalized geometry on the actual Avatar root.
- Map Avatar sm/md/lg → Indicator sm (marker `size-4.5`, glyph `size-2.75`); Avatar xl → Indicator md (`size-5.5`, glyph `size-3.25`); physical bottom-right with the existing `-right-1 -bottom-1`; neutral canvas/default ink. Preserve `--eg-avatar-ring` token-valued local ring and fallback `--color-bg-surface` at the Avatar boundary. Avatar-specific legacy ring remains a bounded migration adapter, not a new Indicator prop.
- Preserve `eg-avatar__badge`, paused inheritance and supported className behavior; compare the existing 18/22px geometry, ring and image crop before removing private `avatarBadgeVariants`/`avatarBadgeIconVariants`. Those are not package-barrel exports; direct source imports still need impact review. The compact Material recipe adds the proposed light edge/elevation: this is an explicit visual amendment, not a claim of byte-identical appearance or already approved migration.
- Record this amendment against the existing #51 in a separately authorized versioned comment; no silent issue/body edit, code migration or approval is performed here. Badge #52 is unchanged in all branches.

## 4. Behavior

| Initial state / action | Expected result | Event |
| --- | --- | --- |
| Default render | Danger dot at top-right; children unchanged | None |
| Change corner or RTL direction | Requested physical corner, no child reordering | None |
| Count 1 / 99 / 100, max 99 | `1` / `99` / `99+` | None |
| Count 0 / negative / fractional / NaN / Infinity | Marker absent, anchor still present | None |
| Invalid max, positive valid count | Normalize max to 99, then format | None |
| Icon branch | Neutral only when explicitly selected; specified glyph, hidden semantics | None |
| Child clicked or keyboard-focused | Original action/focus, marker cannot capture pointer or focus | Child event only |
| Marker changes | No automatic name update, live announcement or focus movement | None |

- **Representation:** `data-variant`, `data-tone`, `data-position` are descriptive variants; no invented open/selected state or mirrored classes. Zero suppression is not a lifecycle status.
- **Limits:** Host must allow overflow and sufficient separation from neighboring controls. Ancestor clipping is not escaped. Wrapper can affect flex/grid layout: consumers place it deliberately and give a composite subtree a suitable anchor footprint. No arbitrary dynamic geometry or numeric dimensions.

## 5. Accessibility

- Child retains its original role/name, handlers, focus and disabled behavior. Marker and glyph are decorative, non-focusable and pointer-transparent; no status/alert role. For a count button, e.g. visible “Inbox” plus name “Inbox, 120 unread messages”; for a dot provide readable state elsewhere. The decorative glyph alone is never network identity.
- No keyboard behavior: native/Radix child controls own activation/navigation. No extra tab stop, focus ring clipping or control target shrinkage. Consumer retains ≥44px mobile control targets.
- No announcement guarantee. Consumer owns a distinct live update only if needed, avoiding duplicate count speech in both a live region and a changing control name. Contrast/non-color checks and multi-instance labeling are planned, not inferred from tokens or screenshots.

## 6. Appearance

| Axis | Values / geometry | Default / restrictions |
| --- | --- | --- |
| variant | dot, count, icon | dot; branch contract above |
| size | sm / md | sm; dot `size-2` / `size-2.5`, count/icon minimum `size-4.5` / `size-5.5` |
| tone | neutral, info, success, warning, danger, brand | danger; every variant supports every tone |
| position | Four physical corners | top-right; offset one spacing token outward |

- **Tokens / Material:** Root relative inline-flex, align-middle and overflow-visible, no paint. Marker absolute, grid-centered, rounded-full with `--radius-full`, token `--border-width` hairline and `--gradient-sheen` / `--shadow-edge`. Count/icon add `--shadow-elev-1` alongside edge; dot is a tiny signal with edge only, not an elevated container. Neutral fill `--color-bg-canvas`, foreground default; semantic fills `--color-status-info/success/warning/danger` with `--color-fg-on-status`; brand fill `--color-action-primary-solid-bg` and its solid foreground. Status colors are never handwritten; this is a proposed component-specific recipe, not generic Surface cloning. No handwritten shadows or gradients.
- Count uses `font-sans text-label-default tabular-nums`, horizontal `--space-1` padding and minimum width equal to its height; it grows for capped text, never a fixed square that clips digits. Icon sm/md uses 2.75/3.25 spacing-scale steps; all fractional dimensions derive from the existing `--spacing: var(--space-1)`. Dot needs no font. Existing `--focus-width` supplies the separation ring width; generic ring color is the host's `--color-bg-surface` token. Avatar adapter retains its existing token-valued ring override only.
- **Motion / fallbacks:** Static; no pulse, transforms for animation, blur or hover/pressed lift. No overlay/solid fallback needed. Corner offsets use static spacing utilities; no inline appearance, interpolated class names or Gauge geometry exception.
- **Class composition:** All CVA in `types.ts`; hook composes every supported part with `cn()`. Root className supports outer margins/alignment/grid placement, not marker position, tone/shape, child control appearance or overflow clipping. No per-part override API. Test supported merges and marker retention; twMerge recognizes utility groups, not arbitrary CSS selectors or universal last-class precedence.
- **Six meaningful files:** `types.ts` (union/types, root/marker/glyph/position CVA); `useIndicator.ts` (normalization, count text, per-part cn, typed results); `Indicator.tsx` (JSX only); `Indicator.test.tsx`; `Indicator.stories.tsx` (`Atoms/Indicator`, autodocs, no play); `index.ts` (named exports). **No stylesheet.** No extra internal modules, tokens or dependencies. Own JSDoc controls: select for variant/tone/size/position/badgeIcon, number for count/max, false plus concrete story reason for ReactNode children; defaults only for real constants, repeated on union branches as required.

### Expected-design visual reference

| Visual ID | Real image / English description | Scenario | Source / version | Status |
| --- | --- | --- | --- | --- |
| VIS-01 | Pending — dot/count/icon markers on four child corners | Principal anchored-marker matrix; sm/md and capped counts | Owner-supplied https://sf-design-system.netlify.app/?path=/docs/atoms-badge--docs; upstream version unknown | visual reference: pending; URL supplied, not browser-inspected or adopted as EGDEV paint |
| VIS-02 | Pending — Avatar network marker before/after extraction | Four Avatar sizes, neutral icon, paused and photo fallback | Inspected local Avatar source; no screenshot | Proposed migration comparison; no visual approval |

- Playwright MCP is unavailable. No captures, PNG paths or visual hashes are invented. Viewport/DPR/browser/fonts/theme/motion/transparency/crop/date are unrecorded; a later component-zone capture must record them under this version's directory. Upstream reference informs anatomy only; EGDEV tokens/Material win over pixel-inferred values. VIS-01 relates to AC-01/02/07; VIS-02 to AC-06. **visual: not evaluated**.

## 7. Acceptance criteria

All runtime methods are planned after separate spec and plan approval, not executed in this specs-only task.

| ID | Observable promise | Planned test / method | Story / visual | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | Default dot, all four corners and sm/md geometries retain original child subtree | Indicator.test.tsx render/DOM identity; browser bounds in LTR/RTL | Default, Corners, Sizes; VIS-01 | Source inspection only; runtime not run |
| AC-02 | Count normalization, zero suppression, max fallback and overflow follow section 4 | Boundary/rerender table: 0/1/99/100, negative/fraction/non-finite and invalid max | Counts, InvalidCounts; VIS-01 | Pending |
| AC-03 | Union rejects count/icon conflicts; exports/native props match the bounded contract | Type fixtures, export/package checks | Branch examples | Pending |
| AC-04 | Marker is hidden and noninteractive, child action/name/focus survives | Role/name/userEvent, pointer hit-test and focus-ring browser check | OnButton, OnNavigation | Pending |
| AC-05 | No own state/events/live announcer; update preserves focus and child event | Rerender/callback/focus assertions and source review | UpdatingCount | Pending |
| AC-06 | Proposed Avatar adapter preserves props, marker, offsets, ring and fallback/paused behavior | Avatar.test.tsx regression plus source-import review; before/after capture | AvatarSizes, Paused; VIS-02 | Existing adapter source inspected; migration not run |
| AC-07 | Material, token geometry, capped count reflow and class merge limits hold without clipping | CVA/cn + computed CSS; narrow/zoom and host-background review | Tones, LongCount; VIS-01 | Pending |
| AC-08 | Static CVA ships CSS; own controls/docgen work; consumer needs no Tailwind compiler | CSS build/scan, AST/docgen/enhancer/browser Controls and packed React 18/19 consumer | Default and complex children stories | Pending |
| AC-09 | Badge API/label-pill recipe and unrelated sources stay unchanged | Scoped diff + future Badge regression | Existing Badge examples, no new capture claimed | No Badge writes in this task |

### Spec closure

- [x] Seven blocks and agent-applied promise decisions recorded; catalog extraction justified.
- [x] Registry reuse/new proposals, source evidence and approval separation explicit; registry unchanged.
- [x] Avatar amendment and compatibility impact named without executing a migration.
- [ ] Real visual references/conditions and exact-snapshot owner approval pending.
- [ ] Avatar amendment approval and implementation plan approval pending independently.

**Next step:** owner reviews this digest-bound draft and the Avatar amendment; capture/adopt actual visuals, resolve naming proposals separately, then approve a bounded implementation/migration plan. No code, token/dependency changes, GitHub mutation or commit is authorized by this document.
