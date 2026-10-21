# Stack and Cluster v0.1 implementation evidence

## Authority and scope

- Contract: [issue #105](https://github.com/egdev6/egdev-design-system/issues/105), approved in the owner full-contract comment.
- The coordinator separately approved the implementation plan with three conditions: the shared `primitives/stack/` layout must be spec-named, the gap CVA must be a static literal map verified against `theme.css`, and every registered usage needs its exact post-receipt entry.
- Two named exports, `Stack` (vertical flow, no wrap) and `Cluster` (wrapping row), share `types.ts` and `index.ts` and each own hook, JSX, tests and stories. **No stylesheet**, no additional internal modules. No paint and no dynamic classes.
- **D10 compliance fix:** the initial draft used `forwardRef`, violating the contract's no-public-ref rule. Both components are plain `FC` functions built on `ComponentPropsWithoutRef<'div'>`; a test asserts a rendered root without any ref behavior, and export checks assert plain function components. An `asChild` child keeps its own ref through Slot; that is never a Stack/Cluster ref promise.

## Snapshot identity

All identities match the owner approval exactly:

- Whole issue body SHA-256: `b7e8a901d813a44d7df0f7f893244a3d2a45e3f12e65ab8a9ecda7bf5d02c9fb`
- Canonical payload SHA-256 (actual heading line `\n## 1. Purpose and scope\n`, LF, final newline): `7ff4cee7fdf924bedf23fedb7a43382a453a8cddffb1e1e7687068eb76821e53`
- Approval comment SHA-256: `55b17e5692097acc8c6b2dad97d2685af895ba7f48cbfb020cc26651e478f3c9`
- VIS-01 specimen PNG: `00cd72cadf15b992a45a5deb7ea0967304a1bb62ac74a287ccc8e4315d5e16df`

## Test-first evidence

- RED: `pnpm exec vitest run packages/ui/src/primitives/stack` failed before the components existed.
- GREEN: the same command passed 15 tests covering defaults and markers, the full gap-key matrix verified against `--space-*` declarations in `theme.css` (the condition-2 test fails when a key has no token), alignment and distribution choices, phantom-child behavior, supported root sizing, native attribute/event passthrough and passivity, `asChild` semantic `ul`/`section` hosting, and nested independence.
- Radix Slot 1.5.0 requires exactly one child; `asChild` renders Slot, otherwise the component renders a `div` with the forwarded ref.

## Registry and metadata

- New usages registered from the real `packages/ui/src/primitives/stack/types.ts` (hash-bound): `layout-gap`, `cross-axis-alignment`, `main-axis-distribution` for both `StackProps` and `ClusterProps`, plus the reused `slot-composition` for both.
- `postReceiptUsages` gained the exact eight convention/source pairs; the shared helper and frozen receipts are untouched. `pnpm props:check` and `pnpm test:props` (81 tests) pass.
- Real docgen asserts separate `alignItems` defaults (`stretch` for Stack, `center` for Cluster) from their independent declarations; registered Controls map `select`/`boolean` widgets with zero diagnostics.
- `.storybook/main.ts` adds `stack` and `cluster` native-attribute allowlist entries; `compiled.css` and `preview.css` gained the `@source` lines for the CVA types and story files.

## Packed consumer status

The packed React 18/19 consumer matrix passes 12/12 under the serialized lock with the memory cap. The earlier out-of-memory failures were a shared fixture issue: a failing `node:assert` on jsdom DOM nodes makes `util.inspect` walk the whole DOM graph. The layout CSR additions use boolean identity checks with descriptive messages (`assert.ok(a === b, 'message')`), the layout fixture carries no `ref` (D10), and the focusable-button count accounts for the Cluster's two harness buttons. Fixture additions for the layout primitives include typed `LayoutSampleProps` and utility-class-only shipped-CSS assertions.

## Visual review handoff

Stories: `Primitives/Stack` — Default, Gaps, Alignment, Nested, AsChild. `Primitives/Cluster` — Default, Gaps, Alignment, Wrapping, Nested, AsChild, RTL.

Browser layout geometry (wrapping at two widths, RTL logical start, `justifyContent: between` free-space distribution, delayed media), actual Controls widgets and expected-design conformity remain **Not evaluated** here. This agent does not launch Storybook; the coordinator runs the owner review on port 6104.
