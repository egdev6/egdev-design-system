import {
  Children,
  type FC,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useEffect,
  useState
} from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import {
  type TopBarPartProps,
  type TopBarProps,
  topBarBrandVariants,
  topBarCompactVariants,
  topBarContainerVariants,
  topBarEndVariants,
  topBarFullVariants,
  topBarItemVariants,
  topBarLinkVariants,
  topBarListVariants,
  topBarNavVariants,
  topBarRowVariants,
  topBarUserVariants,
  topBarVariants
} from './types';

type Parts = {
  brand: FC<TopBarPartProps>;
  full: FC<TopBarPartProps>;
  compact: FC<TopBarPartProps>;
  end: FC<TopBarPartProps>;
  user: FC<TopBarPartProps>;
  mobile: FC<TopBarPartProps>;
};
type PartName = keyof Parts;

/** Partition only known direct parts, traversing fragments without inspecting their contents. */
export function useTopBar(
  {
    children,
    label,
    items,
    onNavigate,
    className,
    initialBackground = 'transparent',
    contentWidth = 'content',
    'data-state': hostState,
    ...native
  }: TopBarProps,
  parts: Parts
) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (hostState !== undefined) {
      return;
    }
    let frame: number | undefined;
    const sample = () => setScrolled(window.scrollY > 0);
    const onScroll = () => {
      if (frame === undefined) {
        frame = window.requestAnimationFrame(() => {
          frame = undefined;
          sample();
        });
      }
    };
    sample();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== undefined) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [hostState]);

  const slots: Partial<Record<PartName, ReactElement>> = {};
  const dev = typeof process === 'undefined' || process.env.NODE_ENV !== 'production';
  const visit = (nodes: ReactNode): void => {
    Children.forEach(nodes, (child) => {
      if (child == null || typeof child === 'boolean') {
        return;
      }
      if (isValidElement(child) && child.type === Fragment) {
        visit((child.props as { children?: ReactNode }).children);
        return;
      }
      const name = isValidElement(child)
        ? (Object.keys(parts) as PartName[]).find((key) => child.type === parts[key])
        : undefined;
      if (!name || !isValidElement(child)) {
        if (dev) {
          console.warn('TopBar children must be direct TopBar parts.');
        }
        return;
      }
      if (slots[name]) {
        if (dev) {
          console.warn(`TopBar received a duplicate ${name} part.`);
        }
        return;
      }
      slots[name] = child;
    });
  };
  visit(children);
  if (!slots.brand && dev) {
    console.warn('TopBar requires a brand part.');
  }
  const {
    role: _role,
    dangerouslySetInnerHTML: _html,
    ...rest
  } = native as typeof native & { role?: unknown; dangerouslySetInnerHTML?: unknown };
  return {
    rootProps: {
      ...rest,
      'data-state': hostState ?? (scrolled ? 'glass' : undefined),
      className: cn(
        initialBackground === 'solid' &&
          surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }),
        topBarVariants({ initialBackground }),
        className
      )
    },
    containerClassName: cn(topBarContainerVariants()),
    rowClassName: cn(topBarRowVariants({ contentWidth })),
    navProps: { 'aria-label': label, className: cn(topBarNavVariants()) },
    listClassName: cn(topBarListVariants()),
    itemClassName: cn(topBarItemVariants()),
    slots,
    items: items.map((item) => ({
      item,
      props: {
        href: item.href,
        'aria-current': item['aria-current'],
        className: cn(topBarLinkVariants()),
        onClick: onNavigate ? (event: React.MouseEvent<HTMLAnchorElement>) => onNavigate(item, event) : undefined
      }
    }))
  };
}

/** Compose the static per-part utility recipe. */
export function useTopBarPart(kind: PartName) {
  const variants = {
    brand: topBarBrandVariants,
    full: topBarFullVariants,
    compact: topBarCompactVariants,
    end: topBarEndVariants,
    user: topBarUserVariants,
    mobile: topBarCompactVariants
  };
  return { className: cn(variants[kind]()) };
}
