import * as ToolbarPrimitive from '@radix-ui/react-toolbar';
import type { FC } from 'react';
import { Surface } from '../../primitives/surface';
import type { GaugeDockItemProps, GaugeDockProps, GaugeDockSeparatorProps } from './types';
import { useGaugeDock, useGaugeDockItem, useGaugeDockSeparator } from './useGaugeDock';

/** Named Material toolbar pairing independent passive readings with separate detail actions. */
export const GaugeDock: FC<GaugeDockProps> = (props) => {
  const { rootProps, orientation, dir, children, empty } = useGaugeDock(props);
  return empty ? null : (
    <ToolbarPrimitive.Root {...rootProps} orientation={orientation} dir={dir} loop={false} asChild={true}>
      <Surface tone='overlay' padding='sm' radius='full'>
        {children}
      </Surface>
    </ToolbarPrimitive.Root>
  );
};

/** The meter remains a sibling; only the supplied native button enters Radix roving focus. */
export const GaugeDockItem: FC<GaugeDockItemProps> = (props) => {
  const { itemProps, gauge, action, disabled } = useGaugeDockItem(props);
  return (
    <div {...itemProps}>
      {gauge}
      <ToolbarPrimitive.Button asChild={true} disabled={disabled}>
        {action}
      </ToolbarPrimitive.Button>
    </div>
  );
};

/** Decorative, hidden separator with orientation supplied by Radix Toolbar. */
export const GaugeDockSeparator: FC<GaugeDockSeparatorProps> = (props) => {
  const separatorProps = useGaugeDockSeparator(props);
  return <ToolbarPrimitive.Separator {...separatorProps} decorative={true} />;
};
