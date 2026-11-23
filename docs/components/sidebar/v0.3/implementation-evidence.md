# Sidebar v0.3 and PreviewFrame v0.2 — implementation evidence

## Observed

- The [approved shared amendment](footer-spacing-amendment.md) has line-start payload SHA-256 `e6dbb5e0ca231dbbde213bdace2991dbd85f8ae79218b473d4c247fcda63fd78`, matching its header.
- The first focused run produced four intended `gap-2` failures and 42 passes across Collapsible, PreviewFrame and Sidebar; the same command passed 46/46 after the recipe changes. The six-component Collapsible, PreviewFrame, Sidebar, Panel, TopBar and IconButton run passed 169/169.
- Headless Chrome 148.0.7778.167 at 1280×900, DPR 1, loaded a static scratch build from current source and default tokens. PreviewFrame's actions and Sidebar's footer each computed to a `16px` gap; a visible md IconButton measured `32px` and its pseudo-element `44.7969px`.
- The complete three-component matrix passed **110 mouse and 110 touch sequences** across LTR and RTL. For each of six md actions it sampled the center, four edges and four corners at ±21.8px from center; it also sampled the Collapsible Trigger edge facing the actions. Every sequence checked the rest and held hit target, pointerdown/up/click destination and exactly one intended activation. Touch held-state verification used its activation path rather than relying on `:active`. Scratch was removed by the harness.
- Storybook docgen, Controls and CSS tests passed 507/507; `pnpm typecheck`, `pnpm lint`, props, artifact and system checks passed. Registry changes are 42 source revisions only; semantic anatomy changes are limited to CollapsibleHeader, PreviewFrame and Sidebar.

## Pending

These synthetic default-token fixtures do not cover consumer-provided small action pairs, narrow wrapping, physical devices, assistive technology or downstream applications. Expected-design comparison is unavailable; visual conformity is **Not evaluated**. The parent owns the final repository build and package-export check; package-consumption was not run.
