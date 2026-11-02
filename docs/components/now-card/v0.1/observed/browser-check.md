# NowCard v0.1 — browser verification

Parent checks in Chromium headless shell 1243, dark Storybook at port 6124. Initial measurements: 1024×768. Corrected screenshots and layout assertions: 390×844. Reference: adopted VIS-02, subject to written approved Material/type-scale differences and badge-order amendment.

- Badge renders as the first article child before the generated heading.
- Body font sizes: md 16px, sm 12.8px. Heading sizes: md 19.2px, sm 16px. Supporting bold value computes to weight 800 through the existing token-backed utility.
- Corrected Default, Sizes, LongContent and WithSingleChild: no horizontal overflow; footer fully within frame; meaningful badge is not aria-hidden. Default root clientWidth=scrollWidth=356px; narrow LongContent clientWidth=scrollWidth=238px.
- Heading content inset: md20.2px, sm13.8px including border. Footer left/right edges are inside the root by1px, with computed margin0 and positive visible height.
- Parent visually inspected default-fixed-390-dark.png against VIS-02: badge→title→copy→banded footer retained; meter omitted and Badge/Material recipes differ as approved.
- Final interaction check (job-217): root position, transform, shadow and cursor remain identical before/after hover; first Tab reaches the supplied anchor; computed card animation-name stays none under reduced motion.

## Browser-found legacy collisions

Initial screenshots exposed a flush heading and clipped footer. Legacy eg-now-card root alignment/gap/min-height/transition and footer negative margins remained active despite class-only tests passing. Scoped root resets (items-stretch, gap-0, min-h-0, transform-none, transition-none, backdrop-filter-none), footer m-0 and token heading padding correct the new component without editing legacy CSS. A focused regression failed before the correction;16 component tests passed afterward. Fresh Chromium job-215 verified order, insets, visible footer and no overflow at mobile width.

The initial browser-measurements.json and unqualified screenshots preserve the failing layout; screenshots with fixed in their names show the correction. No screen-reader session or pixel-equivalence claim. Final package and repository verification is separate evidence.
