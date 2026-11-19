import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { FC } from 'react';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import type { TabsProps } from './types';
import { type TabsScrollButton, useTabs } from './useTabs';

/** Pointer-only page scroller; duplicates arrow keys and swipe, so it stays out of the tab order and AT tree. */
const ScrollButton: FC<{ button: TabsScrollButton }> = ({ button }) => (
  <IconButton
    label={button.label}
    icon={<Icon name='chevron-down' className={button.iconClassName} />}
    variant='ghost'
    size='sm'
    aria-hidden='true'
    tabIndex={-1}
    data-state={button.state}
    className={button.className}
    onClick={button.onClick}
    onPointerEnter={button.onPointerEnter}
    onPointerLeave={button.onPointerLeave}
  />
);

/** Data-driven horizontal sibling views with Radix-owned selection, focus and panel relationships. */
export const Tabs: FC<TabsProps> = (props) => {
  const tabs = useTabs(props);
  const list = (
    <TabsPrimitive.List {...tabs.listProps} ref={tabs.listRef}>
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
  );
  return (
    <TabsPrimitive.Root {...tabs.rootProps}>
      {tabs.scrollable ? (
        <div className={tabs.scrollAreaClassName}>
          {list}
          <ScrollButton button={tabs.scrollButtons.start} />
          <ScrollButton button={tabs.scrollButtons.end} />
        </div>
      ) : (
        list
      )}
      {tabs.items.map((item) => (
        <TabsPrimitive.Content key={item.value} value={item.value} className={tabs.panelClassName}>
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
};
