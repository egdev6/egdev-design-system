import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';
import {
  type PageHeaderLevel,
  type PageHeaderProps,
  pageHeaderActionsVariants,
  pageHeaderEyebrowVariants,
  pageHeaderHeadingVariants,
  pageHeaderTextVariants,
  pageHeaderVariants
} from './types';

type UsePageHeaderResult = {
  valid: boolean;
  element: `h${PageHeaderLevel}`;
  title: string;
  eyebrow: string | undefined;
  actions: Exclude<PageHeaderProps['actions'], boolean>;
  rootProps: ComponentPropsWithoutRef<'header'>;
  textClassName: string;
  headingClassName: string;
  eyebrowClassName: string;
  actionsClassName: string;
};

/** Resolve passive content and per-part classes without inspecting or changing action children. */
export function usePageHeader({
  title,
  eyebrow,
  level = 1,
  actions,
  className,
  ...rest
}: PageHeaderProps): UsePageHeaderResult {
  const valid = title.trim().length > 0;
  if (!valid && process.env.NODE_ENV !== 'production') {
    console.warn('PageHeader title must contain non-whitespace text.');
  }
  return {
    valid,
    element: `h${level}`,
    title,
    eyebrow: eyebrow?.trim() ? eyebrow : undefined,
    actions: typeof actions === 'boolean' ? undefined : actions,
    rootProps: { ...rest, className: cn(pageHeaderVariants(), className) },
    textClassName: cn(pageHeaderTextVariants()),
    headingClassName: cn(pageHeaderHeadingVariants()),
    eyebrowClassName: cn(pageHeaderEyebrowVariants()),
    actionsClassName: cn(pageHeaderActionsVariants())
  };
}
