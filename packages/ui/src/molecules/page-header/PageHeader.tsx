import type { FC } from 'react';
import { Stack } from '../../primitives/stack';
import type { PageHeaderProps } from './types';
import { usePageHeader } from './usePageHeader';

/** A compact native heading with optional context and consumer-owned independent actions. */
export const PageHeader: FC<PageHeaderProps> = (props) => {
  const header = usePageHeader(props);
  const Heading = header.element;
  return header.valid ? (
    <header {...header.rootProps}>
      <Stack gap={2} className={header.textClassName}>
        {header.eyebrow !== undefined && <p className={header.eyebrowClassName}>{header.eyebrow}</p>}
        <Heading className={header.headingClassName}>{header.title}</Heading>
      </Stack>
      {header.actions != null && <div className={header.actionsClassName}>{header.actions}</div>}
    </header>
  ) : null;
};
