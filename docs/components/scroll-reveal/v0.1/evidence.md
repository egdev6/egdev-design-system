# Evidence — ScrollReveal spec v0.1 (Proposed)

Provenance for `spec.md` in this folder. Read-only inspection only; no implementation, no source edits. The owner selected three draft decisions (verbatim, `odd/tasks/web-catalog.md` L52: "Wrapper plus restricted asChild (recommended)"; "800ms token + delay exception (recommended)"; "22.4px existing token (recommended)") — these are applied in the spec as selected design decisions, **not** final spec approval. All remaining recommendations are unapproved. Nothing here authorizes implementation, token edits, publishing or new captures. Source-of-truth grant: `/home/egdev/proyectos/egdev-website` (read-only, recorded as S4 in `odd/tasks/web-catalog.md`).

## 1. Verified repository facts

| Fact | Evidence (path:line) |
| --- | --- |
| `@egdev/effects` public exports are only AmbientBackground and Isotipo3D (+ their types); no reveal/wipe utility exists | `packages/effects/src/index.ts:1-4` |
| Effects component pattern: six-file anatomy plus one internal non-exported engine module | `packages/effects/src/ambient-background/` file listing (`AmbientBackground.tsx`, `useAmbientBackground.ts`, `types.ts`, `index.ts`, tests, stories, `particleStreaks.ts`) |
| Effects package manifest (exports, deps `@egdev/ui` + CVA, peers) is pinned by test | `packages/effects/src/package-contract.test.ts:6-29`; `packages/effects/package.json` |
| `Slot`/`Slottable` are public exports of `@egdev/ui` (reusable for `asChild` without a new dependency) | `packages/ui/src/index.ts:168-169`; `@radix-ui/react-slot: 1.5.0` in `packages/ui/package.json:44` |
| `--duration-reveal: 560ms` and `--ease-out` exist as tokens; no 800 ms duration token exists | `packages/tokens/src/theme.css:461-472` (complete duration set: fast/base/reveal/press), `:383-390` (eases) |
| Registry entry reused: `slot-composition` / `asChild`; no delay/variant/once entries exist | `skills/_shared/prop-naming.json:2482-2483` (154 entries searched) |
| Approved destination decision: reveal/wipe as `@egdev/effects` utility | `docs/components/web-catalog/v0.1/owner-approvals.md` (2026-11-02, "Utilidad en @egdev/effects (Recomendado)"); question source `docs/components/web-catalog/v0.1/cataloging-draft.md:71` |
| Sequencing: "Specify reveal/wipe first (recommended)" before HomeTemplate; no implementation authorized | `odd/tasks/web-catalog.md` L51 (F1) |
| Owner-selected draft decisions: wrapper + restricted `asChild`; 800 ms token + delay exception; 22.4px existing token — not final spec approval, not token authorization | `odd/tasks/web-catalog.md` L52 (verbatim quotes) |
| Choreography (zones, bands, director) belongs to HomeTemplate, not to effects components | `docs/CATALOGACION.md` web consumer amendment rules 3–4; `docs/components/ambient-background/v0.4/web-catalog-note.md:8-12` |

## 2. Source behavior (read-only reference, inspected verbatim)

### JavaScript — `packages/effects/reference/pulso-director.js:519-537` (REVEAL block)

- Gated on `"IntersectionObserver" in window && !RM.matches`; only then adds the `js` root class (`:520,536`). Comment at `:519` records the intent: content is hidden only once everything is wired.
- Stagger: for each `[data-reveal],[data-wipe]` element, counts preceding siblings carrying either attribute within the same parent and sets `--d = n × 90ms` (`:521-526`).
- Pre-pass: elements whose `getBoundingClientRect().top < window.innerHeight × 0.92` get `in done` immediately and are never observed (`:527,531-533`); the rest are observed.
- Observer: `IntersectionObserver` with `rootMargin: "0px 0px -8% 0px"`, `threshold: 0`; on intersect adds `in` and calls `unobserve` (once-only; `:528-530`).
- Wipe end: document-level `transitionend` listener adds `done` when `propertyName === "clip-path"` and the target has `data-wipe` (`:535`). No cancel/timeout fallback.
- No scroll listeners for reveal; no replay; no cleanup section (the source is a page IIFE).

### CSS — `/home/egdev/proyectos/egdev-website/egdev-foundation/reference-web/pulso-source.html:467-475`

- `.js [data-reveal]`: `opacity:0; transform:translateY(24px)`; transitions opacity and transform `.56s var(--ease) var(--d,0ms)`; `.in` → `opacity:1; transform:none` (`:468-469`).
- `.js [data-wipe]`: `clip-path:inset(-10% 100% -10% 0)`; transition clip-path `.8s var(--ease) var(--d,0ms)`; `.in` → `inset(-10% -2% -10% 0)`; `.in.done` → `clip-path:none` (`:470-472`).
- Post-reveal composition with consumer transforms: `.proj.in:hover` / `.now-card.in:hover` → `translateY(-4px)`; `.ph-setup[data-reveal].in` → `rotate(2deg)`, hover `rotate(0) scale(1.01)` (`:473-474,521`).

### Reduced motion — same file `:477-483`

- Global `animation:none!important; transition:none!important` under `prefers-reduced-motion:reduce`, plus forced visibility: `.js [data-reveal], .js [data-wipe] { opacity:1!important; transform:none!important; clip-path:none!important }`.

### Usage scale

- `data-reveal` / `data-wipe` appear on 55 lines of `pulso-source.html` (headings, ledes, cards, list items, figures) across 9 of 12 zones (`cataloging-draft.md:71`); `data-wipe` is used on section headings (e.g. `:860,882,957,971`).

## 3. Capture evidence (observed, not adopted) and remaining gaps

Parent Chromium 153.0.8010.12 captured the original source read-only at 1280×900 via its file URL (`/home/egdev/proyectos/egdev-website/egdev-foundation/reference-web/pulso-source.html`) with real scrolling and no source/DOM mutation. Six PNGs and two metadata files (`capture-observed.json`, `capture-motion.json`) live in this folder; every PNG's SHA-256 was recomputed from the file bytes and matches the recorded metadata value exactly (re-verified 2026-11-03).

- **Final states** (`capture-observed.json`): `reveal-revealed-1280-dark.png` (reveal element 1 of 32, class `lede`: opacity 0 / translateY(24px) → opacity 1 / transform none, classes `lede in`) and `wipe-revealed-1280-dark.png` (wipe element 1 of 10, class `h2`: clip inset(-10% 100% -10% 0px) → none, classes `h2 in done`).
- **Motion states, computed state sampled 140 ms after scrolling** (`capture-motion.json`): reveal with no preference (opacity 0, translateY(24px), duration 0.56s, delay 0.09s — the source's 90 ms sibling stagger visible on element 1), wipe with no preference (clip inset(-10% 38.2489% -10% 0px), duration 0.8s, delay 0s), and both kinds under `prefers-reduced-motion: reduce` (fully visible, transform none / no clip, duration 0s).

**Honest timing note:** the computed state was sampled at 140 ms and the screenshot was taken afterwards, so the PNG and the recorded computed values are not guaranteed to depict the same instant. VIS-04 makes the gap visible: the sampled clip is mid-transition (38.25% right inset) while the screenshot already shows the heading fully drawn. Exact mid-transition frames cannot be claimed from these captures.

**Explicit restrictions:** file-URL resource restrictions may prevent some assets from loading, so visual parity with the deployed site is limited. All captures are observations of the source behavior, **not adopted design**; they do not approve the spec's proposals, and no capture metadata was synthesized.

**Remaining gaps** (not blockers for spec review; listed for completeness): stagger (two adjacent siblings showing the offset), the pre-reveal hidden state below the viewport line, 390 px viewport, no-JS rendering, and exact mid-transition pinning. Transition timing/easing cannot be verified from screenshots; they live in the CSS and the plan's token checks, not in VIS evidence.

## 4. Correction log — parent review of the first draft (this revision)

The first draft contained erroneous premises; the following corrections were applied before any owner review. None of them changes the approved destination decision.

1. **Styling mechanism (was: "states cannot be expressed as static CVA utilities").** False: Tailwind data/aria variants express attribute-conditioned states, and the shared contract explicitly requires styling `data-state`/ARIA through them (`skills/_shared/component-contract.md`, "Estilos" rules; `docs/ARQUITECTURA.md` styles section). The spec now recommends **"No stylesheet"** with static CVA utilities + data variants; optional CSS only with a plan-documented role (OQ-6 recommendation flipped).
2. **Rise distance (was: "translate-y-6 = 24px").** False: the token spacing scale is 3.2px-based (`packages/tokens/src/theme.css:7,414-431`), so `translate-y-6` is 19.2px. No approved token utility equals the source's 24px; nearest are `translate-y-7` (22.4px) and `translate-y-8` (25.6px). The spec now marks the difference pending (new OQ-10) and claims no equality. **Update (owner-selected, L52):** `translate-y-7` (22.4px) is the selected choice, recorded as an accepted 1.6px deviation from the source's 24px.
3. **Composition (was: asChild framed as primary and "forced asChild breaks plain headings").** Corrected: the false claim is removed. `asChild` writes the utility's `data-state` and root marker onto the child, and Radix/delivered components already own `data-state`; transition/transform utilities on the same element can clobber child motion (source composes post-reveal transforms, `pulso-source.html:473-474`). The spec now recommends a **default wrapper element** preserving child states/transforms, with `asChild` as an advanced opt-in under an explicit conflict policy (native single element, no own state marker, no conflicting transform/transition) or droppable for v0.1 (OQ-2). **Update (owner-selected, L52):** wrapper default plus restricted `asChild` is the selected composition.
4. **Stable root marker (was: no `eg-*` root because Slot renders onto the child).** Corrected: the shared contract requires a stable `eg-<name>` public root and Slot composition does not waive it. The spec now proposes `eg-scroll-reveal` on the utility's own element (AC-09 added).
5. **`once` prop (was: proposed with `once={false}` without a replay promise).** Removed from the API and from the registry proposals (`entrance-observation-once` withdrawn); once-only unobserve is now a spec invariant (AC-04), and any future replay must return as a separate explicit proposal (OQ-4).
6. **Invisible focus (new requirement).** An opacity-0/translated element stays focusable, so hidden state could hold invisible focus. The spec now requires immediate reveal when focus enters a hidden element's subtree (AC-08) and fail-open visibility on unsupported/failed `IntersectionObserver` and on a reduced-motion toggle while hidden (AC-01, AC-06).
7. **`delay` validation (new).** Proposed rule stated explicitly: finite number ≥ 0; non-finite or negative values are ignored (no delay); rule itself is a proposal pending approval (AC-07 covers both branches).
8. **Wipe fallback (was: dismiss as rare/invisible complexity).** Corrected: recommendation is now bounded cleanup — `transitioncancel` handling or equivalent — so the element never remains clipped indefinitely (OQ-7 recommendation flipped; AC-05 extended). No implementation is authorized.
9. **Capture reconciliation (this revision).** The earlier "no captures exist" statements, the pending intermediate/reduced-motion claims and the appended "Parent capture update" section were replaced in place by §3, which describes the six observed captures, their verified hashes, the sample/screenshot timing gap and the remaining gaps, keeping one authoritative description. Owner draft selections from `odd/tasks/web-catalog.md` L52 (wrapper + restricted `asChild`; 800 ms token + delay exception; 22.4px existing token) are applied in the spec as selected design decisions — not final spec approval, not token edits — and items 2 and 3 above carry their recorded updates.

## 5. Inspection commands performed (read-only, within the workspace)

- `grep` over `packages/` and `packages/ui/src/styles/legacy/` for `data-reveal|data-wipe` (only the director reference matched in-repo; legacy bundle has no reveal/wipe rules).
- Reads of `packages/effects/src/index.ts`, `packages/effects/package.json`, `packages/effects/src/package-contract.test.ts`, `packages/effects/src/ambient-background/*` (pattern reference), `packages/tokens/src/theme.css` (spacing scale and durations re-inspected for the correction round), `packages/ui/src/index.ts`, `packages/ui/package.json`, `skills/_shared/prop-naming.json`, the skills/docs chain named by `skills/component-spec-proposer/SKILL.md`, and the read-only source files cited in §2 (first draft only; later revisions reused those recorded observations without new out-of-workspace reads).
- Capture reconciliation checks (this revision): `sha256sum` over all six PNGs in this folder compared against `capture-observed.json` and `capture-motion.json` (all six match byte-for-byte); recomputation of the spec canonical payload SHA-256 with the whole-line cut `\n## 1. Purpose and scope\n` (single occurrence) through EOF; visual inspection of two PNGs (`reveal-revealed-1280-dark.png`, `wipe-no-preference-140ms-1280.png`) to confirm dark theme and content against the metadata.
- No writes outside the two files in this folder; no commits, pushes, servers, installs, builds or new captures.
