import type { FC } from 'react';
import { Chip } from '../../atoms/chip';
import { Link } from '../../atoms/link';
import { SectionHeader } from '../section-header';
import type { DetailHeaderProps } from './types';
import { useDetailHeader } from './useDetailHeader';

/** Opening block of a detail page: the heading block, then its facts, tags and external links. */
export const DetailHeader: FC<DetailHeaderProps> = (props) => {
  const result = useDetailHeader(props);
  if (!result.renderRoot) {
    return null;
  }
  const { rootProps, headingProps, metadata, tags, links } = result;
  return (
    <div {...rootProps}>
      <SectionHeader {...headingProps} />
      {metadata && (
        <dl {...metadata.listProps}>
          {metadata.entries.map((entry) => (
            <div key={entry.key} className={metadata.entryClassName}>
              <dt className={metadata.termClassName}>{entry.label}</dt>
              <dd className={metadata.valueClassName}>
                {entry.dateTime === undefined ? entry.value : <time dateTime={entry.dateTime}>{entry.value}</time>}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {tags && (
        <ul {...tags.listProps}>
          {tags.entries.map((entry) => (
            <li key={entry.key}>
              <Chip mode='static'>
                <span className={tags.labelClassName}>{entry.label}</span>
              </Chip>
            </li>
          ))}
        </ul>
      )}
      {links && (
        <ul {...links.listProps}>
          {links.entries.map((entry) => (
            <li key={entry.key} className={links.itemClassName}>
              <Link href={entry.href} external={true} newTabText={links.newTabText}>
                {entry.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
