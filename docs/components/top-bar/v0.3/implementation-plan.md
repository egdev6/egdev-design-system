# TopBar v0.3 — implementation plan

**Status: Owner-approved; implementation authorized.** Approved by the owner on 2026-11-14 in Pi session `01a1d553-794e-7368-828f-3ec25fe17c6c`, selecting “Apruebo todo” — “Enmienda, los dos conceptos nuevos de nombres y el plan. Implemento test-first y te aviso para revisarlo en Storybook.” (see [feature tracker L4](../../../../odd/tasks/topbar-app-header.md)). This plan is conditional on the exact [v0.3 amendment](spec-amendment.md), separately approved naming conventions, this plan and explicitly authorized future edit surfaces. It implements nothing. Preserve the [v0.1 contract](../v0.1/spec.md), [partition amendment](../v0.1/part-partition-amendment.md), and [v0.2 contract](../v0.2/spec.md) with its [approval resolutions](../v0.2/approval.md), except for the v0.3 deltas. Do not rewrite historical snapshots or infer visual approval.

**Identity and gates:** finalize the amendment's canonical payload hash; record owner approval scoped to v0.3 and any adopted visual hashes. Separately record convention approval and SHA-256 of this entire final plan file with the owner's plan approval. A changed approved payload needs renewed approval. The Image#5 reference is not recoverable here; the amendment records its provenance and limitations. Visual conformity remains **Not evaluated** until comparable, approved evidence is available.

**Approved plan identity metadata:** SHA-256 `198cec9d4676e07de534e5469b813f1b522323c918982899a518b2d950711a16` identifies the entire approved plan before this metadata paragraph was inserted. To verify, remove this paragraph and its following blank line, then hash the remaining UTF-8 bytes. Approval: `odd/tasks/topbar-app-header.md#l4--approved`.

## 1. Proposed future edit surfaces

These are candidates for a later bounded implementation authorization, **not** permission to change them now. Reinspect the tree and restrict each work unit to the paths actually needed.

| Surface | Planned responsibility |
| --- | --- |
| `packages/ui/src/organisms/top-bar/types.ts` | New props/defaults, token-backed CVA and JSDoc/Controls; preserve individual part content requirements while allowing `TopBarEnd` arbitrary children. |
| `packages/ui/src/organisms/top-bar/useTopBar.ts` | Existing partition plus end; SSR-safe scroll/rAF lifecycle, state precedence and `cn()` composition. |
| `packages/ui/src/organisms/top-bar/TopBar.tsx` | JSX-only new part and documented DOM placement. |
| `packages/ui/src/organisms/top-bar/TopBar.test.tsx` | RED/GREEN and preservation tests through the public interface. |
| `packages/ui/src/organisms/top-bar/TopBar.stories.tsx` | Reference Default, scroll, width and slot stories; no raw unstyled anchors. |
| `packages/ui/src/organisms/top-bar/index.ts`; `packages/ui/src/index.ts` | Add `TopBarEnd`; retain every existing runtime/type export. |
| `packages/ui/src/lib/storybook-css.test.ts`, `storybook-docgen.test.ts`, `storybook-controls.test.ts` | Verify emitted new utilities and real docgen/installed Controls for both props and the part; preserve existing rows/exports. |
| `scripts/package-exports.test.mjs`; `scripts/package-consumption.test.mjs` | Packed runtime/type exports, CSS scanning, SSR and React 18/19 consumption without a consumer Tailwind compiler. |
| `skills/_shared/prop-naming.json`; generated `docs/prop-naming.md`; `scripts/prop-naming.test.mjs` | After separate convention approval, register the two proposed usages and refresh reviewed source hashes for existing TopBar usages; update the test currently asserting only three usages. Generate the view, never hand-edit it. |
| `scripts/design-system-artifact.test.mjs`; generated `packages/system/design-system.json` | Existing artifact test fixes the five-part list and old shared-part description. Update the scoped expectations and regenerate the artifact only if its checked output changes; do not hand-edit generated JSON. |
| `scripts/catalog_data.py`; generated `docs/CATALOGO.md` and `docs/catalog.json` | Update only TopBar's delivered description after implementation and regenerate both catalog outputs. |
| `packages/ui/src/templates/web-template/WebTemplate.stories.tsx` | Conditional only if the existing TopBar usage actually needs updating; otherwise leave it unchanged. |

The production scanner already lists `organisms/top-bar/types.ts` in `packages/ui/src/styles/compiled.css`; verify emitted CSS before proposing any scanner change. **No stylesheet**, additional internal module, token, dependency, legacy bundle or unrelated component change is planned. If a necessary path falls outside a later approved scope, stop and request that exact scope rather than expanding it silently.

## 2. Implementation sequence

1. Reinspect the public TopBar and Surface APIs and registry by meaning/name/alias. Obtain exact approvals first. Use proposed `initialBackground`, `contentWidth` and `TopBarEnd` as specified; no automatic migration or broad registry change.
2. Write the behavior tests below, capture each meaningful RED, then make the smallest implementation pass. Preserve the original parts and attributes, `label`/`items`/`onNavigate`, native header/link behavior and root layout-only `className`. Keep TopBar's native-link model and supplied Radix Dialog/Menu responsibilities.
3. Compose the solid `surfaceVariants` recipe while keeping the existing glass and reduced-transparency recipe, transparent fallback, root marker and legacy cascade protections. Put scroll logic in the hook; use passive window scroll, one pending rAF, mount synchronization, cleanup and host override. Do not access `window` on the server or render different server/first-client states.
4. Update stories, barrels and scoped metadata/package checks. Declare both own props with English `@control select` and actual bare `@default` values; `ReactNode` children need `@control false` with a concrete reason and story reference. Verify the actual docgen/enhancer/inference pipeline and browser widgets, not manual `argTypes` or tags alone.
5. After separate naming approval and review of the changed `TopBarProps`, record the actual whole-file source hash for both new usages and all existing affected usage records. Regenerate naming, catalog and artifact outputs with their existing generators, only under explicit future write authorization. Do not infer approval from a generated file.

## 3. Test-first contract

Future evidence only: no RED or GREEN is claimed by this document. Write behavior-level tests against the public component before implementation. Capture the intended failure per rule, implement minimally, then rerun the focused tests green. Test emitted CSS and actual browser computed styles where jsdom cannot establish visibility or paint.

| RED | Required public assertion |
| --- | --- |
| Brand / partition | Non-link brand is accepted; supplied direct/fragment-wrapped parts retain first-instance order, missing-brand/duplicate/unknown warnings and absent-part behavior. |
| End slot | Text and element/fragment `ReactNode` render without injected content; reordered parts resolve to brand → nav → full search → compact search → end → user → mobile. Browser proves end visible in both responsive branches. |
| Scroll and override | At `scrollY=0` initial backing holds; `>0` becomes glass and returning to 0 restores it. Test initial already-scrolled mount, rAF coalescing/cleanup and SSR/first-client unscrolled state; explicit transparent and glass win at both positions, removal resynchronizes. |
| Initial background | Default and explicit transparent remain transparent; solid uses the prescribed Surface treatment at the top; glass and explicit host states take precedence, including solid + host transparent. |
| Content width | Default/`content` and `full` select the right inner row, retain gutters and leave the background full-bleed. |
| Link recipe | Assert rest/hover/current ink and weight, full bar-height links, text-width square 2px bottom-flush indicator without inset/glow, `gap-8`, unchanged focus and target floor using compiled CSS and browser measurements. |

**PRESERVE:** add one targeted test for each existing touched behavior: brand/search/user/mobile partition and visibility, native ordered/empty links and `onNavigate`, current-page cardinality and keyboard/focus, explicit `data-state`, 900px inclusive container switching, stable marker/layout-only merge and supplied Dialog ownership including the resize caveat. Keep focus visible and link targets ≥44.8px when the desktop links are visible; separately check compact controls at 390px. If shared code changes affect an unrequested sibling, run one base/current public-interface differential and fix any unrequested difference; do not commit tests that read Git history. Refactor only while focused checks remain green.

## 4. Planned commands

Run focused checks first, then broad checks only after explicit authorization; these commands may generate build artifacts and are **not run by this documentation task**.

```sh
pnpm exec vitest run packages/ui/src/organisms/top-bar/TopBar.test.tsx packages/ui/src/lib/storybook-css.test.ts packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts
pnpm build
pnpm exec vitest run --maxWorkers=2
pnpm props:check
pnpm test:props
pnpm typecheck
pnpm lint
pnpm test:package-exports
pnpm test:package-consumption
node scripts/build-artifact.mjs --check
pnpm test:artifact
```

When separately authorized after reviewed source/registry/catalog changes, use the existing generators `pnpm props:docs`, `python3 scripts/build_catalog.py` and, if the artifact is stale, `node scripts/build-artifact.mjs --write`; then rerun their checks. Include actual static CVA scanning and packed CSS/consumer evidence; passing source-class assertions alone is insufficient.

## 5. Browser and visual checks

Use the running Storybook only when that future work is authorized; also check shipped CSS in a packed consumer. Record browser/version, viewport and container sizes, theme, fonts and media preferences; compare to recoverable approved reference conditions rather than claiming visual equivalence to an unavailable image.

- Inspect initial, already-scrolled mount, after-scroll and return-to-top states; verify transparent/solid backing, explicit host transparent/glass overrides, overlay paint, no leftover solid sheen and reduced-transparency solid fallback.
- Measure own-link rest/hover/current colors, body size/current weight, focus outline, gap and `::after` height, width, square edges, absence of glow and alignment with the bar bottom. Check no overflow, long labels and 200%/400% zoom.
- Exercise 899/900/901px and adjacent fractional **container** widths, not only viewport breakpoints; verify desktop/compact visibility and keyboard exclusion, plus end-slot visibility at every width. Check `content` and `full` geometry/gutters with full-bleed backgrounds.
- Repeat relevant geometry, focus order and indicator checks in RTL and with reduced transparency; retain reduced-motion and host-owned Dialog/Menu focus, Escape, portal and resize behavior.
- Inspect the reference `Default`, transparent→glass, full-width and end-only stories; verify Logo + name/subtitle, current page, solid backing and StatusDot + text are composed from public design-system resources with no raw unstyled anchors. Owner visual review and capture remain separate from functional success.

## 6. Stop line

This is a documentation proposal only. Do not implement, mutate tokens/dependencies, edit the registry or generated outputs, stage, commit, publish or claim visual/accessibility conformance from this plan. If exact convention/spec/plan approval, scoped surfaces, required tokens, CSS emission or comparable evidence are missing during later implementation, report the specific missing proof and return to the owner; do not invent approval or a stylesheet workaround.
