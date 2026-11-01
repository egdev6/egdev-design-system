import { Children, Fragment, isValidElement } from 'react';
import { cn } from '../../lib/cn';
import type { DialogCloseProps, DialogContentProps, DialogTriggerProps } from './types';
import {
  dialogBodyVariants,
  dialogDescriptionVariants,
  dialogDismissVariants,
  dialogFootVariants,
  dialogHeadVariants,
  dialogOverlayVariants,
  dialogPanelVariants,
  dialogScrimVariants,
  dialogStatusVariants,
  dialogTitleVariants
} from './types';

export function useDialogButton(props: DialogTriggerProps | DialogCloseProps) {
  const { asChild = false, children, className, ...rest } = props;
  if (asChild && (!isValidElement(children) || Children.count(children) !== 1 || children.type === Fragment)) {
    throw new Error('Dialog asChild requires a single named button-compatible element');
  }
  return { ...rest, asChild, children, className, type: 'button' as const };
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
    className,
    ...rest
  } = props;
  const flush = variant === 'sheet' || size === 'full';
  return {
    title,
    description,
    statusText,
    children,
    actions,
    dismissLabel,
    variant,
    size,
    rest,
    overlayClass: cn('eg-dialog-backdrop', dialogScrimVariants(), dialogOverlayVariants({ flush })),
    panelClass: cn(
      'eg-dialog',
      dialogPanelVariants({ variant, size: variant === 'sheet' ? undefined : size }),
      className
    ),
    dismissClass: cn(dialogDismissVariants()),
    headClass: cn('eg-dialog__head', dialogHeadVariants()),
    titleClass: cn('eg-dialog__title', dialogTitleVariants()),
    descriptionClass: cn('eg-dialog__description', dialogDescriptionVariants()),
    statusClass: cn('eg-dialog__status', dialogStatusVariants()),
    bodyClass: cn('eg-dialog__body', dialogBodyVariants()),
    footClass: cn('eg-dialog__foot', dialogFootVariants({ variant }))
  };
}
