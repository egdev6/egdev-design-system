import { Tabs as TabsPrimitive } from 'radix-ui';
import type { FC } from 'react';
import type { TabsProps } from './types';
import { tabTriggerClassName, useTabs } from './useTabs';

export const Tabs: FC<TabsProps> = (props) => {
  const { label, items, rootProps, listClassName, hasPanels } = useTabs(props);

  return (
    <TabsPrimitive.Root {...rootProps}>
      <TabsPrimitive.List className={listClassName} aria-label={label}>
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={tabTriggerClassName(item)}
          >
            {item.label}
            {item.count !== undefined && ' '}
            {item.count !== undefined && <span className='eg-tabs__count'>{item.count}</span>}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {hasPanels &&
        items.map((item) => (
          <TabsPrimitive.Content key={item.value} value={item.value}>
            {item.content}
          </TabsPrimitive.Content>
        ))}
    </TabsPrimitive.Root>
  );
};
