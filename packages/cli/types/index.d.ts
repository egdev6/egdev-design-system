// Type-only public entry of @egdev/cli (odd/tasks/egdev-ds-485-486.md S6, #488). There is no runtime
// module: import these with `import type`. `egdev-ds doctor` validates the same shape (DS042), and
// src/guard.mjs reads its GuardAllowlistEntry typedef from here, so this file is the one source of truth.

/**
 * One entry of `<sourceDirectory>/design-system-allowlist.ts`: an exact, whitespace-normalized opening
 * tag, CSS selector, or static DOM query selector or class string, not a regex. Non-guarded markup awaiting
 * a DS capability is tracked by its opening tag and TODO comment with `kind: 'component-gap'`.
 */
export type GuardAllowlistEntry = {
  /** Project-relative file the exception applies to, such as `src/components/Swatch.tsx`. */
  readonly file: string;
  /** The exact opening tag, CSS selector, or static DOM query string the guard reports. */
  readonly pattern: string;
  /** `egdev6/egdev-design-system#N`, `<localRepo>#N` or a `<localRepo>#TBD-slug` placeholder. */
  readonly issue: string;
  /** Why the exception exists; must not be empty. */
  readonly reason: string;
  /** Marks markup awaiting a DS capability; it needs a matching `comment`. */
  readonly kind?: 'component-gap';
  /** For a component gap: the `// TODO(egdev-design-system#…): …` comment above the tag. */
  readonly comment?: string;
};

/** The type of the exported `designSystemAllowlist` array. */
export type DesignSystemAllowlist = readonly GuardAllowlistEntry[];
