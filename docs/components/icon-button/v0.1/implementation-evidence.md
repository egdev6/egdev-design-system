# IconButton v0.1 — implementation evidence

## Authority and scope

- Contract: [issue #57](https://github.com/egdev6/egdev-design-system/issues/57), v0.1; [full-contract approval](https://github.com/egdev6/egdev-design-system/issues/57#issuecomment-6251434687).
- The live issue body SHA-256 was verified as `249611d354bfcfe68035bac1ed5a095de1cd1727ff7618c39a6721b7b1fbaedd`, matching the approved frozen body.
- Identity caveat: the approval reports canonical SHA-256 `0ad8aebf0d217db754deb5733d4519ede8d42c4904e240acc1464f73a03d4dbf`. A literal current-body slice from `## 1. Purpose and scope` through EOF hashes to `316dfbafe4ffe70e2074b87a167ac6bf1180b7e46c353feba3e2e4ce60555483`. This implementation is bound to the exact matching whole body; it does not certify the historical canonicalization algorithm or rewrite approval metadata.
- Execution authority: particles-build T22, S1–S6 and owner full-batch delegation L1, with the parent's separately approved concrete implementation plan. Full-contract approval alone did not approve that plan.
- Naming authority: explicit interactive owner choice, **“Aprobar excepción para IconButton”**, forwarded by the parent. The [separate assistant-recorded receipt](prop-naming-approval.json) is not native, signed, independent or per-payload serialized review.
- No dependencies, token values, manifests, lockfiles, legacy rules, coordination files or Git state were changed. The pre-existing untracked `odd/tasks/particles-build.md` is preserved.

## Prerequisites and implementation

The actual barrel and sources expose Icon, Text/Heading, Surface, Slot/Slottable, VisuallyHidden and Spinner. IconButton composes the approved installed individual Radix Slot and AccessibleIcon packages; examples pass the actual `Icon name` API, not a guessed glyph API. It imports neither Button nor another unmerged component. Tooltip is not merged and its integration is explicitly deferred by AC-04.

Six meaningful files implement the approved split: public types and private CVA recipes, host/disabled/ARIA derivation in the hook, JSX and React 18-compatible forwardRef, component/hook tests, seven stories, and a named component/type barrel. **No stylesheet.** The stable marker is `eg-icon-btn`; no legacy modifier classes or new public part markers are emitted. Both recipes are internal to the package.

- Required `label` names the control through AccessibleIcon hidden text; the decorative ReactElement is hidden, without duplicate aria-label.
- Native button defaults to `type="button"`; click, Enter, Space and form behavior remain native.
- Slot/Slottable insert icon and hidden text into an empty child host. The root ref reaches the native button or slotted anchor. Disabled composition prevents root and child activation, cancels navigation and sets aria-disabled/tabIndex/data-disabled.
- Root and icon each use cn(). Root className supports margin, alignment and placement only. Appearance overrides are unsupported; twMerge does not promise arbitrary CSS precedence. The private glyph recipe wins over the supplied glyph's size class.
- Ghost/outline/primary/secondary and sm/md/lg use existing token recipes, explicit border-box/padding/border resets and no legacy modifiers. Motion-safe selectors limit lift and .94 scale to allowed states; transform-none prevents legacy transform compounding. Focus-visible is excluded from competing state-shadow recipes. Browser appearance remains unevaluated.

## Naming boundary and future integration

Exact registered usages: `accessible-name` → label; `leading-icon` → icon; `visual-treatment` → variant; `preset-dimensions` → size; `slot-composition` → asChild. Native attributes and composition children are not new conventions. Each usage pins reviewed `types.ts#IconButtonProps` bytes.

The same-name semantic amendment changes only meaning/whenToUse/avoid for leading-icon, permitting **IconButton alone** to require one decorative ReactElement named separately by required label. It leaves aliases and alternative-name exceptions empty. Its original convention hash is `sha256:29561623f1153d6b3eeaf4b5ca560059d3ee442d6ef3e23088d2978effe9367a`. After main integration, the current text is the owner-approved Button + Toggle + IconButton combination recorded in `prop-naming-approval-leading-icon-combined.json` (`sha256:08f3f6176bcde22086ae15a201168ca3c4712c364be20f8adb9c17b0bc1aadad`); the original approval stays byte-identical as a pinned parallel branch. Eight prior receipt byte hashes are pinned; historical whole-registry projections remain tested. Stale approval and refreshed-but-unreviewed broadening are negative cases.

Button and Toggle are independent approval branches, not authority here. Later integration must union only their independently granted scopes while preserving every original receipt byte/hash. **Do not concatenate their linear receiptChain entries or rehash/replace an old receipt.** Each branch pins the same historical predecessor, and its frozen entries describe only that branch's snapshot. An additive integration record must bind the union to the original scoped grants; tests must project each historical branch from that union instead of asserting that every frozen snapshot equals the latest full convention. This task creates no permission for Button, Toggle or another component.

## Acceptance coverage

| Criterion | Observed evidence | Remaining evidence |
| --- | --- | --- |
| AC-01 | Native button/type/marker; one hidden name; hidden, unfocusable icon | Assistive-technology/browser inspection |
| AC-02 | userEvent click/Enter/Space, native disabled focus skip, form defaults and explicit submit | Native-browser interaction |
| AC-03 | Anchor props/name/ref; disabled root and child handlers suppressed; canceled navigation; restoration | Real router/browser navigation |
| AC-04 | Actual Radix Slot trigger passes props/ref; native and slotted refs pass in both packed React majors | Tooltip.Trigger integration after Tooltip merges |
| AC-05 | Root layout merge and marker; glyph size merge | No arbitrary appearance override promise |
| AC-06 | All 12 treatment/size combinations in packed SSR; all CVA utility classes emitted | VIS-01/VIS-02 pixel/computed comparison: **Not evaluated** |
| AC-07 | Static motion-safe/reduced-motion/focus recipes and emitted CSS | Visible focus, active+hover combinations, reduced-motion browser emulation: **Not evaluated** |
| AC-08 | Build, complete static CVA scan, packed declarations/SSR/CSR/native and Tailwind CSS | Browser paint is not proven by these tests |
| AC-09 | AST declarations, actual docgen, registered enhancer/extractor/inference, zero owned diagnostics | Actual Controls widgets: **Not evaluated** |

Expected-design references remain the approved Foundation images, not replacement implementation captures: VIS-01 `IconButton.png` (`5b6c4dd02d58a04f36bac9799106ac925825486dde1b4904c30f3bf24bd6a2b5`) and VIS-02 `icon-button--specimen.png` (`cc7ff50c78f695a4758349aaf430a2aa88cb1b0d0d91c0c64b3e067328e366c9`), pinned to `e08f007ee71af90e97cec2cd3f7dd2a880364314` in issue #57. Allowed differences remain outline 48px rather than 46px and the alpha-red-65 hover-border replacement. No browser/server was started; no CI run is claimed.

## Observed test-first progression

1. Initial focused RED: missing useIconButton import before implementation.
2. Initial GREEN: 16 component/hook tests passed after implementing native and Slot behavior.
3. Additional observed RED: the motion/focus invariant failed because the active-scale recipe was not motion-safe. GREEN followed the bounded selector correction; 18 component tests now pass.
4. Naming RED: absent scoped receipt and missing exact usages; GREEN: 83 tests, including immutable receipt pins, branch projection and negative semantic broadening.
5. Metadata RED: public parser-discovery list omitted IconButton; GREEN: component plus real metadata suites, 145 tests.
6. Export RED: stale built package lacked IconButton export and inline-grid CSS. After build, a test assumption about direct `scale:94%` failed; inspection confirmed Tailwind's --tw-scale-x/y representation, and the corrected checks pass all 27 tests.

## Validation of record

All gates ran individually in the foreground with the supplied locks and memory caps. Build preceded tests; no timeout retry occurred.

| Exact command | Final observed result |
| --- | --- |
| `timeout 300 systemd-run --user --scope -q -p MemoryMax=2G pnpm exec vitest run packages/ui/src/atoms/icon-button/IconButton.test.tsx packages/ui/src/lib/storybook-controls.test.ts packages/ui/src/lib/storybook-docgen.test.ts --maxWorkers=2` | 3 files, 145 passed |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm lint` | Passed; 258 files, no fixes |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm typecheck` | Passed, root and workspace |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm build` | Passed; UI JS/declarations and 204.52 kB CSS, tokens built first |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test --maxWorkers=4` | 30 files, 581 passed |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm props:check` | Registry valid; generated view current |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:props` | 83 passed |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm test:package-exports` | 27 passed; 56 reachable declaration files |
| `flock /tmp/egdev-gates.lock flock /tmp/egdev-packed.lock timeout 1500 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:package-consumption` | 12 passed across React 18.3.1 and 19.3.0 |
| `pnpm props:docs` | Regenerated docs/prop-naming.md |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Regenerated both catalogue outputs; 107 rows |
| `git diff --check` | Passed |

Packed checks retain the single React type-import declaration, ComponentProps/Surface/surfaceVariants, Icon, Text/Heading and all preceding samples. They add IconButton types and negative API checks, all treatment/size SSR samples, native/slotted CSR refs and disabled guards, CSS in native and Tailwind builds, and single physical React/ReactDOM instances. Assertions use boolean DOM identity, never DOM-node equality.

## Proposed coherent commit slices

Parent-owned Git actions only. Keep complete files; do not split test prefixes or leave unused imports/helpers. The first unit is approximately 493 authored lines because the six-file contract and complete behavior tests belong together; later units keep public registration and its tests coherent.

1. **feat(ui): implement IconButton native and slotted action** — the component is not yet root-exported in this slice:
   - `packages/ui/src/atoms/icon-button/types.ts`
   - `packages/ui/src/atoms/icon-button/useIconButton.ts`
   - `packages/ui/src/atoms/icon-button/IconButton.tsx`
   - `packages/ui/src/atoms/icon-button/IconButton.test.tsx`
   - `packages/ui/src/atoms/icon-button/IconButton.stories.tsx`
   - `packages/ui/src/atoms/icon-button/index.ts`
2. **docs(props): record IconButton-only icon semantics and usage** — reviewed source bytes now exist:
   - `docs/components/icon-button/v0.1/prop-naming-approval.json`
   - `skills/_shared/prop-naming.json`
   - `docs/prop-naming.md`
   - `scripts/prop-naming.test.mjs`
3. **test(ui): register and verify IconButton consumers** — public registration, all additive integration checks and delivery evidence:
   - `packages/ui/src/index.ts`
   - `packages/ui/src/styles/compiled.css`
   - `.storybook/main.ts`
   - `.storybook/preview.css`
   - `packages/ui/src/lib/storybook-controls.test.ts`
   - `packages/ui/src/lib/storybook-docgen.test.ts`
   - `scripts/package-exports.test.mjs`
   - `scripts/package-consumption.test.mjs`
   - `scripts/catalog_data.py`
   - `docs/CATALOGO.md`
   - `docs/catalog.json`
   - `docs/components/icon-button/v0.1/implementation-evidence.md`

## Ready PR body

### Summary

- Implement approved IconButton #57 v0.1 with required hidden naming, four token-backed treatments, three sizes, native activation and Radix Slot composition.
- Record the separately approved IconButton-only naming amendment without changing historical receipts or other-component permissions.
- Add stories, real Storybook metadata coverage, catalogue registration and additive exported/packed consumer checks. No token, dependency or legacy-style changes.

### Verification

- Lint, typecheck and build pass; 581 unit tests, 83 naming tests, 27 export checks and 12 packed checks pass.
- Packed React 18.3.1/19.3.0: strict public types, SSR, CSR refs/disabled guards, native/Tailwind CSS and React deduplication.
- Test-first evidence and full command results: this document.

### Deferred checks

- Visual parity, browser focus/motion/touch checks, assistive technology and Controls widgets: **Not evaluated**, deferred to the owner's main Storybook review.
- Tooltip.Trigger integration awaits the merged Tooltip component.
- Whole issue-body identity is verified; the historical reported canonical identity has the caveat documented above.
- No CI run is claimed. Parent owns commits, integration, push and PR creation.

Implements #57; do not close it as visually verified.
