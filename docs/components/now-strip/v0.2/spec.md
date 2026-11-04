# Component contract — NowStrip

- **Version / status:** 0.2 — **DRAFT**, awaiting exact owner approval (G4); proposal, not implementation.
- **Approval / recovery:** The effective baseline is [v0.1 spec](../v0.1/spec.md), approved in [#297 comment 6597592303](https://github.com/egdev6/egdev-design-system/issues/297#issuecomment-6597592303), with its historical draft header interpreted through that record. [NowCard body-grow amendment](../../now-card/v0.1/body-grow-amendment.md) resolved the former footer feasibility stop. Approval of this exact v0.2 snapshot and visuals is pending; plan approval is separate.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: Pending`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/297`; `latestPublishedComment: Pending` for this snapshot.
- **Hash definition:** SHA-256 of UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading through EOF, including the final newline; tracking metadata above is excluded. A digest is not approval.

## 1. Purpose and scope

A passive, named current-activity group with a responsive collection of consumer-authored NowCards. No domain data, polling, live announcements, built-in meter or section shell. `packages/ui/src/organisms/now-strip/{types.ts,useNowStrip.ts,NowStrip.tsx,index.ts}` and `packages/ui/src/index.ts` expose the existing organism and type. Reuse the organism and its card composition: a card alone is not a labelled responsive group; a card variant would add region responsibility, while repeated application composition duplicates this generic hierarchy. No extraction or new component is necessary. Organism level in `@egdev/ui` follows its regional layout responsibility.

**Exact v0.2 delta (S8 / A8):** no NowStrip prop or recipe changes. Compact no-badge cards inherit NowCard A2's `pt-6` (19.2px) top inset; a mixed row with one `statusBadge` and two without is the standing story/proof. Footer alignment is checked for valid direct cards with growing bodies and footers. `mb-3` label gap remains 9.6px; `mb-4` was rejected as unrelated. Preserve all effective v0.1 promises and its local inclusive 860px viewport rule.

**Blocking contradiction requiring owner resolution:** A8-AC1 asks that headings and footers align in a mixed badge/no-badge row, but A2 also requires badge cards to remain pixel-identical, badge before heading, while no-badge heading gets only 19.2px inset; a visible badge plus its `pb-3` puts its heading lower. No strip recipe change can ensure equal heading top coordinates under those requirements. Owner choices: (1) retain A2 badge parity and interpret alignment as card top insets and footer bands, explicitly revise A8-AC1's heading-alignment promise; or (2) require actual heading-top alignment and approve a revised A2/A8 recipe and its impact on badge-card parity. Neither choice is assumed. Capture evidence and exact G4 approval remain pending; do not claim A8-AC1 passed.

## 2. Anatomy and composition

| Part | Element / responsibility | Content |
| --- | --- | --- |
| `eg-now-strip` | `div` with `role="group"`, bottom boundary | visible label then grid |
| Label | internal `p`, `useId()` for group name | decorative `StatusDot state="live" pulse={false}` then localized label |
| Grid | internal responsive `div` | ordered direct consumer `NowCard size="sm"` children |
| Cards | named articles, consumer authored | optional badge, heading, body, optional detail/action |

The only stable strip marker is `eg-now-strip`; do not emit legacy `__label`, `__dot`, or `__grid` markers. No Radix is needed for passive grouping; actions retain their own native behavior. No cloning, child inspection, forced size, injected copy or fixed count. Consumer supplies direct cards without wrappers, margins or explicit heights that defeat stretch; arbitrary invalid descendants are not validated.

## 3. Public API

| Prop | Type | Required | Rule |
| --- | --- | --- | --- |
| `label` | `string` | yes | localized visible group name; blank/whitespace warns and suppresses group |
| `children` | `ReactNode` | yes | ordered direct compact NowCards; null/boolean/empty produce a named empty grid without placeholder |
| `className` | `string` | no | outer margin, width and parent placement only |

**Naming:** [registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md): approved `accessible-name` → `label`, not `group-caption`; `collection-items` refers to structured rendered data, not supplied children; `slot-composition` is Radix asChild, not this collection. No new proposal or exception. Reviewed source `packages/ui/src/organisms/now-strip/types.ts`, `NowStripProps`, `sha256:1713d7a33c2810d71a554b2d42b60e2c95298647883bbc81e58d1c500f835bcb`. Convention approval is independent of spec approval.

**Native / refs:** compatible `div` props forward except children, role, aria-label, aria-labelledby, aria-live, tabIndex, dangerouslySetInnerHTML and style; hook strips protected attributes even at untyped boundaries. No ref or asChild is promised. No controlled state or events; child interactions remain child-owned. Existing exports remain; React 18/19 packed compatibility requires evidence, not type inference.

## 4. Behavior

| Situation | Observable result |
| --- | --- |
| Valid label and direct cards | named group, label then cards in supplied order; no injected content or events |
| Blank label | development warning `NowStrip requires a non-empty label. Nothing was rendered.`; no group, dot or cards |
| Empty children | named group, empty grid and no placeholder |
| Viewport ≤860px / >860px | one / three equal `minmax(0,1fr)` columns, respectively; no reorder |
| Uneven valid cards | direct cards stretch per row; with a growing body and footer in each card, footer bands pin to card bottoms; no guarantee for missing or out-of-contract parts |
| Long text / many cards | natural wrapping and additional rows without pagination or truncation |
| Action | supplied link/button owns focus and activation; no strip handler |

No status inference, timer, live region, automatic focus, animation or card size override. Host owns valid headings, keys, labels, URLs, dates, announcement and reading surface.

## 5. Accessibility

The group name is the visible label linked by a unique `useId()`, stable across rerenders; it is not a landmark, `role="status"` or live region. The static live dot is `aria-hidden` and carries no independent meaning. Child cards retain named articles, readable status and appropriate heading rank. Tab/Enter and visible focus belong to supplied links or named icon actions; no root tab stop or nested controls. Consumers own time semantics, informative meter alternatives and announcements. Browser contrast, zoom/reflow, touch target and assistive-technology checks remain planned rather than inferred from a capture.

## 6. Appearance

| Axis | Values / rule |
| --- | --- |
| viewport | `[@media(width<=860px)]:grid-cols-1`; otherwise `grid-cols-3`, `gap-5`, `items-stretch` |
| card density | consumer supplies `size="sm"`; no strip size prop |
| badge presence | card-owned; 19.2px no-badge top inset proposed in NowCard v0.2 |

Root is unpainted on the host-owned Grafito reading surface, with `m-0 pb-6 border-b-[length:var(--border-width)] [border-bottom-style:solid] border-b-border-hairline`; no background, image, shadow or Gauge frame exception. Label is `m-0 mb-3 flex items-center gap-2 font-display text-meta uppercase text-fg-secondary`; grid is `grid grid-cols-3 gap-5 items-stretch [@media(width<=860px)]:grid-cols-1`. The separate NowCard owns its Material surface-1 frame and surface-0 footer. StatusDot's 10px glowing static dot and solid cards differ from the Foundation source's static dot and glass cards. No Pixel, meter, new token/dependency, dynamic geometry or inline appearance. A future footer meter needs its own approved card amendment; it is not an arbitrary slot grant here.

Root `className` merges last through `cn()` for outer margin, width and parent placement only. Label and grid do not expose className surfaces. No paint, padding, order or visibility overrides are supported; `twMerge` covers recognized utility conflicts, not selector specificity or cascade. Verify shipped legacy bundle and unchanged legacy fixtures: root margin, padding and border, as well as internal label/dot/grid declarations and the responsive boundary. No legacy edits or presumed CSS-layer precedence.

Six meaningful existing files retain roles: `types.ts` API/CVA; `useNowStrip.ts` validation, id and composition; `NowStrip.tsx` JSX; tests; stories; `index.ts` exports. **No stylesheet**, conditional on the existing approved utility/cascade contract; no extra internal module or new dependency.

### Expected-design visual reference

| ID | Image / scenario | Source / status |
| --- | --- | --- |
| VIS-01 | Pending capture: mixed row, one badge and two absent, each with footer, uneven copy | Owner Image#17, conversation provenance only; no repository capture or recoverable conditions |
| VIS-02 | Pending capture: same composition at narrow width | Source and conditions to be agreed; no image or approval yet |

Follow [capture guide](../../../design/README.md): agree authorized read-only source and tool, then component-zone capture with viewport, DPR, browser/version, theme, fonts, motion, crop, date, `capture.json` and SHA-256; adoption is separate from capture. Historical [v0.1 VIS-01/02](../v0.1/spec.md#expected-design-visual-references) retain their source version, hashes and limits and do not establish v0.2 expected design. Visual conformity **Not evaluated** pending comparable approved evidence.

## 7. Acceptance criteria

All checks are planned, not observed; U1 carries implementation and story changes.

| ID / promise | Planned check |
| --- | --- |
| A8-AC1 | Mixed row with valid body/footer on all three cards: inspect heading and footer coordinates in packed browser build. Actual heading alignment conflicts with A2 parity; owner resolution above required before a passing criterion can be specified. |
| A8-AC2 | Packed no-badge `sm` own heading computed top padding is 19.2px; A2 verifies both sizes and emitted CSS. |
| A8-AC3 | Browser grid geometry at 390, 859, 860, 861 and 1280px; inclusive one-column threshold preserved. |
| NS-01/02 | Role/name and unique stable ids; exact warning and empty output for blank label; empty group, ordered direct cards, no cloning or data injection. |
| NS-03/05 | Decorative static dot hidden from accessibility tree, no live region/root tab stop, named card headings and child action keyboard/focus behavior. |
| NS-04 | Uneven valid cards stretch within each row; long content wraps and multiple rows preserve order; footer test applies only when each card has growing body and footer. |
| NS-06/08 | Actual shipped CSS, host register, bottom boundary, legacy controls and supported root className/native forwarding and protected semantics. |
| NS-07/09 | No meter/Pixel dependency; six files, docgen controls, emitted utilities, packed React 18/19 consumers without consumer Tailwind; browser controls and accessibility checks. |

**Closure:** G4 exact approval, capture and conflict resolution remain pending. U1 also requires existing G1 and separate plan approval; this draft introduces no new gate. No source, token, registry, capture or remote write is authorized here.
