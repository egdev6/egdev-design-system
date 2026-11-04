# Web catalog v0.2 — implementation plan

**Status: DRAFT — implementation is not authorized.** This plan exists to make `visual-amendments.md` (final proposal, awaiting exact approval) executable once its gates open. It authorizes no execution merely by being written; later approved units include their necessary code, docs and checks. Nothing here is approved by writing it.

- **Source of truth:** `docs/components/web-catalog/v0.2/visual-amendments.md` — its `A#` sections and their quoted values, tokens and checks are authoritative over any summary in this plan.
- **Owner authorization (verbatim):** "ciérralo y prepara la planificación de todo" — close the draft, plan everything. Planning only.
- **Screenshots and approvals:** every existing visual approval stays historical. Owner `Image#11`–`Image#18` are conversation provenance; this plan creates no capture, no `capture.json` and no hash, and claims none.
- **No writes in the website repository.** Adopting `WebTemplate`/`WebSection`, relocating choreography and removing `HomeTemplate` from the site are separately authorized work in that repository (see §7).

## 1. Rules every work unit inherits

| Rule | Content |
| --- | --- |
| Test-first | ODD policy: behaviour-level RED first, minimum GREEN, one PRESERVE test per touched existing behaviour, then refactor. Visual-only deltas state the exception and use rendered computed-style/property assertions instead of a fake RED. |
| Same commit | Tests, stories, docs and behaviour land in one unit commit. No "tests later", no separate doc-only follow-up for a behaviour change. |
| Files | Existing components keep their delivered file set. New components ship at least the six meaningful component files: `types.ts`, `use<Name>.ts`, `<Name>.tsx`, `<Name>.test.tsx`, `<Name>.stories.tsx`, `index.ts`. No dummy stylesheet: a `component-name.css` exists only if a spec approves a compliant role. |
| Styling | Static CVA utilities from `@egdev/tokens` plus `cn()`; no inline appearance, no interpolated classes, no handwritten shadow/gradient, no `@egdev/effects` import in `@egdev/ui`. |
| Tokens/deps | No token/dependency change. Registry/generated naming documentation updates are planned only after exact semantic approval; content-description and all new slot/message mappings must be resolved before source changes. |
| Verification | Focused checks first. `pnpm test <paths>`, `pnpm typecheck`, `pnpm lint`, `pnpm --filter @egdev/ui build`, `pnpm test:package-exports`. Suite parity with pre-push: `NODE_OPTIONS=--max-old-space-size=1024 pnpm test` (unchanged). |
| Evidence | Report actual DOM/style/renderer traces (own-element computed style, emitted Tailwind rule in `dist/styles.css`, warnings, accessible name, tab stops), never a test-pass summary as visual proof. |
| Reproduce first | Before fixing any owner-visible defect, reproduce the owner's example in a real browser under equivalent conditions (same story, content, theme, 390/767/768/1280 px) and record the observation. |
| Differential | One base/current differential only where changed shared code affects an unrequested sibling (barrels `packages/ui/src/index.ts`, `organisms/footer/index.ts`). Scratch copy lives in `mktemp -d`; no committed test reads git history. |

## 2. Work units

Estimates are authored diff lines (implementation + tests + stories + docs in the same unit), not review effort.

For U3/U4/U9/U10, approved ancillary edit surfaces include `packages/ui/src/index.ts` (owned export blocks), `skills/_shared/prop-naming.json` (approved usages/concepts only), `docs/prop-naming.md` (generated), the component's `README.md`, its versioned naming receipt, `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs`, and the existing central docgen/control test files. U12 also owns `scripts/catalog_data.py` and generated `docs/CATALOGO.md`. No source surface is authorized merely by appearing in this plan.

### P0 — close exact component contracts before source changes

- Scope: scope-specific component amendment/spec snapshots for A1–A12, including WebSection/WebTemplate API types, slot ordering/absence, heading/landmark ownership, native prop boundaries, className merge surfaces, Material/no-stylesheet roles, naming mappings, and exact visual-reference provenance. Preserve historical approval bytes.
- Deliverable: recoverable per-component approval evidence, separate naming/recipe decisions, then approval of this plan at its exact content identity; do not rewrite old approvals or treat this planning request as unseen-spec approval.
- Dependencies: the owner's accepted direction is established. P0 produces G4 deliverables; they are not a prerequisite for starting P0. Formal source work U1–U10 waits for its applicable gates. U11 is separately spec-first.
- Size: additional documentation/asset work depends on actual reference handoff; the 1,970-line table is the initial unit estimate, not a guaranteed total including every approval artifact. No source changes, test RED or runtime verdict is claimed at this stage.

### U1 — NowCard top inset, NowStrip inheritance (A2, A8)

- **Surfaces:** `packages/ui/src/molecules/now-card/{types.ts,useNowCard.ts,NowCard.test.tsx,NowCard.stories.tsx}`, `packages/ui/src/organisms/now-strip/{NowStrip.test.tsx,NowStrip.stories.tsx}`, `docs/components/now-card/v0.2/spec.md`, `docs/components/now-strip/v0.2/spec.md`.
- **Depends on:** G1, G4.
- **Size:** ~130 lines. **Risk:** low. `headingBase` is shared by `NowCard` and `NowStrip` — both requested, so no unrequested sibling is exposed; still run the A2-AC2 badge-parity differential against the base build.
- **Checks:** RED — `data-badge` presence marker on the root, and heading recipe resolves to the no-badge inset class for `md` and `sm`; PRESERVE — badge cards keep `px-6 pt-6 pb-3` and today's heading classes. Visual: computed `padding-top` = 19.2 px on the packed own element at 390/1280 px; the Tailwind rule exists in `dist/styles.css`.
- **Docs/registry:** both specs record the inset and the mixed-row case; no prop change, so no `@control` edits; no registry work.
- **Commit:** `fix(now-card): inset heading when no badge and inherit it in now-strip`.

### U2 — CommunityCard reserved header band (A4)

- **Surfaces:** `packages/ui/src/molecules/community-card/{types.ts,useCommunityCard.ts,CommunityCard.tsx,CommunityCard.test.tsx,CommunityCard.stories.tsx}`, `docs/components/community-card/v0.2/spec.md`.
- **Depends on:** G1, G4, G2 (fixed band and explicit two-line visual limit).
- **Size:** ~140 lines. **Risk:** low-medium — replaces the public `Text` eyebrow primitive with a local part recipe (promise change recorded in the spec) and adds a reserved band.
- **Checks:** RED — the header text element carries the 12.8 px recipe and no longer the `Text` eyebrow variant; the band carries the reserved-height utilities at both breakpoints. PRESERVE — the rotated brand diamond marker and the 8 px marker gap survive the recipe move; body title typography, body padding, action position and the mark's `max-h-16` cap unchanged; mark contract (named vs decorative) untouched. Visual: paired logo/no-logo card heights equal at 390/767/768/1280 px; header text computed size 12.8 px in both members; over-long label keeps the fixed header height, displays at most two lines and retains full accessible text (A4-AC5, exact policy pending approval).
- **Docs/registry:** spec records the geometry derivation (51.2 + 2×12.8 = 76.8; 51.2 + 2×16 = 83.2), the fixed-height/two-line policy and the exact `G2` approval gate; no registry entry is needed (no new prop).
- **Commit:** `feat(community-card): reserve a constant header band and raise header text`.

### U3 — ProjectCard backdrop and mark (A1)

- **Surfaces:** `packages/ui/src/molecules/project-card/{types.ts,useProjectCard.ts,ProjectCard.tsx,ProjectCard.test.tsx,ProjectCard.stories.tsx,index.ts}`, `docs/components/project-card/v0.2/spec.md`.
- **Depends on:** G1, G4, **G3** (exact scrim recipe).
- **Size:** ~230 lines. **Risk:** low-medium — two additive parts, one new `isolate` wrapper; the frozen v0.1 contract and its plan hash stay intact.
- **Checks:** RED — `ProjectCardBackdrop` renders `aria-hidden` and stays out of the accessible name; `ProjectCardMark` accepts the three documented mark shapes; the new parts add no tab stops and existing free-body/footer interactions are preserved. PRESERVE — cards without the parts render byte-identical structure and no `isolate` wrapper. Visual: broken-image case keeps frame, scrim and legible text; 390/768/1280 px without clipping index, mark or heading; mark cap 153.6 px.
- **Docs/registry:** spec records the scrim recipe, the rejected mask reuse and the no-new-token rule; parts follow the delivered `*Mark`/`*Cover` identifier precedent (no registry entry).
- **Commit:** `feat(project-card): add decorative backdrop and trailing mark slots`.

### U4 — ArticleFeature description plus BlogGrid composition (A3, A9)

- **Surfaces:** `packages/ui/src/molecules/article-feature/{types.ts,useArticleFeature.ts,ArticleFeature.tsx,ArticleFeature.test.tsx,ArticleFeature.stories.tsx}`, `packages/ui/src/organisms/blog-grid/{types.ts,useBlogGrid.ts,BlogGrid.test.tsx,BlogGrid.stories.tsx}`, `docs/components/article-feature/v0.2/spec.md`, `docs/components/blog-grid/v0.2/spec.md`.
- **Depends on:** G1, G4, **G5** (naming approval before the JSDoc/prop is finalized).
- **Size:** ~180 lines. **Risk:** low-medium — one new own prop on two union branches; `articleFeatureVariants` and the row recipes are shared with `BlogGrid`, which is requested in the same unit (one writer, no duplication).
- **Checks:** RED — DOM order heading → description → action label; blank description renders nothing; both branches (`href` and `asChild`) accept it; still one tab stop; description text joins the accessible name and `aria-label` still overrides. PRESERVE — cards without `description` unchanged; `eyebrow`/`detail`/cover/action behaviour unchanged. Visual: long description wraps at 390 px with no horizontal scroll and keeps the action label aligned.
- **Docs/registry:** the two specs record the removed "no body copy" non-goal and the documented `ListItemContent` row composition; registry: `content-description` proposed with evidence and component types, after G5, register the approved concept/usages and regenerate docs; `pnpm props:check` and `pnpm test:props` must pass on the changed public types.
- **Commit:** `feat(article-feature): add optional description and document described blog rows`.

### U5 — TopBar underline indicator (A5)

- **Surfaces:** `packages/ui/src/organisms/top-bar/{types.ts,TopBar.test.tsx,TopBar.stories.tsx}`, `docs/components/top-bar/v0.2/spec.md`.
- **Depends on:** G1, G4.
- **Size:** ~110 lines. **Risk:** low — `topBarLinkVariants` has a single consumer; `molecules/tabs/*` is not touched.
- **Checks:** RED — exactly one anchor carries `aria-[current=page]` indicator utilities; `min-h-14` present; no `role="tab"`, `aria-selected`, roving tabindex or arrow-key handler. PRESERVE — hover ink transition, focus ring, `data-state`, `items`/`onNavigate`, 900 px container behaviour. Visual: computed indicator height 1.6 px and brand ink on the current page; target ≥44 px at 390/1280 px; no text-decoration underline on the current link.
- **Docs/registry:** spec records the reused Tabs values, the dropped `underline` cue and the "visual parity, not dimensional parity" decision; no registry entry.
- **Commit:** `feat(top-bar): paint current page with the tabs underline indicator`.

### U6 — Footer rhythm and exported heading recipe (A6)

- **Surfaces:** `packages/ui/src/organisms/footer/{types.ts,useFooter.ts,index.ts,Footer.test.tsx,Footer.stories.tsx}`, `docs/components/footer/v0.2/spec.md`.
- **Depends on:** G1, G4.
- **Size:** ~140 lines. **Risk:** low-medium — public barrel gains one existing recipe export (additive), so run the single base/current differential on `packages/ui/src/index.ts` visible exports.
- **Checks:** RED — `footerHeadingVariants` resolves through the public barrel and the story's group headings use it; legal row uses the new spacing recipe. PRESERVE — nav link targets ≥44 px, brand/legal/social structure, frozen v0.1 behaviour. Visual: 859/860/861 px and 390/1280 px keep the approved columns with `gap-x-10 gap-y-8`; long legal text wraps without overlap.
- **Docs/registry:** spec documents the consumer obligations (heading recipe, tagline step); no new prop, no registry entry.
- **Commit:** `feat(footer): normalise group rhythm and export the heading recipe`.

### U7 — SectionNav story clearance (A7)

- **Surfaces:** `packages/ui/src/organisms/section-nav/{SectionNav.stories.tsx,SectionNav.test.tsx}`, `docs/components/section-nav/v0.2/spec.md`.
- **Depends on:** G1, G4.
- **Size:** ~90 lines. **Risk:** low — story-only; the frozen component contract is untouched.
- **Checks:** no RED is meaningful for a story canvas: exception stated, structural assertions only (meta uses `layout: 'fullscreen'`, wrapper carries the reserved minimum height). PRESERVE — `SectionNav.test.tsx` behaviour green and unchanged. Visual: pill, next control and open index fully visible at default and narrow widths in the default and `Hover` stories.
- **Docs/registry:** spec records story-only clearance and "host owns clearance"; no prop, no registry work.
- **Commit:** `docs(section-nav): give the stories a canvas that stops clipping the pill`.

### U8 — NotesBoard rhythm (A10)

- **Surfaces:** `packages/ui/src/organisms/notes-board/{types.ts,NotesBoard.test.tsx,NotesBoard.stories.tsx}`, `docs/components/notes-board/v0.2/spec.md`.
- **Depends on:** G1, G4.
- **Size:** ~90 lines. **Risk:** low — spacing recipes only; `sticky` and the 1080 px grant untouched.
- **Checks:** RED — root and side recipes resolve to `items-start` / `gap-4`; PRESERVE — sticky offset `calc(var(--nav-height)+var(--space-10))` and the single-column collapse. Visual: side top aligns with the first row above 1080 px; stacked boards keep ≥51.2 px separation; 1079/1080/1081 px collapse intact.
- **Docs/registry:** spec documents the recommended `editorial-divided` row and host-owned board separation; no registry entry.
- **Commit:** `feat(notes-board): align the side with the first row`.

### U9 — WebSection neutral organism (A11)

- **Surfaces:** `packages/ui/src/organisms/web-section/{types.ts,useWebSection.ts,WebSection.tsx,WebSection.test.tsx,WebSection.stories.tsx,index.ts}`, `packages/ui/src/index.ts` (export block only), `docs/components/web-section/v0.2/spec.md`.
- **Depends on:** G1, G4, G5.
- **Size:** ~300 lines. **Risk:** medium — new public API and a new name in a crowded namespace; `package-exports`/`consumption` gates apply. No `SectionShell`, scene-organism or effects file changes. New slot declarations still require G5 exact naming mappings, not assumed approval.
- **Checks:** RED — slots render in the documented DOM order and inject no copy; no automatic role, tab stop or accessible name; `id` is forwarded only for the host's `aria-labelledby`. PRESERVE — the four scene organisms' exports and stories unchanged; no `@egdev/effects` import in the module graph. Visual: composition inside `SectionShell` keeps register paint parity; interactive media/actions render and stay keyboard reachable at 390/860/1280 px.
- **Docs/registry:** spec records slot content rules (interactive allowed, no decorative-only media constraint), the rejected `SectionShell` widening and the coexistence boundary; look up and map every own slot/native/heading declaration; register approved new concepts/usages and refresh their receipts only after separate naming approval.
- **Commit:** `feat(web-section): add a neutral section organism with slots`.

### U10 — WebTemplate structural page (A12)

- **Surfaces:** `packages/ui/src/templates/web-template/{types.ts,useWebTemplate.ts,WebTemplate.tsx,WebTemplate.test.tsx,WebTemplate.stories.tsx,index.ts}`, `packages/ui/src/index.ts` (export block only), `docs/components/web-template/v0.2/spec.md`.
- **Depends on:** G1, G4, G5; U9 not required but reviewed together for slot parity.
- **Size:** ~280 lines. **Risk:** bounded additive work — landmark contract plus read-only reuse of `appShellVariants.skip`/`.skipLink` and `AppShellMessages`. `templates/app-shell/*` is read-only here, so run one differential proving `AppShell` output and public exports are unchanged.
- **Checks:** RED — exactly one `<main id tabIndex={-1}>` in the rendered tree; document order `topBar` → `content` → `footer`; skip link targets the template main and focuses it; normal-flow header host reserves nav-height only when topBar exists; normal-flow content grows naturally; main has no automatic clearance padding; absent slots render no wrapper. PRESERVE — `AppShell.test.tsx` green; no canvas, listener, director or zone prop exists; no `@egdev/effects` import. Visual: 390/1280 px with `topBar` absent renders flush content (no phantom nav padding).
- **Docs/registry:** spec records explicit landmark ownership (consumer supplies no `main`), the skip-link reuse instead of a copy, and the target architecture in which website choreography is not part of the template contract; map every slot/message declaration to exact approved conventions, append approved usages/receipts and regenerate naming documentation.
- **Commit:** `feat(web-template): add a structural page template with explicit landmarks`.

### U11 — AmbientBackground independent combinations, spec-first track (A13)

- **Surfaces:** `docs/components/ambient-background/v0.2/spec.md` only. **No source file** is touched in this unit; the earlier owner request requires a spec before implementation.
- **Depends on:** G1 to draft the independent spec. G7 then gates its separate plan and source implementation; it is not a circular prerequisite for writing the spec.
- **Size:** ~150 doc lines, 0 code. **Risk:** low now; the later implementation needs its own plan, capture references, bounded performance checks and risk assessment; do not classify it high merely because it adds optional combinations.
- **Checks:** spec-level only — every axis, allowed value set, preset mapping that reproduces today's `base`/`read`/`live`, motion/`prefers-reduced-motion`/`forced-colors` contract, density bounds, host-canvas ownership and the `profile` compatibility story. No implementation RED exists yet; do not fabricate one.
- **Docs/registry:** this unit *is* documentation. Any new own prop names are looked up in `skills/_shared/prop-naming.json` and recorded as proposals in the spec, never written to the registry here. `https://www.camzuna.com/anim` is recorded as an un-inspected owner reference: no observation, technique or value may be attributed to it until an authorized capture exists under `docs/design/README.md`.
- **Explicit non-conflation:** this spec is independent of the `HomeTemplate` → website migration; neither authorizes the other.
- **Commit:** `docs(ambient-background): propose independent visual combinations`.

### U12 — Integration, stories and distributed-artifact readiness

- **Surfaces:** `packages/ui/src/index.ts` (only if U9/U10 left a barrel gap), the touched units' story files for one cross-component story each, `packages/ui/package.json` only if a new subpath is genuinely required (default: none), `docs/components/web-catalog/v0.2/implementation-plan.md` (status log only during implementation).
- **Depends on:** U1–U10 merged.
- **Size:** ~130 lines. **Risk:** medium — public barrel and dist surface. Evaluate actual shared-code impact rather than treating barrel additions as a regression by definition; run packed-consumption checks and any applicable shared-behaviour differential.
- **Checks:** `pnpm --filter @egdev/ui build` emits `dist/index.js`, `dist/index.d.ts` and `dist/styles.css` containing every new utility; `pnpm test:package-exports` and `pnpm test:package-consumption` pass for React 18.3 and 19.3 packed installs; focused suites green; then the unchanged pre-push `NODE_OPTIONS=--max-old-space-size=1024 pnpm test`, `pnpm typecheck`, `pnpm lint`.
- **Docs/registry:** update `scripts/catalog_data.py` for the approved new component rows and regenerate `docs/CATALOGO.md` through `scripts/build_catalog.py`. Record actual story/doc completeness and runtime readiness; never hand-edit generated artifacts.
- **Commit:** `chore(web-catalog): integrate v0.2 surfaces and validate packed output`.

## 3. Risk classification

`Risk3` — actual shared-contract regression or unrequested behaviour/removal — applies to none of U1–U12 as scoped: every changed recipe has either a single consumer or a requested co-consumer, and no export is removed.

It does apply, and only there, to the future **migration unit** (M1 is a planned handoff, not admitted execution): removing or relocating `HomeTemplate`, and any deprecation/removal of `Hero`/`ChapterBreak`/`LabStage`/`Closing`. That unit needs its own approved spec, plan, risk tier and independent verifier.

Independent verifier (only for a named Task Size high-risk item, surfaced through assess escalation): prepare dependencies and dist before the one admitted run, then provide executable permitted commands in the role's actual isolated environment. Tests/typecheck may run there only within its allowed boundary; builds/packing may write artifacts and are not called read-only. The parent performs applicable build/package checks separately. If the prepared environment lacks dependencies or a build, the verifier reports **Not evaluated** — it must not retry an unavailable run, install anything, or record a PASS it did not observe.

## 4. Delivery forecast and shape

| Slice | Units | Est. lines |
| --- | --- | --- |
| Visual fixes on delivered components | U1–U8 | ~1,110 |
| New surfaces | U9–U10 | ~580 |
| Spec-only workstream | U11 | ~150 (docs) |
| Integration and dist readiness | U12 | ~130 |
| **Total** | | **≈1,970** |

This is far above 400 lines. The default is **ask-on-risk**: before the first oversized implementation commit, the transaction controller asks once for a single delivery shape (single PR vs chained review slices) and records the answer. This plan does not ask now, and inherits no single-PR authorization from any earlier feature.

Suggested chaining if slices are chosen: (1) U1–U2 card geometry, (2) U3–U5 additive card/nav parts, (3) U6–U8 rhythm and story clearance, (4) U9–U10 new surfaces, (5) U12 integration. U11 is documentation and can ship independently.

## 5. Acceptance protocol per unit

1. **Reproduce** the owner example first in a real browser under equivalent conditions; record the observation (element, computed value, viewport, theme).
2. **RED** for deterministic behaviour: DOM order, conditional rendering, accessible name, tab stops, presence markers, warning paths, resolved recipe classes. Visual-only deltas (A6/A7/A10 spacing, A4 measured heights) take the documented exception and are verified by rendered computed style, never by an invented failing test.
3. **GREEN**, then one **PRESERVE** test per touched existing behaviour.
4. **Packed own-element evidence:** computed style of the element that owns the declaration plus the emitted Tailwind rule in `dist/styles.css`; a passing test summary is not visual evidence.
5. **Metadata and naming:** docgen extraction for every new own prop (`@control`/`@controlReason`), exact approved mappings/receipts for description, slots and messages; `pnpm props:check` and `pnpm test:props` after the approved registry updates.
6. **React 18/19:** packed consumption gates for any new public API (U4's prop, U9, U10).
7. **Differential** only where §1 requires it (U6, U10, U12 barrels) — one run, base vs change, comparing exit code, stdout and stderr of the sibling surface.
8. **Proportionate evidence:** use the approved references and real browser checks required by each component spec; no decorative test harness or fabricated visual approval. Record skipped/unavailable checks rather than substituting static assertions for appearance.

## 6. Legacy → neutral target architecture (planning only)

Target: `WebTemplate` owns page structure and the single `main`; `WebSection` supplies neutral section anatomy inside `SectionShell`; the website owns choreography, zones, anchors and effect layers.

Sequenced, and each step separately authorized:

1. v0.2 new surfaces land additively; `HomeTemplate` and the four scene organisms stay exported and untouched.
2. Website repository (separate authorization) adopts `WebTemplate`/`WebSection` and hosts its own choreography; this plan writes nothing there and promises no migration date.
3. Only after every consumer is migrated: a dedicated spec and plan decide deprecation, relocation or removal of `HomeTemplate` and any scene organism. Removal is a breaking change with its own risk tier; it is **not** promised here and permanent legacy coexistence is not the target.

### M1 — website adoption and breaking-removal gate (planned handoff, not admitted execution)

- **Depends on:** U9/U10 and explicit authorization naming the website repository and permitted edit scope; then a proven inventory of all consumers and preserved task/unrelated edits. No website path or credential is inferred.
- **Deliverable:** map old scenes to neutral slot recipes; move the website-specific director/zone configuration into website ownership, reusing public generic effects only where their API supports it. If it currently needs private engine imports, stop and propose a narrowly approved public capability or website-owned implementation; never import private dist internals.
- **Proof:** equivalent content/scroll/anchor/reduced-motion/fallback/browser checks on an authorized website environment, with exact observable traces and preserved legacy refs/focus/SSR behaviour where applicable.
- **Removal:** only after adoption and explicit breaking-change approval, remove/deprecate named DS exports/stories/docs, update package-contract/naming/catalog records, run shared-consumer differential and a named Risk:item3 independent verifier. No blanket source restore, deletion, or unbounded export cleanup.
- **Size/delivery:** unknown until consumer/engine boundary discovery; deliberately excluded from the numeric 1,970-line implementation estimate. Record the estimate before execution rather than pretending this migration is cost-free or already implemented.

## 7. Out of scope for this plan

Token values, dependencies, Radix packages, unapproved registry entries, breakpoint grants,  commits/branches/push, Storybook server runs, website-repository writes, `HomeTemplate`/scene removal, and any `AmbientBackground` implementation.
