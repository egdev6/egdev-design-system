import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Read-only slide content with a stable identity across reorders. No nested controls or autoplay. */
export type CarouselItem = {
  /**
   * Non-empty unique slide identity, not its numeric position.
   * @control text
   */
  value: string;
  /**
   * Non-empty accessible slide name, included in the position formatter.
   * @control text
   */
  label: string;
  /**
   * Read-only content; no links, controls, tab stops or automatically playing media.
   * @control false
   * @controlReason ReactNode is not serializable; see Default for Surface content.
   */
  children: ReactNode;
};

/** Independent localizable text keys; omitted or blank text uses its English fallback. */
export type CarouselMessages = {
  /**
   * Accessible name of the previous control.
   * @control text
   */
  previousSlide: string;
  /**
   * Accessible name of the next control.
   * @control text
   */
  nextSlide: string;
  /**
   * Carousel group role description, separate from its visible name.
   * @control text
   */
  carousel: string;
  /**
   * Slide group role description, separate from its position and name.
   * @control text
   */
  slide: string;
  /**
   * Keyboard instructions associated with the root and every slide.
   * @control text
   */
  instructions: string;
  /**
   * Empty collection text.
   * @control text
   */
  empty: string;
  /**
   * One-based position and item name; must return meaningful non-empty text.
   * @control false
   * @controlReason A formatter function is not serializable; see Localized.
   */
  position: (current: number, total: number, itemLabel: string) => string;
};

/**
 * Manual sequential navigation of read-only slides. Never drive periodic value changes to simulate
 * autoplay. className supports root width, margins and layout placement only, not internal paint.
 * No ref, asChild or imperative navigation API; do not switch control modes during an instance.
 */
export type CarouselProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'defaultValue'
  | 'onChange'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-roledescription'
  | 'tabIndex'
> & {
  /**
   * Ordered slides with non-empty unique values and names. Invalid collections render safely empty.
   * @control false
   * @controlReason Defined entries contain ReactNode content; see Default, Empty and DynamicItems.
   */
  items: CarouselItem[];
  /**
   * Non-empty visible and accessible collection name, without repeating its role description.
   * @control text
   */
  label: string;
  /**
   * Controlled accepted identity. Missing or unknown identities resolve to the first available item.
   * @control text
   */
  value?: string;
  /**
   * Initial uncontrolled identity; absence or an unknown identity resolves to the first item.
   * Later changes do not reset the current item.
   * @control text
   */
  defaultValue?: string;
  /**
   * One request for a changed identity per user navigation or settled scroll; never for prop updates.
   * @control false
   * @controlReason Callback functions are not serializable; see Controlled for acceptance and events.
   */
  onValueChange?: (value: string) => void;
  /**
   * Partial localizable dictionary. Each omitted or blank text falls back independently to English.
   * @control false
   * @controlReason The dictionary includes a formatter function; see Localized.
   */
  messages?: Partial<CarouselMessages>;
};

export const defaultCarouselMessages: CarouselMessages = {
  previousSlide: 'Previous slide',
  nextSlide: 'Next slide',
  carousel: 'carousel',
  slide: 'slide',
  instructions: 'Use Left and Right Arrow keys to change slide. Home and End go to the first and last slide.',
  empty: 'No slides',
  position: (current, total, itemLabel) => `${current} of ${total}: ${itemLabel}`
};

export const carouselVariants = cva('eg-carousel group min-w-0 flex flex-col gap-4 font-sans text-fg-default');
export const carouselHeaderVariants = cva('flex flex-wrap items-center justify-between gap-4');
export const carouselLabelVariants = cva('font-display text-label-eyebrow uppercase text-fg-secondary');
export const carouselControlsVariants = cva('flex items-center gap-2');
export const carouselCounterVariants = cva('font-display text-meta tabular-nums text-fg-secondary');
export const carouselCurrentVariants = cva('text-fg-default');
export const carouselTrackVariants = cva(
  'flex min-w-0 gap-7 overflow-x-auto snap-x snap-mandatory scroll-auto p-2 group-data-[state=dragging]:snap-none group-data-[state=dragging]:cursor-grabbing'
);
export const carouselSlideVariants = cva(
  'box-border min-w-0 basis-full shrink-0 snap-center rounded-lg outline-none focus-visible:shadow-[var(--shadow-focus)]'
);
export const carouselProgressVariants = cva('self-center w-full max-w-[calc(var(--space-20)*4)]');
export const carouselArrowVariants = cva('', {
  variants: { reversed: { true: 'rotate-180', false: 'rotate-0' } }
});
