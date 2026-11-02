import type * as TogglePrimitive from '@radix-ui/react-toggle';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { type ChipMode, type ChipProps, chipIconVariants, chipVariants } from './types';

type ToggleRootProps = ComponentPropsWithoutRef<typeof TogglePrimitive.Root>;

type ChipParts = {
  iconProps: { className: string; 'aria-hidden': true };
  icon: ReactNode;
  showIcon: boolean;
  children: ReactNode;
};

type ChipResult =
  | ({ mode: 'toggle'; rootProps: ToggleRootProps } & ChipParts)
  | ({ mode: 'static'; rootProps: ComponentPropsWithoutRef<'span'> } & ChipParts)
  | ({ mode: 'link'; rootProps: ComponentPropsWithoutRef<'a'>; external: boolean; newTabText: string } & ChipParts);

/** Runtime shape accepted per mode; cross-mode props are stripped, never forwarded. */
type ChipInput = {
  children?: ReactNode;
  icon?: ReactNode;
  mode?: string;
  className?: string;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  href?: string;
  external?: boolean;
  newTabText?: string;
  target?: string;
  rel?: string;
  asChild?: unknown;
  type?: unknown;
  role?: unknown;
  'aria-pressed'?: unknown;
  'data-state'?: unknown;
  [key: string]: unknown;
};

const chipModes: readonly ChipMode[] = ['toggle', 'static', 'link'];

const isChipMode = (value: unknown): value is ChipMode =>
  typeof value === 'string' && (chipModes as readonly string[]).includes(value);

/**
 * Resolves the declared mode, strips every prop that belongs to another mode and composes the
 * per-mode classes; keyboard, focus and pressed state stay in Radix for the toggle only.
 */
export function useChip(props: ChipProps): ChipResult {
  const {
    children,
    icon,
    mode: declaredMode,
    className,
    pressed,
    defaultPressed = false,
    onPressedChange,
    disabled,
    href,
    external = false,
    newTabText = '(opens in a new tab)',
    target,
    rel,
    asChild: _asChild,
    type: _type,
    role: _role,
    'aria-pressed': _ariaPressed,
    'data-state': _dataState,
    ...rest
  } = props as ChipInput;
  const mode: ChipMode = isChipMode(declaredMode) ? declaredMode : 'toggle';
  const parts: ChipParts = {
    iconProps: { className: cn(chipIconVariants()), 'aria-hidden': true },
    icon,
    showIcon: icon !== undefined && icon !== null && typeof icon !== 'boolean',
    children
  };
  if (mode === 'static') {
    return {
      mode,
      rootProps: { ...(rest as ComponentPropsWithoutRef<'span'>), className: cn(chipVariants({ mode }), className) },
      ...parts
    };
  }
  if (mode === 'link') {
    const safeRel = external
      ? [...new Set([rel, 'noopener noreferrer'].filter(Boolean).join(' ').split(/\s+/).filter(Boolean))].join(' ')
      : rel;
    return {
      mode,
      rootProps: {
        ...(rest as ComponentPropsWithoutRef<'a'>),
        href,
        target: external ? '_blank' : target,
        rel: safeRel,
        className: cn(chipVariants({ mode }), className)
      },
      external,
      newTabText,
      ...parts
    };
  }
  return {
    mode: 'toggle',
    rootProps: {
      ...(rest as ToggleRootProps),
      defaultPressed,
      onPressedChange,
      pressed,
      disabled,
      className: cn(chipVariants({ mode }), className)
    },
    ...parts
  };
}
