import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/** Reserved image proportions. */
export type PhotoFrameRatio = 'square' | 'portrait' | 'landscape';
/** Material framing treatment. */
export type PhotoFrameVariant = 'default' | 'framed';
/** Cover alignment within the image viewport. */
export type PhotoFrameFocalPoint = 'center' | 'top' | 'bottom' | 'left' | 'right';

type PhotoFrameImageProps = Pick<
  ComponentPropsWithoutRef<'img'>,
  | 'srcSet'
  | 'sizes'
  | 'width'
  | 'height'
  | 'loading'
  | 'decoding'
  | 'crossOrigin'
  | 'referrerPolicy'
  | 'onLoad'
  | 'onError'
> & {
  /** Image resource; the caller supplies a non-empty source.
   * @control text
   */
  src: string;
  /** Image alternative; use an explicit empty string for decorative media.
   * @control text
   */
  alt: string;
};
type PhotoFrameNativeProps = Omit<
  ComponentPropsWithoutRef<'figure'>,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'onLoad'
  | 'onError'
  | 'role'
  | 'tabIndex'
  | 'accessKey'
  | 'contentEditable'
  | 'onClick'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-hidden'
  | 'aria-live'
>;

/** Passive editorial image with optional plain caption. Layout className applies to the figure only. */
export type PhotoFrameProps = PhotoFrameNativeProps &
  PhotoFrameImageProps & {
    /** Reserved viewport proportions.
     * @default landscape
     * @control select
     */
    ratio?: PhotoFrameRatio;
    /** Material framing treatment.
     * @default default
     * @control select
     */
    variant?: PhotoFrameVariant;
    /** Cover alignment inside the viewport.
     * @default center
     * @control select
     */
    focalPoint?: PhotoFrameFocalPoint;
    /** Optional plain caption; blank text omits the caption and its gap.
     * @control text
     */
    imageCaption?: string;
  };

export const photoFrameRootVariants = cva(
  'eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none',
  {
    variants: { caption: { none: 'gap-0', default: 'gap-3', framed: 'gap-10' } },
    defaultVariants: { caption: 'none' }
  }
);
export const photoFrameMediaVariants = cva('transition-none', {
  variants: {
    variant: {
      default: 'transform-none rotate-none',
      framed:
        'p-1.5 rotate-[calc(var(--tilt-max)/3)] motion-reduce:rotate-none motion-reduce:transform-none motion-reduce:transition-none'
    }
  },
  defaultVariants: { variant: 'default' }
});
export const photoFrameViewportVariants = cva('size-full overflow-hidden', {
  variants: { variant: { default: 'rounded-xl', framed: 'rounded-lg' } },
  defaultVariants: { variant: 'default' }
});
export const photoFrameImageVariants = cva(
  'eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none',
  {
    variants: {
      focalPoint: {
        center: 'object-center',
        top: 'object-top',
        bottom: 'object-bottom',
        left: 'object-left',
        right: 'object-right'
      }
    },
    defaultVariants: { focalPoint: 'center' }
  }
);
export const photoFrameCaptionVariants = cva(
  'eg-photo__cap relative inset-auto z-auto m-0 block min-w-0 pointer-events-auto'
);
export const photoFrameLabelVariants = cva(
  'eg-photo__label block min-w-0 font-display text-label-eyebrow uppercase text-inherit before:content-none'
);
