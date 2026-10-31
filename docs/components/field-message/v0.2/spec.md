# FieldMessage v0.2 — implementation contract

Five-tone control annotations, extracted from Field. Description is neutral gray; semantic messages have decorative status icons. Tone never validates a control or creates an announcement.

- **Status:** owner-approved API, staged plan, specimen and glyph/default decisions; this document consolidates those decisions, not a new per-payload approval receipt.
- **History:** [v0.1 draft](../v0.1/spec.md) remains unchanged. Its hint/error-only API, required id, derived live policy, empty shell and Notice recipe-sharing proposals are superseded here; they were draft proposals, not implemented APIs.
- **Issue:** [#179](https://github.com/egdev6/egdev-design-system/issues/179). Existing public naming clarification: [comment](https://github.com/egdev6/egdev-design-system/issues/179#issuecomment-6516552873). This v0.2 snapshot has not been published as an issue comment.
- **Approval scope:** [local decision record](approval.json); API and plan approval preceded visual adoption. No global naming, token/dependency, commit/push/PR or merge permission is implied.
- **Snapshot identity:** version 0.2; canonical contentSHA256: sha256:881ef5fd1560db536d0c10086145a98ea86c09399522c22abeba18ae6670f4ca. SHA-256 covers UTF-8 from the actual anchored `## 1. Purpose and scope` heading through EOF, LF including final newline, excluding this metadata.

## 1. Purpose and scope

- Extract a passive message atom into `@egdev/ui`, `packages/ui/src/atoms/field-message/`. It represents one readable explanation, not label/control coordination. Field retains that molecule responsibility.
- Reuse Icon and existing typography/status tokens. Text alone lacks this bounded tone/icon contract; a Notice variant would mix control guidance with surfaced notification/announcement responsibilities. Do not import the Notice molecule into the atom or change Notice/Toast.
- No validation, authentication, error inference, control rendering, actions, dismissal, focus movement, automatic announcements or separate Hint/ErrorMessage component.
- Inspected baseline: main `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`, Field types/hook/JSX/tests, Icon glyph data/types, Notice types and public barrels. Source, not stale Gauge-only prose, establishes importability.

## 2. Anatomy and composition

| Part | Element | Responsibility |
| --- | --- | --- |
| Root | `p.eg-field-message` | Native attributes, id, readable message and tone |
| Icon | Existing decorative Icon | Derived semantic glyph or explicit IconName override |
| Text | `span` | Required plain string with wrapping |

No new Radix package: passive text has no keyboard/focus interaction. Field keeps Radix Slot and Label unchanged. Root marker is public; no part-marker styling API, BEM engine or id-based styling. No public ref or asChild.

## 3. Public API

| Prop | Type | Rule |
| --- | --- | --- |
| children | string, required | No default; empty string renders null |
| tone | description / info / warning / success / error | Default description; presentation only |
| icon | IconName, optional | Explicit override; omitted icon derives from tone |
| className | Native string | Root outer margin, width and placement only |
| Native paragraph attributes | ComponentPropsWithoutRef<'p'>, children replaced | Forwarded to root; role/aria-live are explicit application opt-ins |

| Tone | Token utility | Omitted-icon result |
| --- | --- | --- |
| description | text-fg-muted | No icon |
| info | text-status-info | info |
| warning | text-status-warning | alert |
| success | text-status-success | circle-check |
| error | text-status-danger | circle-alert |

- Empty string yields no paragraph, icon or live shell. Whitespace-only text is a caller authoring error; no validation or trimming is introduced.
- New public exports: FieldMessage, FieldMessageProps, FieldMessageTone. Internal hook/CVA helpers are not barrel exports; no package subpath or appearance variant export.
- Controls: children=text, tone/icon=select, tone constant default=description; icon's derived defaults are prose, not a fabricated constant default.
- **Naming:** reuse `surface-material-tone` and `leading-icon` without widening their semantic payloads. `field-message-content` (children) and `field-guidance-tone` (Field.hintTone) are **proposed**, with no global approval. The latter describes subordinate guidance that loses to the existing error path, not a new generic root tone. No alias or change to approved convention semantics is introduced. Source hashes bind reviewed real props files; API consent is not global convention approval.
- React 18/19 support requires actual packed SSR/client checks, not types alone.

## 4. Behavior

| Change | Result |
| --- | --- |
| Non-empty text | Readable paragraph with optional/derived glyph |
| Empty text | No DOM shell |
| Tone changes | Update token treatment/glyph; retain root/id and external focus |
| Explicit icon | Replace derived glyph, still decorative |
| Native id | Forward unchanged; owner wires aria-describedby |

No state machine, generated standalone ids, callbacks, data-state, validation, control mutation, timers or announcement policy. Field owns relationship ids and its invalid state; standalone callers own their control wiring.

## 5. Accessibility

- This is description content, never a replacement for the control's accessible label. Supply meaningful text; color/glyph alone cannot explain the condition.
- Icon remains aria-hidden and non-focusable. No default role, aria-live or focus target. Error tone alone does not set any control's aria-invalid.
- Standalone native role/aria-live opt-in belongs to one application announcement owner; avoid duplicate live regions. Field remains non-live.
- No touch-target or keyboard pattern for passive text. Real assistive-technology speech remains a separate check, not a consequence of DOM assertions.

## 6. Appearance and visual adoption

- Root CVA: `eg-field-message m-0 flex items-start gap-1.5 min-w-0 font-sans text-label-default font-[var(--text-body-muted--font-weight)]`. Icon `size-4 shrink-0`; text `min-w-0`. Use cn per part.
- Typography preserves Field's 14px/400 annotation. Description is existing neutral gray; success is the existing aqua/teal token, not the source image's bright green. No new palette values.
- No surface, background, border, shadow, gradient, animation, translucent layer or dynamic geometry. FieldMessage does not recolor controls. Their Material and focus remain atom-owned.
- Field's outer wrapper owns layout and disabled opacity once; FieldMessage has no group-has disabled opacity. Supported root className merges last for outer layout, not arbitrary appearance overrides.
- Six meaningful files: types.ts, useFieldMessage.ts, FieldMessage.tsx, FieldMessage.test.tsx, FieldMessage.stories.tsx, index.ts. **No stylesheet.** No additional internal module, token or dependency.
- Icon expands only its closed enum/data by circle-alert, circle-check and info, sourced from installed lucide-react 1.55.0 (existing ISC attribution). No new package or unrelated glyph migration.

### Visual references

| ID | Reference | Scope |
| --- | --- | --- |
| SOURCE-01 | Owner-supplied Image#1 in the conversation | Direction: icon + semantic text beneath controls; capture metadata/source hash unknown |
| VIS-01 | [Field's historical board](https://raw.githubusercontent.com/egdev6/egdev-design-system/97677b286e39a2a7e4a9ce545e45613ac20b5bfc/docs/design/foundation-boards/v2026-10-17/Field.png), sha256:80af435a468eecb6ffd17b1b7187d06dc9015bd9d0b8477d874493ff88498df6 | Supporting text-only description/error rhythm, not new glyph/tone evidence |
| VIS-02 | [Five-tone specimen](field-message-five-tones.png), sha256:e062352f2575b76979b04899decb3acb218ac6b6fd85e7e1c2a656271f7a6b56 | Owner-adopted local specimen: description, all semantic tones, wrapping, choice and disabled |

VIS-02 is a real 1036×859 component-zone PNG from an authorized local HTML specimen, viewport 1100×950. [Metadata](capture.json) records Chrome156/Windows probe, DPR≈1, dark canvas, no reduced motion/transparency and font limitations. Barlow was not bundled; actual font file is unverified. Preview-only glyph sketches establish intended shape; runtime uses the inspected installed Lucide descriptors. No source-image dimensions/colors are invented or copied as tokens. Local adoption is not remote asset accessibility or production visual/AT conformity; those remain separately evaluated.

## 7. Acceptance and verification

| ID | Promise | Check |
| --- | --- | --- |
| AC-01 | Plain text/root/native id; empty string renders nothing | Component and SSR fixtures |
| AC-02 | Five token tones and derived decorative glyphs | Component/hook tests, CSS build, VIS-02 |
| AC-03 | Explicit icon override, no accessible-name duplication | DOM and type checks |
| AC-04 | No implicit announcement, validity or focus movement on tone update | Focus/ARIA tests and packed client |
| AC-05 | Field hint/error precedence and description/counter/Slider wiring preserved | Existing Field regressions plus integration cases |
| AC-06 | Field disabled annotation dimmed once; choice positioning intact | Wrapper invariants and separate browser inspection |
| AC-07 | Real metadata/controls, bounded exports and static CSS source | Docgen/enhancer/inference, build and exports |
| AC-08 | Public packed composition works without consumer Tailwind on React18/19 | Actual SSR/client/CSS consumer matrix |

Observed check results belong to the delivery report; this contract does not claim unrun gates or AT speech. Functional tests do not replace browser comparison with the adopted specimen.
