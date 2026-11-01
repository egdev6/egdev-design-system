import type * as ToastPrimitive from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { type NoticeTone, noticeVariants } from '../notice';

/** Semantic toast tone; loading pairs with promise lifecycles and stays mounted until settled. */
export type ToastTone = NoticeTone | 'loading';

/** Viewport anchor: top|bottom × start|end; center is deliberately out of scope (OQ4). */
export type ToastPlacement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

/** Localized notification context, mounted once near the application root. */
export type ToastProviderProps = {
  /**
   * Application subtree; the provider renders every store-driven toast itself.
   * @control false
   * @controlReason Non-serializable ReactNode; see Default and Stack.
   */
  children: ReactNode;
  /**
   * Viewport region name; Radix replaces {hotkey} with F8.
   * @default Notifications ({hotkey})
   * @control text
   */
  label?: string;
  /**
   * Prefix used by Radix for each live announcement.
   * @default Notification
   * @control text
   */
  announcementLabel?: string;
  /**
   * Viewport anchor; the swipe direction derives from it (OQ8).
   * @default bottom-end
   * @control select
   */
  placement?: ToastPlacement;
  /**
   * Auto-dismiss milliseconds for calls without an explicit duration.
   * @default 5000
   * @control number
   */
  defaultDuration?: number;
  /**
   * Visible cap; older overflow queues at store level and promotes on close.
   * @default 3
   * @control number
   */
  maxVisible?: number;
  /**
   * Pause remaining timers while the window is hidden. Radix pauses natively; the default
   * false resumes through Radix's viewport events so timers keep counting (OQ6).
   * @default false
   * @control boolean
   */
  pauseOnWindowBlur?: boolean;
};

type ToastActionProps =
  | {
      /**
       * One button-compatible element forwarding props and refs; Button md supplies a 48px target.
       * Alternative children must provide at least a 44px coarse-pointer target.
       * @control false
       * @controlReason Non-serializable ReactElement; see WithAction and DismissTargets.
       */
      actions: ReactElement;
      /**
       * Persistent alternative route to the action, not its visible label. Must be non-empty.
       * @control text
       */
      actionAltText: string;
    }
  | {
      /**
       * No action element in the message-only branch.
       * @control false
       * @controlReason Non-serializable ReactElement; see WithAction and DismissTargets.
       */
      actions?: never;
      /**
       * Alternative route is absent when no action is supplied.
       * @control text
       */
      actionAltText?: never;
    };

/**
 * Imperative call input for useToast; the provider renders every record. The native title
 * attribute is replaced by the required message title. No ref or asChild API. className
 * supports root layout additions only, merged last; tone and Material overrides are
 * unsupported. Closing a focused toast moves focus to the viewport (A1).
 */
export type ToastProps = Omit<
  ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
  'asChild' | 'type' | 'children' | 'duration' | 'open' | 'defaultOpen' | 'onOpenChange' | 'title'
> & {
  /**
   * Required short lead sentence, emphasized in the Radix Title; carries meaning without color.
   * @control text
   */
  title: string;
  /**
   * Optional detail in the Radix Description. Do not nest live regions or rich controls.
   * @control false
   * @controlReason Non-serializable ReactNode; see Default and WithAction.
   */
  description?: ReactNode;
  /**
   * Status tint and default glyph; danger announces assertively, other tones politely.
   * loading renders a spinner and stays mounted until updated or closed.
   * @default neutral
   * @control select
   */
  tone?: ToastTone;
  /**
   * Decorative replacement for the per-tone glyph or spinner; null retains the default.
   * @control false
   * @controlReason Non-serializable ReactNode; see CustomIcon.
   */
  icon?: ReactNode;
  /**
   * Auto-dismiss milliseconds; Infinity disables the timer; 0 falls back through Radix.
   * Omitted loading calls stay mounted until settled; other omissions use defaultDuration.
   * @default 5000
   * @control number
   */
  duration?: number;
  /**
   * Caller-supplied identity; showing an already-known id updates that toast in place.
   * @control text
   */
  id?: string;
  /**
   * Runs when the action element is activated, before native dismissal; cancellation through
   * preventDefault still prevents the close.
   * @control false
   * @controlReason Non-serializable callback; see WithAction.
   */
  onAction?: () => void;
  /**
   * Accessible name of the built-in ghost/lg IconButton close control.
   * @default Dismiss
   * @control text
   */
  dismissLabel?: string;
} & ToastActionProps;

/** Fields allowed when updating an existing toast; omitted fields keep their stored value. */
export type ToastUpdateOptions = Partial<Omit<ToastProps, 'id'>>;

/** Fields allowed beyond title when using the tone helpers or promise phases. */
export type ToastCallOptions = Partial<Omit<ToastProps, 'id' | 'title'>>;

/** Resolution messages for toast.promise; each phase may derive its text from the outcome. */
export type ToastPromiseMessages<T> = {
  /** Text shown with the loading tone while the promise is pending. */
  loading: string;
  /** Text of the success update, or a function of the resolved value. */
  success?: string | ((value: T) => string);
  /** Text of the danger update, or a function of the rejection reason. */
  error?: string | ((reason: unknown) => string);
};

/** Stable imperative surface returned by useToast; calls before provider mount warn and no-op. */
export type ToastApi = {
  /** Shows a toast and returns its stable id; a repeated caller id updates in place. */
  show: (options: ToastProps) => string;
  /** Updates a known toast in place; unknown ids no-op so settled promises stay safe. */
  update: (id: string, options: ToastUpdateOptions) => string;
  /** Removes one toast immediately; queued overflow promotes. */
  close: (id: string) => void;
  /** Removes every queued and visible toast. */
  clear: () => void;
  info: (title: string, options?: ToastCallOptions) => string;
  success: (title: string, options?: ToastCallOptions) => string;
  warning: (title: string, options?: ToastCallOptions) => string;
  /** danger tone; announces assertively through Radix's foreground type. */
  error: (title: string, options?: ToastCallOptions) => string;
  /** loading tone with a spinner; stays mounted until updated or closed. */
  loading: (title: string, options?: ToastCallOptions) => string;
  /** Tracks a promise through loading into success or danger content; rethrows rejections. */
  promise: <T>(promise: Promise<T>, messages: ToastPromiseMessages<T>) => Promise<T>;
};

const toastRootVariants = cva(
  'eg-toast pe-2 shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)] starting:opacity-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:translate-y-0 data-[swipe=cancel]:transition-transform motion-reduce:transition-none motion-reduce:data-[swipe=cancel]:transition-none'
);

/** Reuse Notice without its marker or semantics; replace only the floating recipe deltas. */
export function toastVariants(tone: ToastTone = 'neutral'): string {
  return cn(noticeVariants({ tone: tone === 'loading' ? 'neutral' : tone, size: 'md' }), toastRootVariants());
}

export const toastViewportVariants = cva(
  'eg-toast-viewport fixed m-0 flex list-none flex-col gap-2 p-0 w-[min(calc(100vw-2*var(--space-6)),calc(var(--space-24)*4))] outline-none focus-visible:shadow-[var(--shadow-focus)] rounded-lg',
  {
    variants: {
      placement: {
        'top-start': 'top-6 start-6',
        'top-end': 'top-6 end-6',
        'bottom-start': 'bottom-6 start-6',
        'bottom-end': 'bottom-6 end-6'
      }
    },
    defaultVariants: { placement: 'bottom-end' }
  }
);
