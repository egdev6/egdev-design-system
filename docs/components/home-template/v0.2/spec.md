# Component contract — HomeTemplate

- **Version / status:** 0.2 — **Proposed**. An amendment to the effective HomeTemplate contract: the [v0.1 spec](../v0.1/spec.md) (payload `622eacf3cccb774690b6c247dcaf6e31a8feb4aa858376b00fd274438dc8eb84`) as qualified by the route-A [bounded amendment](../v0.1/bounded-amendment.md) (A1–A3), the [owner decisions](../v0.1/owner-approval.md) and the [plan approval](../v0.1/plan-approval.md). Not approved and not implementation-ready: this snapshot needs the owner's approval, and its implementation plan needs a separate one.
- **Approval / recovery:** Pending for this snapshot. Recoverable prior decision, for cataloging only: the owner's answer on 2026-11-26, verbatim "Aprobar todas (Recomendado)" (`odd/tasks/round-5-consumer-requests.md` L3), which approves "#566: `@classNameAllows` on HomeTemplateAnchor"; the explorers' draft is kept in `odd/tasks/round-5-cataloging.md` (§#566). That answer approves neither this spec, nor the property list, nor a plan, nor any source, registry or CLI edit. Agreed spec location: this file.
- **Current situation / pending decisions:** Existing component, one public part amended. The change is documentation and published metadata only, and nothing is implemented. Verified in this working tree by reading source and data files (no test, build or CLI command was run): the sources, tests, stories, README, artifact generator and DS046 guard cited below. Pending: OQ-1 to OQ-3 (last section), the implementation plan and its approval, and VIS-01 (no capture exists, so visual conformity is **Not evaluated**). One premise of the cataloging draft does not hold for today's CLI (OQ-1): DS046 collects `className` owners only from `@egdev/ui` imports and ignores `classNameAllows` on other packages, so the tag publishes the contract but changes no `egdev-ds doctor` outcome for this `@egdev/effects` part until the guard is extended. The approved shape (tag only, no new prop) is unaffected.
- **Snapshot identity:** `version: 0.2`; `contentSHA256: ebff110451fdc76bac14ed07f52ebe55f42d5a6c3bc7a66d2db5539467be25c8`; `visualHashes: VIS-01 → Pending (no capture)`; `approvalReference: Pending`; `canonicalIssue: Pending` (HomeTemplate v0.1 recorded Pending; consumer request [#566](https://github.com/egdev6/egdev-design-system/issues/566) originates this amendment but is not a component issue; the parent chooses the canonical issue at handoff, and no GitHub action is taken here); `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from the exact whole heading line `## 1. Purpose and scope`, anchored at line start, through EOF, with LF line endings and the final newline included. All tracking metadata above that heading is excluded so the digest cannot depend on itself. A digest is not approval.

## 1. Purpose and scope

- **Need / non-goals:** Consumer request #566 (egdev-website, seen while adopting HomeTemplate in egdev6/egdev-website#47; consumer issue egdev6/egdev-website#45): the 3D isotipo anchor must fill the scene media slot it sits in (Hero, ChapterBreak, LabStage, Closing). Today the anchor is a block whose height comes from its fallback content. The consumer reports that the 638:612 fallback leaves it about 4% shorter than the square slot (consumer-reported, not measured here) and that `HomeTemplateAnchor` publishes no `classNameAllows`, so its documented `className` geometry cannot be used under the DS046 contract. The need is to publish, machine-readably, the CSS properties a class on `HomeTemplateAnchor` may set, so a consumer can size the measured box. **Non-goals:** no new prop (no `fill`, `size` or `ratio`); no default sizing (the anchor stays a content-sized block, with no built-in `w-full`, `h-full` or aspect ratio); no change to the fallback wrapper, the director, measurement, engines, markers, tokens, dependencies or stylesheets; no change to the root `HomeTemplate` `className` contract; no `@egdev/cli` change (OQ-1); no new visual treatment.
- **Exact v0.2 delta:**
  1. The v0.1 §2 promise "no geometry props — the box is sized entirely by consumer layout utilities and the template only measures it" stays, and gains a machine-readable form: `HomeTemplateAnchorProps` publishes one `@classNameAllows` tag (§3).
  2. The v0.1 §6 class-composition bullet gains the anchor's supported surface: box geometry (§3 table) beside the shared base placement list, with the invariants `relative block` still winning.
  3. Nothing else changes: A1–A3, the director, the engines, the fail-open rules, the public API, markers, tokens and the six-file layout all stay as approved.
- **Cataloging decision / alternatives:** **Reuse, with a contract tag** — owner-approved (L3, "Aprobar todas (Recomendado)"). The reuse → variant → compose → extract → new order was walked on inspected code; the tag is the only missing piece.

| Option | Inspected | Result |
| --- | --- | --- |
| Reuse | `packages/effects/src/home-template/useHomeTemplate.ts:734` (`cn(className, anchorVariants())`); `packages/effects/README.md:54,58`; v0.1 spec `:28` ("no geometry props — … sized entirely by consumer layout utilities") | **Chosen.** The classes already reach the measured element and geometry is already the documented use. What is missing is the machine-readable tag on `HomeTemplateAnchorProps` (`types.ts:45-51`). |
| Variant (a `fill`, `size` or `ratio` prop) | Registry `host-fill` (`skills/_shared/prop-naming.json:8742`), `aspect-ratio` (`:3896`), `preset-dimensions` (`:747`), `tab-list-full-width` (`:8520`); v0.1 spec `:28` | Rejected. `host-fill` means a definite-height host with an inner scroll region (Panel, Tabs). `ratio` is the proportion of a reserved region (AspectRatio, PhotoFrame, PreviewFrame, SelectTile). `size` is a preset ladder. `fullWidth` is Tabs-specific. v0.1 forbids geometry props and the need requires no new behavior. |
| Compose (app wrapper) | The anchor is `block` (`types.ts:64`); the scene media frames are `aspect-square` boxes (`packages/ui/src/organisms/hero/types.ts:70-72`, `closing/types.ts:68`, `lab-stage/types.ts:58`, `chapter-break/types.ts:54`); base placement list (`docs/distribution/egdev-ds-cli.md:512`) | Not the system answer. An app-owned flex or grid wrapper with base-permitted `self-stretch` or `flex-1` on the anchor could stretch it, but it adds a node per scene, depends on a definite-height wrapper and cannot express `aspect-ratio`. The measured node is the anchor itself, so its own box must carry the size. |
| Extract / new | — | Not applicable: nothing to extract and no new component. |

- **Evidence / level and package:** HomeTemplate part in `@egdev/effects` (template level, unchanged). **Verified public availability:** `HomeTemplateAnchor` and `HomeTemplateAnchorProps` are exported (`packages/effects/src/index.ts:5-6`). `HomeTemplateAnchorProps` (`packages/effects/src/home-template/types.ts:45-51`) declares only `zone` plus native `div` props minus `dangerouslySetInnerHTML`, `role` and `style`; unlike `HomeTemplateProps` (`:20-23`) it carries **no `className` prose and no tag**. The hook strips `style`, `role`, `dangerouslySetInnerHTML`, `ref` and `asChild` and merges `cn(className, anchorVariants())` (`useHomeTemplate.ts:715-737`; `cn` from `@egdev/ui`), where `anchorVariants` is `eg-home-template-anchor relative block` (`types.ts:64`). Geometry use is already shown in the README example and prose (`README.md:41,54,58`), the stories (`HomeTemplate.stories.tsx:29,39,84,97,137,145`) and a merge test (`HomeTemplate.test.tsx:91,113-114`: `w-24 h-24` survive, `absolute inline` are dropped). The artifact generator reads one tag from `<Name>Props` for any package (`scripts/build-artifact.mjs:95-130`) and the artifact already lists the five `@egdev/effects` components, so `HomeTemplateAnchor` gets `components[].classNameAllows` once tagged (its current entry in `packages/system/design-system.json` has none).
- **Guard scope (premise correction, source-read; the CLI was not run):** the cataloging draft says DS046 rejects any sizing class on the anchor. By the code it does not today: DS046 collects `className` owners only from named, aliased or namespace `@egdev/ui` imports (`packages/cli/src/appearance-guard.mjs:524`; `docs/distribution/egdev-ds-cli.md:512`), `readClassNameAllows` keeps an entry only when `package === '@egdev/ui'` (`packages/cli/src/doctor.mjs:90`), and a test pins that an `@egdev/effects` entry is ignored (`packages/cli/tests/ds046.test.mjs:776`). DS046 also inspects app CSS rules, not Tailwind utility classes (`egdev-ds-cli.md:512`). The consumer's blocker is therefore the documented contract, not an enforced check: the agent rules the CLI scaffolds say "Classes passed to DS components may set only CSS properties in their `className` contract (placement plus the component's published `classNameAllows`)" (`packages/cli/src/init.mjs:73`). See OQ-1.

## 2. Anatomy and composition

| Part | Responsibility | Native element / Radix primitive | Allowed content |
| --- | --- | --- | --- |
| Root, layers, content | Unchanged (v0.1 §2, A1–A3) | `div` host `eg-home-template`; `canvas` and `div` layers; content `div` | Unchanged |
| `HomeTemplateAnchor` (public part) | Measured box inside a 3D scene; **its `className` geometry becomes a published contract** | Outer `div` with the stable marker `eg-home-template-anchor`; no Radix | Consumer decorative, non-interactive fallback (unchanged) |
| Fallback wrapper (internal) | Holds the consumer fallback; becomes invisible after the first eligible 3D paint | Inner `div`; carries `data-state="painted"` (and so `opacity-0`) after the first eligible paint; no marker, no `className` | Unchanged |

- **Radix / composition:** None, as in v0.1: the part has no interaction semantics. No `asChild`, no ref (unchanged).
- **Public markers:** Unchanged: `eg-home-template` and `eg-home-template-anchor`. No marker is added, and the anchor marker stays a presence marker, not a styling-selector API (v0.1 §2).

## 3. Public API

**Prop conventions (registry lookup):** searched the [canonical registry](../../../../skills/_shared/prop-naming.json) (185 entries) and the [generated view](../../../prop-naming.md) by meaning and by the names `fill`, `size`, `ratio`, `width`, `height`, `dimension`, `aspect`, `geometry`, `fullWidth`, `className` and `zone`; the matching entries have no aliases.

| Concept | Result |
| --- | --- |
| Sizing the anchor to its slot (a `fill`, `size` or `ratio` prop) | **Not proposed.** Considered and not applied: `host-fill` / `fill` (approved; Panel, Tabs), `aspect-ratio` / `ratio` (approved; AspectRatio, PhotoFrame, PreviewFrame, SelectTile), `preset-dimensions` / `size` (approved) and `tab-list-full-width` / `fullWidth` (approved; Tabs). None means "size a measured box", and v0.1 forbids geometry props. |
| Binding the anchor to its zone → `zone` | Unchanged: approved `anchor-zone-binding` (registry `:84`; usage `HomeTemplateAnchorProps.zone`). |
| HomeTemplate's own props | Unchanged: approved `choreography-zone-table` and `zone-change`. |
| `className` | Inherited native attribute: no own entry (`component-contract.md`: "inherited native attributes and `className` need no own entry unless an explicit semantic policy is proposed"). `@classNameAllows` is a JSDoc tag on the props type, not a prop. |

No new or changed own prop, no new convention proposal and no exception request. Reviewed source: `packages/effects/src/home-template/types.ts`, `HomeTemplateAnchorProps`, whole-file `sha256:ebd47eb475b4866b2ec45519badd62df64a59c2a5b751f6beefde4efd2b94983` (computed with `sha256sum`), equal to the revision recorded for the three HomeTemplate registry usages (`choreography-zone-table`, `anchor-zone-binding`, `zone-change`). The JSDoc edit changes that hash, so the plan must review and refresh those three usage revisions (`pnpm props:docs`, then `pnpm props:check` and `pnpm test:props`); this spec makes no registry edit. Convention approval stays independent of spec approval.

**Proposed source contract (JSDoc on `HomeTemplateAnchorProps` only; no type or code change; the exact list is OQ-2):**

```ts
/**
 * Measured 3D anchor. className sizes the box: width, height, their constraints and
 * aspect-ratio, beside the shared outer placement. Appearance overrides are unsupported;
 * the anchor invariants (relative, block) take precedence in cn().
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size height min-height max-height block-size min-block-size max-block-size aspect-ratio
 */
export type HomeTemplateAnchorProps = Omit<…> & { … };
```

| Axis | Proposed published properties |
| --- | --- |
| Width | `width`, `min-width`, `max-width`, `inline-size`, `min-inline-size`, `max-inline-size` |
| Height | `height`, `min-height`, `max-height`, `block-size`, `min-block-size`, `max-block-size` |
| Proportion | `aspect-ratio` |

These are literal lowercase CSS names beyond DS046's base list. Already allowed by the base list and therefore not tagged: custom properties, margins, self-alignment, flex item properties, `order`, grid item placement, and `min-width` / `min-height` at zero only (`component-contract.md:109`); tagging `min-width` and `min-height` additionally permits nonzero minimums. Not listed on purpose: `position`, `inset` and `z-index`, and `display` (the invariants own `relative block`); `padding`, `border`, `overflow` and `transform` (appearance, outside this need). No conditional or value-limited permission is flattened: any value of a listed property is allowed, and an unusable result (zero or non-finite area) fails open as in v0.1. All thirteen names exist in the installed `csstype` 3.2.3 typings that the generator validates against, and all match the CLI reader's `^[a-z][a-z0-9-]*$` pattern (`packages/cli/src/doctor.mjs:85`), which discards the whole map on any other name.

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `zone` | `string` | yes | — | Unchanged (approved `anchor-zone-binding`). |
| `className` (inherited) | `string` | no | none | Box geometry per the table above plus the shared base placement list; appearance overrides unsupported. Not an own convention. |
| `children` (inherited) | `ReactNode` | no | none | Unchanged: the decorative, non-interactive fallback. |

- **Native props / refs:** Unchanged: native `div` attributes are forwarded except `dangerouslySetInnerHTML`, `role` and `style`; no ref and no `asChild` (the hook strips both).
- **Controlled / uncontrolled:** Not applicable.
- **Compatibility:** Documentation and published metadata only. No runtime, export, marker, prop, default or consumer behavior changes, and React 18 and 19 behavior is not touched. The `@egdev/system` artifact gains `components[HomeTemplateAnchor].classNameAllows`, an additive field (`schemaVersion` stays `1.0.0`, `docs/distribution/design-system-artifact.md`). Consumers that already pass geometry classes see no change: by the source-read in §1, DS046 does not inspect `@egdev/effects` imports today.

## 4. Behavior

Everything below already holds in the source; v0.2 promises it, publishes it and pins it with checks, and adds no behavior.

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| The anchor renders with geometry classes (for example `aspect-square w-full`, `size-full`, `max-h-full`) | The classes reach the outer anchor element together with the invariants `eg-home-template-anchor relative block`; the director measures that element's border box (`getBoundingClientRect`) | None |
| A class names position or display (`absolute`, `inline`, `hidden`, `flex`) | Dropped by the invariants: `cn(className, anchorVariants())` keeps the last of two conflicting classes. These properties are not in the published list | None |
| The box changes size (breakpoint class, container resize) | A `ResizeObserver` on the anchor triggers a re-evaluation and the next frame reads the new rect, so the 3D fit and confinement follow the box (`useHomeTemplate.ts:378-388`; `homeTravel.ts` `computeTravel`; `isotipoScene.ts:376-393,440-448,530-551`) | None |
| A class yields a zero or non-finite area (`h-0`, `w-0`, collapsed container) | Existing fail-open (v0.1 §2, A1): the anchor counts as absent for the 3D layer and the consumer fallback stays visible; no new warning, prop or error state | None |
| The fallback is larger or smaller than the box | The fallback wrapper keeps its natural size; the 3D uses the anchor's box, not the fallback's; after the first eligible paint the wrapper carries `data-state="painted"` and `opacity-0` | None |

- **States / representation:** Unchanged. `data-state="painted"` lives on the internal fallback wrapper and drives `data-[state=painted]:opacity-0` through a data variant; no state is mirrored into classes and no new `data-*` attribute is added.
- **Limits / consumer responsibilities:** The template never clamps, validates or caps the consumer's sizing. Percentage heights (`h-full`, `size-full`) need a containing block with a definite height; `aspect-square w-full` does not. The consumer owns the slot, its overflow, and the sizing of its own fallback element: the fallback wrapper is auto-height (`types.ts:65`), so a `h-full` on the consumer's fallback child cannot fill a sized anchor (`aspect-square w-full` on that child can). The fallback matters only before the first eligible 3D paint and without WebGL. The consumer keeps the fallback within the box.

## 5. Accessibility

- **Accessible name / roles / relationships:** Not applicable as a control; unchanged. The anchor is a plain `div` with no role (`role` is stripped) and no name; its fallback is decorative; geometry classes cannot change semantics.
- **Keyboard / focus:** None added. The anchor is not focusable, and sizing introduces no focus hazard because the layers stay `aria-hidden` and `pointer-events: none` (v0.1 §5).
- **Announcements / other conditions:** None. Consumers prefer relative sizing so the box follows zoom and reflow (fixed pixel boxes can clip at high zoom). No touch target or colour-only cue is introduced. The component guarantees passive, hidden effect layers; the consumer guarantees the slot and the fallback.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| Anchor `className` geometry | The properties published in §3 | None: a content-sized block, as in v0.1 | The invariants `relative block` win; appearance overrides are unsupported |
| Existing axes (ambient profile, layer ownership, motion) | Unchanged | Unchanged | Unchanged |

- **Tokens / Material:** No token, Material recipe, surface or paint is added or changed; `anchorVariants` and `fallbackVariants` are unchanged. The system supplies no size tokens for the anchor and proposes none. Consumers prefer relative sizing (`aspect-square`, `w-full`, `size-full`) over fixed pixel values so the box follows its slot. **Token proposal: none.**
- **Dynamic geometry:** Not applicable. No new mechanism: the v0.1 compositor recipe (bounded numeric opacity custom properties on the two canvases) is untouched, the anchor's `style` stays unsupported, and there is no inline geometry and no interpolated class string.
- **Class composition / consumer layout:** Classes reach the outer anchor only, merged by `cn(className, anchorVariants())`, so the invariants `relative block` win and geometry classes have no invariant to conflict with. `twMerge` resolves recognized utility conflicts only (for example how `size-*` meets `w-*` and `h-*` is its decision); there is no universal last-class-wins promise, and arbitrary selectors or layer precedence are not covered. The inner fallback wrapper has no `className` surface.
- **Files / pending proposals:** When separately planned and approved: `packages/effects/src/home-template/types.ts` (the JSDoc and one tag on `HomeTemplateAnchorProps` only, no code); `HomeTemplate.test.tsx` (new cases); `HomeTemplate.stories.tsx` (one story showing the fill pattern in a square frame); `packages/effects/README.md` (the sentence at `:58`, in English, naming the supported properties); `skills/_shared/prop-naming.json` (the three usage revisions, then `pnpm props:docs`); `scripts/design-system-artifact.test.mjs` (one assertion); the regenerated `packages/system/design-system.json` (`pnpm artifact --write`; `packages/system/system.md` is expected unchanged because it does not render the field, `docs/distribution/system-md.md:22`, confirmed by `pnpm system:check`); and changelog entries under the existing sections of the unpacked release set (`@egdev/effects` 0.2.12 and `@egdev/system` 0.13.0), with no version moving and `@egdev/cli` and `@egdev/tokens` untouched (S2 in `odd/tasks/round-5-consumer-requests.md`). `useHomeTemplate.ts`, `HomeTemplateAnchor.tsx` and `index.ts` stay unchanged. **No stylesheet**, no extra internal module, no token or dependency change.

### Expected-design visual reference

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | **Pending — no image.** A square scene media frame in which the anchor box coincides with the frame, with the 3D isotipo filling it | Principal scenario: `aspect-square w-full` on the anchor inside a `w-full aspect-square` frame; contrast: the unsized anchor with the 638:612 fallback | Source and commit **Pending**: an agreed Storybook story or the consumer adoption (egdev6/egdev-website#47) | Proposed / Pending; no approval |

- **Conditions / provenance per VIS ID:** Viewport, device scale, browser and version, theme, loaded fonts, motion and transparency, crop, capture date and tool, and SHA-256 are all **Pending**. A capture needs separate authorization (source, read-only hosting, Playwright MCP, and any asset publication); no image is invented, and v0.1 VIS-01…VIS-10 are captures of the original Pulso page that neither cover nor approve anchor fill.
- **Intent / acceptance / pending evidence:** The anchor box equals the slot box, with no gap and no Material, paint or token change; related criterion: HT2-04. Missing: the source, the capture, the conditions and the approval. Visual conformity is **Not evaluated**, and a capture would not replace the behavior or accessibility checks.

## 7. Acceptance criteria

All checks are **planned**, not observed. Rows marked **guard** pin behavior that already exists, pass on their first run and claim no RED.

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| HT2-01 | `HomeTemplateAnchorProps` declares exactly one `@classNameAllows` tag with the list approved in OQ-2; the artifact publishes it sorted and unique as `components[HomeTemplateAnchor].classNameAllows`; no other entry or prop row changes and the tag text is not in any description | `scripts/design-system-artifact.test.mjs`: focused assertion on the real entry (RED before the tag exists); `pnpm artifact --check`; before/after diff of every other entry in scratch | Not applicable | Pending |
| HT2-02 | Geometry classes reach the anchor and the invariants still win: with `size-full aspect-square max-h-full absolute hidden` the anchor keeps the first three plus `eg-home-template-anchor relative block` and drops `absolute` and `hidden` | `HomeTemplate.test.tsx` DOM class assertions, extending the existing merge case (`:70-117`), which stays green unmodified (**guard**) | Fill story | Pending |
| HT2-03 | The measured box is the box the classes produce: a mocked anchor rect feeds the projection, and a resize notification on the anchor re-reads it | Existing `HomeTemplate.isotipo.test.tsx:271,301` stay green (**guard**) | Not applicable | Pending |
| HT2-04 | In real Chromium, an anchor with `aspect-square w-full` in a `w-full aspect-square` scene frame has a border box equal to the frame's (difference under 1 CSS px at the widths agreed in the plan), and the projection anchor equals that box; the unsized baseline is measured, not assumed | Scratch Chromium geometry probe comparing `getBoundingClientRect`; not committed; needs browser authorization | VIS-01 | Pending |
| HT2-05 | A zero or non-finite area from a class stays fail-open: fallback visible, no throw, no new warning, prop or error state | Existing `HomeTemplate.isotipo.test.tsx:271,527` stay green (**guard**) | Not applicable | Pending |
| HT2-06 | No new public surface: `zone` stays the only own prop; exports, markers, defaults and `...rest` forwarding are unchanged; docgen and Controls show no new row; `style`, `role` and `dangerouslySetInnerHTML` stay omitted | `pnpm typecheck`; existing docgen, Controls and package-exports suites; artifact diff showing no `props` change for either entry (**guard**) | Not applicable | Pending |
| HT2-07 | The three HomeTemplate registry usages carry the reviewed final whole-file revision of `types.ts`; no convention hash changes | `pnpm props:docs`, then `pnpm props:check` and `pnpm test:props` (fail by design on the stale revisions until refreshed) | Not applicable | Pending |
| HT2-08 | JSDoc, README and story JSDoc are in English and state the same property list and limits; none claims that `egdev-ds doctor` enforces or honors the tag for `@egdev/effects` unless OQ-1 is resolved with a CLI change | Review against the final list; docs diff | Not applicable | Pending |
| HT2-09 | `@egdev/cli`, `@egdev/tokens` and every package version are unchanged; DS046 behavior for `@egdev/effects` is unchanged and is recorded once as observed, not assumed | `git diff --stat` shows no `packages/cli/**` or `packages/tokens/**` change; read-only scratch fixture through `egdev-ds doctor`, needs command authorization; not an approval gate | Not applicable | Pending |

### Spec closure

- [ ] All seven blocks are complete or justified as Not applicable; no blocking promise decisions remain — OQ-1 to OQ-3 are open, each with a recommended answer, and none changes the shape of the proposed contract.
- [x] New or changed own props: none; the registry lookup, the unchanged entry IDs and the reviewed source evidence are recorded; no exception and no convention proposal.
- [x] Proposals, verified implementation (by reading), planned checks and observed results are distinct; every promise has an acceptance ID and a method.
- [ ] Visual IDs identify real image provenance, conditions and related criteria — VIS-01 is **Pending**; no capture is verification.
- [ ] Snapshot identity is recoverable and human approval identifies this version, digest, visual hashes and scope — approval is Pending, so the status remains Proposed.
- [ ] One canonical component issue is retained — Pending; this version would be an authorized comment on it, never a body edit or a new issue.

**Next step:** the owner resolves OQ-1 to OQ-3 and approves this exact snapshot (digest included); the implementation plan then awaits its own, separate approval. This spec authorizes no code, token, dependency, CLI, registry or artifact change, no capture and no GitHub action.

## Open questions

| ID | Question and evidence | Recommended answer |
| --- | --- | --- |
| OQ-1 | **Guard scope.** The tag is published in the artifact, but DS046 scans only `@egdev/ui` imports and ignores `classNameAllows` on other packages (`appearance-guard.mjs:524`, `doctor.mjs:90`, `ds046.test.mjs:776`), so it changes no `egdev-ds doctor` outcome for `HomeTemplateAnchor`. (a) Keep this spec tag-only and record a follow-up for `@egdev/cli` to scan `@egdev/effects` imports and read their allowances (a CLI change with its own spec, tests and version bump), or (b) include that CLI change in this round. | **(a).** The approved cataloging is tag-only. The gap pre-exists for every `@egdev/effects` component, and `cli` has not been bumped in the 0.11.0 set (S2), so (b) would move a coupled version. By source-read the consumer is blocked by the documented contract, not by an enforced check, and the tag is the prerequisite for any later guard support. |
| OQ-2 | **Exact property list.** The thirteen properties of §3 (all six width and all six height properties, plus `aspect-ratio`), or the minimal five `width height inline-size block-size aspect-ratio`. | **The thirteen.** Of the 44 existing tags under `packages/ui/src`, 43 list the six width properties (SelectTile adds `grid-template-columns`) and one lists `z-index`; the contract states "Width and width constraints map to all six physical/logical properties" (`component-contract.md:108`). The scene frames pair `aspect-square` with `max-w` caps (`hero/types.ts:70-72`), so consumers need the constraints and the logical forms too. Not listed on purpose: position, display, padding, border, overflow, transform. |
| OQ-3 | **Defaults and fallback fill.** Should the anchor default to filling (a built-in `w-full h-full` or aspect ratio), or should the fallback wrapper fill the anchor (`h-full`)? | **No: tag only.** A default would change every existing consumer's layout and contradict v0.1's "no geometry props — sized entirely by consumer layout utilities". The consumer sizes its own fallback element (for example `aspect-square w-full`), which matters only before the first eligible 3D paint and without WebGL. Revisit only if the fallback gap is reported as a defect. |
