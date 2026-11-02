import type { FC } from 'react';
import { Fragment } from 'react';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { StatusDot } from '../../atoms/status-dot';
import { Tooltip } from '../../atoms/tooltip';
import { VisuallyHidden } from '../../primitives/visually-hidden';
import type { ModuleRailLink, ModuleRailProps } from './types';
import { useModuleRail } from './useModuleRail';

/** Compact navigation with native links and consumer-owned selection. */
export const ModuleRail: FC<ModuleRailProps> = (props) => {
  const rail = useModuleRail(props);
  const list = (items: ModuleRailLink[]) => (
    <ul className={rail.listClass}>
      {items.map((item) => (
        <li key={item.id}>
          <Tooltip content={item.label} side={rail.side}>
            <a
              className={rail.linkClass(item)}
              href={item.href}
              aria-current={item['aria-current']}
              onClick={(event) => rail.onNavigate?.(item, event)}
            >
              <Icon name={item.icon} />
              {item.state && <StatusDot state={item.state} className={rail.dotClass} />}
              <VisuallyHidden>
                {item.label}
                {item.state && `, ${rail.messages?.states?.[item.state] ?? item.state}`}
              </VisuallyHidden>
            </a>
          </Tooltip>
        </li>
      ))}
    </ul>
  );
  return (
    <nav {...rail.rootProps} ref={rail.ref}>
      {rail.product &&
        (rail.product.href ? (
          <a href={rail.product.href} aria-label={rail.product.name}>
            <span aria-hidden='true'>{rail.product.node}</span>
          </a>
        ) : (
          <span>
            <span aria-hidden='true'>{rail.product.node}</span>
            <VisuallyHidden>{rail.product.name}</VisuallyHidden>
          </span>
        ))}
      <div className={rail.bodyClass}>
        {rail.groups.map((group, index) => (
          <Fragment key={group[0]?.id}>
            {index > 0 && <div className={rail.separatorClass} aria-hidden='true' />}
            {list(group)}
          </Fragment>
        ))}
      </div>
      {rail.onAdd && (
        <Tooltip content={rail.messages?.add ?? 'Add module'} side={rail.side}>
          <IconButton
            size='lg'
            label={rail.messages?.add ?? 'Add module'}
            icon={<Icon name='plus' />}
            onClick={rail.onAdd}
          />
        </Tooltip>
      )}
      {rail.endItems.length > 0 && list(rail.endItems)}
    </nav>
  );
};
