import * as SlotPrimitive from '@radix-ui/react-slot';
import { type ComponentPropsWithoutRef, cloneElement, type ReactElement } from 'react';
import { cn } from '@/lib/cn';
import { type IconButtonProps, iconButtonIconVariants, iconButtonVariants } from './types';

type IconElementProps = { className?: string };
type ChildProps = ComponentPropsWithoutRef<'button'>;
type IconButtonResult = {
  rootComponent: 'button' | typeof SlotPrimitive.Root;
  asChild: boolean;
  label: string;
  icon: ReactElement;
  children: ReactElement | undefined;
  rootProps: ComponentPropsWithoutRef<'button'> & { 'data-disabled': '' | undefined };
};

/** Select the host, token recipes and disabled guards without replacing native keyboard behavior. */
export function useIconButton({
  label,
  icon,
  variant = 'ghost',
  size = 'md',
  asChild = false,
  disabled = false,
  type = 'button',
  children,
  className,
  onClick,
  onKeyDown,
  ...rest
}: IconButtonProps): IconButtonResult {
  // Slot normally invokes child handlers first. Disabled composition must guard that child too.
  const child = children as ReactElement<ChildProps> | undefined;
  const guardedChild =
    asChild && disabled && child
      ? cloneElement(child, {
          'aria-disabled': true,
          tabIndex: -1,
          onClick: (event) => event.preventDefault(),
          onKeyDown: (event) => event.preventDefault()
        })
      : children;
  const glyph = icon as ReactElement<IconElementProps>;
  return {
    rootComponent: asChild ? SlotPrimitive.Root : 'button',
    asChild,
    label,
    icon: cloneElement(glyph, {
      className: cn(glyph.props.className, iconButtonIconVariants({ size, variant }))
    }),
    children: guardedChild,
    rootProps: {
      ...rest,
      type: asChild ? undefined : type,
      disabled: asChild ? undefined : disabled,
      'aria-disabled': asChild && disabled ? true : rest['aria-disabled'],
      tabIndex: asChild && disabled ? -1 : rest.tabIndex,
      'data-disabled': disabled ? '' : undefined,
      className: cn(iconButtonVariants({ variant, size }), className),
      onClick: (event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      },
      onKeyDown: (event) => {
        if (asChild && disabled) {
          event.preventDefault();
          return;
        }
        onKeyDown?.(event);
      }
    }
  };
}
