import type { FC } from 'react';
import type { TopBarPartProps, TopBarProps } from './types';
import { useTopBar, useTopBarPart } from './useTopBar';

/** Consumer-supplied named home link. */
export const TopBarBrand: FC<TopBarPartProps> = ({ children }) => <div {...useTopBarPart('brand')}>{children}</div>;
/** Full-width search launcher. */
export const TopBarSearchFull: FC<TopBarPartProps> = ({ children }) => <div {...useTopBarPart('full')}>{children}</div>;
/** Compact search launcher. */
export const TopBarSearchCompact: FC<TopBarPartProps> = ({ children }) => (
  <div {...useTopBarPart('compact')}>{children}</div>
);
/** Consumer-supplied account control. */
export const TopBarUserMenu: FC<TopBarPartProps> = ({ children }) => <div {...useTopBarPart('user')}>{children}</div>;
/** Consumer-supplied mobile dialog trigger. */
export const TopBarMobileTrigger: FC<TopBarPartProps> = ({ children }) => (
  <div {...useTopBarPart('mobile')}>{children}</div>
);

/** Fixed site navigation; the host owns state, routing, clearance and supplied controls. */
export const TopBar: FC<TopBarProps> = (props) => {
  const view = useTopBar(props, {
    brand: TopBarBrand,
    full: TopBarSearchFull,
    compact: TopBarSearchCompact,
    user: TopBarUserMenu,
    mobile: TopBarMobileTrigger
  });
  return (
    <header {...view.rootProps}>
      <div className={view.containerClassName}>
        <div className={view.rowClassName}>
          {view.slots.brand}
          <nav {...view.navProps}>
            <ul className={view.listClassName}>
              {view.items.map(({ item, props: anchorProps }) => (
                <li key={item.id}>
                  <a {...anchorProps}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          {view.slots.full}
          {view.slots.compact}
          {view.slots.user}
          {view.slots.mobile}
        </div>
      </div>
    </header>
  );
};
