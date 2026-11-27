import type { FC } from 'react';
import { Icon } from '../../atoms/icon';
import type { EmptyStateProps } from './types';
import { useEmptyState } from './useEmptyState';

/** A passive empty state: a native heading, an optional explanation and pictogram, and one supplied action. */
export const EmptyState: FC<EmptyStateProps> = (props) => {
  const {
    valid,
    rootProps,
    headingElement: Heading,
    title,
    description,
    iconName,
    action,
    iconClassName,
    headingClassName,
    descriptionClassName,
    actionsClassName
  } = useEmptyState(props);
  return valid ? (
    <div {...rootProps}>
      {iconName !== null && (
        <span className={iconClassName} aria-hidden='true'>
          <Icon name={iconName} size='lg' />
        </span>
      )}
      <Heading className={headingClassName}>{title}</Heading>
      {description !== null && <p className={descriptionClassName}>{description}</p>}
      {action !== null && <div className={actionsClassName}>{action}</div>}
    </div>
  ) : null;
};
