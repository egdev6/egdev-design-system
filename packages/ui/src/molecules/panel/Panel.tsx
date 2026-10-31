import type { FC } from 'react';
import { Surface } from '../../primitives/surface';
import type { PanelBodyProps, PanelFooterProps, PanelHeaderProps, PanelProps } from './types';
import { PanelContext, usePanel, usePanelPart } from './usePanel';

/** Passive compound content with explicit frame ownership, never a landmark or control. */
export const Panel: FC<PanelProps> = (props) => {
  const { presentation, unpainted, frameProps, rootProps, children } = usePanel(props);
  return (
    <PanelContext.Provider value={presentation}>
      {unpainted ? (
        <div {...rootProps}>{children}</div>
      ) : (
        <Surface {...rootProps} {...frameProps}>
          {children}
        </Surface>
      )}
    </PanelContext.Provider>
  );
};

/** Supplied identity/context, without generated heading semantics. */
export const PanelHeader: FC<PanelHeaderProps> = (props) => {
  const partProps = usePanelPart('header', props);
  return <div {...partProps} />;
};

/** Transparent main-content zone; controls retain their native or Radix behavior. */
export const PanelBody: FC<PanelBodyProps> = (props) => {
  const partProps = usePanelPart('body', props);
  return <div {...partProps} />;
};

/** Supplied supplementary metadata/utility zone, not a footer landmark. */
export const PanelFooter: FC<PanelFooterProps> = (props) => {
  const partProps = usePanelPart('footer', props);
  return <div {...partProps} />;
};
