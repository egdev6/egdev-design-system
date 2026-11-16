import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';
import {
  type PageHeaderLevel,
  type PageHeaderProps,
  pageHeaderActionsVariants,
  pageHeaderEyebrowVariants,
  pageHeaderHeadingVariants,
  pageHeaderLeadingVariants,
  pageHeaderLedeVariants,
  pageHeaderStartVariants,
  pageHeaderTextVariants,
  pageHeaderVariants
} from './types';

type UsePageHeaderResult = {
  valid: boolean;
  element: `h${PageHeaderLevel}`;
  title: string;
  eyebrow: string | undefined;
  lede: string | undefined;
  actions: Exclude<PageHeaderProps['actions'], boolean>;
  leadingAction: Exclude<PageHeaderProps['leadingAction'], boolean>;
  rootProps: ComponentPropsWithoutRef<'header'>;
  startClassName: string;
  leadingClassName: string;
  textClassName: string;
  headingClassName: string;
  eyebrowClassName: string;
  ledeClassName: string;
  actionsClassName: string;
};

/** Resolve passive content and per-part classes without inspecting or changing action children. */
export function usePageHeader({
  title,
  eyebrow,
  level = 1,
  actions,
  leadingAction,
  lede,
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
    lede: lede?.trim() ? lede : undefined,
    actions: typeof actions === 'boolean' ? undefined : actions,
    leadingAction: typeof leadingAction === 'boolean' ? undefined : leadingAction,
    rootProps: { ...rest, className: cn(pageHeaderVariants(), className) },
    startClassName: cn(pageHeaderStartVariants()),
    leadingClassName: cn(pageHeaderLeadingVariants()),
    textClassName: cn(pageHeaderTextVariants({ nested: leadingAction != null && typeof leadingAction !== 'boolean' })),
    headingClassName: cn(pageHeaderHeadingVariants()),
    eyebrowClassName: cn(pageHeaderEyebrowVariants()),
    ledeClassName: cn(pageHeaderLedeVariants()),
    actionsClassName: cn(pageHeaderActionsVariants())
  };
}
