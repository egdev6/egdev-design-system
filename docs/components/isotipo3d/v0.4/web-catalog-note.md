# Isotipo3D v0.4 — web catalog note (appended, not an amendment)

**Appended 2026-11-02 on top of the approved v0.4 text. It rewrites nothing and reopens no decision.** The [contract recovery](contract-recovery.md) and its `## 1. Purpose and scope` payload, including the recorded `contentSHA256`, stay exactly as approved.

## What this note records

- The v0.4 exclusion of the director choreography **stays valid for this component**: Isotipo3D still owns no scroll choreography, no `window.PULSO`, no slot travel/lookup, no anchor masks and no viewport-fixed canvas. Its list of explicit exclusions is unchanged.
- Choreography is now **owned by the future HomeTemplate in `@egdev/effects`**, not by the web app. This is the web catalog v0.1 owner approval recorded on 2026-11-02 in [owner-approvals.md](../../web-catalog/v0.1/owner-approvals.md) (source draft: [cataloging-draft.md](../../web-catalog/v0.1/cataloging-draft.md)). The [web consumer amendment](../../../CATALOGACION.md#web-consumer-amendment-approved-2026-11-02) states it as a rule: the component still does not choreograph, and the template contract owns it instead.
- The web catalog also approved a **future variant gap** for this component: named zone poses (hero, chapter, lab, outro) supplied as inputs, **without choreography**. Poses are values a host passes in; the scroll behaviour that selects them belongs to HomeTemplate.
- Everything else in v0.4 is unaffected: classification as an atom effect in `@egdev/effects`, the root marker, the SVG fallback, the interaction amendment and the pending browser/packed-consumer verification.

This note is a catalog decision only. The zone-pose variant still needs its own approved spec on this component, then a separately approved plan, before any code.

## Links

- [Owner approvals](../../web-catalog/v0.1/owner-approvals.md)
- [Cataloging draft](../../web-catalog/v0.1/cataloging-draft.md) — §3 variant gaps
- [CATALOGACION.md — web consumer amendment](../../../CATALOGACION.md#web-consumer-amendment-approved-2026-11-02)
- [Approved v0.4 contract recovery](contract-recovery.md)
