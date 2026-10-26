import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { accentVariants, type HeadingLevel, type HeadingProps, headingVariants, type TitleVariant } from './types';

type HeadingElement = `h${HeadingLevel}`;

type HeadingAccent = { className: string; text: string };

type HeadingResult = {
  element: HeadingElement;
  children: ReactNode;
  accent: HeadingAccent | undefined;
  rootProps: Omit<ComponentPropsWithoutRef<'h2'>, 'children' | 'role' | 'aria-level' | 'dangerouslySetInnerHTML'>;
};

const headingLevels: readonly HeadingLevel[] = [1, 2, 3, 4, 5, 6];
const titleVariantNames: readonly TitleVariant[] = ['display', 'hero', 'section', 'show', 'inverse'];

/**
 * Resolve the native h1–h6 element from level (h2 fallback), the section default, the optional
 * trailing accent and the root/accent classes. The level never changes typography. Untyped
 * dangerouslySetInnerHTML and asChild are discarded before forwarding to the native heading.
 */
export function useHeading({
  level,
  variant: requestedVariant,
  tone,
  accent,
  accentBreak = true,
  className,
  children,
  ...native
}: HeadingProps): HeadingResult {
  const {
    dangerouslySetInnerHTML: _discardedHtml,
    asChild: _discardedSlot,
    ...rootProps
  } = native as typeof native & { dangerouslySetInnerHTML?: unknown; asChild?: unknown };
  const resolvedLevel = level !== undefined && headingLevels.includes(level) ? level : 2;
  const variant = requestedVariant && titleVariantNames.includes(requestedVariant) ? requestedVariant : 'section';
  const accentText = typeof accent === 'string' && accent.trim() !== '' ? accent : undefined;
  const accentTone = variant === 'inverse' ? 'flood' : tone === 'raised' ? 'raised' : 'canvas';
  return {
    element: `h${resolvedLevel}`,
    children,
    accent:
      accentText === undefined
        ? undefined
        : {
            text: accentText,
            className: accentVariants({
              part: 'heading',
              tone: accentTone,
              glow: variant === 'hero' && accentTone === 'canvas',
              accentBreak: accentBreak !== false
            })
          },
    rootProps: { ...rootProps, className: cn(headingVariants({ variant }), className) }
  };
}
