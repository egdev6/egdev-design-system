# AmbientBackground — faithful engine port map

- **Status:** Draft implementation detail, not engine implementation or owner approval. Governed by [recovered v0.4](contract-recovery.md) and the separate [plan](implementation-plan.md).
- **contentSHA256:** sha256:cfe4528569534f92286eb391a1e1b66476f40b4b8e8854740168aebe2ef254d6
- **Hash definition:** UTF-8 SHA-256 from the actual whole-line heading matched by multiline `^## 1\. Source identity and boundaries$` through EOF, LF and final LF; exclude metadata and inline heading mentions.

## 1. Source identity and boundaries

Baseline `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`. Actual source `packages/effects/reference/particle-streaks.js`, whole-file SHA-256 `acabbacd1bdb1b94bb1745cbcb7e3e4bf804a77c3fef3e375d63692bd9ad9086`; this matches the adopted capture metadata's reference revision. It is read-only. Proposed destination: **`packages/effects/src/ambient-background/particleStreaks.ts`**, exactly the spec-named internal module, with no package-barrel export. Physical placement is a plan recommendation, not a consequence of taxonomy approval.

Port configuration, sprites, spawn/update/draw order, timing and identity retention; add strict types and only the lifecycle/context guards required by the React contract. Do not replace this engine with a simplified particle renderer. No `pulso-director.js`, scroll listener, zone interpolation, blend bands, logo choreography, HomeTemplate, exclusion manager, three or new particle dependency. Profile constants are already fixed by the contract, regardless of the historical director's other settings.

## 2. Exact configuration ledger

Keep these Particle Studio numeric/boolean/string engine values, not new design tokens or handwritten component appearance. Replace only the six color inputs with existing resolved token values, remove the inactive border color, and apply profile/count adaptation as described below.

| Config keys | Exact retained values |
| --- | --- |
| angle; speedMultiplier | 315; base 1 (profile override below) |
| backgroundGlow; backgroundGlowOpacity | true; base 0.1 (profile override below) |
| backgroundGlowX; backgroundGlowY; backgroundGlowRadius | 50; 50; 0.6 |
| blendMode | screen |
| lineCount | base 70 (profile/mobile override below) |
| lineSpeedMin; lineSpeedMax | 1.5; 4.5 |
| lineLengthMin; lineLengthMax | 180; 390 |
| lineWidthMin; lineWidthMax | 0.8; 2 |
| lineOpacityMin; lineOpacityMax | 0.25; 0.85 |
| lineGlow; lineGlowOpacity | 5; 0.3 |
| squareCount | base 90 (profile/mobile override below) |
| squareSpeedMin; squareSpeedMax | 0.8; 2.6 |
| squareSizeMin; squareSizeMax | 6; 28 |
| squareOpacityMin; squareOpacityMax | 0.1; 0.95 |
| squareRotation; squareSpinSpeed | 45; 0 (retain inert configuration, do not invent rotation animation) |
| squareGlow; squareGlowOpacity | 14; 0.25 |
| squareBorderWidth; squareFilled | 0; true |
| squareScaleEffect; squareFadeEffect | true; true |
| squareOpacityCycleDuration | 10 |
| streamClustering; clusterIntensity | false; 0.5 |

| Existing color token read from root computed style at mount | Engine input replacing reference literal |
| --- | --- |
| --color-ambient-bg | backgroundColor |
| --color-ambient-glow | backgroundGlowColor |
| --color-ambient-line | lineColor |
| --color-ambient-line-glow | lineGlowColor |
| --color-ambient-square | squareColor |
| --color-ambient-square-glow | squareGlowColor |

`packages/tokens/src/theme.css` SHA-256 `62d10992ae654e34e83d9d11bcf35da29e56c905648015f2415ebdca59bf6ab8` contains all six current hex color values. Read/trim the resolved values on the actual root (including local token overrides), not documentElement or a stylesheet parser. No hardcoded color fallback or new color prop. The reference hex-to-RGB arithmetic remains suitable for current resolved hex inputs; this plan does not promise arbitrary CSS color syntaxes. Missing/invalid required colors should leave the token-backed root fallback with no active engine rather than inventing paint; cover this defensive path. Live token-change observation is not contracted: do not reset particles or add polling/theme observers on prop changes.

Remove `squareBorderColor` from configuration, sprite cache key and the unreachable zero-width stroke branch. Retain squareBorderWidth=0; there is no public override capable of enabling it. No new outline or border color is substituted.

### Profiles and CSS-width scaling

| Profile | Desktop lines / squares | Width <700 CSS px | speedMultiplier | backgroundGlowOpacity |
| --- | --- | --- | --- | --- |
| base | 70 / 90 | 42 / 54 | 1 | 0.1 |
| read | 20 / 25 | 12 / 15 | 0.6 | 0.1 |
| live | 110 / 120 | 66 / 72 | 1.4 | 0.18 |

For positive measured canvas width, apply `Math.round(profileCount * (width < 700 ? 0.6 : 1))` to original preset counts. Width exactly 700 is desktop; never use DPR-scaled bitmap width, viewport width or multiply already scaled counts. Speed/glow are not mobile-scaled. Unknown untyped profile values are caller errors, not a new profile API.

## 3. Source-function responsibility map

| Reference function / block | Destination responsibility and invariant | Planned check |
| --- | --- | --- |
| PARTICLE_CONFIG; hexToRgb | Typed module-local defaults plus resolved color inputs; preserve channels/alpha arithmetic | Exact config/color mapping; no source color literals in port |
| createParticleStreaks | Instance-local config, main context `{alpha:false}`, arrays/IDs, sprites/cache keys and RAF clock; no DOM work at module import | Two instances independent; Node import/SSR has no browser-global access |
| updateSquareSprite | Lazy cached 512×512 sprite; inner 40, center 256; radial glow + filled square, no inactive border | Cache reuse across profile changes; sprite dimensions/stops/draw order |
| updateLineSprite | Lazy 1024×256 glow, 32 descending passes with original ellipse/gradient formulas | Recorded operations and exact pass endpoints |
| updateCoreSprite | Lazy 512×16 core strip, cache by lineColor; exact five-stop gradient | One generation for unchanged color; core draw path retained |
| dirVec; diag; laneOffset | `(angle-90)` radians; hypot(width,height)+400; lane span d×1.5, slot/base and disabled clustering branch unchanged | Direction vector, dimension/lane arithmetic, no lane redistribution on profile update |
| initLine; initSquare | Retain random-call order, distributions, ++idc, speeds×60, randomized initial distance, square phase and fixed rotation | Seeded random operation trace; initial versus appended spawn position |
| initParticles | Clear and respawn only on initial positive size or genuine size/DPR change, not profile/opacity/media/visibility changes | No new initialization calls on profile updates/resume |
| resize | Receive measured CSS width/height/DPR from hook; cap DPR at 2; floor backing dimensions; setTransform then initParticles | Fractional sizes, DPR 1/2/3, zero sizes, duplicate resize notifications |
| frame reconciliation | Append initLine/initSquare(false,...) or pop tails to match effective counts; retained particles keep identity, laneOffset, distance, speed, size and phase | Profile base→read→live at constant size does not randomize survivors |
| frame background | source-over, alpha=1, fill background; central radial glow; then screen blend | Recorded composition/reset order and gradient stops |
| frame lines | Move by speed×profile speed×dt; respawn after progress>=1; retain 15% entrance/exit fade and glow/core drawing transforms | Clock-based movement, expiry, fade boundaries, sprite reuse |
| frame squares | Same travel; absolute `now/1000` phase, cycle clamped 3…20, sine opacity, optional fade and 0.7+sin(progress×PI)×0.45 scale; original rotation | RenderOnce dt=0 still samples wall-clock phase; no new pulse/spin algorithm |
| frame final reset | globalAlpha=1 and source-over restored after drawing | Next frame unaffected by previous final particle |
| loop | `dt=min((now-lastTime)/1000,0.1)`; update lastTime, draw, schedule exactly one next frame while alive/running | Long interval cap, no duplicate or stale RAF after stop/dispose |
| set/start/stop/renderOnce | Preserve hot patch/no reset; idempotent start; stop cancels own RAF; renderOnce uses current clock with dt=0 | Profile set without recreate, restart fresh lastTime, static no RAF |
| window resize registration | Move observer/listener ownership to hook; engine must not retain original anonymous global listener | Cleanup counts and StrictMode setup/cleanup/setup |

Sprite numerical details remain source-exact: square glow radius min(230,40×0.6+glow×4.5), square stops 0/.25/.6/.85/1; line pass width/height/alpha exponents and .12/.5/.88 stops; core stops 0/.18/.5/.82/1; background glow stops 0/.4/.75/1 with inner radius 10; source line glow dimensions length+glow×3.6 and width×2+glow×3.2. These canvas algorithms are adopted effect art, not a CSS Material recipe. Preserve save/translate/rotate/scale/drawImage/restore order, and source spawn-at-zero handling after expiry.

Profile-only `set` must not call resize/initParticles, restart the loop, recompute survivor lane offsets or rebuild sprites. Appended particles start at distance zero; retained particles preserve their original lane distribution even when the total changes, exactly as the source does. Visibility/opacity resume also does not respawn. Actual size/DPR changes are the contracted exception and do reset particles.

## 4. Lifecycle adapter and defensive changes requiring plan approval

Recommend the hook own ResizeObserver, document visibilitychange and matchMedia change subscriptions, initial measured size, normalized opacity, React data-state and the forwarded root ref. Engine owns only its own RAF/draw resources and typed set/start/stop/renderOnce plus internal resize/dispose support. No public engine handle, seed or observer-injection props. All scheduling belongs to the instance; no module singleton canvas, arrays, sprites or shared cancellation ID.

Recommended precedence (operational details not spelled out by overlapping rows in v0.4):

1. Before client setup, absent main/sprite context, invalid/missing required colors, nonpositive size, hidden document or normalized opacity=0: stop, `data-state=stopped`, no draw loop. A hidden/zero-opacity profile update records the latest config without painting.
2. Otherwise reduced motion: stop, render exactly one dt=0 frame on entry or profile/opacity/actual-size change, `data-state=static`. Visibility restoration paints one latest static frame, not a burst of missed frames.
3. Otherwise: start idempotently, `data-state=running`; profile patches apply next frame without recreation. Resume sets lastTime=performance.now() so hidden elapsed time never becomes a travel jump.

This ordering and the zero-size/context state choice must be approved with the plan; they are not represented as a newly adopted contract amendment. CSS forced-colors hides the canvas per the recovered contract; no new forced-colors JS lifecycle or public prop is introduced.

Measure the canvas box after mount. Coalesce identical ResizeObserver/window resize measurements; a profile change is not a geometry event. Apply freshly derived effective counts before a real resize reinitializes arrays. Window resize may additionally detect DPR changes when CSS dimensions stay constant; do not use it for viewport-based density or reset on every notification. At zero size stop; when positive size returns, resize/reinitialize and reconcile current media/opacity/profile once. No perpetual zero-size polling.

Context-null guards must cover offscreen sprite contexts as well as the main context. Initialization failure must not partially subscribe/start and then leak. On disposal: mark engine disposed before cancellation, stop, discard sprite/cache and particle references, disconnect observer and remove exactly this instance's listeners in the hook; late queued callbacks cannot draw or reschedule. A cancelled callback delivered after a later restart must also be rejected using instance/generation ownership. Do not reset a shared canvas/document state, tear down another instance, or publish a global cleanup API.

SSR/import must not touch window/document/canvas/getComputedStyle/performance. Render a passive root/canvas and initial stopped state; acquire engine/resources only in a client effect. Use React18-compatible forwarded refs targeting the actual root div; canvas ref stays private. No imperative engine ref, accessibility label, children or interactive fallback.

## 5. Deterministic evidence plan, not results

Use the existing Vitest/jsdom setup in `AmbientBackground.test.tsx`. Replace environmental boundaries only: deterministic performance.now, bounded RAF queue/cancel recorder, seeded Math.random, manually delivered ResizeObserver and matchMedia/visibility events, main/offscreen canvas contexts with gradient/draw-operation recorders, computed root token values, bounding box and DPR. Restore every stub after each test; do not replace the port itself or return fake successful animation state.

- Compare selected formula outputs, spawn random-call counts and draw translations across known frames; do not expose particle arrays or add a public test-only engine API. Source review + retained-draw traces distinguish survivor retention from respawning.
- Exercise all profiles and width 699/700/701 at DPR 1/2/3; opacity omitted/negative/fraction/1/>1/NaN/±Infinity; static rerenders; hidden/static/zero combinations; valid→zero→valid resize; context failures; mount/unmount/remount and two simultaneous instances.
- Assert single RAF ownership, dt cap, fresh resume clock, no late callback work, observer/listener cleanup and no post-disposal React update. Include React StrictMode replay.
- A recording 2D double proves operation intent, not GPU rasterization, blend output, frame rate, real media behavior or visual parity. No giant pixel/full-trace snapshots. Real browser/reference comparison is separately requested in [capture-request.json](capture-request.json); historical random particle positions are not a pixel-match target.

Actual preparation evidence: full reference inspected, source identity and approved PNG bytes checked, exact current tokens/config and infrastructure reviewed. No port code, test double, execution, screenshot, browser/AT result or future source hash is claimed.
