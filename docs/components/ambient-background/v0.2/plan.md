# AmbientBackground — U11 implementation plan

The approved spec bytes and parent defaults are recorded in `approval.md`. Extend the existing six files and private `particleStreaks.ts`; no stylesheet, token, dependency, new engine module or public barrel change.

- Add optional `lineDirection` and `squareDirection`, each accepting `up`, `up-right`, `right`, `down-right`, `down`, `down-left`, `left`, `up-left`. L26: names follow visible screen direction; default = today's motion. Map these in that order to 270°, 315°, 0°, 45°, 90°, 135°, 180°, 225° respectively; omitted or invalid values use `up-left` (225°). In canvas coordinates the engine computes `(cos θ, sin θ)`, with x right and y down. The default preserves the historical geometry.
- Profile counts, speed, glow, narrow scaling, one canvas and one animation loop remain unchanged. Per-family direction alters each family's position and line rotation only; preserve particles on updates and redraw static reduced-motion frames when directions change. Forced colors still hides the canvas.
- Runtime invalid values fall back per family and issue a development warning. Root remains decorative and protected; supported layout merging and native forwarding remain unchanged.
- RED through rendered component/canvas traces: independent directions, each angle, invalid fallback, static updates, forced colors and unchanged particle/draw counts. PRESERVE all three profiles and lifecycle. Add a non-parallel story. Run focused tests, typecheck, Biome and effects build; browser visual and frame-time checks remain pending.
