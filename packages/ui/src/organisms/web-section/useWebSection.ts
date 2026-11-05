import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';
import { type WebSectionProps, webSectionVariants } from './types';

/** Keep slot order and protected native attributes independent of consumer content. */
export function useWebSection(props: WebSectionProps) {
  const {
    header,
    media,
    body,
    actions,
    social,
    className,
    children: _children,
    id: _id,
    role: _role,
    style: _style,
    dangerouslySetInnerHTML: _html,
    ...native
  } = props as WebSectionProps &
    Pick<ComponentPropsWithoutRef<'div'>, 'children' | 'id' | 'role' | 'style' | 'dangerouslySetInnerHTML'>;
  return {
    slots: [header, media, body, actions, social],
    rootProps: { ...native, className: cn(webSectionVariants(), className) }
  };
}
