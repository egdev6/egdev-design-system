<!-- Draft versioned comment for https://github.com/egdev6/egdev-design-system/issues/47. Prepared locally; NOT published. Publishing requires explicit add-comment authorization for this exact text plus an authorized GitHub session. -->

## Isotipo3D — v0.6 amendment draft: named zone poses as inputs, no API change

**Draft — not ready for implementation.** Two owner choices (Q1 and Q2 below) and GitHub-visible image accessibility are still open. Nothing here is implemented, and this comment does not reapprove the approved base contract.

- **Version / status:** `0.6` — Draft amendment over the approved base: full **v0.3** runtime contract (`990682be…`, [approval](https://github.com/egdev6/egdev-design-system/issues/47#issuecomment-6251414388)), v0.4 [preparation notes](https://github.com/egdev6/egdev-design-system/blob/main/docs/components/isotipo3d/v0.4/contract-recovery.md) and [appended web catalog note](https://github.com/egdev6/egdev-design-system/blob/main/docs/components/isotipo3d/v0.4/web-catalog-note.md), v0.5 interaction accepted in [#227](https://github.com/egdev6/egdev-design-system/issues/227#issuecomment-6559939579).
- **Reason:** the web-catalog layer (b) closes the cataloged Isotipo3D variant gap "named zone poses (hero/chapter/lab/outro) as inputs, without choreography" (`docs/components/web-catalog/v0.1/cataloging-draft.md` §3, owner-approved 2026-11-02, tracking `odd/tasks/web-catalog.md` B6).
- **Outcome in one line:** the gap is **already closed by the approved API**. `scene` is the web's zone pose and `progress` is its local progress; this version adds documentation, captures and a responsibility split, and **proposes no prop, type, export, marker, token, dependency or story change**.
- **contentSHA256:** `9c592a3cd8dcd31096f3085932a3683ebc3cce970b6463fcd679e8093dd57e8c` — SHA-256 of the UTF-8 canonical spec payload from its `## 1. Purpose and scope` heading through EOF, LF line endings, final newline included, tracking metadata excluded.
- **Spec copy in this repository:** `docs/components/isotipo3d/v0.6/spec.md` (whole-file `sha256:8613cd820586a52ab2881d06912ccd986cf174008bc769da442d0b70d9d84a6f`). This comment is intentionally not self-hashed; the payload digest above is the authoritative identity.
- **visualHashes:** `VIS-04 → sha256:be95e6a50e135c64ff4dc3dd65ced5d25e2566c6fdbe4cdfaf5de851d1995dc5`; `VIS-05 → sha256:f0bb3c83624ec0e96ef593a90943bfe1789606574c5a063915d24ab4c03b8c80`; `VIS-06 → sha256:cd2f4cc0306c47c35d9a495caaaefe51e4797d60d44785a3a46668c6fdc43cbf`; `VIS-07 → sha256:c7aaf797980bdb9ee73a0b609f6a629f3c97b029e27ef9002d5f510a9711fb21`; `VIS-08 → sha256:14b937a95cedc2d839203fce8f855b58825576c157afcd0cbb4cb8f1ab492634`. Reused approved v0.3 references: `VIS-01 48a0c0c4…`, `VIS-02 ce33c7d9…`, `VIS-03 cb241298…` (unchanged bytes, original conditions).
- **approvalReference:** Pending — no human approval of this version, digest or visuals is recorded.
- **canonicalIssue:** https://github.com/egdev6/egdev-design-system/issues/47
- **latestPublishedComment:** Pending — this comment is unpublished; the field may only change after an authorized write and a matching readback. The latest comment published on this issue before it is [#issuecomment-6559828309](https://github.com/egdev6/egdev-design-system/issues/47#issuecomment-6559828309) (2026-11-01 visual-review acceptance), which carries no contract snapshot.
- **previousSnapshot:** [#issuecomment-6251412989](https://github.com/egdev6/egdev-design-system/issues/47#issuecomment-6251412989) — the full v0.3 amendment, approved in [#issuecomment-6251414388](https://github.com/egdev6/egdev-design-system/issues/47#issuecomment-6251414388). Comments published since then and read via `gh issue view 47`: `6522801270` (ODD preparation, no contract change) and `6559828309` (acceptance note). The v0.4 and v0.5 documents were never published as comments; v0.5 was accepted for the shipped interaction in #227.

### Why this is documentation and not a new prop

The web component documents exactly two isotype inputs, and the design-system atom already has both:

| Web `design-system/components/Isotipo3D/README.md` | Design system `packages/effects/src/atoms/isotipo3d/types.ts` |
| --- | --- |
| `pose: 'hero' \| 'chapter' \| 'lab' \| 'outro'` (default `'outro'`) | `scene?: 'hero' \| 'chapter' \| 'lab' \| 'outro'` (default `'hero'`) |
| `progress: number` (default `1`, "En la página lo calcula el director") | `progress?: number` (default `0`, finite clamp `[0, 1]`) |
| `fallback`, `size`, `fill`, `threeUrl`, `ariaLabel` | not exposed (v0.4 exclusions; `ariaLabel`'s intent is covered by the v0.5 `interactive` + `label`) |

The pose port is already faithful: both trees use `hero h = smooth(0, 0.4, p)`, `chapter p`, `lab smooth(0.06, 0.42, p) × (1 − smooth(0.7, 0.96, p))` and `outro q = smooth(0.2, 0.85, p)`, with the same `az`/`el`/`fov`/`ex`/`halo` terms and the same reduced-motion fixed poses. The approved `effect-scene` convention already means "a named pose family of a decorative effect, optionally evaluated at consumer-supplied local progress", with page choreography explicitly under *avoid*. A second prop (`pose`, `zone`, `variant="zone"`) would duplicate an approved input.

### What moves to HomeTemplate (not this component)

Read from the read-only web source and recorded in the spec as HomeTemplate's responsibility:

- **Per-zone progress**: `p.hero = clamp01(scrollY / hero.h)`, `p.chapter = clamp01((scrollY + vh − chapter.top) / (chapter.h + vh))`, `p.lab = sticky ? clamp01((scrollY − lab.top) / (lab.h − vh)) : clamp01((scrollY + 0.6vh − lab.top) / lab.h)`, `p.outro = clamp01((scrollY + vh − outro.top) / outro.h)` (`pulso-director.js`, `compute()`).
- **Band choreography**: reading point `R = scrollY + 50 vh`, blend band = last 35 % of the outgoing zone plus first 15 % of the incoming one (minimum 0.75 vh), layer rule between the 3D and ambient layers, nearest-zone rounding under reduced motion.
- **Pose travel**: `mix: { a, b, t }` plus interpolation of the anchor box between `#slot-hero`, `#slot-cap`, `#slot-lab`, `#slot-outro` (`pulso-iso3d.mjs`), on one viewport-fixed canvas with a masked box.
- **Mobile**: at `≤ 760 px` the chapter keeps only the SVG; at `≤ 860 px` the box becomes `min(34svh, 300px)` and Lab `36svh` (`bundle.css:49,1030`).
- **Sizing**: the web's `62 vh`/`58 vh`/`72 vh` maxima stay consumer container decisions, as v0.4 already states.

`reference-web/pulso-source.html` corroborates the vocabulary: twelve `data-zone` regions, four anchor slots, and 3D only in hero, chapter, lab and outro — the other eight zones switch the 3D layer off, which a consumer does with `opacity` or by not mounting the atom.

### Compatibility impact

**None.** No prop is added, removed, renamed, retyped or re-defaulted; exports stay `Isotipo3D`, `Isotipo3DProps`, `IsotipoPoseChange`; the root marker `eg-isotipo-3d`, the owned `data-state` values, the six meaningful files plus the private `isotipoScene.ts` and **No stylesheet** are unchanged; no story is added because `Hero`, `Chapter`, `Lab` and `Outro` already exist. No token, dependency, Material recipe or geometry exception is touched.

### Prop-naming registry

All relevant entries are already approved and already carry an `Isotipo3D` usage at the **current** `types.ts` revision `sha256:0099ebba…`: [`effect-scene`](https://github.com/egdev6/egdev-design-system/blob/main/skills/_shared/prop-naming.json) (`scene`), [`effect-progress`](https://github.com/egdev6/egdev-design-system/blob/main/skills/_shared/prop-naming.json) (`progress`), [`layer-opacity`](https://github.com/egdev6/egdev-design-system/blob/main/skills/_shared/prop-naming.json) (`opacity`), [`pointer-tilt`](https://github.com/egdev6/egdev-design-system/blob/main/skills/_shared/prop-naming.json) (`pointerTilt`), [`interaction-drag-rotate`](https://github.com/egdev6/egdev-design-system/blob/main/skills/_shared/prop-naming.json) (`dragRotate`), [`interaction-flip-gesture`](https://github.com/egdev6/egdev-design-system/blob/main/skills/_shared/prop-naming.json) (`flip`), [`interaction-interactive-mode`](https://github.com/egdev6/egdev-design-system/blob/main/skills/_shared/prop-naming.json) (`interactive`), [`accessible-name`](https://github.com/egdev6/egdev-design-system/blob/main/skills/_shared/prop-naming.json) (`label`), [`interaction-pose-change`](https://github.com/egdev6/egdev-design-system/blob/main/skills/_shared/prop-naming.json) (`onPoseChange`), and [`animation-paused`](https://github.com/egdev6/egdev-design-system/blob/main/skills/_shared/prop-naming.json) with the Isotipo3D-only exception `exception:animation-paused:Isotipo3D:paused` ([receipt](https://github.com/egdev6/egdev-design-system/blob/main/docs/decisions/prop-naming-isotipo3d-interaction-approval.json)).

**No new convention, no new exception, no registry edit and no `pnpm props:*` run is requested.** The recorded usage revision equals the current file hash, so nothing is stale. Convention approval stays separate from this spec and is not inferred from it.

### Recoverable full snapshot

This comment is a delta. The full v0.6 snapshot is recovered without inference as: (1) the approved v0.3 canonical payload — already reconstructed and verified in [`docs/components/isotipo3d/v0.4/contract-recovery.md`](https://github.com/egdev6/egdev-design-system/blob/main/docs/components/isotipo3d/v0.4/contract-recovery.md) (canonical `990682be…`, all seven blocks and AC-01–AC-20), (2) the appended v0.4 web catalog note, (3) the accepted v0.5 interaction amendment, and (4) this version's "no change" statements, responsibility split and owner questions in [`docs/components/isotipo3d/v0.6/spec.md`](https://github.com/egdev6/egdev-design-system/blob/main/docs/components/isotipo3d/v0.6/spec.md), retained byte-exactly at the whole-file hash above. Nothing in the approved text is rewritten and this comment requests no body edit.

### Visual references (Proposed, not adopted)

Five real Chromium captures of the **web** `design-system/components/Isotipo3D/preview.html`, rendered read-only for this task; full conditions, selectors, states and source hashes in [`docs/components/isotipo3d/v0.6/capture.json`](https://github.com/egdev6/egdev-design-system/blob/main/docs/components/isotipo3d/v0.6/capture.json).

| ID | Local image | Scenario | SHA-256 |
| --- | --- | --- | --- |
| VIS-04 | `docs/components/isotipo3d/v0.6/zone-poses--inputs-controls--1280x900--dark.png` | The web's only two isotype inputs: four pose chips (Cierre, Lab, Hero, Capítulo) + progress slider at 0.50 | `be95e6a50e135c64ff4dc3dd65ced5d25e2566c6fdbe4cdfaf5de851d1995dc5` |
| VIS-05 | `docs/components/isotipo3d/v0.6/chapter--pose-progress-1--1280x900--dark.png` | `pose=chapter`, `progress=1` | `f0bb3c83624ec0e96ef593a90943bfe1789606574c5a063915d24ab4c03b8c80` |
| VIS-06 | `docs/components/isotipo3d/v0.6/outro--pose-progress-0--1280x900--dark.png` | `pose=outro`, `progress=0`; separated pieces clipped by the stage, as expected | `cd2f4cc0306c47c35d9a495caaaefe51e4797d60d44785a3a46668c6fdc43cbf` |
| VIS-07 | `docs/components/isotipo3d/v0.6/hero--pose-progress-0.5--1280x900--dark.png` | `pose=hero`, `progress=0.5` (supplementary to VIS-01) | `c7aaf797980bdb9ee73a0b609f6a629f3c97b029e27ef9002d5f510a9711fb21` |
| VIS-08 | `docs/components/isotipo3d/v0.6/board--pose-controls-and-fallbacks--1280x900--dark.png` | Whole board at `outro`/1 with both SVG fallbacks, including the web-only exploded fallback | `14b937a95cedc2d839203fce8f855b58825576c157afcd0cbb4cb8f1ab492634` |

Reused approved references (unchanged bytes, original v0.3 conditions): `VIS-01` hero at progress 1, `VIS-02` Lab at 0.5, `VIS-03` source fallback geometry/palette only.

Conditions: viewport 1280×900, DPR 1, Chromium headless shell 153.0.8010.12 on Linux via playwright-core 1.60.0 with SwiftShader WebGL, dark colour scheme, `prefers-reduced-motion: no-preference`, `lang="es"`, `data-theme="dark"`; the preview fragment was mounted unmodified in a `/tmp` harness with the authored `tokens.css` and `bundle.css` and its original Google Fonts links; `three@0.160.0` imported from its original jsDelivr URL (HTTP 200, no failed requests, WebGL active); element crops taken 1400 ms after each pose/progress change, 2026-11-02.

This version proposes **no appearance change**, so these images are the observed web baseline and nothing more: no expected-design adoption is requested, pixel values are never treated as tokens, and design-system visual conformity stays **Not evaluated**.

**Image accessibility: Pending.** Local PNGs are not GitHub-visible. Publishing needs a human attachment of the exact bytes with the returned URL, or a separately authorized asset-publication route; each URL would then be verified against these hashes before any link appears here.

### Acceptance criteria (planned, none executed)

`I3D6-01` the four pose curves equal the web's `poseOf` values (pinned by the existing 18-point pose ledger; not re-run here) · `I3D6-02` no API/type/export/marker/story change (observed: only `docs/components/isotipo3d/v0.6/**` added) · `I3D6-03` every web input mapped or recorded as an excluded divergence with a reason · `I3D6-04` the quoted per-zone progress formulas and mobile rules match the director and stylesheet · `I3D6-05` no naming change needed and the registry usage revision is current (`sha256:0099ebba…` on both sides) · `I3D6-06` capture and source hashes recomputed · `I3D6-07` the header digest matches the payload · `I3D6-08` no appearance, token or geometry exception introduced · `I3D6-09` a consumer can select a pose and feed progress without the page model. Full table with methods in `spec.md` §7.

No test-first cycle applies to this version: the task is spec-only, `docs/components/isotipo3d/**` is the only writable surface, and no behaviour changes.

### Open choices that block readiness

1. **Q1 — accept that the zone-pose gap closes as documentation, with no API change?** Recommended: yes. The approved `scene` + `progress` already are the web's two inputs and the `effect-scene` convention describes exactly this use.
2. **Q2 — keep pose travel/blending (`mix` + anchor slots) wholly in HomeTemplate, with `scene` changes snapping?** Recommended: yes; only a template limitation would justify a future blend input, which would need its own spec and fit rules.
3. **Q3 — keep `size`/`fill` out and let the host size the container** (`62/58/72 vh`, `min(34svh, 300px)` at ≤ 860 px)? Recommended: yes.
4. **Q4 — keep the deliberate-fallback exclusion**, expressing "chapter ships only the SVG at ≤ 760 px" as a host mount decision? Recommended: yes.
5. **Q5 — keep the name `scene` and no `pose` alias**, documenting the mapping? Recommended: yes.
6. **Q6 — keep the approved defaults (`hero`, `0`)** and require the host to pass both values, instead of adopting the web's `outro`/`1`? Recommended: yes.
7. **Q7 — record the per-zone progress formulas here as reference** while the HomeTemplate contract owns them normatively? Recommended: yes.

### Publication and authority boundary

This comment is prepared only. It authorizes no implementation, no implementation plan, no code, no token or dependency change, no registry edit, no commit/push, no issue body edit, no label or state change and no new issue. Posting requires explicit add-comment authorization for exact issue `#47` on `egdev6/egdev-design-system`, plus a recoverable authorization for GitHub access; after a single authorized write, read back the comment, record its URL and reconcile `latestPublishedComment` before citing it anywhere.
