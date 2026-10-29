# HoverCard v0.1 implementation

## Contract and execution scope

- Canonical contract: [issue #86](https://github.com/egdev6/egdev-design-system/issues/86).
- Base approval: [owner full-contract approval](https://github.com/egdev6/egdev-design-system/issues/86#issuecomment-6251510605).
- Base canonical SHA-256: `f6a537d2ddad1f1e8a6b8681cfd956d8956bf1dad3c4c2d29254958820c779c6`.
- Effective revision: **v0.1 + [owner-approved amendment A1](https://github.com/egdev6/egdev-design-system/issues/86#issuecomment-6504955538)**.
- Execution: parent-authorized T13, S1–S4 in the molecule implementation batch. This report does not amend the contract or certify browser conformity.
- Prerequisites: Surface, Gauge and Link are already public on the supplied main base `d428967`. The parent pinned `@radix-ui/react-hover-card` 1.2.1 in `fa93028`; no additional dependencies or token changes.

### A1: native touch behavior

Radix Trigger calls `preventDefault()` on touchstart. HoverCard retains that handler unchanged: pointer, keyboard and assistive-technology activation retain the link path, but touch-tap navigation is **not guaranteed**. Every story includes a separate persistent destination link outside the trigger and repeats the preview information at that destination. Consumers must provide the same accessible alternative. No HoverCard-owned touch handler exists.

The installed Radix source has no generated Content ID or Trigger `aria-controls`, so Popover's generated-ID override problem does not apply. Compatible consumer Content IDs are preserved and tested. Radix does spread consumer attributes after `data-state`; hook preparation drops injected state attributes rather than allowing consumers to spoof them.

## Implementation decisions

| Decisions | Implementation |
| --- | --- |
| D1–D3 | Three named components; Radix owns disclosure, timers, positioning and dismissal. Content is read-only supplementary React children, not a plain-text tooltip or action surface. |
| D4–D5 + A1 | Required native anchor href or a single link-compatible `asChild` element; React 18-compatible anchor ref forwarding. Gauge stays a passive, independently named meter inside a named anchor. Separate persistent link in every story. |
| D6–D7 | Controlled/uncontrolled state goes directly to Radix; false initial default and native 700ms/300ms delays. No public timer props or duplicate state engine. |
| D8 | Preferred top/start, all four sides and three alignments; fixed numeric offset/collision padding 8 correspond to `--space-2`. No arrow. |
| D9–D10 | `Content asChild` composes existing `Surface tone='overlay' padding='md' radius='xl'`; Surface owns all Material and fallback recipes. No cloned recipe or fixed header/footer slots. |
| D11 | Token-derived 384px width, Radix available-width/height limits, overflow scrolling and word wrapping. |
| D12 | Native link semantics; no invented tooltip/dialog role, live region, expanded relationship, focus trap or focus movement. Radix owns focus/blur/Escape. |
| D13 | Opacity-only starting transition, no close animation or displacement; reduced-motion utility. Body portal without an invented stacking scale. |
| D14 | Compatible native props; protected read-only Content surface without public ref, slot, presence or placement-offset API. Supported layout merges are tested; arbitrary appearance overrides remain unsupported. |
| D15 | Six meaningful files, CVA only in `types.ts`, typed preparation helpers, JSX-only component file. **No stylesheet** or extra internal module. |

Content className supports width/height limits, margins and alignment, merged last through `cn()`. Surface's Material, padding and radius remain authoritative for supported usage. Trigger classes must preserve the focus ring and hit target. This is not universal last-class-wins permission: `twMerge` does not resolve arbitrary selectors or every utility group.

## Naming and integration

Reviewed all three public prop aliases in `packages/ui/src/molecules/hover-card/types.ts`; source-byte SHA-256: `e7d36beedcc1196db25751455b6c910b4848b9286b1b7d463642ad91c1b146a6`.

- `HoverCardProps`: `open-state`, `initial-uncontrolled-open`, `open-change`.
- `HoverCardTriggerProps`: `slot-composition`; href/children remain native/React concepts.
- `HoverCardContentProps`: `floating-side`, `floating-align`; rich children do **not** reuse `tooltip-content`.
- No new conventions, exceptions or approval changes. The generated naming view and post-receipt usage tests are updated.
- Root barrel exports only the three components and their three prop types. CVA and hook helpers remain internal.
- Production CSS scans molecule `types.ts` sources additively. Storybook already discovers molecule stories through its generic glob; native prop metadata and additive molecule example scanning are registered.
- Both exact package-export inventories and the packed runtime export-key list include the new exports.
- Packed fixtures use real public props and cover negative types, native/slotted refs, controlled requests, portal rendering, SSR and shipped CSS without Tailwind. **The packed suite was not run**; the parent owns React 18/19 delivery gates.

## Observed validation

Strict test-first execution: behavior tests were written before implementation. The first focused run failed because `./HoverCard` did not exist (RED). After implementation, all initial 17 tests passed (GREEN). Additional public-type/runtime-slot, layout and metadata cases brought component/docgen coverage to 26 passing tests. One touch assertion was corrected to observe Radix's cancellation request: React delegates touchstart passively, so jsdom native `defaultPrevented` does not establish browser tap behavior. Extracted alignment enum order is preserved rather than reconstructed from tags.

| Command | Observed result |
| --- | --- |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/hover-card --maxWorkers=2` | Initial missing-module RED, then 17/17 GREEN. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/hover-card packages/ui/src/lib/hover-card-docgen.test.ts --maxWorkers=2` | Final 26/26 pass; installed parser/extraction/enhancement/inference with zero owned metadata diagnostics. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm lint` | Pass after focused formatting corrections. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm typecheck` | Pass, including public type boundaries and intentional single-child negative. |
| `pnpm props:docs` | Naming view regenerated. |
| `pnpm props:check` | Registry valid; generated view current. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm test:props` | 87/87 pass. |
| `PYTHONDONTWRITEBYTECODE=1 python3 scripts/build_catalog.py` | Catalogue regenerated, 110 rows; no Python cache output. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G sh -c 'pnpm build && pnpm test:package-exports'` | Single final build/export invocation: build passes; 52/52 export, declaration, SSR and production CSS tests pass. |
| `timeout 600 systemd-run --user --scope -q -p MemoryMax=2G pnpm vitest run packages/ui/src/molecules/hover-card packages/ui/src/lib/hover-card-docgen.test.ts packages/ui/src/lib/storybook-css.test.ts --maxWorkers=2` | 79/79 pass after build, including the actual preview CSS compiler. |

## Acceptance evidence and limits

- AC-01–AC-06: native Radix timing, pointer travel/selection retention, focus/Tab/Escape, controlled/uncontrolled notifications, props/refs, passive Gauge and amended touch fallback covered by focused tests. Invalid multiple-child slot composition is rejected by both types and the real Radix runtime guard.
- AC-07–AC-09: placement preparation, bounds, supported merges and Material composition tested; production/preview CSS emission checked, including starting opacity and reduced motion. No screenshot or computed-browser cascade claim.
- AC-10: named/declaration inventories, SSR, static CVA scanning and installed Controls metadata pass. Packed React-major and browser Controls widget checks remain for the parent/owner.
- AC-11: expected-design identity remains the approved VIS-01 SHA-256 `dca6b03b7436b4a7eb7437c79634bad42d3f937b34e2e67ec01ba73b39cad693`. No replacement reference or implementation capture was produced. **Visual conformity: Not evaluated.**

Real-browser viewport collision, enlarged text, text selection, unsupported-backdrop filtering, reduced transparency/motion, touch/AT activation and screen-reader behavior are not evaluated by jsdom. No Storybook/watch process, packed consumer suite, CI, commit, push or remote mutation was performed by this implementation writer.
