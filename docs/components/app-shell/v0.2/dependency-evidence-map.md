# AppShell — dependency and evidence reconciliation

- **Status:** preparation complete; template runtime PARKED. Full v0.1 contract remains approved as recovered in [contract-recovery.md](contract-recovery.md).
- **Baseline:** `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`, not the older primary checkout.
- **Map identity:** `contentSHA256: sha256:dc36061c1ac209995206ab39fa1151315ac5e027db81507b33349116be7c4353`; SHA-256 of UTF-8 bytes from the actual whole-line heading `## 1. Reconcile #128 without duplicate work` through EOF, LF including final newline; tracking above is excluded.
- **Future authorization:** [separate parked implementation plan](implementation-plan.md), not granted by this map. No tests/build/server/capture/install is executed here.

## 1. Reconcile #128 without duplicate work

The supplied [#128 snapshot](https://github.com/egdev6/egdev-design-system/issues/128) describes delivery of AppShell visual evidence, two naming conventions, generated reference, receipt-chain tests and historical publication log. It expressly excludes template implementation and initially excluded exact component-contract approval. The later [#130 full-contract approval](https://github.com/egdev6/egdev-design-system/issues/130#issuecomment-6251614057) supplies that separate approval; it does not retroactively grant #128 a runtime scope.

Actual committed evidence exists on this checkout. Read-only path history identifies commit `ed6d1845f0fcbf883d6ddeb253ea3337888fba9a`, subject `docs(specs): consolidate AppShell evidence and naming (#129)`. git ls-files confirms the assets/receipt are tracked; [template-wave log](../../../../odd/tasks/template-specs.md) records #128 delivery authorization and [organism-wave log](../../../../odd/tasks/organism-specs.md) records the published #123–127 specs. These are historical delivery records, not new terminal actions or runtime passes.

| Existing committed artifact | Reviewed whole-file SHA-256 | What is already recoverable |
| --- | --- | --- |
| `docs/design/foundation-boards/v2026-10-18-wave4/specimens/app-shell.specimen.html` | `53845b5702489af72044d8cb412423a5eb540af6e974986667d6dff2b235db96` | Static wide/narrow/skip illustrations using neutral organism placeholders; no behavior engine |
| `docs/design/foundation-boards/v2026-10-18-wave4/specimens/app-shell--specimen.png` | `27439a76a2beb70d16326452f9375a6fb447f255efea0eee7bd459a304a43c1d` | Approved scoped VIS-01 bytes, not a new capture |
| `docs/design/foundation-boards/v2026-10-18-wave4/specimens/capture.json` | `b1c4a2882ddcd384d3fe69c1bac27565cc55d11392466da108cb8f6dee0ffdc1` | Actual historical capture conditions/source hash; not runtime CSS switching/focus evidence |
| `docs/decisions/prop-naming-template-specs-approval.json` | `4bf0cffbbb2403aedd4830b4983519c863ebd851705f7050f4b7f104327a550a` | Delegated naming acceptance with two exact entries and five pinned prior receipts; nativeReviewApproval=false |
| `skills/_shared/prop-naming.json` | `f35d5571f41943ba01c40548dcee76216e85dbca26792c15a03a1324883b9386` | side-navigation/bottom-navigation accepted, usages empty; localized-messages accepted elsewhere |
| `docs/prop-naming.md` | `745d6d51508ca875ffb444fcfdffc14f4d3da5e81134b3050e65f693945f62a6` | Generated matching naming reference; no new AppShell source usage yet |
| `scripts/prop-naming.test.mjs` | `d209b550653bee4d0b669a05dbfc2972702d5c3f6ffea1bb76c6c099ff8ff447` | Existing `template naming receipt pins the organism receipt and binds two new layout slots` case; read, NOT run here |
| `odd/tasks/template-specs.md` | `5c438edacd793d2f92d95ce13fb5e94fd4a81ba81ea2672b04dc29cfab2fb346` | Historical wave consolidation/delivery scope and #128 reference; untouched |
| `odd/tasks/organism-specs.md` | `2de9eb68aa99ea960017155ba9ca476a21ac38ecada8f39a4f38941afd5d06f3` | Spec publication journal, not organism implementation; untouched |

The two naming entries are side-navigation/sideNavigation and bottom-navigation/bottomNavigation, with exact approval content hashes `5192bcdd094a11de6d3350e049019291a9ddf3a00741f3c461d1ff2f8067966f` and `59c322d5ee26a6f383c7b70d45014a784501acf1918a77865dcd2da1394dc971`. localized-messages/messages reuses `555c4e48e004651531f1588e18a8f71781afd8054c2ae113959b2831d86736cd`. No new naming proposal, registry promotion, receipt/test replacement, specimen, recapture, duplicate issue or reopening of the accepted contract is needed. #128's supplied issue state remains open; local committed delivery evidence is not permission to close/relabel it. Parent alone reconciles external tracking if separately authorized.

## 2. Actual current imports and missing runtime

There is **no AppShell source module/export/import graph yet**. Tracked organisms/templates contain only .gitkeep; scoped directory inspection finds no sidebar/module-rail/tab-bar/app-shell implementation. Consequently no AppShellProps source revision, future export hash or implementation verdict can be recorded.

| Current source | Reviewed whole-file SHA-256 | Actual inspected dependency/API fact |
| --- | --- | --- |
| `packages/ui/src/index.ts` | `08908ee7c034a211f2b6c252f7bb258865be1e31ec3f166e9ece7747a91bfa73` | Public Button/Surface exports exist; no AppShell/Sidebar/ModuleRail/TabBar exports |
| `packages/ui/src/atoms/button/Button.tsx` | `25c026ef25624697ab6013af4b62ebdfcf2ba98a876bb8036aa113850f39e693` | Imports individual @radix-ui/react-slot, React forwardRef, Spinner, ButtonProps and useButton; supports native/slotted host |
| `packages/ui/src/atoms/button/types.ts` | `1cf6a0e59cd1636bc05d59bb5d91bdb49e3da9cc0fbc27ecf69fb224e79b888f` | secondary/md/asChild and layout-only className are real current APIs |
| `packages/ui/src/atoms/button/useButton.ts` | `a3854519a345368150f1af57293af370e06ad94f1a5e6b8939d29e129c5b42a2` | Typed props/slot handling; state/disabled/handlers remain Button-owned, not rebuilt by AppShell |
| `packages/ui/src/primitives/surface/Surface.tsx` | `8173b47ef3645fbd09d58608558d97ea5524910960a3068f1d769c8f994cb143` | Implemented Surface imports individual Slot, React/type, own types and useSurface; not an AppShell runtime import |
| `packages/ui/src/lib/cn.ts` | `74220d183bbca5febc12bd56e70c8c07690d02ec8ff8f771a77072d62a90771f` | clsx plus configured twMerge, not universal arbitrary-media merge permission |
| `packages/ui/src/styles/compiled.css` | `00bd7fe99d92267f90773a7cf6eafb3c2f034e8078489a1b3469002494aef130` | Production scan covers atoms/primitives/molecule types, **not template types** |
| `.storybook/preview.css` | `93d9763a1c254b97d4bb5a880210aa63f4f42befdb18c4084d3e9aef339abafe` | Scans current atom/primitives/molecule stories, **not template stories** |

Future approved runtime imports are limited to Button from the existing atom, React types/useId/useRef, CVA in types.ts and cn in the hook. Organism imports belong in real composition stories, not AppShell. No Surface/VisuallyHidden/Dialog dependency is added to AppShell: skip links require their own approved focus-reveal treatment, not VisuallyHidden. No package/lock/token change is needed.

## 3. Prerequisite map and truthful unblock

| Dependency | Current evidence / boundary | Consequence |
| --- | --- | --- |
| [Button #53](https://github.com/egdev6/egdev-design-system/issues/53) | Implemented and publicly exported, inspected above | Historical missing-Button gate is satisfied by source availability; later consumer/browser behavior still needs actual checks |
| [Surface #106](https://github.com/egdev6/egdev-design-system/issues/106) | Implemented; host/region composition resource only | Not missing and not an AppShell import/prerequisite to recreate |
| [Sidebar #123](https://github.com/egdev6/egdev-design-system/issues/123) | Published contract/visual evidence; no runtime source/export here | Real SidebarAndTabBar story/composition cannot run; OUTSIDE non-organism batch |
| [ModuleRail #124](https://github.com/egdev6/egdev-design-system/issues/124) | Published contract/board; no runtime source/export here | Real ModuleRailAndTabBar story/composition cannot run; OUTSIDE batch |
| [TabBar #125](https://github.com/egdev6/egdev-design-system/issues/125) | Published contract/board; no runtime source/export here | Actual narrow navigation/safe-area/keyboard integration cannot run; OUTSIDE batch |
| [Dialog #119](https://github.com/egdev6/egdev-design-system/issues/119) | Host-owned overlay witness in AC-11, not AppShell composition | Plan portal/fixed/stacking tests structurally; actual Dialog modal/inert interaction requires its real separately available API/tooling, not a fabricated shell implementation |
| Separate AppShell plan/runtime grant | Not given | Even independently testable template core stays parked; no organism or template source in this phase |

Unblock only when parent verifies all three actual organism implementations/exports/example APIs usable for approved stories, obtains separate exact plan approval and assigns authorized template runtime edit surfaces in a later scope. No substitute organisms, generic wrappers marketed as real examples or same-batch organism implementation. Structural test fixtures can later isolate slot placement, never satisfy this readiness condition.

## 4. Gates that can be planned independently versus must wait

**Independent planning, no current execution:** six-file architecture; native DOM/slot presence/order and one main; Button anchor/default/localization/skip preventDefault/focus; SSR/useId/hydration markup without media listeners; supported merge/type negatives; emitted viewport/sticky/focus-reveal/canvas utilities and explicit template scanning; generic React18/19 SSR/client/packed no-Tailwind contract. Isolated slot witnesses may exercise only template responsibilities after future authorization.

**Must wait for real integrations:** Sidebar/ModuleRail/TabBar stories and exact organism props/names/current-page equivalence, their native keyboard/landmarks/Tab order, retained organism state across viewport hiding, real region dimensions/scroll height/safe-area behavior and comparable integrated captures. AC-11's actual Dialog witness waits for real Dialog availability. Browser viewport accessibility-tree/tab exclusion, sticky geometry at long/short document lengths, no-content-overlap, fixed containing-block behavior, RTL, 200%/400% reflow and AT require later authorized runtime/browser access, not static images or jsdom class assertions.

No tests/build/browser/AT/server/captures were run. CodeGraph reports uninitialized; index creation is outside the three-note surface, so structural inspection used exact current source and scoped find/git metadata. Old wave logs' passing tests or lint limitations are historical, not newly observed environmental failures or current validation results.
