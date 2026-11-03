# TopBar v0.1 — initial browser check

S3 / DI2; partial TB-03, TB-05, TB-06, TB-07 evidence. Chromium headless shell 1243, dark scheme, Storybook 6032, 1280×800 and 390×800 CSS px. Raw first measurements are in `browser-functional-checks.json`; follow-up with a 500ms focus-restoration wait is in `browser-functional-checks-followup.json`. Screenshots preserve initial output. Storybook imports UI `compiled.css` → `index.css`; this is not proof of the packed shipped stylesheet or its import order.

## Findings

| Check | Result | Evidence / limitation |
|---|---|---|
| G4 legacy transition reset | **FAIL** | First measurement: root transition-duration `0.3s, 0.3s, 0.3s, 0.3s`, rather than no transition, in transparent and glass. Source has `transition-none`, but the legacy `.eg-topbar` transition wins in the actual Storybook cascade. Proposed fix: find an owner-approved cascade-compliant local reset, without `!important` or editing legacy; G4 explicitly requires stopping for a separately approved solution if utilities cannot win. Source not modified. |
| TB-05 widths | **PASS (display/AX only)** | At viewport 1280 and 390, artificially set root widths 899, 899.5, 900, 900.5, 901px: nav/full hidden and compact/mobile shown through 900; reverse above 900. AX tree omits Home/About when compact and Menu when desktop. At 390 viewport the artificially 900px-wide bar exceeds viewport; this demonstrates container independence, not usable narrow-host layout. Actual tab sequence for every boundary and 200%/400% zoom not checked. |
| TB-03 paint | **PASS (observed properties)** | Transparent background rgba(0,0,0,0), backdrop none, transparent 1px border and visually transparent shadow; glass rgba(35,36,40,0.84), blur(20px) saturate(1.5), 1px rgba(255,255,255,0.14) border, edge/elevation shadow. Reduced transparency glass rgb(35,36,40), backdrop none, border/shadow retained. Token equality and prefixed filter not independently resolved. |
| TB-03 reduced motion | **PASS (root only)** | With reduced motion and transparency emulated together, root transition and animation durations are 0s; descendants not measured. |
| TB-07 fixed / containment | **PASS (limited)** | At 1280, fixed top 0 before/after scroll, root container-type normal/name none, internal container inline-size, z-index 10, height 55.390625px. Host clearance, transformed ancestors, portal geometry and obscured focus not measured. |
| TB-07 keyboard/current | **PASS (limited)** | Desktop Tab: Studio → Home → About → Search → Account. Nav links had 2px solid focus outline; supplied controls use UA outline. `aria-current=page` computed underline. Shift+Tab, Enter, hover, actual contrast and native link modifiers not checked. |
| TB-06 Dialog/Menu | **PASS (basic)** | 390px Dialog opened, initial focus on Close; Escape closed and restored Menu focus after 500ms. 1280px Menu opened, initial focus on menu container; Escape closed and restored Account focus after 500ms. First immediate focus observations captured body before asynchronous restoration; retained in initial JSON. Full keyboard navigation, portal location, resizing and named landmark checks not completed. |
| TB-05 long labels | **PASS (limited)** | 0px document overflow at 1280 and 390 for LongLabels; compact branch hides navigation at 390. |
| G4 remaining legacy/UA | **NOT EVALUATED** | Pseudo-elements on root reported `none`; descendants, hover, UA lists, preflight differences, shipped packed consumer, and complete token/cascade equality were not proven. |

## Limitations

No screen-reader or native zoom. No packed-consumer run, actual visual comparison with VIS-01/02, coarse-pointer target audit, no-filter support/contrast, host clearance, or transformed-ancestor proof. Explicit transparent state and per-boundary keyboard tab checks remain unmeasured. No conformity claim; TB-03/05/06/07 remain incomplete. Browser screenshots are Storybook captures, not adopted visual baselines.

## Parent review — G4 transition finding (2026-11-03)

The G4 "legacy root transition remains 0.3s" FAIL is a test-predicate error, not a component defect. The harness read the computed transition durations only. Parent re-measured the root in Chromium (`organisms-topbar--default`): `transition-property: none`, `transition-duration: 0.3s, 0.3s, 0.3s, 0.3s`. With `transition-property: none` nothing transitions; the inherited legacy duration is inert. Same predicate correction as ArticleFeature (`docs/components/article-feature/v0.1/observed/browser-check.md`, finding 5). The original measurement above is kept unchanged.
