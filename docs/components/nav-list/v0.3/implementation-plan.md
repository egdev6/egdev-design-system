# NavList v0.3 — implementation plan

**Status: Independently approved for implementation; not yet implemented.** The [visual amendment](desktop-recipe-amendment.md) records the approved recipe and four token additions; its digest identifies the transcription, not an independent approval receipt. No repeat approval of identical recipe or token values or the digest is required. The [v0.2 baseline](../v0.2/implementation.md) remains authoritative except for the amended recipe. The listed future edit surfaces and concrete checks are authorized by the owner decision below; listing them alone is not approval. Visual approval and comparable proof remain pending; visual conformity is **Not evaluated**. The plan's mechanics are not reviewed code, and no changed or expanded recipe is authorized. The separately approved [Sidebar plan](../../sidebar/v0.2/implementation-plan.md) owns the width change.

- **Approval evidence:** The owner replied “si” in direct response to “**Necesito tu decisión:** ¿aprobás ambos `implementation-plan.md` para pasar a implementación?”. Receiving Pi session `01a1d553-794e-7368-828f-3ec25fe17c6c`; see the [feature document, L3](../../../../odd/tasks/sidebar-antena-look.md#l3--implementation-approval). This decision independently approves both plans.

## Proposed future edit surfaces

The following exact paths are proposed for a later bounded transaction; listing them is not permission to write them. Use existing files only as needed, retaining their current responsibilities.

| Path | Bounded purpose |
| --- | --- |
| `packages/ui/src/molecules/nav-list/types.ts` | Static token-backed CVA part recipes; no new prop. |
| `packages/ui/src/molecules/nav-list/useNavList.ts` | Reuse existing normalization, callback adaptation and per-part `cn()`/Surface composition. |
| `packages/ui/src/molecules/nav-list/NavList.tsx` | JSX only, if a decorative part is needed; retain native/Radix structure. |
| `packages/ui/src/molecules/nav-list/NavList.test.tsx` | Public behavior and preservation tests, test-first. |
| `packages/ui/src/molecules/nav-list/NavList.stories.tsx` | Existing stories plus distinct current/hover, RTL and long-content scenarios as needed. |
| `packages/ui/src/molecules/nav-list/index.ts` | Preserve exports; change only if strictly needed, with no API expansion. |
| `packages/tokens/src/theme.css` | Add only the four approved typography declarations; never edit compiled `tokens.css`. |
| `packages/tokens/tests/typography-spacing.test.mjs` | Assert exact additions and existing companion reuse, without inventing additional fields. |
| `packages/tokens/tests/token-contract.test.mjs` | Update exact declaration/artifact counts and parity expectations for those four additions only. |
| `packages/ui/src/lib/cn.ts`, `packages/ui/src/lib/cn.test.ts` | Register the two new sizes in source order for the existing typography merge/drift guard; preserve every other merge rule. |
| `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs` | Update NavList and token inventories, emitted CSS, packed native-consumer and existing React-major checks. |
| `packages/ui/src/lib/storybook-css.test.ts` | Add preview-emission coverage if required for changed static utilities. |
| `packages/ui/src/lib/nav-list-docgen.test.ts` | Only if changed JSDoc or story inventory affects its existing metadata checks. |

The production scanner `packages/ui/src/styles/compiled.css` already includes NavList and Surface `types.ts`; do not change it merely to repeat registration. **No stylesheet**, new internal module, registry mutation, dependency, global Material rewrite, AppShell/TabBar/legacy edit or consumer migration. If an additional path or token is necessary, stop for scoped authorization rather than expanding the plan silently.

## Proposed recipe and invariants

- Keep the existing `useNavList`, `countText`, `useId`, keyed entries, `surfaceVariants`, `cn()` and individual Radix Collapsible package. Keep original entry/event callbacks, native modified/auxclick behavior, controlled/uncontrolled precedence and no automatic route matching or group opening.
- Declare static CVA utilities in `types.ts`; compose supported parts with `cn()` in the hook and retain JSX/Radix responsibilities. Use `surfaceVariants({ tone: 'surface-2', elevation: 1, padding: 'none', radius: 'md' })` as a candidate for current rows; verify the final merge retains `eg-surface`, sheen, hairline, light edge, two-layer shadow and focus outline. Do not clone Surface or handwrite inset shadows.
- Candidate implementation: a pointer-inert decorative bar or pseudo-element at logical inline-start, using an existing brand-red token such as `--color-bg-flood`; use separate pointer-inert hover paint only if needed to avoid losing the Surface sheen. Surface sheen is a background image, not a pseudo-element. Both mechanisms are proposals, not reviewed code; verify painting, clipping, hit testing and focus in LTR and RTL.
- Implement row `13.5px/1.2/400`, zero tracking; group `14px/1/700`, uppercase and `0.14em`; 16px leading Icon follows row `currentColor` in all states. Reuse the exact existing tokens named in the amendment rather than adding weight or row-companion tokens. The default eyebrow recipe is not equivalent.
- With `--space-1 = 3.2px` and `--spacing = var(--space-1)`, candidate multipliers are: vertical padding `2.1875` = 7px; horizontal padding `2.5` = 8px; icon gap `3.125` = 10px; bar width `0.625` = 2px; target minimum `13.75` = 44px. Use static token-backed calculations only if the actual build emits exact declarations; no approximation, dynamic class interpolation or inline appearance. Stop for a new scoped decision if the build cannot represent them. Width `75` = 240px belongs to Sidebar.
- Links and triggers must remain at least 44px by 44px even though 7px vertical padding is retained. Existing `min-h-11` derives to 35.2px CSS minimum, not measured row height; correct this pre-existing drift rather than claiming the old CSS already meets the promise.

## Test-first and verification matrix

All checks are future work. Approval of this plan authorizes the necessary in-scope checks below, including browser inspection and the existing packed harness's temporary fixture installs, which may use network access. Workspace dependency additions, publishing and new external scope remain separate. Keep source outside the listed edit surfaces read-only; do not add source permission for verification. No runtime or visual check has been run for this plan.

**Planned commands from the repository root:** run the focused component and token checks first, then build before the artifact-dependent checks. Docgen runs only if affected.

```bash
pnpm exec vitest run packages/ui/src/molecules/nav-list/NavList.test.tsx packages/ui/src/lib/cn.test.ts
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

If docgen is affected: `pnpm exec vitest run packages/ui/src/lib/nav-list-docgen.test.ts`. The existing package checks read other workspace inputs, including prebuilt `@egdev/effects` artifacts; verify those prerequisites read-only and report missing or stale prerequisites rather than editing unrelated sources. The packed harness packs the existing release set into temporary fixtures for both React versions and cleans them; it does not authorize workspace dependency changes. Persistent captures outside the listed surfaces and publication require separate scope.

1. **RED:** through public interfaces add assertions for each changed rule: default link/group typography, exact padding/gap, 16px inherited icon color in normal/hover/current, surface-2 hover, Surface current plus red 2px marker in both directions, and 44px link/trigger targets. Assert observable state as well as CSS/build/browser geometry; jsdom alone cannot prove pixels. Record intended failing output before implementation.
2. **GREEN / preserve:** implement minimally, run focused tests, then preserve current-link updates, native modified/auxclick and callback identity, labelled landmarks, independent controlled/uncontrolled Radix groups and keyboard/focus, counts including zero/invalid, blank metadata and warning/signal equivalents, truncation, root merge and markers. Preserve one relevant existing case for each touched behavior; no full class snapshots or Radix mocks.
3. **Shared merge safety:** update the existing `cn` size inventory and guard in token-source order; prove new size versus color/weight and old size conflict behavior without losing `eg-*`. Because `cn` is shared, compare representative unaffected public sibling renders and merge inputs against the previous code; investigate and pin any unrequested difference. Do not make committed tests read Git history.
4. **CSS and package:** verify actual production and Storybook CSS emission for every static utility, token declaration, exact fractional calculation, group tracking, icon color, hover/current/RTL and focus. Check the four new native declarations, retained old values and count/parity guards (current source total `292` becomes `296`). The packed harness currently expects three companion fields for each name in `typographyNames`: preserve that guarantee for existing recipes but assert the new partial recipes separately; do not invent missing companions. Build and test packed `@egdev/ui` and `@egdev/tokens` consumers on React `18.3.1` and `19.3.0`, including strict public types, SSR, client interaction and styles **without a consumer Tailwind compiler**; run the repository's existing package harness under the approved plan.
5. **Stories/browser:** exercise default/current/hover, static and collapsible groups, counts/metadata and long labels in LTR/RTL; check computed geometry, Surface layers, marker visibility, contrast, Tab/Shift+Tab, Enter/Space, focus, reduced motion, overflow and 200%/400% zoom. Check AppShell switching and SideOnly composition without editing either. Docgen extraction/registered Controls and actual browser widgets are required only if affected JSDoc/story metadata changes; no manual `argTypes` or `play`.
6. **Visual:** obtain an approved expected-design reference and recorded comparable browser, viewport, scale, theme, fonts and preference conditions before claiming conformity. Compare states separately; source inspection and stories alone are not approval. Until then, visual conformity is **Not evaluated**.
