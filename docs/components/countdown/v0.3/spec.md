# Component contract — Countdown v0.3 amendment: the web deadline format is a consumer mapping

- **Version / status:** v0.3 — **Draft amendment** of the approved v0.2 contract. Owner review happens in issue #82. It **changes no API and no approved promise**: it closes the cataloged delta "deadline format" as a consumer mapping and records the one web behaviour that the component deliberately does not own.
- **Approval / recovery:** v0.2 is the approved contract (canonical `21e0f43e349a19ce18a5f26995320ecbf8d9ca6d4c20f5f7b64fe3325c05d93d`, frozen body `2b9ca3b78b757483b4fd05729d07143f1f70c920f215546a87694912f63da64b`, [v0.2 amendment comment](https://github.com/egdev6/egdev-design-system/issues/82#issuecomment-6244024571), [owner full-contract approval](https://github.com/egdev6/egdev-design-system/issues/82#issuecomment-6251498632)). v0.3 is **Pending**: no agent may treat this file as approved.
- **Current situation / pending decisions:** an existing atom in `packages/ui/src/atoms/countdown/`, implemented and exported. The approved web catalog review opened one Countdown row — "API deltas (deadline format …); likely documentation, not new props — to confirm per spec" ([cataloging draft §3](../web-catalog/v0.1/cataloging-draft.md), owner approvals 2026-11-02). The confirmation reached here is that the delta is documentation: v0.2 D1 already resolves calendar and timezone conversion before the prop, and v0.2's non-goals already exclude stopwatch/past-duration display and business scheduling. Two owner choices stay open and are not blocking for that conclusion: Q1 (accept the documentation-only outcome, with Q2–Q5 as its detail) and Q2 (where the web's live elapsed readout should live).
- **Snapshot identity:** `version: 0.3`; `contentSHA256: 399c15eb7a22279fd02b0fc3e0fab2bc50f4a230a1851247bbba12f1439b9da0`; `visualHashes: VIS-01 f1c1c2fa94bf7a256e3523b12800af5b58486b4a415311b1a8402ce350dd7f76 (reused approved v0.1/v0.2 reference); VIS-02 c4253fad0ba30fe6d48375854aa35bb7472f0e1bc947e888e8d74d90f5d34ea4 (reused approved v0.1/v0.2 reference); VIS-03 9828d649237a45060f93e325cb2956405007eda402cb879b6668afcd121f77af; VIS-04 4ec944512f2f714051027ea05d9777705f34b1b5772d7692dab6623e272829ba; VIS-05 e43e39f3d13480eed045fb70fb26952ff1e6d82c9c86c5dd04d66b5a63e05688; VIS-06 b400585d5516124900a18f5ddef260ba13325a45deaadc4c501589f025944a00`; `approvalReference: Pending (v0.3 Draft)`; `canonicalIssue: https://github.com/egdev6/egdev-design-system/issues/82`; `latestPublishedComment: Pending (this snapshot is prepared, not posted)`.
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from `## 1. Purpose and scope` through EOF, with LF line endings and the recorded final newline. The tracking metadata above that heading is excluded.

---

## 1. Purpose and scope

**Delta against approved v0.2.** v0.2 ships one passive atom in `@egdev/ui` (`packages/ui/src/atoms/countdown/`): required `deadline` (safe-integer Unix milliseconds, UTC year 1–9999, nothing coerced) plus required `deadlineText`, optional `label`, `units`, `size`, `tone`, `onExpire`, `initializingText`, `expiredText` and `unavailableText`; a `role="timer"` readout that samples the client clock only after mount, keeps `aria-live="off"`, latches one expiration episode and notifies `onExpire` at most once per episode. Its decisions D1–D12 are unchanged by this version.

- **Need / non-goals:** the need is a **confirmation plus a written mapping**, not a new promise. The web's Countdown takes an ISO `target` string, Spanish default copy and two boolean modifiers; the design system takes an instant in milliseconds, a caller-supplied readable date and two closed value axes. Nothing in the web's *input surface* is missing; what differs is who resolves the calendar, who owns the copy and who renders the readable date. v0.3 records that split, the exact value mapping and the capture evidence, and proposes **no API change**. Non-goals: an ISO-string `deadline`, a `Date` overload, a timezone/schedule prop (already excluded by v0.2 D1 and its non-goals), a `small`/`onDark` boolean pair (D10 replaced them with `size`/`tone`), an "elapsed"/count-up mode, an announcement or `aria-live` change (D8), a localized default copy set, a new story that only renames existing arguments, a stylesheet, and any token or dependency change.
- **Cataloging decision / alternatives:** **reuse without change**, the first step of `docs/CATALOGACION.md`, after inspecting the public React API (not CSS, catalog rows or stories). *Variant* is rejected: the cataloged "deadline format" delta is an input encoding, and a variant would add a second way to express the same instant (`target?: string` beside `deadline: number`) with no new responsibility, while duplicating the DST/calendar handling that v0.2 D1 deliberately keeps outside the component. *Compose* is rejected: a wrapper that parses ISO strings would move a one-line `Date.parse` into the design system and still call the same prop. *Extract* and *new* are irrelevant: nothing is hidden and no second responsibility appears. The step that actually existed was documentation.
- **Evidence / level and package:** atom in `@egdev/ui`, folder `packages/ui/src/atoms/countdown/`. Inspected as whole files in this working tree (2026-11-02): `types.ts` (whole-file `sha256:35d8c209c7aa249f4a78bb3c0c8c1154dd34affed22529cff4af8e134b97908e`), `useCountdown.ts` (`0ae4e169a60c1acc4112f6d317bc92689d75dc4850ce8ac5be8ec1947c76d302`), `Countdown.tsx`, `Countdown.test.tsx`, `Countdown.stories.tsx`, `index.ts`; `docs/components/countdown/v0.2/implementation-evidence.md` (shipped behaviour and acceptance evidence); issue #82 body (v0.1 decisions D1–D12), its v0.2 amendment comment and its owner approval comment. Read-only web evidence (owner-granted; nothing written there): `reference-web/pulso-source.html` (`sha256:778e5412b64d1b79195c51c0e47c78f654b46da445be8354a97e572774348f13`), `design-system/components/Countdown/README.md` (`3ee46986b6ea651ce8dd9c96283b4ee50cbb718d0b9aef2d921ace98662aa9da`), `design-system/components/Countdown/preview.html` (`7b9a43acf659ecdafcddf116ebde3a9e7a447db177116e5108a7657686860466`), `design-system/components/LiveBand/README.md` (`5350c5771a5009412204fad1563fe1dec15f6a11650233a1a915c8a5eb3b92fd`), `design-system/components/NowCard/README.md` (`3a8b8a674d6158d48a70182f5107befe8a1cf7011b06b954a26a29b3b9253abc`), `design-system/tokens.css` (`1c92acb850695d6093e7e3eb988d66152ffd7bb1592dba744f8433d9051da30e`), `design-system/components/bundle.css` (`04797068bfc9de49a02b8fbdb54c12e336f19dae04a1616ce23fd8bf8c2d70fe`), `design-system/components/index.d.ts` (`b136dca56066fad8dbde0d425e256e2be3d82a408b9c79b59ae7a935f4ed2501`).

**What the web feeds in, and where each input lands.**

| Web input (`components/index.d.ts`, README) | Design-system equivalent (shipped) | Status |
| --- | --- | --- |
| `target: string` (ISO instant) | `deadline: number` (Unix ms) | **Same instant, different encoding.** The caller converts: `Date.parse(target)` or an API-supplied epoch. v0.2 D1: "consumers resolve any calendar/timezone/DST conversion before supplying it". Documented here, no API change. |
| — (web writes the readable date outside the widget) | `deadlineText: string`, required, rendered in a native `<time>` | The web's readable date is the band caption `.band-next` ("Miércoles · 18:00") and `#nextDate` in the Streaming NowCard. Both are exactly the string `deadlineText` expects; the caller passes it and also keeps its own copy where the page shows it. |
| `label: string` = `"Próximo directo en"` | `label?: string`, default `"Next event in"` | **Copy is consumer-owned.** The Spanish default is domain copy; the host passes it. |
| `units: [string ×4]` = `["días","horas","min","seg"]` | `units?: CountdownUnits` (fixed order, no pluralisation) | The caller passes the Spanish tuple (`["días","horas","min","seg"]`); the design system never ships localized defaults. |
| `small: boolean` (`--sm`) | `size?: 'md' \| 'sm'` (default `md`) | Same effect, closed axis (D10). |
| `onDark: boolean` (`--on-dark`) | `tone?: 'inherit' \| 'canvas'` (default `inherit`) | Same effect, closed axis (D10). `inherit` is the black-on-flood case the LiveBand uses. |
| — | `initializingText`, `expiredText`, `unavailableText`, `onExpire`, `aria-describedby` merge | Design-system additions with no web counterpart; the web always starts at `0` and has no unavailable state. |

**The one web behaviour that is not an input mapping.** Past the start instant the web's tick switches the same widget to a *counting-up* readout and rewrites its label ("En directo desde hace" instead of "Próximo directo en"): see VIS-05, reached with a frozen clock instead of a real Wednesday window. That is a past-duration display, which the approved v0.2 contract already lists as a non-goal ("stopwatch, past-duration display"), together with the weekly Wednesday 18:00 Europe/Madrid schedule and its 18:00–20:00 live window, which are business scheduling. Neither becomes an input here; Q2 records the recommendation for where it belongs.

## 2. Anatomy and composition

Anatomy is unchanged from v0.2. The table restates it so the mapping above can be read against a concrete structure; the last column notes the web counterpart that differs.

| Part | Responsibility | Native element / Radix primitive | Allowed content | Web counterpart |
| --- | --- | --- | --- | --- |
| Root | Named passive timer, lifecycle state and description relationships | `div.eg-countdown`, `role="timer"`, `aria-live="off"` | Generated parts only | `.cd` with `role="timer" aria-label` (VIS-03); the web's separate `aria-label` becomes the visible `label` that names the root here |
| Label | Visible timer name | `p.eg-countdown__label` with a `useId` id | Non-empty `label` string | `.cd-label` (same shape; the web rewrites its text when live) |
| Unit row | Remaining numeric amount, rendering and expired only | `div.eg-countdown__row`, **not** `aria-hidden` | Four unit spans in day/hour/minute/second DOM order | `.cd-row` carries `aria-hidden="true"` — a recorded divergence (§5) |
| Unit / value / name | Tabular value plus its localized unit label | `span.eg-countdown__unit` containing value and name spans | Derived non-negative integers and the `units` tuple | `.cd-row > span > b + i` |
| Absolute deadline | Stable readable date and time, valid deadline only | `time` with a `useId` id and UTC ISO `dateTime` | `deadlineText`, or the deterministic ISO fallback when blank | No `time` element; the readable date lives in `.band-next` and `#nextDate` (VIS-04) |
| State message | Initializing, expired or unavailable explanation | Plain `p` with a `useId` id; no live or status role | Resolved `initializingText`/`expiredText`/`unavailableText` | None; the web has no placeholder, expired or unavailable state |

- **Radix / composition:** none applies to a passive clock readout; no dependency is added. `Text`/`Heading` are not composed: their variants do not express countdown numerals (D11). The web's LiveBand composition — countdown inside a flood field, with a CTA and a photo — stays a consumer composition; the atom paints no panel, border, shadow or field.
- **Public markers:** `eg-countdown` plus `eg-countdown__label`, `__row`, `__unit`, `__value`, `__name` are preserved exactly as shipped. Legacy `.eg-countdown--sm`/`--on-dark` modifiers are never emitted by the React component. The web's `data-cd` demo hooks in the Foundation preview are not adopted.

## 3. Public API

**No prop, type, default or export change is proposed in v0.3.** The table restates the shipped v0.2 surface so this amendment is self-contained.

- **Prop conventions:** registry source `skills/_shared/prop-naming.json`, generated view `docs/prop-naming.md`, consulted by meaning, name and aliases. Ten approved conventions already carry a `CountdownProps` usage whose recorded `source.revision` was re-verified byte-for-byte against this working tree on 2026-11-02 (`packages/ui/src/atoms/countdown/types.ts`, `sha256:35d8c209…`): `accessible-name` (`label`), `preset-dimensions` (`size`), `surface-material-tone` (`tone`), `deadline-instant` (`deadline`), `absolute-deadline-text` (`deadlineText`), `time-unit-labels` (`units`), `deadline-expiration` (`onExpire`), `clock-initialization-message` (`initializingText`), `expired-deadline-message` (`expiredText`) and `unavailable-measurement-message` (`unavailableText`). No usage is stale, so no registry revision or generated-view refresh is required by this version.

| Prop / event | Type | Required | Default or rule | Description (unchanged v0.2) |
| --- | --- | --- | --- | --- |
| `deadline` | `number` | Yes | None; safe integer Unix ms with UTC year 1–9999 | The instant the caller resolved from its own date, timezone or schedule logic. Non-conforming input renders `unavailableText` and runs no clock. `@control number` |
| `deadlineText` | `string` | Yes | None; blank warns and falls back to the UTC ISO string | Human-readable date, time and timezone, rendered in a `<time>`. This is the web's `.band-next` / `#nextDate` string. `@control text` |
| `label` | `string` | No | `Next event in` | Visible label that also names the timer. The web's Spanish copy travels through here. `@control text` |
| `units` | `CountdownUnits` | No | `['days','hours','minutes','seconds']` | Fixed order, no pluralisation. `['días','horas','min','seg']` reproduces the web. `@control false` |
| `size` | `'md' \| 'sm'` | No | `md` | Replaces the web's `small`. `@control select` |
| `tone` | `'inherit' \| 'canvas'` | No | `inherit` | Replaces the web's `onDark`; `inherit` is the black-on-flood case. `@control select` |
| `onExpire` | `(deadline: number) => void` | No | Absent | At most once per client-observed episode; the hook a host uses to switch from "next event" to "live now" presentation. `@control false` |
| `initializingText` | `string` | No | `Calculating time remaining` | Pre-sample placeholder with no digits. `@control text` |
| `expiredText` | `string` | No | `Time reached` | Non-live explanation beside the zero readout. `@control text` |
| `unavailableText` | `string` | No | `Time unavailable` | Invalid-deadline fallback. `@control text` |
| Native props / `className` | `CountdownNativeProps` | No | Forwarded to the root only | `id`, `dir`, `lang`, `data-*`, compatible `aria-*`; `aria-describedby` merges with the internal ids; protected semantics are discarded |

```ts
export type CountdownSize = 'md' | 'sm';
export type CountdownTone = 'inherit' | 'canvas';
export type CountdownUnits = [days: string, hours: string, minutes: string, seconds: string];

export type CountdownProps = CountdownNativeProps & {
  deadline: number;
  deadlineText: string;
  label?: string;
  units?: CountdownUnits;
  size?: CountdownSize;
  tone?: CountdownTone;
  onExpire?: (deadline: number) => void;
  initializingText?: string;
  expiredText?: string;
  unavailableText?: string;
};
```

- **New convention proposals:** none. The cataloged "deadline format" delta is an encoding of the already-approved `deadline-instant` convention (`deadline`), not a second concept; no `target`, `isoDeadline`, `countUp`, `elapsed` or `timeZone` concept is proposed here.
- **Exceptions:** none new. The approved `unavailable-measurement-message`, `deadline-instant`, `absolute-deadline-text`, `time-unit-labels`, `deadline-expiration`, `clock-initialization-message` and `expired-deadline-message` entries keep their recorded bytes and approvals.
- **Native props / refs:** `ComponentPropsWithoutRef<'div'>` minus the protected timer semantics; no ref, no `asChild`, no children API (D12). The root `className` is layout only.
- **Controlled / uncontrolled:** Not applicable — the component owns its clock; there is no `value`/`onChange` pair and no `now` seed (D3).
- **Compatibility:** no public export, marker, class, default or behavioural promise changes; `Countdown`, `CountdownProps`, `CountdownSize`, `CountdownTone` and `CountdownUnits` stay the whole public surface and the CVA recipes stay private. No registry byte moves. The web can adopt the atom with a conversion at the call site only.

## 4. Behavior

Behaviour is unchanged from v0.2. The rows below restate the observable states and add the web-facing limit.

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| Server render, then first client render | `initializingText` with no digit row; no clock read during render | None |
| First client sample, future deadline | `running`: ceil-based day/hour/minute/second fields, sampled at most every 1000 ms and on `visibilitychange` | None |
| Deadline reached (also already past at mount) | `expired`: one zero readout, `expiredText`, resources released, latch kept for that deadline | `onExpire(deadline)` once per episode |
| Invalid `deadline` (string, `Date`, fraction, non-finite, out of range) | `unavailable`: `unavailableText`, no row, no `time`, no timer, no listener, no callback | None |
| Deadline changes / A→B→A / invalid interlude | New episode, no previous digits under the new deadline, rearmed notification | `onExpire` for the new episode only |
| Host switches from "next event" to "live now" | Out of scope: the component renders remaining time only. A host that wants an elapsed readout after `onExpire` renders it itself (Q2) | `onExpire` is the only signal |

- **States / representation:** `data-state="initializing" | "running" | "expired" | "unavailable"` plus native semantics; never mirrored state classes. The web's live/offline pair is **not** a component state — it is the host's branch that also changes the label and the surrounding signal pill.
- **Limits / consumer responsibilities:** the caller resolves the instant from its schedule (weekly Wednesday 18:00 Europe/Madrid, an API timestamp, a CMS date), supplies the readable `deadlineText`, and owns the copy in `label`/`units`; the caller announces expiration once if it wants an announcement (D8), and must not wrap the ticking widget in an ancestor live region. Past-duration/elapsed rendering, stopwatch behaviour, timezone selection, calendar arithmetic, network time synchronisation and authoritative scheduling are explicit non-goals of v0.2 and stay consumer responsibilities. `Date.now()` is the client wall clock, not server truth.

## 5. Accessibility

Unchanged from v0.2; this version records one deliberate divergence from the web source so nobody "fixes" it back.

- **Accessible name / roles / relationships:** `role="timer"` named by `aria-labelledby` pointing at the visible label, with the `time` and state-message ids appended to `aria-describedby`. The web instead uses a static `aria-label` ("Cuenta atrás al próximo directo") that does not mention the deadline and hides the digit row from assistive technology (`aria-hidden="true"`, visible in VIS-03/VIS-05). The design system keeps the digits **inspectable** and sets `aria-live="off"` instead (v0.2 D8); copying the web's `aria-hidden` would remove the value from the accessibility tree and is not adopted.
- **Keyboard / focus:** Not applicable — no tab stop, no controls, no roving focus (asserted by the shipped "passive readout without a tab stop" case).
- **Announcements / other conditions:** no per-second, expiry or status announcement; no `status`/`alert` role. `onExpire` lets the application perform its own once-only announcement. The state is never conveyed by colour alone: the expired and unavailable states are text. Contrast of the digits over the host field is the host's responsibility; the LiveBand case paints black on the flood field (`--color-fg-on-flood`), which is what `tone="inherit"` preserves.

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| `size` | `md`, `sm` | `md` | Digit scale only; replaces the web's `--sm` |
| `tone` | `inherit`, `canvas` | `inherit` | `inherit` keeps the host foreground (black on flood); `canvas` uses white digits with secondary labels |
| State | `initializing`, `running`, `expired`, `unavailable` | `initializing` | Owned by `data-state`; the web has only the running state |

- **Tokens / Material:** no component-painted panel, border, shadow, glow, overlay or field — the atom is transparent and the host owns the field (D11). The shipped recipes are token utilities in `types.ts` composed per part through `cn()`: digits `text-countdown-md` / `text-countdown-sm` with `tabular-nums` and `min-w-countdown-unit`; column gap `gap-x-countdown-column` with a `gap-y-2` wrap; label and unit names `text-label-eyebrow uppercase`; the deadline and state message `text-body-default`. The four countdown tokens were approved for this component in #82 and carry the source clamps at the repository's recorded 80% token scale (#218): `--text-countdown-md` = `clamp(41.6px, 4.8vw, 76.8px)`, `--text-countdown-sm` = `clamp(28.8px, 3.2vw, 44.8px)`, `--spacing-countdown-column` = `clamp(11.2px, 1.76vw, 25.6px)` and `--spacing-countdown-unit` = `1.9ch`; line-height 0.85, weight 800 and tabular figures match the source exactly. No token value changes here and none is proposed.
- **Dynamic geometry:** Not applicable. No inline style, no custom property, no interpolated class string; the fluid digit scale lives in the approved `--text-countdown-*` clamp tokens.
- **Class composition / consumer layout:** root `className` merges last through `cn()` for outer layout only; the part recipes win over conflicting consumer utilities where `twMerge` recognises the conflict, which is a documented limitation, not an appearance-override API. The field, spacing and placement around the readout are host layout.
- **Files / pending proposals:** the six mandatory files keep their roles — `types.ts` (props, types, private CVA recipes), `useCountdown.ts` (clock, episode lifecycle, derivation, composition), `Countdown.tsx` (JSX), `Countdown.test.tsx`, `Countdown.stories.tsx`, `index.ts`. **No stylesheet**; no internal module; no dependency. Planned, separately approvable documentation-only work if Q1 is accepted: say in the `Default` story and the meta description that `size`/`tone` replace the source `small`/`onDark` and that `deadlineText` carries the readable date. No new story (the nine existing stories already cover the states), and no catalog row change for a reuse conclusion.

### Visual delta (observed, measured)

| Property | Web live-band countdown (VIS-03/VIS-05) | Foundation `.eg-countdown` (VIS-06) | DS `size="md" tone="inherit"` | Delta / decision |
| --- | --- | --- | --- | --- |
| Label recipe | Barlow Condensed 800, 15px, tracking 1.8px, uppercase | 15px/800, same | `text-label-eyebrow` = 11.2px/700, tracking 0.12em, uppercase | The approved eyebrow recipe at the recorded 80% token scale (14px ×0.8, #218) instead of a source-specific 15px/800 |
| Digit recipe at `md` | 76.8px at a 1280px viewport (`clamp(52px, 6vw, 96px)`, line-height .85) | 52px at the 720px board (same clamp) | `--text-countdown-md` = `clamp(41.6px, 4.8vw, 76.8px)`, line-height 0.85 | Same clamp recipe at the recorded 80% scale (#218); line-height, weight and tabular figures unchanged |
| Digit recipe at `sm` | not used on the page | 36–56px clamp (`--sm`) | `--text-countdown-sm` = `clamp(28.8px, 3.2vw, 44.8px)` | Same recipe at the 80% scale |
| Column gap | `clamp(14px, 2.2vw, 32px)` = 28.16px at 1280px | same | `--spacing-countdown-column` = `clamp(11.2px, 1.76vw, 25.6px)` | Same recipe at the 80% scale |
| Minimum digit measure | `min-width: 1.9ch` (67px at `md`) | same | `--spacing-countdown-unit` | None; the columns do not jitter |
| Row top margin | 10px | 10px | `mt-2.5` = 10px | None |
| Unit-name top margin | 8px (`--space-2`) | 8px | `mt-2` = 8px | None |
| Foreground | `color: inherit` → black on the flood field | same; `--on-dark` for white | `tone="inherit"` / `tone="canvas"` | Same intent, closed axis |
| Readable date | outside the widget (`.band-next`, `#nextDate`) | none | required `deadlineText` in a `<time>` | **Divergence**: the DS requires the readable date as an input (Q3) |
| Digit row exposure | `aria-hidden="true"`, static `aria-label` | same | inspectable row, `aria-live="off"`, name from the visible label | **Divergence**: the DS keeps the value readable (D8), not adopted from the web (Q5) |
| Live/elapsed branch | counts up and rewrites the label past the start | none | none (non-goal) | **Divergence**: stays with the host (Q2) |
| Placeholder / expired / unavailable | none (starts at `0`) | none | `initializingText`, `expiredText`, `unavailableText` | DS additions; the host supplies localized strings |

### Expected-design visual reference

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | [`docs/design/foundation-boards/v2026-10-18/Countdown.png`](../../../design/foundation-boards/v2026-10-18/Countdown.png) — "The approved Countdown board: the default readout on a red flood field, the on-dark variant and the small variant" | Board rows: default (inherit on flood), `--on-dark`, `--sm` | Foundation `components/Countdown/preview.html`, board set v2026-10-18; **reused historical capture** | Approved as v0.1 expected design (owner full-contract approval in #82); reused unchanged in v0.3 and not a fresh capture |
| VIS-02 | [`docs/design/foundation-boards/v2026-10-18/specimens/countdown--specimen.png`](../../../design/foundation-boards/v2026-10-18/specimens/countdown--specimen.png) — "The Countdown specimen: default, on-dark and small readouts with unit columns" | Specimen sheet | Foundation `components/Countdown/specimens`, board set v2026-10-18; **reused historical capture** | Approved in the same record; reused unchanged |
| VIS-03 | `public--live-band-countdown--1280x900--dark.png` — "The live band countdown in the Pulso page: the label 'Próximo directo en' above four tabular columns reading 2 days, 04 hours, 43 minutes and 06 seconds over the Spanish unit names, all black on the red flood field." | Rendered countdown, offline branch, rest | `reference-web/pulso-source.html` `778e5412…`, capture v0.3-capture-1 | Proposed; source evidence of the role, not approved expected design for the DS recipe |
| VIS-04 | `public--now-card-next-date--1280x900--dark.png` — "The footer of the Streaming NowCard: 'Siguiente: 04 NOV · 18:00' beside a rounded-square Twitch icon button, the readable next date written by the same tick that drives the countdown." | Rendered `.now-card .foot` with `#nextDate` | `reference-web/pulso-source.html` `778e5412…`, capture v0.3-capture-1 | Proposed; evidence that the readable date is supplied as text outside the widget → `deadlineText` |
| VIS-05 | `public--live-band-countdown-live--1280x900--dark.png` — "The same countdown with the page clock frozen at Wednesday 18:30 Europe/Madrid: the label now reads 'En directo desde hace' and the columns show 0 days, 00 hours, 30 minutes and 02 seconds of elapsed time." | Rendered countdown, live branch, reached with a frozen clock | `reference-web/pulso-source.html` `778e5412…`, capture v0.3-capture-1 | Proposed; evidence of the behaviour the DS does not own (Q2) |
| VIS-06 | `foundation-preview--variants--720x480--dark.png` — "The Foundation Countdown preview board with four cells: default on the red flood field, on-dark, small on-dark, and small on the flood field, each reading 2 days, 04 hours, 37 minutes and 10 seconds." | Foundation preview: default, `--on-dark`, `--sm --on-dark`, `--sm` on flood | `design-system/components/Countdown/preview.html` `7b9a43ac…`, capture v0.3-capture-1 | Proposed supporting reference; shows the documented modifiers that map to `size` and `tone` |

- **Conditions / provenance per VIS ID:** all new captures: playwright-core 1.60.0 driving Chromium 153.0.8010.12 (`chrome-headless-shell`) headless on Linux x86_64, `file://` loading, color scheme dark, `reducedMotion: no-preference`, device scale factor 1, `--force-color-profile=srgb`, `--hide-scrollbars`, taken 2026-11-02. VIS-03/VIS-04/VIS-05: viewport 1280×900; Barlow 600/700, Barlow Condensed 800 and JetBrains Mono 500 confirmed loaded; all `[data-reveal]` nodes forced to their revealed state plus 900 ms; VIS-03 and VIS-05 are a padded clip of the `.cd` element (634×153), VIS-04 is the element crop of `.now-card:nth-of-type(3) .foot` (349×51). VIS-05 additionally installs a frozen browser clock at `2026-11-04T17:30:00Z` (Wednesday 18:30 Europe/Madrid) before navigation and advances it 1.2 s, so the page's own live branch renders; no source file is modified and no real stream window is claimed. VIS-06: viewport 720×480 in the read-only `/tmp/egdev-sbcheck/b7/countdown-preview.html` harness that mounts the preview fragment, its inline style block and its demonstration script unmodified and links `tokens.css` and `bundle.css` by `file://`; `document.fonts.check('600 12px "Barlow Condensed"')` was true while `document.fonts.check('600 13px Barlow')` was false, so the small `.meta` captions on that board may use a fallback weight (the countdown text itself is condensed and unaffected). VIS-01/VIS-02 keep their original 2026-10-18 conditions. Per-image hashes, selectors, source fragments and observed computed styles live in [`capture.json`](./capture.json).
- **Intent / acceptance / pending evidence:** preserve the label-above-four-columns anatomy, the tabular digits with a minimum measure, the fluid `md`/`sm` scales, the column gap and the host-owned field. Related criteria: AC-02 to AC-06. Visual conformity is **Not evaluated** until the owner adopts a snapshot; these captures are source evidence and never replace behaviour or accessibility checks, and no token value is inferred from their pixels.

## 7. Acceptance criteria

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | The public surface is unchanged: `Countdown`, `CountdownProps`, `CountdownSize`, `CountdownTone`, `CountdownUnits`; no ISO/`target`/`Date`/elapsed prop is added | existing `Countdown.test.tsx` plus `packages/ui/src/index.ts` export check | Not applicable | Pending |
| AC-02 | An instant converted from an ISO source (`Date.parse(target)`) produces the same fields as the same instant supplied directly; a string deadline still renders `unavailable` | existing invalid-input matrix plus one planned conversion case in `Countdown.test.tsx` | Default | Pending |
| AC-03 | The web's Spanish copy is reachable without new defaults: `label="Próximo directo en"` and `units={['días','horas','min','seg']}` render verbatim, and no localized default ships | existing localized-units case plus `Localized` story | Localized | Pending |
| AC-04 | `size="sm"` and `tone="canvas"` reproduce the `--sm`/`--on-dark` recipes; the source boolean names never appear in the API or the DOM | existing appearance-contract case (public markers and per-part recipes) | Sizes, Tones | Pending |
| AC-05 | The digit row stays inspectable, the timer stays `aria-live="off"` and named by the visible label, and the `time` element carries `deadlineText` | existing naming/description and passive-readout cases | Default, WithExpiration | Pending |
| AC-06 | No elapsed/count-up rendering exists: pasting a past deadline yields the latched zero plus `expiredText`, never an increasing value | existing past-deadline and latch cases | Expired | Pending |
| AC-07 | Documentation only: the `Default` story and meta copy state that `size`/`tone` replace the source `small`/`onDark` and that `deadlineText` carries the readable date, with no `@control` diagnostics | metadata/docgen test plus the existing controls suite | Default | Pending |
| AC-08 | Registry stays green with no new entries, usages or exceptions | `pnpm props:check`, `pnpm test:props` | Not applicable | Pending |

### Spec closure

- [x] All seven blocks are complete or justified as Not applicable (dynamic geometry and keyboard/focus: not applicable).
- [x] New/changed own props: none. Registry lookup recorded with the ten exact applied entry IDs, no new proposals and no new exceptions, and the recorded source revision matches the reviewed file bytes.
- [x] Proposals, verified implementation and planned checks are distinct; every promise has an acceptance ID and a planned method, and nothing is claimed as observed implementation.
- [x] Visual IDs identify real provenance, conditions and related criteria; the reused approved references are labelled as historical, and the frozen-clock capture states exactly how the live branch was reached.
- [ ] Snapshot identity is recoverable and the owner approval identifies this exact version, content digest, visual hashes and scope — **Pending**; the status stays Draft until then.
- [x] One canonical issue is retained (#82); v0.3 is prepared as a versioned comment over the v0.2 body history, never a body edit or a new issue.

### Open questions for owner approval

- **Q1 — Accept the documentation-only outcome (recommended).** The cataloged "deadline format" delta is an input encoding plus consumer-owned copy, both already resolved by the approved v0.2 decisions (D1 for the instant, D10 for the two closed axes, D9 for localization). *Recommendation:* accept that Countdown needs no API change, and keep this version as the recoverable record of the mapping, the divergences and the responsibility split.
- **Q2 — Where the live elapsed readout belongs (recommended: not here).** Past the start instant the web counts up and rewrites the label (VIS-05). The approved v0.2 contract already lists "stopwatch, past-duration display", "timezone selection" and "authoritative business scheduling" as non-goals. *Recommendation:* keep it out of Countdown. The pending LiveBand organism and its host own the weekly schedule, the live/offline branch, the label swap and the elapsed readout, using `onExpire` only as the transition signal. If an elapsed readout is later wanted in more than one place, propose it as its own atom contract (it has different semantics: no deadline, no expiration, an announcement policy) rather than a mode on Countdown.
- **Q3 — Where the readable date is rendered (recommended: keep `deadlineText`).** The web renders the readable date outside the widget (`.band-next`, `#nextDate`), while the design system requires `deadlineText` and renders it in a `<time>` inside the component. *Recommendation:* keep the shipped rule and pass the same string the page shows elsewhere ("Miércoles · 18:00", "04 NOV · 18:00"). It keeps one deterministic ISO `dateTime` in the accessibility tree and needs no API change; a host that duplicates the text visibly is making a copy decision, not a contract one. Making `deadlineText` optional would remove the `<time>` metadata and is not recommended.
- **Q4 — Localized defaults (recommended: no change).** The web defaults to Spanish copy and Spanish unit names; the design system ships English defaults and a fixed four-string tuple. *Recommendation:* keep English defaults and pass the Spanish tuple and label from the web. Shipping per-locale defaults would put domain copy in the system and still need the caller's locale decision.
- **Q5 — Accessibility of the digit row (recommended: keep the DS behaviour).** The web hides the digits (`aria-hidden="true"`) and names the timer with a static label; the design system exposes the digits, sets `aria-live="off"` and names the timer with its visible label (D8). *Recommendation:* keep the design-system behaviour. The web pattern is source evidence, not expected design: hiding the row makes the value unreadable on demand, and the approved contract already forbids per-second announcements without removing the value.

**Next step:** the owner answers Q1 (with Q2–Q5 as its detail) and approves this exact version; only then may a documentation-only implementation plan be proposed with its own approval. This spec authorizes no code, token, dependency or catalog change, and no external write.
