# Link v0.1 implementation and verification

## Contract and authorization

- Contract: [issue #61](https://github.com/egdev6/egdev-design-system/issues/61).
- Full-contract approval: [owner approval record](https://github.com/egdev6/egdev-design-system/issues/61#issuecomment-6251446299). This is the published manual approval record, not a native independent review or implementation receipt.
- Recorded canonical SHA-256: `40d2a5c032f73bee4fd74cce6b55670e5e2e574e48fad0e51a6d980a58f5b4a3`.
- Recorded frozen whole-body SHA-256: `6fe9a7c751cd84f4428872066a5ebb2655ccd08fc5f61fd2bb0c5984905e23e1`.
- Expected design VIS-01: [Link.png](../../../design/foundation-boards/v2026-10-17/Link.png), recorded SHA-256 `31eb1841a9bc072f49c5aaf2e7fa3fa4d2dbd3077eb5bccb146c827f93e7b03f`.
- Implementation authorization is the separate particles-build delegation (T6, S1–S6, owner instruction L1), not the full-contract approval comment. The delegation authorizes the contract's bounded six-file implementation and integrations. Parent owns all Git mutations and PR publication.
- Current source baseline: `7db2905`; Icon and Text/Heading are exported. Slot/Slottable, VisuallyHidden, Surface and Spinner also exist. Link composes only Icon and the contract-named Radix Slot/Slottable and VisuallyHidden primitives. Both direct Radix dependencies already exist; no dependency or token changes were needed.

## Implementation boundaries

Six meaningful files live in `packages/ui/src/atoms/link/`: `types.ts`, `useLink.ts`, `Link.tsx`, `Link.test.tsx`, `Link.stories.tsx`, `index.ts`. **No stylesheet**, no internal modules and no changes to legacy CSS.

- `types.ts` owns the required-native-href / child-owned-href union, documented defaults and static root/arrow CVA utilities.
- `useLink.ts` owns host selection, safe deduplicated external rel tokens, target, arrow direction and per-part `cn()` composition.
- `Link.tsx` is JSX over that result, with a React 18-compatible anchor `forwardRef`, Radix Slottable, decorative Icon at `sm` and Radix-hidden notice.
- `Link` and `LinkProps` are public; the CVA helpers and hook are internal.
- Native anchors own Tab/Enter/navigation. Radix owns child/ref/event composition. No custom keyboard behavior, disabled state, variant or size API was added.
- External semantics also normalize target/rel on the slotted child because Slot normally gives child props precedence. Child href, handlers and refs are retained; custom router children must spread props and forward the anchor ref.
- A root whitespace text node separates the accessible label from the hidden notice. It creates no visible flex item. The installed accessible-name tests caught concatenation when whitespace was only inside the hidden span.
- Root `className` supports outer margin/alignment only and is merged after the root recipe through `cn()`. Child classes follow Radix composition; do not distribute conflicting layout utilities between Link and its child. Neither classes nor `style` grant appearance overrides or universal cascade precedence.
- Arrow utilities explicitly reset the retained legacy transform before using CSS `translate`; otherwise hover would move it twice. Reduced motion removes translate and transitions. Static production `@source` scanning ships all required utilities without an application Tailwind compiler.
- Registry usages reuse exactly `slot-composition`, `new-tab-navigation`, `new-tab-notice` and `trailing-arrow`, pointing to reviewed `LinkProps` source bytes. Native href/target/rel, content and className introduce no new conventions. All approval receipts/hashes and convention meanings remain unchanged.

## Contract coverage

| Criterion | Observed automated evidence | Remaining evidence |
| --- | --- | --- |
| AC-01 | Native anchor, href, public marker, accessible label, decorative right arrow at Icon sm | None for the DOM contract |
| AC-02 | Native/slotted external target and rel safety, deduplication, up-right glyph and default notice; SSR and packed consumers | Real navigation/browser announcement not evaluated |
| AC-03 | Localized notice and cleanup when external becomes false | Assistive-technology announcement not evaluated |
| AC-04 | Arrow omitted independently of external notice | Visual comparison not evaluated |
| AC-05 | Router-like prop spreading, child-first events, parent/child refs and cleanup in unit and packed React 18.3.1 / 19.3.0 consumers | Real router integration not evaluated |
| AC-06 | Rest/hover/focus utilities are emitted; legacy rules remain unchanged | VIS-01 comparison **Not evaluated** |
| AC-07 | Focus and reduced-motion utility invariants and emitted CSS; native Tab/Enter unit tests | Browser focus visibility and reduced-motion emulation **Not evaluated** |
| AC-08 | Supported root layout merge preserves marker; packed fixture checks margin conflict resolution | Browser layout inspection not evaluated |
| AC-09 | Build/export CSS checks; installed native and Tailwind consumer builds on both React majors | Pixel rendering not evaluated |
| AC-10 | Real TypeScript docgen, all own declarations/union branches, registered enhancer and installed inference: zero owned metadata diagnostics | Actual Controls widgets **Not evaluated** |

No contract deviations. Approved design differences remain 16px arrows (D6) and the 14px label-default typography recipe (D7), replacing legacy 18px and 15px geometry. Docgen flattens the href union into an optional row; descriptions explain the branch rule, while strict packed negative types enforce it. This is not API widening.

## Test-first evidence

1. Initial focused run failed to resolve the not-yet-created hook (collection failure, not behavioral RED).
2. With minimal native-anchor scaffolding, the same focused run observed **11 failed behavior tests**: missing public marker/recipe and arrow, missing external safety/notice, missing composition/ref/event behavior and missing motion utilities.
3. Implementation reached **11/11 passing** focused Link tests. Intermediate failures exposed the missing accessible-name separator; they were fixed before GREEN.
4. Focused Link plus real Storybook metadata suites passed **119/119** tests. Alternatives include internal/external, native/slotted, false arrow, custom notice, explicit target/rel, deduplicated rel, rerender cleanup, supported layout merge, native keyboard/click, SSR and both kinds of ref.

Focused command:

```sh
timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/link/Link.test.tsx --maxWorkers=2
```

Focused integration command:

```sh
timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/link/Link.test.tsx packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts --maxWorkers=2
```

## Local gates

Build ran before tests because tests read compiled token CSS. Gates ran serially in the foreground with memory caps; no watch/server process was started.

| Exact command | Observed result |
| --- | --- |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm build` | Passed; UI JS, declarations and compiled CSS emitted; tokens unchanged |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm lint` | Passed; initial run found formatting/import ordering in changed files, fixed manually |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm typecheck` | Passed, root and workspace types |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test --maxWorkers=4` | Passed, 500 tests / 27 files |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm props:check` | Passed, valid registry and fresh generated view |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:props` | Passed, 82 tests; immutable receipt assertions preserved |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:package-exports` | Passed, 25 tests; 47 reachable declaration files. Initial new CSS assertions needed the emitted focus pseudo-selector and comment-free legacy rule counting; fixed without changing production behavior |
| `flock /tmp/egdev-gates.lock flock /tmp/egdev-packed.lock timeout 1500 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:package-consumption` | Passed, 12 tests: entries, strict positive/negative types, SSR, CSR/ref cleanup and native/Tailwind CSS for React 18.3.1 and 19.3.0; 255 native tokens, one physical React/ReactDOM instance per fixture |

Generated views were refreshed with `pnpm props:docs` and `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` (107 catalogue rows). Existing Surface/surfaceVariants/ComponentProps, Icon, Text/Heading and every earlier consumer remain in the packed fixture; it has one React type import.

These are local checks, not CI runs or independent approval. Storybook Controls, screenshots, browser computed styles, VIS-01 parity, actual browser new-tab navigation and screen-reader behavior are **Not evaluated**. Owner review on main remains deferred under S3. No PR was opened by the implementation writer.
