import type { ReactNode } from 'react';

/** Consumer-supplied non-interactive, decorative artwork, name and optional home destination. Do not supply links, buttons or focusable descendants. */
export type ProductIdentity = {
  node: ReactNode;
  name: string;
  href?: string;
};
