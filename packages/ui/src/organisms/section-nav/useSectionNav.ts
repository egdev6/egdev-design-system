import type { MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { PixelState } from '../../atoms/pixel';
import { cn } from '../../lib/cn';
import {
  type SectionNavItem,
  type SectionNavProps,
  sectionNavLinkVariants,
  sectionNavListVariants,
  sectionNavNextVariants,
  sectionNavPillVariants,
  sectionNavRootVariants,
  sectionNavTriggerVariants
} from './types';

/** Derive host state and adapt Popover requests without taking over navigation. */
export function useSectionNav(props: SectionNavProps) {
  const {
    label,
    disclosureLabel,
    nextLabel,
    items,
    activeId,
    value,
    open,
    defaultOpen = false,
    onOpenChange,
    onNavigate,
    hidden,
    className,
    children: _children,
    role: _role,
    'aria-label': _label,
    'aria-labelledby': _labelled,
    dangerouslySetInnerHTML: _html,
    style: _style,
    ...rest
  } = props as SectionNavProps & React.ComponentPropsWithoutRef<'nav'>;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const currentOpen = open ?? uncontrolledOpen;
  const currentIndex = items.findIndex((item) => item.id === activeId);
  const current = items[currentIndex];
  const next = currentIndex < 0 ? undefined : items[(currentIndex + 1) % items.length];
  const navigation = useRef<{ target: string; previousFocus: Element | null } | null>(null);
  const requestOpen = (nextOpen: boolean) => {
    navigation.current = null;
    if (open === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };
  useEffect(() => {
    if (hidden && currentOpen) {
      if (open === undefined) {
        setUncontrolledOpen(false);
      }
      onOpenChange?.(false);
    }
  }, [hidden, currentOpen, open, onOpenChange]);
  const onIndexClick = (item: SectionNavItem, event: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.(item, event);
    if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      const pending = event.defaultPrevented
        ? null
        : { target: event.currentTarget.hash.slice(1), previousFocus: document.activeElement };
      requestOpen(false);
      navigation.current = pending;
    }
  };
  const onCloseAutoFocus = (event: Event) => {
    const pending = navigation.current;
    navigation.current = null;
    if (!pending) {
      return;
    }
    const focused = document.activeElement;
    const target = document.getElementById(pending.target);
    if (target && focused && focused !== pending.previousFocus && (target === focused || target.contains(focused))) {
      event.preventDefault();
    }
  };
  return {
    label,
    disclosureLabel,
    nextLabel,
    items,
    current,
    currentNumber: currentIndex + 1,
    rows: items.map((item, index) => ({
      item,
      number: index + 1,
      current: index === currentIndex ? ('location' as const) : undefined,
      state: (currentIndex < 0 || index > currentIndex
        ? 'idle'
        : index === currentIndex
          ? 'active'
          : 'past') as PixelState,
      onClick: (event: MouseEvent<HTMLAnchorElement>) => onIndexClick(item, event),
      onAuxClick: (event: MouseEvent<HTMLAnchorElement>) => {
        if (event.button === 1) {
          onNavigate?.(item, event);
        }
      }
    })),
    next,
    value,
    rootProps: {
      ...rest,
      hidden,
      'aria-label': label,
      className: cn(sectionNavRootVariants(), className, hidden && 'hidden')
    },
    popoverOpen: Boolean(currentOpen && !hidden && items.length),
    requestOpen,
    onCloseAutoFocus,
    onNextClick: (event: MouseEvent<HTMLAnchorElement>) => {
      if (next) {
        onNavigate?.(next, event);
      }
    },
    onNextAuxClick: (event: MouseEvent<HTMLAnchorElement>) => {
      if (next && event.button === 1) {
        onNavigate?.(next, event);
      }
    },
    pillClass: cn(sectionNavPillVariants()),
    triggerClass: cn(sectionNavTriggerVariants()),
    nextClass: cn(sectionNavNextVariants()),
    listClass: cn(sectionNavListVariants()),
    linkClass: cn(sectionNavLinkVariants())
  };
}
