# Timeline v0.1 implementation evidence

## Authority and scope

- Contract: [#109](https://github.com/egdev6/egdev-design-system/issues/109), v0.1, with the [owner full-contract approval](https://github.com/egdev6/egdev-design-system/issues/109#issuecomment-6251578819). All comments were read; there is no later substantive amendment. Historical Draft/Pending headers do not supersede that approval.
- Canonical payload SHA-256: `72879986e41f40f69965d010b34a58e98aa60f782e23da2a904a8ad0010a41e7`; frozen body SHA-256: `41574039a110304dbb8bfdb72f25e0c7f3181712db0eafe05949d1740b5632bb`.
- Implementation authorization: the parent delegated T15, S1–S4 in `odd/tasks/molecules-build.md`, binding the six-file architecture, existing component composition, Radix-owned geometry, no stylesheet, no new tokens and focused validation. This is an assistant record of the parent task, not a new independent approval receipt. The untracked coordination copy is unchanged.
- Branch: `feat/109-timeline`, based on `origin/main` at `d428967`. The parent supplied `@radix-ui/react-scroll-area` 1.4.0 in `e0b1d6a`; no dependency mutation was performed here.
- Avatar, Badge, Icon, VisuallyHidden and Surface's well recipe exist on `origin/main`, verified by `git ls-tree`. No prerequisite implementation or recipe copy was introduced.
- VIS-01: the existing `docs/design/foundation-boards/v2026-10-18/Timeline.png` was inspected as expected-design evidence, not replaced. Approved image SHA-256: `3511bd754204f4c9636d2d97f31a4f7e7bb5eaf67e5830ae852187912d4dee41`. No new capture, browser, AT or CI run is claimed.

## Decisions implemented

| Decisions | Delivery |
| --- | --- |
| D1–D3 | Passive events/chat molecule with a discriminated data API, required label/items and no children, render callback, selection or action API. Events accept trusted passive ReactNode bodies; chat remains escaped plain text. |
| D4 | Stable consumer ids key rows; supplied order, equal times and repeated messages are preserved. No date parsing, sorting, deduplication or reversal. |
| D5–D6 | Direct Radix Root/Viewport/vertical Scrollbar/Thumb, root type auto, one native viewport tab stop and token-derived 192/288/384px maximum heights. No fixed blank height, follow-scroll, focus effect or custom key/wheel/pointer handlers. |
| D7–D8 | Events: named region, live off. Chat: one named log, polite/off, additions relevant, atomic false. Both contain an explicit native ordered list, or an empty paragraph outside any list. History suppression remains host-controlled; busy is native metadata, not a guarantee of silence. |
| D9 | Host-controlled highlighted data-state; command data-kind and visible Command Badge; event category data-tone. Command background is explicitly conditioned on not-highlighted, so highlight wins without cascade-order dependence. No timer or arrival classifier. |
| D10 | Decorative Icon plus VisuallyHidden platform name; visible author and optional success Moderator Badge. Optional sm Avatar is decorative; omitted avatar means no disc, empty object requests fallback. No network-specific colors or author grouping. |
| D11 | Partial messages merge with No events yet, No messages yet, Moderator and Command. Required root label has no fabricated default. |
| D12–D13 | Unpainted content with native semantic elements and existing typography tokens. Only the scrollbar composes surfaceVariants well/full/none. The recipe's eg-surface marker is retained. Token spacing replaces source literals; descendant utilities reset legacy category glyph geometry/color, category nowrap and author margin. |
| D14 | Native attributes/listeners target only the root. Name, role, live policy, part content and state metadata are protected after rest props; untyped children/HTML/role overrides are dropped. className supports outer width, margin and placement only, never height clipping or internal appearance. No ref/asChild/subcomponents/viewport escape hatch. |
| D15 | Six meaningful files, pure typed derivation in useTimeline, JSX in Timeline, static CVA in types.ts, per-part cn, named exports. No stylesheet or extra internal modules. Radix's inline viewport/content/thumb layout and scrollbar suppression remain its bounded third-party responsibility. |

## Naming, stories and distribution

Eight existing approved naming concepts receive reviewed Timeline usages: accessible-name, visual-treatment, preset-dimensions, collection-items, localized-messages, transient-highlight, surface-material-tone and leading-icon. No convention, alias, approval or exception changed. Reviewed source: `packages/ui/src/molecules/timeline/types.ts`, whole-file SHA-256 `322b483929080991da7e4eede32cd70dff48bf8353f4eeef5a965aec3ecc4e20`.

The registry allows one usage per component/concept. Its transient-highlight usage documents both TimelineEvent and TimelineChatItem in one entry backed by TimelineEvent and the whole-file hash; both declarations are inspected and covered by AST tests. Nested identity/time/message fields remain component-specific data, not new conventions.

All 33 contract story scenarios are present under `Molecules/Timeline`, including host-driven append/history examples, rich events, literal chat, optional avatars, local messages, narrow/long/RTL cases and external Surface hosts. Default supplies only required args. No manual argTypes, play functions or fake optional-default args. The existing generic Storybook stories glob already includes molecules; preview CSS and production types.ts scanning are additive.

Real docgen verifies requiredness, union enums, constant defaults, native rows and protected omissions. AST checks cover every own declaration and both union branches. The installed extraction/enhancer/inference suite verifies all seven root metadata rows with zero diagnostics; mode-dependent items Controls are false in both branches. Actual browser Controls widgets remain unevaluated.

Public exports are exactly Timeline and TimelineProps/TimelineVariant/TimelineSize/TimelineTime/TimelineEvent/TimelineChatItem/TimelineMessages. CVA and hook exports stay internal. Both sorted package inventories and the packed runtime inventory are extended. Packed fixtures use the real public types, type negatives, SSR/CSR append identity and native/shipped/Tailwind CSS checks; the packed suite was deliberately not run by this worker.

## Acceptance and test-first evidence

- RED: the initial import-resolution failure was scaffolding evidence only. With the real types and minimal empty component/hook baseline present, all **17 behavior tests failed** on the intended missing region/log/list/focus/data behavior.
- GREEN: the real implementation passed **17/17**. A ResizeObserver-only jsdom shim was necessary; Radix keyboard, focus and semantics were never mocked.
- TRIANGULATE: repeated/equal-time chat identity and variant/live-priority boundary cases brought the component suite to **19/19**. The full focused component, docgen, Controls and preview-CSS set passed **299/299** across five files.
- Build/export checks initially caught a test-only SSR attribute-case assumption (`datetime` versus React's serialized `dateTime`). The regex was corrected case-insensitively; package exports then passed **51/51** without rebuilding unchanged production code.

| Acceptance | Evidence / limits |
| --- | --- |
| AC-01–AC-05 | DOM roles/names/live policies, keyed append/update/reorder/remove/backfill, history-off/busy and retained focus/scrollTop tested. Native browser anchoring and actual AT speech are not certified. |
| AC-06–AC-08 | All caps and vertical overflow configuration, tab traversal/exit, supplied elapsed/wall-clock datetime tested; shipped and preview CSS verified. Real browser dimensions, scrolling keys, touch and trackpad remain pending. |
| AC-09–AC-12 | Platform/qualifier text, decorative Avatar absence/fallback/src input, rich events, escaped messages, host highlights/commands and empty/partial localization tested. Real image loading and AT output remain pending. |
| AC-13–AC-14 | Public markers, supported root layout merge, legacy reset utilities, conditional command/highlight styling, scrollbar well composition and actual emitted CSS tested. Narrow/200% zoom/RTL visual reflow and pixel conformity remain pending. |
| AC-15–AC-16 | Build, declarations/runtime inventories, packaged SSR/CSS and real metadata pipeline pass. Packed React 18/19 consumption and browser Controls are parent gates; no hydration/visual/AT result is invented. |

## Observed validation

Every heavy command ran in the foreground with `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G` as a prefix.

- `pnpm vitest run packages/ui/src/molecules/timeline packages/ui/src/lib/timeline-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2`: 299 passed.
- `pnpm lint`: passed after formatting only the authorized edits.
- `pnpm typecheck`: passed.
- `pnpm props:check`: passed; generated view current and source evidence fresh.
- `pnpm test:props`: 87 passed, including immutable-receipt filtering.
- `pnpm build`: passed once; UI JS 203.13 kB, stylesheet 255.81 kB, declarations emitted.
- `pnpm test:package-exports`: first run 50 passed/1 test-only case mismatch; corrected run 51 passed, 116 reachable declarations checked.
- `pnpm props:docs`: regenerated the view after consolidating the initially rejected duplicate highlight usage.
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py`: regenerated the two catalog files, 110 rows. Bytecode output was disabled to preserve edit scope.
- `git diff --check`: passed.

No packed consumer suite, watch/server, dependency installation, token change, commit, stage, push or remote write was performed. CodeGraph status reported an uninitialized worktree; initialization would write outside the delegated surfaces, so exact source inspection was used instead.

Visual conformity with VIS-01: **Not evaluated**. Owner Storybook review, real-browser overflow/focus/reflow/RTL, Controls widgets and manual AT history/append checks remain separate from these functional and CSS results.
