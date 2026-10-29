import { Children, Fragment, type HTMLAttributes, isValidElement, type ReactElement, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import {
  type GaugeDockItemProps,
  type GaugeDockProps,
  type GaugeDockSeparatorProps,
  gaugeDockItemVariants,
  gaugeDockSeparatorVariants,
  gaugeDockVariants
} from './types';

type DivProps = HTMLAttributes<HTMLDivElement>;

/** Omit owned attributes entirely: even undefined props can override Radix defaults. */
function nativeLayoutProps(props: DivProps): DivProps {
  const {
    role: _role,
    tabIndex: _tabIndex,
    dangerouslySetInnerHTML: _html,
    children: _children,
    'aria-orientation': _orientation,
    ...rest
  } = props;
  return rest;
}
type RootResult = {
  rootProps: DivProps;
  orientation: 'horizontal' | 'vertical';
  dir: 'ltr' | 'rtl';
  children: ReactNode;
  empty: boolean;
};
type ItemResult = {
  itemProps: DivProps;
  gauge: GaugeDockItemProps['children'][0];
  action: ReactElement;
  disabled: boolean;
};

/** Fragments/arrays containing only empty nodes are empty too; no placeholder toolbar. */
function hasContent(children: ReactNode): boolean {
  return Children.toArray(children).some((child) =>
    isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment ? hasContent(child.props.children) : true
  );
}

/** Resolve layout, content and protected semantics; Radix owns all roving interaction. */
export function useGaugeDock({
  label,
  orientation = 'horizontal',
  dir = 'ltr',
  children,
  className,
  ...rest
}: GaugeDockProps): RootResult {
  return {
    rootProps: {
      ...nativeLayoutProps(rest),
      'aria-labelledby': undefined,
      'aria-label': label,
      className: cn(gaugeDockVariants(), className)
    },
    orientation,
    dir,
    children,
    empty: !hasContent(children)
  };
}

/** Keep the Gauge untouched and forward only the supplied action's explicit disabled flag. */
export function useGaugeDockItem({ children, className, ...rest }: GaugeDockItemProps): ItemResult {
  const [gauge, action] = children;
  const actionProps = action.props as { disabled?: boolean };
  return {
    itemProps: {
      ...nativeLayoutProps(rest),
      className: cn(gaugeDockItemVariants(), className)
    },
    gauge,
    action,
    disabled: actionProps.disabled === true
  };
}

/** Radix supplies the perpendicular orientation; the part is always decorative and hidden. */
export function useGaugeDockSeparator({ className, ...rest }: GaugeDockSeparatorProps): DivProps {
  return {
    ...nativeLayoutProps(rest),
    'aria-hidden': true,
    className: cn(gaugeDockSeparatorVariants(), className)
  };
}
