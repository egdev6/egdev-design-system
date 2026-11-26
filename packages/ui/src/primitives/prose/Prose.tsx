import type { FC } from 'react';
import type { ProseProps } from './types';
import { useProse } from './useProse';

export const Prose: FC<ProseProps> = (props) => {
  const { children, rootProps } = useProse(props);
  return <div {...rootProps}>{children}</div>;
};

Prose.displayName = 'Prose';
