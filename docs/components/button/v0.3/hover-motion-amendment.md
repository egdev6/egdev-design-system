# Button v0.3 amendment — no hover motion

## Owner decision

During the visual review on main (2026-11-01) the owner reported: "los buttons me da la sensación que todo el contenido interno se mueve en el hover...da una sensación rara". Asked how to resolve it, the owner chose "Sin movimiento en hover".

## Cause

- `primary` and `secondary` lifted the whole button by `-translate-y-px` on hover, and `dark` by `-translate-y-0.5`, which became 1.6px after the ×0.8 scale (#234).
- The decorative icon slid by `translate-x-0.5` (also 1.6px) through `group-hover/button`.
- Fractional transforms during the transition re-rasterize the label, so the whole content appears to shift.

## Changed promise

- Hover feedback is color, background, border, shadow and (for `neutral`) opacity only. Neither the root nor the icon moves on hover.
- The removed motion-reduce hover resets are no longer needed.

## Unchanged

- Press feedback on `:active` (`translate-y-px` and `scale-97` with the press duration and easing), focus ring, disabled and loading rules, variants, sizes and the public API.
- IconButton and Link keep their own hover motion until the owner decides on them separately.
