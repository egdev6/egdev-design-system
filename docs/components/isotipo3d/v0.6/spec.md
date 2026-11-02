# Component contract — Isotipo3D v0.6 amendment: named zone poses as inputs, without choreography

- **Version / status:** 0.6 — **Draft amendment**, presented for owner approval. The approved base contract remains the full **v0.3** runtime contract (`990682be…`, [approval](https://github.com/egdev6/egdev-design-system/issues/47#issuecomment-6251414388)), with the v0.4 [preparation notes](../v0.4/contract-recovery.md), the appended v0.4 [web catalog note](../v0.4/web-catalog-note.md) and the v0.5 [interaction amendment](../v0.5/interaction-amendment.md) accepted through [#227](https://github.com/egdev6/egdev-design-system/issues/227#issuecomment-6559939579). **This document proposes no API change at all**; it closes the cataloged zone-pose gap as documentation over the existing props.
- **Approval / recovery:** Pending. This file is the recoverable copy of the version presented for approval; approving it authorizes no code, tokens, dependencies, registry edits or publication.
- **Current situation / pending decisions:** Existing atom effect in `@egdev/effects`, implemented at `packages/effects/src/atoms/isotipo3d/`. The delta was verified against the current implementation and against the read-only Pulso source. **The finding is that the gap is already closed**: the approved `scene` prop is the web's zone pose and `progress` is its local progress, with matching formulas. Two owner decisions are required before finalisation: whether to accept the documentation-only outcome (Q1) and whether pose travel/blending stays wholly in HomeTemplate (Q2). Five further questions (Q3–Q7) confirm or decline the recommended boundary. Nothing is implemented by this draft.
- **Snapshot identity:** `version: 0.6`; `contentSHA256: 9c592a3cd8dcd31096f3085932a3683ebc3cce970b6463fcd679e8093dd57e8c`; `visualHashes: VIS-04 → sha256:be95e6a50e135c64ff4dc3dd65ced5d25e2566c6fdbe4cdfaf5de851d1995dc5; VIS-05 → sha256:f0bb3c83624ec0e96ef593a90943bfe1789606574c5a063915d24ab4c03b8c80; VIS-06 → sha256:cd2f4cc0306c47c35d9a495caaaefe51e4797d60d44785a3a46668c6fdc43cbf; VIS-07 → sha256:c7aaf797980bdb9ee73a0b609f6a629f3c97b029e27ef9002d5f510a9711fb21; VIS-08 → sha256:14b937a95cedc2d839203fce8f855b58825576c157afcd0cbb4cb8f1ab492634; reused VIS-01 → sha256:48a0c0c425d6b7b33c0c53711c062767472ea090be3f1614e9445d11c9bb8ff1; VIS-02 → sha256:ce33c7d90e8fbe42a3cb3d207bee6715a443e7136bf3bfc4792b2772529642e4; VIS-03 → sha256:cb2412989d99da261e3a869061397bb283bbc31b1c5fce669743a809bcbd0aaf`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/47`; `latestPublishedComment: Pending — this snapshot is unpublished` (the latest comment on #47 before it is [#issuecomment-6559828309](https://github.com/egdev6/egdev-design-system/issues/47#issuecomment-6559828309), a visual-review acceptance note that carries no contract snapshot).
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from the `## 1. Purpose and scope` heading through EOF, LF line endings, including the final newline; all tracking metadata above that heading is excluded.
- **Version numbering:** `v0.3` holds the approved source captures, `v0.4` the implementation preparation for the approved v0.3 contract plus the appended web catalog note, and `v0.5` the interaction amendment accepted through #227. The next contract-level document is therefore `v0.6`.
- **Delta at a glance:** **none in code.** The cataloged "named zone poses (hero/chapter/lab/outro) as inputs, without choreography" is satisfied by the already-approved `scene` and `progress` props. What changes is only the recorded responsibility split: the web's per-zone progress formulas, band mixing, anchor-slot travel and mobile rules are written down as HomeTemplate's, not this component's.

## 1. Purpose and scope

**Need.** The owner approved that the design system must be able to build new views of the Pulso web (`odd/tasks/web-catalog.md` S3, L1/L5), and the approved policy amendment states the split directly: choreography lives in `@egdev/effects` HomeTemplate, and the effect components keep not choreographing ([CATALOGACION.md web consumer amendment](../../../CATALOGACION.md#web-consumer-amendment-approved-2026-11-02), rules 3 and 4). The cataloging draft recorded one Isotipo3D variant gap for that goal — "named zone poses (hero/chapter/lab/outro) as inputs, without choreography" ([draft §3](../../web-catalog/v0.1/cataloging-draft.md)) — and the appended [web catalog note](../v0.4/web-catalog-note.md) recorded it as a future variant that "still needs its own approved spec". This document is that spec, and its finding is that no variant is needed.

**The existing prop already is the zone pose.** The web component documents exactly two isotype inputs — a named pose and a local progress value — and the design-system atom already has both, under the approved names:

| Web (`design-system/components/Isotipo3D/README.md`, read-only) | Design system (`packages/effects/src/atoms/isotipo3d/types.ts`) | Status |
| --- | --- | --- |
| `pose: 'hero' \| 'chapter' \| 'lab' \| 'outro'`, default `'outro'` | `scene?: 'hero' \| 'chapter' \| 'lab' \| 'outro'`, default `'hero'` | **Same four pose families, different prop name and different default** (Q5, Q6) |
| `progress: number`, default `1`, "En la página lo calcula el director" | `progress?: number`, default `0`, finite clamp `[0, 1]` | **Same input**, normalized inside the component |
| `fallback: 'assembled' \| 'exploded'`, `size: 'default' \| 'chapter' \| 'lab'`, `fill: boolean`, `threeUrl: string`, `ariaLabel: string` | Not exposed (except the interactive `label` for accessible naming) | Deliberate v0.4 exclusions, unchanged (Q3, Q4) |
| — | `opacity`, `pointerTilt`, `paused`, `dragRotate`, `flip`, `interactive`, `label`, `onPoseChange` | Design-system additions with no web counterpart |

The pose formulas are already a faithful port, verified line by line against `pulso-iso3d.mjs` `poseOf` and the preview module's copy (`lerp`, `smooth`, `ISO_EL = 35.264`). Both trees use hero `h = smooth(0, 0.4, p)`, chapter `p`, lab `smooth(0.06, 0.42, p) × (1 − smooth(0.7, 0.96, p))` and outro `q = smooth(0.2, 0.85, p)`, with identical azimuth, elevation, FOV, explosion and halo terms; the approved v0.4 ledger already pins those numbers and the reduced-motion fixed values (`hero p0`, `chapter p0.5`, `lab p0`, `outro q1`) are the web's own `rm ? …` branches. Nothing in the pose layer is missing.

**What the web adds on top, and who owns it.** The web is not just "pose + progress": a page director derives the progress of each of its twelve zones and, between zones, blends two pose families and moves the logo between anchor slots. That is choreography, and the approved policy places it in HomeTemplate:

| Web mechanism (read-only source) | Owner after this amendment | Why not here |
| --- | --- | --- |
| Per-zone progress: `p.hero = clamp01(scrollY / hero.h)`, `p.chapter = clamp01((scrollY + vh − chapter.top) / (chapter.h + vh))`, `p.lab = sticky ? clamp01((scrollY − lab.top) / (lab.h − vh)) : clamp01((scrollY + 0.6vh − lab.top) / lab.h)`, `p.outro = clamp01((scrollY + vh − outro.top) / outro.h)` (`pulso-director.js`, `compute()`) | HomeTemplate | It reads page scroll and the twelve zone boxes; v0.4 excludes scroll parallax/choreography and window-level page state |
| Reading point `R = scrollY + 50 vh`, band mixing (last 35 % of A + first 15 % of B, minimum 0.75 vh), layer rule between the 3D and ambient layers, nearest-zone rounding under reduced motion | HomeTemplate | Page choreography; `scene` here is a value a host passes, never something the component measures |
| Pose travel: `mix: { a, b, t }` blending two `poseOf` results plus interpolating the anchor box `(l, t, w, h)` between `#slot-hero`/`#slot-cap`/`#slot-lab`/`#slot-outro` | HomeTemplate (Q2) | v0.4 explicitly excludes slot travel/lookup, anchor masks and the viewport-fixed canvas; one design-system instance renders one scene in its own box |
| Mobile: at `≤ 760 px` the chapter zone keeps only the SVG (`applyMobileZones()`, `bundle.css:49`); at `≤ 860 px` the box drops to `min(34svh, 300px)` (`bundle.css:1030`) and Lab to `36svh` | HomeTemplate / consumer layout (Q3, Q4) | Container size and mount decisions belong to the host; the atom has no breakpoint input and keeps its v0.4 `size`/`fill` exclusion |
| `size` (`62 vh`, `58 vh`, `72 vh`), `fill`, `fallback`, `threeUrl` | Consumer / packaging | v0.4 excludes pose/size/fill/fallback/loader/threeUrl APIs; the peer is pinned to `three@0.160.0` and tokens come from the consumer stylesheet |

`reference-web/pulso-source.html` confirms the mapping in the other direction: it registers twelve `data-zone` regions but only four anchor slots (`#slot-hero:834`, `#slot-cap:960`, `#slot-lab:1061`, `#slot-outro:1187`), and the director's zone table shows 3D only in hero, chapter, lab and outro. Four poses are the whole vocabulary; the other eight zones switch the 3D layer off, which a consumer does with `opacity` (the approved `layer-opacity` input) or by not mounting the atom.

**In scope.** The documentation outcome: closing the cataloged gap as *reuse without change*, recording the web-to-design-system mapping, the exact per-zone progress formulas HomeTemplate must reproduce, the mobile and reduced-motion rules, the four recorded divergences (prop name, defaults, size/fill, fallback), and five real captures that show the web's two inputs and the two pose families missing from the approved references.

**Explicitly out of scope (reported, not proposed).** No prop is added, renamed, re-defaulted or removed, and none of the following is requested here:

- A pose-blend or travel input (`mix`, `fromPose`/`toPose`, anchor boxes). Recorded as Q2 with a recommendation to keep it in HomeTemplate.
- `size`, `fill`, `fallback`, `threeUrl`, `ariaLabel` parity with the web. All were excluded in v0.4 and stay excluded; `ariaLabel`'s intent is covered by the v0.5 `interactive` + `label` pair.
- Adopting the web's defaults (`pose: 'outro'`, `progress: 1`). Recorded as Q6.
- Any change to the v0.5 interaction props, the gesture engine, the fallback SVG, the token-sampling rule, the opacity exception or the engine-data exception.
- A new story. The four pose families already have `Hero`, `Chapter`, `Lab` and `Outro` stories; adding a "zone" story that only renames existing args would claim a behaviour change that does not exist.
- The per-zone progress formulas themselves. They are quoted here for traceability and belong normatively to the future HomeTemplate spec (Q7).

**Cataloging decision / alternatives.** **Reuse without change**, the first step of `docs/CATALOGACION.md`, after inspection of the public React API (not CSS, catalog rows or stories). *Variant* was the recorded expectation and is now rejected with evidence: a variant would change the appearance or size surface inside the approved contract, while `scene` already carries the four pose families and `progress` already carries their curve. *Compose* was rejected because a wrapper around the atom would move the intended pose selection into consumer code and would still need the same two props. *Extract* and *new* are irrelevant: nothing is hidden and no second responsibility appears. The step that actually existed was documentation, not API.

**Evidence / level and package.** Current public React implementation reviewed in this working tree:

| Path | Reviewed symbol | Whole-file SHA-256 |
| --- | --- | --- |
| `packages/effects/src/atoms/isotipo3d/types.ts` | `Isotipo3DProps` (`scene`, `progress`, `opacity`, `pointerTilt`, `paused`, `dragRotate`, `flip`, `interactive`, `label`, `onPoseChange`), `IsotipoPoseChange`, the seven CVA recipes (root, invariant, gesture, canvas, svg, two ink) | `0099ebba8fc63ca6fd3a3817b74ec2f311bd387f9ce521efa1391f5791144164` |
| `packages/effects/src/atoms/isotipo3d/isotipoScene.ts` | `isotipoPose`, `isotipoNormalizeProgress`, `isotipoGestureAngles`, `isotipoGestureBand` | `df69d8787133a2823fa8d4f3c149e64394434595e9ab319f8d663c213a2b1668` |
| `packages/effects/src/atoms/isotipo3d/useIsotipo3D.ts` | scene/progress inputs, pose smoothing (`1 − exp(−dt / 0.05)`), snap on scene change, reduced-motion static draw, suspension | `2beaaf008246dbb78056db5dd9988bc13021339d3181786bc73bd7daaae51023` |
| `packages/effects/src/atoms/isotipo3d/Isotipo3D.tsx` | own-prop defaults, `normalizedScene` fallback to `hero`, native filtering, decorative/interactive posture | `59f55a08c71aad5204ef9375436235db508cf42690e7caa1efc231a09702c9d4` |
| `packages/effects/src/atoms/isotipo3d/index.ts` | public exports (`Isotipo3D`, `Isotipo3DProps`, `IsotipoPoseChange`) | `25c7cf5177febbac2d8d6d30c573678c60a3dc9add966034d4f478f012415776` |
| `packages/effects/src/atoms/isotipo3d/Isotipo3D.test.tsx` | pose ledger (18 pose points), reduced-motion ledger, normalization matrix, v0.5 interaction cases | `6559b38b24aa2011a795d5132313f219afd4bb05824523f035e0b3550b1b824a` |
| `packages/effects/src/atoms/isotipo3d/Isotipo3D.stories.tsx` | `Atoms/Isotipo3D` stories, including `Hero`, `Chapter`, `Lab`, `Outro` | `cb02158be4dd6f172a8f5cd3c783316eb24691bf8d67a7c0a7d7cd9f76655836` |

Read-only web evidence is recorded in [capture.json](capture.json) (`source`): `design-system/components/Isotipo3D/{README.md,preview.html}`, `design-system/{tokens.css, components/bundle.css}`, `design-system/components/src/effects/{pulso-iso3d.mjs,pulso-director.js}` and `reference-web/pulso-source.html`. They were read and rendered, never edited, executed by the design system or imported.

## 2. Anatomy and composition

Unchanged from the approved contract. Restated here only where the responsibility split touches the anatomy:

| Part | Responsibility | Native element / Radix primitive | Allowed content |
| --- | --- | --- | --- |
| Root `eg-isotipo-3d` | Fills and clips the consumer-sized box; carries the owned `data-state`, `aria-hidden` or interactive role and the `--eg-iso3d-opacity` property | native `div` (public `HTMLDivElement` ref) | The canvas and the fallback SVG only |
| Canvas | Instance-local transparent WebGL surface for **one** pose at **one** progress | `canvas`, `aria-hidden` | GPU output only |
| Fallback | Stationary assembled seven-polygon SVG from SSR onward | inline `svg`, `aria-hidden`, `focusable="false"` | Geometry and token fills only |

- **Delta:** none. One instance still renders one scene at one progress in its own box; the zone pose is an input value, not a page position. A host that wants the logo in four zones either mounts four instances (one per zone) or moves a single instance and changes `scene`, which snaps to the new pose family.
- **Radix / composition:** none and unchanged — no Radix primitive exists for a passive WebGL layer. No `children`, slots, `asChild`, portal, external canvas or engine ref is introduced.
- **Public markers:** the stable root `eg-isotipo-3d` and the owned `data-state` values are unchanged; no marker is added, renamed or removed. The web's `eg-iso3d*` classes and `.is-gl-on` alias are still not attached.

## 3. Public API

**No change.** The complete own-prop surface today, verified in `types.ts` and `Isotipo3D.tsx`:

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `scene` | `'hero' \| 'chapter' \| 'lab' \| 'outro'` | No | `hero`; any other runtime value normalizes to `hero` | The named pose family — the web's zone pose. Approved in v0.3; **unchanged by this amendment** |
| `progress` | `number` | No | `0`; only finite numbers pass, clamped to `[0, 1]`, everything else `0` | Local progress inside the selected pose family. Approved in v0.3; **unchanged** |
| `opacity` | `number` | No | `1`; same normalization as `progress` | Decorative layer opacity; `0` suspends work. Unchanged |
| `pointerTilt` | `boolean` | No | `true`; only literal `true` enables | Bounded mouse-only camera tilt in hero/outro. Unchanged |
| `paused` | `boolean` | No | `false` | Freezes the idle loop at the current pose; gestures still repaint. v0.5, unchanged |
| `dragRotate` | `boolean` | No | `false` | Opt-in drag offsets that spring back to the scene pose. v0.5, unchanged |
| `flip` | `boolean` | No | `false` | Opt-in 180° flip gesture. v0.5, unchanged |
| `interactive` | `boolean` | No | `false` | Switches to the focusable `role="img"` posture; requires `label`. v0.5, unchanged |
| `label` | `string` | Only meaningful with `interactive` | absent | Accessible name of the interactive posture; ignored while decorative. v0.5, unchanged |
| `onPoseChange` | `(pose: IsotipoPoseChange) => void` | No | absent | User-driven pose in degrees plus `flipped`; never fires for `scene`/`progress` changes. v0.5, unchanged |
| `className` | `string` | No | absent | Inherited layout-only merge (outer margin, placement, z-order). Unchanged |
| Native `div` attributes | — | No | forwarded after the documented Omit/filter | Unchanged, including the exclusion of `style`, `role`, `tabIndex`, `children`, `aria-hidden` and `data-state` |

```ts
// No new or changed type is proposed. Current public types, for reference only:
export type Isotipo3DProps = NativeProps & {
  scene?: 'hero' | 'chapter' | 'lab' | 'outro';
  progress?: number;
  opacity?: number;
  pointerTilt?: boolean;
  paused?: boolean;
  dragRotate?: boolean;
  flip?: boolean;
  interactive?: boolean;
  label?: string;
  onPoseChange?: (pose: IsotipoPoseChange) => void;
};
export type IsotipoPoseChange = { yaw: number; pitch: number; flipped: boolean };
```

- **Prop conventions.** The [canonical registry](../../../../skills/_shared/prop-naming.json) and the [generated view](../../../prop-naming.md) were consulted by meaning, name and aliases before drafting anything. Applied entries, all already approved and all already carrying an `Isotipo3D` usage:

| Registry entry | Prop | Recorded type | Evidence freshness |
| --- | --- | --- | --- |
| [`effect-scene`](../../../../skills/_shared/prop-naming.json) | `scene` | `'hero' \| 'chapter' \| 'lab' \| 'outro'` | Registry usage revision `sha256:0099ebba…` equals the current `types.ts` hash — **no stale evidence, no update needed** |
| [`effect-progress`](../../../../skills/_shared/prop-naming.json) | `progress` | `number` | Same file, same revision |
| [`layer-opacity`](../../../../skills/_shared/prop-naming.json) | `opacity` | `number` | Same file, same revision |
| [`pointer-tilt`](../../../../skills/_shared/prop-naming.json) | `pointerTilt` | `boolean` | Same file, same revision |
| [`animation-paused`](../../../../skills/_shared/prop-naming.json) with the `Isotipo3D` exception | `paused` | `boolean` | Exception `exception:animation-paused:Isotipo3D:paused`, [receipt](../../../decisions/prop-naming-isotipo3d-interaction-approval.json) |
| [`interaction-drag-rotate`](../../../../skills/_shared/prop-naming.json) | `dragRotate` | `boolean` | Same file, same revision |
| [`interaction-flip-gesture`](../../../../skills/_shared/prop-naming.json) | `flip` | `boolean` | Same file, same revision |
| [`interaction-interactive-mode`](../../../../skills/_shared/prop-naming.json) | `interactive` | `boolean` | Same file, same revision |
| [`accessible-name`](../../../../skills/_shared/prop-naming.json) | `label` | `string` | Same file, same revision |
| [`interaction-pose-change`](../../../../skills/_shared/prop-naming.json) | `onPoseChange` | `(pose) => void` | Same file, same revision |

  **`effect-scene` is the decisive entry**, and its approved wording describes this exact need: "a named pose family of a decorative effect, optionally evaluated at consumer-supplied local progress … scene names are component-specific", with "page choreography" listed under *avoid*. The cataloged zone-pose gap is therefore a satisfied use of an approved convention, **not** a new convention and **not** an exception. No registry edit, no `pnpm props:*` run and no convention approval is requested by this amendment. Convention approval remains separate from this spec's approval and is not inferred from it.
- **Native props / refs:** unchanged (root-only `div` inheritance with the documented exclusions, public `HTMLDivElement` ref, React 18/19 compatible forwarding).
- **Controlled / uncontrolled:** `scene` and `progress` are consumer-selected values, not state the component owns; there is no uncontrolled or default-state API. The user-driven pose (drag/flip) is the component's ephemeral cosmetic state and is only observable through `onPoseChange`.
- **Compatibility:** **zero API impact.** No prop is added, removed, renamed, retyped or re-defaulted; no export changes (`Isotipo3D`, `Isotipo3DProps`, `IsotipoPoseChange`); no marker, class, token, dependency or engine payload changes. Existing consumers, the four pose stories, the 18-point pose ledger and the v0.5 interaction suites are untouched by this document. A consumer that today passes `scene`/`progress` keeps exactly the behaviour it has.

## 4. Behavior

Unchanged behaviour, restated as the promises a web host relies on when it feeds a zone pose:

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| Host passes `scene="chapter" progress={0.42}` | The chapter pose is evaluated at that progress (`az = 33 → 57`, `el = 35.264`, `fov = 10`); no page knowledge is used | none |
| `progress` changes | The pose follows the approved curve, smoothed with `τ = 50 ms`; nothing is re-fetched, re-created or re-introduced | none |
| `scene` changes (for example hero → lab as a host moves the logo to another zone) | The new pose family **snaps** (no cross-fade between families), the pointer offset resets and the intro is not replayed | none |
| Host mounts one instance per zone | Each instance renders its own scene and progress in its own box; instances share no mutable scene or random state | none |
| Unknown runtime `scene`, non-finite or out-of-range `progress` | `scene` normalizes to `hero`; `progress` normalizes to a clamped finite value or `0`; the raw value never reaches the engine | none |
| `opacity={0}`, native `hidden`, or a zero-sized root | Work is suspended (listeners, frames and draw calls stop); a resumed instance uses the latest `scene`/`progress` with a reset elapsed-time baseline | none |
| `prefers-reduced-motion: reduce` | Fixed assembled poses per family — `hero` p0, `chapter` p0.5, `lab` p0, `outro` q1 — one draw per applicable change, no intro, idle motion, explosion animation or pointer chain. These are exactly the web's own reduced-motion branches | none |
| Gesture props from v0.5 (`dragRotate`, `flip`, `interactive`) | Unchanged: offsets are added after the scene pose, they spring back, and `onPoseChange` reports user-driven values only | `onPoseChange` |
| Coverage or initialization failure | Terminal SVG fallback for that mount; no scene or progress value can revive a failed mount | none |

- **States / representation:** unchanged owned precedence (`failure → fallback` > `suspended → stopped` > `pending → loading` > `reduced-motion → static` > `running`) exposed through `data-state`, never mirrored into classes.
- **Limits / consumer responsibilities:** one pose family and one local progress per instance, both static per render input. **The component never derives progress**: scroll position, zone tops, viewport height, the 50 vh reading point, the 35 %/15 % bands, pose blending, anchor-slot travel, the `≤ 760 px` chapter rule and the `≤ 860 px` box heights are the host's job (HomeTemplate). Reduced motion is honored by the component, but *which* progress the host would have passed is a host decision that reduced motion does not rewrite.
- **Interaction with the v0.4 exclusions:** this amendment adds no scroll, page, viewport, director or slot behaviour; the approved exclusion list stays verbatim.

## 5. Accessibility

Unchanged, and unaffected by this amendment.

- **Accessible name / roles / relationships:** decorative by default — root, canvas and SVG are hidden from accessibility APIs, there is no role, name, live status, `title` or `desc`, and surrounding branding must be conveyed by consumer text outside this subtree. The opt-in `interactive` posture from v0.5 keeps its own contract: `role="img"`, `tabIndex={0}`, a required non-empty `label` and a dev warning plus decorative fallback posture without it.
- **Keyboard / focus:** no focus stop, no key handling and no activation in the decorative posture, including when `scene`/`progress` change. Arrow-key rotation and Enter/Space flip exist only in `interactive`, unchanged.
- **Announcements / other conditions:** nothing is announced. A zone change is a decorative pose change and must not be the only carrier of meaning: the host's zone heading, section label or navigation state carries it. Reduced motion is respected (fixed poses above) and the atom still does not intercept pointer events by default.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| `scene` | `hero`, `chapter`, `lab`, `outro` | `hero` | Four named pose families; each is a continuous curve over `progress`. Not a visual treatment to be styled |
| `progress` | `number` `[0, 1]` | `0` | Drives the selected family only |
| `opacity` | `number` `[0, 1]` | `1` | Hosts hide the layer in non-3D zones |
| gesture axes (`pointerTilt`, `paused`, `dragRotate`, `flip`, `interactive`) | booleans | as recorded in v0.4/v0.5 | Unchanged |

- **Tokens / Material:** unchanged. The root stays transparent effect geometry (no Surface, well, overlay, card, border, background, gradient, shadow or mask); container dimensions and hosting Material belong to the consumer. The mounted-root token sampling (`--logo-red`, `--logo-red-shade`, `--color-primitive-red-neon`, `--color-primitive-red-light`) and the SVG token fills are unchanged. No token value, recipe or confirmation is requested here.
- **Dynamic geometry:** unchanged. The only approved exceptions remain the `#47` engine-data/material exception and the `#47` opacity exception (`opacity-[var(--eg-iso3d-opacity)]` plus one owned unitless numeric property). This amendment introduces no inline geometry, no interpolated class and no new custom property.
- **Class composition / consumer layout:** unchanged. Root `className` merges last for outer margin, placement/alignment and z-order, then the invariant group wins over recognized fill, clip, pointer, opacity and paint conflicts. A host places the atom in a container it sizes (the web's `62 vh`/`58 vh`/`72 vh`, `min(34svh, 300px)` at `≤ 860 px`, `36svh` for Lab); it does not get a `size` prop (Q3).
- **Files / pending proposals:** the six meaningful files plus the private `isotipoScene.ts` keep their roles unchanged — `types.ts`, `useIsotipo3D.ts`, `Isotipo3D.tsx`, `Isotipo3D.test.tsx`, `Isotipo3D.stories.tsx`, `index.ts`, and the internal non-exported scene engine. **No stylesheet.** No new module, no story and no dependency; nothing to add to the mandatory file set because nothing is implemented.

### Expected-design visual reference

The five new images are real Chromium captures of the **web** `design-system/components/Isotipo3D/preview.html` rendered read-only for this task, with per-file hashes, selectors, states and conditions in [capture.json](capture.json). They are **observed web behaviour supplied as the comparison baseline — Proposed, not adopted**; nothing here approves a design-system appearance, and this amendment changes none.

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-04 | [zone-poses--inputs-controls--1280x900--dark.png](zone-poses--inputs-controls--1280x900--dark.png) — four pose chips ("Cierre · ensamblado", "Lab · explosión", "Hero · giro" pressed, "Capítulo · 33°→57°") above a progress slider reading 0.50 | Web control block showing the only two isotype inputs: named pose + local progress; `pose=hero`, `progress=0.50` | Web `preview.html` (`sha256:8984aeb1…`), source capture version 0.6 for spec version 0.6 | Proposed — Pending |
| VIS-05 | [chapter--pose-progress-1--1280x900--dark.png](chapter--pose-progress-1--1280x900--dark.png) — the assembled isotype isometrically framed at the end of the chapter turn | `pose=chapter`, `progress=1` | Same source and conditions as VIS-04 | Proposed — Pending |
| VIS-06 | [outro--pose-progress-0--1280x900--dark.png](outro--pose-progress-0--1280x900--dark.png) — the same isotype with its pieces separated and mostly outside the stage framing | `pose=outro`, `progress=0` (explosion 0.9 at the assembly-curve start) | Same source and conditions as VIS-04 | Proposed — Pending |
| VIS-07 | [hero--pose-progress-0.5--1280x900--dark.png](hero--pose-progress-0.5--1280x900--dark.png) — the isotype half-way through the hero turn | `pose=hero`, `progress=0.5` | Same source and conditions as VIS-04 | Proposed — Pending (supplementary to VIS-01) |
| VIS-08 | [board--pose-controls-and-fallbacks--1280x900--dark.png](board--pose-controls-and-fallbacks--1280x900--dark.png) — the whole preview board: outro at progress 1, the pose/progress controls, and both SVG fallbacks (mounted with glow, and the exploded Lab variant) | Whole board, `pose=outro`, `progress=1` | Same source and conditions as VIS-04 | Proposed — Pending (supplementary; documents the web-only `fallback="exploded"`) |
| VIS-01 | [../v0.3/hero--progress-1--1280--dark.png](../v0.3/hero--progress-1--1280--dark.png) — hero pose at progress 1 (reused historical capture) | `pose=hero`, `progress=1` | Source capture version 0.3, cited by spec v0.6 | Approved as a v0.3 source reference for geometry/palette/pose only; **not** a v0.6 capture and not widened here |
| VIS-02 | [../v0.3/lab--progress-0.50--1280--dark.png](../v0.3/lab--progress-0.50--1280--dark.png) — Lab at progress 0.5, full-explosion plateau, visibly clipped (reused) | `pose=lab`, `progress=0.5` | Source capture version 0.3 | Approved as a v0.3 source reference; not widened here |
| VIS-03 | [../v0.3/assembled--source-fallback--1280--dark.png](../v0.3/assembled--source-fallback--1280--dark.png) — source SVG fallback geometry and palette only (reused) | Source fallback | Source capture version 0.3 | Approved as a v0.3 source reference (geometry/palette only) |

- **Conditions / provenance per VIS ID:** VIS-04 to VIS-08: viewport 1280×900 CSS px, DPR 1, Chromium headless shell 153.0.8010.12 on Linux x86_64 through playwright-core 1.60.0 with `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`, dark colour scheme, `prefers-reduced-motion: no-preference`, `forcedColors: none`, `lang="es"`, `data-theme="dark"`; the preview fragment was mounted unmodified in a temporary `/tmp` harness that also loaded the authored `tokens.css` and `bundle.css` and kept the original Google Fonts links; Barlow 500/600, Barlow Condensed 600 and JetBrains Mono 400 loaded; `three@0.160.0` was imported from its original jsDelivr URL and WebGL was active (status text observed); element crops, 1400 ms after each pose/progress change; captured 2026-11-02. VIS-01 to VIS-03 keep their original 2026-10-18 conditions recorded in [`../v0.3/capture.json`](../v0.3/capture.json) (Chrome 148, 1280×900, original dark tokens and bundle).
- **Intent / acceptance / pending evidence:** VIS-04 is the load-bearing image: it shows that the web's isotype has exactly two inputs, a named zone pose and a local number. VIS-05/VIS-06 fill the chapter and outro families that the approved v0.3 set did not cover; VIS-07/VIS-08 are supplementary. Because **this amendment proposes no appearance**, no expected-design adoption is requested and pixel values from these images are never treated as tokens. Visual conformity of the design system is **Not evaluated**; the images do not replace behaviour, accessibility or token checks. VIS-06 also records an expected source behaviour: pieces at `outro` progress 0 are clipped because the web fits the camera to assembled bounds — the design-system contract already states that full-explosion pieces may clip.
- **GitHub visibility:** Pending. The PNGs are local repository files; issue handoff needs a human attachment of the exact bytes or a separately authorized asset-publication route, with the returned URL verified against these hashes.

## 7. Acceptance criteria

This amendment changes no behaviour, so no test-first cycle applies (see the exception note below). The criteria below are verification of the *documentation* claim and its inputs; each is marked with the method that would prove it.

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| I3D6-01 | The four zone poses and their progress curves in the design system equal the web's `poseOf` values at every sampled point | Existing `Isotipo3D.test.tsx` → `Isotipo3D scene pose port` (18 pose points + reduced-motion ledger) is the pinned evidence; this amendment adds no case because the formula does not change | `Hero`, `Chapter`, `Lab`, `Outro` (unchanged) | **Observed by review** of `isotipoScene.ts` against `pulso-iso3d.mjs` `poseOf`; the suite was **not re-run** for this docs-only amendment |
| I3D6-02 | No API, type, export, marker, story or engine-payload change is made by v0.6 | Diff of the working tree: only `docs/components/isotipo3d/v0.6/**` is added; `packages/effects/**` untouched | — | **Observed** in this working tree (`git status`) |
| I3D6-03 | Every web isotype input is either mapped to an approved design-system prop or recorded as an excluded divergence with a reason | Review of the §1 mapping table against `README.md` (props table) and `types.ts` | — | **Observed by review**; the four exclusions (name, defaults, size/fill, fallback) are recorded as Q3–Q6 |
| I3D6-04 | The per-zone progress formulas and mobile rules quoted for HomeTemplate match the read-only director and stylesheet | Line-by-line comparison with `pulso-director.js` `compute()` and `bundle.css:49,1013-1015,1030`; source hashes in `capture.json` | — | **Observed by review**; the normative statement belongs to the HomeTemplate spec (Q7) |
| I3D6-05 | Prop naming needs no new convention, no exception and no registry edit; the recorded usage revision is current | Compare the registry `Isotipo3D` usage revision with `sha256sum packages/effects/src/atoms/isotipo3d/types.ts` | — | **Observed**: both are `sha256:0099ebba…` |
| I3D6-06 | VIS-04 to VIS-08 are real, distinct captures with matching hashes, and the reused v0.3 references keep their original bytes | `sha256sum` over the five PNGs and the three reused PNGs; visual inspection of each image | VIS-04 to VIS-08 | **Observed** for this draft |
| I3D6-07 | The snapshot identity in the header matches this payload | Recompute SHA-256 from the `## 1. Purpose and scope` heading through EOF and compare with `contentSHA256` | — | **Observed** before handoff |
| I3D6-08 | No appearance, token, Material recipe or geometry exception is introduced | Review of §6 against `docs/MATERIAL.md` and the approved `#47` exceptions | — | **Observed by review** (no change) |
| I3D6-09 | A future consumer can select a pose and feed its progress without knowing the web's page model | Storybook review of the existing pose stories; documentation review of this spec | `Hero`, `Chapter`, `Lab`, `Outro` | Pending — depends on the plan-less documentation outcome being approved (Q1) |

**Test-first exception.** The delegated task is spec-only: `docs/components/isotipo3d/**` is the only writable surface, no source or test file may change, and the proposal concludes that no behaviour change is needed. There is therefore no RED to observe and no GREEN to produce; asserting an artificial failing test would violate the allowed edit surface. Verification is limited to the structural and hash checks above, plus review against the current API.

### Spec closure

- [x] All seven blocks are complete; block 2, 3, 5 and 6 are "no change" statements with the current API restated, and block 4 records behaviour as it exists today.
- [x] The only registry-relevant finding is that no new convention and no exception are needed; the applied entries and the exact usage revision are recorded, and every remaining owner choice is isolated as Q1–Q7 instead of being silently promised.
- [x] Proposals, verified implementation, planned checks and observed results are kept distinct; every promise has an acceptance ID and a method, and the absence of a test-first cycle is justified.
- [x] Visual IDs identify real provenance, conditions and related criteria; reused v0.3 references keep their original version and limits, and visual conformity is **Not evaluated**.
- [ ] Snapshot identity is recoverable, but human approval of this exact version, digest and visual hashes is **still pending** — hence status Draft.
- [x] One canonical component issue is retained (#47); this version is meant as an authorized comment, never a body edit or a new issue. #227 (interaction) is cross-referenced, not reopened.

**Next step:** the owner answers Q1–Q7 and, if the recommendation stands, approves this version as a documentation outcome. Because no code is proposed, no implementation plan is required for v0.6 itself; the per-zone progress behaviour moves to the HomeTemplate contract, which needs its own spec and its own separately approved plan.

## Owner questions and recommendations

**Q1 — Accept that this gap closes as documentation, with no change to the Isotipo3D API?**
Evidence: the web's `pose` union is `'hero' | 'chapter' | 'lab' | 'outro'`, exactly the approved `scene` union (`README.md` props table; `types.ts`), and `progress` carries the same local curve; the approved `effect-scene` convention already means "a named pose family … evaluated at consumer-supplied local progress". The pose formulas match point by point. **Recommendation: accept.** The cataloged gap was a naming and documentation gap, not a missing capability; inventing a second prop (`pose`, `zone`, `variant="zone"`) would duplicate an approved input. If the owner prefers an explicit marker, the alternative is to keep the finding and add nothing — recorded here as the recommended outcome rather than a new surface.

**Q2 — Keep pose travel and blending (`mix: { a, b, t }` + anchor boxes) entirely in HomeTemplate?**
Evidence: the web blends two `poseOf` results and interpolates the logo between four anchor slots on one fixed canvas (`pulso-iso3d.mjs` `mix` path, `pulso-director.js` band logic), while v0.4 explicitly excludes slot travel/lookup, viewport-fixed canvases and anchor masks. A design-system instance owns one box. **Recommendation: yes, keep it in HomeTemplate.** The template can mount one instance per zone (each with its own `scene`/`progress`) or change `scene` on a single instance, accepting the approved snap. Only if the template cannot achieve the travel visually should a future amendment propose a blend input — and it would then need its own spec, appearance decision and fit-recompute rules.

**Q3 — Keep `size` and `fill` out, and let the host size the container?**
Evidence: the web exposes `size: 'default' | 'chapter' | 'lab'` (max-height `62 vh`/`58 vh`/`72 vh`) and `fill` (`aspect-ratio: auto`, full box), and drops the box to `min(34svh, 300px)` (`36svh` for Lab) below 860 px (`bundle.css:1013-1015,1030`). v0.4 excludes a `size`/`fill` API and gives container dimensions to the consumer. **Recommendation: keep the exclusion.** A size prop would put the page's responsive heights into the atom; recording the numbers here gives HomeTemplate what it needs without a new axis.

**Q4 — Keep the deliberate-fallback exclusion, so "chapter ships only the SVG at ≤ 760 px" is a host mount decision?**
Evidence: the web has `fallback: 'assembled' | 'exploded'` and forces the chapter's SVG (`opacity: 1`) in its mobile mode (`bundle.css:49`, `applyMobileZones()`); the design-system atom always shows its own assembled SVG until a canvas succeeds, and v0.4 excludes a fallback API. **Recommendation: keep the exclusion.** The host expresses the rule by not mounting the atom in that zone/breakpoint (or by composing the chapter's own static art), which is a template decision, not a component one. Adding a "show fallback on purpose" prop would reopen an approved exclusion for a single page rule.

**Q5 — Keep the name `scene` and no `pose` alias, documenting the mapping instead?**
Evidence: the web calls the same concept `pose`; the design system approved `scene` in v0.3 with the `effect-scene` convention and one registry usage. A `pose` alias would create two names for one input and a permanent dual API. **Recommendation: keep `scene`** and rely on the §1 mapping table (which the HomeTemplate spec will also cite).

**Q6 — Keep the approved defaults (`scene="hero"`, `progress=0`) instead of adopting the web's (`outro`, `1`)?**
Evidence: the web's defaults only make sense for its preview and its last zone; v0.4 fixed `hero`/`0` and explicitly excluded `defaultScene`/`defaultProgress`. Changing a default is a breaking promise change with no benefit, because a host driving zones always passes both values. **Recommendation: keep the approved defaults** and require the host to pass `scene` and `progress` explicitly, as the web director already does.

**Q7 — Record the per-zone progress formulas here as reference while HomeTemplate owns them normatively?**
Evidence: the four formulas, the 50 vh reading point, the 35 %/15 % bands, the reduced-motion nearest-zone rounding and the two mobile breakpoints exist only in the read-only web source; without them the future HomeTemplate spec would have to re-derive them from scratch, and the design system has no other copy. **Recommendation: yes** — keep them quoted in §1 as reference only, mark them explicitly non-normative for Isotipo3D, and let the HomeTemplate contract own them as its own approved input table (they are page choreography, which `effect-scene` explicitly avoids).
