# AttachmentField v0.2 `resetKey` — implementation and verification record

- **Amendment:** [reset-key-amendment.md](reset-key-amendment.md), `contentSHA256: 3d83fc4b53f8617a54c7c4de89306e3d6153157fe30fcce766991c82700a1263`, approved 2026-11-20 ("Apruebo todo (recomendado)").
- **Plan:** [implementation-plan.md](implementation-plan.md), approved 2026-11-20 ("Apruebo con las recomendaciones").
- **Issue:** #516, requested by Recado. Branch `feat/attachment-field-reset-key`. Task log: `odd/tasks/attachment-field-reset-key.md`.
- **Captures:** implementation captures, recorded as Proposed references. Visual conformity is **Not evaluated**.

## Commits

| Unit | Commit | Content |
| --- | --- | --- |
| 1 | `a0071a0` | `resetKey?: string \| number` with a shared silent `clearFeedback()`, which clears the rejection messages and the status text. Both a token change after mount (`Object.is`) and the v0.1.1 external clear use it. The mount value is inert. The Controlled story accepts PNG only and its "Clear after save" bumps `resetKey`. |
| 2 | `5ed905c` | `transient-feedback-reset-key` convention with approval record `docs/decisions/prop-naming-attachment-field-reset-key-approval.json`, 9 AttachmentField usage revisions refreshed, controls row, docgen checks, consumption fixtures |
| 3 | this commit | Regenerated system artifact, this record and the captures |

## Automated checks (observed)

| Check | Result |
| --- | --- |
| Unit 1, RED → GREEN | 11 failed / 87 passed, then 8 failed / 90 passed after the helper fix (failing on uncleared rejections and a non-empty status) → 98/98 |
| AttachmentField and `lib` | 714/714 |
| `pnpm typecheck`, Biome on changed files | Clean |
| `props:check`, `test:props` | Valid; 131/131 |
| `test:artifact`, `build-artifact --check`, `system-md --check` | 34/34; clean; clean |
| `test:cli`, tokens tests | 115/115; 72/72 |
| `test:package-exports`, `test:package-consumption`, `test:package-release` | 137/137; 14/14; 24/24 |

## Real browser (Chrome 157, Windows, Playwright; `Controlled` story, 520 × 720)

Recado's exact flow, with focus in the Textarea throughout:

| Step | Observation | Result |
| --- | --- | --- |
| Empty the list with "Clear after save" | 0 items, no messages, empty status | Pass |
| Pick `shot.svg` (only PNG accepted) | "shot.svg was not added: only PNG files are allowed." is shown, wired to the Dropzone's `aria-describedby`, and announced | Pass |
| Type in the Textarea | The message, `aria-describedby` and status text stay | Pass |
| "Clear after save": `value` stays `[]` and `resetKey` increments | The message and `aria-describedby` are gone, the status text is empty and focus stays on the Textarea | Pass |

## Captures (Proposed references)

Conditions: Chrome 157 on Windows, Playwright, 520 × 720 viewport, device scale 1, dark theme, 2026-11-20.

| File | Scenario | sha256 (prefix) |
| --- | --- | --- |
| [vis-09-reset-key-before.png](vis-09-reset-key-before.png) | Rejection shown while typing, list empty | `f9087561336f6c02` |
| [vis-09-reset-key-after.png](vis-09-reset-key-after.png) | After "Clear after save" bumps `resetKey` | `9ee23d3061779704` |

## Not evaluated

- Screen-reader silence when the feedback clears. No screen reader is available in this environment.
- Firefox, Safari, and Recado's WebView2, which is the next real check.
