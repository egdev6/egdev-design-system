# Layer (e) — plan approvals

Tracking: `odd/tasks/web-catalog.md` L45 and later entries.

## Batch 1 — Hero, Closing (2026-11-03)

Owner decisions (verbatim):
- **Hero plan:** "Aprobar plan y gates (Recomendado)". This approves the six recommended gates:
  1. Hero-local inclusive 860px and 961px responsive geometry and square sizing, conditional on compiler and boundary proof.
  2. The delivered SectionShell show host and Heading hero glow, without additional Hero-owned glow, conditional on contrast and Material verification.
  3. The exact `scene-media` and `scene-social` naming conventions.
  4. Bounded legacy and no-preflight neutralization with no stylesheet, conditional on production and packed Chromium cascade proof.
  5. Adoption of VIS-01/02 for surviving intent and the stated differences, subject to capture provenance and comparable conditions.
  6. Consumer responsibility for named independent CTAs, decorative nonfocusable media and a named social group, with actual control targets, focus, keyboard and contrast verified.
- **Closing plan:** "Aprobar plan y gates (Recomendado)". This approves the six recommended gates:
  1. Closing-local inclusive 860px responsive geometry and square token-unit-capped sizing, conditional on compiler and boundary proof.
  2. The SectionShell show host, delivered typography and existing Heading glow, with the stated sizing and source-glow differences and actual host contrast verified.
  3. The exact `scene-media` naming convention.
  4. Bounded utility-only legacy and user-agent cascade neutralization, conditional on built CSS and computed-style proof.
  5. Consumer responsibility for independently named CTAs and decorative noninteractive media, including actual control targets and focus.
  6. Adoption of VIS-01/02 for surviving intent and stated visual differences, subject to capture provenance and comparable conditions.

Parent evidence before approval ([ODD L45](../../../../odd/tasks/web-catalog.md)): all utilities used by both plans emitted against the installed compiler, including the inclusive 860px variants, `grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]`, `w-[min(100%,62vh)]`, `[@media(width<=860px)]:w-[min(100%,34svh,calc(var(--space-24)*4))]` and `aspect-square`. The probe extracted 54 Hero and 36 Closing candidates from every backtick span; `aspect-video`, `md:` and exclusive `max-[860px]:` appeared only as prohibited.

Whole-file SHA-256 values at merge commit `5f4b6d5060ebe9bb1ada52f033f9c4e4e22ac36a` (PR #320):

| Component | Plan | Whole-file SHA-256 |
|---|---|---|
| hero | `docs/components/hero/v0.1/implementation-plan.md` | `11906914c6cc8b6f5eddade2a14a3f3415061727408e4e03c34e09901de8eb82` |
| closing | `docs/components/closing/v0.1/implementation-plan.md` | `a5e037857cdea70ff9751f4590349b7b5d1506af3bc9654f3e0cdd7d6594a127` |

The Proposed headers are historical snapshot metadata. This record supplies the forwarded plan and gate decisions; the specified proof and separate delivery decisions remain necessary.

## Batch 2 — ChapterBreak, LabStage (2026-11-03)

Owner decisions (verbatim):
- **ChapterBreak plan:** "Aprobar plan y gates (Recomendado)". This approves the six recommended gates:
  1. ChapterBreak-local inclusive 860px geometry and square token-unit-capped media, conditional on compiler and boundary proof.
  2. SectionShell show host and delivered Heading/Text, without an additional scene glow, conditional on contrast verification.
  3. Existing approved heading, lede and `scene-media` conventions only.
  4. `eg-chapter-break`, preserved legacy and no stylesheet, conditional on cascade proof.
  5. VIS-01/02 adoption for intent and stated differences, subject to provenance and comparable conditions.
  6. Host-owned section semantics and consumer-owned decorative media, effects and accessible surrounding controls.
- **LabStage plan:** "Aprobar plan y gates (Recomendado)". This approves the six recommended gates:
  1. LabStage-local inclusive 860px geometry and square token-unit-capped media, conditional on compiler and boundary proof.
  2. SectionShell show host and consumer-composed solid raised card, without an additional scene glow, conditional on contrast verification.
  3. Existing approved conventions only; native children composition, no new convention.
  4. Bounded legacy and no-preflight cascade neutralization, conditional on computed-style proof; no stylesheet if successful.
  5. Consumer-owned experiment semantics, decorative media, accessible link and measured target.
  6. VIS-01/02 adoption for intent and stated differences, with no glitch or scene animation, subject to comparable conditions.

Parent evidence before approval ([ODD L48](../../../../odd/tasks/web-catalog.md)): all used utilities emitted against the installed compiler; 33 ChapterBreak and 34 LabStage candidates were extracted from every backtick span. `aspect-video`, `md:` and exclusive `max-[860px]:` appeared only as prohibited.

Whole-file SHA-256 values at merge commit `028b82c5c3bcb54d169ca2c5ce9c09c3541c954f` (PR #326):

| Component | Plan | Whole-file SHA-256 |
|---|---|---|
| chapter-break | `docs/components/chapter-break/v0.1/implementation-plan.md` | `3da4ebfc91f346ed57a02dcbb8ca17a4577f9e5627af7f45514f778024428584` |
| lab-stage | `docs/components/lab-stage/v0.1/implementation-plan.md` | `ca8ccfae6e020b0aeeca2c35a4a313529177c595ff7660191f65ed702b3fec42` |

The Proposed headers are historical snapshot metadata; gate proof and separate delivery decisions remain necessary.
