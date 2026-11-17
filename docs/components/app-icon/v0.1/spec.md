# Component contract — AppIcon

- **Version / status:** v0.1 — Approved — 2026-11-17 (parent applying the recommended options under owner delegation; see "Approval" below). Implementation plan follows the same delegation.
- **Approval / recovery:** Recover this draft at `docs/components/app-icon/v0.1/spec.md`. The owner selected a new passive atom in the [#410 revision](https://github.com/egdev6/egdev-design-system/issues/410#issuecomment-6923524266); that decision does not approve this exact API, visual reference, naming proposal or implementation plan. Each requires its own review.
- **Current situation / pending decisions:** New component, not exported or implemented. Recommendations below select the remaining API and Material decisions; their acceptance and a separate implementation plan remain pending.
- **Snapshot identity:** `version: v0.1`; `contentSHA256: Pending`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/410`; `latestPublishedComment: Pending`.
- **Hash definition:** SHA-256 of the UTF-8 payload from the actual `## 1. Purpose and scope` heading through EOF, LF line endings and final newline; metadata above it is excluded. Finalize before publication and bind approval to this version, digest and identified visuals.

## 1. Purpose and scope

A passive, square visual identity for an application: show its supplied image when loaded, otherwise consumer-supplied initials. It may be named when meaningful or decorative alongside equivalent visible text. It is not a launcher, link, status indicator, image validator, application discovery mechanism or native file-access API. The consumer controls source trust, localization, image data and any surrounding interaction.

### Draft cataloging decision

- **Responsibility / level / package:** one passive app identity, with local image-loading state but no coordination of independent controls or flows: **atom**, `@egdev/ui`, proposed `packages/ui/src/atoms/app-icon/`. Supporting Radix/Surface parts do not make it a molecule.
- **Public evidence:** `packages/ui/src/index.ts` exports Avatar, Logo, PhotoFrame and Surface, not AppIcon. `atoms/avatar/{types.ts,useAvatar.ts,Avatar.tsx,Avatar.test.tsx}` implements person/channel identity, a round disc and a user-glyph fallback; `atoms/logo/types.ts` is egdev's fixed artwork; `atoms/photo-frame/types.ts` provides editorial figure/crop semantics, not a compact app identity with fallback. `docs/CATALOGO.md` agrees but is not proof of React availability.
- **Reuse → variant → compose → extract → new:** Avatar cannot supply square app identity or initials as-is; a square variant would change its person/channel responsibility and fallback. Logo and PhotoFrame do not cover arbitrary app identities. A product-local composition can display an image but repeats image/fallback and naming policy across call sites; #410 records a generic system need and explicitly selects a new atom. Avatar's loading primitives are not a reusable exported subcomponent to extract without changing Avatar. **Recommended: new AppIcon atom**, composing the existing `surfaceVariants` recipe and the already installed individual `@radix-ui/react-avatar` 1.3.1 Root/Image/Fallback primitives. Radix owns loading/fallback, not app discovery or activation. Avatar remains unchanged.
- **Impact / status:** proposed new named export and `eg-app-icon` marker, stories/tests and later catalog entry. No existing API, class, consumer, token or dependency changes. Catalog source/generation and any registry update belong to separately authorized implementation/integration, not this draft.

## 2. Anatomy and composition

| Part | Responsibility / host | Content |
| --- | --- | --- |
| Root | Radix Avatar Root as a passive `span`; compose `surfaceVariants` and AppIcon CVA through `cn()` | One stable square frame, optionally named as an image |
| Image | Radix Avatar Image, `alt=''`, decorative inside the named/decorative root | The consumer's source, proportionally contained and centered |
| Fallback | Radix Avatar Fallback `span`, hidden from accessibility APIs | Consumer-supplied one- or two-grapheme app monogram |

Root marker `eg-app-icon` is proposed public API. `surfaceVariants` retains its existing `eg-surface` marker. Image and fallback are internal, with no new public part selector. No nested action, ref, `asChild`, image-validation interface or raw Radix export. The parent can wrap the passive icon in its own correctly named button or link; AppIcon itself does not become a control.

## 3. Public API

| Prop | Type / required | Default and rule |
| --- | --- | --- |
| `monogram` | `string`, required | Consumer supplies one or two meaningful grapheme clusters of initials. Render the supplied text as-is when fallback is visible; do not derive it from a name, force case or slice Unicode. |
| `src` | `string`, optional | Absent, empty or whitespace-only means no image; otherwise pass the supplied source unchanged to Radix Image. No URL validation or fetching policy is implied. |
| `label` | `string`, optional | Non-whitespace label gives the root `role='img'` and that accessible name; absent/blank makes the whole root decorative (`aria-hidden=true`). Consumer supplies equivalent context for decorative use. |
| `size` | `'sm' \| 'md' \| 'lg'`, optional | `md`; square dimensions are token-backed as specified in section 6. |
| `className` | native `string`, optional | Root outer margin/self-alignment/placement only; no size, paint, radius or internal part overrides. |

Inherit compatible `ComponentPropsWithoutRef<'span'>`, omitting owned `children`, `role`, `aria-label`, `aria-labelledby`, `aria-hidden`, `tabIndex`, `style`, `dangerouslySetInnerHTML`, `contentEditable`, `onClick` and `onKeyDown`. Compatible id, title, data attributes and `aria-describedby` reach the root. No ref, `asChild`, activation, `alt`, `children` or uncontrolled/controlled selection API is exposed. A valid non-empty monogram of one or two grapheme clusters is the caller's responsibility; invalid untyped values are unsupported and must not be replaced by fabricated identity text. Native image transport/loading remains Radix-owned. TypeScript must use `type`, with English JSDoc and appropriate Controls on each own prop.

**Naming lookup:** [registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md), [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry), searched by meaning, name and aliases. Reuse approved `brand-monogram` / `monogram` for the app's one- or two-character brand initials, `accessible-name` / `label` for optional naming, and `preset-dimensions` / `size` for component-specific square presets. The `brand-monogram` entry avoids *user* avatar initials; these represent an application, not a person. `src` is an owned image-source input on a span-root atom, not an inherited span attribute: propose `identity-image-source` / `src` (`string`, optional) for a supplied identity image source; no matching source convention was found. Its separate convention approval is pending. No exception or registry edit is made here.

Reviewed existing comparison sources: `{path: 'packages/ui/src/atoms/avatar/types.ts', symbol: 'AvatarProps', revision: 'sha256:257f17ea206a79e5a560cc7593f2f5c456bdca5dda51bc9c11fdb5ce418f1817'}` and `{path: 'packages/ui/src/primitives/surface/types.ts', symbol: 'surfaceVariants', revision: 'sha256:26d0726b5034dceb74e0067c1c0df5108d351e948205bbf22b5e187b92d9c0b6'}`. The registry has no existing `brand-monogram` usage. No `AppIconProps` source or hash exists yet; a later authorized implementation must review the real symbol and whole-file bytes before recording usage.

### Decisions awaiting approval

- Component boundary: **Recommended** — a new AppIcon atom, not an Avatar shape variant. The owner-selected app responsibility differs from a person/channel disc and leaves Avatar untouched.
- Initials and naming: **Recommended** — required consumer-supplied `monogram`, with optional `label` and decorative default. This supports image failure even without a label, avoids language-specific automatic initials and avoids duplicate announcements.
- Loading and fit: **Recommended** — reuse installed Radix Avatar image/fallback with centered `object-contain`, not `object-cover`, so non-square app artwork is not cropped.
- Sizes and Material: **Recommended** — `sm/md/lg` fixed token presets, default `md`, with `--radius-md` and the existing surface-1/elevation-0 recipe. No arbitrary CSS-pixel dimensions or new tokens are needed.

## 4. Behavior

| Given / action | Expected result / event |
| --- | --- |
| No usable `src`, initial loading, or image error | Fallback appears immediately with the supplied monogram; no callback or live announcement. |
| Image successfully loads | Radix displays the image and removes the fallback; aspect ratio is preserved inside the square. No duplicate meaningful image is exposed. |
| Source changes after error or success | Radix handles the new image lifecycle; fallback is visible until the new source loads and reappears if it fails or is removed. |
| Label added, changed or removed | The root becomes named, changes its name or becomes decorative respectively, independent of image-loading state. |
| Keyboard navigation | The atom adds no tab stop or keyboard behavior; a surrounding consumer control owns activation and naming. |

No event, content discovery, arbitrary child rendering, network retry timer, image normalization or shared application state is introduced. Caller-supplied source must be appropriate for the host and validated there; the component cannot promise safe native image data.

## 5. Accessibility

For meaningful identity, provide one non-empty localized `label`; the root exposes exactly one image name regardless of whether Radix shows the image or fallback. The inner image has empty alt and the visible monogram is hidden from AT to avoid repeated names. Without a non-whitespace label, the whole icon is decorative; a nearby name or enclosing control supplies any necessary meaning. No automatic announcement occurs when an image loads or fails. No keyboard/focus handling or minimum touch target belongs to the passive atom; any parent button/link owns its accessible name, focus ring and 44 CSS-pixel target. Verify named/decorative loading and failure with real browser/AT as well as DOM tests.

## 6. Appearance

| Axis | Values / default | Rule |
| --- | --- | --- |
| `size` | `sm`, `md`, `lg`; `md` | Square `size-8` (`--space-8`), `size-10` (`--space-10`), `size-12` (`--space-12`) respectively. |
| Frame | Fixed | `surfaceVariants({tone: 'surface-1', elevation: 0, radius: 'md', padding: 'none'})`; border-box, clipped to `--radius-md`. |
| Image / fallback | Image when loaded; otherwise monogram | `size-full object-contain object-center`; fallback centered in the same inner box. Use `font-sans`, `text-label-default` at sm and `text-body-default` at md/lg, `text-fg-default`. |

Surface supplies the tonal fill, existing sheen, hairline and light edge; do not handwrite or clone Material shadows/gradients. Radius and dimensions use existing tokens. No additional padding or cropping is applied to the artwork. The frame is passive and does not acquire hover, pressed, focus, loading spinner or paused styles. No motion is introduced; reduced motion/transparency require no alternate animation or overlay. Check that fallback text fits with a valid monogram at every preset and that foreground contrast remains adequate. No dynamic geometry, inline appearance, new tokens or dependency.

Root `className` is merged last with `cn()` for outer margin/self-alignment/placement; unsupported appearance or size overrides are not sanitized. `twMerge` resolves recognized utility groups, not all CSS cascade or selector conflicts. Verify supported merges and stable markers, compiled static CVA utilities and packed consumption without a consumer Tailwind compiler.

**Six meaningful files:** `types.ts` (public types/JSDoc and static CVA); `useAppIcon.ts` (derive naming and per-part classes, pass source to Radix); `AppIcon.tsx` (JSX-only Root/Image/Fallback composition); `AppIcon.test.tsx` (public behavior and hook); `AppIcon.stories.tsx` (real component autodocs); `index.ts` (named `AppIcon`, `AppIconProps` and `AppIconSize` exports). Integrate the package barrel and catalog source only under later authorization. **No stylesheet** and no extra internal module.

### Expected-design visual reference

| ID | Scenario / source | Status and conditions |
| --- | --- | --- |
| VIS-01 | Pending: square named app artwork and initials fallback at each preset | Source/version, viewport, DPR, browser, theme, fonts, motion/transparency, crop, date, hash and visual approval pending. |
| VIS-02 | Pending: decorative icon beside equivalent text and a non-square contained image | Same provenance and conditions pending. |

No captures are produced in this batch. The implementation PR must provide stories and real component-zone captures with provenance/conditions and request visual approval before merge. Visual conformity is **Not evaluated**; see the [capture guide](../../../design/README.md). Captures do not prove loading, keyboard or AT behavior.

## 7. Acceptance criteria

All checks are planned, not observed.

| ID | Observable promise | Planned check / story | Evidence |
| --- | --- | --- | --- |
| AC-01 | Absent/blank source, loading and error display the exact supplied monogram; valid load replaces it; changes/removal recover correctly. | Public real-Radix DOM tests with controlled browser image transport and source changes; MissingImage/BrokenImage/WithImage stories. | Pending |
| AC-02 | Named use exposes one root image name across fallback/load/error; decorative use exposes none, including after label changes. | Role/name/alt/aria tests and browser/manual AT; Named/Decorative stories; VIS-02. | Pending |
| AC-03 | `sm/md/lg` use the specified square token dimensions and radius; artwork is centered/contained, fallback is legible and Surface retains Material. | CVA/build/packed-consumer tests, real computed geometry/contrast and captures; Sizes and NonSquareImage stories; VIS-01/02. | Pending |
| AC-04 | Icon is passive, not tabbable; parent-owned button/link remains the only interactive target. | Tab-order/role tests and browser focus example; InButton story. | Pending |
| AC-05 | Avatar's public API, round image, fallback, names and defaults remain unchanged. | Existing Avatar behavior regression, barrel and package-consumer tests. | Pending |
| AC-06 | Required monogram, bounded native props, proposed exports, Controls, supported class merges and six-file/no-stylesheet contract hold. | Positive/negative type tests, docgen/Controls, CSS scan and React 18/19 packed consumer checks. | Pending |
| AC-07 | Installed individual Radix Avatar and existing Surface/tokens suffice; the catalog records a new atom without dependency/token changes. | Manifest/lock/source diff and generated catalog review during separately authorized integration. | Pending |

**Dependencies:** existing Radix Avatar 1.3.1, Surface recipe and token package; no new dependency/token, and no dependency on #396, #417 or #424. **Next step:** Review the recommendations and proposed source convention, finalize this snapshot and separately approve an implementation plan. No implementation or external write is authorized here.

## Approval

- **Status:** Approved 2026-11-17.
- **Authority:** the owner delegated these decisions to the parent's recommendations: "pues termina el 1 y luego el 2. Sigue hasta terminar ambos. Aplica las recomendaciones y mergea los prs. Puede paralelizar en hasta 3 subagentes hasta terminar" (owner session 2026-11-17, recorded in `odd/tasks/milestones-1-2-delivery.md` L1 and `odd/tasks/nexo-adoption-m2-specs.md` L1).
- **Resolution:** every open decision in this document resolves to its option marked **Recommended**. New or changed prop-naming conventions and scoped exceptions proposed here are approved together with this spec; registry entries and approval records are added in the implementation PR.
- **Not approved here:** new tokens or token value changes, new dependencies, and anything this document flags as out of scope; those stop for the owner.
