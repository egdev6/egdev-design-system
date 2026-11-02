import { type FC, Fragment } from 'react';
import { Icon } from '../../atoms/icon';
import type { TerminalCardBarProps, TerminalCardListProps, TerminalCardProps } from './types';
import { useTerminalCard, useTerminalCardBar, useTerminalCardList } from './useTerminalCard';

/** Passive named key/value terminal card; renders nothing without a non-empty label. */
export const TerminalCard: FC<TerminalCardProps> = (props) => {
  const { valid, rootProps, children } = useTerminalCard(props);
  if (!valid) {
    return null;
  }
  return <div {...rootProps}>{children}</div>;
};

/** Title bar with the decorative terminal glyph, the supplied path and an optional shell. */
export const TerminalCardBar: FC<TerminalCardBarProps> = (props) => {
  const bar = useTerminalCardBar(props);
  return (
    <div {...bar.rootProps}>
      <Icon {...bar.glyphProps} />
      <span {...bar.pathProps}>{bar.children}</span>
      {bar.shellText !== undefined && <span {...bar.shellProps}>{bar.shellText}</span>}
    </div>
  );
};

/** Ordered definition pairs as a two-column `dl`; carets stay decorative and unannounced. */
export const TerminalCardList: FC<TerminalCardListProps> = (props) => {
  const list = useTerminalCardList(props);
  return (
    <dl {...list.rootProps}>
      {list.rows.map((row) => (
        <Fragment key={row.key}>
          <dt {...row.termProps}>{row.term}</dt>
          <dd {...row.valueProps}>
            {row.value}
            {row.caretProps && <span {...row.caretProps} />}
          </dd>
        </Fragment>
      ))}
    </dl>
  );
};
