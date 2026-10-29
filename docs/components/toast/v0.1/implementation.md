# Toast implementation — v0.1 + A1

## Authority and scope

- Contract: [#110 v0.1](https://github.com/egdev6/egdev-design-system/issues/110), approved in [the owner record](https://github.com/egdev6/egdev-design-system/issues/110#issuecomment-6251581744).
- Canonical base payload SHA-256: `2aeac0535a2b2b749931a4fcaa0b3ea654559a03d955131b5852f20926f5a419`.
- [Owner-approved A1](https://github.com/egdev6/egdev-design-system/issues/110#issuecomment-6507322709) supersedes only focused dismissal's prior-focus restoration promise: Escape, close and action use Radix's viewport focus. No Toast-owned focus restoration.
- Delegated scope: `odd/tasks/molecules-build.md`, T19, S1–S4. Implement the molecule after Notice and its composition dependencies merged; use the parent-installed `@radix-ui/react-toast` 1.3.1 only. No token or dependency changes.
- Six meaningful files under `packages/ui/src/molecules/toast/`; **No stylesheet**, no extra internal modules. Hooks and recipes remain private.
- Public exports are exactly `Toast`, `ToastProvider`, `ToastProps`, `ToastProviderProps`. No imperative queue, store, public ref or `asChild` API.

## Composition and decisions

| Decisions | Implementation |
| --- | --- |
| D1, D2 | Declarative Radix Provider/Root. Consumers manage their list and remove closed instances. Radix owns state, timers, pause/resume, swipe, keyboard, focus and announcements. |
| D3 | Reuse exported `noticeVariants({ tone, size: 'md' })`, not Notice JSX or copied appearance recipes. Reuse Notice's internal icon/text/action recipes for its anatomy. The shared recipe retains `eg-surface` under Notice A1; Toast adds `eg-toast`, never `eg-notice` or its part markers/roles. |
| D4 | Opaque tinted surface-1; `cn()` replaces the shared low shadow with `--shadow-edge-strong` + `--shadow-elev-3`. No glass/backdrop blur or new Material recipe. |
| D5, D6 | Danger maps to Radix foreground/assertive; others background/polite. Duration defaults to 5000ms; Infinity disables auto-dismissal. |
| D7, D8 | Close is Radix Close asChild → unmodified IconButton ghost/lg, 48px, with Icon close. IconButton names through AccessibleIcon hidden text, not aria-label. Single optional Action asChild requires `actionAltText`; the supported Button md has a 48px minimum height. Alternate children must preserve props/ref/button semantics and supply a ≥44px coarse-pointer target. |
| D9, D10 | System Portal hosts the bottom-end fixed ordered-list viewport, token inset/gap and capped responsive width. Region and announcement prefix localize independently; Radix expands `{hotkey}`. Stack insertion order puts newest last. |
| D11 | Starting-style opacity fade, Radix swipe-x tracking and immediate exit. Reduced motion removes transitions; an additional `motion-reduce:data-[swipe=cancel]:transition-none` matches the cancel selector's specificity, preserving direct pointer tracking without snap-back animation. |
| D12, D13 | No z-index utility, stylesheet or inline appearance. The system Portal appends to body; Radix retains its native region wrapper, focus proxies and separate announcement portal. |

`className` supports root layout additions only (width, margin, self-alignment), merged last through `cn()`. It is not permission to override Material, tint or internal geometry. `twMerge` is not a universal cascade guarantee.

### Native behavior notes

Pinned source: `packages/ui/node_modules/@radix-ui/react-toast/dist/index.mjs`.

- **A1:** lines 347–350 focus `context.viewport` only when the closing toast contains focus. Escape calls this handler at lines 433–437. Tests cover Escape, close, action and no outside-focus movement.
- **Additional native keyboard behavior:** lines 416–422 allow the topmost Radix dismissal layer to close on Escape when focus is outside all toasts. The wrapper preserves this, rather than restricting Escape to a focused toast. Regression coverage verifies outside focus stays put; the parent owns any additional published amendment.
- Native cancellation remains authoritative: action `preventDefault()` prevents close; `onEscapeKeyDown.preventDefault()` prevents Escape dismissal.
- Duration is forwarded without an invented validation policy. Radix's line 342 `durationProp || context.duration` means zero falls back to 5000ms; Infinity remains persistent. Tests protect both boundaries.
- Radix warns and omits an action with blank `altText`; Toast retains that behavior. TypeScript rejects an action without the required alternative route. Toast outside its provider retains Radix's missing-provider error.

## Acceptance evidence

| Criteria | Automated coverage | Remaining evidence |
| --- | --- | --- |
| AC-01 | Portalled list, strong summary, description, native attributes and public marker | Browser visual comparison not evaluated |
| AC-02 | All five tones and real Radix live-region politeness; default/custom decorative icons | Actual assistive-technology speech not evaluated |
| AC-03 | Default/custom timer, Infinity, zero fallback; pointer/focus/window pause and remaining-time resume | Real pointer/browser timing not evaluated |
| AC-04, AC-05 | Actual IconButton lg and Button md composition, hidden naming, action/close callbacks, alternative route, cancellation and A1 focus | Fine/coarse target measurements and narrow-layout wrapping not evaluated |
| AC-06 | Native F8, Tab, Escape, swipe cancellation/completion and forwarded events | Browser keyboard/swipe evaluation not performed |
| AC-07 | Controlled requests, acknowledgement/reopening without echo, uncontrolled defaults, defaultOpen=false and forceMount | Packed React 18/19 matrix reserved for parent |
| AC-08 | Localized region, announcement prefix and close label | Localization review not performed |
| AC-09 | Shared recipe/marker/shadow assertions; production and preview CSS checks for sizing, fade, swipe and reduced-motion selectors | Computed styles/media behavior and VIS-01 parity not evaluated |

## Integration

- Root barrel and exact runtime/declaration export inventories include only the four approved exports.
- Existing molecule `types.ts` scanning, Storybook story discovery and preview story scanning already cover Toast; no duplicate registration lines.
- `Molecules/Toast` stories: Default, Tones, WithAction, Persistent, Stack, DismissTargets, Controlled and CustomIcon. Launchers create messages on demand; Default supplies only the required summary.
- Real docgen/AST tests cover both components, all action-union branches, required props, defaults and native rows. Installed Storybook extraction/enhancement/inference checks require zero owned-metadata diagnostics. No manual argTypes or play functions.
- Registry usages reuse the twelve approved conventions listed in #110, with reviewed whole-file hashes; no semantic changes, new approvals or exceptions. `children` and inherited native props do not introduce conventions.
- Packed fixtures use real public types, narrowing actions with `Extract<ToastProps, ...>`. They cover strict type negatives, SSR, native/Tailwind CSS and client action/controlled/focus behavior. The packed suite is intentionally not run by this worker.

## Verification

Test-first evidence: the initial missing-module run was not behavioral RED. Temporary no-op components then produced 24 intended behavioral failures (missing message/region, missing timer callback and missing provider error). The implementation passed all 24; alternate cases were added afterward.

All commands below passed; validation commands used `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G` (generators excepted).

| Command | Observed result |
| --- | --- |
| `pnpm vitest run packages/ui/src/molecules/toast packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts --maxWorkers=2` | 261 passed, including 27 Toast cases |
| `pnpm vitest run packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2` | 54 passed; initial test-only expectation corrected from `--spacing-6` to emitted canonical `--space-6` |
| `pnpm typecheck` | Passed |
| `pnpm lint` | Passed after scoped formatting corrections |
| `pnpm props:docs` / `pnpm props:check` | Generated view current; registry valid |
| `pnpm test:props` | 87 passed |
| `python3 scripts/build_catalog.py` | 110 rows generated; Python bytecode disabled to avoid out-of-scope cache writes |
| `pnpm build` | Passed, single run; token/UI artifacts generated |
| `pnpm test:package-exports` | 54 passed, single run; 122 reachable declarations checked |
| `git diff --check` | Passed |

Packed consumption and full gates belong to the parent. No Storybook server, browser, visual conformity, native review, CI or PR claim is made here.
