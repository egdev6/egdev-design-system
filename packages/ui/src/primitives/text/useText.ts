import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import {
  accentVariants,
  type TextForeground,
  type TextProps,
  type TextVariant,
  textBodyVariants,
  textVariants
} from './types';

type TextAccent = { className: string; text: string };

type TextResult = {
  asChild: boolean;
  children: ReactNode;
  accent: TextAccent | undefined;
  rootProps: Omit<ComponentPropsWithoutRef<'p'>, 'children' | 'role' | 'dangerouslySetInnerHTML'>;
};

const textVariantNames: readonly TextVariant[] = [
  'display',
  'hero',
  'section',
  'eyebrow',
  'show',
  'inverse',
  'body',
  'body-large',
  'lede'
];
const foregroundNames: readonly TextForeground[] = [
  'inherit',
  'default',
  'secondary',
  'muted',
  'warning',
  'danger',
  'on-flood'
];

/**
 * Resolve body or title classes, the eyebrow default and optional trailing accent.
 * Body foreground defaults to inherit. Blank accents are omitted; non-empty text is kept verbatim. An untyped
 * dangerouslySetInnerHTML is discarded so it never reaches the paragraph or Slot.
 */
export function useText({
  variant: requestedVariant,
  foreground,
  tone,
  accent,
  accentBreak = true,
  asChild = false,
  className,
  children,
  ...native
}: TextProps): TextResult {
  const { dangerouslySetInnerHTML: _discarded, ...rootProps } = native as typeof native & {
    dangerouslySetInnerHTML?: unknown;
  };
  const variant = requestedVariant && textVariantNames.includes(requestedVariant) ? requestedVariant : 'eyebrow';
  const isBody = variant === 'body' || variant === 'body-large' || variant === 'lede';
  const resolvedForeground = foreground && foregroundNames.includes(foreground) ? foreground : 'inherit';
  const accentText =
    !isBody && variant !== 'eyebrow' && typeof accent === 'string' && accent.trim() !== '' ? accent : undefined;
  const accentTone = variant === 'inverse' ? 'flood' : tone === 'raised' ? 'raised' : 'canvas';
  return {
    asChild,
    children,
    accent:
      accentText === undefined
        ? undefined
        : {
            text: accentText,
            className: accentVariants({
              part: 'text',
              tone: accentTone,
              glow: variant === 'hero' && accentTone === 'canvas',
              accentBreak: accentBreak !== false
            })
          },
    rootProps: {
      ...rootProps,
      className: cn(
        isBody ? textBodyVariants({ variant, foreground: resolvedForeground }) : textVariants({ variant }),
        className
      )
    }
  };
}
