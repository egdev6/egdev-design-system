import * as ToastPrimitive from '@radix-ui/react-toast';
import {
  cloneElement,
  type FC,
  isValidElement,
  type MouseEvent,
  type ReactElement,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore
} from 'react';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { Spinner } from '../../atoms/spinner';
import { cn } from '../../lib/cn';
import { Portal } from '../../primitives/portal';
import { type NoticeTone, noticeActionsVariants, noticeIconVariants, noticeTextVariants } from '../notice/types';
import { type ToastRecord, toastStore } from './toastStore';
import { type ToastProviderProps, type ToastTone, toastVariants, toastViewportVariants } from './types';
import { toastIconName } from './useToast';

/** Radix's internal viewport resume event; reused to override the native window-blur pause. */
const VIEWPORT_RESUME = 'toast.viewportResume';

function noticeTone(tone: ToastTone): NoticeTone {
  return tone === 'loading' ? 'neutral' : tone;
}

/** Renders one store record; Radix owns announcement, timing, dismissal, swipe and focus. */
const Toast: FC<{ record: ToastRecord }> = ({ record }) => {
  const {
    title,
    description,
    tone = 'neutral',
    icon,
    actions,
    actionAltText,
    onAction,
    dismissLabel = 'Dismiss',
    className,
    ...rest
  } = record.options;
  // Omitted durations resolve through the provider context; loading stays mounted until settled.
  const duration = record.options.duration ?? (tone === 'loading' ? Infinity : undefined);
  const action = isValidElement(actions) ? actions : null;
  const actionElement =
    action && actionAltText !== undefined
      ? cloneElement(action as ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void }>, {
          onClick: (event: MouseEvent<HTMLElement>) => {
            const original = (action.props as { onClick?: (event: MouseEvent<HTMLElement>) => void }).onClick;
            original?.(event);
            onAction?.();
          }
        })
      : null;
  return (
    <ToastPrimitive.Root
      {...rest}
      open={true}
      duration={duration}
      type={tone === 'danger' ? 'foreground' : 'background'}
      data-tone={tone}
      onOpenChange={(open) => {
        if (!open) {
          toastStore.close(record.id);
        }
      }}
      className={cn(toastVariants(tone), className)}
    >
      <span className={noticeIconVariants({ tone: noticeTone(tone), size: 'md' })} aria-hidden='true'>
        {icon ?? (tone === 'loading' ? <Spinner size='md' /> : <Icon name={toastIconName(tone)} size='md' />)}
      </span>
      <div className={noticeTextVariants()}>
        <ToastPrimitive.Title asChild={true}>
          <strong>{title}</strong>
        </ToastPrimitive.Title>
        {description != null && <ToastPrimitive.Description>{description}</ToastPrimitive.Description>}
      </div>
      {actionElement && actionAltText !== undefined && (
        <span className={noticeActionsVariants()}>
          <ToastPrimitive.Action asChild={true} altText={actionAltText}>
            {actionElement}
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
  const {
    children,
    label = 'Notifications ({hotkey})',
    announcementLabel = 'Notification',
    placement = 'bottom-end',
    defaultDuration = 5000,
    maxVisible = 3,
    pauseOnWindowBlur = false
  } = props;
  const { records, activeProviderId } = useSyncExternalStore(toastStore.subscribe, toastStore.getState);
  const providerId = useId();
  const viewportRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    toastStore.claimProvider(providerId);
    toastStore.configure({ mounted: true });
    return () => {
      toastStore.releaseProvider(providerId);
      toastStore.configure({ mounted: false });
      toastStore.clear();
    };
  }, [providerId]);

  useEffect(() => {
    if (pauseOnWindowBlur) {
      return undefined;
    }
    const resume = () => {
      // Defer one tick so Radix's own blur pause handler runs first; the resume then restores
      // the remaining time through Radix's viewport events instead of timer math (OQ6). The
      // portal mounts the viewport after this effect, so the ref is read at dispatch time.
      window.setTimeout(() => viewportRef.current?.dispatchEvent(new CustomEvent(VIEWPORT_RESUME)), 0);
    };
    window.addEventListener('blur', resume);
    return () => window.removeEventListener('blur', resume);
  }, [pauseOnWindowBlur]);

  // Derived from placement; bottom-end keeps the v0.1 right swipe for compatibility (OQ8).
  const swipeDirection = placement.startsWith('top') ? 'up' : placement === 'bottom-start' ? 'down' : 'right';

  return (
    <ToastPrimitive.Provider label={announcementLabel} swipeDirection={swipeDirection} duration={defaultDuration}>
      {children}
      <Portal>
        <ToastPrimitive.Viewport ref={viewportRef} label={label} className={toastViewportVariants({ placement })}>
          {/* Oldest records stay visible; newer overflow queues and promotes on close (§3.4).
              The module singleton renders in the active (most recently mounted) provider only. */}
          {activeProviderId === providerId &&
            records.slice(0, maxVisible).map((record) => <Toast key={record.id} record={record} />)}
        </ToastPrimitive.Viewport>
      </Portal>
    </ToastPrimitive.Provider>
  );
};
