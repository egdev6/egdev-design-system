# Consumer requests

What to do when a change in a consumer app needs a change in the design system. This page is the
canonical rule for **every** app that consumes the DS (Nexo, egdev-website and any future one).
Each consumer's CONTRIBUTING links here instead of restating it; `egdev-ds init` adds that summary
as a marked block (see the [CLI reference](../../packages/cli/README.md)).

Tracking issue: [#522](https://github.com/egdev6/egdev-design-system/issues/522).

## The flow at a glance

| Step | Who | Where | Outcome |
| --- | --- | --- | --- |
| 1. Request | Consumer contributor | DS issue | The DS-dependent part of the work stops here |
| 2. Mitigate (optional) | Consumer contributor | Consumer PR | Allowlisted composition, tied to the DS issue |
| 3. Implement | DS contributor | DS PR | Merged; the issue stays open |
| 4. Release | DS maintainer | `pnpm release:pack` | The issue is commented and closed |
| 5. Upgrade | Consumer maintainer | Consumer PR | New tarballs; mitigations removed |

## 1. Request: the control point

When a consumer change needs something the DS does not offer (a component, a variant, a prop, a
token), open an issue in `egdev6/egdev-design-system` with the
[Consumer request](https://github.com/egdev6/egdev-design-system/issues/new?template=consumer_request.yml)
form:

- Describe the **need**: what the interface must do, in which app, and link the consumer issue.
- Do **not** propose the solution. The DS decides it with
  [CATALOGACION.md](../CATALOGACION.md) (reuse → variant → compose → extract → new); often the
  answer is "it already exists, use X".
- Only the DS-dependent part waits. The rest of the consumer PR continues.

Never edit the vendored tarballs, `egdev-ds.json` or the `@egdev/*` lockfile entries in a consumer
to work around a missing piece.

## 2. Mitigate meanwhile

A consumer may ship a temporary mitigation while the DS issue is open. It has **no expiry**: it
lives until the release that resolves the issue.

**Allowed**

- Local composition of existing DS components and tokens.
- A guard allowlist entry in `<sourceDirectory>/design-system-allowlist.ts` that names the DS
  issue, with a reason. For a missing component use `kind: 'component-gap'` and the matching
  comment in code:

  ```tsx
  // TODO(egdev-design-system#123): Replace with the DS stepper.
  ```

  The entry's `issue` is `egdev6/egdev-design-system#123`. The allowlist format is in the
  [CLI reference](../../packages/cli/README.md#guard-allowlist).

**Not allowed**

- Copying or forking a DS component into the consumer.
- Hand-written colors, spacing, fonts, shadows or gradients.
- Editing `vendor/` or the vendored packages.

**Placeholders.** Before the DS issue exists, the guard accepts a pending placeholder:
`TODO(egdev-design-system#TBD-<slug>)` in code with `issue: '<localRepo>#TBD-<slug>'` in the
allowlist. The placeholder is attributed to the consumer repository because the pending action, filing the
issue, belongs to the consumer. `doctor` reports it as DS043 (warning). Replace it with the real issue number before
merging. Consumer CI runs `egdev-ds doctor <project> --fail-on-pending` as the merge check; for example,
`npx egdev-ds doctor . --fail-on-pending` from the project, after installing its dependencies (before the install,
npx would look `egdev-ds` up on the registry instead of the vendored `@egdev/cli`). Pending placeholders then cause DS043 to fail with exit 1.
The local `ds:doctor` script stays warning-only for placeholders, so drafts may hold them.

## 3. Implement in the DS

The change follows the usual DS workflow ([CONTRIBUTING.md](../../CONTRIBUTING.md), ODD when
applicable). The PR references the issue **without closing it**: use `Refs #123`, not `Closes #123`.
A merged change is not available to consumers until a release ships it.

## 4. Release and notify

When a release ([versioning.md](./versioning.md)) ships the change, the maintainer comments on
each consumer-request issue it resolves and then closes it:

> Available in `@egdev/ui` 0.7.0 (DS commit `abc1234`). Consumers can upgrade with `egdev-ds upgrade`.

Each consumer-request changelog entry must cite the DS issue as `(#N)` (see
[versioning.md](./versioning.md#changelog-format)). `release:pack` reads all versioned sections
of the packed changelogs, excluding `Unreleased`, and records resolved issues in `release.json`
with the package and first version that shipped them. After a successful text upgrade,
`egdev-ds upgrade` matches those issues to the guard allowlist and prints a removal next step for
each match, including the source line when available. `doctor --from <release>` reports the same
matches as DS052 warnings. The notices work offline; neither command runs git or removes mitigations.
Older release records without `resolves` contain no machine notices; use the release comment.

## 5. Upgrade the consumer

The consumer's maintainer upgrades the vendored set in a separate PR
([install.md](./install.md), [egdev-ds](./egdev-ds-cli.md)) and removes the mitigations resolved
by that release in the same PR, including their TODO comments and allowlist entries. The upgrade
notices are text-only next steps, not part of `--json` or `--dry-run` output. External contributors
never vendor tarballs.

## Try a DS change in a consumer locally

To check an unreleased DS change inside a consumer app on your machine:

1. In the DS checkout: `pnpm install && pnpm release:pack`. `release/` is not in git; every run
   rebuilds it. A local `release:pack` is **not** a release: nothing is published or versioned.
2. From the consumer root, with both checkouts as sibling folders:

   ```sh
   node ../egdev-design-system/packages/cli/bin/egdev-ds.mjs upgrade <project> --allow-dirty
   ```

   Pass `--from <release folder>` when the checkouts are not siblings. `--allow-dirty` is needed
   when the DS tree had uncommitted changes, because `release.json` records them as `dirty`.
3. Install and test the consumer as usual.
4. Revert the consumer: `upgrade` never runs git and removes the previous tarballs after a
   successful run, so restore them with git (for example
   `git restore <project>/vendor <project>/package.json <project>/package-lock.json`) and reinstall.

Do not link the DS into a consumer with `npm link`, `link:`, `workspace:` or a `file:` path into
the DS checkout. `egdev-ds upgrade` refuses `link:` and `workspace:` specifiers on purpose, and a
path into the checkout is unsupported: the trial must exercise exactly the tarballs a release
distributes. The CLI needs Node.js 24 even when the consumer supports older
versions.
