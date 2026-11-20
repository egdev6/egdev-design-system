# AttachmentField v0.1.1 reset and PhotoFrame v0.5 fit — joint implementation and verification record

- **Amendments:**
  - [AttachmentField v0.1.1](../../attachment-field/v0.1.1/reset-amendment.md): `contentSHA256: 3803812f0f16bb755328c8d10b72bbea3f341e393c475eb96ad2e9bba1c158a0`.
  - [PhotoFrame v0.5](fit-amendment.md): `contentSHA256: f201262463ed1b01eb5e2bed88dcb0c82368b4c0e1540041db960d3cc76e0f49`.
  - Both approved 2026-11-20 ("Acepto todas").
- **Plan:** [implementation-plan.md](implementation-plan.md), approved 2026-11-20 ("Apruebo con las recomendaciones").
- **Issues:** #508 (AttachmentField) and #509 (read-only images), requested by Recado. Branch `feat/attachment-reset-photo-frame-fit`. Task log: `odd/tasks/attachment-reset-photo-frame-fit-build.md`.
- **Captures:** implementation captures, recorded as Proposed references (VIS-07/08 authorized). Visual conformity is **Not evaluated**.

## Commits

| Unit | Commit | Content |
| --- | --- | --- |
| 1 | `964fa64` | AttachmentField clears rejections when the parent changes the controlled `value` externally (compared with the last list the field requested). Silent, focus unchanged, no API change. |
| 2 | `54875c2` | PhotoFrame `fit: 'cover' \| 'contain'` with a literal `object-contain` on the image recipe. Unknown values fall back to `cover`, there is no `data-fit`, and 18 default fingerprints are pinned from the unmodified code. `PhotoFrameFit` is exported. Fit story with a 300 × 900 fixture. |
| 3 | `0dd6e56` | Controls row, package-exports and package-consumption checks for `fit` and `object-contain` |
| 4 | `38a8038` | `image-fit` convention with approval record `docs/decisions/prop-naming-photo-frame-fit-approval.json`, 4 PhotoFrame usage revisions refreshed, regenerated system artifact |
| 5 | this commit | This record and the captures |

## Automated checks (observed)

| Check | Result |
| --- | --- |
| AttachmentField unit 1, RED → GREEN | 4 failed / 83 passed → 87/87. The echo guards passed before the fix, as planned. An extra test proves that a parent re-creating the array on every render does not loop. |
| PhotoFrame unit 2, RED → GREEN | 35 failed → 91/91. Before the fix, `fit` leaked onto `<figure>` as a native attribute. |
| AttachmentField, PhotoFrame and `lib` | 793/793 |
| `pnpm typecheck`, Biome on changed files | Clean |
| `props:check`, `test:props`, `test:artifact`, system tests | Valid; 130/130; 34/34; 31/31 |
| `test:package-exports`, `test:package-consumption` | 137/137; 14/14 |

## Real browser (Chrome 157, Windows, Playwright)

| Check | Observation | Result |
| --- | --- | --- |
| PF5-07: tall screenshot under `contain` (`Fit` story, 900 px viewport) | Under `ratio='portrait'` (415 × 519), `cover` crops the 300 × 900 fixture and `contain` shows it whole. With a numeric `1/3` ratio both fits show it whole. `landscape` with `contain` shows it whole, scaled down. `framed` with `focalPoint='top'` and `contain` shows it whole, top-aligned (`object-position: 50% 0%`). | Pass |
| AttachmentField reset (`Controlled` story, 520 px viewport) | With focus in the Textarea, "Clear after save" empties the list (4 → 0) and focus stays on the Textarea. | Pass |
| AttachmentField rejection cleared by an external reset | Not exercised in the browser: the `Controlled` story sets no type or size limits, so no rejection could be produced there. The unit tests cover it (AC-14a/c/d). | Unit tests only |

## Captures (Proposed references)

Conditions: Chrome 157 on Windows, Playwright, device scale 1, dark theme, 2026-11-20.

| Visual ID | File | Scenario | sha256 (prefix) |
| --- | --- | --- | --- |
| VIS-07 | [vis-07-photo-frame-fit.png](vis-07-photo-frame-fit.png) | PhotoFrame Fit story: cover vs contain on a tall screenshot | `76d17a07d1d4fbd8` |
| VIS-08 | [vis-08-attachment-after-reset.png](vis-08-attachment-after-reset.png) | AttachmentField Controlled story after "Clear after save" | `af4f15751d0fb496` |

## Not evaluated

- Firefox, Safari and Recado's WebView2, which is the next real check for #508.
- Real screen readers.
- A browser run of rejection clearing (see above).
