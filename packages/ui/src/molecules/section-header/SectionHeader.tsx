import type { FC } from 'react';
import { Divider } from '../../primitives/divider';
import { Heading, Text } from '../../primitives/text';
import type { SectionHeaderProps } from './types';
import { useSectionHeader } from './useSectionHeader';

/** Passive editorial section introduction; the enclosing section owns its region name and Material. */
export const SectionHeader: FC<SectionHeaderProps> = (props) => {
  const {
    renderHeader,
    rootProps,
    headingProps,
    eyebrow,
    lede,
    showRule,
    eyebrowClassName,
    ledeClassName,
    ruleClassName
  } = useSectionHeader(props);
  return renderHeader ? (
    <header {...rootProps}>
      {eyebrow && (
        <Text variant='eyebrow' className={eyebrowClassName}>
          {eyebrow}
        </Text>
      )}
      {showRule && <Divider orientation='horizontal' decorative={true} className={ruleClassName} />}
      <Heading {...headingProps} />
      {lede && <p className={ledeClassName}>{lede}</p>}
    </header>
  ) : null;
};
