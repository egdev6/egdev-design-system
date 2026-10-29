import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import type { FC } from 'react';
import { Badge } from '@/atoms/badge';
import { AspectRatio } from '@/primitives/aspect-ratio';
import type { SelectTileProps } from './types';
import { useSelectTile } from './useSelectTile';

/** Thumbnail choices with Radix-owned radio or toggle semantics and passive sibling captions. */
export const SelectTile: FC<SelectTileProps> = (props) => {
  const { root, items, ratio, mediaClass, fallbackClass } = useSelectTile(props);
  const content = (
    <>
      {items.map((item) => (
        <div key={item.key} {...item.cardProps}>
          <div className={mediaClass}>
            <AspectRatio ratio={ratio}>
              {item.imageProps ? (
                <img {...item.imageProps} />
              ) : (
                <span className={fallbackClass} aria-hidden='true'>
                  {item.label}
                </span>
              )}
            </AspectRatio>
            {item.badge && (
              <span {...item.badgeProps}>
                <Badge tone='brand' variant='solid'>
                  {item.badge}
                </Badge>
              </span>
            )}
          </div>
          <span {...item.labelProps}>{item.label}</span>
          {item.meta && <span {...item.metaProps}>{item.meta}</span>}
          {root.type === 'single' ? (
            <RadioGroupPrimitive.Item {...item.controlProps} />
          ) : (
            <ToggleGroupPrimitive.Item {...item.controlProps} />
          )}
        </div>
      ))}
    </>
  );
  return root.type === 'single' ? (
    <RadioGroupPrimitive.Root {...root.props}>{content}</RadioGroupPrimitive.Root>
  ) : (
    <ToggleGroupPrimitive.Root {...root.props}>{content}</ToggleGroupPrimitive.Root>
  );
};
