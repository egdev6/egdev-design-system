import { Children, cloneElement, createContext, Fragment, isValidElement, type MouseEvent } from 'react';
import { cn } from '../../lib/cn';
import type { DialogCloseProps, DialogContentProps, DialogTriggerProps } from './types';
import {
  dialogBodyVariants,
  dialogCloseVariants,
  dialogDescriptionVariants,
  dialogDismissVariants,
  dialogFootVariants,
  dialogHeaderActionsVariants,
  dialogHeadVariants,
  dialogOverlayVariants,
  dialogPanelVariants,
  dialogScrimVariants,
  dialogSheetBodyMinimumVariants,
  dialogSheetClampTitleVariants,
  dialogSheetFullVariants,
  dialogSheetHeadVariants,
  dialogSheetOverflowVariants,
  dialogStatusVariants,
  dialogTitleRowVariants,
  dialogTitleVariants
} from './types';

export const DialogPendingContext = createContext(false);

export function useDialogButton(props: DialogTriggerProps | DialogCloseProps) {
  const { asChild = false, children, className, ...rest } = props;
  if (asChild && (!isValidElement(children) || Children.count(children) !== 1 || children.type === Fragment)) {
    throw new Error('Dialog asChild requires a single named button-compatible element');
  }
  return { ...rest, asChild, children, className, type: 'button' as const };
}

export function useDialogCloseButton(props: DialogCloseProps, pending: boolean) {
  const button = useDialogButton(props);
  if (!pending) {
    return button;
  }
  return {
    ...button,
    children:
      button.asChild && isValidElement<{ 'aria-disabled'?: boolean | 'true' | 'false' }>(button.children)
        ? cloneElement(button.children, { 'aria-disabled': true })
        : button.children,
    className: cn(dialogCloseVariants({ pending }), button.className),
    'aria-disabled': true as const,
    onClickCapture: (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
    }
  };
}

export function useDialogContent(props: DialogContentProps) {
  const {
    title,
    description,
    statusText,
    children,
    actions,
    dismissLabel = 'Close',
    variant = 'centered',
    size = 'md',
    titleOverflow,
    actionsPlacement,
    container,
    overlayScope,
    bodyPadding,
    headerLayout: requestedHeaderLayout,
    className,
    ...rest
  } = props;
  const flush = variant === 'sheet' || size === 'full';
  const scope = overlayScope ?? (container ? 'container' : 'viewport');
  const headerLayout = requestedHeaderLayout === 'stacked' ? 'stacked' : 'inline';
  const sheet = variant === 'sheet';
  const clampTitle = sheet && titleOverflow === 'clamp';
  const headerActions = sheet && actionsPlacement === 'header';
  const exceptionalScroll = clampTitle || headerActions;
  return {
    container,
    blocked: scope === 'container' && !container,
    title,
    description,
    statusText,
    children,
    actions,
    dismissLabel,
    headerLayout,
    headerActions,
    variant,
    size,
    rest,
    overlayClass: cn('eg-dialog-backdrop', dialogScrimVariants(), dialogOverlayVariants({ flush, scope })),
    panelClass: cn(
      'eg-dialog',
      dialogPanelVariants({ variant, size: sheet ? undefined : size }),
      sheet && size === 'full' && dialogSheetFullVariants(),
      exceptionalScroll && dialogSheetOverflowVariants(),
      className
    ),
    dismissClass: cn(dialogDismissVariants()),
    headClass: cn('eg-dialog__head', headerActions ? dialogSheetHeadVariants() : dialogHeadVariants({ headerLayout })),
    headingGroupClass: cn(dialogHeadVariants({ headerLayout })),
    titleRowClass: cn(dialogTitleRowVariants()),
    titleClass: cn('eg-dialog__title', dialogTitleVariants(), clampTitle && dialogSheetClampTitleVariants()),
    descriptionClass: cn('eg-dialog__description', dialogDescriptionVariants()),
    statusClass: cn('eg-dialog__status', dialogStatusVariants()),
    bodyClass: cn(
      'eg-dialog__body',
      dialogBodyVariants({ bodyPadding }),
      exceptionalScroll &&
        dialogSheetBodyMinimumVariants({ bodyPadding: bodyPadding === 'compact' ? 'compact' : 'default' })
    ),
    footClass: cn('eg-dialog__foot', dialogFootVariants({ variant })),
    headerActionsClass: cn('eg-dialog__foot', dialogFootVariants({ variant: 'sheet' }), dialogHeaderActionsVariants())
  };
}
