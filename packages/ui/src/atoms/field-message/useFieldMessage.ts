import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import type { IconName } from '../icon';
import {
  type FieldMessageProps,
  type FieldMessageTone,
  fieldMessageIconVariants,
  fieldMessageTextVariants,
  fieldMessageVariants
} from './types';

const toneIcons: Record<FieldMessageTone, IconName | undefined> = {
  description: undefined,
  info: 'info',
  warning: 'alert',
  success: 'circle-check',
  error: 'circle-alert'
};

export type UseFieldMessageResult = {
  visible: boolean;
  children: string;
  icon: IconName | undefined;
  rootProps: ComponentPropsWithoutRef<'p'>;
  iconProps: { className: string };
  textProps: { className: string };
};

/** Derive visual parts only; leave ids, validation and announcements consumer-owned. */
export function useFieldMessage({
  children,
  tone = 'description',
  icon,
  className,
  ...rest
}: FieldMessageProps): UseFieldMessageResult {
  return {
    visible: children !== '',
    children,
    icon: icon ?? toneIcons[tone],
    rootProps: { ...rest, className: cn(fieldMessageVariants({ tone }), className) },
    iconProps: { className: cn(fieldMessageIconVariants()) },
    textProps: { className: cn(fieldMessageTextVariants()) }
  };
}
