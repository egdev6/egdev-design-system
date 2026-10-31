import { type CSSProperties, useId } from 'react';
import { gaugeConditionIconPaths, normalizeGaugeMeasurement } from '../../atoms/gauge/gauge-model';
import { gaugeArcVariants, gaugeCueVariants, gaugeIconVariants } from '../../atoms/gauge/types';
import { cn } from '../../lib/cn';
import {
  type GaugeGroupProps,
  type GaugeGroupRing,
  groupCenterVariants,
  groupFrameVariants,
  groupListVariants,
  groupPositionVariants,
  groupRootVariants,
  groupRowVariants,
  groupSlotVariants,
  groupValueVariants
} from './types';

function validateText(value: unknown, name: string, required: boolean): void {
  if (value === undefined && !required) {
    return;
  }
  if (typeof value !== 'string' || !value.trim()) {
    throw new TypeError(`GaugeGroup: ${name} must be a non-empty string`);
  }
}

function validate(label: string, items: GaugeGroupProps['items'], size: GaugeGroupProps['size']): void {
  validateText(label, 'label', true);
  if (!Array.isArray(items) || (items.length !== 2 && items.length !== 3)) {
    throw new TypeError('GaugeGroup: items must contain exactly two or three readings');
  }
  if (size !== undefined && size !== 'sm' && size !== 'md' && size !== 'lg') {
    throw new TypeError('GaugeGroup: size must be sm, md or lg');
  }
  Array.from(items).forEach((item: GaugeGroupRing, index: number) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new TypeError(`GaugeGroup: items[${index}] must be an object`);
    }
    validateText(item.label, `items[${index}].label`, true);
    if (typeof item.value !== 'number') {
      throw new TypeError(`GaugeGroup: items[${index}].value must be a number`);
    }
    if (item.state !== undefined && !['normal', 'warning', 'critical', 'muted'].includes(item.state)) {
      throw new TypeError(`GaugeGroup: items[${index}].state is invalid`);
    }
    validateText(item.valueText, `items[${index}].valueText`, false);
    validateText(item.unavailableText, `items[${index}].unavailableText`, false);
    validateText(item.stateText, `items[${index}].stateText`, item.state !== undefined && item.state !== 'normal');
  });
}

export function useGaugeGroup({
  label,
  items,
  size = 'md',
  center,
  className,
  'aria-describedby': describedBy,
  ...rest
}: GaugeGroupProps) {
  const id = useId();
  validate(label, items, size);
  const rows = items.map((item, index) => {
    const model = normalizeGaugeMeasurement(item);
    const state = item.state ?? 'normal';
    const cueId = `${id}-${index}`;
    return {
      ...item,
      ...model,
      state,
      cueId,
      position: index === 0 ? 'Outer' : index === items.length - 1 ? 'Inner' : 'Middle',
      slotClassName: cn(groupSlotVariants({ index: index as 0 | 1 | 2 })),
      rowClassName: cn(groupRowVariants()),
      arcClassName: cn(gaugeArcVariants()),
      arcStyle: { '--eg-gauge-value': model.normalized } as CSSProperties,
      iconPath: gaugeConditionIconPaths[state]
    };
  });
  return {
    rootProps: {
      ...rest,
      role: 'group' as const,
      'aria-label': label,
      'aria-describedby': [...new Set((describedBy ?? '').split(/\s+/).filter(Boolean))].join(' ') || undefined,
      'aria-labelledby': undefined,
      'aria-hidden': undefined,
      'aria-live': undefined,
      'aria-disabled': undefined,
      'aria-valuemin': undefined,
      'aria-valuemax': undefined,
      'aria-valuenow': undefined,
      'aria-valuetext': undefined,
      tabIndex: undefined,
      accessKey: undefined,
      contentEditable: undefined,
      dangerouslySetInnerHTML: undefined,
      onClick: undefined,
      onChange: undefined,
      defaultValue: undefined,
      style: undefined,
      className: cn(groupRootVariants(), className)
    },
    frameClassName: cn(groupFrameVariants({ size })),
    centerClassName: cn(groupCenterVariants({ count: items.length as 2 | 3 })),
    listClassName: cn(groupListVariants()),
    positionClassName: cn(groupPositionVariants()),
    valueClassName: cn(groupValueVariants()),
    cueClassName: cn(gaugeCueVariants()),
    iconClassName: cn(gaugeIconVariants()),
    showCenter: rows.some((row) => row.available) && center != null && typeof center !== 'boolean',
    center,
    rows
  };
}
