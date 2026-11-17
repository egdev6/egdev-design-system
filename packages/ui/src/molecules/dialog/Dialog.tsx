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
/**
 * Modal panel with an owned title and optional description. A connected, positioned,
 * non-scrolling host bounds container-scoped paint; without one the portal uses body.
 * A custom host does not localize Radix modality, which remains document-wide. Render
 * after the host ref is ready and close before replacing or removing it. Viewport scope
 * under a host is subject to ancestor clipping and fixed-position containing blocks.
 */
export function DialogContent(props: DialogContentProps) {
  const c = useDialogContent(props);
  if (c.blocked) {
    return null;
  }
  const title = (
    <>
      <DialogPrimitive.Title className={c.titleClass}>{c.title}</DialogPrimitive.Title>
      {c.statusText && <span className={c.statusClass}>{c.statusText}</span>}
    </>
  );
  const body = (
    <>
      <header className={c.headClass}>
        {c.headerLayout === 'stacked' ? <div className={c.titleRowClass}>{title}</div> : title}
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
    <DialogPrimitive.Portal container={c.container}>
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
