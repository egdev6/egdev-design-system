# ScrollReveal v0.1 — owner approval

## Approved snapshot

- Spec: `spec.md`, canonical payload SHA-256 `7048c85eb9c2997349ad100bdae32e0e301701a412cc447f021cd9f4d0df2101`.
- Approval channel: primary interactive Pi session `01a1910a-607e-77cc-a3dc-b39bbbbf10a6`, structured owner choices.
- Final spec choice, verbatim: **"Approve spec and recommendations"**.
- This resolves OQ-1/3/4/5/6/7/9 as recommended, retaining the previously selected OQ-2/8/10 decisions (tracking L52).
- Approved preview: Public name ScrollReveal; source data-reveal/data-wipe markers and data-state states; explicit finite nonnegative delay; once-only with no replay API; per-instance observer with cleanup and fail-open visibility; immediate focus reveal; reduced motion; bounded wipe cancellation cleanup; CVA/data variants and No stylesheet.

## Independent decisions

- Naming, verbatim: **"Approve both conventions"** — `entrance-variant` / `variant` (reveal or wipe), `entrance-delay` / `delay` (finite nonnegative milliseconds). Registry usages and receipts belong to the separately approved plan/implementation.
- Visual references, verbatim: **"Adopt with documented differences"** — captures in `capture-observed.json` and `capture-motion.json` are adopted as scoped behavioral design references with the recorded file-URL resource limitations and sampling/screenshot timing difference. Source rise 24px is replaced by the selected existing-token 22.4px rise; no exact pixel parity is promised.

## Authority boundary

This approves the specification and independent naming/reference choices, not implementation, token edits, dependency changes or publishing. The proposed `--duration-wipe: 800ms` and scoped delay custom property remain subject to a separately approved implementation plan. The frozen spec payload is not rewritten; its Proposed metadata records the pre-approval snapshot, and this file supplies the recoverable approval.
