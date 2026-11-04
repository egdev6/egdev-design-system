# Component contract — AmbientBackground

- **Version / status:** v0.2 planning draft — **DRAFT**, awaiting exact owner approval (G4). Not implementation-ready.
- **Version blocker:** `docs/components/ambient-background/v0.1/spec.md` does not exist; #45 already used **v0.2** for its initial issue body, followed by approved v0.3/v0.4. This path is the requested web-catalog planning label, not a claim to supersede or replace that history. Owner must choose: retain this path as a distinctly named web-catalog draft and assign a later component-contract version before approval; or select a new component-contract version and relocate it under separately authorized scope. Do not publish as a new #45 v0.2 snapshot.
- **Approval / recovery:** Pending. [Effective v0.4 recovery](../v0.4/contract-recovery.md), [v0.3 contract approval](https://github.com/egdev6/egdev-design-system/issues/45#issuecomment-6241414979), [v0.4 visual/naming closure](https://github.com/egdev6/egdev-design-system/issues/45#issuecomment-6241536173), and [taxonomy correction](https://github.com/egdev6/egdev-design-system/issues/45#issuecomment-6244220481) remain authoritative historical records. Exact G1/G4 approval and a separate G7 plan approval are required; no implementation authorization follows from this draft.
- **Snapshot identity:** `version: 0.2 (planning label; disputed)`; `contentSHA256: Pending`; `visualHashes: Pending for new combinations`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/45`; `latestPublishedComment: Pending for this draft`.
- **Hash definition:** SHA-256 of UTF-8 LF bytes from `## 1. Purpose and scope` through EOF including the final newline; metadata above is excluded. Finalize only after the version and content are settled; bind scoped approval to the digest and visual hashes.

## 1. Purpose and scope

A decorative, container-sized particle background. **S13:** "AmbientBackground -> los elementos se mueven paralelos (lineas y cuadrados). Cuando debería ser un componente que permita definir diferentes combinaciones (https://www.camzuna.com/anim)". [A13](../../web-catalog/v0.2/visual-amendments.md) requires independent line and square/plate families, not a preset-only choice. This draft changes the prior faithful coupled-geometry promise, but preserves all other recovered v0.4 promises unless explicitly decided below. It proposes no concrete new API until the choices are resolved.

The actual component is exported by `packages/effects/src/index.ts`, not `@egdev/ui`; evidence: `packages/effects/src/ambient-background/{types.ts,useAmbientBackground.ts,AmbientBackground.tsx,index.ts,particleStreaks.ts}`. Existing implementation and presets cannot independently select families. Reuse the existing effect and extend its contract rather than create another effect; composition of multiple current instances duplicates canvas, background, glow and lifecycle and does not establish independent geometry. Extraction/new component is not justified. Taxonomy: atom (effect), `@egdev/effects`; no Radix interaction. No zones, scroll choreography, blending bands, 3D exclusion, interactive content or time interpolation between profiles; the HomeTemplate-to-website migration is independent.

## 2. Anatomy and composition

| Part | Element | Responsibility and allowed content |
| --- | --- | --- |
| Root | `div` | `aria-hidden`, fills host, `data-state`, opacity custom property; canvas only, no consumer children |
| Canvas | `canvas` | Private engine drawing surface, no content or public canvas ref |

Stable public root `eg-ambient-background`; no public part markers, `asChild`, or Radix. The host positions/sizes the containing block and owns page background, overlays and choreography; the component owns its single canvas and effect lifecycle.

## 3. Public API

| Prop | Type | Default / rule | Contract |
| --- | --- | --- | --- |
| `profile` | `'base' \| 'read' \| 'live'` | `base` | Retain presets and immediate change; exact geometry/override interaction is a blocker below. |
| `opacity` | `number` | `1`; clamp [0,1], non-finite → 0 | Zero stops loop; independent of profile. |
| `className` | `string` | absent | Root host-layout only, not an appearance override. |
| Independent families | **Pending** | **Pending** | At least line and square/plate family selection; each must be selectable independently and without requiring a preset. No name, concrete type, values or defaults are approved or invented. |

Registry lookup by meaning/name/aliases: [source](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md): reuse approved `effect-profile` → `profile` and `layer-opacity` → `opacity`; `visual-treatment`/`variant` is a single presentation selector, not independent effect axes, and `effect-scene` is pose/progress, not particle family selection. No new prop name or convention ID is selected; new family-selection semantic IDs and component-specific types must be proposed and separately approved once the interface is chosen. No registry edits. Reviewed existing source: `packages/effects/src/ambient-background/types.ts`, symbol `AmbientBackgroundProps`, revision `sha256:029a277aec8c2814ce057223b47f7581dad7707725eb00547fb1b037ab420174`. This evidence does not approve future usages or conventions.

Native `div` attributes except `children`; `ref` forwards to the root `HTMLDivElement` (React 18-compatible `forwardRef`). Source filters `children`, `dangerouslySetInnerHTML`, `tabIndex`, `contentEditable` and `role`; root-owned `aria-hidden`, `data-state`, class and opacity take precedence. Native `style` is forwarded but is not permission for appearance overrides; component opacity custom property wins. No interactive controlled/uncontrolled state or emitted events. Existing effects export and consumers stay intact until a separately approved migration; React 18/19 packed verification remains a later plan check.

### Blocking owner decisions

1. **Independent axes:** choose two per-family selectors with finite values including absence, or another explicit independent configuration with finite values including absence. Specify exact names, types, combinations and geometry/motion semantics after inspecting the authorized reference; preserve the ability to select either family without selecting a preset.
2. **Preset mapping and precedence:** preserve `profile` as the fallback for omitted family settings, or propose another backwards-compatible rule. Define how explicit choices override each preset, runtime changes, invalid inputs and the both-absent state. With no explicit override the exact original base/read/live output below must remain reproducible.
3. **Direction and performance:** decide independent direction/motion options and concrete maximum per-family counts, speeds and combined frame/resource budgets for new combinations, including narrow-canvas scaling. Existing profile bounds below are not a cap for an unspecified new API. Provide a measurable device/browser benchmark and success threshold; no performance number is inferred from the reference.
4. **Visual and version identity:** authorize an inspectable source and capture conditions for combinations, then resolve the version collision above. The owner-supplied link has not been inspected. A separate naming decision and exact spec approval follow; neither is implied by planning.

## 4. Behavior

| Condition / action | Preserved result | Event |
| --- | --- | --- |
| Visible, positive opacity/size, motion allowed | Loop runs; `data-state="running"` | None |
| Profile changes | Counts/speed/glow update next frame; retain existing particles rather than reset | None |
| Opacity 0 or document hidden | Loop stops; `data-state="stopped"`; resumes when eligible | None |
| Reduced motion, including live preference changes | No loop; one static frame, redrawn on profile, opacity or size change; `data-state="static"` when eligible | None |
| Resize | Reinitialize particles; DPR capped at 2 | None |
| Canvas CSS width < 700px | Multiply each preset count by 0.6 and round; 700px uses full counts | None |
| Missing 2D context | No exception; root ambient background remains | None |
| Unmount | Cancel frames and remove observers/listeners | None |

Current source also stops on nonpositive dimensions or invalid resolved colors; avoid claiming a new broader fallback. States are lifecycle markers, not CSS variants. Independent family changes and their interaction with reduced motion remain blocked on the decisions above; no behavior is silently inferred.

## 5. Accessibility

Decorative root is hidden from assistive technology, nonfocusable and pointer-inert; no accessible name, keyboard interaction, announcements or touch target applies. Consumers must not put meaningful/interactive content in the hidden layer. Reduced motion is owned by the effect as above. Canvas uses `forced-colors:hidden`; forced-colors behavior must be checked for every approved combination. No new interaction or Radix primitive is proposed.

## 6. Appearance

| Preset | Lines / squares | Speed | Background glow | Narrow (<700px) counts |
| --- | --- | --- | --- | --- |
| `base` | 70 / 90 | 1 | 0.1 | 42 / 54 |
| `read` | 20 / 25 | 0.6 | 0.1 | 12 / 15 |
| `live` | 110 / 120 | 1.4 | 0.18 | 66 / 72 |

These are existing engine values, not new tokens. Every preset without overrides must reproduce its historical palette, density, glow and angle, not exact random particle positions. New axes and new permitted combinations are pending, not CSS variants. No tokens or dependencies are proposed. Six existing token inputs read at mount: `--color-ambient-bg`, `--color-ambient-glow`, `--color-ambient-line`, `--color-ambient-line-glow`, `--color-ambient-square`, `--color-ambient-square-glow`. The historical canvas drawing engine is effect art, not a Material surface or permission to hand-author CSS gradients/shadows; the host owns surrounding Material.

Root CVA is `eg-ambient-background absolute inset-0 pointer-events-none bg-ambient-bg opacity-[var(--eg-ambient-opacity)]`; canvas is `block h-full w-full forced-colors:hidden`. The existing narrowly approved opacity exception sets only numeric `--eg-ambient-opacity`; no new inline appearance or dynamic geometry exception. `cn(ambientRootVariants(), className)` merges root layout classes, while canvas receives only its own recipe. `twMerge` resolves recognized utility conflicts, not arbitrary cascade/custom groups; consumers may not override paint or accessibility-critical geometry. Later tests must cover supported layout merging and protected opacity; arbitrary precedence is not promised.

**Files:** existing six meaningful roles: `types.ts` (props/CVA), `useAmbientBackground.ts` (lifecycle), `AmbientBackground.tsx` (JSX), `AmbientBackground.test.tsx` (tests), `AmbientBackground.stories.tsx` (stories), `index.ts` (exports). Existing `AmbientBackground.lifecycle.test.tsx` is additional lifecycle coverage. Private non-exported `particleStreaks.ts` owns engine configuration, sprites and particle lifecycle, without JSX/React state. **No stylesheet.** Any additional engine module or stylesheet needs a separately approved spec/plan role.

### Expected-design visual reference

Historical reference-engine captures remain approved for their original preset scope, not approval of new combinations or proof of current React visual parity. [Metadata](../v0.3/capture.json): Chromium 148, 1280×720, DPR 1, dark, 3 seconds running, default transparency, no fonts, full viewport/component zone, Playwright MCP, 2026-10-17. Random positions are non-normative; opacity 1 and desktop only.

| ID | Historical image / alt | Scenario and source version | SHA-256 / status |
| --- | --- | --- | --- |
| VIS-01 | [Base red streaks and diamonds](../v0.3/base--running--1280--dark.png) | base; capture v0.3, adopted v0.4 | `d52cdd0877d242f8e9b72dc3d2cd065c274a75f8f1b8eee628b766aee97b5711`; historical approval |
| VIS-02 | [Sparse red streaks and diamonds](../v0.3/read--running--1280--dark.png) | read; capture v0.3, adopted v0.4 | `bba1da4dfbd898164dc88c5f8c7c5dbe03f0e3bbb57c2d6421c9a31cfe4c43f4`; historical approval |
| VIS-03 | [Dense red streaks and diamonds](../v0.3/live--running--1280--dark.png) | live; capture v0.3, adopted v0.4 | `4c0feaa1722243122d27ea9581abaedd7d8ea0feeb2573383a56acb012b08c84`; historical approval |
| VIS-04+ | Pending; no image yet | Independent line-only, square-only and mixed scenarios; source and conditions to be agreed | Pending capture and scoped approval |

Owner inspiration `https://www.camzuna.com/anim` is uninspected conversation provenance, not a capture or evidence of any technique. Follow [capture guide](../../../design/README.md): agree source, permissions, scenarios and conditions; capture real component zones with Playwright MCP, inspect PNGs, record `capture.json`, hashes and owner adoption. No capture is authorized in this task. Visual conformity for the new combinations is **Not evaluated**.

## 7. Acceptance criteria

All checks below are planned, not observed; exact new-input tests cannot be written until blockers are resolved.

| ID | Promise | Planned check / story or visual | Evidence |
| --- | --- | --- | --- |
| AB-AC1 | Independently select both families, including either alone, without requiring a preset; all approved combinations follow the chosen semantics | Public API behavior tests and combination stories, VIS-04+ | Pending decisions |
| AB-AC2 | Default base and each unmodified preset preserve exact counts, speed, glow and historical output; profile changes retain particles | Lifecycle/engine trace tests; VIS-01–03 comparative browser checks | Pending |
| AB-AC3 | Reduced motion is static and forced colors hides canvas for every combination | Preference-change and forced-colors browser tests/stories, VIS-04+ | Pending |
| AB-AC4 | No dependency or token changes | Manifest/token diff and build review | Pending |
| AB-AC5 | Opacity default/clamp/nonfinite/zero, native protections, root ref, SSR and layout-only class merge remain intact | Public render and lifecycle tests; opacity story | Pending |
| AB-AC6 | Hidden/resumed, resize/DPR, width 699/700/701, cleanup, context failure and static redraw retain behavior | Lifecycle tests with measured canvas and resource traces; narrow story | Pending |
| AB-AC7 | New combinations meet agreed density and resource bounds; host owns placement and effect owns one canvas | Bounded benchmark and host composition test; mixed stories | Pending limits |
| AB-AC8 | Public marker and decorative semantics preserved; private engine not exported; no choreography | DOM/accessibility, export and module-boundary checks | Pending |
| AB-AC9 | Existing six tokens and approved opacity exception are preserved; no stylesheet or unsupported override | Source/build inspection and own-element computed-style test | Pending |

### Spec closure

- [ ] Resolve version collision, axis/value/precedence, geometry, budgets and visual references.
- [ ] Resolve and separately approve any proposed prop conventions; no registry change in this unit.
- [ ] Capture and approve new expected-design visuals; preserve historical references.
- [ ] Obtain exact digest-bound G1/G4 spec approval, then separately propose and approve G7 plan. This draft authorizes no code or external writes.
