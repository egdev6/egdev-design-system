# IconButton v0.2 amendment — no hover motion

## Owner decision

After removing hover motion from Button (#242) during the visual review on main (2026-11-01), the owner extended it: "a iconButton si, a link no".

## Changed promise

- Hover feedback is background, border, shadow and glow only; the root no longer lifts (`-translate-y-0.5` for ghost, `-translate-y-px` for the other variants). The motion-reduce hover reset is no longer needed.

## Unchanged

- Press feedback (`motion-safe` `scale-94` on `:active`), focus ring, disabled behavior, variants, sizes, accessible-name contract and public API.
- Link keeps its arrow nudge on hover (owner decision).
