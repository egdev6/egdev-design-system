import { type ComponentPropsWithoutRef, type ReactNode, useId } from 'react';
import type { BadgeProps } from '../../atoms/badge';
import type { IconProps } from '../../atoms/icon';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import {
  type ModuleCardLevel,
  type ModuleCardProps,
  type ModuleCardStatus,
  moduleCardActionsVariants,
  moduleCardBodyVariants,
  moduleCardFootVariants,
  moduleCardHeadVariants,
  moduleCardIconVariants,
  moduleCardNameVariants,
  moduleCardStatusIconVariants,
  moduleCardVariants
} from './types';

type PartProps = { className: string };
export type UseModuleCardResult = {
  valid: boolean;
  rootProps: ComponentPropsWithoutRef<'article'> & {
    'data-state': ModuleCardStatus;
    'data-variant': 'default' | 'banded';
    'data-tone': 'surface-1' | 'overlay';
  };
  headingElement: `h${ModuleCardLevel}`;
  headingProps: PartProps & { id: string };
  title: string;
  headProps: PartProps;
  iconProps: PartProps & { 'aria-hidden': true };
  bodyProps: PartProps;
  actionsProps: PartProps;
  footProps: PartProps;
  badgeProps: Pick<BadgeProps, 'tone' | 'children'>;
  statusIconProps: IconProps;
  icon: ReactNode;
  children: ReactNode;
  actions: ReactNode;
  footer: ReactNode;
  showIcon: boolean;
  showActions: boolean;
  showFooter: boolean;
};

const present = (slot: ReactNode) => slot !== undefined && slot !== null && typeof slot !== 'boolean';
const phrase = (value: unknown, fallback: string) => (typeof value === 'string' && value.trim() ? value : fallback);
const statuses = {
  default: { tone: 'info', name: 'bell', key: 'defaultStatus', text: 'Ready' },
  error: { tone: 'danger', name: 'alert', key: 'errorStatus', text: 'Needs attention' },
  stopped: { tone: 'neutral', name: 'pause', key: 'stoppedStatus', text: 'Stopped' }
} as const;

/** Normalize presentation, name the article, resolve status text and compose each supported part. */
export function useModuleCard({
  title,
  level = 2,
  status = 'default',
  variant = 'default',
  tone = 'surface-1',
  icon,
  children,
  actions,
  footer,
  messages,
  className,
  ...native
}: ModuleCardProps): UseModuleCardResult {
  const headingId = useId();
  const valid = typeof title === 'string' && title.trim().length > 0;
  if ((typeof process === 'undefined' || process.env.NODE_ENV !== 'production') && !valid) {
    console.warn('ModuleCard requires a non-empty title. Nothing was rendered.');
  }
  const effectiveStatus = status === 'error' || status === 'stopped' ? status : 'default';
  const effectiveVariant = effectiveStatus !== 'stopped' && variant === 'banded' ? 'banded' : 'default';
  const effectiveTone = effectiveStatus !== 'stopped' && tone === 'overlay' ? 'overlay' : 'surface-1';
  const rank: ModuleCardLevel = [1, 2, 3, 4, 5, 6].includes(level) ? level : 2;
  const banded = effectiveVariant === 'banded';
  const statusContent = statuses[effectiveStatus];
  // Remove protected native semantics even at untyped/JavaScript boundaries.
  const {
    role: _role,
    tabIndex: _tabIndex,
    contentEditable: _editable,
    dangerouslySetInnerHTML: _html,
    'aria-label': _label,
    'aria-labelledby': _labelledBy,
    'aria-disabled': _disabled,
    'aria-selected': _selected,
    'aria-pressed': _pressed,
    'aria-live': _live,
    ref: _ref,
    ...rest
  } = native as typeof native & Record<string, unknown>;
  return {
    valid,
    rootProps: {
      ...rest,
      'aria-labelledby': headingId,
      'data-state': effectiveStatus,
      'data-variant': effectiveVariant,
      'data-tone': effectiveTone,
      className: cn(
        surfaceVariants({
          tone: effectiveTone,
          ...(effectiveTone === 'surface-1' ? { elevation: 1 } : {}),
          padding: 'none',
          radius: 'xl'
        }),
        moduleCardVariants(),
        className
      )
    },
    headingElement: `h${rank}`,
    headingProps: { id: headingId, className: cn(moduleCardNameVariants({ banded })) },
    title,
    headProps: {
      className: cn(
        banded &&
          surfaceVariants({
            tone: effectiveTone === 'overlay' ? 'surface-3' : 'surface-2',
            elevation: 0,
            padding: 'none',
            radius: 'none'
          }),
        moduleCardHeadVariants({ banded })
      )
    },
    iconProps: { className: cn(moduleCardIconVariants()), 'aria-hidden': true },
    bodyProps: { className: cn(moduleCardBodyVariants({ banded })) },
    actionsProps: { className: cn(moduleCardActionsVariants({ banded })) },
    footProps: {
      className: cn(
        banded &&
          surfaceVariants({
            tone: effectiveTone === 'overlay' ? 'surface-1' : 'surface-0',
            elevation: 0,
            padding: 'none',
            radius: 'none'
          }),
        moduleCardFootVariants({ banded })
      )
    },
    badgeProps: { tone: statusContent.tone, children: phrase(messages?.[statusContent.key], statusContent.text) },
    statusIconProps: { name: statusContent.name, className: cn(moduleCardStatusIconVariants()) },
    icon,
    children,
    actions,
    footer,
    showIcon: present(icon),
    showActions: present(actions),
    showFooter: present(footer)
  };
}
