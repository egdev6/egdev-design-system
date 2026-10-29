import type * as ToastPrimitive from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { type NoticeTone, noticeVariants } from '../notice';

/** Localized notification context, mounted once near the application root. */
export type ToastProviderProps = {
  /**
   * Application subtree containing declarative Toast instances.
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
 * Ephemeral feedback announced by Radix, not a persistent Notice or an imperative queue.
 * No ref or asChild API. className supports root layout additions only, merged last;
 * tone and Material overrides are unsupported. Mount inside ToastProvider and remove closed
 * instances in onOpenChange(false). Focused dismissal moves focus to the viewport (A1).
 */
export type ToastProps = Omit<
  ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
  'asChild' | 'type' | 'children' | 'duration' | 'open' | 'defaultOpen' | 'onOpenChange'
> & {
  /**
   * Required short lead sentence, emphasized in the Radix Title.
   * @control text
   */
  summary: string;
  /**
   * Optional detail in the Radix Description. Do not nest live regions or rich controls.
   * @control false
   * @controlReason Non-serializable ReactNode; see Default and WithAction.
   */
  children?: ReactNode;
  /**
   * Status tint and default glyph; danger announces assertively, other tones politely.
   * @default neutral
   * @control select
   */
  tone?: NoticeTone;
  /**
   * Decorative replacement for the Notice per-tone glyph; null retains the default glyph.
   * @control false
   * @controlReason Non-serializable ReactNode; see CustomIcon.
   */
  icon?: ReactNode;
  /**
   * Auto-dismiss milliseconds; Infinity disables the timer. Timing otherwise follows Radix.
   * @default 5000
   * @control number
   */
  duration?: number;
  /**
   * Controlled visibility. Incoming updates and initial mounting emit no change notification.
   * @control boolean
   */
  open?: boolean;
  /**
   * Initial uncontrolled visibility.
   * @default true
   * @control boolean
   */
  defaultOpen?: boolean;
  /**
   * Requests visibility after timer, swipe, Escape, close or action; no incoming-prop echo.
   * @control false
   * @controlReason Non-serializable callback; see Controlled.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Accessible name of the built-in ghost/lg IconButton close control.
   * @default Dismiss
   * @control text
   */
  dismissLabel?: string;
} & ToastActionProps;

const toastRootVariants = cva(
  'eg-toast pe-2 shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)] starting:opacity-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform motion-reduce:transition-none motion-reduce:data-[swipe=cancel]:transition-none'
);

/** Reuse Notice without its marker or semantics; replace only the floating recipe deltas. */
export function toastVariants(tone: NoticeTone = 'neutral'): string {
  return cn(noticeVariants({ tone, size: 'md' }), toastRootVariants());
}

export const toastViewportVariants = cva(
  'eg-toast-viewport fixed bottom-6 end-6 m-0 flex list-none flex-col gap-2 p-0 w-[min(calc(100vw-2*var(--space-6)),calc(var(--space-24)*4))] outline-none focus-visible:shadow-[var(--shadow-focus)] rounded-lg'
);
