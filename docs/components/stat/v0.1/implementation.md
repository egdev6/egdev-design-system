# Stat v0.1 implementation evidence

## Authority and scope

- Contract: [#70](https://github.com/egdev6/egdev-design-system/issues/70), v0.1, adopted by the owner full-contract approval comment. Frozen body SHA-256: `ce58ce875c68580c231f9bc1da97ff6cdf3e29da9622b549701ff46e8b0097ef`; canonical payload SHA-256: `5c3b8a9e4e0d0465131098751ef07b6031189f373959169be5271e961921faa3`; ordered history SHA-256: `f8130f86f181bf836028bdd15a3dd3157d8884a7bf00f52aa8e861fb610bff2a`. Historical Draft/Pending wording does not supersede that approval.
- Token approval (D6, AC-09): the owner approved exactly `--text-display-stat` (36px, line-height 1, weight 800, letter-spacing 0) and `--text-display-stat-sm` (28px, same companions) in an interactive questionnaire in the parent session on 2026-10-26, answering “Aprobado”. Assistant-recorded from the parent task; this is not a native, signed or independent approval receipt. No other token was added or changed.
- Separate implementation plan approval: the parent approved implementing exactly the v0.1 contract (six files, CVA in `types.ts`, per-part `cn()`, no stylesheet, dependency or extra API) under the owner's delegated full-batch development authorization. The parent separately approved registering the two new sizes in `packages/ui/src/lib/cn.ts` as a necessary consequence of the approved tokens. Neither is a new owner quote.
- Task: `odd/tasks/particles-build.md`, T25, S1–S6; base `3503273`, branch `feat/70-stat`.
- Expected design inspected, not replaced: VIS-01 `docs/design/foundation-boards/v2026-10-17/Stat.png`, SHA-256 `3bfb59c4b504d1e3d7157516c03cb40a0953e36ca7124cc9b05f013e91877e8b`. Card 3 (`--glass`) is out of scope (D2).

## Decisions applied

| Decisions | Implementation |
| --- | --- |
| D1, D9 | Native `div role="group"` named through `aria-labelledby` by the label `span` id from `useId()`. DOM order label → value → delta. No Radix base, focus, live region or announcements. |
| D2 | No glass variant or hidden helper. Legacy `.eg-stat--glass` consumers keep the legacy CSS. |
| D3 | `highlighted` reflects own `data-state="highlighted"` on the root, absent otherwise. No timers; the consumer owns timing and exclusivity. |
| D4 | `value={null}` renders `<span aria-hidden="true">—</span>` plus a visually hidden `unavailableText` (default `No data`); the value part gets `data-state="unavailable"`. Never renders 0. |
| D5 | Figures render as `String(value)`; strings are unchanged. |
| D6 | Two approved typography recipes in `theme.css`, compiled into `tokens.css` by the normal build; `text-display-stat` / `text-display-stat-sm` select them by `size`. |
| D7 | Label `font-display text-meta uppercase text-fg-muted`; delta `font-sans text-label-default text-fg-secondary`. |
| D8 | Highlighted root keeps the light edge: `shadow-[var(--shadow-edge),var(--shadow-glow-base)]` with `border-border-brand`. |
| D10 | No stylesheet. `compiled.css` scans only `atoms/stat/types.ts`. |

Root recipe (contract §6): `bg-[image:var(--gradient-sheen)] bg-surface-1 border border-border-hairline rounded-lg shadow-[var(--shadow-edge),var(--shadow-elev-1)] flex flex-col min-w-0`, `md` `gap-1.5 px-4 py-3`, `sm` `gap-1 px-3 py-2.5`, transition `transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out)] motion-reduce:transition-none`. The transition selector already exists on main's exact guard list; the guard is unchanged.

`className` is merged last on the root for outer layout only (grid placement, width, margin); appearance overrides are unsupported. Every part composes its CVA output with `cn()`. Root role, `aria-labelledby`, `data-state` and injected HTML content are owned: runtime values supplied through untyped paths never reach the DOM. Public exports are exactly `Stat`, `StatProps` and `statVariants`; part recipes, `StatSize` and the hook stay internal.

### Implementation notes and deviations

- **Named group for the delta color.** The contract lists `group-data-[state=highlighted]:text-fg-brand-raised` but no group marker on the root. The root carries `group/stat` and the delta uses `group-data-[state=highlighted]/stat:text-fg-brand-raised`, so a consumer `.group` ancestor with its own `data-state` cannot recolor the delta. Same color, same trigger.
- **`sr-only` declared in CVA.** The visually hidden no-data text uses `statUnavailableTextVariants = cva('sr-only')` in `types.ts`. Writing `sr-only` directly in `Stat.tsx` passed jsdom tests but the packaged stylesheet did not emit it (only `types.ts` is scanned); `test:package-exports` caught this before delivery.
- **Text and Surface are not composed.** Text/Heading only offer title and eyebrow recipes, none of which match the label, figure or delta (contract §1: Stat may adopt Text later without changing the contract). The contract approves Stat's own elevated-card recipe rather than Surface. The catalogue `Compone` column now reads `—` instead of the provisional `Text`.
- **Empty `delta`.** An empty string renders no delta element, the same as an absent one.

## Naming and metadata

Six existing approved conventions gain reviewed `StatProps` usages: `accessible-name` / `label`, `primary-value` / `value`, `value-context` / `delta`, `transient-highlight` / `highlighted`, `preset-dimensions` / `size`, `unavailable-measurement-message` / `unavailableText`. Source `packages/ui/src/atoms/stat/types.ts`, whole-file SHA-256 `15b16279287380b30f698fd06fd4c04c5bbaacf748de76ca2168ae37c4d18f29`. No convention text, approval, alias or exception changes; `unavailable-measurement-message` already covers numeric displays. The pairs are added to the post-receipt filtering test and the generated view is regenerated.

Real docgen and registered Storybook extraction verify six own rows: text for `label`, `delta`, `unavailableText`; boolean for `highlighted`; select for `size`; disabled control with a concrete reason for the required `string | number | null` `value`. Requiredness, constant defaults (`false`, `md`, `No data`), native rows (`id`, `title`, `aria-describedby`, `className`, `style`) and absent `children`/`role`/ref/`asChild` are checked; zero owned metadata diagnostics. Stories: Default, Highlighted, NoData, Small, TotalsRow. No manual argTypes or play functions.

## Token arithmetic

Each recipe declares a size plus three companions (`--line-height`, `--font-weight`, `--letter-spacing`): 2 × 4 = 8 declarations, all in `@theme static`.

- Utility namespace: 184 + 8 = 192. Inline aliases unchanged at 16; root unchanged at 55; aliases unchanged at 52.
- Total and compiled `tokens.css`: 255 + 8 = 263, also pinned in the packed native artifact check.
- Typography inventories: `STAT_TYPOGRAPHY` in `typography-spacing.test.mjs`, `typographyNames` in the packed fixture, and `tokenTypographySizes` in `cn.ts` (guarded by `cn.test.ts`, which also proves each size survives merging with `text-fg-*`).

## Acceptance coverage

| ID | Observed functional evidence | Remaining evidence |
| --- | --- | --- |
| AC-01 | Unit: `getByRole('group', { name })`, label id link, part order, unique ids. Packed SSR/CSR anatomy. | Real browser accessibility tree not evaluated. |
| AC-02 | Unit: 0, 1200, -3.5, `1.200`, `1,200`, empty string unchanged. Packed SSR `1,200`, CSR 4 → 5 → 0. | — |
| AC-03 | Unit: hidden dash, default and custom readable text, ignored while a value exists. Packed SSR/CSR no-data rendering. Built CSS ships `sr-only`. | Screen reader output not evaluated. |
| AC-04 | Unit and packed CSR: `data-state` set and cleared with root identity kept; highlight classes present. Built CSS checks border, glow with light edge and delta color. | Browser rendering not evaluated. |
| AC-05 | Unit: compact classes and `text-display-stat-sm`; CVA test. Built CSS uses the token recipe. | VIS-01 card 5 comparison not evaluated. |
| AC-06 | Unit: absent or empty delta renders no element. Packed SSR. | — |
| AC-07 | Unit: `eg-stat` kept, native props forwarded, layout className merged last. Packed SSR. | — |
| AC-08 | Unit: transition and `motion-reduce:transition-none` classes. Built CSS: `transition-property: none` under reduced motion. | Browser reduced-motion check not evaluated. |
| AC-09 | `test:tokens` 23/23: recipe values, counts and compiled parity at 263. | — |

## Observed validation

All commands ran in the foreground, serialized and memory-capped as requested. Build ran before tests. No timeout, blind retry, install, browser, server, watcher or CI run is claimed.

### Test-first evidence

1. Tokens: after adding `STAT_TYPOGRAPHY` and the 192/263 counts, `pnpm test:tokens` failed (utility count, compiled 255 ≠ 263, Stat recipe drift). After the theme edit: 23/23 passed.
2. Component: with the six files present and a stub hook rendering an empty `div`, the behavioural suite failed **19/19**. After the real hook and component: 47 passed, 1 failed (a test asserting a plain `text-fg-muted` class instead of its `data-[state=unavailable]:` variant; the test was corrected).
3. `cn`: with the tokens in `theme.css`, `cn.test.ts` failed 3/6 (drift guard and merge checks). After registering both sizes: Stat + `cn` 54/54 passed.
4. Packaged CSS: the new exports check failed on missing `sr-only`; moving the class into a CVA in `types.ts` made it pass (47/47).

### Full gates

| Exact command | Observed result |
| --- | --- |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm lint` | Pass; 358 files checked. Earlier formatting-only findings in edited files were fixed with the formatter on those files. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm typecheck` | Pass. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm build` | Pass; tokens built, UI stylesheet 246.81 kB. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test --maxWorkers=4` | 46 files / 936 tests passed (Stat suite: 48). |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm props:check` | Pass; registry valid, view up to date. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:props` | 87 passed. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:package-exports` | 47 passed. |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:tokens` | 23 passed. |
| `flock /tmp/egdev-gates.lock flock /tmp/egdev-packed.lock timeout 1500 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:package-consumption` | 12 passed: React 18.3.1 and 19.3.0, each with entries, strict types/negatives, SSR, jsdom CSR, native Vite CSS and Tailwind CSS. The first run failed only on the root export inventory, which was then updated. |

Packed fixtures keep the single React type import. Stat samples live outside `App`, so the `button:not(.eg-checkbox)` count (26) is unchanged. Ten `@ts-expect-error` negatives cover the required label and value, owned children and role, ref, `asChild`, invalid size, glass, object values and non-boolean `highlighted`. The CSS helper is defined once, serialized into the native and shipped harnesses, and called in all three consumers.

Visual conformity with VIS-01: Not evaluated (no browser capture under equivalent conditions).
