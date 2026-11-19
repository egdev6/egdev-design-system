import type * as TabsPrimitive from '@radix-ui/react-tabs';
import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type { TabsItem, TabsProps } from './types';
import {
  tabsCountVariants,
  tabsListVariants,
  tabsPanelVariants,
  tabsScrollAreaVariants,
  tabsScrollButtonVariants,
  tabsScrollIconVariants,
  tabsTriggerVariants,
  tabsVariants
} from './types';

type ResolvedTabsItem = TabsItem & {
  countClassName: string;
  showCount: boolean;
};

type TabsScrollSide = 'start' | 'end';

/** visible: content is hidden on that side; inert: an extreme was reached under the pointer; hidden otherwise. */
export type TabsScrollButtonState = 'visible' | 'inert' | 'hidden';

export type TabsScrollButton = {
  label: string;
  state: TabsScrollButtonState;
  className: string;
  iconClassName: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
};

export type UseTabsResult = {
  rootProps: ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;
  listProps: ComponentPropsWithoutRef<typeof TabsPrimitive.List>;
  /** Underline and full-width segmented/outline lists scroll; only they render the scroll area and buttons. */
  scrollable: boolean;
  listRef: RefObject<HTMLDivElement | null>;
  scrollAreaClassName: string;
  scrollButtons: Record<TabsScrollSide, TabsScrollButton>;
  triggerClassName: string;
  panelClassName: string;
  items: ResolvedTabsItem[];
};

const sides: readonly TabsScrollSide[] = ['start', 'end'];
const scrollLabels: Record<TabsScrollSide, string> = {
  start: 'Scroll tabs to start',
  end: 'Scroll tabs to end'
};

/** Derive initial selection and compose part recipes; Radix retains all interactive state and ARIA. */
export function useTabs(props: TabsProps): UseTabsResult {
  const {
    items,
    label,
    value,
    defaultValue,
    onValueChange,
    variant = 'underline',
    size = 'md',
    fullWidth = false,
    labelWrap = false,
    fill: fillProp,
    className,
    ...rest
  } = props;
  const fill = fillProp === true;
  const framed = variant === 'segmented' || variant === 'outline';
  const scrollable = variant === 'underline' || (framed && fullWidth);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [hidden, setHidden] = useState<Record<TabsScrollSide, boolean>>({ start: false, end: false });
  const [hovered, setHovered] = useState<Record<TabsScrollSide, boolean>>({ start: false, end: false });
  const itemKey = items.map((item) => item.value).join('\u0000');

  // Signed scrollLeft is negative in RTL, so magnitudes give the logical start/end edges in both directions.
  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list) {
      return;
    }
    const max = list.scrollWidth - list.clientWidth;
    const offset = Math.abs(list.scrollLeft);
    const next = { start: max > 1 && offset > 1, end: max > 1 && offset < max - 1 };
    setHidden((current) => (current.start === next.start && current.end === next.end ? current : next));
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!scrollable || !list) {
      return;
    }
    measure();
    list.addEventListener('scroll', measure, { passive: true });
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : undefined;
    if (observer) {
      observer.observe(list);
      for (const tab of list.querySelectorAll('[role="tab"]')) {
        observer.observe(tab);
      }
    }
    return () => {
      list.removeEventListener('scroll', measure);
      observer?.disconnect();
    };
  }, [scrollable, measure, itemKey]);

  const stateOf = (side: TabsScrollSide): TabsScrollButtonState =>
    hidden[side] ? 'visible' : hovered[side] ? 'inert' : 'hidden';

  const scrollButtons = Object.fromEntries(
    sides.map((side) => {
      const button: TabsScrollButton = {
        label: scrollLabels[side],
        state: stateOf(side),
        className: cn(tabsScrollButtonVariants({ side })),
        iconClassName: cn(tabsScrollIconVariants({ side })),
        onClick: (event) => {
          const list = listRef.current;
          if (!list || !hidden[side]) {
            return;
          }
          // Page by the visible width minus both edge zones, each as wide as the button over it.
          const zone = event.currentTarget.getBoundingClientRect().width;
          const rtl = getComputedStyle(list).direction === 'rtl';
          const sign = (side === 'end' ? 1 : -1) * (rtl ? -1 : 1);
          const reduced =
            typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          list.scrollBy({ left: sign * (list.clientWidth - 2 * zone), behavior: reduced ? 'instant' : 'smooth' });
        },
        onPointerEnter: () => setHovered((current) => ({ ...current, [side]: true })),
        onPointerLeave: () => setHovered((current) => ({ ...current, [side]: false }))
      };
      return [side, button];
    })
  ) as Record<TabsScrollSide, TabsScrollButton>;

  return {
    rootProps: {
      ...rest,
      orientation: 'horizontal',
      activationMode: 'automatic',
      value,
      defaultValue: defaultValue ?? items.find((item) => !item.disabled)?.value,
      onValueChange,
      className: cn(tabsVariants({ fill }), className),
      // After the native props: only the component sets the marker, so a consumer data-fill can neither
      // spoof fill mode (and PanelBody's gutter rule) nor suppress it.
      ...(fill ? { 'data-fill': '' } : { 'data-fill': undefined })
    },
    listProps: {
      'aria-label': label,
      // Chrome leaves a partly visible tab under the fade on focus(); reveal it past the scroll padding.
      onFocus: scrollable
        ? (event) => {
            if (
              event.target.getAttribute('role') === 'tab' &&
              event.currentTarget.scrollWidth > event.currentTarget.clientWidth
            ) {
              event.target.scrollIntoView?.({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
            }
          }
        : undefined,
      className: cn(
        framed && surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }),
        tabsListVariants({ variant, fullWidth, fill })
      )
    },
    scrollable,
    listRef,
    scrollAreaClassName: cn(tabsScrollAreaVariants({ fill })),
    scrollButtons,
    triggerClassName: cn(tabsTriggerVariants({ variant, size, fullWidth, labelWrap })),
    panelClassName: cn(tabsPanelVariants({ fill })),
    items: items.map((item) => ({
      ...item,
      showCount: item.count !== undefined,
      countClassName: cn(tabsCountVariants({ tone: item.tone, variant, labelWrap }))
    }))
  };
}
