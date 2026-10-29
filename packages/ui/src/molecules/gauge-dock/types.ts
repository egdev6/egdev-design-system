import type * as ToolbarPrimitive from '@radix-ui/react-toolbar';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import type { Gauge, GaugeProps } from '../../atoms/gauge';

/**
 * Independent passive measurements beside related actions in a named Radix toolbar.
 * Surface owns overlay/sm/full Material. className supports outer dimensions, margins,
 * positioning and alignment only, not Material, padding or child appearance overrides.
 * No public ref, asChild, selection, aggregate measurement or overlay state.
 */
export type GaugeDockProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'tabIndex'
  | 'dir'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-orientation'
> &
  Pick<ComponentPropsWithoutRef<typeof ToolbarPrimitive.Root>, 'dir'> & {
    /**
     * Required non-empty accessible toolbar name, describing the related operations.
     * @control text
     */
    label: string;
    /**
     * Layout and Radix arrow-key axis; navigation never wraps.
     * @default horizontal
     * @control select
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * Items and optional decorative Separators; arrays/fragments are supported.
     * Null or absent content renders nothing. Pass native dir explicitly for RTL (default ltr).
     * @control false
     * @controlReason Non-serializable ReactNode composition; see Default, Vertical and Empty.
     */
    children: ReactNode;
  };

/** Local measurement/action alignment, with outer layout-only className merging. */
export type GaugeDockItemProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'dangerouslySetInnerHTML' | 'role' | 'tabIndex'
> & {
  /**
   * Exactly one direct passive Gauge followed by a separately named button-compatible element.
   * The action must forward props/ref to one button, use type button and expose disabled here.
   * No links, nested buttons, opaque disabled wrappers or extra focusable content are supported.
   * @control false
   * @controlReason ReactElement tuple is not serializable; see Default and WithDetailAction.
   */
  children: [ReactElement<GaugeProps, typeof Gauge>, ReactElement];
};

/** Decorative perpendicular separator; no content, focus, ref or orientation API. */
export type GaugeDockSeparatorProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'dangerouslySetInnerHTML' | 'role' | 'tabIndex' | 'aria-orientation' | 'aria-hidden'
>;

export const gaugeDockVariants = cva(
  'eg-gauge-dock group inline-flex max-w-full max-h-full flex-nowrap items-center gap-3 overflow-auto data-[orientation=vertical]:flex-col'
);
export const gaugeDockItemVariants = cva('eg-gauge-dock-item flex shrink-0 items-center gap-2');
export const gaugeDockSeparatorVariants = cva(
  'eg-gauge-dock-separator shrink-0 bg-border-hairline data-[orientation=vertical]:w-px data-[orientation=vertical]:h-6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-6'
);
