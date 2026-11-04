# HomeTemplate v0.1 — route A bounded amendment (DRAFT)

- Status: **Exact amendment approval pending**. Route selection is drafting authority, not approval of this text, its hash, the implementation plan or implementation.
- Amendment payload SHA-256: `3638297be7989989a9c5125229ebd32471dd35f33fb34a196b042024a4f26e38`
- Amendment hash method: SHA-256 of saved UTF-8 bytes from the unique whole heading line `## 1. Binding and limited authority` through EOF, including final LF; metadata above is excluded. Locate `\n<heading>\n` and begin after the leading LF. Whole-file SHA-256 includes all saved metadata and is recorded independently in plan-probes.json; neither digest proves approval.
- Frozen spec: `spec.md`, version 0.1, canonical payload `622eacf3cccb774690b6c247dcaf6e31a8feb4aa858376b00fd274438dc8eb84`; whole-file SHA-256 `b1ac63cd87d0fe51e72b3ca64645d739136d3037b46c37322909874c4442272c`.
- Frozen owner decisions: `owner-approval.md`, whole-file SHA-256 `b1724643da6299f7c65431a27a8cb6f3497d28a66fc0e62e5cc7ab8736cb5b7b`.
- Frozen capture index: `capture.json`, whole-file SHA-256 `5d092aa9d776c6e633fc96e62e3ae0d879a69bae43f98e35420864960437db24`; all ten bound PNGs remain unchanged.

## 1. Binding and limited authority

The primary owner selected closed answer **A**, label **“A — Recomendado”**, to the prior A/B/C/D menu (`odd/tasks/web-catalog.md`, S13/L72). That selects preparing route A only: inert fail-open choreography for unfit bands, CSS-transparent canvas hosts with unchanged opaque ambient pixels, and first matching DOM section with a development warning. This draft is the proposed exact, separately reviewable text. It is not an owner-approval record or native-review receipt.

If approved against these exact saved bytes, this amendment changes only the bound spec/owner-recipe clauses listed in this amendment's §5. Everything else remains authoritative and unchanged. The [implementation plan](implementation-plan.md) binds this draft by payload and whole-file hashes and remains subject to its own separate approval. No code, token, dependency, registry, capture, publication or cleanup is authorized now.

## 2. A1 — invalid band geometry and recovery

### Derive first, validate before applying

Resolve configured zones using the existing validation and order authority plus §4 below. For two or more resolved zones, derive **all** bands with the approved rules: outgoing .35 of A's height and incoming .15 of B's height; proportional scaling to .75 viewport minimum; first-start adjustment to .5 viewport; source end-scroll adjustment using `Rmax = maxScroll + .5 × viewport`; sequential non-overlap adjustment. Do not replace the algorithm with a new search, reorder, new constant or layout modification.

Before committing any director targets, check the complete adjusted band table. Every endpoint must be finite; every band must have positive width and width at least `.75 × viewport`; first band start must be at least `.5 × viewport`; final band end must be at most `Rmax` (the source's inclusive upper bound); each next start must be at least the preceding end. Source overlap correction's one-pixel floor is not an exemption from the minimum or bounds. If any check fails, geometry is invalid for this Root. Never apply an earlier valid prefix or partially publish targets/identity before discovering a later failure.

One resolved zone has **no bands**: do not invent a .75-viewport travel requirement or reject it merely because the document does not scroll. Apply its otherwise valid pure-zone state and existing engine/anchor gates. Zero resolved zones retains the original empty/no-valid-input inert behavior, not a fabricated band or identity.

### Invalid posture

While geometry is invalid:

- Both effect-layer targets are zero; stop ambient and 3D loops and suppress their output. Do not render a reduced-motion static effect frame as a workaround. No pending rAF/import/paint completion may re-enable effects or mark a fallback ready while invalid.
- Reset/invalidate fallback paint-readiness eligibility for this geometry generation; **all consumer content and anchor fallbacks remain visible**. A frame painted before invalidation does not authorize hiding a fallback during invalidity or after recovery before a new eligible paint.
- Retain the separate static token-backed vignette div. It is not an effect loop and is not removed or faded by invalid-band handling.
- Emit a development warning, silent in production. The root remains mounted and observation/registration/remeasurement remain available; invalidity is not a permanent engine failure or a new public error state/prop.
- Remove the active-zone identity attribute `data-state` entirely; do not write an empty string or synthetic zone. Existing reduced-motion representation is independent and unchanged.

No added section height, scroll distance, sticky choreography, clamped/reordered zones, profile snap, changed constants or global writes may make an invalid layout appear valid. Existing natural-height scenes remain natural-height scenes.

### Exact identity/callback policy

Keep `lastNotifiedValidId` as Root-instance bookkeeping, separate from the currently exposed identity. Invalidation does not clear that bookkeeping, emit a fake empty/reset event or call `onZoneChange` merely because `data-state` was removed. Callback identity replacement itself remains a non-event.

| Transition | Root `data-state` | `onZoneChange` |
| --- | --- | --- |
| Never valid → invalid | Absent | None; retained valid id remains null. |
| Never valid → first valid id A | A | Once: `{ zone: A, previous: null }`; retain A. |
| Valid A → invalid | Absent | None; retain A. |
| Invalid after A → valid A | A | None; no duplicate notification; retain A. |
| Invalid after A → valid B | B | Once: `{ zone: B, previous: A }`; retain B. |
| Valid A → valid B | B | Original once-per-identity-change behavior: `{ zone: B, previous: A }`. |

Repeated invalid measurements emit no zone notifications. Recovery happens automatically on a successful valid remeasurement; apply the current scroll/media state, not stale pre-invalidation targets. Callback/identity recovery does not imply 3D paint readiness: fallback hiding must wait for a new eligible successful paint under the existing anchor/WebGL rules. Last-valid bookkeeping is not persistent storage or a global contract, and a genuinely new Root instance starts without a notified id.

### Why this is an amendment, not existing source behavior

The Foundation source director (`design-system/components/src/effects/pulso-director.js:327–335`, canonical source SHA-256 `eb4bb9acdfd1872b8c78c9e4d8f48c5b80f7621da08113b2232144a16bee8495`) adjusts bands but does not enforce all final invariants. It can violate the first-start/minimum/end bounds. The frozen spec already provides fail-open inert content for inconsistent input, but does **not** explicitly cover these band collisions or the recovery notification sequence above. A1 extends that posture only to invalid band geometry; the exact callback policy is newly proposed for approval, not attributed to source or an earlier owner decision.

Arithmetic witnesses (not observed component behavior):

1. **900px no-travel witness:** viewport/document height 900px, two 100px zones at tops 0/100 and 700px remaining document content. `maxScroll=0`, reading-point interval `[450,450]`, minimum band 675px. Scaling gives outgoing 472.5/incoming 202.5; first adjustment `[450,1125]`; end adjustment `[-225,450]`. The first bound cannot hold together with the minimum and end bound: invalid/inert.
2. **900px document with successive collisions:** three consecutive 300px zones, viewport/document 900px. Source first band becomes `[-225,450]`; second overlap-adjusted band `[450,451]`. The second band is only 1px and exceeds `Rmax=450`: invalid/inert.
3. **Overlap failure despite available scrolling:** viewport 900px, three 300px zones at tops 0/300/600, document 2700px including 1800px remaining content. `Rmax=2250`. First band is `[450,1125]`; second pre-overlap band `[127.5,802.5]`, then `[1125,1126]` after source overlap correction. Bounds alone fit, but the 1px band violates the 675px minimum: invalid/inert.
4. **Valid recovery fixture:** remeasure three 900px zones at tops 0/900/1800 in a 2700px document/900px viewport. Bands `[450,1125]` and `[1327.5,2002.5]` have length 675px, respect order/non-overlap and end before `Rmax=2250`. Resume current pure/mixed targets normally; callback behavior follows the retained-id table, not an unconditional second initial event.

## 3. A2 — transparent CSS hosts, unchanged canvas pixels

“Two fixed full-viewport transparent canvases” in the scoped compositor recipe means **the two canvas host elements add no CSS background, background-image or box-shadow paint**. The only inline visual values remain the existing finite, clamped [0,1] numeric opacity custom properties on the two fixed canvases, consumed by static CVA utilities; non-finite opacity resolves to zero. It is not an exception allowing other host paint, inline geometry or direct opacity-style strings.

The ambient engine is reused unchanged in pixel policy: `packages/effects/src/ambient-background/particleStreaks.ts:38` requests `{ alpha: false }`, and :239–242 fills its buffer with its existing token-derived background color. Those rendered pixels remain opaque and are faded as an entire canvas by the approved bounded compositor opacity. They do **not** become transparent because the host's CSS background is transparent. The 3D renderer's existing alpha-enabled buffer remains unchanged (`isotipoScene.ts:82`).

There is no new transparency mode, engine-alpha option, public prop or token. Existing standalone AmbientBackground/Isotipo3D paint, defaults and caller behavior do not change. The vignette is a **separate div**, already authorized to use the exact `--gradient-vignette` token through `bg-[image:var(--gradient-vignette)]`; it is not paint on either canvas host. Renderer-side fit/confinement and the no-CSS-mask/no-stylesheet boundary are unchanged.

## 4. A3 — duplicate matching DOM sections

For each configured zone id, enumerate matching `data-zone` sections **inside the content wrapper** and choose the first in document order as that id's section for measurement and document-order consistency checks. Warn in development when later matches exist; production warnings are silent. Ignore later matches for zone geometry/choreography resolution only: do not fabricate another zone, clone/rewrite children, generate ids, reorder the DOM or hide later sections/their content. Remeasurement re-resolves the first live matching section if the earlier one is removed.

This does not change first-entry-wins for duplicate `zoneTable` ids or first-live-registered-wins for duplicate Anchor bindings. Anchor registration remains Root-context/zone-key based and has **no new section-containment filter**: an Anchor inside a later duplicate section is not silently unregistered or made ineligible solely because its containing section lost selection. The existing Root-context rules still decide which live binding wins, whether its geometry is usable, and its fallback's ordinary valid-paint lifecycle. Ignoring a duplicate section is not a new instruction to hide that section's Anchor fallback; ordinary eligible fallback hiding after paint is not section-content hiding. Consumers should avoid duplicate sections, but no new public restriction or validation prop is introduced. These independent rules supply a deterministic result without requiring another ownership decision.

## 5. Exact scope, superseded clauses and unchanged guarantees

| Change | Only clauses qualified/extended if this exact draft is approved |
| --- | --- |
| A1 | Spec §4 “Band between zones A and B” and invalid/incomplete-input rows: validate all derived/adjusted bands; unfit geometry uses the defined inert posture. Spec §3 callback row, §4 mount/scroll/state representation and AC-01/02/03/05/10/12/14: qualify active choreography by valid band geometry, remove invalid identity without reset events, recover with retained notification identity and renewed paint eligibility. No band constraints are weakened on valid geometry. |
| A2 | Spec §6 dynamic-geometry transparent-canvas phrase and owner record OD-3's corresponding phrase: clarify CSS host transparency versus opaque ambient pixels. Preserve spec §2 engine-as-is reuse and AC-13 existing-caller behavior; do not create an alpha-mode exception. |
| A3 | Spec §2 zone-order authority, §4 duplicate/input resolution and AC-01/14: add first-in-document-order matching-section resolution and development-only warnings, without changing table/Anchor precedence. |

All frozen files remain byte-for-byte unchanged; this separate text would govern only the listed qualifications. No other original approval is reopened: public API/schema/defaults/native/ref limits, three exact naming meanings, sole vignette token, VIS-01–10 adoption/limits and private-engine boundary remain approved. Valid-layout continuous travel/profile interpolation, layer exclusion/.002 cutoff, mobile/RM thresholds, observation/debounce/cleanup, fallback/no-global rules, signed projection/confinement, no stylesheet/grain and no dependencies remain unchanged. No additional runtime module, public prop, token or source modification is authorized.

## 6. Future tests and remaining gates

After exact amendment and separate plan approval, add behavior tests first for all witnesses and the one-zone/no-bands case; a later-band overlap failure must invalidate the entire root without an earlier frame/callback escape. Through public Root/Anchor rendering assert absent identity, exact callback payload/order/count, stopped loops, zero effect output, visible content/fallbacks and retained vignette; cover never-valid, valid→invalid, repeated invalid, same-id/different-id recovery, StrictMode and late async paint/import completions. Recheck current scroll/media on recovery and require new eligible paint before hiding fallbacks. Pure math assertions complement, not replace, public observable tests.

Add duplicate-section tests including removal/re-resolution, production silence, unchanged later content and an Anchor registered from a later duplicate under the unchanged first-live rule. Preserve existing ambient opaque paint and color-read target behavior; prove no CSS canvas-host paint/style broadening, and retain the plan's shared-engine regressions/differential/independent verifier. No test or component behavior is reported as observed by this draft.

**Remaining approval gates only:** (1) owner approval bound to this amendment's exact payload/whole bytes; (2) separate approval bound to the implementation plan's exact bytes and this amendment. Route A is selected, not selected again here. Functional execution still requires later scoped command/path authorization; there is no implementation approval in this document.
