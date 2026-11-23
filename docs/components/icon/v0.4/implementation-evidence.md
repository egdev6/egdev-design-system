# Icon v0.4 implementation evidence

## Authority and scope

The approved [arrow-left amendment](arrow-left-amendment.md) has payload SHA-256
`ab4b9e389e367aaec8b9f3cffc8b8ec2969de56819638a3fc13830a531b7e94c`. The owner approved its
implementation plan (odd/tasks/consumer-request-specs.md L33); this record is not an independent
review or a new expected-design approval. The bounded implementation covers S13 and #537.

The new physical glyph reflects the existing Foundation `arrow-right` coordinates about x=12.
It introduces no runtime mirroring or navigation, public prop, dependency, token or stylesheet.
The application chooses the direction for its own interaction, including in RTL. The existing
47 names and the Lucide ISC and Feather MIT notices are retained. `IconName` remains a closed
union; consumers with exhaustive maps or switches must handle the added member.

## Observed test-first evidence

- **RED:** `pnpm exec vitest run packages/ui/src/atoms/icon/Icon.test.tsx --maxWorkers=2 --no-cache --configLoader runner`
  exited 1: 7 failed, 67 passed. Failures were the missing glyph, 47-name inventory and Gallery.
- **RED:** `pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2 --no-cache --configLoader runner`
  exited 1: 3 failed, 417 passed; Icon and FieldMessage still exposed 47 names.
- **RED:** `pnpm typecheck` exited 2 because `arrow-left` was not accepted by `IconName` or the
  shared FieldMessage prop. The FieldMessage focused command below also failed 1 of 11 tests
  because the glyph was missing.
- **GREEN:** the Icon focused command above exited 0, 76/76 after adding the Directions story check.
  The metadata command exited 0, 420/420; `pnpm typecheck` exited 0; and
  `pnpm exec vitest run packages/ui/src/atoms/field-message/FieldMessage.test.tsx --maxWorkers=2 --no-cache --configLoader runner`
  exited 0, 11/11. The metadata GREEN initially exposed a test expectation for Storybook's quoted
  string default summaries; correcting that expectation made the full metadata command pass.
- Existing right-arrow, download/external-link, preset, fill, native passthrough, accessibility,
  root identity, Gallery and file-contract regressions remain. The new tests also assert all 48
  exact names, both physical directions in LTR and RTL, same-root rerenders and the FieldMessage
  override. TypeScript checks the public `IconName` and `IconProps.name` exports.

## Other observed checks

| Command | Result |
| --- | --- |
| `pnpm exec vitest run packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2 --no-cache --configLoader runner` | Exit 0; 87/87. |
| `pnpm test --no-cache --configLoader runner` | Exit 0; 152 files, 3,468 tests passed. jsdom printed three `Not implemented: navigation to another Document` notices. |
| `pnpm lint` | Exit 0; 1,084 files checked. |
| `pnpm exec biome check packages/ui scripts` | Exit 0; 665 files checked after correcting initial formatting diagnostics. |
| `git diff --check` | Exit 0; no tracked-diff whitespace errors. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Exit 0; 118 rows regenerated. The generator has no check mode. |
| `pnpm props:docs` and `pnpm props:check` | Exit 0; generated naming reference is current. |
| `pnpm test:props` | Exit 0; 132/132. |
| `pnpm artifact --write`, `pnpm system:docs`, `pnpm artifact --check`, `pnpm system:check` | Exit 0. Both generated system files remained byte-identical to the base. |
| `pnpm test:artifact` | Exit 0; 45/45, including the 768 KiB budget and required Icon enum without a fabricated glyph-value list. |
| `pnpm test:system` | Exit 0; 36/36. |

The four `IconProps` naming usages were manually reviewed against the final source and refreshed to
whole-file SHA-256 `81b4efe2a2f4ec337bac642fad1bb25f6bfe1fa3e04bd12a58c0dd24e276ab97`.
The existing `icon-glyph-name` convention and its approval are unchanged; its usage now records 48
names. The artifact schema does not enumerate those values, so neither the artifact nor MCP is
claimed to provide a glyph-value list. The source-derived artifact remained 773,884 bytes; no
system changelog entry was added for unchanged output.

## Observed implementation capture

The [component crop](captures/arrow-left--default--1280x900--dark.png),
[supplementary directions matrix](captures/directions--default--1280x900--dark.png) and
[capture metadata](capture.json) are real Chrome observations, not expected-design references.
The current Icon and Directions story were bundled from source into system temporary storage;
`react-dom/server` rendered static HTML with separately scratch-built native token and UI/story
CSS. Headless Chrome 148.0.7778.167 opened the local file through CDP, without a server or network.
The first scratch fixture omitted emitted token declarations; it was corrected and both accepted
PNGs were captured again with the native token CSS loaded.

Conditions: 1280 × 900 CSS pixels, DPR 1, 100% zoom, default dark token canvas, normal state,
no-preference motion and transparency. Browser-computed canvas was `rgb(20, 21, 24)`; all twelve
arrows retained the specified path data, `transform: none`, currentColor stroke, 1.75px stroke
width, round caps/joins and no fill. Observed preset dimensions were 12.796875px, 16px and
22.390625px. The requested Google fonts were unavailable offline; the parent accepted actual
fallbacks. Chrome reported DejaVu Sans for story labels and sans, Liberation Sans for the display
probe, and DejaVu Sans Mono for the mono probe. The PNG hashes, source hashes, measured boxes,
font details and exact crop conditions are in `capture.json`.

VIS-01 is a historical board without this glyph; VIS-02 has no adopted expected-design image.
**Expected-design visual conformity: Not evaluated.** A static image does not establish assistive
technology behavior or actual Storybook Controls.

## Pending parent-owned verification

- Fresh repository `pnpm build`, the built `node --test scripts/package-exports.test.mjs`, and
  `pnpm test:package-consumption` for React 18.3.1 and 19.3.0, including the updated type, SSR,
  client rerender and no-Tailwind-compiler fixtures.
- `pnpm test:mcp`, including the new Icon `get_component` assertion and the existing
  `get_design_system_md` golden-byte test; the command itself builds `packages/mcp/dist`.
- The plan's Storybook build and actual browser Controls inspection for both Icon `name` and
  FieldMessage `icon`; installed extraction/enhancer tests are not a browser-widget result.
- Recheck artifact and system freshness after the repository build, since the system build
  regenerates JSON. Independent review, screen-reader review, consumer adoption and release remain
  separate.
