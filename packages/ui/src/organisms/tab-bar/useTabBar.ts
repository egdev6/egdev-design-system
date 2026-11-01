import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type { TabBarProps } from './types';
import {
  tabBarCountVariants,
  tabBarIconVariants,
  tabBarItemVariants,
  tabBarLabelVariants,
  tabBarLinkVariants,
  tabBarListVariants,
  tabBarVariants
} from './types';

/** Compose the Material root, per-part classes and navigation/count models. */
export function useTabBar(props: TabBarProps) {
  const {
    label,
    items,
    messages,
    onNavigate,
    className,
    children: _children,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    dangerouslySetInnerHTML: _html,
    ...rest
  } = props as TabBarProps & {
    children?: unknown;
    role?: unknown;
    'aria-label'?: unknown;
    'aria-labelledby'?: unknown;
  };
  return {
    rootProps: {
      ...rest,
      'aria-label': label,
      className: cn(
        surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }),
        tabBarVariants(),
        className
      )
    },
    items: items.map((item) => {
      const count =
        item.count !== undefined && Number.isFinite(item.count) && Number.isInteger(item.count) && item.count >= 1
          ? item.count
          : undefined;
      return {
        item,
        count,
        countLabel:
          count === undefined ? undefined : (messages?.pendingCount ?? ((value: number) => `${value} pending`))(count),
        anchorProps: {
          href: item.href,
          'aria-current': item['aria-current'],
          className: cn(tabBarLinkVariants()),
          onClick: onNavigate ? (event: React.MouseEvent<HTMLAnchorElement>) => onNavigate(item, event) : undefined
        }
      };
    }),
    listClassName: cn(tabBarListVariants()),
    itemClassName: cn(tabBarItemVariants()),
    iconClassName: cn(tabBarIconVariants()),
    labelClassName: cn(tabBarLabelVariants()),
    countClassName: cn(tabBarCountVariants())
  };
}
