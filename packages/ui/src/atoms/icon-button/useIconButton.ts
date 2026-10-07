import { cn } from '@/lib/cn';
import { type IconButtonProps, iconButtonVariants } from './types';

type UseIconButtonReturn = Omit<IconButtonProps, 'variant' | 'shape' | 'size' | 'pressed' | 'label'> & {
  asChild: boolean;
  ariaLabel: string;
  ariaPressed: boolean | undefined;
  className: string;
  type: NonNullable<IconButtonProps['type']>;
};

export const useIconButton = ({
  label,
  variant = 'ghost',
  shape = 'round',
  size = 'md',
  pressed,
  asChild = false,
  type = 'button',
  className,
  ...rest
}: IconButtonProps): UseIconButtonReturn => ({
  ...rest,
  asChild,
  type,
  ariaLabel: label,
  ariaPressed: pressed,
  className: cn(iconButtonVariants({ variant, shape, size }), className)
});
