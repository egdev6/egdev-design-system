import {
  type ComponentPropsWithoutRef,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { cn } from '@/lib/cn';
import {
  type CarouselItem,
  type CarouselMessages,
  type CarouselProps,
  carouselArrowVariants,
  carouselControlsVariants,
  carouselCounterVariants,
  carouselCurrentVariants,
  carouselHeaderVariants,
  carouselLabelVariants,
  carouselProgressVariants,
  carouselSlideVariants,
  carouselTrackVariants,
  carouselVariants,
  defaultCarouselMessages
} from './types';

type Drag = { id: number; startX: number; startY: number; lastX: number; captured: boolean; track: HTMLDivElement };
type Request = { value: string; focus: boolean };
type RootProps = ComponentPropsWithoutRef<'div'> & { 'data-state': 'idle' | 'dragging' | 'empty' };
type Slide = {
  item: CarouselItem;
  props: ComponentPropsWithoutRef<'div'> & { ref: (node: HTMLDivElement | null) => void };
};
type CarouselResult = {
  rootProps: RootProps & { ref: React.RefObject<HTMLDivElement | null> };
  trackProps: ComponentPropsWithoutRef<'div'> & { ref: React.RefObject<HTMLDivElement | null> };
  labelProps: { id: string; className: string };
  label: string;
  headerClassName: string;
  controlsClassName: string;
  counterClassName: string;
  currentClassName: string;
  progressClassName: string;
  previousIconClassName: string;
  nextIconClassName: string;
  counter: string;
  currentText: string;
  totalText: string;
  progress: number;
  previousProps: Omit<ComponentPropsWithoutRef<'button'>, 'children'>;
  nextProps: Omit<ComponentPropsWithoutRef<'button'>, 'children'>;
  messages: CarouselMessages;
  instructionId: string;
  status: string;
  slides: Slide[];
};

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function localize(messages: CarouselProps['messages']): CarouselMessages {
  const text = (key: Exclude<keyof CarouselMessages, 'position'>) => {
    const candidate = messages?.[key];
    return typeof candidate === 'string' && candidate.trim() ? candidate : defaultCarouselMessages[key];
  };
  return {
    previousSlide: text('previousSlide'),
    nextSlide: text('nextSlide'),
    carousel: text('carousel'),
    slide: text('slide'),
    instructions: text('instructions'),
    empty: text('empty'),
    position: (current, total, label) => {
      try {
        const candidate = messages?.position?.(current, total, label);
        if (typeof candidate === 'string' && candidate.trim()) {
          return candidate;
        }
      } catch {
        // Invalid consumer formatters must not destroy the collection's accessible names.
      }
      return defaultCarouselMessages.position(current, total, label);
    }
  };
}

/** Coordinate accepted identities, bounded input, physical scroll geometry and focus repair. */
/** Realm-safe check: avoids the global HTMLButtonElement constructor, absent in some consumer realms. */
const isDisabledButton = (node: unknown): boolean =>
  !!node && (node as Element).tagName === 'BUTTON' && (node as HTMLButtonElement).disabled;

export function useCarousel({
  items,
  label,
  value,
  defaultValue,
  onValueChange,
  messages: overrides,
  className,
  onKeyDown,
  onFocusCapture,
  onBlurCapture,
  ...native
}: CarouselProps): CarouselResult {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLDivElement>());
  const focused = useRef<HTMLElement | null>(null);
  const previousSlide = useRef<HTMLDivElement | undefined>(undefined);
  const pending = useRef<Request | null>(null);
  const drag = useRef<Drag | null>(null);
  const scrolling = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [internal, setInternal] = useState(defaultValue);
  const [dragging, setDragging] = useState(false);
  const [rtl, setRtl] = useState(native.dir === 'rtl');
  const [status, setStatus] = useState('');
  const [rootFocusable, setRootFocusable] = useState(false);
  const labelId = useId();
  const trackId = useId();
  const instructionId = useId();
  const unique = new Set(items.map((item) => item.value));
  const valid = unique.size === items.length && items.every((item) => item.value.trim() && item.label.trim());
  const collection = valid ? items : [];
  const identity = value === undefined ? internal : value;
  const index = Math.max(
    0,
    collection.findIndex((item) => item.value === identity)
  );
  const accepted = collection[index]?.value;
  const messages = localize(overrides);
  const lastAccepted = useRef(accepted);
  const currentNode = () => (accepted === undefined ? undefined : nodes.current.get(accepted));
  const isRTL = () => {
    const element = root.current;
    if (!element) {
      return rtl;
    }
    const computed = getComputedStyle(element).direction;
    return computed ? computed === 'rtl' : element.closest('[dir]')?.getAttribute('dir') === 'rtl';
  };
  const clearSettlement = () => {
    clearTimeout(timer.current);
    timer.current = undefined;
  };
  const scroll = (left: number) => {
    track.current?.scrollBy?.({ left, behavior: 'instant' });
  };
  const align = () => {
    clearSettlement();
    scrolling.current = false;
    const node = currentNode();
    const viewport = track.current;
    if (!node || !viewport) {
      return;
    }
    const a = node.getBoundingClientRect();
    const b = viewport.getBoundingClientRect();
    const distance = (a.left + a.right - b.left - b.right) / 2;
    if (distance) {
      scroll(distance);
    }
  };
  const request = (next: number, focus: boolean) => {
    const item = collection[next];
    if (!item || item.value === accepted) {
      return;
    }
    pending.current = { value: item.value, focus };
    if (value === undefined) {
      setInternal(item.value);
    }
    onValueChange?.(item.value);
  };
  const settle = () => {
    clearSettlement();
    if (drag.current?.captured || !scrolling.current || !track.current || !collection.length) {
      return;
    }
    scrolling.current = false;
    const viewport = track.current.getBoundingClientRect();
    if (viewport.width <= 0) {
      return;
    }
    const center = (viewport.left + viewport.right) / 2;
    let nearest = index;
    let distance = Infinity;
    collection.forEach((item, itemIndex) => {
      const rect = nodes.current.get(item.value)?.getBoundingClientRect();
      if (!rect) {
        return;
      }
      const candidate = Math.abs((rect.left + rect.right) / 2 - center);
      if (candidate < distance) {
        distance = candidate;
        nearest = itemIndex;
      }
    });
    request(nearest, !!currentNode()?.contains(document.activeElement));
    // A controlled request may be rejected; physical scrolling never commits its own identity.
    if (value !== undefined || nearest === index) {
      align();
    }
  };
  const scheduleSettlement = () => {
    clearSettlement();
    scrolling.current = true;
    if (!drag.current?.captured) {
      timer.current = setTimeout(settle, 120);
    }
  };
  const release = () => {
    const gesture = drag.current;
    drag.current = null;
    if (gesture?.captured && gesture.track.hasPointerCapture?.(gesture.id)) {
      gesture.track.releasePointerCapture(gesture.id);
    }
  };
  const endDrag = (event: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const gesture = drag.current;
    if (!gesture || event.pointerId !== gesture.id) {
      return;
    }
    const captured = gesture.captured;
    release();
    if (captured) {
      setDragging(false);
      if (cancelled) {
        align();
      } else {
        scrolling.current = true;
        settle();
      }
    }
  };

  useEffect(() => {
    if (!valid && process.env.NODE_ENV !== 'production') {
      console.warn(
        'Carousel: items require non-empty unique values and non-empty labels; rendering an empty collection.'
      );
    }
  }, [valid]);

  useClientLayoutEffect(() => {
    const direction = isRTL();
    if (direction !== rtl) {
      setRtl(direction);
    }
    const node = currentNode();
    const oldSlide = previousSlide.current;
    const active = document.activeElement;
    const remembered = focused.current;
    const inside = !!root.current?.contains(active);
    const strandedBodyFocus =
      remembered &&
      active === document.body &&
      (!remembered.isConnected || (isDisabledButton(remembered) && root.current?.contains(remembered)));
    const stranded =
      (inside && ((oldSlide !== node && !!oldSlide?.contains(active)) || isDisabledButton(active))) ||
      strandedBodyFocus;
    const committed = accepted !== lastAccepted.current;
    const userRequest = committed && pending.current?.value === accepted ? pending.current : null;
    const moveFocus = !!stranded || (!!userRequest?.focus && !!oldSlide?.contains(active));
    if (moveFocus) {
      if (node) {
        node.focus({ preventScroll: true });
      } else {
        const button = root.current?.querySelector<HTMLButtonElement>('button:not(:disabled)');
        if (button) {
          button.focus({ preventScroll: true });
        } else if (root.current) {
          root.current.tabIndex = -1;
          setRootFocusable(true);
          root.current.focus({ preventScroll: true });
        }
      }
    }
    if (committed) {
      setStatus(
        userRequest && !moveFocus && !node?.contains(active) && collection[index]
          ? messages.position(index + 1, collection.length, collection[index].label)
          : ''
      );
      pending.current = null;
    }
    if (value === undefined && internal !== accepted) {
      setInternal(accepted);
    }
    lastAccepted.current = accepted;
    previousSlide.current = node;
    if (!drag.current?.captured) {
      align();
    }
  });

  // Keep native listeners current without stale controlled values or collection geometry.
  useEffect(() => {
    const viewport = track.current;
    const onResize = () => {
      if (!drag.current?.captured) {
        align();
      }
    };
    viewport?.addEventListener('scrollend', settle);
    window.addEventListener('resize', onResize);
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(onResize);
    if (viewport) {
      observer?.observe(viewport);
    }
    for (const node of nodes.current.values()) {
      observer?.observe(node);
    }
    return () => {
      viewport?.removeEventListener('scrollend', settle);
      window.removeEventListener('resize', onResize);
      observer?.disconnect();
      clearSettlement();
    };
  });
  useEffect(
    () => () => {
      release();
    },
    []
  );

  const {
    children: _children,
    dangerouslySetInnerHTML: _html,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-labelledby': _labelledBy,
    'aria-roledescription': _roleDescription,
    tabIndex: _tabIndex,
    ...rest
  } = native as typeof native & {
    children?: unknown;
    role?: unknown;
    'aria-label'?: unknown;
    'aria-labelledby'?: unknown;
    'aria-roledescription'?: unknown;
    tabIndex?: unknown;
  };
  const describedBy = [...new Set(`${native['aria-describedby'] ?? ''} ${instructionId}`.trim().split(/\s+/))].join(
    ' '
  );
  const currentText = String(collection.length ? index + 1 : 0).padStart(2, '0');
  const totalText = String(collection.length).padStart(2, '0');
  return {
    rootProps: {
      ...rest,
      ref: root,
      role: 'group',
      'aria-label': undefined,
      'aria-labelledby': labelId,
      'aria-roledescription': messages.carousel,
      'aria-describedby': describedBy,
      tabIndex: rootFocusable ? -1 : undefined,
      'data-state': collection.length ? (dragging ? 'dragging' : 'idle') : 'empty',
      className: cn(carouselVariants(), className),
      onFocusCapture: (event) => {
        focused.current = event.target as HTMLElement;
        onFocusCapture?.(event);
      },
      onBlurCapture: (event) => {
        const target = event.target as HTMLElement;
        const related = event.relatedTarget as Node | null;
        const disabledBlur = isDisabledButton(target) && (!related || related === document.body);
        const removedBlur = !target.isConnected && !related;
        if (!event.currentTarget.contains(related) && !disabledBlur && !removedBlur) {
          focused.current = null;
          setRootFocusable(false);
        }
        onBlurCapture?.(event);
      },
      onKeyDown: (event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
          return;
        }
        const target = event.target;
        if (![...nodes.current.values()].some((node) => node === target)) {
          return;
        }
        let next: number;
        switch (event.key) {
          case 'Home':
            next = 0;
            break;
          case 'End':
            next = collection.length - 1;
            break;
          case 'ArrowRight':
            next = index + (isRTL() ? -1 : 1);
            break;
          case 'ArrowLeft':
            next = index + (isRTL() ? 1 : -1);
            break;
          default:
            return;
        }
        event.preventDefault();
        request(next, true);
      }
    },
    trackProps: {
      id: trackId,
      ref: track,
      className: cn(carouselTrackVariants()),
      onScroll: scheduleSettlement,
      onPointerDown: (event) => {
        if (
          event.defaultPrevented ||
          event.pointerType !== 'mouse' ||
          event.button !== 0 ||
          event.isPrimary === false
        ) {
          return;
        }
        const target = event.target as Element;
        const selectableText = [...target.childNodes].some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
        );
        if (
          target.closest('a,button,input,select,textarea,[contenteditable="true"],[tabindex]:not([role="group"])') ||
          (selectableText && getComputedStyle(target).userSelect !== 'none') ||
          !window.getSelection()?.isCollapsed
        ) {
          return;
        }
        drag.current = {
          id: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          lastX: event.clientX,
          captured: false,
          track: event.currentTarget
        };
      },
      onPointerMove: (event) => {
        const gesture = drag.current;
        if (!gesture || event.pointerId !== gesture.id) {
          return;
        }
        const dx = event.clientX - gesture.startX;
        if (!gesture.captured) {
          if (Math.abs(event.clientY - gesture.startY) > Math.abs(dx)) {
            release();
            return;
          }
          if (Math.abs(dx) < 4 || !window.getSelection()?.isCollapsed) {
            return;
          }
          gesture.captured = true;
          clearSettlement();
          gesture.track.setPointerCapture?.(gesture.id);
          setDragging(true);
        }
        event.preventDefault();
        scroll(gesture.lastX - event.clientX);
        gesture.lastX = event.clientX;
      },
      onPointerUp: (event) => endDrag(event, false),
      onPointerCancel: (event) => endDrag(event, true),
      onLostPointerCapture: (event) => endDrag(event, true),
      onDragStart: (event) => {
        if (drag.current) {
          event.preventDefault();
        }
      }
    },
    labelProps: { id: labelId, className: cn(carouselLabelVariants()) },
    label,
    headerClassName: cn(carouselHeaderVariants()),
    controlsClassName: cn(carouselControlsVariants()),
    counterClassName: cn(carouselCounterVariants()),
    currentClassName: cn(carouselCurrentVariants()),
    progressClassName: cn(carouselProgressVariants()),
    previousIconClassName: cn(carouselArrowVariants({ reversed: !rtl })),
    nextIconClassName: cn(carouselArrowVariants({ reversed: rtl })),
    counter: `${currentText} / ${totalText}`,
    currentText,
    totalText,
    progress: collection.length ? (100 * (index + 1)) / collection.length : 0,
    previousProps: {
      type: 'button',
      disabled: !collection.length || index === 0,
      'aria-controls': trackId,
      onClick: () => request(index - 1, false)
    },
    nextProps: {
      type: 'button',
      disabled: !collection.length || index === collection.length - 1,
      'aria-controls': trackId,
      onClick: () => request(index + 1, false)
    },
    messages,
    instructionId,
    status,
    slides: collection.map((item, itemIndex) => ({
      item,
      props: {
        ref: (node) => {
          if (node) {
            nodes.current.set(item.value, node);
          } else {
            nodes.current.delete(item.value);
          }
        },
        role: 'group',
        'aria-roledescription': messages.slide,
        'aria-label': messages.position(itemIndex + 1, collection.length, item.label),
        'aria-describedby': instructionId,
        'aria-current': itemIndex === index ? 'true' : undefined,
        tabIndex: itemIndex === index ? 0 : -1,
        className: cn(carouselSlideVariants())
      }
    }))
  };
}
