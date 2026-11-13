# NavList v0.3 — implementation plan

**Status: Original implementation and S9 verified; S10 revision in progress.** The [visual amendment](desktop-recipe-amendment.md) records the approved recipe, S9 compact-target exception and five total token additions; its digest identifies the transcription, not an independent approval receipt. The [v0.2 baseline](../v0.2/implementation.md) remains authoritative except for the amended recipe. The original edit surfaces below are historical; the [T5 handoff](../../../../odd/tasks/sidebar-antena-look.md#tasks) defines the bounded revision. Visual approval and comparable proof remain pending; visual conformity is **Not evaluated**. The separately approved [Sidebar plan](../../sidebar/v0.2/implementation-plan.md) owns the width change.

- **Approval evidence:** The owner replied “si” in direct response to “**Necesito tu decisión:** ¿aprobás ambos `implementation-plan.md` para pasar a implementación?”. Receiving Pi session `01a1d553-794e-7368-828f-3ec25fe17c6c`; see the [feature document, L3](../../../../odd/tasks/sidebar-antena-look.md#l3--implementation-approval). This decision independently approves both plans.

## Proposed future edit surfaces

The original implementation surfaces below are retained for history; S9/T5 supplies the current bounded revision surfaces. Use existing files only as needed, retaining their current responsibilities.

| Path | Bounded purpose |
| --- | --- |
| `packages/ui/src/molecules/nav-list/types.ts` | Static token-backed CVA part recipes; no new prop. |
| `packages/ui/src/molecules/nav-list/useNavList.ts` | Reuse existing normalization, callback adaptation and per-part `cn()`/Surface composition. |
| `packages/ui/src/molecules/nav-list/NavList.tsx` | JSX only, if a decorative part is needed; retain native/Radix structure. |
| `packages/ui/src/molecules/nav-list/NavList.test.tsx` | Public behavior and preservation tests, test-first. |
| `packages/ui/src/molecules/nav-list/NavList.stories.tsx` | Existing stories plus distinct current/hover, RTL and long-content scenarios as needed. |
| `packages/ui/src/molecules/nav-list/index.ts` | Preserve exports; change only if strictly needed, with no API expansion. |
| `packages/tokens/src/theme.css` | Add only the four originally approved declarations and the S9 `--text-nav-count` size; never edit compiled `tokens.css`. |
| `packages/tokens/tests/typography-spacing.test.mjs` | Assert exact additions and existing companion reuse, without inventing additional fields. |
| `packages/tokens/tests/token-contract.test.mjs` | Update exact declaration/artifact counts and parity expectations for the original four additions and S9 count size. |
| `packages/ui/src/lib/cn.ts`, `packages/ui/src/lib/cn.test.ts` | Register navigation sizes, including S9 count, in source order for the existing typography merge/drift guard; preserve every other merge rule. |
| `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs` | Update NavList and token inventories, emitted CSS, packed native-consumer and existing React-major checks. |
| `packages/ui/src/lib/storybook-css.test.ts` | Add preview-emission coverage if required for changed static utilities. |
| `packages/ui/src/lib/nav-list-docgen.test.ts` | Only if changed JSDoc or story inventory affects its existing metadata checks. |

The production scanner `packages/ui/src/styles/compiled.css` already includes NavList and Surface `types.ts`; do not change it merely to repeat registration. **No stylesheet**, new internal module, semantic registry mutation, dependency, global Material rewrite, AppShell/TabBar/legacy edit or consumer migration. S9 permits only a source-revision refresh for unchanged NavList declarations and its generated reference. If an additional path or token is necessary, stop for scoped authorization rather than expanding the plan silently.

## Proposed recipe and invariants

- Keep the existing `useNavList`, `countText`, `useId`, keyed entries, `surfaceVariants`, `cn()` and individual Radix Collapsible package. Keep original entry/event callbacks, native modified/auxclick behavior, controlled/uncontrolled precedence and no automatic route matching or group opening.
- Declare static CVA utilities in `types.ts`; compose supported parts with `cn()` in the hook and retain JSX/Radix responsibilities. Compose current rows with `surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'md' })`, then merge a transparent border color; preserve `eg-surface`, sheen, the light edge, 1px border geometry and focus outline without a drop shadow. Do not clone Surface or handwrite inset shadows.
- Use a pointer-inert, aria-hidden full-row rounded layer with only a 2px logical-start border in `--color-bg-flood`; mirror it in RTL. Non-current hover uses the plain `surface-2` background utility on the link, without a separate Surface layer; text and inherited icon color brighten to `fg-default`. Verify painting, clipping, hit testing and focus in LTR and RTL.
- Retain row `13.5px/1.2/400`, zero tracking; group `14px/1/700`, uppercase and `0.14em`; 16px leading Icon follows row `currentColor` in all states. Counts use mono `11.5px/1/600` in muted foreground, reusing the amendment's existing font, leading and weight tokens.
- With `--space-1 = 3.2px`, retain row padding `2.1875` = 7px vertical and `2.5` = 8px inline, icon gap `3.125` = 10px and marker width `0.625` = 2px. Captions use inline padding `2.5` = 8px, top margin `5.625` = 18px, bottom margin `1.875` = 6px and first-group top margin `1.25` = 4px. The trigger uses vertical padding `1.5625` = 5px; minimum width `7.5` = 24px. Width `75` = 240px belongs to Sidebar.
- S9 replaces the 44px minimum with content-driven row height and zero list gap. Every link and trigger must still reach 24px by 24px (WCAG 2.2 AA 2.5.8), including narrow hosts; the exception is scoped to these NavList targets, not a change to the shared contract. Use static token-backed geometry and a structural first-group selector; verify actual CSS and browser geometry rather than claiming jsdom measurements.

## Test-first and verification matrix

The original plan and S9 checks ran before S10; the S10-specific checks remain to be verified under T5. Browser and packed checks are parent-owned in the T5 handoff. Workspace dependency additions, publishing and new external scope remain separate. Keep source outside the authorized surfaces read-only.

**Original plan commands from the repository root:** T5's delegated verification contract supersedes this historical command list. Run the focused component and token checks first, then build before artifact-dependent checks. Docgen runs only if affected.

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

1. **RED:** through public interfaces assert the rounded logical-start marker in LTR/RTL, current Surface sheen/light edge without visible hairline or drop shadow, and plain hover fill with inherited brightened icon/text. Preserve S9 compact targets, spacing and count tests. Assert CSS/build/browser geometry; jsdom alone cannot prove rendered pixels or 24px targets.
2. **GREEN / preserve:** implement minimally, run focused tests, then preserve current-link updates, native modified/auxclick and callback identity, labelled landmarks, independent controlled/uncontrolled Radix groups and keyboard/focus, counts including zero/invalid, blank metadata and warning/signal equivalents, truncation, root merge and markers. Preserve one relevant existing case for each touched behavior; no full class snapshots or Radix mocks.
3. **Shared merge safety:** update the existing `cn` size inventory and guard in token-source order; prove new size versus color/weight and old size conflict behavior without losing `eg-*`. Because `cn` is shared, compare representative unaffected public sibling renders and merge inputs against the previous code; investigate and pin any unrequested difference. Do not make committed tests read Git history.
4. **CSS and package:** verify actual production and Storybook CSS emission for every static utility, token declaration, exact fractional calculation, group tracking, icon color, hover/current/RTL and focus. Check the five approved native declarations, retained old values and count/parity guards (the original `296` source total becomes `297` under S9). The packed harness currently expects three companion fields for each name in `typographyNames`: preserve that guarantee for existing recipes but assert the new partial recipes separately; do not invent missing companions. Build and test packed `@egdev/ui` and `@egdev/tokens` consumers on React `18.3.1` and `19.3.0`, including strict public types, SSR, client interaction and styles **without a consumer Tailwind compiler**; run the repository's existing package harness under the approved plan.
5. **Stories/browser:** exercise default/current/hover, static and collapsible groups, counts/metadata and long labels in LTR/RTL; check computed geometry, Surface sheen/light edge and plain hover, rounded marker visibility, contrast, Tab/Shift+Tab, Enter/Space, focus, reduced motion, overflow and 200%/400% zoom. Check AppShell switching and SideOnly composition without editing either. Docgen extraction/registered Controls and actual browser widgets are required only if affected JSDoc/story metadata changes; no manual `argTypes` or `play`.
6. **Visual:** obtain an approved expected-design reference and recorded comparable browser, viewport, scale, theme, fonts and preference conditions before claiming conformity. Compare states separately; source inspection and stories alone are not approval. Until then, visual conformity is **Not evaluated**.
