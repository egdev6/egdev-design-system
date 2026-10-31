import type { FC } from 'react';
import { Icon } from '../icon';
import type { IndicatorProps } from './types';
import { useIndicator } from './useIndicator';

/** Passive corner decoration; children retain their own meaning, identity and interaction. */
export const Indicator: FC<IndicatorProps> = (props) => {
  const { rootProps, children, showMarker, markerProps, countText, glyphProps } = useIndicator(props);
  return (
    <div {...rootProps}>
      {children}
      {showMarker && <span {...markerProps}>{glyphProps ? <Icon {...glyphProps} /> : countText}</span>}
    </div>
  );
};
