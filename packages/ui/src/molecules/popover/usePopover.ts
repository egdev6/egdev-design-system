import type { ComponentPropsWithoutRef } from 'react';
import { Children, createContext, Fragment, isValidElement, useContext } from 'react';
import { cn } from '../../lib/cn';
import type { PopoverCloseProps, PopoverContentProps, PopoverProps, PopoverTriggerProps } from './types';
import { popoverButtonVariants, popoverContentVariants } from './types';

/** Modality only: never duplicate Radix visibility or relationship ids. */
export const PopoverModalityContext = createContext<boolean | undefined>(undefined);

/** Radix takes numeric pixels; both fixed distances correspond to the existing --space-2 token. */
const placement = { sideOffset: 8, collisionPadding: 8 } as const;

export function usePopover({ children, modal = false, defaultOpen = false, open, onOpenChange }: PopoverProps): {
  children: PopoverProps['children'];
  modal: boolean;
  rootProps: Omit<PopoverProps, 'children'>;
} {
  return { children, modal, rootProps: { modal, defaultOpen, open, onOpenChange } };
}

type ButtonResult = {
  buttonProps: ComponentPropsWithoutRef<'button'> & { asChild: boolean; type: 'button'; className: string };
};

/** Prepare the shared native/slotted button without implementing interaction, focus or dismissal. */
export function usePopoverButton(props: PopoverTriggerProps | PopoverCloseProps, trigger = false): ButtonResult {
  const {
    asChild = false,
    children,
    className,
    type: _type,
    style: _style,
    dangerouslySetInnerHTML: _html,
    ...rest
  } = props as (PopoverTriggerProps | PopoverCloseProps) & ComponentPropsWithoutRef<'button'>;
  if (asChild && (!isValidElement(children) || Children.count(children) !== 1 || children.type === Fragment)) {
    throw new Error('Popover asChild requires a single named button-compatible element');
  }
  // Radix spreads consumer attributes after its relationships; never let that overwrite owned state.
  const native = { ...rest };
  if (trigger) {
    delete native['aria-controls'];
    delete native['aria-expanded'];
    delete native['aria-haspopup'];
  }
  return {
    buttonProps: { ...native, children, asChild, type: 'button', className: cn(popoverButtonVariants(), className) }
  };
}

export type UsePopoverContentResult = {
  children: PopoverContentProps['children'];
  contentProps: Omit<PopoverContentProps, 'label' | 'children'> & {
    'aria-label': string;
    'aria-modal': true | undefined;
    className: string;
    sideOffset: number;
    collisionPadding: number;
  };
};

/** Derive only modality, placement and classes; Radix owns all ids and focus/presence behavior. */
export function usePopoverContent(props: PopoverContentProps): UsePopoverContentResult {
  const modal = useContext(PopoverModalityContext);
  if (modal === undefined) {
    throw new Error('PopoverContent must be used within Popover');
  }
  const {
    children,
    label,
    side = 'bottom',
    align = 'start',
    className,
    id: _id,
    role: _role,
    'aria-label': _label,
    'aria-labelledby': _labelledBy,
    'aria-modal': _modal,
    tabIndex: _tabIndex,
    style: _style,
    dangerouslySetInnerHTML: _html,
    contentEditable: _editable,
    ...rest
  } = props as PopoverContentProps & ComponentPropsWithoutRef<'div'>;
  return {
    children,
    contentProps: {
      ...rest,
      ...placement,
      side,
      align,
      'aria-label': label,
      'aria-modal': modal ? true : undefined,
      className: cn(popoverContentVariants(), className)
    }
  };
}
