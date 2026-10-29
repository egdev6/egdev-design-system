# ButtonGroup v0.1 implementation evidence

## Authority and scope

- Contract: [#79](https://github.com/egdev6/egdev-design-system/issues/79), v0.1, adopted by the [owner full-contract approval](https://github.com/egdev6/egdev-design-system/issues/79#issuecomment-6251489483). All issue comments were read; there is no later substantive amendment. Approval-record canonical SHA-256: `31101fd0ddba4c0f3e19e86daeda95642ac6fb563af789815274615b29aa8c5a`; frozen body SHA-256: `73dea022b2b5fae249fd501f08b34ece3cc42e7aa91e7dc261880b7ad8fadfde`.
- Implementation authority: the parent explicitly delegated implementing that contract under `odd/tasks/molecules-build.md`, T4, S1–S4, on `feat/79-button-group`, base `d428967`. This records the delegated implementation scope, not a new owner quote or independent approval receipt.
- S1: approved UI molecule. S2: no dependency or token change. S3: Button, IconButton, Icon and Slot are already on the base; no missing prerequisite is implemented. D2 and the explicit parent instruction keep Menu consumer-owned and non-blocking. S4: focused checks only; parent owns terminal Git actions, full gates and PR preparation.
- Six meaningful component files, static CVA utilities in `types.ts`, root `cn()` composition and **No stylesheet**. No internal engine, new convention, state, menu, root ref or child injection.
- Expected-design references remain unchanged: VIS-01 `a77617b1f76cac9c06ab0772081edc3f4f4838cd4069f91628580cdd800eab60`; VIS-02 `d80802e8ffcb69dbcf383b508571f9573f9462fd9c385d86fab894398321e82d`. Visual conformity: **Not evaluated**.

## Decisions applied

| Decisions | Implementation and limits |
| --- | --- |
| D1, D8 | `spaced` defaults to wrapping, `gap-3`; `attached` stays non-wrapping with `gap-0.5` and stretched items. The group paints no surface; children retain their Material. |
| D2 | No built-in Menu, popup state or trigger handlers. SplitButton demonstrates the action pair with an action logger, explicitly not a working popup. Actual Menu integration remains untested until Menu exists. |
| D3, D7 | Native `div role="group"`, horizontal layout and independent tab stops. No toolbar role, orientation API, roving focus or arrow interception. Native root handlers still receive bubbled events. |
| D4 | Root-owned direct-child variants set logical small inner corners and focus-visible relative positioning/z-index 10; no cloning or prop/class injection. Middle items get both inner corners. |
| D5 | Consumer sizes remain untouched. Tests and stories pair Button md / IconButton lg (48px), and Button sm / IconButton md (40px). |
| D6 | Optional `label` maps to `aria-label`; empty/absent labels omit it. Native `aria-labelledby` and descriptions are forwarded. Untyped attempts to override the owned role or aria-label do not win. |
| D9, D10 | No public root ref or stylesheet. Child refs remain functional through the existing Slot boundary. Legacy split/join rules and consumers are unchanged. |

`className` merges last for outer margin and parent alignment only (`ms-auto`, `mt-3`). This is not blanket permission to override grouping, corners, Material or child appearance. Parent-versus-child conflicts are not resolved by `twMerge`; browser computed-style confirmation is still required.

Exports are exactly `ButtonGroup`, `ButtonGroupProps` and `ButtonGroupVariant`. The hook and CVA recipe stay internal. `compiled.css` now scans molecule `types.ts` files; the existing recursive Storybook glob already includes molecule stories, so no extra stories glob was needed.

## Naming and metadata

Existing approved conventions gain reviewed `ButtonGroupProps` usages only: `accessible-name` / `label` and `visual-treatment` / `variant`. No aliases, convention approvals or exceptions change. Source: `packages/ui/src/molecules/button-group/types.ts`, whole-file SHA-256 `2ecb19299d2410ef130ed830d62b410b17c8adc04bb73625de6bd0940ed94e51`.

The native `children` property is omitted before its required ReactNode redeclaration. This preserves the effective public contract while preventing docgen from classifying the owned row as inherited/native and filtering it out. Real extraction and the registered enhancement/inference pipeline verify text label, select variant, disabled children control, requiredness, native rows, absent label default and constant `spaced` default, with zero owned-metadata diagnostics.

Stories: Spaced, SplitButton, SmallSplitButton, AttachedThree, WithDisabledItem and RightToLeft under `Molecules/ButtonGroup`. No manual argTypes, play functions, appearance adapter or fake menu ARIA.

## Acceptance coverage

| ID | Observed evidence | Remaining evidence |
| --- | --- | --- |
| AC-01 | Named/unnamed native group, empty-label rerender, public root and owned-semantics protection. | Real accessibility-tree review not evaluated. |
| AC-02 | Public rendered classes, variant rerender and in-memory compilation of actual CVA candidates confirm token gaps and wrapping rules. | Actual packaged CSS gate belongs to parent. |
| AC-03 | First/last logical selectors and all four small-radius declarations are emitted after rounded-md; three children render unchanged. | Computed inner/outer corners, including RTL, not evaluated in a browser. |
| AC-04 | Tab/Shift+Tab preserve enabled DOM order, skip disabled items, Enter/Space activate, and four arrows reach child handlers without group navigation. | — |
| AC-05 | Focus-visible direct-child relative/z-10 classes and emitted rules verified. | Computed stacking and visible focus-ring overlap not evaluated. |
| AC-06 | Existing Slot preserves IconButton ref, trigger ARIA/data-state and ArrowDown/click handlers through both supported size pairs. | This is a pass-through check, not actual Menu opening or first-item focus. Full Menu integration deferred. |
| AC-07 | Native attributes, relationships, root events and outer-layout classes survive; marker retained. | — |
| AC-08 | Production molecule source registration and in-memory Tailwind emission verified. Added package tests cover root exports/types, internal non-exports, SSR/CSR and shipped CSS in native/Tailwind consumers. | Full build, package-export and packed consumer execution intentionally left to parent. |

## Observed checks

- RED: the initial inert `<div />` boundary failed all 9 behavior cases (missing group/name/children and SSR role).
- GREEN: implemented hook/JSX passed all 9 cases. Adding hook derivation and focused in-memory CSS compilation yielded 11/11 passes across two files.
- TRIANGULATE: empty/absent naming, untyped semantic injection, variant reversal, three attached items, disabled middle action, child handlers/refs, both size pairs, native relationships, deterministic SSR and token utility ordering.
- Metadata regression: initially 3 failures exposed the inherited-children docgen problem; omitting it before redeclaration restored 228/228 passes.
- CSS regression: the first in-memory assertion omitted Tailwind's existing token fallback; the observed output was `var(--radius-sm, 4px)`. Assertions now cover that actual output; no recipe/token was changed.

| Command | Result |
| --- | --- |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/button-group --maxWorkers=2` | RED 9 failed; GREEN 9 passed. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/button-group packages/ui/src/lib/button-group-styles.test.ts --maxWorkers=2` | Final 11 passed. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=1` | Final 228 passed. |
| `pnpm props:docs` | Generated view updated. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Regenerated both catalog artifacts, 110 rows; no Python cache output requested. |
| `pnpm props:check` | Registry valid; generated view current. |
| `pnpm test:props` | 87 passed. |
| `pnpm typecheck` | Passed. |
| `pnpm lint` | Passed, 383 code/config files checked, no fixes. |

Package scripts also passed syntax-only `node --check`; they were not executed. No build, packed install, browser, Storybook server, watch, CI, dependency mutation, commit or push was run. CodeGraph reported this worktree uninitialized; scoped file inspection was used rather than writing an index outside the allowed surfaces.
