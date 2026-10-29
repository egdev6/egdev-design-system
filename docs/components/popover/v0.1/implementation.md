# Popover v0.1 implementation

## Contract and authorization

- Canonical contract: [issue #96](https://github.com/egdev6/egdev-design-system/issues/96).
- [Full-contract approval](https://github.com/egdev6/egdev-design-system/issues/96#issuecomment-6251540641): v0.1, canonical SHA-256 `68a7de345a3dc39a9056fcfa925f88ec5432ed63fef9353c5da745cfc4bbd65e`.
- [Owner-approved amendment A1](https://github.com/egdev6/egdev-design-system/issues/96#issuecomment-6504726428): **Content omits consumer `id`**. Radix alone owns Content id, Trigger `aria-controls`, and title/description ids. Other native Content attributes are unchanged; there is no custom-id coordination layer.
- [Owner-approved amendment A2](https://github.com/egdev6/egdev-design-system/issues/96#issuecomment-6505125894): **Button Trigger keeps its own `data-state=idle|loading`**. Visibility uses Radix-owned Trigger `aria-expanded`, `aria-controls` when open, and Content `data-state`. Open-state styling on Button triggers uses `aria-expanded` variants. Button is unchanged; native triggers retain Radix `data-state=open|closed`.
- Delegated implementation: molecules-build T12, S1–S4. The parent supplied the separate implementation authorization, bounded edit surfaces and installed `@radix-ui/react-popover` **1.3.1**. No dependency or token mutation is part of this change.
- Surface, Button, IconButton, Input, Label, Stack and Text already exist on the supplied main baseline; no pending molecule is imported.

## Delivered API

`Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverClose`, and their four corresponding `*Props` types are the only new package-root exports. Hooks, context and CVA helpers stay internal.

```tsx
<Popover>
  <PopoverTrigger asChild={true}>
    <Button>Display settings</Button>
  </PopoverTrigger>
  <PopoverContent label='Display settings'>
    <p>Changes apply immediately.</p>
    <PopoverClose>Close settings</PopoverClose>
  </PopoverContent>
</Popover>
```

Use one Trigger/Content pair with a stable named button. A slotted child must spread props and forward its actual button ref; fragments, navigation anchors, passive components and disabled entry points are not supported. Trigger and Close use React 18-compatible `forwardRef<HTMLButtonElement>`; Content has no public ref, `asChild`, `id`, style, force-mount or cancellation API. Names, field labels and visible Close actions remain consumer responsibilities.

## Decision coverage

| Decisions | Implementation and evidence |
| --- | --- |
| D1–D2 | Four compound parts delegate interaction exclusively to Radix; no bespoke document listeners, focus trap or outside-click engine. |
| D3–D4 | Native/slotted buttons, controlled requests and uncontrolled initialization; incoming updates do not echo callbacks. A2 preserves Button-owned state while Radix-owned ARIA represents visibility. |
| D5–D6 | Non-modal default, modality-only context, derived `aria-modal=true` only in modal mode; Radix owns ids, including A1. |
| D7–D8 | First eligible control/container autofocus, cyclic Tab in both modes, dismissal and restoration remain Radix-owned. Tests cover outside focus/pointer, trigger toggle and the modal context-menu restoration exception. |
| D9 | Consumer-supplied explicit Close; ordinary actions and forms do not implicitly dismiss. |
| D10 | Radix Portal → Content `asChild` → Surface `tone='overlay' padding='md' radius='xl'`; no extra Portal or copied Surface recipe. |
| D11–D12 | Bottom/start defaults; fixed 8px offsets/collision padding represent existing `--space-2`; token width and Radix available-space bounds, scrolling and arbitrary consumer body. |
| D13 | State-driven opacity-only entry, immediate close unmount and reduced-motion transition removal; Surface owns solid/transparency fallbacks. No new stacking claim. |
| D14–D15 | Bounded native props, button refs, owned relationship protection, A2 Button/native state representation, `eg-popover` alongside `eg-surface`, and per-part CVA/`cn()` composition. |
| D16 | Six meaningful files, **No stylesheet**, no extra component modules or tokens. Existing VIS-01 is retained, not replaced by an implementation capture. |

### Styling and merge boundaries

All Popover utilities are static CVA classes in `types.ts`, scanned through the additive molecules source glob. Surface alone supplies overlay paint, light edge, strong hairline, elevation 3, radius, padding and solid fallbacks. The new marker is not a separate CSS recipe.

Button Trigger state belongs to Button under A2: use `aria-expanded` variants for open-state styling, never `data-[state=open]` on that child. Content and plain native Triggers retain Radix-owned open/closed state. The dedicated regression checks the composed Button before opening, while open and after closing.

Content `className` merges last for supported outer dimensions, bounds, margins and alignment. It does not authorize paint, padding, radius, focus or state overrides. Trigger/Close accept control appearance composition while retaining focus and minimum targets. `twMerge` resolves recognized utility groups, not arbitrary selectors or universal cascade precedence.

## Naming and documentation

Only reviewed implementation usages were appended to existing conventions: `slot-composition`, `accessible-name`, `floating-side`, `floating-align`, `open-state`, `initial-uncontrolled-open`, `open-change`, `interaction-modality`. No convention status, semantic definition, exception or approval was changed. Evidence pins the reviewed whole-file bytes of `types.ts`; the registry reference was regenerated.

Storybook title: `Molecules/Popover`. Examples cover the closed default, keyboard opening, modality, forms, read-only fallback focus, Button Trigger, IconButton Close, controlled ownership, placements and long scrolling content. The existing general stories configuration already includes molecules; native-prop documentation and preview/CVA scanning were extended additively. No manual argTypes or play functions were introduced.

## Verification evidence

- RED: the initial public-API suite failed resolving the not-yet-created `./Popover` implementation.
- GREEN: the initial implemented suite passed 25/25; triangulation adds A1 type exclusion, untyped native-attribute protection and the dedicated A2 Button/native state regression. A2 documents existing Button behavior; its regression passes without a runtime implementation change, and no separate failing A2 test is claimed.
- Final focused component, metadata, existing docgen/Controls and Storybook CSS suites: **309/309 passed across five files**. This includes real TypeScript extraction, owned-branch metadata coverage, registered enhancer/inference, zero metadata diagnostics, native attributes and actual defaults. It is not browser widget evidence.
- Final `pnpm lint` and `pnpm typecheck`: **passed**.
- Final `pnpm props:check`: valid registry and current generated view. Final `pnpm test:props`: **87/87 passed**. Source revisions were refreshed after the A2 public JSDoc correction; conventions and approvals remain unchanged.
- Final `pnpm build`: **passed**, including tokens, UI JavaScript/declarations and compiled CSS. Rebuilt after the A2 declaration documentation change.
- Final `pnpm test:package-exports`: **51/51 passed**, including both exact export inventories, 116 reachable declaration files, all static Popover CVA utilities, token/Radix geometry, private-helper boundaries and closed SSR.
- All final tests, lint, typecheck and builds ran in foreground `systemd-run --user --scope -q -p MemoryMax=2G` scopes with explicit timeouts. No watch or Storybook server was started.
- Packed-consumer fixtures cover positive/negative public types (including A1), runtime inventories, closed SSR, client button refs, portals, modality, focus restoration and controlled ownership, plus native/Tailwind-free shipped CSS checks. After the parent reported a naming assertion failure, one explicitly authorized worker rerun **passed 12/12 on React 18.3.1 and 19.3.0**, including both Popover CSR stages. Log: `/tmp/pop-packed.log`.

### Packed-consumer naming assertion repair

The parent-provided failing log showed `close.getAttribute('aria-label')` returning null instead of `Close packed settings`. This was an incorrect harness assumption: IconButton composes Radix AccessibleIcon, which supplies visually hidden naming text rather than an `aria-label` attribute. Existing IconButton SSR fixtures already verify this distinction.

The packed assertion now checks the exact hidden naming text, absence of a replacement `aria-label` and `aria-hidden=true` on the decorative SVG. The component regression additionally verifies the actual accessible name via Testing Library. No Popover/IconButton behavior, DOM constructor checks, deferred timers, dismissal assertions or focus-restoration checks were changed. The focused component suite passed **27/27**, followed by a successful memory-capped build and the first packed rerun (**1 of 3 permitted runs used**). The packed matrix still emits unrelated ProgressBar fixture `<div>`-inside-`<p>` nesting warnings; these were left unchanged.

### Dependency-source gotchas

Radix Popover 1.3.1 sets its private generated Content id and then spreads Content props (`dist/index.mjs:281–285`), whereas Trigger uses its private id (`:106`). A1 prevents that mismatch, including defensive removal for untyped callers; no relationship-coordination state was added.

Button's `useButton` sets its own `data-state` after spreading incoming attributes (`packages/ui/src/atoms/button/useButton.ts:56–63`). A2 explicitly preserves that approved Button behavior: the regression checks `idle` throughout closed/open/closed while Trigger `aria-expanded` and Content `data-state=open` represent disclosure. No Button edit or state-mirroring adapter was introduced.

Radix's DismissableLayer 1.2.1 defers primary-pointer outside dismissal until the click completes (`dist/index.mjs:265–272`); the primary-pointer regression therefore sends both pointer-down and click. The modal right-click path remains immediate and preserves Radix's focus exception. Focus restoration settles asynchronously, so tests await the actual focus result rather than assuming synchronous cleanup.

TypeScript may normalize the order of an interned literal union. Controls tests verify the complete align set and preserve the actual extracted option order instead of imposing a different order.

## Evidence limits

**Visual conformity: Not evaluated.** No Storybook/watch server, browser capture, actual Controls widgets, screen-reader session, narrow-viewport collision measurement, OS preference emulation or nested-overlay guarantee is claimed. VIS-01's approved static specimen is not runtime accessibility evidence. The owner reviews Storybook. The bounded packed React 18/19 matrix above is observed evidence, not browser or assistive-technology certification; the parent owns remaining full gates and Git/PR actions. No CI execution or commit is claimed.
