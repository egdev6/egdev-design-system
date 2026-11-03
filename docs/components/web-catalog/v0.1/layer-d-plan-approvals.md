# Layer (d) — plan approvals

Tracking: `odd/tasks/web-catalog.md` L31 and later entries.

## Batch 1 — SectionShell, TopBar, Footer (2026-11-03)

Owner decisions (verbatim):
- SectionShell plan: "Aprobar plan y gates (Recomendado)" — gates 1–6 resolved as recommended in the plan: the five register recipes, the host-composed group-edge fade, the naming conventions `section-register` / `register` and `section-content-wrap` / `wrap`, the sticky Lab escape excluded from v0.1, bounded local legacy neutralization, and VIS-01 adopted for the surviving four-register intent with its stated limitations.
- SectionShell tokens: "Aprobar los cuatro tokens (Recomendado)" — add exactly these values to `packages/tokens/src/theme.css` as part of the SectionShell implementation:

  ```css
  --gradient-section-show: radial-gradient(45% 55% at 22% 50%, var(--color-alpha-red-12), transparent 70%);
  --mask-section-fade-top: linear-gradient(180deg, transparent, #000 clamp(96px, 14vh, 180px));
  --mask-section-fade-bottom: linear-gradient(0deg, transparent, #000 clamp(96px, 14vh, 180px));
  --mask-section-fade-both: linear-gradient(180deg, transparent, #000 clamp(96px, 14vh, 180px), #000 calc(100% - clamp(96px, 14vh, 180px)), transparent);
  ```

- TopBar plan: "Aprobar plan y gates (Recomendado)" — G1–G4 resolved as recommended: the TopBar-local 900px container mechanism inside (not on) the fixed header, the existing-token glass overlay with solid reduced-transparency fallback and host-owned transparent state, and utility-only local legacy neutralization; each conditional on the emitted-CSS and browser proof the plan requires.
- Footer plan: "Aprobar plan y gates (Recomendado)" — gates 1–6 resolved as recommended: the inclusive `[@media(width<=860px)]:` breakpoint, token-backed hairline boundaries with host-owned background, local legacy neutralization, the existing registry entries `collection-items`, `accessible-name` and `heading-level`, and the stop condition if the unmodified `Link` cannot reach a 44px target.

Parent evidence before approval: a probe mirroring `packages/ui/src/styles/compiled.css` against the installed Tailwind 4.3.3 compiler showed that `md:` emits nothing, while `@container`, `@max-[900px]:`, `max-[520px|860px|1080px]:`, `[@media(width<=860px)]:`, a static `[clip-path:polygon(...)]` and `bg-fg-default/18` emit. `max-[X]:` and `@max-[X]:` compile to exclusive `width < X` ranges.

The following exact whole-file SHA-256 values pin the approved plans at merge commit `0ad7cf56383b8903dc9b882feaec8225fdf45b9c` (PR #303). Their Proposed headers are historical snapshot metadata; this record supplies implementation approval. Preserve these plan files unchanged.

| Component | Plan | Whole-file SHA-256 |
|---|---|---|
| section-shell | `docs/components/section-shell/v0.1/implementation-plan.md` | `0b62bfd213b8cca5337a616457e904f1d1059bbd52891ef61489b72a3b66fc2e` |
| top-bar | `docs/components/top-bar/v0.1/implementation-plan.md` | `cc6f23fae4b3f20336cc53e24e8b9860f81406d43eaee5df750678f4163283ab` |
| footer | `docs/components/footer/v0.1/implementation-plan.md` | `1009fa7b5879b44e4b9fd7b70dd572923be90aeaa346d5a169fbb58d36ebd5ce` |
