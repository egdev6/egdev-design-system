# Dialog v0.4 implementation evidence — #543

## Scope and provenance

- Contract: `sheet-layout-amendment.md`, payload SHA-256 `76666ef717749c13bb16742ef7f064ee547591a79599b6bc12a04471aedc3048`.
- Baseline: pre-change `packages/ui/dist` built by the parent; plan baseline `aa35a0d20d7a6d6c324a19cafd3966be885a8c74`. The pre-implementation browser baseline was also captured before runtime edits (then-harness SHA-256 `61444cc7df155f44ee3549442c34b96274a587f9a16460037f92506536410360`).
- Current `packages/ui/src/molecules/dialog/types.ts` SHA-256: `99b735d897a1aff3462b4e89c5ab67da1df7cd17441b5d817bcac3f5aaea7f7f`. All 16 prior naming usages and two proposed usages pin this revision. Re-check after review if the file changes.
- `packages/system/design-system.json`: 599,314 bytes, below 768 KiB. New `dialog-title-overflow` and `dialog-action-placement` conventions remain **proposed**, not globally approved.
- Tests were added and observed failing before runtime implementation; the pre-compaction record does not preserve the exact RED failure count. The final focused Dialog run passed 47 tests. Do not interpret this as a complete RED-count receipt.

## Browser setup

Both commands passed in sequence:

```sh
node docs/components/dialog/v0.4/browser-evidence.mjs baseline
node docs/components/dialog/v0.4/browser-evidence.mjs candidate
```

Harness SHA-256 for both final runs: `f59d3f0ecd030f031f85b4c7256079f63b407a88e583c06ad3b22c32d3d41290`. Chrome `148.0.7778.167` / protocol `1.3`, headless Linux, viewport 1000 × 800 CSS px, DPR 1, default 100% zoom, default motion/transparency preferences. The SSR shell is hydrated so Radix mounts its real portal. HTTP(S) is blocked; production tokens/CSS are inline. Computed font-family lists Barlow and Barlow Condensed with fallbacks; the actually rendered installed face was not independently identified, and no font download is claimed. Baseline reads the existing dist; candidate bundles current source and compiles CSS in fresh system-temp scratch, with no consumer Tailwind compiler in the page. The harness owns and removes its scratch. No dev server or screenshot is used.

## Observed measurements

All dimensions are CSS px; fractional differences below are rounding. A 440 × 600 bordered host had a 436 × 596 overlay padding box. The default capped sheet was 307.1875 wide in both phases; `size='full'` was 436 wide and filled that overlay. A 340-wide RTL host had a 336-wide overlay and a 307.1875-wide default sheet at its inline end. Baseline and candidate panel width/height and computed panel/scrim backgrounds matched for four centered sizes (384, 512, 768, 1000 widths), capped inline and stacked sheets, compact body, RTL sheet, AlertDialog and CommandPalette. Other rectangles were recorded but not asserted as baseline/candidate equal. This is not pixel-level visual approval.

- Combined opt-ins at 440 × 600: panel 436 × 596, body 434 × 455.921875, header-action `div` 434 × 64.984375, 2 visible title lines, 23.04 line height. With body `scrollTop` set to 300, overlay stayed at 0; action coordinates after that scroll were not asserted. The full title remained in the DOM and Chrome's accessibility tree; Chrome reflected the existing uppercase text transform in its accessible name. Description was `Adjust preferences.`
- Two-line title and status baselines were 85.836875 and 85.828125 respectively; inline description was also 85.828125. In the compact stacked RTL fixture the status baseline was 85.828125 and the description was on its next line at 111.25. Long and unbroken titles had at most two visible range-rectangle lines in the exercised fixtures.
- At host height 240 the overlay was 236 high and the body was 95.921875 high, with no overlay overflow. At host height 130 the overlay was 126 high and its scroll height was 223; the body border box was 83.1875 high including 19.2 top and bottom padding, leaving approximately 44.8 content height (`--space-14`). A real mouse-wheel event moved the short overlay by 97. Top actions can therefore scroll out of view only in this exceptional opted-in state; unchanged and full-only sheets do not opt in.
- Built-in close root was 38.390625 square with a 44.7969 square `::after`; `--space-14` resolved to 44.8 and `--space-1` to 3.2. The harness sent 324 stationary centre/edge/corner mouse and emulated-touch sequences (162 each), checking pointer-down, pointer-up and click targets for close and sheet icon actions in LTR/RTL, including `sm`, `md`, `lg` and a genuinely wrapped row. Both deliberate insufficient-gap controls targeted the second button, and both clipped controls targeted `HTML`, proving those four controls were detected. This is emulation, not physical-device evidence.
- Initial focus in the combined fixture was Edit action; Tab then reached Apply, Body field, Body action and Close. Escape requested closure and a controlled rejection retained the dialog. The harness checks the title and description in the Chrome accessibility tree, not an assistive-technology reading.

## Verification and outstanding gates

Focused Dialog 47/47; Dialog accent + AlertDialog + CommandPalette 33/33; IconButton + Text 105/105; Storybook docgen/Controls/CSS 512/512. `pnpm typecheck`, `pnpm props:docs`, `pnpm props:check`, `pnpm test:props` (133/133), `pnpm artifact --write`, `pnpm system:docs`, `pnpm artifact --check`, `pnpm system:check`, `pnpm test:artifact` (51/51), `pnpm test:system` (36/36), and `pnpm exec biome check packages/ui scripts` passed. The first Biome run reported formatting in three fixture/test files; after corrections the same command passed.

The parent owns fresh repository `pnpm build`, `pnpm test:package-exports` and `pnpm test:package-consumption`; the added packed fixtures have **not** been run against a fresh candidate build here. Recheck artifact and system freshness after that build. Broad `pnpm test`, `pnpm lint` and `pnpm storybook-build` were not run by this worker.

Extended candidate run (2026-11-23, Chrome 148, harness SHA-256 `ad3d888f9b479a955c8cf2638be642e5a2f063b9babc1e8e229656488d8b3489`, `failures: []`) observed:

- 864 edge hit-test sequences (432 mouse, 432 emulated touch);
- an 8-case keyboard and modal matrix (Tab/Shift+Tab containment, Escape, scrim dismissal, trigger focus restoration and controlled rejection, for header and footer placement);
- 16 four-sided focus-ring samples across LTR/RTL at 100% and emulated 200% zoom;
- 10 gap checks;
- 4 resize transitions across the insufficient-host threshold, in both directions;
- 2 preference checks (reduced motion, forced colors);
- the title route revealing the full title by keyboard.

The `sm/sm` header gap computes to 22.4px in CSS and lays out at 22.390625px (1433/64). That is within one Chrome LayoutUnit (1/64 px) of the 22.40315px outset-plus-token threshold, so the harness compares with that tolerance and keeps the edge probes strict. 200% zoom is CDP device-scale emulation, not browser zoom UI.

Known cross-component finding, out of #543 scope: under forced colors, Button and IconButton suppress their focus shadow while keeping `outline-style: none`, so consumer-supplied controls lose a visible focus indicator. The Dialog-owned assertions pass. This needs its own issue.

Still **Pending**, not proven by the above: real assistive-technology review; real Storybook Controls review; physical touch; real browser zoom UI; viewport-scoped custom mount and transformed/clipping constraints; reduced-transparency/unsupported-filter probes; packed-consumer evidence. VIS-01–03 remain Pending and visual conformity is **Not evaluated**. Do not remove downstream Recado mitigations until release, upgrade and Recado's own verification.
