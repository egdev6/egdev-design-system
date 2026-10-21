import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Size tokens from @egdev/tokens; companion typography properties are not sizes.
// Keep this list in sync with theme.css through the cn.test.ts drift guard.
const tokenTypographySizes = [
  'display-hero',
  'display-show',
  'display-pro',
  'heading-section',
  'heading-small',
  'body-large',
  'body-default',
  'body-muted',
  'label-default',
  'label-eyebrow',
  'meta',
  'cta-label',
  'code'
];

const mergeClasses = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: tokenTypographySizes }]
    }
  }
});

/** Compose conditional classes and merge known utilities without dropping public eg-* markers. */
export const cn = (...inputs: ClassValue[]): string => mergeClasses(clsx(inputs));
