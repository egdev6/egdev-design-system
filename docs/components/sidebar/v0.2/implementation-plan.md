# Sidebar v0.2 — implementation plan

**Status: Independently approved for implementation; not yet implemented.** The [visual amendment](desktop-recipe-amendment.md) records the approved recipe and four token additions; its digest identifies the transcription, not an independent approval receipt. No repeat approval of identical recipe or token values or the digest is required. Preserve the [v0.1 plan and baseline](../v0.1/implementation-plan.md) and [product-identity amendment](../v0.1/product-identity-amendment.md). The listed future edit surfaces and concrete checks are authorized by the owner decision below; listing them alone is not approval. Visual approval and comparable proof remain pending; visual conformity is **Not evaluated**. The plan's mechanics are not reviewed code, and no changed or expanded recipe is authorized. The separately approved [NavList plan](../../nav-list/v0.3/implementation-plan.md) owns the row recipe and four token additions.

- **Approval evidence:** The owner replied “si” in direct response to “**Necesito tu decisión:** ¿aprobás ambos `implementation-plan.md` para pasar a implementación?”. Receiving Pi session `01a1d553-794e-7368-828f-3ec25fe17c6c`; see the [feature document, L3](../../../../odd/tasks/sidebar-antena-look.md#l3--implementation-approval). This decision independently approves both plans.

## Proposed future edit surfaces

These exact existing files are proposed for a later bounded transaction, only where necessary; this list is not permission to write them.

| Path | Bounded purpose |
| --- | --- |
| `packages/ui/src/organisms/sidebar/types.ts` | Static token-backed default width in the root CVA recipe; preserve props. |
| `packages/ui/src/organisms/sidebar/useSidebar.ts` | Preserve product validation and per-part `cn()`/Surface composition. |
| `packages/ui/src/organisms/sidebar/Sidebar.tsx` | Preserve JSX, identity, ScrollArea and footer structure. |
| `packages/ui/src/organisms/sidebar/Sidebar.test.tsx` | Test the new default and existing public behavior. |
| `packages/ui/src/organisms/sidebar/Sidebar.stories.tsx` | Demonstrate real defaults, long content, overflow and RTL as needed. |
| `packages/ui/src/organisms/sidebar/index.ts` | Preserve exports; change only if strictly needed, with no API expansion. |
| `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs` | Check shipped Sidebar width/CSS, native consumers and existing React-major coverage. |
| `packages/ui/src/lib/storybook-css.test.ts` | Add preview-emission assertion if needed for the width utility. |
| `packages/ui/src/lib/sidebar-docgen.test.ts` | Only if changed JSDoc or story metadata affects its existing checks. |

The production scanner `packages/ui/src/styles/compiled.css` already includes Sidebar and Surface `types.ts`; no scanner edit is presumed. Sidebar needs no new token: the four approved typography additions and their exact token/build/test surfaces are in the companion NavList plan, not a second token implementation here. **No stylesheet**, internal module, new prop, registry mutation, dependency, global Material rewrite, AppShell/TabBar/legacy edit or consumer migration. Stop for separately scoped authorization if another path or token becomes necessary.

## Proposed recipe and invariants

- Use existing `sidebarVariants`, `useSidebar`, `cn()`, exported `surfaceVariants` and Radix ScrollArea; do not create parallel identity validation, scrolling, keyboard, routing or responsive state. Preserve product-name validation and development warning, decorative consumer artwork, optional native home link, separate child landmarks, pinned footer and non-tabbable viewport.
- Keep token-backed static CVA in `types.ts`, per-part `cn()` in the hook and JSX-only composition. Preserve root `surface-1` and footer `surface-0` Surface recipes, their hairlines/light edge and supported root layout-only class merging; never replace them with a flat panel or handmade shadows.
- With `--space-1 = 3.2px` and `--spacing = var(--space-1)`, the candidate default is `75` units = `240px`, subject to emitted-CSS verification. Current `w-64` derives to `204.8px` CSS width; neither value is a browser measurement here. Use a static token-backed calculation only if supported; do not approximate, interpolate classes or add spacing tokens automatically. If it cannot compile exactly, stop for a scoped decision.
- In a composed NavList, the 44px target is `13.75` units; the companion plan also derives 7px padding as `2.1875`, 8px as `2.5`, 10px gap as `3.125` and 2px marker as `0.625`. Existing `min-h-11` derives to a 35.2px CSS minimum, not measured actual height. NavList owns correcting this pre-existing drift, row typography, Surface current paint and the approved logical-start RTL marker; Sidebar must not implement a competing recipe.
- Keep AppShell's existing `56rem` switching with both navigation slots and SideOnly behavior without modifying AppShell. Host controls visibility, responsiveness and focus restoration; Sidebar does not introduce a mobile strip or collapse API.

## Test-first and verification matrix

All checks are future work. Approval of this plan authorizes the necessary in-scope checks below, including browser inspection and the existing packed harness's temporary fixture installs, which may use network access. Workspace dependency additions, publishing and new external scope remain separate. Keep source outside the listed edit surfaces read-only; do not add source permission for verification. No runtime or visual check has been run for this plan.

**Planned commands from the repository root:** run the focused component and existing token checks first, then build before the artifact-dependent checks. Docgen runs only if affected.

```bash
pnpm exec vitest run packages/ui/src/organisms/sidebar/Sidebar.test.tsx
node --test packages/tokens/tests/typography-spacing.test.mjs
pnpm tokens
node --test packages/tokens/tests/token-contract.test.mjs
pnpm --filter @egdev/ui run build
pnpm exec vitest run packages/ui/src/lib/storybook-css.test.ts
pnpm exec vitest run packages/ui/src/templates/app-shell/AppShell.test.tsx
pnpm typecheck
pnpm lint
pnpm test:package-exports
pnpm test:package-consumption
```

If docgen is affected: `pnpm exec vitest run packages/ui/src/lib/sidebar-docgen.test.ts`. The existing package checks read other workspace inputs, including prebuilt `@egdev/effects` artifacts; verify those prerequisites read-only and report missing or stale prerequisites rather than editing unrelated sources. The packed harness packs the existing release set into temporary fixtures for both React versions and cleans them; it does not authorize workspace dependency changes. Persistent captures outside the listed surfaces and publication require separate scope.

1. **RED:** add a public default-width assertion that fails against the current recipe, and a compiled CSS/computed-browser check for exact 240px. Check supported width override remains effective; test the default without overriding it in the Default story. Record intended failure before implementation.
2. **GREEN / preserve:** implement the minimum and rerun focused tests. Preserve the passive root and marker, native attributes and supported layout merging; absent/blank/linked product, single accessible name and warning; body content, optional pinned footer and non-tabbable ScrollArea viewport. Test composed labelled navigation and current link without taking over NavList's state. Do not use full class snapshots or mock Radix interaction.
3. **Browser and integration:** with short and overflowing body, verify header/footer stay pinned, focused items scroll into view, keyboard order and visible focus; test long names, LTR/RTL scrollbar and geometry, 200%/400% zoom, constrained/narrow host and child link/trigger targets of at least 44px by 44px. Exercise AppShell both-slot switching at `56rem` and SideOnly without changing AppShell or TabBar; document host clipping or focus issues rather than adding a new responsive behavior.
4. **CSS and packages:** confirm production and Storybook static utility emission and computed 240px from existing spacing tokens. Verify the Surface panel/footer material survives merging and that no component stylesheet is emitted. Use the existing packed UI/token harness with React `18.3.1` and `19.3.0`, strict public types, SSR and client behavior, including styles **without a consumer Tailwind compiler**. Run the listed build and packed-fixture checks under the approved plan.
5. **Stories and metadata:** keep English autodocs with required/example args only, no manual `argTypes` or `play`. Check real docgen extraction, registered Controls and actual browser widgets only where changed JSDoc/story metadata makes them relevant; don't claim that a DOM test proves rendering.
6. **Visual:** obtain approved expected-design references with comparable browser, viewport, scale, theme, fonts and preference conditions before asserting conformity. Source files and old Sidebar captures are not approval of this amended desktop default. Until then, visual conformity is **Not evaluated**.
