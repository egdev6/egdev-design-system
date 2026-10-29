# Component contract — FieldMessage

- **Version / status:** v0.1 — Draft; T4 / S7, issue #179. Specifications only.
- **Approval / recovery:** This file is the recoverable canonical snapshot; `.playwright-mcp/specs/iteration/field-message.md` is an identical draft copy. Agent-applied decisions are not exact-snapshot, convention or plan approval.
- **Current situation / pending decisions:** New atom, not an importable API. Field #84 and Notice #93 are related draft contracts, not implemented dependencies. Promise choices are applied; visual evidence, exact approval and the bounded peer amendments remain pending.
- **Snapshot identity:** `version: 0.1`; `contentSHA256: sha256:b2255eb2536a9ea950b460bbad715a9edd1582b4c20ad9b3de64f7ddac5d7637`; `visualHashes: Pending`; `approvalReference: Pending`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/179`; `latestPublishedComment: Pending — local snapshot, no comment published`.
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from `## 1. Purpose and scope` through EOF, LF endings and final newline; metadata above that heading is excluded.

## 1. Purpose and scope

- **Need / non-goals:** One form-control explanation with a decorative icon and readable text, in hint/error tones. The owner wires its id to the focusable control. No label, control rendering, validation, error inference, submit handling, focus movement, counter, view-level Notice actions or Toast lifecycle.
- **Cataloging decision / alternatives:** **Extract/new atom in `@egdev/ui`**, proposed `packages/ui/src/atoms/field-message/`. Reuse: Input/Textarea/Select deliberately exclude messaging; Label names a control but does not describe it. Variant: Notice is a view-level message with summary/detail/actions and its own live-region role, so a compact field variant would mix responsibilities. Composition in apps duplicates the same icon/text/tone across controls and future Field. Extract Field #84's planned message presentation into a single semantic explanation atom; Icon is decoration, not a separate coordinated control.
- **Evidence:** Read the existing issue bodies [Field #84](https://github.com/egdev6/egdev-design-system/issues/84) and [Notice #93](https://github.com/egdev6/egdev-design-system/issues/93), including their agent-applied decisions/API/behavior/appearance. Field D7 replaces hint with error; D9 explicitly has **no live region**; D16 uses native text, D15 specifies 14px token text with weight 400. Notice D2 derives status/alert from tone; D10 exports marker-free appearance; D14 insists on one announcement owner. Current `packages/ui/src/index.ts` exports Icon/Label/controls/Surface, but no FieldMessage/Field/Notice. `packages/ui/package.json` confirms no new package is required. Historical “Gauge only” statements in shared docs/issues do not describe current verified exports.

### Agent-applied decisions

- D1: Text API? → Required `children: string`, not another generic `text`, `hint`, `error` or `summary` prop. Empty/whitespace is supported as the deliberately empty live-region shell; it paints no icon/text and is not treated as a real message.
- D2: Tone/icon? → `tone="hint" | "error"`, default hint; decorative default Icon `bell` / `alert`. Optional leading `icon: ReactElement` replaces that glyph, never the semantic text. Icon-only and interactive content are unsupported. `icon={null}` is not a supported override.
- D3: Announcements? → Explicit native `aria-live`: derived `off` for hint and `polite` for error unless supplied as off/polite/assertive. No status/alert role or hidden second announcer. Non-off roots use `aria-atomic="true"`. Validation errors are not assertive by default. A populated initial mount or changing tone/live policy is not a reliable announcement pattern.
- D4: Wiring? → Required native `id: string`, supplied by consumer `useId()` (or a unique stable application id), identifies the message paragraph. Consumer/Field merges that id into control `aria-describedby` and supplies `aria-invalid` when appropriate. No DOM search, controlId prop, mutation of another element or return-id callback.
- D5: Compatibility with Field? → Preserve Field D9's non-live default by explicitly composing FieldMessage with `aria-live="off"`. Standalone callers can use the derived polite error policy. This is an intentional distinction, not a silent amendment giving Field automatic announcements.
- D6: Recipe ownership? → Small marker-free tone/icon/text recipes live in this atom's `types.ts`; Notice later imports them internally. Share paint/geometry and default icon mapping, not Notice's surface, summary/actions or live role. No atom-to-molecule import and no extra shared module are needed.
- D7: Surface/CSS? → No painted container: message is typography/icon in normal flow on its host. Controls retain their wells; Notice retains its own elevated/tinted surface. **No stylesheet**, no dependencies/tokens.

## 2. Anatomy and composition

| Part | Responsibility | Native element / primitive | Allowed content |
| --- | --- | --- | --- |
| Root | Describable message, id and sole optional live owner | `p` | Internal icon and text spans, or empty shell |
| Icon | Non-color cue repeating the message meaning | `span aria-hidden="true"` with `Icon` or supplied element | One decorative, non-focusable glyph |
| Text | Readable control explanation | `span` | Plain `children` string, escaped normally |

- **Radix:** None for passive text/live attributes; no interactive primitive is being reimplemented. Icon's current implementation supplies its own decorative semantics. No Slot, ref or asChild API.
- **Public markers:** New stable root `eg-field-message`; internal part markers are not a public selector/override API. Field keeps `eg-field`; Notice keeps `eg-notice` and its historical part markers. Neither peer emits FieldMessage's marker merely by reusing a recipe.
- **Composition:** Standalone: consumer calls `useId()`, passes the id to FieldMessage and includes it alongside pre-existing control descriptions. Field owns its generated message id and hint/error selection; the control keeps its own focus, input and Radix behaviors. No message wraps a label/control or nests a live Notice.

## 3. Public API

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| `children` | `string` | Yes | Empty allowed only as an empty shell | Plain explanation; no HTML/links/actions |
| `tone` | `'hint' \| 'error'` | No | `hint` | Selects semantic paint and default icon |
| `icon` | `ReactElement` | No | Derived: bell for hint, alert for error | Decorative leading replacement glyph |
| `id` (native, narrowed required) | `string` | Yes | Non-empty unique id | Used by the control's description relationship |
| `aria-live` (native, restricted) | `'off' \| 'polite' \| 'assertive'` | No | Derived by tone; no constant JSDoc default | Explicit owner-selected live policy |
| `className` (native) | `string` | No | None | Outer margin/width/alignment only |
| Own events | Not applicable | — | None | No validation or change event |

- **Native props / refs:** `Omit<ComponentPropsWithoutRef<'p'>, 'children' | 'id' | 'role' | 'aria-live' | 'aria-atomic' | 'aria-relevant' | 'aria-hidden' | 'tabIndex' | 'contentEditable' | 'dangerouslySetInnerHTML' | 'style'>` plus declared fields above. Compatible data/ARIA/native paragraph attributes reach the root. Component owns live/atomic semantics; unsupported overrides cannot add contradictory roles or hide meaningful text. No public ref, asChild, message-control event or focus API. A blank id is a caller error; diagnose in development, do not fabricate a relationship to a nonexistent element.
- **Controlled / uncontrolled:** Not applicable. A stable rendered paragraph receives consumer text updates; no buffering/debounce or duplicate hidden text.
- **Exports:** `FieldMessage`, `FieldMessageProps`, `FieldMessageTone`. Recipe exports in `types.ts` are package-internal, not barrel API. Use `type`, not `interface`/`any`.

### Prop conventions and reviewed evidence

Looked up meaning, names and aliases in [registry](../../../../skills/_shared/prop-naming.json), [generated view](../../../prop-naming.md), and [workflow](../../../../skills/_shared/component-contract.md#prop-naming-registry); no registry edits.

- Reuse `surface-material-tone` → `tone: FieldMessageTone`; `leading-icon` → `icon: ReactElement` (beside meaningful text, decorative, noninteractive). `children`, required native `id`, `aria-live` and `className` are native/React surfaces, not new proprietary conventions. No new naming proposal or scoped exception is needed.
- Rejected semantic lookups: `field-hint`/`field-error` are Field's input-message props; FieldMessage has one child text, not both; `message-summary` belongs to a Notice/Toast emphasized lead sentence and does not imply a separate summary here. `accessible-name` is not needed: a description is not a control name.
- Reviewed source for matching glyph-slot/tone meanings: `{path: packages/ui/src/atoms/badge/types.ts, symbol: BadgeProps, revision: sha256:81d97cd46835e08a2ed5d846d352642ef9230661b4dcfe04d7e4be921c7d6f3e}`. This validates the existing vocabulary, not a FieldMessage usage. `FieldMessageProps` has no implementation file yet; its future `{path: packages/ui/src/atoms/field-message/types.ts, symbol: FieldMessageProps, revision}` must use the real reviewed whole-file SHA-256, never this spec's digest.
- Convention approval remains separate from this draft; no global semantic widening, alias migration or approval record is asserted.

### Bounded peer amendments — proposed, not performed

**Field #84:** Keep `label`, hint/error precedence, native/control Slot conflict rules, counter, readout and no-ref contract. Replace D16's native message paragraph with FieldMessage using the existing generated message id, selected text and tone; pass `aria-live="off"` to preserve D9 and avoid new automatic validation speech. Error still sets the control invalid, replaces the hint and uses the same description id. Consumer descriptions remain child-first/deduplicated under Slot 1.5.0; FieldMessage neither changes that merge nor overwrites control attributes. Empty selection omits the described message id; no dangling references. New default bell/alert icon and 14px/600 label recipe replace D15's text-only 14px/400 line: an explicit visual delta needing amendment review, not automatic parity. Field's outer disabled wrapper dims once, not additionally inside FieldMessage.

**Notice #93:** Keep all public props, status/alert derivation, one-owner lifecycle, summary/detail/actions, Surface tint and Notice/Toast root recipe promises. Extract only reusable marker-free `messageToneVariants`, `messageIconVariants`, `messageTextVariants` and `messageDefaultIcons` into FieldMessage's `types.ts`; Notice imports them internally. Internal tone values: hint, neutral, info, success, warning, danger; map FieldMessage error → danger, hint → hint; Notice uses its existing tone. Color mapping is muted / secondary / status-info / status-success / status-warning / status-danger. Shared icon defaults: hint/neutral/info → bell, success → check, warning/danger → alert. Shared icon sizes compact `--space-4` and regular `--icon-size`; shared text recipes compact label-default and regular body-default, with min-width 0 and wrapping. FieldMessage uses compact only; Notice maps sm/md without a public API change. Recipes carry no root marker, surface paint, role, aria-live, summary emphasis or actions. Notice's surface-tint CVA remains in Notice; do not import `noticeVariants` into the atom or render Notice as a field error. Internal recipe names are specified responsibilities, not an extra file or ready-made implementation.

Later issue amendments must be separately authorized versioned comments on #84/#93; preserve their current bodies/history. No peer issue/files are changed by this task.

## 4. Behavior

| Initial state / action | Expected result | Event |
| --- | --- | --- |
| Non-empty default hint | Bell + muted text; explicit live off; id on paragraph | None |
| Non-empty error, no live override | Alert glyph + danger text; live polite, atomic true; no role | None |
| Error with `aria-live="off"` | Same visible error, no automatic live update | None |
| Persistently mounted error shell receives later text | Same live root/id, icon/text appear and content becomes a polite live update | None |
| First mount already populated / hint changes to error | Readable description; automatic initial speech is not guaranteed | None |
| Text becomes empty/whitespace | Root/id/live policy stay, icon/text removed; no empty decorative message | None |
| Control focuses | Its existing aria-describedby references this text; no focus moves to paragraph | Control event only |
| Tone/text changes | No validation inference, control mutation or callback | None |

- **State representation:** Tone in `data-tone`; no mirrored error/disabled state classes. Control validity belongs to native `aria-invalid`, not the message paragraph. Empty-shell rendering is content-derived, not an additional public lifecycle enum.
- **Limits:** Text must explain the error in words, not only “Error” without context. Caller owns localization, id uniqueness, invalid flags and description merging/removal. A message cannot both be a second live owner for an existing live summary and promise single-owner speech.

## 5. Accessibility

- Paragraph is description content, not a heading, control label, region landmark or alert by tone alone. Required id connects through `aria-describedby`; error examples additionally put `aria-invalid="true"` on the actual focusable control. Hint/error remain distinct from `aria-label` and never overwrite the visible label. No `aria-errormessage` is emitted by this atom; consumers needing it must separately test their control contract rather than double-linking blindly.
- Native `aria-live` is the only optional announcement mechanism. Polite error updates use a stable empty error paragraph mounted **before** the message update with the same key/live policy; the paragraph remains in the DOM when text clears. No hidden announcer, focus jump or role-switch trick. First inserted populated messages, initial SSR errors and switching off→polite have no universal speech guarantee. Field's default explicit off uses focus/description/error-summary handling owned by the form instead.
- Use assertive only for a genuinely urgent exceptional condition; do not nest in another live region or duplicate the same update in Notice/Toast. Structural DOM tests cannot verify screen-reader speech or exactly-once announcements. Test real browser/AT combinations separately.
- Decorative icon is aria-hidden and never focusable. Text carries non-color meaning; long messages wrap at narrow widths/zoom. No target-size requirement on passive text; control targets and focus remain control-owned. Do not dim once here and again in Field's disabled wrapper.

## 6. Appearance

| Axis | Values | Default / restriction |
| --- | --- | --- |
| tone | hint, error | hint; icon and color mapping above |
| size | Fixed compact recipe, not a public prop | label-default text; icon --space-4 |
| Live policy | off, polite, assertive | Semantic only; never changes paint |

- **Tokens / Material:** No message background, border or shadow is introduced; the text/icon sit on the owning Material surface. Proposed root static utilities: flex, items-start, gap-1.5 (fractional step from `--space-1`), min-w-0, font-sans, text-label-default. Icon shrink-0, `size-4`; text min-w-0 and overflow wrapping. Hint `--color-fg-muted`, error `--color-status-danger`. This uses inspected existing color/spacing/font tokens; no 13px/15px substitute, handwritten shadow/gradient, inline appearance or token addition. Shared recipes own only the narrow color/icon/text responsibilities described above.
- **Motion / transparency / geometry:** Static text/icon: no motion, blur or overlay recipe; no reduced-transparency fallback needed. Control wells and Notice overlays/elevation remain their owners' responsibility. No numeric geometry or Gauge exception.
- **Class composition:** CVA definitions in `types.ts`, hook calls per-part CVA and `cn()`. Root className permits outer margin/width/alignment, not tone, hidden text, font replacement or arbitrary part paint. No public part className API. Assert supported margin merge and retained marker/recipe invariants; twMerge is not universal CSS precedence.
- **Six files:** `types.ts` (own/native types and shared marker-free recipes/default icon map); `useFieldMessage.ts` (typed live/icon/empty derivation, per-part cn and id diagnostic); `FieldMessage.tsx` (JSX only); `FieldMessage.test.tsx`; `FieldMessage.stories.tsx` (`Atoms/FieldMessage`, autodocs, no play); `index.ts` (named public exports, no internal recipe exports). **No stylesheet.** No extra module, dependency or token. Own JSDoc controls: select tone; false + concrete custom-icon story reason for ReactElement icon; text for redeclared string children/id; inherited aria-live is not redeclared solely for controls. Derived defaults are prose, not fabricated @default tags.

### Expected-design visual reference

| Visual ID | Real image / English description | Scenario | Source / version | Status |
| --- | --- | --- | --- | --- |
| VIS-01 | Pending — a labelled control with hint, invalid error, and wrapped long error | Principal hint/error rows and small width | Field #84 + Notice #93 textual contracts; new composition, no captured design | visual reference: pending |
| VIS-02 | Pending — matching icon/text tone between FieldMessage and compact Notice | hint/neutral and error/danger mapping | Proposed shared recipe; existing Notice visuals are not this new atom | Proposed, no adopted image |

- Playwright MCP unavailable; no capture, synthetic image or visual hash. Viewport, DPR, browser/version, theme/fonts, motion/transparency, crop and capture date are unrecorded. Future captures must record actual component-zone conditions under this version directory. VIS-01 maps AC-01/02/07; VIS-02 maps AC-06. **visual: not evaluated**. No image can prove live speech or control wiring.

## 7. Acceptance criteria

| ID | Observable promise | Planned test / method | Story / visual | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | Defaults yield hint/bell/text, error yields alert glyph/danger; custom icon remains hidden | FieldMessage.test.tsx render and semantic queries; no full class snapshots | Default, Error, CustomIcon; VIS-01 | Planned, not run |
| AC-02 | Native id reaches paragraph; descriptions preserve existing ids and invalid flags live on the control | Standalone integration with Input/Textarea/Select; multiple-instance useId checks | WithInput, WithTextarea, WithSelect; VIS-01 | Planned, not run |
| AC-03 | Empty→text→empty keeps live root/id; off/polite/assertive and atomic semantics are correct with no duplicate announcer | Rerender/root identity and attribute tests; real screen-reader lifecycle matrix | MountedErrorUpdates, InitialError, SilentError | Planned; no speech claim |
| AC-04 | Field remains non-live by default; error replaces hint and no dangling description survives removal | Future Field.test.tsx integration, Slot child-precedence fixtures | FieldInvalid, FieldHint, Disabled | Field #84 conflict reviewed; no peer amendment executed |
| AC-05 | Message never validates, changes control value/focus, creates a focus stop or emits events | UserEvent/focus/native value assertions; source inspection | WithInput | Planned, not run |
| AC-06 | Shared recipes contain no markers, surfaces or semantics; Notice keeps existing tones/roles/API/Toast reuse | Direct recipe tests and future Notice/Toast integration; no circular molecule dependency | SharedTones; VIS-02 | Notice #93 reviewed; implementation pending |
| AC-07 | Long text/zoom wraps; single disabled opacity, tone contrast and supported merge invariants hold | CVA/cn, computed CSS, narrow/zoom/contrast and disabled-host checks | LongError, Tones; VIS-01 | Planned, not run |
| AC-08 | Bounded exports/types/JSDoc and shipped static CSS work without consumer Tailwind | AST/docgen/enhancer/browser Controls, CSS build/scan, packed React 18/19 consumer | Default, CustomIcon | Planned, not run |

### Spec closure

- [x] Seven blocks and recommended promise choices complete; atom responsibility and no-Radix decision justified.
- [x] Registry lookup/reuse recorded; no new conventions, exceptions or registry edits.
- [x] Field's non-live default and Notice's separate live owner are explicitly reconciled.
- [ ] Peer amendment review, real visual evidence and exact-snapshot approval pending.
- [ ] Implementation plan approval remains separate; runtime behavior is unverified.

**Next step:** review this draft and its bounded Field/Notice amendments, capture/adopt real visuals, then approve an implementation plan independently. No component code, dependency/token changes, peer issue mutation or commit is authorized here.
