import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';

/** Independent localizable text keys of Pagination: an omitted, blank or non-string entry uses its English fallback. */
export type PaginationMessages = {
  /**
   * Visible and accessible text of the link to the previous page. It is shown in uppercase by CSS only: the DOM text is
   * exactly as supplied. English fallback: Previous.
   * @control text
   */
  previous: string;
  /**
   * Visible and accessible text of the link to the next page. It is shown in uppercase by CSS only: the DOM text is
   * exactly as supplied. English fallback: Next.
   * @control text
   */
  next: string;
  /**
   * Accessible name of a numbered page link, from its 1-based page number. The visible digits are never replaced, so
   * the name should contain them (WCAG 2.5.3 Label in Name); this is not enforced. A formatter that throws or returns
   * blank text falls back to the English name for that link, such as Page 3.
   * @control false
   * @controlReason A formatter function is not serializable; see Localized.
   */
  page: (page: number) => string;
};

/**
 * Named navigation landmark of crawlable links to the pages of a long listing: Previous and Next, numbered pages in a
 * constant-width window of at most seven slots with ellipses, and the current page marked with aria-current="page".
 * The consumer owns the slice of data, pageCount, value and the destination of every page through getHref; the
 * component keeps no state, renders only native a elements and never prevents the default action itself. className
 * supports outer placement only (margin, self-alignment, flex and grid item placement), merged last on the root;
 * width, paint and part overrides are not supported, and no part exposes a className. No ref, asChild, children or
 * router integration.
 */
export type PaginationProps = Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children' | 'aria-label' | 'aria-labelledby' | 'role'
> & {
  /**
   * Accessible name of the navigation landmark, never rendered visibly. Consumer-owned copy and language, so the
   * component has no default: a short noun such as "Editorial pages" is enough because the navigation role is
   * announced by itself, and the name must differ from every other landmark and every other Pagination on the page.
   * A blank, whitespace-only or non-string label warns in development and renders nothing, so a landmark is never
   * left unnamed.
   * @control text
   */
  label: string;
  /**
   * The current page, 1-based and equal to the page the route shows. A finite number is floored and then clamped to
   * 1..pageCount, so an unvalidated page parameter never throws (the consumer still owns the 404 or redirect). NaN, an
   * infinite value or a non-number warns in development and renders nothing. There is no uncontrolled value: a
   * navigation changes the route and the consumer rerenders with the new value.
   * @control number
   */
  value: number;
  /**
   * Total number of pages of the listing, supplied by the consumer. A finite number is floored; a result below 2
   * renders nothing and warns nothing, because there is nothing to paginate. NaN, an infinite value or a non-number
   * warns in development and renders nothing.
   * @control number
   */
  pageCount: number;
  /**
   * Native destination of one page, so every control is a crawlable link and the consumer encodes the route and the
   * active filters in the URL. Called synchronously during render with an integer from 1 to pageCount for each
   * rendered control. It must be pure, may run more than once per render and must return a non-empty string: a
   * non-function, or a blank or non-string return for any rendered control, warns in development and renders nothing.
   * @control false
   * @controlReason A function is not serializable; see Default and ClientRouting for destinations that carry filters.
   */
  getHref: (page: number) => string;
  /**
   * Native click notification of a rendered link, with its target page and the React event, called once before the
   * default action. For client routing, call preventDefault only on unmodified primary activations: modified clicks
   * stay native, and a middle click raises auxclick, which is not reported. The component never prevents the default
   * itself. Unavailable placeholders, ellipses and prop updates never call it. Absent means native navigation only.
   * @control false
   * @controlReason Callback functions are not serializable; see ClientRouting.
   */
  onNavigate?: (page: number, event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Partial localizable dictionary of the built-in text. Previous and next are the visible and accessible link texts
   * (English fallbacks Previous and Next) and page names a numbered link from its page number (English fallback such
   * as Page 3). Each omitted, blank or non-string entry falls back independently, and a page formatter that throws or
   * returns blank text falls back for that link. The visible digits are never replaced or locale-formatted.
   * @control false
   * @controlReason The dictionary includes a formatter function; see Localized.
   */
  messages?: Partial<PaginationMessages>;
};

/** English fallbacks of the built-in text; consumed by the hook, never exported from the package. */
export const defaultPaginationMessages: PaginationMessages = {
  previous: 'Previous',
  next: 'Next',
  page: (page) => `Page ${page}`
};

/** Root recipe: the stable public marker only. The host owns the surface, the width and the outer placement. */
export const paginationVariants = cva('eg-pagination');
/** Row recipe: a centred row that wraps in a narrow host instead of overflowing. */
export const paginationListVariants = cva('m-0 p-0 list-none flex flex-wrap items-center justify-center gap-1');
/** Geometry and type shared by every item (link, placeholder and ellipsis): 32px minimum, 44.8px on coarse pointers. */
export const paginationItemVariants = cva(
  'box-border inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-md border border-solid border-transparent px-2 pointer-coarse:min-h-14 pointer-coarse:min-w-14 font-display text-meta'
);
/**
 * Link recipe: a tonal ghost link at rest with a surface-2 hover, and the current page in the selected-pill treatment
 * of Tabs `outline` (R1) through aria-current variants. The compound focus shadow has one more selector than R1's
 * edge shadow, so the ring always wins; forced colours drop shadows and backgrounds, so focus and the current page
 * get a system-colour outline instead.
 */
export const paginationLinkVariants = cva(
  [
    'text-fg-secondary no-underline',
    'transition-colors duration-(--duration-fast) ease-(--ease-out) motion-reduce:transition-none',
    'hover:bg-surface-2 hover:text-fg-default',
    'aria-[current=page]:border-state-selected aria-[current=page]:[background:var(--gradient-chip-active),var(--color-surface-1)] aria-[current=page]:shadow-[var(--shadow-edge-strong)] aria-[current=page]:text-fg-default',
    'focus-visible:outline-none focus-visible:shadow-focus aria-[current=page]:focus-visible:shadow-focus',
    'forced-colors:focus-visible:outline-solid forced-colors:focus-visible:outline-(length:--focus-width) forced-colors:focus-visible:outline-[color:Highlight]',
    'forced-colors:aria-[current=page]:outline-solid forced-colors:aria-[current=page]:outline-(length:--focus-width) forced-colors:aria-[current=page]:outline-[color:Highlight]'
  ],
  { variants: { kind: { page: 'tabular-nums', step: 'uppercase' } }, defaultVariants: { kind: 'page' } }
);
/** Ellipsis recipe: decorative and quiet, on the shared item geometry. */
export const paginationEllipsisVariants = cva('text-fg-muted');
/** Placeholder recipe: the Previous or Next row slot at a boundary, dimmed and without hover. */
export const paginationPlaceholderVariants = cva('uppercase text-fg-secondary data-[disabled]:opacity-45');
/** Arrow recipe: the physical arrow glyphs turn around in right-to-left text. */
export const paginationIconVariants = cva('rtl:rotate-180');
