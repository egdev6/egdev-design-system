import type { FC } from 'react';
import type { GaugeProps } from './types';
import { useGauge } from './useGauge';

/** A passive, bounded circular measurement; center content must be non-interactive. */
export const Gauge: FC<GaugeProps> = (props) => {
  const gauge = useGauge(props);
  return (
    <div {...gauge.rootProps}>
      {gauge.available ? (
        <>
          <div className={gauge.circleClassName} aria-hidden='true'>
            <span className={gauge.arcClassName} data-state={gauge.state} />
            {gauge.showCenter && (
              <span className={gauge.centerClassName} aria-hidden='true'>
                {gauge.center}
              </span>
            )}
          </div>
          {gauge.showCue && (
            <span className={gauge.cueClassName}>
              <svg
                className={gauge.iconClassName}
                aria-hidden='true'
                focusable='false'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d={gauge.iconPath} />
              </svg>
              <span id={gauge.cueId}>{gauge.stateText}</span>
            </span>
          )}
        </>
      ) : (
        <>
          <span>{gauge.label}</span>
          <span>{gauge.unavailableText}</span>
        </>
      )}
    </div>
  );
};
