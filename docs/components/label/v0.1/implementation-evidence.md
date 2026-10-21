# Label v0.1 implementation evidence

## Authority and identity

- Contract: [issue #87](https://github.com/egdev6/egdev-design-system/issues/87), v0.1.
- Full-contract approval: [owner approval record](https://github.com/egdev6/egdev-design-system/issues/87#issuecomment-6251513547).
- Separate implementation plan: approved by the component development coordinator acting under the owner's delegation; this is an assistant-observed coordination record, not a native or independently signed receipt.
- Whole-body SHA-256: `82dc0b69b4b3f6b769963747397b9699867bd408b541c9a1cf5bff417ceab2bc`.
- Canonical SHA-256: `b5150bde363fadd74b348f399142987aa2f968dc372279736802a92e9c808820`.

Both hashes were recomputed from the issue's raw JSON body and match the approval record. The canonical payload starts at the actual heading line `## 1. Purpose and scope` and continues through EOF, encoded as UTF-8 with LF and the existing final newline (15,754 bytes). The earlier quoted occurrence in the tracking metadata is excluded. No remote bodies or receipts were rewritten.

## Approved implementation boundaries

- Six meaningful files under `packages/ui/src/primitives/label/`; **No stylesheet** and no additional internal modules.
- Native label via `@radix-ui/react-label@2.1.17`, the only separately approved dependency addition. No token changes.
- Required `children`, `variant="field" | "choice"` (default `field`), native `htmlFor` and other native label attributes, and a forwarded `HTMLLabelElement` ref. No `asChild` API or owned control states.
- Public `eg-label` marker, token-backed CVA recipe, layout-only consumer class merging. No Material surface paint or disabled opacity on Label.

### Choice weight authority

The exact approved issue #87 **section 6, Appearance → Tokens / Material** line is:

> `labelVariants` base: `font-sans`, `text-label-default` (size and line height from the recipe), `text-fg-secondary`. `field`: recipe weight (`--text-label-default--font-weight`, 600). `choice`: `font-[var(--text-body-default--font-weight)]` (500). No Material (text only).

The choice utility references that existing token exactly; it does not introduce a numeric weight, a new token, or general arbitrary-value permission. The coordinator separately confirmed this bounded interpretation when approving the implementation plan.

## Expected-design references

Local PNG bytes were verified against the approved scoped identities:

| Reference | Path | SHA-256 | Scope |
| --- | --- | --- | --- |
| VIS-01 | `docs/design/foundation-boards/v2026-10-18/specimens/label--specimen.png` | `35fdcd6c475842d9f175b013e8a9ea5bca09a19115273495fdfc5796113fde04` | Field/choice label typography, long text and label-row layout |
| VIS-02 | `docs/design/foundation-boards/v2026-10-17/Field.png` | `80af435a468eecb6ffd17b1b7187d06dc9015bd9d0b8477d874493ff88498df6` | Label rows only; associated controls are outside this component's appearance scope |

These remain expected-design references, not implementation captures. Capture conditions and exclusions remain those recorded in the approved issue. Historical source copy is not translated or replaced.

## Shared typography merge correction

The existing public `cn` helper treated custom `text-*` typography recipes as color utilities. Combining `text-label-default` with `text-fg-secondary` removed the size/line-height recipe. The coordinator approved a separate correctness fix before Label: commit `686b1c0` uses `extendTailwindMerge` to register all 13 actual typography size tokens, including `code`, without token, dependency, or API changes.

The regression tests derive the size list from the token source (excluding companion properties), verify every size coexists with foreground color and token-backed weight, and retain last-wins size/color/layout conflict resolution. Existing conditional-input, public-marker, and responsive utility tests remain intact. The new three tests failed before the fix; the combined `cn` and Gauge regression suites then passed (38 tests). Full packed-consumer verification remains pending with the complete Label integration.

## Verification status

Label implementation and functional evidence are pending. Owner browser review, actual Controls widgets, computed typography, and comparison against VIS-01/VIS-02 remain pending; no visual conformity is claimed from source classes or metadata tests.
