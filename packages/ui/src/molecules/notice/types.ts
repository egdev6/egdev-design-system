import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';

/** Semantic status family; brand is not a message status. */
export type NoticeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/**
 * Persistent inline view state, not ephemeral feedback or a dismissible banner.
 * The root is the single announcement owner: do not nest live regions or duplicate the
 * message in another announcer. Keep a genuine non-empty status mounted for later updates;
 * initial populated status insertion does not promise speech. No ref or asChild API.
 * className supports outer margin, width and self-alignment only, merged last with cn;
 * tone, size and Material overrides are unsupported, not guaranteed by utility ordering.
 */
export type NoticeProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role'> & {
  /**
   * Required non-empty lead sentence, rendered first in strong; carries meaning without color.
   * Blank input warns in development and omits the strong element, not the whole notice.
   * @control text
   */
  summary: string;
  /**
   * Optional detail following the summary. Do not supply nested live regions.
   * @control false
   * @controlReason ReactNode is not serializable; see WithActions and MountedStatusUpdates.
   */
  children?: ReactNode;
  /**
   * Status tint and default icon; danger derives alert, all other tones derive status.
   * @default neutral
   * @control select
   */
  tone?: NoticeTone;
  /**
   * Compact preset for narrow panels or the standard inline message.
   * @default md
   * @control select
   */
  size?: 'md' | 'sm';
  /**
   * Decorative leading glyph replacing bell, alert or check derived from tone.
   * Null is unsupported: every notice needs its non-color icon cue.
   * @control false
   * @controlReason ReactNode is not serializable; see CustomIcon for a system glyph example.
   */
  icon?: ReactNode;
  /**
   * Optional trailing one or two system Button (sm, secondary/ghost) or Link elements.
   * Their handlers, routing and keyboard behavior stay consumer-owned. No dismissal API.
   * @control false
   * @controlReason ReactNode action elements are not serializable; see WithActions.
   */
  actions?: ReactNode;
  /**
   * Native live-region role override. Derived from tone when omitted; do not add a second
   * announcement owner or contradict its implicit live behavior with native ARIA overrides.
   * @control select
   */
  role?: 'status' | 'alert';
};

const noticeAppearanceVariants = cva(
  'relative flex flex-wrap items-center gap-3 px-4 py-3 font-sans text-fg-default bg-linear-to-b',
  {
    variants: {
      tone: {
        neutral: 'border-fg-secondary/30 from-fg-secondary/11 to-fg-secondary/4',
        info: 'border-status-info/30 from-status-info/11 to-status-info/4',
        success: 'border-status-success/30 from-status-success/11 to-status-success/4',
        warning: 'border-status-warning/30 from-status-warning/11 to-status-warning/4',
        danger: 'border-status-danger/30 from-status-danger/11 to-status-danger/4'
      },
      size: {
        md: 'text-body-default',
        sm: 'gap-2 px-3 py-2 rounded-md text-label-default'
      }
    },
    defaultVariants: { tone: 'neutral', size: 'md' }
  }
);

/**
 * Shared Notice/Toast appearance, composed without copying or filtering Surface classes.
 * A1 permits inherited eg-surface, but no Notice/Toast markers, roles or icon derivation.
 */
export function noticeVariants(options: VariantProps<typeof noticeAppearanceVariants> = {}): string {
  return cn(
    surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }),
    noticeAppearanceVariants(options)
  );
}

export const noticeIconVariants = cva('shrink-0', {
  variants: {
    tone: {
      neutral: 'text-fg-secondary',
      info: 'text-status-info',
      success: 'text-status-success',
      warning: 'text-status-warning',
      danger: 'text-status-danger'
    },
    size: { md: 'size-(--icon-size)', sm: 'size-4' }
  },
  defaultVariants: { tone: 'neutral', size: 'md' }
});

export const noticeTextVariants = cva('min-w-0 grow basis-[calc(var(--space-24)*2.5)]');
/** Reset legacy physical margin-left before applying the approved logical trailing alignment. */
export const noticeActionsVariants = cva('m-0 ms-auto flex gap-2');
