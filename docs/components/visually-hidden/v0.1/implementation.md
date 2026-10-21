# VisuallyHidden v0.1 implementation

VisuallyHidden is a thin Radix wrapper for non-focusable screen-reader-only content.
It adds `eg-visually-hidden`, composes non-visual consumer hooks with `cn()`,
and forwards native attributes and an `HTMLElement` ref to the actual HTML host.

## Authority and plan

- Contract: [issue #112](https://github.com/egdev6/egdev-design-system/issues/112).
- Full-contract approval: [owner approval record](https://github.com/egdev6/egdev-design-system/issues/112#issuecomment-6251584644).
- Verified canonical payload SHA-256: `be13a57758ccbaac43b6f1be2ebf4768bee55f3dea726b9426e91e170bc589b8`.
- Frozen issue-body SHA-256: `0fcf4715d540cd42b0e98a43df14ea1091943f6ed651d96d92d50f986a675479`.
- The component-development coordinator approved the implementation plan and exact direct
  dependency `@radix-ui/react-visually-hidden@1.2.13` in this development session,
  on the owner's behalf. This is an assistant record, not a native approval receipt.

| Responsibility | Implementation |
| --- | --- |
| Anatomy and defaults | Radix Root renders a span; `asChild` defaults to false. Required `children` is ReactNode. |
| Types and metadata | `types.ts` inherits span-native props and documents content/composition limits. |
| Logic | `useVisuallyHidden.ts` composes the stable root marker and forwards props. |
| Rendering | `VisuallyHidden.tsx` uses `forwardRef<HTMLElement>` and Radix JSX. |
| Styling | **No stylesheet. No CVA.** Radix owns inline accessibility geometry; no authored appearance or tokens. |
| Tests | Component/hook behavior, installed metadata extraction/inference, public packed consumer API and SSR. |
| Stories | `Primitives/VisuallyHidden`: `Default` nested link notice and `AsChild` hidden heading. |
| Exports and catalog | Named component/type exports, actual slot-composition usage, regenerated catalog/reference. |

The six meaningful component files are retained. No extra internal module is introduced.
Legacy hidden-content CSS and future Kbd/Link contracts remain unchanged.

Both snapshot digests were independently verified against the fetched issue body.
The canonical payload begins at the actual `## 1. Purpose and scope` heading line
(not the earlier inline quotation in hash-definition metadata), through EOF with
LF line endings and the recorded final newline preserved.

## Approved metadata refinements

Actual docgen returned empty tags and no default for Radix's inherited `asChild`.
The coordinator separately approved omitting it from inheritance and redeclaring
`asChild?: boolean` with `@control boolean`, `@default false` and a hook default of false.
This changes neither public semantics nor the approved slot-composition convention.
Required `children` uses `@control false` with its ReactNode limitation and story references.

The coordinator also approved a component-indexed native-prop lookup in Storybook's
existing filter. Gauge retains its exact previous allowlist; VisuallyHidden documents
`id`, `title`, `aria-describedby`, `className`, `style` and `lang`. No manual `argTypes`,
renderer adapter or enhancer behavior change is introduced.

## Verification boundaries

The initial component test run failed because the wrapper did not exist (RED).
After implementation, seven component/hook tests passed (GREEN). A separate real
metadata regression failed on absent inherited `asChild` tags/default, then passed
after the separately approved refinement. Runtime tests cover accessible names,
descriptions, native attributes, Radix geometry, default/slotted/custom host refs
and marker composition. Packed consumer fixtures cover the actual public API.

Source/build checks observed on Linux: `pnpm lint`, `pnpm typecheck`,
`pnpm props:check`, `pnpm test:props` (81/81), `pnpm test` (177/177), and
`pnpm build` passed. The native assessment reported medium risk, RDD off,
writer self-verification and no independent verifier. Browser checks remain pending.

Non-visual status means no expected-design images apply. Browser computed geometry,
accessibility-tree inspection and actual Controls widgets remain separate coordinator
checks; automated metadata or style assertions do not certify screen-reader behavior.
Root/child styles must not override hiding geometry. No focusable descendants,
SVG/Fragment hosts, non-forwarding custom children, generic polymorphic ref inference,
skip-link behavior or automatic live announcements are promised.
