import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';

/** One trail step: plain data, never an element. The last supplied entry of `items` is the current page. */
export type BreadcrumbItem = {
  /**
   * Visible step name, rendered as supplied, and the accessible name of an ancestor link. Consumer-owned and
   * localized: there is no built-in text. A blank, whitespace-only or non-string label omits the entry with a
   * development warning.
   * @control text
   */
  label: string;
  /**
   * Native same-context destination of an ancestor step, forwarded as supplied with no URL validation. Required for
   * every entry except the last: an ancestor without a non-empty string href is omitted with a development warning.
   * It is optional in the type only because the current page needs none; on the last entry it is never rendered.
   * @control text
   */
  href?: string;
};

/**
 * Named navigation landmark holding an ordered trail from the root to the current page: ancestor steps are links, the
 * last supplied entry is the current page as plain text marked aria-current, and decorative chevrons separate the
 * steps. The host builds the trail and owns its order, wording and language; nothing is derived from the URL or a
 * router, truncated, collapsed or announced, and there is no built-in text. className supports outer placement only
 * (margin, self-alignment, flex and grid item placement), merged last on the root; width, paint and part overrides are
 * not supported, and no part exposes a className. No ref, asChild, children or router integration.
 */
export type BreadcrumbProps = Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children' | 'aria-label' | 'aria-labelledby' | 'role' | 'dangerouslySetInnerHTML'
> & {
  /**
   * Accessible name of the navigation landmark, never rendered visibly. Consumer-owned and localized: the component
   * has no built-in text. A short noun such as "Breadcrumb" is enough because the navigation role is announced by
   * itself, and the name must differ from every other landmark on the page. A blank, whitespace-only or non-string
   * label warns in development and renders nothing, so a landmark is never left unnamed.
   * @control text
   */
  label: string;
  /**
   * The trail, ordered from the root to the current page: the last supplied entry is the current page, rendered as
   * text that is never a link, and every earlier entry is an ancestor link. Entries with a blank label, and ancestors
   * without a non-empty href, are omitted with a development warning and nobody is promoted to current. A value that
   * is not an array, an empty array or an array without a valid entry renders nothing.
   * @control false
   * @controlReason Structured entry data is not a scalar control; see Default, SingleStep and Wrapping.
   */
  items: BreadcrumbItem[];
  /**
   * Click notification of an ancestor link, with the original entry object and the React event; never called for the
   * current page. For client routing, call preventDefault only on unmodified primary activations; modified clicks
   * stay native. Absent means native navigation only.
   * @control false
   * @controlReason Callback functions are not serializable; see ClientRouting.
   */
  onNavigate?: (item: BreadcrumbItem, event: MouseEvent<HTMLAnchorElement>) => void;
};

/** Root recipe: the stable public marker plus containment. The host owns the background. */
export const breadcrumbVariants = cva('eg-breadcrumb min-w-0 wrap-anywhere');
export const breadcrumbListVariants = cva('m-0 p-0 list-none flex flex-wrap items-center gap-x-2 gap-y-1');
export const breadcrumbStepVariants = cva('flex min-h-14 min-w-0 items-center gap-2');
// The base placement permission only: the anchor itself fills the step height so its hit area is the step's.
export const breadcrumbLinkVariants = cva('self-stretch');
// Type utilities mirror the family, size, line height and weight of the Link quiet recipe (font-sans text-label-default).
export const breadcrumbCurrentVariants = cva('font-sans text-label-default text-fg-default');
export const breadcrumbSeparatorVariants = cva('self-center -rotate-90 text-fg-muted');
