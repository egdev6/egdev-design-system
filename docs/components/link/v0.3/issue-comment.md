<!-- Draft versioned comment for https://github.com/egdev6/egdev-design-system/issues/61. Prepared locally; NOT published. Publishing requires explicit add-comment authorization for this exact text plus an authorized GitHub session. -->

## Link — v0.3 amendment draft: opt-in external `arrow-up-right` cue and brand underline

**Draft — not ready for implementation.** Two blocking owner choices (**Q1** external glyph, **Q2** underline) are open, and GitHub-visible image accessibility is pending. Nothing here is implemented, and this comment does not reapprove the approved v0.1 contract or replace the implemented v0.2 appearance.

- **Version / status:** `0.3` — Draft amendment over the implemented **v0.2** appearance and the approved **v0.1** contract. Reason: the web-catalog layer (b) closes the recorded Link variant gap "External `arrow-up-right` affordance" (`docs/components/web-catalog/v0.1/cataloging-draft.md` §3, owner-approved 2026-11-02; tracking `odd/tasks/web-catalog.md`, B5). Reading the web also exposed a second, unrecorded delta: the brand underline every web/Foundation link draws.
- **contentSHA256:** `31b7ddd97a7fdb8e263aceea387cb8108bd32969865ef64966d147f2f3c48b93` — SHA-256 of the UTF-8 canonical spec payload from its `## 1. Purpose and scope` heading through EOF, LF line endings, final newline included, tracking metadata excluded.
- **Spec copy in this repository:** `docs/components/link/v0.3/spec.md` (whole-file `sha256:0b8ed59c2baf3ce98e8fcbb6b0f48a8340445cb9980460052426f18ab7ac9c94`). This comment is intentionally not self-hashed; the payload digest above is the authoritative identity.
- **visualHashes:** `VIS-01 → sha256:0199d9eaaf14aef9657c640eb0699cf0672569f64b62f77bed2a2f5dc7448b31`; `VIS-02 → sha256:360717a9da672d3d39006f4afdc369d76c41e00e4bc062652f6514aa84e92419`; `VIS-03 → sha256:8ec8bbb769d31bef57757a6b0f74325b9e8fd72297c0ceb8808ddb7644e88d88`; `VIS-04 → sha256:45e31aa57f24199142b4fdbed96fd6c3a1b8c6e5ef16fd8671c0d27e7a84491e`; `VIS-05 → sha256:50a983ebc37fba523dc37c8d666f7aa644cedafb5da6dfaca0f2d7a9ee810b9a`; `VIS-06 → sha256:e1d5de52b3fac8f4dc42f4a73d3a355453ac2c9b1157e88ae8fcf894a298639d`; `VIS-07 → sha256:02582c8cece4fd3000f47105c463afb8bb31ff31489248f3c87252c5590f4b4d`; `VIS-08 → sha256:aa1f200ab97c05ec70c50cebfefaab3f3a852854856b07bdbbe1a72e6f65a4af`.
- **approvalReference:** Pending — no human approval of this version, digest or visuals is recorded.
- **canonicalIssue:** https://github.com/egdev6/egdev-design-system/issues/61
- **latestPublishedComment:** https://github.com/egdev6/egdev-design-system/issues/61#issuecomment-6251446299 — the v0.1 approval record. No contract snapshot has been published on this issue after it, so the value may only change after an authorized write and a matching readback.
- **previousSnapshot:** the canonical issue body (v0.1 contract, frozen body `6fe9a7c751cd84f4428872066a5ebb2655ccd08fc5f61fd2bb0c5984905e23e1`, canonical `40d2a5c032f73bee4fd74cce6b55670e5e2e574e48fad0e51a6d980a58f5b4a3`) with its approval comment `#issuecomment-6251446299`, plus the repository-only v0.2 amendment `docs/components/link/v0.2/amendment.md` (whole-file `sha256:426c7e50a662391bf3d716629dd7d8767df259d781c09b3666d7247fa9427f30`, payload `12deea02d427224fa479f6d5cfa0e094b8e595891d6379f74148abe6a72f0232`; #175 approved its direction, it was implemented, and its exact bytes were never published as a comment).

### Reason

The approved catalog decision requires the design system to build new web views. The web draws its links differently from the atom shipped under #175, in two independent ways:

| Observation | Web / Foundation evidence (read-only) | Current atom (v0.2) |
| --- | --- | --- |
| Direction cue | 7 `a.link` anchors use the up-right glyph (`#i-arrow-ur`) for off-site destinations (lines 893, 932, 939, 946, 990, 1057, 1123); 2 anchors plus 1 non-anchor span use `#i-arrow-r` for internal ones (lines 902, 1035, 1028) | `arrowName` is hard-coded `'arrow-right'` (`useLink.ts:12` type, `:54` return); "the arrow always points right" (#175, explicit rejection of the up-right derivation) |
| Underline | `.link{border-bottom:1px solid var(--r45); padding-bottom:2px}` (line 74), hover `border-color:var(--neon)` (line 75); identical `.eg-link` rule in `design-system/components/bundle.css:71-82` and in this repository's `packages/ui/src/styles/legacy/bundle.css` | Root utilities reset it: `pb-0 border-0` (#175 "remove the bottom border treatment") |

Both deltas were deliberate owner decisions in #175, so v0.3 adds them only as **opt-in inputs** and leaves every default unchanged.

### Delta — the only two new inputs

```ts
export type LinkVariant = 'plain' | 'underlined';
export type LinkArrowGlyph = 'right' | 'up-right';
// added to LinkProps
variant?: LinkVariant;        // default 'plain'
arrowGlyph?: LinkArrowGlyph;  // default 'right', ignored when arrow is false
```

| Prop | Rule |
| --- | --- |
| `variant` | Default stays `plain`: the legacy border/padding reset (`pb-0 border-0`) moves into the `plain` branch so the resolved utility set and values stay identical to v0.2 (verified against the project's extended `cn()`; only ordering differs). `underlined` adds the web/Foundation underline instead: `border-b border-border-brand pb-0.5 hover:border-fg-brand-default` — `--color-border-brand` is `var(--color-alpha-red-45)` = `rgba(255,0,54,.45)` exactly as measured, hover ink `--color-fg-brand-default` (neon), and the legacy 2px bottom inset expressed as half of the 3.2px `--spacing` unit. The reset must not stay in the shared base: `border-0` and `border-b` are different `tailwind-merge` groups, so both would survive and the underline would depend on emitted CSS order. `underlined` changes underline paint only: no ink, size, arrow or behaviour change. |
| `arrowGlyph` | Default stays `right`, so `external` still does not choose the glyph. `up-right` maps to the existing Icon glyph `arrow-up-right` (already in the closed set, `packages/ui/src/atoms/icon/types.ts:14` and `icon-paths.ts`, identical to the Foundation `#i-arrow-ur` paths) at the same `sm` size, `aria-hidden` and motion. **No Icon amendment is needed and none is requested.** |

Everything else is unchanged from the implemented v0.2: native anchor or Radix Slot/Slottable composition, required-`href` versus child-owned-`href` union, forwarded anchor ref, `external` target/rel normalization (also on slotted children), hidden localizable notice, `arrow` visibility, `eg-link` root marker, `text-fg-brand-raised` ink with `--color-primitive-red-200` hover, horizontal token-backed arrow nudge with reduced-motion reset, `--shadow-focus` ring, outer-layout-only `className`, the six mandatory files and **No stylesheet**.

### Compatibility impact

Additive only. `plain` and `arrowGlyph='right'` are the current behaviour, so existing consumers, stories, tests and rendered class sets are unaffected; no prop is removed, renamed or retyped, and the compiled stylesheet gains only the four new utilities (Tailwind source scanning of `types.ts` must emit them). Two new public types (`LinkVariant`, `LinkArrowGlyph`) join `index.ts` and `@egdev/ui`; `LinkProps` keeps its `href`/`asChild` union, so no consumer needs narrowing. Unknown runtime values normalize to `plain`/`right`. No token value, dependency, primitive, legacy CSS or consumer migration is involved.

### Prop-naming registry

Applied entries, all already approved: `variant` → `visual-treatment` (new Link usage), `arrow` → `trailing-arrow`, `external` → `new-tab-navigation`, `newTabText` → `new-tab-notice`, `asChild` → `slot-composition` — see the [registry](https://github.com/egdev6/egdev-design-system/blob/main/skills/_shared/prop-naming.json) and the [generated view](https://github.com/egdev6/egdev-design-system/blob/main/docs/prop-naming.md).

One new **proposed** convention (`status: proposed`, `approval: null`, no exception):

```json
{
  "id": "trailing-arrow-glyph",
  "name": "arrowGlyph",
  "meaning": "The explicit glyph of a component's trailing direction arrow, chosen from a closed set the component owns, when a consumer must reproduce a source design's cue.",
  "whenToUse": "A text link must show the off-site/external cue (up-right) that its source design uses, while the component default keeps pointing right.",
  "avoid": "Arbitrary icons or icon nodes (use leading-icon and slots for consumer content), a trailing-icon permission, or a boolean that duplicates the component's own default derivation.",
  "status": "proposed",
  "approval": null,
  "aliases": [],
  "exceptions": []
}
```

Rejected shapes: `arrow: boolean | 'right' | 'up-right'` (merges visibility with direction and retypes an approved usage); re-deriving from `external` (v0.1 D3, rejected by #175 — see Q1); an `IconName` override (arbitrary glyphs, and it collides with the leading-icon registry rule). If Q1 adopts this, the approved `trailing-arrow` entry's phrase "the glyph is derived by the component" needs a scoped clarification naming `arrowGlyph` as the consumer override — a separate convention-level change with its own approval, neither performed nor presumed here. Convention approval is separate from this spec, from the issue and from component approval; nothing here promotes it.

Reviewed source for the changed usages: `packages/ui/src/atoms/link/types.ts`, symbols `LinkProps` / `linkVariants`, whole-file `sha256:ba59cc4ae5c38984541b2c5a84e2aefe74b7b7f99295cc94fd3682107122936d` (already the revision recorded in the registry). **Required follow-up outside this draft:** adding the `variant` Link usage and the new convention entry, then `pnpm props:docs`, `pnpm props:check` and `pnpm test:props`, is a separate authorized change and is not performed here.

### Recoverable full snapshot

This comment is a delta. The full v0.3 contract is recovered without inference as: (1) the approved v0.1 canonical body identified above, (2) the implemented v0.2 amendment draft `docs/components/link/v0.2/amendment.md` at its recorded hashes, (3) this delta — the two new inputs and their rules — and (4) the complete seven-block v0.3 contract in `docs/components/link/v0.3/spec.md`, retained byte-exactly at whole-file `sha256:0b8ed59c2baf3ce98e8fcbb6b0f48a8340445cb9980460052426f18ab7ac9c94`. Nothing in the approved v0.1 text or the implemented v0.2 appearance is rewritten, and this comment requests no body edit.

### Visual references (Proposed, not adopted)

Local captures for this version live in `docs/components/link/v0.3/` (`capture.json` holds selectors, source HTML, conditions and per-file SHA-256). They are source captures of the current web/Foundation appearance, not approved expected design:

- VIS-01 — `docs/components/link/v0.3/underlined--external--720x480--dark.png` — Foundation external row, up-right glyph, underline.
- VIS-02 — `docs/components/link/v0.3/underlined--external-hover--720x480--dark.png` — Foundation external hover: pink label, neon underline, diagonal nudge.
- VIS-03 — `docs/components/link/v0.3/underlined--internal--720x480--dark.png` — Foundation internal row, right glyph, underline.
- VIS-04 — `docs/components/link/v0.3/underlined--no-arrow--720x480--dark.png` — Foundation row without an arrow, underline only.
- VIS-05 — `docs/components/link/v0.3/underlined--external--1280x900--dark.png` — real Pulso card footer, external up-right link.
- VIS-06 — `docs/components/link/v0.3/underlined--external-hover--1280x900--dark.png` — the same real footer, held hover.
- VIS-07 — `docs/components/link/v0.3/underlined--internal--1280x900--dark.png` — real Pulso internal link.
- VIS-08 — `docs/components/link/v0.3/underlined--nested-text--1280x900--dark.png` — real non-anchor `span.link` inside a whole-card anchor (recorded for the card/list layer, not a Link variant).

Conditions: playwright-core driving Chromium 153.0.8010.12 headless on Linux x86_64, `file://` loading, dark colour scheme, `reducedMotion: no-preference`, DPR 1, `document.fonts.ready` + settle, element-level component-zone crop, 2026-11-02; VIS-01..04 at 720×480 through a `/tmp` harness that links `tokens.css` and `components/bundle.css`, VIS-05..08 at 1280×900 on `pulso-source.html` with reveal states forced. Nothing was written inside `egdev-website`.

**Image handoff: Pending and blocked.** Local PNGs are not GitHub-visible. The owner must choose either human attachment (upload the exact PNGs and return their URLs) or a bounded, separately authorized asset-publication branch, and the published bytes must be compared against the hashes above before any image is linked here. No URL is invented and no commit, push or upload is implied.

### What approval of this comment would mean

Adopting v0.3 as the Link contract with the two opt-in inputs and unchanged defaults, and adopting or declining VIS-01 to VIS-08 as supporting evidence. It would not approve the `trailing-arrow-glyph` convention globally, the implementation plan, tokens, dependencies, legacy-CSS changes or any catalog row change. Answers needed:

- **Q1 — External `arrow-up-right` (blocking).** The web and Foundation use up-right for off-site links and right for internal ones, and the approved catalog draft records this as a gap — but #175 explicitly rejected that derivation ("the arrow always points right"). Options: (a) the proposed opt-in `arrowGlyph`, default `right`; (b) restore v0.1 D3 and derive from `external` (reverses #175); (c) decline and close the gap as a deliberate divergence. *Recommendation:* (a), because it satisfies the approved catalog gap without overriding the owner's later rejection; (b) is the smaller API if the owner wants the cue everywhere and states that #175 is superseded.
- **Q2 — Underline treatment (blocking).** The web, the Foundation preview and the still-shipped legacy `.eg-link` rule all draw the 1px brand underline that turns neon on hover; #175 removed it for the atom and the catalog draft did not record it. Options: (a) the proposed opt-in `variant="underlined"`, default `plain`; (b) make it the default (reverses #175 for every consumer); (c) decline and record the underline as a superseded web/legacy treatment. *Recommendation:* (a) if web views still need the underlined look, otherwise (c) — in which case this version reduces to Q1 and the underline captures remain history.
- **Q3 — Non-interactive link look inside a card anchor (non-blocking here).** `pulso-source.html` renders `<span class="link">Leer artículo …</span>` inside the article-feature anchor (VIS-08). *Recommendation:* not a Link mode; hand it to the card/list layer (ArticleFeature/BlogGrid, layer (c)), where the whole-card anchor owns navigation.
- **Q4 — `underlined` ink on raised surfaces (advisory).** The web uses white labels over the brand underline; the atom uses neon, which the owner accepted ("Todo neón") even though neon small text only meets AA on the canvas, not on surfaces 1–3. *Recommendation:* keep one ink for both variants and record the documented limitation; switching only `underlined` to `text-fg-default` would restore AA and match the web, but that is a separate appearance promise.
- **Q5 — Hover motion (advisory).** The web and legacy move the arrow diagonally (`translate(2px,-2px)`); v0.2 chose the horizontal nudge. *Recommendation:* keep horizontal for both variants and record the diagonal move as superseded legacy detail.

No remote action, plan, code, token, dependency or Git write is authorized by this draft.
