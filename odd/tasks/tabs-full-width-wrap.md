# Tabs fullWidth / labelWrap (#414)

Implement the approved Tabs v0.2 amendment `docs/components/tabs/v0.2/full-width-wrap-amendment.md` (Approved 2026-11-16) per the owner-approved plan below. Branch `feat/tabs-full-width-wrap`, one PR, Closes #414. Roadmap #427, milestone #14.

## Specs

- S1: Public API: add `fullWidth?: boolean` and `labelWrap?: boolean` to `TabsProps` (English JSDoc, `@default false`, `@control boolean`, documented as segmented-only and no-ops on underline). Both are destructured in `useTabs.ts` so they never reach the DOM or the Radix Root.
- S2: `fullWidth` (segmented only): the list becomes `grid grid-flow-col auto-cols-[1fr] w-full self-stretch overflow-x-auto` (replacing `inline-flex`/`self-start` through `cn`; plain `1fr`, NOT Tailwind's `auto-cols-fr` = `minmax(0,1fr)`, which squeezes labels instead of overflowing — L2), triggers `justify-center`. Triggers are equal width whenever they fit; when labels do not fit, each trigger keeps at least its label width (unequal only while overflowing, owner L3) and the list scrolls horizontally with a VISIBLE scrollbar (owner: "Sí, scrollbar visible"). The keyboard-focused trigger and its focus ring must stay visible inside the scrolled list (amendment AC-04). Default segmented output is byte-identical to v0.1.
- S3: `labelWrap` (segmented only): triggers drop `whitespace-nowrap` for `whitespace-normal wrap-anywhere text-start justify-start py-1` (fallback `[overflow-wrap:anywhere]` if `wrap-anywhere` does not compile); the counter keeps `whitespace-nowrap`. With both props, start alignment wins over `justify-center`. No `text-balance`. No minimum trigger width (owner: "No, sin mínimo").
- S4: Underline variant: list and trigger classNames identical with and without both props (compound variants only for segmented).
- S5: Tests first (RED observed before GREEN), via the public interface: (1) props not forwarded to the DOM; (2) segmented+fullWidth classes and Surface well preserved; (3) segmented+labelWrap classes, counter nowrap; (4) both on: justify-start, selection and counter accessible names intact; (5) underline unchanged; (6) all four combinations, explicit `false` equals omitted. Preservation: all existing Tabs tests unchanged and green; keyboard (Arrow/Home/End/Tab), disabled skipping and controlled selection re-run with both props on.
- S6: Docgen/controls: `packages/ui/src/lib/tabs-docgen.test.ts` controls map + property count 13→15 + story list; CSS test `packages/ui/src/lib/tabs-css.test.ts` asserts the new utilities compile. Stories `FullWidth`, `LabelWrap` (long labels incl. one unbroken word in a narrow host), `FullWidthLabelWrap` (with counters); no argTypes, no play.
- S7: Prop-naming registry `skills/_shared/prop-naming.json`: new approved entry `tab-list-full-width` (`fullWidth`) and new shared entry `control-label-wrap` (`labelWrap`, owner: "control-label-wrap"; Button #422 later only adds its usage); approval record `docs/components/tabs/v0.2/prop-naming-approval.json` in the `human-approval-record` format (see `docs/components/section-nav/v0.1/prop-naming-approval.json`) citing the owner's "Aprobar las cuatro" (odd/tasks/nexo-adoption-m1-specs.md L5) and plan approval L1 below; refresh whole-file hashes of existing Tabs usages; regenerate with `pnpm props:docs` (never hand-edit docs/prop-naming.md).
- S8: Catalog: Tabs row in `scripts/catalog_data.py` mentions v0.2 opt-in props; regenerate with `python3 scripts/build_catalog.py`. Packed consumer: typed `fullWidth`/`labelWrap` cases in `scripts/package-consumption.test.mjs`. Evidence doc `docs/components/tabs/v0.2/implementation.md` (v0.1 style), with the amendment content SHA-256 recorded in the amendment header (`contentSHA256`, hashing from `## 1. Purpose and scope` to EOF as the header states).
- S10: The fullWidth overflow scrollbar matches the system styles in Chrome, Edge and Firefox (owner L4, L7): Blink/WebKit get `::-webkit-scrollbar` styling (6px height `h-1.5`, transparent track, rounded `--color-border-control` thumb, `--color-fg-muted` on hover, no arrow buttons); Firefox gets standard `scrollbar-width: thin` + `scrollbar-color` only under `@supports not selector(::-webkit-scrollbar)` (Chromium 121+ ignores the pseudo-elements when standard properties apply). Existing tokens only.
- S9: No stylesheet, no new module, no tokens, no dependencies. Code, tests, docs in English.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S1–S9 | gentle-ai-worker | — |
| T1b | S2 (AC-04) | gentle-ai-worker: focused trigger kept in view | — |
| T1c | S10 | parent: themed scrollbar (owner request L4) | — |
| T2 | S2–S4 | parent: real-browser check + capture (Storybook) | — |
| T3 | all | parent: full checks, commit, PR | — |

## Log

- L1 (owner, verbatim choices on the plan): "Sí, scrollbar visible"; "No, sin mínimo"; "control-label-wrap"; "Aprobar e implementar".
- L2: Browser check (Storybook, Chrome, 150px viewport): `auto-cols-fr` compiled to `minmax(0,1fr)` and squeezed triggers with no scroll; switched to `auto-cols-[1fr]` test-first (RED 2 failures → GREEN 266). After the fix the list scrolls with a visible scrollbar, but End-focused "Published" stayed out of view (scrollLeft 0) — AC-04 failure.
- L3 (owner, verbatim choice): "Aceptar anchos desiguales solo al desbordar".
- L4 (owner, verbatim): "igual deberíamos estilar un poco los sidebar para que cuadren con el resto de estilos. No de ven muy bien (compatibles con edge, firefox y chrome porfa)" — refers to the fullWidth overflow scrollbar (screenshot).
- L5: T1b (worker): onFocus reveal via `scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'})`, ring clearance `p-1.5 scroll-px-1.5`; RED 2 → GREEN 277. T1c (parent): scrollbar classes test-first (RED 2 → GREEN 277).
- L6: Browser evidence at a 117–131px list: Chrome 157 (Playwright MCP) and Edge 157 (headless CDP, hasFocus true): End/Home/ArrowLeft keep the focused tab and its ring in view (scrollLeft 63–64 / 0), scrollbar computed `thin` + token color. Firefox 160 (WebDriver BiDi): scrollbar `thin` + token color and equal behavior of widths confirmed; `scrollIntoView` with the fix's options works (49px), but the harness cannot give the window OS focus (`document.hasFocus()` false even headful), so no focus events fire and the onFocus reveal cannot be exercised automatically — pending a manual Firefox check by the owner.
- L7 (owner, screenshots only): Chromium still showed arrow buttons and a thicker bar; Firefox showed the thin bar. Parent split the recipe per engine (S10), test-first (RED 2 → GREEN 277); refreshed the registry hash for types.ts (`props:check` valid, `test:props` 118/118).
- L8: Re-verified: Chrome 157 and Edge 157 show a thin rounded thumb without arrows (Edge AC-04 still passes, scrollLeft 64); Firefox 160 computes `scrollbar-width: thin` + token color under the @supports branch. `pnpm lint` failures are only in ignored local `.playwright-mcp/` artifacts (2026-10-18), not in the branch. Full suite before S10 change: 2819/2819; build, package exports (131) and consumption (14) green. Firefox keyboard reveal still pending the owner's manual check.
- L9 (owner, verbatim): "está OK" — Firefox manual check: End keeps Published in view with its full ring.
- L10: Capture review found `fullWidth`+`labelWrap` splitting ordinary words (wrap-anywhere collapses grid min-content); that combination now uses `wrap-break-word` (test-first: RED 1 → GREEN 277). Captures and evidence saved under docs/components/tabs/v0.2/captures and implementation.md.
