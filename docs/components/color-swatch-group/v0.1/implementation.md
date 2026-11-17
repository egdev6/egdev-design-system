# ColorSwatchGroup implementation notes

The [approved v0.1 contract](spec.md) defines the API and validation. `ColorSwatchGroup`
is a consumer-controlled molecule exported from `@egdev/ui` with named Radix radio presets
and an optional, separately labelled native color input. The consumer owns localization,
normalization, persistence, reset and form serialization.

Supply `label`, `options`, `value` and `onValueChange`; set `customLabel` to expose the
picker. Options use `{ value, label, disabled? }`. Both preset and current colors must be
opaque six-digit hexadecimal sRGB values. Matching is case-insensitive, while displayed
and emitted values retain their supplied spelling. Invalid or duplicate options are skipped;
an invalid current value renders an em dash and disables the custom input. A request does
not become the visible value until the consumer accepts it through the `value` prop.

The root marker is `eg-color-swatch-group`. Root `className` is supported for margin, width
and parent placement only, not paint or part overrides. Native compatible fieldset attributes
are forwarded; there is no native form, ref, `asChild`, uncontrolled or custom-renderer API.
The approved static `bg-[color:var(--eg-swatch-color)]` utility is used only on decorative
preset patches after validation. No component stylesheet, token or dependency was added.

Visual reference adoption, cross-browser picker behavior, forced colors, target geometry,
contrast and assistive-technology checks remain pending; visual conformity is **Not evaluated**.
