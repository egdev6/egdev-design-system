# HomeTemplate v0.1 — implementation plan (DRAFT, approvals pending)

- Plan approval: **Pending**. No implementation, source/token/registry edit, dependency, build, server, browser, publication or Git action is authorized by this draft.
- Plan payload SHA-256: `1c2fc44d10a3a1501b978d63e0757dbb33f384a756dcd422ba44069308c71fcb`
- Plan hash method: SHA-256 over saved UTF-8 bytes beginning at the unique whole heading line `## 1. Decision and authorization boundary` through EOF, including final LF; exclude this metadata. Match `\n<heading>\n`, then begin one byte after that leading LF. Never search the first textual mention of the heading. Whole-file hashes, when needed for later approval, must be recorded separately by the parent after metadata settles.
- Bound spec: [spec.md](spec.md), canonical payload `622eacf3cccb774690b6c247dcaf6e31a8feb4aa858376b00fd274438dc8eb84`; whole-file SHA-256 `b1ac63cd87d0fe51e72b3ca64645d739136d3037b46c37322909874c4442272c`. Frozen [owner decisions](owner-approval.md) whole-file SHA-256 `b1724643da6299f7c65431a27a8cb6f3497d28a66fc0e62e5cc7ab8736cb5b7b`. Frozen records are not rewritten by this plan.
- Frozen capture index: `capture.json`, whole-file SHA-256 `5d092aa9d776c6e633fc96e62e3ae0d879a69bae43f98e35420864960437db24`; VIS-01–10 PNG bytes and their original adoption limits remain unchanged.
- Bound DRAFT amendment: [bounded-amendment.md](bounded-amendment.md); amendment payload SHA-256 `3638297be7989989a9c5125229ebd32471dd35f33fb34a196b042024a4f26e38`; amendment whole-file SHA-256 `3d66425cff234cf4da99ccc3ba4ef5f6cb18259713bdf692f75ddffb8cd39cc6`. Route A was selected under S13/L72; exact amendment approval is pending, separately from this plan.
- Evidence: [probe runner](plan-probes.mjs), [saved probe results](plan-probes.json). The report verifies both drafts' declared payload hashes and records their actual whole-file hashes, runner bytes, actual compiler/input/output, reviewed engines, immutable spec/owner/index and ten PNGs. Whole-file hashes include final metadata; neither hash method includes a self-referential whole-file digest. It is not a component test or a review receipt.

## 1. Decision and authorization boundary

**Do not implement this draft yet.** Route A is selected for drafting, not for implementation or approval of unseen exact text. The intended route preserves the approved single traveling isotipo and continuous ambient transitions using existing private engines. The separate amendment proposes precise band-invalid/recovery, canvas-host transparency and duplicate-section rules. Subject to exact amendment approval, it resolves the identified contract conflicts; no further consequential contradiction was found in this planning pass. Renderer fit/confinement remains real new internal work, not verified current behavior.

Review in this order: draft amendment → public/native contract → engine boundary → AC/test matrix → dependent work units → future functional gates. Exactly two content-bound approval gates remain: approval of the saved amendment and separate approval of this saved plan bound to that amendment. Original API/engine, scoped recipe, token, naming and VIS choices remain approved and are not requested again. Later execution still needs scoped command/path authorization.

| ODD requirement | Plan coverage / verdict |
| --- | --- |
| S1, S2 | New template in `@egdev/effects`; Root + Anchor, no replacement page shell or `@egdev/ui` effect import. Feasible subject to §2. |
| S3 | Completes only HP1's HomeTemplate planning slice of the already inventoried web catalog; no claim that the whole inventory or HI1 is complete. |
| S4 | Read-only Foundation README/director/3D source informs anatomy/math. Original source is never copied into distribution or altered. |
| S6, S8 | One isotipo, continuous scroll targets, same private engines; additive generic scene port; draft amendment A1 defines the invalid-band exception/recovery, pending exact approval. |
| S7, S9, S10 | Vignette retained, grain excluded, exact one token and scoped opacity/confinement recipe; draft A2 clarifies CSS-transparent hosts with unchanged opaque ambient pixels, pending exact approval. No sizing-style blocker was found. |
| S11 | Three exact naming meanings/names approved; materialization waits for real reviewed types and receipts. |
| S12 | VIS-01–10 adopted as intention references with all recorded limits; no fresh capture or React verification claimed. |
| S13 | Route A selected once; precise A1/A2/A3 amendment prepared, including retained-id recovery policy and first matching section. Exact amendment and separate plan approval remain pending. |

Current public effects exports are exactly AmbientBackground, Isotipo3D and ScrollReveal plus their types (`packages/effects/src/index.ts:1–6`); there is no HomeTemplate. The catalog's public-component composition list is not an instruction to instantiate multiple public effect components: spec §2 requires template-owned canvases and same-package engine reuse.

## 2. Feasibility findings and selected route A draft

The binding [bounded amendment](bounded-amendment.md) supplies the proposed exact resolution below. It is not approved merely because the owner selected route A.

### B1 — source conflict; draft A1 adds invalid geometry handling

Evidence: owner-granted Foundation `design-system/components/src/effects/pulso-director.js:327–335` scales bands to `0.75 × vh`, shifts the first start to `0.5 × vh`, then shifts back to `Rmax`, then clips overlap and forces a minimum one-pixel interval. Frozen spec §4 promises these constraints together, without a layout minimum or collision policy. The repository reference has the same algorithm at `packages/effects/reference/pulso-director.js:328–336`, but is **not byte-identical** to the canonical Foundation director: its zone profile values include a later Grafito adjustment. Use the owner-bound source, not those changed table values.

Concrete witness (arithmetic, not an implemented-component test): viewport 900px, document height 900px, two consecutive 100px zones at tops 0/100, remaining document content 700px. `maxScroll=0`, reading-point interval `[450,450]`, requested minimum band length 675px. Source initial out/in are 472.5/202.5 after proportional scaling. First adjustment gives `[450,1125]`; end adjustment gives `[-225,450]`, violating the first-start bound. With three 300px zones in a 900px document, overlap correction can reduce the second band to `[450,451]`, violating both the 675px minimum and end bound. No implementation can satisfy all three hard inequalities in these examples.

This is not repaired by silently setting section heights, adding scroll distance, tuning constants, snapping profiles or copying the source's precedence while claiming all guarantees. Actual `LabStage` uses `h-auto` (`packages/ui/src/organisms/lab-stage/types.ts:41`) and a relative media box (:57–59), not a sticky 230vh stage; Hero/ChapterBreak/Closing likewise do not create the original page's sticky choreography automatically.

**Selected route A, exact text still pending approval:** derive/adjust all bands before applying targets, then validate finite endpoints, .75-viewport minimum, first start ≥.5 viewport, last end ≤Rmax and non-overlap. Any failure invalidates the entire root: zero effect output, stop both loops, invalidate pending paint-readiness, show all content/fallbacks, keep the static vignette, remove active `data-state`, warn only in development and automatically recover on valid remeasurement. One resolved zone has no bands and does not fail merely for having no scroll travel; zero resolved zones retain the original inert-input behavior. No layout/scroll-height/constant/reorder/snap workaround is allowed. A1 includes a separate overlap-only failure with a 2700px document and a valid recovery fixture; callback semantics are pinned in §3, not delegated to a future choice.

### B2 — source wording conflict; draft A2 distinguishes hosts from pixels

Evidence: `packages/effects/src/ambient-background/particleStreaks.ts:38` requests `{alpha:false}` and :239–242 paints the complete buffer with token-derived `backgroundColor` every frame. Spec §2 requires that engine as-is and §6/owner OD-3 describes exactly two transparent canvases. Transparent CSS background on the element does not make an opaque 2D backing buffer transparent.

**Selected route A, exact text still pending approval:** the two canvas hosts add no CSS background/image/shadow paint; their only inline visual values remain the bounded numeric opacity custom properties consumed by static CVA. The existing ambient alpha:false context/opaque token-backed buffer and existing 3D alpha buffer remain unchanged. Transparent host CSS does not make ambient pixels transparent. The vignette stays a separate authorized token-backed div. No new transparency mode, engine-alpha option, public prop or token is proposed; standalone appearance is unchanged.

### Investigated constraints that do NOT require amendments

- **Canvas styles:** particle resize writes intrinsic `canvas.width/height` attributes, not CSS (:334–348); its set/start/stop/renderOnce paths do not set canvas style. Scene resize uses `renderer.setSize(width,height,false)` (`isotipoScene.ts:285–299`). Installed Three 0.160.0 `src/renderers/WebGLRenderer.js:408–414` calls `setSize(...,false)` from `setPixelRatio`; :438–442 writes CSS width/height only when `updateStyle===true`. No existing canvas opacity write was found in these engines. Source director's `.style.opacity` and source 3D CSS mask writes must NOT be ported. Pin this property with real-engine style-write instrumentation in future tests, not a permissive engine mock.
- **Pose override is insufficient:** `isotipoScene.ts:315–317` accepts a pose only in normal motion; fit uses full-viewport extent 1.8 (:343–392), with neither lens shift nor confinement. This is exactly the additive work OD-2/OD-3 approves, not an additional public capability. RM can reuse `isotipoPose(...,true)`; its snap needs no arbitrary mixed override.
- **Root-local discovery ≠ local scroll coordinates:** spec fixes document `scrollY`/viewport math. Query sections only inside the root's content wrapper, but measure `rect.top + scrollY`; read document scroll height only for `Rmax`. Do not substitute root.scrollTop or root height, subtract the root offset from hero progress, or write html/body. Offset-root cases must test that distinction. Nested custom scroll containers are not a newly promised API.
- **Source drift:** canonical director SHA-256 `eb4bb9acdfd1872b8c78c9e4d8f48c5b80f7621da08113b2232144a16bee8495`; repository reference `2193bf2f19c927133722453db0301dc08285ca6e0db69a3994d4b7c25a98fc5e`. Source 3D and repository 3D reference both hash to `394bbf719bc3e1b5855e63a37ceee55ee5069065c659c953528ed3c13a7e34c8`. No Pulso zone table is ported, so differing domain table values do not become defaults.

## 3. Public API, registration and native boundaries

The following is a type-design sketch, **not reviewed source or registry evidence**. Keep the exact spec API; no asChild, ref, tuning, engine, opacity or public progress props are added.

```ts
type HomeTemplateZone = {
  id: string;
  isotipo?: boolean;
  ambient?: number;
  profile?: 'base' | 'read' | 'live';
  scene?: 'hero' | 'chapter' | 'lab' | 'outro';
  mobileIsotipo?: boolean;
};
type HomeTemplateProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'dangerouslySetInnerHTML' | 'role' | 'style'
> & {
  zoneTable: readonly HomeTemplateZone[];
  children: ReactNode;
  onZoneChange?: (change: { zone: string; previous: string | null }) => void;
};
type HomeTemplateAnchorProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'dangerouslySetInnerHTML' | 'role' | 'style'
> & { zone: string };
```

- Root/Anchor forward safe native attributes/events, `id`, `aria-*`, `data-*`; explicitly strip unsupported runtime `style`, `role`, `dangerouslySetInnerHTML`, `ref` and `asChild`, including untyped spread attempts. Do not leak zoneTable/zone/onZoneChange to DOM. Root-owned `data-state`, `data-motion` and layer ARIA win over consumer spreads. No role/name/landmarks, focus management or IDs are generated for decoration. Anchor children are optional inherited ReactNode, decorative/noninteractive by consumer responsibility; there is no sanitizer or interactive-fallback support.
- Root public marker `eg-home-template`; Anchor public presence marker `eg-home-template-anchor`, not a visual-selector API. Root `data-state` is the active configured id; omit before a valid identity. `data-motion="reduced"` only when reduced motion applies. Never interpolate ids into selectors: enumerate `[data-zone]` then compare attribute strings. Preserve exact string keys, not trimmed/sanitized replacements.
- `zoneTable` is required, readonly, no built-in ids/content. Defaults per entry: isotipo false; ambient 0 if isotipo true, otherwise 1; profile base; mobileIsotipo true. Scene required for isotipo ownership; a permissive optional field plus runtime validation preserves the spec's invalid-scene fallback rather than narrowing away its observable rule.
- Resolve configuration first (first duplicate table entry wins), then matching DOM sections only within content. Ignore foreign/missing sections with development warnings. Table order is authoritative: if resolved section order disagrees, stay inert rather than sort into a different story. Under draft A3, first matching section in document order wins geometry/order resolution, later duplicates warn only in development and are ignored for choreography, never hidden/cloned/reordered or made into new zones. Re-resolve on removal. Anchor eligibility remains Root-context/zone-key based: even an Anchor in a nonwinning duplicate follows the unchanged first-live registration rule, not a new containment filter. No invented exact warning text is claimed by the frozen spec; implementation tests must pin the subsequently reviewed English messages, production silence and no throws.
- Root owns a stable context registration function, one ordered live-registration list and measurements. Implement registration/unregistration once there; all hooks use it. First live registered anchor wins, duplicate/non-3D bindings warn; zero-area/non-finite/unmeasurable boxes suppress 3D and leave fallback. Keep registration ordering stable across rerenders, zone changes and StrictMode remounts; do not generate registration IDs from time/random or use a global list. Unregister only the owned entry; resolve the remaining first live entry on removal.
- `useHomeTemplateAnchor` stays in `useHomeTemplate.ts`, with stable DOM ref/registration identity, cleanup on node/zone/root change and no React-19-only ref-cleanup return. Test callback identity stability rather than assuming `useCallback` proves registration stability. React 18/19 negatives must reject public refs; internal refs are real DOM ownership, not a public promise.
- Callback under draft A1: latest callback ref, first valid measurement once with `{zone,previous:null}`, then only actual identity changes (`t<0.5` A, `t>=0.5` B). Never-valid geometry exposes no identity and emits no callback. Invalidation removes `data-state` without a fake empty/reset event, retaining last notified valid id. Recovery restores the current valid identity; same-id recovery emits nothing, different-id recovery emits `{zone:newId,previous:lastNotifiedValidId}`. No callback on per-frame targets, callback identity changes, repeated invalid measurements or equivalent table rerenders. Geometry recovery is independent of renewed eligible paint before hiding fallback.

### Validation and fail-open precedence

Test every row with content/fallback visibility, root identity/callback sequence, layer targets/loop behavior and warning/throw behavior. These are DOM/render APIs, not persistent storage or CLI commands; exit/stdout/counter assertions do not apply. Test-created state belongs to an isolated document and is torn down.

| Input | Exact resolution to preserve |
| --- | --- |
| Empty/no-valid table | Content visible; inert layers; no fabricated active identity. |
| Ambient NaN / +Infinity / −Infinity | 0 / 1 / 0 respectively; finite values clamp to [0,1]. Do not reuse the opacity non-finite rule here. |
| Canvas opacity non-finite | 0; otherwise finite clamp [0,1]; only two numeric custom properties, never CSS opacity strings. |
| isotipo true + positive explicit ambient | 3D wins, ambient 0, development warning. |
| isotipo true + absent/invalid scene | Ambient-only 1, warning; this fallback wins even over an explicit ambient 0. |
| isotipo false + scene | Scene ignored; Anchor binding ignored/warned as non-3D. |
| Both effective targets 0 | Valid effectless zone, stable identity, both loops stopped, not an invalid table. |
| Duplicates / foreign / missing / order mismatch | Draft A3 chooses first DOM match; unchanged table/Anchor rules; later sections/content remain visible. Foreign/missing ignored; order mismatch inert; no silent reorder. |
| Unfit adjusted bands (draft A1) | Entire root inert, effect output/loops/readiness disabled, content/fallbacks visible, static vignette retained, identity absent; last notified valid id retained for automatic recovery. One-zone/no-bands is not rejected for no scroll travel. |
| Missing/zero anchor, unavailable WebGL/import/paint, context loss | Suppress 3D, retain/restore eligible fallback; never hide page content or invent ambient ownership as a substitute. |
| Missing/throwing observation/platform services | Inert or successfully measured static state, content visible; no IO dependency, no cascading exception. |

## 4. Implementation responsibilities and engine reuse

### Exact component anatomy and file map (future, not edits authorized now)

| Path under `packages/effects/src/home-template/` | Responsibility |
| --- | --- |
| `types.ts` | Public types/JSDoc and static per-part CVA recipes; no browser work. |
| `useHomeTemplate.ts` | Root context; sole registration function; hooks, state, refs, callbacks, subscription/engine ownership, per-part `cn()` calls. |
| `HomeTemplate.tsx` | JSX only: Root, ambient canvas, vignette, one isotipo canvas, content wrapper. |
| `HomeTemplateAnchor.tsx` | JSX only; consumes internal hook, measured box and decorative fallback wrapper. |
| `homeDirector.ts` | Named private pure band/read-point/gate/profile math and normalization, no JSX/CVA/React state. |
| `homeTravel.ts` | Named private measurement/progress/pose mixing and geometry preparation, no new renderer/parser/React state. |
| `HomeTemplate.test.tsx` | Meaningful component/renderHook behavior plus pure math and engine-boundary tests; no new test framework. |
| `HomeTemplate.stories.tsx` | Public API stories and generic consumer compositions, no domain data. |
| `index.ts` | Only HomeTemplate, HomeTemplateAnchor and public types. No recipes/hooks/director/travel export. |

**No stylesheet.** No additional unnamed runtime module is approved. Existing engine files may gain private exports/options but must not import HomeTemplate modules. If fit/confinement cannot remain reviewable in that boundary, surface the need for a named module and obtain an amendment rather than create one silently.

### Ambient reuse, without cloning shared logic

`createParticleStreaks` already owns numeric Profile, ready/set/resize/start/stop/renderOnce/dispose (:32–389). It owns particle arrays, lane/count changes, generation guards, sprite preparation and cleanup; HomeTemplate must never replace those or access their storage. `set()` replaces the complete numeric profile, not a partial patch; compare the last applied values in the controller to satisfy AC-06.

`useAmbientBackground.ts:6–10` owns the exact base/read/live presets (70/90/1/.1; 20/25/.6/.1; 110/120/1.4/.18). :29–46 owns token color extraction and six-hex validation; :91–97 scales counts below 700px. These are currently module-local logic, not reusable exports. Plan a behavior-preserving extraction of those existing presets/color resolver into the **existing `particleStreaks.ts` module**, with same validation/absence behavior; update the old hook to call them and the new hook/director to consume them. Do not copy literals or create a second parser. Color reads remain browser-only at effect setup. Preserve each old caller's exact existing computed-style target: the inspected AmbientBackground hook uses `getComputedStyle(root)` on its host at :29, not documentElement; do not silently move that read to documentElement or redirect any documentElement-based caller to a host. Make an extracted resolver consume the caller-selected computed style rather than choosing a different target itself. The new template can derive its approved colors from its own host using that same validation algorithm. Test distinct documentElement/host token values to prove the old target is unchanged. Keep old defaults/normalization/subscriptions unchanged; new template patch-deduplication is not an old-caller refactor. Draft A2 retains pixel policy unchanged; no alpha mode is proposed.

Port source `applyProfile` interpolation/rounding once into homeDirector: counts rounded after mobile scaling, speed to three decimals, glow to four, no new tuning knobs. Check that quantization is consistent with the source's numeric Profile promise; distinguish nominal continuous targets from rounded discrete counts. Profiles are names, not a public numeric-engine API.

Naming materialization must use these owner-approved meanings verbatim, not broaden them:

| Semantic ID / canonical name | Approved meaning |
| --- | --- |
| `choreography-zone-table` / `zoneTable` | Ordered scroll-choreography zone table. |
| `anchor-zone-binding` / `zone` | Bind a rendered HomeTemplateAnchor to its configured zone key. |
| `zone-change` / `onZoneChange` | Notify initial/current active-zone identity changes, not per-frame progress. |

### Generic scene projection and renderer-side confinement

Reuse `isotipoCreateScene`, `isotipoLoadThree`, `isotipoPolygons`, `isotipoParsePolygon`, `isotipoPose`, `isotipoNormalizeProgress` and the existing seeded geometry/resource ownership. Do not port the full source engine, polygon parser, random generator or pose formulas again. `homeTravel` computes each scene's local progress and calls `isotipoPose`; mix the existing five numeric pose fields plus signed anchor rects using the director's same t. Scene name is a pose-family value, never the consumer's zone id.

Add one **optional internal projection/confinement input**, defined in the scene module. It contains finite viewport dimensions, signed anchor rect and numeric padding/feather information; no DOM nodes, ids, scroll/table, callbacks or HomeTemplate imports. Absence follows the old fit/render path exactly, including gestures and pose handling. Validate positive dimensions/finiteness, but do not clamp left/top to zero or clamp a moving offscreen center into view.

For the opt-in path, derive NDC center from the full signed box and fit assembled projected bounds to 90% of both anchor dimensions at viewport aspect. Update projection and inverse together; include box/viewport/fov/pose/rotation/scale in fit-cache invalidation and clear shift when switching back to the legacy path. An offscreen anchor still has its true projection center; only the output's viewport intersection is visible. Reuse existing projected-bounds/camera algorithms, not the source's temporal `cur.fit` or camera anti-jitter smoothing (the spec forbids target smoothing).

Confinement is a real new renderer task: propose an opt-in owned render target and final screen-space composite whose fragment alpha multiplies the source mask's intersecting horizontal/vertical ramps. Source reference `pulso-iso3d.mjs:262–277`: pad=round(min(w,h)×.14), feather=round(min(w,h)×.2), signed rounded limits, transparent outer edges. Apply confinement to the complete scene including halo/debris; a mesh-only mask or scissor-only hard clip is insufficient. A scissor may optimize the visible intersection but cannot replace feathering. Restore render target/viewport/scissor state and dispose all opt-in GPU resources through the existing `own`/dispose mechanism on errors and normal teardown. No CSS mask, extra DOM canvas, inline size/transform, new dependency or public renderer option. Real GL/browser evidence is required before calling this route verified.

### Director geometry and lifecycle

- Measure document-space zone tops/heights within content; fixed canvas dimensions from viewport; signed viewport anchor rects from registered nodes. Re-measure active/band-endpoint anchors while the visible engine runs, so genuine consumer-owned sticky/layout changes are followed; this does not manufacture sticky layout. Source hero anchor parallax is scroll-derived (`min(scrollY,vh)×.3` outside RM), not a time transform or DOM style write.
- Scene progress: hero `scrollY/height`; chapter `(scrollY+vh-top)/(height+vh)`; lab sticky `(scrollY-top)/(height-vh)` with positive denominator, otherwise `(scrollY+.6vh-top)/height`; outro `(scrollY+vh-top)/height`. Clamp with existing normalization. Determine lab sticky from the registered anchor's actual sticky ancestor inside its zone and zone height >1.3vh, not `.lab-stage`, hardcoded id or automatic scene-component rewrite. Natural layouts use the nonsticky formula; future examples must distinguish natural versus consumer-composed sticky layouts honestly.
- After draft A1 and this plan receive exact approvals, port .35/.15, .75vh, .5 read-point; derive/adjust/validate the entire band table before applying any target. Invalid geometry keeps no effects loops/output or fallback-hiding readiness, retains vignette/remeasurement, removes active identity without clearing last notified id and recovers per §3. One-zone/no-bands remains valid independently of scroll distance. On valid geometry preserve continuous u, same-layer linear interpolation and changing-layer seg, safety gate and `<.002` clamp (exact .002 survives). Test t=.5, the nearest-zone tie and reverse scroll.
- No render/SSR resource acquisition. Effects own mount-generation flags, AbortController and lazy scene import; after every await/fonts-ready callback check generation/active state. Dispose late fulfilled scenes, ignore late failures, abort imports on unmount/failure; do not let an old promise mutate a remounted root.
- One rAF-coalesced director update per scroll frame, no temporal target smoothing. Separate intrinsic engine clocks from targets; pausing mid-band leaves targets unchanged while visible normal-motion engines animate. Stop ambient and 3D at effective zero, including missing/invalid anchor; resume without duplicate loops. Hidden tabs stop both; visible return measures and applies current media/geometry before resuming.
- Own window scroll/resize/load, body ResizeObserver (read-only observation), media RM/coarse/DPR and visibility listeners. Resize timer is exactly 150ms, canceled on unmount. Fonts/load and observer changes remeasure; guard absent/throwing services. IO is not required. Registration/table/children changes trigger scoped re-resolution; dynamic content observation, if used, is local to content and ignores own decorative/state changes to avoid feedback loops.
- RM is live: snap nearest t; call ambient renderOnce and one static scene render only on effective target/size/pose/anchor/media changes, not perpetual rAF. Normal restore restarts eligible clocks only. No pointer/drag/flip API is added to HomeTemplate; existing Isotipo3D gesture behavior remains intact.
- Fallback paint readiness is owned locally, not html `gl-on`. Fallback remains until successful eligible 3D paint; missing/zero boxes, mobile-suppressed bindings and context loss keep/restore it. Under draft A1 invalidation also restores every fallback and invalidates old/pending readiness generations; recovery cannot hide one until a new eligible paint. Never imperatively change consumer children or hide arbitrary page content. Engine/import failures stop and dispose the owned branch without breaking content or the independent ambient path. Cleanup attempts every resource even if one disposal throws.

## 5. Static recipes, className and utility evidence

The exact proposed strings live in `classesByPart` in the probe runner/report; these are the future CVA recipe inputs, not implemented types. Stable eg-* markers are presence APIs, not Tailwind candidates. Root: `relative isolate block w-full`; canvases: `fixed inset-0 block w-full h-full pointer-events-none bg-transparent`; ambient z-0; isotipo z-[1]; content `relative z-[2] block overflow-x-clip`; Anchor `relative block`; fallback `block data-[state=painted]:opacity-0`. Vignette is exactly `fixed inset-0 z-0 pointer-events-none bg-[image:var(--gradient-vignette)]`, after ambient and before isotipo/content.

Only inline values: finite [0,1] numeric `--eg-home-ambient-opacity` / `--eg-home-isotipo-opacity` on their respective two canvases, consumed by static `opacity-[var(--eg-home-ambient-opacity)]` / `opacity-[var(--eg-home-isotipo-opacity)]`. Intrinsic bitmap dimensions are canvas attributes, not style. No dynamic class interpolation, transitions on targets, CSS masks, inline appearance elsewhere or component stylesheet. The fallback's static data-state opacity utility is not an additional inline exception. Two canvases share no public AmbientBackground/Isotipo3D markers that could inherit legacy opacity/transition rules.

Per-part `cn()`: Root allows outer margins/self-alignment only; Anchor additionally allows consumer box width/height/aspect/max/min/layout geometry, since §2 delegates sizing to consumer utilities. Compose supported user classes before final invariant recipes: root positioning/isolation/display/full width and anchor registration-host display/position win; caller size utilities survive on Anchor because its recipe declares none. Internal layers/content/fallback expose no className props. Test supported merge conflicts and actual final element classes; no “last string always wins” promise for custom selectors, arbitrary variants or external CSS. Consumers must not establish transformed/filter/contain ancestors that turn fixed layers into a non-viewport containing block; there is no portal/embedded-scroll workaround in this API.

Probe operation: installed Tailwind 4.3.3 resolved only from the two parent-authorized existing tool roots. In-memory reference input loads this repository's full token source plus the exact approved future vignette declaration; no application build or global stylesheet edit. Fresh compilation per candidate checks both its escaped selector and expected declaration, including data-state condition; combined output must contain no Tailwind directives. Report records exact resolved entry/version, input, referenced theme hash + ephemeral declaration, output bytes/hash and per-candidate CSS. Successful probe proves emission only, not source scanning, own-element delivery, computed appearance, numeric sanitization or renderer fit.

The only authorized future token declaration (owner record OD-4) is:

```css
--gradient-vignette: radial-gradient(ellipse 120% 90% at 50% 45%, transparent 35%, rgba(0, 0, 0, 0.55) 75%, rgba(0, 0, 0, 0.92) 100%);
```

Future packaging must add only `@source "../home-template/types.ts"` to the existing effects stylesheet entry and extend its existing compiler/AST-CVA regression mechanisms. Token implementation adds only the owner's exact `--gradient-vignette` declaration to theme.css, rebuilds native tokens through existing scripts, and updates affected token declaration/count expectations from the actual build (the current consumption expectation notes 291 root tokens). Never manually edit dist/tokens.css or hand-copy gradients into component code. Preserve global theme, package scripts, dependencies and root test-worker/hook/timeout defaults.

## 6. Test-first acceptance matrix (future execution)

This change is a passive plan: **no meaningful RED/GREEN exists now**. Compiler/immutability probes are structural evidence, not implemented component tests. During later authorized implementation, add tests first per row, observe the intended failure, implement minimum code, observe focused GREEN, preserve each touched public path and refactor only while green. Existing Vitest/Testing Library, Node package tests, TypeScript/docgen and token/naming mechanisms suffice; no new framework.

| AC | RED cases and complete observables to pin; GREEN method |
| --- | --- |
| 01 | Render generic three-zone sections/table, exact first-valid callback once, ordered crossing/reverse sequence, native state. Draft A1: never-valid has no identity/callback; invalidation removes identity without reset event; same-id recovery no duplicate; different-id recovery reports retained previous valid id; delayed first valid reports previous null. Draft A3: first DOM section wins, duplicate removal re-resolves, later content remains visible; Anchor in later duplicate still follows first-live registration. Warnings, no throws, content/fallback visibility and inert loops all asserted publicly, not via registry storage. |
| 02 | Pure zone targets/profile defaults at before/after band edges, one zone, effectless zone, fractional scroll, document-root offset; corroborate math API outputs with rendered canvas numeric properties and engine calls. After exact A1 approval, pin all 900px witnesses, the overlap-only failure despite available scroll, one-zone/no-bands distinction, and valid remeasurement recovery; verify the entire root is inert rather than a valid prefix. |
| 03 | t=0/.25/.5/.75/1 samples and just either side of edges; stop scroll midband, advance clock, assert identical targets but continued intrinsic engine calls. No delayed camera/fit target catch-up. Pure named math API plus public component observations. |
| 04 | Both ownership directions, same-layer transition, both-zero, t=.5, values .001999/.002/.002001, safety gate. Assert both never positive at the same time, correct outgoing/incoming custom properties and stopped-loop effects. |
| 05 | Zero/positive/zero, hidden/visible return while scrolled/media changed; count active owned rAF work/calls, prevent duplicate resumes, leave content/callback semantics unchanged. |
| 06 | All profile pairs, .6 count scaling at width 699 (not 700), count rounding, 3/4-decimal speed/glow patch signatures; repeated identical targets do not call set. Public rendered behavior + engine-call boundary, no particle-array assertions. |
| 07 | Two differently sized/placed signed/offscreen anchors, normal and reverse travel, pose+rect t equality; zero/missing rect suppression. Real engine opt-in fit/cache/projection-inverse/confinement tests and later browser pixels outside feathered viewport intersection; one canvas only. Pose spy alone does not prove fit or masking. |
| 08 | Widths 699/700 and 759/760/761, live resize; mobileIsotipo false vs true/default, skip disabled anchor and retain its fallback, full ambient, no mobile 3D loop. Browser confirms layout viewport, not merely device emulation. |
| 09 | Live RM enter/leave, tie snaps to B, stationary duration, repeated same target causes no frames, one static render on effective change, no pending animation after visibility return or media race. Confirm actual engine/static calls and later timed browser evidence. |
| 10 | Load/fonts/body/anchor size updates; resize at 149/150ms, coalescing and timer cancellation. Unmount during unresolved import/font promise and each failure point; StrictMode double mount leaves one live instance then none, stable ref callback identity, no stale notifications. |
| 11 | Snapshot window keys and html/body attributes/styles before mount, scroll, media, failures, unmount; no additions/mutations; two independent roots do not share state or register each other's sections. Reads/listeners/observer registration are not global-state writes. |
| 12 | SSR/no-JS initial markup exposes content + decorative fallbacks; hydration no mismatch; no WebGL, rejected import, first-paint failure and context loss preserve/restore fallback; mobile suppression too. Layers aria-hidden/pointer-events none, no roles/tab stops/focus interception. Consumer fallback interactivity remains unsupported, not auto-sanitized. |
| 13 | Existing public AmbientBackground/Isotipo3D/ScrollReveal preserve props/defaults/markers and behavior. New public root/type exports only; hooks/engines/options/private subpaths absent. Real-engine no-new-style-write tests; independent old/new differential below. |
| 14 | Every §3 validation row, numeric infinities/NaN/out-of-range/boundaries, ignored scene, duplicate removal, unavailable/throwing RO/matchMedia/context, absent IO, abort/disposal throws: no exception/content hiding/new error prop; assert exact reviewed warnings and production silence, callback/loop/fallback consequences. |
| 15 | Root native forwarding/protection and supported margins/alignment vs final invariants; Anchor consumer geometry survives, host invariants survive collisions; `cn` limitations documented; refs rejected in both major type consumers; no implicit asChild support. |
| 16 | Exact vignette token utility/declaration + DOM order z0/z1/z2, aria-hidden/pointer none, no inline paint/CSS file/grain. Packed own vignette element must carry its critical class even if another component emits identical CSS; browser confirms image resolves and correct stacking. |

Pure math tests may import named private modules as ordinary function APIs, as spec AC-02/03/04/06 requests; registration/fallback/callback tests must exercise public components, never reach into internal Map/refs/arrays. Engine tests observe renderer calls/output/resource disposal, not mutate hidden state to reach branches.

### PRESERVE and differential checks

For every changed shared path add one explicit previous-behavior regression per existing caller: AmbientBackground base/default profile/opacity/static resize after helper extraction; Isotipo3D legacy no-projection fit, reduced frame and existing gesture path after scene extension. Keep all existing suites; ScrollReveal remains untouched but retain its public export/no-op integration coverage. No gratuitous migration of public APIs or standalone lifecycle.

Future **one differential script** (parent must first authorize exact runner and fresh external scratch/base-copy creation): run old and new public AmbientBackground and Isotipo3D fixtures at identical deterministic clock/random/media/geometry/token inputs, with the new template options absent (they are private and must not leak as public props). Compare stdout, stderr, exit status plus serialized DOM/renderer/canvas style writes and render/disposal/loop trace; compare existing scene/progress/opacity/gesture and profile/resize paths that share changed code. No unexplained difference is acceptable. Use a read-only isolated base-commit copy, never git history in committed tests. Pin any discovered regression in a current public test. Tear down runtime scratch in that later authorized test; no scratch/base copy is created by HP1.

## 7. Future integration, docs and verification gates

All commands below are **proposals for later explicit parent authorization**, not a runnable contract or permission to run them during HP1. Run focused checks first; report actual evidence, never a planned command as a pass.

1. Component/pure tests: `pnpm test packages/effects/src/home-template/HomeTemplate.test.tsx`; shared regressions: `pnpm test packages/effects/src/ambient-background packages/effects/src/atoms/isotipo3d packages/effects/src/scroll-reveal`. Package metadata regression: `pnpm test packages/effects/src/package-contract.test.ts`. All use the public root script and retain its two-worker default. Do not increase global timeouts/workers.
2. Naming materialization only after reviewed `types.ts`: `pnpm props:docs`, `pnpm props:check`, `pnpm test:props`. Reuse `conventionHash`, `exceptionHash`, registry validation/rendering from `scripts/prop-naming.mjs`; no second hash/canonicalization mechanism. Bind each usage to real `source:{path,symbol,revision:"sha256:<whole-file bytes>"}`. Use the owner record's exact three meanings, ids and names; profile/scene reuse their existing entries, guide-zones stays unchanged. Nested zone fields are not new global own props. No fictitious source revision is allowed now. Approval receipts/JSON/schema/generated view are a later parent-owned integration slice, not edits authorized by this draft.
3. Source docgen/controls: extend existing `packages/ui/src/lib/storybook-docgen.test.ts` and `storybook-controls.test.ts` paths, not a new parser framework. Add English JSDoc per own declaration: table/children/callback `@control false` with concrete reasons and named examples; Anchor zone text; nested scalar fields documented with boolean/number/select as representable. Required table/children/zone have no fake defaults; derived ambient has prose, not fixed @default. Verify real extraction → central enhancer → installed native inference, zero owned diagnostics. Never manual argTypes/play/renderer adapters.
4. Stories `Templates/HomeTemplate`: required-input-only Default miniature, profile/handoff, two-anchor travel, mobile gate, natural vs explicitly consumer-sticky lab, invalid/fail-open, RM, safe native/className composition and active-zone callback with `action` from `storybook/actions`. Generic ids e.g. introduction/reading/experiment, not domain zone lists. Root receives arbitrary consumer content/landmarks; examples use actual delivered scenes through media slots with sized HomeTemplateAnchor and decorative fallback. No scene owns scroll height/sticky automatically, no copied full page or screenshot presented as React output.
5. Public docs: append an English HomeTemplate usage/consumer-responsibility section to `packages/effects/README.md`, covering every option/event/native restriction/fallback/className limit, consumer headings/navigation/scroll padding and stylesheet imports. Future new component docs under its component folder and existing Storybook docs integration, if needed, need exact surface authorization before creation. Update catalog source via `scripts/catalog_data.py` and regenerate using the existing generator only if separately delegated; no hand-edit generated catalog.
6. `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:tokens`, `pnpm test:package-exports`, `pnpm test:package-consumption`, `pnpm test`, plus owned metadata focused tests after integration. These are future gates with resource/write/install implications to approve explicitly; current default `pnpm test` remains `vitest run --maxWorkers=2`, hook/timeouts unchanged. External consumption runner creates isolated temporary fixtures and may install packages: no offline/online retry assumption or installer authorization here.
7. Packed contracts extend existing `scripts/package-exports.test.mjs` helpers (`artifact`, `cssBlock`, TypeScript AST-CVA traversal) and `scripts/package-consumption.test.mjs` fixture generation. Require real React 18 + 19 strict type positive/negative tests, SSR/hydration/client runs, no public refs, stable internal registration identities, no eager three import or private subpath exports. Load tokens.css + effects/styles.css in a consumer without Tailwind; inspect both CSS declarations AND the component's own canvas/vignette/content/anchor/fallback classes. Selectors emitted by unrelated components are insufficient. Build declaration/export graph must expose only approved public names and keep private projection types unreachable from the public API.
8. Real-browser component verification later: actual viewport/document scroll, 390×844 and 1280×900 matched intention conditions, boundary widths, same-layer profiles, signed/offscreen boxes, stopped scroll, first paint, no-JS/no-WebGL/context loss, hidden/live RM changes, two roots and teardown. Inspect content/focus/landmarks, own-element computed styles and noninteraction; inspect actual Controls widgets. Record actual fonts, browser/GPU, DPR, motion and differences per VIS/AC; inspect screen-reader and zoom separately if later authorized. Current visual conformity, accessibility, zoom and pixel parity: **Not evaluated**. Keep adopted references/index/PNG unchanged; observed implementation artifacts require separate exact path authorization.

### Required mutation discipline (future)

Before approving package gates as meaningful, perform actual bounded mutations, not hypothetical tests: remove each critical own-element class (fixed/inset/full size/z order/pointer guard, each opacity variable, fallback data-state, content clip, vignette image), remove the effects @source registration, change the token spelling/value, bypass handoff/zero-stop, break signed geometry/feather or callback deduplication. Assert the appropriate source or packed check fails for its intended reason. For packed mutations rebuild after each source change; old dist selectors are not evidence. Restore each touched file from byte snapshots, rebuild, rerun focused/package gates and verify source AND tracked generated artifacts are byte-identical to the approved pre-mutation candidate. No git restore/reset, no mutation of frozen records, no arbitrary cleanup, no hash-only “mutation passed” claim. Parent must authorize paths/commands and scratch lifecycle before this begins.

## 8. Dependent work units and risk

Sizes are authored added+removed line budgets, including tests/docs; generated CSS/catalog/registry views and browser records are counted and reported separately, never hidden to make a slice look smaller. If a unit exceeds ~400 authored lines, split along the named responsibility with tests/docs; do not leave an untested engine port as a standalone “small” commit. Commits/branch integration/publication are parent-owned. No force/rebase/push bypass or CI/hook assumption is authorized.

| Unit | Target scope after authorization | Budget / dependency / verification |
| --- | --- | --- |
| U0 | Parent obtains exact saved A1/A2/A3 amendment approval and separate content-bound plan approval, preserving frozen spec/owner/index/PNGs | Amendment draft is prepared, not approved. Prerequisite to all code; no original API/token/naming/VIS gate reopened and no worker-owned approval rewrite. |
| U1 | Extract existing ambient presets/color resolver into existing engine file; update old hook + preserve tests | 200–350 authored; independent verifier compares public AmbientBackground path. Complete before controller imports helpers. |
| U2 | Scene optional projection/fit/confinement + renderer/regression tests and bounded internal rationale | **Risk:item3**, 350–400 authored per commit; consumes existing Isotipo3D behavior. If necessary split projection-fit and feathered-composite subunits, each with meaningful tests. Separate from controller; independent verifier reruns old/new public behavior and tests no extra style writes/GPU leaks. |
| U3 | homeDirector pure math + generic validation, complete-band invalidation/recovery and boundary tests | 300–400 authored; after exact A1 approval; uses U1 profiles. No second engine/parser. |
| U4 | homeTravel progress/pose/geometry + signed/offscreen tests | 250–400 authored; depends on U2 projection input and U3 target shape. No lower-engine dependency inversion. |
| U5a | types/CVA, Root/Anchor JSX, hook registration and native/fallback shell tests | 300–400 authored; U1–4 interfaces settled; not a releasable replacement for choreography. |
| U5b | Hook director/engine wiring + loop/async/failure/RM/cleanup tests | 350–400 authored per cohesive slice; follows U5a. Keep one write thread; further lifecycle slices if needed. |
| U6 | Parent public exports, effects @source, exact token + token/package/source regressions | 250–400 authored; after core public types reviewed; generated native CSS reported separately. No package/dependency/lock change. |
| U7 | Naming receipts/usages + generated view + regression tests | 200–350 authored, generated view separate; real reviewed types and owner approval are prerequisites; parent integrates serially. |
| U8 | Stories/JSDoc/public usage docs + metadata tests | 300–400 authored; public shape settled; no invented approvals or story defaults. |
| U9 | Packed consumer/own-element gates, actual mutations, browser evidence | 300–400 authored per source/test/docs slice; artifacts reported separately; runtime/scratch/build/browser permissions required. Final functional verification and independent Risk:item3 verifier before parent disposition. |

Renderer port → travel → controller are dependent units, **not parallel writers**. Ambient extraction also touches a shared caller and merits independent verification, even though new public API is absent. Native candidate review lifecycle and work-unit commit decisions stay with the primary parent; functional gates are separate. No native review receipt or completion is invented.

## 9. HP1 observed evidence and next decision

The only edit surfaces for this HP1/S13 follow-up are `bounded-amendment.md`, this plan and `plan-probes.mjs/json`. Passive plan exception applies to RED/GREEN; no component, token, registry, global stylesheet, package, approved record or task is changed. The runner verifies immutable spec whole bytes and canonical payload, owner record, capture index and all ten PNG hashes; both drafts' unique whole-heading payload methods/declarations, plan-to-amendment bindings and actual whole saved bytes are checked and recorded. Installed-compiler evidence remains 17 isolated selector/declaration assertions, not component behavior.

Before handoff: read the entire saved amendment/plan for consistency, verify exact surfaces and immutable/source hashes, then run one final syntax/probe-write/probe-check flow under `NODE_OPTIONS=--max-old-space-size=1024`, in finite foreground commands. No full suites/builds/browsers/capture/refusal reruns, Git mutations or external scratch are part of this follow-up.

**Remaining gates exactly:** content-bound owner approval of the saved amendment, then separate content-bound approval of this saved plan bound to it. Route A has already been selected once; no repeated menu or renewed original API/token/naming/VIS approval is needed. The exact callback/duplicate/host details remain proposals until that amendment is approved. No additional unresolved technical contradiction is asserted, and no implemented-behavior certification is made.
