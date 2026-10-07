import { cn } from '@/lib/cn';
import { type TabItem, type TabsProps, tabsListVariants } from './types';

type UseTabsReturn = {
  label: string;
  items: TabItem[];
  rootProps: { defaultValue?: string; value?: string; onValueChange?: (value: string) => void; className?: string };
  listClassName: string;
  hasPanels: boolean;
};

export const useTabs = ({
  label,
  items,
  defaultValue,
  value,
  onValueChange,
  size = 'md',
  variant = 'underline',
  className
}: TabsProps): UseTabsReturn => ({
  label,
  items,
  rootProps: {
    defaultValue: value === undefined ? (defaultValue ?? items[0]?.value) : undefined,
    value,
    onValueChange,
    className
  },
  listClassName: tabsListVariants({ size, variant }),
  hasPanels: items.some((item) => item.content !== undefined)
});

export const tabTriggerClassName = (item: TabItem): string =>
  cn('eg-tabs__item', item.danger && 'eg-tabs__item--danger');
