import type { FC } from 'react';
import type { ButtonGroupProps } from './types';
import { useButtonGroup } from './useButtonGroup';

/** Groups related actions without taking ownership of their interaction or Material. */
export const ButtonGroup: FC<ButtonGroupProps> = (props) => {
  const { rootProps, children } = useButtonGroup(props);
  return <div {...rootProps}>{children}</div>;
};
