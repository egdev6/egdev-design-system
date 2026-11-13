# Sidebar v0.2 — desktop recipe amendment

**Status:** The visual amendment and four token additions were approved in conversation; this file materializes those terms, not an already implemented recipe. The owner has not separately reviewed or signed this file's exact payload hash; no repeat approval of the identical recipe, token values or digest is required. Visual approval remains pending. The [implementation plan](implementation-plan.md) is independently approved for implementation; see the [approval record (L3)](../../../../odd/tasks/sidebar-antena-look.md#l3--implementation-approval). Implementation has not yet occurred; no changed or expanded recipe is authorized.

- **Approval evidence:** Exact owner reply: “aprobado, escribe en español”. Receiving Pi session `01a1d553-794e-7368-828f-3ec25fe17c6c`; recoverable preceding proposal: Engram project `egdev-design-system`, observation `26426`; related [issue #401](https://github.com/egdev6/egdev-design-system/issues/401). The reply approves the preceding proposal, not a later unseen file or digest.
- **Baseline:** [v0.1 implementation plan and authority](../v0.1/implementation-plan.md), [#123 contract](https://github.com/egdev6/egdev-design-system/issues/123), SHA-256 `fba24ddd604a3fafe033f6bc6fbae0c7ad6f540c14a87f28fe5a678646bc227b`, and [owner snapshot approval](https://github.com/egdev6/egdev-design-system/issues/123#issuecomment-6251599325). Preserve the separately approved [product-identity amendment](../v0.1/product-identity-amendment.md) and the [current implementation](../../../../packages/ui/src/organisms/sidebar/Sidebar.tsx).
- **Snapshot identity:** version `0.2`; `contentSHA256: 6fa891a80786cf6e3d5304d4eaab9fc9bbd93ffa44fe765832ead321a76aad7d`; `visualHashes: Pending`; `approvalReference: conversation above, approved recipe and token terms`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/123`; `latestPublishedComment: Pending`. The digest identifies this transcription, not an independent approval receipt; visual approval remains pending.
- **Hash convention:** SHA-256 over UTF-8 bytes from the `## 1. Purpose and scope` heading through EOF, inclusive of the final LF; LF line endings. All tracking metadata above that heading is excluded. This identity establishes content integrity, not owner approval.

## 1. Purpose and scope

Change the existing host-sized desktop Sidebar default width to `240px` for existing consumers; retain its panel responsibility and API. This supersedes the conflicting v0.1 default width only. No mobile strip, automatic breakpoint, collapse control, new variant or consumer migration is introduced. AppShell and host-owned responsive behavior remain unchanged.

## 2. Anatomy and composition

Retain the `div` root and `eg-sidebar` marker; optional consumer product identity, scrollable body, and optional pinned footer retain their order. Preserve Surface-composed panel/footer and Radix ScrollArea, including its vertical scrollbar. Children may include separately labelled NavLists, which own their navigation and disclosure. The [NavList v0.3 amendment](../../nav-list/v0.3/desktop-recipe-amendment.md) defines the companion row recipe, not a Sidebar-owned navigation engine.

## 3. Public API

Keep `product`, `children`, `footer`, supported native attributes and existing exports without new props or ref/`asChild` promises. The product remains consumer-supplied decorative non-interactive artwork, name and optional native home link; a blank name omits the header with the existing development warning. Root `className` remains a supported outer-layout surface, including width; `cn()` merges recognized conflicts but does not promise unrestricted appearance overrides. No naming-registry mutation or new dependency.

## 4. Behavior

The body scrolls within the available host height while product header and footer remain pinned; absent identity or footer stays absent. No route matching, Sidebar disclosure or responsive switch is added. The host owns layout, visibility and focus when hiding navigation; AppShell's existing `56rem` switching with both navigation slots remains unchanged.

## 5. Accessibility

Keep the passive root without a navigation landmark, the native product link's single accessible name, separately named child landmarks and the non-tabbable Radix viewport. Preserve focus order and focus visibility while scrolling. Composed NavList links and disclosure triggers retain at least 44px by 44px targets, including where a narrow host exposes them; Sidebar does not replace Radix keyboard/focus handling.

## 6. Appearance

Default outer width is `240px`, subject to existing supported consumer layout overrides and host constraints; height remains host-sized. Preserve v0.1 Surface panel and footer Material, not a flat replacement or handmade shadows. The companion NavList current row uses Surface `surface-2` with sheen, hairline, light edge and elevation-1 two-layer shadow plus a 2px brand-red marker. The approved companion recipe includes zero row tracking and a logical inline-start marker in RTL, rather than Antena's physical-left marker; concrete implementation mechanics and code have not been reviewed. No stylesheet or global Material rewrite.

**Approved companion token additions**, not yet added to source:

| Token | Value |
| --- | --- |
| `--text-nav-row` | `13.5px` |
| `--text-nav-group` | `14px` |
| `--text-nav-group--line-height` | `1` |
| `--text-nav-group--letter-spacing` | `0.14em` |

The NavList recipe reuses `--font-sans`, `--font-display`, row `--text-label-default--line-height` (`1.2`) and `--text-label-default--letter-spacing` (`0`), row weight `--text-body-muted--font-weight` (`400`), and group weight `--text-label-eyebrow--font-weight` (`700`). No other token addition is implicitly approved. **No stylesheet.** Geometry remains subject to compiled-CSS and browser verification.

**Evidence, not visual approval:** Antena `app/src/styles/panel.css:45` specifies a 240px desktop track. Current Sidebar `w-64` derives from `--space-1 = 3.2px`, or a 204.8px CSS width, not a browser measurement. NavList's existing `min-h-11` derives to 35.2px, not proof of rendered row height; this is pre-existing drift from its 44px contract, not a new change. No expected-design capture or conditions were approved for this amendment; `visualHashes` remain Pending. See the [visual evidence guide](../../../design/README.md). Visual conformity: **Not evaluated**.

## 7. Acceptance criteria

All checks below are planned, not observed; see the [plan](implementation-plan.md) for the test and browser matrix.

| ID | Observable promise and planned evidence |
| --- | --- |
| S1 | Default Sidebar width is 240px while supported outer layout overrides still work; CSS build and browser computed geometry. |
| S2 | Identity, optional slots, scroll containment and pinned footer remain unchanged; public-interface and browser overflow tests. |
| S3 | Named child navigation, 44px targets, keyboard/focus and RTL remain usable; browser geometry and interaction checks. |
| S4 | AppShell switching and SideOnly behavior remain unchanged; integration checks without editing AppShell. |
| S5 | Surface Material, API, public marker and no-stylesheet boundary remain intact; DOM, emitted-CSS and packed React consumer checks. |
| S6 | Source evidence is not visual approval; comparable approved images, capture conditions and owner review remain pending. |
