# Isotipo3D — interaction amendment proposal (v0.5)

- **Status:** Draft proposal only. No source, test, registry, catalog or token file has been edited; this document is the S9 (#227) owner-decision input.
- **Trigger:** Owner visual review — S9: *"podríamos mejorar la api de interacción con el logo"* · *"Añadir controles de animación al story"* · *"Mejorar la interacción con el mouse (que se pueda girar y voltear el logo con el mouse)"*.
- **Baseline:** approved v0.4 runtime contract (retained v0.3 canonical SHA-256 `990682be…a09a`, plan `docs/components/isotipo3d/v0.4/implementation-plan.md`). Every change below is an amendment request against that contract; nothing here is approved by being written.
- **Read evidence:** `packages/effects/src/atoms/isotipo3d/{types.ts,useIsotipo3D.ts,Isotipo3D.tsx,Isotipo3D.stories.tsx}`, `isotipoScene.ts` pose/camera inputs, implementation-plan sections 2–4, `packages/effects/reference/pulso-iso3d.mjs` pointer handling.

## 1. Current interaction model and its limits

The component is a **decorative, non-interactive layer**. `Isotipo3D.tsx` hard-codes `aria-hidden='true'` and the root invariant recipe sets `pointer-events-none`; the native-prop Omit in `types.ts` strips `role`, `tabIndex`, `contentEditable`, `autoFocus`, `aria-hidden` and `data-state`, so consumers cannot make the logo focusable or announced. `Isotipo3DProps` exposes exactly four own props: `scene`, `progress`, `opacity`, `pointerTilt`.

The only interaction today is `pointerTilt` (default `true`):

- A **window-level passive `pointermove`** listener (not on the root) maps the mouse position to a normalized `tiltX/tiltY ∈ [-1, 1]`, smoothed in the hook's single rAF loop (`Math.min(1, dt * 3)`).
- The engine adds it as a **cosmetic camera offset only**: `az += tiltX * 3°`, `el -= tiltY * 2°` (`isotipoScene.ts` render, animation payload `tiltX/tiltY`).
- It is **mouse-only** (`event.pointerType !== 'mouse'` returns), **fine-pointer-only** (`matchMedia('(pointer: coarse)')` disables it), **scene-limited** (hero/outro only), **reduced-motion-off**, and resets to neutral on window exit, blur, scene change, disable, stop or failure. The reference `pulso-iso3d.mjs` has the same mouse-only ambient tilt and **no drag, rotate, flip or capture behavior anywhere** (verified: its only pointer handler is the passive `pointermove` tilt).

Limits against the owner request:

| Owner request | Current gap |
| --- | --- |
| "girar el logo con el mouse" | Tilt is bounded at ±3°/±2° and glued to the scene pose; a user cannot rotate the logo to inspect it, and every scene's pose function (`isotipoPose`) fully owns `az/el`. |
| "voltear el logo" | No flip concept exists; `az` is the only yaw channel and the SVG fallback is front-only. |
| "mejorar la api de interacción" | No gesture surface, no pointer capture, no callbacks — consumers cannot observe or react to pose; there is no way to opt into a deliberate gesture instead of ambient tilt. |
| "controles de animación al story" | Stories pass fixed args; autodocs Controls exist only because each prop is `@control`-annotated. There is no `paused` control, no interactive scenario, and the v0.4 plan's "no play/manual argTypes/loader props" rule blocks fake knobs. |

## 2. Proposed interaction API

### 2.1 Accessibility model (decision first, because it shapes every prop)

**Recommended: keep the component decorative by default; gestures are an opt-in, pointer-level embellishment; a separate `interactive` mode opts into a keyboard-operable widget.**

- **Decorative mode (default, unchanged a11y posture):** root stays `aria-hidden`, unfocusable and (while no gesture is enabled) `pointer-events-none`. Drag-rotate in this mode is a **direct-manipulation cosmetic effect, not essential functionality** — the logo conveys no information, so WCAG 2.1.1 keyboard parity is not required for it (same rationale as `pointerTilt` today, which also has no keyboard parity). Decorative mode **must not trap pointer or scroll**: listeners attach to the root only when a gesture prop is enabled, `touch-action` stays untouched for mouse/pen, and touch drag is **not** enabled in this mode (see OQ5) so a finger drag keeps scrolling the page.
- **Interactive mode (`interactive`):** the component stops being decoration. The root drops `aria-hidden`, gains `role='img'` (it still depicts the logo) with a **required accessible name**, `tabIndex={0}`, and full keyboard parity: Arrow keys rotate (yaw/pitch in fixed steps), Enter flips. `data-state` continues to expose the hook state. This is the only mode in which the component may take focus, and it is opt-in precisely so that a logo scattered as background decoration never joins the tab order.

This two-mode split resolves the aria-hidden question explicitly: **dragging coexists with `aria-hidden` only in decorative mode, where the drag result is ephemeral decoration; the moment the component is focusable/announced (`interactive`), `aria-hidden` is removed and keyboard parity is mandatory.**

### 2.2 Props (additive; defaults preserve current behavior exactly)

All names below go through the prop-naming workflow; **no registry entry has been added or edited** — candidate convention ids are listed in §2.3 for owner approval.

| Prop | Type / default | Meaning |
| --- | --- | --- |
| `dragRotate` | `boolean`, default `false` | Enables **drag-to-rotate**: horizontal drag adds a yaw offset, vertical drag a pitch offset, both relative to the smoothed scene pose (`isotipoPose` stays the base). Offsets are clamped (recommended: yaw ±90°, pitch ±30°) so the fit logic stays bounded (§4). On release, offsets **spring back to the scene pose** (critically damped, ~400–600 ms; no oscillation). Pointer capture is held on the root from `pointerdown` to release so the drag survives leaving the root's bounds. Mouse/pen in decorative mode; also touch when `interactive` (OQ5). |
| `flip` | `boolean`, default `false` | Enables **flip**: a full animated 180° yaw flip toggling front/back presentation. Triggers: (a) a deliberate horizontal drag released past a velocity/distance threshold, (b) double-click (fine pointer). In `interactive` mode also Enter/Space (OQ3). The flip is a discrete animated toggle, independent of the drag offsets; under reduced motion it swaps instantly (§2.4). |
| `interactive` | `boolean`, default `false` | Switches to the interactive a11y model of §2.1: removes `aria-hidden`, sets `role='img'`, `tabIndex={0}`, requires `label` (accessible name, convention `accessible-name`), enables Arrow-key rotate + Enter flip, and permits touch drag. Without `label`, the component renders in its fallback posture and warns in dev — an unnamed interactive widget is a contract violation, not a silent failure. |
| `onPoseChange` | `(pose: { yaw: number; pitch: number; flipped: boolean }) => void` | Emits the **user-driven** pose (drag offsets, flip state, keyboard rotate) on gesture changes and on spring-back settle; not emitted for scene/progress prop changes. Recommended payload keeps degrees and `flipped` as a boolean; the scene-pose base remains the component's private math. |

- Defaults: with no new prop passed, the component is byte-for-byte the v0.4 component — `pointerTilt` semantics, aria posture, invariants and stories unchanged.
- `pointerTilt` and `dragRotate` compose, not conflict: ambient tilt stays the mouse-only bounded ambient offset (unchanged eligibility rules); drag offsets are a separate channel added after the pose smoothing, so either can be disabled independently.
- Explicit non-goals: no consumer-provided pose (no `pose`/`defaultPose` prop — pose is the scene engine's job), no controlled flip state (flip is ephemeral cosmetic state; if a consumer needs to know, `onPoseChange` observes it).

### 2.3 Prop-naming registry candidates (lookup only — registry not edited)

Existing approved conventions already covering current API: `effect-scene` (`scene`), `effect-progress` (`progress`), `layer-opacity` (`opacity`), `pointer-tilt` (`pointerTilt`), `accessible-name` (`label`, reused for `interactive`), `interactive-value-change` (considered for the callback but **rejected**: the registry scopes `onValueChange` to selection/editing values; pose is not a value).

Candidate new conventions to propose to the registry (owner/parent applies any registration):

1. `interaction-drag-rotate` → `dragRotate` (boolean gesture enable).
2. `interaction-flip-gesture` → `flip` (boolean gesture enable).
3. `interaction-interactive-mode` → `interactive` (boolean mode switch that changes the a11y posture).
4. `interaction-pose-change` → `onPoseChange` (user-driven gesture callback; follows the registry's `on*Change` family: `onCheckedChange`, `onPressedChange`, `onSortChange`).

### 2.4 Reduced-motion behavior

- Ambient `pointerTilt` stays **fully disabled** under `prefers-reduced-motion: reduce` (unchanged).
- Drag and flip are **user-initiated direct manipulation**, so they remain available under reduced motion, but every *ambient* motion character is removed: no inertia, no spring oscillation, no animated flip. Drag updates apply the offset immediately (or a short linear transition ≤150 ms), release snaps to the scene pose, flip swaps 180° instantly. Rationale: a vestibular risk comes from self-moving animation, not from a transformation the user is actively steering; but inertia/fling is self-moving and is cut.
- The engine's reduced-motion static-draw path must accept the current offsets/flipped state so a reduced-motion drag still repaints (today it renders a single fixed pose).

### 2.5 Gesture details (normative intent for the later plan)

- **Pointer capture:** `setPointerCapture` on the root at `pointerdown` (only when a gesture prop is enabled), released at `pointerup`/`pointercancel`; `lostpointercapture` treated as release. All listeners are root-scoped — the current window-level `pointermove` remains exclusive to ambient tilt.
- **Inertia/spring-back:** on release the hook integrates release velocity into a short inertia glide, then a critically damped spring returns yaw/pitch offsets to 0 relative to the scene pose. All of this lives **in the hook's single rAF loop** — no second scheduler (v0.4 plan: "hook alone schedules frames"), no `setTimeout` chains.
- **Touch:** decorative mode never enables touch drag (scroll stays free; `touch-action` untouched). In `interactive` mode touch drag is enabled and the root gets `touch-action: none` — acceptable there because the user has explicitly opted into a manipulable widget (OQ5).
- **Flip threshold:** release with |yaw velocity| beyond a threshold, or cumulative drag distance past ~60% of root width, triggers flip instead of plain spring-back; double-click uses the platform double-click interval.

## 3. Story animation controls

Constraint check: the v0.4 plan's story rules (§2/§4) allow real `Meta/StoryObj` with autodocs and `@control` annotations, but forbid play functions, manual `argTypes`, loaders and "fake enabled Controls". The proposal therefore stays **args-driven**: every control is a real prop on a real scenario.

1. **Existing props stay controllable** (already `@control`-annotated): `scene` (select), `progress` (number), `opacity` (number), `pointerTilt` (boolean). The scenario stories (`Hero`, `Chapter`, `Lab`, `Outro`, `Opacity`, `Paused`, `Narrow`) keep their fixed args so the approved visual matrix is reproducible, while Controls remain available on the autodocs page.
2. **New `Paused` control via a real `paused` prop** (convention `paused-presentation` already approved in the registry): freezes the idle loop at the current pose, resumes on `paused={false}`. This is the cheapest honest "animation control" and is useful beyond stories (e.g. pausing behind an overlay). It reuses the existing stop/resume machinery (opacity-threshold stop) rather than a new scheduler.
3. **New interaction scenarios** exercising the §2.2 props, each with its controls visible: `DragRotate` (`dragRotate`, `onPoseChange` logged via a controls-driven action), `Flip` (`flip`), `InteractiveKeyboard` (`interactive` + `label`), `DragReducedMotion` (host-forced media, real browser evidence per the plan's test rules). These are real gesture demos, not mocked screenshots.
4. **Optional (owner decision OQ6): `introSpeed` / `idleSpeed` numeric props** (`@control number`) to slow/speed the intro ramp (1.2 s) and idle drift in stories. Recommended **only if** the owner wants choreography tuning; each is a real public prop with a default of `1` and would be validated like `progress`. Default recommendation: ship `paused` first, defer speed props.

No play functions, no fake argTypes, no loaders, no new story-only component state — anything the Controls show is a public prop.

## 4. Engine impact and test plan

### 4.1 Engine impact (`isotipoScene.ts`)

- **Pose inputs unchanged.** `isotipoPose(scene, progress, reducedMotion)` keeps producing `{az, el, fov, ex, halo}` and the approved numeric ledger is untouched. Drag/flip enter as **separate render-payload fields** — extend the animation object (`{ time, intro, pose, tiltX?, tiltY?, yawOffset?, pitchOffset?, flipped? }`) rather than mutating `pose`, so the pure pose functions and their formula-boundary tests stay intact. Camera math applies them exactly where `tiltX/tiltY` already do: `az_total = pose.az + tiltX*3 + yawOffset (+ 180 if flipped)`, `el_total = pose.el - tiltY*2 + pitchOffset`. Flipped additionally rotates the geometry group or flips the camera yaw sign consistently with lighting (owner-visible check: the back face must not look like a lighting bug).
- **Fit cache invalidation.** The local assembled fit (plan §4: "camera-local assembled fit90%") is computed against the base pose's projected bounds. Yaw/pitch offsets and flip change projected extents, so either (a) recompute the fit when offsets move beyond a small hysteresis band (cheap: bounds projection is CPU-only), or (b) apply a conservative fit margin whenever any gesture prop is enabled. **Recommended: (a) hysteresis recompute**, keeping the default (gesture-off) path bit-identical; never expand `fov` to compensate.
- **Reduced-motion static path** gains the offset/flipped inputs (§2.4); the single static draw per update remains.
- **Dependencies: none.** No new package, no new three version, no polyfill (`setPointerCapture` is baseline). No engine dependency on React; the hook computes springs/inertia and feeds the payload.
- **Invariant recipe change (contract amendment):** `isotipoRootInvariantVariants` currently hard-codes `pointer-events-none`. When `dragRotate` or `interactive` is enabled, pointer events must reach the root; proposal: keep `pointer-events-none` in the invariant recipe and have the hook append a CVA variant (`pointer-events-auto`) only when a gesture is active, so the default class string is unchanged (OQ8).
- **SSR/SSR-safe:** all gesture logic is inside the existing mounted-effect; no render-phase window access; the SVG fallback never becomes interactive (decorative mode), and in `interactive` mode the root (not the SVG) carries the role/focus.

### 4.2 Test plan (Vitest, mocked three — matching the v0.4 pattern)

RED first, per rule, asserting through the public interface (rendered DOM, prop callbacks, engine payload seen by a mocked `isotipoCreateScene`):

1. **Defaults/preserve:** with no new props, DOM output (classes, `aria-hidden`, `data-state`, `pointer-events-none`) and the engine payload are identical to v0.4; existing `pointerTilt` tests pass unchanged (differential guard on shared code).
2. **Drag:** synthetic pointer events (`pointerdown/move/up` with captured pointer mocked) produce yaw/pitch offsets in the render payload; offsets clamp at the recommended bounds; `onPoseChange` fires with degree values; release triggers spring-back and a final settled `onPoseChange`.
3. **Flip:** double-click flips (`flipped: true`, yaw +180° in payload); drag-past-threshold release flips; second trigger flips back; `flip={false}` swallows both triggers.
4. **Capture/eligibility:** `setPointerCapture` called on drag start, `releasePointerCapture` on end/cancel; drag ignored when gesture props are false; touch drag rejected in decorative mode and accepted in `interactive` mode (with `touch-action: none` asserted in the class/style output only in that mode).
5. **Reduced motion:** with the media query mocked to reduce, drag still updates the payload but no inertia/spring frames are scheduled; flip applies instantly; ambient tilt stays off.
6. **Interactive mode:** `interactive` without `label` → dev warning + fallback posture; with `label` → `aria-hidden` removed, `role='img'`, `tabIndex=0`; ArrowLeft/Right/Up/Down emit offset steps; Enter/Space flip; blur returns offsets to the scene pose (keyboard parity complete).
7. **Engine/fit:** mocked three receives the extended payload fields; fit recompute invoked when offsets cross the hysteresis band; gesture-off path makes no fit call (no behavior change).
8. **Cleanup:** gesture listeners and pointer capture are released on unmount, stop (`opacity: 0`, `hidden`, zero size), failure and reduced-motion entry — same lifecycle precedence as the v0.4 subscriptions.

Focused command (post-approval, parent-authorized): `pnpm exec vitest run packages/effects/src/atoms/isotipo3d`.

## 5. Owner decisions (with recommendations)

| # | Decision | Options | Recommendation |
| --- | --- | --- | --- |
| OQ1 | A11y model | A: decorative default + opt-in `interactive` mode (§2.1). B: always interactive. C: gestures only inside `interactive` mode (no decorative drag). | **A** — preserves the logo as pure decoration everywhere it is used today, gives keyboard parity exactly when the widget becomes operable. |
| OQ2 | Prop names | Approve `interactive` / `dragRotate` / `flip` / `onPoseChange`, or rename (registry candidates in §2.3). | Approve as proposed; register the four candidate conventions after approval. |
| OQ3 | Flip triggers | (a) drag-past-threshold + double-click (+ Enter in interactive mode); (b) double-click only; (c) drag-only. | **(a)** — matches "girar y voltear con el mouse" while keeping an explicit precise trigger. |
| OQ4 | Post-drag behavior | Spring back to scene pose vs. hold the dragged pose until scene change. | **Spring back** — the scene owns the pose; holding it would fight scene changes and the idle loop. |
| OQ5 | Touch drag | (a) interactive mode only; (b) also decorative under `dragRotate` with `touch-action: none`. | **(a)** — a decorative layer must never trap touch scroll; interactive consumers accept the tradeoff knowingly. |
| OQ6 | Story animation controls | (a) `paused` prop only; (b) `paused` + `introSpeed`/`idleSpeed` props. | **(a)** first; add speed props later only if choreography tuning is actually needed (§3.4). |
| OQ7 | Fit under rotation | (a) hysteresis fit recompute; (b) conservative fit margin whenever gestures enabled; (c) accept clipping at extreme drag. | **(a)** — keeps the gesture-off path identical and avoids shrinking the logo for everyone. |
| OQ8 | `pointer-events-none` invariant | Relax via appended CVA variant only while gestures active vs. keep the invariant absolute (no drag). | **Appended variant** — the invariant protects the default decorative posture; an explicit gesture prop is a consumer opt-in, documented and tested (§4.1). |
| OQ9 | `onPoseChange` payload | `{ yaw, pitch, flipped }` degrees vs. normalized engine-space values. | **Degrees + boolean** — matches the JSDoc-visible unit system already used by `progress`/scenes documentation. |

## 6. Scope of this document

Proposal only: no component, engine, hook, story, test, CVA, registry, catalog or token change has been made. If approved, the follow-up is a bounded plan amendment (v0.5) mirroring the v0.4 structure — exact surfaces, RED sequence, verification matrix — before any implementation writer is scheduled.
