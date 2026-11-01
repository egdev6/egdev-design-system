# Toast v0.2 — Implementation note

Issue #226 (T6, S8). Implements the owner-approved
[API and visual proposal](./api-visual-proposal.md) (OQ1–OQ9 approved: imperative `useToast()`,
single Material recipe per tone, no progress bar, four placements, `toast.promise()` + `loading`,
`pauseOnWindowBlur` default false, `title`/`description` renames, placement-derived swipe, danger
inner treatment deferred to T9). All work stays on the approved Radix engine; the new store owns
identity and ordering only.

## Public surface (breaking)

- `ToastProvider` — mount once near the root. New props: `placement` (`top|bottom × start|end`,
  default `bottom-end`), `defaultDuration` (5000), `maxVisible` (3), `pauseOnWindowBlur` (false).
- `useToast()` — the only consumer surface. Returns the stable `ToastApi`:
  `show`, `update`, `close`, `clear`, `info`, `success`, `warning`, `error` (danger), `loading`,
  `promise`. Calls before a provider mounts warn in development and no-op.
- Types: `ToastProps` (imperative call input), `ToastApi`, `ToastProviderProps`, `ToastTone`
  (`NoticeTone | 'loading'`), `ToastPlacement`, `ToastPromiseMessages`, `ToastCallOptions`,
  `ToastUpdateOptions`.
- Removed: consumer-mounted `<Toast>`, `open`/`defaultOpen`/`onOpenChange`, the `summary` /
  `children` names (→ `title` / `description`), and the public `Toast` component export. Native
  HTML `title` is replaced by the required message title on the call input.
- Kept: `actions` + required `actionAltText` (Radix validates blanks), `icon`, `duration`
  semantics (default 5000, `Infinity` persistent, `0` falls back through Radix), `dismissLabel`,
  Radix passthroughs (`forceMount`, `onEscapeKeyDown`, `onPause`, `onResume`, `onSwipe*`),
  `className` root-layout-only merged last, A1 viewport focus, F8, Escape, swipe, live regions
  with assertive danger.

## Architecture

- `toastStore.ts` (new private module, named by the proposal §2.2): module singleton with
  `useSyncExternalStore`. Records keep raw call options; defaults resolve at render time so
  `update` merges without baking values. The store never touches timers, swipe, focus or
  announcements. Because the store is a singleton, the most recently mounted provider claims the
  single active viewport (`claimProvider`/`releaseProvider`); records render in one provider only.
- The internal `Toast` root is controlled (`open={true}`); every Radix close path (timer, swipe,
  Escape, action, close button) flows through `onOpenChange(false)` → `store.close(id)` → unmount,
  exactly like the v0.1 consumer contract, so A1 and Radix validation are preserved unchanged.
- `loading` and the promise phases are sugar over `show`/`update`. A loading toast omits
  `duration`, which the internal root resolves to `Infinity` (persistent until settled); the
  promise's settle update replaces tone/title so the resolved toast uses `defaultDuration`.

## Deliberate decisions and deviations

- **Loading duration (§2.1 says "duration 0")**: Radix resolves `duration: 0` to the provider
  fallback (5000 ms), which would drop the loading state mid-promise. Loading therefore omits the
  duration and persists (`Infinity`) until the settle update or `close`. The v0.1 protected
  behavior — explicit `duration: 0` falls back to 5000 — is unchanged and still tested.
- **Queue semantics (§3.4)**: Radix portals each toast into the viewport with `appendChild`, so
  mount order is DOM order. The visible set is therefore the oldest `maxVisible` records in
  insertion order (newest last, D9 preserved); newer overflow queues at store level and promotes
  FIFO on close. Visible-first would break the newest-last guarantee.
- **`pauseOnWindowBlur` (OQ6, default false)**: Radix already pauses every remaining timer on
  window blur. With the default `false`, the provider resumes through Radix's own viewport resume
  event (`toast.viewportResume`), deferred one tick so Radix's blur pause handler runs first — no
  timer math is reimplemented. Toasts shown while the window is hidden start counting on focus.
- **Swipe (OQ8)**: `swipeDirection` derives from placement — top → `up`, `bottom-start` → `down`,
  `bottom-end` keeps `right` for v0.1 compatibility. The recipe adds
  `translate-y-[var(--radix-toast-swipe-move-y)]` movement/cancel utilities so vertical swipes
  actually translate.
- **Danger treatment (OQ9 fallback, §3.2)**: the two T9 tokens (`--color-status-danger-bg`, 2px
  invalid border) are not in `packages/tokens/src/theme.css` yet, so danger keeps the v0.1 Notice
  recipe treatment (tinted status border/glyph, assertive announcement). Revisit when T9 lands.
- **`onAction`**: runs after the action element's own `onClick` (which may still `preventDefault`
  to cancel dismissal, preserved) and before Radix closes.
- **Storybook**: stories are store-driven (`Default`, `Tones`, `WithAction`, `Persistent`,
  `Loading`, `PromiseLifecycle`, `Placement`, `Stack`, `CustomIcon`); the docs page mounts one
  provider per story, so the single-active-viewport rule shows interaction toasts in the most
  recently mounted story's viewport. The `Placement` story remounts its provider on selection so
  the demo's viewport re-anchors.

## Prop-naming registry

Updated usages on `ToastProps` for `surface-material-tone` (now `ToastTone` with `loading`),
`message-summary` (`title`), `auto-dismiss-duration` (Radix 0 fallback note) and
`accessible-name`; removed the `open-state` / `initial-uncontrolled-open` / `open-change` usages
(the declarative visibility API is gone; those conventions remain sourced from `CollapsibleProps`).
New call-input/provider props that need conventions before they can be recorded as approved
usages — listed here as candidates only, not approved: `title`/`description` lead/detail naming
beyond `message-summary`, `id` dedupe identity, `onAction`, `placement` (viewport anchor),
`defaultDuration`, `maxVisible` (visible cap), `pauseOnWindowBlur`.

## Migration

Replace consumer-mounted toasts and list state with `toast.show(...)` calls under one provider;
rename `summary` → `title` and `children` → `description`; use `duration: Infinity` for
persistent messages; import only `ToastProvider`, `useToast` and the types.
