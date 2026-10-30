# FieldMessage v0.2 — observed verification

The local implementation passes functional/package gates and bounded real-browser checks. No commit, push, PR or merge has been performed. Assistive-technology speech and universal pixel parity are not claimed.

## Functional gates

Observed on Linux in `feat/179-field-message`, based on main `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`. Commands used serialized, memory-capped scopes.

| Check | Result |
| --- | --- |
| `pnpm lint` | Passed |
| `pnpm typecheck` | Passed, including tests |
| `pnpm build` | Passed |
| `pnpm test --maxWorkers=4` | 85 files / 1613 tests passed |
| `pnpm props:check` | Passed; 130 entries, including two explicitly proposed conventions |
| `pnpm test:props` | 88 passed; historical receipts unchanged |
| `pnpm test:package-exports` | 77 passed |
| `pnpm test:package-consumption` | 12/12; React 18.3.1 and 19.3.0, SSR/client/CSS, no consumer Tailwind requirement |
| `git diff --check` | Passed |

Test-first evidence: absent atom modules failed first; Icon's approved 45-name inventory failed against the old 42. New Field tone/composition cases failed 5/5 while all 29 prior Field cases passed. After implementation, the focused atom/Icon/Field suite passed 107 cases; final full gates include metadata/inventory fixes and the original behavior assertions. Existing ProgressBar fixture nesting warnings remain unrelated.

## Real browser

Playwright MCP drove Chrome 156 on Windows, independently from Linux CLI checks. [Raw measurements](observed/browser-checks.json) and an [observed focused invalid Field](observed/field-invalid.png) are implementation evidence, not replacements for the [adopted specimen](field-message-five-tones.png).

- Verified all five tone colors, 14px/400 annotation typography, icon presence/decorative semantics and absence of derived role/aria-live.
- Verified info/warning/success guidance, invalid error, choice and disabled Field stories: associated message ids, only errors setting invalidity, label-to-control focus, checkbox activation, choice-column placement and single 0.45 annotation-wrapper opacity.
- Verified real Docs widgets: five-value tone select and 45-value icon select actually changed the rendered story; Field hintTone offers description/info/warning/success, not error.
- Inspected the captured invalid Field. Message anatomy, glyph and typography follow the adopted direction; its input/counter/focus remain existing Field/control responsibilities.

## Theme context and limits

Existing `.storybook/palette.css` intentionally maps primitive red-300 to brand neon. Therefore unmodified Storybook error text resolves to rgb(255,0,54), while canonical published tokens and the specimen resolve to rgb(255,102,128). The component follows the active status-danger token correctly. Browser comparison also applied the canonical red-300 value read from published tokens **in the page only**; no theme, token or control source was edited to hide the difference.

The full specimen used a 1100×950 viewport; the observed Field crop used 526×360 with a roughly 494px-wide component. Font file equivalence is unverified. These checks establish bounded anatomy/token/typography/function evidence, not a universal screenshot-diff tolerance. Actual assistive-technology speech remains **Not evaluated**.

Active LSP probes retained old module-not-found/unused-expect-error findings on the new test after its dependencies existed; refresh did not clear them. CLI TypeScript covers tests and passed, as did all functional gates. Do not describe the LSP result as clean.
