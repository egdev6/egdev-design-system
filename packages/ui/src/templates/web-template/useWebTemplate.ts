import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import { useId, useRef } from 'react';
import { cn } from '../../lib/cn';
import { appShellVariants } from '../app-shell';
import { type WebTemplateProps, webTemplateTopBarVariants, webTemplateVariants } from './types';

/** Derive the skip target, nullish slot presence and protected root props. */
export function useWebTemplate(props: WebTemplateProps) {
  const {
    topBar,
    content,
    footer,
    messages,
    className,
    children: _children,
    role: _role,
    style: _style,
    dangerouslySetInnerHTML: _html,
    ...native
  } = props as WebTemplateProps &
    Pick<ComponentPropsWithoutRef<'div'>, 'children' | 'role' | 'style' | 'dangerouslySetInnerHTML'>;
  const mainId = useId();
  const mainRef = useRef<HTMLElement>(null);
  const onSkipClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    mainRef.current?.focus();
  };
  return {
    topBar,
    content,
    footer,
    mainId,
    mainRef,
    onSkipClick,
    skipLabel: messages?.skipToContent ?? 'Skip to content',
    rootProps: { ...native, className: cn(webTemplateVariants(), className) },
    skipClass: cn(appShellVariants.skip()),
    skipLinkClass: cn(appShellVariants.skipLink()),
    topBarClass: cn(webTemplateTopBarVariants())
  };
}
