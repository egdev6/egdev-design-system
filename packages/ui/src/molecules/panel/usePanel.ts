import { type ComponentPropsWithoutRef, createContext, type ReactNode, useContext } from 'react';
import { cn } from '@/lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import {
  type PanelBodyProps,
  type PanelProps,
  type PanelTone,
  type PanelVariant,
  panelBodyVariants,
  panelFooterVariants,
  panelHeaderVariants,
  panelVariants
} from './types';

type PanelPresentation = { tone: PanelTone; variant: PanelVariant };
type NativeProps = Omit<PanelBodyProps, 'children'>;
type ProtectedProps = {
  [Key in
    | 'style'
    | 'dangerouslySetInnerHTML'
    | 'contentEditable'
    | 'role'
    | 'tabIndex'
    | 'aria-label'
    | 'aria-labelledby'
    | 'aria-live'
    | 'aria-modal'
    | 'aria-disabled'
    | 'aria-selected'
    | 'aria-pressed'
    | 'ref'
    | 'asChild'
    | 'tone'
    | 'variant'
    | 'padding'
    | 'radius'
    | 'elevation']?: unknown;
};
type RootProps = NativeProps & { 'data-tone': PanelTone; 'data-variant': PanelVariant };
type FrameProps =
  | { tone: 'surface-1'; elevation: 1; padding: 'none'; radius: 'xl' }
  | { tone: 'overlay'; elevation?: never; padding: 'none'; radius: 'xl' };
type PanelResult = {
  presentation: PanelPresentation;
  unpainted: boolean;
  frameProps: FrameProps | undefined;
  rootProps: RootProps;
  children: ReactNode;
};

/** Internal presentation only; never host detection or application state. */
export const PanelContext = createContext<PanelPresentation | null>(null);

/** Strip protected semantics/appearance even at JavaScript boundaries. */
function passiveNativeProps(native: NativeProps): NativeProps {
  const {
    style: _style,
    dangerouslySetInnerHTML: _html,
    contentEditable: _editable,
    role: _role,
    tabIndex: _tabIndex,
    'aria-label': _label,
    'aria-labelledby': _labelledBy,
    'aria-live': _live,
    'aria-modal': _modal,
    'aria-disabled': _disabled,
    'aria-selected': _selected,
    'aria-pressed': _pressed,
    ref: _ref,
    asChild: _asChild,
    tone: _tone,
    variant: _variant,
    padding: _padding,
    radius: _radius,
    elevation: _elevation,
    ...rest
  } = native as NativeProps & ProtectedProps;
  return rest;
}

/** Normalize presentation, preserve safe native routing and select actual frame ownership. */
export function usePanel({
  children,
  tone = 'surface-1',
  variant = 'default',
  className,
  ...native
}: PanelProps): PanelResult {
  const effectiveTone = tone === 'overlay' || tone === 'inherit' ? tone : 'surface-1';
  const effectiveVariant = variant === 'banded' ? 'banded' : 'default';
  const frameProps: FrameProps | undefined =
    effectiveTone === 'inherit'
      ? undefined
      : effectiveTone === 'overlay'
        ? { tone: 'overlay', padding: 'none', radius: 'xl' }
        : { tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' };
  return {
    presentation: { tone: effectiveTone, variant: effectiveVariant },
    unpainted: effectiveTone === 'inherit',
    frameProps,
    rootProps: {
      ...passiveNativeProps(native),
      'data-tone': effectiveTone,
      'data-variant': effectiveVariant,
      className: cn(panelVariants({ tone: effectiveTone }), className)
    },
    children
  };
}

/** Resolve each native zone against only its nearest Panel's presentation. */
export function usePanelPart(
  part: 'header' | 'body' | 'footer',
  { children, className, ...native }: PanelBodyProps
): ComponentPropsWithoutRef<'div'> {
  const presentation = useContext(PanelContext);
  if (presentation === null) {
    throw new Error('Panel parts must be rendered inside Panel.');
  }
  const { tone, variant } = presentation;
  const banded = variant === 'banded' && part !== 'body';
  const bandTone =
    part === 'header'
      ? tone === 'surface-1'
        ? 'surface-2'
        : 'surface-3'
      : tone === 'surface-1'
        ? 'surface-0'
        : 'surface-1';
  const recipe =
    part === 'header'
      ? panelHeaderVariants(presentation)
      : part === 'footer'
        ? panelFooterVariants(presentation)
        : panelBodyVariants({ tone });
  return {
    ...passiveNativeProps(native),
    children,
    className: cn(
      banded && surfaceVariants({ tone: bandTone, elevation: 0, padding: 'none', radius: 'none' }),
      recipe,
      className
    )
  };
}
