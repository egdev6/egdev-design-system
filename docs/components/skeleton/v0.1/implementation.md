# Skeleton v0.1 implementation

Skeleton reserves approximate decorative space for unavailable content. It renders an
empty hidden span with a token-backed silhouette and no behavior: no Radix base, no
stylesheet, no animation, and no loading semantics of its own.

## Authority and plan

- Contract: [issue #102](https://github.com/egdev6/egdev-design-system/issues/102).
- Full-contract approval: [owner approval record](https://github.com/egdev6/egdev-design-system/issues/102#issuecomment-6251558042).
- Verified canonical payload SHA-256: `c34bfecc0e547578006414324108e5b5d688161a1e586deb01acafb57b691ab1`.
- Verified issue-body SHA-256: `60e248e21e4cfac4789e0819b73c63be4167e2be69b488f1d6e472369d873548`.
- Canonical hashing begins at the actual `## 1. Purpose and scope` heading line.
- Verified VIS-01 PNG SHA-256: `1ffa39be075f2e42f907e4cbc03ee78ce5f816d7b9d86f1a4685153d1b08e377`.
- The component-development coordinator approved the implementation plan and the
  story-only Material demo host in this development session on the owner's behalf.
  This is an assistant record, not a native approval receipt.

| Responsibility | Implementation |
| --- | --- |
| Anatomy | Fixed empty `span.eg-skeleton`, always `aria-hidden`, no state or focus target. |
| API | Optional `variant` (`line`/`block`/`circle`, default `line`) and `size` (`sm`/`md`/`lg`, default `md`); decorative overrides rejected by types and stripped from unsupported spreads. |
| Styling | Static CVA utilities in `types.ts`: `bg-border-default border-0 p-0 block box-border shrink-0`, per-variant radius and token heights/sizes, full line/block width. **No stylesheet.** |
| Motion | None, by design, under every motion preference. |
| Loading | Host-owned: one localized status plus `aria-busy`; placeholders unmount when content arrives. |
| Tests | 17 component/hook tests, metadata pipeline, packed consumers on React 18/19. |
| Stories | `Primitives/Skeleton`: `Default`, `VariantsAndSizes`, `ShortLines`, `InLoadingCard`, `StaticReducedMotion`, `ConsumerLayout`. |
| Catalog | Registry usages for `visual-treatment` and `preset-dimensions`; regenerated catalog and reference. |

`SkeletonVariants` stays internal. The `InLoadingCard` host is an inline demo
reproducing the approved specimen tokens while Surface (#106) remains future; it is
not an extractable recipe or import. No new tokens or dependencies were added.

## Verification boundaries

The wrapper tests failed before implementation (RED), then passed (GREEN).
Observed on Linux with the installed toolchain: `pnpm lint`, `pnpm typecheck`,
`pnpm test` (265/265), `pnpm props:check`, `pnpm test:props` (81/81), `pnpm build`,
`pnpm test:package-exports` (15/15), and the packed consumer matrix (12/12) for
React 18.3.1 and 19.3.0 — entries, strict types, SSR, client rendering and CSS
without an application Tailwind compiler, run serialized under a lock and a 2 GB heap
cap. A peak-RSS node sample measured about 42 MB on this machine.

An out-of-memory crash of an earlier packed consumer child was observed only during
parallel uncapped runs while the shared fixture still carried a corrupted duplicate
import from a stash incident. It was not reproduced under the lock and cap on #102.
Fixes were confined to the fixture: one merged import list, exact packed token
fallbacks for the Skeleton surface and radii, and a Skeleton-scoped animation
assertion (legacy markers keep their own keyframes; the Skeleton recipe stays static).

## Review units

The coordinator approved one #102 PR with two feature work units despite the bounded
aggregate exceeding 400 lines; no coverage or prose was compressed to fit a count.
The InLoadingCard Material shadow fix (MATERIAL.md:52) lives in the second unit.

1. `9742415` — primitive, metadata regressions, registry/catalog and approval evidence.
2. `a7eac26` — packed consumer/export regressions and evidence, including the
   InLoadingCard shadow composition fix.

Non-visual decorative status does not remove visual review: the coordinator will
compare computed geometry, fill, radius and host composition against the approved
specimen and verify static presentation under real reduced-motion settings, on port
6102. Screen-reader behavior is out of scope by design (`aria-hidden`, no live
region); the host announcements remain consumer responsibilities.
