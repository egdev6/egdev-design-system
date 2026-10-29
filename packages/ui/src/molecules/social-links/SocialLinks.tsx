import type { FC } from 'react';
import { IconButton } from '../../atoms/icon-button';
import { Cluster } from '../../primitives/stack';
import type { SocialLinksProps } from './types';
import { useSocialLinks } from './useSocialLinks';

/** Ordered social profile destinations with optional visible contextual copy. */
export const SocialLinks: FC<SocialLinksProps> = (props) => {
  const {
    layout: Layout,
    layoutProps,
    rootProps,
    listProps,
    gap,
    caption,
    captionClassName,
    itemClassName,
    items
  } = useSocialLinks(props);
  return items.length === 0 ? null : (
    <Layout {...layoutProps}>
      <div {...rootProps}>
        {caption !== undefined && <p className={captionClassName}>{caption}</p>}
        <Cluster asChild={true} gap={gap}>
          <ul {...listProps}>
            {items.map((item) => (
              <li key={item.id} className={itemClassName}>
                <IconButton {...item.buttonProps}>
                  <a {...item.anchorProps} />
                </IconButton>
              </li>
            ))}
          </ul>
        </Cluster>
      </div>
    </Layout>
  );
};
