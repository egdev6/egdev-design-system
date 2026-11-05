import type { FC } from 'react';
import type { WebSectionProps } from './types';
import { useWebSection } from './useWebSection';

/** Neutral, passive section slots; compose inside a host section. */
export const WebSection: FC<WebSectionProps> = (props) => {
  const section = useWebSection(props);
  return (
    <div {...section.rootProps}>
      {section.slots.map((slot, index) => (slot == null ? null : <div key={index}>{slot}</div>))}
    </div>
  );
};
