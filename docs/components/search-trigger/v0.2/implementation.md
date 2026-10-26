# SearchTrigger v0.2 implementation evidence

## Authority and scope

- Contract: [#99](https://github.com/egdev6/egdev-design-system/issues/99), full contract **v0.2**, adopted by the owner full-contract approval comment. Frozen issue body SHA-256: `11d43b0298a2c53f2ea6abf3e1a02c2335b142a9abb2420077a054f75f410039`; ordered history SHA-256: `bd4abf686861b07919df9752940d1e45998f4f80f2f6d3280010e32e4d354067`. Recomputed locally from the live body: the v0.1 canonical payload (from the line-start `## 1. Purpose and scope` heading through EOF) matches `c3bedf25014aa42b68d9af160658a74515878fb542860c7dfdaad242257e3d7e`. Applying the four v0.2 replacements gives `e3e0a7d1a9d128e722534355cf331d74e4960642d0d2ccae5200183eddfb98d3`, the approved v0.2 canonical SHA-256. Each replacement matched its required count.
- Separate implementation plan approval: the parent approved implementing exactly this contract in this delegated task: six files, CVA in `types.ts`, per-part `cn()` and composition of merged components only. That approval comes from delegated full-batch development authority. It is not a new owner quote or an independent receipt.
- Task: `odd/tasks/particles-build.md`, T27, S1–S6. Base `3503273`, branch `feat/99-search-trigger`. Icon, Kbd and Surface (`surfaceVariants`) are merged and publicly exported on this base. Button is deliberately not composed (D1).
- No new stylesheet, internal module, token, dependency, Radix package, `asChild`, open state or key listener. Legacy CSS and earlier components are unchanged.
- Expected design referenced, not replaced: VIS-01 `sha256:3c537a38c1ff3d2788d0989a230cf139cee56db65ad815fbfa182152a8d965c7` and VIS-02 `sha256:a25503bf5b9b86a0f35c1c0a1c17aee49d6a8c53d869261b33a04f42d161d572` (`docs/design/foundation-boards/v2026-10-18/`).

## Decisions applied

| Decisions | Implementation |
| --- | --- |
| D1, D3, D9 | Native `button type="button"` with React 18-compatible `forwardRef<HTMLButtonElement>`. Compatible native props and events are spread on the root. The hook drops `type`, `role`, `aria-label`, `aria-labelledby`, `aria-pressed`, `children` and `dangerouslySetInnerHTML` even when untyped code injects them. Native `disabled` stays native. |
| D2, D10, D11 | Only native `onClick(event)`. No open, popup, expanded or controls state is created. Host-injected ARIA, `data-state` and handlers from a Radix-style Slot reach the same single button unchanged. |
| D4, D5, D7 | `shortcut` is raw display text in an unmodified Kbd, inside `span aria-hidden="true"` with `ms-auto`. Whitespace-only and absent hints are omitted. There is no listener, navigator access, effect or state. `aria-keyshortcuts` and `aria-describedby` come only from the host. |
| D6, D8 | `label` (default `Search…`) is both the visible text and the root `aria-label`. `compact` drops the label span and the hint but keeps the name, ref and handler. |
| D12, D13 | The root composes `surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' })` with the static owned recipe: `min-h-10`, `pointer-coarse:min-h-11`, `min-w-48` (192px), compact `w-10` / `pointer-coarse:w-11` / `p-0` / `justify-center`, label-default size with the body weight token, `text-fg-muted` and `border-border-hairline-strong`. Hover (`enabled:hover:`) applies brand border and secondary text. Focus-visible uses `shadow-focus`. Disabled sets opacity 45%, no pointer events and a not-allowed cursor. Border/color transitions use fast/out timing, removed under reduced motion. The icon is `Icon name="search" size="sm"` (16px, non-shrinking). |
| D14 | The root keeps the stable `eg-search` marker (plus Surface's `eg-surface`). No `eg-search--*`, `eg-search__*` or `is-hover` output. Legacy `.eg-search` rules stay in `@layer components`, and utilities override them by layer order. The hint wrapper keeps the legacy `.eg-search > .eg-kbd` margin rule from matching. |
| D15 | No stylesheet. `compiled.css` scans only production `types.ts`, and Storybook scans the story file. |

`className` is merged last on the root, through `cn()`, for width, margins and parent layout only (for example `w-full`). It does not support Material, size or part appearance overrides. The label and hint parts use their own `cn()` calls. Public exports are exactly `SearchTrigger` and `SearchTriggerProps`. The CVA recipes and the hook stay internal, and the package-exports test checks this.

The transition guard is unchanged: `transition-[border-color,color]` was already on the allow-list.

## Naming and metadata

Three existing approved conventions gain exact reviewed `SearchTriggerProps` usages:

- `accessible-name` / `label`
- `keyboard-shortcut-hint` / `shortcut`
- `compact-presentation` / `compact`

Source: `packages/ui/src/atoms/search-trigger/types.ts`, whole-file SHA-256 `31b3eff9676b1a6646a39ed20eea22a30df4fa29741bae5d38bd89434b7d95fc`. No convention text, alias, exception or approval changed. The convention/source pairs are added to the post-receipt test, and `docs/prop-naming.md` is regenerated.

Real docgen plus registered Storybook extraction, enhancement and inference verify three own rows: text for `label` and `shortcut`, boolean for `compact`. They also check the constant defaults (`"Search…"`, `false`), the absent shortcut default, the host-integration native rows and the omitted owned or unsupported APIs. There are zero owned-metadata diagnostics, and no manual argTypes or play functions. Stories (`Atoms/SearchTrigger`): Default, MacHint, WindowsHint, Compact, CustomLabel, Disabled, FullWidth, Activation.

## Acceptance coverage

| ID | Observed functional evidence | Remaining evidence |
| --- | --- | --- |
| AC-01 | Unit test: one `button.eg-search[type=button]`, name and text “Search…”, decorative 16px icon, no Kbd, popup or keyshortcut attributes. Packed SSR on both React majors. | Real accessibility tree not evaluated. |
| AC-02 | Unit test: click, Enter and Space give exactly 3 native clicks; the form does not submit; the DOM is unchanged. Packed CSR activation. | — |
| AC-03 | Unit test: raw hidden Kbd, whitespace-only omission, compact keeps the same node, ref, name and handler. Packed SSR and CSR compact identity. | Visual comparison to VIS-01/02 not evaluated. |
| AC-04 | Unit test: Ctrl+K and Meta+K do nothing; no `key*` document or window listeners across several instances and unmount; deterministic `renderToString`; source scan for navigator, listeners, effects and state. Packed CSR listener spy. | — |
| AC-05 | Unit test: disabled cannot be focused or activated; the only opacity utility is `disabled:opacity-45`. Built CSS checks `opacity: 45%`. Packed CSR disabled guard. | Computed browser opacity not evaluated. |
| AC-06 | Unit test and packed CSR: Slot-injected ARIA, `data-state` and handler, shared ref, a single button, and each composed handler runs once. | Real host Dialog integration belongs to its host's approved tests. |
| AC-07 | Unit test: host `aria-keyshortcuts` and description survive; none is created from the hint. | Screen-reader announcement not evaluated. |
| AC-08 | Unit test: Surface well classes plus the owned border and text override. Built CSS: token-backed utilities, focus two-ring shadow, legacy rules before the utilities layer. | Browser computed SVG size (16px vs legacy 18px) and focus priority **not evaluated**. |
| AC-09 | Built CSS: `@media (pointer: coarse)` min-height and width, `min-w-48`, reduced-motion `transition-none`. Unit test: layout `className` last; compact `w-full` wins. | Browser media, focus and layout checks not evaluated. |
| AC-10 | Six files, no listener engine, named exports, static CSS reach packed React 18.3.1 and 19.3.0 SSR/CSR and native/Tailwind CSS consumers. | — |
| AC-11 | Docgen and Controls tests above. | Browser Controls widget review not evaluated. |

Browser and visual conformity: **Not evaluated**.

## Observed validation

All commands ran in the foreground, serialized and memory-capped as requested. No timeouts, blind retries, installs, browsers, servers, watchers or CI runs.

### Test-first evidence

1. RED: `types.ts` plus an inert stub (`<button />`, empty hook) made the behaviour suite fail **12 of 13** tests: the button had no name, SSR markup was `<button></button>` and class composition was empty. The listener-absence guarantee passed against the stub, as a negative check should.
2. GREEN: after the hook and JSX were implemented, **13/13 passed**.
3. TRIANGULATE: two temporary hook mutations were caught and then reverted. Removing whitespace trimming failed the hint test. Letting `...rest` override `type` failed the protection test (2 failures, 11 passes). Back to 13/13 after the restore.

### Full gates (base 3503273 + this change)

| Command | Result |
| --- | --- |
| `pnpm lint` | exit 0, 358 files, no fixes |
| `pnpm typecheck` | exit 0 |
| `pnpm build` | exit 0 |
| `pnpm test --maxWorkers=4` | 46 files, 926/926 passed |
| `pnpm props:check` | registry valid; view up to date |
| `pnpm test:props` | 87/87 passed |
| `pnpm test:package-exports` | 47/47 passed |
| `pnpm test:package-consumption` | 12/12 passed (React 18.3.1 and 19.3.0; `search-trigger` CSR stage completed on both) |

The packed SearchTrigger samples stay outside `App`, so main's `button:not(.eg-checkbox)` count of 26 and the 255-variable pin are unchanged.

## Deviations and limits

- The catalogue `Compone` column changes from `Button, Kbd` to `Icon, Kbd, Surface`, as contract D1 requires.
- The visual/browser criteria of AC-08, AC-09 and AC-11 still need a browser run: computed 16px SVG over the legacy 18px rule, focus shadow priority and Controls widgets.
