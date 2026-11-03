# Footer — v0.1 proposal (prepared issue handoff, not posted)

**Readiness: Proposed — not ready for implementation.** Six owner decisions, visual adoption, and any required Material recipe and breakpoint approval remain open. No code, tokens, dependencies, registry, catalog, publication or Git action is authorized by this document.

## Snapshot identity and recovery

- Version: `0.1`; canonical spec payload SHA-256: `e52b0cfd12946e852eea24f68262bd7c7afebb5c85bcc59c7a91a7657c9364b0` (exact full heading line `## 1. Purpose and scope` to EOF, UTF-8 and final LF).
- Full local snapshot: [spec.md](./spec.md). The complete seven-block snapshot and all blocking choices are in that file. This is a draft local recovery reference, **not yet a GitHub-accessible immutable reference**. Before publication, either include its full exact payload in the issue body/comment or replace this link with a separately authorized, accessible immutable snapshot and verify the bytes and payload hash.
- VIS-01: `53d75dae7646a1f6aa770525bb335ccb68eb2966b8db54cb679b39045e03011b`; VIS-02: `23311a65bfc2bffd958a52d7c85f8c19274ae384dacfd03b3cb4d02df07665dd`.
- Approval reference: Pending; canonical issue: Pending; latest published comment: Pending. Verify the canonical component issue before choosing an initial body versus a subsequent versioned comment; never create a duplicate or silently change an existing body.

## Scope and proposal

Catalog authority: `scripts/catalog_data.py:102` and `docs/components/web-catalog/v0.1/owner-approvals.md`; capture and cadence authority: `odd/tasks/web-catalog.md` L6, L15 and L25. New `@egdev/ui` organism composing consumer-supplied motto, brand, social and legal slots plus a labelled structured section-link group. No built-in Pulso content. No SectionNav observer, page choreography, router or effects. Native footer outside `main` for the site landmark; social remains a named list under its own contract. A separate implementation plan requires owner approval.

Prop lookup: `items` → `collection-items`; navigation and item `label` → `accessible-name`; heading `level` → `heading-level`, all existing approved entries. `children`/`className` are composition/native inputs. `panel-footer` explicitly excludes site footers; `product-identity` is a structured alternative, not the proposed brand slot; `trailing-text-accent` and `accent-line-break` belong to supplied Text. No new convention or exception is proposed. Future usages require source-symbol review and the whole-file hash of the actual Footer types; spec approval does not approve registry changes.

Material and responsive implementation remain blocked: a Footer-specific boundary recipe needs approval; the proposed inclusive `max-[860px]:` is component-local and needs explicit owner authorization. CommunityCard's 48rem decision is not general authority and the SectionHeader 860px token is component-specific. Existing `.eg-footer*` rules in `packages/ui/src/styles/legacy/bundle.css:677–698` remain untouched; the plan must neutralize their concrete collisions locally and test the real cascade. No stylesheet is recommended subject to demonstrating that outcome.

## Source visuals

Parent-provided read-only Chromium captures: VIS-01 `footer--variants--1280--dark.png` at 1280×1400 and VIS-02 `footer--variants--390--dark.png` at 390×1400; both DPR 2, dark, fonts loaded, original Foundation preview board `.pv`, no-preference motion and animations disabled. Provenance, source hashes and limits are in [capture.json](./capture.json) and [capture-raw.json](./capture-raw.json). Both are Proposed; visual conformity is **Not evaluated**. Remote accessibility and matching downloaded bytes are Pending; local images are not GitHub-visible. Publication requires separately authorized human attachment or a bounded asset-publication route, then access and hash verification before linking. No URL is invented here.

## Owner decisions requested

1. Compound slots plus structured section links, or a more structured / consumer-rendered API? Recommend compound slots and structured links without Pulso defaults.
2. Native footer outside main and visibly labelled navigation, with SocialLinks remaining a named list? Recommend yes.
3. Footer-only inclusive 860px static breakpoint, SectionHeader-specific token reuse, or separately approved shared token? Recommend Footer-only static `max-[860px]:`.
4. Host-owned Grafito register/fade with a separately approved token-backed Footer boundary, or another Material treatment? Recommend host ownership and explicit boundary approval.
5. Existing brand-colored Link with no arrow, or a separate approved source-matching secondary-to-white treatment? Recommend existing Link and record the visual difference.
6. Host-managed SectionNav visibility, or Footer-managed observation? Recommend host ownership.

Evidence, alternatives, precise API and acceptance matrix are in the full snapshot. Owner review must identify this payload and both visual hashes; adoption of one does not automatically approve the others. Resolve these choices before any implementation-ready issue export. No remote read or write is implied.
