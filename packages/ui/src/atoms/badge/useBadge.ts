import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { type BadgeProps, type BadgeTone, type BadgeVariant, badgeIconVariants, badgeVariants } from './types';

type BadgeResult = {
  rootProps: ComponentPropsWithoutRef<'span'> & { 'data-tone': BadgeTone; 'data-variant': BadgeVariant };
  iconProps: ComponentPropsWithoutRef<'span'>;
  children: ReactNode;
  icon: ReactNode;
  showIcon: boolean;
};

/** Derives passive defaults and composes each supported part without adding state or behavior. */
export function useBadge({
  children,
  tone = 'neutral',
  variant = 'soft',
  icon,
  className,
  ...rest
}: BadgeProps): BadgeResult {
  return {
    rootProps: {
      ...rest,
      className: cn(badgeVariants({ tone, variant }), className),
      'data-tone': tone,
      'data-variant': variant
    },
    iconProps: { className: cn(badgeIconVariants()), 'aria-hidden': true },
    children,
    icon,
    showIcon: icon !== undefined && icon !== null && typeof icon !== 'boolean'
  };
}
