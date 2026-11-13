# Sidebar v0.2 — desktop recipe amendment

**Status:** The original desktop recipe and [implementation plan](implementation-plan.md) were approved and implemented; see the [approval record (L3)](../../../../odd/tasks/sidebar-antena-look.md#l3--implementation-approval). The owner subsequently approved the companion NavList revision in [S9](../../../../odd/tasks/sidebar-antena-look.md#specs) and [L21](../../../../odd/tasks/sidebar-antena-look.md#l21--owner-visual-review-reopens-the-recipe); The owner also requested the companion S10 paint refinement in [L23](../../../../odd/tasks/sidebar-antena-look.md#l23--t5-checks-green-owner-requests-closer-antena-match). T5 implements these revisions. The exact file payload hash is not an independent approval receipt. Visual approval remains pending.

- **Approval evidence:** Exact owner reply: “aprobado, escribe en español”. Receiving Pi session `01a1d553-794e-7368-828f-3ec25fe17c6c`; recoverable preceding proposal: Engram project `egdev-design-system`, observation `26426`; related [issue #401](https://github.com/egdev6/egdev-design-system/issues/401). The reply approves the preceding proposal, not a later unseen file or digest.
- **S9 approval evidence:** The owner selected all three options: “Filas compactas (~30 px)” — “Quitar el mínimo de 44 px y la separación entre filas. Cumple WCAG 2.2 AA (24 px), pero contradice la regla de 44 px del contrato; requiere enmienda.”; “Rótulos de grupo como Antena” — “8 px laterales alineados con los iconos; 18 px arriba y 6 px abajo, 4 px arriba en el primer grupo.”; “Contadores en monoespaciada” — “11,5 px, peso 600, color atenuado. Requiere aprobar un token nuevo para el tamaño.” See [S9](../../../../odd/tasks/sidebar-antena-look.md#specs) and [L21](../../../../odd/tasks/sidebar-antena-look.md#l21--owner-visual-review-reopens-the-recipe); source: Antena `app/src/styles/panel.css:61-74`.
- **S10 approval evidence:** The owner wrote “sigue sin ser igual [Image#2] -borde izquierdo redondeado -fondo con gradiente -Hover con sutíl acento de icono y fondo gris claro [Image#4]”. See [S10](../../../../odd/tasks/sidebar-antena-look.md#specs) and [L23](../../../../odd/tasks/sidebar-antena-look.md#l23--t5-checks-green-owner-requests-closer-antena-match) for the screenshot pixel sampling and scoped companion NavList changes.
- **Baseline:** [v0.1 implementation plan and authority](../v0.1/implementation-plan.md), [#123 contract](https://github.com/egdev6/egdev-design-system/issues/123), SHA-256 `fba24ddd604a3fafe033f6bc6fbae0c7ad6f540c14a87f28fe5a678646bc227b`, and [owner snapshot approval](https://github.com/egdev6/egdev-design-system/issues/123#issuecomment-6251599325). Preserve the separately approved [product-identity amendment](../v0.1/product-identity-amendment.md) and the [current implementation](../../../../packages/ui/src/organisms/sidebar/Sidebar.tsx).
- **Snapshot identity:** version `0.2`; `contentSHA256: 22617920405a6fb875822f2a9be0248222f92d09ed213dfbf95a92381d7d0585`; `visualHashes: Pending`; `approvalReference: conversation above, approved recipe and token terms`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/123`; `latestPublishedComment: Pending`. The digest identifies this transcription, not an independent approval receipt; visual approval remains pending.
- **Superseded digests:** Original payload `6fa891a80786cf6e3d5304d4eaab9fc9bbd93ffa44fe765832ead321a76aad7d` was superseded by S9; S9 payload `a007cf52f419a5bde4fa78ec9513599546a69d6b795f6507a794fdd8eca80c58` is superseded by this S10 revision. The revision's digest identifies its transcription, not separate approval of a hash.
- **Hash convention:** SHA-256 over UTF-8 bytes from the `## 1. Purpose and scope` heading through EOF, inclusive of the final LF; LF line endings. All tracking metadata above that heading is excluded. This identity establishes content integrity, not owner approval.

## 1. Purpose and scope

Change the existing host-sized desktop Sidebar default width to `240px` for existing consumers; retain its panel responsibility and API. This supersedes the conflicting v0.1 default width only. No mobile strip, automatic breakpoint, collapse control, new variant or consumer migration is introduced. AppShell and host-owned responsive behavior remain unchanged.

## 2. Anatomy and composition

Retain the `div` root and `eg-sidebar` marker; optional consumer product identity, scrollable body, and optional pinned footer retain their order. Preserve Surface-composed panel/footer and Radix ScrollArea, including its vertical scrollbar. Children may include separately labelled NavLists, which own their navigation and disclosure. The [NavList v0.3 amendment](../../nav-list/v0.3/desktop-recipe-amendment.md) defines the companion row recipe, not a Sidebar-owned navigation engine.

## 3. Public API

Keep `product`, `children`, `footer`, supported native attributes and existing exports without new props or ref/`asChild` promises. The product remains consumer-supplied decorative non-interactive artwork, name and optional native home link; a blank name omits the header with the existing development warning. Root `className` remains a supported outer-layout surface, including width; `cn()` merges recognized conflicts but does not promise unrestricted appearance overrides. No semantic naming-registry mutation or new dependency.

## 4. Behavior

The body scrolls within the available host height while product header and footer remain pinned; absent identity or footer stays absent. No route matching, Sidebar disclosure or responsive switch is added. The host owns layout, visibility and focus when hiding navigation; AppShell's existing `56rem` switching with both navigation slots remains unchanged.

## 5. Accessibility

Keep the passive root without a navigation landmark, the native product link's single accessible name, separately named child landmarks and the non-tabbable Radix viewport. Preserve focus order and focus visibility while scrolling. Composed NavList links and disclosure triggers use the companion S9 scoped exception to the shared 44px mobile target rule: each target remains at least 24px by 24px (WCAG 2.2 AA, 2.5.8), including where a narrow host exposes it. Rows have no minimum height beyond content and padding and no inter-row gap; Sidebar does not replace Radix keyboard/focus handling.

## 6. Appearance

Default outer width is `240px`, subject to existing supported consumer layout overrides and host constraints; height remains host-sized. Preserve v0.1 Surface panel and footer Material, not a flat replacement or handmade shadows. The companion NavList current row uses Surface `surface-2` at elevation `0`, retaining sheen and light edge, with a transparent 1px border box, no drop shadow and a rounded 2px brand-red logical-start border marker. Its non-current hover is a plain `surface-2` fill without border, sheen or shadow, with text and inherited icon color brightened to `fg-default`. The companion recipe retains zero row tracking and a logical inline-start marker in RTL, rather than Antena's physical-left marker. Group captions and triggers have 8px inline padding, 18px top and 6px bottom margins, with 4px top margin for the first group; counts are muted 11.5px/1 monospace at weight 600. No stylesheet or global Material rewrite.

**Approved companion token additions:**

| Token | Value |
| --- | --- |
| `--text-nav-row` | `13.5px` |
| `--text-nav-group` | `14px` |
| `--text-nav-group--line-height` | `1` |
| `--text-nav-group--letter-spacing` | `0.14em` |
| `--text-nav-count` | `11.5px` |

The NavList recipe reuses `--font-sans`, `--font-display`, `--font-mono`, row `--text-label-default--line-height` (`1.2`) and `--text-label-default--letter-spacing` (`0`), row weight `--text-body-muted--font-weight` (`400`), group weight `--text-label-eyebrow--font-weight` (`700`), and count leading `--text-nav-group--line-height` (`1`) and weight `--text-label-default--font-weight` (`600`). No other token addition is implicitly approved. **No stylesheet.** Geometry remains subject to compiled-CSS and browser verification.

**Evidence, not visual approval:** Antena `app/src/styles/panel.css:45` specifies a 240px desktop track. The pre-v0.2 Sidebar `w-64` derived from `--space-1 = 3.2px`, or a 204.8px CSS width. The pre-v0.3 NavList `min-h-11` derived to 35.2px, not proof of rendered row height; these historical calculations are not browser measurements. No expected-design capture or conditions were approved for this amendment; `visualHashes` remain Pending. See the [visual evidence guide](../../../design/README.md). Visual conformity: **Not evaluated**.

## 7. Acceptance criteria

S9 was verified before S10; companion S10 checks remain planned for T5. See the [NavList plan](../../nav-list/v0.3/implementation-plan.md) for the revised test and browser matrix.

| ID | Observable promise and planned evidence |
| --- | --- |
| S1 | Default Sidebar width is 240px while supported outer layout overrides still work; CSS build and browser computed geometry. |
| S2 | Identity, optional slots, scroll containment and pinned footer remain unchanged; public-interface and browser overflow tests. |
| S3 | Named child navigation, scoped 24px minimum targets, keyboard/focus and RTL remain usable; browser geometry and interaction checks. |
| S4 | AppShell switching and SideOnly behavior remain unchanged; integration checks without editing AppShell. |
| S5 | Surface Material, API, public marker and no-stylesheet boundary remain intact; DOM, emitted-CSS and packed React consumer checks. |
| S6 | Source evidence is not visual approval; comparable approved images, capture conditions and owner review remain pending. |
