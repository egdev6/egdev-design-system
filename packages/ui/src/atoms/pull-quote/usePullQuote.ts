import type { ComponentPropsWithoutRef } from 'react';
import { useEffect } from 'react';
import { cn } from '@/lib/cn';
import type { PullQuoteProps, PullQuoteTone, PullQuoteVariant } from './types';
import {
  pullQuoteAccentVariants,
  pullQuotePassageVariants,
  pullQuoteQuotationVariants,
  pullQuoteSourceVariants,
  pullQuoteVariants
} from './types';

type PullQuotePart = { text: string; className: string };

type PullQuoteResult = {
  visible: boolean;
  text: string;
  accent: PullQuotePart | undefined;
  source: PullQuotePart | undefined;
  rootProps: Omit<ComponentPropsWithoutRef<'figure'>, 'children' | 'role' | 'dangerouslySetInnerHTML'> & {
    className: string;
  };
  quotationProps: { cite?: string; className: string };
  passageClassName: string;
};

const filled = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';

const isDevelopment = () => typeof process === 'undefined' || process.env.NODE_ENV !== 'production';

/**
 * Resolve render eligibility, variant/tone, blank-omission rules and per-part classes.
 * Blank text warns in development and makes the whole quotation invisible. cite is routed
 * to the blockquote only; untyped children, role and HTML injection never reach the figure.
 */
export function usePullQuote({
  text,
  accent,
  source,
  variant: requestedVariant,
  tone: requestedTone,
  cite,
  className,
  ...native
}: PullQuoteProps): PullQuoteResult {
  const {
    children: _children,
    role: _role,
    dangerouslySetInnerHTML: _html,
    ...rootProps
  } = native as typeof native & { children?: unknown; role?: unknown; dangerouslySetInnerHTML?: unknown };
  const visible = filled(text);

  useEffect(() => {
    if (!visible && isDevelopment()) {
      console.warn('PullQuote: text must contain non-whitespace content; nothing is rendered.');
    }
  }, [visible]);

  const variant: PullQuoteVariant = requestedVariant === 'display' ? 'display' : 'pull';
  const tone: PullQuoteTone = requestedTone === 'raised' ? 'raised' : 'canvas';
  return {
    visible,
    text,
    accent: filled(accent) ? { text: accent, className: pullQuoteAccentVariants({ tone, variant }) } : undefined,
    source: filled(source) ? { text: source, className: pullQuoteSourceVariants() } : undefined,
    rootProps: { ...rootProps, className: cn(pullQuoteVariants({ variant }), className) },
    quotationProps: {
      ...(filled(cite) ? { cite } : {}),
      className: pullQuoteQuotationVariants({ variant })
    },
    passageClassName: pullQuotePassageVariants()
  };
}
