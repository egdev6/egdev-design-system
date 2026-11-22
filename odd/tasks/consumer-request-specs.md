# Specs for accepted consumer requests #538 and #540

Spec amendments (no code) for two capabilities Recado's compact note card needs, designed together: an opt-in single-line truncation on `Text` (#538) and an extended invisible hit area on `IconButton` (#540). Approval of each amendment is separate from any implementation plan.

## Specs

- S1: Owner request, verbatim: "93 merged, ponte con la specs".
- S2 (#538, owner triage decision verbatim): "Prop opcional en Text (Recomendado)" ("Reutilizable en cualquier sitio (ListItem incluido); opt-in, el texto completo queda accesible (title/tooltip). ListItem mantiene su promesa por defecto.").
- S3 (#540, owner triage decision verbatim): "Área invisible extendida (Recomendado)" ("El botón se ve igual pero su zona de toque llega a ≥44px; corrige también el incumplimiento actual de lg sin cambiar el aspecto. Requiere revisar Material y el anillo de foco.").
- S4: Follow skills/component-spec-proposer (seven blocks, prop-naming registry lookup with recorded entry IDs or new proposals, separate proposal/evidence/planned checks, no invented defaults or approval, English), the repo's amendment pattern (`docs/components/<name>/v<next>/<change>-amendment.md`), and the shared component contract. Do not implement, change tokens or dependencies, edit the registry, or publish on GitHub.

## Tasks

| ID | Specs | Route | Commit |
| --- | --- | --- | --- |
| T1 | S2, S4 | worker | drafted: docs/components/text/v0.3/truncate-amendment.md (this commit) |
| T2 | S3, S4 | worker | drafted: docs/components/icon-button/v0.4/hit-area-amendment.md (this commit) |
| T3 | S2, S3 | parent | done: both amendments approved (this commit) |

## Log

- L1 (owner, verbatim): S1, after merging egdev6/nexo#93.
- L2: Triage decisions recorded on #538 and #540 (S2, S3); both come from the same Recado compact note card (recado#41).
- L3: T1 drafted: `Text.truncate?: boolean` (default false) on every variant; opt-in makes the root block-level and inlines accents; full DOM text kept for assistive technology; the consumer owns a visible, keyboard- and touch-operable route to the full text (native `title` and Tooltip are supplementary only); consumer owns `min-width: 0` along the shrinking path; Heading and ListItem unchanged; new naming concept `single-line-text-truncation` proposed, not registered.
- L4: T2 drafted: recommends an automatic invisible hit area (no prop) on every enabled IconButton and every pointer type, a 44.8px square from `--space-14` via a static `::after`; focus ring stays on the visible button; overlap and row-spacing rules for consumers; the active `scale-94` press feedback must be proven not to shrink the effective target below 44px in the implementation plan, else stop for a revised proposal. Alternatives: opt-in `extendHitArea` (new naming concept) or coarse-pointer media queries.
- L5: Parent cross-check against the Recado card: compatible (one trailing action per row; tapping the card opens the full-text detail, which can satisfy the Text access route).
- L6 (owner choices, verbatim): Text v0.3 "Aprobar tal cual (Recomendado)"; naming "Aprobar `truncate` (Recomendado)" (`single-line-text-truncation` registered with the first reviewed usage at implementation); IconButton enablement "Automática, sin prop (Recomendado)"; pointer policy "Siempre, todos (Recomendado)". Recorded in each amendment's resolved decisions; snapshots finalized: Text v0.3 contentSHA256 fd8f0fdebc2bfd898a51cee69f94685cc64a9f877045f151fea609b202fcd799, IconButton v0.4 contentSHA256 9b79473b96a8ac9a657bcad82604c770a2fafa4228067b79e7d08567c0c116df. Both approved without new captures (visual conformity Not evaluated). IconButton press-scale feasibility stays an implementation-plan prerequisite. Next: separate implementation plans, each needing approval.
