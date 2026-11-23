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
  /**
   * Locks this dialog's owned dismissal controls and marks its content busy while an action is in flight.
   * Consumers synchronously prevent the initiating close, guard duplicate starts, and provide visible
   * progress, recovery and any needed announcement outside the busy subtree; aria-busy is not an announcement.
   * An outside-host pointer press can move focus to body without closing; Tab re-enters through Radix's active trap.
   * Controlled close and unmount remain possible.
   * @default false
   * @control boolean
   */
  pending?: boolean;
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
      /** Centered dimensions default to md; an omitted sheet size remains capped. @default md
       * @control select */ size?: DialogSize;
      /** Available only for sheets. @control select */ titleOverflow?: never;
      /** Available only for sheets. @control select */ actionsPlacement?: never;
    }
  | {
      /** Panel placement. @control select */ variant: 'sheet';
      /** Full fills the overlay width; omission keeps the sheet capped. @control select */ size?: 'full';
      /**
       * Limit the visible title to two lines, retaining the full accessible title. Consumers must
       * provide a visible route to the complete title for keyboard, pointer and touch users.
       * A native title attribute or Tooltip alone is not sufficient.
       * @default default
       * @control select
       */
      titleOverflow?: 'default' | 'clamp';
      /**
       * Place existing actions in the footer or the header. A sufficiently sized host keeps the
       * header visible while the body scrolls; an insufficient host may scroll the overlay.
       * @default footer
       * @control select
       */
      actionsPlacement?: 'footer' | 'header';
    };

type DialogPlacement =
  | {
      /** Body portal when absent or null. @control false
       * @controlReason DOM elements are not serializable; see Container and ContainerViewport. */
      container?: null;
      /** Viewport layout without a host; derived from container when omitted. @control select */
      overlayScope?: 'viewport';
    }
  | {
      /** Ready, connected same-document host. @control false
       * @controlReason DOM elements are not serializable; see Container and ContainerViewport. */
      container: HTMLElement;
      /** Container layout by default with a host; viewport permits mount-only use. @control select */
      overlayScope?: 'viewport' | 'container';
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
  DialogDimensions &
  DialogPlacement & {
    /**
     * Body-only token padding; child gaps, header and footer are unchanged.
     * @default default
     * @control select
     */
    bodyPadding?: 'default' | 'compact';
    /** Arrange the description beside or below the title and status. @default inline
     * @control select */ headerLayout?: 'inline' | 'stacked';
    /** Non-empty localized visible title. @control text */ title: string;
    /** Optional visible description. @control text */ description?: string;
    /** Optional passive header status. @control text */ statusText?: string;
    /** Body content. @control false
     * @controlReason ReactNode is not serializable; see Default. */ children: ReactNode;
    /** Optional actions, in the footer by default. Supply a manageable set with adequate target spacing. @control false
     * @controlReason ReactNode is not serializable; see WithSplitAction and HeaderActions. */ actions?: ReactNode;
    /** Localized close name. @default Close
     * @control text */ dismissLabel?: string;
  };

/** Keep pending closes hit-testable without overriding explicitly disabled buttons. */
export const dialogCloseVariants = cva('', {
  variants: { pending: { true: 'aria-disabled:[&:not(:disabled)]:pointer-events-auto', false: '' } },
  defaultVariants: { pending: false }
});
/** Internal, marker-free paint recipe shared by modal components. */
export const dialogScrimVariants = cva('bg-bg-scrim/72 backdrop-blur-none');
export const dialogOverlayLayout = cva('inset-0 grid overflow-y-auto place-items-center p-[var(--space-6)]', {
  variants: {
    scope: { viewport: 'fixed', container: 'absolute' },
    flush: { true: 'p-0', false: '' }
  },
  defaultVariants: { scope: 'viewport' }
});
/** Keep the existing shared overlay class ordering while positioning is a separate axis. */
export function dialogOverlayVariants(props?: Parameters<typeof dialogOverlayLayout>[0]) {
  const classes = dialogOverlayLayout(props).split(' ');
  const position = classes.findIndex((value) => value === 'fixed' || value === 'absolute');
  if (position >= 0) {
    classes.unshift(...classes.splice(position, 1));
  }
  return classes.join(' ');
}
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
/** Inline headers align the description and status to the title's last baseline, `--space-2` apart. */
export const dialogHeadVariants = cva(
  'relative shrink-0 border-b-0 py-[var(--space-4)] ps-[var(--space-6)] pe-[calc(var(--space-4)+var(--space-12))] gap-[var(--space-2)]',
  {
    variants: {
      headerLayout: { inline: 'flex items-baseline-last', stacked: 'flex flex-col items-start' }
    },
    defaultVariants: { headerLayout: 'inline' }
  }
);
/** Stacked title row: the status shares the title's last baseline. */
export const dialogTitleRowVariants = cva('flex items-baseline-last gap-[var(--space-3)] max-w-full min-w-0');
/** Centres the `lg` dismiss (`--space-12`) on the title's first line, below the header's `--space-4` padding. */
export const dialogDismissVariants = cva(
  'absolute top-[calc(var(--space-4)+(var(--text-heading-small)*var(--text-heading-small--line-height)-var(--space-12))/2)] end-[var(--space-4)]'
);
/** Header text zeroes the browser's default heading and paragraph margins in every layout. */
export const dialogTitleVariants = cva('m-0 font-display uppercase text-heading-small text-fg-default');
/** Sheet-only recipes leave the recipes shared with sibling modals unchanged. */
export const dialogSheetClampTitleVariants = cva('min-w-0 line-clamp-2 wrap-anywhere');
export const dialogSheetFullVariants = cva('max-w-none');
export const dialogSheetOverflowVariants = cva('min-h-min max-h-none self-start');
export const dialogSheetBodyMinimumVariants = cva('box-border basis-0', {
  variants: {
    bodyPadding: {
      default: 'min-h-[calc(var(--space-14)+2*var(--space-6))]',
      compact: 'min-h-[calc(var(--space-14)+2*var(--space-3))]'
    }
  },
  defaultVariants: { bodyPadding: 'default' }
});
export const dialogSheetHeadVariants = cva('relative shrink-0 border-b-0 p-0 flex flex-col items-stretch gap-0');
export const dialogHeaderActionsVariants = cva('flex-wrap gap-[var(--space-7)]');
export const dialogDescriptionVariants = cva('m-0 text-body-default text-fg-secondary');
export const dialogStatusVariants = cva('text-label-default text-fg-muted');
export const dialogBodyVariants = cva('min-h-0 overflow-y-auto', {
  variants: { bodyPadding: { default: 'p-[var(--space-6)]', compact: 'p-[var(--space-3)]' } },
  defaultVariants: { bodyPadding: 'default' }
});
/** Adjacent md IconButtons need consumer-provided spacing of at least gap-5 under default
 * tokens, in both axes: leave one spacing token beyond their combined target outsets.
 * See IconButton size in packages/ui/src/atoms/icon-button/types.ts.
 */
export const dialogFootVariants = cva(
  'shrink-0 flex justify-end items-center px-[var(--space-6)] py-[var(--space-4)] gap-[var(--space-3)] border-t border-border-hairline',
  { variants: { variant: { centered: 'bg-surface-0', sheet: 'bg-surface-1' } } }
);
