import { cn } from '@/lib/cn';
import type { IconGlyphElement } from './icon-paths';
import { iconPaths } from './icon-paths';
import type { IconProps } from './types';
import { iconVariants } from './types';

/** Keys the glyph contract owns even when unsupported code paths inject them. */
const FORBIDDEN = new Set([
  'children',
  'dangerouslySetInnerHTML',
  'viewBox',
  'role',
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'focusable',
  'fill',
  'stroke',
  'strokeWidth',
  'width',
  'height',
  'strokeLinecap',
  'strokeLinejoin',
  'asChild',
  'ref'
]);

export type IconGlyphNode = {
  key: string;
  element: IconGlyphElement;
  attributes: Readonly<Record<string, string>>;
};

export type UseIconResult = {
  svgProps: Record<string, unknown> & {
    className: string;
    viewBox: string;
    'aria-hidden': true;
    focusable: 'false';
    strokeLinecap: 'round';
    strokeLinejoin: 'round';
  };
  glyph: IconGlyphNode[];
  /** Non-empty accessible name, or undefined when the icon is decorative. */
  label: string | undefined;
};

/** Resolve the preset glyph classes, its path data and the decorative or labelled mode. */
export function useIcon(props: IconProps): UseIconResult {
  const { name, size, filled = false, label, className, ...rest } = props;
  const passthrough: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (!FORBIDDEN.has(key)) {
      passthrough[key] = value;
    }
  }
  return {
    svgProps: {
      ...passthrough,
      className: cn(iconVariants({ size, filled }), className),
      viewBox: '0 0 24 24',
      'aria-hidden': true,
      focusable: 'false',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    },
    glyph: iconPaths[name].map(([element, attributes], index) => ({
      key: `${name}-${index}`,
      element,
      attributes
    })),
    label: label ? label : undefined
  };
}
