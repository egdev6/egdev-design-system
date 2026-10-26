import type { FC } from 'react';
import type { StatProps } from './types';
import { useStat } from './useStat';

/** One live figure with its visible label and optional context line, named as a group. */
export const Stat: FC<StatProps> = (props) => {
  const stat = useStat(props);
  return (
    <div {...stat.rootProps}>
      <span {...stat.labelProps}>{stat.labelText}</span>
      <span {...stat.valueProps}>
        {stat.value.unavailable ? (
          <>
            <span aria-hidden='true'>—</span>
            <span {...stat.unavailableTextProps}>{stat.value.text}</span>
          </>
        ) : (
          stat.value.text
        )}
      </span>
      {stat.delta !== undefined && <span {...stat.deltaProps}>{stat.delta}</span>}
    </div>
  );
};
