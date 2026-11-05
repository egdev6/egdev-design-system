import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Passive section anatomy; the host owns the section landmark, heading ID and layout. */
export type WebSectionProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'id' | 'role' | 'style' | 'dangerouslySetInnerHTML'
> & {
  /** Consumer introduction and heading.
   * @control false
   * @controlReason ReactNode content cannot be serialized; see the Full story.
   */
  header?: ReactNode;
  /** Consumer media, including interactive media.
   * @control false
   * @controlReason ReactNode content cannot be serialized; see the Full story.
   */
  media?: ReactNode;
  /** Consumer section content.
   * @control false
   * @controlReason ReactNode content cannot be serialized; see the Full story.
   */
  body?: ReactNode;
  /** Consumer actions.
   * @control false
   * @controlReason ReactNode content cannot be serialized; see the Full story.
   */
  actions?: ReactNode;
  /** Consumer social content.
   * @control false
   * @controlReason ReactNode content cannot be serialized; see the Full story.
   */
  social?: ReactNode;
};

export const webSectionVariants = cva('eg-web-section');
