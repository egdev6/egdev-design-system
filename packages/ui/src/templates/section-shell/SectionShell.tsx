import type { FC } from 'react';
import type { SectionShellProps } from './types';
import { useSectionShell } from './useSectionShell';

/** Passive named section frame for host-supplied content. */
export const SectionShell: FC<SectionShellProps> = (props) => {
  const s = useSectionShell(props);
  return <section {...s.rootProps}>{s.wrap ? <div className={s.wrapClass}>{s.children}</div> : s.children}</section>;
};
