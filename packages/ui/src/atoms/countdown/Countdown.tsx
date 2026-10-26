import { type FC, Fragment } from 'react';
import type { CountdownProps } from './types';
import { useCountdown } from './useCountdown';

/** Passive remaining-time readout to one absolute deadline, named and quiet for assistive technology. */
export const Countdown: FC<CountdownProps> = (props) => {
  const countdown = useCountdown(props);
  return (
    <div {...countdown.rootProps}>
      <p {...countdown.labelProps} />
      {countdown.row ? (
        <div className={countdown.row.className}>
          {countdown.units.map((unit) => (
            <Fragment key={unit.key}>
              <span className={countdown.row?.unitClassName}>
                <span className={countdown.row?.valueClassName}>{unit.value}</span>{' '}
                <span className={countdown.row?.nameClassName}>{unit.name}</span>
              </span>{' '}
            </Fragment>
          ))}
        </div>
      ) : null}
      {countdown.time ? <time {...countdown.time} /> : null}
      {countdown.status ? <p {...countdown.status} /> : null}
    </div>
  );
};
