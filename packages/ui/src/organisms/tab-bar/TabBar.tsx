import type { FC } from 'react';
import { Badge } from '../../atoms/badge';
import { Icon } from '../../atoms/icon';
import { VisuallyHidden } from '../../primitives/visually-hidden';
import type { TabBarProps } from './types';
import { useTabBar } from './useTabBar';

/** Named native destination links; the consumer owns routing and placement. */
export const TabBar: FC<TabBarProps> = (props) => {
  const view = useTabBar(props);
  return (
    <nav {...view.rootProps}>
      <ul className={view.listClassName}>
        {view.items.map(({ item, count, countLabel, anchorProps }) => (
          <li key={item.id} className={view.itemClassName}>
            <a {...anchorProps}>
              <Icon name={item.icon} size='md' className={view.iconClassName} />
              <span className={view.labelClassName}>{item.label}</span>
              {count !== undefined && (
                <>
                  <span className={view.countClassName}>
                    <Badge tone='brand' variant='solid' aria-hidden='true'>
                      {count > 99 ? '99+' : count}
                    </Badge>
                  </span>
                  <VisuallyHidden>{`, ${countLabel}`}</VisuallyHidden>
                </>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
