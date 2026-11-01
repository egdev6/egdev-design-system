import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

/** Modal visibility is owned by Radix. */
export type DialogProps = {
  /** Composed Trigger and Content. @control false
   * @controlReason ReactNode composition is not serializable; see Default. */
  children: ReactNode;
  /** Controlled visibility. @control boolean */
  open?: boolean;
  /** Initial uncontrolled visibility. @default false
   * @control boolean */
  defaultOpen?: boolean;
  /** Requested visibility changes. @control false
   * @controlReason Callback is not serializable; see Controlled. */
  onOpenChange?: (open: boolean) => void;
};

type ButtonComposition =
  | {
      /** Compose a button-compatible child. @default false
       * @control boolean */ asChild?: false;
      /** Button content. @control false
       * @controlReason ReactNode is not serializable; see Default. */ children: ReactNode;
    }
  | {
      /** Compose a button-compatible child. @control boolean */ asChild: true;
      /** One ref-forwarding button-compatible child. @control false
       * @controlReason ReactElement is not serializable; see Default. */ children: ReactElement;
    };
type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'type' | 'style' | 'dangerouslySetInnerHTML'> &
  ButtonComposition;
export type DialogTriggerProps = ButtonProps;
export type DialogCloseProps = ButtonProps;
export type DialogSize = 'sm' | 'md' | 'lg' | 'full';
export type DialogVariant = 'centered' | 'sheet';

type DialogDimensions =
  | {
      /** Panel placement. @default centered
       * @control select */ variant?: 'centered';
      /** Centered panel dimensions. @default md
       * @control select */ size?: DialogSize;
    }
  | {
      /** Panel placement. @control select */ variant: 'sheet';
      /** Sheet dimensions are fixed. @control select */ size?: never;
    };

/** Modal panel; className merges last. Reserved width, padding, radius, paint, focus and positioning overrides are unsupported but not prevented. */
export type DialogContentProps = Omit<
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
> &
  DialogDimensions & {
    /** Non-empty localized visible title. @control text */ title: string;
    /** Optional visible description. @control text */ description?: string;
    /** Optional passive header status. @control text */ statusText?: string;
    /** Body content. @control false
     * @controlReason ReactNode is not serializable; see Default. */ children: ReactNode;
    /** Optional footer actions. @control false
     * @controlReason ReactNode is not serializable; see WithSplitAction. */ actions?: ReactNode;
    /** Localized close name. @default Close
     * @control text */ dismissLabel?: string;
  };

/** Internal, marker-free paint recipe shared by modal components. */
export const dialogScrimVariants = cva('bg-bg-scrim/72 backdrop-blur-none');
export const dialogOverlayVariants = cva('fixed inset-0 grid overflow-y-auto place-items-center p-[var(--space-6)]', {
  variants: { flush: { true: 'p-0', false: '' } }
});
export const dialogPanelVariants = cva(
  'relative flex flex-col box-border overflow-hidden max-h-full w-full motion-reduce:transition-none motion-reduce:transform-none transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)] data-[state=open]:starting:opacity-0',
  {
    variants: {
      size: {
        sm: 'max-w-[calc(var(--space-24)*5)]',
        md: 'max-w-[calc(var(--space-20)*8)]',
        lg: 'max-w-[calc(var(--space-24)*10)]',
        full: 'h-full max-w-none'
      },
      variant: {
        centered: '',
        sheet:
          'h-full max-w-[calc(var(--space-24)*4)] justify-self-end motion-safe:transition-[opacity,transform] motion-safe:data-[state=open]:starting:translate-x-full motion-safe:rtl:data-[state=open]:starting:-translate-x-full'
      }
    }
  }
);
export const dialogHeadVariants = cva(
  'relative shrink-0 border-b-0 py-[var(--space-4)] ps-[var(--space-6)] pe-[calc(var(--space-4)+var(--space-12))]'
);
export const dialogDismissVariants = cva('absolute top-[var(--space-4)] end-[var(--space-4)]');
export const dialogTitleVariants = cva('font-display uppercase text-heading-small text-fg-default');
export const dialogDescriptionVariants = cva('text-body-default text-fg-secondary');
export const dialogStatusVariants = cva('text-label-default text-fg-muted');
export const dialogBodyVariants = cva('min-h-0 overflow-y-auto p-[var(--space-6)]');
export const dialogFootVariants = cva(
  'shrink-0 flex justify-end items-center px-[var(--space-6)] py-[var(--space-4)] gap-[var(--space-3)] border-t border-border-hairline',
  { variants: { variant: { centered: 'bg-surface-0', sheet: 'bg-surface-1' } } }
);
