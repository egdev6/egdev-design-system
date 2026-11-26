import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import { cn } from '@/lib/cn';
import {
  defaultPaginationMessages,
  type PaginationMessages,
  type PaginationProps,
  paginationEllipsisVariants,
  paginationIconVariants,
  paginationItemVariants,
  paginationLinkVariants,
  paginationListVariants,
  paginationPlaceholderVariants,
  paginationVariants
} from './types';

/** Previous or Next. */
export type PaginationStep = 'previous' | 'next';

/** A native anchor: a numbered page, or Previous or Next when `step` is set. */
export type PaginationLinkItem = {
  type: 'link';
  key: string;
  step: PaginationStep | undefined;
  /** The visible text: the plain digits of a page, or the message text of a step. */
  text: string;
  itemProps: ComponentPropsWithoutRef<'li'>;
  linkProps: ComponentPropsWithoutRef<'a'>;
};

/** The Previous or Next slot at a boundary: it keeps the row stable and leaves the accessibility tree. */
export type PaginationPlaceholderItem = {
  type: 'placeholder';
  key: PaginationStep;
  step: PaginationStep;
  text: string;
  itemProps: ComponentPropsWithoutRef<'li'>;
  placeholderProps: ComponentPropsWithoutRef<'span'>;
};

/** Marks at least two pages that are not shown. */
export type PaginationEllipsisItem = {
  type: 'ellipsis';
  key: 'start' | 'end';
  itemProps: ComponentPropsWithoutRef<'li'>;
  ellipsisProps: ComponentPropsWithoutRef<'span'>;
};

export type PaginationItem = PaginationLinkItem | PaginationPlaceholderItem | PaginationEllipsisItem;

export type PaginationModel = {
  rootProps: ComponentPropsWithoutRef<'nav'>;
  listProps: ComponentPropsWithoutRef<'ul'>;
  /** Class of the decorative arrows of Previous and Next, in their links and in their placeholders. */
  iconClassName: string;
  items: PaginationItem[];
};

export type UsePaginationResult = {
  /** The landmark to render, or null when nothing renders. */
  model: PaginationModel | null;
};

// A page number, or one of the two ellipses: `start` follows page 1 and `end` precedes the last page.
type Slot = number | 'start' | 'end';

/**
 * The constant-width window: every pageCount above 7 renders exactly seven page-or-ellipsis slots, so the row does not
 * jump while the user pages. An ellipsis therefore always stands for at least two hidden pages.
 */
function pageWindow(pageCount: number, value: number): Slot[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }
  if (value <= 4) {
    return [1, 2, 3, 4, 5, 'end', pageCount];
  }
  if (value >= pageCount - 3) {
    return [1, 'start', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  }
  return [1, 'start', value - 1, value, value + 1, 'end', pageCount];
}

// Development-only, like Breadcrumb, SocialLinks and StepMeter. The warnings fire during render, so StrictMode can
// repeat them.
function warn(message: string): void {
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    console.warn(message);
  }
}

const isNonBlank = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

// Keys the contract owns: label names the landmark and the derived row owns the content. They are removed at untyped
// and JavaScript boundaries too. `ref` and `asChild` are dropped as well: React 19 hands `ref` to a function component
// as an ordinary prop, which would otherwise reach the root there and not under React 18, and an `asChild` flag would
// reach the DOM as an unknown attribute.
type ProtectedProps = {
  children?: unknown;
  role?: unknown;
  'aria-label'?: unknown;
  'aria-labelledby'?: unknown;
  dangerouslySetInnerHTML?: unknown;
  ref?: unknown;
  asChild?: unknown;
};

type LocalizedMessages = { previous: string; next: string; page: (page: number) => string };

// Each omitted, blank or non-string entry falls back independently, and a page formatter that throws or returns
// blank text falls back for that link only: an invalid dictionary never destroys the link names.
function localize(messages: PaginationProps['messages']): LocalizedMessages {
  const supplied: Partial<PaginationMessages> = typeof messages === 'object' && messages !== null ? messages : {};
  const text = (key: 'previous' | 'next') => {
    const candidate: unknown = supplied[key];
    return isNonBlank(candidate) ? candidate : defaultPaginationMessages[key];
  };
  return {
    previous: text('previous'),
    next: text('next'),
    page: (page) => {
      try {
        const candidate: unknown = typeof supplied.page === 'function' ? supplied.page(page) : undefined;
        if (isNonBlank(candidate)) {
          return candidate;
        }
      } catch {
        // A consumer formatter that throws must not break the link names.
      }
      return defaultPaginationMessages.page(page);
    }
  };
}

/**
 * Validate and normalize the inputs, derive the constant-width window and build the model of every rendered control.
 * This is the only place that decides what renders: the component only draws the model.
 */
export function usePagination(props: PaginationProps): UsePaginationResult {
  const {
    label,
    value,
    pageCount,
    getHref,
    onNavigate,
    messages,
    className,
    children: _children,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    dangerouslySetInnerHTML: _html,
    ref: _ref,
    asChild: _asChild,
    ...rest
  } = props as PaginationProps & ProtectedProps;
  // Each invalid input warns on its own, so one render reports everything the consumer has to fix.
  const named = isNonBlank(label);
  if (!named) {
    warn('Pagination requires a non-empty label. Nothing was rendered.');
  }
  const validValue = isFiniteNumber(value);
  if (!validValue) {
    warn('Pagination requires a finite numeric value. Nothing was rendered.');
  }
  const validCount = isFiniteNumber(pageCount);
  if (!validCount) {
    warn('Pagination requires a finite numeric pageCount. Nothing was rendered.');
  }
  const linkable = typeof getHref === 'function';
  if (!linkable) {
    warn('Pagination requires a getHref function. Nothing was rendered.');
  }
  if (!(named && validValue && validCount && linkable)) {
    return { model: null };
  }
  // Nothing to paginate: below two pages there is nothing to render and nothing to warn about.
  const total = Math.floor(pageCount);
  if (total < 2) {
    return { model: null };
  }
  const current = Math.min(Math.max(Math.floor(value), 1), total);
  const text = localize(messages);
  const navigate = typeof onNavigate === 'function' ? onNavigate : undefined;
  const iconClassName = cn(paginationIconVariants());

  // getHref is pure, so each page is resolved once per render, for the controls that are actually rendered.
  const destinations = new Map<number, string>();
  const resolve = (page: number): string | undefined => {
    const known = destinations.get(page);
    if (known !== undefined) {
      return known;
    }
    const href: unknown = getHref(page);
    if (!isNonBlank(href)) {
      return undefined;
    }
    destinations.set(page, href);
    return href;
  };
  const link = (page: number, href: string, step?: PaginationStep): PaginationLinkItem => ({
    type: 'link',
    key: step ?? `page-${page}`,
    step,
    text: step ? text[step] : String(page),
    itemProps: {},
    linkProps: {
      href,
      ...(step ? { rel: step === 'previous' ? 'prev' : 'next' } : { 'aria-label': text.page(page) }),
      ...(page === current && !step ? { 'aria-current': 'page' as const } : {}),
      onClick: navigate ? (event: MouseEvent<HTMLAnchorElement>) => navigate(page, event) : undefined,
      className: cn(paginationItemVariants(), paginationLinkVariants({ kind: step ? 'step' : 'page' }))
    }
  });
  const placeholder = (step: PaginationStep): PaginationPlaceholderItem => ({
    type: 'placeholder',
    key: step,
    step,
    text: text[step],
    itemProps: { 'aria-hidden': true },
    placeholderProps: {
      'data-disabled': '',
      className: cn(paginationItemVariants(), paginationPlaceholderVariants())
    } as ComponentPropsWithoutRef<'span'>
  });
  const ellipsis = (key: 'start' | 'end'): PaginationEllipsisItem => ({
    type: 'ellipsis',
    key,
    itemProps: { 'aria-hidden': true },
    ellipsisProps: { className: cn(paginationItemVariants(), paginationEllipsisVariants()) }
  });

  const items: PaginationItem[] = [];
  const sequence: (PaginationStep | Slot)[] = ['previous', ...pageWindow(total, current), 'next'];
  for (const control of sequence) {
    if (control === 'start' || control === 'end') {
      items.push(ellipsis(control));
      continue;
    }
    const step = typeof control === 'number' ? undefined : control;
    const page = typeof control === 'number' ? control : control === 'previous' ? current - 1 : current + 1;
    // A step links to the page next to the current one while that page exists; at a boundary it is a placeholder.
    if (step && (page < 1 || page > total)) {
      items.push(placeholder(step));
      continue;
    }
    const href = resolve(page);
    if (href === undefined) {
      warn('Pagination requires getHref to return a non-empty string for every rendered page. Nothing was rendered.');
      return { model: null };
    }
    items.push(link(page, href, step));
  }
  return {
    model: {
      rootProps: { ...rest, 'aria-label': label, className: cn(paginationVariants(), className) },
      listProps: { role: 'list', className: cn(paginationListVariants()) },
      iconClassName,
      items
    }
  };
}
