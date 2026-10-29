import type * as ToastPrimitive from '@radix-ui/react-toast';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { IconName } from '../../atoms/icon';
import { cn } from '../../lib/cn';
import { noticeActionsVariants, noticeIconVariants, noticeTextVariants } from '../notice/types';
import { type ToastProps, type ToastProviderProps, toastVariants, toastViewportVariants } from './types';

type UseToastResult = {
  rootProps: ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & { 'data-tone': ToastProps['tone'] };
  summary: string;
  children: ReactNode;
  icon: ReactNode;
  iconName: IconName;
  actions: ToastProps['actions'];
  actionAltText: ToastProps['actionAltText'];
  dismissLabel: string;
  iconClassName: string;
  textClassName: string;
  actionsClassName: string;
};

/** Derive urgency and glyph, while Radix owns all state, timers, announcements and focus. */
export function useToast({
  summary,
  children,
  tone = 'neutral',
  icon,
  actions,
  actionAltText,
  duration = 5000,
  defaultOpen = true,
  dismissLabel = 'Dismiss',
  className,
  ...rest
}: ToastProps): UseToastResult {
  return {
    rootProps: {
      ...rest,
      duration,
      defaultOpen,
      type: tone === 'danger' ? 'foreground' : 'background',
      'data-tone': tone,
      className: cn(toastVariants(tone), className)
    },
    summary,
    children,
    icon,
    iconName: tone === 'success' ? 'check' : tone === 'warning' || tone === 'danger' ? 'alert' : 'bell',
    actions,
    actionAltText,
    dismissLabel,
    iconClassName: cn(noticeIconVariants({ tone, size: 'md' })),
    textClassName: cn(noticeTextVariants()),
    actionsClassName: cn(noticeActionsVariants())
  };
}

type UseToastProviderResult = {
  children: ReactNode;
  providerProps: ComponentPropsWithoutRef<typeof ToastPrimitive.Provider>;
  viewportProps: ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>;
};

/** Localize both independent Radix labels without exposing provider-level timing or placement. */
export function useToastProvider({
  children,
  label = 'Notifications ({hotkey})',
  announcementLabel = 'Notification'
}: ToastProviderProps): UseToastProviderResult {
  return {
    children,
    providerProps: { label: announcementLabel, swipeDirection: 'right' },
    viewportProps: { label, className: cn(toastViewportVariants()) }
  };
}
