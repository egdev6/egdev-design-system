import type { FC } from 'react';
import { ProgressBar } from '@/atoms/progress-bar';
import type { MeterRowProps } from './types';
import { useMeterRow } from './useMeterRow';

/** Passive labelled task-progress composition with one semantic indicator. */
export const MeterRow: FC<MeterRowProps> = (props) => {
  const {
    rootProps,
    headerProps,
    labelGroupProps,
    keyProps,
    labelProps,
    valueProps,
    helpProps,
    progressProps,
    label,
    readout,
    help
  } = useMeterRow(props);
  return (
    <div {...rootProps}>
      <div {...headerProps}>
        <span {...labelGroupProps}>
          <span {...keyProps} />
          <span {...labelProps}>{label}</span>
        </span>
        <span {...valueProps}>{readout}</span>
      </div>
      <ProgressBar {...progressProps} />
      {help && <p {...helpProps}>{help}</p>}
    </div>
  );
};
