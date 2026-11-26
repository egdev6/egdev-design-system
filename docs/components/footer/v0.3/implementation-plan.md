# Footer v0.3 — current-page implementation plan

- **Status:** Proposed for separate owner approval; never approved by this document. It authorizes no code, test, registry, generated-file, catalog, token, dependency, release, Git or GitHub action. Spec approval grants none of them (ODD S5).
- **Coverage:** ODD S4 (#559) for the `Footer` organism only, and the S5 gate sequence; ODD T6 (Footer lane). One PR for #559, referencing the issue with `Refs #559`, never `Closes` ([consumer requests §3](../../../distribution/consumer-requests.md)). The implementation branch is the parent's choice (ODD T6: one PR per issue); the writer never switches branches or commits.
- **Contract authority:** [spec.md](spec.md) v0.3, Approved 2026-11-25 with the recommended answers to OQ-1 to OQ-4 ([approval.md](approval.md); owner answer verbatim: “Aprobar con recomendaciones (Recomendado)”; ODD L5). `contentSHA256: 3fe3906f9f4a68e33b94aa1d8bdd240efbd3f0db2f2754671b7d3c583e22f5a0`, reproduced byte-exact in this working tree with the spec's own rule (`awk '/^## 1\. Purpose and scope$/{f=1} f' spec.md | sha256sum`). Recover and compare it again before any edit; a different digest stops the work. Resolved: OQ-1 attribute only, no visible cue; OQ-2 forward out-of-type values unchanged; OQ-3 snapshot target is a comment on #293 cross-linked from #559 (publication needs its own authorization); OQ-4 no shared registry convention.
- **Plan identity:** The parent hashes the entire final plan file and records the owner's separate approval with that whole-file hash, as in the [NowCard](../../now-card/v0.1/implementation-plan.md) and [LabStage](../../lab-stage/v0.1/implementation-plan.md) plans. No self-hash is embedded; any later edit needs a new hash and approval.
- **Baseline:** branch `feat/pulso-consumer-requests`, HEAD `68ea3a4` (docs-only commits since the spec's `e766442`); Footer sources unchanged since `29c69f8`; at inspection no tracked file under `packages/`, `scripts/` or `skills/` was modified. Reviewed whole-file SHA-256: `packages/ui/src/organisms/footer/types.ts` `7a294339ead212d93e618a2345bad6c7c38ea9b90b176f031007772eff107aa1` (equal to the `revision` of all four registered Footer usages), `useFooter.ts` `fb450df0…`, `Footer.tsx` `d347af27…`, `Footer.test.tsx` `76c3e8d7…` (12 existing cases), `Footer.stories.tsx` `192e77d4…`, `index.ts` `22607d02…`. Preparation was read-only inspection and digest checks; no test, build, generator, browser or server ran. Everything below is planned, not observed.
- **Visuals:** Not applicable (spec §6): no VIS ID, capture or hash is created. v0.2 VIS-01 and VIS-02 stay Pending; visual conformity stays **Not evaluated**.

## 1. Gates, decisions requested and unchanged boundaries

1. **G1 — Plan approval.** Approve this exact payload, the paths in §2 and the commands in §8. Nothing else grants an edit surface.
2. **G2 — No pending token, Material, literal, dependency, Radix or stylesheet decision.** The spec adds no variant axis, utility, class, token, recipe, stylesheet or internal module: `footerNavigationLinkVariants` and every other recipe stay byte-identical, `packages/ui/src/styles/compiled.css`, `.storybook/preview.css`, legacy CSS and `@egdev/tokens` stay untouched, and the six meaningful Footer files stay with **No stylesheet**. If implementation shows a need (for example a stylesheet rule keyed to `[aria-current]` that restyles the marked link), stop and return the evidence; never add CSS.
3. **G3 — Registry (OQ-4 resolved: no convention).** No new entry, usage or exception. The four registered Footer usages (`collection-items`, `accessible-name` ×2, `heading-level`) only get a refreshed `source.revision` after a manual re-review of the final `types.ts`. Convention statuses, approvals and receipts do not change.
4. **G4 — Behavior (OQ-2 resolved).** The hook forwards `item['aria-current']` unchanged: no runtime validation, count, warning, inference from `href`, location, router or order.
5. **G5 — Release and publication stay outside this plan.** The changelog entry goes under `## Unreleased`; no `version` edit, `release:pack`, tag or GitHub action.
6. **G6 — Stop lines.** Stop for owner resolution if: the member needs a type other than `'page'`; `Link` must change to forward the attribute; a visible cue becomes necessary; an existing Footer case must change to pass; or artifact, system or catalog drift appears that this plan does not expect.

**Decisions requested with this plan**

- **D1 — Plan and surfaces.** Approve the exact payload, files and commands (G1).
- **D2 — Packed-consumer additions (recommended: yes).** `scripts/package-exports.test.mjs` and `scripts/package-consumption.test.mjs` receive the small additions in §5e so packed React 18.3.1 and 19.3.0 consumers observe the attribute and the strict-type negative (FT-16, FT-18). They are outside the spec's list of consequences beyond the Footer folder, so they need explicit approval. If declined, FT-18's packed part is preservation-only (existing assertions unchanged) and rendering of the attribute in packed consumers stays **Not evaluated**.
- **D3 — Release timing (recommended: none in this PR).** `(#559)` reaches `release.json` `resolves` only after a maintainer moves the entry into a versioned section ([versioning](../../../distribution/versioning.md)), so egdev-website's mitigation cannot be removed before that release.
- **D4 — Optional real-browser observation (recommended: yes, small).** With separate browser and server permission, open `Organisms/Footer › CurrentPage` in `pnpm storybook` and record that the marked link exposes `aria-current="page"` in the accessibility tree and that its computed styles equal an unmarked link's (spec §6 asserts this only by reading sources). Functional evidence only: no capture, no visual reference, no screen-reader claim. If declined, report it **Not observed**.
- **D5 — Spec snapshot publication (OQ-3), outside this plan.** Posting the v0.3 snapshot on #293 needs the owner's explicit authorization and the closed-versus-reopen choice; this plan performs no GitHub write.

## 2. Exact files to touch (not authorized until G1)

| Path | Owner | Change | Est. lines |
| --- | --- | --- | --- |
| `packages/ui/src/organisms/footer/types.ts` | Writer | `'aria-current'?: 'page'` after `label` in `FooterNavigationItem`, with the spec's English JSDoc and one `@control select`, no `@default` | +6 |
| `packages/ui/src/organisms/footer/useFooter.ts` | Writer | `useFooterNavigation` derives each valid entry's anchor props (`href`, `'aria-current'`, link recipe class) and returns them in place of `entries` and `linkClassName` | +8 −2 |
| `packages/ui/src/organisms/footer/Footer.tsx` | Writer | JSX only: iterate the derived entries and spread their props on `Link` with `arrow={false}` | +3 −4 |
| `packages/ui/src/organisms/footer/Footer.test.tsx` | Writer | New cases for FT-11 to FT-16 and type assertions; the only edits to existing lines are the import specifiers (`vi`, `CurrentPage`) | +180 −2 |
| `packages/ui/src/organisms/footer/Footer.stories.tsx` | Writer | One `CurrentPage` story; `Default` and `Social` untouched | +22 |
| `packages/ui/src/lib/storybook-docgen.test.ts` | Writer | Footer own-property pin: add `"'aria-current'"` after the first `'label'` (baseline lines 928-939) | +1 |
| `skills/_shared/prop-naming.json` | Parent | Refresh `revision` on the four usages whose `source.path` is the Footer `types.ts` (baseline lines 2128, 2138, 4104, 5526) | +4 −4 |
| `docs/prop-naming.md` | Parent | Regenerated with `pnpm props:docs`, never hand-edited (rows `collection-items`, `accessible-name`, `heading-level`; baseline lines 111, 114, 118) | +3 −3 |
| `packages/ui/CHANGELOG.md` | Parent | New `## Unreleased` section above `## 0.10.0` with one `### Added` entry (§7) | +8 |
| `scripts/package-exports.test.mjs` | Parent (D2) | In the Footer SSR test, mark one of two items and assert exactly one `aria-current="page"` (baseline test at line 738) | +6 −1 |
| `scripts/package-consumption.test.mjs` | Parent (D2) | Typed fixture: a marked item and a `'step'` negative (baseline lines 746-767); runtime assertions after `FooterSamples` (baseline line 6393) | +8 −3 |
| `docs/components/footer/v0.3/implementation-evidence.md` | Parent | New: observed RED/GREEN output, commands with exit codes, limits | +45 |

No change expected: `packages/ui/src/organisms/footer/index.ts` and `packages/ui/src/index.ts` (`FooterNavigationItem` is already exported), `scripts/prop-naming.test.mjs` (its Footer usage test recomputes the digest from the live file), `packages/ui/src/lib/storybook-controls.test.ts` (FooterNavigation's own component props stay `label`, `level`, `items`; the member lives on a nested type), `scripts/design-system-artifact.test.mjs`, `scripts/package-exports.test.mjs` export lists, `scripts/catalog_data.py`, `docs/CATALOGO.md`, `docs/catalog.json`, `packages/system/**`, `packages/tokens/**`, every `package.json`, the lockfile, `.storybook/**`, `Link`, TopBar, NavList and every other component, and the frozen v0.1 and v0.2 documents, spec and approval of this version. Work units: **A** (single writer lane, sequential because the registry revision needs the final `types.ts` bytes) covers the Footer folder and the docgen pin; **B** (parent) covers registry, generated view, changelog, harnesses, checks and evidence.

## 3. Implementation shape

```ts
// types.ts: inside FooterNavigationItem, after `label`; existing members and JSDoc untouched
  /**
   * Native current-page indication on this link. The host marks at most one link across the Footer;
   * omitted means no attribute is rendered.
   * @control select
   */
  'aria-current'?: 'page';

// useFooter.ts: useFooterNavigation keeps validItems and the `valid` rule unchanged
const links = entries.map((item) => ({
  item,
  props: { href: item.href, 'aria-current': item['aria-current'], className: cn(footerNavigationLinkVariants()) }
}));
```

```tsx
// Footer.tsx: JSX only; the key still excludes the mark so a moved mark updates one attribute on the same node
{links.map(({ item, props }, index) => (
  <li key={`${index}-${item.href}`}>
    <Link {...props} arrow={false}>
      {item.label}
    </Link>
  </li>
))}
```

Same pattern as `useTopBar.ts:135-143` and `useNavList.ts:91-101`. `useFooterNavigation` is not exported from the package and only `Footer.tsx` uses it (verified by search), so reshaping its return breaks no consumer. `Link` forwards native anchor props it does not own (`useLink.ts:19-31`, `:50-56`, verified by reading); FT-11 is the observation, and if `Link` drops the attribute the plan stops (G6), because no `Link` change is authorized. Biome style: single quotes, 120 columns, quoted property only where needed.

## 4. Test-first sequence

Public interface only; roles and names, no `data-testid`, no full class strings. Pre-commit runs Biome and `pnpm typecheck`, so a failing-test commit is impossible: RED is observed locally and recorded in the evidence file.

| Step | RED test | Covers | Expected RED before the change |
| --- | --- | --- | --- |
| R0 | No edit: run the 12 existing Footer cases, docgen, controls, `props:check`, `test:props`, `artifact --check`, `system:check` | FT-18 baseline | All green; this is the PRESERVE baseline |
| R1 | `Footer.test.tsx`: `[plain, marked]` items, `within(nav)` link queries; marked link has `aria-current="page"` and keeps role and name; `nav.querySelectorAll('[aria-current]')` has length 1; nav, heading, list and items have none. Second case renders `CurrentPage.args?.children` and asserts one marked anchor | FT-11 | `toHaveAttribute('aria-current', 'page')` fails (absent); the story case fails because `CurrentPage` is not exported |
| R2 | Zero marks render none (also the one PRESERVE addition); one mark and two marks render exactly as supplied; a value cast through `unknown` (reason in a comment: out-of-contract runtime value, OQ-2) is forwarded unchanged; `window.location.hash` set to an unmarked `href` produces no mark (reset in teardown); `vi.spyOn(console, 'warn')` is never called and nothing throws | FT-12 | One-mark, two-mark and cast assertions fail; zero-mark, hash and `console.warn` assertions already pass, so they are guards and no RED is claimed for them |
| R3 | Extend the FT-03 omission fixtures: a valid marked entry beside marked entries with blank label or empty `href` keeps only the valid mark; a group whose only marked entry is invalid renders no nav, heading or attribute | FT-13 | The valid mark is missing (RED); the all-invalid case already passes (guard) |
| R4 | `userEvent.tab()` onto the first link, `rerender` moving the mark to another valid entry with the same order and destinations: old anchor loses it, new one gains it, the focused element is unchanged | FT-14 | The new anchor lacks the attribute (RED); the focus assertion is a guard |
| R5 | Marked anchor keeps its `href`, no `tabindex`, `aria-disabled`, `target`, `role` or arrow `svg`; Tab order over marked and unmarked entries; `toHaveClass('min-h-14', 'min-w-14', 'inline-flex', 'items-center', 'justify-start')`; its `className` equals the same anchor's after `rerender` without the mark | FT-15 | The first `aria-current` assertion fails (RED); the other invariants are guards |
| R6 | Type assertions in `Footer.test.tsx`, exported as a tuple like `TopBar.test.tsx:28` to satisfy `noUnusedLocals`: an object literal annotated `FooterNavigationItem` with `'aria-current': 'page'` and one without; `// @ts-expect-error` with a written reason for `'step' extends FooterNavigationItem['aria-current']` | FT-16 | `pnpm typecheck` fails on the excess-property literal (vitest does not typecheck); the `@ts-expect-error` negative holds before and after (guard) |
| R7 | Docgen pin edited first (`"'aria-current'"` after `'label'`); then, once `types.ts` changes, `pnpm props:check` and `pnpm test:props` | FT-17 | Pin test fails until the member exists; registry checks fail by design on the four stale `revision`s until §5b |
| R8 | D2 only: harness assertions added first and run against the baseline `dist` (built from unmodified source) | FT-18 | Attribute absent in the packed SSR output (RED); green after `pnpm build` of the change |

**PRESERVE.** Existing cases stay unmodified and green (12 at baseline); `git diff -U0` on `Footer.test.tsx` shows only additions plus the import line. Entries without the mark must render exactly as before (R2's zero-mark case). **Optional verifier check, not committed:** render `Default`, `Social`, `Invalid`, `Responsive` and `Composition` args to static markup against a base copy in a `mktemp -d` scratch directory and against the change; unmarked inputs must give byte-identical HTML.

GREEN order: `types.ts` → `useFooter.ts` → `Footer.tsx` → stories → docgen pin → build → registry and generated view → harnesses → changelog.

## 5. Registry, docgen, artifact and catalog obligations

- **a. Docgen.** Footer extraction test (`storybook-docgen.test.ts:880`): the AST walk keeps source text, so the pin entry carries its quotes. The existing loop then enforces exactly one `@control` per own member and no `@default` rule for optional members. Run `storybook-controls.test.ts` unchanged: zero owned diagnostics, FooterNavigation still `label`, `level`, `items`. Browser Controls widgets are not at stake (no component prop is added).
- **b. Registry.** After `pnpm lint` is clean on the touched files, re-review the final `FooterNavigationItem` and `FooterNavigationProps`, compute `sha256sum packages/ui/src/organisms/footer/types.ts`, and write it into the four usages (`accessible-name` for `FooterNavigation` and `FooterNavigationItem`, `collection-items`, `heading-level`). Any later edit to `types.ts` repeats this. Then `pnpm props:docs` (it never refreshes evidence or approvals), `pnpm props:check`, `pnpm test:props`. No usage is added for `aria-current` (OQ-4), so the receipt and `postReceiptUsages` expectations stay as they are. The `929a83a4…` digest cited by the v0.2 spec is historical and stays.
- **c. Artifact (expected: no change).** `packages/system/design-system.json` records `FooterNavigationItem` in `types[]` as name, owner and source only, lists only `children` among Footer's props, and `propNaming[]` and `system.md` carry no revisions or item members. Run `pnpm artifact --check`, `pnpm system:check`, `pnpm test:artifact`, `pnpm test:system`, and again after `pnpm build`, which regenerates the artifact. If any reports drift, stop and report before `pnpm artifact --write` and `pnpm system:docs`; a `packages/system/CHANGELOG.md` `Unreleased` entry would then be needed and is not part of this plan.
- **d. Catalog (no change).** `scripts/catalog_data.py:106` (“Navigation accepts ordered destinations”) stays accurate; do not run `build_catalog.py`, and confirm `docs/CATALOGO.md` and `docs/catalog.json` stay untouched.
- **e. Packed harnesses (D2).** `package-exports.test.mjs` Footer SSR test: two items, one marked, assert exactly one `[aria-current]` and that it is the marked `href`. `package-consumption.test.mjs`: add a second, marked item to `footerNav` in the typed fixture (existing `footerItem` untouched), a `// @ts-expect-error` negative for `'aria-current': 'step'` added to `FooterNegatives`, and after the existing `FooterSamples` assertions check the one marked link. Existing assertions stay as they are.

## 6. Stories

`Organisms/Footer`, unchanged meta, autodocs, no manual `argTypes`, no `play`. Add one English `CurrentPage` story, placed after `Invalid`, with a JSDoc line before the export: a `FooterNavigation` labelled `Explore` with two destinations, the second marked `'aria-current': 'page'`, and no other marked link. The JSDoc states that the host marks at most one link and passes the literal `'page'` or `undefined` (a `cond && 'page'` expression yields `false` and is rejected, as in TopBar). The story demonstrates a state no existing story shows and is the arg set R1 renders. `Default`, `Social` and the shared `content` constant are untouched because the A6-AC2 test renders their args.

## 7. Changelog

`packages/ui/CHANGELOG.md`, new section above `## 0.10.0` (English, effect on a consumer, `(#559)` because the request is fully resolved):

```md
## Unreleased

### Added

- `FooterNavigationItem` accepts the optional `'aria-current': 'page'`, rendered on that entry's link so the footer
  exposes the current page like TopBar and NavList. The host marks at most one link across the Footer; Footer does
  not infer the current page and adds no visual cue, so sighted users get no indication from the Footer itself. (#559)
```

No `packages/system/CHANGELOG.md` entry unless §5c finds drift. No version bump (D3).

## 8. Checks to run

After G1, from the repository root, foreground, one at a time; baseline first, then after each GREEN step the focused commands:

```sh
pnpm exec vitest run packages/ui/src/organisms/footer/Footer.test.tsx --maxWorkers=2
pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2
pnpm typecheck
pnpm lint
pnpm props:docs
pnpm props:check
pnpm test:props
pnpm artifact --check
pnpm system:check
pnpm test:artifact
pnpm test:system
pnpm test
pnpm build
pnpm artifact --check
pnpm system:check
pnpm test:package-exports
pnpm test:package-consumption
```

`pnpm test:package-consumption` packs and installs isolated fixtures, so it needs explicit installation and network permission and a known cache; the offline alternative is `EGDEV_CONSUMER_OFFLINE=1 pnpm test:package-consumption`, reporting a cache miss instead of a pass. Record the React 18.3.1 and 19.3.0 results separately. CI also runs `pnpm test:cli` and the tokens tests, which Footer does not touch. Results are recorded per command with exit code and test counts in the evidence file; jsdom, docgen and HTML smoke prove no appearance, focus visibility, contrast or screen-reader behavior, and none is claimed.

## 9. Commit slicing (about 400 lines per commit)

Estimated total **≈ 315 changed lines** (insertions plus deletions; range 270 to 380), so no commit nears 400. Each commit must pass the pre-commit Biome and typecheck hooks and the pre-push `pnpm test`; Conventional Commits, bodies use `Refs #559`.

| Commit | Content | Est. lines |
| --- | --- | --- |
| C1 `feat(footer): expose the current page on navigation links` | `types.ts`, `useFooter.ts`, `Footer.tsx`, `Footer.test.tsx`, `Footer.stories.tsx`, docgen pin, registry revisions with the regenerated view (they must travel with `types.ts` so `props:check` is green at every commit), changelog | ≈ 250 |
| C2 `test(scripts): observe the footer current page in the packed consumers` | The two harness additions (D2 only), isolated because shared test files need a structure check against `main` | ≈ 20 |
| C3 `docs(footer): record the v0.3 implementation evidence` | `implementation-evidence.md` | ≈ 45 |

If the test file outgrows the estimate and C1 would pass about 400 lines, split C1 into (a) types, hook, JSX, FT-11, FT-12, FT-15, FT-16 tests, docgen pin, registry and changelog, and (b) FT-13, FT-14 tests and the story; both halves stay green.

## 10. Risks

- **R-1 — `Link` forwarding is verified by reading only.** If the attribute does not reach the anchor, stop (G6): no `Link` change is authorized.
- **R-2 — Hook reshaping.** Replacing `entries` and `linkClassName` changes an internal return; the `key` must keep excluding the mark or FT-14's same-node and focus guarantees break.
- **R-3 — Registry freshness.** The revision binds the final `types.ts` bytes: a later formatting or JSDoc edit makes `props:check` and `test:props` fail until the digest is recomputed, and `--write` never refreshes it.
- **R-4 — Cast value test.** Forwarding unchanged (OQ-2) means a cast `'step'` reaches the DOM; the test needs a written reason and an `unknown` cast, never `@ts-ignore` or `any`.
- **R-5 — jsdom limits.** FT-15's class-list equality is a DOM invariant, not appearance proof; `window.location.hash` must be reset in teardown to keep tests independent. Visual conformity, computed styles, contrast and screen-reader output remain **Not evaluated** unless D4 is granted, and even then only the stated functional observations.
- **R-6 — Packed matrix.** React 18.3.1 and 19.3.0 consumer results are unobserved until run and may be blocked by network or cache permission; without D2 they stay preservation-only.
- **R-7 — Consumer typing.** Hosts that write `current && 'page'` get a type error; the `CurrentPage` story JSDoc documents the literal-or-`undefined` rule.
- **R-8 — Downstream timing.** Merging does not ship the change: egdev-website keeps its mitigation until a release carries `(#559)` (D3).

## 11. Stop

This plan authorizes nothing until G1. No source, test, registry, generated file, token, dependency, catalog, Git, release or GitHub action is taken or implied; if a gate, expected-no-change check or stop line fails, return the evidence to the owner instead of widening scope.
