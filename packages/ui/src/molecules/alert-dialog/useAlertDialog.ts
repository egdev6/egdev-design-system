import { Children, cloneElement, createContext, Fragment, isValidElement, type MouseEvent } from 'react';
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
import {
  alertDialogDecisionVariants,
  alertDialogHeadVariants,
  alertDialogIconVariants,
  alertDialogTitleRowVariants
} from './types';

export const AlertDialogPendingContext = createContext(false);

export function useAlertDialogButton(
  props: AlertDialogTriggerProps | AlertDialogCancelProps | AlertDialogActionProps,
  pending = false
) {
  const { asChild = false, children, className, onClickCapture, ...rest } = props;
  if (asChild && (!isValidElement(children) || Children.count(children) !== 1 || children.type === Fragment)) {
    throw new Error('AlertDialog asChild requires a single named button-compatible element');
  }
  return {
    ...rest,
    asChild,
    children:
      pending && asChild && isValidElement<{ 'aria-disabled'?: boolean | 'true' | 'false' }>(children)
        ? cloneElement(children, { 'aria-disabled': true })
        : children,
    className: pending ? cn(alertDialogDecisionVariants({ pending }), className) : className,
    type: 'button' as const,
    ...(pending
      ? {
          'aria-disabled': true as const,
          onClickCapture: (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      : { onClickCapture })
  };
}
export function useAlertDialogContent(props: AlertDialogContentProps) {
  const {
    title,
    description,
    children,
    actions,
    tone = 'neutral',
    headerLayout,
    container,
    overlayScope,
    className,
    ...rest
  } = props;
  const resolvedHeaderLayout = headerLayout === 'inline' ? 'inline' : 'stacked';
  const scope = overlayScope ?? (container ? 'container' : 'viewport');
  return {
    container,
    blocked: scope === 'container' && !container,
    title,
    description,
    children,
    actions,
    tone,
    rest,
    overlayClass: cn('eg-alert-dialog-backdrop', dialogScrimVariants(), dialogOverlayVariants({ flush: false, scope })),
    panelClass: cn('eg-alert-dialog', dialogPanelVariants({ variant: 'centered', size: 'sm' }), className),
    headClass: cn('eg-alert-dialog__head', alertDialogHeadVariants({ headerLayout: resolvedHeaderLayout })),
    titleRowClass: cn(alertDialogTitleRowVariants()),
    iconClass: cn(alertDialogIconVariants()),
    titleClass: cn('eg-alert-dialog__title', dialogTitleVariants()),
    descriptionClass: cn('eg-alert-dialog__description', dialogDescriptionVariants()),
    bodyClass: cn('eg-alert-dialog__body', dialogBodyVariants()),
    footClass: cn('eg-alert-dialog__foot', dialogFootVariants({ variant: 'centered' }))
  };
}
