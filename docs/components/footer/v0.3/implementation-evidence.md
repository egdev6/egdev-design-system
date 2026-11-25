# Footer v0.3 — implementation evidence

- **Status:** Observed evidence for the implementation of [#559](https://github.com/egdev6/egdev-design-system/issues/559) (ODD S4, task T6), recorded by the implementation writer on 2026-11-25. It reports what was run and what was seen. It approves nothing: review, commits and any GitHub action stay with the parent and the owner.
- **Contract:** [`spec.md`](spec.md) v0.3, approved 2026-11-25 ([`approval.md`](approval.md)), `contentSHA256` `3fe3906f9f4a68e33b94aa1d8bdd240efbd3f0db2f2754671b7d3c583e22f5a0`, recomputed with the spec's own rule before the first edit and again after the last (equal both times). Plan: [`implementation-plan.md`](implementation-plan.md), approved by the owner on 2026-11-25 ("Aprobar los cuatro (Recomendado)", ODD L7). D2 (packed harness edits) and D4 (Storybook observation) were approved ("Autorizar ambos (Recomendado)"). D3 applies: no release and no version bump. D5 (the comment on #293) was not authorized and nothing was written to GitHub.
- **Baseline:** branch `feat/pulso-consumer-requests`, HEAD `e4f41d3`, tree clean for `packages/`, `scripts/` and `skills/` before the work. Footer file digests matched the plan's baseline exactly (`types.ts` `7a294339…`, `useFooter.ts` `fb450df0…`, `Footer.tsx` `d347af27…`, `Footer.test.tsx` `76c3e8d7…`, `Footer.stories.tsx` `192e77d4…`, `index.ts` `22607d02…`).
- **Environment:** Node v24.22.2, pnpm 10.34.6, Vitest 4.1.11, Storybook 10.6.1, Chrome for Testing 153.0.8010.12 (headless shell). Final `packages/ui/src/organisms/footer/types.ts` digest: `627ebf23897ae0f7f6b267d6cf1cc9cdef0d4053d6036bbfaf18c1e15edff36f`, the value written into the four registry revisions.

## 1. Verdicts per acceptance criterion

"Pass" means observed in this run by the command shown. Nothing here is a visual or screen-reader claim.

| ID | Verdict | Evidence (command and result) | Limit |
| --- | --- | --- | --- |
| FT-11 | **Pass** | `Footer.test.tsx` cases "marks exactly the supplied entry anchor and no other element (FT-11)" and "renders the CurrentPage story args with exactly one marked anchor (FT-11)": 20/20 pass. Packed SSR: `pnpm test:package-exports` 140/140 and `pnpm test:package-consumption` 14/14 (one marked `href="#two"` link). Storybook (D4): the marked `Notes` link has `aria-current="page"`, `Projects` has none, and the document holds exactly one `[aria-current]` element; the accessibility tree lists both as role `link` with names `Projects` and `Notes`. | The DevTools accessibility tree has no property for `aria-current` (properties seen across the whole tree: `focusable`, `focused`, `labelledby`, `level`, `url`). The state was read from the DOM attribute; assistive-technology exposure was not observed. |
| FT-12 | **Pass** | Three cases: "renders no mark when none is supplied, whatever the location or order (FT-12)" (sets `window.location.hash` to an unmarked `href`); "forwards one or two marks exactly as supplied without picking a winner (FT-12)" (`[null,'page',null]` then `['page','page',null]`, `console.warn` spy never called, no throw); "forwards a value outside the type unchanged (FT-12, OQ-2)" (`'step'` cast through `unknown` reaches the anchor). | Out-of-contract values are forwarded by design (OQ-2); nothing validates them. |
| FT-13 | **Pass** | "omits an invalid marked entry together with its mark (FT-13)": empty `href`, non-string `href` (cast through `unknown`) and blank `label`, each marked, beside a valid marked entry → one link, one mark; with the valid entry unmarked → no mark anywhere; with no valid entry left → no navigation, heading or attribute. | none |
| FT-14 | **Pass** | "moves the attribute with the mark and keeps focus on the same element (FT-14)": after `rerender` both anchors are the same DOM nodes (`toBe`), the old one loses the attribute, the new one gains it, and focus stays on the first link. | none |
| FT-15 | **Pass** | "keeps a marked anchor a normal native link with an unchanged recipe (FT-15)": `href` kept; no `tabindex`, `aria-disabled`, `target` or `role`; no arrow `svg`; recipe classes present; no `eg-footer__link` marker; Tab order across marked and unmarked links; `className` equal to the same anchor unmarked. Storybook (D4): toggling `aria-current` on the same element changes 0 of 820 computed properties (also 0 on `::before` and `::after`); marked versus unmarked link: 0 differences; 0 of 36 loaded rules whose selector mentions `aria-current` match a footer link. A positive control (inline `color`) changed 15 properties and a reset returned to 0, so the diff can detect a change. | Computed styles prove equal styling in one Chromium at 1280×900 with transitions frozen. No contrast, focus-visibility or forced-colors claim. |
| FT-16 | **Pass** | `pnpm typecheck` exit 0 (RED: exit 2). `type InvalidCurrent` with `@ts-expect-error` rejects `'step'`; `{ href, label }` and a marked literal compile. Packed consumers: `tsc` compiles a marked typed fixture and a `@ts-expect-error` `'aria-current': 'step'` negative with the packed declarations on React 18.3.1 and 19.3.0. | Type tests are structural, not behavioral. |
| FT-17 | **Pass** | Real TS parse of the new member: tags `["control select"]` only, no `@default`. `storybook-docgen.test.ts` Footer pin (now includes `'aria-current'`) and the shared loop (exactly one `@control` per own member): `storybook-docgen` + `storybook-controls` 428/428. `pnpm props:check` valid; `pnpm test:props` 134/134 (RED: 84 pass, 50 fail on the stale revisions). `pnpm artifact --check`, `pnpm system:check` exit 0 before and after `pnpm build`; `pnpm test:artifact` 52/52; `pnpm test:system` 36/36; no tracked change under `packages/system/`. | Convention approvals and receipts are untouched (OQ-4). Browser Controls widgets are not at stake: the member lives on a nested item type, not on a component prop. |
| FT-18 | **Pass** | The 12 original `Footer.test.tsx` cases pass unmodified (12/12 at baseline, all present afterwards; `git diff -U0` removes only two import lines). Existing stories untouched (`Footer.stories.tsx` is +18 −0). Packed consumers 14/14, 7 per React version, no new dependency (no `package.json` or lockfile change; `@egdev/ui` stays 0.10.0). | The optional byte-identical HTML differential (plan §4) was not run. |

## 2. Test-first record

Pre-commit runs Biome and typecheck, so a failing-test commit cannot exist; RED was observed locally and nothing failing was committed.

| Step | RED observed before the change | GREEN observed after |
| --- | --- | --- |
| R0 baseline (no edit) | `Footer.test.tsx` 12/12; docgen + controls 428/428; `props:check` valid; `test:props` 134/134; `artifact --check` and `system:check` exit 0; `typecheck` exit 0; `lint` exit 0 (1088 files). All green. | n/a (PRESERVE baseline) |
| R1 FT-11 | `Footer.test.tsx`: 20 tests, 7 failed, 13 passed. `toHaveAttribute('aria-current','page')` received `null`; the story case threw `TypeError: Cannot read properties of undefined (reading 'args')` because `CurrentPage` was not exported. | 20/20 |
| R2 FT-12 | The "one or two marks" case failed at its first (one-mark) assertion (`[null,null,null]` instead of `[null,'page',null]`), and the cast case failed (`aria-current` absent for `'step'`). The zero-mark and `window.location.hash` case passed before the change, so it is a guard and no RED is claimed for it. | pass |
| R3 FT-13 | Failed on the valid mark (`expected … to have a length of 1 but got +0`); the invalid-only and all-invalid parts already held (guards). | pass |
| R4 FT-14 | Failed on the first `aria-current` assertion (absent). The focus assertions are guards. | pass |
| R5 FT-15 | Failed on the first `aria-current` assertion (absent). The other invariants are guards. | pass |
| R6 FT-16 | `pnpm typecheck` exit 2: `TS2614` (no exported `CurrentPage`) and ten `TS2353` (`'aria-current'` does not exist in `FooterNavigationItem`) in `Footer.test.tsx`. The `@ts-expect-error` negative held before and after (guard: before the member exists the same line errors for a different reason). | `typecheck` exit 0 |
| R7 FT-17 | Pin test failed (`'aria-current'` missing). `props:check` exit 1 `Stale evidence revision: packages/ui/src/organisms/footer/types.ts`; `test:props` exit 1, 134 tests, 84 pass, 50 fail (the shared registry validation trips every test while the four revisions are stale). | Revisions refreshed, `props:docs`, `props:check` valid, `test:props` 134/134 |
| R8 FT-18 packed (D2) | Against the baseline `dist` (built 20:22 from unmodified source): `test:package-exports` exit 1, 140 tests, 139 pass, 1 fail (`Footer package SSR…`, `0 !== 1` at `package-exports.test.mjs:783`). `test:package-consumption`: an `EGDEV_CONSUMER_OFFLINE=1` attempt hit a pnpm cache miss (`ERR_PNPM_NO_OFFLINE_TARBALL`, `@tailwindcss/vite`), so it was not a RED; the online run exit 1, 14 tests, 4 pass, 10 fail. Per React version (18.3.1 and 19.3.0): the typed consumer and `types` failed with `consumer.ts(717,75): error TS2353 … 'aria-current' does not exist in type 'FooterNavigationItem'`, `ssr` failed with `0 !== 1` at `ssr.mjs:229`, and `csr` failed with `ENOENT … scroll-reveal-hydration.html`, a cascade because `ssr.mjs` writes that file only after the Footer assertions. `entries` and `css` passed. | After `pnpm build`: `test:package-exports` 140/140; `test:package-consumption` 14/14 |

GREEN order followed the plan: `types.ts` → `useFooter.ts` → `Footer.tsx` → story → docgen pin → build → registry and generated view → harnesses → changelog.

## 3. Checks on the final tree

All run from the repository root, in the foreground, one at a time.

| Command | Exit | Result |
| --- | --- | --- |
| `pnpm exec vitest run packages/ui/src/organisms/footer/Footer.test.tsx --maxWorkers=2` | 0 | 1 file, 20/20 (12 existing + 8 new) |
| `pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2` | 0 | 2 files, 428/428; zero owned-metadata diagnostics |
| `pnpm typecheck` | 0 | root `tsc --noEmit` plus the cli, tokens, mcp, ui and effects projects |
| `pnpm lint` | 0 | 1088 files, no fixes. It first reported two formatter-only diffs in lines this change wrote (`Footer.tsx`, `Footer.test.tsx`); `biome format --write` on exactly those two files fixed them (one correction) |
| `pnpm props:docs` | 0 | view regenerated: `docs/prop-naming.md` +3 −3 |
| `pnpm props:check` | 0 | registry valid; view up to date |
| `pnpm test:props` | 0 | 134/134, including "Footer records only its four approved navigation usages" |
| `pnpm artifact --check` | 0 | no drift (also after the build) |
| `pnpm system:check` | 0 | no drift (also after the build) |
| `pnpm test:artifact` | 0 | 52/52 |
| `pnpm test:system` | 0 | 36/36 |
| `pnpm test` | 0 | 152 files, 3535/3535 |
| `pnpm build` | 0 | tokens, system, mcp, ui and effects built; no tracked file changed |
| `pnpm test:package-exports` | 0 | 140/140 |
| `pnpm test:package-consumption` | 0 | 14/14: React 18.3.1 7/7, React 19.3.0 7/7 (`command-palette typed consumer`, `entries`, `types`, `ssr`, `csr`, `css`, plus the version test) |

Not run: `pnpm test:cli` and the tokens tests, which CI also runs and which Footer does not touch (plan §8).

## 4. Browser observation (D4), functional only

- **Method:** `pnpm storybook --ci --no-open --disable-telemetry --no-version-updates` served `Organisms/Footer › Current Page` (story id `organisms-footer--current-page`, listed in `index.json`). A throwaway Node script outside the repository (not committed) drove the cached headless Chrome over the DevTools protocol at 1280×900: DOM attributes, `Accessibility.getFullAXTree`, `getComputedStyle` snapshots of the same link marked and unmarked (transitions and animations frozen, 820 computed properties each, plus `::before` and `::after`), and a scan of every loaded stylesheet rule (3216) whose selector mentions `aria-current`. Storybook and Chrome were stopped afterwards (ports 6006 and 9333/9334 confirmed free).
- **Result:** see FT-11 and FT-15 above. The 36 `aria-current` rules found belong to other components (legacy `.eg-menu__item`, `.eg-topbar__link`, `.eg-mobile-menu__link` and similar plus generated variants); none matches a footer link. This confirms by observation what spec §6 said by reading sources.
- **Not a capture:** no image, no `VIS-` ID and no visual reference was produced; visual conformity of Footer stays **Not evaluated**, and v0.2 VIS-01 and VIS-02 stay Pending.

## 5. Findings outside this plan

1. **React key warning on single-child Footer stories (not introduced by this change; not fixed).** The browser console logged `Each child in a list should have a unique "key" prop … Check the render method of Footer` (`footer` in the `Minimal` message) for `CurrentPage`, `Invalid` and `Minimal`, and nothing for the multi-child `Default`. `Minimal` renders no `FooterNavigation`, so the warning cannot come from this change's hook or JSX; it was not compared against a base build, so "pre-existing" is an inference. Unverified hypothesis: `collect()` in `useFooter.ts` pushes unkeyed children from `Children.forEach` into the `stage`, `grid` and `legal` arrays. Fixing it is outside the approved plan and surfaces; it would need its own issue and approval.
2. **Size versus estimate.** The change is +231 −18 (249 lines) against the plan's ≈315 estimate.

## 6. Not evaluated

- Visual conformity, contrast, focus visibility, forced colors, and screen-reader output (none claimed).
- Assistive-technology exposure of `aria-current` (the DevTools accessibility tree does not report it).
- The optional byte-identical HTML differential for unmarked inputs (plan §4, "Optional verifier check, not committed").
- Browsers other than the one Chromium build above.
- Publication of the v0.3 snapshot on #293 (OQ-3, D5), any release, version bump or `release:pack`: out of scope and not authorized.
