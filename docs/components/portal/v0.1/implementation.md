# Portal v0.1 implementation and verification

Portal is an unstyled out-of-tree primitive, not an overlay interaction system.

## Approved scope

- Contract: [issue #97](https://github.com/egdev6/egdev-design-system/issues/97), v0.1, canonical SHA-256 `4535193dddb643e3d20b9f4f76b40ec05796488fd502200f911bde850d1de5fd`.
- Read-only issue recomputation matched canonical SHA above and whole-body SHA-256 `a387f8b44d1c32abd82d56c7af98f932207d4ae0363d4736a07474ffe9297892`. Canonical method: UTF-8 payload starting at the actual `## 1. Purpose and scope` heading line (not the quoted metadata occurrence), LF line endings, recorded final newline preserved.
- Full-contract approval: [owner approval record](https://github.com/egdev6/egdev-design-system/issues/97#issuecomment-6251543437). Historical Draft headers are retained in the issue.
- Separate plan approval: coordinator `01a15f50-a92e` replied “PLAN #97 APPROVED as proposed” through intercom, relaying the owner's authorization to add exact `@radix-ui/react-portal@1.2.0` as a direct UI dependency. This local record is not a native or independently signed receipt.
- Six prescribed files in `packages/ui/src/primitives/portal/`: `types.ts`, `usePortal.ts`, `Portal.tsx`, `Portal.test.tsx`, `Portal.stories.tsx`, `index.ts`. No file-pattern exception or internal module.
- **No stylesheet. No CVA.** No token changes or painting recipe. Root marker `eg-portal`; `cn()` adds supported non-painting consumer layout after the marker.
- Required `children`; optional `container: Element | DocumentFragment | null`; other div attributes pass through; `forwardRef<HTMLDivElement>` targets the div. No `asChild`.
- Package exports: `Portal`, `PortalProps`. Registry uses approved `portal-container`, with reviewed whole-file SHA-256 evidence. Catalog source and both generated outputs are updated.

## Dependency readback

Inspected installed `@radix-ui/react-portal@1.2.0` files `dist/index.mjs` and `dist/index.d.ts`:

- `Root` aliases a forward-ref Portal, rendering `Primitive.div` via `ReactDOM.createPortal`.
- The public dependency accepts `Element | DocumentFragment | null | undefined` and forwards `HTMLDivElement` refs.
- `containerProp || (mounted && globalThis?.document?.body)` selects the target. A ready explicit node can mount before the default body's layout-effect path; no universal first-render timing is promised.
- Default server rendering has no target and returns null. Passing a DOM container to a server renderer is unsupported by this wrapper's contract.
- The wrapper leaves mounting, cleanup, React context and event propagation to Radix/React. Specialized Radix floating components retain their own portals.

## Verification path

1. `Portal.test.tsx`: default/null body placement, ready element/fragment placement, cleanup, React context/events, ref identity, native attributes, marker/layout merge, default hydration without recoverable errors.
2. `packages/ui/src/lib/portal-contract.test.tsx`: actual no-document server rendering, public positive/negative API fixtures, real docgen and installed Storybook extraction/enhancer/inference. Both owned complex props disable Controls without hiding rows or reporting metadata diagnostics.
3. Full lint, TypeScript, Vitest, prop registry, build and package-export checks. Build tokens before the full suite: fresh worktrees lack `packages/tokens/dist/tokens.css`, which existing Storybook CSS/branding tests require.

Test-first evidence: focused component suite initially exited 1 because Portal/usePortal did not exist; after implementation it passed all eight cases. Node/metadata suite passed three cases. Full-suite results are reported separately in the coordinator handoff, not inferred from this plan.

## Review boundaries

Stories: `Primitives/Portal/Default` escapes an overflow-hidden ancestor; `CustomContainer` conditionally mounts only after its ref supplies a ready client target. Both preserve actual defaults, with required example children and no manual argTypes or play functions.

No expected-design images apply to this non-visual primitive. The coordinator's browser smoke verified `BODY > .eg-portal` for Default and placement inside “Custom portal host” for CustomContainer. Browser Controls and final owner review remain separate gates; no Storybook server was started by the implementer. Installed React 19 development tests do not certify an unrun React 18 packed consumer matrix. The component adds no CSS, so no component appearance/CVA scanning or new token recipe is claimed.

### Storybook source warning investigation

Authorized read-only instrumentation of the coordinator's port 6103 traced the React 19 `element.ref` deprecation warning to Storybook 10.6.1 Docs source serialization, not Portal: `elementRefGetterWithDeprecationWarning` → `_parseReactElement` in `@storybook/react/dist/_browser-chunks/chunk-B3FR4PBN.js:437` → `reactElementToJsxString` → source decorator `chunk-CS62LUFX.js:88`. Direct Default iframe/manager navigation had no captured errors; Docs source extraction reproduced it.

Minimal browser reproduction, using only installed React and Storybook's serializer: `reactElementToJsxString(React.createElement('span', { ref: () => {} }, 'Minimal native element; no Portal'))` produces the identical warning/serializer stack without importing Portal or Radix. No component, dependency, server or configuration workaround was applied. The instrumentation tab was closed after investigation.
