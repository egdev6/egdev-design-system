# ListItem v0.1 implementation evidence

## Authority and scope

- Contract: [#88](https://github.com/egdev6/egdev-design-system/issues/88), v0.1, with the [owner full-contract approval](https://github.com/egdev6/egdev-design-system/issues/88#issuecomment-6251516412). All published comments were recovered; no substantive amendment supersedes v0.1. Historical Draft/Pending headers are interpreted through that approval.
- Canonical payload SHA-256: `d2dbc1890bc6f22a1947399a578ba6e94c48a07302ea4c08b5420d443b5da737`; frozen issue-body SHA-256: `16b41a0dfb77547c5577a9de110ac7e52f81fbdbfd1e5260d4c04d0079e11f3f`.
- Implementation authorization: the parent delegated complete implementation of this contract under `odd/tasks/molecules-build.md`, T7, S1–S4. This records the supplied task, not a new owner quote or independent approval receipt.
- Base: `origin/main` at `d428967`, branch `feat/88-list-item`. Surface and all required atoms are already exported on that base. Optional Menu is not composed or required by these examples.
- Six meaningful files in `packages/ui/src/molecules/list-item/`; **No stylesheet**, extra internal module, dependency or token change. Legacy PostCard styles/consumers remain unchanged.

## Decisions applied

| Decisions | Implementation |
| --- | --- |
| D1–D2 | Generic compound ListItem plus Body, Content, Media, Footer, Meta and Actions. No domain data, slot-prop aliases or automatic publication behavior. |
| D3 | Default non-focusable div; installed Radix Slot owns single-child element, handler, class and child-ref composition. Populated children remain non-interactive containers; root role/focus/selection props are protected. Conflicting child props remain unsupported, not rewritten. |
| D4–D5 | Seven exclusive `data-state` snapshots, independent `data-variant`, default/card runtime fallbacks. Examples supply visible status words, failure detail and decorative failure icon. No timers, notifications, hidden-only status or live region. |
| D6 | Card/compact use Body then optional Footer. Row wraps Body, Meta and Actions in consumer DOM order. No calendar/time grouping. |
| D7 | Empty is card-only and requires one slotted native button/anchor with phrasing content. Child owns href, type, disabled and activation. No compound div parts or nested controls. |
| D8 | Dragging is presentation only. Media alone has opacity-50; no draggable attribute, listeners or deprecated drag ARIA. The reorder example's host owns two-item order, boundary disabling and callbacks. No drag engine or Menu prerequisite is introduced. |
| D9 | Root composes exported `surfaceVariants` once; Media composes its well recipe. Conditional state recipes replace the new image/shadow, remove paint/shadow for done/off/empty and keep empty focus stronger than its frame shadow. Surface's existing marker is retained. No handwritten halo or copied Material engine. |
| D10–D11 | Existing typography, token spacing/radius, 88px media via `calc(var(--space-20) + var(--space-2))`, wrapping rather than clipping/clamping or new breakpoints. |
| D12 | No public root/part ref; Slot preserves the child's ref. Each part merges independently with `cn()`. Root supports outer margin/width/placement; parts support local layout constraints, not arbitrary appearance, hidden content or ordering. |
| D13 | Compound JSX and hook/helper remain in the six approved files. CVA and all authored utility recipes are in `types.ts`, including outer-layout examples. No manual argTypes or play functions. |

### Material and delivery notes

The contract's danger/40 border uses the existing token's actual utility name, `border-status-danger/40`. No token was added. Empty hover uses `not-disabled` so native disabled buttons cannot receive the hover treatment. No ListItem transition or animation is introduced, so there is no additional reduced-motion branch to disable.

Root `data-[state=…]` selectors override Surface's unconditional image/background/shadow at CSS evaluation time; they are not expected to be removed by `twMerge`. Empty focus uses the combined state/focus-visible selector. Named `group/list-item` scopes part status/variant recipes. Supported layout merges are tested independently; no universal last-class-wins guarantee is made.

Production CSS gains only the explicit `molecules/list-item/types.ts` scan entry, additive to existing atom/primitive entries. Storybook already discovers all levels via `src/**/*.stories.@(ts|tsx)`; its preview adds the ListItem story source and main config documents permitted inherited native props. Title: `Molecules/ListItem`.

## Naming and metadata

Only three existing approved conventions gain `ListItemProps` usage evidence:

- `status` → `item-presentation-status` (not Gauge's measurement `state`).
- `variant` → `visual-treatment`.
- `asChild` → `slot-composition`.

No convention definitions, aliases, approvals or exceptions changed. Source: `packages/ui/src/molecules/list-item/types.ts`, reviewed whole-file SHA-256 `32748d00736596f3fb04297aea7f903e74152f8f0e430974160a6cad8a1135f2`. The historical-receipt filter removes only these exact new usage pairs. The generated naming reference and catalog are regenerated from their sources.

AST coverage checks all 12 own declarations across the three union branches. Real docgen verifies all seven components, required children, constant defaults, all seven statuses, allowed native attributes and excluded semantic/ref props. Installed Storybook extraction, registered enhancement and inference verify select/boolean/disabled complex-content controls with zero diagnostics. Browser widgets are not evaluated.

## Test-first and focused validation

### RED / GREEN

1. Behavior tests were written first. The focused suite failed to resolve `./index` before the public component existed (one failed suite, zero collected tests).
2. After implementing the compound component/hook/CVA: **20 behavior tests passed**. Final triangulation adds a public-type boundary test (**21 tests passed**, also checked by TypeScript). They cover passive defaults, protected/native props, Slot refs/events/semantics, all statuses, runtime fallback, empty keyboard/click/disabled/link/form behavior, active done/off controls, host reorder boundaries and independent layout merges.
3. Delivery tests initially failed on missing public exports and CSS scan registration. Two expectations were also corrected to the installed docgen enum order and normal quoted string default summary. After integration: **5 delivery tests passed**.
4. The central Controls regression initially rejected ListItem's approved `asChild` API under its old component allowlist. Adding ListItem to that exact allowlist yielded **230 tests passed across three metadata/delivery files**.

### Observed commands

| Exact command | Result |
| --- | --- |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/list-item --maxWorkers=2` | Pass: 21 tests (20 behavior cases plus public-type boundaries). Initial pre-implementation RED recorded above. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/lib/list-item-contract.test.ts --maxWorkers=2` | Pass: 5 tests after its initial RED. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/lib/list-item-contract.test.ts packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2` | Pass: 3 files, 230 tests after the asChild allowlist correction. |
| `pnpm lint` | Pass: 383 files checked; earlier formatting/import-order findings in changed files were corrected manually. |
| `pnpm typecheck` | Pass: root and workspace checks, including the final component and metadata changes. |
| `pnpm props:docs` | Naming view regenerated. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Catalog regenerated: 110 rows; bytecode generation disabled to avoid out-of-scope artifacts. |
| `pnpm props:check` | Pass: valid registry, current generated view and source hashes. |
| `pnpm test:props` | Pass: 87 tests. |

The in-memory Tailwind test compiles every production root/part/Surface utility against the actual token source and checks selector emission, without writing build artifacts. This is compiler evidence, not a production Vite build, computed-style or browser-cascade result.

## Remaining parent gates

- Run production build/full gates as authorized for the parent. Focused lint/typecheck pass; no production artifacts were generated by the writer.
- Updated packed fixtures include all 11 new public names/types, exact runtime/declaration export inventories, type-negative empty/ref/semantic/domain cases, SSR compound semantics, CSR child-ref/focus preservation and shipped/native/Tailwind CSS checks. **The writer did not run the packed suite or production package-export checks.** React 18/19 consumption remains pending parent execution.
- AC-01–AC-06, AC-08–AC-09 and the class/metadata portions of AC-10–AC-12/AC-14–AC-15 have focused automated coverage. Narrow/long-content, status, media, focus and class-composition stories prepare the remaining checks; stories are not observed browser evidence.
- AC-07/AC-13 and browser portions of AC-04/AC-10/AC-11/AC-15: **Not evaluated** (wrapping/zoom, accessible tree/contrast, Material/focus cascade, actual Controls widgets and comparable visual captures).
- Approved expected-design hashes are retained by reference: VIS-01 `1b3f2dcbc086ae029edc4dc0a7b92b95472b81e619db320507a4e23b6f8259ec`, VIS-02 `1e865c63c3b3a5001a686f5b2bdd50791267fbb1e68b2f7e2e8d0c7246116959`. No new capture, pixel-parity claim or replacement reference was produced. Visual conformity: **Not evaluated**.

No commit, stage, push, install, watcher, browser/server or CI operation was performed by this writer. The untracked coordination copy is not part of the component change.
