# Isotipo3D v0.3 — local reference and naming consolidation

Retain three original source captures and register `scene`, `progress` and `pointerTilt` for #47. This is a bounded specification-support unit, **not completion of the specification workflow**. No React implementation, full-contract approval, dependency approval or publication is claimed.

## Scope and authority

- Canonical component issue: [#47](https://github.com/egdev6/egdev-design-system/issues/47). Its initial body and published v0.2 comment remain unchanged.
- Parent reports the owner's **“ok”** to: “¿Autorizás conservar las tres capturas como referencias —Lab con recorte y fallback solo geometría/paleta— y registrar las convenciones scene, progress y pointerTilt? Sin instalar three, implementar ni publicar todavía.”
- This explicitly permits local tracked capture/naming consolidation only. The exact question, reply, provenance and limits are recoverable in [capture adoption](../../docs/components/isotipo3d/v0.3/capture.json) and the [new naming receipt](../../docs/decisions/prop-naming-isotipo3d-approval.json).
- Source execution/capture was separately authorized by an earlier parent-observed **“si”** to read-only hosting, Playwright and original Google Fonts/jsDelivr resources. The parent executed the unchanged original preview and viewed all three real PNGs. This unit executes no source, browser, server or network work.
- Conversation provenance is parent-observed, not provider-native, signed, independently reviewed or per-payload serialized human approval. No public conversation URL or timestamp is invented.

## Tasks

| ID | Status | Work / evidence | Owner / delivery |
| --- | --- | --- | --- |
| T1 | Observed / complete before this unit | Parent source capture and inspection: three real PNGs plus raw browser observations | Parent; no new capture execution |
| T2 | Complete / locally checked | Archive exactly three byte-identical PNGs with scoped reference adoption and historical observations preserved | Local writer; byte/hash/metadata checks passed; no commit |
| T3 | Complete / locally checked | Register three approved naming conventions, reuse opacity unchanged, extend immutable receipt history and regenerate docs | Local writer; 79 naming tests passed; no commit |
| T4 | Pending / separate finalization | Refresh Draft naming status and links without rewriting historical raw evidence; rehash and obtain full-contract/target-difference approval | Parent; not authorized in this unit |
| T5 | Pending / separate delivery | Independent review, delivery PR and exact #47 add-comment handoff with public asset access/hash verification | Parent; no PR, comment, staging, commit or push here |
| T6 | Not started / separate approvals | Implementation plan, exact peer/version/build/install permissions and later implementation/consumer checks | Parent and owner; no implementation |

## Reference boundaries

| Reference | Local archived source | Adopted use / exclusion |
| --- | --- | --- |
| VIS-01 | [Hero](../../docs/components/isotipo3d/v0.3/hero--progress-1--1280--dark.png) | Assembled source geometry/palette/pose; stage framing is not target Material |
| VIS-02 | [Lab](../../docs/components/isotipo3d/v0.3/lab--progress-0.50--1280--dark.png) | Full-explosion plateau at .50 with visibly clipped large pieces; 90% fitting refers to assembled bounds only, not full-explosion containment |
| VIS-03 | [SVG](../../docs/components/isotipo3d/v0.3/assembled--source-fallback--1280--dark.png) | Geometry/palette only; no legacy glow/float adoption or forced-failure/React evidence |

Viewport 1280×900, DPR 1, actual sampled Chrome/148.0.0.0. Metadata sample times are not exact screenshot times; normal animation was not frozen. Bundle CSS inspection was read-after-capture, not a pin of exact loaded stylesheet bytes. All public image URLs remain null.

## Naming decisions

| Semantic ID | Name | Approved semantic SHA-256 |
| --- | --- | --- |
| `effect-scene` | `scene` | `a0ddc8aa8c8209ef712164e164408cf2e0d49d7b1ff11a9497d7e40c78f37818` |
| `effect-progress` | `progress` | `5d3b9c8baefc158b078147f53b76a57f54a63e825c105f63f638010c2188a4b9` |
| `pointer-tilt` | `pointerTilt` | `4dd09b904cc3152e23929278dda86055a623f6c837977a691d7f7f93d71e5c00` |

Semantic lookup was repeated across meanings, canonical names and aliases: `effect-profile`, measurement/task-progress, lifecycle/presentation and `signal-pulse` concepts do not cover these responsibilities. Reuse `layer-opacity` unchanged. New entries have `usages: []`, no aliases/exceptions or speculative React source evidence. The receipt retains the original proposed JSON and proposed semantic hashes separately; status participates in hashing, so promotion changes each semantic digest.

## Verification log

- Test-first naming validation: focused `node --test --test-name-pattern=Isotipo3D scripts/prop-naming.test.mjs` failed before receipt/registry addition (3 missing-receipt failures), then passed all 3 tests. Negative cases cover stale semantic approvals, refreshed-but-unreviewed content, changed predecessor bytes/pins and missing history, entirely in memory.
- `pnpm props:docs` regenerated the official view; `pnpm props:check` passed; `pnpm test:props` passed 79 tests, preserving all prior semantic/history checks.
- The untouched ignored-local snapshot validator passed, and its 19 regression tests passed. These inspect document/capture integrity only, not React behavior or full-contract approval.
- Read-only consolidation integrity passed: 3 archived PNGs equal original bytes, 8 historical Draft/plan/metadata/validator inputs unchanged, 6 predecessor receipts unchanged, and 125 original registry entries reconstruct their exact pre-edit registry SHA-256 `b5d1ffd75c8ded3c976115db39d9515f0ce321bdc15892fb63156309feea9adc`; new count 128.
- Targeted formatting touched only the new tracked JSON/code and registry; no historical receipt/raw metadata was formatted. Targeted Biome passed for all 4 supported JSON/code files (Markdown is not processed by Biome); `git diff --check` passed. Global lint was intentionally not run: known ignored metadata JSON failures are outside scope.
- Exact foreground commands, exit codes, stdout/stderr and additional integrity checks are retained under ignored `.playwright-mcp/specs/isotipo3d/consolidation-evidence/`. No background tool was available; every command is finite with a timeout of at most 30 seconds.

## Next finalization unit — recommendations only

Do **not** change the fixed ignored Draft or validator in this unit. The input Draft at `.playwright-mcp/specs/isotipo3d/isotipo3d-v0.3.md` remains whole-file SHA-256 `a926e56dfc4b28d257f3cdabfeab7f4ac9e51c765030848d09190d7d3afaacfc`; anchored canonical SHA-256 `8e2c363cc6871657789e94b17b68ddeaae3d6a358fe55ebbaa828b2f0e24389c`, 49,890 bytes.

For the next authorized finalization:

New tracked receipt whole-file SHA-256: `7b2518dfd984374f3eb2b632040ff4faab8015c42be4617c26ed03803e338b60`. New tracked capture metadata whole-file SHA-256: `aec9a733c55c27f73bc17a08d755a110585cba369424b7a353244a9c19a73a4b`. These identify this consolidation, not approval of a future revised Draft.

1. Reconcile the Draft's pending naming language/proposals with the new naming receipt, retaining the original proposed payloads as history. Use links from that Draft directory to `../../../docs/decisions/prop-naming-isotipo3d-approval.json` and `../../../docs/prop-naming.md`.
2. Link its visual section to `../../../docs/components/isotipo3d/v0.3/capture.json` and the three archived filenames above. Distinguish newly scoped source-reference adoption from unchanged historical Proposed/Observed records; retain Lab clipping, SVG geometry/palette-only and no-stage-chrome limits.
3. Preserve PNG hashes `48a0c0c425d6b7b33c0c53711c062767472ea090be3f1614e9445d11c9bb8ff1`, `ce33c7d90e8fbe42a3cb3d207bee6715a443e7136bf3bfc4792b2772529642e4` and `cb2412989d99da261e3a869061397bb283bbc31b1c5fce669743a809bcbd0aaf`; never present them as approved React pixels.
4. Any canonical payload change needs a fresh anchored digest and separately authorized validator/plan reconciliation, followed by final full-Draft approval. The proposed required exact `three` 0.160.0, implementation plan, installation/build changes, asset publication and exact add-comment approval remain independent pending gates.

Peer-owned untracked `.agents/` and `CONTRIBUTING.md`, other unrelated files, all six historical receipts, original PNGs/raw observations and the ignored Draft/plan/validators are outside the edit surface and preserved.
