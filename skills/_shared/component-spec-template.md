# Plantilla de contrato individual de componente

Define qué promete un componente antes de planificar su implementación. Complementa el [contrato general](component-contract.md); no duplica ni sustituye sus normas.

## Cómo usarla

- Copy the English schema below; replace placeholders without inventing defaults, evidence or approval. Write all generated documentation, metadata, JSDoc and visible examples in English; do not translate unrelated legacy prose.
- Use “Not applicable” with reasons. Separate proposals, verified implementation and planned checks; cite inspected paths/symbols/results.
- Present a version for explicit human approval; persist only with permission. Changed promises need new approval; an approved spec does not approve the implementation plan, tokens/dependencies or external mutations.
- For an explicitly requested issue, follow [issue handoff](../component-spec-proposer/references/issue-handoff.md); open blocking choices cannot be exported as implementation-ready.

---

# Component contract — <ComponentName>

- **Version / status:** <version; Draft or Approved only with explicit human approval>
- **Approval / recovery:** <pending or recoverable approval of this version; agreed spec location, save only with permission>
- **Current situation / pending decisions:** <new or existing; verified vs proposed; missing evidence and blocking questions, or none>
- **Snapshot identity:** `version: <version>`; `contentSHA256: <digest or Pending before finalization>`; `visualHashes: <VIS ID → SHA-256 or Pending>`; `approvalReference: <recoverable scoped human reference or Pending>`; `canonicalIssue: <one component issue URL or Pending>`; `latestPublishedComment: <latest snapshot comment URL or Pending; initial body is not a comment>`.
- **Hash definition:** SHA-256 of the UTF-8 canonical payload from `## 1. Purpose and scope` through EOF, with LF line endings and the recorded final newline. All tracking metadata stays above that heading and is excluded, avoiding a self-referential digest. Finalize the digest before publication; approval must bind this version, digest and identified visuals, not mutable prose or memory.

## 1. Purpose and scope

- **Need / non-goals:** <responsibility, use cases and exclusions>
- **Cataloging decision / alternatives:** <reuse | variant | compose | extract | new; justify preceding rejected options>
- **Evidence / level and package:** <inspected public React paths, props and exports; location justified by responsibility>

## 2. Anatomy and composition

| Part | Responsibility | Native element / Radix primitive | Allowed content |
| --- | --- | --- | --- |
| <root or part> | <function> | <element or primitive> | <content> |

- **Radix / composition:** <available individual package or justified none; reused pieces, asChild constraints>
- **Public markers:** <stable root and existing/proposed part markers; compatibility obligations>

## 3. Public API

- **Prop conventions:** consult the [canonical registry](prop-naming.json), [generated view](../../docs/prop-naming.md) and [lookup workflow](component-contract.md#prop-naming-registry). Record exact applied entry IDs/prop mappings, new semantic-ID proposals and component-specific types with reviewed `source: {path, symbol, revision}` (`sha256:<whole-file byte hash>`). Exceptions identify component `scope`, alternative `propName`, `reason` and null/pending or structured `approval`. Keep convention/spec approval separate: approved/deprecated conventions need recoverable `{reference, scope, contentHash}` with exact `convention:<id>` scope; approved exceptions use `exception:<id>:<scope>:<propName>` and the documented exception hash. Structural references/hashes cannot prove consent or API types; never invent approvals or silently refresh stale source evidence. Link rather than duplicate the global matrix; inherited native props/`className` are not automatically own conventions.

| Prop / event | Type | Required | Default or rule | Description |
| --- | --- | --- | --- | --- |
| <name> | <complete type> | <yes / no> | <value, derived rule or none> | <public promise> |

- **Native props / refs:** <inherited element, destination and restrictions; ref type and actual target or no refs>
- **Controlled / uncontrolled:** <initialization, state props and notifications or Not applicable>
- **Compatibility:** <API, public exports/markers and existing consumers; React-version evidence, not type-only claims>

## 4. Behavior

| Initial state / action | Expected result | Emitted event |
| --- | --- | --- |
| <state and action> | <observable result> | <event and payload or none> |

- **States / representation:** <transitions; Radix/ARIA/own data-state attributes, not mirrored classes or visual variants>
- **Limits / consumer responsibilities:** <disabled, empty data, boundaries, repeated actions and unmanaged behavior>

## 5. Accessibility

- **Accessible name / roles / relationships:** <source, required consumer input, native/ARIA semantics and related ids>
- **Keyboard / focus:** <keys and results; native/Radix/justified owner; entry, navigation, exit and restoration>
- **Announcements / other conditions:** <changes announced and mechanism or Not applicable; touch targets, non-color cues; component vs consumer guarantees>

## 6. Appearance

| Variant axis | Allowed values | Default or rule | Combinations / restrictions |
| --- | --- | --- | --- |
| <axis including size when applicable> | <values> | <value or rule> | <compatibility> |

- **Tokens / Material:** <existing token-backed Tailwind utilities, CVA in types.ts; Surface/recipe and definition location; state-specific visual treatments, well/overlay/solid, focus, reduced motion/transparency; no hardcoded values>
- **Dynamic geometry:** <only an explicitly approved limited mechanism; Gauge numeric diameter uses static `w-[var(--eg-gauge-size)]` / `h-[var(--eg-gauge-size)]` plus inline numeric CSS-pixel `--eg-gauge-size`, presets use approved token utilities. No interpolated class strings or inline appearance; validation/bounds remain separate policy decisions>.
- **Class composition / consumer layout:** <supported className surface and precedence per part, cn/clsx/twMerge limits and tests; defaults/variants remain appearance API, no arbitrary overrides>
- **Seven-file gate / pending proposals:** <meaningful roles for types.ts, useComponentName.ts, ComponentName.tsx, component-name.css, ComponentName.test.tsx, ComponentName.stories.tsx, index.ts; approved compliant CSS role, minimal global CSS/exceptions and token/dependency confirmations. Without a meaningful compliant CSS role STOP for human resolution, never dummy files, fake hooks, omission or replacement>

### Expected-design visual reference

Follow the [capture guide](../../docs/design/README.md): real requested images in `docs/components/<kebab-name>/v<spec-version>/`, linked from the actual spec location. Reused historical captures retain their original capture version, hashes and limits; record current spec and source capture versions separately. Current implementation is not approved expected design without explicit adoption.

| Visual ID | Real image / descriptive English alt text | Variant / state / props | Source and version | Status / recoverable approval |
| --- | --- | --- | --- | --- |
| VIS-01 | <real relative image or Pending, never fake links> | <principal and agreed additional scenarios> | <URL/story/canvas and commit/version; expected or observed> | <Proposed / Approved; spec version and human reference> |

- **Conditions / provenance per VIS ID:** <viewport, device scale, browser/version, theme, loaded fonts, motion/transparency, crop/full page; date/tool or supplied-image provenance and verification limits>
- **Intent / acceptance / pending evidence:** <anatomy, Material, typography, spacing/tokens, allowed differences; related AC IDs and missing source/capture/approval/conditions; never infer tokens from pixels>
- Without recoverable approved references and comparable conditions, visual conformity is **Not evaluated**. Captures do not replace behavior/accessibility tests; preserve previous expected-design versions and obtain new approval for changes.

## 7. Acceptance criteria

| ID | Observable promise | Planned test / method | Planned story / visual check | Observed evidence |
| --- | --- | --- | --- | --- |
| AC-01 | <given/when/then> | <case and file or justified Not applicable> | <scenario and VIS ID or justified Not applicable> | <Pending or actual result/reference> |

### Spec closure

- [ ] All seven blocks are complete or justified as Not applicable; no blocking promise decisions remain.
- [ ] New/changed own props have registry lookup evidence, exact applied/proposed IDs and reviewed exceptions; convention approval remains explicit and separate, including in issue handoffs.
- [ ] Proposals, verified implementation, planned test/story matrices and observed results are distinct; each promise has an acceptance ID and suitable method.
- [ ] Visual IDs identify real image provenance, conditions and related criteria; pending captures are not verification.
- [ ] Snapshot identity is recoverable; human approval identifies this exact version, content digest, visual hashes and scope; otherwise status remains Draft.
- [ ] One canonical component issue is retained; subsequent versions are authorized comments with reason, compatibility impact, capture links/IDs, previous-comment link and recoverable full snapshot, never silent body edits or one issue per version.

**Next step:** propose the implementation plan and await separate approval; this spec authorizes no code, token/dependency changes or external writes.
