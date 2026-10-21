# Divider v0.1 implementation and verification

Divider is a passive brand rule, not a surface, control edge or resizable splitter.

## Approved scope and cited recipe lines

- Contract: [issue #83](https://github.com/egdev6/egdev-design-system/issues/83), v0.1, canonical SHA-256 `df843f21dcadad1b34d2e8b5747610e28816b0d67ee504b2b4f841e00aa2ad69`; whole-body SHA-256 `d5da7b7ecb80ae299454995ac179c46ebe7382cf8ec1def86d4ac177e8d27cf4`; owner approval comment `6251501412`. Recomputed with the actual `## 1. Purpose and scope` heading line and LF final newline: both match. VIS-01 local PNG SHA-256 `262b11b6…08229c` matches the approved board hash; the real PNG (three source rows) was read.
- Plan/dependency approval: coordinator `01a15f50-a92e` approved the implementation plan, exact `@radix-ui/react-separator@1.2.0` (registry version verified) and packed React 18/19 fixture execution with the runner's existing isolated `os.tmpdir()` installs. No other dependency or manifest change.
- Recipe classes are exactly the approved [spec §6](https://github.com/egdev6/egdev-design-system/issues/83) "Tokens / Material" line: root `eg-divider block m-0 p-0 border-0`; horizontal `data-[orientation=horizontal]:flex-auto`, `:h-[var(--border-width)]`, `:min-w-6`, `:bg-linear-to-r`, `:from-border-brand`, `:to-border-brand/0`; vertical `:flex-none`, `:w-[var(--border-width)]`, `:min-w-0`, `:h-4.5`, `:self-center`, `:bg-border-brand`. No additional arbitrary utilities, tokens or stylesheet; legacy `.eg-rule` / `.eg-rule--vertical` bytes remain unchanged (`4f1763a5…`).
- Six prescribed files in `packages/ui/src/primitives/divider/`; **No stylesheet**, no internal modules, no file-pattern exception. Radix source/types were inspected after installation: decorative mode emits `role="none"`, semantic mode `role="separator"` plus vertical `aria-orientation`; horizontal stays implicit. The wrapper adds no keyboard, focus or state logic and keeps the span composition private.

## Verification path

1. `Divider.test.tsx`: default decorative/empty/one-span DOM, both semantic roles and orientation ARIA, rerender semantics without mirrored classes, compatible attributes and margin merge, hook derivation, no Tab stop and decorative span inside a named control. Focused suite RED (missing component) → GREEN seven cases.
2. `packages/ui/src/lib/divider-contract.test.tsx`: actual server rendering (decorative `role="none"`, semantic vertical separator), public type negatives, own-prop AST tags, real docgen and registered extraction/enhancer/inference without diagnostics. Four cases passed.
3. Registry: reused already-amended approved `layout-orientation` and approved `decorative-separation` with reviewed whole-file source evidence appended to `postReceiptUsages`; frozen receipts/hashes unchanged. Catalog source row updated; generated catalog/prop docs regenerated, never hand-edited.
4. `packages/ui/src/styles/compiled.css` gains the production `@source`; story preview adds the stories `@source` only. Built production CSS (`fdcf8be1…`) emits both full data-orientation recipes, token gradient stops and fractional `h-4.5` as `calc(var(--space-1) * 4.5)`.
5. Delegated extension of `scripts/package-consumption.test.mjs` covers packed React 18/19 exports, strict type negatives, SSR/CSR semantics and shipped-CSS recipes without consumer Tailwind. Execution is coordinator-approved and ran serialized under a global lock with a 2GB heap cap. Matrix result: 12/12 subtests pass on React 18.3.1 and 19.3.0. The earlier system OOM was not reproducible on #83; the divider CSR stage finishes in ~0.6s per major with no loop. No peak-RSS figure was captured before the crash, so the crash cause is recorded as unattributed beyond "not #83".

Two root causes were pinned before committing, per the coordinator's instruction:

- The fixture's `DividerSamples({ semantic }: { semantic?: boolean } = {})` default parameter collapsed its `createElement` signature to a zero-arg overload, so the packed type check rejected `semantic`. An isolated TypeScript probe reproduced and confirmed the removal of the default parameter as the fix; the shipped `DividerProps` was correct and unchanged.
- `eg-divider` is a stable public marker, not a utility: with no stylesheet the CSS must never contain a `.eg-divider` rule, while the JS bundle must carry the marker. The CSS assertions now require each approved data-orientation recipe, assert the marker's CSS absence (mirroring the VisuallyHidden precedent), and check the packed JS bundle for the marker. Recipe matching scans every escaped-prefix occurrence because consumer builds interleave layers, and accepts the exact Tailwind v4 emission forms (`flex: auto`, concrete `color-mix` gradient stops with the token fallback argument, `[a-z0-9-]` token names).

Full-suite gate results are reported in the coordinator handoff, not inferred here. Browser Controls/story review remains the coordinator's visual gate; no Storybook server was started by the implementer.

## Review boundaries

Stories: `Primitives/Divider` — Default, Vertical, InlineHeading, SemanticHorizontal, SemanticVertical, RTL, InControl, ConsumerLayout. All preserve documented defaults; required example composition only; no manual argTypes or play functions. Visual conformity: Not evaluated by the implementer.
