import type * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type { TabsItem, TabsProps } from './types';
import { tabsCountVariants, tabsListVariants, tabsPanelVariants, tabsTriggerVariants, tabsVariants } from './types';

type ResolvedTabsItem = TabsItem & {
  countClassName: string;
  showCount: boolean;
};

export type UseTabsResult = {
  rootProps: ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;
  listProps: ComponentPropsWithoutRef<typeof TabsPrimitive.List>;
  triggerClassName: string;
  panelClassName: string;
  items: ResolvedTabsItem[];
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
    className,
    ...rest
  } = props;
  return {
    rootProps: {
      ...rest,
      orientation: 'horizontal',
      activationMode: 'automatic',
      value,
      defaultValue: defaultValue ?? items.find((item) => !item.disabled)?.value,
      onValueChange,
      className: cn(tabsVariants(), className)
    },
    listProps: {
      'aria-label': label,
      onFocus:
        variant === 'segmented' && fullWidth
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
        variant === 'segmented' && surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }),
        tabsListVariants({ variant, fullWidth })
      )
    },
    triggerClassName: cn(tabsTriggerVariants({ variant, size, fullWidth, labelWrap })),
    panelClassName: cn(tabsPanelVariants()),
    items: items.map((item) => ({
      ...item,
      showCount: item.count !== undefined,
      countClassName: cn(tabsCountVariants({ tone: item.tone, variant, labelWrap }))
    }))
  };
}
