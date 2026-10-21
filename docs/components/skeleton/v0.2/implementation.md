# Skeleton v0.2 implementation evidence

## Spec identity

- Issue: [egdev6/egdev-design-system#102](https://github.com/egdev6/egdev-design-system/issues/102)
- Authoritative spec of record: [v0.2 delta comment](https://github.com/egdev6/egdev-design-system/issues/102#issuecomment-6328255802), canonical SHA-256 `sha256:4fea97ea3b2fcd36116fb3ab5acffb54ff9645f6f74a38616f67e0c16c6b5a72`, plus the approved v0.1 full contract comment and the repository AGENTS.md / contributor skill.
- Scope: decorative opacity pulse on by default, opt-out via `pulse={false}`, reduced-motion preferences always render static. No shimmer, no timing, no other motion. This is a single-contract delta; it does not establish catalog-wide M3 compliance.

## Files changed (14 files, +194/−37)

| File | Change |
| --- | --- |
| `packages/ui/src/primitives/skeleton/types.ts` | Added optional `pulse?: boolean` with the exact approved JSDoc, `@control boolean`, `@default true`; CVA variant `pulse: { true: 'animate-pulse motion-reduce:animate-none', false: '' }` with static literal classes only; `defaultVariants` gains `pulse: true`. |
| `packages/ui/src/primitives/skeleton/useSkeleton.ts` | Destructures `pulse` (default `true`), passes it to `skeletonVariants`, never forwards it to the DOM; all v0.1 invariants kept (FORBIDDEN keys, `aria-hidden`, `cn` merge). |
| `packages/ui/src/primitives/skeleton/Skeleton.test.tsx` | Three new v0.2 tests (default pulse classes, `pulse={false}` equals the exact v0.1 static class string, `pulse` never in the DOM). The geometry hook call now passes `pulse: false` so its v0.1 static-recipe assertions stay meaningful under the new default. |
| `packages/ui/src/primitives/skeleton/Skeleton.stories.tsx` | Meta description updated (pulse on by default, opt-out, reduced-motion static); new `Static` story with `args: { pulse: false }`; `StaticReducedMotion` description now documents the reduced-motion behavior. English only, no `argTypes`, no play function. |
| `packages/ui/src/lib/storybook-docgen.test.ts` | `pulse` asserted as an own prop of type `boolean` with `@control boolean` and `@default true` in both the AST contract and the installed docgen extraction; CVA defaults now expect `pulse: 'true'`. |
| `packages/ui/src/lib/storybook-controls.test.ts` | `pulse` control `{ type: 'boolean' }`, documented default `true`, own prop count 3, defaults summary entry. |
| `scripts/package-consumption.test.mjs` | Packed fixture renders one default-pulse Skeleton (`#pulse-default`) and one `pulse: false` (`#pulse-static`); type fixture rejects a string `pulse`; CSR/SSR assert 14 shapes, default-pulse class strings, the exact static class string via string comparison only (DOM nodes never passed to deep equality), and `pulse` never a DOM attribute; `assertSkeletonCSS` now requires `.animate-pulse` bound to `var(--animate-pulse` and the `motion-reduce:animate-none` override; token count updated 236 → 237 (see notes). |
| `scripts/package-exports.test.mjs` | Test retitled for the v0.2 contract: positive assertions that the shipped utilities layer contains `.animate-pulse` bound to `var(--animate-pulse` and the `motion-reduce:animate-none` override under `@media (prefers-reduced-motion: reduce)`, while forbidding every other animation utility (`animate-` other than `pulse`), every animated transition utility, and keyframes in the utilities layer; SSR assertions keep forbidding `aria-live|aria-busy|role=|tabindex|data-state|transition`, require the default pulse classes, forbid `pulse` as a DOM attribute, and add a `pulse: false` render asserted fully static. |
| `scripts/prop-naming.test.mjs` | Appended the `signal-pulse` post-receipt usage; the Skeleton receipt test now expects the recorded implementation usage instead of an empty list. |
| `skills/_shared/prop-naming.json` | `signal-pulse` gains the real Skeleton usage; the two pre-existing Skeleton usages (`visual-treatment`, `preset-dimensions`) were refreshed to the post-edit `types.ts` revision `sha256:6bb6a4c5aa02b761a881e7694b6434f30330a859909145100cf483a7277fdcbb`. |
| `docs/prop-naming.md` | Regenerated with `pnpm props:docs`. |
| `scripts/catalog_data.py` | Skeleton row note now documents the v0.2 pulse (default on, reduced motion static, `pulse={false}` opt-out). `docs/CATALOGO.md` and `docs/catalog.json` regenerated via `python3 scripts/build_catalog.py`; never hand-edited. |

## TDD evidence

- **RED (observed before implementation):** `pulses by default through the approved opacity utility` failed against the v0.1 code — the default line/md render was exactly `eg-skeleton block box-border shrink-0 bg-border-default border-0 p-0 w-full rounded-sm h-4` with no pulse classes. Focused run: 1 failed / 19 passed.
- **GREEN (observed after implementation):** focused `Skeleton.test.tsx` 20/20; `storybook-docgen.test.ts` + `storybook-controls.test.ts` 77/77; full `pnpm test` 322/322.
- **TRIANGULATE (observed):** `pulse={false}` yields exactly the pre-change v0.1 class string (equality via class-string comparison, no pulse classes present); `pulse` never reaches the DOM; `aria-hidden="true"` and empty decorative content hold in unit, packed CSR and packed SSR runs.

## Checks run (all exit 0)

| Command | Observed result |
| --- | --- |
| `pnpm lint` | 0 — Biome checked 196 files, no fixes applied |
| `pnpm typecheck` | 0 — all packages done |
| `pnpm test` | 0 — 20 files, 322/322 tests passed |
| `pnpm props:check` | 0 — "Prop naming registry valid; view up to date." |
| `pnpm test:props` | 0 — 82/82 tests passed |
| `pnpm build` | 0 — `packages/ui/dist/styles.css` contains `.animate-pulse { animation: var(--animate-pulse, pulse 2s var(--ease-snappy) infinite); }` and the `motion-reduce:animate-none` override inside `@media (prefers-reduced-motion: reduce) { … animation: none; }` |
| `pnpm test:package-exports` | 0 — 16/16 tests passed |
| `flock /tmp/egdev-packed.lock env NODE_OPTIONS=--max-old-space-size=2048 pnpm test:package-consumption` | 0 — 12/12 tests passed, run serially under the lock only |

Notes on two mid-run corrections, both within approved edit surfaces:

1. `scripts/package-exports.test.mjs` originally pinned the v0.1 static contract; the coordinator approved editing that single additional file to express the v0.2 pulse assertions described above.
2. `pnpm build` regenerated the untracked, gitignored `packages/tokens/dist/tokens.css`, which had been stale relative to the already-approved `--animate-pulse` token commit (`f0246fd`); the packed token-count assertion was updated 236 → 237. No token source value was added or changed by this task.

## Not evaluated

- Visual conformity: Not evaluated.
- Browser computed-style checks: pending coordinator Storybook pass.
