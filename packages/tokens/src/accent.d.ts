import type { AccentTheme } from './accent-types.js';

export type { AccentTheme } from './accent-types.js';

/** Derive the complete dark-theme accent map without changing the DOM. */
export declare function createAccentTheme(input: string | null | undefined): AccentTheme;
