# @egdev/ui

EGDEV Foundation's React package currently provides **Gauge only**, plus the `cn` utility. Surface, IconButton and Tabs are provisional future concepts, not importable React APIs or private implementations.

```tsx
import { Gauge } from '@egdev/ui';
import '@egdev/tokens/tokens.css';
import '@egdev/ui/styles.css';

export function Capacity() {
  return <Gauge label='Storage capacity' value={42.5} />;
}
```

Gauge is a passive controlled 0–100 measurement, not task progress or an action. Both `label` and `value` are required. Non-normal `state` values require visible `stateText`; optional centers must be decorative and non-interactive. Gauge owns its native decorative Material well and has no `ref` or `asChild` API. `className` supports outer margin/alignment only, not appearance overrides.

The effective contract is the [v0.9 composition amendment](../../docs/components/gauge/v0.9/composition-amendment.md) plus the [base specification](../../docs/specs/gauge.md); implementation approval is recorded separately.

## Distributed CSS

The package build emits JavaScript, declarations and `dist/styles.css`. The public `@egdev/ui/styles.css` import is plain layered CSS, including Gauge's approved static token utilities and geometry rules; consuming applications do not need a Tailwind compiler.

Import tokens explicitly before UI styles. JavaScript imports do not load CSS automatically and remain usable for Node SSR. Tailwind applications can use `@egdev/tokens/theme.css` instead of the compiled native token import; the UI stylesheet contract is unchanged. UI styles consume tokens without redefining them, and production utility scanning excludes stories and tests.

## Source and legacy styles

Component source follows `src/{primitives,atoms,molecules,organisms,templates}/<kebab-name>/`. See the [component contract](../../skills/_shared/component-contract.md) and [provisional catalog](../../docs/CATALOGO.md).

`src/styles/legacy/bundle.css` preserves existing Foundation canvas styles. Legacy `eg-*` selectors do not establish React component availability, accessibility behavior or a supported replacement for the retired APIs.
