import type { FC } from 'react';
import type { HeadingProps } from './types';
import { useHeading } from './useHeading';

/**
 * Native h1–h6 display heading whose level is independent of its visual recipe,
 * with an optional trailing accent. Passive typography with no public ref.
 */
export const Heading: FC<HeadingProps> = (props) => {
  const { element: Element, children, accent, rootProps } = useHeading(props);
  return (
    <Element {...rootProps}>
      {children}
      {accent ? <span className={accent.className}>{accent.text}</span> : null}
    </Element>
  );
};

Heading.displayName = 'Heading';
