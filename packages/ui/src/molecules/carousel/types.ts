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
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size
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
  /**
   * Track spacing and scrollbar presentation. Full-width keeps native scrolling and inset focus.
   * @control select
   * @default default
   */
  trackLayout?: 'default' | 'full-width';
  /**
   * Visual treatment of the slides. `current-emphasis` frames only the current slide with a brand border and glow and
   * leaves its neighbours unchanged; it reserves a transparent border on every slide and adds token padding around
   * the track for the glow. It applies to the default track layout; with `full-width` it resolves to `default`.
   * @control select
   * @default default
   */
  variant?: 'default' | 'current-emphasis';
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
export const carouselControlsVariants = cva('flex items-center gap-3');
export const carouselCounterVariants = cva('font-display text-meta tabular-nums text-fg-secondary');
export const carouselCurrentVariants = cva('text-fg-default');
export const carouselTrackVariants = cva(
  'flex min-w-0 overflow-x-auto snap-x snap-mandatory scroll-auto group-data-[state=dragging]:snap-none group-data-[state=dragging]:cursor-grabbing',
  {
    variants: {
      trackLayout: {
        default: 'gap-7',
        'full-width': 'gap-0 p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      },
      variant: { default: '', 'current-emphasis': '' }
    },
    // Padding is a compound: tailwind-merge lets a later `p-*` replace earlier side paddings but not the reverse,
    // so the default `p-2` must leave the class list whenever the emphasis padding applies. The emphasis padding
    // stays below the `gap-7` gap, so no neighbour is exposed at rest, and leaves room for the glow.
    compoundVariants: [
      { trackLayout: 'default', variant: 'default', class: 'p-2' },
      { trackLayout: 'default', variant: 'current-emphasis', class: 'px-6 pt-5 pb-7' }
    ],
    defaultVariants: { trackLayout: 'default', variant: 'default' }
  }
);
export const carouselSlideVariants = cva('box-border min-w-0 basis-full shrink-0 snap-center rounded-lg outline-none', {
  variants: {
    trackLayout: {
      default: 'focus-visible:shadow-[var(--shadow-focus)]',
      'full-width':
        'focus-visible:outline-solid focus-visible:outline-(length:--focus-width) focus-visible:outline-focus-ring focus-visible:-outline-offset-(--focus-width)'
    },
    variant: { default: '', 'current-emphasis': '' }
  },
  // Recipe R1 (spec v0.4): a transparent frame on every slide, painted only while the slide is `aria-current`.
  // `rounded-xl` replaces the base `rounded-lg`; the compound focus shadow lists the ring first so it paints above
  // the glow and, with one more selector than the plain focus rule, cannot lose to it. Forced colours drop shadows,
  // so the current slide gets a system-colour outline instead. Each utility is a static token-backed literal.
  compoundVariants: [
    {
      trackLayout: 'default',
      variant: 'current-emphasis',
      class:
        'rounded-xl border border-solid border-transparent transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out)] focus-visible:transition-none motion-reduce:transition-none aria-[current=true]:border-border-brand aria-[current=true]:shadow-[var(--shadow-glow-base)] aria-[current=true]:focus-visible:shadow-[var(--shadow-focus),var(--shadow-glow-base)] forced-colors:aria-[current=true]:outline-solid forced-colors:aria-[current=true]:outline-(length:--focus-width) forced-colors:aria-[current=true]:outline-[color:Highlight]'
    }
  ],
  defaultVariants: { trackLayout: 'default', variant: 'default' }
});
export const carouselProgressVariants = cva('self-center w-full max-w-[calc(var(--space-20)*4)]');
export const carouselArrowVariants = cva('', {
  variants: { reversed: { true: 'rotate-180', false: 'rotate-0' } }
});
