# PhotoFrame v0.5 — `fit` amendment (`cover` | `contain`)

- **Version / status:** 0.5 — **Approved — 2026-11-20 by the owner (reply "Acepto todas")**. Amends the v0.4 contract ([spec.md](../v0.4/spec.md), [auto-height-amendment.md](../v0.4/auto-height-amendment.md)); neither is edited.
- **Snapshot identity:** `version: 0.5`; `contentSHA256: f201262463ed1b01eb5e2bed88dcb0c82368b4c0e1540041db960d3cc76e0f49`; `visualHashes: Pending capture`; `approvalReference: owner reply "Acepto todas", 2026-11-20; canonical issue #509 — this file is the recoverable snapshot`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/95`; `triggeringIssue: https://github.com/egdev6/egdev-design-system/issues/509`.
- **Hash definition:** as in v0.4 — SHA-256 of the UTF-8 canonical payload from `## 1. Purpose and scope` through EOF, LF endings, final newline; metadata above is excluded.
- **Owner decisions (verbatim, cataloging of #509):** "Variante fit en PhotoFrame (Recomendado)", "No por ahora" (no extraction of a new component), "No, lo compone la app" (open/enlarge stays app-side).
- **Nothing here is implemented.** Approving this amendment authorizes no code, token, dependency or publication.

## 1. Purpose and scope

**Need.** Issue #509 (Recado verdict review, `NoteImages`): thumbnails must keep a consistent size **without cropping tall screenshots**. `PhotoFrame` always cover-crops (`object-cover` in `photoFrameImageVariants`), so a tall screenshot loses content at every ratio.

**In scope.** One new own prop, `fit?: 'cover' | 'contain'`, default `cover`, on the existing atom (catalog step "variant", `docs/CATALOGACION.md`).

**Out of scope.** Read-only/attachment lists, open/enlarge actions (app-side), new components, tokens, dependencies, stylesheet, inline styles, changes to `ratio`, `variant`, caption or focal-point value sets.

## 2. Public API and prop-naming evidence

Registry inspected by meaning, name and aliases (`skills/_shared/prop-naming.json`, `docs/prop-naming.md`). No entry named or aliased `fit`, `objectFit`, `crop`, `resize` or similar exists (the only `cover*` names are unrelated `coverBadge`/`coverWord`).

| Type | Prop | Values | Default |
| --- | --- | --- | --- |
| `PhotoFrameFit` | `fit` | `'cover' \| 'contain'` | `cover` |

**New convention (approved by the owner, PF-1):** `image-fit` · name `fit` · meaning: how a replaced image is scaled inside its already-reserved viewport — fill and crop (`cover`) or show whole and letterbox (`contain`). Use: a media component exposes a finite set of static scaling policies independent of its proportion and crop alignment. Avoid: reserved proportion, absolute width/height, crop alignment, Material tone, arbitrary inline CSS. Component type: PhotoFrame (`PhotoFrameFit`).

**Why not the near matches**

- `ratio` (`aspect-ratio`): its approved *Avoid* text excludes "image crop or object-fit policy"; it reserves space, it does not scale the image.
- `focalPoint` (`image-focal-point`): chooses *which area* is prioritised (object-position); it cannot switch crop↔whole. It stays orthogonal.
- `variant` (`visual-treatment`): Material framing only; mixing scaling into it multiplies values (`framed` × fit) and breaks its meaning.
- No existing `size`/`preset` entry carries image scaling.

## 3. Behavior

| Input | Result |
| --- | --- |
| `fit` omitted, `'cover'` or unknown | Byte-identical output to v0.4: same class string, same markup, no new attribute. Unknown runtime values normalise to `cover` and never reach the DOM. |
| `fit="contain"` | Image is scaled to fit entirely inside the existing viewport (`object-contain`); the spare axis is letterboxed. Reserved size is unchanged: presets/numeric ratios still reserve through `AspectRatio`, `auto` still fills the host height. |
| `contain` background | The viewport stays transparent; the bars show the existing media-frame Material Surface (`surface-1`, or `surface-0` for `framed`). **No new token, paint, gradient or shadow.** |
| `contain` + `focalPoint` | `object-position` still applies; it aligns the letterboxed image on the spare axis (e.g. `left` pins a tall image to the left edge of its letterboxed viewport). With a matching proportion nothing is visible. No class change versus today beyond `object-contain`. |
| `contain` + `variant="framed"` | Allowed; framed recipe, padding and static tilt unchanged. |
| `fit` changes at runtime | Only the static scaling class changes; no re-fetch, no reset. |

Story note (PF-5): the `Fit` story recommends `portrait` or a numeric `ratio` for tall images under `contain`, since `landscape` shrinks them heavily; documentation only, no API change.

Planned implementation shape (informative): a static `fit` CVA axis in `types.ts`; `contain` adds `object-contain` after the base string and `cn()` resolves the `object-cover` conflict, so the default string is untouched.

## 4. Accessibility

Unchanged: native `figure`/`img`, no role, no focus, no ARIA added. `alt` and caption model untouched. Letterbox bars are paint only and carry no content.

## 5. Compatibility

Additive and optional. No default change, no removed value, no new marker (PF-2), no export change beyond the new `PhotoFrameFit` type. Existing consumers (including `TipCard`, which reuses `PhotoFrameFocalPoint`) are unaffected. Registry follow-up (outside this amendment): new `image-fit` entry plus the PhotoFrame usage, then `pnpm props:docs` / `pnpm props:check`.

## 6. Acceptance criteria

All checks are **planned**; none was executed.

| ID | Promise | Planned test / method | Planned story / visual | Evidence |
| --- | --- | --- | --- | --- |
| PF5-01 | Default and `cover` output is byte-identical to v0.4 (class strings, attributes, markup) | `PhotoFrame.test.tsx`: compare serialised DOM omitted vs `cover` vs unknown; existing cases retained | `Ratios`, `FocalPoints` | Pending |
| PF5-02 | `contain` renders `object-contain` and not `object-cover` on the image only | DOM class assertion over every ratio and `auto` | `Fit` | Pending |
| PF5-03 | Unknown `fit` falls back to `cover`, nothing leaks to the DOM | Extend fallback test | — | Pending |
| PF5-04 | `contain` keeps reservation: `AspectRatio` padding unchanged for presets/numeric; `auto` unchanged | Existing ratio assertions parametrised by `fit` | `Fit` | Pending |
| PF5-05 | No inline appearance, arbitrary value or new paint; letterbox shows the media Surface classes | No-`style` assertion; media class equality across fits; emitted-CSS check in `scripts/package-exports.test.mjs` for `.object-contain` | `Fit` | Pending |
| PF5-06 | `contain` composes with `focalPoint`, `framed` and caption without new classes beyond the union | Combination matrix | `Fit` | Pending |
| PF5-07 | A tall screenshot is **not cropped** with `contain` (whole image visible) while `cover` still crops | Browser check via Playwright MCP: tall fixture, compare the image's rendered box to the viewport and confirm both axes fit inside | `Fit` (tall fixture) | Pending |
| PF5-08 | Metadata: `@control select`, JSDoc in English, export of `PhotoFrameFit`, no manual `argTypes` | Docgen/export checks | Docs page | Pending |
| PF5-09 | No stylesheet, token, dependency or extra module; six files preserved | File-set review | — | Pending |

### Visual references

| ID | Subject | Status |
| --- | --- | --- |
| VIS-07 | Tall screenshot, `cover` vs `contain`, same ratio, dark | Pending capture |
| VIS-08 | `contain` + `framed` + `focalPoint="top"` | Pending capture |

Captures follow `docs/design/` (Playwright MCP, conditions and hashes recorded in a later `capture.json`). Visual conformity: **Not evaluated** until captured.

## 7. Owner decisions (resolved 2026-11-20)

The owner replied "Acepto todas", accepting every recommendation: PF-1 approve the `image-fit` / `fit` convention; PF-2 no `data-fit` marker, so default output stays byte-identical; PF-3 `focalPoint` stays active under `contain`; PF-4 letterbox bars show the existing media Surface (no matte, no new token); PF-5 a story note recommends `portrait` or a numeric ratio for tall images under `contain`, with no API change. The options below are kept as the record.

1. **Convention approval.** Approve `image-fit` / `fit` as a new convention? *Recommend yes*; required before the usage lands. **Resolved (PF-1): approved.**
2. **Marker.** Add `data-fit`? It would break byte-identical default output unless emitted only for `contain`. *Recommend no marker*; the image class is observable and tests assert it. **Resolved (PF-2): no marker.**
3. **`focalPoint` under `contain`.** Keep it active (aligns the letterboxed image) or ignore it? *Recommend keep active*: zero extra code, consistent with `object-position` semantics. **Resolved (PF-3): stays active.**
4. **Bar paint.** Show the media Surface through the bars (proposed) or add a distinct matte? *Recommend the Surface*; a matte needs a recipe/token approval. **Resolved (PF-4): media Surface, no matte.**
5. **Ratio for tall screenshots.** `contain` with `landscape` shrinks tall images heavily. Should the story recommend `portrait`/`ratio` numeric for such media? *Recommend documenting it in the story only*, no API change. **Resolved (PF-5): story note only.**
