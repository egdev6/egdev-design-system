# Isotipo3D — approved v0.3 recovery and v0.4 preparation notes

- **Status:** v0.4 preparation Draft only. The full runtime contract is **Approved v0.3**, atom/effect in `@egdev/effects`; old Draft/organism headers do not reopen it.
- **Authority:** [Full amendment](https://github.com/egdev6/egdev-design-system/issues/47#issuecomment-6251412989), [final full approval](https://github.com/egdev6/egdev-design-system/issues/47#issuecomment-6251414388), [current ODD preparation](https://github.com/egdev6/egdev-design-system/issues/47#issuecomment-6522801270). Approval is assistant-recorded direct human authority, not a native/signed/independent receipt or runtime evidence.
- **Snapshot identity:** `version: 0.4`; `contentSHA256: sha256:2d39fdd3b4c17b87abb66400fa8de7e39cfb5a8cd3c45ca161f25a70de8042a6`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/47`; `latestPublishedComment: Pending — v0.4 unpublished`; `approvalReference: Pending — new plan only`. Approved historical visual hashes remain below; no new image is created.
- **Hash rule:** UTF-8 LF bytes from the actual whole-line `## 1. Purpose and scope` heading through EOF, including final LF; metadata above excluded. Never anchor on its earlier inline mention. This preparation identity does not replace the approved v0.3 digest.
- **Full recovery:** Read supplied `/tmp/egdev-remaining-odd/47.json` initial body and all three historical comments, including the entire 323-line full amendment (decoded in bounded chunks because its JSON line exceeded the read tool limit). Initial body SHA-256 `a9fc494dbf0e3221fdb81454a5de91007382f275f778a5b20dc0cc89490665b2`; full amendment whole-body SHA-256 `ec6f8ac43f559f75daa5e90756d5a77a950039c45fb01edd3864a8990aecaa81`; approval whole-body SHA-256 `c348773990ffbacbb52167e4cd7d6bbbede741b58a9cdd870add76bbc1d78b30`. The unique anchored full-amendment payload matches **`990682be7ad0bddfcbbf88f44b53d87769edcbc1cfdd10541af6ebc75028a09a`**, all seven blocks and AC-01–AC-20. No reconstruction from stale v0.1 wording or memory.
- **New permission, not a contract change:** Parent relays owner authorization for required exact peer `three@0.160.0`, its dev/test provisioning, `@types/three@0.160.0` development typing and effects manifest/build/lock/install work. Parent alone installs after exact runtime-plan approval. This permission does not authorize CVA/UI/clsx/tailwind-merge edges. Those alternatives and the exact parent integration request are in [dependency-build-plan.md](dependency-build-plan.md); they do not block writing this plan.

## 1. Purpose and scope

One decorative, container-local extruded EGDEV mark: seven clipped source faces, depth/materials/lights, four pose families, Lab explosion/debris, mount intro, restrained idle motion and halo. Retain approved atom classification; no Radix primitive for passive WebGL. Current source has no effects component exports; reference scene is a port input, not existing runtime API.

**Explicit exclusions:** no HomeTemplate, director/`window.PULSO`, slot travel/lookup, viewport-fixed canvas, anchor masks, scroll parallax/choreography, ambient coordination/exclusion zones, satellites, informative logo semantics, control behavior or legacy alias migration. Current UI Logo availability does not make its interactive/native API or private artwork import an effects dependency requirement.

Baseline `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`; reviewed source identities:

| Path / observation | Whole-file SHA-256 |
| --- | --- |
| `packages/effects/reference/pulso-iso3d.mjs` — all scene/source code read | `394bbf719bc3e1b5855e63a37ceee55ee5069065c659c953528ed3c13a7e34c8` |
| `packages/effects/package.json` — src entry; placeholder build/typecheck; tokens/React peers only | `61fb3d4575f4a6770b3045bce5368557b852c544d9786deb3537257bd0e22e20` |
| `packages/effects/src/index.ts` — export {} | `d4f463629e5bbe7565524dafc96cd295195962dca17172051f7a9731d33f6fae` |
| `packages/effects/README.md` — reference-only historical status | `c2a75293bc4041d046dce72010394d6ca13436cd731e748d7ae5d3dbea9d15a3` |
| `packages/ui/src/lib/cn.ts` — real exported utility implementation | `74220d183bbca5febc12bd56e70c8c07690d02ec8ff8f771a77072d62a90771f` |
| `packages/ui/src/atoms/logo/logo-artwork.ts` — existing seven original assembled polygons, read-only geometry cross-check | `c55852ddb10bad93f931640d9c9ed9438bc9a9e09f55081dd63405ab52c4281c` |

No effects build config, utility dependency, stylesheet delivery or future implementation hash is pretended to exist. Read-only [UI library build](../../../../packages/ui/vite.config.ts), [separate CSS build](../../../../packages/ui/vite.styles.config.ts), root TS/Vitest/Storybook and package harness inspection provide conventions, not new permission.

## 2. Anatomy and composition

| Part | Native element | Retained responsibility |
| --- | --- | --- |
| Root | div, public HTMLDivElement ref | Fill/clip consumer-sized box; `eg-isotipo-3d`, owned data-state/aria-hidden/opacity |
| Canvas | canvas, aria-hidden true | Transparent instance-local GPU surface, no consumer content/focus |
| Fallback | Inline svg, aria-hidden true, focusable false | Same stationary assembled seven original polygons from SSR onward; no accessible title/desc/role/name |

Fallback uses approved padded viewBox `-20 -20 678.45 652.37`, preserveAspectRatio xMidYMid meet. Original assembled SVG coordinates are distinct from the already-clipped extrusion POLYS; do not substitute the 3D array or redraw the mark. Existing Logo artwork is source evidence only, not permission to import its private module or render Logo as fallback. Fallback has no source glow/float/intro, and is not exploded in Lab. No children/slots/asChild/portal/external canvas or engine ref/API. Root marker remains `eg-isotipo-3d`; do not attach legacy `eg-iso3d`, part markers or `.is-gl-on` aliases. Preserve legacy styles/consumers unchanged.

Six meaningful files plus exactly one named private module are retained: types.ts, useIsotipo3D.ts, Isotipo3D.tsx, Isotipo3D.test.tsx, Isotipo3D.stories.tsx, index.ts, and private isotipoScene.ts. **No stylesheet.** New physical atom folder is proposed in the separately reviewed plan, not retroactively inserted into the frozen contract.

## 3. Public API

| Own prop | Type | Constant default / normalization |
| --- | --- | --- |
| scene | `'hero' \| 'chapter' \| 'lab' \| 'outro'` | hero; unknown runtime value→hero |
| progress | number | 0; finite clamp [0,1], NaN/±Infinity/non-number→0 |
| opacity | number | 1; finite clamp [0,1], non-finite/non-number→0 |
| pointerTilt | boolean | true; omitted/undefined defaults true, otherwise only literal true enables |

Root className is inherited layout-only string; optional ref targets the actual HTMLDivElement with React18-compatible forwarding. No own events, defaultScene/defaultProgress, pose/size/fill/fallback/loader/threeUrl/lifecycle callbacks/ariaLabel API. Omitted/undefined values use constants, not a new null API. Public root export proposal is Isotipo3D plus Isotipo3DProps; no engine/CVA/helper exports.

**Exact native restriction:** safe div inheritance omits collisions plus children, dangerouslySetInnerHTML, style, role, tabIndex, contentEditable, autoFocus, aria-hidden and owned data-state. Runtime filtering must enforce the same exclusions and prevent arbitrary data-state keys from overriding owned state. Preserve native hidden/id/title/lang/dir, other data-* and nonconflicting aria-* on root only. Hidden suppresses work. Native handlers may forward without replacing internal subscriptions or creating an interaction promise. Owned marker/aria-hidden/state/nonfocusability/opacity property win over rest. No data-testid API, ID styling or generated IDs. Callback/object refs receive root then null, including Strict Mode.

**Naming:** Reviewed [registry](../../../../skills/_shared/prop-naming.json), [generated reference](../../../prop-naming.md), [scoped receipt](../../../decisions/prop-naming-isotipo3d-approval.json): scene→effect-scene, progress→effect-progress, pointerTilt→pointer-tilt, opacity→layer-opacity. All are already approved; no aliases/exceptions/new conventions or migrations. Naming is not implementation approval. Current entries have no fabricated Isotipo3DProps source usages; future usage evidence must bind the actual new file/symbol/whole-file hash.

**Required peer boundary:** exact three 0.160.0 is now separately authorized, not a Draft dependency blocker. Use bare dynamic import('three') only on eligible client initialization, never module evaluation/SSR/render/CDN. Supported package/consumer builds provision the required peer; absent-peer bundling is unsupported and cannot be rescued by runtime fallback. Catch supported chunk rejection/runtime failures, not arbitrary missing-package build errors. No optional-peer/range/@vite-ignore/nonanalyzable import trick.

## 4. Behavior

Owned state precedence is **failure→fallback > suspended→stopped > engine/first-frame pending→loading > reduced-motion→static > running**. Suspension means document hidden OR native hidden OR normalized opacity exactly zero OR root width/height≤0. Failure stays terminal per mount even while hidden/transparent; opacity/native hidden still affect actual paint. Defer initialization while suspended; SSR/first hydration are deterministic loading + assembled SVG without browser work. Stop retains last good canvas, or fallback before first success; no opaque fallback overlay on a paused successful frame. Canvas becomes selected only after a successful first render; no crossfade. Resume uses latest input and a reset elapsed-time baseline, no hidden-time catch-up. Prop changes/context restoration do not retry failed mounts; deliberate React remount may retry.

Let p be normalized progress, L(a,b,t)=a+(b−a)t, S(a,b,p)=t²(3−2t) for clamped t=(p−a)/(b−a), and E=ex²(3−2ex):

| Scene | azimuth / elevation / FOV | ex / halo |
| --- | --- | --- |
| hero | L(-16,45,S(0,.4,p)) / L(7,35.264,S(0,.4,p)) / L(24,12,S(0,.4,p)) | 0 / .3 |
| chapter | L(33,57,p) / 35.264 / 10 | 0 / .2 |
| lab | L(-12,28,p) / L(4,16,p) / 30 | S(.06,.42,p)×(1−S(.7,.96,p)) / .35 |
| outro | L(-20,45,q) / L(12,35.264,q) / L(26,12,q), q=S(.2,.85,p) | .9×(1−q) / .08+.2q |

- dt=clamp(elapsedSeconds,0,.05), smoothing coefficient 1−exp(-dt/.05); snap first frame and scene-family changes, no intro replay. Intro lasts 1.2 active seconds; preserve source per-piece stagger, cubic easing, scale .92→1, separation=max(E,(1−pe)×.6), idle rotation and brand-pixel drift exactly. Stop clocks while suspended. No per-frame React state updates.
- Reduced motion: no intro/idle/explosion/pointer chain; fixed hero p0 (-16°,7°,24), chapter p.5 (45°,35.264°,10), Lab p0 (-12°,4°,30), outro q1 (45°,35.264°,12), assembled/group scale1. Source constant .1 brand-pixel offset may stay fixed, never animated. One eligible draw on entry/applicable prop or size update; hidden/zero still suppress every draw. Live preference exit does not replay intro.
- Source seed 24092026 per mount, seven exact clipped extrusion polygons and random draw order. No satellites allocated. Use deterministic 100-entry debris sequence/prefix for live tier changes; low tier=root width≤760 CSS px OR pointer coarse: 44 active debris, DPR cap1.25; otherwise100/cap1.75; preserve actual DPR below cap. Lab debris only when E>.003, not arbitrary positive explosion. Root-local assembled-bounds projected fit90%; full-explosion debris/pieces may clip. Resize/media/DPR changes do not randomize/replay intro.
- Pointer: passive window observation only for eligible initialized normal-motion hero/outro with tilt true. Mouse only, inside this instance's nonzero rect; normalized [-1,1], max ±3° azimuth/∓2° elevation, source smoothing min(1,dt×3). Outside/window exit/blur/disable/scene change/stop/failure/reduced-motion resets target AND active contribution. No capture/preventDefault/scroll/key listener, no root hit testing interception; root pointer-events none.
- Covered import/WebGL/partial initialization/render failure or context loss enters terminal SVG fallback, invalidates work, and attempts isolated cleanup. Prevent default on context loss; restoration is not retry. Cleanup is best-effort/idempotent, not guaranteed browser/driver resource release or universal no-throw for consumer callbacks. Cancel work/invalidate async generation before removing subscriptions/disposal; late import cannot boot detached instances. Deduplicate shared resources, attempt each once, clear ownership even if a disposer fails, continue all remaining cleanup. Strict Mode leaves one live engine/loop/subscription set under normal cleanup; instances share no mutable scene/random state.

## 5. Accessibility

Decoration only: root/canvas/SVG hidden from accessibility APIs, no focusable content/role img/name/live status/title/desc or keyboard behavior. Do not port preview live/status paragraph. Meaningful surrounding branding/link requires consumer text outside this subtree. Preserve safe native hidden and reduced-motion behavior; other ARIA attrs cannot unhide/name the subtree. No new recoloring/forced-colors API; later forced-colors check must show surrounding information remains perceivable. Ordinary decorative opacity is intentional, not a caption-contrast mechanism.

## 6. Appearance and exact scoped exceptions

- Root is transparent effect geometry, **not a Surface/well/overlay/card**: relative h-full w-full overflow-hidden pointer-events-none; canvas/SVG absolute inset-0 block h-full w-full. No root border/background/gradient/shadow/chrome or CSS masks. Container dimensions/hosting Material belong to consumer; resize may alter renderer backing dimensions, not inject CSS width/height.
- Read mounted-root computed --logo-red, --logo-red-shade, --color-primitive-red-neon and --color-primitive-red-light at eligible initialization (not global document snapshot). Parse failure selects SVG, no hardcoded replacement. Engine resamples on remount, not live theme tracking; late initialization reads then-current tokens. SVG token fill utilities follow CSS inheritance. Token stylesheet is a consumer prerequisite; missing tokens can invalidate fallback appearance too.
- Preserve **#47-only engine-data/material exception**: edge #5a0a18, edge emissive #1a0005, debris emissive #220006; achromatic white bases/lights; numeric light/material/geometry/projection/seeded ranges, depth .44/no bevel and source white halo texture stops (0:1,.25:.42,.6:.08,1:0), neon-tinted sprite and effective opacity halo×(1−E×.4). This does not excuse token-backed face/red-light colors or authorize CSS gradients/glow, arbitrary style values/new tokens or other components.
- Preserve **#47-only opacity exception**: static opacity-[var(--eg-iso3d-opacity)] utility plus exactly one owned unitless finite numeric inline --eg-iso3d-opacity in [0,1]. No inline opacity/dimensions/transforms/colors/masks/other appearance. Keep variable spelling despite different root marker. Canvas drawing data/halo texture are not a DOM-style escape hatch or Gauge permission.
- CVA per-part static recipes in types.ts, per-part cn in hook using the contract's existing UI utility surface; utility wiring alternatives remain separate owner decisions. Root layout className supports outer margin, placement/alignment and appropriate position/z-order, not fill size/clip/pointer/opacity/part paint overrides. Compose supported layout changes, then enforce invariant groups; test recognized position conflicts separately from forbidden overrides. No universal arbitrary CSS/last-class guarantee. No stylesheet, extra public engine, cloned Surface or legacy selector attachment.

### #131 evidence reconciliation — no duplicate work

[Issue #131](https://github.com/egdev6/egdev-design-system/issues/131) tracks reference/naming delivery, not another component or missing full-contract approval. Supplied body described historical prepublication gates. Commit **4173cca876078c0d10dfa109629a818fc43d984f**, visible in current file history as `docs(specs): consolidate Isotipo3D evidence and naming (#132)`, already contains all three PNGs, [capture/adoption metadata](../v0.3/capture.json) and naming receipt. Writer viewed the three actual PNGs and recomputed matching bytes; receipt/current registry were inspected. Keep these files/history unchanged; no duplicate capture/naming registration/delivery issue or automatic #131 closure. Later #47 full approval supersedes capture.json's stale full-Draft pending declarations, not factual conditions or image scopes.

| VIS | Existing local asset / SHA-256 | Adopted scope; not runtime parity |
| --- | --- | --- |
| VIS-01 | [Hero](../v0.3/hero--progress-1--1280--dark.png), `48a0c0c425d6b7b33c0c53711c062767472ea090be3f1614e9445d11c9bb8ff1` | Assembled hero p1 geometry/palette/pose; stage black/glow/rounded edge excluded |
| VIS-02 | [Lab](../v0.3/lab--progress-0.50--1280--dark.png), `ce33c7d90e8fbe42a3cb3d207bee6715a443e7136bf3bfc4792b2772529642e4` | p.5 is full-explosion plateau ex1, visibly clipped; fit90% is assembled bounds, not containment |
| VIS-03 | [Fallback source](../v0.3/assembled--source-fallback--1280--dark.png), `cb2412989d99da261e3a869061397bb283bbc31b1c5fce669743a809bcbd0aaf` | GEOMETRY/PALETTE ONLY; source glow excluded, not forced engine failure or target fallback pixels |

Source viewport1280×900/DPR1/Chrome148, original dark tokens/bundle, reduced-transparency no-preference; hero/Lab normal motion/neutral pointer after3200ms, fallback reduce. Source live CSS root618.1875×558→PNG619×559; fallback247.90625 square→PNG249 square. Hero sampled SwiftShader software rendering, Lab backend not independently sampled. Source Lab low=false used viewport width, so target root≤760 must instead use44 debris; explicit expected difference, not a regression to hide. Original stage chrome/source tokens, continuing idle time, unpinned loaded stylesheet bytes and non-exact screenshot timestamps prevent target-pixel equivalence claims. Metadata records fonts/timing/conditions; do not fill its null evidence fields with invented values. Approved target differences include consumer fill/clipping, decorative semantics, stationary non-glowing SVG, fixed reduced poses, bounded window pointer, container tier and peer import. **Runtime visual conformity: Not evaluated.** [Capture request](capture-request.json) reuses these sources and proposes later observed runtime comparisons only.

## 7. Acceptance and remaining decisions

All approved AC-01–AC-20 remain obligations, not passes: defaults/ref; numeric normalization; terminal fallback; first-frame swap; exact pose/intro/smoothing; state precedence; fixed reduced-motion scheduling; bounded mouse; root tiers/debris/DPR; resize/fit/zero-size; safe decoration/native filtering; cleanup/disposal-failure isolation; private module/React18/19 refs; merge/opacity invariants; token sampling; lazy SSR-safe required peer; real supported build/consumers; compiled utility/metadata Controls; scoped source-reference comparison; no page/legacy coupling. [Implementation plan](implementation-plan.md) maps each to focused tests and parent-owned package/browser checks.

**Resolved:** approved full v0.3 and scoped target differences; committed #131 reference/naming evidence; private isotipoScene.ts/six-role architecture; exact three/@types permission now relayed. **Remaining OWNER choices:** separately approve exact runtime plan/physical placement/build; approve utility wiring recommendation A or choose bounded alternative B in dependency plan (extra edges are not approved). Parent schedules installation only after those gates. No new tokens, API widening, existing-contract reapproval or new source capture is requested. Preparation source/hash/link checks are separate from runtime/TDD/AT/browser/build results; none of the latter is claimed.
