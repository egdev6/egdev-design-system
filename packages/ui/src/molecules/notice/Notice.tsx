import type { FC } from 'react';
import { Icon } from '../../atoms/icon';
import type { NoticeProps } from './types';
import { useNotice } from './useNotice';

/** Persistent view-level message whose root is its sole live-region owner. */
export const Notice: FC<NoticeProps> = (props) => {
  const {
    rootProps,
    summary,
    children,
    icon,
    iconName,
    iconSize,
    actions,
    showActions,
    iconClassName,
    textClassName,
    actionsClassName
  } = useNotice(props);
  return (
    <div {...rootProps}>
      <span className={iconClassName} aria-hidden='true'>
        {icon ?? <Icon name={iconName} size={iconSize} />}
      </span>
      <span className={textClassName}>
        {summary && <strong>{summary}</strong>}
        {summary && children != null && ' '}
        {children}
      </span>
      {showActions && <span className={actionsClassName}>{actions}</span>}
    </div>
  );
};
