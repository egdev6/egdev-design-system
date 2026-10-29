import type * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type ComponentPropsWithoutRef, useId, useState } from 'react';
import { cn } from '@/lib/cn';
import { surfaceVariants } from '@/primitives/surface';
import { type SelectTileProps, type SelectTileRatio, selectTileVariants } from './types';

const ratios: Record<SelectTileRatio, number> = {
  landscape: 16 / 9,
  portrait: 4 / 5,
  story: 9 / 16,
  square: 1,
  wide: 3,
  banner: 4
};

type Root =
  | { type: 'single'; props: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> }
  | { type: 'multiple'; props: ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & { type: 'multiple' } };

type Item = {
  key: string;
  label: string;
  meta: string | undefined;
  badge: string | undefined;
  cardProps: { className: string; 'data-state': 'live' | 'idle'; 'data-disabled': '' | undefined };
  labelProps: { id: string; className: string };
  metaProps: { id: string; className: string };
  badgeProps: { id: string; className: string };
  controlProps: {
    value: string;
    disabled: boolean;
    className: string;
    'aria-labelledby': string;
    'aria-describedby': string | undefined;
  };
  imageProps: { src: string; alt: ''; className: string; onError: () => void } | undefined;
};

type UseSelectTileResult = {
  root: Root;
  items: Item[];
  ratio: number;
  mediaClass: string;
  fallbackClass: string;
};

/** Derives parts and per-source media failures; Radix alone owns selection, focus and keyboard. */
export function useSelectTile({
  label,
  options,
  ratio = 'landscape',
  disabled = false,
  dir = 'ltr',
  className,
  ...selection
}: SelectTileProps): UseSelectTileResult {
  const id = useId();
  const [failedSources, setFailedSources] = useState<ReadonlySet<string>>(() => new Set());
  const rootProps = {
    'aria-label': label,
    orientation: 'horizontal' as const,
    loop: true,
    disabled,
    dir,
    className: cn(selectTileVariants.root(), className)
  };
  let root: Root;
  if (selection.type === 'single') {
    const { type: _type, ...rest } = selection;
    root = { type: 'single', props: { ...rest, ...rootProps } };
  } else {
    root = { type: 'multiple', props: { ...selection, ...rootProps, role: 'group' } };
  }
  return {
    root,
    ratio: ratios[ratio],
    mediaClass: cn(surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }), selectTileVariants.media()),
    fallbackClass: cn(selectTileVariants.fallback()),
    items: options.map((option, index) => {
      const labelId = `${id}-${index}-label`;
      const metaId = `${id}-${index}-meta`;
      const badgeId = `${id}-${index}-badge`;
      const meta = option.meta?.trim() ? option.meta : undefined;
      const badge = option.badge?.trim() ? option.badge : undefined;
      const itemDisabled = disabled || (option.disabled ?? false);
      const sourceKey = JSON.stringify([option.value, option.thumb?.src]);
      const showImage = option.thumb !== undefined && !failedSources.has(sourceKey);
      return {
        key: option.value,
        label: option.label,
        meta,
        badge,
        cardProps: {
          className: cn(
            surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }),
            selectTileVariants.card()
          ),
          'data-state': option.live ? 'live' : 'idle',
          'data-disabled': itemDisabled ? '' : undefined
        },
        labelProps: { id: labelId, className: cn(selectTileVariants.label()) },
        metaProps: { id: metaId, className: cn(selectTileVariants.meta()) },
        badgeProps: { id: badgeId, className: cn(selectTileVariants.badge()) },
        controlProps: {
          value: option.value,
          disabled: itemDisabled,
          className: cn(selectTileVariants.control()),
          'aria-labelledby': labelId,
          'aria-describedby': [meta && metaId, badge && badgeId].filter(Boolean).join(' ') || undefined
        },
        imageProps:
          showImage && option.thumb
            ? {
                src: option.thumb.src,
                alt: '',
                className: cn(selectTileVariants.image()),
                onError: () => setFailedSources((previous) => new Set(previous).add(sourceKey))
              }
            : undefined
      };
    })
  };
}
