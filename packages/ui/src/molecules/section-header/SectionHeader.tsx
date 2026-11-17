import type { FC } from 'react';
import { Divider } from '../../primitives/divider';
import { Heading, Text } from '../../primitives/text';
import type { SectionHeaderProps, SectionHeaderText } from './types';
import { useSectionHeader } from './useSectionHeader';

function renderText(value: SectionHeaderText) {
  return typeof value === 'string'
    ? value
    : value.map(([text, lang, decorative], index) => (
        <span key={`${index}:${text}`} lang={lang} aria-hidden={decorative ? 'true' : undefined}>
          {text}
        </span>
      ));
}

/** Passive editorial section introduction; the enclosing section owns its region name and Material. */
export const SectionHeader: FC<SectionHeaderProps> = (props) => {
  const {
    renderHeader,
    rootProps,
    headingProps,
    title,
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
          {typeof eyebrow === 'string' ? eyebrow : <span>{renderText(eyebrow)}</span>}
        </Text>
      )}
      {showRule && <Divider orientation='horizontal' decorative={true} className={ruleClassName} />}
      <Heading {...headingProps}>{title === undefined ? null : renderText(title)}</Heading>
      {lede && (
        <Text variant='lede' foreground='secondary' className={ledeClassName}>
          {renderText(lede)}
        </Text>
      )}
    </header>
  ) : null;
};
