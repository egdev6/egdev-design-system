# NavList v0.3 — desktop recipe amendment

**Status:** The original desktop recipe, its four token additions and the [implementation plan](implementation-plan.md) were approved and implemented; see the [approval record (L3)](../../../../odd/tasks/sidebar-antena-look.md#l3--implementation-approval). The owner subsequently approved the compact-row, group-spacing and count revision below in [S9](../../../../odd/tasks/sidebar-antena-look.md#specs) and [L21](../../../../odd/tasks/sidebar-antena-look.md#l21--owner-visual-review-reopens-the-recipe). The owner subsequently requested the S10 current/hover refinement in [L23](../../../../odd/tasks/sidebar-antena-look.md#l23--t5-checks-green-owner-requests-closer-antena-match). T5 implements these revisions; the exact file payload hash is not an independent approval receipt. Visual approval remains pending.

- **Approval evidence:** Exact owner reply: “aprobado, escribe en español”. Receiving Pi session `01a1d553-794e-7368-828f-3ec25fe17c6c`; recoverable preceding proposal: Engram project `egdev-design-system`, observation `26426`; related [issue #401](https://github.com/egdev6/egdev-design-system/issues/401). The reply approves the preceding proposal, not a later unseen file or digest.
- **S9 approval evidence:** The owner selected all three options: “Filas compactas (~30 px)” — “Quitar el mínimo de 44 px y la separación entre filas. Cumple WCAG 2.2 AA (24 px), pero contradice la regla de 44 px del contrato; requiere enmienda.”; “Rótulos de grupo como Antena” — “8 px laterales alineados con los iconos; 18 px arriba y 6 px abajo, 4 px arriba en el primer grupo.”; “Contadores en monoespaciada” — “11,5 px, peso 600, color atenuado. Requiere aprobar un token nuevo para el tamaño.” See [S9](../../../../odd/tasks/sidebar-antena-look.md#specs) and [L21](../../../../odd/tasks/sidebar-antena-look.md#l21--owner-visual-review-reopens-the-recipe); source: Antena `app/src/styles/panel.css:61-74`.
- **S10 approval evidence:** The owner wrote “sigue sin ser igual [Image#2] -borde izquierdo redondeado -fondo con gradiente -Hover con sutíl acento de icono y fondo gris claro [Image#4]”. See [S10](../../../../odd/tasks/sidebar-antena-look.md#specs) and [L23](../../../../odd/tasks/sidebar-antena-look.md#l23--t5-checks-green-owner-requests-closer-antena-match) for the screenshot pixel sampling and scoped changes; the reference is Antena's rounded inset 2px start edge, sheen and plain hover fill.
- **Baseline:** [v0.2 implementation and authority](../v0.2/implementation.md), [#92 full snapshot](https://github.com/egdev6/egdev-design-system/issues/92#issuecomment-6244803502), SHA-256 `961548bf38ad7f1d49cf96b10e4a0fe9d95a16ab08d561183d248a72844dc375`, and [owner approval](https://github.com/egdev6/egdev-design-system/issues/92#issuecomment-6251528502). Preserve the [related Sidebar product-identity amendment](../../sidebar/v0.1/product-identity-amendment.md).
- **Snapshot identity:** version `0.3`; `contentSHA256: a8a99ce8b493b7ef8f07e6a183a941540a6079c35e67f7653b584ae301cdf4df`; `visualHashes: Pending`; `approvalReference: conversation above, approved recipe and token terms`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/92`; `latestPublishedComment: Pending`. The digest identifies this transcription, not an independent approval receipt; visual approval remains pending.
- **Superseded digests:** Original payload `cfb1b0a4dbf1978131a9918a82342cea15ae9fafb63be8db3020a74f85c0b85f` was superseded by S9; S9 payload `effe083b41e33ecdfb7f712207fe0aef59d8b61cd2de2c1a6a0766a08a927703` is superseded by this S10 revision. The revision's digest identifies its transcription, not separate approval of a hash.
- **Hash convention:** SHA-256 over UTF-8 bytes from the `## 1. Purpose and scope` heading through EOF, inclusive of the final LF; LF line endings. All tracking metadata above that heading is excluded. This identity establishes content integrity, not owner approval.

## 1. Purpose and scope

Replace NavList's default desktop appearance for existing consumers; retain its navigation responsibility and API. This amendment supersedes only conflicting v0.2 appearance and target-size implementation details. It neither introduces an optional variant nor creates a mobile strip. The host owns responsive presentation; AppShell is unchanged. Reuse the existing molecule and Surface rather than add a component or migrate consumers.

## 2. Anatomy and composition

Keep the named native `nav > ul > li` structure, links, static captions and one-level Radix Collapsible groups, with their existing Icon, Badge, StatusDot and VisuallyHidden compositions. Preserve public `eg-nav-list` and current-row `eg-surface` markers and existing exports; the current-row marker is decorative, not an interactive part or new public selector. The [Sidebar v0.2 amendment](../../sidebar/v0.2/desktop-recipe-amendment.md) preserves the surrounding product identity, scrolling and footer.

## 3. Public API

No new, changed or removed props, variants, refs, exports or routing API. Keep the existing layout-only root `className` contract and `cn()` merge limits; no part-level appearance override or universal last-class-wins guarantee. No new naming convention, semantic registry mutation, dependency or consumer migration is proposed; reviewed source revisions may be refreshed without changing naming policy.

## 4. Behavior

Keep consumer-supplied `aria-current="page"`, native destinations and the original `onNavigate` entry/event; the application owns route selection and modified-click behavior. Radix owns independent controlled/uncontrolled disclosure and relationships; a hidden current link does not auto-open or mark its group. Preserve finite non-negative integer counts including zero, blank/invalid metadata omission, signals, warnings and label-only truncation, as specified in v0.2.

## 5. Accessibility

Keep the named landmark, native link and trigger semantics, keyboard order, disclosure/focus behavior and visible focus treatment. Current state retains `aria-current`, not color alone. S9 grants a scoped exception for NavList links and disclosure triggers to the shared contract's 44px mobile target rule: each target must still be at least 24px by 24px (WCAG 2.2 AA, 2.5.8), including at narrow host widths; the host remains responsible for placement and visibility. No minimum row height beyond content and padding is imposed. Respect reduced motion; do not implement a separate focus or keyboard engine.

## 6. Appearance

| Part/state | Approved desktop recipe |
| --- | --- |
| Link row | Barlow `13.5px/1.2`, weight `400`; vertical/horizontal padding `7px 8px`; leading-icon gap `10px`; content-driven height and no inter-row list gap. |
| Group caption/trigger | Barlow Condensed `14px/1`, weight `700`, uppercase, tracking `0.14em`; inline padding `8px` and inline margin `0`, top margin `18px` (`4px` for the first group) and bottom margin `6px`. The disclosure trigger uses vertical padding to maintain a 24px target; its caption text aligns with row icons. |
| Count | JetBrains Mono via `--font-mono`, `11.5px/1`, weight `600`, muted foreground, including on current rows. |
| Leading icon | `16px`, inheriting its row text color in default, hover and current states. |
| Hover / current | A non-current hover uses a plain `surface-2` fill without border, sheen or shadow; text and inherited icon color brighten to `fg-default`. Current uses `surface-2` composed through Surface at elevation `0`, retaining sheen and its light edge, with a transparent 1px border and no drop shadow. A decorative `2px` brand-red logical-start border follows the row's `radius-md` corners and mirrors in RTL; hovering the current row does not change this treatment. This component-specific current-row tone is an approved exception to Material's usual `surface-3` selected tone, not a global Material rewrite. |

The approved recipe includes zero row tracking and a pointer-inert, aria-hidden full-row marker layer at logical inline-start, including RTL, rather than Antena's physical-left marker. The layer has only a 2px start border, with zero width on the other sides; it must not replace Surface paint or the focus cue. No handmade inset marker shadow, new stylesheet or inline appearance. The plain hover fill is the S10 scoped recipe, not a global flat replacement.

**Approved token additions:**

| Token | Value |
| --- | --- |
| `--text-nav-row` | `13.5px` |
| `--text-nav-group` | `14px` |
| `--text-nav-group--line-height` | `1` |
| `--text-nav-group--letter-spacing` | `0.14em` |
| `--text-nav-count` | `11.5px` |

Reuse `--font-sans`, `--font-display`, `--font-mono`, row `--text-label-default--line-height` (`1.2`) and `--text-label-default--letter-spacing` (`0`), row weight `--text-body-muted--font-weight` (`400`), group weight `--text-label-eyebrow--font-weight` (`700`), and count leading `--text-nav-group--line-height` (`1`) and weight `--text-label-default--font-weight` (`600`). The existing eyebrow size, line-height and tracking are not the group recipe. Use existing icon/color/radius/spacing tokens; no additional tokens are implicitly approved. **No stylesheet.** Static token-backed geometry is subject to actual compilation and browser verification.

**Evidence, not visual approval:** The inspected Antena `app/src/styles/panel.css` lines 61, 65–70 describe these group/row values, 16px currentColor icons, surface-2 hover and current sheen/edge with a physical-left inset marker. Its compact row has no 44px minimum; S9 now adopts compact rows subject to the 24px target and scoped exception above. The source shorthand does not establish row tracking. No expected-design capture or conditions were approved for this amendment; `visualHashes` remain Pending. See the [visual evidence guide](../../../design/README.md). Visual conformity: **Not evaluated**.

## 7. Acceptance criteria

S9 was verified before S10; the S10-specific checks below remain planned for T5. See the [plan](implementation-plan.md) for the test and browser matrix.

| ID | Observable promise and planned evidence |
| --- | --- |
| N1 | Existing consumers receive the new default without API/marker changes; public-interface and packed-consumer regressions. |
| N2 | Link, group and count typography, exact padding/margins, zero list gap and icon size/color match the table; emitted CSS and computed browser styles. |
| N3 | Hover is a plain surface-2 fill with brightened inherited icon/text; current retains Surface sheen and light edge, transparent hairline box and no drop shadow, plus a rounded 2px brand-red start marker; emitted CSS and LTR/RTL browser states. |
| N4 | Compact links and triggers meet the scoped 24px minimum targets without a row min-height; focus remains visible and independent of current/hover; browser geometry, keyboard and zoom checks. |
| N5 | Native routing, Radix disclosure, counters, metadata and truncation remain unchanged; interaction regressions and browser checks. |
| N6 | Source-derived expectations are not screenshots: comparable approved visual references, conditions and owner review are still pending. |
