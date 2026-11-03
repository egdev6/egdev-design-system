import { cn, Slot, Slottable } from '@egdev/ui';
import { type CSSProperties, forwardRef, type ReactNode, useCallback } from 'react';
import { type ScrollRevealProps, type ScrollRevealVariant, scrollRevealRootVariants } from './types';
import {
  reservedStateMarkers,
  scrollRevealDelayProperty,
  useScrollReveal,
  warnScrollRevealChildConflicts
} from './useScrollReveal';

type AnyProps = Record<string, unknown>;
type VariantMarkers = { 'data-reveal': string | undefined; 'data-wipe': string | undefined };

function variantMarkers(variant: ScrollRevealVariant): VariantMarkers {
  return {
    'data-reveal': variant === 'reveal' ? '' : undefined,
    'data-wipe': variant === 'wipe' ? '' : undefined
  };
}

function filterReservedProps(props: AnyProps): AnyProps {
  const filtered: AnyProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (!reservedStateMarkers.has(key)) {
      filtered[key] = value;
    }
  }
  return filtered;
}

function filterReservedStyle(style: CSSProperties | undefined): CSSProperties {
  if (!style || !(scrollRevealDelayProperty in style)) {
    return style ?? {};
  }
  const { [scrollRevealDelayProperty]: _reserved, ...rest } = style as CSSProperties & Record<string, unknown>;
  return rest as CSSProperties;
}

function delayStyleFor(delay: number | undefined): CSSProperties {
  if (delay === undefined || !Number.isFinite(delay) || delay < 0) {
    return {};
  }
  return { [scrollRevealDelayProperty]: `${delay}ms` } as CSSProperties;
}

/**
 * Scroll-triggered entrance utility: the default wrapper `div` fades in and rises (`reveal`) or
 * uncovers left to right via clip-path (`wipe`) when it enters the viewport, once. Advanced
 * opt-in `asChild` merges behavior and state markers onto the single native child element under
 * the documented conflict policy. Fail-open and once-only; see the ScrollReveal v0.1 spec.
 */
export const ScrollReveal = forwardRef<HTMLElement, ScrollRevealProps>(function ScrollReveal(
  { variant = 'reveal', asChild = false, delay, className, style, children, ...native },
  forwardedRef
) {
  const { rootRef, state, done } = useScrollReveal(variant);
  // Preserve React ref replacement semantics without detaching unchanged refs on state updates.
  const composedRef = useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node;
      if (typeof forwardedRef === 'function') {
        // React 18 types declare void; React 19 may return a cleanup function.
        const cleanup: unknown = forwardedRef(node);
        if (typeof cleanup === 'function') {
          return () => {
            cleanup();
            rootRef.current = null;
          };
        }
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef, rootRef]
  );
  const rootClassName = cn(scrollRevealRootVariants({ variant }), className);
  const rootStyle = { ...filterReservedStyle(style), ...delayStyleFor(delay) } as CSSProperties;
  const reservedProps = filterReservedProps(native as AnyProps);
  const stateMarkers = {
    ...variantMarkers(variant),
    'data-state': state,
    'data-done': done && variant === 'wipe' ? '' : undefined
  };

  if (asChild) {
    warnScrollRevealChildConflicts(children as ReactNode);
    return (
      <Slot {...reservedProps} ref={composedRef} className={rootClassName} style={rootStyle} {...stateMarkers}>
        <Slottable>{children}</Slottable>
      </Slot>
    );
  }

  return (
    <div {...reservedProps} ref={composedRef} className={rootClassName} style={rootStyle} {...stateMarkers}>
      {children}
    </div>
  );
});
