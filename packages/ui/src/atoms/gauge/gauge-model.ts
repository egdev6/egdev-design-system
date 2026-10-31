import type { GaugeState } from './types';

type GaugeMeasurementModel = {
  available: boolean;
  normalized: number | undefined;
  valueText: string | undefined;
  showCue: boolean;
};

export const normalizeGaugeMeasurement = ({
  value,
  valueText,
  stateText
}: {
  value: number;
  valueText?: string;
  stateText?: string;
}): GaugeMeasurementModel => {
  const available = Number.isFinite(value);
  const normalized = available ? Math.min(100, Math.max(0, value)) : undefined;
  return {
    available,
    normalized,
    valueText: available ? (valueText ?? `${normalized} / 100`) : undefined,
    showCue: available && Boolean(stateText)
  };
};

export const gaugeConditionIconPaths: Readonly<Record<GaugeState, string>> = {
  normal: 'M4 12l5 5L20 6',
  warning: 'M12 3L2 21h20L12 3Zm0 5v6m0 3v1',
  critical: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5v7m0 3v1',
  muted: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM7 12h10'
};
