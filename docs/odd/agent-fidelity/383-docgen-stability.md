# Storybook docgen stability (#383)

## Goal

Keep the real Storybook metadata assertions stable during parallel test runs without changing production code or the global Vitest timeout.

## Plan

- Measure both test files before and after, including contention from a concurrent full suite.
- Share effects-project extraction in each affected test scope using a single `beforeAll` parse; retain every assertion. Include ScrollReveal, whose baseline approached the default timeout.
- Bound the heavy setup and tests explicitly with margin above observed costs, then run both files five times under full-suite load and run the requested standalone checks.

## Owner approval

adopted under the owner's standing instruction
