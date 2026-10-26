# Countdown v0.2 implementation evidence

## Authority and scope

- Contract: [#82](https://github.com/egdev6/egdev-design-system/issues/82), **v0.2** (the v0.1 initial body plus the v0.2 classification amendment: molecule → atom, `packages/ui/src/atoms/countdown/`, `Atoms/Countdown`), adopted by the owner full-contract approval comment. Recorded identities: canonical payload SHA-256 `21e0f43e349a19ce18a5f26995320ecbf8d9ca6d4c20f5f7b64fe3325c05d93d`; frozen body SHA-256 `2b9ca3b78b757483b4fd05729d07143f1f70c920f215546a87694912f63da64b`; v0.2 comment body SHA-256 `9db3552fcfe9ef1d8f96817312f120b005c023594bc3150a0b2414bd8720d5da`; ordered history SHA-256 `522b3a80b749d932325a66667b0243e44fb79ea81c14916ce5c5b450bcc41510`. VIS-01 `f1c1c2fa94bf7a256e3523b12800af5b58486b4a415311b1a8402ce350dd7f76`, VIS-02 `c4253fad0ba30fe6d48375854aa35bb7472f0e1bc947e888e8d74d90f5d34ea4`.
- Recovery check (2026-10-26): the current GitHub issue body bytes and the v0.2 comment bytes reproduce the frozen body and comment hashes exactly. The canonical payload hash was not recomputed: the archived v0.1 baseline named by the amendment is not present in this worktree, and the published body now carries a later capture-evidence block. The approval record's identity is adopted as recorded.
- Owner token approval (interactive questionnaire in the parent session, 2026-10-26, answer “Aprobado”), recorded here by the assistant; it is not a native or independent review receipt. Exactly four entries were approved and added to `packages/tokens/src/theme.css`: `--text-countdown-md` (`clamp(52px, 6vw, 96px)`, line-height 0.85, weight 800, letter-spacing 0), `--text-countdown-sm` (`clamp(36px, 4vw, 56px)`, same companions), `--spacing-countdown-column` (`clamp(14px, 2.2vw, 32px)`) and `--spacing-countdown-unit` (`1.9ch`). The approved “.85” line height is written `0.85`, following the file's existing recipe style; the value is identical.
- Token arithmetic: 2 recipes × 4 declarations + 2 spacing tokens = 10 static declarations. Static block 184 + 10 = 194; total and compiled artifact 255 + 10 = 265; inline aliases (16), root variables (55) and aliases (52) unchanged. `tokens.css` was rebuilt by `pnpm tokens`/`pnpm build`, never hand-edited.
- Separate implementation plan approval: the parent approved implementing exactly this contract under the owner's delegated full-batch development authorization. This is not a new owner quote. The parent also approved the two-entry `cn.ts` typography-size registration that the new tokens require (existing drift guard and twMerge grouping), with no other change to that file.
- Task: `odd/tasks/particles-build.md`, T30, S1–S6; base `3503273`, branch `feat/82-countdown`.

## Decisions applied

| Decisions | Implementation |
| --- | --- |
| D1 | `deadline` must be a safe integer whose UTC year is 1–9999; no string/Date coercion. `-0` is normalized to `0`. |
| D2 | The client clock is read only in effects and timeouts. `S = ceil((deadline − now) / 1000)`; fixed 86400-second days, unbounded day digits, two-digit hours/minutes/seconds. Expiry uses `now >= deadline`. |
| D3 | Server and first client render show `initializingText` without a digit row; invalid deadlines render `unavailableText` on both sides. No `suppressHydrationWarning`, server clock seed or forced-state prop. |
| D4–D6 | One timeout (`min(1000, remaining)`) and one `visibilitychange` listener per running episode; both are released at expiry, deadline change, invalidation and unmount, and a disposed flag stops obsolete closures. The expiry latch and notification flag live in an episode ref keyed by the normalized deadline: Strict Mode replay keeps them, A→B→A and valid→invalid→valid rearm, and a true remount is a new instance. The latest `onExpire` is used; an absent handler still consumes the event. |
| D7–D9 | Native `time` with UTC ISO `dateTime`; blank `deadlineText` falls back to that ISO string. Blank label/status texts and invalid unit tuples warn once per change (client effect) and use the English defaults. |
| D10–D11 | `size` md/sm and `tone` inherit/canvas through static CVA in `types.ts`, composed per part with `cn()`. Native `div`/`p`/`span`/`time` with the approved token recipes; Text/Heading is not composed (D11). Six files, no stylesheet, no internal modules, no Radix or dependency. |
| D12 | Native spread reaches the root only; role, name, `aria-live="off"`, `data-state` and the excluded props are applied after it, so untyped overrides are discarded. `aria-describedby` keeps consumer tokens first and appends the deadline and state-message ids, deduplicated. `className` merges last on the root only. |

Legacy `.eg-countdown*` rules stay in the components layer; utilities in their natural layer override the label/name typography (14px/700 eyebrow recipe instead of the source 15px/800 and 13px/700, as the contract specifies). No `--sm`/`--on-dark` modifiers are emitted. Public runtime export: `Countdown`; types `CountdownProps`, `CountdownSize`, `CountdownTone`, `CountdownUnits`. CVA recipes and the hook stay private.

## Naming and metadata

Ten existing approved conventions gain exact reviewed `CountdownProps` usages: `accessible-name`/`label`, `preset-dimensions`/`size`, `surface-material-tone`/`tone`, `unavailable-measurement-message`/`unavailableText`, `deadline-instant`/`deadline`, `absolute-deadline-text`/`deadlineText`, `time-unit-labels`/`units`, `deadline-expiration`/`onExpire`, `clock-initialization-message`/`initializingText` and `expired-deadline-message`/`expiredText`. Source `packages/ui/src/atoms/countdown/types.ts`, whole-file SHA-256 `35d8c209c7aa249f4a78bb3c0c8c1154dd34affed22529cff4af8e134b97908e`. No convention text, approval, alias or exception changed; the generated view was regenerated with `node scripts/prop-naming.mjs --write`.

Docgen and registered Storybook extraction verify ten own rows: number for `deadline`; text for `deadlineText`, `label`, `initializingText`, `expiredText`, `unavailableText`; select for `size`, `tone`; disabled controls with concrete reasons for `units` (Localized story) and `onExpire` (WithExpiration story). Required rows carry no defaults; constant defaults render without extra quotes. Native rows: `id`, `title`, `dir`, `lang`, `aria-describedby`, `className`. Stories: Default, Sizes, Tones, Expired, InvalidDeadline, Localized, LongDuration, DeadlineChanges, WithExpiration. No manual argTypes or play functions.

## Acceptance coverage

| ID | Observed functional evidence | Remaining evidence |
| --- | --- | --- |
| AC-01 | Unit: 9 invalid inputs (NaN, infinity, fraction, unsafe, beyond Date range, years 0 and 10000, string, Date) render unavailable with no timer, listener or callback; epoch 0, −0, negative and both year bounds accepted. | — |
| AC-02 | Unit: ceil fields, 1/999/1000 ms → one second, exact deadline → zero, 123-day duration. Packed CSR running digits. | — |
| AC-03 | Unit: past/equal at mount expires; rollback before expiry increases the remainder, after expiry stays latched. Packed CSR expired zero. | — |
| AC-04 | Unit: latest handler, cosmetic rerenders, visibility, handler added later, A→B→A, invalid interlude, Strict Mode replay (running and past), true remount. Packed CSR single notification across rerender and visibility event. | — |
| AC-05 | Unit: timer count and listener add/remove spies; unmount leaves no work and no late notification. | — |
| AC-06 | Unit: delayed tick beyond the deadline gives one expiry; visibility return resamples immediately. | Real browser throttling not evaluated. |
| AC-07 | Unit: `renderToString` without `Date.now` calls; hydration 2.5 s later with no recoverable error or console error, then running. Packed SSR on React 18 and 19. | Distinct server/client timezones are irrelevant to the ISO-only output but were not run as separate processes. |
| AC-08 | Unit: render probe shows `initializing` under the new date before the new sample; ISO fallback for blank text; unique ids across two instances; consumer description merge. | Caller date-text accuracy stays caller-owned. |
| AC-09 | Unit: named timer, `aria-live="off"`, inspectable row, no status/alert role, no tab stop. | Real assistive-technology behavior not evaluated. |
| AC-10 | Unit: localized tuple, plain-text label (no HTML), blank/short-tuple fallbacks with warnings, untyped protected-prop overrides discarded. Packed strict type negatives. | — |
| AC-11 | Unit: per-part recipes for both sizes and tones without legacy modifiers. Built CSS: token `var()` with exact fallbacks for both digit recipes, column gap and minimum measure; packed native Vite and Tailwind consumers emit them. | Computed styles, zoom, RTL and wrapping in a browser not evaluated. |
| AC-12 | AST/docgen/enhancer tests, root exports, declaration exports, packed entries/types/SSR/CSR/CSS. | Storybook browser Controls not evaluated. |
| AC-13 | Visual references identified above. | **Visual conformity: Not evaluated.** |

## Observed validation

Test-first: with an anatomy-only hook (no clock), the new suite gave **31 failed / 11 passed**; after the clock, episode and fallback logic, **42/42 passed**. Two failures at that point were test errors (rollback arithmetic and SSR attribute order) and were fixed in the tests only. Mutation checks: ceil→floor fails 13 tests; dropping the episode latch fails the Strict Mode renotification test; the source was restored byte-identically. Token tests failed 5/24 before the theme entries and passed 24/24 after.

| Exact command | Observed result |
| --- | --- |
| `flock /tmp/egdev-gates.lock timeout 900 systemd-run --user --scope -q -p MemoryMax=3G pnpm lint` | Pass, 358 files (after whitespace-only formatting of six edited files). |
| `… pnpm typecheck` | Pass. |
| `… pnpm build` | Pass; tokens.css 12.38 kB, UI styles.css 245.93 kB. |
| `… pnpm test --maxWorkers=4` | 46 files / 955 passed (main 909 + 42 Countdown + 3 controls + 1 docgen). |
| `… pnpm props:check` | Pass; registry valid, view up to date. |
| `… pnpm test:props` | 87 passed. |
| `… pnpm test:package-exports` | 47 passed (main 46 + 1 Countdown CSS test). |
| `… pnpm test:tokens` | 24 passed. |
| `flock /tmp/egdev-gates.lock flock /tmp/egdev-packed.lock timeout 1500 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:package-consumption` | 12 passed (React 18.3.1 and 19.3.0); Countdown SSR and CSR scenes ran on both majors. |

The packed fixture keeps one React type import and adds Countdown samples outside App (no buttons, so the `button:not(.eg-checkbox)` count stays 26), thirteen strict negatives, one CSS helper serialized into and called in all three CSS harnesses, and the 265-variable pin. The transition guard is unchanged: Countdown has no transitions or animations. The packed run's only warning is the existing ProgressBar `<div>`-inside-`<p>` nesting warning. No browser, CI or visual check was run.
