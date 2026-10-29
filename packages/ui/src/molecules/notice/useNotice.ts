import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { useEffect } from 'react';
import type { IconName, IconSize } from '../../atoms/icon';
import { cn } from '../../lib/cn';
import type { NoticeProps } from './types';
import { noticeActionsVariants, noticeIconVariants, noticeTextVariants, noticeVariants } from './types';

type UseNoticeResult = {
  rootProps: ComponentPropsWithoutRef<'div'> & {
    role: 'status' | 'alert';
    className: string;
    'data-tone': NoticeProps['tone'];
    'data-size': NoticeProps['size'];
  };
  summary: string | undefined;
  children: ReactNode;
  icon: ReactNode;
  iconName: IconName;
  iconSize: IconSize;
  actions: ReactNode;
  showActions: boolean;
  iconClassName: string;
  textClassName: string;
  actionsClassName: string;
};

/** Derive passive semantics, default glyph, blank-summary warning and per-part composition. */
export function useNotice({
  summary,
  children,
  tone = 'neutral',
  size = 'md',
  icon,
  actions,
  role,
  className,
  ...rest
}: NoticeProps): UseNoticeResult {
  const hasSummary = summary.trim().length > 0;
  useEffect(() => {
    if (!hasSummary && (typeof process === 'undefined' || process.env.NODE_ENV !== 'production')) {
      console.warn('Notice: summary must contain non-whitespace content.');
    }
  }, [hasSummary]);

  return {
    rootProps: {
      ...rest,
      role: role ?? (tone === 'danger' ? 'alert' : 'status'),
      'data-tone': tone,
      'data-size': size,
      className: cn('eg-notice', noticeVariants({ tone, size }), className)
    },
    summary: hasSummary ? summary : undefined,
    children,
    icon,
    iconName: tone === 'success' ? 'check' : tone === 'warning' || tone === 'danger' ? 'alert' : 'bell',
    iconSize: size === 'sm' ? 'sm' : 'md',
    actions,
    showActions: actions != null && actions !== false,
    iconClassName: cn(noticeIconVariants({ tone, size })),
    textClassName: cn('eg-notice__text', noticeTextVariants()),
    actionsClassName: cn('eg-notice__actions', noticeActionsVariants())
  };
}
