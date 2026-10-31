# Collapsible implementation plan — v0.2 Draft

- **Status:** separately reviewable proposal; not implementation authorization. Exact contract/visual adoption and plan approval are Pending. Owner approval of the proposal is [#181 comment 6516515584](https://github.com/egdev6/egdev-design-system/issues/181#issuecomment-6516515584), not approval of this plan.
- **Contract:** [spec.md](spec.md), version 0.2; canonical content SHA-256: `b3d9f158d45661b151dbff249b645ab6f97b036e872d187eb6f4be39d35b2017`.
- **Plan identity:** `contentSHA256: sha256:136dc06ca4e2bdc55cdd31ab07a023aaa13443642bde467541eefcbf271df42f`; SHA-256 of UTF-8 from the actual whole-line heading `## 1. Preconditions and boundaries` through EOF, LF endings and final newline; tracking above this heading is excluded.
- **Plan approval reference:** Pending. **Visual hashes/adoption:** Pending; see [capture-request.json](capture-request.json). No native review receipt exists.
- **Baseline:** `f88b36e44b3d5ec6d7725350959f9cdfdfeb5b23`; reviewed current-source hashes live in spec section 1. Re-review bytes if they drift; future implementation hashes cannot exist yet.

## 1. Preconditions and boundaries

1. Parent obtains owner approval identifying exact v0.2 spec digest and real expected-design images/hashes/conditions. Static specimen is not an adopted screenshot or runtime evidence.
2. Obtain separate approval of this plan digest, exact runtime edit surfaces and parent-owned integrations. This pre-approval draft was expressly requested for preparation; code remains gated.
3. Parent provisions this isolated checkout when runtime becomes eligible. Direct dependency and lock already pin `@radix-ui/react-collapsible` **1.2.1** and owner explicitly selected reuse; do not install a second dependency, change version, or revive the obsolete missing-dependency blocker. Current absence of node_modules is an evidence limit, not a new dependency-approval requirement.
4. Read provisioned 1.2.1 declarations/runtime for controllable state, click composition/cancellation, disabled, id, hidden shell and child presence. Record actual path/whole-file hashes at that time. If spec promises differ, return the narrow discrepancy for review; never write an alternative key/focus/state engine.
5. No NavList #92, Accordion, Button API/state hook, Surface recipe, tokens, dependency, legacy CSS or alias migration. No shared authority cleanup. Parent owns servers, captures, shared inventory changes and Git/GitHub delivery. The ODD mirror stays untouched.

## 2. Intended runtime edit surfaces — request only

These paths are NOT authorized by the current four-file preparation scope.

| New path | Meaningful responsibility |
| --- | --- |
| `packages/ui/src/molecules/collapsible/types.ts` | Explicit own public prop JSDoc/control tags and native Omit types; controlled union; private static CVA recipes for root/trigger/content/label/caret |
| `packages/ui/src/molecules/collapsible/useCollapsible.ts` | Typed root/trigger/content preparation helpers; remove prohibited/owned prop overrides, call CVA and cn per part, prepare children/label/caret props; no open state, key listeners, manual IDs or focus logic |
| `packages/ui/src/molecules/collapsible/Collapsible.tsx` | JSX-only named compound exports; Radix Root asChild → fixed Surface; real Radix native Trigger plus label/Icon; Radix Content; React 18-compatible Trigger ref bridge |
| `packages/ui/src/molecules/collapsible/Collapsible.test.tsx` | Real hook/DOM/state/ARIA/focus/disabled/presence/merge tests, including negative composition cases |
| `packages/ui/src/molecules/collapsible/Collapsible.stories.tsx` | Real typed components, autodocs, English JSDoc and distinct examples, action event logging; no play/manual argTypes or state-writing adapters |
| `packages/ui/src/molecules/collapsible/index.ts` | Only three named components and their three public Props types |

**No stylesheet** and no additional internal module. Context/part-outside-root ownership remains Radix's. Hook helpers prepare props/classes without an invented mirror context or fake state wrapper.

Parent-coordinated integration candidates, separately authorized after exact scope review:

- `packages/ui/src/index.ts`: explicit three component / three type exports in Molecules; no internal helper or recipe export.
- `packages/ui/src/lib/storybook-docgen.test.ts`, `packages/ui/src/lib/storybook-controls.test.ts`: append scoped real component metadata/enhancer cases; retain all existing coverage. Test compound-part metadata against the real symbols, not an adapter.
- `scripts/package-exports.test.mjs`, `scripts/package-consumption.test.mjs`: bounded public exports, type-negative API, SSR/client/ref/hydration and no-consumer-Tailwind coverage after parent inspects actual fixture conventions. Parent derives final exact fixture paths before editing; no wildcard permission from this plan.
- `scripts/catalog_data.py` and generated `docs/CATALOGO.md` / `docs/catalog.json`: parent alone handles inventory on actual implementation evidence; no stale dependency wording or automatic NavList migration.
- `skills/_shared/prop-naming.json` and generated `docs/prop-naming.md`: parent records only new Collapsible usages for the three existing approved visibility IDs after reading actual public API symbols and computing whole-file source hashes. No new convention, exception, alias or global promotion.

No package.json, pnpm-lock.yaml, tokens.css/theme.css, CSS inventory or ODD edit is proposed. New browser evidence paths must be authorized separately; this writer creates no PNG/capture.json placeholders.

## 3. Implementation sequence after approval

1. Record exact package source and source-composition findings. Run the focused test first; use behavior-level test-first development for runtime, not fictitious preparation RED/GREEN.
2. Declare the exact controlled/uncontrolled union and native exclusions from spec section 3. Own open/defaultOpen/disabled use boolean controls; callbacks/ReactNode children use false with concrete nonserializable reasons and dedicated stories. Repeat metadata across union declarations; defaultOpen=false and disabled=false are constants, open/onOpenChange/required children have no fabricated defaults.
3. Prepare hook models and JSX. Forward root state props directly to Radix; Radix owns state, data-state, data-disabled, Trigger semantics and Content id/hidden. Forward only Trigger ref to the actual button. Native consumer click cancellation stays Radix-composed. Do not autofocus, trap focus or restore it automatically on an external close.
4. Compose fixed Surface surface-1/elevation=0/radius=md/padding=none. Trigger calls internal `buttonVariants` ghost/md, not Button/useButton (idle/loading data-state collision). Compose wrapping start-aligned label, sm trailing Icon, static Radix group-data rotation and reduced-motion resets. Body receives token padding and token top hairline only. No height/exit animation or private Material clone.
5. Add minimum tests incrementally, then alternate/negative cases and refactor with the focused suite green. No Radix behavior mocks. Integrate exports/metadata/consumers only through parent-authorized surfaces.
6. Parent serializes broad build/packed gates and actual browser/AT review; capture observed implementation under adopted comparable design conditions, preserving expected references.

## 4. Functional checks and stories

All entries are PLANNED, none executed during this docs-only preparation.

| Contract IDs | Required checks | Stories |
| --- | --- | --- |
| AC-01/02 | Defaults; Enter/Space/click; exactly one next-value request; unchanged controlled render until accepted; no mount/prop echo; defaultOpen rerender ignored; preventDefault cancels toggle | Default, InitiallyOpen, Controlled, CanceledActivation |
| AC-03 | Disabled closed/open; no activation by pointer/key, no callback; body controls still operable and state retained; native disabled Tab exclusion | DisabledClosed, DisabledOpen |
| AC-04/07 | Trigger focus retained, no autofocus; Tab/Shift+Tab body order; arrow/Home/End/Escape propagate without disclosure state action; no outside-close; consumer-managed focused external close/ref | Keyboard, ExternalClose, ButtonRef |
| AC-05/06 | Hidden shell id/controls at closed state; no body children/interactive descendants until open; local child reset on remount; distinct sibling/nested ids; independent state; Radix contextual misuse diagnostic | Remount, WithFormContent, IndependentSections, Nested |
| AC-07 | Meaningful names, hidden caret, fixed native button/type, optional labelled region and consumer heading; SSR/hydration id relationships and real DOM ref on supported React majors | Heading, NamedRegion |
| AC-08 | Surface sheen/edge/hairline/radius; trigger ghost hover/press/focus precedence; single disabled opacity; no body dimming; wrapping label with nonshrinking caret; reduced motion removes transforms/transitions | LongLabel, ReducedMotion; VIS-01–04 |
| AC-08/09 | Supported Root margin/width/placement and Trigger/Content alignment merges; structural wrapping wins over internal recipe; markers retained; actual emitted utility/media CSS plus external no-Tailwind rendering | Default and layout composition |
| AC-09/10 | Exact exports/types; reject controlled without callback, defaultOpen with open, asChild, forceMount, Content id/hidden, Trigger disabled/type overrides; own metadata/extracted defaults/native props; real Controls browser widgets | Default, Controlled; no optional-default args injection |

Pointer/keyboard tests do not prove computed CSS; class assertions do not prove pixels. AT announcements, 200% zoom, narrow viewport, RTL, reduced motion/transparency and actual focus clipping require browser/manual evidence. Do not add a new accessibility test dependency to claim an unprovisioned audit.

## 5. Later validation proposal — parent scheduling required

Not commands authorized or run in this preparation. Inspect scripts/output paths and required write surfaces before scheduling.

1. Focused runtime gate: `pnpm exec vitest run packages/ui/src/molecules/collapsible/Collapsible.test.tsx`.
2. Metadata gates after approved integration: `pnpm exec vitest run packages/ui/src/lib/storybook-docgen.test.ts packages/ui/src/lib/storybook-controls.test.ts`.
3. Types/format review, then parent-authorized `pnpm typecheck` / `pnpm lint`; report unrelated failures without rewriting around them.
4. Parent-serialized `pnpm build`, `pnpm test:package-exports`, `pnpm test:package-consumption`; packed execution may install fixtures and needs its own exact permission. Require emitted static CVA/attribute/media CSS and no-consumer-Tailwind styling; verify both React 18 and 19 SSR/client/ref/hydration rather than assuming compatibility from forwardRef/types.
5. Parent-owned Storybook browser Controls plus keyboard/focus/AT/visual checks on an authorized server. No fake screenshot, browser result, native receipt or universal last-class-wins claim.
6. If approved registry usage/inventory integration occurs, parent owns corresponding generators and focused validation. This plan does not authorize executing them now.

## 6. Review sizing and handoff

Estimate only: core six-file compound module roughly 450–650 added lines (types/recipes/models/JSX/exports), focused tests roughly 250–350, stories roughly 120–180; shared integration roughly 60–120 plus generated inventories. Total about 880–1300 lines before real measurements, not an observed diff. Keep contract/specimen approval separate from plan approval, then use reviewable logical runtime slices: API/behavior with tests; stories/metadata; parent export/consumer/inventory evidence. Parent owns commit/PR sizing and sequencing; no slice ships a partial public contract.

Preparation checks: exact source/API/link/hash and token-reference inspection only. Runtime RED/GREEN: not active here. Browser captures, owner visual adoption, exact contract approval, separate plan approval, runtime code and all functional gates remain Pending.
