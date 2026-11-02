import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type { PhotoFrameFocalPoint, PhotoFrameProps, PhotoFrameVariant } from './types';
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
    'data-ratio': string;
    'data-variant': PhotoFrameVariant;
    'data-focal-point': PhotoFrameFocalPoint;
  };
  mediaClassName: string;
  viewportClassName: string;
  imageProps: ComponentPropsWithoutRef<'img'>;
  caption: string | undefined;
  captionClassName: string;
  labelClassName: string;
  /** Reservation handed to AspectRatio, or undefined when `auto` reserves nothing. */
  ratio: number | undefined;
};

const presetRatios = { square: 1, portrait: 4 / 5, landscape: 4 / 3 } as const;
// Same representability predicate as the AspectRatio primitive: a positive finite ratio with a finite
// reciprocal percentage. No additional usable-box bounds, rounding or clamping.
const representable = (ratio: number) => Number.isFinite(ratio) && ratio > 0 && Number.isFinite(100 / ratio);

type RatioResolution = { auto: boolean; ratio: number | undefined; marker: string };

/** Resolve a preset, `auto` or numeric proportion, mirroring AspectRatio for unrepresentable numbers. */
function resolveRatio(requested: PhotoFrameProps['ratio']): RatioResolution {
  if (typeof requested === 'number') {
    return representable(requested)
      ? { auto: false, ratio: requested, marker: String(requested) }
      : { auto: false, ratio: presetRatios.square, marker: 'square' };
  }
  if (requested === 'auto') {
    return { auto: true, ratio: undefined, marker: 'auto' };
  }
  const preset = requested === 'square' || requested === 'portrait' ? requested : 'landscape';
  return { auto: false, ratio: presetRatios[preset], marker: preset };
}

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
  const { auto, ratio, marker } = resolveRatio(requestedRatio);
  const variant: PhotoFrameVariant = requestedVariant === 'framed' ? 'framed' : 'default';
  const focalPoint: PhotoFrameFocalPoint =
    requestedFocalPoint === 'top' ||
    requestedFocalPoint === 'bottom' ||
    requestedFocalPoint === 'left' ||
    requestedFocalPoint === 'right' ||
    requestedFocalPoint === 'left-top' ||
    requestedFocalPoint === 'right-top' ||
    requestedFocalPoint === 'left-bottom' ||
    requestedFocalPoint === 'right-bottom'
      ? requestedFocalPoint
      : 'center';
  const caption = typeof imageCaption === 'string' && imageCaption.trim() ? imageCaption : undefined;
  return {
    rootProps: {
      ...native,
      'data-ratio': marker,
      'data-variant': variant,
      'data-focal-point': focalPoint,
      className: cn(
        photoFrameRootVariants({ caption: caption ? variant : 'none', ratio: auto ? 'auto' : 'preset' }),
        className
      )
    },
    mediaClassName: cn(
      surfaceVariants({
        tone: variant === 'framed' ? 'surface-0' : 'surface-1',
        elevation: variant === 'framed' ? 2 : 1,
        padding: 'none',
        radius: 'xl'
      }),
      photoFrameMediaVariants({ variant, ratio: auto ? 'auto' : 'preset' })
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
    ratio
  };
}
