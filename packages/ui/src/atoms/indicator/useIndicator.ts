import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { IconName } from '../icon';
import {
  type IndicatorPosition,
  type IndicatorProps,
  type IndicatorSize,
  type IndicatorTone,
  type IndicatorVariant,
  indicatorGlyphVariants,
  indicatorMarkerGeometryVariants,
  indicatorMarkerPaintVariants,
  indicatorPositionVariants,
  indicatorRootVariants
} from './types';

const FORBIDDEN = new Set([
  'dangerouslySetInnerHTML',
  'style',
  'role',
  'tabIndex',
  'contentEditable',
  'autoFocus',
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'aria-live',
  'aria-atomic',
  'aria-relevant',
  'ref',
  'asChild'
]);

type IndicatorResult = {
  rootProps: ComponentPropsWithoutRef<'div'> & {
    'data-variant': IndicatorVariant;
    'data-tone': IndicatorTone;
    'data-position': IndicatorPosition;
    'data-size': IndicatorSize;
  };
  children: ReactNode;
  showMarker: boolean;
  markerProps: { 'aria-hidden': true; className: string };
  countText: string | undefined;
  glyphProps: { name: IconName; className: string } | null;
};

/** Derive passive marker text, protected native forwarding and each part's static recipe. */
export function useIndicator(props: IndicatorProps): IndicatorResult {
  const {
    children,
    variant = 'dot',
    tone = 'danger',
    size = 'sm',
    position = 'top-right',
    count,
    max = 99,
    badgeIcon: _badgeIcon,
    className,
    ...rest
  } = props;
  const passthrough: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (!FORBIDDEN.has(key)) {
      passthrough[key] = value;
    }
  }

  const validCount = typeof count === 'number' && Number.isSafeInteger(count) && count > 0;
  const threshold = typeof max === 'number' && Number.isSafeInteger(max) && max > 0 ? max : 99;
  const countText =
    variant === 'count' && validCount ? (count > threshold ? `${threshold}+` : String(count)) : undefined;

  return {
    rootProps: {
      ...passthrough,
      className: cn(indicatorRootVariants(), className),
      'data-variant': variant,
      'data-tone': tone,
      'data-position': position,
      'data-size': size
    },
    children,
    showMarker: variant !== 'count' || countText !== undefined,
    markerProps: {
      'aria-hidden': true,
      className: cn(
        indicatorMarkerGeometryVariants({ variant, size }),
        indicatorPositionVariants({ position }),
        indicatorMarkerPaintVariants({ variant, tone })
      )
    },
    countText,
    glyphProps:
      props.variant === 'icon' ? { name: props.badgeIcon, className: cn(indicatorGlyphVariants({ size })) } : null
  };
}
