import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import {
  type ModuleRailLink,
  type ModuleRailProps,
  moduleRailVariants,
  railBodyVariants,
  railCurrentVariants,
  railDotVariants,
  railLinkVariants,
  railListVariants,
  railSeparatorVariants,
  railStoppedVariants
} from './types';

export function useModuleRail({
  label,
  items,
  endItems = [],
  product,
  onAdd,
  onNavigate,
  messages,
  className,
  ...native
}: ModuleRailProps) {
  const ref = useRef<HTMLElement>(null);
  const [side, setSide] = useState<'left' | 'right'>('right');
  useEffect(() => {
    const update = () => setSide(ref.current && getComputedStyle(ref.current).direction === 'rtl' ? 'left' : 'right');
    update();
    const observer = new MutationObserver(update);
    for (let node: HTMLElement | null = ref.current; node; node = node.parentElement) {
      observer.observe(node, { attributes: true, attributeFilter: ['dir', 'class', 'style'] });
    }
    return () => observer.disconnect();
  });
  const groups: ModuleRailLink[][] = [];
  let group: ModuleRailLink[] = [];
  for (const item of items) {
    if (item.kind === 'separator') {
      if (group.length) {
        groups.push(group);
      }
      group = [];
    } else {
      group.push(item);
    }
  }
  if (group.length) {
    groups.push(group);
  }
  const {
    role: _role,
    'aria-label': _label,
    'aria-labelledby': _labelledby,
    dangerouslySetInnerHTML: _html,
    ...safe
  } = native as typeof native & {
    role?: unknown;
    'aria-label'?: unknown;
    'aria-labelledby'?: unknown;
    dangerouslySetInnerHTML?: unknown;
  };
  return {
    ref,
    side,
    groups,
    endItems,
    product: product?.name.trim() ? product : undefined,
    onAdd,
    onNavigate,
    messages,
    rootProps: {
      ...safe,
      'aria-label': label,
      className: cn(
        surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }),
        moduleRailVariants(),
        className
      )
    },
    bodyClass: cn(railBodyVariants()),
    listClass: cn(railListVariants()),
    separatorClass: cn(railSeparatorVariants()),
    dotClass: cn(railDotVariants()),
    linkClass: (item: ModuleRailLink) =>
      cn(
        railLinkVariants(),
        item['aria-current'] === 'page' &&
          surfaceVariants({ tone: 'surface-3', elevation: 1, padding: 'none', radius: 'md' }),
        item['aria-current'] === 'page' && railCurrentVariants(),
        item.state === 'stopped' && item['aria-current'] !== 'page' && railStoppedVariants()
      )
  };
}
