# Generate a design system for gentle-design

After running `pnpm release:pack` in the design-system repository, install its versioned `egdev-system-<version>.tgz` in the consumer using your package manager. The tarball contains the artifact, renderer, CLI and generated reference. Then run in the consumer root:

```sh
pnpm exec egdev-system-md --write
pnpm exec egdev-system-md --check
```

The command writes a regular `design/system.md` and reports the package version set. It refuses targets outside `design/`, symlinks and hard-linked targets. Re-run `--write` after changing consumer design sources: gentle-design checks file modification times, not artifact versions or hashes. A write always refreshes the timestamp even when the bytes are unchanged.

The composition guide appears first: reuse an organism, then a molecule, otherwise compose molecules/atoms and propose an organism; propose potential or repeated atoms. Follow `docs/CATALOGACION.md` (reuse → variant → compose → extract → new); the agent proposes and the owner decides. Mark component approximations including WebTemplate and WebSection with `data-component`, and missing pieces with `data-proposal` plus a note and rationale. Markers do not render React. Templates and organisms precede molecules and atoms; catalog composition, source-derived JSX uses, props and parts describe composition and slots without promising exhaustiveness.

The component section lists source-derived compound parts beneath each exported catalog parent, including their descriptions and documented children when available. For TopBar, use its named parts directly (fragments are supported), including the required brand. Account, search and mobile controls belong in their respective parts; there is no general CTA slot, so place a general CTA outside TopBar rather than as a direct child. Part discovery follows naming and source-file conventions, so an omitted part or empty children description is not proof of absence or unrestricted composition.

Every public value export includes a visual anatomy block, including exports outside the catalog; a block explicitly reports when no anatomy was statically extracted. Blocks contain source CVA base, variant and compound facts. Class modifiers and conditions remain visible: these facts are not a computed cascade. Token names refer to the token tables; `unresolved` means the source expression or utility could not be mapped to a token, not that the component has no styling. Surface calls point to their source and the Surface recipe; dynamic expressions and component styles outside the extracted recipes need source inspection.

The package does not generate `design/system.html`; gentle-design may report no system board. To regenerate this repository's committed reference after updating the artifact, run `pnpm system:docs`; verify it with `pnpm system:check`.

For a manual gentle-design observation after packing the release, run `EGDEV_SYSTEM_MD_KEEP_CONSUMER=1 pnpm test:system:consumer`. The test prints the temporary consumer and renderer output paths and retains the consumer only on success. Run gentle-design `list` in that consumer, record the result, then remove the printed temporary directory. Without this opt-in the test cleans up automatically, including on failure.
