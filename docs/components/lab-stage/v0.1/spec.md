# Component contract — LabStage

- **Version / status:** 0.1 — Proposed draft; not approved or implementation-ready. The owner selected a shared structured scene API; that decision does not approve this spec.
- **Approval / recovery:** [Web catalog owner approvals](../../web-catalog/v0.1/owner-approvals.md) approve LabStage as a slot-based `@egdev/ui` scene organism without choreography, not this contract. Tracking: `odd/tasks/web-catalog.md` E4, S3/S4, L5, L41–L46. An independently approved plan is required before code.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: 7fdf88b6472e575a7104b0c24d84776defdc3e08c0dee0f30659a1e5f52f3f2f`; `visualHashes: VIS-01 → 8c09321746b64eb2b518df17ac15b337f8347a5f4b80969086f49c322d9ab1a1; VIS-02 → 255bf178437bfc891f104b7a189f74397dc5c8ce06c1993da37af637eb028233`; `approvalReference: Pending`; `canonicalIssue: Pending`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of UTF-8 bytes from the complete line `## 1. Purpose and scope` through EOF, including final LF; tracking metadata above is excluded. Finalize before publication.

## 1. Purpose and scope

LabStage is a proposed reusable, in-flow scene organism: a structured heading and introduction, a consumer-supplied experiment content area, and optional decorative media. Content, status, links, identity and effect inputs belong to the consumer, not Pulso defaults. It is not a page, fixed-height scroll section, sticky director, animation engine, router or 3D implementation. The approved catalog places choreography and reveal/wipe in `@egdev/effects`; `@egdev/ui` must not import effects. About and Community remain documented recipes without exports (L41).

**Cataloging and alternatives:** inspected `packages/ui/src/index.ts`: Hero, Closing, SectionHeader, SectionShell, Surface, Badge, Link, Heading and Text are exported; LabStage is not. Hero/Closing coordinate different action scenes; SectionHeader is a heading, and SectionShell is a section frame. A variant of these would change responsibility. An experiment card can be composed from delivered Surface, Badge and Link without creating a molecule. A generic scene layout could also be composed in an app, but the owner approved the reusable slot-based organism for web views; no existing LabStage React implementation is available to extract. No Radix primitive is needed for passive layout; composed controls retain their own behavior. Older Gauge-only availability statements in general guidance predate inspected exports and do not establish component parity.

**Source:** read-only Foundation `design-system/components/LabStage/README.md` and `preview.html`, and `packages/ui/src/styles/legacy/bundle.css:738–817`. Source copy, experiment data, brand fallback, static/choreographed modes and animation are reference evidence, not defaults or approved UI behavior.

## 2. Anatomy and composition

| Part | Proposed responsibility |
| --- | --- |
| Root `eg-lab` | Passive in-flow `div`; host SectionShell provides section semantics, wrapping and background. Stable root is public; avoid colliding legacy internal part markers. |
| Copy | Optional eyebrow, one Heading with required title and rank plus optional trailing accent, optional lede, then experiment content. |
| Experiment content | Consumer-authored `children`, recommended as one semantic article composed with Surface, Badge, Heading/Text and Link; consumer owns data, status, link and semantics. No parsing or cloning. |
| Media | Optional consumer-supplied decorative non-focusable 3D/media; visual right on wide layouts and above copy on narrow layouts; DOM order remains copy then media. |

Host supplies a named SectionShell, appropriate register, heading ID and any `data-zone` anchor. SectionShell supplies the section and gutters; LabStage does not add a second landmark or duplicate page wrapper. Delivered `Text variant="eyebrow"` has a decorative diamond. Heading accepts `level`, `accent` and `accentBreak`; the consumer supplies the word separator because Heading does not insert one. Consumer may compose `Surface` with a compatible article via `asChild`, `Badge` with visible status text and optional decorative icon, and a separate named `Link`. Do not nest controls. The delivered Link arrow points right, not the reference's up-right arrow; do not imply external navigation from its glyph. `Isotipo3D` may be supplied from effects by the consumer; it owns its fallback and motion policy. No built-in brand artwork or automatic fallback is promised.

## 3. Public API

The common structured fields match delivered Hero and Closing. The experiment-specific meaning of `children` differs from their CTA-only children and requires explicit approval (OQ-1); it is not an assumption that arbitrary scene children are interchangeable.

| Input | Proposed type / default | Contract / naming lookup |
| --- | --- | --- |
| `title` | `string`, required | Non-empty main heading; approved `heading-title`. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6`, required | Host-selected heading rank; approved `heading-level`. |
| `eyebrow` | `string`, optional; absence omits | Context above heading; approved `heading-eyebrow`. |
| `accent` | `string`, optional; absence omits | Trailing highlighted text; approved `trailing-text-accent`. Block accent remains part of the accessible heading; consumer supplies whitespace in `title` when needed. |
| `lede` | `string`, optional; absence omits | Introductory paragraph; approved `section-lede`. |
| `children` | `ReactNode`, optional; absence omits | Consumer-supplied experiment content, recommended as one article; no fixed data model, parsing, cloning or runtime descendant validation. Native composition, not the proposed `field-message-content` convention. |
| `media` | `ReactNode`, optional; absence omits | Approved `scene-media`: decorative non-focusable media, never the sole source of meaning or interactive content. No fallback when absent. |
| `id` | native `string`, optional | Forward to Heading, not root; host can reference a unique ID in SectionShell `aria-labelledby` and owns `data-zone`. |
| `className` | native `string`, optional | Root outer placement only, not arbitrary appearance overrides. |

Lookup consulted the [registry](../../../../skills/_shared/prop-naming.json) and [generated reference](../../../prop-naming.md) by meaning, name and aliases. `scene-media` was independently approved in [Hero's receipt](../../hero/v0.1/prop-naming-approval-scene-media.json), scope `convention:scene-media`, and reused by Closing; this draft proposes a LabStage usage, not a new convention or approval. `trailing-actions` is for one or two action elements, not a rich experiment article; `field-message-content` is plain form annotation, not general children; `slot-composition` / `asChild` substitutes an element, not media; `effect-scene` selects an effect pose. No new own naming convention or scoped exception is proposed; any subsequently needed new concept stays `proposed` with `approval: null`. Convention approval is separate from spec approval; no LabStage source revision or registry edit is invented. Reviewed `HeroProps` at `packages/ui/src/organisms/hero/types.ts`, whole-file SHA-256 `09c805d2cd51cf46095f17945aabfe547ab59f464fccdbdba9fe30d66c1ed844`, and `ClosingProps` at `packages/ui/src/organisms/closing/types.ts`, SHA-256 `b413fbef41e1ca87a2ebd9300287aad94f5c751f829f733b0463a614fc7e496e`.

Root accepts compatible `ComponentPropsWithoutRef<'div'>` except `children`, `id`, `title`, `role`, `style`, `dangerouslySetInnerHTML` and own conflicts; `id` is reserved for the heading. No ref, root `asChild`, controlled state or events are proposed. `cn()` merges recognized placement utilities; `twMerge` does not promise universal cascade precedence. React 18/19 and packed-consumer compatibility remain planned checks.

## 4. Behavior

| Condition | Proposed result |
| --- | --- |
| Wide with media | Copy and experiment content precede decorative media in DOM and visual order. |
| Narrow with media | One column; media visually first, without changing reading or keyboard order. |
| Media absent or empty | Omit wrapper and media track; copy fills available width, with no fallback or phantom column. |
| Optional text or experiment content absent | Omit the relevant content; no invented copy, card, controls or empty message. |
| Activation | Supplied Link or other control owns native navigation and behavior; no interception. |
| Motion preferences | LabStage adds no glitch, scroll animation, sticky behavior or choreography in any mode. Consumer effects must honor reduced motion independently. |

**Responsive candidates, not proven or approved:** legacy `bundle.css:739–817` has a 1.1fr/1fr grid, a square slot capped at 72vh, and inclusive ≤860px single-column media-first layout with `min(36svh,300px)` cap. At ≤560px it changes card padding and lede width; those belong to consumer content if composed, not automatically to LabStage. The source also uses ≤620px height and reduced-motion rules to escape its choreographed sticky stage; in-flow LabStage needs no sticky escape. Source title clamps and hardcoded padding are evidence, not token authorization. Review a LabStage-local threshold and sizing; test 559/560/561 and 859/860/861, short viewports, narrow embeds, zoom and long translations. Prior sibling breakpoints do not transfer. No dynamic geometry exception is proposed.

## 5. Accessibility

The host selects the appropriate heading level and unique heading ID, names the surrounding SectionShell and owns document outline. Title and accent form one accessible name; decoration is hidden, not meaningful text. The consumer supplies an appropriate experiment article heading subordinate to the scene heading, meaningful link names and localized status text; color alone cannot convey status. No automatic announcement is proposed. Link and other supplied controls retain native Tab/Shift+Tab and Enter behavior (Space where appropriate), visible token focus, correct target/rel and no nested controls. Consumers must ensure each interactive target is at least 44×44 CSS px; measure the actual supplied Link rather than assuming its inline content meets the target. Delivered Button `size="lg"` has an approved 44.8px minimum height, but width and non-Button controls still require measurement.

Media is decorative, non-interactive, not the sole source of meaning and has no focusable descendants; do not hide an interactive effect in an `aria-hidden` wrapper. No custom keyboard handling, focus trap or live region applies. Reduced motion removes any consumer-supplied effect motion; the readable static title and experiment content remain available. Contrast, screen-reader behavior, zoom and actual target measurements are not yet observed.

## 6. Appearance

- **Material:** use the delivered Surface's approved raised material recipe for the consumer-composed card, with Badge, Link and typography appropriate to its actual background. The source uses translucent glass, blur and two scene halos; these are not permission to handwrite colors, gradients, shadows or an overlay on a non-floating card. Recommend the delivered solid raised surface and the host's approved SectionShell register, explicitly adopting visual differences. Any additional halo or glass recipe and reduced-transparency/unsupported-filter fallback needs separate approval. Verify actual contrast and focus with shipped styles.
- **Layout:** static token-backed CVA utilities in `types.ts`, per-part `cn()`, no dynamic class interpolation or inline appearance. Source geometry and responsive boundaries require owner review and compiler proof; no new token, dependency or generic CSS exception is authorized. `aspect-video` was absent in the LiveBand compiler; prove any selected ratio utility instead.
- **Legacy collision inventory:** unlayered `bundle.css:739–817` gives `.eg-lab` a 230vh height, positioning, color and font; `__stage` sticky sizing, overflow and pseudo-element radial backgrounds; `__in` page gutters and grid; `__title`, `__glitch`, pseudo-elements, `.is-active` and `eg-glitch-a/b` typography and animation; `__body`, `__lede`, `__card`, `__row`, `__no`, `__card-title`, `__card-text` and direct `.eg-link` card/layout paint; `__slot` and direct SVG sizing; `.eg-lab--static`, reduced-motion, ≤620px height and ≤860/≤560px rules change those styles. The stable `.eg-lab` root itself collides even without internal markers. Composed `.eg-eyebrow`, `.eg-title__accent`, `.eg-link`, Badge/Surface and section styles also need computed-cascade checks. Preserve legacy CSS and consumers; avoid new legacy part names, blanket `!important`, class-order assumptions or silent migration. If utilities cannot neutralize the root safely, stop for approval of a meaningful scoped stylesheet role.
- **Layer (d)/(e) lessons:** shipped CSS has no preflight; verify token-backed native resets instead of trusting browser defaults. Assert responsive utilities on LabStage's own rendered elements as well as packed CSS because other components can emit the same utility. Test empty media including `false` with `Children.toArray`-equivalent behavior, no empty column, real shipped CSS and no consumer Tailwind compiler. Measure 44px targets and focus/contrast. Story decorators must spread `context.args` before any ID override; Storybook brand assets use `/brand/…`, and story-only utilities require scanning. Hero/Closing browser checks found these failures; they are not evidence of LabStage parity.
- **Files:** future six meaningful files `types.ts`, `useLabStage.ts`, `LabStage.tsx`, `LabStage.test.tsx`, `LabStage.stories.tsx`, `index.ts`; no additional internal module proposed. **No stylesheet** recommended if approved utilities and root collision neutralization suffice; otherwise a specific compliant role needs spec and plan approval. No code, token, dependency, registry or catalog changes are authorized here.

### Expected-design visual references

| ID | Image / English description | SHA-256 / status |
| --- | --- | --- |
| VIS-01 | [Wide Foundation preview](lab-stage--variants--1280x1400--dark.png): static scene with two-tone title, experiment card, decorative 3D fallback and separate fast-glitch title example. | `8c09321746b64eb2b518df17ac15b337f8347a5f4b80969086f49c322d9ab1a1` — proposed |
| VIS-02 | [Narrow Foundation preview](lab-stage--variants--390x1400--dark.png): the same preview at a narrow viewport. | `255bf178437bfc891f104b7a189f74397dc5c8ce06c1993da37af637eb028233` — proposed |

Parent supplied the captures of read-only Foundation `LabStage/preview.html`, SHA-256 `4f07276302dc8074003dcaf19cbdbf36e3c6e16d26addb2cae408a02e4438fe5`, with 1280×1400 and 390×1400 dark viewport labels (L46). Browser/version, DPR, date, crop, fonts, locale and motion/transparency preferences are not independently established; request the capture record before publication. The second example shows `.eg-lab__title.is-active`; a still image cannot establish animation behavior. Images are Foundation references, not implemented LabStage or proof of boundary behavior, contrast or token values. Adoption, immutable asset publication and matching-byte access checks remain pending; visual conformity **Not evaluated**. References inform LS-02, LS-04 and LS-06, subject to approved differences.

## 7. Acceptance criteria

All checks are planned and unobserved; owner decisions and separate plan approval precede implementation.

| ID | Observable promise | Planned evidence |
| --- | --- | --- |
| LS-01 | Required title and chosen rank render one heading; heading ID names the host section without extra landmark, fixed IDs or domain defaults. | Public role/name, multiple-instance ID and native forwarding tests; SectionShell story. |
| LS-02 | Optional text and consumer experiment content render in order or are omitted; composed status and link retain their semantics without generated data. | DOM and absent-slot tests; Surface/Badge/Link story; VIS-01/02. |
| LS-03 | Optional media is decorative, non-focusable and consumer-owned; no fallback, effects import, director or choreography. | DOM and static dependency checks; absent, `false` and supplied-media stories. |
| LS-04 | Approved wide/narrow layout has no phantom media track, clipping or changed DOM/focus order. | Own-element responsive class assertions, packed CSS and browser boundary neighbors, long content, narrow embed and zoom; VIS-01/02. |
| LS-05 | Consumer link/status semantics, visible focus, ≥44×44px targets, contrast and reduced-motion behavior hold in actual composition. | Keyboard, accessibility and target measurements in packed-consumer browser, reduced preferences and manual AT checks. |
| LS-06 | Approved Material and scene differences preserve legacy root and consumers without inherited sticky height or unwanted pseudo/animation paint. | Computed styles and unchanged legacy fixture with shipped CSS; VIS-01/02 comparison. |
| LS-07 | Placement-only merge, protected native attributes, static utility emission, English docs and React 18/19 consumer compatibility hold. | DOM/type/docgen, static scan, story-args and asset checks, packed-consumer tests without Tailwind. |

## Blocking owner questions

| ID | Question / evidence | Recommendation |
| --- | --- | --- |
| OQ-1 | How should the experiment card be supplied: structured experiment data, a new molecule, or a slot? Hero/Closing use CTA-only `children`. | Use optional experiment-content `children` composed by the consumer from delivered Surface, Badge, Heading/Text and Link; accept the explicit scene-specific children difference, no new molecule, fixed data, parsing or cloning. |
| OQ-2 | Should the idle/hover or `.is-active` glitch loop be part of LabStage? Source duplicates text in animated pseudo-elements. | Leave all glitch animation and activation out of `@egdev/ui`; any future effect belongs in `@egdev/effects` under its own contract. Under reduced motion no glitch or transformations run; readable title remains. Adopt the visual difference. |
| OQ-3 | Should both source static and scroll-choreographed variants be exposed? | Only in-flow static belongs in `@egdev/ui`; no `static` switch, sticky section, scroll progress or choreography. External effects/template own orchestration and reduced-motion fallback. |
| OQ-4 | Which media and host semantics? Source includes brand-specific fallback and a section. | Optional decorative non-focusable `media`, no automatic fallback or empty track; host supplies named SectionShell and heading ID/rank. Existing `scene-media` convention is approved; LabStage usage and this spec still need review. |
| OQ-5 | Adopt the source ≤860px, ≤560px and slot geometry? | Review a LabStage-local inclusive ≤860px media-first layout and token-compatible slot cap; leave card-specific ≤560px rules to consumer composition. Prove compiler emission and test both sets of boundary neighbors and short viewports. |
| OQ-6 | Source glass card and two halos differ from delivered Material recipes. | Compose a solid raised Surface and use an approved SectionShell host; adopt visual differences unless a distinct compliant halo or glass recipe with fallbacks is separately approved. |
| OQ-7 | Can utilities safely neutralize the retained unlayered `.eg-lab` root and composed-child selectors? | Verify packed browser cascade and legacy fixtures first; if insufficient, request a specific compliant stylesheet role instead of touching legacy or relying on `!important`. |

**Closure:** OQ-1–OQ-7, exact payload and visual adoption, capture metadata, responsive and Material decisions, and immutable accessible asset handoff remain pending. Approval of this spec is not plan approval; implementation requires an independently approved plan.
