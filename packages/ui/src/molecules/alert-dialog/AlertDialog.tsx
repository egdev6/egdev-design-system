import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { forwardRef, useContext } from 'react';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Surface } from '../../primitives/surface';
import type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogProps,
  AlertDialogTriggerProps
} from './types';
import { AlertDialogPendingContext, useAlertDialogButton, useAlertDialogContent } from './useAlertDialog';

/** Decision-required modal root. */
export function AlertDialog({ pending = false, ...props }: AlertDialogProps) {
  return (
    <AlertDialogPendingContext.Provider value={pending}>
      <AlertDialogPrimitive.Root {...props} />
    </AlertDialogPendingContext.Provider>
  );
}
/** Optional disclosure control. */
export const AlertDialogTrigger = forwardRef<HTMLButtonElement, AlertDialogTriggerProps>((props, ref) => (
  <AlertDialogPrimitive.Trigger {...useAlertDialogButton(props)} ref={ref} />
));
AlertDialogTrigger.displayName = 'AlertDialogTrigger';
/** Least-destructive decision; receives initial focus. */
export const AlertDialogCancel = forwardRef<HTMLButtonElement, AlertDialogCancelProps>((props, ref) => {
  const { children, ...button } = useAlertDialogButton(props, useContext(AlertDialogPendingContext));
  return button.asChild ? (
    <AlertDialogPrimitive.Cancel {...button} ref={ref}>
      {children}
    </AlertDialogPrimitive.Cancel>
  ) : (
    <AlertDialogPrimitive.Cancel {...button} asChild={true} ref={ref}>
      <Button variant='secondary'>{children}</Button>
    </AlertDialogPrimitive.Cancel>
  );
});
AlertDialogCancel.displayName = 'AlertDialogCancel';
/** Decision action. */
export const AlertDialogAction = forwardRef<HTMLButtonElement, AlertDialogActionProps>((props, ref) => {
  const { children, ...button } = useAlertDialogButton(props, useContext(AlertDialogPendingContext));
  return button.asChild ? (
    <AlertDialogPrimitive.Action {...button} ref={ref}>
      {children}
    </AlertDialogPrimitive.Action>
  ) : (
    <AlertDialogPrimitive.Action {...button} asChild={true} ref={ref}>
      <Button>{children}</Button>
    </AlertDialogPrimitive.Action>
  );
});
AlertDialogAction.displayName = 'AlertDialogAction';
/**
 * Labelled modal with required consequence and actions. A connected, positioned,
 * non-scrolling host bounds container-scoped paint, not document-wide Radix modality.
 * Render after the host is ready and close before removing or replacing it. Viewport
 * scope beneath a host can still be constrained by clipping or containing blocks.
 */
export function AlertDialogContent(props: AlertDialogContentProps) {
  const pending = useContext(AlertDialogPendingContext);
  const c = useAlertDialogContent(props);
  if (c.blocked) {
    return null;
  }
  return (
    <AlertDialogPrimitive.Portal container={c.container}>
      <AlertDialogPrimitive.Overlay className={c.overlayClass}>
        <AlertDialogPrimitive.Content
          {...c.rest}
          aria-busy={pending ? true : c.rest['aria-busy']}
          aria-modal={true}
          onEscapeKeyDown={pending ? (event) => event.preventDefault() : undefined}
          asChild={true}
        >
          <Surface tone='surface-2' elevation={3} radius='xl' padding='none' className={c.panelClass}>
            <header className={c.headClass}>
              <div className={c.titleRowClass}>
                {c.tone === 'danger' && <Icon name='alert' className={c.iconClass} />}
                <AlertDialogPrimitive.Title className={c.titleClass}>{c.title}</AlertDialogPrimitive.Title>
              </div>
              <AlertDialogPrimitive.Description className={c.descriptionClass}>
                {c.description}
              </AlertDialogPrimitive.Description>
            </header>
            {c.children != null && <div className={c.bodyClass}>{c.children}</div>}
            <footer className={c.footClass}>{c.actions}</footer>
          </Surface>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Overlay>
    </AlertDialogPrimitive.Portal>
  );
}
