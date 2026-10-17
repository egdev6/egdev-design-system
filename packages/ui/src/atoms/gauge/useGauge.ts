import { type ComponentPropsWithoutRef, type CSSProperties, type ReactNode, useId } from 'react';
import { cn } from '@/lib/cn';
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
const iconPaths: Record<GaugeState, string> = {
  normal: 'M4 12l5 5L20 6',
  warning: 'M12 3L2 21h20L12 3Zm0 5v6m0 3v1',
  critical: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5v7m0 3v1',
  muted: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM7 12h10'
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
  const available = Number.isFinite(value);
  const normalized = available ? Math.min(100, Math.max(0, value)) : undefined;
  const customSize = typeof size === 'number' && Number.isFinite(size) && size > 0;
  const preset = typeof size === 'number' ? 'md' : size;
  const showCue = available && Boolean(stateText);
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
      'aria-valuetext': available ? (valueText ?? `${normalized} / 100`) : undefined,
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
    iconPath: iconPaths[state],
    label,
    unavailableText
  };
};
