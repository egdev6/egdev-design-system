import * as AccessibleIconPrimitive from '@radix-ui/react-accessible-icon';
import type { FC } from 'react';
import type { IconProps } from './types';
import { useIcon } from './useIcon';

/** One inline glyph from the closed system set; decorative unless a label names it. */
export const Icon: FC<IconProps> = (props) => {
  const { svgProps, glyph, label } = useIcon(props);
  const svg = (
    <svg {...svgProps}>
      {glyph.map(({ key, element: Element, attributes }) => (
        <Element key={key} {...attributes} />
      ))}
    </svg>
  );
  return label ? <AccessibleIconPrimitive.Root label={label}>{svg}</AccessibleIconPrimitive.Root> : svg;
};
