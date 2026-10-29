import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/** Selection cardinality; single radios cannot be cleared by reactivation. */
export type SelectTileType = 'single' | 'multiple';
/** Fixed media formats, shared by every option in a collection. */
export type SelectTileRatio = 'landscape' | 'portrait' | 'story' | 'square' | 'wide' | 'banner';
/** Decorative media; option labels must carry all identifying information. */
export type SelectTileThumbnail = {
  /**
   * Preview image source. A changed source retries after a failure.
   * @control text
   */
  src: string;
};

/** Standard visual option; values and labels must be non-empty and values unique. */
export type SelectTileOption = {
  /**
   * Unique choice identity, not a form field name.
   * @control text
   */
  value: string;
  /**
   * Visible name and accessible control name.
   * @control text
   */
  label: string;
  /**
   * Supplementary accessible description; empty text is omitted.
   * @control text
   */
  meta?: string;
  /**
   * Decorative preview; omitted or failed media repeats the label decoratively.
   * @control false
   * @controlReason Thumbnail data is structured media; see MissingThumbnail and FailedThumbnail.
   */
  thumb?: SelectTileThumbnail;
  /**
   * Disable this option while preserving selection and live meaning.
   * @default false
   * @control boolean
   */
  disabled?: boolean;
} & (
  | {
      /**
       * Marks the option currently on air, independently of selection. At most one may be live.
       * @control boolean
       */
      live: true;
      /**
       * Non-empty readable live-state annotation, included in the accessible description.
       * @control text
       */
      badge: string;
    }
  | {
      /**
       * Marks the option currently on air, independently of selection. At most one may be live.
       * @default false
       * @control boolean
       */
      live?: false;
      /**
       * Passive media annotation; empty text is omitted.
       * @control text
       */
      badge?: string;
    }
);

type SelectTileNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'defaultValue'
  | 'onChange'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'tabIndex'
  | 'dangerouslySetInnerHTML'
  | 'dir'
>;

type SelectTileCommonProps = SelectTileNativeProps & {
  /**
   * Non-empty accessible collection name.
   * @control text
   */
  label: string;
  /**
   * Standard cards in data order; an empty collection is allowed. Consumers own valid values.
   * @control false
   * @controlReason Structured option data cannot use a scalar control; see Single and Multiple.
   */
  options: SelectTileOption[];
  /**
   * Collection-wide thumbnail proportions.
   * @default landscape
   * @control select
   */
  ratio?: SelectTileRatio;
  /**
   * Disable every card, dimming each entire card once.
   * @default false
   * @control boolean
   */
  disabled?: boolean;
  /**
   * Logical text and horizontal keyboard direction.
   * @default ltr
   * @control select
   */
  dir?: 'ltr' | 'rtl';
};

/**
 * Visual choices coordinated through Radix. Do not change type or controlledness during a mount.
 * Root className supports margins, width, column count and parent layout only; it merges last
 * through cn, not a universal appearance override. No ref, asChild or custom card renderer.
 */
export type SelectTileProps = SelectTileCommonProps &
  (
    | {
        /**
         * Single radio choice or independent multiple toggles.
         * @control select
         */
        type: 'single';
        /**
         * Authoritative selection; an empty string clears without an event on prop updates.
         * @control false
         * @controlReason Mode-dependent string / string[] type; see Single, Multiple and Controlled.
         */
        value?: string;
        /**
         * Initial uncontrolled selection only; absent means no selection.
         * @control false
         * @controlReason Mode-dependent string / string[] type; see Single, Multiple and Controlled.
         */
        defaultValue?: string;
        /**
         * User-driven next selection. Absent unless the consumer subscribes.
         * @control false
         * @controlReason Callback functions are not serializable; see Single, Multiple and Controlled.
         */
        onValueChange?: (value: string) => void;
        /**
         * Native-equivalent single-mode form field name; omitted unless supplied.
         * @control text
         */
        name?: string;
        /**
         * Native-equivalent single-mode form requirement.
         * @default false
         * @control boolean
         */
        required?: boolean;
      }
    | {
        /**
         * Single radio choice or independent multiple toggles.
         * @control select
         */
        type: 'multiple';
        /**
         * Authoritative selection in Radix activation order; an empty array clears.
         * @control false
         * @controlReason Mode-dependent string / string[] type; see Single, Multiple and Controlled.
         */
        value?: string[];
        /**
         * Initial uncontrolled selection only; absent means no selection.
         * @control false
         * @controlReason Mode-dependent string / string[] type; see Single, Multiple and Controlled.
         */
        defaultValue?: string[];
        /**
         * User-driven next selection in activation order, including an empty array.
         * @control false
         * @controlReason Callback functions are not serializable; see Single, Multiple and Controlled.
         */
        onValueChange?: (value: string[]) => void;
        /**
         * Form field names are unavailable in multiple mode; consumers serialize values themselves.
         * @control text
         */
        name?: never;
        /**
         * Native required validation is unavailable in multiple mode.
         * @control boolean
         */
        required?: never;
      }
  );

export const selectTileVariants = {
  root: cva('eg-select-tile grid grid-cols-2 gap-3'),
  card: cva([
    'eg-tile group/tile relative flex flex-col gap-2 p-2 min-w-0 min-h-11 text-start font-sans cursor-pointer no-underline',
    'transition-[border-color,box-shadow] duration-(--duration-fast) ease-(--ease-out)',
    'hover:border-border-hairline-strong hover:shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)]',
    'has-[[data-state=checked]]:bg-surface-3 has-[[data-state=on]]:bg-surface-3',
    'has-[[data-state=checked]]:bg-[image:var(--gradient-post-new)] has-[[data-state=on]]:bg-[image:var(--gradient-post-new)]',
    'has-[[data-state=checked]]:border-border-brand has-[[data-state=on]]:border-border-brand',
    'has-[[data-state=checked]]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)] has-[[data-state=on]]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)]',
    'data-[state=live]:border-fg-brand-default data-[state=live]:shadow-[var(--shadow-edge-strong),var(--shadow-glow-base)]',
    'data-[state=live]:has-[[data-state=checked]]:border-fg-brand-default data-[state=live]:has-[[data-state=on]]:border-fg-brand-default',
    'data-[state=live]:has-[[data-state=checked]]:shadow-[var(--shadow-edge-strong),var(--shadow-glow-base)] data-[state=live]:has-[[data-state=on]]:shadow-[var(--shadow-edge-strong),var(--shadow-glow-base)]',
    'data-disabled:opacity-45 data-disabled:pointer-events-none data-disabled:cursor-not-allowed',
    'motion-reduce:transition-none motion-reduce:transform-none'
  ]),
  media: cva('relative overflow-hidden'),
  image: cva('w-full h-full object-cover block'),
  fallback: cva('w-full h-full grid place-items-center text-cta-label text-fg-default font-sans'),
  badge: cva('absolute top-1.5 start-1.5 pointer-events-none'),
  label: cva([
    'text-cta-label text-fg-default px-1 wrap-anywhere',
    'group-has-[[data-state=checked]]/tile:underline group-has-[[data-state=on]]/tile:underline',
    'decoration-(length:--border-width) underline-offset-(--space-1)'
  ]),
  meta: cva('text-label-default font-[var(--text-body-default--font-weight)] text-fg-muted px-1 pb-1 wrap-anywhere'),
  control: cva([
    'absolute inset-0 w-full h-full rounded-lg border-0 border-solid bg-transparent bg-none p-0 cursor-pointer appearance-none',
    'focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed'
  ])
};
