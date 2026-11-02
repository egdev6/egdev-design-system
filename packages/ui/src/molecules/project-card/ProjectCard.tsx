import type { FC } from 'react';
import { Chip } from '../../atoms/chip';
import type { ProjectCardCodeProps, ProjectCardFooterProps, ProjectCardProps, ProjectCardTagsProps } from './types';
import { useProjectCard, useProjectCardCode, useProjectCardFooter, useProjectCardTags } from './useProjectCard';

/** Passive named project card: decorative index, eyebrow, generated heading and free body flow. */
export const ProjectCard: FC<ProjectCardProps> = (props) => {
  const {
    valid,
    rootProps,
    headingElement: Heading,
    headingProps,
    title,
    index,
    indexProps,
    eyebrow,
    eyebrowProps,
    children
  } = useProjectCard(props);
  return valid ? (
    <article {...rootProps}>
      {index !== null && <span {...indexProps}>{index}</span>}
      {eyebrow !== null && <span {...eyebrowProps}>{eyebrow}</span>}
      <Heading {...headingProps}>{title}</Heading>
      {children}
    </article>
  ) : null;
};

/** Ordered technology labels rendered as one static Chip per list item. */
export const ProjectCardTags: FC<ProjectCardTagsProps> = (props) => {
  const { listProps, items } = useProjectCardTags(props);
  return (
    <ul {...listProps}>
      {items.map((item, position) => (
        <li key={`${position}-${item}`}>
          <Chip mode='static'>{item}</Chip>
        </li>
      ))}
    </ul>
  );
};

/** Sample command block in a labelled mono well; passive text, never executable or focusable. */
export const ProjectCardCode: FC<ProjectCardCodeProps> = (props) => {
  const { preProps, lines, lineProps, glyphProps } = useProjectCardCode(props);
  return (
    <pre {...preProps}>
      {lines.map((line, position) => (
        <div key={`${position}-${line.text}`} {...lineProps(line)}>
          {line.kind !== 'comment' && <span {...glyphProps}>$ </span>}
          {line.text}
        </div>
      ))}
    </pre>
  );
};

/** Footer zone for the card's single supplied action; the card itself stays passive. */
export const ProjectCardFooter: FC<ProjectCardFooterProps> = (props) => {
  const { footProps, children } = useProjectCardFooter(props);
  return <div {...footProps}>{children}</div>;
};
