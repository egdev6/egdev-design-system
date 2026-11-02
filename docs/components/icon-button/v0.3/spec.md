# Component contract — IconButton

- **Version / status:** v0.3 — **Draft** (amendment of the approved v0.1 contract and the v0.2 no-hover-motion decision; owner review in issue #57). It changes no API and no approved promise; it records the round outline evidence and keeps two detail questions open.
- **Approval / recovery:** v0.1 is approved under the owner's 2026-10-17 batch grant recorded in #57 (canonical `0ad8aebf…`, frozen body `249611d3…`, [approval comment](https://github.com/egdev6/egdev-design-system/issues/57#issuecomment-6251434687)). v0.2 is the owner's 2026-11-01 decision "a iconButton si, a link no", recorded in [`../v0.2/hover-motion-amendment.md`](../v0.2/hover-motion-amendment.md) and merged in #243. v0.3 is **Pending**: no agent may treat this file as approved.
- **Current situation / pending decisions:** the gap that the approved web catalog review opened ("IconButton — round outline treatment used in social rows") turns out to be **already delivered**: `variant="outline"` is round at every size (v0.1 D4), and the web's social rows are the approved `SocialLinks` molecule (#104), which delegates `outline` + `lg` (48px) by default. Nothing new is needed for shape, level or package. Two detail questions stay open and are not blocking for the reuse conclusion: Q1 (46px versus the 48px `lg` preset) and Q2 (the outline hover-border token, which the token documentation reserves for shadows).
- **Snapshot identity:** `version: 0.3`; `contentSHA256: 28a7527a1452deda5051ff0618335b4a0b8b5b05191e0c86d1e40c47ee9bb49c`; `visualHashes: VIS-01 5b6c4dd02d58a04f36bac9799106ac925825486dde1b4904c30f3bf24bd6a2b5 (reused v0.1 reference); VIS-02 cc7ff50c78f695a4758349aaf430a2aa88cb1b0d0d91c0c64b3e067328e366c9 (reused v0.1 reference); VIS-03 771aa85d559cfd2f708891506c9323230bbad6f00c5a1194b2cc5e01bd4bc2eb; VIS-04 ebb144d9627fe9ccbe24fd5a27c62b2694dd307a65361ef7365273006becab7f; VIS-05 7aa6369495fe54447aa10432762ce4947a81d40f0662ee98d6a319f0c384b74f; VIS-06 1b7e56629ec7a9862a2f092e3dfb4f7629cf6c1bec33658aa7ac41b9b6968d65; VIS-07 2ce067984b4e0c6f15c569304893e9ac1ad560e1a3ad7289fe2a7c138e79bc76; VIS-08 da63ba2d47c65b34abaa1e06a2f03bace4be8699f97c4c3e734bb598c7ab3385`; `approvalReference: Pending (v0.3 Draft)`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/57`; `latestPublishedComment: Pending (this snapshot is prepared, not posted)`.
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from `## 1. Purpose and scope` through EOF, with LF line endings and the recorded final newline. The tracking metadata above that heading is excluded.

---

## 1. Purpose and scope

**Delta against approved v0.1 and v0.2.** v0.1 ships the atom with four treatments (`ghost` default, `outline`, `primary`, `secondary`), three sizes (32/40/48px), a required accessible `label`, `asChild` composition and no stylesheet; its decision D3 already allowed "outline 48px rather than 46px", D4 bound the shape to the treatment ("`outline` is round; a future shape axis needs its own proposal") and D10 chose `--color-alpha-red-65` for the outline hover border. v0.2 removed hover motion for every treatment. The approved web catalog review (`docs/components/web-catalog/v0.1/cataloging-draft.md` §3, owner approvals 2026-11-02) opened one IconButton row: "Round outline treatment used in social rows".

- **Need / non-goals:** the need is a **confirmation**, not a new promise. The round outline the web uses for its social rows is exactly `variant="outline"`, and the rows themselves are already an approved molecule (`SocialLinks`, #104) that delegates `outline` + `lg`. v0.3 therefore records the evidence, the exact visual delta and the remaining detail questions, and proposes **no API change**. Non-goals: a `round`/`shape`/`radius` variant or prop (D4 stands); a 46px size preset or any new token; `href`/`external` on the atom (D6 stands, links compose through `asChild`); reintroducing hover motion; a `SocialLinks` redesign (its own issue and contract own it); the Footer, MobileMenu, Hero and Closing organisms (later delivery layers); tooltips, pressed state, loading; a stylesheet; visual-regression tolerances.
- **Cataloging decision / alternatives:** **reuse**, twice over. (a) Atom level: no new component and no new variant; the round outline is `variant="outline"`. (b) Row level: `SocialLinks` (#104, implemented, exported from `@egdev/ui`) already composes that treatment into a named `<ul>` of native anchors with `outline` + `lg` defaults. *Variant* rejected: adding `round` would duplicate an existing treatment under a second name and fork the recipe. *New component* rejected: no new responsibility, level or Radix base. *Compose in the app* rejected: it would duplicate accessible names, the list model and the external-rel handling that `SocialLinks` already owns. The remaining delta is data-level, not structural: 46px versus 48px, and the hover-border token.
- **Evidence / level and package:** atom in `@egdev/ui`, folder `packages/ui/src/atoms/icon-button/`. Inspected in this repository (whole files, 2026-11-02): `types.ts` (sha256 `721e9ef2…`), `useIconButton.ts` (sha256 `98c0573b…`), `IconButton.tsx`, `IconButton.test.tsx`, `IconButton.stories.tsx`, `index.ts`; `packages/ui/src/index.ts:12` (`export * from './atoms/icon-button'`); `packages/ui/src/molecules/social-links/{types.ts,useSocialLinks.ts,SocialLinks.tsx}` and `docs/components/social-links/v0.1/implementation.md` (D7 delegates `outline`/`ghost` and `md`/`lg`, default `lg` = 48px); `docs/CATALOGO.md:109` (SocialLinks row and its `outline/ghost` + `md/lg` promise); `docs/components/icon-button/v0.2/hover-motion-amendment.md`; `odd/tasks/visual-review-corrections.md` L44/L45 (#243 "IconButton no hover motion"); issue #57 body plus its approval comment. Read-only web evidence (owner-granted, nothing written there): `reference-web/pulso-source.html` (sha256 `778e5412…`), `design-system/components/IconButton/{preview.html}` (`4f8192dc…`), `design-system/components/IconButton/README.md` (`1559ce04…`), `design-system/components/SocialLinks/README.md` (`027da7ec…`), `design-system/tokens.css` (`1c92acb8…`), `design-system/components/bundle.css` (`04797068…`).

## 2. Anatomy and composition

Anatomy is unchanged from v0.1; the only clarification is the list-row composition the web needs, which the atom still does not own.

| Part | Responsibility | Native element / Radix primitive | Allowed content |
| --- | --- | --- | --- |
| Root | Action, or composed navigation when `asChild` | `<button type="button">`; `Slot` with a consumer anchor | One child element when `asChild` |
| Icon | Decorative glyph | `AccessibleIcon.Root` around the `icon` element (`aria-hidden`, `focusable="false"`) | One SVG/`Icon` element |
| Hidden label | Accessible name | Visually hidden text from `AccessibleIcon` | `label` string |

- **Radix / composition:** unchanged — `@radix-ui/react-slot` 1.5.0 and `@radix-ui/react-accessible-icon` 1.2.0, both installed. No interactive primitive is needed. The round outline is used in **link form** through `asChild`, and the row (`<ul>` + `<li>` + one `IconButton` per entry) is composed by `SocialLinks`, not by the atom.
- **Public markers:** root `eg-icon-btn` stays on the native and the slotted host; no part markers and no `data-testid`. `SocialLinks` keeps `eg-social`, `eg-social__label`, `eg-social__list`. Legacy `.eg-icon-btn*` rules in `packages/ui/src/styles/legacy/bundle.css` remain until parity and an approved migration.

## 3. Public API

**No prop, type, default or export change is proposed in v0.3.** The table restates the shipped v0.1 surface so the amendment is self-contained and the round outline can be read against it.

- **Prop conventions:** registry source `skills/_shared/prop-naming.json`, generated view `docs/prop-naming.md`, consulted by meaning, name and aliases.

| Prop / event | Type | Required | Default or rule | Description (unchanged v0.1) |
| --- | --- | --- | --- | --- |
| `label` | `string` | Yes | None | `accessible-name`. Non-empty name, rendered as visually hidden text, never `aria-label`. `@control text`. |
| `icon` | `ReactElement` | Yes | None | `leading-icon` (IconButton-only required icon-only semantics). One decorative glyph, hidden from assistive technology. `@control false`. |
| `variant` | `'ghost' \| 'outline' \| 'primary' \| 'secondary'` | No | `ghost` | `visual-treatment`. `outline` is the round treatment under review here. `@control select`. |
| `size` | `'sm' \| 'md' \| 'lg'` | No | `md` | `preset-dimensions`. 32/40/48px square; glyph 16px at `sm`, 20px otherwise. `@control select`. |
| `asChild` | `boolean` | No | `false` | `slot-composition`. Applies the control to one child host; the social row uses it for anchors, the carousel arrows keep the native root. `@control boolean`. |
| `children` | `ReactElement` | No | Absent | Single host element when `asChild`; never visible label content. `@control false`. |
| `disabled` (native) | `boolean` | No | `false` | Native on `<button>`; with `asChild` becomes `aria-disabled` + `tabIndex=-1` and cancels activation. |
| Native attributes | `<button>` props of the active branch | No | Forwarded | `id`, `title`, `data-*`, compatible `aria-*`, `onClick`; `target`/`rel` belong to the slotted child. |
| `className` | `string` | No | Absent | Root layout only (margin, alignment, placement), merged last by `cn()`. |

```ts
export type IconButtonVariant = 'ghost' | 'outline' | 'primary' | 'secondary';
export type IconButtonSize = 'sm' | 'md' | 'lg';

/** Icon-only action; native attributes pass through except the owned hidden-label mechanism. */
export type IconButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'aria-label'> & {
  label: string;
  icon: ReactElement;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  asChild?: boolean;
  children?: ReactElement;
};
```

  The two CVA recipes (`iconButtonVariants`, `iconButtonIconVariants`) stay internal and are not exported from `index.ts`, so this declaration is the whole public API.

- **Registry entries reused (exact IDs, all `approved`):** `accessible-name` (`label`), `leading-icon` (`icon`), `visual-treatment` (`variant`), `preset-dimensions` (`size`), `slot-composition` (`asChild`). Each already carries an `IconButton` usage pinned to `source: {path: packages/ui/src/atoms/icon-button/types.ts, symbol: IconButtonProps, revision: sha256:721e9ef2357a52b4a75ce9202736901a82a80ab7d5da7ba94b575f582d351489}`, and that whole-file hash was re-verified against the reviewed working tree on 2026-11-02, so no source evidence is stale.
- **New convention proposals:** none. The round outline is an allowed value of the existing `variant` treatment axis; shape follows the treatment (D4), so no `shape`/`radius` concept is proposed and `corner-radius` (`radius`) stays unclaimed here because the atom exposes no radius prop.
- **Exceptions:** none new. The IconButton-only `leading-icon` semantic amendment approved in v0.1 (receipts [`../v0.1/prop-naming-approval.json`](../v0.1/prop-naming-approval.json) and [`../v0.1/prop-naming-approval-leading-icon-combined.json`](../v0.1/prop-naming-approval-leading-icon-combined.json)) is unchanged and keeps its bytes.
- **Native props / refs:** unchanged — `forwardRef<HTMLButtonElement>`; the ref reaches the native button or, with `asChild`, the slotted anchor.
- **Controlled / uncontrolled:** Not applicable (no state; two-state icon controls are Toggle, D7).
- **Compatibility:** no public export, marker, class or default changes; `iconButtonVariants` and `iconButtonIconVariants` stay internal. **If Q2 is adopted**, the outline recipe string in `types.ts` changes, which changes the whole-file bytes and therefore requires the five registry usage revisions and the generated view to be updated in the same slice (`pnpm props:docs`, `pnpm props:check`, `pnpm test:props`). Nothing else in the API would move. `SocialLinks` needs no change under either answer: it only forwards `variant`/`size`.

## 4. Behavior

Behavior is unchanged from v0.1 and v0.2. The rows below record only the states that the round outline and the social row exercise.

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| Default render, `variant="outline"` | `<button type="button" class="eg-icon-btn … rounded-full …">`, named by `label`, icon hidden | None |
| `asChild` with an anchor | The anchor keeps its role, `href`, `target` and `rel`; the root ref reaches it; no `type` is injected | None |
| Hover (pointer) | Border, fill and glow advance and the glyph turns brand colour; **no translate or scale** (v0.2) | None |
| Press | `motion-safe` `scale-94` with `--duration-press`; reduced motion removes it | None |
| Focus via keyboard | `focus-visible` ring `--shadow-focus`; the hover shadow recipe is excluded while focused | None |
| Disabled native / slotted | Native button unavailable, or `aria-disabled` + `tabIndex=-1` with activation and navigation cancelled; `data-disabled` present, opacity .45 | None |
| Row composition (`SocialLinks`) | One `<ul role="list">` with an accessible name, one `<li>` per valid entry, `outline`/`lg` by default; `external` entries add `target="_blank"`, secure `rel` and one hidden notice | Native anchor events |

- **States / representation:** `data-disabled` plus native `disabled`/`aria-disabled`; hover, press and focus through pseudo-classes only. No own `data-state`, no mirrored state classes.
- **Limits / consumer responsibilities:** the consumer supplies a clear `label` that names the destination (the web uses "GitHub @egdev6"), the destination itself, `target`/`rel` on the slotted child, and the list semantics. `sm` (32px) is dense desktop only; social rows on touch stay at `md`/`lg` (≥44px). The atom does not own row spacing, ordering, validation or the external notice — `SocialLinks` does.

## 5. Accessibility

Unchanged from v0.1; the row composition adds only consumer obligations that `SocialLinks` already enforces.

- **Accessible name / roles / relationships:** name from the visually hidden `label`; role `button`, or the slotted child's role with `asChild`. Glyphs stay hidden and unfocusable. In the round outline social row the name must identify the destination, not the glyph ("GitHub @egdev6"), which is what the reference page's `aria-label` and `SocialLinks`' `label` field both do; the `<ul role="list">` supplies the item count and the list name.
- **Keyboard / focus:** native Tab/Enter/Space for the button, native Enter for the slotted anchor; no arrow keys, no roving focus, no focus trap. Focus ring is `--shadow-focus` through `focus-visible`. A 48px `lg` control satisfies the 44px touch target; `md` at 40px is documented as dense desktop only.
- **Announcements / other conditions:** no live region, no announcements on hover or press. Disabled state is opacity plus unavailable interaction, not colour alone. External destinations get the hidden new-tab notice from `SocialLinks`, not from the atom (D6). Focus and disabled behaviour are inherited promises and stay under their existing checks.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| `variant` | `ghost`, `outline`, `primary`, `secondary` | `ghost` | All sizes. `outline` is the round treatment; the other three keep `radius-md`. No `round`/`shape`/`radius` axis (D4). |
| `size` | `sm` 32px, `md` 40px, `lg` 48px | `md` | Glyph 16px at `sm`, 20px at `md`/`lg`. `SocialLinks` defaults to `lg`; `sm` is dense desktop only. |
| State | rest, hover, press, focus-visible, disabled | rest | Hover carries no motion (v0.2); disabled suppresses hover and press. |

- **Tokens / Material:** the round outline recipe is the approved v0.1 elevated Material v2 control, declared with CVA in `types.ts:57` and composed through `cn()` in `useIconButton.ts`. Outline (quote): `border rounded-full border-border-hairline-strong bg-surface-1 bg-[image:var(--gradient-sheen)] shadow-[var(--shadow-edge),var(--shadow-elev-1)] text-fg-secondary [&:not([data-disabled]):hover]:border-alpha-red-65 [&:not([data-disabled]):hover]:bg-surface-2 [&:not([data-disabled]):hover:not(:focus-visible)]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1),var(--shadow-glow-base)] [&:not([data-disabled]):hover]:text-fg-default`, plus the shared base (`eg-icon-btn group/icon-button box-border inline-grid place-items-center flex-none p-0 border-solid border-transparent …` with the transitions, `motion-safe` press scale, `focus-visible:shadow-focus`, `data-disabled:opacity-45 data-disabled:pointer-events-none` and the reduced-motion resets) and the glyph recipe `group-[:not([data-disabled]):hover]/icon-button:text-fg-brand-default`. No token value changes; no handwritten colour, gradient, shadow or spacing. **Q2** proposes swapping one token, `border-alpha-red-65` → `border-border-brand`, because the current token's own documentation reserves it for shadows and both web sources use the 45% brand border; that is an appearance change to an approved promise (D10), so it stays a question, not a decision.
- **Dynamic geometry:** Not applicable. No inline style, no custom property, no interpolated class string. The 46px web value is a source measurement, not a new geometry mechanism or a new preset (Q1).
- **Class composition / consumer layout:** root `className` merges last through `cn()` for outer layout only, on the native root and on the slotted host; `eg-icon-btn` is never dropped and the glyph recipe wins over a supplied glyph size class. `twMerge` resolves recognized conflicts only, so a consumer utility that collides with the treatment recipe is a documented limitation, not a supported appearance override. Row spacing is `SocialLinks`' `gap` (1/2 → 4/8px), never the atom's.
- **Files / pending proposals:** the six mandatory files keep their roles — `types.ts` (public props/types and the private CVA recipes), `useIconButton.ts` (host, disabled guards, name/icon derivation, class composition), `IconButton.tsx` (JSX), `IconButton.test.tsx`, `IconButton.stories.tsx`, `index.ts`. **No stylesheet**; no additional internal module; no dependency change. Planned, separately approvable documentation work only: state in the story/meta copy that `outline` is the web's round social-row treatment and is used at `lg`, and add one `outline` `lg` example to the existing `Sizes` story. No new composition story on `IconButton`, because the row belongs to `SocialLinks`. `docs/CATALOGO.md` is generated from `scripts/catalog_data.py` and needs no row change for a reuse conclusion.

### Visual delta (observed, measured)

| Property | Web hero social row (VIS-03/VIS-04) | Foundation `.eg-icon-btn--outline` (VIS-07/VIS-08) | DS `variant="outline"` at `lg` | Delta / decision |
| --- | --- | --- | --- | --- |
| Shape | circle, `border-radius: 9999px` | circle, `--radius-full` | circle, `rounded-full` | None |
| Border box | 46×46px (`box-sizing: border-box`) | 48×48px (46px content + 1px border each side) | 48×48px (`box-border`, `size-12`) | −2px in the hero only; allowed difference already recorded in v0.1 D3 → Q1 |
| Border | 1px `rgba(255,255,255,.07)` | 1px `--color-border-subtle` (same value) | 1px `--color-border-hairline-strong` `rgba(255,255,255,.14)` | DS is stronger; kept (Material v2 raised recipe, no flat replacement) |
| Fill | flat `rgba(255,255,255,.03)` | flat `color-mix(fg 3%)` | `bg-surface-1` + `--gradient-sheen` | DS sheen kept; the web/Foundation flat fill is source evidence, not expected design |
| Elevation | none | none | `--shadow-edge` + `--shadow-elev-1` | DS raised; kept |
| Glyph | 20px | 20px (`--icon-size`) | 20px at `md`/`lg` | None |
| Item gap | 8px | 8px (`--space-2`) | `SocialLinks gap` default 2 = 8px | None |
| Hover border | `rgba(255,0,54,.45)` (brand 45%) | `--color-border-brand` (45%) | `border-alpha-red-65` (65%) | **Q2**: the current token is documented "solo dentro de sombras" |
| Hover fill | `rgba(255,0,54,.1)` red tint | `--color-alpha-red-10` | `bg-surface-2` + sheen | Allowed difference; a red-tinted control fill would be a new Material treatment → Q3 |
| Hover glyph | neon | `--color-fg-brand-default` | `text-fg-brand-default` | None |
| Hover motion | `translateY(-2px)` | `translateY(-2px)` | none | Superseded by the owner's v0.2 decision; the web lift is not adopted |
| Press | not defined | not defined | `motion-safe` `scale-94` | DS adds press feedback; kept |
| Focus | hardcoded 2px black + 4px white ring | `--shadow-focus` | `focus-visible:shadow-focus` | Token ring; kept |
| Footer / slider controls | ghost, 40px, `border-radius: 12px`, no border (VIS-05/VIS-06) | ghost 40px, `--radius-md` | `ghost` + `md` = 40px, `radius-md` = 9.6px (token documented as "12px ×0.8") | None; the 12px→9.6px difference is the approved 80% scale |

### Expected-design visual reference

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | [`docs/design/foundation-boards/v2026-10-17/IconButton.png`](../../../design/foundation-boards/v2026-10-17/IconButton.png) — "Ghost 40px row, a six-icon outline social row with hairline circles, and an outline hover row" | Foundation board rows: `ghost` rest/hover/disabled; `outline` rest/hover | Foundation `components/IconButton/preview.html`, board set v2026-10-17; **reused historical capture** | Approved as v0.1 expected design (owner instruction 2026-10-17, review in #57); in v0.3 it remains the reference for the outline appearance and is not a fresh v0.3 capture |
| VIS-02 | [`docs/design/foundation-boards/v2026-10-17/specimens/icon-button--specimen.png`](../../../design/foundation-boards/v2026-10-17/specimens/icon-button--specimen.png) — "Primary and secondary square icon actions at md and lg, ghost sizes, outline lg, focus and disabled" | Foundation specimen: `primary`/`secondary` md/lg, `ghost` sm/md/lg, `outline` lg, focus-visible, disabled | Foundation `components/IconButton/specimens`, board set v2026-10-17; **reused historical capture** | Approved as v0.1 expected design in the same record; reused unchanged |
| VIS-03 | `outline--round-hero-social--1280x900--dark.png` — "Six round outline social links in one row, each a 46px circle with a 1px hairline border and a faint white fill, showing GitHub, YouTube, Twitch, X, LinkedIn and Instagram glyphs." | Real hero social row (`.hero-social .hs-list`), rest | `reference-web/pulso-source.html` sha256 `778e5412…`, capture v0.3-capture-1 | Proposed (Pending owner adoption); source evidence of the role, not approved expected design for the DS recipe |
| VIS-04 | `outline--round-hero-social-hover--1280x900--dark.png` — "The same six circles with the first one hovered: brand-red border, red-tinted fill, neon glyph and a 2px upward shift." | Same row with a real `:hover` on the first link | `reference-web/pulso-source.html` sha256 `778e5412…`, capture v0.3-capture-1 | Proposed (Pending owner adoption); the lift is the part v0.2 supersedes |
| VIS-05 | `ghost--footer-social--1280x900--dark.png` — "Five rounded-square ghost icon links in the footer: GitHub, YouTube, Twitch, X and LinkedIn, with no border." | Real footer social row (`.foot-grid .soc-row`), rest | `reference-web/pulso-source.html` sha256 `778e5412…`, capture v0.3-capture-1 | Proposed; evidence that the footer row is ghost, not outline |
| VIS-06 | `ghost--slider-controls--1280x900--dark.png` — "Slider controls: a two-digit counter, a previous-arrow rounded-square icon button, a next-arrow rounded-square icon button and a text link." | Real carousel controls (`.tips-ctrl`), rest | `reference-web/pulso-source.html` sha256 `778e5412…`, capture v0.3-capture-1 | Proposed; evidence that slider controls are ghost 40px |
| VIS-07 | `outline--foundation-preview-row--720x480--dark.png` — "Six Foundation .eg-icon-btn--outline links in one row, each a circle with a 1px subtle border and a 3% white fill." | Foundation preview row 2 (`outline 46px`), rest | `design-system/components/IconButton/preview.html` sha256 `4f8192dc…`, capture v0.3-capture-1 | Proposed supporting reference only; it does not renew or widen VIS-01 |
| VIS-08 | `outline--foundation-preview-hover--720x480--dark.png` — "One Foundation outline link in its hover state: brand-red border, red-tinted fill, neon glyph and a 2px upward shift." | Foundation preview row 3 (`outline hover`, legacy `.is-hover` class) | `design-system/components/IconButton/preview.html` sha256 `4f8192dc…`, capture v0.3-capture-1 | Proposed supporting reference only |

- **Conditions / provenance per VIS ID:** all new captures: playwright-core driving Chromium 153.0.8010.12 (`chrome-headless-shell`) headless on Linux x86_64, `file://` loading, color scheme dark, `reducedMotion: no-preference`, DPR 1, `--force-color-profile=srgb`, `document.fonts.ready` plus 1.5s, all `[data-reveal]` nodes forced to their revealed state plus 900ms, element-level component-zone crop, taken 2026-11-02. VIS-03/04/05/06: viewport 1280×900; Barlow 600/700, Barlow Condensed 700 and JetBrains Mono 500 confirmed loaded. VIS-07/08: viewport 720×480 in the read-only `/tmp/egdev-sbcheck/icon-button-preview.html` harness that mounts the preview fragment and its inline style block unmodified and links `tokens.css` and `bundle.css` by `file://`; `document.fonts.check('600 12px "Barlow Condensed"')` was true while `document.fonts.check('600 13px Barlow')` was false, so the `.meta` captions under those circles may use a synthesized or fallback weight; the circles and glyphs are SVG and unaffected. VIS-01/VIS-02 keep their original 2026-10-17 conditions. Per-image hashes, selectors, source fragments and observed computed styles live in [`capture.json`](./capture.json).
- **Intent / acceptance / pending evidence:** preserve the circle geometry, the 1px border, the 20px glyph and the treatment-bound shape; the DS keeps its stronger hairline, sheen, edge/elevation and token focus ring instead of the web's flat 3% fill and hardcoded ring; the web's −2px hover lift is not adopted. Related criteria: AC-02 to AC-05 and AC-08. Visual conformity is **Not evaluated** until the owner adopts a snapshot; these captures are source evidence and never replace behavior or accessibility checks, and no token value is inferred from their pixels.

## 7. Acceptance criteria

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | Default remains `ghost` `md`: `button type="button"`, `eg-icon-btn`, `size-10`, `rounded-md`, no `rounded-full` | `IconButton.test.tsx` (existing case, preserved) | Default | Pending |
| AC-02 | `outline` is round at every size and never resolves `rounded-md`; the rendered border box equals the preset (32/40/48) | `IconButton.test.tsx`, extended `it.each` over the three sizes | Variants, Sizes | Pending |
| AC-03 | `outline` hover carries no translate or scale; only the `motion-safe` `:active` press scales | `IconButton.test.tsx` (existing no-hover-motion case, preserved) | States | Pending |
| AC-04 | The `outline` glyph turns brand colour on hover through the group selector while the glyph stays `aria-hidden` | `IconButton.test.tsx` class assertion plus the existing accessible-name case | Variants | Pending |
| AC-05 | `asChild` keeps the anchor's role, `href`, `target`, `rel` and the `eg-icon-btn` marker, and inside `<ul role="list">` the row keeps its list name and item count | `IconButton.test.tsx` (existing slotted case, preserved) plus one list-composition case | AsChildLink (existing) | Pending |
| AC-06 | `SocialLinks` still defaults to `outline`/`lg` (48px) and still renders one `<li>` per valid entry with secure rel | existing `SocialLinks.test.tsx` (no change proposed) | Molecules/SocialLinks (`Default` already documents "outline lg links") | Pending |
| AC-07 | Story and meta copy state that `outline` is the round social-row treatment used at `lg`, and the `Sizes` story includes an `outline` `lg` example, with no `@control` diagnostics | metadata/docgen test plus the existing controls suite | Sizes, Variants | Pending |
| AC-08 | **Only if Q2 is adopted:** the outline hover border resolves `border-border-brand` and no longer `border-alpha-red-65`; if declined, the current class is pinned by a test and the difference is recorded as allowed | `IconButton.test.tsx` class assertion | States | Pending |
| AC-09 | Registry stays green: no new entries or exceptions, `pnpm props:check` and `pnpm test:props` pass; if Q2 changes `types.ts` bytes, all five usage revisions and the generated view are updated in the same slice | `pnpm props:check`, `pnpm test:props` | Not applicable | Pending |
| AC-10 | The round outline utilities are present in the built CSS and a packaged consumer without a Tailwind compiler renders them | existing build + static CVA scan + packaged consumer checks (preserved) | Not applicable | Pending |

### Spec closure

- [x] All seven blocks are complete or justified as Not applicable (dynamic geometry: not applicable).
- [x] New/changed own props: none. Registry lookup recorded with exact applied IDs (`accessible-name`, `leading-icon`, `visual-treatment`, `preset-dimensions`, `slot-composition`), no new proposals and no new exceptions; the v0.1 IconButton-only `leading-icon` amendment stays byte-identical.
- [x] Proposals, verified implementation and planned checks are distinct; every promise has an acceptance ID and a planned method, and nothing is claimed as observed.
- [x] Visual IDs identify real provenance, conditions and related criteria, and the reuse of VIS-01/VIS-02 is labelled as historical rather than a fresh capture.
- [ ] Snapshot identity is recoverable and the owner approval identifies this exact version, content digest, visual hashes and scope — **Pending**; the status stays Draft until then.
- [x] One canonical issue is retained (#57); v0.3 is prepared as a versioned comment over the v0.1 body plus its approval comment, never a body edit or a new issue.

### Open questions for owner approval

- **Q1 — 46px versus the 48px preset.** The live hero row renders 46×46px border-box; the Foundation `.eg-icon-btn--outline` declares `width: 46px` with `box-sizing: content-box`, so it actually paints a 48×48px border box, and the DS `lg` preset is 48×48px `box-border`. A 46px preset would need a new value outside the approved 32/40/48 scale. *Recommendation:* keep `lg` (48px). It matches the Foundation component pixel-for-pixel, is already what `SocialLinks` defaults to, keeps the 44px touch target, and the +2px against the live hero row is the difference v0.1 D3 already allowed. Do not add a size or a token for it.
- **Q2 — Outline hover-border token.** The DS uses `--color-alpha-red-65`, whose own documentation says "Solo dentro de sombras; no usar suelto"; both web sources use the 45% brand border (`--color-border-brand`), and it is the only visible border token that expresses "brand hover" without a red-tinted fill. *Recommendation:* adopt `border-border-brand` for the outline hover border. It aligns the atom with its token's documented role and with the web, and it removes one of the ten usages that the #229 sweep listed as unreplaceable. Cost: one CVA class plus the registry byte refresh (AC-08/AC-09). If declined, the current class is pinned and the difference is recorded as allowed.
- **Q3 — Hover fill tint.** The web turns the circle red-tinted (`alpha-red-10`) on hover; the DS keeps a neutral raised surface plus a red glow. *Recommendation:* keep the neutral raised hover. A red-tinted control fill is a Material overlay treatment that would need its own approved recipe, and the glow plus the neon glyph already carry the brand cue.
- **Q4 — Where the row is documented.** The social row is `SocialLinks` (already implemented, and its `Default` story already documents "outline lg links"); duplicating a row story inside `IconButton` would put a molecule's composition in the atom's docs. *Recommendation:* keep the row in `SocialLinks`, and in `IconButton` only state in copy that `outline` is the round social-row treatment used at `lg` (AC-07). If the owner prefers a single atom-level example, add it as one extra `Sizes`/`Variants` cell rather than a composition story.
- **Q5 — Footer, Closing and slider controls.** The footer social row and the carousel arrows render the ghost square treatment (40px, 12px radius), not the round outline; the Closing section renders three text Buttons and has no social row at all. *Recommendation:* no contract change — `ghost` `md` already matches both (the 12px → 9.6px radius is the approved 80% scale), and the Closing observation only corrects the source scope of this amendment.

**Next step:** the owner answers Q1–Q5 and approves this exact version; only then may a documentation-only implementation plan (or, if Q2 is adopted, that plan plus the one-token CVA change and its registry refresh) be proposed with its own approval. This spec authorizes no code, token or dependency change, and no external write.
