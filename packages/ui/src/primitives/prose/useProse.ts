import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { type ProseProps, type ProseSize, type ProseTone, proseVariants } from './types';

type ProseResult = {
  children: ReactNode;
  rootProps: Omit<
    ComponentPropsWithoutRef<'div'>,
    'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML'
  > & { className: string };
};

/**
 * Resolve the root class list. An omitted or unsupported size or tone falls back to md and canvas, as Text does. An
 * untyped dangerouslySetInnerHTML is discarded so Prose never takes an HTML string; nothing else is stripped and the
 * children are returned unchanged.
 */
export function useProse({ children, size, tone, className, ...native }: ProseProps): ProseResult {
  const { dangerouslySetInnerHTML: _discarded, ...rootProps } = native as typeof native & {
    dangerouslySetInnerHTML?: unknown;
  };
  const resolvedSize: ProseSize = size === 'sm' ? 'sm' : 'md';
  const resolvedTone: ProseTone = tone === 'raised' ? 'raised' : 'canvas';
  return {
    children,
    rootProps: { ...rootProps, className: cn(proseVariants({ size: resolvedSize, tone: resolvedTone }), className) }
  };
}
