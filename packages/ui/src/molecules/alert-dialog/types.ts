import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

/** Decision-required modal root. */
export type AlertDialogProps = {
  /** Trigger and Content. @control false
   * @controlReason ReactNode composition is not serializable; see Default. */ children: ReactNode;
  /** Controlled visibility. @control boolean */ open?: boolean;
  /** Initial uncontrolled visibility. @default false
   * @control boolean */ defaultOpen?: boolean;
  /** Requested visibility changes. @control false
   * @controlReason Callback is not serializable; see Controlled. */ onOpenChange?: (open: boolean) => void;
};
type ButtonComposition =
  | {
      /** Compose a compatible child. @default false
       * @control boolean */ asChild?: false;
      /** Button content. @control false
       * @controlReason ReactNode is not serializable; see Default. */ children: ReactNode;
    }
  | {
      /** Compose a compatible child. @control boolean */ asChild: true;
      /** One compatible button. @control false
       * @controlReason ReactElement is not serializable; see Default. */ children: ReactElement;
    };
type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'type' | 'style' | 'dangerouslySetInnerHTML'> &
  ButtonComposition;
export type AlertDialogTriggerProps = ButtonProps;
export type AlertDialogCancelProps = ButtonProps;
export type AlertDialogActionProps = ButtonProps;
export type AlertDialogTone = 'neutral' | 'danger';
/** Class names merge last. Width, paint, radius, padding, positioning and focus overrides are unsupported, not prevented. */
export type AlertDialogContentProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'title'
  | 'children'
  | 'role'
  | 'aria-labelledby'
  | 'aria-describedby'
  | 'aria-modal'
  | 'tabIndex'
  | 'style'
  | 'dangerouslySetInnerHTML'
  | 'contentEditable'
> & {
  /** Non-empty localized title. @control text */ title: string;
  /** Non-empty localized consequence. @control text */ description: string;
  /** Supporting content. @control false
   * @controlReason ReactNode is not serializable; see WithBody. */ children?: ReactNode;
  /** One Cancel followed by one or more Actions. @control false
   * @controlReason ReactNode is not serializable; see Default. */ actions: ReactNode;
  /** Icon treatment, not panel material. @default neutral
   * @control select */ tone?: AlertDialogTone;
};
export const alertDialogHeadVariants = cva(
  'flex flex-col gap-[var(--space-2)] px-[var(--space-6)] pt-[var(--space-6)] pb-[var(--space-4)]'
);
export const alertDialogTitleRowVariants = cva('flex items-center gap-[var(--space-3)]');
export const alertDialogIconVariants = cva('text-[var(--color-status-danger)] size-[var(--space-6)] shrink-0');
