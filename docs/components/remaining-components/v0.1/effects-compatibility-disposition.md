# Effects — compatibility disposition proposal

- **Status:** Proposal/navigation only; bounded compatibility-risk acceptance **Pending**. Not final-plan approval, independent verification, a signed/native receipt or execution permission. Parent is still reviewing returned plans.
- **contentSHA256:** sha256:77a76a5ecc5157b5811baa97ed09bf3d89a5bb0bb796c346bc9b8a8e8f832133
- **Hash definition:** SHA-256 of UTF-8 LF bytes from the unique actual whole-line heading matched by multiline `^## Compatibility disposition proposal$` through EOF, including final LF. Exclude tracking metadata and its inline heading mention.

## Compatibility disposition proposal

**Propose accepting the selected dist-only boundary with no legacy aliases or automatic migration, subject to the exact bounded owner decision below.** Utility A and dist-only direction are already selected; do not reopen that questionnaire. This proposal does not certify universal consumer coverage or approve all runtime plans.

### Bound review inputs

| Input | Canonical boundary → EOF, UTF-8 LF/final LF included; SHA-256 |
| --- | --- |
| [FX-O — scoped owner choices](effects-owner-decisions.md) | Actual whole-line `## Decisions`; `636e5a37c41e3896920f9a728349978a09cb1e5e11d5a03498f88b540602cb61` |
| [FX-I — W3 compatibility inventory](../../../../../collapsible/docs/components/remaining-components/v0.1/effects-compatibility-inventory.md) | Actual whole-line `## 1. Authority and inventory boundary`; `1f952925e4e46e83e714805a77d305ca6720c3a9d85cb6131603fdb1f3cbe3b5` |
| [FX-P — reconciled common proposal](effects-integration-plan.md) | Actual whole-line `## 1. Decisions and authority`; `bae5b2351b711927b89f8dd5b60de637fa52e1a7b9a981ef0607c3fc522aa3ad` |

FX-I binds six tracked package files/archive closure at baseline f88b36e and the parent-supplied external record `/tmp/egdev-remaining-odd/effects-external-inventory.json`, whole-file SHA-256 `f26bdb49c01805195bab9c694bed9537289653af914d5f20c28edc4bc211dfc0`. Parent reports reading the inventory and checking those bindings. This writer performs no fresh network query, consumer search, tarball inspection or independent-verifier review.

### Evidence versus remaining unknowns

- **Observed bounded repository evidence:** current main is src/index.ts, files allow src/reference, no export map, empty React barrel. FX-I found no tracked app import/require/dependency on effects or HTML script tag naming the archives; it did find documentation, discovery/workspace workflows, archive APIs and an actual recorded inlining harness. No tracked application-migration list was established; that is not proof none exists.
- **Observed bounded external evidence:** public npm endpoint returned 404 at the recorded time, yielding no metadata/tarball; the exact-text/account-scoped GitHub query returned two hits in this repository. These findings do not establish no historical/private/mirrored publication or no other consumers.
- **Unknown, not excluded:** private applications, developer-local/workspace/link/file consumers, other checkouts, aliases/computed imports, vendored copies, served/copied script/CDN URLs and direct-script integrations. Public404 and a bounded query cannot waive this residual-risk decision.

### Proposed boundary and handling

| Surface | Proposed disposition, not an applied change |
| --- | --- |
| Supported package imports | Only `@egdev/effects` (approved public values/types through root) and `@egdev/effects/styles.css`. Native consumers additionally load canonical token CSS; no UI CSS. Root/styles map and complete dist JS/declaration/CSS/lazy-chunk/asset closure still require final-plan approval and later artifact checks |
| Old source paths | `@egdev/effects/src/index.ts`, other package `src/**` and source-addressed file/workspace/package URLs lose shipped source or deep resolution; no compatibility alias/wildcard or automatic rewrite |
| Old archive paths | `@egdev/effects/reference/particle-streaks.js`, `@egdev/effects/reference/pulso-director.js`, `@egdev/effects/reference/pulso-iso3d.mjs` lose their package files; served/copied URLs relying on those removed package files can break, while existing independent copies are not automatically removed. No automatic substitution of React components for DOM/global script contracts |
| Other deep paths | Package.json and non-exported engine/helper/dist-internal paths are not supported imports under the proposed restrictive map, even where pack rules include bytes. Unknown affected consumers remain a stated risk |
| Repository archives | Preserve exactly `packages/effects/reference/particle-streaks.js`, `packages/effects/reference/pulso-director.js`, `packages/effects/reference/pulso-iso3d.mjs`, unchanged in the repository; do not delete, execute or rewrite them in this task |
| Recorded inlining workflow | Historical [Ambient capture metadata](../../ambient-background/v0.3/capture.json) can continue identifying/reading the unchanged repository source for its recorded inlining harness, not removed package/archive URLs. Repository preservation does not preserve package deep imports or certify legacy CDN/DOM execution; any later harness run requires its own authority |

Keep selected A: exact CVA0.7.1 + public @egdev/ui workspace:* cn, accepted UI/Radix/ReactDOM/build-order coupling, no UI CSS/private cn helper and no assumed tree-shaking benefit. Retain exact required three/dev typing pins and lazy/lifecycle/engine exceptions from the returned plans; this compatibility proposal changes none of them.

### One remaining owner decision — Pending

**Accept FX-D's bounded remaining compatibility risk/disposition on FX-I's stated evidence and unknowns, or request additional named consumer inventory before execution?**

1. **Accept this disposition:** retain the proposed root/styles-only, no-alias/no-automatic-migration boundary and explicit unknown-consumer risk. This is compatibility-risk acceptance only, not approval of every plan statement, a universal no-consumer finding or already-approved migration work.
2. **Request additional named inventory:** select one or more of private EGDEV application manifests/imports; developer-local workspace/link/file consumers outside this checkout; served/copied archive/script/CDN URLs and direct-script integrations; private/mirrored registry publications/tarballs. Parent must authorize any such bounded investigation separately; it is not performed here.

No version/semver, release/publication, deletion, export alias, automatic migration or manifest action is authorized by this draft or by shorthand acceptance of its direction. If further evidence requires a migration, alias, archive export or changed boundary, return that exact proposal for separate approval. After compatibility disposition, parent must finish semantic review, obtain separate exact final-plan approvals and issue fresh runtime/integration assignments; Git/GitHub actions remain separately gated. Existing component/source/visual/fixture/naming/AT gates are not satisfied by this answer.

Returned plans retain earlier concurrent-handoff/stale-index notes as historical coordination context; [the decision index](approval-decision-index.md) now refreshes actual byte bindings only. No component plan or inventory is edited or certified by this navigation proposal.
