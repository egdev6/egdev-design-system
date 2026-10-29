# NavList v0.2 implementation

## Authority and scope

- Contract: [#92 v0.2 full snapshot](https://github.com/egdev6/egdev-design-system/issues/92#issuecomment-6244803502), canonical SHA-256 `961548bf38ad7f1d49cf96b10e4a0fe9d95a16ab08d561183d248a72844dc375`.
- [Owner full-contract approval](https://github.com/egdev6/egdev-design-system/issues/92#issuecomment-6251528502) supersedes historical Draft/Pending metadata, not the substantive promises. D18 uses `kind`, without a historical `type` alias.
- Implementation authorization: parent task T16, S1–S4 in the untracked coordination copy `odd/tasks/molecules-build.md`, explicitly authorizing this bounded implementation and its integration surfaces. This is an assistant record of the parent instruction, not a new independent owner receipt.
- Dependency: the parent already committed `@radix-ui/react-collapsible` 1.2.1 in `6affd0f`. No dependency or token change is made here. All composed atoms/primitives are public on the supplied base `d428967`.
- Six meaningful files in `packages/ui/src/molecules/nav-list/`; **No stylesheet**, no additional internal module. The public barrel exposes only the component, eight approved schema/prop aliases and `navListVariants`.

## Decisions implemented

| Decisions | Implementation |
| --- | --- |
| D1–D3 | Separate molecule: native `nav > ul > li`, anchors, static captions and one-level independent Radix Collapsible groups. No menu/tree/tab roles, portal, roving focus or Sidebar ownership. |
| D4–D7 | Consumer-supplied `aria-current="page"`; no matching or auto-expansion. Radix owns controlled/uncontrolled disclosure state and callbacks. Original entry and React click event reach `onNavigate`; no auxclick interception or routing engine. Unavailable destinations are omitted by the application. |
| D8–D10 | Supplied finite non-negative integer counters retain zero and are never summed. Invalid counters and whitespace-only optional metadata are omitted. Tags compose unmodified Badge; signals compose StatusDot plus VisuallyHidden; warnings compose a decorative alert Icon plus VisuallyHidden text. |
| D11–D12 | The host owns the panel. Current anchors compose `surfaceVariants({ tone: 'surface-3', elevation: 1, padding: 'none', radius: 'md' })`, retaining its `eg-surface` marker, sheen, hairline and two-layer shadow. Token label/meta typography and full-size Badge replace the source's compact typography/tag. |
| D13–D14 | Link/trigger minimum height uses `min-h-11` (44px from the spacing base). Only labels truncate. No height animation; Radix data attributes drive chevron rotation, removed under reduced motion. Link inset inverse outline preserves current-row Material; triggers use `shadow-focus`. New root `eg-nav-list`; no legacy MenuList migration. |
| D15, D18 | Existing approved naming concepts only; `kind` is the entry-role discriminant. Schema captions are not landmark-name usages. No new conventions, aliases, exceptions or approvals. |
| D16–D17 | Ten dedicated `Molecules/NavList` stories. Static CVA utilities live in `types.ts`; per-part `cn()` and Surface composition live in the hook. JSX stays in `NavList.tsx`; disclosure interaction remains in Radix. |

Root `className` supports outer width, margin, placement and alignment only, merged last through `cn()`. No part/appearance override API or universal last-class-wins guarantee. Runtime injection cannot replace the landmark's role, name or generated children. Required non-empty names/URLs and globally unique non-empty stable entry ids remain consumer preconditions; no invented fallback destination or error-copy policy is added.

Radix 1.2.1's `dist/index.mjs` trigger sets `aria-controls` only while open (line 66 in the installed source). Closed content has no link descendants; no component-owned relationship/focus/keyboard engine is added. Static captions use a per-instance `useId()` prefix and a position suffix, never a data id; React keys preserve uncontrolled group state across reordering. Named groups isolate hover/current and disclosure selectors from unrelated consumer ancestors.

## Naming and metadata

Nine reviewed usages are appended without changing convention payloads or approval hashes:

- `accessible-name`, `collection-items`, `navigation-intent` → `NavListProps`.
- `open-state`, `initial-uncontrolled-open`, `open-change` → `NavListCollapsibleGroup`.
- `menu-entry-kind` → `NavListEntry`; `leading-icon` → `NavListLink`; `surface-material-tone` → `NavListTag`.

Reviewed source: `packages/ui/src/molecules/nav-list/types.ts`, whole-file SHA-256 `189b8cdce8ba0900cc1f66d24e9101f06c1250ceb004fb3ade0e036a0271c5f6`. Historical receipt tests remove only the exact reviewed post-receipt usage pairs; historical approvals are unchanged.

AST checks cover all 26 schema/own declarations. Real docgen and installed Storybook extraction/enhancement/inference cover the three root rows, requiredness, absent defaults, permitted native props, and zero metadata diagnostics. Complex data/callback controls stay disabled with concrete story references. No manual argTypes or play functions. The existing Storybook glob already includes molecules; additive production/preview source registration scans the new files.

## Acceptance and test-first evidence

- AC-01–AC-09, AC-11–AC-12: public-API tests cover native structure, explicit current route, unique static/Radix relationships, keyboard/click focus, independent disclosure state, controlled precedence, initialization/reordering, routing cancellation/modifiers/auxclick, integer/invalid counters, blank metadata, composed accessible equivalents, empty data and supported layout merging. Packed fixtures add strict public-type negatives, SSR, CSR and CSS assertions for the parent's React 18/19 gates.
- AC-10, AC-13–AC-14: DOM/CVA assertions and emitted production CSS checks cover token recipes, target geometry, Surface composition, focus and reduced-motion utilities. Browser computation, contrast, zoom and actual navigation remain unmeasured.
- AC-15: AST, real docgen and installed Controls pipeline assertions; actual browser widgets remain unmeasured.
- RED: the first focused run failed resolving the not-yet-implemented public component module. Subsequent implementation runs exposed CSS-free jsdom accessible-name whitespace differences (18 passed, 3 failed); names are asserted with optional inter-part whitespace, without changing atom content or adding an ARIA override.
- GREEN: focused behavior suite passed 21/21 before the additional cross-instance Radix-relationship triangulation. Final validation below includes that extra case.
- Metadata correction: its first run had 226 passes and one incorrect expected declaration count (28 rather than the actual 26); the inventory was corrected after reviewing the public schema.
- Naming regression: the first `test:props` run passed 86/87; the organism receipt's empty-usage assertion needed the same exact-pair historical filtering already used by the molecule receipt. No historical receipt or naming semantic was rewritten.

## Validation

All checks ran in the foreground. Heavy commands used `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G`; the table retains the exact command strings. Packed consumption is deliberately not run by this worker; the parent owns that gate.

| Exact command | Observed result |
| --- | --- |
| `pnpm props:docs` | Generated naming reference refreshed. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Generated 110 catalogue rows; bytecode disabled to avoid an out-of-scope cache. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/nav-list packages/ui/src/lib/nav-list-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts --maxWorkers=2` | 4 files, 249 tests passed; NavList behavior includes 22 cases. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm lint` | Pass, 383 files. Earlier formatting/import-order findings were fixed only in edited files. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm typecheck` | Pass, root and workspace checks. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm props:check` | Pass, source-byte evidence and generated view current. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:props` | 87/87 passed after the bounded historical-filter correction. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G sh -c 'pnpm build && pnpm test:package-exports'` | Single run: build passed; 51/51 package-export checks passed, including every NavList CVA utility, emitted focus/target tokens, SSR and both exact export inventories. UI stylesheet 254.28 kB. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2` | 52/52 passed against the real preview CSS, built in memory without output writes. |
| `git diff --check` | Pass. |

CodeGraph reported this worktree uninitialized; initialization was not performed because `.codegraph/` is outside the allowed edit surfaces. Targeted file inspection supplied structural context instead. The pre-existing untracked coordination document is unchanged; no Git staging, commit, push, server, watcher, install or packed-consumer command was run.

## Visual evidence limits

Inspected expected VIS-01: `docs/design/foundation-boards/v2026-10-18/specimens/nav-list--specimen.png`, SHA-256 `1c0673304fe2bd83ca3fe2d738f63e637932c9e6d13148ebcf552755a4c0ec4b`. VIS-02 `MenuList.png`, SHA-256 `8a88d52db066da90a5de0f618c5ec5143a898e745001ff4789765aaa2c7d8983`, remains popup-only supporting evidence, not a navigation parity target. Approved differences D11–D13 remain deliberate. No screenshot is replaced, captured or published. Visual conformity: **Not evaluated**. Owner Storybook review, browser accessibility/contrast/focus/zoom/media checks, packed React-major validation and full repository gates remain parent-owned; no CI run is claimed.
