# AttachmentField v0.1 — implementation and verification record

- **Spec:** [spec.md](spec.md), v0.1, approved 2026-11-19, `contentSHA256: 47db068c2d055ad342efb895e513db27a258ddef661ee134d4ff42248f5aa7ad`.
- **Plan:** [implementation-plan.md](implementation-plan.md), approved 2026-11-19 (OQ1 approval record; OQ2–OQ8 as proposed; VIS captures authorized).
- **Canonical issue:** #497 (requested by Recado). Branch `feat/attachment-field`. Task log: `odd/tasks/attachment-field-build.md`.
- These are implementation captures and observations, not approved expected-design references. Visual conformity is **Not evaluated**: the spec has no source artboard, so VIS-01..04 are recorded as **Proposed** references.

## Commits

| Unit | Commit | Content |
| --- | --- | --- |
| 1 | `c10d2e0` | List (controlled and uncontrolled), container paste, type → size → count validation, rejection messages |
| 2 | `05e883c` | Object URLs, thumbnail strip, Remove, focus after removal, announcements, disabled; count-aware plural for the count rejection |
| 3 | `cc4225a` | Stories, barrel export, Storybook/CSS wiring, controls rows, package-exports and package-consumption fixtures; client-only layout effect (fixes a React 18 SSR warning) |
| 4 | `b6334a2` | Prop-naming conventions `accepted-file-types`, `max-file-bytes`, `max-file-count`, `files-rejected` with approval record; catalog row; regenerated system artifact |
| 5 | this commit | Validation story uses the DS `Link`; this record and the captures |

## Automated checks (observed)

| Check | Result |
| --- | --- |
| Unit 1 RED → GREEN | Collection failed (module not found) → 52/52 |
| Unit 2 RED → GREEN | 25 failed / 54 passed → 79/79 |
| Unit 3 RED | Controls test 1 failed (missing native-prop filter); package-exports export-list mismatch |
| `AttachmentField.test.tsx` + `storybook-controls.test.ts` | 339/339 |
| Neighbouring molecules | 1040/1040 |
| `pnpm typecheck`, `pnpm build`, Biome on changed files | Clean |
| `pnpm test:package-exports` | 137/137 |
| `pnpm test:package-consumption` (React 18.3.1 and 19.3.0) | 14/14. The React 18 SSR `useLayoutEffect` warning first appeared here, then 0 after the fix |
| `pnpm props:check`, `pnpm test:props` | Valid; 130/130 |
| `pnpm test:artifact`, system tests, `system-md --check`, `build-artifact --check` | 34/34; 31/31; clean; clean |
| Docgen of the controlled/uncontrolled union (risk R4) | All 11 own rows present; no API softening needed |

## Real browser (Chrome 157, Windows, Playwright; Storybook `Molecules/AttachmentField`; viewport 480×640 unless noted)

| Plan check | Observation | Result |
| --- | --- | --- |
| 1. Paste from the Textarea (trusted Ctrl+V) | In this automation harness the system clipboard is unavailable even to a plain `<input>`: `navigator.clipboard.readText()` returns empty and Ctrl+V inserts nothing | **Not evaluated** (environment) |
| 1b. Mixed clipboard (synthetic `ClipboardEvent` with text and a PNG file, dispatched on the Textarea) | `defaultPrevented` true, one attachment added, focus stays in the Textarea | Pass (untrusted event) |
| 3. Pick through the native input (`setInputFiles`) | The file is attached through the same intake | Pass |
| 4. Rejections (`Validation` story: `.bmp` and a 3 MB PNG) | Two messages in rule order (type, size). The Dropzone `aria-describedby` lists both message ids. The status region reads both messages | Pass |
| 5. Focus after removal (`WithAttachments`, three items) | Removing the middle item with Enter focuses the next Remove button. Removing the last with Space focuses the previous one. Removing the only item focuses the Dropzone. The status region announces the removal | Pass |
| 6. Reduced motion (`reducedMotion: 'reduce'`) | Root, list and item: `transition-duration 0s`, no animation | Pass |
| 7. Layout (`ManyItems`, 320 px viewport) | Five 64 px thumbnails wrap onto two rows with no overflow. In RTL the Remove button sits at the logical end (left) corner | Pass |
| 8. Touch target | Remove button measures 25.6 × 25.6 px, the documented limitation (owner decision Q7) | Recorded |
| Disabled (`Disabled` story) | Root has `data-disabled`, and every Remove button is disabled | Pass |

Also found and fixed during verification: the `Validation` story rendered its sample-file downloads as unstyled anchors. They now use the DS `Link`.

## Captures (Proposed references)

Conditions: Chrome 157 on Windows, Playwright element screenshot of `.eg-attachment-field`, 480 px viewport, device scale 1, dark theme, default motion, 2026-11-19.

| Visual ID | File | Scenario | sha256 (prefix) |
| --- | --- | --- | --- |
| VIS-01 | [vis-01-empty.png](vis-01-empty.png) | Empty field (`Default`) | `0e7ffeafe59c8b33` |
| VIS-02 | [vis-02-thumbnails.png](vis-02-thumbnails.png) | Three thumbnails with Remove buttons (`WithAttachments`) | `9a2da05114418496` |
| VIS-03 | [vis-03-rejection.png](vis-03-rejection.png) | Type and size rejection messages (`Validation`) | `c3acecc8415b00c7` |
| VIS-04 | [vis-04-disabled.png](vis-04-disabled.png) | Disabled with a populated strip (`Disabled`) | `c6c4382bb84af411` |

## Not evaluated

- A trusted OS paste (blocked by the harness; Recado's WebView2 is the next real check).
- Real screen-reader behavior for repeated identical announcements (plan risk R3).
- A real OS file chooser, touch hardware, Firefox, Safari, forced colors.
- The Storybook Controls panel's visual widgets (plan check 9). The controls test asserts the rows instead.
