import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import { cn } from '@/lib/cn';
import {
  type BreadcrumbItem,
  type BreadcrumbProps,
  breadcrumbCurrentVariants,
  breadcrumbLinkVariants,
  breadcrumbListVariants,
  breadcrumbSeparatorVariants,
  breadcrumbStepVariants,
  breadcrumbVariants
} from './types';

export type BreadcrumbStep = {
  /** Zero-based index in the supplied array: stable across omissions, used as the React key. */
  position: number;
  label: string;
  stepClassName: string;
  /** Props for the exported Link of an ancestor step; absent on the current page. */
  link?: {
    href: string;
    variant: 'quiet';
    arrow: false;
    className: string;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  };
  /** Props for the current-page text; absent on an ancestor step. */
  current?: { 'aria-current': 'page'; className: string };
  /** Class of the decorative separator after the step; absent on the last rendered step. */
  separatorClassName?: string;
};

export type UseBreadcrumbResult = {
  valid: boolean;
  rootProps: ComponentPropsWithoutRef<'nav'>;
  listClassName: string;
  steps: BreadcrumbStep[];
};

// href is defined for an ancestor only: the current page is the one rendered entry with none.
type RenderedEntry = { position: number; item: BreadcrumbItem; label: string; href: string | undefined };

// Keys the contract owns: label names the landmark and items own the content. They are removed at untyped and
// JavaScript boundaries too. `ref` is dropped as well because React 19 hands it to a function component as an
// ordinary prop, which would otherwise reach the root there and not under React 18.
type ProtectedProps = {
  children?: unknown;
  role?: unknown;
  'aria-label'?: unknown;
  'aria-labelledby'?: unknown;
  dangerouslySetInnerHTML?: unknown;
  ref?: unknown;
};

// Development-only, like SocialLinks and StepMeter. The warnings fire during render, so StrictMode can repeat them.
function warn(message: string): void {
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    console.warn(message);
  }
}

const isNonBlank = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

/**
 * Name the landmark from label, validate and classify the supplied entries by position, and compose the class of
 * each part. This is the only place that decides which entries render, which one is the current page and where the
 * separators go.
 */
export function useBreadcrumb(props: BreadcrumbProps): UseBreadcrumbResult {
  const {
    label,
    items,
    onNavigate,
    className,
    children: _children,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    dangerouslySetInnerHTML: _html,
    ref: _ref,
    ...rest
  } = props as BreadcrumbProps & ProtectedProps;
  const named = isNonBlank(label);
  if (!named) {
    warn('Breadcrumb requires a non-empty label. Nothing was rendered.');
  }
  // A name is required before anything else: an unnamed trail never reaches the entries.
  const supplied: unknown[] = named && Array.isArray(items) ? items : [];
  const lastPosition = supplied.length - 1;
  const entries: RenderedEntry[] = [];
  for (const [position, item] of supplied.entries()) {
    const entry: Partial<Record<keyof BreadcrumbItem, unknown>> = typeof item === 'object' && item !== null ? item : {};
    if (!isNonBlank(entry.label)) {
      warn(`Breadcrumb omitted the entry at index ${position}: it needs a non-blank label.`);
      continue;
    }
    // The last supplied entry is the current page and needs no destination; every earlier entry is an ancestor.
    const href = typeof entry.href === 'string' && entry.href.length > 0 ? entry.href : undefined;
    if (position !== lastPosition && href === undefined) {
      warn(`Breadcrumb omitted the entry at index ${position}: an ancestor entry needs a non-empty href.`);
      continue;
    }
    entries.push({
      position,
      item: item as BreadcrumbItem,
      label: entry.label,
      href: position === lastPosition ? undefined : href
    });
  }
  return {
    valid: named && entries.length > 0,
    rootProps: { ...rest, 'aria-label': label, className: cn(breadcrumbVariants(), className) },
    listClassName: cn(breadcrumbListVariants()),
    steps: entries.map(({ position, item, label: text, href }, rendered) => {
      const step = { position, label: text, stepClassName: cn(breadcrumbStepVariants()) };
      // A separator follows every rendered step except the last rendered one. That one is the current page unless
      // its entry was omitted: nobody is promoted, so the trail then ends at its last remaining link, without one.
      const separator = rendered < entries.length - 1 ? { separatorClassName: cn(breadcrumbSeparatorVariants()) } : {};
      // The current page is always the last rendered step, so only a link step can be followed by a separator.
      return href === undefined
        ? { ...step, current: { 'aria-current': 'page' as const, className: cn(breadcrumbCurrentVariants()) } }
        : {
            ...step,
            link: {
              href,
              variant: 'quiet' as const,
              arrow: false as const,
              className: cn(breadcrumbLinkVariants()),
              // The original entry object, never a copy; the component never prevents default itself.
              onClick: onNavigate ? (event: MouseEvent<HTMLAnchorElement>) => onNavigate(item, event) : undefined
            },
            ...separator
          };
    })
  };
}
