/** A complete, immutable set of scoped CSS custom-property values. */
export type AccentTheme = {
  readonly normalizedAccent: string;
  readonly mode: 'default' | 'custom';
  readonly variables: Readonly<Record<string, string>>;
};
