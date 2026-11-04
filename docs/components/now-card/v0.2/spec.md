# Component contract — NowCard

- **Version / status:** 0.2 — **DRAFT**, awaiting exact owner approval (G4); not implemented by this document.
- **Approval / recovery:** Pending for this exact snapshot and identified visuals. The effective v0.1 baseline is [spec.md](../v0.1/spec.md), as amended by [badge order](../v0.1/badge-order-amendment.md), its [owner approval](../v0.1/badge-order-approval.md), and [body growth](../v0.1/body-grow-amendment.md). Historical draft metadata does not undo those decisions. The implementation plan requires separate approval.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: Pending`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/276`; `latestPublishedComment: Pending` for this snapshot.
- **Hash definition:** SHA-256 of UTF-8 LF bytes from the exact `## 1. Purpose and scope` heading through EOF, including the final newline; metadata above is excluded. Approval must identify the version, digest, visuals and scope; no digest implies approval.

## 1. Purpose and scope

A passive reusable current-activity article with consumer-supplied status, heading, copy and optional footer detail/action; no domain copy, polling, scheduling, built-in meter, whole-card activation or strip layout. Reuse the existing molecule rather than add a variant or new component: `packages/ui/src/molecules/now-card/{types.ts,useNowCard.ts,NowCard.tsx,index.ts}` and `packages/ui/src/index.ts` expose it and its parts. Its coordinated card concepts belong in `@egdev/ui`'s molecule layer. The v0.1 rationale rejects ModuleCard, Stat and ListItem as different responsibilities and repeated ad-hoc composition as duplication.

**Exact v0.2 delta (S2 / A2):** a badge-presence marker on the root alongside `data-size`, and a heading CVA with size and badge-presence axes. With no badge the heading gets `pt-6` (19.2px) at both `md` and `sm`; with a badge it gets `pt-0`. The unchanged badge wrapper is `px-6 pt-6 pb-3` at both sizes. No prop, type, order, breakpoint, token, dependency or stylesheet change. Badge cards must remain pixel-equivalent to the base build. All effective v0.1 promises remain unless explicitly changed here; the separate [NowStrip v0.2](../../now-strip/v0.2/spec.md) records the mixed-row constraint.

## 2. Anatomy and composition

| Part | Element and responsibility | Content |
| --- | --- | --- |
| Root `eg-now-card` | `article`, surface and named passive frame | badge, heading, consumer children in order |
| `eg-now-card__badge` | optional `span` before heading | consumer non-interactive meaningful `statusBadge` node, typically Badge |
| Heading | `h2`–`h6`, generated id | plain title |
| `eg-now-card__body` | growing `div` | one or two copy paragraphs, no controls or badge |
| `eg-now-card__foot` | banded `div` | one detail and/or one Link or named IconButton, at most one action |
| `eg-now-card__detail` | `span` | short sentence, `<b>` emphasis; `<time dateTime>` for an instant |

No Radix is needed for passive grouping. No child inspection, `asChild`, ref, reordering or nested controls. The documented public markers remain stable; legacy consumers are not migrated.

## 3. Public API

| Prop | Type | Required | Default / rule |
| --- | --- | --- | --- |
| `title` | `string` | yes | nonblank visible heading and article name; blank warns in development and renders nothing |
| `level` | `2 \| 3 \| 4 \| 5 \| 6` | no | `3`; invalid runtime rank falls back to 3, visual step unchanged |
| `size` | `'md' \| 'sm'` | no | `md`; `sm` is compact, never truncates or hides content |
| `statusBadge` | `ReactNode` | no | undefined, null or boolean omit wrapper; other nodes render verbatim before heading, with no interactive descendants |
| `children` | `ReactNode` | no | body then footer, consumer supplied; absent parts create no wrappers |
| Part `children` | `ReactNode` | yes | Body, Footer and Detail each accept their documented content above |
| `className` | `string` | no | root or part layout-only, as in §6 |

**Naming:** [registry](../../../../skills/_shared/prop-naming.json) / [generated view](../../../prop-naming.md): `heading-title` → `title`, `heading-level` → `level`, `preset-dimensions` → `size`, `leading-status-badge` → `statusBadge` (approved separately). Reviewed source: `packages/ui/src/molecules/now-card/types.ts`, `NowCardProps`, `sha256:0456c698ab96fb7522dc8676a36fac8de860b87b71eb1389e0785f7e14ee4b1c`. No new concept or exception; children and className are composition/native. Neither this snapshot nor its approval changes registry approval.

**Native / refs:** article attributes forward except children, title, role, tabIndex, contentEditable, dangerouslySetInnerHTML, aria-label, aria-labelledby, aria-disabled, aria-selected, aria-pressed and aria-live; hook strips protected semantics at untyped boundaries and supplies its generated name. No ref or asChild. **Baseline discrepancy:** v0.1 says `style` is protected, but current types and hook forward it. Preserve the v0.1 no-inline-appearance promise; do not claim runtime enforcement. Owner choice: retain the protected-style promise and correct enforcement in separately scoped work, or amend that promise to document forwarding without authorizing inline appearance. This is recorded evidence, not authorization to change U1 source scope.

Controlled/uncontrolled: not applicable; no internal interactive state. Existing named exports and API remain; React 18/19 compatibility is a future packed-consumption check, not inferred from types.

## 4. Behavior

| Situation | Expected observable result |
| --- | --- |
| Title only | named article and heading, no empty badge/body/footer |
| Badge present | badge → title → body → footer in DOM and visual order; wrapper unchanged |
| Badge absent | no wrapper; heading owns `pt-6`, including compact size |
| Blank title | development warning `NowCard requires a non-empty title. Nothing was rendered.` and no article |
| Long title/copy/detail | wraps, footer wraps; no clamp, clipping, hiding or tooltip substitution |
| Footer with one child | leading aligned; detail and action share row and wrap without overlap |
| Hover or status changes | no root activation, motion, polling, announcements or emitted event; child action owns behavior |

Root `data-size` remains; proposed `data-badge` records actual slot presence using the existing undefined/null/boolean rule and is not an interactive state. Body `flex-1` supports bottom-aligned footer bands in stretched valid cards. Consumers own status words, content, dates, outline, links, accessible controls and grid placement.

## 5. Accessibility

Native article is named only by the generated heading via unique `useId()` and `aria-labelledby`; consumer chooses the appropriate heading rank. Badge text remains accessible, never color-only or hidden. No root tab stop, key handling, live region or announcement. Footer links/buttons own native keyboard activation, visible focus (`--shadow-focus`), names and coarse-pointer targets of at least 44px; icon-only controls require a label. Consumer owns meaningful time and any dynamic announcement. No decorative meter is implied.

## 6. Appearance

| Axis | Values | Rule |
| --- | --- | --- |
| size | `md`, `sm` | `md` default; `sm` has smaller heading/body and padding |
| badge presence | present, absent | proposed heading `pt-0` / `pt-6` (19.2px), both sizes |
| level | 2–6 | semantics only, default 3 |

Root composes existing `surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' })`; footer composes `surface-0`, elevation 0, no padding/radius at Surface level, then hairline, `rounded-b-xl`, `px-6 py-3` (`sm`: `px-5 py-2`). Body is `flex-1 p-6 text-body-large text-fg-secondary` (`sm`: `p-4 text-body-default`). Heading keeps `m-0 min-w-0 px-6 text-heading-small text-fg-default wrap-anywhere`, `sm` uses `px-4 text-body-large`, plus the new inset axis. Badge `px-6 pt-6 pb-3` stays unchanged. Detail uses `font-display text-meta uppercase tabular-nums text-fg-muted` and token-backed emphasized `<b>`. These are existing Material frame and footer recipes, not Gauge's exception or a new flat replacement. No root motion, dynamic geometry, inline appearance, handwritten shadows or gradients.

`className` on root supports outer margin, width and parent placement only; Body/Footer support local placement, margin and width, Detail margin and width. Each merges last with `cn()` for recognized utility conflicts only; no paint, content hiding, reordering or general override permission. `twMerge` does not guarantee CSS cascade, arbitrary selector or variant precedence; verify supported surfaces with shipped CSS and legacy coexistence.

Six meaningful files retain their roles: `types.ts` types/CVA; `useNowCard.ts` validation, ids, context and composition; `NowCard.tsx` JSX; test and stories; `index.ts` exports. **No stylesheet**; no extra internal module or token/dependency proposal.

### Expected-design visual reference

| ID | Image / scenario | Source / status |
| --- | --- | --- |
| VIS-01 | Pending capture: both `md` and `sm`, with/without badge and one/two-line titles | Owner Image#12, conversation provenance only; no repository image, conditions or approval recoverable |

Agree an authorized read-only source, browser/tool and conditions, then capture component zones under this v0.2 directory with `capture.json`, viewport, DPR, browser/version, theme, fonts, motion, crop, timestamp and hashes per [capture guide](../../../design/README.md). Proposed capture is not automatically expected design; obtain owner adoption. Historical [v0.1 VIS-02](../v0.1/spec.md#expected-design-visual-reference) retains its original version and limits, not a new capture. Visual conformity **Not evaluated** until comparable approved evidence exists.

## 7. Acceptance criteria

All checks below are planned, not observed. Tests and implementation belong to U1, not this draft.

| ID / promise | Planned check |
| --- | --- |
| A2-AC1 | Packed own heading computed padding-top 19.2px without badge at `md`/`sm`, 390 and 1280px; root `data-badge` agrees with presence, emitted Tailwind rule exists in `dist/styles.css`. |
| A2-AC2 | Base/current badge-card visual differential at both sizes; wrapper remains `px-6 pt-6 pb-3`, heading `pt-0`, existing title/body classes and order preserved. |
| A2-AC3 | Browser check one- and two-line headings and body rhythm at both sizes; VIS-01 pending. |
| NC-01/02 | Accessible article/heading rank and unique name; invalid title exact development warning and no output. |
| NC-03/04/A1–A3 | Badge-first readable node, absent cases, body/footer markers, density and all supplied content; body `flex-1` retained. |
| NC-06/07 | Footer single-child alignment, detail/time and exactly one supplied action in keyboard order with accessible name. |
| NC-08/09 | Narrow long content wraps; no passive-card hover motion or root tab stop, including reduced motion. |
| NC-10 / native | Docgen controls, protected attributes and supported per-part merge/cascade checks; investigate style discrepancy above without claiming enforcement. |

**Closure:** Pending exact owner approval and capture evidence. A2 proposes no new gate beyond G4; U1 also remains subject to existing G1 and separate plan approval. Resolve the recorded baseline discrepancy and the A8 heading-alignment conflict before asserting those promises. This draft authorizes no code, capture, publication or registry change.
