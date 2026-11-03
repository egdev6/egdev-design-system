# SectionShell v0.1 — proposed versioned snapshot handoff

**Proposed — not ready for implementation.** The seven owner questions in the [full local snapshot](spec.md) remain blocking. This is a prepared handoff, not a posted issue or comment.

- Version: `0.1`
- Canonical payload SHA-256: `8efab611751597184f80f03eb7b6ed405287078d26b971ccb2c746d15f195558` (full `## 1. Purpose and scope` line to EOF in `spec.md`, UTF-8, LF)
- VIS-01 SHA-256: `da7aa002707b0c66dec602c72c5ae3f376226d928de32968dee438a47b83b4c7`
- Approval reference, canonical issue and latest published comment: Pending.
- Catalog authority: `scripts/catalog_data.py:120` and `docs/components/web-catalog/v0.1/owner-approvals.md`; approved five-register template for `@egdev/ui`. Foundation source is read-only; `odd/tasks/web-catalog.md` L6, L15 and L25 authorize this capture and handoff.
- API proposed: `register` (five named values), `wrap`, `children`, native `id`, `data-zone`, and host-supplied `aria-labelledby` or `aria-label`. Exact registry lookups: pending new `section-register` and `section-content-wrap`; existing `visual-treatment`, `surface-material-tone`, `guide-zones`, `layout-gap`, `inner-padding`, `portal-container`, `field-message-content` and `accessible-name` were considered and are not reused for different semantics. Naming approval is separate.
- Open choices and recommendations: five registers with separately approved Material recipes; group-composed top/bottom fades; token-based viewport and nav compensation with separately specified sticky-scene escape; default wrap with opt-out; host-supplied `data-zone`, no effects; named native section via heading reference or label; organisms may but need not be inside the shell. See the full snapshot for alternatives, evidence and acceptance tests.
- Legacy `.eg-section*` rules, pseudo-elements and Grafito descendant overrides collide; a future separately approved plan must neutralize them locally and prove legacy coexistence without editing the legacy stylesheet.

VIS-01 is the Foundation four-register preview board, captured in Chromium at 1280×1400, 2×, dark, en-US; original fragment plus Foundation CSS, 250px preview-only minimum height, HTTPS blocked. `capture.json` records provenance and limits; Grafito and fades are not pictured. **Visual conformity: Not evaluated.**

**Image handoff pending:** the local PNG is not GitHub-visible. Before publication, the parent must use an authorized human attachment or bounded asset-publication route and verify the actual accessible image bytes against VIS-01. No URL or publication is implied.

**Recoverable snapshot handoff pending:** `spec.md` is the full exact payload, but this local relative link is not yet a verified immutable GitHub-accessible snapshot. Before posting this comment, the parent must replace the link with a verified immutable accessible snapshot or embed the full exact payload, then verify its digest and obtain authorization for the precise issue/comment action. One canonical issue per component; subsequent versions are authorized comments. Spec, conventions, visuals, tokens, recipes and implementation plan have separate approval scopes. No GitHub action or implementation is authorized here.
