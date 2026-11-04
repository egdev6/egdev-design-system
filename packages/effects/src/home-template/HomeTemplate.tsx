import type { HomeTemplateProps } from './types';
import { HomeTemplateContext, useHomeTemplate } from './useHomeTemplate';

/** A passive page frame for the HomeTemplate effect layers. */
export function HomeTemplate(props: HomeTemplateProps) {
  const shell = useHomeTemplate(props);
  return (
    <HomeTemplateContext.Provider value={shell.register}>
      <div {...shell.native} className={shell.rootClass}>
        <canvas aria-hidden='true' className={shell.ambientClass} style={shell.ambientStyle} />
        <div aria-hidden='true' className={shell.vignetteClass} />
        <canvas aria-hidden='true' className={shell.isotipoClass} style={shell.isotipoStyle} />
        <div className={shell.contentClass}>{shell.children}</div>
      </div>
    </HomeTemplateContext.Provider>
  );
}
