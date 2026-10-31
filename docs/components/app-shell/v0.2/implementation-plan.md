# AppShell — future implementation plan, parked

- **Status:** proposed plan, **RUNTIME PARKED**. Documentation preparation is complete; no template/organism runtime code is authorized by this phase.
- **Contract:** full approved #130 v0.1, canonical SHA-256 `5f861d3f26424ae02cbe3be4daecfa97f697657048d19a82e5b19a7686f190e4`; [recovery](contract-recovery.md) and [dependency/evidence map](dependency-evidence-map.md). v0.2 names these preparation notes, not a new contract revision.
- **Plan identity:** `contentSHA256: sha256:a3470a3e65dd1ee84efcc5700b86276b900e9d759cf7f970d0665039981e9181`; SHA-256 of UTF-8 bytes from the actual whole-line heading `## 1. Exact parked and unblock condition` through EOF, LF including final newline; this tracking header is excluded.
- **Plan approval / runtime assignment:** Pending. No future implementation/source hash or native approval receipt exists. Baseline `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`.

## 1. Exact parked and unblock condition

No source execution until **all** of these occur in a later separately authorized scope:

1. Parent recovers the already-approved contract and verifies actual implemented/exported Sidebar [#123](https://github.com/egdev6/egdev-design-system/issues/123), ModuleRail [#124](https://github.com/egdev6/egdev-design-system/issues/124) and TabBar [#125](https://github.com/egdev6/egdev-design-system/issues/125), with reviewed real APIs/examples usable in the approved AppShell stories. These organisms are NOT implemented on this baseline and remain OUTSIDE this non-organism batch.
2. Owner separately approves this exact plan; parent names the runtime and shared integration edit surfaces, checks ownership/current source drift and assigns future template work. No fresh full-contract approval is needed unless a promise changes.
3. Parent authorizes/provisions the necessary tests/build/consumer/browser environment and schedules actual gates. Missing integrations/evidence are reported, not faked with placeholder organisms or a new core-only completion claim.

Button #53 is already implemented and supports secondary/md/asChild; do not revive that obsolete prerequisite or replace it with a new Button recipe. Surface #106 is also available and is neither missing nor a direct AppShell dependency. #128 evidence/naming consolidation is already committed through #129; no duplicate delivery issue, specimen, capture or naming receipt is proposed. External issue closure/status reconciliation belongs to parent only.

## 2. Exact future edit surfaces — request only

| New file | Meaningful responsibility |
| --- | --- |
| `packages/ui/src/templates/app-shell/types.ts` | Exact AppShellProps/Messages aliases, native Omit surface, English JSDoc/control reasons, exported static per-part appShellVariants with internal slot-derived arrangement |
| `packages/ui/src/templates/app-shell/useAppShell.ts` | Supplied-slot arrangement, message defaults, useId/main ref, skip activation preventDefault/focus, typed root/skip/body/side/main/bottom props and per-part cn; no layout state/media observers |
| `packages/ui/src/templates/app-shell/AppShell.tsx` | JSX-only native root/skip/body/side/main/bottom and existing Button-asChild anchor; no organism import/placeholder implementation |
| `packages/ui/src/templates/app-shell/AppShell.test.tsx` | Hook/DOM/type/SSR/skip/native merge checks and isolated slot witnesses; do not present them as real organism examples |
| `packages/ui/src/templates/app-shell/AppShell.stories.tsx` | Real organism compositions after readiness, approved Templates/AppShell story matrix and content-only examples; no play/manual argTypes/fake organism APIs |
| `packages/ui/src/templates/app-shell/index.ts` | Named AppShell, AppShellProps, AppShellMessages and approved appShellVariants export; hook stays private |

**No stylesheet; no extra internal module.** No numeric geometry, tokens/dependency/manifest/lock change, source refactor or organism edit.

Separately authorized parent-owned integrations:

- `packages/ui/src/index.ts`: add the approved named exports in Templates; no new subpath/ref/asChild/event API.
- `packages/ui/src/styles/compiled.css`: explicit production `@source "../templates/app-shell/types.ts";` because templates are not currently scanned. No component CSS import/inventory entry.
- `.storybook/preview.css`: explicit `@source "../packages/ui/src/templates/app-shell/AppShell.stories.tsx";` for actual example-layout classes; do not rely on story scanning to supply production utilities.
- `packages/ui/src/lib/storybook-css.test.ts`, `packages/ui/src/lib/storybook-docgen.test.ts`, `packages/ui/src/lib/storybook-controls.test.ts`: scoped actual CSS/metadata coverage, retaining current components/helper tests and enhancer configuration.
- `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs`: exact template exports, TypeScript negatives, SSR/client/hydration/skip and no-consumer-Tailwind CSS cases in existing embedded fixture conventions; any new fixture path requires discovery/authorization first.
- `skills/_shared/prop-naming.json`, generated `docs/prop-naming.md`: append reviewed actual AppShellProps source usages for existing side-navigation/bottom-navigation/localized-messages only after types.ts exists and is read/hashed. Preserve existing receipts, conventions and all prior usages.
- `scripts/catalog_data.py`, generated `docs/CATALOGO.md` / `docs/catalog.json`: update availability only on actual implementation evidence, not during this parked preparation.

No existing specimen, PNG, historical log, #128 receipt/test, Collapsible/GaugeGroup draft or ODD tracking edit is included. Later observed browser/evidence paths must be explicitly authorized; this plan creates no expected artifacts or approval hashes for future source.

## 3. Bounded future sequence

1. Recheck recovered source/dependency/readiness evidence at implementation time; inspect actual organism APIs before authoring stories. Stop on a changed contract or missing prerequisite, rather than implementing missing organisms.
2. Use applicable behavior-first checks for future runtime: one main/native DOM order, supported supplied/absent slot combinations, messages, unique main IDs, skip link focus and unchanged URL. Add the minimum code, then alternate/negative cases. Preparation itself has no runtime RED/GREEN requirement or evidence.
3. Implement six roles with static CVA classes only. Root canvas/fg/sans/min-h-dvh column; body flex-1 row; side sticky top-0 h-dvh self-start shrink-0; main min-w-0 flex-1/focus:outline-none; bottom sticky bottom-0 **in flow**. No containment/transform/filter/isolation/explicit z-index, fixed dock or inner scrolling. Width and Material of navigation stay organism-owned; no page padding/max-width/gap or extra safe-area compensation.
4. Derive switching/side/bottom/content solely from supplied slots; CSS min/max-[56rem] controls only switching. No JS viewport state, remount on breakpoint, or unapproved resize-focus repair. Preserve the ReactNode slot API rather than adding a renderer/data schema/child validator. Keep server/client DOM independent of viewport.
5. Compose the real Button secondary/default md/asChild anchor. Only side navigation gets a skip row; switching hides it below 56rem. sr-only becomes an in-flow row on focus-within, with m-2 link margin. useId/href provide pre-hydration native fragment fallback; hydrated handler prevents default and focuses internal main ref without URL changes. No VisuallyHidden for a focusable link, no custom keyboard engine or overlay stacking workaround.
6. Preserve exact native inheritance/exports from the recovery notes, including root style/listeners compatibility and public appShellVariants. Protect root role/owned content; supported className outer sizing/margins merges last with marker retention. Do not turn native inheritance into blanket appearance override permission.
7. Add real SidebarAndTabBar/ModuleRailAndTabBar compositions and remaining stories, then parent integration/gates. If sticky non-overlap, skip reachability or viewport-fixed behavior fails in real browsers, return the concrete discrepancy for review; do not silently switch to fixed positioning/padding/JS or change the approved threshold.

## 4. Planned verification matrix and truthful limits

All below are **planned only**; this task runs no tests, SSR, build, browser, capture, install or server.

| Approved AC | Can be planned independently after future runtime authorization | Integration/browser evidence that must wait |
| --- | --- | --- |
| AC-01/02/04 | Native root marker/order, one main, no template-added nav/aside/banner/footer; side/bottom/both/neither composition with isolated witnesses | Real organism landmark names, single-slot layout at both widths and native navigation Tab order |
| AC-03/05 | Static viewport-query class emission; no matchMedia/ResizeObserver/state; server/client markup/useId/hydration invariants | Actual ≥56rem / <56rem visibility and accessibility-tree/tab exclusion; mounted organism state across resize; no first-paint flash |
| AC-06/11 | Required sticky/flex/dvh classes and absence of containment/transform/filter/isolation/z-index in core source/CSS; fixed/portal structural witnesses | Real long/short document scroll/bounding boxes, full-height regions, viewport sticky scrollport, no content overlap; actual Dialog #119 host witness when independently available |
| AC-07/08/09 | Skip only with side, default/localized text, unique href/main IDs, tabIndex=-1, preventDefault, main focus and URL stability | First focusable/hidden-until-focused in-flow reveal, 48px Button target, no sticky clipping, pre-hydration native fragment behavior, actual browser next-Tab continuation |
| AC-10/12/13 | Native props/types; role/owned-child protection; root min-h conflict/marker retention; canvas-only paint/static cn | RTL geometry, current organism widths/Material and computed no-template-paint/stacking results |
| AC-14/15 | Production template/source scans; actual CSS and real docgen/enhancer for four own ReactNode/object fields; API/exports/type-negative fixtures | Browser Controls (not invented nested widgets), no-Tailwind consumed layout, React18/19 client/hydration verification |
| AC-16 | Scope and scenarios documented independently | 200%/400% zoom/reflow, narrow destinations reachable, unclipped focus, manual AT; supplied organism current-page/destination equivalence and safe areas |

Independent witnesses are test infrastructure for template placement, not substitute Sidebar/ModuleRail/TabBar or end-to-end evidence. Real Dialog modal/inert/focus checks belong to the actual host API; AppShell neither implements nor certifies them. Reference 895/896px checks assume default 16px initial media font setting; preserve the actual rem threshold rather than hardcoding a new pixel breakpoint. Static historical framed screenshots do not execute media/sticky/focus behavior.

Approved story matrix: SidebarAndTabBar, ModuleRailAndTabBar, SideOnly, BottomOnly, ContentOnly, LongContent, NarrowViewport, SkipLink, Localized, RTL. Content is neutral page content, but organism slots use real implemented components/approved APIs. English JSDoc, real Meta/StoryObj/autodocs, false controls with concrete ReactNode/object reasons, no manual argTypes/play or fake event actions; no optional-default args injected to hide unset controls.

Later commands to propose for parent scheduling, **not current execution permission**: focused AppShell test first; focused CSS/docgen/controls tests; typecheck/lint/build; package exports; separately authorized packed React18/19 consumption after fixture/install/cache review. Require actual distributed CSS scans/media/focus rules with no consumer Tailwind compiler, not class assertions alone. Parent owns all browser/AT/capture conditions, comparison to scoped existing VIS-01–04 and observation hashes. No historical test log is a fresh result.

## 5. Review burden and stop point

Estimate only: six core files excluding tests/stories about 200–300 authored lines; tests 200–300; real stories 150–230; parent integrations 80–150, roughly **630–980 authored runtime lines**, plus generated inventory/registry views and separately authorized observation artifacts. Review structural core/tests, real compositions/metadata and parent consumer/CSS integrations as distinct responsibilities; parent owns actual delivery slicing and git operations. Do not omit required stories/tests to meet an arbitrary size target.

Preparation ends with these three notes, recovered approved identities and the parked condition. No organism/template implementation, dummy component, production HTML/CSS, new capture, shared metadata or tracking change is performed. Full-contract approval is satisfied; prerequisite organisms, separate exact plan approval and later runtime assignment are intentionally not satisfied by this writer.
