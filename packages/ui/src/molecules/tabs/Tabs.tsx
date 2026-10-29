import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { FC } from 'react';
import type { TabsProps } from './types';
import { useTabs } from './useTabs';

/** Data-driven horizontal sibling views with Radix-owned selection, focus and panel relationships. */
export const Tabs: FC<TabsProps> = (props) => {
  const tabs = useTabs(props);
  return (
    <TabsPrimitive.Root {...tabs.rootProps}>
      <TabsPrimitive.List {...tabs.listProps}>
        {tabs.items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={tabs.triggerClassName}
          >
            {item.label}
            {item.showCount && (
              <>
                {' '}
                <span className={item.countClassName}>{item.count}</span>
              </>
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.items.map((item) => (
        <TabsPrimitive.Content key={item.value} value={item.value} className={tabs.panelClassName}>
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
};
