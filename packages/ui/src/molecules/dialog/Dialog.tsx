import * as DialogPrimitive from '@radix-ui/react-dialog';
import { forwardRef } from 'react';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { Surface } from '../../primitives/surface';
import type { DialogCloseProps, DialogContentProps, DialogProps, DialogTriggerProps } from './types';
import { useDialogButton, useDialogContent } from './useDialog';

/** Modal root; Radix owns visibility and focus. */
export function Dialog(props: DialogProps) {
  return <DialogPrimitive.Root {...props} modal={true} />;
}
/** Optional native or slotted disclosure button. */
export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>((props, ref) => (
  <DialogPrimitive.Trigger {...useDialogButton(props)} ref={ref} />
));
DialogTrigger.displayName = 'DialogTrigger';
/** Explicit close action. */
export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>((props, ref) => (
  <DialogPrimitive.Close {...useDialogButton(props)} ref={ref} />
));
DialogClose.displayName = 'DialogClose';
/** Body-portalled modal panel with an owned accessible title and optional description. */
export function DialogContent(props: DialogContentProps) {
  const c = useDialogContent(props);
  const body = (
    <>
      <header className={c.headClass}>
        <DialogPrimitive.Title className={c.titleClass}>{c.title}</DialogPrimitive.Title>
        {c.statusText && <span className={c.statusClass}>{c.statusText}</span>}
        {c.description !== undefined && (
          <DialogPrimitive.Description className={c.descriptionClass}>{c.description}</DialogPrimitive.Description>
        )}
      </header>
      <div className={c.bodyClass}>{c.children}</div>
      {c.actions != null && <footer className={c.footClass}>{c.actions}</footer>}
      <DialogPrimitive.Close asChild={true}>
        <IconButton
          className={c.dismissClass}
          label={c.dismissLabel}
          icon={<Icon name='close' />}
          size='lg'
          variant='ghost'
        />
      </DialogPrimitive.Close>
    </>
  );
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={c.overlayClass}>
        <DialogPrimitive.Content
          {...c.rest}
          aria-modal={true}
          {...(c.description === undefined ? { 'aria-describedby': undefined } : {})}
          asChild={true}
        >
          {c.variant === 'sheet' ? (
            <Surface tone='overlay' radius='none' padding='none' className={c.panelClass}>
              {body}
            </Surface>
          ) : (
            <Surface
              tone='surface-2'
              elevation={3}
              radius={c.size === 'full' ? 'none' : 'xl'}
              padding='none'
              className={c.panelClass}
            >
              {body}
            </Surface>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  );
}
