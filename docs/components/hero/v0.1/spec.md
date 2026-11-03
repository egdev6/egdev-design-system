# Component contract — Hero

- **Version / status:** 0.1 — Proposed draft; not approved or implementation-ready. **Decision history:** For the shared Hero/Closing API family, the owner chose “Props estructuradas, como SectionHeader (Recomendado)”; this resolves the former API-shape OQ only, not approval of the full spec or naming conventions.
- **Approval / recovery:** Catalog classification only is approved in [owner approvals](../../web-catalog/v0.1/owner-approvals.md); the exact Hero spec, visual references and implementation plan are not. Tracking: `odd/tasks/web-catalog.md` E1, S3–S4, L5, L41–L42.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: 6456ca97c64569b0e66df4fe1d5b6ceb4563b312dec42b580f48858f45a15116`; `visualHashes: VIS-01 → f8b7958e926cb1d6cbacb880fd27dda11e2ab0c129bc038548fb10756043327b; VIS-02 → 2230fbbb5dda1b87717b23ecae6b93ee25d06f5881d36cfb5438e6f7fcba5417`; `approvalReference: Pending`; `canonicalIssue: Pending`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of UTF-8 bytes from the complete line `## 1. Purpose and scope` through EOF, including final LF; metadata above is excluded. Finalize before publication.

## 1. Purpose and scope

Hero is a proposed reusable scene organism in `@egdev/ui`: introductory copy, up to two actions, optional social links and a 3D/media area. Content, destinations, identity and effects are consumer inputs, never Pulso defaults. It is not a page, section frame, router, WebGL engine, scroll director or reveal/wipe implementation. The approved web policy admits slot-based scenes; choreography and the separately approved reveal/wipe utility belong to `@egdev/effects`, not Hero. About and Community are recipes without exports (L41).

**Cataloging and alternatives:** `SectionHeader` handles editorial headings, not this media/action scene; a variant would change its responsibility. `SectionShell` frames sections but does not provide the scene's copy/media layout. Composing delivered Text, Heading, Button and SocialLinks alone is possible, but repeats the scene layout across web views; no existing React Hero is exported to extract. Recommend a new generic organism composing those elements, as separately approved in the catalog decision. No Radix primitive is needed for a passive layout; composed controls retain their own native or Radix behavior.

**Evidence:** read-only Foundation `design-system/components/Hero/README.md` and `preview.html`; `packages/ui/src/styles/legacy/bundle.css:701–723`. `packages/ui/src/index.ts` exports Text, Heading, Button, Link, SocialLinks and SectionShell, but not Hero. `packages/effects/src/index.ts` exports Isotipo3D; no reveal/wipe utility is exported there currently. Older normative availability prose describing Gauge alone is stale relative to these inspected exports, not evidence of Hero compliance.

## 2. Anatomy and composition

| Part | Proposed responsibility and content |
| --- | --- |
| Root `eg-hero` | Passive `div` and responsive scene layout; host SectionShell supplies section semantics, gutters and height. |
| Copy | Structured consumer-supplied optional eyebrow, one Heading with title and optional accent, optional lede, CTA children and optional social slot in that order. |
| Actions | Zero to two distinct consumer-supplied named buttons or links, at most one primary; supplied order is preserved. |
| Media | Consumer-supplied decorative 3D or media; visual right on wide screens and above copy at narrow widths, without changing DOM reading/focus order. |

Hero renders the structured copy inputs, CTA-only children and optional social slot in the copy region, followed by optional `media` in DOM order. No parsing, cloning or runtime verification of arbitrary descendants is promised. Host composes `<SectionShell register="show" wrap>` around Hero, avoiding another max-width/gutter wrapper; final register depends on contrast and the adopted background. SectionShell already provides a section, default wrapper and nav-height compensation (`packages/ui/src/templates/section-shell/types.ts`). Host owns IDs, section name, document outline, ambient background and zone anchor. No nested section is invented.

The delivered `Text variant="eyebrow"` includes its decorative diamond; `Heading variant="hero"` accepts a consumer-selected `level`, trailing `accent` and `accentBreak`. Its canvas hero accent uses existing `--text-shadow-title-hero`; the actual background must support its foreground. Button `variant="primary"` / `"secondary"` with `asChild` can style one compatible anchor each; Link is suitable for text links, not a nested link inside a button. `SocialLinks` accepts its own `items`, localized `label` and `caption`; use `size="lg"` (48px), with consumer-owned names and destinations. Consumer may supply decorative `Isotipo3D` from effects; it has its own SVG fallback and scene inputs. Hero does not import effects, select a pose, produce an SVG fallback, or control media lifecycle. Generic decorative consumer media and a media-absent composition are possible; layout consequences require owner review (OQ-1).

## 3. Public API

The structured API family was selected by the owner; the complete contract remains proposed and conditional on the remaining OQs.

| Input | Proposed type / default | Contract / naming lookup |
| --- | --- | --- |
| `title` | `string`, required | Non-empty main heading; approved `heading-title`. |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6`, required | Native heading rank chosen by host; approved `heading-level`. |
| `eyebrow` | `string`, optional; absent omits | Context before heading; approved `heading-eyebrow`. |
| `accent` | `string`, optional; absent omits | Trailing highlighted text, approved `trailing-text-accent`; use Heading's block accent and preserve spacing: Heading inserts no separator, so consumer supplies whitespace in `title` when needed for the accessible name. |
| `lede` | `string`, optional; absent omits | Introductory paragraph; approved `section-lede`. |
| `children` | `ReactNode`, optional; absent omits | Zero to two consumer-supplied, named, independent CTA controls only, at most one primary as a consumer obligation; no defaults, parsing, cloning or runtime validation. Native composition, not an own naming convention. |
| `media` | `ReactNode`, optional; absent omits slot | Decorative, non-focusable consumer media, not interactive or sole source of meaning. New proposed `scene-media` / `media`, `approval: null`: a passive media/3D scene slot, not a thumbnail, effect scene selector or Radix `asChild`. |
| `social` | `ReactNode`, optional; absent omits slot | Consumer-supplied social links group, normally SocialLinks, with its own localized name and destinations. Proposed `scene-social` / `social`, `approval: null`: an optional consumer-supplied social-profile links group in a scene, not CTA controls, a data array or a generic navigation landmark. |
| `id` | native `string`, optional | Forward to Heading so host can reference it from SectionShell's `aria-labelledby`; this is a proposed explicit heading-ID contract, not a root anchor. Host puts `data-zone` on SectionShell. |
| `className` | native `string`, optional | Root outer placement only; no arbitrary appearance override. |

Lookup consulted the [registry](../../../../skills/_shared/prop-naming.json) and [generated view](../../../prop-naming.md) by meaning, name and aliases. No existing convention fits `social`: `collection-items` / `items` denotes structured data, `trailing-actions` / `actions` denotes action controls, and `slot-composition` / `asChild` denotes Radix element substitution. `scene` / `effect-scene` selects an effect pose, not media. `scene-media` is the same proposed convention and wording as Closing; `scene-social` is also proposed, both with null approval and requiring separate scoped approval. No exception, invented Hero source revision or registry edit is proposed. Reviewed existing `HeadingProps` and `TextProps`, `packages/ui/src/primitives/text/types.ts`, SHA-256 `badce40976a01fb4c0079a1481c5ba2fcdf88c10dd2bee6556244991fdfd21c9`; `ButtonProps`, `packages/ui/src/atoms/button/types.ts`, SHA-256 `8c61498c24fe7f3da8f7393782910328e9f48cb5273b31dcd215f8bd9f58a0cb`; `SocialLinksProps`, `packages/ui/src/molecules/social-links/types.ts`, SHA-256 `dafd4d7a0ec76696e85d2ad1856998720c6a68ceb5f805c0a584c59ae7bef417`. Convention approval is separate from spec approval.

Root forwards compatible `ComponentPropsWithoutRef<'div'>`, excluding `children`, `id`, `role`, `style`, `dangerouslySetInnerHTML` and conflicting own props; `id` is reserved for the heading. Host puts the section anchor and `data-zone` on SectionShell. No ref, polymorphic root, built-in state, callback or controlled/uncontrolled behavior is proposed. React 18/19 and packed consumer compatibility remain planned checks. `className` merges recognized layout utilities with `cn()`; `twMerge` does not promise universal cascade precedence.

## 4. Behavior

| Condition | Proposed result |
| --- | --- |
| Wide | Copy and media are adjacent, copy first; source shows 1.3fr / 1fr. |
| Narrow | Media appears above copy visually; DOM and keyboard order remain copy then media. |
| Missing eyebrow, accent, lede, actions, media or social | Omit the corresponding content or slot; no default artwork, empty control or invented message. When media is absent, copy fills available width; see OQ-1. |
| Action activation | Native link/button behavior belongs to the supplied control; no routing interception. |
| Reduced motion | Hero adds no motion. The supplied media/effect owns its own reduced-motion behavior. |

**Source boundaries, candidates only:** legacy `bundle.css:708–723` uses ≤860px for single column and media-first visual ordering with slot max-height `min(34svh,300px)`; 861–960px retains two columns and base 62vh slot cap; ≥961px changes copy spacing and slot cap to `min(56svh,560px)`. These are not approved responsive exceptions or proven Tailwind utilities. Source uses square aspect ratio; a generic media slot may have different geometry. Check 859/860/861 and 960/961/962, narrow embeds, tall/short viewports, reflow and long localized content before adoption. No `md:` assumption or `aspect-video`: the tokens theme did not emit the latter in LiveBand. No dynamic geometry exception is proposed.

## 5. Accessibility

Hero renders one Heading with the host-selected rank; the host ensures one page `h1` where appropriate and passes a unique heading `id` for SectionShell's `aria-labelledby`, or supplies an appropriate section label. The title and block accent form one accessible heading name; the consumer supplies a separator in `title` when needed. Hero adds no landmark. CTA and social destinations need meaningful localized accessible names; controls remain separate and unnested, with native Tab/Shift+Tab and Enter behavior (Space for buttons), visible token focus and at least 44×44 CSS px targets including at narrow and coarse-pointer sizes. `Button` md and `SocialLinks` lg are candidates, not measured Hero evidence. Consumer-provided arbitrary controls remain the consumer's responsibility and must be checked in integration.

The proposed `media` slot is decorative and non-interactive, with no focusable descendants or sole meaning. Isotipo3D defaults to a decorative posture; do not place its interactive mode in a hidden container. Meaningful or interactive media is outside this proposed slot contract. Foundation's labelled fallback SVG and hidden canvas differ from a purely decorative effect; adoption of the proposed semantics is an owner question. Diamond and decorative glyphs are hidden from assistive technology. No live announcement, focus trap or custom keyboard handling applies. Contrast, zoom and assistive-technology results are not yet observed.

## 6. Appearance

- **Material:** use delivered token-backed Heading/Text and Button recipes; pressed/elevated action surfaces must not be replaced by flat approximations. SectionShell supplies its approved show treatment; choose and verify the actual host backdrop. The canvas hero heading glow is available through Heading's existing token-backed recipe, not permission for handwritten glow. Source SVG drop-shadow, floating pixels and any additional halo are reference only: either use an already approved token/recipe or explicitly propose and approve one. No handwritten gradient, shadow, color or inline appearance. Decorative fallback is consumer-owned, with no promise of source animation.
- **Layout:** prefer available token-backed static utilities, CVA in `types.ts` and per-part `cn()`. No new token, dependency or breakpoint is authorized. Source 18px/22px/26px and viewport-based sizes are evidence, not approved hardcoded values. Prove utility emission and separately approve any local responsive or geometric exception before a plan. No `aspect-video` assumption.
- **Cascade inventory:** unlayered `bundle.css:701–723` targets `.eg-hero` width/max-width/gutters/color/font, `__grid` grid/gap, `__copy > .eg-eyebrow` and `> .eg-title` margins, `__lede` type/width, `__ctas` flex/gaps/margins, `__art` layout/order, `__slot` sizing and direct SVG drop-shadow, `__iso-px` and `eg-iso-float` animation, plus the 860/961 media rules. Root marker `eg-hero` remains public; avoid legacy internal markers in new parts and neutralize root collisions in a bounded, approved way. Composed `eg-btn`, `eg-social`, typography and SectionShell have independent legacy selectors: verify their actual computed results together. Do not modify legacy styles or consumers, rely on class-string order, or use blanket `!important`; if utilities cannot win, stop for a separately approved meaningful scoped stylesheet role.
- **Layer (d) lessons:** package CSS ships without preflight: native controls and anchors need explicit token-backed resets, not assumed user-agent defaults. Assert Hero's own responsive classes/elements as well as packed CSS because shared utilities can mask missing classes. Test shipped styles in a packed consumer without Tailwind and real browser; check focus, contrast, target geometry and unchanged legacy consumers. No actual browser parity is claimed.
- **Files:** future six meaningful files `types.ts`, `useHero.ts`, `Hero.tsx`, `Hero.test.tsx`, `Hero.stories.tsx`, `index.ts`; no extra internal module. **No stylesheet** recommended only if approved utilities and collision neutralization suffice; otherwise seek explicit role and separate plan approval. Root `className` is layout-only, not blanket appearance permission.

### Expected-design visual references

| ID | Image / English alt | SHA-256 / status |
| --- | --- | --- |
| VIS-01 | [Wide Foundation preview](hero--variants--1280x1400--dark.png): diamond eyebrow, two-tone display title, lede, two actions, social row and isotype fallback. | `f8b7958e926cb1d6cbacb880fd27dda11e2ab0c129bc038548fb10756043327b` — Proposed |
| VIS-02 | [Narrow Foundation preview](hero--variants--390x1400--dark.png): the same scene on a narrow board. | `2230fbbb5dda1b87717b23ecae6b93ee25d06f5881d36cfb5438e6f7fcba5417` — Proposed |

Parent captured the read-only Foundation `Hero/preview.html` (SHA-256 `53866f6df7e970abc943ea9b018fbccd8544d24f8f7ff042e028879027b35c88`) using the layer (e) preview capture (L42); supplied viewport sizes 1280×1400 and 390×1400, dark. Browser/version, DPR, capture date, crop, actual font loading and motion/transparency preferences are not independently established here; parent should provide the capture record before publication. These reference images depict Foundation, not an implemented Hero; sample Spanish copy is not a default. VIS-01/02 inform HE-02, HE-04 and HE-06, not accessibility or exact token values. Visual adoption, immutable asset publication and matching-byte access checks remain pending; visual conformity **Not evaluated**.

## 7. Acceptance criteria

All checks below are proposed and unobserved; they require owner decisions and a separately approved implementation plan.

| ID | Promise | Planned evidence |
| --- | --- | --- |
| HE-01 | Structured title and selected level render one heading; its supplied ID names the host section, with no domain defaults, extra landmark, effects or choreography | Public role/name, ID and type tests with multiple instances; SectionShell composition story |
| HE-02 | Optional eyebrow, block accent, lede, social and media render in order or are omitted; zero to two CTA-only children remain distinct and named, with at most one primary as consumer obligation | Role/name tests, absent-optionals and CTA stories; VIS-01/02 comparison |
| HE-03 | Heading name includes the accent, decorative media is nonfocusable, social names and native CTA keyboard behavior remain correct | DOM accessibility checks and keyboard/browser integration with decorative media and SocialLinks |
| HE-04 | Approved wide/narrow behavior preserves DOM/focus order, avoids clipping and accommodates absent media and long content | Compiled CSS and browser at boundary neighbors, narrow embedding, short viewport and zoom; VIS-01/02 |
| HE-05 | Focus, native resets, ≥44px targets, reduced motion and actual contrast remain valid with shipped CSS | Packed-consumer browser, coarse pointer, focus and preference checks |
| HE-06 | Token-backed Material, supported Heading glow, approved host and local collision neutralization preserve legacy consumers | Computed-style/contrast and visual tests with legacy CSS; VIS-01/02 |
| HE-07 | Public root marker, native forwarding and layout-only merge contract hold; Hero's own responsive utilities survive shared CSS emission | DOM/type and per-element class assertions, static scan, built CSS and React 18/19 packed consumer |

## Blocking owner questions

| ID | Question / evidence | Recommendation |
| --- | --- | --- |
| OQ-1 | Must media and actions always be present, and how should absent media affect the layout? | Allow media and social omission, zero to two actions; make copy fill available width without a phantom column. Validate long copy and narrow layouts before implementation. |
| OQ-2 | Which responsive rules and media sizing? Legacy `bundle.css:708–723` uses 860 and 961 with viewport-height caps. | Review component-local ≤860 and ≥961 boundaries and square-slot sizing explicitly; test boundary neighbors and small-height/embedded cases. Do not assume another component's breakpoint approval transfers. |
| OQ-3 | Is the Foundation SVG fallback, floating pixels and drop-shadow mandatory? Foundation README/preview contain a labelled brand-specific SVG. | Consumer supplies media; reuse Isotipo3D's own fallback when selected, without Hero-owned brand, extra floating animation or invented shadow. Adopt any resulting visual difference explicitly. |
| OQ-4 | Which host and title treatment? Source uses neon on dark and a halo; SectionShell is now delivered. | Use SectionShell `show` as host and delivered canvas `Heading variant="hero"` token glow only after actual contrast and Material review; approve any additional recipe separately. |
| OQ-5 | Which heading and media semantics? Source assumes h1 and labels its fallback. | Host chooses rank (one page h1 where applicable), supplies section name and accessible actions; this proposed media slot is decorative and nonfocusable. Meaningful media needs a separately reviewed contract, not a hidden alternative. |
| OQ-6 | Can current static utilities defeat unlayered legacy Hero and composed-child selectors without extra CSS? | Preserve legacy; prove scoped neutralization and packed browser cascade first. If it fails, request a specific compliant stylesheet role rather than editing legacy or using blanket overrides. |

**Closure:** OQ-1–OQ-6, separate `scene-media` and `scene-social` naming approvals, exact payload and visual adoption, responsive/Material decisions, visual capture metadata and immutable publication remain pending. Spec approval is not plan approval; no code, registry, token, dependency, catalog or remote mutation is authorized by this draft.
