import { Children, type FC, Fragment, isValidElement, type ReactElement, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import {
  type TopBarPartProps,
  type TopBarProps,
  topBarBrandVariants,
  topBarCompactVariants,
  topBarContainerVariants,
  topBarFullVariants,
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
  user: FC<TopBarPartProps>;
  mobile: FC<TopBarPartProps>;
};
type PartName = keyof Parts;

/** Partition only known direct parts, traversing fragments without inspecting their contents. */
export function useTopBar({ children, label, items, onNavigate, className, ...native }: TopBarProps, parts: Parts) {
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
    rootProps: { ...rest, className: cn(topBarVariants(), className) },
    containerClassName: cn(topBarContainerVariants()),
    rowClassName: cn(topBarRowVariants()),
    navProps: { 'aria-label': label, className: cn(topBarNavVariants()) },
    listClassName: cn(topBarListVariants()),
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
    user: topBarUserVariants,
    mobile: topBarCompactVariants
  };
  return { className: cn(variants[kind]()) };
}
