# Web catalog v0.1 — owner approvals

Recorded 2026-11-02 from the owner's questionnaire answers on `cataloging-draft.md` (tracking: `odd/tasks/web-catalog.md`, L5).

| Decision | Owner answer | Scope |
|---|---|---|
| Policy amendment (draft §1) | "Aprobar la enmienda (Recomendado)" | The web becomes a first-class consumer. Web pieces that a new web view could reuse enter the system even if only the web uses them, with no domain data. Choreography goes to `@egdev/effects`. The Isotipo3D and AmbientBackground v0.4 contracts get an appended note; their approved text is not rewritten. |
| Scene organisms (draft §4, rule 2) | "Sí, como escenas con slots (Recomendado)" | Hero, ChapterBreak, LabStage and Closing enter `@egdev/ui` as slot-based scene organisms (copy, CTAs and the 3D/media slot are inputs; no choreography). |
| Scroll reveal/wipe | "Utilidad en @egdev/effects (Recomendado)" | A reusable reveal/wipe utility in `@egdev/effects`, with reduced motion, independent of HomeTemplate. |
| Delivery order | "Por capas (Recomendado)" | (a) policy amendment + catalog rows; (b) variants on existing components; (c) molecules; (d) navigation and section organisms + SectionShell; (e) scenes; (f) HomeTemplate. |

These approvals cover the catalog decisions only. Every component and variant still needs its own approved spec, then a separately approved implementation plan, before any code. No token value or dependency change is approved.
