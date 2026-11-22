# ButtonGroup v0.2 — implementation evidence

## Observed

- The [S8 compact-target amendment](hit-area-amendment.md) has payload SHA-256 `10094b1045023191dbe8e52907f0050be9e9eb4dd095a2fb86e1011dbd7bfa01`. Both `attached` and `spaced` locally suppress the IconButton pseudo-element; standalone IconButtons retain it.
- The earlier implementation worker reported six intended composition failures before 331/331 passed. The final combined composition/Text suite passed 417/417, including ButtonGroup.
- In the current-source Chrome matrix, both group variants contained native `sm`, `md` and `lg` IconButtons. The computed `::after` content was `none`; center and four visible-axis points produced **120 mouse and 120 touch** correct sequences across LTR/RTL and normal/reduced motion.
- This is a deliberate compact exception, not a 44px target claim: visible default-token boxes are approximately 25.6px, 32px and 38.4px. The unchanged compact layout is not evidence of visual approval.

## Marker-free follow-up

ButtonGroup reserves `data-icon-button-target="compact"` on its own root as an internal composition signal, not a new consumer prop or target-size option. IconButton consumes it with the static direct-parent utility `[[data-icon-button-target=compact]>&]:after:content-none`; ButtonGroup no longer styles through the public `eg-icon-btn` marker. Direct-parent scope preserves the earlier behavior for nested, non-direct IconButtons. The prop-naming registry was reviewed: the signal is not a new own prop, and no convention or approval was added; affected existing source revisions were refreshed.

The three-component focused run went from 14 intended failures and 120 passes to 134/134. In Chrome 148 with current-source CSS and JS, both group variants in LTR and RTL suppressed native and slotted direct children. Sixteen direct-child mouse/touch activations passed; 72 nested-child and 36 standalone center/edge/corner mouse/touch sequences retained the approximately 44.8px extension. A scratch CSS audit found all 76 static IconButton utilities and no `.eg-icon-btn` styling selector in the utilities layer.

## Pending

The follow-up exercised a slotted group child in synthetic Chrome input, not physical hybrid/coarse-primary devices or assistive technology. The parent owns a fresh package build and package-exports recheck. Browser environment and other checks are in the [shared IconButton evidence](../../icon-button/v0.4/implementation-evidence.md). Visual conformity is **Not evaluated**.
