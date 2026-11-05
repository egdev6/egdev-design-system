import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { AppShellMessages } from '../app-shell';

/** Structural page frame. The supplied content must not contain another main landmark. */
export type WebTemplateProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'content' | 'role' | 'style' | 'dangerouslySetInnerHTML'
> & {
  /** Consumer page header; nullish values omit the clearance host.
   * @control false
   * @controlReason ReactNode content is not serializable; see the Full story.
   */
  topBar?: ReactNode;
  /** Content of the owned main landmark, without another main.
   * @control false
   * @controlReason ReactNode content is not serializable; see the Full story.
   */
  content: ReactNode;
  /** Consumer footer rendered without another wrapper.
   * @control false
   * @controlReason ReactNode content is not serializable; see the Full story.
   */
  footer?: ReactNode;
  /** Localized skip link text; omitted entries use Skip to content.
   * @control false
   * @controlReason Structured message dictionary is not serializable; see the Localized story.
   */
  messages?: AppShellMessages;
};
export const webTemplateVariants = cva('eg-web-template');
export const webTemplateTopBarVariants = cva('min-h-[var(--nav-height)]');
