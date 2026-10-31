import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Static tonal hierarchy, independent of child interaction. */
export type PanelVariant = 'default' | 'banded';
/** Explicit frame ownership; inherit requires an already painted surface-2 or overlay host. */
export type PanelTone = 'surface-1' | 'overlay' | 'inherit';

type PanelNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'style'
  | 'dangerouslySetInnerHTML'
  | 'contentEditable'
  | 'role'
  | 'tabIndex'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-live'
  | 'aria-modal'
  | 'aria-disabled'
  | 'aria-selected'
  | 'aria-pressed'
>;

/** Passive compound content unit. className supports outer layout only; no ref or asChild API. */
export type PanelProps = PanelNativeProps & {
  /**
   * Optional Header, exactly one Body and optional Footer, in direct DOM sibling order.
   * Fragments without wrappers are supported; Panel never parses or repairs the child tree.
   * @control false
   * @controlReason ReactNode composition is not serializable; see Default, OptionalParts and NestedPanels.
   */
  children: ReactNode;
  /**
   * Shared presentation of the supplied zones, without changing their behavior.
   * @default default
   * @control select
   */
  variant?: PanelVariant;
  /**
   * Explicit Material ownership. Inherit exposes an existing raised host, never infers one.
   * @default surface-1
   * @control select
   */
  tone?: PanelTone;
};

/** Supplied identity/context zone; no generated heading or landmark. */
export type PanelHeaderProps = PanelNativeProps & {
  /**
   * Meaningful supplied header content. Omit the part itself when it is not needed.
   * @control false
   * @controlReason ReactNode content is not serializable; see Default and OptionalParts for header composition.
   */
  children: ReactNode;
};

/** Required transparent main-content zone; child controls own their behavior. */
export type PanelBodyProps = PanelNativeProps & {
  /**
   * Free flow content and independently labelled consumer controls.
   * @control false
   * @controlReason ReactNode content is not serializable; see ChildControls, NestedPanels and InPopover.
   */
  children: ReactNode;
};

/** Supplementary metadata/utility zone, not a page-footer landmark. */
export type PanelFooterProps = PanelNativeProps & {
  /**
   * Supplied metadata and related utility controls. Omit the part when absent.
   * @control false
   * @controlReason ReactNode content is not serializable; see Default and OptionalParts for footer composition.
   */
  children: ReactNode;
};

const framedCorners = [
  'first:rounded-t-[calc(var(--radius-xl)-var(--border-width))]',
  'last:rounded-b-[calc(var(--radius-xl)-var(--border-width))]'
];
const cornerVariants = {
  'surface-1': framedCorners,
  overlay: framedCorners,
  inherit: 'first:rounded-t-xl last:rounded-b-xl'
};
const zoneGeometry = 'box-border min-w-0 p-4 wrap-anywhere rounded-none';

/** Internal frame layout; actual Surface owns framed paint. */
export const panelVariants = cva(
  'eg-panel box-border flex flex-col min-w-0 gap-0 p-0 overflow-visible font-sans text-body-default text-fg-default',
  {
    variants: {
      tone: {
        'surface-1': '',
        overlay: '',
        inherit: 'border-0 border-solid bg-transparent bg-none shadow-none backdrop-filter-none'
      }
    },
    defaultVariants: { tone: 'surface-1' }
  }
);

/** Native header band keeps only the bottom hairline and Surface's light edge. */
export const panelHeaderVariants = cva(['eg-panel__header flex flex-wrap items-center gap-3', zoneGeometry], {
  variants: {
    tone: cornerVariants,
    variant: { default: '', banded: 'border-x-0 border-t-0 border-b' }
  }
});

/** Transparent body geometry, never an independent Surface recipe. */
export const panelBodyVariants = cva(['eg-panel__body flex flex-col gap-4', zoneGeometry], {
  variants: { tone: cornerVariants }
});

/** Native lower band keeps only its top hairline, with no sheen or shadow. */
export const panelFooterVariants = cva(['eg-panel__footer flex flex-wrap items-center gap-3', zoneGeometry], {
  variants: {
    tone: cornerVariants,
    variant: { default: '', banded: 'border-x-0 border-b-0 border-t bg-none shadow-none' }
  }
});
