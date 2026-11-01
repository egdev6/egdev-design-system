import { Children, Fragment, isValidElement } from 'react';
import { cn } from '../../lib/cn';
import {
  dialogBodyVariants,
  dialogDescriptionVariants,
  dialogFootVariants,
  dialogOverlayVariants,
  dialogPanelVariants,
  dialogScrimVariants,
  dialogTitleVariants
} from '../dialog/types';
import type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogTriggerProps
} from './types';
import { alertDialogHeadVariants, alertDialogIconVariants, alertDialogTitleRowVariants } from './types';

export function useAlertDialogButton(props: AlertDialogTriggerProps | AlertDialogCancelProps | AlertDialogActionProps) {
  const { asChild = false, children, className, ...rest } = props;
  if (asChild && (!isValidElement(children) || Children.count(children) !== 1 || children.type === Fragment)) {
    throw new Error('AlertDialog asChild requires a single named button-compatible element');
  }
  return { ...rest, asChild, children, className, type: 'button' as const };
}
export function useAlertDialogContent(props: AlertDialogContentProps) {
  const { title, description, children, actions, tone = 'neutral', className, ...rest } = props;
  return {
    title,
    description,
    children,
    actions,
    tone,
    rest,
    overlayClass: cn('eg-alert-dialog-backdrop', dialogScrimVariants(), dialogOverlayVariants({ flush: false })),
    panelClass: cn('eg-alert-dialog', dialogPanelVariants({ variant: 'centered', size: 'sm' }), className),
    headClass: cn('eg-alert-dialog__head', alertDialogHeadVariants()),
    titleRowClass: cn(alertDialogTitleRowVariants()),
    iconClass: cn(alertDialogIconVariants()),
    titleClass: cn('eg-alert-dialog__title', dialogTitleVariants()),
    descriptionClass: cn('eg-alert-dialog__description', dialogDescriptionVariants()),
    bodyClass: cn('eg-alert-dialog__body', dialogBodyVariants()),
    footClass: cn('eg-alert-dialog__foot', dialogFootVariants({ variant: 'centered' }))
  };
}
