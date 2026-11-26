# Component contract — Hero, Closing, ChapterBreak and LabStage: scene `titleVariant`

- **Version / status:** 0.2 — **Proposed**. One shared amendment for four existing scene organisms: Hero carries the spec, and Closing, ChapterBreak and LabStage link here from their own `v0.2/amendment.md`. It amends the effective v0.1 contracts ([Hero](../v0.1/spec.md), [Closing](../../closing/v0.1/spec.md), [ChapterBreak](../../chapter-break/v0.1/spec.md), [LabStage](../../lab-stage/v0.1/spec.md)), implemented under issues #318, #319, #324 and #325. Not approved and not implementation-ready: this snapshot needs the owner's approval, and its implementation plan needs a separate one.
- **Approval / recovery:** Pending for this snapshot. Recoverable prior decision, for cataloging only: the owner's answer on 2026-11-26, verbatim "Aprobar todas (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L3), whose approved shape for this request is "#560: `titleVariant` on the four scenes, measured first". The explorers' draft is kept in `odd/tasks/round-5-cataloging.md` (§#560). That answer approves neither this spec, nor the registry convention for the prop name, nor a plan, nor any source, token or registry edit. Agreed spec location: this file, an uncommitted working-tree file.
- **Current situation / pending decisions:** Existing components; one optional prop is added to each. Verified in this working tree (HEAD `7afaabd`, branch `integration/round-5`) by reading source, tests, stories, tokens and the v0.1 contracts; no test, build, Storybook or browser was run. Proposed: the prop and its rules (blocks 1–6). Pending: owner answers OQ-1 to OQ-5 (block 7); the browser measurement that "measured first" requires (TV-09, TV-10), so far only an estimate that says `show` alone probably does not fit the reported word at viewports of about 1,475px and wider; VIS-01 to VIS-05 (no capture exists, so visual conformity is **Not evaluated**); approval of the new convention `heading-title-variant`; the implementation plan. **Token proposal: none.**
- **Owner authority (verbatim):** scope, "Pulso: #560–#566, Lectura: #569–#575, Pendientes chicos"; versioning, "Absorber en 0.11.0 (Recomendado)"; cataloging, "Aprobar todas (Recomendado)" ([`odd/tasks/round-5-consumer-requests.md`](../../../../odd/tasks/round-5-consumer-requests.md) S1, S2, L3).
- **Snapshot identity:** `version: 0.2`; `contentSHA256: 489f499c841f14a2c7ec7c53bb626bd7fd4cddcb91be56119346ef239dc91f90`; `visualHashes: VIS-01 → Pending; VIS-02 → Pending; VIS-03 → Pending; VIS-04 → Pending; VIS-05 → Pending` (no capture exists); `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/318` (Hero; the other three scenes use #319, #324 and #325 through their amendment notes; the numbers come from `docs/CATALOGO.md` and the v0.1 implementation plans and were not re-read on GitHub); `latestPublishedComment: Pending` (nothing is published; request [#560](https://github.com/egdev6/egdev-design-system/issues/560) originates this amendment but is not a component issue).
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from the exact whole heading line `## 1. Purpose and scope`, anchored at line start, through EOF, with LF line endings and the recorded final newline. All tracking metadata above that heading is excluded, so the digest cannot depend on itself. Finalize the digest before publication; approval must bind this version, digest and identified visuals, not mutable prose or memory. A digest is not approval.

## 1. Purpose and scope

- **Need / non-goals:** Consumer request [#560](https://github.com/egdev6/egdev-design-system/issues/560) (egdev-website; consumer issue egdev6/egdev-website#45): scene display titles should fit the column they sit in. Hero, Closing, ChapterBreak and LabStage always render their title with `Heading variant="hero"` (`Hero.tsx:17`, `Closing.tsx:14`, `ChapterBreak.tsx:17`, `LabStage.tsx:14`). The consumer reports 103.7px at 1440px and, in Closing's roughly 516px copy column, "¿CONSTRUIMOS ALGO?" breaking mid-word into "CONSTRUIM / OS". Its Pulso reference sets such titles at about 94.5px at 1440px, which matches the existing `show` step. The need is to let the consumer choose, per scene, between the two display recipes the system already has.
  **Non-goals:** no automatic fitting (no script measurement, container query or breakpoint switch); no new, changed or retuned token or recipe; no value beyond `hero` and `show`; no change to Heading, to the grid tracks, media slot, spacing, lede, actions, markers or host register; no copy decisions for the consumer.
- **Exact v0.2 delta:**
  1. Each of the four scenes gains one optional prop, `titleVariant?: 'hero' | 'show'`, default `'hero'`.
  2. The scene passes it to its internal Heading as `variant`; Heading's existing recipes decide the size and the accent glow.
  3. Nothing else changes. With the prop omitted the output is byte-identical to today, and every v0.1 promise, prop, marker, token, file and test stays as approved.
- **Cataloging decision / alternatives:** **Variant, at the scene level**, owner-approved (L3 above). The reuse → variant → compose → extract → new order of [`docs/CATALOGACION.md`](../../../CATALOGACION.md) was walked on inspected code. *Reuse* fails: all four scenes hard-code the recipe, so a consumer cannot change it. *Retuning the `hero` token* (`theme.css:298`) would resize every hero title and every Heading consumer. *Switching the scenes to `show` with no prop* (the explorers' option b) would shrink every scene for every consumer and silently drop the accent glow. *Composing in the app* is impossible: the scenes own their Heading and expose no title slot. *Extract* and *new* add a responsibility nobody asked for. A recipe choice changes appearance, not responsibility, so it stays a variant.
- **Evidence / level and package:** the four organisms stay in `@egdev/ui` (`packages/ui/src/organisms/{hero,closing,chapter-break,lab-stage}/`); Heading is the primitive they compose (`packages/ui/src/primitives/text/`). All five are public exports: `packages/ui/src/index.ts:135-138`, `:158-161`, `:228-237`. Radix: none, since this is passive typography. Verified in the working tree:
  - **Recipes.** `theme.css:298-301` hero `clamp(48px, 7.2vw, 112px)` and `:303-306` show `clamp(44.8px, 6.56vw, 105.6px)`; both use line height 0.86, weight 800, tracking 0, display family, uppercase. They differ only in the size clamp (and the glow gate below). The values are the ×0.8 scale of #218; `docs/tokens-reference.md:34-35` still shows the older pre-scale snapshot, and `theme.css` is the authority.
  - **Accent glow.** `useHeading.ts:63` sets `glow: variant === 'hero' && accentTone === 'canvas'`, which selects `[text-shadow:var(--text-shadow-title-hero)]` instead of `[text-shadow:none]` (`primitives/text/types.ts:97`). Hero and ChapterBreak pass `tone='canvas'`; Closing and LabStage rely on Heading's canvas default. So **all four scenes glow today, and none would at `show`**. Legacy agrees: only `.eg-title--hero .eg-title__accent` has a `text-shadow` (`styles/legacy/bundle.css:113`); `.eg-title--show` (`:114`) has none. `Heading.test.tsx:299-321` pins the glow by tone and `:323-329` the `show` recipe class.
  - **Register.** The scenes sit in Show-register hosts, black with the 3D (`docs/DECISIONES.md`, "Pulso en Grafito": reading sections are grafito, scenes stay black), and `--text-title-show` is documented as the Show register title (`theme.css:302`). No reading section uses these scenes, so nothing here depends on the grafito register.
  - **Earlier reviews.** Closing v0.1 OQ-5 (`closing/v0.1/spec.md:107`) and ChapterBreak v0.1 OQ-3/OQ-4 (`chapter-break/v0.1/spec.md:97-98`) left title sizing to a separate review; this is that review. ChapterBreak's v0.1 plan (gate 2) accepted the hero scale and glow as differences from the source.

### Fit estimate for the reported case (browser measurement **Pending**)

Computed from token values and class strings, not measured. The content width is 960px for viewports of 1,024px and up (`section-shell/types.ts:55` wrap: `--content-max` 1024px less two `--gutter` of 32px, `theme.css:499,501`). Closing's copy track with media is `(960 − 32) × 1.25 ÷ 2.25 = 515.56px` (`closing/types.ts:53,57`; `gap-10` is 32px, `theme.css:456,591`). The Closing v0.1 browser check measured 515.55px at 1280px (`../../closing/v0.1/observed/browser-check.md`). The track stops growing at `--content-max`, while the title keeps scaling with the viewport.

| Viewport | `hero` size | `hero` em available | `show` size | `show` em available |
| --- | --- | --- | --- | --- |
| 1280px | 92.16px | 5.594 | 83.97px | 6.140 |
| 1440px | 103.68px | 4.973 | 94.46px | 5.458 |
| 1536px | 110.59px | 4.662 | 100.76px | 5.117 |
| 1920px | 112.00px (cap from 1,556px) | 4.603 | 105.60px (cap from 1,610px) | 4.882 |

"Em available" is the track divided by the title size: the widest unbreakable word must be no wider than this, in em, or `wrap-break-word` splits it. The reported break at `hero`/1440px (after "M") gives `w(¿CONSTRUIM) ≤ 4.973em < w(¿CONSTRUIMO)`. Adding the final "S", with an **assumed** Barlow Condensed ExtraBold advance of 0.36–0.48em, gives `w(¿CONSTRUIMOS) > 5.33em`; the "O" at no more than 0.52em gives `≤ 5.97em`. These advances are assumptions: no font file or browser was available.

- 1280px: `show` needs at most 6.140em, above the 5.97em ceiling, so it fits.
- 1440px: it needs at most 5.458em, which holds only if the word sits within about 0.13em of its lower bound. Unlikely.
- About 1,475px and wider: it cannot fit for any advance in the assumed range, and at 1,920px only 4.882em is available.

So `titleVariant="show"` is necessary but probably not sufficient for the reported word on wide desktops. It still shrinks the title by about 9% (6.56 ÷ 7.2 = 0.911) between 683px and 1,556px. The same arithmetic gives the other scenes' tracks (block 2). **TV-09 is the gate**, and it can run before any code: swap `text-title-hero` for `text-title-show` on the heading of the existing Closing story in a real browser.

## 2. Anatomy and composition

| Part | Responsibility | Native element / Radix primitive | Allowed content |
| --- | --- | --- | --- |
| Scene root | Unchanged passive scene layout (`eg-hero`, `eg-closing`, `eg-chapter-break`, `eg-lab`) | `div`; no Radix | Unchanged v0.1 content |
| Heading wrapper | Unchanged spacing wrapper (`mb-7` on Hero; `mt-5 mb-7` on the other three) | `div` | The Heading only |
| Heading | Native heading from `level`; **its recipe now follows `titleVariant`** | `h1`–`h6` through Heading; no Radix | `title` text plus an optional accent span |
| Accent | Existing `span.eg-heading__accent`, a block by default; glow only on the `hero` recipe | `span` | `accent` text |

Per-scene facts, verified. The copy track is the grid track holding the heading when media is present, at viewports of 1,024px and up. Without media, or at 860px and below, the heading spans the full content width (960px on desktop).

| Scene | Heading call | `tone` / `accentBreak` | Copy track with media | Test home |
| --- | --- | --- | --- | --- |
| Hero | `Hero.tsx:17` | `canvas` / `true`, both explicit | 528.14px = (960 − 25.6) × 1.3 ÷ 2.3 (`hero/types.ts:51,55`; `gap-8` is 25.6px, `theme.css:454`) | `Hero.test.tsx:237-287` |
| Closing | `Closing.tsx:14` | Heading defaults: `canvas` / `true` | 515.56px (`closing/types.ts:53,57`) | `Closing.test.tsx:168`, `:330` |
| ChapterBreak | `ChapterBreak.tsx:14-23` | `canvas` / `true`, both explicit | 515.56px (`chapter-break/types.ts:39,42`) | `ChapterBreak.test.tsx:137` |
| LabStage | `LabStage.tsx:14` | Heading defaults: `canvas` / `true` | 486.10px = 928 × 1.1 ÷ 2.1 (`lab-stage/types.ts:44,47`) | `LabStage.test.tsx:166` |

- **Radix / composition:** none. The scenes keep composing Heading and Text, reuse Heading's recipes unchanged and add no part, wrapper, element or slot.
- **Public markers:** `eg-hero`, `eg-closing`, `eg-chapter-break`, `eg-lab`, and Heading's `eg-heading` and `eg-heading__accent` stay. No new marker is added, and the prop value is never mirrored into a class, `data-*` or attribute.

## 3. Public API

- **Prop conventions:** looked up in the [canonical registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md) by meaning, name and aliases across all 185 entries ([workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry)).
  **Reused, unchanged (all approved):** `heading-title` (`title`), `heading-level` (`level`), `heading-eyebrow` (`eyebrow`), `trailing-text-accent` (`accent`), `section-lede` (`lede`) and `scene-media` (`media`); `accent-line-break` stays internal to Heading.
  **Considered and rejected for the new prop:** `visual-treatment` / `variant` (approved) is the root treatment; a scene `variant` would claim the whole scene's look while only the title recipe changes, and would close the name to a real scene variant later. `preset-dimensions` / `size` (approved) means dimension presets, whereas `hero` and `show` are register-named recipes that also differ by glow, and Heading itself names this axis `variant`. `section-register` / `register` (approved, one usage: SectionShell) selects a section frame's scene and material, which the scenes do not own. `surface-material-tone` / `tone` is a colour context. `heading-level` / `level` states it is "independent of its visual typography". No entry, alias or name `titleVariant`, `headingVariant`, `titleSize` or `typography` exists; the nearest title-qualified precedents are `titleId` (`heading-id`) and `titleOverflow` (`dialog-title-overflow`, proposed).
  **New proposal (needs a separate convention approval, OQ-4):** semantic ID `heading-title-variant`, name `titleVariant`, status `proposed`, approval null. *Meaning:* display-title typography recipe of the heading slot a composite component owns, chosen from the Heading recipes that component supports. *Use:* a composite renders its title through Heading and lets the consumer pick one of a small finite set of Heading's existing recipes so the title fits the container it sits in; the rank stays on `level`. *Avoid:* the component's own visual treatment (use `variant`), heading rank, dimension presets (use `size`), colour tone, accent layout, arbitrary font sizes or CSS values. *Component-specific types:* Hero, Closing, ChapterBreak and LabStage declare the inline union `'hero' | 'show'` (default `hero`), recorded as four usages only at implementation. No exception is proposed.
  **Reviewed sources** (whole-file SHA-256 of the working tree today; the five `types.ts` hashes equal the revisions already in the registry, and the four scene hashes change when `types.ts` is edited, so implementation must renew each usage's `source.revision`):

  | Symbol | Path | SHA-256 |
  | --- | --- | --- |
  | `HeroProps` | `packages/ui/src/organisms/hero/types.ts` | `09c805d2cd51cf46095f17945aabfe547ab59f464fccdbdba9fe30d66c1ed844` |
  | `ClosingProps` | `packages/ui/src/organisms/closing/types.ts` | `b413fbef41e1ca87a2ebd9300287aad94f5c751f829f733b0463a614fc7e496e` |
  | `ChapterBreakProps` | `packages/ui/src/organisms/chapter-break/types.ts` | `ddcb7063a88e7495ec2234a6fa9817a8321fb5ef4a17127eadad0d11c030c16f` |
  | `LabStageProps` | `packages/ui/src/organisms/lab-stage/types.ts` | `371b71eeab1356933c2f608ebb72e7e0dba10365d6e97b90d0c627ebadcaa1a7` |
  | `HeadingProps` | `packages/ui/src/primitives/text/types.ts` | `41a2d11b8fd42de6f7ec8fc8b05d203459c1dd93eb62b184b8f83e75ebe0f4fc` |
  | `useHeading` (glow gate, read only) | `packages/ui/src/primitives/text/useHeading.ts` | `050efdaab2e37f1dbe466103e716f6fedc88d7ac173a7280943eadf026e933e7` |

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `titleVariant` (the same row on Hero, Closing, ChapterBreak and LabStage) | `'hero' \| 'show'` | no | `hero` (constant, `@default hero`) | Display recipe of the scene's own heading. `hero` keeps today's size and accent glow; `show` is the smaller Show-register step and its accent does not glow. Independent of `level`. |

Proposed JSDoc, in English, with a bare `@default` and a finite-enum `@control`:

```ts
/**
 * Display recipe of the scene's own heading: `hero` (default) or the smaller `show` step, so a long
 * title can fit its column. Independent of `level`; the accent glows only with `hero`.
 * @default hero
 * @control select
 */
titleVariant?: 'hero' | 'show';
```

- **Native props / refs:** unchanged. Each root still forwards compatible `div` attributes minus the protected ones, and exposes no ref or `asChild`. `titleVariant` is an own prop that the hook consumes: it is destructured before `...native`, so it never reaches the root `div`.
- **Controlled / uncontrolled:** Not applicable (a static presentation prop with no state and no event).
- **Compatibility:** additive and optional; no default, export, marker or value is removed or changed, and no new exported type name is introduced. Existing consumers render byte-identical output. Per S2 ("Absorber en 0.11.0") the change folds into the unpacked `@egdev/ui` 0.11.0 as a bullet under `## 0.11.0` → `### Added` of `packages/ui/CHANGELOG.md`; no version of tokens or cli moves because neither changes. The `@egdev/system` artifact and the generated `system.md` list own props, so implementation regenerates them and never hand-edits them. The prop is plain pass-through with no React 18- or 19-specific API; compatibility is proven by the packed React 18.3.1 and 19.3.0 consumers (TV-08), not by types.

## 4. Behavior

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| `titleVariant` omitted or `'hero'` | Output identical to today: `text-title-hero` on the heading; the accent keeps its canvas colour and the glow utility | none |
| `titleVariant='show'` | Same heading element, `level`, `id`, text and accent; `text-title-show` replaces `text-title-hero`; the accent keeps its canvas colour with `[text-shadow:none]`, so no glow | none |
| Any other runtime value from an untyped caller (`'display'`, `'section'`, `'inverse'`, `'compact'`, `'SHOW'`, `''`, `null`, a number) | Treated as `hero`; the value never reaches the DOM | none |
| `titleVariant` changes while mounted | Only the recipe class and the glow utility change; the heading element, its `id` and the rest of the DOM keep their identity, with no remount | none |
| Narrow viewport (860px and below, one column) or no media | The recipe still applies and the v0.1 layout rules are untouched; the recipes bottom out at 48px (`hero`) and 44.8px (`show`) below about 667px and 683px of viewport | none |
| A word wider than the copy column at either recipe | Heading's `wrap-break-word` breaks inside the word, with no horizontal overflow; the scene never measures or shrinks | none |

- **States / representation:** no own `data-state`; no class mirrors the prop. The choice is a static lookup in Heading's recipe map, so the scenes add no CVA axis and no class string.
- **Limits / consumer responsibilities:** the consumer chooses the value per scene and owns its copy. `show` is about 8.9% smaller than `hero` between roughly 683px and 1,556px of viewport and caps at 105.6px against 112px, so it narrows the risk and does not remove it; Spanish and other long-word locales are the realistic case. No auto-fit, no container query and no script measurement are promised. A scene whose accent should keep its glow stays on `hero`.

## 5. Accessibility

- **Accessible name / roles / relationships:** unchanged. The heading's full visible text, accent included, is its accessible name (Heading's contract); the rank comes from `level` only, and the recipe is independent of rank, as the approved `heading-level` convention states. The host's unique heading `id` is still forwarded to the Heading.
- **Keyboard / focus:** Not applicable. No interactive element or focus behavior is added or changed.
- **Announcements / other conditions:** Not applicable (no live region, no motion, no transparency). Reflow: at the 320px reflow width the content is 294.4px, and the estimated word width of at most 5.97em is at most 286.6px at `hero`'s 48px floor and 267.5px at `show`'s 44.8px floor, so neither recipe is expected to split that word; this is an estimate and the browser check is pending. The accent glow is decorative: it carries no meaning, and the accent colour is the same at both values, so dropping the glow changes no text colour. Contrast is not evaluated here.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| `titleVariant` | `hero`, `show` | `hero` | Independent of `level`, `eyebrow`, `accent`, `lede`, `media` and, where present, `children`; every value works with every existing combination. No size axis is added. |

- **Tokens / Material:** existing token-backed utilities only, applied inside Heading's static map: `text-title-hero`, `text-title-show`, `[text-shadow:var(--text-shadow-title-hero)]` and `[text-shadow:none]`. The scenes' CVA gains no axis and no class string, so the built CSS and the static scan are unchanged (Heading already emits all four). The change adds no Surface, background, border or shadow: the title is typography on the host's backdrop, and the host SectionShell register owns any halo (the Closing v0.1 browser check records that Closing paints no halo of its own). Reduced motion and reduced transparency: Not applicable. **Token proposal: none.** Nothing is added to `packages/tokens/src/theme.css` or pending confirmation; OQ-2 names where a token could come in later, as a proposal for the owner and not part of this spec.
- **Dynamic geometry:** Not applicable. No inline style and no interpolated class string: the prop selects between two static classes inside Heading's map.
- **Class composition / consumer layout:** unchanged. `className` stays root outer placement only (v0.1). `titleVariant` is not a class surface, and the scenes pass no `className` to Heading, so a consumer class cannot restyle the title through a scene. Heading keeps merging `cn(headingVariants(...), className)` as today. Tests assert the two recipe classes and the absence of the other (TV-02), not full class snapshots.
- **Files / pending proposals:** per scene the six existing files stay and five change. `types.ts`: the prop and its JSDoc, with no CVA axis because the recipe lives in Heading's static map and duplicating it would let the two drift. `use<Scene>.ts`: destructure before `...native`, normalise anything but `'show'` to `'hero'`, return the value. `<Scene>.tsx`: only `variant={…}`, with no logic. The test file and the stories: a `ShowTitle` story per scene with English copy (the consumer's Spanish string is evidence for the measurement only). `index.ts` is unchanged because no export is added. No stylesheet and no extra internal module. Outside the folders, at implementation only: `packages/ui/CHANGELOG.md`, the registry JSON with `pnpm props:docs`, `docs/CATALOGO.md` through `scripts/catalog_data.py`, and the regenerated `@egdev/system` artifact. **No token and no dependency change.** Nothing here is implemented.

### Expected-design visual reference

Follows the [capture guide](../../../design/README.md). Nothing is captured; no image or link is invented. The images would live in `docs/components/hero/v0.2/` (the folder of this spec) once separately authorized.

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | Pending. Alt text when captured: "Pulso reference closing scene at 1440px, with the title ¿CONSTRUIMOS ALGO? set at the show size beside decorative media." | Expected design: the reference's Closing title and column at 1440×900 | `egdev-foundation/reference-web/pulso-source.html` in egdev6/egdev-website; revision recorded at capture; read-only access needs separate authorization | Proposed scenario; no capture; not approved |
| VIS-02 | Pending. Alt text when captured: "Closing at 1440px with the default hero title, the word broken inside itself." | Observed: Closing with media, `hero`, the reported string; reproduces the reported break | Storybook `Organisms/Closing` on `integration/round-5`; before implementation by a class swap, or after it | Observed, not expected design |
| VIS-03 | Pending. Alt text when captured: "Closing at 1440px with the show title." | As VIS-02 with `show` | As VIS-02 | Observed |
| VIS-04 | Pending. Alt text when captured: "Closing at 1920px with the show title at its 105.6px cap." | As VIS-02 with `show` at 1920×1080 | As VIS-02 | Observed |
| VIS-05 | Pending. Alt text when captured: "Hero accent at 1440px, hero and show side by side, glow present and absent." | Hero with `accent`, `hero` against `show` | As VIS-02 | Observed |

- **Conditions / provenance per VIS ID:** 1440×900 (VIS-01 to VIS-03, VIS-05) and 1920×1080 (VIS-04); device scale 1; dark theme; Chromium with its version recorded; Barlow Condensed 800 and Barlow confirmed loaded after `document.fonts.ready`; no reduced-motion preference; component-zone crop of the scene; tool and date recorded at capture. A `capture.json` with hashes is written beside the images only when the captures are separately authorized.
- **Intent / acceptance / pending evidence:** show the recipe change, the accent glow difference and the fit outcome, for TV-02, TV-04 and TV-09. Pending: authorization to drive a browser, access to the reference, and the captures themselves. Never infer token values from pixels. Without recoverable approved references and comparable conditions, visual conformity is **Not evaluated**; captures do not replace behavior or accessibility tests.

## 7. Acceptance criteria

All checks are planned. Every observed column is Pending: this spec was written from reading only. Test homes per scene are in block 2; each amendment note repeats its own.

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| TV-01 | Default is unchanged. With `titleVariant` omitted or `'hero'`, each scene renders exactly today's markup: heading `text-title-hero`, accent in canvas colour with the hero glow utility, the same classes on every part. | Per scene: render with no prop and with `'hero'`, assert equal `container.innerHTML`, `text-title-hero` and the glow class; every existing v0.1 case stays unchanged (HE-01 to HE-07, CL-01 to CL-07, CB-01 to CB-07, LS-01 to LS-07). | Existing `Default` stories, unchanged. | Pending |
| TV-02 | `show` selects Heading's show recipe: `text-title-show` replaces `text-title-hero` on the same `h{level}`; `id`, level, accessible name (title plus accent) and the block accent are unchanged; the accent keeps `text-fg-brand-default` and carries `[text-shadow:none]` instead of the glow utility. | Per scene with `titleVariant='show'`; levels 1–6 on Hero as `Heading.test.tsx:262` does; `getByRole('heading', { level, name })`. | `ShowTitle` story per scene; VIS-03, VIS-05. | Pending |
| TV-03 | Invalid runtime values fall back to `hero` and never reach the DOM. For `'display'`, `'section'`, `'inverse'`, `'compact'`, `'SHOW'`, `''`, `null` and `42` the output equals TV-01's; no `titleVariant`, `title-variant` or value text appears as an attribute, `data-*` or class, and the root `div` receives no unknown attribute. TypeScript rejects every value but `'hero'` and `'show'`. | Per scene: untyped `as unknown as` cases like the v0.1 protected-prop tests; `@ts-expect-error` cases in the existing "rejects invalid public types" tests. | Not applicable: no visual change. | Pending |
| TV-04 | Nothing but the recipe changes. Between `hero` and `show`, every other class string and the DOM structure of root, grid, copy, heading wrapper, lede, actions, media and slot are identical; no inline `style`; no new marker. | Per scene: compare `innerHTML` after swapping only `text-title-hero` → `text-title-show` and the glow utility → `[text-shadow:none]`; assert no `[style]` and no new `eg-*` token. | `Responsive` story at both values; VIS-02, VIS-03. | Pending |
| TV-05 | A runtime change keeps identity. Rerendering `hero` → `show` → `hero` keeps the same heading node and `id` with only the recipe classes changing; instance ids stay distinct across multiple scenes. | Per scene: `rerender` and same-node assertion, as the v0.1 id tests do. | Existing multi-instance stories. | Pending |
| TV-06 | Public metadata. `titleVariant` has English JSDoc with `@default hero` and `@control select`; docgen reports it optional with default `hero` and values `hero` and `show` on all four; Controls shows a two-option select; the `@egdev/system` artifact and `system.md` list it with its default for all four, regenerated and not hand-edited. | Extend the four cases in `packages/ui/src/lib/storybook-docgen.test.ts:541-645`; metadata test for the `@control` tag; `scripts/design-system-artifact.test.mjs` and `scripts/system-md.test.mjs`; real browser Controls check. | Storybook Docs and Controls on each scene. | Pending |
| TV-07 | Registry. `heading-title-variant` is recorded `proposed` (approval null) with four usages, each with a freshly reviewed `source.revision`; convention approval stays separate and explicit; no unrelated entry changes. | `pnpm props:docs`, `pnpm props:check`, `pnpm test:props` at implementation (the plan names the exact commands); human review of the meaning. | Not applicable. | Pending; the convention approval is OQ-4 |
| TV-08 | Shipping. The built `@egdev/ui` CSS contains `text-title-hero`, `text-title-show` and both accent text-shadow utilities, all already emitted by Heading with no new scene class; packed React 18.3.1 and 19.3.0 consumers without a Tailwind compiler render a scene at each value with `font-size` resolving from the token clamps. | CSS build and static CVA scan (the `storybook-css.test.ts` pattern); packed-consumer fixtures. | Not applicable. | Pending |
| TV-09 | **Fit gate (the owner's "measured first").** In a Closing with media inside the standard `SectionShell wrap`, with the reported string "¿CONSTRUIMOS ALGO?" (split into title and accent as the consumer sets it; #560 does not state the split) and Barlow Condensed 800 confirmed loaded, measure at 1280, 1440, 1536 and 1920px for `hero` and `show`. (a) The harness must reproduce the reported mid-word break at `hero`/1440px. (b) For `show`, record whether any word breaks inside itself (every line break must fall on whitespace or at the accent block) with the word and column widths in px. Pass: no mid-word break at the viewports the owner names as targets; a failure returns to the owner (OQ-2) with the numbers. | A real browser (Playwright MCP) under separate authorization: `document.fonts.ready`, `Range.getClientRects()` per word, `getBoundingClientRect()` of the copy column. | A `ShowTitle` story with a comparable long English word; the consumer's string only in the harness; VIS-02, VIS-03, VIS-04. | **Pending.** Estimate only (block 1): fits at 1280px, unlikely at 1440px, no at about 1,475px and wider. |
| TV-10 | Other scenes. For Hero (528.14px track), ChapterBreak (515.56px) and LabStage (486.10px), record the same measurement for the consumer's real titles, which #560 does not supply. | As TV-09, once the strings exist (OQ-5). | Per-scene `ShowTitle` stories. | Pending |

### Open questions

| ID | Question / evidence | Recommendation |
| --- | --- | --- |
| OQ-1 | Authorize one real-browser session now (Storybook on this branch through Playwright MCP, optionally the read-only Pulso reference) to run TV-09 and capture VIS-01 to VIS-05? It needs no implementation: swap the heading class on the existing Closing story. | Yes. "Measured first" cannot be met otherwise, and the numbers can change what OQ-2 asks. Record them in a revised v0.2 that stays Proposed. |
| OQ-2 | If `show` still breaks the reported word at a viewport the owner cares about (the estimate says likely from about 1,475px), what is the follow-up? Options: the website adjusts the copy; a wider copy track for a scene (a v0.1 geometry change); another existing recipe in the union; a new scene title token (a token proposal that needs the owner's confirmation). | Ship `titleVariant` as specified (necessary, additive, and by the estimate enough at 1,280px and below) and decide the remainder only from the measured numbers, copy on the website first. No speculative union values, geometry or tokens in this spec. |
| OQ-3 | The accent stops glowing at `show` on every scene. Accept? | Accept: Heading is unchanged and legacy `.eg-title--show` has no glow; the JSDoc and a story document it. Keeping the glow at `show` would need a separate Heading amendment. |
| OQ-4 | Approve the new convention `heading-title-variant` / `titleVariant`, or reuse `variant` (`visual-treatment`) on the scene root? | Approve the new convention (reasons in block 3). Convention approval is separate from this spec's approval and must bind `convention:heading-title-variant` and its content hash. |
| OQ-5 | #560 reports only Closing's title. What are the real titles, accents and target viewports of Hero, ChapterBreak and LabStage? | Ask the website through the parent (consumer issue #45). Not blocking for approving this spec; blocking for TV-10 and for calling #560 resolved. |

### Spec closure

- [ ] All seven blocks are complete or justified as Not applicable; OQ-1 to OQ-5 are answered.
- [ ] The new own prop has registry lookup evidence, the proposed semantic ID and reviewed source hashes; no exception is proposed; convention approval stays explicit and separate (OQ-4).
- [ ] Proposals, verified evidence, planned checks and observed results are kept apart; every promise has an acceptance ID (TV-01 to TV-10), and no result is observed yet.
- [ ] VIS-01 to VIS-05 are captured with provenance, conditions and hashes; until then visual conformity stays Not evaluated.
- [ ] The digest is finalized and human approval identifies this exact version, digest and scope; otherwise the status remains Proposed.
- [ ] Any publication is a separately authorized comment on each canonical issue (#318, #319, #324, #325), with the full snapshot, reason, impact and previous-comment link; nothing has been published.

**Next step:** obtain the owner's answers to OQ-1 to OQ-5 and approval of this exact snapshot, run the browser measurement (TV-09) under separate authorization, then propose the bounded implementation plan for separate approval. This spec authorizes no code, token or dependency change, registry edit or external write.
