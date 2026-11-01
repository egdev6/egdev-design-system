# Toast v0.2 — API and visual proposal

Issue #226 (T6, S8). Owner: "Mejorar api y visualización de toast. Adjunto referencia de SF
(https://github.com/Stack-and-Flow/design-system/tree/main/src/components/organisms/toast)."

This document is a proposal only. It changes no source file, no token value and no dependency. Any
adopted part needs a spec/plan and owner confirmation.

Dependency check (verified): `@radix-ui/react-toast@1.3.1` is already installed in
`packages/ui/package.json` — **no new dependency is required**.

## 1. Gap analysis — current EGDEV Toast vs the SF reference

Current EGDEV Toast (v0.1 + A1) is a **declarative molecule**: the consumer owns a message list,
mounts `<Toast>` instances, and removes them after `onOpenChange(false)`. Radix owns all runtime
behavior (timers, pause/resume, announcements, swipe, F8, Escape, focus). The SF reference is an
**imperative organism**: a module-level store (`toastStore.ts`), an imperative `toast()` API with
typed helpers, a provider that renders everything itself, and hand-rolled timing/swipe/focus logic
in `useToast.ts` (~2,000 lines) that bypasses Radix entirely.

| Capability | EGDEV v0.1 (current) | SF reference | Gap | Adaptation stance |
|---|---|---|---|---|
| Calling model | Declarative only; consumer manages list state | Imperative `toast('Saved')` + `toast.success/info/warning/error/loading/promise` | **High** — no imperative API; the gap the owner reported | Add an imperative hook/store; keep Radix as the behavior engine |
| Provider | `ToastProvider` renders only the viewport; children are consumer toasts | Provider renders the stack from store state; consumers never mount toasts | High | Provider renders store-driven toasts; declarative `Toast` is no longer a consumer API |
| Variants | 5 tones (`NoticeTone`: neutral/info/success/warning/danger) via Notice recipe | 5 statuses + 3 visual variants (solid/soft/outline) + 3 sizes | Medium | Keep the 5 semantic tones; variant/size set is an owner decision (§4 OQ2) |
| Actions | One optional action asChild with required `actionAltText` | Action with label/ariaLabel/disabled; warns when non-text label lacks ariaLabel | Low | Keep the current stricter contract (altText required by types) |
| Promise / loading | None | `toast.promise(p, {loading, success, error})`, loading status with spinner, duration 0 | **High** | Propose `toast.promise()` + loading tone in v0.2 (§2.4) |
| Stacking | Simple flex column; every toast fully visible; no cap | maxVisible (default 3), fifo/lifo queue, overlapping scaled cards (scale-95/90) | High | Cap visible toasts and queue overflow at store level; visual treatment per §3.4 |
| Positions | Fixed `bottom-end` only | 6 placements (top/bottom × start/center/end), offset, safe areas | Medium | Propose 4 placements (top/bottom × start/end); center omitted (OQ4) |
| Durations | Per-toast `duration` (default 5000, Infinity persistent, Radix zero-fallback) | Per-toast + provider `defaultDuration`; minimum clamped to 5000 | Medium | Add provider `defaultDuration`; keep Radix's zero/Infinity semantics, no clamp (preserves v0.1 tests) |
| Dismiss | Close IconButton (48px, ghost/lg), Escape, action close | dismissible flag, close (xs), Escape, clear all | Low | Keep the 48px close; add programmatic `toast.close(id)` / `toast.clear()` |
| Swipe | Radix native swipe-x (`data-swipe`), right, threshold native | Hand-rolled 4-direction pointer tracking with opacity falloff | Low | Keep Radix native swipe; direction derived from placement (OQ8) |
| Progress countdown | None | Per-toast Progress bar at the bottom edge | Medium | Recommend **not** including in v0.2 (OQ3) |
| Pause on window blur | None (Radix pauses on hover/focus/pointer only) | `pauseOnWindowBlur` + manual pauseAll/resumeAll | Medium | Propose provider flag; Radix has no native support, so it is store-level (OQ6) |
| A11y | Radix live regions, assertive danger, F8 viewport hotkey, A1 viewport-focus on close, localized labels | role=alertdialog per toast, F6, manual focus restore to previous element | Low | Keep Radix (F8 + live regions + A1). Do **not** copy SF's manual focus restore — Radix's A1 behavior is owner-approved |
| Reduced motion | `motion-reduce` utilities remove transitions/swipe animation | Store-level `motion: 'none'` + matchMedia listener | Low | Keep CSS `motion-reduce` (no JS media query needed with Radix-driven motion) |
| Refs/asChild | No ref, no asChild | n/a | — | Keep: no ref, no asChild |
| Root class | Stable `eg-toast`, Notice recipe reuse, Material two-layer shadow | Custom classes, hard-coded colors (`text-text-secondary-light/80`, `white-tint-faint`) | — | Keep `eg-toast` + tokens-only; SF hard-codes colors we must not |

**What SF does that we deliberately do not adopt:** reimplementing timers, pointer/swipe capture,
focus management and announcements outside Radix; per-toast `role="alertdialog"` (a toast is a
status, not a dialog); hard-coded non-token colors; clamping durations under 5s. All of that is
either already solved by `@radix-ui/react-toast` or violates the repo's token/Radix rules.

## 2. Proposed API

### 2.1 Shape

Same six-file module (`packages/ui/src/molecules/toast/`), same public root class. New public
surface:

```tsx
// Mount once near the root — renders the viewport and every store-driven toast.
<ToastProvider
  placement="bottom-end"      // top|bottom × start|end (default bottom-end)
  defaultDuration={5000}      // ms; per-call overrides
  maxVisible={3}              // visible cap; overflow queues at store level
  pauseOnWindowBlur={false}   // optional store-level pause
  label="Notifications ({hotkey})"
  announcementLabel="Notification"
/>

// Imperative API — stable identity, safe outside React effects after provider mount.
const toast = useToast();
const id = toast.show({ title: 'Link copied', tone: 'success', duration: 4000 });
toast.success('Changes saved');
toast.error('Upload failed', { description: 'Retry from the file list.' });
toast.warning('Storage almost full');
toast.info('New version available');
toast.loading('Uploading file…');                    // duration 0, spinner glyph
await toast.promise(save(), {
  loading: 'Saving…',
  success: 'Saved',
  error: (e) => `Save failed: ${e.message}`
});
toast.update(id, { title: 'Renamed' });              // updates in place
toast.close(id);
toast.clear();
```

`toast.loading()` and the `promise` phases are sugar over `show`/`update` with a `loading` tone
(spinner glyph, `duration: 0`) that transitions to `success`/`error` content on settle; the promise
rethrows. `toast.show()` returns a stable string id; calling `show` with a caller-supplied `id`
that is already visible updates that toast in place (SF's dedupe behavior, simplified).

### 2.2 Architecture on top of the existing Radix primitive

- **Store (new private `toastStore.ts`):** module singleton holding queue + visible ids + provider
  config, subscribed with `useSyncExternalStore`. It owns **identity and ordering only** — never
  timers, swipe, focus or announcements.
- **Mounting:** the store mounts at most `maxVisible` records; each rendered record is a Radix
  `ToastPrimitive.Root` with `open`/`onOpenChange` controlled by the store. When Radix reports
  close (timer, swipe, Escape, action or close button), the store removes the record and promotes
  a queued one. This means every behavior the v0.1 implementation got from Radix — timing with
  pause/resume, live-region politeness (danger assertive), F8, Escape, swipe with reduced-motion
  handling, and the owner-approved A1 viewport-focus rule — is preserved without change.
- **Window-blur pause** (if approved, OQ6) is the one store-level timer touch: pause all mounted
  Radix roots' remaining time on `window.blur` and resume on `focus`. Scoped, testable, no
  reimplementation of Radix's timer math.
- **Hook:** `useToast()` returns the stable imperative object. Calls before provider mount warn in
  development and no-op (mirrors Radix's missing-provider error, softened).
- **Exports:** `ToastProvider`, `ToastProps` (call-input type), `useToast`, plus the `ToastApi`
  type. `Toast` (the mounted root) becomes internal.

### 2.3 What stays from the current API

| Kept unchanged | Notes |
|---|---|
| Anatomy and prop names | `title` (was `summary`)¹, `description` (was `children`)¹, `icon`, one action with required `actionAltText`, `dismissLabel` |
| Tone model | `NoticeTone` (neutral/info/success/warning/danger) mapped to existing status tokens; danger → Radix foreground/assertive |
| Duration semantics | Radix-owned: default 5000, `Infinity` persistent, `0` falls back (protected by v0.1 tests) |
| Viewport a11y | `label` + `announcementLabel`, F8, bottom-end fixed ordered list, capped responsive width |
| A1 focus rule | Closing a focused toast moves focus to the viewport (owner-approved, unchanged) |
| Material recipe | `noticeVariants({ tone, size: 'md' })` + `eg-toast` deltas (`--shadow-edge-strong` + `--shadow-elev-3`), opaque surface, no glass |
| Styling rules | No ref/asChild, className root-layout-only merged last, no z-index utilities, system Portal |

¹ Renamed to match the imperative call-shape ergonomics (`toast.show({ title })`); see breaking
changes.

### 2.4 Breaking changes and migration

| Breaking | v0.1 | v0.2 | Migration |
|---|---|---|---|
| Consumer-mounted toasts | `<Toast>` mounted by the consumer, controlled via `open`/`defaultOpen` | Removed; the provider renders the store's toasts | Replace list state + JSX with `toast.show(...)` calls; the provider + hook own lifecycle |
| `open` / `defaultOpen` / `onOpenChange` on `ToastProps` | Public controlled/uncontrolled visibility | Removed from the public type | Use `toast.show()`, `toast.update(id)`, `toast.close(id)`; persistent "keep open until user acts" is `duration: Infinity` |
| `summary` / `children` | Prop names on the declarative root | Renamed `title` / `description` in the call input | Mechanical rename at call sites |
| `Toast` component export | Public | Internal (not exported) | Import only `ToastProvider`, `useToast`, types |
| Stories | Consumer-state demos (`ToastDemo`, `ControlledDemo`) | Store-driven stories (`Playground`, `PromiseLifecycle`, `Placement`, `Stack`, …) | Stories rewritten; docgen/AST tests updated for the new exports |

Non-breaking additions: `placement`, `maxVisible`, `defaultDuration`, `pauseOnWindowBlur` on the
provider; `tone`, `duration`, `description`, `id`, `onAction` in the call input; `update/close/
clear/promise/loading` on the hook.

## 3. Visual proposal

### 3.1 Anatomy

Same left-to-right anatomy as v0.1, unchanged in order:

```
[ status glyph ]  [ Title (strong)        ]  [ action? ]  [ close 48px ]
                  [ description (optional) ]
```

- **Icon:** decorative, tone-colored via the shared Notice icon recipe (`circle-alert` for danger,
  `check`/`alert`/`bell` per tone as today); `loading` renders a spinner; consumer `icon` replaces
  the default. Never the sole cue (always paired with the title text).
- **Title:** strong, first; carries meaning without color (unchanged v0.1 rule).
- **Description:** Radix Description, secondary foreground, no nested live regions.
- **Action:** at most one, Button md (48px target) inside `ToastPrimitive.Action` with required
  `altText`.
- **Close:** IconButton ghost/lg with `Icon close`, 48px, `dismissLabel` naming (unchanged).

### 3.2 Surface and tokens per tone (Material v2)

All tones share one opaque Material recipe (v0.1 D4): `surface-1`-based, `--shadow-edge-strong` +
`--shadow-elev-3` two-layer shadow, token-only colors. Per tone, only the icon, the title glyph
accent and a left status edge/well change:

| Tone | Icon color | Edge / well treatment | Foreground |
|---|---|---|---|
| `neutral` | `--color-fg-secondary` | none — plain surface | text primary / secondary |
| `info` | `--color-status-info` | tinted info edge (existing status token) | text primary |
| `success` | `--color-status-success` | tinted success edge | text primary |
| `warning` | `--color-status-warning` | tinted warning edge | text primary |
| `danger` | `--color-status-danger` + `circle-alert` | **inner** danger treatment: 2px `--color-status-danger` border + `--color-status-danger-bg` tinted well (the two tokens owner-approved under error-vs-focus Option A, delivered by T9) | text primary |

**Error vs focus (owner decision, Option A — "dentro vs fuera"):** the danger toast paints its
error treatment **inside** the surface (border + tinted well + glyph + text), while focus remains
the **outer** `--shadow-focus` ring (2px neon + 2px canvas gap) on the viewport and on interactive
controls (action, close). No red is ever used to paint focus, and the two states can never merge
visually on a toast: error lives inside, focus lives outside. This proposal introduces no focus
recoloring and no red ring anywhere.

Token impact: depends only on the two T9 tokens (`--color-status-danger-bg` and the 2px invalid
border width) already owner-approved in L11. No other new tokens; if T9 slips, the danger toast
falls back to the v0.1 treatment until they land.

### 3.3 Motion

- **Enter/exit:** v0.1's starting-style opacity fade (`--duration-fast`, `--ease-out`) unchanged;
  Radix owns when it runs.
- **Swipe:** Radix `data-swipe` tracking to the placement-derived direction; immediate exit on
  completion; cancel snaps back. Reduced motion removes transitions (v0.1 selectors kept).
- **Stack updates:** collapsed Radix stacking scale for overflow toasts; no bespoke transforms.
- No new keyframes, durations or easings; everything resolves to existing `--duration-*`/`--ease-*`
  tokens.

### 3.4 Stacking and placement

- Viewport stays a fixed ordered list; `placement` re-anchors it (top/bottom × start/end) with
  token insets and the existing responsive width cap. `swipeDirection` derives from placement
  (top → up, bottom → down; horizontal default right preserved for `bottom-end` compat — OQ8).
- `maxVisible` (default 3) caps the mounted list; overflow toasts queue and promote on close.
  Newest renders last (unchanged D9). Overflow presentation uses Radix's native collapsed scale —
  we do not adopt SF's absolute-positioned scale-90 card pile with manual z-indexes, which
  conflicts with the "no z-index utilities" rule and duplicates Radix behavior.

## 4. Owner decisions

| # | Question | Recommendation |
|---|---|---|
| OQ1 | Adopt the imperative `useToast()` API as the only consumer surface, removing consumer-mounted `<Toast>` and its `open`/`defaultOpen`/`onOpenChange` props (breaking, §2.4)? | **Yes** — it is the gap S8 names; Radix keeps all behavior so risk stays low |
| OQ2 | Visual variant set: single Material recipe per tone (current) vs SF's solid/soft/outline variants and sm/lg sizes? | **Single recipe** — Material v2 gives one floating-surface treatment; variants/sizes add review surface without a named need |
| OQ3 | Include the SF-style countdown progress bar per toast? | **No** in v0.2 — visual noise on a 5s message; revisit if the owner asks |
| OQ4 | Placement scope: 4 placements (top/bottom × start/end) vs SF's 6 (adds center)? | **4** — centered toasts collide with content and read as banners; extend later if needed |
| OQ5 | Include `toast.promise()` and the `loading` tone in v0.2, or defer to a follow-up? | **Include** — it is the second most valuable imperative win and rides on the same store |
| OQ6 | Include `pauseOnWindowBlur` (store-level, the only non-Radix timer touch)? | **Yes, default false** — cheap, isolated, matches user expectation when switching tabs |
| OQ7 | Rename `summary`→`title` and `children`→`description` in the call input (§2.4)? | **Yes** — matches imperative ergonomics and SF; mechanical migration |
| OQ8 | Swipe direction: keep fixed `right` (v0.1) vs derive from placement? | **Derive from placement**, keeping `right` for `bottom-end` — predictable with top placements |
| OQ9 | Danger toast inner treatment pending on the two T9 tokens (`--color-status-danger-bg`, 2px invalid border) — ship v0.2 visual after T9 lands, or decouple? | **After T9** — one coherent error language; fallback ordering documented in §3.2 |

## 5. Deliberate non-goals

- Copying SF's ~2,000-line hand-rolled timer/swipe/focus/announcement engine — Radix already owns
  all of it and the owner approved its behaviors (v0.1 + A1).
- Per-toast `role="alertdialog"` / `aria-modal` — toasts are statuses; Radix's live-region model is
  correct and is what the current a11y evidence base (AC-02, AC-06) certifies.
- Hard-coded colors, manual z-index, glass surfaces, or non-token spacing — repo rules and the
  Material boundary hold for the new surface exactly as for v0.1.
