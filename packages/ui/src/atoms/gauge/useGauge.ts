import { type ComponentPropsWithoutRef, type CSSProperties, type ReactNode, useId } from 'react';
import { cn } from '@/lib/cn';
import { gaugeConditionIconPaths, normalizeGaugeMeasurement } from './gauge-model';
import {
  type GaugeProps,
  type GaugeState,
  gaugeArcVariants,
  gaugeCenterVariants,
  gaugeCircleVariants,
  gaugeCueVariants,
  gaugeIconVariants,
  gaugeRootVariants
} from './types';

type GaugeStyle = CSSProperties & { '--eg-gauge-size'?: string; '--eg-gauge-value'?: number };
type UseGaugeReturn = {
  rootProps: ComponentPropsWithoutRef<'div'> & { 'data-state': GaugeState; style: GaugeStyle };
  circleClassName: string;
  arcClassName: string;
  centerClassName: string;
  cueClassName: string;
  iconClassName: string;
  available: boolean;
  showCenter: boolean;
  showCue: boolean;
  center: ReactNode;
  stateText: string | undefined;
  state: GaugeState;
  cueId: string;
  iconPath: string;
  label: string;
  unavailableText: string;
};
export const useGauge = ({
  label,
  value,
  valueText,
  state = 'normal',
  stateText,
  center,
  size = 'md',
  unavailableText = 'Data unavailable',
  className,
  style,
  'aria-describedby': describedBy,
  ...rest
}: GaugeProps): UseGaugeReturn => {
  const cueId = useId();
  const {
    available,
    normalized,
    valueText: resolvedValueText,
    showCue
  } = normalizeGaugeMeasurement({
    value,
    valueText,
    stateText
  });
  const customSize = typeof size === 'number' && Number.isFinite(size) && size > 0;
  const preset = typeof size === 'number' ? 'md' : size;
  const descriptions = [...new Set(`${describedBy ?? ''} ${showCue ? cueId : ''}`.split(/\s+/).filter(Boolean))];
  const geometry: GaugeStyle = {
    ...style,
    '--eg-gauge-size': customSize ? `${size}px` : undefined,
    '--eg-gauge-value': normalized
  };
  return {
    rootProps: {
      ...rest,
      role: available ? 'meter' : undefined,
      'aria-label': available ? label : undefined,
      'aria-valuemin': available ? 0 : undefined,
      'aria-valuemax': available ? 100 : undefined,
      'aria-valuenow': normalized,
      'aria-valuetext': resolvedValueText,
      'aria-describedby': descriptions.join(' ') || undefined,
      'data-state': state,
      'aria-labelledby': undefined,
      'aria-hidden': undefined,
      'aria-live': undefined,
      'aria-disabled': undefined,
      tabIndex: undefined,
      accessKey: undefined,
      contentEditable: undefined,
      dangerouslySetInnerHTML: undefined,
      onClick: undefined,
      onChange: undefined,
      defaultValue: undefined,
      className: cn(gaugeRootVariants(), className),
      style: geometry
    },
    circleClassName: cn(gaugeCircleVariants({ size: customSize ? 'custom' : preset })),
    arcClassName: cn(gaugeArcVariants()),
    centerClassName: cn(gaugeCenterVariants()),
    cueClassName: cn(gaugeCueVariants()),
    iconClassName: cn(gaugeIconVariants()),
    available,
    showCenter: available && center != null && typeof center !== 'boolean',
    showCue,
    center,
    stateText,
    state,
    cueId,
    iconPath: gaugeConditionIconPaths[state],
    label,
    unavailableText
  };
};
