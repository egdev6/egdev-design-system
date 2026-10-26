# Avatar v0.1 implementation evidence

## Approval and scope

- Contract: [issue #51](https://github.com/egdev6/egdev-design-system/issues/51), v0.1.
- Full-contract approval: [owner approval record](https://github.com/egdev6/egdev-design-system/issues/51#issuecomment-6251417275).
- Recovered canonical SHA-256: `a3eb1d2641f72690a12d9d2d8a7e0987dc44fadd1e5b55b368f421ba28fe9553`.
- Recovered frozen body SHA-256: `37b2b39983e407fa58c18c4c2193fd55761d546f47c496877e3948acc03c8652`.
- Expected-design identities reported by that approval: VIS-01 `Avatar.png`, SHA-256 `df077723a6b24cdcbb504ea4aeb6fd3d21ef758692104c7d3cba224753faa6ca`; VIS-02 `avatar--specimen.png`, SHA-256 `35bef1fb29077bbe3936cdd507e8cdd6a103c2034f700fd5264f2f97db2aae00`. These were not recaptured or freshly pixel-verified here. VIS-01's broken-image row remains excluded.
- Development authority: `odd/tasks/particles-build.md`, T12 and S1–S6, including the owner's batch instruction in Log L1. Parent retains all Git and PR actions.

### Separate implementation plan

The writer stopped before implementation because contract approval explicitly retained a separate plan gate. The parent then approved this exact bounded plan under the owner's delegated full-development authority:

> APPROVE your exact bounded implementation plan (not a new owner message; parent approval under the owner's explicit delegated full-development batch authority).

Approved responsibilities: implement only AV-01–AV-09 using Radix Root/Image/Fallback and merged Icon; six meaningful files, CVA in `types.ts`, per-part `cn()`, no stylesheet, tokens, dependency changes, ref or `asChild`; observed focused RED/GREEN and alternatives; stories and real metadata tests; existing approved naming usages; public barrel, utility sources, generated catalogue and additive export/packed checks. Record unperformed browser checks as Not evaluated. This is a manual record of the parent task, not a new owner statement, independent receipt or inferred approval from issue #51's contract-only comment.

## Implementation and consumer boundaries

`Avatar`, `AvatarProps` and `AvatarSize` are public. The internal hook and CVA recipes are not exported. The required six files are `types.ts`, `useAvatar.ts`, `Avatar.tsx`, `Avatar.test.tsx`, `Avatar.stories.tsx` and `index.ts`. **No stylesheet.** No token, manifest, lockfile or dependency changes.

Verified prerequisites: public Icon supports `user`, `linkedin`, `youtube` and spacing-scale size overrides. Text/Heading, Surface, Slot, VisuallyHidden and Spinner are also exported; Avatar does not need to compose them. The already-installed `@radix-ui/react-avatar` is pinned to 1.3.1.

Root naming is component-owned: `label` names one `role="img"` root, otherwise the entire avatar is hidden. Image `alt` is empty; fallback and badge Icon glyphs are decorative. Real Radix owns loading/error/replacement. There is no loading callback, initials, presence, grouping or interaction API. Native span props retain the exact approved exclusions; native handlers are not an additional component event API.

The brand disc is identity content, not a Material surface. Static utilities use the approved 135-degree gradient and existing token stops. Sizes are 24/30/40/48px with 13/16/20/24px fallback glyphs; badges are 18px with 11px glyphs, or 22px/13px for xl. Paused styling uses data variants, not mirrored state classes. Legacy selectors and the legacy `--avatar-ring` property remain untouched.

Root `className` supports outer margin/alignment and token-valued `--eg-avatar-ring` only; it is merged last. Tests establish recognized margin conflict merging and preservation of the ring property, not universal appearance overrides or CSS-selector precedence. Internal parts have no consumer override surfaces. Consumers must also communicate network and paused meaning in the label or adjacent text.

### Exact naming usage mappings

Append-only observations in [the registry](../../../../skills/_shared/prop-naming.json):

- `size` → `preset-dimensions`: `AvatarSize ('sm' | 'md' | 'lg' | 'xl')`.
- `label` → `accessible-name`: `string`.
- `badgeIcon` → `corner-badge-icon`: `IconName`.
- `paused` → `paused-presentation`: `boolean`.

Each usage names `packages/ui/src/atoms/avatar/types.ts#AvatarProps` and its reviewed whole-file byte hash. `src` follows the contract's native-image-attribute forwarding rule, not a new own convention. No convention semantics, approval hashes, exceptions or immutable receipt pins changed. Historical receipt tests exclude only the four exact post-receipt usage pairs.

## Contract coverage

| Criterion | Observed automated evidence | Browser-only remainder |
| --- | --- | --- |
| AV-01 | Real Radix fallback, pending load, successful replacement, failure, changed src recovery and src removal; unit and packed CSR | Real image decoding and cropping |
| AV-02 | Hook/DOM preset classes; emitted dimensional declarations; packed SSR size/glyph checks | Computed dimensions and VIS comparisons |
| AV-03 | Decorative badge marker, glyph geometry, ring utility/token fallback; packed SSR/CSR and CSS checks | Ring color on equivalent hosts and corner position |
| AV-04 | Paused/active rerenders and emitted data-variant grayscale/opacity; packed CSR | Computed de-emphasis and VIS comparison |
| AV-05 | One named root in fallback and loaded-image modes, empty image alt, decorative mode and label removal | Screen-reader/browser evaluation |
| AV-06 | `userEvent.tab` skips Avatar; no default tabindex in packed checks | Browser keyboard/assistive-technology confirmation |
| AV-07 | Stable markers, native attributes, supported margin merge and ring property | Computed layout/cascade |
| AV-08 | Six files, static CVA, per-part cn, production-only source, build/export checks and packed Vite CSS without Tailwind | Pixel conformity |
| AV-09 | AST annotations, real docgen, installed Storybook extraction/enhancement/inference; zero owned diagnostics | Actual Controls widgets |

Stories: Default, Sizes, WithImage, BrokenImage, NetworkBadge, Paused and Decorative. WithImage uses self-contained illustration bytes as a loading fixture, not an approved photo visual reference. No manual argTypes, play functions, server or watch mode.

## Test-first observations

1. Initial focused test invocation failed to resolve the not-yet-created Avatar module; this alone is not behavioral RED evidence.
2. With the minimal Radix root and naming skeleton present, the focused suite executed: **10 failed, 3 passed**. Intended failures included missing immediate fallback, part sizes, badges and paused utilities.
3. Minimum implementation: **13/13 passed**. The browser image transport supplies `complete` and `naturalWidth`, which installed Radix 1.3.1 actually reads on load. Radix behavior itself is not mocked.
4. Triangulation added informative-to-decorative label removal: **14/14 passed**. Error/recovery, src removal, all sizes, badge alternatives, state reversal, native semantics and tab passivity are included.
5. Focused Avatar plus both real Storybook metadata suites: **121/121 passed**. Final full suite: **502/502 passed**.

## Validation of record

Commands ran individually, in the foreground. Build ran before tests (including the first RED invocation). No timeout/OOM occurred. The initial lint attempt reported five formatting-only files; targeted edits resolved them and final lint passed. Typecheck also confirmed that earlier editor missing-module diagnostics were stale after the implementation files existed. No remaining failure or contract deviation is known.

| Exact command | Observed result |
| --- | --- |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm build` | Pass; UI JS/declarations and compiled CSS, token build; final production CSS 195.19 kB |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/avatar/Avatar.test.tsx --maxWorkers=2` | Behavioral RED 10 failed/3 passed, then GREEN 13/13 and triangulation 14/14 |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/avatar/Avatar.test.tsx packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts --maxWorkers=2` | Pass, 121 tests across 3 files |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm lint` | Pass, 237 files; rerun after adding this evidence document |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm typecheck` | Pass, root and workspace checks |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test --maxWorkers=4` | Pass, 502 tests across 27 files |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm props:check` | Pass, registry valid and generated view current |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:props` | Pass, 82 tests including immutable receipt checks |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:package-exports` | Pass, 24 tests; 47 reachable declaration files |
| `flock /tmp/egdev-gates.lock flock /tmp/egdev-packed.lock timeout 1500 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:package-consumption` | Pass, 12 tests: React 18.3.1 and 19.3.0 entries, strict types/negatives, SSR, CSR and CSS; native and Tailwind consumer builds, 255 tokens, one physical React/react-dom instance |
| `pnpm props:docs` | Generated the naming reference |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Generated 107 catalogue rows; only Avatar changed |
| `git diff --check` | Pass |

Packed fixtures retain the single React type import and all prior components, including Surface/surfaceVariants/ComponentProps, Icon and Text/Heading. Avatar adds precise CSS assertions; no prior guard or exception was relaxed. DOM identity checks added here compare booleans, not DOM objects through node:assert equality.

## Deferred evaluation

Visual conformity, comparable VIS-01/VIS-02 captures, browser computed sizes/ring/paused treatment, real image cropping, actual Controls widgets and browser/assistive-technology checks: **Not evaluated**. Unit/metadata/SSR/CSR/CSS gates are not browser or pixel evidence. CI was not run (disabled under batch rules). Parent owns review, commits, integration, push and opening the PR.

## Proposed commit slices

No Git mutations were performed. Keep each test file whole; these slices never stage partial test prefixes.

### 1. `feat(ui): implement the Avatar identity atom`

- `packages/ui/src/atoms/avatar/types.ts`
- `packages/ui/src/atoms/avatar/useAvatar.ts`
- `packages/ui/src/atoms/avatar/Avatar.tsx`
- `packages/ui/src/atoms/avatar/Avatar.test.tsx`
- `packages/ui/src/atoms/avatar/Avatar.stories.tsx`
- `packages/ui/src/atoms/avatar/index.ts`
- `packages/ui/src/styles/compiled.css`
- `.storybook/main.ts`
- `.storybook/preview.css`

This self-contained local implementation and Storybook unit is 395 added lines, including its complete behavior tests. Package-root export integration follows in slice 3.

### 2. `docs(avatar): register approved conventions and catalogue evidence`

- `skills/_shared/prop-naming.json`
- `docs/prop-naming.md`
- `scripts/prop-naming.test.mjs`
- `scripts/catalog_data.py`
- `docs/CATALOGO.md`
- `docs/catalog.json`
- `docs/components/avatar/v0.1/implementation.md`

Registry observations and their immutable-receipt regression update stay together; generated references follow their sources. This document records final-state evidence for the complete three-slice change, not claims that earlier intermediate commits expose the package-root API.

### 3. `feat(ui): expose Avatar with metadata and packed consumer coverage`

- `packages/ui/src/index.ts`
- `packages/ui/src/lib/storybook-controls.test.ts`
- `packages/ui/src/lib/storybook-docgen.test.ts`
- `scripts/package-exports.test.mjs`
- `scripts/package-consumption.test.mjs`

Root exports and every exact exported-name assertion change atomically; packed fixtures retain all preceding imports and render paths.

## Ready PR body

### Summary

- Implement Avatar v0.1 from #51 using real Radix image loading/fallback and the merged Icon.
- Add four sizes, decorative network badges, paused presentation and one accessible root name.
- Preserve legacy CSS; use static token-backed CVA with no stylesheet, token or dependency changes.
- Add stories, real Storybook metadata coverage, approved registry usages, catalogue and packed-consumer checks.

### Validation

- Observed behavioral RED: 10 failed / 3 passed; GREEN: 13/13, then 14/14 with triangulation.
- Build, lint and typecheck pass; full unit suite 502/502, prop suite 82/82, exports 24/24.
- Packed React 18.3.1 and 19.3.0 matrix: 12/12, including strict types, SSR, CSR, native CSS and Tailwind consumers.
- No CI run claimed. Full command evidence and approval boundaries are in `docs/components/avatar/v0.1/implementation.md`.

### Deferred checks

Browser visual comparison, computed geometry/ring treatment, real image cropping, Controls widgets and assistive-technology evaluation: **Not evaluated**. These remain for the owner's batch Storybook review; automated checks are not visual certification.

Closes #51.
