# Prose v0.2 — cataloging decision draft: inline links inside Prose pass the DS040 guard (#580)

- **Status:** **Approved** on 2026-11-28 ([approval.md](approval.md)): the owner's answer "Aprobar todo (Recomendado)" covers this cataloging, the [spec](spec.md) and the [plan](implementation-plan.md), with OQ-1 to OQ-5 as recommended. Drafted on 2026-11-27 on `feat/prose-links-580` (main `2559d52`), uncommitted. It follows the `Borrador de decisión de catalogación` template of [`docs/CATALOGACION.md`](../../../CATALOGACION.md) (lines 80-99) with English headings. By itself it changes no code, token, dependency, registry entry, catalog row, version or Git state, and the [spec](spec.md) and the [plan](implementation-plan.md) stay their own gates (cataloging → spec → plan → code), approved by the same answer in the same record.
- **Request:** [#580](https://github.com/egdev6/egdev-design-system/issues/580), raised from egdev6/egdev-website#49. The issue text used here is the verbatim S1 recorded in [`odd/tasks/prose-links-580.md`](../../../../odd/tasks/prose-links-580.md); the issue itself was not re-read for this draft (no network use). S1: "Inline links inside long-form content read at the size of the surrounding reading copy." … "`egdev-ds doctor` DS040 forbids raw `<a>` in app code, so the site has to render DS `Link`. Link uses its label step (11.2px) inside the 16px reading copy." … "The need is for the anchors that Prose is designed to style to pass the guard when they are Prose descendants."
- **Owner authority:** the owner approved this cataloging on 2026-11-28, verbatim "Aprobar todo (Recomendado)" (`odd/tasks/prose-links-580.md` L2), with OQ-1 to OQ-5 as recommended; the record is [approval.md](approval.md). Before that answer, `odd/tasks/prose-links-580.md` (line 3) recorded only the gates and the expectation that "the fix is expected on the CLI side, in the DS040 guard of `egdev-ds doctor`"; that expectation is the parent's framing of the request, not an owner answer, and this document tests it against the code instead of assuming it.
- **Companions:** [spec.md](spec.md) (Prose v0.2, an amendment of the effective [v0.1 contract](../v0.1/spec.md), Approved), [implementation-plan.md](implementation-plan.md) (Approved) and the approval record [approval.md](approval.md).

## Cataloging decision draft

- **Component:** Prose, an existing implemented primitive, plus the DS040 check of `egdev-ds doctor` in `@egdev/cli`.
- **Level:** primitive, unchanged (`docs/CATALOGACION.md:25`). No new component.
- **Destination:** `@egdev/cli` for the behavior change; `@egdev/ui` for a documentation-only edit of Prose (OQ-3).
- **Current / proposed path:** `packages/cli/src/guard.mjs` and `packages/cli/src/appearance-guard.mjs`; `packages/ui/src/primitives/prose/` keeps its six files, with `types.ts` and the stories changed in prose only. No new folder or file in `packages/ui`.
- **Radix base:** none, unchanged. Prose is static.
- **Decision:** **reuse, with a guard exemption.** Prose already styles the anchor; only the guard blocks the pattern. No Link variant, no new component and no Prose prop. The one real fork is how wide the exemption reaches, and the literal reading of the request does not unblock the consumer (E5, table below), so the approved decision takes a wider reach than the request names (OQ-1, G4).
- **Existing pieces reused:** Prose's `a` recipe (`types.ts:63-65`), the guard's per-file TypeScript symbol resolution (`appearance-guard.mjs:502-652`), the guard allowlist and its stale rule, and the existing precedent of a built-in exemption for a DS-documented composition (`isSlotChild`, `guard.mjs:114-140`).
- **Pieces to extract or create first:** none.
- **Blocks or questions:** none open. OQ-1 to OQ-5 are resolved as recommended (Resolved decisions below); OQ-1 decided whether the consumer is unblocked.

## Evidence

**E1 — What DS040 matches and how it walks.** `packages/cli/src/guard.mjs`:

- The check is the `visit` at `:189-202`: a JSX opening or self-closing element whose tag is an identifier in `['button', 'input', 'a', 'label']` (`:195`) and that is not a sole `asChild` child (`:196`). It runs on non-test `.tsx` files under `sourceDirectory` (`:189`, patterns at `:142-152`) and walks the whole tree with `ts.forEachChild` (`:200`). Property-access tags (`<UI.Button>`) and any other tag are never matched.
- The only exemption is `isSlotChild` (`:117-140`, comment at `:114-115`: "Radix Slot composition documented by the DS"). It looks one level up: the raw element must be the only JSX child of a PascalCase element whose `asChild` is true.
- DS040 has no import resolution and no ancestor context beyond that one parent. `findViolations(source, …)` receives the parsed file only (`:168`); `checkDesignSystem` calls it at `:372`, after `collectClasses` at `:346` has already built a symbol-aware program for DS046/DS047.
- `doctor` turns each violation into `DS040 error <file>:<line>: Raw <snippet>: use a DS component or add an allowlist entry with an issue.` (`doctor.mjs:804-822`) over the sources read by `readSources(project, config, true)` (`:784`; `.tsx`, `.css` and `.ts` under `sourceDirectory`, honoring `exclude`, `:277-302`).
- Pinned by `packages/cli/tests/guard.test.mjs:19` (the five raw forms, with file, line and snippet), `:62` (tests, theme CSS and non-target paths ignored), `:158` and `:215` (what counts as the single `asChild` child) and `packages/cli/tests/doctor.test.mjs:428` (exact DS040 text) and `:635`.

**E2 — Of the elements Prose styles, DS040 forbids only `a`.** Prose's supported children are `h2` to `h4`, `p`, `ul`, `ol`, `li`, `a`, `strong`, `blockquote`, `pre`, inline `code`, `img`, `figure`, `figcaption`, a simple `table` (`th`, `td`) and `hr` (`packages/ui/src/primitives/prose/types.ts:18-20`; v0.1 spec `:12`). DS040's list is `button`, `input`, `a`, `label` (`guard.mjs:195`; `docs/distribution/egdev-ds-cli.md:497`; `packages/cli/README.md:376`). The intersection is `a`. `img`, `figure`, `figcaption`, `table`, `th`, `td` and the rest are not DS040 elements, so they need no exemption; `button`, `input` and `label` are not Prose children and Prose styles none of them.

**E3 — How DS046/DS047 resolve imports and owners.** `packages/cli/src/appearance-guard.mjs`:

- It "never resolves packages or walks the disk" (`:2`). `collectClasses` (`:502-652`) builds an in-memory TypeScript program over the already-parsed non-test `.tsx` sources with `noResolve: true` (`:539`), so each file is judged alone.
- Per file it records import bindings only from the exact specifiers in `GUARDED_PACKAGES = ['@egdev/ui', '@egdev/effects']` (`:21`, filter at `:550`; type-only imports skipped): namespace imports by symbol (`:558-562`), named imports by symbol with the real export name from `binding.propertyName ?? binding.name` (`:564-568`), so aliases resolve to the export.
- A JSX tag is an owner only when `checker.getSymbolAtLocation` of its identifier (or of the object of a property-access tag) is one of those symbols (`:618-635`). A parameter or local that shadows the name resolves to another symbol, so it never counts (pinned by `ds046.test.mjs:126`).
- Classes enter the DS047 map only for `@egdev/ui` owners (`STRUCTURAL_PACKAGE`, `:24`, `:578`). A raw element such as `<a className="x">` has no owner, so DS046 and DS047 never judge a class that sits only on a raw anchor.
- Consequence for this request: DS046/DS047 never applied to raw anchors, so an exemption in DS040 changes nothing for them (spec §3, CLI contract item 5). Recorded as a side finding, outside this request: a component imported through an app barrel is invisible to DS046/DS047 for the same reason (E5).

**E4 — What the Prose contract says about links and about nesting.**

- Prose styles the bare `a` with colour, underline, hover and focus rules and sets neither display nor size (`types.ts:63-65`; v0.1 spec `:96`), so a bare `a` inherits the root body step: 16px at `md`. The consumer's complaint is therefore not about Prose; it is about the element DS040 pushed them to use.
- The nesting rule bars "any other component that owns a recipe" (`types.ts:20-21`; stories `Prose.stories.tsx:32`; v0.1 spec §4 `:65` and OQ-8 `:172`; non-goal "no design-system component nested inside", `:14`). `Link` owns a recipe.
- The same v0.1 `a` row (`:96`) says "so a `Link` inside keeps its own layout", which anticipates a `Link` inside Prose. The two statements pull in different directions, and a consumer who follows DS040 ("use a DS component") ends up violating the nesting rule. That contradiction is the real defect behind #580; OQ-2 asks the owner to resolve it explicitly.

**E5 — The consumer's real shape (read-only; nothing in `egdev-website` was changed).** Repository `/home/egdev/proyectos/egdev-website`, branch `chore/ds-upgrade-2559d52`, HEAD `defdac7`. Re-checked read-only at the approval step, at the checkout's then branch `feat/community-zone`, HEAD `32194ca` (the original branch no longer exists locally): both whole-file digests below are unchanged, so every row holds, and `Prose` sits at `egdev-ui.ts:76`, a correction of the `:74` this draft first cited.

| Fact | Evidence |
| --- | --- |
| The page imports `Prose` from the app's own barrel, not from `@egdev/ui` | `src/components/detail-prose.tsx:5`: `import { Link, Prose, Text } from '@/components/egdev-ui';` (whole-file SHA-256 `975c8902f64516a9114777b5b422656855337827e135fbb27d0efdae5d1d039b`) |
| The barrel is a `'use client'` boundary of named re-exports of `@egdev/ui`, kept because the bundle ships no `"use client"` directive (egdev6/egdev-design-system#389) | `src/components/egdev-ui.ts:1,3-7`; `Prose` at `:76` (SHA-256 `bb8c1e6d8114078d93857b273f9f3f8c4c596ac9500ef63bfff93c09defa1845`). 22 files import the barrel; the only non-test file that imports `@egdev/ui` directly is the barrel itself |
| `@/` resolves through `tsconfig.json` `paths`, which the guard never reads | `tsconfig.json:18-19`; `appearance-guard.mjs:2,539` |
| The anchor is built in a converter function, not inside the `<Prose>` element | `createConverters` (`detail-prose.tsx:102`) holds `renderLink` (`:104`) with `// TODO(egdev-design-system#580): Render a bare anchor styled by Prose once the guard allows it inside Prose.` (`:116`); it is registered for `link` and `autolink` (`:163-164`) |
| The `<Prose>` element is in the same file, far from the anchor, and receives the converted blocks as a variable | `return <Prose size="md">{blocks}</Prose>;` (`:243`) |
| Today's workaround | `Link` with `arrow={false}` around `<Text variant="body-large" asChild><span>{children}</span></Text>` (`:117-128`); the module comment states the cause: "the design system guard refuses a raw anchor: a link stays the design system `Link`, sized by `Text` since the link recipe sets the label step" (`:31-35`) |
| App config | `egdev-ds.json`: `sourceDirectory` `src`, `exclude` `src/app/(payload)`; `package.json:20` `ds:doctor` |

So the website's anchor is **not a lexical child** of the `<Prose>` element and `Prose` is **not imported from `@egdev/ui`**. A rule that exempts only JSX descendants of a `Prose` imported from `@egdev/ui` (the literal option (a)) would leave `detail-prose.tsx` exactly as blocked as today.

**E6 — Why a Link variant does not meet the need (option (b)).** `packages/ui/src/atoms/link/`:

- Link is "Standalone text navigation" (`types.ts:32`; v0.3 spec `:13`: "one standalone text navigation atom"). Its base recipe is `eg-link group/link inline-flex items-center gap-2 font-sans text-label-default underline …` (`types.ts:87`): a flex box, a gap, an optional arrow and the 11.2px label step (`theme.css:254-258`).
- The approved v0.5 contract has no size axis: "No new axis; one size and one label step for every variant" (v0.5 spec `:114`), and the owner resolved OQ-1 with "Keep `--text-label-default`, as recommended. `quiet` changes no size and adds no token" (`:192`). `quiet` is "not for inline prose" (`types.ts:63`; v0.5 spec `:92`).
- A variant or size that inherits the surrounding text would therefore reverse an owner-resolved decision, add an axis the contract excludes, and have to change the display model from `inline-flex` to inline (an `inline-flex` box is an atomic inline-level box, so a long label does not flow across lines like text; external CSS knowledge, not measured here). Per `docs/CATALOGACION.md:19` a variant stops being one "when it introduces another responsibility": standalone navigation versus a link inside running text.
- It would also leave two recipes on one `<a>`: Prose's descendant `[&_a]` rules (specificity (0,1,1)) and Link's own single-class utilities (0,1,0). For `quiet`, Prose's `text-link-default` would beat Link's `text-fg-default`. That is the OQ-8 conflict, not a new one.
- It serves the website only if its converter keeps rendering `Link` for every anchor, which keeps the guard's contradiction (E4) and ignores Prose's own `a` recipe, the thing the request names ("the anchors that Prose is designed to style").

**E7 — The allowlist is a mitigation, not the resolution.** An issue-backed entry "lives until the release that resolves the issue" (`docs/distribution/consumer-requests.md:39-40`). A release that cites `(#580)` makes `upgrade` and `doctor --from` tell the consumer to remove the entry (`:110-121`). For a pattern the DS itself documents as supported (the `a` child of Prose), per-anchor debt is the wrong shape; the guard already has a built-in exemption for the other documented composition (`isSlotChild`, `guard.mjs:114-140`).

**E8 — Release mechanics that the plan must respect.**

- `packages/cli/CHANGELOG.md` has no `## Unreleased` section (top is `## 0.5.0`); `docs/distribution/versioning.md:58,76-78` defines one, `release:pack` ignores it and checks the first versioned section (`scripts/lib/pack-packages.mjs:117-123`).
- `packages/cli/tests/package.test.mjs:27-30` pins the first five `##` headings of the cli changelog to `0.5.0, 0.4.0, 0.3.0, 0.2.0, 0.1.1`, so adding `## Unreleased` breaks that pin until the test skips the Unreleased heading, as `changelogError` does.
- `versioning.md` (the `@egdev/cli` section) classes "a doctor check" change as minor under 0.x; the #566 precedent shipped as minor (0.5.0) after the owner confirmed it.
- `packages/ui/CHANGELOG.md` (top `## 0.12.0`) and `packages/system/CHANGELOG.md` (top `## 0.14.0`) have no `## Unreleased` section either.

## Decision gates

| Gate | Verdict | Evidence |
| --- | --- | --- |
| 1. Reuse | **Covers the look, not the guard.** Prose already styles a bare `a` at the reading size; DS `Link` cannot. Existing escapes do not resolve it: the allowlist is an expiring per-anchor mitigation, and `asChild` applies Link's own classes (label step) to the child | E1, E4, E6, E7 |
| 2. Variant (Link inheriting size) | **Rejected.** Would reverse Link v0.5 OQ-1, add an axis the contract excludes, change the display model and leave two recipes on one element | E6 |
| 3. Compose in the app | **Rejected as the system answer.** It is the current workaround (`Link` plus a `Text` span, `detail-prose.tsx:117-128`) and costs a nested component the Prose contract bars | E4, E5 |
| 4. Extract | **Not applicable.** The anchor colour, underline and focus roles are already echoed by Prose (v0.1 `:96`); nothing hidden is shared | E4 |
| 5. New (`InlineLink`, `ProseLink`) | **Rejected.** A second recipe for the element Prose already styles, plus the nesting conflict | E4, E6 |
| Guard change | **Chosen, in a wider form than the request names.** DS040 recognizes the Prose pattern; the reach is OQ-1 | E1, E3, E5 |
| Block | **None.** OQ-1 to OQ-5 are owner decisions, not missing evidence | |

## The fork: how far the exemption reaches (OQ-1)

Two independent axes decide whether the website is unblocked: where the anchor may sit, and how `Prose` is recognized.

| | Reach | `Prose` recognized as | Unblocks `detail-prose.tsx`? | Verdict |
| --- | --- | --- | --- | --- |
| G1 | JSX children of the `<Prose>` element | the export from the exact specifier `@egdev/ui` | **No** (anchor outside the element; barrel import) | Literal option (a). Principled and DS046-consistent, useless for the one known consumer |
| G2 | JSX children of the `<Prose>` element | export name `Prose` from any module | **No** (anchor outside the element) | Rejected: same gap as G1 |
| G3 | any position in a file that renders `Prose` | exact specifier `@egdev/ui` | **No** (barrel import) | Rejected: same gap as G1 |
| **G4** | **any position in a file that renders `Prose`** | **export name `Prose` from any module** (named, aliased, namespace member; not type-only, not shadowed, not locally declared) | **Yes** | **Chosen (OQ-1)** |
| G5 | G4 or G1, with the barrel declared in `egdev-ds.json` | declared module | Yes | Rejected for now: a new config key (validation, DS045, docs, tests); if DS046/DS047 also used it they would start reporting in every barrel consumer, a separate request |
| G6 | resolve converters, wrappers and aliases across the scanned sources | module resolution with `tsconfig` `paths` | Yes | Rejected: the guard resolves nothing and `checkDesignSystem` is pure (`appearance-guard.mjs:2,539`) |
| G7 | remove `a` from DS040 | n/a | Yes | Rejected: removes the brake for every standalone link, where `Link` is right |
| G8 | no guard change; one issue-backed allowlist entry per anchor | n/a | Yes, as a mitigation | Rejected as the resolution (E7) |

G4 is a deliberate approximation: DS040 cannot see the rendered tree, so "a Prose descendant" becomes "an anchor written in a file that renders Prose", which is how Prose is meant to be used (converter and `<Prose>` in one module, v0.1 §4 "Limits"). Its costs are stated in the spec: an unrelated raw `a` in that same file also passes, a converter in another file is not covered, and an app's own imported component with the exact export name `Prose` opts its file into the same exemption. G4 recognizes `Prose` by export name from any module, unlike DS046/DS047, which require the exact package specifier, because the only known consumer re-exports the DS through its own barrel.

## Proposed change (after the lookup)

- **Prose API:** none. No prop, default, type, export, marker or recipe changes. The registry has no entry to look up: no own prop is added or changed, so there is nothing to reuse, propose or except.
- **CLI behavior:** DS040 does not report a raw `a` in a non-test `.tsx` file under `sourceDirectory` that renders `Prose` as defined by G4. `button`, `input` and `label` are still reported there; every other file and every other check is unchanged. Details: spec §3, CLI contract.
- **Documentation:** the `children` description of `ProseProps` and the story guidelines say to write links as bare `a` and not to nest `Link` (OQ-2, OQ-3); the CLI README and `docs/distribution/egdev-ds-cli.md` document the exemption and its limits.

## Impact

- **API and classes:** none for consumers of `@egdev/ui`. `eg-prose` and every descendant recipe are untouched.
- **CLI:** one relaxation of DS040. A project that passes today still passes, with one exception that is disclosed: an allowlist entry that covered an anchor which is now exempt is reported stale (DS042: `Stale allowlist entry <a …>; remove it.`).
- **Stories and tests:** stories change in text only (the `Default` and other exports are unchanged); a new `packages/cli/tests/ds040.test.mjs`; one line of `packages/cli/tests/package.test.mjs`.
- **Parent-owned integration (only if OQ-3 is yes):** the registry (two Prose usage revisions), the generated view, the artifact, `system.md`, the MCP README digest, the catalog row, three changelogs.
- **Consumers:** egdev-website can render the bare anchor in `renderLink` and retire the `Link` plus `Text` workaround and the `TODO(egdev-design-system#580)` at `detail-prose.tsx:116` after it upgrades. That change is the website's, not this one.

## Resolved decisions

The owner took the recommended answer of every open question ("Aprobar todo (Recomendado)", 2026-11-28; [approval.md](approval.md)). The table stays as the record.

| ID | Question and evidence | Resolution |
| --- | --- | --- |
| OQ-1 | **Reach and recognition.** G4 (file renders `Prose`, export name from any module) or the literal G1 (JSX children, exact `@egdev/ui`)? E5: only G4 unblocks `detail-prose.tsx` | **G4.** Confirmed against the website's shape (E5, re-checked at the approval step): its converter and its `<Prose>` are in one file. If a later split moves the converter to another file, even G4 does not cover it and the owner chooses between co-locating the anchor, an issue-backed allowlist entry and a later amendment (a config key, G5) |
| OQ-2 | **`Link` inside Prose.** State in the docs that `Link` is outside the Prose contract (the existing nesting rule, E4) so the supported route is unambiguous? | **Yes.** `Link` inside Prose is outside its contract. It matches OQ-8 of v0.1 and prevents the symptom of #580 at its source; nothing is enforced and no rendering changes |
| OQ-3 | **Publish the usage rule where agents read it?** One sentence in the `children` description of `ProseProps` reaches the artifact and `system.md`, which costs a registry revision refresh, regenerated files and ui/system changelog entries; the alternative is stories and CLI docs only | **Yes, in the `children` description and the stories.** The artifact carries no component-level description, only prop descriptions (`design-system.json`, Prose entry), so that prop is the one place agents see. Documentation only |
| OQ-4 | **Version of `@egdev/cli`.** `versioning.md` makes a doctor-check change minor under 0.x; a relaxation could be read as a patch. Decided at release (T3), not by this change, which bumps nothing | **Minor** at release, per `versioning.md` and the #566 precedent; T3 chooses the number |
| OQ-5 | **Citation.** `(#580)` marks the issue fully resolved, so `release.json` `resolves` and DS052 will tell consumers to remove their #580 allowlist entries. That is right only if G4 covers the consumer; otherwise write `Refs #580` | **`(#580)`**: OQ-1 is confirmed against the website's shape |

## Not evaluated and limits

- Nothing was run: no test, build, `doctor`, Storybook or browser. The evidence is source reading plus whole-file digests; the DS040 behavior and the website's pass or fail are **Not evaluated** until the plan's tests and a real `ds:doctor` run on the website.
- The issue body was not re-read; S1 in the ODD task file is the source. The website was read read-only on the branch named in E5; nothing was changed there.
- Real-browser typography of a bare `a` inside Prose at 16px is Prose v0.1's evidence ([implementation-evidence.md](../v0.1/implementation-evidence.md)), not re-measured here. Visual conformity is **Not evaluated**; this request adds no visual.

## Next step

The owner approved this cataloging, the [spec](spec.md) and the [plan](implementation-plan.md) on 2026-11-28 ([approval.md](approval.md)); the implementation (T2) follows the approved plan. This cataloging by itself authorizes no code, token, dependency, registry, artifact, catalog, version or GitHub action.
