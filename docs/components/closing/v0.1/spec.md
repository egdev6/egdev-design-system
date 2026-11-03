# Component contract — Closing

- **Version / status:** 0.1 — Proposed draft; not approved or implementation-ready.
- **Approval / recovery:** Catalog decision only approved in [owner approvals](../../web-catalog/v0.1/owner-approvals.md); exact spec and visuals await owner approval. Separate plan approval is required before code. Tracking: `odd/tasks/web-catalog.md`, E2, S3/S4 and L5/L41/L42.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: 061e4d125502dee93512f9ca392e0f06ecba5fcb0146536fc493b29be95d0b57`; `visualHashes: VIS-01 → 882bcb65cc01cfdb745ee3a43a2be052d8b12d9863490c06dbf27619eb926b4d; VIS-02 → 885339c658185f98865d20f2632352ba9d1a5731eb186c177e855d34bd074923`; `approvalReference: Pending`; `canonicalIssue: Pending`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of UTF-8 bytes from the complete line `## 1. Purpose and scope` through EOF, including final LF; metadata above excluded. Finalize before publication.

## 1. Purpose and scope

Closing is a reusable concluding scene organism in `@egdev/ui`: consumer-supplied copy, calls to action and decorative 3D/media, with no Pulso copy, destinations, social accounts, fetching, navigation interception, scroll listener, director, effect orchestration or page-level positioning. The owner approved slot-based scenes and this package/level, not this specific API or any recipe. The web consumer amendment permits generic view building blocks; About and Community are separate documented recipes, not exports.

**Decision and alternatives:** Text, Heading, Button, Link and Icon are publicly exported (`packages/ui/src/index.ts`); none alone coordinates this scene. A variant of any one would change its responsibility. Consumer composition is possible but repeats the scene layout; an organism with supplied content is the approved catalog direction. No existing exported Closing to extract was found. SectionShell is actually exported and can host it; it is a section frame, not this content composition. `Isotipo3D` is exported separately by `@egdev/effects/src/index.ts`; `@egdev/ui` must not import effects. SectionHeader composes headings but does not provide this CTA/media scene. No Radix interaction primitive is necessary for passive layout; supplied links/buttons retain their native or existing Slot behavior.

**Source:** owner-granted read-only `/home/egdev/proyectos/egdev-website/egdev-foundation/design-system/components/Closing/README.md` and `preview.html`; `packages/ui/src/styles/legacy/bundle.css:819–840`. Foundation's fixed Spanish copy, network links, maximum of three CTAs and scroll assembly are evidence, not approved defaults or UI choreography. Older availability statements in general documents predate the inspected exports; exports do not establish visual parity.

## 2. Anatomy and composition

| Part | Responsibility / proposed element |
| --- | --- |
| Root | Passive `div.eg-closing` inside a host SectionShell; no second section or landmark. Host owns section label, unique heading ID and `data-zone`. |
| Copy | Optional eyebrow using `Text variant="eyebrow"` with decorative diamond; native Heading with main phrase and optional trailing accent; optional lede paragraph. |
| CTA row | Consumer-supplied named Button-as-anchor, Link or button elements in supplied order; responsive wrap. No CTA is generated, no nested controls. |
| Media | Consumer-supplied decorative non-interactive 3D or SVG, in a square layout slot; no automatic effects import or brand fallback. |

Suggested host: a named `<SectionShell>` referencing the Closing heading; use its default wrap with Closing not adding another page gutter. The host owns any register and effects anchor. `Isotipo3D scene="outro"` can be supplied by the consumer and driven externally; its decorative posture and fallback are its own contract. A consumer can instead supply its own decorative SVG. Do not imply fallback occurs when the slot is absent. The mobile media-first visual order must not alter DOM reading order or keyboard order; media is decorative and non-focusable.

`eg-closing` is the stable public marker; avoid new `eg-closing__*` internal markers that collide with retained legacy CSS. Parts are structural, not public selectors. No interactive wrapper, Radix keyboard handling, automatic section landmark, built-in 3D or fixed ID.

## 3. Public API

All inputs and limits below are recommendations subject to OQs. No component implementation or registry usage exists yet.

| Input | Proposed type / default | Contract / naming lookup |
| --- | --- | --- |
| `title` | `string`, required | Non-empty main heading; approved `heading-title`. |
| `level` | `1 | 2 | 3 | 4 | 5 | 6`, required | Native heading rank chosen by host; approved `heading-level`. |
| `eyebrow` | `string`, optional; absent omits | Context before heading; approved `heading-eyebrow`. |
| `accent` | `string`, optional; absent omits | Trailing highlighted text, approved `trailing-text-accent`; use Heading's block accent and preserve spacing: Heading inserts no separator, so consumer supplies whitespace in `title` when needed for the accessible name. |
| `lede` | `string`, optional; absent omits | Introductory paragraph; approved `section-lede`. |
| `children` | `ReactNode`, required | Consumer-supplied CTA controls only, including one to three named, independent links/buttons; no default. React types cannot enforce descendants. Native composition, not an own naming convention. |
| `media` | `ReactNode`, optional; absent omits slot | Decorative, non-focusable consumer media, not interactive or sole source of meaning. New proposed `scene-media` / `media`, `approval: null`: a passive media/3D scene slot, not a thumbnail, effect scene selector or Radix `asChild`. |
| `id` | native `string`, optional | Forward to Heading so host can reference it from SectionShell's `aria-labelledby`; this is a proposed explicit heading-ID contract, not a root anchor. Host puts `data-zone` on SectionShell. |
| `className` | native `string`, optional | Root outer placement only; no arbitrary appearance override. |

Lookup consulted [registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md) by name, meaning and aliases. `actions` / `trailing-actions` is explicitly scoped to one or two actions, so it is not applied to the observed three; generic `children` does not mean `field-message-content`. `slot-composition` / `asChild` is element substitution, not media. `scene` / `effect-scene` selects an effect pose, not a node. Proposed `scene-media` needs separate convention approval, not automatic approval with this spec; no invented source revision or registry edit. Reviewed existing `HeadingProps` and `TextProps`, `packages/ui/src/primitives/text/types.ts`, SHA-256 `badce40976a01fb4c0079a1481c5ba2fcdf88c10dd2bee6556244991fdfd21c9`; `ButtonProps`, `packages/ui/src/atoms/button/types.ts`, SHA-256 `8c61498c24fe7f3da8f7393782910328e9f48cb5273b31dcd215f8bd9f58a0cb`. Existing effect inputs remain owned by Isotipo3D; no Closing `scene` or `progress`.

Recommend the same semantic names `eyebrow`, `title`, `accent`, `level`, `lede` and `media` for the sibling scene where responsibilities match, without asserting its independently drafted API. OQ-1 asks whether a common recipe is appropriate before any extraction. `children` and `media` are separate slots; no descendant parsing or cloning is promised.

Root accepts compatible native `div` attributes except `children`, `id`, `role`, `style`, `dangerouslySetInnerHTML` and conflicts; `id` is reserved for the heading as specified above. No ref or root `asChild` is promised. No controlled state or events: Not applicable. No existing public React API is changed; legacy styles and consumers remain intact. React 18/19 and packed-consumer behavior are future checks.

## 4. Behavior

| Condition | Proposed result |
| --- | --- |
| Wide viewport above candidate 860px | Copy then media in a 1.25fr / 1fr grid; CTA row wraps as space requires. |
| At or below candidate 860px | One column; decorative media visually above copy; CTA controls wrap without clipping. DOM remains copy then media. |
| Missing eyebrow, accent, lede or media | Omit the respective content/slot; no empty placeholder, invented copy or fallback. |
| Supplied CTA activation | Existing native link/button or composed control owns behavior; no interception or automatic external target. |
| Host changes media/effect inputs | Closing simply renders supplied node; no state, event, animation timing or choreography. |

Legacy specifies 860px inclusive, a wide square media area capped at 62vh and narrow at `min(34svh, 300px)`, title clamps 52–112px wide / 40–88px narrow, and a 40ch lede. These are source candidates, not approved token recipes or proven responsive behavior. Approve component-local threshold/geometry and compatible typography before plan; test at 859/860/861, zoom, long localizations and narrow embedding. The source's maximum three CTAs and one primary are proposed consumer obligations, not runtime validation; see OQ-3. No state, loading, empty message or automated motion.

## 5. Accessibility

Host labels the single surrounding SectionShell with the supplied unique heading ID, chooses the appropriate rank and retains meaningful document order. Copy and accent form one heading; accent is not hidden. The decorative diamond and media must not be focusable or carry sole meaning. Consumer media must be decorative and contain no focusable descendants; do not place an interactive Isotipo3D inside an `aria-hidden` container. Every CTA has a meaningful accessible name and native Tab/Shift+Tab and Enter/Space behavior appropriate to its element; no nested anchors/buttons. Icons are decorative. Consumer owns URL, target, safe rel and disclosure when opening a new tab; do not force external links into new tabs. Consumer-supplied controls must meet at least 44×44 CSS px touch targets, visible token focus and actual contrast. Delivered Button `md` has 48px minimum height but width, other child controls and their surrounding context still need measurement. No live announcements or new keyboard handling. Screen-reader, contrast and browser results are not yet observed.

## 6. Appearance

- **Material:** host SectionShell owns the section register and background, not Closing. The source has a red radial copy halo and SVG drop-shadow; neither is permission for handwritten gradients or shadows, nor for a flat replacement of a Material surface. Seek an existing approved token-backed recipe or explicit owner approval of a compliant scene glow and fallback (OQ-4); no new token/dependency is authorized. `show` already has its own SectionShell glow, so avoid duplicating it without review. Contrast depends on actual host. Respect reduced motion and reduced transparency wherever applicable; glow is never a focus indicator.
- **Typography and CTA:** delivered Heading supports `accent` and `accentBreak` with canvas/raised tone, but its approved variants do not prove the exact Foundation clamp. Text eyebrow already draws the diamond. Button `iconPosition="start"` and Icon can represent the reference; `Button asChild` uses one compatible anchor and retains button paint, while Link is a separate text-navigation option. The source's primary/secondary paint remains subject to actual Material and contrast checks. Consumer decides CTA names and icons.
- **Geometry:** candidate square media geometry and local ≤860px need explicit approval and compiler proof; never assume a default Tailwind breakpoint exists. Do not use `aspect-video`: the tokens theme did not emit it in LiveBand; prove an appropriate explicit ratio utility instead. Do not interpolate dynamic classes or use inline appearance/geometry. Token-backed CVA and `cn()` per supported part; `className` placement conflicts merge last only where recognized, not a universal CSS cascade promise.
- **Collision inventory:** `bundle.css:820–821` applies root positioning, isolation, width, font/color and a painted `::before` halo; `822–824` grid width/gutters/columns/gap; `826–831` title type, margins and accent descendant; `832–835` lede, wrapping CTAs, media ratio/height and direct SVG drop-shadow; `836–840` inclusive mobile grid, media order/cap and title size. Child `.eg-eyebrow`, `.eg-title__accent`, `.eg-btn`/`__icon`, and section selectors may also collide. Avoid legacy part names and test the stable root including pseudo-element and descendants with shipped CSS. Unlayered legacy can beat utilities: `twMerge` and class-string order cannot establish computed precedence. Preserve legacy consumers; no global deletion, blanket `!important` or silent migration. Stop for a separately approved meaningful scoped stylesheet if utilities cannot neutralize collisions.
- **Layer (d) lessons:** package CSS ships without preflight: native controls need token-backed resets and browser proof, not UA defaults. Shared responsive utilities can be emitted by other components, so packed CSS alone does not prove Closing carries its own responsive classes; assert its rendered elements as well. Measure all targets at ≥44px, including supplied controls, and check focus/contrast in actual shipped CSS. The LiveBand `aspect-video` failure is not evidence that another aspect utility emits.
- **Files:** future six meaningful files `types.ts` (CVA/types), `useClosing.ts` (derivation), `Closing.tsx` (JSX), `Closing.test.tsx`, `Closing.stories.tsx`, `index.ts`. No extra internal module proposed. **No stylesheet** recommended if approved utilities and collision neutralization work; otherwise a meaningful compliant role requires explicit spec/plan approval. No code, registry, token, dependency or catalog change follows from this draft.

### Expected-design visual references

| ID | Image and English description | SHA-256 / status |
| --- | --- | --- |
| VIS-01 | [Wide Foundation preview](closing--variants--1280x1400--dark.png): diamond eyebrow, two-tone display title, lede, three icon CTAs and isotype fallback. | `882bcb65cc01cfdb745ee3a43a2be052d8b12d9863490c06dbf27619eb926b4d` — proposed |
| VIS-02 | [Narrow Foundation preview](closing--variants--390x1400--dark.png): the same scene with media above copy and CTAs wrapping. | `885339c658185f98865d20f2632352ba9d1a5731eb186c177e855d34bd074923` — proposed |

Parent supplied captures of read-only Foundation `Closing/preview.html`, SHA-256 `a38cc496a958939cfc41887974e7d1f4b20e13f3448ae4d32019cca1808b211c`; parent reports 1280×1400 and 390×1400 dark captures (`odd/tasks/web-catalog.md` L42). Browser version, device scale, locale, font provenance, motion/transparency settings, crop and capture date are not independently supplied here and remain pending; do not infer them. Images are preview examples, not responsive-boundary, behavior, contrast or implementation evidence. Adoption and immutable/public asset handoff are pending; visual conformity **Not evaluated**. Related criteria CL-02, CL-04 and CL-05.

## 7. Acceptance criteria

All checks below are planned, not observed; subject to owner decisions and separate plan approval.

| ID | Observable promise | Planned evidence |
| --- | --- | --- |
| CL-01 | Host supplies heading rank/ID, title and optional text; named SectionShell yields one landmark, no defaults or duplicated IDs | Public role/name and rerender tests with multiple instances and absent optionals |
| CL-02 | CTA children preserve order and separate native semantics; three example controls wrap and are named, no invented URLs or nested controls | DOM/keyboard tests, Button-as-anchor and Link examples, wide/narrow VIS-01/02 |
| CL-03 | Decorative media is host-supplied, absent means no slot/fallback; no effects import or director; media-first narrow visual order leaves reading order intact | Public DOM tests and effects-host integration; static dependency check |
| CL-04 | Approved boundary, media sizing and long copy reflow without clipping; actual local responsive classes apply | Compiled CSS and rendered-class assertions; browser at 859/860/861, narrow embedding and zoom |
| CL-05 | Approved Material and glow, actual contrast, focus, reduced preferences and legacy root/pseudo/child neutralization without legacy regressions | Packed-consumer browser with shipped styles; computed styles and unchanged legacy fixture; VIS-01/02 |
| CL-06 | Consumer controls and icons have correct keyboard/name behavior and ≥44×44px targets | Browser keyboard, focus and target measurements; accessibility tests, manual AT verification |
| CL-07 | Native forwarding restrictions, className placement-only semantics, English documentation and React 18/19 package use | Type/DOM/docgen tests, static CVA scan and packed consumers without Tailwind |

## Blocking owner questions

| ID | Question / evidence | Recommendation |
| --- | --- | --- |
| OQ-1 | Hero and Closing share eyebrow, two-tone title, lede, CTA row and media: shared recipe or independent scenes? | **Resolved by the owner (2026-11-03):** "Props estructuradas, como SectionHeader (Recomendado)". Both scenes use the same structured API family (`title`, `level`, `eyebrow`, `accent`, `lede`, CTA-only `children`, optional `media`, heading `id`, placement-only `className`) with identical semantics; they stay independent components with no shared implementation coupling assumed. |
| OQ-2 | Slot/fallback and heading/host semantics? Foundation README supplies SVG fallback and a section; catalog requires consumer 3D/media. | Use optional consumer-supplied decorative `media`; no implicit fallback. Host supplies a named SectionShell and heading ID/rank; Isotipo3D owns its fallback when supplied. Approve `scene-media` convention separately. |
| OQ-3 | CTA API and limits? Foundation requests at most three, one primary; registry `trailing-actions` covers only one or two. | Use CTA-only `children`, one to three named independent controls, at most one primary as consumer obligation; no cloning, parsing or runtime enforcement. Keep target/rel and destinations consumer-owned. |
| OQ-4 | Halo and host register? Foundation radial and SVG drop-shadow are not approved token recipes. | Reuse host's approved SectionShell register; only add glow through existing approved token recipe or separately approve a compliant recipe and fallback; otherwise adopt an explicit visual difference. |
| OQ-5 | Adopt source ≤860px, slot cap and title clamps? | Approve a Closing-local inclusive 860px threshold and review token-compatible sizing separately; test exact boundaries and actual compiler output. Prior component-local approvals do not transfer. |
| OQ-6 | How handle narrow-order accessibility and arbitrary children? | Media is decorative/non-focusable, CSS visual order only; copy and actions retain DOM order. Consumers own named controls, safe external navigation and 44px targets; verify actual examples. |

**Closure:** OQ-1–OQ-6, exact payload and visual adoption, proposed naming, applicable responsive and Material recipes, capture provenance and accessible asset handoff remain pending. Spec approval does not approve a plan; an independently approved plan is required before implementation.
