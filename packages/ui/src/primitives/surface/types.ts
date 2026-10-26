import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, HTMLAttributes, ReactElement, ReactNode, RefAttributes } from 'react';

/** Grafito tonal ladder that accepts an elevation. */
export type SurfaceRaisedTone = 'surface-0' | 'surface-1' | 'surface-2' | 'surface-3';

/** Material level: the tonal ladder, the recessed well or the floating translucent overlay. */
export type SurfaceTone = SurfaceRaisedTone | 'well' | 'overlay';

/** Light edge and two-layer shadow level, mirroring --shadow-elev-1…3. */
export type SurfaceElevation = 0 | 1 | 2 | 3;

/** Inner spacing preset mapped to --space-0/3/6/8. */
export type SurfacePadding = 'none' | 'sm' | 'md' | 'lg';

/** Corner radius preset mapped to --radius-*. */
export type SurfaceRadius = 'none' | 'md' | 'lg' | 'xl' | 'full';

const sheen = 'bg-[image:var(--gradient-sheen)]';
const raisedTones: SurfaceRaisedTone[] = ['surface-0', 'surface-1', 'surface-2', 'surface-3'];

export const surfaceVariants = cva('eg-surface box-border border border-solid text-fg-default', {
  variants: {
    tone: {
      'surface-0': 'bg-surface-0',
      'surface-1': `bg-surface-1 ${sheen}`,
      'surface-2': `bg-surface-2 ${sheen}`,
      'surface-3': `bg-surface-3 ${sheen}`,
      well: 'bg-surface-0 border-border-hairline shadow-[var(--shadow-well)]',
      overlay: [
        'bg-surface-overlay backdrop-blur-overlay backdrop-saturate-150',
        'border-border-hairline-strong shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]',
        '[@media(prefers-reduced-transparency:reduce)]:bg-surface-2',
        '[@media(prefers-reduced-transparency:reduce)]:backdrop-filter-none',
        'not-supports-[backdrop-filter]:bg-surface-2'
      ]
    },
    // Elevation paints only through the raised-tone compounds below.
    elevation: { 0: '', 1: '', 2: '', 3: '' },
    padding: { none: 'p-0', sm: 'p-3', md: 'p-6', lg: 'p-8' },
    radius: {
      none: 'rounded-none',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full'
    }
  },
  compoundVariants: [
    { tone: raisedTones, elevation: 0, class: 'border-border-hairline shadow-edge' },
    {
      tone: raisedTones,
      elevation: 1,
      class: 'border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)]'
    },
    {
      tone: raisedTones,
      elevation: 2,
      class: 'border-border-hairline-strong shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)]'
    },
    {
      tone: raisedTones,
      elevation: 3,
      class: 'border-border-hairline-strong shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]'
    },
    { tone: 'surface-0', elevation: [1, 2, 3], class: sheen }
  ],
  defaultVariants: { tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }
});

type SurfaceRaisedToneProps = {
  /**
   * Material level. Raised tones accept an elevation; well is recessed and overlay floats.
   * @default surface-1
   * @control select
   */
  tone?: SurfaceRaisedTone;
  /**
   * Light edge and two-layer shadow of a raised tone; well and overlay reject it.
   * @default 1
   * @control select
   */
  elevation?: SurfaceElevation;
};

// Union branches merge their JSDoc in docgen: repeat @control, keep @default on one branch.
type SurfaceFixedToneProps = {
  /**
   * Material level. Raised tones accept an elevation; well is recessed and overlay floats.
   * @control select
   */
  tone: 'well' | 'overlay';
  /**
   * Light edge and two-layer shadow of a raised tone; well and overlay reject it.
   * @control select
   */
  elevation?: never;
};

type SurfaceOwnProps = (SurfaceRaisedToneProps | SurfaceFixedToneProps) & {
  /**
   * Inner spacing between the edge and the content.
   * @default md
   * @control select
   */
  padding?: SurfacePadding;
  /**
   * Corner radius; none serves bands stacked inside a panel.
   * @default xl
   * @control select
   */
  radius?: SurfaceRadius;
};

/** Default branch: renders a div and forwards an HTMLDivElement ref. */
export type SurfaceDefaultProps = ComponentPropsWithoutRef<'div'> &
  SurfaceOwnProps & {
    /**
     * Merge the material onto one HTMLElement-backed child through Slot instead of a div.
     * @default false
     * @control boolean
     */
    asChild?: false;
    /**
     * Surface content; with asChild, exactly one prop-spreading, ref-forwarding element.
     * @control false
     * @controlReason ReactNode content is not serializable; see Default and AsChild.
     */
    children?: ReactNode;
  };

/** Slotted branch: one HTMLElement-backed child receives the classes, props and ref. */
export type SurfaceSlottedProps = Omit<HTMLAttributes<HTMLElement>, 'children'> &
  SurfaceOwnProps & {
    /**
     * Merge the material onto one HTMLElement-backed child through Slot instead of a div.
     * @control boolean
     */
    asChild: true;
    /**
     * Surface content; with asChild, exactly one prop-spreading, ref-forwarding element.
     * @control false
     * @controlReason ReactNode content is not serializable; see Default and AsChild.
     */
    children: ReactElement;
  };

/** Static Material v2 box: tonal level, light edge, two-layer shadow, border, radius and padding. */
export type SurfaceProps = SurfaceDefaultProps | SurfaceSlottedProps;

/**
 * Public call signature: a div ref only on the default branch, an HTMLElement ref when slotted.
 * One signature over the discriminated union keeps both branches visible to docgen and Storybook.
 */
export type SurfaceComponent = {
  (
    props: (SurfaceDefaultProps & RefAttributes<HTMLDivElement>) | (SurfaceSlottedProps & RefAttributes<HTMLElement>)
  ): ReactNode;
  displayName?: string;
};
