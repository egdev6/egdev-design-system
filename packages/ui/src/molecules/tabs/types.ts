import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Counter status family, independent of selection. */
export type TabsTone = 'neutral' | 'danger';
/** In-page tab row treatment. */
export type TabsVariant = 'underline' | 'segmented' | 'outline';
/** Underline dimensions; segmented and outline have one fixed height. */
export type TabsSize = 'md' | 'sm';

/** One sibling view. Values must be unique and non-empty; keep at least one item enabled. */
export type TabsItem = {
  /**
   * Unique, non-empty tab and panel identity within this collection.
   * @control text
   */
  value: string;
  /**
   * Visible tab text; reinforce danger counters with meaningful text such as With errors.
   * @control text
   */
  label: string;
  /**
   * Optional raw numeric counter, including zero; no formatting or cap is applied.
   * @control number
   */
  count?: number;
  /**
   * Counter color family; has no effect when count is absent.
   * @default neutral
   * @control select
   */
  tone?: TabsTone;
  /**
   * Prevent selection and skip this tab in Radix keyboard navigation.
   * @control boolean
   */
  disabled?: boolean;
  /**
   * Panel contents unmount while inactive; lift persistent state into the consumer.
   * @control false
   * @controlReason Non-serializable ReactNode; see the Default and Segmented stories.
   */
  content: ReactNode;
};

/**
 * Horizontal in-page view switcher. Radix owns selection, automatic activation, focus and ARIA.
 * className supports outer layout (margin, width, grid placement), merged last through cn;
 * appearance and internal-part overrides are unsupported. No ref, asChild or children API.
 */
export type TabsProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'defaultValue' | 'dir' | 'onChange'> & {
  /**
   * Ordered views: unique, non-empty values and at least one enabled item are required.
   * @control false
   * @controlReason Items contain non-serializable ReactNode panels; see the Default and WithCounts stories.
   */
  items: TabsItem[];
  /**
   * Accessible name of the tablist.
   * @control text
   */
  label: string;
  /**
   * Controlled selection. When absent, Radix manages selection internally.
   * @control text
   */
  value?: string;
  /**
   * Initial uncontrolled selection; when absent, selects the first enabled item.
   * @control text
   */
  defaultValue?: string;
  /**
   * Notifies a user-driven selection change; incoming prop updates do not emit it.
   * @control false
   * @controlReason Non-serializable callback; see the Controlled story.
   */
  onValueChange?: (value: string) => void;
  /**
   * Underline row, recessed segmented well, or outline well whose selected tab shows an accent border
   * and chip sheen over surface-1.
   * @default underline
   * @control select
   */
  variant?: TabsVariant;
  /**
   * Underline height and horizontal padding only; segmented and outline always use their single height.
   * @default md
   * @control select
   */
  size?: TabsSize;
  /**
   * Fill the available width with equal segmented or outline tabs when they fit; overflowing tabs may be
   * unequal. Has no effect on underline.
   * @default false
   * @control boolean
   */
  fullWidth?: boolean;
  /**
   * Wrap and start-align segmented or outline labels, including long words; has no effect on underline.
   * @default false
   * @control boolean
   */
  labelWrap?: boolean;
};

/** Public root recipe resets the legacy tablist geometry without emitting legacy part markers. */
export const tabsVariants = cva('eg-tabs flex flex-col gap-0 border-0 overflow-visible');

/** Only the segmented and outline lists compose the existing Surface well recipe in useTabs. */
export const tabsListVariants = cva('', {
  variants: {
    variant: {
      underline: 'flex items-stretch gap-1 border-b border-border-default overflow-x-auto [scrollbar-width:none]',
      segmented: 'inline-flex self-start gap-0.5 p-0.75',
      outline: 'inline-flex self-start gap-0.5 p-0.75'
    },
    fullWidth: { true: '', false: '' }
  },
  compoundVariants: [
    {
      variant: ['segmented', 'outline'],
      fullWidth: true,
      // Reserve room for the 4px focus ring even at the scrollport edges. The overflow scrollbar is
      // thin and token-colored: Blink/WebKit pseudo-elements without arrow buttons, and the standard
      // properties only where those pseudo-elements do not exist (Firefox), because Chromium 121+
      // ignores the pseudo-elements once the standard properties are set.
      class: [
        'grid grid-flow-col auto-cols-[1fr] w-full self-stretch overflow-x-auto p-1.5 scroll-px-1.5',
        '[&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-button]:hidden',
        '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border-control hover:[&::-webkit-scrollbar-thumb]:bg-fg-muted',
        'supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-width:thin] supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-color:var(--color-border-control)_transparent]'
      ]
    }
  ],
  defaultVariants: { variant: 'underline' }
});

/** Attribute-based selection styling; no duplicated state classes or keyboard behavior. */
export const tabsTriggerVariants = cva(
  [
    'relative inline-flex items-center gap-2 border-0 bg-transparent cursor-pointer whitespace-nowrap font-sans text-label-default text-fg-secondary',
    'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:text-fg-default data-[state=active]:text-fg-default',
    'disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed motion-reduce:transition-none'
  ],
  {
    variants: {
      variant: {
        underline: [
          'after:absolute after:-bottom-px after:h-0.5 after:rounded-full after:bg-transparent after:transition-colors motion-reduce:after:transition-none',
          'data-[state=active]:after:bg-state-selected data-[state=active]:after:shadow-[var(--shadow-state-indicator)]',
          'focus-visible:outline-none focus-visible:inset-ring-2 focus-visible:inset-ring-focus-ring'
        ],
        segmented: [
          'min-h-8.5 px-3 rounded-[calc(var(--radius-md)---spacing(0.75))] isolate border border-transparent',
          'data-[state=active]:border-border-brand data-[state=active]:bg-state-selected-surface data-[state=active]:bg-[image:var(--gradient-sheen)] data-[state=active]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)]',
          "data-[state=active]:before:content-['']",
          'data-[state=active]:before:pointer-events-none data-[state=active]:before:absolute data-[state=active]:before:inset-0 data-[state=active]:before:-z-10 data-[state=active]:before:rounded-[inherit] data-[state=active]:before:bg-border-brand',
          'focus-visible:outline-none focus-visible:shadow-focus data-[state=active]:focus-visible:shadow-focus'
        ],
        // Accent-following border and chip sheen over surface-1 with the edge-only shadow; no overlay.
        outline: [
          'min-h-8.5 px-3 rounded-[calc(var(--radius-md)---spacing(0.75))] border border-transparent',
          'data-[state=active]:border-state-selected data-[state=active]:[background:var(--gradient-chip-active),var(--color-surface-1)] data-[state=active]:shadow-[var(--shadow-edge-strong)]',
          'focus-visible:outline-none focus-visible:shadow-focus data-[state=active]:focus-visible:shadow-focus'
        ]
      },
      size: { md: '', sm: '' },
      fullWidth: { true: '', false: '' },
      labelWrap: { true: '', false: '' }
    },
    compoundVariants: [
      { variant: 'underline', size: 'md', class: 'min-h-11 px-3 after:inset-x-3' },
      { variant: 'underline', size: 'sm', class: 'min-h-9 px-2 after:inset-x-2' },
      { variant: ['segmented', 'outline'], fullWidth: true, class: 'justify-center' },
      {
        variant: ['segmented', 'outline'],
        labelWrap: true,
        class: 'whitespace-normal wrap-anywhere text-start justify-start py-1'
      },
      // Full width scrolls, so keep words whole and let a long word widen its column instead.
      { variant: ['segmented', 'outline'], fullWidth: true, labelWrap: true, class: 'wrap-break-word' }
    ],
    defaultVariants: { variant: 'underline', size: 'md' }
  }
);

/** A compact counter part, not a Badge recipe override. */
export const tabsCountVariants = cva(
  'inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full shadow-edge text-label-default leading-none tabular-nums',
  {
    variants: {
      tone: {
        neutral: 'bg-bg-glass text-fg-secondary',
        danger: 'bg-status-danger/14 text-status-danger'
      },
      variant: { underline: '', segmented: '', outline: '' },
      labelWrap: { true: '', false: '' }
    },
    compoundVariants: [{ variant: ['segmented', 'outline'], labelWrap: true, class: 'whitespace-nowrap' }],
    defaultVariants: { tone: 'neutral', variant: 'underline' }
  }
);

/** Panel spacing only: consumers own content surfaces. */
export const tabsPanelVariants = cva(
  'pt-4 focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2'
);
