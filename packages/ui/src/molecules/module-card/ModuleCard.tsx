import type { FC } from 'react';
import { Badge } from '../../atoms/badge';
import { Icon } from '../../atoms/icon';
import type { ModuleCardProps } from './types';
import { useModuleCard } from './useModuleCard';

/** Passive named module summary with independent consumer-owned controls. */
export const ModuleCard: FC<ModuleCardProps> = (props) => {
  const {
    valid,
    rootProps,
    headingElement: Heading,
    headingProps,
    title,
    headProps,
    iconProps,
    bodyProps,
    actionsProps,
    footProps,
    badgeProps,
    statusIconProps,
    icon,
    children,
    actions,
    footer,
    showIcon,
    showActions,
    showFooter
  } = useModuleCard(props);
  return valid ? (
    <article {...rootProps}>
      <div {...headProps}>
        {showIcon && <span {...iconProps}>{icon}</span>}
        <Heading {...headingProps}>{title}</Heading>
        <Badge {...badgeProps} icon={<Icon {...statusIconProps} />} />
      </div>
      <div {...bodyProps}>{children}</div>
      {showActions && <div {...actionsProps}>{actions}</div>}
      {showFooter && <div {...footProps}>{footer}</div>}
    </article>
  ) : null;
};
