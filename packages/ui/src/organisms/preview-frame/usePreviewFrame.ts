import { type CSSProperties, useId } from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import {
  actionsVariants,
  canvasInnerVariants,
  canvasVariants,
  captionVariants,
  footerVariants,
  labelVariants,
  type PreviewFrameProps,
  rootVariants,
  safeAreaVariants,
  zoneVariants
} from './types';

const fallbackRatio = 16 / 9;
// Same representability predicate as the existing AspectRatio primitive: a positive finite ratio
// with a finite reciprocal percentage. No additional usable-box bounds.
const representable = (ratio: number) => Number.isFinite(ratio) && ratio > 0 && Number.isFinite(100 / ratio);
const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));

export function usePreviewFrame({
  ratio = fallbackRatio,
  variant: _variant = 'grid',
  safeArea = true,
  zones = [],
  figureCaption,
  actions,
  footer,
  children,
  className,
  ...rest
}: PreviewFrameProps) {
  const captionId = useId();
  const dev = typeof process === 'undefined' || process.env.NODE_ENV !== 'production';
  const validRatio = representable(ratio);
  if (!validRatio && dev) {
    console.warn('PreviewFrame: ratio cannot be represented; falling back to 16:9.');
  }
  const guides = zones.flatMap((zone) => {
    if (![zone.x, zone.y, zone.width, zone.height].every(Number.isFinite)) {
      if (dev) {
        console.warn('PreviewFrame: non-finite zone geometry omitted.');
      }
      return [];
    }
    const x = clamp(zone.x, 100);
    const y = clamp(zone.y, 100);
    const width = clamp(zone.width, 100 - x);
    const height = clamp(zone.height, 100 - y);
    if (!width || !height) {
      if (dev) {
        console.warn('PreviewFrame: zero-area zone omitted.');
      }
      return [];
    }
    const style = {
      '--eg-zone-x': `${x}%`,
      '--eg-zone-y': `${y}%`,
      '--eg-zone-w': `${width}%`,
      '--eg-zone-h': `${height}%`
    } as CSSProperties;
    return [{ id: zone.id, label: zone.label, style, className: cn(zoneVariants({ tone: zone.tone })) }];
  });
  return {
    rootProps: {
      ...rest,
      'aria-labelledby':
        rest['aria-labelledby'] ??
        (rest['aria-label'] ? undefined : figureCaption !== undefined ? captionId : undefined),
      className: cn(rootVariants(), className)
    },
    captionId,
    ratio: validRatio ? ratio : fallbackRatio,
    safeArea,
    figureCaption,
    actions,
    footer,
    children,
    guides,
    captionClass: cn(captionVariants()),
    actionsClass: cn(actionsVariants()),
    canvasClass: cn(surfaceVariants({ tone: 'well', padding: 'none', radius: 'lg' }), canvasVariants()),
    innerClass: cn(canvasInnerVariants()),
    safeClass: cn(safeAreaVariants()),
    labelClass: cn(labelVariants()),
    footerClass: cn(footerVariants())
  };
}
