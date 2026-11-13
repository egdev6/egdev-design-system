# NavList v0.3 — desktop recipe amendment

**Status:** The visual amendment and four token additions were approved in conversation; this file materializes those terms, not an already implemented recipe. The owner has not separately reviewed or signed this file's exact payload hash; no repeat approval of the identical recipe, token values or digest is required. Visual approval remains pending. The [implementation plan](implementation-plan.md) is independently approved for implementation; see the [approval record (L3)](../../../../odd/tasks/sidebar-antena-look.md#l3--implementation-approval). Implementation has not yet occurred; no changed or expanded recipe is authorized.

- **Approval evidence:** Exact owner reply: “aprobado, escribe en español”. Receiving Pi session `01a1d553-794e-7368-828f-3ec25fe17c6c`; recoverable preceding proposal: Engram project `egdev-design-system`, observation `26426`; related [issue #401](https://github.com/egdev6/egdev-design-system/issues/401). The reply approves the preceding proposal, not a later unseen file or digest.
- **Baseline:** [v0.2 implementation and authority](../v0.2/implementation.md), [#92 full snapshot](https://github.com/egdev6/egdev-design-system/issues/92#issuecomment-6244803502), SHA-256 `961548bf38ad7f1d49cf96b10e4a0fe9d95a16ab08d561183d248a72844dc375`, and [owner approval](https://github.com/egdev6/egdev-design-system/issues/92#issuecomment-6251528502). Preserve the [related Sidebar product-identity amendment](../../sidebar/v0.1/product-identity-amendment.md).
- **Snapshot identity:** version `0.3`; `contentSHA256: cfb1b0a4dbf1978131a9918a82342cea15ae9fafb63be8db3020a74f85c0b85f`; `visualHashes: Pending`; `approvalReference: conversation above, approved recipe and token terms`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/92`; `latestPublishedComment: Pending`. The digest identifies this transcription, not an independent approval receipt; visual approval remains pending.
- **Hash convention:** SHA-256 over UTF-8 bytes from the `## 1. Purpose and scope` heading through EOF, inclusive of the final LF; LF line endings. All tracking metadata above that heading is excluded. This identity establishes content integrity, not owner approval.

## 1. Purpose and scope

Replace NavList's default desktop appearance for existing consumers; retain its navigation responsibility and API. This amendment supersedes only conflicting v0.2 appearance and target-size implementation details. It neither introduces an optional variant nor creates a mobile strip. The host owns responsive presentation; AppShell is unchanged. Reuse the existing molecule and Surface rather than add a component or migrate consumers.

## 2. Anatomy and composition

Keep the named native `nav > ul > li` structure, links, static captions and one-level Radix Collapsible groups, with their existing Icon, Badge, StatusDot and VisuallyHidden compositions. Preserve public `eg-nav-list` and current-row `eg-surface` markers and existing exports; the current-row marker is decorative, not an interactive part or new public selector. The [Sidebar v0.2 amendment](../../sidebar/v0.2/desktop-recipe-amendment.md) preserves the surrounding product identity, scrolling and footer.

## 3. Public API

No new, changed or removed props, variants, refs, exports or routing API. Keep the existing layout-only root `className` contract and `cn()` merge limits; no part-level appearance override or universal last-class-wins guarantee. No new naming convention, registry mutation, dependency or consumer migration is proposed.

## 4. Behavior

Keep consumer-supplied `aria-current="page"`, native destinations and the original `onNavigate` entry/event; the application owns route selection and modified-click behavior. Radix owns independent controlled/uncontrolled disclosure and relationships; a hidden current link does not auto-open or mark its group. Preserve finite non-negative integer counts including zero, blank/invalid metadata omission, signals, warnings and label-only truncation, as specified in v0.2.

## 5. Accessibility

Keep the named landmark, native link and trigger semantics, keyboard order, disclosure/focus behavior and visible focus treatment. Current state retains `aria-current`, not color alone. Links and disclosure triggers have at least 44px by 44px targets, including at narrow host widths; the host remains responsible for placement and visibility. Respect reduced motion; do not implement a separate focus or keyboard engine.

## 6. Appearance

| Part/state | Approved desktop recipe |
| --- | --- |
| Link row | Barlow `13.5px/1.2`, weight `400`; vertical/horizontal padding `7px 8px`; leading-icon gap `10px`. |
| Group caption/trigger | Barlow Condensed `14px/1`, weight `700`, uppercase, tracking `0.14em`. |
| Leading icon | `16px`, inheriting its row text color in default, hover and current states. |
| Hover / current | Hover uses `surface-2`. Current uses `surface-2` composed through Surface, retaining sheen, hairline, light edge and elevation-1 two-layer shadow, plus a `2px` brand-red marker. This component-specific current-row tone is an approved exception to Material's usual `surface-3` selected tone, not a global Material rewrite. |

The approved recipe includes zero row tracking and a marker at logical inline-start, including RTL, rather than Antena's physical-left marker. The concrete implementation mechanics and code have not been reviewed. The marker must not replace Surface paint or the focus cue. No handmade inset marker shadow, flat replacement, new stylesheet or inline appearance.

**Approved token additions**, not yet added to source:

| Token | Value |
| --- | --- |
| `--text-nav-row` | `13.5px` |
| `--text-nav-group` | `14px` |
| `--text-nav-group--line-height` | `1` |
| `--text-nav-group--letter-spacing` | `0.14em` |

Reuse `--font-sans`, `--font-display`, row `--text-label-default--line-height` (`1.2`) and `--text-label-default--letter-spacing` (`0`), row weight `--text-body-muted--font-weight` (`400`), and group weight `--text-label-eyebrow--font-weight` (`700`). The existing eyebrow size, line-height and tracking are not the group recipe. Use existing icon/color/radius/spacing tokens; no additional tokens are implicitly approved. **No stylesheet.** Static token-backed geometry is subject to actual compilation and browser verification.

**Evidence, not visual approval:** The inspected Antena `app/src/styles/panel.css` lines 61, 65–70 describe these group/row values, 16px currentColor icons, surface-2 hover and current sheen/edge with a physical-left inset marker. Its compact row has no 44px minimum; the design system deliberately retains one. The source shorthand does not establish row tracking. No expected-design capture or conditions were approved for this amendment; `visualHashes` remain Pending. See the [visual evidence guide](../../../design/README.md). Visual conformity: **Not evaluated**.

## 7. Acceptance criteria

All checks below are planned, not observed; see the [plan](implementation-plan.md) for the test and browser matrix.

| ID | Observable promise and planned evidence |
| --- | --- |
| N1 | Existing consumers receive the new default without API/marker changes; public-interface and packed-consumer regressions. |
| N2 | Link and group typography, exact padding/gap and icon size/color match the table; emitted CSS and computed browser styles. |
| N3 | Hover and current are surface-2; current retains Surface sheen, hairline and shadows plus a 2px brand-red start marker; emitted CSS and LTR/RTL browser states. |
| N4 | Links and triggers meet 44px minimum targets; focus remains visible and independent of current/hover; browser geometry, keyboard and zoom checks. |
| N5 | Native routing, Radix disclosure, counters, metadata and truncation remain unchanged; interaction regressions and browser checks. |
| N6 | Source-derived expectations are not screenshots: comparable approved visual references, conditions and owner review are still pending. |
