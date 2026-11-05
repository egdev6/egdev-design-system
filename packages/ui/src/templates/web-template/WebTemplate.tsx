import type { FC } from 'react';
import { Button } from '../../atoms/button';
import type { WebTemplateProps } from './types';
import { useWebTemplate } from './useWebTemplate';

/** Structural page frame with a single main landmark and skip link. */
export const WebTemplate: FC<WebTemplateProps> = (props) => {
  const page = useWebTemplate(props);
  return (
    <div {...page.rootProps}>
      <div className={page.skipClass}>
        <Button variant='secondary' asChild={true} className={page.skipLinkClass}>
          <a href={`#${page.mainId}`} onClick={page.onSkipClick}>
            {page.skipLabel}
          </a>
        </Button>
      </div>
      {page.topBar != null && <div className={page.topBarClass}>{page.topBar}</div>}
      <main id={page.mainId} ref={page.mainRef} tabIndex={-1}>
        {page.content}
      </main>
      {page.footer}
    </div>
  );
};
