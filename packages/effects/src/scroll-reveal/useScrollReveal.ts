import type { RefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScrollRevealState, ScrollRevealVariant } from './types';

/** Reserved state markers the consumer cannot override. */
export const reservedStateMarkers = new Set(['data-state', 'data-reveal', 'data-wipe', 'data-done']);

/** Scoped numeric millisecond custom property exception for this utility. */
export const scrollRevealDelayProperty = '--eg-scroll-reveal-delay';

export type ScrollRevealController = {
  rootRef: RefObject<HTMLElement | null>;
  state: ScrollRevealState;
  done: boolean;
};

const isDevelopment = typeof process === 'undefined' || process.env.NODE_ENV !== 'production';

/**
 * Reports composition conflicts the component can enforce: a non-native child element, or a child
 * that already carries one of the utility's own state markers. Violations never throw; the
 * documented undefined-composition rule covers the rest (for example child transform utilities).
 */
export function warnScrollRevealChildConflicts(children: unknown): void {
  if (!isDevelopment) {
    return;
  }
  const element = children as { type?: unknown; props?: Record<string, unknown> } | null;
  if (!element || typeof element !== 'object' || element.type === undefined) {
    return;
  }
  if (typeof element.type !== 'string') {
    console.warn(
      'ScrollReveal: asChild merges state markers onto a single native child element. ' +
        'Component children are not supported and compose with undefined behavior; use the default wrapper instead.'
    );
  }
  if (element.props && typeof element.props === 'object') {
    for (const marker of reservedStateMarkers) {
      if (marker in element.props) {
        console.warn(
          `ScrollReveal: the child already owns "${marker}". The utility writes its own state markers onto the ` +
            'child, so a conflicting child marker composes with undefined behavior; keep those on a wrapper instead.'
        );
        break;
      }
    }
  }
}

function safeMatchMedia(): MediaQueryList | null {
  try {
    return matchMedia('(prefers-reduced-motion: reduce)');
  } catch {
    return null;
  }
}

function parseDurationMs(value: string | undefined): number {
  if (!value) {
    return Number.NaN;
  }
  const trimmed = value.trim();
  if (trimmed.endsWith('ms')) {
    return Number.parseFloat(trimmed);
  }
  return Number.parseFloat(trimmed) * 1000;
}

function listEntry(list: string, index: number): string | undefined {
  return list.split(',')[index]?.trim();
}

function clipPathIndex(propertyList: string): number {
  const index = propertyList
    .split(',')
    .map((property) => property.trim())
    .indexOf('clip-path');
  return index >= 0 ? index : 0;
}

/**
 * Owns all observation, focus, reduced-motion and wipe-cleanup behavior for one ScrollReveal
 * instance. Fail-open: every unavailable or failing capability skips the entrance and keeps the
 * content visible; the element is never stuck hidden. Once-only: after a reveal the element is
 * unobserved and never re-hides, and reveal effects are idempotent under StrictMode.
 */
export function useScrollReveal(variant: ScrollRevealVariant): ScrollRevealController {
  const rootRef = useRef<HTMLElement | null>(null);
  // Server render owns `data-done` for the wipe variant so the initial output carries no clip-path
  // at all (no-JS content is final and unclipped); arming below-fold observation removes it.
  const [done, setDone] = useState(true);
  const [state, setState] = useState<ScrollRevealState>('revealed');
  const revealedRef = useRef(false);
  const animatedRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const detachRef = useRef<(() => void) | null>(null);

  const reveal = useCallback(
    (animated: boolean) => {
      if (revealedRef.current) {
        return;
      }
      revealedRef.current = true;
      if (animated) {
        animatedRef.current = true;
      }
      try {
        const current = rootRef.current;
        if (current) {
          observerRef.current?.unobserve(current);
        }
      } catch {
        // Fail-open: an unavailable unobserve never blocks the guaranteed visible reveal.
      }
      detachRef.current?.();
      setState('revealed');
      if (!animated && variant === 'wipe') {
        // Immediate-reveal path: the element was never hidden (or reveals without any transition),
        // so nothing may animate; treat it as the final unclipped state instead of waiting for a
        // transition that never runs.
        setDone(true);
      }
    },
    [variant]
  );

  useEffect(() => {
    const element = rootRef.current;
    if (!element || revealedRef.current) {
      return;
    }

    // Server render and the first client paint stay fully visible; the hidden state only ever
    // exists on the client after this effect confirms observation and motion support.
    const media = safeMatchMedia();
    if (!media || media.matches) {
      reveal(false);
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      reveal(false);
      return;
    }

    let top: number;
    try {
      top = element.getBoundingClientRect().top;
    } catch {
      reveal(false);
      return;
    }
    // Pre-pass: an element already above ~92% of the viewport height is revealed immediately,
    // without a transition and without observing.
    if (top < window.innerHeight * 0.92) {
      reveal(false);
      return;
    }

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              reveal(true);
              break;
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0 }
      );
      observer.observe(element);
    } catch {
      try {
        observer?.disconnect();
      } catch {
        // Nothing more to release; fail-open below.
      }
      reveal(false);
      return;
    }
    observerRef.current = observer;

    setState('hidden');
    setDone(false);

    const onRevealFocus = () => {
      reveal(false);
    };
    element.addEventListener('focusin', onRevealFocus, true);
    const onPreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        // Plan §6.5: a live change to reduce while hidden takes the immediate-reveal path (rule 4).
        reveal(false);
      }
    };
    media.addEventListener('change', onPreferenceChange);

    const detach = () => {
      detachRef.current = null;
      observerRef.current = null;
      try {
        observer.disconnect();
      } catch {
        // Already dead; listeners below are removed regardless.
      }
      element.removeEventListener('focusin', onRevealFocus, true);
      media.removeEventListener('change', onPreferenceChange);
    };
    detachRef.current = detach;
    return detach;
  }, [reveal]);

  // Wipe terminal state: track the clip-path transition end or cancellation, with a bounded
  // safety timer computed from the element's computed transition timing so the element never
  // remains clipped, even when the transitionend event is missed entirely.
  useEffect(() => {
    if (variant !== 'wipe' || state !== 'revealed' || done || !animatedRef.current) {
      return;
    }
    const element = rootRef.current;
    if (!element) {
      return;
    }
    const finish = () => {
      setDone(true);
    };
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const style = getComputedStyle(element);
      const index = clipPathIndex(style.transitionProperty);
      const duration = parseDurationMs(listEntry(style.transitionDuration, index) ?? style.transitionDuration);
      const delay = parseDurationMs(listEntry(style.transitionDelay, index) ?? style.transitionDelay);
      if (Number.isFinite(duration) && Number.isFinite(delay)) {
        timer = setTimeout(finish, Math.max(0, duration + delay));
      } else {
        finish();
      }
    } catch {
      finish();
    }
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target === element && event.propertyName === 'clip-path') {
        finish();
      }
    };
    const onTransitionCancel = (event: TransitionEvent) => {
      if (event.target === element && event.propertyName === 'clip-path') {
        finish();
      }
    };
    element.addEventListener('transitionend', onTransitionEnd);
    element.addEventListener('transitioncancel', onTransitionCancel);
    return () => {
      if (timer !== undefined) {
        clearTimeout(timer);
      }
      element.removeEventListener('transitionend', onTransitionEnd);
      element.removeEventListener('transitioncancel', onTransitionCancel);
    };
  }, [variant, state, done]);

  return { rootRef, state, done };
}
