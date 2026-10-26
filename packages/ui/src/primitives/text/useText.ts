import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { accentVariants, type TextProps, type TextVariant, textVariants } from './types';

type TextAccent = { className: string; text: string };

type TextResult = {
  asChild: boolean;
  children: ReactNode;
  accent: TextAccent | undefined;
  rootProps: Omit<ComponentPropsWithoutRef<'p'>, 'children' | 'role' | 'dangerouslySetInnerHTML'>;
};

const textVariantNames: readonly TextVariant[] = ['display', 'hero', 'section', 'eyebrow', 'show', 'inverse'];

/**
 * Resolve the eyebrow default, the optional trailing accent and the root/accent classes.
 * Blank accents are omitted; non-empty accent text is kept verbatim. An untyped
 * dangerouslySetInnerHTML is discarded so it never reaches the paragraph or Slot.
 */
export function useText({
  variant: requestedVariant,
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
  const accentText = variant !== 'eyebrow' && typeof accent === 'string' && accent.trim() !== '' ? accent : undefined;
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
    rootProps: { ...rootProps, className: cn(textVariants({ variant }), className) }
  };
}
