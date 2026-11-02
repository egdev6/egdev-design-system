<!-- Draft versioned comment for https://github.com/egdev6/egdev-design-system/issues/95. Prepared locally; NOT published. Publishing requires explicit add-comment authorization for this exact text plus an authorized GitHub session. -->

## PhotoFrame — v0.4 amendment draft: unreserved ratio and a finite focal-point set

**Draft — not ready for implementation.** Two owner choices (Q2, Q3 below) and GitHub-visible image accessibility are still open. Nothing here is implemented, and this comment does not reapprove the approved v0.2 contract.

- **Version / status:** `0.4` — Draft amendment over the approved base contract **v0.2**. Reason: the web-catalog layer (b) closes the recorded PhotoFrame variant gap `ratio="auto"` + image `position` (`docs/components/web-catalog/v0.1/cataloging-draft.md` §3, owner-approved 2026-11-02).
- **contentSHA256:** `2db38f20c3f72d0f1abe6415e67c37678787387d5608e923d771a68fb488fc14` — SHA-256 of the UTF-8 canonical spec payload from its `## 1. Purpose and scope` heading through EOF, LF line endings, final newline included, tracking metadata excluded.
- **Spec copy in this repository:** `docs/components/photo-frame/v0.4/spec.md` (whole-file `sha256:8cdee6b17ed43c747a3e71acd4f4c5d04bbdf863a54cb704508cad8add83c78b`). This comment is intentionally not self-hashed; the payload digest above is the authoritative identity.
- **visualHashes:** `VIS-03 → sha256:a1d1a240f6aa47e52d73293bba5fd58e667c96fbbd9a15be633bf46d0eb7d62f`; `VIS-04 → sha256:86cf61757dc9b1a405e6b3d067ddc8624aab19aad3ea3e1a83f16d926dd36364`; `VIS-05 → sha256:b8f75b16af9d9dc1b6feada58a8decea4f901bb7466f60e8fa07e1b0107f301c`; `VIS-06 → sha256:9101df380045ee554a16a832e723af0519fbc8205fe855f32d59cc09ae17359a`.
- **approvalReference:** Pending — no human approval of this version, digest or visuals is recorded.
- **canonicalIssue:** https://github.com/egdev6/egdev-design-system/issues/95
- **latestPublishedComment:** Pending — this comment is unpublished; the value may only be replaced after an authorized write and a matching readback. The latest comment published on this issue before it was https://github.com/egdev6/egdev-design-system/issues/95#issuecomment-6559826862 (2026-11-01 Storybook visual-review acceptance), which carries no contract snapshot.
- **previousSnapshot:** https://github.com/egdev6/egdev-design-system/issues/95#issuecomment-6244025883 — the last published comment that carried a contract snapshot (the v0.2 delta), applied to the canonical issue body; both were approved in https://github.com/egdev6/egdev-design-system/issues/95#issuecomment-6251537589. Comments published since then and read via `gh issue view 95`: #issuecomment-6522798297 (ODD preparation, no contract change) and #issuecomment-6559826862 (acceptance note).

### Reason

Approved policy now requires the design system to build new views of the Pulso web. Three real figures cannot be expressed by the current atom:

| Pulso usage | Web source (read-only) | Gap |
| --- | --- | --- |
| About portrait ("Fuera del editor") | `reference-web/pulso-source.html:854-855`, `:168` `.ph-canyon{height:100%;min-height:420px;--pos:42% 50%}` | No reserved proportion (height comes from the host grid cell) and a `42% 50%` crop — **ratio and crop both missing** |
| Live band landscape ("En directo desde casa") | `:1103-1104`, `:363` `.ph-setup{aspect-ratio:4/3;…;--pos:32% 50%}`, `:hover{rotate(0) scale(1.01)}`, `:520` narrower tilt | `4/3` is covered; the `32% 50%` crop is missing; the framed hover is an approved divergence, not a gap |
| Community portrait ("Hazlo con miedo") | `:1138-1139`, `:392` `.ph-hazlo{aspect-ratio:716/890;--pos:50% 40%}` | Bespoke proportion equal to the photo (`716×890`) and a `50% 40%` crop — **ratio and crop both missing** |

The Foundation component documents `ratio: "auto" | …` (default `auto`, "la da el contenedor") and `position: string` (default `"50% 50%"`, applied through `--pos`); the rendered preview confirms the free-form crops (`design-system/components/PhotoFrame/README.md:22-23`, `preview.html`, VIS-03).

### Delta — the only two changed inputs

```ts
type PhotoFrameRatio = 'square' | 'portrait' | 'landscape' | 'auto';
type PhotoFrameFocalPoint =
  | 'center' | 'top' | 'bottom' | 'left' | 'right'
  | 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom';
```

| Prop | Rule |
| --- | --- |
| `ratio` | Default stays `landscape`. `square` = 1, `portrait` = 4/5, `landscape` = 4/3 (unchanged). `auto` reserves nothing: the media fills the height the host layout gives the figure (the component emits `h-full`; the host only supplies a container with a definite height). Without a definite host height the media collapses — a documented host responsibility, not a guarded fallback. Unknown runtime values still normalise to `landscape` |
| `focalPoint` | Default stays `center`. The five existing keywords keep their current static utilities; four corners are added. Static CVA utilities only: no arbitrary values, no interpolated class strings, no inline `style` on the image. Values change cropping only, never the ratio and never the request |

Everything else is unchanged from approved v0.2: passive native `figure`/`img`/`figcaption`, native image routing (`src`, `alt`, `srcSet`, `sizes`, `width`, `height`, `loading`, `decoding`, `crossOrigin`, `referrerPolicy`, `onLoad`, `onError`), caption presence rules, the Surface frame recipe, the static framed tilt with its reduced-motion reset, the four `eg-photo*` markers, `data-ratio`/`data-variant`/`data-focal-point`, the root-`className` merge limits, the six mandatory files and **No stylesheet**.

### Compatibility impact

Additive only. The three existing ratios and five existing focal points emit the same classes as v0.2, so existing consumers, stories and visual review are unaffected; `PhotoFrameRatio` and `PhotoFrameFocalPoint` are widened unions with no member removed or renamed; exports, the `Atoms/PhotoFrame` story title and all markers are unchanged; `data-ratio="auto"` is the only new observable attribute value. No token, dependency, primitive, legacy CSS or consumer migration is involved.

### Prop-naming registry

Applied entries, all already approved and unchanged: `ratio` → [`aspect-ratio`](https://github.com/egdev6/egdev-design-system/blob/main/skills/_shared/prop-naming.json), `focalPoint` → [`image-focal-point`](https://github.com/egdev6/egdev-design-system/blob/main/skills/_shared/prop-naming.json), `variant` → `visual-treatment`, `imageCaption` → `image-caption` (see also the [generated view](https://github.com/egdev6/egdev-design-system/blob/main/docs/prop-naming.md)). No new convention ID and no exception is proposed or recorded in this draft; convention status, entry hashes and approvals are not inferred from this comment.

Reviewed source for the two changed usages: `packages/ui/src/atoms/photo-frame/types.ts`, symbols `PhotoFrameRatio` / `PhotoFrameFocalPoint` / `PhotoFrameProps`, whole-file `sha256:d88523162dc25f36bd591bbabdf2169775ab9b209ae3547a0fd36b5901f130f4` (read in the working tree and equal to the revision already recorded in the registry).

**Required follow-up outside this draft:** the two registry usage `type` strings still list only the current value sets. Updating them plus `pnpm props:docs`, `pnpm props:check` and `pnpm test:props` is a separate authorized change; it is not performed here.

### Recoverable full snapshot

This comment is a delta. The full v0.4 snapshot is recovered without inference as: (1) the approved v0.2 canonical payload — already reconstructed and verified in `docs/components/photo-frame/v0.3/contract-recovery.md` (canonical `sha256:13d66d39b036de68276c332bab3b97c3e8de6f42f4ebc2024c96be4a94142774`, from the frozen issue body `c307a572…` plus the ordered replacements of comment `6244025883` `38b76224…`), then (2) this delta's two type changes and their rules in §3 of `docs/components/photo-frame/v0.4/spec.md`, retained byte-exactly at the whole-file hash above. All seven blocks of the v0.4 contract live in that file; nothing in the approved v0.2 text is rewritten, and this comment requests no body edit.

### Visual references (Proposed, not adopted)

Four real Chromium captures of the **web** `design-system/components/PhotoFrame/preview.html`, rendered read-only for this task; full conditions and per-file hashes in `docs/components/photo-frame/v0.4/capture.json`.

| ID | Local image | Scenario | SHA-256 |
| --- | --- | --- | --- |
| VIS-03 | `docs/components/photo-frame/v0.4/ratios--static--desktop--dark.png` | Web ratio presets with free-form crops `42% 50%`, `50% 40%`, `32% 50%` | `a1d1a240f6aa47e52d73293bba5fd58e667c96fbbd9a15be633bf46d0eb7d62f` |
| VIS-04 | `docs/components/photo-frame/v0.4/framed--static--desktop--dark.png` | Web `--framed` at rest (`rotate(2deg)`, 6 px black border) and authored hover state | `86cf61757dc9b1a405e6b3d067ddc8624aab19aad3ea3e1a83f16d926dd36364` |
| VIS-05 | `docs/components/photo-frame/v0.4/framed--pointer-hover--desktop--dark.png` | Same row with a real pointer hover: `rotate(2deg)` → `scale(1.01)` | `b8f75b16af9d9dc1b6feada58a8decea4f901bb7466f60e8fa07e1b0107f301c` |
| VIS-06 | `docs/components/photo-frame/v0.4/board--static--desktop--dark.png` | Whole preview board (supplementary) | `9101df380045ee554a16a832e723af0519fbc8205fe855f32d59cc09ae17359a` |

Conditions: viewport 1280×960, DPR 1, Chromium headless shell 153.0.8010.12 on Linux via playwright-core, dark colour scheme, `prefers-reduced-motion: no-preference`, LTR, Barlow 400 and Barlow Condensed 600/700 loaded, element crops (not full pages), captured 2026-11-02. The harness only wrapped the fragment in a document, linked the authored `tokens.css` and `bundle.css`, and resolved three runtime `/_blob/<id>` media URLs to the matching `reference-web/assets` photographs; no preview CSS or markup was altered.

**No capture shows `ratio="auto"`**: the preview has no auto example and the container-height plus sub-760 px overrides exist only in page CSS (`pulso-source.html:168, 509, 523`), so that behaviour is source-quoted and **not visually verified**. These images are the observed web baseline, never design-system tokens; visual conformity of the delta is **Not evaluated** until an approved reference and a later implementation comparison exist.

**Image accessibility: Pending.** Local PNGs are not GitHub-visible. Publishing needs either a human attachment of the exact bytes with the returned URL, or a separately authorized asset-publication route; each URL would then be verified against these hashes before any link appears here.

### Acceptance criteria (planned, none executed)

`PF4-01` no ratio region for `auto` · `PF4-02` auto fills a definite host height and its unsupported case is documented, not guarded · `PF4-03` the three presets keep 100 %/125 %/75 % (regression guard) · `PF4-04` nine distinct static utilities, the five originals byte-identical · `PF4-05` no `style` attribute, no interpolated classes, compiled CSS contains the nine utilities · `PF4-06` unknown values still normalise · `PF4-07` native routing, caption, framed recipe, markers and merge invariants unchanged · `PF4-08` `auto` composes with `framed` and every focal point · `PF4-09` metadata/docgen/Controls and unchanged exports · `PF4-10` no stylesheet, no extra module, no token/dependency change · `PF4-11` visual and source hashes recomputed · `PF4-12` registry follow-up recorded. Full table with methods in `spec.md` §7.

### Open choices that block readiness

1. **Q1 — approve `ratio` gaining `auto` with the default unchanged at `landscape`?** Recommended: yes.
2. **Q2 — should `ratio` also accept a numeric proportion in this version?** The community figure needs `716/890`, which `auto` alone cannot express (`AspectRatio`/`PreviewFrame` already take numeric ratios and the `aspect-ratio` convention allows it). Recommended: yes; narrow alternative: `auto`-only plus a recorded limitation.
3. **Q3 — how should exact crops be supported?** Recommended: approve the nine-value keyword set now and defer a PreviewFrame-shaped bounded percentage exception (with its registry exception) to its own amendment.
4. **Q4 — accept static ratio and crop per instance, leaving responsive `--pos`/ratio switching in the web?** Recommended: yes for v0.4.
5. **Q5 — keep the approved framed recipe (Surface inset, static tilt, no hover motion) instead of the web's border + hover straighten?** Recommended: keep v0.2.
6. **Q6 — keep the overlay caption, vignette and image filter excluded?** Recommended: keep the exclusion.

### Publication and authority boundary

This comment is prepared only. It authorizes no implementation plan, no code, no token or dependency change, no registry edit, no commit/push, no issue body edit, no label or state change and no new issue. Posting requires explicit add-comment authorization for exact issue `#95` on `egdev6/egdev-design-system`, plus a recoverable authorization for GitHub access; after a single authorized write, read back the comment, record its URL and reconcile `latestPublishedComment` before citing it anywhere.
