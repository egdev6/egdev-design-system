import type { FC } from 'react';
import type { GaugeGroupProps } from './types';
import { useGaugeGroup } from './useGaugeGroup';

/** Independent passive measurements with a decorative concentric diagram. */
export const GaugeGroup: FC<GaugeGroupProps> = (props) => {
  const group = useGaugeGroup(props);
  return (
    <div {...group.rootProps}>
      <div className={group.frameClassName} aria-hidden='true'>
        {group.rows.map(
          (row, index) =>
            row.available && (
              <span className={row.slotClassName} key={index}>
                <span className={row.arcClassName} data-state={row.state} style={row.arcStyle} />
              </span>
            )
        )}
        {group.showCenter && <span className={group.centerClassName}>{group.center}</span>}
      </div>
      <ol className={group.listClassName}>
        {group.rows.map((row, index) => (
          <li className={row.rowClassName} data-state={row.state} key={index}>
            <span className={group.positionClassName}>{row.position}</span>
            <span>{row.label}</span>
            {row.available ? (
              <>
                <div
                  role='meter'
                  aria-label={row.label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={row.normalized}
                  aria-valuetext={row.valueText}
                  aria-describedby={row.showCue ? row.cueId : undefined}
                  className={group.valueClassName}
                >
                  <span aria-hidden='true'>{row.valueText}</span>
                </div>
                {row.showCue && (
                  <span className={group.cueClassName}>
                    <svg
                      className={group.iconClassName}
                      aria-hidden='true'
                      focusable='false'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path d={row.iconPath} />
                    </svg>
                    <span id={row.cueId}>{row.stateText}</span>
                  </span>
                )}
              </>
            ) : (
              <span>{row.unavailableText ?? 'Data unavailable'}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};
