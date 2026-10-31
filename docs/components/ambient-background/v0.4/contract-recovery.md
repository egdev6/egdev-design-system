# AmbientBackground — effective approved contract recovery

- **Status:** Recovery of approved v0.4, not a new contract or implementation receipt. [Plan](implementation-plan.md), [port map](engine-port-map.md), [capture request](capture-request.json) are preparation artifacts; runtime is **not implementation-ready**.
- **Authority:** [v0.2 issue body](https://github.com/egdev6/egdev-design-system/issues/45) → [v0.3 file-role amendment](https://github.com/egdev6/egdev-design-system/issues/45#issuecomment-6241399324) → [contract approval](https://github.com/egdev6/egdev-design-system/issues/45#issuecomment-6241414979) → [v0.4 adopted visuals/naming](https://github.com/egdev6/egdev-design-system/issues/45#issuecomment-6241536173). The initial Draft header and stylesheet blocker are historical, not current readiness findings.
- **Classification:** [Published taxonomy-only v0.5](https://github.com/egdev6/egdev-design-system/issues/45#issuecomment-6244220481) records approved organism → **atom (effect)**. Its local/unpublished wording is historical inside a published comment. It grants no full-v0.5 or implementation-plan approval. The v0.4 payload below retains its historical organism sentence for exact recovery; apply only the separately approved taxonomy delta when planning placement.
- **Preparation:** [ODD assignment](https://github.com/egdev6/egdev-design-system/issues/45#issuecomment-6522800380), parent-supplied current ownership/readback. This writer performed no fresh GitHub operation.
- **Recovery input:** supplied `/tmp/egdev-remaining-odd/45.json`, whole-file SHA-256 `fe908cbf4d8882a4639bbf87239fd989067e58a992cfff64b9936335ab975d07`. The input includes the body and all four historical comments; the subsequent ODD assignment is supplied separately by the parent.
- **Decoded UTF-8 source hashes:** body `06defa2700ba3e5fdbd0f28915f5f9bf6b448f6bb0b158923525845884941ef8`; comment 6241399324 `86097be151002c02e885fe9d548425d7b3f523062075b8861db0e7457e571f77`; approval 6241414979 `7d927b3d8851d1b7f40e7678ec8fc148b9a408ca9dda4829f81b4f9786f7576f`; closure 6241536173 `c8fe15d4b9b22f146eb53f2598f1b35570dd1922087a126f5a1d31e564ea1f28`; taxonomy 6244220481 `4ff2c6c0dfe00a1c782b5b3ced20f682913ac0cb035d93b88208d5705a48da5d`.
- **contentSHA256:** sha256:fde20d0e5e5ff5ff541a21360b42dfacded1f0855babfd96b7e5691c994ed703
- **Hash definition:** UTF-8 SHA-256 beginning at the actual whole-line heading matched by multiline `^## 1\. Purpose and scope$` through EOF, retaining LF and final LF. Inline mentions of headings and all metadata above are excluded. This is a locally recovered serialization, not a newly owner-approved digest or native receipt. It integrates v0.3 file roles/AC-12 and v0.4 visual/naming closure; the taxonomy comment's full recovery independently cross-checks the same pre-taxonomy payload.
- **Naming recovery:** current registry has approved `effect-profile → profile` (`sha256:293194eade9734f78ff66b5f2174df11e8984d0dc312fa5d0d6eb924c3d694b6`) and `layer-opacity → opacity` (`sha256:02d11f63a0d25c145b57398f0db20b29f0b2e1199ae00205410224951880814c`), both with empty usages. [Approval record](../../../decisions/prop-naming-ambient-background-approval.json), [registry](../../../../skills/_shared/prop-naming.json), [reference](../../../prop-naming.md). Aliases/exceptions remain empty; no reapproval or migration is proposed. Future `AmbientBackgroundProps` source evidence is Pending because no source exists.
- **Visual recovery:** local [v0.3 metadata](../v0.3/capture.json) SHA-256 `180936afbd2c81bf0a47dc4b576b12a6126e72bd66f02fd6cad8c36e2c3659d3`; all three local PNG byte hashes match the adopted v0.4 record below. These are approved reference-engine captures, not React/runtime parity; no recapture, visual inspection or fresh remote-access claim. Do not reopen adoption. Missing new runtime evidence is a future verification task, not missing source-design approval.
- **Current gap:** effects exports nothing and has placeholder build/typecheck scripts. Its manifest has neither CVA nor cn utility dependencies. The former zero-dependency-change assumption is disproven; permission to document [options A/B](implementation-plan.md) approves neither. Isotipo's three/@types permission does not apply. No tokens need changing.

## 1. Purpose and scope

- **Need:** decorative particle layer for the website, a faithful React port of the Particle Studio engine in `packages/effects/reference/particle-streaks.js`, keeping its exact configuration except the per-profile multipliers.
- **Non-goals:** scroll choreography, zones, blend bands and the 3D/background exclusion rule from `reference/pulso-director.js` — they belong to HomeTemplate (web). No time-based interpolation between profiles. No interactive content.
- **Cataloging:** new; organism (effect) in `@egdev/effects`, per `docs/CATALOGO.md`. Nothing in `@egdev/ui` provides a canvas effect layer; no Radix primitive applies.

## 2. Anatomy and composition

| Part | Responsibility | Native element | Allowed content |
| --- | --- | --- | --- |
| Root | Fill its container, own `data-state`, expose the opacity custom property | `div`, `aria-hidden="true"` | Canvas only; no children |
| Canvas | Engine drawing surface | `canvas` | None |

- **Radix / composition:** none applicable.
- **Public markers:** stable root class `eg-ambient-background`.

## 3. Public API

| Prop | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `profile` | `'base' \| 'read' \| 'live'` | no | `'base'` | Engine multipliers: base 70 lines / 90 squares / speed 1 / glow 0.1; read 20 / 25 / 0.6 / 0.1; live 110 / 120 / 1.4 / 0.18. Changes apply immediately. |
| `opacity` | `number` | no | `1`; clamped to [0, 1]; non-finite → 0 | Layer opacity. At 0 the animation loop stops. |
| `className` | `string` | no | none | Consumer layout only; not an appearance override. |

- **Prop conventions (Approved):** `effect-profile` → `profile`; `layer-opacity` → `opacity`. Registry: [prop-naming.json](https://github.com/egdev6/egdev-design-system/blob/0c477f97ce9ddff82f0c41f5c04143498d1ea990/skills/_shared/prop-naming.json); approval record: [prop-naming-ambient-background-approval.json](https://github.com/egdev6/egdev-design-system/blob/0c477f97ce9ddff82f0c41f5c04143498d1ea990/docs/decisions/prop-naming-ambient-background-approval.json). Usages are added with reviewed source evidence at implementation.
- **Native props / refs:** `div` attributes except `children`; ref targets the root `HTMLDivElement`.
- **Controlled / uncontrolled:** Not applicable (no user interaction).
- **Compatibility:** new export from `@egdev/effects`; no existing consumers.

## 4. Behavior

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| Mounted, opacity > 0, document visible, no reduced motion | Animation loop runs; `data-state="running"` | none |
| `profile` changes | New counts/speed/glow applied on the next frame; particles added or removed, not reset | none |
| `opacity` becomes 0 | Loop stops; `data-state="stopped"` | none |
| Document hidden / visible again | Loop stops / resumes | none |
| `prefers-reduced-motion: reduce` (including live change) | No loop; one frame rendered; re-rendered on profile, opacity or size change; `data-state="static"` | none |
| Container resized | Canvas resized (device pixel ratio capped at 2), particles reinitialized | none |
| Canvas width < 700px | Line and square counts multiplied by 0.6 and rounded | none |
| 2D context unavailable | No exception; root shows the ambient background color | none |
| Unmounted | Animation frame cancelled; observers and listeners removed | none |

- **Limits / consumer responsibilities:** the consumer positions the container (e.g. fixed full viewport) and drives `opacity` and `profile`; `@egdev/tokens` CSS must be loaded.

## 5. Accessibility

- Decorative: root `aria-hidden="true"`, not focusable, `pointer-events: none`, no announcements.
- Reduced motion handled by the component (static frame).
- Forced colors: canvas hidden (proposed), since canvas content ignores system colors.

## 6. Appearance

| Variant axis | Allowed values | Default | Restrictions |
| --- | --- | --- | --- |
| profile | base, read, live | base | Engine parameters only, not CSS variants |

- **Tokens:** colors read at mount via `getComputedStyle` from existing `--color-ambient-bg`, `-glow`, `-line`, `-line-glow`, `-square`, `-square-glow`. `squareBorderColor` is removed (zero border width, no effect). Engine numeric constants (speeds, sizes, glow opacities) are Particle Studio configuration, not design tokens.
- **Approved limited exception:** opacity uses the static utility `opacity-[var(--eg-ambient-opacity)]` plus an inline numeric `--eg-ambient-opacity` custom property, mirroring the Gauge geometry exception. No other inline appearance.
- **Class composition:** root `absolute inset-0` (fills container) via CVA in `types.ts` and `cn()`; consumer `className` merges for layout only.
- **Files:** six mandatory files plus one spec-named internal module, and no stylesheet:
  - `types.ts`, `useAmbientBackground.ts`, `AmbientBackground.tsx`, `AmbientBackground.test.tsx`, `AmbientBackground.stories.tsx`, `index.ts`
  - `particleStreaks.ts` — internal, not exported: faithful port of `packages/effects/reference/particle-streaks.js` (configuration, sprites, particle lifecycle, `set` / `start` / `stop` / `renderOnce`). No JSX, CVA or React state.
  - **No stylesheet:** every root and canvas style is expressed with token-backed utilities.

### Expected-design visual reference (Approved)

Captured with Playwright MCP from the unmodified reference engine, Chromium 148, 1280x720, DPR 1, running 3 s, full viewport = component zone. Metadata: [capture.json](https://github.com/egdev6/egdev-design-system/blob/0c477f97ce9ddff82f0c41f5c04143498d1ea990/docs/components/ambient-background/v0.3/capture.json). Hashes verified against the downloaded files at commit `0c477f9`.

| Visual ID | Scenario | Image |
| --- | --- | --- |
| VIS-01 | profile `base` | ![Dark red-black background with diagonal glowing red streaks and scattered red diamonds of varied size and brightness, with a soft central red glow.](https://raw.githubusercontent.com/egdev6/egdev-design-system/0c477f97ce9ddff82f0c41f5c04143498d1ea990/docs/components/ambient-background/v0.3/base--running--1280--dark.png) |
| VIS-02 | profile `read` | ![Mostly empty dark red-black background with a few diagonal red streaks and sparse red diamonds.](https://raw.githubusercontent.com/egdev6/egdev-design-system/0c477f97ce9ddff82f0c41f5c04143498d1ea990/docs/components/ambient-background/v0.3/read--running--1280--dark.png) |
| VIS-03 | profile `live` | ![Dense dark red background with many diagonal glowing red streaks, numerous red diamonds and a brighter central glow.](https://raw.githubusercontent.com/egdev6/egdev-design-system/0c477f97ce9ddff82f0c41f5c04143498d1ea990/docs/components/ambient-background/v0.3/live--running--1280--dark.png) |

Normative: density, palette, glow and streak angle per profile. Particle positions are random and not normative.

## 7. Acceptance criteria

| ID | Observable promise | Planned test / method | Planned story / visual | Evidence |
| --- | --- | --- | --- | --- |
| AC-01 | Each profile applies its exact multipliers | Unit test on engine config | Story per profile | Pending |
| AC-02 | Default profile is base | Unit test | Default story | Pending |
| AC-03 | Profile change applies without reinitializing particles | Unit test | — | Pending |
| AC-04 | Opacity clamps to [0, 1], non-finite → 0, 0 stops the loop | Unit test (`data-state`, rAF mock) | Opacity control story | Pending |
| AC-05 | Reduced motion renders one frame, no loop | Unit test (matchMedia mock) | Reduced-motion story | Pending |
| AC-06 | Hidden document stops; visible resumes | Unit test | Not applicable | Pending |
| AC-07 | Width < 700px scales counts by 0.6 | Unit test (ResizeObserver mock) | Narrow container story | Pending |
| AC-08 | Unmount cleans rAF, observers, listeners | Unit test | Not applicable | Pending |
| AC-09 | Missing 2D context does not throw | Unit test | Not applicable | Pending |
| AC-10 | Root has `eg-ambient-background` and `aria-hidden="true"` | Unit test | Not applicable | Pending |
| AC-11 | Opacity exposed only through `--eg-ambient-opacity` | Unit test | — | Pending |
| AC-12 | `particleStreaks.ts` is not exported from `index.ts` or the package root | Package export check | Not applicable | Pending |

**Next step:** propose the implementation plan for separate approval. Implementation starts only after all planned component issues exist. This spec authorizes no code, token or dependency changes.
