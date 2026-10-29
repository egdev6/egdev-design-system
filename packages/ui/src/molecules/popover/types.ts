import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

/** Click-open interactive panel. Radix owns visibility; this root renders no DOM. */
export type PopoverProps = {
  /**
   * One Trigger and one Content; use Close for explicit dismissal.
   * @control false
   * @controlReason ReactNode composition is not serializable; see Default and WithForm.
   */
  children: ReactNode;
  /**
   * Controlled visibility; the owner must acknowledge close requests.
   * @control boolean
   */
  open?: boolean;
  /**
   * Initial uncontrolled visibility, read once.
   * @default false
   * @control boolean
   */
  defaultOpen?: boolean;
  /**
   * Requested next visibility; incoming prop updates never echo this notification.
   * @control false
   * @controlReason A callback is not serializable; see Controlled.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Contain focus, pointer interaction and assistive-technology access while open.
   * Do not change modality while open. Non-modal Tab still cycles within Content.
   * @default false
   * @control boolean
   */
  modal?: boolean;
};

type ButtonComposition =
  | {
      /**
       * Render a native button rather than composing a child.
       * @default false
       * @control boolean
       */
      asChild?: false;
      /**
       * Named button content; icon-only buttons require an accessible name.
       * @control false
       * @controlReason ReactNode content is not serializable; see Default.
       */
      children: ReactNode;
    }
  | {
      /**
       * Compose one named, focusable button-compatible child that spreads props and forwards its button ref.
       * The actual child must retain type=button; fragments, anchors and disabled entry points are unsupported.
       * @control boolean
       */
      asChild: true;
      /**
       * One actual button-compatible element, not a fragment or a passive component.
       * @control false
       * @controlReason A ReactElement is not serializable; see ButtonTrigger and IconButtonClose.
       */
      children: ReactElement;
    };

type ButtonNativeProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'type' | 'style' | 'dangerouslySetInnerHTML'
>;

/** Named disclosure button with Radix-owned ARIA. Button children retain idle/loading data-state (A2). */
export type PopoverTriggerProps = ButtonNativeProps & ButtonComposition;
/** Explicit dismiss action; native button ref. Ordinary form/action controls do not implicitly dismiss. */
export type PopoverCloseProps = ButtonNativeProps & ButtonComposition;

/** Named dialog. className supports outer dimensions, margins and alignment only, not Material paint. */
export type PopoverContentProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'id'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-modal'
  | 'tabIndex'
  | 'style'
  | 'dangerouslySetInnerHTML'
  | 'contentEditable'
> & {
  /**
   * Consumer-owned body, field labels and visible Close action; no generated heading or form.
   * @control false
   * @controlReason ReactNode content is not serializable; see WithForm and ReadOnly.
   */
  children: ReactNode;
  /**
   * Required non-empty localized dialog name, independently of its visible body.
   * @control text
   */
  label: string;
  /**
   * Preferred side before Radix collision handling.
   * @default bottom
   * @control select
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Preferred alignment along the trigger before collision handling.
   * @default start
   * @control select
   */
  align?: 'start' | 'center' | 'end';
};

/** Static token geometry, Radix available-space bounds, opacity-only entry and fallback focus outline. */
export const popoverContentVariants = cva([
  'eg-popover w-[calc(var(--space-24)*4)]',
  'max-w-[var(--radix-popover-content-available-width)] max-h-[var(--radix-popover-content-available-height)]',
  'overflow-y-auto break-words font-sans text-body-default',
  'transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)]',
  'data-[state=open]:starting:opacity-0 motion-reduce:transition-none',
  'focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2'
]);

/** Transparent native control, not a cloned Button recipe; composed atoms supply raised appearance. */
export const popoverButtonVariants = cva([
  'inline-flex items-center justify-center min-w-[var(--space-10)] min-h-[var(--space-10)]',
  'pointer-coarse:min-w-[var(--space-12)] pointer-coarse:min-h-[var(--space-12)] rounded-md',
  'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
  'disabled:opacity-45 disabled:pointer-events-none'
]);
