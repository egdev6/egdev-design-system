import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type { PhotoFrameFocalPoint, PhotoFrameProps, PhotoFrameRatio, PhotoFrameVariant } from './types';
import {
  photoFrameCaptionVariants,
  photoFrameImageVariants,
  photoFrameLabelVariants,
  photoFrameMediaVariants,
  photoFrameRootVariants,
  photoFrameViewportVariants
} from './types';

type PhotoFrameResult = {
  rootProps: ComponentPropsWithoutRef<'figure'> & {
    'data-ratio': PhotoFrameRatio;
    'data-variant': PhotoFrameVariant;
    'data-focal-point': PhotoFrameFocalPoint;
  };
  mediaClassName: string;
  viewportClassName: string;
  imageProps: ComponentPropsWithoutRef<'img'>;
  caption: string | undefined;
  captionClassName: string;
  labelClassName: string;
  ratio: number;
};

/** Resolve native destinations, static recipes and the reserved image ratio. */
export function usePhotoFrame({
  src,
  alt,
  srcSet,
  sizes,
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  crossOrigin,
  referrerPolicy,
  onLoad,
  onError,
  ratio: requestedRatio,
  variant: requestedVariant,
  focalPoint: requestedFocalPoint,
  imageCaption,
  className,
  ...native
}: PhotoFrameProps): PhotoFrameResult {
  const ratio: PhotoFrameRatio =
    requestedRatio === 'square' || requestedRatio === 'portrait' ? requestedRatio : 'landscape';
  const variant: PhotoFrameVariant = requestedVariant === 'framed' ? 'framed' : 'default';
  const focalPoint: PhotoFrameFocalPoint =
    requestedFocalPoint === 'top' ||
    requestedFocalPoint === 'bottom' ||
    requestedFocalPoint === 'left' ||
    requestedFocalPoint === 'right'
      ? requestedFocalPoint
      : 'center';
  const caption = typeof imageCaption === 'string' && imageCaption.trim() ? imageCaption : undefined;
  return {
    rootProps: {
      ...native,
      'data-ratio': ratio,
      'data-variant': variant,
      'data-focal-point': focalPoint,
      className: cn(photoFrameRootVariants({ caption: caption ? variant : 'none' }), className)
    },
    mediaClassName: cn(
      surfaceVariants({
        tone: variant === 'framed' ? 'surface-0' : 'surface-1',
        elevation: variant === 'framed' ? 2 : 1,
        padding: 'none',
        radius: 'xl'
      }),
      photoFrameMediaVariants({ variant })
    ),
    viewportClassName: cn(photoFrameViewportVariants({ variant })),
    imageProps: {
      src,
      alt,
      srcSet,
      sizes,
      width,
      height,
      loading,
      decoding,
      crossOrigin,
      referrerPolicy,
      onLoad,
      onError,
      className: cn(photoFrameImageVariants({ focalPoint }))
    },
    caption,
    captionClassName: cn(photoFrameCaptionVariants()),
    labelClassName: cn(photoFrameLabelVariants()),
    ratio: ratio === 'square' ? 1 : ratio === 'portrait' ? 4 / 5 : 4 / 3
  };
}
