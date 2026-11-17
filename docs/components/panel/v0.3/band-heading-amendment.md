# Component contract — Panel compact band heading amendment

- **Version / status:** v0.3 — Approved — 2026-11-17 (parent applying the recommended options under owner delegation; see "Approval" below). Implementation plan follows the same delegation.
- **Amends:** [Panel v0.2](../v0.2/spec.md), whose exact contract is adopted by [P-C owner approval](../../remaining-components/v0.1/ui-first-wave-owner-approvals.md); its historical Draft header is superseded by that scoped record. Request: [#424](https://github.com/egdev6/egdev-design-system/issues/424), split from the [#404 compact heading report](https://github.com/egdev6/egdev-design-system/issues/404).
- **Approval / recovery:** Pending for this exact amendment. The Panel contract remains unchanged except for the documented composition recommendation; the Heading expansion requires approval as part of this amendment and a separate implementation plan. No code, token, dependency or GitHub change is authorized.
- **Current situation / pending decisions:** Panel/Header/Body/Footer and Heading are exported; no compact Heading recipe exists. D1–D5 recommend exact choices; implementation and new visual evidence are pending.
- **Snapshot identity:** `version: v0.3`; `contentSHA256: Pending before publication`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/180`; `latestPublishedComment: Pending — no v0.3 snapshot published`. This cross-component proposal also changes Heading's #108 contract; a later separately authorized handoff must retain each component's canonical history rather than silently edit either issue.
- **Hash definition:** SHA-256 of UTF-8 payload from `## 1. Purpose and scope` through EOF, with LF line endings and final newline; preceding tracking metadata is excluded. Approval must bind the exact payload and identified visuals.

## 1. Purpose and scope

Document a compact, uppercase condensed semantic heading for a banded PanelHeader, using the #396 typography/foreground work. Consumer-owned rank and ID continue to associate an outer named section with the actual heading. No Panel-owned title, generated ID, automatic landmark, new component, accent edge (#418), token or font-size literal is proposed.

**Cataloging:** compose existing `PanelHeader` with an opt-in Heading variant. Current Panel accepts free children but does not style headings; existing Heading's `section` recipe is display-scale. A Panel title slot would narrow existing composition and duplicate heading semantics; a new component is unnecessary. Evidence: `packages/ui/src/molecules/panel/{types.ts,usePanel.ts,Panel.tsx,index.ts}`, `packages/ui/src/primitives/text/{types.ts,useHeading.ts,Heading.tsx,index.ts}`, tests/stories, `packages/ui/src/index.ts`, token source and the #404/#424 issue data. Existing Material and heading output are implementation evidence, not proof of this proposal.

## 2. Anatomy and composition

| Part | Existing element / responsibility | Content |
| --- | --- | --- |
| Consumer region | Optional native `section` or `article` | Caller supplies `aria-labelledby` and a unique ID. |
| Panel | Existing framed/host-owned passive composition | `PanelHeader`, `PanelBody`, optional `PanelFooter` in the existing direct-sibling order. |
| PanelHeader | Existing native `div`; surface band only when selected | A consumer-supplied `Heading variant='compact'` and any other valid free header content. |
| Heading | Existing native h1–h6 selected by `level` | Visible supplied heading; caller's `id` is forwarded to it. |

Example:

```tsx
const headingId = useId();
<section aria-labelledby={headingId}>
  <Panel variant='banded'>
    <PanelHeader><Heading level={2} id={headingId} variant='compact'>Settings</Heading></PanelHeader>
    <PanelBody>Settings content</PanelBody>
  </Panel>
</section>
```

Preserve `eg-panel`, all existing `eg-panel__*` part markers, framed `eg-surface` and `eg-heading`. No extra Panel markup, named part, wrapper, ref, `asChild` or new Radix dependency; Panel remains generic and passive.

## 3. Public API

| Part / prop | Complete proposed type / default | Rule |
| --- | --- | --- |
| `Heading.variant` | Existing Heading choices plus `'compact'`; omitted remains `'section'` | `compact` is opt-in; level still selects only semantic rank. Preserve the existing `TitleVariant` type and Text's variant domain; widen the Heading-specific visual union rather than silently widening Text. |
| `Heading.foreground` on `compact` | `TextForeground = 'inherit' \| 'default' \| 'secondary' \| 'muted' \| 'warning' \| 'danger' \| 'on-flood'` from #396; optional, default `'inherit'` | Same token mapping, host restrictions and non-color status requirements as [Text v0.2](../../text/v0.2/body-tone-amendment.md). Not available on existing Heading variants. |
| `Heading.level`, `id`, `children`, `className` | Existing types/defaults; `level` defaults to 2 | Native rank, ID and accessible text preserved; `className` remains outer-layout only. |
| `Heading.tone`, `accent`, `accentBreak` | Existing contracts retained for old variants | Not supported on compact; use its readable children. No accent is inserted. |
| Panel / PanelHeader props | All existing types, defaults and native restrictions | No new Panel prop, title API, auto-association or styling override. Arbitrary valid header children still work. |

**Naming lookup:** [registry](../../../../skills/_shared/prop-naming.json), [generated reference](../../../prop-naming.md) and [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry): widen Heading's approved `visual-treatment` / `variant`. Reuse `surface-material-tone` for semantic `foreground`, with proposed scoped exception `{ scope: 'Heading', propName: 'foreground', reason: 'Heading.tone already controls display-accent material context; compact semantic foreground must remain independent', approval: null }`; it is separate from Text's own pending exception in #396. No new global semantic ID, Panel own prop or automatic registry write. `heading-level` is unchanged; `id` is inherited native HTML.

Reviewed sources: `{ path: 'packages/ui/src/primitives/text/types.ts', symbol: 'HeadingProps', revision: 'sha256:badce40976a01fb4c0079a1481c5ba2fcdf88c10dd2bee6556244991fdfd21c9' }` and `{ path: 'packages/ui/src/molecules/panel/types.ts', symbol: 'PanelHeaderProps', revision: 'sha256:5aa2753d3af82b96e29f8df01eda0af56e750d5f4b7d321664a74bc4c4432cd8' }`. These are existing-source evidence, not predicted future hashes or approval of the exception.

**Contract change / consumer impact:** Heading accepts an additional discriminated variant and optional foreground on that branch; exhaustive downstream handling of `HeadingProps['variant']` may need a compact case. `TitleVariant` and Text's existing values remain unchanged. Existing Panel/header and Heading calls, defaults, emitted markers, native/Slot restrictions, accent behavior and Material remain unchanged; consumers only migrate local heading styling when opting in. No forced Panel migration. Packed React 18/19 compatibility is a planned check. Controlled/uncontrolled state does not apply.

## 4. Behavior

| Input / action | Proposed result |
| --- | --- |
| Banded Panel with compact Heading | A native heading of the supplied level appears in the existing header band; supplied ID and words remain intact. |
| No new variant | Existing Heading section default and existing Panel children render unchanged. |
| Other Panel tones, or unbanded Panel | Compact remains a Heading recipe rather than detecting a Panel; consumers may compose it independently, subject to foreground/contrast rules. |
| Missing/invalid untyped compact foreground | Inherit; do not leak the prop. Ignore untyped `tone`, `accent` and `accentBreak` on compact without forwarding them. The existing invalid Heading variant and level fallback remains section/h2. |
| Child actions / content update | Panel and Heading do not intercept events, move focus or announce changes. |

The consumer supplies valid heading text, correct level and document-unique ID. The recipe does not generate titles, enforce one heading, inspect Panel context, disable content or alter host behavior.

## 5. Accessibility

Heading stays a native h1–h6 with its visible text as its accessible name. An enclosing region's `aria-labelledby` refers to the caller's actual heading ID; multiple `useId()`-based compositions remain unique. Uppercase is visual, not source-text mutation. Panel and its Header remain generic divs, not new regions or headers; independent actions retain native/Radix keyboard and focus behavior. No root tab stop, live region, automatic announcement, status meaning by color alone or touch-target promise is added. Consumers choose meaningful words/icons and valid hierarchy.

## 6. Appearance

| Axis | Proposed recipe / default | Restrictions |
| --- | --- | --- |
| Heading visual variant | `compact`: `m-0 font-display uppercase wrap-break-word text-heading-small`; Heading default remains `section` | `--text-heading-small` supplies existing size, line height, weight and tracking; `--font-display` supplies condensed family. This deliberately combines existing roles without creating a token. |
| Compact foreground | #396 `foreground`; default `inherit` | Panel's existing foreground is inherited. Explicit colors use only #396's supported backgrounds and contrast limits; no painted background. |
| Panel variant / tone | Existing `default`/`banded`; `surface-1`/`overlay`/`inherit` | Existing Surface frame, band palettes, spacing, edge, fallback and corner rules are unchanged. |

`--text-heading-small` is the closest existing compact heading token but its documented default family is sans; this proposal intentionally pairs its metrics with the existing condensed `--font-display` to meet #404's uppercase band-heading need. Flag this as a **closest-token substitution**, not an exact approved design match; if that pairing is inadequate, stop for a separately approved token decision rather than invent values. No handwritten size, color, shadow, gradient, inline appearance or dynamic geometry. Panel keeps Surface composition and all reduced-transparency behavior. Static CVA in Text/Heading `types.ts`, `cn()` and the existing Panel per-part recipes remain; do not clone Surface or restyle the band. Supported className is the existing layout-only boundary, not appearance override; recognized merges and actual CSS cascade require tests.

Existing meaningful roles remain Panel's `types.ts`, `usePanel.ts`, `Panel.tsx`, `Panel.test.tsx`, `Panel.stories.tsx`, `index.ts`, and the corresponding Text/Heading types, hooks, JSX, tests, stories and index. **No stylesheet** and no extra internal module. No change to tokens or dependencies.

### Expected-design visual reference

| Visual ID | Image / scenario | Source and conditions / status |
| --- | --- | --- |
| VIS-01 | Pending: compact uppercase heading in a surface-1 banded Panel | Source/version, browser, viewport, DPR, fonts, theme, crop, motion/transparency, date, hash and scoped adoption Pending. |
| VIS-02 | Pending: compact heading in overlay/inherit band and narrow wrapping | Same provenance and conditions Pending. |

No captures are made in this batch; v0.2's adopted static Panel images remain historical, not approved expected designs for compact typography. The implementation PR must supply Panel/Heading stories and real component captures before merge. Visual conformity: **Not evaluated**; see the [capture guide](../../../design/README.md). Captures do not substitute for semantic tests.

## 7. Acceptance criteria

All methods are planned, not observed.

| ID | Observable promise | Planned check / story | Evidence |
| --- | --- | --- | --- |
| AC-01 | Compact Heading renders as each native h1–h6 with unchanged ID, text and default h2; a consumer-labelled region resolves the correct heading across multiple instances. | Role/name/level/ID and `useId()` relationship tests; Panel CompactBandHeading story, VIS-01. | Pending |
| AC-02 | Compact recipe uses the exact existing size/weight/line-height/tracking and display family, uppercase visually, without hardcoded values. | Static CVA/token audit, compiled CSS and browser computed style, narrow/zoom review; VIS-01/02. | Pending |
| AC-03 | Foreground uses #396 mappings/inherit and rejects unavailable compact accent/tone combinations; it never creates status, live or focus semantics. | Strict positive/negative type and public DOM/JS-boundary tests; background/contrast matrix and Foreground story. | Pending |
| AC-04 | Banded surface-1/overlay/inherit preserves the existing Surface/band/corner/fallback recipe, markers, free header content and child controls; default Panel and Heading remain unchanged. | Panel and Heading preservation tests, host/keyboard and legacy-loaded computed styles; VIS-02. | Pending |
| AC-05 | Opt-in API is documented and distributed with all CSS to consumers without Tailwind. | Heading/Panel docgen/enhancer/Controls, type fixtures and packed React 18/19 tests; future `pnpm test`, `pnpm typecheck`, `pnpm lint`. | Pending |

### Decisions awaiting approval

- D1 — Panel-owned title part or Heading composition? **Recommended:** existing free PanelHeader plus `Heading variant='compact'`, because it preserves arbitrary header composition and native semantics.
- D2 — exact compact typography? **Recommended:** `text-heading-small` metrics with `font-display uppercase`, flagged as the nearest existing-token combination, because it supplies compact condensed text without a new token.
- D3 — foreground? **Recommended:** reuse #396's explicit foreground axis only on compact, defaulting to inherit, because Panel already supplies host text color and existing accent `tone` must not be overloaded.
- D4 — title association? **Recommended:** caller's `level`/`id` and enclosing `aria-labelledby`, because Panel neither owns the document outline nor creates a duplicate landmark.
- D5 — visual evidence? **Recommended:** require real Panel/Heading stories and captures in the implementation PR before merge, because the old Panel captures do not approve this new typography.

### Closure and dependencies

- Depends on [Text v0.2 / #396](../../text/v0.2/body-tone-amendment.md), including its reusable foreground mapping and type; approve/implement that dependency first. #418's accent edge and #425 token work are not prerequisites for this proposal.
- Exact cross-component contract, Heading naming exception and separate implementation plan need scoped approval; no implementation, new token, dependency, issue publication or consumer migration is authorized here.

## Approval

- **Status:** Approved 2026-11-17.
- **Authority:** the owner delegated these decisions to the parent's recommendations: "pues termina el 1 y luego el 2. Sigue hasta terminar ambos. Aplica las recomendaciones y mergea los prs. Puede paralelizar en hasta 3 subagentes hasta terminar" (owner session 2026-11-17, recorded in `odd/tasks/milestones-1-2-delivery.md` L1 and `odd/tasks/nexo-adoption-m2-specs.md` L1).
- **Resolution:** every open decision in this document resolves to its option marked **Recommended**. New or changed prop-naming conventions and scoped exceptions proposed here are approved together with this spec; registry entries and approval records are added in the implementation PR.
- **Not approved here:** new tokens or token value changes, new dependencies, and anything this document flags as out of scope; those stop for the owner.
