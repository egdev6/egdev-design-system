import * as ToastPrimitive from '@radix-ui/react-toast';
import type { FC } from 'react';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { Portal } from '../../primitives/portal';
import type { ToastProps, ToastProviderProps } from './types';
import { useToast, useToastProvider } from './useToast';

/** Declarative transient feedback; Radix owns announcement, timing, dismissal and focus. */
export const Toast: FC<ToastProps> = (props) => {
  const {
    rootProps,
    summary,
    children,
    icon,
    iconName,
    actions,
    actionAltText,
    dismissLabel,
    iconClassName,
    textClassName,
    actionsClassName
  } = useToast(props);
  return (
    <ToastPrimitive.Root {...rootProps}>
      <span className={iconClassName} aria-hidden='true'>
        {icon ?? <Icon name={iconName} size='md' />}
      </span>
      <div className={textClassName}>
        <ToastPrimitive.Title asChild={true}>
          <strong>{summary}</strong>
        </ToastPrimitive.Title>
        {children != null && <ToastPrimitive.Description>{children}</ToastPrimitive.Description>}
      </div>
      {actions && actionAltText !== undefined && (
        <span className={actionsClassName}>
          <ToastPrimitive.Action asChild={true} altText={actionAltText}>
            {actions}
          </ToastPrimitive.Action>
        </span>
      )}
      <ToastPrimitive.Close asChild={true}>
        <IconButton label={dismissLabel} variant='ghost' size='lg' icon={<Icon name='close' />} />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
};

/** Mount once near the application root; the system Portal hosts Radix's F8 viewport. */
export const ToastProvider: FC<ToastProviderProps> = (props) => {
  const { children, providerProps, viewportProps } = useToastProvider(props);
  return (
    <ToastPrimitive.Provider {...providerProps}>
      {children}
      <Portal>
        <ToastPrimitive.Viewport {...viewportProps} />
      </Portal>
    </ToastPrimitive.Provider>
  );
};
