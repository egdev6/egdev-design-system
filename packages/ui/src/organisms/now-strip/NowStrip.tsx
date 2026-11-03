import type { FC } from 'react';
import { StatusDot } from '../../atoms/status-dot';
import type { NowStripProps } from './types';
import { useNowStrip } from './useNowStrip';

/** Passive group of consumer-authored compact current-activity cards. */
export const NowStrip: FC<NowStripProps> = (props) => {
  const strip = useNowStrip(props);
  return strip.valid ? (
    <div {...strip.rootProps}>
      <p {...strip.labelProps}>
        <StatusDot state='live' pulse={false} />
        {strip.label}
      </p>
      <div className={strip.gridClassName}>{strip.children}</div>
    </div>
  ) : null;
};
