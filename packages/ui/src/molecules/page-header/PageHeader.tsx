import type { FC } from 'react';
import { Stack } from '../../primitives/stack';
import type { PageHeaderProps } from './types';
import { usePageHeader } from './usePageHeader';

/** A compact native heading with optional context and consumer-owned independent actions. */
export const PageHeader: FC<PageHeaderProps> = (props) => {
  const header = usePageHeader(props);
  const Heading = header.element;
  const text = (
    <Stack gap={2} className={header.textClassName}>
      {header.eyebrow !== undefined && <p className={header.eyebrowClassName}>{header.eyebrow}</p>}
      <Heading className={header.headingClassName}>{header.title}</Heading>
      {header.lede !== undefined && <p className={header.ledeClassName}>{header.lede}</p>}
    </Stack>
  );
  return header.valid ? (
    <header {...header.rootProps}>
      {header.leadingAction != null ? (
        <div className={header.startClassName}>
          <div className={header.leadingClassName}>{header.leadingAction}</div>
          {text}
        </div>
      ) : (
        text
      )}
      {header.actions != null && <div className={header.actionsClassName}>{header.actions}</div>}
    </header>
  ) : null;
};
